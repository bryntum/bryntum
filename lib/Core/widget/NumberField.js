import Field from './Field.js';
import EventHelper from '../helper/EventHelper.js';
import DomHelper from '../helper/DomHelper.js';
import BrowserHelper from '../helper/BrowserHelper.js';
import NumberHelper from '../helper/NumberHelper.js';

// Not a typo, styling shared with TextField
DomHelper.loadStylesheet('Core/widget/TextField.css');

// import Stylesheet from './TextField.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TextField');

/**
 * @module Core/widget/NumberField
 */
const preventDefault = e => e.ctrlKey && e.preventDefault();

/**
 * A numeric input field with built-in spin triggers, range validation, and number formatting. Implemented as
 * `<input type="text">` to support locale-aware formatting via the {@link #config-format} config — including
 * currency, percentage, and digit grouping. Constrain input with {@link #config-min} and {@link #config-max},
 * and control increment size with {@link #config-step} and {@link #config-largeStep} (Shift+click). This field
 * can be used as a cell {@link Grid.column.Column#config-editor} in a Grid and is the default editor for
 * {@link Grid.column.NumberColumn}, {@link Grid.column.PercentColumn}, and {@link Grid.column.AggregateColumn}.
 *
 * {@inlineexample Core/widget/NumberField.js one-column}
 *
 * ```javascript
 * const numberField = new NumberField({
 *     label : 'Quantity',
 *     min   : 1,
 *     max   : 100,
 *     step  : 5,
 *     value : 10,
 *     appendTo : document.body
 * });
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config                    | Description                                             |
 * |---------------------------|---------------------------------------------------------|
 * | {@link #config-value}     | Current numeric value                                   |
 * | {@link #config-min}       | Minimum allowed value                                   |
 * | {@link #config-max}       | Maximum allowed value                                   |
 * | {@link #config-step}      | Step size for spin button clicks and arrow keys         |
 * | {@link #config-format}    | Number format string or config (e.g. currency, percent) |
 * | {@link #config-largeStep} | Step size when holding Shift (defaults to 10x step)     |
 *
 * Provide a {@link Core.helper.util.NumberFormat} config as {@link #config-format} to show currency. For
 * example:
 *
 * ```javascript
 * new NumberField({
 *   format : {
 *      style    : 'currency',
 *      currency : 'USD'
 *   }
 * });
 * ```
 *
 * {@inlineexample Core/widget/NumberFieldOptions.js}
 *
 * Provide a pattern as {@link #config-format} to display a value as percentage.
 * The presence of a percent sign in the format string turns the percentage handling on.
 * Note that the value passed as config or set programmatically has to be a decimal number.
 * Numbers entered into the field are divided by 100. Excess digits will be rounded up or down.
 *
 * #### Pattern description:
 * * `0-9`: Significant digit
 * * `#`: Insignificant digit, will be omitted when zero
 * * `.`: Decimal separator
 * * `%`: Percent designator.
 *
 * ```javascript
 * new NumberField({
 *   format : '0.0#%',
 *   value  : 0.125
 * });
 * ```
 * The resulting value displayed will be `12.5%`.
 *
 * ## See also
 *
 * - {@link Core.widget.DurationField} - Field for entering duration values with units
 * - {@link Core.widget.Slider} - Slider widget for selecting numeric values visually
 * - {@link Core.helper.util.NumberFormat} - Number formatting utility
 *
 * @extends Core/widget/Field
 * @classtype numberfield
 * @classtypealias number
 * @inputfield
 */
export default class NumberField extends Field {

    //region Config

    static $name = 'NumberField';

    static type = 'numberfield';

    static alias = 'number';

    static configurable = {
        /**
         * Reset to min value when max value is reached using steppers, and vice-versa.
         * @config {Boolean}
         * @default false
         */
        wrapAround : null,

        /**
         * Min value
         * @config {Number}
         */
        min : null,

        /**
         * Max value
         * @config {Number}
         */
        max : null,

        /**

         * Step size for spin button clicks.
         * @member {Number} step
         */
        /**
         * Step size for spin button clicks. Also used when pressing up/down keys in the field.
         * Note that when percent formatting {@link #config-format} is configured, the step size is divided by 100
         * because the internal value is a fractional number.
         * Incrementing/decrementing by `step : 1` changes the value by 0.01, which equals 1%.
         * @config {Number}
         * @default
         */
        step : 1,

        /**
         * Large step size, defaults to 10 * `step`. Applied when pressing SHIFT and stepping either by click or
         * using keyboard.
         * Note that when percent formatting {@link #config-format} is configured, the step size is divided by 100
         * because the internal value is a fractional number.
         * Incrementing/decrementing by `largeStep : 10` changes the value by 0.1, which equals 10%.
         * @config {Number}
         * @default 10
         */
        largeStep : 0,

        /**
         * Initial value
         * @config {Number}
         */
        value : null,

        /**
         * The format to use for rendering numbers.
         *
         * For example:
         * ```
         *  format: '9,999.00##'
         * ```
         * The above enables digit grouping and will display at least 2 (but no more than 4) fractional digits.
         * @config {String|NumberFormatConfig}
         * @default
         */
        format : '',

        /**
         * Widgets that trigger functionality upon click. Each trigger icon is a {@link Core.widget.Widget} instance
         * which may be hidden, shown and observed and styled just like any other widget.
         * @prp {Object<String,Core.widget.Widget>} triggers
         * @accepts {Object<String,FieldTriggerConfig|null>}
         * @property {FieldTriggerConfig} triggers.spin Shows up and down arrows to increase or decrease the field
         * value based on the {@link #config-step}
         * @property {FieldTriggerConfig} triggers.clear Clears the field value, only present if this field is
         * {@link #config-clearable}
         */
        triggers : {
            spin : {
                type : 'spintrigger'
            }
        },

        /**
         * Controls how change events are triggered when stepping the value up or down using either spinners or
         * arrow keys.
         *
         * Configure with:
         * * `true` to trigger a change event per step
         * * `false` to not trigger change while stepping. Will trigger on blur/Enter
         * * A number of milliseconds to buffer the change event, triggering when no steps are performed during that
         *   period of time.
         *
         * @config {Boolean|Number}
         * @default
         */
        changeOnSpin : true,

        // NOTE: using type="number" has several trade-offs:
        //
        // Negatives:
        //   - No access to caretPos/textSelection. This causes anomalies when replacing
        //     the input value with a formatted version of that value (the caret moves to
        //     the end of the input el on each character typed).
        //   - The above also prevents Siesta/synthetic events from mimicking typing.
        //   - Thousand separators cannot be displayed (input.value = '1,000' throws an
        //     exception).
        // Positives:
        //   - On mobile, the virtual keyboard only shows digits et al.
        //   - validity property on DOM node that handles min/max checks.
        //
        // The above may not be exhaustive, but there is not a compelling reason to
        // use type="number" except on mobile.

        /**
         * This can be set to `'number'` to enable the numeric virtual keyboard on
         * mobile devices. Doing so limits this component's ability to handle keystrokes
         * and format properly as the user types, so this is not recommended for
         * desktop applications. This will also limit similar features of automated
         * testing tools that mimic user input.
         * @config {String}
         * @default text
         */
        inputType : null,

        /**
         * Predefined style to use for the field. Possible values are:
         * * `'outlined'` (default)
         * * `'filled'`
         *
         * The supplied value will be part of the field's class list, as `b-text-field-{rendition}`.
         *
         * @prp {'outlined'|'filled'|String} rendition
         * @default
         */
        rendition : 'outlined'
    };

    //endregion

    //region Init

    construct(config) {
        super.construct(config);

        const me = this;

        // Support for selecting all by double click in empty input area
        // Browsers work differently at this case
        me.input.addEventListener('dblclick', () => {
            me.select();
        });

        if (typeof me.changeOnSpin === 'number') {
            me.bufferedSpinChange = me.buffer(me.triggerChange, me.changeOnSpin);
        }
    }

    //endregion

    //region Internal functions

    acceptValue(value, rawValue) {
        let accept = !isNaN(value);

        // https://github.com/bryntum/bryntum/issues/1349
        // Pass through if there is a text selection in the field. This fixes the case when
        // valid value is typed already and we are replacing it by selecting complete string and typing over it.
        // Cannot be tested in siesta, see ticket for more info.
        if (accept && !this.hasTextSelection) {
            accept = false;

            const
                raw = this.input.value,
                current = parseFloat(raw);

            if (raw !== rawValue) {
                // The new value is out of range, but we accept it if the current value
                // is also problematic. Consider the case where the input is empty and the
                // minimum value is 100. The user must first type "1" and we must accept it
                // if they are to get the opportunity to type the "0"s.
                accept = !this.acceptValue(current, raw);

                // Also, if we are checking the current value, be sure not to infinitely
                // recurse here.
            }
        }

        return accept;
    }

    okMax(value) {
        return isNaN(this.max) || value <= this.max;
    }

    okMin(value) {
        return isNaN(this.min) || value >= this.min;
    }

    internalOnKeyEvent(e) {
        if (e.type === 'keydown') {
            const
                me = this,
                key = e.key;

            let block;

            // Native arrow key spin behaviour differs between browsers, so we replace
            // the native spinners w/our own triggers and handle arrows keys as well.
            if (key === 'ArrowUp') {
                me.doSpinUp(e.shiftKey);
                block = true;
            }
            else if (key === 'ArrowDown') {
                me.doSpinDown(e.shiftKey);
                block = true;
            }
            else if (!e.altKey && !e.ctrlKey && key && key.length === 1) {
                // The key property contains the character or key name... so ignore
                // keys that aren't a single character.
                const
                    after            = me.getAfterValue(key),
                    afterValue       = me.formatter.parseStrict(after),
                    { decimalSeparator } = me.formatter.getLocaleSeparators(),
                    allowNegative    = isNaN(me.min) || me.min < 0,
                    // no need to check if typing same value, - if negative numbers are allowed,
                    // or a lone decimal separator (intermediate state while typing e.g. ".5"),
                    // or -. (intermediate state while typing e.g. "-.5")
                    accepted         = afterValue === me.value || (after === '-' && allowNegative) ||
                        after === decimalSeparator || (after === '-' + decimalSeparator && allowNegative);

                block = !accepted && !me.acceptValue(afterValue, after);
            }

            if (key === 'Enter' && me._changedBySilentSpin) {
                me.triggerChange(e, true);

                // reset the flag
                me._changedBySilentSpin = false;
            }

            if (block) {
                e.preventDefault();
            }
        }

        super.internalOnKeyEvent(e);
    }

    doSpinUp(largeStep = false) {
        const
            me = this,
            divisor = me.formatter.is.percent ? 100 : 1,
            step = (largeStep ? me.largeStep : me.step) / divisor;

        if (me.readOnly) {
            return;
        }

        let newValue = (me.value || 0) + step;

        if (!me.okMin(newValue)) {
            newValue = me.min;
        }

        if (me.okMax(newValue)) {
            me.applySpinChange(newValue);
        }
        else if (me.wrapAround) {
            newValue = me.min;
            me.applySpinChange(newValue);
        }

    }

    doSpinDown(largeStep = false) {
        const
            me   = this,
            divisor = me.formatter.is.percent ? 100 : 1,
            step = (largeStep ? me.largeStep : me.step) / divisor;

        if (me.readOnly) {
            return;
        }

        let newValue = (me.value || 0) - step;

        if (!me.okMax(newValue)) {
            newValue = me.max;
        }

        if (me.okMin(newValue)) {
            me.applySpinChange(newValue);
        }
        else if (me.wrapAround) {
            newValue = me.max - (me.max % step);
            me.applySpinChange(newValue);
        }
    }

    applySpinChange(newValue) {
        const me = this;

        me._isUserAction = true;

        // Should not trigger change immediately?
        if (me.changeOnSpin !== true) {
            me._changedBySilentSpin = true;
            // Silence the change
            me.silenceChange = true;
            // Optionally buffer the change
            me.bufferedSpinChange && me.bufferedSpinChange(null, true);
        }

        me.value = newValue;

        me._isUserAction = false;
        me.silenceChange = false;
    }

    triggerChange(...args) {
        if (!this.silenceChange) {
            super.triggerChange(...args);
        }
    }

    onFocusOut(e, ...args) {
        super.onFocusOut(e, ...args);

        const
            me = this,
            { input } = me,
            raw = input.value,
            value = me.formatter.truncate(raw),
            formatted = isNaN(value) ? raw : me.formatValue(value);

        // Triggers may have been reconfigured
        me.triggers?.spin?.clickRepeater?.cancel();

        me.lastTouchmove = null;

        if (raw !== formatted) {
            input.value = formatted;
        }

        if (me._changedBySilentSpin) {
            me.triggerChange(e, true);

            // reset the flag
            me._changedBySilentSpin = false;
        }
    }

    internalOnInput({ data }) {
        const
            me = this,
            { formatter, input } = me,
            { parser, maximumFractionDigits } = formatter,
            raw = input.value;

        // If the input is not a number, revert to the last known good value
        // This can happen using paste to insert bad characters.
        // This event is not preventable, so we need to use queueMicrotask to
        // step past this event to allow the input to be reverted to the good value.
        if (data?.length > 1 && !(isFinite(parser.parse(raw)) || raw === '-')) {
            const v = me._lastValue || me.valueOnFocus;
            me.queueMicrotask(() => {
                me._value = NaN; me.value = v;
            });
        }
        else {
            const decimals = parser.decimalPlaces(raw);

            if (formatter.truncator && decimals > maximumFractionDigits) {
                let value = raw,
                    valueDecimals;

                const trunc = formatter.truncate(raw);

                if (!isNaN(trunc)) {
                    value = me.formatValue(trunc);
                    valueDecimals = parser.decimalPlaces(value);

                    if (valueDecimals < maximumFractionDigits) {
                        value += '0'.repeat(maximumFractionDigits - valueDecimals);
                        valueDecimals = maximumFractionDigits;
                    }

                    if (valueDecimals < decimals) {
                        // If typing (or pasting) has caused truncation, reset. To best preserve the caret pos (which is
                        // reset by assigning input.value), we grab and restore the distance from the end. This allows
                        // special things to format into the string (such as thousands separators) since they always go to
                        // the front of the input.
                        const pos = raw.length - me.caretPos;

                        input.value = value;

                        me.caretPos = value.length - pos + 1;
                    }
                }
            }

            super.internalOnInput(...arguments);
        }
    }

    formatValue(value) {
        return this.formatter.format(value);
    }

    get formatter() {
        return this._formatter ?? (this._formatter = NumberHelper.getLocalizedFormatter(this.format));
    }

    compose() {
        const { rendition } = this;

        return {
            class : {
                // Styling shared with TextField
                [`b-text-field-${rendition}`] : 1
            }
        };
    }

    //endregion

    //region Getters/Setters

    updateStep(step) {
        const me = this;

        me.toggleCls('b-hide-spinner', !step);
        me._step = step;

        if (step && BrowserHelper.isMobile) {
            if (!me.touchMoveListener) {
                me.touchMoveListener = EventHelper.on({
                    element   : me.input,
                    touchmove : 'onInputSwipe',
                    thisObj   : me,
                    throttled : {
                        buffer : 150,
                        alt    : preventDefault
                    }
                });
            }
        }
        else {
            me.touchMoveListener?.();
        }
    }

    onInputSwipe(e) {
        const { lastTouchmove } = this;

        if (lastTouchmove) {
            const
                // Swipe right/up means spin up, left/down means spin down
                deltaX = e.screenX - lastTouchmove.screenX,
                deltaY = lastTouchmove.screenY - e.screenY,
                delta  = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

            this[`doSpin${delta > 0 ? 'Up' : 'Down'}`]();
        }

        // Disable touch-scrolling
        e.preventDefault();
        this.lastTouchmove = e;
    }

    changeLargeStep(largeStep) {
        return largeStep || (this.step * 10);
    }

    get validity() {
        const
            value    = this.value,
            validity = {};

        // Assert range for non-empty fields, empty fields will turn invalid if `required: true`
        if (value != null) {
            validity.rangeUnderflow = !this.okMin(value);
            validity.rangeOverflow = !this.okMax(value);
        }
        validity.valid = !validity.rangeUnderflow && !validity.rangeOverflow;

        return validity;
    }

    /**
     * Get/set the NumberField's value, or `undefined` if the input field is empty
     * @property {Number}
     */
    changeValue(value, was) {
        const me = this;

        if (value || value === 0) {
            let valueIsNaN;

            // We insist on a number as the value
            if (typeof value !== 'number') {
                value = (typeof value === 'string') ? me.formatter.parse(value) : Number(value);

                valueIsNaN = isNaN(value);
                if (valueIsNaN) {
                    value = '';
                }
            }

            if (!valueIsNaN && me.format) {
                value = me.formatter.round(value);
            }
        }
        else {
            value = undefined;
        }

        return super.changeValue(value, was);
    }

    get inputValue() {
        return this.value != null ? this.formatValue(this.value) : '';
    }
    //endregion

    updateLocalization() {
        super.updateLocalization();

        this._formatter = undefined;

        this.syncInputFieldValue();
    }
}

// Register this widget type with its Factory
NumberField.initClass();
