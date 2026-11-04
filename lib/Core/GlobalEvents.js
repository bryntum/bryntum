import Base from './Base.js';
import Events from './mixin/Events.js';
import DomHelper from './helper/DomHelper.js';
import BrowserHelper from './helper/BrowserHelper.js';
import Rectangle from './helper/util/Rectangle.js';

/**
 * @module Core/GlobalEvents
 */
const
    activeTouches          = new Map(),
    // Allow an unsteady finger to jiggle by this much
    longpressMoveThreshold = 5,
    isFloatingWidget       = w => w.floating,
    longPressCancelEvents  = {
        touchend  : 1,
        pointerup : 1
    },
    ignoreModifierKeys     = {
        Meta    : 1,
        Control : 1,
        Alt     : 1,
        Shift   : 1
    },
    onPointerUp = event => {
        if (currentPointerDown?.pointerId === event.pointerId) {
            currentPointerDown = null;
        }
    },
    trackTouches = event => {
        const { touches } = event;

        // We don't use pointer events to track active touch points because pointerup can be sent even if the touch
        // is still active. Root cause not yet established. Touch events are not affected.
        activeTouches.clear();

        if (touches) {
            for (let i = 0; i < touches.length; i++) {
                const touch = touches.item(i);
                activeTouches.set(touch.identifier, [touch, event]);
            }
        }
    },
    hasZoomOnMouseWheel = w => w.zoomOnMouseWheel,
    GlobalEvents = new (class GlobalEventsHandler extends Base.mixin(Events) {
        suspendFocusEvents() {
            focusEventsSuspended = true;
        }

        resumeFocusEvents() {
            focusEventsSuspended = false;
        }

        setupFocusListenersOnce(EventHelper, rootElement) {
            if (rootElement && !GlobalEvents.observedElements.has(rootElement)) {
                GlobalEvents.setupFocusListeners(EventHelper, rootElement);
                GlobalEvents.observedElements.add(rootElement);
                DomHelper.syncColorScheme(rootElement);
            }
        }

        detachFocusListeners(rootElement) {
            if (rootElement.$globalEventsDetacher) {
                rootElement.$globalEventsDetacher();
                rootElement.$globalEventsDetacher = null;
                GlobalEvents.observedElements.delete(rootElement);
            }
        }

        // This is imported by EventHelper and that makes the call to set up the listeners
        // `detach` argument is required to not setup more listeners than we need to. In case of salesforce we include floatroot
        // inside the webcomponent element and thus don't need default listeners on document. In regular webcomponents demo we
        // don't need to do it, because with multiple components on one page that would force us to make more complex lookups.
        setupFocusListeners(EventHelper, element = document, detach = false) {
            let lastPinchPos;

            const listeners = {
                element,
                fromGlobal : true,
                touchstart(touchstart) {
                    const { touches : ct } = touchstart;

                    trackTouches(touchstart);
                    lastPinchPos = null;

                    // If we have two touchpoints, both inside a Widget with zoomOnMouseWheel, prevent default pinch-zooming
                    // Use may use three touches to scale the viewport, so only block when two touches.
                    if (ct.length === 2) {
                        const widget = GlobalEvents.Widget.fromElement(ct[0].target)?.closest(hasZoomOnMouseWheel);

                        if (widget && GlobalEvents.Widget.fromElement(ct[1].target)?.closest(hasZoomOnMouseWheel) === widget) {
                            lastPinchPos = [ct[0], ct[1]];
                            touchstart.preventDefault();
                        }
                    }

                    if (!globalTouchStart && touchstart.changedTouches.length === 1) {
                        globalTouchStart = touchstart.changedTouches[0];
                        if (!BrowserHelper.isAndroid) {
                            // On single touch start, set up a timer so that a longpress results in a
                            // synthesized contextmenu event being injected into the target element.
                            const
                                // This is what gets called if the user moves their touchpoint,
                                // or releases the touch before <longPressTime>ms is up
                                onMoveOrPointerUp = ({ clientX, clientY, type }) => {
                                    // globalTouchStart gets set to null on second touchstart, use that to abort the longpress
                                    if (longPressCancelEvents[type] || !globalTouchStart || Math.max(Math.abs(clientX - globalTouchStart.clientX), Math.abs(clientY - globalTouchStart.clientY)) > longpressMoveThreshold) {
                                        contextMenuTouchId = null;
                                        touchMoveRemover();
                                        clearTimeout(tapholdTimer);
                                    }
                                },
                                // Touchmove or touchend before that timer fires cancels the timer and removes these listeners.
                                touchMoveRemover = EventHelper.on({
                                    element     : document,
                                    touchmove   : onMoveOrPointerUp,
                                    touchend    : onMoveOrPointerUp,
                                    pointermove : onMoveOrPointerUp,
                                    pointerup   : onMoveOrPointerUp,
                                    capture     : true
                                }),
                                tapholdTimer = setTimeout(() => {
                                    // The global touchend listener prevents a touchend from proceeding
                                    // to a click if it was used to trigger contextmenu
                                    contextMenuTouchId = globalTouchStart.identifier;

                                    // Remove the gesture cancelling listeners
                                    touchMoveRemover();

                                    touchstart.target.dispatchEvent(new MouseEvent('contextmenu', EventHelper.copyEvent({}, touchstart)));
                                }, EventHelper.longPressTime);
                        }
                    }
                    else {
                        globalTouchStart = null;
                    }
                },
                touchmove : {
                    passive : false,
                    handler : (touchMove) =>  {
                        const
                            { touches : ct } = touchMove,
                            widget           = GlobalEvents.Widget.fromElement(ct[0]?.target)?.closest(hasZoomOnMouseWheel);

                        // If we have two touchpoints, check for pinch-zoom.
                        if (ct.length === 2 && lastPinchPos) {
                            const
                                pinchPos    = [ct[0], ct[1]],
                                pinchCenter = [
                                    (pinchPos[0].clientX + pinchPos[1].clientX) / 2,
                                    (pinchPos[0].clientY + pinchPos[1].clientY) / 2
                                ],
                                pinchTarget = DomHelper.elementFromPoint(pinchCenter[0], pinchCenter[1]);

                            // If we have a lastPinchPos, we can compare to see if the distance has changed
                            if (pinchTarget && lastPinchPos) {
                                const
                                    pinch  = {
                                        clientX : pinchCenter[0],
                                        clientY : pinchCenter[1],
                                        bubbles : true
                                    },
                                    delta  = EventHelper.getDistanceBetween(lastPinchPos[0], lastPinchPos[1]) - EventHelper.getDistanceBetween(pinchPos[0], pinchPos[1]),
                                    deltaX = Math.abs(lastPinchPos[0].clientX - lastPinchPos[1].clientX) - Math.abs(pinchPos[0].clientX - pinchPos[1].clientX),
                                    deltaY = Math.abs(lastPinchPos[0].clientY - lastPinchPos[1].clientY) - Math.abs(pinchPos[0].clientY - pinchPos[1].clientY);

                                // If we are within a widget that has zoomOnMouseWheel set then
                                // inject a wheel event with ctrlKey true to simulate a zoom gesture.
                                if (widget && GlobalEvents.Widget.fromElement(ct[1].target)?.closest(hasZoomOnMouseWheel)) {
                                    touchMove.preventDefault();
                                    touchMove.stopImmediatePropagation();
                                    if (Math.abs(delta) > 2) {
                                        const e = new MouseEvent('wheel', { ...pinch, [BrowserHelper.ctrlKey] : true });
                                        e.deltaY = deltaY;
                                        e.deltaX = deltaX;
                                        pinchTarget.dispatchEvent(e);
                                    }
                                }

                                // Inject a generic bryntum-pinch event for any listeners interested in pinch gestures
                                const e = new MouseEvent('bryntum-pinch', pinch);
                                e.deltaY = deltaY;
                                e.deltaX = deltaX;
                                e.touchMove = touchMove;
                                pinchTarget.dispatchEvent(e);
                            }
                            lastPinchPos = pinchPos;
                        }
                    }
                },
                // Just this one has to be passive: false so that we are allowed to preventDefault
                // if we are part of a contextmenu longpress emulation. Otherwise the gesture will
                // proceed to cause a mousedown event.
                touchend : {
                    passive : false,
                    handler : domEvent => {
                        trackTouches(domEvent);
                        lastPinchPos = null;

                        // Stop pinch-zoom tracking when touch count not two.
                        if (domEvent.touches.length !== 2) {
                            lastPinchPos = null;
                        }
                        if (globalTouchStart) {
                            // If the touchstart was used to synthesize a contextmenu event
                            // stop the touch gesture processing right now.
                            // Also prevent the conversion of the touch into click.
                            if (domEvent.changedTouches[0].identifier === contextMenuTouchId) {
                                domEvent.stopImmediatePropagation();
                                if (domEvent.cancelable !== false) {
                                    domEvent.preventDefault();
                                }
                            }
                            else if (domEvent.changedTouches.length === 1 && domEvent.changedTouches[0].identifier === globalTouchStart.identifier) {
                                GlobalEvents.trigger('globaltap', { domEvent });
                            }
                            globalTouchStart = null;
                        }
                    }
                },
                touchcancel : {
                    passive : false,
                    handler : trackTouches
                },
                mousedown : {
                    handler : domEvent => {
                        lastInteractionType = 'mouse';
                        if (!globalTouchStart) {
                            GlobalEvents.trigger('globaltap', { domEvent });
                        }
                        currentMouseDown = domEvent;
                        // If no keydown is catched, and the mouse down has modifier key. Add a fake key event.
                        const hasModifierKey = domEvent.ctrlKey || domEvent.altKey || domEvent.shiftKey || domEvent.metaKey;
                        if (!currentKeyDown && hasModifierKey) {
                            currentKeyDown = new KeyboardEvent('keydown', {
                                key : domEvent.ctrlKey ? 'Control'
                                    : (domEvent.shiftKey ? 'Shift'
                                        : (domEvent.altKey ? 'Alt' : 'Meta')),
                                ctrlKey  : domEvent.ctrlKey,
                                altKey   : domEvent.altKey,
                                shiftKey : domEvent.shiftKey,
                                metaKey  : domEvent.metaKey
                            });
                        }
                        else if (currentKeyDown && !hasModifierKey) {
                            currentKeyDown = null;
                        }
                    },
                    passive : false
                },
                mouseup : {
                    handler : event => {
                        GlobalEvents.trigger('mouseup', { event });
                        currentMouseDown = null;
                    },
                    passive : false
                },
                pointerdown : {
                    passive : false,
                    handler : event => {
                        currentPointerDown = event;

                        // Remove keyboard flag if last user action used pointer
                        // Moved this from EventHelper, need to be once per root to support nested widgets
                        DomHelper.setUsingKeyboard(element, false);
                    }
                },
                pointerup : {
                    passive : false,
                    handler : onPointerUp
                },
                pointercancel : {
                    passive : false,
                    handler : onPointerUp
                },
                keydown : {
                    passive : false,
                    handler : ev => {
                        const { key, target } = ev;

                        lastInteractionType = 'key';
                        currentKeyDown = ev;
                        currentOverElement = target;

                        // Flag root if last user action used keyboard, used for focus styling etc.
                        // Moved this from EventHelper, need to be once per root to support nested widgets
                        if (!ignoreModifierKeys[key]) {

                            // if shadow root, add to outer children (the shadow root itself lacks a classList)
                            if (element.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                                for (const node of element.children) {
                                    if (node.matches('.b-outer')) {
                                        DomHelper.setUsingKeyboard(node, true);
                                    }
                                }
                            }
                            else {
                                DomHelper.setUsingKeyboard(element, true);
                            }

                            // ESC will hide any tooltip.
                            if (key === 'Escape') {
                                GlobalEvents.Widget.queryAll(w => w.isTooltip && w.isVisible).forEach(w => w.hide());
                            }

                            // W3C WAI-ARIA Authoring Practices 1.2, §Keyboard Interaction:
                            // "Shift + F10: Opens a context menu for the currently focused element."
                            // Browsers do not natively fire a `contextmenu` event for Shift+F10 on
                            // arbitrary elements (only on editable/input elements in some browsers).
                            // We synthesize one here so that all Bryntum widgets respond uniformly
                            // to the keyboard-invoked context menu regardless of element type.
                            // https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
                            if (key === 'F10' && ev.shiftKey) {
                                const
                                    rect   = Rectangle.from(target),
                                    center = rect.center;

                                target.dispatchEvent(new MouseEvent('contextmenu', {
                                    button     : 2,
                                    buttons    : 2,
                                    bubbles    : true,
                                    cancelable : true,
                                    clientX    : center.x,
                                    clientY    : center.y
                                }));
                                ev.preventDefault();
                            }
                        }
                    }
                },
                mouseenter(ev) {
                    currentOverElement = ev.target;
                },
                keypress() {
                    lastInteractionType = 'key';
                },
                keyup() {
                    currentKeyDown = null;
                },
                focusin(focusin) {
                    const
                        { Widget } = GlobalEvents,
                        { target } = focusin;

                    // If target focused via keyboard, or other accessible means, and not in a destroyed zone
                    // then convert that to a pointerover event on the inner element.
                    // check for PointerEvent added as a fix for https://github.com/bryntum/bryntum/issues/10598
                    // Skip when mouse is down - focus caused by a click (even with modifier keys like SHIFT)
                    // should not trigger synthetic pointerover (https://github.com/bryntum/bryntum/issues/12724)
                    if (BrowserHelper.supportsPointerEvents && !currentMouseDown && target?.matches(':focus-visible') && !bryntum.fromElement(target, e => e.isDestroying || e.isDestroyed)) {
                        const
                            // Attempt to target the inner element of events because Scheduler
                            // focuses the wrap, but the tooltip's forSelector is the inner .b-sch-event
                            pointerTarget = target.matches('[class*=event-wrap],[class*=task-wrap]') ? target.firstElementChild : target,
                            rect          = Rectangle.from(pointerTarget),
                            center        = rect.center;

                        // Drill into the element that's at the center of the focused element if possible.
                        // The activation PointerEvent has a pointerType property of 'focus' which
                        // the event processing can use to detect that it is an "accessible" pointerover.
                        pointerTarget.dispatchEvent(new PointerEvent('pointerover', {
                            bubbles     : true,
                            clientX     : center.x,
                            clientY     : center.y,
                            pointerType : 'focus'
                        }));
                    }

                    // Firing the pointerOver event above may have consequences
                    if (focusEventsSuspended || (target && !target.isConnected)) {
                        return;
                    }

                    const
                        fromElement     = !focusin.relatedTarget
                            ? null
                            : (focusin.relatedTarget instanceof HTMLElement ? focusin.relatedTarget : document.body),
                        toElement       = target || document.body,
                        fromWidget      = Widget.fromElement(fromElement),
                        toWidget        = Widget.fromElement(toElement),
                        commonAncestor  = DomHelper.getCommonAncestor(fromWidget, toWidget || toElement),
                        // Flag if the fromElement is DOCUMENT_POSITION_FOLLOWING toElement
                        backwards       = Boolean(fromElement && (toElement.compareDocumentPosition(fromElement) & 4)),
                        topVisibleModal = Widget.query(isTopVisibleModal);

                    let currentFocus = null;

                    if (toElement && toElement !== document.body) {
                        currentFocus = DomHelper.getActiveElement(toElement);
                    }
                    else {
                        currentFocus = DomHelper.getActiveElement(document);
                    }

                    // If there is a topmost modal that is not actively reverting focus, and the focus is moving to
                    // somewhere *not* a descendant of that modal, and that somewhere is not in a floater that us
                    // *above* that modal (the compareDocumentPosition call), then we enforce modality and sweep focus
                    // back into the modal.
                    // By default, the Container class will yield the first focusable descendant widget's focusEl as its
                    // focusEl, so that will be out of the box behaviour for Popups.
                    if (topVisibleModal && !topVisibleModal._isRevertingFocus) {
                        if (!toWidget || (!topVisibleModal.owns(toWidget) && !(topVisibleModal.element.compareDocumentPosition(toWidget.element) & 4 && toWidget.up(isFloatingWidget)))) {
                            return topVisibleModal.focus();
                        }
                    }

                    let event = createWidgetEvent('focusout', fromElement, target, fromWidget, toWidget, backwards);

                    // Bubble focusout event up the "from" side of the tree
                    for (let targetWidget = fromWidget, owner; targetWidget && targetWidget !== commonAncestor; targetWidget = owner) {
                        // Capture before any focus out handling is done. It may be manipulated.
                        owner = targetWidget.owner;

                        if (!targetWidget.isDestroying && targetWidget.onFocusOut) {
                            targetWidget.onFocusOut(event);

                            // It is possible for focusout handlers to refocus themselves (editor's invalidAction='block'), so
                            // check if the focus is still where it was when we started unless we are in a document
                            // loss of focus situation (no target)
                            if (target && currentFocus !== DomHelper.getActiveElement(target)) {
                                // If the focus has moved, that movement would have kicked off a nested sequence of focusin/out
                                // notifications, so everyone has already been notified... no more to do here.
                                return;
                            }
                        }
                    }

                    // Focus is moving upwards to the ancestor widget.
                    // Its focus method might delegate focus to a focusable descendant.
                    if (commonAncestor && target === commonAncestor.element) {
                        // If one of the handlers above has not moved focus onwards
                        // and the common ancestor is a container which delegates
                        // focus inwards to a descendant, then give it the opportunity to do that.
                        if (!commonAncestor.isDestroying && DomHelper.getActiveElement(commonAncestor) === toElement && commonAncestor.focusElement && commonAncestor.focusElement !== commonAncestor.element) {
                            // If focus is not inside, move focus inside
                            if (!commonAncestor.element.contains(currentFocus) || commonAncestor.focusDescendant) {
                                // Wait until out of the focusin handler to move focus on.
                                commonAncestor.setTimeout(() => commonAncestor.focus?.(), 0);
                            }
                        }
                    }
                    // Focus is moving between two branches of a subtree.
                    // Bubble focusin event up the "to" side of the tree
                    else {
                        event = createWidgetEvent('focusin', toElement, fromElement, fromWidget, toWidget, backwards);
                        for (let targetWidget = toWidget; targetWidget && targetWidget !== commonAncestor; targetWidget = targetWidget.owner) {
                            // Focus may not logically enter destroyed or detached widgets.
                            if (!targetWidget.isDestroying && targetWidget.element?.isConnected) {
                                targetWidget.onFocusIn?.(event);
                            }
                        }
                    }

                    // Fire element focusmove event. Grid navigation will use  this when cells are focusable.
                    const commonAncestorEl = DomHelper.getCommonAncestor(fromElement?.nodeType === Element.ELEMENT_NODE ? fromElement : null, toElement) || toElement.parentNode;

                    // Common ancestor may be null is salesforce
                    // https://github.com/bryntum/bryntum/issues/4865
                    if (commonAncestorEl) {
                        event = createWidgetEvent('focusmove', toElement, fromElement, fromWidget, toWidget, backwards, { bubbles : true });
                        commonAncestorEl.dispatchEvent(event);
                    }
                },
                focusout(focusout) {
                    if (focusEventsSuspended) {
                        return;
                    }

                    // When using tinyMCE as inline editor, an untrusted `focusout` event without `relatedTarget` is
                    // dispatched on dropdown or menu close. Salesforce specific code should then not be executed.
                    if (focusout.target.classList.contains('tox-tinymce-aux') && !focusout.isTrusted) {
                        return;
                    }

                    const
                        relatedTarget = focusout.relatedTarget,
                        targetRoot    = focusout.target.getRootNode?.(),
                        relatedRoot   = relatedTarget?.getRootNode?.(),

                        // Check if relatedTarget is missing, not a Widget, or both are shadow roots but not the same
                        isDifferentShadowRoot = (targetRoot?.nodeType === Node.DOCUMENT_FRAGMENT_NODE ||
                                                relatedRoot?.nodeType === Node.DOCUMENT_FRAGMENT_NODE) &&
                                                targetRoot !== relatedRoot;

                    if (
                        !relatedTarget ||
                        !GlobalEvents.Widget.fromElement(relatedTarget) ||
                        isDifferentShadowRoot
                    ) {
                        // In Salesforce, relatedTarget might not be an HTMLElement when switching tabs
                        const target = relatedTarget instanceof HTMLElement ? relatedTarget : null;

                        listeners.focusin({
                            target,
                            relatedTarget : focusout.target
                        });

                        currentKeyDown = null;
                        currentMouseDown = null;
                    }
                },
                // This will clear keydown and mousedown status on window blur
                blur : {
                    element : globalThis,
                    handler(event) {
                        if (event.target === globalThis) {
                            currentKeyDown = null;
                            currentMouseDown = null;
                        }
                    }
                },
                capture : true,
                passive : true
            };

            // detach previous listeners
            detach && detacher?.();

            detacher = this.detachEvents = element.$globalEventsDetacher = EventHelper.on(listeners);
        }

        get activeTouchCount() {
            return activeTouches.size;
        }

        get activeTouches() {
            return Array.from(activeTouches.values());  // [ [touch, event], ... ]
        }

        get hasActiveTouches() {
            return activeTouches.size > 0;
        }

        get lastInteractionType() {
            return lastInteractionType;
        }

        get shiftKeyDown() {
            return Boolean(currentKeyDown?.shiftKey);
        }

        get ctrlKeyDown() {
            return Boolean(currentKeyDown?.ctrlKey || currentKeyDown?.metaKey);
        }

        get altKeyDown() {
            return Boolean(currentKeyDown?.altKey);
        }

        get currentOverElement() {
            return currentOverElement;
        }

        isKeyDown(key) {
            return !key ? Boolean(currentKeyDown) : (currentKeyDown?.key === key || currentKeyDown[key?.toLowerCase() + 'Key'] === true);
        }

        isMouseDown(button = 0) {
            return currentMouseDown?.button === button;
        }

        get currentMouseDown() {
            return currentMouseDown;
        }

        set currentMouseDown(m) {
            currentMouseDown = m;
        }

        get currentPointerDown() {
            return currentPointerDown;
        }

        set currentPointerDown(p) {
            currentPointerDown = p;
        }

        get currentTouch() {
            return globalTouchStart;
        }

        set currentTouch(t) {
            globalTouchStart = t;
        }

        get currentKeyDown() {
            return currentKeyDown;
        }

        set currentKeyDown(k) {
            currentKeyDown = k;
        }

    })(),
    isTopVisibleModal = w => w.isTopModal;

GlobalEvents.observedElements = new Set();

/**
 * Fired after global CSS changes, for two kinds of change:
 *
 * - **The theme stylesheet changes**, through {@link Core.helper.DomHelper#function-setTheme-static DomHelper.setTheme()} or
 *   {@link Core.helper.DomHelper#function-themeChange-static DomHelper.themeChange()} called without arguments.
 *   `theme` and `prev` usually differ, and `colorScheme` and `mode` are absent
 * - **The light/dark colour scheme changes**, through the
 *   {@link Core.helper.DomHelper#property-colorScheme-static DomHelper.colorScheme} setter, a change of the system
 *   preference, or `DomHelper.themeChange({ colorScheme : true })`. `theme` equals `prev`, and `colorScheme` and
 *   `mode` are present
 *
 * Check for `mode` to tell them apart:
 *
 * ```javascript
 * GlobalEvents.on({
 *     theme(event) {
 *         if ('mode' in event) {
 *             // Light/dark switch, the stylesheet is unchanged
 *         }
 *         else {
 *             // The theme stylesheet changed
 *         }
 *     }
 * });
 * ```
 *
 * @event theme
 * @param {Core.GlobalEvents} source
 * @ts-param source {typeof GlobalEvents}
 * @param {String} theme The new theme name
 * @param {String} [prev] The previous theme name
 * @param {'light'|'dark'|null} [colorScheme] On a light/dark switch, the applied scheme, or `null` where the system
 * preference or the theme default decides (the page declares both modes or neither)
 * @param {'light'|'dark'} [mode] On a light/dark switch, the mode rendered after the change
 */

/**
 * Fired when {@link Core.helper.DomHelper#property-scrollBarWidth-static DomHelper.scrollBarWidth} changes, when
 * scrollbars are toggled on the platform at runtime. Also fired when it is measured after reporting `0` while the
 * document was not rendered, for example in an iframe which is `display:none`, even if the measured width is `0`.
 * Runtime changes are only detected where `ResizeObserver` is available
 * @event scrollBarWidthChange
 * @param {Core.GlobalEvents} source
 * @ts-param source {typeof GlobalEvents}
 * @param {Number} scrollBarWidth The measured scrollbar width
 * @param {Number} [oldScrollBarWidth] The previous scrollbar width. Not available when measured after the document was
 * not rendered
 * @internal
 */

let globalTouchStart,
    contextMenuTouchId,
    focusEventsSuspended = false,
    lastInteractionType,
    currentKeyDown,
    currentMouseDown,
    currentPointerDown,
    currentOverElement,
    detacher;

function createWidgetEvent(eventName, target, relatedTarget, fromWidget, toWidget, backwards, options) {
    const result = new CustomEvent(eventName, options);

    // Workaround for Salesforce. They use strict mode and define non-configurable property `target`. We use this
    // CustomEvent as a synthetic one, feels fine to use non-standard handle for target.
    Object.defineProperties(result, {
        _target : {
            value : target
        },
        relatedTarget : {
            value : relatedTarget
        }
    });
    result.fromWidget = fromWidget;
    result.toWidget = toWidget;
    result.backwards = backwards;

    return result;
}

const watchZoom = () => {
    // We create a media query for the current pixel ratio
    const mediaQuery = globalThis.matchMedia(`(resolution: ${globalThis.devicePixelRatio}dppx)`);

    if (BrowserHelper.isSafari) {
        let zoomRatio = document.documentElement.clientWidth / globalThis.innerWidth;
        globalThis.addEventListener('resize', e => {
            const newZoomRatio = document.documentElement.clientWidth / globalThis.innerWidth;

            if (newZoomRatio !== zoomRatio) {
                zoomRatio = newZoomRatio;
                GlobalEvents.trigger('zoomChange');
            }
        });
    }
    else {
        // This listener fires when the zoom level changes
        mediaQuery.addEventListener('change', () => {
            // Pixel ratio changed - reset the cached scrollbar width so it is remeasured at the new zoom level
            DomHelper.resetScrollBarWidth();

            /**
             * Fired when the browser zoom level is changed by the user
             * @event zoomChange
             * @param {Core.GlobalEvents} source
             * @ts-param source {typeof GlobalEvents}
             */
            GlobalEvents.trigger('zoomChange');

            // We must re-run the watcher to track the *new* ratio
            watchZoom();
        }, { once : true });
    }
};

watchZoom();

/**
 * A singleton that fires global application-level events such as theme changes and focus transitions. It also tracks
 * the current interaction type (mouse, keyboard, or touch) and the active pointer state. Listen for events using the
 * standard {@link Core.mixin.Events} API.
 *
 * ```javascript
 * GlobalEvents.on({
 *    theme({ theme }) {
 *        // react to theme changes here
 *    }
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Core.mixin.Events} - The event handling mixin
 *
 * @class
 * @singleton
 * @mixes Core/mixin/Events
 */
export default GlobalEvents;
