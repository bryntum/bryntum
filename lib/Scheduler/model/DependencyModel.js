// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import DependencyModelCommunity from './DependencyModelCommunity.js';

/**
 * @module Scheduler/model/DependencyModel
 */

const TierBase = DependencyModelCommunity;

/**
 * This model represents a dependency between two events, usually added to a {@link Scheduler.data.DependencyStore}.
 *
 * It is a subclass of the {@link Scheduler.model.DependencyBaseModel} class, which in its turn subclasses
 * {@link Core.data.Model}. Please refer to documentation of those classes to become familiar with the base interface of
 * this class.
 *
 * This is the tier-resolved model class — it is {@link Scheduler.model.DependencyModelCommunity} on the Community tier,
 * {@link Scheduler.model.DependencyModelBusiness} on Business and {@link Scheduler.model.DependencyModelEnterprise} on
 * Enterprise. Import this class and you get the right one for the tier you are running. Sections marked with a tier
 * badge describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Scheduler/guides/data/tiers.md) guide for details.
 *
 * ## Fields and references
 *
 * A Dependency has a few predefined fields, see Fields below.  The name of any fields data source can be customized in
 * the subclass, see the example below. Please also refer to {@link Core.data.Model} for details.
 *
 * ```javascript
 * class MyDependency extends DependencyModel {
 *   static get fields() {
 *     return [
 *       { name: 'to', dataSource: 'targetId' },
 *       { name: 'from', dataSource: 'sourceId' }
 *     ]);
 *   }
 * }
 * ```
 *
 * After load and project normalization, these references are accessible (assuming their respective stores are loaded):
 * - `fromEvent` - The event on the start side of the dependency
 * - `toEvent` - The event on the end side of the dependency
 *
 * ## Async resolving of references
 *
 * As described above, a dependency has links to events. These references are populated async, using the calculation
 * engine of the project that the resource via its store is a part of. Because of this asyncness, references cannot be
 * used immediately after modifications:
 *
 * ```javascript
 * dependency.from = 2;
 * // dependency.fromEvent is not yet up to date
 * ```
 *
 * To make sure references are updated, wait for calculations to finish:
 *
 * ```javascript
 * dependency.from = 2;
 * await dependency.project.commitAsync();
 * // dependency.fromEvent is up to date
 * ```
 *
 * As an alternative, you can also use `setAsync()` to trigger calculations directly after the change:
 *
 * ```javascript
 * await dependency.setAsync({ from : 2});
 * // dependency.fromEvent is up to date
 * ```
 *
 * ## Scheduling engine <span class="badge tier tier-enterprise">Enterprise</span>
 *
 * On the Enterprise tier the dependency participates in scheduling, so moving a predecessor reschedules its
 * successors. It gains an {@link Scheduler.model.DependencyModelEnterprise#field-active active} flag to
 * disable a link without removing it, and a {@link Scheduler.model.DependencyModelEnterprise#field-calendar
 * calendar} used when applying the lag.
 *
 * ## See also
 *
 * - {@link Scheduler.data.DependencyStore} - Store for dependencies
 * - {@link Scheduler.model.EventModel} - Event data model
 * - {@link Scheduler.feature.Dependencies} - Dependencies feature
 *
 * @tier-alias DependencyModel
 * @extends Scheduler/model/DependencyModelCommunity
 */
export default class DependencyModel extends TierBase {
    static $name = 'DependencyModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
