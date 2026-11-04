// Calendar caps Scheduler's aliases at Business (`consumerCaps` in scripts/types/grunt-types-tiers.js)
import AssignmentModelCommunity from '../../Scheduler/model/AssignmentModelCommunity.js';

/**
 * @module Calendar/model/AssignmentModel
 */

const TierBase = AssignmentModelCommunity;

/**
 * Calendar's tier-resolved assignment model: {@link Scheduler.model.AssignmentModelCommunity} on Community and
 * {@link Scheduler.model.AssignmentModelBusiness} on Business and Enterprise ([tiers](#Calendar/guides/data/tiers.md)).
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
