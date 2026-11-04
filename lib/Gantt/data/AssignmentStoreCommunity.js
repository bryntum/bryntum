import SchedulerAssignmentStore from '../../Scheduler/data/AssignmentStoreCommunity.js';
import AssignmentModelCommunity from '../model/AssignmentModelCommunity.js';

/**
 * @module Gantt/data/AssignmentStoreCommunity
 */

/**
 * Community-tier AssignmentStore.
 *
 * The full documentation lives on {@link Gantt.data.AssignmentStore}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @extends Scheduler/data/AssignmentStoreCommunity
 * @tier community
 * @class-alias Scheduler.data.AssignmentStoreCommunity -> Scheduler.data.SchedulerAssignmentStoreCommunity
 */
export default class AssignmentStoreCommunity extends SchedulerAssignmentStore {
    static $name = 'AssignmentStoreCommunity';

    static configurable = {
        modelClass : AssignmentModelCommunity,

        // CrudManager must load/sync stores in the correct order. Lowest first.
        loadPriority : 500,
        syncPriority : 400
    };
}
