// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class is imported and
// extended per tier. What is written here is what untiered sources resolve to. TaskBoard resolves Scheduler's aliases
// at most at the Business tier (see `consumerCaps` in scripts/types/grunt-types-tiers.js), so unlike Scheduler's own alias
// this never picks the Enterprise variant.
import EventStoreCommunity from '../../Scheduler/data/EventStoreCommunity.js';

/**
 * @module TaskBoard/store/EventStore
 */

const TierBase = EventStoreCommunity;

/**
 * TaskBoard's tier-resolved event store, the base of {@link TaskBoard.store.TaskStore}.
 *
 * It is {@link Scheduler.data.EventStoreCommunity} on the Community tier and {@link Scheduler.data.EventStoreBusiness}
 * on Business and Enterprise. TaskBoard does not use the Enterprise scheduling engine, so it never resolves to the
 * Enterprise variant the way Scheduler's own alias does. Import this class and you get the right one for the tier you
 * are running. See the [Product tiers and class names](#Scheduler/guides/data/tiers.md) guide for details.
 *
 * See {@link Scheduler.data.EventStore} for the full documentation.
 *
 * @tier-alias EventStore
 * @extends Scheduler/data/EventStoreCommunity
 */
export default class EventStore extends TierBase {
    static $name = 'EventStore';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
