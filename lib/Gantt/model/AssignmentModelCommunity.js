import SchedulerAssignmentModel from '../../Scheduler/model/AssignmentModelCommunity.js';

/**
 * @module Gantt/model/AssignmentModelCommunity
 */

/**
 * Community-tier AssignmentModel.
 *
 * The full documentation lives on {@link Gantt.model.AssignmentModel}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @extends Scheduler/model/AssignmentModelCommunity
 * @tier community
 * @class-alias Scheduler.model.AssignmentModelCommunity -> Scheduler.model.SchedulerAssignmentModelCommunity
 */
export default class AssignmentModelCommunity extends SchedulerAssignmentModel {
    static $name = 'AssignmentModelCommunity';
}
