import Widget from './Widget.js';
import Badge from './mixin/Badge.js';
import Labelable from './mixin/Labelable.js';
import Transitionable from './mixin/Transitionable.js';
import Validatable from './mixin/Validatable.js';
import EventHelper from '../helper/EventHelper.js';
import FunctionHelper from '../helper/FunctionHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import DomHelper from '../helper/DomHelper.js';
import StringHelper from '../helper/StringHelper.js';
import ClickRepeater from '../util/ClickRepeater.js';
import DynamicObject from '../util/DynamicObject.js';

import './FieldContainer.js';

DomHelper.loadStylesheet('Core/widget/Label.css');
DomHelper.loadStylesheet('Core/widget/Field.css');

// import LabelStylesheet from './Label.css' with { type: 'css' };
// DomHelper.applyStylesheet(LabelStylesheet, 'Label');
// import Stylesheet from './Field.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Field');

/**
 * @module Core/widget/Field
 */

const
    byWeight        = (l, r) => (l.weight || 0) - (r.weight || 0),
    byWeightReverse = (l, r) => (r.weight || 0) - (l.weight || 0),
    { emptyArray }   = Widget,
    // Keyboard shortcut for the `clear` trigger. Announced on the input via `aria-keyshortcuts`
    // because the trigger itself is `aria-hidden` and not a tab stop.
    clearKey        = 'Alt+Backspace',
    triggerConfigs  = {
        align  : true,
        weight : true
    };

// Should not have @classtype, since it cannot be created directly

/**
 * Base class for {@link Core.widget.TextField} and {@link Core.widget.NumberField}. Not to be used directly.
 *
 * Most subclasses can be used as editors for the {@link Grid.column.Column}. The most popular are:
 * - {@link Core.widget.TextField}
 * - {@link Core.widget.NumberField}
 * - {@link Core.widget.DateField}
 * - {@link Core.widget.TimeField}
 * - {@link Core.widget.Combo}
 *
 * @extends Core/widget/Widget
 * @mixes Core/widget/mixin/Badge
 * @mixes Core/widget/mixin/Labelable
 * @mixes Core/widget/mixin/Validatable
 * @abstract
 */
export default class Field extends Widget.mixin(Badge, Labelable, Validatable, Transitionable) {

    // <debug>
    // region Localization test
    static localization = [
        'L{badInput}',
        'L{patternMismatch}',
        'L{rangeOverflow}',
        'L{rangeUnderflow}',
        'L{stepMismatch}',
        'L{tooLong}',
        'L{tooShort}',
        'L{typeMismatch}',
        'L{valueMissing}'
    ];
    // endregion
    // </debug>

    //region Config

    static $name = 'Field';

    static type = 'field';

    static configurable = {
        // Override from Widget. Fields, having a semantically meaningful input element don't need a role.
        // They only need a role if they are a special input type such as combobox
        role : null,

        defaultBindProperty : 'value',

        /**
         * @hideconfigs htmlCls, content, tag, scrollable, html
         */

        /**
         * Set to `true`, completely bypasses validation logic (could be userful if your field is not `editable`
         * to the user).
         *
         * @config {Boolean}
         * @default false
         */
        skipValidation : null,

        /**
         * A function (or the name of a function in the ownership hierarchy) called during field validation
         * to perform custom validity checks. The function is called as part of the {@link #property-isValid}
         * evaluation, after the built-in {@link #config-required} check.
         *
         * Inside this function, use {@link #function-setError} to mark the field as invalid, or
         * {@link #function-clearError} to remove a previously set error. The field will be considered invalid
         * if any errors are present after this function runs.
         *
         * ```javascript
         * new TextField({
         *     label          : 'Username',
         *     checkValidity  : ({ value }) => {
         *         if (value && value.length < 3) {
         *             this.setError('Username must be at least 3 characters');
         *         }
         *         else {
         *             this.clearError('Username must be at least 3 characters');
         *         }
         *     }
         * });
         * ```
         *
         * It may also be specified as a string, in which case it is resolved to a method on an ancestor
         * widget (such as a Container or a Popup that owns this field):
         *
         * ```javascript
         * new Container({
         *     items : [{
         *         type           : 'textfield',
         *         label          : 'Username',
         *         checkValidity  : 'up.validateUsername'
         *     }],
         *
         *     validateUsername(field) {
         *         if (field.value && field.value.length < 3) {
         *             field.setError('Username must be at least 3 characters');
         *         }
         *         else {
         *             field.clearError('Username must be at least 3 characters');
         *         }
         *     }
         * });
         * ```
         *
         * @config {Function|String}
         * @param {Core.widget.Field} field The field being validated
         * @returns {void}
         * @category Validation
         */
        checkValidity : null,

        /**
         * Text to display in empty field.
         * @prp {String} placeholder
         */
        placeholder : null,

        /**
         * Gets or sets the value. The returned type will depend upon the Field subclass.
         *
         * `TextField` returns a `String`.
         *
         * `NumberField` returns a `Number`.
         *
         * `DateField` and `TimeField` return a `Date` object, and `null` if the field is empty.
         *
         * `Combo` will return a `String` if configured with `items` as a simple string array.
         * Otherwise it will return the {@link Core.widget.Combo#config-valueField} value from the
         * selected record, or `null` if no selection has been made.
         * @member {*} value
         */
        /**
         * Default value
         * @config {String}
         */
        value : '',

        /**
         * Name of the field which is used as a key to get/set values from/to the field.
         * Used prior to {@link Core.widget.Widget#config-ref ref} and {@link Core.widget.Widget#config-id id} in
         * {@link Core.widget.Container#property-values Container.values}.
         *
         * The config is useful when the field is used in EventEditor or TaskEditor to load/save values automatically.
         * @config {String}
         */
        name : null,

        /**
         * The labels to add either before or after the input field.
         * Each label may have the following properties:
         * * `html` The label text.
         * * `align` `'start'` or `'end'` which end of the field the label should go.
         * @config {Object[]}
         * @property {String} html Label text
         * @property {'start'|'end'} align Which end of the file the label should go
         * @category Label
         */
        labels : null,

        /**
         * Configure as `true` to indicate that a `null` field value is to be marked as invalid. This will
         * optionally append a * to the field label if {@link #property-showRequiredIndicator} is set.
         * @prp {Boolean}
         * @default false
         */
        required : null,

        /**
         *`true` to automatically display a * after the label for this field when it is {@link #property-required}.
         * @prp {String}
         */
        showRequiredIndicator : null,

        /**
         * Show a trigger to clear field, if this field is not {@link #config-readOnly}. The trigger is available
         * in the {@link #property-triggers} object under the name `clear`. May also be an object which
         * configures the `clear` {@link #property-triggers trigger}.
         *
         * Keyboard users can clear the field by pressing <kbd>Alt</kbd> + <kbd>Backspace</kbd>.
         *
         * @config {Boolean|FieldTriggerConfig}
         * @default false
         */
        clearable : null,

        /**
         * If this field is not {@link #config-readOnly}, then setting this option means that pressing
         * the <kbd>Escape</kbd> key after editing the field will revert the field to the value it had when
         * the user focused the field. If the field is _not_ changed from when focused, the {@link #config-clearable}
         * behaviour will be activated.
         * @config {Boolean}
         * @default false
         */
        revertOnEscape : null,

        /**
         * An optional string to display inside the input field as an overlay. This can be useful for displaying
         * a field's units.
         *
         * This config is ignored if {@link #config-hintHtml} is set.
         *
         * For example:
         * ```javascript
         *  {
         *      type  : 'numberfield',
         *      label : 'Temperature',
         *      hint  : '°C'
         *  }
         * ```
         *
         * This config can be set to a function to dynamically generate the `hint` text:
         * ```javascript
         *  {
         *      type  : 'numberfield',
         *      label : 'Duration',
         *      hint  : ({ value }) => (value === 1) ? 'Day' : 'Days'
         *  }
         * ```
         *
         * The function is passed an object with the following properties:
         *
         *  - `source` A reference to the field instance.
         *  - `value` The current value of the field.
         *
         * A `hint` function will be called when the field changes value.
         *
         * @config {String|Function}
         * @param {Object} data A data object
         * @param {Core.widget.Field} data.source A reference to the field instance
         * @param {*} data.value The current value of the field
         * @returns {String}
         * @category Label
         */
        hint : null,

        /**
         * This config is similar to {@link #config-hint} except that this config is used to display HTML content.
         * Since this can allow malicious content to be executed, be sure not to include user-entered data or to
         * encode such data (see {@link Core.helper.StringHelper#function-encodeHtml-static}).
         *
         * If this config is set, {@link #config-hint} is ignored.
         *
         * For example:
         * ```javascript
         *  {
         *      type     : 'numberfield',
         *      label    : 'Temperature',
         *      hintHtml : '<i>°C</i>'
         *  }
         * ```
         *
         * This config can be set to a function to dynamically generate the `hintHtml` text:
         * ```javascript
         *  {
         *      type     : 'numberfield',
         *      label    : 'Duration',
         *      hintHtml : ({ value }) => (value === 1) ? '<i>Day</i>' : '<i>Days</i>'
         *  }
         * ```
         *
         * The function is passed an object with the following properties:
         *
         *  - `source` A reference to the field instance.
         *  - `value` The current value of the field.
         *
         * A `hintHtml` function will be called when the field changes value.
         *
         * @config {String|Function}
         * @param {Object} data A data object
         * @param {Core.widget.Field} data.source A reference to the field instance
         * @param {*} data.value The current value of the field
         * @returns {String}
         * @category Label
         */
        hintHtml : null,

        /**
         * The width to apply to the `.b-field-inner` element, which encompasses the `input` element and any
         * triggers. If a number is specified, `px` will be used.
         *
         * @config {String|Number}
         * @category Input element
         */
        inputWidth : null,

        width : null,

        /**
         * The delay in milliseconds to wait after the last keystroke before triggering a change event.
         * Set to 0 to not trigger change events from keystrokes (listen for input event instead to have
         * immediate feedback, change will still be triggered on blur).
         *
         * If the field is {@link #config-clearable}, the change event fires immediately on receiving
         * the clear gesture.
         * @config {Number}
         * @default
         */
        keyStrokeChangeDelay : 0,

        /**
         * Makes the field unmodifiable by user action. The input area is not editable, and triggers
         * are unresponsive.
         *
         * This is a wider-acting setting than {@link #config-editable} which *only* sets the
         * `readOnly` attribute of the `<input>` field.
         *
         * {@link Core.widget.PickerField}s such as `Combo` and `DateField` can be `editable : false`, but still
         * modifiable through the UI.
         * @prp {Boolean}
         */
        readOnly : null,

        /**
         * Set to `false` to prevent user from editing the field. For TextFields it is basically the same as setting
         * {@link #config-readOnly}, but for PickerFields there is a distinction where it allows you to pick a value
         * but not to type one in the field.
         *
         * {@link Core.widget.PickerField}s such as `Combo` and `DateField` can be `editable : false`, but still
         * modifiable through the UI.
         *
         * On mobile devices, {@link Core.widget.PickerField}s are set to `editable : false` by
         * default so that the user must select a value from the dropdown picker rather than having
         * to type a value which will cause a display of the virtual keyboard.
         *
         * If typing is essential to the functioning of the field, configuring the field
         * with `editable : true` will override this behaviour.
         * @prp {Boolean}
         * @default true
         */
        editable : true,

        defaultAction : 'change',

        stepTriggers : null,

        /**
         * The triggers to add either before or after the input field. Each property name is the reference by which
         * an instantiated Trigger Widget may be retrieved from the live `triggers` property.
         *
         * Each trigger may have the following properties:
         * * `cls` The CSS class to apply.
         * * `handler` A method in the field to call upon click
         * * `align` (Optional) `'start'` or `'end'` which end of the field the trigger should go.
         * * `weight` (Optional) Higher weighted triggers gravitate towards the input field.
         * * `key` (Optional) The [`key` name](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)
         * of the key to use as the activation key of this trigger.
         *
         * ```javascript
         * const textField = new TextField({
         *   triggers : {
         *       check : {
         *           cls : 'fa fa-check',
         *           handler() {
         *               ...
         *           }
         *       },
         *       ...
         *   }
         * })
         * ```
         *
         * @prp {Object<String,Core.widget.Widget>}
         * @accepts {Object<String,FieldTriggerConfig|null>}
         */
        triggers : null,

        /**
         * Specify `true` to highlight field after external value changes
         * @config {Boolean}
         */
        highlightExternalChange : false,

        localizableProperties : ['label', 'title', 'placeholder', 'labelWidth', 'hint'],

        /**
         * Specify `true` to auto select field contents on focus
         * @config {Boolean}
         * @default
         */
        autoSelect : false,

        /**
         * Sets the native `autocomplete` property of the underlying input element. For more information, please refer to
         * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
         * @config {String}
         * @default
         * @category Input element
         */
        autoComplete : 'off',

        /**
         * Sets the native `spellcheck` property of the underlying input element. For more information, please refer to
         * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck)
         * @config {Boolean}
         * @category Input element
         */
        spellCheck : null,

        /**
         * Set to `false` to not highlight a field as invalid while typing, to instead show it on ENTER key press
         * or similar.
         * @config {Boolean}
         * @category Input element
         */
        validateOnInput : true,

        /**
         * Sets custom attributes of the underlying input element. For more information, please refer to
         * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)
         * @config {Object<String,String>}
         * @default
         * @category Input element
         */
        inputAttributes : null,

        /**
         * Sets the `type` attribute of the underlying input element (password, hidden, date, color, etc.).
         * @config {String}
         * @category Input element
         */
        inputType : 'text',

        /**
         * Text alignment for the input field.
         * @config {String}
         * @category Input element
         */
        inputAlign : null,

        /**
         * A list of property names to be set in the underlying input element from properties
         * by the same name in this Field object if the value is not `== null`.
         * @config {String[]}
         * @private
         * @category Input element
         */
        attributes : {
            value : [
                'placeholder',
                'ariaLabel',
                'autoComplete',
                'spellCheck',
                'minLength',
                'maxLength',
                'pattern',
                'tabIndex',
                'min',
                'max'
            ],
            $config : {
                merge : 'distinct'
            }
        },

        nullValue : {
            $config : null,
            value   : null,
            default : null    // store _value=null on prototype
        },

        updatedClsDuration : 500,

        inputReadOnly : false,

        ariaElement : 'input',

        /**
         * The tab index of the input field or fields, or `null` for natural tab order (recommended). Setting to `0`
         * is equivalent to natural tab order, but is unnecessary for fields since they are naturally tabbable
         * (i.e., accessible via the TAB key). Setting to `-1` disables tabbability but allows for focus to be set
         * to the element programmatically.
         *
         * From [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex):
         *
         * **Warning**: You are recommended to only use `0` and `-1` as tabindex values. Avoid using tabindex values
         * greater than 0 and CSS properties that can change the order of focusable HTML elements ([Ordering flex
         * items](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Ordering_flex_items)).
         * Doing so makes it difficult for people who rely on using keyboard for navigation or assistive technology
         * to navigate and operate page content. Instead, write the document with the elements in a logical sequence.
         *
         * @config {Number} tabIndex
         * @category Input element
         */

        /**
         * The configuration for additional items associated to this field. This is typically used to add contextual
         * fields related to a {@link Core.widget.Checkbox checkbox} or {@link Core.widget.Radio radio button}. See
         * these classes for examples of nested fields.
         *
         * This config can be provided as an array of widget config objects, an object with named widgets (see
         * {@link Core.widget.FieldContainer#config-namedItems}, or a config object for the whole
         * {@link Core.widget.FieldContainer field container}.
         *
         * To determine if the object is a `namedItems` object or a {@link Core.widget.FieldContainer field container}
         * config, the object is checked for either a `type` or an `items` property. If it has either of these
         * properties, it is a field container config object. Configuring the container is useful for applying
         * {@link Core.widget.FieldContainer#config-cls classes} or {@link Core.widget.FieldContainer#config-style styles}
         * to the container as a whole.
         *
         * For example, to add named items:
         * ```javascript
         *  new Checkbox({
         *      text : 'Separate shipping address',
         *      container : {
         *          address1 : {
         *              type : 'textfield'
         *          },
         *          address2 : {
         *              type : 'textfield'
         *          }
         *      }
         *  });
         * ```
         *
         * To style the container as well, move the items to the `items` property and add `cls`:
         * ```javascript
         *  new Checkbox({
         *      text : 'Separate shipping address',
         *      container : {
         *          cls   : 'address-form',
         *          items : {
         *              address1 : {
         *                  type : 'textfield'
         *              },
         *              address2 : {
         *                  type : 'textfield'
         *              }
         *          }
         *      }
         *  });
         * ```
         *
         * @config {Core.widget.FieldContainer}
         * @accepts {Object<string,ContainerItemConfig>|ContainerItemConfig[]|FieldContainerConfig}
         * @category Container
         */
        container : {
            $config : 'nullify',
            value   : null
        },

        /**
         * The default configuration for the {@link #config-container}.
         * @config {Core.widget.FieldContainer}
         * @accepts {Core.widget.FieldContainer|FieldContainerConfig}
         * @category Container
         * @internal
         */
        containerDefaults : {
            type : 'fieldcontainer',

            syncableConfigs : {
                disabled : field => field.disabled
            },

            syncConfigTriggers : {
                disabled : 1
            }
        },

        /**
         * The config controls how the value of nested items are handled when a parent container gets or sets its
         * {@link Core.widget.Container#property-values}.
         *
         * The valid values for this config are:
         *  - `null` (the default) will include the values of this field's items if this field stores its own value.
         *  - `true` to always include the values of this field's items.
         *  - `false` to never include the values of this field's items.
         *  - `'nested'` to include the values of this field's items as a nested object under the field's `name`.
         *    This field's `value` is stored as the `'value'` property of that object.
         *  - Any other string is treated as the name of a property on this field. When truthy, the values of this
         *    field's items will be included.
         *  - A function can be supplied that must return a value given this field as its sole argument. If that
         *    value is truthy, this field's items will be included.
         *
         * @config {Boolean|String|Function}
         * @param {Core.widget.Field} field Field instance
         * @returns {Boolean}
         * @category Container
         */
        containValues : null,

        /**
         * Set this config to `true` to always display items horizontally along with this field. This assigns an
         * {@link Core.widget.layout.Box hbox} as the {@link Core.widget.Container#config-layout} to the
         * {@link #config-container}.
         *
         * Alternatively, set this config to `false` to wrap this field's items below. This assigns a
         * {@link Core.widget.layout.VBox} as the {@link Core.widget.Container#config-layout} to the
         * {@link #config-container}.
         *
         * This config defaults to `true` if there is exactly one item, and `false` otherwise.
         * @config {Boolean}
         * @category Container
         */
        inline : null,

        testConfig : {
            updatedClsDuration : 10,
            transition         : {
                clear : 0
            }
        },

        keyMap : {},

        twinSyncConfigs : ['value'],

        /**
         * If you need to use something else than a default `input` element, as the input element, provide the tag
         * name here. Please note that this is used for advanced usage only, for example when using WebComponents
         * (custom elements), and that the configured element must fulfil the same contract as a regular input
         * element.
         * @config {String}
         * @category Input element
         * @advanced
         */
        inputTag : {
            $config : null,
            value   : 'input',
            default : 'input'
        },

        transition : {
            clear : true
        }
    };

    static get delayable() {
        return {
            highlightChanged : 'raf'
        };
    }

    doDestroy() {
        const
            me           = this,
            { triggers } = me;

        me.inputListenerRemover?.();
        me.keyListenerRemover?.();

        me.container?.destroy();

        super.doDestroy();

        if (triggers) {
            for (const t of Object.values(triggers)) {
                t.destroy();
            }
        }
    }

    get childItems() {
        const
            { container, triggers } = this,
            ret                     = triggers ? Object.values(triggers) : [];

        return container ? [...ret, ...container.childItems] : ret;
    }

    get invalidValueError() {
        return 'L{invalidValue}';
    }

    //endregion

    //region Event
    /**
     * Fired when the user types into this field.
     * @event input
     * @param {Core.widget.Field} source This field
     * @ts-param source {Core.widget.Field|any}
     * @param {String} value - This field's value
     * @ts-param value {String|Number|Boolean|any}
     * @param {Event} event - The triggering DOM event
     */

    /**
     * Fired when this field's value changes.
     * @event change
     * @param {Core.widget.Field} source - This Field
     * @ts-param source {Core.widget.Field|any}
     * @param {String} value - This field's value
     * @ts-param value {String|Number|Boolean|any}
     * @param {String} oldValue - This field's previous value
     * @ts-param oldValue {String|Number|Boolean|any}
     * @param {Boolean} valid - True if this field is in a valid state
     * @param {Event} event - The triggering DOM event if any
     * @param {Boolean} userAction - Triggered by user taking an action (`true`) or by setting a value (`false`)
     *
     * @ts-param checked {Boolean} // Used for compatibility with Checkbox event
     */

    /**
     * User performed default action (typed into this field).
     * @event action
     * @param {Core.widget.Field} source - This Field
     * @ts-param source {Core.widget.Field|any}
     * @param {String} value - This field's value
     * @ts-param value {String|Number|Boolean|any}
     * @param {String} oldValue - This field's previous value
     * @ts-param oldValue {String|Number|Boolean|any}
     * @param {Boolean} valid - True if this field is in a valid state
     * @param {Event} event - The triggering DOM event if any
     * @param {Core.data.Model} record Selected record. Available for fields with records selection functionality
     * @param {Core.data.Model[]} records Selected records as an array. Available for fields with records selection functionality
     * @param {Boolean} userAction - Triggered by user taking an action (`true`) or by setting a value (`false`)
     *
     * @ts-param checked {Boolean} // Used for compatibility with Checkbox event
     */

    /**
     * Fired when this field is {@link #function-clear cleared}.
     *
     * This will be triggered when a user clicks this field's clear {@link #property-triggers trigger}
     * @event clear
     * @param {Core.widget.Field} source - This Field
     * @ts-param source {Core.widget.Field|any}
     */

    /**
     * User clicked one of this field's {@link #property-triggers}
     * @event trigger
     * @param {Core.widget.Field} source This field
     * @ts-param source {Core.widget.Field|any}
     * @param {Core.widget.Widget} trigger The trigger activated by click or touch tap.
     */

    //endregion

    //region Init

    construct(config = {}) {
        super.construct(config);

        const me = this;

        if (me.keyStrokeChangeDelay) {
            me.changeOnKeyStroke = me.buffer(me.internalOnChange, me.keyStrokeChangeDelay);
        }

        // `placeholder` is the lowest `aria-label` fallback (after `ariaLabel`, then `tooltip`). If rendered,
        // first paint already flushed the lazy `tooltip` during `super.construct`, so `tooltipText` may be set.
        if (!me.ariaLabel && !me.tooltipText && me.placeholder) {
            me.updateAriaLabel(me.placeholder);
        }
    }

    // Adding triggers keymap to field keymap with prefix 'triggerName.';
    changeKeyMap(keyMap) {
        const me = this;
        let mergedKeyMap = {};

        if (keyMap) {
            if (!me._fieldKeyMap) {
                me._fieldKeyMap = keyMap;
                ObjectHelper.assign(mergedKeyMap, keyMap);
            }
            else {
                ObjectHelper.assign(mergedKeyMap, me._fieldKeyMap);
            }
        }

        for (const triggerName in me.triggers) {
            if (me.triggers[triggerName]?.keyMap) {
                mergedKeyMap = me.mergeKeyMaps(mergedKeyMap, me.triggers[triggerName].keyMap, triggerName);
            }
        }
        return mergedKeyMap;
    }

    get keyMapSubComponents() {
        return this.triggers;
    }

    onFocusIn(e) {
        const me = this;

        me.valueOnFocus = ObjectHelper.clone(me.value);
        me.validOnFocus = !(me.errors && Object.keys(me.errors).length);
        super.onFocusIn(e);

        // Inform user about the validity state when they focus on the field.
        me.focusing = true;
        me.syncInvalid();
        me.focusing = false;
    }

    onFocusOut(e) {
        super.onFocusOut(e);

        // Required field not flagged with error initially, flag on blur instead for better appearance
        this.syncRequired();

        // Check field consistency on blur
        this.onEditComplete();
    }

    /**
     * Template function which may be implemented by subclasses to synchronize
     * input state and validity state upon completion of the edit.
     * @internal
     */
    onEditComplete() {

    }

    get rootUiClass() {
        return Field;
    }

    compose() {
        // Force evaluation of clearable so triggers include the clearable trigger. We can't bury this inside
        // changeTriggers since there may be no other triggers defined (which would mean changeTriggers would never
        // be run)
        this.getConfig('clearable');

        const
            me               = this,
            {
                container,
                innerElements,
                label,
                labels,
                labelCls,
                readOnly,
                stepTriggers,
                triggers,
                required,
                showRequiredIndicator,
                span,
                column
            }                = me,
            triggerInstances = ObjectHelper.values(triggers, (k, v) => !v),
            // The triggers at each end are sorted "gravitationally".
            // Higher weight sorts towards the center which is the input element.
            startTriggers    = triggerInstances.filter(t => t.align === 'start').sort(byWeight),
            endTriggers      = triggerInstances.filter(t => t.align !== 'start').sort(byWeightReverse),
            setupLabel       = me.setupLabel.bind(me),
            innerChildren    = [
                ...startTriggers.map(t => t.element),
                ...innerElements,
                ...endTriggers.map(t => t.element)
            ];

        let innerStyle;

        // Apply grid settings to the inner element if the field is in a container with `labelPosition: 'align-before'`.
        // In that case, the field will use `display: contents` and the inner element will be the one laid out.
        if (me.parent?.labelPosition === 'align-before') {
            if (span != null) {
                (innerStyle = {}).gridColumn = `span ${span}`;
            }

            if (column != null) {
                (innerStyle ??= {}).gridColumn = column;
            }
        }

        return {
            class : {
                'b-has-step-triggers'      : stepTriggers,
                'b-has-start-trigger'      : startTriggers.length,
                'b-no-input'               : !innerElements.length,
                'b-read-only'              : readOnly,
                'b-field-container'        : Boolean(container),
                'b-field-container-inline' : container?.inline,
                'b-required'               : Boolean(required && showRequiredIndicator)
            },
            children : [
                ...(labels || emptyArray).filter(t => t && t.align !== 'end').map(setupLabel),
                (label || null) && setupLabel({
                    reference : 'labelElement',
                    align     : 'start',
                    class     : {
                        [labelCls] : labelCls
                    },
                    html : label
                }),
                // ...innerChildren,
                innerChildren.length ? {
                    class     : 'b-field-inner',
                    reference : 'inputWrap',
                    style     : innerStyle,
                    children  : innerChildren
                } : null,
                ...(labels || emptyArray).filter(t => t?.align === 'end').map(setupLabel),
                ...(container ? [{
                    reference : 'containerWrapElement',
                    children  : [container.element],
                    class     : {
                        'b-field-container-wrap' : 1
                    }
                }] : emptyArray)
            ]
        };
    }

    updateElement(element, was) {
        const
            me        = this,
            value     = me.initialConfig.value,
            { input } = me;

        super.updateElement(element, was);

        // Value must be injected into the input element after it has been constructed, not in the
        // initial template, otherwise the caret position will not be as expected.
        if (value != null) {
            me.value = value;
        }

        me.syncEmpty();
        me.updateInputReadOnly(me.inputReadOnly);
        me.syncInvalid();

        const keyEventElement = input || me.focusElement;

        me.keyListenerRemover?.();

        me.keyListenerRemover = keyEventElement && EventHelper.on({
            element  : keyEventElement,
            thisObj  : me,
            keydown  : 'internalOnKeyEvent',
            keypress : 'internalOnKeyEvent',
            keyup    : 'internalOnKeyEvent'
        });
    }

    // Subclasses may implement this.
    // Needed because Checkbox produces an array of two elements as its innerElements
    get innerElements() {
        return [this.inputElement];
    }

    /**
     * The input element at the heart if this field
     * @member {HTMLElement} input
     */
    get inputElement() {
        const
            {
                attributes,
                inputAttributes,
                id,
                inputCls,
                inputType,
                name,
                inputTag
            }         = this,
            domConfig = ObjectHelper.merge({
                reference     : 'input',
                tag           : inputTag,
                type          : inputType,
                name          : name || id,
                id            : `${id}-input`,
                retainElement : 'prevent-release',  // allow the input to be transplanted as in combo/chipView
                dataset       : {
                    ownerCmp : id,
                    // Disable OnePassword on fields unless it is a password field
                    opIgnore : !this.isPasswordField || null
                }
            }, inputAttributes);

        if (inputCls) {
            domConfig.class = inputCls;
        }

        // Announce the clear keyboard shortcut on the focusable input (the clear trigger is `aria-hidden`).
        if (this.triggers?.clear) {
            domConfig['aria-keyshortcuts'] = clearKey;
        }

        for (let key, value, i = attributes.length; i-- > 0; /* empty */) {
            key = attributes[i];
            value = this[key];

            if (value != null) {  // don't smash properties already in domConfig w/null values...
                // special treatment for prefixed `aria` attributes
                // cannot generally use `hyphenate`; we don't want to mangle e.g. `autoComplete`
                domConfig[StringHelper.hyphenateAttributeName(key)] = value;
            }
        }

        return domConfig;
    }

    // When used in a container with `labelPosition: 'align-before'`, the field will use `display: contents` and
    // applying height to the outer element won't have any effect. Re-route to the inner element instead
    get heightElement() {
        if (this.parent?.labelPosition === 'align-before') {
            return this.inputWrap;
        }

        return super.heightElement;
    }

    //endregion

    //region Focus & select

    get caretPos() {
        return this.textSelection[0];
    }

    set caretPos(value) {
        this.textSelection = value;
    }

    get focusElement() {
        return this.input;
    }

    get textSelection() {
        const input = this.input;

        let ret;

        try {
            ret = [input.selectionStart, input.selectionEnd, input.selectionDirection];
        }
        catch {
            // ignore (some input types cannot do this)
            ret = input.value?.length || 0;
            ret = [ret, ret];
        }

        return ret;
    }

    set textSelection(value) {
        if (typeof value === 'number') {
            this.select(value, value);
        }
        else {
            this.select(...value);
        }
    }

    get hasTextSelection() {
        const [selectionStart, selectionEnd] = this.textSelection;

        return selectionStart && selectionEnd - selectionStart > 0;
    }

    /**
     * Returns the input value for this field's input element that will be present if
     * the event carrying the given text is allowed to proceed.
     * @param {String} text
     * @returns {String}
     * @private
     */
    getAfterValue(text) {
        const
            [begin, end] = this.textSelection,
            value        = this.input.value;

        return `${value.substr(0, begin)}${text}${value.substr(end || begin)}`;
    }

    /**
     * Selects the field contents. Optionally may be passed a start and end.
     * @param {Number} [start] The start index from which to select the input.
     * @param {Number} [end] The index at which to end the selection of the input.
     */
    select(start, end) {
        // Use focusElement which is the input field in this class
        // but allows subclasses to use other elements.
        // See, for example, TextAreaPickerField
        const input = this.focusElement;

        if (input.value.length) {
            if (arguments.length === 0) {
                this.selectAll();
                return;
            }

            // Only allowed to select range in certain element / input types
            if (!this.supportsTextSelection) {
                return;
                // throw new Error('Trying to select text on an invalid element type');
            }

            input.setSelectionRange(start, end);
        }
    }

    moveCaretToEnd() {
        const input = this.input;

        if (input.createTextRange) {
            const range = input.createTextRange();
            range.collapse(false);
            range.select();
        }
        else if (this.supportsTextSelection) {
            // Move caret to the end if possible
            this.select(input.value.length, input.value.length);
        }

    }

    selectAll() {
        this.focusElement.select?.();
    }

    get caretAtEnd() {
        return this.textSelection[1] === this.input.value.length;
    }

    get caretAtStart() {
        return !this.textSelection[1];
    }

    get selectedAll() {
        const { textSelection } = this;

        return !textSelection[0] && textSelection[1] === this.input.value.length;
    }

    // called on value changes to update styling of empty vs non-empty field
    syncEmpty() {
        const
            { isEmptyInput, isEmpty, element } = this,
            clear                              = this.triggers?.clear,
            empty                              = isEmptyInput && isEmpty;

        if (element) {
            clear?.[empty ? 'hide' : 'show']();
            this.toggleCls('b-empty', empty);
        }
    }

    updateHint() {
        this.syncHint();
    }

    updateHintHtml() {
        this.syncHint();
    }

    syncHint() {
        const
            me                        = this,
            { input, hint, hintHtml } = me,
            parent                    = input?.parentElement;

        if (input) {
            let hintValue = hintHtml || hint;

            const hintElement = me.hintElement || hintValue && (me.hintElement = DomHelper.createElement({
                parent,
                className   : 'b-field-hint',
                nextSibling : input.nextSibling,
                children    : [{
                    className : 'b-field-hint-content'
                }]
            }));

            if (hintElement) {
                if (typeof hintValue === 'function') {
                    hintValue = hintValue({ source : me, value : me.value });
                }

                hintElement.firstChild[hintHtml ? 'innerHTML' : 'textContent'] = hintValue || '';
            }

            me.toggleCls('b-field-no-hint', !hintValue);
        }
    }

    //endregion

    //region Getters/setters

    updateInputTag(tag) {
        if (tag && tag !== this.getDefaultConfiguration().inputTag) {
            // Tells Column not to cache this field if it's used as an editor
            this.dontCache = true;
        }
    }

    updateEditable() {
        this.syncInputReadOnly();
    }

    syncInputReadOnly() {
        this.getConfig('readOnly');  // make sure our config is initialized...

        // but since the readOnly getter conflates disabled into it, we ultimately have to look at _readOnly:
        this.inputReadOnly = this._readOnly || this.editable === false;

    }

    updateInputReadOnly(readOnly) {
        const
            me                              = this,
            { input, inputListenerRemover } = me;

        // Editable refers *ONLY* to the readOnly state of the <input> field within the field.
        // It does *NOT* imply that the field is not modifiable by user interaction.
        // For example, a Combo or DateField may be not editable, but may still be set through the UI.
        // It is the readOnly config which disables user interaction from modifying the field.
        if (input) {
            input.readOnly = readOnly ? 'readOnly' : null;

            if (readOnly) {
                me.inputListenerRemover = inputListenerRemover?.();
            }
            else if (!inputListenerRemover) {
                me.inputListenerRemover = EventHelper.on({
                    element : input,
                    thisObj : me,
                    focus   : 'internalOnInputFocus',
                    change  : 'internalOnChange',
                    input   : 'internalOnInput'
                });
            }
        }
    }

    changeReadOnly(value) {
        return Boolean(value);
    }

    updateReadOnly(readOnly) {
        this.syncInputReadOnly();
    }

    updateRequired(required) {
        this.syncRequired();
    }

    updateClearable(clearable) {
        const me = this;

        me.getConfig('triggers');

        me.triggers = {
            clear : clearable && ObjectHelper.assign({
                cls     : 'b-icon-remove',
                key     : clearKey,
                weight  : 1000,
                // FieldTrigger#onClick already brackets the handler in _isUserAction = true/false for both the mouse
                // click and the Alt+Backspace keyMap route, so the resulting change/action events report
                // userAction:true without any extra wrapping here.
                handler : 'clear'
            }, clearable) || null
        };

        // The `inputElement` getter only sets `aria-keyshortcuts` at render time, so keep the live
        // input in sync when `clearable` is toggled at runtime.
        if (me.input) {
            if (clearable) {
                me.input.setAttribute('aria-keyshortcuts', clearKey);
            }
            else {
                me.input.removeAttribute('aria-keyshortcuts');
            }
        }
    }

    updateLabelPosition(position) {
        const { container } = this;
        if (container) {
            container.labelPosition = position;
            container.syncContainer();
        }
    }

    changeTriggers(triggers, was) {
        const
            me      = this,
            manager = me.$triggers || (me.$triggers = new DynamicObject({
                configName : 'triggers',
                factory    : Field.Trigger,
                inferType  : false,  // the name of a trigger in the triggers object is not its type
                owner      : me,

                created(instance) {
                    FunctionHelper.after(instance, 'onConfigChange', (ret, { name }) => {
                        if (triggerConfigs[name]) {
                            me.onConfigChange({
                                name  : 'triggers',
                                value : manager.target
                            });
                        }
                    });
                },

                setup(config, name) {
                    config.reference = config.ref = name;
                    config.parent = me;
                }
            }));

        if (triggers && !me.stepTriggers && (triggers.back || triggers.forward)) {
            triggers = ObjectHelper.assign({}, triggers);
            delete triggers.back;
            delete triggers.forward;
        }

        manager.update(triggers);

        if (me.element) {
            // Force changeKeyMap to be called
            // eslint-disable-next-line no-self-assign
            me.keyMap = me.keyMap;
        }

        if (!was) {
            // Only return the target once. Further calls are processed above so we need to return undefined to ensure
            // onConfigChange is called. By returning the same target on 2nd+ call, it passes the === test and won't
            // trigger onConfigChange.
            return manager.target;
        }
    }

    updateInputWidth(newValue) {
        // Width on inputWrap instead of input, to include triggers
        this.inputWrap.style.width = DomHelper.setLength(newValue);

        this.addCls('b-has-width');
    }

    changeWidth(width, oldWidth) {
        this.toggleCls('b-has-width', width != null);

        return super.changeWidth(width, oldWidth);
    }

    updateInputAlign(newValue) {
        this.input.style.textAlign = newValue;
    }

    /**
     * Returns true if the field value is valid
     * @type {Boolean}
     * @readonly
     */
    get isValid() {
        const me = this;

        // Disabled fields are considered valid
        if (!me.disabled && !me.skipValidation) {
            me.syncRequired();

            if (me.checkValidity) {
                me.callback(me.checkValidity, me, [me]);
            }

            if (me.errors && Object.keys(me.errors).length) {
                return false;
            }

            const validity = me.validity;

            if (validity) {
                return validity.valid;
            }
        }

        return true;
    }

    get isClear() {
        return this.isEmpty && this.isEmptyInput;
    }

    /**
     * Returns `true` if this field is empty. That is, if it would violate the {@link #config-required}
     * setting.
     *
     * This may have different definitions in subclasses from simple text fields.
     * @type {Boolean}
     * @readonly
     */
    get isEmpty() {
        const { value } = this;

        return value == null || value === '' || value === this.nullValue;
    }

    /**
     * Returns true if the field's input is empty
     * @type {Boolean}
     * @readonly
     */
    get isEmptyInput() {
        return !this.input || this.input.value == null || this.input.value === '';
    }

    /**
     * Returns the DOM `ValidityState` for this widget's input element, or `null` if there
     * isn't one.
     * @member {ValidityState}
     * @readonly
     * @private
     */
    get validity() {
        const input = this.input;

        return input?.validity;
    }

    // Called by Editor.js, for overriding in subclasses that require async setting of values (custom editors in React)
    async setValue(value) {
        this.value = value;
    }

    changeValue(value, was) {
        if (value == null) {
            value = this.nullValue;
        }

        // In cases of arrays, for example, we need to return "was" to pass the === check in the setter to convince
        // the config that, in fact, no change has occurred.
        if (this.hasChanged(was, value)) {
            return value;
        }

        // When loading a record into a form, an empty value might be loaded into a field, which is not detected as a
        // change. In this scenario it should still be flagged as invalid
        if (value === '') {
            this.syncRequired();
        }

        return was;
    }

    updateValue(value, oldValue) {
        const me = this;

        // Do not flag with error if configured empty, looks ugly to have fields start red
        if (!me.isConfiguring) {
            me.syncRequired();

            // Do not trigger change event during configuration phase
            // or during keyboard input
            if (!me.inputting) {
                // trigger change event, signaling that origin is from set operation,
                // makes it easier to ignore such events in applications that set value on load etc
                me.triggerChange();
            }
        }

        if (!me.inputting) {
            me._lastValue = value;
        }

        me.syncInputFieldValue();
    }

    /**
     * Compares this field's value with its previous value. May be overridden in subclasses
     * which have more complex value types. See, for example, {@link Core.widget.DurationField}.
     * @param {*} oldValue
     * @param {*} newValue
     * @private
     */
    hasChanged(oldValue, newValue) {
        return newValue !== oldValue;
    }

    /**
     * Called by the base Field class's `set value` to sync the state of the UI with the field's value.
     *
     * Relies upon the class implementation of `get inputValue` to return a string representation of
     * the value for user consumption and editing.
     *
     * This method can be overridden.
     *
     * @param {Boolean} [skipHighlight] skip highlighting of the field
     * @returns {void}
     * @advanced
     */
    syncInputFieldValue(skipHighlight = false) {
        const
            me                                            = this,
            { input, parent, inputValueAttr, inputValue } = me;

        // If we are updating from internalOnInput, we must not update the input field
        if (input && !me.inputting && input[inputValueAttr] !== inputValue) {
            // Subclasses may implement their own read only inputValue property.
            input[inputValueAttr] = inputValue;

            // <remove-on-release>
            // TODO: This highlighting logic needs extracting/clarifying
            // </remove-on-release>

            // If it's being manipulated from the outside, highlight it
            if (!me.isConfiguring && !me.containsFocus && me.highlightExternalChange) {
                input.classList.remove('b-field-updated');

                me.clearTimeout('removeUpdatedCls');

                if (parent) {
                    const { assigningValues } = parent;

                    if (assigningValues === true || assigningValues?.highlight === false) {
                        skipHighlight = true;
                    }
                }

                // if (!skipHighlight && (!parent || !(parent.isSettingValues || parent.assigningValues?.preventHighlight))) {
                if (!skipHighlight) {
                    me.highlightChanged();
                }
            }
        }

        me.syncEmpty();
        me.syncInvalid();
    }

    //Sets the value without triggering a change event.
    setValueSilently(value) {
        this.inputting = true;
        this._value = value;
        this.syncInputFieldValue();
        this.inputting = false;
    }

    highlightChanged() {
        this.input.classList.add('b-field-updated');
        this.setTimeout('removeUpdatedCls', this.updatedClsDuration);
    }

    removeUpdatedCls() {
        this.input.classList.remove('b-field-updated');
    }

    /**
     * A String representation of the value of this field for {@link #function-syncInputFieldValue} to use
     * as the input element's value.
     *
     * Subclasses may override this to create string representations.
     *
     * For example, {@link Core.widget.DateField}'s implementation will format the field date
     * value according to its configured {@link Core.widget.DateField#config-format}. And {@link Core.widget.Combo}'s
     * implementation will return the {@link Core.widget.Combo#config-displayField} of the selected record.
     * @member {String}
     * @readonly
     * @internal
     */
    get inputValue() {
        // Do not use the _value property. If called during configuration, this
        // will import the configured value from the config object.
        return this.value == null ? '' : this.value;
    }

    get inputValueAttr() {
        return 'value';
    }

    get supportsTextSelection() {
        const input = this.focusElement;

        // Text selection using setSelectionRange is allowed in Chrome for certain elements.
        return input && DomHelper.isTextualInput(input);
    }

    updatePlaceholder(placeholder) {
        // `placeholder` is the lowest `aria-label` fallback (after `ariaLabel`, then `tooltip`), so a
        // placeholder set or changed at runtime must not clobber an existing tooltip-derived label.
        if (!this.ariaLabel && !this.tooltipText) {
            this.updateAriaLabel(placeholder);
        }
        if (this.input) {
            if (placeholder == null) {
                this.input.removeAttribute('placeholder');
            }
            else {
                this.input.placeholder = placeholder;
            }
        }
    }

    //endregion

    //region Events

    internalOnInputFocus() {
        if (this.autoSelect) {
            this.selectAll();
        }
    }

    /**
     * Trigger event when fields input changes
     * @fires change
     * @private
     */
    internalOnChange(event) {
        const me = this;

        // Don't trigger change if value has not changed
        if (me.hasChanged(me._lastValue, me.value)) {
            me.triggerChange(event, true);
            me._lastValue = me.value;
        }
    }

    triggerChange(event, userAction = Boolean(this._isUserAction)) {
        const
            me = this,
            {
                value,
                _lastValue : oldValue,
                isValid    : valid
            }  = me;

        me.syncHint();
        // trigger change event, signaling that origin is from user
        me.triggerFieldChange({ value, oldValue, event, userAction, valid });

        // per default Field triggers action event on change, but might be reconfigured in subclasses (such as Combo)
        if (me.defaultAction === 'change') {
            me.trigger('action', { value, oldValue, event, userAction, valid });
        }

        // since Widget has Events mixed in configured with 'callOnFunctions' this will also call onClick and onAction
    }

    fetchInputValue() {
        this.value = this.input[this.inputValueAttr];
    }

    /**
     * Trigger event when user inputs into field
     * @fires input
     * @param {Object} event Input event object
     * @private
     */
    internalOnInput(event) {
        const me = this;

        if (!me.validateOnInput) {
            me.errorTip.hide();
        }
        // Keep the value synced with the inputValue at all times.
        me.inputting = true;
        me.fetchInputValue();
        me.inputting = false;

        me.trigger('input', { value : me.value, event });

        me.changeOnKeyStroke?.(event);

        // since Widget has Events mixed in configured with 'callOnFunctions' this will also call onInput
    }

    /**
     * Returns `true` if the {@link #property-input} field needs to be synced with the internal
     * {@link #property-value} of this field.
     *
     * May be overridden in subclasses where this is more complex such as multiSelect Combo
     * with a `ChipView` where the input area does not reflect the field's value.
     * @member {Boolean}
     * @readonly
     * @private
     */
    get needsInputSync() {
        return this.input[this.inputValueAttr] !== String(this.inputValue ?? '');
    }

    internalOnKeyEvent(event) {
        const
            me        = this,
            { value } = me;

        let stopEvent = false;
        // A keyboard initiated revert is a user action.
        me._isUserAction = true;

        if (event.type === 'keydown') {
            if (event.key === 'Escape' && !(me.readOnly || me.disabled)) {
                // We can be started with an initialValue which takes precedence over the valueOnFocus.
                // Because in some situations focus can move out and back in after a change which needs
                // to be revertable. For example in cell editing.
                const
                    wasValid           = me.isValid,
                    initialValue       = ('initialValue' in me) ? me.initialValue : me.valueOnFocus,
                    valueChanged       = me.hasChanged(initialValue, value),
                    { needsInputSync } = me;

                // We revert on escape if we are an invalid state, or the value has changed, or the
                // displayed value doesn't match the field value.
                if (me.revertOnEscape && (!wasValid || valueChanged || needsInputSync)) {
                    if (valueChanged || !wasValid) {
                        if (!initialValue) {
                            me.clear();
                        }
                        else {
                            me.value = initialValue;
                        }
                    }
                    if (needsInputSync) {
                        me.syncInputFieldValue(true);
                    }
                    me.clearError();

                    // If this processing changed the value or input field's value back to valid, or
                    // the validity state was different to that upon focus
                    // then this was a revert operation, so prevent further ESC processing.
                    stopEvent = ((valueChanged || needsInputSync) && me.isValid) || (wasValid !== me.validOnFocus);
                }
                // From the `revertOnFocus` docs: "If the field is _not_ changed from when focused, the
                // clearable behaviour will be activated." The field was not changed if we get here.
                // So if it's not empty and is clearable, Escape clears it.
                else if (!me.isEmpty && me.clearable && me.revertOnEscape && !wasValid) {
                    me.clear();
                    event.stopPropagation();
                }
            }
        }

        // The above processing might have destructive consequences.
        if (!me.isDestroyed) {
            // If the keystroke had the effect of changing the field, prevent other handlers
            // which may mask that effect. Such as ESC exiting some UI context. Keep it contained.
            if (stopEvent) {
                event.stopImmediatePropagation();
            }
            me.trigger(event.type, { event });
        }
        me._isUserAction = false;
    }

    /**
     * Clears the value of this Field, and triggers the {@link #event-clear} event.
     */
    async clear(event) {
        const
            me        = this,
            { input } = me;

        // input.value may be null. Custom input elements may have non-string values
        // and may be cleared to null
        if (!me.isClear) {
            let inputClone, scrollLeft;

            if (me.transition?.clear) {
                inputClone = input.cloneNode(true);
                scrollLeft = input.scrollLeft;
                input.style.opacity = 0;
                inputClone.style.left = input.offsetLeft + 'px';
                inputClone.style.top = input.offsetTop + 'px';
                inputClone.style.width = input.offsetWidth + 'px';
                inputClone.style.height = input.offsetHeight + 'px';
            }

            me.value = me.nullValue;
            me.clearError();
            me.syncInvalid();
            if (me.input && DomHelper.isTextualInput(me.input)) {
                me.input.value = '';
            }

            if (me.transition?.clear) {
                await me.executeAndAwaitAnimations(me.element, () => {
                    input.parentNode.appendChild(inputClone);
                    inputClone.scrollLeft = scrollLeft;
                    inputClone.classList.add('b-field-clear-clone');
                });

                if (me.isDestroyed) {
                    return;
                }

                input.style.opacity = '';
                inputClone.remove();
            }

            // event will be present if called from the clearTrigger click
            me.trigger('clear', { event });
            event?.stopImmediatePropagation();
        }
    }

    /**
     * Called when disabled state is changed.
     * Used to add or remove 'b-invalid' class for the invalid field based on current disabled state.
     * @private
     */
    onDisabled() {
        this.syncInvalid();
    }

    //endregion

    //region Error

    syncRequired() {
        const me = this;

        // Empty valid if any ancestor Container is setting values
        if (!me.isConfiguring && (!me.focusing || me.focusVisible) && me.required && me.isEmpty && !me.parent?.isSettingValues) {
            me.setError('L{fieldRequired}', me.updatingInvalid);
        }
        else {
            me.clearError('L{fieldRequired}', me.updatingInvalid);
        }
    }

    //endregion

    //region Container

    get containerCollapsed() {
        return this.container?.collapsed;
    }

    set containerCollapsed(collapsed) {
        const { container } = this;

        if (container) {
            container.collapsed = collapsed;
        }
    }

    afterSyncChildConfigs(container) {
        //
    }

    changeContainer(config, existing) {
        if (config && (Array.isArray(config) || !(('type' in config) || ('items' in config)))) {
            // When "container" is an array or an object that has neither type nor items properties, it is the items
            // of the container:
            config = {
                items : config
            };
        }

        const
            me        = this,
            defaults  = config && ObjectHelper.merge({
                owner  : me,
                layout : 'box'
            }, me.containerDefaults),
            container = Widget.reconfigure(existing, config, {
                owner : me,
                defaults
            });

        if (container) {
            container.autoLayout = defaults?.layout === 'box';

            if (container === existing) {
                container.syncContainer();
                // just return to retain the config's value but also call onConfigChange (since we handled the change)
                return;
            }
        }

        return container;
    }

    onConfigChange(info) {
        super.onConfigChange(info);

        if (this.container?.syncConfigTriggers?.[info.name]) {
            this.container.syncChildConfigs();
        }
    }

    assignValue(values, options) {
        const
            me                           = this,
            // <remove-on-release>
            // TODO: perhaps containValues would be better moved to Container?
            // </remove-on-release>
            { container, containValues } = me,
            valueName                    = me.getValueName(options),
            storedValue                  = values && valueName in values;

        me.assigningValue = true;

        if (container && containValues !== false) {
            if (values && containValues === 'nested') {
                if (storedValue) {
                    values = ObjectHelper.clone(values[valueName]);  // could be null

                    super.assignValue({
                        // Removing 'value:true' from nested values is a trick done by checkbox (could be done by
                        // any toggle-like thing) so just put true back in:
                        [valueName] : values && !('value' in values) || values.value
                    }, options);

                    if (values) {
                        delete values.value;
                    }

                    container.assignValue(values, options);
                }
            }
            else {
                super.assignValue(values, options);

                container.assignValue(values, options);
            }
        }
        else {
            super.assignValue(values, options);
        }

        me.assigningValue = false;
    }

    gatherValue(values) {
        super.gatherValue(values);

        this.gatherValues(values);
    }

    gatherValues(values, storedValue) {
        const
            me                                      = this,
            { container, containValues, valueName } = me,
            cvt                                     = typeof containValues;

        storedValue = storedValue ?? (valueName in values);

        if (container && containValues !== false) {
            if (containValues === 'nested') {
                if (storedValue) {
                    values[valueName] = {
                        value : values[valueName],
                        ...container.values
                    };
                }
            }
            else if (
                containValues === true ||
                (containValues == null && storedValue) ||
                (cvt === 'string' && me[containValues]) ||
                (cvt === 'function' && containValues(me))
            ) {
                container.gatherValues(values);
            }
        }
    }

    updateContainer(container, was) {
        was && this.detachListeners(was.id);

        if (container) {
            if (!container.rendered) {
                container.render();
            }

            container.syncContainer();
            container.syncChildConfigs();
        }
    }

    //endregion
}

/**
 * Config object for a field trigger.
 *
 * @typedef {Object} FieldTriggerConfig
 * @property {String} [type] The registered type of trigger to create, defaults to a plain trigger.
 * @property {String} [cls] The CSS class to apply, usually the icon class to render.
 * @property {Function|String} [handler] A method in the field to call upon click.
 * @property {'start'|'end'} [align] Which end of the field the trigger should go.
 * @property {Number} [weight] Higher weighted triggers gravitate towards the input field.
 * @property {String|TooltipConfig|null} [tooltip] Tooltip to show when hovering the trigger.
 * @property {String} [key] The [`key` name](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)
 * of the key to use as the activation key of this trigger.
 */

/**
 * Base class for field triggers. May be configured with a `cls` and a `handler` which is a function (or name of a
 * function) in the owning Field.
 * @classtype trigger
 * @extends Core/widget/Widget
 */
Field.Trigger = class FieldTrigger extends Widget {
    static $name = 'FieldTrigger';

    static get factoryable() {
        return {
            defaultType : Field.Trigger,
            extends     : null
        };
    }

    // Factoryable type name
    static type = 'trigger';

    // Align is a simple string at this level
    static configurable = {
        align  : null,
        weight : null,
        role   : null,

        defaultCls : {
            'b-bryntum' : 0 // Defining color on the owning field is enough
        }
    };

    get field() {
        return this.parent;
    }

    construct(...args) {
        super.construct(...args);
        if (this.key) {
            this.keyMap = {
                [this.key] : 'onClick'
            };
        }
    }

    compose() {
        return {
            'aria-hidden' : true,
            class         : {
                [`b-align-${this.align || 'end'}`] : 1,
                'b-icon'                           : 1
            },
            // eslint-disable-next-line bryntum/no-listeners-in-lib
            listeners : {
                click     : 'onClick',
                mousedown : 'onMousedown'
            }
        };
    }

    changeAlign(align) {
        return align;  // Widget base class converts to an object
    }

    onClick(e) {
        const
            me        = this,
            { field } = me;

        if (!(field.disabled || field.readOnly)) {
            // If invoked by a key, don't go ahead with that key's default browser action
            if (e.key) {
                e.preventDefault();
            }
            if (field.trigger('trigger', { trigger : me }) !== false && me.handler) {
                field._isUserAction = true;
                field.callback(me.handler, field, [e, me]);
                field._isUserAction = false;
            }
        }
    }

    onMousedown(e) {
        const
            field      = this.field,
            isKeyEvent = ('key' in e);

        // If it's a touch tap on the trigger of an editable, then
        // avoid the keyboard by setting the field to not be editable
        // before focusing the field. Reset to be editable after focusing
        // has happened. Keyboard will not appear.
        if (!isKeyEvent && DomHelper.isTouchEvent) {
            if (field.editable) {
                field.editable = false;
                field.setTimeout(() => field.editable = true, 500);
            }
        }

        e.preventDefault();

        if (DomHelper.getActiveElement(field.input) !== field.input) {
            field.focus();
        }
    }
};

Field.SpinTrigger = class SpinTrigger extends Field.Trigger {
    static $name = 'SpinTrigger';

    // Factoryable type name
    static type = 'spintrigger';

    static configurable = {
        repeat : {
            $config : ['nullify'],
            value   : true
        }
    };

    compose() {
        return {
            children : {
                upButton : {
                    class : {
                        'b-icon'         : 1,
                        'b-icon-spin-up' : 1,
                        'b-spin-up'      : 1
                    }
                },
                downButton : {
                    class : {
                        'b-icon'           : 1,
                        'b-icon-spin-down' : 1,
                        'b-spin-down'      : 1
                    }
                }
            }
        };
    }

    updateRepeat(repeat) {
        this.clickRepeater?.destroy();

        this.clickRepeater = repeat ? ClickRepeater.new({
            element : this.element
        }, repeat) : null;
    }

    onClick(e) {
        const
            me        = this,
            { field } = me;

        field._isUserAction = true;

        if (!(field.disabled || field.readOnly)) {
            if (e.target === me.upButton) {
                field.doSpinUp(e.shiftKey);
            }
            else if (e.target === me.downButton) {
                field.doSpinDown(e.shiftKey);
            }
        }
        field._isUserAction = false;
    }

    get isFocusable() {
        // Disabled field items are not focusable.
        return !this.disabled && super.isFocusable;
    }
};

// Register trigger widgets type with their Factory
Field.Trigger.initClass();
Field.SpinTrigger.initClass();

Widget.register(Field.Trigger, 'trigger');
Widget.register(Field.SpinTrigger, 'spintrigger');
