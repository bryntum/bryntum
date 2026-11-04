// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class is imported and
// extended per tier. What is written here is what untiered sources resolve to. TaskBoard resolves Scheduler's aliases
// at most at the Business tier (see `consumerCaps` in scripts/types/grunt-types-tiers.js), so unlike Scheduler's own alias
// this never picks the Enterprise variant.
import AssignmentStoreCommunity from '../../Scheduler/data/AssignmentStoreCommunity.js';

/**
 * @module TaskBoard/store/AssignmentStore
 */

const TierBase = AssignmentStoreCommunity;

/**
 * TaskBoard's tier-resolved assignment store.
 *
 * It is {@link Scheduler.data.AssignmentStoreCommunity} on the Community tier and {@link
 * Scheduler.data.AssignmentStoreBusiness} on Business and Enterprise. TaskBoard does not use the Enterprise scheduling
 * engine, so it never resolves to the Enterprise variant the way Scheduler's own alias does. Import this class and you
 * get the right one for the tier you are running. See the [Product tiers and class
 * names](#Scheduler/guides/data/tiers.md) guide for details.
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
