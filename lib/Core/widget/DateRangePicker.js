import MultiDatePicker from './MultiDatePicker.js';
import AbstractDateRange from './mixin/AbstractDateRange.js';

import './ConfirmationBar.js';
import DomHelper from '../helper/DomHelper.js';

DomHelper.loadStylesheet('Core/widget/DateRangePicker.css');

// import Stylesheet from './DateRangePicker.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'DateRangePicker');

/**
 * @module Core/widget/DateRangePicker
 */

/**
 * This widget is used by {@link Core.widget.DateRangeField} to present a range of selected dates across multiple
 * months.
 *
 * {@inlineexample Core/widget/DateRangePicker.js}
 *
 * @extends Core/widget/MultiDatePicker
 * @mixes Core/widget/mixin/AbstractDateRange
 * @internalwidget
 */
export default class DateRangePicker extends MultiDatePicker.mixin(AbstractDateRange) {
    static $name = 'DateRangePicker';
    static type = 'daterangepicker';

    static configurable = {

        /**
         * @hideconfigs multiSelect, selection
         */

        /**
         * Enables OK/Cancel button bar to accept date range changes. A value of `true` shows the OK and Cancel buttons.
         * @prp {Core.widget.ConfirmationBar}
         * @accepts {Boolean|ConfirmationBarConfig}
         */
        confirmable : null,

        datePickerDefaults : {
            // focus is never on the date pickers, but only on fieldStartDate/fieldEndDate or one of the buttons
            focusable : false,

            internalListeners : {
                beforeDateSelect : 'up.onDatePickerBeforeDateSelect'
            }
        },

        keyMap : {
            // when focus is not on the buttons, this widget will process Enter/Escape keys by delegating them to the
            // ConfirmationBar's keyMap:
            delegate : 'confirmable'
        },

        /**
         * Unlike its base class {@link Core.widget.MultiDatePicker}, this config must be set to `'range'`.
         * @config {'range'}
         * @default
         */
        multiSelect : 'range',

        /**
         * The `selection` defined by {@link Core.widget.MultiDatePicker#config-selection} and the `value` defined by
         * {@link Core.widget.mixin.AbstractDateRange#config-value} are synchronized. Use of `value` is preferred since
         * this widget is used together with {@link Core.widget.DateRangeField} which also uses `value`.
         * @config {Date[]|String[]}
         * @default
         */
        selection : ['today', 'today'],

        stripDefaults : {
            bbar : {
                type : 'confirmationbar'
            }
        },

        tbar : {
            items : {
                spacer : {
                    type   : 'widget',
                    flex   : 1,
                    weight : 0
                }
            }
        }
    };

    get dateFieldContainer() {
        return this.tbar;
    }

    // confirmable

    changeConfirmable(confirmable) {
        this.bbar = confirmable;

        return this.bbar;
    }

    updateConfirmable(confirmable) {
        this.detachListeners('confirmable');

        confirmable?.ion({
            name    : 'confirmable',
            thisObj : this,
            choice  : 'doConfirm'
        });
    }

    //---------------------------------------------------------------------------------------------------------

    get isValid() {
        return this.checkValid();
    }

    configureDatePicker(index, me, existing) {
        const config = super.configureDatePicker(index, me, existing);

        config.selection = this.selection;

        return config;
    }

    onDatePickerBeforeDateSelect({ date }) {
        this.applyDate(date, this.fieldStartDate, this.fieldEndDate);

        return false;
    }

    doConfirm({ choice, event, userAction }) {
        this.trigger('confirm', {
            choice,
            event,
            userAction
        });
    }

    internalOnKeyDown(event) {
        const { confirmable } = this;

        let choice = confirmable?.hotKeys[event.virtualKey];

        if (choice) {
            if (choice === 'default') {
                choice = confirmable.defaultButton;
            }

            choice && this.doConfirm({
                event,
                choice : {
                    [choice] : true,
                    name     : choice
                }
            });
        }
        else {
            super.internalOnKeyDown(event);
        }
    }

    /**
     * Synchronizes the `selection` and `value` configs with each date pickers' selection.
     * @param {'picker'|'selection'|'value'} origin The origin of the change in selection
     * @param {Date[]} selection The new selection
     * @internal
     */
    syncSelection(origin, selection = this.selection) {
        super.syncSelection(origin, selection);

        // MultiDatePicker has a "selection" config (to mimic DatePicker), while AbstractDateRange has a "value" config
        // to fit in the Field class hierarchy. When we are syncing the selection from the value, we have nothing to
        // do here. When the origin is not the "value" config, we need to sync the value to the selection:
        if (origin !== 'value') {
            this.syncValue('selection', selection);
        }
    }

    /**
     * Synchronizes the widget's state to a new `value`.
     * @param {'fieldEndDate'|'fieldStartDate'|'selection'|'value'} origin The origin of the value change.
     * @param {Date[]} value
     * @internal
     */
    syncValue(origin, value = this.value) {
        const
            me = this,
            denormalized = value?.[1] < value?.[0];

        // See also DateRangeField#syncValue
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
            me.ensureVisible(value[ensureVisible - 1]);
        }

        // As with syncSelection above, if the origin of the value change is not the "selection", we need to sync the
        // selection to the new value:
        if (origin !== 'selection') {
            me.syncSelection('value', value);
        }

        // do this last so the change event fires after everything has settled
        super.syncValue(origin, value);
    }

    triggerChange(event, userAction = Boolean(this._isUserAction)) {
        const { value, _lastValue : oldValue, isValid : valid }  = this;

        // trigger change event, signaling that origin is from user
        this.triggerFieldChange({ value, oldValue, event, userAction, valid });
    }
}

// Register this widget type with its Factory
DateRangePicker.initClass();
