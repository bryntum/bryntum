// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import CalendarIntervalModelCommunity from './CalendarIntervalModelCommunity.js';

/**
 * @module Gantt/model/CalendarIntervalModel
 */

const TierBase = CalendarIntervalModelCommunity;

/**
 * This class represents a calendar interval in the Gantt calendar. Every interval can be either recurrent
 * (regularly repeating in time) or static.
 *
 * This is the tier-resolved class — it is {@link Gantt.model.CalendarIntervalModelCommunity} on the Community tier
 * {@link Gantt.model.CalendarIntervalModelBusiness} on Business and {@link
 * Gantt.model.CalendarIntervalModelEnterprise} on Enterprise. Import this class and you get the right one for the tier
 * you are running. See the [Product tiers and class names](#Gantt/guides/data/tiers.md) guide for details.
 *
 * Please refer to the [calendars guide](#Gantt/guides/basics/calendars.md) for details
 *
 * @tier-alias CalendarIntervalModel
 * @extends Gantt/model/CalendarIntervalModelCommunity
 * @class-alias Scheduler.model.CalendarIntervalModel -> Scheduler.model.SchedulerCalendarIntervalModel
 */
export default class CalendarIntervalModel extends TierBase {
    static $name = 'CalendarIntervalModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
