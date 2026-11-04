import Base from '../../Base.js';
import DomHelper from '../DomHelper.js';
import EventHelper from '../EventHelper.js';
import Delayable from '../../mixin/Delayable.js';
import Rectangle from '../util/Rectangle.js';

/**
 * @module Core/helper/mixin/DragHelperTranslate
 */

const noScroll = { pageXOffset : 0, pageYOffset : 0 };

/**
 * Mixin for DragHelper that handles repositioning (translating) an element within its container
 *
 * @mixin
 * @private
 */
export default Target => class DragHelperTranslate extends Delayable(Target || Base) {
    static $name = 'DragHelperTranslate';

    static configurable = {
        positioning : null,

        // Private config that disables updating elements position, for when data is live updated during drag,
        // leading to element being redrawn
        skipUpdatingElement : null
    };

    //region Init

    /**
     * Initialize translation drag mode.
     * @private
     */
    initTranslateDrag() {
        const me = this;

        if (!me.isElementDraggable && me.targetSelector) {
            me.isElementDraggable = element => element.closest(me.targetSelector);
        }
    }

    //endregion

    //region Grab, update, finish

    /**
     * Grab an element which can be moved using translation.
     * @private
     * @param {Object} event Event object
     * @returns {Boolean}
     */
    grabTranslateDrag(event) {
        const element = this.getTarget(event);

        if (element) {
            this.context = {
                valid        : true,
                element,
                position     : DomHelper.getStyleValue(element, 'position'),
                startPageX   : event.pageX,
                startPageY   : event.pageY,
                startClientX : event.clientX,
                startClientY : event.clientY
            };

            return true;
        }

        return false;
    }

    getTarget(event) {
        const { targetSelector, target } = this;
        if (targetSelector) {
            return event.target.closest(targetSelector);
        }

        const element = target.isWidget ? target.element : target;
        return element.contains(event.target) ? element : null;
    }

    getX(element) {
        if (this.positioning === 'absolute') {
            // Read left style rather than offsetLeft as it is impacted by margin-inline-start style (Gantt milestones)
            return parseFloat(element.style.left, 10);
        }
        if (this.positioning === 'inset') {
            return parseFloat(getComputedStyle(element).insetInlineStart, 10);
        }

        return DomHelper.getTranslateX(element);
    }

    getY(element) {
        if (this.positioning === 'absolute') {
            return parseFloat(element.style.top, 10);
        }
        if (this.positioning === 'inset') {
            return parseFloat(getComputedStyle(element).top, 10);
        }

        return DomHelper.getTranslateY(element);
    }

    getXY(element) {
        if (this.positioning === 'absolute') {
            return [element.offsetLeft, element.offsetTop];
        }
        if (this.positioning === 'inset') {
            const style = getComputedStyle(element);
            return [parseFloat(style.insetInlineStart, 10), parseFloat(style.top, 10)];
        }

        return DomHelper.getTranslateXY(element);
    }

    setXY(element, x, y) {
        if (this.skipUpdatingElement) {
            return;
        }

        if (this.positioning === 'absolute') {
            element.style.left = x + 'px';
            element.style.top  = y + 'px';
        }
        else if (this.positioning === 'inset') {
            element.style.insetInlineStart = x + 'px';
            element.style.top  = y + 'px';
        }
        else {
            DomHelper.setTranslateXY(element, x, y);
        }
    }

    /**
     * Start translating, called on first mouse move after dragging
     * @param {Object} event Event object
     * @private
     */
    startTranslateDrag(event) {
        const
            me                                       = this,
            { context, outerElement, proxySelector } = me,
            // When cloning an element to be dragged, we place it in BODY by default
            dragWithin                               = me.dragWithin = me.dragWithin || (me.cloneTarget && document.body);

        let element = context.dragProxy || context.element;

        const
            grabbed       = element,
            grabbedParent = element.parentElement;

        if (me.cloneTarget) {
            const elementToClone = proxySelector ? element.querySelector(proxySelector) : element;

            let { width, height, x : proxyX, y : proxyY } = Rectangle.from(elementToClone, Rectangle.outer(dragWithin));

            if (me.isRTL && element.style.insetInlineStart) {
                proxyX = Rectangle.outer(dragWithin).right - Rectangle.from(element).right;
            }

            element = me.createProxy(element);

            let x = proxyX, y = proxyY;

            // Match the grabbed element's size and position.
            if (me.autoSizeClonedTarget) {
                element.style.width  = `${width}px`;
                element.style.height = `${height}px`;
            }

            element.classList.add(me.dragProxyCls, me.draggingCls);
            // Remove some irrelevant CSS classes
            element.classList.remove('b-hover', 'b-focused');

            dragWithin.appendChild(element);

            if (!me.autoSizeClonedTarget || proxySelector) {
                const
                    // Center proxy at cursor position, we assume app is applying styles to the element (inline or CSS)
                    proxyRect                            = element.getBoundingClientRect(),
                    { x : dragWithinX, y : dragWithinY } = dragWithin.getBoundingClientRect(),
                    localX                               = event.clientX - dragWithinX,
                    // Body may have a non-zero top
                    localY                               = event.clientY - dragWithinY + (dragWithin !== document.body ? document.body.getBoundingClientRect().y : 0);

                x = localX - (proxyRect.width / 2);
                y = localY - (proxyRect.height / 2);

                // When proxy is centered, update to not use original mousedown coordinates, but the first mouse move triggering the drag
                context.startPageX = event.pageX;
                context.startPageY = event.pageY;
            }

            me.setXY(element, x, y);

            grabbed.classList.add('b-drag-original');

            if (me.hideOriginalElement) {
                grabbed.classList.add('b-hidden');
            }
        }

        element.classList.add(me.draggingCls);

        const
            elementStartX = me.getX(element),
            elementStartY = me.getY(element);

        Object.assign(context, {
            // The element which we're moving, could be a cloned version of grabbed, or the grabbed element itself
            element,

            // The original element upon which the mousedown event triggered a drag operation
            grabbed,

            // The parent of the original element where the pointerdown was detected - to be able to restore after an invalid drop
            grabbedParent,

            // The next sibling of the original element where the pointerdown was detected - to be able to restore after an invalid drop
            grabbedNextSibling : element.nextElementSibling,

            // Elements position within parent element
            elementStartX,
            elementStartY,
            // The inset mode currently only supports dragging within the offsetParent element, to ensure that inset
            // coord can be accurately read without walking
            elementX : me.positioning === 'inset' ? elementStartX : DomHelper.getOffsetX(element, dragWithin || outerElement),
            elementY : me.positioning === 'inset' ? elementStartY : DomHelper.getOffsetY(element, dragWithin || outerElement),

            scrollX : 0,
            scrollY : 0,

            scrollManagerElementContainsDragProxy : !me.cloneTarget || dragWithin === outerElement
        });

        if (dragWithin) {
            context.parentElement = element.parentElement;

            if (dragWithin !== element.parentElement) {
                dragWithin.appendChild(element);
            }
            me.updateTranslateProxy(event);
        }
    }

    // When drag has started, create proxy versions (if applicable) and store original positions of all related elements
    // to be able to animate back to these positions in case of an aborted drag
    onTranslateDragStarted() {
        const
            me          = this,
            { context } = me;

        let { relatedElements } = context;

        // For unified proxy mode - add a CSS class to the 'main' dragging element to be able to have it be on top of related elements with z-index
        if (me.unifiedProxy) {
            context.element.classList.add('b-drag-main', 'b-drag-unified-proxy');
        }

        if (relatedElements?.length > 0) {
            context.relatedElStartPos    = [];
            context.relatedElDragFromPos = [];

            const { proxySelector } = me;

            let [elementStartX, elementStartY] = [context.elementStartX, context.elementStartY];

            // Store reference to original elements (may need cleanup to remove CSS classes after drop)
            context.originalRelatedElements = relatedElements;
            // Create clone proxy elements of all related elements
            relatedElements                 = context.relatedElements = relatedElements.map((relatedEl, i) => {
                const
                    proxyTemplateElement    = proxySelector ? relatedEl.querySelector(proxySelector) : relatedEl,
                    { x, y, width, height } = Rectangle.from(proxyTemplateElement, me.dragWithin),
                    relatedElementToDrag    = me.cloneTarget ? me.createProxy(relatedEl) : relatedEl;

                relatedElementToDrag.classList.add(me.draggingCls);
                // Remove some irrelevant CSS classes
                relatedElementToDrag.classList.remove('b-hover', 'b-focused');

                if (me.cloneTarget) {
                    // Match the original related element's position.
                    me.setXY(relatedElementToDrag, x, y);
                    me.dragWithin.appendChild(relatedElementToDrag);
                    relatedElementToDrag.classList.add(me.dragProxyCls);

                    // Optionally also match the original related element's size
                    if (me.autoSizeClonedTarget) {
                        relatedElementToDrag.style.width  = `${width}px`;
                        relatedElementToDrag.style.height = `${height}px`;
                    }

                    if (me.hideOriginalElement) {
                        relatedEl.classList.add('b-hidden');
                    }
                    relatedEl.classList.add('b-drag-original');
                }

                context.relatedElStartPos[i] = context.relatedElDragFromPos[i] = me.getXY(relatedElementToDrag);

                if (me.unifiedProxy) {
                    relatedElementToDrag.classList.add('b-drag-unified-animation', 'b-drag-unified-proxy');
                    // Move into cascade and cache the dragFrom pos
                    elementStartX += me.unifiedOffset;
                    elementStartY += me.unifiedOffset;
                    me.setXY(relatedElementToDrag, elementStartX, elementStartY);
                    context.relatedElDragFromPos[i]   = [elementStartX, elementStartY];
                    relatedElementToDrag.style.zIndex = 100 - i;
                }

                return relatedElementToDrag;
            });

            // Move the selected events into a unified cascade.
            if (me.unifiedProxy && relatedElements?.length > 0) {
                // Animate related elements should into the position
                EventHelper.onTransitionEnd({
                    element  : relatedElements[0],
                    property : me.positioning === 'inset' ? 'left' : 'translate',
                    handler() {
                        relatedElements.forEach(el => el.classList.remove('b-drag-unified-animation'));
                    },
                    thisObj : me,
                    once    : true
                });
            }
        }
    }

    /**
     * Limit translation to outer bounds and specified constraints
     * @param {HTMLElement} element Element being dragged
     * @param {Number} x Proposed X coordinate
     * @param {Number} y Proposed Y coordinate
     * @returns {{constrainedX: Number, constrainedY: Number}} Constrained coordinates
     * @private
     */
    applyConstraints(element, x, y) {
        const
            me                           = this,
            { constrain, dragWithin }    = me,
            { pageXOffset, pageYOffset } = dragWithin === document.body ? globalThis : noScroll;

        // limit to outer elements edges
        if (dragWithin && constrain) {
            const
                newRect       = new Rectangle(x, y, element.offsetWidth, element.offsetHeight),
                constrainRect = Rectangle.from(dragWithin);

            // If the dragged element is position:fixed, its coordinates are relative to the viewport.
            // If not, they are relative to its dragWithin element so the Rectangle needs to be moved to 0,0
            if (me.context.position !== 'fixed') {
                constrainRect.height = dragWithin.scrollHeight;
                constrainRect.width  = dragWithin.scrollWidth;
                constrainRect.moveTo(0, 0);
            }
            ({ x, y } = newRect.constrainTo(constrainRect));
        }

        // limit horizontally
        if (typeof me.minX === 'number') {
            x = Math.max(me.minX + pageXOffset, x);
        }
        if (typeof me.maxX === 'number') {
            x = Math.min(me.maxX + pageXOffset, x);
        }

        // limit vertically
        if (typeof me.minY === 'number') {
            y = Math.max(me.minY + pageYOffset, y);
        }
        if (typeof me.maxY === 'number') {
            y = Math.min(me.maxY + pageYOffset, y);
        }

        return { constrainedX : x, constrainedY : y };
    }

    /**
     * Update elements translation on mouse move.
     * @private
     * @param {MouseEvent} event
     * @param {Object} scrollManagerConfig
     */
    updateTranslateProxy(event, scrollManagerConfig) {
        const
            me                                        = this,
            { lockX, lockY, context }                 = me,
            element                                   = context.dragProxy || context.element,
            { relatedElements, relatedElDragFromPos } = context,
            rtlInsetFlip                              = me.isRTL && me.positioning === 'inset' ? -1 : 1;

        // If we are cloning the dragged element outside of the element(s) monitored by the ScrollManager, then no need
        // to take the scrollManager scroll values into account since it is only relevant when dragProxy is inside
        // the Grid (where scroll manager operates).
        if (context.scrollManagerElementContainsDragProxy && scrollManagerConfig) {
            context.scrollX = scrollManagerConfig.getRelativeLeftScroll(element);
            context.scrollY = scrollManagerConfig.getRelativeTopScroll(element);
        }

        context.pageX   = event.pageX;
        context.pageY   = event.pageY;
        context.clientX = event.clientX;
        context.clientY = event.clientY;

        let
            newX = context.elementStartX + (event.pageX - context.startPageX + context.scrollX) * rtlInsetFlip,
            newY = context.elementStartY + event.pageY - context.startPageY + context.scrollY;

        // First let outside world apply snapping
        if (me.snapCoordinates) {
            const snapped = me.snapCoordinates({ element, newX, newY });

            newX = snapped.x;
            newY = snapped.y;
        }

        // Now constrain coordinates
        const { constrainedX, constrainedY } = me.applyConstraints(element, newX, newY);

        if (context.started || constrainedX !== newX || constrainedY !== newY) {
            me.setXY(element, lockX ? undefined : constrainedX, lockY ? undefined : constrainedY);
        }

        if (relatedElements) {
            const
                deltaX = lockX ? 0 : constrainedX - context.elementStartX,
                deltaY = lockY ? 0 : constrainedY - context.elementStartY;

            relatedElements.forEach((r, i) => {
                const [x, y] = relatedElDragFromPos[i];

                me.setXY(r, x + deltaX, y + deltaY);
            });
        }

        context.newX = constrainedX;
        context.newY = constrainedY;
    }

    /**
     * Finalize drag, fire drop.
     * @private
     * @param {Object} event Event object
     * @fires drop
     */
    async finishTranslateDrag(event) {
        const
            me                  = this,
            context             = me.context,
            { target }          = event,
            xChanged            = !me.lockX && Math.round(context.newX) !== Math.round(context.elementStartX),
            yChanged            = !me.lockY && Math.round(context.newY) !== Math.round(context.elementStartY),
            element             = context.dragProxy || context.element,
            { relatedElements } = context;

        if (!me.ignoreSamePositionDrop || xChanged || yChanged) {
            if (context.valid === false) {
                await me.abortTranslateDrag(true, event);
            }
            else  {
                const targetRect = !me.allowDropOutside && Rectangle.from(me.dragWithin || me.outerElement);

                if (targetRect && ((typeof me.minX !== 'number' && me.minX !== true && (event.pageX < targetRect.left)) ||
                    (typeof me.maxX !== 'number' && me.maxX !== true && (event.pageX > targetRect.right)) ||
                    (typeof me.minY !== 'number' && me.minY !== true && (event.pageY < targetRect.top)) ||
                    (typeof me.maxY !== 'number' && me.maxY !== true && (event.pageY > targetRect.bottom)))) {
                    // revert location when dropped outside allowed element
                    await me.abortTranslateDrag(true, event);
                }
                else {
                    context.finalize = async(valid = context.valid) => {
                        // In case someone tries to finalize twice
                        if (context.finalized) {
                            console.warn('DragHelper: Finalizing already finalized drag');
                            return;
                        }

                        context.finalized = true;

                        // abort if invalid (and context still exists, might have been aborted from outside)
                        if (!valid && me.context) {
                            // abort if flagged as invalid, without triggering abort or drop again
                            await me.abortTranslateDrag(true, null, true);
                        }

                        if (!me.isDestroyed) {
                            me.trigger('dropFinalized', { context, event, target });
                            me.reset();
                        }

                        if (!me.cloneTarget && element.parentElement !== context.grabbedParent) {
                            // If the dragged element was moved to another parent element, remove the translate style
                            [element, ...(relatedElements || [])].forEach(el => el.style.translate = '');

                        }
                    };

                    // allow async finalization by setting async to true on context in drop handler,
                    // requires implementer to call context.finalize later to finish the drop
                    context.async = false;

                    await me.trigger('drop', { context, event, target });

                    if (!context.async) {
                        // finalize immediately
                        await context.finalize();
                    }
                }
            }
        }
        else {
            // no change, abort
            me.abortTranslateDrag(false, event);
        }
    }

    /**
     * Abort translation
     * @param {Boolean} [invalid=false] Whether the translation is invalid
     * @param {MouseEvent|null} [event=null] Mouse event associated with the abort
     * @param {Boolean} [silent=false] Whether to suppress events
     * @private
     * @fires abort
     */
    async abortTranslateDrag(invalid = false, event = null, silent = false) {
        const
            me                                              = this,
            {
                cloneTarget,
                context,
                proxySelector,
                dragWithin,
                draggingCls
            }                                               = me,
            { relatedElements, relatedElStartPos, grabbed } = context,
            element                                         = context.dragProxy || context.element;

        context.valid = false;

        me.scrollManager?.stopMonitoring();

        if (context.aborted) {
            console.warn('DragHelper: Aborting already aborted drag');
            return;
        }

        let { elementStartX, elementStartY } = context;
        const proxyMoved = elementStartX !== me.getX(element) ||
                elementStartY !== me.getY(element);

        if (element && context.started) {
            // Put the dragged element back where it was
            if (!cloneTarget && dragWithin && dragWithin !== context.grabbedParent) {
                context.grabbedParent.insertBefore(element, context.grabbedNextSibling);
            }

            // Align the now visible grabbed element with the clone, so that it looks like it's
            // sliding back into place when the clone is removed
            if (cloneTarget) {
                if (proxySelector) {
                    const
                        animateTo = grabbed.querySelector(proxySelector) || grabbed,
                        { x, y }  = Rectangle.from(animateTo);

                    elementStartX = x;
                    elementStartY = y;
                }

                // <remove-on-release>
                // TODO:
                // if (me.hideOriginalElement) {
                //     [elementStartX, elementStartY] = DomHelper.getTranslateXY(grabbed);
                //     DomHelper.alignTo(grabbed, element);
                //
                //     // The getBoundingClientRect is important. The aligning above must be processed
                //     // by a forced synchronous layout *before* the b-aborting class is added below.
                //     me.grabbed.getBoundingClientRect();
                // }
                // </remove-on-release>
            }

            // animated restore of position.
            element.classList.add('b-aborting');

            // Move the main element back to its original position.
            me.setXY(element, elementStartX, elementStartY);

            // Move any related elements back to their original positions.
            relatedElements?.forEach((element, i) => {
                element.classList.remove(draggingCls);
                element.classList.add('b-aborting');

                me.setXY(element, relatedElStartPos[i][0], relatedElStartPos[i][1]);
            });

            if (!silent) {
                me.trigger(invalid ? 'drop' : 'abort', { context, event });
            }

            // Element may have been scrolled out of view, or otherwise removed while dragging
            if (element.isConnected && !me.isDestroying && proxyMoved) {
                const transitionProperty = me.positioning === 'inset' ? 'inset' : 'transform';
                // should have "?" to work on Salesforce LockerService mode
                // https://github.com/bryntum/bryntum/issues/11135
                if (DomHelper.getAnimations(element).length) {
                    await EventHelper.waitForTransitionEnd({
                        element,
                        property     : DomHelper.getPropertyTransitionDuration(element, transitionProperty) ? transitionProperty : 'all',
                        thisObj      : me,
                        once         : true,
                        timeout      : 300,
                        runOnDestroy : true
                    });
                }
            }

            if (!me.isDestroyed) {
                // Trigger event after transition has completed for UIs to redraw with stable DOM
                me.trigger('abortFinalized', { context, event });
            }
        }

        if (me.context?.started) {
            me.reset();
        }
    }

    // Restore state of all mutated elements
    cleanUp() {
        const
            me                                                    = this,
            { context, cloneTarget, draggingCls, dragProxyCls }   = me,
            element                                               = context.dragProxy || context.element,
            { relatedElements, originalRelatedElements, grabbed } = context,
            removeClonedProxies                                   = cloneTarget && (me.removeProxyAfterDrop || !context.valid),
            cssClassesToRemove                                    = [draggingCls, 'b-aborting', dragProxyCls, 'b-drag-main', 'b-drag-unified-proxy'];

        element.classList.remove(...cssClassesToRemove);

        if (removeClonedProxies) {
            element.remove();
        }
        relatedElements?.forEach(element => {
            if (removeClonedProxies) {
                element.remove();
            }
            else {
                element.classList.remove(...cssClassesToRemove);
            }
        });

        // Restore originally grabbed elements
        grabbed.classList.remove('b-drag-original', 'b-hidden');
        originalRelatedElements?.forEach(element => element.classList.remove('b-hidden', 'b-drag-original'));
    }

    //endregion
};
