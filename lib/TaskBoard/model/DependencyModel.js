// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class is imported and
// extended per tier. What is written here is what untiered sources resolve to. TaskBoard resolves Scheduler's aliases
// at most at the Business tier (see `consumerCaps` in scripts/types/grunt-types-tiers.js), so unlike Scheduler's own alias
// this never picks the Enterprise variant.
import DependencyModelCommunity from '../../Scheduler/model/DependencyModelCommunity.js';

/**
 * @module TaskBoard/model/DependencyModel
 */

const TierBase = DependencyModelCommunity;

/**
 * TaskBoard's tier-resolved dependency model.
 *
 * It is {@link Scheduler.model.DependencyModelCommunity} on the Community tier and {@link
 * Scheduler.model.DependencyModelBusiness} on Business and Enterprise. TaskBoard does not use the Enterprise
 * scheduling engine, so it never resolves to the Enterprise variant the way Scheduler's own alias does. Import this
 * class and you get the right one for the tier you are running. See the [Product tiers and class
 * names](#Scheduler/guides/data/tiers.md) guide for details.
 *
 * See {@link Scheduler.model.DependencyModel} for the full documentation.
 *
 * @tier-alias DependencyModel
 * @extends Scheduler/model/DependencyModelCommunity
 */
export default class DependencyModel extends TierBase {
    static $name = 'DependencyModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
