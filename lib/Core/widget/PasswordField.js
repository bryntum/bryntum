import TextField from './TextField.js';

/**
 * @module Core/widget/PasswordField
 */

/**
 * A password input field that wraps the native `<input type="password">` element. The entered text is masked with
 * bullet characters for security. It extends {@link Core.widget.TextField} and inherits all its features such as
 * {@link Core.widget.Field#config-label labels}, {@link Core.widget.Field#config-required validation},
 * {@link Core.widget.Field#config-clearable}, and {@link Core.widget.TextField#config-placeholder placeholder text}.
 *
 * {@inlineexample Core/widget/PasswordField.js one-column}
 *
 * ```javascript
 * const passwordField = new PasswordField({
 *     label    : 'Enter password',
 *     required : true,
 *     appendTo : document.body
 * });
 *
 * // Read the entered value
 * const pwd = passwordField.value;
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config                                           | Description                                    |
 * |--------------------------------------------------|------------------------------------------------|
 * | {@link Core.widget.Field#config-label}           | Label text displayed beside the field          |
 * | {@link Core.widget.Field#config-required}        | Makes the field mandatory                      |
 * | {@link Core.widget.Field#config-clearable}       | Adds a clear trigger to empty the field        |
 * | {@link Core.widget.TextField#config-placeholder} | Placeholder text shown when the field is empty |
 * | {@link Core.widget.Field#config-value}           | Gets or sets the current field value           |
 *
 * ## See also
 *
 * - {@link Core.widget.TextField} - Parent class for plain text input
 * - {@link Core.widget.Field} - Base field class with label, validation, and triggers
 *
 * @extends Core/widget/Field
 * @classtype passwordfield
 * @classtypealias password
 * @inputfield
 */
export default class PasswordField extends TextField {

    static $name = 'PasswordField';

    static type = 'passwordfield';

    static alias = 'password';

    changeInputType() {
        return 'password';
    }
}

// Register this widget type with its Factory
PasswordField.initClass();
