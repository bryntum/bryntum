import Model from '../../Core/data/Model.js';

/**
 * @module Gantt/model/CalendarIntervalModelCommunity
 */

/**
 * Community-tier Gantt calendar interval. Minimal stub that holds the data shape — Scheduler's `CalendarIntervalModel`
 * is Enterprise-tier (uses the `CalendarIntervalMixin` engine quark), and the community Gantt engine does not consult
 * calendars for scheduling, so we just declare the bare field set so data can be loaded round-trip without errors.
 *
 * @extends Core/data/Model
 * @tier community
 */
export default class CalendarIntervalModelCommunity extends Model {
    static $name = 'CalendarIntervalModelCommunity';

    static get fields() {
        return [
            { name : 'startDate', type : 'date' },
            { name : 'endDate', type : 'date' },
            { name : 'recurrentStartDate', type : 'string' },
            { name : 'recurrentEndDate', type : 'string' },
            { name : 'isWorking', type : 'boolean' },
            { name : 'priority', type : 'number' },
            { name : 'cls', type : 'string' },
            { name : 'name', type : 'string' }
        ];
    }
}
