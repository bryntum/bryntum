import DateHelper from '../../helper/DateHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import Fencible from '../../mixin/Fencible.js';
import DateField from '../DateField.js';

/**
 * @module Core/widget/mixin/AbstractDateRange
 */

/**
 * A mixin to manage a start and end {@link Core.widget.DateField} pair. This mixin is not intended to be used directly
 * but rather by {@link Core.widget.DateRangeField} and {@link Core.widget.DateRangePicker}.
 * @mixin
 */
export default Target => class AbstractDateRange extends Target.mixin(Fencible) {
    static $name = 'AbstractDateRange';

    static configurable = {
        /**
         * One or more format for parsing date values that don't match {@link #config-format}.
         * @member {String[]}
         * @default
         * @readonly
         * @internal
         */
        altFormats : ['YYYY-MM-DD'],

        /**
         * The default configuration for {@link #config-fieldStartDate} and {@link #config-fieldEndDate}.
         * @config {DateFieldConfig}
         */
        dateFieldDefaults : {
            type       : 'datefield',
            autoSelect : true,
            picker     : null,
            step       : '1d',

            internalListeners : {
                change : 'up.onDateFieldChange'
            },

            triggers : {
                expand : null,

                back : {
                    align  : 'end',
                    weight : 101
                }
            }
        },

        /**
         * The field for the end date.
         * @prp {DateField}
         * @accepts {DateFieldConfig}
         */
        fieldEndDate : {
            ref    : 'fieldEndDate',
            cls    : 'b-end-date',
            weight : 40
        },

        /**
         * The field for the start date.
         * @prp {DateField}
         * @accepts {DateFieldConfig}
         */
        fieldStartDate : {
            ref    : 'fieldStartDate',
            cls    : 'b-start-date',
            weight : 30,

            internalListeners : {
                focusIn  : 'up.onStartDateFocusIn',
                focusOut : 'up.onStartDateFocusOut'
            }
        },

        /**
         * Specifies which date fields ({@link #config-fieldStartDate} or {@link #config-fieldEndDate}) should display
         * their forward/backward date step triggers. See {@link Core.widget.DateField#config-stepTriggers}.
         * @config {Boolean|'both'|'end'|'start'}
         * @default false
         */
        dateStepTriggers : null,

        /**
         * Get / set format for date displayed in field (see {@link Core.helper.DateHelper#function-format-static}
         * for formatting options).
         * @member {String} format
         */
        /**
         * Format for date displayed in the {@link #config-fieldStartDate} and {@link #config-fieldEndDate}.
         * @config {String}
         * @default
         */
        format : 'ddd, MMM D',

        keyMap : {
            ArrowDown        : 'stepDown',
            ArrowUp          : 'stepUp',
            'Ctrl+ArrowDown' : 'stepDownLarge',
            'Ctrl+ArrowUp'   : 'stepUpLarge'
        },

        /**
         * This config is used to track when the focus is in the `fieldStartDate` widget. It is `true` in this case,
         * and `false` otherwise.
         * @readonly
         * @prp {Boolean}
         * @default false
         * @internal
         */
        pickingStartDate : null,

        stepLarge : '1 month',

        stepSmall : '7 days',

        /**
         * Set to `true` to first clear time of the field's value before comparing it to the min/max value
         * @config {Boolean}
         * @default
         * @internal
         */
        validateDateOnly : true,

        /**
         * The start and end of the range, as an array of two dates: `[startDate, endDate]`. Strings are
         * accepted and converted using the specified {@link #config-format}.
         * @member {Date[]} value
         * @accepts {String[]|Date[]}
         */
        /**
         * The start and end of the range, as an array of two dates: `[startDate, endDate]`. Strings are
         * accepted and converted using the specified {@link #config-format}.
         *
         * Documented as a config as well as a property because it is settable at construction time. Without
         * the config block the generated `…Config` type inherited `value?: string` from the base field,
         * which made the array this actually accepts fail to type-check.
         * @config {String[]|Date[]}
         * @default ["today", "today"]
         */
        value : {
            $config : {
                type    : 'date[]',
                formats : ['format', 'altFormats']
            }
        }
    };

    static fenced = {
        syncValue : true
    };

    static prototypeProperties = {
        _lastValue : null
    };

    // dateFieldDefaults

    get dateFieldDefaults() {
        return ObjectHelper.merge({
            format : this.format

        }, this._dateFieldDefaults);
    }

    // fieldEndDate

    configureDateField(config, existing, which) {
        const
            me = this,
            { dateStepTriggers } = me;

        return DateField.reconfigure(existing, config, {
            owner    : me,
            defaults : ObjectHelper.assign({
                stepTriggers : dateStepTriggers === true || dateStepTriggers === 'both' || dateStepTriggers === which
            }, me.dateFieldDefaults)
        });
    }

    changeFieldEndDate(config, existing) {
        return this.configureDateField(config, existing, 'end');
    }

    updateFieldEndDate(item) {
        if (item) {
            this.dateFieldContainer?.add(item);
            item._createdBy = this.dateFieldContainer;
        }
    }

    // fieldStartDate

    changeFieldStartDate(config, existing) {
        return this.configureDateField(config, existing, 'start');
    }

    updateFieldStartDate(item) {
        if (item) {
            this.dateFieldContainer?.add(item);
            item._createdBy = this.dateFieldContainer;
        }
    }

    // format

    updateFormat(format) {
        if (!this.isConstructing) {
            this.fieldEndDate.format = format;
            this.fieldStartDate.format = format;
        }
    }

    // pickingStartDate

    updatePickingStartDate(pickingStartDate) {
        this.toggleCls('b-picking-start-date', pickingStartDate);
    }

    // value

    updateValue(value, oldValue) {
        super.updateValue?.(value, oldValue);

        this.syncValue('value', value);
    }

    //---------------------------------------------------------------------------------------------------------

    stepDown(event) {
        this.adjustByKey(event, this.stepSmall);
    }

    stepUp(event) {
        this.adjustByKey(event, '-' + this.stepSmall);
    }

    stepDownLarge(event) {
        this.adjustByKey(event, this.stepLarge);
    }

    stepUpLarge(event) {
        this.adjustByKey(event, '-' + this.stepLarge);
    }

    /**
     * Adjusts the date range using the provided keyboard `event` based on the focused date field. If `fieldStartDate`
     * is focused, the start date is adjusted. If `fieldEndDate` is focused, the end date is adjusted. If neither field
     * is focused, the date range is not adjusted.
     * @param {Event} event The keyboard event
     * @param {String} step The amount to step
     * @internal
     */
    adjustByKey(event, step) {
        const
            me     = this,
            { _isUserAction } = me,
            { target } = event,
            fields = [me.fieldStartDate, me.fieldEndDate],
            index  = ((target === fields[0].input && 1) || (target === fields[1].input && 2) || 0) - 1,  // in (-1, 0, 1)
            field  = fields[index],  // index in (-1, 0, 1) ... field == null if index < 0
            value  = [fields[0].value, fields[1].value],
            empty  = value[0] == null || value[1] == null;

        value[index] = DateHelper.add(value[index] ?? me.defaultDate(index, value), step);
        value[1 - index] = value[1 - index] ?? value[index];

        if (value[1] < value[0]) {
            // we adjusted one end of the range and we're denormalized, so make the other end of the range the
            // same value
            value[1 - index] = value[index];
        }

        if (me.checkValid(value)) {
            me._isUserAction = true;

            if (empty) {
                me.value = value;
            }
            else {
                fields[0].value = value[0];
                fields[1].value = value[1];
            }

            me._isUserAction = _isUserAction;
        }

        field.selectAll();
        event.preventDefault();
    }

    /**
     * Checks the given `Date` or array of `Date`s to see if any are out of the allow min/max range. Returns 0 if all
     * dates are in range, -1 if a date is below the minimum, or 1 if a date is above the maximum.
     * @param {Date|Date[]} value One or more `Date` values to check.
     * @returns {Number}
     * @internal
     */
    checkMinMax(value = this.value) {
        const { maxDate, minDate, validateDateOnly } = this;

        let ret = 0,
            v, values;

        if (value && (minDate || maxDate)) {
            values = Array.isArray(value) ? value : [value];

            for (v of values) {
                v = validateDateOnly ? DateHelper.clearTime(v) : v;
                ret = (minDate && v < minDate) ? -1 : ((maxDate && v > maxDate) ? 1 : 0);

                if (ret) {
                    break;
                }
            }
        }

        return ret;
    }

    /**
     * Checks the given `Date` or array of `Date`s to see if any are out of the allow min/max range. Returns `true` if
     * all dates are in range, or `false` otherwise.
     * @param {Date|Date[]} value One or more `Date` values to check.
     * @returns {Boolean}
     * @internal
     */
    checkValid(value = this.value) {
        return !this.checkMinMax(value);
    }

    /**
     * Returns a date in the range of `minDate` and `maxDate`. This is called when a field's current value is `null`
     * and a default value is needed.
     * @param {Number} index Either 0 for `fieldStartDate` or 1 for `fieldEndDate`
     * @param {Date[]} values The current values of `fieldStartDate` and `fieldEndDate`
     * @returns {Date}
     * @internal
     */
    defaultDate(index, values) {
        const
            { minDate, maxDate } = this,
            today = DateHelper.clearTime(new Date());

        return (today < minDate || today > maxDate) ? minDate : today;
    }

    hasChanged(oldValue, newValue) {
        return !ObjectHelper.isEqual(oldValue, newValue);
    }

    onDateFieldChange({ source, userAction }) {
        const
            me = this,
            { fieldEndDate, fieldStartDate, _isUserAction } = me;

        me._isUserAction = userAction || _isUserAction;
        me.syncValue(source.ref, [fieldStartDate.value, fieldEndDate.value]);
        me._isUserAction = _isUserAction;
    }

    onStartDateFocusIn() {
        this.pickingStartDate = true;
    }

    onStartDateFocusOut(info) {
        this.pickingStartDate = false;
    }

    /**
     * Synchronizes the widget's state to a new `value`.
     * @param {'fieldEndDate'|'fieldStartDate'|'value'} origin The origin of the value change.
     * @param {Date[]} value
     * @internal
     */
    syncValue(origin, value = this.value) {
        const me = this;

        if (origin !== 'fieldEndDate') {
            me.fieldEndDate.value = value && value[1];  // not ?. since that yields undefined (we want null)
        }

        if (origin !== 'fieldStartDate') {
            me.fieldStartDate.value = value && value[0];  // not ?. since that yields undefined (we want null)
        }

        if (origin !== 'value') {
            me.value = value;
        }

        if (!me.isConstructing && me.hasChanged(me._lastValue, value) && me.checkValid(value)) {
            me.triggerChange();
        }

        me._lastValue = value;
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
