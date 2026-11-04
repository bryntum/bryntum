import Column from './Column.js';
import ColumnStore from '../data/ColumnStore.js';

/**
 * @module Grid/column/TemplateColumn
 */

/**
 * A column that uses a template for cell content. Any function can be used as template, and the function is passed { value, record, field } properties.
 * It should return a string which will be rendered in the cell.
 *
 * Default editor is a {@link Core.widget.TextField TextField}.
 *
 * ```javascript
 * new Grid({
 *     appendTo : document.body,
 *
 *     columns : [
 *         { type: 'template', field: 'age', template: ({value}) => `${value} years old` }
 *     ]
 * });
 * ```
 *
 * {@inlineexample Grid/column/TemplateColumn.js}
 *
 * ## Useful configs
 *
 * | Config                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-template}                      | Function returning cell HTML content                 |
 *
 * ## See also
 *
 * - {@link Grid.column.Column} - Base column class and its `renderer` config
 * - {@link Grid.column.WidgetColumn} - Column with interactive widgets
 *
 * @extends Grid/column/Column
 * @classtype template
 * @column
 * @tier community
 */
export default class TemplateColumn extends Column {
    static $name = 'TemplateColumn';

    static type = 'template';

    static fields = [
        /**
         * Template function used to generate a value displayed in the cell. Called with arguments `{ value, record, field }`
         *
         * @prp {Function} template
         * @param {Object} data An object that contains data about the cell being rendered.
         * @param {*} data.value The value (only present when you set a `field` on the column)
         * @param {Core.data.Model} data.record The record representing the row
         * @param {String} data.field The column field name
         * @returns {DomConfig|String|null} String or DomConfig object representing the HTML markup
         * @category Common
         */
        'template'
    ];

    static get defaults() {
        return {
            htmlEncode : false
        };
    }

    constructor(config, store, ...args) {
        super(config, store, ...args);

        const me = this;

        if (!me.template) {
            throw new Error('TemplateColumn needs a template');
        }

        if (typeof me.template !== 'function') {
            throw new Error('TemplateColumn.template must be a function');
        }
    }

    /**
     * Renderer that uses a template for cell content.
     * @private
     */
    defaultRenderer(renderData) {
        // If it's a special row, such as a group row, we can't use the user's template
        if (!renderData.record.isSpecialRow) {
            return this.template({
                value  : renderData.value,
                record : renderData.record,
                field  : this.field
            });
        }
    }
}

ColumnStore.registerColumnType(TemplateColumn, true);
TemplateColumn.exposeProperties();
