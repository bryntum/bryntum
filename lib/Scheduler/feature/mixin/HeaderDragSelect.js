import EventHelper from '../../../Core/helper/EventHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import Base from '../../../Core/Base.js';

DomHelper.loadStylesheet('Scheduler/feature/mixin/HeaderDragSelect.css');

// import Stylesheet from './HeaderDragSelect.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'HeaderDragSelect');

/**
 * Internal mixin offering header drag selection capabilities. Not intended for direct use.
 * @internal
 */
export default Target => class HeaderDragSelect extends (Target || Base) {
    static $name = 'HeaderDragSelect';

    moveThreshold = 3;
    _dragging = false;

    static configurable = {
        enableDragSelect : true
    };

    construct(...args) {
        super.construct(...args);
        this.doAfterHook(this.client, 'onElementMouseDown', 'onElementMouseDown');
        this.doAfterHook(this.client, 'onElementMouseMove', 'onElementMouseMove');
    }

    onElementMouseDown(event) {
        const me = this;

        // only react to mouse input, and left button
        if (event.touches || event.button !== 0 || me.disabled || !me.enableDragSelect) {
            return;
        }

        // only react to mousedown directly on timeaxis cell
        if (event.target.closest('.b-sch-header-time-axis-cell')) {
            me.startX = event.clientX;

            EventHelper.on({
                element : DomHelper.getRootElement(event.target),
                mouseup : 'onMouseUp',
                thisObj : me,
                once    : true
            });
        }
    }

    onElementMouseMove(event) {
        const me = this;

        if (typeof me.startX === 'number') {
            if (!me._dragging && Math.abs(me.startX - event.clientX) >= me.moveThreshold) {
                const headerEl = me.client.subGrids.normal.header.headersElement;
                me.element = DomHelper.createElement({
                    parent    : headerEl,
                    tag       : 'div',
                    // b-header-zoom-rect for styling backwards compat
                    className : 'b-header-drag-selection-rect b-header-zoom-rect b-colorize'
                });

                me.headerElementRect = Rectangle.from(headerEl);

                me._dragging = true;
            }

            if (me.isDragging) {
                const
                    x     = Math.max(event.clientX, me.headerElementRect.left),
                    left  = Math.min(me.startX, x),
                    width = Math.abs(me.startX - x),
                    rect  = new Rectangle(left - me.headerElementRect.x + me.client.scrollLeft, 0, width, me.headerElementRect.height);

                DomHelper.setTranslateX(me.element, rect.left);
                me.element.style.width = rect.width + 'px';
            }
        }
    }

    onMouseUp() {
        const me = this;

        me.startX = null;

        if (me.isDragging) {
            const
                { client } = me,
                rect       = Rectangle.from(me.element),
                startDate  = client.getDateFromCoordinate(rect.left, 'round', false),
                endDate    = client.getDateFromCoordinate(rect.right, 'round', false);

            me.element.remove();

            EventHelper.on({
                element : DomHelper.getRootElement(client.element),
                thisObj : me,
                click   : event => event.stopPropagation(),
                capture : true,
                expires : 50, // In case a click did not ensue, remove the listener
                once    : true
            });

            me._dragging = null;

            me.onTimeSpanDragSelected?.({ startDate, endDate });
        }
    }

    get isDragging() {
        return this._dragging;
    }
};
