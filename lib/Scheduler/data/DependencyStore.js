// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import DependencyStoreCommunity from './DependencyStoreCommunity.js';

/**
 * @module Scheduler/data/DependencyStore
 */

const TierBase = DependencyStoreCommunity;

/**
 * A store representing a collection of dependencies between events in the {@link Scheduler.data.EventStore}.
 *
 * This store only accepts a model class inheriting from {@link Scheduler.model.DependencyModel}.
 *
 * A DependencyStore is usually connected to a project, which binds it to other related stores (EventStore,
 * AssignmentStore and ResourceStore). The project also handles references (fromEvent, toEvent) to related records
 * for the records in the store.
 *
 * Resolving the references happens async, records are not guaranteed to have up to date references until calculations
 * are finished. To be certain that references are resolved, call `await project.commitAsync()` after store actions. Or
 * use one of the `xxAsync` functions, such as `loadDataAsync()`.
 *
 * Using `commitAsync()`:
 *
 * ```javascript
 * dependencyStore.data = [{ from, to }, ...];
 *
 * // references (fromEvent, toEvent) not resolved yet
 *
 * await dependencyStore.project.commitAsync();
 *
 * // now they are
 * ```
 *
 * Using `loadDataAsync()`:
 *
 * ```javascript
 * await dependencyStore.loadDataAsync([{ from, to }, ...]);
 *
 * // references (fromEvent, toEvent) are resolved
 * ```
 *
 * This is the tier-resolved data class — it is {@link Scheduler.data.DependencyStoreCommunity} on the Community tier,
 * {@link Scheduler.data.DependencyStoreBusiness} on Business and {@link Scheduler.data.DependencyStoreEnterprise} on
 * Enterprise. Import this class and you get the right one for the tier you are running. Sections marked with a tier
 * badge describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Scheduler/guides/data/tiers.md) guide for details.
 *
 * ## See also
 *
 * - {@link Scheduler.model.DependencyModel} - Dependency data model
 * - {@link Scheduler.feature.Dependencies} - Dependencies feature
 * - {@link Scheduler.data.EventStore} - Event store
 *
 * @tier-alias DependencyStore
 * @extends Scheduler/data/DependencyStoreCommunity
 */
export default class DependencyStore extends TierBase {
    static $name = 'DependencyStore';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';

    static type = 'dependencyStore';
}

// Register this store type with its Factory, so factory-created stores match the built tier.
DependencyStore.initClass();
