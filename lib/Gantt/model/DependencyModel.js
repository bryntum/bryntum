// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import DependencyModelCommunity from './DependencyModelCommunity.js';

/**
 * @module Gantt/model/DependencyModel
 */

const TierBase = DependencyModelCommunity;

/**
 * This class represents a single dependency between the tasks in your Gantt project.
 *
 * This is the tier-resolved model class — it is {@link Gantt.model.DependencyModelCommunity} on the Community tier,
 * {@link Gantt.model.DependencyModelBusiness} on Business and {@link Gantt.model.DependencyModelEnterprise} on
 * Enterprise. Import this class and you get the right one for the tier you are running. Sections marked with a tier
 * badge describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Gantt/guides/data/tiers.md) guide for details.
 *
 * ## Subclassing the Dependency class
 *
 * The name of any field in data can be customized in the subclass, see the example below.
 *
 * ```javascript
 * class MyDependencyModel extends DependencyModel {
 *   static get fields() {
 *     return [
 *       { name: 'to', dataSource : 'targetId' },
 *       { name: 'from', dataSource : 'sourceId' }
 *     ];
 *   }
 * }
 * ```
 *
 * @tier-alias DependencyModel
 * @extends Gantt/model/DependencyModelCommunity
 * @class-alias Scheduler.model.DependencyModel -> Scheduler.model.SchedulerDependencyModel
 */
export default class DependencyModel extends TierBase {
    static $name = 'DependencyModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
