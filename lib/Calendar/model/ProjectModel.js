import SchedulerProjectModel from './SchedulerProjectModel.js';
import EventModel from './EventModel.js';
import ResourceModel from './ResourceModel.js';
import AssignmentModel from './AssignmentModel.js';
import DependencyModel from './DependencyModel.js';
import EventStore from '../data/EventStore.js';
import ResourceStore from '../data/ResourceStore.js';
import AssignmentStore from '../data/AssignmentStore.js';
import DependencyStore from '../data/DependencyStore.js';


/**
 * @module Calendar/model/ProjectModel
 */

// noinspection JSClosureCompilerSyntax
/**
 * This class represents the global project for a Calendar, serving as the central data hub that holds references
 * to all stores used by the Calendar including the event store, resource store, and time range store. It extends
 * the Scheduler's ProjectModel to add Calendar-specific store types such as the
 * {@link Calendar.data.TimeRangeStore} and its associated {@link Calendar.model.TimeRangeModel}.
 *
 * For more information, see {@link Scheduler.model.ProjectModel}.
 *
 * ```javascript
 * const calendar = new Calendar({
 *     project : {
 *         eventStore : {
 *             data : [
 *                 { id : 1, name : 'Meeting', startDate : '2024-01-15 09:00', endDate : '2024-01-15 10:00' }
 *             ]
 *         },
 *         resourceStore : {
 *             data : [
 *                 { id : 1, name : 'Default Calendar', eventColor : 'b-blue' }
 *             ]
 *         },
 *         timeRangeStore : {
 *             data : [
 *                 { id : 1, name : 'Lunch', startDate : '2024-01-15 12:00', endDate : '2024-01-15 13:00' }
 *             ]
 *         }
 *     }
 * });
 * ```
 *
 * ## Working with inline data
 *
 * The project provides settable property {@link #property-inlineData} that can be used to get data from all its stores
 * at once and to set this data as well. Populating the stores this way can be useful if you cannot or you do not want
 * to use CrudManager for server requests but you pull the data by other means and have it ready outside of
 * ProjectModel. Also, the data from all stores is available in a single assignment statement.
 *
 * ### Getting data
 * ```javascript
 * const data = calendar.project.inlineData;
 *
 * // use the data in your application
 * ```
 *
 * ### Setting data
 * ```javascript
 * const data = // your function to pull server data
 *
 * calendar.project.inlineData = data;
 * ```
 *
 * ## See also
 *
 * - {@link Calendar.view.Calendar} — The Calendar that consumes this project
 * - {@link Calendar.data.TimeRangeStore} — The time range store managed by this project
 * - {@link Calendar.data.CrudManager} — CrudManager for server-side data synchronization
 *
 * @extends Calendar/model/SchedulerProjectModel
 */
export default class ProjectModel extends SchedulerProjectModel {
    static $name = 'ProjectModel';

    //region Configs



    static defaultConfig = {
        eventModelClass      : EventModel,
        resourceModelClass   : ResourceModel,
        assignmentModelClass : AssignmentModel,
        dependencyModelClass : DependencyModel,
        eventStoreClass      : EventStore,
        resourceStoreClass   : ResourceStore,
        assignmentStoreClass : AssignmentStore,
        dependencyStoreClass : DependencyStore,


    };

    //endregion

}

ProjectModel.applyConfigs = true;

ProjectModel.initClass();
