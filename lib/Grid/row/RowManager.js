import Rectangle from '../../Core/helper/util/Rectangle.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import Row from './Row.js';
import ArrayHelper from '../../Core/helper/ArrayHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import Delayable from '../../Core/mixin/Delayable.js';
import GridLocation from '../util/GridLocation.js';


/**
 * @module Grid/row/RowManager
 */

const cloneRowEl = el => {
    const
        p      = el.parentElement,
        result = el.cloneNode(true);

    result.classList.add('b-removing');
    p.insertBefore(result, el);
    return result;
};

/**
 * Virtual representation of the grid, using {@link Grid.row.Row} to represent rows. Plugs into {@link Grid.view.Grid}
 * and exposes the following functions on grid itself:
 * * {@link #function-getRecordCoords()}
 * * {@link #function-getRowById()}
 * * {@link #function-getRow()}
 * * {@link #function-getRowFor()}
 * * {@link #function-getRowFromElement()}
 *
 * ```javascript
 * let row = grid.getRowById(1);
 * ```
 *
 * @plugin
 * @private
 */
export default class RowManager extends InstancePlugin.mixin(Delayable) {
    static $name = 'RowManager';

    //region Config

    // Plugin configuration.
    static get pluginConfig() {
        return {
            after : [
                'destroy'
            ],
            assign : [
                'topRow', 'bottomRow', 'firstVisibleRow', 'lastVisibleRow', 'firstFullyVisibleRow', 'lastFullyVisibleRow',
                'getRowById', 'getRecordCoords', 'getRow', 'getRowFor', 'getRowFromElement'
            ]
        };
    }

    static configurable = {
        rowClass : Row,

        /**
         * Number of rows to render above current viewport
         * @config {Number}
         * @default
         */
        prependRowBuffer : 5,

        /**
         * Number of rows to render below current viewport
         * @config {Number}
         * @default
         */
        appendRowBuffer : 5,

        /**
         * Default row height, assigned from Grid at construction (either from config
         * {@link Grid.view.Grid#config-rowHeight} or CSS). Can be set from renderers
         * @config {Number}
         * @default
         */
        rowHeight : null,

        /**
         * Set to `true` to get a small performance boost in applications that uses fixed row height
         * @config {Boolean}
         */
        fixedRowHeight : null,

        autoHeight : false
    };

    static get properties() {
        return {
            idMap                : {},
            // <remove-on-release>
            // TODO: investigate whether topIndex can be removed, since topRow is always first in array and has dataIndex
            // </remove-on-release>
            topIndex             : 0,
            lastScrollTop        : 0,
            _rows                : [],
            // Record id -> row height mapping
            heightMap            : new Map(),
            // Sum of entries in heightMap
            totalKnownHeight     : 0,
            // Will be calculated in `estimateTotalHeight()`, as totalKnownHeight + an estimate for unknown rows
            _totalHeight         : 0,
            // Average of the known heights, kept up to date when entries in the heightMap are updated
            averageRowHeight     : 0,
            scrollTargetRecordId : null,
            // Used instead of scrollTargetRecordId for a row not yet lazy loaded, it has no record
            scrollTargetIndex    : null,
            refreshDetails       : {
                topRowIndex : 0,
                topRowTop   : 0
            }
        };
    }

    static delayable = {
        bufferedTranslateFromRow : 'raf'
    };

    // <debug>
    #syncRenderCount = 0;
    // </debug>

    //endregion

    //region Init

    construct(config) {
        config.grid._rowManager = this;

        super.construct(config.grid, config);
    }

    // Chained to client grid's doDestroy
    doDestroy() {
        // Run full cleanup on destroy.
        this.removeAllRows();
        super.doDestroy();
    }



    /**
     * Initializes the RowManager with Rows to fit specified height.
     * @param {Number} height
     * @param {Boolean} [isRendering]
     * @private
     * @category Init
     */
    initWithHeight(height, isRendering = false) {
        const me = this;

        // no valid height, make room for all rows
        if (me.autoHeight) {
            height = me.store.count * me.preciseRowOffsetHeight;
        }

        me.viewHeight = height;
        me.calculateRowCount(isRendering);

        return height;
    }

    /**
     * Releases all elements (not from dom), calculates how many are needed, creates those and renders
     * @returns {Boolean} `false` if reinitialization adjusted scroll position to ensure visibility
     * downwards), otherwise `true`
     */
    reinitialize(returnToTop = false) {
        const
            me     = this,
            result = {};

        // Calculate and correct the amount of rows needed (without triggering render)
        // Rows which are found to be surplus are destroyed.
        me.calculateRowCount(false, true, true);

        if (returnToTop) {
            me.topIndex = me.lastScrollTop = 0;
        }

        // If our row range is outside the store's range, render at the bottom
        // (possibly less jumpy than returning to top)
        if (me.topIndex + me.rowCount - 1 > me.storeCount) {
            me.topIndex = Math.max(0, me.storeCount - me.rowCount);
        }

        me.scrollTargetRecordId = me.scrollTargetIndex = null;

        const { topRow } = me;

        if (topRow) {
            // Ensure rendering from the topRow starts at the correct position
            topRow.dataIndex = me.topIndex;
            topRow.setTop(me.calculateTop(me.topIndex), true);
        }

        // Need to estimate height in case we have Grid using autoHeight
        me.estimateTotalHeight();

        me.renderFromRow(topRow);

        // Ensure we are scrolled to a position to see the top row, if we have one
        if (me.topRow) {
            me.ensureRowVisibility(result);
        }

        return result;
    }

    // Never leave whitespace after a reinitialize, if top row is not at the top, scroll it there.
    // This can happen if the data order was changed so that the previously top row is now further down, or up, for
    // example when grouping is applied
    ensureRowVisibility(result) {
        const
            me = this,
            { topRow : updatedTopRow, bottomRow : updatedBottomRow } = me,
            { scrollable } = me.grid;

        if (
            // Top row that is supposed to be visible (topRow + buffer) is below the top scroll
            (updatedTopRow.top > me.prependBufferHeight && updatedTopRow.top > scrollable.y) ||
            // Bottom row that is supposed to be visible (bottomRow - buffer) is above the bottom scroll
            (updatedBottomRow.bottom < scrollable.scrollHeight - me.appendBufferHeight && updatedBottomRow.bottom < scrollable.y + scrollable.clientHeight)
        ) {
            // Scroll to the top row, with buffer, to get the approximately correct rows into view
            result.scrollTop = updatedTopRow.top + me.prependBufferHeight;
        }
    }

    //endregion

    //region Rows

    /**
     * Add or remove rows to fit row count
     * @private
     * @category Rows
     */
    matchRowCount(skipRender = false) {

        const
            me             = this,
            { rows, grid, rowClass } = me,
            numRows        = rows.length,
            delta          = numRows - me.rowCount;

        if (delta) {
            if (delta < 0) {
                const newRows = [];

                // add rows
                for (let index = numRows, dataIndex = numRows ? rows[numRows - 1].dataIndex + 1 : 0; index < me.rowCount; index++, dataIndex++) {
                    newRows.push(rowClass.new({
                        cls        : grid.rowCls,
                        rowManager : me,
                        grid,
                        index,
                        dataIndex
                    }));
                }
                rows.push.apply(rows, newRows);
                // and elements (by triggering event used by SubGrid to add elements)
                me.trigger('addRows', { rows : newRows });

                // New rows start out empty, add cells for the columns currently in view (columns entering view later
                // get their cells added by Header#syncIntersections)
                for (const row of newRows) {
                    for (const columnRecord of grid.columns.intersectingColumns) {
                        row.addCell({ columnRecord, refresh : false });
                    }

                    row.updateAriaOwns();
                }

                me.positionCells();

                if (!skipRender) {
                    // render
                    me.renderFromRow(rows[Math.max(0, numRows - 1)]);
                }
            }
            else {
                // Remove rows from bottom
                const
                    // Not using grid.focusedCell here, since it wont be accurate during the removal
                    activeCell  = DomHelper.getActiveElement(grid)?.closest('.b-grid-cell'),
                    removedRows = rows.splice(numRows - delta, delta);

                // Focus is in the zone being removed, move focus up to new last row (focusedCell may be null here)
                if (numRows !== delta && grid.focusedCell && removedRows.some(row => row.cells.includes(activeCell))) {
                    rows[rows.length - 1].cells[grid.focusedCell.columnIndex].focus();
                }

                // Trigger event in case some feature needs to clean up when removing (widget column might be interested)
                me.trigger('removeRows', { rows : removedRows });

                removedRows.forEach(row => row.destroy());

                // Rows removed after a height change might lead to empty space at the bottom, fill it
                !skipRender && rows.length && me.fillBelow(me.lastScrollTop);
            }
        }
    }

    /**
     * Calculates how many rows fit in the available height (view height)
     * @private
     * @category Rows
     */
    calculateRowCount(skipMatchRowCount = false, allowRowCountShrink = true, skipRender = false) {
        // <remove-on-release>
        // TODO: replace prependRowBuffer, appendXX with bufferSize
        // </remove-on-release>
        const
            me                = this,
            { storeCount }    = me,
            visibleRowCount   = Math.ceil(me.viewHeight / me.minRowOffsetHeight), // Want whole rows
            maxRenderRowCount = visibleRowCount + me.prependRowBuffer + me.appendRowBuffer;

        // If RowManager is reinitialized in a hidden state the view might not have a height
        if (!me.grid.columns?.count || isNaN(visibleRowCount)) {
            me.rowCount = 0;
            return 0;
        }

        // when for example jumping we do not want to remove excess rows,
        // since we know they are needed at other scroll locations
        if (maxRenderRowCount < me.rowCount && !allowRowCountShrink) {
            return me.rowCount;
        }

        me.visibleRowCount = visibleRowCount;
        me.rowCount = Math.min(storeCount, maxRenderRowCount); // No need for more rows than data

        // If the row count doesn't match the calculated, ensure it matches,
        if (!skipMatchRowCount) {
            if (me.rows && me.rowCount !== me.rows.length) {
                me.matchRowCount(skipRender);
                // Rows might be pointing to data indices no longer available (when resetting to top topRow is already
                // adjusted, we don't need to take action here)
                if (me.bottomRow?.dataIndex >= storeCount && me.topRow.dataIndex !== 0) {
                    const indexDelta = me.bottomRow.dataIndex - storeCount + 1;
                    for (const row of me.rows) {
                        row.dataIndex -= indexDelta;
                    }
                    me.topIndex -= indexDelta;
                }
            }
            else if (!me.rowCount) {
                me.trigger('changeTotalHeight', { totalHeight : me.totalHeight });
            }
            me.grid.toggleEmptyText();
        }

        return me.rowCount;
    }

    /**
     * Animate adding or removing rows to/from the rows array.
     * @internal
     * @param {Number} index The index at which to insert or remove
     * @param {Number} count The number of rows to add. May be negative to remove.
     * @param {'add'|'remove'|'collapse'} [action] Action leading to the insert.
     */
    async insert(index, count, action) {
        // If the last insert has not been cleaned up, do it now, so we have a stable set of rows.
        this.nodeAnimationCleanup?.();

        const
            me               = this,
            {
                rows,
                rowCount,
                rowClass,
                grid
            }                = me,
            { element }      = grid,
            { rowCls }       = grid,
            newRowDataIndex  = rows[index - 1]?.dataIndex + 1 || 0,
            addedRows        = [],
            // durationMS       = DateHelper.as('ms', DomHelper.getStyleValue(grid.element, '--b-grid-row-splice-duration')),
            visibleRowsBelow = (me.lastVisibleRow?.index ?? 0) + 1 - index;

        me.inserting = action;

        let needsPrune;

        await grid.executeAndAwaitAnimations(element, () => {
            let affectedIds = null, affectedHeight = 0;

            // Removing a block of rows
            if (count < 0) {
                count = Math.abs(count);

                me.inserting += '-remove';

                const
                    visualRemoveCount     = newRowDataIndex >= grid.store.count ? count : Math.min(count, visibleRowsBelow),
                    visuallyRemovedRows   = rows.slice(index, index + visualRemoveCount),
                    visuallyRemovedHeight = visualRemoveCount > 0 ? visuallyRemovedRows[visuallyRemovedRows.length - 1].bottom - visuallyRemovedRows[0].top : 0,
                    outgoingElements      = [],
                    outgoingRows          = [],
                    repositioningRows     = [];

                affectedIds = visuallyRemovedRows.map(r => r.id);
                affectedHeight = visuallyRemovedHeight;

                // Leave clones of the outgoing rows in place so that the repurposed rows
                // will move up into that space without it looking blank
                for (let i = 0, { length } = visuallyRemovedRows; i < length; i++) {
                    const
                        removedRow  = visuallyRemovedRows[i],
                        outgoingEls = removedRow._elementsArray.map(cloneRowEl),
                        outgoingRow = rowClass.new({
                            rowManager     : me,
                            _elementsArray : outgoingEls,
                            _top           : removedRow.top,
                            grid
                        });

                    // Set lower z-index for group header rows so they appear behind child rows during animation
                    if (removedRow.isGroupHeader) {
                        outgoingEls.forEach(el => {
                            el.style.zIndex = '-1';
                        });
                    }

                    outgoingRows.push(outgoingRow);
                    outgoingElements.push(...outgoingEls);
                }

                // Adjust positions of rows after the remove block so that when refreshed
                // they appear to move up from after the remove block
                for (let i = index; i < rowCount; i++) {
                    repositioningRows.push(rows[i]);
                    rows[i].addCls('b-repositioning');
                    rows[i].setTop(rows[i].top + visuallyRemovedHeight);
                }
                // Prune the rows
                needsPrune = rows.length > grid.store.count;

                // Ensure the translations done above have been flushed to the layout so that animations
                // into place can now happen.
                outgoingElements[0]?.getBoundingClientRect();

                // Makes the row top positioning animate
                grid.addCls('b-splicing-rows', `b-splicing-rows-${action}`);

                // Slide outgoing clones upwards
                for (let i = 0, { length } = visuallyRemovedRows; i < length; i++) {
                    outgoingRows[i].setTop((rows[index - 2]?.bottom || 0), true);
                }

                me.nodeAnimationCleanup = () => {
                    if (!me.isDestroyed) {
                        me.nodeAnimationCleanup = null;
                        grid.removeCls('b-splicing-rows', `b-splicing-rows-${action}`);
                        outgoingElements.forEach(e => e.remove());
                        repositioningRows.forEach(e => e.removeCls?.('b-repositioning'));
                    }
                };
            }
            // Adding a block of rows
            else if (count > 0) {
                const
                    repositioningRows = [],
                    from              = index - (action === 'expand' ? 2 : 1),
                    fromTop           = rows[from]?.top || 0;

                me.inserting += '-add';

                count = grid.overflowingVertically
                    ? Math.min(count, (me.lastVisibleRow?.index ?? 0) + 1 - index)
                    : Math.min(count, Math.ceil((grid.scrollable.clientHeight - (rows[index - 1]?.bottom || 0)) / me.rowHeight));

                let newIndex  = index,
                    dataIndex = newRowDataIndex;

                for (let i = 0; i < count; i++, newIndex++, dataIndex++) {
                    addedRows.push(rowClass.new({
                        cls        : `${rowCls} b-adding`,
                        rowManager : me,
                        _top       : fromTop,
                        grid,
                        index      : newIndex,
                        dataIndex
                    }));
                }

                // <remove-on-release>
                // TODO: This is only an estimate, should possibly use the height of the rows that will be pushed out of
                //  view instead
                // </remove-on-release>
                affectedHeight = count * me.rowOffsetHeight;

                // Shift the rows which will become the rows following the new block down
                for (let i = index; i < me.rowCount; i++, newIndex++, dataIndex++) {
                    repositioningRows.push(rows[i]);
                    rows[i].addCls('b-repositioning');
                    rows[i].index = newIndex;
                    rows[i].dataIndex = dataIndex;
                }

                // We inserted a bunch of new rows. Have the RowManager
                // prune back to the calculated value.
                needsPrune = addedRows.length;

                me.nodeAnimationCleanup = () => {
                    if (!me.isDestroyed) {
                        me.nodeAnimationCleanup = null;
                        grid.removeCls('b-splicing-rows', `b-splicing-rows-${action}`);
                        addedRows.forEach(r => !r.isDestroyed && r.removeCls('b-adding'));
                        repositioningRows.forEach(e => e.removeCls?.('b-repositioning'));
                    }
                };

                // Insert the new block.
                rows.splice(index, 0, ...addedRows);

                // Add elements (by triggering event used by SubGrid to add elements)
                if (count > 0) {
                    me.rowCount += count;
                    me.trigger('addRows', { rows : addedRows });

                    // New rows start out empty, add cells for the columns currently in view (columns entering
                    // view later get their cells added by Header#syncIntersections)
                    for (const row of addedRows) {
                        for (const columnRecord of grid.columns.intersectingColumns) {
                            row.addCell({ columnRecord, refresh : false });
                        }

                        row.updateAriaOwns();
                    }
                }

                // Makes the row top positioning animate
                grid.addCls('b-splicing-rows', `b-splicing-rows-${action}`);
            }

            // Hooks so that Scheduler can prep events for transitioning
            grid.beforeAnimatedRowRemoval(affectedIds, affectedHeight);

            me.positionCells();

            me.renderFromRow(rows[index], true);

            grid.afterAnimatedRowRemoval(affectedIds, affectedHeight);
        });

        if (me.isDestroyed) {
            return;
        }

        me.nodeAnimationCleanup?.();

        if (needsPrune) {
            me.calculateRowCount(false, true, true);
        }
        me.estimateTotalHeight();

        me.inserting = null;

        return addedRows;
    }

    removeAllRows() {
        // remove rows from bottom
        const
            me         = this,
            { topRow } = me,
            result     = topRow ? (me.refreshDetails = {
                topRowIndex : topRow.dataIndex,
                topRowTop   : topRow.top
            }) : me.refreshDetails,
            removedRows = me.rows.slice();

        // trigger event in case some feature needs to cleanup when removing (widget column might be interested)
        me.trigger('removeRows', { rows : removedRows });

        me.rows.forEach(row => row.destroy());
        me.rows.length = 0;
        me.idMap = {};

        // We return a descriptor of the last rendered block before the remove.
        // This is primarily for a full GridBase#renderContents to be able to perform a correct refresh.
        return result;
    }

    setPosition(refreshDetails) {
        // Sets up the rendering position for the next call to reinitialize
        const
            { topRow }                 = this,
            { topRowIndex, topRowTop } = refreshDetails;

        // Top row might be missing if trial has expired
        if (topRow) {
            topRow.setTop(topRowTop);
            topRow.dataIndex = topRowIndex;
        }
    }

    // <remove-on-release>
    // Sanity checker to check rows are in order. Used in test.
    checkRowsAreOrdered() {
        const
            me       = this,
            { rows } = me;

        for (let i = 0, { length } = rows, index = rows[0]?.index, dataIndex = rows[0]?.dataIndex; i < length; i++, index++, dataIndex++) {
            const row = rows[i];

            if (row.index !== index || row.dataIndex !== dataIndex) {
                throw new Error(`row ${i} out of order`);
            }
        }
    }
    // </remove-on-release>

    //endregion

    //region Rows - Getters

    get store() {
        return this.client.store;
    }

    get storeCount() {
        let { count, lazyLoad } = this.store;

        // If the store is lazyLoaded, and a total value has not been provided, we add a chunk to the current count to
        // be able to scroll and load more records. The totalCount will be set when there is no more records to
        // be loaded
        if (count && lazyLoad && lazyLoad.totalCount == null) {
            count += lazyLoad.chunkSize;
        }
        return count;
    }

    /**
     * Get all Rows
     * @member {Grid.row.Row[]}
     * @readonly
     * @category Rows
     */
    get rows() {
        return this._rows;
    }

    /**
     * Get the Row at a specified store index. Returns `undefined` if the row index is not rendered.
     * @param {Number} index
     * @returns {Grid.row.Row|undefined}
     * @category Rows
     */
    getRow(index) {
        if (this.rowCount) {
            return this.rows[index - this.topIndex];
        }
    }

    /**
     * Get Row for specified record id
     * @param {Core.data.Model|String|Number} recordOrId Record id (or a record)
     * @returns {Grid.row.Row|null} Found Row or null if record not rendered
     * @category Rows
     */
    getRowById(recordOrId) {
        if (recordOrId && recordOrId.isModel) {
            recordOrId = recordOrId.id;
        }

        return this.idMap[recordOrId];
    }

    /**
     * Get a Row from an HTMLElement
     * @param {HTMLElement} element
     * @returns {Grid.row.Row|null} Found Row or null if record not rendered
     * @category Rows
     */
    getRowFromElement(element) {
        element = element.closest('.b-grid-row');
        return element && this.getRow(element.dataset.index);
    }

    /**
     * Get the row at the specified Y coordinate, which is by default viewport-based.
     * @param {Number} y The `Y` coordinate to find the Row for.
     * @param {Boolean} [local=false] Pass `true` if the `Y` coordinate is local to the SubGrid's element.
     * @returns {Grid.row.Row} Found Row or null if no row is rendered at that point.
     */
    getRowAt(y, local = false) {
        // Make it local.
        if (!local) {
            // Because this is used with event Y positions which are integers, we must
            // round the Rectangle to the closest integer.
            y -= Rectangle.from(this.grid.bodyContainer, null, true).roundPx(1).top;

            // Adjust for scrolling
            y += this.grid.scrollable.y;
        }
        y = DomHelper.roundPx(y);

        return this.rows.find(r => y >= r.top && y < r.bottom);
    }

    /**
     * Get a Row for either a record, a record id or an HTMLElement
     * @param {HTMLElement|Core.data.Model|String|Number} recordOrId Record or record id or HTMLElement
     * @returns {Grid.row.Row} Found Row or null if record not rendered
     * @category Rows
     */
    getRowFor(recordOrId) {
        if (recordOrId instanceof HTMLElement) {
            return this.getRowFromElement(recordOrId);
        }
        return this.getRowById(recordOrId);
    }

    /**
     * Gets the Row following the specified Row (by index or object). Wraps around the end.
     * @param {Number|Grid.row.Row} indexOrRow index or Row
     * @returns {Grid.row.Row}
     * @category Rows
     */
    getNextRow(indexOrRow) {
        const index = typeof indexOrRow === 'number' ? indexOrRow : indexOrRow.index;
        return this.getRow((index + 1) % this.rowCount);
    }

    /**
     * Get the Row that is currently displayed at top.
     * @member {Grid.row.Row}
     * @readonly
     * @category Rows
     */
    get topRow() {
        return this.rows[0];
    }

    /**
     * Get the Row currently displayed furthest down.
     * @member {Grid.row.Row}
     * @readonly
     * @category Rows
     */
    get bottomRow() {
        // <remove-on-release>
        // TODO: remove when ticket on making sure rowCount is always up to date is fixed
        // </remove-on-release>
        const rowCount = Math.min(this.rowCount, this.storeCount);

        return this.rows[rowCount - 1];
    }

    /**
     * Get the topmost visible Row
     * @member {Grid.row.Row}
     * @readonly
     * @category Rows
     */
    get firstVisibleRow() {
        const
            // Ceil scroll position to make behavior consistent on a scaled display
            scrollY = Math.ceil(this.grid.scrollable.y);

        // Ceil scroll position to make behavior consistent on a scaled display
        return this.rows.find(row => row.bottom > scrollY);
    }

    get firstFullyVisibleRow() {
        const
            // Ceil scroll position to make behavior consistent on a scaled display
            scrollY = Math.ceil(this.grid.scrollable.y);

        return this.rows.find(row => row.top >= scrollY) || this.rows.find(row => row.top < scrollY && row.bottom > scrollY);
    }

    /**
     * Get the last visible Row
     * @member {Grid.row.Row}
     * @readonly
     * @category Rows
     */
    get lastVisibleRow() {
        const { grid } = this;

        // We need the last row who's top is inside the scrolling viewport
        return ArrayHelper.findLast(this.rows, r => r.top < grid.scrollable.y + grid.bodyHeight);
    }

    get lastFullyVisibleRow() {
        const { grid } = this;

        // We need the last row who's bottom is inside the scrolling viewport
        return ArrayHelper.findLast(this.rows, r => r.bottom < grid.scrollable.y + grid.bodyHeight);
    }

    /**
     * Calls offset() for each Row passing along offset parameter
     * @param {Number} offset Pixels to translate Row elements.
     * @private
     * @category Rows
     */
    offsetRows(offset) {
        if (offset !== 0) {
            const
                { rows }   = this,
                { length } = rows;

            for (let i = 0; i < length; i++) {
                rows[i].offset(offset);
            }
        }

        this.trigger('offsetRows', { offset });
    }

    //endregion

    //region Row height

    get prependBufferHeight() {
        return this.prependRowBuffer * this.rowOffsetHeight;
    }

    get appendBufferHeight() {
        return this.appendRowBuffer * this.rowOffsetHeight;
    }

    /**
     * Set a fixed row height (can still be overridden by renderers) or get configured row height. Setting refreshes all rows
     * @member {Number} rowHeight
     * @on-owner
     * @category Rows
     */
    changeRowHeight(height) {
        ObjectHelper.assertNumber(height, 'rowHeight', true);

        if (height < 10) {
            //<debug>
            console.warn(`The rowHeight of ${height} was increased to 10 which is the minimum.`);
            //</debug>
            height = 10;
        }

        return height;
    }

    updateRowHeight(height, oldHeight) {
        const
            me                       = this,
            { grid, fixedRowHeight } = me;

        me.trigger('beforeRowHeight', { height });

        me.minRowHeight = height;

        if (fixedRowHeight) {
            me.averageRowHeight = height;
        }

        if (me.rows.length) {
            const
                oldY       = grid.scrollable.y,
                topRow     = me.getRowAt(oldY, true),
                // When changing rowHeight in a scrolled grid, there might no longer be a row at oldY
                edgeOffset = topRow ? topRow.top - oldY : 0;

            let average, oldAverage;

            // When using fixedRowHeight there is no need to update an average
            if (fixedRowHeight) {
                average = height;
                oldAverage = oldHeight;
            }
            else {
                oldAverage = average = me.averageRowHeight;

                me.clearKnownHeights();

                // Scale the average height in proportion to the row height change
                average *= height / oldHeight;
            }

            // Adjust number of rows, since it is only allowed to shrink in refresh()
            me.calculateRowCount(false, true, true);

            // Reposition the top row since it is used to position the rest
            me.topRow.setTop(me.topRow.dataIndex * (average /*+ grid._rowBorderHeight*/), true);

            me.refresh();

            const newY = oldY * (average / oldAverage);

            // Scroll top row to the same position.
            if (newY !== oldY) {
                grid.scrollRowIntoView(topRow.id, {
                    ...grid.defaultScrollOptions,
                    block : 'start',
                    edgeOffset
                });
            }
        }

        // Note that `rowRowHeight` below is triggered in Row.js, but it needs to be documented here since it is
        // triggered on the RowManager
        /**
         * Triggered when an individual rendered {@link Grid.row.Row} has its height changed.
         * @event rowRowHeight
         * @param {Grid.row.RowManager} source The firing RowManager instance.
         * @param {Grid.row.Row} row The row which is changing.
         * @param {Core.data.Model} record The row's record.
         * @param {Number} height The row's new height.
         * @param {Number} oldHeight The row's old height.
         * @private
         */
        /**
         * Triggered when the owning Grid's {@link Grid.view.Grid#property-rowHeight} is changed.
         * @event rowHeight
         * @param {Grid.row.RowManager} source The firing RowManager instance.
         * @param {Number} height The RowManager's new default row height.
         * @param {Number} oldHeight  The RowManager's old default row height.
         * @private
         */
        me.trigger('rowHeight', { height, oldHeight });
    }

    /**
     * Get actually used row height, which includes any border and might be an average if using variable row height.
     * @member {Number}
     * @readonly
     */
    get rowOffsetHeight() {
        return Math.floor(this.preciseRowOffsetHeight);
    }

    get preciseRowOffsetHeight() {
        return (this.averageRowHeight || this._rowHeight);
    }

    get minRowOffsetHeight() {
        return (this.minRowHeight || this._rowHeight);
    }

    /*
    * How store CRUD affects the height map:
    *
    * | Operation | Result                            |
    * |-----------|-----------------------------------|
    * | add       | No. Appears on render             |
    * | insert    | No. Appears on render             |
    * | remove    | Remove entry                      |
    * | removeAll | Clear                             |
    * | update    | No                                |
    * | replace   | Height might differ, remove entry |
    * | move      | No                                |
    * | filter    | No                                |
    * | sort      | No                                |
    * | group     | No                                |
    * | dataset   | Clear                             |
    *
    * The above is handled in GridBase
    */

    /**
     * Returns `true` if all rows have a known height. They do if all rows are visited, or if RowManager is configured
     * with `fixedRowHeight`. If so, all tops can be calculated exactly, no guessing needed
     * @member {Boolean}
     * @readonly
     * @private
     */
    get allHeightsKnown() {
        return this.fixedRowHeight || this.heightMap.size >= this.storeCount;
    }

    /**
     * Store supplied `height` using `id` as key in the height map. Called by `Row` when it gets its height.
     * Keeps `averageRowHeight` and `totalKnownHeight` up to date. Ignored when configured with `fixedRowHeight`
     * @param {String|Number} id
     * @param {Number} height
     * @internal
     */
    storeKnownHeight(id, height) {
        const
            me = this,
            { heightMap } = me;

        if (!me.fixedRowHeight) {
            // Decrease know height with old value
            if (heightMap.has(id)) {
                me.totalKnownHeight -= heightMap.get(id);
            }

            // Height here is "clientHeight"
            heightMap.set(id, height);

            // And increase with new
            me.totalKnownHeight += height;

            if (height < me.minRowHeight) {
                me.minRowHeight = height;
            }

            me.averageRowHeight = me.totalKnownHeight / heightMap.size;
        }
    }

    /**
     * Get the known or estimated offset height for the specified record id
     * @param {Core.data.Model} record
     * @returns {Number}
     * @private
     */
    getOffsetHeight(record) {
        const me = this;
        // record may not be there if height gets from row with already removed from the store record
        return ((record && me.heightMap.get(record.id)) || (record && me.grid.internalGetRowHeight(record)) || me.averageRowHeight || me.rowHeight);
    }

    /**
     * Invalidate cached height for a record. Removing it from `totalKnownHeight` and factoring it out of
     * `averageRowHeight`.
     * @param {Core.data.Model|Core.data.Model[]} records
     */
    invalidateKnownHeight(records) {
        const me = this;

        if (!me.fixedRowHeight) {
            const { heightMap } = me;

            records = ArrayHelper.asArray(records);

            records.forEach(record => {
                if (record) {
                    if (heightMap.has(record.id)) {
                        // Known height decreases when invalidating
                        me.totalKnownHeight -= heightMap.get(record.id);

                        heightMap.delete(record.id);
                    }
                }
            });

            me.averageRowHeight = me.totalKnownHeight / heightMap.size;
        }
    }

    /**
     * Invalidates all cached height and resets `averageRowHeight` and `totalKnownHeight`
     */
    clearKnownHeights() {
        this.heightMap.clear();
        this.averageRowHeight = this.totalKnownHeight = 0;
    }

    /**
     * Handles record id changes by updating the heightMap key and the Row's id.
     * @param {Object} params
     * @param {Core.data.Model} params.record The record whose id changed
     * @param {*} params.oldValue The old id value
     * @param {*} params.value The new id value
     * @private
     */
    onRecordIdChange({ record, oldValue, value }) {
        const { heightMap } = this;

        // Update the heightMap key if it exists for the old id
        if (!this.fixedRowHeight && heightMap.has(oldValue)) {
            const height = heightMap.get(oldValue);
            heightMap.delete(oldValue);
            heightMap.set(value, height);
        }

        // Update the Row's id to match the new record id.
        // The Row's id setter will automatically update idMap and cell DomDataStore.
        const row = this.idMap[oldValue];

        if (row) {
            row.id = value;
        }
    }

    /**
     * Calculates a row top from its data index. Uses known values from the height map, unknown are substituted with
     * the average row height. When configured with `fixedRowHeight`, it will always calculate a correct value
     * @param {Number} index Index in store
     * @private
     */
    calculateTop(index) {
        // When using fixed row height, life is easy
        if (this.fixedRowHeight) {
            return index * this.rowOffsetHeight;
        }

        const { storage } = this.store;

        let top = 0;

        // When not using fixed row height, we make an educated guess at the top. The more rows have been visited, the
        // more correct the guess is (fully correct if all rows visited)
        for (let i = 0; i < index; i++) {
            const record = storage.getAt(i);
            top += this.getOffsetHeight(record);
        }

        return Math.floor(top);
    }

    //endregion

    //region Calculations

    /**
     * Returns top and bottom for rendered row or estimated coordinates for unrendered.
     * @param {Core.data.Model|String|Number} recordOrId Record or record id
     * @param {Boolean} [local] Pass true to get relative record coordinates
     * @param {Boolean} [roughly] Pass true to allow a less exact but cheaper estimate
     * @returns {Core.helper.util.Rectangle} Record bounds with format { x, y, width, height, bottom, right }
     * @category Calculations
     */
    getRecordCoords(recordOrId, local = false, roughly = false) {
        const
            me  = this,
            row = me.getRowById(recordOrId);

        let scrollingViewport = me.client._bodyRectangle;

        // _bodyRectangle is not updated on page/containing element scroll etc. Need to make sure it is correct in case
        // that has happend. This if-statement should be removed when fixing
        if (!local) {
            scrollingViewport = me.client.refreshBodyRectangle();
        }
        // Rendered? Then we know position for certain
        if (row) {
            return new Rectangle(
                scrollingViewport.x,
                local ? Math.round(row.top) : Math.round(row.top + scrollingViewport.y - me.client.scrollable.y),
                Math.max(scrollingViewport.width, 0), // Width might go negative on very narrow screen
                row.offsetHeight
            );
        }

        const index = me.store.indexOf(recordOrId);

        return index !== -1 ? me.getRecordCoordsByIndex(index, local, roughly) : null;
    }

    /**
     * Returns top and bottom coordinates for specified row. If all heights are known, by for example using fixed row
     * height, the top is calculated exactly. If not, the top is estimated based on the closest known row.
     *
     * @param {Number} recordIndex Record index
     * @param {Boolean} [local]
     * @returns {Core.helper.util.Rectangle} Estimated record bounds
     * @category Calculations
     */
    getRecordCoordsByIndex(recordIndex, local = false, roughly = false) {
        const
            me                    = this,
            { topRow, bottomRow } = me,
            scrollingViewport     = me.client._bodyRectangle,
            // Not yet lazy loaded records have no id
            id                    = me.store.getAt(recordIndex)?.id,
            // Not using rowOffsetHeight since it floors the value and that rounding might give big errors far down
            height                = me.preciseRowOffsetHeight,
            currentTopIndex       = topRow.dataIndex,
            currentBottomIndex    = bottomRow.dataIndex,
            // Either known height or average
            maybeKnownHeight      = Math.floor(me.heightMap.get(id) ?? height);

        let recordY;

        // Scheduler has a pre-layout pass that ensures all row coords are known, no need for estimates
        if (me.allHeightsKnown && !roughly) {
            // All heights are known (all rows visited or fixed row height), get actual top coord
            const top = me.calculateTop(recordIndex);

            recordY = local ? top : top + scrollingViewport.y - me.client.scrollable.y;
        }
        else {
            const
                // Instead of estimating top from the very top, use closest known coordinate. Makes sure a coordinate is
                // not estimated on wrong side of rendered rows, needed to correctly draw dependencies where one event
                // is located on a unrendered row
                calculateFrom =
                // bottomRow is closest, calculate from it
                recordIndex > currentBottomIndex
                    ? { index : recordIndex - currentBottomIndex - 1, y : bottomRow.bottom, from : 'bottomRow' }
                    //  closer to topRow than 0, use topRow
                    : recordIndex > currentTopIndex / 2
                        ? { index : recordIndex - currentTopIndex, y : topRow.top, from : 'topRow' }
                        // closer to the very top, use it
                        : { index : recordIndex, y : 0, from : 'top' },
                // Estimate top
                top           = Math.floor(calculateFrom.y + calculateFrom.index * height);

            recordY = local
                ? calculateFrom.from === 'topRow'
                    // here, when are moving from the top row above, we want to be calculating things from bottom to top,
                    // so we first arrive at expected bottom (`top + height`), then deduct the row height from that -
                    // either known or average
                    // if row height is not known that is equivalent of just using `top`
                    ? top + height - maybeKnownHeight
                    : top
                : top + scrollingViewport.y - me.client.scrollable.y;
        }

        const result = new Rectangle(scrollingViewport.x, recordY, scrollingViewport.width, maybeKnownHeight);

        // Signal that it's not based on an element, so is only approximate.
        // Grid.scrollRowIntoView will have to go round again using the block options below to ensure it's correct.
        result.virtual = true;

        // When the block becomes visible, scroll it to the logical position using the scrollIntoView's block
        // option. If it's above, use block: 'start', if below, use block: 'end'.
        result.block = result.bottom < scrollingViewport.y ? 'start' : (result.y > scrollingViewport.bottom ? 'end' : 'nearest');

        return result;
    }

    /**
     * Total estimated grid height (used for scroller)
     * @member {Number}
     * @readonly
     * @category Calculations
     */
    get totalHeight() {
        return this._totalHeight;
    }

    //endregion

    //region Iteration etc.

    /**
     * Calls a function for each Row
     * @param {Function} fn Function that will be called with Row as first parameter
     * @category Iteration
     */
    forEach(fn) {
        this.rows.forEach(fn);
    }

    /**
     * Iterator that allows you to do for (let row of rowManager)
     * @category Iteration
     */
    [Symbol.iterator]() {
        return this.rows[Symbol.iterator]();
    }

    //endregion

    //region Cell positioning

    positionCells() {
        for (const row of this.rows) {
            row.positionCells();
        }

        this.grid.afterPositionCells();
        // For tests that check that cells are positioned correctly after a window resize etc.
        this.trigger('positionCells');
    }

    //endregion

    //region Scrolling & rendering

    // <debug>

    // Warn if rendering more than 6 times without yielding, those renders replace each other before anything is
    // painted. Counting renders of one synchronous run instead of renders within a time span keeps it independent of
    // machine speed, renders following separate events (each mouse move of a drag) are not excessive however fast
    // they come
    detectExcessiveRendering() {
        const me = this;

        if (++me.#syncRenderCount === 1) {
            queueMicrotask(() => me.#syncRenderCount = 0);
        }

        if (me.#syncRenderCount > 6) {
            console.warn('Excessive rendering detected');
        }
    }

    // </debug>

    /**
     * Refresh a single cell.
     * @param {Core.data.Model} record Record for row holding the cell that should be updated
     * @param {String|Number} columnId Column id to identify the cell within the row
     * @returns {Boolean} Returns `true` if cell was found and refreshed, `false` if not
     */
    refreshCell(record, columnId) {
        const cellContext = new GridLocation({ grid : this.grid, record, columnId });

        return Boolean(cellContext.cell && cellContext.row.renderCell(cellContext));
    }

    /**
     * Renders from the top of the grid, also resetting scroll to top. Used for example when collapsing all groups.
     * @category Scrolling & rendering
     */
    returnToTop() {
        const me = this;

        me.topIndex = 0;
        me.lastScrollTop = 0;

        if (me.topRow) {
            me.topRow.dataIndex = 0;

            // Force the top row to the top of the scroll range
            me.topRow.setTop(0, true);
        }

        me.refresh();

        // Rows rendered from top, make sure grid is scrolled to top also
        me.grid.scrollable.y = 0;
    }

    /**
     * Renders from specified records row and down (used for example when collapsing a group, does not affect rows above).
     * @param {Core.data.Model} record Record of first row to render
     * @category Scrolling & rendering
     */
    renderFromRecord(record) {
        const row = this.getRowById(record.id);
        if (row) {
            this.renderFromRow(row);
        }
    }

    /**
     * Renders from specified row and down (used for example when collapsing a group, does not affect rows above).
     * @param {Grid.row.Row} fromRow First row to render
     * @category Scrolling & rendering
     */
    renderFromRow(fromRow = null, animatingRowPosition = false) {

        const
            me = this,
            {
                rows,
                store,
                topIndex,
                topRow,
                storeCount
            }            = me;
        let fromRowIndex = fromRow ? rows.indexOf(fromRow) : 0;

        // Calculate row count, adding rows if needed, but do not rerender - we are going to do that below.
        // Allow removing rows if we have more than store have rows.
        if (me.calculateRowCount(false, storeCount < rows.length && !animatingRowPosition, true) === 0) {
            // Reestimate total height. Possible if all records deleted
            me.estimateTotalHeight(true);
            return;
        }

        // calculateRowCount() may prune rows and invalidate the requested start row.
        // Repoint to a valid rendered row and continue rendering in this pass.
        if (fromRowIndex >= rows.length || fromRowIndex < 0) {
            if (animatingRowPosition) {
                me.nodeAnimationCleanup?.();
                animatingRowPosition = false;
            }
            fromRowIndex = Math.max(0, Math.min(fromRowIndex, rows.length - 1));
            fromRow      = rows[fromRowIndex] || topRow;
        }

        // If the topIndex has decreased (rows above has been removed) we need to recalculate the top, and render from
        // there
        if (me.topIndex < topIndex) {
            me.topRow.setTop(me.calculateTop(me.topIndex), true);
            fromRowIndex = 0;
            fromRow      = me.topRow;
        }
        // If the fromRow has been removed by calculateRowCount, use row at same index or top row
        else if (fromRow && rows.indexOf(fromRow) < 0) {
            fromRow = rows[fromRowIndex] || topRow;
        }

        // starting either from its specified dataIndex or from its index (happens on first render, no dataIndex yet)
        let dataIndex = fromRow ? fromRow.dataIndex : rows[0].dataIndex;
        const
            // amount of records after this one in store
            recordsAfter = storeCount - dataIndex - 1,
            // render to this row, either the last row or the row which will hold the last record available
            toRowIndex   = Math.min(rows.length - 1, fromRowIndex + recordsAfter);
        let
            // amount of rows which won't be rendered below last record (if we have fewer records than topRow + row count)
            leftOverCount = rows.length - toRowIndex - 1,
            // Start with top correctly just below the previous row's bottom
            top           = fromRowIndex > 0 ? rows[fromRowIndex - 1].bottom : rows[fromRowIndex].top,
            row;
        const newTops = [];

        if (fromRowIndex === 0 && me.topIndex === 0) top = 0;

        // _rows array is ordered in display order, just iterate to the end
        // Render first, then set top in order not to break fragile CSS transitions
        for (let i = fromRowIndex; i <= toRowIndex; i++) {
            row = rows[i];
            // Needed in scheduler when translating events, happens before render
            row.dataIndex = dataIndex;

            if (animatingRowPosition) {
                newTops[i] = top;
            }
            else {
                row.setTop(top, true);
            }
            row.render(dataIndex, store.getAt(dataIndex++), false);
            top += row.offsetHeight;
        }

        if (animatingRowPosition) {
            rows[fromRowIndex].element.getBoundingClientRect();

            // Set tops as a single operation
            for (let i = fromRowIndex; i <= toRowIndex; i++) {
                rows[i].setTop(newTops[i], true);
            }
        }

        // if number for records to display has decreased, for example by collapsing a node, we might get unused rows
        // below bottom. move those to top to not have unused rows laying around
        // Guard against calling displayRecordAtTop when topIndex is already 0: it needs topIndex > 0 to
        // compute a valid recordIndex (topIndex - 1) and would otherwise decrement topIndex below 0.
        // This edge case can occur when row recycling is needed at the viewport top, and must be
        // prevented to maintain rowManager invariants. See #13164.
        while (leftOverCount-- > 0 && me.topIndex > 0) {
            me.displayRecordAtTop();
        }

        // Renderers might yield a lower row height than the configured, leaving blank space at bottom
        if (me.bottomRow.bottom < me.viewHeight + me.lastScrollTop) {
            me.calculateRowCount();
        }

        // Reestimate total height
        me.estimateTotalHeight(true);

        // <debug>
        VersionHelper.isTestEnv && me.grid.detectExcessiveRendering !== false && me.detectExcessiveRendering();
        // </debug>

        me.trigger('renderDone');
    }

    // Add cell to all rows for the specified column (called when a column enters view)
    addColumnCells({ columnRecord }) {
        for (const row of this.rows) {
            row.addCell({ columnRecord });
        }
    }

    // Remove cell from all rows for the specified column (called when a column leaves view)
    removeColumnCells({ columnRecord }) {
        for (const row of this.rows) {
            row.removeCell({ columnRecord });
        }
    }

    // Align cells with headers for all rows (headers dictate size and position)
    alignCells() {
        for (const row of this.rows) {
            row.alignCells();
        }
    }

    /**
     * Renders the passed array (or [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)) of {@link Grid.row.Row rows}
     * @param {Grid.row.Row[]|Set} rows The rows to render
     * @category Scrolling & rendering
     */
    renderRows(rows) {

        let oldHeight,
            heightChanged = false;

        rows = Array.from(rows);

        // Sort topmost row first
        rows.sort((a, b) => a.dataIndex - b.dataIndex);

        // Render the requested rows.
        for (const row of rows) {
            oldHeight = row.height;

            // Pass updatingSingleRow as false, so that it does not shuffle following
            // rows downwards on each render. We do that once here after the rows are all refreshed.
            row.render(null, null, false);
            heightChanged |= row.height !== oldHeight;
        }

        // If this caused a height change, shuffle following rows.
        if (heightChanged) {
            this.translateFromRow(rows[0]);
        }

        // <debug>
        VersionHelper.isTestEnv && this.grid.detectExcessiveRendering !== false && this.detectExcessiveRendering();
        // </debug>

        this.trigger('renderDone');
    }

    bufferedTranslateFromRow() {
        this.translateFromRow(this.topRow);
    }

    /**
     * Translates all rows after the specified row. Used when a single rows height is changed and the others should
     * rearrange. (Called from Row#render)
     * @param {Grid.row.Row} fromRow
     * @private
     * @category Scrolling & rendering
     */
    translateFromRow(fromRow, batch = false) {
        const me = this;

        let top = fromRow.bottom,
            row, index;

        for (index = fromRow.dataIndex + 1, row = me.getRow(index); row; row = me.getRow(++index)) {
            top = row.translate(top);
        }

        // Reestimate total height
        if (!batch) {
            me.estimateTotalHeight(true);
        }
    }

    /**
     * Rerender all rows
     * @category Scrolling & rendering
     * @privateparam {Boolean} force Force re-rendering even if there are no rows currently
     */
    refresh(force = false) {
        const
            me         = this,
            { topRow } = me;

        // too early
        if ((!topRow && !force) || me.grid.refreshSuspended) {
            return;
        }

        me.idMap = {};

        me.renderFromRow(topRow);

        me.trigger('refresh');
    }

    /**
     * Makes sure that specified record is displayed in view
     * @param {Number} newScrollTop Top of visible section
     * @param {Number} [forceRecordIndex] Index of record to display at center
     * @private
     * @category Scrolling & rendering
     */
    jumpToPosition(newScrollTop, forceRecordIndex) {
        // There are two very different requirements here.
        // If there is a forceRecordIndex, that takes precedence to get it into the center of the
        // viewport, and wherever we render the calculated row block, we may then *adjust the scrollTop*
        // to get that row to the center.
        //
        // If there's no forceRecordIndex, then the scroll position is the primary objective and
        // we must render what we calculate to be correct at that viewport position.
        const
            me                               = this,
            { store, heightMap, storeCount } = me;

        if (me.allHeightsKnown && !me.fixedRowHeight) {
            const
                top    = newScrollTop - me.prependBufferHeight,
                border = /*me.grid._rowBorderHeight*/0;

            let accumulated = 0,
                targetIndex = 0;

            while (accumulated < top) {
                const record = store.records[targetIndex];

                accumulated += heightMap.get(record.id) + border;

                targetIndex++;
            }

            const startIndex = Math.max(Math.min(targetIndex, storeCount - me.rowCount), 0);

            me.lastScrollTop = newScrollTop;
            me.topRow.dataIndex = me.topIndex = startIndex;

            me.topRow.setTop(me.calculateTop(startIndex), false);

            // render entire buffer
            me.refresh();
        }
        else {
            const
                rowHeight      = me.preciseRowOffsetHeight,
                // Calculate index of the top of the rendered block.
                // If we are targeting the scrollTop, this will be the top index at the scrollTop minus prepend count.
                // If we are targeting a recordIndex, this will attempt to place that in the center of the rendered block.
                targetIndex    = forceRecordIndex == null ? Math.floor(newScrollTop / rowHeight) - me.prependRowBuffer : forceRecordIndex - Math.floor(me.rowCount / 2),
                startIndex     = Math.max(Math.min(targetIndex, storeCount - me.rowCount), 0),
                viewportTop    = me.client.scrollable.y,
                viewportBottom = Math.min(me.client._bodyRectangle.height + viewportTop + me.appendBufferHeight, me.totalHeight);

            me.lastScrollTop = newScrollTop;
            me.topRow.dataIndex = me.topIndex = startIndex;

            me.topRow.setTop(Math.floor(startIndex * rowHeight), false);

            // render entire buffer
            me.refresh();

            // <remove-on-release>
            // TODO: It is likely the approach below will be needed for scrolling in opposite direction also, although no
            //   problem encountered yet
            // </remove-on-release>

            // Not filled all the way down?
            if (me.bottomRow.bottom < viewportBottom) {
                // Might have jumped into a section of low heights. Needs to be done after the refresh, since heights
                // are not known before it
                me.calculateRowCount(false, false, false);

                // Fill with available rows (might be available above buffer because of var row height), stop if we run out of records
                while (me.bottomRow.bottom < viewportBottom && me._rows[me.prependRowBuffer].top < viewportTop && me.bottomRow.dataIndex < storeCount - 1) {
                    me.displayRecordAtBottom();
                }

                // <remove-on-release>
                // TODO: Block below was not needed for current tests, but if row height in one block is enough smaller
                //  than average row height then we will need to add more rows
                //
                // Still not filled all the way down? Need more rows
                // if (me.bottomRow.bottom < viewportBottom) {
                //     //const localAverage = blockHeight / me.rowCount;
                //     while (me.bottomRow.bottom < viewportBottom) {
                //        me.addRecordAtBottom();
                //     }
                // }
                // </remove-on-release>
            }

            me.estimateTotalHeight();
        }

        // If the row index is our priority, then scroll it into the center
        if (forceRecordIndex != null) {
            const
                { scrollable } = me.grid,
                targetRow      = me.getRow(forceRecordIndex),
                // When coming from a block of high rowHeights to one with much lower we might still miss the target...
                // <remove-on-release>
                // TODO: Jump again in these cases?
                // </remove-on-release>
                rowCenter      = targetRow && Rectangle.from(targetRow._elementsArray[0]).center.y,
                viewportCenter = scrollable.viewport.center.y;

            // Scroll the targetRow into the center of the viewport
            if (targetRow) {
                scrollable.y = newScrollTop = Math.floor(scrollable.y + (rowCenter - viewportCenter));
            }
        }

        return newScrollTop;
    }

    /**
     * Jumps to a position if it is far enough from current position. Otherwise does nothing.
     * @private
     * @category Scrolling & rendering
     */
    warpIfNeeded(newScrollTop) {
        const
            me     = this,
            result = { newScrollTop, deltaTop : newScrollTop - me.lastScrollTop };

        // if gap to fill is large enough, better to jump there than to fill row by row
        if (Math.abs(result.deltaTop) > (me.rowCount * me.rowOffsetHeight) * 3) {
            // no specific record targeted
            let index;

            // Specific record specified as target of scroll?
            if (me.scrollTargetRecordId) {
                index = me.store.indexOf(me.scrollTargetRecordId);

                // since scroll is happening async record might have been removed after requesting scroll,
                // in that case we rely on calculated index (as when scrolling without target)
            }
            else if (me.scrollTargetIndex != null) {
                index = me.scrollTargetIndex;
            }

            // We are jumping, so the focused row will derender
            me.grid.onFocusedRowDerender();

            // perform the jump and return results
            result.newScrollTop = me.jumpToPosition(newScrollTop, index);
            result.deltaTop = 0; // no extra filling needed
        }

        return result;
    }

    /**
     * Handles virtual rendering (only visible rows + buffer are in dom) for rows
     * @param {Number} newScrollTop The `Y` scroll position for which to render rows.
     * @param {Boolean} [force=false] Pass `true` to update the rendered row block even if the scroll position has not changed.
     * @returns {Number} Adjusted height required to fit rows
     * @private
     * @category Scrolling & rendering
     */
    updateRenderedRows(newScrollTop, force, ignoreError = false) {
        const me = this;

        // Might be triggered after removing all records, should not crash
        if (me.rowCount === 0) {
            return 0;
        }

        let result = me.totalHeight;

        if (
            force ||
            // Only react if we have scrolled by one row or more
            Math.abs(newScrollTop - me.lastScrollTop) >= me.rowOffsetHeight ||
            // or if we have a gap at top/bottom (#9375)
            me.topRow.top > newScrollTop ||
            me.bottomRow.bottom < newScrollTop + me.viewHeight
        ) {
            // If scrolled by a large amount, jump instead of rendering each row
            const posInfo = me.warpIfNeeded(newScrollTop);

            me.scrollTargetRecordId = me.scrollTargetIndex = null;

            // Cache the last correct render scrollTop before fill.
            // it can be adjusted to hide row position corrections.
            me.lastScrollTop = posInfo.newScrollTop;

            if (posInfo.deltaTop > 0) {
                // Scrolling down
                me.fillBelow(posInfo.newScrollTop);
            }
            else if (posInfo.deltaTop < 0) {
                // Scrolling up
                me.fillAbove(posInfo.newScrollTop);
            }

            if (!me.fixedRowHeight && !ignoreError) {
                me.correctError(posInfo, newScrollTop);
            }

            // Calculate the new height based on new content
            result = me.estimateTotalHeight();
        }

        return result;
    }

    correctError(posInfo, newScrollTop) {
        const me = this;

        let error = 0;

        // <remove-on-release>
        // TODO: Merge with else, does the same calculation
        // </remove-on-release>
        // When we transition from not knowing all heights to doing so, the old estimate will likely have positioned
        // rows a bit off. Compensate for that here.
        if (me.allHeightsKnown) {
            error = me.topRow.top - me.calculateTop(me.topRow.dataIndex);
        }
        // If it's a temporary scroll, we can be told to ignore the drift.
        // Apart from that, we must correct keep the rendered block position correct.
        // Otherwise, when rolling upwards after a teleport, we may not be able to reach
        // the top. Some rows may end up at -ve positions.
        // Only correct the rendered block position if we are in danger of running out of scroll space.
        // That is if we are getting towards the top or bottom of the scroll range.
        else if (
            // Scrolling up within top zone
            (posInfo.deltaTop < 0 && newScrollTop < me.viewHeight * 2) ||
            // Scrolling down within bottom zone
            (posInfo.deltaTop > 0 && newScrollTop > me.totalHeight - me.viewHeight * 2 - 3)
        ) {
            // <remove-on-release>
            // TODO: Calc could be eased more, using distance left to have less effect the further away from top/bottom
            // </remove-on-release>
            error = me.topRow.top - me.calculateTop(me.topRow.dataIndex); //me.topIndex * me.rowOffsetHeight;
        }

        if (error) {
            // Correct the rendered block position if it's not at the calculated position.
            // Keep the visual position correct by adjusting the scrollTop by the same amount.
            // When variable row heights are used, this will keep the rendered block top correct.
            me.offsetRows(-error);
            me.grid.scrollable.y = me.lastScrollTop = me.grid.scrollable.y - error;
        }
    }

    /**
     * Moves as many rows from the bottom to the top that are needed to fill to current scroll pos.
      @param {Number} newTop Scroll position
     * @private
     * @category Scrolling & rendering
     */
    fillAbove(newTop) {
        const
            me           = this,
            { rows }     = me,
            prependIndex = Math.min(me.prependRowBuffer, rows.length - 1);

        while (
            // Prepend buffer should be above viewport
            rows[prependIndex].top > newTop &&
            // unless we have reached the top
            me.topIndex > 0
        ) {
            me.displayRecordAtTop();
        }

        me.trigger('renderDone');
    }

    /**
     * Moves as many rows from the top to the bottom that are needed to fill to current scroll pos.
     * @param {Number} newTop Scroll position
     * @private
     * @category Scrolling & rendering
     */
    fillBelow(newTop) {
        const
            me                   = this,
            { rows, storeCount } = me,
            { length }           = rows,
            appendIndex          = Math.min(length - Math.min(me.appendRowBuffer, length - 1), length - 1),
            newBottom            = newTop + me.viewHeight;

        while (
            // Append buffer should be below viewport
            rows[appendIndex].top < newBottom &&
            // unless we have reached the bottom
            me.bottomRow.dataIndex < storeCount - 1
        ) {
            me.displayRecordAtBottom();
        }

        me.trigger('renderDone');
    }

    /**
     * Estimates height needed to fit all rows, based on average row height. Also offsets rows if needed to not be above
     * the reachable area of the view.
     * @param {Boolean} [immediate] Specify true to pass the `immediate` flag on to any listeners (probably only Grid
     * cares. Used to bypass buffered element resize)
     * @returns {Number}
     * @private
     * @category Scrolling & rendering
     */
    estimateTotalHeight(immediate = false) {
        const me = this;

        if (me.grid.renderingRows) {
            return;
        }

        const
            { bottomRow, storeCount } = me,
            unknownCount              = storeCount - me.heightMap.size;

        let estimate;

        // No need to estimate when using fixed row height
        if (me.fixedRowHeight) {
            estimate = storeCount * me.rowOffsetHeight;
        }
        else {
            estimate =
                // Known height, from entries in heightMap
                me.totalKnownHeight +
                // Those heights are "clientHeights", estimate needs to include borders
                // me.heightMap.size * me.grid._rowBorderHeight +
                // Add estimate for rows with unknown height
                unknownCount * me.preciseRowOffsetHeight;

            // No bottomRow yet if estimating initial height in autoHeight grid
            if (bottomRow && unknownCount) {
                const bottom = bottomRow.bottom;

                // Too low estimate or reached the end with scroll left, adjust to fit current bottom
                if (bottom > estimate || (me.topIndex + me.rowCount >= storeCount && estimate > bottom && bottom > 0)) {
                    estimate = bottom;

                    // estimate all the way down
                    if (bottomRow.dataIndex < storeCount - 1) {
                        estimate += (storeCount - 1 - bottomRow.dataIndex) * me.preciseRowOffsetHeight;
                    }
                }
            }

            estimate = Math.floor(estimate);
        }

        if (estimate !== me.totalHeight) {
            if (me.trigger('changeTotalHeight', { totalHeight : estimate, immediate }) !== false) {
                me._totalHeight = estimate;
            }
        }

        return estimate;
    }

    /**
     * Moves a row from bottom to top and renders the corresponding record to it.
     * @returns {Number} New row height
     * @private
     * @category Scrolling & rendering
     */
    displayRecordAtTop() {
        const
            me           = this,
            { grid }     = me,
            recordIndex  = me.topIndex - 1,
            record       = me.store.getAt(recordIndex),
            // Row currently rendered at the bottom, the row we want to move
            bottomRow    = me.bottomRow,
            bottomRowTop = bottomRow.top;

        me.trigger('beforeTranslateRow', {
            row       : bottomRow,
            newRecord : record
        });

        // If focused cell is being scrolled off...
        if (bottomRow.dataIndex === grid.focusedCell?.rowIndex) {
            grid.onFocusedRowDerender();
        }

        // estimated top, for rendering that depends on having top
        bottomRow._top = me.topRow.top - me.getOffsetHeight(record);
        // if configured with fixed row height, it will be the correct value
        bottomRow.estimatedTop = !me.fixedRowHeight;

        bottomRow.dataIndex = recordIndex;
        // Render row
        bottomRow.render(recordIndex, record, false);

        // Move it to top. Restore top so that the setter won't reject non-change
        // if the estimate happened to be correct.
        bottomRow._top = bottomRowTop;
        bottomRow.setBottom(me.topRow.top);
        bottomRow.estimatedTop = false;

        // Prev row is now at top
        me.topIndex--;

        // move to start of array (bottomRow becomes topRow)
        me._rows.unshift(me._rows.pop());
        me.fixIndices();

        return bottomRow.offsetHeight;
    }

    /**
     * Moves a row from top to bottom and renders the corresponding record to it.
     * @returns {Number} New row height
     * @private
     * @category Scrolling & rendering
     */
    displayRecordAtBottom() {
        const
            me          = this,
            { grid }    = me,
            recordIndex = me.topIndex + me.rowCount,
            record      = me.store.getAt(recordIndex),
            // Row currently rendered on the top, the row we want to move
            topRow      = me.topRow;

        me.trigger('beforeTranslateRow', {
            row       : topRow,
            newRecord : record
        });

        // If focused cell is being scrolled off...
        if (topRow.dataIndex === grid.focusedCell?.rowIndex) {
            grid.onFocusedRowDerender();
        }

        topRow.dataIndex = recordIndex;

        // Move it to bottom
        topRow.setTop(me.bottomRow.bottom);
        // Render row
        topRow.render(recordIndex, record, false);

        // Next row is now at top
        me.topIndex++;

        // move to end of array (topRow becomes bottomRow)
        me._rows.push(me._rows.shift());
        me.fixIndices();

        return topRow.offsetHeight;
    }

    fixIndices() {
        for (let i = 0, { rows } = this, { length } = rows; i < length; i++) {
            rows[i].index = i;
        }
    }

    //endregion
}

RowManager.featureClass = '';
