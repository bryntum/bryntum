// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import EventStoreCommunity from './EventStoreCommunity.js';

/**
 * @module Scheduler/data/EventStore
 */

const TierBase = EventStoreCommunity;

/**
 * A store holding all the {@link Scheduler.model.EventModel events} to be rendered into a {@link Scheduler.view.Scheduler}.
 *
 * This store only accepts a model class inheriting from {@link Scheduler.model.EventModel}.
 *
 * An EventStore is usually connected to a project, which binds it to other related stores (AssignmentStore,
 * ResourceStore and DependencyStore). The project also handles normalization/calculation of the data on the records in
 * the store. For example if a record is added with a `startDate` and an `endDate`, it will calculate the `duration`.
 *
 * The calculations happens async, records are not guaranteed to have up to date data until they are finished. To be
 * certain that calculations have finished, call `await project.commitAsync()` after store actions. Or use one of the
 * `xxAsync` functions, such as `loadDataAsync()`.
 *
 * Using `commitAsync()`:
 *
 * ```javascript
 * eventStore.data = [{ startDate, endDate }, ...];
 *
 * // duration of the record is not yet calculated
 *
 * await eventStore.project.commitAsync();
 *
 * // now it is
 * ```
 *
 * Using `loadDataAsync()`:
 *
 * ```javascript
 * await eventStore.loadDataAsync([{ startDate, endDate }, ...]);
 *
 * // duration is calculated
 * ```
 *
 * This is the tier-resolved data class — it is {@link Scheduler.data.EventStoreCommunity} on the Community tier,
 * {@link Scheduler.data.EventStoreBusiness} on Business and {@link Scheduler.data.EventStoreEnterprise} on
 * Enterprise. Import this class and you get the right one for the tier you are running. Sections marked with a tier
 * badge describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Scheduler/guides/data/tiers.md) guide for details.
 *
 * ## Using recurring events <span class="badge tier tier-business">Business</span>
 * When recurring events are in the database, **all recurring event definitions** which started before
 * the requested start date, and have not yet finished recurring MUST be loaded into the EventStore.
 *
 * Only the **base** recurring event **definitions** are stored in the EventStore. You do not
 * need to calculate the future occurrence dates of these events. This is all handled by the EventStore.
 *
 * When asked to yield a set of events for a certain date range for creating a UI through
 * {@link #function-getEvents}, the EventStore *automatically* interpolates any occurrences of
 * recurring events into the results. They do not occupy slots in the EventStore for every date
 * in their repetition range (that would be very inefficient, and *might* be infinite).
 *
 * ## See also
 *
 * - {@link Scheduler.model.EventModel} - Event data model
 * - {@link Scheduler.data.ResourceStore} - Resource store
 * - {@link Scheduler.data.AssignmentStore} - Assignment store
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 *
 * @tier-alias EventStore
 * @extends Scheduler/data/EventStoreCommunity
 */
export default class EventStore extends TierBase {
    static $name = 'EventStore';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';

    static type = 'eventStore';
}

// Register this store type with its Factory, so factory-created stores match the built tier.
EventStore.initClass();
