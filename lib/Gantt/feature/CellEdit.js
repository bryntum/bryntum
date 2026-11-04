import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import SchedulerCellEdit from '../../Scheduler/feature/CellEdit.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import GanttFeature from './GanttFeature.js';

/**
 * @module Gantt/feature/CellEdit
 */

const tabEaterSpec = {
    element : document,
    capture : true,
    keydown : e => e.key === 'Tab' && (e.preventDefault(), e.stopImmediatePropagation())
};

/**
 * Extends the {@link Grid.feature.CellEdit} to encapsulate Gantt functionality. This feature is enabled by
 * <b>default</b>
 *
 * {@inlineexample Gantt/feature/CellEdit.js}
 *
 * Editing can be started by a user by double-clicking an editable cell in the gantt's data grid, or it can be started
 * programmatically by calling {@link Grid/feature/CellEdit#function-startEditing} and providing it with correct cell
 * context.
 *
 * See {@link #function-doAddNewAtEnd}.
 *
 * ## Instant update
 * If {@link Grid.column.Column#config-instantUpdate} on the column is set to `true`, record will be
 * updated instantly as value in the editor is changed. In combination with
 * {@link Gantt.model.ProjectModel#config-autoSync} it could result in excessive requests to the backend.
 *
 * Instant update is enabled for these columns by default:
 * - {@link Scheduler.column.DurationColumn}
 * - {@link Gantt.column.StartDateColumn}
 * - {@link Gantt.column.EndDateColumn}
 * - {@link Gantt.column.ConstraintDateColumn}
 * - {@link Gantt.column.DeadlineDateColumn}
 * - {@link Gantt.column.EarlyStartDateColumn}
 * - {@link Gantt.column.EarlyEndDateColumn}
 * - {@link Gantt.column.LateStartDateColumn}
 * - {@link Gantt.column.LateEndDateColumn}
 *
 * To disable instant update on the column set config to false:
 *
 * ```javascript
 * new Gantt({
 *     columns: [
 *         {
 *             type: 'startdate',
 *             instantUpdate: false
 *         }
 *     ]
 * })
 * ```
 *
 * This feature is **enabled** by default.
 *
 * @extends Scheduler/feature/CellEdit
 *
 * @classtype cellEdit
 * @feature
 * @tier community
 *
 * @class-alias Scheduler.feature.CellEdit -> Scheduler.feature.SchedulerCellEdit
 */
export default class CellEdit extends SchedulerCellEdit {

    // NOTE: Even though the class name matches the one defined on the base class
    // we need this method in order registerFeature() to work properly
    // (it uses hasOwnProperty when detecting the class name)
    static $name = 'CellEdit';

    // Registers with the Gantt factory under the inherited type, see GridFeature#featureFactory
    static featureFactory = GanttFeature;

    static tier = 'community';

    // Default configuration
    static configurable = {
        addNewAtEnd : {
            duration : 1
        }
    };

    static get pluginConfig() {
        const cfg = super.pluginConfig;

        cfg.after = [...cfg.after, 'onProjectChange'];

        return cfg;
    }

    onProjectChange() {
        // Cancel editing if project is changed
        this.cancelEditing(true);
    }

    // Provide any editor with access to the current project
    getEditorForCell({ record }) {
        const
            editor         = super.getEditorForCell(...arguments),
            { inputField } = editor;

        inputField.project     = record.project;
        inputField.eventRecord = record;

        // unified API of data loading between the task editing / cell editing
        inputField.loadEvent?.(record, false);

        return editor;
    }

    /**
     * Adds a new, empty record at the end of the TaskStore with the initial
     * data specified by the {@link Grid.feature.CellEdit#config-addNewAtEnd} setting.
     *
     * @on-queue
     * @returns {Promise} Newly added record wrapped in a promise.
     */
    async doAddNewAtEnd() {
        const
            me                                  = this,
            gantt                               = me.grid,
            { addNewAtEnd, addToCurrentParent } = me,
            { project }                         = gantt,
            tabEater                            = EventHelper.on({ ...tabEaterSpec, thisObj : me });

        // First finish any ongoing calculations. Promise executor will run in the following microtask, so project
        // can get destroyed.
        await (!project.isDestroying && project.commitAsync());

        // Block adding after destruction (async above) or if using a "display store"
        if (gantt.isDestroyed || gantt.store !== gantt.taskStore) {
            tabEater();
            return null;
        }

        async function addTask() {
            const data = ObjectHelper.assign({
                name      : me.L('L{Gantt.New task}'),
                startDate : project.startDate
            }, addNewAtEnd);

            let newTask;
            if (addToCurrentParent) {
                // doAddNewAtEnd is wrapped into a transaction in Scheduler. We cannot call any methods
                // that use queue, or we will get a deadlock.
                newTask = gantt.addTask(gantt.taskStore.last, { data });
            }
            else {
                let defaultData = gantt.newTaskDefaults;

                if (typeof defaultData == 'function') {
                    defaultData = defaultData(gantt.taskStore.last);
                }

                newTask = gantt.taskStore.rootNode.appendChild(ObjectHelper.assign(data, defaultData));
            }

            await project.commitAsync();

            return newTask;
        }

        const newTask = me.stopFeatureTransactionOnCellEditFinish
            ? await project.queue(addTask)
            : await addTask();

        if (gantt.isDestroyed) {
            tabEater();
            return null;
        }

        // Now ensure we can see the new row
        await gantt.scrollRowIntoView(newTask, { animate : false, block : 'nearest' });

        if (gantt.isDestroyed) {
            tabEater();
            return null;
        }

        // Resume allowing tabbing in a short while when the DOM is in a state to accept focus
        me.setTimeout(tabEater, 100);

        return newTask;
    }

    onCellEditStart() {
        this.client.project.suspendAutoSync();
    }

    async afterCellEdit() {
        await this.client.project.resumeAutoSync();
    }
}

CellEdit.initClass();
