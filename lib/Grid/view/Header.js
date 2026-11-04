import Bar from './Bar.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import Tooltip from '../../Core/widget/Tooltip.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import ResizeMonitor from '../../Core/helper/ResizeMonitor.js';

DomHelper.loadStylesheet('Grid/view/Header.css');

// import Stylesheet from './Header.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Header');

/**
 * @module Grid/view/Header
 */

// When virtualizing columns, cells only exist for intersecting columns. Screen readers pair a cell with its column
// header by position, so only the headers of those columns may count as columns, others would shift the pairing of all
// cells after them. `aria-colindex` still conveys each column's position among all columns
const isAriaExposed = column => !column.grid?.virtualizeColumns || Boolean(column.meta.isIntersecting);

/**
 * The Grid header, which contains simple columns but also allows grouped columns. One instance is created and used per SubGrid
 * automatically, you should not need to instantiate this class manually. See {@link Grid.column.Column} for information about
 * column configuration.
 *
 * {@inlineexample Grid/view/Header.js}
 *
 * @extends Grid/view/Bar
 * @internal
 */
export default class Header extends Bar {
    static $name = 'Header';

    static type = 'gridheader';

    construct(...args) {
        this.handleColumnResize = this.handleColumnResize.bind(this);

        super.construct(...args);
    }

    static delayable = {
        doColumnResize : 'asap'
    };

    //region Positioning

    // Reposition all cells when any header is resized, since its size will affect the position of cells following it
    // (could be slightly optimized by only repositioning the affected cells)
    handleColumnResize(element, oldRect, newRect) {
        const
            me       = this,
            { grid } = me;
        if (!me.isDestroyed && grid && (!oldRect || newRect.width !== oldRect.width) && !grid.features.columnReorder?.isReordering) {
            me.$hasChangedColumns = true;
            me.doColumnResize();
        }
    }

    doColumnResize() {
        if (this.$hasChangedColumns) {
            this.cachePositions();
            this.grid.rowManager.positionCells();
            this.$hasChangedColumns = false;
        }
    }

    // Cache position of all headers, used to position the cells in the grid.
    cachePositions() {
        const
            me                      = this,
            { rtl, contentElement } = me,
            containerRect           = contentElement.getBoundingClientRect();

        // https://github.com/bryntum/bryntum/issues/12963
        // When the grid is inside a hidden container (e.g. a closed Popup), getBoundingClientRect returns zeros.
        // Writing zeros to column meta would cause rows to render with width 0. Skip caching to preserve the last
        // known good column positions, which will be refreshed when the grid becomes visible again.
        // Check both dimensions: a visible subgrid may legitimately have zero width (e.g. when locked columns
        // consume all available space) but will still have non-zero height.
        if (!containerRect.width && !containerRect.height) {
            return;
        }

        const
            { scrollLeft, offsetWidth } = contentElement,
            // https://github.com/bryntum/bryntum/issues/11036
            // Determine if a zoom factor is in use. This is needed to correctly calculate header cell positions, which
            // are then used to position the body cells in the grid. `getBoundingClientRect` returns sizes and positions
            // in CSS pixels after applying zoom, but setting CSS width to the same value would apply the zoom a second
            // time. `offsetWidth` returns layout pixels (unzoomed) as an integer, so we round `containerRect.width`
            // to the same granularity before dividing to avoid subpixel discrepancies producing a spurious zoom factor
            // when no zoom is in use.
            zoomFactor = offsetWidth ? Math.round(containerRect.width) / offsetWidth : 1;

        // Cache the view width for syncIntersections, which runs on every scroll event and must not read layout.
        // All paths that change the width (paint, subgrid / window resize) re-run cachePositions
        me.$clientWidth = me.element.clientWidth;

        for (const column of me.columns.visibleColumns) {
            const headerElement = me.getHeader(column.id);
            if (headerElement) {
                const
                    headerRect = headerElement.getBoundingClientRect(),
                    newWidth   = headerRect.width / zoomFactor,
                    oldWidth   = column.meta.width;

                // Calculate position relative to container, accounting for scroll position.
                // Prevent zoom from being applied twice.
                let x = (headerRect.left - containerRect.left) / zoomFactor + scrollLeft;

                if (rtl) {
                    x = (containerRect.width / zoomFactor) - x - newWidth;
                }

                column.meta.width = newWidth;
                column.meta.x = x;

                if (oldWidth !== newWidth) {
                    column.internalOnWidthChanged?.({ width : newWidth, oldWidth });
                }
            }
        }

        // Positions changed, columns might have entered or left view
        me.syncIntersections();
    }

    observe(headerElement) {
        ResizeMonitor.addResizeListener(headerElement, this.handleColumnResize);
    }

    unobserve(headerElement) {
        const
            me           = this,
            columnRecord = me.columns.getById(headerElement.dataset.columnId);

        // We might be unobserving because of column removal, in which case syncIntersections() won't see the column
        // again. Clear the flag so the column doesn't render cells if later re-added out of view
        if (columnRecord) {
            columnRecord.meta.isIntersecting = false;
        }

        me.grid.columns._intersectingColumns = me.columns._intersectingColumns = null;

        ResizeMonitor.removeResizeListener(headerElement, me.handleColumnResize);
    }

    /**
     * Determines which columns intersect the subgrid's viewport, using the header positions cached by
     * `cachePositions()` and the current scroll position, then adds / removes cells for columns that entered / left
     * view. Called when scrolling horizontally and after caching positions (which happens on paint, column resize,
     * reorder and show / hide etc.)
     * @private
     */
    syncIntersections() {
        const
            me                = this,
            { subGrid, grid } = me;

        // Unit tests create naked SubGrids, hence the checks.
        // Syncing is suspended during column collapse / expand transitions (see Column#onCollapseChange), whose
        // animating header widths would otherwise trigger cell removal for the transitioning columns
        if (!grid?.virtualizeColumns || !grid.rowManager || grid.$suspendColumnCellSync) {
            return;
        }

        const
            { rowManager }     = grid,
            // As a Set, since this function runs per scroll event and Array#includes in the loop below would make
            // it O(n²) in column count
            visibleColumnSet   = grid.columns.visibleColumns.asSet,
            { leaves }         = me.columns,
            // The column in a single column subgrid spans the subgrid's full scrollable width and thus always
            // intersects the view, no geometry checks needed (for example the time axis column in Scheduler)
            singleColumn       = leaves.length === 1,
            // A numeric virtualizeColumns extends the range in which columns are considered in view, by that
            // amount of pixels on each side
            buffer             = typeof grid.virtualizeColumns === 'number' ? grid.virtualizeColumns : 0,
            // Scroller#x is always positive, proceeding in the reading direction, matching the logical `meta.x`
            // cached by cachePositions(). All values are in layout (unzoomed) pixels. The view width is cached by
            // cachePositions() to avoid forcing layout on every scroll event
            scrollX            = subGrid.scrollable.x,
            viewStart          = scrollX - buffer,
            viewEnd            = scrollX + (me.$clientWidth ?? me.element.clientWidth) + buffer,
            { focusedCell }    = grid,
            // The column containing the focus location keeps its cells even when outside the view
            focusedColumnId    = focusedCell?.rowIndex >= 0 ? focusedCell.columnId : null,
            added              = [],
            removed            = [];

        for (const column of leaves) {
            const
                { meta }     = column,
                intersecting = column.isVisible && visibleColumnSet.has(column) && (singleColumn ||
                    (!subGrid.collapsed && (column.id === focusedColumnId ||
                        // autoHeight column's cells always render, otherwise row heights would depend on horizontal
                        // scroll position. Same for columns opted out of virtualization with alwaysRenderCells (used
                        // for example when a renderer supplies row height)
                        column.autoHeight || column.alwaysRenderCells ||
                        (meta.x < viewEnd && meta.x + meta.width > viewStart))));

            if (Boolean(meta.isIntersecting) !== intersecting) {
                meta.isIntersecting = intersecting;
                (intersecting ? added : removed).push(column);
            }
        }

        if (added.length || removed.length) {
            grid.columns._intersectingColumns = me.columns._intersectingColumns = null;

            for (const columnRecord of removed) {
                rowManager.removeColumnCells({ columnRecord });
            }

            for (const columnRecord of added) {
                rowManager.addColumnCells({ columnRecord });
            }

            me.syncHeaderRoles(added, removed);
            grid.updateRowsAriaOwns();

            // A column entering / leaving view without scrolling means column positions shifted (show / hide, resize
            // etc.), existing cells might need realigning to their headers
            if (!subGrid.scrollable.isScrolling) {
                rowManager.alignCells();
            }

            // Notify features that render on top of cells (for example MergeCells) that cells were added / removed
            rowManager.trigger('columnCellsChanged', { added, removed });
        }
    }

    // Keeps the column header roles in line with the cells which exist, see isAriaExposed
    syncHeaderRoles(added, removed) {
        for (const column of [...added, ...removed]) {
            const headerElement = column.isFocusable && this.getHeader(column.id);

            if (headerElement) {
                if (isAriaExposed(column)) {
                    headerElement.setAttribute('role', 'columnheader');
                }
                else {
                    headerElement.removeAttribute('role');
                }
            }
        }
    }

    onGridHorizontalScroll({ subGrid, resize }) {
        if (subGrid === this.subGrid) {
            // A resize might change flexed column widths, making the cached positions stale. Re-cache them before
            // determining intersections (cachePositions() calls syncIntersections() when done). Scrolling on the
            // other hand never moves columns, cached positions can be trusted
            if (resize) {
                this.cachePositions();
            }
            else {
                this.syncIntersections();
            }
        }
    }
    //endregion

    get grid() {
        // Unit tests create naked Headers with no subgrid, hence the optional chaining
        return this.subGrid?.grid;
    }

    get subGrid() {
        return this._subGrid;
    }

    set subGrid(subGrid) {
        this._subGrid = this.owner = subGrid;
    }

    get region() {
        return this.subGrid?.region;
    }

    changeElement(element, was) {
        const { region } = this;

        // Columns must be examined for maxDepth
        this.getConfig('columns');

        return super.changeElement({
            className : {
                'b-grid-header-scroller'             : 1,
                [`b-grid-header-scroller-${region}`] : region
            },
            role     : null,
            children : [{
                reference : 'headersElement',
                className : {
                    'b-grid-headers'             : 1,
                    [`b-grid-headers-${region}`] : region
                },
                dataset : {
                    region,
                    reference : 'headersElement',
                    maxDepth  : this.maxDepth
                }
            }]
        }, was);
    }

    get overflowElement() {
        return this.headersElement;
    }

    /**
     * Recursive column header config creator.
     * Style not included because of CSP. Widths are fixed up in
     * {@link #function-fixHeaderWidths}
     * @private
     */
    getColumnConfig(column) {
        if (column.isVisible) {
            const
                {
                    id,
                    align,
                    resizable,
                    isLeaf,
                    isParent,
                    isLastInSubGrid,
                    cls,
                    childLevel,
                    field,
                    tooltip,
                    children,
                    isFocusable,
                    grid
                }                = column,
                // Headers tested standalone - may be no grid
                focusedCell      = grid?.focusedCell,
                isFocused        = focusedCell?.rowIndex === -1 && focusedCell?.column === column,
                style            = {};

            if (column.flex) {
                style.flex = column.flex;
            }
            else if (column.width) {
                style.width = DomHelper.setLength(column.width);
            }
            return {
                style,
                className : {
                    'b-grid-header'                       : 1,
                    'b-grid-header-parent'                : isParent,
                    [`b-level-${childLevel}`]             : 1,
                    [`b-depth-${column.meta.depth ?? 0}`] : 1,
                    [`b-grid-header-align-${align}`]      : align,
                    'b-grid-header-resizable'             : resizable && isLeaf,
                    [cls]                                 : cls,
                    'b-collapsible'                       : column.collapsible,
                    'b-last-parent'                       : isParent && isLastInSubGrid,
                    'b-last-leaf'                         : isLeaf && isLastInSubGrid,
                    'b-header-widgets'                    : column.headerWidgets?.length,
                    'b-writing-mode-horizontal-tb'        : column.headerWritingMode === 'horizontal-tb',
                    'b-writing-mode-vertical-rl'          : column.headerWritingMode === 'vertical-rl',
                    'b-writing-mode-vertical-lr'          : column.headerWritingMode === 'vertical-lr',
                    'b-writing-mode-sideways-rl'          : column.headerWritingMode === 'sideways-rl',
                    'b-writing-mode-sideways-lr'          : column.headerWritingMode === 'sideways-lr'
                },
                role                            : isFocusable && isAriaExposed(column) ? 'columnheader' : null,
                'aria-sort'                     : 'none',
                'aria-label'                    : column.ariaLabel,
                [isFocusable ? 'tabIndex' : ''] : isFocused ? 0 : -1,
                dataset                         : {
                    ...Tooltip.encodeConfig(tooltip),
                    columnId                : id,
                    [field ? 'column' : ''] : field
                },
                elementData : {},
                children    : [{
                    className : 'b-grid-header-text',
                    role      : null,
                    children  : [{
                        [grid && isFocusable ? 'id' : ''] : `${grid?.id}-column-${column.id}`,
                        className                         : {
                            'b-grid-header-text-content' : 1,
                            'b-has-text'                 : Boolean(column.text),
                            'b-vertical-text'            : column.hasVerticalText
                        }
                    }]
                }, children ? {
                    className   : 'b-grid-header-children',
                    children    : children.map(child => this.getColumnConfig(child)),
                    syncOptions : {
                        syncIdField : 'columnId'
                    }
                } : null,
                column.resizable && isLeaf ? {
                    className : 'b-grid-header-resize-handle'
                } : null]
            };
        }
    }

    /**
     * Fix header widths (flex or fixed width) after rendering. Not a part of template any longer because of CSP
     * @private
     */
    fixHeaderWidths() {
        this.fixCellWidths();
    }

    refreshHeaders() {
        const me = this;

        // run renderers, not done from template to work more like cell rendering
        me.columns.traverse(column => me.refreshColumn(column));

        me.fixHeaderWidths();
        me.cachePositions();
    }

    refreshColumn(column) {
        const
            me            = this,
            headerElement = me.getBarCellElement(column.id);

        if (headerElement) {
            let html = column.headerText;
            if (column.headerRenderer) {
                html = column.headerRenderer.call(column.thisObj || me, { column, headerElement });
                if (DomHelper.isReactElement(html)) {
                    return DomHelper.handleReactHeaderElement(column, headerElement, html);
                }
            }

            if (column.headerWidgetMap) {
                Object.values(column.headerWidgetMap).forEach(widget => {
                    widget.render(column.textWrapper);
                });
            }

            if (column.icon) {
                html = `<i class="${StringHelper.encodeHtml(column.icon)}"></i>` + (html || '');
            }

            const innerEl = headerElement.querySelector('.b-grid-header-text-content');
            if (innerEl) {
                innerEl.innerHTML = html || '';
            }
        }
    }

    get columns() {
        const
            me     = this,
            result = super.columns;

        if (!me.columnsDetacher) {
            // columns is a chained store, it will be repopulated from master when columns change.
            // That action always triggers change with action dataset.
            me.columnsDetacher = result.ion({
                change() {
                    me.initDepths();
                },
                thisObj : me
            });

            me.initDepths();
        }

        return result;
    }

    set columns(columns) {
        super.columns = columns;
    }

    /**
     * Depths are used for styling of grouped headers. Sets them on meta.
     * @private
     */
    initDepths(columns = this.columns.topColumns, parent = null) {
        const me     = this;
        let maxDepth = 0;

        if (parent?.meta) {
            parent.meta.depth++;
        }

        for (const column of columns) {
            const { meta } = column;
            // <remove-on-release>
            // TODO: this should maybe move
            // </remove-on-release>
            meta.depth = 0;

            if (column.children) {
                me.initDepths(column.children.filter(me.columns.chainedFilterFn), column);
                if (meta.depth && parent) {
                    parent.meta.depth += meta.depth;
                }
            }

            if (meta.depth > maxDepth) {
                maxDepth = meta.depth;
            }
        }

        if (!parent) {
            me.maxDepth = maxDepth;
        }

        return maxDepth;
    }

    //endregion

    //region Getters

    /**
     * Get the header cell element for the specified column.
     * @param {String} columnId Column id
     * @returns {HTMLElement} Header cell element
     */
    getHeader(columnId) {
        return this.getBarCellElement(columnId);
    }

    //endregion

    get contentElement() {
        return this.element.firstElementChild;
    }

    refreshContent() {
        const me = this;

        DomSync.sync({
            domConfig : {
                children     : me.columns.topColumns.map(col => me.getColumnConfig(col)),
                onlyChildren : true
            },
            targetElement    : me.contentElement,
            strict           : true,
            syncIdField      : 'columnId',
            releaseThreshold : 0,
            callback({ action, targetElement, domConfig }) {
                if (domConfig?.className?.['b-grid-header'] && !domConfig.className['b-grid-header-parent']) {
                    if (action === 'newElement') {
                        me.observe(targetElement);
                    }
                    else if (action === 'removeElement') {
                        me.unobserve(targetElement);
                    }
                }
            }
        });

        me.refreshHeaders();
    }

    onInternalPaint({ firstPaint }) {
        const me = this;

        if (firstPaint) {
            // Fires on horizontal scroll and on subgrid width changes, both of which can bring columns into view.
            // Unit tests create naked Headers with no subgrid, hence the check
            me.grid?.ion({
                horizontalScroll : 'onGridHorizontalScroll',
                thisObj          : me
            });

            me.refreshContent();
        }
    }
}

// Register this widget type with its Factory
Header.initClass();
