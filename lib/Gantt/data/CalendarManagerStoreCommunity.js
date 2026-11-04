import AjaxStore from '../../Core/data/AjaxStore.js';
import PartOfProject from '../../Scheduler/data/mixin/PartOfProject.js';
import { CoreCalendarManagerStoreMixin } from '../../Engine/quark/store/CoreCalendarManagerStoreMixin.js';
import CalendarModelCommunity from '../model/CalendarModelCommunity.js';

/**
 * @module Gantt/data/CalendarManagerStoreCommunity
 */

const EngineMixin = PartOfProject(CoreCalendarManagerStoreMixin.derive(AjaxStore));

/**
 * Community-tier Gantt calendar manager store. Composed directly from the core engine mixin
 * (`CoreCalendarManagerStoreMixin`) — Scheduler's `CalendarManagerStore` is Enterprise-tier (uses the chronograph
 * variant), so we can't extend it here. Calendars are data only at this tier; `GanttCoreProjectMixin` does not consult
 * them for scheduling.
 *
 * @extends Core/data/AjaxStore
 * @tier community
 */
export default class CalendarManagerStoreCommunity extends EngineMixin {
    static $name = 'CalendarManagerStoreCommunity';

    static configurable = {
        modelClass : CalendarModelCommunity
    };
}
