import Grid from './Grid.js';

// tree feature will be added by default to TreeGrid, but needs to be imported
import '../feature/Tree.js';
// not used here but enables using `type : tree` in a column config (exactly one required)
import '../column/TreeColumn.js';

/**
 * @module Grid/view/TreeGrid
 */

/**
 * A TreeGrid combines hierarchical tree data with a full-featured grid. It must be configured with exactly one
 * {@link Grid.column.TreeColumn} (`type: tree`), but can also have an arbitrary number of other columns. Most features
 * that can be used with Grid also work with TreeGrid, except the Group feature.
 *
 * ```javascript
 * const treeGrid = new TreeGrid({
 *     appendTo : document.body,
 *     columns  : [
 *         { type : 'tree', field : 'name', text : 'Name', flex : 1 },
 *         { field : 'size', text : 'Size', width : 100 }
 *     ],
 *     data : [
 *         {
 *             name     : 'Documents',
 *             expanded : true,
 *             children : [
 *                 { name : 'Report.pdf', size : '2.1 MB', leaf : true },
 *                 { name : 'Notes.txt', size : '12 KB', leaf : true }
 *             ]
 *         }
 *     ]
 * });
 * ```
 *
 * {@inlineexample Grid/view/TreeGrid.js}
 *
 * {@note}Using a Store configured with {@link Core.data.Store#config-lazyLoad} is not supported in TreeGrid.{/@note}
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-store}                         | Tree store (must have `tree: true`)                  |
 * | {@link #config-columns}                       | Must include one `{ type : 'tree' }` column          |
 * | {@link #function-toggleCollapse}              | Expand or collapse a node                            |
 * | {@link #function-collapse}                    | Collapse a single node                               |
 * | {@link #function-expand}                      | Expand a single node                                 |
 * | {@link #function-expandAll}                   | Expand all tree nodes                                |
 * | {@link #function-collapseAll}                 | Collapse all tree nodes                              |
 *
 * ## See also
 *
 * - {@link Grid.view.Grid} - Non-tree grid
 * - {@link Grid.column.TreeColumn} - The required tree column type
 * - {@link Grid.feature.Tree} - Tree feature handling expand/collapse
 * - {@link Core.data.Store} - Data store (configure with `tree: true`)
 *
 * @extends Grid/view/Grid
 * @classtype treegrid
 * @widget
 */
export default class TreeGrid extends Grid {

    static $name = 'TreeGrid';

    // Factoryable type name
    static type = 'treegrid';

    static configurable = {
        /**
         * The store instance or config object that holds the records to be displayed by this TreeGrid. If assigning
         * a store instance, it must be configured with `tree: true`.
         *
         * A store will be created if none is specified.
         * @config {Core.data.Store|StoreConfig} store
         * @category Common
         */
        store : {
            tree : true
        }
    };

    //region Plugged in functions / inherited configs

    /**
     * Collapse an expanded node or expand a collapsed. Optionally forcing a certain state.
     *
     * @function toggleCollapse
     * @param {String|Number|Core.data.Model} idOrRecord Record (the node itself) or id of a node to toggle
     * @param {Boolean} [collapse] Force collapse (true) or expand (false)
     * @param {Boolean} [skipRefresh] Set to `true` to not refresh rows (if calling in batch)
     * @async
     * @non-lazy-load
     * @category Feature shortcuts
     */

    /**
     * Collapse a single node.
     *
     * @function collapse
     * @param {String|Number|Core.data.Model} idOrRecord Record (the node itself) or id of a node to collapse
     * @async
     * @non-lazy-load
     * @category Feature shortcuts
     */

    /**
     * Expand a single node.
     *
     * @function expand
     * @param {String|Number|Core.data.Model} idOrRecord Record (the node itself) or id of a node to expand
     * @async
     * @non-lazy-load
     * @category Feature shortcuts
     */

    /**
     * Expands parent nodes to make this node "visible".
     *
     * @function expandTo
     * @param {String|Number|Core.data.Model} idOrRecord Record (the node itself) or id of a node
     * @async
     * @non-lazy-load
     * @category Feature shortcuts
     */

    //endregion

    /* disconnect doc comment */

    //region Store

    updateStore(store, was) {
        if (store && !(store.tree || store.isTree)) {
            throw new Error('TreeGrid requires a Store configured with tree : true');
        }

        super.updateStore(store, was);
    }

    //endregion
}

// Register this widget type with its Factory
TreeGrid.initClass();
