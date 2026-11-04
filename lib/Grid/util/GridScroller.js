import DomHelper from '../../Core/helper/DomHelper.js';
import Scroller from '../../Core/helper/util/Scroller.js';

/**
 * @module Grid/util/GridScroller
 */

const
    xAxis = {
        x : 1
    },
    subGridFilter = w => w.isSubGrid;

/**
 * A Scroller subclass which handles scrolling in a grid.
 *
 * If the grid has no parallel scrolling grids (No locked columns), then this functions
 * transparently as a Scroller.
 *
 * If there are locked columns, then scrolling to an _element_ will invoke the scroller
 * of the subgrid which contains that element.
 * @internal
 */
export default class GridScroller extends Scroller {
    static $name = 'GridScroller';

    addScroller(scroller) {
        (this.xScrollers || (this.xScrollers = [])).push(scroller);
    }

    addPartner(otherScroller, axes = xAxis, syncScrollbar = true) {
        if (typeof axes === 'string') {
            axes = {
                [axes] : 1
            };
        }

        // Link up all our X scrollers
        if (axes.x) {
            // Ensure the other grid has set up its scrollers. This is done on first paint
            // so may not have been executed yet.
            otherScroller.owner.initScroll();

            //<debug>
            if (otherScroller.xScrollers?.length !== this.xScrollers.length) {
                throw new Error('Grid scrollers can only be synced in the X axis between grids with the same number of SubGrids');
            }
            //</debug>
            const
                subGrids = this.widget.items.filter(subGridFilter),
                otherSubGrids = otherScroller.widget.items.filter(subGridFilter);

            // Loop through SubGrids to ensure that we partner their scrollers up correctly
            for (let i = 0, { length } = subGrids; i < length; i++) {
                subGrids[i].scrollable.addPartner(otherSubGrids[i].scrollable, 'x');
            }
        }

        // We need to keep the presence of visible vertical scrollbars in sync between GridScrollers
        if (syncScrollbar && DomHelper.scrollBarWidth && otherScroller.isGridScroller) {
            otherScroller.ion({
                overflowChange : 'onPartnerOverflowChange',
                thisObj        : this
            });

            // Ensure we *begin* in sync
            this.onPartnerOverflowChange({
                source : otherScroller, y : otherScroller.hasOverflowY
            });
        }

        // Continue to superclass to make the two-way relationship.
        // X-axis may only be handled at this level though, so do not pass that up.
        super.addPartner(otherScroller, { ...axes, x : false });
    }

    /**
     * Called when a partner GridScroller that we are sharing X position with changes its overflowing state.
     *
     * This will mean the addition or removal of a vertical scrollbar.
     *
     * All partners must stay in sync. If another parter has a vertical scrollbar
     * and we do not, we must set our overflowY to 'scroll' so that we show an empty
     * scrollbar to keep widths synchronized.
     * @param {Object} event A {@link Core.helper.util.Scroller#event-overflowChange} event
     * @internal
     */
    onPartnerOverflowChange({ source : otherScrollable, y }) {
        const
            me     = this,
            ourY   = me.hasOverflowY,
            otherY = y;

        // We are scrolling, partner is not - force it
        if (ourY && !otherY) {
            otherScrollable.overflowY = 'scroll';
        }
        // Vice versa
        if (!ourY && otherY) {
            me.overflowY = 'scroll';
        }
        // Neither of us are scrolling
        else if (!ourY && !otherY) {
            me.overflowY = otherScrollable.overflowY = true;
        }

        me.owner.refreshVirtualScrollbars();
    }

    removePartner(otherScroller) {
        if (DomHelper.scrollBarWidth && otherScroller.isGridScroller) {
            otherScroller.un({
                overflowChange : 'onPartnerOverflowChange',
                thisObj        : this
            });
        }
        this.xScrollers.forEach((scroller, i) => {
            if (!scroller.isDestroyed) {
                scroller.removePartner(otherScroller.xScrollers[i]);
            }
        });

        super.removePartner(otherScroller);
    }

    updateOverflowX(overflowX) {
        const hideScroll = overflowX === false;
        this.xScrollers?.forEach(s => s.overflowX = hideScroll ? 'hidden' : 'hidden-scroll');
        this.widget.virtualScrollers.classList.toggle('b-hide-display', hideScroll);
    }

    scrollIntoView(element, options) {
        // If we are after an element, we have to ask the scroller of the SubGrid
        // that the element is in. It will do the X scrolling and delegate the Y
        // scrolling up to this GridScroller.
        if (element.nodeType === Element.ELEMENT_NODE && this.element.contains(element)) {
            for (const subGridScroller of this.xScrollers) {
                if (subGridScroller.element.contains(element)) {
                    return subGridScroller.scrollIntoView(element, options);
                }
            }
        }
        else {
            // The Grid only scrolls the Y axis, so skip calculating the X delta
            return super.scrollIntoView(element, { ...options, x : false });
        }
    }

    hasOverflow(axis = 'y') {
        return axis === 'y' ? this.scrollHeight > this.clientHeight : false;
    }

    set x(x) {
        if (this.xScrollers) {
            this.xScrollers[0].x = x;
        }
    }

    get x() {
        // when trying to scroll grid with no columns xScrollers do not exist
        return this.xScrollers ? this.xScrollers[0].x : 0;
    }
}
