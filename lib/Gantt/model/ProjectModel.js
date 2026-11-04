// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import ProjectModelCommunity from './ProjectModelCommunity.js';

/**
 * @module Gantt/model/ProjectModel
 */

const TierBase = ProjectModelCommunity;

/**
 * This class represents a global project of your Project plan or Gantt - a central place for all data.
 *
 * It holds and links the stores used by Gantt:
 *
 * - {@link Gantt/data/TaskStore}
 * - {@link Gantt/data/ResourceStore}
 * - {@link Gantt/data/AssignmentStore}
 * - {@link Gantt/data/DependencyStore}
 * - {@link Gantt/data/CalendarManagerStore}
 * - {@link #config-timeRangeStore TimeRangeStore}
 *
 * The project has an internal scheduling engine to calculate dates, durations and such. It is also responsible for
 * handling references between models, for example to link a task to a resource (via an assignment). These operations
 * are asynchronous, a fact that is hidden when working in the Gantt UI but which you must know about when performing
 * data level operations.
 *
 * This is the tier-resolved model class — it is {@link Gantt.model.ProjectModelCommunity} on the Community tier,
 * {@link Gantt.model.ProjectModelBusiness} on Business and {@link Gantt.model.ProjectModelEnterprise} on Enterprise.
 * Import this class and you get the right one for the tier you are running. Sections marked with a tier badge
 * describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Gantt/guides/data/tiers.md) guide for details.
 *
 * ## Task Scheduling <span class="badge tier tier-business">Business</span>
 *
 * Without constraints in the dataset there is nothing pinning the tasks to their date, and they will be rescheduled as
 * soon as possible, i.e. at the project start date. To avoid this, simply set `autoSetConstraints` to `true` on the
 * ProjectModel config object. This ensures tasks remain on their specified start dates, providing a more accurate
 * project timeline.
 *
 * ```javascript
 * project : {
 *    autoSetConstraints : true
 * }
 * ```
 *
 * With that, if you use the following data, it will show the tasks at their **startDate**.
 *
 * ```json
 * [{
 *   "id"          : 1,
 *   "name"        : "Project Initiation",
 *   "percentDone" : 100,
 *   "duration"    : 5,
 *   "startDate"   : "2024-06-03"
 * },
 * {
 *   "id"          : 2,
 *   "name"        : "Requirements Gathering",
 *   "percentDone" : 80,
 *   "duration"    : 10,
 *   "startDate"   : "2024-06-10"
 * },
 * {
 *   "id"          : 3,
 *   "name"        : "Design Phase",
 *   "percentDone" : 60,
 *   "duration"    : 15,
 *   "startDate"   : "2024-06-24"
 * }]
 * ```
 *
 * More about this topic can be found in the [Gantt scheduling guide](#../engine/gantt_tasks_scheduling.md)
 *
 * To see it in action, check out the `auto constraints` [demo](../examples/auto-constraints/).
 *
 * When there is a change to data that requires something else to be recalculated, the project schedules a calculation
 * (a commit) which happens moments later. It is also possible to trigger these calculations directly. This flow
 * illustrates the process:
 *
 * 1. Something changes which requires the project to recalculate, for example adding a new task:
 *
 * ```javascript
 * const [task] = project.taskStore.add({ startDate, endDate });
 * ```
 *
 * 2. A recalculation is scheduled, thus:
 *
 * ```javascript
 * task.duration; // <- Not yet calculated
 * ```
 *
 * 3. Calculate now instead of waiting for the scheduled calculation
 *
 * ```javascript
 * await project.commitAsync();
 *
 * task.duration; // <- Now available
 * ```
 *
 * Please refer to [this guide](#Gantt/guides/data/project_data.md) for more information.
 *
 * ## Built-in CrudManager
 *
 * Gantt's project has a {@link Scheduler/crud/AbstractCrudManagerMixin CrudManager} built-in. Using it is the recommended way of
 * syncing data between Gantt and a backend. Example usage:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     project : {
 *         // Configure urls used by the built-in CrudManager
 *         transport : {
 *             load : {
 *                 url : 'php/load.php'
 *             },
 *             sync : {
 *                 url : 'php/sync.php'
 *             }
 *         }
 *     }
 * });
 *
 * // Load data from the backend
 * gantt.project.load()
 * ```
 *
 * URLs may also be specified using shortcut configs:
 * ```javascript
 * const gantt = new Gantt({
 *     project : {
 *         loadUrl : 'php/load.php'
 *         syncUrl : 'php/sync.php'
 *     }
 * });
 *
 * gantt.project.load()
 * ```
 *
 * For more information on CrudManager, see Schedulers docs on {@link Scheduler/data/CrudManager}.
 * For a detailed description of the protocol used by CrudManager, please see the
 * [Crud manager guide](#Gantt/guides/data/crud_manager_project.md)
 *
 * You can access the current Project data changes anytime using the {@link #property-changes} property.
 *
 * ## Working with inline data
 *
 * The project provides an {@link #property-inlineData} getter/setter that can
 * be used to manage data from all Project stores at once. Populating the stores this way can
 * be useful if you do not want to use the CrudManager for server communication but instead load data using Axios
 * or similar.
 *
 * ### Getting data
 * ```javascript
 * const data = gantt.project.inlineData;
 *
 * // use the data in your application
 * ```
 *
 * ### Setting data
 * ```javascript
 * // Get data from server manually
 * const data = await axios.get('/project?id=12345');
 *
 * // Feed it to the project
 * gantt.project.inlineData = data;
 * ```
 *
 * See also {@link #function-loadInlineData}
 *
 * ### Getting changed records
 *
 * You can access the changes in the current Project dataset anytime using the {@link #property-changes} property. It
 * returns an object with all changes:
 *
 * ```javascript
 * const changes = project.changes;
 *
 * console.log(changes);
 * ```
 *
 * The `changes` object has the following structure:
 *
 * ```javascript
 * {
 *   tasks : {
 *       updated : [{
 *           name : 'My task',
 *           id   : 12
 *       }]
 *   },
 *   assignments : {
 *       added : [{
 *           event      : 12,
 *           resource   : 7,
 *           units      : 100,
 *           $PhantomId : 'abc123'
 *       }]
 *     }
 * };
 * ```
 *
 * ## Monitoring data changes
 *
 * While it is possible to listen for data changes on the projects individual stores, it is sometimes more convenient
 * to have a centralized place to handle all data changes. By listening for the {@link #event-change change event} your
 * code gets notified when data in any of the stores changes. Useful for example to keep an external data model up to
 * date:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     project: {
 *         listeners : {
 *             change({ store, action, records }) {
 *                 const { $name } = store.constructor;
 *
 *                 if (action === 'add') {
 *                     externalDataModel.add($name, records);
 *                 }
 *
 *                 if (action === 'remove') {
 *                     externalDataModel.remove($name, records);
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ## Processing the data loaded from the server <span class="badge tier tier-business">Business</span>
 *
 * If you want to process the data received from the server after loading, you can use
 * the {@link #event-beforeLoadApply} or {@link #event-beforeSyncApply} events:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     project: {
 *         listeners : {
 *             beforeLoadApply({ response }) {
 *                 // do something with load-response object before it is provided to all the project stores
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ## Built-in StateTrackingManager <span class="badge tier tier-business">Business</span>
 *
 * The project also has a built-in {@link Core/data/stm/StateTrackingManager} (STM for short), that
 * handles undo/redo for the project stores (additional stores can also be added). By default, it is only used while
 * editing tasks using the task editor, the editor updates tasks live and uses STM to rollback changes if canceled. But
 * you can enable it to track all project store changes:
 *
 * ```javascript
 * // Enable automatic transaction creation and start recording
 * project.stm.autoRecord = true;
 * project.stm.enable();
 *
 * // Undo a transaction
 * project.stm.undo();
 *
 * // Redo
 * project.stm.redo();
 * ```
 *
 * Check out the `undoredo` demo to see it in action.
 *
 * ## Project revisions <span class="badge tier tier-enterprise">Enterprise</span>
 *
 * On the Enterprise tier the project tracks revisions, allowing changes to be reviewed and reverted. See the
 * [Revisions](#Gantt/guides/revisions/overview.md) guide.
 *
 *
 * @tier-alias ProjectModel
 * @extends Gantt/model/ProjectModelCommunity
 * @class-alias Scheduler.model.ProjectModel -> Scheduler.model.SchedulerProjectModel
 */
export default class ProjectModel extends TierBase {
    static $name = 'ProjectModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
