import DomHelper from '../../Core/helper/DomHelper.js';
import DragHelper from '../../Core/helper/DragHelper.js';
import GridFeature from './GridFeature.js';
import Delayable from '../../Core/mixin/Delayable.js';
import Widget from '../../Core/widget/Widget.js';
import ScrollManager from '../../Core/util/ScrollManager.js';

DomHelper.loadStylesheet('Grid/feature/ColumnReorder.css');

// import Stylesheet from './ColumnReorder.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ColumnReorder');

/**
 * @module Grid/feature/ColumnReorder
 */

/**
 * Allows user to reorder columns by dragging headers. Click and drag a column header to move it to a new position.
 * Visual feedback shows the drop target while dragging. To get notified about column reorder, listen to the
 * `change` event on the {@link Grid.data.ColumnStore columns} store.
 *
 * {@inlineexample Grid/feature/ColumnReorder.js}
 *
 * This feature is <strong>enabled</strong> by default.
 *
 * ## See also
 *
 * - {@link Grid.feature.ColumnDragToolbar} - Toolbar shown during column drag
 * - {@link Grid.feature.ColumnPicker} - Column visibility picker
 *
 * @demo Grid/columns
 * @extends Grid/feature/GridFeature
 * @classtype columnReorder
 * @feature
 * @tier community
 */
export default class ColumnReorder extends Delayable(GridFeature) {
    //region Init

    static $name = 'ColumnReorder';

    static tier = 'community';

    static type = 'columnReorder';
    static defaultEnabled = true;
    ignoreSelectors = [
        '.b-grid-header-resize-handle',
        '.b-field'
    ];

    // Plugin configuration. This plugin chains some functions in Grid
    static get pluginConfig() {
        return {
            after : ['onInternalPaint', 'renderContents']
        };
    }

    static configurable = {
        /**
         * Set to `true` to stretch the column drag proxy element to cover the full height of the grid.
         * @prp {Boolean}
         */
        stretchedDragProxy : null
    };

    /**
     * Initialize drag & drop (called from render)
     * @private
     */
    init() {
        const
            me         = this,
            { grid }   = me,
            gridEl     = grid.element,
            containers = DomHelper.children(gridEl, '.b-grid-headers');

        containers.push(...DomHelper.children(gridEl, '.b-grid-header-children'));

        if (me.dragHelper) {
            // update the dragHelper with the new set of containers it should operate upon
            me.dragHelper.containers = containers;
        }
        else {
            // When using state provider in Salesforce we get into init before component is rendered
            // which makes it impossible to locate correct root node. This is why we set up drag helper on paint
            // https://github.com/bryntum/bryntum/issues/6998
            grid.whenVisible(() => me.createDragHelper());
        }
    }

    createDragHelper() {
        const
            me         = this,
            { grid }   = me,
            gridEl     = grid.element,
            containers = DomHelper.children(gridEl, '.b-grid-headers');

        containers.push(...DomHelper.children(gridEl, '.b-grid-header-children'));

        me.dragHelper = new DragHelper({
            name                       : 'columnReorder',
            mode                       : 'container',
            dragThreshold              : 10,
            targetSelector             : '.b-grid-header',
            floatRootOwner             : grid,
            rtlSource                  : grid,
            outerElement               : grid.headerContainer,
            externalDropTargetSelector : '.b-group-bar, .b-column-drag-toolbar',
            monitoringConfig           : {
                scrollables : [{
                    element : '.b-grid-headers'
                }]
            },
            scrollManager : ScrollManager.new({
                direction : 'horizontal',
                element   : grid.headerContainer
            }),
            containers,
            isElementDraggable(element) {
                const abort = Boolean(element.closest(me.ignoreSelectors.join(',')));

                if (abort || me.disabled) {
                    return false;
                }

                const
                    columnEl = element.closest(this.targetSelector),
                    column   = columnEl && grid.columns.getById(columnEl.dataset.columnId),
                    isLast   = column?.childLevel === 0 && grid.subGrids[column.region].columns.count === 1;

                // <remove-on-release>
                // TODO: If we want to prevent dragging last column out of group we can use the code below...
                // isLast = column.level !== 0
                //         // In grouped header, do not allow dragging last remaining child
                //         ? column.parent.children.length === 1
                //         // Not in a grouped header, do not allow dragging last remaining column
                //         : grid.subGrids[column.region].columns.count === 1;
                // </remove-on-release>

                return Boolean(column) && column.draggable !== false && !isLast;
            },
            ignoreSelector : '.b-filter-icon,.b-grid-header-resize-handle',

            // Allow dragging columns over rows inside our client grid as well
            resolveTargetElement(element) {
                const targetElement = element.closest('[data-column-id]') || element;
                if (targetElement && grid.element.contains(targetElement)) {
                    return grid.columns.getById(targetElement.dataset.columnId)?.element;
                }
            },
            internalListeners : {
                beforeDragStart : me.onBeforeDragStart,
                dragstart       : me.onDragStart,
                drag            : me.onDrag,
                drop            : me.onDrop,
                abort           : me.onAbort,
                thisObj         : me
            }
        });

        me.relayEvents(me.dragHelper, ['dragStart', 'drag', 'drop', 'abort'], 'gridHeader');

        return me.dragHelper;
    }

    //endregion

    //region Plugin config

    doDestroy() {
        this.dragHelper?.scrollManager.destroy();
        this.dragHelper?.destroy();

        super.doDestroy();
    }

    get grid() {
        return this.client;
    }

    //endregion

    //region Events (drop)

    onBeforeDragStart({ source : dragHelper, context, event }) {
        const
            me          = this,
            { element } = context,
            column      = context.column = me.client.columns.getById(element.dataset.columnId);

        dragHelper.autoSizeClonedTarget = !me.stretchedDragProxy && !me.usingGroupBarWidget;
        // Require that we drag inside grid header while dragging if we don't have a drag toolbar or external drop
        // target defined
        dragHelper.dropTargetSelector = `#${me.grid.element.id}${me.stretchedDragProxy ? '' : ' :is(.b-grid-headers, .b-grid-row, .b-group-bar, .b-column-drag-toolbar)'}`;

        /**
         * This event is fired prior to starting a column drag gesture. The drag is canceled if a listener returns `false`.
         * @on-owner
         * @event beforeColumnDragStart
         * @param {Grid.view.Grid} source The grid instance.
         * @param {Grid.column.Column} column The dragged column.
         * @param {Event} event The browser event.
         * @preventable
         */
        return column.allowDrag && me.client.trigger('beforeColumnDragStart', { column, event });
    }

    onDragStart({ context, event }) {
        const
            me                                        = this,
            { grid, usingGroupBarWidget, dragHelper } = me,
            { column, dragProxy, element }            = context,
            headerContainerBox                        = grid.element.querySelector('.b-grid-header-container').getBoundingClientRect();

        dragProxy.style.width = column.element.offsetWidth + 'px';
        dragHelper.useCenteredCursor = !me.stretchedDragProxy;

        if (!grid.features.columnDragToolbar && !usingGroupBarWidget) {
            dragHelper.minY = headerContainerBox.top;

            if (me.stretchedDragProxy) {
                dragProxy.classList.add('b-column-reorder-stretched');
                DomHelper.setTranslateXY(dragProxy, element.left, element.top);
                dragHelper.maxY = grid.element.getBoundingClientRect().bottom;
            }
            else {
                dragHelper.maxY = headerContainerBox.bottom;
            }
            dragProxy.style.height = grid.bodyElement.offsetHeight + 'px';
        }
        else {
            dragProxy.style.height = headerContainerBox.height + 'px';
        }

        grid.addCls('b-dragging-header');

        if (usingGroupBarWidget) {
            dragProxy.classList.add('b-grid-reordering-columns-with-group-bar');
        }
        // Hide compact filter field while dragging
        if (grid.features.filterBar && grid.features.filterBar.compactMode) {
            dragProxy.classList.add('b-filter-bar-compact');
        }

        /**
         * This event is fired when a column drag gesture has started.
         * @on-owner
         * @event columnDragStart
         * @param {Grid.view.Grid} source The grid instance.
         * @param {Grid.column.Column} column The dragged column.
         * @param {Event} event The browser event.
         */
        grid.trigger('columnDragStart', { column, event });
    }

    onDrag({ context, event }) {
        const
            me           = this,
            grid         = me.client,
            {
                column,
                insertBefore : insertBeforeElement
            }            = context,
            insertBefore = grid.columns.getById(insertBeforeElement?.dataset.columnId),
            subGrid      = Widget.fromElement(event.target, 'gridheader')?.subGrid || Widget.fromElement(event.target.closest('.b-sub-grid'));

        // If SubGrid is configured with a sealed column set, do not allow moving into it
        if (subGrid?.sealedColumns) {
            context.valid = false;
        }

        /**
         * This event is fired when a column is being dragged, and you can set the `valid` flag on the `context` object
         * to indicate whether the drop position is valid or not.
         * @event columnDrag
         * @on-owner
         * @param {Grid.view.Grid} source The grid instance.
         * @param {Grid.column.Column} column The dragged column.
         * @param {Grid.column.Column} insertBefore The column before which the dragged column will be inserted (if not last).
         * @param {Event} event The browser event.
         * @param {Object} context
         * @param {Boolean} context.valid Set this to `true` or `false` to indicate whether the drop position is valid.
         */
        grid.trigger('columnDrag', { column, insertBefore, event, context });
    }

    /**
     * Handle drop
     * @private
     */
    onDrop({ context, event }) {
        if (!context.valid) {
            return this.onInvalidDrop({ context, event });
        }

        const
            me              = this,
            { grid }        = me,
            { column }      = context,
            element         = context.dragging,
            onHeader        = context.targetElement?.closest('.b-grid-header'),
            droppedInRegion = context.draggedTo?.closest('[data-region]')?.dataset.region,
            isReorder       = droppedInRegion || onHeader;

        let vetoed, newParent, insertBefore, toRegion, oldParent;

        grid.removeCls('b-dragging-header');

        // Regular grid column reorder
        if (isReorder) {
            // If dropping on right edge of grid-headers element, append to that subgrid
            const
                onColumn = onHeader ? grid.columns.getById(onHeader.dataset.columnId) : grid.subGrids[droppedInRegion].columns.last,
                sibling  = context.insertBefore;

            toRegion     = droppedInRegion || onColumn.region;
            oldParent    = column.parent;
            insertBefore = sibling ? grid.columns.getById(sibling.dataset.columnId) : grid.subGrids[toRegion].columns.last.nextSibling;

            if (insertBefore) {
                newParent = insertBefore.parent;
            }
            else {
                const groupNode = onHeader?.parentElement.closest('.b-grid-header');

                if (groupNode) {
                    newParent = grid.columns.getById(groupNode.dataset.columnId);
                }
                else {
                    newParent = grid.columns.rootNode;
                }
            }

            // If dropped into its current position in the same SubGrid - abort
            vetoed = (toRegion === column.region && oldParent === newParent && (onColumn === column.previousSibling || insertBefore === column.nextSibling));
            element.remove();
        }

        // Clean up element used during drag drop as it will not be removed by Grid when it refreshes its header elements

        /**
         * This event is fired when a column is dropped, and you can return false from a listener to abort the operation.
         * @event beforeColumnDropFinalize
         * @on-owner
         * @param {Grid.view.Grid} source The grid instance.
         * @param {Grid.column.Column} column The dragged column.
         * @param {Grid.column.Column} insertBefore The column before which the dragged column will be inserted.
         * @param {Grid.column.Column} newParent The new parent column.
         * @param {Event} event The browser event.
         * @param {String} region The region where the column was dropped.
         * @preventable
         */
        vetoed = vetoed || grid.trigger('beforeColumnDropFinalize', {
            column, newParent, insertBefore, event, region : toRegion
        }) === false;

        if (!vetoed && isReorder) {
            const sorters = grid.columns.sorters.slice();

            // Remove any sorters silently
            grid.columns.sorters.length = 0;
            grid.eachSubGrid(subGrid => {
                subGrid.columns.sorters.length = 0;
            });

            // Insert the column into its new place, which might be vetoed if column is sealed
            vetoed = !newParent.insertChild(column, insertBefore);

            // Put back the sorters if the operation was vetoed
            if (vetoed && sorters.length) {
                // Will propagate to all subGrids
                grid.columns.sort(sorters);
            }
        }

        context.valid = !vetoed;

        if (!vetoed && isReorder) {
            if (column.parent.isRoot && column.region !== toRegion) {
                column.region = toRegion;
                // Changing region may cause width change of flexed columns, refresh cache
                grid.eachSubGrid(subGrid => subGrid.header.cachePositions());
                grid.rowManager.positionCells();
            }

            // Check if we should remove last child
            if (oldParent.children.length === 0) {
                oldParent.parent.removeChild(oldParent);
            }
        }

        /**
         * This event is always fired after a column is dropped. The `valid` param is `true` if the operation was not
         * vetoed and the column was moved in the column store.
         * @event columnDrop
         * @on-owner
         * @param {Grid.view.Grid} source The grid instance.
         * @param {Grid.column.Column} column The dragged column.
         * @param {Grid.column.Column} insertBefore The column before which the dragged column will be inserted.
         * @param {Grid.column.Column} newParent The new parent column.
         * @param {Boolean} valid `true` if the operation was not vetoed.
         * @param {Event} event The browser event.
         * @param {String} region The region where the column was dropped.
         * @preventable
         */
        grid.trigger('columnDrop', { column, newParent, insertBefore, valid : context.valid, event, region : toRegion });
    }

    onAbort({ context, event }) {
        this.onInvalidDrop({ context, event });
    }

    /**
     * Handle invalid drop
     * @private
     */
    onInvalidDrop({ context, event }) {
        const
            { grid }   = this,
            { column } = context;

        grid.trigger('columnDrop', { column, valid : false, event });
        grid.removeCls('b-dragging-header');
    }

    //endregion

    //region Render

    /**
     * Updates DragHelper with updated headers when grid contents is rerendered
     * @private
     */
    renderContents() {
        // columns shown, hidden or reordered
        this.init();
    }

    /**
     * Initializes this feature on grid paint.
     * @private
     */
    onInternalPaint() {
        // always reinit on paint
        this.init();
    }

    /**
     * Returns true if a reorder operation is active
     * @member {Boolean}
     * @readonly
     */
    get isReordering() {
        return Boolean(this.dragHelper?.isDragging);
    }

    //endregion
}

ColumnReorder.initClass();
