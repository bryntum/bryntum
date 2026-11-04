import Base from '../../../Core/Base.js';
import GlobalEvents from '../../../Core/GlobalEvents.js';
import ArrayHelper from '../../../Core/helper/ArrayHelper.js';
import EventHelper from '../../../Core/helper/EventHelper.js';
import DragHelper from '../../../Core/helper/DragHelper.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import Collection from '../../../Core/util/Collection.js';
import ColumnStore from '../../data/ColumnStore.js';
import GridLocation from '../../util/GridLocation.js';
import '../../../Core/widget/Checkbox.js';
import '../../column/RowNumberColumn.js';

const
    validIdTypes     = {
        string : 1,
        number : 1
    },
    isDataLoadAction = {
        dataset : 1,
        batch   : 1
    };

/**
 * @module Grid/view/mixin/GridSelection
 */

/**
 * @typedef {Object} GridSelectionMode
 * @property {Boolean} [cell=false] Set to `true` to enable cell selection. This takes precedence over row
 *   selection, but rows can still be selected programmatically or with checkbox or `RowNumber` selection. Required for
 *   `column` selection
 * @property {Boolean} [row=false] Set to `true` to enable row selection. This takes precedence over row selection.
 *   Required for `row` selection
 * @property {Boolean} [multiSelect=true] Allow multiple selection with ctrl and `[Shift + Click]` or with
 *   `checkbox` selection. Required for `dragSelect` and `column` selection
 * @property {Boolean} [alwaysMultiSelect=true] Allow multiple selection by simply clicking a row/checkbox
 * @property {Boolean|CheckColumnConfig} [checkbox=false] Set to `true` to add a checkbox selection column
 *   to the grid, or pass a config object for the {@link Grid.column.CheckColumn}.
 *   **Note** that the checkbox selection column should not be configured with a `field`, since it is linked to grid
 *   selection and not to record data
 * @property {Number|String} [checkboxIndex] Positions the checkbox column at the provided index or to the
 *   right of a provided column id. Defaults to `0` or to the right of an included `RowNumberColumn`
 * @property {Boolean} [checkboxOnly=false] Select rows only when clicking in the checkbox column.
 *   Requires cell selection config to be `false` and checkbox to be set to `true`. This setting allows
 *   clicking on other cells without affecting selection. This setting was previously named
 *   `rowCheckboxSelection`
 * @property {Boolean} [showCheckAll=false] Set to `true` to add a checkbox to the selection column header
 *   to select/deselect all rows. Requires checkbox to also be set to `true`. **Not supported** when `Store` is
 *   configured with {@link Core.data.Store#config-lazyLoad}
 * @property {Boolean} [showCheckAllInGroupRows=false] Set to `true` to add a checkbox to group rows to be able to
 *   check/uncheck all group members
 * @property {Boolean} [deselectFilteredOutRecords=false] Set to `true` to deselect records when they are filtered out
 * @property {Boolean|String} [includeChildren=false] Set to `true` to also select/deselect child nodes when a parent
 *   node is selected by toggling the checkbox. Set to `'always'` to always select/deselect child nodes.
 * @property {Boolean|'all'|'some'} [includeParents=false] Set to `all` or `true` to auto select parent if
 *   all its children gets selected. If one gets deselected, the parent will also be deselected. Set to 'some' to select
 *   parent if one of its children gets selected. The parent will be deselected if all children gets deselected.
 * @property {Boolean} [preserveSelectionOnPageChange=false] In `row` selection mode, this flag controls
 *   whether the Grid should preserve its selection when loading a new page of a paged data store. Defaults to `false`.
 * @property {Boolean} [preserveSelectionOnDatasetChange=true] In `row` selection mode, this flag controls
 *   whether the Grid should preserve its selection of cells / rows when loading a new dataset (assuming the selected
 *   records are included in the newly loaded dataset)
 * @property {Boolean} [deselectOnClick=false] Toggles whether the Grid should deselect a selected row or
 *   cell when clicking it
 * @property {Boolean} [dragSelect=false] Set to `true` to enable multiple selection by dragging. Requires
 *   to also be set to `true`. Also requires the {@link Grid.feature.RowReorder} feature to be set to
 *   {@link Grid.feature.RowReorder#config-gripOnly}
 * @property {Boolean} [selectOnKeyboardNavigation=true] Set to `false` to disable auto-selection by
 *   keyboard navigation. This will activate the `select` keyboard shortcut
 * @property {Boolean} [column=false] Set to `true` to be able to select whole columns of cells by
 *   clicking the header. Requires cell to be set to `true`. **Not supported** when `Store` is configured with
 *   {@link Core.data.Store#config-lazyLoad}
 * @property {Boolean|RowNumberColumnConfig} [rowNumber=false] Set to `true`, or a config object to add a
 *   `RowNumberColumn` which, when clicked, selects the row
 * @property {Boolean} [selectRecordOnCell=true] Set to `false` not to include the record in the
 *   `selectedRecords` array when one of the record row's cells is selected
 */

/**
 * A mixin for Grid that handles row and cell selection. See {@link #config-selectionMode} for details on how to control
 * what should be selected (rows, cells, columns) and how the selection should work.
 *
 * {@inlineexample Grid/mixin/GridSelection.js}
 *
 * ```javascript
 * // select a row
 * grid.selectedRow = 7;
 *
 * // select a cell
 * grid.selectedCell = { id: 5, columnId: 'column1' }
 *
 * // select a record
 * grid.selectedRecord = grid.store.last;
 *
 * // select multiple records by ids
 * grid.selectedRecords = [1, 2, 4, 6]
 * ```
 *
 * ## See also
 *
 * - {@link Grid.view.Grid} - The Grid widget
 * - {@link Grid.view.mixin.GridNavigation} - Cell navigation mixin
 *
 * @demo Grid/selection
 * @mixin
 */
export default Target => class GridSelection extends (Target || Base) {
    static $name = 'GridSelection';

    static configurable = {
        /**
         * Selection configuration settings, change these properties to control how selection works and what can be
         * selected.
         *
         * When *configuring* (creating an instance), set this to an object containing only those properties you want to
         * *change*.
         *
         * ```javascript
         * new Grid({
         *     selectionMode : {
         *        // Enables cell selection
         *        cell       : true,
         *        // Enabled cell and record selection by dragging
         *        dragSelect : true,
         *        // Enables selection of a column's cells by clicking the column header
         *        column     : true,
         *        // Shows a row number column which, when clicked, selected the row/record
         *        rowNumber  : true
         *     }
         * });
         * ```
         *
         * ## Dynamic Updates
         *
         * The Grid monitors `selectionMode` properties for changes at runtime and immediately updates its selection
         * behaviour and UI in response. Changes are detected via property mutation.
         *
         * **Mutate individual properties:**
         * ```javascript
         * // Adds a selection checkbox column and makes that the only way to select
         * grid.selectionMode.checkboxOnly = true;
         *
         * // Deactivates the auto selection of rows and cells when keyboard navigating
         * grid.selectionMode.selectOnKeyboardNavigation = false;
         * ```
         *
         * **Replace with a new object (merges into the existing object):**
         * ```javascript
         * grid.selectionMode = { ...grid.selectionMode, multiSelect : false };
         * ```
         *
         * When properties change, the Grid will:
         * - Update selection UI (add/remove checkbox or row number columns)
         * - Apply property validation rules (e.g., enabling `column` automatically enables `cell` and `multiSelect`)
         * - Clear selection if switching between row/cell modes or multiSelect settings
         *
         * @prp {GridSelectionMode} selectionMode
         * @includetypedef
         * @default
         * @category Selection
         */
        selectionMode : {
            cell                             : false,
            multiSelect                      : true,
            checkboxOnly                     : false,
            checkbox                         : false,
            checkboxPosition                 : null,
            showCheckAll                     : false,
            deselectFilteredOutRecords       : false,
            includeChildren                  : false,
            includeParents                   : false,
            preserveSelectionOnPageChange    : false,
            preserveSelectionOnDatasetChange : true,
            deselectOnClick                  : false,
            dragSelect                       : false,
            selectOnKeyboardNavigation       : true,
            column                           : false,
            rowNumber                        : false,
            selectRecordOnCell               : true
        },

        keyMap : {
            'Shift+ArrowUp'    : 'extendSelectionUp',
            'Shift+ArrowDown'  : 'extendSelectionDown',
            'Shift+ArrowLeft'  : 'extendSelectionLeft',
            'Shift+ArrowRight' : 'extendSelectionRight',
            // Enter both enters actionable cell widgets (activateCell) and selects the focused row; listing
            // both keeps activateCell (toggleSelection is weighted last and returns false when it must not select).
            ' '                : { handler : 'toggleSelection', weight : 10 },
            Enter              : ['activateCell', { handler : 'toggleSelection', weight : 10 }]
        },

        selectedRecordCollection : {},

        selectionDisabled : false
    };

    construct(config) {
        const me = this;

        me._selectedCells = [];
        me._selectedRows = [];

        super.construct(config);

        if (config?.selectedRecords) {
            me.selectedRecords = config.selectedRecords;
        }
        // A selectedRecordCollection supplied already populated (e.g. a Combo's valueCollection filled from an
        // initial value before its picker was lazily created) must be reflected as the initial selection, since
        // the collection change listener only reacts to subsequent changes.
        else if (me.selectedRecordCollection?.count) {
            me.onSelectedRecordCollectionChange({ added : me.selectedRecordCollection.values });
        }
    }

    //region Init

    getDefaultGridSelection(clas) {
        if (clas.$name === 'GridSelection') {
            return clas.configurable.selectionMode;
        }
        else if (clas.superclass) {
            return this.getDefaultGridSelection(clas.superclass);
        }
    }

    changeSelectionMode(mode) {
        const me = this;

        // If changing the selectionMode config object after creation
        if (me.selectionMode) {
            ObjectHelper.assign(me.selectionMode, mode);
            return me.selectionMode;
        }

        me.$defaultGridSelection = me.getDefaultGridSelection(me.constructor);

        // Wraps changeSelectionMode object in a proxy to monitor property changes.
        return new Proxy(mode, {
            set(obj, prop, value) {
                const old = ObjectHelper.assign({}, obj);
                obj[prop] = value;
                // Calls selectionMode's update method on property change
                me.updateSelectionMode(obj, old);
                return true;
            }
        });
    }

    /**
     * The selectionMode configuration has been changed.
     * @event selectionModeChange
     * @param {Object} selectionMode The new {@link #config-selectionMode}
     */

    // Will be called if selectionMode config object changes or if one of its properties changes
    updateSelectionMode(mode, oldMode = this.$defaultGridSelection) {
        const
            me             = this,
            {
                columns,
                checkboxSelectionColumn
            }              = me,
            changed        = {},
            { rowReorder } = me.features;

        for (const property in mode) {
            if (mode[property] != oldMode[property]) {
                changed[property] = mode[property];
            }
        }

        // If column config has been activated, activate cell and multiSelect
        if (changed.column) {
            mode.cell = true;
            mode.multiSelect = true;
        }

        // If cell config has been activated, deactivate checkboxOnly
        if (changed.cell) {
            mode.checkboxOnly = false;
        }

        // If cell config has been deactivated, deactivate column
        if (changed.cell === false) {
            mode.column = false;
        }

        if (changed.alwaysMultiSelect) {
            mode.multiSelect = true;
            mode.deselectOnClick = true;
        }

        // If checkboxOnly config has been activated, activate checkbox and deactivate cell
        if (changed.checkboxOnly) {
            if (!mode.checkbox) {
                // checkbox can be a CheckboxColumnConfig
                mode.checkbox = true;
            }
            mode.cell = false;
        }

        // If checkbox config has been deactivated, deactivate checkboxOnly and showCheckAll
        if (changed.checkbox === false) {
            changed.checkboxOnly = false;
            changed.showCheckAll = false;
        }

        // If showCheckAll has been activated, activate checkbox and multiselect
        if (changed.showCheckAll) {
            mode.checkbox = mode.checkbox || true;
            mode.multiSelect = true;
        }

        // If includeChildren config has been activated, activate multiselect
        if (changed.includeChildren || changed.includeParents || changed.showCheckAllInGroupRows) {
            mode.multiSelect = true;

            if (me.features.group) {
                mode.includeParents = mode.showCheckAllInGroupRows;
            }
        }

        if (mode.checkbox && me.features.group?.enabled && typeof changed.showCheckAllInGroupRows === 'boolean') {
            me.renderRows();
        }

        // If multiSelect has been deactivated, deactivate column, showCheckAll, dragSelect and includeChildren
        if (changed.multiSelect === false) {
            mode.column = mode.showCheckAll = mode.dragSelect = mode.includeChildren = mode.includeParents = mode.alwaysMultiSelect = mode.showCheckAllInGroupRows = false;
        }

        if (changed.deselectOnClick === false) {
            mode.alwaysMultiSelect = false;
        }

        if (changed.dragSelect) {
            if (rowReorder?.enabled && rowReorder.gripOnly !== true) {
                rowReorder.gripOnly = true;
                rowReorder.showGrip ||= true;
            }
            mode.multiSelect = true;
            me._selectionListenersDetachers = {};
        }
        if (changed.dragSelect === false && me._selectionListenersDetachers) {
            me.removeDragListeners();
        }

        // Deselect all when switching between row or cell selection mode
        // Deselect all when switching from multiselect to singleselect
        // Deselect all when changing deselectFilteredOutRecords
        if (!me.isConfiguring && oldMode && (
            changed.cell !== undefined ||
            changed.deselectFilteredOutRecords !== undefined ||
            changed.multiSelect !== undefined
        )) {
            me.deselectAll();
        }

        // Row number selection
        if (changed.rowNumber) {
            if (!columns.findRecord('type', 'rownumber')) {
                // if gantt, sequenceColumn, empty text
                const defaults = me.isGanttBase ? { type : 'sequence', text : '' } : { type : 'rownumber' };

                columns.insert(0, {
                    ...defaults,
                    ...(typeof mode.rowNumber == 'object' ? mode.rowNumber : {})
                });
                me._selectionAddedRowNumberColumn = true;
            }
        }
        else if (changed.rowNumber === false && me._selectionAddedRowNumberColumn) {
            columns.remove(columns.findRecord('type', 'rownumber'));
            delete me._selectionAddedRowNumberColumn;
        }

        // Add or remove checkbox column
        if (mode.checkbox !== oldMode?.checkbox ||
            (mode.checkbox && (mode.showCheckAll !== oldMode?.showCheckAll))
        ) {
            // See to it that were done configuring when initCheckboxSelection is called.
            if (me.isConfiguring) {
                me.shouldInitCheckboxSelection = true;
            }
            else {
                if (oldMode) {
                    me.deselectAll();
                }
                me.initCheckboxSelection();
            }
        }

        // If only checkboxIndex has changed
        if (oldMode && mode.checkbox && oldMode.checkbox &&
            mode.checkboxIndex !== oldMode.checkboxIndex && checkboxSelectionColumn) {
            checkboxSelectionColumn.parent.insertChild(checkboxSelectionColumn, columns.getAt(me.checkboxSelectionColumnInsertIndex));
        }

        me.trigger('selectionModeChange', ObjectHelper.clone(mode));
        me.afterSelectionModeChange(mode);
    }

    afterConfigure() {
        const me = this;

        // See to it that were done configuring when initCheckboxSelection is called.
        if (me.shouldInitCheckboxSelection) {
            me.shouldInitCheckboxSelection = false;
            me.initCheckboxSelection();
        }

        me.scrollManager.ion({
            scroll : ({ event, deltaY }) => {
                if (deltaY !== 0) {
                    me.onSelectionDrag(event);
                }
            }
        });
        super.afterConfigure();
    }

    initCheckboxSelection() {
        const
            me           = this,
            {
                selectionMode,
                columns,
                checkboxSelectionColumn
            }            = me,
            { checkbox } = selectionMode;

        // Always remove checkbox column when config changes
        if (checkboxSelectionColumn) {
            // Need to remove this handle because GridBase restores it if it exists.
            me.checkboxSelectionColumn = null;
            columns.remove(checkboxSelectionColumn);
            checkboxSelectionColumn.destroy();
        }

        // Inject our CheckColumn into the ColumnStore
        if (checkbox) {
            const
                checkColumnClass = ColumnStore.getColumnClass('check'),
                config           = checkbox === true ? null : checkbox;

            if (!checkColumnClass) {
                throw new Error('CheckColumn must be imported for checkbox selection mode to work');
            }

            const col = me.checkboxSelectionColumn = new checkColumnClass(ObjectHelper.assign({
                id           : `${me.id}-selection-column`,
                width        : me.features.rowReorder?.showGrip ? 70 : 56,
                field        : null,
                sortable     : false,
                filterable   : false,
                groupable    : false,
                hideable     : false,
                cellCls      : 'b-checkbox-selection',
                // Always put the checkcolumn in the first region
                region       : me.items?.[0]?.region,
                showCheckAll : selectionMode.showCheckAll,
                draggable    : false,
                resizable    : false,
                ariaLabel    : me.L('L{Checkbox.toggleSelection}'),
                widgets      : [{
                    type          : 'checkbox',
                    valueProperty : 'checked',
                    ariaLabel     : 'L{Checkbox.toggleRowSelect}'
                }]
            }, config), columns, { isSelectionColumn : true });

            col.meta.depth = 0;
            // This is assigned in Column.js for normal columns
            col._grid = me;

            // Override renderer to inject the rendered record's selected status into the value
            const checkboxRenderer = col.renderer;

            col.setData('renderer', renderData => {
                renderData.value = me.isSelected(renderData.record);
                checkboxRenderer.call(col, renderData);
            });

            col.ion({
                toggle    : 'onCheckChange',
                toggleAll : 'onCheckAllChange',
                thisObj   : me
            });

            columns.insert(me.checkboxSelectionColumnInsertIndex, col);
            columns.acceptChanges();
        }
    }

    // Used internally to get the index where to insert checkboxselectioncolumn
    // Default : Insert the checkbox after any rownumber column. If not there, -1 means in at 0.
    // If provided, insert at provided index
    get checkboxSelectionColumnInsertIndex() {
        const
            { columns } = this;
        let { checkboxIndex } = this.selectionMode;

        if (!checkboxIndex) {
            checkboxIndex = columns.indexOf(columns.findRecord('type', 'rownumber')) + 1;
        }
        else if (typeof checkboxIndex === 'string') {
            checkboxIndex = columns.indexOf(columns.getById(checkboxIndex));
        }

        return checkboxIndex;
    }

    beforeColumnsChange() {
        if (this.columns.count === 0) {
            this.deselectAll(false, true);
        }
    }

    afterColumnsChange({ type, action, changes, columns, column }) {
        const { _selectedCells } = this;

        if (_selectedCells?.length) {
            if (!columns && column) {
                columns = [column];
            }

            // Re-create selection on certain column changes
            if (type === 'move' || changes?.hidden || changes?.region || action === 'add' || action === 'remove') {
                // Need to refresh selected GridLocation objects. The column property will be calculated from the
                // columnIndex and result in a new visible column, that is why _column is used
                let selectedCells = _selectedCells.map(c => ({ id : c.id, columnId : c._column.id }));

                // Remove and hide, do not re-select everything
                if ((action === 'remove' || changes?.hidden?.value) && columns?.length) {
                    selectedCells = selectedCells.filter(cell => !columns.some(column => cell.columnId === column.id));
                }

                this.deselectAll(false, true);
                this.selectCells({ cells : selectedCells, scrollIntoView : false });
            }

        }
    }

    //endregion

    // region Events docs & Hooks

    /**
     * The selection has been changed.
     * @event selectionChange
     * @param {'select'|'deselect'} action `'select'`/`'deselect'`
     * @param {'row'|'cell'} mode `'row'`/`'cell'`
     * @param {Grid.view.Grid} source
     * @param {Core.data.Model[]} deselected The records deselected in this operation.
     * @param {Core.data.Model[]} selected The records selected in this operation.
     * @param {Core.data.Model[]} selection The records in the new selection.
     * @param {Grid.util.GridLocation[]} deselectedCells The cells deselected in this operation.
     * @param {Grid.util.GridLocation[]} selectedCells The cells selected in this operation.
     * @param {Grid.util.GridLocation[]} cellSelection The cells in the new selection.
     */

    /**
     * Fires before the selection changes. Returning `false` from a listener prevents the change
     * @event beforeSelectionChange
     * @preventable
     * @param {String} action `'select'`/`'deselect'`
     * @param {'row'|'cell'} mode `'row'`/`'cell'`
     * @param {Grid.view.Grid} source
     * @param {Core.data.Model[]} deselected The records to be deselected in this operation.
     * @param {Core.data.Model[]} selected The records to be selected in this operation.
     * @param {Core.data.Model[]} selection The records in the current selection, before applying `selected` and
     * `deselected`
     * @param {Grid.util.GridLocation[]} deselectedCells The cells to be deselected in this operation.
     * @param {Grid.util.GridLocation[]} selectedCells The cells to be selected in this operation.
     * @param {Grid.util.GridLocation[]} cellSelection  The cells in the current selection, before applying `selectedCells`
     * and `deselectedCells`
     */

    afterSelectionChange() {}

    afterSelectionModeChange() {}

    // endregion

    // region selectedRecordCollection

    changeSelectedRecordCollection(collection) {
        if (collection?.isCollection) {
            if (!collection.owner) {
                collection.owner = this;
            }

            return collection;
        }

        return Collection.new(collection, { owner : this });
    }

    updateSelectedRecordCollection(collection) {

        collection.ion({
            change  : 'onSelectedRecordCollectionChange',
            thisObj : this
        });
    }

    onSelectedRecordCollectionChange({ added = [], removed }) {
        if (this.selectedRecordCollection._fromSelection !== this) {
            // Filter out unselectable rows
            added = added.filter(row => this.isSelectable(row));
            this.performSelection({
                selectedCells     : [],
                deselectedCells   : [],
                selectedRecords   : added,
                deselectedRecords : removed
            });
        }
    }

    changeSelectedRecordCollectionSilent(fn) {
        this.selectedRecordCollection._fromSelection = this;
        const result = fn(this.selectedRecordCollection);
        delete this.selectedRecordCollection._fromSelection;
        return result;
    }

    // endregion

    // region Store

    bindStore(store) {
        this.detachListeners('selectionStoreFilter');

        store.ion({
            name    : 'selectionStoreFilter',
            filter  : 'onStoreFilter',
            thisObj : this
        });

        super.bindStore?.(store);
    }

    unbindStore(oldStore) {
        this.detachListeners('selectionStoreFilter');

        super.unbindStore(oldStore);
    }

    onStoreFilter({ source }) {
        const
            me              = this,
            // Look for selected records which is not in the store, use _selectedRows to avoid creating a new array
            deselect        = me._selectedRows.filter(record => source.indexOf(record, false, true) === -1),
            // Deselects
            selectionChange = me.prepareSelection(me.selectionMode.deselectFilteredOutRecords ? deselect : []);

        // If cell mode, always deselect cells
        if (me.isCellSelectionMode) {
            const { deselectedCells } = me.prepareSelection(me._selectedCells.filter(cell => !source.records.includes(cell.record)));
            if (deselectedCells?.length) {
                selectionChange.deselectedCells = (selectionChange.deselectedCells || []).concat(deselectedCells);
            }
        }

        if (selectionChange.deselectedCells.length || selectionChange.deselectedRecords.length) {
            // Trigger deselect event
            me.performSelection(selectionChange, false);
            me.updateCheckboxHeader();
        }
    }

    /**
     * Triggered from Grid view when the id of a record has changed.
     * Update the collection indices.
     * @private
     * @category Selection
     */
    onStoreRecordIdChange({ record, oldValue }) {
        // If the next mixin up the inheritance chain has an implementation, call it
        super.onStoreRecordIdChange?.(...arguments);

        const item = this.selectedRecordCollection.get(oldValue);

        // having the record registered by the oldValue means we need to rebuild indices
        if (item === record) {
            this.selectedRecordCollection.rebuildIndices();
        }
    }

    /**
     * Triggered from Grid view when records get removed from the store.
     * Deselects all records which have been removed.
     * @private
     * @category Selection
     */
    onStoreRemove({ action, records, isCollapse }) {
        // If the next mixin up the inheritance chain has an implementation, call it
        super.onStoreRemove?.(...arguments);

        if (!isCollapse && action !== 'filter') {
            this.deselectRemovedRecords(records);
        }
    }

    deselectRemovedRecords(records) {
        const
            me = this,
            // Only feed records that were actually selected in some way (row-selected or, for selectRecordOnCell,
            // present in the selected record collection). prepareSelection then resolves each and routes row-selected
            // ones to deselectedRecords and cell-selected ones to deselectedCellRecords, pruning the collection.
            deselectedRecords = records.filter(rec => me.isSelected(rec) || me.selectedRecordCollection.get(rec.id)),
            selectionChange   = me.prepareSelection(deselectedRecords);

        // If cell selection mode, also deselect any still-tracked cells for removed records (grid refreshes the UI)
        if (me.isCellSelectionMode) {
            const { deselectedCells } = me.prepareSelection(me.getSelectedCellsForRecords(records));
            if (deselectedCells?.length) {
                selectionChange.deselectedCells = (selectionChange.deselectedCells || []).concat(deselectedCells);
            }
        }

        if (selectionChange.deselectedRecords.length || selectionChange.deselectedCells.length || selectionChange.deselectedCellRecords.length) {
            me.performSelection(selectionChange);
        }
    }

    /**
     * Triggered from Grid view when the store changes. This might happen
     * if store events are batched and then resumed.
     * Deselects all records which have been removed.
     * @private
     * @category Selection
     */

    onStoreDataChange({ action, source : store, changes }) {
        const
            me                = this,
            { selectionMode } = me;
        let selectionChange;

        // If the next mixin up the inheritance chain has an implementation, call it
        super.onStoreDataChange?.(...arguments);

        if (action === 'pageLoad') {
            // on page load, clear selection if not `preserverSelectionOnPageChange` is true
            if (!selectionMode.preserveSelectionOnPageChange) {
                selectionChange = me.prepareSelection(null, null, true);
            }

            // For paged grid scenario, we need to update the check-all checkbox in the checkbox column header
            // as we move between store pages
            me.updateCheckboxHeader();
        }
        else if (action === 'clearchanges' && changes?.added?.length) {
            // Handle cleanup of selected records that were removed as part of a store.revertChanges call (which removes
            // events silently
            me.deselectRemovedRecords(changes.added);
        }
        else if (isDataLoadAction[action]) {
            const deselect = [];

            if (selectionMode.preserveSelectionOnDatasetChange === false) {
                selectionChange = me.prepareSelection(null, null, true);
            }
            else {
                // Update selected records
                const matchedRecords = me.changeSelectedRecordCollectionSilent(c => c.match(store.storage));
                // Use chunkedPush to avoid exceeding the maximum call stack size with large datasets
                ArrayHelper.chunkedPush(deselect, matchedRecords);

                for (const selectedCell of me._selectedCells) {
                    if (!store.getById(selectedCell.id)) {
                        deselect.push(selectedCell);
                    }
                }

                selectionChange = me.prepareSelection(deselect);
            }
        }

        if (selectionChange && (selectionChange.deselectAll || selectionChange.deselectedCells.length || selectionChange.deselectedRecords.length || selectionChange.selectedCells.length || selectionChange.selectedRecords.length)) {
            me.performSelection(selectionChange, false);
            me.updateCheckboxHeader();
        }
    }

    /**
     * Triggered from Grid view when all records get removed from the store.
     * Deselects all records.
     * @private
     * @category Selection
     */
    onStoreRemoveAll() {
        // If the next mixin up the inheritance chain has an implementation, call it
        super.onStoreRemoveAll?.();

        this.performSelection(this.prepareSelection(null, null, true), false);
    }

    //endregion

    // region Checkbox selection

    onCheckChange({ checked, record, checkbox }) {
        const
            me              = this,
            { multiSelect } = me.selectionMode,
            deselectAll     = !multiSelect && checked,
            deselect        = !deselectAll && !checked ? [record] : null,
            select          = checked ? [record] : null,
            // In row selection mode, checkbox and row Shift+Click range from the same anchor
            rangeStart      = me.isRowSelectionMode ? me._selectionStartCell : me._lastSelectionChecked;

        me._isCheckboxSelecting = true;

        // If checking a group header, select its children
        if (record.isGroupHeader && me.selectionMode.showCheckAllInGroupRows) {
            (checked ? select : deselect).splice(0, 1, ...record.groupChildren);
        }

        // Saves previously non-shift checked checkbox
        if (checked && !GlobalEvents.shiftKeyDown) {
            // Checking adds to the selection like a Ctrl+Click does, so the next range must not replace the previous one
            if (me.isRowSelectionMode) {
                me._selectionStartCell = me.normalizeCellContext({ id : record.id, columnId : me.checkboxSelectionColumn.id });
                me._shiftSelectRange   = null;
            }
            else {
                me._lastSelectionChecked = record;
            }
        }
        // Shift range select
        if (checked && multiSelect && rangeStart && GlobalEvents.shiftKeyDown) {
            me.performSelection(me.internalSelectRange(rangeStart, record, true));
        }
        // Regular selection, updates UI and triggers events
        else if (me.performSelection(me.prepareSelection(deselect, select, deselectAll, true)) === false) {
            // Need to manually reset checkbox in case outside world returns false from beforeSelectionChange
            checkbox.checked = !checkbox.checked;
        }

        me._isCheckboxSelecting = false;
    }

    // Update header checkbox
    updateCheckboxHeader() {
        const
            me = this,
            {
                selectionMode,
                checkboxSelectionColumn,
                store
            } = me;

        if (selectionMode.checkbox && checkboxSelectionColumn) {
            if (!me.hideHeaders && !me._isCheckAllSelecting &&
            selectionMode.showCheckAll && checkboxSelectionColumn.headerCheckbox
            ) {
                const allSelected = me.isAllRecordsSelected();

                if (checkboxSelectionColumn.headerCheckbox.checked !== allSelected) {
                    checkboxSelectionColumn.suspendEvents();
                    checkboxSelectionColumn.headerCheckbox.checked = allSelected;
                    checkboxSelectionColumn.resumeEvents();
                }
            }

            if (selectionMode.showCheckAllInGroupRows && store.groupRecords?.count) {
                const fullySelectedGroups = [...new Set(me.selectedRecords.map(r => r.instanceMeta(store).groupParent))].filter(g => g?.groupChildren?.every(c => me.isSelected(c)));

                checkboxSelectionColumn.suspendEvents();

                for (const groupRecord of store.groupRecords) {
                    const cell = me.getCell({ record : groupRecord, column : checkboxSelectionColumn });

                    if (cell) {
                        cell.widget.checked = fullySelectedGroups.includes(groupRecord);
                    }
                }

                checkboxSelectionColumn.resumeEvents();
            }
        }
    }

    // Overridden in Split.js
    isAllRecordsSelected() {
        return this.store.count && !this.store.some(record => this.isSelectable(record) && !this.isSelected(record));
    }

    onCheckAllChange({ checked }) {
        const me = this;

        me._isCheckboxSelecting = me._isCheckAllSelecting = true;
        me[checked ? 'selectAll' : 'deselectAll'](me.store.isPaged && me.selectionMode.preserveSelectionOnPageChange);
        me._isCheckboxSelecting = me._isCheckAllSelecting = false;
    }

    //endregion

    // region Selection drag

    // Hook for SalesForce-code to overwrite
    get selectionDragMouseEventListenerElement() {
        return this.element.getRootNode();
    }

    // Creates new selection range on mouseover. Listener is initiated on mousedown
    onSelectionDrag(event) {
        const
            me                                            = this,
            isScroll                                      = event.type === 'scroll',
            { _selectionStartCell, lastPointerMoveEvent } = me;

        if (isScroll && !me._isSelectionDragging) {
            return;
        }

        // If we're here but no mouse button is down, cancel
        if (!GlobalEvents.isMouseDown()) {
            me.onSelectionEnd();
        }

        // No start cell, ignore
        if (!_selectionStartCell) {
            return;
        }

        const
            { items, _lastSelectionDragRegion } = me;

        let cellData, region, cellSelector;

        if (isScroll && lastPointerMoveEvent) {
            const
                el     = document.elementFromPoint(lastPointerMoveEvent.clientX, lastPointerMoveEvent.clientY),
                cellEl = el?.closest('.b-grid-cell');

            if (cellEl) {
                region = me._lastSelectionDragRegion;
                cellSelector = me.normalizeCellContext({
                    columnId : cellEl.dataset.columnId,
                    record   : me.store.getById(cellEl.parentElement.dataset.id)
                });
            }
        }
        else {
            cellData = me.getCellDataFromEvent(event, true);
            region = cellData?.column.region;
            cellSelector = cellData?.cellSelector && me.normalizeCellContext(cellData.cellSelector);

            if (cellData) {
                me.lastPointerMoveEvent = event;
            }
        }

        // If mouse enters new cell
        if (cellSelector && !cellSelector.equals(me._lastSelectionDragCell, true)) {
            if (!me._isSelectionDragging) {
                // When starting selection, start monitoring for near edge scrolling
                me.enableScrollingCloseToEdges(items);
            }

            // If we start a new selection drag on already selected cell, the default (de)selection is delayed until
            // mouseup. If we detect that a drag range is indeed what the user intends, deselect immediately
            if (me._clearSelectionOnSelectionDrag && !_selectionStartCell.equals(cellSelector, true)) {
                me.deselectAll();
                delete me._clearSelectionOnSelectionDrag;
            }

            // A grid with multiple regions need to handle selection and scrolling moving between regions
            if (_lastSelectionDragRegion && region !== _lastSelectionDragRegion) {
                const
                    leavingSubGrid         = me.subGrids[_lastSelectionDragRegion],
                    enteringSubGrid        = me.subGrids[region],
                    leavingScrollable      = leavingSubGrid.scrollable,
                    enteringScrollable     = enteringSubGrid.scrollable,
                    goingForward           = items.indexOf(leavingSubGrid) - items.indexOf(enteringSubGrid) < 0,
                    activeHorizontalScroll = me.scrollManager._activeScroll?.horizontal;

                // Immediately scrolls an entering subgrid to either start or end depending on direction
                enteringScrollable.x = goingForward ? 0 : enteringScrollable.maxX;

                // The subgrid being left should end up scrolled to its edge in the drag direction
                if (goingForward ? leavingScrollable.x < leavingScrollable.maxX - 1 : leavingScrollable.x > 1) {
                    // Normally it is being scrolled there gradually by the scroll manager's edge scrolling,
                    // wait for that to finish before accepting the region switch
                    if (activeHorizontalScroll?.element === leavingScrollable.element) {
                        return;
                    }

                    // But a fast pointer move can cross into another region without ever triggering edge
                    // scrolling of the subgrid it left. Scroll it to its edge directly in that case, waiting
                    // would deadlock since no scroll is in progress
                    leavingScrollable.x = goingForward ? leavingScrollable.maxX : 0;
                }

                // Forces the previous subgrid to stop reserving horizontal scroll
                if (activeHorizontalScroll && activeHorizontalScroll.element !== enteringScrollable.element) {
                    activeHorizontalScroll.stopScroll(true);
                }
            }

            me._lastSelectionDragRegion = region;
            me._lastSelectionDragCell = cellSelector;
            me._isSelectionDragging = true;

            const selectionChange = me._lastSelectionDragChange = me.internalSelectRange(_selectionStartCell,
                cellSelector,
                me.isRowNumberSelecting(cellSelector) || me.isRowNumberSelecting(_selectionStartCell)
            );

            // As selection at this point is UI only, we don't want to affect already selected records
            selectionChange.deselectedCells = selectionChange.deselectedCells.filter(cell => !me.isCellSelected(cell));
            selectionChange.deselectedRecords = selectionChange.deselectedRecords.filter(record => !me.isSelected(record));

            // Clear any hovered cell
            me.hoveredCell = null;

            // selectionChange event fires onSelectionEnd
            me.refreshGridSelectionUI(selectionChange);

            /**
             * Fires while drag selecting. UI will update with current range, but the cells will not be selected until
             * mouse up. This event can be listened for to perform actions while drag selecting.
             * @event dragSelecting
             * @param {Grid.view.Grid} source
             * @param {GridLocationConfig[]|Grid.util.GridLocation[]} selectedCells The cells that is currently being dragged over
             * @param {Core.data.Model[]} selectedRecords The records that is currently being dragged over
             */
            me.trigger('dragSelecting', selectionChange);
        }
    }

    // Tells onSelectionDrag that it's not dragging any longer
    onSelectionEnd() {
        const
            me         = this,
            lastChange = me._lastSelectionDragChange;

        if (me._isSelectionDragging && !me._selectionStartCell.equals(me._lastSelectionDragCell, true) && lastChange) {
            me.performSelection(lastChange, false);
        }

        me.disableScrollingCloseToEdges(me.items);

        me._isSelectionDragging = false;
        me._lastSelectionDragChange = me._lastSelectionDragCell = me._lastSelectionDragRegion = null;

        // Remove listeners
        me.removeDragListeners();
    }

    removeDragListeners() {
        const { _selectionListenersDetachers } = this;

        if (_selectionListenersDetachers) {
            _selectionListenersDetachers.selectiondrag?.();
            delete this._selectionListenersDetachers.selectiondrag;
        }
    }

    // endregion

    // region Column selection

    onHandleElementClick(event) {
        const me = this;

        // If rownumber column is clicked, toggle selectAll
        if (me.selectionMode.rowNumber && event.target.closest('.b-row-number-header')) {
            event.handled = true;
            if (me.store.count && me.store.some(record => !me.isSelected(record))) {
                me.selectAll();
            }
            else {
                me.deselectAll();
            }

        }
        // In column selection mode, and we clicked a header, the column should be selected (but not when clicking icon)
        else if (me.selectionMode.column && event.target.matches('.b-grid-header-text-content,.b-grid-header-text')) {
            event.handled = true;
            me.selectColumn(event, event.ctrlKey);
        }

        super.onHandleElementClick(event);
    }

    selectColumn(event, addToSelection = false) {
        const
            me           = this,
            { store }    = me,
            { columnId } = me.getHeaderDataFromEvent(event);

        if (store.count === 0) {
            return;
        }
        // internalSelectRange uses this to remember last range, we have no need for that here
        me._shiftSelectRange = null;

        if (!event.shiftKey) {
            me._shiftSelectColumn = columnId;
        }
        const
            fromColumnId    = (event.shiftKey && me._shiftSelectColumn) || columnId,
            selectionChange = me.internalSelectRange(
                me.normalizeCellContext({ id : store.first.id, columnId : fromColumnId }),
                me.normalizeCellContext({ id : store.last.id, columnId })
            );

        // If we are selecting a column that is already selected, deselect it
        if (addToSelection && !selectionChange.selectedCells.some(sc => !me.isCellSelected(sc))) {
            selectionChange.deselectedCells = selectionChange.selectedCells;
            selectionChange.selectedCells = [];
        }

        if (!addToSelection) {
            selectionChange.deselectedCells = me._selectedCells;
        }
        me.cleanSelectionChange(selectionChange);
        me.performSelection(selectionChange);
    }

    // endregion

    // region Public row/record selection

    /**
     * Checks whether a row is selected. Will not check if any of a row's cells are selected.
     * @param {GridLocationConfig|Grid.util.GridLocation|String|Number|Core.data.Model} cellSelectorOrId Cell selector { id: x, column: xx } or row
     * id, or record
     * @returns {Boolean} true if row is selected, otherwise false
     * @category Selection
     */
    isSelected(cellSelectorOrId) {
        // This is here so that when a fully selected group header gets rendered, it's checkbox is checked
        if (this.selectionMode.showCheckAllInGroupRows && cellSelectorOrId?.isGroupHeader) {
            return cellSelectorOrId.groupChildren.every(rec => this.isSelected(rec));
        }

        // Not a selected cell, check records
        if (cellSelectorOrId?.id) {
            cellSelectorOrId = cellSelectorOrId.id;
        }

        if (validIdTypes[typeof cellSelectorOrId]) {
            // Use _selectedRows to avoid creating a new array
            return this._selectedRows.some(rec => rec.id === cellSelectorOrId);
        }

        return false;
    }

    /**
     * Checks whether a cell is selected.
     * @param {GridLocationConfig|Grid.util.GridLocation} cellSelector Cell selector { id: x, column: xx }
     * @param {Boolean} includeRow to also check if row is selected
     * @returns {Boolean} true if cell is selected, otherwise false
     * @category Selection
     */
    isCellSelected(cellSelector, includeRow) {
        cellSelector = this.normalizeCellContext(cellSelector);
        return (this.isCellSelectionMode && this._selectedCells.some(cell => cellSelector.equals(cell, true))) ||
            (includeRow && this.isSelected(cellSelector));
    }

    /**
     * Checks whether a cell or row can be selected.
     * @param {Core.data.Model|GridLocationConfig|Grid.util.GridLocation|String|Number} recordCellOrId Record or cell or record id
     * @returns {Boolean} true if cell or row can be selected, otherwise false
     * @category Selection
     */
    isSelectable(recordCellOrId) {
        return this.normalizeCellContext({ id : recordCellOrId.id || recordCellOrId }).isSelectable;
    }

    /**
     * The last selected record. Set to select a row or use Grid#selectRow. Set to null to
     * deselect all
     * @member {Core.data.Model}
     * @category Selection
     */
    get selectedRecord() {
        return this.selectedRecords[this.selectedRecords.length - 1] || null;
    }

    set selectedRecord(record) {
        this.selectRow({ record });
    }

    /**
     * Selected records.
     *
     * If {@link #config-selectionMode deselectFilteredOutRecords} is `false` (default) this will include selected
     * records which has been filtered out.
     *
     * If {@link #config-selectionMode preserveSelectionOnPageChange} is `true` (defaults to `false`) this will include
     * selected records on all pages.
     *
     * If {@link #config-selectionMode selectRecordOnCell} is `true` (default) this will include any record which has at
     * least one cell selected.
     *
     * Can be set as array of ids:
     *
     * ```javascript
     * grid.selectedRecords = [1, 2, 4, 6]
     * ```
     *
     * @member {Core.data.Model[]}
     * @accepts {Core.data.Model[]|Number[]}
     * @category Selection
     */
    get selectedRecords() {
        return this.selectedRecordCollection.values;
    }

    set selectedRecords(selectedRecords) {
        this.selectRows(selectedRecords);
    }

    /**
     * Selected records. Records selected via cell selection is excluded.
     *
     * If {@link #config-selectionMode deselectFilteredOutRecords} is `false` (default) this will include selected
     * records which has been filtered out.
     *
     * If {@link #config-selectionMode preserveSelectionOnPageChange} is `true` (defaults to `false`) this will include
     * selected records on all pages.
     *
     * if {@link #config-selectionMode selectRecordOnCell} is `false` this will return same records as
     * {@link #property-selectedRecords}.
     *
     * Can be set as array of ids:
     *
     * ```javascript
     * grid.selectedRecords = [1, 2, 4, 6]
     * ```
     *
     * @member {Core.data.Model[]}
     * @accepts {Core.data.Model[]|Number[]}
     * @category Selection
     */
    get selectedRows() {
        return [...this._selectedRows];
    }

    set selectedRows(selectedRows) {
        this.selectRows(selectedRows);
    }

    /**
     * Removes and adds records to/from the selection at the same time. Analogous to the `Array` `splice` method.
     *
     * Note that if records that are specified for removal are also in the `toAdd` array, then those records are *not*
     * removed and then appended. They remain in the same position relative to all remaining records.
     *
     * @param {Number} index Index at which to remove a block of records. Only valid if the second, `toRemove` argument
     * is a number.
     * @param {Core.data.Model[]|Number} toRemove Either the number of records to remove starting at the passed `index`,
     * or an array of records to remove (If an array is passed, the `index` is ignored).
     * @param  {Core.data.Model[]|Core.data.Model} toAdd A record, or an array of records to add.
     * @category Selection
     */
    spliceSelectedRecords(index, toRemove, toAdd) {
        const me = this;

        if (typeof toRemove == 'number') {
            const select = [...me.selectedRecords];
            select.splice(index, toRemove, ...ArrayHelper.asArray(toAdd));
            me.performSelection(me.prepareSelection(null, select, true, true));
        }
        else {
            // Just add and remove
            me.performSelection(me.prepareSelection(toRemove, toAdd, false, true));
        }
    }

    /**
     * Select one row
     * @param {Object|Core.data.Model|String|Number} options A record or id to select or a config object describing the
     * selection
     * @param {Core.data.Model|String|Number} options.record Record or record id, specifying null will deselect all
     * @param {Grid.column.Column} [options.column] The column to scroll into view if `scrollIntoView` is not specified as
     * `false`. Defaults to the grid's first column.
     * @param {Boolean|BryntumScrollOptions} [options.scrollIntoView] Specify `false` to prevent row from being scrolled into view
     * @param {Boolean} [options.addToSelection] Specify `true` to add to selection, defaults to `false` which replaces
     * @fires selectionChange
     * @category Selection
     */
    selectRow(options) {
        // Make sure we have an object
        if (typeof options === 'number' || typeof options === 'string' || options.isModel || !('record' in options)) {
            options = {
                records : [options]
            };
        }

        // scrollIntoView is default here
        ObjectHelper.assignIf(options, {
            scrollIntoView : true
        });

        this.selectRows(options);
    }

    /**
     * Select one or more rows
     * @param {Object|Core.data.Model[]|String[]|Number[]} options An array of records or ids for a record or a
     * config object describing the selection
     * @param {Core.data.Model[]|String[]|Number[]} options.records An array of records or ids for a record
     * @param {Grid.column.Column} options.column The column to scroll into view if `scrollIntoView` is not specified as
     * `false`. Defaults to the grid's first column.
     * @param {Boolean|BryntumScrollOptions} [options.scrollIntoView] Specify `false` to prevent row from being scrolled into view
     * @param {Boolean} [options.addToSelection] Specify `true` to add to selection, defaults to `false` which replaces
     * @category Selection
     */
    selectRows(options) {
        // Got a single or an array of records/ids, convert it to an object
        if (!options || Array.isArray(options) || options.isModel || typeof options === 'number' ||
            (!('records' in options) && !('record' in options))
        ) {
            options = {
                records : ArrayHelper.asArray(options) || []
            };
        }

        const
            me        = this,
            { store } = me,
            toSelect  = [],
            {
                records        = options.record ? [options.record] : [], // Got a record instead of records
                column         = me.columns.visibleColumns[0], // Default
                scrollIntoView,
                addToSelection = arguments[1] // Backwards compatibility
            }         = options;

        for (const r of records) {
            const record = store.getById(r);
            if (record) {
                toSelect.push(record);
            }
        }

        if (!addToSelection) {
            me._shiftSelectRange = null;
        }

        me.performSelection(me.prepareSelection(null, toSelect, !addToSelection, true));

        if (toSelect.length && scrollIntoView) {
            return me.scrollRowIntoView(toSelect[0].id, {
                ...scrollIntoView,
                column
            });
        }
    }

    /**
     * This selects all rows. If store is filtered, this will merge the selection of all visible rows with any selection
     * made prior to filtering.
     * @privateparam {Boolean} [silent] Pass `true` not to fire any event upon selection change
     * @category Selection
     * @non-lazy-load
     */
    selectAll(silent = false) {
        const
            { store } = this,
            records   = (store.isGrouped ? store.getAllDataRecords() : store.records).filter(r => !r.isSpecialRow);

        // If store is grouped, store.records excludes collapsed records and allRecords excludes filtered out records
        // Else, store records holds what we're after
        this.performSelection(this.prepareSelection(null, records, false, true), true, silent);
    }

    /**
     * Deselects all selected rows and cells. If store is filtered, this will unselect all visible rows only. Any
     * selections made prior to filtering remains.
     * @param {Boolean} [removeCurrentRecordsOnly] Pass `false` to clear all selected records, and `true` to only
     * clear selected records in the current set of records
     * @param {Boolean} [silent] Pass `true` not to fire any event upon selection change
     * @category Selection
     */
    deselectAll(removeCurrentRecordsOnly = false, silent = false) {
        const
            { store } = this,
            records   = removeCurrentRecordsOnly
                ? (store.isGrouped ? store.getAllDataRecords() : store.records).filter(r => !r.isSpecialRow) : null;

        this.performSelection(this.prepareSelection(records, null, !removeCurrentRecordsOnly), true, silent);
    }

    /**
     * Deselect one row
     * @param {Core.data.Model|String|Number} recordOrId Record or an id for a record
     * @category Selection
     */
    deselectRow(record) {
        this.deselectRows(record);
    }

    /**
     * Deselect one or more rows
     * @param {Core.data.Model|String|Number|Core.data.Model[]|String[]|Number[]} recordOrIds An array of records or ids
     * for a record
     * @category Selection
     */
    deselectRows(recordsOrIds) {
        // Ignore any non-existing row records passed
        const records = this.store.getByIds(recordsOrIds);

        this.performSelection(this.prepareSelection(records));
    }

    /**
     * Selects rows corresponding to a range of records (from fromId to toId)
     * @param {String|Number} fromId
     * @param {String|Number} toId
     * @category Selection
     */
    selectRange(fromId, toId) {
        const
            me        = this,
            { store } = me,
            selection = me.internalSelectRange(store.getById(fromId), store.getById(toId), true);

        me._shiftSelectRange = null; // For below function to not replace last range with new one
        me.performSelection(selection);
    }

    // endregion

    // region Public cell selection

    /**
     * In cell selection mode, this will get the cell selector for the (last) selected cell. Set to an available cell
     * selector to select only that cell. Or use {@link #function-selectCell()} instead.
     * @member {Grid.util.GridLocation}
     * @accepts {Grid.util.GridLocation|GridLocationConfig}
     * @category Selection
     */
    get selectedCell() {
        return this._selectedCells[this._selectedCells.length - 1];
    }

    set selectedCell(cellSelector) {
        this.selectCells([cellSelector]);
    }

    /**
     * In cell selection mode, this will get the cell selectors for all selected cells. Set to an array of available
     * cell selectors. Or use {@link #function-selectCells()} instead.
     * @member {Grid.util.GridLocation[]}
     * @accepts {Grid.util.GridLocation[]|GridLocationConfig[]}
     * @category Selection
     */
    get selectedCells() {
        return [...this._selectedCells];
    }

    set selectedCells(cellSelectors) {
        this.selectCells(cellSelectors);
    }

    /**
     * CSS selector for the currently selected cell. Format is "[data-index=index] [data-column-id=column]".
     * @type {String}
     * @category Selection
     * @readonly
     */
    get selectedCellCSSSelector() {
        const
            cell = this.selectedCell,
            row  = cell && this.getRowById(cell.id);

        if (!cell || !row) return '';

        return `[data-index=${row.dataIndex}] [data-column-id=${cell.columnId}]`;
    }

    /**
     * If in cell selection mode, this selects one cell. If not, this selects the cell's record.
     * @param {GridLocationConfig|Grid.util.GridLocation|Object} options A cell selector ({ id: rowId, columnId: 'columnId' }) or a config object
     * @param {GridLocationConfig|Grid.util.GridLocation} options.cell  A cell selector ({ id: rowId, columnId: 'columnId' })
     * @param {Boolean|BryntumScrollOptions} [options.scrollIntoView] Specify `false` to prevent row from being scrolled into view
     * @param {Boolean} [options.addToSelection] Specify `true` to add to selection, defaults to `false` which replaces
     * @param {Boolean} [options.silent] Specify `true` to not trigger any events when selecting the cell
     * @returns {Grid.util.GridLocation} Cell selector
     * @fires selectionChange
     * @category Selection
     */
    selectCell(options) {
        // Got a cell selector as first argument
        if (('id' in options) || ('row' in options) || ('record' in options) || ('rowIndex' in options)) {
            options = {
                cell : options
            };

            // Arguments backward's compability
            options = {
                scrollIntoView : arguments[1],
                addToSelection : arguments[2],
                silent         : arguments[3],
                ...options
            };
        }

        return this.selectCells(options)?.[0];
    }

    /**
     * If in cell selection mode, this selects a number of cells. If not, this selects corresponding records.
     * @param {Object|GridLocationConfig[]|Grid.util.GridLocation[]} options An array of cell selectors ({ id: rowId, columnId: 'columnId' }) or a config
     * object
     * @param {GridLocationConfig[]|Grid.util.GridLocation[]} options.cells An array of cell selectors { id: rowId, columnId: 'columnId' }
     * @param {Boolean|BryntumScrollOptions} [options.scrollIntoView] Specify `false` to prevent row from being scrolled into view
     * @param {Boolean} [options.addToSelection] Specify `true` to add to selection, defaults to `false` which replaces
     * @param {Boolean} [options.silent] Specify `true` to not trigger any events when selecting the cell
     * @returns {Grid.util.GridLocation[]} Cell selectors
     * @fires selectionChange
     * @category Selection
     */
    selectCells(options) {
        // Got a cell selector array as first argument
        if (Array.isArray(options)) {
            options = {
                cells : options
            };
        }

        const
            me              = this,
            {
                cells          = options.cell ? [options.cell] : [], // Got a cell instead of cells
                scrollIntoView = true,
                addToSelection = false,
                silent         = false
            }               = options,
            selectionChange = me.prepareSelection(null, cells, !addToSelection);

        if (!addToSelection) {
            me._shiftSelectRange = null;
        }

        me.performSelection(selectionChange, true, silent);

        if (scrollIntoView) {
            me.scrollRowIntoView(cells[0].id, {
                ...scrollIntoView,
                column : cells[0].columnId
            });
        }

        return me.isCellSelectionMode ? selectionChange.selectedCells : selectionChange.selectedRecords;
    }

    /**
     * If in cell selection mode, this deselects one cell. If not, this deselects the cell's record.
     * @param {GridLocationConfig|Grid.util.GridLocation} cellSelector
     * @returns {Grid.util.GridLocation} Normalized cell selector
     * @category Selection
     */
    deselectCell(cellSelector) {
        return this.deselectCells([cellSelector])?.[0];
    }

    /**
     * If in cell selection mode, this deselects a number of cells. If not, this deselects corresponding records.
     * @param {GridLocationConfig[]|Grid.util.GridLocation[]} cellSelectors
     * @returns {Grid.util.GridLocation[]} Normalized cell selectors
     * @category Selection
     */
    deselectCells(cellSelectors) {
        const selectionChange = this.prepareSelection(cellSelectors);
        this.performSelection(selectionChange);
        return this.isCellSelectionMode ? selectionChange.deselectedCells : selectionChange.deselectedRecords;
    }

    // Used by keymap to toggle selection of currently focused cell.
    toggleSelection(keyEvent) {
        const
            me          = this,
            {
                _focusedCell,
                selectionMode
            }           = me,
            isRowNumber = me.isRowNumberSelecting(_focusedCell),
            isSelected  = me.isCellSelected(_focusedCell, true);

        // Only if keyboardNavigation selection is deactivated and were not focusing an actionable cell
        if (selectionMode.selectOnKeyboardNavigation === true || _focusedCell.isActionable) {
            // Return false to ley keyMap know we didn't handle this event
            return false;
        }

        me.performSelection(
            me.prepareSelection(
                isSelected ? _focusedCell : null,
                isSelected ? null : _focusedCell,
                !selectionMode.multiSelect,
                isRowNumber
            ));

        // Space key has preventDefault = false somewhere
        keyEvent.preventDefault();
    }

    /**
     * Selects a range of cells, from a cell selector (`GridLocation`) to another
     * @param {Grid.util.GridLocation|GridLocationConfig} from
     * @param {Grid.util.GridLocation|GridLocationConfig} to
     * @category Selection
     */
    selectCellRange(from, to) {
        this.performSelection(this.internalSelectRange(from, to));
    }

    // endregion

    // region Private convenience functions & properties
    getSelection() {
        if (this.isRowSelectionMode) {
            return this.selectedRecords;
        }
        else {
            return this.selectedCells;
        }
    }

    // Makes sure the same record or cell isn't deselected and selected at the same time. Selection will take precedence
    cleanSelectionChange(selectionChange) {
        const
            {
                deselectedRecords,
                deselectedCells,
                selectedCells,
                deselectedCellRecords
            }                     = selectionChange,
            selectedRecordIds     = selectionChange.selectedRecords?.map(r => r.id),
            selectedCellRecordIds = selectionChange.selectedCellRecords?.map(r => r.id);

        // Filter out records which is both selected and deselected
        if (deselectedRecords?.length && selectedRecordIds?.length) {
            selectionChange.deselectedRecords = deselectedRecords.filter(dr => !selectedRecordIds.includes(dr.id));
        }

        // Filter out cells which is both selected and deselected
        if (deselectedCells?.length && selectedCells?.length) {
            selectionChange.deselectedCells = deselectedCells.filter(dc => !selectedCells.some(sc => dc.equals(sc, true)));
        }

        // Filter out cell-selected records that is being selected
        if (deselectedCellRecords.length && (selectedCellRecordIds.length || selectedRecordIds?.length)) {
            selectionChange.deselectedCellRecords = deselectedCellRecords.filter(dcr => {
                return !selectedCellRecordIds.includes(dcr.id) && !selectedRecordIds.includes(dcr.id);
            });
        }

        return selectionChange;
    }

    getSelectedCellsForRecords(records) {
        return this._selectedCells.filter(cell => cell.id && records.some(record => record.id === cell.id));
    }

    delayUntilMouseUp(fn) {
        // Using selectionDragMouseEventListenerElement because of SalesForce override
        const detacher = EventHelper.on({
            element : this.selectionDragMouseEventListenerElement,
            blur    : ev => fn(ev, detacher),
            mouseup : ev => fn(ev, detacher),
            thisObj : this,
            once    : true
        });
    }

    get isRowSelectionMode() {
        return !this.isCellSelectionMode;
    }

    get isCellSelectionMode() {
        return this.selectionMode.cell === true;
    }

    // Checks if rowNumber is activated and that the cellselector is of type rownumber
    isRowNumberSelecting({ column : { type } }) {
        return this.selectionMode.rowNumber && (type === 'rownumber' || type === 'sequence');
    }

    selectionShouldIncludeChildren(record) {
        const { includeChildren, multiSelect } = this.selectionMode;

        return (includeChildren === 'always' || (includeChildren === true && this._isCheckboxSelecting)) &&
            multiSelect && !record.isLeaf && record.allChildren?.length;
    }

    // endregion

    //region Navigation

    // Used by keyMap to extend selection range
    extendSelectionLeft() {
        this.extendSelection('Left');
    }

    // Used by keyMap to extend selection range
    extendSelectionRight() {
        this.extendSelection('Right');
    }

    // Used by keyMap to extend selection range
    extendSelectionUp() {
        this.extendSelection('Up');
    }

    // Used by keyMap to extend selection range
    extendSelectionDown() {
        this.extendSelection('Down');
    }

    // Used by keyMap to extend selection range
    extendSelection(dir) {
        this._isKeyboardRangeSelecting = true;
        this['navigate' + dir]();
        this._isKeyboardRangeSelecting = false;
    }

    // Called from GridNavigation on mouse or keyboard events
    // Single entry point for all default user selection actions
    onCellNavigate(me, fromCellSelector, toCellSelector, doSelect) {
        const
            {
                selectionMode,
                _selectionListenersDetachers
            }                             = me,
            {
                multiSelect,
                alwaysMultiSelect,
                deselectOnClick,
                dragSelect
            }                             = selectionMode,
            { ctrlKeyDown, shiftKeyDown } = GlobalEvents,
            isMouseLeft                   = GlobalEvents.isMouseDown(),
            isMouseRight                  = GlobalEvents.isMouseDown(2),
            currentEvent                  = GlobalEvents.currentMouseDown || GlobalEvents.currentKeyDown;

        // To be sure we got Locations
        toCellSelector = me.normalizeCellContext(toCellSelector);

        if (
            // No-op if nothing to select
            !toCellSelector?.record ||
            me.selectionDisabled ||
            !doSelect ||
            // Do not affect selection if navigating into header row.
            toCellSelector.rowIndex === -1 ||
            toCellSelector.record?.isGroupHeader ||
            // Don't allow keyboard selection if keyboardNavigation is deactivated
            (currentEvent?.fromKeyMap && !selectionMode.selectOnKeyboardNavigation) ||
            // CheckColumn events are handled by the CheckColumn itself.
            me.columns.getById(toCellSelector.columnId) === me.checkboxSelectionColumn ||
            selectionMode.checkboxOnly ||
            // Don't select if event was handled elsewhere
            (currentEvent?.handled === true && !me._fromFocusCell)
        ) {
            return;
        }

        // Save adding state unless shift key
        if (!shiftKeyDown) {
            me._isAddingToSelection = (ctrlKeyDown || alwaysMultiSelect) && multiSelect;
            me._selectionStartCell = toCellSelector; // To be able to begin a new range
        }
        // If shift is pressed but no anchor exists yet, establish one
        else if (!me._selectionStartCell) {
            me._selectionStartCell = toCellSelector;
        }

        // Flags that it's possible for onSelectDrag to apply its logic if the right conditions are met
        // (preventDragSelect is set by RowReorder if mousedown on the grip with gripOnly configured. also set in
        // DragCreateBase and EventDragSelect)
        if (multiSelect && dragSelect && isMouseLeft && !_selectionListenersDetachers.selectiondrag && !me.preventDragSelect) {
            _selectionListenersDetachers.selectiondrag = EventHelper.on({
                name    : 'selectiondrag',
                element : me.selectionDragMouseEventListenerElement,
                blur    : 'onSelectionEnd',
                mouseup : {
                    handler : 'onSelectionEnd',
                    element : globalThis
                },
                mousemove : 'onSelectionDrag',
                thisObj   : me
            });
        }

        me.preventDragSelect = false;

        const
            startCell = me._selectionStartCell,
            adding    = me._isAddingToSelection;

        // Select range on shiftKey
        if (((shiftKeyDown && isMouseLeft) || me._isKeyboardRangeSelecting) && startCell && multiSelect) {
            me.performSelection(
                me.internalSelectRange(
                    startCell,
                    toCellSelector,
                    me.isRowNumberSelecting(startCell, toCellSelector)
                )
            );
        }
        else {
            let delay             = false,
                continueSelecting = true,
                deselect;

            // If current is already selected
            if (me.isCellSelected(toCellSelector, true)) {
                // Do nothing if we right-clicked already selected row/cell
                if (isMouseRight) {
                    return;
                }
                // Deselect current if selected and multiselecting or if deselectOnClick is true
                if ((adding || deselectOnClick)) {
                    deselect = [toCellSelector];
                    continueSelecting = false; // Only deselect at this code path
                }
                // If this is only row or cell that's selected
                else if (me.selectedRecords.length + (me.isCellSelectionMode ? me._selectedCells.length : 0) <= 1) {
                    // Should stay selected, do no more
                    return;
                }
                // Delay if click a selected cell which will be deselected (for dragging)
                delay = deselectOnClick || multiSelect;
            }

            // deselect all if not multiselecting
            if (!deselect && !adding) {
                deselect = null;
                // Set flag so that dragselection functionality know to clear selection if needed
                if (dragSelect && delay && _selectionListenersDetachers.selectiondrag) {
                    me._clearSelectionOnSelectionDrag = true;
                }
            }

            // Wrapping selection in a function to be called either directly or on mouse up
            const finishSelection = (mouseUpEvent, detacher) => {
                detacher?.();

                if (DragHelper.dragging) {
                    return;
                }
                if (mouseUpEvent?.target?.nodeType === Node.ELEMENT_NODE) {
                    // If we are waiting for mouseUp and have moved to a different cell, abort selection change
                    const mouseUpSelector = new GridLocation(mouseUpEvent.target);
                    if (mouseUpSelector?.grid && !mouseUpSelector.equals(toCellSelector, true)) {
                        return;
                    }
                }

                if (!shiftKeyDown) {
                    me._shiftSelectRange = null; // Clear any previous range selected
                }

                me.performSelection(
                    me.prepareSelection(
                        deselect,
                        continueSelecting && [toCellSelector],
                        deselect === null,
                        continueSelecting && me.isRowNumberSelecting(toCellSelector)
                    )
                );
            };

            if (me.features.rowReorder?.isDragging) {
                return;
            }
            // Delay doing the selection until mouse up for allowing drag of row in certain cases
            if (delay) {
                me.delayUntilMouseUp(finishSelection);
            }
            else {
                finishSelection();
            }
        }
    }

    // endregion

    // region Internal selection & deselection functions

    /**
     * Used internally to prepare a number of cells or records for selection/deselection depending on if cell
     * selectionMode is activated. This function will not select/deselect anything by itself
     * (that's done in performSelection).
     * @param {GridLocationConfig[]|Core.data.Model[]} cellSelectorsToDeselect Array of cell selectors or records.
     * @param {GridLocationConfig[]|Core.data.Model[]} cellSelectorsToSelect Array of cell selectors or records.
     * @param {Boolean} deselectAll Set to `true` to clear all selected records and cells.
     * @param {Boolean} forceRecordSelection Set to `true` to force record selection even if cell selection is active.
     * @returns {Object} selectionChange object to use for UI update
     * @private
     * @category Selection
     */
    prepareSelection(cellSelectorsToDeselect, cellSelectorsToSelect, deselectAll = false, forceRecordSelection = false) {
        const
            me = this,
            {
                _isSelectionDragging : isDragging,
                store
            }                     = me,
            {
                includeParents,
                selectRecordOnCell
            }                     = me.selectionMode,
            selectedCells         = [],
            deselectedCells       = deselectAll ? me._selectedCells : [],
            selectedRecords       = [],
            deselectedRecords     = deselectAll ? me._selectedRows : [],
            deselectedRecordIndex = ArrayHelper.keyBy(deselectedRecords, 'id', () => 1), // For performance
            deselectedCellRecords = deselectAll ? me.selectedRecords.filter(r => !deselectedRecordIndex[r.id]) : [];
        let selectedCellRecords   = [];

        if (!deselectAll && cellSelectorsToDeselect) {
            for (const selector of ArrayHelper.asArray(cellSelectorsToDeselect)) {
                const
                    cellSelector = me.normalizeCellContext(selector),
                    // Deselect must use `_record` not the `.record` getter (which resolves removed records to the wrong row); intentionally asymmetric with the select branch below — do not unify (#13350)
                    record = cellSelector?._record
                        || (selector.isModel ? selector : (store.getById(cellSelector.id) || me.selectedRecordCollection.get(cellSelector.id)));

                if (cellSelector.isSpecialRow) {
                    continue;
                }

                deselectedCells.push(cellSelector);

                if (record && !deselectedRecordIndex[record.id]) {
                    // When dragging, this path is taken but nothing is actually selected until mouseup
                    // So should check if selected for dragselection (until mouseup)
                    if (isDragging || me.isSelected(record)) {
                        deselectedRecords.push(record);
                        deselectedRecordIndex[record.id] = 1;
                    }
                    // If not directly selected, but selected by cell, deselect by cell
                    else if (selectRecordOnCell && me.selectedRecordCollection.get(record.id) &&
                        !deselectedCellRecords.some(dr => dr.id === record.id)
                    ) {
                        deselectedCellRecords.push(record);
                    }
                    // If configured, also deselect children
                    if (me.selectionShouldIncludeChildren(record)) {
                        for (const child of record.allChildren) {
                            if (!deselectedRecordIndex[child.id] &&
                                (isDragging || me.isSelected(child))
                            ) {
                                deselectedRecords.push(child);
                                deselectedRecordIndex[child.id] = 1;
                            }
                        }
                    }
                }
            }
        }

        if (cellSelectorsToSelect) {
            const selectedRecordIndex = {}; // For performance

            for (const selector of ArrayHelper.asArray(cellSelectorsToSelect)) {
                const
                    cellSelector = me.normalizeCellContext(selector),
                    record = cellSelector?.record || (selector.isModel ? selector : store.getById(cellSelector.id));

                if (cellSelector.isSpecialRow) {
                    continue;
                }

                // Only select cells if in cell selection mode and not forcing record selection
                if (me.isCellSelectionMode && !forceRecordSelection) {
                    selectedCells.push(cellSelector);
                }
                if ((me.isRowSelectionMode || forceRecordSelection) && !selectedRecordIndex[record.id]) {
                    selectedRecords.push(record);
                    selectedRecordIndex[record.id] = 1;
                    // If configured, also select children
                    if (me.selectionShouldIncludeChildren(record)) {
                        for (const child of record.allChildren) {
                            if (!selectedRecordIndex[child.id]) {
                                selectedRecords.push(child);
                                selectedRecordIndex[child.id] = 1;
                            }
                        }
                    }
                }
            }

            if (selectRecordOnCell && selectedCells.length) {
                selectedCellRecords = ArrayHelper.unique(selectedCells.map(c => c.record))
                    .filter(r => !selectedRecordIndex[r.id]);
            }
        }

        // This setting could be either off, or true/'all' or 'some'
        if (includeParents && (deselectedRecords.length || selectedRecords.length)) {
            const
                allChanges = [...deselectedRecords, ...selectedRecords],
                lowestLevelParents = ArrayHelper.unique(
                    allChanges.filter(rec =>
                        rec.parent && !rec.allChildren.some(child =>
                            allChanges.includes(child))).map(rec => rec.parent));

            lowestLevelParents.forEach(parent => me.toggleParentSelection(parent, selectedRecords, deselectedRecords));
        }

        return me.cleanSelectionChange({
            selectedCells,
            selectedRecords,
            deselectedCells,
            deselectedRecords,
            deselectAll,
            action : selectedRecords?.length || selectedCells?.length ? 'select' : 'deselect',
            selectedCellRecords,
            deselectedCellRecords
        });
    }

    toggleParentSelection(parent, toSelect, toDeselect) {
        if (!parent || parent.isRoot) {
            return;
        }

        const
            isSelected      = this.isSelected(parent),
            inToSelect      = toSelect.includes(parent),
            inToDeselect    = toDeselect.includes(parent),
            childIsSelected = child => (this.isSelected(child) && !toDeselect.includes(child)) || toSelect.includes(child);

        if (this.selectionMode.includeParents === 'some') {
            // If any children are selected
            if (parent.allChildren.some(childIsSelected)) {
                // And parent is not being deselected => select
                if ((!isSelected || inToDeselect) && !inToSelect) {
                    toSelect.push(parent);
                }
            }
            // No children are selected and parent is selected => deselect
            else if (isSelected && !inToDeselect) {
                toDeselect.push(parent);
            }
        }
        else if (isSelected && !inToDeselect && !inToSelect && parent.allChildren.some(child => toDeselect.includes(child))) { // includeParents = true/'all'
            // If previously selected, and some child is to be deselected => deselect
            toDeselect.push(parent);
        }
        else if (!isSelected && !inToSelect && parent.allChildren.every(childIsSelected)) {
            // If not previously selected, select if all children are selected
            toSelect.push(parent);
        }

        // Go up one level if it exists
        if (parent.parent) {
            this.toggleParentSelection(parent.parent, toSelect, toDeselect);
        }
    }

    /**
     * Used internally to select a range of cells or records depending on selectionMode. Used in both shift-selection
     * and for drag selection. Will remember current selection range and replace it with new one when it changes. But a
     * range which is completed (drag select mouse up or a new shift range starting point has been set) will remain.
     * This function will not update UI (that's done in refreshGridSelectionUI).
     * @param {GridLocationConfig} fromSelector
     * @param {GridLocationConfig} toSelector
     * @returns {Object} selectionChange object to use for UI update
     * @private
     * @category Selection
     */
    internalSelectRange(fromSelector, toSelector, forceRecordSelection = false) {
        const
            me              = this,
            selectRecords   = me.isRowSelectionMode || forceRecordSelection,
            selectionChange = me.prepareSelection(me._shiftSelectRange,
                me.getRange(fromSelector, toSelector, selectRecords), false, forceRecordSelection);

        me._shiftSelectRange = selectionChange[`selected${selectRecords ? 'Records' : 'Cells'}`];

        return selectionChange;
    }

    /**
     * Used internally to get a range of cell selectors from a start selector to an end selector.
     * @private
     */
    getRange(fromSelector, toSelector, selectRecords = false) {
        const
            me            = this,
            { store }     = me,
            fromCell      = me.normalizeCellContext(fromSelector),
            toCell        = me.normalizeCellContext(toSelector),
            startRowIndex = Math.min(fromCell.rowIndex, toCell.rowIndex),
            endRowIndex   = Math.max(fromCell.rowIndex, toCell.rowIndex),
            toSelect      = [],
            startColIndex = Math.min(fromCell.columnIndex, toCell.columnIndex),
            endColIndex   = Math.max(fromCell.columnIndex, toCell.columnIndex);

        if (startRowIndex === -1 || endRowIndex === -1) {
            throw new Error('Record not found in selectRange');
        }

        // Row selection
        if (selectRecords) {
            const range = store.getRange(startRowIndex, endRowIndex + 1, false);
            // To make selectedRecords in correct order when range selecting upwards
            if (toCell.rowIndex < fromCell.rowIndex) {
                range.reverse();
            }
            // Use chunkedPush to avoid exceeding the maximum call stack size with large datasets
            ArrayHelper.chunkedPush(toSelect, range);
        }
        // Cell selection
        else {
            // Loops from start cell to end cell and creates selectors for all containing cells
            for (let rIx = startRowIndex; rIx <= endRowIndex; rIx++) {
                for (let cIx = startColIndex; cIx <= endColIndex; cIx++) {
                    toSelect.push({ rowIndex : rIx, columnIndex : cIx });
                }
            }
        }

        return toSelect.map(s => me.normalizeCellContext(s));
    }

    // endregion

    // region Update UI & trigger events

    performSelection(selectionChange, updateUI = true, silent = false) {
        const
            me                   = this,
            {
                selectedRecords       = [],
                selectedCells         = [],
                selectedCellRecords   = [],
                deselectedRecords     = [],
                deselectedCells       = [],
                deselectedCellRecords = [],
                action
            }                    = selectionChange,
            allSelectedRecords   = [...selectedRecords, ...selectedCellRecords],
            allDeselectedRecords = [...deselectedRecords, ...deselectedCellRecords],
            rowMode              = me.isRowSelectionMode;

        // Fire event to be able to prevent selection
        if (me.trigger('beforeSelectionChange', {
            mode          : rowMode ? 'row' : 'cell',
            action,
            selected      : allSelectedRecords,
            deselected    : allDeselectedRecords,
            selection     : me.selectedRecords,
            selectedCells,
            deselectedCells,
            cellSelection : me.selectedCells
        }) === false) {
            me.removeDragListeners();
            return false;
        }

        // If deselecting all cells
        if (me._selectedCells === deselectedCells) {
            me._selectedCells = [];
        }
        // Not deselecting all cells
        else {
            const keepCells = [];

            for (const selectedCell of me._selectedCells) {
                if (
                    // Keep selected cells that are not to be deselected and to preserve selection order, not to be
                    // selected again
                    !deselectedCells.some(cellSelector => selectedCell.equals(cellSelector, true)) &&
                    !selectedCells.some(cellSelector => selectedCell.equals(cellSelector, true))
                ) {
                    keepCells.push(selectedCell);
                }
            }

            me._selectedCells = keepCells;
        }

        selectionChange.deselectedRecords = [...deselectedRecords];

        // If deselecting all rows
        if (deselectedRecords === me._selectedRows) {
            me._selectedRows.length = 0;
            me.changeSelectedRecordCollectionSilent(c => c.clear());
        }
        // Not deselecting all rows
        else {
            const
                keepRecords               = [],
                keepInCollection          = [],
                allDeselectedRecordsIndex = ArrayHelper.keyBy(allDeselectedRecords, 'id', () => 1); // For performance

            for (const selectedRecord of me.selectedRecords) {
                if (!allDeselectedRecordsIndex[selectedRecord.id]) {
                    if (me.isSelected(selectedRecord)) {
                        keepRecords.push(selectedRecord);
                    }
                    else {
                        keepInCollection.push(selectedRecord);
                    }
                }
            }

            me._selectedRows = keepRecords;
            me.changeSelectedRecordCollectionSilent(c => c.values = [...keepRecords, ...keepInCollection]);
        }

        // New selection
        if (selectedCells.length) {
            for (const selectedCell of selectedCells) {
                if (!me._selectedCells.some(cellSelector => cellSelector.equals(selectedCell, true))) {
                    me._selectedCells.push(selectedCell);
                }
            }
        }
        if (selectedRecords.length) {
            const recordsToAdd = selectedRecords.filter(r => !me._selectedRows.some(sr => sr.id === r.id));
            // Use chunkedPush to avoid exceeding the maximum call stack size with large datasets
            ArrayHelper.chunkedPush(me._selectedRows, recordsToAdd);
            // Pass array directly instead of using spread operator to avoid call stack issues
            me.changeSelectedRecordCollectionSilent(c => c.add(selectedRecords));
        }

        if (selectedCellRecords.length) {
            // Pass array directly instead of using spread operator to avoid call stack issues
            me.changeSelectedRecordCollectionSilent(c => c.add(selectedCellRecords));
        }

        if (updateUI) {
            me.refreshGridSelectionUI(selectionChange);
        }

        me.afterSelectionChange(selectionChange);

        if (!silent) {
            me.triggerSelectionChangeEvent(selectionChange);
        }
    }

    // Makes sure the DOM is up-to-date with current selection.
    refreshGridSelectionUI({ selectedRecords, selectedCells, deselectedRecords, deselectedCells }) {
        const
            me                          = this,
            { checkboxSelectionColumn } = me;

        // Row selection
        checkboxSelectionColumn?.suspendEvents();
        me.updateGridSelectionRecords(selectedRecords, true);
        me.updateGridSelectionRecords(deselectedRecords, false);
        me.updateCheckboxHeader();
        checkboxSelectionColumn?.resumeEvents();

        // Cell selection
        if (me.isCellSelectionMode) {
            me.updateGridSelectionCells(selectedCells, true);
            if (me.selectionMode.column) {
                me.updateGridSelectionColumns(selectedCells);
            }
        }
        me.updateGridSelectionCells(deselectedCells, false);
    }

    // Loops through records and updates Grid rows
    updateGridSelectionRecords(records, selected) {
        const { checkboxSelectionColumn } = this;
        if (records?.length) {
            for (let i = 0; i < records.length; i++) {
                const row = this.getRowFor(records[i]);
                if (row) {
                    row.toggleCls('b-selected', selected);
                    row.setAttribute('aria-selected', selected);
                    if (checkboxSelectionColumn?.shown && !records[i].isSpecialRow) {
                        // The cell might not exist if the checkbox column is out of view when virtualizing columns.
                        // Its renderer derives the checked state from the selection, so a cell added when the column
                        // comes back into view renders correctly
                        const cell = row.getCell(checkboxSelectionColumn.id);

                        if (cell) {
                            cell.widget.checked = selected;
                        }
                    }
                }
            }
        }
    }

    // Loops through cell selectors and updates Grid cell's
    updateGridSelectionCells(cells, selected) {
        if (cells?.length) {
            for (let i = 0; i < cells.length; i++) {
                const cell = this.getCell(cells[i]);
                if (cell) {
                    cell.setAttribute('aria-selected', selected);
                    cell.classList.toggle('b-selected', selected);
                }
            }
        }
    }

    // Loops through columns to toggle their selected state
    updateGridSelectionColumns(selectedCells) {
        const { count } = this.store;
        for (const column of this.columns.visibleColumns) {
            column.element?.classList.toggle(
                'b-selected',
                selectedCells?.filter(s => s.columnId === column.id).length === count
            );
        }
    }

    triggerSelectionChangeEvent(selectionChange) {
        const
            {
                selectedRecords       = [],
                selectedCells         = [],
                selectedCellRecords   = [],
                deselectedRecords     = [],
                deselectedCells       = [],
                deselectedCellRecords = []
            }                    = selectionChange,
            allSelectedRecords   = [...selectedRecords, ...selectedCellRecords],
            allDeselectedRecords = [...deselectedRecords, ...deselectedCellRecords],
            rowMode              = this.isRowSelectionMode;

        this.trigger('selectionChange', {
            mode          : rowMode ? 'row' : 'cell',
            action        : selectionChange.action,
            selected      : allSelectedRecords,
            deselected    : allDeselectedRecords,
            selection     : this.selectedRecords,
            selectedCells,
            deselectedCells,
            cellSelection : this.selectedCells
        });
    }

    //endregion

    doDestroy() {
        const me = this;

        me.selectedRecordCollection?.owner === me && me.selectedRecordCollection.destroy();
        me._selectedCells.length = 0;
        me._selectedRows.length = 0;

        for (const detacher in me._selectionListenersDetachers) {
            me._selectionListenersDetachers[detacher]();
        }

        super.doDestroy();
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}

};
