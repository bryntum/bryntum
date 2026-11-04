import TaskBoardFeature from './TaskBoardFeature.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import ContextMenuBase from '../../Core/feature/base/ContextMenuBase.js';
import AvatarRendering from '../../Core/widget/util/AvatarRendering.js';

DomHelper.loadStylesheet('TaskBoard/feature/TaskMenu.css');

// import Stylesheet from './TaskMenu.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TaskBoardTaskMenu');

/**
 * @module TaskBoard/feature/TaskMenu
 */

/**
 * Displays a context menu for tasks. Items are populated by other features and/or application code.
 *
 * {@inlineexample TaskBoard/feature/TaskMenu.js}
 *
 * You can optionally also use a {@link TaskBoard/view/item/TaskMenuItem} button to display the menu.
 *
 * ## Default items
 *
 * These are the default items provided by TaskBoard features:
 *
 * | Reference    | Weight | Feature                            | Description                                      |
 * |--------------|--------|------------------------------------|--------------------------------------------------|
 * | `editTask`   | 100    | {@link TaskBoard.feature.TaskEdit} | Open task editor. Hidden when read-only          |
 * | `resources`¹ | 200    | *This feature*                     | Assign/unassign resources. Hidden when read-only |
 * | `column`     | 300    | *This feature*                     | Move to column. Hidden when read-only            |
 * | `swimlane`¹  | 400    | *This feature*                     | Move to swimlane. Hidden when read-only          |
 * | `removeTask` | 500    | *This feature*                     | Remove task. Hidden when read-only               |
 *
 * ¹ Not available in the Community edition.
 *
 * Default items in the menu can be changed or removed and new items can be added. This is handled using the
 * {@link #config-items} config of the feature.
 *
 * ## Add items
 *
 * Add menu items for all tasks by adding a key (used as menu item {@link Core/widget/Widget#config-ref}) with a
 * {@link Core/widget/MenuItem#configs config object for a menu item} as the value to the {@link #config-items} config:
 *
 * ```javascript
 * const taskBoard = new TaskBoard({
 *     features : {
 *         taskMenu : {
 *             items : {
 *                 flagTask : {
 *                     text : 'Flag task',
 *                     icon : 'fa fa-fw fa-flag',
 *                     onItem({ taskRecord }) {
 *                         taskRecord.flagged = true;
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * {@inlineexample TaskBoard/feature/TaskMenuAdd.js}
 *
 * ## Remove items
 *
 * To remove default items, configure them as `null` in the {@link #config-items} config:
 *
 * ```javascript
 * const taskBoard = new TaskBoard({
 *     features : {
 *         taskMenu : {
 *             items : {
 *                 removeTask : null,
 *                 resources : null
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * {@inlineexample TaskBoard/feature/TaskMenuRemove.js}
 *
 * ## Customize items
 *
 * To customize default items, supply a new config object for them in the {@link #config-items} config. It will merge
 * with the default config object:
 *
 * ```javascript
 * const taskBoard = new TaskBoard({
 *     features : {
 *         taskMenu : {
 *             items : {
 *                 removeTask : {
 *                     text : 'Delete card'
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * {@inlineexample TaskBoard/feature/TaskMenuCustomize.js}
 *
 * ## Manipulating items at runtime
 *
 * Manipulate items for all tasks or specific tasks at runtime by supplying a {@link #config-processItems} function:
 *
 * ```javascript
 * const taskBoard = new TaskBoard({
 *     features : {
 *         taskMenu : {
 *             // Process items before menu is shown
 *             processItems({ taskRecord, items }) {
 *                  // Push an extra item for done tasks
 *                  if (taskRecord.status === 'done') {
 *                      items.archive = {
 *                          text : 'Archive',
 *                          icon : 'fa fa-fw fa-archive'
 *                          onItem({ taskRecord }) {
 *                              taskRecord.archived = true;
 *                          }
 *                      };
 *                  }
 *
 *                  // Do not show menu for low prio tasks
 *                  if (taskRecord.prio === 'low') {
 *                      return false;
 *                  }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * <div class="note">The `processItems` implementation my be an `async` function which `awaits` a result to
 * mutate the `items` object.</div>
 *
 * {@inlineexample TaskBoard/feature/TaskMenuProcessItems.js}
 *
 * This feature is **enabled** by default.
 *
 * ## Keyboard shortcuts
 * This feature has the following default keyboard shortcuts:
 *
 * | Keys                             | Action                 | Action description                            |
 * |----------------------------------|------------------------|-----------------------------------------------|
 * | <kbd>Space</kbd>                 | *showContextMenuByKey* | Shows context menu for currently focused task |
 * | <kbd>Ctrl</kbd>+<kbd>Space</kbd> | *showContextMenuByKey* | Shows context menu for currently focused task |
 *
 * <div class="note">Please note that <kbd>Ctrl</kbd> is the equivalent to <kbd>Command</kbd> and <kbd>Alt</kbd>
 * is the equivalent to <kbd>Option</kbd> for Mac users</div>
 *
 * For more information on how to customize keyboard shortcuts, please see
 * [our guide](#TaskBoard/guides/customization/keymap.md).
 *
 * @extends TaskBoard/feature/TaskBoardFeature
 * @uninherit Core/Base
 * @uninherit Core/localization/Localizable
 * @classtype taskMenu
 * @feature
 * @tier community
 */
export default class TaskMenu extends ContextMenuBase {

    static $name = 'TaskMenu';

    static tier = 'community';

    static type = 'taskMenu';

    static configurable = {
        /**
         * A function called before displaying the menu that allows manipulations of its items.
         * Returning `false` from this function prevents the menu from being shown.
         *
         * ```javascript
         * const taskBoard = new TaskBoard({
         *   features         : {
         *       taskMenu : {
         *           processItems({ taskRecord, items }) {
         *              // Add a custom menu item for tasks with progress greater than 90
         *              if (taskRecord.progress > 90) {
         *                  items.close = {
         *                      text : 'Close',
         *                      icon : 'fa fa-fw fa-check',
         *                      onItem({ taskRecord }) {
         *                          taskRecord.done = true;
         *                      }
         *                  }
         *              }
         *           }
         *       }
         *   }
         * });
         * ```
         *
         * @config {Function}
         * @param {Object} context An object with information about the menu being shown
         * @param {TaskBoard.feature.TaskMenu} context.feature A reference to this feature.
         * @param {Event} context.domEvent The initiating event.
         * @param {Event} context.event DEPRECATED: The initiating event.
         * @param {Number[]} context.point The client `X` and `Y` position of the initiating event.
         * @param {HTMLElement} context.targetElement The target to which the menu is being applied.
         * @param {TaskBoard.model.TaskModel} context.taskRecord The task for which the menu will be shown
         * @param {TaskBoard.model.ColumnModel} context.columnRecord The column where the task belongs to
         * @param {Object<string,MenuItemEntry>} context.items An object containing the
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
         * To remove existing items, set corresponding keys to `null`:
         *
         * ```javascript
         * const taskBoard = new TaskBoard({
         *     features : {
         *         taskMenu : {
         *             items : {
         *                 editTask : null
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * See the feature config in the above example for details.
         *
         * @config {Object<string,MenuItemEntry>} items
         */
        items : null,

        type : 'task',

        /**
         * The mouse / touch gesture which should show this context menu (e.g. 'taskClick' or 'taskContextMenu').
         * Set to `false` to never trigger it from UI.
         * @default
         * @config {String|Boolean}
         */
        triggerEvent : 'taskContextMenu',



        menu : {
            align : 't90-b90'
        }

        /**
         * See {@link #keyboard-shortcuts Keyboard shortcuts} for details
         * @config {Object<String,KeyMapConfig>} keyMap
         */

        /**
         * @hideconfigs type
         */
    };

    static get pluginConfig() {
        const config = super.pluginConfig;

        config.after.push('populateTaskMenu');

        return config;
    }

    // Space opens the menu for a focused card, the controls on a card activate natively on Space instead
    isActionAvailable({ actionName, event }) {
        if (actionName !== 'showContextMenuByKey') {
            return true;
        }

        return !event.target.closest('button') && Boolean(event.target.closest('.b-task-board-card'));
    }

    //region Type assertions

    changeItems(items) {
        ObjectHelper.assertObject(items, 'features.taskMenu.items');

        return items;
    }

    changeProcessItems(processItems) {
        ObjectHelper.assertFunction(processItems, 'features.taskMenu.processItems');

        return processItems;
    }

    //endregion

    //region Events

    /**
     * This event fires on the owning TaskBoard before the context menu is shown for a task.
     * Allows manipulation of the items to show in the same way as in the {@link #config-processItems}.
     *
     * Returning `false` from a listener prevents the menu from being shown.
     *
     * @event taskMenuBeforeShow
     * @on-owner
     * @preventable
     * @param {TaskBoard.view.TaskBoard} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object<string,MenuItemEntry>} items Menu item configs
     * @param {TaskBoard.model.TaskModel} taskRecord The task
     * @on-owner
     */

    /**
     * This event fires on the owning TaskBoard after the context menu is shown for a task.
     * @event taskMenuShow
     * @on-owner
     * @param {TaskBoard.view.TaskBoard} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object<string,MenuItemEntry>} items Menu item configs
     * @param {TaskBoard.model.TaskModel} taskRecord The task
     * @on-owner
     */

    /**
     * This event fires on the owning TaskBoard when an item is selected in the task context menu.
     * @event taskMenuItem
     * @on-owner
     * @param {TaskBoard.view.TaskBoard} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Core.widget.MenuItem} item Selected menu item
     * @param {TaskBoard.model.TaskModel} taskRecord The task
     * @on-owner
     */

    /**
     * This event fires on the owning TaskBoard when a check item is toggled in the task context menu.
     * @event taskMenuToggleItem
     * @on-owner
     * @param {TaskBoard.view.TaskBoard} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Core.widget.MenuItem} item Selected menu item
     * @param {TaskBoard.model.TaskModel} taskRecord The task
     * @param {Boolean} checked Checked or not
     * @on-owner
     */

    //endregion

    updateTriggerEvent(triggerEvent) {
        this.detachListeners('triggerEvent');
        if (triggerEvent) {
            this.client.ion({
                name           : 'triggerEvent',
                [triggerEvent] : 'onTriggerEvent',
                thisObj        : this
            });
        }
    }

    doDisable(disable) {
        super.doDisable(disable);

        !this.isConfiguring && this.client.recompose();
    }

    onTriggerEvent({ event }) {
        this.internalShowContextMenu(event);
    }

    /**
     * Show the context menu for a specific task, aligned to its card. Optionally aligned to an element in the card, using the supplied CSS selector.
     *
     * @param {TaskBoard.model.TaskModel} taskRecord Task to show the menu for
     * @param {String} [selector] CSS selector, to align to a specific element in the task's card
     */
    showMenuFor(taskRecord, selector = '.b-task-board-task-menu') {
        const
            targetElement = this.client.getTaskElement(taskRecord),
            buttonElement = targetElement.querySelector(selector),
            eventParams   = { taskRecord, columnRecord : this.client.getColumn(taskRecord), targetElement };

        let alignSpec = null;

        // <remove-on-release>
        // TODO: Call something on the button instead?
        // </remove-on-release>
        if (buttonElement) {
            eventParams.targetElement = buttonElement;
            alignSpec = {
                target : buttonElement
            };
        }

        this.showContextMenu(eventParams, alignSpec);
    }

    showContextMenu(eventParams, ...args) {
        if (!this.client.isSelected(eventParams.taskRecord)) {
            this.client.selectTask(eventParams.taskRecord);
        }

        if (!eventParams.targetElement) {
            eventParams.targetElement = eventParams.event?.target;
        }
        super.showContextMenu(eventParams, ...args);
    }

    getDataFromEvent(event) {
        return ObjectHelper.assign(super.getDataFromEvent(event), event.taskBoardData);
    }

    populateTaskMenu({ items, taskRecord }) {
        const { client, disabled } = this;

        if (!client.readOnly && !disabled) {
            const
                { columnField, swimlaneField, selectedTasks } = client,
                { resourceStore, eventStore }                 = client.project,
                { usesSingleAssignment }                      = eventStore,
                isSelected                                    = selectedTasks.includes(taskRecord);

            items.column = {
                text     : `L{TaskBoard.changeColumn} ${columnField}`,
                icon     : 'b-fw-icon b-icon-move-left-right',
                weight   : 300,
                disabled : taskRecord.readOnly,
                // Hidden columns are offered on purpose, this picks the task's column value rather than a slot on
                // the board, and a column may be hidden while still being a legitimate value
                menu     : client.columns.map(col => ({
                    ref         : String(col.id),
                    text        : StringHelper.encodeHtml(col.text),
                    cls         : 'b-column-menu-item',
                    isColumn    : true,
                    checked     : taskRecord.getValue(columnField) === col.id,
                    // Close menu when task is moved to a new column, looks weird to keep it open
                    closeParent : true
                })),
                onItem({ item }) {
                    if (item.isColumn) {
                        taskRecord.setValue(columnField, item.ref);

                        item.parent.items.forEach(sibling => {
                            if (sibling !== item) {
                                sibling.checked = false;
                            }
                        });
                    }
                }
            };

            if (client.swimlanes?.count && swimlaneField) {
                items.swimlane = {
                    text     : StringHelper.xss`L{TaskBoard.changeSwimlane} ${swimlaneField}`,
                    icon     : 'b-fw-icon b-icon-move-up-down',
                    weight   : 400,
                    disabled : taskRecord.readOnly,
                    menu     : client.swimlanes.map(lane => ({
                        ref         : String(lane.id),
                        text        : StringHelper.encodeHtml(lane.text),
                        isSwimlane  : true,
                        checked     : taskRecord.getValue(swimlaneField) === lane.id,
                        // Close menu when task is moved to a new swimlane, looks weird to keep it open
                        closeParent : true
                    })),
                    onItem({ item }) {
                        if (item.isSwimlane) {
                            taskRecord.setValue(swimlaneField, item.ref);

                            item.parent.items.forEach(sibling => {
                                if (sibling !== item) {
                                    sibling.checked = false;
                                }
                            });
                        }
                    }
                };
            }



            items.removeTask = {
                text      : isSelected && selectedTasks.length > 1 ? 'L{TaskBoard.removeTasks}' : 'L{TaskBoard.removeTask}',
                icon      : 'b-fw-icon b-icon-trash',
                separator : true,
                weight    : 500,
                disabled  : taskRecord.readOnly,
                onItem    : () => client.removeTask(isSelected ? selectedTasks : taskRecord)
            };
        }
    }

    get showMenu() {
        return true;
    }


}

// Register this feature type with its Factory
TaskBoardFeature.register(TaskMenu.type, TaskMenu);
