// Calendar caps Scheduler's aliases at Business (`consumerCaps` in scripts/types/grunt-types-tiers.js)
import ResourceStoreCommunity from '../../Scheduler/data/ResourceStoreCommunity.js';

/**
 * @module Calendar/data/ResourceStore
 */

const TierBase = ResourceStoreCommunity;

/**
 * Calendar's tier-resolved resource store: {@link Scheduler.data.ResourceStoreCommunity} on Community and
 * {@link Scheduler.data.ResourceStoreBusiness} on Business and Enterprise ([tiers](#Calendar/guides/data/tiers.md)).
 *
 * See {@link Scheduler.data.ResourceStore} for the full documentation.
 *
 * @tier-alias ResourceStore
 * @extends Scheduler/data/ResourceStoreCommunity
 */
export default class ResourceStore extends TierBase {
    static $name = 'ResourceStore';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
