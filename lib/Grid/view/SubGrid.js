import AsyncHelper from '../../Core/helper/AsyncHelper.js';
import BrowserHelper from '../../Core/helper/BrowserHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import Widget from '../../Core/widget/Widget.js';
import Column from '../column/Column.js';
import SubGridScroller from '../util/SubGridScroller.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import Scroller from '../../Core/helper/util/Scroller.js';
import EventHelper from '../../Core/helper/EventHelper.js';

DomHelper.loadStylesheet('Grid/view/SubGrid.css');

// import Stylesheet from './SubGrid.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'SubGrid');

/**
 * @module Grid/view/SubGrid
 */

/**
 * A SubGrid is a part of the grid (it has at least one and normally no more than two, called locked and normal). It
 * has its own header, which holds the columns to display rows for in the SubGrid. SubGrids are created by Grid, but
 * you can configure your SubGrids with the {@link Grid.view.GridBase#config-subGridConfigs} object.
 *
 * ```javascript
 * const grid = new Grid({
 *     appendTo : 'container',
 *
 *     features : {
 *         regionResize : true
 *     },
 *
 *     subGridConfigs : {
 *         locked : {
 *             width : 360
 *         },
 *         normal : {
 *             flex : 1
 *         }
 *     }
 * });
 * ```
 *
 * If you use multiple regions in your grid, you can enable the {@link Grid.feature.RegionResize} feature to let users
 * resize and collapse/expand grid sections.
 *
 * If not configured with a width or flex, the SubGrid will be sized to fit its columns. In this case, if all columns
 * have a fixed width (not using flex) then toggling columns will also affect the width of the SubGrid.
 *
 * ## Useful configs
 *
 * | Config                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-region}                        | Name of this SubGrid section (e.g. `'locked'`)       |
 * | {@link #config-columns}                       | Column store for this SubGrid                        |
 * | {@link #config-collapsed}                     | Collapse this SubGrid section                        |
 * | {@link #config-flex}                          | Flex value for the SubGrid width                     |
 *
 * ## See also
 *
 * - {@link Grid.view.Grid} - The grid that owns SubGrid sections
 * - {@link Grid.view.GridBase#config-subGridConfigs} - Configure SubGrids from the grid
 * - {@link Grid.feature.RegionResize} - Feature to resize/collapse SubGrid sections
 *
 * @extends Core/widget/Widget
 */
export default class SubGrid extends Widget {
    //region Config

    static $name = 'SubGrid';

    // Factoryable type name
    static type = 'subgrid';

    /**
     * Region (name) for this SubGrid
     * @config {String} region
     */

    /**
     * Column store, a store containing the columns for this SubGrid
     * @config {Grid.data.ColumnStore} columns
     */

    static configurable = {
        insertRowsBefore : null,
        appendTo         : null,
        monitorResize    : true,
        headerClass      : null,
        footerClass      : null,

        /**
         * The subgrid "weight" determines its position among its SubGrid siblings.
         * Higher weights go further right.
         * @config {Number}
         * @category Layout
         */
        weight : null,

        defaultBindProperty : null,

        scrollable : {
            // Each SubGrid only handles scrolling in the X axis.
            // The owning Grid handles the Y axis.
            overflowX : 'hidden-scroll'
        },

        scrollerClass : SubGridScroller,

        // Will be set to `true` by GridSubGrids if it calculates the subgrids width based on its columns.
        // Used to determine if hiding a column should affect subgrids width
        hasCalculatedWidth : null,

        /**
         * Set `true` to disable moving columns into or out of this SubGrid.
         * @config {Boolean}
         * @default false
         * @private
         */
        sealedColumns : null,

        /**
         * @hideconfigs align appendTo content constrainTo draggable html height insertBefore insertFirst maxHeight scrollAction tag x y
         */
        /**
         * @hideproperties align appendTo content constrainTo draggable html insertBefore insertFirst maxHeight scrollAction tag x y
         */
        element                : true,
        header                 : {},
        footer                 : {},
        virtualScrollerElement : true,
        splitterElement        : true,
        headerSplitter         : true,
        scrollerSplitter       : true,
        footerSplitter         : true,

        /**
         * Set `true` to start subgrid collapsed. To operate collapsed state on subgrid use
         * {@link #function-collapse}/{@link #function-expand} methods.
         * @prp {Boolean}
         * @default false
         */
        collapsed : false,

        /**
         * Set to `false` to prevent this subgrid being resized with the {@link Grid.feature.RegionResize} feature
         * @config {Boolean}
         * @default true
         */
        resizable : null,

        role : 'rowgroup',

        defaultCls : {
            'b-bryntum' : 0 // Defining color on the full Grid is enough
        }
    };

    static delayable = {
        // This uses a shorter delay for tests, see construct()
        hideOverlayScroller : 1000
    };

    //endregion

    //region Init

    construct(config) {
        super.construct(config);

        this.rowManager.ion({ addRows : 'onAddRow', thisObj : this });

        if (VersionHelper.isTestEnv) {
            this.hideOverlayScroller.delay = 50;
        }
    }

    doDestroy() {
        const me = this;

        me.header.destroy();
        me.footer.destroy();
        me.fakeScroller?.destroy();

        me.virtualScrollerElement.remove();
        me.splitterElements.forEach(element => element.remove());

        super.doDestroy();
    }

    get barConfig() {
        const
            me              = this,
            { width, flex } = me.element.style,
            config          = {
                subGrid  : me,
                parent   : me,  // Contained widgets need to know their parents
                maxWidth : me.maxWidth || undefined,
                minWidth : me.minWidth || undefined
            };

        // If we have been configured with sizing, construct the Bar in sync.
        if (flex) {
            config.flex = flex;
        }
        else if (width) {
            config.width = width;
        }

        return config;
    }

    changeHeader(header) {
        return new this.headerClass(ObjectHelper.assign({
            id : this.id + '-header'
        }, this.barConfig, header));
    }

    changeFooter(footer) {
        return new this.footerClass(ObjectHelper.assign({
            id : this.id + '-footer'
        }, this.barConfig, footer));
    }

    //endregion

    //region Splitters

    get splitterElements() {
        return [this.splitterElement, this.headerSplitter, this.scrollerSplitter, this.footerSplitter];
    }

    /**
     * Toggle (add/remove) class for splitters
     * @param {String} cls class name
     * @param {Boolean} [add] Set to `true` to add class, `false` to remove
     * @param {Boolean} [includePartners] Set to `true` to also process partners
     * @private
     */
    toggleSplitterCls(cls, add = true, includePartners = true) {
        this.splitterElements.forEach(el => el?.classList[add ? 'add' : 'remove'](cls));

        if (includePartners) {
            this.scrollable.eachPartner(({ scroller }) => {
                if (scroller.owner !== this) {
                    scroller.owner.toggleSplitterCls?.(cls === 'b-hover' ? 'b-partner-splitter-hover' : 'b-hover', add, false);
                }
            });
        }
    }

    hideSplitter() {
        this.splitterElements.forEach(el => el.classList.add('b-hide-display'));
        this.$showingSplitter = false;
    }

    showSplitter() {
        this.splitterElements.forEach(el => el.classList.remove('b-hide-display'));
        this.$showingSplitter = true;
    }

    //endregion

    //region Template

    changeElement(element, was) {
        const { region } = this;

        return super.changeElement({
            tabIndex     : -1,
            'aria-label' : this.ariaLabel || `${this.region} subgrid`,
            className    : {
                'b-grid-sub-grid'             : 1,
                [`b-grid-sub-grid-${region}`] : region,
                'b-grid-sub-grid-collapsed'   : this.collapsed
            },
            dataset : {
                region
            }
        }, was);
    }

    /**
     * The number of columns rendered by the SubGrids which precede this SubGrid visually.
     *
     * `aria-colindex` is grid wide (and one based), so a cell's index within this SubGrid must be offset by this
     * value for assistive technology to match the cell up with its column header.
     * @member {Number}
     * @readonly
     * @internal
     */
    get ariaColIndexOffset() {
        let result  = 0,
            reached = false;

        // Cannot use grid.columns.visibleColumns.indexOf(column). With the pinColumns feature enabled the
        // ColumnStore region sorter bails out, so that store is in declaration order, not visual order.
        // The SubGrids are iterated in visual order, which is also the order their headers are in the DOM
        this.grid.eachSubGrid(subGrid => result += (reached ||= subGrid === this) ? 0 : subGrid.columns.visibleColumns.length);

        return result;
    }

    /**
     * Renumbers the `aria-colindex` of this SubGrid's rendered cells. Collapsing a sibling SubGrid changes the
     * grid wide column indices without changing the columns, and must not repaint, so only the attribute is
     * updated here.
     * @internal
     */
    updateCellsAriaColumnIndex(ariaColIndexOffset = this.ariaColIndexOffset) {
        // Cells only exist for intersecting columns when virtualizing columns, so a cell's index is that of its
        // column, not its position in the row
        const colIndexById = new Map(this.columns.visibleColumns.map((column, index) => [String(column.id), ariaColIndexOffset + index + 1]));

        for (const rowElement of this.rowElements) {
            for (const cell of rowElement.children) {
                const colIndex = cell.classList.contains('b-grid-cell') && colIndexById.get(cell.dataset.columnId);

                colIndex && cell.setAttribute('aria-colindex', colIndex);
            }
        }
    }

    get rowElementConfig() {
        const { grid } = this;

        return {
            role      : 'row',
            tabIndex  : -1,
            className : grid.rowCls
        };
    }

    // Added to DOM in Grid `get bodyConfig`
    changeVirtualScrollerElement(element) {
        return DomHelper.isElement(element) ? element : this.createVirtualScrollerElement();
    }

    createVirtualScrollerElement() {
        const references = DomHelper.createElement({
            role      : 'presentation',
            reference : 'virtualScrollerElement',
            className : 'b-virtual-scroller',
            dataset   : {
                region : this.region
            },
            children : [
                {
                    reference : 'virtualScrollerWidth',
                    className : 'b-virtual-width'
                }
            ]
        });

        this.virtualScrollerWidth = references.virtualScrollerWidth;

        return references.virtualScrollerElement;
    }

    changeSplitterElement() {
        const references = DomHelper.createElement({
            reference : 'splitterElement',
            className : {
                'b-grid-splitter'           : 1,
                'b-grid-splitter-collapsed' : this.collapsed,
                'b-hide-display'            : 1 // GridSubGrids determines visibility
            },
            dataset : {
                region : this.region
            },
            children : [
                {
                    className : 'b-grid-splitter-inner b-grid-splitter-main',
                    children  : [
                        {
                            className : 'b-grid-splitter-buttons',
                            reference : 'splitterButtons',
                            children  : [
                                {
                                    className : 'b-grid-splitter-button-collapse',
                                    children  : [
                                        {
                                            tag       : 'svg',
                                            ns        : 'http://www.w3.org/2000/svg',
                                            version   : '1.1',
                                            className : 'b-grid-splitter-button-icon b-grid-region-collapse-arrow',
                                            viewBox   : '0 0 256 512',
                                            children  : [
                                                {
                                                    tag : 'path',
                                                    d   : 'M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-1' +
                                                        '2.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s' +
                                                        '12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.7' +
                                                        '5 0 45.25C208.4 444.9 200.2 448 192 448z'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    className : 'b-grid-splitter-button-expand',
                                    children  : [
                                        BrowserHelper.isTouchDevice ? { className : 'b-splitter-button-touch-area' } : null,
                                        {
                                            tag       : 'svg',
                                            ns        : 'http://www.w3.org/2000/svg',
                                            version   : '1.1',
                                            className : 'b-grid-splitter-button-icon b-grid-region-expand-arrow',
                                            viewBox   : '0 0 256 512',
                                            children  : [
                                                {
                                                    tag : 'path',
                                                    d   : 'M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-3' +
                                                        '2.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-4' +
                                                        '5.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25' +
                                                        'l-160 160C80.38 444.9 72.19 448 64 448z'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        this.splitterButtons = references.splitterButtons;

        return references.splitterElement;
    }

    get splitterConfig() {
        return {
            className : this.splitterElement.className.trim(),
            children  : [
                {
                    className : 'b-grid-splitter-inner'
                }
            ],
            dataset : {
                region : this.region
            }
        };
    }

    changeHeaderSplitter() {
        return DomHelper.createElement(this.splitterConfig);
    }

    changeScrollerSplitter() {
        return DomHelper.createElement(this.splitterConfig);
    }

    changeFooterSplitter() {
        return DomHelper.createElement(this.splitterConfig);
    }

    //endregion

    //region Render

    render(...args) {
        const me = this;

        super.render(...args);

        // Unit tests create naked SubGrids so we have to do this.
        if (me.grid) {
            me.updateHasFlex();

            me.element.parentNode.insertBefore(me.splitterElement, me.element.nextElementSibling);

            // Cant use "global" listener with delegate for mouseenter, since mouseenter only fires on target
            me.splitterElements.forEach(element =>
                EventHelper.on({
                    element,
                    mouseenter : 'onSplitterMouseEnter',
                    mouseleave : 'onSplitterMouseLeave',
                    thisObj    : me
                })
            );

            me.$isInitialCollapse = true;
            me._collapsed && me.collapse();
            me.$isInitialCollapse = false;
        }
    }

    toggleHeaders(hide) {
        const { scrollable, header } = this;

        if (hide) {
            scrollable.removePartner(header.scrollable, 'x');
        }
        else {
            scrollable.addPartner(header.scrollable, 'x');
        }
    }

    refreshHeader() {
        this.header.refreshContent();
    }

    refreshColumnHeader(column) {
        this.header.refreshColumn(column);
    }

    refreshFooter() {
        this.footer?.refreshContent();
    }

    // Override to iterate header and footer.
    get childItems() {
        // Return only existing child items to avoid null items if footer is not present
        return [this.header, this.footer].filter(item => item);
    }

    //endregion

    //region Size & resize

    /**
     * Sets header width and scroller width (if needed, depending on if using flex). Might also change the subgrids
     * width, if it uses a width calculated from its columns.
     * @private
     */
    fixWidths() {
        const
            me = this,
            {
                element,
                header,
                footer
            }  = me;

        if (!me.collapsed) {
            if (me.flex) {
                header.flex = me.flex;
                if (footer) {
                    footer.flex = me.flex;
                }
                element.style.flex = me.flex;
            }
            else {
                // If width is calculated and no column is using flex, check if total width is less than width. If so,
                // recalculate width and bail out of further processing (since setting width will trigger again)
                if (
                    me.hasCalculatedWidth &&
                    (me.isPinnedSubGrid || !me.columns.some(col => col.shown && col.flex)) &&
                    me.squashedTotalColumnWidth !== me.width
                ) {
                    me.width = me.squashedTotalColumnWidth;
                    // Setting width above clears the hasCalculatedWidth flag, but we want to keep it set to react
                    // correctly next time
                    me.hasCalculatedWidth = true;
                    return;
                }

                // Ensure we are reading actual width
                me.clearWidthCache();

                let totalWidth = me.width;

                // Calculate width from our total column width if we are supposed to have a calculated width
                if (!totalWidth && me.hasCalculatedWidth) {
                    totalWidth = me.squashedTotalColumnWidth;
                }

                // rows are absolutely positioned, meaning that their width won't affect container width
                // hence we must set it, if not using flex
                element.style.width = `${totalWidth}px`;

                header.width = totalWidth;
                if (footer) {
                    footer.width = totalWidth;
                }
            }

            me.handleHorizontalScroll(false);
        }
    }

    /**
     * Get/set SubGrid width, which also sets header and footer width (if available).
     * @member {Number}
     */
    set width(width) {
        const me = this;
        // Width explicitly set, remember that
        me.hasCalculatedWidth = false;

        super.width = width;

        me.header.width = width;
        me.footer.width = width;

        // When we're live, we can't wait until the throttled resize occurs - it looks bad.
        if (me.isPainted) {
            me.onElementResize();
        }

        // Sync width of same subgrid in other splits, but not during expand / resize since those are also synced
        if (!me.isExpanding && !me.isCollapsing && !me.isConfiguring) {
            me.grid.syncSplits?.(other => other.subGrids[me.region] && (other.subGrids[me.region].width = width));
        }
    }

    get width() {
        return super.width;
    }

    /**
     * Get/set SubGrid flex, which also sets header and footer flex (if available).
     * @member {Number|String}
     */
    set flex(flex) {
        const me = this;

        // Width explicitly set, remember that
        me.hasCalculatedWidth = false;

        me.header.flex = flex;
        me.footer.flex = flex;

        super.flex = flex;

        // When we're live, we can't wait until the  throttled resize occurs - it looks bad.
        if (me.isPainted) {
            me.onElementResize();
        }

        // Sync width of same subgrid in other splits, but not during expand / resize since those are also synced
        if (!me.isExpanding && !me.isCollapsing && !me.isConfiguring) {
            me.grid.syncSplits?.(other => other.subGrids[me.region] && (other.subGrids[me.region].flex = flex));
        }
    }

    get flex() {
        return super.flex;
    }

    /**
     * Called when grid changes size. SubGrid determines if it has changed size and triggers scroll (for virtual
     * rendering in cells to work when resizing etc.)
     * @private
     */
    onInternalResize(element, newWidth, newHeight, oldWidth, oldHeight) {
        const
            me       = this,
            { grid } = me;

        // Widget caches dimensions
        super.onInternalResize(element, newWidth, newHeight, oldWidth, oldHeight);

        // Unit tests create naked SubGrids so we have to do this.
        if (grid?.isPainted) {
            me.syncSplitterButtonPosition();

            if (newWidth !== oldWidth) {
                // Merged cells needs to react before we update scrollbars
                me.trigger('beforeInternalResize', me);
                // Hook to allow features to do stuff before the resize calculation process begins
                // Used in FillHandle to remove elements so not to affect overflow
                grid.beforeSubGridInternalResize?.(me);

                // trigger scroll, in case anything is done on scroll it needs to be done now also. The `resize` flag
                // tells listeners that cached column positions might be stale (flexed columns change width when the
                // subgrid does)
                grid.trigger('horizontalScroll', {
                    grid,
                    subGrid    : me,
                    scrollLeft : me.scrollable.scrollLeft,
                    scrollX    : me.scrollable.x,
                    resize     : true
                });

                // The horizontalScrollEnd event is documented on GridBase, where it fires
                // ditto for scrollEnd (state tests expect saving on resize, and that now happens on scrollEnd)
                grid.trigger('horizontalScrollEnd', { subGrid : me, scrollLeft : me.scrollable.scrollLeft });

                // Update virtual scrollers, if they are ready
                me.fakeScroller && me.refreshFakeScroll();

                // Columns which are flexed, but as part of a grouped column cannot just have their flex
                // value reflected in the flex value of its cells. They are flexing a different available space.
                // These have to be set to the exact width and kept synced.
                grid.syncFlexedSubCols();
            }

            if (newHeight !== oldHeight) {
                // Call this to update cached _bodyHeight
                grid.onHeightChange();
            }

            me.trigger('afterInternalResize', me);
        }
    }

    /**
     * Keeps the parallel splitters in the header, footer and fake scroller synced in terms
     * of being collapsed or not.
     * @private
     */
    syncParallelSplitters(collapsed) {
        const
            me       = this,
            { grid } = me;

        if (me.splitterElement && me.$showingSplitter) {
            me.toggleSplitterCls('b-grid-splitter-collapsed', collapsed);
        }
        else {
            // If we're the last, we don't own a splitter, we use the previous region's splitter
            const prevGrid = grid.getSubGrid(grid.getPreviousRegion(me.region));

            // If there's a splitter before us, sync it with our state.
            if (prevGrid?.splitterElement) {
                prevGrid.syncParallelSplitters(collapsed);
            }
        }
    }

    onSplitterMouseEnter() {
        const
            me              = this,
            { nextSibling } = me;

        // No hover effect when collapsed
        if (!me.collapsed && (!nextSibling?.collapsed)) {
            me.toggleSplitterCls('b-hover');
        }

        me.startSplitterButtonSyncing();
    }

    onSplitterMouseLeave() {
        const
            me              = this,
            { nextSibling } = me;

        me.toggleSplitterCls('b-hover', false);
        if (!me.collapsed && (!nextSibling?.collapsed)) {
            me.stopSplitterButtonSyncing();
        }
    }

    startSplitterButtonSyncing() {
        const me = this;

        if (me.splitterElement) {
            me.syncSplitterButtonPosition();
            if (!me.splitterSyncScrollListener) {
                me.splitterSyncScrollListener = me.grid.scrollable.ion({
                    scroll  : 'syncSplitterButtonPosition',
                    thisObj : me
                });
            }
        }
    }

    stopSplitterButtonSyncing() {
        if (this.splitterSyncScrollListener) {
            this.splitterSyncScrollListener();
            this.splitterSyncScrollListener = null;
        }
    }

    syncSplitterButtonPosition() {
        const { grid } = this;

        this.splitterButtons.style.top = `${grid.scrollable.y + ((grid.bodyHeight - (this.headerSplitter ? grid.headerHeight : 0)) / 2)}px`;
    }

    /**
     * Get the "viewport" for the SubGrid as a Rectangle
     * @member {Core.helper.util.Rectangle}
     * @readonly
     */
    get viewRectangle() {
        const { scrollable } = this;

        return new Rectangle(scrollable.x, scrollable.y, this.width || 0, this.rowManager.viewHeight);
    }

    /**
     * Called when updating column widths to apply 'b-has-flex' which is used when fillLastColumn is configured.
     * @internal
     */
    updateHasFlex() {
        this.scrollable.element.classList.toggle('b-has-flex', this.columns.hasFlex);
    }

    updateResizable(resizable) {
        this.splitterElements.forEach(splitter => DomHelper.toggleClasses(splitter, ['b-disabled'], !resizable));
    }

    /**
     * Resize all columns in the SubGrid to fit their width, according to their configured
     * {@link Grid.column.Column#config-fitMode}
     */
    resizeColumnsToFitContent() {
        this.grid.beginGridMeasuring();

        this.columns.visibleColumns.forEach(column => {
            column.resizeToFitContent(null, null, true);
        });

        this.grid.endGridMeasuring();
    }

    //endregion

    //region Scroll

    // Minimum width for the columns, when flex columns are shrunk to their minWidth
    get squashedTotalColumnWidth() {
        return this.columns.squashedTotalColumnWidth;
    }

    get totalColumnWidth() {
        const
            me = this,
            { overflowingHorizontally } = me,
            { visibleColumns } = me.columns;

        if (overflowingHorizontally) {
            return me.squashedTotalColumnWidth;
        }

        return visibleColumns.reduce((sum, column) => sum + column.elementWidth, 0);
    }

    get overflowingHorizontally() {
        // We are not overflowing if collapsed.
        // If the squashed width (columns flexed to their minWidth) exceeds our width, we are overflowing.
        return !this.collapsed && this.squashedTotalColumnWidth > this.width;
    }

    get overflowingVertically() {
        // SubGrids never overflow vertically. They are full calculated content height.
        // The owning Grid scrolls all SubGrids vertically in its own overflowElement.
        return false;
    }

    /**
     * Fixes widths of fake scrollers
     * @private
     */
    refreshFakeScroll() {
        if (DomHelper.stylesheetLoadPromise && !DomHelper.stylesheetLoadPromise.resolved) {
            DomHelper.themeLoaded.then(() => this.refreshFakeScroll?.());
        }

        const
            me = this,
            {
                element,
                virtualScrollerElement,
                virtualScrollerWidth,
                header,
                footer,
                scrollable,
                region,
                grid
            }  = me;

        let totalColumnWidth;

        if (me.overflowingHorizontally) {
            totalColumnWidth = me.squashedTotalColumnWidth;
        }
        else if (me.columns.hasFlex || grid.fillLastColumn) {
            totalColumnWidth = me.width;
        }
        else {
            totalColumnWidth = me.totalColumnWidth;
        }

        // Use a fixed scroll width so that when grid is empty (e.g. after filtering with no matches), it is able to
        // maintain its scroll-x position and magic mouse swiping in the grid area will produce horizontal scrolling.
        // https://github.com/bryntum/bryntum/issues/3247
        scrollable.scrollWidth = totalColumnWidth;

        // Remembered to be stamped onto row elements created later (see onAddRow)
        me.$rowElementWidth = totalColumnWidth;

        // Ensures all rows expand to accommodate the visible columns
        for (const row of grid.rowManager.rows) {
            // Gets called during initScroll when adding subgrid at runtime, too early
            if (row.elements[region]) {
                row.elements[region].style.width = totalColumnWidth + 'px';
            }
        }

        // Scroller lays out in the same way as subgrid.
        // If we are flexed, the scroller is flexed etc.
        virtualScrollerElement.style.width = element.style.width;
        virtualScrollerElement.style.flex = element.style.flex;
        virtualScrollerElement.style.minWidth = element.style.minWidth;
        virtualScrollerElement.style.maxWidth = element.style.maxWidth;
        header.scrollable.syncOverflowState();
        footer.scrollable.syncOverflowState();
        scrollable.syncOverflowState();

        if (!me.collapsed) {
            if (me.overflowingHorizontally) {
                virtualScrollerWidth.style.width = `${totalColumnWidth || 0}px`;
                // If *any* SubGrids have horizontal overflow, the main grid
                // has to show its virtual horizontal scrollbar. A TimeAxisViewModel update can call this after the
                // grid was destroyed, when the shared scroller element is already gone
                grid.virtualScrollers?.classList.remove('b-hide-display');
            }
            else {
                virtualScrollerWidth.style.width = 0;
            }
        }
    }

    /**
     * Init scroll syncing for header and footer (if available).
     * @private
     */
    initScroll() {
        const
            me = this,
            {
                scrollable,
                virtualScrollerElement,
                grid
            }  = me;

        if (!me.scrollInitialized) {
            // Create a Scroller for the fake horizontal scrollbar so that it can partner
            me.fakeScroller = new Scroller({
                element   : virtualScrollerElement,
                overflowX : true,
                widget    : me // To avoid more expensive style lookup for RTL
            });

            me.scrollInitialized = true;

            // Sync scrolling partners (header, footer) when our xScroller reports a scroll.
            // Also fires horizontalScroll
            scrollable.ion({
                scroll    : 'onSubGridScroll',
                scrollEnd : 'onSubGridScrollEnd',
                thisObj   : me
            });

            if (!grid.hideHorizontalScrollbar) {
                scrollable.addPartner(me.fakeScroller, 'x');

                // Update virtual scrollers (previously updated too early from onInternalResize)
                me.refreshFakeScroll();
            }

            if (!grid.hideHeaders) {
                scrollable.addPartner(me.header.scrollable, 'x');
            }

            if (!grid.hideFooters) {
                scrollable.addPartner(me.footer.scrollable, 'x');
            }
        }
    }

    /**
     * Swaps in a fresh virtual scroller node, which ends any native scrollbar thumb drag in progress
     * @private
     */
    recreateVirtualScroller() {
        const
            me = this,
            {
                fakeScroller,
                virtualScrollerElement : oldElement,
                virtualScrollerWidth   : oldStretcher
            }  = me;

        if (!me.isDestroyed && fakeScroller && oldElement.parentNode) {
            me.virtualScrollerElement = me.createVirtualScrollerElement();

            const { virtualScrollerElement } = me;

            // Before re-binding: carries the inline overflow-x, which updateElement only re-applies when positionDirty
            virtualScrollerElement.style.cssText = oldElement.style.cssText;
            me.virtualScrollerWidth.style.width = oldStretcher.style.width;

            oldElement.replaceWith(virtualScrollerElement);

            fakeScroller.element = virtualScrollerElement;
            // After re-binding: unbinding strips the Scroller/ResizeMonitor marker classes from the old node
            virtualScrollerElement.classList.add(...oldElement.classList);
            fakeScroller.sync(me.scrollable, { x : true });
        }
    }

    onSubGridScrollEnd(event) {
        const
            me       = this,
            { grid } = me;

        me.scrollingToCenter = event?.scrollingToCenter;
        me.scrolling = false;

        me.handleHorizontalScroll(false);

        if (!DomHelper.scrollBarWidth) {
            grid.virtualScrollers.classList.remove('b-scrolling');
            // Remove interactivity a while after scrolling ended
            me.hideOverlayScroller();
        }

        // Used by GridState
        grid.trigger('horizontalScrollEnd', { subGrid : me });
    }

    onSubGridScroll(event) {
        const me = this;

        me.scrollingToCenter = event?.scrollingToCenter;
        me.handleHorizontalScroll();
    }

    showOverlayScroller() {
        this.hideOverlayScroller.cancel();

        this.virtualScrollerElement.classList.add('b-show-virtual-scroller');
    }

    // Buffered 1500ms, hides virtual scrollers after scrolling has ended
    hideOverlayScroller() {
        this.virtualScrollerElement.classList.remove('b-show-virtual-scroller');
    }

    set scrolling(scrolling) {
        this._scrolling = scrolling;
    }

    get scrolling() {
        return this._scrolling;
    }

    /**
     * Triggers the 'horizontalScroll' event + makes sure overlay scrollbar is reachable with pointer for a substantial
     * amount of time after scrolling starts
     * @internal
     */
    handleHorizontalScroll(addCls = true) {
        const
            subGrid  = this,
            { grid } = subGrid;

        if (!subGrid.scrolling && addCls) {
            subGrid.scrolling = true;
            // Allow interacting with overlaid scrollbar after scrolling starts
            if (!DomHelper.scrollBarWidth) {
                // Cls indicating that we are actively scrolling
                grid.virtualScrollers.classList.add('b-scrolling');
                // Cls sticking around longer to keep overlay scrollbar visible longer, allowing users to more easily
                // grab it to drag more
                subGrid.showOverlayScroller();
            }
        }

        // The horizontalScroll event is documented on GridBase, where it fires
        grid.trigger('horizontalScroll', {
            subGrid,
            grid,
            scrollLeft        : subGrid.scrollable.scrollLeft,
            scrollX           : subGrid.scrollable.x,
            scrollingToCenter : subGrid?.scrollingToCenter
        });
    }

    /**
     * Scrolls a column into view (if it is not already). Called by Grid#scrollColumnIntoView, use it instead to not
     * have to care about which SubGrid contains a column.
     * @param {Grid.column.Column|String|Number} column Column name (data) or column index or actual column object.
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} If the column exists, a promise which is resolved when the column header element has been
     * scrolled into view.
     */
    scrollColumnIntoView(column, options) {
        const
            { columns, header } = this,
            scroller            = header.scrollable;

        // Allow column,column id,or column index to be passed
        column = (column instanceof Column) ? column : columns.get(column) || columns.getById(column) || columns.getAt(column);

        if (column) {
            // Get the current column header element.
            const columnHeaderElement = header.getHeader(column.id);

            if (columnHeaderElement) {
                return scroller.scrollIntoView(Rectangle.from(columnHeaderElement, null, true), options);
            }
        }
    }

    //endregion

    //region Rows

    /**
     * Creates elements for the new rows when RowManager has determined that more rows are needed
     * @private
     */
    onAddRow({ source = this.grid.rowManager, rows }) {
        const
            me                            = this,
            { region, $rowElementWidth }  = me,
            config                        = me.rowElementConfig,
            frag                          = document.createDocumentFragment(),
            insertRowsBefore              = source.rows[rows[rows.length - 1].index + 1]?.elements[region];

        rows.forEach(row => {
            const rowElement = DomHelper.createElement(config);

            DomHelper.syncClassList(rowElement, row.cls);

            // Rows created after the initial rendering (for example when records are added or the grid grows taller)
            // must span the same scroll range as the rows stamped by refreshFakeScroll()
            if ($rowElementWidth != null) {
                rowElement.style.width = `${$rowElementWidth}px`;
            }

            frag.appendChild(rowElement);
            row.addElement(region, rowElement);
        });

        // Put the row elements into the SubGrid en masse.
        // If 2nd param is null, insertBefore appends.
        me.element.insertBefore(frag, insertRowsBefore || me.insertRowsBefore);
    }

    /**
     * Get all row elements for this SubGrid.
     * @member {HTMLElement[]}
     * @readonly
     */
    get rowElements() {
        return this.fromCache('.b-grid-row', true);
    }

    /**
     * Removes all row elements from the subgrids body and empties cache
     * @private
     */
    clearRows() {
        this.emptyCache();

        const
            all   = this.element.querySelectorAll('.b-grid-row'),
            range = document.createRange();

        if (all.length) {
            range.setStartBefore(all[0]);
            range.setEndAfter(all[all.length - 1]);
            DomHelper.emptyRange(range);
        }
    }

    // only called when RowManager.rowScrollMode = 'dom', which is not intended to be used
    addNewRowElement() {
        return DomHelper.append(this.element, this.rowElementConfig);
    }

    get store() {
        return this.grid.store;
    }

    get rowManager() {
        return this.grid?.rowManager;
    }

    //endregion

    // region Expand/collapse

    changeCollapsed(collapsed) {
        return Boolean(collapsed);
    }

    updateCollapsed(collapsed, was) {
        const me = this;
        if (!me.isConfiguring) {
            // The setter flipped _collapsed already, column caches computed while collapsed are stale
            !collapsed && me.columns.clearCaches();

            me._fromPropertyUpdate = true;
            if (collapsed) {
                me.collapse();
            }
            else {
                me.expand();
            }
            me._fromPropertyUpdate = false;
        }
    }

    /**
     * Collapses subgrid. If collapsing subgrid is the only one expanded, next subgrid to the right (or previous) will
     * be expanded.
     *
     * ```javascript
     * let locked = grid.getSubGrid('locked');
     * locked.collapse().then(() => {
     *     console.log(locked.collapsed); // Logs 'True'
     * });
     *
     * let normal = grid.getSubGrid('normal');
     * normal.collapse().then(() => {
     *     console.log(locked.collapsed); // Logs 'False'
     *     console.log(normal.collapsed); // Logs 'True'
     * });
     * ```
     *
     * @param {Boolean} animate - Whether to animate the collapse.
     * @privateparam {Boolean} isRecursiveCall - Flag to set to true in case of partnered grids, to avoid infinite loop
     * @returns {Promise} A Promise which resolves when this SubGrid is fully collapsed.
     */
    async collapse(animate, isRecursiveCall = false) {
        const
            me           = this,
            { grid }     = me,
            { partners } = grid;

        // Animation only supported for 2 sub grids for now
        animate = animate && Object.keys(grid.subGrids).length <= 2;

        if (grid.rendered && me._collapsed === true && !me._fromPropertyUpdate) {
            return;
        }

        if (grid.partners && !isRecursiveCall) {
            // If grid is partnered, we turn of syncing while we perform this operation, otherwise the TimelineBase
            // will try to match the width/flex of the partnered subgrids forcefully which ends the animation
            // prematurely
            grid.isSyncingFromPartner = true;
            partners.forEach(partner => partner.isSyncingFromPartner = true);
            await Promise.all([
                me.collapse(animate, true),
                ...partners.map((partner) => partner.subGrids[me.region]?.collapse(animate, true))
            ]);
            partners.forEach(partner => partner.isSyncingFromPartner = false);
            grid.isSyncingFromPartner = false;
            return;
        }

        if (animate) {
            // Event-wrap widths are automatically increased/decreased by browser, and putting transition on them makes
            // the event's width animation lag so we prevent those transitions using b-sub-grid-width-transition class
            grid.addCls('b-sub-grid-width-transition');
            await grid.runWithTransition(() => me._collapseInternal(true), true);
            // Grid may get destroyed while running the transition, so we do an early return
            if (me.isDestroyed) {
                return;
            }
            grid.removeCls('b-sub-grid-width-transition');
        }
        else if (!me.$isInitialCollapse) {
            await me._collapseInternal(false);
        }
        else {
            // Lots of expectation break if we await initial collapse
            me._collapseInternal(false);
        }

        grid.trigger('subGridCollapse', { subGrid : me });
        grid.afterToggleSubGrid({ subGrid : me, collapsed : true });

        me.isCollapsing = false;
        grid.trigger('afterInternalResize');
        grid.refreshVirtualScrollbars();
    }

    async _collapseInternal(animate = false) {
        const
            me            = this,
            {
                grid,
                element
            }             = me,
            nextRegion    = grid.getSubGrid(grid.getNextRegion(me.region)),
            splitterOwner = me.splitterElement ? me : me.previousSibling;
        let { _beforeCollapseState } = me,
            // Count all expanded regions. Grid must always have at least one expanded region
            expandedRegions          = 0;

        me.isCollapsing = true;

        grid.eachSubGrid(subGrid => {
            subGrid !== me && !subGrid._collapsed && ++expandedRegions;
        });

        // A LockRows clone is both a split and a partner, the partner branch in collapse() relays to it
        grid.syncSplits?.(other => !grid.partners?.includes(other) && other.subGrids[me.region]?.collapse(animate));

        // Current region is the only one expanded, expand next region
        if (expandedRegions === 0) {
            // When splitting, not all splits will have all regions
            if (!nextRegion) {
                return;
            }
            await nextRegion.expand();
        }

        let widthChanged = false;
        if (!_beforeCollapseState) {
            _beforeCollapseState = me._beforeCollapseState = {};

            // If current width is zero, the resize event will not be fired. In such case we want to trigger callback immediately
            if (me.width) {
                widthChanged = true;
            }

            // When trying to collapse region we need its partner to occupy free space. Considering multiple
            // regions, several cases are possible:
            // 1) Both left and right regions have fixed width
            // 2) Left region has fixed width, right region is flexed
            // 3) Left region is flexed, right region has fixed width
            // 4) Both regions are flexed
            //
            // To collapse flexed region we need to remove flex style, remember it somehow and set fixed width.
            // If another region is flexed, it will fill the space. If it has fixed width, we need to increase
            // its width by collapsing region width. Same logic should be applied to headers.
            //
            // Save region width first
            _beforeCollapseState.width = me.width;
            _beforeCollapseState.elementWidth = element.style.width;

            // Current region is flexed, store style to restore on expand
            if (element.style.flex !== '') {
                _beforeCollapseState.flex = element.style.flex;
                // remove flex state to reduce width later
                me.header.element.style.flex = element.style.flex = '';
            }

            // Next region is not flexed, need to make it fill the space
            if (nextRegion.element.style.flex === '') {
                _beforeCollapseState.nextRegionWidth = nextRegion.width;

                // Store and temporarily disable maxWidth so the region can fill the available space
                if (nextRegion.maxWidth) {
                    _beforeCollapseState.nextRegionMaxWidth = nextRegion.maxWidth;
                    _beforeCollapseState.nextRegionHeaderMaxWidth = nextRegion.header.maxWidth;
                    nextRegion.maxWidth = nextRegion.header.maxWidth = null;
                }

                nextRegion.width = nextRegion.header.width = '';
                nextRegion.flex = `1 1 ${_beforeCollapseState.nextRegionWidth}px`;
            }

            // Sets the grid to its collapsed width as defined in CSS: zero
            me.addCls('b-grid-sub-grid-collapsed');
            element.setAttribute('aria-hidden', 'true');
            element.setAttribute('inert', 'true');
            me.header.element.setAttribute('aria-hidden', 'true');
            me.header.element.setAttribute('inert', 'true');
            me.footer.element.setAttribute('aria-hidden', 'true');
            me.footer.element.setAttribute('inert', 'true');

            // The parallel elements which must be in sync width-wise must know about collapsing
            me.virtualScrollerElement.classList.add('b-collapsed');
            me.header.addCls('b-collapsed');
            me.footer.addCls('b-collapsed');

            me._collapsed = true;
            me.width = '';

            if (!widthChanged) {
                // sync splitters in case subGrid was collapsed by state (https://github.com/bryntum/bryntum/issues/1857)
                me.syncParallelSplitters(true);
            }

            // UI needs to catch up before we do overflow detection below in refreshVirtualScrollbars()
            await AsyncHelper.animationFrame();
        }

        if (!me.isDestroyed && widthChanged) {
            grid.refreshVirtualScrollbars();

            me.syncParallelSplitters(true);

            // Our splitter is permanently visible when collapsed, so keep splitter button set
            // synced in the vertical centre of the view just in time for paint.
            // Uses translateY so will not cause a further layout.
            splitterOwner.startSplitterButtonSyncing?.();
        }
    }

    /**
     * Expands subgrid.
     *
     * ```javascript
     * grid.getSubGrid('locked').expand().then(() => console.log('locked grid expanded'));
     * ```
     * @param {Boolean} animate - Whether to animate the expand.
     * @privateparam {Boolean} isRecursiveCall - Flag to set to true in case of partnered grids, to avoid infinite loop
     * @returns {Promise} A Promise which resolves when this SubGrid is fully expanded.
     */
    async expand(animate, isRecursiveCall = false) {
        const
            me           = this,
            { grid }     = me,
            { partners } = grid,
            nextRegion   = grid.getSubGrid(grid.getNextRegion(me.region));

        // Animation only supported for 2 sub grids for now
        animate = animate && Object.keys(grid.subGrids).length <= 2;

        if (grid.rendered && me._collapsed !== true && !me._fromPropertyUpdate) {
            return;
        }

        if (partners && !isRecursiveCall) {
            grid.isSyncingFromPartner = true;
            partners.forEach(partner => partner.isSyncingFromPartner = true);
            await Promise.all([
                me.expand(animate, true),
                ...partners.map((partner) => partner.subGrids[me.region]?.expand(animate, true))
            ]);
            partners.forEach(partner => partner.isSyncingFromPartner = false);
            grid.isSyncingFromPartner = false;
            return;
        }

        if (animate) {
            grid.addCls('b-sub-grid-width-transition');
            await grid.runWithTransition(() => me._expandInternal(true), true);
            // Restore maxWidth if it was stored (must happen after animation completes)
            if (me._beforeCollapseState?.nextRegionMaxWidth) {
                nextRegion.maxWidth = me._beforeCollapseState.nextRegionMaxWidth;
                nextRegion.header.maxWidth = me._beforeCollapseState.nextRegionHeaderMaxWidth;
            }
            if (me.isDestroyed) {
                // Cleanup state even when destroyed (memory will be freed)
                delete me._beforeCollapseState;
                return;
            }
            grid.removeCls('b-sub-grid-width-transition');
        }
        else {
            me._expandInternal(false);
        }

        // Cleanup state after expand completes
        delete me._beforeCollapseState;

        // Clear cache to make sure now visible columns are part of visibleColumns
        me.columns.clearCaches();

        // Re-cache column positions and add cells for the columns that are back in view. Cannot rely on the resize
        // events fired during the expand, since visibleColumns did not yet include this subgrid's columns then
        me.header.cachePositions();

        grid.trigger('subGridExpand', { subGrid : me });
        grid.afterToggleSubGrid({ subGrid : me, collapsed : false });

        me.isExpanding = false;
        grid.trigger('afterInternalResize');
    }

    async _expandInternal(animate = false) {
        const
            me            = this,
            {
                grid,
                _beforeCollapseState,
                element
            }             = me,
            nextRegion    = grid.getSubGrid(grid.getNextRegion(me.region)),
            splitterOwner = me.splitterElement ? me : me.previousSibling;

        me.isExpanding = true;

        // A LockRows clone is both a split and a partner, the partner branch in expand() relays to it
        grid.syncSplits?.(other => !grid.partners?.includes(other) && other.subGrids[me.region]?.expand(animate));

        if (_beforeCollapseState != null) {
            // If current width matches width expected after expand resize event will not be fired. In such case
            // we want to trigger callback immediately
            let widthChanged = false;

            // See similar clause in collapse method above
            if (me.width !== _beforeCollapseState.elementWidth) {
                widthChanged = true;
            }

            // previous region is not flexed, reduce its width as it was increased in collapse
            if (_beforeCollapseState.nextRegionWidth) {
                nextRegion.width = _beforeCollapseState.nextRegionWidth;
                nextRegion.flex = null;

                if (_beforeCollapseState.nextRegionMaxWidth && !animate) {
                    nextRegion.maxWidth = _beforeCollapseState.nextRegionMaxWidth;
                    nextRegion.header.maxWidth = _beforeCollapseState.nextRegionHeaderMaxWidth;
                }
            }

            me.removeCls('b-grid-sub-grid-collapsed');
            element.removeAttribute('aria-hidden');
            element.removeAttribute('inert');
            me.header.element.removeAttribute('aria-hidden');
            me.header.element.removeAttribute('inert');
            me.footer.element.removeAttribute('aria-hidden');
            me.footer.element.removeAttribute('inert');
            me._collapsed = false;

            // Column caches computed while collapsed exclude this subgrid's columns
            me.columns.clearCaches();

            // The parallel elements which must be in sync width-wise must know about collapsing
            me.virtualScrollerElement.classList.remove('b-collapsed');
            me.header.removeCls('b-collapsed');
            me.footer.removeCls('b-collapsed');

            // This region used to be flex, let's restore it
            if (_beforeCollapseState.flex) {
                // Always restore width, restoring flex won't trigger resize otherwise
                me.width = _beforeCollapseState.width;

                // Widget flex setting clears style width
                me.header.flex = me.flex = _beforeCollapseState.flex;
                me.footer.flex = _beforeCollapseState.flex;
                me._width = null;
            }
            else {
                me.width = _beforeCollapseState.elementWidth;
            }

            if (widthChanged) {
                // Our splitter buttons are hidden when expanded, so we no longer need to keep splitter button set
                // synced in the vertical centre of the view.
                splitterOwner.stopSplitterButtonSyncing();

                me.syncParallelSplitters(false);
            }
        }
    }

    /**
     * Toggles this subgrid `collapsed` state.
     *
     * @param {Boolean} animate - Whether to animate the toggle.
     * @returns {Promise} A Promise which resolves when this SubGrid is fully toggled.
     */
    toggleCollapse(animate = true) {
        if (this._collapsed) {
            return this.expand(animate);
        }
        else {
            return this.collapse(animate);
        }
    }

    async hide() {
        const me = this;

        me.header?.hide();
        me.footer?.hide();
        me.hideSplitter();

        await super.hide();

        // A hidden SubGrid's row elements can neither be nor join the row exposed to assistive technology
        !me.isDestroyed && me.grid.updateRowsAriaOwns();
    }

    async show() {
        const me = this;

        me.header?.show();
        me.footer?.show();

        // Show splitter if not last region
        if (me.region !== me.grid.regions[me.grid.regions.length - 1]) {
            me.showSplitter();
        }

        await super.show();

        !me.isDestroyed && me.grid.updateRowsAriaOwns();
    }

    //endregion

    get widgetClassList() {
        const classList = super.widgetClassList;

        // Remove b-widget, to not interfere with CSS variables defined on the Grid
        classList.shift();

        return classList;
    }
}

// Register this widget type with its Factory
SubGrid.initClass();
