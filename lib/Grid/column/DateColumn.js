import Column from './Column.js';
import ColumnStore from '../data/ColumnStore.js';

/**
 * @module Grid/column/DateColumn
 */

/**
 * A column that displays a date in the specified {@link #config-format}. By default `L` format is used, which contains
 * the following info: full year, 2-digit month, and 2-digit day. Depending on the browser locale, the formatted date
 * might look different. [Intl.DateTimeFormat API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat)
 * is used to format the date. Here is an example of possible outputs depending on the browser locale:
 *
 * ```javascript
 * // These options represent `L` format
 * const options = { year : 'numeric', month : '2-digit', day : '2-digit' };
 *
 * new Intl.DateTimeFormat('en-US', options).format(new Date(2021, 6, 1)); // "07/01/2021"
 * new Intl.DateTimeFormat('ru-RU', options).format(new Date(2021, 6, 1)); // "01.07.2021"
 *
 * // Formatting using Bryntum API
 * LocaleManager.applyLocale('En');
 * DateHelper.format(new Date(2021, 6, 1), 'L'); // "07/01/2021"
 * LocaleManager.applyLocale('Ru');
 * DateHelper.format(new Date(2021, 6, 1), 'L'); // "01.07.2021"
 * ```
 *
 * To learn more about available formats check out {@link Core.helper.DateHelper} docs.
 *
 * The {@link Core.data.field.DateDataField field} this column reads data from should be a type of date.
 *
 * Default editor is a {@link Core.widget.DateField}.
 *
 * ```javascript
 * new Grid({
 *     columns : [
 *          { type: 'date', text: 'Start date', format: 'YYYY-MM-DD', field: 'start' }
 *     ]
 * });
 * ```
 *
 * {@inlineexample Grid/column/DateColumn.js}
 *
 * ## Useful configs
 *
 * | Config                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-format}                        | Date display format string                           |
 * | {@link #config-min}                           | Minimum selectable date                              |
 * | {@link #config-max}                           | Maximum selectable date                              |
 * | {@link #config-step}                          | Date picker step unit and amount                     |
 *
 * ## See also
 *
 * - {@link Grid.column.TimeColumn} - Column for time values
 * - {@link Core.helper.DateHelper} - Date formatting utilities
 * - {@link Core.widget.DateField} - Default editor widget
 *
 * @extends Grid/column/Column
 * @classtype date
 * @column
 * @tier community
 */
export default class DateColumn extends Column {

    //region Config

    static $name = 'DateColumn';

    static type = 'date';

    // Type to use when auto adding field
    static fieldType = 'date';

    static fields = [
        'format',
        'pickerFormat',
        'step',
        'min',
        'max',

        /**
         * Renderer function, used to style the date displayed in the cell. Can also affect other aspects of the cell,
         * such as styling.
         *
         * <div class="warning">
         * You should never modify any records inside this method.
         * </div>
         *
         * ```javascript
         * new Grid({
         *     columns : [
         *         { type : 'date', text : 'Date of birth', field : 'dob' },
         *     ]
         * });
         * ```
         *
         * You can modify the row element too from inside a renderer to add custom CSS classes:
         *
         * ```javascript
         * new Grid({
         *     columns : [
         *         {
         *             type : 'date',
         *             text : 'Date of birth',
         *             field : 'dob',
         *             renderer : ({ record, row }) => {
         *                // Add special CSS class to new rows that have not yet been saved
         *               row.cls.newRow = record.isPhantom;
         *
         *               return record.dob;
         *         }
         *     ]
         * });
         * ```
         *
         * When using the Bryntum React wrapper, this renderer can also return JSX elements. See
         * {@link Grid.column.Column#config-renderer} for a JSX example and performance considerations.
         *
         * @prp {Function} renderer
         * @param {Object} renderData Object containing renderer parameters
         * @param {HTMLElement} renderData.cellElement Cell element, for adding CSS classes, styling etc. Can be `null`
         * in case of export
         * @param {Date|null|undefined} renderData.value The Date value to be displayed in the cell
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
         * @param {Boolean} renderData.isExport `true` if the record is being exported to Excel or a textual format,
         * enabling special handling during export.
         * @param {Boolean} renderData.isMeasuring True if the column is being measured for a `resizeToFitContent` call.
         *   In which case an advanced renderer might need to take different actions.
         * @returns {String|DomConfig|DomConfig[]|null}
         *
         * @category Rendering
         */
        'renderer'
    ];

    static get defaults() {
        return {
            /**
             * Min value for the cell editor
             * @prp {String|Date} min
             */

            /**
             * Max value for the cell editor
             * @prp {String|Date} max
             */

            /**
             * The {@link Core.data.field.DateDataField#config-name} of the data model date field to read data from.
             * @prp {String} field
             * @category Common
             */

            /**
             * Date format to convert a given date object into a string to display. By default `L` format is used, which
             * contains the following info: full year, 2-digit month, and 2-digit day. Depending on the browser locale,
             * the formatted date might look different. [Intl.DateTimeFormat API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat)
             * is used to format the date. Here is an example of possible outputs depending on the browser locale:
             *
             * ```javascript
             * // These options represent `L` format
             * const options = { year : 'numeric', month : '2-digit', day : '2-digit' };
             *
             * new Intl.DateTimeFormat('en-US', options).format(new Date(2021, 6, 1)); // "07/01/2021"
             * new Intl.DateTimeFormat('ru-RU', options).format(new Date(2021, 6, 1)); // "01.07.2021"
             *
             * // Formatting using Bryntum API
             * LocaleManager.applyLocale('En');
             * DateHelper.format(new Date(2021, 6, 1), 'L'); // "07/01/2021"
             * LocaleManager.applyLocale('Ru');
             * DateHelper.format(new Date(2021, 6, 1), 'L'); // "01.07.2021"
             * ```
             *
             * To learn more about available formats check out {@link Core.helper.DateHelper} docs.
             *
             * Note, the {@link Core.data.field.DateDataField field} this column reads data from should be a type of date.
             * @prp {String|null}
             * @default
             * @category Common
             */
            format : 'L',

            /**
             * Time increment duration value to apply when clicking the left / right trigger icons. See
             * {@link Core.widget.DateField#config-step} for more information
             * Set to `null` to hide the step triggers. The editor's <kbd>Shift</kbd>+<kbd>ArrowUp</kbd> and
             * <kbd>Shift</kbd>+<kbd>ArrowDown</kbd> gestures remain available, stepping by one day. Set
             * {@link Core.widget.DateField#config-stepTriggers} to `false` to remove both.
             * @prp {String|Number|DurationConfig}
             * @default
             * @category Common
             */
            step : 1,

            minWidth : 90,

            filterType : 'date'
        };
    }

    construct(config = {}, columnStore) {
        super.construct(config, columnStore);

        // "Help" implementer who skipped defining model fields for their date columns
        if (this.grid) {
            const
                { field }      = this,
                { store }      = this.grid,
                { modelClass } = store,
                fieldInstance  = field && modelClass.getFieldDefinition(field);

            if (fieldInstance && !fieldInstance.isDateDataField) {
                console.warn(`DateColumn expects the \`type\` of the model field \`${field}\` to be of type \`date\``);

                const dateField = modelClass.addField({
                    ...fieldInstance.getCurrentConfig(),
                    type                                        : 'date',
                    ['format' in config ? 'format' : undefined] : this.format
                });
                // Replace data with proper dates (features like FilterBar can't operate on strings etc.)
                store.forEach(rec => rec.data[fieldInstance.dataSource] = dateField.convert(rec[field], rec.data, rec));
            }
        }
    }

    //endregion

    //region Display

    /**
     * Renderer that displays the date with the specified format. Also adds cls 'date-cell' to the cell.
     * @private
     */
    defaultRenderer({ value }) {
        return value ? this.formatValue(value) : '';
    }

    /**
     * Group renderer that displays the date with the specified format.
     * @private
     */
    groupRenderer({ cellElement, groupRowFor }) {
        cellElement.innerHTML = this.formatValue(groupRowFor);
    }

    //endregion

    //region Formatter

    /**
     * Used by both renderer and groupRenderer to do the actual formatting of the date
     * @private
     * @param {*} value Value to format
     * @returns {String}
     */
    formatValue(value) {
        const { dateHelper } = this;

        // Ideally we should be served a date, but if not make it easier for the user by parsing
        if (typeof value === 'string') {
            value = dateHelper.parse(value, this.format || undefined); // null does not use default format
        }
        return dateHelper.format(value, this.format || undefined);
    }

    //endregion

    //region Getters/setters

    set format(value) {
        const { editor } = this.data;

        this.set('format', value);

        if (editor) {
            editor.format = value;
        }
    }

    get format() {
        return this.get('format');
    }

    get defaultEditor() {
        const
            me                         = this,
            { min, max, step, format } = me;

        return {
            name                 : me.field,
            type                 : 'date',
            calendarContainerCls : 'b-grid-cell-editor-related',
            weekStartDay         : me.grid.weekStartDay,
            format,
            max,
            min,
            step
        };
    }

    //endregion

}

ColumnStore.registerColumnType(DateColumn, true);
DateColumn.exposeProperties();
