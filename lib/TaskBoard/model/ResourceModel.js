// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class is imported and
// extended per tier. What is written here is what untiered sources resolve to. TaskBoard resolves Scheduler's aliases
// at most at the Business tier (see `consumerCaps` in scripts/types/grunt-types-tiers.js), so unlike Scheduler's own alias
// this never picks the Enterprise variant.
import ResourceModelCommunity from '../../Scheduler/model/ResourceModelCommunity.js';

/**
 * @module TaskBoard/model/ResourceModel
 */

const TierBase = ResourceModelCommunity;

/**
 * TaskBoard's tier-resolved resource model.
 *
 * It is {@link Scheduler.model.ResourceModelCommunity} on the Community tier and {@link
 * Scheduler.model.ResourceModelBusiness} on Business and Enterprise. TaskBoard does not use the Enterprise scheduling
 * engine, so it never resolves to the Enterprise variant the way Scheduler's own alias does. Import this class and you
 * get the right one for the tier you are running. See the [Product tiers and class
 * names](#Scheduler/guides/data/tiers.md) guide for details.
 *
 * See {@link Scheduler.model.ResourceModel} for the full documentation.
 *
 * @tier-alias ResourceModel
 * @extends Scheduler/model/ResourceModelCommunity
 */
export default class ResourceModel extends TierBase {
    static $name = 'ResourceModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
