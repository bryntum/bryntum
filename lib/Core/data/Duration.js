import NumberFormat from '../helper/util/NumberFormat.js';
import DateHelper from '../helper/DateHelper.js';

/**
 * @module Core/data/Duration
 */

/**
 * Object describing a duration.
 * @typedef {Object} DurationConfig
 * @property {Number} magnitude The magnitude of the duration
 * @property {DurationUnit} unit The unit of the duration
 */

/**
 * An immutable-style value object representing a time duration. Each Duration has a numeric {@link #property-magnitude}
 * and a time {@link #property-unit} (e.g. `'hour'`, `'day'`, `'week'`). Durations can be constructed from explicit
 * values, from a shorthand string like `'2h'` or `'4d'`, or from a config object. They are used throughout the
 * Scheduler and Gantt products for task durations, lag values, and calendar intervals. Use {@link #function-isEqual}
 * to compare durations regardless of their unit, and {@link #property-milliseconds} to obtain a normalized value.
 *
 * ```javascript
 * // From magnitude and unit
 * const d1 = new Duration(5, 'day');
 *
 * // From shorthand string
 * const d2 = new Duration('2h');
 *
 * // From config object
 * const d3 = new Duration({ magnitude : 30, unit : 'minute' });
 *
 * // Static factory (returns null for null/undefined input)
 * const d4 = Duration.from('1w');
 *
 * // Compare durations
 * d1.isEqual(new Duration(5, 'day')); // true
 * ```
 *
 * ## Supported units
 *
 * `"millisecond"`, `"second"`, `"minute"`, `"hour"`, `"day"`, `"week"`, `"month"`, `"quarter"`, `"year"`
 *
 * ## Useful members
 *
 * | Member                                    | Description                                                             |
 * |-------------------------------------------|-------------------------------------------------------------------------|
 * | {@link #property-magnitude}               | The numeric magnitude of this duration                                  |
 * | {@link #property-unit}                    | The time unit (`'day'`, `'hour'`, etc.)                                 |
 * | {@link #property-milliseconds}            | Read-only total duration in milliseconds                                |
 * | {@link #function-isEqual isEqual(other)}  | Returns `true` if two durations represent the same span of time         |
 * | {@link #function-negate negate()}         | Returns a negated copy                                                  |
 * | {@link #function-from-static from(value)} | Static factory that converts strings, numbers, or objects to a Duration |
 *
 * ## See also
 *
 * - {@link Core.helper.DateHelper} - Date/time utility used for unit parsing and conversion
 */
export default class Duration {

    /**
     * Duration constructor.
     * @function constructor
     * @param {Number|String} magnitude Duration magnitude value or a duration + magnitude string ('2h', '4d')
     * @param {DurationUnit} [unit] Duration unit value
     * @category Lifecycle
     */
    constructor(magnitude, unit) {
        const me = this;
        // we treat `magnitude === null` specially, it indicates the user intention
        // to unschedule the task
        if (typeof magnitude === 'number' || magnitude === null) {
            me._magnitude = magnitude;
            me._unit = unit;
        }
        else if (typeof magnitude === 'string') {
            let duration = DateHelper.parseDuration(magnitude);
            if (!duration && unit) {
                const parsed = parseFloat(magnitude);
                if (!isNaN(parsed)) {
                    duration = { magnitude : parsed, unit };
                }
            }
            Object.assign(me, duration);
        }
        else if (typeof magnitude === 'object') {
            me.magnitude = magnitude.magnitude;
            me.unit = magnitude.unit;
        }
    }

    /**
     * Converts the passed parameter converted to a {@link Core.data.Duration} object if possible,
     * or `null` if `null` or `undefined` passed.
     * @param {Number|String|Object|Core.data.Duration} source The data to be converted into a Duration.
     * @returns {Core.data.Duration} The passed parameter converted to a {@link Core.data.Duration} object if possible,
     * or `null` if `null` or `undefined` passed.
     */
    static from(source) {
        return source == null ? null : source.isDuration ? source : new Duration(source);
    }

    /**
     * Returns a negated copy of this Duration.
     * @returns {Core.data.Duration} a negated copy of this Duration.
     */
    negate() {
        return new Duration(-this.magnitude, this.unit);
    }

    /**
     * Get/Set numeric magnitude `value`.
     * @member {Number}
     */
    get magnitude() {
        return this._magnitude;
    }

    set magnitude(value) {
        this._magnitude = (typeof value === 'number') && value;
    }

    /**
     * Get/set duration unit to use with the current magnitude value.
     * Valid values are:
     * - "millisecond" - Milliseconds
     * - "second" - Seconds
     * - "minute" - Minutes
     * - "hour" - Hours
     * - "day" - Days
     * - "week" - Weeks
     * - "month" - Months
     * - "quarter" - Quarters
     * - "year"- Years
     *
     * @member {DurationUnit}
     */
    get unit() {
        return this._unit;
    }

    set unit(value) {
        this._unit = DateHelper.parseTimeUnit(value);
    }

    get isValid() {
        return this._magnitude != null && Boolean(DateHelper.normalizeUnit(this._unit));
    }

    /**
     * The `milliseconds` property is a read only property which returns the number of milliseconds in this Duration
     * @member {Number}
     * @readonly
     */
    get milliseconds() {
        // There's no smaller time unit in the Date class than milliseconds, so round any divided values
        return this.isValid ? Math.round(DateHelper.asMilliseconds(this._magnitude, this._unit)) : 0;
    }

    /**
     * Returns truthy value if this Duration equals the passed value.
     * @param {Core.data.Duration} value
     * @returns {Boolean}
     */
    isEqual(value) {
        return Boolean(value) && this._magnitude != null && value._magnitude != null && this.milliseconds === value.milliseconds;
    }

    /**
     * Returns truthy value if this Duration strictly equals the passed value (both magnitude and unit must match).
     * @param {Core.data.Duration} value
     * @returns {Boolean}
     */
    isStrictlyEqual(value) {
        return Boolean(value) && this._magnitude != null && value._magnitude != null &&
            this._magnitude === value._magnitude && this._unit === value._unit;
    }

    /**
     * Returns a readable localized representation of this Duration (e.g. 5 days).
     * @param {Boolean} [useAbbreviation=false] Pass `true` to return an abbreviated version (e.g. 5d)
     * @param {Number} [nbrDecimals=10] The maximum number of decimals for comparison and displaying in the editor
     * @returns {String}
     */
    toString(useAbbreviation, nbrDecimals = 10) {
        const
            me             = this,
            abbreviationFn = useAbbreviation ? 'getShortNameOfUnit' : 'getLocalizedNameOfUnit',
            space          = useAbbreviation ? '' : ' ';

        return me.isValid ? `${NumberFormat.get('9.' + '#'.repeat(nbrDecimals)).format(me._magnitude)}${space}${DateHelper[abbreviationFn](me._unit, Math.abs(me._magnitude) !== 1)}` : '';
    }

    toJSON() {
        return this.toString();
    }

    valueOf() {
        return this.milliseconds;
    }

    /**
     * Returns a new Duration which is the sum of this Duration and the passed Duration. The returned Duration unit is the same as this Duration's unit.
     * @param {Core.data.Duration} otherDuration
     * @returns {Core.data.Duration}
     */
    add(otherDuration) {
        return new Duration({
            unit      : this.unit,
            magnitude : DateHelper.as(this.unit, this.milliseconds + new Duration({ magnitude : otherDuration.magnitude, unit : otherDuration.unit || this.unit }).milliseconds)
        });
    }

    /**
     * Returns a new Duration which is the difference between this Duration and the passed Duration. The returned Duration unit is the same as this Duration's unit.
     * @param {Core.data.Duration} otherDuration
     * @returns {Core.data.Duration}
     */
    diff(otherDuration) {
        return new Duration({
            unit      : this.unit,
            magnitude : DateHelper.as(this.unit, this.milliseconds - otherDuration.milliseconds)
        });
    }
}
