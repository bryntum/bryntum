import SchedulerBase from './SchedulerBase.js';

import '../localization/En.js';

// default features
import '../feature/ColumnLines.js';
import '../feature/EventDrag.js';
import '../feature/EventDragCreate.js';
import '../feature/EventEdit.js';
import '../feature/EventMenu.js';
import '../feature/EventResize.js';
import '../feature/EventTooltip.js';
import '../feature/ScheduleMenu.js';
import '../feature/ScheduleTooltip.js';
import '../feature/TimeAxisHeaderMenu.js';
import '../feature/CellEdit.js';


// Since Scheduler is based on SchedulerBase + GridBase, Grids default features needs to be pulled in here also
import '../../Grid/feature/CellMenu.js';
import '../../Grid/feature/ColumnPicker.js';
import '../../Grid/feature/ColumnReorder.js';
import '../../Grid/feature/ColumnResize.js';
import '../../Grid/feature/FilterBar.js';
import '../../Grid/feature/HeaderMenu.js';
import '../../Grid/feature/Sort.js';
import '../../Grid/feature/Stripe.js';


import '../../Grid/column/CheckColumn.js'; // For checkbox selection mode



/**
 * @module Scheduler/view/Scheduler
 */

/**
 * The Scheduler widget is a very powerful and performant UI component that displays an arbitrary number of "locked"
 * columns with a schedule occupying the remaining space. The schedule has a time axis at the top, one row per resource
 * and any number of events per resource.
 *
 * ## Intro
 * The Scheduler widget has a wide range of features and a large API to allow users to work with it efficiently in the
 * browser.
 *
 * The timeaxis displayed at the top of the Scheduler is configured using a {@link #config-startDate},
 * {@link #config-endDate} and a {@link #config-viewPreset}. The dates determine the outer limits of the range shown in
 * the timeaxis while the {@link Scheduler.preset.ViewPreset} decides the appearance and which dates are actually shown.
 * The Scheduler ships with a selection of predefined view presets, which can be found in
 * {@link Scheduler.preset.PresetManager}. If you want to specify view presets for a specific scheduler only, please see
 * {@link #config-presets} config.
 *
 * <div class="note">Note that if you want to use infinite scroll along the time axis, configure
 * {@link #config-infiniteScroll} and {@link #config-visibleDate} instead of <code>startDate</code> and
 * <code>endDate</code></div>
 *
 * The Scheduler uses a {@link Scheduler.data.ResourceStore} to hold resources and an {@link Scheduler.data.EventStore}
 * to hold events. You can use inline data or load data using ajax, see the "Working with data" guides for more
 * information.
 *
 * The simplest schedule configured with inline data would look like this:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     appendTo : targetElement,
 *
 *     // Set fixed height of 370px
 *     height : 370,
 *
 *     startDate : new Date(2018, 4, 6),
 *     endDate   : new Date(2018, 4, 13),
 *
 *     viewPreset : 'dayAndWeek',
 *
 *     columns : [
 *         { field : 'name', text : 'Name', width : 90 }
 *     ],
 *
 *     resources : [
 *         { id : 1, name : 'Alice' },
 *         { id : 2, name : 'Bob' },
 *         { id : 3, name : 'Carol' },
 *         { id : 4, name : 'Dan' },
 *         { id : 5, name : 'Eve' }
 *     ],
 *
 *     events : [
 *         { id : 1, resourceId : 1, name : 'Team Meeting', startDate : '2018-05-06', endDate : '2018-05-07' },
 *         { id : 2, resourceId : 1, name : 'Project Review', startDate : '2018-05-09', endDate : '2018-05-10' },
 *         { id : 3, resourceId : 2, name : 'Client Call', startDate : '2018-05-07', endDate : '2018-05-08' },
 *         { id : 4, resourceId : 2, name : 'Training Session', startDate : '2018-05-11', endDate : '2018-05-12' },
 *         { id : 5, resourceId : 3, name : 'Design Workshop', startDate : '2018-05-06', endDate : '2018-05-08' },
 *         { id : 6, resourceId : 4, name : 'Code Review', startDate : '2018-05-08', endDate : '2018-05-09' },
 *         { id : 7, resourceId : 5, name : 'Documentation', startDate : '2018-05-10', endDate : '2018-05-12' }
 *     ]
 * });
 * ```
 *
 * {@inlineexample Scheduler/view/Simplest.js}
 *
 * ## Inheriting from Bryntum Grid
 * Bryntum Scheduler inherits from Bryntum Grid, meaning that most features available in the grid are also available
 * for the scheduler. Common features include columns, cell editing, context menus, row grouping, sorting and more.
 * Note: If you want to use the Grid component standalone, e.g. to use drag-from-grid functionality, you need a separate
 * license for the Grid component.
 *
 * For more information on configuring columns, filtering, search etc. please see the {@link Grid.view.Grid Grid API docs}.
 * {@region Loading data}
 * As mentioned above Bryntum Scheduler uses an {@link Scheduler.data.EventStore} and a {@link Scheduler.data.ResourceStore}
 * to hold its data. Data is expected to be in JSON format and can be assigned inline (from memory) using the
 * {@link #config-events} and {@link #config-resources} shortcuts:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *    events : myArrayOfEventData,
 *    resources : myArrayOfResourceData
 * });
 * ```
 *
 * If you need to give additional store configuration, you can also specify store configs or instances:
 *
 * ```javascript
 * let resourceStore = new ResourceStore({
 *   // ResourceStore config object
 * })
 *
 * const scheduler = new Scheduler({
 *    // EventStore config object
 *    eventStore : {
 *       ...
 *    },
 *
 *    // Already existing ResourceStore instance
 *    resourceStore
 * });
 * ```
 *
 * To use Ajax to fetch data from a server, specify {@link Core.data.AjaxStore#config-readUrl}:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *    eventStore : {
 *        readUrl  : 'backend/read_events.php',
 *        autoLoad : true
 *    }
 * });
 * // If you do not specify autoLoad, trigger loading manually:
 * scheduler.eventStore.load();
 * ```
 *
 * For more information, see the "Working with data" guides.
 * {@endregion}
 * {@region Lazy loading data (infinite scroll)}
 * Most of the Scheduler's data can be lazy loaded, which means that the records are requested when they are needed (the
 * view wants to render them). Currently, these Scheduler stores supports lazy loading:
 * * {@link Scheduler.data.ResourceStore}
 * * {@link Scheduler.data.EventStore}
 * * {@link Scheduler.data.AssignmentStore}
 * * {@link Scheduler.data.TimeRangeStore}
 * * {@link Scheduler.data.ResourceTimeRangeStore}
 *
 * To activate lazy loading you will need to configure each store with {@link Core.data.Store#config-lazyLoad} = `true`.
 * Then either you configure the stores with a {@link Core.data.AjaxStore#config-readUrl} and implement a backend that
 * responds correctly to that request. Or you implement the {@link Core.data.Store#config-requestData} function which
 * serves the correct data to the Store.
 *
 * For the {@link Scheduler.data.ResourceStore}, you either have to set the
 * {@link Scheduler.data.ResourceStore#config-autoLoad} config to `true` or call
 * {@link Scheduler.data.ResourceStore#function-load} initially. The rest of the lazy loaded stores will be loaded when
 * the resources have started rendering.
 *
 * If you are using the {@link Scheduler.data.CrudManager}, you would simply set the
 * {@link Scheduler.data.CrudManager#config-lazyLoad} config to `true` and implement the backend. The CrudManager will
 * lazy load the stores which are supported and do a complete load of the unsupported stores.
 *
 * {@note}**Tip!** Scrolling the time line is also lazy loaded. Set a large time span and only data that is currently
 * needed will be loaded. Also, activating {@link #config-infiniteScroll} will give you a infinitely scrollable time
 * line with lazy loading of content!{/@note}
 *
 * For more information about lazy loading, please read our [guide](#Scheduler/guides/data/lazyloading.md)
 *
 * ### Unsupported
 * These major features are currently not supported when lazy loading:
 * * {@link #config-mode Vertical mode}
 *
 * {@endregion}
 * {@region Event styling}
 * Bryntum Schedulers appearance can be affected in a few different ways:
 *
 * * Switching themes
 * * Choosing event styles and colors
 * * Using renderer functions
 *
 * ### Switching themes
 *
 * Scheduler ships with four different themes, each available in both a light and a dark variant. Simply include the
 * css file for the theme you would like to use on your page. The themes are located in the `/build` folder. For example
 * to include the Material3 themes light variant:
 *
 * ```html
 * <link rel="stylesheet" href="build/material3-light.css" data-bryntum-theme>
 * ```
 *
 * #### Svalbard
 *
 * <img src="Scheduler/themes/thumb.svalbard-light.png" alt="Svalbard Light theme" width="300">
 * <img src="Scheduler/themes/thumb.svalbard-dark.png" alt="Svalbard Dark theme" width="300">
 *
 * #### Visby
 *
 * <img src="Scheduler/themes/thumb.visby-light.png" alt="Visby Light theme" width="300">
 * <img src="Scheduler/themes/thumb.visby-dark.png" alt="Visby Dark theme" width="300">
 *
 * #### Stockholm
 *
 * <img src="Scheduler/themes/thumb.stockholm-light.png" alt="Stockholm Light theme" width="300">
 * <img src="Scheduler/themes/thumb.stockholm-dark.png" alt="Stockholm Dark theme" width="300">
 *
 * #### Material3
 *
 * <img src="Scheduler/themes/thumb.material3-light.png" alt="Material 3 Light theme" width="300">
 * <img src="Scheduler/themes/thumb.material3-dark.png" alt="Material 3 Dark theme" width="300">
 *
 * #### Fluent2
 *
 * <img src="Scheduler/themes/thumb.fluent2-light.png" alt="Fluent 2 Light theme" width="300">
 * <img src="Scheduler/themes/thumb.fluent2-dark.png" alt="Fluent 2 Dark theme" width="300">
 *
 * #### High Contrast
 *
 * <img src="Scheduler/themes/thumb.high-contrast-light.png" alt="High Contrast Light theme" width="300">
 * <img src="Scheduler/themes/thumb.high-contrast-dark.png" alt="High Contrast Dark theme" width="300">
 *
 * ### Choosing event styles and colors
 * The style and color of each event can be changed by assigning to the `eventStyle` and `eventColor` configs. These
 * configs are available at 3 different levels:
 *
 * * Scheduler level, affects all events (see {@link Scheduler.view.mixin.TimelineEventRendering#config-eventStyle} and
 *   {@link Scheduler.view.mixin.TimelineEventRendering#config-eventColor}).
 * * Resource level, affects all events assigned to that resource (see {@link Scheduler.model.mixin.ResourceModelMixin#field-eventStyle}
 *   and {@link Scheduler.model.mixin.ResourceModelMixin#field-eventColor}).
 * * Event level, affects that event (see {@link Scheduler/model/mixin/EventModelMixin#field-eventStyle} and
 *   {@link Scheduler/model/mixin/EventModelMixin#field-eventColor}).
 *
 * {@inlineexample Scheduler/view/Styles.js}
 *
 * For available styles, see {@link Scheduler.view.mixin/TimelineEventRendering#config-eventStyle}. For colors,
 * {@link Scheduler.view.mixin/TimelineEventRendering#config-eventColor}. Also take a look at the
 * <a href="../examples/eventstyles/" target="_blank">eventstyles demo</a>.
 *
 * ### Sorting overlapping events
 *
 * The order of overlapping events rendered in a horizontal scheduler can be customized by overriding
 * {@link Scheduler.view.mixin.SchedulerEventRendering#config-overlappingEventSorter} function on the scheduler.
 * For example:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     overlappingEventSorter(a, b) {
 *         return b.startDate.getTime() - a.startDate.getTime();
 *     },
 *     ...
 * });
 * ```
 *
 * {@inlineexample Scheduler/view/SortingOverlappingEvents.js}
 *
 * ### Using render functions
 * Render function can be used to manipulate the rendering of rows (resources) and events. For information on row
 * renderers, see {@link Grid.column.Column#config-renderer}.
 *
 * Event rendering can be manipulated by specifying an {@link Scheduler.view.mixin/SchedulerEventRendering#config-eventRenderer} function. The function is called
 * for each event before it is rendered to DOM. By using its arguments you can add CSS classes, modify styling and
 * determine the contents of the event:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *
 *   events    : [...],
 *   resources : [...],
 *
 *   ...,
 *
 *   eventRenderer({resourceRecord, eventRecord, renderData}) {
 *      // add css class to the event
 *      renderData.cls.add('my-css-class');
 *
 *      // use an icon
 *      renderData.iconCls = 'fa fa-some-nice-icon';
 *
 *      // return value is used as events text
 *      return `${resourceRecord.name}: ${eventRecord.name}`;
 *   }
 * });
 * ```
 *
 * {@endregion}
 * {@region Event manipulation}
 * You can programmatically manipulate the events using data operations, see the "Working with data" guides for more
 * information. Events are reactive, changes reflect on the UI automatically. A small example on manipulating events:
 *
 * ```javascript
 * // change startDate of first event
 * scheduler.eventStore.first.startDate = new Date(2018,5,10);
 *
 * // remove last event
 * scheduler.eventStore.last.remove();
 *
 * // reassign an event
 * scheduler.eventStore.getById(10).resourceId = 2;
 * ```
 *
 * You can also allow your users to manipulate the events using the following features:
 *
 * * {@link Scheduler.feature.EventDrag}, drag and drop events within the schedule
 * * {@link Scheduler.feature.EventDragCreate}, create new events by click-dragging an empty area
 * * {@link Scheduler.feature.EventEdit}, show an event editing form
 * * {@link Scheduler.feature.SimpleEventEdit}, edit the event name easily
 * * {@link Scheduler.feature.EventResize}, resize events by dragging resize handles
 *
 * All of the features mentioned above are enabled by default.
 * {@endregion}
 *
 * {@region View presets}
 * A view preset determines the information shown in the time axis header + the resolution of the time axis. Scheduler
 * is configured with a set of view presets, from which one is active at any time. The active view preset is configured
 * using the {@link #config-viewPreset} config.
 *
 * Here are some of the predefined view presets ("hourAndDay", "weekAndDayLetter", "monthAndYear", see
 * {@link Scheduler.preset.PresetManager} for the full list):
 *
 * {@inlineexample Scheduler/preset/hourAndDay.js}
 * {@inlineexample Scheduler/preset/weekAndDayLetter.js}
 * {@inlineexample Scheduler/preset/monthAndYear.js}
 *
 * You can specify which view presets a specific Scheduler should use by configuring the {@link #config-presets} config:
 *
 * ```javascript
 * new Scheduler({
 *   presets : [
 *     'hourAndDay',
 *     'weekAndDayLetter',
 *     'monthAndYear'
 *   ]
 * });
 * ```
 *
 * You can also define your own custom view presets. See the {@link Scheduler.preset.ViewPreset} documentation.
 * {@endregion}
 *
 * {@region Zooming}
 * Scheduler can zoom between the different view presets it is configured to use. By default, zooming one level
 * switches to the next preset. Depending on which presets the app is using, this might be a substantial shift.
 *
 * For a smoother zooming experience, we recommend enabling {@link #config-smoothZoom} which will interpolate
 * between presets when zooming in and out (it will be on by default from v8):
 *
 * ```javascript
 * new Scheduler({
 *    smoothZoom : true
 * });
 * ```
 *
 * This is especially noticeable when using the mouse wheel, track pad or pinch gestures to zoom in and out. But it also
 * allows animating programmatic zooms:
 *
 * ```javascript
 * scheduler.zoomIn({ animate : true });
 * ```
 *
 * When using smooth zooming, presets flagged with `useForSmoothZooming : false` will be skipped during zooming.
 *
 * Useful zooming APIs:
 *
 * * {@link #function-zoomIn}
 * * {@link #function-zoomOut}
 * * {@link #function-zoomToSpan}
 * * {@link #function-zoomToFit}
 *
 * {@endregion}
 *
 * {@region Default configs}
 * There is a myriad of configs and features available for Scheduler (browse the API docs to find them), some of them on
 * by default and some of them requiring extra configuration. The code below tries to illustrate the major things that
 * are used by default:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *    // The following features are enabled by default:
 *    features : {
 *        cellEdit            : true, // Cell editing in the columns part
 *        columnLines         : true, // Column lines in the schedule part
 *        columnPicker        : true, // Header context menu item to toggle visible columns
 *        columnReorder       : true, // Reorder columns in grid part using drag and drop
 *        columnResize        : true, // Resize columns in grid part using the mouse
 *        cellMenu            : true, // Context menu for cells in the grid part
 *        eventMenu           : true, // Context menu for events
 *        eventDrag           : true, // Dragging events
 *        eventDragCreate     : true, // Drag creating events
 *        eventEdit           : true, // Event editor dialog
 *        eventFilter         : true, // Filtering events using header context menu
 *        eventCopyPaste      : true, // Allow using [Ctrl/CMD + C/X] and [Ctrl/CMD + V] to copy/cut and paste events
 *        eventResize         : true, // Resizing events using the mouse
 *        eventTooltip        : true, // Tooltips for events
 *        group               : true, // Row grouping
 *        headerMenu          : true, // Context menu for headers in the grid part
 *        timeAxisHeaderMenu  : true, // Header context menu for schedule part
 *        scheduleMenu        : true, // Context menu for empty parts of the schedule
 *        scheduleTooltip     : true, // Tooltip for empty parts of the schedule
 *        sort                : true  // Row sorting
 *    },
 *
 *    // From Grid
 *    autoHeight                : false, // Grid needs to have a height supplied through CSS (strongly recommended) or by specifying `height
 *    columnLines               : true,  // Grid part, themes might override it to hide lines anyway
 *    emptyText                 : 'No rows to display',
 *    enableTextSelection       : false, // Not allowed to select text in cells by default,
 *    fillLastColumn            : true,  // By default the last column is stretched to fill the grid
 *    fullRowRefresh            : true,  // Refreshes entire row when a cell value changes
 *    loadMask                  : 'Loading...',
 *    resizeToFitIncludesHeader : true,  // Also measure header when auto resizing columns
 *    responsiveLevels : {
 *      small : 400,
 *      medium : 600,
 *      large : '*'
 *    },
 *    rowHeight                  : 60,    // Scheduler specifies a default rowHeight in pixels
 *    showDirty                  : false, // No indicator for changed cells
 *
 *    // Scheduler specific
 *    autoAdjustTimeAxis             : true,      // startDate & endDate will be adjusted to display a suitable range
 *    allowOverlap                   : true,      // Events are allowed to overlap (overlays, stacks or packs depending on eventLayout)
 *    barMargin                      : 10,        // Space above + below each event
 *    enableDeleteKey                : true,      // Allow deleting events with delete / backspace keys
 *    eventBarTextField              : 'name',    // Field on EventModel to display in events
 *    eventColor                     : 'b-green', // Use green as default color for events
 *    eventLayout                    : 'stack',   // Stack overlapping events by default
 *    eventStyle                     : 'plain',   // Use plain as default style for events
 *    managedEventSizing             : true,      // Calculate event sizes based on rowHeight & barMargin
 *    milestoneCharWidth             : 10,
 *    milestoneLayoutMode            : 'default',
 *    useInitialAnimation            : true,      // Fade in events initially
 *    viewPreset                     : 'weekAndDayLetter',
 *    zoomOnMouseWheel               : true,
 *    zoomOnTimeAxisDoubleClick      : true
 * });
 * ```
 *
 * {@endregion}
 * {@region Keyboard shortcuts}
 * Scheduler does not currently provide any keyboard shortcuts on its own. However, the following Scheduler features has
 * their own keyboard shortcuts. Follow the links for details.
 * * {@link Scheduler.feature.EventCopyPaste#keyboard-shortcuts EventCopyPaste}
 *
 * As Scheduler is a subclass of Grid, many of Grid's {@link Grid.view.Grid#keyboard-shortcuts keyboard-shortcuts}
 * works for Scheduler as well.
 *
 * For more information on how to customize keyboard shortcuts, please see
 * [our guide](#Scheduler/guides/customization/keymap.md)
 * {@endregion}
 * {@region Performance}
 * To make scheduler performance as good as possible it only renders the events and resources that are within view (plus
 * an additional buffer). Since adding to and removing from DOM comes with a performance penalty the elements are
 * instead repositioned and reused as you scroll. A side effect of this is that you cannot do direct DOM element
 * manipulation in a reliable way, instead you should use row and event renderer functions to achieve what you want (see
 * the section on event styling above).
 *
 * To put the scheduler to the test, try our <a href="../examples/bigdataset/" target="_blank">bigdataset demo</a>.
 * {@endregion}
 * {@region Recurring Events}
 * There is an {@link Scheduler/view/mixin/RecurringEvents#config-enableRecurringEvents} boolean config on the Scheduler
 * that enables recurring events (not supported in the Community version). Occurrences of recurring events are provided
 * on a "just in time" basis by an EventStore API which must now be used when interrogating an EventStore.
 *
 * {@link Scheduler/data/mixin/GetEventsMixin#function-getEvents} is a multipurpose event gathering method which can be
 * asked to return events which match a set of criteria including a date range and a resource. By default, if the
 * requested date range contains occurrences of a recurring event, those occurrences are returned in the result array.
 *
 * ```javascript
 * myEventStore.getEvents({
 *     resourceRecord : myResourceRecord,
 *     startDate      : myScheduler.startDate,
 *     endDate        : myScheduler.endDate
 * });
 * ```
 *
 * Occurrences are *not* present in the store's data collection.
 *
 * To directly access occurrences of a recurring event which *intersect* a date range, use:
 *
 * ```javascript
 * recurringEvent.getOccurrencesForDateRange(startDate, endDate);
 * ```
 *
 * The `endDate` argument is optional if the occurrence for one date is required. This method always
 * returns an array. Note that it may be empty if no occurrences intersect the date range.
 *
 * ### Convert an occurrence to an exception
 * To programmatically convert an occurrence to be a single exception to its owner's sequence use:
 *
 * ```javascript
 * myOccurrence.beginBatch();
 * myOccurrence.startDate = DateHelper.add(myOccurrence.startDate, 1, 'day');
 * myOccurrence.name = 'Postponed to next day';
 * myOccurrence.recurrence = null; // This means it does NOT become a new recurring base event.
 * myOccurrence.endBatch();
 * ```
 *
 * That will cause that event to be inserted into the store as a concrete event definition, firing
 * an `add` event as would be expected, and will add an `exceptionDates` to its owning recurring event.
 *
 * When syncing this change back to the server, the `exceptionDates` array for the modified
 * recurring event now contains the exception dates correctly serialized into string form using
 * the `dateFormat` of the field. The system-supplied default value for this is
 * `'YYYY-MM-DDTHH:mm:ssZ'`
 *
 * ### Convert an occurrence to a new recurring event sequence.
 * To programmatically convert an occurrence to be the start of a new recurring sequence, use:
 *
 * ```javascript
 * myOccurrence.beginBatch();
 * myOccurrence.startDate = DateHelper.set(myOccurrence.startDate, 'hour', 14);
 * myOccurrence.name = 'Moved to 2pm from here on';
 * myOccurrence.endBatch();
 * ```
 *
 * That will cause that event to be inserted into the store as a concrete *recurring* event
 * definition, firing an `add` event as would be expected, and will terminate the previous
 * recurring owner of that occurrence on the day before the new event.
 * {@endregion}
 *
 * ## See also
 *
 * - {@link Scheduler.model.EventModel} - Event data model
 * - {@link Scheduler.model.ResourceModel} - Resource data model
 * - {@link Scheduler.data.EventStore} - Event store
 * - {@link Scheduler.data.ResourceStore} - Resource store
 * - {@link Scheduler.preset.ViewPreset} - View preset configuration
 *
 * ## Tiers
 *
 * Scheduler is available in the Community, Business and Enterprise tiers. Features are tiered, and each one shows a
 * badge for the lowest tier that includes it. The major difference between Business and Enterprise is the scheduling
 * logic. See the [Product tiers and class names](#Scheduler/guides/data/tiers.md) guide.
 *
 * See the [Scheduler features per tier](#Scheduler/guides/basics/feature-availability.md) guide.
 *
 * @extends Scheduler/view/SchedulerBase
 * @classtype scheduler
 * @widget
 * @tier community
 */
export default class Scheduler extends SchedulerBase {
    static $name = 'Scheduler';

    // Factoryable type name
    static type = 'scheduler';

    static configurable = {
        tierConfigs : {
            enterprise : {
                // Enterprise-tier feature defaults: TaskEdit replaces the simpler EventEdit popup. NOTE: `taskEdit`
                // must be an object, not `true` to merge with subclass configs
                features : {
                    taskEdit  : {},
                    eventEdit : false
                }
            }
        }
    };

    /**
     * Indicates whether this Scheduler is based upon the Enterprise tier.
     * @member {Boolean}
     * @readonly
     * @advanced
     */
    get isSchedulerPro() {
        return this.isEnterpriseTier;
    }
}

// Register this widget type with its Factory
Scheduler.initClass();
