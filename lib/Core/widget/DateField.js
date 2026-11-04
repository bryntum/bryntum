import PickerField from './PickerField.js';
import DatePicker from './DatePicker.js';
import DateHelper from '../helper/DateHelper.js';
import DomHelper from '../helper/DomHelper.js';
import TimeZonable from '../mixin/TimeZonable.js';

DomHelper.loadStylesheet('Core/widget/DateField.css');

// import Stylesheet from './DateField.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'DateField');

const
    TODAY   = new Date(),
    ONE_DAY = Object.freeze({ magnitude : 1, unit : 'day' });

/**
 * @module Core/widget/DateField
 */

/**
 * A Date field widget consisting of a date input field + a {@link Core/widget/DatePicker date picker}.
 *
 * {@inlineexample Core/widget/DateField.js}
 *
 * It can be configured to allow user typing dates, or to only allow selection from the date picker
 * (see {@link #config-editable}). It can also validate that the date is within a specified range
 * (see {@link #config-min} -> {@link #config-max}). It also optionally show step triggers to increment or decrement the
 * date (see {@link #config-step} & {@link #config-stepTriggers}):
 *
 * {@inlineexample Core/widget/DateFieldBasics.js}
 *
 * This field can be used as an {@link Grid.column.Column#config-editor} for a grid {@link Grid.column.Column column}.
 * It is used as the default editor for the {@link Grid.column.DateColumn} class.
 *
 * ```javascript
 * // minimal DateField config with date format specified
 * const dateField = new DateField({
 *   format: 'YYMMDD'
 * });
 * ```
 *
 * ## Accessibility
 *
 * This widget can be operated using the keyboard. When the field is focused, <kbd>ArrowDown</kbd> opens the date picker,
 * which itself is keyboard navigable. <kbd>Shift</kbd>+<kbd>ArrowDown</kbd> activates the {@link #config-step} back trigger.
 * <kbd>Shift</kbd>+<kbd>ArrowUp</kbd> activates the {@link #config-step} forwards trigger. When no
 * {@link #config-step} is configured, these two gestures step the value by one day. Set
 * {@link #config-stepTriggers} to `false` to remove the step triggers and this pair of gestures.
 *
 * @extends Core/widget/PickerField
 * @classtype datefield
 * @classtypealias date
 * @inputfield
 */
export default class DateField extends TimeZonable(PickerField) {

    //region Config

    static $name = 'DateField';

    static type = 'datefield';

    static alias = 'date';

    static configurable = {
        /**
         * Get / set format for date displayed in field (see {@link Core.helper.DateHelper#function-format-static}
         * for formatting options).
         * @member {String} format
         */
        /**
         * Format for date displayed in field. Defaults to using long date format, as defined by current locale (`L`)
         * @config {String}
         * @default
         */
        format : 'L',

        /**
         * A flag which indicates whether the date parsing should be strict - meaning if the date
         * is missing a year/month/day part - parsing fails.
         *
         * Turned off by default, meaning default values are substituted for missing parts.
         *
         * @config {Boolean}
         * @default
         */
        strictParsing : false,

        // same for all languages
        fallbackFormat : 'YYYY-MM-DD',
        timeFormat     : 'HH:mm:ss:SSS',

        /**
         * A flag which indicates what time should be used for selected date.
         * `false` by default which means time is reset to midnight.
         *
         * Possible options are:
         * - `false` to reset time to midnight
         * - `true` to keep original time value
         * - `'17:00'` a string which is parsed automatically
         * - `new Date(2020, 0, 1, 17)` a date object to copy time from
         * - `'entered'` to keep time value entered by user (in case {@link #config-format} includes time info)
         *
         * @config {Boolean|Date|String}
         * @default
         */
        keepTime : false,

        /**
         * Format for date in the {@link #config-picker}. Uses localized format per default
         * @config {String}
         */
        pickerFormat : null,

        /**
         * Set to `true` to first clear time of the field's value before comparing it to the max value
         * @internal
         * @config {Boolean}
         */
        validateDateOnly : null,

        /**
         * Widgets that trigger functionality upon click. Each trigger icon is a {@link Core.widget.Widget} instance
         * which may be hidden, shown and observed and styled just like any other widget.
         * @prp {Object<String,Core.widget.Widget>} triggers
         * @property {FieldTriggerConfig} triggers.expand Expands the date picker to select a date
         * @property {FieldTriggerConfig} triggers.back Subtracts the {@link #config-step} from the current date
         * @property {FieldTriggerConfig} triggers.forward Adds the {@link #config-step} to the current date
         * @property {FieldTriggerConfig} triggers.clear Clears the field value, only available if this field is
         * {@link #config-clearable}
         * @accepts {Object<String,FieldTriggerConfig|null>}
         */
        triggers : {
            expand : {
                cls     : 'b-icon-calendar',
                handler : 'onTriggerClick',
                weight  : 200
            },

            back : {
                cls     : 'b-icon b-icon-previous b-step-trigger b-step-trigger-back',
                key     : 'Shift+ArrowDown',
                handler : 'onBackClick',
                align   : 'start',
                weight  : 100
            },

            forward : {
                cls     : 'b-icon b-icon-next b-step-trigger b-step-trigger-forward',
                key     : 'Shift+ArrowUp',
                handler : 'onForwardClick',
                align   : 'end',
                weight  : 100
            }
        },

        // An optional extra CSS class to add to the picker container element
        calendarContainerCls : '',

        /**
         * Get/set min value, which can be a Date or a string. If a string is specified, it will be converted using
         * the specified {@link #config-format}.
         * @member {Date} min
         * @accepts {String|Date}
         */
        /**
         * Min value
         * @config {String|Date}
         */
        min : {
            $config : {
                equal : 'date'
            },
            value : null
        },

        /**
         * Get/set max value, which can be a Date or a string. If a string is specified, it will be converted using
         * the specified {@link #config-format}.
         * @member {Date} max
         * @accepts {String|Date}
         */
        /**
         * Max value
         * @config {String|Date}
         */
        max : {
            $config : {
                equal : 'date'
            },
            value : null
        },

        /**
         * The `step` property may be set in object form specifying two properties, `magnitude`, a Number, and
         * `unit`, a String.
         *
         * If a Number is passed, the step's current unit is used (or `day` if no current step set) and just the
         * magnitude is changed.
         *
         * If a String is passed, it is parsed by {@link Core.helper.DateHelper#function-parseDuration-static}, for
         * example `'1d'`, `'1 d'`, `'1 day'`, or `'1 day'`.
         *
         * Upon read, the value is always returned in object form containing `magnitude` and `unit`.
         * @member {DurationConfig} step
         * @accepts {String|Number|DurationConfig}
         */
        /**
         * Time increment duration value. If specified, `forward` and `back` triggers are displayed.
         * The value is taken to be a string consisting of the numeric magnitude and the units.
         * The units may be a recognised unit abbreviation of this locale or the full local unit name.
         * For example `'1d'` or `'1w'` or `'1 week'`. This may be specified as an object containing
         * two properties: `magnitude`, a Number, and `unit`, a String
         *
         * When not specified, the step triggers stay hidden, but the <kbd>Shift</kbd>+<kbd>ArrowUp</kbd> and
         * <kbd>Shift</kbd>+<kbd>ArrowDown</kbd> trigger gestures still step the value by one day. No other key
         * steps the value unless a `step` is configured.
         * @config {String|Number|DurationConfig}
         */
        step : false,

        /**
         * Set to `false` to remove the forward and backward date step triggers along with their
         * <kbd>Shift</kbd>+<kbd>ArrowUp</kbd> and <kbd>Shift</kbd>+<kbd>ArrowDown</kbd> gestures. The triggers are
         * only shown when {@link #config-step} is set.
         * @config {Boolean}
         * @default true
         */
        stepTriggers : {
            $config : null,
            default : true
        },

        /**
         * The week start day in the {@link #config-picker}, 0 meaning Sunday, 6 meaning Saturday.
         * Uses localized value per default.
         * @config {Number}
         */
        weekStartDay : null,

        /**
         * A config object used to configure the {@link Core.widget.DatePicker datePicker}.
         * ```javascript
         * dateField = new DateField({
         *     picker : {
         *         tbar : {
         *             items : {
         *                 // Remove the prev year and next year buttons by setting them to null.
         *                 // Move the prev month button to just before the next month button by increasing its weight
         *                 prevYear  : null,
         *                 nextYear  : null,
         *                 prevMonth : {
         *                     weight : 390
         *                 }
         *             }
         *         }
         *     }
         * ```
         *
         * Configure as `null` to have no picker, for example for a field whose value is driven by some other UI.
         * The {@link #config-triggers expand trigger} would then do nothing, so remove it too:
         *
         * ```javascript
         * {
         *     type     : 'datefield',
         *     picker   : null,
         *     triggers : {
         *         expand : null
         *     }
         * }
         * ```
         * @config {DatePickerConfig|null}
         */
        picker : {
            type         : 'datepicker',
            floating     : true,
            scrollAction : 'realign',
            align        : {
                align    : 't0-b0',
                axisLock : true
            }
        },

        /**
         * Get/set value, which can be set as a Date or a string but always returns a Date. If a string is
         * specified, it will be converted using the specified {@link #config-format}
         * @member {Date} value
         * @accepts {String|Date}
         */
        /**
         * Value, which can be a Date or a string. If a string is specified, it will be converted using the
         * specified {@link #config-format}
         * @config {String|Date}
         */
        value : {
            $config : {
                equal : 'date'
            },
            value : null
        },

        role : 'combobox',

        transition : {
            expandCollapse : true
        },

        /**
         * A reference to a partner TimeField which this DateField should sync its value with.
         * When the TimeField's value is changed, this DateField's value is updated to match.
         * When this DateField's value is changed, the TimeField's value is updated to match.
         *
         * When a string is passed, this is taken to be the widget's {@link Core.widget.Widget#config-ref reference}
         * property and the actual TimeField is looked up in the same {@link Core.widget.Widget#config-owner owner}
         * container as this TimeField. If the reference cannot be found there, the string is used as a widget `id`.
         * @prp {String|Core.widget.TimeField}
         */
        partner : {
            $config : 'lazy',
            value   : null
        },

        testConfig : {
            transition : {
                expandCollapse : false
            }
        }
    };

    //endregion

    //region Events

    /**
     * Fired when this field's value changes.
     * @event change
     * @param {Core.widget.DateField} source - This DateField
     * @param {Date} value - This field's value
     * @param {Date} oldValue - This field's previous value
     * @param {Boolean} valid - True if this field is in a valid state
     * @param {Event} event - The triggering DOM event if any
     * @param {Boolean} userAction - Triggered by user taking an action (`true`) or by setting a value (`false`)
     *
     * @ts-param checked {Boolean} // Used for compatibility with Checkbox event
     */

    //endregion

    //region Init & destroy

    changePartner(partner) {
        if (!partner.isTimeField) {
            partner = this.owner.widgetMap[partner] || bryntum.get(partner);
        }
        return partner;
    }

    syncPartner() {
        const
            me          = this,
            { partner } = me;

        if (partner && (!partner.value || partner.value - me.value)) {
            partner._isUserAction = me._isUserAction || me.inputting;
            if (me.value) {
                partner.value = me.value;
            }
            else {
                partner.clear();
            }
            partner._isUserAction = false;
        }
    }

    onInternalPaint(...args) {
        super.onInternalPaint(...args);

        // Ingest lazy partner config and ensure that the partnership is mutual.
        if (this.partner) {
            this.partner.partner = this;
        }
    }

    // If we are partnered with a DateField to maintain a full DateTime value,
    // we do not strip out the time part of our value.
    get keepTime() {
        return this.hasConfig('partner') ? true : this._keepTime;
    }

    // If we are partnered with a DateField to maintain a full DateTime value,
    // we do not strip out the date part of our value.
    get validateDateOnly() {
        return this.hasConfig('partner') ? false : this._validateDateOnly;
    }

    /**
     * Creates default picker widget
     *
     * @internal
     */
    changePicker(picker, oldPicker) {
        if (picker?.isDatePicker) {
            return picker;
        }
        const
            me     = this,
            config = DatePicker.mergeConfigs({
                owner        : me,
                forElement   : me.pickerAlignElement,
                minDate      : me.dateToPickerDate(me.min),
                maxDate      : me.dateToPickerDate(me.max),
                weekStartDay : me._weekStartDay, // need to pass the raw value to let the component to use its default value

                align : {
                    anchor : me.overlayAnchor,
                    target : me.pickerAlignElement
                },

                internalListeners : {
                    selectionChange : 'onPickerSelectionChange',
                    thisObj         : me
                }
            }, picker);

        if (me.calendarContainerCls) {
            config.cls = me.calendarContainerCls;
        }

        // If we are in cleared state, the picker will also have no value.
        // But have it focused on today as a default.
        if (me.value) {
            config[me.isValid ? 'value' : 'activeDate'] = me.dateToPickerDate(me.value);
        }
        else if (!config.activeDate) {
            config.activeDate = me.dateToPickerDate(new Date());
        }

        const result = DatePicker.reconfigure(oldPicker, picker ? config : null, me);

        // Cells must exist early
        result?.refresh?.flush();

        return result;
    }

    //endregion

    //region Click listeners

    onPickerSelectionChange({ selection, source : picker }) {
        // We only care about what DatePicker does if it has been opened
        if (picker.isVisible) {
            const me = this;

            let newValue = null;

            if (selection.length) {
                newValue = me.dateFromPickerDate(selection[0]);

                if (me.value) {
                    newValue = me.dateHelper.copyTimeValues(newValue, me.value);
                }
            }

            me._isUserAction = me._isPickerInput = true;
            me.value = me.dateHelper.clamp(newValue, me.min, me.max);
            me._isPickerInput = me._isUserAction = false;
            picker.hide();
        }
    }

    /**
     * The step to apply when stepping the value, defaulting to one day when no {@link #config-step} is configured.
     * Read this rather than `step` when overriding `getStepDate`, so the default is applied consistently.
     * @member {DurationConfig} stepValue
     * @readonly
     * @internal
     */
    get stepValue() {
        return this.step || ONE_DAY;
    }

    getStepDate(direction) {
        const { stepValue } = this;

        return this.dateHelper.add(this.value, (direction || 1) * stepValue.magnitude, stepValue.unit);
    }

    stepDate(direction, userAction = true) {
        const me = this;

        if (!me.readOnly && me.value) {
            const newValue = me.getStepDate(direction);

            if (!me.checkMinMax(newValue)) {
                if (userAction) {
                    me._isUserAction = true;
                    me.value = newValue;
                    me.autoSelect && me.select();
                    me._isUserAction = false;
                }
                else {
                    me.value = newValue;
                }
            }
        }
    }

    onBackClick() {
        this.stepDate(-1);
    }

    onForwardClick() {
        this.stepDate(1);
    }

    //endregion

    //region Toggle picker

    showPicker(focusPicker) {
        if (this.readOnly) {
            return;
        }

        const
            me          = this,
            { _picker } = me;

        // If it's already instanced, navigate it to our date, or default of today.
        // It will be initialized correctly if not.
        if (_picker) {
            // In case a subclass uses a min getter (which does not update our min value) - ensure picker is correctly
            // configured. Dates are translated by day label into the picker's machine-local frame (see dateToPickerDate).
            const pickerConfig = {
                minDate : me.dateToPickerDate(me.min),
                maxDate : me.dateToPickerDate(me.max)
            };

            if (me.value) {
                pickerConfig[me.isValid ? 'value' : 'activeDate'] = me.dateToPickerDate(me.value);
            }
            // If the field is cleared, show today's Calendar in the picker
            // unless it's already been navigated elsewhere.
            else if (!_picker.activeDate) {
                pickerConfig.activeDate = me.dateToPickerDate(new Date());
            }

            // Config dependencies are correctly processed by setConfig
            _picker.setConfig(pickerConfig);
        }

        super.showPicker(focusPicker);
    }

    focusPicker() {
        this.picker?.focus();
    }

    /**
     * Converts a date in this field's (possibly timezone-aware) day frame to a machine-local `Date` carrying the same
     * `YYYY-MM-DD` day label. The {@link Core.widget.DatePicker} is a machine-local wall-clock widget, so dates
     * crossing that boundary are translated by day **label**, not by instant.
     * @param {Date} date A date in this field's day frame
     * @param {Boolean} [reverse] Pass `true` to convert a machine-local picker date back into this field's day frame
     * @returns {Date} The same day label as a midnight in the target frame
     * @internal
     */
    dateToPickerDate(date, reverse) {
        const { dateHelper } = this;

        // No timezone active — both sides already share the machine-local frame
        if (!date || dateHelper === DateHelper) {
            return date;
        }

        // The static DateHelper represents the DatePicker's (machine-local) frame. Reading the day label in *our*
        // frame and re-materializing it in the picker's frame (or vice-versa) preserves the calendar day across the
        // boundary instead of shifting it by the inter-zone offset.
        return reverse ? dateHelper.parseKey(DateHelper.makeKey(date)) : DateHelper.parseKey(dateHelper.makeKey(date));
    }

    /**
     * The reverse of {@link #function-dateToPickerDate}: converts a machine-local `Date` from the picker back into this
     * field's (possibly timezone-aware) day frame, preserving the `YYYY-MM-DD` day label.
     * @param {Date} date A machine-local picker date
     * @returns {Date} The same day label as a midnight in this field's day frame
     * @internal
     */
    dateFromPickerDate(date) {
        return this.dateToPickerDate(date, true);
    }

    //endregion

    // region Validation

    checkMinMax(value) {
        const { min, max } = this;

        return (min && value < min) ? -1 : ((max && value > max) ? 1 : 0);
    }

    get isValid() {
        const
            me = this,
            dh = me.dateHelper;

        me.clearError('L{Field.minimumValueViolation}', true);
        me.clearError('L{Field.maximumValueViolation}', true);

        let { value } = me;

        if (value) {
            let { min, max, validateDateOnly } = me;

            // Validation of the date should only care about the date part
            if (validateDateOnly) {
                value = dh.clearTime(value, false);
                if (min) {
                    min = dh.clearTime(min, false);
                }
                if (max) {
                    max = dh.clearTime(max, false);
                }
            }

            if (min && value < min) {
                me.setError('L{Field.minimumValueViolation}', true);
                return false;
            }

            if (max && value > max) {
                me.setError('L{Field.maximumValueViolation}', true);
                return false;
            }
        }

        return super.isValid;
    }

    //endregion

    //region Getters/setters
    transformDateValue(value, checkBounds = true) {
        const
            me = this,
            dh = me.dateHelper;

        if (value != null) {
            if (!dh.isDate(value)) {
                if (typeof value === 'string') {
                    // If date cannot be parsed with set format, try fallback - the more general one
                    value = dh.parse(value, me.format, me.strictParsing) || dh.parse(value, me.fallbackFormat, me.strictParsing);
                }
                else {
                    value = new Date(value);
                }
            }

            // We insist on a *valid* Date as the value
            if (dh.isValidDate(value)) {
                if (checkBounds && (!me.min || (value - me.min > -dh.MS_PER_DAY)) && (!me.max || value <= me.max)) {
                    return me.transformTimeValue(value);
                }

                return value;
            }
        }
        return null;
    }

    isTimeValue(value) {
        // We can't use existing DateHelper.parse(keepTime, me.timeFormat, true) to check
        // if keepTime has time value like "12:15" since its "strict" argument
        // is not flexible enough. It doesn't allow to skip seconds for example.
        // So we have to enumerate all non-time keepTime options here.
        return value && value !== true && value !== 'entered';
    }

    transformTimeValue(value) {
        const
            me                            = this,
            { keepTime, dateHelper : dh } = me;

        value = dh.clone(value);

        // keepTime is false - reset time info
        if (!keepTime) {
            dh.clearTime(value, false);
        }
        // if keepTime provides time info (like "12:15" or a Date instance)
        else if (me.isTimeValue(keepTime)) {
            const timeValue = dh.parse(keepTime, me.timeFormat);

            dh.copyTimeValues(value, timeValue);
        }
        // if keepTime is true and entering field value - apply current value time
        else if (keepTime === true && (me._isPickerInput || me.inputting) && dh.isValidDate(me.value)) {
            const newValue = new Date(value);
            dh.copyTimeValues(newValue, me.value);

            // But clamp to min/max if needed
            value = dh.clamp(newValue, me.min, me.max);
        }
        // else don't change time

        return value;
    }

    changeMin(value) {
        return this.transformDateValue(value, false);
    }

    updateMin(min) {
        const { input, _picker } = this;

        if (input) {
            if (min == null) {
                input.removeAttribute('min');
            }
            else {
                input.min = min;
            }
        }

        // See if our lazy config has been realized...
        if (_picker) {
            _picker.minDate = this.dateToPickerDate(min);
        }

        this.syncInvalid();
    }

    changeMax(value) {
        return this.transformDateValue(value, false);
    }

    updateMax(max) {
        const { input, _picker } = this;

        if (input) {
            if (max == null) {
                input.removeAttribute('max');
            }
            else {
                input.max = max;
            }
        }

        if (_picker) {
            _picker.maxDate = this.dateToPickerDate(max);
        }

        this.syncInvalid();
    }

    get weekStartDay() {
        // This trick allows our weekStartDay to float w/the locale even if the locale changes
        return typeof this._weekStartDay === 'number' ? this._weekStartDay : this.dateHelper.weekStartDay;
    }

    updateWeekStartDay(weekStartDay) {
        if (this._picker) {
            this._picker.weekStartDay = weekStartDay;
        }
    }

    changeValue(value, oldValue) {
        const
            me             = this,
            newValue       = me.transformDateValue(value),
            invalidDateStr = me.L('L{invalidDate}')(me.dateHelper.format(TODAY, me.format));

        // A value we could not parse
        if (value && !newValue) {
            if (!me.inputting || me.validateOnInput) {
                // setError uses localization
                me.setError(invalidDateStr);
            }
            return;
        }

        me.clearError(invalidDateStr);

        // Reject non-change
        if (me.hasChanged(oldValue, newValue)) {
            return super.changeValue(newValue, oldValue);
        }

        // But we must fix up the display in case it was an unparseable string
        // and the value therefore did not change.
        if (!me.inputting) {
            me.syncInputFieldValue();
        }
    }

    updateValue(value, oldValue) {
        const
            me     = this,
            picker = me._picker;

        if (picker) {
            const pickerDate = me.dateToPickerDate(value);

            picker.value = pickerDate;
            if (!me.inputting) {
                picker.activeDate = pickerDate;
            }
        }

        // If we are partnered with a DateField to maintain a full DateTime value
        this.syncPartner();

        super.updateValue(value, oldValue);
    }

    // syncInputFieldValue(...args) {
    //     super.syncInputFieldValue(...args);
    //
    //     if (this.triggers.expand) {
    //         this.triggers.expand.dataset.date = this.value?.getDate() ?? '';
    //     }
    // }

    changeStep(value, was) {
        const type = typeof value;

        if (!value) {
            return null;
        }

        if (type === 'number') {
            value = {
                magnitude : Math.abs(value),
                unit      : was ? was.unit : 'day'
            };
        }
        else if (type === 'string') {
            value = this.dateHelper.parseDuration(value);
        }

        if (value && value.unit && value.magnitude) {
            if (value.magnitude < 0) {
                value = {
                    magnitude : -value.magnitude,  // Math.abs
                    unit      : value.unit
                };
            }

            return value;
        }
    }

    updateStep(value) {
        // If a step is configured, show the steppers
        this.toggleCls('b-no-steppers', !value);

        // The last trigger has different padding than the others
        this.triggers?.expand?.element.classList.toggle('b-last-trigger', !value);

        this.syncInvalid();
    }

    hasChanged(oldValue, newValue) {
        const dh = this.dateHelper;
        // if both dates are provided and the field does not have time info in its format
        if (oldValue?.getTime && newValue?.getTime &&
            (!this.keepTime || this.isTimeValue(this.keepTime))
        ) {
            // Only compare date part
            return !dh.isEqual(dh.clearTime(oldValue), dh.clearTime(newValue));
        }

        return super.hasChanged(oldValue && oldValue.getTime(), newValue && newValue.getTime());
    }

    get inputValue() {
        // Do not use the _value property. If called during configuration, this
        // will import the configured value from the config object.
        const date = this.value;

        return date ? this.dateHelper.format(date, this.format) : '';
    }

    updateFormat() {
        if (!this.isConfiguring) {
            this.syncInputFieldValue(true);
        }
    }

    //endregion

    //region Localization

    updateLocalization() {
        super.updateLocalization();
        this.syncInputFieldValue(true);
    }

    //endregion

    //region Other

    internalOnKeyEvent(event) {
        super.internalOnKeyEvent(event);

        if (event.type === 'keydown') {
            const me = this;

            let step;

            switch (event.virtualKey) {
                case 'Enter':
                    me.isValid && me.picker?.hide();
                    break;

                case 'ArrowLeft':
                    if (me.caretAtStart || me.selectedAll) {
                        step = -1;
                    }
                    break;

                case 'ArrowRight':
                    if (me.caretAtEnd || me.selectedAll) {
                        step = 1;
                    }
                    break;

                case 'NumpadAdd':
                    step = 1;
                    break;

                case 'NumpadSubtract':
                    step = -1;
                    break;
            }

            // Arrow/Numpad stepping stays opt-in; only the Shift+Arrow trigger gestures default to one day
            if (step && me.step) {
                me.stepDate(step);
                me.selectAll();
                event.preventDefault();
            }
        }
    }

    //endregion
}

// Register this widget type with its Factory
DateField.initClass();
