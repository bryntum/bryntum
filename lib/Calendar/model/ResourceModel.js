// Calendar caps Scheduler's aliases at Business (`consumerCaps` in scripts/types/grunt-types-tiers.js)
import ResourceModelCommunity from '../../Scheduler/model/ResourceModelCommunity.js';

/**
 * @module Calendar/model/ResourceModel
 */

const TierBase = ResourceModelCommunity;

/**
 * Calendar's tier-resolved resource model: {@link Scheduler.model.ResourceModelCommunity} on Community and
 * {@link Scheduler.model.ResourceModelBusiness} on Business and Enterprise ([tiers](#Calendar/guides/data/tiers.md)).
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
