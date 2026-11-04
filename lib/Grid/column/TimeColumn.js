import Column from './Column.js';
import ColumnStore from '../data/ColumnStore.js';

/**
 * @module Grid/column/TimeColumn
 */

/**
 * A column that displays a time in the specified format (see {@link Core.helper.DateHelper#function-format-static} for
 * formatting options).
 *
 * Default editor is a {@link Core.widget.TimeField}.
 *
 * ```javascript
 * new Grid({
 *     appendTo : document.body,
 *
 *     columns : [
 *          { type: 'time', text: 'Start time', format: 'HH:mm:ss', field : 'start' }
 *     ]
 * });
 * ```
 *
 * {@inlineexample Grid/column/TimeColumn.js}
 *
 * ## Useful configs
 *
 * | Config                 | Description                                         |
 * |------------------------|-----------------------------------------------------|
 * | {@link #config-format} | Time display format string (e.g. `'LT'`, `'HH:mm'`) |
 *
 * ## See also
 *
 * - {@link Grid.column.DateColumn} - Column for date values
 * - {@link Core.helper.DateHelper} - Date/time formatting utilities
 * - {@link Core.widget.TimeField} - Default editor widget
 *
 * @extends Grid/column/Column
 * @classtype time
 * @column
 * @tier community
 */
export default class TimeColumn extends Column {
    static $name = 'TimeColumn';
    //region Config

    static type = 'time';

    // Type to use when auto adding field
    static fieldType = 'date';

    static fields = ['format'];

    static get defaults() {
        return {
            /**
             * Time format for time displayed in cell and editor
             * (see {@link Core.helper.DateHelper#function-format-static} for formatting options)
             * @prp {String}
             * @category Common
             * @default
             */
            format : 'LT',

            minWidth : 140,

            filterType : 'time'
        };
    }

    //endregion

    //region Display

    /**
     * Renderer that displays the time with the specified format. Also adds cls 'b-time-cell' to the cell.
     * @private
     */
    defaultRenderer({ value }) {
        return value ? this.formatValue(value) : '';
    }

    /**
     * Group renderer that displays the time with the specified format.
     * @private
     */
    groupRenderer({ cellElement, groupRowFor }) {
        cellElement.innerHTML = this.formatValue(groupRowFor);
    }

    //endregion

    //region Formatter

    /**
     * Used by both renderer and groupRenderer to do the actual formatting of the time
     * @private
     * @param {*} value Value to format
     * @returns {String}
     */
    formatValue(value) {
        const { dateHelper } = this;

        // Ideally we should be served a time, but if not make it easier for the user by parsing
        if (typeof value === 'string') {
            value = dateHelper.parse(value, this.format);
        }
        return dateHelper.format(value, this.format);
    }

    //endregion

    //region Getters/Setters
    set format(value) {
        const { editor } = this;

        this.set('format', value);

        if (editor) {
            editor.format = value;
        }
    }

    get format() {
        return  this.get('format');
    }

    get defaultEditor() {
        return {
            name   : this.field,
            type   : 'timefield',
            format : this.format
        };
    }

    //endregion
}

ColumnStore.registerColumnType(TimeColumn, true);
TimeColumn.exposeProperties();
