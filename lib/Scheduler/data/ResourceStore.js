// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import ResourceStoreCommunity from './ResourceStoreCommunity.js';

/**
 * @module Scheduler/data/ResourceStore
 */

const TierBase = ResourceStoreCommunity;

/**
 * A store holding all the {@link Scheduler.model.ResourceModel resources} to be rendered into a
 * {@link Scheduler.view.Scheduler}.
 *
 * This store only accepts a model class inheriting from {@link Scheduler.model.ResourceModel}.
 *
 * A ResourceStore is usually connected to a project, which binds it to other related stores (EventStore,
 * AssignmentStore and DependencyStore). The project also handles references (assignments, events) to related records
 * for the records in the store.
 *
 * Resolving the references happens async, records are not guaranteed to have up to date references until calculations
 * are finished. To be certain that references are resolved, call `await project.commitAsync()` after store actions. Or
 * use one of the `xxAsync` functions, such as `loadDataAsync()`.
 *
 * Using `commitAsync()`:
 *
 * ```javascript
 * resourceStore.data = [{ id }, ...];
 *
 * // references (assignments, events) not resolved yet
 *
 * await resourceStore.project.commitAsync();
 *
 * // now they are
 * ```
 *
 * Using `loadDataAsync()`:
 *
 * ```javascript
 * await resourceStore.loadDataAsync([{ id }, ...]);
 *
 * // references (assignments, events) are resolved
 * ```
 *
 * This is the tier-resolved data class — it is {@link Scheduler.data.ResourceStoreCommunity} on the Community tier,
 * {@link Scheduler.data.ResourceStoreBusiness} on Business and {@link Scheduler.data.ResourceStoreEnterprise} on
 * Enterprise. Import this class and you get the right one for the tier you are running. Sections marked with a tier
 * badge describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Scheduler/guides/data/tiers.md) guide for details.
 *
 * ## See also
 *
 * - {@link Scheduler.model.ResourceModel} - Resource data model
 * - {@link Scheduler.data.EventStore} - Event store
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 *
 * @tier-alias ResourceStore
 * @extends Scheduler/data/ResourceStoreCommunity
 */
export default class ResourceStore extends TierBase {
    static $name = 'ResourceStore';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';

    static type = 'resourceStore';
}

// Register this store type with its Factory, so factory-created stores match the built tier.
ResourceStore.initClass();
