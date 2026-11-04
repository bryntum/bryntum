import Base from '../../../Core/Base.js';
import Widget from '../../../Core/widget/Widget.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';

// <remove-on-release>
// TODO: prevent multiple rerenders
// </remove-on-release>

/**
 * @module Grid/view/mixin/GridState
 */
const
    suspendStoreEvents    = subGrid => subGrid.columns.suspendEvents(),
    resumeStoreEvents     = subGrid => subGrid.columns.resumeEvents(),
    fillSubGridColumns    = subGrid => {
        subGrid.columns.clearCaches();
        subGrid.columns.fillFromMaster();
    },
    compareStateSortIndex = (a, b) => a.stateSortIndex - b.stateSortIndex;

/**
 * An object which encapsulates a {@link Grid.column.Column column}'s saved state.
 * @typedef {Object} ColumnState
 * @property {String} id The column's id.
 * @property {String} type The column's type.
 * @property {Boolean} hidden Whether the column is hidden.
 * @property {String} region The region of the column.
 * @property {String} locked The locked state of the column.
 * @property {String} text The header text of the column.
 * @property {String} [field] The field name of the column.
 * @property {String} [parentId] The id of the parent column, if this column is a child of another.
 * @property {Number} [width] The width of the column.
 * @property {Number} [flex] The flex of the column.
 * @property {Boolean} [collapsed] Whether the column is collapsed.
 */

/**
 * An object which encapsulates a {@link Grid.view.SubGrid}'s saved state.
 * @typedef {Object} SubGridState
 * @property {Number} [width] The width of the sub grid.
 * @property {Number} [flex] The flex of the sub grid.
 * @property {Boolean} collapsed Whether the sub grid is collapsed.
 */

/**
 * An object which encapsulates a {@link Grid.view.Grid}'s saved state.
 * @typedef {Object} GridStateInfo
 * @property {ColumnState[]} columns
 * @property {Number} rowHeight
 * @property {Object} scroll
 * @property {Number} scroll.scrollLeft
 * @property {Number} scroll.scrollTop
 * @property {String[]|Number[]} selectedRecords
 * @property {String} style
 * @property {String} selectedCell
 * @property {String[]} treeGroupLevels
 * @property {Object} store
 * @property {Sorter[]} store.sorters
 * @property {Grouper[]} store.groupers
 * @property {CollectionFilterConfig[]} store.filters
 * @property {String[]} store.collapsedGroups
 * @property {Object<String, SubGridState>} subGrids
 */

/**
 * Mixin for Grid that handles state. It serializes the following grid properties:
 *
 * * rowHeight
 * * selectedCell
 * * selectedRecords
 * * columns (order, widths, visibility)
 * * store (sorters, groupers, filters)
 * * scroll position
 * * collapsed group records
 * * tree group levels
 *
 * See {@link Core.mixin.State} for more information on state.
 *
 * {@inlineexample Grid/view/mixin/GridState.js}
 *
 * ## See also
 *
 * - {@link Core.mixin.State} - Base state mixin
 * - {@link Grid.view.Grid} - The Grid widget
 *
 * @demo Grid/state
 * @mixin
 */
export default Target => class GridState extends (Target || Base) {
    static $name = 'GridState';

    // region events

    /**
     * Fired before state is saved by the StateProvider. Allows editing the state object or preventing the operation.
     * @event beforeStateSave
     * @preventable
     * @param {GridStateInfo} state State object config
     */

    /**
     * Fired before state is applied to the source. Allows editing the state object or preventing the operation.
     * @event beforeStateApply
     * @preventable
     * @param {GridStateInfo} state State object config
     */

    // endregion

    static configurable = {
        statefulEvents : [
            'subGridCollapse',
            'subGridExpand',
            'horizontalScrollEnd',
            'verticalScrollEnd',
            'stateChange',
            'selectionChange',
            'collapseAllGroups',
            'expandAllGroups',
            'treeGroup'
        ],

        /**
        * The properties of this settings object controls how grid is restored from state data.
         *
         * To disable state restoration for unconfigured columns:
         *
         * ```javascript
         * const grid = new Grid({
         *     stateSettings : {
         *         restoreUnconfiguredColumns : false
         *     }
         * });
         * ```
         *
         * @prp {Object}
         * @property {Boolean} [restoreUnconfiguredColumns=true] Determines whether to restore columns from the state that are not explicitly defined in the grid configuration.
         */
        stateSettings : {
            restoreUnconfiguredColumns : true
        }
    };

    /**
     * Gets or sets grid's state. Check out {@link Grid.view.mixin.GridState} mixin for details.
     * @member {GridStateInfo} state
     * @category State
     */

    updateStore(store, was) {
        const me = this;

        super.updateStore?.(store, was);

        me.detachListeners('stateStoreListeners');

        store?.ion({
            name        : 'stateStoreListeners',
            filter      : 'triggerUpdate',
            group       : 'triggerUpdate',
            sort        : 'triggerUpdate',
            toggleGroup : ({ allRecords }) => {
                !allRecords && me.triggerUpdate();
            },
            thisObj : me
        });
    }

    updateColumns(columns, was) {
        super.updateColumns?.(columns, was);

        this.detachListeners('stateColumnListeners');

        columns.ion({
            name    : 'stateColumnListeners',
            change  : 'triggerUpdate',
            // batchColumnChanges coalesces its per-column changes into a single refresh (action: 'batch')
            refresh : ({ action }) => {
                if (action === 'batch') {
                    this.triggerUpdate();
                }
            },
            sort    : 'triggerUpdate',
            thisObj : this
        });
    }

    updateRowManager(manager, was) {
        super.updateRowManager?.(manager, was);

        this.detachListeners('stateRowManagerListeners');

        manager.ion({
            name      : 'stateRowManagerListeners',
            rowHeight : 'triggerUpdate',
            thisObj   : this
        });
    }

    triggerUpdate() {
        this.trigger('stateChange');
    }

    /**
     * Get grid's current state for serialization. State includes rowHeight, headerHeight, selectedCell,
     * selectedRecordId, column states and store state etc.
     * @returns {Object} State object to be serialized
     * @private
     */
    getState() {
        const
            me    = this,
            style = me.element.style.cssText,
            state = {
                rowHeight : me.rowHeight
            };

        if (style) {
            state.style = style;
        }

        if (me.selectedCell) {
            // <remove-on-release>
            // TODO: Create wrapper class to avoid JSON.stringify recursion in state.selectedCell.
            // </remove-on-release>
            const { id, columnId } = me.selectedCell;
            state.selectedCell     = { id, columnId };
        }

        if (!me.disableGridColumnIdWarning && me.columns.find(c => c.meta.generatedId === c.id)) {
            console.warn('Column(s) without id detected. When saving and restoring state, columns without a configured id can be restored incorrectly.');
        }

        state.selectedRecords = me.selectedRecords.map(entry => entry.id);
        state.columns         = me.columns.allRecords.map(column => column.getState());
        state.store           = me.store.state;
        state.scroll          = me.storeScroll();

        // LockRows displays a store chained off the master. Filters and sorters belong to the master, since the
        // Filter, FilterBar and Sort features all target `$store`. Groupers belong to the displayed store.
        if (me.$store !== me.store) {
            const masterState = me.$store.state;

            for (const key of ['filters', 'sorters']) {
                if (key in masterState) {
                    state.store[key] = masterState[key];
                }
                else {
                    delete state.store[key];
                }
            }
        }

        me.populateState(state);

        state.subGrids = {};

        me.eachSubGrid(subGrid => {
            const config = state.subGrids[subGrid.region] = state.subGrids[subGrid.region] || {};

            if (subGrid.isPainted) {
                if (subGrid.flex == null) {
                    config.width = subGrid.width;
                }
            }
            else if (subGrid.config.width != null) {
                config.width = subGrid.config.width;
            }
            else {
                config.flex = subGrid.config.flex;
            }

            config.collapsed = subGrid.collapsed ?? false;

            // Part of a collapsed SubGrid's state is the state to restore to when expanding again.
            if (config.collapsed) {
                config._beforeCollapseState = subGrid._beforeCollapseState;
            }
        });

        // Collect state from all features
        for (const [key, feature] of Object.entries(this.features)) {
            const featureState = feature.state;
            if (featureState) {
                state.features = state.features || {};
                state.features[key] = featureState;
            }
        }

        return state;
    }

    /**
     * Called when the grid's state is collected, after the store state is read. Chained in features to add their
     * part of the state or to amend the store state.
     * @param {GridStateInfo} state The state being collected
     * @internal
     */
    populateState(state) {}

    /**
     * Called when state is applied, right before the store state is. Chained in features to consume their part of
     * the state first, removing what they have handled.
     * @param {GridStateInfo} state A shallow copy of the state being applied
     * @internal
     */
    beforeApplyStoreState(state) {}

    /**
     * Apply previously stored state.
     * @param {Object} state
     * @private
     */
    applyState(state) {
        const
            me          = this,
            { columns } = me;

        state = { ...state };
        // Applying state will call row renderer at least 7 times. Suspending refresh helps to save some time.
        // Roughly on default testing grid apply state takes 26ms without suspend and 16ms with it.
        me.suspendRefresh();

        // Do this first since it might perform full rendering of contents, recreating filterbar header fields
        if ('columns' in state) {
            let columnsChanged = false,
                needSort       = false;

            // We're going to renderContents anyway, so stop the ColumnStores from updating the UI
            columns.suspendEvents();
            me.eachSubGrid(suspendStoreEvents);

            const
                // Set<Column>
                stateApplied = new Set(),
                // Map<ColumnsState, Column>
                stateColumn  = new Map();

            // each column triggers rerender at least once...
            state.columns.forEach((columnState, index) => {
                const column = columns.lookupStateColumns(columnState).filter(c => !stateApplied.has(c))[0] ?? (me.stateSettings?.restoreUnconfiguredColumns && !columnState.isSelectionColumn &&
                // try to recreate the column
                columns.add({ id : columnState.id, type : columnState.type, field : columnState.field })[0]);

                if (column) {
                    // remember this column state as already applied
                    stateApplied.add(column);
                    // keep state => column map for the next loop where we handle parentId
                    stateColumn.set(columnState, column);

                    const columnGeneration = column.generation;

                    // If column region is missing in the current config, clear it from the column state and
                    // stick to the default configuration
                    if ('region' in columnState && !(columnState.region in me.subGrids)) {
                        delete columnState.region;
                        delete columnState.locked;
                    }

                    column.applyState(columnState);
                    columnsChanged = columnsChanged || (column.generation !== columnGeneration);

                    // In case a sort is needed, stamp in the ordinal position.
                    column.stateSortIndex = index;

                    // If we find one out of order, only then do we need to sort
                    if (column.allIndex !== index) {
                        needSort = columnsChanged = true;
                    }
                }
            });

            // Move any moved columns to the right location
            state.columns.forEach(columnState => {
                if ('parentId' in columnState) {
                    const
                        parentStateConfig = state.columns.find(cfg => cfg.id === columnState.parentId),
                        parentColumn      = stateColumn.get(parentStateConfig),
                        childCol          = stateColumn.get(columnState);

                    if (parentColumn && childCol && childCol.parent !== parentColumn) {
                        parentColumn.insertChild(childCol);
                    }
                }
            });

            if (columnsChanged) {
                me.eachSubGrid(fillSubGridColumns);
            }
            if (needSort) {
                me.eachSubGrid(subGrid => {
                    subGrid.columns.records.sort(compareStateSortIndex);
                    subGrid.columns.allRecords.sort(compareStateSortIndex);
                });
                columns.sort({
                    fn        : compareStateSortIndex,
                    // always sort ascending
                    ascending : true
                });
            }

            // If we have been painted, and column restoration changed the column layout, refresh contents
            if (me.isPainted && columnsChanged) {
                me.renderContents();
            }

            // Allow ColumnStores to update the UI again
            columns.resumeEvents();
            me.eachSubGrid(resumeStoreEvents);
            delete state.columns;
        }

        if ('subGrids' in state) {
            me.eachSubGrid(subGrid => {
                if (subGrid.region in state.subGrids) {
                    const subGridState = state.subGrids[subGrid.region];

                    if ('width' in subGridState) {
                        subGrid.width = subGridState.width;
                    }
                    else if ('flex' in subGridState) {
                        subGrid.flex = subGridState.flex;
                    }

                    if ('collapsed' in subGridState) {
                        subGrid.collapsed            = subGridState.collapsed;
                        subGrid._beforeCollapseState = subGridState._beforeCollapseState;
                    }
                }

                subGrid.clearWidthCache();
            });
            delete state.subGrids;
        }

        me.beforeApplyStoreState(state);

        // Consumed by the TreeGroup feature above, ignored without it
        delete state.treeGroupLevels;

        if ('store' in state) {
            const { store, $store } = me;

            if ($store === store) {
                store.state = state.store;
            }
            // See `getState()`. The master is applied last, so that the sort it relays to the chained store stays
            else {
                const { filters = [], sorters = [], ...displayedState } = state.store;

                store.state  = displayedState;
                $store.state = { filters, sorters };
            }

            delete state.store;
        }

        // Scroll is restored separately at the end below
        const scrollState = state.scroll;
        delete state.scroll;

        if ('features' in state) {
            for (const key in state.features) {
                // If a feature has been removed, prevent accessing it
                this.features[key]?.setConfig?.(state.features[key]);
            }

            delete state.features;
        }

        ObjectHelper.assign(me, state);

        me.resumeRefresh(true);

        me.whenVisible(() => me.applyScrollState(scrollState));
    }

    applyScrollState(scrollState) {
        const me = this;

        // Update scroll state
        me.eachSubGrid(s => s.refreshFakeScroll());

        if (scrollState) {
            me.restoreScroll(scrollState);

            // We need to force resize handler on all observable elements, because vertical scroll triggered by the
            // previous method will suspend the listener. So by the time ResizeObserver triggers mutation handler
            // listener won't actually update widget size.
            // Handler works here because we haven't _yet_ suspended it, it will happen one animation frame after
            // scroll event is triggered
            if (scrollState.scrollTop) {
                me.element.querySelectorAll('.b-resize-monitored').forEach(element => {
                    const widget = Widget.fromElement(element);

                    if (widget) {
                        widget.onElementResize(element);
                    }
                });
            }
        }
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
