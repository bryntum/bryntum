import CheckColumn from '../../Grid/column/CheckColumn.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * @module Gantt/column/MilestoneColumn
 */

/**
 * A Column that indicates whether a task is a milestone. This column uses a {@link Core.widget.Checkbox checkbox} as
 * its editor.
 *
 * @extends Grid/column/CheckColumn
 * @classtype milestone
 * @column
 * @tier community
 */
export default class MilestoneColumn extends CheckColumn {
    static suppressNoModelFieldWarning = true;
    static $name = 'MilestoneColumn';

    static type = 'milestone';

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field : 'milestone',
            text  : 'L{Milestone}'
        };
    }
}

ColumnStore.registerColumnType(MilestoneColumn);
