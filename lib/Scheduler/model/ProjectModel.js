// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import ProjectModelCommunity from './ProjectModelCommunity.js';

/**
 * @module Scheduler/model/ProjectModel
 */

const TierBase = ProjectModelCommunity;

/**
 * Scheduler Project model class - a central place for all data.
 *
 * It holds and links the stores usually used by Scheduler:
 *
 * - {@link Scheduler/data/EventStore}
 * - {@link Scheduler/data/ResourceStore}
 * - {@link Scheduler/data/AssignmentStore}
 * - {@link Scheduler/data/DependencyStore}
 * - {@link Scheduler/data/CalendarManagerStore}
 * - {@link Scheduler/data/ResourceTimeRangeStore}
 * - {@link #config-timeRangeStore TimeRangeStore}
 *
 * The project uses a scheduling engine to calculate dates, durations and such. It is also responsible for
 * handling references between models, for example to link an event via an assignment to a resource. These operations
 * are asynchronous, a fact that is hidden when working in the Scheduler UI but which you must know about when
 * performing operations on the data level.
 *
 * When there is a change to data that requires something else to be recalculated, the project schedules a calculation
 * (a commit) which happens moments later. It is also possible to trigger these calculations directly. This flow
 * illustrates the process:
 *
 * 1. Something changes which requires the project to recalculate, for example adding a new task:
 *
 * ```javascript
 * const [event] = project.eventStore.add({ startDate, endDate });
 * ```
 *
 * 2. A recalculation is scheduled, thus:
 *
 * ```javascript
 * event.duration; // <- Not yet calculated
 * ```
 *
 * 3. Calculate now instead of waiting for the scheduled calculation
 *
 * ```javascript
 * await project.commitAsync();
 *
 * event.duration; // <- Now available
 * ```
 *
 * Please refer to [this guide](#Scheduler/guides/basics/project_data-enterprise.md) for more information.
 *
 * This is the tier-resolved model class — it is {@link Scheduler.model.ProjectModelCommunity} on the Community tier,
 * {@link Scheduler.model.ProjectModelBusiness} on Business and {@link Scheduler.model.ProjectModelEnterprise} on
 * Enterprise. Import this class and you get the right one for the tier you are running. Sections marked with a tier
 * badge describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Scheduler/guides/data/tiers.md) guide for details.
 *
 * ## Built-in CrudManager
 *
 * Scheduler's project has a {@link Scheduler/crud/AbstractCrudManagerMixin CrudManager} built-in. Using it is the recommended
 * way of syncing data between Scheduler and a backend. Example usage:
 *
 * ```javascript
 * const scheduler = new Scheduler({
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
 * scheduler.project.load()
 * ```
 *
 *  URLs may also be specified using shortcut configs:
 * ```javascript
 * const scheduler = new Scheduler({
 *     project : {
 *         loadUrl : 'php/load.php'
 *         syncUrl : 'php/sync.php'
 *     }
 * });
 *
 * scheduler.project.load()
 * ```
 *
 * For more information on CrudManager, see Schedulers docs on {@link Scheduler/data/CrudManager}.
 * For a detailed description of the protocol used by CrudManager, see the
 * [Crud manager guide](#Scheduler/guides/data/crud_manager_project.md)
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
 * const data = scheduler.project.inlineData;
 *
 * // use the data in your application
 * ```
 *
 * You can read the inline data by `console.log(scheduler.project.inlineData);`:
 *
 * ```json
 * {
 *     "calendars": [],
 *     "events": [
 *         {
 *             "id": 1,
 *             "startDate": "2020-03-23T07:00:00+05:00",
 *         },
 *         {
 *             "id": 2,
 *             "startDate": "2020-03-23T11:00:00+05:00",
 *         }
 *     ],
 *     "resources": [
 *         {
 *             "id": 1,
 *             "parentId": null,
 *             "name": "George",
 *             "eventColor": "blue",
 *         },
 *         {
 *             "id": 2,
 *             "parentId": null,
 *             "name": "Rob",
 *             "eventColor": "blue",
 *         }
 *     ],
 *     "assignments": [
 *         { id : 1, resource : 1, event : 1 },
 *         { id : 2, resource : 2, event : 1 },
 *         { id : 3, resource : 1, event : 2 },
 *     ],
 *     "dependencies": [
 *         {
 *             "id": 1,
 *             "type": 2,
 *             "cls": "",
 *             "lag": 0,
 *             "lagUnit": "day",
 *             "fromEvent": 1,
 *             "toEvent": 2,
 *             "active": true
 *         }
 *     ],
 *     "timeRanges": [],
 *     "resourceTimeRanges": [],
 *     "project": {
 *         "expanded": true,
 *         "hoursPerDay": 24,
 *         "daysPerWeek": 7
 *     }
 * }
 * ```
 *
 * {@note}The `xxData` properties are deprecated and will be removed in the future. Use `xx` instead. For
 * example `eventsData` is deprecated, use `events` instead. For now, both naming schemes are included in
 * the data object
 * {/@note}
 *
 * ### Setting data
 * ```javascript
 * // Get data from server manually
 * const data = await axios.get('/project?id=12345');
 *
 * // Feed it to the project
 * scheduler.project.inlineData = data;
 * ```
 *
 * It should have the following structure:
 *
 * ```javascript
 * scheduler.project.loadInlineData = {
 *   resources: [
 *     {
 *       id   : 1,
 *       name : 'George',
 *       type : 'Operators',
 *     },
 *     {
 *       id   : 2,
 *       name : 'Rob',
 *       type : 'Operators',
 *     },
 *     {
 *       id   : 3,
 *       name : 'Mike',
 *       type : 'Main'
 *     },
 *   ],
 *   events: [
 *     {
 *       id           : 1,
 *       name         : 'Meeting',
 *       startDate    : '2020-03-23T07:00',
 *       duration     : 4,
 *       durationUnit : 'hour',
 *       percentDone  : 100,
 *     },
 *     {
 *       id           : 2,
 *       startDate    : '2020-03-23T11:00',
 *       name         : 'Get parts',
 *       durationUnit : 'hour',
 *       duration     : 3,
 *       percentDone  : 40,
 *     },
 *   ],
 *   assignment : [
 *       { id : 1, resource : 1, event : 1 },
 *       { id : 2, resource : 2, event : 1 },
 *       { id : 3, resource : 2, event : 2 },
 *       { id : 4, resource : 3, event : 2 },
 *   ],
 *   dependencies: [
 *     {
 *       id        : 1,
 *       fromEvent : 1,
 *       toEvent   : 2
 *     },
 *   ],
 * };
 * ```
 *
 * You can also use `loadInlineData()` function:
 *
 * ```javascript
 * scheduler.project.loadInlineData({
 *    resources    : [],
 *    events       : [],
 *    dependencies : []
 * })
 * ```
 *
 * Either you can pass the response in this format directly:
 *
 * ``` javascript
 * {
 *      resource     : [],
 *      events       : [],
 *      dependencies : []
 * }
 * ```
 *
 * Or you can modify the response once received and pass it to the `loadInlineData()` function or assign it to
 * `inlineData`.
 *
 * See also {@link #function-loadInlineData}
 *
 * {@note}The `xxData` properties are deprecated and will be removed in the future. Use `xx` instead. For
 * example `eventsData` is deprecated, use `events` instead. For now, both naming schemes are included in
 * the data object
 * {/@note}
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
 *   events : {
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
 * const scheduler = new Scheduler({
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
 * ## Processing the data loaded from the server
 *
 * If you want to process the data received from the server after loading, you can use
 * the {@link #event-beforeLoadApply} or {@link #event-beforeSyncApply} events:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     project: {
 *         listeners : {
 *             beforeLoadApply({ response }) {
 *                 // do something with load-response object before data is fed to the stores
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
 * ## Useful configs <span class="badge tier tier-enterprise">Enterprise</span>
 *
 * | Config                                      | Description                           |
 * |---------------------------------------------|---------------------------------------|
 * | {@link #field-calendar}                     | The project calendar                  |
 * | {@link #field-hoursPerDay}                  | Hours per day for duration conversion |
 * | {@link #config-silenceInitialCommit}        | Silence propagation on data load      |
 * | {@link #config-maxCalendarRange}            | Max range for calendar iteration      |
 * | {@link #config-enableProgressNotifications} | Enable calculation progress events    |
 * | {@link #config-delayCalculation}            | Postpone calculations for early paint |
 *
 * ## See also
 *
 * - {@link Scheduler.data.EventStore} — Store holding event records
 * - {@link Scheduler.data.ResourceStore} — Store holding resource records
 * - {@link Scheduler.data.AssignmentStore} — Store holding assignment records
 * - {@link Scheduler.data.DependencyStore} — Store holding dependency records
 * - {@link Scheduler.view.Scheduler} — The Scheduler view that consumes this project
 *
 * @tier-alias ProjectModel
 * @extends Scheduler/model/ProjectModelCommunity
 */
export default class ProjectModel extends TierBase {
    static $name = 'ProjectModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
