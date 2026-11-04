// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import CalendarModelCommunity from './CalendarModelCommunity.js';

/**
 * @module Gantt/model/CalendarModel
 */

const TierBase = CalendarModelCommunity;

/**
 * This class represents a calendar in the Gantt project. It contains a collection of the
 * {@link Gantt.model.CalendarIntervalModel}. Every interval can be either recurrent (regularly repeating in
 * time) or static.
 *
 * This is the tier-resolved class — it is {@link Gantt.model.CalendarModelCommunity} on the Community tier {@link
 * Gantt.model.CalendarModelBusiness} on Business and {@link Gantt.model.CalendarModelEnterprise} on Enterprise. Import
 * this class and you get the right one for the tier you are running. See the [Product tiers and class
 * names](#Gantt/guides/data/tiers.md) guide for details.
 *
 * Please refer to the [calendars guide](#Gantt/guides/basics/calendars.md) for details
 *
 * @tier-alias CalendarModel
 * @extends Gantt/model/CalendarModelCommunity
 * @class-alias Scheduler.model.CalendarModel -> Scheduler.model.SchedulerCalendarModel
 */
export default class CalendarModel extends TierBase {
    static $name = 'CalendarModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
