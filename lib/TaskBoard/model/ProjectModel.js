import SchedulerProjectModel from './SchedulerProjectModel.js';
import TaskStore from '../store/TaskStore.js';
import TaskModel from './TaskModel.js';

/**
 * @module TaskBoard/model/ProjectModel
 */

/**
 * This class represents a global project of your TaskBoard - a central place for all data.
 *
 * It holds and links the stores usually used by TaskBoard:
 *
 * - {@link TaskBoard.store.TaskStore}
 * - {@link Scheduler.data.ResourceStore}
 * - {@link Scheduler.data.AssignmentStore}
 *
 * ## Loading remote data
 * ```javascript
 * const taskBoard = new TaskBoard({
 *     project : {
 *         // Project configuration
 *     }
 * });
 * ```
 *
 * ## Working with inline data
 *
 * The project provides an {@link #property-inlineData} getter/setter that can
 * be used to manage data from all Project stores at once. Populating the stores this way can
 * be useful if you do not want to use the CrudManager for server communication but instead load data using Axios
 * or similar.
 *
 * ### Getting data
 * ```javascript
 * const data = taskboard.project.inlineData;
 *
 * // use the data in your application
 * ```
 *
 * ### Setting data
 * ```javascript
 * // Get data from server manually
 * const data = await axios.get('/project?id=12345');
 *
 * // Feed it to the project
 * taskboard.project.inlineData = data;
 * ```
 *
 * See also {@link #function-loadInlineData}
 *
 * ## Getting modifications
 * ```javascript
 * const taskBoard = new TaskBoard({
 *     project : {
 *         // Project configuration
 *     }
 * });
 * ```
 *
 * ## Built-in StateTrackingManager
 *
 * The project also has a built-in {@link Core.data.stm.StateTrackingManager} (STM for short), that
 * handles undo/redo for the project stores (additional stores can also be added). You can enable it to track all
 * project store changes:
 *
 * ```javascript
 * // Turn on auto recording when you create your TaskBoard:
 * const taskBoard = new TaskBoard({
 *     project : {
 *         stm : {
 *             autoRecord : true
 *         }
 *     }
 * });
 *
 * // Undo a transaction
 * project.stm.undo();
 *
 * // Redo
 * project.stm.redo();
 * ```
 *
 * @extends TaskBoard/model/SchedulerProjectModel
 *
 */
export default class ProjectModel extends SchedulerProjectModel {

    static $name = 'ProjectModel';

    static configurable = {
        /**
         * Get/set {@link #property-taskStore} data.
         *
         * Always returns an array of {@link TaskBoard.model.TaskModel} but also accepts an array of
         * its configuration objects as input.
         *
         * @member {TaskBoard.model.TaskModel[]} tasks
         * @accepts {TaskBoard.model.TaskModel[]|TaskModelConfig[]}
         * @category Inline data
         */

        /**
         * The initial data, to fill the {@link #property-taskStore} with. Should be an array of
         * {@link TaskBoard.model.TaskModel} or its configuration objects.
         *
         * @config {TaskBoard.model.TaskModel[]|TaskModelConfig[]} tasks
         * @category Inline data
         */

        /**
         * The initial data, to fill the {@link #property-taskStore} with.
         * Should be an array of {@link TaskBoard.model.TaskModel} instances or its configuration objects.
         *
         * @config {TaskBoard.model.TaskModel[]|TaskModelConfig[]} tasksData
         * @category Legacy inline data
         * @deprecated 6.3.0 Use {@link #config-tasks} instead
         */

        /**
         * The {@link TaskBoard.store.TaskStore store} holding the tasks information.
         *
         * See also {@link TaskBoard.model.TaskModel}
         *
         * @member {TaskBoard.store.TaskStore} taskStore
         * @category Models & Stores
         */

        /**
         * An {@link TaskBoard.store.TaskStore} instance or a config object.
         * @config {TaskStoreConfig|TaskBoard.store.TaskStore} taskStore
         * @category Models & Stores
         */

        /**
         * @hideconfigs timeRanges, timeRangeStore, timeRangesData, timeRangeStoreClass, resourceTimeRanges,
         * resourceTimeRangeStore, resourceTimeRangesData, resourceTimeRangeStoreClass, eventStoreClass, eventModelClass
         */

        /**
         * @hideproperties timeRangeStore, resourceTimeRangeStore, ignoreRemoteChangesInSTM
         */

        eventStoreClass : TaskStore,
        eventModelClass : TaskModel,

        /**
         * The constructor to create a task store instance with.
         * Should be a class, subclassing the {@link TaskBoard.store.TaskStore}.
         * @config {TaskBoard.store.TaskStore}
         * @ts-returns {typeof TaskStore}
         * @category Models & Stores
         */
        taskStoreClass : TaskStore,

        /**
         * The constructor of the task model class, to be used in the project.
         * Will be set as the {@link Core.data.Store#config-modelClass modelClass}
         * property of the {@link #property-taskStore}.
         * @config {TaskBoard.model.TaskModel}
         * @ts-returns {typeof TaskModel}
         * @category Models & Stores
         */
        taskModelClass : TaskModel
    };

    construct(config) {
        if (config.tasks) {
            config.events = config.tasks;
        }

        if (config.tasksData) {
            config.events = config.tasksData;
        }

        if (config.taskStore) {
            config.eventStore = config.taskStore;
        }

        if (config.taskModelClass) {
            config.eventModelClass = config.taskModelClass;
        }

        if (config.taskStoreClass) {
            config.eventStoreClass = config.taskStoreClass;
        }

        super.construct(config);
    }

    // TaskBoard does not require any particular store sections in load responses
    get crudLoadValidationMandatoryStores() {
        return [];
    }

    // TaskBoard does not use dependencies or time ranges - only register the stores it actually uses, so that
    // irrelevant stores are not requested from or synced to the backend (the TaskBoard widget additionally
    // registers its column store)
    registerCrudStores() {
        const me = this;

        me.addPrioritizedStore(me.assignmentStore);
        me.addPrioritizedStore(me.resourceStore);
        me.addPrioritizedStore(me.taskStore);
    }

    get taskStore() {
        return this.eventStore;
    }

    set taskStore(store) {
        this.eventStore = store;
    }

    get tasksData() {
        return this.events;
    }

    set tasksData(data) {
        this.events = data;
    }

    get tasks() {
        return this.events;
    }

    set tasks(data) {
        this.events = data;
    }

    /**
     * Returns the data from the records of the projects stores, in a format that can be consumed by `loadInlineData()`.
     *
     * Used by JSON.stringify to correctly convert this project to json.
     *
     * ```javascript
     * const project = new ProjectModel({
     *     tasks       : [...],
     *     resources   : [...],
     *     assignments : [...]
     * });
     *
     * const json = project.toJSON();
     *
     * // Result:
     * {
     *     tasks : [...],
     *     resources : [...],
     *     assignments : [...]
     * }
     * ```
     *
     * {@note}The `xxData` properties are deprecated and will be removed in the future. Use `xx` instead. For example
     * `tasksData` is deprecated, use `tasks` instead. For now, both naming schemes are included in the data object
     * {/@note}
     *
     * Output can be consumed by `loadInlineData()`:
     *
     * ```javascript
     * const json = project.toJSON();
     *
     * // Plug it back in later
     * project.loadInlineData(json);
     * ```
     *
     * @returns {Object}
     * @category JSON
     */
    toJSON() {
        const
            { taskStore, assignmentStore, resourceStore } = this,
            tasksJSON = taskStore.toJSON(),
            result = {
                tasksData : tasksJSON,
                tasks     : tasksJSON
            };

        if (assignmentStore?.count) {
            result.assignments = result.assignmentsData = assignmentStore.toJSON();
        }

        if (resourceStore?.count) {
            result.resources = result.resourcesData = resourceStore.toJSON();
        }

        return result;
    }
}
