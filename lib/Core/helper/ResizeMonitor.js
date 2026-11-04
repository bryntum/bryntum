/* globals ResizeObserver: true */
import DomHelper, { hasLayout } from './DomHelper.js';
import AsyncHelper from './AsyncHelper.js';

DomHelper.loadStylesheet('Core/helper/ResizeMonitor.css');

// import Stylesheet from './ResizeMonitor.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ResizeMonitor');

let resizeFireTimer = null;

const
    resizedQueue = [],
    isAbsolutelyPositioned = n => n.nodeType === n.ELEMENT_NODE && n.ownerDocument.defaultView?.getComputedStyle(n).getPropertyValue('position') === 'absolute';

/**
 * @module Core/helper/ResizeMonitor
 */

/**
 * Allows size monitoring of elements (or optionally a Window instance).
 *
 * ```javascript
 * ResizeMonitor.addResizeListener(
 *   myElement,
 *   element => {
 *      console.log(element, ' changed size');
 *   }
 * );
 * ```
 *
 * @internal
 */
export default class ResizeMonitor {
    /**
     * Resize event handing callback
     * @callback ResizeMonitorEventCallback
     * @param {HTMLElement} element Resized element
     * @param {DOMRectReadOnly} oldRect Old size rectangle
     * @param {DOMRectReadOnly} newRect New size rectangle
     */
    /**
     * Adds a resize listener to the passed element which is called when the element
     * is resized by layout.
     * @param {HTMLElement|Document} element The element to listen for resizing.
     * @param {ResizeMonitorEventCallback} handler The handling function. Will be passed the element.
     * @param {Boolean} [immediate=false] Pass `true` to have the handler called immediately when a resize is detected.
     * The default is `false` to defer the call using a microtask (to batch multiple resize events).
     */
    static addResizeListener(element, handler, immediate = false) {
        const me = this;

        if (element === document || element === globalThis) {
            element = document.body;
        }

        if (element.nodeType === element.DOCUMENT_FRAGMENT_NODE) {
            element = element.host;
        }

        if (!element.classList.contains('b-resize-monitored')) {
            element.classList.add('b-resize-monitored');
            element._bResizemonitor = new Map();
        }

        // If we're looking at the document body, use a window resize listener.
        if (element === document.body) {
            if (!me.hasWindowResizeListener) {
                globalThis.addEventListener('resize', me.onWindowResize);
                me.hasWindowResizeListener = true;
            }
        }
        // Regular element - use ResizeObserver by preference
        else if (globalThis.ResizeObserver) {
            if (!me.resizeObserver) {
                me.resizeObserver = new ResizeObserver(me.onElementResize);
            }
            me.resizeObserver.observe(element);
        }
        // Polyfill ResizeObserver
        else {
            element.classList.add('b-no-resize-observer');

            const [monitors, expand, shrink] = DomHelper.createElement({
                parent        : element,
                className     : 'b-resize-monitors',
                retainElement : true,
                children      : [{
                    className : 'b-resize-monitor-expand'
                }, {
                    className : 'b-resize-monitor-shrink'
                }]
            }, { returnAll : true });

            expand.scrollLeft = expand.scrollTop = shrink.scrollLeft = shrink.scrollTop = 1000000;
            expand.addEventListener('scroll', me.onSizeMonitorScroll, true);
            shrink.addEventListener('scroll', me.onSizeMonitorScroll, true);
            // Scroll sensors are inert while not rendered, the CSS animation restarts when the element becomes rendered
            monitors.addEventListener('animationstart', me.onSizeMonitorAnimation);
            monitors.addEventListener('animationend', me.onSizeMonitorAnimation);

            // Also need to fake a resize-scroll on DOM mutation
            (handler.targetMutationMonitor = new MutationObserver((m) => {
                const
                    addedNodes   = [],
                    removedNodes = [];

                // MutationObserver may report a mutation which consists of removing a node and adding it back again.
                // We need to filter such nodes
                for (const mr of m) {
                    if (mr.type === 'childList') {
                        addedNodes.push.apply(addedNodes, mr.addedNodes);
                        removedNodes.push.apply(removedNodes, mr.removedNodes);
                    }
                }

                const changedNodes = [
                    ...addedNodes.filter(r => !removedNodes.includes(r)),
                    ...removedNodes.filter(r => !addedNodes.includes(r))
                ];

                if (changedNodes.length === 0) {
                    return;
                }

                // If the changed nodes were absolutely positioned, then they won't
                // cause a resize, so return
                if (changedNodes.length > 0 && changedNodes.every(isAbsolutelyPositioned)) {
                    return;
                }

                // We only want the size monitor listener to trigger, so this event must NOT bubble
                // to any application or other framework listeners.
                expand.dispatchEvent(new CustomEvent('scroll', { bubbles : false }));
            })).observe(element, {
                childList : true,
                subtree   : true
            });

            // store reference for easier cleanup later
            handler.monitorElement = monitors;
        }
        element._bResizemonitor.set(handler, { immediate });
    }

    /**
     * Removes a resize listener from the passed element.
     * @param {HTMLElement|Document} element The element to listen for resizing.
     * @param {Function} handler The handling function to remove.
     */
    static removeResizeListener(element, handler) {
        if (element) {
            if (element === document || element === globalThis) {
                element = document.body;
            }
            const { _bResizemonitor } = element;

            _bResizemonitor?.delete(handler);

            // Down to no listeners.
            if (!_bResizemonitor?.size) {
                element.classList.remove('b-resize-monitored');

                if (this.resizeObserver) {
                    this.resizeObserver.unobserve(element);
                }
                // Remove the polyfill resize listeners
                else {
                    // remove any added elements
                    if (handler.monitorElement) {
                        handler.monitorElement.remove();
                        handler.monitorElement = null;
                    }
                    // remove the DOM mutation observer
                    if (handler.targetMutationMonitor) {
                        handler.targetMutationMonitor.disconnect();
                    }
                }
            }
        }
    }

    /**
     * Event handler for deferred processing of ResizeMonitor entries. Prevents recursive
     * calls during the same microtask, that would cause multiple resize events for a single resize.
     * Fix for https://github.com/bryntum/bryntum/issues/7373
     *
     * If it is necessary to execute a ResizeObserver entry immediately, e.g. when the ResizeMonitor needs to be set up
     * with an initial Rectangle in a `paint` event listener with `firstPaint : true`,
     * use `ResizeMonitor.processElementResize(entries)` directly.
     *
     * @param {ResizeObserverEntry[]} entries
     * @private
     */
    static onElementResize(entries) {
        const
            immediateEntries = [],
            deferredEntries  = [];

        // Extract immediate and deferred entries so that some can be processed now and some later
        for (const resizeObserverEntry of entries) {
            const
                resizedElement      = resizeObserverEntry.target,
                { _bResizemonitor } = resizedElement;

            // Can be undefined on TC in Safari, not reproducible locally
            if (_bResizemonitor) {
                for (const [, { immediate }] of _bResizemonitor.entries()) {
                    if (immediate) {
                        immediateEntries.push(resizeObserverEntry);
                    }
                    else {
                        deferredEntries.push(resizeObserverEntry);
                    }
                }
            }
        }
        AsyncHelper.queueMicrotask(() => ResizeMonitor.processElementResize(deferredEntries));
        ResizeMonitor.processElementResize(immediateEntries);
    }

    /**
     * Undeferred processing of ResizeMonitor entries.
     *
     * @param {ResizeObserverEntry[]} entries
     * @private
     */
    static processElementResize(entries) {
        for (const resizeObserverEntry of entries) {
            const
                resizedElement = resizeObserverEntry.target,
                resizeMonitor  = resizedElement._bResizemonitor,
                newRect        = resizeObserverEntry.contentRect || resizedElement.getBoundingClientRect();

            if (hasLayout(resizedElement)) {
                if (!resizeMonitor.rectangle || newRect.width !== resizeMonitor.rectangle.width || newRect.height !== resizeMonitor.rectangle.height) {
                    const oldRect = resizeMonitor.rectangle;
                    resizeMonitor.rectangle = newRect;
                    for (const resizeHandler of resizeMonitor.keys()) {
                        resizeHandler(resizedElement, oldRect, newRect);
                    }
                }
            }
        }
    }

    static onSizeMonitorScroll(e) {
        // If no body exists or the element has gone, ignore the event; the listener will be removed automatically.
        if (e.target.isConnected || document.body?.contains(e.target)) {
            e.stopImmediatePropagation();

            ResizeMonitor.checkMonitoredSize(e.target.parentNode);
        }
    }

    /**
     * Handles the polyfill monitor's CSS animation, which restarts when the element becomes rendered.
     * Checks the size on `animationstart`, and keeps both events from reaching application listeners.
     *
     * @param {AnimationEvent} e The `animationstart` or `animationend` event
     * @private
     */
    static onSizeMonitorAnimation(e) {
        if (e.target === e.currentTarget) {
            e.stopPropagation();

            if (e.type === 'animationstart') {
                ResizeMonitor.checkMonitoredSize(e.target);
            }
        }
    }

    /**
     * Queues a resize notification if the monitored element's size changed, then re-arms the scroll sensors.
     *
     * @param {HTMLElement} monitorNode The `.b-resize-monitors` element
     * @private
     */
    static checkMonitoredSize(monitorNode) {
        const
            resizedElement = monitorNode.parentNode,
            resizeMonitor  = resizedElement._bResizemonitor,
            newRect        = resizedElement.getBoundingClientRect();

        if (!resizeMonitor.rectangle || newRect.width !== resizeMonitor.rectangle.width || newRect.height !== resizeMonitor.rectangle.height) {
            resizedQueue.push([resizedElement, resizeMonitor.rectangle, newRect]);
            resizeMonitor.rectangle = newRect;
            if (!resizeFireTimer) {
                resizeFireTimer = requestAnimationFrame(ResizeMonitor.fireResizeEvents);
            }
        }
        monitorNode.firstChild.scrollLeft = monitorNode.firstChild.scrollTop = monitorNode.childNodes[1].scrollTop = monitorNode.childNodes[1].scrollLeft = 1000000;
    }

    static onWindowResize() {
        const
            resizedElement = document.body,
            resizeMonitor  = resizedElement._bResizemonitor,
            oldRect        = resizeMonitor.rectangle;

        resizeMonitor.rectangle = document.documentElement.getBoundingClientRect();

        for (const resizeHandler of resizeMonitor.keys()) {
            resizeHandler(resizedElement, oldRect, resizeMonitor.rectangle);
        }
    }

    static fireResizeEvents() {
        for (const resizedEntry of resizedQueue) {
            for (const resizeHandler of resizedEntry[0]._bResizemonitor.keys()) {
                // Checking offsetParent to avoid resizing of elements which are not visible or exist in DOM
                if (resizedEntry[0].offsetParent) {
                    resizeHandler.apply(this, resizedEntry);
                }
            }
        }
        resizeFireTimer = null;
        resizedQueue.length = 0;
    }

    static removeGlobalListeners() {
        globalThis.removeEventListener('resize', this.onWindowResize);
    }
}
