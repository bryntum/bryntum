import VersionHelper from '../../Core/helper/VersionHelper.js';

import Factoryable from '../../Core/mixin/Factoryable.js';
import Featureable from '../../Core/mixin/Featureable.js';
import State from '../../Core/mixin/State.js';
import Tierable from '../../Core/mixin/Tierable.js';
import Base from '../../Core/Base.js';
import Panel from '../../Core/widget/Panel.js';
import Popup from '../../Core/widget/Popup.js';
import Widget from '../../Core/widget/Widget.js';
import Responsive from '../../Core/widget/mixin/Responsive.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';

import TimeZonable from '../../Core/mixin/TimeZonable.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import DayTime from '../../Core/util/DayTime.js';
import DynamicObject from '../../Core/util/DynamicObject.js';
import ScrollManager from '../../Core/util/ScrollManager.js';
import CalendarFeature from '../feature/CalendarFeature.js';

import CrudManagerView from '../../Scheduler/crud/mixin/CrudManagerView.js';
import CurrentConfig from '../../Scheduler/view/mixin/CurrentConfig.js';


import AgendaView from '../widget/AgendaView.js'; // NOSONAR
import DayView from '../widget/DayView.js';
import MonthView from '../widget/MonthView.js';
import WeekView from '../widget/WeekView.js';
import YearView from '../widget/YearView.js';
import EventList from '../widget/EventList.js';


import CalendarStores from '../mixin/CalendarStores.js';
import SchedulerHost from './mixin/SchedulerHost.js';
import SchedulerInterface from '../mixin/SchedulerInterface.js';

import CalendarScroll from './mixin/CalendarScroll.js';
import EventHighlighting from './mixin/EventHighlighting.js';
import EventNavigation from './mixin/EventNavigation.js';
import EventSelection from './mixin/EventSelection.js';


import '../localization/En.js';

import '../widget/ModeSelector.js';
import '../../Core/widget/layout/Card.js';
import '../../Core/widget/ButtonGroup.js';
import '../../Core/widget/panel/PanelCollapserOverlay.js';

import '../feature/CalendarDrag.js';
import '../feature/EventEdit.js';
import '../feature/EventMenu.js';
import '../feature/EventTooltip.js';
import '../feature/ScheduleTooltip.js';
import '../feature/ScheduleMenu.js';


DomHelper.loadStylesheet('Calendar/view/Calendar.css');
DomHelper.loadStylesheet('Calendar/view/CalendarEventRendering.css');

// import Stylesheet from './Calendar.css' with { type: 'css' };
// import CalendarEventRenderingStylesheet from './CalendarEventRendering.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Calendar');
// DomHelper.applyStylesheet(CalendarEventRenderingStylesheet, 'CalendarEventRendering');

/**
 * @module Calendar/view/Calendar
 */

const
    relayedEvents          = /^refresh$|.*event.*|.*resource.*|.*cell.*|.*row.*|.*schedule.*|daynumber.*|weeknumber.*|monthname.*|weekname.*$|beforedatechange|tickchange|.*showoverflowpopup|beforeautocreate|rangechange|weekflex|layoutupdate|timeaxis.*|dayheader.*$/,
    isFocusedCalendarMixin = w => w.isCalendarMixin && w.containsFocus,
    emptyArray             = Object.freeze([]),
    hasWeight              = m => m.weight != null,
    // These are events which the underlying views may fire when navigating dates which we must not use
    // to change date in our catchAll handler because we have specific handlers for them.
    noDateChangeEvents     = {
        weeknumberclick : 1,
        weekcellclick   : 1,
        cellclick       : 1,
        monthnameclick  : 1
    },
    nonNavigableRoles      = {
        presentation : 1,
        row          : 1
    },
    // TaskEdit fires each of its events twice - once named for `task`, and once named for `event`
    // (see Scheduler.feature.TaskEdit#triggerOnClient). Our own eventEdit feature fires these for the
    // same action before delegating to the mode, so relaying the mode's copy would deliver them twice.
    // Only events which pass through TaskEdit#triggerOnClient belong here - `beforeEventAdd` does not,
    // it is fired by EventDragCreate and must still be relayed.
    duplicatedByTaskEdit   = {
        beforeeventedit : 1
    },
    isMonthView            = v => v.isMonthView || v.view?.type === 'monthview',
    isWeekView             = v => v.isWeekView || v.view?.type === 'weekview',
    isNavigable            = e => !nonNavigableRoles[e.getAttribute?.('role')] && DomHelper.isFocusable(e),
    splitOnColon           = line => line.split(':').map(segment => segment.trim()),
    createHelpElement      = helpText => helpText.map((segment, i) => {
        segment = segment.trim();
        return `<div${i ? '' : ' style="justify-self:end"'} class="b-kbd-help-column-${i + 1}">${i ? highlightKeys(segment) : segment}</div>`;
    }).join(''),
    highlightKeys         = text => text.replaceAll(/\[([^\]]+)\]/g, (match, p1) => `<kbd>${translateCtrl(p1.toUpperCase())}</kbd>`),
    translateCtrl         = keyText => keyText === 'CTRL' && navigator.userAgent.includes('Mac') ? 'CMD' : keyText,
    eventStoreHolderRefs  = {

    };

/**
 * A `CalendarView` is a widget which either mixes in the {@link Calendar.widget.mixin.CalendarMixin} or offers its
 * interface. These are used as a {@link Calendar.view.Calendar#config-modes mode} of a {@link Calendar.view.Calendar}.
 * @typedef {(
 *   CalendarViewType |
 *   Calendar.widget.mixin.CalendarMixin |
 *   Scheduler.view.Scheduler |
 *   Core.widget.Widget
 * )} CalendarView
 */

/**
 * A `CalendarView` is a widget which either mixes in the {@link Calendar.widget.mixin.CalendarMixin} or offers its
 * interface. These are used as a {@link Calendar.view.Calendar#config-modes mode} of a {@link Calendar.view.Calendar}.
 * This type is a union of all the possible view configurations that can be used to configure a Calendar's modes.
 * @typedef {(
 *   CalendarViewTypeConfig |
 *   SchedulerConfig |
 *   ContainerItemConfig
 * )} CalendarViewConfig
 */

/**
 * The configs of every class in the union `U`, merged into one object. A config which several of them declare
 * accepts any of their types. Used by {@link Calendar.view.Calendar#config-modeDefaults}.
 * @typedef {Object} MergedConfigs
 * @template U
 * @ts-type {MergedConfigs<U>}:{{ [K in U extends U ? keyof U : never]?: U extends U ? U[K & keyof U] : never }}
 * @internal
 * @ts-class
 */

/**
 * The configs a Calendar applies to every one of its {@link Calendar.view.Calendar#config-modes}, so any config of
 * any view type is accepted.
 * @typedef {Object} CalendarModeDefaults
 * @ts-type {CalendarModeDefaults}:{MergedConfigs<CalendarViewTypeConfig>}
 */

/**
 * The config type `U` with its `type` property required.
 * @typedef {Object} WithType
 * @template U
 * @ts-type {WithType<U>}:{U extends object ? U & Required<Pick<U, 'type' & keyof U>> : never}
 * @internal
 * @ts-class
 */

/**
 * The config of any widget which may be a container item, with its `type` specified.
 * @typedef {Object} TypedContainerItemConfig
 * @ts-type {TypedContainerItemConfig}:{WithType<ContainerItemConfig>}
 */

/**
 * The config of any Calendar view type, with its `type` specified. A built-in
 * {@link Calendar.view.Calendar#config-modes mode} accepts this to be rendered by another view type.
 *
 * `CalendarViewWidgetConfig` is the generated union of the Calendar views which are widgets, so the two
 * {@link Calendar.widget.CalendarRow} types, which cannot be a mode, are not included.
 * @typedef {Object} TypedCalendarViewConfig
 * @ts-type {TypedCalendarViewConfig}:{WithType<CalendarViewWidgetConfig>}
 */

/**
 * An object describing the context of a pointer interaction with a Calendar view.
 * @typedef {Object} CalendarHit
 * @property {'event'|'dayNumber'|'weekNumber'|'monthName'|'cellOverflow'|'schedule'} type The type of the target:
 * `'event'`, `'dayNumber'`, `'weekNumber'`, `'monthName'`, `'cellOverflow'`, or `'schedule'`.
 * @property {Event} [domEvent] The DOM event that triggered the hit if the hit was triggered by a DOM event.
 * @property {HTMLElement} target The target element.
 * @property {HTMLElement} cell The cell element the target belongs to.
 * @property {HTMLElement} [eventElement] The target event element. Present only if the `type` is `'event'`.
 * @property {Scheduler.model.EventModel} [eventRecord] The target event record. Present only if the `type` is `'event'`.
 * @property {Scheduler.model.ResourceModel} [resourceRecord] The target resource record. Present only if the view
 * supports resources and the target is associated with one.
 * @property {CalendarView} view The view the target belongs to.
 * @property {Date} date The date of the target.
 * @property {Date} preciseDate The precise date at the pointer position. This may differ from `date` if the view is
 * a {@link Calendar.widget.DayView}. It will be as accurate as can be determined.
 * @property {Number[]} [week] The target week if it can be determined: `[year, weekInYear]`.
 */

/**
 * @typedef {Object} CalendarToolbarConfig
 * @property {Object<String,ButtonConfig|ContainerItemConfig|ModeSelectorConfig>} [items] The set of items to be
 * included in the toolbar.
 * @property {ButtonConfig} [items.toggleSidebar] The button which toggles the visibility of the sidebar.
 * @property {ButtonConfig} [items.todayButton] The "Today" button, which navigates to today.
 * @property {ButtonConfig} [items.prevButton] The button which navigates to the previous date range.
 * @property {ButtonConfig} [items.nextButton] The button which navigates to the next date range.
 * @property {ContainerItemConfig} [items.viewDescription] A Widget which displays the current view's date range.
 * @property {ContainerItemConfig} [items.spacer] A Widget which takes up space in the toolbar.
 * @property {ModeSelectorConfig} [items.modeSelector] A Container which handles the mode selection UI.
 */

/**
 * ## Overview
 * Bryntum Calendar is a full-featured scheduling component with a rich, clean and comprehensively documented API and
 * many ways to customize and extend it. It is accessible, responsive and supports touch devices.
 *
 * It includes thirteen different {@link #config-modes view types} covering all the most common calendar viewing
 * paradigms.
 *
 * It is internationalized with support for 45 locales out of the box, and this can be easily extended.
 *
 * Bryntum Calendar is built using modern web techniques on a well documented, comprehensive set of core UI components.
 * It is designed from the ground up to be responsive and mobile-friendly, while still being a powerful tool for desktop
 * users.
 *
 * It is themed using modern CSS techniques and includes a number of preconfigured themes, each of which may be switched
 * between light and dark mode. All aspects of the appearance may be customized using CSS variables.
 *
 * The `Calendar` class is a configurable, aggregated view of an {@link Scheduler.data.EventStore} which may comprise
 * several view types to display the events in different ways.
 *
 * This is the primary way of creating a calendar UI.
 *
 * {@inlineexample Calendar/view/Calendar.js}
 *
 * ## Calendar modes
 * A Calendar may be configured with {@link #config-modes} which describe the types of views of the
 * calendar data which should be shown.
 *
 * These are:
 *  - `'agenda'`
 *  - `'year'`
 *  - `'month'`
 *  - `'week'` (working week if {@link Calendar.widget.WeekView#config-hideNonWorkingDays} is `true`)
 *  - `'multiweek'`
 *  - `'day'`
 *  - `'list'` (This is a subclass of {@link Grid.view.Grid}, and so may use many of the powerful features of that class)
 *  - `'resource'`
 *  - `'dayresource'`
 *  - `'dayagenda'`
 *  - `'monthagenda'`
 *  - `'monthgrid'`
 *  - `'yearplanner'`
 *
 *  By default, `'day'`, `'week'`, `'month'`, `'year'` and `'agenda'` are
 *  included in a Calendar's UI.
 *
 * The modes are instances of the following classes:
 *
 * - {@link Calendar.widget.AgendaView}
 * - {@link Calendar.widget.YearView}
 * - {@link Calendar.widget.MonthView}
 * - {@link Calendar.widget.WeekView}
 * - {@link Calendar.widget.MultiWeekView}
 * - {@link Calendar.widget.DayView}
 * - {@link Calendar.widget.EventList}
 * - {@link Calendar.widget.ResourceView}
 * - {@link Calendar.widget.DayResourceView}
 * - {@link Calendar.widget.DayAgendaView}
 * - {@link Calendar.widget.MonthAgendaView}
 * - {@link Calendar.widget.MonthGrid}
 * - {@link Calendar.widget.YearPlanner}
 *
 * For TypeScript users, the {@link CalendarView} type is a union of all of these classes.
 *
 * ## Common APIs of all views
 * All of these view types implement a common API inherited from {@link Calendar.widget.mixin.CalendarMixin} which means
 * that they have a common set of convenience APIs which the owning Calendar uses, but which developers can also use.
 *
 * For example, there is a {@link Calendar.widget.mixin.CalendarMixin#function-previous} and a
 * {@link Calendar.widget.mixin.CalendarMixin#function-next} function which moves the view forward or backward in time
 * by its {@link Calendar.widget.mixin.CalendarMixin#property-duration}.
 *
 * All provided view types also have `startDate` and `endDate` properties which yield the start and end
 * dates of the view's current range.
 *
 * {@note}These dates are `Date` objects which represent time points, *not* 24 hour
 * blocks. So in common parlance, a view's `endDate` is exclusive.{/@note}
 *
 * There is a {@link Calendar.widget.mixin.CalendarMixin#function-createEvent} function which creates an event for a
 * passed date using the {@link Calendar.widget.mixin.CalendarMixin#config-autoCreate configured defaults} for the view.
 *
 * ## Changing the default set of views
 * Each mode may be reconfigured from its default configuration by specifying its mode
 * value as an object:
 *
 * ```javascript
 * new Calendar({
 *     appendTo : domElement,
 *     modes : {
 *         month : {
 *             // Week number in a separate, clickable column
 *             showWeekColumn : true
 *         },
 *         week : {
 *             // Day columns start at 8am. No events shown before this
 *             dayStartTime : 8
 *         }
 *     }
 * });
 * ```
 *
 * Modes may be omitted from the view by specifying its mode value as `null`.
 * To specify the initial active mode, {@link #config-mode} config should be used, to manage mode at runtime,
 * {@link #property-mode} property is available.
 *
 * ```javascript
 * new Calendar({
 *     appendTo : domElement,
 *     mode  : 'week',
 *     modes : {
 *         agenda : null,
 *         year   : null
 *     }
 * });
 * ```
 *
 * Other provided UI elements may be omitted from the view by specifying their configuration values as `null`:
 *
 * ```javascript
 * new Calendar({
 *     appendTo : domElement,
 *
 *     // Do not show the top toolbar
 *     tbar : null,
 *
 *     // Do not show the sidebar
 *     sidebar : null
 * });
 * ```
 *
 * Or, for more granularity:
 *
 * ```javascript
 * new Calendar({
 *     appendTo : domElement,
 *
 *     tbar : {
 *         items : {
 *             // Do not show the "Today" button in the top toolbar
 *             todayButton : null
 *         }
 *     },
 *
 *     sidebar : {
 *         items : {
 *             // Do not show the mini calendar in the sidebar
 *             datePicker : null
 *         }
 *     }
 * });
 * ```
 *
 * ## Creating new events through the UI
 *
 * By default, the {@link Calendar.feature.CalendarDrag} feature is enabled, which allows users to drag-create
 * new events. The default duration unit for new drag-created events is the
 * {@link Calendar.widget.mixin.CalendarMixin#property-dragUnit}.
 *
 * This value is `'hour'` by default, but is `'day'` in month and year views, and in the all day row of day and week
 * views.
 *
 * When using the {@link Calendar.widget.mixin.CalendarMixin#config-autoCreate} config, the default event duration is
 * `'1 hour'` by default. This may be changed by specifying a different duration in each mode's `autoCreate` config.
 *
 * To make all modes of event creation use the same duration unit use:
 *
 * ```javascript
 * new Calendar({
 *     // All our views use "day" as the default duration unit regardless of how created.
 *     // Double click events are still the default one hour, but use the "day" unit.
 *     modeDefaults : {
 *         autoCreate : {
 *             duration : `${1/24} day`
 *         },
 *         dragUnit : 'day'
 *     }
 * });
 * ```
 *
 * If using a {@link Scheduler.view.Scheduler} as a mode of the Calendar, be aware that the
 * `Scheduler` uses the {@link Core.data.field.DataField#config-defaultValue} of the
 * {@link Scheduler.model.EventModel#field-durationUnit} field to determine the duration unit
 * of all newly created events within its UI. So to change that, you would need to change the
 * `defaultValue` of the `durationUnit` field in an `EventModel` subclass
 *
 * ## Dragging events
 *
 * Drag and drop of events — dragging an event body to move it, dragging an event edge to resize it, and dragging empty
 * space to create a new event — is provided by the {@link Calendar.feature.CalendarDrag} feature, which is **enabled**
 * by default.
 *
 * The feature is configured through the {@link #config-features} config, keyed by its `drag` type name:
 *
 * ```javascript
 * new Calendar({
 *     features : {
 *         drag : {
 *             creatable : false
 *         }
 *     }
 * });
 * ```
 *
 * To exclude the feature entirely, configure it as `false`:
 *
 * ```javascript
 * new Calendar({
 *     features : {
 *         drag : false
 *     }
 * });
 * ```
 *
 * A feature which is included may be switched off and on again at runtime through the {@link #property-features}
 * property:
 *
 * ```javascript
 * calendar.features.drag.disabled = true;
 * ```
 *
 * While a drag gesture is in progress, the feature's internal {@link Core.mixin.Draggable} adds its
 * {@link Core.mixin.Draggable#property-draggingCls} (`'b-draggable-active'` by default) to the content element of the
 * view being dragged in, so CSS rules scoped under `.b-draggable-active` may be used to restyle the UI for the duration
 * of the gesture. See {@link Calendar.feature.CalendarDrag} for the details of which element is affected.
 *
 * ### Configuring the drag zone of a view
 *
 * The {@link Calendar.feature.CalendarDrag} feature creates one drag *zone* object per view, and each view may tune the zone created for it through its
 * {@link Calendar.widget.mixin.CalendarMixin#config-dragZoneConfig} config. This is how one mode of a Calendar can be
 * given different drag behaviour from the next.
 *
 * For example, the `constrainToDayTime` setting constrains the **vertical**, time axis part of a move gesture in the
 * views which have a time axis — {@link Calendar.widget.DayView}, {@link Calendar.widget.WeekView} and
 * {@link Calendar.widget.DayResourceView}, but not {@link Calendar.widget.DayAgendaView}, which is a list and so has
 * no time of day to constrain. Configured as `true`, it keeps the whole event between the day's own boundaries —
 * the start of the day the pointer is over, and that boundary plus 24 hours — so that dragging can never turn the
 * event into an inter day event:
 *
 * ```javascript
 * new Calendar({
 *     modes : {
 *         // Only the day view constrains drags this way. Other modes keep the default behaviour.
 *         day : {
 *             dragZoneConfig : {
 *                 constrainToDayTime : true
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * The boolean form uses the day boundaries, not the hours the view displays: on a view showing
 * 08:00 to 18:00 it still permits a drag to 07:30. To hold the event inside the displayed hours instead, configure it
 * as `'visible'`, which reads the view's `dayStartTime` and `dayEndTime` as the gesture runs:
 *
 * ```javascript
 * dragZoneConfig : {
 *     constrainToDayTime : 'visible'
 * }
 * ```
 *
 * To bound it by explicit hours, configure it as an object, omitting either key to leave that end unconstrained:
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
 * The **horizontal** axis is a separate matter, governed by
 * {@link Calendar.widget.DayView#property-interDayDrag}, which decides whether a gesture may leave the day column it
 * started in.
 *
 * Each Calendar feature which creates per-view zones reads its own config of this shape, named after the feature type:
 * `dragZoneConfig` for the `drag` feature, `timeRangesZoneConfig` for the `timeRanges` feature, and so on.
 *
 * ## Preconfigured Toolbar, Sidebar and ViewContainer
 * A Calendar is basically a {@link Core.widget.Panel} which contains nested widgets which implement
 * the complex UI. By default, it has three immediate child widgets which may be accessed through the
 * following properties:
 *
 * - {@link #property-tbar} references the top toolbar, which is an instance of {@link Core.widget.Toolbar}.
 * - {@link #property-sidebar} references the sidebar, which is an instance of {@link Calendar.widget.Sidebar}. Note
 *   that the Sidebar is not available in the community edition.
 * <br>This item has a {@link Core.widget.Widget#config-weight} of `-10` by default, placing it at the
 * `inline-start` side of the Calendar.<br>If the Sidebar is configured with
 * {@link Calendar.widget.Sidebar#config-side} as `'end'`, then it uses `200` to move it to the
 * `inline-end` side.
 * - {@link #property-viewContainer} references the subordinate {@link Core.widget.Container} which manages the modes
 * and changes which mode is active through its {@link Core.widget.Container#property-layout}.
 *  <br>This item has a {@link Core.widget.Widget#config-weight} of `100` by default, placing it after
 * the sidebar.
 *
 * The Calendar *may* be configured with extra {@link #config-items} which will be integrated into the
 * horizontal flexbox display, sharing space with the `sidebar` and `viewContainer`.
 * The order may be controlled using the {@link Core.widget.Widget#config-weight} property.
 *
 * These three child widgets may be reconfigured at instantiation time using their config options
 * {@link #config-tbar}, {@link #config-sidebar} and {@link #config-viewContainer}.
 *
 * Sidebar visibility is mobile-friendly and responsive to the UI form factor, and will initialize itself collapsed
 * on small screens unless configured otherwise using its {@link Calendar.widget.Sidebar#config-collapsed} config.
 *
 * ## Hiding or adding widgets in the preconfigured toolbar
 *
 * The calendar is preconfigured with a {@link #config-tbar toolbar} including navigation buttons,
 * {@link Calendar/widget/ModeSelector mode selector} and a {@link Calendar/widget/MonthView#property-description}.
 * See the {@link #config-tbar toolbar docs} for the list of predefined toolbar widgets.
 *
 * Each of these built-in widgets can be hidden or mutated, see example below.
 * ```javascript
 * new Calendar({
 *     tbar : {
 *         items : {
 *            todayButton   : null, // no today button
 *            toggleSidebar : null
 *         }
 *     }
 * })
 * ```
 *
 * To hide the toolbar completely:
 * ```javascript
 * new Calendar({
 *     tbar : null
 * })
 * ```
 *
 * You can also add your own widgets into the toolbar:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     tbar : {
 *         items : {
 *            addButton    : {
 *                type : 'button',
 *                text : 'Add event',
 *                weight : 100, // Add before the Today button
 *                onClick() {
 *                    calendar.editEvent({
 *                        name      : 'New event',
 *                        startDate : new Date(),
 *                        endDate   : new Date(Date.now() + 3600 * 1000)
 *                    });
 *                }
 *            }
 *         }
 *     }
 * })
 * ```
 *
 * ## The modeSelector
 * By default, the {@link #config-tbar toolbar} contains a {@link Calendar.widget.ModeSelector} component
 * which shows a range of buttons to allow the user to select which {@link #config-modes mode} of the Calendar to view.
 *
 * This is automatically responsive and will collapse into a {@link Core.widget.Button} with a menu
 * when there is insufficient space to show all the mode buttons making the Calendar UI mobile-friendly.
 *
 * It may also be explicitly configured using its {@link Calendar.widget.ModeSelector#config-minified} property.
 *
 * ### The modeSelector's "Include weekends" UI.
 *
 * If the Calendar's {@link Calendar.view.Calendar#config-includeWeekendsButton} config is `true`, a
 * button will be shown in the mode selector which allows the user to toggle the inclusion of weekends in
 * applicable views.
 *
 * By default, when the mode selector is minified (Either by configuration, or its responsive state),
 * the options will be shown in a menu. In this case, the "include weekends" toggle will also be added
 * to the menu.
 *
 * To prevent the minified mode selector menu's "Include weekends" toggle from appearing, set
 * {@link Calendar.widget.ModeSelector#config-includeWeekendsMenuItem} to `false`:
 *
 * ```javascript
 * new Calendar({
 *     appendTo : domElement,
 *     tbar     : {
 *         items : {
 *             modeSelector : {
 *                 includeWeekendsMenuItem : false
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ## Loading data
 *
 * Fundamentally, all data stores mentioned below are subordinate to the Calendar's
 * {@link #property-project Project} which is the managing object for the {@link #property-eventStore},
 * {@link #property-resourceStore}, {@link #property-assignmentStore}, {@link #property-timeRangeStore} and
 * {@link #property-resourceTimeRangeStore}
 *
 * A Calendar loads its events into an {@link Scheduler.data.EventStore}.
 *
 * The recommended way to load and sync data is to use a {@link Scheduler.data.CrudManager} configured with
 * the URL of web services:
 *
 * ```javascript
 * new Calendar({
 *     appendTo : domElement,
 *     crudManager : {
 *         transport : {
 *             load : {
 *                 url : '/data-providing-url'
 *             }
 *             sync : {
 *                 url : '/data-update-url'
 *             }
 *         },
 *         autoLoad : true,
 *         autoSync : true
 *     }
 * });
 * ```
 *
 * JSON data should use this format:
 *
 * ```json
 * {
 *     "success" : true,
 *     "resources" : {
 *         "rows" : [
 *             {
 *                 "id" : 1,
 *                 "name" : "Default Calendar",
 *                 "eventColor" : "green"
 *             }
 *         ]
 *     },
 *     "events" : {
 *         "rows" : [
 *             {
 *                 "id" : 1,
 *                 "name" : "Meeting",
 *                 "startDate" : "2020-10-01T10:00:00",
 *                 "endDate" : "2020-10-01T11:00:00",
 *                 "resourceId" : 1
 *             }
 *         ]
 *     }
 * }
 * ```
 *
 * ### Multiple assignment
 *
 * When multiple resource assignment is required, data should look as below. Assignments
 * are separate records which link events to resources by connecting the ids of each.
 *
 * In this example, event id `1` is assigned to resources `1` and `2`
 *
 * Note that there is __no__ `resourceId` field in the event data:
 *
 * ```json
 * {
 *     "success" : true,
 *     "resources" : {
 *         "rows" : [
 *             {
 *                 "id" : 1,
 *                 "name" : "Default Calendar",
 *                 "eventColor" : "green"
 *             }, {
 *                 "id" : 2,
 *                 "name" : "Alternative Calendar",
 *                 "eventColor" : "red"
 *             }
 *         ]
 *     },
 *     "events" : {
 *         "rows" : [
 *             {
 *                 "id" : 1,
 *                 "name" : "Meeting",
 *                 "startDate" : "2020-10-01T10:00:00",
 *                 "endDate" : "2020-10-01T11:00:00"
 *             }
 *         ]
 *     },
 *     "assignments" : {
 *         "rows" : [
 *             {
 *                 "id"         : 1,
 *                 "eventId"    : 1,
 *                 "resourceId" : 1
 *             }, {
 *                 "id"         : 2,
 *                 "eventId"    : 1,
 *                 "resourceId" : 2
 *             }
 *         ]
 *     }
 * }
 * ```
 *
 * ### Recurring events
 *
 * Events can recur over time based on standardized rules as specified by
 * [RFC-5545](https://tools.ietf.org/html/rfc5545#section-3.3.10)
 *
 * An event data object as described above may contain a `recurrenceRule` property which is a string which
 * defines the recurrence pattern, and recurrence termination conditions.
 *
 * For example the events `rows` may look like this:
 *
 * ```json
 * [
 *     {
 *      "id": 1,
 *      "startDate": "2020-01-01T10:00",
 *      "endDate": "2020-01-01T11:00",
 *      "name": "Scrum (twice / week) ",
 *      "recurrenceRule": "FREQ=WEEKLY;BYDAY=TU,TH",
 *      "resourceId": "bryntum"
 *    },
 *    {
 *      "id": 2,
 *      "startDate": "2020-01-01T09:00",
 *      "endDate": "2020-01-01T12:00",
 *      "name": "Board meeting",
 *      "recurrenceRule": "FREQ=MONTHLY;BYDAY=MO;BYSETPOS=1",
 *      "resourceId": "bryntum"
 *    }
 * ]
 * ```
 *
 * ### Loading time ranges
 *
 * When using the {@link Calendar.feature.TimeRanges} feature, the time ranges are included in
 * named data blocks:
 *
 * ```json
 * {
 *     success : true,
 *     events : {...},
 *     resources : {...},
 *     timeRanges : {
 *         rows : [
 *             {
 *                 "id"        : 1,
 *                 "name"      : "Post-conference",
 *                 "alignment" : "end",
 *                 "startDate" : "2020-10-15 15:00",
 *                 "endDate"   : "2020-10-15 20:00",
 *                 "color"     : "red"
 *             }
 *         ]
 *     }
 * }
 * ```
 *
 * When using a {@link Calendar.widget.ResourceView}, resource-specific time ranges may
 * also be included in the data. These are only rendered in subviews of the resource view
 * with matching resource ids:
 *
 * ```json
 * {
 *     success : true,
 *     events : {...},
 *     resources : {...},
 *     resourceTimeRanges : {
 *         rows : [
 *             {
 *                 "id"         : 1,
 *                 "resourceId" : 1
 *                 "name"       : "Post-conference",
 *                 "alignment"  : "end",
 *                 "startDate"  : "2020-10-15 15:00",
 *                 "endDate"    : "2020-10-15 20:00",
 *                 "color"      : "red"
 *             }
 *         ]
 *     }
 * }
 * ```
 *
 * For more information on loading events and resources, see the {@link Scheduler.view.Scheduler}
 * documentation. Calendar uses the same data classes.
 *
 * ## Listening to events
 * The events emitted by the Calendar are documented {@link #event-eventClick here}. Note that in
 * addition to `click`, all other mouse events are also covered and all significant UI elements
 * are active, and follow the same naming convention.
 *
 * So there is a `dayNumberClick` event and a `weekNumberClick` event and a
 * `monthNameClick` event and so on.
 *
 * Many `beforeXXXX` events enable an app to prevent a signalled operation by returning `false`
 * from the listener, for example {@link #event-beforeEventEdit}.
 *
 * In addition, all events from the Calendar's view are relayed through the Calendar.
 * For example, the `eventClick` of a `DayView` is relayed through the Calendar as its own {@link #event-eventClick}.
 *
 * This means that you can listen to events from the Calendar regardless of which view is
 * active.
 *
 * ## Customizing event rendering
 * ## Specifying a default calendar
 *
 * To configure the default calendar for your events, please use the {@link #config-defaultCalendar} config.
 *
 * ```javascript
 * new Calendar({
 *     defaultCalendar : 123 // the id of your default calendar
 * });
 * ```
 *
 * To change the default calendar at runtime, set the {@link #property-defaultCalendar} property:
 *
 * ```javascript
 * calendar.defaultCalendar = 456; // the id of your new default calendar
 * ```
 *
 * You may specify {@link #config-defaultCalendar} as `null` to specify that when an event is
 * {@link #config-autoCreate auto created}, it is not automatically assigned to a calendar.
 *
 * ## State saving
 *
 * By default the {@link #property-mode} and {@link #property-hideNonWorkingDays} properties are saved
 * when a {@link #config-stateProvider} is used.
 *
 * You can configure other properties to be part of the persistent state:
 *
 * ```javascript
 * new Calendar({
 *     stateful : [ 'date' ]
 * })
 * ```
 *
 * ## Accessibility
 *
 * Navigation and control of the Calendar is possible using the keyboard.
 *
 * A screen reader will announce the details and location of the focused item where possible.
 *
 * All items in the {@link #property-tbar} are focusable using the <kbd>Tab</kbd> key. The <kbd>Enter</kbd> key
 * activates the focused item.
 *
 * All items in the {@link #property-sidebar} are focusable using the <kbd>Tab</kbd> key. The
 * {@link #property-datePicker} has focusable child items. Its buttons are focusable using the <kbd>Tab</kbd> key. The
 * <kbd>Enter</kbd> key activates the focused button. The date cells are navigated using arrow keys. The
 * <kbd>Enter</kbd> key selects the focused date.
 *
 * Tabbing out of the sidebar will focus the first tabbable item in the {@link #property-viewContainer}. Usually, this
 * is a _link_ which activates and links to the month or week or date of the link.
 *
 *  - Year views contain links to months, weeks and days.
 *  - Month views contain links to weeks and days
 *  - Week views contain links to days
 *
 * The date cell structure of the calendar views is navigable using the <kbd>↑</kbd>, <kbd>↓</kbd>, <kbd>←</kbd> and
 * <kbd>→</kbd> keys. <kbd>Tab</kbd> is processed naturally, and when focused on a day cell, will move onto the first
 * tabbable element in that cell.
 *
 * _Links_ and events with date cells are naturally focusable using the <kbd>Tab</kbd> key.
 *
 * The containing date cell structure may be focused by pressing <kbd>Escape</kbd> when focus is on an event, or using
 * arrow keys when focused on an event. When a date cell is focused, pressing the <kbd>Tab</kbd> key will focus the
 * first item in the cell, either a date link or an event.
 *
 * ## Keyboard shortcuts
 *
 * Pressing <kbd>Home</kbd> focuses that view's selector button in the Calendar's toolbar. If
 * the mode selector button group is minified due to responsive sizing, the single mode selector button is focused.
 *
 * Pressing <kbd>1</kbd>-<kbd>9</kbd> switches to the mode at the selected index.
 *
 * Pressing <kbd>G</kbd> goes to a selected date.
 *
 * Pressing <kbd>T</kbd> goes to today.
 *
 * Pressing <kbd>Ctrl</kbd>+<kbd>D</kbd> (<kbd>Cmd</kbd>+<kbd>D</kbd> on MacOS) focuses the Calendar's current date in
 * the active view.
 *
 * Pressing <kbd>P</kbd> moves the current view backwards in time by its range.
 *
 * Pressing <kbd>N</kbd> moves the current view forwards in time by its range.
 *
 * Pressing <kbd>/</kbd> focuses the event filter input field in the sidebar (if present).
 *
 * Pressing <kbd>Enter</kbd> when focused on a day cell adds a new event in that cell and invokes the `EventEdit`
 * feature on it.
 *
 * Pressing <kbd>Enter</kbd> when focused on an event invokes the `EventEdit` feature on the focused event.
 *
 * Pressing <kbd>Space</kbd> when focused on a day cell invokes the `ScheduleMenu` feature on that cell.
 *
 * Pressing <kbd>Space</kbd> when focused on an event invokes the `EventMenu` feature on the focused event.
 *
 * Pressing <kbd>Escape</kbd> when focused on an event will focus the containing date cell.
 *
 * ### Mode switching
 *
 * Each mode may be configured with an {@link Calendar.widget.mixin.CalendarMixin#config-activationKey} which specifies
 * a key to switch to that mode. The default is the first character of the
 * {@link Calendar.widget.mixin.CalendarMixin#config-title}.
 *
 * This is the text that appears in the activation button for the mode.
 *
 * So in the English locale, the default mode activation keys are:
 *
 * - <kbd>D</kbd> for DayView
 * - <kbd>W</kbd> for WeekView
 * - <kbd>M</kbd> for MonthView
 * - <kbd>Y</kbd> for YearView
 * - <kbd>A</kbd> for AgendaView
 * - <kbd>L</kbd> for EventList
 *
 * ### Mode-specific keyboard shortcuts
 *
 * #### DayView and WeekView keyboard shortcuts:
 * - <kbd>+</kbd> zooms in (Increases the {@link Calendar.widget.DayView#property-hourHeight} by 2).
 * - <kbd>-</kbd> zooms out (Decreases the {@link Calendar.widget.DayView#property-hourHeight} by 2).
 *
 * #### AgendaView keyboard shortcuts:
 * - <kbd>Ctrl</kbd>+<kbd>R</kbd> (<kbd>Cmd</kbd>+<kbd>R</kbd> on MacOS) activates the
 * {@link Calendar.widget.AgendaView#property-settingsButton range settings menu}.
 *
 * The following Calendar features have their own keyboard shortcuts. Follow the links for details.
 * * {@link Calendar.feature.EventCopyPaste#keyboard-shortcuts EventCopyPaste}
 *
 * See [Our accessibility guide](#Scheduler/guides/advanced/a11y.md) for more information.
 *
 * For information on how to customize keyboard shortcuts, please see
 * [our guide](#Scheduler/guides/customization/keymap.md)
 *
 * ## Showing discrete, selected date ranges
 * It is possible to configure the {@link #config-datePicker} with {@link Core.widget.DatePicker#config-multiSelect}.
 *
 * When you select a range, or ranges of dates, *some* calendar modes are able to only show a subset of dates
 * in the range that they cover and will be automatically reconfigured to only show the dates you have selected.
 * These include:
 * - AgendaView      (mode type `'agenda'`)
 * - DayViews        (view type `'dayview'`) which you add to the modes - The default `day` and `week` modes have a
 *   fixed duration.
 * - ResourceView    (view type `'resourceview'`)
 * - DayResourceView (view type `'dayresourceview'`)
 * See the {@link #config-datePicker} for more details on this mode of operation.
 *
 * ## Integration with other Bryntum products
 * Bryntum Calendar is designed to integrate seamlessly with other Bryntum products. It consumes a common data package
 * with the `Scheduler`, `Gantt` and `TaskBoard` products.
 *
 * It may include a `Grid` or `Scheduler` or `TaskBoard` as one of its {@link #config-modes} with appropriate
 * licensing.
 *
 * ## Usage of an Enterprise tier Scheduler as a mode
 * A {@link Scheduler.view.Scheduler} may be used as a Calendar {@link #config-modes mode}. There is no
 * separate widget type for this - the mode is an ordinary `scheduler`:
 *
 * {@note}Bryntum Scheduler is a separate product, licensed separately from Bryntum Calendar, and the
 * Enterprise tier is a separate license from the lower tiers. A Calendar license alone does not entitle
 * you to use a Scheduler as a mode.{/@note}
 *
 * ```javascript
 * const calendar = new Calendar({
 *     date    : new Date(2023, 9, 12),
 *     project : new ProjectModelEnterprise({
 *         eventsData    : [],
 *         resourcesData : []
 *     }),
 *
 *     mode  : 'timeline',
 *     modes : {
 *         timeline : {
 *             type  : 'scheduler',
 *             title : 'Timeline'
 *         }
 *     }
 * });
 * ```
 *
 * A Scheduler mode inherits the Calendar's {@link Core.mixin.Tierable#config-tier}, so a Calendar
 * licensed at the Enterprise tier yields an Enterprise tier Scheduler mode. Specify `tier` on the mode
 * only to run it at a *lower* tier than the Calendar:
 *
 * ```javascript
 * modes : {
 *     timeline : {
 *         type : 'scheduler',
 *         // Deliberately run this mode below our own tier
 *         tier : 'community'
 *     }
 * }
 * ```
 *
 * ### The Enterprise tier task editor live-updates the UI
 * When an Enterprise tier mode is backed by a project which drives the scheduling engine, event editing
 * uses the Enterprise tier {@link Scheduler.feature.TaskEdit} feature rather than the Calendar's own
 * {@link Calendar.feature.EventEdit}. Calendar detects this and switches to it automatically.
 *
 * The task editor applies field changes to the event record *as they are made*, and the engine
 * reschedules immediately. The UI therefore updates live, while the editor is still open. A
 * consequence of this is that **the event bar the editor is aligned to may move**, or be removed and
 * re-created elsewhere. For example, stepping the start date forward moves the bar along the time
 * axis, and may move it to a different row, or in a Calendar view, into a different week.
 *
 * The event bar may also move for reasons unrelated to editing - most commonly because the user
 * scrolled the timeline.
 *
 * ### Controlling how the editor responds
 * Two {@link Scheduler.feature.TaskEditBase#config-editorConfig} options:
 *
 * - `scrollAction` (on the editor) - whether the editor tracks its target at all.
 *   `null` (standalone Scheduler default) stays put; `'realign'` (Calendar default) follows;
 *   `'hide'` hides on scroll. Calendar also sets `align.monitorTargetMutation` when realigning, so
 *   the editor keeps up when the bar is re-created elsewhere.
 * - `align.allowTargetOut` (on the align spec) - applies only while tracking. `true` stays visible
 *   when the target leaves the viewport, `false` hides.
 *
 * | Wanted behaviour                       | `scrollAction` | `align.allowTargetOut` |
 * |----------------------------------------|----------------|------------------------|
 * | Follow the bar (Calendar default)      | `'realign'`    | `true`                 |
 * | Stay where shown                       | `null`         | n/a                    |
 * | Cancel the edit when bar leaves view    | any tracking   | `false`                |
 * | Hide on any scroll                     | `'hide'`       | n/a                    |
 *
 * {@note}`allowTargetOut` is read from the editor's *initial* configuration; changing `editor.align`
 * after creation has no effect. Specifying `allowTargetOut : false` implies tracking.{/@note}
 *
 * #### Follow the event bar as it moves (the Calendar default)
 * A Calendar configures the mode's task editor with `scrollAction : 'realign'` and
 * `align.monitorTargetMutation`, so out of the box the editor tracks the event bar as the bar moves
 * and as the timeline is scrolled. This needs no configuration; configure it explicitly only to
 * combine it with other align options:
 *
 * ```javascript
 * features : {
 *     taskEdit : {
 *         editorConfig : {
 *             // Realign the editor when the schedule is scrolled
 *             scrollAction : 'realign',
 *
 *             align : {
 *                 align  : 'b-t',
 *                 offset : -10,
 *                 // Remain visible even if the event bar is scrolled out of view
 *                 allowTargetOut : true
 *             }
 *         }
 *     }
 * }
 * ```
 *
 * #### Leave the editor where it was shown
 * To restore the standalone Scheduler's behaviour, where neither scrolling nor a data change which
 * moves the event bar moves the editor, override the Calendar's default with `scrollAction : null`.
 * This is the least visually disruptive option when edits cause large reschedules:
 *
 * ```javascript
 * modes : {
 *     timeline : {
 *         type     : 'scheduler',
 *         features : {
 *             taskEdit : {
 *                 editorConfig : {
 *                     scrollAction : null
 *                 }
 *             }
 *         }
 *     }
 * }
 * ```
 *
 * #### Cancel the edit when the event bar scrolls out of view
 * `allowTargetOut : false` hides the editor, terminating the edit, as soon as the event bar leaves the
 * viewport. Because this option is meaningless without tracking, specifying it implies that the
 * target is monitored:
 *
 * ```javascript
 * features : {
 *     taskEdit : {
 *         editorConfig : {
 *             align : {
 *                 // Hide the editor when the event bar is scrolled out of view
 *                 allowTargetOut : false
 *             }
 *         }
 *     }
 * }
 * ```
 *
 * #### Hide the editor on any scroll
 * `scrollAction : 'hide'` hides the editor whenever a scroll invalidates its position, regardless of
 * whether the target is still in view:
 *
 * ```javascript
 * features : {
 *     taskEdit : {
 *         editorConfig : {
 *             scrollAction : 'hide'
 *         }
 *     }
 * }
 * ```
 *
 * ## Useful configs
 *
 * | Config                   | Description                                     |
 * |--------------------------|-------------------------------------------------|
 * | {@link #config-modes}    | View types to include in the Calendar           |
 * | {@link #config-mode}     | Initially active view mode                      |
 * | {@link #config-date}     | The active date for the Calendar                |
 * | {@link #config-sidebar}¹ | Sidebar configuration (date picker, filters)    |
 * | {@link #config-tbar}     | Toolbar with navigation and mode selector       |
 * | {@link #config-features} | Features to enable (drag, edit, tooltips, etc.) |
 *
 * ¹ Not available in the community edition.
 *
 * ## Tiers
 *
 * Calendar is available in the Community, Business and Enterprise tiers. Features are tiered, and each one shows a
 * badge for the lowest tier that includes it. See the [Product tiers and class names](#Calendar/guides/data/tiers.md)
 * guide.
 *
 * See the [Calendar features per tier](#Calendar/guides/basics/feature-availability.md) guide.
 *
 * @extends Core/widget/Panel
 *
 * @mixes Core/widget/mixin/Responsive
 * @mixes Core/mixin/Tierable
 * @mixes Calendar/mixin/CalendarStores
 * @mixes Scheduler/crud/mixin/CrudManagerView
 * @mixes Scheduler/view/mixin/RecurringEvents
 * @mixes Calendar/view/mixin/CalendarScroll
 * @mixes Calendar/view/mixin/EventHighlighting
 * @mixes Calendar/view/mixin/EventNavigation
 * @mixes Calendar/view/mixin/EventSelection
 *
 * @features Calendar/feature/AI
 * @features Calendar/feature/CalendarDrag
 * @features Calendar/feature/EventBuffer
 * @features Calendar/feature/EventCopyPaste
 * @features Calendar/feature/EventEdit
 * @features Calendar/feature/EventMenu
 * @features Calendar/feature/EventTooltip
 * @features Calendar/feature/ExternalEventSource
 * @features Calendar/feature/LoadOnDemand
 * @features Calendar/feature/ScheduleMenu
 * @features Calendar/feature/ScheduleTooltip
 * @features Calendar/feature/TimeRanges
 * @features Calendar/feature/WeekExpander
 * @features Calendar/feature/experimental/ExcelExporter
 * @features Calendar/feature/print/Print
 *
 * @classtype calendar
 *
 * @widget
 * @tier community
 */
export default class Calendar extends Panel.mixin(
    SchedulerInterface,
    CalendarStores,
    SchedulerHost,
    Featureable,
    CrudManagerView,
    CalendarScroll,
    EventHighlighting,
    EventNavigation,
    EventSelection,
    CurrentConfig,
    Responsive,
    State,
    TimeZonable,

    Tierable
) {

    // <debug>
    // region Localization test
    static localization = [
        'L{loadFail}',
        'L{noResources}',
        'L{months}'
    ];
    // endregion
    // </debug>

    //region Config
    static $name = 'Calendar';

    // Factoryable type name
    static type = 'calendar';

    static configurable = {
        // region Hidden configs
        /**
         * @hideevents eventSelectionChange
         */
        /**
         * @hideconfigs htmlCls, autoUpdateRecord, record, textContent, content, html
         */
        /**
         * @hideproperties content, html
         */

        // endRegion



        // Insert features config here because it is inherited from Featurable, which is @internal
        // and therefore does not show up in the API docs in its default state.
        /**
         * Specifies the features to create and associate with the Calendar.
         *
         * The keys of this object are the names of features. The values are config objects for those features.
         *
         * ```javascript
         *     features : {
         *         // Exclude the CalendarDrag feature from the Calendar
         *         drag : false,
         *
         *         // Change the default configuration of a feature
         *         eventTooltip : {
         *             showOn : 'hover'
         *         }
         *     }
         * ```
         *
         * ### Using Calendar Features with React, Angular and Vue Wrappers
         * {@note}
         * Setting this property has no effect when using framework wrappers.
         *
         * When using framework wrappers, features must be configured via `featureNameFeature` properties.
         * See [Framework Integration Guide](#Calendar/guides/integration/react/guide.md#configuring-features) for details.
         * {/@note}
         * @config {Object} features
         */
        /**
         *
         * After construction, this property can be used to access the Calendar's features and
         * reconfigure them.
         *
         * For example:
         *
         * ```javascript
         *  myCalendar.features.eventTooltip.disabled = true;
         * ```
         * @member {Object} features
         */

        layout : 'hbox',



        localizableProperties : [
            'autoCreate.newName'
        ],

        crudManager : null,

        features : {
            drag           : {},

            eventEdit      : {},
            eventTooltip   : {},
            scheduleMenu   : {},
            eventMenu      : {}
        },



        eventContainerSelector : '.b-event-renderer,.b-overflow-popup',

        responsive : {
            small : {
                when : 600,

                once : {
                    mode : 'day'
                },
                dateFormat : 'MMM DD, YYYY'
            },

            medium : {
                when : 800
            },

            large : {
                overlaySidebar : false
            },

            '*' : {
                overlaySidebar : true,

                once : {
                    mode : 'week'
                }
            }
        },

        responsiveRoot : true,

        stateful : [
            'hideNonWorkingDays',
            'mode'
        ],

        /**
         * A {@link Core.widget.Toolbar} which displays and manages the calendar title
         * and the buttons which manipulate the Calendar's temporal navigation and
         * active mode.
         *
         * Provided widgets include:
         *
         * - `toggleSidebar` A button to collapse and expand the {@link #config-sidebar}. Not available in the community
         *   edition.
         * - `todayButton` A button which moves the active view to include today's date.
         * - `prevButton` A button which moves the active view to its previous time span.
         * <br>__Note:__ The active view must yield a {@link Calendar.widget.mixin.CalendarMixin#property-stepUnit}
         * to use as the tooltip hint for this button, otherwise it will be disabled.
         * - `nextButton` A button which moves the active view to its next time span.
         * <br>__Note:__ The active view must yield a {@link Calendar.widget.mixin.CalendarMixin#property-stepUnit}
         * to use as the tooltip hint for this button, otherwise it will be disabled.
         * - `viewDescription` A widget which is used to display the `description` property of the active view
         *  (e.g. "October 2025" in month view)
         * - `spacer` A spacer widget which pushes following items to be aligned to the right.
         * - `modeSelector` A {@link Calendar.widget.ModeSelector} which contains buttons for selecting which
         *   view is active. This is hidden if only one {@link #config-modes mode} is enabled in the Calendar.
         *
         * These have `weight` values 100 to 700. New items can be inserted at any position by
         * configuring them with an appropriate `weight`.
         *
         * @member {Core.widget.Toolbar} tbar
         * @readonly
         * @category Content
         */
        /**
         * A config object containing definitions of the toolbar of the Calendar.
         *
         * Its `items` property defines the buttons and informational widgets
         * provided by default.
         *
         * There are several provided widgets, each of which may be reconfigured using
         * an object, or disabled by configuring them as `null`.
         *
         * ```javascript
         * tbar : {
         *     items : {
         *         prevButton    : null,
         *         toggleSidebar : null
         *     }
         * }
         * ```
         *
         * Provided widgets include:
         *
         * - `toggleSidebar` A button to collapse and expand the {@link #config-sidebar}. Not available in the community
         *    edition.
         * - `todayButton` A button which moves the active view to include today's date.
         * - `prevButton` A button which moves the active view to its previous time span.
         * <br>__Note:__ The active view must yield a {@link Calendar.widget.mixin.CalendarMixin#property-stepUnit}
         * to use as the tooltip hint for this button, otherwise it will be disabled.
         * - `nextButton` A button which moves the active view to its next time span.
         * <br>__Note:__ The active view must yield a {@link Calendar.widget.mixin.CalendarMixin#property-stepUnit}
         * to use as the tooltip hint for this button, otherwise it will be disabled.
         * - `viewDescription` A widget which is used to display the `description` property of the active view.
         * - `spacer` A spacer widget which pushes following items to be aligned to the right.
         * - `modeSelector` A {@link Calendar.widget.ModeSelector} which contains buttons for selecting which
         *   view is active. This is hidden if only one {@link #config-modes mode} is enabled in the Calendar.
         *
         * These have `weight` values 100 to 800. New items can be inserted at any position by
         * configuring them with an appropriate `weight`.
         *
         * Configure this as `null` to remove the toolbar entirely.
         * @config {Array<ContainerItemConfig|String>|ToolbarConfig|CalendarToolbarConfig|null}
         */
        tbar : {
            cls       : 'b-calendar-toolbar',
            ariaLabel : 'L{Calendar.toolbar}',
            items     : {

                todayButton : {
                    text    : 'L{Calendar.Today}',
                    cls     : 'b-cal-nav-item b-calendar-today-button',
                    icon    : 'b-icon-calendar-day',
                    onClick : 'up.shiftToNow',
                    weight  : 200
                },
                prevButton : {
                    onClick   : 'up.shiftPrevious',
                    cls       : 'b-cal-nav-item',
                    rendition : 'text',
                    icon      : 'b-icon-previous',
                    weight    : 300
                },
                nextButton : {
                    onClick   : 'up.shiftNext',
                    cls       : 'b-cal-nav-item b-cal-nav-next',
                    rendition : 'text',
                    icon      : 'b-icon-next',
                    weight    : 400
                },
                viewDescription : {
                    cls          : 'b-calendar-view-desc',
                    type         : 'widget',
                    flex         : '',
                    html         : '\xa0',
                    overflowable : 'none',
                    weight       : 500
                },
                spacer : {
                    type   : 'widget',
                    cls    : 'b-toolbar-fill',
                    weight : 600
                },
                modeSelector : {
                    type   : 'calendarModeSelector',
                    weight : 700
                }
            }
        },

        /**
         * The child items of the Calendar view.
         *
         * By default, the Calendar contains two child items laid out as a horizontal flexbox arrangement:
         *
         * - `sidebar` The sidebar which by default contains a clickable date picker to show and/or select
         * the active date, and a Calendar filter UI to filter events belonging to the calendars
         * defined in the {@link Calendar.mixin.CalendarStores#config-resourceStore}. It has `weight : -10`
         * by default, placing it at the `inline-start` side of the Calendar. Not available in the community edition.
         * - `viewContainer` A {@link Core.widget.layout.Card card layout}
         * {@link Core.widget.Container container} which contains the enabled {@link #config-modes}. It has `weight : 100`
         * by default, placing it after the sidebar.
         *
         * These items may be reconfigured by specifying them as an object,
         *
         * Extra items may be added to the Calendar's child items by specifying them here. These will be siblings
         * to the `sidebar` and `viewContainer` in the Calendar's horizontal flexbox layout. They may be positioned
         * relative to those using their {@link Core.widget.Widget#config-weight} property.
         *
         * If a Calendar view is added as an item here, it will be initialized with the Calendar's {@link #property-project}
         * and the Calendar's {@link #property-date} unless these are specified by the application.
         *
         * The resulting view will operate as an independent view of the project, not part of the
         * Calendar's{@link #property-modes}. It will automatically be updated to be in sync with the Calendar's date
         * unless {@link Calendar.widget.mixin.CalendarMixin#config-syncViewDate} is configured as `false`.
         *
         * For example, to add a collapsible `DayAgendaView` to the right of the `viewContainer`:
         *
         * ```javascript
         * new Calendar({
         *     appendTo : document.body,
         *
         *     crudManager : {
         *         loadUrl  : '/data-providing-url',
         *         syncUrl  : '/data-update-url',
         *         autoLoad : true,
         *         autoSync : true
         *     },
         *
         *     // Add a DayAgendaView to the right of the viewContainer which always shows a list of events for
         *     // the Calendar's active date.
         *     items : {
         *         dayAgenda : {
         *             type         : 'dayagenda',
         *             title        : 'Details',
         *             weight       : 200,
         *             collapsible  : true,
         *             flex         : '0 0 16em',
         *             allDayEvents : {
         *                 fullWeek : false
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * @config {Object}
         */
        items : {},

        /**
         * Configuration options to change how the subordinate {@link Core.widget.Container} which contains
         * the calendar's child views is created.
         *
         * After instantiation, this Container may be referenced using the {@link #property-viewContainer} property
         *
         * For example:
         * ```javascript
         * new Calendar({
         *     appendTo : document.body,
         *
         *     crudManager : {
         *         loadUrl  : '/data-providing-url',
         *         syncUrl  : '/data-update-url',
         *         autoLoad : true,
         *         autoSync : true
         *     },
         *
         *     // Reconfigure our viewContainer to change which "mode" is active upon startup
         *     viewContainer : {
         *         // No sliding in or out of child views
         *         layout : {
         *             animateCardChange : false
         *         }
         *     }
         * });
         * ```
         * @config {ContainerConfig} viewContainer
         */
        viewContainer : {
            $config : 'lazy',
            value   : {
                type   : 'container',
                role   : 'presentation',
                weight : 100,
                cls    : {
                    'b-calendar-view-container' : 1
                },
                flex   : '1 1 100%',
                layout : {
                    type : 'card'
                },
                scrollable : {
                    overflowY : true,
                    overflowX : true
                },
                suppressChildHeaders : true,
                layoutStyle          : {
                    padding : 0
                },
                internalListeners : {
                    beforeActiveItemChange : 'up.onBeforeViewContainerCardChange',
                    activeItemChange       : 'up.onViewContainerCardChange'
                }
            }
        },

        /**
         * Set to `true` to show the "Weekends" toggle button of the mode selector. Alternatively, this config
         * can be a {@link Core.widget.Button} config object to configure the button.
         *
         * See {@link Calendar.widget.ModeSelector#property-includeWeekendsButton} and
         * {@link Calendar.widget.ModeSelector#property-includeWeekendsMenuItem} for more information on
         * accessing the resulting widget(s).
         * @config {Boolean|ButtonConfig}
         * @default
         */
        includeWeekendsButton : false,

        layoutStyle : {
            padding  : 0,
            flexFlow : 'row nowrap'
        },

        /**
         * The {@link #config-modes} as widget instances.
         * @member {Object<String,CalendarView>} modes
         */
        /**
         * Configures the view modes which are to be available in this Calendar.
         *
         * Normally, the property names in this object are the `type` names of the eight standard
         * Calendar views, and so the corresponding configuration object should be an object which
         * configures that type:
         *
         * - agenda - Configuration for a {@link Calendar.widget.AgendaView}
         * - year - Configuration for a {@link Calendar.widget.YearView}
         * - month - Configuration for a {@link Calendar.widget.MonthView}
         * - week - Configuration for a {@link Calendar.widget.WeekView}
         * - day - Configuration for a {@link Calendar.widget.DayView}
         * - list - Configuration for a {@link Calendar.widget.EventList}
         * - resource - Configuration for a {@link Calendar.widget.ResourceView}
         * - dayresource - Configuration for a {@link Calendar.widget.DayResourceView}
         * - dayagenda - Configuration for a {@link Calendar.widget.DayAgendaView}
         * - monthagenda - Configuration for a {@link Calendar.widget.MonthAgendaView}
         * - monthgrid - Configuration for a {@link Calendar.widget.MonthGrid}
         * - yearplanner - Configuration for a {@link Calendar.widget.YearPlanner}
         *
         * By default, the following modes are included:
         *
         * - day
         * - week
         * - month
         * - year
         * - agenda
         *
         * Any of these may be reconfigured from its default, or omitted from the UI, by configuring the
         * property as `null`:
         *
         * ```javascript
         * modes : {
         *     agenda : {
         *         title : 'Conference events'
         *     },
         *     // Remove year view completely
         *     year : null,
         *     // Add an event list. This type of view is not included by default
         *     list : {
         *         range : 'month'
         *     }
         * }
         * ```
         *
         * Note that the default order of the modes as listed above can be changed by configuring the
         * modes with a `weight` value which causes them to be sorted into ascending weight order.
         *
         * The property name of a built-in mode names the *mode*, not the view class which renders it. The class comes
         * from the block's `type`, which defaults to the mode name, so a mode may be rendered by another view type
         * while keeping its name, its button and its {@link #config-mode} string. For example, the `month` mode may be
         * a {@link Calendar.widget.MonthAgendaView}, which suits phone sized displays. Its
         * {@link Calendar.widget.MonthAgendaView#config-agenda} below the month is usually an
         * {@link Calendar.widget.AgendaView}, but may be any view type:
         *
         * ```javascript
         * modes : {
         *     month : {
         *         type   : 'monthagenda',
         *         agenda : {
         *             type         : 'dayview',
         *             dayStartTime : 8
         *         }
         *     }
         * }
         * ```
         *
         * In TypeScript, a block with a `type` is checked as that view's config (see
         * {@link #typedef-TypedCalendarViewConfig}), and a block without one as the mode's own view. To decide the type
         * at runtime instead, change it in a {@link #event-beforeCreateMode} listener and apply the configs which only
         * that view declares there too, casting the block to that view's config type, as the `month-agenda` framework
         * demos do.
         *
         * An error inside a block which specifies a `type` also produces a second error on the `type` line, and that
         * second error names a different view. Correct the config which the other error reports, not the `type`.
         *
         * Non-Calendar widgets, outside of those eight types may be specified by including a `type` property
         * in the configuration block. This is the type string of any widget.
         *
         * If using a non-Calendar widget the widget must contain the following properties:
         *
         * - `title` A string used as the button text in the mode activation button.
         * - `description` A string used as the Calendar title when the mode is activated.
         *
         * For example, you might want to use a scheduler as a calendar mode. This can be done like this:
         *
         * ```javascript
         *     modes : {
         *         myScheduler : {
         *             // If the mode name is not a standard Calendar view
         *             // we need to specify the type of Widget we are configuring here.
         *             type        : 'scheduler',
         *
         *             // This text goes into the activation button
         *             title : 'Timeline',
         *             columns : [
         *                 { type : 'resourceInfo', field : 'name', text : 'Staff/Resource', width : 175 }
         *             ],
         *
         *             features : {
         *                 nonWorkingTime     : true,
         *                 timeRanges         : true,
         *                 resourceTimeRanges : true
         *             },
         *
         *             workingTime : {
         *                 fromHour : 7,
         *                 toHour   : 22
         *             },
         *         }
         *     }
         * ```
         *
         * @property {ContainerItemConfig} modes.custom Settings specific to custom mode. `custom` may be any `String` property within this configuration object.
         * @ts-property modes.custom {[mode: string]}:{ContainerItemConfig|boolean|null|undefined}
         *
         * @property {AgendaViewConfig|TypedCalendarViewConfig|Boolean|null} [modes.agenda] Settings specific to `agenda` mode. Specify `null` or `false` to disable this mode.
         * @property {YearViewConfig|TypedCalendarViewConfig|Boolean|null} [modes.year] Settings specific to `year` mode. Specify `null` or `false` to disable this mode.
         * @property {MonthViewConfig|TypedCalendarViewConfig|Boolean|null} [modes.month] Settings specific to `month` mode. Specify `null` or `false` to disable this mode.

         * @property {WeekViewConfig|TypedCalendarViewConfig|Boolean|null} [modes.week] Settings specific to `week` mode. Specify `null` or `false` to disable this mode.
         * @property {DayViewConfig|TypedCalendarViewConfig|Boolean|null} [modes.day] Settings specific to `day` mode. Specify `null` or `false` to disable this mode.
         * @property {EventListConfig|TypedCalendarViewConfig|Boolean|null} [modes.list] Settings specific to `list` mode. This mode is disabled by default.

         * @config {Object} [modes]
         * @default
         */
        modes : {
            day    : {},
            week   : {},
            month  : {},
            year   : {},
            agenda : {}
        },

        /**
         * Which of the built-in {@link #config-modes} should be the initially active view.
         * @config {'agenda'|'year'|'month'|'multiweek'|'week'|'day'|'list'|'resource'|'dayresource'|'dayagenda'|'monthagenda'|'monthgrid'|'yearplanner'|String}
         * @default week
         */
        mode : {
            $config : 'lazy',
            value   : 'week'
        },

        /**
         * The default settings applied to all child views.
         *
         * This is a dynamic object, and mutations of it will reapply the new value to all
         * child views.
         * @member {CalendarModeDefaults} modeDefaults
         */
        /**
         * An object to use to configure common properties for all {@link #config-modes} prior to their construction.
         *
         * In TypeScript, {@link #typedef-CalendarModeDefaults} lists the configs of every view type for code
         * completion. Any other object is accepted too, so a renderer or a listener which declares its own payload
         * type needs no cast.
         * @config {CalendarModeDefaults}
         */
        modeDefaults : {
            value : null  // use the value config so that the changer always runs so that Proxy is created
        },



        /**
         * The date which this Calendar encapsulates as its active date.
         *
         * This is usually selected by clicking in the {@link #property-sidebar}'s date picker
         * or by navigating the view forwards or backwards in time.
         *
         * If __set__ as a string, the format should be in `YYYY-MM-DD` format.
         *
         * The __read__ value is always a Date.
         *
         * By default, this is also changed by clicking in day cells of the active view.
         *
         * This may be set programatically which will cause the currently active view to navigate to
         * encapsulate that date.
         * @member {Date} date
         * @accepts {Date|String}
         */
        /**
         * The date which the Calendar, its {@link #property-sidebar}'s date picker, and
         * its active view should encapsulate upon creation.
         *
         * If configured as a string, the format should be in `YYYY-MM-DD` format.
         *
         * This defaults to current date unless {@link #state-saving state saving} has been
         * configured to save the date, in which case the calendar will start up showing the date
         * that was saved in state.
         * @config {Date|String}
         */
        date : {
            $config : {
                equal : 'date'
            },
            value : new Date()
        },

        /**
         * A {@link Core.helper.DateHelper} format string to use to create date output for
         * view descriptions.
         * @prp {String}
         */
        dateFormat : 'MMMM DD, YYYY',

        scrollManager : {
            $config : ['lazy', 'nullify'],
            value   : {
                direction : 'vertical'
            }
        },

        viewUpdateDelay : 2000,

        /**
         * Get/set the calendar's read-only state. When set to `true`, any UIs for modifying data are disabled.
         * @member {Boolean} readOnly
         */
        /**
         * Configure as `true` to make the calendar read-only, by disabling any UIs for modifying data.
         *
         * __Note that checks MUST always also be applied at the server side.__
         * @config {Boolean}
         * @default false
         */
        readOnly : null,

        /**
         * Set to `false` if you don't want to allow events overlapping times for any one resource (defaults to true).
         * @config {Boolean}
         * @private
         * @default
         */
        allowOverlap : true,



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
         * @property {String} [gesture='dblclick'] The event name which should trigger event creation at the event's position.
         * @property {Function|String} [newName='New Event'] The name of an event created using `autoCreate` or a function to call which yields the name.
         * The following parameters are passed:
         * - <span class="name">view : <span class="type">CalendarMixin</span></span><div class="description">The view in which the event is being created.</div>
         * - <span class="name">startDate : <span class="type">String</span></span><div class="description">The start date of the event being created.</div>
         * - <span class="name">resourceRecord : <span class="type">ResourceModel</span></span><div class="description">The resource of the event being created.</div>
         * @property {String} [step='15 minutes'] The time unit by which to round the start click point of auto created events.
         * _Only for views which have a granularity of less than one day such as `WeekView` and `DayView`_.
         *
         * For views which show whole days, the start defaults to 8am.
         *
         * This is a string in the format required by {@link Core.helper.DateHelper#function-parseDuration-static}.
         *
         * This value is also used for the {@link Core.widget.TimeField#property-step} value in the
         * {@link Calendar.feature.EventEdit}'s time input field.
         *
         * @property {String} [duration='1 hour'] The default duration for auto created events.
         * @property {Number|String} [startHour=8] The default start hour for auto created events
         * in views where the time granularity is one day. In a DayView or WeekView where a mouse event position
         * will translate to a time of day, this is not used.
         *
         * This is the hour of the day to start the event at. It can be fractional or an HH:MM:SS time string.
         * @prp {Object|String|Boolean}
         * @default
         */
        autoCreate : {
            gesture   : 'dblclick',
            newName   : 'L{Object.newEvent}',
            step      : '15 minutes',
            duration  : '1 hour',
            startHour : 8
        },

        focusable : false,

        // The common Navigator needs to know this
        eventCls : 'b-cal-event',

        /**
         * The week start day to be used throughout this Calendar, 0 meaning Sunday, 6 meaning Saturday.
         *
         * This propagates into all owned {@link #config-modes}.
         *
         * Defaults to {@link Core.helper.DateHelper#property-weekStartDay-static}. When the default value is used, changing locale
         * will dynamically change the week start day for the calendar and all {@link #config-modes}.
         *
         * __If__ this is configured in from the start, then locale values for the week start day
         * will __not__ apply.
         *
         * For example:
         * ```javascript
         * new Calendar({
         *     // Apply to this Calendar only
         *     weekStartDay : 1 // Week starts on Monday
         *     //....
         * });
         * ```
         *
         * @config {Number} [weekStartDay]
         */
        weekStartDay : false,

        /**
         * Configure as `true` to hide {@link #config-nonWorkingDays} for each calendar view
         * @prp {Boolean}
         */
        hideNonWorkingDays : null,

        /**
         * Non-working days as an object where keys are day indices, 0-6 (Sunday-Saturday), and the value is `true`.
         *
         * This propagates into all owned {@link #config-modes}.
         *
         * Defaults to {@link Core.helper.DateHelper#property-nonWorkingDays-static}. When the default value is used, changing locale
         * will dynamically change the week start day for the calendar and all {@link #config-modes}.
         *
         * __If__ this is configured in from the start, then locale values for the week start day
         * will __not__ apply.
         *
         * Both header and event cells for non working days get the CSS class `b-non-working-day` added.
         *
         * Note that this is independent of and in addition to weekend days. Cells for Saturday and
         * Sunday always get the CSS class `b-weekend` added.
         *
         * For example:
         * ```javascript
         * new Calendar({
         *     // Apply to this Calendar only
         *     nonWorkingDays : {
         *         0 : true // Only Sunday is non-working day
         *     },
         *     //....
         * });
         * ```
         *
         * This may be updated dynamically:
         *
         * ```javascript
         * // Make Mondays non-working. If hideNonWorkingDays is set, Mondays will disappear
         * myCalendar.nonWorkingDays['1'] = true;
         * ```
         *
         * @prp {Object<Number,Boolean>} [nonWorkingDays]
         */
        nonWorkingDays : false,

        coreHours : null,

        /**
         * Event which is used to show context menus via the context menu features
         * {@link Calendar.feature.EventMenu} and {@link Calendar.feature.ScheduleMenu}.
         * Available options are: 'contextmenu', 'click', 'dblclick'.
         * @config {'contextmenu'|'click'|'dblclick'}
         * @default
         * @category Misc
         */
        contextMenuTriggerEvent : 'contextmenu',

        /**
         * Set to `true` to listen for CTRL-Z (CMD-Z on Mac OS) keyboard event and trigger undo (redo when SHIFT is pressed).
         * Only applicable when using a {@link Core.data.stm.StateTrackingManager}.
         * @config {Boolean}
         * @default
         * @category Misc
         */
        enableUndoRedoKeys : true,

        /**
         * Path to load resource images from. Used by the resource headers in ResourceView and by
         * {@link Calendar.widget.mixin.CalendarMixin#config-showResourceAvatars} in event-displaying
         * modes.
         *
         * This is used to show resource avatars using the resource's
         * {@link Scheduler/model/ResourceModel#field-image} or
         * {@link Scheduler/model/ResourceModel#field-imageUrl} fields:
         *
         * * `image` represents image name inside the specified `resourceImagePath`,
         * * `imageUrl` represents fully qualified image URL.
         *
         * If an image is not specified for a resource, or the image is not found, the resource's
         * initials will be displayed.
         * @config {String}
         * @category Misc
         */
        resourceImagePath : null,

        /**
         * The minimum date to which the `startDate` of any child view may be navigated.
         * @member {Date} minDate
         */
        /**
         * The minimum date to which the `startDate` of any child view may be navigated.
         * @config {Date|String}
         */
        minDate : null,

        /**
         * The maximum date to which the `endDate` of any child view may be navigated.
         * @member {Date} maxDate
         */
        /**
         * The maximum date to which the `endDate` of any child view may be navigated.
         * @config {Date|String}
         */
        maxDate : null,



        /**
         * An optional CSS class name to add to calendar date cells which encapsulate the calendar's
         * active {@link #property-date}.
         *
         * There is no theme rule connected to this date, so no built-in rendition of the active date.
         * The application may add view-specific CSS rules to provide visual indications.
         * @prp {String}
         */
        activeDateCls : null,

        /**
         * The default key shortcuts for the Calendar.
         *
         * The default mappings are:
         * - `Home   : 'focusModeSelector'` - Focus the mode selector
         * - `p      : 'shiftPrevious'` - Shift the view to the previous period
         * - `n      : 'shiftNext'` - Shift the view to the next period
         * - `Ctrl+d : 'focusCurrentDate'` - Focus the current date cell in the current active view
         * - `t      : 'shiftToNow'` - Shift the view to today
         * - `g      : 'gotoDate'` - Go to a specific date
         * - `/      : 'focusEventFilter'` - Focus the event filter field
         * - `[0-9]  : 'onDigitKey'` - Switch to the modes by their one-based index in the mode selector
         *
         * These can be overridden if you need to change the mappings. For example a German application might use
         *
         * ```javascript
         * keyMap : {
         *     z : 'shiftPrevious',     // Zurück
         *     w : 'shiftNext',         // Weiter
         *     h : 'shiftToNow'         // Heute
         *     Home : 'focusCurrentDate // Jump into the active view on Home
         * }
         * ```
         *
         * @config {Object<String,KeyMapConfig>}
         */
        keyMap : {
            Enter     : 'onEnterKey',
            Escape    : 'onEscapeKey',
            Home      : 'focusModeSelector',
            p         : 'shiftPrevious',
            n         : 'shiftNext',
            t         : 'shiftToNow',
            g         : 'gotoDate',
            'Ctrl+d'  : 'focusCurrentDate',
            '/'       : 'focusEventFilter',
            [/\d/]    : 'onDigitKey',
            'Shift+?' : 'showKeyboardActions'
        },

        gotoDatePopup : {
            $config : 'lazy',
            value   : {
                cls        : 'b-calendar-goto-date-popup',
                type       : 'popup',
                title      : 'L{Calendar.gotoDate}',
                floating   : false,
                positioned : true,
                centered   : true,
                items      : {
                    dateField : {
                        type : 'datefield'
                    }
                },
                bbar : {
                    items : {
                        cancel : {
                            text    : 'L{Object.Cancel}',
                            onClick : 'up.close'
                        },
                        go : {
                            text    : 'L{Object.go}',
                            onClick : 'up.onGotoDateClick'
                        }
                    }
                },
                keyMap : {
                    Enter : 'up.onGotoDateClick'
                }
            }
        },

        /**
         * The names of properties which are propagated down from the Calendar to child views
         * unless the view has its own value for that property.
         * @config {String[]}
         * @advanced
         */
        propagatedConfigs : {
            value : [
                'dateFormat',
                'date',
                'rtl',
                'project',
                'readOnly',
                'weekStartDay',
                'hideNonWorkingDays',
                'coreHours',
                'minDate',
                'maxDate',
                'resourceImagePath',
                'visibleStartTime',
                'visibleEndTime',
                'filterEventResources'
            ],
            $config : {
                merge : 'distinct'
            }
        },

        detectCSSCompatibilityIssues : true,

        // For Scheduler feature compatibility
        transition : {},

        keyboardActionsPopup : {
            $config : 'lazy',
            value   : {
                type       : 'popup',
                cls        : 'b-calendar-keyboard-actions-popup',
                centered   : true,
                closable   : true,
                scrollable : {
                    overflowY : true
                }
            }
        },

        testConfig : {
            viewUpdateDelay : 5,

            // Test environment must be prevented from clicking the UI very fast while network IO
            // is in flight. LoadOnDemand testing was susceptible to this.
            loadMask : {
                text      : 'L{GridBase.loadMask}',
                showDelay : 0
            },

            detectCSSCompatibilityIssues : false
        }
    };

    static get delayable() {
        return {
            refresh : {
                type              : 'raf',
                cancelOutstanding : true
            },
            syncUIWithActiveView : {
                type              : 'buffer',
                delay             : 1,
                cancelOutstanding : true
            }
        };
    }

    //endregion

    compose() {
        const { includeWeekendsButton, navigatorPlacement } = this;

        return {
            class : {
                [`b-calendar-nav-${navigatorPlacement || 'toolbar'}`] : 1,
                'b-calendar-include-weekends-button'                  : includeWeekendsButton
            }
        };
    }

    /**
     * Yields `true` if the Calendar is in a read-only state, either because the Calendar itself is read-only,
     * or the currently active view is read-only.
     * This is used by Features to determine if they should enable functionality that modifies the Calendar data.
     * @member {Boolean}
     * @readonly
     * @internal
     * @category Internal
     */
    get isUIReadOnly() {
        return this.readOnly || this.activeView.readOnly;
    }

    //region Overrides

    applyState() {
        // We want to inhibit multiple refreshes during the config changes that this will apply.
        // If we set the _hidden flag, views will queue any refreshes until we trigger the paint event.
        this._hidden = true;
        super.applyState(...arguments);
        this._hidden = false;
        this.triggerPaint();
    }



    onShowOverflowPopup({ overflowPopup }) {
        this.addCls('b-overflow-popup-visible');
        overflowPopup.ion({
            hide : () => this.removeCls('b-overflow-popup-visible'),
            once : true
        });
    }

    //endregion

    //region events

    /**
     * Fires before a mode is created. The configuration block is passed to the handler for possible modification.
     * @event beforeCreateMode
     * @param {Calendar.view.Calendar} source This Calendar
     * @param {String} mode The mode name about to be created.
     * @param {CalendarViewConfig} config The configuration block of the mode about to be created. Any property, including the `type` may be changed.
     * @preventable
     */

    /**
     * Fires before an event is removed. Can be triggered by user pressing <kbd>Delete</kbd> or <kbd>Backspace</kbd> or by the
     * event editor. Can for example be used to display a custom dialog to confirm deletion, in which case
     * records should be "manually" removed after confirmation:
     *
     * ```javascript
     * calendar.on({
     *    beforeEventDelete({ eventRecords, context }) {
     *        // Show custom confirmation dialog (pseudo code)
     *        confirm.show({
     *            listeners : {
     *                onOk() {
     *                    // Remove the events on confirmation
     *                    context.finalize(true);
     *                },
     *                onCancel() {
     *                    // do not remove the events if "Cancel" clicked
     *                    context.finalize(false);
     *                }
     *            }
     *        });
     *
     *        // Prevent default behaviour
     *        return false;
     *    }
     * });
     * ```
     *
     * @event beforeEventDelete
     * @param {Calendar.view.Calendar} source  The Calendar instance
     * @param {Scheduler.model.EventModel[]} eventRecords  The records about to be deleted
     * @param {Object} context  Additional removal context:
     * @param {Function} context.finalize  Function to call to finalize the removal.
     *      Used to asynchronously decide to remove the records or not. Provide `false` to the function to
     *      prevent the removal.
     * @param {Boolean} [context.finalize.removeRecords = true]  Provide `false` to the function to prevent
     *      the removal.
     * @preventable
     */

    /**
     * Fires when a day spanning event is found, and the date to which its encapsulating event bar
     * extends has been calculated.
     *
     * The default result in the event's `propagateEndDate` property may be mutated by a listener.
     *
     * Note that this is an ending point in time, it does *not* refer to a 24 hour block. So setting
     * the `propagateEndDate` to `new Date(2022, 1, 10)` means that the event bar will occupy cells
     * up to and including February 9 2022 and no further.
     *
     * This is relayed from all modes, so a single listener may be used, for example:
     *
     * ```javascript
     * new Calendar({
     *     listeners : {
     *         eventPropagate(eventData) {
     *             // If the event spills into the next day but not further
     *             // then we do not want an extended event bar.
     *             // An arrow will indicate that it continues rightwards.
     *             if (eventData.eventEndDate < DateHelper.add(eventData.date, 2, 'd')) {
     *                 eventData.propagateEndDate = DateHelper.add(DateHelper.clearTime(eventData.eventRecord.startDate), 1, 'd');
     *             }
     *         }
     *     }
     * });
     * ```
     *
     * The `eventEndDate` in the data block may also be changed to override the event's real end date.
     * This will mean that there will be no arrow indicating that the event continues:
     *
     * ```javascript
     * new Calendar({
     *     listeners : {
     *         eventPropagate(eventData) {
     *             // If the event spills into the next day but not further
     *             // then we do not want an extended event bar.
     *             // Because we override the eventEndDate, no arrow will be present
     *             // to indicate any continuation.
     *             if (eventData.eventEndDate < DateHelper.add(eventData.date, 2, 'd')) {
     *                 eventData.propagateEndDate = eventData.eventEndDate = DateHelper.add(DateHelper.clearTime(eventData.eventRecord.startDate), 1, 'd');
     *             }
     *         }
     *     }
     * });
     * ```
     *
     * @event eventPropagate
     * @param {CalendarView} source The view which triggered the event.
     * @param {Date} eventEndDate The end date for which to calculate the propagate end date.
     * @param {Date} propagateEndDate The system-calculated end point of the event bar.
     * @param {Boolean} isAllDay `true` if the event is an all day event, or spans multiple days.
     * @param {Boolean} isOverflow `true` if this is being called as part of further propagation.
     * @param {Boolean} overflows `true` if the event extends into future cells.
     * @param {Scheduler.model.EventModel} eventRecord The event record being propagated.
     * @param {Date} date The date from which the event is being propagated.
     */

    /**
     * Fires when a key is pressed while an event bar is focused.
     * @event eventKeyDown
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date of the UI element which contains the event.
     * @param {HTMLElement} eventElement The UI element which represents the event.
     * @param {Scheduler.model.EventModel} eventRecord The event in which the key event was detected.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource in which the key event was detected if the UI includes a resource.
     * @param {Boolean} fromOverflowPopup `true` if the interaction was through the source view's
     * {@link Calendar.widget.mixin.DayCellRenderer#property-overflowPopup}.
     */

    /**
     * Fires when an event bar is mouseovered in any view.
     * @event eventMouseOver
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date of the UI element which contains the event.
     * @param {HTMLElement} eventElement The UI element which represents the event.
     * @param {Scheduler.model.EventModel} eventRecord The event mouseovered.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource mouseovered if the UI includes a resource.
     * @param {Boolean} fromOverflowPopup `true` if the interaction was through the source view's
     * {@link Calendar.widget.mixin.DayCellRenderer#property-overflowPopup}.
     */

    /**
     * Fires when an event bar is mousedowned in any view.
     * @event eventMouseDown
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date of the UI element which contains the event.
     * @param {HTMLElement} eventElement The UI element which represents the event.
     * @param {Scheduler.model.EventModel} eventRecord The event mousedowned on.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource mousedowned on if the UI includes a resource.
     * @param {Boolean} fromOverflowPopup `true` if the interaction was through the source view's
     * {@link Calendar.widget.mixin.DayCellRenderer#property-overflowPopup}.
     */

    /**
     * Fires when an event bar is mouseupped in any view.
     * @event eventMouseUp
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date of the UI element which contains the event.
     * @param {HTMLElement} eventElement The UI element which represents the event.
     * @param {Scheduler.model.EventModel} eventRecord The event mouseupped.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource mouseupped if the UI includes a resource.
     * @param {Boolean} fromOverflowPopup `true` if the interaction was through the source view's
     * {@link Calendar.widget.mixin.DayCellRenderer#property-overflowPopup}.
     */

    /**
     * Fires when an event bar is clicked in any view.
     * @event eventClick
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date of the UI element which contains the event.
     * @param {HTMLElement} eventElement The UI element which represents the event.
     * @param {Scheduler.model.EventModel} eventRecord The event clicked on.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource clicked on if the UI includes a resource.
     * @param {Boolean} fromOverflowPopup `true` if the interaction was through the source view's
     * {@link Calendar.widget.mixin.DayCellRenderer#property-overflowPopup}.
     */

    /**
     * Fires when an event bar is double clicked in any view.
     * @event eventDblClick
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date of the UI element which contains the event.
     * @param {HTMLElement} eventElement The UI element which represents the event.
     * @param {Scheduler.model.EventModel} eventRecord The event double clicked on.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource double clicked on if the UI includes a resource.
     * @param {Boolean} fromOverflowPopup `true` if the interaction was through the source view's
     * {@link Calendar.widget.mixin.DayCellRenderer#property-overflowPopup}.
     */

    /**
     * Fires when an event bar is mouseouted in any view.
     * @event eventMouseOut
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date of the UI element which contains the event.
     * @param {HTMLElement} eventElement The UI element which represents the event.
     * @param {Scheduler.model.EventModel} eventRecord The event mouseouted.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource mouseouted if the UI includes a resource.
     * @param {Boolean} fromOverflowPopup `true` if the interaction was through the source view's
     * {@link Calendar.widget.mixin.DayCellRenderer#property-overflowPopup}.
     */

    /**
     * Fires when cursor enters an event bar in any view.
     * @event eventMouseEnter
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date of the UI element which contains the event.
     * @param {HTMLElement} eventElement The UI element which represents the event.
     * @param {Scheduler.model.EventModel} eventRecord The event record.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource if the UI includes a resource.
     * @param {Boolean} fromOverflowPopup `true` if the interaction was through the source view's
     * {@link Calendar.widget.mixin.DayCellRenderer#property-overflowPopup}.
     */

    /**
     * Fires when cursor leaves an event bar in any view.
     * @event eventMouseLeave
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date of the UI element which contains the event.
     * @param {HTMLElement} eventElement The UI element which represents the event.
     * @param {Scheduler.model.EventModel} eventRecord The event record.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource if the UI includes a resource.
     * @param {Boolean} fromOverflowPopup `true` if the interaction was through the source view's
     * {@link Calendar.widget.mixin.DayCellRenderer#property-overflowPopup}.
     */

    /**
     * Fires when an event bar is right-clicked in any view.
     * @event eventContextMenu
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date of the UI element which contains the event.
     * @param {HTMLElement} eventElement The UI element which represents the event.
     * @param {Scheduler.model.EventModel} eventRecord The event right-clicked on.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource right-clicked on if the UI includes a resource.
     * @param {Boolean} fromOverflowPopup `true` if the interaction was through the source view's
     * {@link Calendar.widget.mixin.DayCellRenderer#property-overflowPopup}.
     */

    /**
     * Fires when a day number is clicked or activated by the <kbd>Enter</kbd> key in a view which shows day numbers.
     * This will include the cells of a {@link Calendar.widget.YearView}, the cell header of cells
     * in a {@link Calendar.widget.MonthView}, and the day header in a {@link Calendar.widget.DayView}.
     *
     * By default, activating a day number will change the view to a {@link Calendar.widget.DayView}
     * (Or if a single day view is not available, a {@link Calendar.widget.WeekView} showing the clicked day.
     * Returning `false` from a listener will prevent this default action.
     * @event dayNumberClick
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date clicked on.
     * @param {DayCell} cellData An object that contains data about the calendar cell for the date.
     * @param {Boolean} fromOverflowPopup `true` if the interaction was through the source view's
     * {@link Calendar.widget.mixin.DayCellRenderer#property-overflowPopup}.
     * @preventable
     */

    /**
     * Fires when a day column header cell of a {@link Calendar.widget.DayView} is clicked on. If the handler returns
     * `false` the current pointer event is not processed further.
     *
     * A day column header cell will only exist if the {@link Calendar.widget.DayView} is configured with a
     * {@link Calendar.widget.DayView#config-columnHeaderRenderer}.
     * @event dayHeaderClick
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The triggering DOM event.
     * @param {Date} date The date of the clicked header cell.
     */

    /**
     * Fires when a week number is clicked or activated by the <kbd>Enter</kbd> key. This will include the week number cells of a
     * {@link Calendar.widget.YearView}, the week number in the first cell
     * in each row of a {@link Calendar.widget.MonthView}
     *
     * By default, activating a week number will change the view to a {@link Calendar.widget.WeekView}
     * showing the clicked week. Returning `false` from a listener will prevent this default action.
     * @event weekNumberClick
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Number[]} week The `[year, week]` clicked on.
     * @param {Date} date The date clicked on.
     * @preventable
     */

    /**
     * Fires when a month name header in a {@link Calendar.widget.YearView} or a {@link Calendar.widget.MonthGrid} is clicked
     * or activated by the <kbd>Enter</kbd> key.
     *
     * By default, activating a month name header will change the view to a {@link Calendar.widget.MonthView}
     * showing the clicked month. Returning `false` from a listener will prevent this default action.
     * @event monthNameClick
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Number} month The month index _(zero based)_ clicked on.
     * @param {Date} date The date of the first of the month clicked on.
     * @preventable
     */

    /**
     * Fires when a cell overflow indicator is clicked or activated by the <kbd>Enter</kbd> key in any view. This will include
     * the cells of a {@link Calendar.widget.YearView} and the `+ n more` overflow
     * indicator of cells in a {@link Calendar.widget.MonthView}, and "all day" events section
     * of a {@link Calendar.widget.DayView}.
     * @event cellOverflowClick
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date clicked on.
     */

    /**
     * Fires when a mouseover made its way through to an empty part of any view.
     * @event scheduleMouseOver
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date mouseovered. _Note that in a {@link Calendar.widget.DayView},
     * this will include granular time information. For other views, this is the *start* of the date.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource associated with the view if any.
     * Only {@link Calendar.widget.ResourceView} or a {@link Calendar.widget.DayResourceView} will include this.
     */

    /**
     * Fires when a mousedown made its way through to an empty part of any view.
     * @event scheduleMouseDown
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date mousedowned on. _Note that in a {@link Calendar.widget.DayView},
     * this will include granular time information. For other views, this is the *start* of the date.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource associated with the view if any.
     * Only {@link Calendar.widget.ResourceView} or a {@link Calendar.widget.DayResourceView} will include this.
     */

    /**
     * Fires when a mouseup made its way through to an empty part of any view.
     * @event scheduleMouseUp
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date mouseupped on. _Note that in a {@link Calendar.widget.DayView},
     * this will include granular time information. For other views, this is the *start* of the date.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource associated with the view if any.
     * Only {@link Calendar.widget.ResourceView} or a {@link Calendar.widget.DayResourceView} will include this.
     */

    /**
     * Fires when a click made its way through to an empty part of any view.
     * @event scheduleClick
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date clicked on. _Note that in a {@link Calendar.widget.DayView},
     * this will include granular time information. For other views, this is the *start* of the date.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource associated with the view if any.
     * Only {@link Calendar.widget.ResourceView} or a {@link Calendar.widget.DayResourceView} will include this.
     */

    /**
     * Fires when a dblclick made its way through to an empty part of any view.
     * @event scheduleDblClick
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date double clicked on. _Note that in a {@link Calendar.widget.DayView},
     * this will include granular time information. For other views, this is the *start* of the date.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource associated with the view if any.
     * Only {@link Calendar.widget.ResourceView} or a {@link Calendar.widget.DayResourceView} will include this.
     */

    /**
     * Fires when a context menu made its way through to an empty part of any view.
     * @event scheduleContextMenu
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date clicked on. _Note that in a {@link Calendar.widget.DayView},
     * this will include granular time information. For other views, this is the *start* of the date.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource associated with the view if any.
     * Only {@link Calendar.widget.ResourceView} or a {@link Calendar.widget.DayResourceView} will include this.
     */

    /**
     * Fires when a mouseout made its way through to an empty part of any view.
     * @event scheduleMouseOut
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date mouseouted. _Note that in a {@link Calendar.widget.DayView},
     * this will include granular time information. For other views, this is the *start* of the date.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource associated with the view if any.
     * Only {@link Calendar.widget.ResourceView} or a {@link Calendar.widget.DayResourceView} will include this.
     */

    /**
     * Fires when one of the views in this Calendar refreshes.
     * @event refresh
     * @param {CalendarView} source The view which refreshed.
     */

    /**
     * Fired when an {@link Calendar.widget.mixin.CalendarMixin#config-autoCreate} gesture has
     * created a new event and added it to the event store.
     *
     * If the {@link Calendar.feature.EventEdit} feature is present, it listens for
     * this event and initiates an edit operation. Adding a high `prio` listener which
     * returns `false` can prevent this event from reaching the `eventEdit` processing.
     * @event eventAutoCreated
     * @param {CalendarView} source The child view on which the event was initiated.
     * @param {Scheduler.model.EventModel} eventRecord The new event record.
     */

    /**
     * Fired when an empty cell content area is clicked on in a {@link Calendar.widget.MonthView} or a
     * {@link Calendar.widget.CalendarRow}.
     * @event emptyCellClick
     * @param {CalendarView} source The child view on which the event was initiated.
     * @param {Event} domEvent The triggering DOM event.
     * @param {Date} date The date which has no visible events
     */

    /**
     * This event fires whenever a child view's {@link Calendar.widget.mixin.CalendarMixin#config-autoCreate
     * autoCreate gesture} is detected and also when a {@link Calendar.feature.CalendarDrag
     * drag-create} gesture is detected.
     *
     * {@note}This is a central point through which all Calendar UI-initiated create gestures are routed.{/@note}
     *
     * This event is preventable and may be used to validate UI-initiated event creation.
     * @event beforeAutoCreate
     * @preventable
     * @param {CalendarView|Calendar.view.Calendar} source The widget which triggered this event. This is the child
     * view for an {@link Calendar.widget.mixin.CalendarMixin#config-autoCreate autoCreate} gesture, but it is this
     * Calendar when the gesture is a {@link Calendar.feature.CalendarDrag drag-create}. Prefer `view` to access the
     * child view.
     * @param {CalendarView} view The child view on which the event was initiated.
     * @param {Event} domEvent The DOM event which initiated the creation.
     * @param {Date} date *DEPRECATED in favour of `startDate`.* The starting time of the event to be created. If this is in a
     * `DayView`, this will be snapped according to the specification in {@link Calendar.widget.mixin.CalendarMixin#config-autoCreate}
     * @param {Date} startDate The starting time of the event to be created. If this is in a
     * `DayView`, this will be snapped according to the specification in {@link Calendar.widget.mixin.CalendarMixin#config-autoCreate}
     * @param {Date} endDate The ending time of the event to be created.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource if the UI includes a resource.
     */

    /**
     *
     * Fired by the active view after one day cell's events are collected in sorted order according to the
     * {@link Calendar.widget.mixin.CalendarMixin#config-eventSorter}
     *
     * An application may use this to intervene in the event load received by the UI
     * by mutating the `events` array.
     * @event dayCellPopulated
     * @param {CalendarView} source The view which triggered the event.
     * @param {Scheduler.model.EventModel[]} events The events to be shown for the passed date
     * @param {Date} date The date the events are to be shown in.
     */

    /**
     * Fires when a click event is received by a view which supports resources.
     *
     * The {@link Calendar.widget.ResourceView} and {@link Calendar.widget.DayResourceView} will fire this event
     * when the interaction is anywhere inside the view because there is always a resource associated with the view.
     *
     * For example, the {@link Calendar.widget.DayResourceView} will fire this event when interacting with any of its
     * columns because each column is associated with a resource.
     *
     * The {@link Calendar.widget.MonthGrid} will fire this event when interacting with an event group header bar *if* the
     * {@link Calendar.widget.MonthGrid#config-monthEventStore} is configured to {@link Core.data.mixin.StoreGroup#config-groupers group events}
     * by resource.
     *
     * @event resourceClick
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The initiating DOM event.
     * @param {Date} date The date of the UI element which contains the event.
     * @param {HTMLElement} eventElement *If* an event was interacted with, the UI element which represents the event.
     * @param {Scheduler.model.EventModel} eventRecord *If* an event was interacted with.
     * @param {HTMLElement} resourceElement The UI element which encapsulates the resource.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource associated with the target element.
     * @param {Boolean} fromOverflowPopup `true` if the interaction was through the source view's
     * {@link Calendar.widget.mixin.DayCellRenderer#property-overflowPopup}.
     */

    /**
     * Fired when a time axis of a DayView or WeekView is clicked on. If the handler returns
     * `false` the current pointer event is not processed further.
     * @event timeAxisClick
     * @param {CalendarView} source The view which triggered the event.
     * @param {Event} domEvent The triggering DOM event.
     * @param {Date} preciseTime The exact date and time at the clicked position
     * @param {Date} time The date and time at the clicked position snapped according to the
     * {@link Calendar.widget.DayView#config-increment} and {@link Calendar.widget.DayView#config-timeSnapType}
     */
    //endregion

    static getStartAndEndDates(view, eventRecord, activeDate = eventRecord.startDate, dateFormat = 'dddd Do MMMM', timeFormat = view.timeFormat || 'LT', extendAllDayEndDay = view?.extendAllDayEndDay) {
        const
            dayTime    = view.dayTime || (view.dayTime = new DayTime({ startShift : 0, owner : view })),
            {
                allDay,
                startDate
            }          = eventRecord,
            endDate    = eventRecord.endDate || DateHelper.add(startDate, eventRecord.fullDuration),

            // For allDay events round eg 2020-10-18T12:00 up to 2020-10-19T00:00:00.000
            endTime          = allDay ? (extendAllDayEndDay ? DateHelper.ceil(endDate, '1 day') : DateHelper.add(endDate, -1, 'day')) : endDate,
            multiDay         = dayTime.startOfDay(startDate) < dayTime.startOfDay(endTime) || startDate.getDate() !== activeDate.getDate(),
            hasTime          = !allDay && DateHelper.clearTime(startDate) < startDate || DateHelper.clearTime(endDate) < endTime,
            format           = hasTime ? (multiDay ? `${dateFormat} ${timeFormat}` : timeFormat) : dateFormat,
            onlyStartDate    = eventRecord.isMilestone || (allDay && !multiDay);

        return {
            multiDay,
            startDate,
            startText : view.dateHelper.format(startDate, format),
            endDate   : endTime,
            endText   : onlyStartDate ? null : view.dateHelper.format(endTime, format)
        };
    }

    static get featureable() {
        return {
            factory : CalendarFeature
        };
    }

    // Gets current date time, time zone converted if time zone is set
    get dateTimeNow() {

        return new Date();
    }

    // Gets current date with day info only, cleared to the start of the day in the active timezone.
    get today() {
        return this.dateHelper.clearTime(this.dateTimeNow);
    }

    finalizeInit() {
        super.finalizeInit();

        const
            me                 = this,
            hideNonWorkingDays = me.activeView?.hideNonWorkingDays;

        if (hideNonWorkingDays != null && me.hideNonWorkingDays == null) {
            me.hideNonWorkingDays = hideNonWorkingDays;
        }
    }

    doDestroy() {
        const
            me         = this,
            { $modes } = me;

        // We create the mode views through our own DynamicObject, so we must destroy them
        if ($modes) {
            $modes.destroy();

            // The `modes` getter returns a Proxy onto the now destroyed manager, so drop both
            me.$modes = me._modes = null;
        }

        super.doDestroy();
    }

    toggleEmptyText() {
        const
            { crudManager } = this,
            { eventStore }  = crudManager || this;

        DomHelper.toggleClasses(this.contentElement, 'b-calendar-empty', !(eventStore.count || (crudManager?.isLoading)));
    }

    /**
     * Schedules a refresh of every {@link #config-modes view} from the current data for the next animation frame,
     * without reloading. Any refresh already scheduled for that frame is cancelled and replaced.
     *
     * When the scheduled refresh runs, views which are currently visible are refreshed. A view which is not visible -
     * an inactive mode, for example - has its refresh deferred until it next becomes visible.
     *
     * @category Rendering
     */
    refresh() {
        this.eachView(v => v.refresh?.());
    }

    // Called when a feature is added at runtime. Most Calendar features attach their own listeners, but
    // refresh the views so features that affect event rendering apply to already rendered DOM.
    afterFeatureAdd() {
        this.isPainted && this.refresh();
    }



    /**
     * The {@link #property-modes} as an Array.
     * @member {CalendarView[]}
     * @readonly
     */
    get views() {
        // Do not invoke the DynamicObject twice
        const { modes } = this;

        return modes ? Object.values(modes) : [];
    }

    /**
     * Returns the currently active mode as a {@link CalendarView} instance.
     *
     * Similar to the {@link #property-mode} property which is the active mode's name as a string.
     * @member {CalendarView}
     * @readonly
     */
    get activeView() {
        return this.viewContainer.layout.activeItem;
    }

    /**
     * Returns the lowest level of active view in the mode container.
     *
     * For example, if a {@link Calendar.widget.ResourceView} is the active view, this would
     * return the sub view of that which is currently focused. Or the resourceView if none
     * of the sub views were focused.
     * @member {CalendarView}
     * @readonly
     */
    get activeSubView() {
        const
            { activeView } = this,
            { items }      = activeView,
            // If its a multi-CalendarWidget view (Such as a ResourceView), narrow down activeView
            // to the active subView which contains focus.
            activeSubView  = items.filter(isFocusedCalendarMixin)?.[0];

        return activeSubView || activeView;
    }

    captureFocus() {
        return this.activeView.captureFocus();
    }

    /**
     * Returns the event record for a DOM element or DOM event.
     * @param {HTMLElement|Event} elementOrEvent The DOM node to lookup, or a DOM event whose target to lookup.
     * @returns {Scheduler.model.EventModel} The event record
     */
    getEventRecord(elementOrEvent) {
        return this.activeView.getEventRecord(elementOrEvent);
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

    onBeforeViewContainerCardChange(event) {
        const { prevActiveItem, activeItem } = event;

        /**
         * Fired before a change of view (Calendar mode) is initiated.
         * @event beforeActiveItemChange
         * @param {Calendar.view.Calendar} source This Calendar instance.
         * @param {CalendarView} prevActiveItem The previously active view.
         * @param {CalendarView} activeItem The new active view.
         * @preventable
         */
        if (this.trigger('beforeActiveItemChange', { ...event, source : this }) === false) {
            return false;
        }

        // Access the property name directly because this is a lazy config.
        // We do not want to cause ingestion and update here.
        // It might be still the initial config form, so might not have hide()
        prevActiveItem._overflowPopup?.hide?.();

        // In case some of the modes are not standard Calendar widgets which
        // all implement a date setter. Allow them to opt-out of syncing date.
        // If we are not syncing to their date, we must also not disturb their
        // date when they become active.
        if (('date' in activeItem) && activeItem.syncViewDate !== false && activeItem.syncCalendarDate !== false) {
            const date = this.date || prevActiveItem.date;

            // activeItem's config system will protect it from non-changes.
            if (date) {
                // Calendar views know to only update their UI when visible
                if (activeItem.isCalendarMixin) {
                    activeItem.date = date;
                }
                // Other view types have to be protected
                else {
                    activeItem.whenVisible(() => activeItem.date = date);
                }
            }
        }
    }

    onViewContainerCardChange(event) {
        /**
         * Fired when a change of view (Calendar mode) has completed. By default, view changes are animated and this
         * event fires when the view is fully visible.
         * @event activeItemChange
         * @param {Calendar.view.Calendar} source This Calendar instance.
         * @param {CalendarView} prevActiveItem The previously active view.
         * @param {CalendarView} activeItem The new active view.
         * @param {Boolean} containedFocus `true` if the outgoing view contained focus.
         */
        this.trigger('activeItemChange', { ...event, source : this });

        // If the outgoing view contained focus before it was hidden, focus the active date in the new view.
        if (event.containedFocus) {
            const { activeItem } = event;
            (activeItem.focusDate || activeItem.focus)?.call(activeItem, this.date);
        }
    }



    showKeyboardActions() {
        this.keyboardActionsPopup.show();
    }

    changeKeyboardActionsPopup(keyboardActionsPopup) {
        const
            content = this.L('L{keyboardActions.content}').split('\n').map(splitOnColon),
            popup = Popup.create(Popup.mergeConfigs({}, keyboardActionsPopup, {
                owner : this,
                title : this.L('L{keyboardActions.title}')
            }));

        popup.html = content.map(line => createHelpElement(line)).join('');

        return popup;
    }

    // keyMap handler for the Enter
    onEnterKey(event) {
        const
            { target }            = event,
            view                  = Calendar.fromElement(target),
            { dayContentElement } = view,
            role                  = target.getAttribute('role'),
            // Mouse event is at the autoCreate start time. Or 8am if no autoCreate.
            startHour             = view.autoCreate?.startHour ?? Math.max(8, view.dayStartHour || 0),
            eventProps            = view.isDayView
                ? { clientY : dayContentElement.getBoundingClientRect().top + view.hourHeight * startHour - dayContentElement.scrollTop }
                : {};

        // Enter clicks a link or double clicks an day cell or header cell.
        if (role === 'link' || role === 'columnheader' || target.matches('.b-calendar-cell,.b-day-cell')) {
            DomHelper.triggerMouseEvent(target, role === 'link' ? 'click' : 'dblclick', eventProps);
            event.stopPropagation();
        }
        return false;
    }

    // keyMap handler for the Escape key
    onEscapeKey(event) {
        if (!this.element.matches('.b-drag-helper-active')) {
            // Look upwards as far as we own for navigable elements
            DomHelper.findParent(event.target, isNavigable, this.element)?.focus();
            event.preventDefault();
            event.stopPropagation();
        }
        return false;
    }

    // keyMap handler for the 1-9 keys
    onDigitKey(keyEvent) {
        if (!DomHelper.isEditable(keyEvent.target) && keyEvent.key.match(/\d/)) {
            // 1-9 selects the corresponding mode
            this.mode = this.viewContainer.items[Number(keyEvent.key) - 1];
        }
        return false;
    }

    // keyMap handler for the Home key
    focusModeSelector() {
        const widgetMap = this.widgetMap.modeSelector?.widgetMap;

        // If we have a mode selector, focus it.
        // Focus the mode selector button, or the overflow button if the mode selector is not visible.
        widgetMap && [
            widgetMap[`${this.activeView.modeName}ShowButton`],
            widgetMap.modeSelectorButton
        ].find(w => w?.isFocusable)?.focus();
    }

    // keyMap handler for the G key
    gotoDate() {
        const { gotoDatePopup } = this;

        gotoDatePopup.widgetMap.dateField.value = this.date;
        gotoDatePopup.show();
    }

    changeGotoDatePopup(gotoDatePopup) {
        return Popup.create(Popup.mergeConfigs({
            owner    : this,
            appendTo : this.contentElement
        }, gotoDatePopup));
    }

    onGotoDateClick() {
        const
            {
                gotoDatePopup,
                activeView
            }             = this,
            { dateField } = gotoDatePopup.widgetMap;

        gotoDatePopup.hide();
        if (dateField.isValid) {
            // The DateField value is a machine-local wall-clock date — translate by day label
            this.date = this.dateFromPickerDate(dateField.value);
            (activeView.focusDate || activeView.focus)?.call(activeView, this.date);
        }
    }

    focusEventFilter() {
        this.widgetMap.eventFilter?.focus();
    }

    focusCurrentDate() {
        const { activeView } = this;

        (activeView.focusDate || activeView.focus)?.call(activeView, this.date);
    }

    /**
     * Navigates Calendar's {@link #property-activeView active view} to the current local date
     */
    shiftToNow() {
        const
            me              = this,
            { activeView }  = me,

            { dayTime }     = activeView,
            now             = new Date(),
            today           = dayTime ? dayTime.startOfDay(now) : DateHelper.clearTime(now);

        // Reaction to this to change the activeView's date happens in onCalendarDateChange.
        // updateDate changes the sidebar date if there is a sidebar, else it calls
        // onCalendarDateChange directly.
        // Make sure we use the current view's conception of where a day begins
        me.date = today;

        // Some views may have been scrolled away from the date.
        // Schedulers, AgendaViews and DayViews with custom date range and minDayWidth for example.
        // In these cases we may need to scroll to get the today cell back into view.
        if (activeView.isSchedulerBase) {
            activeView.updateDate(today, today);
        }
        else {
            // DayView must maintain the time axis position, so we scroll to the date only.
            activeView.scrollTo(today, { y : !activeView.isDayView });
        }



        me.updateViewDescription();
        (activeView.focusDate || activeView.focus)?.call(activeView, today);
    }

    /**
     * Navigates back in time in a step unit specific to the Calendar's {@link #property-activeView active view}
     * if the new date does not violate the Calendar's {@link #config-minDate}.
     */
    shiftPrevious(domEvent) {
        this.shift('previous', domEvent);
    }

    /**
     * Navigates forward in time in a step unit specific to the Calendar's {@link #property-activeView active view}
     * if the new date does not violate the Calendar's {@link #config-maxDate}.
     */
    shiftNext(domEvent) {
        this.shift('next', domEvent);
    }

    shift(direction, domEvent) {
        // The active view has to implement the CalendarMixin's `next` and `previous` methods for this to work.
        if (this.activeView?.[direction]) {
            const
                keyboardEvent  = domEvent?.type.startsWith('key'),
                { activeView } = this,
                activeDate     = activeView.getDateFromElement?.(DomHelper.getActiveElement(activeView)) || activeView.timelineContext?.date || activeView.date,
                activeResource = keyboardEvent && activeView.getResourceRecord?.(domEvent),
                { startDate }  = activeView,
                // Sample before the refresh caused by date change: a refresh may destroy the currently focused element.
                focusVisible   = Boolean(DomHelper.getActiveElement(this)?.matches(':focus-visible'));

            activeView[direction]();

            // Only continue if the view has not vetoed the date change
            if (activeView.startDate - startDate ) {
                if (activeView.animateTimeShift) {
                    DomHelper.slideIn(activeView.contentElement, direction === 'next' ? 1 : -1);
                }

                // Focus the date if navigation was by keyboard.
                // Must ensure that the new date cell is rendered by a pending refresh first.
                if (keyboardEvent) {
                    // Move the active date by the same number of days as the view's date changed.
                    const newActiveDate = DateHelper.add(activeDate, DateHelper.diff(startDate, activeView.startDate, 'days'), 'days');

                    activeView.refreshSoon?.flush();
                    this.requestAnimationFrame(() => {
                        (activeView.focusDate || activeView.focus)?.call(activeView, newActiveDate, focusVisible, activeResource);
                    });
                }
            }
        }
    }



    async onCalendarDateChange({ date, oldDate, userAction }) {
        const
            me                = this,
            { viewContainer } = me,
            { layout }        = viewContainer,

            // If the card layout is changing, use the item it is changing *to*
            { activeItem }    = layout.isChangingCard ? layout.animateDetacher.event : layout,
            {
                highlightDate
            }                 = me;

        // If the application added calendar views to any other part of the UI outside of the
        // viewContainer, and those views have not opted out of syncing to the calendar date,
        // keep them synced to the date as if they were modes.
        !me.isConstructing && me.eachWidget((item, control) => {

            if (!viewContainer.contains(item) && item.syncViewDate !== false && ('date' in item)) {
                item.date = date;
            }
            // As soon as we hit a widget which does not want to be in sync with the calendar date,
            // stop processing further down the hierarchy.
            control.down = item.syncViewDate !== false;
        });

        // Allow calendar views to opt out of being in sync with Calendar's date
        if (activeItem && activeItem.syncViewDate !== false && ('date' in activeItem)) {
            const { getDayElement } = activeItem;

            // In case triggered from header click the overflow popup for an "other month" cell.
            // Use "_overflowPopup" so as not to call it into existence if it's not created.
            // It might be still the initial config form, so might not have hide()
            if (!DateHelper.betweenLesser(date, activeItem.startDate, activeItem.endDate)) {
                activeItem._overflowPopup?.hide?.();
            }

            activeItem.date = date;

            // Some views may need the date cell bringing into view.
            // Scheduler, AgendaView and YearView do that anyway on date change becuse they expect to scroll.
            // Schedulers, and DayViews with custom date range and minDayWidth may need to scroll to get
            // the date cell into view.
            if (userAction && !(activeItem.isAgendaView || activeItem.isYearView || activeItem.isSchedulerBase)) {
                activeItem.scrollTo?.(date, {
                    // DayViews (and child DayViews of aggregated views such as ResourceView)
                    // must *not* scroll the time axis (Y axis) to 00:00.
                    y : !(activeItem.isDayView || activeItem.viewType?.isDayView)
                });
            }

            // We must match the active item's date.
            // If the date change caused a refresh, that will have happened, and this will be a no-op
            // If the active item already contained the date, this will not have happened.
            date = me.date = activeItem.date;

            // <remove-on-release>
            // TODO: Consider moving this chunk to CalendarMixin
            // </remove-on-release>
            // Highlight the date element if the date change was triggered by user interaction
            // with the date picker. If the date picker was updated from one of the modes
            // then highlighting will not be expected.
            if (userAction && highlightDate && getDayElement) {
                // Some views need to scroll to a date.
                // Agenda, Month (if constrained size), and CalendarRow
                if (activeItem.scrollTo) {
                    await activeItem.scrollTo(date);

                    // EventList might not contain the exact date. It will scroll to the
                    // closest date. If it did that, the scrolledToDate property will be set.
                    if (activeItem.scrolledToDate) {
                        date = activeItem.scrolledToDate;
                    }
                }

                // The date's element might not exist until after the scroll.
                const cell = activeItem.getDayElement?.(date);

                // AgendaView might not have a representation of the date
                if (cell) {
                    // Not coercible to a number means its a function or name of a function
                    if (isNaN(highlightDate)) {
                        me.callback(highlightDate, me, [cell, me]);
                    }
                    // Otherwise, it's truthy or falsy
                    else {
                        DomHelper.highlight(Rectangle.from(cell));
                    }
                }
            }
        }

        me.syncViewActiveDates(oldDate, date);

        /**
         * Fires when the calendar changes the date that it orientates its views around.
         *
         * The Calendar tracks which date the user interacts with so that on mode change, the user is shown the view for
         * the date being interacted with.
         *
         * This is updated on any interaction with the UI. Clicking in the {@link #property-sidebar}'s date picker,
         * clicking on an event, or clicking on a day cell in any view updates the date which the Calendar is using as
         * its orientating date.
         * @event dateChange
         * @param {Calendar.view.Calendar} source This Calendar.
         * @param {Date} oldDate The previous Calendar date.
         * @param {Date} date The new Calendar date.
         */
        me.trigger('dateChange', { oldDate, date });
    }

    updateActiveDateCls(activeDateCls, oldActiveDateCls) {
        this.syncViewActiveDates(this.date, this.date, oldActiveDateCls);
    }

    syncViewActiveDates(oldDate, date = this.date, oldActiveDateCls = this.activeDateCls) {
        const
            me                 = this,
            { activeDateCls }  = me,
            { contentElement } = me.viewContainer;

        // Keep all view's active date synced
        if (oldActiveDateCls) {
            const oldDateCells = oldDate ? contentElement.querySelectorAll(`[data-date="${DateHelper.makeKey(oldDate)}"],[role="columnheader"][data-header-date="${DateHelper.makeKey(oldDate)}"]`) : emptyArray;

            for (let i = 0, { length } = oldDateCells; i < length; i++) {
                oldDateCells[i].classList.remove(oldActiveDateCls);
            }
        }
        if (activeDateCls) {
            const newDateCells = contentElement.querySelectorAll(`[data-date="${DateHelper.makeKey(date)}"],[role="columnheader"][data-header-date="${DateHelper.makeKey(date)}"]`);
            for (let i = 0, { length } = newDateCells; i < length; i++) {
                newDateCells[i].classList.add(activeDateCls);
            }
        }
    }

    updateViewDescription(activeView = this.activeView) {
        const
            me = this,
            {
                tbar,
                widgetMap,
                element
            }                   = me,
            { viewDescription } = widgetMap,
            calendarText        = me.L('L{calendar}'),
            {
                description,
                customDescription
            }                   = activeView,
            // https://github.com/bryntum/bryntum/issues/12895
            // Use `customDescription` if it exists to override the default `description` with an HTML fragment.
            // `description` is also consumed by `aria-label`, which we therefore cannot touch.
            descriptionContent  = `<span class="b-calendar-view-desc-text">${customDescription || description || calendarText}</span>`,
            viewTitle           = activeView.displayName || activeView.title || StringHelper.capitalize(activeView.modeName);

        // Allow the Calendar's active mode to be targeted by CSS selectors.
        // Use the activeView property because the passed view might not be a mode
        // it might be a child view of a resource view.
        element.dataset.mode = activeView.modeName;
        element.setAttribute('aria-label', `${calendarText}, ${viewTitle}${description ? `, ${description}` : ''}`);

        // Keep the sidebar's concept of date of interest in sync with current activeView
        if (tbar && viewDescription) {
            // Even if tbar is present, our predefined tbar widgets may have been configured away.
            // Need the change check to avoid adding the changed class upon initialization.
            // Note that viewDescription?. cannot be used here because the result of
            // viewDescription?.description, if viewDescription is null will not be ===
            // description, so it will then attempt to set the content property. And
            // `viewDescription?.content = description` results in "invalid assignment left-hand side" error.
            if (viewDescription.content !== descriptionContent) {
                viewDescription.content = descriptionContent;
            }
        }

        const viewDate = activeView.date || activeView.startDate;

        if (viewDate && activeView.syncCalendarDate !== false) {
            // Reaction to this to change the activeView's date happens in onCalendarDateChange.
            // updateDate changes the sidebar date if there is a sidebar, else it calls
            // onCalendarDateChange directly.
            this.date = viewDate;
        }
    }

    getStepUnitText(activeView = this.activeView) {
        // stepUnit is localized by views.
        // Views must normalize the returned property value for use in
        // "Next ${stepUnit}" button text, eg "1 day" to "day"
        return activeView.stepUnit;
    }

    syncUIWithActiveView(activeView = this.activeView) {
        const
            me = this,
            {
                tbar,

                widgetMap
            }  = me;

        // tbar may have been configured away
        if (tbar && activeView?.isVisible) {
            const
                {
                    prevButton,
                    nextButton,
                    modeSelector
                }             = widgetMap,
                stepUnitText  = me.getStepUnitText(activeView);

            modeSelector?.syncActiveMode(activeView);



            me.updateViewDescription(activeView);

            // Each view localizes its own stepUnit
            // Also, any widget may be configured away, so must be truthy.
            if (prevButton) {
                prevButton.tooltip = stepUnitText ? me.L('L{previous}', stepUnitText) : '';
                prevButton.disabled = !stepUnitText || !activeView.previous;
            }

            if (nextButton) {
                nextButton.tooltip = stepUnitText ? me.L('L{next}', stepUnitText) : '';
                nextButton.disabled = !stepUnitText || !activeView.next;
            }
        }
    }

    updateEventStore(eventStore) {
        const
            me = this

            ;



        me.detachListeners('eventStoreDateRange');

        // The loadOnDemand feature needs to be initialized as soon as we get our
        // event store so that it can hook *all* loadDateRange events.
        me.features.get('loadOnDemand');

        // Ensure the listeners are present
        me.processConfiguredListeners();

        eventStore.ion({
            loadDateRange : 'onEventStoreDateRangeRequested',
            name          : 'eventStoreDateRange',
            thisObj       : me
        });


    }

    /**
     * Executes the passed function for each child calendar view in {@link #config-modes}
     * @param {Function|String} fn The function - or name of a function in the view's ownership hierarchy - to call.
     * @param {CalendarView} fn.view The view being called.
     * @param {Object[]} [args] The arguments to pass. Defaults to the view being called.
     * @param {Object} [thisObj] The `this` reference for the function. Defaults to the view being called.
     */
    eachView(fn, args, thisObj = null) {
        const passView = args == null;

        for (const view of this.views) {
            if (passView) {
                args = [view];
            }
            if (view.callback(fn, thisObj || view, args) === false) {
                return;
            }
        }
    }

    onEventStoreDateRangeRequested(event) {
        /**
         * Fired when the eventStore is queried for events by date range, and the date range
         * requested is different from the last time the store was queried.
         *
         * This may not be triggered when moving to a different view. If a `MonthView` has been
         * displayed, and the `WeekView` is then shown, the date range is already available.
         *
         * When moving a view through time, and into a time range which has not previously been
         * loaded, this will be triggered.
         *
         * {@note}If you are considering implementing a load on demand process based on this event, you might be able to
         * use the {@link Calendar/feature/LoadOnDemand} feature instead.{/@note}
         *
         * @event dateRangeChange
         * @param {Calendar.view.Calendar} source This Calendar instance
         * @param {Object} old The old date range
         * @param {Date} old.startDate the old start date
         * @param {Date} old.endDate the old end date
         * @param {Object} new The new date range
         * @param {Date} new.startDate the new start date
         * @param {Date} new.endDate the new end date
         */
        if (event.changed) {
            this.trigger('dateRangeChange', event);
        }

        /**
         * Fired **every** time the eventStore is queried for events by date range.
         *
         * This will always be triggered when changing the active view or when navigating
         * the calendar backwards or forwards in time.
         *
         * {@note}If you only need to catch when the date range changes, you can either check the `changed` flag of this
         * event, or use the {@link #event-dateRangeChange} event.{/@note}
         *
         * @event dateRangeRequested
         * @param {Calendar.view.Calendar} source This Calendar instance
         * @param {Object} old The old date range
         * @param {Date} old.startDate the old start date
         * @param {Date} old.endDate the old end date
         * @param {Object} new The new date range
         * @param {Date} new.startDate the new start date
         * @param {Date} new.endDate the new end date
         * @param {Boolean} changed `true` if the date range is different from the last time a request was made
         */
        this.trigger('dateRangeRequested', event);
    }

    async onModeSelectorToggle({ source : button, pressed }) {
        if (pressed) {
            const
                me                = this,
                { layout    }     = me.viewContainer,
                { view }          = button;

            // First await any ongoing mode switching
            await me.modeSelectionPromise;

            me.modeSelectionPromise = layout.setActiveItem(view).promise;
        }
    }

    /**
     * Sets and gets which of the configured {@link #property-modes} is the current active view.
     *
     * When read, this yields the string name of the currently active mode.
     *
     * When setting, this accepts either the name, or the actual widget instance:
     *
     * ```javascript
     * calendar.mode = 'week';
     * ```
     *
     * or
     *
     * ```javascript
     * calendar.mode = calendar.modes.agenda;
     * ```
     * @member {String} mode
     */
    updateMode(mode, was) {
        const
            me                = this,
            { isConfiguring } = me,
            { layout }        = me.viewContainer,
            configs           = me.initialConfig || {};

        // If the user configured activeIndex or mode, ignore the (one-time) responsiveUpdate of mode
        if (!(isConfiguring || (me._responsiveUpdating && ('mode' in configs || 'activeIndex' in configs)))) {
            mode = typeof mode === 'string' ? me.modes[mode] : mode;

            if (mode) {
                if (mode !== me.activeView) {
                    // Do not animate the mode if we are updating responsive state
                    layout.setActiveItem(mode, undefined, {
                        animation : !me.isResponsiveUpdating
                    });

                    // If the Container rejected the change, we need to sync our mode property and UI with reality.
                    if (!isConfiguring && layout.activeItem !== mode) {
                        me._mode = was;
                        me.syncUIWithActiveView();
                    }
                }
            }
            // If the mode is not found, we need to revert to the previous mode
            else {
                me._mode = was;
            }
        }
    }

    // Handle eventStore load or full datachange.
    // It will have refreshed all our views, so keep the Calendar UI synced.
    onEventStoreRefresh() {
        if (!this.isConfiguring) {
            this.syncUIWithActiveView(this.viewContainer.layout.activeItem);
        }
    }

    handleViewRangeChange() {
        this.syncUIWithActiveView();
    }

    handleViewPaint({ source : view }) {
        this.syncUIWithActiveView(view);

        // Keep the property in line with reality.
        this._mode = view.modeName;

        /**
         * Fires when one of the child views is painted. That is when it becomes visible.
         * Note that due to the slide-in animation, while the view is visible, it will not
         * yet be in its final position.
         * @event viewPaint
         * @param {CalendarView} source The widget being painted
         * @param {Boolean} firstPaint `true` if this is the first paint
         */
        this.trigger('viewPaint', { ...arguments[0] });
    }

    onViewRefresh({ source : view }) {
        super.onViewRefresh?.(...arguments);

        if (view.isVisible) {
            // The activeView refreshed
            if (view === this.activeView) {
                this.updateViewDescription(view);
            }
            // A child view of the current active view refreshed.
            else if (this.activeView.owns(view)) {
                this.syncUIWithActiveView(this.activeView);
            }
        }
        this.syncViewActiveDates();
    }

    updateEventCls(eventCls) {
        if (!this.initialConfig.eventInnerSelector) {
            this.eventInnerSelector = `.${eventCls}`;
        }
        if (!this.initialConfig.eventSelector) {
            this.eventSelector = `${this.eventInnerSelector}-wrap`;
        }
    }

    changeModes(modes, was) {
        const
            me               = this,
            { modeDefaults } = me,
            modeArray        = [];

        // This will bring in any configured CrudManager which will give us our stores.
        me.getConfig('crudManager', 'defaultCalendar', 'eventCls');

        // Sort the modes into weight order if there are weights configured
        let modeConfig;

        for (const modeType in modes) {
            modeConfig = modes[modeType];

            if (modeConfig) {
                modeArray.push(ObjectHelper.assign({
                    modeType,
                    weight : modeConfig.weight ?? modeDefaults?.weight ?? 0
                }, modeConfig));
            }
        }

        // Weights found, so sort and rebuild of modes object in requested order needed
        if (modeArray.some(hasWeight)) {
            modes = {};

            modeArray.sort(Widget.weightSortFn);

            for (let i = 0, { length } = modeArray; i < length; i++) {
                modeConfig = modeArray[i];
                modes[modeConfig.modeType] = modeConfig;
            }
        }

        const
            { tbar } = me,
            listeners = {
                thisObj : me,

                // When a mode has an internal change that requires the description shown in the tbar to be refreshed
                descriptionChange : 'onViewDescriptionChange',

                // These are for implementing drilling from higher to lower level views
                weekNumberClick : 'onViewWeekNumberClick',
                monthNameClick  : 'onViewMonthNameClick',
                dayNumberClick  : 'onViewDayNumberClick',

                // Handle a double click gesture inside a scheduler child mode
                beforeEventAdd : 'onViewBeforeEventAdd',

                // This is how the Calendar relays events from modes to the outside world
                // The Calendar listeners get first look at the events so that app code gets
                // a chance to intervene early.
                catchAll : {
                    fn   : 'onViewCatchAll',
                    prio : 10000
                },

                // Schedulers fire this when their date range changes
                dateRangeChange : 'handleViewRangeChange',

                // UI also needs updating if a DateRangeOwner has its shiftIncrement changed
                shiftIncrementChange : 'handleViewRangeChange',

                rangeChange : 'handleViewRangeChange',
                paint       : 'handleViewPaint',
                refresh     : 'onViewRefresh'
            },
            manager = me.$modes || (me.$modes = new DynamicObject({
                factory   : Modes,
                inferType : true,  // the name of a mode is its default type (allow its config object to override it)
                owner     : me,

                // All instances have this.calendar pointing to this
                ownerName : 'calendar',

                // Initialize a created mode - handled in the SchedulerHost mixin
                created(mode, name) {
                    me.onModeCreated(mode, name, listeners, tbar);
                },

                // Set up the config for a mode - handled in the SchedulerHost mixin
                setup(config) {
                    return me.setupMode(config, Modes);
                }
            }));

        manager.update(modes);

        if (!was) {
            // Only return the target once. Further calls are processed above so we need to return undefined to ensure
            // onConfigChange is called. By returning the same target on 2nd+ call, it passes the === test and won't
            // trigger onConfigChange.
            return manager.target;
        }
    }

    changeModeDefaults(modeDefaults) {
        const
            me     = this,
            result = new Proxy({ ...modeDefaults }, {
                set(target, prop, value) {
                    const result = Reflect.set(...arguments);

                    // Pass new property setting in to child views
                    me.updateModeDefaults({
                        [prop] : value
                    });
                    return result;
                },
                deleteProperty(target, prop) {
                    const result = Reflect.deleteProperty(...arguments);

                    // Pass new property setting in to child views
                    me.updateModeDefaults({
                        [prop] : null
                    });
                    return result;
                }
            });

        return result;
    }

    updateModeDefaults(modeDefaults) {
        if (!this.isConfiguring) {
            this.eachView(v => v.setConfig(modeDefaults));
        }
    }

    get collapsibleConfig() {
        const
            overlaySidebar = this.peekConfig('overlaySidebar'),
            config = {
                type : overlaySidebar ? 'overlay' : 'inline',
                tool : null
            };

        if (overlaySidebar) {
            config.recollapseTool = null;
        }

        return config;
    }



    changeTbar(tbar) {

        const result = super.changeTbar(...arguments);



        return result;
    }

    changeDatePicker(config) {
        if (config) {
            const me = this;

            // The DatePicker is a machine-local wall-clock widget — translate our day-frame dates by label
            return Object.assign(config, {
                eventStore : me.eventStore,
                date       : me.date && me.dateToPickerDate(me.date),
                minDate    : me.minDate && me.dateToPickerDate(me.minDate),
                maxDate    : me.maxDate && me.dateToPickerDate(me.maxDate)
            });
        }
    }



    changeItems(items) {
        const
            me = this,
            {

                modes
            }  = me;



        // Add the configured viewContainer to our items
        items.viewContainer = me.viewContainer;

        // Add our modes.
        items.viewContainer.items = modes;
        items.viewContainer.activeIndex = Math.max(Object.keys(modes).indexOf(me.mode), 0);

        // Set the viewContainer layout's activeIndex to the requested mode's index
        if (me.activeModeIndex) {
            items.viewContainer.layout.activeIndex = me.activeModeIndex;
        }

        const
            result = super.changeItems(items),
            { viewContainer } = me.widgetMap;

        // Updates the modes to the viewContainer's child items
        viewContainer.childItems.forEach(v => v._createdBy = viewContainer);

        /**
         * @member {Core.widget.Container} viewContainer
         * A {@link Core.widget.Container} which contains the configured {@link #config-modes} and
         * manages the currently active mode through its {@link Core.widget.Container#property-layout}.
         * @readonly
         */
        me._viewContainer = viewContainer;

        EventHelper.on({
            element : viewContainer.element,

            swipe({ swipe }) {
                if (swipe === '+x') {
                    me.shiftPrevious();
                }
                if (swipe === '-x') {
                    me.shiftNext();
                }
            }
        });

        return result;
    }

    processWidgetConfig(widgetConfig, parent) {
        // Initialize known widget references with our eventStore
        // These widgets may be placed anywhere in the ownership hierarchy
        // And they will always need our eventStore, so we inject it here before creation
        if (eventStoreHolderRefs[widgetConfig.ref]) {
            widgetConfig.eventStore = this.eventStore;
            if (widgetConfig.ref === 'eventFilter') {
                widgetConfig.store = this.eventStore;
            }
        }

        // If the app adds items which are calendar views, we hook them up to run with the Calendar's project
        // unless they already have been configured with data.
        if (parent !== this.viewContainer && Widget.resolveType(widgetConfig.type || parent.defaultType, true)?.isCalendarMixin) {
            widgetConfig.calendar = this;
            if (!(widgetConfig.project || widgetConfig.crudManager)) {
                widgetConfig.project = this.project;
            }
            if (!widgetConfig.date) {
                widgetConfig.date = this.date;
            }
            (widgetConfig.internalListeners || (widgetConfig.internalListeners = {})).catchAll = {
                thisObj : this,
                fn      : 'onViewCatchAll'
            };
        }

        return widgetConfig;
    }

    onViewCatchAll(event) {
        const
            me = this,
            {
                fromOverflowPopup,
                type,
                source : view
            }  = event;

        // Reject events which have bubbled up from other things than our views (MenuItem events bubble).
        // We are only forwarding events from our owned Calendar widgets.
        if (event.bubbles) {
            return;
        }

        let result, date, { domEvent } = event;

        // If the event was from another type of view, such as a Scheduler, they pass
        // DOM events as "event", so use that.
        if (!domEvent && DomHelper.isDOMEvent(event.event)) {
            domEvent = event.event;
        }

        /**
         * When a child calendar view is being interacted with, this property
         * yields a reference to the child being interacted with.
         * @member {CalendarView} eventSource
         * @readonly
         */
        me.eventSource = view;

        // Implement the interface which the inherited Feature structure requires.
        // Features hook into client element event handling methods
        if (!domEvent || me.handleEvent(domEvent) !== false) {
            const
                isEmptyCell = type.startsWith('emptycell'),
                // For EventLists, when we are using a startDate->endDate range as opposed to a fixed
                // range, the dates are *inclusive*, so pick the correct date containment function.
                dateContainmentFn = view.isEventList && !view.range ? 'betweenLesserEqual' : 'betweenLesser';

            if (type.endsWith('click') && !noDateChangeEvents[type] && (date = (event.date || view.getDateFromDomEvent?.(domEvent)))) {
                // If it's a DayView, it could be a shifted day, so move it back to the day start.
                // If the day starts at 18:00, and the click is on 2020-06-17T06:00, the date must
                // be 2020-06-16T18:00 so that the Calendar's date is stable.
                if (view.isDayView && view.dayTime) {
                    date = view.dayTime.startOfDay(date);
                }
                const
                    isOverflowClick = fromOverflowPopup || type === 'celloverflowclick' || domEvent.target.closest('.b-cal-cell-overflow'),
                    isOtherMonth = (view.getDayElement && !view.getDayElement(date, true)) || (view.isDateRangeOwner && !DateHelper[dateContainmentFn](date, view.startDate, view.endDate)),
                    // Only move onto the clicked date if it's explicitly a dayNumber Click.
                    // Any other kind of click must not change date.
                    changeDate   = view.syncCalendarDate && (view.isCalendarRow || !(fromOverflowPopup && isOtherMonth) && !isEmptyCell && !(view.isDateRangeOwner && isOtherMonth) && (type === 'daynumberclick' || !(isOtherMonth && (isOverflowClick || type.startsWith('event') || type.startsWith('schedule')))));

                // Set our date to the event date if we contain it.
                // If the above fell back to startDate, and it starts before the
                // view start, this must not happen.
                // Note that custom modes may not implement getDayElement.
                if (changeDate) {
                    // When syncing the date *from* a view, prevent that view from scrolling to the new date
                    // when syncViewDate feeds Calendar date into the active view in onCalendarDateChange.
                    view.preventScroll = true;
                    try {
                        me.date = date;
                    }
                    finally {
                        // Be sure to reset even if a listener or cell renderer throws
                        view.preventScroll = false;
                    }
                }
            }

            if ((isEmptyCell || relayedEvents.test(type)) &&
                // Our own eventEdit feature has already fired this for the same action
                !(duplicatedByTaskEdit[type] && view.isSchedulerBase && view.features.taskEdit)) {
                !event.view && (event.view = view);
                result = me.trigger(event.eventName, event);
            }
        }

        me.eventSource = null;

        return result;
    }

    // A mode had an internal change that requires updating the description shown in the tbar
    onViewDescriptionChange() {
        this.updateViewDescription();
    }

    // Implement drilling down from a MonthView week number click to a WeekView
    // or a child view which encapsulates WeekViews via its view.type config.
    onViewWeekNumberClick({ date, week }) {
        const weekView = this.modes.week || this.viewContainer.query(isWeekView);

        if (weekView) {
            weekView.week = week;

            // Only change date if the date is not encapsulated in the destination WeekView
            if (!DateHelper.betweenLesser(this.date, weekView.startDate, weekView.endDate)) {
                this.date = date;
            }
            this.viewContainer.layout.activeItem = weekView;
        }
    }

    // Implement drilling down from a YearView month name click to the MonthView
    // or a child view which encapsulates MonthViews via its view.type config.
    onViewMonthNameClick({ date }) {
        // Activate the month mode, or
        const monthView = this.modes.month || this.viewContainer.query(isMonthView);

        if (monthView) {
            // Only change date if the date is not encapsulated in the destination MonthView
            if (!monthView.getDayElement(date, true)) {
                this.date = date;
            }
            this.viewContainer.layout.activeItem = monthView;
        }
        // monthNameClick is excluded from date tracking in onViewCatchAll, so if
        // we could not activate a MonthView, set the date.
        else {
            this.date = date;
        }
    }

    // Implement drilling down from a DayView's header day number click to the DayView
    // or a child view which encapsulates DayViews via its view.type config.
    onViewDayNumberClick({ source, date, cellData, fromOverflowPopup, domEvent }) {
        // For a year view, we are clear to go ahead and navigate to the day on click if the overflow popup
        // trigger is not click, or if the overflow popup has been configured away or if there are no
        // events for the date and there's no empty cell renderer which would show some UI about there
        // being no events. Or if the click was on an overflow popup header.
        const
            { activeView } = this,
            validYearViewNavigate = source.isYearView &&
            (source.overflowPopupTrigger !== 'click' || fromOverflowPopup || !source.overflowPopup || cellData.isOtherMonth || (!cellData.events?.length && !source.emptyCellRenderer));

        // We're already on a single day view, so no action required.
        // We may be on a single day DayView subclass in which case we don't want to
        // try to change the view to be the base 'day' mode item.
        if (activeView.isDayView && activeView.duration === 1) {
            return;
        }

        if (source.isCalendarRow || source.isMonthView || validYearViewNavigate || source.isAgendaView) {
            const
                { viewContainer } = this,
                dayView           = this.modes.day || viewContainer.query(v => v.view?.type.toLowerCase() === 'dayview');

            if (dayView && source !== dayView.allDayEvents) {
                const
                    { layout }                     = viewContainer,
                    { activeItem : oldActiveItem } = layout,
                    { syncViewDate }               = oldActiveItem;

                // Don't sync the outgoing item with our date.
                // It will be synced on its way back in next time.
                oldActiveItem.syncViewDate = false;

                // Must update our date before we attempt the card change because
                // *before* changing card, the incoming card gets its date set.
                // See onBeforeViewContainerCardChange. New card must be synced with us from the start.
                this.date = date;
                viewContainer.layout.activeItem = dayView;

                // Restore the outgoing item so that when it comes back in
                // onBeforeViewContainerCardChange will sync it.
                oldActiveItem.syncViewDate = syncViewDate;

                return false;
            }
        }
    }

    onViewBeforeEventAdd({ eventRecord, assignmentRecords }) {
        const
            { eventEdit } = this.features,
            isCreating    = eventEdit && !eventEdit.disabled;

        // If double-clicking in a Scheduler child view, it has its eventEdit feature off, so help it know that
        // the created records are being edited
        eventRecord.isCreating = isCreating;
        assignmentRecords?.forEach(assignmentRecord => assignmentRecord.isCreating = isCreating);
    }

    /**
     * Uses the current active mode to create an event on the specified date which conforms to that mode's
     * {@link Calendar.widget.mixin.CalendarMixin#config-autoCreate} setting.
     *
     * This method may be called programmatically by application code if the `autoCreate` setting
     * is `false`, in which case the default values for `autoCreate` will be used.
     *
     * If the {@link Calendar.feature.EventEdit} feature is active, the new event
     * will be displayed in the event editor.
     *
     * This is a utility method to use as a shortcut to {@link Calendar.widget.mixin.CalendarMixin#function-createEvent}
     * @param {Date} [date] Optionally, the date to add the event at. Uses the Calendar's currently
     * active date, as set in the {@link #config-sidebar}'s date picker.
     *
     * If there's no time component, and the current active mode is a calendar view, the
     * {@link Calendar.widget.mixin.CalendarMixin#config-autoCreate}'s `startHour` will be used.
     */
    createEvent(date, resourceRecord) {
        this.doCreateEvent(date, resourceRecord);
    }

    // This is separate because its signature is fixed. Second parameter is an optional view to use
    // to do the creating. The createEvent method may be called by Features which pass extra parameters.
    doCreateEvent(date, resourceRecord, source = this.activeSubView, isAutoCreate = false) {
        const
            { modes }   = this,

            // Yearview defers to other views present in its owning calendar to handle auto creating
            // events. This method finds a suitable host view to postprocess the creation.
            editingView = source.isYearView ? modes.week || modes.month || modes.day || source : source;

        // Ensure the view which is going to postprocess the new event (such as editing it) is active
        if (!this.activeView.owns(editingView)) {
            const
                { viewContainer } = this.widgetMap,
                { layout }        = viewContainer;

            if (editingView) {
                // activeItemChange fires after the animation, so it will be fully ready.
                viewContainer.ion({
                    activeItemChange : 'doCreateEvent',
                    thisObj          : source,
                    once             : true,
                    args             : [date, resourceRecord, editingView]
                });

                if (date) {
                    this.date = date;
                }

                layout.activeItem = editingView;
                return false;
            }
        }
        else {
            // Calendar vs Scheduler
            source.doCreateEvent ? source.doCreateEvent(date, resourceRecord, editingView, isAutoCreate) : source.createEvent(date, resourceRecord, isAutoCreate);
        }
    }

    changeDate(date, oldDate) {
        // The date config may be ingested before the timeZone config during configuration — force
        // timeZone first so dateHelper below resolves timezone-aware.
        this.getConfig('timeZone');

        const { dateHelper } = this;

        date = typeof date === 'string' ? dateHelper.parse(date) : new Date(date);

        if (isNaN(date)) {
            throw new Error('Calendar widget date ingestion must be passed a Date, or a YYYY-MM-DD date string');
        }

        date = dateHelper.clearTime(date);

        // Protect the setter from processing a no-change.
        if (!oldDate || (date - oldDate)) {
            return date;
        }
    }

    changeMinDate(minDate) {
        return this.changeDate(minDate);
    }

    changeMaxDate(maxDate) {
        return this.changeDate(maxDate);
    }

    updateMinDate(minDate) {
        const me = this;
        if (!me.isConfiguring) {
            me.syncCommonConfig('minDate');
            me.datePicker && (me.datePicker.minDate = minDate && me.dateToPickerDate(minDate));
        }
    }

    updateMaxDate(maxDate) {
        const me = this;
        if (!me.isConfiguring) {
            me.syncCommonConfig('maxDate');
            me.datePicker && (me.datePicker.maxDate = maxDate && me.dateToPickerDate(maxDate));
        }
    }

    updateAutoCreate() {
        if (!this.isConfiguring) {
            this.syncCommonConfig('autoCreate');
        }
    }

    updateDate(date, oldDate) {
        if (!this.isConfiguring) {

                this.onCalendarDateChange({ date, oldDate });

        }
    }

    /**
     * Converts a date in this Calendar's (possibly timezone-aware) day frame to a machine-local Date carrying the same
     * `YYYY-MM-DD` day label. The sidebar's date picker (and other `CalendarPanel` based widgets) are wall-clock
     * widgets operating in the machine-local frame, so dates crossing that boundary are translated by day label, not by
     * instant.
     * @param {Date} date A date in this Calendar's day frame
     * @returns {Date} The machine-local midnight with the same day label
     * @internal
     */
    dateToPickerDate(date, reverse) {
        const { dateHelper } = this;

        // No timezone active — both sides already share the machine-local frame
        if (dateHelper === DateHelper) {
            return date;
        }

        if (reverse) {
            return dateHelper.parseKey(DateHelper.makeKey(date));
        }

        // The static DateHelper is deliberate: it represents the DatePicker's frame
        return DateHelper.parseKey(dateHelper.makeKey(date));
    }

    /**
     * The reverse of {@link #function-dateToPickerDate}: converts a machine-local Date from the sidebar's date picker
     * to this Calendar's (possibly timezone-aware) day frame, preserving the `YYYY-MM-DD` day label.
     * @param {Date} date A machine-local date
     * @returns {Date} The same day label as a midnight in this Calendar's day frame
     * @internal
     */
    dateFromPickerDate(date) {
        return this.dateToPickerDate(date, true);
    }



    updateDateFormat() {
        if (!this.isConfiguring) {
            this.syncCommonConfig('dateFormat');
        }
    }

    changeIncludeWeekendsButton(value) {
        return (value === true) ? {} : value;
    }

    updateIncludeWeekendsButton(value) {
        // we don't pass null/false down because we only want to configure the button not destroy it
        if (!this.isConstructing && value && ObjectHelper.isObject(value)) {
            this.widgetMap.modeSelector.includeWeekendsButton = value;
        }
    }

    changeScrollManager(scrollManager, oldScrollManager) {
        oldScrollManager?.destroy();

        if (this.isDestroying) {
            return;
        }

        return new ScrollManager({
            element : this.element,
            ...scrollManager
        });
    }

    updateDefaultCalendar() {
        if (!this.isConfiguring) {
            this.syncCommonConfig('defaultCalendar');
        }
    }

    changeWeekStartDay(weekStartDay) {
        // Apply the default from DateHelper which draws its value from the locale.
        if (weekStartDay === false) {
            weekStartDay = DateHelper.weekStartDay;
        }
        return weekStartDay;
    }

    updateReadOnly() {
        super.updateReadOnly(...arguments);

        if (!this.isConfiguring) {
            this.syncCommonConfig('readOnly');
        }
    }

    updateWeekStartDay(weekStartDay) {
        if (!this.isConfiguring) {
            this.syncCommonConfig('weekStartDay');

        }
    }

    changeHideNonWorkingDays(hideNonWorkingDays) {
        // Falsy must be coerced to false so that non-changes do not propagate
        return Boolean(hideNonWorkingDays);
    }

    updateHideNonWorkingDays(hideNonWorkingDays, was) {
        if (!this.isConfiguring) {
            this.syncCommonConfig('hideNonWorkingDays');

            /**
             * Fires when the {@link #config-hideNonWorkingDays} setting changes, whether set
             * programmatically or by a view contributing its own value on activation.
             *
             * Can be used to keep external UI which reflects the setting in sync.
             * @event changeHideNonWorkingDays
             * @param {Calendar.view.Calendar} source This Calendar.
             * @param {Boolean} value The new `hideNonWorkingDays` value.
             * @param {Boolean} was The previous `hideNonWorkingDays` value.
             */
            this.trigger('changeHideNonWorkingDays', {
                value : hideNonWorkingDays,
                was
            });
        }
    }

    changeNonWorkingDays(nonWorkingDays) {
        // Apply the default from DateHelper which draws its value from the locale.
        if (nonWorkingDays === false) {
            nonWorkingDays = DateHelper.nonWorkingDays;
        }
        const
            me     = this,
            result = new Proxy({ ...nonWorkingDays }, {
                set(target) {
                    const result = Reflect.set(...arguments);

                    // Pass new property setting in to child views
                    me.updateNonWorkingDays(target);
                    return result;
                },
                deleteProperty(target) {
                    const result = Reflect.deleteProperty(...arguments);

                    // Pass new property setting in to child views
                    me.updateNonWorkingDays(target);
                    return result;
                }
            });

        return result;
    }

    updateNonWorkingDays() {
        if (!this.isConfiguring) {
            this.syncCommonConfig('nonWorkingDays');
        }
    }

    updateCoreHours() {
        if (!this.isConfiguring) {
            this.syncCommonConfig('coreHours');
        }
    }

    /**
     * Syncs configs which are passed down into child views when changed here.
     * @param {String} name The name of the config to pass from this Calendar into every child view
     * @private
     */
    syncCommonConfig(name) {
        this.eachView(v => {
            v[name] = this[name];
        });
    }

    onCalendarStoreChange() {
        if (this.isPainted) {
            const
                {
                    element,
                    resourceStore
                }                    = this,
                { resourceFilter }   = this.widgetMap,
                visibleResourceCount = (resourceFilter ? resourceStore.records.filter(c => resourceFilter.value.includes(c)) : resourceStore.records).length;

            element.classList.toggle('b-no-visible-resources', Boolean(resourceFilter && !visibleResourceCount));
            element.style.setProperty('--bi-visible-resource-count', visibleResourceCount);
        }

        // Keep mixins informed.
        super.onCalendarStoreChange?.(...arguments);
    }

    updateSelected() {
        const eventEls = this.viewContainer.contentElement.querySelectorAll('.b-cal-event-wrap');

        for (let i = 0, { length } = eventEls; i < length; i++) {
            eventEls[i].classList.toggle(this.eventSelectedCls, this.isEventSelected(eventEls[i].dataset.eventId));
        }
    }

    getElementFromEventRecord(eventRecord, resourceRecord) {
        return this.activeView.getEventElement(eventRecord, undefined, resourceRecord);
    }

    getElementsFromEventRecord(eventRecord, resourceRecord) {
        return [this.getElementFromEventRecord(eventRecord, resourceRecord)];
    }

    get processEventContentCallback() {
        return this.processEventContent && (ev => {
            this.processEventContent({
                ...ev,
                reactComponent : this.reactComponent
            });
        });
    }

    updateLocalization() {
        const me = this;

        if (me.isPainted) {
            let refreshed = false;

            // Only go with locale's weekStartDay if we were not initially configured with a weekStartDay
            if (!('weekStartDay' in me.initialConfig) && me.weekStartDay !== DateHelper.weekStartDay) {
                me.weekStartDay = DateHelper.weekStartDay;
                // weekStartDay change will cause a refresh
                refreshed = true;
            }

            // Only go with locale's nonWorkingDays if we were not initially configured with nonWorkingDays
            if (!('nonWorkingDays' in me.initialConfig) && !ObjectHelper.isEqual(me.nonWorkingDays, DateHelper.nonWorkingDays)) {
                me.nonWorkingDays = DateHelper.nonWorkingDays;
                // nonWorkingDays change will cause a refresh
                refreshed = true;
            }

            if (!refreshed) {
                me.refresh();
            }
            // Regen the keyboard help panel if present
            if (me._keyboardActionsPopup) {
                delete me._keyboardActionsPopup;
                me.keyboardActionsPopup = me.config.keyboardActionsPopup;
            }

            me.syncUIWithActiveView();
        }
        super.updateLocalization();
    }

    /**
     * A method which may be chained by features. It is called when an event's render
     * data is calculated so that features may update the style, class list or body.
     * The {@link Core.helper.DomSync} DomConfig object which will be used to create the
     * event bar is passed, so the content may be manipulated.
     * @param {Object} renderData Context for the event bar config creation.
     * @param {DomConfig} eventDomConfig A {@link Core.helper.DomSync} DomConfig object which describes the
     * structure of the event to be rendered.
     * @internal
     */
    onEventDataGenerated(renderData, eventDomConfig) {}
}

Calendar.initClass();

// Views which we import may need to access Calendar at runtime. They do it through the bryntum global.
if (globalThis.bryntum) {
    globalThis.bryntum.Calendar = Calendar;
}

class Modes extends Base.mixin(Factoryable) {
    static get factoryable() {
        return {
            // Allow any widget type:
            extends : Widget
        };
    }
}

Modes.register('agenda', AgendaView);
Modes.register('year', YearView);
Modes.register('month', MonthView);
Modes.register('week', WeekView);
Modes.register('day', DayView);
Modes.register('list', EventList);


Calendar.Modes = Modes;

VersionHelper.setVersion('calendar', '8.0.1');

