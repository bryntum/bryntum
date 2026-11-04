import GridFeature from './GridFeature.js';
import Delayable from '../../Core/mixin/Delayable.js';
import '../column/TreeColumn.js';

/**
 * @module Grid/feature/Tree
 */

const immediatePromise = Promise.resolve();

/**
 * Feature that makes the grid work more like a tree. Included by default in {@link Grid.view.TreeGrid}. Requires
 * exactly one {@link Grid.column.TreeColumn} among grids columns. That column will have its renderer replaced with a
 * tree renderer that adds padding and icon to give the appearance of a tree. The original renderer is preserved and
 * also called.
 *
 * {@inlineexample Grid/feature/Tree.js}
 *
 * This feature is <strong>disabled</strong> by default. When enabled, the feature cannot be disabled during runtime.
 *
 * ## Keyboard shortcuts
 * This feature has the following default keyboard shortcuts:
 *
 * | Keys                                   | Action                   | Action description                                                   |
 * |----------------------------------------|--------------------------|----------------------------------------------------------------------|
 * | <kbd>Space</kbd>                       | *toggleCollapseByKey*    | When focus on a parent node, this expands or collapses its children |
 * | <kbd>ArrowRight</kbd>                  | *expandIfSingleColumn*   | Expands a focused parent node if grid consist of one column only     |
 * | <kbd>Shift</kbd>+<kbd>ArrowRight</kbd> | *expandByKey*            | Expands a focused parent node                                        |
 * | <kbd>ArrowLeft</kbd>                   | *collapseIfSingleColumn* | Collapses a focused parent node if grid consist of one column only   |
 * | <kbd>Shift</kbd>+<kbd>ArrowLeft</kbd>  | *collapseByKey*          | Collapses a focused parent node                                      |
 *
 * <div class="note">Please note that <kbd>Ctrl</kbd> is the equivalent to <kbd>Command</kbd> and <kbd>Alt</kbd>
 * is the equivalent to <kbd>Option</kbd> for Mac users</div>
 *
 * For more information on how to customize keyboard shortcuts, please see
 * [our guide](#Grid/guides/customization/keymap.md)
 *
 * ## See also
 *
 * - {@link Grid.view.TreeGrid} - The tree grid view
 * - {@link Grid.column.TreeColumn} - The tree column type
 * - {@link Grid.feature.TreeGroup} - Group flat data into a tree
 *
 * @extends Grid/feature/GridFeature
 *
 * @demo Grid/tree
 * @classtype tree
 * @feature
 * @tier community
 */
export default class Tree extends GridFeature.mixin(Delayable) {
    //region Config

    static $name = 'Tree';

    static type = 'tree';

    // On by default for the widgets that are inherently trees (GanttBase forces it on in construct()), and
    // a tree does not group
    static defaultEnabled = { TreeGrid : true, ResourceUtilization : true };
    static replaces = 'group';

    static configurable = {
        /**
         * Expand parent nodes when clicking on their cell
         * @prp {Boolean}
         * @default
         */
        expandOnCellClick : false,

        /**
         * See {@link #keyboard-shortcuts Keyboard shortcuts} for details
         * @config {Object<String,KeyMapConfig>}
         */
        keyMap : {
            ' '                : 'toggleCollapseByKey',
            ArrowRight         : 'expandIfSingleColumn',
            'Shift+ArrowRight' : 'expandByKey',
            ArrowLeft          : 'collapseIfSingleColumn',
            'Shift+ArrowLeft'  : 'collapseByKey'
        },

        /**
         * Show or hide tree lines
         * @prp {Boolean}
         * @default
         */
        treeLines : false
    };

    // Plugin configuration. This plugin chains some functions in Grid.
    static get pluginConfig() {
        return {
            assign : ['collapseAll', 'expandAll', 'collapse', 'expand', 'expandTo', 'toggleCollapse'],
            after  : ['onElementClick', 'bindStore', 'beforeRenderRow']
        };
    }

    //endregion

    //region Init

    construct(config) {
        super.construct(config);

        const { client } = this;

        // find column
        if (!this.treeColumn && client.initialConfig.columns?.length > 0) {
            console.info('To use the tree feature, one column should be configured with `type: \'tree\'`');
        }

        client.store && this.bindStore(client.store);
    }

    doDisable(disable) {
        if (disable) {
            throw new Error('Tree feature cannot be disabled');
        }
    }

    get store() {
        return this.client.store;
    }

    get treeColumn() {
        const
            me          = this,
            { columns } = me.client;

        if (!me._treeColumn || !columns.includes(me._treeColumn)) {
            me._treeColumn = columns.find(column => column.isTreeColumn);
        }

        return me._treeColumn;
    }

    bindStore(store) {
        this.detachListeners('store');

        store.ion({
            name                  : 'store',
            beforeLoadChildren    : 'onBeforeLoadChildren',
            loadChildren          : 'onLoadChildren',
            loadChildrenException : 'onLoadChildrenException',
            beforeToggleNode      : 'onBeforeToggleNode',
            beforeLazyLoad        : 'onBeforeLoadChildren',
            afterLazyLoad         : 'onLoadChildren',
            thisObj               : this
        });

        if (store.lazyLoad && !store.tree) {
            console.warn('To use the Tree feature on a lazy loaded store, requires the Store to be configured with `tree: true`');
        }
    }

    //endregion

    //region Expand & collapse

    /**
     * Collapse an expanded node or expand a collapsed. Optionally forcing a certain state.
     * This function is exposed on Grid and can thus be called as `grid.toggleCollapse()`
     * @param {String|Number|Core.data.Model} idOrRecord Record (the node itself) or id of a node to toggle
     * @param {Boolean} [collapse] Force collapse (true) or expand (false)
     * @on-owner
     * @category Tree
     */
    async toggleCollapse(idOrRecord, collapse) {
        if (idOrRecord == null) {
            throw new Error('Tree#toggleCollapse must be passed a record');
        }

        const
            me                = this,
            { store, client } = me,
            { rowManager }    = client,
            record            = store.getById(idOrRecord),
            meta              = record.instanceMeta(store);
        let row               = rowManager.getRowFor(record);

        // Record generation is incremented to force React/Vue wrappers to recreate UI elements
        record.generation++;

        if (await store.toggleCollapse(record, collapse)) {
            // Might get destroyed during async collapse
            if (me.isDestroyed) {
                return;
            }

            row = rowManager.getRowFor(record);

            if (row && record.ancestorsExpanded()) {
                // The row carries the expanded / collapsed classes, so we need to refresh it
                row.render(null, null, false);
            }

            // Add a temporary cls, used by Scheduler & Gantt to prevent transitions on events/tasks
            // Block multiple applications in the case of a recursive collapseAll operation
            if (!me.isTogglingNode) {
                client.addCls('b-toggling-node');
                me.isTogglingNode = true;
                me.requestAnimationFrame(() => {
                    client.removeCls('b-toggling-node');
                    me.isTogglingNode = false;
                });
            }

            /**
             * Fired before a parent node record is collapsed.
             * @event collapseNode
             * @param {Grid.view.Grid} source The firing Grid instance.
             * @param {Core.data.Model} record The record which has been collapsed.
             * @on-owner
             */

            /**
             * Fired after a parent node record is expanded.
             * @event expandNode
             * @param {Grid.view.Grid} source The firing Grid instance.
             * @param {Core.data.Model} record The record which has been expanded.
             * @on-owner
             */

            client.trigger(meta.collapsed ? 'collapseNode' : 'expandNode', { record });

            /**
             * Fired after a parent node record toggles its collapsed state.
             * @event toggleNode
             * @param {Core.data.Model} record The record being toggled.
             * @param {Boolean} collapse `true` if the node is being collapsed.
             * @on-owner
             */
            client.trigger('toggleNode', { record, collapse : meta.collapsed });
        }
    }

    /**
     * Collapse a single node.
     * This function is exposed on Grid and can thus be called as `grid.collapse()`
     * @param {String|Number|Core.data.Model} idOrRecord Record (the node itself) or id of a node to collapse
     * @on-owner
     * @category Tree
     */
    async collapse(idOrRecord) {
        return this.toggleCollapse(idOrRecord, true);
    }

    /**
     * Expand a single node.
     * This function is exposed on Grid and can thus be called as `grid.expand(idOrRecord)`
     * @param {String|Number|Core.data.Model} idOrRecord Record (the node itself) or id of a node to expand
     * @on-owner
     * @category Tree
     */
    async expand(idOrRecord) {
        return this.toggleCollapse(idOrRecord, false);
    }

    onBeforeToggleNode({ record, collapse }) {
        /**
         * Fired before a parent node record toggles its collapsed state.
         * @event beforeToggleNode
         * @param {Grid.view.Grid} source The firing Grid instance.
         * @param {Core.data.Model} record The record being toggled.
         * @param {Boolean} collapse `true` if the node is being collapsed.
         * @on-owner
         */
        this.client.trigger('beforeToggleNode', { record, collapse });
    }

    onBeforeLoadChildren({ source : store, params, parent = params && store.getById(params[store.modelClass.idField]) }) {
        this.client.rowManager.getRowFor(parent)?.addCls('b-loading-children');
    }

    onLoadChildren({ source : store, params, parent = params && store.getById(params[store.modelClass.idField]) }) {
        this.client.rowManager.getRowFor(parent)?.removeCls('b-loading-children');
    }

    onLoadChildrenException({ record }) {
        const row = this.client.rowManager.getRowFor(record);

        row?.removeCls('b-loading-children');
    }

    /**
     * Expand or collapse all nodes, as specified by param, starting at the passed node (which defaults to the root node)
     * @param {Boolean} [collapse] Set to `true` to collapse, `false` to expand (defaults to `true`)
     * @param {Core.data.Model} [topNode] The topmost node from which to cascade a collapse.
     * Defaults to the {@link Core.data.Store#property-rootNode}. Not included in the cascade if
     * the root node is being used.
     * @category Tree
     */
    async expandOrCollapseAll(collapse = true, topNode = this.store.rootNode) {
        // <remove-on-release>
        // TODO: Some logic here and some in the store, keep in same place maybe
        // </remove-on-release>
        const
            { client, store }   = this,
            { transition = {} } = client,
            animate             = transition.toggleTreeNode,
            promises            = [],
            childRecords        = [];

        client.trigger('beforeToggleAllNodes', { collapse });
        transition.toggleTreeNode = false;

        // Each collapse/expand will trigger events on store, avoid that by suspending
        store.suspendEvents();
        store.traverse(record => {
            const gridMeta = record.instanceMeta(store);
            if (!record.isLeaf) {
                if (collapse && !gridMeta.collapsed) {
                    this.toggleCollapse(record, true);
                    childRecords.push(...record.children);
                }
                else if (!collapse && gridMeta.collapsed) {
                    if (Array.isArray(record.children)) {
                        childRecords.push(...record.children);
                    }
                    promises.push(this.toggleCollapse(record, false));
                }
            }
        }, topNode, topNode === store.rootNode);
        store.resumeEvents();

        return (collapse ? immediatePromise : Promise.all(promises)).then(() => {
            if (childRecords.length) {
                if (collapse) {
                    store.trigger('remove', { records : childRecords, isCollapse : true, isCollapseAll : true });
                }
                else {
                    store.trigger('add', { records : childRecords, isExpand : true, isExpandAll : true });
                }
            }

            // Return to top when collapsing all
            client.refreshRows(null, collapse);

            client.trigger('toggleAllNodes', { collapse });
            transition.toggleTreeNode = animate;
        });
    }

    /**
     * Collapse all nodes.
     * This function is exposed on Grid and can thus be called as `grid.collapseAll()`
     * @on-owner
     * @category Tree
     */
    async collapseAll() {
        return this.expandOrCollapseAll(true);
    }

    /**
     * Expand all nodes.
     * This function is exposed on Grid and can thus be called as `grid.expandAll()`
     * @on-owner
     * @category Tree
     */
    async expandAll() {
        return this.expandOrCollapseAll(false);
    }

    /**
     * Expands parent nodes to make this node "visible".
     * This function is exposed on Grid and can thus be called as `grid.expandTo()`
     * @param {String|Number|Core.data.Model|String[]|Number[]|Core.data.Model[]} idOrRecord Record (the node itself),
     * or id of a node. Also accepts arrays of the same types.
     * @param {Boolean} [scrollIntoView=true] A flag letting you control whether to scroll the record into view
     * @on-owner
     * @async
     * @category Tree
     */
    async expandTo(idOrRecord, scrollIntoView = true) {
        const
            me                  = this,
            { store, client }   = me,
            { transition = {} } = client,
            animate             = transition.toggleTreeNode;

        if (Array.isArray(idOrRecord)) {
            if (idOrRecord.length > 0) {
                client.suspendRefresh();
                for (let i = idOrRecord.length - 1; i >= 0; i--) {
                    const record = store.getById(idOrRecord[i]);

                    if (i === 0) {
                        client.resumeRefresh?.(false);
                        // Ensure all parents are rendered
                        client.rowManager.refresh();
                    }

                    await me.expandTo?.(record, i === 0);
                }
            }

            return;
        }

        const record = store.getById(idOrRecord);

        // Hidden because it's in a collapsed Group: abort
        if (record.instanceMeta(me.store).hiddenByCollapse === false) {
            return;
        }

        transition.toggleTreeNode = false;

        // Expand any parents that need to be expanded to allow the record to be rendered.
        if (!record.ancestorsExpanded()) {
            const parents = [];

            // Collect parents which need expanding
            for (let parent = record.parent; parent && !parent.isRoot; parent = parent.parent) {
                if (!parent.isExpanded(store)) {
                    parents.unshift(parent);
                }
            }

            client.suspendRefresh();

            // Expand them from the top-down
            for (const parent of parents) {
                if (!me.isDestroyed) {
                    await me.toggleCollapse(parent, false);
                }
            }

            // Refreshing on expand was inhibited in toggleCollapse calls
            client.resumeRefresh?.(true);
        }

        transition.toggleTreeNode = animate;

        if (!me.isDestroyed && scrollIntoView) {
            await client.scrollRowIntoView(record);
        }
    }

    /**
     * Expands the parent nodes in the tree to the provided depth.
     * @param {Number} level The depth to expand to. Passing level `0` means the top level root parents will be expanded.
     * @param {Boolean} [collapseAll=false] Pass `true` to collapse all nodes before expanding
     * @category Tree
     */
    async expandToLevel(level, collapseAll = false) {
        const
            { store, client } = this,
            { transition }    = client,
            animate           = transition.toggleTreeNode,
            expandChildren    = parent => {
                parent.children.forEach(record => {
                    if (!record.isLeaf) {
                        if (record.instanceMeta(store).collapsed) {
                            this.toggleCollapse(record, false);
                        }

                        if (record.childLevel < level) {
                            expandChildren(record);
                        }
                    }
                });
            };

        // Each collapse/expand will trigger events on store, avoid that by suspending
        store.suspendEvents();
        client.suspendRefresh();

        if (collapseAll) {
            await this.collapseAll();
        }

        if (!client.isDestroyed) {
            transition.toggleTreeNode = false;

            expandChildren(store.rootNode);

            store.resumeEvents();
            client.resumeRefresh(true);

            transition.toggleTreeNode = animate;
        }
    }
    //endregion

    //region Events

    /**
     * Called when user clicks somewhere in the grid. Expand/collapse node on icon click.
     * @private
     */
    onElementClick(event) {
        const
            me              = this,
            target          = event.target,
            cellData        = me.client.getCellDataFromEvent(event),
            clickedExpander = target.closest('.b-tree-expander');

        if (clickedExpander) {
            event.preventDefault();
        }
        // Checks if click is on node expander icon, then toggles expand/collapse. Also toggles on entire cell if expandOnCellClick is true
        if (clickedExpander || (me.expandOnCellClick && cellData?.record.isParent)) {
            me.toggleCollapse(cellData.record);
        }
    }

    /**
     * Called on key down in grid. Expand/collapse node on <kbd>Space</kbd>
     * @private
     */
    toggleCollapseByKey() {
        const { focusedCell } = this.client;

        // Only catch space on grid cell element, not in header, editors etc...
        if (focusedCell?.rowIndex > -1 && !this.client.features.cellEdit?.isEditing && focusedCell.record.isParent && document.activeElement.closest('.b-grid-cell')) {
            this.toggleCollapse(focusedCell.id);
            return true;
        }

        return false;
    }

    //endregion

    //region Rendering

    beforeRenderRow({ record, cls }) {
        if (!record.isLeaf) {
            const
                { store }   = this.client,
                isCollapsed = !record.isExpanded(store);

            cls['b-tree-parent-row'] = 1;
            cls['b-tree-collapsed'] = isCollapsed;
            cls['b-tree-expanded'] = !isCollapsed;
            cls['b-loading-children'] = record.instanceMeta(store).isLoadingChildren;
        }
        else {
            cls['b-tree-parent-row'] = 0;
            cls['b-tree-collapsed'] = 0;
            cls['b-tree-expanded'] = 0;
            cls['b-loading-children'] = 0;
        }
    }

    //endregion

    // Expands tree if single column.
    // Called by default on ArrowRight
    expandIfSingleColumn() {
        if (this.client.columns.count === 1) {
            return this.expandByKey();
        }

        // Tells keymap to continue with other actions
        return false;
    }

    // Expands tree on Shift+ArrowRight by default.
    expandByKey() {
        const
            me              = this,
            { client }      = me,
            { focusedCell } = client,
            record          = focusedCell?.record;

        // shift triggers tree navigation behaviour, also used by default for single column which is tree
        if (record && focusedCell?.column.tree && record.isParent && record.instanceMeta(client.store).collapsed) {
            me.expand(record);
            return true;
        }

        // Tells keymap to continue with other actions
        return false;
    }

    collapseIfSingleColumn() {
        if (this.client.columns.count === 1) {
            return this.collapseByKey();
        }

        // Tells keymap to continue with other actions
        return false;
    }

    collapseByKey() {
        const
            me              = this,
            { client }      = me,
            { focusedCell } = client,
            record          = focusedCell?.record;

        // shift triggers tree navigation behaviour, also used by default for single column which is tree
        if (focusedCell?.column.tree && record) {
            // on expanded parent, collapse
            if (record.isParent && !record.instanceMeta(client.store).collapsed) {
                me.collapse(record);
                return true;
            }
            // otherwise go to parent
            if (record.parent && !record.parent.isRoot) {
                // Deselect everything before doing this.
                // Causes strange selection ranges otherwise
                client.deselectAll();
                client.focusCell({
                    record : record.parent,
                    column : focusedCell.column
                });
                return true;
            }
        }

        // Tells keymap to continue with other actions
        return false;
    }

    updateTreeLines(show) {
        this.client.element.classList.toggle('b-show-tree-lines', Boolean(show));
        if (!this.isConfiguring) {
            this.client.refreshRows();
        }
    }
}

Tree.initClass();
