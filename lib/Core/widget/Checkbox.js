import Field from './Field.js';
import Widget from './Widget.js';
import DomHelper from '../helper/DomHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';

DomHelper.loadStylesheet('Core/widget/Checkbox.css');

// import Stylesheet from './Checkbox.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Checkbox');

/**
 * @module Core/widget/Checkbox
 */

const whenNotChecked = field => !field.value;

/**
 * A checkbox field that wraps `<input type="checkbox">` and provides a boolean toggle with an optional
 * {@link #config-text} label to the right and configurable {@link #config-color}. The field's
 * {@link #config-checked} state maps to its {@link #config-value}, and the values returned when checked or unchecked
 * are controlled via {@link #config-checkedValue} and {@link #config-uncheckedValue}. This field can be used as a
 * cell {@link Grid.column.Column#config-editor} in a Grid.
 *
 * {@inlineexample Core/widget/Checkbox.js one-column}
 *
 * ```javascript
 * const checkbox = new Checkbox({
 *     label   : 'Agree to terms',
 *     text    : 'I accept',
 *     checked : false,
 *     appendTo : document.body
 * });
 * ```
 *
 * Color can be specified, and you can optionally configure {@link #config-text} to display in a label to the right of
 * the checkbox in addition to a standard field {@link #config-label}:
 *
 * {@inlineexample Core/widget/CheckboxTextLabel.js vertical}
 *
 * ## Useful configs and properties
 *
 * | Config                         | Description                                       |
 * |--------------------------------|---------------------------------------------------|
 * | {@link #config-checked}        | Initial checked state                             |
 * | {@link #config-text}           | Label text displayed to the right of the checkbox |
 * | {@link #config-color}          | Checkbox color (must have a matching CSS rule)    |
 * | {@link #config-checkedValue}   | Value provided when checked                       |
 * | {@link #config-uncheckedValue} | Value provided when unchecked                     |
 * | {@link #config-label}          | Field label displayed beside the checkbox         |
 *
 * ## Nested Items
 * A checkbox can also have a {@link #config-container} of additional {@link Core.widget.Container#config-items}. These
 * items can be displayed immediately following the field's label (which is the default when there is only one item) or
 * below the checkbox. This can be controlled using the {@link #config-inline} config.
 *
 * In the demo below notice how additional fields are displayed when the checkboxes are checked:
 *
 * {@inlineexample Core/widget/Checkbox-items.js one-column}
 *
 * ## See also
 *
 * - {@link Core.widget.SlideToggle} - Toggle switch variation of Checkbox
 * - {@link Core.widget.CheckboxGroup} - Group widget for multiple-selection checkboxes
 * - {@link Core.widget.Radio} - Radio button for single-selection groups
 *
 * @extends Core/widget/Field
 * @classtype checkbox
 * @classtypealias check
 * @inputfield
 */
export default class Checkbox extends Field {
    //region Config

    /**
     * @hideconfigs clearable, placeholder, editable
     */
    static $name = 'Checkbox';

    static type = 'checkbox';

    static alias = 'check';

    static configurable = {
        inputType : 'checkbox',

        /**
         * Specify `true` to automatically {@link Core.widget.FieldContainer#config-collapsed collapse} the field's
         * {@link #config-container} when the field is not {@link #property-checked}.
         *
         * Alternatively, this can be a function that returns the desired `collapse` state when passed the field
         * instance as its one parameter.
         *
         * @config {Boolean|Function}
         * @returns {Boolean}
         * @default false
         */
        autoCollapse : null,

        toggleGroupRootElement : null,

        containerDefaults : {
            syncableConfigs : {
                disabled : field => field.disabled || !field.value
            },

            syncConfigTriggers : {
                autoCollapse : 1,
                value        : 1
            }
        },

        /**
         * Get/set label
         * @member {String} name
         */
        /**
         * Text to display on checkbox label
         * @config {String}
         */
        text : null,

        /**
         * The value to provide for this widget in {@link Core.widget.Container#property-values} when it is
         * {@link #property-checked}.
         * A value of `undefined` will cause this widget not to include its value when checked.
         * @config {*}
         * @default
         */
        checkedValue : true,

        /**
         * The value to provide for this widget in {@link Core.widget.Container#property-values} when it is not
         * {@link #property-checked}.
         *
         * A value of `undefined` will cause this widget to not include its value when it is unchecked.
         * @config {*}
         * @default
         */
        uncheckedValue : false,

        /**
         * The checked state. The same as `value`.
         * @prp {Boolean} checked
         */

        /**
         * Checkbox color, must have match in CSS
         * @config {String}
         */
        color : null,

        /**
         * The value of the checkbox. This is the same as `checked`.
         * @prp {Boolean}
         */
        value : false,

        toggleGroup : null,

        localizableProperties : ['label', 'text'],

        // Works both for a MenuItem twin and a same-type twin, since a Checkbox's `value` is an alias of `checked`
        twinSyncConfigs : {
            value : 'checked'
        }
    };

    //endregion

    //region Init

    construct(config) {
        // Convert checked to value so that initializing getter can read it if requested prior to trying to set it.
        if ('checked' in config) {
            config = ObjectHelper.assign({}, config);  // copy inherited properties unlike Object.assign()
            config.value = config.checked;
            delete config.checked;
        }

        super.construct(config);

        // this.syncHasText();
    }

    updateClearable() {}
    updateEditable() {}

    get textLabelCls() {
        return 'b-checkbox-label';
    }

    // Implementation needed at this level because it has two inner elements in its inputWrap
    get innerElements() {
        const me = this;

        return [
            me.inputElement,
            {
                tag   : 'div',
                class : 'b-checkbox-box'
            },
            me.text != null && {
                tag       : 'label',
                class     : me.textLabelCls,
                for       : `${me.id}-input`,
                reference : 'textLabel',
                html      : me.text
            }
        ];
    }

    get inputElement() {
        const config = super.inputElement;

        if (this.toggleGroup) {
            config.dataset = {
                group : this.toggleGroup
            };
        }

        config.listeners = {
            click  : 'internalOnClick',
            change : 'internalOnChange',
            input  : 'internalOnInput'
        };

        return config;
    }

    //endregion

    //region Toggle

    get checked() {
        return this.value;
    }

    set checked(value) {
        this.value = value;
    }

    updateText(value) {
        if (this.textLabel) {
            this.textLabel.innerHTML = value;
        }
    }

    compose() {
        const { text } = this;

        return {
            class : {
                'b-text' : text != null
            }
        };
    }

    afterSyncChildConfigs(container) {
        super.afterSyncChildConfigs(container);

        let { autoCollapse } = this;

        if (autoCollapse) {
            autoCollapse = (autoCollapse === true) ? whenNotChecked : autoCollapse;

            container.collapsed = autoCollapse(this);
        }
    }

    assignFieldValue(values, key, value) {
        this.value = (value === this.checkedValue) || (value === this.uncheckedValue ? false : null);
    }

    fetchInputValue() {
        if (!this.readOnly) {
            this.value = this.input.checked;
        }
    }

    gatherValue(values) {
        const
            me = this,
            value = me.value ? me.checkedValue : me.uncheckedValue,
            storedValue = value !== undefined,
            { valueName } = me;

        if (storedValue) {
            values[valueName] = value;
        }

        me.gatherValues(values, storedValue);

        if (value === true && values[valueName]?.value === value) {
            delete values[valueName].value;
        }
    }

    changeValue(value) {
        return (value === 'false') ? false : Boolean(value);
    }

    updateValue(value) {
        const
            me      = this,
            changed = me.input.checked !== value;

        me.input.checked = value;

        me.container?.syncChildConfigs();

        if (changed && !me.inputting && !me.isConfiguring) {
            me.uncheckToggleGroupMembers();

            // The change event does not fire on programmatic change of input.
            me.triggerChange(false, null);
        }
    }

    get inputValueAttr() {
        return 'checked';
    }

    // updateColor(value, was) {
    //     const classes = this.element.classList;
    //
    //     if (was) {
    //         classes.remove(was);
    //     }
    //
    //     if (value) {
    //         classes.add(value);
    //     }
    // }

    getToggleGroupRootElement() {
        const value = this.toggleGroupRootElement;

        let result;

        // if selector is provided
        if (value && typeof value === 'string' && this.element) {
            result = this.element.closest(value);
        }

        return result || this.rootElement;
    }

    getToggleGroupMembers() {
        const
            me     = this,
            {
                toggleGroup,
                input : checkedElement,
                type
            }      = me,
            result = [];

        if (toggleGroup) {
            const root = me.getToggleGroupRootElement();
            DomHelper.forEachSelector(root, `input[type=${type}][data-group="${toggleGroup}"]`, inputEl => {
                if (inputEl !== checkedElement) {
                    const partnerCheckbox = Widget.fromElement(inputEl);
                    // A partner only belongs to this toggle group if it resolves to
                    // the same root (e.g. a radio inside a <form> is a separate group from a form-less same-name one)
                    if (partnerCheckbox?.getToggleGroupRootElement?.() === root) {
                        result.push(partnerCheckbox);
                    }
                }
            });
        }

        return result;
    }

    uncheckToggleGroupMembers(userAction) {
        if (this.checked && this.toggleGroup) {
            this.getToggleGroupMembers().forEach(widget => {
                widget._propagatingUserActionFrom = this;
                widget.checked = false;
                widget._propagatingUserActionFrom = null;
            });
        }
    }

    /**
     * Check the box
     */
    check() {
        this.checked = true;
    }

    /**
     * Uncheck the box
     */
    uncheck() {
        this.checked = false;
    }

    /**
     * Toggle checked state. If you want to force a certain state, assign to {@link #property-checked} instead.
     */
    toggle() {
        this.checked = !this.checked;
    }

    //endregion

    //region Events

    internalOnClick(event) {
        // Native checkboxes has no readonly attribute, we prevent toggling it here instead
        if (this.readOnly) {
            event.preventDefault();
            return false;
        }

        /**
         * Fires when the checkbox is clicked
         * @event click
         * @param {Core.widget.Checkbox} source The checkbox
         * @param {Event} event DOM event
         */
        return this.trigger('click', { event });
    }

    /**
     * Triggers events when user toggles the checkbox
     * @fires beforeChange
     * @fires change
     * @fires action
     * @private
     */
    internalOnChange(event) {
        const me = this;

        // Chrome sets the checked state when re-enabling, so it has to be reset
        if (me.readOnly && me.value !== me.input.checked) {
            me.input.checked = me.value;
            return;
        }

        me.value = me.input.checked;

        if (!me.inputting) {
            me.inputting = true;

            me.triggerChange(true, event);

            me.inputting = false;
        }
    }

    // Need to catch changes even if readOnly, because of chrome behaviour when re-enabling
    updateInputReadOnly(readOnly) {}

    /**
     * Triggers events when checked state is changed
     * @fires beforeChange
     * @fires change
     * @fires action
     * @private
     */
    triggerChange(userAction, event) {
        const
            me = this,
            { checked } = me.input;

        // Prevent uncheck if this checkbox is part of a toggleGroup (radio-button mode) ..also ensure the group has
        // visible active members
        const eventObject = { checked, value : checked, oldValue : !checked, userAction, valid : true, event };

        if (me._propagatingUserActionFrom) {
            eventObject.propagatingUserActionFrom = me._propagatingUserActionFrom;
        }

        /**
         * Fired before checkbox is toggled. Returning false from a listener prevents the checkbox from being toggled.
         * @event beforeChange
         * @preventable
         * @param {Core.widget.Checkbox} source Checkbox
         * @param {Boolean} checked - Checked state (=value)
         * @param {Boolean} value - This field's value
         * @param {Boolean} oldValue - This field's previous value
         * @param {Boolean} userAction - Triggered by user taking an action (`true`) or by setting a value (`false`)
         * @param {Boolean} valid - True if this field is in a valid state.
         * @param {Event} event - The triggering DOM event if any
         */
        const prevented = (!checked && userAction && me.toggleGroup &&
                me.getToggleGroupMembers().filter(widget => widget.isVisible && !widget.disabled).length) ||
            // Since Widget has Events mixed in configured with 'callOnFunctions' this will also call onBeforeChange,
            // onChange and onAction
            me.trigger('beforeChange', eventObject) === false;

        // If prevented need to rollback the checkbox input
        if (prevented) {
            // Input change is not preventable, so need to revert the changes
            // The change event does not fire on programmatic change of input, so no need to suspend
            me.input.checked = me._value = !checked;
        }
        else {
            me.triggerFieldChange(eventObject, false);

            if (userAction) {
                me.uncheckToggleGroupMembers(userAction);
            }

            /**
             * User performed the default action (toggled the checkbox)
             * @event action
             * @param {Core.widget.Checkbox} source Checkbox
             * @param {Boolean} checked - Checked state (=value)
             * @param {Boolean} value - This field's value
             * @param {Boolean} valid - True if this field is in a valid state
             * @param {Boolean} oldValue - This field's previous value
             * @param {Boolean} userAction - Triggered by user taking an action (`true`) or by setting a value (`false`)
             * @param {Event} event - The triggering DOM event if any
             */
            me.trigger('action', eventObject);

            /**
             * Fired when checkbox is toggled
             * @event change
             * @param {Core.widget.Checkbox} source Checkbox
             * @param {Boolean} checked - Checked state (=value)
             * @param {Boolean} value - This field's value
             * @param {Boolean} oldValue - This field's previous value
             * @param {Boolean} userAction - Triggered by user taking an action (`true`) or by setting a value (`false`)
             * @param {Boolean} valid - True if this field is in a valid state.
             * @param {Event} event - The triggering DOM event if any
             */
            me.trigger('change', eventObject);

            return true;
        }
    }

    //endregion

    // An overflowing checkbox converts to a checkable MenuItem unless overflowTwinConfig specifies another type
    get overflowTwinBaseType() {
        return 'menuitem';
    }

    configureOverflowTwin(overrides) {
        const
            me     = this,
            config = super.configureOverflowTwin(overrides);

        if (me.overflowTwinIsMenuItem) {
            config.type = Widget.resolveType('menuitem');

            // A MenuItem uses 'text', not 'label'.
            if (!config.text) {
                config.text = me.label || me.text || me.tooltipText;
            }
        }

        return config;
    }
}

// Register this widget type with its Factory
Checkbox.initClass();
