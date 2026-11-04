// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import DependencyStoreCommunity from './DependencyStoreCommunity.js';

/**
 * @module Gantt/data/DependencyStore
 */

const TierBase = DependencyStoreCommunity;

/**
 * A class representing a collection of dependencies between tasks in the {@link Gantt.data.TaskStore}.
 * Contains a collection of {@link Gantt.model.DependencyModel} records.
 *
 * ```javascript
 * const dependencyStore = new DependencyStore({
 *     data : [
 *         {
 *             "id"       : 1,
 *             "fromTask" : 11,
 *             "toTask"   : 15,
 *             "lag"      : 2
 *         },
 *         {
 *             "id"       : 2,
 *             "fromTask" : 12,
 *             "toTask"   : 15
 *         }
 *     ]
 * })
 * ```
 *
 * This is the tier-resolved data class — it is {@link Gantt.data.DependencyStoreCommunity} on the Community tier,
 * {@link Gantt.data.DependencyStoreBusiness} on Business and {@link Gantt.data.DependencyStoreEnterprise} on
 * Enterprise. Import this class and you get the right one for the tier you are running. Sections marked with a tier
 * badge describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Gantt/guides/data/tiers.md) guide for details.
 *
 * @tier-alias DependencyStore
 * @extends Gantt/data/DependencyStoreCommunity
 * @class-alias Scheduler.data.DependencyStore -> Scheduler.data.SchedulerDependencyStore
 */
export default class DependencyStore extends TierBase {
    static $name = 'DependencyStore';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
