import CalendarMixin from './mixin/CalendarMixin.js';
import DayCellCollecter from './mixin/DayCellCollecter.js';
import DayTime from '../../Core/util/DayTime.js';
import Panel from '../../Core/widget/Panel.js';
import ArrayHelper from '../../Core/helper/ArrayHelper.js';
import BrowserHelper from '../../Core/helper/BrowserHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import Scroller from '../../Core/helper/util/Scroller.js';
import ResizeMonitor from '../../Core/helper/ResizeMonitor.js';
import CalendarRow from './CalendarRow.js';
import DayLayout from '../layout/day/DayLayout.js';
import DaySelectable from './mixin/DaySelectable.js';
import '../layout/day/FluidDayLayout.js';
import GlobalEvents from '../../Core/GlobalEvents.js';
import DateRangeOwner from './mixin/DateRangeOwner.js';
import Widget from '../../Core/widget/Widget.js';
import ElementVisitor from '../../Core/util/ElementVisitor.js';
import DomClassList from '../../Core/helper/util/DomClassList.js';
import FunctionHelper from '../../Core/helper/FunctionHelper.js';

DomHelper.loadStylesheet('Calendar/widget/DayView.css');

// import Stylesheet from './DayView.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'DayView');

/**
 * @module Calendar/widget/DayView
 */

const
    { MILLIS_PER_HOUR } = DayTime,
    // We need the full longest date because intervening ticks may now be shown.
    widestDate          = new Date(2020, 11, 22, 22, 59, 59),
    blockedAllDayEvents = {
        paint               : 1,
        refresh             : 1,
        resize              : 1,
        eventspercellchange : 1,
        rangechange         : 1,
        beforedatechange    : 1,
        localized           : 1
    },
    stopEvent = e => {
        e.stopImmediatePropagation();
    },
    preventDefault = e => e.ctrlKey && e.preventDefault(),
    hourHeightLevelZero = {
        level : 0,
        step  : '1 hour'
    },
    zeroRect = new Rectangle(0, 0, 0, 0),
    fiveMinuteSteps = [
        '30 minutes',
        '15 minutes',
        '10 minutes',
        '5 minutes'
    ],
    sixMinuteSteps = [
        '30 minutes',
        '12 minutes',
        '6 minutes'
    ],
    extractEventRecord = e => e.eventRecord || e,
    emptyArray = Object.freeze([]),
    wrapText = e => typeof e === 'string' ? { text : e } : e,
    hasProcessEventContent = cmp => cmp?.processEventContent,
    // Date chosen to avoid any DST changeover dates
    DEFAULT_EACH_HOUR_DATE = new Date(2000, 5, 15),
    mergeArrays = (a, b) => {
        if (!a?.length) return b || emptyArray;
        if (!b?.length) return a || emptyArray;
        return a.concat(b);
    },
    { eventNameMap }  = EventHelper,
    // Chrome does not insist that all encapsulating scrolling viewports are overflow:visible
    // for stickiness to work. Firefox and Safari do, so we do not have to force the dayContainerElement
    // (Managed by the horizontalScroller) to be overflow:visible in Chrome.
    permissiveSticky = BrowserHelper.isChrome;

/**
 * An object which describes the properties of action buttons injected into event blocks.
 *
 * @typedef {Object<String,String|Function>} ActionButtonsConfig
 * @property {String} cls A class name to add to the button element. It may be of the form
 * `b-icon-xxxx` which will use a font-awesome icon by that name.
 * @property {String} tooltip The tooltip to show when the button is hovered.
 * @property {String|Function} handler A function, or the name of a function in the ownership hierarchy
 * to call when the button is clicked. It is passed the payload of the click which activated it, so the
 * view which owns the button and the event whose bar it was rendered into are both available.
 * @ts-property handler {String|((context : { source : DayView, eventRecord : EventModel, domEvent : Event }) => void)}
 */

/**
 * The object form of {@link #config-visibleStartTime}. Accepts all
 * {@link Core.helper.util.Scroller#typedef-BryntumScrollOptions} plus a `time`
 * property specifying the target time to scroll to.
 * @typedef {BryntumScrollOptions} VisibleStartTimeOptions
 * @property {String|Number} time The time to which to scroll the view on first render as either an hour of
 * the day, or a *24 hour*&nbsp;`HH:MM` string.
 */

/**
 * A block of core working hours as used by the {@link #config-coreHours} config. The config accepts a single block, an
 * array of blocks which all apply to every day, or a *seven element* array which specifies one block per day of the
 * week.
 *
 * @typedef {Object} CoreHours
 * @property {Number|String|Date} start The start hour, or start time string `HH:MM`, of the core working hours.
 * @property {Number|String|Date} end The end hour, or end time string `HH:MM`, of the core working hours.
 * @property {Boolean} [overlayDay] Set to `true` to have the greyed zone cover the day part of the view.
 */

/**
 * An array of {@link #typedef-CoreHours} blocks which all apply to every day, as accepted by the
 * {@link #config-coreHours} config.
 *
 * Because the blocks describe one day, the `overlayDay` setting belongs to the array itself rather than to any single
 * block.
 *
 * @typedef {CoreHours[]} CoreHoursRanges
 * @property {Boolean} [overlayDay] Set to `true` to have the greyed zone cover the day part of the view.
 */

/**
 * This is normally used as a {@link Calendar.view.Calendar#config-modes mode} of a Calendar (as seen in the live
 * demo below), but may be used standalone as a regular Widget.
 *
 * A Panel which displays one or more columns of days with events for each day arranged in ascending
 * time order in each column.
 *
 * This view is *not* limited to showing a single day. The {@link #config-date} and {@link #config-range}
 * or {@link #config-startDate} and {@link #config-endDate} may be configured to cover any range.
 *
 * By default, a narrow band of whitespace is left on the `inline-end` side of day columns to allow the
 * user to click or drag to create events. This gutter may be configured using the {@link #config-eventLayout}'s
 * `gutterWidth` property as shown in the examples below.
 *
 * {@inlineexample Calendar/widget/CalendarDayView.js}
 *
 * As a standalone widget, it will lack the capabilities of the {@link Calendar.view.Calendar}
 * class, such as keyboard-based event to event navigation and drag/drop features. As seen in this demo:
 *
 * {@inlineexample Calendar/widget/DayView.js}
 *
 * When using {@link #config-range}, setting the {@link #config-date} snaps the view to the start of a range
 * (for example `'1 week'`) which encapsulates the requested date.
 *
 * When the {@link #config-startDate} is changed dynamically, the duration remains the same.
 *
 * This view can be configured to scroll to the specific time on first render, which defaults to 7 AM. This behavior
 * is controlled by the {@link #config-visibleStartTime} config.
 *
 * A {@link Calendar.widget.WeekView} is a subclass of this view which is tied to showing
 * weeks as defined by the {@link Calendar.widget.mixin.CalendarMixin#config-weekStartDay}.
 *
 * By default, the view scrolls vertically to 7am on first render. This can be configured using the
 * {@link #config-visibleStartTime} config.
 *
 * ## Keyboard shortcuts when focused inside a DayView (or WeekView)
 * - <kbd>←</kbd> - Move to the previous day.
 * - <kbd>→</kbd> - Move to the next day.
 * - <kbd>+</kbd> - Zoom in (Increase {@link #property-hourHeight} by 2).
 * - <kbd>-</kbd> - Zoom out (Decrease {@link #property-hourHeight} by 2).
 *
 * ## Multi day events.
 *
 * All day events, and multi day events are displayed in a {@link #config-allDayEvents row at the top}. To
 * prevent multi day events from showing in this row, set {@link #config-showAllDayHeader} to `false`. This will cause
 * them to wrap across multiple day columns instead.
 *
 * Intraday events are arranged in ascending time order down day columns from the {@link #config-dayStartTime} to
 * the {@link #config-dayEndTime}.
 *
 * The {@link #config-showAllDayHeader} config option can be used to *not* show multi day events at
 * the top, but have them wrap across multiple day columns.
 *
 * The following configs which apply to the all day row are passed into the configuration of the
 * {@link #config-allDayEvents} widget:
 * - {@link Calendar.widget.CalendarRow#config-overflowPopup}
 * - {@link Calendar.widget.CalendarRow#config-overflowButtonRenderer}
 * - {@link Calendar.widget.CalendarRow#config-overflowClickAction}
 * - {@link Calendar.widget.CalendarRow#config-dayHeaderRenderer}
 *
 * Event rendering can be customized using the {@link #config-eventRenderer} method.
 *
 * ## Useful configs
 *
 * | Config                           | Description                            |
 * |----------------------------------|----------------------------------------|
 * | {@link #config-dayStartTime}     | Start hour of the visible time range   |
 * | {@link #config-dayEndTime}       | End hour of the visible time range     |
 * | {@link #config-hourHeight}       | Pixel height of one hour cell          |
 * | {@link #config-allDayEvents}     | Config for the all-day events row      |
 * | {@link #config-eventLayout}      | Layout strategy for overlapping events |
 * | {@link #config-visibleStartTime} | Initially visible scroll position      |
 *
 * ## See also
 *
 * - {@link Calendar.view.Calendar} — The main Calendar that hosts this view
 * - {@link Calendar.widget.WeekView} — Subclass of DayView that shows a full week
 * - {@link Calendar.widget.CalendarRow} — The all-day events row at the top of this view
 * - {@link Calendar.feature.CalendarDrag} — Feature for drag-creating, moving, and resizing events
 *
 * @extends Core/widget/Panel
 * @mixes Core/widget/mixin/Responsive
 * @mixes Calendar/widget/mixin/CalendarMixin
 * @mixes Calendar/widget/mixin/DayCellCollecter
 * @mixes Calendar/widget/mixin/DateRangeOwner
 *
 * @classtype dayview
 * @tier community
 * @classtypealias day
 * @calendarview
 * @ts-widget
 */
export default class DayView extends Panel.mixin(
    CalendarMixin, DayCellCollecter, DaySelectable, DateRangeOwner) {

    // <debug>
    // region Localization test
    static localization = [
        'L{timeFormat}',
        'L{timeAxisTimeFormat}',
        'L{dayUnit}',
        'L{daysUnit}'
    ];
    // endregion
    // </debug>

    static $name = 'DayView';

    static type = 'dayview';

    static get delayable() {
        return {
            updateElementLayout : {
                type              : 'raf',
                cancelOutstanding : true
            },
            refreshDayBackground : {
                type              : 'raf',
                cancelOutstanding : true
            },
            adjustCoreHours : {
                type              : 'raf',
                cancelOutstanding : true
            }
        };
    }

    /**
      * A function, or name of a function which is passed the {@link DomConfig} object which
      * will be used to sync with a day cell header **in the all day row**.
      *
      * ```javascript
      * dayHeaderRenderer : function(cellData, headerDomConfig) {
      *     if (this.isSpecialDate(cellData.date)) {
      *         headerDomConfig.className['b-is-special-date'] = 1;
      *
      *         // Add to the content element's children
      *         headerDomConfig.children.push({
      *             text : 'Special day',
      *             className : 'b-special-day
      *         });
      *     }
      * }
      * ```
      *
      * The result is used to sync the DOM of the day column **in the all day row**.
      *
      * @config {Function|String} dayHeaderRenderer
      * @param {DayCell} cellData A `DayCell` object that contains data about the cell.
      * @param {DomConfig|Object} headerDomConfig A {@link DomConfig} config object which is used to sync the day header element.
      * @param {Object} headerDomConfig.className An object who's truthy property names will be applied as class names.
      * @param {Object} headerDomConfig.style A CSS style definition object.
      * @param {Object} headerDomConfig.dataset The DOM data properties to set.
      * @param {DomConfig[]} headerDomConfig.children The {@link DomConfig} definitions the header content.
      *   There will be 2 `children` encapsulating the day name and the date.
      * @returns {String}
      */

    static configurable = {
        // region Hidden configs
        /**
         * @hideconfigs eventHeight, showBullet
         */
        // endRegion

        role : 'grid',

        // have to add `timeFormat` property to `localizableProperties` even if the iterator in `Localizable` mixin
        // will be iterating over configs with `localeKey` in addition to `localizableProperties`
        // without it the property value is localized, but rendering seems to use the old value.
        // Root cause not yet established
        localizableProperties : ['timeFormat', 'timeAxisTimeFormat', 'noMatchingDates'],

        layout : 'vbox',

        textContent : false,

        scrollable : {
            overflowY     : true,
            propagateSync : true
        },

        title : 'L{Day}',

        eventHeight : 'auto',

        /**
         * The height __in pixels__ of one hour cell in a day column.
         *
         * Hour cells are bounded by lines, and there are fainter subtick lines between hour lines. These subtick change
         * as zooming passes the {@link #config-hourHeightBreakpoints}.
         *
         * {note}This is overridden by the {@link #config-fitHours} value if that is specified.{/@note}
         * @prp {Number}
         * @default
         */
        hourHeight : 42,

        /**
         * The minimum height __in pixels__ to allow a zoom request to zoom out to.
         * @prp {Number}
         * @default
         */
        minHourHeight : 15,

        range : {
            magnitude : 1,
            unit      : 'day'
        },

        /**
         * By default, reconfiguring the {@link #config-startDate} maintains the current duration
         * of the view and moves the {@link #config-endDate}.
         *
         * But for flexibility, reconfiguring the {@link #config-endDate} changes the duration.
         *
         * Setting `fixedDuration` to `true` locks this down to changing either end just moves
         * the view.
         *
         * This flag also signals that when using {@link Core.widget.DatePicker#config-multiSelect} in
         * the {@link Calendar.view.Calendar#config-datePicker date picker}, the selected range
         * does *not* get applied to this view.
         * @prp {Boolean}
         */
        fixedDuration : null,

        /**
         * Either the start hour of the day, or a *24 hour*&nbsp;`HH:MM` string denoting the initially visible start
         * time of the day. Defaults to 7am.
         *
         * Configure this as `null` to not have the view scroll to an initial position.
         *
         * This may also be configured as an object to control how the view scrolls to the target time, with
         * the target time specified as the `time` option. For example:
         * ```javascript
         * {
         *     visibleStartTime : {
         *         time       : '7:30',
         *         block      : 'start',
         *         edgeOffset : 10,
         *         animate    : true
         *     }
         * }
         * ```
         *
         * The default is to scroll the time to `block : 'start'` with no animation.
         * @default 7
         * @config {String|Number|VisibleStartTimeOptions|null} [visibleStartTime=7]
         * @property {String|Number} time The time to which to scroll the view on first render as either an hour of the day,
         * or a *24 hour*&nbsp;`HH:MM` string.
         * @property {'start'|'end'|'center'|'nearest'} [block='start'] How far to scroll the target time.
         * @property {Number} [edgeOffset] A margin around the target to bring into view.
         * @property {Object|Boolean|Number} [animate] Set to `true` to animate the scroll by 300ms,
         * or the number of milliseconds to animate over, or an animation config object.
         * @property {Number} [animate.duration] The number of milliseconds to animate over.
         * @property {String} [animate.easing] The name of an easing function.
         */
        visibleStartTime : {
            $config : 'lazy',
            value   : 7
        },

        /**
         * Either the start hour of the day, or a *24 hour*&nbsp;`HH:MM` string denoting the start time for days. This
         * is midnight by default.
         *
         * Setting this value to 12, for example, indicates that the 24 hour "day" runs from noon on one day, to
         * noon on the following day. This causes events in this span of time to layout in the same day column. In
         * this example, a two hour event that spanned midnight would be rendered in the same way a normal, 2 hour
         * event spanning noon would be rendered without this option.
         *
         * When this config is non-zero, the headings that display the day name and number are adjusted to indicate
         * the range of days for the column. For example, the "Wed" column for the 12th of the month will now show
         * "Wed-Thu" for the day name and "12-13" for the day number.
         *
         * @config {String|Number}
         * @default 0
         */
        dayStartShift : null,

        /**
         * When *read*, this is the start time of the day, expressed in ms (7am would be represented as 7 * 60 * 60 * 1000).
         *
         * You can set this value to either an hour value (0-23), a *24 hour*&nbsp;`HH:MM` string denoting the start of
         * the first rendered daily time block or to a ms timestamp representing time from midnight.
         *
         * Note that this is only granular to the hour level. The value will be rounded __down__
         * to the starting hour of the specified time.
         * @member {Number} dayStartTime
         * @accepts {String|Number}
         */
        /**
         * Either the start hour of the day, or a *24 hour*&nbsp;`HH:MM` string denoting the start of the first rendered
         * daily time block. You can also set this value to a ms timestamp representing time from midnight.
         *
         * This config, along with {@link #config-dayEndTime} determines which hours are displayed in a day column.
         *
         * Note that this is only granular to the hour level. The value will be rounded __down__
         * to the starting hour of the configured time.
         * @config {String|Number}
         * @default 0
         */
        dayStartTime : null,

        /**
         * When *read*, this is the end time of the day, expressed in ms (6pm would be represented as 18 * 60 * 60 * 1000).
         *
         * You can set this value to either an hour value (1-24), a *24 hour*&nbsp;`HH:MM` string denoting the end of
         * the last rendered daily time block or to a ms timestamp representing time from midnight.
         *
         * Note that this is only granular to the hour level. The value will be rounded __up__
         * to the ending hour of the specified time.
         * @member {Number} dayEndTime
         * @accepts {String|Number}
         */
        /**
         * Either the end hour of the day, or a *24 hour*&nbsp;`HH:MM` string denoting the end date of the last rendered time block.
         * You can also set this value to a ms timestamp representing time from midnight.
         *
         * This config, along with {@link #config-dayStartTime} determines which hours are displayed in a day column.
         *
         * Note that this is only granular to the hour level. The value will be rounded __up__
         * to the ending hour of the configured time.
         * @config {String|Number}
         * @default 24
         */
        dayEndTime : null,

        /**
         * Extends the inherited {@link Calendar.widget.mixin.CalendarMixin#config-workingTime}
         * config to also accept `fromHour` and `toHour` properties which control the
         * visible hour range in the day column.
         *
         * `fromHour` and `toHour` are inclusive block indices (0-23). They translate to
         * {@link #config-dayStartTime} and {@link #config-dayEndTime} respectively, where
         * `dayEndTime` is set to `toHour + 1` because `dayEndTime` uses an exclusive
         * hour boundary.
         *
         * For example, `{ fromHour : 8, toHour : 16 }` displays hours 8:00 through 17:00
         * (blocks 8 through 16 inclusive).
         *
         * Explicit {@link #config-dayStartTime} or {@link #config-dayEndTime} configs
         * take precedence over the corresponding `workingTime` hour properties.
         *
         * See the base class documentation for `fromDay`/`toDay` behaviour.
         * @config {Object}
         * @property {Number} [workingTime.fromDay] Day index 0-6 (0 is Sunday)
         * @property {Number} [workingTime.toDay] Day index 0-6 (0 is Sunday)
         * @property {Number} [workingTime.fromHour] 0-23
         * @property {Number} [workingTime.toHour] 0-23
         */
        workingTime : null,

        dayTime : 0,   // ensure the change/update cycle runs using dayStart/EndTime and dayStartShift

        /**
         * A millisecond value to which to snap pointer times when clicking or dragging within a day column
         * and when calculating the hovered time for the {@link Calendar.feature.ScheduleTooltip} tooltip.
         *
         * May be specified in string form eg: `'15 minutes'`
         *
         * By default, the pointer position is __rounded__ to the nearest `increment`, but this can be
         * configured using the {@link #config-timeSnapType} option.
         * @prp {Number}
         * @accepts {String|Number}
         * @default
         */
        increment : '15 min',

        /**
         * The type of rounding to apply when calculating a date from a pointer position in a day
         * column.
         *
         * This defaults to `'round`', but may also be `'floor'` or `'ceil'`. A pointer position will
         * be snapped to the appropriate {@link #config-increment}.
         *
         * Configure this as `null` to disable snapping so that drag and drop operations and
         * tooltips show exact times.
         * @prp {'round'|'ceil'|'floor'|null}
         * @default
         */
        timeSnapType : 'round',

        intradayCls : null,

        /**
         * Configure as `false` to hide the start time normally shown at the top of the events.
         *
         * Configuring as `true` (The default) means only show the start time.
         *
         * Both start and end time may be selected separately:
         *
         * ```javascript
         * {
         *     startTime : true,
         *     endTime   : true
         * }
         * ```
         *
         * Or start time and duration resulting in the duration being shown in the form `(HH:mm)` after the start time:
         * ```javascript
         * {
         *    startTime : true,
         *    duration  : true
         * }
         * ```
         *
         * The `duration` option may also be a function or the name of a function in the ownership hierarchy
         * which is passed the event's duration in milliseconds, and must return a string to display.
         *
         * @prp {Boolean|Object<'startTime'|'endTime'|'duration',Boolean|String|Function>}
         * @default
         */
        showTime   : true,
        showBullet : false,

        iconTarget : 'header',

        /**
         * Configuration to manage event layout class.
         * See {@link Calendar.layout.day.FluidDayLayout} class docs to see all possible configurations.
         *
         * Defaults to `{ type : 'fluid' }`.
         *
         * @config {FluidDayLayoutConfig}
         */
        eventLayout : {
            type : 'fluid'
        },

        /**
         * The minimum width of a day column.
         *
         * If this is set, and the day columns overflow the horizontal space available, the columns
         * will be scrollable horizontally in the normal way.
         *
         * There is a {@link #property-horizontalScroller} property which handles scrolling in this
         * dimension.
         * @prp {Number|String}
         */
        minDayWidth : null,

        // In days, event colour means background color
        eventColourStyleProperty : 'backgroundColor',

        monitorResize : Boolean(DomHelper.scrollBarWidth), // Need to adjust the width of the header

        eventFilter : null,

        /**
         * Affects drag drop and moving of events with regard to the {@link #property-increment}
         *
         * If set to `true`, startDate will be snapped relative to event's original start. e.g. if the
         * {@link #property-increment} is `15 minutes`, an event that starts at 10:03 and is dragged forwards
         * would snap its start date to 10:18, 10:33 etc.
         *
         * When set to `false` (the default), startDate will be snapped relative to the day start, eg
         * - 10:03 -> 10:15, 10:20 etc.
         *
         * @prp {Boolean}
         * @default
         */
        snapRelativeToEventStartDate : false,

        timeFormat : {
            value   : 'LST',
            $config : {
                localeKey : 'L{timeFormat}'
            }
        },

        /**
         * A {@link Core.helper.DateHelper} format string/function used to format the time displayed in the
         * time axis at the left side of the view.
         *
         * @config {String|Function}
         * @param {Date} date The date to format.
         * @returns {String} The formatted date.
         * @default 'LST'
         */
        timeAxisTimeFormat : {
            value   : 'LST',
            $config : {
                localeKey : 'L{timeFormat}'
            }
        },

        /**
         * If {@link #config-showAllDayHeader} is not set to `false`, then this will be an instance
         * of {@link Calendar.widget.CalendarRow} which encapsulates the all day events at the top
         * of this view.
         * @member {Calendar.widget.CalendarRow} allDayEvents
         * @readonly
         */
        /**
         * A {@link Calendar.widget.CalendarRow} widget containing the horizontal series of calendar cells with the
         * day headers and any all-day, or day-spanning events which fall inside this view's time range.
         *
         * Note that this component calculates its height depending on its
         * {@link Calendar.widget.CalendarRow#config-eventHeight},
         * {@link Calendar.widget.CalendarRow#config-defaultEventRowCount} and
         * {@link Calendar.widget.CalendarRow#config-autoHeight} settings, therefore any configured `height`
         * and `flex` values will be ignored.
         *
         * ```javascript
         *     modes : {
         *         day : {
         *             // Do not show the whole week in the header for the one day view
         *             allDayEvents : {
         *                 fullWeek : false
         *             }
         *         }
         *     }
         * ```
         * @config {Calendar.widget.CalendarRow|CalendarRowConfig|null}
         */
        allDayEvents : {
            $config : ['lazy', 'nullify'],

            value : {
                type : 'calendarrow'
            }
        },

        /**
         * A config object used to create the {@link Calendar.widget.OverflowPopup} that the
         * {@link #property-allDayEvents} may show when events for one day overflow the available space.
         *
         * For example
         *
         * ```javascript
         *     modes : {
         *         week : {
         *             overflowPopup : {
         *                 closable   : false,
         *                 dateFormat : 'dddd, MMM M',
         *                 eventRenderer({ eventRecord, renderData }) {
         *                     if (calendarUtils.isImportantEvent(eventRecord)) {
         *                         // Add CSS class to important events
         *                         renderData.cls['b-important'] = 1;
         *                     }
         *                 }
         *             }
         *         }
         *     }
         * ```
         * @config {OverflowPopupConfig}
         */
        overflowPopup : null,

        /**
         * Shows an all day header above the main schedule for All Day events.
         * Set to `false` to not show all day, or multi-day events in an all day header, but
         * to have them showing wrapping through the day cells.
         * @config {Boolean}
         * @default true
         */
        showAllDayHeader : {
            value   : null,
            $config : null,
            default : true
        },

        /**
         * The amount of vertical spacing applied to events. May be a single number giving the
         * bottom spacing in pixels, or an object specifying both top and bottom spacings:
         *
         * ```javascript
         * eventSpacing : {
         *     top    : 2,
         *     bottom : 2
         * }
         * ```
         *
         * A single numeric value is normalized to `{ top : 0, bottom : <value> }`.
         *
         * @config {Number|Object}
         * @property {Number} [top=0] The top spacing in pixels.
         * @property {Number} [bottom=1] The bottom spacing in pixels.
         * @default
         */
        eventSpacing : 1,

        responsive : {
            // Abbreviate month name when small
            small : {
                descriptionFormat : 'MMM DD, YYYY'
            },

            '*' : {
                descriptionFormat : null
            }
        },

        /**
         * The maximum height the all day event row is allowed to grow within this view
         * when it is expanded to show all its "all day" events.
         *
         * This defaults to `50%`, but can also be set to any CSS size value. A numeric
         * value will be taken as pixels.
         * @config {Number|String}
         * @default 50%
         */
        maxAllDayHeight : null,

        /**
         * When set to `true`, the hours in the day will be sized so that they fit in the available
         * height.
         *
         * In the Object form, the value may contain `minHeight` as the minimum hour height to which
         * the hour cells may shrink:
         *
         * ```javascript
         * fitHours : {
         *     minHeight : 31
         * }
         * ```
         *
         * {@note}This setting takes precedence over any {@link #config-hourHeight} setting.{/@note}
         *
         * Note that if the all day events row at the top changes size, the space available for the
         * hours will change too, and the hour cell height will change.
         * @prp {Boolean|Object}
         * @property {Number} [minHeight=31] The minimum height in pixels to which the hour cells may shrink.
         * @default false
         */
        fitHours : null,

        /**
         * A function, or name of a function which is passed the {@link DomConfig} object which
         * will be used to sync with a day column.
         *
         * ```javascript
         * dayCellRenderer : function(cellData, domConfig) {
         *     if (this.isSpecialDate(cellData.date)) {
         *         domConfig.className['fa'] =
         *         domConfig.className['fa-birthday-cake'] = 1;
         *     }
         *     return domConfig;
         * }
         * ```
         *
         * The result is used to sync the DOM of the day column.
         *
         * {@note}When working with text content from user data or events, ensure any HTML is encoded using
         * {@link Core.helper.StringHelper#function-encodeHtml-static StringHelper.encodeHtml()} to prevent
         * XSS vulnerabilities.{/@note}
         *
         * @config {Function|String} dayCellRenderer
         * @param {DayCell} cellData A `DayCell` object that contains data about the cell.
         * @param {DomConfig|Object} domConfig A {@link DomConfig} config object which is used to sync the day column element.
         * @param {Object} domConfig.className An object who's truthy property names will be applied as class names.
         * @param {Object} domConfig.style A CSS style definition object.
         * @param {Object} domConfig.dataset The DOM data properties to set.
         * @param {DomConfig[]} domConfig.children The {@link DomConfig} definitions for the events in the day.
         * @returns {String}
         */
        dayCellRenderer : null,

        /**
         * A function, or name of a function which yields a {@link DomConfig} object to use as a tick background element
         * for the tick context passed.
         *
         * ```javascript
         * tickRenderer({ startTime, tickIndex, subtickIndex, resourceRecord }) {
         *     // Skip subticks in the 13:00 hour
         *     if (!(startTime.getHours() === 13 && startTime.getMinutes())) {
         *         const result = {
         *             className : {
         *                 'afternoon-shift' : startTime.getHours() >= 12
         *             },
         *             text : DateHelper.format(startTime, 'hh:mm a');
         *         };
         *         // And make the 13:00 cell span the whole hour
         *         if (startTime.getHours() === 13 && !startTime.getMinutes()) {
         *             result.rowspan = subTickCount;
         *         }
         *         return result;
         *     }
         * }
         * ```
         *
         * With some application styling:
         *
         * ```CSS
         * .b-day-view-subtick {
         *     padding   : 0.5em;
         *     font-size : 0.7em;
         *     color     : #999;
         * }
         *
         * .b-day-view-subtick:hover {
         *    background-color : rgba(0, 0, 0, 0.1);
         *    cursor           : pointer;
         * }
         * ```
         *
         * This is called for every *visible* subtick. So if the view is not tall, and only hour cells are visible,
         * this will be called for every hour.
         *
         * If half hour ticks are visible too, this will be called for every half hour, if fifteen minutes ticks are
         * visible this will be called for every fifteen minutes etc.
         *
         * By default, these ticks are sized and positioned to exactly fit the subtick cell. You may use inline `style` in the
         * {@link DomConfig} return value, or a `className` property in the {@link DomConfig} return value to style the ticks.
         *
         * Returning `null` will cause no tick to be rendered for that time.
         *
         * The rendered element will have the class `b-day-view-subtick` added to it.
         *
         * If the rendered element is the last subtick in an hour, the class `b-last-in-hour` will be added.
         *
         * The rendered element's `dataset` will have the following properties:
         * - `hour` - The date of the tick.
         * - `minute` - The minute of the tick.
         * - `index` - The index of the subtick *within the hour*.
         *
         * @config {Function|String} tickRenderer
         * @param {Object} tickContext An object containing the context for the tick being rendered.
         * @param {Date} tickContext.startTime The start time of the tick.
         * @param {Date} tickContext.endTime The end time of the tick.
         * @param {Scheduler.model.EventModel[]} tickContext.events The events that visually intersect with the tick.
         * @param {Number} tickContext.tickIndex The zero-based overall tick index.
         * @param {Number} tickContext.subtickIndex The zero-based subtick index *within* the hour.
         * @param {Number} tickContext.subtickCount The total number of visible subticks in an hour.
         * @param {Scheduler.model.ResourceModel} tickContext.resourceRecord *If* this view is a resource view, the resource record.
         * @returns {DomConfig} The DOM config object to use for the tick.
         */
        tickRenderer : null,

        /**
         * An object containing two properties, `start` and `end` representing the start and
         * end of core working hours.
         *
         * This causes the non core hours to be covered by a themeable translucent grey mask
         * in the time axis.
         *
         * This may be configured to also mask the non core hours in the day part of the view
         * by setting the `overlayDay` property.
         *
         * ```javascript
         * {
         *     coreHours : {
         *         start      : 9,
         *         end        : 17,
         *         overlayDay : true
         *     }
         * }
         * ```
         *
         * If this is configured as an array of less than seven elements, it is taken to be
         * describing __multiple__ core hours blocks within one day, so it could be
         *
         * ```javascript
         * {
         *     coreHours : [{
         *         start      : 8,
         *         end        : 12,
         *     }, {
         *         start      : 14,
         *         end        : 18
         *     }
         * }
         * ```
         *
         * This may also be a __seven element__ array so as to have different core hours for
         * each JavaScript day of the week (Meaning `0` for Sunday to `6` for Saturday).
         * This causes only the hours in the day columns to be masked:
         *
         * ```javascript
         * {
         *     coreHours : [{
         *         start : 10,
         *         end   : 15
         *     },{
         *         start : 9,
         *         end   : 17
         *     },{
         *         start : 9,
         *         end   : 17
         *     },{
         *         start : 9,
         *         end   : 17
         *     },{
         *         start : 9,
         *         end   : 17
         *     },{
         *         start : 9,
         *         end   : 17
         *     },{
         *         start : 10,
         *         end   : 15
         *     }]
         * }
         * ```
         *
         * This may also be a function to return calculated core hours for every date.
         * This causes only the hours in the day columns to be masked:
         *
         * ```javascript
         * {
         *     coreHours : function(date) {
         *         // Shorter core hours at weekends
         *         if (date.getDay() === 0 || date.getDay() === 6) {
         *             return {
         *                 start : '10:00',
         *                 end   : '15:00'
         *             };
         *         }
         *         // Pre-lunch and post-lunch working blocks in the week
         *         return [{
         *             start : '08:00',
         *             end   : '12:00'
         *         }, {
         *             start : '14:00',
         *             end   : '18:00'
         *         };
         *     }
         * }
         * ```
         *
         * This may also be a __seven element__ array which contains separate core hours
         * specification for each day of the week as returned from the `Date` class.
         *
         * This may also be a function, which, when passed a `Date`, returns a core hours
         * specification for that date.
         *
         * In the simplest case an object containing two properties, `start` and `end`:
         *
         * - `coreHours.start` - The start hour or start time string `HH:MM` of the core working hours. `Date` or `String` value allowed.
         * - `coreHours.end` - The end hour or start time string `HH:MM` of the core working hours. `Date` or `String` value allowed
         * - `coreHours.overlayDay` - Set to `true` to have the greyed zone cover the day part of the view.
         *
         * __`overlayDay` is only valid when this config is specified as a simple Object, or as an array of blocks
             * which all apply to every day - in which case it is set on the array itself. It is not applicable to the
             * seven element, one block per weekday form.__
         *
         * @prp {CoreHours|CoreHoursRanges|Function|String} coreHours
         *
         * @param {Date} date Date for hours calculation
         * @returns {CoreHours|CoreHoursRanges}
         */
        coreHours : null,

        /**
         * You can zoom in and out on the time axis using CTRL-key + mouse wheel
         * on mouse-based devices or pinch-zoom on touch devices.
         * See also the {@link #config-hourHeightBreakpoints} config option.
         *
         * You cannot zoom so far out that the day height falls below the available height
         * unless {@link #config-allowZoomUnderflow} is set.
         *
         * The rate at which zoom proceeeds can be changed by configuring this value as a number
         * which will be used as a multiplier.
         *
         * __Note that zooming necessarily sets {@link #property-fitHours} to `false`.__
         *
         * Configure this as `false` to disable this behaviour.
         * @config {Boolean|Number}
         * @default
         */
        zoomOnMouseWheel : true,

        /**
         * By default, when mousewheel zooming out from *overflowing* the client height, it is not permitted to zoom
         * further out so that the hours *underflow* the client height.
         *
         * When zooming out, the view normally stops when the hours exactly fit the client height.
         *
         * Configure this as `true` to allow mousewheel zooming out to cause the hours to underflow the client height.
         * @prp {Boolean}
         * @default
         */
        allowZoomUnderflow : false,

        /**
         * An array which encapsulates a set of {@link #config-hourHeight} breakpoints which
         * dictate when subticks - intervening time indicators - are introduced into the DayView's
         * time axis.
         *
         * Entries are in ascending granularity order, so the values must ascend.
         *
         * Subtick visibility is updated dynamically during {@link #config-zoomOnMouseWheel zooming}.
         *
         * When an {@link #property-hourHeight} change causes a change of sub tick granularity, a
         * {@link #event-tickChange} event is fired.
         *
         * @prp {Number[]}
         * @default
         */
        hourHeightBreakpoints : [70, 140, 300, 500],

        /**
         * By default, the most granular time tick level in the DayView's time axis is five minutes.
         *
         * Set this property to `true` to have the hour split into six minute ticks.
         * @prp {Boolean}
         * @default false
         */
        sixMinuteTicks : null,

        /**
         * The minimum height to which event blocks in a day cell may shrink. If an event has very
         * short duration, whatever the {@link #config-hourHeight}, and regardless of
         * {@link #function-zoomTo timeline zooming}, the event block will never drop below this height.
         * @prp {Number|String}
         * @default
         */
        minEventHeight : '1em',

        /**
         * The pixel height threshold at which the event display switches to "compact" mode
         * with the name and start time both on the top line in a slightly smaller font.
         *
         * When {@link #config-shortEventDuration} is **not** explicitly configured, a `shortEventDuration`
         * value is auto-calculated from this height relative to {@link #config-hourHeight} each time `hourHeight`
         * changes. This means the "short event" threshold adapts as the user zooms in or out.
         *
         * **Note:** This config and `shortEventDuration` are mutually exclusive — an
         * application should use one or the other. If `shortEventDuration` is explicitly
         * set, it takes precedence and `shortEventHeight` has no effect on the duration
         * threshold (though the CSS variable is still applied for styling).
         * @prp {Number}
         * @default
         */
        shortEventHeight : 32,

        /**
         * A function, or name of a function which produces a {@link DomConfig} block to create the current time indicator
         * which is displayed in a day column which represents the current date. It is the developer's responsibility
         * to add CSS classes and the appropriate CSS rules to produce the desire appearance.
         *
         * ```javascript
         * currentTimeIndicatorRenderer : function() {
         *     return {
         *         className : 'my-current-time',
         *         text      : 'NOW'
         *     };
         * }
         * ```
         *
         * The result is used to sync the DOM of the day column.
         *
         * @config {Function|String} currentTimeIndicatorRenderer
         * @returns {DomConfig} An object which describes the DOM structure of the today indicator element.
         */
        currentTimeIndicatorRenderer : null,

        /**
         * An object or an array of button specifications which add clickable icon buttons to
         * the rendered event blocks which contain the following properties.
         *
         * For example, the calendar may be configured like this:
         *
         * ```javascript
         * modes : {
         *     day : {
         *         actionButtons : {
         *             delete : {
         *                 tooltip : 'Delete event',
         *                 cls     : 'b-icon-trash',
         *                 handler : 'up.onDeleteAction'
         *             }
         *         }
         *     }
         * },
         *
         * onDeleteAction({ eventRecord }) {
         *     this.removeEvents([eventRecord]);
         * }
         * ```
         * @prp {ActionButtonsConfig[]|Object<String,ActionButtonsConfig>}
         */
        actionButtons : null,

        /**
         * Configure this as `true` to hide day columns which contain no events.
         *
         * <div class="warning">
         * Use with care. This may result in no day columns being rendered
         * for completely empty time ranges.
         * </div>
         * @prp {Boolean}
         * @default false
         */
        hideEmptyDays : null,

        /**
         * A callback function, or the name of a function in the ownership hierarchy which an
         * application may provide to filter out day columns for individual dates.
         * @prp {Function|String} dateFilter
         * @param {DayCell} context Information about the day column to be created.
         * @returns {Boolean} Return `false` to not display a column for the passed date.
         */
        dateFilter : null,

        autoRefresh : [
            'hideEmptyDays',
            'dateFilter'
        ],

        /**
         * By default, half hour, fifteen minute tick lines are rendered in a lower contrast
         * colour than hour lines.
         *
         * Configure this as `true` to instead render the minor tick lines as dashed lines
         * at the same contrast level as the hour lines.
         * @prp {Boolean}
         * @default false
         */
        dashedSubticks : null,

        /**
         * @typedef {DayCell} DayCellWithEvents
         * @property {Scheduler.model.EventModel[]} intraDayEvents The events that occur within a single day (not spanning multiple days). These are the events that have specific start and end times within the same day.
         * @property {Scheduler.model.EventModel[]} allEvents A combined array containing both intraDayEvents and allDayEvents. This provides a complete list of all events for the given date.
         * @property {Scheduler.model.EventModel[]} allDayEvents The events that span the entire day (all-day events). These are events that are marked as all-day events or events that span multiple days.
         */

        /**
         * A function, or name of a function which is passed the {@link DayCellWithEvents} object which
         * describes the events and details of the day.
         *
         * This function must return either an HTML string, or a {@link DomConfig} object to
         * create a column header for the passed date.
         *
         * ```javascript
         * columnHeaderRenderer({ events }) {
         *     return `${events.length ? events.length : 'No'} Events`;
         * }
         * ```
         *
         * @config {Function|String}
         * @param {DayCellWithEvents} cellData A data block describing the date and the events for that date.
         * @returns {String|Object}
         */
        columnHeaderRenderer : null,

        /**
         * By default <b>today's</b> date shows a current time line to indicate the current time. This
         * line is confined to the day cell for <b>today</b>.
         *
         * Configure this property as `false` to disable this.
         *
         * This also may have more granular options when specified as an Object:
         * @prp {Boolean|Object}
         * @property {Boolean} [fullWidth=false] When `true`, the line begins at the time axis edge
         * and covers every day that this view spans.
         * @property {Boolean} [showTime=false] When `true`, a pill showing the highlighted current time is
         * displayed at the appropriate position in the time axis.
         * @property {Boolean} [onTop=true] Set to `false`, to show the current time line <b>below</b> events.
         */
        showCurrentTime : {
            $config : 'lazy',
            value   : {
                onTop : true
            }
        },

        /**
         * Text or HTML, or a {@link DomConfig} block to display when all dates in the range have been filtered out.
         * @prp {String|DomConfig}
         * @default
         * @category Common
         */
        noMatchingDates : 'L{noMatchingDates}',

        /**
         * By default, drag-resizing an event (including creating a new event) allows the drag gesture to span multiple day
         * columns to make the event an inter day event.
         *
         * To limit drag-resizing an event to only operating within the same day column, set this to `false`.
         *
         * Note that this setting is only valid for multi-day `DayView` instances. For other view types, *all* drag gestures
         * are inter day, so use {@link #property-allowDragResize} and {@link #property-allowDragCreate} for other views.
         * @prp {Boolean} [interDayResize=true]
         */
        interDayResize : null,

        /**
         * By default, drag-moving an event allows the drag gesture to move the event into other day columns.
         *
         * To limit drag-moving an event to only operating within the same day column, set this to `false`.
         *
         * Note that this setting is only valid for multi-day `DayView` instances. For other view types, *all* drag gestures
         * are inter day, so use {@link #property-allowDragMove} for other views.
         * @prp {Boolean} [interDayDrag=true]
         */
        interDayDrag : null,

        keyMap : {
            '+'       : 'zoomIn',
            'Shift++' : 'zoomIn',
            '-'       : 'zoomOut'
        },

        /**
         * The {@link Core.helper.DateHelper} format string/function for day names in the header row (e.g., "ddd" for "Mon", "Tue", ...)
         * @config {String|Function} [dayNameFormat='ddd']
         * @param {Date} date The date to format.
         * @returns {String} The formatted date.
         * @default 'ddd'
         */
        dayNameFormat : null,

        // For Scheduler feature compatibility
        transition : {},

        /**
         * Configure this property as `true` to show the day name and date headers in a more compact style.
         *
         * When this is set, the day name and date are displayed side by side instead of on separate lines
         * and with a smaller font size.
         *
         * This applies the `b-compact-header` CSS class to this widget which may be styled as required.
         * @prp {Boolean}
         * @default false
         */
        compactHeader : null,

        /**
         * A function which returns `true` if the passed event record should be considered an all day
         * event and therefore be displayed in the all day header, or `false` if it should be displayed
         * in the day column(s).
         *
         * By default, this function returns `true` if the event's start and end dates are on different days, or if the
         * event's `allDay` property is set to `true`.
         *
         * This function may be overridden to provide custom logic for determining whether an event
         * should be rendered in the all day header or in the day column(s).
         *
         * The {@link #function-defaultAllDayFilterFn} function is provided as a convenience to use
         * the default logic if desired.
         *
         * For example, to render all events with a type of "shift" in day columns while following
         * the default logic for all other events, you could configure the view with this:
         *
         * ```javascript
         * allDayFilterFn : function(eventRecord) {
         *     // Regardless of the event's start and end dates, if the type is "shift", render
         *     // it in the day columns.
         *     if (eventRecord.type === 'shift') {
         *         return false;
         *     }
         *     // For any other type of event, use the default logic to determine whether it is an all day event or not.
         *     return this.defaultAllDayFilterFn(eventRecord);
         * }
         * ```
         * @config {Function}
         * @param {Scheduler.model.EventModel} eventRecord
         * @returns {Boolean} `true` if the event should be displayed in the all day header,
         * `false` if it should be displayed in the day column(s).
         */
        allDayFilterFn : function(eventRecord) {
            return this.defaultAllDayFilterFn(eventRecord);
        }
    };

    /**
     * Returns the resource associated with this day view when used inside a {@link Calendar.widget.ResourceView}
     * @readonly
     * @member {Scheduler.model.ResourceModel} resource
     */

    construct(config) {
        const me = this;

        // If we are configured to not show vertical scrolling, we must know this so that
        // scrollbar equalization can adjust to this.
        me.configuredHiddenVerticalScroll = config.scrollable?.overflowY === 'hidden-scroll';

        // Needs scope
        me.cellMapEventFilter = me.cellMapEventFilter.bind(me);

        super.construct(...arguments);

        if (!me.startDate) {
            me.startDate = me.month.date;
        }

        GlobalEvents.ion({
            theme   : 'onDayViewThemeChange',
            thisObj : me
        });
    }

    doDestroy() {
        if (this._dayContainerResizeHandler) {
            ResizeMonitor.removeResizeListener(this.dayContainerElement, this._dayContainerResizeHandler);
        }
        this.destroyProperties('horizontalScroller', 'scrollbarScroller', 'dayHeaderScroller');
        super.doDestroy();
    }

    startConfigure(config) {
        // An unreconfigured DayView and WeekView mode will be fixed duration.
        // They will always be one day or one week.
        // If the user has configured a range, or an end date, then we are not fixed duration.
        if (!this.hasConfig('fixedDuration') && !this.isDayResourceView) {
            this.fixedDuration = !(this.initialConfig.range || this.initialConfig.endDate);
        }

        super.startConfigure(config);
    }

    updateProject(project, was) {
        if (!this.isConfiguring) {
            this.allDayEvents && (this.allDayEvents.project = project);
        }
        super.updateProject(project, was);
    }

    updateZoomOnMouseWheel(zoomOnMouseWheel) {
        if (zoomOnMouseWheel) {
            // Only respond every 50ms to keep zooming response sane to a user.
            this.zoomListener = EventHelper.on({
                element   : this.dayContentElement,
                wheel     : 'onDayContentMousewheel',
                thisObj   : this,
                throttled : {
                    buffer : 100,
                    alt    : preventDefault
                }
            });
        }
        else {
            this.zoomListener?.();
        }
    }

    get childItems() {
        const
            { allDayEvents } = this,
            result           = super.childItems;

        if (allDayEvents) {
            result.push(allDayEvents);
        }

        return result;
    }

    get dayEndTime() {
        return this.dayTime?.timeEnd ?? this._dayEndTime;
    }

    get dayStartTime() {
        return this.dayTime?.timeStart ?? this._dayStartTime;
    }

    get dayStartShift() {
        return this.dayTime?.startShift ?? this._dayStartShift;
    }

    changeDayEndTime(dayEndTime) {
        // Update the UI on AF if needed
        this.adjustCoreHours();

        // Due to how the time axis is rendered with twelve flexed ticks in each hour tick, the view
        // can only support day start and end times in whole hour granularity.
        // Any end time is rounded *up*.
        return Math.ceil((this.configuredDayEndTime = DayTime.parse(dayEndTime)) / MILLIS_PER_HOUR) * MILLIS_PER_HOUR;
    }

    updateDashedSubticks(dashedSubticks) {
        this.dayContainerElement.classList.toggle('b-dashed-subticks', Boolean(dashedSubticks));
    }

    updateDayEndTime(dayEndTime) {
        this.syncDayTime({
            timeEnd : dayEndTime
        });
    }

    changeDayStartTime(dayStartTime) {
        // Update the UI on AF if needed
        this.adjustCoreHours();

        // Due to how the time axis is rendered with twelve flexed ticks in each hour tick, the view
        // can only support day start and end times in whole hour granularity.
        // Any start time is rounded *down*.
        return Math.floor((this.configuredDayStartTime = DayTime.parse(dayStartTime)) / MILLIS_PER_HOUR) * MILLIS_PER_HOUR;
    }

    adjustCoreHours() {
        // If the app has not configured any coreHours, a start/end hour was rounded, then set the coreHours
        // to the configured day so that the out of range parts are grayed out.
        if (this.initialConfig.coreHours == null) {
            const { _dayStartTime, _dayEndTime, configuredDayStartTime, configuredDayEndTime } = this;

            if (_dayStartTime < configuredDayStartTime || _dayEndTime > configuredDayEndTime) {
                this.coreHours = {
                    start      : configuredDayStartTime || 0,
                    end        : configuredDayEndTime   || 24,
                    overlayDay : true
                };
            }
            else {
                this.coreHours = null;
            }
        }
    }

    updateDate(date, was) {
        const { allDayEvents } = this;

        if (allDayEvents) {
            allDayEvents.date = date;
        }

        super.updateDate(date, was);
    }

    updateDayStartTime(dayStartTime) {
        this.syncDayTime({
            timeStart : dayStartTime
        });
    }

    updateWorkingTime(workingTime) {
        // Let CalendarMixin handle fromDay/toDay → nonWorkingDays + hideNonWorkingDays
        super.updateWorkingTime(workingTime);

        // DayView also processes fromHour/toHour → dayStartTime/dayEndTime
        if (workingTime) {
            if (!('dayStartTime' in this.initialConfig)) {
                this.dayStartTime = workingTime.fromHour ?? 0;
            }
            if (!('dayEndTime' in this.initialConfig)) {
                this.dayEndTime = (workingTime.toHour ?? 24);
            }
        }
    }

    updateDayStartShift(dayStartShift) {
        this.syncDayTime({
            startShift : dayStartShift
        });
    }

    syncDayTime(data) {
        this._dayTime = null;

        // When more than one of these 3 configs changes at the same time, the following will trigger the yet to be
        // realized configs, which will in turn call their updaters until the last of the batch runs its updater. In
        // that updater call, the dayTime config will be set to the new DayTime instance that has all of the correct
        // config values. The changeDayTime() method will detect a not-equals() DayTime and return it, which will run
        // updateDayTime(). The updates for the non-final configs will also call changeDayTime() but their DayTime
        // instances will all have the same properties and will not result in a call of updateDayTime().
        //
        // We also clear _dayTime so that the getters won't use the old value in our getter calls.
        this.dayTime = new DayTime({
            startShift : ('startShift' in data) ? data.startShift : this.dayStartShift,
            timeStart  : ('timeStart'  in data) ? data.timeStart  : this.dayStartTime,
            timeEnd    : ('timeEnd'    in data) ? data.timeEnd    : this.dayEndTime,
            owner      : this
        });
    }

    // dayTime

    changeDayTime(dayTime) {
        if (!dayTime) {
            dayTime = new DayTime(this);
        }

        if (!this._dayTime?.equals(dayTime)) {
            return dayTime;
        }
    }

    updateDayTime(dayTime, was) {
        const
            me             = this,
            { eventStore } = me;

        if (eventStore) {
            eventStore.registerDayIndex(dayTime);
            was && eventStore.unregisterDayIndex(was);
        }

        if (!me.isConfiguring) {
            me.syncHours();
            if (dayTime.startShift !== was?.startShift) {
                const
                    { dh }    = me,
                    // Move our dates to reflect the new shift start time
                    startDate = dh.add(dh.clearTime(me.startDate), dayTime.startShift, 'ms'),
                    date      = dh.add(dh.clearTime(me.date), dayTime.startShift, 'ms');

                me.setConfig({
                    date,
                    startDate
                });
                me.allDayEvents?.setConfig({
                    date,
                    dayTime,
                    startDate
                });
            }
        }
    }

    dateKey(date) {
        return this.dayTime.dateKey(date);
    }

    dayOfDate(date) {
        return date && this.dayTime.dayOfDate(date);
    }

    /**
     * Scrolls vertically to bring an event or a time into view.
     * @param {Scheduler.model.EventModel|Date|Number} target The event to scroll to or
     * a `Date` to read the hour value from, or an hour number.
     * @param {Object} [options] How to scroll.
     * @param {'start'|'end'|'center'|'nearest'} [options.block='start'] How to align the target time within the
     * scrolling viewport. The `'start'` default applies to the vertical scroll only, and scrolls the target time to
     * the top of the viewport. If passed in a multi day view which overflows horizontally, this value additionally
     * aligns the target day column on the inline axis, where the default remains `'nearest'`.
     * @param {Number} [options.edgeOffset] A margin around the target to bring into view.
     * @param {Object|Boolean|Number} [options.animate] Set to `true` to animate the scroll by 300ms,
     * or the number of milliseconds to animate over, or an animation config object.
     * @param {Number} [options.animate.duration] The number of milliseconds to animate over.
     * @param {String} [options.animate.easing] The name of an easing function.
     * @param {Boolean} [options.highlight] Set to `true` to highlight the target when it is in view, _if the target is an `EventModel`_.
     * @param {Boolean} [options.focus] Set to `true` to focus the target when it is in view.
     * @param {Boolean} [options.x] Pass as `false` to disable scrolling in the `X` axis.
     * @param {Boolean} [options.y] Pass as `false` to disable scrolling in the `Y` axis.
     * @returns {Promise} A promise which is resolved when the target has been scrolled into view.
     */
    async scrollTo(target, options) {
        const
            me                   = this,
            { allDayEvents, dh } = me,
            scrollPromises       = [],
            hourPassed           = typeof target === 'number',
            targetDate           = hourPassed ? dh.add(me.startDate, target, 'hour') : typeof target === 'string' ? dh.parse(target) : new Date(target),
            targetIsDate         = !isNaN(targetDate);

        await me.scrollPromise;

        // If the all day event row is in transition, wait until it's done
        await allDayEvents?.heightAnimation;

        // Component might get destroyed by the time promises above get resolved
        if (me.isDestroyed) {
            return;
        }

        options = ObjectHelper.assign({}, me.defaultScrollOptions, typeof options == 'boolean' ? { animate : options } : options);

        // CalendarMixin knows how to do this.
        // If it's a Date It must not scroll vertically; we do that below unless disabled.
        // Clone the date so that if we adjust it to fit the visible range, we won't be adjusting the callee's reference.
        scrollPromises.push(super.scrollTo(targetIsDate ? new Date(targetDate) : target, { ...options,  y : !targetIsDate, highlight : false }));

        let scrollTarget;

        if (targetIsDate) {
            const { firstVisibleDate, lastVisibleDate } = me;

            // Bring the target date into our visible range.
            firstVisibleDate.setHours(me.dayStartHour);
            lastVisibleDate.setHours(me.dayEndHour);
            targetDate.setTime(dh.clamp(targetDate, firstVisibleDate, lastVisibleDate));

            // Dodge being asked to scroll to hidden days, eg filtered out dates, or hidden non working days
            let incr = -1;
            while (!me.getDayElement(targetDate)) {
                // If we walked off either end of the range, flip direction
                if (targetDate < firstVisibleDate || targetDate > lastVisibleDate) {
                    incr = -incr;

                    // Flipped direction a second time -  no visible day found
                    if (incr < 0) {
                        return;
                    }
                }
                dh.add(targetDate, incr, 'd', /* clone = */false);
            }

            // Scrolling to a Date is more granular in this view
            scrollTarget = me.getDayElement(targetDate);

            // Dates can be filtered out.
            if (scrollTarget) {
                target = dh.getHours(targetDate) + (dh.getMinutes(targetDate) / 60);

                // Only scroll if there is a time component in the targetDate and vertical scrolling is not disabled.
                // If the hours and minutes are zero, this is a scroll to a *date*, not a time.
                if (target && options.y !== false) {
                    const
                        { scrollable } = me,
                        { viewport }   = scrollable,
                        timeRect       = me.getPositionRect(me.getPositionFromTime(target), viewport);

                    if (timeRect) {
                        scrollPromises.push(scrollable.scrollIntoView(timeRect, {
                            ...options,
                            viewport,
                            x         : false,
                            // Default to the historic top alignment. Must not be assigned into the shared options
                            // object, which is also used for the horizontal scroll below where it means inline.
                            block     : options.block || 'start',
                            // A Rectangle can be neither highlighted nor focused. Where a day element is also
                            // scrolled into view below, that is what handles those options.
                            highlight : false,
                            focus     : false
                        }));
                    }
                }
            }
        }
        // Scroll to the event element horizontally if possible
        else {
            // final scroll target is the element.
            scrollTarget = me.getEventElement(target);

            // Expand the end edgeOffset so that the event's encapsulating cell is in view.
            // This is because events can be narrower if they are in clusters and bringing the
            // whole cell into view is more visually appealing.
            if (scrollTarget) {
                const
                    cellRect  = Rectangle.from(scrollTarget.closest('.b-calendar-cell')),
                    eventRect = Rectangle.from(scrollTarget);

                options.edgeOffset = {
                    end : me.rtl ? eventRect.x - cellRect.x : cellRect.right - eventRect.right
                };
            }
        }

        // If we are showing more than one day, ensure the date column is in view.
        // Do not scroll horizontally if we were passed a number which is an hour.
        if (scrollTarget && (!targetIsDate || (me.duration > 1 && !hourPassed))) {
            scrollPromises.push(me.horizontalScroller.scrollIntoView(scrollTarget, options));
        }

        // There may be a horizontal as well as vertical component if we are in a multi day
        // view with minDayWidth set causing overflow.
        return me.scrollPromise = Promise.all(scrollPromises).then(() => me.scrollPromise = null);
    }

    getEventElement(event, date) {
        return super.getEventElement(event, date) || this.allDayEvents?.getEventElement(event, date);
    }

    getEventElements(event) {
        return super.getEventElements(event) || this.allDayEvents?.getEventElements(event);
    }

    /**
     * Returns the pixel coordinate on the time axis for the passed time of day.
     * @param {Date|Number|String} time The hour number, 'HH:MM' time or a `Date` instance.
     * @internal
     * @returns {Number}
     */
    getPositionFromTime(time) {
        // If it's not possible, return 0. DayTime#delta is negative between dayStartShift and dayStartTime.
        if (DayTime.parse(time) < DayTime.parse(this.dayStartTime) - this.dayStartShift) {
            return 0;
        }
        return this.dayTime.delta(time, 'h') * this.hourHeight;
    }

    /**
     * Returns a 1px high `Rectangle` at the passed time axis position for our scroller to scroll into view, or
     * `null` if we are not visible.
     * @param {Number} position A time axis position in content space, as returned by
     * {@link #function-getPositionFromTime}.
     * @param {Core.helper.util.Rectangle} viewport Our scroller's viewport, which must also be passed on as the
     * `viewport` scroll option so that the delta is calculated against the same rectangle.
     * @internal
     * @returns {Core.helper.util.Rectangle|null} A 1px high `Rectangle`, or `null` if no `viewport` was passed.
     */
    getPositionRect(position, viewport) {
        // A time axis position is in content space, but getDeltaTo compares the rect against the unscrolled
        // viewport. The 1px height is required, getDelta's nearest branch is gated on targetSize > intersectionSize.
        return viewport ? new Rectangle(viewport.x, viewport.y + position - this.scrollable.y, viewport.width, 1) : null;
    }

    updateShowAllDayHeader(showAllDayHeader) {
        const
            me = this,
            { _allDayEvents } = me;

        me._cellMap?.clear();

        me.toggleCls('b-hide-all-day-header', !showAllDayHeader);
        if (_allDayEvents) {
            _allDayEvents._cellMap?.clear();
            _allDayEvents.toggleCls('b-hide-all-day-header', !showAllDayHeader);
            _allDayEvents.refresh();
        }

        if (!me.isConfiguring) {
            me.refresh();
        }
    }

    changeAllDayFilterFn(allDayFilterFn) {
        allDayFilterFn = (allDayFilterFn || this.defaultAllDayFilterFn).bind(this);

        // Create a function which returns the *opposite* of the allDayFilterFn so that we can use
        // it to filter out all day events from the main hour columns.
        /**
         * A function which returns the opposite of the {@link #config-allDayFilterFn} so that we can use
         * it to filter out all day events from the main hour columns.
         * @member {Function} nonAllDayFilterFn
         * @param {Scheduler.model.EventModel} eventRecord The event record to test.
         * @returns {Boolean} `true` if the event is not an all day event, `false` if it is an all day event.
         * @readonly
         * @internal
         */
        this.nonAllDayFilterFn = function(eventRecord) {
            return !allDayFilterFn(eventRecord);
        };

        return allDayFilterFn;
    }

    /**
     * The default all day filter function which returns `true` if the event is to be rendered in the
     * all day header, or `false` if it is to be rendered in the day column(s).
     * @param {Scheduler.model.EventModel} eventRecord The event record to test.
     * @returns {Boolean} `true` if the event should be rendered in the all day header,
     * `false` if it should be rendered in the day column(s).
     */
    defaultAllDayFilterFn(eventRecord) {
        // If we are configured to not show the all day header, or we do not have an allDayEvents
        // subview, then we do not consider any events to be all day events.
        if (!this.showAllDayHeader || !this.allDayEvents) {
            return false;
        }
        // If it is an all day event, or it is not an intra-day event, then it is an all day event.
        return eventRecord.allDay || !this.dayTime.isIntraDay(eventRecord);
    }

    changeAllDayEvents(allDayEvents, oldAllDayEvents) {
        // Shortcut nullifying the allDayEvents property
        if (!allDayEvents) {
            return oldAllDayEvents?.destroy();
        }

        this.getConfig('date');  // ensure we have startDate/endDate setup if we were given a date

        // CalendarRow controls its own height based on event count and expanded/collapsed state.
        // But the max height it may scroll in within a DayView is controlled by us, so treat maxHeight
        // configured on the allDayEvents as a request for maxAllDayHeight
        if (allDayEvents.maxHeight) {
            this.maxAllDayHeight = allDayEvents.maxHeight;
            allDayEvents.maxHeight = null;
        }
        const
            me = this,
            {
                autoCreate,
                dayHeaderRenderer,
                overflowButtonRenderer,
                overflowClickAction,
                overflowPopup,
                avatarRendering,
                range,
                shiftIncrement,
                dayNameFormat
            }                = me,
            showAllDayHeader = me.isConfiguring ? me.peekConfig('showAllDayHeader') : me.showAllDayHeader,
            result           = CalendarRow.reconfigure(oldAllDayEvents, allDayEvents, {
                owner : me,

                defaults : {
                    calendar : me.calendar,
                    parent   : me,
                    rtl      : me.rtl,

                    cls : {
                        'b-day-view-schedule-container' : 1,
                        'b-day-view-initializing'       : 1,
                        'b-hide-all-day-header'         : !showAllDayHeader
                    },

                    // If we were configured with any of the following, they were obviously intended for use
                    // by the all day row
                    [overflowPopup !== undefined ? 'overflowPopup' : '_']     : overflowPopup,
                    [overflowButtonRenderer ? 'overflowButtonRenderer' : '_'] : overflowButtonRenderer,
                    [overflowClickAction ? 'overflowClickAction' : '_']       : overflowClickAction,
                    [dayHeaderRenderer ? 'dayHeaderRenderer' : '_']           : dayHeaderRenderer,
                    [avatarRendering ? 'avatarRendering' : '_']               : avatarRendering,
                    [shiftIncrement ? 'shiftIncrement' : '_']                 : shiftIncrement,
                    [dayNameFormat ? 'dayNameFormat' : '_']                   : dayNameFormat,

                    // This view always autoCreates allDay events starting at midnight
                    autoCreate : autoCreate !== false ? {
                        newName   : autoCreate.newName,
                        gesture   : autoCreate.gesture,
                        startHour : 0,

                        // If this DayView was configured with an autoCreate duration, use the durationUnit
                        // specified there as the durationUnit for the allDayEvents.
                        // If we are in the default configuration, use a duration of 1 day.
                        duration : me.initialConfig.autoCreate?.duration ? `${me.dateHelper.as(autoCreate.durationUnit, '1 day')} ${autoCreate.durationUnit}` : '1 day'
                    } : false,

                    // Pass on any non-default dragUnit configuration
                    [me.initialConfig.dragUnit ? 'dragUnit' : '_'] : me.dragUnit,

                    // Only signal a dayNumberClick on a click on the day number element.
                    // Allow clicks in the surrounding header to be used to create new events.
                    dayNameSelector : '.b-day-name-date',

                    // Must use the same configured event filter as us in addition to only showing
                    // the all day and interDay events
                    eventFilter : FunctionHelper.combineFilterFns(me.allDayFilterFn, me.eventFilter),

                    // The all day row announces "n all-day events" as its aria-label for screen readers.
                    // This prop is used as the localization key for "n events" in that string.
                    eventCountKey : 'allDayEventCount',

                    compactHeader        : me.compactHeader,
                    dayStartTime         : me.dayStartTime,
                    dayEndTime           : me.dayEndTime,
                    dayStartShift        : me.dayStartShift,
                    eventRenderer        : me.eventRenderer,
                    eventStore           : me.eventStore,
                    month                : me.month,
                    // Only upgrade to show a full week header if we are the fixed duration default day mode
                    // Not if we are a variable duration DayView which may be controlled via the datePicker
                    fullWeek             : me.duration === 1 && me.fixedDuration && !me.dayTime.startShift,
                    filterEventResources : me.filterEventResources,

                    // Configure the all day row to match the mode we are in.
                    // Either range + date or startDate -> endDate
                    [range ? 'date' : 'startDate'] : range ? me.date : me.startDate,
                    [range ? 'range' : '_']        : range,
                    [range ? '_' : 'endDate']      : me.endDate,

                    nonWorkingDays    : me.nonWorkingDays,
                    dateFilter        : me.dateFilter,
                    nonWorkingDayCls  : me.nonWorkingDayCls,
                    weekendCls        : me.weekendCls,
                    weekStartDay      : me.weekStartDay,
                    defaultCalendar   : me.defaultCalendar,
                    emptyCellRenderer : me.emptyCellRenderer,
                    hideEmptyDays     : me.hideEmptyDays,
                    syncCalendarDate  : me.syncCalendarDate,

                    internalListeners : {
                        heightChange      : 'updateElementLayout',
                        refresh           : 'updateElementLayout',
                        catchall          : 'relayAllDayEvents',
                        showoverflowpopup : 'onAllDayOverflowPopupShown',
                        thisObj           : me
                    },

                    // If all day row does not render events, the day part must fire
                    // the creation signal so that responders such as EventEdit can do right things.
                    editAutoCreatedEvent(eventRecord) {
                        (me.showAllDayHeader ? this : me).trigger('eventAutoCreated', {
                            eventRecord
                        });
                    },

                    // If we are not showing all day events, always return an empty Map
                    createCellMap() {
                        return me.showAllDayHeader ? this.constructor.prototype.createCellMap.call(this, ...arguments) : (me.emptyMap || (me.emptyMap = new Map()));
                    },

                    actionButtons : me.actionButtons
                },
                setup(config) {
                    // We need to postprocess the inheriting of hideNonWorkingDays after
                    // we know how external configurations have played into the full config.
                    // If we are showing only one day, then hiding non working days is invalid
                    config.hideNonWorkingDays = me.duration === 1 && !config.fullWeek ? false : me._hideNonWorkingDays;
                }
            });

        // It's null on destroy
        if (result) {
            // The all day row must control its own height.
            // These configs must be ignored.
            delete result.height;
            delete result.flex;

            // The all day row is not in control of its date range.
            // If we ever have to scroll to another date, this entire view does that
            // before handing control on to the all day row widget.
            me.originalAllDayEventsScrollTo = result.scrollTo;
            result.scrollTo = me.allDayEventsScrollTo.bind(me);
        }

        return result;
    }

    // We have to be able to yield the underbar property so that Calendar can ask if there is an
    // overflowPopup for a child view without triggering its creation.
    onAllDayOverflowPopupShown({ overflowPopup }) {
        this._overflowPopup = overflowPopup;
    }

    // This is what gets called when the all day row is asked to scrollTo
    // We have control of what it does. It does not have control of its date range.
    allDayEventsScrollTo(target) {
        const
            me             = this,
            { dh }         = me,
            newDate        = target.isEvent ? target.startDate : me.changeEndDate(target),
            dateIntersects = target.isEvent ? dh.intersectSpans(me.startDate, me.endDate, target.startDate, target.endDate) : dh.betweenLesser(newDate, me.startDate, me.endDate);

        // If we do not encompass the date, move to the date.
        // Doing this will update the all day row's date.
        if (!dateIntersects) {
            me.date = newDate;
        }
        else {
            // Now CalendarRow can have at it.
            return me.originalAllDayEventsScrollTo.call(me.allDayEvents, ...arguments);
        }
    }

    updateAutoCreate(autoCreate) {
        // Use the property name so as not to ingest the lazy config at configure time
        const { _allDayEvents } = this;

        super.updateAutoCreate?.(autoCreate);

        if (_allDayEvents) {
            _allDayEvents.autoCreate = autoCreate ? {
                newName   : autoCreate.newName,
                gesture   : autoCreate.gesture,
                startHour : 0,
                duration  : '1 day'
            } : false;
        }
    }

    updateWeekStartDay(weekStartDay, oldWeekStartDay) {
        super.updateWeekStartDay?.(weekStartDay);

        if (!this.isConfiguring && this.allDayEvents) {
            this.allDayEvents.weekStartDay = weekStartDay;
        }
    }

    updateEventStore(eventStore, was) {
        super.updateEventStore(eventStore, was);

        const { dayTime } = this;

        if (dayTime) {
            eventStore?.registerDayIndex(dayTime);
            was?.unregisterDayIndex(dayTime);
        }
    }

    /**
     * The {@link Calendar.widget.OverflowPopup} instance that the {@link #property-allDayEvents}
     * may show when events for one day overflow the available space.
     * @member {Calendar.widget.OverflowPopup} overflowPopup
     * @readonly
     */
    get overflowPopup() {
        // If we don't have _allDayEvents yet, return the underlying config.
        return this._allDayEvents?.overflowPopup || this._overflowPopup;
    }

    get description() {
        const
            me = this,
            {
                range,
                shortDateFormat,
                dh
            }  = me;

        // The default case is a single day/week/whatever view
        if (me.descriptionRenderer || me.fixedDuration || me.duration === 1 || (range?.magnitude === 1 && range.unit === 'day')) {
            return super.description;
        }
        // Otherwise describe in terms of either a range, or start and end date.
        // If a range, but we are filtering out dates, describe as start to end.
        if (range && !me.dateFilter) {
            return `${dh.format(me.startDate, shortDateFormat)}, ${range.magnitude} ${dh.getLocalizedNameOfUnit(range.unit, range.magnitude > 1)}`;
        }
        else {
            return `${dh.format(me.startDate, shortDateFormat)} - ${dh.format(dh.add(me.endDate, -1, 'd'), shortDateFormat)}`;
        }
    }

    get eventContentElement() {
        return this.dayContainerElement;
    }

    getDateFromDomEvent(domEvent, precise = false) {
        let date = super.getDateFromDomEvent(domEvent);

        const
            me     = this,
            { dh } = me,
            el     = DomHelper.getEventElement(domEvent);

        // Override to add a time component to the DOM event's date if we receive and event (not an element) and
        // the event was in the day container.
        if (date && el !== domEvent && me.dayContainerElement.contains(el)) {
            // If it's a KeyboardEvent, the y must be the event el's y
            const
                { scrollable } = me,
                y              = (domEvent.clientY || el.getBoundingClientRect().y) - 0.5,
                hours          = me.dayStartHour +
                    (y - scrollable.element.getBoundingClientRect().y + scrollable.y) / me.hourHeight;

            // Apply the offset in local time
            dh.set(date, 'millisecond', dh.getMilliseconds(date) - me.dayStartShift + hours * MILLIS_PER_HOUR);

            if (!precise && me.timeSnapType) {
                date = dh[me.timeSnapType](date, me.increment);
            }
        }

        return date;
    }

    getDateFromPosition(clientX, clientY, local = false, keyParser = null) {
        const
            me       = this,
            {
                dh,
                eventContentElement,
                allDayEvents
            }        = me,
            rect     = local ? zeroRect : Rectangle.fromScreen(eventContentElement).roundPx().translate(-eventContentElement.scrollLeft),
            width    = eventContentElement.scrollWidth,
            localX   = local ? clientX : clientX - rect.x,
            dx       = me.rtl ? me.eventContentElement.offsetWidth - localX : localX,
            dy       = clientY - rect.y,
            // We have to compare element position because day columns may have different widths
            overCell = me.getDayElementFromX(clientX),
            // Completely empty views must return their date.
            // DayView can hide empty days and DayResourceView can hide empty resources which can result
            // in no day cells being rendered. This method must yield a valid Date.
            height   = overCell?.offsetHeight || me.hourHeight * me.getDayLength('hour'),
            // Parse the cell's date key in the view's day frame (tz-aware DateHelper + dayStartShift)
            date     = me.getDateFromElement(overCell, keyParser) || me.date;

        if (allDayEvents && (dx < 0 || width < dx || dy < 0 || height < dy)) {
            // CalendarDrag will pass this view's DayTime so pass it into CalendarRow
            return allDayEvents.getDateFromPosition(clientX, clientY, keyParser);
        }

        dh.clearTime(date, /* clone = */false);
        date.setMilliseconds(date.getMilliseconds() + me.dayStartMs + Math.floor(dy / height * me.getDayLength()));

        return me.timeSnapType ? dh[me.timeSnapType](date, me.increment) : date;
    }

    // We must implement the CalendarMixin interface.
    // All views must expose a doRefresh method.
    doRefresh() {
        const
            me                   = this,
            { dh }  = me,
            {
                element,
                noMatchingDates,
                allDayEvents
            }                    = me,
            columnHeaderRenderer = me.resolveCallback(me.columnHeaderRenderer, me, false);

        me.fwComponent ??= me.up(hasProcessEventContent);

        if (me.isVisible) {
            // Opt out of animations while we refresh to avoid reused elements resizing
            // unless the refresh caller wanted to opt in to transitions.
            if (!me.allowTransitionsOnRefresh) {
                DomHelper.addTemporaryClass(element, 'b-no-transitions', 200, me);
            }
            // Null means it is not set, and allowed to be set.
            // CalendarDrag sets it to false
            me.allowTransitionsOnRefresh = null;

            const
                headerCells = [],
                dayCells    = [];

            // Calculate this for getDayDomConfig only once per refresh.
            me.today = me.dayTime.startOfDay(me.calendar?.dateTimeNow || new Date());

            // Create day cell child array. DomSync ignores null array entries which is what
            // getDayDomConfig returns for hidden days.
            // eslint-disable-next-line no-unused-vars
            for (let i = 0, date = new Date(me.startDate); date < me.endDate; i++, date = dh.add(date, 1, 'd')) {
                const dayCell = me.getDayDomConfig(date);

                if (dayCell) {
                    dayCells.push(dayCell);

                    // Create day header cells if we are configured with a columnHeaderRenderer
                    if (columnHeaderRenderer) {
                        const
                            key            = me.dayTime.dateKey(date),
                            allDay         = allDayEvents?.cellMap.get(key)?.events ? allDayEvents.cellMap.get(key).events.map(({ eventRecord }) => eventRecord) : emptyArray,

                            // dayCell will be nullish for skipped days due to hidden non working days
                            // or hideEmptyDays or the dateFilter callback rejecting the date
                            headerCell     = {
                                dataset : {
                                    syncId : key,
                                    date   : key
                                },
                                className : {
                                    'b-day-column-header-cell'           : 1,
                                    [`b-day-of-week-${dh.getDay(date)}`] : 1
                                },
                                role : 'columnheader'
                            },
                            intraDayEvents = me.cellMap.get(key)?.events || emptyArray,
                            cellData       = {
                                ...me.createCellData(date),
                                events       : intraDayEvents,
                                allDayEvents : allDay,
                                allEvents    : mergeArrays(intraDayEvents, allDay),
                                intraDayEvents
                            },
                            headerContent  = columnHeaderRenderer.handler.call(columnHeaderRenderer.thisObj, cellData);

                        if (headerContent) {
                            headerCell[typeof headerContent === 'string' ? 'html' : 'children'] = headerContent;
                        }
                        headerCells.push(headerCell);
                    }
                }
            }

            if (columnHeaderRenderer) {
                me.addCls('b-has-day-header');
                DomSync.sync({
                    targetElement : me.dayHeaderContentElement,
                    domConfig     : {
                        onlyChildren : true,
                        children     : headerCells,

                        // Match existing data-syncId elements first and ensure DOM order matches
                        // children order.
                        syncOptions : {
                            syncIdField      : 'syncId',
                            releaseThreshold : 0,
                            strict           : true
                        }
                    }
                });
            }
            else {
                me.removeCls('b-has-day-header');
            }

            // Flag element if it's showing multiple day columns
            me.toggleCls('b-multi-day-view', dayCells.length > 1);
            element.style.setProperty('--bi-visible-column-count', dayCells.length);

            // Allow subclasses to mutate final cell DomConfig state
            me.onDayCellConfigGenerated?.(dayCells);

            DomSync.sync({
                targetElement : me.dayContainerElement,
                domConfig     : {
                    onlyChildren : true,
                    children     : dayCells.length ? dayCells : [{
                        className                                          : 'b-empty-text',
                        [noMatchingDates?.includes('<') ? 'html' : 'text'] : noMatchingDates
                    }],

                    // Match existing data-date elements first and ensure DOM order matches
                    // children order.
                    syncOptions : {
                        syncIdField      : 'date',
                        releaseThreshold : 0,
                        strict           : dayCells.length > 0
                    }
                },
                callback({ action, domConfig, targetElement, jsx }) {
                    me.fwComponent?.processEventContent?.({
                        jsx,
                        action,
                        domConfig,
                        targetElement,
                        reactComponent : me.fwComponent.reactComponent || me.fwComponent
                    });
                }
            });
            me.toggleCls('b-no-days', !dayCells.length);

            // In case height has changed since last refresh.
            me.refreshDayBackground();

            me.refreshCount = (me.refreshCount || 0) + 1;

            me.syncCurrentTimeIndicators();
            /**
             * Fires when this DayView refreshes.
             * @param {Calendar.widget.DayView} source The triggering instance.
             * @event refresh
             */
            me.trigger('refresh');
        }
    }

    /**
     * Gets the full event load which the passed date contains for this view. Includes events
     * in the all day row as well as in the main day area.
     * @param {Date|String} date The date or `YYYY-MM-DD` key for which to gather events.
     * @param {Date} startDate To sync this view's range with the caller's range. Used by
     * this view's {@link #property-allDayEvents} view.
     * @returns {Scheduler.model.EventModel[]}
     * @private
     */
    getEventsForDay(date, startDate) {
        const
            me               = this,
            key              = typeof date === 'string' ? date : me.dayTime.dateKey(date),
            { allDayEvents } = me;

        // Ensure we are in sync with our caller
        if (startDate && me.startDate - startDate) {
            me._cellMap?.clear();
            me.startDate = startDate;
        }

        let events = me.cellMap.get(key)?.events;

        if (allDayEvents) {
            if (allDayEvents.startDate - me.startDate) {
                allDayEvents._cellMap?.clear();
                allDayEvents.startDate = me.startDate;
            }
            events = mergeArrays(events, allDayEvents.cellMap.get(key)?.renderedEvents);
        }
        // Some events arrays are raw EventModels, some are event info blocks.
        // We extract into an array of EventModels.
        return events?.map(extractEventRecord) || emptyArray;
    }

    // Override from CalendarMixin.
    // DayView's "today" may be shifted by the dayStartShift.
    // So when dayStartShift is 18, days start at 6pm, so today is 6pm today.
    // this.today is set at the start of doRefresh() when we know the current date.
    isToday(date) {
        return !(date - (this.today ??= this.dayTime.startOfDay(new Date())));
    }

    getBaseDayDomConfig(date) {
        const
            me             = this,
            {
                dh,
                dateFilter,
                resource,
                today
            } = me,
            key            = me.dayTime.dateKey(date),
            cellData       = me.cellMap.get(key) || (me.cellMap.set(key, me.createCellData(date))).get(key), // dayCellRenderer & timeRanges need one
            { day }        = cellData,
            // Skip hidden, nonworking days (unless we're a single day view).
            // Skip empty days if configured to do so.
            skipDay        = (me.hiddenNonWorkingDays[day] && me.duration !== 1) || (me.hideEmptyDays && !me.getEventsForDay(key).length) || (dateFilter && !me.callback(dateFilter, me, [cellData]));

        // Return nullish for skipped days.
        if (!skipDay) {
            const
                nonWorkingDays = me.nonWorkingDays || me.month.nonWorkingDays,
                isToday        = !(date - today),
                todayText      = isToday ? me.L('L{Object.today}, ') : '';

            return [cellData, {
                tabIndex     : -1,
                role         : 'gridcell',
                'aria-label' : `${todayText}${dh.format(date, 'dddd Do MMMM')}${resource ? ` ${resource.name}` : ''}, ${me.L('eventCount', cellData.events?.length || 0)}.`,
                dataset      : {
                    date : key
                },
                className : {
                    'b-day-view-day-detail'  : 1,
                    [me.dayCellCls]          : 1,
                    [me.nonWorkingDayCls]    : nonWorkingDays[day] || false,
                    [me.weekendCls]          : dh.weekends[day],
                    [me.todayCls]            : isToday,
                    'b-last-cell'            : !(date - me.lastVisibleDate),
                    [`b-day-of-week-${day}`] : 1,
                    'b-past-date'            : date < today
                },
                style    : {},
                children : {
                    inset : {
                        className : {
                            'b-day-view-inset' : 1
                        }
                    },
                    events : {
                        className : {
                            'b-day-view-event-container' : 1
                        },
                        children : []
                    },
                    ...me.renderTickBackground(cellData, resource)
                },

                // Match existing data-event-id elements first and ensure DOM order matches
                // children order.
                syncOptions : {
                    syncIdField      : 'eventId',
                    releaseThreshold : 0,
                    strict           : true
                }
            }];
        }
    }

    renderTickBackground(cellData, resourceRecord) {
        const
            me           = this,
            { dh }       = me,
            tickRenderer = me.resolveCallback(me.tickRenderer, me, false),
            result       = {};

        if (tickRenderer) {
            const
                subTickCount  = parseInt(DomHelper.getStyleValue(me.contentElement, '--bi-subtick-count')),
                dayLength     = me.getDayLength('h'),
                tickCount     = dayLength * subTickCount,
                tickDuration  = dayLength / tickCount,
                { dayTime }   = me,
                { startHour } = dayTime;

            let subtick,
                // cellData.date is cell midnight in view tz. Add startHour wall-clock hours
                // in view tz to get the day's start time.
                date = dh.add(new Date(cellData.date), startHour, 'h'),
                tickIndex, subtickIndex;

            // Iterate the subticks and render a cell for each.
            for (tickIndex = 0, subtickIndex = 0; tickIndex < tickCount; tickIndex++) {
                const tickDate = date;

                // Advance the date to the next subtick so we can see if this was the last in an hour.
                // Note: dh.add does not mutate the date object, it returns a new one. tickDate is still the same.
                date = dh.add(date, tickDuration, 'h');

                subtick = tickRenderer.handler.call(tickRenderer.thisObj, {
                    events    : cellData.events.filter(e => dh.intersectSpans(tickDate, date, e.startDate, e.endingDate)),
                    startTime : tickDate,
                    endTime   : date,
                    tickIndex,
                    subtickIndex,
                    subTickCount,
                    resourceRecord
                });

                if (subtick) {
                    if (typeof subtick === 'string') {
                        subtick = {
                            text : subtick
                        };
                    }
                    else if (Array.isArray(subtick)) {
                        subtick = {
                            children : subtick.map(wrapText)
                        };
                    }

                    const
                        isLastInHour = !dh.getMinutes(date),
                        rowspan = subtick.rowspan || subtick.rowSpan;

                    if (typeof subtick.style === 'string') {
                        subtick.style = DomHelper.parseStyle(subtick.style);
                    }
                    (subtick.style || (subtick.style = {}))['--bi-tick-index'] = tickIndex;
                    if (rowspan) {
                        subtick.style['--bi-tick-rowspan'] = rowspan;
                        subtick.rowspan = subtick.rowSpan = null;
                    }
                    subtick.className = {
                        ...DomClassList.from(subtick.className, true),
                        'b-day-view-subtick' : 1,
                        'b-last-in-hour'     : isLastInHour
                    };
                    (subtick.dataset || (subtick.dataset = {})).hour = dh.getHours(tickDate);
                    subtick.dataset.minute = dh.getMinutes(tickDate);
                    subtick.dataset.index = subtickIndex++;

                    if (isLastInHour) {
                        subtickIndex = 0;
                    }

                    result[`subtick-${tickIndex}`] = subtick;
                }
            }
        }
        return result;
    }

    getDayDomConfig(date) {
        const
            me   = this,
            base = me.getBaseDayDomConfig(date);

        if (base) {
            const
                { dayCellRenderer } = me,
                [cellData, dayDomConfig] = base;

            if (me.coreHours) {
                // If our coreHours yields a callable function, ask it the coreHours for this date.
                // If it is an array, extract the coreHours for the day.
                // Set up the background image to create the effect.
                dayDomConfig.style.backgroundImage = me.getCoreHoursGradient(me.getCoreHoursForDate(date));
            }

            // Render events if any. Call even if we have no events to allow beforeLayoutEvents event to fire and
            // listeners to act (e.g., timeRanges)
            me.renderEvents(cellData, dayDomConfig);

            return DomHelper.normalizeChildren(
                dayCellRenderer ? me.callback(dayCellRenderer, me, [cellData, dayDomConfig]) : dayDomConfig);
        }
    }

    onCalendarKeyDown(keyEvent) {
        const
            { target } = keyEvent,
            {
                dayCellCls,
                allDayEvents
            }          = this,
            {
                eventContentElement
            }         = (this.owner?.isCalendarMixin ? this.owner : this);

        // Only listen for key events in the event content area
        if (eventContentElement.contains(target)) {
            const
                eventCellSelector = `${target.matches('.b-day-view-day-detail') ? '.b-day-view-day-detail' : ''}.${dayCellCls}`,
                from              = target.closest(eventCellSelector) || target,
                date              = from.closest('[data-date]')?.dataset.date,
                eventCellFocused  = from.matches(eventCellSelector),
                { resourceId }    = from.dataset,
                resourceSelector  = resourceId ? ` [data-resource-id="${CSS.escape(resourceId)}"]` : '';

            switch (keyEvent.key) {
                case 'ArrowUp':
                    // Up from an event cell goes to the header cell for that date
                    if (eventCellFocused && allDayEvents) {
                        keyEvent.preventDefault();
                        // Try event content first.
                        let to = allDayEvents.eventContentElement.querySelector(`.${allDayEvents.dayCellCls}[data-date="${date}"]${resourceSelector}`);

                        // If that's hidden due to there being no all day events, try the header cell.
                        if (!DomHelper.isFocusable(to) || !DomHelper.isInView(to)) {
                            to = allDayEvents.headerCellContainer.querySelector(`[data-header-date="${date}"]`);
                        }
                        to?.focus();
                    }
                    return;
                case 'ArrowLeft':
                    keyEvent.preventDefault();
                    ElementVisitor.getVisitor(eventContentElement, eventCellSelector).previous(from)?.focus();
                    return;
                case 'ArrowRight':
                    keyEvent.preventDefault();
                    ElementVisitor.getVisitor(eventContentElement, eventCellSelector).next(from)?.focus();
                    return;
            }
            return super.onCalendarKeyDown(keyEvent);
        }
    }

    onCalendarPointerInteraction(domEvent) {
        const
            me         = this,
            { target } = domEvent;

        // Broadcast a click on a time axis cell.
        if (target.closest('.b-time-axis-container')) {
            // Fake the target to be the current date's cell so that getDateFromDomEvent works correctly.
            domEvent.target = me.getDayElement(me.date);

            const preciseTime = me.getDateFromDomEvent(domEvent, true);

            /**
             * Fired when a time axis is clicked on. If the handler returns
             * `false` the current pointer event is not processed further.
             * @event timeAxisClick
             * @param {Event} domEvent The triggering DOM event.
             * @param {Date} preciseTime The exact date and time at the clicked position
             * @param {Date} time The date and time at the clicked position snapped according to the
             * {@link #config-increment} and {@link #config-timeSnapType}
             */
            if (!preciseTime || me.trigger(`timeAxis${eventNameMap[domEvent.type]}`, {
                preciseTime,
                time : me.dateHelper[me.timeSnapType](preciseTime, me.increment),
                domEvent
            }) === false) {
                return false;
            }
        }
        else if (target.closest('.b-day-column-header-cell')) {
            /**
             * Fired when a day column header cell is clicked on. If the handler returns
             * `false` the current pointer event is not processed further.
             *
             * A day column header cell will only exist if this view is configured with a
             * {@link #config-columnHeaderRenderer}.
             * @event dayHeaderClick
             * @param {Event} domEvent The triggering DOM event.
             * @param {Date} date The date of the clicked header cell.
             */
            if (me.trigger(`dayHeader${eventNameMap[domEvent.type]}`, {
                domEvent,
                date : me.getDateFromDomEvent(domEvent)
            }) === false) {
                return false;
            }
        }
        else {
            return super.onCalendarPointerInteraction(domEvent);
        }
    }

    /**
     * Calculates A CSS `linear-gradient` specification from a {@link #config-coreHours} definition object.
     *
     * A core hours object consists ot two properties, `start` and `end`. It may also be an array containing
     * multiple core hours definitions.
     * @param {Object} coreHours
     * @param {Number|String} coreHours.start The start hour or start time string `HH:MM` of the core working hours.
     * @param {Number|String} coreHours.end The start hour or end time string `HH:MM` of the core working hours.
     * @returns {String} A String containing a `linear-gradient` style which shades non-working times using the
     * `--b-day-view-outside-core-hours-color` CSS variable.
     * @internal
     */
    getCoreHoursGradient(coreHours) {
        // No background image gradient if no core hours specified.
        if (!coreHours) {
            return '';
        }

        const
            me          = this,
            { dayTime } = me,
            dayEnd      = dayTime.duration('h'),
            result      = ['linear-gradient(to bottom'];

        // Convert a single time block into an array, we need to handle multiple
        // time blocks.
        coreHours = ArrayHelper.asArray(coreHours);

        let lastEnd = 0;

        for (let i = 0, { length } = coreHours; i < length; i++) {
            const
                c       = coreHours[i],
                start   = Math.max(dayTime.delta(c.start, 'h'), 0)    / dayEnd * 100,
                end     = Math.min(dayTime.delta(c.end, 'h'), dayEnd) / dayEnd * 100;

            // If the working block for the day is the whole day, we don't need a background
            if (length === 1 && start === 0 && end === 100) {
                return '';
            }

            // Blocked hours prior to this working block
            if (lastEnd < start) {
                result.push(`var(--b-day-view-outside-core-hours-color) ${DomHelper.percentify(lastEnd)}, var(--b-day-view-outside-core-hours-color) ${DomHelper.percentify(start)}`);
            }

            result.push(`transparent ${DomHelper.percentify(start)}, transparent ${DomHelper.percentify(end)}`);

            lastEnd = end;
        }

        // Closing blocked out hours if any
        if (lastEnd < 100) {
            result.push(`var(--b-day-view-outside-core-hours-color) ${DomHelper.percentify(lastEnd)}, var(--b-day-view-outside-core-hours-color) 100%`);
        }

        return result.join(',') + ')';
    }

    getCoreHoursForDate(date) {
        const { coreHours } = this;

        // It's an array for each day
        if (coreHours.length === 7) {
            return coreHours[this.dateHelper.getDay(date)];
        }
        // Object or array of objects
        if (typeof coreHours === 'object') {
            // Core hours as a simple object only applies to dates if overlayDay set.
            return coreHours.overlayDay ? coreHours : null;
        }
        // Must be a callback
        return this.callback(coreHours, this, [date]);
    }

    /**
     * Refreshes the event layout inside a day column in case the stacking order becomes incorrect.
     * @param {Date} date
     * @internal
     */
    refreshDayEvents(date) {
        const me = this;

        // Promote YYYY-MM-DD keys to Dates
        date = me.changeEndDate(date);

        // getDayDomConfig reads this.
        me.today = me.dayTime.startOfDay(new Date());

        const domConfig = me.getDayDomConfig(date);

        // Opt out of animations while we refresh to avoid reused elements resizing
        DomHelper.addTemporaryClass(me.element, 'b-no-transitions', 200, me);

        domConfig.onlyChildren = true;
        DomSync.sync({
            targetElement : me.getDayElement(date),
            domConfig
        });
    }

    /**
     * Pushes event bar DomConfig definitions into the `children` property of the passed
     * `dayDomConfig` object
     * @param {DayCell} cellData An object containing information about the day cell being created.
     * @param {DomConfig} dayDomConfig The DomConfig element definition for the day cell.
     * @internal
     */
    renderEvents(cellData, dayDomConfig) {
        const
            me        = this,
            context   = me.eventLayout.layoutEvents(cellData, dayDomConfig),
            { items } = context,
            { rtl }   = me;

        // Top and bottom event spacing is applied by the .b-cal-event-wrap CSS rule via the
        // --bi-event-spacing-top and --bi-event-spacing-bottom CSS variables set in
        // updateEventSpacing. The transparent space this creates inside the event-wrap
        // makes the event appear to start/finish before/after its true start/end time.
        for (const item of items) {
            const
                renderData     = {
                    date        : cellData.date,
                    eventRecord : item.eventRecord,
                    style       : item.getStyles(rtl)
                },
                eventDomConfig = me.createEventDomConfig(renderData);

            me.insertActionButtons(renderData.bodyContent, item.eventRecord, cellData);

            // Set the classes for the event overflowing the *visible* day if it's cropped.
            eventDomConfig.className['b-starts-above'] = item.startsBefore;
            eventDomConfig.className['b-ends-below'] = item.endsAfter;

            if (item.cluster.items.length > 1) {
                eventDomConfig.className['b-cal-in-cluster'] = 1;
            }

            dayDomConfig.children.events.children.push(eventDomConfig);
        }

        me.trigger('renderEvents', {
            context
        });
    }

    changeActionButtons(actionButtons) {
        const arrayPassed = Array.isArray(actionButtons);

        if (arrayPassed) {
            actionButtons.forEach((b, i) => {
                if (!('ref' in b)) {
                    b.ref = `action-button-${i + 1}`;
                }
            });
        }
        this._actionButtonsObject = arrayPassed ? ObjectHelper.transformArrayToNamedObject(actionButtons) : actionButtons;

        // If mutations requested, we clone into value and mutate that.
        // The original value is reset upon each event render.
        let value;

        // Convert to a Proxy which saves the original value on mutation.
        // This is so that we don't have to clone this on every event render
        // in case a renderer or event hander mutates the value.
        // We read the value on render, then reset it to its original state.
        return actionButtons = new Proxy(actionButtons, {
            deleteProperty(target, prop) {
                return delete (value || (value = ObjectHelper.clone(target)))[prop];
            },
            get(target, prop) {
                if (prop === '$value') {
                    return value || target;
                }
                else if (prop === '$reset') {
                    return () => value = null;
                }
                else if (Array.isArray(target) && typeof target[prop] === 'function') {
                    return (value || (value = ObjectHelper.clone(target)))[prop].bind(value);
                }
                return Reflect.get(...arguments);
            },
            set(target, prop, newValue) {
                return Reflect.set((value || (value = ObjectHelper.clone(target))), prop, newValue);
            }
        });
    }

    insertActionButtons(children, eventRecord, cellData) {
        const { actionButtons } = this;

        if (actionButtons) {
            const
                { $value : buttons } = actionButtons,
                // Allow object form, using the propName as the 'ref'
                buttonConfigs        = Array.isArray(buttons) ? buttons : ObjectHelper.transformNamedObjectToArray(buttons);

            if (buttonConfigs.length) {
                children.push({
                    className : 'b-event-action-buttons',
                    children  : buttonConfigs.sort(Widget.weightSortFn).map(({ cls, tooltip, ref }, index) => {
                        return {
                            tag       : 'button',
                            className : {
                                'b-tool' : 1,
                                'b-icon' : 1,
                                [cls]    : 1
                            },
                            dataset : {
                                ref,
                                btip : tooltip
                            },
                            'aria-label' : tooltip
                        };
                    })
                });
            }
            // Restore any mutations so that the next event's render pathway
            // accesses the full set.
            actionButtons.$reset();
        }
    }

    onEventClick({ domEvent }) {
        const button = domEvent.target.closest('.b-event-action-buttons button[data-ref]');

        if (button) {
            this.callback(this._actionButtonsObject[button.dataset.ref].handler, this, arguments);
            return false;
        }
    }

    get overflowElement() {
        // The vertical scrolling element
        return this.dayContentElement;
    }

    /**
     * Yields a `Map` which contains the cell data for each date in the current view.
     * This is a `Map` where the keys are the date strings in the format
     * `YYYY-MM-DD` and the values are {@link DayCell} objects which contain the data for that cell.
     * @member {Map}
     * @readonly
     */
    get cellMap() {
        // If the cellMap has not been populated, create it.
        return this._cellMap?.populated ? this._cellMap : this.createCellMap();
    }

    get bodyConfig() {
        const
            me            = this,
            {
                allDayEvents,
                maxAllDayHeight
            }             = me;

        return {
            ...super.bodyConfig,
            children : {
                alldayRowElement : allDayEvents ? {
                    className : {
                        'b-day-view-all-day-row' : 1
                    },
                    style : {
                        [maxAllDayHeight ? 'maxHeight' : ''] : DomHelper.setLength(maxAllDayHeight)
                    },
                    children : {
                        cornerElement : {
                            className : {
                                'b-day-view-all-day-row-start'  : 1,
                                'b-day-view-all-day-autoheight' : allDayEvents.autoHeight
                            },
                            children : {
                                allDayTextElement : {
                                    className : 'b-day-view-all-day-text',
                                    html      : me.L('L{EventEdit.All day}')
                                },
                                allDayToggleIcon : {
                                    tag       : 'button',
                                    className : 'b-expand-all-day-button b-icon b-icon-expand-row',
                                    dataset   : {
                                        btip : me.L('L{DayView.expandAllDayRow}')
                                    },
                                    'aria-label'    : me.L('L{DayView.expandAllDayRow}'),
                                    'aria-expanded' : false
                                }
                            }
                        },
                        allDayEvents : allDayEvents?.element,           // May have been configured away
                        $scrollerPad : DomHelper.scrollBarPadElement    // $ prefix -> not a reference
                    }
                } : null,
                dayHeaderElement : {
                    className : 'b-day-column-header',
                    children  : {
                        dayHeaderScrollerElement : {
                            className : 'b-day-column-header-scroller',
                            children  : {
                                dayHeaderContentElement : {
                                    className : 'b-day-column-content',
                                    role      : 'row'
                                }
                            }
                        },
                        $scrollerPad : DomHelper.scrollBarPadElement    // $ prefix -> not a reference
                    }
                },
                dayContentElement : {
                    role      : 'presentation',
                    className : {
                        'b-day-view-day-content' : 1
                    },
                    children : {
                        timeAxisElement : {
                            children  : me.getTimeElementConfigs(),
                            className : {
                                'b-time-axis-container' : 1
                            },
                            'aria-hidden' : true
                        },
                        dayContainerElement : {
                            role      : 'row',
                            tabIndex  : -1, // Prevent screen reader from over-announcing the cells
                            className : {
                                'b-day-view-day-container' : 1
                            }
                        }
                    }
                },
                horizontalScrollerElement : {
                    className : 'b-virtual-scrollers b-hide-display',
                    children  : [{
                        className : 'b-virtual-scroller'
                    }, DomHelper.scrollBarPadElement]
                }
            }
        };
    }

    async onDayContentMousewheel(e) {
        // Checking both ctrlKey and metaKey for Mac, since pinch zooming translates to ctrl+wheel, but we remap that to
        // meta
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const
                { zoomOnMouseWheel } = this,
                multiplicationFactor = typeof zoomOnMouseWheel === 'number' ? zoomOnMouseWheel : 1,
                pointerOffsetY       = e.clientY - this.scrollable.element.getBoundingClientRect().y,
                reqDelta             = -Math.min(Math.abs(e.deltaY), 10) * Math.sign(e.deltaY);

            await this.zoomPromise;
            this.zoomPromise = this.zoomBy(reqDelta * multiplicationFactor, pointerOffsetY, this.allowZoomUnderflow);
        }
    }

    zoomIn() {
        this.zoomBy(2);
    }

    zoomOut() {
        this.zoomBy(-2, undefined, true);
    }

    /**
     * Zooms the timeline by incrementing the {@link #property-hourHeight} by the requested pixel delta.
     * @param {Number} reqDelta The number of pixels by which to increment the {@link #property-hourHeight}
     * @param {Number|String} [zoomCenter] The center time to zoom in to. This may be a number of pixels
     * down the DayView viewport, or it may be a time to use as the center in the format `HH:MM:ss`.
     * __If omitted, the visual central time in the viewport is used__.
     *
     * Note that this will usually require a layout update which happens in the next animation frame
     * so to postprocess the new state of the view, the returned Promise must be awaited.
     * @async
     */
    zoomBy(reqDelta, zoomCenter = Math.min(this.scrollable.scrollHeight, this.scrollable.clientHeight) / 2 - 1, overrideClientHeightCheck = false) {
        return new Promise(resolve => {
            const
                me         = this,
                hoursInDay = me.getDayLength('h'),
                dayHeight  = me.hourHeight * hoursInDay;

            // Ensure the layout is up to date before we measure things
            me.updateElementLayout.cancel();

            // Ensure zoom center id not outside of the calculable time range
            zoomCenter = Math.min(zoomCenter, dayHeight);

            const
                {
                    dh,
                    scrollable,
                    hourHeight : oldHourHeight
                }              = me,
                { clientHeight } = scrollable,
                { scrollTop }  = scrollable.element,
                // "critical" means we're zooming out and in danger of underflowing the clientHeight and we're not allowed to.
                // overrideClientHeightCheck would be set to true if we're allowed to underflow the clientHeight.
                critical       = reqDelta < 0 && dayHeight >= clientHeight - 5 && !overrideClientHeightCheck,
                // Round the zoom center date to our configured snap point so that the view stays steady.
                // Use x as center to 99% likely avoid Sundays which are DST switch days which break fixed timepoint
                zoomCenterTime = dh.round(typeof zoomCenter === 'number' ? me.getDateFromPosition(me.dayContainerElement.offsetWidth / 2, zoomCenter + scrollTop, true) : dh.parse(zoomCenter, 'HH:mm:ss'), me.increment),
                minHourHeight  = critical ? me.dayContentClientHeight / hoursInDay : me.minHourHeight,
                pointerOffsetY = me.getPositionFromTime(zoomCenterTime) - scrollTop;

            // Never let it drop to crazy low hour height or below the configured minimum
            const newHourHeight  = Math.max(Math.max(oldHourHeight + reqDelta, minHourHeight), me.minHourHeight);

            // If that would drop from overflowing (or anywhere near) to below fit level, fit the hours
            if (critical && newHourHeight * hoursInDay < clientHeight) {
                me.fitHours = true;
                return resolve();
            }

            if (oldHourHeight !== newHourHeight) {
                scrollable.overflowY = me.configuredOverflowY;

                // When the day layout has been done, keep the zoom center time still.
                me.ion({
                    layoutUpdate : () => {
                        scrollable.scrollTo(null, me.getPositionFromTime(zoomCenterTime) - pointerOffsetY);

                        // Sync partners synchronously so there's no delay in a multi-view mode like ResourceView
                        scrollable.syncPartners(false, true);

                        resolve();
                    },
                    once : true,
                    prio : 1000
                });

                // Zooming breaks fitting the hours into the space.
                me.fitHours = false;

                // Invalidate the day layout
                me.hourHeight = newHourHeight;
            }
            else {
                if (!me.configuredOverflowY) {
                    me.configuredOverflowY = scrollable.overflowY;
                }

                // If we hit the minimum, kill the scrollbar
                if (newHourHeight === minHourHeight) {
                    scrollable.overflowY = 'hidden';
                }
                resolve();
            }
        });
    }

    /**
     * Zooms the timeline by setting the {@link #property-hourHeight} to the requested pixel value.
     * @param {Number} newHourHeight The new {@link #property-hourHeight} in pixels.
     * @param {Number|String} [zoomCenter] The center time to zoom in to. This may be a number of pixels
     * down the DayView viewport, or it may be a time to use as the center in the format `HH:MM:ss`.
     * __If omitted, the visual center of the viewport is used__.
     *
     * Note that this will usually require a layout update which happens in the next animation frame
     * so to postprocess the new state of the view, the returned Promise must be awaited.
     * @async
     */
    zoomTo(newHourHeight, zoomCenter) {
        return this.zoomBy(newHourHeight - this.hourHeight, zoomCenter, true);
    }

    /**
     * Zooms to fit all visible events within the vertical scroll viewport.
     * @param {Object} [options] How to scroll.
     * @param {Number} [options.edgeOffset] A margin around the target to bring into view.
     * @param {Object|Boolean|Number} [options.animate] Set to `true` to animate the scroll by 300ms,
     * or the number of milliseconds to animate over, or an animation config object.
     * @param {Number} [options.animate.duration] The number of milliseconds to animate over.
     * @param {String} [options.animate.easing] The name of an easing function.
     * @returns {Promise} A promise which is resolved when the target has been scrolled into view.
     * @async
     */
    async zoomToFit(options) {
        const
            me     = this,
            { dh } = me,
            events = me.eventStore.getEvents({
                startDate : me.startDate,
                endDate   : me.endDate,
                filter    : e => !e.isInterDay
            }),
            [start, end] = events.reduce((r, e) => {
                // Round times to nearest half hour
                const
                    startHour = dh.getTimeOfDay(dh.floor(e.startDate, '0.5h'), 'h'),
                    endHour   = dh.getTimeOfDay(dh.ceil(e.endDate, '0.5h'), 'h');

                return [(startHour < r[0]) ? startHour : r[0], (endHour > r[1]) ? endHour : r[1]];
            }, [24, 0]);

        await me.zoomTo(Math.floor(me.scrollable.clientHeight / (end - start)));

        await me.scrollTo(start, options);
    }

    createCellMap() {
        const { showAllDayHeader } = this;

        // We only want events which start and end *in* each date.
        // These will not propagate forwards anyway, so skip propagation.
        // By default filter by our dayFilter which skips events in non working days
        // and events outside of our configured start/end time range.
        // We must also honour any configured eventFilter
        return super.createCellMap({
            dayTime : this.dayTime,

            // Normally, DayView only displays intraday events, so only those which start *on*
            // the cell's date and only those which fit completely *inside* the cell's date.
            // showDayHeader flips those assumptions because all intersecting events need to
            // be collected because we have nowhere else to show interday events.
            startOnly     : showAllDayHeader,
            allowPartial  : !showAllDayHeader,
            skipPropagate : true,
            rawEvents     : true,
            filter        : this.cellMapEventFilter
        });
    }

    cellMapEventFilter(eventRecord) {
        const { dayTime, hiddenNonWorkingDays, showAllDayHeader } = this;

        // DayView rejects events which span days unless showAllDayHeader is false.
        // In which case we have to show them across multiple day cells.
        return this.nonAllDayFilterFn(eventRecord) &&
            // Event is eligible if it's within our day start/end range if we are showing the
            // all day header.
            //
            // If we are *not* showing the all day header, we filter in events which
            // intersect with a full 24 hour day, our day start/end range.
            // This is to ensure that day-crossing events which start before the day start
            // and end after the day end are still shown in the day view when showAllDayHeader is false.
            // The parts of events outside the visible day are filtered out by DayLayout#createLayoutItem
            // which rejects events which end before the day start or start after the day end.
            (showAllDayHeader ? dayTime : DayTime.MIDNIGHT).intersects(eventRecord) &&
            // AND it's not in a hidden nonworking day
            !hiddenNonWorkingDays[dayTime.dayOfWeek(eventRecord.startDate)];
    }

    getDayLength(as = 'ms') {
        return this.dayTime.duration(as);
    }

    changeIncrement(increment) {
        if (typeof increment === 'string') {
            increment = this.dh.parseDuration(increment);
            return this.dh.as('ms', increment.magnitude, increment.unit);
        }
        return increment;
    }

    get dayStartHour() {
        return this.dayStartTime == null ? 0 : Math.floor(this.dayStartTime / MILLIS_PER_HOUR);
    }

    get dayEndHour() {
        return this.dayEndTime == null ? 24 : Math.ceil(this.dayEndTime / MILLIS_PER_HOUR);
    }

    get dayStartMs() {
        return this.dayStartTime == null ? 0 : this.dayStartTime;
    }

    get dayEndMs() {
        return this.dayEndTime == null ? 24 * MILLIS_PER_HOUR : this.dayEndTime;
    }

    /**
     * This is the increment in milliseconds from the floored day start hour to the configured day start time.
     *
     * This is used to calculate the offset by which to move the timeAxis ticks when the start is not on an hour boundary.
     * @member {Number}
     * @readonly
     * @internal
     */
    get dayStartOffset() {
        return (this.dayTime.startTimeOffsetMs / MILLIS_PER_HOUR) * this.hourHeight;
    }

    changeEventFilter(filter) {
        if (filter === undefined) {
            filter = event => !this.isInterDayEvent(event);
        }

        return filter;
    }

    changeEventHeight() {
        return 'auto';
        // We must not ingest an eventHeight.
        // Event heights are based on the duration in DayView.
        // Although it is a hidden config, it may be injected into the config by modeDefaults.
    }

    changeEventLayout(config, existing) {
        return DayLayout.reconfigure(existing, config, {
            owner    : this,
            defaults : {
                owner : this
            }
        });
    }

    updateCompactHeader(compactHeader) {
        if (!this.isConfiguring) {
            this._allDayEvents && (this._allDayEvents.compactHeader = compactHeader);
        }
    }

    updateHideEmptyDays(hideEmptyDays) {
        if (!this.isConfiguring) {
            this._allDayEvents && (this._allDayEvents.hideEmptyDays = hideEmptyDays);
        }
    }

    updateDateFilter(dateFilter) {
        if (!this.isConfiguring) {
            this._allDayEvents && (this._allDayEvents.dateFilter = dateFilter);
        }
    }

    updateNonWorkingDays(nonWorkingDays) {
        const me = this;

        super.updateNonWorkingDays?.(nonWorkingDays);

        me._allDayEvents && (me._allDayEvents.nonWorkingDays = nonWorkingDays);

        if (!me.isConfiguring) {
            me._cellMap?.clear();
            me.refresh();
        }
    }

    updateMaxAllDayHeight(maxAllDayHeight) {
        if (this.alldayRowElement) {
            DomHelper.setLength(this.alldayRowElement, 'max-height', maxAllDayHeight);
        }
    }

    get hideNonWorkingDays() {
        // Hiding non working days is only valid for multi day views
        return (this._hideNonWorkingDays === true && this.duration === 1) ? false : this._hideNonWorkingDays;
    }

    set hideNonWorkingDays(hideNonWorkingDays) {
        super.hideNonWorkingDays = hideNonWorkingDays;
    }

    updateHideNonWorkingDays(hideNonWorkingDays) {
        const
            me                = this,
            { _allDayEvents } = me;

        super.updateHideNonWorkingDays(hideNonWorkingDays);

        // Pass out *property* here, because if we're a single day view, hideNonWorkingDays
        // always yields false. Hiding non working days is only valid for multi day views
        _allDayEvents && (_allDayEvents.hideNonWorkingDays = me.duration === 1 && !_allDayEvents.fullWeek ? false : me._hideNonWorkingDays);

        if (!me.isConfiguring) {
            me._cellMap?.clear();
            me.refresh();
        }
    }

    updateSyncCalendarDate(syncCalendarDate) {
        if (!this.isConfiguring) {
            this._allDayEvents && (this._allDayEvents.syncCalendarDate = syncCalendarDate);
        }
    }

    syncHours() {
        const me = this;

        me._cellMap?.clear();

        DomSync.sync({
            targetElement : me.timeAxisElement,
            domConfig     : {
                onlyChildren : true,
                children     : me.getTimeElementConfigs()
            }
        });

        // We need to update and measure immediately, before the refresh
        me.updateElementLayout.now();

        me.refresh();
    }

    syncCurrentTimeIndicators() {
        const
            me   = this,
            now  = me.calendar?.dateTimeNow || new Date(),
            {
                dh,
                showCurrentTime,
                dayTime,
                currentTimeIndicatorRenderer
            }    = me,
            {
                style
            }    = me.element,
            // If we are showing the time, it only shows minute granularity, so the UI must match the displsyed time.
            // In this case, the vertical position which is based on --bi-current-time-seconds must snap to minute boundaries.
            // hourHeight zooming could reveal what look like inaccuracies.
            time = showCurrentTime?.showTime ? dh.round(now, { unit : 'minute', magnitude : 1 }) : now;

        style.setProperty('--bi-current-time', `"${dh.format(time, me.timeAxisTimeFormat)}"`);
        if (dayTime.contains(now)) {
            style.setProperty('--bi-current-time-seconds', dayTime.delta(time, 'second'));
        }
        // If the current time is outside of the visible day, we set the seconds to -3600 so that the
        // current time indicator is positioned 1 hour above the top of the view.
        else {
            style.setProperty('--bi-current-time-seconds', '-3600');
        }

        // Content and positioning come from the above CSS vars
        // All we have to do is ensure element presence or not.
        if (showCurrentTime && dh.betweenLesser(now, me.startDate, me.endDate) && dayTime.contains(now)) {
            const
                {
                    currentTimeElement,
                    timeAxisElement
                } = me;

            // Only need this element if we re showing the time
            if (showCurrentTime.showTime) {
                if (currentTimeElement.parentNode !== timeAxisElement) {
                    timeAxisElement?.insertBefore(currentTimeElement, timeAxisElement.firstChild);
                }
            }
            else {
                currentTimeElement.remove();
            }

            // We only append an element if there is an app-supplied renderer
            if (currentTimeIndicatorRenderer) {
                me.getDayElement(now)?.appendChild(me.currentTimeIndicator);
            }
        }
        else {
            me._currentTimeIndicator?.remove();
            me._currentTimeElement?.remove();
        }
    }

    updateShowCurrentTime(showCurrentTime) {
        const { dayContentElement } = this;

        dayContentElement.classList.toggle('b-custom-current-time', Boolean(this.currentTimeIndicatorRenderer));
        dayContentElement.classList.toggle('b-hide-current-time', !showCurrentTime);
        dayContentElement.classList.toggle('b-show-current-time', Boolean(showCurrentTime?.showTime));
        dayContentElement.classList.toggle('b-show-time-full-width', Boolean(showCurrentTime?.fullWidth));
        dayContentElement.classList.toggle('b-show-time-on-top', Boolean(showCurrentTime?.onTop));
        if (!this.isConfiguring) {
            this.syncCurrentTimeIndicators();
        }
    }

    get currentTimeIndicator() {
        const result = this._currentTimeIndicator || (this._currentTimeIndicator = DomHelper.createElement(this.callback(this.currentTimeIndicatorRenderer, this)));
        result.style.top = `var(--bi-current-time-position)`;
        return result;
    }

    get currentTimeElement() {
        return this._currentTimeElement || (this._currentTimeElement = DomHelper.createElement({
            retainElement : true,
            className     : 'b-time-axis-current-time',
            children      : [{
                className : 'b-current-time-text'
            }]
        }));
    }

    /**
     * Iterates the hours in the {@link #config-dayStartTime configured day}, starting from the configured start hour,
     * calling the passed callback.
     * @param {Function|String} fn A function or the name of a function in the ownershop hierarchy to call.
     * @param {Number} fn.hour The hour being visited.
     * @param {Date} fn.date A Date object encapsulating the hour being visited.
     * @param {Number} fn.i Zero based loop counter.
     * @param {Date} [contextDate] A Date object representing the day whose hours are to be visited.
     */
    eachHour(fn, contextDate = DEFAULT_EACH_HOUR_DATE) {
        const
            me              = this,
            { dh, dayTime } = me,
            { startHour }   = dayTime,
            hours           = dayTime.duration('h'),
            // Build the start-of-day date in view tz so wall-clock hour fields match the view.
            date            = dh.create({
                year  : dh.getFullYear(contextDate),
                month : dh.getMonth(contextDate),
                date  : dh.getDate(contextDate),
                hours : startHour
            });
        // Allow a callback *name* to be passed
        fn = me.resolveCallback(fn);

        for (let i = 0; i < hours; i++) {
            // Important to pass a copy of the Date so callback may mutate it
            fn.handler.call(fn.thisObj, dh.getHours(date), new Date(date), i);
            dh.add(date, 1, 'h', /* clone = */false);
        }
    }

    getTimeElementConfigs() {
        const
            me            = this,
            { dh }        = me,
            { startHour } = me.dayTime,
            result        = [];

        me.eachHour((hour, date, i) => {
            // Ticks come from the previous hour.
            // The hour value is the ending tick of the hour cell.
            // Note that `date` gets mutated by this call.
            const ticks = me.createLeafTicks(date);

            // Shoehorn the day start hour in, absolutely positioned at the top
            if (!i && me.showDayStartHour) {
                ticks.unshift({
                    className : 'b-day-view-time-axis-tick b-day-view-hour-tick b-day-view-start-hour',
                    // Build a synthetic date in view tz so the formatted hour matches startHour wall-clock.
                    text      : dh.format(dh.create({ year : 2000, month : 5, date : 15, hours : startHour }), me.timeAxisTimeFormat)
                });
            }

            // Move to the ending hour, mutating in place (clone=false) so the caller's date reference
            // stays valid (eachHour passes a fresh copy each iteration).
            dh.add(date, 1, 'h', /* clone = */false);
            dh.set(date, 'minutes', 0);
            hour = dh.getHours(date); // NOSONAR: We use the value we set into hour in the push below

            result.push({
                className : `b-day-view-time-axis-time b-day-view-time-axis-time-${String(hour).padStart(2, '0')}`,
                children  : ticks.concat([{
                    className : 'b-day-view-time-axis-tick b-day-view-hour-tick',
                    text      : dh.format(date, me.timeAxisTimeFormat)
                }])
            });
        });

        // TimeAxis can only show the core hours if they are the same for every day
        if (me.coreHours && me._simpleCoreHours) {
            result.unshift({
                className : 'b-day-view-time-axis-background',
                style     : {
                    backgroundImage : me.getCoreHoursGradient(me.coreHours)
                }
            });
        }

        return result;
    }

    createLeafTicks(date) {
        return this[this.sixMinuteTicks ? 'createSixMinuteTicks' : 'createFiveMinuteTicks'](date);
    }

    createFiveMinuteTicks(date) {
        const
            { dh } = this,
            result = [];

        for (let i = 1; i < 12; i++) {
            dh.set(date, 'minutes', i * 5);
            result.push({
                className : {
                    'b-day-view-time-axis-tick' : 1,
                    'b-day-view-tick-level-4'   : 1,          // Five minutes
                    'b-day-view-tick-level-3'   : !(i & 1),   // Ten minutes
                    'b-day-view-tick-level-2'   : !(i % 3),   // Fifteen minutes
                    'b-day-view-tick-level-1'   : i === 6     // Half hour
                },
                text : dh.format(date, this.timeAxisTimeFormat)
            });
        }
        return result;
    }

    createSixMinuteTicks(date) {
        const
            { dh } = this,
            result = [];

        for (let i = 1; i < 10; i++) {
            dh.set(date, 'minutes', i * 6);
            result.push({
                className : {
                    'b-day-view-time-axis-tick' : 1,
                    'b-day-view-tick-level-3'   : 1,          // Six minutes
                    'b-day-view-tick-level-2'   : !(i & 1),   // Twelve minutes
                    'b-day-view-tick-level-1'   : i === 5     // Half hour
                },
                text : dh.format(date, this.timeAxisTimeFormat)
            });
        }
        return result;
    }

    changeCoreHours(coreHours) {
        const me = this;

        // Same core hours for every day
        me._simpleCoreHours = ObjectHelper.isObject(coreHours) || (Array.isArray(coreHours) && coreHours.length !== 7);

        if (me._simpleCoreHours) {
            // In case we are sharing this via modeDefaults. We must own a copy
            coreHours = ObjectHelper.clone(coreHours);

            coreHours._overlayDay = coreHours.overlayDay;
            Object.defineProperty(coreHours, 'overlayDay', {
                set(v) {
                    this._overlayDay = v;
                    me.updateCoreHours();
                },
                get(v) {
                    return this._overlayDay;
                }
            });
        }

        return coreHours;
    }

    updateCoreHours() {
        if (!this.isConfiguring) {
            this.syncHours();
        }
    }

    changeScrollable() {
        // The hourHeight settings affect our scrollable, so we must fix the layout now
        this.refreshDayBackground();

        const result =  super.changeScrollable(...arguments);

        // Cache this to reset to if we zoom out far enough to revert from needing scrollbar to default
        this.configuredOverflowY = result?.overflowY;
        return result;
    }

    changeShowTime(showTime) {
        if (showTime === true) {
            return { startTime : true, endTime : false, duration : false };
        }
        if (typeof showTime?.duration === 'string') {
            const showTimeCallback = this.resolveCallback(showTime.duration, this, false);

            if (showTimeCallback) {
                showTime.duration = showTimeCallback.handler.bind(showTimeCallback.thisObj);
            }
        }
        return showTime;
    }

    updateShowTime() {
        if (!this.isConfiguring) {
            this.refresh();
        }
    }

    changeStartDate() {
        // Base class gets a chance to veto the change
        return this.dayOfDate(super.changeStartDate(...arguments));
    }

    updateRange(range) {
        !this.isConfiguring && this.allDayEvents && (this.allDayEvents.range = range);
        super.updateRange(...arguments);
    }

    updateShiftIncrement(shiftIncrement) {
        !this.isConfiguring && this.allDayEvents && (this.allDayEvents.shiftIncrement = shiftIncrement);
        super.updateShiftIncrement?.(...arguments);
    }

    updateStartDate(startDate) {
        const { _allDayEvents } = this;

        // Initial setting should not call the allDayEvents widget into existence early
        // so use the private property name.
        if (_allDayEvents) {
            const
                incomingEndDate = !this.range && this.peekConfig('endDate'),
                allDayConfig    = {};

            // DateRangeOwner refreshes on non-change of startDate, so only pass it through if it's different
            if (_allDayEvents.startDate - startDate) {
                allDayConfig.startDate = startDate;
            }
            // If we are also going to receive an endDate in a setConfig call
            // pass that through too.
            if (incomingEndDate) {
                allDayConfig.endDate = incomingEndDate;
            }

            // Keep all day row in time sync
            _allDayEvents.setConfig(allDayConfig);
        }

        super.updateStartDate(...arguments);
    }

    changeEndDate() {
        // Base class gets a chance to veto the change
        return this.dayOfDate(super.changeEndDate(...arguments));
    }

    updateEndDate(endDate) {
        super.updateEndDate?.(...arguments);

        // Keep all day row in time sync
        if (!this.updatingRange) {
            this._allDayEvents?.setConfig({
                date : this.date,
                endDate
            });
        }
    }

    changeMinDayWidth(minDayWidth) {
        // null must be returned to mean no minWidth because undefined signals no change.
        return typeof minDayWidth === 'number' ? Math.max(minDayWidth, 50) : typeof minDayWidth === 'string' ? minDayWidth : null;
    }

    updateMinDayWidth(minDayWidth) {
        this.element.style.setProperty('--bi-min-day-width', minDayWidth ? DomHelper.setLength(minDayWidth) : null);
        this._allDayEvents && (this._allDayEvents.minDayWidth = minDayWidth);
        this.updateElementLayout();
    }

    updateMinHourHeight(minHourHeight) {
        // Constrain the hourHeight unless there is an incoming version of hourHeight which will take precedence.
        // While fitting, the hourHeight getter already clamps to minHourHeight, so assigning here would only
        // overwrite the configured hourHeight which has to be restored when fitting is turned off.
        if (!this.peekConfig('hourHeight') && !this.fitHours) {
            this.hourHeight = Math.max(this.hourHeight || 0, minHourHeight);
        }
    }

    changeHourHeight(hourHeight) {
        if (hourHeight) {
            return Math.max(hourHeight, this.minHourHeight);
        }
    }

    updateHourHeight(hourHeight) {
        // Set up milestone height initially as half the hour Height, but at least 22px
        if (this.isConfiguring) {
            this.milestoneHeight = Math.max(Math.min(hourHeight / 2, this.shortEventHeight), 22);
        }
        this.milestoneDuration = 3600000 / (hourHeight / this.milestoneHeight);

        // What duration makes an event "short" depends upon the configured hourHeight.
        // Only auto-calculate if the user did not explicitly configure shortEventDuration.
        if (!('shortEventDuration' in this.initialConfig)) {
            this.shortEventDuration = 3600000 / (hourHeight / this.shortEventHeight);
        }

        if (!this.isConfiguring) {

            // All we need to do is recalculate our CSS properties and hour height class indicator
            this.updateElementLayout();

            // hourHeight changed, some events may change their shortEventCls state
            if (this.fitHours) {
                this.refresh();
            }
        }
    }

    updateShortEventHeight(shortEventHeight) {
        this.updateHourHeight(this.hourHeight);
    }

    updateMinEventHeight(minEventHeight) {
        this.contentElement.style.setProperty('--bi-day-view-min-event-height', DomHelper.setLength(minEventHeight));
    }

    get hourHeight() {
        // Order of the boolean expression is important:
        // We do not want to interrogate this.fitHours if we are configuring.
        return !this.isConfiguring && this.fitHours ? Math.max(this.dayContentClientHeight / this.getDayLength('hour'), this.minHourHeight) : this._hourHeight;
    }

    changeFitHours(fitHours) {
        const me = this;

        if (fitHours) {
            // fitHours may violate the minHourHeight setting
            // So cache it so we can restore it when fitHours is reset to false
            me.configuredMinHourHeight = me.minHourHeight;
        }
        // Restore minHourHeight to the configured value when fitHours is false
        else if (me.configuredMinHourHeight) {
            me.minHourHeight = me.configuredMinHourHeight;
        }
        return fitHours;
    }

    get dayContentClientHeight() {
        return DomHelper.floorPx(Rectangle.client(this.dayContentElement).height);
    }

    updateFitHours(fitHours) {
        const me = this;

        if (fitHours) {
            if (fitHours.minHeight) {
                // Set a hard minimum. Even a phone in portrait mode could show a schedule at 9px per hour
                me.minHourHeight = Math.max(fitHours.minHeight, 9);
            }
            else {
                // If they don't specify a minimum, we use 17.
                // Odd numbers are better. Avoids fractional pixels in background line generation.
                me.minHourHeight = 17;
            }
        }

        if (!me.isConfiguring) {
            // We only need to apply the fitted height if we are moving *to* fitting.
            fitHours && me.updateHourHeight(me.hourHeight);
            me.queueMicrotask('updateShortEventHeight');
        }
        me.toggleCls('b-fit-hours', fitHours);
        me.monitorResize = DomHelper.scrollBarWidth || fitHours;
    }

    changeEventSpacing(eventSpacing) {
        // Normalize the single-number form to the { top, bottom } object form.
        if (typeof eventSpacing === 'number') {
            eventSpacing = { top : 0, bottom : eventSpacing };
        }

        return eventSpacing;
    }

    updateEventSpacing(eventSpacing) {
        const { style } = this.element;

        // The --bi-event-spacing-top / --bi-event-spacing-bottom variables drive the
        // padding-block rule in DayView.css under .b-cal-event-wrap.
        style.setProperty('--bi-event-spacing-top',    DomHelper.setLength(eventSpacing.top));
        style.setProperty('--bi-event-spacing-bottom', DomHelper.setLength(eventSpacing.bottom));

        if (!this.isConfiguring) {
            this._cellMap?.clear();
            this.refresh();
        }
    }

    onInternalPaint({ firstPaint }) {
        const
            me = this,
            {
                dayContainerElement,
                horizontalScrollerElement
            }  = me,
            {
                scrollBarWidth
            }  = DomHelper;

        super.onInternalPaint?.(...arguments);

        if (firstPaint) {
            // This will be the first read of the allDayEvents property and will
            // trigger ingestion of allDayEvents and its upgrade into an instance of CalendarRow
            const { allDayEvents } = me;

            /**
             * A Scroller which encapsulates horizontal scrolling of the view in case a {@link #config-minDayWidth}
             * setting causes the days to overflow the available width.
             * @member {Core.helper.util.Scroller} horizontalScroller
             */
            me.horizontalScroller = new Scroller({
                widget            : me,
                element           : dayContainerElement,
                overflowX         : me.minDayWidth || permissiveSticky ? (scrollBarWidth ? 'clip' : true) : 'visible',
                overflowY         : 'clip',
                propagateSync     : true,
                internalListeners : {
                    overflowChange : 'updateElementLayout',
                    thisObj        : me
                }
            });

            me.dayHeaderScroller = new Scroller({
                _id           : `${me.id}-dayheader-scroller`,
                widget        : me,
                element       : me.dayHeaderScrollerElement,
                overflowX     : scrollBarWidth ? 'hidden-scroll' : true,
                overflowY     : 'clip',
                propagateSync : true
            });
            me.horizontalScroller.addPartner(me.dayHeaderScroller);

            if (allDayEvents) {
                allDayEvents.removeCls('b-day-view-initializing');
                me.horizontalScroller.addPartner(allDayEvents.headerScroller);
            }

            me._dayContainerResizeHandler = me.onDayContainerResize.bind(me);
            ResizeMonitor.addResizeListener(me.dayContainerElement, me._dayContainerResizeHandler);

            // We need the scroller even if the UI is overlay scrollbars.
            // Because the scrollbar needs to be docked at the bottom while content scrolls.
            me.scrollbarScroller = new Scroller({
                _id         : `${me.id}-scrollbar-scroller`,
                widget      : me,
                element     : horizontalScrollerElement.firstChild,
                scrollWidth : dayContainerElement.scrollWidth - scrollBarWidth,
                overflowX   : true,
                overflowY   : false
            });
            me.horizontalScroller.addPartner(me.scrollbarScroller);

            me.updateElementLayout.now();

            me.setInterval(me.syncCurrentTimeIndicators.bind(me), 15 * 1000, 'syncCurrentTimeIndicators');

            if (allDayEvents) {
                EventHelper.on({
                    click : {
                        element : me.cornerElement,
                        handler : 'onCornerClick'
                    },
                    // The scrollbar padding must not bubble any mousemove events to dragdrop.
                    // This is because a mouseover of the allDay row *may*, if there are no
                    // all day events, cause expansion of the allDay row, which *may* cause
                    // vertical overflow, which *may* on some platforms cause this padding element
                    // to pop into visibility below the cursor which would then cause
                    // a dragleave.
                    mousemove : {
                        element : me.allDayEvents.element.nextSibling,
                        handler : stopEvent,
                        capture : true
                    },
                    thisObj : me
                });

                // If, through window resizing, or changing hourHeight, the scrollbar status flips
                // we have to run the scrollbar syncing.
                me.scrollable.ion({
                    overflowChange : 'syncScrollbarPadding',
                    thisObj        : me
                });
            }
        }
    }

    afterInternalPaint({ firstPaint }) {
        super.afterInternalPaint?.(...arguments);
        if (firstPaint) {
            this.refresh();
        }
    }

    changeVisibleStartTime(visibleStartTime) {
        // Promote just a time passed to an options object with block : 'start', the longstanding default.
        if (visibleStartTime && !ObjectHelper.isObject(visibleStartTime)) {
            visibleStartTime = {
                time : visibleStartTime
            };
        }
        return visibleStartTime;
    }

    scrollToVisibleStartTime(waitForLoad = true) {
        if (this.visibleStartTime != null) {
            const
                me             = this,
                {
                    visibleStartTime
                }              = me,
                startScrollPos = me.getPositionFromTime(visibleStartTime.time);

            if (startScrollPos) {
                const
                    {
                        scrollable,
                        allDayEvents,
                        eventStore
                    } = me;

                // If at this startup phase, the scroll was not possible due to the clientHeight
                // being too high, it *may* become possible after the allDayEvents animates to
                // a new height because of its events, so wait a short time for that scenario
                // if we are showing events in an allDayEvents row. If not, we can scroll immediately.
                if (startScrollPos > scrollable.maxY && allDayEvents && me.showAllDayHeader !== false) {
                    // Only allocate the deferred scroll closure on this rare wait branch.
                    const doScroll = () => me.doScrollToVisibleStartTime?.(startScrollPos);

                    // If store has not been touched, wait for it to declare a refresh.
                    // If hasn't refreshed in 2 seconds, try to scroll anyway.
                    if (waitForLoad && !eventStore.storage.generation) {
                        eventStore.ion({
                            refresh : () => me.scrollToVisibleStartTime(false),
                            once    : true,
                            expires : {
                                delay : 2000,
                                alt   : doScroll
                            }
                        });
                    }
                    else {
                        me.scrollToStartTimer = me.allDayEvents.ion({
                            heightChange : doScroll,
                            once         : true,
                            expires      : {
                                delay : 500,
                                alt   : doScroll
                            }
                        });
                    }
                }
                else {
                    me.doScrollToVisibleStartTime(startScrollPos);
                }
            }
        }
    }

    doScrollToVisibleStartTime(startScrollPos) {
        const { scrollable, visibleStartTime } = this;

        // Method won't exist if the view was destroyed during the wait
        if (scrollable.scrollIntoView) {
            const
                { viewport } = scrollable,
                targetRect   = this.getPositionRect(startScrollPos, viewport);

            targetRect && scrollable.scrollIntoView(targetRect, {
                animate : false,
                block   : 'start',
                ...visibleStartTime,
                viewport,
                x       : false
            });
        }
    }

    relayAllDayEvents(event) {
        // Don't relay every type of event
        if (!blockedAllDayEvents[event.type]) {
            return this.trigger(event.eventName, event);
        }
    }

    async onCornerClick() {
        const { allDayEvents } = this;

        if (!allDayEvents.isAnimating) {
            await allDayEvents.toggleExpandCollapse();

            if (!this.isDestroyed) {
                this.allDayToggleIcon.setAttribute('aria-label', allDayEvents.expanded ? this.L('L{collapseAllDayRow}') : this.L('L{expandAllDayRow}'));
                this.allDayToggleIcon.setAttribute('aria-expanded', allDayEvents.expanded);
            }
        }
    }

    syncScrollbarPadding() {
        // configuredHiddenVerticalScroll means that we must not show a scrollbar, so none of this
        // must execute. ResourceView uses this and docks a fake scroller at its trailing edge.
        // We only have anything to sync if we have an allDayEvents widget.
        if (!this.configuredHiddenVerticalScroll && this.allDayEvents) {
            if (DomHelper.scrollBarWidth) {
                if (!this.allDayEvents.isAnimating) {
                    const
                        {
                            allDayEvents,
                            alldayRowElement,
                            dayHeaderElement,
                            scrollable
                        }                 = this,
                        fitHours          = this.fitHours && scrollable.clientHeight / this.getDayLength('hour') >= this.minHourHeight,

                        // fitHours means we'll never overflow
                        hasOverflow       = !fitHours && scrollable.hasOverflow(),
                        {
                            headerElement,
                            scrollable : verticalScroller
                        }                 = allDayEvents,
                        expanded          = allDayEvents.expanded || allDayEvents.autoHeight,
                        // Will only have overflow if it's expanded
                        allDayHasOverflow = Boolean(expanded && verticalScroller.hasOverflow());

                    // The day header's yScroll padding has to agree with either view's overflow
                    dayHeaderElement.classList[hasOverflow || allDayHasOverflow ? 'add' : 'remove']('b-show-yscroll-padding');

                    // Day view AND all day view both have vertical overflow.
                    // Only the all day view *header* has to fake one to match.
                    if (hasOverflow && allDayHasOverflow) {
                        headerElement.classList.add('b-show-yscroll-padding');
                        alldayRowElement.classList.remove('b-show-yscroll-padding');
                        scrollable.overflowY = verticalScroller.overflowY = 'auto';
                    }
                    // Both in different overflowY states.
                    else if (allDayHasOverflow !== hasOverflow) {
                        // ONLY the all day view overflows, so allday *header* must show padding
                        // and the day view must show a scrollbar
                        if (allDayHasOverflow) {
                            headerElement.classList.add('b-show-yscroll-padding');
                            verticalScroller.overflowY = 'auto';
                            scrollable.overflowY = 'scroll';
                        }
                        // ONLY the day view overflows, so that all day must show its scrollbar padding
                        // But the all day header must not.
                        else {
                            headerElement.classList.remove('b-show-yscroll-padding');
                            alldayRowElement.classList.add('b-show-yscroll-padding');
                            verticalScroller.overflowY = 'hidden';
                            scrollable.overflowY = !fitHours && 'auto';
                        }
                    }
                    // Neither of the two views overflow
                    else {
                        alldayRowElement.classList.remove('b-show-yscroll-padding');
                        headerElement.classList.remove('b-show-yscroll-padding');
                        scrollable.overflowY = !fitHours && 'auto';
                        verticalScroller.overflowY = 'hidden';
                    }
                }
            }
            // If scrollbars are overlayed when scrolling we can always have the two views scrollable
            else {
                this.scrollable.overflowY = this.allDayEvents.scrollable.overflowY = 'auto';
            }
        }
    }

    onInternalResize(element, width, height, oldWidth, oldHeight) {
        const { _allDayEvents : allDayEvents } = this;

        super.onInternalResize(element, width, height, oldWidth, oldHeight);

        // Don't update on the initial render resize from no dimensions.
        // That is handled by onInternalPaint({ firstPaint })
        if (oldHeight) {
            allDayEvents?.cellMap?.size && allDayEvents?.performResizeRefresh(allDayEvents.eventsPerCell, allDayEvents.eventContainerTop);

            if (height !== oldHeight) {
                this.updateElementLayout();
                this.syncScrollbarPadding();
            }
        }
    }

    // Global `theme` event handler, relayouts on stylesheet changes
    onDayViewThemeChange({ mode }) {
        // A light/dark switch only changes colours, so the layout is unchanged
        if (!mode) {
            this.updateElementLayout();
        }
    }

    // Only the day container *height* is of interest generally.
    // Unless we have had a minDayWidth set and we show scrollbars, in which case horizontal scrolling
    // may come and go and the horizontalScrollerElement which shows a scrollbar might need toggling.
    onDayContainerResize(el, { height : oldHeight } = {}, { height }) {
        if (oldHeight && (height !== oldHeight || (DomHelper.scrollBarWidth && this.minDayWidth))) {
            this.updateElementLayout();

            // Must recalculate the hour height if fitHours is set.
            if (this.fitHours) {
                this.updateFitHours(this.fitHours);
            }
        }
    }

    async updateElementLayout() {
        if (this.owner?.isDestroyed) {
            return;
        }

        const
            me                 = this,
            {
                dayHeaderContentElement,
                dayContainerElement,
                horizontalScrollerElement,
                dayHeaderScroller,
                horizontalScroller,
                scrollbarScroller,
                allDayEvents
            }                  = me,
            dayElements        = dayContainerElement.querySelectorAll('[data-date]'),
            { scrollBarWidth } = DomHelper;

        let i, end, clientWidth, scrollWidth;

        // Read DOM before invalidating it with writes
        // Must handle zero day views too, so check that we have day elements
        if (dayElements.length) {
            const r = Rectangle.from(dayElements[dayElements.length - 1], dayContainerElement);

            clientWidth = DomHelper.roundPx(Rectangle.client(dayContainerElement).width);
            scrollWidth = DomHelper.roundPx(me.rtl ? clientWidth - r.left : r.right - 1);
        }

        // AllDayEvents expander needs to know whether there's overflow
        if (allDayEvents && me.refreshCount) {
            const cornerElementClassList = me.cornerElement.classList;

            if (allDayEvents.hasOverflow) {
                cornerElementClassList.add('b-has-cell-overflow');
                cornerElementClassList.toggle('b-expanded', Boolean(allDayEvents.expanded));
            }
            else {
                cornerElementClassList.remove('b-has-cell-overflow');
            }
        }

        // Hour lines now. We are in an AF.
        me.refreshDayBackground.now();

        for (i = 0, end = dayElements.length - 1; i <= end; i++) {
            dayElements[i].classList.toggle('b-last-cell', i === end);
        }

        // Hide/show the pseudo horizontal scrollbar that we show on scrollbar displaying platforms.
        if (allDayEvents) {
            me.syncScrollbarPadding();
        }
        if (scrollBarWidth) {
            horizontalScrollerElement.classList.toggle('b-show-yscroll-padding', me.scrollable.hasOverflow());
        }

        // Handle DayViews with zero days. These can be used as standalone TimeAxes.
        // Horizontal scrollbar has to be present if there's overflow even if scrollbars overlayed
        // in this case they are position:absolute.
        if (dayElements.length) {
            // Forced synchronous layout here, but we need to ascertain horizontal overflow state
            if (scrollWidth > clientWidth) {
                horizontalScrollerElement.classList.remove('b-hide-display');
                dayHeaderScroller.scrollWidth = scrollWidth;
                dayHeaderContentElement.style.minWidth = `${scrollWidth}px`;
                scrollbarScroller.scrollWidth = scrollWidth;
                horizontalScroller.overflowX = 'hidden-scroll';
            }
            else {
                horizontalScrollerElement.classList.add('b-hide-display');
                dayHeaderScroller.scrollWidth = null;
                dayHeaderContentElement.style.minWidth = '';
                scrollbarScroller.scrollWidth = null;
                horizontalScroller.overflowX = permissiveSticky ? 'clip' : 'visible';
            }

            // If we have a visibleStartTime (It's lazily ingested), we must scroll to it after the
            // first element layout. scrollToVisibleStartTime ingests the visibleStartTime and
            // scrolls when possible.
            if (me.peekConfig('visibleStartTime')) {
                me.scrollToVisibleStartTime();
            }
        }

        if (me.hasPainted) {
            /**
             * Fires when this DayView changes an aspect of its layout. This happens when changing
             * {@link #property-hourHeight}, {@link #property-minDayWidth}, and when the available
             * day container height changes.
             * @event layoutUpdate
             * @param {Calendar.widget.DayView} source The triggering instance.
             */
            me.trigger('layoutUpdate');
        }
    }

    refreshDayBackground() {
        if (this.isDestroyed || !this.contentElement) {
            return;
        }

        const
            me                       = this,
            {
                contentElement,
                hourHeight,
                dayStartOffset,
                _hourHeightLevel,
                hourHeightLevel,
                dayStartShift
            }                        = me,
            dayChangeHour            = dayStartShift / MILLIS_PER_HOUR,
            dayContentCls            = new DomClassList(contentElement.classList),
            dayLength                = me.getDayLength('hour'),
            dayHeight                = hourHeight * dayLength,
            secondHeight             = hourHeight / (60 * 60),
            halfHourHeight           = (hourHeight - 2) / 2,
            fifteenMinuteHeight      = (hourHeight - 4) / 4,
            twelveMinuteHeight       = (hourHeight - 5) / 5,
            tenMinuteHeight          = (hourHeight - 6) / 6,
            sixMinuteHeight          = (hourHeight - 10) / 10,
            fiveMinuteHeight         = (hourHeight - 12) / 12,
            contentElementStyle      = contentElement.style,
            // Take the longest possible date and format it with the `timeAxisTimeFormat`, then estimate approximate space
            // required for the time.
            timeAxisWidth            = Math.ceil(me.dh.format(widestDate, me.timeAxisTimeFormat).length / 2);

        dayContentCls.remove('b-day-view-hour-height-level-1', 'b-day-view-hour-height-level-2', 'b-day-view-hour-height-level-3', 'b-day-view-hour-height-level-4');
        dayContentCls.toggle(`b-day-view-hour-height-level-${hourHeightLevel.level}`, Boolean(hourHeightLevel.level));

        dayContentCls.toggle('b-six-minute-ticks', Boolean(me.sixMinuteTicks));
        DomHelper.syncClassList(contentElement, dayContentCls);

        // The allDayRow needs to know this width
        me.element.style.setProperty('--bi-time-axis-width', `${timeAxisWidth}em`);
        contentElementStyle.setProperty('--bi-day-length', dayLength);

        // DayAgendaView hours accommodate the natural height of events, and may be hidden.
        // There *is no dayHeight* in that mode.
        if (!me.isDayAgendaView) {
            contentElementStyle.setProperty('--bi-day-height', `${dayHeight}px`);
        }
        contentElementStyle.setProperty('--bi-hour-height', `${hourHeight}px`);
        contentElementStyle.setProperty('--bi-half-hour-height', `${halfHourHeight}px`);
        contentElementStyle.setProperty('--bi-fifteen-minute-height', `${fifteenMinuteHeight}px`);
        contentElementStyle.setProperty('--bi-twelve-minute-height', `${twelveMinuteHeight}px`);
        contentElementStyle.setProperty('--bi-ten-minute-height', `${tenMinuteHeight}px`);
        contentElementStyle.setProperty('--bi-six-minute-height', `${sixMinuteHeight}px`);
        contentElementStyle.setProperty('--bi-five-minute-height', `${fiveMinuteHeight}px`);
        contentElementStyle.setProperty('--bi-leaf-tick-height', `${me.sixMinuteTicks ? sixMinuteHeight : fiveMinuteHeight}px`);
        contentElementStyle.setProperty('--bi-second-height', `${secondHeight}px`);
        contentElementStyle.setProperty('--bi-day-start-offset', `${dayStartOffset}px`);
        contentElementStyle.setProperty('--bi-short-event-height', `${DomHelper.setLength(me.shortEventHeight || '')}`);

        // Information about dayStartShift for use in CSS
        contentElementStyle.setProperty('--bi-day-change-hour', dayStartShift ? dayChangeHour : null);
        contentElementStyle.setProperty('--bi-day-change-offset', dayStartShift ? `${DomHelper.setLength(me.hourHeight * (24 - dayChangeHour) - 1)}` : null);

        // Allow subclasses to intervene
        me.onRefreshDayBackground?.();

        if (hourHeightLevel.level !== _hourHeightLevel?.level) {
            // If hour height changes, we need to update the rendered ticks
            if (me.tickRenderer) {
                me.doRefresh();
            }

            /**
             * Triggered when changing the {@link #property-hourHeight} causes an
             * {@link #config-hourHeightBreakpoints hour height breakpoint} to be crossed
             * and the displayed subTick intervals in the time axis change.
             *
             * @event tickChange
             * @param {Object} old The old hour height tick resolution object.
             * @param {Number} old.level The level `0` to `4` where `0` is the default with no
             * subTick times displayed, and `4` means every 5 minute time is displayed.
             * @param {String} old.step The time duration of visible subTicks. This is a string in the format
             * required by {@link Core.helper.DateHelper#function-parseDuration-static}
             * @param {Object} new The new hour height tick resolution object.
             * @param {Number} new.level The level `0` to `4` where `0` is the default with no
             * subTick times displayed, and `4` means every 5 minute time is displayed.
             * @param {String} new.step The time duration of visible subTicks. This is a string in the format
             * required by {@link Core.helper.DateHelper#function-parseDuration-static}
             */
            me.trigger('tickChange', {
                old : _hourHeightLevel || hourHeightLevelZero,
                new : hourHeightLevel
            });
        }
    }

    updateSixMinuteTicks(sixMinuteTicks) {
        if (!this.isConfiguring) {
            this.updateElementLayout();
        }
    }

    changeHourHeightBreakpoints(hourHeightBreakpoints) {
        // Convert from 5.2.x object format
        if (!Array.isArray(hourHeightBreakpoints)) {
            return Object.values(hourHeightBreakpoints);
        }

        return hourHeightBreakpoints;
    }

    updateHourHeightBreakpoints() {
        if (!this.isConfiguring) {
            this.updateElementLayout();
        }
    }

    get hourHeightLevel() {
        const
            me   = this,
            {
                hourHeight,
                hourHeightBreakpoints,
                sixMinuteTicks
            }     = me,
            steps = sixMinuteTicks ? sixMinuteSteps : fiveMinuteSteps;

        // Convert object format
        for (let i = sixMinuteTicks ? 2 : 3; i >= 0; i--) {
            if (hourHeight >= hourHeightBreakpoints[i]) {
                return me._hourHeightLevel = {
                    level : i + 1,
                    step  : steps[i]
                };
            }
        }
        return me._hourHeightLevel = hourHeightLevelZero;
    }

    updateLocalization() {
        if (!this.isConfiguring && this.allDayTextElement) {
            DomSync.sync({
                targetElement : this.allDayTextElement,
                domConfig     : {
                    text : this.L('L{EventEdit.All day}')
                }
            });
        }
        super.updateLocalization();
    }
}

DayView.initClass();
