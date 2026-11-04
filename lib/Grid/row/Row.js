import Base from '../../Core/Base.js';
import DomDataStore from '../../Core/data/DomDataStore.js';
import ArrayHelper from '../../Core/helper/ArrayHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import Objects from '../../Core/helper/util/Objects.js';
import DomClassList from '../../Core/helper/util/DomClassList.js';
import IdHelper from '../../Core/helper/IdHelper.js';
import GridLocation from '../util/GridLocation.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';

/**
 * @module Grid/row/Row
 */

const
    cellContentRange = document.createRange(),
    // Used for the ARIA attributes refreshed on every row whenever cells come and go, so skip writes which change
    // nothing
    setAttribute     = (element, name, value) => {
        if (element.getAttribute(name) !== value) {
            value === null ? element.removeAttribute(name) : element.setAttribute(name, value);
        }
    };

/**
 * Represents a single rendered row in the grid. Consists of one row element for each SubGrid in use. The grid only
 * creates as many rows as needed to fill the current viewport (and a buffer). As the grid scrolls
 * the rows are repositioned and reused, there is not a one-to-one relation between rows and records.
 *
 * For normal use cases you should not have to use this class directly. Rely on using renderers instead.
 *
 * ```javascript
 * // Access a row via the grid
 * const row = grid.getRowById(recordId);
 *
 * // Get the row element for a specific region
 * const element = row.getElement('normal');
 *
 * // Get all cells in the row
 * const cells = row.cells;
 * ```
 *
 * ## See also
 *
 * - {@link Grid.column.Column#config-renderer} - Column cell renderer
 * - {@link Grid.view.Grid} - The Grid widget
 * - {@link Grid.util.GridLocation} - Cell location reference
 *
 * @extends Core/Base
 */
export default class Row extends Base {

    static $name = 'Row';

    static configurable = {
        /**
         * When __read__, this a {@link Core.helper.util.DomClassList} of class names to be
         * applied to this Row's elements.
         *
         * It can be __set__ using Object notation where each property name with a truthy value is added as
         * a class, or as a regular space-separated string.
         *
         * @member {Core.helper.util.DomClassList} cls
         * @accepts {Core.helper.util.DomClassList|Object<String,Boolean|Number>}
         */
        /**
         * The class name to initially add to all row elements
         * @config {String|Core.helper.util.DomClassList|Object<String,Boolean|Number>}
         */
        cls : {
            $config : {
                equal : (c1, c2) => c1?.isDomClassList && c2?.isDomClassList && c1.isEqual(c2)
            }
        }
    };

    //region Init

    /**
     * Constructs a Row setting its index.
     * @param {Object} config A configuration object which must contain the following two properties:
     * @param {Grid.view.Grid} config.grid The owning Grid.
     * @param {Grid.row.RowManager} config.rowManager The owning RowManager.
     * @param {Number} config.index The index of the row within the RowManager's cache.
     * @function constructor
     * @internal
     */
    construct(config) {
        // Set up defaults and properties
        Object.assign(this, {
            _elements      : {},
            _elementsArray : [],
            _cells         : {},
            _allCells      : [],
            _regions       : [],
            lastHeight     : 0,
            lastTop        : -1,
            _dataIndex     : 0,
            _top           : 0,
            _height        : 0,
            _id            : null,
            forceInnerHTML : false,
            isGroupFooter  : false,
            isGroupHeader  : false,
            // Create our cell rendering context
            cellContext    : new GridLocation({
                grid        : config.grid,
                id          : null,
                columnIndex : 0
            })
        });

        super.construct(config);
    }

    doDestroy() {
        const me = this;

        // No need to clean elements up if the entire thing is being destroyed
        if (!me.rowManager.isDestroying) {
            me.removeElements();

            if (me.rowManager.idMap[me.id] === me) {
                delete me.rowManager.idMap[me.id];
            }

        }

        super.doDestroy();
    }

    //endregion

    //region Data getters/setters

    /**
     * Get index in RowManagers rows array
     * @member {Number}
     * @readonly
     */
    get index() {
        return this._index;
    }

    set index(index) {
        this._index = index;
    }

    /**
     * Get/set this rows current index in grids store
     * @member {Number}
     */
    get dataIndex() {
        return this._dataIndex;
    }

    set dataIndex(dataIndex) {
        if (this._dataIndex !== dataIndex) {
            this._dataIndex = dataIndex;
            this.eachElement(element => {
                element.dataset.index = dataIndex;
                element.ariaRowIndex  = this.grid.hideHeaders ? dataIndex + 1 : dataIndex + 2;
            });
        }
    }

    /**
     * Get/set id for currently rendered record
     * @member {String|Number}
     */
    get id() {
        return this._id;
    }

    set id(id) {
        const
            me    = this,
            idObj = { id },
            idMap = me.rowManager.idMap;

        if (me._id !== id || idMap[id] !== me) {
            if (idMap[me._id] === me) delete idMap[me._id];
            idMap[id] = me;

            me._id = id;
            me.eachElement(element => {
                DomDataStore.assign(element, idObj);
                element.dataset.id = id;
            });
            me.eachCell(cell => DomDataStore.assign(cell, idObj));
        }
    }

    //endregion

    //region Row elements

    /**
     * Add a row element for specified region.
     * @param {String} region Region to add element for
     * @param {HTMLElement} element Element
     * @private
     */
    addElement(region, element) {
        const
            me            = this,
            { dataIndex } = me;

        me._elements[region] = element;
        me._elementsArray.push(element);
        me._regions.push(region);
        DomDataStore.assign(element, { index : me.index });

        me._cells[region] = [];

        // making css selectors simpler, dataset has bad performance but it is only set once and never read
        element.dataset.index = dataIndex;
        element.ariaRowIndex  = me.grid.hideHeaders ? dataIndex + 1 : dataIndex + 2;

        // Setting lastTop to null to ensure that the row gets its top set in all the regions i.e. locked, normal
        // etc. We set the correct lastTop in translateElements method.
        me.lastTop = null;

        if (me.top !== null) {
            me.positionElements(true);
        }
    }

    /**
     * Get the element for the specified region.
     * @param {String} region
     * @returns {HTMLElement}
     */
    getElement(region) {
        return this._elements[region];
    }

    /**
     * Get the {@link Core.helper.util.Rectangle element bounds} for the specified region of this Row.
     * @param {String} region
     * @returns {Core.helper.util.Rectangle}
     */
    getRectangle(region) {
        return Rectangle.from(this.getElement(region));
    }

    /**
     * Execute supplied function for each regions element.
     * @param {Function} fn
     */
    eachElement(fn) {
        this._elementsArray.forEach(fn);
    }

    /**
     * Execute supplied function for each cell.
     * @param {Function} fn
     */
    eachCell(fn) {
        this._allCells.forEach(fn);
    }

    /**
     * An object, keyed by region name (for example `locked` and `normal`) containing the elements which comprise the full row.
     * @type {Object<String,HTMLElement>}
     * @readonly
     */
    get elements() {
        return this._elements;
    }

    /**
     * The row element, only applicable when not using multiple grid sections (see {@link #property-elements})
     * @type {HTMLElement}
     * @readonly
     */
    get element() {
        const region = Object.keys(this._elements)[0];

        return this._elements[region];
    }

    //endregion

    //region Cell elements

    /**
     * Row cell elements
     * @member {HTMLElement[]}
     * @readonly
     */
    get cells() {
        return this._allCells;
    }

    /**
     * Get cell elements for specified region.
     * @param {String} region Region to get elements for
     * @returns {HTMLElement[]} Array of cell elements
     */
    getCells(region) {
        return this._cells[region];
    }

    /**
     * Get the cell element for the specified column.
     * @param {String|Number} columnId Column id
     * @returns {HTMLElement} Cell element
     */
    getCell(columnId, strict = false) {
        return this._allCells.find(cell => {
            const cellData = DomDataStore.get(cell);
            // cellData will always have String type, use == to handle a column with Number type
            return cellData.columnId == columnId || (!strict && cellData.column == columnId);
        });
    }

    removeElements(onlyRelease = false) {
        const me = this;

        // Triggered before the actual remove to allow cleaning up elements etc.
        me.rowManager.trigger('removeRow', { row : me });

        if (!onlyRelease) {
            me.eachElement(element => DomSync.remove(element));
        }
        me._elements = {};
        me._cells = {};
        me._elementsArray.length = me._regions.length = me._allCells.length = me.lastHeight = me.height = 0;
        me.lastTop = -1;
    }

    //endregion

    //region Height

    /**
     * Get/set row height
     * @member {Number}
     */
    get height() {
        return this._height;
    }

    set height(height) {
        if (!this.cls['b-row-expander-row-expanded']) {
            this.setProperty('--b-grid-row-height', height === this.grid.rowHeight ? '' : DomHelper.setLength(height));
        }

        this._height = height;
    }

    /**
     * Largest height requested by the cells rendered so far. Measures the autoHeight cells collected by `render()`
     * first, all together, so that the browser lays out once instead of once per cell.
     * @member {Number} maxRequestedHeight
     * @internal
     */
    get maxRequestedHeight() {
        const
            me    = this,
            cells = me.autoHeightCells;

        if (cells?.length) {
            me.autoHeightCells = [];
            cells.forEach(cell => cell.classList.add('b-measuring-auto-height'));
            // Shrinkwrap autoHeight must not allow a row's height to drop below the configured row height
            me._maxRequestedHeight = Math.max(
                me._maxRequestedHeight, me.grid.rowHeight, ...cells.map(cell => cell.offsetHeight)
            );
            cells.forEach(cell => cell.classList.remove('b-measuring-auto-height'));
        }

        return me._maxRequestedHeight;
    }

    set maxRequestedHeight(height) {
        this._maxRequestedHeight = height;
    }

    /**
     * Get row height including border
     * @member {Number}
     * @readonly
     */
    get offsetHeight() {
        // me.height is specified height, add border height to it to get cells height to match specified rowHeight
        // border height is measured in Grid#get rowManager
        return this.height/* + this.grid._rowBorderHeight*/;
    }

    /**
     * Sync elements height to rows height
     * @private
     */
    updateElementsHeight(isExport) {
        const me = this;

        if (!isExport) {
            me.rowManager.storeKnownHeight(me.id, me.height);
        }

        // prevent unnecessary style updates
        if (me.lastHeight !== me.height) {
            this.eachElement(element => {
                element.style.height = `${me.offsetHeight}px`;
                // element.style.setProperty('--b-row-height', `${me.offsetHeight}px`);
            });
            me.lastHeight = me.height;
        }
    }

    //endregion

    //region CSS

    /**
     * Add CSS classes to each element.
     * @param {...String|Object<String,Boolean|Number>|Core.helper.util.DomClassList} classes
     */
    addCls(classes) {
        this.updateCls(this.cls.add(classes));
    }

    /**
     * Remove CSS classes from each element.
     * @param {...String|Object<String,Boolean|Number>|Core.helper.util.DomClassList} classes
     */
    removeCls(classes) {
        this.updateCls(this.cls.remove(classes));
    }

    /**
     * Toggle CSS classes for each element.
     * @param {Object<String,Boolean|Number>|Core.helper.util.DomClassList|...String} classes
     * @param {Boolean} add
     */
    toggleCls(classes, add) {
        this.updateCls(this.cls[add ? 'add' : 'remove'](classes));
    }

    /**
     * Adds/removes class names according to the passed object's properties.
     *
     * Properties with truthy values are added.
     * Properties with false values are removed.
     * @param {Object<String,Boolean|Number>} classes Object containing properties to set/clear
     */
    assignCls(classes) {
        this.updateCls(this.cls.assign(classes));
    }

    changeCls(cls) {
        // Cannot use a single DomClassList from outside because rows may be all initialized
        // from a single value.
        return new DomClassList(cls);
    }

    updateCls(cls) {
        this.eachElement(element => DomHelper.syncClassList(element, cls));
    }

    setAttribute(attribute, value) {
        this.eachElement(element => element.setAttribute(attribute, value));
    }

    removeAttribute(attribute) {
        this.eachElement(element => element.removeAttribute(attribute));
    }

    /**
     * Joins the row elements of all exposed SubGrids into a single row in the accessibility tree.
     *
     * Screen readers pair a cell with its column header by the cell's position within its row, `aria-colindex` is
     * not used for that. Each SubGrid renders its own row element, so on their own the cells of the second SubGrid
     * would be paired with the headers of the first. Instead, the row element of the first exposed SubGrid owns the
     * cells of the following ones, in visual order. Owned elements follow the owner's own children, which is why
     * the first SubGrid has to be the owner.
     *
     * The other row elements keep their `row` role, and are left without cells in the accessibility tree. Firefox
     * only treats a cell as a table cell if its own parent is a row, regardless of which row owns it.
     *
     * Called when the row's cells change, and when a SubGrid is collapsed, expanded, hidden or shown.
     * @internal
     */
    updateAriaOwns() {
        const
            me       = this,
            { grid } = me,
            owns     = [];

        let ariaRow;

        grid.eachSubGrid(({ region, collapsed, hidden }) => {
            const
                element = me._elements[region],
                exposed = !collapsed && !hidden;

            if (element) {
                if (!ariaRow && exposed) {
                    ariaRow = element;
                }
                else {
                    setAttribute(element, 'aria-owns', null);

                    if (ariaRow && exposed) {
                        for (const cell of me._cells[region]) {
                            owns.push(cell.id ||= IdHelper.generateId(`${grid.id}-cell-`));
                        }
                    }
                }
            }
        });

        ariaRow && setAttribute(ariaRow, 'aria-owns', owns.length ? owns.join(' ') : null);
    }

    setProperty(property, value) {
        this.eachElement(element => element.style.setProperty(property, value));
    }

    //endregion

    //region Position

    /**
     * Is this the very first row?
     * @member {Boolean}
     * @readonly
     */
    get isFirst() {
        return this.dataIndex === 0;
    }

    /**
     * Row top coordinate
     * @member {Number}
     * @readonly
     */
    get top() {
        return this._top;
    }

    /**
     * Row bottom coordinate
     * @member {Number}
     * @readonly
     */
    get bottom() {
        return this._top + this._height;/* + this.grid._rowBorderHeight;*/
    }

    /**
     * Sets top coordinate, translating elements position.
     * @param {Number} top Top coordinate
     * @param {Boolean} [silent] Specify `true` to not trigger translation event
     * @internal
     */
    setTop(top, silent) {
        if (this._top !== top) {
            this._top = top;
            this.positionElements(silent);
        }
    }

    /**
     * Sets bottom coordinate, translating elements position.
     * @param {Number} bottom Bottom coordinate
     * @param {Boolean} [silent] Specify `true` to not trigger translation event
     * @private
     */
    setBottom(bottom, silent) {
        this.setTop(bottom - this.offsetHeight, silent);
    }

    // Used by export feature to position individual row
    translate(top, silent = false) {
        this.setTop(top, silent);
        return top + this.offsetHeight;
    }

    /**
     * Sets css top to position elements at correct top position
     * @private
     */
    positionElements(silent) {
        const
            me                      = this,
            { top, _elementsArray } = me;

        if (me.lastTop !== top) {
            for (let i = 0, { length } = _elementsArray; i < length; i++) {
                _elementsArray[i].style.top = `${top}px`;
            }

            !silent && me.rowManager.trigger('translateRow', { row : me });

            me.lastTop = top;
        }
    }

    /**
     * Moves all row elements up or down and updates model.
     * @param {Number} offsetTop Pixels to offset the elements
     * @private
     */
    offset(offsetTop) {
        let newTop = this._top + offsetTop;

        // Not allowed to go below zero (won't be reachable on scroll in that case)
        if (newTop < 0) {
            offsetTop -= newTop;
            newTop = 0;
        }
        this.setTop(newTop);
        return offsetTop;
    }

    //endregion

    //region Cell positioning

    positionCells() {
        for (const cell of this.cells) {
            const column = this.grid.columns.getById(cell.dataset.columnId);

            // A cell whose column was removed while refresh is suspended (Scheduler swaps the locked columns of the
            // region hosting the time axis when toggling mode) has nothing to position against. The pending refresh
            // removes it, so just leave it alone
            if (!column) {
                continue;
            }

            const
                { style }    = cell,
                { x, width } = column.meta;

            style.insetInlineStart = `${x}px`;
            style.width = `${width}px`;
        }
    }

    //endregion

    //region Render

    addCell({ columnRecord, refresh = true }) {
        const
            me         = this,
            { region } = columnRecord,
            subGrid    = me.grid.subGrids[region],
            rowElement = me.getElement(region);

        // The row might not yet have an element for a newly added region (subgrid created on the fly). Cells are
        // added when the region's row elements are created
        if (!rowElement) {
            return;
        }

        const
            { x, width }       = columnRecord.meta,
            { visibleColumns } = subGrid.columns,
            columnIndex        = visibleColumns.indexOf(columnRecord),
            regionCells        = me._cells[region];

        // Cells are kept in column order, for when toggling a column in the middle. Since cells only exist for
        // intersecting columns, the nearest following column that has one materialized (the immediate next might not,
        // for example when it is out of view while a later alwaysRenderCells or focused column keeps its cell) is the
        // insertion anchor, both in the DOM and in the backing arrays below.
        // The anchor must be in both collections. getCell searches _allCells, so it skips cells already removed; the
        // index in regionCells then confirms the cell belongs to this region and is a child of this row element. A
        // column changing region is in the target subgrid's columns while its cell still lives in the previous
        // region's row element, and only checking one collection would let such a cell through. The index found here
        // is also the insertion position used below
        let
            nextCell    = null,
            regionIndex = regionCells.length;

        for (let i = columnIndex + 1; i < visibleColumns.length && !nextCell; i++) {
            const
                cell  = me.getCell(visibleColumns[i].id, true),
                index = cell ? regionCells.indexOf(cell) : -1;

            if (index > -1) {
                nextCell    = cell;
                regionIndex = index;
            }
        }

        const cellElement = DomHelper.createElement({
            className       : 'b-grid-cell',
            role            : 'gridcell',
            // aria-colindex is grid wide (and one based), so the cell's index within its SubGrid must be offset by
            // the number of visible columns in the preceding SubGrids
            'aria-colindex' : subGrid.ariaColIndexOffset + columnIndex + 1,
            tabIndex        : me.grid.cellTabIndex,
            dataset         : {
                column   : columnRecord.field || '',
                columnId : columnRecord.id
            },
            style : {
                insetInlineStart : x,
                width
            },
            parent      : rowElement,
            // When there is no following cell, insert before RowExpander's expanded body, which relies on painting
            // above the row's full-height cells
            nextSibling : nextCell ?? rowElement.rowExpanderBody
        });

        // Consumers rely on the cells arrays matching DOM / column order. _allCells additionally groups cells by
        // region, in region order, so the global insertion index is the earlier regions' cell count plus the index
        // within this region
        const allIndex = me._regions.slice(0, me._regions.indexOf(region))
            .reduce((sum, r) => sum + me._cells[r].length, 0) + regionIndex;

        regionCells.splice(regionIndex, 0, cellElement);
        me._allCells.splice(allIndex, 0, cellElement);

        DomDataStore.set(cellElement, {
            column   : columnRecord.field || '',
            columnId : columnRecord.id,
            row      : me,
            id       : me.id,
            rowElement
        });

        // Don't refresh when adding cells during a matchRowCount operation, it will render if necessary
        refresh && me.refreshCell({ columnRecord });
    }

    removeCell({ columnRecord }) {
        const cellElement = this.getCell(columnRecord.id, true);
        if (cellElement) {
            cellElement.remove();
            ArrayHelper.remove(this._allCells, cellElement);
            ArrayHelper.remove(this._cells[columnRecord.region], cellElement);
        }
    }

    // Fake rows created by exporters have cells for all visible columns, since exported output must include
    // columns regardless of whether they currently intersect the viewport
    get renderedColumns() {
        const { columns } = this.grid;

        return this.isFakeRow ? columns.visibleColumns : columns.intersectingColumns;
    }

    alignCells() {
        for (const columnRecord of this.renderedColumns) {
            const
                cellElement  = this.getCell(columnRecord.id, true),
                { width, x } = columnRecord.meta;

            if (cellElement) {
                cellElement.style.insetInlineStart = `${x}px`;
                cellElement.style.width = `${width}px`;
            }
        }
    }

    refreshCell({ columnRecord, updatingSingleRow, record, recordIndex, height = null, maxRequestedHeight = null }) {
        const
            me              = this,
            { store }       = me.grid,
            { cellContext } = me,
            cellElement     = me.getCell(columnRecord.id, true);

        // When virtualizing columns, cells only exist for columns in view. Columns entering view get their cells
        // added and rendered by Header#syncIntersections, nothing to do here for the rest
        if (!cellElement) {
            return;
        }

        // Callers rendering a full row (render()) resolve the record and its index once and pass them along.
        // Resolving per cell is expensive, Store#indexOf is a linear scan for tree stores
        record ??= store.getById(me.id);

        // The record might be missing if the row is in a transitional state, for example when cells are added by
        // syncIntersections while a subgrid expands. Such rows are rendered by RowManager when assigned a record
        if (record) {
            cellContext._record = record;
            cellContext._id = record.id;
            cellContext._rowIndex = recordIndex ?? store.indexOf(record);
            cellContext._columnId = columnRecord.id;
            cellContext._column = columnRecord;
            cellContext._columnIndex = me.grid.columns.visibleColumns.indexOf(columnRecord);
            cellContext._cell = cellElement;
            cellContext.height = height;
            cellContext.maxRequestedHeight = maxRequestedHeight;
            cellContext.updatingSingleRow = updatingSingleRow;

            return me.renderCell(cellContext);
        }
    }

    /**
     * When the Store has `lazyLoad` set to `true` and the record is waiting to be loaded, a "skeleton" placeholder is
     * rendered while waiting.
     * @param {Number} recordIndex Index of the record in the store
     * @param {Promise} recordPromise Promise that resolves with the record once loaded
     * @ts-param recordPromise {Promise<String>}
     * @param {Boolean} updatingSingleRow Whether a single row is being updated
     * @param {Boolean} batch Whether this render is part of a batch update
     * @param {Boolean} isExport Whether this render is for export
     * @private
     */
    renderPlaceholder(recordIndex, recordPromise, updatingSingleRow, batch, isExport) {
        const
            me             = this,
            { rowManager } = me,
            { rowHeight }  = rowManager;

        me.addCls('b-row-placeholder');

        if (me.height !== rowHeight) {
            me.height = rowHeight;
            me.updateElementsHeight(true);
            rowManager.bufferedTranslateFromRow(me);
        }

        me.dataIndex = recordIndex;

        // Perform final rendering when record finished loading
        recordPromise.then((record) => {
            // But only row is still used for same record
            if (record && me.dataIndex === recordIndex && me.grid.store.indexOf(record) === recordIndex) {
                me.render(recordIndex, record, updatingSingleRow, batch, isExport, true);
            }
        });
    }

    /**
     * Renders a record into this row´s elements (trigger event that subgrids catch to do the actual rendering).
     * @param {Number} recordIndex
     * @param {Core.data.Model} record
     * @param {Boolean} [updatingSingleRow]
     * @param {Boolean} [batch]
     * @private
     */
    render(recordIndex, record, updatingSingleRow = true, batch = false, isExport = false, isAsync = false) {
        const
            me        = this,
            {
                cls,
                elements,
                grid,
                rowManager,
                height : oldHeight,
                _id    : oldId
            }         = me,
            rowElData = DomDataStore.get(me._elementsArray[0]),
            rowHeight = rowManager._rowHeight,
            { store } = grid,
            isTree    = grid.features.tree && store.isTree;

        // no record specified, (false indicates empty row, don't do lookup)
        if (!record && record !== false) {
            if (recordIndex != null) {
                // Try lazyLoad
                record = store.lazyLoad?.getAt(recordIndex);

                if (record && !record.isModel) { // record is a Promise
                    return me.renderPlaceholder(recordIndex, record, updatingSingleRow, batch, isExport);
                }
            }

            // try looking up in store
            if (!record) {
                record      = store.getById(rowElData.id);
                recordIndex = store.indexOf(record);
            }
        }

        // Bail out if record is not resolved
        // <remove-on-release>
        // TODO: this happens when resource changes its id
        //  covered w/ 13_view_update.t.js and 14_crudmanager_sharing.t.js in Scheduler
        // </remove-on-release>
        if (!record) {
            return;
        }

        // Flag that is checked by NewTaskRendering to determine if it needs to translate other task bars
        // (other rows cells won't be re-rendered when updating a single row, so must force translation)
        rowManager.updatingSingleRow = updatingSingleRow;

        me.removeCls('b-row-placeholder');

        // Now we have acquired a record, see what classes it requires on the
        const
            rCls      = record?.cls,
            recordCls = rCls ? (rCls.isDomClassList ? rCls : new DomClassList(rCls)) : null,
            isLast    = recordIndex === store.count - 1;

        cls.assign({
            // do not put updating class if we're exporting the row
            'b-grid-row-updating' : updatingSingleRow && grid.transitionDuration && !isExport,
            'b-selected'          : grid.isSelected(record?.id),
            'b-read-only'         : record.readOnly,
            'b-linked'            : record.isLinked,
            'b-original'          : record.hasLinks,
            'b-last'              : isLast
        });

        // If we became the last row, another row might no longer be
        if (isLast && rowManager.$lastRow !== me) {
            rowManager.$lastRow?.removeCls?.('b-last');
            rowManager.$lastRow = me;
        }

        // These are DomClassLists, so they have to have their properties processed by add/remove
        if (me.lastRecordCls) {
            cls.remove(me.lastRecordCls);
        }

        // Assign our record's cls to the row, and cache the value so it can be removed next time round
        if (recordCls) {
            cls.add(recordCls);
            me.lastRecordCls = { ...recordCls };
        }
        else {
            me.lastRecordCls = null;
        }

        // used by GroupSummary feature to clear row before
        rowManager.trigger('beforeRenderRow', { row : me, record, recordIndex, oldId });

        grid.beforeRenderRow({ row : me, record, recordIndex, oldId, cls });

        // Flush any changes to our DomClassList to the Row's DOM
        me.updateCls(cls);

        if (updatingSingleRow && grid.transitionDuration && !isExport) {
            grid.setTimeout(() => {
                if (!me.isDestroyed) {
                    cls.remove('b-grid-row-updating');
                    me.updateCls(cls);
                }
            }, grid.transitionDuration + 50);
        }

        me.id = record.id;
        me.dataIndex = recordIndex;
        //<debug>
        if (me.dataIndex === -1) {
            throw new Error(`Row's record, id: ${record.id} not found in store`);
        }
        //</debug>

        // Configured height, used as row height if renderers do not specify otherwise
        const height = (!grid.fixedRowHeight && grid.internalGetRowHeight(record)) || rowHeight;

        // Hierarchy is conveyed by level, set size, position and expanded state, rows are siblings in the
        // accessibility tree
        if (isTree) {
            const isExpanded = record.isExpanded(store);

            for (const region in elements) {
                const el = elements[region];

                el.id = `${grid.id}-${region}-${me.id}`;
                DomHelper.setAttributes(el, {
                    'aria-level'    : record.childLevel + 1,
                    'aria-setsize'  : record.parent.children.length,
                    'aria-posinset' : record.parentIndex + 1
                });

                if (record.isLeaf) {
                    el.removeAttribute('aria-expanded');
                }
                else {
                    el.setAttribute('aria-expanded', isExpanded);
                }
            }
        }

        // Max height returned by renderers
        let maxRequestedHeight = me.maxRequestedHeight = null;

        // renderCell() collects autoHeight cells here, they are measured together after rendering all cells. With
        // fixedRowHeight their height is not used, no point in measuring them
        me.autoHeightCells = rowManager.fixedRowHeight ? null : [];

        for (const columnRecord of me.renderedColumns) {
            const size = me.refreshCell({ columnRecord, updatingSingleRow, record, recordIndex, height, maxRequestedHeight });

            // We want to make row in all regions as tall as the tallest cell
            if (size?.height != null && !rowManager.fixedRowHeight) {
                maxRequestedHeight = Math.max(maxRequestedHeight, size.height);

                // Do not store a max height set by schedulers rendering, it has to base its layouts on the
                // original row height / that returned by other cells
                if (!size.transient) {
                    me.maxRequestedHeight = maxRequestedHeight;
                }
            }
        }

        const
            // Reading maxRequestedHeight measures the autoHeight cells
            measuredHeight = me.maxRequestedHeight,
            useHeight      = (measuredHeight == null ? maxRequestedHeight : Math.max(maxRequestedHeight, measuredHeight)) ?? height;

        me.autoHeightCells = null;
        me.height = grid.processRowHeight(record, useHeight) ?? useHeight;

        // Height gets set during render, reflect on elements
        me.updateElementsHeight(isExport);

        if (isAsync && oldHeight !== me.height) {
            rowManager.bufferedTranslateFromRow(me, batch);
        }

        // Rerendering a row might change its height, which forces translation of all following rows
        if (updatingSingleRow && !isExport) {
            if (oldHeight !== me.height) {
                rowManager.translateFromRow(me, batch);
            }
            rowManager.trigger('updateRow', { row : me, record, recordIndex, oldId });
            rowManager.trigger('renderDone');
        }

        grid.afterRenderRow({ row : me, record, recordIndex, oldId, oldHeight, isExport });

        rowManager.trigger('renderRow', { row : me, record, recordIndex, oldId, isExport });

        if (oldHeight && me.height !== oldHeight) {
            rowManager.trigger('rowRowHeight', { row : me, record, height : me.height, oldHeight });
        }

        me.forceInnerHTML = false;
        rowManager.updatingSingleRow = false;
    }

    /**
     * Renders a single cell, calling features to allow them to hook
     * @param {Grid.util.GridLocation|HTMLElement|Object} cellContext A {@link Grid.util.GridLocation} which contains
     *   rendering options, or a cell element, which can be used to initialize a {@link Grid.util.GridLocation}
     * @param {Number} [cellContext.height] Configured row height
     * @param {Number} [cellContext.maxRequestedHeight] Maximum proposed row height from renderers
     * @param {Boolean} [cellContext.updatingSingleRow] Rendered as part of updating a single row
     * @param {Boolean} [cellContext.isMeasuring] Rendered as part of a measuring operation
     * @internal
     */
    renderCell(cellContext) {
        if (!cellContext.isLocation) {
            cellContext = new GridLocation(cellContext);
        }

        let {
            cell : cellElement,
            record
        } = cellContext;

        const
            {
                grid,
                column,
                height,
                maxRequestedHeight,
                updatingSingleRow = true,
                isMeasuring = false
            }               = cellContext,
            cellEdit        = grid.features?.cellEdit,
            cellElementData = DomDataStore.get(cellElement),
            rowElement      = cellElementData.rowElement,
            rowElementData  = DomDataStore.get(rowElement);

        if (!record) {
            record = cellContext._record = grid.store.getById(rowElementData.id);

            if (!record) {
                return;
            }
        }

        // fwComponent is the parent that has a framework support implemented. It can be the grid itself.
        if (!grid.fwComponent) {
            grid.fwComponent = grid.hasFrameworkRenderer ? grid : grid.up(cmp => Boolean(cmp.hasFrameworkRenderer)) || {};
        }

        let cellContent  = column.getRawValue(record);
        const
            dataField    = record.fieldMap[column.field],
            size         = { configuredHeight : height, height : null, maxRequestedHeight },
            cellCls      = column.getCellClass(cellContext),
            rendererData = {
                cellElement,
                cellCls,
                dataField,
                rowElement,
                value    : cellContent,
                record,
                column,
                size,
                grid,
                row      : cellElementData.row,
                updatingSingleRow,
                isMeasuring,
                isExport : false
            },
            useRenderer  = column.renderer;

        if (grid.readOnly || record.readOnly || !column.canEdit(record)) {
            cellElement.setAttribute('aria-readonly', true);
        }
        else {
            cellElement.removeAttribute('aria-readonly');
        }

        // Hook to allow processing cell before render, used by QuickFind, MergeCells & StickyCells.
        // Hooks may modify cellCls and/or redirect cellElement.
        grid.beforeRenderCell(rendererData, cellContext);

        // Sync CSS classes. By default targets the original cell element.
        // Hooks may set cellClsTarget to redirect class syncing (e.g. MergeCells redirects to the
        // merged cell element, keeping the original cell free for its own marker classes).
        DomHelper.syncClassList(rendererData.cellClsTarget || cellElement, cellCls);

        // Allow hook to redirect cell output (for content rendering only)
        if (rendererData.cellElement !== cellElement) {
            cellElement = rendererData.cellElement;
        }

        let shouldSetContent = true;

        // By default, `cellContent` is raw value extracted from Record based on Column field.
        // Call `renderer` if present, otherwise set innerHTML directly.
        if (!Objects.isPromise(cellContent)) {
            if (useRenderer) {
                // `cellContent` could be anything here:
                // - null
                // - undefined when nothing is returned, used when column modifies cell content, for example Widget column
                // - number as cell value, to be converted to string
                // - string as cell value
                // - string which contains custom DOM element which is handled by Angular after we render it as cell value
                // - object with special $$typeof property equals to Symbol(react.element) handled by React when JSX is returned
                // - object which has no special properties but understood by Vue because the column is marked as "Vue" column
                // - object that should be passed to the `DomSync.sync` to update the cell content
                cellContent = column.callback(useRenderer, column, [rendererData]);

                // Controlling row height from renderers is deprecated. Internal renderers are exempt: Scheduler's
                // event rendering flags its height as transient, and special rows have their heights managed by
                // the Group/GroupSummary features
                if (size.height != null && !size.transient && !record.isSpecialRow &&
                    !column.$rendererHeightDeprecated) {
                    column.$rendererHeightDeprecated = true;
                    VersionHelper.deprecate('9.0.0', 'Controlling row height by setting `size.height` from a ' +
                        'column renderer is deprecated, supply a `getRowHeight()` function on the grid instead. ' +
                        'Until migrated, columns whose renderer supplies row height should be configured with ' +
                        '`alwaysRenderCells : true` if the grid virtualizes columns, to avoid row heights ' +
                        'changing as the grid scrolls horizontally');
                }

                if (cellContent === undefined) {
                    if (record.generatedParent && column.rendererReturningContent) {
                        cellContent = '';
                    }
                    else if (column.alwaysClearCell === false) {
                        shouldSetContent = false;
                    }
                }
            }
            else if (dataField) {
                cellContent = dataField.print(cellContent);
            }
        }

        // Data for updating the cell element
        const cellUpdateContext = {
            cellContent,
            size,
            grid,
            isMeasuring,
            cellContext,
            cellElementData,
            rendererData,
            shouldSetContent,
            cellEdit,
            record,
            column,
            cellElement
        };

        // If the content will be arriving soon, update the cell when it does...
        if (Objects.isPromise(cellContent)) {
            cellElement.classList.add('b-loading-cell');
            cellContent.then(cellContent => {
                // ...Unless in the intervening time this Row has been destroyed
                if (!this.isDestroyed) {
                    cellElement.classList.remove('b-loading-cell');

                    // If the cell is still owned by the context record, we can update the cell
                    if (grid.getRecordFromElement(cellElement) === record) {
                        this.updateCellContent({ ...cellUpdateContext, cellContent });
                    }
                }
            });
            return size;
        }

        return this.updateCellContent(cellUpdateContext);
    }

    updateCellContent({
        cellContent,
        size,
        grid,
        isMeasuring,
        cellContext,
        cellElementData,
        rendererData,
        shouldSetContent,
        cellEdit,
        record,
        column,
        cellElement
    }) {

        // Check if the cell content is going to be rendered by framework
        const hasFrameworkRenderer = grid.fwComponent?.hasFrameworkRenderer?.({ cellContent, column });

        // This is exceptional case, using framework rendering while grouping is not supported.
        // Need to reset the content in case of JSX is returned from the renderer.
        // Normally, if a renderer returns some content, the Grouping feature will overwrite it with the grouped value.
        // But useRenderer cannot be ignored completely, since a column might want to render additional content to the
        // grouped row. For example, Action Column may render an action button the grouped row.
        if (hasFrameworkRenderer && record.isSpecialRow) {
            cellContent = '';
        }

        // If present, framework may decide if it wants our renderer to prerender the cell content or not.
        // In case of normal cells in flat grids, React and Vue perform the full rendering into the root cell element.
        // But in case of tree cell in tree grids, React and Vue require our renderer to prerender internals,
        // and they perform rendering into inner "b-tree-cell-value" element. This way we can see our expand controls,
        // bullets, etc.
        const frameworkPerformsFullRendering = hasFrameworkRenderer && !column.data.tree && !record.isSpecialRow;

        // Let the wrapper to render the cell content
        if (frameworkPerformsFullRendering) {
            grid.fwComponent?.processCellContent?.({
                reactComponent : grid.fwComponent,
                cellElementData,
                rendererData,
                rendererHtml   : rendererData.rendererHtml || cellContent

            });
        }

        // `shouldSetContent` false means content is already set by the column (i.e. Widget column).
        // `frameworkPerformsFullRendering` true means full cell content is set by framework renderer.
        if (shouldSetContent && !frameworkPerformsFullRendering) {
            let renderTarget = cellElement;

            // If the cell is being edited, we render to a separate div and carefully
            // insert the contents into a Range which excludes the editor.
            if (cellEdit?.editorContext?.column === column && !cellEdit.editor.isFinishing /*&& cellEdit.editor.element.offsetParent*/) {
                // If this *record* is being edited, ensure the content *and* editor are coexisting in the cell
                if (cellEdit?.editorContext.equals(cellContext)) {
                    renderTarget = this.moveContentFromCell(cellElement, cellEdit.editor.element);
                }
                // If we are rendering a different record to that being edited, evict the editor from the cell
                else {
                    // Finally, remove the editing class to display the cell content
                    renderTarget.classList.remove('b-editing');
                }
            }

            const
                hasObjectContent = cellContent != null && typeof cellContent === 'object',
                hasStringContent = typeof cellContent === 'string',
                text             = (hasObjectContent || cellContent == null) ? '' : String(cellContent);

            // row might be flagged by GroupSummary to require full "redraw"
            if (this.forceInnerHTML) {
                // To allow minimal updates below, we must remove custom markup inserted by the GroupSummary feature
                renderTarget.innerHTML = '';
                // Delete cached content value
                delete renderTarget._content;

                cellElement.lastDomConfig = null;
            }

            // display cell contents as text or use actual html?
            // (disableHtmlEncode set by features that decorate cell contents)
            if (!hasObjectContent && column.htmlEncode && !column.disableHtmlEncode) {
                // Set innerText if cell currently has html content.
                if (cellElement._hasHtml) {
                    renderTarget.innerText = text;
                    cellElement._hasHtml = false;
                }
                else {
                    DomHelper.setInnerText(renderTarget, text);
                }
                delete renderTarget._content;
            }
            else if (column.autoSyncHtml && (!hasStringContent || DomHelper.getChildElementCount(renderTarget))) {
                // String content in html column is handled as a html template string
                if (hasStringContent) {
                    // update cell with only changed attributes etc.
                    DomHelper.sync(text, renderTarget.firstElementChild);
                }
                // Other content is considered to be a DomHelper config object
                else if (hasObjectContent) {
                    DomSync.sync({
                        domConfig     : cellContent,
                        targetElement : renderTarget
                    });
                    delete renderTarget._content;
                }
            }
            // Consider all returned plain objects to be DomHelper configs for cell content
            else if (hasObjectContent) {
                DomSync.sync({
                    targetElement : renderTarget,
                    domConfig     : {
                        onlyChildren : true,
                        children     : ArrayHelper.asArray(cellContent)
                    }
                });
                delete renderTarget._content;
            }
            // Apply text as innerHTML only if it has changed
            else if (renderTarget._content !== text) {
                renderTarget.innerHTML = renderTarget._content = text;
            }

            // If we had to render to a separate div to avoid the cell editor, insert the result now.
            if (renderTarget !== cellElement) {
                const { firstChild } = cellElement;
                // clone childNodes to be sure all nodes are moved
                for (const node of [...renderTarget.childNodes]) {
                    cellElement.insertBefore(node, firstChild);
                }
                cellElement.classList.add('b-editing', 'b-focused');
            }
        }

        // If present, framework renders content into the cell element.
        // Ignore special rows, like grouping.
        if (!record.isSpecialRow) {
            // processCellContent is implemented in the framework wrappers
            grid.processCellContent?.({
                cellElementData,
                rendererData,
                // In case of TreeColumn we should prerender inner cell content like expand controls, bullets, etc
                // Then the framework renders the content into the nested "b-tree-cell-value" element.
                // rendererHtml is set in TreeColumn.treeRenderer
                rendererHtml : rendererData.rendererHtml || cellContent
            });
        }

        // If column is configured with autoHeight, and doesn't have its own fixed height - we measure it
        const autoHeight = column.autoHeight && !record.rowHeight;

        // Special rows are measured here, the renderCell listeners below size them based on the measured height
        // (Group, GroupSummary)
        if (autoHeight && record.isSpecialRow && size.height == null) {
            cellElement.classList.add('b-measuring-auto-height');

            // Shrinkwrap autoHeight must not allow a row's height to drop below the configured row height, or the
            // height features supply for special rows (group headers and footers, which keep a height set here)
            size.height = Math.max(
                cellElement.offsetHeight,
                grid.getSpecialRowHeight(record) || grid.rowHeight
            );

            cellElement.classList.remove('b-measuring-auto-height');
        }

        if (!isMeasuring) {
            // Allow others to affect rendering
            this.rowManager.trigger('renderCell', rendererData);
        }

        if (column.afterRenderCell) {
            column.callback(column.afterRenderCell, column, [rendererData]);
        }

        // While rendering the row, other cells are measured together after all are rendered, unless a height was
        // requested above. The row height is only applied by render(), cells rendered on their own are not measured
        if (autoHeight && size.height == null) {
            this.autoHeightCells?.push(cellElement);
        }

        return size;
    }

    //#region Hooks for salesforce

    moveContentFromCell(cellElement, editorElement) {
        // if the editorElement is not currently in the DOM, we append it as a child to the cellElement
        if (!editorElement.parentNode) {
            cellElement.appendChild(editorElement);
        }

        cellContentRange.setStart(cellElement, 0);
        cellContentRange.setEndBefore(editorElement);

        const renderTarget = document.createElement('div');

        // eslint-disable-next-line bryntum/no-salesforce-unsupported-methods -- Salesforce overrides moveContentFromCell (RowOverride)
        renderTarget.appendChild(cellContentRange.extractContents());

        renderTarget.classList.add('b-editing');

        return renderTarget;
    }

    //#endregion

//endregion
}

Row.initClass();
