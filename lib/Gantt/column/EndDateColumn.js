import ColumnStore from '../../Grid/data/ColumnStore.js';
import GanttDateColumn from './GanttDateColumn.js';
import '../../Scheduler/widget/EndDateField.js';

/**
 * @module Gantt/column/EndDateColumn
 */

/**
 * A column that displays (and allows user to update) the task's {@link Gantt.model.TaskModel#field-endDate end date}.
 *
 * Default editor is a {@link Scheduler.widget.EndDateField}.
 *
 * If {@link #config-format} is omitted, Gantt's {@link Scheduler.view.mixin.TimelineViewPresets#config-displayDateFormat} will be used as a default value and
 * the format will be dynamically updated while zooming according to the {@link Scheduler.preset.ViewPreset#field-displayDateFormat} value specified for the ViewPreset being selected.
 *
 * @extends Gantt/column/GanttDateColumn
 * @classtype enddate
 * @column
 * @tier community
 */
export default class EndDateColumn extends GanttDateColumn {

    static $name = 'EndDateColumn';

    static type = 'enddate';

    static get defaults() {
        return {
            field : 'endDate',
            text  : 'L{Finish}'
        };
    }

    get defaultEditor() {
        const editorCfg = super.defaultEditor;

        editorCfg.type = 'enddate';

        return editorCfg;
    }
}

ColumnStore.registerColumnType(EndDateColumn);
