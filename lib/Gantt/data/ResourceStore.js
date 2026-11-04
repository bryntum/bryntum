// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import ResourceStoreCommunity from './ResourceStoreCommunity.js';

/**
 * @module Gantt/data/ResourceStore
 */

const TierBase = ResourceStoreCommunity;

/**
 * A class representing the collection of the resources - {@link Gantt.model.ResourceModel} records.
 *
 * ```javascript
 * const resourceStore = new ResourceStore({
 *     data : [
 *         { "id" : 1, "name" : "John Doe" },
 *         { "id" : 2, "name" : "Jane Doe" }
 *     ]
 * })
 * ```
 *
 * This is the tier-resolved data class — it is {@link Gantt.data.ResourceStoreCommunity} on the Community tier,
 * {@link Gantt.data.ResourceStoreBusiness} on Business and {@link Gantt.data.ResourceStoreEnterprise} on Enterprise.
 * Import this class and you get the right one for the tier you are running. Sections marked with a tier badge
 * describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Gantt/guides/data/tiers.md) guide for details.
 *
 * ## See also
 *
 * - {@link Gantt.model.ResourceModel} - Resource model class
 * - {@link Scheduler.feature.ResourceEdit} - Resource editor feature
 *
 * @tier-alias ResourceStore
 * @extends Gantt/data/ResourceStoreCommunity
 * @class-alias Scheduler.data.ResourceStore -> Scheduler.data.SchedulerResourceStore
 */
export default class ResourceStore extends TierBase {
    static $name = 'ResourceStore';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
