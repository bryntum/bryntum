import Base from '../../Base.js';
import GlobalEvents from '../../GlobalEvents.js';
import DomHelper from '../DomHelper.js';
import Rectangle from '../util/Rectangle.js';

// <remove-on-release>
// TODO: Use mousedown pos and not center too reposition
// </remove-on-release>

/**
 * @module Core/helper/mixin/DragHelperContainer
 */

/**
 * Mixin for DragHelper that handles dragging elements between containers (or rearranging within)
 *
 * @mixin
 * @private
 */
export default Target => class DragHelperContainer extends (Target || Base) {

    static $name = 'DragHelperContainer';

    //region Init

    /**
     * Initialize container drag mode.
     * @private
     */
    initContainerDrag() {
        const me = this;
        //use container drag as default mode
        if (!me.mode) {
            me.mode = 'container';
        }
        if (me.mode === 'container' && !me.containers) {
            throw new Error('Container drag mode must specify containers');
        }
    }

    //endregion

    //region Grab, update, finish

    /**
     * Grab an element which can be dragged between containers.
     * @private
     * @param {Object} event Event object
     * @returns {Boolean}
     */
    grabContainerDrag(event) {
        const me = this;

        // allow specified selectors to prevent drag
        if (!me.ignoreSelector || !event.target.closest(me.ignoreSelector)) {
            // go up from "handle" to draggable element
            const element = DomHelper.getAncestor(event.target, me.containers, me.outerElement);

            if (element) {
                const box = element.getBoundingClientRect();

                me.context = {
                    element,
                    position         : DomHelper.getStyleValue(element, 'position'),
                    valid            : true,
                    action           : 'container',
                    offsetX          : event.pageX - box.left,
                    offsetY          : event.pageY - box.top,
                    originalPosition : {
                        parent : element.parentElement,
                        prev   : element.previousElementSibling,
                        next   : element.nextElementSibling
                    }
                };
            }

            return true;
        }

        return false;
    }

    startContainerDrag(event) {
        const
            me                          = this,
            { context, floatRootOwner } = me,
            { element : dragElement }   = context,
            clonedNode                  = dragElement.cloneNode(true),
            outerWidgetEl               = floatRootOwner?.element.closest('.b-outer');

        // init drag proxy
        clonedNode.classList.add(me.dragProxyCls, me.draggingCls);

        // Append drag proxy to float root, fall back to root context node
        (floatRootOwner?.floatRoot || DomHelper.getRootElement(dragElement)).appendChild(clonedNode);
        context.dragProxy = clonedNode;

        // style dragged element
        context.dragging = dragElement;
        dragElement.classList.add(me.dropPlaceholderCls);

        if (floatRootOwner) {
            floatRootOwner.element.classList.add('b-dragging-child');
        }
        // If element being dragged is also a child of the float root, add +1 to the cloned node z-index
        if (outerWidgetEl) {
            clonedNode.style.zIndex = floatRootOwner.floatRootMaxZIndex + 1;
        }
    }

    onContainerDragStarted(event) {
        const
            me                                   = this,
            { context }                          = me,
            { element : dragElement, dragProxy } = context,
            box                                  = dragElement.getBoundingClientRect();

        // Clear any translate — we position using inset-inline-start/top instead
        dragProxy.style.translate = '';

        // Always set the proxy element width manually, drag target could be sized with flex or % width
        if (me.autoSizeClonedTarget) {
            dragProxy.style.width  = box.width + 'px';
            dragProxy.style.height = box.height + 'px';
            DomHelper.setTopInsetInlineStart(dragProxy, box.top, me.toInlineStartX(dragProxy, box.left));
        }
        else if (me.useCenteredCursor) {
            const proxyBox = dragProxy.getBoundingClientRect();

            Object.assign(context, {
                offsetX : proxyBox.width / 2,
                offsetY : proxyBox.height / 2
            });
            DomHelper.setTopInsetInlineStart(dragProxy, event.clientY, me.toInlineStartX(dragProxy, event.clientX));
        }
    }

    /**
     * Move the placeholder element into its new position on valid drag.
     * @private
     * @param {Object} event Event object
     */
    updateContainerDrag(event) {
        const
            me          = this,
            { context } = me,
            { targetElement } = context;

        if (!context.started || !targetElement) {
            return;
        }

        let containerElement = DomHelper.getAncestor(targetElement, me.containers);

        const
            willLoseFocus    = context.dragging?.contains(DomHelper.getActiveElement(context.dragging));

        if (containerElement && DomHelper.isDescendant(context.element, containerElement)) {
            return;
        }

        // The dragging element contains focus, and moving it within the DOM
        // will cause focus loss which might affect an encapsulating autoClose Popup.
        // Prevent focus loss handling during the DOM move.
        if (willLoseFocus) {
            GlobalEvents.suspendFocusEvents();
        }
        if (context.valid && (containerElement || me.containers.some(c => c.contains(targetElement)))) {
            if (!containerElement) {
                containerElement = me.containers.find(c => c.contains(targetElement)).lastElementChild;
            }
            me.moveNextTo(containerElement, event);
        }
        else {
            // dragged outside of containers, revert position
            me.revertPosition();
        }
        if (willLoseFocus) {
            GlobalEvents.resumeFocusEvents();
        }

        event.preventDefault();
    }

    /**
     * Finalize drag, fire drop.
     * @private
     * @param {Object} event Event object
     * @fires drop
     */
    finishContainerDrag(event) {
        const
            me          = this,
            { context } = me,
            // extracting variables to make code more readable
            { dragging, dragProxy, valid, draggedTo, insertBefore, originalPosition } = context;

        if (dragging) {
            // needs to have a valid target
            context.valid = Boolean(valid && (draggedTo || me.externalDropTargetSelector && event.target.closest(me.externalDropTargetSelector))  &&
                    // no drop on self or parent
                    (dragging !== insertBefore || originalPosition.parent !== draggedTo));

            context.finalize = (valid = context.valid) => {
                // revert if invalid (and context still exists, might have been aborted from outside)
                if (!valid && me.context) {
                    me.revertPosition();
                }

                dragging.classList.remove(me.dropPlaceholderCls);
                dragProxy.remove();

                me.reset();
            };

            // allow async finalization by setting async to true on context in drop handler,
            // requires implementer to call context.finalize later to finish the drop
            context.async = false;

            me.trigger('drop', { context, event });

            if (!context.async) {
                // finalize immediately
                context.finalize();
            }
        }
    }

    /**
     * Aborts a drag operation.
     * @param {Boolean} [invalid=false] Whether the drag operation is invalid
     * @param {Object} [event] Event object
     * @param {Boolean} [silent=false] Whether to suppress events
     * @private
     */
    abortContainerDrag(invalid = false, event = null, silent = false) {
        const
            me          = this,
            { context } = me;

        if (context.dragging) {
            context.dragging.classList.remove(me.dropPlaceholderCls);
            context.dragProxy.remove();

            me.revertPosition();
        }

        if (!silent) {
            me.trigger(invalid ? 'drop' : 'abort', { context, event });
        }

        me.reset();
    }

    //endregion

    //region Helpers

    /**
     * Converts a physical viewport X coordinate to an inline-start offset for the proxy's
     * containing block. In LTR this is the same as the physical X. In RTL, inline-start is
     * measured from the right edge, so we convert: containerWidth - physicalX - proxyWidth.
     * @param {HTMLElement} proxy The drag proxy element
     * @param {Number} physicalX The physical left position (viewport coordinates)
     * @returns {Number} The inline-start offset value
     * @private
     */
    toInlineStartX(proxy, physicalX) {
        if (this.isRTL) {
            return proxy.parentElement.clientWidth - physicalX - proxy.offsetWidth;
        }
        return physicalX;
    }

    /**
     * Updates the drag proxy position.
     * @private
     * @param {Object} event Event object
     */
    updateContainerProxy(event) {
        const
            me          = this,
            { context } = me,
            proxy       = context.dragProxy;

        let newX = event.pageX - context.offsetX,
            newY = event.pageY - context.offsetY;

        if (typeof me.minX === 'number') {
            newX = Math.max(me.minX, newX);
        }

        if (typeof me.maxX === 'number') {
            newX = Math.min(me.maxX - proxy.offsetWidth, newX);
        }

        if (typeof me.minY === 'number') {
            newY = Math.max(me.minY, newY);
        }

        if (typeof me.maxY === 'number') {
            newY = Math.min(me.maxY  - proxy.offsetHeight, newY);
        }

        const inlineStartX = me.toInlineStartX(proxy, newX);

        if (me.lockX) {
            DomHelper.setLength(proxy, 'top', newY);
        }
        else if (me.lockY) {
            DomHelper.setLength(proxy, 'inset-inline-start', inlineStartX);
        }
        else {
            DomHelper.setTopInsetInlineStart(proxy, newY, inlineStartX);
        }

        let targetElement;

        if (event.type === 'touchmove') {
            const touch = event.changedTouches[0];
            targetElement = DomHelper.elementFromPoint(touch.clientX, touch.clientY);
        }
        else {
            targetElement = event.target;
        }

        context.targetElement = me.resolveTargetElement?.(targetElement) || targetElement;

        if (!context.targetElement.nextElementSibling?.matches(`.${me.dropPlaceholderCls}`)) {
            context.insertBefore = context.targetElement.nextElementSibling;
        }
    }

    /**
     * Positions element being dragged in relation to targetElement.
     * @private
     * @param {Element} targetElement Target elmenet
     * @param {Object} event Event object
     */
    moveNextTo(targetElement, event) {
        const
            { context } = this,
            dragElement = context.dragging,
            parent      = targetElement.parentElement;

        if (targetElement !== dragElement) {
            // dragged over a container and not over self, calculate where to insert
            const centerX = Rectangle.from(targetElement).center.x;

            if ((this.isRTL && event.pageX > centerX) || (!this.isRTL && event.pageX < centerX)) {
                const prevSibling = targetElement.previousElementSibling;

                // dragged left of target center, insert before
                parent.insertBefore(dragElement, targetElement);
                context.insertBefore = targetElement;

                if (prevSibling !== dragElement) {
                    this.trigger('itemMove', { context, event });
                }
            }
            // dragged right of target center, insert after
            else if (targetElement.nextElementSibling) {
                // check that not dragged to the immediate left of self. in such case, position should not change
                if (targetElement.nextElementSibling !== dragElement) {
                    context.insertBefore = targetElement.nextElementSibling;
                    parent.insertBefore(dragElement, targetElement.nextElementSibling);
                    this.trigger('itemMove', { context, event });
                }
                else if (!context.insertBefore && dragElement.parentElement.lastElementChild !== dragElement) {
                    // <remove-on-release>
                    // TODO: or flag as invalid drag? since no change...
                    // </remove-on-release>
                    // dragged left initially, should stay in place (checked in finishContainerDrag)
                    context.insertBefore = targetElement.nextElementSibling;
                }
            }
            else {
                parent.appendChild(dragElement);
                this.trigger('itemMove', { context, event });
                context.insertBefore = null;
            }

            context.draggedTo = parent;
        }
    }

    /**
     * Moves element being dragged back to its original position.
     * @private
     */
    revertPosition() {
        const
            { context }      = this,
            { dragging, originalPosition }           = context,
            { parent, next } = originalPosition,
            isNoop                 = originalPosition.parent === dragging.parent &&
                originalPosition.prev === dragging.previousElementSibling &&
                originalPosition.next === dragging.nextElementSibling;

        if (!isNoop) {
            // revert to correct location
            if (next) {
                parent.insertBefore(dragging, next);
            }
            else {
                parent.appendChild(dragging);
            }
            this.trigger('itemMove', { context });
        }

        // no target container
        context.draggedTo = null;
    }

    //endregion
};
