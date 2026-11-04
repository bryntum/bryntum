import Widget from '../../Core/widget/Widget.js';
import DomHelper from '../../Core/helper/DomHelper.js';

/**
 * @module Grid/view/Bar
 */

/**
 * Base class used by Header and Footer. Holds an element for each column. Not intended to be used directly.
 *
 * @extends Core/widget/Widget
 * @internal
 * @abstract
 */
export default class Bar extends Widget {

    static $name = 'Bar';

    static type = 'gridbar';

    static configurable =  {
        htmlCls : '',

        scrollable : {
            overflowX : 'hidden-scroll'
        },

        defaultCls : {
            'b-bryntum' : 0 // Defining color on the full Grid is enough
        },

        // Avoid the default role="presentation" which is invalid here
        role : null,

        ariaElement : null
    };

    //region Init

    get columns() {
        return this._columns || this.subGrid.columns;
    }

    // Only needed for tests which create standalone Headers with no owning SubGrid.
    set columns(columns) {
        this._columns = columns;
    }

    //endregion

    /**
     * Fix cell widths (flex or fixed width) after rendering.
     * Not a part of template any longer because of CSP
     * @private
     */
    fixCellWidths() {
        const
            me          = this,
            { hasFlex } = me.columns;

        let flexBasis;

        // single header "cell"
        me.columns.traverse(column => {
            const
                cellEl      = me.getBarCellElement(column.id),
                domWidth    = DomHelper.setLength(column.width),
                domMinWidth = DomHelper.setLength(column.minWidth),
                domMaxWidth = DomHelper.setLength(column.maxWidth);

            if (cellEl) {
                flexBasis = domWidth;
                cellEl.style.maxWidth = domMaxWidth;

                // Parent column without any specified width and flex should have flex calculated if any child has flex
                if (column.isParent && column.width == null && column.flex == null) {
                    const flex = column.children.reduce((result, child) => (result += child.shown && child.flex || 0), 0);

                    // Do not want to store this flex value on the column since it is always calculated
                    cellEl.style.flex = flex > 0 ? `${flex} 0 auto` : '';

                    // minWidth might leak from other column when reordering, reset it
                    cellEl.style.minWidth = null;
                }
                // Normal case, set flex, width etc.
                else {
                    if (parseInt(column.minWidth) >= 0) {
                        cellEl.style.minWidth = domMinWidth;
                    }

                    // Clear all the things we might have to set to correct cell widths
                    cellEl.style.flex = cellEl.style.flexBasis = cellEl.style.width = '';

                    if (column.flex) {
                        // If column has children we need to give it
                        // flex-shrink: 0, flex-basis: auto so that it always
                        // shrinkwraps its children without shrinking
                        if (!isNaN(parseInt(column.flex)) && column.children) {
                            cellEl.style.flex = `${column.flex} 0 auto`;
                        }
                        else {
                            cellEl.style.flex = column.flex;
                        }
                    }
                    else if (parseInt(column.width) >= 0) {
                        const parent = column.parent;

                        // Only grid header bar has a notion of group headers
                        // Column is a child of an unwidthed group. We have to use width
                        // to stretch it.
                        if (me.isHeader && !parent.isRoot && !parent.width) {
                            cellEl.style.width = domWidth;
                        }
                        else {
                            // Column header widths must be set using flex-basis.
                            // Using width means that wide widths cause a flexed SubGrid
                            // to bust the flex rules.
                            // Note that grid in Grid#onColumnsResized and SubGrid#fixCellWidths,
                            // cells MUST still be sized using width since rows
                            // are absolutely positioned and will not cause the busting out
                            // problem, and rows will not stretch to shrinkwrap the cells
                            // unless they are widthed with width.
                            cellEl.style.flexBasis = flexBasis;
                        }
                    }
                }

                if (column.height >= 0) {
                    cellEl.style.height = DomHelper.setLength(column.height);
                }
            }
        });

        me.scrollable.element.classList.toggle('b-has-flex', hasFlex);
    }

    getLrPadding(cellEl) {
        if (!this.cellLrPadding) {
            const s = cellEl.ownerDocument.defaultView.getComputedStyle(cellEl);
            this.cellLrPadding = parseInt(s.getPropertyValue('padding-left')) + parseInt(s.getPropertyValue('padding-right')) +
                parseInt(s.getPropertyValue('border-left-width')) + parseInt(s.getPropertyValue('border-right-width'));
        }
        return this.cellLrPadding;
    }

    /**
     * Get the header or footer cell element for the specified column.
     * @param {String} columnId Column id
     * @returns {HTMLElement} Header or footer element, depending on which subclass is in use.
     * @private
     */
    getBarCellElement(columnId) {
        return this.element.querySelector(`[data-column-id="${columnId}"]`);
    }

    get overflowingHorizontally() {
        // Some tests use it standalone
        return this.owner?.overflowingHorizontally;
    }

    get overflowingVertically() {
        return false;
    }
}

// Register this widget type with its Factory
Bar.initClass();
