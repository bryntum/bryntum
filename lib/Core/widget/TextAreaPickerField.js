import PickerField from './PickerField.js';
import Objects from '../helper/util/Objects.js';
import DomHelper from '../helper/DomHelper.js';
import EventHelper from '../helper/EventHelper.js';

DomHelper.loadStylesheet('Core/widget/TextAreaPickerField.css');

// import Stylesheet from './TextAreaPickerField.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TextAreaPickerField');

/**
 * @module Core/widget/TextAreaPickerField
 */

/**
 * A picker field that opens a dropdown `<textarea>` for multiline text input. Unlike
 * {@link Core.widget.TextAreaField} which renders the textarea inline, this widget keeps a compact single-line
 * appearance and expands into a picker dropdown when triggered. This field can be used as a cell
 * {@link Grid.column.Column#config-editor} in a Grid.
 *
 * {@inlineexample Core/widget/TextAreaPickerField.js}
 *
 * ```javascript
 * const textAreaPicker = new TextAreaPickerField({
 *     label       : 'Notes',
 *     placeholder : 'Enter some text',
 *     appendTo    : document.body
 * });
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config                      | Description                            |
 * |-----------------------------|----------------------------------------|
 * | {@link #config-value}       | Current text value                     |
 * | {@link #config-placeholder} | Placeholder text shown when empty      |
 * | {@link #config-label}       | Field label displayed beside the field |
 *
 * ## See also
 *
 * - {@link Core.widget.TextAreaField} - Inline multiline text field
 * - {@link Core.widget.PickerField} - Base class for fields with dropdown pickers
 *
 * @extends Core/widget/PickerField
 * @classtype textareapickerfield
 * @inputfield
 */
export default class TextAreaPickerField extends PickerField {

    static $name = 'TextAreaPickerField';

    static type = 'textareapickerfield';

    static configurable = {
        /**
         * @hideconfigs editable
         */

        picker : {
            type         : 'widget',
            tag          : 'textarea',
            cls          : 'b-text-area-picker-field-picker',
            scrollAction : 'realign',
            align        : {
                align    : 't-b',
                axisLock : true
            },
            autoShow : false
        },

        triggers : {
            expand : {
                cls     : 'b-icon-picker',
                handler : 'onTriggerClick'
            }
        },

        /**
         * The resize style to apply to the `<textarea>` element.
         * @config {'none'|'both'|'horizontal'|'vertical'}
         * @default
         */
        resize : 'none',

        inputType : null,

        // Private at this level. The "display" element is always readonly.
        // editing takes place in the picker.
        editable : false
    };

    get inputElement() {
        const result = super.inputElement;

        result.readOnly = 'readonly';
        result.reference = 'displayElement';
        this.ariaElement = 'displayElement';

        return result;
    }

    get nonEditableClickTarget() {
        return this.displayElement;
    }

    get focusElement() {
        return this._picker?.isVisible ? (this.input || this._picker.focusElement) : this.displayElement;
    }

    get needsInputSync() {
        return this.displayElement[this.inputValueAttr] !== String(this.inputValue ?? '');
    }

    showPicker() {
        this.picker.width = this.pickerWidth || this.pickerAlignElement.offsetWidth;

        // Always focus the picker.
        super.showPicker(true);
    }

    focusPicker() {
        // For custom pickers (e.g. Panel), this.input is not set — delegate to picker's focus
        (this.input || this.picker.focusElement)?.focus();
    }

    onPickerKeyDown(keyEvent) {
        const
            me        = this,
            realInput = me.input;

        switch (keyEvent.key.trim() || keyEvent.code) {
            case 'Escape':
                // <remove-on-release>
                // TODO: revert value?
                // </remove-on-release>
                me.picker.hide();
                return;
            case 'Enter':
                if (keyEvent.ctrlKey) {
                    me.syncInputFieldValue();
                    me.picker.hide();
                }
                break;
        }

        // Super's onPickerKeyDown fires through this.input, so avoid infinite recursion
        // by redirecting it through the displayElement. Only needed for default textarea pickers.
        if (realInput) {
            me.input = me.displayElement;
        }
        const result = super.onPickerKeyDown(keyEvent);
        if (realInput) {
            me.input = realInput;
        }

        return result;
    }

    syncInputFieldValue(skipHighlight) {
        if (this.displayElement) {
            this.displayElement.value = this.inputValue;
        }

        super.syncInputFieldValue(skipHighlight);
    }

    changeValue(value) {
        return value == null ? '' : value;
    }

    changePicker(picker, oldPicker) {
        const
            me             = this,
            pickerWidth    = me.pickerWidth || picker?.width,
            // When a subclass overrides the picker with a different widget type (e.g. Panel with items/tbar)
            // or a different tag (e.g. widget with tag: 'div'), we must not merge textarea-specific properties
            // (html, style.resize) into it, since those would corrupt the custom picker's rendering.
            isCustomPicker = picker && ((picker.type && picker.type !== 'widget') || (picker.tag && picker.tag !== 'textarea'));

        if (picker) {
            const baseConfig = {
                owner      : me,
                forElement : me.pickerAlignElement,
                align      : {
                    matchSize : pickerWidth == null,
                    anchor    : me.overlayAnchor,
                    target    : me.pickerAlignElement
                },
                id : me.id + '-input'
            };

            if (!isCustomPicker) {
                baseConfig.style = { resize : me.resize };
                baseConfig.html  = me.value ?? '';
            }

            picker = Objects.merge(baseConfig, picker);

            if (isCustomPicker) {
                // Override inherited tag: 'textarea' — it would corrupt a custom picker
                // (e.g. Panel) by making its root element a <textarea>.
                // Also prevent autoShow from showing the picker before PickerField is ready.
                picker.tag = 'div';
                picker.autoShow = false;
            }
        }

        picker = TextAreaPickerField.reconfigure(oldPicker, picker, me);

        // May have been set to null (destroyed)
        if (picker) {
            // For custom pickers (e.g. Panel with items), the input element is not the picker's
            // root element — it's the actual input/textarea inside. Only set me.input and attach
            // input listeners for default textarea pickers where picker.element IS the textarea.
            if (!isCustomPicker) {
                const input = me.input = picker.element;

                me.inputListenerRemover = EventHelper.on({
                    element  : input,
                    thisObj  : me,
                    focus    : 'internalOnInputFocus',
                    change   : 'internalOnChange',
                    input    : 'internalOnInput',
                    keydown  : 'internalOnKeyEvent',
                    keypress : 'internalOnKeyEvent',
                    keyup    : 'internalOnKeyEvent'
                });
            }
        }

        return picker;
    }
}

// Register this widget type with its Factory
TextAreaPickerField.initClass();
