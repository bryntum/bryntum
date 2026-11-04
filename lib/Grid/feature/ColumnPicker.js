import GridFeature from './GridFeature.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';

/**
 * @module Grid/feature/ColumnPicker
 */

/**
 * Displays a column picker (to show/hide columns) in the header context menu. Columns can be displayed in sub menus
 * by region or tag. Grouped headers are displayed as menu hierarchies.
 *
 * {@inlineexample Grid/feature/ColumnPicker.js}
 *
 * This feature is <strong>enabled</strong> by default.
 *
 * ## See also
 *
 * - {@link Grid.feature.HeaderMenu} - Header context menu
 * - {@link Grid.column.Column#config-hidden} - Per-column visibility config
 *
 * @demo Grid/columns
 * @extends Grid/feature/GridFeature
 * @classtype columnPicker
 * @feature
 * @tier community
 */
export default class ColumnPicker extends GridFeature {
    //region Config

    static $name = 'ColumnPicker';

    static tier = 'community';

    static type = 'columnPicker';

    static defaultEnabled = true;
    static configurable = {
        /**
         * Groups columns in the picker by region (each region gets its own sub menu)
         * @config {Boolean}
         * @default
         */
        groupByRegion : false,

        /**
         * Groups columns in the picker by tag, each column may be shown under multiple tags. See
         * {@link Grid.column.Column#config-tags}
         * @config {Boolean}
         * @default
         */
        groupByTag : false,

        /**
         * Configure this as `true` to have the fields from the Grid's {@link Core.data.Store}'s
         * {@link Core.data.Store#config-modelClass} added to the menu to create __new__ columns
         * to display the fields.
         *
         * This may be combined with the {@link Grid.view.mixin.GridState stateful} ability of the grid
         * to create a self-configuring grid.
         * @config {Boolean}
         * @default
         */
        createColumnsFromModel : false,

        /**
         * Configure as `true` to add an "All columns" item to the top of the column picker menu, followed by a
         * separator that visually divides it from the per-column list below.
         *
         * The item is a check item that carries the same checkbox icon the individual column items use. Its label is
         * always `All columns`, and its checkbox reflects the aggregate visibility of all
         * {@link Grid.column.Column#config-hideable} top-level columns:
         *
         * - Checked only when every hideable top-level column is visible. Clicking then hides them all.
         * - Unchecked when they are all hidden (only forced region-keepers remain visible) or when their visibility is
         *   mixed. Clicking then shows them all.
         *
         * The checkbox refreshes in place while the picker stays open, both when this item is actioned and when
         * individual column items are toggled.
         *
         * Columns with `hideable : false` are never affected. To avoid leaving a region with no visible columns, the
         * first top-level column (in document order) of any region that would be emptied is kept visible, so there is
         * always a way back to showing all columns. For a grouped (parent) column that is kept visible, its
         * already-visible children are preserved, so the group is never left with an empty header.
         *
         * @prp {Boolean}
         * @default
         */
        showToggleAllItem : false,

        menuCls : 'b-column-picker-menu b-sub-menu'
    };

    static get pluginConfig() {
        return {
            after : ['populateHeaderMenu', 'getColumnDragToolbarItems']
        };
    }

    get grid() {
        return this.client;
    }

    //endregion

    //region Context menu

    /**
     * Get menu items, either a straight list of columns or sub menus per subgrid
     * @private
     * @param {Grid.data.ColumnStore} columnStore Column store to traverse
     * @returns {MenuItemEntry[]} Menu item configs
     */
    getColumnPickerItems(columnStore) {
        const
            me                        = this,
            { createColumnsFromModel } = me;

        let result;

        if (me.groupByRegion) {
            // submenus for grids regions
            result = me.grid.regions.map(region => {
                const columns = me.grid.getSubGrid(region).columns.topColumns;

                return {
                    text     : StringHelper.capitalize(region),
                    menu     : me.buildColumnMenu(columns),
                    disabled : columns.length === 0,
                    region
                };
            });
            if (createColumnsFromModel) {
                result.push({
                    text : me.L('L{newColumns}'),
                    menu : me.createAutoColumnItems()
                });
            }
        }
        else if (me.groupByTag) {
            // submenus for column tags
            const tags = {};
            columnStore.topColumns.forEach(column => {
                column.tags && Array.isArray(column.tags) && column.hideable !== false && column.tags.forEach(tag => {
                    if (!tags[tag]) {
                        tags[tag] = 1;
                    }
                });
            });

            // <remove-on-release>
            // TODO: as checkitems, but how to handle toggling? hide a column only when all tags for it are unchecked?
            // </remove-on-release>
            result = Object.keys(tags)
                .sort((a, b) => a.localeCompare(b))
                .map(tag => ({
                    text            : StringHelper.capitalize(tag),
                    menu            : me.buildColumnMenu(me.getColumnsForTag(tag)),
                    tag,
                    onBeforeSubMenu : ({ item, itemEl }) => {
                        me.refreshTagMenu(item, itemEl);
                    }
                }));
            if (createColumnsFromModel) {
                result.push({
                    text : me.L('L{newColumns}'),
                    menu : me.createAutoColumnItems()
                });
            }
        }
        else {
            // all columns in same menu
            result = me.buildColumnMenu(columnStore.topColumns);

            if (createColumnsFromModel) {
                result.items.push(...ObjectHelper.transformNamedObjectToArray(me.createAutoColumnItems()));
            }
        }

        // Prepend the stateful "toggle all" item (if enabled). Result is an array for the grouped layouts and an
        // { items } menu config for the single-menu layout.
        const
            toggleAllItem = me.buildToggleAllItem(),
            items         = Array.isArray(result) ? result : result.items;

        if (toggleAllItem) {
            items.unshift(toggleAllItem);

            // Render a separator directly below the toggle-all item, visually dividing it from the per-column list.
            if (items[1]) {
                items[1].separator = true;
            }
        }

        return result;
    }

    /**
     * Builds the "All columns" menu item when {@link #config-showToggleAllItem} is enabled. Returns `null` when
     * disabled or when there are no hideable columns.
     *
     * The item is a check item carrying the same checkbox icon the individual column items use. Its label is always
     * `All columns`; its `checked` state reflects the aggregate visibility and refreshes in place whenever column
     * visibility changes while the picker stays open, reusing the same in-place menu-item updates the picker already
     * performs on visibility changes (see {@link #function-syncToggleAllItem}, called both when this item is actioned
     * and from {@link #function-onColumnToggle}).
     * @private
     * @returns {MenuItemEntry|null} The toggle-all menu item config, or `null`.
     */
    buildToggleAllItem() {
        const
            me              = this,
            { columns }     = me.grid,
            // Operate on top-level columns so parent/child visibility stays coherent in grouped layouts.
            hideableTopCols = columns.topColumns.filter(column => column.hideable !== false);

        if (!me.showToggleAllItem || hideableTopCols.length === 0) {
            return null;
        }

        return {
            ref         : 'toggleAllColumns',
            // Stable label, never flips. The checkbox icon (no explicit icon) communicates the aggregate state.
            text        : me.L('L{ColumnPicker.allColumns}'),
            checked     : me.getToggleAllState().checked,
            cls         : 'b-toggle-all-columns',
            // Keep the picker open after toggling, so the item can refresh its checkbox
            closeParent : false,
            onItem      : ({ item }) => {
                me.setAllColumnsVisibility(!me.getToggleAllState().hide);
                // refresh the toggle-all item and every check item without a close/reopen.
                me.syncToggleAllItem(item);
                me.syncColumnItems(item.parent);
            }
        };
    }

    /**
     * Computes the state of the toggle-all item from the live column visibility, returning the `hide` flag (whether
     * clicking should hide or show) together with the `checked` flag (the aggregate checkbox state). Used by both
     * {@link #function-buildToggleAllItem} and {@link #function-syncToggleAllItem}, so the checkbox and the performed
     * action can never drift apart.
     * @private
     * @returns {{ hide : Boolean, checked : Boolean }} The determined toggle-all state.
     */
    getToggleAllState() {
        const
            { columns }     = this.grid,
            hideableTopCols = columns.topColumns.filter(column => column.hideable !== false),
            // Forced region-keepers (last visible columns) stay visible even after a hide-all, so ignore them
            keepers         = this.getToggleAllKeepers(hideableTopCols),
            // Only hide when there is a hideable top-level column visible that is NOT a forced keeper
            hide            = hideableTopCols.some(column => column.visible && !keepers.has(column)),
            // Checkbox is checked only when EVERY hideable top-level column is visible; unchecked when all are hidden
            // or when visibility is mixed.
            checked         = hideableTopCols.every(column => column.visible);

        return { hide, checked };
    }

    /**
     * Resolves the live toggle-all menu item from an open picker menu. Returns `undefined` when
     * {@link #config-showToggleAllItem} is disabled or the picker is not open.
     * @private
     * @param {Core.widget.Menu} menu A menu within the open picker hierarchy.
     * @returns {Core.widget.MenuItem|undefined} The live toggle-all menu item, or `undefined`.
     */
    getToggleAllItem(menu) {
        for (let current = menu; current; current = current.parentMenu) {
            const item = current.widgetMap?.toggleAllColumns;

            if (item) {
                return item;
            }
        }
    }

    /**
     * Refreshes the live toggle-all menu item's `checked` state in place. The label is constant, so only the checkbox
     * needs to be kept in sync with the aggregate column visibility.
     *
     * @private
     * @param {Core.widget.MenuItem} [item] The live toggle-all menu item. Resolved from the open menu when omitted.
     */
    syncToggleAllItem(item) {
        if (item && !item.isDestroying) {
            item.checked = this.getToggleAllState().checked;
        }
    }

    /**
     * Syncs every check item under `menu` to its column's current visibility after a toggle-all, so the checkboxes and
     * their enabled state match actual visibility without a close/reopen. Recurses into instantiated submenus (grouped
     * layouts); not-yet-instantiated submenus build their items when first shown.
     *
     * Each item's `disabled` state follows the same last-man-standing rule as {@link #function-onColumnToggle}: an item
     * is disabled when its column is the last visible hideable column, so the user can never empty a region.
     *
     * Setting `checked`/`disabled` is reentrancy-safe, so no toggle loop occurs.
     * @private
     * @param {Core.widget.Menu} menu The top-level picker menu.
     */
    syncColumnItems(menu) {
        const { visibleColumns } = this.grid.columns;

        menu?.eachWidget(widget => {
            const { column } = widget;

            if (column) {
                // Last-man-standing: when a column is the last visible in its region, it must not be hideable
                const visibleInRegion = visibleColumns.filter(col =>
                    col.region === column.region &&
                    col.showColumnPicker !== false
                );

                widget.checked  = !column.hidden;
                widget.disabled = !column.hidden && visibleInRegion.length === 1;
            }
        }, true);
    }

    /**
     * Computes the set of hideable top-level columns that must stay visible after a hide-all so no region is left
     * empty. A region with a `hideable : false` top-level column survives on its own; otherwise the region's first
     * visible top-level column (by document order / `parentIndex`) is kept.
     * @private
     * @param {Grid.column.Column[]} hideableTopCols The hideable top-level columns.
     * @returns {Set} The forced region-keeper columns ({@link Grid.column.Column}) that must stay visible.
     */
    getToggleAllKeepers(hideableTopCols) {
        const
            { topColumns } = this.grid.columns,
            keepVisible    = new Set(),
            regions        = new Set(hideableTopCols.map(column => column.region));

        regions.forEach(region => {
            const regionColumns = topColumns.filter(column => column.region === region);

            // Region survives on its own if it has a non-hideable column, otherwise keep its first visible column.
            if (!regionColumns.some(column => column.hideable === false)) {
                const first = regionColumns
                    .sort((a, b) => a.parentIndex - b.parentIndex)
                    .find(column => column.visible);

                if (first) {
                    keepVisible.add(first);
                }
            }
        });

        return keepVisible;
    }

    /**
     * Sets all {@link Grid.column.Column#config-hideable hideable} top-level columns to the passed visibility
     * state in one coalesced relayout. Visibility is set on top-level columns and cascades to its children. Columns
     * with `hideable : false` are left untouched; when none exists, the first top-level column (in document order)
     * of any region that would be emptied is kept visible.
     * @private
     * @param {Boolean} visible `true` to show all hideable columns, `false` to hide them.
     */
    setAllColumnsVisibility(visible) {
        const
            { columns }     = this.grid,
            // Set visibility on top-level columns; setting a parent's visibility cascades to its children, so
            // toggling at this level keeps grouped (parent/child) columns coherent.
            { topColumns }  = columns,
            hideableTopCols = topColumns.filter(column => column.hideable !== false),
            // When hiding, never empty a region: keep the forced region-keepers visible.
            keepVisible     = visible ? null : this.getToggleAllKeepers(hideableTopCols);

        columns.batchColumnChanges(() => {
            hideableTopCols.forEach(column => {
                // Leave a kept top-level column untouched so a kept parent retains its already-visible children.
                if (visible || !keepVisible.has(column)) {
                    column.visible = visible;
                }
            });
        });
    }

    createAutoColumnItems() {
        const
            me             = this,
            { grid }       = me,
            {
                columns,
                store
            }              = grid,
            { modelClass } = store,
            { allFields }  = modelClass,
            result         = {};

        for (let i = 0, { length } = allFields; i < length; i++) {
            const
                field     = allFields[i],
                fieldName = field.name;

            if (!columns.get(fieldName)) {
                // Don't include system-level "internal" fields from the base Model classes like rowHeight or cls.
                if (!field.internal) {
                    result[fieldName] = {
                        text     : field.text || StringHelper.separate(field.name),
                        checked  : false,
                        onToggle : (event) => {
                            const column = columns.get(fieldName);

                            if (column) {
                                column[event.checked ? 'show' : 'hide']();
                            }
                            else {
                                grid._suspendRenderContentsOnColumnsChanged = true;
                                columns.add(columns.generateColumnForField(field, {
                                    region : me.forColumn.region
                                }), true);
                                grid._suspendRenderContentsOnColumnsChanged = false;
                                grid.renderContents();
                            }
                            event.bubbles = false;
                        }
                    };
                }
            }
        }

        return result;
    }

    /**
     * Get all columns that has the specified tag.
     * @param {String} tag Tag to filter columns by
     * @returns {Grid.column.Column[]} Array of columns matching the ta
     * @private
     */
    getColumnsForTag(tag) {
        // <remove-on-release>
        // TODO: if tags are useful from somewhere else, move to ColumnStore
        // </remove-on-release>
        return this.grid.columns.records.filter(column =>
            column.tags && Array.isArray(column.tags) && column.tags.includes(tag) && column.hideable !== false
        );
    }

    /**
     * Refreshes the state of the items in a tag menu. Needed since columns can appear under multiple tags, and toggling
     * a column in one tag menu only updates that menu.
     * @private
     */
    refreshTagMenu(item) {
        const columns = this.getColumnsForTag(item.tag);
        columns.forEach(column => {
            const subItem = item.menu.items.find(subItem => subItem.column === column);
            if (subItem) {
                Object.assign(subItem, this.getColumnItemState(column));
            }
        });
    }

    /**
     * Returns the visibility derived state of a column picker item for the passed column.
     * @param {Grid.column.Column} column
     * @returns {Object} `checked`, `disabled` and `ariaLabel` for the item
     * @private
     */
    getColumnItemState(column) {
        const
            visibleInRegion = this.grid.columns.visibleColumns.filter(col => col.region === column.region),
            checked         = column.hidden !== true;

        return {
            checked,
            // Do not allow hiding the last visible column in a region
            disabled  : checked && visibleInRegion.length === 1,
            ariaLabel : this.L(checked ? 'L{ColumnPicker.hideName}' : 'L{ColumnPicker.showName}', column)
        };
    }

    /**
     * Traverses columns to build menu items for the column picker.
     * @private
     */
    buildColumnMenu(columns) {
        let currentRegion = columns.length > 0 && columns[0].region;

        const
            { grid } = this,
            items    = columns.reduce((items, column) => {

                if (column.hideable !== false) {
                    const itemConfig = {
                        grid,
                        column,
                        text      : column.htmlEncodeHeaderText ? column.text : DomHelper.stripTags(column.text),
                        separator : column.region !== currentRegion,
                        ...this.getColumnItemState(column)
                    };

                    currentRegion = column.region;

                    if (column.children) {
                        itemConfig.menu = this.buildColumnMenu(column.children);
                    }

                    items.push(itemConfig);
                }
                return items;
            }, []);

        return {
            cls : this.menuCls,
            items
        };
    }

    /**
     * Populates the header context menu items.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown
     * @param {Object<String,MenuItemEntry>} options.items A named object to describe menu items
     * @internal
     */
    populateHeaderMenu({ column, items }) {
        const
            me          = this,
            { columns } = me.grid;

        /**
         * The column on which the context menu was invoked.
         * @property {Grid.column.Column} forColumn
         * @readonly
         * @private
         */
        me.forColumn = column;

        if (column.showColumnPicker !== false && columns.some(col => col.hideable)) {
            // column picker
            items.columnPicker = {
                text        : 'L{columnsMenu}',
                localeClass : me,
                icon        : 'b-fw-icon b-icon-columns',
                separator   : true,
                weight      : 200,
                menu        : me.getColumnPickerItems(columns),
                onToggle    : me.onColumnToggle,
                disabled    : me.disabled
            };
        }

        // menu item for hiding this column
        if (column.hideable !== false) {
            items.hideColumn = {
                text        : 'L{hideColumn}',
                localeClass : me,
                icon        : 'b-fw-icon b-icon-hide-column',
                weight      : 210,
                disabled    : !column.allowDrag || me.disabled,
                onItem      : () => column.hide()
            };
        }
    }

    /**
     * Handler for column hide/show menu checkitems.
     * @private
     * @param {Object} event The {@link Core.widget.MenuItem#event-toggle} event.
     */
    async onColumnToggle({ menu, item, checked }) {
        // The toggle-all item is a check item in the same menu, so its toggle bubbles here too. It carries no column
        // to act on and manages its own state, so ignore it.
        if (!item.column) {
            return;
        }

        if (Boolean(item.column.hidden) !== !checked) {
            await item.column[checked ? 'show' : 'hide']();
            item.ariaLabel = this.L(`L{HeaderMenu.${checked ? 'hide' : 'show'}Name}`, item.column);

            const
                { grid, column }      = item,
                { columns, features } = grid,
                // Sibling items, needed to disable other item if it is the last one in region
                siblingItems          = menu.items,
                // Columns left visible in same region as this items column
                otherHideableCols     = columns.visibleColumns.filter(col => col.region === item.column.region && col.showColumnPicker !== false),
                // Needed to access "hide-column" item outside of column picker
                hideItem              = features.headerMenu?.enabled && features.headerMenu.menu.widgetMap.hideColumn;

            // Do not allow user to hide the last column in any region
            if (otherHideableCols.length === 1) {
                const lastVisibleItem = siblingItems.find(menuItem => menuItem.column === otherHideableCols[0]);
                if (lastVisibleItem) {
                    lastVisibleItem.disabled = true;
                }

                // Also disable "Hide column" item if only one column left in this region
                if (hideItem && column.region === item.column.region) {
                    hideItem.disabled = true;
                }
            }
            // Multiple columns visible, enable "hide-column" and all items for that region
            else {
                otherHideableCols.forEach(col => {
                    const siblingItem = siblingItems.find(sibling => sibling.column === col);
                    if (siblingItem) {
                        siblingItem.disabled = false;
                    }
                });

                if (hideItem && column.region === item.column.region) {
                    hideItem.disabled = false;
                }
            }

            // Reflect status in submenu.
            item.menu?.eachWidget(subItem => {
                subItem.checked = checked;
            });

            // Keep the toggle-all item's checkbox in sync with this per-column visibility change. `this` is the
            // MenuItem the handler is configured on, not the feature, so resolve it from the grid as above.
            const { columnPicker } = features;

            columnPicker.syncToggleAllItem(columnPicker.getToggleAllItem(menu));

            // Walk up the menu chain to update all ancestor menu items' checked state
            let
                currentMenu   = menu,
                currentColumn = column,
                parentItem    = currentMenu.owner;

            while (parentItem?.column === currentColumn.parent) {
                parentItem.checked = currentMenu.items.some(subItem => subItem.checked === true);
                currentColumn = currentColumn.parent;
                currentMenu = currentMenu.parentMenu;
                parentItem = currentMenu?.owner;
            }
        }
    }

    /**
     * Supply items to ColumnDragToolbar
     * @private
     */
    getColumnDragToolbarItems(column, items) {
        const visibleInRegion = this.grid.columns.visibleColumns.filter(col => col.region === column.region);

        if (column.hideable !== false && visibleInRegion.length > 1) {
            items.push({
                text        : 'L{hideColumnShort}',
                ref         : 'hideColumn',
                group       : 'L{column}',
                localeClass : this,
                icon        : 'b-fw-icon b-icon-hide-column',
                weight      : 101,
                onDrop      : ({ column }) => column.hide()
            });
        }
        return items;
    }

    //endregion
}

ColumnPicker.initClass();
