import DomHelper from '../../Core/helper/DomHelper.js';
import Widget from '../../Core/widget/Widget.js';

/**
 * @module Grid/util/GridLocation
 */

/**
 * This class encapsulates a reference to a specific navigable grid location.
 *
 * This encapsulates a grid cell based upon the record and column, but in addition, it could represent
 * an actionable location *within a cell** if the {@link #property-target} is not the grid cell in
 * question.
 *
 * A `GridLocation` is immutable. That is, once instantiated, the record and column, which it references
 * cannot be changed. The {@link #function-move} method returns a new instance.
 *
 * A `GridLocation` that encapsulates a cell within the body of a grid will have the following
 * read-only properties:
 *
 *  - grid        : `Grid` The Grid that owns the `GridLocation`.
 *  - record      : `Model` The record of the row that owns the GridLocation. (`null` if the header).
 *  - rowIndex    : `Number` The zero-based index of the row that owns the GridLocation. (-1 means the header).
 *  - column      : `Column` The Column that owns the GridLocation.
 *  - columnIndex : `Number` The zero-based index of the column that owns the GridLocation.
 *  - cell        : `HTMLElement` The referenced cell element.
 *  - target      : `HTMLElement` The focusable element. This may be the cell, or a child of the cell.
 *
 * If the location is a column *header*, the `record` will be `null`, and the `rowIndex` will be `-1`.
 *
 * ## Useful properties
 *
 * | Property                                      | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #property-grid}                        | The owning grid instance                             |
 * | {@link #property-record}                      | The row's record (`null` for headers)                |
 * | {@link #property-column}                      | The column                                           |
 * | {@link #property-cell}                        | The cell DOM element                                 |
 * | {@link #property-rowIndex}                    | Zero-based row index (-1 for headers)                |
 * | {@link #property-columnIndex}                 | Zero-based column index                              |
 *
 * ## See also
 *
 * - {@link Grid.view.Grid} - The grid component
 * - {@link Grid.column.Column} - Column class
 */
export default class GridLocation {

    static UP           = 1;
    static NEXT_CELL    = 2;
    static DOWN         = 3;
    static PREV_CELL    = 4;
    static FIRST_COLUMN = 5;
    static LAST_COLUMN  = 6;
    static FIRST_CELL   = 7;
    static LAST_CELL    = 8;
    static PREV_PAGE    = 9;
    static NEXT_PAGE    = 10;

    /**
     * The grid which this `GridLocation` references.
     * @prp {Grid.view.Grid} grid
     * @readonly
     */

    /**
     * The record which this `GridLocation` references. (unless {@link #config-rowIndex} is used to configure)
     * @config {Core.data.Model} record
     */

    /**
     * The row index which this `GridLocation` references. (unless {@link #config-record} is used to configure).
     *
     * `-1` means the header row, in which case the {@link #config-record} will be `null`.
     * @config {Number} rowIndex
     */

    /**
     * The Column which this `GridLocation` references. (unless {@link #config-columnIndex} or {@link #config-columnId} is used to configure)
     * @config {Grid.column.Column} column
     */

    /**
     * The column id which this `GridLocation` references. (unless {@link #config-column} or {@link #config-columnIndex} is used to configure)
     * @config {String|Number} columnId
     */

    /**
     * The column index which this `GridLocation` references. (unless {@link #config-column} or {@link #config-columnId} is used to configure)
     * @config {Number} columnIndex
     */

    /**
     * The field of the column index which this `GridLocation` references. (unless another column identifier is used to configure)
     * @config {String} field
     */

    /**
     * Initializes a new GridLocation.
     * @param {GridLocationConfig|HTMLElement} location A grid location specifier. This may be:
     *  * An element inside a grid cell or a grid cell.
     *  * An object identifying a cell location using the following properties:
     *    * grid
     *    * record
     *    * rowIndex
     *    * column
     *    * columnIndex
     * @function constructor
     */
    constructor(location) {
        // Private usage of init means that we can create an un attached GridLocation
        // The move method does this.
        if (location) {
            // They passed us a GridLocation, so they already know where to go.
            if (location.isLocation) {
                return location;
            }

            // Passed a DOM node.
            if (location.nodeType === Node.ELEMENT_NODE) {
                const
                    grid = Widget.fromElement(location, 'gridbase'),
                    cell = grid && location.closest(grid.focusableSelector);

                // We are targeted on, or within a cell.
                if (cell) {
                    const
                        { dataset } = cell.parentNode,
                        { store }   = grid,
                        // A row not yet lazy loaded, or loaded but not yet rendered, still carries the data-id of the
                        // record it rendered before
                        isStale     = store.lazyLoad && dataset.index != null && String(store.getAt(dataset.index)?.id) !== dataset.id;

                    this.init({
                        grid,

                        // A .b-grid-row will have a data-index
                        // If it's a column header, we use rowIndex -1
                        rowIndex : !isStale && store.includes(dataset.id) ? store.indexOf(dataset.id) : (dataset.index || -1),
                        columnId : cell.dataset.columnId
                    });
                    this.initialTarget = location;
                }
            }
            else {
                this.init(location);
            }
        }
    }

    init(config) {
        const me = this;

        //<debug>
        if (!config.grid) {
            throw new Error('Grid GridLocation must include grid property');
        }
        //</debug>
        const
            grid               = me.grid = config.grid,
            { store, columns } = grid,
            { visibleColumns } = columns;

        // If we have a target. This is usually only for actionable locations.
        if (config.target) {
            me.actionTargets = [me._target = config.target];
        }

        // Determine our record and rowIndex
        if (config.record) {
            // By passing through getById, we can handle being given an original record when store actually has a link
            me._id = config.record.isRow ? config.record.id : store.getById(config.record).id;
        }
        else if ('id' in config) {
            me._id = config.id;

            // Null means that the GridLocation is in the grid header, so rowIndex -1
            if (config.id == null) {
                me._rowIndex = -1;
            }
        }
        else {
            const rowIndex = !isNaN(config.row) ? config.row : !isNaN(config.rowIndex) ? config.rowIndex : NaN;
            //<debug>
            if (isNaN(rowIndex)) {
                throw new Error('Grid GridLocation must include either record, or id or rowIndex property');
            }
            //</debug>
            me._rowIndex = Math.max(Math.min(Number(rowIndex), me.maxStoreIndex), grid.hideHeaders ? 0 : -1);
            me._id       = store.records[me._rowIndex]?.id;
        }
        if (!('_rowIndex' in me)) {
            me._rowIndex = store.indexOf(me.id);
        }

        // Cache value that we use now. We do not hold a reference to a record
        me.isSpecialRow = me.record?.isSpecialRow;

        // Determine our column and columnIndex
        if ('columnId' in config) {
            me._column = columns.getById(config.columnId);
        }
        else if ('field' in config) {
            me._column = columns.get(config.field);
        }
        else {
            const columnIndex = !isNaN(config.column) ? config.column : !isNaN(config.columnIndex) ? config.columnIndex : NaN;

            if (!isNaN(columnIndex)) {
                me._columnIndex = Math.min(Number(columnIndex), visibleColumns.length - 1);
                me._column      = visibleColumns[me._columnIndex];
            }
            // Fall back to using 'column' property either as index or the Column.
            // If no column property, use column zero.
            else {
                me._column = ('column' in config) ? isNaN(config.column) ? config.column : visibleColumns[config.column] : visibleColumns[0];
            }
        }
        if (!('_columnIndex' in me)) {
            me._columnIndex = visibleColumns.indexOf(me._column);
        }
    }

    // Class identity indicator. Usually added by extending Base, but we don't do that for perf.
    get isLocation() {
        return true;
    }

    equals(other, shallow = false) {
        const me = this;

        return other?.isLocation &&
            other.grid === me.grid &&
            (
                // For a more performant check, use the shallow param
                shallow ? me.id === other.id && me._column === other._column
                    : (other.record === me.record && other.column === me.column && other.target === me.target)
            ) &&
            // Rows not yet lazy loaded have no record, they are only told apart by index
            (me.id != null || me.rowIndex === other.rowIndex);
    }

    /**
     * Yields the row index of this location.
     * @member {Number}
     * @readonly
     */
    get rowIndex() {
        const
            { _id, grid }   = this,
            { store }       = grid;

        // Return the up to date row index for our record
        return store.includes(_id) ? store.indexOf(_id) : Math.min(this._rowIndex, this.maxStoreIndex);
    }

    /**
     * Used by GridNavigation.
     * @member {Number}
     * @readonly
     * @private
     */
    get visibleRowIndex() {
        const
            { rowManager } = this.grid,
            { rowIndex }   = this;

        return rowIndex === -1 ? rowIndex : Math.max(Math.min(rowIndex, rowManager.lastFullyVisibleTow.dataIndex), rowManager.firstFullyVisibleTow.dataIndex);
    }

    /**
     * Yields `true` if the cell and row are selectable.
     *
     * That is if the record is present in the grid's store and it's not a group summary or group header record.
     * @member {Boolean}
     * @readonly
     */
    get isSelectable() {
        return this.grid.store.includes(this._id) && !this.isSpecialRow;
    }

    /**
     * Yields the {@link Core.data.Model} of this location, or `null` if the location is a column header.
     * @member {Core.data.Model}
     * @readonly
     */
    get record() {
        if (this._record?.isModel) {
            return this._record;
        }
        // -1 means the header row
        if (this._rowIndex > -1) {
            const { store } = this.grid;

            // GridLocation's record no longer in store; fall back to record at same index.
            if (!store.includes(this._id)) {
                return store.records[this._rowIndex];
            }

            return store.getById(this._id);
        }
    }

    get id() {
        return this._id;
    }

    /**
     * Yields the {@link Grid.column.Column} of this location.
     * @member {Grid.column.Column}
     * @readonly
     */
    get column() {
        const { visibleColumns } = this.grid.columns;

        // GridLocation's column no longer visible; fall back to column at same index.
        if (!visibleColumns?.includes(this._column)) {
            return visibleColumns?.[this.columnIndex];
        }

        return this._column;
    }

    get columnId() {
        return this.column?.id;
    }

    /**
     * Yields the column index of this location.
     * @member {Number}
     * @readonly
     */
    get columnIndex() {
        return Math.min(this._columnIndex, this.grid.columns.visibleColumns?.length - 1);
    }

    /**
     * Returns a __*new *__ `GridLocation` instance having moved from the current location in the
     * mode specified.
     * @param {Number} where Where to move from this `GridLocation`. May be:
     *
     *  - `GridLocation.UP`
     *  - `GridLocation.NEXT_CELL`
     *  - `GridLocation.DOWN`
     *  - `GridLocation.PREV_CELL`
     *  - `GridLocation.FIRST_COLUMN`
     *  - `GridLocation.LAST_COLUMN`
     *  - `GridLocation.FIRST_CELL`
     *  - `GridLocation.LAST_CELL`
     *  - `GridLocation.PREV_PAGE`
     *  - `GridLocation.NEXT_PAGE`
     * @returns {Grid.util.GridLocation} A GridLocation object encapsulating the target location.
     */
    move(where) {
        const
            me        = this,
            {
                record,
                column,
                grid
            }         = me,
            { store } = grid,
            columns   = grid.columns.visibleColumns,
            result    = new GridLocation();

        let rowIndex    = store.includes(record) ? store.indexOf(record) : me.rowIndex,
            columnIndex = columns.includes(column) ? columns.indexOf(column) : me.columnIndex;

        const
            rowMin        = grid.hideHeaders ? 0 : -1,
            rowMax        = me.maxStoreIndex,
            colMax        = columns.length - 1,
            atFirstRow    = rowIndex === rowMin,
            atLastRow     = rowIndex === rowMax,
            atFirstColumn = columnIndex === 0,
            atLastColumn  = columnIndex === colMax;

        switch (where) {
            case GridLocation.PREV_CELL:
                if (atFirstColumn) {
                    if (!atFirstRow) {
                        columnIndex = colMax;
                        rowIndex--;
                    }
                }
                else {
                    columnIndex--;
                }
                break;
            case GridLocation.NEXT_CELL:
                if (atLastColumn) {
                    if (!atLastRow) {
                        columnIndex = 0;
                        rowIndex++;
                    }
                }
                else {
                    columnIndex++;
                }
                break;
            case GridLocation.UP:
                if (!atFirstRow) {
                    rowIndex--;
                }
                break;
            case GridLocation.DOWN:
                if (!atLastRow) {
                    // From the col header, we drop to the topmost fully visible row.
                    if (rowIndex === -1) {
                        rowIndex = grid.rowManager.firstFullyVisibleRow.dataIndex;
                    }
                    else {
                        rowIndex++;
                    }
                }
                break;
            case GridLocation.FIRST_COLUMN:
                columnIndex = 0;
                break;
            case GridLocation.LAST_COLUMN:
                columnIndex = colMax;
                break;
            case GridLocation.FIRST_CELL:
                rowIndex    = rowMin;
                columnIndex = 0;
                break;
            case GridLocation.LAST_CELL:
                rowIndex    = rowMax;
                columnIndex = colMax;
                break;
            case GridLocation.PREV_PAGE:
                rowIndex = Math.max(rowMin, rowIndex - Math.floor(grid.scrollable.clientHeight / grid.rowHeight));
                break;
            case GridLocation.NEXT_PAGE:
                rowIndex = Math.min(rowMax, rowIndex + Math.floor(grid.scrollable.clientHeight / grid.rowHeight));
                break;
        }

        // Set the calculated coordinates in the result.
        result.init({
            grid,
            rowIndex,
            columnIndex
        });

        return result;
    }

    /**
     * The cell DOM element which this `GridLocation` references.
     * @member {HTMLElement}
     * @readonly
     */
    get cell() {
        const
            me = this,
            {
                grid,
                id,
                _cell
            }  = me;

        // Property value set
        if (_cell) {
            return _cell;
        }

        // On a summary row, find the summary footer cell
        if (grid.features.summary?.enabled && me.rowIndex >= grid.store.count) {
            const summaryCell = grid.element.querySelector(`.b-grid-footer[data-column-id="${me.columnId}"]`);

            if (summaryCell) {
                summaryCell.setAttribute('tabindex', '-1');
                return summaryCell;
            }
        }
        // On a header cell
        else if (id == null && me._rowIndex === -1) {
            return grid.columns.getById(me.columnId)?.element;
        }
        else {
            const { row } = me;

            if (row) {
                return row.getCell(me.columnId) || row.getCell(grid.columns.getAt(me.columnIndex)?.id);
            }
        }
    }

    // For debugging purposes only
    get $cellIndex() {
        return { rowIndex : this.rowIndex, columnIndex : this.columnIndex };
    }

    get row() {
        // Use our record ID by preference, but fall back to our row index if not present
        return this.grid.getRowById(this.id) || this.grid.getRow(this.rowIndex);
    }

    /**
     * The DOM element which encapsulates the focusable target of this `GridLocation`.
     *
     * This is usually the {@link #property-cell}, but if this is an actionable location, this
     * may be another DOM element within the cell.
     * @member {HTMLElement}
     * @readonly
     */
    get target() {
        const
            { cell, _target }   = this,
            { focusableFinder } = this.grid;

        // We might be asked for our focusElement before we're fully rendered and painted.
        if (cell) {
            // GridLocation was created in disableActionable mode with the target
            // explicitly directed to the cell.
            if (_target) {
                return _target;
            }
            focusableFinder.currentNode = this.grid.focusableFinderCell = cell;

            return focusableFinder.nextNode() || cell;
        }
    }

    /**
     * This property is `true` if the focus is inside the cell, not *on* the cell.
     * @member {Boolean}
     * @readonly
     */
    get containsFocus() {
        const
            { cell } = this,
            activeEl = cell && DomHelper.getActiveElement(cell);

        return activeEl && cell.compareDocumentPosition(activeEl) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    }

    /**
     * This property is `true` if the focus target is not the cell itself.
     * @member {Boolean}
     * @readonly
     */
    get isActionable() {
        const { _target } = this;

        // The actual target may be inside the cell, or just positioned to *appear* inside the cell
        // such as event/task rendering.
        return Boolean(this.containsFocus || (_target && _target !== this.cell));
    }

    /**
     * This property is `true` if this location represents a column header.
     * @member {Boolean}
     * @readonly
     */
    get isColumnHeader() {
        return this.cell && this.rowIndex === -1;
    }

    /**
     * This property is `true` if this location represents a cell in the grid body.
     * @member {Boolean}
     * @readonly
     */
    get isCell() {
        return this.cell && this.record;
    }

    get maxStoreIndex() {
        return this.grid.store.count - (this.grid.features.summary?.enabled ? 0 : 1);
    }
}
