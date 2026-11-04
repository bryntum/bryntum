import DomHelper from '../../Core/helper/DomHelper.js';
import TemplateHelper from '../../Core/helper/TemplateHelper.js';
import Bar from './Bar.js';

DomHelper.loadStylesheet('Grid/view/Footer.css');

// import Stylesheet from './Footer.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Footer');

/**
 * @module Grid/view/Footer
 */

/**
 * Grid footer, used by Summary feature. You should not need to create instances manually.
 *
 * @extends Grid/view/Bar
 * @internal
 */
export default class Footer extends Bar {

    static $name = 'Footer';

    // Factoryable type name
    static type = 'gridfooter';

    get subGrid() {
        return this._subGrid;
    }

    set subGrid(subGrid) {
        this._subGrid = this.owner = subGrid;
    }

    refreshContent() {
        this.element.firstElementChild.innerHTML = this.contentTemplate();
        this.fixFooterWidths();
    }

    onInternalPaint({ firstPaint }) {
        if (firstPaint) {
            this.refreshContent();
        }
    }

    template() {
        const region = this.subGrid.region;

        return TemplateHelper.tpl`
            <div class="b-grid-footer-scroller b-grid-footer-scroller-${region}" role="presentation">
                <div data-reference="footersElement" class="b-grid-footers b-grid-footers-${region}" data-region="${region}" role="presentation"></div>
            </div>
        `;
    }

    get overflowElement() {
        return this.footersElement;
    }

    //region Getters

    /**
     * Get the footer cell element for the specified column.
     * @param {String} columnId Column id
     * @returns {HTMLElement} Footer cell element
     */
    getFooter(columnId) {
        return this.getBarCellElement(columnId);
    }

    //endregion

    /**
     * Footer template. Iterates leaf columns to create content.
     * Style not included because of CSP. Widths are fixed up in
     * {@link #function-fixFooterWidths}
     * @private
     */
    contentTemplate() {
        return this.columns.visibleColumns.map(column => {
            return TemplateHelper.tpl`
                <div
                    class="b-grid-footer ${column.align ? `b-grid-footer-align-${column.align}` : ''} ${column.cls || ''}"
                    data-column="${column.field || ''}" data-column-id="${column.id}" data-all-index="${column.allIndex}"
                    role="gridcell">
                    ${column.footerText || ''}
                </div>`;
        }).join('');
    }

    /**
     * Fix footer widths (flex or fixed width) after rendering. Not a part of template any longer because of CSP
     * @private
     */
    fixFooterWidths() {
        this.fixCellWidths();
    }
}

// Register this widget type with its Factory
Footer.initClass();
