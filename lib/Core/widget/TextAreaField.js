import Field from './Field.js';
import DomHelper from '../helper/DomHelper.js';

DomHelper.loadStylesheet('Core/widget/TextAreaField.css');

// import Stylesheet from './TextAreaField.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TextAreaField');

/**
 * @module Core/widget/TextAreaField
 */

/**
 * A multiline text input field that wraps the native `<textarea>` HTML element. It supports configurable resize
 * behavior via {@link #config-resize} and an {@link #config-autoHeight} mode that automatically grows the field
 * to fit its content. Like all Bryntum fields it supports labels, validation, placeholder text, and can be used
 * as a cell {@link Grid.column.Column#config-editor editor} in a Grid.
 *
 * ```javascript
 * const textAreaField = new TextAreaField({
 *     label       : 'Description',
 *     placeholder : 'Enter some text',
 *     autoHeight  : true,
 *     appendTo    : document.body
 * });
 * ```
 *
 * {@inlineexample Core/widget/TextAreaField.js}
 *
 * ## Useful configs and properties
 *
 * | Config                                    | Description                                                          |
 * |-------------------------------------------|----------------------------------------------------------------------|
 * | {@link #config-resize}                    | Resize behavior: `'none'`, `'both'`, `'horizontal'`, or `'vertical'` |
 * | {@link #config-autoHeight}                | Automatically grow/shrink vertically to fit content                  |
 * | {@link Core.widget.Field#config-label}    | Label text displayed beside the field                                |
 * | {@link Core.widget.Field#config-required} | Makes the field mandatory                                            |
 * | {@link Core.widget.Field#config-value}    | Gets or sets the current text content                                |
 *
 * ## See also
 *
 * - {@link Core.widget.TextField} - Single-line text input
 * - {@link Core.widget.Field} - Base field class with label and validation
 *
 * @extends Core/widget/Field
 * @classtype textareafield
 * @classtypealias textarea
 * @inputfield
 */
export default class TextAreaField extends Field {

    static $name = 'TextAreaField';

    static type = 'textareafield';

    static alias = 'textarea';

    static configurable = {
        /**
         * The resize style to apply to the `<textarea>` element.
         * @config {'none'|'both'|'horizontal'|'vertical'}
         * @default
         */
        resize : 'none',

        /**
         * Set to `true` to make the textarea automatically grow and shrink vertically to fit its content.
         * When enabled, the textarea height adjusts on each input.
         *
         * It is recommended to also set a `max-height` on the `<textarea>` via CSS to prevent it from
         * growing indefinitely:
         *
         * ```css
         * .my-auto-textarea textarea {
         *     max-height : 10em;
         * }
         * ```
         *
         * @config {Boolean}
         * @default false
         */
        autoHeight : null,

        inputAttributes : {
            tag : 'textarea'
        },

        /**
         * Predefined style to use for the field. Possible values are:
         * * `'outlined'` (default)
         * * `'filled'`
         *
         * The supplied value will be part of the field's class list, as `b-text-field-{rendition}`.
         *
         * @prp {'outlined'|'filled'|String} rendition
         * @default
         */
        rendition : 'outlined'
    };

    updateResize(resize) {
        this.input.style.resize = resize;
    }

    onInternalPaint(...args) {
        super.onInternalPaint?.(...args);

        if (args[0].firstPaint && this.autoHeight) {
            this.syncAutoHeight();
        }
    }

    onThemeChange() {
        super.onThemeChange();

        if (this.autoHeight) {
            this.syncAutoHeight();
        }
    }

    updateValue(value, oldValue) {
        super.updateValue(value, oldValue);

        if (this.autoHeight) {
            this.syncAutoHeight();
        }
    }

    syncAutoHeight() {
        const { input } = this;

        if (input?.isConnected) {
            // Collapse to 0 to measure the true content scrollHeight, then apply it.
            // CSS min-height is still respected (scrollHeight will never be less than it).
            input.style.height = '0';
            input.style.height = `${input.scrollHeight}px`;
            this.toggleMultilineCls();
        }
    }

    toggleMultilineCls() {
        const
            { input }  = this,
            style      = globalThis.getComputedStyle(input),
            lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2,
            padding    = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);

        // Toggle b-multiline class when content spans more than one line
        this.toggleCls('b-multiline', input.scrollHeight - padding > lineHeight * 1.5);
    }

    compose() {
        const { rendition } = this;

        return {
            class : {
                // b-text-field-x and not b-text-area-field-x on purpose, to share styles with TextField
                [`b-text-field-${rendition}`] : rendition
            }
        };
    }
}

// Register this widget type with its Factory
TextAreaField.initClass();
