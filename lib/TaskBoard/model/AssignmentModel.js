// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class is imported and
// extended per tier. What is written here is what untiered sources resolve to. TaskBoard resolves Scheduler's aliases
// at most at the Business tier (see `consumerCaps` in scripts/types/grunt-types-tiers.js), so unlike Scheduler's own alias
// this never picks the Enterprise variant.
import AssignmentModelCommunity from '../../Scheduler/model/AssignmentModelCommunity.js';

/**
 * @module TaskBoard/model/AssignmentModel
 */

const TierBase = AssignmentModelCommunity;

/**
 * TaskBoard's tier-resolved assignment model.
 *
 * It is {@link Scheduler.model.AssignmentModelCommunity} on the Community tier and {@link
 * Scheduler.model.AssignmentModelBusiness} on Business and Enterprise. TaskBoard does not use the Enterprise
 * scheduling engine, so it never resolves to the Enterprise variant the way Scheduler's own alias does. Import this
 * class and you get the right one for the tier you are running. See the [Product tiers and class
 * names](#Scheduler/guides/data/tiers.md) guide for details.
 *
 * See {@link Scheduler.model.AssignmentModel} for the full documentation.
 *
 * @tier-alias AssignmentModel
 * @extends Scheduler/model/AssignmentModelCommunity
 */
export default class AssignmentModel extends TierBase {
    static $name = 'AssignmentModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
