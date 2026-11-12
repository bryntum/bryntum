// Calendar caps Scheduler's aliases at the Core tier (`consumerCaps` in scripts/types/grunt-types-tiers.js)
import AssignmentStoreCommunity from '../../Scheduler/data/AssignmentStoreCommunity.js';

/**
 * @module Calendar/data/AssignmentStore
 */

const TierBase = AssignmentStoreCommunity;

/**
 * Calendar's tier-resolved assignment store: {@link Scheduler.data.AssignmentStoreCommunity} on the Community tier
 * and {@link Scheduler.data.AssignmentStoreCore} on the Core tier and the Enterprise tier. See
 * [tiers](#Calendar/guides/data/tiers.md).
 *
 * See {@link Scheduler.data.AssignmentStore} for the full documentation.
 *
 * @tier-alias AssignmentStore
 * @extends Scheduler/data/AssignmentStoreCommunity
 */
export default class AssignmentStore extends TierBase {
    static $name = 'AssignmentStore';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
