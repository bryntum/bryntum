import Base from '../../../Core/Base.js';

/**
 * @module Scheduler/view/mixin/SchedulerZoomable
 */

/**
 * Scheduler specific zooming, on top of the zooming shared by all timelines in
 * {@link Scheduler.view.mixin.TimelineZoomable} and {@link Scheduler.view.mixin.TimelineSmoothZoom}.
 *
 * ## Cheaper zooming with many events
 *
 * By default, the events are laid out and rendered again on every step of a continuous zoom - mouse wheel,
 * trackpad pinch, dragging the {@link Scheduler.widget.TimeZoomSlider}, or an animated zoom. With many events in view
 * that can make zooming sluggish. Setting {@link #config-liveZoom} to `false` makes the gesture only move and resize
 * the bars already rendered when it started, and lay everything out once when it ends:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     liveZoom : false
 * });
 * ```
 *
 * Toggle it and zoom with Ctrl + mouse wheel, a trackpad pinch or the slider, to compare:
 *
 * {@inlineexample Scheduler/view/mixin/SchedulerZoomable.js}
 *
 * See {@link #config-liveZoom} for what is and is not updated during the gesture.
 *
 * @mixin
 */
export default Target => class SchedulerZoomable extends (Target || Base) {
    static $name = 'SchedulerZoomable';

    static configurable = {
        /**
         * When `true` (default), the events are laid out again on every step of a continuous zoom - mouse wheel,
         * trackpad pinch, dragging the {@link Scheduler.widget.TimeZoomSlider}, or an animated zoom - so the view is
         * fully up to date throughout.
         *
         * Pass `false` to trade that for a smoother zoom with many events. The gesture then only moves and resizes the
         * bars rendered when it started, no new bars are rendered. Bars leaving the view are removed, and brought back
         * if they return during the gesture. Its cost is bounded by what was on screen when it started. The view is
         * fully updated when the gesture ends.
         *
         * Toggle it below and zoom with Ctrl + mouse wheel, a trackpad pinch or the slider, to compare:
         *
         * {@inlineexample Scheduler/view/mixin/SchedulerZoomable.js}
         *
         * During the gesture bars do not go through the usual render loop:
         * * Only the bars' position and size along the time axis are updated, any `eventRenderer` or similar is not
         *   called
         * * The {@link Scheduler.view.Scheduler#event-renderEvent} and
         *   {@link Scheduler.view.Scheduler#event-releaseEvent} events are not triggered for the bars
         * * Bars which were not rendered when it started are not drawn, also when scrolling. Where a resource has
         *   such events on either side of the view, a neutral placeholder bar (`.b-placeholder`) spans them
         * * Changes to the data are not reflected
         * * Dependencies are hidden
         *
         * The events are always laid out normally when:
         * * Using a non-continuous time axis
         * * Stretching bars using {@link Scheduler.view.Scheduler#config-fillTicks}
         * * Widening milestones using {@link Scheduler.view.Scheduler#config-milestoneLayoutMode}
         * * Using a custom {@link Scheduler.view.Scheduler#config-eventLayout} `layoutFn`
         *
         * @prp {Boolean}
         * @default
         * @category Zoom
         */
        liveZoom : true
    };

    static delayable = {
        endLayoutReuse : 200
    };

    //region Event layout reuse

    /**
     * Called by the continuous zoom sources before each step. With {@link #config-liveZoom} off, the first step
     * snapshots the bars rendered, which the orientation then scales for the rest of the gesture.
     * @internal
     * @category Zoom
     */
    startLayoutReuse() {
        const
            me                     = this,
            { currentOrientation } = me;

        if (!me.liveZoom && currentOrientation?.supportsLayoutReuse) {
            // First step of the gesture, snapshot the bars currently rendered for the orientation to scale
            if (!me.$reusingEventLayout) {
                currentOrientation.captureRenderedLayouts();
            }

            me.$reusingEventLayout = true;

            // Buffered, so a stream of steps keeps pushing the full layout out ahead of itself
            me.endLayoutReuse();
        }
    }

    /**
     * Ends a gesture which reused the event layout and lays the events out properly.
     * @internal
     * @category Zoom
     */
    endLayoutReuse() {
        const me = this;

        if (me.$reusingEventLayout) {
            me.$reusingEventLayout = false;

            if (me.currentOrientation) {
                me.currentOrientation.releaseRenderedLayouts?.();
                me.currentOrientation.clearAll();
            }

            me.refresh();
        }
    }

    //endregion

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
