import Column from './Column.js';
import ColumnStore from '../data/ColumnStore.js';
import DomHelper from '../../Core/helper/DomHelper.js';

DomHelper.loadStylesheet('Grid/column/RowNumberColumn.css');

// import Stylesheet from './RowNumberColumn.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'RowNumberColumn');

/**
 * @module Grid/column/RowNumberColumn
 */

/**
 * A column that displays the row number in each cell.
 *
 * There is no `editor`, since the value is read-only.
 *
 * ```javascript
 * const grid = new Grid({
 *   appendTo : targetElement,
 *   width    : 300,
 *   columns  : [
 *     { type : 'rownumber' }
 *   ]
 * });
 * ```
 *
 * {@inlineexample Grid/column/RowNumberColumn.js}
 *
 * ## See also
 *
 * - {@link Grid.column.Column} - Base column class
 *
 * @extends Grid/column/Column
 * @classtype rownumber
 * @column
 * @tier community
 */
export default class RowNumberColumn extends Column {

    static $name = 'RowNumberColumn';

    static type = 'rownumber';

    static get defaults() {
        return {
            /**
             * @hideconfigs groupable, sortable, filterable, searchable, resizable, draggable, cellEditor,
             * editTargetSelector, editor, field, finalizeCellEdit, instantUpdate, invalidAction, mergeCells,
             * mergeable, revertOnEscape
             */

            groupable  : false,
            sortable   : false,
            filterable : false,
            searchable : false,
            resizable  : false,
            draggable  : false,
            mergeable  : false,

            minWidth  : 50,
            width     : 50,
            align     : 'right',
            text      : '#',
            ariaLabel : 'L{RowNumberColumn.rowNumber}',
            editor    : false,
            readOnly  : true
        };
    }

    construct(config, ...args) {
        super.construct(config, ...args);

        const
            me       = this,
            { grid } = me;

        me.internalCellCls        = 'b-row-number-cell';
        me.externalHeaderRenderer = me.headerRenderer;
        me.setData('headerRenderer', me.internalHeaderRenderer);

        if (grid) {
            // Update our width when the store mutates (tests test Columns in isolation with no grid, so we must handle that!)
            grid.ion({
                bindStore : 'bindStore',
                thisObj   : me
            });

            me.bindStore({ store : grid.store, initial : true });

            if (grid.store.count) {
                grid.once(!grid.rendered ? 'paint' : 'renderRows', 'resizeToFitContent', me);
            }
        }
    }

    get groupHeaderReserved() {
        return true;
    }

    bindStore({ store, initial }) {
        const me = this;

        me.detachListeners('grid');

        store.ion({
            name                                  : 'grid',
            [`change${me.grid.asyncEventSuffix}`] : 'onStoreChange',
            thisObj                               : me
        });

        if (!initial && !me.resizeToFitContent()) {
            me.measureOnRender();
        }
    }

    onStoreChange({ action, isMove }) {
        if (action === 'dataset' || action === 'add' || action === 'remove' || action === 'removeall') {

            // Ignore remove phase of move operation, resize on add phase only
            if (action === 'remove' && isMove) {
                return;
            }

            const result = this.resizeToFitContent();

            // Gantt/Scheduler draws later when loading using CrudManager (refresh is suspended), catch first draw
            if (action === 'dataset' && !result && this.grid.store.count) {
                this.measureOnRender();
            }
        }
    }

    measureOnRender() {
        this.grid.rowManager.ion({
            renderDone() {
                this.resizeToFitContent();
            },
            once    : true,
            thisObj : this
        });
    }

    /**
     * Renderer that displays the row number in the cell.
     * @private
     */
    defaultRenderer({ record, grid }) {
        let count = record.isSpecialRow ? '' : grid.store.indexOf(record, true) + 1;

        if (grid.splitFrom?.isLockedRows) {
            count += grid.splitFrom.features.lockRows?.numberOfLockedRows ?? 0;
        }

        return count;
    }

    /**
     * Resizes the column to match the widest string in it.
     * @private
     */
    resizeToFitContent() {
        const
            me          = this,
            subViews    = me.grid.features.lockRows?.subViews,
            grid        = subViews?.[1] === me.grid ? subViews[0] : me.grid,
            { element } = grid,
            { store }   = grid,
            { count }   = store;

        if (count && !me.hidden) {
            const cellElement = element.querySelector(`.b-grid-cell[data-column-id="${me.id}"]`);
            // <remove-on-release>
            // cellElement might not exist, e.g. when trial is expired
            // </remove-on-release>
            if (cellElement) {
                const maxWidth = DomHelper.measureText(count, cellElement, false, cellElement.offsetParent ? cellElement.parentElement : null, true);
                me.width = Math.max(me.minWidth, maxWidth + 3); // Measurement is a little off for some reason, better we are too wide than too narrow

                return true;
            }
        }

        return false;
    }

    set flex(f) {
        //<debug>
        if (f != null) {
            throw new Error('RowNumber column may not be flexed');
        }
        //</debug>
    }

    internalHeaderRenderer({ headerElement, column }) {
        headerElement.classList.add('b-row-number-header');
        return column.externalHeaderRenderer?.call(this, ...arguments) || column.headerText;
    }
}

ColumnStore.registerColumnType(RowNumberColumn, true);
