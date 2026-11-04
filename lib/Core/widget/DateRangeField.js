import DateHelper from '../helper/DateHelper.js';
import DomHelper from '../helper/DomHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import PickerField from './PickerField.js';
import TimeField from './TimeField.js';
import AbstractDateRange from './mixin/AbstractDateRange.js';
import Widget from './Widget.js';

import './DateRangePicker.js';

DomHelper.loadStylesheet('Core/widget/DateRangeField.css');

// import Stylesheet from './DateRangeField.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'DateRangeField');

/**
 * @module Core/widget/DateRangeField
 */

const TODAY = new Date();

/**
 * A compound field for editing a start/end date pair. The two `Date` values are stored together in the
 * {@link #config-value} property as an array, `[startDate, endDate]`. A dropdown picker with dual
 * month calendars lets the user select the range visually. By default the picker edits the value live; enable
 * {@link #config-confirmable} to require explicit OK/Cancel confirmation. Clicking or arrow-keying in the
 * picker adjusts whichever date field currently has focus. Calendar cells can be customized via
 * {@link Core.widget.MultiDatePicker#config-cellRenderer}.
 *
 * By default, the picker displays below the fields and edits the value "live":
 *
 * {@inlineexample Core/widget/DateRangeField.js one-column}
 *
 * <div class="b-confirmable-example">
 * The {@link #config-confirmable} config instructs the picker to display on top of the field with OK and Cancel
 * buttons:
 *
 * {@inlineexample Core/widget/DateRangeFieldConfirmable.js one-column}
 * </div>
 *
 * {@inlineexample Core/widget/DateRangeFieldCellRenderer.js}
 *
 * ```javascript
 * const dateRange = new DateRangeField({
 *     label    : 'Project dates',
 *     value    : [new Date(2025, 0, 1), new Date(2025, 5, 30)],
 *     appendTo : document.body
 * });
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config                      | Description                                         |
 * |-----------------------------|-----------------------------------------------------|
 * | {@link #config-value}       | An array of two dates, `[startDate, endDate]`       |
 * | {@link #config-confirmable} | Show OK/Cancel buttons on the picker                |
 * | {@link #config-picker}      | Configuration for the date range picker dropdown    |
 *
 * ## See also
 *
 * - {@link Core.widget.DateField} - Single date picker field
 * - {@link Core.widget.PickerField} - Base class for fields with dropdown pickers
 *
 * @extends Core/widget/PickerField
 * @mixes Core/widget/mixin/AbstractDateRange
 * @classtype daterangefield
 * @widget
 */
export default class DateRangeField extends PickerField.mixin(AbstractDateRange) {
    //region Config
    static $name = 'DateRangeField';

    // Factoryable type name
    static type = 'daterangefield';

    // Factoryable type alias
    static alias = 'daterange';

    static configurable = {
        inline : true,

        /**
         * Enables OK/Cancel button bar to accept date range changes. A value of `true` shows the OK and Cancel buttons.
         *
         * See {@link Core.widget.DateRangePicker#config-confirmable}
         * @prp {Core.widget.ConfirmationBar}
         * @accepts {Boolean|ConfirmationBarConfig}
         */
        confirmable : null,

        container : {
            // items are added dynamically
        },

        syncViewDate        : false,
        confirmableDefaults : {
            type       : 'daterangepicker',
            navButtons : 'floating',
            trapFocus  : true,

            align : {
                align   : 't100-t100',
                offset  : '[data-ref="fieldEndDate"]',
                overlap : true
            },

            fieldStartDate : {
                triggers : {
                    expand : {
                        align    : 'start',
                        disabled : true
                    }
                }
            }
        },

        fieldEndDate : {
            internalListeners : {
                triggerKey : 'up.onTriggerKey'
            },

            triggers : {
                expand : null
            }
        },

        fieldEndTime : null,

        fieldEndTimeDefaults : {
            ref    : 'fieldEndTime',
            cls    : 'b-end-time',
            weight : 20
        },

        fieldStartDate : {
            internalListeners : {
                triggerKey : 'up.onTriggerKey'
            },

            triggers : {
                expand : {
                    handler : 'up.onExpandPicker',
                    align   : 'start'
                }
            }
        },

        fieldStartTime : null,

        fieldStartTimeDefaults : {
            ref    : 'fieldStartTime',
            cls    : 'b-start-time',
            weight : 10
        },

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
         * @default false
         */
        keepTime : null,

        keyMap : {
            ArrowDown         : 'onTriggerKeyDown',
            ArrowUp           : 'onKeyArrowUp',
            Enter             : 'onKeyEnter',
            Escape            : 'onKeyEscape',
            'Shift+Backspace' : 'onKeyClear'
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
                type    : 'date',
                formats : ['format', 'altFormats'],
                strict  : true
            }
        },

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
                type    : 'date',
                formats : ['format', 'altFormats'],
                strict  : true
            }
        },

        // Overrides the inherited Field `value` typing in the generated typings. There is no `value` property in
        // this class — the doc generator binds this block by its explicit name, not by its position.
        /**
         * Value, which is an array of two Dates, or two strings which will be converted using the specified
         * {@link #config-format}.
         * @config {String[]|Date[]} value
         * @default ["today", "today"]
         */

        nonConfirmableDefaults : {
            type : 'multidatepicker',

            align : {
                align     : 't0-b0',
                axisLock  : true,
                allowFlip : true
            },

            datePickerDefaults : {
                // focus is never on the date pickers
                focusable : false,

                internalListeners : {
                    beforeDateSelect : 'up.onDatePickerBeforeDateSelect'
                }
            }
        },

        /**
         * A config object used to configure the {@link Core.widget.DateRangePicker datePicker}.
         * ```javascript
         * dateField = new DateRangeField({
         *      picker    : {
         *          multiSelect : true
         *      }
         *  });
         * ```
         * @config {DateRangePickerConfig|MultiDatePickerConfig}
         */
        picker : {
            cls          : 'b-date-range-field-picker',
            floating     : true,
            hideMode     : 'clip',
            multiSelect  : 'range',
            scrollAction : 'realign',

            align : {
                axisLock : true
            }
        },

        pickerAlignElement : 'container.element',

        /**
         * An optional extra CSS class to add to the picker container element.
         * @prp {String}
         * @internal
         */
        pickerCls : null,

        /**
         * Set to `true` to include time fields to allow the user to pick the time of day. When this config is
         * set, `keepTime` is no longer used.
         * @config {Boolean}
         * @default false
         * @internal
         */
        pickTime : null,

        stepSmall : '7 days',

        timeFormat : 'HH:mm:ss:SSS',

        triggers : {
            expand : null
        },

        /**
         * The week start day in the {@link #config-picker}, 0 meaning Sunday, 6 meaning Saturday.
         * Uses localized value per default.
         * @config {Number}
         */
        weekStartDay : null,

        timeFieldDefaults : {
            type       : 'timefield',
            autoSelect : true,

            picker : {
                align : {
                    align : 'b0-t0'
                }
            },

            triggers : {
                expand : null
            }
        }
    };

    //endregion
    //region Composition

    get dateFieldContainer() {
        return this.container;
    }

    get innerElements() {
        return [];  // everything is in the container
    }

    // DateField has min/max configs while DatePicker has minDate/maxDate... since we want to mimic the interface
    // of DateField as closely as possible, we add these getters to allow AbstractDateRange to access the valid
    // range using a common interface.

    get maxDate() {
        return this.max;
    }

    get minDate() {
        return this.min;
    }

    compose() {
        const
            { pickTime } = this;

        return {
            class : {
                'b-pick-time' : Boolean(pickTime)
            }
        };
    }

    //endregion
    //region Config processing

    // clearable

    updateClearable(clearable) {
        // No call super() == no clear trigger

        const { fieldEndDate } = this;

        // similar to how we delegate the icon to fieldStartDate, we delegate the clear trigger to fieldEndDate:
        fieldEndDate.clearable = clearable;

        if (clearable) {
            fieldEndDate.triggers.clear.handler = () => this.clear();
        }
    }

    // confirmable

    updateConfirmable() {
        if (!this.isConstructing) {
            this.picker = this._pickerConfig;  // reprocess the last picker config we've been given
        }
    }

    // fieldEndTime

    changeEndTimeField(config, existing) {
        return TimeField.reconfigure(existing, config, {
            owner    : this,
            defaults : TimeField.mergeConfigs(this.timeFieldDefaults, this.fieldEndTimeDefaults)
        });
    }

    updateEndTimeField(field) {
        field && this.container.add(field);
    }

    // fieldStartTime

    changeStartTimeField(config, existing) {
        return TimeField.reconfigure(existing, config, {
            owner    : this,
            defaults : TimeField.mergeConfigs(this.timeFieldDefaults, this.fieldStartTimeDefaults)
        });
    }

    updateStartTimeField(field) {
        field && this.container.add(field);
    }

    // keepTime

    updateKeepTime(keepTime) {
        keepTime = !this.pickTime && keepTime;

        this.fieldEndDate.keepTime = keepTime;
        this.fieldStartDate.keepTime = keepTime;
    }

    // max

    updateMax(max) {
        const { fieldEndDate, fieldStartDate, _picker: picker } = this;

        fieldEndDate.max = max;
        fieldStartDate.max = max;

        // See if our lazy config has been realized...
        if (picker) {
            picker.maxDate = max;
        }

        this.syncInvalid();
    }

    // min

    updateMin(min) {
        const { fieldEndDate, fieldStartDate, _picker: picker } = this;

        fieldEndDate.min = min;
        fieldStartDate.min = min;

        // See if our lazy config has been realized...
        if (picker) {
            picker.minDate = min;
        }

        this.syncInvalid();
    }

    // picker

    changePicker(config, existing) {
        const
            me = this,
            { confirmable, pickerAlignElement } = me,
            pickerDefaults = confirmable ? me.confirmableDefaults : me.nonConfirmableDefaults,
            // The picker is a MultiDatePicker when we don't have OK/Cancel buttons (!confirmable) and a DateRangePicker
            // otherwise.
            pickerClass = Widget.resolveType(pickerDefaults.type),
            defaults = pickerClass.mergeConfigs({
                owner        : me,
                forElement   : pickerAlignElement,
                minDate      : me.min,
                maxDate      : me.max,
                selection    : me.value,
                weekStartDay : me._weekStartDay, // need to pass the raw value to let the component to use its default value
                rendition    : me.rendition,
                align        : {
                    anchor : me.overlayAnchor,
                    target : pickerAlignElement
                }
            }, pickerDefaults, confirmable && { confirmable });

        // remember the last picker config so we can reprocess it if confirmable is changed
        me._pickerConfig = config;

        if (ObjectHelper.isObject(config)) {
            // hoist type from defaults since defaults.type won't be considered during reconfiguration
            config = ObjectHelper.merge({ type : defaults.type }, config);
        }

        return pickerClass.reconfigure(existing, config, {
            owner : me,
            defaults
        });
    }

    updatePicker(picker, was) {
        super.updatePicker(picker, was);

        this.detachListeners('dateRangeField.picker');

        // When picker flips which of the range its selecting, we must update the UI to make it obvious.
        picker?.ion({
            name            : 'dateRangeField.picker',
            thisObj         : this,
            selectionChange : 'onPickerSelectionChange',
            confirm         : 'onPickerConfirm',
            focusIn         : 'onPickerFocusIn'
        });
    }

    // pickerCls

    updatePickerCls(cls, was) {
        const classList = this.picker?.element?.classList;

        was && classList?.remove(was);
        cls && classList?.add(cls);
    }

    // pickTime

    updatePickTime(config) {
        let fieldEndTime = null,
            fieldStartTime = null;

        if (config === true) {
            fieldEndTime = fieldStartTime = {};
        }
        else if (config) {
            if (config.fieldStartTime || config.fieldEndTime) {
                /*
                    pickTime : {
                        fieldStartTime : ...
                        fieldEndTime   : ...
                    }
                 */
                fieldStartTime = config.fieldStartTime;
                fieldEndTime = config.fieldEndTime;
            }
            else {
                fieldStartTime = fieldEndTime = config;
            }
        }

        this.fieldEndTime = fieldEndTime;
        this.fieldStartTime = fieldStartTime;
    }

    // value

    changeValue(value) {
        const
            me             = this,
            invalidDateStr = me.L('L{DateField.invalidDate}')(DateHelper.format(TODAY, me.format));

        // A value we could not parse
        if (value && !(DateHelper.isDate(value[0]) && DateHelper.isDate(value[1]))) {
            // setError uses localization
            me.setError(invalidDateStr);
            return;
        }

        me.clearError(invalidDateStr);

        return value;
    }

    // weekStartDay

    get weekStartDay() {
        // This trick allows our weekStartDay to float w/the locale even if the locale changes
        return typeof this._weekStartDay === 'number' ? this._weekStartDay : DateHelper.weekStartDay;
    }

    updateWeekStartDay(weekStartDay) {
        if (this._picker) {
            this._picker.weekStartDay = weekStartDay;
        }
    }

    // rendition

    updateRendition(rendition) {
        const me = this;

        if (me._fieldStartDate) {
            me.fieldStartDate.rendition = rendition;
        }
        if (me._fieldEndDate) {
            me.fieldEndDate.rendition = rendition;
        }

        if (me._picker) {
            me.picker.rendition = rendition;
        }
    }

    //endregion
    //region Event handlers

    maybeHidePicker() {
        if (!this.picker.isVisible || this.confirmable) {
            return false;
        }

        this.hidePicker();
    }

    onDatePickerBeforeDateSelect({ date }) {
        this.picker.applyDate(date, this.fieldStartDate, this.fieldEndDate);

        return false;
    }

    onDateFieldChange({ source }) {
        const
            me           = this,
            { ref }      = source,
            changeIndex  = ref === 'fieldStartDate' ? 0 : 1,
            { pickTime } = me;

        let changedVal, otherIndex, timeField, val, value;

        if (!me.isConstructing) {
            changedVal = source.value;
            otherIndex = 1 - changeIndex;
            val        = me.value;

            if (changedVal) {
                if (pickTime) {
                    timeField = changeIndex ? me.fieldStartTime : me.fieldEndTime;
                    changedVal = DateHelper.combineDateAndTime(changedVal, timeField.value);
                }
                else {
                    changedVal = DateHelper.clearTime(changedVal);
                }

                value = [changedVal, changedVal];

                if (val) {
                    value[otherIndex] = val[otherIndex];

                    if (value[1] < value[0]) {
                        // use same date as changed field but preserve time
                        value[otherIndex] = DateHelper.combineDateAndTime(changedVal, value[otherIndex]);

                        if (value[1] < value[0]) {
                            // still denormalized means time is the issue, so use change value for both components
                            value[otherIndex] = changedVal;
                        }
                    }
                }

                me.syncValue(ref, value);
            }
        }
    }

    onKeyArrowUp(event) {
        const
            me         = this,
            { picker } = me;

        if (picker.isVisible) {
            if (me.confirmable) {
                return false;
            }

            return me.stepUp(event);
        }

        me.showPicker();
    }

    onKeyClear() {
        this.clearable && this.clear();
    }

    onKeyEnter() {
        this.maybeHidePicker();
    }

    onKeyEscape() {
        this.maybeHidePicker();
    }

    onExpandPicker() {
        this.confirmable ? this.showPicker() : this.togglePicker();
    }

    onPickerSelectionChange({ selection, userAction }) {
        if (!this.confirmable) {
            const
                me = this,
                { _isUserAction } = me;

            me._isUserAction = userAction || _isUserAction;
            me.syncValue('picker', selection);
            me._isUserAction = _isUserAction;
        }
    }

    onPickerConfirm({ choice, source, userAction }) {
        const
            me = this,
            { _isUserAction } = me,
            field = source.containsFocus && (source.pickingStartDate ? me.fieldStartDate : me.fieldEndDate);

        if (choice.ok) {
            me._isUserAction = userAction || _isUserAction;
            me.syncValue('picker', source.value);
            me._isUserAction = _isUserAction;
        }

        me.hidePicker();
        field?.focus();
    }

    onPickerFocusIn({ relatedTarget }) {
        const
            { fieldEndDate, fieldStartDate } = this.container.widgetMap,
            retarget = relatedTarget === fieldStartDate ? fieldStartDate : fieldEndDate;

        !this.confirmable && retarget.focus();
    }

    onTriggerKeyDown(event) {
        if (this.picker.isVisible && !this.confirmable) {
            return this.stepDown(event);
        }

        return super.onTriggerKeyDown(event);
    }

    //endregion
    //region Picker

    focusPicker() {
        const
            { picker } = this,
            { fieldEndDate, fieldStartDate } = this.container.widgetMap,
            { tbar } = picker,
            { fieldEndDate : fieldEndDatePicker, fieldStartDate : fieldStartDatePicker } = tbar?.widgetMap || {},
            target = tbar
                ? (
                    (fieldEndDate.containsFocus && fieldEndDatePicker) ||
                    fieldStartDatePicker
                )
                : (
                    (fieldEndDate.containsFocus && fieldEndDate) ||
                    fieldStartDate
                );

        target.focus();

        if (target !== picker) {
            picker.ensureVisible({
                animate : false,
                date    : target.value
            });

            target.selectAll();
        }
    }

    showPicker(focusPicker) {
        const
            me = this,
            { _picker : picker } = me;

        if (!me.readOnly) {
            if (picker) {
                // In case a subclass uses a min getter (which does not update our min value):
                picker.setConfig({
                    range     : [me.min, me.max],
                    selection : me.value
                });
            }

            focusPicker = focusPicker || Boolean(me.confirmable);

            super.showPicker(focusPicker);
        }
    }

    //endregion
    // region Validation

    get isValid() {
        const
            me    = this,
            check = me.checkMinMax();

        me.clearError('L{Field.minimumValueViolation}', true);
        me.clearError('L{Field.maximumValueViolation}', true);

        if (check) {
            me.setError((check < 0) ? 'L{Field.minimumValueViolation}' : 'L{Field.maximumValueViolation}', true);
            return false;
        }

        return super.isValid;
    }

    //endregion
    //region Other

    setupLabel(lbl) {
        return super.setupLabel(ObjectHelper.assign({
            for : this.fieldStartDate.input.id
        }, lbl));
    }

    syncInputFieldValue() {}  // we have no input field

    syncValue(origin, value = this.value) {
        const
            me                  = this,
            { _picker: picker } = me,
            denormalized        = value?.[1] < value?.[0];

        if (picker?.isVisible && !me.confirmable) {
            // When there is no DateRangePicker (just a MultiDatePicker), the start/end DateField's in the field's
            // container are used for manipulating the date range directly. This bit of logic matches similar logic
            // found in DateRangePicker as it deals with its own pair of DateField's.
            let ensureVisible;

            if (origin === 'fieldEndDate') {
                ensureVisible = 2;

                if (denormalized) {
                    value = [value[1], value[1]];
                }
            }
            else if (origin === 'fieldStartDate') {
                ensureVisible = 1;

                if (denormalized) {
                    value = [value[0], value[0]];
                }
            }

            if (ensureVisible && value && !me.isConstructing) {
                picker.ensureVisible(value[ensureVisible - 1]);
            }
        }

        if (origin !== 'picker' && picker) {
            picker.selection = value;
        }

        super.syncValue(origin, value);
    }

    //endregion
}

// Register this widget type with its Factory
DateRangeField.initClass();
