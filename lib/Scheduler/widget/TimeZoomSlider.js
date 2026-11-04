import Slider from '../../Core/widget/Slider.js';
import Widget from '../../Core/widget/Widget.js';

/**
 * @module Scheduler/widget/TimeZoomSlider
 */

/**
 * A slider widget for controlling the zoom level of a Scheduler or Gantt component using the smooth zoom
 * system. This widget provides fine-grained control over zoom levels by interpolating between view presets.
 *
 * {@note}This widget requires {@link Scheduler.view.Scheduler#config-smoothZoom} to be enabled on the connected
 * timeline component.{/@note}
 *
 * {@inlineexample Scheduler/widget/TimeZoomSlider.js}
 *
 * Add it to the component's toolbar to connect it automatically:
 *
 * ```javascript
 * new Scheduler({
 *     smoothZoom : true,
 *     tbar : [
 *         { type : 'timezoomslider' }
 *     ]
 * });
 * ```
 *
 * Or specify which Scheduler or Gantt component instance it should connect to using the
 * {@link #config-client} config:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     smoothZoom : true,
 *     // ...
 * });
 *
 * const timeZoomSlider = new TimeZoomSlider({
 *     appendTo : 'someElement',
 *     client   : scheduler
 * });
 * ```
 *
 * @extends Core/widget/Slider
 * @classtype timezoomslider
 * @tier community
 * @widget
 */
export default class TimeZoomSlider extends Slider {
    static $name = 'TimeZoomSlider';

    static type = 'timezoomslider';

    static configurable = {
        /**
         * The Scheduler or Gantt component instance to connect to. If not provided, the widget
         * will attempt to find a timeline component by traversing up the widget hierarchy or querying for one.
         * @config {Scheduler.view.TimelineBase}
         */
        client : null,

        /**
         * The minimum zoom level. If not specified, uses the scheduler's
         * {@link Scheduler.view.Scheduler#property-minZoomLevel}.
         * @config {Number}
         */
        min : null,

        /**
         * The maximum zoom level. If not specified, uses the scheduler's
         * {@link Scheduler.view.Scheduler#property-maxZoomLevel}.
         * @config {Number}
         */
        max : null,

        /**
         * Whether to show the current value in a tooltip or label.
         * @config {Boolean}
         * @default false
         */
        showValue : false,

        /**
         * Whether to show tooltip while dragging.
         * @config {Boolean}
         * @default false
         */
        showTooltip : false,

        /**
         * The icon to use for the slider thumb.
         * @prp {String}
         * @default
         */
        thumbIcon : 'b-icon b-icon-zoom',

        // There are a lot of zoom levels, make it wider than the default slider to give more room for dragging
        width : 200,

        /**
         * @hideconfigs text, step
         */

        step : 1
    };

    // Cache the center date during a drag operation to maintain stable zoom point
    $cachedDate = null;

    construct(config) {
        super.construct(config);

        this.whenVisible('init');
    }

    init() {
        const
            me            = this,
            { scheduler } = me;

        if (scheduler) {
            if (!scheduler.smoothZoom) {
                throw new Error('TimeZoomSlider requires the connected scheduler to have smoothZoom enabled');
            }

            // Initialize min/max from scheduler if not explicitly set
            if (me.min == null) {
                me.min = scheduler.minZoomLevel;
            }
            if (me.max == null) {
                me.max = scheduler.maxZoomLevel;
            }

            // Set initial value to current zoom level
            me.value = scheduler.zoomLevel;

            // Listen for zoom changes from external sources
            scheduler.ion({
                zoomLevelChange : me.onSmoothZoomLevelChange,
                zoomIndexUpdate : me.onZoomIndexUpdate,
                thisObj         : me
            });
        }
    }

    /**
     * Returns the connected timeline component (Scheduler or Gantt).
     * @member {Scheduler.view.TimelineBase}
     * @readonly
     */
    get scheduler() {
        return this.client || this.up(widget => widget.isTimelineBase) || Widget.query(widget => widget.isTimelineBase);
    }

    updateSchedulerZoom() {
        const
            me            = this,
            { scheduler } = me;

        if (scheduler?.smoothZoom) {
            // Cache the center date at the start of the drag to maintain stable zoom point
            if (!me.$cachedDate) {
                me.$cachedDate = scheduler.viewportCenterDate;
            }

            // Don't optimize in Gantt, it performs better anyway and does not have same rendering path as Scheduler
            scheduler.$wheelZooming = !scheduler.isGanttBase;

            // Dragging the slider is a continuous gesture, so reuse the event layout until it stops
            scheduler.startLayoutReuse?.();

            scheduler.setSmoothZoomLevel(
                me.value,
                me.$cachedDate,
                scheduler.timeAxisViewModel.availableSpace / 2
            );

            scheduler.$wheelZooming = false;
        }
    }

    /**
     * Called when the slider value changes during dragging (continuous updates).
     * @private
     */
    onInternalInput() {
        this.updateSchedulerZoom();

        super.onInternalInput();
    }

    updateValue(newValue, oldValue) {
        super.updateValue(newValue, oldValue);

        if (!this.isConfiguring) {
            this.updateSchedulerZoom();
        }
    }

    /**
     * Called when the slider drag operation completes.
     * @private
     */
    onInternalChange() {
        // Clear cached date when drag ends
        this.$cachedDate = null;

        super.onInternalChange();
    }

    onZoomIndexUpdate() {
        const { scheduler } = this;
        this.min = scheduler.minZoomLevel;
        this.max = scheduler.maxZoomLevel;
        this.value = scheduler.zoomLevel;
    }

    /**
     * Called when the scheduler's zoom level changes from an external source.
     * @private
     */
    onSmoothZoomLevelChange({ zoomLevel }) {
        // Prevent feedback loop - only update if value actually differs
        if (this.value !== zoomLevel) {
            this.value = zoomLevel;
        }
    }

    // /**
    //  * Updates the slider's max value when the scheduler's smooth zoom index changes.
    //  * Call this if you modify the scheduler's presets after initialization.
    //  */
    // syncWithScheduler() {
    //     const { scheduler } = this;
    //
    //     if (scheduler) {
    //         this.min = scheduler.minSmoothZoomLevel;
    //         this.max = scheduler.maxSmoothZoomLevel;
    //         this.value = scheduler.smoothZoomLevel;
    //     }
    // }
}

// Register this widget type with its Factory
TimeZoomSlider.initClass();
