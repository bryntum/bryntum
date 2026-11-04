// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import AssignmentModelCommunity from './AssignmentModelCommunity.js';

/**
 * @module Gantt/model/AssignmentModel
 */

const TierBase = AssignmentModelCommunity;

/**
 * This class represents a single assignment of a {@link Gantt.model.ResourceModel resource} to a
 * {@link Gantt.model.TaskModel task} in your gantt chart.
 *
 * This is the tier-resolved model class — it is {@link Gantt.model.AssignmentModelCommunity} on the Community tier,
 * {@link Gantt.model.AssignmentModelBusiness} on Business and {@link Gantt.model.AssignmentModelEnterprise} on
 * Enterprise. Import this class and you get the right one for the tier you are running. Sections marked with a tier
 * badge describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Gantt/guides/data/tiers.md) guide for details.
 *
 * ## See also
 *
 * - {@link Gantt.data.AssignmentStore} - Assignment store
 * - {@link Gantt.model.TaskModel} - Task data model
 * - {@link Gantt.model.ResourceModel} - Resource data model
 *
 * @tier-alias AssignmentModel
 * @extends Gantt/model/AssignmentModelCommunity
 * @class-alias Scheduler.model.AssignmentModel -> Scheduler.model.SchedulerAssignmentModel
 */
export default class AssignmentModel extends TierBase {
    static $name = 'AssignmentModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
