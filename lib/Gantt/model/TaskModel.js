// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import TaskModelCommunity from './TaskModelCommunity.js';

/**
 * @module Gantt/model/TaskModel
 */

const TierBase = TaskModelCommunity;

/**
 * Options for the `convertEmptyParentToLeaf` static property.
 * @typedef {Object} ConvertEmptyParentToLeafOptions
 * @property {Boolean} onLoad `true` to convert empty parent tasks to leaf tasks on load
 * @property {Boolean} onRemove `true` to convert parent tasks that become empty after removing a child to leaf tasks
 */

/**
 * This class represents a task in your Gantt project. Extend it to add your own custom task fields and methods.
 *
 * This is the tier-resolved model class — it is {@link Gantt.model.TaskModelCommunity} on the Community tier,
 * {@link Gantt.model.TaskModelBusiness} on Business and {@link Gantt.model.TaskModelEnterprise} on Enterprise.
 * Import this class and you get the right one for the tier you are running. Sections marked with a tier badge
 * describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Gantt/guides/data/tiers.md) guide for details.
 *
 * ## Subclassing the TaskModel class
 * To subclass the TaskModel and add extra {@link Core.data.Model#property-fields-static} and API methods, please see
 * the snippet below.
 *
 * ```javascript
 * class MyTaskModel extends TaskModel {
 *   static get fields() {
 *       return [
 *           { name: 'importantDate', type: 'date' }
 *       ]
 *   }
 * ```
 *
 * After creating your own Task model class, configure the {@link Gantt.model.ProjectModel#config-taskModelClass} on
 * Project to use it:
 *
 * ```javascript
 * new Gantt({
 *     project : {
 *         taskModelClass : MyTaskModel
 *     }
 * });
 * ```
 *
 * ## Creating a new Task programmatically
 *
 * To create a new task programmatically, simply call the TaskModel constructor and pass in any field values.
 *
 * ```javascript
 * const newTask = new TaskModel({
 *     name          : 'My awesome task',
 *     importantDate : new Date(2022, 0, 1),
 *     percentDone   : 80 // So awesome it's almost done
 *     // ...
 * });
 * ```
 *
 * ## Async scheduling <span class="badge tier tier-business">Business</span>
 *
 * A record created from an {@link Gantt/model/TaskModel} is normally part of a {@link Gantt/data/TaskStore}, which in
 * turn is part of a {@link Gantt/model/ProjectModel project}.
 * When dates or the duration of a task is changed, the project performs async calculations of the other related fields
 * (including the field of other tasks affected by the change).
 * For example if {@link #field-duration} is changed, it will recalculate {@link #field-endDate}.
 *
 * As a result of this being an async operation, the values of other fields are not guaranteed to be up to date
 * immediately after a change. To ensure data is up to date, `await` the calculations to finish.
 *
 * For example, `endDate` is not up to date after this operation:
 *
 * ```javascript
 * taskRecord.duration = 5;
 * // taskRecord.endDate not yet calculated
 * ```
 *
 * But if calculations are awaited it is up to date:
 *
 * ```javascript
 * taskRecord.duration = 5;
 * await taskRecord.project.commitAsync();
 * // endDate is calculated
 * ```
 *
 * In case of multiple changes no need to trigger recalculation after each of them:
 *
 * ```javascript
 * // change taskRecord1 start and duration
 * taskRecord1.startDate = '2021-11-15';
 * taskRecord1.duration = 5;
 * // change taskRecord2 duration
 * taskRecord2.duration = 1;
 * // change taskRecord3 finish date
 * taskRecord3.endDate = '2021-11-17';
 *
 * // now when all changes are done trigger rescheduling
 * await taskRecord.project.commitAsync();
 * ```
 *
 * ## Manually vs automatically scheduled tasks <span class="badge tier tier-business">Business</span>
 *
 * A task can be either **automatically** (default) or **manually** scheduled. This is defined by the
 * {@link #field-manuallyScheduled} field. Manually scheduled tasks are not affected by the automatic scheduling
 * process, which means their start/end dates are meant to be changed by user manually. Such tasks are not shifted
 * by their predecessors nor such summary tasks rollup their children start/end dates.
 * While automatically scheduled tasks start/end dates are calculated by the Gantt.
 *
 * ## Start and end dates <span class="badge tier tier-business">Business</span>
 *
 * For all tasks, the end date is non-inclusive: {@link #field-startDate} <= date < {@link #field-endDate}.
 * Example: a task which starts at 2020/07/18 and has 2 days duration, should have the end date: 2020/07/20, **not**
 * 2018/07/19 23:59:59.
 * The start and end dates of tasks in are *points* on the time axis and if you specify that a task starts
 * 01/01/2020 and has 1 day duration, that means the start point is 01/01/2020 00:00 and end point is 02/01/2020 00:00.
 *
 * ## Changing default field values
 *
 * Default values for fields can be changed without subclassing or redefining fields using
 * {@link Core.data.Model#function-applyDefaults-static}. This should be called before data is loaded into stores:
 *
 * ```javascript
 * // Change the default scheduling mode for all new tasks
 * TaskModel.applyDefaults({ schedulingMode : 'FixedDuration' });
 * ```
 *
 * ## Baselines <span class="badge tier tier-enterprise">Enterprise</span>
 *
 * On the Enterprise tier a task carries {@link Gantt.model.Baseline baselines}, snapshots of its planned dates and
 * effort that can be compared against the current schedule. See {@link Gantt.model.TaskModelEnterprise#field-baselines
 * baselines} and {@link Gantt.model.TaskModelEnterprise#function-getPlannedPercentDone getPlannedPercentDone}.
 *
 *
 * @tier-alias TaskModel
 * @extends Gantt/model/TaskModelCommunity
 */
export default class TaskModel extends TierBase {
    static $name = 'TaskModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
