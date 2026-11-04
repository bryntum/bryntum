import SchedulerTimeAxisColumn from '../../Scheduler/column/TimeAxisColumn.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * @module Gantt/column/TimeAxisColumn
 */

/**
 * A column containing the timeline "viewport", in which tasks, dependencies etc. are drawn.
 * Normally you do not need to interact with or create this column, it is handled by Gantt.
 *
 * ## Styling
 *
 * You can style a timeaxis cell by using the {@link Gantt.column.TimeAxisColumn#config-afterRenderCell} method.
 *
 * ```javascript
 * const gantt = new Gantt({
 *    appendTo : document.body,
 *    columns : [
 *        {
 *            type : 'timeAxis',
 *            afterRenderCell({ cellElement, record }) {
 *                cellElement.style.background = 'rgba(255,200,0,0.15)';
 *            }
 *        }
 *    ]
 * });
 * ```
 * {@inlineexample Gantt/column/TimeAxisColumn.js}
 *
 * @extends Scheduler/column/TimeAxisColumn
 * @column
 * @tier community
 * @classtype timeAxis
 *
 * @class-alias Scheduler.column.TimeAxisColumn -> Scheduler.column.SchedulerTimeAxisColumn
 */
export default class TimeAxisColumn extends SchedulerTimeAxisColumn {
    static $name = 'TimeAxisColumn';

    static get defaults() {
        return {
            /**
             * Set to `false` to disable the {@link Gantt.feature.TaskMenu} for the cell elements in this column.
             * @prp {Boolean} enableCellContextMenu
             * @default
             * @category Menu
             */
            enableCellContextMenu : true
        };
    }
}

ColumnStore.registerColumnType(TimeAxisColumn);
