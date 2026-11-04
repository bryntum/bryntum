import DomHelper from '../../Core/helper/DomHelper.js';
import GridFeature from './GridFeature.js';
import StringHelper from '../../Core/helper/StringHelper.js';

DomHelper.loadStylesheet('Grid/feature/base/SearchQuickFind.css');
DomHelper.loadStylesheet('Grid/feature/QuickFind.css');

// import Stylesheet from './QuickFind.css' with { type: 'css' };
// import SharedStylesheet from './base/SearchQuickFind.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'QuickFind');
// DomHelper.applyStylesheet(SharedStylesheet, 'SearchQuickFind');

const actions = {
    goToNextHit      : 1,
    goToPrevHit      : 1,
    showFilterEditor : 1,
    clearSearch      : 1
};

// <remove-on-release>
// TODO: Handle date columns
// TODO: Icons to navigate between hits in the header? or in each cell?
// TODO: Icon to clear quickfind in header
// TODO: regex for valid key pressed?
// </remove-on-release>

/**
 * @module Grid/feature/QuickFind
 */

/**
 * Feature that allows the user to search in a column by focusing a cell and typing. Navigate between hits using the
 * keyboard, <kbd>f3</kbd> or <kbd>ctrl</kbd>/<kbd>cmd</kbd> + <kbd>g</kbd> moves to next, also pressing
 * <kbd>shift</kbd> moves to previous.
 *
 * This feature is <strong>disabled</strong> by default.
 *
 * ## Keyboard shortcuts
 * This feature has the following default keyboard shortcuts:
 *
 * | Keys                                           | Action             | Action description                |
 * |------------------------------------------------|--------------------|-----------------------------------|
 * | <kbd>F3</kbd>                                  | *goToNextHit*      | Move focus to next search hit     |
 * | <kbd>Shift</kbd>+<kbd>F3</kbd>                 | *goToPrevHit*      | Move focus to previous search hit |
 * | <kbd>Ctrl</kbd>+<kbd>G</kbd>                   | *goToNextHit*      | Move focus to next search hit     |
 * | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd>  | *goToPrevHit*      | Move focus to previous search hit |
 * | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F3</kbd> | *showFilterEditor* | Shows the filter editor           |
 * | <kbd>Escape</kbd>                              | *clearSearch*      | Removes the search completely     |
 *
 * {@note}Please note that <kbd>Ctrl</kbd> is the equivalent to <kbd>Command</kbd> and <kbd>Alt</kbd> is the equivalent
 * to <kbd>Option</kbd> for Mac users{/@note}
 *
 * For more information on how to customize keyboard shortcuts, please see
 * [our guide](#Grid/guides/customization/keymap.md)
 *
 * ```javascript
 * // enable QuickFind
 * const grid = new Grid({
 *   features: {
 *     quickFind: true
 *   }
 * });
 *
 * // navigate to next hit programmatically
 * grid.features.quickFind.gotoNextHit();
 * ```
 * {@note}When Store has {@link Core.data.Store#config-lazyLoad}, this feature will only work on locally available data.
 * {/@note}
 *
 * {@inlineexample Grid/feature/QuickFind.js}
 *
 * ## See also
 *
 * - {@link Grid.feature.Search} - Full grid search with highlighting
 * - {@link Grid.feature.Filter} - Data filtering
 *
 * @demo Grid/quickfind
 * @extends Grid/feature/GridFeature
 * @classtype quickFind
 * @feature
 * @tier community
 */
export default class QuickFind extends GridFeature {
    //region Config

    static $name = 'QuickFind';

    static tier = 'community';

    static type = 'quickFind';
    static configurable = {
        mode : 'header',
        find : '',

        /**
         * See {@link #keyboard-shortcuts Keyboard shortcuts} for details
         * @config {Object<String,KeyMapConfig>}
         */
        keyMap : {
            F3             : 'gotoNextHit',
            'Shift+F3'     : 'gotoPrevHit',
            'Ctrl+g'       : 'gotoNextHit',
            'Ctrl+Shift+g' : 'gotoPrevHit',
            'Ctrl+Shift+f' : 'showFilterEditor',
            Escape         : 'clearSearch',

            //Private
            Backspace : 'onBackspace'
        }
    };

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            after : ['onElementKeyPress', 'onCellNavigate']
        };
    }

    //endregion

    //region Init

    static get properties() {
        return {
            hitCls          : 'b-quick-hit',
            hitCellCls      : 'b-quick-hit-cell',
            hitCellBadgeCls : 'b-quick-hit-cell-badge',
            hitTextCls      : 'b-quick-hit-text'
        };
    }

    construct(config) {
        super.construct(config);

        const { client } = this;

        Object.assign(this, {
            grid       : client,
            treeWalker : client.setupTreeWalker(client.element, DomHelper.NodeFilter.SHOW_TEXT, () => DomHelper.NodeFilter.FILTER_ACCEPT)
        });
    }

    isActionAvailable({ actionName }) {
        if (actions[actionName]) {
            const { focusedCell } = this.grid;
            return !this.disabled && focusedCell?.record && !focusedCell.isActionable && this.find.length > 0;
        }
    }

    doDisable(disable) {
        if (disable) {
            this.clear();
        }

        super.doDisable(disable);
    }

    get store() {
        return this.grid.store;
    }

    //endregion

    //region Show/hide QuickFind

    /**
     * Shows a "searchfield" in the header. Triggered automatically when you have a cell focused and start typing.
     * @private
     */
    showQuickFind() {
        const
            me       = this,
            { grid } = me,
            header   = grid.getHeaderElement(me.columnId);

        if (header) {
            if (!me.headerField) {
                const [element, field, badge] = DomHelper.createElement({
                    tag       : 'div',
                    className : 'b-quick-hit-header b-colorize',
                    children  : [
                        { tag : 'div', className : 'b-quick-hit-field' },
                        { tag : 'div', className : 'b-quick-hit-badge' }
                    ]
                }, { returnAll : true });

                if (me.mode === 'header') {
                    header.appendChild(element);
                }
                else {
                    element.className += ' b-quick-hit-mode-grid';
                    grid.element.appendChild(element);
                }

                me.headerField = {
                    header    : element,
                    field,
                    badge,
                    colHeader : header
                };
            }

            me.headerField.field.innerHTML = me.find;
            me.headerField.badge.innerHTML = me.found.length;

            header.classList.add('b-quick-find-header');
        }

        if ((header || grid.hideHeaders) && !me.renderListenerInitialized) {
            grid.rowManager.ion({
                rendercell : me.renderCell,
                thisObj    : me
            });
            me.renderListenerInitialized = true;
        }

    }

    /**
     * Hide the "searchfield" and remove highlighted hits. Called automatically when pressing [esc] or backspacing away
     * the keywords.
     * @private
     */
    hideQuickFind() {
        const
            me                    = this,
            { grid, headerField } = me;

        // rerender cells to remove quick-find markup
        for (const hit of (me.prevFound || me.found)) {
            const row = grid.getRowById(hit.id);
            if (row) {
                const cellElement = row.getCell(me.columnId);
                // Column might be out of view
                if (cellElement) {
                    // Need to force replace quick finds markup
                    row.forceInnerHTML = true;

                    cellElement._content = null;
                    row.renderCell(cellElement);

                    row.forceInnerHTML = false;
                }
            }
        }

        if (headerField) {
            headerField.header.parentNode?.removeChild(headerField.header);
            headerField.colHeader.classList.remove('b-quick-find-header');
            me.headerField = null;
        }

        if (me.renderListenerInitialized) {
            grid.rowManager.un({ rendercell : me.renderCell }, me);
            me.renderListenerInitialized = false;
        }

        grid.trigger('hideQuickFind');
    }

    //endregion

    //region Search

    /**
     * Performs a search and highlights hits. If find is empty, QuickFind is closed.
     * @param {String} find Text to search for
     * @param {String} columnFieldOrId Column to search
     */
    search(find, columnFieldOrId = this.columnId, fromSplit = false) {
        const
            me       = this,
            { grid } = me,
            column   = grid.columns.getById(columnFieldOrId) || grid.columns.get(columnFieldOrId),
            found    = me.store.findByField(column.field, find, column.mergeCells && column.isSorted);

        let i = 1;

        Object.assign(me, {
            foundMap  : {},
            prevFound : me.found,
            found,
            find,
            columnId  : column.id,
            findRe    : new RegExp(`(\\s+)?(${StringHelper.escapeRegExp(String(find))})(\\s+)?`, 'ig')
        });

        if (find) {
            me.showQuickFind();
        }
        else {
            me.hideQuickFind();
        }

        // clear old hits
        for (const cellElement of DomHelper.children(grid.element, `.${me.hitCls}`)) {
            cellElement.classList.remove(me.hitCls, me.hitCellCls);

            if (cellElement._originalContent) {
                cellElement.innerHTML = cellElement._originalContent;
                cellElement._originalContent = null;
            }
        }

        if (!found) {
            return;
        }

        if (found.length > 0 && !fromSplit) {
            me.gotoClosestHit(grid.focusedCell, found);
        }

        // highlight hits for visible cells
        for (const hit of found) {
            me.foundMap[hit.id] = i++;

            const
                row         = grid.getRowById(hit.data.id),
                // Column might be out of view, in which case rows have no cells for it. Cells added when it
                // scrolls into view are highlighted by the rendercell listener instead
                cellElement = row?.getCell(column.id);

            cellElement && row.renderCell(cellElement);

            // limit highlighted hits
            if (i > 1000) {
                break;
            }
        }

        // Relay to other grids when splitting
        grid.syncSplits?.(other => other.features.quickFind.search(find, columnFieldOrId, true));

        grid.trigger('quickFind', { find, found });
    }

    /**
     * Clears and closes QuickFind.
     */
    clear() {
        if (this.find || this.found?.length) {
            this.search('');
        }
    }

    /**
     * Number of results found
     * @type {Number}
     * @readonly
     */
    get foundCount() {
        return this.found?.length ?? 0;
    }

    /**
     * Found results (as returned by Store#findByField), an array in format { index: x, data: record }
     * @member {StoreSearchResult[]} found
     * @readonly
     */

    //endregion

    //region Navigation

    /**
     * Go to specified hit.
     * @param {Number} index
     */
    gotoHit(index) {
        const nextHit = this.found[index];

        if (nextHit) {
            this.grid.focusCell({
                columnId : this.columnId,
                id       : nextHit.id
            }, { doSelect : true });
        }

        return Boolean(nextHit);
    }

    gotoClosestHit(focusedCell, found) {
        const
            focusedIndex = focusedCell ? this.grid.store.indexOf(focusedCell.id) : 0,
            foundSorted  = found.slice().sort(
                (a, b) => Math.abs(a.index - focusedIndex) - Math.abs(b.index - focusedIndex)
            );

        this.gotoHit(found.indexOf(foundSorted[0]));
    }

    /**
     * Go to the first hit.
     */
    gotoFirstHit() {
        this.gotoHit(0);
    }

    /**
     * Go to the last hit.
     */
    gotoLastHit() {
        this.gotoHit(this.found.length - 1);
    }

    /**
     * Select the next hit, scrolling it into view. Triggered with [f3] or [ctrl]/[cmd] + [g].
     */
    gotoNextHit() {
        const me = this;

        if (!me.found?.length) {
            return;
        }

        // start from focused cell, or if focus has left grid use lastFocusedCell
        const
            { grid }     = me,
            currentId    = grid._focusedCell?.id ?? grid.lastFocusedCell?.id,
            currentIndex = grid.store.indexOf(currentId) || 0,
            nextHit      = me.found.find(hit => hit.index > currentIndex);

        if (nextHit) {
            grid.focusCell({
                columnId : me.columnId,
                id       : nextHit.id
            }, { doSelect : true });
        }
        else {
            me.gotoFirstHit();
        }
    }

    /**
     * Select the previous hit, scrolling it into view. Triggered with [shift] + [f3] or [shift] + [ctrl]/[cmd] + [g].
     */
    gotoPrevHit() {
        const
            me              = this;

        if (!me.found?.length) {
            return;
        }

        const
            { grid, found } = me,
            currentId       = grid._focusedCell?.id ?? grid.lastFocusedCell?.id,
            currentIndex    = grid.store.indexOf(currentId) || 0;

        let prevHit;

        if (!found.length) {
            return;
        }

        for (let i = found.length - 1; i--; i >= 0) {
            if (found[i].index < currentIndex) {
                prevHit = found[i];
                break;
            }
        }

        if (prevHit) {
            grid.focusCell({
                columnId : me.columnId,
                id       : prevHit.id
            }, { doSelect : true });
        }
        else {
            me.gotoLastHit();
        }
    }

    //endregion

    //region Render

    /**
     * Called from SubGrid when a cell is rendered.
     * @private
     */
    renderCell({ cellElement, column, record }) {
        const
            me            = this,
            { classList } = cellElement,
            {
                treeWalker,
                findRe,
                hitTextCls
            }             = me,
            hitIndex      = me.columnId === column.id && me.foundMap?.[record.id];

        if (hitIndex) {
            // highlight cell
            classList.add(me.hitCls);
            cellElement.isQuickHit = true;
            cellElement._originalContent = cellElement.innerHTML;

            // if features have added other stuff to the cell, value is in div.b-grid-cell-value
            // highlight in cell if found in innerHTML
            const inner = treeWalker.currentNode = DomHelper.down(cellElement, '.b-grid-cell-value,.b-tree-cell-value') || cellElement;

            for (let textNode = treeWalker.nextNode(); textNode && inner.contains(textNode);) {
                const
                    nodeToReplace = textNode,
                    textContent   = textNode.nodeValue,
                    newText       = ['<span>'];

                // Move onto next text node before we replace the node with a highlight HTML sequence
                textNode = treeWalker.nextNode();

                let offset = findRe.lastIndex;

                // Convert textContent into an innerHTML string which htmlEncodes the text and embeds
                // a highlighting span which contains the target text.
                for (let match = findRe.exec(textContent); match; match = findRe.exec(textContent)) {
                    const
                        preamble    = textContent.substring(offset, match.index),
                        spaceBefore = match[1] ? '\xa0' : '',
                        v           = match[2],
                        spaceAfter  = match[3] ? '\xa0' : '';

                    newText.push(`${StringHelper.encodeHtml(preamble)}${spaceBefore}<span class="${hitTextCls} b-colorize">${v}</span>${spaceAfter}`);
                    offset = findRe.lastIndex;
                }

                newText.push(StringHelper.encodeHtml(textContent.substring(offset)), '</span>');

                // Insert a fragment with each match wrapped with a span.
                nodeToReplace.parentNode.insertBefore(DomHelper.createElementFromTemplate(newText.join(''), {
                    fragment : true
                }), nodeToReplace);
                nodeToReplace.remove();
            }
            DomHelper.createElement({
                parent    : cellElement,
                className : me.hitCellBadgeCls,
                text      : hitIndex
            });
        }
    }

    //endregion

    //region Events

    onBackspace(event) {
        const me = this;
        if (me.find) {
            me.find = me.find.substr(0, me.find.length - 1);
            me.search(me.find);
            return true;
        }
        return false;
    }

    clearSearch() {
        if (this.find) {
            this.find = '';
            this.search(this.find);
            return true;
        }
        return false;
    }

    showFilterEditor() {
        const
            me         = this,
            { filter } = me.client.features;

        if (filter && me.columnId && me.foundCount) {
            me.clear();
            filter.showFilterEditor(me.client.columns.getById(me.columnId), me.find);
        }
    }

    /**
     * Chained function called on grids keypress event. Handles input for "searchfield".
     * @private
     * @param {Object} event Event object
     */
    onElementKeyPress(event) {
        const
            me              = this,
            { grid }        = me,
            { focusedCell } = grid;

        // Only react to keystrokes on grid cell elements
        if (!event.handled && !me.disabled && focusedCell?.record && !focusedCell.isActionable && event.key?.length === 1) {
            const column = grid.columns.getById(grid._focusedCell.columnId);
            // if trying to search in invalid column, it's a hard failure
            //<debug>
            console.assert(column, 'Focused cell column not found');
            //</debug>
            if (column && column.searchable !== false) {
                me.columnId = grid._focusedCell.columnId;
                me.find += event.key;
                me.search(me.find);
            }
        }
    }

    onCellNavigate(grid, fromCellSelector, toCellSelector) {
        const
            me = this;

        if (me.find && (!toCellSelector || toCellSelector.columnId !== me.columnId)) {
            me.clear();
        }
    }

    //endregion
}

QuickFind.initClass();
