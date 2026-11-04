import EventList from './EventList.js';
import ArrayHelper from '../../Core/helper/ArrayHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import Responsive from '../../Core/widget/mixin/Responsive.js';
import GridRowModel from '../../Grid/data/GridRowModel.js';
import GridFeature from '../../Grid/feature/GridFeature.js';
import ElementVisitor from '../../Core/util/ElementVisitor.js';
import CalendarMixin from './mixin/CalendarMixin.js';
import '../column/AgendaColumn.js';

DomHelper.loadStylesheet('Calendar/widget/AgendaView.css');

// import Stylesheet from './AgendaView.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'AgendaView');

/**
 * @module Calendar/widget/AgendaView
 */

const
    isMouseOverOut = {
        mouseover : 1,
        mouseout  : 1
    },
    isMouseInteraction = {
        mousedown   : 1,
        mouseup     : 1,
        click       : 1,
        dblclick    : 1,
        contextmenu : 1
    },
    compareDate = ({ date : lhs }, { date : rhs }) => lhs - rhs;

/**
 * This is normally used as a {@link Calendar.view.Calendar#config-modes mode} of a Calendar (as seen in the live
 * demo below) but may be used standalone as a regular Widget.
 *
 * {@inlineexample Calendar/widget/CalendarAgendaView.js}
 *
 * As a standalone widget, it will lack the capabilities of the {@link Calendar.view.Calendar}
 * class, such as keyboard-based event to event navigation and drag/drop features. As seen in this demo:
 *
 * {@inlineexample Calendar/widget/AgendaView.js}
 *
 * A Grid which displays an agenda view of the events in an EventStore.
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
 * The AgendaView offers a floating settings button to allow the user to change the range type. This
 * may be disabled by configuring the {@link #config-listRangeMenu} as `null`.
 *
 * ### Column renderer
 * The content of each agenda cell is created by the {@link Calendar.column.AgendaColumn}'s
 * {@link Calendar.column.AgendaColumn#function-defaultRenderer}
 *
 * To inject content or manipulate the cell's DOM, you may configure the column with a renderer:
 *
 * ```javascript
 * modes : {
 *     agenda : {
 *         columns : {
 *             agenda : {
 *                 renderer({ cellElement, record : cellData }) {
 *                     // Manipulate the cell as we need
 *                     cellElement.classList.toggle('is-sunday', cellData.day === 0);
 *
 *                     // We need the system-provided cell rendering
 *                     return this.defaultRenderer(...arguments);
 *                 }
 *             }
 *         }
 *     }
 * }
 * ```
 *
 * ## Useful configs
 *
 * | Config                        | Description                                      |
 * |-------------------------------|--------------------------------------------------|
 * | {@link #config-range}         | Time range to display (e.g. `'year'`, `'month'`) |
 * | {@link #config-listRangeMenu} | Menu for changing the displayed range            |
 * | {@link #config-columns}       | Column definitions for the agenda grid           |
 * | {@link #config-eventRenderer} | Custom renderer for event bars                   |
 *
 * ## See also
 *
 * - {@link Calendar.view.Calendar} — The main Calendar that hosts this view
 * - {@link Calendar.widget.EventList} — Parent class providing grid-based event listing
 * - {@link Calendar.column.AgendaColumn} — The column that renders agenda day cells
 *
 * @extends Calendar/widget/EventList
 * @classtype agendaview
 * @tier community
 * @classtypealias agenda
 * @calendarview
 * @ts-widget
 */
export default class AgendaView extends EventList.mixin(Responsive) {

    static $name = 'AgendaView';

    static type = 'agendaview';

    static configurable = {
        /**
         * Replaces the default {@link #function-agendaEventDateRenderer} which produces the date details block in
         * the date cell at the start of each date's row:
         *
         * ```javascript
         * modes : {
         *     agenda : {
         *         agendaEventDateRenderer(date) {
         *             return {
         *                 className : {
         *                     'b-cal-agenda-date' : 1
         *                 },
         *                 text : DateHelper.format(date, 'ddd D')
         *             };
         *         }
         *     }
         * }
         * ```
         *
         * @config {Function} agendaEventDateRenderer
         * @param {Date} date The date for which to produce the date details block.
         * @returns {DomConfig} The date details block.
         */

        eventSorter : (event1, event2) => {
            const
                {
                    startDate  : start1,
                    isInterDay : event1InterDay
                } = event1,
                {
                    startDate  : start2,
                    isInterDay : event2InterDay
                } = event2;

            // InterDay events sort to the top (https://github.com/bryntum/bryntum/issues/1693).
            if (event1InterDay !== event2InterDay) {
                return Number(event2InterDay) - Number(event1InterDay);
            }

            // If both events fit inside one day cell, the only sort order we care about is start time.
            if (!event1InterDay && !event2InterDay) {
                return start1 - start2;
            }

            // Sort events from previous cells to the top, then by duration (longest first), then by ending date (furthest in future first).
            // This is *in-cell* sorting.
            return start1 - start2 || event2.durationMS - event1.durationMS || event2.endingDate - event1.endingDate;
        },

        /**
         * The spacing between event bars in the default rendering of a day cell.
         * @config {Number|String}
         * @default
         */
        eventRowSpacing : 8,

        title : 'L{Agenda}',

        range : 'year',

        /**
         * By default, long running events are repeated in all rows that the event covers.
         *
         * Configure this as `true` to only see the start of a long running event in its
         * start day.
         * @config {Boolean}
         */
        hideEventOverflow : null,

        /**
         * This view lines up the textual content of event bars by shifting event bars of
         * events which start before the bar's cell leftwards by the arrow width.
         *
         * Set this config to `false` to prevent this.
         * @prp {Boolean}
         * @default
         */
        offsetStartsBeforeEvents : true,

        // We handle this internally using the notifications from the GridElementEvents mixin
        handlePointerInteraction : false,

        /**
         * Specify `false` to display column headers
         * @config {Boolean}
         * @default
         * @category Misc
         */
        hideHeaders : true,

        /**
         * Column definitions.
         *
         * By default, a single {@link Calendar.column.AgendaColumn} is configured which creates
         * the default cell content for one day's events.
         *
         * You may configure the default agenda column away, and provide a custom column type
         * to produce the day's content where the `record` passed is a
         * {@link Calendar.widget.mixin.DayCellCollecter#typedef-DayCell}.
         *
         * Because cells may contain varying numbers of events, all columns in an AgendaView are
         * set to {@link Grid.column.Column#config-autoHeight}
         *
         * ```javascript
         * class MyAgendaColumn extends Column {
         *     // So we automatically get b-myagenda-cell class on the cells
         *     static get type() {
         *         return 'myagenda';
         *     }
         *
         *     renderer({ cellElement, record : cellData }) {
         *         // Create a DomHelper element configuration object here using cellData
         *         // cellData contains date contextual info and an events array.
         *     }
         * }
         *
         * ...
         *
         * {
         *     columns : {
         *         agenda : null,
         *         {
         *             type : 'mycolumntype'
         *         }
         *     }
         * }
         *
         * // Register this Column type so that in the app we can use type : 'myagendacolumn'
         * ColumnStore.registerColumnType(MyAgendaColumn);
         * ```
         *
         * @config {Object|Object[]}
         * @default { agenda : { type : 'agendacolumn' } }
         */
        columns : {
            // We knock out the columns we inherit from EventList.
            name      : null,
            startDate : null,
            endDate   : null,
            resources : null,
            agenda    : {
                type : 'agendacolumn'
            }
        },

        preserveScrollOnDatasetChange : true,

        /**
         * The "Settings" button which is a floating button which offers the Agenda {@link #property-listRangeMenu range selection menu}
         * @prp {Core.widget.Button}
         * @property {String} actionKey The composed key name to press to open the settings menu. Default is 'CTRL+R'
         * @accepts {ButtonConfig}
         */
        settingsButton : {
            ref       : 'settingsButton',
            actionKey : 'Ctrl+r',
            ariaLabel : 'L{settings}',
            keyMap    : {
                Escape : 'revertFocus'
            }
        },

        cellTabIndex : null,

        rowCls : {
            'b-cal-agenda-grid-row' : 1
        },

        cellCls : {
            'b-calendar-cell' : 1
        },

        eventBarContainerCls : 'b-cal-event-bar-container',

        // No GridNavigation key events in an AgendaView. It is natural, event-to-event navigation.
        keyMap : null,

        // Our rows encapsulate dates and *contain* events, so they are raw GridRowModels
        // The id field is mapped to the date key
        store : {
            modelClass : class extends GridRowModel {
                static fields = [{
                    name       : 'id',
                    dataSource : 'key'
                }];
            }
        },

        listRangeMenu : {
            anchor : true
        },

        /**
         * A callback function, or the name of a function in the ownership hierarchy which an
         * application may provide to filter out agenda rows for individual dates.
         * @prp {Function|String} dateFilter
         * @param {DayCell} context Information about the day rows to be created.
         * @returns {Boolean} Return `false` to not display a rows for the passed date.
         */
        dateFilter : null,

        /**
         * If no dates in the view's configured date range contain events, then by default, no date cells are rendered.
         *
         * Set this to `true` to always show a cell for the calendar's {@link Calendar.view.Calendar#property-date} in
         * order to allow users to interact with the view, for example by using the context menu, or the
         * {@link #config-autoCreate} gesture.
         *
         * @prp {Boolean}
         * @default false
         */
        alwaysShowCurrentDate : null,

        /**
         * By default, only dates which contain events are shown.
         *
         * If set to `true` the view will include all dates in the configured range.
         * @prp {Boolean}
         * @default false
         */
        showAllDates : null,

        /**
         * By default, only cells for days which contain events are shown.
         *
         * If set to `true` the view will include cells for days which contain no events.
         * @prp {Boolean}
         * @default false
         */
        showEmptyDates : null,

        emptyText : 'L{YearView.noEvents}',

        topDate : {
            $config : {
                equal : 'date'
            },
            value : null
        }
    };

    /**
     * Returns the resource associated with this agenda view when used inside a {@link Calendar.widget.ResourceView}
     * @readonly
     * @member {Scheduler.model.ResourceModel} resource
     */

    construct(config) {
        const
            me           = this,
            featuresProp = ObjectHelper.getPropertyDescriptor(this, 'features');

        // Disable GridFeatures in AgendaView.
        // This is necessary in the built version where the features are all included
        // because of the needs of the docs app to use Grid for its own UI and because
        // many documentation examples run Grid examples.
        // This should change when https://github.com/bryntum/bryntum-suite/issues/1475 is addressed
        Object.defineProperty(me, 'features', {
            get : () => {
                return featuresProp.get.call(this);
            },
            set : features => {
                const
                    f              = {},
                    instanceNames  = this.$meta.names,
                    { registry }   = GridFeature.factoryable;

                // Kill all the defaults by iterating the registry.
                // The registry stores each class under both its canonical name (e.g. 'cellEdit') and
                // its lowercase alias (e.g. 'celledit'). We only process lowercase keys to avoid
                // double-processing.
                for (const type in registry) {
                    const featureClass = registry[type];

                    if (featureClass.type.toLowerCase() !== type) {
                        continue;
                    }

                    const canonicalType = featureClass.type;

                    if (this.constructor.resolveDefaultEnabled(featureClass.defaultEnabled, this.tier, instanceNames)) {
                        f[canonicalType] = false;
                    }
                }

                // We want to pass print config to the agenda view or simply enable print
                // feature if it is enabled on the calendar
                f.print = features?.print || Boolean(this.calendar?.features.print);
                featuresProp.set.call(this, f);
            },
            configurable : true
        });
        super.construct(config);

        // Our keyMap must be the CalendarMixin's one, *not* the Grid's one
        me.keyMap = CalendarMixin().$meta.config.keyMap;
    }

    onCalendarKeyDown(keyEvent) {
        const
            {
                eventContentElement
            }                 = this,
            { target }        = keyEvent,
            eventCellSelector = `.${this.dayCellCls}`,
            eventCell         = target.closest(eventCellSelector);

        if (eventCell) {
            switch (keyEvent.key) {
                case 'ArrowUp':
                    keyEvent.preventDefault();
                    ElementVisitor.getVisitor(eventContentElement, eventCellSelector).previous(eventCell)?.focus();
                    break;
                case 'ArrowDown':
                    keyEvent.preventDefault();
                    ElementVisitor.getVisitor(eventContentElement, eventCellSelector).next(eventCell)?.focus();
                    break;
                default:
                    return super.onCalendarKeyDown(keyEvent);
            }
        }
        else {
            return super.onCalendarKeyDown(keyEvent);
        }
    }

    initScroll() {
        super.initScroll(...arguments);
        this.scrollable.ion({
            scroll    : 'onAgendaViewScroll',
            scrollEnd : 'onAgendaViewScroll',
            thisObj   : this
        });
    }

    scrollTo(target, options) {
        // EventList cannot natively scroll to an event model, so find the date row for its start date
        if (target.isEventModel) {
            target = this.store.getById(this.findClosestOccupiedDate(this.dayTime.dateKey(target.startDate)));
        }
        return super.scrollTo(target, options);
    }

    onResponsiveStateChange({ state, oldState }) {
        super.onResponsiveStateChange?.(...arguments);

        // Moving between small and non-small state requires a refresh because the cell
        // layout changes and the rows need remeasuring and repositioning.
        if (oldState && (oldState === 'small' || state === 'small')) {
            this.refresh();
        }
    }

    onAgendaViewScroll() {
        // Don't update top date if we are scrolling to a date
        if (!this.scrollingToDate) {
            const { firstVisibleRow } = this;

            firstVisibleRow && (this.topDate = this.getDateFromElement(firstVisibleRow.cells[0]));
        }
    }

    updateAlwaysShowCurrentDate() {
        this.refresh();
    }

    updateShowEmptyDates() {
        this.refresh();
    }

    updateRange(range, was) {
        const
            me             = this,
            { dh }         = me,
            { rowManager } = me;

        if (was && rowManager.rowCount) {
            const
                { dayTime }   = me,
                topRowDate    = dayTime.parseKey(rowManager.topRow.id),
                bottomRowDate = dayTime.parseKey(rowManager.bottomRow.id);

            // If the rendered block does not encapsulate our date, move the
            // date to the top of the view so that the visual scroll position is maintained.
            // All that should visually change is the size and position of the thumb in the scrollbar.
            if (!dh.betweenLesserEqual(me.date, topRowDate, bottomRowDate)) {
                me.scrollToDateOnDateChange = false;

                // This will recurse into setting a new startDate which will
                // cause a refresh which will maintain visual scroll position.
                // So we set the flag which inhibits the scroll to date.
                // The startDate will be recalculated in updateDate but will
                // need to be snapped to the range.
                me._startDate = dh.floor(me._startDate, range, null, me.weekStartDay);
                me.date = me.firstVisibleRow.id;
                me.scrollToDateOnDateChange = true;
                return;
            }
        }
        super.updateRange(...arguments);
    }

    updateTopDate(topDate) {
        /**
         * Fired when the date header stuck at the top of the view changes.
         * @event topDateChange
         * @param {Date} date The date which is at the top of the view
         */
        this.trigger('topDateChange', { date : topDate });
    }

    changeColumns() {
        const result = super.changeColumns(...arguments);

        // Custom columns and AgendaColumns with custom renderer will be autoHeight
        result?.forEach?.(c => {
            c.autoHeight = Boolean(!c.isAgendaColumn || ((c.renderer !== c.defaultRenderer) || this.eventRenderer));
        });
        return result;
    }

    // Override these because CalendarNavigation focuses and navigates *events*, not grid cells.
    onFocusGesture() {}
    onGridElementFocus() {}
    onGridBodyFocusIn() {}
    focusCell() {}
    setHoveredRow() {}
    onElementKeyDown() {}
    onElementMouseDown() {}

    editAutoCreatedEvent(event, eventRecord) {
        // Uniquely, AgendaView has to regenerate its Grid store on event add so that
        // there is an event element to edit by.
        this.populateStoreSoon.now();

        super.editAutoCreatedEvent(event, eventRecord);
    }

    handleEvent(event) {
        const { type } = event;

        super.handleEvent(event);

        // Implement eventMouseover/eventMouseout.
        // All else is handled at the EventList level.
        if (isMouseOverOut[event.type]) {
            this.onEventMouseOverOut(event);
        }
        else if (this.consumeGridPointerEvents !== false && isMouseInteraction[type]) {
            this.onCalendarPointerInteraction(event);
        }
    }

    getCellDataFromEvent(domEvent) {
        if (domEvent.target.closest('.b-grid-cell')) {
            const result = super.getCellDataFromEvent(domEvent);

            result && (result.record = this.getEventRecord(domEvent.target));

            return result;
        }
    }

    getDateFromPosition(x, y) {
        const
            row  = this.rowManager.getRowAt(y),
            cell = row?._cells.normal[0];

        return cell && this.getDateFromElement(cell);
    }

    updateOffsetStartsBeforeEvents(offsetStartsBeforeEvents) {
        this.toggleCls('b-offset-continues-past', offsetStartsBeforeEvents);
    }

    updateEventRowSpacing(eventRowSpacing) {
        this.contentElement.style.setProperty('--bi-event-row-spacing', DomHelper.setLength(eventRowSpacing));
    }

    updateSuppressLongEvents() {
        this.fillFromMaster();
    }

    onCalendarStoreChange({ action, oldCount, records, removed, added }) {
        const me = this;

        if (me.isPainted) {
            // A filter which resulted in no filtering. Ignore it.
            if (action === 'filter' && !removed?.length && !added?.length) {
                return;
            }

            // Draw on project refresh instead of on dataset
            if (action === 'dataset') {
                return;
            }

            // Single record remove just updates the generated records that the event covers
            if (action === 'remove' && records.length === 1 && records[0].isEventModel) {
                const
                    { store }     = me,
                    { dh }        = me,
                    [eventRecord] = records,
                    endDate       = dh.clearTime(eventRecord.endDate);
                let date          = dh.clearTime(eventRecord.startDate);

                do {
                    const
                        key          = dh.makeKey(date),
                        cellData     = me.cellMap.get(key);

                    if (cellData) {
                        ArrayHelper.remove(cellData.events, eventRecord);

                        // Update the row for this date
                        if (cellData.events.length) {
                            me.onStoreUpdateRecord({
                                source  : store,
                                record  : me.store.getById(key),
                                changes : {}
                            });
                        }
                        // No events on this date
                        else {
                            me.cellMap.delete(key);
                            delete me.dateIndex[key];
                            store.remove(key, true);
                        }
                    }

                    date = dh.add(date, 1, 'd');
                } while (date < endDate);

                return;
            }
        }

        me.populateStoreSoon();
    }

    /**
     * Yields a `Map` which contains the cell data for each date in the current view.
     * This is a `Map` where the keys are the date strings in the format
     * `YYYY-MM-DD` and the values are {@link DayCell} objects which contain the data for that cell.
     * @member {Map}
     * @readonly
     */
    get cellMap() {
        const me = this;

        // If the cellMap has not been populated, create it.
        return me._cellMap?.populated ? me._cellMap : me.createCellMap({
            // If we are being set a startDate and endDate, as opposed to using a fixed "range"
            // around a date, then to provide a more intuitive interface, we *include* the endDate
            // for EventLists
            endDate       : me.dateHelper.add(me.endDate, me.range ? 0 : 1, 'd'),
            rawEvents     : true,
            skipPropagate : true
        });
    }

    onMonthChange() {
        super.onMonthChange(...arguments);

        // No cells, and there's a date change with alwaysShowCurrentDate set
        // We must ensure that the store is repopulated with the generated
        // cell for the new date.
        // If the date change is to a date range with data, populateStore will
        // be called immediately which cancels the populateStoreSoon queue.
        if (!this._cellMap?.size && this.alwaysShowCurrentDate) {
            this.populateStoreSoon();
        }
    }

    populateStore() {
        this._cellMap?.clear();

        const
            me                     = this,
            {
                dh,
                store,
                rowManager,
                dateFilter,
                hiddenNonWorkingDays,
                dayTime,
                scrollable,
                initialScrollDone,
                agendaColumn
            }                      = me,
            eventHeight            = isNaN(me.eventHeight) ? 25 : me.eventHeight,
            { firstVisibleRow }    = rowManager,
            firstVisibleId         = firstVisibleRow?.id,
            firstVisibleEdgeOffset = firstVisibleRow ? firstVisibleRow.top - scrollable.y : 0;

        me._eventCount = 0;
        me.populateStoreSoon.cancel();

        // Must be updated early because in MonthAgendaView's Agenda, a single day AgendaView
        // hides its date element which affects calculated row height.
        me.element.dataset.duration = me.duration;

        if (!me.date) {
            // Avoid recursion into populateStore
            me.isConfiguring = true;
            me.date = me.eventStore.map(r => r.startDate).sort((lhs, rhs) => lhs.valueOf() - rhs.valueOf())[0];
            me.isConfiguring = false;
        }

        const
            {
                cellMap,
                firstVisibleDate,
                eventRowSpacing
            }              = me,
            endDate        = dh.add(me.endDate, me.range ? 0 : 1, 'd'),
            cellMapEntries = me.showEmptyDates ? me.createRangeCellMapEntries() : [...cellMap.values()],
            sortedEntries  = [],
            dateIndex      = me.dateIndex = {};

        for (let i = 0, { length } = cellMapEntries; i < length; i++) {
            const
                cellData  = cellMapEntries[i],
                {  date } = cellData;

            // Recurring event continuation blocks which are past a midnight boundary are inserted into
            // the cellMap even if they are beyond the end date. Eliminate these from the view.
            // Honour any configured dateFilter and hiddenNonWorkingDays.
            if (date >= firstVisibleDate && date < endDate && (!dateFilter || me.callback(dateFilter, me, [cellData])) && !hiddenNonWorkingDays[dh.getDay(date)]) {
                // Build Store data array in ascending YYYY-MM-DD order.
                // The ordered insertion is needed because generated occurrences are
                // added to the Map in a second pass, and it will not be in order.
                // Other views iterate their date range and pull cell info using the key.
                // This view is a grid which renders rows in the store's order.
                const
                    cellInfo = store.createRecord(cellData),
                    idx      = ArrayHelper.findInsertionIndex(cellInfo, sortedEntries, compareDate);

                sortedEntries.splice(idx, 0, cellInfo);
                dateIndex[cellInfo.id] = cellInfo;
            }
        }

        // If configured to do so, ensure all dates in range are represented.
        // Honour any configured dateFilter and hiddenNonWorkingDays.
        if (me.showAllDates) {
            // Ensure all dates in range are represented, even if they have no events.
            for (let date = firstVisibleDate; date < endDate; date = dh.add(date, 1, 'd')) {
                if (!dateIndex[dayTime.dateKey(date)]) {
                    const cellData = store.createRecord(me.createCellData(date));

                    if ((!dateFilter || me.callback(dateFilter, me, [cellData])) && !hiddenNonWorkingDays[dh.getDay(date)]) {
                        const idx = ArrayHelper.findInsertionIndex(cellData, sortedEntries, compareDate);

                        sortedEntries.splice(idx, 0, cellData);
                        dateIndex[cellData.id] = cellData;
                    }
                }
            }
        }

        // If configured to do so, ensure there is always a cell for the start date if the range turns out to be empty,
        // so that user has something to interact with. Ensure our dateIndex knows about it.
        if (me.alwaysShowCurrentDate && !(store.isFiltered ? sortedEntries.filter(store.filtersFunction) : sortedEntries).length) {
            const currentDateRec = store.createRecord({
                ...me.createCellData(me.date),
                cls : 'b-current-date-placeholder'
            });
            sortedEntries.push(currentDateRec);
            dateIndex[currentDateRec.id] = currentDateRec;
        }

        store.suspendEvents();
        store.loadData(sortedEntries);
        store.resumeEvents();

        // Our aria-rowcount must reflect the number of rows in the store every time we populate it.
        // We never show a header row, so the rowcount is the store count.
        me.ariaElement.setAttribute('aria-rowcount', store.count);

        // Make sure our eventCount is correct
        me.onAgendaStoreFilter();

        const
            { count }        = store,
            avgEventsPerCell = count ? store.records.map(e => e.events.length).reduce((a, b) => a + b, 0) / count : 0,
            newDate          = me.findClosestOccupiedDate(me.date),
            targetRec        = store.getById(initialScrollDone ? firstVisibleId : dayTime.dateKey(newDate));

        rowManager.clearKnownHeights();

        // Make a best guess for row height based on average events per cell if they have to all be measured.
        if (!agendaColumn || agendaColumn.autoHeight) {
            rowManager._rowHeight = rowManager.minRowHeight = Math.max(avgEventsPerCell * (eventHeight + eventRowSpacing) - eventRowSpacing, 70);
        }
        // If the agenda column is not autoHeight, we can store the height of each row now.
        else {
            // Ensure at least one row is rendered to be measured.
            if (!rowManager.rowCount) {
                rowManager.rowCount = 1;
                rowManager.matchRowCount(true);
            }
            // Primes the column's cached cell measurements, which calculateRowHeight needs (see defaultRenderer)
            rowManager.rows[0].render(0, store.first);

            // Cache all calculated row heights so that the RowManager can calculate total height without measuring.
            store.forEach(record => rowManager.storeKnownHeight(record.id, me.internalGetRowHeight(record) || rowManager.rowHeight));
        }
        rowManager.calculateRowCount(false, false, true);
        rowManager.estimateTotalHeight(true);

        // Tee up rowManager to refresh starting from the calculated top row.
        // The targetIndex is calculated such that the target row is in the middle of the rendered block.
        // It then gets scrolled to the required position.
        if (count) {
            const
                { topRow }  = rowManager,
                targetIndex = Math.max(store.indexOf(targetRec) - Math.round(scrollable.viewport.height / rowManager.rowHeight) - rowManager.prependRowBuffer, 0);

            rowManager.topIndex = topRow.dataIndex = targetIndex;
            topRow.setTop(rowManager.rowHeight * targetIndex);
        }
        rowManager.refresh();

        if (targetRec) {
            const
                recordCoords  = rowManager.getRecordCoords(targetRec, false),
                scrollOptions = initialScrollDone ? {
                    animate    : false,
                    block      : 'start',
                    edgeOffset : firstVisibleEdgeOffset
                } : {
                    animate : false,
                    block   : 'start'
                };

            // Scroll to its calculated position.
            scrollable.y += scrollable.getDeltaTo(recordCoords, scrollOptions).yDelta;
            rowManager.lastScrollTop = scrollable.y;

            // If this is not the initial scroll to our "date", then keep the
            // first row stable.
            me.scrollTo(targetRec, scrollOptions);
            me.initialScrollDone = true;
        }

        me.refreshCount = (me.refreshCount || 0) + 1;

        /**
         * Fires when this AgendaView refreshes.
         * @param {Calendar.widget.AgendaView} source The triggering instance.
         * @event refresh
         */
        me.trigger('refresh');

        // Any owning Calendar's UI may need to sync with the new state
        me.owner?.syncUIWithActiveView?.(me);

        me.columns.forEach(c => c.constructor.exposeProperties?.());

        // Evaluate this late so that it doesn't change the order of date config evaluation.
        me.getConfig('settingsButton');
    }

    get agendaColumn() {
        return this.columns.find(c => c.type === 'agendacolumn');
    }

    // Framework-internal row height resolution, called by the render path (see GridBase#internalGetRowHeight).
    // With the default non-autoHeight agenda column, row heights are calculated from each cell's event count.
    // An app-supplied getRowHeight() takes precedence over the calculation
    internalGetRowHeight(record) {
        const { agendaColumn } = this;

        if (agendaColumn && !agendaColumn.autoHeight) {
            return (this.hasOwnGetRowHeight && this.getRowHeight(record)) || agendaColumn.calculateRowHeight(record);
        }

        return super.internalGetRowHeight(record);
    }

    createRangeCellMapEntries() {
        const
            me      = this,
            {
                dh,
                cellMap,
                startDate,
                endDate
            }       = me,
            entries = [];

        for (let date = new Date(startDate); date < endDate; date = dh.add(date, 1, 'd')) {
            entries.push(cellMap.get(dh.makeKey(date)) || me.createCellData(date));
        }

        return entries;
    }

    // Override.
    // We are empty if the sole record has no events.
    // Because this will be the injected "alwaysShowCurrentDate" record which has no events.
    // No other record can be empty.
    toggleEmptyText() {
        const
            { store } = this,
            count     = store.count === 1 && !store.first?.events.length ? 0 : store.count,
            isEmpty = !(count > 0 || store.isLoading || store.isCommitting);

        this.element.classList.toggle('b-grid-empty', isEmpty);
    }

    scrollRowIntoView(recordOrId) {
        const
            { scrollable, rowManager } = this,
            record                     = this.store.getById(recordOrId);

        // If the row is not rendered, we need to scroll to the correct position.
        // Scroll to an accurate position which will mean the target row is rendered
        // just outside of the visible viewport.
        if (!rowManager.getRowFor(record)) {
            // We can only calculate this accurate position if the AgendaColumn is using its
            // default renderer. The events are rendered in a predictable way in that case.
            const { agendaColumn } = this;

            if (agendaColumn.renderer === agendaColumn.defaultRenderer) {
                const
                    targetRowTop        = this.calculateRowTop(record),
                    { firstVisibleRow } = rowManager;

                scrollable.y = firstVisibleRow && targetRowTop < firstVisibleRow.top
                    ? targetRowTop + rowManager.averageRowHeight
                    : targetRowTop - scrollable.clientHeight;

                rowManager.jumpToPosition(scrollable.y);
            }
        }

        // Now the base class will scroll the target row into view.
        return super.scrollRowIntoView(...arguments);
    }

    /**
     * Calculate the Y position of a row in the view accurately using the known event height
     * and event row spacing and cell padding.
     * @param {Grid.data.GridRowModel} record The record to calculate the top position of.
     * @returns {Number} The Y position of the row.
     * @private
     */
    calculateRowTop(record) {
        let recTop = 0;

        if (this.rowManager.rowCount) {
            const
                me                  = this,
                eventHeight         = isNaN(me.eventHeight) ? 25 : me.eventHeight,
                { eventRowSpacing } = me,
                cell                = me.rowManager.topRow.cells[0],
                cellPadding         = DomHelper.getEdgeSize(cell, 'padding', 'tb').height,
                minRowHeight        = (cell.querySelector('.b-cal-agenda-date')?.offsetHeight || 0) + cellPadding;

            for (let i = 0, { count } = me.store; i < count; i++) {
                const
                    rec       = me.store.getAt(i),
                    recHeight = Math.max(rec.events.length * (eventHeight + eventRowSpacing) - eventRowSpacing + cellPadding, minRowHeight);

                if (rec === record) {
                    break;
                }
                recTop += recHeight;
            }
        }

        return recTop;
    }

    // Overridden from AgendaView which uses its own count value
    get eventCount() {
        return this._eventCount;
    }

    collectEvents(options) {
        // Only the first cell, or !hideEventOverflow needs overflows flowing into it.
        options.getDateIndex = date => Number(date) === Number(this.startDate) || !this.hideEventOverflow ? 'date' : 'startDate';

        return super.collectEvents(options);
    }

    changeStore(store) {
        store = super.changeStore(store);

        if (store) {
            this.nonWorkingDaysFilter = store.addFilter({
                id       : `${this.id}-nonworkingday-filter`,
                filterBy : rec => !rec.isNonWorking,
                disabled : !this.hideNonWorkingDays
            }, true);

            this.detachListeners('agendaStoreFilter');
            store.ion({
                name    : 'agendaStoreFilter',
                filter  : 'onAgendaStoreFilter',
                thisObj : this
            });
            store.reapplyFilterOnAdd = true;
        }

        return store;
    }

    onAgendaStoreFilter() {
        const
            me     = this,
            { dh } = me;

        // Count unique events
        me._eventCount = me.store.reduce((result, rec, i) => {
            const { events, date } = rec;

            for (let j = 0, { length } = events; j < length; j++) {
                const event = events[j];

                if (!me.isInterDayEvent(event) || !i || dh.clearTime(event.startDate).valueOf() === date.valueOf()) {
                    result++;
                }
            }
            return result;
        }, 0);
    }

    updateHideEventOverflow() {
        this.refresh();
    }

    updateHideNonWorkingDays(hideNonWorkingDays) {
        if (!this.isConfiguring) {
            this.nonWorkingDaysFilter.disabled = !hideNonWorkingDays;
        }
        this.refresh();
    }

    // We must implement the CalendarMixin interface.
    // All views must expose a doRefresh method.
    // Override from EventList. We need to repopulate our store to create day cells.
    doRefresh() {
        this.populateStore();
    }

    set cellRenderer(cellRenderer) {
        this._cellRenderer = cellRenderer;
    }

    changeSettingsButton(settings) {
        const
            me = this,
            {
                listRangeMenu : menu
            }  = me;

        // The menu is inside the view, not floating so that keyboard events still go to the view.
        // eg, pressing 'w' to go to the week view.
        if (settings && menu) {
            menu.appendTo = me.element;
            settings = super.changeSettingsButton(me.constructor.mergeConfigs({ menu }, settings));

            // Ensure it is in the widgetMap
            me.addDescendant(settings);

            me.addKeyBinding(settings.actionKey, () => {
                settings.focus();
                settings.element.click();
            });
        }

        return settings;
    }
}

AgendaView.initClass();
