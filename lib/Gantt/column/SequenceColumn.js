import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * @module Gantt/column/SequenceColumn
 */

/**
 * A "calculated" column which displays the sequential position of the task in the project.
 *
 * There is no `editor`, since value is read-only.
 *
 * See {@link Gantt.model.TaskModel#property-sequenceNumber} for details.
 *
 * @extends Grid/column/Column
 * @classtype sequence
 * @column
 * @tier community
 */
export default class SequenceColumn extends Column {

    static $name = 'SequenceColumn';
    static type = 'sequence';
    static isGanttColumn = true;

    static defaults = {
        field      : 'sequenceNumber',
        text       : 'L{Sequence}',
        ariaLabel  : 'L{Sequence}',
        sortable   : false,
        groupable  : false,
        filterable : false,
        width      : 70,
        align      : 'end',
        editor     : null
    };
}

ColumnStore.registerColumnType(SequenceColumn);
