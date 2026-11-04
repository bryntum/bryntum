import FunctionHelper from '../helper/FunctionHelper.js';
import DateField from './DateField.js';
import Field from './Field.js';
import TimeField from './TimeField.js';
import DateHelper from '../helper/DateHelper.js';
import DomHelper from '../helper/DomHelper.js';
import EventHelper from '../helper/EventHelper.js';
import TimeZonable from '../mixin/TimeZonable.js';

DomHelper.loadStylesheet('Core/widget/DateTimeField.css');

// import Stylesheet from './DateTimeField.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'DateTimeField');

/**
 * @module Core/widget/DateTimeField
 */

/**
 * A composite field that combines a {@link Core.widget.DateField} and a {@link Core.widget.TimeField} into a single
 * input for selecting both date and time. The two sub-fields can be individually configured via
 * {@link #config-dateField} and {@link #config-timeField}. The field's {@link #config-value} is a `Date` object
 * representing the combined selection. This field can be used as a cell {@link Grid.column.Column#config-editor}
 * in a Grid.
 *
 * {@inlineexample Core/widget/DateTimeField.js one-column}
 *
 * ```javascript
 * const dateTimeField = new DateTimeField({
 *     label : 'Start',
 *     value : new Date(2025, 0, 15, 9, 30),
 *     appendTo : document.body
 * });
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config                       | Description                                      |
 * |------------------------------|--------------------------------------------------|
 * | {@link #config-value}        | The combined date and time value                 |
 * | {@link #config-dateField}    | Configuration for the embedded DateField         |
 * | {@link #config-timeField}    | Configuration for the embedded TimeField         |
 * | {@link #config-weekStartDay} | First day of the week (0=Sunday, 1=Monday, etc.) |
 * | {@link #config-label}        | Field label displayed beside the field           |
 *
 * ## See also
 *
 * - {@link Core.widget.DateField} - Date-only input field
 * - {@link Core.widget.TimeField} - Time-only input field
 * - {@link Core.widget.DateRangeField} - Field for selecting a date range
 *
 * {@note}Input configuration properties (such as `inputWidth`, `inputAlign`, `autoComplete`, `inputAttributes`,
 * `inputType`, `spellCheck`, `tabIndex`, and `validateOnInput`) cannot be set directly on `DateTimeField`.
 * Instead, configure them individually on the underlying {@link #config-dateField} and {@link #config-timeField}
 * configuration objects.{/@note}
 *
 * @extends Core/widget/Field
 * @classtype datetimefield
 * @classtypealias datetime
 * @inputfield
 */
export default class DateTimeField extends TimeZonable(Field) {

    static $name = 'DateTimeField';

    static type = 'datetimefield';

    static alias = 'datetime';

    static configurable = {
        /**
         * @hideconfigs inputWidth, inputAlign, autoComplete, inputAttributes, inputType, spellCheck, tabIndex, validateOnInput
         */

        /**
         * @hidefunctions getAfterValue
         */

        /**
         * Returns the TimeField instance
         * @readonly
         * @member {Core.widget.TimeField} timeField
         */
        /**
         * Configuration for the {@link Core.widget.TimeField}
         * @config {TimeFieldConfig}
         */
        timeField : {
            type    : 'timefield',
            ref     : 'timeField',
            partner : 'dateField'
        },

        /**
         * Returns the DateField instance
         * @readonly
         * @member {Core.widget.DateField} dateField
         */
        /**
         * Configuration for the {@link Core.widget.DateField}
         * @config {DateFieldConfig}
         */
        dateField : {
            type    : 'datefield',
            ref     : 'dateField',
            step    : '1 d',
            partner : 'timeField'
        },

        /**
         * The week start day in the {@link Core.widget.DateField#config-picker}, 0 meaning Sunday, 6 meaning Saturday.
         * Uses a localized value by default.
         *
         * @config {Number}
         */
        weekStartDay : null,

        inputTemplate : () => '',

        ariaElement : 'element',

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
        rendition : 'outlined',

        value : {
            $config : {
                equal : 'date'
            },
            value : null
        }
    };

    doDestroy() {
        this.dateField.destroy();
        this.timeField.destroy();

        super.doDestroy();
    }

    get childItems() {
        return [this.dateField, this.timeField];
    }

    get fieldDefaults() {
        const { revertOnEscape, tabIndex } = this;

        return tabIndex == null ? {
            revertOnEscape
        } : {
            revertOnEscape,
            tabIndex
        };
    }

    get focusElement() {
        return this.dateField.input;
    }

    // Implementation needed at this level because it has two inner elements in its inputWrap
    get innerElements() {
        return [
            this.dateField.element,
            this.timeField.element
        ];
    }

    // Each subfield handles its own keystrokes
    internalOnKeyEvent() { }

    // CellEdit sets this dynamically on its editor field
    updateRevertOnEscape(revertOnEscape) {
        this.timeField.revertOnEscape = revertOnEscape;
        this.dateField.revertOnEscape = revertOnEscape;
    }

    changeTimeField(config, existing) {
        // Converts the timeField config into a TimeField
        const result = TimeField.reconfigure(existing, config, {
            owner     : this,
            defaults  : this.fieldDefaults,
            rendition : this.rendition
        });
        // Give the sub-field a real widget owner. `reconfigure`'s `owner` option only sets an internal cleanup
        // Symbol; without a widget owner the `owner` getter falls back to `containingWidget` (the rendered DOM),
        // which is null before first paint.
        result.owner = this;
        (this.widgetMap ||= {}).timeField = result;
        return result;
    }

    // Each subfield handles its own inputWidth
    updateInputWidth() { }

    // Each subfield handles its own inputAlign
    updateInputAlign() { }

    // Each subfield handles its own afterValue
    getAfterValue() { }

    updateTimeField(timeField) {
        const me = this;

        FunctionHelper.after(timeField, 'syncInvalid', () => {
            me.timeField && !me.updatingInvalid && me.syncInvalid();
        });

        timeField.ion({
            thisObj : me,
            change  : 'onDateTimeChange',
            input   : 'onDateTimeInput'
        });

        // Must set *after* construction, otherwise it becomes the default state to reset readOnly back to
        if (me.readOnly) {
            timeField.readOnly = true;
        }
    }

    changeDateField(config, existing) {
        // Converts the dateField config into a class based on { type : "..." } provided (DateField by default)
        const result = DateField.reconfigure(existing, config, {
            owner     : this,
            defaults  : this.fieldDefaults,
            rendition : this.rendition,
            label     : '&nbsp;'
        });
        // Give the sub-field a real widget owner (see changeTimeField) so `owner` resolves without the rendered DOM.
        result.owner = this;
        (this.widgetMap ||= {}).dateField = result;
        return result;
    }

    updateDateField(dateField) {
        const me = this;

        EventHelper.on({
            element : dateField.element,
            keydown : 'onDateFieldKeyDown',
            thisObj : me
        });

        FunctionHelper.after(dateField, 'syncInvalid', () => {
            me.dateField && !me.updatingInvalid && me.syncInvalid();
        });

        dateField.ion({
            thisObj : me,
            change  : 'onDateTimeChange',
            input   : 'onDateTimeInput',
            keydown({ event }) {
                if (event.key === 'Tab' && !event.shiftKey && me.timeField?.isVisible) {
                    event.stopPropagation();
                }
            }
        });

        // Must set *after* construction, otherwise it becomes the default state
        // to reset readOnly back to
        if (me.readOnly) {
            dateField.readOnly = true;
        }
    }

    updateWeekStartDay(weekStartDay) {
        if (this.dateField) {
            this.dateField.weekStartDay = weekStartDay;
        }
    }

    changeWeekStartDay(value) {
        return typeof value === 'number' ? value : (this.dateField?.weekStartDay ?? DateHelper.weekStartDay);
    }

    // Apply our value to our underlying fields.
    // They are partnered, so they will keep each other in sync.
    set value(value) {
        this.dateField.value = value;
    }

    // Our value is taken from the dateField (which is partnered with the timeField)
    get value() {
        return this.dateField.value;
    }

    onDateTimeChange(changeEvent) {
        if ((changeEvent.value - this._lastCommonValue) && !this.$isInternalChange) {
            this.triggerChange(changeEvent, changeEvent.userAction);
        }
        this._lastCommonValue = this.value;
    }

    /**
     * Relays input events from dateField and timeField to the DateTimeField.
     * @param {Object} inputEvent Event object from child field
     * @fires input
     * @internal
     */
    onDateTimeInput(inputEvent) {
        this.trigger('input', { value : this.value, event : inputEvent.event });
    }

    onDateFieldKeyDown(e) {
        if (e.key === 'Tab' && !e.shiftKey && this.timeField.isVisible && this.timeField.isFocusable) {
            e.stopPropagation();
            e.preventDefault();
            this.timeField.focus();
        }
    }

    // Make us and our underlying fields required
    updateRequired(required) {
        super.updateRequired(required);
        this.timeField.required = this.dateField.required = required;
    }

    updateReadOnly(readOnly, was) {
        super.updateReadOnly(readOnly, was);

        if (!this.isConfiguring) {
            this.timeField.readOnly = this.dateField.readOnly = readOnly;
        }
    }

    // Make us and our underlying fields disabled
    onDisabled(value) {
        this.timeField.disabled = this.dateField.disabled = value;
    }

    focus() {
        this.dateField.focus();
    }

    hasChanged(oldValue, newValue) {
        if (oldValue?.getTime && newValue?.getTime) {
            return !DateHelper.isEqual(oldValue, newValue);
        }
        return super.hasChanged(oldValue?.getTime?.(), newValue?.getTime?.());
    }

    get isValid() {
        return this.timeField.isValid && this.dateField.isValid;
    }

    setError(error, silent) {
        [this.dateField, this.timeField].forEach(f => f.setError(error, silent));
    }

    getErrors() {
        const errors = [...(this.dateField.getErrors() || []), ...(this.timeField.getErrors() || [])];

        return errors.length ? errors : null;
    }

    clearError(error, silent) {
        [this.dateField, this.timeField].forEach(f => f.clearError(error, silent));
    }

    updateInvalid() {
        // use this flag in this level to avoid looping
        this.updatingInvalid = true;
        this.dateField.updateInvalid();
        this.timeField.updateInvalid();
        this.updatingInvalid = false;
    }

    compose() {
        const { rendition } = this;

        return {
            class : {
                [`b-text-field-${rendition}`] : rendition
            }
        };
    }
}

DateTimeField.initClass();
