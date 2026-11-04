// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import CalendarManagerStoreCommunity from './CalendarManagerStoreCommunity.js';

/**
 * @module Gantt/data/CalendarManagerStore
 */

const TierBase = CalendarManagerStoreCommunity;

/**
 * A class representing the tree of calendars in the Gantt chart. An individual calendar is represented as an
 * instance of the {@link Gantt.model.CalendarModel} class. The store expects the data loaded to be
 * hierarchical. Each parent node should contain its children in a property called 'children'.
 *
 * This is the tier-resolved class — it is {@link Gantt.data.CalendarManagerStoreCommunity} on the Community tier
 * {@link Gantt.data.CalendarManagerStoreBusiness} on Business and {@link Gantt.data.CalendarManagerStoreEnterprise} on
 * Enterprise. Import this class and you get the right one for the tier you are running. See the [Product tiers and
 * class names](#Gantt/guides/data/tiers.md) guide for details.
 *
 * Please refer to the [calendars guide](#Gantt/guides/basics/calendars.md) for details
 *
 * @tier-alias CalendarManagerStore
 * @extends Gantt/data/CalendarManagerStoreCommunity
 * @class-alias Scheduler.data.CalendarManagerStore -> Scheduler.data.SchedulerCalendarManagerStore
 */
export default class CalendarManagerStore extends TierBase {
    static $name = 'CalendarManagerStore';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
