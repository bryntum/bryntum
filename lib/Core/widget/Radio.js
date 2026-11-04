import Checkbox from './Checkbox.js';
import DomHelper from '../helper/DomHelper.js';

DomHelper.loadStylesheet('Core/widget/Radio.css');

// import Stylesheet from './Radio.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Radio');

/**
 * @module Core/widget/Radio
 */

/**
 * A radio button field that wraps `<input type="radio">`, allowing the user to select exactly one option from a
 * group of buttons sharing the same {@link #config-name}. Supports configurable {@link #config-color} and an
 * optional {@link #config-text} label to the right. Set {@link #config-clearable} to allow unchecking the current
 * selection. For a higher-level API that manages a set of radio buttons automatically, see
 * {@link Core.widget.RadioGroup}.
 *
 * {@inlineexample Core/widget/Radio.js one-column}
 *
 * ```javascript
 * const radio = new Radio({
 *     text         : 'Option A',
 *     name         : 'choice',
 *     checkedValue : 'A',
 *     appendTo     : document.body
 * });
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config                       | Description                                           |
 * |------------------------------|-------------------------------------------------------|
 * | {@link #config-text}         | Label text displayed to the right of the radio button |
 * | {@link #config-color}        | Radio button color (must have a matching CSS rule)    |
 * | {@link #config-clearable}    | Allow unchecking by clicking a checked radio button   |
 * | {@link #config-checkedValue} | Value provided when this radio button is selected     |
 * | {@link #config-label}        | Field label displayed beside the radio button         |
 *
 * Color can be specified, and you can optionally configure {@link #config-text} to display in a label to the right of
 * the radio button instead of, or in addition to, a standard field {@link #config-label}.
 *
 * {@inlineexample Core/widget/RadioColors.js vertical}
 *
 * ## Nested Items
 * A radio button can also have a {@link #config-container} of additional {@link Core.widget.Container#config-items}.
 * These items can be displayed immediately following the field's label (which is the default when there is only one
 * item) or below the radio button. This can be controlled using the {@link #config-inline} config.
 *
 * In the demo below notice how additional fields are displayed for the checked radio button:
 *
 * {@inlineexample Core/widget/Radio-items.js vertical}
 *
 * ## See also
 *
 * - {@link Core.widget.RadioGroup} - Container that manages a set of Radio buttons
 * - {@link Core.widget.Checkbox} - Checkbox for independent boolean toggles
 * - {@link Core.widget.SlideToggle} - Toggle switch variation
 *
 * @extends Core/widget/Checkbox
 * @classtype radio
 * @classtypealias radiobutton
 * @widget
 */
export default class Radio extends Checkbox {
    //region Config

    static $name = 'Radio';

    static type = 'radio';

    static alias = 'radiobutton';

    static configurable = {
        inputType : 'radio',

        /**
         * Set this to `true` so that clicking a checked radio button will clear its checked state.
         * @config {Boolean}
         * @default false
         */
        clearable : null,

        toggleGroupRootElement : 'form',

        uncheckedValue : undefined  // won't store to Container#values when unchecked
    };

    //endregion

    //region Init

    get textLabelCls() {
        return super.textLabelCls + ' b-radio-label';
    }

    //endregion

    internalOnClick(info) {
        if (super.internalOnClick(info) !== false) {
            if (this.checked && this.clearable) {
                this.checked = false;
            }
        }
    }

    updateName(name) {
        this.toggleGroup = name;
    }

    // Empty override to get rid of clear trigger
    updateClearable() {}
}

// Register this widget type with its Factory
Radio.initClass();
