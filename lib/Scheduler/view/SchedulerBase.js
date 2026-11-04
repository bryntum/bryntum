import TimelineBase from './TimelineBase.js';
import ArrayHelper from '../../Core/helper/ArrayHelper.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import FunctionHelper from '../../Core/helper/FunctionHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import '../localization/En.js';
import CurrentConfig from './mixin/CurrentConfig.js';
import Describable from './mixin/Describable.js';
import SchedulerDom from './mixin/SchedulerDom.js';
import SchedulerDomEvents from './mixin/SchedulerDomEvents.js';
import SchedulerEventRendering from './mixin/SchedulerEventRendering.js';
import SchedulerStores from './mixin/SchedulerStores.js';
import SchedulerScroll from './mixin/SchedulerScroll.js';
import SchedulerRegions from './mixin/SchedulerRegions.js';
import SchedulerState from './mixin/SchedulerState.js';
import SchedulerZoomable from './mixin/SchedulerZoomable.js';
import EventSelection from './mixin/EventSelection.js';
import EventNavigation from './mixin/EventNavigation.js';
import TransactionalFeatureMixin from './mixin/TransactionalFeatureMixin.js';
import CrudManagerView from '../crud/mixin/CrudManagerView.js';

// Tier branches must name their tier class explicitly; the bare `ProjectModel` is the tier-resolved
// alias, which would make every branch resolve to the built tier and ignore the scheduler's own `tier`.
import ProjectModelCommunity from '../model/ProjectModelCommunity.js';


import '../column/TimeAxisColumn.js';
import '../column/VerticalTimeAxisColumn.js';
import Config from '../../Core/Config.js';
import AsyncHelper from '../../Core/helper/AsyncHelper.js';
import SchedulerMode from './mixin/SchedulerMode.js';
import SchedulerFeature from '../feature/SchedulerFeature.js';

DomHelper.loadStylesheet('Scheduler/view/SchedulerBase.css');

// import Stylesheet from './SchedulerBase.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'SchedulerBase');

/**
 * @module Scheduler/view/SchedulerBase
 */

const
    descriptionFormats = {
        month : 'MMMM, YYYY',
        week  : ['MMMM YYYY (Wp)', 'S{MMM} - E{MMM YYYY} (S{Wp})'],
        day   : 'MMMM D, YYYY'
    },
    compareRange       = (r1, r2) => r1 && r2 ? (r1.unit === r2.unit && r1.magnitude === r2.magnitude) : r1 === r2,
    emptyObject        = Object.freeze({});

/**
 * Type containing `start` and `end` constraints.
 * @typedef {Object} DateConstraint
 * @property {Date} [start] Start date constraint
 * @property {Date} [end] End date constraint
 */

/**
 * Configuration object for a responsive level. Contains a required `levelWidth` plus any
 * {@link Scheduler.view.mixin.SchedulerState} properties to apply when this level is active.
 * @typedef {SchedulerStateInfo} SchedulerResponsiveLevelConfig
 * @property {Number|String} levelWidth The width threshold for this level, or `'*'` for all sizes above other levels
 */

/**
 * A thin base class for {@link Scheduler.view.Scheduler}. Does not include any features by default, allowing smaller
 * custom-built bundles if used in place of {@link Scheduler.view.Scheduler}.
 *
 * **NOTE:** In most scenarios you do probably want to use Scheduler instead of SchedulerBase.
 *
 * ```javascript
 * const scheduler = new SchedulerBase({
 *     appendTo  : 'container',
 *     startDate : new Date(2024, 0, 1),
 *     endDate   : new Date(2024, 0, 8),
 *     columns   : [
 *         { text : 'Name', field : 'name', width : 130 }
 *     ]
 * });
 * ```
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-mode}                         | Display mode: `horizontal` or `vertical`            |
 * | {@link #config-readOnly}                     | Set to `true` to prevent editing                    |
 * | {@link #config-eventStore}                   | Store holding event records                         |
 * | {@link #config-resourceStore}                | Store holding resource records                      |
 * | {@link #config-responsiveLevels}             | Responsive breakpoint configurations                |
 * | {@link #function-editEvent}                  | Programmatically open the event editor              |
 * | {@link #event-beforeEventAdd}                | Fires before an event is added                      |
 * | {@link #event-eventAutoCreated}              | Fires after an auto-created event                   |
 *
 * ## See also
 *
 * - {@link Scheduler.view.Scheduler} - full-featured scheduler with all default features
 * - {@link Scheduler.view.TimelineBase} - abstract timeline base class
 *
 * @mixes Scheduler/view/mixin/Describable
 * @mixes Scheduler/view/mixin/EventNavigation
 * @mixes Scheduler/view/mixin/EventSelection
 * @mixes Scheduler/view/mixin/SchedulerDom
 * @mixes Scheduler/view/mixin/SchedulerDomEvents
 * @mixes Scheduler/view/mixin/SchedulerEventRendering
 * @mixes Scheduler/view/mixin/SchedulerRegions
 * @mixes Scheduler/view/mixin/SchedulerScroll
 * @mixes Scheduler/view/mixin/SchedulerMode
 * @mixes Scheduler/view/mixin/SchedulerState
 * @mixes Scheduler/view/mixin/SchedulerStores
 * @mixes Scheduler/view/mixin/SchedulerZoomable
 * @mixes Scheduler/view/mixin/ProjectProgressMixin
 * @mixes Scheduler/view/mixin/SchedulerProEventRendering
 * @mixes Scheduler/view/mixin/SchedulingIssueResolution
 * @mixes Scheduler/view/mixin/TimelineDateMapper
 * @mixes Scheduler/view/mixin/TimelineDomEvents
 * @mixes Scheduler/view/mixin/TimelineEventRendering
 * @mixes Scheduler/view/mixin/TimelineScroll
 * @mixes Scheduler/view/mixin/TimelineViewPresets
 * @mixes Scheduler/view/mixin/TimelineZoomable
 * @mixes Scheduler/view/mixin/TransactionalFeatureMixin
 * @mixes Scheduler/crud/mixin/CrudManagerView
 * @mixes Scheduler/data/mixin/LazyLoadView
 * @mixes Scheduler/data/mixin/ProjectConsumer
 *
 * @features Scheduler/feature/AI
 * @features Scheduler/feature/ColumnLines
 * @features Scheduler/feature/Dependencies
 * @features Scheduler/feature/DependencyEdit
 * @features Scheduler/feature/DependencyMenu
 * @features Scheduler/feature/EventClustering
 * @features Scheduler/feature/EventCopyPaste
 * @features Scheduler/feature/EventDrag
 * @features Scheduler/feature/EventDragCreate
 * @features Scheduler/feature/EventDragSelect
 * @features Scheduler/feature/EventEdit
 * @features Scheduler/feature/EventFilter
 * @features Scheduler/feature/EventMenu
 * @features Scheduler/feature/EventNonWorkingTime
 * @features Scheduler/feature/EventResize
 * @features Scheduler/feature/EventTooltip
 * @features Scheduler/feature/GroupSummary
 * @features Scheduler/feature/HeaderZoom
 * @features Scheduler/feature/Labels
 * @features Scheduler/feature/NonWorkingTime
 * @features Scheduler/feature/Pan
 * @features Scheduler/feature/ResourceColumnReorder
 * @features Scheduler/feature/ResourceMenu
 * @features Scheduler/feature/ResourceTimeRangeClustering
 * @features Scheduler/feature/ResourceTimeRanges
 * @features Scheduler/feature/RowReorder
 * @features Scheduler/feature/RowResize
 * @features Scheduler/feature/ScheduleContext
 * @features Scheduler/feature/ScheduleMenu
 * @features Scheduler/feature/ScheduleTooltip
 * @features Scheduler/feature/ScrollButtons
 * @features Scheduler/feature/SimpleEventEdit
 * @features Scheduler/feature/Split
 * @features Scheduler/feature/StickyEvents
 * @features Scheduler/feature/LockRows
 * @features Scheduler/feature/Summary
 * @features Scheduler/feature/TimeAxisHeaderMenu
 * @features Scheduler/feature/TimeRanges
 * @features Scheduler/feature/TimeSelection
 * @features Scheduler/feature/TimeSpanHighlight
 * @features Scheduler/feature/TreeSummary
 * @features Scheduler/feature/CalendarHighlight
 * @features Scheduler/feature/EventBuffer
 * @features Scheduler/feature/EventSegmentDrag
 * @features Scheduler/feature/EventSegmentResize
 * @features Scheduler/feature/EventSegments
 * @features Scheduler/feature/GroupRollups
 * @features Scheduler/feature/NestedEvents
 * @features Scheduler/feature/PercentBar
 * @features Scheduler/feature/ResourceEdit
 * @features Scheduler/feature/TaskEdit
 * @features Scheduler/feature/Versions
 *
 * @features Scheduler/feature/experimental/ExcelExporter
 *
 * @features Scheduler/feature/export/PdfExport
 * @features Scheduler/feature/export/Print
 *
 * @extends Scheduler/view/TimelineBase
 * @widget
 * @tier community
 */
export default class SchedulerBase extends TimelineBase.mixin(
    CrudManagerView,
    Describable,
    SchedulerDom,
    SchedulerDomEvents,
    SchedulerStores,
    SchedulerScroll,
    SchedulerState,
    SchedulerEventRendering,
    SchedulerRegions,
    EventSelection,
    EventNavigation,
    CurrentConfig,
    TransactionalFeatureMixin,
    SchedulerZoomable,


    SchedulerMode
) {
    //region Config

    static $name = 'SchedulerBase';

    // Factoryable type name
    static type = 'schedulerbase';

    static get featureable() {
        return {
            factory   : SchedulerFeature,
            transform : SchedulerFeature.transformConfig
        };
    }

    static configurable = {
        // Features declare their own defaults, see GridFeature#defaultEnabled
        features : {},

        /**
         * Get/set the scheduler's read-only state. When set to `true`, any UIs for modifying data are disabled.
         * @member {Boolean} readOnly
         * @category Misc
         */
        /**
         * Configure as `true` to make the scheduler read-only, by disabling any UIs for modifying data.
         *
         * __Note that checks MUST always also be applied at the server side.__
         * @config {Boolean} readOnly
         * @default false
         * @category Misc
         */

        /**
         * "Break points" for which responsive config to use.
         *
         * Each level can be specified as:
         * - A number representing the width threshold (e.g., `400`)
         * - The string `'*'` to match all sizes above other thresholds
         * - A {@link #typedef-SchedulerResponsiveLevelConfig} object with `levelWidth` and scheduler properties
         *
         * See the [responsive guide](#Scheduler/guides/customization/responsive.md) for details and examples.
         *
         * @config {Object<String,Number|String|SchedulerResponsiveLevelConfig>} responsiveLevels
         * @category Misc
         */

        localizableProperties : ['autoCreate.newName'],

        /**
         * The date to display when used as a component of a Calendar.
         *
         * This is required by the Calendar Mode Interface.
         *
         * @prp {Date}
         * @category Calendar integration
         */
        date : {
            value : null,

            $config : {
                equal : 'date'
            }
        },

        /**
         * {@note}This property is for use when the Scheduler is used as a Calendar view - a `mode`.{/@note}
         *
         * A {@link Core.widget.Menu} configuration block which configures the range choosing menu provided which by
         * default selects one of the following:
         *
         * - day
         * - week
         * - month
         * - year
         * - decade
         *
         * This menu is added to the {@link Scheduler.feature.TimeAxisHeaderMenu} when the Scheduler is used as a
         * Calendar view.
         *
         * This may be used to either reconfigure that menu, or, by configuring it as `null`, could remove the menu
         * entirely if the date range of this view is controlled by other means.
         *
         * The individual range menu items are under the `items` property and have the following property names:
         * - `listRangeDayItem`
         * - `listRangeWeekItem`
         * - `listRangeMonthItem`
         * - `listRangeYearItem`
         * - `listRangeDecadeItem`
         *
         * These may be reconfigured:
         *
         * ```javascript
         * calendar = new Calendar({
         *     ...
         *     modes : {
         *         timeline : {
         *             type          : 'scheduler',
         *             range         : 'month',
         *             listRangeMenu : {
         *                 items : {
         *                     // We don't want the decade range option
         *                     listRangeDecadeItem : null
         *                 }
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * @config {MenuConfig} listRangeMenu
         */
        listRangeMenu : {
            $config : 'lazy',
            value   : {
                type : 'rangemenu'
            }
        },

        /**
         * {@note}This property is for use when the Scheduler is used as a Calendar view - a `mode` - it will have no
         * effect on a Scheduler which is not inside a Calendar.{/@note}
         *
         * The time range to move by when {@link #function-next} or {@link #function-previous} is called.
         *
         * If not specified, this view moves by its duration in days as derived from its {@link #property-range}.
         *
         * Valid values are:
         * - day
         * - week
         * - month
         * - year
         * - decade
         *
         * This may also be specified as a duration with a magnitude part and a unit part. For example `'1m'` would mean
         * one month, and `'4w'` would mean four weeks. See {@link Core.helper.DateHelper#function-parseDuration-static}
         * for details of syntax.
         *
         * When using a range of weeks, months, years or decades, then when this widget's {@link #config-date} is synced
         * with its owning Calendar's date, this widget's {@link #config-startDate} is snapped to the closest start
         * point of the range which encompasses that date.
         *
         * So if using `range : '1w'`, then setting the date to Thursday, 28th October 2021 would mean that the
         * `startDate` snaps to Sunday 24th October 2021 (assuming the locale uses Sunday as the week start day).
         *
         * If configured to use a range of *days*, no snapping is done. There's no defined start point so the
         * {@link #config-startDate} is set to the incoming Calendar date.
         *
         * @prp {DurationConfig}
         * @category Calendar integration
         * @accepts {String|DurationConfig}
         */
        shiftIncrement : {
            $config : {
                lazy  : true,
                equal : compareRange
            },
            value : null
        },

        /**
         * The time range encapsulated by the current {@link #property-date}.
         *
         * When a range is used, changing the {@link #config-date} snaps the {@link #config-startDate}
         * to the closest starting date of the range. For Example if the range was configured as `'1 week'`
         * then setting the date to the date of next Wednesday would mean that the {@link #property-startDate}
         * would be the __start__ of next week, and an entire week would be encapsulated by this view.
         * @member {DurationConfig} range
         * @accepts {String|DurationConfig}
         */
        /**
         * Range used to set the length of the time axis when used as a component of a Calendar. Suitable units are
         * `'month'`, `'week'` and `'day'`.
         *
         * This may also be specified as a duration with a magnitude part and a unit part. For
         * example `'1m'` would mean one month, and `'4w'` would mean four weeks.
         * See {@link Core.helper.DateHelper#function-parseDuration-static} for details
         * of syntax.
         *
         * When using a range of weeks or months, then when this widget's {@link #config-date} is synced
         * with its owning Calendar's date property, this widget's {@link #config-startDate}
         * is snapped to the closest start point of the range which encompasses that date.
         *
         * So if using `range : '1w'`, then setting the date to Thursday, 28th October 2021
         * Would mean that the `startDate` snaps to Sunday 24th October 2021 (assuming the locale
         * uses Sunday as the week start day).
         *
         * @config {String|DurationConfig}
         * @category Calendar integration
         * @default
         */
        range : {
            $config : {
                equal : compareRange
            },
            value : 'week'
        },

        /**
         * When the scheduler is used in a Calendar, this function provides the textual description for the
         * Calendar's toolbar.
         *
         * ```javascript
         *  descriptionRenderer : scheduler => {
         *      const
         *          count = scheduler.eventStore.records.filter(
         *              eventRec => DateHelper.intersectSpans(
         *                  scheduler.startDate, scheduler.endDate,
         *                  eventRec.startDate, eventRec.endDate)).length,
         *          startDate = DateHelper.format(scheduler.startDate, 'DD/MM/YYY'),
         *          endData = DateHelper.format(scheduler.endDate, 'DD/MM/YYY');
         *
         *      return `${startDate} - ${endData}, ${count} event${count === 1 ? '' : 's'}`;
         *  }
         * ```
         * @config {Function}
         * @param {Scheduler.view.SchedulerBase} view The active view.
         * @returns {String}
         * @category Calendar integration
         */

        /**
         * A method allowing you to define date boundaries that will constrain resize, create and drag drop
         * operations. The method will be called with the Resource record, and the Event record.
         *
         * ```javascript
         *  new Scheduler({
         *      getDateConstraints(resourceRecord, eventRecord) {
         *          // Assuming you have added these extra fields to your own EventModel subclass
         *          const { minStartDate, maxEndDate } = eventRecord;
         *
         *          return {
         *              start : minStartDate,
         *              end   : maxEndDate
         *          };
         *      }
         *  });
         * ```
         *
         * @config {Function}
         * @param {Scheduler.model.ResourceModel} [resourceRecord] The resource record
         * @param {Scheduler.model.EventModel} [eventRecord] The event record
         * @returns {DateConstraint} Constraining `Object` containing `start` and `end` constraints. Omitting either
         *   will mean that end is not constrained. So you can prevent a resize or move from moving *before*
         *   a certain time while not constraining the end date.
         * @category Scheduled events
         */
        getDateConstraints : null,

        /**
         * The time axis column config for vertical {@link Scheduler.view.SchedulerBase#config-mode}.
         *
         * Object with {@link Scheduler.column.VerticalTimeAxisColumn} configuration.
         *
         * This object will be used to configure the vertical time axis column instance.
         *
         * The config allows configuring the `VerticalTimeAxisColumn` instance used in vertical mode with any Column options that apply to it.
         *
         * Example:
         *
         * ```javascript
         * new Scheduler({
         *     mode     : 'vertical',
         *     features : {
         *         filterBar : true
         *     },
         *     verticalTimeAxisColumn : {
         *         text  : 'Filter by event name',
         *         width : 180,
         *         filterable : {
         *             // add a filter field to the vertical column access header
         *             filterField : {
         *                 type        : 'text',
         *                 placeholder : 'Type to search',
         *                 onChange    : ({ value }) => {
         *                     // filter event by name converting to lowerCase to be equal comparison
         *                     scheduler.eventStore.filter({
         *                         filters : event => event.name.toLowerCase().includes(value.toLowerCase()),
         *                         replace : true
         *                     });
         *                 }
         *             }
         *         }
         *     },
         *     ...
         * });
         * ```
         *
         * @config {VerticalTimeAxisColumnConfig}
         * @category Time axis
         */
        verticalTimeAxisColumn : {},

        /**
         * See {@link Scheduler.view.Scheduler#keyboard-shortcuts Keyboard shortcuts} for details
         * @config {Object<String,KeyMapConfig>} keyMap
         * @category Common
         */

        /**
         * If this config is set, then its `gesture` property (which defaults to `dblclick`) creates a
         * new event at the mouse or touch event's time point.
         *
         * When set to `true`, the gesture is `dblclick`, and the new event will have a duration of 1 time axis tick.
         *
         * This may be specified as the string DOM event name to listen for, such as `'click'`, `'dblclick'`
         * and the new event will have a duration of 1 time axis tick.
         *
         * The duration of the new event can be set by specifying the `duration` property as a {@link DurationConfig}.
         *
         * If that is not set, then setting the `useEventModelDefaults` property will cause the duration
         * to be specified by the default values of the {@link Scheduler.model.EventModel#field-duration} and
         * {@link Scheduler.model.EventModel#field-durationUnit} fields
         *
         * Example:
         * ```javascript
         * new Scheduler({
         *     autoCreate : {
         *         gesture  : 'click',
         *         duration : '2 hours',
         *         newName  : 'New appointment'
         *     }
         * });
         * ```
         *
         * @prp {Boolean|String|Object} autoCreate
         * @param {'click'|'dblclick'} [autoCreate.gesture] The gesture to trigger auto creation of an event. Defaults to `dblclick`.
         * @param {Boolean} [autoCreate.useEventModelDefaults] Set to `true` to set default duration
         * based on the defaults specified by the {@link Scheduler.model.EventModel#field-duration} and
         * {@link Scheduler.model.EventModel#field-durationUnit} fields.
         * @param {'round'|'ceil'|'floor'} [autoCreate.snapType] The type of snapping to apply to the event start date.
         * If omitted, the date will be floored to the time axis resolution.
         * @param {DurationConfig|String} [autoCreate.step] The increment to snap the event start date to.
         * @param {DurationConfig|String} [autoCreate.duration] The duration of the event to create. Defaults to 1 time axis tick.
         * @param {String} [autoCreate.name] The name of the event to create. Defaults to the `Object.newEvent` property
         * from the locale.
         * @category Scheduled events
         * @default
         */
        autoCreate : {
            gesture : 'dblclick',
            newName : 'L{Object.newEvent}'
        },

        /**
         * Number of pixels to horizontally extend the visible render zone by, controlling the events that will be
         * rendered. You can use this to increase or reduce the amount of event rendering happening when scrolling
         * along a horizontal time axis. This can be useful if you render huge amount of events.
         *
         * To force the scheduler to render all events within the TimeAxis start & end dates, set this to -1.
         * The initial render will take slightly longer but no extra event rendering will take place when scrolling.
         *
         * NOTE: This is an experimental API which might change in future releases.
         * @config {Number}
         * @default
         * @internal
         * @category Experimental
         */
        scrollBuffer : 0,

        // A CSS class identifying areas where events can be scheduled using drag-create, double click etc.
        schedulableAreaSelector : '.b-sch-time-axis-cell',
        scheduledEventName      : 'event',



        /**
         * By default, scrolling the schedule will update the {@link #property-timelineContext} to reflect the new
         * currently hovered context. When displaying a large number of events on screen at the same time, this will
         * have a slight impact on scrolling performance. In such scenarios, opt out of this behavior by setting
         * this config to `false`.
         * @default
         * @prp {Boolean}
         * @category Misc
         */
        updateTimelineContextOnScroll : true,

        /**
         * By default, when the `EventStore` (and similar stores) is lazy loading, a loading indicator will be displayed
         * just below the timeline headers. Set this to `false` to prevent this indicator being shown.
         * @prp {Boolean}
         * @category Masking
         */
        lazyLoadingIndicator : true,

        /**
         * Configure UI transitions for various actions in the grid.
         * @prp {Object}
         * @property {Boolean} insertRecord Transition record insertions
         * @property {Boolean} removeRecord Transition record removals
         * @property {Boolean} toggleColumn Transition column visibility changes
         * @property {Boolean} expandCollapseColumn Transition parent/group column expand/collapse
         * @property {Boolean} toggleRegion Transition region expand/collapse
         * @property {Boolean} toggleTreeNode Transition tree node expand/collapse
         * @property {Boolean} toggleGroup Transition group expand/collapse
         * @property {Boolean} filterRemoval Transition row removals caused by filtering (under specific conditions)
         * @property {Boolean} removeEvent Transition event removals
         * @property {Boolean} changeEvent Transition event changes
         */
        transition : {
            removeEvent : true,
            changeEvent : true
        },

        /**
         * CSS class to add to rendered events
         * @config {String}
         * @category CSS
         * @private
         * @default
         */
        eventCls : 'b-sch-event',

        /**
         * CSS class to add to cells in the timeaxis column
         * @config {String}
         * @category CSS
         * @private
         * @default
         */
        timeCellCls : 'b-sch-time-axis-cell',

        /**
         * A CSS class to apply to each event in the view on mouseover (defaults to 'b-hover').
         * @config {String}
         * @default
         * @category CSS
         * @private
         */
        overScheduledEventClass : 'b-hover',

        /**
         * Set to `false` if you don't want to allow events overlapping times for any one resource (defaults to `true`).
         * <div class="note">Note that toggling this at runtime won't affect already overlapping events.</div>
         *
         * @prp {Boolean}
         * @default
         * @category Scheduled events
         */
        allowOverlap : true,

        /**
         * The height in pixels of Scheduler rows.
         * @config {Number}
         * @default
         * @category Common
         */
        rowHeight : 60,

        /**
         * A function called for each row to determine its height. It is passed a
         * {@link Scheduler.model.ResourceModel resource record} and expected to return the desired height of that
         * resource's row.
         *
         * If the function returns a falsy value, the Scheduler's internal calculation is used instead. It
         * pre-calculates row heights based on events in the rows. The amount of rows that are pre-calculated is
         * limited for performance reasons, the limit is configurable by specifying the
         * {@link Scheduler.view.SchedulerBase#config-preCalculateHeightLimit} config. The results of the
         * calculation are cached internally.
         *
         * ```javascript
         * new Scheduler({
         *    getRowHeight(resourceRecord) {
         *        if (resourceRecord.isImportant) {
         *            return 100;
         *        }
         *
         *        // Will use Scheduler's calculated row height
         *        return null;
         *    }
         * });
         * ```
         *
         * @config {Function} getRowHeight
         * @param {Scheduler.model.ResourceModel} record Resource record to determine row height for
         * @returns {Number|null} Desired row height, or `null` to use the calculated row height
         * @category Layout
         */

        /**
         * Maximum number of resources for which height is pre-calculated. If you have many events per
         * resource you might want to lower this number to gain some initial rendering performance.
         *
         * Specify a falsy value to opt out of row height pre-calculation.
         *
         * @config {Number}
         * @default
         * @category Layout
         */
        preCalculateHeightLimit : 10000,

        /**
         * Set to true for child nodes in a tree store to inherit their parent´s `eventColor`
         * @prp {Boolean}
         */
        inheritEventColor : null,



        // Skip live redraw of events while dragging RegionResize splitter if too many events are rendered in DOM
        liveRedrawWhileMovingSplitterThreshold : 100,

        eventContainerSelector : '.b-time-axis-sub-grid',

        testConfig : {
            loadMaskError : {
                autoClose : 10,
                showDelay : 0
            }
        }


        ,

        // Per-tier project classes, resolved using the scheduler's own tier (see
        // ProjectConsumer#resolveProjectModelClass). Overriding with a single class disables per-tier resolution.
        projectModelClass : {
            community : ProjectModelCommunity


        }
    };

    resourceTimeRangeSelector = '.b-sch-resource-time-range';

    // <remove-on-release>
    // Keep this commented out to have easy access to the syntax next time we need to use it
    // static get deprecatedEvents() {
    //     return {
    //         eventContextMenuBeforeShow : {
    //             product            : 'Scheduler',
    //             invalidAsOfVersion : '5.0.0',
    //             message            : '`eventContextMenuBeforeShow` event is deprecated, in favor of `eventMenuBeforeShow` event. Please see https://bryntum.com/docs/guide/Scheduler/upgrades/3.0.0+#scheduler-v3-1-0 for more information.'
    //         }
    //     };
    // }
    // </remove-on-release>

    //endregion

    //region Store & model docs

    // Documented here instead of in SchedulerStores since the Enterprise tier uses different types

    // Configs

    /**
     * Inline events, will be loaded into an internally created EventStore.
     * @config {Scheduler.model.EventModel[]|Scheduler.model.EventModelConfig[]} events
     * @non-lazy-load
     * @category Data
     */

    /**
     * The {@link Scheduler.data.EventStore} holding the events to be rendered into the scheduler (required).
     * @config {Scheduler.data.EventStore|Scheduler.data.EventStoreConfig} eventStore
     * @category Data
     */

    /**
     * Inline resources, will be loaded into an internally created ResourceStore.
     * @config {Scheduler.model.ResourceModel[]|Scheduler.model.ResourceModelConfig[]} resources
     * @non-lazy-load
     * @category Data
     */

    /**
     * The {@link Scheduler.data.ResourceStore} holding the resources to be rendered into the scheduler (required).
     * @config {Scheduler.data.ResourceStore|Scheduler.data.ResourceStoreConfig} resourceStore
     * @category Data
     */

    /**
     * Inline assignments, will be loaded into an internally created AssignmentStore.
     * @config {Scheduler.model.AssignmentModel[]|Object[]} assignments
     * @non-lazy-load
     * @category Data
     */

    /**
     * The optional {@link Scheduler.data.AssignmentStore}, holding assignments between resources and events.
     * Required for multi assignments.
     * @config {Scheduler.data.AssignmentStore|Scheduler.data.AssignmentStoreConfig} assignmentStore
     * @category Data
     */

    /**
     * Inline dependencies, will be loaded into an internally created DependencyStore.
     * @config {Scheduler.model.DependencyModel[]|Scheduler.model.DependencyModelConfig[]} dependencies
     * @non-lazy-load
     * @category Data
     */

    /**
     * The optional {@link Scheduler.data.DependencyStoreEnterprise}.
     * @config {Scheduler.data.DependencyStoreEnterprise|Scheduler.model.DependencyStoreConfig} dependencyStore
     * @category Data
     */

    // Properties

    /**
     * Get/set events, applies to the backing project's EventStore.
     * @member {Scheduler.model.EventModel[]} events
     * @accepts {Scheduler.model.EventModel[]|Scheduler.model.EventModelConfig[]}
     * @category Data
     */

    /**
     * Get/set the event store instance of the backing project.
     * @member {Scheduler.data.EventStore} eventStore
     * @category Data
     */

    /**
     * Get/set resources, applies to the backing project's ResourceStore.
     * @member {Scheduler.model.ResourceModel[]} resources
     * @accepts {Scheduler.model.ResourceModel[]|Scheduler.model.ResourceModelConfig[]}
     * @category Data
     */

    /**
     * Get/set the resource store instance of the backing project
     * @member {Scheduler.data.ResourceStore} resourceStore
     * @category Data
     */

    /**
     * Get/set assignments, applies to the backing project's AssignmentStore.
     * @member {Scheduler.model.AssignmentModel[]} assignments
     * @accepts {Scheduler.model.AssignmentModel[]|Object[]}
     * @category Data
     */

    /**
     * Get/set the event store instance of the backing project.
     * @member {Scheduler.data.AssignmentStore} assignmentStore
     * @category Data
     */

    /**
     * Get/set dependencies, applies to the backing projects DependencyStore.
     * @member {Scheduler.model.DependencyModel[]} dependencies
     * @accepts {Scheduler.model.DependencyModel[]|Scheduler.model.DependencyModelConfig[]}
     * @category Data
     */

    /**
     * Get/set the dependencies store instance of the backing project.
     * @member {Scheduler.data.DependencyStoreEnterprise} dependencyStore
     * @category Data
     */

    //endregion

    //region Events

    /**
     * Fired after rendering an event, when its element is available in DOM.
     * @event renderEvent
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.EventModel} eventRecord The event record
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord The assignment record
     * @param {Object} renderData An object containing details about the event rendering, see
     *   {@link Scheduler.view.mixin.SchedulerEventRendering#config-eventRenderer} for details
     * @param {Boolean} isRepaint `true` if this render is a repaint of the event, updating its existing element
     * @param {Boolean} isReusingElement `true` if this render lead to the event reusing a released events element
     * @param {HTMLElement} element The event bar element
     */

    /**
     * Fired after rendering all events in view, when their elements are available in DOM. This event is fired after the
     * last `renderEvent` event.
     * @event renderEventDone
     * @param {Scheduler.view.Scheduler} source This Scheduler
     */

    /**
     * Fired after releasing an event, useful to cleanup of custom content added on `renderEvent` or in `eventRenderer`.
     * @event releaseEvent
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.EventModel} eventRecord The event record
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord The assignment record
     * @param {Object} renderData An object containing details about the event rendering
     * @param {HTMLElement} element The event bar element
     */

    /**
     * Fired after the events of a resource (or of a nested events parent) have been laid out, when their final pixel
     * positions are known but before they are rendered.
     *
     * Fires each time the event layout of a row (or resource column, in vertical mode) is calculated. The layout is
     * cached, so a row re-rendered from a cached layout, for example when scrolled back into view, does not fire it
     * again.
     *
     * Listeners may mutate the render data of the row's events, for example the DOM configs of the labels added by the
     * {@link Scheduler.feature.Labels} feature (see `labelConfigs` in
     * {@link Scheduler.view.mixin.SchedulerEventRendering#typedef-EventRenderData}). The render data is cached along
     * with the layout, so such mutations persist for as long as the cached layout is reused. They are not carried over
     * to the next layout calculation, which generates new render data.
     *
     * Click **Overlap** below to let the events of a row overlap, and the labels truncate with an ellipsis to the space
     * between neighboring bars instead of running into each other:
     *
     * {@inlineexample Scheduler/view/EventLayoutDone.js}
     *
     * The `Scheduler/labels` demo contains a more complete implementation, which also clamps top and bottom labels and
     * handles milestones and fully contained events.
     *
     * @event eventLayoutDone
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource record whose events were laid out
     * @param {Scheduler.model.EventModel} [parentEventRecord] The parent event record, when laying out nested events
     * @param {EventRenderData[]} eventsData The render data of the laid out events (`left`, `top`, `width`, `height`,
     *   `wrapperChildren` etc), in render order. Empty for a row without events in the current time axis. See
     *   {@link #config-eventRenderer} for details
     * @param {String} eventLayout The {@link #config-eventLayout} type in effect for this row, `'none'` when events
     *   are allowed to overlap. Resolved per resource, and reliable during this event unlike
     *   `scheduler.eventLayout`, which is not yet updated when the event fires for the refresh caused by assigning it
     * @param {Number} [rowHeight] The row height required by the layout. Horizontal mode only
     * @advanced
     */

    /**
     * Fired when clicking a resource header cell
     * @event resourceHeaderClick
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource record
     * @param {Event} event The event
     */

    /**
     * Fired when double clicking a resource header cell
     * @event resourceHeaderDblclick
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource record
     * @param {Event} event The event
     */

    /**
     * Fired when activating context menu on a resource header cell
     * @event resourceHeaderContextmenu
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource record
     * @param {Event} event The event
     */

    /**
     * Triggered when a keydown event is observed if there are selected events.
     * @event eventKeyDown
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.EventModel[]} eventRecords The selected event records
     * @param {Scheduler.model.AssignmentModel[]} assignmentRecords The selected assignment records
     * @param {KeyboardEvent} event Browser event
     */

    /**
     * Triggered when a keyup event is observed if there are selected events.
     * @event eventKeyUp
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.EventModel[]} eventRecords The selected event records
     * @param {Scheduler.model.AssignmentModel[]} assignmentRecords The selected assignment records
     * @param {KeyboardEvent} event Browser event
     */

    //endregion

    //region Functions injected by features

    // For documentation & typings purposes

    /**
     * Opens an editor UI to edit the passed event, or a config object for a new event.
     *
     * *NOTE: Only available when the {@link Scheduler/feature/EventEdit} feature is enabled.*
     *
     * @function editEvent
     * @param {Scheduler.model.EventModel|EventModelConfig|String|Number} eventRecord Event to edit
     * @param {Scheduler.model.ResourceModel} [resourceRecord] The Resource record for the event.
     * This parameter is needed if the event is newly created for a resource and has not been assigned, or when using
     * multi assignment.
     * @param {HTMLElement} [element] Element to anchor editor to (defaults to events element)
     * @category Feature shortcuts
     */

    /**
     * Returns the dependency record for a DOM element
     *
     * *NOTE: Only available when the {@link Scheduler/feature/Dependencies} feature is enabled.*
     *
     * @function resolveDependencyRecord
     * @param {HTMLElement} element The dependency line element
     * @returns {Scheduler.model.DependencyModel} The dependency record
     * @category Feature shortcuts
     */

    //endregion

    //region Init

    afterConstruct() {
        super.afterConstruct();

        this.ion({
            scroll            : 'onVerticalScroll',
            splitterDragStart : 'internalOnSplitterDragStart',
            thisObj           : this
        });
    }

    /**
     * Indicates whether this Scheduler is based upon the Enterprise tier.
     * @member {Boolean}
     * @readonly
     * @advanced
     */
    get isSchedulerProBase() {
        return this.isEnterpriseTier;
    }

    //endregion

    //region Config getters/setters

    // Placeholder getter/setter for mixins, please make any changes needed to SchedulerStores#store instead
    get store() {
        return super.store;
    }

    set store(store) {
        super.store = store;
    }

    /**
     * Returns an object defining the range of visible resources
     * @member {Object}
     * @readonly
     * @property {Scheduler.model.ResourceModel} visibleResources.first First visible resource
     * @property {Scheduler.model.ResourceModel} visibleResources.last Last visible resource
     * @readonly
     * @category Resources
     */
    get visibleResources() {
        const me = this;

        if (me.isVertical) {
            return me.currentOrientation.visibleResources;
        }

        return {
            first : me.store.getById(me.firstVisibleRow?.id),
            last  : me.store.getById(me.lastVisibleRow?.id)
        };
    }

    //endregion

    //region Event handlers

    onLocaleChange() {
        this.currentOrientation.onLocaleChange();

        super.onLocaleChange();
    }

    onContentChange() {
        super.onContentChange();

        // In vertical mode, ensure the scroll height matches the time axis, not the row content
        if (this.isVertical) {
            this.updateCanvasSize();
        }
    }

    changeAutoCreate(autoCreate) {
        if (autoCreate) {
            const type = typeof autoCreate;

            if (type !== 'object') {
                autoCreate = {
                    gesture : type === 'string' ? autoCreate : 'dblclick'
                };
            }
            autoCreate = Config.merge(autoCreate, SchedulerBase.$meta.config.autoCreate);

            // Convert eg '1h' to canonical form { unit : 'hour', magnitude : 1 }
            if (autoCreate.duration) {
                autoCreate.duration = DateHelper.parseDuration(autoCreate.duration);
            }
        }

        return autoCreate;
    }

    updateAutoCreate(autoCreate, was) {
        if (autoCreate?.gesture !== was?.gesture) {
            this.detachListeners('scheduleAutoCreateGesture');
            this.ion({
                name                              : 'scheduleAutoCreateGesture',
                [`schedule${autoCreate.gesture}`] : 'onScheduleAutoCreateGesture',
                thisObj                           : this
            });
        }
        // The autocreate.newEvent property must be processed
        if (!was) {
            this.updateLocalization();
        }
    }

    updateInheritEventColor() {
        if (!this.isConfiguring) {
            this.refreshWithTransition();
        }
    }

    async onScheduleAutoCreateGesture({ domEvent, time, resourceRecord }) {
        const
            me           = this,
            autoCreate   = me.autoCreate || emptyObject,
            snapType     = autoCreate.snapType || 'floor',
            { step }     = autoCreate,
            date         = step
                ? DateHelper[snapType](time, DateHelper.parseDuration(step))
                : me.timeAxis[`${snapType}Date`](time);

        /**
         * This event fires whenever the {@link #config-autoCreate autoCreate gesture} is detected.
         *
         * This event is preventable and may be used to validate autoCreate-initiated event creation.
         * @event beforeAutoCreate
         * @preventable
         * @async
         * @param {Event} domEvent The DOM event which initiated the creation.
         * @param {Date} date The starting time of the event to be created.
         * @param {Scheduler.model.ResourceModel} resourceRecord The resource if the UI includes a resource.
         */
        if (
            await me.trigger('beforeAutoCreate', {
                domEvent,
                date,
                resourceRecord
            }) !== false
        ) {
            return me.createEvent(date, resourceRecord, true);
        }
    }

    onVerticalScroll({ scrollTop }) {
        this.currentOrientation.updateFromVerticalScroll(scrollTop);
    }

    internalOnSplitterDragStart() {
        if (this.isHorizontal && this.foregroundCanvas.syncIdMap) {
            if (Object.keys(this.foregroundCanvas.syncIdMap).length > this.liveRedrawWhileMovingSplitterThreshold) {
                this.suspendRefresh();

                this.ion({ splitterDragEnd : () => this.resumeRefresh(true, false), once : true });
            }
        }
    }

    /**
     * Called when new event is created.
     * Сan be overridden to supply default record values etc.
     * @param {Scheduler.model.EventModel} eventRecord Newly created event
     * @category Scheduled events
     */
    onEventCreated(eventRecord) {}

    beforeAnimatedRowRemoval(ids, height) {
        const me = this;

        // Silently increase vertical buffer size to make sure we render enough events to fill removed rows
        if (height > me.currentOrientation.verticalBufferSize) {
            me.oldVerticalBufferSize = me.currentOrientation.verticalBufferSize;
            me.currentOrientation._verticalBufferSize = height;
        }

        if (ids) {
            for (const id of ids) {
                // Querying DOM here, since resource might be gone from store already
                const eventElements = me.foregroundCanvas.querySelectorAll(`.b-sch-event-wrap[data-resource-id="${CSS.escape(id)}"], .b-sch-resource-time-range[data-resource-id="${CSS.escape(id)}"]`);
                for (const element of eventElements) {
                    element.retainElement = 'remove';
                    element.transitionRemove = true;
                }
            }
        }
    }

    // Called from RowManager when animating removal / toggling of rows.
    // We need to refresh events to match (and transition to) rows new positions
    afterAnimatedRowRemoval(ids, height) {
        const me = this;

        me.currentOrientation.refreshEvents();

        // Silently reset vertical buffer size now that we are done with the transitioned removal
        if (me.oldVerticalBufferSize) {
            me.currentOrientation._verticalBufferSize = me.oldVerticalBufferSize;
            me.oldVerticalBufferSize = null;
        }
    }

    //endregion

    //region Dom event dummies

    // These forwarders are needed since super cannot be called from the SchedulerDomEvents mixin

    onElementKeyDown(event) {
        return super.onElementKeyDown(event);
    }

    onElementKeyUp(event) {
        return super.onElementKeyUp(event);
    }

    onElementMouseOver(event) {
        return super.onElementMouseOver(event);
    }

    onElementMouseOut(event) {
        return super.onElementMouseOut(event);
    }

    //endregion

    //region Feature hooks

    // Called for each event during drop
    processEventDrop() {}
    processCrossSchedulerEventDrop() {}

    // Called before event drag starts
    beforeEventDragStart() {}

    // Called after event drag starts
    afterEventDragStart() {}

    // Called after aborting a drag
    afterEventDragAbortFinalized() {}

    // Called during event drag validation
    checkEventDragValidity() {}

    // Called after event resizing starts
    afterEventResizeStart() {}

    // Called after generating a DomConfig for an event
    afterRenderEvent() {}

    //endregion

    //region Scheduler specific date mapping functions

    get hasEventEditor() {
        return Boolean(this.eventEditingFeature);
    }

    get eventEditingFeature() {
        const {
            eventEdit,
            taskEdit,
            simpleEventEdit
        } = this.features;

        return eventEdit?.enabled
            ? eventEdit
            : taskEdit?.enabled
                ? taskEdit
                : simpleEventEdit?.enabled ? simpleEventEdit : null;
    }

    /**
     * Creates an event on the specified date which conforms to the {@link #config-autoCreate}
     * setting for the specified resource. The event is then scrolled into view.
     *
     * NOTE: If the scheduler is readonly, or resource type is invalid (group header), or if `allowOverlap` is `false`
     * and slot is already occupied - no event is created.
     *
     * This method may be called programmatically by application code if the {@link #config-autoCreate}
     * setting is `false`, in which case the default values for {@link #config-autoCreate} will be used.
     *
     * If the {@link Scheduler.feature.EventEdit} feature is active, the new event
     * will be displayed in the event editor.
     * @param {Date} date The date to add the event at.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource to create the event for.
     * @category Scheduled events
     */
    async createEvent(startDate, resourceRecord) {
        const
            me = this,
            {
                eventStore,
                assignmentStore,
                hasEventEditor,
                timeAxis
            } = me;

        // Enterprise override: skips creation when the resource calendar reports the date as non-working, and defers
        // creation while the task editor is open so an in-flight transaction won't reject the newly added event.
        if (me.isEnterpriseTier) {
            if (resourceRecord.isSpecialRow) {
                return;
            }

            // When ignoreResourceCalendar defaults to true, allow event creation in non-working time
            const ignoreResourceCalendar = eventStore.modelClass.defaultValues?.ignoreResourceCalendar;

            if (!ignoreResourceCalendar) {
                if (me.fillTicks) {
                    const
                        tick               = timeAxis.getSnappedTickFromDate(startDate),
                        availabilityRanges = resourceRecord.effectiveCalendar.getWorkingTimeRanges(tick.startDate, tick.endDate);

                    if (availabilityRanges.length === 0) {
                        return;
                    }
                    startDate = availabilityRanges[0].startDate;
                }
                else if (!resourceRecord.isWorkingTime(startDate)) {
                    return;
                }
            }

            // If the task editor is active, a dblclick triggers a chain of async actions (store add → project commit →
            // editor cancel → editor hide → transaction reject → dependency draw). A fast second dblclick can otherwise
            // add an event that gets erased by the previous transaction's rejection. Defer to once the active edit is done.
            if (me.taskEdit?.isEditing) {
                me.once('afterTaskEdit', () => me.createEvent(startDate, resourceRecord, true));
                return;
            }
        }

        const
            { changeEvent }       = me.transition,
            autoCreate            = me.autoCreate || emptyObject,
            {
                newName,
                useEventModelDefaults
            } = autoCreate,
            duration              = autoCreate?.duration || {
                magnitude : useEventModelDefaults ? eventStore.modelClass.defaultValues.duration ?? 1 : 1,
                unit      : useEventModelDefaults ? eventStore.modelClass.defaultValues.durationUnit ?? timeAxis.unit : timeAxis.unit
            },
            resourceRecords       = [resourceRecord],
            eventRecord           = eventStore.createRecord({
                startDate,
                endDate      : DateHelper.add(startDate, duration),
                duration     : duration.magnitude,
                durationUnit : duration.unit,
                name         : me.resolveCallback(newName, me, false) ? me.callback(newName, me, [me, startDate, resourceRecord]) : newName
            });

        if (me.readOnly || resourceRecord.isSpecialRow || resourceRecord.readOnly || (!me.isDateRangeAvailable(
            eventRecord.startDate,
            eventRecord.endDate,
            null,
            resourceRecord
        ))) {
            return;
        }



        // It's only a provisional event if there is an event edit feature available to
        // cancel the add (by removing it). Otherwise it's a definite event creation.
        eventRecord.isCreating = hasEventEditor;

        me.onEventCreated(eventRecord);

        const assignmentRecords = assignmentStore?.assignEventToResource(eventRecord, resourceRecord);

        /**
         * Fires before an event is added. Can be triggered by schedule double click or drag create action.
         * @event beforeEventAdd
         * @param {Scheduler.view.Scheduler} source The Scheduler instance
         * @param {Scheduler.model.EventModel} eventRecord The record about to be added
         * @param {Scheduler.model.ResourceModel[]} resourceRecords Resources that the record is assigned to
         * @param {Scheduler.model.AssignmentModel[]} assignmentRecords The assignment records
         * @preventable
         */
        if (me.trigger('beforeEventAdd', { eventRecord, resourceRecords, assignmentRecords }) === false) {
            // Remove any assignment created above, to leave store as it was
            assignmentStore?.remove(assignmentRecords);



            return;
        }

        me.transition.changeEvent = false;
        const result = eventStore.add(eventRecord);

        me.project.commitAsync().then(() => {
            if (!me.isDestroyed) {
                me.transition.changeEvent = changeEvent;
            }
        });

        if (!result) {
            // Remove any assignment created above, to leave store as it was
            assignmentStore?.remove(assignmentRecords);


            return;
        }

        // Element must be created synchronously, not after the project's normalizing delays.
        // Overrides the check for isEngineReady in VerticalRendering so that the newly added record
        // will be rendered when we call refreshRows.
        me.isCreating = true;
        me.refreshRows();
        me.isCreating = false;

        await me.scrollEventIntoView(eventRecord);

        if (me.isDestroyed) {
            return;
        }
        /**
         * Fired when a double click or drag gesture has created a new event and added it to the event store.
         * @event eventAutoCreated
         * @param {Scheduler.view.Scheduler} source This Scheduler.
         * @param {Scheduler.model.EventModel} eventRecord The new event record.
         * @param {Scheduler.model.ResourceModel} resourceRecord The resource assigned to the new event.
         */
        me.trigger('eventAutoCreated', {
            eventRecord,
            resourceRecord
        });

        if (hasEventEditor) {
            me.editEvent(eventRecord, resourceRecord, me.getEventElement(eventRecord));
        }
    }

    /**
     * Checks if a date range is allocated or not for a given resource.
     * @param {Date} startDate The start date
     * @param {Date} endDate The end date
     * @param {Scheduler.model.EventModel|Scheduler.model.AssignmentModel|Scheduler.model.EventModel[]|Scheduler.model.AssignmentModel[]|null} excludeEventOrAssignment An event or
     * assignment to exclude from the check (or null)
     * @param {Scheduler.model.ResourceModel|Scheduler.model.ResourceModel[]} resourceRecord A resource or an array of resource records
     * @param {Boolean} [allowOverlap] True to allow checking for availability ignoring overlapping events. Defaults to
     * the Scheduler's {@link #config-allowOverlap} setting.
     * @returns {Boolean} True if the timespan is available for the resource(s)
     * @category Dates
     */
    isDateRangeAvailable(startDate, endDate, excludeEventOrAssignment, resourceRecord, allowOverlap = this.allowOverlap) {
        const options = {
            startDate,
            endDate,
            excludeEventOrAssignment,
            resourceRecord,
            allowOverlap
        };



        return this.eventStore.isDateRangeAvailable(options);
    }

    //endregion

    /**
     * Resumes UI refresh on store operations.
     *
     * Multiple calls to `suspendRefresh` stack up, and will require an equal number of `resumeRefresh` calls to
     * actually resume UI refresh.
     *
     * Specify `true` as the first param to trigger a refresh if this call unblocked the refresh suspension.
     * If the underlying project is calculating changes, the refresh will be postponed until it is done.
     *
     * @param {Boolean} [trigger=true] Pass `false` to not trigger a refresh, if this resume unblocks suspension
     * @privateparam {Boolean} [useTransitions] `false` to block transitions
     * @category Rendering
     */
    async resumeRefresh(trigger = true, useTransitions = true) {
        super.resumeRefresh(false);

        const me = this;

        if (!me.refreshSuspended && trigger) {
            // Do not refresh until project is in a valid state
            if (!me.isEngineReady) {
                // Refresh will happen because of the commit, bail out of this one after forcing rendering to consider
                // next one a full refresh
                me.currentOrientation.refreshAllWhenReady = true;
                return me.project.commitAsync();
            }

            // View could've been destroyed while we waited for engine
            if (!me.isDestroyed) {
                // If it already is, refresh now
                if (useTransitions) {
                    me.refreshWithTransition();
                }
                else {
                    me.refresh();
                }
            }
        }
    }

    /**
     * Triggers a render of all the cells (in horizontal mode) in and event bars for the passed resource.
     *
     * Since Scheduler uses virtualized resources, calling this method for a resource that is not currently rendered
     * will not have any effect.
     *
     * {@note}Manipulating resource or event records and Scheduler settings refreshes the Scheduler automatically. You
     * should only need to call this function if you have outside data/settings unknown to the Scheduler that has
     * changed and requires the resource to update to reflect the changes{/@note}
     *
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource that should be refreshed
     * @category Rendering
     */
    refreshResource(resourceRecord) {
        this.refreshResources([resourceRecord]);
    }

    /**
     * Triggers a render of all the cells (in horizontal mode) and event bars for the passed resources. Leave the
     * argument out to refresh all resources.
     *
     * Since Scheduler uses virtualized resources, calling this method for resources that are not currently rendered
     * will not have any effect.
     *
     * {@note}Manipulating resource or event records and Scheduler settings refreshes the Scheduler automatically. You
     * should only need to call this function if you have outside data/settings unknown to the Scheduler that has
     * changed and requires some resources to update to reflect the changes{/@note}
     *
     * @param {Scheduler.model.ResourceModel[]} resourceRecords The resources that should be refreshed
     * @category Rendering
     */
    refreshResources(resourceRecords) {
        this.currentOrientation.refreshResources(resourceRecords);
    }

    //region Appearance

    // Overrides grid to take crudManager / project loading into account
    toggleEmptyText() {
        const me = this;


        DomHelper.toggleClasses(me.element, 'b-grid-empty', !(me.resourceStore.count > 0 || me.crudManager?.isLoading));
    }



    // Overrides Grids base implementation to return a correctly calculated height for the row. Also stores it in
    // RowManagers height map, which is used to calculate total height etc.
    internalGetRowHeight(resourceRecord) {
        const me = this;

        if (me.isHorizontal) {
            // Special rows (group headers and footers) get the height supplied by the features rendering them. An
            // app-supplied getRowHeight() takes precedence over the event layout based calculation. The inherited
            // default must not be consulted, the resource rowHeight field it reads is already factored into the
            // calculation (see SchedulerResourceRendering#getResourceHeight)
            const height = (resourceRecord.isSpecialRow && me.getSpecialRowHeight(resourceRecord)) ||
                (me.hasOwnGetRowHeight && me.getRowHeight(resourceRecord)) ||
                me.currentOrientation.calculateRowHeight(resourceRecord);

            me.rowManager.storeKnownHeight(resourceRecord.id, height);
            return height;
        }

        // Vertical mode's single dummy row must always match the time axis height. An app-supplied getRowHeight()
        // is deliberately not consulted, the row is not backed by an app-meaningful record
        if (me.isVertical) {
            const { totalSize } = me.timeAxisViewModel;

            me.rowManager.storeKnownHeight(resourceRecord.id, totalSize);
            return totalSize;
        }
    }

    // Calculates the height for specified rows. Call when changes potentially makes its height invalid
    calculateRowHeights(resourceRecords, silent = false) {
        const { store } = this;

        for (const resourceRecord of resourceRecords) {
            // Array allowed to have nulls in it for easier code when calling this fn
            // Also ignore records not in the flat part of the store (collapsed away resources)
            if (resourceRecord && store.isAvailable(resourceRecord)) {
                this.internalGetRowHeight(resourceRecord);
            }
        }

        if (!silent) {
            this.rowManager.estimateTotalHeight(true);
        }
    }

    // Calculate heights for all rows (up to the preCalculateHeightLimit)
    calculateAllRowHeights(silent = false) {
        const
            { store, rowManager } = this,
            count                 = Math.min(store.count, this.preCalculateHeightLimit);

        // Allow opt out by specifying falsy value.
        if (count) {
            rowManager.clearKnownHeights();

            for (let i = 0; i < count; i++) {
                const record = store.records[i];

                if (!record) {
                    // No record means we have lazy loading enabled, and we've hit an index which hasn't been loaded yet
                    continue;
                }
                // This will both calculate and store the height
                this.internalGetRowHeight(record);
            }

            // Make sure height is reflected on scroller etc.
            if (!silent) {
                rowManager.estimateTotalHeight(true);
            }
        }
    }

    // Row border not used in vertical mode, don't waste time measuring it
    measureRowBorder() {
        if (this.isVertical) {
            this._rowBorderHeight = 0;
            this._isRowBorderMeasured = true;
            return;
        }

        super.measureRowBorder();
    }

    //endregion

    //region Calendar Mode Interface

    // These are all internal and match up w/CalendarMixin

    /**
     * Returns the date or ranges of included dates as an array. If only the {@link #config-startDate} is significant,
     * the array will have that date as its only element. Otherwise, a range of dates is returned as a two-element
     * array with `[0]` is the {@link #config-startDate} and `[1]` is the {@link #property-lastDate}.
     * @member {Date[]}
     * @internal
     */
    get dateBounds() {
        const
            me  = this,
            ret = [me.startDate];

        if (me.range.unit === 'week') {
            ret.push(me.lastDate);
        }

        return ret;
    }

    get description() {
        const
            me                     = this,
            { startDate, endDate } = me,
            hasRenderer            = me.resolveCallback('descriptionRenderer', me, false);

        if (!hasRenderer && me.range.unit === 'day' && endDate - startDate && !DateHelper.isStartOf(startDate, 'd') && !DateHelper.isStartOf(endDate, 'd')) {
            const
                startMonth   = DateHelper.getMonthName(startDate.getMonth()),
                endMonth     = DateHelper.getMonthName(endDate.getMonth()),
                endMonthName = startMonth !== endMonth ? `${endMonth} ` : '';

            // Dont duplicate month name if possible. If same month use eg "May 1 - 3, 2022"
            return `${startMonth} ${startDate.getDate()} - ${endMonthName}${endDate.getDate()}, ${endDate.getFullYear()}`;
        }
        return super.description;
    }

    get defaultDescriptionFormat() {
        return descriptionFormats[this.range.unit];
    }

    /**
     * The last day that is included in the date range. This is different than {@link #config-endDate} since that date
     * is not inclusive. For example, an `endDate` of 2022-07-21 00:00:00 indicates that the time range ends at that
     * time, and so 2022-07-21 is _not_ in the range. In this example, `lastDate` would be 2022-07-20 since that is the
     * last day included in the range.
     * @member {Date}
     * @internal
     */
    get lastDate() {
        const  { endDate } = this;

        // endDate is "exclusive" if it's on 00:00:00 of that day, so subtract 1
        // to keep description consistent with human expectations.
        if (endDate) {
            return DateHelper.isStartOf(endDate, 'd') ? DateHelper.add(endDate, -1, 'day') : endDate;
        }
    }

    getEventRecord(target) {
        target = DomHelper.getEventElement(target);

        return this.resolveEventRecord(target);
    }

    getResourceRecord(domEvent) {
        return this.resolveResourceRecord(domEvent);
    }

    getEventElement(eventRecord) {
        return this.getElementFromEventRecord(eventRecord);
    }

    /**
     * {@note}This property is for use when the Scheduler is used as a Calendar view - a `mode`.{/@note}
     *
     * This property yields a {@link Core.widget.Menu} configuration block which encapsulates the range choices
     * which this widget may be set to encapsulate:
     * - day
     * - week
     * - month
     * - year
     * - decade
     *
     * By default a `list` view adds these choices to the header context menu.
     * An `agenda` view creates a floating settings button which offers this menu.
     * The property may be used to create a custom UI for changing the range.
     * The value yielded by the default `get listRangeMenu()` implementation looks like this:
     *
     * ```javascript
     * {
     *     items : {
     *         listRangeDayItem    : {config for DAY range menu item },
     *         listRangWeekItem    : {config for WEEK range menu item },
     *         listRangMonthItem   : {config for MONTH range menu item },
     *         listRangeYearItem   : {config for YEAR range menu item },
     *         listRangeDecadeItem : {config for DECADE range menu item }
     *     }
     * }
     * ```
     *
     * A subclass can override `get listRangeMenu()` and mutate the object returned by the `super` call.
     *
     * For example, it could `delete` properties of the `items` block to limit which ranges may be selected.
     *
     * @member {MenuConfig} listRangeMenu
     * @readonly
     */
    changeListRangeMenu(listRangeMenu) {
        if (listRangeMenu) {
            return TimelineBase.mergeConfigs({
                view : this
            }, listRangeMenu);
        }
    }

    changeRange(range) {
        if (range) {
            // '1d' or '1 day' or '4 weeks', '1десятилетие' etc.
            // We parse to an object.
            if (typeof range === 'string') {
                // Parses local or canonical names of units into full canonical name
                const unit = DateHelper.parseTimeUnit(range);

                if (unit) {
                    range = {
                        magnitude : 1,
                        unit
                    };
                }
                else {
                    range = DateHelper.parseDuration(range);
                }
            }
            else if (typeof range === 'number') {
                return {
                    magnitude : range,
                    unit      : 'day'
                };
            }
        }
        return range;
    }

    updateRange(range) {
        if (!this.isConfiguring) {
            const
                currentDate = this.date,
                newDate     = this.date = DateHelper.clamp(currentDate, DateHelper.floor(currentDate, range), DateHelper.ceil(currentDate, range));

            // Force a TimeAxis time span update if changing the range did not change the date
            if (currentDate.getTime() === newDate.getTime()) {
                this.updateDate(newDate, currentDate, true);
            }
        }
    }

    changeShiftIncrement(shiftIncrement) {
        // '1d' or '1 day' or '4 weeks', '1десятилетие' etc.
        return this.changeRange(shiftIncrement);
    }

    updateShiftIncrement(old, shiftIncrement) {
        /**
         * Fired when the {@link #property-shiftIncrement} of this view changes.
         * {@note}This event is only fired when used as a mode of a Calendar{/@note}
         *
         * @event shiftIncrementChange
         * @param {Scheduler.view.TimelineBase} source This Scheduler/Gantt instance.
         * @param {Object} [old] The shift increment *if any*.
         * @param {Object} new The shift increment
         */
        this.trigger('shiftIncrementChange', {
            old,
            new : shiftIncrement
        });
    }

    get shiftIncrement() {
        return this._shiftIncrement || this.range;
    }

    get stepUnit() {
        const { shiftIncrement } = this;

        // If just one unit, return the unit name
        return shiftIncrement.magnitude === 1 ? DateHelper.getLocalizedNameOfUnit(shiftIncrement.unit) : `${shiftIncrement.magnitude} ${DateHelper.getLocalizedNameOfUnit(shiftIncrement.unit, true)}`;
    }

    // When scrolling to a date, it implies bringing the entire "day cell" into view.
    async updateDate(newDate, was, changeTimeSpan) {
        const
            me                           = this,
            {
                timeAxis,
                vertical,
                range,
                workingTime
            }                            = me,
            visibleStartDate             = DateHelper.clearTime(me.visibleDateRange?.startDate || newDate),
            visibleDate                  = changeTimeSpan ? visibleStartDate : newDate,
            { startDate : oldStartDate } = timeAxis,
            snappedStartDate             = DateHelper.floor(oldStartDate, range),
            snappedEndDate               = DateHelper.add(snappedStartDate, range),
            increment                    = me.isShifting ? me.shiftIncrement : me.range,
            startDate                    = DateHelper.floor(oldStartDate, increment, oldStartDate),
            endDate                      = DateHelper.add(startDate, range),
            scrollOpts                   = {
                [vertical ? 'x' : 'y'] : false,
                animate                : true,
                block                  : newDate < startDate ? 'start' : newDate >= endDate ? 'end' : 'nearest'
            },
            oldWidth                     = me.timeAxisColumn.width;

        // If TimeAxis does not encapsulate newDate, or we are explicitly being asked to,
        // Set the date range to a range which encapsulates the date
        if (changeTimeSpan || !DateHelper.betweenLesser(newDate, snappedStartDate, snappedEndDate)) {
            const
                newStartDate = DateHelper.floor(newDate, range),
                newEndDate   = DateHelper.add(newStartDate, range);

            // Constrain the two dates into the working hours
            if (workingTime) {
                newStartDate.setHours(workingTime.fromHour);
                newEndDate.setHours(workingTime.toHour - 24);
            }
            Object.assign(scrollOpts, {
                animate    : false,
                block      : 'start',
                edgeOffset : changeTimeSpan ? { start : me.getCoordinateFromDate(visibleStartDate) - me.timelineScroller.position } : 0
            });
            me.setTimeSpan(newStartDate, newEndDate);

            // Need to wait for the UI update if we are losing width
            if (me.timeAxisColumn.width < oldWidth) {
                await AsyncHelper.sleep(0);
            }
        }

        // We must pull dates from TimeAxis from here on because it might have been changed by setTimeSpan above.
        // If TimeAxis is filtered, newDate might not be visible.
        me._date = DateHelper.clamp(newDate, timeAxis.startDate, timeAxis.endDate);

        if (!me.preventScroll) {
            // Initially, the date is scrolled to the viewport start.
            if (me.isConfiguring) {
                me.visibleDate = {
                    date    : me._date,
                    block   : 'start',
                    animate : me.isPainted
                };
            }
            // Only try to scroll to the day cell during visible lifecycle.
            else {
                // We calculate the *non-local* Rectangle of the day cell.
                // Scroller assumes non-local coordinates when scrolling a Rectangle into view.
                const
                    dateStart = me.getCoordinateFromDate(visibleDate, false),
                    dateEnd   = me.getCoordinateFromDate(DateHelper.min(DateHelper.add(visibleDate, 1, 'd'), timeAxis.endDate), false),
                    dayWidth  = Math.abs((dateEnd === -1 ? me.timelineScroller.scrollSize : dateEnd) - dateStart),
                    dayCell   = vertical
                        ? new Rectangle(0, dateStart, 1, dayWidth)
                        : new Rectangle(me.rtl ? dateEnd : dateStart, 0, Math.abs(dayWidth), 1);

                me.timelineScroller.scrollIntoView(dayCell, scrollOpts);
            }
        }

        me.trigger('descriptionChange');
    }

    updateScrollBuffer(value) {
        if (!this.isConfiguring) {
            this.currentOrientation.scrollBuffer = value;
        }
    }

    /**
     * Interface method used by an encapsulating Calendar view to implement the "prev" button.
     * @category Calendar integration
     */
    previous() {
        this.move(-1);
    }

    /**
     * Interface method used by an encapsulating Calendar view to implement the "next" button.
     * @category Calendar integration
     */
    next() {
        this.move(1);
    }

    move(direction = 1) {
        // 1 or -1
        direction = Math.sign(direction);

        const
            me = this,
            {
                shiftIncrement
            } = me;

        // If shiftIncrement is cleared, that disables moving by range
        if (shiftIncrement) {
            // Snapping of date into boundaries to create a startDate in updateDate should use the
            // shiftIncrement when shifting
            me.isShifting = true;
            me.date = DateHelper.add(me.date, { unit : shiftIncrement.unit, magnitude : direction * shiftIncrement.magnitude });
            me.isShifting = false;
        }
    }

    //endregion

    /**
     * Assigns and schedules an unassigned event record (+ adds it to this Scheduler's event store unless already in it).
     * @param {Object} config The config containing data about the event record to schedule
     * @param {Date} config.startDate The start date
     * @param {Scheduler.model.EventModel|EventModelConfig} config.eventRecord Event (or data for it) to assign and schedule
     * @param {Scheduler.model.EventModel} [config.parentEventRecord] Parent event to add the event to (to nest it),
     * only applies when using the NestedEvents feature
     * @param {Scheduler.model.ResourceModel} config.resourceRecord Resource to assign the event to
     * @param {HTMLElement} [config.element] The element if you are dragging an element from outside the scheduler
     * @category Scheduled events
     */
    async scheduleEvent({ startDate, eventRecord, resourceRecord, element }) {
        const me = this;

        // NestedEvents has an override for this function to handle parentEventRecord
        if (!me.eventStore.includes(eventRecord)) {
            [eventRecord] = me.eventStore.add(eventRecord);
        }

        eventRecord.beginBatch();
        eventRecord.startDate = startDate;
        eventRecord.assign(resourceRecord);
        eventRecord.endBatch();

        if (element) {
            const eventRect = Rectangle.from(element, me.foregroundCanvas);

            // Clear translate styles used by DragHelper
            DomHelper.setTranslateXY(element, 0, 0);
            DomHelper.setTopLeft(element, eventRect.y, eventRect.x);

            DomSync.addChild(me.foregroundCanvas, element, eventRecord.assignments[0].id);
        }

        await me.project.commitAsync();

        return eventRecord;
    }

    /**
     * Internal function to get an array of assignment instances from:
     * * Single event or assignment instance
     * * Array of event or assignment instances
     * * Single event or assignment id (depending on `usesSingleAssignment`)
     * * Array of event or assignment ids (depending on `usesSingleAssignment`)
     * @internal
     */
    internalGetAssignmentsToHighlight(eventsOrAssignments) {
        const
            { eventStore, assignmentStore, resourceStore } = this,
            { usesSingleAssignment } = eventStore;

        return ArrayHelper.asArray(eventsOrAssignments).reduce((acc, eventOrAssignment) => {
            const store = (usesSingleAssignment && !eventOrAssignment.isModel) || eventOrAssignment.isEvent
                ? eventStore
                : assignmentStore;

            eventOrAssignment = store.getById(eventOrAssignment);

            if (eventOrAssignment?.isEvent) {
                acc.push(...eventOrAssignment.assignments.filter(a => a.resource.stores.includes(resourceStore)));
            }
            else if (eventOrAssignment?.isAssignment && eventOrAssignment.resource.stores.includes(resourceStore)) {
                acc.push(eventOrAssignment);
            }

            return acc;
        }, []);
    }

    /**
     * Returns an array of events for the date range specified by the `startDate` and `endDate` options.
     *
     * By default, for any date, this includes any event which *intersects* that date.
     *
     * To only include events that are fully contained *within* the date range, pass the `allowPartial`
     * option as `false`.
     *
     * By default, any occurrences of recurring events are included in the resulting array (not applicable in Gantt). If
     * that is not required, pass the `includeOccurrences` option as `false`.
     *
     * {@note}Note that if `includeOccurrences` is `true`, the start date and end date options are mandatory.
     * The method must know what range of occurrences needs to be generated and returned.{/@note}
     *
     * Example:
     *
     * ```javascript
     *  visibleEvents = eventStore.getEvents({
     *      resourceRecord : myResource,
     *      startDate      : scheduler.timeAxis.startDate,
     *      endDate        : scheduler.timeAxis.endDate
     *  });
     * ```
     *
     * @param {Object} options An options object determining which events to return
     * @param {Date} [options.date] If only one date is required, pass this option instead of the
     * `startDate` and `endDate` options.
     * @param {Date} options.startDate The start date for the range of events to include.
     * @param {Date} [options.endDate] The end date for the range of events to include. Defaults to a startDate + one day
     * range if only startDate passed
     * @param {Scheduler.model.ResourceModel} [options.resourceRecord] Pass a resource to only return events assigned to
     *   this resource. Not supported when using the `dateMap` option (see below)
     * @param {Function} [options.filter] A function to filter out events which are not required.
     * @param {Boolean} [options.ignoreFilters] By default, store filters are honoured. Pass this
     * as `true` to include filtered out events.
     * @param {Boolean} [options.includeOccurrences=true] Occurrences of recurring events are included by default.
     * @param {Boolean} [options.allowPartial=true] Events which start before or after the range, but *intersect* the
     *   range are included by default.
     * @param {Boolean} [options.startOnly] Pass `true` to only include events which *start on* each date in the range.
     * @param {Boolean} [options.silent] Pass `true` to not fire the {@link Scheduler.data.EventStore#event-loadDateRange} event.
     * @param {Boolean} [options.onlyAssigned] Pass `true` to only include events that are assigned to a resource
     * @param {Boolean|Map} [options.dateMap] Populates the passed `Map`, or if passed as `true`, creates and
     * returns a new `Map`. The keys are `YYYY-MM-DD` date strings and the entries are arrays of
     * {@link Scheduler.model.EventModel}s.
     * @returns {Scheduler.model.EventModel[]|Map} Events which match the passed configuration.
     * @category Events
     */
    getEvents(props) {
        const
            { resourceRecord } = props,
            {
                assignmentStore,
                eventStore
            }                  = this,
            // When using an AssignmentStore we will get all events for the resource even if the EventStore is
            // filtered
            eventFilter        = (resourceRecord && eventStore.isFiltered || assignmentStore.isFiltered) && (eventRecord =>
                eventRecord.assignments.some(a => a.resource === resourceRecord.$original && assignmentStore.includes(a)));

        return this.eventStore.getEvents({
            ...props,
            filter : FunctionHelper.combineFilterFns(props.filter, eventFilter)
        });
    }

    /**
     * Returns the events rendered on the row of the passed `resourceRecord`, by default the events of its resource
     * (see {@link #function-getEvents}). Features rendering events of other resources on a row override it
     * (GroupRollups).
     * @param {Object} options Same options as for {@link #function-getEvents}, `resourceRecord` being the row
     * @returns {Scheduler.model.EventModel[]}
     * @internal
     */
    getRowEvents(options) {
        return this.getEvents(options);
    }

    /**
     * Gets the count of events within a date range between current `startDate` and `endDate`.
     * @member {Number}
     * @readonly
     */
    get eventCount() {
        return (this.getEvents({
            startDate : this.startDate,
            endDate   : this.endDate
        })).length;
    }
}

// Register this widget type with its Factory
SchedulerBase.initClass();

// Scheduler version is specified in TimelineBase because Gantt extends it
