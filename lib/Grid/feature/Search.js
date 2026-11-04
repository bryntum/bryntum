import DomDataStore from '../../Core/data/DomDataStore.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import Delayable from '../../Core/mixin/Delayable.js';
import GridFeature from './GridFeature.js';
DomHelper.loadStylesheet('Grid/feature/base/SearchQuickFind.css');
DomHelper.loadStylesheet('Grid/feature/Search.css');

// import Stylesheet from './Search.css' with { type: 'css' };
// import SharedStylesheet from './base/SearchQuickFind.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Search');
// DomHelper.applyStylesheet(SharedStylesheet, 'SearchQuickFind');

const actions = {
    goToNextHit : 1,
    goToPrevHit : 1
};

// <remove-on-release>
// TODO: Should listen for store search also, to work the other way around
// TODO: Buggy sometimes, try searching for Barcelona tigers, navigate using buttons
// TODO: Allow regex
// TODO: Optional case sensitive
// TODO: build in UI, popup with keyboard shortcut?
// </remove-on-release>

/**
 * @module Grid/feature/Search
 */

/**
 * {@inlineexample Grid/feature/Search.js vertical}
 *
 * Feature that allows the user to search the entire grid. Navigate between hits using the
 * keyboard, <kbd>F3</kbd> or <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>G</kbd> moves to next, also pressing <kbd>Shift</kbd> moves to previous.
 *
 * Note that this feature does not include a UI, please build your own and call appropriate methods in the feature.
 * For a demo implementation, see <a href="../examples/search/" target="_blank">Search example</a>.
 *
 * This feature is <strong>disabled</strong> by default.
 *
 * ## Keyboard shortcuts
 *
 * This feature has the following default keyboard shortcuts:
 *
 * | Keys                                          | Action        | Action description                |
 * |-----------------------------------------------|---------------|-----------------------------------|
 * | <kbd>F3</kbd>                                 | *goToNextHit* | Move focus to next search hit     |
 * | <kbd>Shift</kbd>+<kbd>F3</kbd>                | *goToPrevHit* | Move focus to previous search hit |
 * | <kbd>Ctrl</kbd>+<kbd>G</kbd>                  | *goToNextHit* | Move focus to next search hit     |
 * | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd> | *goToPrevHit* | Move focus to previous search hit |
 *
 * <div class="note">Please note that <kbd>Ctrl</kbd> is the equivalent to <kbd>Command</kbd> and <kbd>Alt</kbd>
 * is the equivalent to <kbd>Option</kbd> for Mac users</div>
 *
 * For more information on how to customize keyboard shortcuts, please see
 * [our guide](#Grid/guides/customization/keymap.md)
 *
 * ```javascript
 * // enable Search
 * let grid = new Grid({
 *   features : {
 *     search : true
 *   }
 * });
 *
 * // perform search
 * grid.features.search.search('steve');
 * ```
 *
 * {@note}When Store has {@link Core.data.Store#config-lazyLoad}, this feature will only work on locally available
 * data.{/@note}
 *
 * ## See also
 *
 * - {@link Grid.feature.QuickFind} - Quick column-level find
 * - {@link Grid.feature.Filter} - Data filtering
 *
 * @demo Grid/search
 *
 * @extends Grid/feature/GridFeature
 * @classtype search
 * @feature
 * @tier community
 */
export default class Search extends Delayable(GridFeature) {
    //region Init

    static $name = 'Search';

    static type = 'search';
    static tier = 'community';

    static configurable = {
        /**
         * The maximum amount of search hits
         * @config {Number}
         * @default
         */
        limit : 1000,

        /**
         * Set to `false` to not show the search hit index numbers
         * @config {Boolean}
         * @default
         */
        showHitIndex : true,

        /**
         * See {@link #keyboard-shortcuts Keyboard shortcuts} for details
         * @config {Object<String,KeyMapConfig>}
         */
        keyMap : {
            F3             : 'gotoNextHit',
            'Ctrl+g'       : 'gotoNextHit',
            'Shift+F3'     : 'gotoPrevHit',
            'Ctrl+Shift+g' : 'gotoPrevHit'
        }
    };

    static get properties() {
        return {
            hitCls          : 'b-search-hit',
            hitCellCls      : 'b-search-hit-cell',
            hitCellBadgeCls : 'b-search-hit-cell-badge',
            hitTextCls      : 'b-search-hit-text'
        };
    }

    construct(config) {
        super.construct(config);

        const { client } = this;

        Object.assign(this, {
            grid       : client,
            text       : '',
            hitEls     : [],
            treeWalker : client.setupTreeWalker(client.element, DomHelper.NodeFilter.SHOW_TEXT, () => DomHelper.NodeFilter.FILTER_ACCEPT)
        });

        // When new nodes appear due to node expand, include them in the search
        client.ion({
            expandNode : 'onTreeNodeExpand',
            thisObj    : this
        });
    }

    isActionAvailable({ actionName }) {
        if (actions[actionName]) {
            return Boolean(this.text);
        }
    }

    onTreeNodeExpand() {
        if (this.text) {
            this.requestAnimationFrame(this.search, [this.text, false, true, undefined, undefined, false]);
        }
    }

    doDestroy() {
        this.clear(true);
        super.doDestroy();
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

    //region Plugin config

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            after : ['populateCellMenu']
        };
    }

    //endregion

    //region Search

    /**
     * Performs a search and highlights hits.
     * @param {String} text Text to search for
     * @param {Boolean} [gotoHit] Go to first hit after search
     * @param {Boolean} [reapply] Pass true to force search
     * @param {String[]} [fields] An array of the fields to search for the value in
     */
    async search(text, gotoHit = true, reapply = false, fields = null, fromSplit = false, expandToHits = this.client.store.isTree) {
        const me = this;

        // empty search considered a clear
        if (!text) {
            return me.clear();
        }

        // searching for same thing again, do nothing
        if (!reapply && text === me.text || me.disabled) {
            return;
        }

        const
            { grid, store } = me,
            { cellEdit }    = grid.features,
            // Only search columns in use
            columns         = grid.columns.visibleColumns.filter(col => col.searchable !== false),
            formatters      = [];

        if (cellEdit?.enabled && cellEdit.isEditing) {
            cellEdit.cancelEditing();
        }

        fields      = fields || columns.map(col => {
            // For date / number columns
            formatters.push(col.formatValue?.bind(col));
            return col.field;
        });
        const found = store.search(text, fields, formatters);

        if (expandToHits && found.length) {
            await grid.expandTo(found.map(hit => hit.id));
        }

        // Only include first result for merged cells in the count
        for (const column of columns) {
            if (column.mergeCells && column.isSorted) {
                let prevValue = null,
                    belongsTo = null;

                for (const hit of found) {
                    if (hit.field === column.field) {
                        const value = hit.data[hit.field];
                        if (value === prevValue) {
                            hit.belongsTo = belongsTo;
                        }
                        prevValue = value;
                        belongsTo = `${hit.field}-${hit.id}`;
                    }
                }
            }
        }

        let i = 1;

        Object.assign(me, {
            foundMap  : {},
            prevFound : me.found,
            found,
            text,
            findRe    : new RegExp(`(\\s+)?(${StringHelper.escapeRegExp(String(text))})(\\s+)?`, 'ig')
        });

        me.clearHits();

        if (!found) {
            return;
        }

        // highlight hits for visible cells
        for (const hit of found) {
            // merged cells reuse the index of the first hit in the range
            me.foundMap[`${hit.field}-${hit.id}`] = hit.belongsTo ? me.foundMap[hit.belongsTo] : i++;
            // limit hits
            if (i > me.limit) {
                break;
            }
        }

        if (!me.listenersInitialized) {
            grid.rowManager.ion({
                name       : 'renderCell',
                renderCell : 'renderCell',
                thisObj    : me
            });
            store.ion({
                name                                : 'storeRefresh',
                [`refresh${grid.asyncEventSuffix}`] : 'onStoreRefresh',
                thisObj                             : me
            });
            me.listenersInitialized = true;
        }

        grid.refreshRows();

        grid.trigger('search', { grid, find : text, found });

        if (gotoHit && !me.isHitFocused && !fromSplit) {
            await me.gotoNextHit(true);
        }

        grid.syncSplits?.(other => other.features.search.search(text, gotoHit, reapply, fields, true));

        return found;
    }

    clearHits() {
        const me = this;

        if (!me.isDestroying) {
            // Clear old hits
            for (const cellElement of DomHelper.children(me.grid.element, '.' + me.hitCls)) {
                cellElement.classList.remove(me.hitCls, me.hitCellCls);

                // Rerender cell to remove search-hit-text
                const row = DomDataStore.get(cellElement).row;

                // Merged cells have no row, but they will be cleared anyway by their own DomSync call
                if (row) {
                    // Need to force replace the markup
                    row.forceInnerHTML = true;
                    row.renderCell(cellElement);
                    row.forceInnerHTML = false;
                }
            }
        }
    }

    /**
     * Clears search results.
     */
    clear(silent = false) {
        const
            me       = this,
            { grid } = me;

        if (me.foundMap) {
            delete me.foundMap;
        }

        me.text = null;
        me.currentHitIndex = null;

        me.clearHits();

        if (me.listenersInitialized) {
            me.detachListeners('renderCell');
            me.detachListeners('storeRefresh');
            me.listenersInitialized = false;
        }

        if (!silent) {
            grid.trigger('clearSearch', { grid });

            // Propagate to other grids when splitting
            grid.syncSplits?.(other => other.features.search.clear());
        }
    }

    /**
     * Number of results found
     * @member {Number}
     * @readonly
     */
    get foundCount() {
        return this.found?.length ?? 0;
    }

    //endregion

    //region Navigation

    /**
     * Returns true if focused row is a hit
     * @member {Boolean}
     * @readonly
     */
    get isHitFocused() {
        const
            me              = this,
            { grid }        = me,
            { focusedCell } = grid;

        if (focusedCell?.cell?.contains(DomHelper.getActiveElement(grid.element))) {
            const { record, column } = focusedCell;

            return record && column && me.found.some(hit =>
                hit.id === record.id && hit.field === column.field
            );
        }
    }

    /**
     * Resolves the index into the `found` array for the currently focused hit.
     * Prefers the tracked `currentHitIndex` when it still matches the focused cell's record,
     * falling back to a search through the found array by record id and field.
     * @param {Object} fromCell The focused or last focused cell
     * @returns {Number} The index into `found`, or -1 if not resolved
     * @private
     */
    resolveCurrentFoundIndex(fromCell) {
        if (!fromCell) {
            return -1;
        }

        const
            { found, currentHitIndex } = this,
            trackedIndexValid          = currentHitIndex != null && currentHitIndex >= 0 && currentHitIndex < found.length;

        if (fromCell.record) {
            // Prefer tracked index if it still matches the focused cell (handles multi-field hits)
            if (trackedIndexValid && found[currentHitIndex].id === fromCell.record.id) {
                return currentHitIndex;
            }

            return found.findIndex(hit =>
                hit.id === fromCell.record.id && hit.field === fromCell.column?.field
            );
        }

        // If record is undefined (e.g. cell scrolled out of view), use the tracked hit index
        if (trackedIndexValid) {
            return currentHitIndex;
        }

        return -1;
    }

    /**
     * Select the next hit, scrolling it into view. Triggered with <kbd>F3</kbd> or <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>G</kbd>.
     * @async
     */
    async gotoNextHit(fromStart = false) {
        const me = this;

        if (!me.found?.length) {
            return;
        }

        const
            { grid, found } = me,
            fromCell         = fromStart !== true ? grid.focusedCell || grid.lastFocusedCell : null,
            nextHitIndex     = me.resolveCurrentFoundIndex(fromCell) + 1;

        if (nextHitIndex < found.length) {
            await me.gotoHit(nextHitIndex);
        }
    }

    /**
     * Select the previous hit, scrolling it into view. Triggered with <kbd>Shift</kbd> + <kbd>F3</kbd> or <kbd>Shift</kbd> + <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>G</kbd>.
     * @async
     */
    async gotoPrevHit() {
        const me = this;

        if (!me.found?.length) {
            return;
        }

        const
            { grid }     = me,
            fromCell     = grid.focusedCell || grid.lastFocusedCell,
            prevHitIndex = me.resolveCurrentFoundIndex(fromCell) - 1;

        if (prevHitIndex >= 0) {
            await me.gotoHit(prevHitIndex);
        }
    }

    /**
     * Go to specified hit.
     * @param {Number} index
     * @async
     */
    async gotoHit(index) {
        const
            me        = this,
            { grid }  = me,
            { store } = grid,
            hit       = me.found[index];

        if (hit) {
            // Store the current hit index for such cases when a focusedCell can be scrolled out of view
            me.currentHitIndex = index;

            // If the store is grouped and the hit record is in a collapsed group, expand it first
            if (store.isGrouped) {
                const
                    record       = store.getById(hit.id),
                    groupHeader  = record && store.getGroupHeaderForRecord(record),
                    groupFeature = grid.features.group;

                if (groupHeader?.meta.collapsed && groupFeature) {
                    // toggleCollapse is async when grid has transition animations configured
                    await groupFeature.toggleCollapse(groupHeader, false);

                    // Grid could have been destroyed during async expand
                    if (me.isDestroyed) {
                        return false;
                    }
                }
            }

            grid.focusCell({
                field : hit.field,
                id    : hit.id
            });
        }

        return Boolean(hit);
    }

    /**
     * Go to the first hit.
     * @async
     */
    async gotoFirstHit() {
        if (this.found?.length) {
            await this.gotoHit(0);
        }
    }

    /**
     * Go to the last hit.
     * @async
     */
    async gotoLastHit() {
        if (this.found?.length) {
            await this.gotoHit(this.found.length - 1);
        }
    }

    //endregion

    //region Render

    /**
     * Called from SubGrid when a cell is rendered. Highlights search hits.
     * @private
     */
    renderCell({ cellElement, column, record, value }) {
        const
            me       = this,
            {
                treeWalker,
                findRe,
                hitTextCls,
                showHitIndex
            }        = me,
            hitIndex = me.foundMap?.[column.field + '-' + record.id];

        if (hitIndex) {
            // highlight cell
            cellElement.classList.add(me.hitCls);

            // Remove any previous hit badge
            showHitIndex && cellElement.querySelector(`.${me.hitCellBadgeCls}`)?.remove();

            // highlight in cell if found in innerHTML
            const inner = DomHelper.down(cellElement, '.b-grid-cell-value,.b-tree-cell-value') || cellElement;

            if (inner.firstChild.nodeType === Node.TEXT_NODE && String(value).toLowerCase() === String(me.text).toLowerCase()) {
                inner.innerHTML = `<span class="${me.hitTextCls} b-colorize">${inner.innerHTML}</span>${showHitIndex ? `<div class="${me.hitCellBadgeCls}">${hitIndex}</div>` : ''}`;
            }
            // Replace every occurrence of the text in every descendant text node with a span
            // encapsulating the matched string.
            else {
                treeWalker.currentNode = inner;
                for (let textNode = treeWalker.nextNode(); textNode && inner.contains(textNode);) {
                    const
                        nodeToReplace = textNode,
                        textContent   = textNode.nodeValue,
                        newText       = ['<span>'];

                    // Move onto next text node before we replace the node with a highlihght HTML sequence
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

                        newText.push(`${StringHelper.encodeHtml(preamble)}${spaceBefore}<span class="${hitTextCls} b-colorize">${StringHelper.encodeHtml(v)}</span>${spaceAfter}`);
                        offset = findRe.lastIndex;
                    }

                    newText.push(StringHelper.encodeHtml(textContent.substring(offset)), '<span>');

                    // Insert a fragment with each match wrapped with a span.
                    nodeToReplace.parentNode.insertBefore(DomHelper.createElementFromTemplate(newText.join(''), {
                        fragment : true
                    }), nodeToReplace);
                    nodeToReplace.remove();
                }

                if (showHitIndex) {
                    DomHelper.createElement({
                        parent    : cellElement,
                        className : me.hitCellBadgeCls,
                        text      : hitIndex
                    });
                }
            }

            me.hitEls.push(cellElement);
        }
    }

    //endregion

    //region Context menu

    /**
     * Add search menu item to cell context menu.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown
     * @param {Core.data.Model} options.record Record for which the menu will be shown
     * @param {Object<String,MenuItemEntry>} options.items A named object to describe menu items
     * @internal
     */
    populateCellMenu({ column, record, items, cellElement }) {
        const me = this;

        if (column.searchable) {
            items.search = {
                text        : 'L{searchForValue}',
                localeClass : me,
                icon        : 'b-fw-icon b-icon-search',
                separator   : true,
                weight      : 200,
                disabled    : me.disabled,
                onItem      : () => {
                    // <remove-on-release>
                    // TODO: Only extract selection from current cell instead? Lazy way for now
                    // </remove-on-release>
                    let sel = globalThis.getSelection().toString();

                    if (!sel) {
                        sel = cellElement.innerText.trim();
                    }

                    me.search(sel);
                }
            };
        }
    }

    //endregion

    //region Events

    onStoreRefresh() {
        this.search(this.text, false, true);
    }

    //endregion
}

Search.initClass();
