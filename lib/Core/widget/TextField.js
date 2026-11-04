import Field from './Field.js';

import DomHelper from '../helper/DomHelper.js';

DomHelper.loadStylesheet('Core/widget/TextField.css');

// import Stylesheet from './TextField.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TextField');

/**
 * @module Core/widget/TextField
 */

/**
 * Text field widget, wraps native <code>&lt;input type="text"&gt;</code>. Supports two {@link #config-rendition renditions},
 * `'outlined'` and `'filled'`:
 *
 * {@inlineexample Core/widget/TextField.js}
 *
 * This field can be used as an {@link Grid.column.Column#config-editor editor} for the {@link Grid.column.Column}.
 * It is used as the default editor for the {@link Grid.column.Column}, {@link Grid.column.TemplateColumn},
 * {@link Grid.column.TreeColumn}, and for other columns if another editor is not specified explicitly,
 * or disabled by setting `false` value.
 *
 * @extends Core/widget/Field
 * @mixes Core/widget/mixin/FormulaField
 * @classtype textfield
 * @classtypealias text
 * @inputfield
 */
export default class TextField extends Field

{

    static $name = 'TextField';

    static type = 'textfield';

    static alias = 'text';

    static configurable = {
        /**
         * The min number of characters for the input field
         * @config {Number} minLength
         * @category Field
         */

        /**
         * The max number of characters for the input field
         * @config {Number} maxLength
         * @category Field
         */

        nullValue : '',

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

    construct(config, ...args) {
        if (config?.inputType === 'hidden') {
            config.hidden = true;
        }

        super.construct(config, ...args);
    }

    /**
     * Returns the current token - the token that the cursor is within or adjacent to in the
     * input field as separated by space, or the passed regular expression.
     * @param {RegExp} [delimiter=/\s/] The delimiter to use to separate tokens.
     * @returns {Object} The token object containing the token, start and end positions
     * and the cursor position.
     * @property {String} token The current token
     * @property {Number} start The start position of the token
     * @property {Number} end The end position of the token
     * @property {Number} cursor The cursor position
     * @category Field
     * @internal
     */
    getCurrentToken(delimiter = /\s/) {
        const { value, selectionStart } = this.input;

        let start = selectionStart, end = selectionStart + 1;

        if (!value.length || selectionStart == null) {
            return null;
        }
        while (start > 0 && !value[start - 1].match(delimiter)) {
            start--;
        }
        while (end < value.length && !value[end].match(delimiter)) {
            end++;
        }
        return {
            token  : value.substring(start, end),
            cursor : selectionStart,
            start,
            end
        };
    }

    compose() {
        const { rendition } = this;

        return {
            class : {
                [`b-text-field-${rendition}`] : rendition
            }
        };
    }
}

// Register this widget type with its Factory
TextField.initClass();
