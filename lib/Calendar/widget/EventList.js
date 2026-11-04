import DomHelper from '../../Core/helper/DomHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import Toast from '../../Core/widget/Toast.js';
import Grid from '../../Grid/view/Grid.js';
import GridFeature from '../../Grid/feature/GridFeature.js';
import CalendarMixin from './mixin/CalendarMixin.js';
import '../../Grid/column/DateColumn.js';
import '../../Core/widget/DateTimeField.js';
import Store from '../../Core/data/Store.js';
import Button from '../../Core/widget/Button.js';
import Config from '../../Core/Config.js';
import DayCellCollecter from './mixin/DayCellCollecter.js';
import DaySelectable from './mixin/DaySelectable.js';
import DateRangeOwner from './mixin/DateRangeOwner.js';
import Collection from '../../Core/util/Collection.js';
import ArrayHelper from '../../Core/helper/ArrayHelper.js';
import RangeMenu from './RangeMenu.js';

DomHelper.loadStylesheet('Calendar/widget/EventList.css');

// import Stylesheet from './EventList.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'EventList');

/**
 * @module Calendar/widget/EventList
 */

const
    byStartDate  = (lhs, rhs) => lhs.startDate.valueOf() - rhs.startDate.valueOf(),
    mergeColumns = (configuredColumns, defaultColumns) => {
        if (defaultColumns) {
            // Support  columns : { data : { name : { field : 'name', text : 'Name' }}}
            // or       columns : { data : [{ field : 'name', text : 'Name' }] }
            configuredColumns = configuredColumns.data || configuredColumns;

            // Object form { name : { field : 'name', text : 'Name' }}
            if (ObjectHelper.isObject(configuredColumns)) {
                const result = defaultColumns.slice();

                for (const id in configuredColumns) {
                    const
                        newColumn = configuredColumns[id],
                        // Match incoming column with existing by field name if there, or, if not, by name
                        matchIndex = result.findIndex(c => c.id === id || c.field === id);

                    // Configuration wants to add or override matched column
                    if (newColumn) {
                        const v = Config.merge(newColumn, result[matchIndex]);

                        // So that it can be looked up in future merges
                        v.id = id;
                        result[matchIndex === -1 ? result.length : matchIndex] = v;
                    }
                    // Configuration wants to remove matched column
                    else if (matchIndex > -1) {
                        result.splice(matchIndex, 1);
                    }
                }
                return result;
            }
            // Array form  [{ field : 'name', text : 'Name' }]
            else {
                defaultColumns = new Collection({
                    values     : defaultColumns,
                    idProperty : 'field'
                });

                // Iterate the configured column set
                for (let i = 0, { length } = configuredColumns; i < length; i++) {
                    const
                        newColumn             = configuredColumns[i],
                        matchedExistingColumn = defaultColumns.get(newColumn.field);

                    // Configuration wants to override matched column
                    if (matchedExistingColumn) {
                        configuredColumns[i] = Config.merge(newColumn, matchedExistingColumn);
                        defaultColumns.remove(matchedExistingColumn);
                    }
                }
                // Now append the remaining default columns
                configuredColumns.push(...defaultColumns.values);

                return configuredColumns;
            }
        }
        else {
            return configuredColumns;
        }
    },
    cleanseRowElement = e => {
        delete e.dataset.eventId; delete e.dataset.date;
    };

/**
 * A Grid view of the EventStore.
 *
 * This shows a configured range of events from the event store.
 *
 * When used as a {@link Calendar.view.Calendar#config-modes mode} of a Calendar, the configured
 * {@link #config-range} is snapped to encapsulate the Calendar's current
 * {@link Calendar.view.Calendar#config-date}.
 *
 * If configured with an explicit {@link #config-startDate} and {@link #config-endDate}, the
 * {@link #config-range} is not used. When setting the {@link #property-date}, the duration
 * of the configured range is preserved, but the range is shifted backwards or forwards in time
 * just enough to bring the passed `Date` into view.
 *
 * The EventList's header context menu is extended to allow the user to change the range type. This
 * may be disabled by configuring the {@link #config-listRangeMenu} as `null`.
 *
 * This view inherits all the capabilities of the {@link Grid.view.Grid}, and so is highly customizable.
 * You can add features, such as statefulness, filtering, and grouping, just like you would with a standard grid.
 *
 * You may add your own {@link #config-columns}, or reconfigure the default columns which
 * show the event name, start date, end date, and assigned resources.
 *
 * For further information about features available to be configured directly into `EventList`
 * calendar views, see the {@link Grid.view.Grid} documentation and the associated examples.
 *
 * {@inlineexample Calendar/widget/ListView.js}
 *
 * ## Useful configs
 *
 * | Config                        | Description                              |
 * |-------------------------------|------------------------------------------|
 * | {@link #config-range}         | Time range to display (e.g. `'1 month'`) |
 * | {@link #config-columns}       | Column definitions for the event grid    |
 * | {@link #config-listRangeMenu} | Menu for changing the displayed range    |
 * | {@link #config-eventRenderer} | Custom renderer for event content        |
 *
 * ## See also
 *
 * - {@link Calendar.view.Calendar} — The main Calendar that hosts this view
 * - {@link Calendar.widget.AgendaView} — Subclass providing a richer agenda layout
 * - {@link Calendar.column.EventColumn} — The column that renders event details
 * - {@link Calendar.widget.RangeMenu} — Menu for changing the displayed time range
 *
 * @demo Calendar/listview
 *
 * @extends Grid/view/Grid
 * @mixes Core/widget/mixin/Responsive
 * @mixes Calendar/widget/mixin/CalendarMixin
 * @mixes Calendar/widget/mixin/DayCellCollecter
 * @mixes Calendar/widget/mixin/DateRangeOwner
 * @classtype eventlist
 * @calendarview
 * @ts-widget
 * @tier community
 */
export default class EventList extends Grid.mixin(CalendarMixin, DayCellCollecter, DaySelectable, DateRangeOwner) {
    // EventList IS a Grid, so use GridFeature for auto-enable (headerMenu, columnResize, etc.).
    // CalendarMixin sets featureable to CalendarFeature, but that factory has no defaultEnabled
    // which would prevent Grid features from auto-enabling.
    static get featureable() {
        return {
            factory   : GridFeature,
            transform : GridFeature.transformConfig
        };
    }

    // <debug>
    // region Localization test
    static localization = [
        'L{days}',
        'L{eventCount}'
    ];
    // endregion
    // </debug>

    static $name = 'EventList';

    static type = 'eventlist';

    static configurable = {
        preserveScrollOnDatasetChange : true,

        cls : 'b-slide-vertical',

        rowCls : 'b-cal-event-list-row',

        eventFilter : null,

        localizableProperties : ['title', 'text'],

        title : 'L{List}',

        range : '1 month',

        // We have a Month utility object.
        // It helps us with week values and week change events
        month : true,

        /**
         * Column definitions to add to the default columns, or column definitions which override
         * the provided, default columns.
         *
         * By default, the `EventList` shows three columns:
         *
         * ```javascript
         * columns : [{
         *     text  : 'Name',
         *     field : 'name'
         * }, {
         *     text  : 'Start',
         *     field : 'startDate'
         * }, {
         *     text  : 'End',
         *     field : 'endDate'
         * }]
         * ```
         *
         * Your `columns` config is appended to the default columns *unless you provide
         * columns for the `name`, `startDate` and `endDate` fields*, in which case your
         * column definitions are merged into the default column definitions.
         *
         * In this way you can provide a `renderer` for the default columns, or otherwise
         * configure them in a customizable way.
         *
         * You can also supply columns keyed by field, to reconfigure / remove / add similar to how you would manage
         * items in containers and menus:
         *
         * ```javascript
         * columns : {
         *   // Remove the name column
         *   name : null,
         *   // Change the format of the startDate column
         *   startDate : {
         *      format : 'YYYY'
         *   },
         *   // Add a description column
         *   description : {
         *      renderer : ({ record }) => record.description.substring(0, 10)
         *   }
         * }
         * ```
         *
         * @config {Object<String,GridColumnConfig>|GridColumnConfig[]}
         */
        columns : {
            $config : {
                // Columns with matching field names are merged.
                // Non-matching columns are added
                merge : mergeColumns
            },

            value : [{
                text  : 'L{EventEdit.Name}',
                field : 'name',
                flex  : '1 0 12em'
            }, {
                text   : 'L{EventList.Start}',
                //type       : 'startDate', // When column is hoisted from Gantt to Scheduler
                type   : 'date',
                editor : {
                    type      : 'datetime',
                    dateField : {
                        // Hides the step triggers only - Shift+Arrow still steps one day.
                        // Set `stepTriggers : false` to remove that gesture too.
                        step : null
                    },
                    timeField : {
                        stepTriggers : false
                    }
                },
                field  : 'startDate',
                width  : '16.5em',
                format : 'L LT',
                renderer({ record, value }) {
                    return record.allDay ? this.dateHelper.format(value, 'L') : this.defaultRenderer(...arguments);
                }
            }, {
                text   : 'L{EventList.Finish}',
                //type       : 'endDate', // When column is hoisted from Gantt to Scheduler
                type   : 'date',
                editor : {
                    type      : 'datetime',
                    dateField : {
                        // Hides the step triggers only - Shift+Arrow still steps one day.
                        // Set `stepTriggers : false` to remove that gesture too.
                        step : null
                    },
                    timeField : {
                        stepTriggers : false
                    }
                },
                field  : 'endDate',
                width  : '16.5em',
                format : 'L LT',
                renderer({ record, value }) {
                    return record.allDay ? this.grid.dateHelper.format(value, 'L') : this.defaultRenderer(...arguments);
                }
            }, {
                type     : 'widget',
                text     : 'Resources',
                field    : 'resources',
                minWidth : 250,
                widgets  : [{
                    type           : 'chipview',
                    valueProperty  : 'items',
                    displayField   : 'name',
                    itemsFocusable : false,
                    navigator      : null,
                    closable       : false,
                    style          : {
                        flexFlow : 'row nowrap',
                        display  : 'flex',
                        padding  : '5px 0 3px 0'
                    },
                    scrollable : {
                        overflowX : 'hidden-scroll',
                        overflowY : false
                    },
                    getItemCls   : () => `b-bryntum`,
                    getItemStyle : r => `--b-primary: ${DomHelper.createColorStyle(r.eventColor)}`
                }],
                editor : false
            }]
        },

        features : {
            cellEdit     : true,
            sort         : true,
            group        : false,
            rowCopyPaste : false,
            columnPicker : {
                createColumnsFromModel : true
            }
        },

        internalListeners : {
            beforeCellEditStart({ editorContext }) {
                const { editor, record } = editorContext;

                // <remove-on-release>
                // TODO: Editing recurring events: https://github.com/bryntum/bryntum/issues/2259
                // </remove-on-release>
                if (record.isRecurring || record.isOccurrence) {
                    Toast.show({
                        html : 'Please use EventEdit to edit recurring events'
                    });
                    return false;
                }

                // Hide event tooltip if present.
                this.calendar?.features.eventTooltip?._tooltip?.hide();

                editor.timeField?.[record.allDay ? 'hide' : 'show']();
            }
        },

        settingsButton : {
            $config : 'lazy',
            value   : null
        },

        /**
         * A {@link Calendar.widget.RangeMenu} configuration block which configures the range choosing menu provided which
         * by default selects one of the following:
         * - day
         * - week
         * - month
         * - year
         * - decade
         *
         * This may be used to either reconfigure that menu, or, by configuring it as `null`, could remove
         * the menu entirely if the date range of this view is controlled by other means.
         *
         * The individual range menu items are under the `items` property and have the following
         * property names:
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
         *         agenda : {
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
         * @config {RangeMenuConfig|null} listRangeMenu
         */
        listRangeMenu : {
            $config : 'lazy',
            value   : {
                type     : 'rangemenu',
                floating : false
            }
        },

        /**
         * A {@link Core.helper.DateHelper} format string/function used to format the time displayed
         * next to event bars in the custom columns which {@link Calendar.widget.EventList}
         * based views use - {@link Calendar.widget.EventList} and {@link Calendar.widget.AgendaView}.
         * @config {String|Function}
         * @param {Date} date The date to format.
         * @returns {String} The formatted date.
         * @default
         */
        eventListTimeFormat : 'HH:mm',

        /**
         * A function, or name of a function in the ownership hierarchy which is used to create
         * the time output next to event bars in an agenda cell.
         *
         * The result of this function is used as the content of an element which has
         * the CSS class `'b-cal-event-list-event-time'`.
         *
         * ```javascript
         * modes :
         *     agenda : {
         *         // Add extra info below the time.
         *         // We set .b-cal-event-list-event-time to flex-direction : column
         *         eventTimeRenderer({ eventRecord, date }) {
         *             return [
         *                 this.defaultEventTimeRenderer({ eventRecord, date }),
         *                 {
         *                     className : 'event-location',
         *                     text      : eventRecord.location
         *                 }
         *             ];
         *         }
         *     }
         * }
         * ```
         *
         * @prp {Function|String}
         * @param {Scheduler.model.EventModel} eventRecord The event record for which to create a time string.
         * @param {Date} date The date of the cell in which the event is being rendered.
         * @returns {String|DomConfig|DomConfig[]}
         */
        eventTimeRenderer : null
    };

    /**
     * Returns the resource associated with this event list when used inside a {@link Calendar.widget.ResourceView}
     * @readonly
     * @member {Scheduler.model.ResourceModel} resource
     */

    static delayable = {
        populateStoreSoon : {
            type              : 'raf',
            cancelOutstanding : true
        }
    };

    construct(...args) {
        const
            me           = this,
            featuresProp = ObjectHelper.getPropertyDescriptor(this, 'features');

        // Enable print feature on EventList view if it was configured directly or on the calendar
        Object.defineProperty(me, 'features', {
            get : () => {
                return featuresProp.get.call(this) || {};
            },
            set : features => {
                if (features === true) {
                    features = {};
                }
                if (!features.print) {
                    features.print = Boolean(this.calendar?.features.print);
                }
                featuresProp.set.call(this, features);
            },
            configurable : true
        });

        super.construct(...args);
    }

    // We must implement the CalendarMixin interface.
    // All views must expose a doRefresh method.
    doRefresh() {
        this.refreshRows();
    }

    getEventElement(eventRecord, date = Math.max(eventRecord.startDate, this.firstVisibleDate || this.startDate)) {
        // Try as a base grid EventList first, then fall back to separate event *bars* being rendered.
        return this.eventContentElement.querySelector(`.b-grid-row[data-event-id="${CSS.escape(eventRecord.id)}"][data-date="${this.dateHelper.makeKey(date)}"]`) ||
            super.getEventElement(...arguments);
    }

    // Returns true is this EventList encapsulates this date
    containsDate(date) {
        const dateContainmentFn = this.range ? 'betweenLesser' : 'betweenLesserEqual';

        return this.dateHelper[dateContainmentFn](date, this.startDate, this.endDate);
    }

    /**
     * This method produces the event time details next to the event bar in
     * {@link Calendar.widget.EventList} and {@link Calendar.widget.AgendaView}
     * as a {@link DomConfig} object.
     *
     * The content is encapsulated in an element with CSS class `b-cal-event-list-event-time`.
     * For multi day events, the ending date is shown. For intra-day events, the start and end
     * times are shown.
     * @param {Scheduler.model.EventModel} eventRecord
     * @param {Date} forDate The date cell into which the event is being rendered.
     * @returns {DomConfig}
     */
    eventListEventTimeRenderer(eventRecord, forDate) {
        const me = this;

        let timeContent;

        if (me.eventTimeRenderer) {
            timeContent = me.callback(me.eventTimeRenderer, me, arguments);
        }
        else {
            timeContent = me.defaultEventTimeRenderer(eventRecord, forDate);
        }

        const prop = typeof timeContent === 'string' ? 'text' : 'children';

        return {
            className : {
                'b-cal-event-list-event-time' : 1
            },
            'aria-hidden' : true,
            [prop]        : prop === 'text' ? timeContent : ArrayHelper.asArray(timeContent)
        };
    }

    /**
     * Produces the time details next to the event bar in {@link Calendar.widget.EventList} and {@link Calendar.widget.AgendaView}.
     *
     * This may be called from a custom {@link #property-eventTimeRenderer} function to produce
     * the default time details.
     * @param {Scheduler.model.EventModel} eventRecord
     * @param {Date} forDate The date cell into which the event is being rendered.
     * @returns {String} The time details.
     */
    defaultEventTimeRenderer(eventRecord, forDate) {
        const
            me          = this,
            { dh }      = me,
            {
                startDate,
                endDate,
                allDay
            }           = eventRecord,
            startsOn    = dh.clearTime(startDate),
            endsOn      = dh.clearTime(endDate),
            endingDate  = endsOn && (endDate - endsOn ? endDate : dh.add(endsOn, -1, 'd')),
            crossesDay  = !eventRecord.isMilestone && (endDate - endsOn ? endsOn : endingDate) - startsOn;

        let timeString;

        if (crossesDay) {
            // First day of day-crossing, granular time event.
            // Show start *time* and the ending date "15:00 - 18 Jun"
            if (!allDay && !(forDate - startsOn)) {
                timeString = `${dh.format(startDate, me.eventListTimeFormat)} - ${dh.format(endingDate, 'DD MMM')}`;
            }
            // Last day of day-crossing, granular time event.
            // Show just end time: "Ends 09:00"
            else if (!allDay && !(forDate - endsOn)) {
                timeString = me.L('L{Calendar.endsOn}', dh.format(endDate, me.eventListTimeFormat));
            }
            // Middle day, or it has no granular time, just show endDate
            else {
                timeString = me.L('L{Calendar.endsOn}', dh.format(endingDate, 'DD MMM'));
            }
        }
        else {
            timeString = allDay
                ? me.L('L{Calendar.allDay}')
                : `${dh.format(eventRecord.startDate, me.eventListTimeFormat)} - ${dh.format(endDate, me.eventListTimeFormat)}`;
        }
        return timeString;
    }

    /**
     * This method produces the date details block in {@link Calendar.widget.AgendaView} cells
     * as a {@link DomConfig} object.
     *
     * The content is encapsulated in an element with CSS class `b-cal-agenda-date`.
     * @param {Date} date
     * @returns {DomConfig} The date details block in the following format:
     * ```json
     * {
     *     className : {
     *         'b-day-name'        : 1,
     *         'b-cal-agenda-date' : 1,
     *         'b-today'           : true|false
     *     },
     *     'tabIndex'    : 0,
     *     'role'        : 'link',
     *     children      : [{
     *         'aria-hidden' : true,
     *         className : {
     *             'b-cal-agenda-date-date-number' : 1
     *         },
     *         text : 15 // The date
     *     }, {
     *         'aria-hidden' : true,
     *         className : {
     *             'b-cal-agenda-date-date-text' : 1
     *         },
     *         children : [{
     *             text : 'Monday' // The day name
     *         }, {
     *             text : 'Jun 2020' // The month and year
     *         }]
     *     }]
     * }
     * ```
     */
    agendaEventDateRenderer(date) {
        const
            { dh }    = this,
            isToday   = this.isToday(date),
            todayText = isToday ? this.L('L{Object.today}, ') : '';

        // Element is clickable, so it must also be tabbable with a role and an aria-label
        // so that it is clickable by keyboard users.
        return {
            className : {
                'b-day-name'        : 1,
                'b-cal-agenda-date' : 1,
                'b-today'           : isToday
            },
            tabIndex     : 0,
            role         : 'link',
            'aria-label' : `${todayText}${dh.format(date, 'dddd, MMMM Do YYYY')}`,
            children     : [{
                'aria-hidden' : true,
                className     : {
                    'b-cal-agenda-date-date-number' : 1
                },
                text : dh.getDate(date)
            }, {
                'aria-hidden' : true,
                className     : {
                    'b-cal-agenda-date-date-text' : 1
                },
                children : [{
                    text : dh.format(date, 'dddd')
                }, {
                    text : dh.format(date, 'MMM YYYY')
                }]
            }]
        };
    }

    // Override because our Featurable mixin which comes before GridBase sets features to null
    // to destroy them, so we must ensure the inherited Grid features are cleaned up.
    destroy() {
        for (const feature of Object.values(this.features)) {
            feature.destroy?.();
        }

        super.destroy();
    }

    populateHeaderMenu({ items }) {
        const { listRangeMenu : menu } = this;

        if (menu) {
            menu.appendTo = this.element;
            items.listRangeItem = {
                weight : -1000,
                icon   : 'b-icon-calendar-week',
                text   : 'L{Calendar.timeRange}',
                menu
            };
        }
        super.populateHeaderMenu(...arguments);
    }

    refreshVirtualScrollbars() {
        super.refreshVirtualScrollbars();

        // Our floating settings button needs to be inset a little more if there is a visible scrollbar
        this.bodyElement.classList[DomHelper.scrollBarWidth && this.overflowingVertically ? 'add' : 'remove']('b-has-scrollbar');
    }

    /**
     * This property yields a {@link Calendar.widget.RangeMenu} configuration block which encapsulates the range choices
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
     * @member {RangeMenuConfig} listRangeMenu
     * @readonly
     */
    changeListRangeMenu(listRangeMenu) {
        if (listRangeMenu) {
            return RangeMenu.mergeConfigs({
                view : this
            }, listRangeMenu);
        }
    }

    updateRowManager(rowManager) {
        super.updateRowManager?.(...arguments);

        // Make sure rows which represent EventModels have [data-event-id="?"] stamped into them.
        rowManager.ion({
            beforeRenderRow : 'onBeforeRenderRow',
            thisObj         : this
        });
    }

    onBeforeRenderRow({ row, record }) {
        const
            { dh }             = this,
            { _elementsArray } = row,
            { id, startDate }  = record,
            oldDate            = dh.parseKey(_elementsArray[0]?.dataset?.date || '');

        if (oldDate) {
            row.cls[`b-day-of-week-${dh.getDay(oldDate)}`] = 0;
        }
        // Cleanse row of any connection to an eventRecord
        row.eachElement(e => cleanseRowElement);

        // Only if it represents an EventModel do we connect the DOM to an event id and its start date.
        // In AgendaView, there are event bars with the event id, and the cells encapsulate dates.
        if (record.isEventModel) {
            for (let i = 0, { length } = _elementsArray; i < length; i++) {
                _elementsArray[i].dataset.eventId = id;
                _elementsArray[i].dataset.date = startDate ? dh.makeKey(startDate) : '';
            }
            startDate && (row.cls[`b-day-of-week-${dh.getDay(startDate)}`] = 1);
            this.calendar?.beforeListRenderRow?.({ row, record });
        }
    }

    // Scheduler interface usually routes this to handleEvent.
    // If we're a Grid, GridElementEvents routes events to handleEvent, so override it to do nothing.
    // Otherwise keydown events would be handled twice
    onInternalKeyDown(domEvent) {}

    get displayName() {
        let s = this.title;

        if (typeof s !== 'string') {
            s = this.type;
        }

        return StringHelper.capitalize(s);
    }

    /**
     * Scrolls vertically to bring an event or a time into view.
     * @param {Scheduler.model.EventModel|Date|String} target The event to scroll to or a `Date`, or `YYYY-MM-DD` date to scroll to.
     * @param {Object} [options] How to scroll.
     * @param {String} [options.block] How far to scroll the target: `start/end/center/nearest`.
     * @param {Number} [options.edgeOffset] edgeOffset A margin around the target to bring into view.
     * @param {Object|Boolean|Number} [options.animate] Set to `true` to animate the scroll by 300ms,
     * or the number of milliseconds to animate over, or an animation config object.
     * @param {Number} [options.animate.duration] The number of milliseconds to animate over.
     * @param {String} [options.animate.easing] The name of an easing function.
     * @param {Boolean|Function} [options.highlight] Set to `true` to highlight the resulting element
     * when it is in view. May be a function which is called passing the resulting element
     * to provide customized highlighting.
     * @param {Boolean} [options.focus] Set to `true` to focus the element when it is in view.
     * @param {Boolean} [options.y] Pass as `false` to disable scrolling in the `Y` axis.
     * @returns {Promise} A promise which is resolved when the target has been scrolled into view.
     */
    async scrollTo(target, options) {
        const me = this;

        options = ObjectHelper.assign({}, me.defaultScrollOptions, typeof options == 'boolean' ? { animate : options } : options);

        if (target instanceof me.store.modelClass) {
            // Scroll the passed record into view
            await me.scrollRowIntoView(target, Object.assign({}, options, { highlight : false }));

            if (options.highlight) {
                target = me.getEventElement(target, target.startDate);
                if (typeof options.highlight === 'boolean') {
                    DomHelper.highlight(target, me);
                }
                else {
                    (me.widget || me).callback(options.highlight, null, [target]);
                }
            }
        }
        else if (ObjectHelper.isDate(target = me.ingestDate(target)) && me.store.count) {
            const key = me.dateHelper.makeKey(target = me.findClosestOccupiedDate(target));

            me.scrollingToDate = true;
            await me.scrollRowIntoView(me.dateIndex[key], options);
            me.scrollingToDate = false;
            me.scrolledToDate = target;
        }
    }

    // Find the date of the record closest to the passed date
    findClosestOccupiedDate(date) {
        const
            me          = this,
            { dayTime } = me,
            index       = me.dateIndex;

        // If we are empty, give up and just stay with current date.
        // We have a row for this date.
        if (!Object.keys(index).length || index[dayTime.dateKey(date)]) {
            return date;
        }

        // Otherwise, find the closest in time
        let closest = Number.MAX_SAFE_INTEGER;
        const keys = Object.keys(index);    // All the keys in the index

        for (let i = 0, { length } = keys; i < length; i++) {
            const d = dayTime.parseKey(keys[i]); // The date of the key

            if (Math.abs(d - date) < Math.abs(closest - date)) {
                closest = d;
            }
        }
        return new Date(closest);
    }

    updateStartDate() {
        const { refreshCount } = this;

        // Prevent this.onMonthChange from trying to scroll when we update our month's active date
        this.preventScroll = true;
        super.updateStartDate(...arguments);
        this.preventScroll = false;

        // Superclass's updateStartDate will most likely cause a refresh due to changing the date.
        // But if we're moving to a larger encapsulating range (eg 1w to 1y), the date may
        // not be forced to change, so kick off a refresh if it has not been done.
        if (!this.isConfiguring && this.refreshCount === refreshCount) {
            this.populateStoreSoon();
        }
    }

    updateEndDate() {
        const { refreshCount } = this;

        super.updateEndDate?.(...arguments);

        // Superclass's updateEndDate will most likely cause a refresh due to changing the date.
        // But if we're moving to a larger encapsulating range (eg 1w to 1y), the date may
        // not be forced to change, so kick off a refresh if it has not been done.
        if (!this.isConfiguring && this.refreshCount === refreshCount) {
            this.populateStoreSoon();
        }
    }

    // Interface method used by the Describable Scheduler mixin which renders the date(s) of a view
    // If the result is an array, it creates a range description based on the descriptionFormat.
    get dateBounds() {
        return [this.startDate, this.endDate];
    }

    // We default the range description format to using the shortDateFormat each side (from and to)
    // but this can be configured.
    get descriptionFormat() {
        return super.descriptionFormat || [this.shortDateFormat, `S{${this.shortDateFormat}} - E{${this.shortDateFormat}}`];
    }

    set descriptionFormat(descriptionFormat) {
        super.descriptionFormat = descriptionFormat;
    }

    descriptionRenderer() {
        return `${this.formattedDescription}. ${this.L('L{eventCount}', this.eventCount || 0)}`;
    }

    // Overridden from CalendarMixin which uses the cellMap to ascertain event load
    get eventCount() {
        return this.store.getAllDataRecords().length;
    }

    get store() {
        return super.store;
    }

    set store(store) {
        if (store && !store.modelClass && this.project) {
            store.modelClass = this.project.eventStore.modelClass;
        }
        super.store = store;
    }

    /**
     * When an EventStore arrives, chain off a slave store from that which we can then
     * filter to only show the week we are focused upon.
     */
    updateEventStore(eventStore) {
        super.updateEventStore?.(eventStore);

        this.detachListeners('eventStore');

        // We monitor changes to the EventStore and repopulate our store if it needs it.
        eventStore.ion({
            name    : 'eventStore',
            refresh : 'onCalendarStoreChange',
            thisObj : this
        });

        this.populateStoreSoon();
    }

    changeStore(store) {
        const me = this;

        if (store) {
            store = Store.mergeConfigs({
                useRawData : {
                    ignoreDefaults        : true,
                    disableDefaultValue   : true,
                    disableTypeConversion : true,
                    enabled               : true
                },
                modelClass : me.modelClass
            }, store);
        }
        store = super.changeStore(store);

        // Ensure our subclass, AgendaView is able to use its own filter
        if (store?.modelClass.isEventModel) {
            me.nonWorkingDaysFilter = store.addFilter({
                id       : `${me.id}-nonworkingday-filter`,
                filterBy : event => !me.dayTime.isIntraDay(event) || !me.hiddenNonWorkingDays[me.dateHelper.getDay(event.startDate)],
                disabled : !me.hideNonWorkingDays
            }, true);

        }
        return store;
    }

    updateHideNonWorkingDays(hideNonWorkingDays) {
        const
            me        = this,
            { store } = me;

        super.updateHideNonWorkingDays(hideNonWorkingDays);

        // We do it by filtering the generated day records by the isNonWorking flag
        if (store) {
            me.nonWorkingDaysFilter.disabled = !hideNonWorkingDays;
            store.filter();
        }
        me.trigger('refresh');
    }

    afterRemove({ records }) {
        // If they remove records from the Grid Store, assume they want to remove the underlying
        // events from the eventStore.
        this.eventStore.remove(records);
        super.afterRemove(...arguments);
    }

    get modelClass() {
        return this.eventStore.modelClass;
    }

    /**
     * This is called when our store needs to be repopulated from the eventStore
     * @private
     */
    populateStoreSoon() {
        const
            me          = this,
            { project } = me;

        // Only refresh immediately if we are visible.
        if (me.isVisible) {
            // <remove-on-release>
            // TODO: Should not draw anything before projects initial refresh. Unless there's no data.
            // </remove-on-release>
            // Only populate if initial commit is performed and change is not triggered by project writing back data
            if ((project.isInitialCommitPerformed && !project.isWritingData) || !project.eventStore.count) {
                me.populateStore();
            }
        }
        // Otherwise wait till next time we get painted (shown, or a hidden ancestor shown)
        else {
            me.whenVisible('populateStore');
        }
    }

    get duration() {
        // If we are in startDate->endDate mode, as opposed to using a fixed "range"
        // around a date, then to provide a more intuitive interface, we *include* the endDate
        // for EventLists
        return super.duration + (this.range ? 0 : 1);
    }

    populateStore() {
        const
            me           = this,
            { dh }       = me,
            { cellEdit } = me.features,
            ec           = cellEdit?.editorContext,
            events       = me.eventStore.getEvents({
                startDate : me.startDate,

                // If we are being set a startDate and endDate, as opposed to using a fixed "range"
                // around a date, then to provide a more intuitive interface, we *include* the endDate
                // for EventLists
                endDate : dh.add(me.endDate, me.range ? 0 : 1, 'd'),
                filter  : me.eventFilter
            }).sort(byStartDate);

        // Create our date index by which we can scroll to dates.
        me.dateIndex = events.reduce((result, event) => {
            const key = dh.makeKey(event.startDate);

            if (!result[key]) {
                result[key] = event;
            }
            return result;
        }, {});

        // The complete data replacement disturbs CellEdit
        // If editing is in progress, cache the context and cancel it
        // to resume after the refresh.
        if (ec) {
            cellEdit.cancelEditing();
        }
        me.store.data = events;

        // An owning Calendar's onViewRefresh will respond and sync with the new state
        me.trigger('refresh');
        if (ec) {
            cellEdit.startEditing(ec);
        }
    }

    /**
     * Creates the Month utility object. We use it to track what week we are looking at.
     */
    changeMonth() {
        const result = super.changeMonth(...arguments);

        // Update when the month changes.
        result.ion({
            dateChange : 'onMonthChange',
            thisObj    : this
        });

        return result;
    }

    /**
     * When the date we have been told to look at changes, recalculate the date range.
     * If the date range changes, this will cause a refill of our grid store from the
     * master event store.
     */
    onMonthChange({ newDate }) {
        const
            me            = this,
            { startDate } = me,
            newStartDate  = me.changeStartDate(newDate);

        // Move range so that it encapsulates the target date if necessary
        if (!startDate || (newStartDate - startDate && !me.containsDate(newStartDate))) {
            me.updateRange(me.range);
        }

        // Only attempt if the store got populated and we are visible.
        if (!me.preventScroll && me.isVisible && me.store.count) {
            // Ensure any store rebuild triggered by reconfiguring is flushed before
            // we attempt to scroll to that date
            me.populateStoreSoon.flush();

            me.scrollTo(newDate);
        }
    }

    /**
     * This is added as a listener by the CalendarStores mixin.
     *
     * Our store is chained off of the EventStore; refill it if the EventStore changes.
     * The store will fire events which cause UI update.
     * We must fire a refresh event so that the encapsulating Calendar view knows about this.
     */
    onCalendarStoreChange({ source : eventStore }) {
        if (!this.date) {
            this.date = eventStore.map(r => r.startDate).sort((lhs, rhs) => lhs.valueOf() - rhs.valueOf())[0];
        }

        // Only refresh immediately if we are visible.
        this.populateStoreSoon();
    }

    changeSettingsButton(settings, oldSettings) {
        return settings && Button.reconfigure(oldSettings, Button.mergeConfigs({
            type         : 'button',
            positioned   : true,
            icon         : 'b-icon-cog',
            menuIcon     : null,
            rendition    : 'text',
            cls          : 'b-cal-widget-settings-button',
            insertBefore : this.bodyWrapElement
        }, settings), this);
    }

    //region Current config

    getCurrentConfig(options) {
        const result = super.getCurrentConfig(options);

        // Internally assigned
        delete result.store;
        delete result.data;

        return result;
    }

    //endregion
}

EventList.initClass();
