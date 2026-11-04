import Combo from './Combo.js';

/**
 * @module Core/widget/BooleanCombo
 */

/**
 * A specialized {@link Core.widget.Combo} that presents exactly two options representing `true` and `false`. It is
 * useful for editing boolean fields in forms or as an inline cell editor in a {@link Grid.column.Column Grid column}.
 * The display text for each option defaults to the localized "Yes"/"No" strings but can be customized using
 * {@link #config-positiveText} and {@link #config-negativeText}.
 *
 * ```javascript
 * const combo = new BooleanCombo({
 *     label         : 'Active',
 *     positiveText  : 'Enabled',
 *     negativeText  : 'Disabled',
 *     value         : true,
 *     appendTo      : document.body
 * });
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config                                 | Description                                                        |
 * |----------------------------------------|--------------------------------------------------------------------|
 * | {@link #config-positiveValue}          | The value representing the positive/true option (default `true`)   |
 * | {@link #config-positiveText}           | Display text for the positive option (default localized "Yes")     |
 * | {@link #config-negativeValue}          | The value representing the negative/false option (default `false`) |
 * | {@link #config-negativeText}           | Display text for the negative option (default localized "No")      |
 * | {@link Core.widget.Field#config-value} | Gets or sets the current boolean value                             |
 *
 * ## See also
 *
 * - {@link Core.widget.Combo} - Base combo class with filtering, remote loading, and multiselect
 * - {@link Core.widget.Checkbox} - Alternative boolean input rendered as a checkbox
 *
 * @extends Core/widget/Combo
 * @classtype booleancombo
 * @widget
 */
export default class BooleanCombo extends Combo {

    static $name = 'BooleanCombo';

    static type = 'booleancombo';

    //region Config
    static configurable = {
        /**
         * Positive option value
         *
         * @config {*}
         */
        positiveValue : true,

        /**
         * Positive option display value
         *
         * @config {String}
         */
        positiveText : null,

        /**
         * Negative option value
         *
         * @config {*}
         */
        negativeValue : false,

        /**
         * False option display value
         *
         * @config {String}
         */
        negativeText : null,

        store : {
            value : [],

            $config : 'lazy'
        },

        /**
         * Default value
         *
         * @config {*}
         */
        value : false
    };
    //endregion

    changeStore(store, oldStore) {
        const me = this;

        // We must call super.changeStore() in order to deduce valueField. We pass a store config rather than an array
        // (which would call back here, recursing) or a Store instance (which Combo would never destroy).
        return super.changeStore({
            data : [{
                id   : me.positiveValue,
                text : me.positiveText || me.L('L{Object.Yes}')
            }, {
                id   : me.negativeValue,
                text : me.negativeText || me.L('L{Object.No}')
            }]
        }, oldStore);
    }
}

// Register this widget type with its Factory
BooleanCombo.initClass();
