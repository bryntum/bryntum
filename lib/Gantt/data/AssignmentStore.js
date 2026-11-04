// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import AssignmentStoreCommunity from './AssignmentStoreCommunity.js';

/**
 * @module Gantt/data/AssignmentStore
 */

const TierBase = AssignmentStoreCommunity;

/**
 * A class representing a collection of assignments between tasks in the {@link Gantt/data/TaskStore} and resources
 * in the {@link Gantt/data/ResourceStore}.
 *
 * ```javascript
 * const assignmentStore = new AssignmentStore({
 *     data : [
 *         { "id" : 1, "event" : 11,  "resource" : 1 },
 *         { "id" : 2, "event" : 12,  "resource" : 1 },
 *     ]
 * })
 * ```
 *
 * Contains a collection of the {@link Gantt/model/AssignmentModel} records.
 *
 * This is the tier-resolved data class — it is {@link Gantt.data.AssignmentStoreCommunity} on the Community tier,
 * {@link Gantt.data.AssignmentStoreBusiness} on Business and {@link Gantt.data.AssignmentStoreEnterprise} on
 * Enterprise. Import this class and you get the right one for the tier you are running. Sections marked with a tier
 * badge describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Gantt/guides/data/tiers.md) guide for details.
 *
 * @tier-alias AssignmentStore
 * @extends Gantt/data/AssignmentStoreCommunity
 * @class-alias Scheduler.data.AssignmentStore -> Scheduler.data.SchedulerAssignmentStore
 */
export default class AssignmentStore extends TierBase {
    static $name = 'AssignmentStore';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
