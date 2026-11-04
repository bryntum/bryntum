// Calendar caps Scheduler's aliases at Business (`consumerCaps` in scripts/types/grunt-types-tiers.js)
import EventStoreCommunity from '../../Scheduler/data/EventStoreCommunity.js';

/**
 * @module Calendar/data/EventStore
 */

const TierBase = EventStoreCommunity;

/**
 * Calendar's tier-resolved event store: {@link Scheduler.data.EventStoreCommunity} on Community and
 * {@link Scheduler.data.EventStoreBusiness} on Business and Enterprise ([tiers](#Calendar/guides/data/tiers.md)).
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
