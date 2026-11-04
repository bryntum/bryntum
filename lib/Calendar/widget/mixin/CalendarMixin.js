import Base from '../../../Core/Base.js';
import Config from '../../../Core/Config.js';
import Featureable from '../../../Core/mixin/Featureable.js';
import ArrayHelper from '../../../Core/helper/ArrayHelper.js';
import StringHelper from '../../../Core/helper/StringHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import EventHelper from '../../../Core/helper/EventHelper.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import Responsive from '../../../Core/widget/mixin/Responsive.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import DH from '../../../Core/helper/DateHelper.js';
import CalendarFeature from '../../feature/CalendarFeature.js';
import CalendarStores from '../../mixin/CalendarStores.js';
import SchedulerInterface from '../../mixin/SchedulerInterface.js';
import EventRenderer from './EventRenderer.js';
import AvatarRendering from '../../../Core/widget/util/AvatarRendering.js';
import Describable from '../../../Scheduler/view/mixin/Describable.js';

// This Mixin is the basis of the Calendar package, so it must load the default locale
import '../../localization/En.js';
import EventSorter from '../../util/EventSorter.js';
import Duration from '../../../Core/data/Duration.js';
import TimeZonable from '../../../Core/mixin/TimeZonable.js';

/**
 * @module Calendar/widget/mixin/CalendarMixin
 */

/**
 * Explicit times of day between which a move gesture is constrained. Either key may be omitted, leaving that end
 * unconstrained. Each accepts an hour number, such as `8`, or a 24 hour `'HH:MM'` string, such as `'08:30'`.
 * @typedef {Object} DayTimeConstraint
 * @property {Number|String} [startTime] Earliest time of day the dragged event may start at.
 * @property {Number|String} [endTime] Latest time of day the dragged event may end at.
 */

/**
 * The configuration of the drag zone which the {@link Calendar.feature.CalendarDrag} feature creates for one Calendar
 * view, as set through that view's {@link Calendar.widget.mixin.CalendarMixin#config-dragZoneConfig}.
 * @typedef {Object} DragZoneConfig
 * @property {Boolean|'visible'|DayTimeConstraint} [constrainToDayTime] Constrains the vertical, time axis part of a
 * move gesture, in the views which have a time axis. `true` keeps the event between the day's own boundaries so that
 * it can never become an inter day event; `'visible'` keeps it between the hours the view displays; an object
 * constrains it to explicit times of day.
 * @property {Boolean} [draggable] Set to `false` to stop events being drag-moved in this view.
 * @property {Boolean} [resizable] Set to `false` to stop events being drag-resized in this view.
 * @property {Boolean} [creatable] Set to `false` to stop events being drag-created in this view.
 * @property {String} [hoverEdges] The event edges which show a resize gripper on hover, one character per edge, for
 * example `'tb'` for top and bottom. An empty string shows none.
 */

const
    { eventNameMap }       = EventHelper,
    isFocusedCalendarMixin = w => w.isCalendarMixin && w.containsFocus,
    isAutoClose            = w => w.floating && w.autoClose;

/**
 * Mixin that provides the core shared functionality for all Calendar view widgets, including event rendering,
 * store management, feature support, keyboard navigation, and date-based scrolling. Any widget that participates
 * as a Calendar mode (such as DayView, WeekView, MonthView, YearView, AgendaView, and EventList) mixes in
 * this class to gain a consistent API for event display, hit-testing, resource avatar rendering, and
 * interaction with the parent {@link Calendar.view.Calendar}.
 *
 * This mixin also brings in the {@link Core.mixin.Featureable} mixin.
 *
 * All Calendar views share these common APIs from this mixin. For example:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     modes : {
 *         week : {
 *             // Configs from CalendarMixin available on all view types
 *             eventHeight : 22,
 *             autoCreate  : {
 *                 duration : '1 hour',
 *                 startHour : 9
 *             },
 *             eventRenderer({ eventRecord, renderData }) {
 *                 // Custom event rendering logic
 *                 renderData.cls['high-priority'] = eventRecord.priority === 1;
 *                 return eventRecord.name;
 *             }
 *         }
 *     }
 * });
 *
 * // Navigate the active view
 * calendar.activeView.next();
 * calendar.activeView.previous();
 *
 * // Scroll to a specific date
 * calendar.activeView.scrollTo(new Date(2024, 0, 15));
 * ```
 *
 * @mixin
 * @mixes Scheduler/view/mixin/Describable
 * @mixes Calendar/widget/mixin/EventRenderer
 */
export default Target => class CalendarMixin extends (Target || Base).mixin(
    Describable,
    SchedulerInterface,
    Featureable,
    CalendarStores,
    EventRenderer,
    Responsive,
    TimeZonable
) {
    static $name = 'CalendarMixin';

    /**
     * Milliseconds after a click during which another click on the same element is ignored
     * @member {Number} clickBlockTime
     * @static
     * @internal
     */
    static clickBlockTime = 300;

    // <debug>
    // region Localization test
    static localization = [
        'L{allDayEventCount}'
    ];
    // endregion
    // </debug>

    static configurable = {
        //region Hidden configs

        /**
         * @hideevents eventSelectionChange
         */
        /**
         * @hideconfigs htmlCls, autoUpdateRecord, record, textContent, content, html
         */
        /**
         * @hideproperties  content, html
         */

        //endregion

        /**
         * A String which describes how much the {@link #function-next} and {@link #function-previous}
         * methods will move this view forwards or backwards in time.
         *
         * This is used to create the tooltip hints for the `nextButton` and `prevButton` in the
         * {@link Calendar.view.Calendar#property-tbar Calendar's toolbar}. If this property
         * is not defined, the `nextButton` and `prevButton` will be disabled when this view is active.
         *
         * Note that {@link Calendar.widget.WeekView} and {@link Calendar.widget.YearView} use a localized
         * string property to yield this value. Other view types implement a `get stepUnit` getter because
         * their step increments are variable.
         * @member {String} stepUnit
         * @readonly
         */
        /**
         * The {@link Calendar.model.ProjectModel project} which owns the data this view renders. It is propagated
         * from the owning {@link Calendar.view.Calendar}, so all of its views share one project.
         *
         * This is how a renderer reaches project level settings, for example the
         * {@link Calendar.model.ProjectModel#config-timeZone time zone}:
         *
         * ```javascript
         * eventHeaderRenderer({ view, eventRecord }) {
         *     const { timeZone } = view.project;
         *     // ...
         * }
         * ```
         * @member {Calendar.model.ProjectModel} project
         * @readonly
         */
        /**
         * A function that provides the textual description for this view. If provided, this function overrides the
         * {@link #config-descriptionFormat}.
         *
         * ```javascript
         *  descriptionRenderer() {
         *      const
         *          {
         *              startDate,
         *              endDate
         *          }         = this,
         *          sameMonth = startDate.getMonth() === endDate.getMonth(),
         *          sd        = DateHelper.format(startDate, sameMonth ? 'DD{->}' : 'DD/MM/YYY{ -> }'),
         *          ed        = DateHelper.format(endDate, 'DD/MM/YYY');
         *
         *     return `${sd}${ed}, ${this.L('L{eventCount}', this.eventCount)}`
         * }
         * ```
         * @config {Function} descriptionRenderer
         * @param {CalendarView} view The active view in case the function is in another scope.
         * @returns {String} Description string
         */

        /**
         * Configure this as `false` to disable drag-creating events in this view.
         * @prp {Boolean} allowDragCreate
         */
        /**
         * Configure this as `false` to disable drag-moving events in this view.
         * @prp {Boolean} allowDragMove
         */
        /**
         * Configure this as `false` to disable drag-resizing events in this view.
         * @prp {Boolean} allowDragResize
         */

        localizableProperties : [
            'autoCreate.newName', 'timeFormat', 'shortDateFormat', 'shortDateTimeFormat'
        ],

        // Calendar view layouts must not be changed by attribute mutation
        contentElMutationObserver : null,

        eventStore : null,

        resourceStore : null,

        /**
         * The configuration of the drag *zone* which the {@link Calendar.feature.CalendarDrag} feature creates for
         * this view.
         *
         * The feature creates one zone per view, and each zone is configured from the view it belongs to, so this
         * config tunes dragging in this view alone and leaves every other mode of the Calendar untouched. It is how
         * one Calendar can allow one kind of dragging in its day view and another in its month view.
         *
         * | Option               | Type                    | Description                                       |
         * |----------------------|-------------------------|---------------------------------------------------|
         * | `constrainToDayTime` | `Boolean`, `String` or `Object` | Constrain a move gesture to a span of the day |
         * | `draggable`          | `Boolean`               | Pass `false` to stop events being drag-moved      |
         * | `resizable`          | `Boolean`               | Pass `false` to stop events being drag-resized    |
         * | `creatable`          | `Boolean`               | Pass `false` to stop events being drag-created    |
         * | `hoverEdges`         | `String`                | Event edges which show a resize gripper on hover  |
         *
         * ### constrainToDayTime
         *
         * Constrains the **vertical**, time axis part of a move gesture, so that the dragged event stays between two
         * times of day. The bound applies to the whole event: its start may not precede the lower bound, and its end
         * may not pass the upper one. It is consulted by move gestures only — resizing and drag-creating ignore it.
         *
         * It applies to the views which lay events out against a time axis — {@link Calendar.widget.DayView},
         * {@link Calendar.widget.WeekView} and {@link Calendar.widget.DayResourceView}.
         * {@link Calendar.widget.DayAgendaView} is a list rather than a time axis, so a drag there has no time of day
         * to constrain.
         *
         * Pass `true` to constrain the event to the day's own boundaries: the start of the day being dragged over,
         * and that boundary plus 24 hours. A non-zero {@link Calendar.widget.DayView#config-dayStartShift} moves both
         * boundaries with it. This is the "never becomes an inter day event" guarantee, and it is *not* the visible
         * range — on a view showing 08:00 to 18:00 it still permits a drag to 07:30.
         *
         * ```javascript
         * new Calendar({
         *     modes : {
         *         day : {
         *             dragZoneConfig : {
         *                 constrainToDayTime : true
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * Pass `'visible'` to constrain the event to the hours the view actually displays, between its
         * {@link Calendar.widget.DayView#config-dayStartTime} and {@link Calendar.widget.DayView#config-dayEndTime}.
         * Those are read as the gesture runs, so the bound follows any later reconfiguration of the view.
         *
         * ```javascript
         * dragZoneConfig : {
         *     constrainToDayTime : 'visible'
         * }
         * ```
         *
         * Pass an object to constrain the event to explicit times of day instead. `startTime` and `endTime` each
         * accept an hour number or a 24 hour `'HH:MM'` string, and either may be omitted to leave that end
         * unconstrained.
         *
         * ```javascript
         * dragZoneConfig : {
         *     constrainToDayTime : {
         *         startTime : 8,        // an hour number, or
         *         endTime   : '17:30'   // a 24 hour 'HH:MM' string
         *     }
         * }
         * ```
         *
         * If the event is longer than the constrained window, no start date can satisfy both bounds. The start bound
         * is honoured and the event's end overflows past the upper bound; the move is still committed.
         *
         * The **horizontal** axis is a separate matter, governed by
         * {@link Calendar.widget.DayView#property-interDayDrag}, which decides whether a gesture may leave the day
         * column it started in.
         *
         * ### draggable, resizable and creatable
         *
         * These switch off drag-moving, drag-resizing and drag-creating for this view alone. `hoverEdges` pairs with
         * them: it names the event edges which offer a resize gripper, one character per edge, so `'tb'` is top and
         * bottom and `''` shows none.
         *
         * ```javascript
         * dragZoneConfig : {
         *     // Events in this view may be moved, but not resized or created by dragging
         *     resizable  : false,
         *     creatable  : false,
         *     hoverEdges : ''
         * }
         * ```
         *
         * {@note}These three share their names with the {@link Calendar.feature.CalendarDrag} feature's own
         * {@link Calendar.feature.CalendarDrag#config-draggable},
         * {@link Calendar.feature.CalendarDrag#config-resizable} and
         * {@link Calendar.feature.CalendarDrag#config-creatable} configs, but act at a different scope. The feature's
         * configs apply to every view of the Calendar; the ones set here apply only to the view that declares them.
         * Use `features : { drag : { resizable : false } }` to turn resizing off everywhere, and
         * `dragZoneConfig : { resizable : false }` to turn it off in one view.
         *
         * The relationship is one way. A view may only further restrict what the feature already allows: where the
         * feature's config is `false`, setting the view's to `true` does not re-enable the gesture.{/@note}
         * @config {DragZoneConfig}
         */
        dragZoneConfig : null,

        /**
         * A function which compares events which some views use to decide upon rendering order.
         *
         * Default sorter function are provided from the {@link Calendar.util.EventSorter} class.
         *
         * A custom sort function may be configured.
         *
         * Note that the two objects to compare may either be {@link Scheduler.model.EventModel}s
         * or {@link EventBar}s which contain an `eventRecord` property which is the
         * {@link Scheduler.model.EventModel}.
         * @config {Function}
         * @param {Scheduler.model.EventModel|EventBar} lhs The left side value to conpare
         * @param {Scheduler.model.EventModel|EventBar} rhs The right side value to conpare
         * @returns {Number}
         */
        eventSorter : EventSorter.defaultSorterFn,

        responsive : {},  // brand as responsive so b-responsive-xxx CSS classes get added

        /**
         * Configure as `true` to hide {@link #config-nonWorkingDays}
         * @prp {Boolean}
         */
        hideNonWorkingDays : null,

        hideNonWorkingDaysCls : 'b-hide-non-working-days',

        /**
         * The week start day, 0 meaning Sunday, 6 meaning Saturday.
         * Defaults to {@link Core.helper.DateHelper#property-weekStartDay-static}.
         * @config {Number}
         */
        weekStartDay : DH.weekStartDay,

        /**
         * Non-working days as an object where keys are day indices, 0-6 (Sunday-Saturday), and the value is `true`.
         * Defaults to {@link Core.helper.DateHelper#property-nonWorkingDays-static}.
         * @prp {Object<Number,Boolean>}
         */
        nonWorkingDays : {
            value : DH.nonWorkingDays,

            $config : {
                merge : 'replace'
            }
        },

        /**
         * A Scheduler-compatible working time config object containing `fromDay` and `toDay`
         * properties which control which days of the week are visible.
         *
         * This allows a Calendar's `modeDefaults` to use the same `workingTime` format as
         * {@link Scheduler.view.Scheduler#config-workingTime} to configure visible weekdays
         * across all views uniformly.
         *
         * `fromDay` and `toDay` are inclusive day-of-week block indices (0 = Sunday,
         * 6 = Saturday). Days outside the `[fromDay, toDay]` range are added to
         * {@link #config-nonWorkingDays} and {@link #config-hideNonWorkingDays} is set to
         * `true` — unless those configs are already specified in the initial config.
         *
         * For example, `{ fromDay : 1, toDay : 5 }` shows Monday through Friday.
         *
         * The {@link Calendar.widget.DayView} subclass extends this config to also
         * accept `fromHour` and `toHour` properties which set the visible hour range.
         * @config {Object}
         * @property {Number} [workingTime.fromDay] Day index 0-6 (0 is Sunday)
         * @property {Number} [workingTime.toDay] Day index 0-6 (0 is Sunday)
         */
        workingTime : null,

        /**
         * The class name to add to calendar cells which are non working days.
         * @config {String}
         * @private
         */
        nonWorkingDayCls : 'b-non-working-day',

        /**
         * The class name to add to calendar cells.
         * @member {String} dayCellCls
         */
        /**
         * The class name to add to calendar cells.
         * @config {String}
         * @private
         */
        dayCellCls : 'b-calendar-cell',

        /**
         * The class name to add to calendar cells which are weekend days.
         * @config {String}
         * @private
         */
        weekendCls : 'b-weekend',

        todayCls : 'b-today',

        /**
         * The class name to add to events which have an end date in the past. Defaults to `'b-past-event'`.
         *
         * There are no CSS rules attached to this class. You may use it to style past events.
         * @prp {String}
         * @default
         */
        pastEventCls : 'b-past-event',

        /**
         * The class name to add to events which have duration less than or equal to
         * {@link #config-shortEventDuration}.
         * @config {String}
         */
        shortEventCls : 'b-short-event',

        /**
         * The duration threshold at or below which an event's encapsulating element gets
         * the {@link #config-shortEventCls} added to it so that small event bars can have
         * style rearrangements.
         *
         * In {@link Calendar.widget.DayView}s, short events have compressed layout so that
         * the event name is visible on the top line next to the start time.
         *
         * This may be a string in the format required by
         * {@link Core.helper.DateHelper#function-parseDuration-static}, or a millisecond value.
         *
         * **Note:** In a {@link Calendar.widget.DayView}, this config and
         * {@link Calendar.widget.DayView#config-shortEventHeight} are mutually exclusive.
         * Use `shortEventDuration` when you want a fixed time threshold (e.g. `'45 minutes'`),
         * or use `shortEventHeight` when you want the threshold to be derived automatically
         * from pixel height relative to `hourHeight`. Configuring `shortEventDuration`
         * explicitly prevents the auto-calculation from `shortEventHeight`.
         * @config {DurationConfig|Number|String}
         * @default
         */
        shortEventDuration : '30 minutes',

        /**
         * The height of event bars if this view creates event bars.
         *
         * {@link Calendar.widget.MonthView}, {@link Calendar.widget.CalendarRow}
         * (the {@link Calendar.widget.DayView#config-allDayEvents all day row} in a
         * {@link Calendar.widget.WeekView}) and {@link Calendar.widget.AgendaView}
         * use this config.
         *
         * In {@link Calendar.widget.DayView} and {@link Calendar.widget.WeekView},
         * the event element's height is part of the widget's layout and signifies the event's duration,
         * so these use a default value of `'auto'`.
         * @config {Number|String}
         * @default
         */
        eventHeight : 25,

        eventSpacing : 2,

        intradayCls : 'b-intraday',

        alldayCls : 'b-all-day',

        solidBarCls : 'b-solid-bar',

        dayNameSelector : '.b-day-name',    // MonthView widens this to be the whole cell header
        // if it's showing a separate week number column.
        // CalendarRow always widens this to the cell header.

        showTime : false,

        /**
         * A {@link Core.helper.DateHelper} format string/function used to format the time displayed in events
         *
         * @config {String|Function}
         * @param {Date} date The date to format.
         * @returns {String} The formatted date.
         * @default 'LT'
         */
        timeFormat : {
            value   : 'LT',
            $config : {
                localeKey : 'L{timeFormat}'
            }
        },

        /**
         * This specifies whether to show a circular "bullet" icon if there is no
         * {@link Scheduler.model.EventModel#field-iconCls} defined for an event.
         *
         * By default, events which are rendered as solid blocks of colour (such as all day events) do __not__
         * show the bullet icon.
         *
         * By default, events which do not show as a colour block show the bullet icon as a means of showing
         * the event's defined `eventColor`.
         *
         * This property may contain two properties which define whether to show the bullet icon for both
         * event types.
         *
         * If configured as `true`, all event bars will show a bullet icon if they do not have an
         * {@link Scheduler.model.EventModel#field-iconCls}
         * @config {Boolean|Object}
         * @param {Boolean} [bar] This is `false` by default. Set this to `true` in modes where a solid event
         * bar should show a bullet icon
         * @param {Boolean} [noBar] This is `true` by default. Events with no background colour, use this to
         * show the event's defined `eventColor`
         * @default
         */
        showBullet : {
            bar   : false,
            noBar : true
        },

        eventColourStyleProperty : 'color', // By default the event color becomes the colour
        // DayView uses backgroundColor

        handlePointerInteraction : true,

        /**
         * A {@link Core.helper.DateHelper} format string/function to use to create date output for
         * abbreviated view descriptions.
         * @prp {String|Function}
         * @param {Date} date The date to format.
         * @returns {String} The formatted date.
         * @default 'll'
         */
        shortDateFormat : {
            value   : 'll',
            $config : {
                localeKey : 'L{shortDateFormat}'
            }
        },

        /**
         * A title text used by the Calendar's mode selector button. If not specified, the mode name is used.
         * @config {String}
         */
        title : null,

        /**
         * A {@link Core.helper.DateHelper} format string/function to use to create date and time output for
         * abbreviated view descriptions.
         * @prp {String|Function}
         * @param {Date} date The date to format.
         * @returns {String} The formatted date.
         * @default 'll LT'
         */
        shortDateTimeFormat : {
            value   : 'll LT',
            $config : {
                localeKey : 'L{shortDateTimeFormat}'
            }
        },

        /**
         * Configure as `true` to make the view read-only, by disabling any UIs for modifying data.
         *
         * For example, the {@link Calendar.feature.EventEdit event editor} will be set to read-only and will
         * not allow changes to be made. And the {@link Calendar.feature.EventMenu} will not show options which can
         * mutate the events.
         *
         * __Note that checks MUST always also be applied at the server side.__
         * @prp {Boolean}
         */
        readOnly : null,

        /**
         * If this config is set, then the `gesture` configured (which defaults to `dblclick`) creates a
         * new event at the mouse or touch event's time point.
         *
         * The exact time is rounded to the closest specified `step` value. This value is also used
         * for the {@link Core.widget.TimeField#property-step} value in the {@link Calendar.feature.EventEdit}'s
         * time input field.
         *
         * The duration of the created event is the specified `duration` value.
         *
         * If this is specified as `true`, the `gesture` becomes `dblclick`, and the other properties
         * are the default values listed below.
         *
         * If this is specified as a string, the string becomes the `gesture`, and the other properties
         * are the default values listed below.
         *
         * @prp {Boolean|String|Object}
         * @property {String} [gesture='dblclick'] The DOM event name which initiates event creation at the event's position.
         * @property {Function|String} [newName='New Event'] The name of an event created using `autoCreate` or a function to call which yields the name.
         * When a function is specified, the following parameters are passed:
         * - <span class="name">view : <span class="type">CalendarMixin</span></span><div class="description">The view in which the event is being created.</div>
         * - <span class="name">startDate : <span class="type">String</span></span><div class="description">The start date of the event being created.</div>
         * - <span class="name">resourceRecord : <span class="type">ResourceModel</span></span><div class="description">The resource of the event being created.</div>
         * @property {String} [step='15 minutes'] The time unit by which to snap the start click point of auto created events.
         * __Only for views which have a granularity of less than one day such as `WeekView` and `DayView`__.
         *
         * For views which show whole days, the start defaults to 8am.
         *
         * This is a string in the format required by {@link Core.helper.DateHelper#function-parseDuration-static}.
         *
         * This value is also used for the {@link Core.widget.TimeField#property-step} value in the
         * {@link Calendar.feature.EventEdit}'s time input field.
         *
         * @property {'round'|'ceil'|'floor'} [snapType='round'] How to snap a precise gesture time to a boundary specified by the `step` property.
         * __Only for views which have a granularity of less than one day such as `WeekView` and `DayView`__.
         * @property {String} [duration='1 hour'] The default start hour for auto created events in the form accepted by {@link Core.helper.DateHelper#function-parseDuration-static}
         * @property {Number} [startHour=8] The default start hour for auto created events
         * in views where the time granularity is one day. In a `DayView` or `WeekView` where a mouse event position
         * will translate to a time of day, this is not used.
         *
         * This is the hour of the day to start the event at. It may be fractional.
         * @accepts {Object|String|Boolean}
         * @default
         */
        autoCreate : {
            gesture   : 'dblclick',
            newName   : 'L{Object.newEvent}',
            step      : '15 minutes',
            snapType  : 'round',
            duration  : '1 hour',
            startHour : 8
        },

        /**
         * The {@link Scheduler.model.EventModel#field-durationUnit} to use when drag-creating events
         * in this view.
         *
         * For {@link Calendar.widget.DayView}s, this is normally `'hour'`, for views with a granularity
         * level of one day, the default is `'day'`.
         *
         * Configure this as `null` to have drag-create use the unit of the `duration` property of
         * the {@link #config-autoCreate} config as the duration unit when drag-creating events.
         * @prp {String}
         */
        dragUnit : 'hour',

        autoRefresh : {
            $config : {
                merge : 'classList'
            },

            value : null
        },

        /**
         * Set to `false` if you don't want to allow events overlapping times for any one resource (defaults to true).
         * @config {Boolean}
         * @default
         * @private
         */
        allowOverlap : true,

        /**
         * The converse of {@link #property-syncCalendarDate}
         *
         * When used as a {@link Calendar.view.Calendar#config-modes mode} of a Calendar, this
         * view's date will automatically be kept synced with the Calendar's
         * {@link Calendar.view.Calendar#property-date}. So this view will move to encapsulate
         * the Calendar's date.
         *
         * Configure this as `false` to opt out of this.
         *
         * __Note that this places the onus on the application developer to control the
         * viewed date range in this widget.__
         * @prp {Boolean} syncViewDate
         * @default
         */
        syncViewDate : true,

        /**
         * The converse of {@link #property-syncViewDate}
         *
         * When a date, or an event is clicked in a calendar view, the Calendar's {@link Calendar.view.Calendar#property-date}
         * is set to the clicked date to indicate that the user has expressed interest in that date.
         *
         * This is for convenience, so that when switching modes, by default, the time span encapsulating
         * the last date of interest is always shown.
         *
         * To disable syncing the calendar's date with this view's date, configure this property as `false`.
         *
         * This also prevents this view from being updated to the Calendar's date when this view becomes active.
         *
         * When this is `false`, the only way views will navigate in time is when the user clicks the "Next" or "Previous"
         * buttons in the {@link Calendar.view.Calendar#property-tbar Calendar's toolbar}, or when the user selects
         * a new date in the {@link Calendar.view.Calendar#property-datePicker} in the Calendar's toolbar.
         * @prp {Boolean} syncCalendarDate
         * @default
         */
        syncCalendarDate : true,

        // For views which are Panels, make them not include a tabIndex
        focusable : false,

        // Allow an AvatarRendering instance to be specified
        avatarRendering : {
            $config : 'lazy',
            value   : null
        },

        /**
         * Configure as `true` to show avatars of the assigned resources (calendars) at the
         * start of the event bar.
         *
         * Configure as `'last'` to show avatars of the assigned resources (calendars) at the
         * end of the event bar.
         *
         * Note that the avatars are `2.22em` diameter circles, and this may not be suitable
         * for rendering in short events inside a DayView.
         *
         * In a view which renders event bars, the {@link #config-eventHeight} should be
         * increased from the default to accommodate the extra information.
         *
         * Note that you must set {@link #config-resourceImagePath} in order that the system
         * knows where to access the resource's image file from.
         *
         * If no image is set, or the image is not found, the resource's initials are shown instead.
         *
         * By default it is inherited from the owning Calendar:
         * ```javascript
         * new Calendar({
         *     resourceImagePath   : 'images/resources/'
         *     modes : {
         *         month : {
         *             showResourceAvatars : true,
         *         },
         *         week : {
         *             // Images go at the end of the body with name first
         *             showResourceAvatars : 'last,
         *         }
         *     }
         * });
         * ```
         * @config {Boolean|String}
         * @default false
         */
        showResourceAvatars : null,

        /**
         * Path to load resource images from. Used by the {@link #config-showResourceAvatars} config
         * to create URLs using the resource's
         * {@link Scheduler/model/ResourceModel#field-image} or
         * {@link Scheduler/model/ResourceModel#field-imageUrl} fields:
         *
         * * `image` represents image name inside the specified `resourceImagePath`,
         * * `imageUrl` represents fully qualified image URL.
         *
         * **NOTE**: The path should end with a `/`:
         *
         * ```javascript
         * new Calendar({
         *     modeDefaults : {
         *         showResourceAvatars : true,
         *         resourceImagePath   : 'images/resources/'
         *     }
         * });
         * ```
         * @config {String}
         */
        resourceImagePath : null,

        /**
         * The minimum date to which the `startDate` of this view may be navigated.
         * @member {Date} minDate
         */
        /**
         * The minimum date to which the `startDate` of this view may be navigated.
         * @config {Date|String}
         */
        minDate : null,

        /**
         * The maximum date to which the `endDate` of this view may be navigated.
         * @member {Date} maxDate
         */
        /**
         * The maximum date to which the `endDate` of this view may be navigated.
         * @config {Date|String}
         */
        maxDate : null,

        /**
         * By default, when navigating through time, the next time
         * block will be animated in from the appropriate direction.
         *
         * Configure this as `false` to disable this.
         * @prp {Boolean} animateTimeShift
         * @default
         */
        animateTimeShift : true,



        /**
         * Options to add into scroll options when the {@link #function-scrollTo} method is called.
         *
         * By defult, scrolling is animated.
         *
         * To make the scrolling animate with easing and highlight the target element, configure the view with
         *
         * ```javascript
         * {
         *     defaultScrollOptions : {
         *         highlight : true,
         *         animate   : {
         *             duration : 750,
         *             easing   : 'bounce'
         *         }
         *     }
         * }
         * ```
         *
         * @prp {BryntumScrollOptions} defaultScrollOptions
         * @default
         */
        defaultScrollOptions : { animate : true },

        /**
         * A button configuration object to use for the automatically created mode selector button for this mode.
         * @config {ButtonConfig}
         */
        selectorButton : null,

        /**
         * A menu item configuration object to use for the automatically created mode selector menu item for this mode.
         * @config {MenuItemConfig}
         */
        selectorMenuItem : null,

        testConfig : {
            animateTimeShift : false
        },

        /**
         * By default, the end date of an all day event is displayed in the UI as
         * the last calendar date on which the event falls. For most end users, this is the
         * expected value.
         *
         * Technically, the {@link Scheduler.model.EventModel#field-endDate} is a timestamp
         * which represents the exact point in time at which an event ends. To use this instead,
         * configure `extendAllDayEndDay` as `true`.
         *
         * To be clear, this would mean that an {@link Scheduler.model.EventModel#field-allDay}
         * event starting and ending on the 7th of February 2020, would show the end date in the
         * tooltip as 8th of February 2020.
         * @prp {Boolean}
         * @default false
         */
        extendAllDayEndDay : null,

        /**
         * A key to use to activate this view.
         *
         * This is optional and defaults to the first letter of the {@link #config-title} property.
         *
         * The title defaults to the mode name, so by default, the activation key is the first letter of the mode name.
         * @config {String} [activationKey]
         */
        activationKey : null,

        keyMap : {
            'Ctrl+z'       : 'undoRedoDataChange',
            'Shift+Ctrl+z' : 'undoRedoDataChange'
        }
    };

    static get delayable() {
        return {
            refreshSoon : {
                type              : 'raf',
                cancelOutstanding : true
            }
        };
    }

    static get featureable() {
        return {
            factory : CalendarFeature
        };
    }

    construct(config) {
        const me = this;

        super.construct(config);

        // Not tabbable, but conducts focus.
        // We have not implemented Calendar Cell navigation which is external
        // to event-to-event navigation, so YearView does not receive focus yet.
        // Only add tabIndex if we don't already have it
        if (!me.isYearView && me.element.tabIndex !== -1 && me.contentElement?.tabIndex !== -1) {
            (me.contentElement || me.element).tabIndex = -1;
        }

        // Pull any the AvatarRendering instance through
        me.getConfig('avatarRendering');

        EventHelper.on({
            element : me.element,
            keydown : 'onCalendarKeyDown',
            thisObj : me
        });

        if (me.handlePointerInteraction) {
            EventHelper.on({
                element   : me.element,
                mouseover : 'onEventMouseOverOut',
                mouseout  : 'onEventMouseOverOut',

                mousedown : 'onCalendarPointerInteraction',
                mouseup   : 'onCalendarPointerInteraction',

                // Block subsequent clicks before clickBlockTime has elapsed
                click : {
                    handler : 'onCalendarPointerInteraction',
                    block   : me.constructor.clickBlockTime
                },

                dblclick    : 'onCalendarPointerInteraction',
                contextmenu : 'onCalendarPointerInteraction',
                thisObj     : me
            });

            EventHelper.on({
                element    : me.element,
                mouseenter : 'onEventMouseEnterLeave',
                mouseleave : 'onEventMouseEnterLeave',
                capture    : true,
                thisObj    : me
            });
        }
    }

    /**
     * Focuses the cell which encapsulates the passed date if possible.
     *
     * If a `resource` is passed, the element for that resource *within* the day cell is focused
     * rather than the cell's own focusable link.
     *
     * If the requested date cell cannot be found, the first focusable element in the view is focused.
     * @param {Date} [date=this.date] The date of the cell to focus
     * @param {Boolean} [focusVisible] Pass `true` to render the focus ring. Normally sampled from
     * whether focus was already visible before the date change.
     * @param {Scheduler.model.ResourceModel} [resource] Focus this resource's element inside the day cell.
     * @internal
     */
    focusDate(date = this.date, focusVisible, resource) {
        const
            me      = this,
            element = me.eventContentElement || me.contentElement;

        date = me.ingestDate(date);

        // Ask the view for the day cell for calendar date
        let dayCell = me.getDayElement?.(date);

        // If the cell itself is not focusable, try to find a focusable link inside
        if (dayCell && !DomHelper.isFocusable(dayCell)) {
            if (resource) {
                dayCell = dayCell.querySelector(`[data-resource-id="${CSS.escape(resource.id)}"]`);
            }
            else {
                dayCell = dayCell.querySelector('[role="link"]');
            }
        }

        // If could not find a date-specific focusable cell, find the first focusable element in the view
        if (!dayCell || !DomHelper.isFocusable(dayCell)) {
            dayCell = [...element.querySelectorAll('*')].find(DomHelper.isFocusable);
        }

        // Focus the first day cell if possible. Fall back.
        // Fallback is just asking the view to focus itself.
        (dayCell || me).focus({
            preventScroll : true,
            // Focus should be visible if focus is already visible.
            focusVisible  : focusVisible
        });
    }



    onConfigChange(info) {
        if (!this.isConfiguring && info.applied === 2 && this.autoRefresh?.[info.name]) {
            this.refreshSoon();
        }

        super.onConfigChange(info);
    }

    changeAvatarRendering(avatarRendering) {
        return AvatarRendering.new({
            element : this.element
        }, avatarRendering);
    }

    updateShowResourceAvatars(showResourceAvatars) {
        if (showResourceAvatars) {
            // We need the AvatarRendering utility if we are showing avatars.
            this.avatarRendering || (this.avatarRendering = true);
        }
        this.refresh();
    }

    getResourceAvatar(resourceRecord) {
        return this.avatarRendering.getResourceAvatar({
            resourceRecord,
            imageUrl : resourceRecord.image === false ? null : (resourceRecord.imageUrl || resourceRecord.image && (this.resourceImagePath + resourceRecord.image)),
            color    : resourceRecord.eventColor,
            initials : resourceRecord.initials,
            dataset  : {
                btip       : StringHelper.encodeHtml(resourceRecord.name),
                resourceId : resourceRecord.id
            }
        });
    }

    updateEventSpacing(eventSpacing) {
        this.element.style.setProperty('--bi-event-spacing', DomHelper.setLength(eventSpacing));
    }

    updateEventHeight(eventHeight) {
        const { style } = this.element;

        // Force a recalculate on next access
        this._eventHeightInPixels = null;

        // Capture the value that is set by the app, so that we can refer to it when
        // adjusting eventHeight due to breakpoints in MonthView.
        if (!this.isAdaptingEventHeight) {
            this.configuredEventHeight = eventHeight;
        }

        style.setProperty('--bi-event-height', DomHelper.setLength(eventHeight));
        style.setProperty('--bi-arrow-width', 'calc(var(--bi-event-height) / 3)');
        style.setProperty('--bi-arrow-margin', 'calc(var(--bi-event-height) / -3)');

        // Schedule a refresh
        if (!this.isConfiguring) {
            this.refreshSoon();
        }
    }

    /**
     * Returns the pixel value of the {@link #config-eventHeight} in case it was configured as a
     * CSS measurement in other units.
     * @member {Number}
     * @readonly
     * @private
     */
    get eventHeightInPixels() {
        const me = this;

        // Some views, like DayView don't have a defined event height.
        if (me.eventHeight !== 'auto') {
            if (!me._eventHeightInPixels) {
                // Measure the configured height.
                // Value is cached until eventHeight is changed again.
                me._eventHeightInPixels = me.measureEventHeight(me.eventHeight);
            }
        }

        return me._eventHeightInPixels;
    }

    get configuredEventHeightInPixels() {
        const { configuredEventHeight } = this;

        return typeof configuredEventHeight === 'number' ?
            configuredEventHeight :
            this.measureEventHeight(configuredEventHeight);
    }

    measureEventHeight(height) {
        if (typeof height === 'string') {
            const eventBarContainer = this.contentElement.querySelector(`.${this.eventBarContainerCls}`);

            // Need to be in the DOM to measure
            if (eventBarContainer) {
                eventBarContainer.appendChild(this.measuringEventDom);
                height = DomHelper.measureSize(height, this.measuringEventDom, false);
                this.measuringEventDom.remove();
            }
        }
        return height;
    }

    // A hidden event element used to measure event heights when eventHeight is not a pixel value
    // This is added to an eventBarContainer when needed to measure, and then removed.
    get measuringEventDom() {
        if (!this._measuringEventDom) {
            this._measuringEventDom = DomHelper.createElement(this.createEventDomConfig({
                eventRecord : new this.eventStore.modelClass({
                    startDate    : new Date(),
                    fullDuration : '1h'
                })
            }, null));
        }
        return this._measuringEventDom;
    }

    /**
     * This property yields the base selector to use to find visible cell elements in this view.
     *
     * It's based upon the {@link #property-dayCellCls}, but also takes into account the
     * {@link #config-hideNonWorkingDays} setting.
     *
     * If this is a MonthView, it also takes into account the
     * {@link Calendar.widget.MonthView#config-hideOtherMonthCells} setting.
     * @member {String}
     * @readonly
     */
    get visibleCellSelector() {
        const excludes = [];

        if (this.hideOtherMonthCells) {
            excludes.push(`.${this.otherMonthCls}`);
        }
        if (this.hideNonWorkingDays) {
            excludes.push(`.${this.nonWorkingDayCls}`);
        }
        return `.${this.dayCellCls}${excludes.length ? `:not(${excludes.join(',')})` : ''}`;
    }

    /**
     * This property yields this widget. This is to enable Calendar Features to be able to attach
     * to standalone Calendar widgets as their owning client, and to access a currently active view
     * in a standard way.
     * @member {CalendarView}
     * @readonly
     * @internal
     */
    get activeView() {
        return this;
    }

    /**
     * This property yields this widget. This is to enable Calendar Features to be able to attach
     * to standalone Calendar widgets as their owning client, and to access a currently active view
     * in a standard way.
     * @member {CalendarView}
     * @readonly
     * @internal
     */
    get activeSubView() {
        const
            // If we're a multi-CalendarWidget view (Such as a ResourceView), narrow down activeView
            // to the active subView which contains focus.
            activeSubView = this.items?.filter(isFocusedCalendarMixin)?.[0];

        return activeSubView || this;
    }

    /**
     * Calendar mode that this view represents (eg. "day", "month" etc). Only accessible when used within a Calendar.
     * @member {String} modeName
     * @readonly
     */

    /**
     * This function allows a Calendar widget to act as a Feature host by exposing the same interface
     * as a {@link Calendar.view.Calendar}. It executes the passed function on this widget.
     * @internal
     * @param {Function} fn The function to call.
     * @param {Object[]} [args] The arguments to pass. Defaults to this view.
     * @param {Object} [thisObj] The `this` reference for the function. Defaults to this view.
     */
    eachView(fn, args, thisObj = null) {
        this.callback(fn, thisObj || this, args || [this]);
    }

    get focusElement() {
        const { calendar } = this;

        if (calendar) {
            const { navigator } = calendar;

            return navigator.activeItem || navigator.previousActiveItem || this.element.querySelector(navigator.itemSelector) || super.focusElement;
        }
    }

    captureFocusItem(activeElement) {
        const
            activeEvent = this.getEventRecord(activeElement),
            base        = super.captureFocusItem(activeElement);

        return (scrollIntoView = true) => {
            const newEl = activeEvent && this.getEventElement(activeEvent);

            if (newEl) {
                scrollIntoView ? newEl.focus() : newEl.focus({ preventScroll : true });
            }
            else {
                base?.(scrollIntoView);
            }
        };
    }

    /**
     * Refreshes the UI after a change to the EventStore, or to a configuration that requires
     * the UI to change.
     *
     * Only updates the UI if this widget is visible. If it is not visible, the refresh is
     * deferred until it next becomes visible.
     */
    refresh() {
        // If we're being called programmatically, cancel upcoming delayed refreshes.
        this.refreshSoon.cancel();

        this.month && this.element.style.setProperty('--bi-week-length', this.month.weekLength);

        // Only refresh immediately if we are visible.
        this.whenVisible('refreshNow');
    }

    refreshNow() {
        const
            me          = this,
            refocus     = me.captureFocus(),
            { element } = me,
            keepFocus   = me.up(isAutoClose) && me.eventContentElement.matches(':focus-within');

        me.toCallWhenVisible?.delete('refreshNow');

        // If we're being called programmatically, cancel upcoming delayed refreshes.
        me.refreshSoon.cancel();

        // If we are inside a floating, autoClose widget, losing focus will cause the widget to close,
        // so we need to focus ourself before refreshing.
        if (keepFocus) {
            element.tabIndex = -1;
            element.focus();
        }
        me.doRefresh();

        refocus();
        if (keepFocus) {
            element.removeAttribute('tabIndex');
        }
    }

    /**
     * Executes the passed callback after the next refresh, but waits only for a maximum number of
     * milliseconds before optionally performing a refresh and executing the callback.
     *
     * When awaited, the function resolves after the refresh or timeout and after any callback have been executed
     * and the Promise yields `true` if a refresh has been performed.
     *
     * @param {String|Function} [callback] A function or the name of a function in the ownership hierarchy
     * to run after the next refresh operation. May be omitted, and `options` passed as the sole parameter.
     * @param {Object} [options] How long to wait and what to do on timeout.
     * @param {Number} [options.delay=100] The number of milliseconds to wait for a refresh.
     * @param {Boolean} [options.forceRefresh=false] If the refresh does not happen within the timer, call refresh.
     * @async
     * @internal
     */
    afterRefresh(callback, options = { delay : 100, forceRefresh : false }) {
        const me = this;

        if (typeof callback === 'object') {
            options  = callback;
            callback = null;
        }
        else if (callback) {
            callback = me.resolveCallback(callback, me);
            callback = callback.handler.bind(callback.thisObj);
        }
        if (typeof options === 'number') {
            options = { delay : options };
        }

        return new Promise(resolve => {
            me.ion({
                // expires uses the event name or `name` as the timeout id
                // so in order to be unique, we need to give this a name
                name    : me.constructor.generateId('refresh-expiry-timer-'),
                refresh : () => {
                    callback?.();
                    resolve(true);
                },
                once    : true,
                expires : {
                    delay : options.delay || 100,
                    alt   : () => {
                        if (options.forceRefresh) {
                            me._cellMap?.clear();
                            me.refresh();
                        }
                        callback?.();
                        resolve(options.forceRefresh);
                    }
                }
            });
        });
    }

    get displayName() {
        return StringHelper.capitalize(this._displayName || this.title || this.type);
    }

    // True if each resource gets its own sub view or column, so a multi assigned event is rendered once per resource
    get laysOutResources() {
        return false;
    }

    get hasNonWorkingDays() {
        // A single day DayView cannot hide non working days.
        return Boolean(Object.values(this.nonWorkingDays || Base.emptyObject).some(n => n)) && !(this.isDayView && this.duration === 1);
    }

    /**
     * This property yields the {@link #property-nonWorkingDays} which are hidden in this view if and only if this view
     * is configured to {@link #property-hideNonWorkingDays}. Otherwise it returns an empty object.
     * @member {Object<number, Boolean>}
     * @readonly
     */
    get hiddenNonWorkingDays() {
        return this.hideNonWorkingDays ? (this.nonWorkingDays || this.month.nonWorkingDays) : Base.emptyObject;
    }

    changeAutoCreate(autoCreate) {
        if (autoCreate) {
            const type = typeof autoCreate;

            if (type !== 'object') {
                autoCreate = {
                    gesture : type === 'string' ? autoCreate : 'dblclick'
                };
            }
            autoCreate = Config.merge(autoCreate, CalendarMixin.$meta.config.autoCreate);
            autoCreate.durationUnit = Duration.from(autoCreate.duration).unit;
        }
        return autoCreate;
    }

    updateDateSeparator() {
        this.refreshCalendarDescription();
    }

    updateDescriptionFormat() {
        this.refreshCalendarDescription();
    }

    refreshCalendarDescription() {
        const { calendar } = this;

        if (calendar?.isPainted && calendar.activeView === this) {
            calendar.updateViewDescription();
        }
    }

    changeShortEventDuration(shortEventDuration) {
        return isNaN(shortEventDuration) ? this.dateHelper.as('ms', shortEventDuration) : Number(shortEventDuration);
    }

    updateShortEventDuration() {
        if (!this.isConfiguring) {
            // This happens during zoom, so delay a little.
            // Events may gain/lose the shortEventCls class.
            this.setTimeout({
                fn                : 'whenVisible',
                delay             : 200,
                cancelOutstanding : true,
                args              : ['refreshNow']
            });
        }
    }

    updateLocalization() {
        // If user configured calendar with specific config, then prefer it to the localized value
        if (!('weekStartDay' in this.initialConfig)) {
            this.weekStartDay = DH.weekStartDay;
        }

        // Default non-working days come from the locale, but if the user has configured either
        // the nonWorkingDays or the workingTime config, then we assume they are taking control of
        // that aspect of the configuration and do not apply localized defaults.
        if (!('nonWorkingDays' in this.initialConfig || this.initialConfig.workingTime?.fromDay != null)) {
            this.nonWorkingDays = DH.nonWorkingDays;
        }

        super.updateLocalization();

        this.refreshCalendarDescription();
    }

    updateAutoCreate(autoCreate) {
        // The autocreate.newEvent property must be processed
        this.updateLocalization();
    }

    updateWeekStartDay(weekStartDay) {
        const { refreshCount, month } = this;

        super.updateWeekStartDay?.(weekStartDay);

        // This can be called from changeMonth during initialization of the Month object
        // and at that time, obviously the property will not be present.
        if (month) {
            month.weekStartDay = weekStartDay;
        }

        if (this.isPainted && this.refreshCount === refreshCount) {
            this.refresh();
        }
    }

    changeNonWorkingDays(nonWorkingDays) {
        const
            me     = this,
            result = new Proxy(ObjectHelper.assign({}, nonWorkingDays), {
                set(target) {
                    const result = Reflect.set(...arguments);
                    me.updateNonWorkingDays(target);
                    return result;
                },
                deleteProperty(target) {
                    const result = Reflect.deleteProperty(...arguments);
                    me.updateNonWorkingDays(target);
                    return result;
                }
            });

        return result;
    }

    updateNonWorkingDays(nonWorkingDays) {
        const { refreshCount, month } = this;

        super.updateNonWorkingDays?.(nonWorkingDays);

        // This can be called from changeMonth during initialization of the Month object
        // and at that time, obviously the property will not be present.
        if (month) {
            month.nonWorkingDays = nonWorkingDays;
        }

        if (this.isPainted && this.refreshCount === refreshCount) {
            this.refresh();
        }
    }

    updateWorkingTime(workingTime) {
        if (workingTime) {
            // fromDay/toDay: inclusive block indices — mark days outside the
            // [fromDay, toDay] range as non-working and hide them
            if (workingTime.fromDay != null || workingTime.toDay != null) {
                const
                    fromDay = workingTime.fromDay ?? 0,
                    toDay   = workingTime.toDay ?? 6;

                if (!('nonWorkingDays' in this.initialConfig)) {
                    const nonWorkingDays = {};

                    for (let d = 0; d < 7; d++) {
                        if (d < fromDay || d > toDay) {
                            nonWorkingDays[d] = true;
                        }
                    }
                    this.nonWorkingDays = nonWorkingDays;
                }
                if (!('hideNonWorkingDays' in this.initialConfig)) {
                    this.hideNonWorkingDays = true;
                }
            }
        }
    }

    dayOfDate(date) {
        return this.dateHelper.clearTime(date);
    }

    onTimeZoneChange(event) {
        const
            me    = this,
            oldDh = event?.oldDateHelper;

        // Our day-orienting dates were ingested in a previous day frame. Resync from the owning Calendar's date
        // (authoritative, already in the new frame); standalone views re-ingest their own date via the old day key.
        let refreshScheduled;

        if (oldDh && !me.isConfiguring) {
            const
                date = me.calendar?._date || (me._date && me.dateHelper.parseKey(oldDh.makeKey(me._date))),
                { _startDate, _date } = me;

            if (date) {
                // Range-driven views (no explicit endDate) must realign their range start too
                if (_startDate && !me.hasConfig('endDate')) {
                    me.startDate = date;
                }
                me.date = date;

                // A changed date/startDate schedules its own refresh
                refreshScheduled = me._startDate !== _startDate || me._date !== _date;
            }
        }

        !refreshScheduled && super.onTimeZoneChange?.(event);
    }

    ingestDate(date) {
        date = typeof date === 'string' ? this.dateHelper.parse(date) : new Date(date);

        if (isNaN(date)) {
            throw new Error('Calendar widget date ingestion must be passed a Date, or a YYYY-MM-DD date string');
        }

        return this.dayOfDate(date);
    }

    changeDate(date, oldDate) {
        const
            me                  = this,
            { isEventList, dh } = me,
            incomingDate        = me.ingestDate(date),
            // For EventLists, when we are using a startDate->endDate range as opposed to a fixed
            // range, the dates are *inclusive*, so pick the correct date containment function.
            dateContainmentFn   = isEventList && !me.range ? 'betweenLesserEqual' : 'betweenLesser';

        // Coerce the ingested date to be within minDate/maxDate bounds
        date = me.constrainTargetDate(incomingDate);

        // changeDate is used to simply convert a date by passing only the first arg.
        if (arguments.length === 1) {
            return date;
        }

        // Don't fire the beforeDateChange event for a no-change.
        if (!oldDate || (date - oldDate)) {
            /**
             * Triggered before a view's orientating date changes.
             *
             * return `false` from an event handler to veto the temporal navigation.
             * @preventable
             * @event beforeChangeDate
             * @param {Date} oldDate The current orientating date of this view.
             * @param {Date} date The new date to which this view is to be orientated.
             */
            if (me.trigger('beforeDateChange', { date, oldDate }) !== false) {
                const dateDiff = dh.diff(incomingDate, date, 'd');

                // If the result has been constrained (by the minDate/maxDate settings), and this view
                // already encapsulate the date, then we do not need to navigate, so change silently and
                // veto the postprocessing of the change.
                if (dateDiff && dh[dateContainmentFn](date, me.startDate, me.endDate)) {
                    // If we're a ListView, further constrain the date to be one of
                    // the *occupied* cell dates, first or last depending on where we were constrained
                    if (isEventList && me.rowManager.rowCount) {
                        // Constrained backwards, go to last row, constrained forwards go to first row
                        const
                            row             = me[dateDiff < 0 ? 'lastFullyVisibleRow' : 'firstFullyVisibleRow'],
                            constrainedDate = row && me.getDateFromElement(row.cells[0]);

                        if (constrainedDate) {
                            date = constrainedDate;
                        }
                    }
                    me._date = date;
                }
                else {
                    return date;
                }
            }
        }
    }

    constrainTargetDate(date, end) {
        const
            me      = this,
            minDate = me.minDate || me.calendar?.minDate,
            maxDate = me.maxDate || me.calendar?.maxDate;

        if (!me.isInCoerceTargetDate && (!isNaN(minDate) || !isNaN(maxDate))) {
            // flag so that changers don't ask for validation.
            me.isInCoerceTargetDate = true;

            // We need to call changer here so that subclasses can snap to their range start.
            // But the base changer above must not ask for validation.
            const newDate = end ? me[`change${StringHelper.capitalize(end)}Date`](date, null) : date;

            me.isInCoerceTargetDate = false;

            // Coerce invalid navigation to before minDate.
            if (!isNaN(minDate) && newDate < minDate) {
                return minDate;
            }
            // Veto navigation to after maxDate.
            if (!isNaN(maxDate) && newDate > maxDate) {
                return maxDate;
            }
        }

        return date;
    }

    changeStartDate(startDate) {
        // Subclass may already have vetoed the change
        if (startDate) {
            // Coerce the ingested date to be within minDate/maxDate bounds
            return this.ingestDate(startDate);
        }
    }

    changeEndDate(endDate) {
        // Subclass may already have vetoed the change
        if (endDate) {
            // Coerce the ingested date to be within minDate/maxDate bounds
            return this.ingestDate(endDate);
        }
    }

    /**
     * Moves this view's date range to encompass the passed event if it does not already, and returns the element
     * which renders it. This is synchronous, so that scrolls which need the element can all be started together.
     * @param {Scheduler.model.EventModel} eventRecord The event to bring into range.
     * @returns {HTMLElement} The event's element, if it is rendered.
     * @internal
     */
    bringEventIntoRange(eventRecord) {
        const me = this;

        if (!me.dh.intersectSpans(me.startDate, me.endDate, eventRecord.startDate, eventRecord.endDate)) {
            me.date = eventRecord.startDate;
        }

        let element = me.getEventElement(eventRecord);

        if (!element) {
            me.refresh();
            element = me.getEventElement(eventRecord);
        }

        return element;
    }

    /**
     * Brings an event or a time into view. Optionally visually highlights the target.
     *
     * __This may change the date range encompassed by this view to bring the date or event into its
     * ownership__.
     *
     * Scrolling may or may not be required, depending on the type and size constraints of the view.
     *
     * Base scrolling options are added from the {@link #config-defaultScrollOptions} config.
     *
     * @param {Scheduler.model.EventModel|Date} target The event or Date to scroll to.
     * @param {Object} [options] How to scroll.
     * @param {'start'|'end'|'center'|'nearest'} [options.block] How far to scroll the target.
     * @param {Number} [options.edgeOffset] edgeOffset A margin around the target to bring into view.
     * @param {Object|Boolean|Number} [options.animate] Set to `true` to animate the scroll by 300ms,
     * or the number of milliseconds to animate over, or an animation config object.
     * @param {Number} [options.animate.duration] The number of milliseconds to animate over.
     * @param {String} [options.animate.easing] The name of an easing function.
     * @param {Boolean|Function} [options.highlight] Set to `true` to highlight the resulting element
     * when it is in view. May be a function which is called passing the resulting element
     * to provide customized highlighting.
     * @param {Boolean} [options.focus] Set to `true` to focus the element when it is in view.
     * @param {Boolean} [options.x] Pass as `false` to disable scrolling in the `X` axis.
     * @param {Boolean} [options.y] Pass as `false` to disable scrolling in the `Y` axis.
     * @returns {Promise} A promise which is resolved when the target has been scrolled into view.
     */
    async scrollTo(target, options) {
        const
            me                 = this,
            { scrollable, dh } = me;

        if (me.scrollPromise) {
            await me.scrollPromise;
            me.scrollPromise = null;
        }

        options = ObjectHelper.assign({}, me.defaultScrollOptions, typeof options == 'boolean' ? { animate : options } : options);

        // Scrolling to an event. Make sure it's in our date range first
        if (target.isEvent) {
            target = me.bringEventIntoRange(target);
        }
        // The only other option is scrolling to a Date
        else {
            target = me.ingestDate(target);

            // If we do not own the date, move to that date.
            if (!dh.betweenLesser(target, me.startDate, me.endDate) || !me.getDayElement(target, true)) {
                me.date = target;
            }

            target = me.getDayElement(target);
        }

        if (target == null) {
            return;
        }

        const { xDelta, yDelta } = scrollable?.getDeltaTo(target, options) ?? Base.emptyObject;

        // If there is scrolling to be done, scroll the target into view
        if (xDelta || yDelta) {
            // Ensure that scrollPromise is nulled when it resolves
            me.scrollPromise = scrollable.scrollIntoView(target, options).then(() => me.scrollPromise = null);
        }
        // Otherwise, we are responsible for any highlight
        else if (options.highlight) {
            if (typeof options.highlight === 'boolean') {
                DomHelper.highlight(Rectangle.from(target));
            }
            else {
                me.callback(options.highlight, me, [target, me]);
            }
        }

        return me.scrollPromise;
    }

    async checkAutoCreateGesture(domEvent, date, resourceRecord) {
        const
            me                 = this,
            { autoCreate, dh } = me;

        // If the gesture is on a known date, and we are visible, and not readOnly and it's an autoCreate.gesture...
        if (date && domEvent.type === autoCreate?.gesture?.toLowerCase()  && !me.readOnly && me.isVisible) {
            const
                dateStart   = dh.startOf(date, undefined, undefined, me.weekStartDay),
                startHourMS = isNaN(autoCreate.startHour) ? dh.getTimeOfDay(dh.parse(autoCreate.startHour, 'HH:mm:ss')) : autoCreate.startHour * 1000 * 60 * 60,
                startDate   = me.isDayView ? dh[autoCreate.snapType](date, autoCreate.step) : dh.add(dateStart, startHourMS);

            /**
             * This event fires whenever the {@link #config-autoCreate autoCreate gesture} is detected
             * and also when a {@link Calendar.feature.CalendarDrag drag-create} gesture is detected.
             *
             * This event is preventable and may be used to validate UI-initiated event creation.
             * @event beforeAutoCreate
             * @preventable
             * @param {Event} domEvent The DOM event which initiated the creation.
             * @param {Date} date *DEPRECATED in favour of `startDate`.* The starting time of the event to be created. If this is in a
             * `DayView`, this will be snapped according to the specification in {@link #config-autoCreate}
             * @param {Date} startDate The starting time of the event to be created. If this is in a
             * `DayView`, this will be snapped according to the specification in {@link #config-autoCreate}
             * @param {Date} endDate The ending time of the event to be created.
             * @param {Scheduler.model.ResourceModel} resourceRecord The resource if the UI includes a resource.
             * @param {CalendarView} view This view.
             */
            if (
                me.trigger('beforeAutoCreate', {
                    view    : me,
                    domEvent,
                    date    : startDate,
                    startDate,
                    endDate : dh.add(startDate, Duration.from(autoCreate.duration)),
                    resourceRecord
                }) !== false
            ) {
                return me.createEvent(date, resourceRecord, true);
            }
        }
    }

    /**
     * Creates an event on the specified date which conforms to this view's {@link #config-autoCreate}
     * setting.
     *
     * This method may be called programmatically by application code if the `autoCreate` setting
     * is `false`, in which case the default values for `autoCreate` will be used.
     *
     * If the {@link Calendar.feature.EventEdit} feature is active, the new event
     * will be displayed in the event editor.
     * @param {Date} date The date to add the event at. If there's no time component, the
     * {@link #config-autoCreate}'s `startHour` will be used.
     */
    createEvent(date, resourceRecord, isAutoCreate) {
        const handler = this.calendar || this.owner?.calendar || this;

        // If contained by a Calendar the Calendar may have opinions about which view
        // to pass to doCreateEvent as the editing view.
        handler.doCreateEvent(date, resourceRecord, this, isAutoCreate);
    }

    async doCreateEvent(date, resourceRecord, editingView = this, isAutoCreate = false) {

        resourceRecord = resourceRecord ?? this.defaultCalendar;

        const
            me                = this,
            { isDayView, dh } = (me.viewType || me),
            // We are either a mode or a CalendarRow
            calendar          = me.calendar || me.owner?.calendar,
            // Some views may be created with a chained EventStore.
            // We must use the Calendar's EventStore.
            eventStore        = calendar?.eventStore || me.eventStore,
            autoCreate        = editingView.autoCreate || editingView.changeAutoCreate(true),
            { modelClass }    = eventStore,
            { newName }       = autoCreate;

        // Default date to current date and inject the autoCreate's start time
        if (date == null || !isDayView && isAutoCreate) {
            const
                { dayStartHour, dayEndHour } = me.activeView,
                // Here we need to pick startHour which should be between active view dayStartHour and dayEndHour
                // 1. Pick autoCreate.startHour as startHour if it is greater then me.activeView.dayStartHour
                // and less than me.activeView.dayEndHour
                // 2. Pick me.activeView.dayStartHour as startHour if autoCreate.startHour is not within the current
                // active view range.
                startHour                    = Math.min(Math.max(autoCreate.startHour, dayStartHour),  dayEndHour),
                pickedValue                  = startHour === dayEndHour ? dayStartHour : startHour,
                startHourMS                  = (isNaN(pickedValue) ? isNaN(autoCreate.startHour) ? dh.getTimeOfDay(dh.parse(autoCreate.startHour, 'HH:mm:ss')) : autoCreate.startHour * 3600000 : pickedValue * 3600000);

            date = dh.add(date || me.date, startHourMS);
        }

        const
            d                 = dh.parseDuration(autoCreate.duration),
            dateStart         = new Date(date.getTime() + (me.dayStartShift || 0)),

            // If this view has high definition time granularity (isa DayView), then round the precise date
            // passed to this view's autoCreate.step and snapType.
            // Otherwise default to dateStart which is adjusted at the start of method.
            startDate         = isDayView ? dh[autoCreate.snapType](date, autoCreate.step) : dateStart,

            // In a DayView dblclick create, constrain the ending so that it does not cross our day end.
            // Otherwise a dblclick after 11:08 (depending on autoCreate.step and snapType) will create an event of 1 hour
            // starting at 23:15 which will jump into the all day row
            duration          = isDayView && isAutoCreate ? {
                magnitude : me.dayTime.startShift
                    ? Math.min(d.magnitude, dh.diff(startDate, dh.add(me.dayTime.startOfDay(date), me.dayTime.duration(), 'ms'), d.unit))
                    : Math.min(d.magnitude, dh.diff(startDate, dh.add(dh.startOf(date), me.dayTime.timeEnd), d.unit)),
                unit : d.unit
            } : d,
            endDate           = dh.add(startDate, duration.magnitude, duration.unit),
            name              = me.resolveCallback(newName, me, false) ? me.callback(newName, me, [me, startDate, resourceRecord]) : newName,
            recordData        = {
                [modelClass.getFieldDataSource('name')]         : name,
                [modelClass.getFieldDataSource('startDate')]    : startDate,
                [modelClass.getFieldDataSource('endDate')]      : endDate,
                [modelClass.getFieldDataSource('duration')]     : duration.magnitude,
                [modelClass.getFieldDataSource('durationUnit')] : duration.unit,

                // If the view's settings resulted in a midnight to midnight event, flag it as allDay
                allDay : dh.diff(startDate, endDate, 'day') === 1
            },
            // For EventLists, when we are using a startDate->endDate range as opposed to a fixed
            // range, the dates are *inclusive*, so pick the correct date containment function.
            dateContainmentFn = editingView.isEventList && !editingView.range ? 'betweenLesserEqual' : 'betweenLesser',
            newRecord = eventStore.createRecord(recordData);

        // If an editor is available, mark the event as non-persistable while it is being edited
        if (calendar?.features.eventEdit && !calendar.features.eventEdit.disabled) {
            newRecord.isCreating = true;
        }

        if (resourceRecord) {
            eventStore.assignmentStore.assignEventToResource(newRecord, resourceRecord);
        }

        await eventStore.addAsync(newRecord);

        // If the date we are being asked to create at is in view, edit the event when
        // the view has rendered it.
        if (dh[dateContainmentFn](startDate, editingView.startDate, editingView.endDate)) {
            if (editingView.getEventElement(newRecord, startDate)) {
                editingView.editAutoCreatedEvent(newRecord);
            }
            else {
                editingView.ion({
                    refresh({ source }) {
                        // Conditionally call. May have been destroyed
                        source.editAutoCreatedEvent?.(newRecord);
                    },
                    once    : true,
                    prio    : -10000,
                    buffer  : 100,
                    expires : 500
                });
            }
        }
    }

    editAutoCreatedEvent(eventRecord) {
        /**
         * Fired when an {@link #config-autoCreate} gesture has created a new event
         * and added it to the event store.
         *
         * If the {@link Calendar.feature.EventEdit} feature is present, it listens for
         * this event and initiates an edit operation. Adding a high `prio` listener which
         * returns `false` can prevent this event from reaching the `eventEdit` processing.
         * @event eventAutoCreated
         * @param {CalendarView} source This Calendar view instance.
         * @param {Scheduler.model.EventModel} eventRecord The new event record.
         */
        this.trigger('eventAutoCreated', {
            eventRecord
        });
    }

    /**
     * The duration in total days that this view covers.
     * @member {Number}
     * @readonly
     */
    get duration() {
        // All views have a startDate and endDate property, so duration can be calculated.
        // The endDate is "exclusive" because it means 00:00:00 of that day.
        return this.endDate ? this.calculateDuration(this.startDate, this.endDate) : 1;
    }

    calculateDuration(startDate, endDate) {
        // This is overridden in WeekView to enforce the correct duration.
        // This enables updaters to "calculate" the duration and therefore share code.
        return this.dateHelper.diff(startDate, endDate, 'day');
    }

    /**
     * Moves this view forwards in time by its configured (or intrinsic if it's a
     * {@link Calendar.widget.WeekView} or a {@link Calendar.widget.YearView}) duration.
     */
    next() {
        this.date = this.dateHelper.add(this.date, this.duration, 'day');
    }

    /**
     * Moves this view backwards in time by its configured (or intrinsic if it's a
     * {@link Calendar.widget.WeekView} or a {@link Calendar.widget.YearView}) duration.
     */
    previous() {
        this.date = this.dateHelper.add(this.date, -this.duration, 'day');
    }

    get eventContentElement() {
        return this.contentElement;
    }

    /**
     * The number of __visible__&nbsp;events that this view currently displays in its date range.
     *
     * Filtered out events are not incuded in the count.
     *
     * Events from {@link Calendar.widget.DayView#config-dateFilter filtered out dates} are not included in the count.
     *
     * Events which are in {@link #config-hideNonWorkingDays hidden non-working days} are
     * __not__&nbsp;included in the count.
     *
     * This value may be used when creating a view description string.
     * @member {Number}
     * @readonly
     */
    get eventCount() {
        const
            me = this,
            {
                dateFilter,
                hiddenNonWorkingDays
            }  = me;

        // If we encapsulate subviews, total them all using this property
        if (me.views) {
            return me.views.reduce((r, c) => r += c.eventCount || 0, 0);
        }
        // Built-in views all have a cellMap.
        if (me.cellMap) {
            // Extract events from our cellMap.
            // DayViews own an allDayEvents child view which also has a cellMap.
            return [...me.cellMap.values(), ...(me.allDayEvents?.cellMap.values() || [])].reduce((r, c) => {
                // Events in filtered out dates and hidden non-working days are omitted
                if ((!dateFilter ||  me.callback(dateFilter, me, [c])) && !hiddenNonWorkingDays[c.day]) {
                    r += c.events.length;
                }
                return r;
            }, 0);
        }
        // Fall back to extracting intersecting events from the eventStore
        return me.eventStore.getEvents({
            startDate : me.startDate,
            endDate   : me.endDate
        }).length;
    }

    /**
     * The first *visible* event-bearing element in this view. So if the first day defined in the
     * range is a Sunday, and {@link #config-hideNonWorkingDays} is set, then the first visible
     * cell will be for the Monday.
     * @member {HTMLElement}
     * @readonly
     */
    get firstVisibleCell() {
        return this.eventContentElement.querySelector(this.visibleCellSelector);
    }

    /**
     * The last *visible* event-bearing element in this view. So if the last day defined in the
     * range is a Sunday, and {@link #config-hideNonWorkingDays} is set, then the last visible
     * cell will be for the Friday.
     * @member {HTMLElement}
     * @readonly
     */
    get lastVisibleCell() {
        const visibleCells = this.contentElement.querySelectorAll(this.visibleCellSelector);

        return visibleCells[visibleCells.length - 1];
    }

    /**
     * The date of the first *visible* event-bearing element in this view. So if the first day defined
     * in the range is a Sunday, and {@link #config-hideNonWorkingDays} is set, then the first visible
     * date will be the date of the Monday.
     * @member {Date}
     * @readonly
     */
    get firstVisibleDate() {
        const
            me           = this,
            { dh }       = me,
            // Extracting the month index from our instance of the Month helper class
            { month }    = me.month;
        let date         = new Date(me.startDate),
            { duration } = me;

        while (duration && ((me.hideOtherMonthCells && dh.getMonth(date) !== month) || me.hiddenNonWorkingDays[dh.getDay(date)])) {
            date = dh.add(date, 1, 'd');
            duration--;
        }

        return date;
    }

    /**
     * The date of the last *visible* event-bearing element in this view. So if the last day defined
     * in the range is a Sunday, and {@link #config-hideNonWorkingDays} is set, then the last visible
     * date will be the date of the Friday.
     * @member {Date}
     * @readonly
     */
    get lastVisibleDate() {
        const
            me           = this,
            { dh }       = me,
            // Extracting the month index from our instance of the Month helper class
            { month }    = me.month;
        let date         = dh.add(me.endDate, -1, 'd'),
            { duration } = me;

        while (duration && ((me.hideOtherMonthCells && dh.getMonth(date) !== month) || me.hiddenNonWorkingDays[dh.getDay(date)])) {
            date = dh.add(date, -1, 'd');
            duration--;
        }

        return date;
    }

    updateHideNonWorkingDays(hideNonWorkingDays) {
        const
            me = this,
            {
                dh,
                month,
                calendar
            }  = me;

        me.contentElement?.classList[hideNonWorkingDays ? 'add' : 'remove'](me.hideNonWorkingDaysCls);

        // Bail out for view types not supporting this (ResourceView)
        if (month == null) {
            return;
        }

        let activeColumnIndex, date, activeDay;

        // Our active date is going to be hidden
        if (!me.isConfiguring && hideNonWorkingDays) {
            date      = me.date;
            activeDay = date && dh.getDay(date);

            if (date && me.nonWorkingDays[activeDay] && me.getDayElement(date)) {
                activeColumnIndex = month.visibleDayColumnIndex[activeDay];
            }
        }

        month.hideNonWorkingDays = hideNonWorkingDays;

        super.updateHideNonWorkingDays?.(hideNonWorkingDays);

        // Active date has been hidden by hiding nonworking days, we must move it.
        if (typeof activeColumnIndex === 'number') {
            const
                newActiveColumnIndex = Math.min(activeColumnIndex, month.visibleColumnCount - 1);
            let weekStart            = month.getWeekStart(month.getWeekNumber(date));

            // Find the date for the new visible column index
            for (let i = -1; ; weekStart = dh.add(weekStart, 1, 'd')) {
                // Entry may be zero, cannot use truthiness test
                if (typeof month.visibleDayColumnIndex[dh.getDay(weekStart)] === 'number') {
                    if (++i === newActiveColumnIndex) {
                        break;
                    }
                }
            }
            me.date = weekStart;

            // Owning active date should change
            calendar && (calendar.date = date);
        }
    }

    onCalendarStoreChange({ source, action }) {
        const me = this;

        // Draw on project refresh instead of on dataset.
        // Unless it's a chained store; they change dataset upon master store change
        if (action === 'dataset' && !source.isChained) {
            return;
        }

        // Only refresh once initial commit is performed and change is not cause by project writing back data
        if (me.project.isInitialCommitPerformed && !me.project.isWritingData && me.project.isEngineReady()) {
            // CellMap must be rebuilt when data changes
            me._cellMap?.clear();

            // Opt into transitioning on refresh if we are visible
            if (me.isVisible && me.allowTransitionsOnRefresh == null) {
                me.allowTransitionsOnRefresh = true;
            }
            me.refreshSoon();
        }
    }

    /**
     * Schedules a refresh of the UI for the next animation frame. This is a useful method to call when
     * making multiple data changes, so that each change merely *schedules* a refresh for the next AF and
     * DOM churn is kept to a minimum.
     *
     * Calling {@link #function-refresh} directly cancels any scheduled refresh operation and updates
     * the UI immediately
     */
    refreshSoon() {
        this.refresh();
    }

    /**
     * Called when new event is created.
     * Сan be overridden to supply default record values etc.
     * @param {Scheduler.model.EventModel} eventRecord Newly created event
     */
    onEventCreated(eventRecord) {
        // template method
    }

    /**
     * Returns the event record for a DOM element or DOM event.
     * @param {HTMLElement|Event} elementOrEvent The DOM node to lookup, or a DOM event whose target to lookup.
     * @returns {Scheduler.model.EventModel} The event record
     */
    getEventRecord(elementOrEvent) {
        let element = DomHelper.isDOMEvent(elementOrEvent) ? elementOrEvent.target : elementOrEvent;

        element = element?.closest?.('[data-event-id]');

        return element && this.eventStore.getById(element.dataset.eventId);
    }

    /**
     * Returns the resource record for a DOM element or DOM event if the element is inside a view
     * which displays events for one resource such as a {@link Calendar.widget.ResourceView}
     * or a {@link Calendar.widget.DayResourceView}.
     * @param {HTMLElement|Event} elementOrEvent The DOM node to lookup, or a DOM event whose target to lookup.
     * @returns {Scheduler.model.ResourceModel} The resource record
     */
    getResourceRecord(elementOrEvent) {
        let element = DomHelper.isDOMEvent(elementOrEvent) ? elementOrEvent.target : elementOrEvent;

        element = element?.closest('[data-resource-id]') || null;

        return element && this.resourceStore.getById(element.dataset.resourceId);
    }

    /**
     * Returns the event record for a DOM element or DOM event.
     * @param {HTMLElement|Event} elementOrEvent The DOM node to lookup, or a DOM event whose target to lookup.
     * @returns {Scheduler.model.EventModel} The event record
     */
    resolveEventRecord(elementOrEvent) {
        // this method is added for symmetry w/SchedulerInterface
        return this.getEventRecord(elementOrEvent);
    }

    getDateFromElement(element, keyParser = null, raw = false) {
        // Month headers also yield the start date for that month
        let dateElement = element?.closest('[data-date],[data-header-date],[data-month-date]');

        // Clicked on an element with a data-date or data-header-date, or data-month-date value.
        // Callers who need a more granular date WRT time shifting, such as CalendarDrag should pass
        // a DayTime instance with the correct startShift.
        if (dateElement) {
            const rawDate = dateElement.dataset.date || dateElement.dataset.headerDate || dateElement.dataset.monthDate;

            return raw ? rawDate : (keyParser || (this.isDayView ? this.dayTime : this.dateHelper)).parseKey(rawDate);
        }

        dateElement = element?.closest('[data-week]');

        // Clicked on an element with a data-week value, that should yield the week start date.
        if (dateElement) {
            return this.month?.getWeekStart(dateElement.dataset.week.split(',').map(Number));
        }
    }

    getDateFromDomEvent(domEvent) {
        return this.getDateFromElement(DomHelper.getEventElement(domEvent));
    }

    getDateFromPosition() {
        return null;
    }

    dateKey(date) {
        return this.dateHelper.makeKey(date);
    }

    /**
     * Returns the cell associated with the passed date.
     *
     * In certain views, the strict definition if whether the view owns the date may be optionally enforced.
     *
     * For example, in a YearView or MonthView, dates outside the configured year or month may be displayed.
     *
     * To exclude these, pass the `strict` parameter as `true`
     * @param {Date|String} date The date to find the element for or a key in the format `YYYY-MM-DD`
     * @param {Boolean} strict Only return the element if this view *owns* the date. (MonthView and YearView)
     */
    getDayElement(date, strict) {
        if (typeof date !== 'string') {
            date = this.dateKey(date);
        }

        return this.eventContentElement.querySelector(`[data-date="${date}"]`);
    }

    // Used by DayView and CalendarRow to see which day cell the X position relates to.
    getDayElementFromX(x) {
        const dayCells = this.eventContentElement.querySelectorAll('[data-date]');

        for (let rect, el, i = 0, { length } = dayCells; i < length; i++) {
            rect = (el = dayCells[i]).getBoundingClientRect();
            if (x >= rect.x && x <= rect.x + rect.width) {
                return el;
            }
        }
        return dayCells[0];
    }

    /**
     * Returns the outermost element which represents the first block of the passed event in the view. *If the
     * event is represented within the view*.
     *
     * *Note* if the event covers multiple weeks, this will only return the first element.
     *
     * To return all elements use {@link #function-getEventElements}.
     *
     * To return an event element at a particular date, pass the date as the second parameter.
     * @param {Scheduler.model.EventModel|String|Number} eventRecord The event, or event ID to find the element for.
     * @param {Date} [date] Optionally, the event element at the specified date.
     * @returns {HTMLElement} The first element which corresponds to the event. Note that *some* views,
     * such as {@link Calendar.widget.MonthView} and {@link Calendar.widget.CalendarRow}
     * may render multiple elements for long events.
     */
    getEventElement(eventRecord, date = Math.max(eventRecord.startDate, this.firstVisibleDate || this.startDate)) {
        const
            me                 = this,
            activeEventElement = me.calendar?.navigator.activeItem,
            activeDate         = me.getDateFromElement(activeEventElement),
            eventId            = me.eventStore.modelClass.asId(eventRecord);

        // If the navigated to event is still in the document and accessible and is the event being asked for,
        // and on the active date, then use that element.
        // Some views have multiple elements representing one event.
        if (document.contains(activeEventElement) && DomHelper.isFocusable(activeEventElement) && activeEventElement?.dataset.eventId === String(eventId) && (activeDate && !(me.dateHelper.clearTime(new Date(date)) - activeDate))) {
            return activeEventElement;
        }
        if (date) {
            const dayCell = me.getDayElement(date);

            if (dayCell) {
                // In EventList, the day cell is the event el.
                // In all other views the day cell *contains* the event el.
                return DomHelper.down(dayCell, `[data-event-id="${CSS.escape(eventId)}"]`);
            }
        }
        return me.getEventElements(eventRecord)[0];
    }

    /**
     * Returns all outermost elements which represents the passed event in the view. *If the
     * event is represented within the view*
     * @param {Scheduler.model.EventModel|String|Number} eventRecord The event, or event ID to find the elements for.
     * @returns {HTMLElement[]} The elements which corresponds to the event. Note that *some* views,
     * such as {@link Calendar.widget.MonthView} and {@link Calendar.widget.CalendarRow}
     * may render multiple elements for long events.
     */
    getEventElements(eventRecord) {
        const eventId = this.eventStore.modelClass.asId(eventRecord);

        return this.eventContentElement.querySelectorAll(`[data-event-id="${CSS.escape(eventId)}"]`);
    }

    onEventMouseOverOut(domEvent) {
        const
            me        = this,
            {
                currentOverEventEl
            }         = me,
            isOut     = domEvent.type === 'mouseout',
            toElement = domEvent[isOut ? 'relatedTarget' : 'target'],
            toEventEl = toElement?.closest('.b-cal-event-wrap') || null,
            isChange  = toEventEl !== (currentOverEventEl || null);

        if (isChange) {
            if (isOut) {
                me.currentOverEventEl = null;
                if (currentOverEventEl) {
                    Object.defineProperty(domEvent, 'target', {
                        configurable : true,
                        get          : () => currentOverEventEl
                    });
                }
                return me.onCalendarPointerInteraction(domEvent);
            }
            else {
                me.currentOverEventEl = toEventEl;
                return me.onCalendarPointerInteraction(domEvent);
            }
        }
    }

    onEventMouseEnterLeave(domEvent) {
        if (domEvent.target.classList.contains('b-cal-event')) {
            return this.onCalendarPointerInteraction(domEvent);
        }
    }

    /**
     * Determines what is under the cursor of the specified event or what is described by the given element.
     * @param {Event|Element} domEvent The event or element
     * @returns {CalendarHit}
     */
    calendarHitTest(domEvent) {
        const
            me                = this,
            { monthSelector } = me,
            date              = me.getDateFromDomEvent(domEvent),
            preciseDate       = me.getDateFromDomEvent(domEvent, true),
            target            = DomHelper.getEventElement(domEvent),
            week              = target.closest('[data-week]')?.dataset.week.split(',').map(Number);

        let ret = null,
            closest,
            eventRecord;

        // Only a hit on an event if the event could be found in the EventStore.
        // May be a transient event added solely to the UI and not backed by the store.
        if ((closest /* assignment */ = target.closest('.b-cal-event-wrap')) && (eventRecord /* assignment */ = me.eventStore.getById(closest.dataset.eventId))) {
            ret = {
                type         : 'event',
                eventElement : closest,
                eventRecord
            };
        }
        // If we are showing week number in its own column, then the whole cell header represents the day.
        // Otherwise just the .b-day-name represents it.
        else if ((closest /* assignment */ = target.closest(me.dayNameSelector))) {
            ret = {
                type             : 'dayNumber',
                dayNumberElement : closest
            };
        }
        else if ((closest /* assignment */ = target.closest('.b-week-num,.b-week-number-cell'))) {
            const weekElement = target.closest('.b-calendar-week');

            // Week number cell in the day name row has no week.
            if (weekElement && weekElement.dataset.week) {
                ret = {
                    type              : 'weekNumber',
                    weekNumberElement : closest,
                    weekElement
                };
            }
        }
        else if (monthSelector && target.closest(monthSelector)) {
            ret = {
                type  : 'monthName',
                month : me.dateHelper.getMonth(date),
                date
            };
        }

        if (!ret) {
            if ((closest /* assignment */ = target.closest('.b-cal-cell-overflow'))) {
                ret = {
                    type                : 'cellOverflow',
                    cellOverflowElement : closest
                };
            }
            else if (date) {
                ret = {
                    type : 'schedule'
                };
            }
        }

        if (ret) {
            ret.week        = week;
            ret.target      = target;
            ret.resource    = ret.resourceRecord = me.getResourceRecord(domEvent);
            ret.cell        = target.closest('.b-calendar-cell');
            ret.date        = date;
            ret.preciseDate = preciseDate;
            ret.view        = me;
            if (domEvent.eventPhase) {
                ret.domEvent = domEvent;
            }
        }

        return ret;
    }

    onCalendarPointerInteraction(domEvent) {
        const
            me                = this,
            { monthSelector } = me,
            { target }        = domEvent,
            fromOverflowPopup = Boolean(target.closest('.b-overflow-popup')),
            domEventName      = eventNameMap[domEvent.type],
            eventWrap         = target.closest('.b-cal-event-wrap'),
            eventRecord       = eventWrap ? me.eventStore.getById(eventWrap.dataset.eventId) : me.getEventRecord(target),
            // If it's a mouse event on a multi day event bar then it *may* be an event bar which started from a
            // previous cell in the view. In that case use getDateFromXY
            multiDay          = !fromOverflowPopup && me.isDayCellRenderer && eventRecord?.isInterDay,
            date              = !domEvent.key && multiDay ? me.getDateFromXY([domEvent.clientX, domEvent.clientY]) : me.getDateFromDomEvent(domEvent),
            eventElement      = eventWrap || (eventRecord && me.getEventElement(eventRecord, date)),
            resourceElement   = target.closest('[data-resource-id]'),
            resourceRecord    = resourceElement && me.resourceStore.getById(resourceElement.dataset.resourceId);

        let result;

        // Mouse interaction was on a resource.
        // These can be outside of the eventContentElement.
        // Resource is a property of an event, so it triggers first.
        if (resourceRecord) {
            result = me.trigger(`resource${domEventName}`, {
                domEvent,
                date,
                eventElement,
                eventRecord,
                resourceElement,
                resourceRecord,
                fromOverflowPopup
            });
        }

        // If we are showing week number in its own column, then the whole cell header represents the day.
        // Otherwise just the .b-day-name represents it.
        if (target.closest(me.dayNameSelector)) {
            result = me.trigger(`dayNumber${domEventName}`, {
                domEvent,
                date,
                cellData : me.cellMap.get(date) || me.createCellData(date),
                resourceRecord,
                fromOverflowPopup
            });
            if (result === false) {
                return result;
            }
        }

        // All other interaction must be in content element or our overflow popup.
        if (!fromOverflowPopup && !me.eventContentElement.contains(target)) {
            return;
        }

        // Mouse interaction was on an event
        if (result !== false && eventRecord) {
            const eventResult = me.trigger(`event${domEventName}`, {
                domEvent,
                date,
                eventElement,
                eventRecord,
                resourceRecord,
                fromOverflowPopup
            });
            if (eventResult) {
                result = eventResult;
            }
        }

        // Interacted with an event. No further interaction.
        if (eventRecord) {
            return result;
        }

        // Interaction was with a week number
        if (target.closest('.b-week-num,.b-week-number-cell')) {
            const weekElement = domEvent.target.closest('[data-week]');

            // If we find an element we can ask the week.
            if (weekElement) {
                return me.trigger(`weekNumber${domEventName}`, {
                    domEvent,
                    week : weekElement.dataset.week.split(',').map(Number),
                    date : me.getDateFromElement(weekElement.querySelector('.b-calendar-cell')),
                    fromOverflowPopup
                });
            }
        }

        // Interaction was with a month in the YearView.
        if (monthSelector && target.closest(monthSelector)) {
            return me.trigger(`monthName${domEventName}`, {
                domEvent,
                month : me.dateHelper.getMonth(date),
                date,
                fromOverflowPopup
            });
        }

        // Interacting with a cell overflow indicator
        if (target.closest('.b-cal-cell-overflow')) {
            if (me.trigger(`cellOverflow${domEventName}`, {
                domEvent,
                date,
                fromOverflowPopup,
                resourceRecord
            }) !== false) {
                return;
            }
        }

        // It's only a schedule{event} if the event is in a day cell.
        // Pure Grid views like ListView don't have a schedule area - it's all events.
        if (date && me.dayCellCls && domEvent.target.closest(`.${me.dayCellCls}`)) {
            result = me.trigger(`schedule${domEventName}`, {
                domEvent,
                date,
                fromOverflowPopup,
                resourceRecord
            });

            if (result === false) {
                return result;
            }
        }

        // Finally check if the gesture matches the autoCreate gesture.
        // A precise time is passed to autoCreate if possible (Only DayView offers a precise time)
        // This is so that the autoCreate's configure snapType may be applied
        if (!fromOverflowPopup) {
            me.checkAutoCreateGesture(domEvent, me.getDateFromDomEvent(domEvent, true), resourceRecord || undefined);
        }
        return result;
    }

    /**
     * The key handler for CTRL+Z undo key combination. If {@link Calendar.view.Calendar#config-enableUndoRedoKeys} is enabled,
     * the last data change will be undone.
     * @internal
     */
    undoRedoDataChange(keyEvent) {
        if (this.calendar?.enableUndoRedoKeys) {
            return this.project?.stm?.onUndoKeyPress(keyEvent);
        }
    }

    onCalendarKeyDown(keyEvent) {
        this.onCalendarPointerInteraction(keyEvent);
    }

    isInterDayEvent(eventRecord) {
        return eventRecord.allDay || (eventRecord.isScheduled && this.dayTime ? this.dayTime.isInterDay(eventRecord) : eventRecord.isInterDay);
    }

    /**
     * Returns `true` if the given date is today in the current time zone.
     * @param {Date} date The date to check.
     * @returns {Boolean} `true` if the date is today, `false` otherwise.
     */
    isToday(date) {
        return this.dateHelper.isToday(date, this.project?.timeZone);
    }

    /**
     * Sort the given array of `events` in the desired order for this view.
     * @param {Scheduler.model.EventModel[]} events
     * @internal
     */
    sortEvents(events) {
        events.sort(this.eventSorter);
    }

    get widgetClassList() {
        const classList = super.widgetClassList;

        if (this.parent) {
            ArrayHelper.remove(classList, 'b-bryntum');
        }

        return classList;
    }

    //region Extract configs

    // These functions are not meant to be called by any code other than Base#getCurrentConfig().

    // This excludes project and calendar from being serialized,
    // they are always assigned on creation not actually configurable
    preProcessCurrentConfigs(configs) {
        super.preProcessCurrentConfigs(configs);

        delete configs.calendar;
        delete configs.project;
    }

    // Extracts the current configs for the calendar view, with special handling to exclude project
    getCurrentConfig(options) {
        const result = super.getCurrentConfig(options);

        delete result.project;

        return result;
    }

    //endregion
};
