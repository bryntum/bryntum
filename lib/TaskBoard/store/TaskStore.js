import EventStore from './EventStore.js';
import TaskModel from '../model/TaskModel.js';

/**
 * @module TaskBoard/store/TaskStore
 */

/**
 * Store that holds the tasks of a TaskBoard. By default configured to use {@link TaskBoard.model.TaskModel} for its
 * records.
 *
 * Loaded and handled as a part of a {@link TaskBoard.model.ProjectModel project}. For example using inline data:
 *
 * ```javascript
 * const taskBoard = new TaskBoard({
 *     project : {
 *         // Data to load into the TaskStore
 *         tasks : [
 *             { id : 1, name : 'Some task', status : 'todo', prio : 'low' }
 *         ]
 *     }
 * }
 * ```
 *
 * When loaded using the {@link Scheduler.data.mixin.ProjectCrudManager CrudManager} functionality of the project, it
 * is populated from the `'tasks'` property in the
 * response:
 *
 * ```javascript
 * const taskBoard = new TaskBoard({
 *     project : {
 *         transport : {
 *             load : {
 *                 url : 'load.php'
 *             }
 *         },
 *
 *         autoLoad : true
 *     }
 * }
 * ```
 *
 * Expected response format to populate the TaskStore:
 *
 * ```json
 * {
 *     "success"     : true,
 *     "tasks"       : {
 *         "rows" : [
 *             {
 *                 "id"     : 1,
 *                 "name"   : "Important task",
 *                 "status" : "todo",
 *                 "prio"   : "high"
 *             },
 *             ...
 *         ]
 *     }
 * }
 * ```
 *
 * {@note}Filters applied to the master TaskStore are not by default applied to the column stores
 * (chained stores created for each column). To propagate filters from master store to the column stores, configure
 * the TaskBoard with `chainFilters : true`. See {@link TaskBoard/view/TaskBoard#config-chainFilters}
 * for more details.{/@note}
 *
 * @extends TaskBoard/store/EventStore
 */
export default class TaskStore extends EventStore {
    static $name = 'TaskStore';

    static configurable = {

        /**
         * @hideconfigs lazyLoad
         */
        /**
         * @hideproperties lazyLoad
         */
        /**
         * @hideevents lazyLoadStarted, lazyLoadEnded
         */
        /**
         * @hidefunctions requestData
         */

        autoAssignWeight : true,

        id : 'tasks', // no-sanity

        /**
         * Class used to represent records, defaults to {@link TaskBoard.model.TaskModel}
         * @config {TaskBoard.model.TaskModel}
         * @ts-returns {typeof TaskModel}
         * @category Common
         */
        modelClass : TaskModel,

        /**
         * Configure with `true` to also remove the event when removing the last assignment from the linked
         * AssignmentStore.
         *
         * Defaults to `false` for TaskBoard since it is unexpected that a tasks disappears when unassigning the last
         * resource from it.
         *
         * @config {Boolean}
         * @default
         * @category Common
         */
        removeUnassignedEvent : false,

        /**
         * Initial sorters, format is `[{ field: 'name', ascending: false }, ...]`.
         *
         * By default the TaskStore is sorted by `weight`, tasks with higher weights are displayed further down.
         * When `useSparseIndex` is enabled, `weight` is not used, but `sparseIndex` takes precedence.
         *
         * @config {Sorter[]|String[]}
         * @category Common
         */
        sorters : [
            { field : 'weight', ascending : true }
        ]
    };

    updateUseSparseIndex(useSparseIndex) {
        if (useSparseIndex) {
            this.autoAssignWeight = false;
        }
    }

    // When the sparse index feature is enabled, force the master task store to be always sorted by `sparseIndex`, to
    // ensure consistent calculation of values on re-ordering or adding tasks. Chained column stores can be sorted
    // according to feature configuration.
    changeSorters(sorters) {
        return this.useSparseIndex && !this.isChained
            ? [{ field : 'sparseIndex', ascending : true }]
            : sorters;
    }

    afterLoadData() {
        const { records } = this;

        if (this.autoAssignWeight && !records.some(r => r.weight != null)) {
            for (let i = 0; i < records.length; i++) {
                records[i].setData('weight', (i + 1) * 100);
            }
        }
    }

    get filtersFunction() {
        const fn = super.filtersFunction;

        if (!this.reapplyFilterOnAdd) {
            return record => record.isPhantom || fn(record);
        }

        return fn;
    }

    set filtersFunction(fn) {
        super.filtersFunction = fn;
    }
}
