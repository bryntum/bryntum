import DomHelper from '../../Core/helper/DomHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import Widget from '../../Core/widget/Widget.js';
import '../../Core/widget/Toolbar.js';
import '../../Core/widget/Menu.js';
import TaskBoardFeature from './TaskBoardFeature.js';

DomHelper.loadStylesheet('TaskBoard/feature/ColumnToolbars.css');

// import Stylesheet from './ColumnToolbars.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ColumnToolbars');

/**
 * @module TaskBoard/feature/ColumnToolbars
 */

const
    toolbarCls      = {
        top    : 'b-task-board-column-tbar',
        bottom : 'b-task-board-column-bbar'
    },
    toolbarSelector = `.${toolbarCls.top},.${toolbarCls.bottom}`,
    byDomPosition   = (a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

/**
 * Adds toolbars to the top and/or bottom of each column. By default it adds a bottom toolbar containing a single button
 * for adding events to that column/swimlane:
 *
 * {@inlineexample TaskBoard/feature/ColumnToolbars.js}
 *
 * To add, remove or modify toolbar items for all columns, see {@link #config-topItems} and {@link #config-bottomItems}:
 *
 * {@inlineexample TaskBoard/feature/ColumnToolbarsAdd.js}
 *
 * To have per column/swimlane control over the items, see {@link #config-processItems}:
 *
 * {@inlineexample TaskBoard/feature/ColumnToolbarsProcess.js}
 *
 * In handlers for buttons etc, you can access which column/swimlane the action was taken in on the supplied `source`
 * param, using its `columnRecord` and `swimlaneRecord` properties:
 *
 * ```javascript
 * new TaskBoard({
 *    features : {
 *        columnToolbars : {
 *            topItems : {
 *                clearButton : {
 *                    icon    : 'fa fa-trash',
 *                    onClick({ source }) {
 *                        if (source.columnRecord) {
 *                            ...
 *                        }
 *                    }
 *                }
 *            }
 *        }
 *    }
 * });
 * ```
 *
 * This feature is **enabled** by default.
 *
 * @extends TaskBoard/feature/TaskBoardFeature
 * @uninherit Core/Base
 * @uninherit Core/localization/Localizable
 * @classtype columnToolbars
 * @feature
 * @tier community
 */
export default class ColumnToolbars extends TaskBoardFeature {

    static $name = 'ColumnToolbars';

    static tier = 'community';

    static type = 'columnToolbars';

    static configurable = {
        /**
         * Items to add to the top toolbar, in object format.
         *
         *
         * ```javascript
         * new TaskBoard({
         *    features : {
         *        columnToolbars : {
         *            topItems : {
         *                clearButton : {
         *                    icon    : 'fa fa-trash',
         *                    onClick : ...
         *                }
         *            }
         *        }
         *    }
         * });
         * ```
         *
         * @config {Object<String,ContainerItemConfig|Boolean|null>}
         */
        topItems : null,

        /**
         * Items to add to the bottom toolbar, in object format.
         *
         * To remove existing items, set corresponding keys to `null`.
         *
         * ```javascript
         * new TaskBoard({
         *    features : {
         *        columnToolbars : {
         *            bottomItems : {
         *                clearButton : {
         *                    icon    : 'fa fa-trash',
         *                    onClick : ...
         *                }
         *            }
         *        }
         *    }
         * });
         * ```
         *
         * @config {Object<String,ContainerItemConfig|Boolean|null>}
         */
        bottomItems : {
            addTask : true
        },

        // Predefined items that can be used in topItems and/or bottomItems
        // <remove-on-release>
        // TODO: Document and make public?
        // </remove-on-release>
        namedItems : {
            addTask : {
                type              : 'button',
                icon              : 'b-icon-add',
                tooltip           : 'L{TaskBoard.addTask}',
                ariaLabel         : 'L{TaskBoard.addTask}',
                rendition         : 'text',
                internalListeners : {
                    click : 'onAddClick'
                }
            }
        },

        /**
         * A function called before displaying the toolbar that allows manipulations of its items.
         * Returning `false` from this function prevents the menu being shown.
         *
         * ```javascript
         * features         : {
         *    columnToolbars : {
         *         processItems({ items, location, columnRecord, swimlaneRecord }) {
         *             // Add or hide existing items here as needed
         *             items.myAction = {
         *                 text   : 'Cool action',
         *                 icon   : 'fa fa-ban',
         *                 onClick : () => console.log(`Clicked button for ${columnRecord.text}`)
         *             };
         *
         *            if (columnRecord.id === 'done') {
         *                items.addTask = false
         *            }
         *         }
         *     }
         * },
         * ```
         *
         * @config {Function}
         * @param {Object} context An object with information about the toolbar being shown
         * @param {TaskBoard.feature.ColumnToolbars} context.feature A reference to this feature.
         * @param {Object<String,ContainerItemConfig>} context.items An object containing the toolbar item configs keyed by ref
         * @param {'top'|'bottom'} context.location Toolbar location, "top" or "bottom"
         * @param {TaskBoard.model.ColumnModel} context.columnRecord Record representing toolbars column
         * @param {TaskBoard.model.SwimlaneModel} context.swimlaneRecord Record representing toolbars swimlane
         * @returns {Boolean|null} Returning `false` from this function prevents the menu being shown
         * @preventable
         */
        processItems : null
    };

    // Holds exising toolbars, keyed by location, column and swimlane
    columnMap = new Map();

    static get pluginConfig() {
        return {
            after    : ['populateColumn', 'onRemoveColumnElement', 'onRemoveSwimlaneElement'],
            override : ['getTabStopCandidates', 'resolveTabStop', 'getColumnCellNavigationChain', 'getRowNavigationChain']
        };
    }

    doDestroy() {
        for (const [, toolbar] of this.columnMap) {
            toolbar.destroy();
        }

        super.doDestroy();
    }

    //region Type assertions

    changeTopItems(items) {
        ObjectHelper.assertObject(items, 'features.columnToolbars.topItems');

        return items;
    }

    changeBottomItems(items) {
        ObjectHelper.assertObject(items, 'features.columnToolbars.bottomItems');

        return items;
    }

    changeProcessItems(fn) {
        ObjectHelper.assertFunction(fn, 'features.columnToolbars.processItems');

        return fn;
    }

    //endregion

    // Creates or retrieves a toolbar instance for the requested column/swimlane intersection
    getToolbar(location, columnRecord, swimlaneRecord) {
        const
            me                                = this,
            { columnMap, client, namedItems } = me,
            items                             = me[`${location}Items`],
            key                               = `${location}_._${columnRecord.domId}_._${swimlaneRecord?.domId ?? 'default'}`;

        let toolbar = columnMap.get(key);

        if (!toolbar) {
            const clonedItems = {};

            // items allows configuring out using falsy value, only iterate the truthy ones
            ObjectHelper.getTruthyKeys(items).map(ref => {
                const
                    // Could match a named item, to either be used as is or use reconfigured
                    namedItem = namedItems[ref],
                    // Item config or a truthy value to include a named item as is
                    item      = items[ref];

                clonedItems[ref] = ObjectHelper.merge(
                    // Default listeners + decorate with records
                    {
                        internalListeners : {
                            click   : 'onClick',
                            change  : 'onChange',
                            thisObj : me
                        },

                        columnRecord,
                        swimlaneRecord
                    },
                    // Merge with any matched named item
                    namedItem,
                    // And any supplied config
                    item
                );
            });

            // Allow client code to alter items before adding them to the toolbar
            if (me.processItems?.({ feature : me, items : clonedItems, location, columnRecord, swimlaneRecord }) === false) {
                return null;
            }

            // Create toolbar using the processed items
            toolbar = client.add({
                type                      : 'toolbar',
                cls                       : toolbarCls[location],
                overflow                  : null,
                monitorResize             : false,
                contentElMutationObserver : false,
                items                     : clonedItems,
                defaults                  : {
                    tabIndex : -1
                },
                dataset : {
                    role          : `${location}-toolbar`,
                    domTransition : true
                }
            });

            columnMap.set(key, toolbar);
        }

        return toolbar.element;
    }

    populateColumn({ columnConfig, columnRecord, swimlaneRecord }) {
        const me = this;

        if (!me.disabled) {
            // Add top toolbar, if it has items
            if (ObjectHelper.getTruthyKeys(me.topItems).length) {
                DomHelper.merge(columnConfig, {
                    children : {
                        'tbar > body' : me.getToolbar('top', columnRecord, swimlaneRecord)
                    }
                });
            }

            // Add bottom toolbar, if it has items
            if (ObjectHelper.getTruthyKeys(me.bottomItems).length) {
                columnConfig.children.bbar = me.getToolbar('bottom', columnRecord, swimlaneRecord);
            }
        }
    }

    removeColumnToolbar(location, columnId, swimlaneId) {
        const
            { columnMap, client } = this,
            key                   = `${location}_._${columnId}_._${swimlaneId}`,
            toolbar               = columnMap.get(key);

        if (toolbar) {
            client.remove(toolbar);

            // Toolbar gets removed during a compose, which leads to a race condition with syncOverflowVisibility.
            // Postpone destroy til after compose to avoid this
            client.setTimeout(() => toolbar.destroy(), 0);

            columnMap.delete(key);
        }
    }

    removeColumnToolbars(columnId, swimlaneId) {
        this.removeColumnToolbar('top', columnId, swimlaneId);
        this.removeColumnToolbar('bottom', columnId, swimlaneId);
    }

    onRemoveColumnElement({ columnId, swimlaneRecord }) {
        // A column that still exists is only losing this element, not going away: moving it in or out of a column group
        // re-parents it into/out of the group container, which renders a new element at a new DomSync path. Its
        // toolbars are reused as soon as it renders again, so only discard them when the column itself is gone
        if (!this.client.columns.getById(columnId)) {
            this.removeColumnToolbars(columnId, swimlaneRecord.id ?? 'default');
        }
    }

    onRemoveSwimlaneElement({ swimlaneId }) {
        for (const column of this.client.columns) {
            this.removeColumnToolbars(column.id, swimlaneId);
        }
    }

    //endregion

    //region Keyboard navigation

    // The toolbar items take part in the board's roving tabIndex composite, see TaskBoard/view/mixin/TaskNavigation.

    getToolbarElement(element) {
        return element.closest(toolbarSelector);
    }

    // Widget space, as Core's sibling focus traversal
    getToolbarTabStops(toolbarElement) {
        return (Widget.fromElement(toolbarElement, 'toolbar')?.childItems ?? [])
            .filter(item => item.isFocusable)
            .map(item => item.focusElement);
    }

    // Items of the top or bottom toolbar in a column cell, in navigation order
    getCellTabStops(cellElement, location) {
        const toolbarElement = cellElement.querySelector(`.${toolbarCls[location]}`);

        return toolbarElement ? this.getToolbarTabStops(toolbarElement) : [];
    }

    getTabStopCandidates() {
        const
            candidates = this.overridden.getTabStopCandidates(),
            tabStops   = [...this.client._bodyElement.querySelectorAll(toolbarSelector)]
                .flatMap(toolbarElement => this.getToolbarTabStops(toolbarElement));

        return [...candidates, ...tabStops].sort(byDomPosition);
    }

    resolveTabStop(element) {
        return this.getToolbarElement(element) ? element : this.overridden.resolveTabStop(element);
    }

    getColumnCellNavigationChain(cellElement) {
        return [
            ...this.getCellTabStops(cellElement, 'top'),
            ...this.overridden.getColumnCellNavigationChain(cellElement),
            ...this.getCellTabStops(cellElement, 'bottom')
        ];
    }

    // The horizontal chain for an element in a toolbar, the same toolbar across the swimlane's columns
    getRowNavigationChain(element) {
        const toolbarElement = this.getToolbarElement(element);

        if (!toolbarElement) {
            return this.overridden.getRowNavigationChain(element);
        }

        const
            location     = toolbarElement.classList.contains(toolbarCls.top) ? 'top' : 'bottom',
            cellElements = toolbarElement.closest('.b-task-board-swimlane')?.querySelectorAll('.b-task-board-column') ?? [];

        return [...cellElements].flatMap(cellElement => this.getCellTabStops(cellElement, location));
    }

    //endregion

    //region Predefined items events

    async onAddClick({ source }) {
        await this.client.addTask(source.columnRecord, source.swimlaneRecord);
    }

    //endregion

    //region Generic events

    onChange({ source }) {
        this.trigger('itemChange', {
            item           : source,
            columnRecord   : source.columnRecord,
            swimlaneRecord : source.swimlaneRecord
        });
    }

    onClick({ source }) {
        this.trigger('itemClick', {
            item           : source,
            columnRecord   : source.columnRecord,
            swimlaneRecord : source.swimlaneRecord
        });
    }

    //endregion
}

ColumnToolbars.initClass();
