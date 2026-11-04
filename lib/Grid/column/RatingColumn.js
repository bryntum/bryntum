import NumberColumn from './NumberColumn.js';
import ColumnStore from '../data/ColumnStore.js';
import ArrayHelper from '../../Core/helper/ArrayHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';

DomHelper.loadStylesheet('Grid/column/RatingColumn.css');

// import Stylesheet from './RatingColumn.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'RatingColumn');

/**
 * @module Grid/column/RatingColumn
 */

/**
 * A column that displays a star rating. Click a start to set a value, shift+click to unset a single start from the end.
 * Clicking the first and only star toggles it.
 *
 * This column inherits from `NumberColumn` and uses a NumberField widget as its editor when the `CellEdit` feature is
 * active.
 *
 * ```javascript
 * new Grid({
 *     appendTo : document.body,
 *
 *     columns : [
 *         { type: 'rating', max : 10, field: 'rating' }
 *     ]
 * });
 * ```
 *
 * {@inlineexample Grid/column/RatingColumn.js}
 *
 * ## Useful configs
 *
 * | Config                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-max}                           | Maximum number of stars                              |
 * | {@link #config-emptyIcon}                     | Icon class for empty stars                           |
 * | {@link #config-filledIcon}                    | Icon class for filled stars                          |
 * | {@link #config-editable}                      | Allow clicking to change the rating                  |
 *
 * ## See also
 *
 * - {@link Grid.column.NumberColumn} - Parent column type
 *
 * @extends Grid/column/NumberColumn
 * @classtype rating
 * @column
 * @tier community
 */
export default class RatingColumn extends NumberColumn {
    preventCellEditViaMouse = true;
    // <debug>
    // region Localization test
    static localization = [
        'L{Column.cellLabel}'
    ];
    // endregion
    // </debug>

    static $name = 'RatingColumn';

    static type = 'rating';

    // Type to use when auto adding field
    static fieldType = 'number';

    static fields = [
        'emptyIcon',
        'filledIcon',
        'editable'
    ];

    static get defaults() {
        return {
            min : 0,
            max : 5,

            /**
             * The empty rating icon to show
             * @prp {String}
             * @category Rendering
             */
            emptyIcon : 'b-icon b-icon-star',

            /**
             * The filled rating icon to show
             * @prp {String}
             * @category Rendering
             */
            filledIcon : 'b-icon b-icon-star',

            /**
             * Allow user to click a rating icon to change the value
             * @prp {Boolean}
             * @category Interaction
             */
            editable : true,

            exportedType : 'string',
            filterType   : 'number',
            searchable   : false,
            width        : 120,
            htmlEncode   : false,
            minWidth     : 120,
            align        : 'start',
            fitMode      : 'value'
        };
    }

    /**
     * Renderer that displays a number of stars in the cell. Also adds CSS class 'b-rating-cell' to the cell.
     * @private
     */
    defaultRenderer({ value, isExport }) {
        if (isExport) {
            return '★'.repeat(value);
        }

        return {
            className : {
                'b-rating-cell-inner' : 1,
                'b-not-editable'      : !this.editable
            },
            children : ArrayHelper.populate(this.max, i => {
                const filled = i < value;
                return {
                    tag       : 'i',
                    className : {
                        'b-rating-icon'                             : true,
                        'b-filled'                                  : filled,
                        'b-empty'                                   : !filled,
                        [filled ? this.filledIcon : this.emptyIcon] : true
                    }
                };
            })
        };
    }

    onCellClick({ grid, column, record, target, event }) {
        if (target.classList.contains('b-rating-icon') && !grid.readOnly && column.editable) {
            let starIndex = [].indexOf.call(target.parentNode.childNodes, target);

            if (target.classList.contains('b-filled') && (event.metaKey || event.shiftKey)) {
                starIndex = starIndex - 1;
            }

            // Clicking first star when it is only one removes it
            if (record.getValue(column.field) === 1 && starIndex === 0) {
                starIndex = -1;
            }

            record.set(column.field, starIndex + 1);
        }
    }
}

ColumnStore.registerColumnType(RatingColumn, true);
RatingColumn.exposeProperties();
