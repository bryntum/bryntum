import Model from '../../Core/data/Model.js';
import PartOfProject from '../../Scheduler/data/mixin/PartOfProject.js';
import { CoreCalendarMixin } from '../../Engine/quark/model/scheduler_core/CoreCalendarMixin.js';
import CalendarIntervalModelCommunity from './CalendarIntervalModelCommunity.js';

/**
 * @module Gantt/model/CalendarModelCommunity
 */

/**
 * Community-tier Gantt calendar. Composed directly from the core engine mixin (`CoreCalendarMixin`) — Scheduler's
 * `CalendarModel` is Enterprise-tier, so we can't extend it here. Calendars are data only at this tier;
 * `GanttCoreProjectMixin` does not consult them for scheduling.
 *
 * @extends Core/data/Model
 * @tier community
 */
export default class CalendarModelCommunity extends PartOfProject(CoreCalendarMixin.derive(Model)) {
    static $name = 'CalendarModelCommunity';

    static get fields() {
        return [
            { name : 'name', type : 'string' },
            { name : 'intervals', persist : true },
            { name : 'unspecifiedTimeIsWorking', type : 'boolean', defaultValue : true }
        ];
    }

    static configurable = {
        intervalModelClass : CalendarIntervalModelCommunity
    };
}
