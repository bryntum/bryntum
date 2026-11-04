import TextField from './TextField.js';
import DomHelper from '../helper/DomHelper.js';
import StringHelper from '../helper/StringHelper.js';

DomHelper.loadStylesheet('Core/widget/DisplayField.css');

// import Stylesheet from './DisplayField.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'DisplayField');

/**
 * @module Core/widget/DisplayField
 */

/**
 * A read-only field widget for displaying a value inside a form or {@link Core.widget.Container}. Unlike
 * {@link Core.widget.TextField}, this field does not allow user input — it simply renders a value. Use the optional
 * {@link #config-template} config to format the displayed output with custom HTML. DisplayField participates in
 * form data collection just like other fields, making it useful for showing computed or server-provided values
 * alongside editable fields.
 *
 * ```javascript
 * const displayField = new DisplayField({
 *     appendTo : document.body,
 *     label    : 'Name',
 *     value    : 'John Doe'
 * });
 *
 * // Using a template for custom formatting
 * const ageField = new DisplayField({
 *     appendTo : document.body,
 *     label    : 'Age',
 *     value    : 30,
 *     template : data => `${data.value} years old`
 * });
 * ```
 *
 * {@inlineexample Core/widget/DisplayField.js one-column}
 *
 * ## Useful configs and properties
 *
 * | Config                                 | Description                                              |
 * |----------------------------------------|----------------------------------------------------------|
 * | {@link Core.widget.Field#config-label} | Label text displayed beside the value                    |
 * | {@link Core.widget.Field#config-value} | The value to display                                     |
 * | {@link #config-template}               | A function returning custom HTML for the displayed value |
 * | {@link Core.widget.Widget#config-cls}  | CSS class(es) for custom styling                         |
 *
 * ## See also
 *
 * - {@link Core.widget.TextField} - Editable text input field
 * - {@link Core.widget.Field} - Base field class with label and validation support
 * - {@link Core.widget.Container} - Parent container for arranging fields in a form layout
 *
 * @extends Core/widget/Field
 * @classtype displayField
 * @classtypealias display
 * @widget
 * @inputfield
 */
export default class DisplayField extends TextField {

    static $name = 'DisplayField';

    static type = 'displayfield';

    static alias = 'display';

    static configurable = {
        readOnly : true,
        editable : false,
        cls      : 'b-display-field',

        /**
         * A template string used to render the value of this field. Please note you are responsible for encoding
         * any strings protecting against XSS.
         *
         * ```javascript
         * new DisplayField({
         *     appendTo : document.body,
         *     name     : 'age',
         *     label    : 'Age',
         *     template : data => `${data.value} years old`
         * })
         * ```
         * @config {Function}
         * @param {ContainerItemConfig} fieldConfig Configuration object for the field
         * @returns {DomConfig|String|null}
         */
        template : null,

        ariaElement : 'displayElement'
    };

    get focusElement() {
        // we're not focusable.
    }

    changeReadOnly() {
        return true;
    }

    changeEditable() {
        return false;
    }

    get inputElement() {
        return {
            tag       : 'span',
            class     : 'b-display-field-value',
            id        : `${this.id}-input`,
            reference : 'displayElement',
            html      : this.template ? this.template(this.value) : StringHelper.encodeHtml(this.value)
        };
    }
}

// Register this widget type with its Factory
DisplayField.initClass();
