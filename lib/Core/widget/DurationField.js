import TextField from './TextField.js';
import DateHelper from '../helper/DateHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import Duration from '../data/Duration.js';

/**
 * @module Core/widget/DurationField
 */

/**
 * A text field for editing {@link Core.data.Duration} values, allowing the user to enter both a numeric magnitude
 * and a time unit (e.g. `'2d'`, `'4 hours'`). The field parses user input into a Duration object and displays
 * the value using configurable unit abbreviations. Use spin triggers to increment/decrement the value by the
 * configured {@link #config-step}. Restrict allowed units with {@link #config-allowedUnits} and enforce bounds with
 * {@link #config-min} and {@link #config-max}. This field can be used as a cell
 * {@link Grid.column.Column#config-editor} in a Grid and is the default editor for `DurationColumn`.
 *
 * {@inlineexample Core/widget/DurationField.js one-column}
 *
 * ```javascript
 * const durationField = new DurationField({
 *     label : 'Task duration',
 *     value : '3 days',
 *     min   : '1d',
 *     max   : '30d',
 *     appendTo : document.body
 * });
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config                          | Description                                           |
 * |---------------------------------|-------------------------------------------------------|
 * | {@link #config-value}           | Duration value as string, number, object, or Duration |
 * | {@link #config-unit}            | Default duration unit (`'day'`, `'hour'`, etc.)       |
 * | {@link #config-min}             | Minimum allowed duration (e.g. `'1d'`)                |
 * | {@link #config-max}             | Maximum allowed duration (e.g. `'10d'`)               |
 * | {@link #config-step}            | Step size for spin button clicks                      |
 * | {@link #config-allowedUnits}    | Comma-separated list of permitted units               |
 * | {@link #config-useAbbreviation} | Use short unit names (e.g. `'d'` instead of `'day'`)  |
 * | {@link #config-allowNegative}   | Allow negative duration values                        |
 *
 * ## See also
 *
 * - {@link Core.data.Duration} - The Duration value object returned by this field
 * - {@link Core.widget.TextField} - Base text field class
 * - {@link Core.helper.DateHelper} - Utility for parsing duration strings and unit names
 *
 * @extends Core/widget/TextField
 * @classtype durationfield
 * @classtypealias duration
 * @inputfield
 * @tier community
 */
export default class DurationField extends TextField {

    static $name = 'DurationField';

    static type = 'durationfield';

    static alias = 'duration';

    static configurable = {
        /**
         * The `value` may be set either in object form specifying two properties, a numerical `magnitude` and a
         * string `unit`:
         *
         * ```javascript
         * new DurationField({
         *    value : {
         *      magnitude : 1,
         *      unit      : 'day'
         *    }
         * });
         * ```
         *
         * Or as a string, that is parsed in accordance with current locale rules. The string is taken to be the
         * numeric magnitude, followed by whitespace, then an abbreviation, or name of the unit:
         *
         * ```javascript
         * new DurationField({
         *    value : '1 day'
         * });
         * ```
         *
         * If a Number is passed, the field's current unit is used and just the magnitude is changed.
         *
         * When the passed value includes a unit, that unit will override the {@link #config-unit} configured on the
         * field.
         *
         * Upon read, the value is always a {@link Core.data.Duration} object containing `magnitude` and `unit`.
         *
         * @prp {Core.data.Duration}
         * @accepts {String|Number|DurationConfig|Core.data.Duration}
         * @category Common
         */
        value : null,

        defaultUnit : 'day',

        /**
         * When set to `true` the field will use short names of unit durations
         * (as returned by {@link Core.helper.DateHelper#function-getShortNameOfUnit-static}) when creating the
         * input field's display value.
         * @config {Boolean}
         * @category Common
         */
        useAbbreviation : false,

        /**
         * Set to `true` to allow negative duration
         * @config {Boolean}
         * @category Common
         */
        allowNegative : false,

        /**
         * The number of decimal places to allow. Defaults to no constraint.
         * @config {Number}
         * @default
         * @category Common
         */
        decimalPrecision : null,

        /**
         * Widgets that trigger functionality upon click. Each trigger icon is a {@link Core.widget.Widget} instance
         * which may be hidden, shown and observed and styled just like any other widget.
         * @prp {Object<String,Core.widget.Widget>} triggers
         * @accepts {Object<String,FieldTriggerConfig|null>}
         * @property {FieldTriggerConfig} triggers.spin Shows up and down arrows to increase or decrease the field
         * value based on the {@link #config-step}
         * @property {FieldTriggerConfig} triggers.clear Clears the field value, only available if this field is
         * {@link #config-clearable}
         */
        triggers : {
            spin : {
                type : 'spintrigger'
            }
        },

        nullValue : null,

        /**
         * Get/set the min value (e.g. 1d)
         * @member {String} min
         * @category Common
         */
        /**
         * Minimum duration value (e.g. 1d)
         * @config {String}
         * @category Common
         */
        min : null,

        /**
         * Get/set the max value
         * @member {String} max (e.g. 10d)
         * @category Common
         */
        /**
         * Max duration value (e.g. 10d)
         * @config {String}
         * @category Common
         */
        max : null,

        /**
         * Get/set the allowed units, e.g. "day,hour,year".
         * @member {String} allowedUnits
         * @category Common
         */
        /**
         * Comma-separated list of units to allow in this field, e.g. "day,hour,year". Leave blank to allow all
         * valid units (the default)
         * @config {String}
         * @category Common
         */
        allowedUnits : null,

        /**
         * Step size for spin button clicks. The `step` property may be set in object form specifying two properties,
         * `magnitude`, a Number, and `unit`, a String.
         *
         * If a Number is passed, the step's current unit is used (or `day` if no current step set) and just the
         * magnitude is changed.
         *
         * If a String is passed, it is parsed by {@link Core.helper.DateHelper#function-parseDuration-static}, for
         * example `'1d'`, `'1 d'`, `'1 day'`, or `'1 day'`.
         * @config {DurationConfig|Number|String}
         * @default
         * @category Common
         */
        step : 1,

        /**
         * The duration unit to use with the current magnitude value.
         *
         * Note that setting a {@link #config-value} that includes a unit will override the configured unit.
         *
         * @prp {DurationUnit}
         * @category Common
         */
        unit : null,

        /**
         * The duration magnitude to use with the current unit value. Can be either an integer or a float value.
         * Both "," and "." are valid decimal separators.
         * @prp {Number}
         * @category Common
         */
        magnitude : null
    };

    /**
     * Fired when this field's value changes.
     * @event change
     * @param {Core.data.Duration} value - This field's value
     * @param {Core.data.Duration} oldValue - This field's previous value
     * @param {Boolean} valid - True if this field is in a valid state.
     * @param {Event} [event] - The triggering DOM event if any.
     * @param {Boolean} userAction - Triggered by user taking an action (`true`) or by setting a value (`false`)
     * @param {Core.widget.DurationField} source - This field
     */

    /**
     * User performed the default action (typed into this field or hit the triggers).
     * @event action
     * @param {Core.data.Duration} value - This field's value
     * @param {Core.data.Duration} oldValue - This field's previous value
     * @param {Boolean} valid - True if this field is in a valid state.
     * @param {Event} [event] - The triggering DOM event if any.
     * @param {Boolean} userAction - Triggered by user taking an action (`true`) or by setting a value (`false`)
     * @param {Core.widget.DurationField} source - This field
     */

    changeMin(value) {
        return typeof value === 'string' ? new Duration(value) : value;
    }

    changeMax(value) {
        return typeof value === 'string' ? new Duration(value) : value;
    }

    changeAllowedUnits(units) {
        if (typeof units === 'string') {
            units = units.split(',');
        }

        // Special case, defaultUnit not found in allowedUnits, redefine defaultUnit
        if (units.length > 0 && !units.includes(this.defaultUnit)) {
            this.defaultUnit = units[0];
        }

        return units;
    }

    updateAllowedUnits(units) {
        this.allowedUnitsRe = new RegExp(`^(${units.join('|')})$`, 'i');
    }

    get inputValue() {
        // Do not use the _value property. If called during configuration, this
        // will import the configured value from the config object.
        return this.value == null ? '' : this.calcValue(true).toString(this.useAbbreviation, this.decimalPrecision);
    }

    updateUnit() {
        this.clearError('L{invalidUnit}');
        super.value = this.calcValue();
    }

    updateMagnitude() {
        this.clearError('L{invalidUnit}');
        super.value = this.calcValue();
    }

    get unitWithDefault() {
        return this.unit || this.defaultUnit;
    }

    roundMagnitude(value) {
        return value && this.decimalPrecision != null ? ObjectHelper.round(value, this.decimalPrecision) : value;
    }

    get allowDecimals() {
        return this.decimalPrecision !== 0;
    }

    get isValid() {
        const
            me         = this,
            inputValue = me.input.value,
            value      = DateHelper.parseDuration(inputValue, me.allowDecimals, inputValue.match(/[\p{Letter}\p{Mark}]+/gui) ? undefined : me.unitWithDefault),
            isEmpty    = !inputValue || (value && value.magnitude == null);

        return me.skipValidation || super.isValid && ((isEmpty && !me.required) || !isEmpty && (me.allowNegative || value?.magnitude >= 0));
    }

    internalOnChange(event) {
        const
            me     = this,
            value  = me.value,
            oldVal = me._lastValue;

        if (me.hasChanged(oldVal, value)) {
            me._lastValue = value;
            me.triggerFieldChange({ value, event, userAction : true, valid : me.isValid });
        }
    }

    onFocusOut(e) {
        this.syncInputFieldValue(true);

        this.triggers?.spin?.clickRepeater?.cancel();

        return super.onFocusOut(e);
    }

    set value(value) {
        const me = this;
        let newMagnitude, newUnit;

        me.getConfig('allowedUnits');
        me.clearError('L{invalidUnit}');
        if (typeof value === 'number' || (typeof value === 'string' && value.length > 0 && !isNaN(value))) {
            // A number means preserving existing unit value
            newMagnitude = Number(value);
            newUnit      = me.unitWithDefault;
        }
        else if (typeof value === 'string') {
            if (/^\s*$/.test(value)) {
                // special case of "empty" (in user meaning) string - set to `null` to allow unscheduling of tasks
                newMagnitude = null;
            }
            else {
                // Parse as a string
                const parsedDuration = DateHelper.parseDuration(value, me.allowDecimals, me.unitWithDefault);

                if (parsedDuration) {
                    if (!me.allowedUnitsRe || me.allowedUnitsRe.test(parsedDuration.unit)) {
                        newUnit      = parsedDuration.unit;
                        newMagnitude = parsedDuration.magnitude;
                    }
                    else {
                        me.setError('L{invalidUnit}');
                    }
                }
            }
        }
        else {
            // Using value object with unit and magnitude
            if (value && 'unit' in value && 'magnitude' in value) {
                newUnit      = value.unit;
                newMagnitude = value.magnitude;
            }
            else {
                newUnit      = null;
                newMagnitude = null;
            }
        }

        if (me.magnitude !== newMagnitude || me.unit != newUnit) {
            me._magnitude = newMagnitude;

            // Once we have unit, do not clear it if setting clearing value
            if (newUnit) {
                me.unit = newUnit;
            }

            super.value = me.calcValue();
        }
    }

    okMax(value) {
        if (typeof value === 'number') {
            value = new Duration({
                unit      : this.unitWithDefault,
                magnitude : value
            });
        }
        return this.max == null || value <= this.max;
    }

    okMin(value) {
        if (typeof value === 'number') {
            value = new Duration({
                unit      : this.unitWithDefault,
                magnitude : value
            });
        }

        return this.min == null || value >= this.min;
    }

    get validity() {
        const
            value    = this.value,
            validity = {};

        // Assert range for non-empty fields, empty fields will turn invalid if `required: true`
        if (value != null) {
            validity.rangeUnderflow = !this.okMin(value);
            validity.rangeOverflow  = !this.okMax(value);
        }
        validity.valid = !validity.rangeUnderflow && !validity.rangeOverflow;

        return validity;
    }

    get value() {
        return super.value;
    }

    calcValue(round = false) {
        const
            me = this,
            { magnitude } = me;

        if ((!me.unit || magnitude == null) && me.clearable) {
            return null;
        }

        return new Duration(round ? me.roundMagnitude(magnitude) : magnitude, me.unitWithDefault);
    }

    hasChanged(oldValue, newValue) {
        return newValue && !oldValue ||
            !newValue && oldValue ||
            // if unit has changed or the values in MS is different
            newValue && oldValue && !(oldValue.unit === newValue.unit && oldValue.isEqual(newValue));
    }

    /**
     * The `milliseconds` property is a read-only property which returns the number of milliseconds in this field's
     * value
     * @member {Number} milliseconds
     * @readonly
     */
    get milliseconds() {
        // For reasons unknown documenting as @property did not work
        return this.value ? this.value.milliseconds : 0;
    }

    onInternalKeyDown(keyEvent) {
        const
            me = this,
            { _isUserAction } = me;

        me._isUserAction = true;

        if (keyEvent.key === 'ArrowUp') {
            me.doSpinUp();
        }
        else if (keyEvent.key === 'ArrowDown') {
            me.doSpinDown();
        }

        me._isUserAction = _isUserAction;
    }

    doSpinUp() {
        const me = this;

        let { value } = me;

        if (me.readOnly) {
            return;
        }

        if (ObjectHelper.isEmpty(value)) {
            value = new Duration({ magnitude : 0, unit : this.defaultUnit });
        }

        let newValue = value.add(this._step);

        if (!me.okMin(newValue)) {
            newValue = me.min;
        }

        if (me.okMax(newValue)) {
            me.value = newValue;
        }
    }

    doSpinDown() {
        const me = this;

        let { value } = me;

        if (me.readOnly) {
            return;
        }

        if (ObjectHelper.isEmpty(value)) {
            value = new Duration({ magnitude : 0, unit : this.defaultUnit });
        }

        let newValue = value.add({ magnitude : -this._step.magnitude, unit : this._step.unit });

        if (!me.okMax(newValue)) {
            newValue = me.max;
        }

        if (me.okMin(newValue) && (me.allowNegative || (me.magnitude || 0) > 0)) {
            me.value         = newValue;
        }
    }

    changeStep(value, was) {
        const type = typeof value;

        if (!value) {
            return null;
        }

        if (type === 'number') {
            value = {
                magnitude : Math.abs(value),
                unit      : undefined
            };
        }
        else if (type === 'string') {
            value = DateHelper.parseDuration(value);
        }

        if (value && value.unit && value.magnitude) {
            if (value.magnitude < 0) {
                value = {
                    magnitude : -value.magnitude,
                    unit      : value.unit
                };
            }
        }
        return value;
    }

    updateStep(value) {
        // If a step is configured, show the steppers
        this.toggleCls('b-no-steppers', value);

        this.syncInvalid();
    }
}

// Register this widget type with its Factory
DurationField.initClass();
