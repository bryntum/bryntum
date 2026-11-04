// Calendar caps Scheduler's aliases at Business (`consumerCaps` in scripts/types/grunt-types-tiers.js)
import EventModelCommunity from '../../Scheduler/model/EventModelCommunity.js';

/**
 * @module Calendar/model/EventModel
 */

const TierBase = EventModelCommunity;

/**
 * Calendar's tier-resolved event model: {@link Scheduler.model.EventModelCommunity} on Community and
 * {@link Scheduler.model.EventModelBusiness} on Business and Enterprise ([tiers](#Calendar/guides/data/tiers.md)).
 *
 * See {@link Scheduler.model.EventModel} for the full documentation.
 *
 * @tier-alias EventModel
 * @extends Scheduler/model/EventModelCommunity
 */
export default class EventModel extends TierBase {
    static $name = 'EventModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
