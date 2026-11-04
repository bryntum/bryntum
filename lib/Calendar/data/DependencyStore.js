// Calendar caps Scheduler's aliases at Business (`consumerCaps` in scripts/types/grunt-types-tiers.js)
import DependencyStoreCommunity from '../../Scheduler/data/DependencyStoreCommunity.js';

/**
 * @module Calendar/data/DependencyStore
 */

const TierBase = DependencyStoreCommunity;

/**
 * Calendar's tier-resolved dependency store: {@link Scheduler.data.DependencyStoreCommunity} on Community and
 * {@link Scheduler.data.DependencyStoreBusiness} on Business and Enterprise ([tiers](#Calendar/guides/data/tiers.md)).
 *
 * See {@link Scheduler.data.DependencyStore} for the full documentation.
 *
 * @tier-alias DependencyStore
 * @extends Scheduler/data/DependencyStoreCommunity
 */
export default class DependencyStore extends TierBase {
    static $name = 'DependencyStore';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
