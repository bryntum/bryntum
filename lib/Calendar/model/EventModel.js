// Calendar caps Scheduler's aliases at the Core tier (`consumerCaps` in scripts/types/grunt-types-tiers.js)
import EventModelCommunity from '../../Scheduler/model/EventModelCommunity.js';

/**
 * @module Calendar/model/EventModel
 */

const TierBase = EventModelCommunity;

/**
 * Calendar's tier-resolved event model: {@link Scheduler.model.EventModelCommunity} on Community and
 * {@link Scheduler.model.EventModelCore} on the Core and Enterprise [tiers](#Calendar/guides/data/tiers.md).
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

    // Localized header text for columns which EventList's column picker creates from these fields
    static fields = [
        { name : 'name', text : 'L{EventEdit.Name}' },
        { name : 'startDate', text : 'L{EventList.Start}' },
        { name : 'endDate', text : 'L{EventList.Finish}' },
        { name : 'allDay', text : 'L{Calendar.allDay}' },
        { name : 'readOnly', text : 'L{EventList.readOnly}' },
        { name : 'timeZone', text : 'L{EventList.timeZone}' },
        { name : 'fullDuration', text : 'L{EventList.fullDuration}' }
    ];
}
