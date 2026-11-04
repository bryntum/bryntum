import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import DomSync from '../../Core/helper/DomSync.js';
import DH from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';

/**
 * @module Calendar/column/AgendaColumn
 */

const MIN_ROW_HEIGHT = 86; // Enough for one event plus date block

/**
 * @typedef {Core.data.Model} AgendaCell
 * An extension of {@link Core.data.Model} which also includes the properties of a
 * {@link Calendar.widget.mixin.DayCellCollecter#typedef-DayCell} since AgendaColumn cells are backed by
 * a data model.
 * @property {CalendarView} view The owning view of the cell.
 * @property {Date} date The date of the cell.
 * @property {String} key a `YYYY-MM-DD` formatted date key for the cell.
 * @property {Number} cellIndex The overall cell index in the cell-based UI being created.
 * @property {Number} day The day of week for the cell: 0=Sunday, 6=Saturday
 * @property {Number} columnIndex The column index in the cell-based UI being created.
 * @property {Number} visibleColumnIndex The visible column index (eg 0 for a Monday if Sunday is the week start day,
 *   but was hidden)
 * @property {Boolean} isNonWorking `true` if the owning view considers the date a non-working day.
 * @property {Number[]} week The `[year, week]` encapsulating the cell.
 * @property {Boolean} isOtherMonth The cell is outside the view's primary time range. Only significant
 *   when used by a CalendarPanel which encapsulates a single month.
 * @property {Boolean} visible `true` if the date cell is not for a hidden day.
 * @property {Date} tomorrow The date of the following cell.
 * @property {Boolean} isRowStart `true` if the cell is at the start of a visible row.
 * @property {Boolean} isRowEnd `true` if the cell is at the end of a visible row.
 * @property {Boolean} hasOverflow `true` if the `renderedEvents` overflow the cell height and
 *   require a `+n more` button.
 * @property {Scheduler.model.EventModel[]} events The events which are to be shown for this date.
 * @property {Scheduler.model.ResourceModel} resource __Note__ this only exists when the cell is
 *   owned by a subview of a {@link Calendar.widget.ResourceView}, or while creating resource columns
 *   in a {@link Calendar.widget.DayResourceView}.
 * @property {EventBar[]} renderedEvents If this view renders event bars ({@link Calendar.widget.MonthView},
 *   {@link Calendar.widget.CalendarRow}), then this is an array of
 *   {@link EventBar event bar} definitions which belong in the cell. Whether all can be rendered depends
 *   upon the view's configured {@link Calendar.widget.mixin.CalendarMixin#config-eventHeight} and whether
 *   the cell is of fixed height. The `hasOverflow` property is set if the rendered events overflow
 *   a cell's fixed capacity.
 * @property {Scheduler.model.EventModel[]} resourceDayEvents The events for the passed resource for the day (applies in a `DayResourceCalendarRow`)
 *   column

 */

/**
 * A column that displays events for a day.
 *
 * This is not intended to be used directly, it is used by the {@link Calendar.widget.AgendaView} which
 * is a specialized {@link Grid.view.Grid} subclass.
 *
 * It can be configured through the AgendaView's `columns` config:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     modes : {
 *         agenda : {
 *             columns : {
 *                 agenda : {
 *                     renderer({ cellElement, record : cellData }) {
 *                         // Custom cell rendering
 *                         cellElement.classList.toggle('is-weekend', cellData.day === 0 || cellData.day === 6);
 *                         return this.defaultRenderer(...arguments);
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Calendar.widget.AgendaView} — The view that uses this column
 * - {@link Calendar.widget.mixin.DayCellCollecter} — Mixin providing the cell data rendered here
 *
 * @extends Grid/column/Column
 *
 * @classtype agendacolumn
 * @column
 */
export default class AgendaColumn extends Column {

    //region Config

    static $name = 'AgendaColumn';

    static type = 'agendacolumn';

    static get defaults() {
        return {
            id         : 'agenda', // no-sanity
            text       : 'Agenda',
            filterable : false,
            sortable   : false,
            editor     : false,
            searchable : false,

            // With its defaultRenderer, and no eventRenderer, AgendaColumn measures
            // once then is able to calculate row heights from the cell's event count.
            // This field is automatically set to `true` if a column renderer or eventRenderer
            // is found.
            autoHeight      : false,
            alwaysClearCell : false
        };
    }

    //endregion

    construct() {
        super.construct(...arguments);
        this.grid.ion({
            beforeResponsiveStateChange : 'onBeforeGridResponsiveStateChange',
            cellMapPopulated            : 'onGridCellMapPopulated',
            thisObj                     : this
        });
    }

    //region Render

    /**
     * Renderer that shows a list of events for a single date.
     *
     * Note that all {@link Calendar.widget.AgendaView} columns are automatically set to
     * {@link Grid.column.Column#config-autoHeight} because an unpredictable number of events may appear in
     * any cell.
     *
     * @param {Object} renderData Object containing renderer parameters
     * @param {HTMLElement} renderData.cellElement Cell element, for adding CSS classes, styling etc. Can be `null` in case of export
     * @param {*} renderData.value Value to be displayed in the cell
     * @param {AgendaCell} renderData.record A {@link #typedef-AgendaCell} context object
     *   which contains contextual information about the date being rendered and an `events` property encapsulating
     *   all the events which coincide with the date.
     * @param {Grid.column.Column} renderData.column This column
     * @param {Grid.view.Grid} renderData.grid This grid
     * @param {Grid.row.Row} renderData.row Row object. Can be null in case of export. Use the
     *   {@link Grid.row.Row#function-assignCls row's API} to manipulate CSS class names.
     * @param {Boolean} renderData.isExport `true` if the record is being exported to Excel or a textual format, enabling special handling during export.
     * @param {Boolean} renderData.isMeasuring True if the column is being measured for a `resizeToFitContent` call.
     *   In which case an advanced renderer might need to take different actions.
     * @returns {DomConfig|String|null}
     */
    defaultRenderer({ cellElement : targetElement, row, record, grid }) {
        const
            me                 = this,
            {
                events,
                date
            }                  = record,
            { previousEvents } = record.data,
            children           = [];

        me.fwComponent = me.fwComponent || me.owner.up((cmp => Boolean(cmp.processEventContent)) || {});

        for (let i = 0; i < events.length; i++) {
            const
                eventRecord = events[i],
                eventEndDate = eventRecord.endDate || DH.add(eventRecord.startDate, eventRecord.duration, eventRecord.durationUnit),
                isOverflow = eventRecord.startDate < date,
                overflows = eventEndDate > record.tomorrow,
                eventDomConfig = grid.createEventDomConfig({
                    date     : record.date,
                    isAllDay : eventRecord.allDay || overflows || isOverflow,
                    eventRecord
                });

            // Arrow shows that it continues
            eventDomConfig.className['b-continues-future'] = overflows;
            eventDomConfig.className['b-continues-past'] = isOverflow;

            children.push({
                className : {
                    'b-cal-agenda-event-row' : 1
                },
                dataset : {
                    rowId : eventRecord.id
                },
                children : [
                    grid.callback('eventListEventTimeRenderer', grid, [eventRecord, date]),
                    eventDomConfig
                ],

                // Match existing data-rowId elements first and ensure DOM order matches
                // children order.
                syncOptions : {
                    syncIdField      : 'rowId',
                    releaseThreshold : 0,
                    strict           : true
                }
            });
        }

        row.toggleCls('b-new-month', !previousEvents || previousEvents.date.getMonth() !== date.getMonth());
        grid._cellRenderer?.(...arguments);

        // cellRenderer may update the cellData record, so test after.
        targetElement.classList.toggle(grid.nonWorkingDayCls, Boolean(record.isNonWorking));

        DomSync.sync({
            domConfig : {
                onlyChildren : true,
                children     : [
                    grid.callback('agendaEventDateRenderer', grid, [date]),
                    {
                        className : {
                            'b-cal-event-bar-container' : 1
                        },
                        children
                    }
                ],

                // Match existing data-row-id elements first and ensure DOM order matches
                // children order.
                syncOptions : {
                    syncIdField      : 'date',
                    releaseThreshold : 0,
                    strict           : true
                }
            },
            targetElement,
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
        targetElement.setAttribute('aria-label', `${DH.format(date, 'dddd MMMM Do, YYYY')}, ${grid.L('eventCount', events.length)}`);
        targetElement.setAttribute('tabIndex', -1);
        targetElement.dataset.date = record.id;

        if (!me.autoHeight) {
            const dateBlock = targetElement.querySelector('.b-cal-agenda-date');

            // Ensure heights of known autoHeight elements are calculated only once. Row heights are then
            // calculated from these in AgendaView#internalGetRowHeight, without needing rendered cells
            me._cellTbPadding    = me._cellTbPadding    ?? DomHelper.getEdgeSize(targetElement, 'padding', 'tb').height;
            me._containerPadding = me._containerPadding ?? DomHelper.getEdgeSize(targetElement.querySelector('.b-cal-event-bar-container'), 'margin', 'tb').height;
            me._dateBlockHeight  = me._dateBlockHeight  ?? Rectangle.outer(dateBlock).height;
        }
    }

    calculateRowHeight(record) {
        const
            me       = this,
            { grid } = me;

        // Calculating requires element measurements, cached when the first cell renders (see defaultRenderer).
        // Until then, callers fall back to the configured rowHeight (the measurement-priming render itself,
        // see AgendaView#populateStore)
        if (me._cellTbPadding == null || me._containerPadding == null ||
            (grid.responsiveState === 'small' && me._dateBlockHeight == null)) {
            return null;
        }

        return Math.max(record.events.length * (grid.eventHeightInPixels + grid.eventRowSpacing) - grid.eventRowSpacing +  me._cellTbPadding + me._containerPadding + (grid.responsiveState === 'small' ? me._dateBlockHeight : 0), MIN_ROW_HEIGHT);
    }

    onBeforeGridResponsiveStateChange() {
        // Invalidate cached measurements
        this._cellTbPadding = this._containerPadding = this._dateBlockHeight = this._dateBlockHeight = null;
    }

    onGridCellMapPopulated() {
        // The agenda cell's date block may be hidden and shown when used in a MonthAgenda, so we need
        // to invalidate the cached measurement of the date block height before a refresh.
        this._dateBlockHeight = null;
    }

    getCellClass(cellContext) {
        const result = super.getCellClass(cellContext);
        result[`b-day-of-week-${cellContext.record.day}`] = 1;
        return result;
    }

    //endregion

    //region Other

    headerRenderer({ headerElement : targetElement }) {
        targetElement.innerHTML = '';

        DomSync.sync({
            domConfig : {
                className : {
                    'b-cal-agenda-header' : 1,
                    'b-grid-header'       : 1,
                    'b-last-leaf'         : 1
                },
                children : [{
                    className : {
                        'b-cal-agenda-header-date' : 1
                    },
                    text : 'Date'
                }, {
                    className : {
                        'b-cal-agenda-header-time' : 1
                    },
                    text : 'Time'
                }, {
                    className : {
                        'b-cal-agenda-header-event' : 1
                    },
                    text : 'Event'
                }]
            },
            targetElement
        });
    }
    //endregion
}

ColumnStore.registerColumnType(AgendaColumn);
