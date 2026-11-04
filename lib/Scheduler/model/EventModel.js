// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import EventModelCommunity from './EventModelCommunity.js';

/**
 * @module Scheduler/model/EventModel
 */

const TierBase = EventModelCommunity;

/**
 * This class represents a single event in your schedule, usually added to an {@link Scheduler.data.EventStore}.
 *
 * It is a subclass of {@link Scheduler.model.TimeSpan}, which is in turn a subclass of {@link Core.data.Model}.
 * Please refer to the documentation of that class to become familiar with the base interface of the event.
 *
 * This is the tier-resolved event class — it is {@link Scheduler.model.EventModelCommunity} on the Community tier,
 * {@link Scheduler.model.EventModelBusiness} on Business and {@link Scheduler.model.EventModelEnterprise} on
 * Enterprise. Import this class and you get the right one for the tier you are running. Sections below marked with a
 * tier badge describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Scheduler/guides/data/tiers.md) guide for details.
 *
 * ## Async date calculations
 *
 * A record created from an {@link Scheduler/model/EventModel} is normally part of an {@link Scheduler.data.EventStore},
 * which in turn is part of a project. When dates or the duration of an event is changed, the project performs async
 * calculations to normalize the other fields. For example if {@link #field-duration} is changed, it will calculate
 * {@link #field-endDate}.
 *
 * As a result of this being an async operation, the values of other fields are not guaranteed to be up to date
 * immediately after a change. To ensure data is up to date, await the calculations to finish.
 *
 * For example, {@link #field-endDate} is not up to date after this operation:
 *
 * ```javascript
 * eventRecord.duration = 5;
 * // endDate not yet calculated
 * ```
 *
 * But if calculations are awaited it is up to date:
 *
 * ```javascript
 * eventRecord.duration = 5;
 * await eventRecord.project.commitAsync();
 * // endDate is calculated
 * ```
 *
 * As an alternative, you can also use `setAsync()` to trigger calculations directly after the change:
 *
 * ```javascript
 * await eventRecord.setAsync({ duration : 5});
 * // endDate is calculated
 * ```
 *
 * ## Recurrence <span class="badge tier tier-business">Business</span>
 *
 * From the Business tier the event mixes {@link Scheduler/model/mixin/RecurringTimeSpan}, which provides recurrence
 * support. Using {@link Scheduler/model/mixin/RecurringTimeSpan#field-recurrenceRule} and
 * {@link Scheduler/model/mixin/RecurringTimeSpan#field-exceptionDates} you can express just about any recurrence
 * pattern. Below is the data for a repeating event happening every weekday at 10am.
 *
 * ```json
 * {
 *   "id"             : 1,
 *   "name"           : "Daily standup",
 *   "startDate"      : "2024-01-03 10:00",
 *   "duration"       : 1,
 *   "durationUnit"   : "hour",
 *   "recurrenceRule" : "FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR"
 * }
 * ```
 *
 * ## Scheduling engine <span class="badge tier tier-enterprise">Enterprise</span>
 *
 * On the Enterprise tier the event is backed by the scheduling engine. Dates are calculated rather than simply stored,
 * and the event gains scheduling fields such as {@link Scheduler.model.EventModelEnterprise#field-constraintType},
 * {@link Scheduler.model.EventModelEnterprise#field-effort} and {@link
 * Scheduler.model.EventModelEnterprise#field-percentDone}. Events can also be split into {@link
 * Scheduler.model.EventSegmentModel segments}, and linked by {@link Scheduler.model.DependencyModelEnterprise
 * dependencies} that reschedule dependent events when a predecessor moves.
 *
 * ## Subclassing the Event model class
 *
 * The Event model has a few predefined fields as seen below. If you want to add new fields or change the options for
 * the existing fields, you can do that by subclassing this class (see example below).
 *
 * ```javascript
 * class MyEvent extends EventModel {
 *
 *     static get fields() {
 *         return [
 *            // Add new field
 *            { name: 'myField', type : 'number', defaultValue : 0 }
 *         ];
 *     },
 *
 *     myCheckMethod() {
 *         return this.myField > 0
 *     },
 *
 *     ...
 * });
 * ```
 *
 * If you in your data want to use other names for the {@link #field-startDate}, {@link #field-endDate},
 * {@link #field-resourceId} and name fields you can configure them as seen below:
 *
 * ```javascript
 * class MyEvent extends EventModel {
 *
 *     static get fields() {
 *         return [
 *            { name: 'startDate', dataSource : 'taskStart' },
 *            { name: 'endDate', dataSource : 'taskEnd', format: 'YYYY-MM-DD' },
 *            { name: 'resourceId', dataSource : 'userId' },
 *            { name: 'name', dataSource : 'taskTitle' },
 *         ];
 *     },
 *     ...
 * });
 * ```
 *
 * Please refer to {@link Core.data.Model} for additional details.
 *
 * ## Changing default field values
 *
 * Default values for fields can be changed without subclassing or redefining fields using
 * {@link Core.data.Model#function-applyDefaults-static}. This should be called before data is loaded into stores:
 *
 * ```javascript
 * // Change the default duration unit for all new events
 * EventModel.applyDefaults({ durationUnit : 'week' });
 * ```
 *
 * ## See also
 *
 * - {@link Scheduler.data.EventStore} - Store for events
 * - {@link Scheduler.model.ResourceModel} - Resource data model
 * - {@link Scheduler.model.AssignmentModel} - Assignment data model
 * - {@link Scheduler.model.TimeSpan} - Base time span model
 *
 * @tier-alias EventModel
 * @extends Scheduler/model/EventModelCommunity
 */
export default class EventModel extends TierBase {
    static $name = 'EventModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
