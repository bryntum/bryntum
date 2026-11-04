import Base from '../Base.js';  // Adjust path as needed
import EventHelper from './EventHelper.js';
import DomHelper from './DomHelper.js';
import Events from '../mixin/Events.js';

DomHelper.loadStylesheet('Core/helper/ElementResizeHelper.css');

// import Stylesheet from './ElementResizeHelper.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ElementResizeHelper');

/**
 * @module Core/helper/ElementResizeHelper
 */

const handleMap = {
    topStart    : 'top-start',
    topEnd      : 'top-end',
    bottomEnd   : 'bottom-end',
    bottomStart : 'bottom-start',
    top         : 'top',
    end         : 'end',
    bottom      : 'bottom',
    start       : 'start'
};

/**
 * A simple utility class offering minimal two-dimensional resizer that:
 * - Uses "top" for vertical positioning
 * - Uses "inset-inline-start" for horizontal positioning (logical property)
 * - Adjusts width/height as well
 * @internal
 */
export default class ElementResizeHelper extends Base.mixin(Events) {
    static $name = 'ElementResizeHelper';

    static configurable = {
        element : null,

        // Minimum and maximum sizes
        minWidth  : 50,
        maxWidth  : null,
        minHeight : 50,
        maxHeight : null,
        rtl       : null,
        /**
         * Configuration object defining which resize handles to display.
         * Set a property to `false` to hide the corresponding handle.
         * @prp {Object}
         * @property {Boolean} [topStart=true] Show/hide the top-start corner resize handle
         * @property {Boolean} [top=true] Show/hide the top edge resize handle
         * @property {Boolean} [topEnd=true] Show/hide the top-end corner resize handle
         * @property {Boolean} [end=true] Show/hide the end edge resize handle
         * @property {Boolean} [bottomEnd=true] Show/hide the bottom-end corner resize handle
         * @property {Boolean} [bottom=true] Show/hide the bottom edge resize handle
         * @property {Boolean} [bottomStart=true] Show/hide the bottom-start corner resize handle
         * @property {Boolean} [start=true] Show/hide the start edge resize handle
         */
        handles   : {
            topStart    : true,
            top         : true,
            topEnd      : true,
            end         : true,
            bottomEnd   : true,
            bottom      : true,
            bottomStart : true,
            start       : true
        }
    };

    construct(config) {
        super.construct(config);

        if (!this.element) {
            throw new Error('ElementResizeHelper: `element` is required.');
        }
    }

    updateElement(element) {
        // Ensure the element is positioned so top/inset-inline-start actually work
        if (globalThis.getComputedStyle(element).position === 'static') {
            console.warn('ElementResizeHelper: `element` must be positioned (absolute or relative) for resizing to work.');
        }

        this.pointerDownListeners?.();
        // Hook pointer events, passing handle data
        this.pointerDownListeners = EventHelper.on({
            element,
            pointerdown : 'onResizePointerDown',
            delegate    : '.b-resize-grip',
            thisObj     : this
        });
    }

    updateHandles(handles) {
        const { element } = this;
        DomHelper.removeEachSelector(element, '.b-resize-grip');
        // Create resize handles
        for (const handle in handles) {
            if (handles[handle] !== false) {
                const handleEl = document.createElement('div');
                handleEl.className = `b-resize-grip b-resize-grip-${handleMap[handle]}`;
                element.appendChild(handleEl);
            }
        }
    }

    onResizePointerDown(event) {
        const
            me          = this,
            { element } = me;

        // The handle name that was clicked
        me.handleType = event.target.className.replace('b-resize-grip b-resize-grip-', '').trim();

        // Only react to start mouse button
        if (event.button !== 0 || me.trigger('beforeResizeStart', { element, handle : me.handleType }) === false) {
            return;
        }

        event.preventDefault();

        // Record initial positions. We parse top / insetInlineStart from style, fallback to 0
        const
            style   = globalThis.getComputedStyle(element),
            rect    = element.getBoundingClientRect(),
            topVal  = parseFloat(style.top) || 0,
            startVal = parseFloat(style.insetInlineStart) || 0;

        me.initialX = event.clientX;
        me.initialY = event.clientY;
        me.initialTop = topVal;
        me.initialStart = startVal;

        // Save current size
        me.initialWidth = rect.width;
        me.initialHeight = rect.height;

        // We'll just fire a start event for external watchers
        me.trigger('resizeStart', { element, handle : me.handleType });

        me.removeMoveListeners?.(); // Just in case, to never have multiple listeners
        me.removeMoveListeners = EventHelper.on({
            element     : document.body,
            pointermove : 'onResizePointerMove',
            thisObj     : me
        });

        me.removeDocUpListeners = EventHelper.on({
            element   : document,
            pointerup : 'onResizePointerUp',
            capture   : true,
            thisObj   : me,
            once      : true
        });
    }

    onResizePointerMove(event) {
        const
            me           = this,
            {
                element, handleType, rtl, minHeight, minWidth, initialStart,
                initialTop, initialWidth, initialHeight, initialX, initialY, maxWidth, maxHeight
            }            = me,
            dx           = event.clientX - initialX,
            dy           = event.clientY - initialY,
            minDx        = initialWidth - (minWidth || 1),
            sign         = rtl ? -1 : 1,
            { shiftKey } = event;

        // We'll compute new position + size
        let newStart   = initialStart,
            newTop    = initialTop,
            newWidth  = initialWidth,
            newHeight = initialHeight;

        if (handleType.includes('start')) {
            newStart = initialStart + Math.min(dx, minDx) * sign;
            newWidth = initialWidth - dx * sign;
        }
        else if (handleType.includes('end')) {
            newWidth = initialWidth + dx * sign;
        }

        // If dragging top edge, we reduce height as dy grows, and shift top
        if (handleType.includes('top')) {
            newTop = initialTop + Math.min(dy, initialHeight - (minHeight || 1));
            newHeight = initialHeight - dy;
        }
        // If dragging bottom edge, height grows with dy
        else if (handleType.includes('bottom')) {
            newHeight = initialHeight + dy;
        }

        // If shiftKey pressed, respect aspect ratio
        if (shiftKey) {
            const aspectRatio = initialWidth / initialHeight;
            if (Math.abs(dx) > Math.abs(dy)) {
                newHeight = newWidth / aspectRatio;
            }
            else {
                newWidth = newHeight * aspectRatio;
            }
        }

        // Enforce min/max
        if (minWidth !== null) {
            newWidth = Math.max(newWidth, minWidth);
        }
        if (maxWidth !== null) {
            newWidth = Math.min(newWidth, maxWidth || document.body.offsetWidth);
        }
        if (minHeight !== null) {
            newHeight = Math.max(newHeight, minHeight);
        }
        if (maxHeight !== null) {
            newHeight = Math.min(newHeight, maxHeight || document.body.offsetWidth);
        }

        // Apply new position and size
        // Move horizontally via insetInlineStart
        if (!rtl || !handleType.includes('start') || newWidth > minWidth) {
            // In RTL, insetInlineStart is the left position
            element.style.insetInlineStart = Math.max(newStart, 0) + 'px';
        }
        // Move vertically via top
        element.style.top = newTop + 'px';

        // Update size
        element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px';
    }

    onResizePointerUp(event) {
        this.removeDocUpListeners?.();
        this.removeMoveListeners?.();
        this.removeMoveListeners = null;
        this.removeDocUpListeners = null;
    }

    get isResizing() {
        return Boolean(this.removeMoveListeners);
    }

    doDestroy() {
        this.onResizePointerUp();
        this.pointerDownListeners();

        // Remove handle elements
        DomHelper.removeEachSelector(this.element, '.b-resize-grip');
        super.doDestroy();
    }
}
