import Column from './Column.js';
import ColumnStore from '../data/ColumnStore.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import NumberHelper from '../../Core/helper/NumberHelper.js';

/**
 * @module Grid/column/NumberColumn
 */

/**
 * A column for showing/editing numbers.
 *
 * Default editor is a {@link Core.widget.NumberField}.
 *
 * ```javascript
 * new Grid({
 *     appendTo : document.body,
 *     columns : [
 *         { type: 'number', min: 0, max : 100, field: 'score' }
 *     ]
 * });
 * ```
 *
 * Provide a {@link Core/helper/util/NumberFormat} config as {@link #config-format} to be able to show currency. For
 * example:
 * ```javascript
 * new Grid({
 *     appendTo : document.body,
 *     columns : [
 *         {
 *             type   : 'number',
 *             format : {
 *                style    : 'currency',
 *                currency : 'USD'
 *             }
 *         }
 *     ]
 * });
 * ```
 *
 * {@inlineexample Grid/column/NumberColumn.js}
 *
 * ## Useful configs
 *
 * | Config                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-format}                        | Number format string or config object                |
 * | {@link #config-min}                           | Minimum allowed value                                |
 * | {@link #config-max}                           | Maximum allowed value                                |
 * | {@link #config-step}                          | Spin step amount                                     |
 *
 * ## See also
 *
 * - {@link Grid.column.CurrencyColumn} - Column for currency values
 * - {@link Grid.column.PercentColumn} - Column with progress bar
 * - {@link Core.helper.util.NumberFormat} - Number formatting options
 * - {@link Core.widget.NumberField} - Default editor widget
 *
 * @extends Grid/column/Column
 * @classtype number
 * @column
 * @tier community
 */
export default class NumberColumn extends Column {
    //region Config
    static $name = 'NumberColumn';

    static type = 'number';

    // Type to use when auto adding field
    static fieldType = 'number';

    static fields = [
        /**
         * The format to use for rendering numbers.
         *
         * By default, the locale's default number formatter is used. For `en-US`, the locale default is a maximum of 3
         * decimal digits, using thousands-based grouping. This would render the number `1234567.98765` as
         * `'1,234,567.988'`.
         *
         * To round to whole integers, with a "," as a thousand delimiter:
         * ```javascript
         * format : '9,999.'
         * ```
         *
         * To display USD currency
         * ```javascript
         * format : {
         *     style    : 'currency',
         *     currency : 'USD',
         *     fraction : 0
         * }
         * ```
         * Read more about the formatting options at {@link Core/helper/util/NumberFormat}
         *
         * @prp {String|NumberFormatConfig} format
         */
        { name : 'format', defaultValue : '' },

        /**
         * The minimum value for the field used during editing.
         * @prp {Number} min
         * @category Common
         */
        'min',

        /**
         * The maximum value for the field used during editing.
         * @prp {Number} max
         * @category Common
         */
        'max',

        /**
         * Step size for the field used during editing. Also used when pressing up/down keys in the field.
         * @prp {Number} step
         * @category Common
         */
        'step',

        /**
         * Large step size, defaults to 10 * `step`. Applied when pressing SHIFT and stepping either by click or
         * when using the Up/Down keys.
         * @prp {Number} largeStep
         * @category Common
         */
        'largeStep',

        /**
         * Unit to append to displayed value.
         * @prp {String} unit
         * @category Common
         */
        'unit',

        /**
         * Renderer function used to customize and style the number displayed in the cell. Return the cell text you
         * want to display. Can also affect other aspects of the cell, such as styling.
         *
         * <div class="warning">
         * You should never modify any records inside this method.
         * </div>
         *
         * ```javascript
         * new Grid({
         *     columns : [
         *         { text : 'Temperature', type : 'number', renderer : ({ record, value }) => value + 'F' },
         *     ]
         * });
         * ```
         *
         * When using the Bryntum React wrapper, this renderer can also return JSX elements. See
         * {@link Grid.column.Column#config-renderer} for a JSX example and performance considerations.
         *
         * @prp {Function} renderer
         * @param {Object} renderData Object containing renderer parameters
         * @param {HTMLElement} renderData.cellElement Cell element, for adding CSS classes, styling etc. Can be `null` in case of export
         * @param {Number|null|undefined} renderData.value The Number value to be displayed in the cell
         * @param {Core.data.Model} renderData.record Record for the row
         * @param {Grid.column.Column} renderData.column This column
         * @param {Grid.view.Grid} renderData.grid This grid
         * @param {Grid.row.Row} renderData.row Row object. Can be null in case of export.
         *   Use the {@link Grid.row.Row#function-assignCls row's API} to manipulate CSS class names.
         * @param {Object} renderData.size Set `size.height` to specify the desired row height for the current
         *   row. Largest specified height is used, falling back to configured {@link Grid/view/Grid#config-rowHeight}
         *   in case none is specified. Can be null in case of export
         * @param {Number} renderData.size.height Set this to request a certain row height
         * @param {Number} renderData.size.configuredHeight Row height that will be used if none is requested
         * @param {Boolean} renderData.isExport `true` if the record is being exported to Excel or a textual format, enabling special handling during export.
         * @param {Boolean} renderData.isMeasuring True if the column is being measured for a `resizeToFitContent` call.
         *   In which case an advanced renderer might need to take different actions.
         * @returns {String|DomConfig|DomConfig[]|null}
         *
         * @category Rendering
         */
        'renderer'
    ];

    static defaults = {
        filterType : 'number',

        /**
         * Text align. Accepts `'left'`/`'center'`/`'right'` or direction neutral `'start'`/`'end'`
         * @prp {'left'|'center'|'right'|'start'|'end'} align
         * @category Layout
         * @default 'end'
         */
        align : 'end',

        exportedType : 'number'
    };

    //endregion

    //region Init

    get defaultEditor() {
        const { format, name, max, min, step, largeStep, align } = this;

        // Remove any undefined configs, to allow config system to use default values instead
        return ObjectHelper.cleanupProperties({
            type      : 'numberfield',
            format,
            name,
            max,
            min,
            step,
            largeStep,
            textAlign : align
        });
    }

    get formatter() {
        const
            me         = this,
            { format } = me;

        let formatter = me._formatter;

        if (!formatter || me._lastFormat !== format) {
            me._formatter = formatter = NumberHelper.getLocalizedFormatter(me._lastFormat = format);
        }

        return formatter;
    }

    formatValue(value, addUnit = true) {
        if (value != null) {
            value = this.formatter.format(value);

            if (this.unit && addUnit) {
                value = `${value}${this.unit}`;
            }
        }
        return value ?? '';
    }

    /**
     * Renderer that displays a formatted number in the cell. If you create a custom renderer, and want to include the
     * formatted number you can call `defaultRenderer` from it.
     *
     * ```javascript
     * new Grid({
     *     columns: [
     *         {
     *             type   : 'number',
     *             text   : 'Total cost',
     *             field  : 'totalCost',
     *             format : {
     *                 style    : 'currency',
     *                 currency : 'USD'
     *             },
     *             renderer({ value }) {
     *                  return `Total cost: ${this.defaultRenderer({ value })}`;
     *             }
     *         }
     *     ]
     * }
     * ```
     *
     * @param {Object} rendererData The data object passed to the renderer
     * @param {Number} rendererData.value The value to display
     * @returns {String} Formatted number
     * @ts-returns {String|DomConfig}
     */
    defaultRenderer({ value }) {
        return this.formatValue(value);
    }

    updateLocalization() {
        super.updateLocalization();

        this._formatter = null;  // recreate w/NumberHelper.getLocalizedFormatter(this.format) on next ".formatter"
    }
}

ColumnStore.registerColumnType(NumberColumn, true);
NumberColumn.exposeProperties();
