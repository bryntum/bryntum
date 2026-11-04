import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import DomSync from '../../Core/helper/DomSync.js';

/**
 * @module Calendar/column/EventColumn
 */

/**
 * A column that displays a formatted event with details of name, times, and assigned resources in a
 * grid cell.
 *
 * This is not intended to be used directly, it is used by the {@link Calendar.widget.EventList} which
 * is a specialized {@link Grid.view.Grid} subclass.
 *
 * It can be configured through the EventList's `columns` config:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     modes : {
 *         list : {
 *             columns : {
 *                 calendarevents : {
 *                     renderer({ cellElement, record : cellData }) {
 *                         // Custom rendering for event list cells
 *                         cellElement.classList.toggle('is-past', cellData.date < new Date());
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
 * - {@link Calendar.widget.EventList} — The view that uses this column
 * - {@link Scheduler.model.EventModel} — The event model whose data is displayed
 *
 * @extends Grid/column/Column
 *
 * @classtype calendarevents
 * @column
 */
export default class EventColumn extends Column {

    //region Config

    static $name = 'EventColumn';

    static type = 'calendarevents';

    static get defaults() {
        return {
            id              : 'calendarevents', // no-sanity
            text            : 'Event Details',
            filterable      : false,
            sortable        : false,
            editor          : false,
            searchable      : false,
            autoHeight      : true,
            alwaysClearCell : false
        };
    }

    //endregion

    //region Render

    /**
     * Renderer that shows resource avatars of assigned resources next to event names for a single date.
     *
     * <div class="warning">
     * You should never modify any records inside this method.
     * </div>
     * Note that all {@link Calendar.widget.AgendaView} columns are automatically set to
     * {@link Grid.column.Column#config-autoHeight} because an unpredictable number of events may appear in
     * any cell.
     *
     * @prp {Function} renderer
     * @param {Object} renderData Object containing renderer parameters
     * @param {HTMLElement} renderData.cellElement Cell element, for adding CSS classes, styling etc. Can be `null` in case of export
     * @param {*} renderData.value Value to be displayed in the cell
     * @param {Scheduler.model.EventModel} renderData.record The event record being rendered.
     * @ts-param renderData.record {Model|EventModel}
     * @param {Grid.column.Column} renderData.column This column
     * @param {Grid.view.Grid} renderData.grid This grid
     * @param {Grid.row.Row} renderData.row Row object. Can be null in case of export. Use the
     *   {@link Grid.row.Row#function-assignCls row's API} to manipulate CSS class names.
     * @param {Boolean} renderData.isExport `true` if the record is being exported to Excel or a textual format, enabling special handling during export.
     * @param {Boolean} renderData.isMeasuring True if the column is being measured for a `resizeToFitContent` call.
     *   In which case an advanced renderer might need to take different actions.
     * @returns {DomConfig|String|null}
     */
    renderer({ cellElement : targetElement, record, grid }) {
        const
            resourceFilter = grid.calendar?.widgetMap.resourceFilter,
            resources      = resourceFilter ? record.resources.filter(r => resourceFilter.selected.includes(r)) : record.resources;

        grid._cellRenderer?.(...arguments);

        grid.showResourceAvatars = true;

        DomSync.sync({
            domConfig : {
                onlyChildren : true,
                children     : [
                    {
                        class    : 'b-cal-event-resource-avatars',
                        children : resources.map(resource => {
                            return {
                                class    : 'b-cal-event-resource-avatar-row',
                                children : [
                                    grid.getResourceAvatar(resource),
                                    {
                                        class    : 'b-cal-event-resource-avatar-desc',
                                        children : [{
                                            class : 'b-event-column-resource-name',
                                            text  : resource.name
                                        }, {
                                            class : 'b-event-column-resource-role',
                                            text  : resource.role
                                        }]
                                    }
                                ]
                            };
                        })
                    },
                    {
                        class    : 'b-cal-event-column-event-desc',
                        children : [{
                            class : 'b-cal-event-column-event-name',
                            text  : record.name
                        }]
                    },
                    {
                        class    : 'b-cal-event-column-times',
                        children : [grid.eventListEventTimeRenderer(record)]
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
            targetElement
        });
    }

    //endregion
}

ColumnStore.registerColumnType(EventColumn);
EventColumn.exposeProperties();
