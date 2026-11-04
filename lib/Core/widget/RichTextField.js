import Field from './Field.js';
import DomHelper from '../helper/DomHelper.js';

DomHelper.loadStylesheet('Core/widget/RichTextField.css');

// import Stylesheet from './RichTextField.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'RichTextField');

/**
 * @module Core/widget/RichTextField
 */

/**
 * An abstract base class for integrating third-party rich text editors (such as TinyMCE, CKEditor, or Quill) as
 * Bryntum form fields. This field renders a `<div>` as the input target which the editor library attaches to.
 * Subclass this class and implement the `onPaint` method to initialize your chosen editor. The field's value is
 * managed via the inherited {@link #config-value} config and can be used as a cell
 * {@link Grid.column.Column#config-editor} in a Grid.
 *
 * ```javascript
 * export default class TinyMceField extends RichTextField {
 *     static $name = 'TinyMceField';
 *     static type  = 'tinymcefield';
 *
 *     onPaint() {
 *         globalThis.tinymce.init({
 *             target : this.input,
 *             inline : true,
 *             setup  : editor => editor.on('NodeChange',
 *                 () => this.richText = editor.getContent())
 *         }).then(() => this.input.focus());
 *     }
 *
 *     owns(target) {
 *         return super.owns(target) || target?.closest('.tox-tinymce');
 *     }
 * }
 *
 * TinyMceField.initClass();
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config                | Description                                           |
 * |-----------------------|-------------------------------------------------------|
 * | {@link #config-value} | Current HTML content of the rich text editor           |
 * | {@link #config-label} | Field label displayed beside the field                 |
 *
 * ## See also
 *
 * - {@link Core.widget.TextAreaField} - Plain multiline text field
 * - {@link Core.widget.Field} - Base field class
 *
 * @extends Core/widget/Field
 * @classtype richtextfield
 * @inputfield
 * @abstract
 */
export default class RichTextField extends Field {
    static $name = 'RichTextField';
    static type = 'richtextfield';

    get innerElements() {
        if (!this.input) {
            this.input = DomHelper.createElement({
                class : 'b-rich-text-field-container'
            });
        }

        return [this.input];
    }

    get inputValueAttr() {
        return 'innerHTML';
    }

    /**
     * Use this property to update this field´s value silently while the rich text contents of this field is being
     * edited. Otherwise, it would reset caret position and completely overwrite the context.
     * @member {String}
     */
    get richText() {
        return this.value;
    }

    set richText(value) {
        this.setValueSilently(value);
    }
}

// Register this widget type with its Factory
RichTextField.initClass();
