import NumberColumn from './NumberColumn.js';
import ColumnStore from '../data/ColumnStore.js';
import DomHelper from '../../Core/helper/DomHelper.js';

DomHelper.loadStylesheet('Grid/column/PercentColumn.css');

// import Stylesheet from './PercentColumn.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'PercentColumn');

/**
 * @module Grid/column/PercentColumn
 */

/**
 * A column that either displays a basic percent number, a rectangular progress bar, or a circular progress bar.
 *
 * {@inlineexample Grid/column/PercentColumn.js}
 *
 * ```javascript
 * new Grid({
 *     appendTo : document.body,
 *
 *     columns : [
 *         { type: 'percent', text: 'Progress', data: 'progress' }
 *     ]
 * });
 * ```
 *
 * ## Styling
 *
 * All cells in this column get a `b-percent-cell` class added.
 *
 * If {@link #config-mode} is set to `bar` (default), the progress bar element in the cell gets a
 * few special CSS classes added:
 *
 * - If value equals 0, a `b-zero` CSS class is added to the circle element.
 * - If value is less than {@link #config-lowThreshold}, a `b-low` CSS class is added to the bar element.
 * - If value equals 100, a `b-full` CSS class is added to the bar element.
 * - If value is > 100, a `b-over` CSS class is added to the bar element.
 *
 * If {@link #config-mode} is set to `circle`, the progress circle element in the cell gets a
 * few special CSS classes added:
 *
 * - If value equals 0, a `b-empty` CSS class is added to the circle element.
 * - If value equals 100, a `b-full` CSS class is added to the circle element.
 * - If value is > 100, a `b-over` CSS class is added to the circle element.
 *
 * Default editor is a {@link Core.widget.NumberField}.
 *
 * ## Useful configs
 *
 * | Config                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-mode}                          | Display mode: `bar`, `circle`, or `number`           |
 * | {@link #config-lowThreshold}                  | Value below which `b-low` CSS class is added         |
 * | {@link #config-showValue}                     | Show numeric value inside the bar                    |
 *
 * ## See also
 *
 * - {@link Grid.column.NumberColumn} - Parent column type
 * - {@link Core.widget.NumberField} - Default editor widget
 *
 * @extends Grid/column/NumberColumn
 * @classtype percent
 * @column
 * @tier community
 */
export default class PercentColumn extends NumberColumn {
    static $name = 'PercentColumn';

    circleHeightPercentage = 0.75;

    static type = 'percent';

    static fields = [
        /**
         * @hideconfigs htmlEncode
         */
        'showValue',
        'lowThreshold',
        'mode'
    ];

    static defaults = {
        min   : 0,
        max   : 100,
        step  : 1,
        align : null,

        /**
         * This mode controls the rendering.
         * - `number` to render a formatted number value (e.g. 15%)
         * - `circle` to render a circular progress bar
         * - `bar` to render a plain rectangular progress bar
         * @prp {'number'|'bar'|'circle'}
         * @default
         * @category Rendering
         */
        mode : 'bar',

        /**
         * Set to `true` to render the number value inside the bar, for example `'15%'`.
         * @prp {Boolean}
         * @default
         * @category Rendering
         */
        showValue : false,

        /**
         * When below this percentage the bar will have `b-low` CSS class added. By default, it turns the bar red.
         * @prp {Number}
         * @default
         * @category Rendering
         */
        lowThreshold : 0,

        htmlEncode      : false,
        searchable      : false,
        summaryRenderer : ({ sum }) => `${sum}%`,
        fitMode         : false
    };

    /**
     * Renderer that displays a progress bar in the cell. If you create a custom renderer, and want to include the
     * default markup you can call `defaultRenderer` from it.
     *
     * ```javascript
     * new Grid({
     *     columns: [
     *         {
     *             type: 'percent',
     *             text : 'Percent',
     *             field : 'percent',
     *             renderer({ value }) {
     *                 const domConfig = this.defaultRenderer();
     *
     *                 if (value > 100) {
     *                     domConfig.className = b-percent-bar-outer over-allocated';
     *                 }
     *
     *                 return domConfig;
     *             }
     *         }
     *     ]
     * }
     * ```
     *
     * @param {Object} rendererData The data object passed to the renderer
     * @param {Number} rendererData.value The value to display
     * @returns {DomConfig} DomConfig object representing the default markup for the cells content
     */
    defaultRenderer({ value, record, isExport }) {
        value = value || 0;

        const
            me             = this,
            formattedValue = me.formatValue(value, record) || value,
            label          = `${me.text ? `${me.text} : ` : ''}${formattedValue}`;

        if (isExport) {
            return formattedValue;
        }
        else if (me.mode === 'number') {
            return formattedValue + '%';
        }

        const { min, max } = me;

        if (me.mode === 'circle') {
            // Math.round to work around Chrome bug: https://bugs.chromium.org/p/chromium/issues/detail?id=1468916
            const sizePx = Math.round(me.circleHeightPercentage * me.grid.rowHeight) + 'px';

            return {
                tabIndex        : 0,
                role            : 'progressbar',
                'aria-valuemin' : min,
                'aria-valuemax' : max,
                'aria-valuenow' : value,
                'aria-label'    : me.formatAriaLabel?.(label, record) || label,
                className       : {
                    'b-percent-done-circle' : 1,
                    'b-empty'               : value === 0,
                    'b-full'                : value === 100,
                    'b-over'                : value > 100
                },
                style : {
                    height                             : sizePx,
                    width                              : sizePx,
                    '--bi-percent-column-circle-angle' : `${value / 100}turn`
                },
                dataset : {
                    value : formattedValue
                }
            };
        }

        return {
            className : {
                'b-percent-bar-outer' : 1,
                'b-zero'              : value === 0,
                'b-low'               : value < me.lowThreshold,
                'b-full'              : value === 100,
                'b-over'              : value > 100
            },
            style : {
                '--bi-percent-bar-value' : value + '%'
            },
            role            : 'progressbar',
            'aria-valuemin' : min,
            'aria-valuemax' : max,
            'aria-valuenow' : value,
            'aria-label'    : me.formatAriaLabel?.(label, record) || label,
            tabIndex        : 0,
            children        : [
                {
                    className : 'b-percent-bar'
                },
                me.showValue ? {
                    className : 'b-percent-bar-value',
                    children  : [{
                        tag  : 'label',
                        text : value + '%'
                    }]
                } : null
            ]
        };
    }

    // Null implementation for graphic representations, because the column width drives the width of its content.
    // So the concept of sizing to content is invalid here.
    resizeToFitContent(...args) {
        if (this.mode === 'number') {
            return super.resizeToFitContent(...args);
        }
    }

    get align() {
        const
            align = this.get('align'),
            { mode } = this;

        if (align) {
            return align;
        }

        if (mode === 'number') {
            return 'end';
        }

        if (mode === 'circle') {
            return 'center';
        }
        return 'start';
    }

    set align(align) {
        this.set('align', align);
    }

    get htmlEncode() {
        return this.mode === 'number';
    }

    get internalCellCls() {
        return this.mode === 'bar' ? 'b-percent-bar-cell' : '';
    }
}

PercentColumn.sum = 'average';

ColumnStore.registerColumnType(PercentColumn, true);
