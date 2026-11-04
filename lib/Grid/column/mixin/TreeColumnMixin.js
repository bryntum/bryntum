import DomSync from '../../../Core/helper/DomSync.js';
import DomClassList from '../../../Core/helper/util/DomClassList.js';

/**
 * @module Grid/column/mixin/TreeColumnMixin
 */

/**
 * A mixin that adds tree rendering capabilities to any column type. Applied automatically when a column config includes
 * `tree: true`.
 *
 * This mixin extracts all tree rendering logic from TreeColumn, allowing any column type (e.g., `ResourceInfoColumn`,
 * `CheckColumn`) to display tree structure when configured with `tree: true`.
 *
 * ## Usage
 *
 * ```javascript
 * const grid = new TreeGrid({
 *     columns : [
 *         // Any column type can now be a tree column
 *         { type : 'resourceInfo', tree : true, field : 'name' },
 *         { type : 'check', tree : true, field : 'done' }
 *     ]
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Grid.column.TreeColumn} - Dedicated tree column
 * - {@link Grid.feature.Tree} - Tree feature
 * - {@link Grid.view.TreeGrid} - Tree grid
 *
 * @mixin
 * @tier community
 */
export default Target => class TreeColumnMixin extends Target {
    static $name = 'TreeColumnMixin';

    //region Config

    static get fields() {
        return [
            /**
             * The icon to use for the expand / collapse button icon in collapsed state
             * @prp {String|null} expandIconCls
             */
            { name : 'expandIconCls', defaultValue : 'b-icon b-icon-tree-expand' },

            /**
             * The icon to use for the expand / collapse button in expanded state
             * @prp {String|null} collapseIconCls
             */
            { name : 'collapseIconCls', defaultValue : 'b-icon b-icon-tree-collapse' },

            /**
             * The icon to use for a parent node in collapsed state
             * @prp {String|null} collapsedFolderIconCls
             */
            { name : 'collapsedFolderIconCls' },

            /**
             * The icon to use for a parent node in expanded state
             * @prp {String|null} expandedFolderIconCls
             */
            { name : 'expandedFolderIconCls' },

            /**
             * Size of the child indent in em. Resulting indent is indentSize multiplied by child level.
             *
             * Sets the `--b-tree-indent-size` CSS variable. By default, the value of the variable set by the theme is
             * used.
             *
             * @prp {Number} indentSize
             */
            { type : 'number', name : 'indentSize' },

            /**
             * The icon to use for the leaf nodes in the tree
             * @prp {String|null} leafIconCls
             */
            { name : 'leafIconCls', defaultValue : 'b-icon b-icon-tree-leaf' },

            { name : 'editTargetSelector', defaultValue : '.b-tree-cell-value' }
        ];
    }

    //endregion

    //region Type identification

    /**
     * Identifies this column as a tree column
     * @member {Boolean}
     * @readonly
     */
    static get isTreeColumn() {
        return true;
    }

    /**
     * Identifies this column as a tree column
     * @member {Boolean}
     * @readonly
     */
    get isTreeColumn() {
        return true;
    }

    //endregion

    //region Init

    construct(config, store, ...args) {
        super.construct(config, store, ...args);

        const me = this;

        // Ensure tree is set to true (in case we were mixed in dynamically)
        if (!me.tree) {
            me.setData('tree', true);
        }

        // We handle htmlEncoding in this class rather than relying on the generic Row DOM manipulation
        // since this class requires quite a lot of DOM infrastructure around the actual rendered content
        me.shouldHtmlEncode = me.htmlEncode;
        me.setData('htmlEncode', false);

        // Add tree renderer (which calls original renderer internally)
        // Check for both renderer and defaultRenderer (used by some column types like ResourceInfoColumn)
        const { renderer } = me;
        if (!(me.grid.splitFrom || me.grid.initialConfig.splitFrom)) {
            if (renderer) {
                me.originalRenderer = renderer;
            }
            else if (me.defaultRenderer) {
                // Column class has a defaultRenderer - use it as originalRenderer
                // This handles columns like ResourceInfoColumn that use defaultRenderer instead of renderer
                me.originalRenderer = me.defaultRenderer.bind(me);
            }
        }

        me.setData('renderer', me.treeRenderer.bind(me));

        me.indentSize != null && me.updateIndentSize();
    }

    //endregion

    //region Tree Rendering

    /**
     * Generates tree line blocks for hierarchical indentation
     * @param {Number} childLevel - The child level to generate lines for
     * @returns {Object[]} Array of tree line DOM configs
     * @private
     */
    buildTreeLineBlocks(childLevel) {
        const blocks = [];
        for (let i = 0; i < childLevel; i++) {
            blocks.push({
                tag       : 'span',
                className : `b-tree-line b-tree-line-${i}`
            });
        }
        return blocks;
    }

    /**
     * Determines the appropriate icon class for a tree node
     * @param {Core.data.Model} record - The record to get icon for
     * @param {Object} renderData - The render data object
     * @param {Boolean} isCollapsed - Whether the node is collapsed
     * @returns {String|null} The icon class or null
     * @private
     */
    getTreeIconCls(record, renderData, isCollapsed) {
        // Check for custom icon in renderData or record
        if (renderData.iconCls || record.iconCls) {
            return renderData.iconCls || record.iconCls;
        }

        // Parent node icons
        if (!record.isLeaf) {
            return isCollapsed ? this.collapsedFolderIconCls : this.expandedFolderIconCls;
        }

        // Leaf node icon
        return this.leafIconCls;
    }

    /**
     * Processes the renderer value and calls the original renderer if present
     * @param {Object} renderData - The render data object
     * @returns {Object} Object containing processed value, outputIsObject flag, and rendering column
     * @private
     */
    processRendererValue(renderData) {
        const
            me               = this,
            { grid, record } = renderData,
            { features }     = grid,
            // Only fire for actual generated parents, not for preserved non-leaf source records
            // (which can appear under generated parents when TreeGroup `sourceLevel` is not `'leaves'`).
            parentRenderer   = grid.isTreeGrouped && record.generatedParent && features.treeGroup.parentRenderer;

        let { value }       = renderData,
            renderingColumn = me,
            outputIsObject  = false,
            rendererHtml;

        // No custom renderer - return original value
        if (!me.originalRenderer && !parentRenderer) {
            return { value : String(value ?? ''), outputIsObject, renderingColumn };
        }

        // Handle parent renderer (tree grouping)
        if (parentRenderer) {
            if (record.field) {
                renderingColumn = grid.columns.get(record.field);
                if (renderingColumn) {
                    value = renderingColumn.isWidgetColumn ? value
                        : (renderingColumn === me ? renderingColumn.originalRenderer : renderingColumn.renderer)?.call(renderingColumn, {
                            ...renderData,
                            column      : renderingColumn,
                            value       : record.name,
                            isTreeGroup : true
                        }) ?? record.name;
                }
                else {
                    value = record.name;
                }
            }

            rendererHtml = features.treeGroup.parentRenderer({
                ...renderData,
                field  : record.field,
                value,
                column : renderingColumn,
                record : record.firstGroupChild,
                grid
            });
        }
        // Handle original renderer
        else {
            rendererHtml = me.originalRenderer(renderData);
        }

        // Check for framework renderer
        const hasFrameworkRenderer = grid.hasFrameworkRenderer?.({
            cellContent : rendererHtml,
            renderingColumn
        });

        outputIsObject          = typeof rendererHtml === 'object' && !hasFrameworkRenderer;
        value                   = hasFrameworkRenderer ? '' : (rendererHtml === false ? renderData.cellElement.innerHTML : rendererHtml);
        renderData.rendererHtml = rendererHtml;

        return {
            value : outputIsObject ? value : String(value ?? ''),
            outputIsObject,
            renderingColumn
        };
    }

    /**
     * Handles widget column rendering by relocating widgets into tree structure
     * @param {Object} renderData - The render data object
     * @param {Number} childLevel - The child level
     * @param {Object[]} treeLineBlocks - Pre-built tree line blocks
     * @param {Object} treeStructure - The tree structure DOM config
     * @returns {Boolean} True if widget handling was performed
     * @private
     */
    handleWidgetColumnRendering(renderData, childLevel, treeLineBlocks, treeStructure) {
        const
            { cellElement, row } = renderData,
            widgetElements       = [...cellElement.querySelectorAll(':scope > .b-widget')];

        if (!widgetElements.length) {
            return false;
        }

        // Set tree level on row
        row.eachElement(el => el.style.setProperty('--b-tree-level', childLevel));

        // Remove widgets temporarily
        widgetElements.forEach(widget => widget.remove());

        // Sync tree structure
        DomSync.sync({
            targetElement : cellElement,
            domConfig     : {
                onlyChildren : true,
                children     : [...treeLineBlocks, treeStructure]
            }
        });

        // Relocate widgets into tree value element
        const treeValueEl = cellElement.querySelector('.b-tree-cell-value');
        if (treeValueEl) {
            widgetElements.forEach(widget => treeValueEl.appendChild(widget));
        }

        return true;
    }

    /**
     * Configures the inner tree cell value element
     * @param {Object} innerConfig - The inner config object to modify
     * @param {Object} treeStructure - The tree structure config object
     * @param {*} value - The value to render
     * @param {Boolean} outputIsObject - Whether the value is a DomConfig object
     * @param {Grid.column.Column} renderingColumn - The column doing the rendering
     * @private
     */
    configureInnerElement(innerConfig, treeStructure, value, outputIsObject, renderingColumn) {
        // Array of DomConfigs
        if (Array.isArray(value)) {
            innerConfig.children = value;
        }
        // Single DomConfig
        else if (outputIsObject) {
            const
                { class : cls, className, ...rest } = value || {},
                clsPropName                         = cls ? 'class' : (className ? 'className' : null);

            Object.assign(innerConfig, rest);

            // Normalize usage of class / className in the value object, use className in object form for innerConfig
            if (clsPropName) {
                Object.assign(innerConfig.className, typeof value[clsPropName] === 'string'
                    ? new DomClassList(value[clsPropName])
                    : value[clsPropName]);
            }
        }
        // Text content (encoded or no HTML)
        else if (renderingColumn?.shouldHtmlEncode || !value.includes('<')) {
            treeStructure.className['b-text-value'] = 1;
            innerConfig.text                        = value;
        }
        // HTML content
        else {
            innerConfig.html = value;
        }
    }

    /**
     * A column renderer that is automatically added to the column with { tree: true }. It adds padding and node icons
     * to the cell to make the grid appear to be a tree. The original renderer is called in the process.
     * @private
     */
    treeRenderer(renderData) {
        const
            me           = this,
            {
                grid,
                cellElement,
                row,
                record,
                isExport
            }            = renderData,
            { features } = grid;

        if (!features.tree) {
            throw new Error('TreeColumnMixin requires the Tree feature to be enabled');
        }

        const
            gridMeta    = record.instanceMeta(grid.store),
            isCollapsed = !record.isLeaf && gridMeta.collapsed,
            childLevel  = record.childLevel;

        // Process renderer value
        const { value, outputIsObject, renderingColumn } = me.processRendererValue(renderData);

        // Early return for exports
        if (isExport) {
            return value;
        }

        // Build tree structure
        const
            innerConfig   = {
                className : { 'b-tree-cell-value' : 1 }
            },
            children      = [innerConfig],
            treeStructure = {
                className : {
                    'b-tree-cell-inner'      : 1,
                    'b-tree-parent-has-icon' : record.parent?.meta.hasIcon
                },
                tag    : record.href ? 'a' : 'div',
                href   : record.href,
                target : record.target,
                style  : {
                    '--b-tree-level' : childLevel
                },
                children
            };

        // Add leaf node icon
        if (record.isLeaf) {
            cellElement.classList.add('b-tree-leaf-cell');

            const iconCls = me.getTreeIconCls(record, renderData, isCollapsed);
            if (iconCls) {
                children.splice(children.length - 1, 0, {
                    tag           : 'i',
                    'aria-hidden' : 'true',
                    className     : {
                        'b-tree-icon' : 1,
                        [iconCls]     : 1
                    }
                });
            }
        }
        else {
            const
                isExpanded      = !isCollapsed,
                expanderIconCls = isExpanded ? me.collapseIconCls : me.expandIconCls;

            cellElement.classList.add('b-tree-parent-cell');
            cellElement.setAttribute('aria-expanded', isExpanded);
            row.toggleCls('b-loading-children', Boolean(gridMeta.isLoadingChildren));

            children.unshift({
                tag       : 'i',
                className : {
                    'b-tree-expander' : 1,
                    [expanderIconCls] : 1,
                    'b-empty-parent'  : !gridMeta.isLoadingChildren && (record.children !== true && !record.children?.length)
                }
            });

            // Get and store icon class
            const iconCls = !me.skipTreeIcon && me.getTreeIconCls(record, renderData, isCollapsed);
            if (iconCls) {
                record.meta.hasIcon = iconCls;
                children.splice(children.length - 1, 0, {
                    tag           : 'i',
                    'aria-hidden' : 'true',
                    className     : {
                        'b-tree-icon' : 1,
                        [iconCls]     : 1
                    }
                });
            }

            // Update row aria attributes
            if (row.isRow) {
                row.setAttribute('aria-expanded', isExpanded);
            }
        }

        // Build tree line blocks once
        const
            hasTreeLines   = features.tree.treeLines,
            treeLineBlocks = hasTreeLines ? me.buildTreeLineBlocks(childLevel) : [];

        // Set tree level on row
        row.eachElement(el => el.style.setProperty('--b-tree-level', childLevel));

        // Handle WidgetColumn special case
        if (me.isWidgetColumn && me.originalRenderer?.(renderData) === undefined && !isExport) {
            const handled = me.handleWidgetColumnRendering(renderData, childLevel, treeLineBlocks, treeStructure);
            if (handled) {
                return; // Return undefined to prevent Row from running DomSync again
            }
        }

        // Configure inner element content
        me.configureInnerElement(innerConfig, treeStructure, value, outputIsObject, renderingColumn);

        return [...treeLineBlocks, treeStructure];
    }

    //endregion

    //region Indent Size

    updateIndentSize() {
        this.grid.element.style.setProperty('--b-tree-indent-size', `${this.indentSize}em`);
    }

    set indentSize(indentSize) {
        this.set('indentSize', indentSize);
        this.updateIndentSize();
    }

    get indentSize() {
        return this.get('indentSize');
    }

    //endregion

    //region Config Handling

    // This function is not meant to be called by any code other than Base#getCurrentConfig().
    // It extracts the current configs (fields) for the column, with special handling for the renderer
    getCurrentConfig(options) {
        const result = super.getCurrentConfig(options);

        // Use app renderer
        result.renderer = this.originalRenderer;

        return result;
    }

    //endregion

    //region Utility

    isTreeExpanderIcon(element) {
        return element.matches(('.' + this.expandIconCls.trim().replace(/\s/g, '.')) + ',.' + this.collapseIconCls.trim().replace(/\s/g, '.'));
    }

    //endregion
};
