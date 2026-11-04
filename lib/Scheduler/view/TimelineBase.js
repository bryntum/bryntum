import Base from '../../Core/Base.js';
import TimelineFeature from '../feature/TimelineFeature.js';
import GlobalEvents from '../../Core/GlobalEvents.js';
import GridBase from '../../Grid/view/GridBase.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import FunctionHelper from '../../Core/helper/FunctionHelper.js';
import ResizeMonitor from '../../Core/helper/ResizeMonitor.js';
import Collection from '../../Core/util/Collection.js';
import IdHelper from '../../Core/helper/IdHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

import VersionHelper from '../../Core/helper/VersionHelper.js';
import TimeAxis from '../data/TimeAxis.js';

import TimeAxisViewModel from './model/TimeAxisViewModel.js';
import TimelineDateMapper from './mixin/TimelineDateMapper.js';
import TimelineDomEvents from './mixin/TimelineDomEvents.js';
import TimelineViewPresets from './mixin/TimelineViewPresets.js';
import TimelineZoomable from './mixin/TimelineZoomable.js';
import TimelineSmoothZoom from './mixin/TimelineSmoothZoom.js';
import TimelineEventRendering from './mixin/TimelineEventRendering.js';
import TimelineEarlyPositioning from './mixin/TimelineEarlyPositioning.js';
import TimelineScroll from './mixin/TimelineScroll.js';
import TimelineState from './mixin/TimelineState.js';

import './TimeAxisSubGrid.js';
import '../../Grid/feature/RegionResize.js';

DomHelper.loadStylesheet('Scheduler/view/TimelineBase.css');

// import Stylesheet from './TimelineBase.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TimelineBase');

/**
 * @module Scheduler/view/TimelineBase
 */

const
    inRange = (v, r0, r1) => (r0 == null)
        ? (r1 == null || v < r1)
        : (r1 == null)
            ? v >= r0
            : (r0 < r1)
                ? (r0 <= v && v < r1)       // 5 in [1, 10]  (after 1 and before 10)
                : (v < r1 || r0 <= v),      // 5 in [10, 1]  (after 10 or before 1)
    isWorkingTime = (d, wt) => inRange(d.getDay(), wt.fromDay, wt.toDay) && inRange(d.getHours(), wt.fromHour, wt.toHour),
    emptyObject   = {};

/**
 * Options accepted by the Scheduler's {@link Scheduler.view.Scheduler#config-visibleDate} property.
 *
 * @typedef {Object} VisibleDate
 * @property {Date} date The date to bring into view.
 * @property {'start'|'end'|'center'|'nearest'} [block] How far to scroll the date.
 * @property {Number} [edgeOffset] edgeOffset A margin around the date to bring into view.
 * @property {AnimateScrollOptions|Boolean|Number} [animate] Set to `true` to animate the scroll by 300ms,
 * or the number of milliseconds to animate over, or an animation config object.
 */

/**
 * Abstract base class used by timeline based components such as Scheduler and Gantt. Based on Grid, supplies a "locked"
 * region for columns and a "normal" for rendering of events etc.
 *
 * ## See also
 *
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 * - {@link Scheduler.preset.ViewPreset} - Time axis configuration
 * - {@link Scheduler.data.TimeAxis} - Time axis store
 *
 * @abstract
 *
 * @mixes Scheduler/view/mixin/TimelineDateMapper
 * @mixes Scheduler/view/mixin/TimelineDomEvents
 * @mixes Scheduler/view/mixin/TimelineEventRendering
 * @mixes Scheduler/view/mixin/TimelineZoomable
 * @mixes Scheduler/view/mixin/TimelineSmoothZoom
 * @mixes Scheduler/view/mixin/TimelineScroll
 * @mixes Scheduler/view/mixin/TimelineState
 * @mixes Scheduler/view/mixin/TimelineViewPresets
 * @mixes Scheduler/view/mixin/RecurringEvents
 *
 * @extends Grid/view/Grid
 */
export default class TimelineBase extends GridBase.mixin(
    TimelineDateMapper,
    TimelineDomEvents,
    TimelineEventRendering,
    TimelineEarlyPositioning,
    TimelineZoomable,
    TimelineSmoothZoom,
    TimelineScroll,
    TimelineState,
    TimelineViewPresets

) {

    // Timeline-level features. SchedulerBase and GanttBase narrow this to their own factories.
    static get featureable() {
        return {
            factory   : TimelineFeature,
            transform : TimelineFeature.transformConfig
        };
    }
    //region Config

    static $name = 'TimelineBase';

    // Factoryable type name
    static type = 'timelinebase';

    static configurable = {
        partnerSharedConfigs : {
            value : ['timeAxisViewModel', 'timeAxis', 'viewPreset', 'infiniteScroll', 'smoothZoom'],

            $config : {
                merge : 'distinct'
            }
        },

        /**
         * Get/set startDate. Defaults to current date if none specified.
         *
         * When using {@link #config-infiniteScroll}, use {@link #config-visibleDate} to control initially visible date
         * instead.
         *
         * **Note:** If you need to set start and end date at the same time, use {@link #function-setTimeSpan} method.
         * @member {Date} startDate
         * @category Common
         */
        /**
         * The start date of the timeline (if not configure with {@link #config-infiniteScroll}).
         *
         * If omitted, and a TimeAxis has been set, the start date of the provided {@link Scheduler.data.TimeAxis} will
         * be used. If no TimeAxis has been configured, it'll use the start/end dates of the loaded event dataset. If no
         * date information exists in the event data set, it defaults to the current date and time.
         *
         * If a string is supplied, it will be parsed using
         * {@link Core/helper/DateHelper#property-defaultFormat-static DateHelper.defaultFormat}.
         *
         * When using {@link #config-infiniteScroll}, use {@link #config-visibleDate} to control initially visible date
         * instead.
         *
         * **Note:** If you need to set start and end date at the same time, use the {@link #function-setTimeSpan} method.
         * @config {Date|String}
         * @category Common
         */
        startDate : {
            $config : {
                equal : 'date'
            },
            value : null
        },

        /**
         * Get/set endDate. Defaults to startDate + default span of the used ViewPreset.
         *
         * **Note:** If you need to set start and end date at the same time, use {@link #function-setTimeSpan} method.
         * @member {Date} endDate
         * @category Common
         */
        /**
         * The end date of the timeline (if not configure with {@link #config-infiniteScroll}).
         *
         * If omitted, it will be calculated based on the {@link #config-startDate} setting and the 'defaultSpan'
         * property of the current {@link #config-viewPreset}.
         *
         * If a string is supplied, it will be parsed using
         * {@link Core/helper/DateHelper#property-defaultFormat-static DateHelper.defaultFormat}.
         *
         * **Note:** If you need to set start and end date at the same time, use the {@link #function-setTimeSpan} method.
         * @config {Date|String}
         * @category Common
         */
        endDate : {
            $config : {
                equal : 'date'
            },
            value : null
        },

        /**
         * Get/set start date limit of the timeline.
         * Actions such as timeline scrolling, all types of timeline zooms and shifts
         * will respect this limit.
         * @prp {Date|String}
         * @category Common
         */
        minDate : null,

        /**
         * Get/set end date limit of the timeline.
         * Actions such as timeline scrolling, all types of timeline zooms and shifts
         * will respect this limit.
         * @prp {Date|String}
         * @category Common
         */
        maxDate : null,

        /**
         * Partners this Timeline panel with another Timeline in order to sync their region sizes (sub-grids like locked, normal will get the same width),
         * start and end dates, view preset, zoom level and scrolling position. All these values will be synced with the timeline defined as the `partner`.
         *
         * Can be specified as:
         * - A Timeline instance reference
         * - A string selector: widget type (e.g. `'gantt'`), id selector (e.g. `'#myGantt'`), or attribute selector (e.g. `'[ref=myGantt]'`)
         *
         * - To add a new partner dynamically see {@link #function-addPartner} method.
         * - To remove existing partner see {@link #function-removePartner} method.
         * - To check if timelines are partners see {@link #function-isPartneredWith} method.
         *
         * Column widths and hide/show state are synced between partnered schedulers when the column set is identical.
         * @config {Scheduler.view.TimelineBase|String}
         * @category Time axis
         */
        partner : null,

        /**
         * When set, the text in the major time axis header sticks in the scrolling viewport as long as possible.
         * @config {Boolean}
         * @default
         * @category Time axis
         */
        stickyHeaders : true,

        /**
         * A scrolling `options` object describing the scroll action, including a `date` option
         * which references a `Date`. See {@link #function-scrollToDate} for details about scrolling options.
         *
         * ```javascript
         *     // The date we want in the center of the Scheduler viewport
         *     myScheduler.visibleDate = {
         *         date    : new Date(2023, 5, 17, 12),
         *         block   : 'center',
         *         animate : true
         *     };
         * ```
         * @member {Object} visibleDate
         * @category Common
         */
        /**
         * A date to bring into view initially on the scrollable timeline.
         *
         * This may be configured as either a `Date` or a scrolling `options` object describing
         * the scroll action, including a `date` option which references a `Date`.
         *
         * See {@link #function-scrollToDate} for details about scrolling options.
         *
         * Note that if a naked `Date` is passed, it will be stored internally as a scrolling options object
         * using the following defaults:
         *
         * ```javascript
         * {
         *     date  : <The Date object>,
         *     block : 'nearest'
         * }
         * ```
         *
         * This moves the date into view by the shortest scroll, so that it just appears at an edge.
         *
         * To bring your date of interest to the center of the viewport, configure your
         * Scheduler thus:
         *
         * ```javascript
         *     visibleDate : {
         *         date  : new Date(2023, 5, 17, 12),
         *         block : 'center'
         *     }
         * ```
         * @config {Date|VisibleDate}
         * @category Common
         */
        visibleDate : null,

        /**
         * CSS class to add to rendered events
         * @config {String}
         * @category CSS
         * @private
         */
        eventCls : null,

        /**
         * Set to `true` to force the time columns to fit to the available space (horizontal or vertical depends on mode).
         * Note that setting {@link #config-suppressFit} to `true`, will disable `forceFit` functionality. Zooming
         * cannot be used when `forceFit` is set.
         * @prp {Boolean}
         * @default
         * @category Time axis
         */
        forceFit : false,



        /**
         * By default the row hover effect is not visible in the Scheduler part of the grid.
         *
         * Set this to `false` to show the hover effect in Scheduler rows.
         * @prp {Boolean} hideRowHover
         * @default true
         * @category Misc
         */
        hideRowHover : {
            $config : 'lazy',
            value   : true
        },

        /**
         * A valid JS day index between 0-6 (0: Sunday, 1: Monday etc.) to be considered the start day of the week.
         * When omitted, the week start day is retrieved from the active locale class.
         * @config {Number} weekStartDay
         * @category Time axis
         */

        /**
         * An object with format `{ fromDay, toDay, fromHour, toHour }` that describes the working days and hours.
         * This object will be used to populate TimeAxis {@link Scheduler.data.TimeAxis#config-include} property.
         *
         * Using it results in a non-continuous time axis. Any ticks not covered by the working days and hours will
         * be excluded. Events within larger ticks (for example if using week as the unit for ticks) will be
         * stretched to fill the gap otherwise left by the non-working hours.
         *
         * As with end dates, `toDay` and `toHour` are exclusive. Thus `toDay : 6` means that day 6 (saturday) will
         * not be included.
         *
         * **NOTE:** When this feature is enabled {@link Scheduler.view.mixin.TimelineZoomable Zooming feature} is
         * not supported. It's recommended to disable zooming controls:
         *
         * ```javascript
         * new Scheduler({
         *     zoomOnMouseWheel          : false,
         *     zoomOnTimeAxisDoubleClick : false,
         *     ...
         * });
         * ```
         *
         * @prp {Object} workingTime
         * @property {Number} [workingTime.fromDay] Day index 0-6 (0 is Sunday)
         * @property {Number} [workingTime.toDay] Day index 0-6 (0 is Sunday)
         * @property {Number} [workingTime.fromHour] 0-23
         * @property {Number} [workingTime.toHour] 0-23
         * @category Time axis
         */
        workingTime : null,

        /**
         * Affects drag drop and resizing of events when {@link Scheduler/view/mixin/TimelineDateMapper#config-snap}
         * is enabled.
         *
         * If set to `true`, dates will be snapped relative to event start. e.g. for a zoom level with
         * `timeResolution = { unit: "s", increment: "20" }`, an event that starts at 10:00:03 and is dragged would
         * snap its start date to 10:00:23, 10:00:43 etc.
         *
         * When set to `false`, dates will be snapped relative to the timeAxis startDate (tick start)
         * - 10:00:03 -> 10:00:20, 10:00:40 etc.
         *
         * @config {Boolean}
         * @default
         * @category Scheduled events
         */
        snapRelativeToEventStartDate : false,

        /**
         * Set to `true` to prevent auto calculating of a minimal {@link Scheduler.view.mixin.TimelineEventRendering#property-tickSize}
         * to always fit the content to the screen size. Setting this property on `true` will disable {@link #config-forceFit} behaviour.
         * @prp {Boolean}
         * @default false
         * @category Time axis
         */
        suppressFit : false,

        /**
         * CSS class to add to cells in the timeaxis column
         * @config {String}
         * @category CSS
         * @private
         */
        timeCellCls : null,

        scheduledEventName : null,

        //dblClickTime : 200,

        /**
         * A CSS class to apply to each event in the view on mouseover.
         * @config {String}
         * @category CSS
         * @private
         */
        overScheduledEventClass : null,

        // allow the panel to prevent adding the hover CSS class in some cases - during drag drop operations
        preventOverCls : false,

        disableGridRowModelWarning : true,

        schedulerRegion : 'normal',

        transitionDuration : 200,
        // internal timer id reference
        animationTimeout   : null,

        /**
         * Region to which columns are added when they have none specified
         * @config {String}
         * @default
         * @category Misc
         */
        defaultRegion : 'locked',

        /**
         * Decimal precision used when displaying durations, used by tooltips and DurationColumn.
         * Specify `false` to use raw value
         * @config {Number|Boolean}
         * @default
         * @category Common
         */
        durationDisplayPrecision : 1,

        asyncEventSuffix : 'PreCommit',

        /**
         * You can set this option to `false` to make the timeline panel start and end on the exact provided
         * {@link #config-startDate}/{@link #config-endDate} w/o adjusting them.
         * @config {Boolean}
         * @default
         * @category Time axis
         */
        autoAdjustTimeAxis : true
    };

    static get defaultConfig() {
        return {
            /**
             * A backing data store of 'ticks' providing the input date data for the time axis of timeline panel.
             * @member {Scheduler.data.TimeAxis} timeAxis
             * @readonly
             * @category Time axis
             */

            /**
             * A {@link Scheduler.data.TimeAxis} config object or instance, used to create a backing data store of
             * 'ticks' providing the input date data for the time axis of timeline panel. Created automatically if none
             * supplied.
             * @config {TimeAxisConfig|Scheduler.data.TimeAxis}
             * @category Time axis
             */
            timeAxis : null,

            /**
             * The backing view model for the visual representation of the time axis.
             * Either a real instance or a simple config object.
             * @private
             * @config {Scheduler.view.model.TimeAxisViewModel|TimeAxisViewModelConfig}
             * @category Time axis
             */
            timeAxisViewModel : null
        };
    }

    timeCellSelector = '.b-sch-time-axis-cell';



    get hasTimelineBoundaries() {
        return Boolean(this.minDate || this.maxDate);
    }

    //endregion

    //region Feature hooks

    /**
     * Populates the event context menu. Chained in features to add menu items.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown.
     * @param {Scheduler.model.EventModel} options.eventRecord The context event.
     * @param {Scheduler.model.ResourceModel} options.resourceRecord The context resource.
     * @param {Scheduler.model.AssignmentModel} options.assignmentRecord The context assignment if any.
     * @param {Object<String,MenuItemEntry>} options.items A named object to describe menu items.
     * @internal
     */
    populateEventMenu() {}

    /**
     * Populates the time axis context menu. Chained in features to add menu items.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown.
     * @param {Scheduler.model.ResourceModel} options.resourceRecord The context resource.
     * @param {Date} options.date The Date corresponding to the mouse position in the time axis.
     * @param {Object<String,MenuItemEntry>} options.items A named object to describe menu items.
     * @internal
     */
    populateScheduleMenu() {}

    // Called when visible date range potentially changes such as when scrolling in
    // the time axis.
    internalOnVisibleDateRangeChange(range) {
        if (!this.handlingVisibleDateRangeChange) {
            const
                me                              = this,
                { _visibleDateRange, timeView } = me,
                dateRangeChange                 = !_visibleDateRange || (_visibleDateRange.startDate - range.startDate || _visibleDateRange.endDate - range.endDate);

            if (dateRangeChange) {
                // timeView may not exist yet during mode switch initialization
                if (timeView) {
                    timeView.range = range;
                }
                me.handlingVisibleDateRangeChange = true;

                /**
                 * Fired when the range of dates visible within the viewport changes. This will be when
                 * scrolling along a time axis.
                 *
                 * __Note__ that this event will fire frequently during scrolling, so any listener
                 * should probably be added with the `buffer` option to slow down the calls to your
                 * handler function :
                 *
                 * ```javascript
                 * listeners : {
                 *     visibleDateRangeChange({ old, new }) {
                 *         this.updateRangeRequired(old, new);
                 *     },
                 *     // Only call once. 300 ms after the last event was detected
                 *     buffer : 300
                 * }
                 * ```
                 * @event visibleDateRangeChange
                 * @param {Scheduler.view.Scheduler} source This Scheduler instance.
                 * @param {Object} old The old date range
                 * @param {Date} old.startDate the old start date.
                 * @param {Date} old.endDate the old end date.
                 * @param {Object} new The new date range
                 * @param {Date} new.startDate the new start date.
                 * @param {Date} new.endDate the new end date.
                 */
                me.trigger('visibleDateRangeChange', {
                    old : _visibleDateRange,
                    new : range
                });
                me.handlingVisibleDateRangeChange = false;
                me._visibleDateRange              = range;
            }
        }
    }

    // Called when visible resource range changes in vertical mode
    onVisibleResourceRangeChange() {}

    // Called when visible resource column changes in vertical mode
    onVisibleResourceColumnChange() {}

    //endregion

    //region Init

    construct(config = {}) {
        const me = this;

        super.construct(config);

        me.$firstVerticalOverflow = true;

        me.initDomEvents();

        // Ensure the TimeAxisColumn's mode matches the scheduler's before the orientation engine initializes.
        if (me.timeAxisColumn && me.timeAxisColumn.mode !== me.mode) {
            me.timeAxisColumn.mode = me.mode;
        }

        me.currentOrientation.init();

        me.rowManager.ion({
            refresh : () => {
                me.forceLayout = false;
            }
        });
    }

    // Override from Grid.view.GridSubGrids
    createSubGrid(region, config = {}, regions = null) {
        const
            me                = this,
            { stickyHeaders } = me;

        // We are creating the TimeAxisSubGrid
        if (region === (me.schedulerRegion || 'normal')) {
            config.type = 'timeaxissubgrid';
        }

        // The assumption is that if we are in vertical mode, the locked SubGrid
        // is used to house the verticalTimeAxis, and so it must all be overflow:visible
        else if (region === 'locked' && stickyHeaders && me.isVertical) {
            config.scrollable = {
                overflowX : 'visible',
                overflowY : 'visible'
            };
            if (!('resizable' in config)) {
                config.resizable = false;
            }

            // It's the child of the overflowElement
            me.bodyContainer.classList.add('b-sticky-headers');
        }

        return super.createSubGrid(region, config, regions);
    }

    doDestroy() {
        const
            me                                    = this,
            { partneredWith, currentOrientation } = me;

        currentOrientation?.destroy();

        if (me._bodyContainer) {
            ResizeMonitor.removeResizeListener(me._bodyContainer, me.onBodyResize);
        }

        // Break links between this TimeLine and any partners.
        if (partneredWith) {
            for (let i = partneredWith.count - 1; i > -1; --i) {
                const partner = partneredWith.getAt(i);
                me.removePartner(partner);
            }
            partneredWith.destroy();
        }
        else {
            me.timeAxisViewModel.destroy();
            me.timeAxis.destroy();
        }

        super.doDestroy();
    }

    startConfigure(config) {
        const me = this;

        super.startConfigure(config);

        me.onBodyResize = me.onBodyResize.bind(me);

        // When the body height changes, we must update the SchedulerViewport's height
        if (me._bodyContainer) {
            ResizeMonitor.addResizeListener(me._bodyContainer, me.onBodyResize);
        }

        // partner needs to be initialized first so that the various shared
        // configs are assigned first before we default them in.
        me.getConfig('partner');
    }

    onInternalPaint({ firstPaint }) {
        // Upon first paint we need to pass the forceUpdate flag in case we are sharing the TimAxisViewModel
        // with another Timeline which will already have done this.
        if (firstPaint) {
            // Disable features that don't support the current mode before their own onInternalPaint runs
            this.updateFeatureModes?.(this.mode);

            // Take height from container element
            // <remove-on-release>
            // TODO: make flex element inherit height from parent (min-height: 100% doesn't work)
            // </remove-on-release>
            const
                me             = this,
                scrollable     = me.isHorizontal ? me.timeAxisSubGrid.scrollable : me.scrollable,
                // Use exact subpixel available space so that tick size calculation is correct.
                availableSpace = scrollable.element.getBoundingClientRect()[me.isHorizontal ? 'width' : 'height'];

            // silent = true if infiniteScroll. If that is set, TimelineScroll.initScroll which is
            // called by the base class's onInternalPaint reconfigures the TAVM when it initializes.
            me.timeAxisViewModel.update(availableSpace, me.infiniteScroll, true);

            // If infiniteScroll caused the TAVM update to be silent, force the rendering to
            // get hold of the scroll state and visible range
            if (me.infiniteScroll) {
                me.currentOrientation.doUpdateTimeView?.();
            }

            // Lazy config needs to be ingested only when the TimeAxisSubGrid exists
            me.getConfig('hideRowHover');
        }

        super.onInternalPaint(...arguments);
    }

    onGlobalZoomChange() {
        const me = this;

        // ResizeObserver does not fire for browser zoom changes on all platforms, leaving several
        // cached values stale. Manually replicate what the resize path does so the full viewport
        // is rendered correctly after a zoom-in → scroll → zoom-out sequence.

        // 1. GridBase's onGlobalZoomChange will refresh _bodyRectangle and sync the rowManager height
        super.onGlobalZoomChange();

        if (!me.isPainted) {
            return;
        }

        // 2. Clear timeAxisSubGrid width cache. If the window CSS size changed due to zoom-out,
        //    we need its `width` getter to re-measure offsetWidth rather than return a stale cache.
        me.timeAxisSubGrid?.clearWidthCache();

        // 3. Force a full viewport resize: updates TAVM available space → recalculates tick sizes
        //    and visible date range in the header (via doUpdateTimeView); also calls onRenderDone()
        //    to sync events into the DOM for all currently-visible rows.
        //    Passing 0 as old dimensions ensures onViewportResize always triggers onRenderDone().
        me.onSchedulerViewportResize(me.timeAxisSubGrid?.width ?? me.element.offsetWidth, me._bodyRectangle.height, 0, 0);

        // 4. If tick size doesn't change (e.g. forceFit is false), TAVM's availableSpace setter
        //    doesn't trigger an 'update' event, so doUpdateTimeView gets skipped by the normal path.
        //    We must call it explicitly to force the new endDate to be calculated using the new width.
        me.currentOrientation.doUpdateTimeView?.();

        // 5. Explicitly refresh the header cells as a safety net in case the TAVM update alone
        //    did not fully repaint the time axis DOM.
        me.timeAxisColumn?.refreshHeader();
    }

    onSchedulerHorizontalScroll(subGrid, scrollLeft, scrollX, scrollingToCenter) {
        // rerender cells in scheduler column on horizontal scroll to display events in view
        this.currentOrientation.updateFromHorizontalScroll(scrollX);

        super.onSchedulerHorizontalScroll(subGrid, scrollLeft, scrollX, scrollingToCenter);
    }

    /**
     * Overrides initScroll from Grid, listens for horizontal scroll to do virtual event rendering
     * @private
     */
    initScroll() {
        const me = this;

        let frameCount = 0;

        super.initScroll();

        me.ion({
            horizontalScroll : ({ subGrid, scrollLeft, scrollX, scrollingToCenter }) => {
                if (me.isPainted && subGrid === me.timeAxisSubGrid && !me.isDestroying && !me.refreshSuspended) {
                    me.onSchedulerHorizontalScroll(subGrid, scrollLeft, scrollX, scrollingToCenter);
                }
                frameCount++;
            }
        });

        if (me.testPerformance === 'horizontal') {
            me.setTimeout(() => {
                const start     = performance.now();
                let scrollSpeed = 5,
                    direction   = 1;

                const scrollInterval = me.setInterval(() => {
                    scrollSpeed = scrollSpeed + 5;

                    me.scrollX += (10 + Math.floor(scrollSpeed)) * direction;

                    if (direction === 1 && me.scrollX > 5500) {
                        direction   = -1;
                        scrollSpeed = 5;
                    }

                    if (direction === -1 && me.scrollX <= 0) {
                        const
                            done    = performance.now(),
                            elapsed = done - start;

                        const
                            timePerFrame = elapsed / frameCount,
                            fps          = Math.round((1000 / timePerFrame) * 10) / 10;

                        clearInterval(scrollInterval);

                        console.log(me.eventScrollMode, fps + 'fps');
                    }
                }, 0);
            }, 500);
        }
    }

    //endregion

    /**
     * Calls the specified function (returning its return value) and preserves the timeline center
     * point. This is a useful way of retaining the user's visual context while making updates
     * and changes to the view which require major changes or a full refresh.
     * @param {Function} fn The function to call.
     * @param {Object} thisObj The `this` context for the function.
     * @param {...*} args Parameters to the function.
     */
    preserveViewCenter(fn, thisObj = this, ...args) {
        const
            me             = this,
            centerDate     = me.viewportCenterDate,
            result         = fn.apply(thisObj, args),
            scroller       = me.timelineScroller,
            { clientSize } = scroller,
            scrollStart    = Math.max(Math.floor(me.getCoordinateFromDate(centerDate, true) - clientSize / 2), 0);

        scroller.scrollTo(scrollStart, { scrollingToCenter : true });

        return result;
    }

    /**
     * Changes the Scheduler's time axis timespan to the supplied start and end dates.
     * @param {Date|String} newStartDate The new start date
     * @param {Date|String} [newEndDate] The new end date. If omitted or equal to startDate, the
     * {@link Scheduler.preset.ViewPreset#field-defaultSpan} property of the current view preset will be used to calculate the new end date.
     * @param {Object} [options] An object containing modifiers for the time span change operation.
     * @param {Boolean} [options.maintainVisibleStart] Specify as `true` to keep the visible start date stable.
     * @param {Date} [options.visibleDate] The date inside the range to scroll into view
     * @async
     */
    setTimeSpan(newStartDate, newEndDate, options = emptyObject) {
        if (typeof newStartDate === 'string') {
            newStartDate = DateHelper.parse(newStartDate);
        }

        if (typeof newEndDate === 'string') {
            newEndDate = DateHelper.parse(newEndDate);
        }

        const
            me           = this,
            { timeAxis } = me,
            {
                preventThrow = false, // Private, only used by the shift method.
                maintainVisibleStart = false,
                visibleDate
            }            = options,
            {
                startDate,
                endDate
            }            = timeAxis.getAdjustedDates(newStartDate, newEndDate),
            startChanged = timeAxis.startDate - startDate !== 0,
            endChanged   = timeAxis.endDate - endDate !== 0;

        if (startChanged || endChanged) {
            // Clear cached center date and original date range so that the next zoom operation
            // recalculates the new center date and the date range for zoomKeepsOriginalTimespan
            me._originalConfiguredDateRange = null;
            me.cachedCenterDate = null;
            if (maintainVisibleStart) {
                const
                    {
                        timeAxisViewModel
                    }             = me,
                    { totalSize } = timeAxisViewModel,
                    oldTickSize   = timeAxisViewModel.tickSize,
                    scrollable    = me.timelineScroller,
                    currentScroll = scrollable.position,
                    visibleStart  = timeAxisViewModel.getDateFromPosition(currentScroll);

                // If the current visibleStart is in the new range, maintain it
                // So that there is no visual jump.
                if (visibleStart && visibleStart >= startDate && visibleStart < endDate) {
                    // We need to correct the scroll position as soon as the TimeAxisViewModel
                    // has updated itself and before any other UI updates which that may trigger.
                    timeAxisViewModel.ion({
                        update() {
                            const tickSizeChanged = timeAxisViewModel.tickSize !== oldTickSize;

                            // Ensure the canvas element matches the TimeAxisViewModel's new totalSize.
                            // This creates the required scroll range to be able to have the scroll
                            // position correct before any further UI updates.
                            me.updateCanvasSize();

                            // If *only* the start moved, we can keep scroll position the same
                            // by adjusting it by the amount the start moved.
                            if (startChanged && !endChanged && !tickSizeChanged) {
                                scrollable.position += (timeAxisViewModel.totalSize - totalSize);
                            }
                            // If only the end has changed, and tick size is same, we can maintain
                            // the same scroll position.
                            else if (!startChanged && !tickSizeChanged) {
                                scrollable.position = currentScroll;
                            }
                            // Fall back to restoring the position by restoring the visible start time
                            else {
                                scrollable.position = timeAxisViewModel.getPositionFromDate(visibleStart);
                            }

                            // Force partners to sync with what we've just done to reset the scroll.
                            // We are now in control.
                            scrollable.syncPartners(true);
                        },
                        prio : 10000,
                        once : true
                    });
                }
            }

            if (me.lastViewPresetOptions) {
                // When we change a view preset it has additional options which is an object with start/end/center.
                // When time span is changed we need to update those options to make sure that we properly enable
                // preset changer logic to reapply preset with new start/end/center.
                me.lastViewPresetOptions = { startDate, endDate };
            }

            const returnValue = timeAxis.reconfigure({
                startDate,
                endDate
            }, false, preventThrow);

            if (visibleDate) {
                return me.scrollToDate(visibleDate, options).then(() => returnValue);
            }

            return returnValue;
        }
    }

    bindStore(store) {
        super.bindStore?.(store);

        this.detachListeners('selectionRevisionLifecycle');

        // Snapshot and restore selection around engine revision-apply rebase. See #10945.
        store.project?.ion({
            name                  : 'selectionRevisionLifecycle',
            startApplyingRevision : 'onProjectStartApplyingRevision',
            stopApplyingRevision  : 'onProjectStopApplyingRevision',
            thisObj               : this
        });
    }

    unbindStore(oldStore) {
        this.detachListeners('selectionRevisionLifecycle');

        super.unbindStore(oldStore);
    }

    //region Config getters/setters
    /**
     * Returns the TimeAxisColumn instance
     * @member {Scheduler.column.TimeAxisColumn|Scheduler.column.VerticalTimeAxisColumn} timeAxisColumn
     * @readonly
     * @category Time axis
     */

    /**
     * Returns `true` if any of the events/tasks or feature injected elements (such as ResourceTimeRanges) are within
     * the {@link #config-timeAxis}
     * @member {Boolean}
     * @readonly
     * @category Scheduled events
     */
    get hasVisibleEvents() {
        const { timeAxis } = this;

        return !this.noFeatureElementsInAxis() || this.eventStore.storage.values.some(t =>
            timeAxis.isTimeSpanInAxis(t) ||
            (t.isRecurring && t.hasOccurrencesInDateRange(timeAxis.startDate, timeAxis.endDate))
        );
    }

    // Template function to be chained in features to determine if any elements are in time axis (needed since we cannot
    // currently chain getters). Negated to not break chain. First feature that has elements visible returns false,
    // which prevents other features from being queried.
    noFeatureElementsInAxis() { }

    // Private getter used to piece together event names such as beforeEventDrag / beforeTaskDrag. Could also be used
    // in templates.
    get capitalizedEventName() {
        if (!this._capitalizedEventName) {
            this._capitalizedEventName = StringHelper.capitalize(this.scheduledEventName);
        }

        return this._capitalizedEventName;
    }

    updatePartner(partner) {
        // Resolve string selector or pass-through widget instance
        partner = TimelineBase.query(partner, true);
        if (partner) {
            this.addPartner(partner);
        }
    }

    /**
     * Partners this Timeline with the passed Timeline in order to sync the horizontal scrolling position and zoom level.
     *
     * - To remove existing partner see {@link #function-removePartner} method.
     * - To get the list of partners see {@link #property-partners} getter.
     *
     * The following properties are imported into this component from the added partner and shared:
     *
     * - {@link #property-timeAxisViewModel}
     * - {@link #property-timeAxis}
     * - {@link #property-viewPreset}
     *
     * In a set of partnered Timelines, there will only be a single instance of the above properties.
     * The time range and scroll position in that time range are always the same among all
     * partnered timelines.
     *
     * @param {Scheduler.view.TimelineBase} otherTimeline The timeline to partner with
     */
    addPartner(partner) {
        const me = this;

        if (!me.isPartneredWith(partner)) {
            if (me._partner == null) {
                me._partner = partner;
            }
            const partneredWith = me.partneredWith || (me.partneredWith = new Collection());

            // Each must know about the other so that they can sync others upon region resize
            partneredWith.add(partner);

            (partner.partneredWith || (partner.partneredWith = new Collection())).add(me);

            // Flush through viewPreset initGetter so that the setup in setConfig doesn't
            // take them to be the class's defined getters.
            me.getConfig('viewPreset');
            me.getConfig('infiniteScroll');

            partner.ion({
                presetchange : 'onPartnerPresetChange',
                thisObj      : me
            });

            // collect configs that are meant to be shared between partners
            const partnerSharedConfig = me.partnerSharedConfigs.reduce((config, configName) => {
                config[configName] = partner[configName];
                return config;
            }, {});

            // We have to use the same tick size as the partner,
            // and we have to sync to its scroll position
            partnerSharedConfig.viewPreset.options = {
                scrollPosition : partner.timelineScroller.position,
                tickSize       : partner.tickSize
            };

            me._ownTimeAxis = me.timeAxis;
            me._ownTimeAxisViewModel = me.timeAxisViewModel;
            me.setConfig(partnerSharedConfig);

            me.ion({
                presetchange : 'onPartnerPresetChange',
                thisObj      : partner
            });

            if (me.isPainted) {
                partner.scrollable.addPartner(me.scrollable, me.isHorizontal ? 'x' : 'y');

                partner.syncPartnerSubGrids();
            }
            else {
                // When initScroll comes round, make sure it syncs with the partner
                me.initScroll = FunctionHelper.createSequence(me.initScroll, () => {
                    partner.scrollable.addPartner(me.scrollable, me.isHorizontal ? 'x' : 'y');
                    partner.syncPartnerSubGrids();
                }, me);
            }
        }
    }

    /**
     * Breaks the link between current Timeline and the passed Timeline
     *
     * - To add a new partner see {@link #function-addPartner} method.
     * - To get the list of partners see {@link #property-partners} getter.
     *
     * @param {Scheduler.view.TimelineBase} otherTimeline The timeline to unlink from
     */
    removePartner(partner) {
        const
            me                = this,
            { partneredWith, timeAxis } = me;

        if (me.isPartneredWith(partner)) {
            if (me._partner === partner) {
                me._partner = null;
            }
            partneredWith.remove(partner);
            me.scrollable.removePartner(partner.scrollable);
            me.un({
                presetchange : 'onPartnerPresetChange',
                thisObj      : partner
            });

            const { scrollLeft, scrollTop } = partner;

            partner.removePartner(me, true);

            if (timeAxis.owner !== me && !me.isDestroying) {
                // <remove-on-release>
                Base.skipDestroyCheck = true;
                // </remove-on-release>
                me.timeAxis = {
                    ...partner.timeAxis.getCurrentConfig({ skip : { owner : 1 } }),
                    owner : me
                };

                const config = partner.timeAxisViewModel.getCurrentConfig({ skip : { owner : 1, timeAxis : 1, internalListeners : 1 } });
                me.timeAxisViewModel = {
                    ...config,
                    owner    : me,
                    timeAxis : me.timeAxis
                };
                me.scrollLeft = scrollLeft;
                me.scrollTop = scrollTop;

                me.timeAxisViewModel.update(me.timeAxisSubGridElement.getBoundingClientRect()[me.isHorizontal ? 'width' : 'height']);
                // <remove-on-release>
                Base.skipDestroyCheck = false;
                // </remove-on-release>
            }
        }
    }

    /**
     * Checks whether the passed timeline is partnered with the current timeline.
     * @param {Scheduler.view.TimelineBase} partner The timeline to check the partnering with
     * @returns {Boolean} Returns `true` if the timelines are partnered
     */
    isPartneredWith(partner) {
        return Boolean(this.partneredWith?.includes(partner));
    }

    onPartnerPresetChange({ preset, startDate, endDate, centerDate, zoomDate, zoomPosition, zoomLevel, tickSize, notScroll }) {
        if (!this._viewPresetChanging && this.viewPreset !== preset) {

            // Passed through to the viewPreset changing method
            preset.options  = {
                startDate,
                endDate,
                centerDate,
                zoomDate,
                zoomPosition,
                zoomLevel,
                tickSize,
                notScroll
            };
            this.viewPreset = preset;
        }
    }

    /**
     * Returns the partnered timelines.
     *
     * - To add a new partner see {@link #function-addPartner} method.
     * - To remove existing partner see {@link #function-removePartner} method.
     *
     * @readonly
     * @member {Scheduler.view.TimelineBase[]} partners
     * @category Time axis
     */
    get partners() {
        const partners = this.partner ? [this.partner] : [];

        if (this.partneredWith) {
            partners.push.apply(partners, this.partneredWith.allValues);
        }

        return [...new Set(partners)];
    }

    get timeAxisColumn() {
        return this.columns && this._timeAxisColumn;
    }

    async show(...args) {
        await super.show(...args);

        this.partner?.eachSubGrid(subGrid => subGrid.scrollable.syncPartners());
    }

    changeColumns(columns, currentStore) {
        const me = this;
        let timeAxisColumnIndex,
            { timeAxisColumnConfig } = me;

        // No columns means destroy
        if (columns) {
            const isArray = Array.isArray(columns);

            let cols = columns;

            if (!isArray) {
                cols = columns.data;
            }

            timeAxisColumnIndex = cols && cols.length;

            cols.some((col, index) => {
                if (col.type === 'timeAxis') {
                    timeAxisColumnIndex  = index;
                    timeAxisColumnConfig = ObjectHelper.assign(col, me.timeAxisColumn);
                    return true;
                }
                return false;
            });

            // <remove-on-release>
            // TODO: Move to Scheduler
            // </remove-on-release>
            if (me.isVertical) {
                // Preserve the discarded (locked) column configs on _horizontalLockedColumns so a later runtime switch
                // to horizontal can restore them
                me._horizontalLockedColumns = cols.filter(col => col.type !== 'timeAxis' && col.type !== 'verticalTimeAxis');

                cols = [
                    ObjectHelper.assign({
                        type : 'verticalTimeAxis'
                    }, me.verticalTimeAxisColumn),
                    // Make space for a regular TimeAxisColumn after the VerticalTimeAxisColumn
                    cols[timeAxisColumnIndex]
                ];

                timeAxisColumnIndex = 1;
            }
            else {
                // We're going to mutate this array which we do not own, so copy it first.
                cols = cols.slice();
            }

            // Fix up the timeAxisColumn config in place
            cols[timeAxisColumnIndex] = this._timeAxisColumn || ObjectHelper.assign({
                type    : 'timeAxis',
                cellCls : me.timeCellCls,
                mode    : me.mode
            }, timeAxisColumnConfig);

            // If we are passed a raw array, or the Store we are passed is owned by another
            // Scheduler, pass the raw column data ro the Grid's changeColumns
            if (isArray || (columns.isStore && columns.owner !== this)) {
                columns = cols;
            }
            else {
                columns.data = cols;
            }
        }

        return super.changeColumns(columns, currentStore);
    }

    updateColumns(columns, was) {
        super.updateColumns(columns, was);

        // Extract the known columns by type. Sorting will have placed them into visual order.
        if (columns) {
            const
                me             = this,
                timeAxisColumn = me._timeAxisColumn = me.columns.find(c => c.isTimeAxisColumn);

            if (me.isVertical) {
                me.verticalTimeAxisColumn = me.columns.find(c => c.isVerticalTimeAxisColumn);
                me.verticalTimeAxisColumn.relayAll(me);
            }

            // Set up event relaying early
            timeAxisColumn.relayAll(me);
        }
    }

    onColumnsChanged({ action, changes, record : column, records }) {
        const { timeAxisColumn, columns } = this;
        // If someone replaces the column set (syncing leads to batch), ensure time axis is always added
        if ((action === 'dataset' || action === 'batch') && !columns.includes(timeAxisColumn)) {
            columns.add(timeAxisColumn, true);
        }
        // <remove-on-release>
        // TODO: Have ResourceHeader call this directly instead of relying on event?
        // </remove-on-release>
        else if (column === timeAxisColumn && 'width' in changes) {
            this.updateCanvasSize();
        }

        column && this.partneredWith?.forEach(partner => {
            const partnerColumn = partner.columns.getAt(column.allIndex);

            if (partnerColumn?.shouldSync(column)) {
                const partnerChanges = {};
                for (const k in changes) {
                    partnerChanges[k] = changes[k].value;
                }
                partnerColumn.set(partnerChanges);
            }
        });

        super.onColumnsChanged(...arguments);
    }

    get timeView() {
        const me = this;
        // Maintainer, we need to ensure that the columns property is initialized
        // if this getter is called at configuration time before columns have been ingested.
        return me.columns && me.isVertical
            ? me.verticalTimeAxisColumn?.view
            : me.timeAxisColumn?.timeAxisView;
    }

    /**
     * Refreshes the time axis view — the cells rendering the {@link #config-timeAxis} ticks, shown along the top
     * in `horizontal` mode and down the side in `vertical` mode. Use it after changing something the tick cells render
     * from which the time axis itself does not know about.
     *
     * ```javascript
     * // Accent the ticks a booking spans, then repaint the axis once
     * for (const tick of scheduler.timeAxis.ticks) {
     *     const cls = tick.cls;
     *
     *     cls['my-accent'] = tick.startDate < endDate && tick.endDate > startDate;
     *     tick.cls = cls.value;
     * }
     *
     * scheduler.refreshTimeAxis();
     * ```
     *
     * @privateparam {Boolean} [rebuild] Pass `true` to also rebuild the header level definitions, needed when the
     * `ViewPreset` header configuration itself changed rather than just the data it renders
     * @category Time axis
     */
    refreshTimeAxis(rebuild) {
        const { timeView } = this;

        // Before it is rendered the view has no header levels to repaint, and rebuilding them from an empty
        // column config throws. It refreshes itself as part of rendering, so there is nothing to do yet.
        if (timeView?.rendered) {
            timeView.refresh(rebuild);
        }
    }

    updateEventCls(eventCls) {
        const me = this;

        if (!me.eventSelector) {
            // No difference with new rendering, released have 'b-released' only
            me.unreleasedEventSelector = me.eventSelector = `.${eventCls}-wrap`;
        }
        if (!me.eventInnerSelector) {
            me.eventInnerSelector = `.${eventCls}`;
        }
    }

    set timeAxisViewModel(timeAxisViewModel) {
        const
            me            = this,
            currentModel  = me._timeAxisViewModel,
            tavmListeners = {
                name    : 'timeAxisViewModel',
                update  : 'internalOnTimeAxisViewModelUpdate',
                prio    : 100,
                thisObj : me
            };

        if (me.isConfiguring && me.initialConfig.partner) {
            // Resolve string selector to widget instance
            const partner = TimelineBase.query(me.initialConfig.partner, true);
            timeAxisViewModel = partner?.timeAxisViewModel;
        }

        if (currentModel && currentModel === timeAxisViewModel) {
            return;
        }

        if (currentModel?.owner === me) {
            // We created this model, destroy it
            currentModel.destroy();
        }

        me.detachListeners('timeAxisViewModel');

        // Getting rid of instanceof check to allow using code from different bundles
        if (timeAxisViewModel?.isTimeAxisViewModel) {
            timeAxisViewModel.ion(tavmListeners);
        }
        else {
            timeAxisViewModel = TimeAxisViewModel.new({
                mode              : me._mode,
                snap              : me.snap,
                forceFit          : me.forceFit,
                timeAxis          : me.timeAxis,
                suppressFit       : me.suppressFit,
                internalListeners : tavmListeners,
                owner             : me
            }, timeAxisViewModel);
        }

        me._timeAxisViewModel = timeAxisViewModel;

        // Replace in dependent classes relying on the model
        if (me.isHorizontal && me.timeAxisColumn) {
            me.timeAxisColumn.timeAxisViewModel = timeAxisViewModel;
        }
        else if (me.isVertical && me.verticalTimeAxisColumn?.view) {
            me.verticalTimeAxisColumn.view.model = timeAxisViewModel;
        }

        me.relayEvents(timeAxisViewModel, ['update'], 'timeAxisViewModel');

        if (currentModel && timeAxisViewModel) {
            me.trigger('timeAxisViewModelChange', { timeAxisViewModel });
        }
    }

    /**
     * The internal view model, describing the visual representation of the time axis.
     * @member {Scheduler.view.model.TimeAxisViewModel}
     * @readonly
     * @category Time axis
     */
    get timeAxisViewModel() {
        if (!this._timeAxisViewModel) {
            this.timeAxisViewModel = null;
        }
        return this._timeAxisViewModel;
    }

    get suppressFit() {
        return this._timeAxisViewModel?.suppressFit ?? this._suppressFit;
    }

    updateSuppressFit(value) {
        if (this._timeAxisViewModel) {
            this.timeAxisViewModel.suppressFit = value;
        }
    }

    set timeAxis(timeAxis) {
        const
            me                = this,
            currentTimeAxis   = me._timeAxis,
            timeAxisListeners = {
                name        : 'timeAxis',
                reconfigure : 'onTimeAxisReconfigure',
                thisObj     : me
            };

        if (me._partner && !timeAxis || (currentTimeAxis && currentTimeAxis === timeAxis)) {
            return;
        }

        if (currentTimeAxis) {
            if (currentTimeAxis.owner === me) {
                // We created this model, destroy it
                currentTimeAxis.destroy();
            }
        }

        me.detachListeners('timeAxis');

        // Getting rid of instanceof check to allow using code from different bundles
        if (!timeAxis?.isTimeAxis) {
            timeAxis = ObjectHelper.assign({
                owner          : me,
                viewPreset     : me.viewPreset,
                autoAdjust     : me.autoAdjustTimeAxis,
                weekStartDay   : me.weekStartDay,
                forceFullTicks : me.fillTicks && me.snap
            }, timeAxis);

            if (me.startDate) {
                timeAxis.startDate = me.startDate;
            }
            if (me.endDate) {
                timeAxis.endDate = me.endDate;
            }

            if (me.workingTime) {
                me.applyWorkingTime(timeAxis);
            }

            timeAxis = new TimeAxis(timeAxis);
        }

        // Inform about reconfiguring the timeaxis, to allow users to react to start & end date changes
        timeAxis.ion(timeAxisListeners);

        me._timeAxis = timeAxis;
    }

    onTimeAxisReconfigure({ config, oldConfig }) {
        if (config) {
            const dateRangeChange = !oldConfig || (oldConfig.startDate - config.startDate || oldConfig.endDate - config.endDate);

            if (dateRangeChange) {
                /**
                 * Fired when the range of dates encapsulated by the UI changes. This will be when
                 * moving a view in time by reconfiguring its {@link #config-timeAxis}. This will happen
                 * when zooming, or changing {@link #config-viewPreset}.
                 *
                 * Contrast this with the {@link #event-visibleDateRangeChange} event which fires much
                 * more frequently, during scrolling along the time axis and changing the __visible__
                 * date range.
                 * @event dateRangeChange
                 * @param {Scheduler.view.TimelineBase} source This Scheduler/Gantt instance.
                 * @param {Object} old The old date range
                 * @param {Date} old.startDate the old start date.
                 * @param {Date} old.endDate the old end date.
                 * @param {Object} new The new date range
                 * @param {Date} new.startDate the new start date.
                 * @param {Date} new.endDate the new end date.
                 */
                this.trigger('dateRangeChange', {
                    old : {
                        startDate : oldConfig.startDate,
                        endDate   : oldConfig.endDate
                    },
                    new : {
                        startDate : config.startDate,
                        endDate   : config.endDate
                    }
                });
            }
        }

        /**
         * Fired when the timeaxis has changed, for example by zooming or configuring a new time span.
         * @event timeAxisChange
         * @param {Scheduler.view.Scheduler} source - This Scheduler
         * @param {Object} config Config object used to reconfigure the time axis.
         * @param {Date} config.startDate New start date (if supplied)
         * @param {Date} config.endDate New end date (if supplied)
         */
        this.trigger('timeAxisChange', { config });
    }

    get timeAxis() {
        if (!this._timeAxis) {
            this.timeAxis = null;
        }
        return this._timeAxis;
    }

    updateForceFit(value) {
        if (this._timeAxisViewModel) {
            this._timeAxisViewModel.forceFit = value;
        }
    }

    updateWorkingTime() {
        if (!this.isConfiguring) {
            this.applyWorkingTime(this.timeAxis);
        }
    }

    // Translates the workingTime configs into TimeAxis#include rules, applies them and then refreshes the header and
    // redraws the events
    applyWorkingTime(timeAxis) {
        const
            me     = this,
            config = me._workingTime;

        if (config) {
            let hour = null;
            // Only use valid values
            if (config.fromHour >= 0 && config.fromHour < 24 && config.toHour > config.fromHour && config.toHour <= 24 && config.toHour - config.fromHour < 24) {
                hour = { from : config.fromHour, to : config.toHour };
            }

            let day = null;
            // Only use valid values
            if (config.fromDay >= 0 && config.fromDay < 7 && config.toDay > config.fromDay && config.toDay <= 7 && config.toDay - config.fromDay < 7) {
                day = { from : config.fromDay, to : config.toDay };
            }

            if (hour || day) {
                timeAxis.include = {
                    hour,
                    day
                };
            }
            else {
                // No valid rules, restore timeAxis
                timeAxis.include = null;
            }
        }
        else {
            // No rules, restore timeAxis
            timeAxis.include = null;
        }

        if (me.isPainted) {
            // Suspend painting so that it's done with transitions later
            me.suspendRefresh();
            // Refreshing header, which also recalculate tickSize and header data
            me.timeAxisColumn.refreshHeader();
            // Update column lines
            me.features.columnLines?.refresh();
            me.resumeRefresh(false);
            // Animate event changes
            me.refreshWithTransition();
        }
    }

    changeMinDate(minDate) {
        if (typeof minDate === 'string') {
            minDate = DateHelper.parse(minDate);
        }
        else if (!DateHelper.isDate(minDate)) {
            minDate = null;
        }
        return minDate;
    }

    updateMinDate(date) {
        if (date) {
            const { startDate, endDate, maxDate } = this;

            // if provided minDate violates maxDate range - reset maxDate value
            if (maxDate && date > maxDate) {
                this._maxDate = null;
            }

            if (date > startDate) {
                // recalculate endDate if date is greater than existing endDate
                this.setStartDate(date, endDate < date);
            }
        }
    }

    isBeforeMinDate(date) {
        return this.minDate && DateHelper.isBefore(date, this.minDate);
    }

    getMinDateOrDate(date) {
        if (this.minDate) {
            return DateHelper.max(this.minDate, date);
        }

        return date;
    }

    changeMaxDate(maxDate) {
        if (typeof maxDate === 'string') {
            maxDate = DateHelper.parse(maxDate);
        }
        else if (!DateHelper.isDate(maxDate)) {
            maxDate = null;
        }
        // Don't nullify maxDate if it's before current minDate - the user may be about to update minDate too.
        // updateMaxDate handles conflicts by nullifying minDate instead.
        return maxDate;
    }

    updateMaxDate(date) {
        if (date) {
            const { startDate, endDate, minDate } = this;

            // if provided maxDate violates minDate range - reset minDate value
            if (minDate && date <= minDate) {
                this._minDate = null;
            }

            if (date < endDate) {
                // recalculate startDate if date is less than existing startDate
                this.setEndDate(date, date < startDate);
            }
        }
    }

    isAfterMaxDate(date) {
        return this.maxDate && DateHelper.isBefore(this.maxDate, date);
    }

    getMaxDateOrDate(date) {
        if (this.maxDate) {
            return DateHelper.min(this.maxDate, date);
        }

        return date;
    }

    changeStartDate(startDate) {
        if (typeof startDate === 'string') {
            startDate = DateHelper.parse(startDate);
        }
        return startDate;
    }

    updateStartDate(date) {
        this.setStartDate(date);
    }

    /**
     * Sets the timeline start date.
     *
     * **Note:**
     * - If you need to set start and end date at the same time, use the {@link #function-setTimeSpan} method.
     * - If keepDuration is false and new start date is greater than end date, it will throw an exception.
     *
     * @param {Date} date The new start date
     * @param {Boolean} keepDuration Pass `true` to keep the duration of the timeline ("move" the timeline),
     * `false` to change the duration ("resize" the timeline). Defaults to `true`.
     */
    setStartDate(date, keepDuration = true) {
        const
            me = this,
            ta = me._timeAxis,
            {
                startDate,
                endDate,
                mainUnit
            }  = ta || emptyObject;

        if (typeof date === 'string') {
            date = DateHelper.parse(date);
        }

        date = me.getMinDateOrDate(date);

        if (ta && endDate) {
            if (date) {
                let calcEndDate = endDate;

                if (keepDuration && startDate) {
                    const diff  = DateHelper.diff(startDate, endDate, mainUnit, true);
                    calcEndDate = DateHelper.add(date, diff, mainUnit);
                }

                me.setTimeSpan(date, calcEndDate);
            }
        }
        else {
            me._tempStartDate = date;
        }
    }

    get startDate() {
        const
            me                     = this,
            { range, workingTime } = me;

        let ret = me._timeAxis?.startDate || me._tempStartDate;

        if (!ret) {
            const date = me.peekConfig('date') || (me.hasTimelineBoundaries && me.visibleDate?.date);

            ret = date || new Date();

            // Snapping the start to the range only applies when used as a Calendar mode, or when a display
            // date has been supplied. A standalone timeline should start at the current date.
            if (range && (me.calendar || date)) {
                ret = DateHelper.floor(ret, range);
                if (me.calendar) {
                    me._tempEndDate = DateHelper.add(ret, range);
                }
            }

            if (workingTime) {
                while (!isWorkingTime(ret, workingTime)) {
                    ret.setHours(ret.getHours() + 1);
                }
            }

            me._tempStartDate = ret;
        }

        return ret;
    }

    changeEndDate(date) {
        this.setEndDate(date);
    }

    /**
     * Sets the timeline end date
     *
     * **Note:**
     * - If you need to set start and end date at the same time, use the {@link #function-setTimeSpan} method.
     * - If keepDuration is false and new end date is less than start date, it will throw an exception.
     *
     * @param {Date} date The new end date
     * @param {Boolean} keepDuration Pass `true` to keep the duration of the timeline ("move" the timeline),
     * `false` to change the duration ("resize" the timeline). Defaults to `false`.
     */
    setEndDate(date, keepDuration = false) {
        const
            me = this,
            ta = me._timeAxis,
            {
                startDate,
                endDate,
                mainUnit
            }  = ta || emptyObject;

        if (typeof date === 'string') {
            date = DateHelper.parse(date);
        }

        date = me.getMaxDateOrDate(date);

        if (ta && startDate) {
            if (date) {
                let calcStartDate = startDate;

                if (keepDuration && endDate) {
                    const diff    = DateHelper.diff(startDate, endDate, mainUnit, true);
                    calcStartDate = DateHelper.add(date, -diff, mainUnit);
                }

                me.setTimeSpan(calcStartDate, date);
            }
        }
        else {
            me._tempEndDate = date;
        }
    }

    get endDate() {
        const me = this;

        if (me._timeAxis) {
            return me._timeAxis.endDate;
        }

        return me._tempEndDate || DateHelper.add(me.startDate, me.viewPreset.defaultSpan, me.viewPreset.mainHeader.unit);
    }

    changeVisibleDate(options) {
        // Accept visibleDate : '2024-01-01'
        if (typeof options === 'string') {
            return this.changeVisibleDate({ date : options });
        }
        if (options instanceof Date) {
            return { date : options, block : this.isConfiguring ? 'start' : 'nearest' };
        }
        if (options instanceof Object) {
            return {
                ...options,
                date  : typeof options.date === 'string' ? DateHelper.parse(options.date) : options.date,
                block : options.block || (this.isConfiguring ? 'start' : 'nearest')
            };
        }
    }

    updateVisibleDate(options) {
        const me = this;

        // Infinite scroll initialization takes care of its visibleDate after
        // calculating the optimum scroll range in TimelineScroll#initScroll
        if (!(me.infiniteScroll && me.isConfiguring)) {
            if (me.isPainted) {
                me.scrollToDate(options.date, options);
            }
            else if (!me.visibleDateProcessed) {
                me.whenVisible(() => me.updateVisibleDate(me.visibleDate));
                me.visibleDateProcessed = true;
            }
        }
    }

    get features() {
        return super.features;
    }

    // add region resize by default
    set features(features) {
        features = features === true ? {} : features;

        if (!('regionResize' in features)) {
            features.regionResize = true;
        }

        super.features = features;
    }

    //endregion

    //region Event handlers

    onLocaleChange() {
        super.onLocaleChange();

        const oldAutoAdjust = this.timeAxis.autoAdjust;
        // Time axis should rebuild as weekStartDay may have changed
        this.timeAxis.reconfigure({
            autoAdjust : false
        });

        // Silently set it back to what the user had for next view refresh
        this.timeAxis.autoAdjust = oldAutoAdjust;
    }

    /**
     * Called when the element which encapsulates the Scheduler's visible height changes size.
     * We only respond to *height* changes here. The TimeAxisSubGrid monitors its own width.
     * @param {HTMLElement} element
     * @param {DOMRect} oldRect
     * @param {DOMRect} newRect
     * @private
     */
    onBodyResize(element, oldRect, { width, height }) {
        const me = this;

        // Uncache old value upon element resize, not upon initial sizing
        if (me.isVertical && oldRect && width !== oldRect.width) {
            delete me.timeAxisSubGrid._width;
        }

        const newWidth = me.timeAxisSubGrid.element.offsetWidth;

        // The Scheduler (The Grid) dictates the viewport height.
        // Don't react on first invocation which will be initial size.
        if (me._bodyRectangle && oldRect && (height !== oldRect.height)) {
            me.onSchedulerViewportResize(newWidth, height, newWidth, oldRect.height);
        }
    }

    onSchedulerViewportResize(width, height, oldWidth, oldHeight) {
        const me = this;

        if (!me.isPainted || me.isDestroying) {
            return;
        }

        const
            {
                isHorizontal,
                partneredWith
            } = me;

        me.currentOrientation.onViewportResize(width, height, oldWidth, oldHeight);
        me.updateViewModelAvailableSpace(isHorizontal ? width : Math.floor(height));
        if (partneredWith && !me.isSyncingFromPartner) {
            me.syncPartnerSubGrids();
        }

        /**
         * Fired when the *scheduler* viewport (not the overall Scheduler element) changes size.
         * This happens when the grid changes height, or when the subgrid which encapsulates the
         * scheduler column changes width.
         * @event timelineViewportResize
         * @param {Core.widget.Widget} source - This Scheduler
         * @param {Number} width The new width
         * @param {Number} height The new height
         * @param {Number} oldWidth The old width
         * @param {Number} oldHeight The old height
         */
        me.trigger('timelineViewportResize', { width, height, oldWidth, oldHeight });
    }

    updateViewModelAvailableSpace(space) {
        this.timeAxisViewModel.availableSpace = space;
    }

    internalOnTimeAxisViewModelUpdate() {
        const me = this;

        // Make sure our tickSize is in sync with the actual tickSize, to not have future changes rejected by the
        // config system
        me._tickSize = me.timeAxisViewModel.tickSize;

        if (!me._viewPresetChanging && me.timeAxisSubGrid && !me.timeAxisSubGrid.collapsed) {
            me.updateCanvasSize();
            me.currentOrientation.onTimeAxisViewModelUpdate();
        }
    }

    syncPartnerSubGrids() {
        this.partneredWith.forEach(partner => {
            if (!partner.isSyncingFromPartner) {
                partner.isSyncingFromPartner = true;
                this.eachSubGrid(subGrid => {
                    const partnerSubGrid = partner.subGrids[subGrid.region];

                    // If there is a difference, sync the partner SubGrid state
                    if (partnerSubGrid.width !== subGrid.width) {
                        // When using flexed subgrid, make sure flex values has prio over width
                        if (subGrid.flex) {
                            // If flex values match, resize should be fine without changing anything
                            if (subGrid.flex !== partnerSubGrid.flex) {
                                partnerSubGrid.flex = subGrid.flex;
                            }
                        }
                        // If both subgrids are calculated (non-configured width an all known column widths),
                        // use the width of the widest of the two
                        else if (partnerSubGrid.hasCalculatedWidth && subGrid.hasCalculatedWidth) {
                            const width = Math.max(partnerSubGrid.width, subGrid.width);
                            partnerSubGrid.width = subGrid.width = width;
                            partnerSubGrid.hasCalculatedWidth = subGrid.hasCalculatedWidth = true;
                        }
                        else {
                            partnerSubGrid.width = subGrid.width;
                        }
                    }
                });
                partner.isSyncingFromPartner = false;
            }
        });
    }

    onProjectStartApplyingRevision() {
        // Snapshot by reference — engine mutates instance ids in place via idChange.
        this._preApplyRevisionSelection = this.selectedRecords.slice();
    }

    onProjectStopApplyingRevision() {
        const snapshot = this._preApplyRevisionSelection;
        this._preApplyRevisionSelection = null;

        if (snapshot?.length) {
            const
                { store } = this,
                restored  = snapshot.filter(record => store.includes(record));
            if (restored.length) {
                this.selectedRecords = restored;
            }
        }
    }

    //endregion

    //region Mode

    get currentOrientation() {
        throw new Error('Implement in subclass');
    }

    // Horizontal is the default, overridden in scheduler
    get isHorizontal() {
        return true;
    }

    //endregion

    //region Canvases and elements

    get foregroundCanvas() {
        return this._foregroundCanvas;
    }

    get svgCanvas() {
        const me = this;
        if (!me._svgCanvas) {
            const svg = me._svgCanvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

            svg.setAttribute('id', IdHelper.generateId('svg'));
            svg.classList.add('b-sch-canvas', 'b-sch-dependencies-canvas');
            // To not be recycled by DomSync
            svg.retainElement = true;
            me.timeAxisSubGridElement.appendChild(svg);
            me.timeAxisSubGrid.addCanvas(svg);
            me.trigger('svgCanvasCreated', { svg });
        }
        return me._svgCanvas;
    }

    /**
     * Returns the subGrid containing the time axis
     * @member {Grid.view.SubGrid} timeAxisSubGrid
     * @readonly
     * @category Time axis
     */

    /**
     * Returns the HTML element for the SubGrid containing the time axis
     * @member {HTMLElement}
     * @readonly
     * @category Time axis
     */
    get timeAxisSubGridElement() {
        const me = this;

        // Hit a lot, caching the element (it will never change)

        if (!me._timeAxisSubGridElement) {
            // We need the TimeAxisSubGrid to exist, so regions must be initialized
            me.getConfig('regions');

            me._timeAxisSubGridElement = me.timeAxisColumn?.subGridElement;
        }

        return me._timeAxisSubGridElement;
    }

    updateCanvasSize() {
        const me = this;

        let result = false;

        if (me.isVertical) {
            const { totalSize } = me.timeAxisViewModel;

            // Keep the RowManager's idea of the single dummy row's height in sync with the scroll range set below.
            // With a stale (smaller) height, a scroll past it after zooming in makes RowManager#jumpToPosition look
            // for rows beyond the end of the store
            if (me.store.first) {
                me.rowManager.storeKnownHeight(me.store.first.id, totalSize);
            }

            // Ensure vertical scroll range accommodates the TimeAxis
            if (me.isPainted) {
                // We used to have a bug here from not including the row border in the total height. Border is now
                // removed, but leaving code here just in case some client is using border
                me.refreshTotalHeight(totalSize + me._rowBorderHeight, true);
            }

            // Canvas might need a height in vertical mode, if ticks does not fill height (suppressFit : true)
            if (me.suppressFit) {
                DomHelper.setLength(me.foregroundCanvas, 'height', totalSize);
            }

            result = true;
        }

        return result;
    }

    /**
     * A chainable function which Features may hook to add their own content to the timeaxis header.
     * @param {Array} configs An array of domConfigs, append to it to have the config applied to the header
     */
    getHeaderDomConfigs(configs) {}

    /**
     * A chainable function which Features may hook to add their own content to the foreground canvas
     * @param {Array} configs An array of domConfigs, append to it to have the config applied to the foreground canvas
     */
    getForegroundDomConfigs(configs) {}

    //endregion

    //region Grid overrides

    async onStoreDataChange({ action }) {
        const me = this;

        // Only update the UI immediately if we are visible
        if (me.isVisible) {
            // When repopulating stores (enterprise and up on data reload), the engine is not in a valid state until
            // committed. Don't want to commit here, since it might be repopulating multiple stores. Instead delay grids
            // refresh until project is ready
            if (action === 'dataset' && me.project?.isRepopulatingStores) {
                await me.project.await('refresh', false);
            }

            super.onStoreDataChange(...arguments);
        }
        // Otherwise wait till next time we get painted (shown, or a hidden ancestor shown)
        else {
            me.whenVisible('refresh', me, [true]);
        }
    }

    /**
     * Triggers a re-render of the currently rendered rows and their event bars from the current record data, without
     * reloading and without scrolling. Works the same way in both horizontal and vertical mode.
     *
     * Use {@link #function-refreshEvents} instead to re-render only the event bars.
     *
     * {@note}Manipulating records and settings refreshes the timeline automatically. You should only need to call
     * this function if you have outside data/settings unknown to the timeline that has changed and requires the rows
     * to be updated to reflect the changes{/@note}
     *
     * @param {Boolean} [forceLayout=true] Pass `false` to reuse the existing event layout instead of recalculating it
     * @category Rendering
     */
    refresh(forceLayout = true) {
        const me = this;

        if (me.isPainted && !me.refreshSuspended) {
            if (!me.project || me.isEngineReady) {
                // Re-renders the rows, which in turn re-renders the event bars of each row. Also triggers the
                // RowManager `refresh` event which Features rely on after a refresh request.
                me.refreshRows(null, false, forceLayout);
            }
            else {
                me.refreshAfterProjectRefresh             = true;
                me.currentOrientation.refreshAllWhenReady = true;
            }
        }
    }

    /**
     * Triggers a re-render of the event bars from the current record data, leaving the cells of other columns alone.
     * Works the same way in both horizontal and vertical mode.
     *
     * Use {@link #function-refresh} instead if the rows also need to be re-rendered.
     *
     * @param {Boolean} [forceLayout=true] Pass `false` to reuse the existing event layout instead of recalculating it
     * @category Rendering
     */
    refreshEvents(forceLayout = true) {
        const me = this;

        if (me.isPainted && !me.refreshSuspended) {
            if (!me.project || me.isEngineReady) {
                me.currentOrientation.refreshEvents(false, forceLayout);
            }
            else {
                me.currentOrientation.refreshAllWhenReady = true;
            }
        }
    }

    render(...args) {
        const me = this;

        // Keep existing canvases on re-render after re-parenting (features register theirs in `canvases`)
        if (!me._foregroundCanvas) {
            me._foregroundCanvas = DomHelper.createElement({
                className : 'b-sch-canvas b-sch-foreground-canvas',
                parent    : me.timeAxisSubGridElement
            });

            me.canvases = {
                event : me._foregroundCanvas
            };

            me.timeAxisSubGrid.insertRowsBefore = me._foregroundCanvas;
            me.timeAxisSubGrid.addCanvas(me._foregroundCanvas);
        }

        // Size correctly in case ticks does not fill height
        if (me.isVertical && me.suppressFit) {
            me.updateCanvasSize();
        }

        super.render(...args);
    }

    // Features added at runtime may take part in event rendering (EventClustering, Labels etc.), the cached event
    // layouts were created without them. Cleared before GridBase renders the contents, once per batch of features
    afterFeatureAdd(names) {
        if (this.isPainted) {
            this.currentOrientation.refreshRows(null, true);
        }

        super.afterFeatureAdd(names);
    }

    refreshRows(records = null, returnToTop = false, reLayoutEvents = true) {
        const me = this;

        if (me.isConfiguring) {
            return;
        }

        me.currentOrientation.refreshRows(records, reLayoutEvents);

        super.refreshRows(records, returnToTop);
    }

    updateHideHeaders(hide) {
        const
            me         = this,
            scrollLeft = me.isPainted ? me.scrollLeft : 0;

        super.updateHideHeaders(hide);

        if (me.isPainted) {
            if (!hide) {
                me.timeAxisColumn.refreshHeader(null, true);
            }

            me.nextAnimationFrame().then(() => me.scrollLeft = scrollLeft);
        }
    }

    updateHideRowHover(hideRowHover) {
        this.timeAxisSubGridElement.classList.toggle('b-hide-row-hover', hideRowHover);
    }

    getCellDataFromEvent(event, includeSingleAxisMatch) {
        if (!event.target.closest('.b-vertical-time-axis-cell')) {
            if (includeSingleAxisMatch) {
                includeSingleAxisMatch = !event.target.closest('.b-sch-foreground-canvas');
            }
            return super.getCellDataFromEvent(event, includeSingleAxisMatch);
        }
    }

    // This GridSelection override disables drag-selection in timeaxis column for scheduler and gantt
    onCellNavigate(me, from, to, ...args) {
        const toTarget = to.target;

        if (to.cell?.classList.contains('b-time-axis-cell') && !GlobalEvents.currentMouseDown?.target.classList.contains('b-grid-cell')) {
            this.preventDragSelect = true;
        }

        if ((!toTarget?.matches(this.eventSelector) || this.selectResourceOnEventNavigate !== false) &&
        (!toTarget?.matches('.b-time-axis-cell') || this.selectResourceOnScheduleClick !== false)) {
            super.onCellNavigate(me, from, to, ...args);
        }
    }

    //endregion

    //region Other

    // Awaited by CellEdit to make sure that the editor is not moved until row heights have transitioned, to avoid it
    // ending up misaligned
    async waitForAnimations() {
        // If project is calculating, we should await that too. It might lead to transitions
        if (!this.isEngineReady && this.project) {
            await this.project.await('dataReady', false);
        }

        await super.waitForAnimations();
    }

    /**
     * Refreshes the grid with transitions enabled.
     */
    refreshWithTransition(forceLayout, shouldAnimate = true) {
        const me = this;

        // No point in starting a transition if we cant refresh anyway
        if (!me.refreshSuspended && me.isPainted) {
            // Since we suspend refresh when loading with CrudManager, rows might not have been initialized yet
            if (!me.rowManager.topRow) {
                me.rowManager.reinitialize();
            }
            else {
                me.runWithTransition(() => me.refresh(forceLayout), shouldAnimate);
            }
        }
    }

    /**
     * Returns an object representing the visible date range
     * @member {Object}
     * @readonly
     * @property {Date} visibleDateRange.startDate
     * @property {Date} visibleDateRange.endDate
     * @category Dates
     */
    get visibleDateRange() {
        return this.currentOrientation.visibleDateRange;
    }

    // This override will force row selection on timeaxis column selection, effectively disabling cell selection there
    isRowNumberSelecting(selector) {
        return super.isRowNumberSelecting(selector) || selector.column?.isTimeAxisColumn || selector.cell?.closest('.b-time-axis-cell');
    }

    //endregion

    /**
     * Returns a rounded duration value to be displayed in UI (tooltips, labels etc)
     * @param {Number} duration The raw duration value
     * @param {Number} [nbrDecimals] The number of decimals, defaults to {@link #config-durationDisplayPrecision}
     * @returns {Number} The rounded duration
     */
    formatDuration(duration, nbrDecimals = this.durationDisplayPrecision) {
        const multiplier = Math.pow(10, nbrDecimals);

        return Math.round(duration * multiplier) / multiplier;
    }

    beginListeningForBatchedUpdates() {
        this.listenToBatchedUpdates = (this.listenToBatchedUpdates || 0) + 1;

        // Allow live resizing (etc) in all splits
        this.syncSplits?.(other => other.beginListeningForBatchedUpdates());
    }

    endListeningForBatchedUpdates() {
        if (this.listenToBatchedUpdates) {
            this.listenToBatchedUpdates -= 1;
        }

        this.syncSplits?.(other => other.endListeningForBatchedUpdates());
    }

    onConnectedCallback(connected, initialConnect) {
        if (connected && !initialConnect) {
            this.timeAxisSubGrid.scrollable.x += 0.5;
        }
    }

    updateRtl(rtl) {
        const
            me                = this,
            { isConfiguring } = me;

        let visibleDateRange;

        if (!isConfiguring) {
            visibleDateRange = me.visibleDateRange;
        }

        super.updateRtl(rtl);

        if (!isConfiguring) {
            // Clear DOM to ensure full re-render with new RTL direction
            me.currentOrientation.clearAll({ clearDom : true });

            if (me.infiniteScroll) {
                me.shiftToDate(visibleDateRange.startDate);
            }
            else {
                me.timelineScroller.position += 0.5;
            }

            // Sync scroller stretcher positions for the new RTL direction.
            // This must happen AFTER scroll position changes to ensure correct alignment.
            // https://github.com/bryntum/bryntum/issues/11725
            me.timeAxisSubGrid.scrollable.syncRtl();
        }
    }

    /**
     * Applies the start and end date to each event store request (formatted in the same way as the start date field,
     * defined in the EventStore Model class).
     * @category Data
     * @private
     */
    applyStartEndParameters(params) {
        const
            me    = this,
            field = me.eventStore.modelClass.fieldMap.startDate;

        if (me.passStartEndParameters) {
            params[me.startParamName] = field.print(me.startDate);
            params[me.endParamName] = field.print(me.endDate);
        }
    }

    intersectsVisibleTimeSpan(timespan) {
        return this.timeAxis.isTimeSpanInAxis(timespan);
    }

    /**
     * Highlights the elements of the passed event or assignment records (or record ids). If `scrollToClosest` is set to
     * `true` (which it is by default), the highlighted event element closest to the viewport center will be scrolled
     * into view.
     *
     * The highlighting will be done by adding the css class `b-highlighted` to the highlighted event elements. Also,
     * the css class `b-is-highlighting` will be added to the `TimeAxisSubGrid` element.
     *
     * ```javascript
     * // Highlight single event
     * scheduler.highlightEvents({ events : 22 });
     * // Highlight multiple events
     * scheduler.highlightEvents({ events : [1, 40] });
     * // Don't scroll to highlighted event, and don't un-highlight on click
     * scheduler.highlightEvents({ events : 1000, scroll : false, unhighlightOnClick : false });
     * ```
     *
     * @param {Object} options Options config object
     * @param {Scheduler.model.EventModel|Scheduler.model.AssignmentModel|Number|String|Scheduler.model.EventModel[]|Scheduler.model.AssignmentModel[]|Number[]|String[]} options.events
     * The event records, assignment records or record ids to highlight. If providing ids, they will be interpreted as
     * event ids only if {@link Scheduler.data.EventStore#config-singleAssignment} is `true`, otherwise they will be
     * interpreted as assignment ids. If an empty array is passed, the `b-is-highlighting` class will be applied,
     * rendering all event elements in the style of `:not(.b-highlighted)`.
     * @param {Boolean|BryntumScrollOptions} [options.scroll] If `false`, no scrolling will be performed. If a
     * scrollOptions object, this object will be passed to the scroll function providing details on how to scroll.
     * @param {Boolean} [options.unhighlightOnClick] If `false`, a call to {@link #function-unhighlightEvents} is needed
     * to remove the highlighting. Otherwise, the highlighting will be removed when the user clicks somewhere in the
     * browser window.
     * @param {Boolean} [options.unhighlightOthers] If `true` this will automatically un-highlight the events not
     * present in the `events` property
     * @category Misc
     */
    highlightEvents({ events, scroll = true, unhighlightOnClick = true, unhighlightOthers = false }) {
        const
            me = this,
            { viewportCenterDate, rowManager } = me,
            highlighted = me._highlightedAssignments ?? (me._highlightedAssignments = []),
            // Convert to assignments separately, for code simplicity
            assignments = me.internalGetAssignmentsToHighlight(events);
        let scrollToAssignment, lastDistance, calcDistance;

        // Only need to create the calcDistance function if > 1 assignment
        if (scroll && assignments.length > 1 && rowManager.rows.length) {
            const
                msPerPx = me.getMilliSecondsPerPixelForZoomLevel(me.viewPreset),
                { y, height } = me._bodyRectangle,
                centerY = y + height / 2,
                centerRowTop = (rowManager.getRowAt(centerY) ?? rowManager.bottomRow)?.top;

            calcDistance = assignment => {
                const
                    // task in case of Gantt
                    event = assignment.isTask ? assignment : assignment.event,
                    resource = assignment.isTask ? assignment : assignment.resource,
                    // calculate time axis distance
                    distanceMs = viewportCenterDate > event.endDate
                        ? viewportCenterDate - event.endDate
                        : event.startDate - viewportCenterDate,
                    distanceTimeAxis = distanceMs / msPerPx,
                    // calculate resource axis distance
                    resourcePosition = me.mode === 'vertical'
                        ? (
                            me.variableColumnWidths // Vertical mode can have variable ResourceColumn widths
                                ? resource.instanceMeta(me).insetStart
                                : me.currentOrientation.allResourceRecords.indexOf(resource) * me.resourceColumnWidth
                        )
                        : rowManager.getRecordCoords(resource)?.y,
                    distanceResourceAxis = Math.abs(centerRowTop - (resourcePosition ?? 0));

                // Row out of view
                if (resourcePosition === undefined) {
                    return Infinity;
                }

                return Math.sqrt(distanceTimeAxis * distanceTimeAxis + distanceResourceAxis * distanceResourceAxis);
            };
        }

        if (unhighlightOthers && highlighted.length) {
            me.unhighlightEvents({ events : [...highlighted] });
        }

        assignments.forEach(assignment => {
            if (!highlighted.includes(assignment)) {
                highlighted.push(assignment);
                // Add class to element
                me.currentOrientation.toggleCls(assignment, 'b-highlighted', true, true);
                // Add flag to meta to add class when rendering the event
                assignment.instanceMeta(me).isHighlighted = true;
            }

            let distance;
            // Need to match resource against the store because of LockRows feature
            if (scroll && me.store.includes(assignment.isTask ? assignment : assignment.resource)) {
                if (!calcDistance) {
                    // Single assignment, no need to perform calculations
                    scrollToAssignment = assignment;
                }
                else if ((distance = calcDistance(assignment)) < lastDistance || lastDistance == null) {
                    lastDistance = distance;
                    scrollToAssignment = assignment;
                }
            }
        });

        me.timeAxisSubGridElement.classList.toggle('b-is-highlighting', true);

        // Flash every highlighted element, but only when the caller opts in with `scroll : { highlight : true }`.
        // See #13137 (previously only the element scrolled into view was flashed).
        const
            flashHighlight = Boolean(scroll?.highlight),
            flashAll       = () => assignments.forEach(assignment => me.flashHighlightedAssignment(assignment));

        if (scrollToAssignment) {
            // scroll can be a scroll config object. highlightEvents owns flashing, so strip the scroller's own
            // highlight option to avoid flashing the scrolled element twice.
            const
                scrollOptions = scroll !== true ? { ...scroll, highlight : false } : undefined,
                scrollPromise = me[`scroll${me.isGanttBase ? 'Task' : 'Assignment'}IntoView`](scrollToAssignment, scrollOptions);

            // Flash all of them once the scroll has finished, so they flash together rather than the
            // already-visible ones first and the scrolled-to one later.
            if (flashHighlight) {
                scrollPromise ? scrollPromise.then(flashAll) : flashAll();
            }
        }
        else if (flashHighlight) {
            flashAll();
        }

        if (unhighlightOnClick && !me._highlightEventsListener) {
            me._highlightEventsListener = EventHelper.on({
                element     : globalThis,
                autoDetach  : true,
                thisObj     : me,
                pointerdown : me.unhighlightEvents
            });
        }

        me.syncSplits?.(other => other.highlightEvents({ ...arguments[0], unhighlightOnClick : false }));
    }

    /**
     * Flashes the rendered element for a single highlighted assignment/task.
     * @private
     */
    flashHighlightedAssignment(assignment) {
        const element = this.isGanttBase
            ? this.getElementFromTaskRecord(assignment, false)
            : this.getElementFromAssignmentRecord(assignment, true, false, false);

        if (element) {
            DomHelper.highlight(element, this);
        }
    }

    /**
     * Removes highlighting from the elements of the passed event or assignment records (or record ids). If no events
     * are passed all highlighted events will be un-highlighted.
     *
     * ```javascript
     * scheduler.unhighlightEvents({ events : 22 }); // single event
     * scheduler.unhighlightEvents({ events : [1, 40] }); // multiple events
     * ```
     *
     * @param {Object} [options] Options config object
     * @param {Scheduler.model.EventModel|Scheduler.model.AssignmentModel|Number|String|Scheduler.model.EventModel[]|Scheduler.model.AssignmentModel[]|Number[]|String[]} [options.events]
     * The event or assignment records or record ids to un-highlight. Omit this to un-highlight all.
     * @category Misc
     */
    unhighlightEvents(options) {
        const
            me = this,
            { _highlightedAssignments } = me;
        let events = options?.events;

        // When called from click listener, events will be the browser event
        if (DomHelper.isDOMEvent(options)) {
            const { target } = options;

            // Try to detect scrollbar clicks
            if (target.closest('.b-virtual-scroller') ||
                (me.bodyContainer === target && me.scrollable.hasOverflowY && (options.offsetX > target.clientWidth ||
                (!DomHelper.scrollBarWidth && options.offsetX > target.clientWidth - 15)))
            ) {
                return;
            }
            events = null;
        }

        if (_highlightedAssignments?.length) {
            const assignments = events && me.internalGetAssignmentsToHighlight(events);

            for (let i = _highlightedAssignments.length - 1; i >= 0; i--) {
                const assignment = _highlightedAssignments[i];

                if (!assignments || assignments.includes(assignment)) {
                    // Remove class from element
                    me.currentOrientation.toggleCls(assignment, 'b-highlighted', false, true);
                    // Change meta to not add class when rendering the event
                    assignment.instanceMeta(me).isHighlighted = false;
                    _highlightedAssignments.splice(i, 1);
                }
            }
        }

        if (!_highlightedAssignments?.length) {
            me.timeAxisSubGridElement.classList.toggle('b-is-highlighting', false);
        }

        if (me._highlightEventsListener) {
            me._highlightEventsListener();
            me._highlightEventsListener = null;
        }

        this.syncSplits?.(other => other.unhighlightEvents(options));
    }
}

// Register this widget type with its Factory
TimelineBase.initClass();

// Has to be here because Gantt extends TimelineBase
VersionHelper.setVersion('scheduler', '8.0.1');
