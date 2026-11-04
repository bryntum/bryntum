import TreeColumn from '../../Grid/column/TreeColumn.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * @module Gantt/column/NameColumn
 */

/**
 * A tree column showing (and allowing user to edit) the task's {@link Gantt.model.TaskModel#field-name name} field.
 *
 * Default editor is a {@link Core.widget.TextField}.
 *
 * @extends Grid/column/TreeColumn
 * @classtype name
 * @column
 * @tier community
 */
export default class NameColumn extends TreeColumn {

    static $name = 'NameColumn';
    static type = 'name';
    static isGanttColumn = true;

    //region Config

    static defaults = {
        width : 240,
        field : 'name',
        text  : 'L{Name}'
    };

    static fields = [
        /**
         * Set to `true` to render the WBS code before the task name
         * @prp {Boolean} showWbs
         */
        { name : 'showWbs' }
    ];

    defaultRenderer({ record, value }) {
        if (this.showWbs) {
            return `${record.wbsCode} ${value ?? ''}`;
        }

        return value;
    }
    //endregion
}

ColumnStore.registerColumnType(NameColumn);
