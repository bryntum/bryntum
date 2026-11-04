import { GanttCoreProjectMixin } from '../../Engine/quark/model/gantt_core/GanttCoreProjectMixin.js';
import ProjectModelMixin from '../../Scheduler/model/mixin/ProjectModelMixin.js';
import ProjectCurrentConfig from '../../Scheduler/model/mixin/ProjectCurrentConfig.js';
import ProjectCrudManager from '../../Scheduler/data/mixin/ProjectCrudManager.js';

import AssignmentStoreCommunity      from '../data/AssignmentStoreCommunity.js';
import CalendarManagerStoreCommunity from '../data/CalendarManagerStoreCommunity.js';
import DependencyStoreCommunity      from '../data/DependencyStoreCommunity.js';
import ResourceStoreCommunity        from '../data/ResourceStoreCommunity.js';
import TaskStoreCommunity            from '../data/TaskStoreCommunity.js';

import AssignmentModelCommunity      from './AssignmentModelCommunity.js';
import CalendarModelCommunity        from './CalendarModelCommunity.js';
import DependencyModelCommunity      from './DependencyModelCommunity.js';
import ResourceModelCommunity        from './ResourceModelCommunity.js';
import TaskModelCommunity            from './TaskModelCommunity.js';

const EngineMixin = GanttCoreProjectMixin;

/**
 * @module Gantt/model/ProjectModelCommunity
 */

/**
 * Community-tier ProjectModel.
 *
 * The full documentation lives on {@link Gantt.model.ProjectModel}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @extends Core/data/Model
 * @mixes Scheduler/data/mixin/ProjectCrudManager
 * @mixes Scheduler/model/mixin/ProjectModelCommon
 * @mixes Scheduler/model/mixin/ProjectModelTimeZoneMixin
 * @tier community
 * @class-alias Scheduler.model.ProjectModelCommunity -> Scheduler.model.SchedulerProjectModelCommunity
 */
export default class ProjectModelCommunity extends EngineMixin.mixin(ProjectCrudManager, ProjectCurrentConfig, ProjectModelMixin) {
    static $name = 'ProjectModelCommunity';

    // ProjectConsumer consumes the requested tier, so the resolved class has to report it
    tier = 'community';

    // Should pass as a ProjectModel when asked by code
    isProjectModel = true;

    //region Fields

    /**
     * Start date of the project in the ISO 8601 format.
     *
     * If this date is not provided, it will be calculated as the earliest date among all tasks.
     *
     * Note that the field always returns a `Date`.
     *
     * @field {Date} startDate
     * @accepts {String|Date}
     */

    /**
     * End date of the project in the ISO 8601 format.
     * The value is calculated as the latest date among all tasks.
     *
     * Note that the field always returns a `Date`.
     *
     * @field {Date} endDate
     * @accepts {String|Date}
     */

    /**
     * The project calendar, a record of the `calendarManagerStore` or its id.
     *
     * @config {String|Gantt.model.CalendarModel} calendar
     */

    /**
     * The project calendar. Falls back to a default calendar if none is set.
     *
     * @member {Gantt.model.CalendarModel} calendar
     * @accepts {String|Gantt.model.CalendarModel}
     */

    //endregion

    //region Inline data configs & properties

    /**
     * Get/set `taskStore` data.
     *
     * Always returns an array of {@link Gantt.model.TaskModel} but also accepts an array of
     * its configuration objects as input.
     *
     * @member {Gantt.model.TaskModel[]} tasks
     * @accepts {Gantt.model.TaskModel[]|TaskModelConfig[]}
     * @category Inline data
     */
    /**
     * Data use to fill the `taskStore`. Should be an array of
     * {@link Gantt.model.TaskModel} or its configuration objects.
     *
     * @config {Gantt.model.TaskModel[]|TaskModelConfig[]} tasks
     * @category Inline data
     */

    /**
     * Get/set `resourceStore` data.
     *
     * Always returns an array of {@link Gantt.model.ResourceModel} but also accepts an array
     * of its configuration objects as input.
     *
     * @member {Gantt.model.ResourceModel[]} resources
     * @accepts {Gantt.model.ResourceModel[]|ResourceModelConfig[]}
     * @category Inline data
     */
    /**
     * Data use to fill the `resourceStore`. Should be an array of
     * {@link Gantt.model.ResourceModel} or its configuration objects.
     *
     * @config {Gantt.model.ResourceModel[]|ResourceModelConfig[]} resources
     * @category Inline data
     */

    /**
     * Get/set `assignmentStore` data.
     *
     * Always returns an array of {@link Gantt.model.AssignmentModel} but also accepts an
     * array of its configuration objects as input.
     *
     * @member {Gantt.model.AssignmentModel[]} assignments
     * @accepts {Gantt.model.AssignmentModel[]|AssignmentModelConfig[]}
     * @category Inline data
     */
    /**
     * Data use to fill the `assignmentStore`. Should be an array of
     * {@link Gantt.model.AssignmentModel} or its configuration objects.
     *
     * @config {Gantt.model.AssignmentModel[]|AssignmentModelConfig[]} assignments
     * @category Inline data
     */

    /**
     * Get/set `dependencyStore` data.
     *
     * Always returns an array of {@link Gantt.model.DependencyModel} but also accepts an
     * array of its configuration objects as input.
     *
     * @member {Gantt.model.DependencyModel[]} dependencies
     * @accepts {Gantt.model.DependencyModel[]|DependencyModelConfig[]}
     * @category Inline data
     */
    /**
     * Data use to fill the `dependencyStore`. Should be an array of
     * {@link Gantt.model.DependencyModel} or its configuration objects.
     *
     * @config {Gantt.model.DependencyModel[]|DependencyModelConfig[]} dependencies
     * @category Inline data
     */

    /**
     * Get/set `calendarManagerStore` data.
     *
     * Always returns a {@link Gantt.model.CalendarModel} array but also accepts an array of its configuration
     * objects as input.
     *
     * @member {Gantt.model.CalendarModel[]} calendars
     * @accepts {Gantt.model.CalendarModel[]|CalendarModelConfig[]}
     * @category Inline data
     */
    /**
     * Data use to fill the `calendarManagerStore`. Should be a
     * {@link Gantt.model.CalendarModel} array or its configuration objects.
     *
     * @config {Gantt.model.CalendarModel[]|CalendarModelConfig[]} calendars
     * @category Inline data
     */

    //endregion

    static configurable = {
        crudLoadValidationWarningPrefix : 'Project load response error(s):',
        crudSyncValidationWarningPrefix : 'Project sync response error(s):',

        // In Gantt the event store is exposed as `taskStore`. The underlying field stays
        // `eventStore` so the engine and dep cascade keep using their existing lookups.
        eventStoreClass           : TaskStoreCommunity,
        eventModelClass           : TaskModelCommunity,
        assignmentStoreClass      : AssignmentStoreCommunity,
        assignmentModelClass      : AssignmentModelCommunity,
        resourceStoreClass        : ResourceStoreCommunity,
        resourceModelClass        : ResourceModelCommunity,
        dependencyStoreClass      : DependencyStoreCommunity,
        dependencyModelClass      : DependencyModelCommunity,
        calendarManagerStoreClass : CalendarManagerStoreCommunity,
        calendarModelClass        : CalendarModelCommunity
    };

    construct(config = {}) {
        // Gantt-flavored config aliases (matches TaskBoard's ProjectModel pattern).
        if (config.tasks) {
            config.events = config.tasks;
            delete config.tasks;
        }
        if (config.tasksData) {
            config.events = config.tasksData;
            // No delete on purpose, for deprecation warning to be shown
        }
        if (config.taskStore) {
            config.eventStore = config.taskStore;
            delete config.taskStore;
        }
        if (config.taskModelClass) {
            config.eventModelClass = config.taskModelClass;
            delete config.taskModelClass;
        }
        if (config.taskStoreClass) {
            config.eventStoreClass = config.taskStoreClass;
            delete config.taskStoreClass;
        }

        this.data = [];

        super.construct(config);

        // Register the project's stores with the mixed-in CrudManager so loaded responses are
        // dispatched into them. Without these, `crudStores` stays empty and `autoLoad` is a no-op.
        // `storeId` must match the response top-level key for each store — Gantt's wire format uses
        // `tasks` (not `events`) and `calendars` / `dependencies` (which the stores don't carry by
        // default), so we pass descriptor objects rather than bare store references.
        const me = this;
        me.addPrioritizedStore({ storeId : 'calendars',    store : me.calendarManagerStore });
        me.addPrioritizedStore({ storeId : 'dependencies', store : me.dependencyStore });
        me.addPrioritizedStore({ storeId : 'resources',    store : me.resourceStore });
        me.addPrioritizedStore({ storeId : 'assignments',  store : me.assignmentStore });
        me.addPrioritizedStore({ storeId : 'tasks',        store : me.taskStore });
    }

    //region Gantt API surface

    get taskStore() {
        return this.eventStore;
    }

    get tasks() {
        return this.taskStore.allRecords;
    }

    set tasks(tasks) {
        this.taskStore.data = tasks;
    }

    get calendars() {
        return this.calendarManagerStore.allRecords;
    }

    set calendars(calendars) {
        this.calendarManagerStore.data = calendars;
    }

    get project() {
        return this;
    }

    get calendar() {
        if (typeof this.$calendar === 'string') {
            this.$calendar = this.calendarManagerStore.getById(this.$calendar);
        }

        return this.$calendar || this.defaultCalendar;
    }

    set calendar(calendar) {
        this.$calendar = calendar;
    }

    set taskStoreClass(taskStoreClass) {
        this.eventStoreClass = taskStoreClass;
    }

    get taskStoreClass() {
        return this.eventStoreClass;
    }

    set taskModelClass(taskModelClass) {
        this.eventModelClass = taskModelClass;
    }

    get taskModelClass() {
        return this.eventModelClass;
    }

    //endregion

    get crudLoadValidationMandatoryStores() {
        return [this.getStoreDescriptor(this.eventStore).storeId];
    }
}
