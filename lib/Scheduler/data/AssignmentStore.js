// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import AssignmentStoreCommunity from './AssignmentStoreCommunity.js';

/**
 * @module Scheduler/data/AssignmentStore
 */

const TierBase = AssignmentStoreCommunity;

/**
 * A store representing a collection of assignments between events in the {@link Scheduler.data.EventStore} and resources
 * in the {@link Scheduler.data.ResourceStore}.
 *
 * This store only accepts a model class inheriting from {@link Scheduler.model.AssignmentModel}.
 *
 * An AssignmentStore is usually connected to a project, which binds it to other related stores (EventStore,
 * ResourceStore and DependencyStore). The project also handles references (event, resource) to related records for the
 * records in the store.
 *
 * Resolving the references happens async, records are not guaranteed to have up to date references until calculations
 * are finished. To be certain that references are resolved, call `await project.commitAsync()` after store actions. Or
 * use one of the `xxAsync` functions, such as `loadDataAsync()`.
 *
 * Using `commitAsync()`:
 *
 * ```javascript
 * assignmentStore.data = [{ eventId, resourceId }, ...];
 *
 * // references (event, resource) not resolved yet
 *
 * await assignmentStore.project.commitAsync();
 *
 * // now they are
 * ```
 *
 * Using `loadDataAsync()`:
 *
 * ```javascript
 * await assignmentStore.loadDataAsync([{ eventId, resourceId }, ...]);
 *
 * // references (event, resource) are resolved
 * ```
 *
 * This is the tier-resolved data class — it is {@link Scheduler.data.AssignmentStoreCommunity} on the Community tier,
 * {@link Scheduler.data.AssignmentStoreBusiness} on Business and {@link Scheduler.data.AssignmentStoreEnterprise} on
 * Enterprise. Import this class and you get the right one for the tier you are running. Sections marked with a tier
 * badge describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Scheduler/guides/data/tiers.md) guide for details.
 *
 * ## See also
 *
 * - {@link Scheduler.model.AssignmentModel} - Assignment data model
 * - {@link Scheduler.data.EventStore} - Event store
 * - {@link Scheduler.data.ResourceStore} - Resource store
 *
 * @tier-alias AssignmentStore
 * @extends Scheduler/data/AssignmentStoreCommunity
 */
export default class AssignmentStore extends TierBase {
    static $name = 'AssignmentStore';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';

    static type = 'assignmentStore';
}

// Register this store type with its Factory, so factory-created stores match the built tier.
AssignmentStore.initClass();
