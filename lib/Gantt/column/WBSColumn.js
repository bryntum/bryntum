import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * @module Gantt/column/WBSColumn
 */

/**
 * A calculated column which displays the _WBS_ (_Work Breakdown Structure_) for the tasks - the position of the task
 * in the project tree structure.
 *
 * While there is no `editor`, since the WBS is a calculated value, there is a `renumber` item in the `headerMenuItems`
 * that allows the user to {@link Gantt.model.TaskModel#function-refreshWbs refresh} the WBS values.
 *
 * @extends Grid/column/Column
 * @classtype wbs
 * @column
 * @tier community
 */
export default class WBSColumn extends Column {

    static $name = 'WBSColumn';
    static type =  'wbs';
    static isGanttColumn = true;

    static defaults = {
        field  : 'wbsValue',
        text   : 'L{WBS}',
        width  : 70,
        editor : null,

        filterable({ value, record }) {
            // value might be WBS instance
            return record.wbsValue.match(String(value));
        },

        headerMenuItems : {
            renumber : {
                text : 'L{WBSColumn.renumber}',
                icon : 'b-icon-renumber',

                onItem({ source }) {
                    source.taskStore.rootNode.refreshWbs();
                }
            }
        }
    };

    // This renderer is required to force string WBS value for TableExporter
    defaultRenderer({ value }) {
        return value && String(value);
    }
}

ColumnStore.registerColumnType(WBSColumn);
