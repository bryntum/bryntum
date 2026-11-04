import ContextMenuBase from '../../Core/feature/base/ContextMenuBase.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import GridFeature from './GridFeature.js';

/**
 * @module Grid/feature/CellMenu
 */

/**
 * Right click to display context menu for cells. To invoke the cell menu in a keyboard-accessible manner, use the
 * <kbd>Space</kbd> key when the cell is focused.
 *
 * {@inlineexample Grid/feature/CellMenu.js}
 *
 * ## Default cell menu items
 *
 * The Cell menu feature provides only one item by default:
 *
 * | Reference   | Text   | Weight | Description       |
 * |-------------|--------|--------|-------------------|
 * | `removeRow` | Delete | 100    | Delete row record |
 *
 * And all the other items are populated by the other features:
 *
 * | Reference              | Text             | Weight | Feature                           | Description                                                                                  |
 * |------------------------|------------------|--------|-----------------------------------|----------------------------------------------------------------------------------------------|
 * | `cut`                  | Cut record       | 110    | {@link Grid/feature/RowCopyPaste} | Cut row record                                                                               |
 * | `copy`                 | Copy record      | 120    | {@link Grid/feature/RowCopyPaste} | Copy row record                                                                              |
 * | `paste`                | Paste record     | 130    | {@link Grid/feature/RowCopyPaste} | Paste copied row records                                                                     |
 * | `search`               | Search for value | 200    | {@link Grid/feature/Search}       | Search for the selected cell text                                                            |
 * | `pinColumn`            | Pin column       | 250    | {@link Grid/feature/PinColumns}   | Shows a submenu to pin/unpin the column                                                      |
 * | `filterMenu`           | Filter           | 400    | {@link Grid/feature/Filter}       | Shows a submenu to control filtering. See [Filter submenu](#Grid/feature/Filter#menu-items). |
 * | `splitGrid`            | Split            | 500    | {@link Grid/feature/Split}        | Shows the "Split grid" sub menu                                                              |
 * | \> `splitHorizontally` | Horizontally     | 100    | {@link Grid/feature/Split}        | Split horizontally                                                                           |
 * | \> `splitVertically `  | Vertically       | 200    | {@link Grid/feature/Split}        | Split vertically                                                                             |
 * | \> `splitBoth`         | Both             | 300    | {@link Grid/feature/Split}        | Split both ways                                                                              |
 * | `unsplitGrid`          | Split            | 400    | {@link Grid/feature/Split}        | Unsplit a previously split grid                                                              |
 *
 * <dl class="foot-note">
 *     <dt>></dt><dd>first level of submenu</dd>
 * </dl>
 *
 * ## Customizing the menu items
 *
 * The menu items in the Cell menu can be customized, existing items can be changed or removed,
 * and new items can be added. This is handled using the `items` config of the feature.
 *
 * Add extra items for all columns:
 *
 * ```javascript
 * const grid = new Grid({
 *     features : {
 *         cellMenu : {
 *             items : {
 *                 extraItem : {
 *                     text   : 'My cell item',
 *                     icon   : 'fa fa-bus',
 *                     weight : 200,
 *                     onItem : () => ...
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * It is also possible to add items using columns config. See examples below.
 *
 * Add extra items for a single column:
 *
 * ```javascript
 * const grid = new Grid({
 *     columns: [
 *         {
 *             field         : 'city',
 *             text          : 'City',
 *             cellMenuItems : {
 *                 columnItem : {
 *                     text   : 'My unique cell item',
 *                     icon   : 'fa fa-beer',
 *                     onItem : () => ...
 *                 }
 *             }
 *         }
 *     ]
 * });
 * ```
 *
 * Remove existing item:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         cellMenu : {
 *             items : {
 *                 removeRow : false
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Customize existing item:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         cellMenu : {
 *             items : {
 *                 removeRow : {
 *                     text : 'Throw away',
 *                     icon : 'fa fa-dumpster'
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * It is also possible to manipulate the default items and add new items in the processing function:
 *
 * ```javascript
 * const grid = new Grid({
 *     features : {
 *         cellMenu : {
 *             processItems({items, record}) {
 *                 if (record.cost > 5000) {
 *                     items.myItem = { text : 'Split cost' };
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * {@note}The `processItems` implementation may be an `async` function which `awaits` a result to mutate the `items`
 * object.{/@note}
 *
 * Full information of the menu customization can be found in the
 * ["Customizing the Cell menu and the Header menu"](#Grid/guides/customization/contextmenu.md) guide.
 *
 * This feature is **enabled** by default.
 *
 * ## Keyboard shortcuts
 * This feature has the following default keyboard shortcuts:
 *
 * | Keys                             | Action                 | Action description                            |
 * |----------------------------------|------------------------|-----------------------------------------------|
 * | <kbd>Space</kbd>                 | *showContextMenuByKey* | Shows context menu for currently focused cell |
 * | <kbd>Ctrl</kbd>+<kbd>Space</kbd> | *showContextMenuByKey* | Shows context menu for currently focused cell |
 *
 * {@note}Please note that <kbd>Ctrl</kbd> is the equivalent to <kbd>Command</kbd> and <kbd>Alt</kbd>
 * is the equivalent to <kbd>Option</kbd> for Mac users{/@note}
 *
 * For more information on how to customize keyboard shortcuts, please see
 * [our guide](#Grid/guides/customization/keymap.md).
 *
 * ## See also
 *
 * - {@link Grid.feature.HeaderMenu} - Context menu for column headers
 * - {@link Grid.column.Column#config-cellMenuItems} - Per-column menu items
 *
 * @demo Grid/contextmenu
 * @extends Core/feature/base/ContextMenuBase
 * @classtype cellMenu
 * @feature
 * @tier community
 */
export default class CellMenu extends ContextMenuBase {
    //region Config

    static $name = 'CellMenu';

    static type = 'cellMenu';
    static defaultEnabled = true;
    static tier = 'community';

    static configurable = {
        /**
         * A function called before displaying the menu that allows manipulations of its items.
         * Returning `false` from this function prevents the menu being shown.
         *
         * ```javascript
         * features : {
         *     cellMenu : {
         *         processItems({ items, record, column }) {
         *             // Add or hide existing items here as needed
         *             items.myAction = {
         *                 text   : 'Cool action',
         *                 icon   : 'fa fa-fw fa-ban',
         *                 onItem : () => console.log(`Clicked ${record.name}`),
         *                 weight : 1000 // Move to end
         *             };
         *
         *             if (!record.allowDelete) {
         *                 items.removeRow.hidden = true;
         *             }
         *         }
         *     }
         * },
         * ```
         *
         * @config {Function}
         * @param {Object} context An object with information about the menu being shown.
         * @param {Grid.feature.CellMenu} context.feature A reference to this feature.
         * @param {Event} context.domEvent The initiating event.
         * @param {Event} context.event DEPRECATED: The initiating event.
         * @param {Number[]} context.point The client `X` and `Y` position of the initiating event.
         * @param {HTMLElement} context.targetElement The target to which the menu is being applied.
         * @param {Core.data.Model} context.record The record representing the current row.
         * @param {Grid.column.Column} context.column The current column.
         * @param {Object<String,MenuItemEntry>} context.items An object containing the
         *   {@link Core.widget.MenuItem menu item} configs keyed by their id
         * @returns {Boolean|null} Returning `false` from this function prevents the menu being shown
         * @preventable
         */
        processItems : null,

        /**
         * {@link Core.widget.Menu} items object containing named child menu items to apply to the feature's
         * provided context menu.
         *
         * This may add extra items as below, but you can also configure, or remove any of the default items by
         * configuring the name of the item as `null`:
         *
         * ```javascript
         * features : {
         *     cellMenu : {
         *         // This object is applied to the Feature's predefined default items
         *         items : {
         *             switchToDog : {
         *                 text : 'Dog',
         *                 icon : 'fa fa-fw fa-dog',
         *                 onItem({record}) {
         *                     record.dog = true;
         *                     record.cat = false;
         *                 },
         *                 weight : 500     // Make this second from end
         *             },
         *             switchToCat : {
         *                 text : 'Cat',
         *                 icon : 'fa fa-fw fa-cat',
         *                 onItem({record}) {
         *                     record.dog = false;
         *                     record.cat = true;
         *                 },
         *                 weight : 510     // Make this sink to end
         *             },
         *             removeRow : {
         *                 // Change icon for the delete item
         *                 icon : 'fa fa-times'
         *             },
         *             secretItem : null
         *         }
         *     }
         * },
         * ```
         *
         * @config {Object<String,MenuItemEntry>}
         */
        items : null,

        type : 'cell'

        /**
         * See {@link #keyboard-shortcuts Keyboard shortcuts} for details
         * @config {Object<String,KeyMapConfig>} keyMap
         */
    };

    static get pluginConfig() {
        const config = super.pluginConfig;

        config.after.push('populateCellMenu');

        return config;
    }

    //endregion

    //region Events

    /**
     * This event fires on the owning grid before the context menu is shown for a cell.
     * Allows manipulation of the items to show in the same way as in the {@link #config-processItems}.
     *
     * Returning `false` from a listener prevents the menu from being shown.
     *
     * @event cellMenuBeforeShow
     * @preventable
     * @on-owner
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object<String,MenuItemEntry>} items Menu item configs
     * @param {Grid.column.Column} column Column
     * @param {Core.data.Model} record Record
     */

    /**
     * This event fires on the owning grid after the context menu is shown for a cell.
     * @event cellMenuShow
     * @on-owner
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object<String,MenuItemEntry>} items Menu item configs
     * @param {Grid.column.Column} column Column
     * @param {Core.data.Model} record Record
     */

    /**
     * This event fires on the owning grid when an item is selected in the cell context menu.
     * @event cellMenuItem
     * @on-owner
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Core.widget.MenuItem} item Selected menu item
     * @param {Grid.column.Column} column Column
     * @param {Core.data.Model} record Record
     */

    /**
     * This event fires on the owning grid when a check item is toggled in the cell context menu.
     * @event cellMenuToggleItem
     * @on-owner
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Core.widget.MenuItem} item Selected menu item
     * @param {Grid.column.Column} column Column
     * @param {Core.data.Model} record Record
     * @param {Boolean} checked Checked or not
     */

    //endregion

    //region Menu handlers

    showContextMenu(eventParams) {
        const
            me = this,
            {
                cellSelector,
                event
            }  = eventParams;

        // Process the gesture as navigation so that the use may select/multiselect
        // the items to include in their context menu operation.
        // Also select if not already selected.
        me.client.focusCell(cellSelector, {
            doSelect : !me.client.selectedRecordCollection.includes(cellSelector.id),
            event
        });

        return super.showContextMenu(eventParams);
    }

    shouldShowMenu({ column }) {
        return column && column.enableCellContextMenu !== false;
    }

    getDataFromEvent(event) {
        const cellData = this.client.getCellDataFromEvent(event);

        // Only yield data to show a menu if we are on a cell
        if (cellData) {
            return ObjectHelper.assign(super.getDataFromEvent(event), cellData);
        }
    }

    beforeContextMenuShow({ record, items, column }) {
        if (column.cellMenuItems === false) {
            return false;
        }
        if (!record || record.isSpecialRow) {
            items.removeRow = false;
        }
    }

    //endregion

    //region Getters/Setters

    populateCellMenu({ items, column, record }) {
        const { client } = this;

        if (column?.cellMenuItems) {
            ObjectHelper.merge(items, column.cellMenuItems);
        }

        if (!client.readOnly) {
            items.removeRow = {
                text        : 'L{removeRow}',
                localeClass : this,
                icon        : 'b-fw-icon b-icon-trash',
                separator   : true,
                weight      : 100,
                disabled    : record.readOnly,
                onItem      : () => {
                    // When using tree grouping, remove original records from the original store
                    const store = client.features.treeGroup?.originalStore ?? client.store;

                    if (client.isCellSelected({ record, column }, true)) {
                        store.remove(client.selectedRecords.filter(r => !r.readOnly).map(r => r.$original));
                    }
                    else {
                        store.remove(record);
                    }
                }
            };
        }
    }

    get showMenu() {
        return true;
    }

    /**
     * Shows the context menu for the provided cell.
     * @param {GridLocationConfig|Grid.util.GridLocation} cell The cell descriptor to show the menu for.
     * @param {Object} [options]
     * @param {HTMLElement} [options.targetElement] Element to align context menu to.
     * If provided menu will be aligned to the center of the target element.
     * If omitted, the context menu will be centered relative to the cell element.
     */
    showMenuFor(cellSelector, { targetElement } = {}) {
        cellSelector = this.client.normalizeCellContext(cellSelector);

        DomHelper.triggerMouseEvent(targetElement || this.client.getCell(cellSelector), this.triggerEvent);
    }
    //endregion
}

CellMenu.featureClass = '';

// Inherits from ContextMenuBase, which lives in Core and is shared with the TaskBoard feature family,
// so it cannot extend a product feature base. With no Factoryable in the chain `static type` does
// not self-register, so hand the class to the factory instead. See GridFeature#function-register-static.
GridFeature.register(CellMenu.type, CellMenu);
