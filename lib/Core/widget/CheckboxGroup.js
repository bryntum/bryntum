import RadioGroup from './RadioGroup.js';
import BrowserHelper from '../helper/BrowserHelper.js';
import DomHelper from '../helper/DomHelper.js';
import Validatable from './mixin/Validatable.js';

DomHelper.loadStylesheet('Core/widget/CheckboxGroup.css');

// import Stylesheet from './CheckboxGroup.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'CheckboxGroup');

/**
 * @module Core/widget/CheckboxGroup
 */

/**
 * A container for a set of related {@link Core.widget.Checkbox} widgets, allowing the user to select multiple options
 * from the group. Provide the choices via the convenient {@link #config-options} shorthand or as individual Checkbox
 * child items. The group's {@link #property-value} reflects the array of checked checkbox values and can be read from
 * a parent container's {@link #property-values}. Enforce selection limits with
 * {@link #property-requiredSelectedOptions}, {@link #property-minSelectedOptions}, and
 * {@link #property-maxSelectedOptions}.
 *
 * ```javascript
 * const checkboxGroup = new CheckboxGroup({
 *     appendTo : document.body,
 *     title    : 'Select cities',
 *     name     : 'cities',
 *     value    : 'London',
 *     options  : {
 *         London    : 'London',
 *         Madrid    : 'Madrid',
 *         Stockholm : 'Stockholm',
 *         Sydney    : 'Sydney'
 *     }
 * });
 * ```
 *
 * {@inlineexample Core/widget/CheckboxGroup.js vertical}
 *
 * ## Useful configs and properties
 *
 * | Config / Property                         | Description                                           |
 * |-------------------------------------------|-------------------------------------------------------|
 * | {@link #config-options}                   | Object mapping values to display labels               |
 * | {@link #config-name}                      | Name used when reading/writing container values       |
 * | {@link #config-inline}                    | Display checkboxes horizontally instead of vertically |
 * | {@link #property-value}                   | Array of checked checkbox values                      |
 * | {@link #property-requiredSelectedOptions} | Minimum required selections for validation            |
 *
 * The {@link #config-name} config is required for this widget, and it will be assigned to all checkboxes created by
 * processing the {@link #config-options} config.
 *
 * ## Vertical or horizontal layout
 *
 * The default orientation is vertical, but you can change it to horizontal by setting the {@link #config-inline}
 * config to `true`.
 *
 * {@inlineexample Core/widget/CheckboxGroupHorizontal.js}
 *
 * ## Disabled
 *
 * {@inlineexample Core/widget/CheckboxGroupDisabled.js}
 *
 * ## Validation
 *
 * You can set {@link #property-requiredSelectedOptions}, {@link #property-minSelectedOptions} and
 * {@link #property-maxSelectedOptions} to force users to select the right amount of options.
 *
 * {@inlineexample Core/widget/CheckboxGroupValidation.js}
 *
 * ## See also
 *
 * - {@link Core.widget.Checkbox} - Individual checkbox widget
 * - {@link Core.widget.RadioGroup} - Similar group widget for single-selection radio buttons
 * - {@link Core.widget.FieldSet} - Base fieldset container
 *
 * @extends Core/widget/RadioGroup
 * @classtype checkboxGroup
 * @widget
 */
export default class CheckboxGroup extends RadioGroup.mixin(Validatable)  {
    //region Config

    static $name = 'CheckboxGroup';

    static type = 'checkboxgroup';

    /**
     * Fired before one of the checkboxes is toggled, return `false` to prevent the action.
     * @event beforeChange
     * @param {String[]} value This widget's value
     * @ts-param value {String|String[]} // Widened for compatibility with the RadioGroup event
     * @param {Core.widget.CheckboxGroup} source This widget
     * @ts-param source {Core.widget.RadioGroup} // Widened for compatibility with the RadioGroup event
     * @preventable
     */

    /**
     * Fired when one of the checkboxes is toggled.
     * @event change
     * @param {String[]} value This widget's value
     * @ts-param value {String|String[]} // Widened for compatibility with the RadioGroup event
     * @param {Core.widget.CheckboxGroup} source This widget
     * @ts-param source {Core.widget.RadioGroup} // Widened for compatibility with the RadioGroup event
     */

    static configurable = {
        defaultType : 'checkbox',
        defaults    : {
            color : 'b-blue'
        },
        separator : ',',

        /**
         * @hideconfigs clearable
         */

        /**
         * The set of options for this checkbox group. The keys of this object hold the checkbox's
         * {@link Core.widget.Checkbox#config-checkedValue} while the object values are a string for the checkbox's
         * {@link Core.widget.Checkbox#config-text} or a config object for that checkbox.
         *
         * The {@link #property-value} of this checkbox group will be one of the keys in this object or `null`
         * if no checkbox is checked.
         *
         * Example:
         * ```javascript
         *  {
         *      type    : 'checkboxgroup',
         *      name    : 'resolution',
         *      value   : 'A',
         *      title   : 'Allergies',
         *      options : {
         *          A : 'Gluten',
         *          B : 'Bacon',
         *          C : 'Lactose',
         *          D : 'Fish'
         *      }
         *  }
         * ```
         * @config {Object<String,String|CheckboxConfig>} options
         */

        /**
         * The number of options the user is required to select for this field to be valid. See also
         * {@link #property-minSelectedOptions} and {@link #property-maxSelectedOptions} if you would like
         * to use a range.
         * @prp {Number}
         */
        requiredSelectedOptions : null,

        /**
         * The minimum number of options to select
         * @prp {Number}
         */
        minSelectedOptions : null,

        /**
         * The maximum number of options to select
         * @prp {Number}
         */
        maxSelectedOptions : null,

        errorTooltipCachePath : 'checkboxGroupErrorTooltip',
        errorTooltipConfig    : {
            forSelector : '.b-checkboxgroup.b-invalid .b-checkbox-label',
            align       : 't-b'
        },

        // Avoid assignValues trying to set values on checkboxes
        isolateFields : true
    };

    onItemBeforeChange(ev) {
        const
            me            = this,
            { lastValue } = me;

        if (!me.reverting && me.trigger('beforeChange', me.wrapRadioEvent(ev)) === false) {
            if (lastValue != null && lastValue !== me.value) {
                me.reverting = true;

                ev.source.uncheckToggleGroupMembers();
                me.value = lastValue;
                me.lastValue = lastValue;

                me.reverting = false;

                return false;
            }
        }
    }

    onItemChange(ev) {
        const me = this;

        if (!me.reverting) {
            me.triggerFieldChange(me.wrapRadioEvent(ev));
            me.lastValue = me.value;
        }

        me.syncInvalid();
    }

    get selected() {
        return this.existingOptions.filter(c => c.input.checked) || null;
    }

    /**
     * This property corresponds to the {@link Core.widget.Checkbox#config-checkedValue} of all the currently
     * {@link Core.widget.Checkbox#property-checked} checkboxes.
     *
     * Accepts a comma-separated string representing the checked values.
     * @prp {String[]}
     * @accepts {String|String[]}
     */
    get value() {
        const { selected } = this;

        return selected.map(widget => widget.checkedValue);
    }

    set value(value) {
        value = value || [];

        if (typeof value === 'string') {
            value = value.split(this.separator);
        }

        this.existingOptions.forEach(c => {
            c.isConfiguring = this.isConfiguring;
            c.checked = value.includes(c.checkedValue);
            c.isConfiguring = false;
        });

        // in FireFox if the field is detached remember the provided value to reapply it later
        if (BrowserHelper.isFirefox && !this.isConnected) {
            this.__value = value;
        }
    }

    internalOnChange() {
        this.syncInvalid();
    }

    // region validation

    // CheckboxGroup has no wrapper like field does
    // so return element instead since error tooltip uses field.inputWrap
    get inputWrap() {
        return this.element;
    }

    get isValid() {
        let result = true;

        const
            me = this,
            { selected, requiredSelectedOptions, minSelectedOptions, maxSelectedOptions } = me;

        me.clearError(undefined, true);

        if (!me.disabled) {
            const
                minOk = isNaN(me.minSelectedOptions) || selected.length >= minSelectedOptions,
                maxOk = isNaN(me.maxSelectedOptions) || selected.length <= maxSelectedOptions;

            if (requiredSelectedOptions && selected.length !== requiredSelectedOptions) {
                result = false;
                me.setError(me.L('L{wrongNbrOfOptionsSelected}', requiredSelectedOptions), true);
            }
            else if (!minOk) {
                result = false;
                me.setError(me.L('L{tooFewOptionsSelected}', minSelectedOptions), true);
            }
            else if (!maxOk) {
                result = false;
                me.setError(me.L('L{tooManyOptionsSelected}', maxSelectedOptions), true);
            }
        }

        if (result && me.errors && Object.keys(me.errors).length) {
            result = false;
        }

        return result;
    }

    updateMinSelectedOptions() {
        if (!this.isConfiguring) {
            this.syncInvalid();
        }
    }

    updateMaxSelectedOptions() {
        if (!this.isConfiguring) {
            this.syncInvalid();
        }
    }

    updateRequiredSelectedOptions() {
        if (!this.isConfiguring) {
            this.syncInvalid();
        }
    }
    // endregion
}

// Register this widget type with its Factory
CheckboxGroup.initClass();
