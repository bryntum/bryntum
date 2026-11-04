import TaskBoardFeature from './TaskBoardFeature.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import ContextMenuBase from '../../Core/feature/base/ContextMenuBase.js';
import StringHelper from '../../Core/helper/StringHelper.js';

DomHelper.loadStylesheet('TaskBoard/feature/ColumnHeaderMenu.css');

// import Stylesheet from './ColumnHeaderMenu.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ColumnHeaderMenu');

/**
 * @module TaskBoard/feature/ColumnHeaderMenu
 */

/**
 * Adds a menu button (`···`) to column headers, clicking it displays a menu. Items are populated by other features
 * and/or application code.
 *
 * {@inlineexample TaskBoard/feature/ColumnHeaderMenu.js}
 *
 * ## Default items
 *
 * These are the default items provided by TaskBoard features:
 *
 * | Reference         | Weight | Feature                              | Description                   |
 * |-------------------|--------|--------------------------------------|-------------------------------|
 * | `addTask `        | 100    | *This feature*                       | Add a new task to this column |
 * | `moveColumnLeft`  | 200    | {@link TaskBoard.feature.ColumnDrag} | Move column one step left     |
 * | `moveColumnRight` | 300    | {@link TaskBoard.feature.ColumnDrag} | Move column one step right    |
 * | `lock`            | 400    | {@link TaskBoard.feature.ColumnLock} | Lock columns on right side    |
 * | `unlock`          | 400    | {@link TaskBoard.feature.ColumnLock} | Unlock locked columns         |
 *
 * Default items in the menu can be changed or removed and new items can be added. This is handled using the
 * {@link #config-items} config of the feature.
 *
 * ## Add items
 *
 * Add menu items for all column headers by adding a key (used as menu item {@link Core/widget/Widget#config-ref}) with
 * a {@link Core/widget/MenuItem#configs config object for a menu item} as the value to the {@link #config-items} config:
 *
 * ```javascript
 * const taskBoard = new TaskBoard({
 *     features : {
 *         columnHeaderMenu : {
 *             items : {
 *                 flagTasks : {
 *                     text : 'Flag task',
 *                     icon : 'fa fa-fw fa-flag',
 *                     onItem({ columnRecord }) {
 *                         columnRecord.tasks.forEach(taskRecord => taskRecord.flagged = true);
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * {@inlineexample TaskBoard/feature/ColumnHeaderMenuAdd.js}
 *
 * ## Remove items
 *
 * To remove default items, configure them as `null` in the {@link #config-items} config:
 *
 * ```javascript
 * const taskBoard = new TaskBoard({
 *     features : {
 *         columnHeaderMenu : {
 *             items : {
 *                 moveColumnLeft  : null,
 *                 moveColumnRight : null
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * {@inlineexample TaskBoard/feature/ColumnHeaderMenuRemove.js}
 *
 * ## Customize items
 *
 * To customize default items, supply a new config object for them in the {@link #config-items} config. It will merge
 * with the default config object:
 *
 * ```javascript
 * const taskBoard = new TaskBoard({
 *     features : {
 *         columnHeaderMenu : {
 *             items : {
 *                 // Change the text of the "Add new task" item
 *                 addTask : {
 *                     text : 'New card'
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * {@inlineexample TaskBoard/feature/ColumnHeaderMenuCustomize.js}
 *
 * ## Manipulating items at runtime
 *
 * Manipulate items for all columns or specific columns at runtime by supplying a {@link #config-processItems} function:
 *
 * ```javascript
 * const taskBoard = new TaskBoard({
 *     features : {
 *         columnHeaderMenu : {
 *             // Process items before menu is shown
 *             processItems({ columnRecord, items }) {
 *                  // Push an extra item for the done column
 *                  if (columnRecord.id === 'done') {
 *                      items.archive = {
 *                          text : 'Archive',
 *                          icon : 'fa fa-fw fa-archive',
 *                          onItem({ columnRecord }) {
 *                              columnRecord.tasks.forEach(taskRecord => taskRecord.archived = true);
 *                          }
 *                      };
 *                  }
 *
 *                  // Do not show "Add new task" for the todo column
 *                  if (columnRecord.id === 'todo') {
 *                      items.addTask = null;
 *                  }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * {@note}The `processItems` implementation my be an `async` function which `awaits` a result to
 * mutate the `items` object.{/@note}
 *
 * {@inlineexample TaskBoard/feature/ColumnHeaderMenuProcessItems.js}
 *
 * This feature is **enabled** by default.
 *
 * ## Keyboard shortcuts
 * This feature has the following default keyboard shortcuts:
 *
 * | Keys                             | Action                 | Action description                                     |
 * |----------------------------------|------------------------|--------------------------------------------------------|
 * | <kbd>Space</kbd>                 | *showContextMenuByKey* | Shows context menu for currently focused column header |
 * | <kbd>Ctrl</kbd>+<kbd>Space</kbd> | *showContextMenuByKey* | Shows context menu for currently focused column header |
 *
 * {@note}Please note that <kbd>Ctrl</kbd> is the equivalent to <kbd>Command</kbd> and <kbd>Alt</kbd>
 * is the equivalent to <kbd>Option</kbd> for Mac users{/@note}
 *
 * For more information on how to customize keyboard shortcuts, please see
 * [our guide](#TaskBoard/guides/customization/keymap.md).
 *
 * @extends TaskBoard/feature/TaskBoardFeature
 * @uninherit Core/Base
 * @uninherit Core/localization/Localizable
 * @classtype columnHeaderMenu
 * @feature
 * @tier community
 */
export default class ColumnHeaderMenu extends ContextMenuBase {

    static $name = 'ColumnHeaderMenu';

    static tier = 'community';

    static type = 'columnHeaderMenu';

    static configurable = {
        /**
         * A function called before displaying the menu that allows manipulations of its items.
         * Returning `false` from this function prevents the menu from being shown.
         *
         * ```javascript
         * const taskBoard = new TaskBoard({
         *   features         : {
         *       columnHeaderMenu : {
         *           processItems({ columnRecord, items }) {
         *              // Push an extra item for the todo column
         *              if (columnRecord.id === 'todo') {
         *                  items.finishAll = {
         *                      text : 'Finish all',
         *                      icon : 'fa fa-fw fa-check'
         *                      onItem({ columnRecord }) {
         *                          columnRecord.tasks.forEach(taskRecord => taskRecord.status = 'done');
         *                      }
         *                  };
         *               }
         *           }
         *       }
         *   }
         * });
         * ```
         *
         * @config {Function}
         * @param {Object} context An object with information about the menu being shown
         * @param {TaskBoard.feature.ColumnHeaderMenu} context.feature A reference to this feature.
         * @param {Event} context.domEvent The initiating event.
         * @param {Event} context.event DEPRECATED: The initiating event.
         * @param {Number[]} context.point The client `X` and `Y` position of the initiating event.
         * @param {HTMLElement} context.targetElement The target to which the menu is being applied.
         * @param {TaskBoard.model.ColumnModel} context.columnRecord The column for which the menu will be shown
         * @param {Object<String,MenuItemEntry>} context.items An object containing the
         *   {@link Core.widget.MenuItem menu item} configs keyed by their id
         * @returns {Boolean|null} Returning `false` from this function prevents the menu being shown
         * @preventable
         */
        processItems : null,

        /**
         * This is a preconfigured set of items used to create the default context menu.
         *
         * The `items` provided by this feature are listed in the intro section of this class. You can configure
         * existing items by passing a configuration object to the keyed items.
         *
         * To remove existing items, set corresponding keys `null`:
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     features : {
         *         columnHeaderMenu : {
         *             items : {
         *                 addTask : null
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * See the class description for more examples.
         *
         * @config {Object<string,MenuItemEntry>} items
         */
        items : null,

        menu : {
            anchor : true
        },

        type : 'columnHeader',

        triggerEvent : false

        /**
         * See {@link #keyboard-shortcuts Keyboard shortcuts} for details
         * @config {Object<String,KeyMapConfig>>} keyMap
         */

        /**
         * @hideconfigs type, triggerEvent
         */
    };

    static get pluginConfig() {
        const config = super.pluginConfig;

        config.after.push(...['populateColumnHeaderMenu', 'populateColumnHeader', 'onColumnHeaderClick']);

        return config;
    }

    //region Events

    /**
     * This event fires on the owning TaskBoard before the menu is shown for a column header.
     * Allows manipulation of the items to show in the same way as in the {@link #config-processItems}.
     *
     * Returning `false` from a listener prevents the menu from being shown.
     *
     * @event columnHeaderMenuBeforeShow
     * @on-owner
     * @preventable
     * @param {TaskBoard.view.TaskBoard} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object<string,MenuItemEntry>} items Menu item configs
     * @param {TaskBoard.model.ColumnModel} columnRecord The column
     * @on-owner
     */

    /**
     * This event fires on the owning TaskBoard after the context menu is shown for a column header.
     * @event cellMenuShow
     * @on-owner
     * @param {TaskBoard.view.TaskBoard} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object<string,MenuItemEntry>} items Menu item configs
     * @param {TaskBoard.model.ColumnModel} columnRecord The column
     * @on-owner
     */

    /**
     * This event fires on the owning TaskBoard when an item is selected in the column header menu.
     * @event cellMenuItem
     * @on-owner
     * @param {TaskBoard.view.TaskBoard} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Core.widget.MenuItem} item Selected menu item
     * @param {TaskBoard.model.ColumnModel} columnRecord The column
     * @on-owner
     */

    /**
     * This event fires on the owning TaskBoard when a check item is toggled in the column header menu.
     * @event cellMenuToggleItem
     * @on-owner
     * @param {TaskBoard.view.TaskBoard} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Core.widget.MenuItem} item Selected menu item
     * @param {TaskBoard.model.ColumnModel} columnRecord The column
     * @param {Boolean} checked Checked or not
     * @on-owner
     */

    //endregion

    //region Type assertions

    changeItems(items) {
        ObjectHelper.assertObject(items, 'features.columnHeaderMenu.items');

        return items;
    }

    changeProcessItems(fn) {
        ObjectHelper.assertFunction(fn, 'features.columnHeaderMenu.processItems');

        return fn;
    }

    //endregion

    // Space opens the menu for a focused column header, the buttons in the header activate natively on Space instead
    isActionAvailable({ actionName, event }) {
        if (actionName !== 'showContextMenuByKey') {
            return true;
        }

        return !event.target.closest('button') && Boolean(event.target.closest('.b-task-board-column-header'));
    }

    // Inject a "button" into column headers
    populateColumnHeader({ columnHeaderConfig }) {
        if (!this.disabled) {
            columnHeaderConfig.children.padder.children.menu = {
                tag          : 'button',
                tabIndex     : -1,
                'aria-label' : StringHelper.xss`${this.L('L{TaskBoard.showColumnMenu}')}`,
                class        : {
                    'b-button'                               : 1,
                    'b-button-text'                          : 1,
                    'b-column-header-button'                 : 1,
                    'b-task-board-column-header-menu-button' : 1,
                    'b-fw-icon'                              : 1,
                    'b-icon-menu-horizontal'                 : 1
                }
            };
        }
    }

    // Populate menu events with taskboard specifics
    getDataFromEvent(event) {
        return ObjectHelper.assign(super.getDataFromEvent(event), event.taskBoardData);
    }

    // Add default menu items
    populateColumnHeaderMenu({ items, columnRecord }) {
        const { client } = this;

        if (!client.readOnly) {
            items.addTask = {
                text   : 'L{TaskBoard.addTask}',
                icon   : 'b-fw-icon b-icon-add',
                weight : 100,
                onItem() {
                    client.addTask(columnRecord);
                }
            };
        }
    }

    // Detect "button" click
    onColumnHeaderClick(args) {
        const { event } = args;

        if (event.target.matches('.b-task-board-column-header-menu-button')) {
            this.showContextMenu(event, { target : event.target, align : 't90-b90' });
        }
    }

    doDisable(disable) {
        super.doDisable(disable);

        !this.isConfiguring && this.client.recompose();
    }

    get showMenu() {
        return true;
    }
}

// Register this feature type with its Factory
TaskBoardFeature.register(ColumnHeaderMenu.type, ColumnHeaderMenu);
