// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import TaskStoreCommunity from './TaskStoreCommunity.js';

/**
 * @module Gantt/data/TaskStore
 */

const TierBase = TaskStoreCommunity;

/**
 * A class representing the tree of tasks in the Gantt project. An individual task is represented as an instance of the
 * {@link Gantt.model.TaskModel} class. The store expects the data loaded to be hierarchical. Each parent node should
 * contain its children in a property called 'children'.
 *
 * ```javascript
 * const taskStore = new TaskStore({
 *     data : [
 *         {
 *             "id"           : 1000,
 *             "name"         : "Cool project",
 *             "percentDone"  : 50,
 *             "startDate"    : "2019-01-02",
 *             "expanded"     : true,
 *             "children"     : [
 *                 {
 *                     "id"           : 1,
 *                     "name"         : "A leaf node",
 *                     "startDate"    : "2019-01-02",
 *                     "percentDone"  : 50,
 *                     "duration"     : 10,
 *                 }
 *             ]
 *         }
 *     ]
 * });
 * ```
 *
 * This is the tier-resolved data class — it is {@link Gantt.data.TaskStoreCommunity} on the Community tier, {@link
 * Gantt.data.TaskStoreBusiness} on Business and {@link Gantt.data.TaskStoreEnterprise} on Enterprise. Import this class
 * and you get the right one for the tier you are running. Sections marked with a tier badge describe behavior that
 * requires that tier or higher. See the [Product tiers and class names](#Gantt/guides/data/tiers.md) guide for details.
 *
 * @tier-alias TaskStore
 * @extends Gantt/data/TaskStoreCommunity
 */
export default class TaskStore extends TierBase {
    static $name = 'TaskStore';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
