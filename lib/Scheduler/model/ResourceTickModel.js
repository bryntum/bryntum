import TimeSpan from './TimeSpan.js';

/**
 * @module Scheduler/model/ResourceTickModel
 */

/**
 * This class represents a named resource tick. It is used by the {@link Scheduler.feature.TickCells} feature.
 *
 * This class inherits most of its fields from {@link Scheduler.model.TimeSpan}. The most important of these fields are
 * the following:
 *
 * - {@link #field-startDate}    - start date of the tick in the ISO 8601 format
 * - {@link #field-endDate}      - end date of the tick in the ISO 8601 format (not inclusive)
 * - {@link #field-duration}     - duration, time between start date and end date
 * - {@link #field-durationUnit} - unit used to express the duration
 *
 * It's an indirect subclass of {@link Core.data.Model}. Please refer to documentation of those classes to become
 * familiar with the base interface of this class.
 * The data source of any field can be customized in the subclass. Please refer to {@link Core.data.Model} for details.
 *
 * ```javascript
 * const store = new ResourceTickStore({
 *     data : [{        {
 *         id             : 1,
 *         startDate      : '2019-01-01T11:00',
 *         value          : 2,
           resourceId     : 1,
           durationUnit   : 'day',
           duration       : 1
 *     }]
 * });
 * ```
 *
 * @extends Scheduler/model/TimeSpan
 * @internal
 */
export default class ResourceTickModel extends TimeSpan {
    static $name = 'ResourceTickModel';

    // Flag checked by rendering to distinguish from event records
    isTickCell = true;

    static fields = [
        /**
         * Id of the resource this tick is associated with
         * @field {String|Number} resourceId
         */
        'resourceId',

        /**
         * Value of the resource tick
         * @field {Object|Number} value
         */
        'value'
    ];

    // Used for faster lookup during rendering
    get indexKey() {
        return `${this.startDate.getTime()}-${this.resourceId}`;
    }

    async setValue(value) {
        this.value = value;
    }
}
