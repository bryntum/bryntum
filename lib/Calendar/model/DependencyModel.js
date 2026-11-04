// Calendar caps Scheduler's aliases at Business (`consumerCaps` in scripts/types/grunt-types-tiers.js)
import DependencyModelCommunity from '../../Scheduler/model/DependencyModelCommunity.js';

/**
 * @module Calendar/model/DependencyModel
 */

const TierBase = DependencyModelCommunity;

/**
 * Calendar's tier-resolved dependency model: {@link Scheduler.model.DependencyModelCommunity} on Community and
 * {@link Scheduler.model.DependencyModelBusiness} on Business and Enterprise ([tiers](#Calendar/guides/data/tiers.md)).
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
