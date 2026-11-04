import SubGrid from '../../Grid/view/SubGrid.js';
import Header from './Header.js';
import DomHelper from '../../Core/helper/DomHelper.js';

/**
 * @module Scheduler/view/TimeAxisSubGrid
 */

/**
 * Widget that encapsulates the SubGrid part of the scheduler which houses the timeline view.
 * @extends Grid/view/SubGrid
 * @private
 */
export default class TimeAxisSubGrid extends SubGrid {

    static $name = 'TimeAxisSubGrid';

    // Factoryable type name
    static type = 'timeaxissubgrid';

    static configurable = {
        // A Scheduler's SubGrid doesn't accept external columns moving in
        sealedColumns : true,

        // Use Scheduler's Header class
        headerClass : Header
    };

    startConfigure(config) {
        const { grid : scheduler } = config;

        // Scheduler references its TimeAxisSubGrid instance through this property.
        scheduler.timeAxisSubGrid = this;

        super.startConfigure(config);

        config.header = {
            cls : {
                'b-sticky-headers' : scheduler.stickyHeaders
            }
        };

        // We don't use what the GridSubGrids mixin tells us to.
        // We use the Scheduler's Header class.
        delete config.headerClass;

        // If user have not specified a width or flex for scheduler region, default to flex=1
        if (!('flex' in config || 'width' in config)) {
            config.flex = 1;
        }
    }

    changeScrollable(...args) {
        const
            { grid }   = this,
            scrollable = super.changeScrollable(...args);

        // TimeAxisSubGrid's X axis is stretched by its canvas.
        // We don't need the Scroller's default stretching implementation.
        if (scrollable) {
            Object.defineProperty(scrollable, 'scrollWidth', {
                get() {
                    return grid.isHorizontal ? grid.timeAxisViewModel.totalSize : (this.element?.scrollWidth ?? 0);
                },
                set() {
                    this.positionDirty = true;
                    // Setting the scroll width to be wide just updates the canvas side in Scheduler.
                    // We do not need the Scroller's default stretcher element to be added.
                    grid.updateCanvasSize();
                }
            });
        }

        return scrollable;
    }

    handleHorizontalScroll(addCls = true) {
        // Swallow scroll syncing calls that happen during view preset changes, that process triggers multiple when
        // it first changes tickWidth, then scrolls to center and then an additional sync on scroll end
        if (!this.grid._viewPresetChanging) {
            super.handleHorizontalScroll(addCls);
        }
    }

    /**
     * This is an event handler triggered when the TimeAxisSubGrid changes size.
     * Its height changes when content height changes, and that is not what we are
     * interested in here. If the *width* changes, that means the visible viewport
     * has changed size.
     * @param {HTMLElement} element
     * @param {Number} width
     * @param {Number} height
     * @param {Number} oldWidth
     * @param {Number} oldHeight
     * @private
     */
    onInternalResize(element, width, height, oldWidth, oldHeight) {
        const me = this;

        // Call super first, to clear cached width / height
        super.onInternalResize(element, width, height, oldWidth, oldHeight);

        // We, as the TimeAxisSubGrid dictate the scheduler viewport width
        if (me.isPainted && width !== oldWidth) {
            const
                scheduler     = me.grid,
                bodyHeight    = scheduler._bodyRectangle.height,
                // Avoid ResizeObserver errors when this operation may create a scrollbar
                shouldSuspend = me.monitorResize && DomHelper.scrollBarWidth && width < oldWidth;

            if (shouldSuspend) {
                me.monitorResize = false;
            }
            scheduler.onSchedulerViewportResize(width, bodyHeight, oldWidth, bodyHeight);

            // Revert to monitoring asap.
            // Changed to revert earlier because of issues when changing width programmatically
            // This is to avoid "ResizeObserver loop completed with undelivered notifications."
            if (shouldSuspend) {
                me.queueMicrotask(() => me.monitorResize = true);
            }
        }
    }

    get squashedTotalColumnWidth() {
        return this.grid.isVertical ? super.squashedTotalColumnWidth : this.grid.timeAxisViewModel.totalSize;
    }

    get totalColumnWidth() {
        return this.grid.isVertical ? super.totalColumnWidth : this.grid.timeAxisViewModel.totalSize;
    }

    // When restoring state we need to update time axis size immediately, resize event is not triggered fast enough to
    // restore center date consistently
    clearWidthCache() {
        super.clearWidthCache();

        // Check if we are in horizontal mode
        if (this.owner.isHorizontal) {
            this.owner.updateViewModelAvailableSpace(this.width);
        }
    }

    refreshFakeScroll() {
        super.refreshFakeScroll();

        this.syncCanvasWidth();
    }

    /**
     * Sizes the canvases added through {@link #function-addCanvas} to the full width of the time axis.
     *
     * Set directly on each canvas rather than through an inherited CSS variable on this element, since changing one
     * restyles every row, cell and event below it, and zooming changes the width on every step.
     * @internal
     */
    syncCanvasWidth() {
        const
            me       = this,
            { grid } = me,
            width    = me.$canvasWidth = `${grid.isVertical ? me.totalColumnWidth : grid.timeAxisViewModel.totalSize}px`;

        me.$canvases?.forEach(element => element.style.width = width);
    }

    /**
     * Adds a canvas, an element in this sub grid's element spanning the full width of the time axis. It is sized now
     * if the width is known, and kept sized by {@link #function-syncCanvasWidth}.
     * @param {HTMLElement|SVGElement} element Canvas element
     * @internal
     */
    addCanvas(element) {
        (this.$canvases ??= new Set()).add(element);

        if (this.$canvasWidth) {
            element.style.width = this.$canvasWidth;
        }
    }

    async expand(animated = false, calledFromPartner = false) {
        const { owner } = this;

        await super.expand(animated, calledFromPartner);

        if (owner.isPainted && !calledFromPartner) {
            owner.timeAxisViewModel.update(this.width, false, true);
        }
    }
}

// Register this widget type with its Factory
TimeAxisSubGrid.initClass();
