import Column from './Column.js';
import ColumnStore from '../data/ColumnStore.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import TreeColumnMixin from './mixin/TreeColumnMixin.js';

DomHelper.loadStylesheet('Grid/column/TreeColumn.css');

// import Stylesheet from './TreeColumn.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TreeColumn');

/**
 * @module Grid/column/TreeColumn
 */

/**
 * A column that displays a tree structure when using the {@link Grid.feature.Tree} feature.
 *
 * Default editor is a {@link Core.widget.TextField}.
 *
 * TreeColumn provides configs to define icons for {@link #config-expandIconCls expanded} /
 * {@link #config-collapseIconCls collapsed} nodes, {@link #config-expandedFolderIconCls expanded folder} /
 * {@link #config-collapsedFolderIconCls collapsed folder} nodes and {@link #config-leafIconCls leaf} nodes.
 *
 * When the TreeColumn renders its cells, it will look for two special fields {@link Grid.data.GridRowModel#field-href}
 * and {@link Grid.data.GridRowModel#field-target}. Specifying `href` will produce a link for the TreeNode,
 * and `target` will have the same meaning as in an A tag:
 *
 * ```javascript
 * {
 *    id        : 1,
 *    name      : 'Some external link'
 *    href      : '//www.website.com",
 *    target    : '_blank"
 * }
 * ```
 *
 * ## Snippet
 * ```javascript
 * new TreeGrid({
 *     appendTo : document.body,
 *
 *     columns : [
 *          { type: 'tree', field: 'name' }
 *     ]
 * });
 * ```
 *
 * {@inlineexample Grid/column/TreeColumn.js}
 *
 * ## Cell renderers
 *
 * You can affect the contents and styling of cells in this column using a
 * {@link Grid.column.TreeColumn#config-renderer} function.
 *
 * ```javascript
 * const grid = new Grid({
 *   columns : [{
 *       type       : 'tree',
 *       field      : 'name',
 *       text       : 'Name',
 *       renderer({ value, record }) {
 *         return `${value} (${record.childLevel})`
 *       }
 *     }]
 * });
 * ```
 *
 * ## Alternative: tree: true config
 *
 * Instead of using `type: 'tree'`, you can add tree rendering to any column type by
 * configuring it with `tree: true`:
 *
 * ```javascript
 * const grid = new TreeGrid({
 *     columns : [
 *         // These are equivalent:
 *         { type: 'tree', field: 'name' },
 *         { field: 'name', tree: true },
 *
 *         // Any column type can be a tree column:
 *         { type: 'resourceInfo', tree: true, field: 'name' },
 *         { type: 'check', tree: true, field: 'done' }
 *     ]
 * });
 * ```
 *
 * ## Useful configs
 *
 * | Config                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-expandIconCls}                 | Icon for expanded nodes                              |
 * | {@link #config-collapseIconCls}               | Icon for collapsed nodes                             |
 * | {@link #config-leafIconCls}                   | Icon for leaf nodes                                  |
 * | {@link #config-expandedFolderIconCls}         | Icon for expanded folder nodes                       |
 * | {@link #config-collapsedFolderIconCls}        | Icon for collapsed folder nodes                      |
 *
 * ## See also
 *
 * - {@link Grid.view.TreeGrid} - The tree grid view
 * - {@link Grid.feature.Tree} - Tree expand/collapse feature
 * - {@link Grid.column.Column} - Base column class
 *
 * @classtype tree
 * @extends Grid/column/Column
 * @mixes Grid/column/mixin/TreeColumnMixin
 * @column
 * @tier community
 */
export default class TreeColumn extends Column.mixin(TreeColumnMixin) {

    static $name = 'TreeColumn';

    static type = 'tree';

    static get defaults() {
        return {
            tree     : true,
            hideable : true,
            minWidth : 150
        };
    }

    static get fields() {
        return [
            /**
             * Renderer function, used to format and style the content displayed in the cell. Return the cell text you
             * want to display. Can also affect other aspects of the cell, such as styling.
             *
             * <div class="note">
             * As the TreeColumn adds its own cell content to the column, there is a limit to what is supported in the
             * renderer function in comparison with an ordinary
             * {@link Grid.column.Column#config-renderer Column renderer}. Most notably is that changing `cellElement`
             * content can yield unexpected results as it will be updated later in the rendering process.
             * </div>
             *
             * You can also return a {@link Core.helper.DomHelper#typedef-DomConfig} object describing the markup
             * ```javascript
             * new Grid({
             *     columns : [
             *         {
             *              type  : 'tree',
             *              field : 'name'
             *              text  : 'Name',
             *              renderer : ({ record }) => {
             *                  return {
             *                      class : 'myClass',
             *                      children : [
             *                          {
             *                              tag : 'i',
             *                              class : 'fa fa-pen'
             *                          },
             *                          {
             *                              tag : 'span',
             *                              text : record.name
             *                          }
             *                      ]
             *                  };
             *              }
             *         }
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
             *             type     : 'tree',
             *             field    : 'name',
             *             text     : 'Name',
             *             renderer : ({ record, row }) => {
             *                // Add special CSS class to new rows that have not yet been saved
             *               row.cls.newRow = record.isPhantom;
             *
             *               return record.name;
             *         }
             *     ]
             * });
             * ```
             *
             * <div class="note">
             * You should never modify any records inside this method.
             * </div>
             *
             * When using the Bryntum React wrapper, this renderer can also return JSX elements. See
             * {@link Grid.column.Column#config-renderer} for a JSX example and performance considerations.
             *
             * @prp {Function} renderer
             * @param {Object} renderData Object containing renderer parameters
             * @param {HTMLElement} renderData.cellElement Cell element, for adding CSS classes, styling etc. Can be `null` in case of export
             * @param {*} renderData.value Value to be displayed in the cell
             * @param {Core.data.Model} renderData.record Record for the row
             * @param {Grid.column.Column} renderData.column This column
             * @param {Grid.view.GridBase} renderData.grid This grid
             * @param {Grid.row.Row} renderData.row Row object. Can be null in case of export. Use the
             *   {@link Grid.row.Row#function-assignCls row's API} to manipulate CSS class names.
             * @param {Object} renderData.size Set `size.height` to specify the desired row height for the current row.
             *   Largest specified height is used, falling back to configured {@link Grid/view/Grid#config-rowHeight}
             *   in case none is specified. Can be null in case of export
             * @param {Number} renderData.size.height Set this to request a certain row height
             * @param {Number} renderData.size.configuredHeight Row height that will be used if none is requested
             * @param {Boolean} renderData.isExport `true` if record is being exported to Excel/textual format to allow special
             * handling during export.
             * @param {Boolean} renderData.isMeasuring True if the column is being measured for a `resizeToFitContent` call.
             *   In which case an advanced renderer might need to take different actions.
             * @returns {String|DomConfig|null}
             *
             * @category Rendering
             */
            'renderer'
        ];
    }
}

ColumnStore.registerColumnType(TreeColumn, true);
TreeColumn.exposeProperties();
