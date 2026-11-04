import AjaxStore from '../../Core/data/AjaxStore.js';
import { GanttCoreEventStoreMixin } from '../../Engine/quark/store/GanttCoreEventStoreMixin.js';
import PartOfProject from '../../Scheduler/data/mixin/PartOfProject.js';
import GetEventsMixin from '../../Scheduler/data/mixin/GetEventsMixin.js'; // To allow using TaskStore in Calendar
import DayIndexMixin from '../../Scheduler/data/mixin/DayIndexMixin.js'; // To allow using TaskStore in Calendar
import TaskModelCommunity from '../model/TaskModelCommunity.js';
import TaskStoreSharedMixin from './mixin/TaskStoreSharedMixin.js';

/**
 * @module Gantt/data/TaskStoreCommunity
 */

/**
 * Community-tier TaskStore.
 *
 * The full documentation lives on {@link Gantt.data.TaskStore}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @mixes Scheduler/data/mixin/GetEventsMixin
 * @extends Scheduler/data/EventStoreCommunity
 * @tier community
 */
export default class TaskStoreCommunity extends GanttCoreEventStoreMixin.derive(AjaxStore).mixin(
    PartOfProject,
    DayIndexMixin,
    GetEventsMixin,
    TaskStoreSharedMixin
) {
    static $name = 'TaskStoreCommunity';

    static get isTaskStore() {
        return true;
    }

    get isTaskStore() {
        return true;
    }

    static configurable = {
        tree       : true,
        modelClass : TaskModelCommunity,

        /**
         * CrudManager must load stores in the correct order. Lowest first.
         * @config {Number}
         * @private
         */
        loadPriority : 200,

        /**
         * CrudManager must sync stores in the correct order. Lowest first.
         * @config {Number}
         * @private
         */
        syncPriority : 300,

        id : 'tasks' // no-sanity
    };
}
