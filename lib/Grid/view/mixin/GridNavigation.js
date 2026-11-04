import Base from '../../../Core/Base.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import GridLocation from '../../util/GridLocation.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import GlobalEvents from '../../../Core/GlobalEvents.js';

/**
 * @module Grid/view/mixin/GridNavigation
 */

const
    defaultFocusOptions = Object.freeze({}),
    interactiveSelector = 'button, input, textarea, a, [contenteditable="true"], select, option',
    containedFocusable = function(e) {
        // When we step outside of the target cell, throw.
        // The TreeWalker silences the exception and terminates the traverse.
        if (!this.focusableFinderCell.contains(e)) {
            return DomHelper.NodeFilter.FILTER_REJECT;
        }
        if (DomHelper.isFocusable(e) && !e.disabled) {
            return DomHelper.NodeFilter.FILTER_ACCEPT;
        }
        return DomHelper.NodeFilter.FILTER_SKIP;
    };

/**
 * Mixin for Grid that handles cell to cell navigation.
 *
 * See {@link Grid.view.Grid} for more information on grid cell keyboard navigation.
 *
 * ## See also
 *
 * - {@link Grid.view.Grid} - The Grid widget
 * - {@link Grid.view.mixin.GridSelection} - Selection mixin
 * - {@link Grid.util.GridLocation} - Cell location reference
 *
 * @mixin
 */
export default Target => class GridNavigation extends (Target || Base) {
    static $name = 'GridNavigation';

    static configurable = {
        focusable : false,

        // Cells, and headers which have a tabIndex are focus targets.
        // If hideHeaders is set, the headers must not have tabIndex set
        focusableSelector : '.b-grid-cell,.b-grid-header.b-depth-0[tabIndex],.b-grid-footer[tabIndex]',

        // Set to `true` to revert focus on Esc or on ArrowUp/ArrowDown above/below first/last row
        isNested : false,

        // Documented on Grid
        // See https://www.w3.org/WAI/ARIA/apg/patterns/grid/ for keyboard navigation standards
        keyMap : {
            ArrowUp    : { handler : 'navigateUp', weight : 10, targetSelector : '.b-grid-panel-body' },
            ArrowRight : { handler : 'navigateRight', weight : 10 },
            ArrowDown  : { handler : 'navigateDown', weight : 10, targetSelector : '.b-grid-panel-body' },
            ArrowLeft  : { handler : 'navigateLeft', weight : 10 },

            'Ctrl+Home' : 'navigateFirstCell',
            Home        : 'navigateFirstColumn',
            'Ctrl+End'  : 'navigateLastCell',
            End         : 'navigateLastColumn',
            PageUp      : 'navigatePrevPage',
            PageDown    : 'navigateNextPage',
            Enter       : 'activateCell',
            F2          : 'toggleCellActivate',

            // Private
            Escape      : { handler : 'deactivateCell', weight : 10 },
            'Shift+Tab' : { handler : 'onShiftTab', preventDefault : false, weight : 200 },
            Tab         : { handler : 'onTab', preventDefault : false, weight : 200 },
            ' '         : { handler : 'onSpace', preventDefault : false }
        },

        // Thresholds used for detecting whether a cell is visible.
        // Used in "focusCell" method.
        // Specified as percent of the grid scroller width/height respectively.
        // For example xxxWidthThreshold=0.5.means if 50% of a huge cell width is visible
        // then no extra horizontal scrolling to the cell is needed
        cellIsVisibleWidthThreshold  : 0.6,
        cellIsVisibleHeightThreshold : 0.6
    };

    onStoreRecordIdChange(event) {
        super.onStoreRecordIdChange?.(event);

        const
            { focusedCell }     = this,
            { oldValue, value } = event;

        // https://github.com/bryntum/bryntum/issues/4935
        if (focusedCell && focusedCell.id === oldValue) {
            focusedCell._id = value;
        }
    }

    /**
     * Called by the RowManager when the row which contains the focus location is derendered.
     *
     * This keeps focus in a consistent place.
     * @protected
     */
    onFocusedRowDerender() {
        const
            me              = this,
            { focusedCell } = me;

        if (focusedCell?.cell && !focusedCell.isColumnHeader) {
            const isActive = DomHelper.isDescendant(focusedCell.cell, DomHelper.getActiveElement(me));

            if (me.hideHeaders) {
                if (isActive) {
                    me.revertFocus();
                }
            }
            else {
                const headerContext = me.normalizeCellContext({
                    rowIndex    : -1,
                    columnIndex : isActive ? focusedCell.columnIndex : 0
                });

                // The row contained focus, focus the corresponding header
                if (isActive) {
                    me.focusCell(headerContext);
                }
                else {
                    headerContext.cell.tabIndex = 0;
                }
            }
            focusedCell.cell.tabIndex = -1;
        }
    }

    navigateFirstCell() {
        this.focusCell(GridLocation.FIRST_CELL);
    }

    navigateFirstColumn() {
        this.focusCell(GridLocation.FIRST_COLUMN);
    }

    navigateLastCell() {
        this.focusCell(GridLocation.LAST_CELL);
    }

    navigateLastColumn() {
        this.focusCell(GridLocation.LAST_COLUMN);
    }

    navigatePrevPage() {
        this.focusCell(GridLocation.PREV_PAGE);
    }

    navigateNextPage() {
        this.focusCell(GridLocation.NEXT_PAGE);
    }

    activateCell(keyEvent) {
        const { focusedCell } = this;

        if (focusedCell) {
            // If we're on a column header, click it.
            if (focusedCell.isColumnHeader) {
                if (keyEvent.target.classList.contains('b-grid-header')) {
                    const { column } = this.focusedCell;

                    column.onKeyDown?.(keyEvent);

                    return this.getHeaderElement(column.id).click();
                }
            }
            // If we're on a cell and it has inner targets, focus the first inner target
            else if (!focusedCell.isActionable && focusedCell.actionTargets?.length) {
                // The newly focused element must not continue to process the Enter key.
                // Jumping into an action column's elements should not trigger the focused action item.
                keyEvent.preventDefault();
                focusedCell.actionTargets[0].focus({
                    focusVisible : true
                });
            }
        }
        return false;
    }

    toggleCellActivate(keyEvent) {
        const { focusedCell } = this;

        if (focusedCell?.actionTargets?.length) {
            // Focues *in* the cell? Focus the cell.
            if (focusedCell.isActionable) {
                this.deactivateCell(keyEvent);
            }
            // Focued on the cell? Focus the first actionable target.
            else {
                focusedCell.actionTargets[0].focus({
                    focusVisible : true
                });
            }
        }
    }

    deactivateCell(keyEvent) {
        const
            me              = this,
            { focusedCell } = me;

        if (!keyEvent.target.closest('.b-dragging') && focusedCell?.isActionable) {
            // The escape must not be processed by handlers for the cell we are about to focus.
            // We need to just push focus upwards to the cell, and stop there.
            keyEvent.stopImmediatePropagation();

            // To prevent the focusCell from being rejected as a no-op
            me._focusedCell = null;

            // Focus the cell with an explicit request to not jump in
            me.focusCell({
                rowIndex : focusedCell.rowIndex,
                column   : focusedCell.column
            }, {
                disableActionable : true
            });
        }
        // If configured as nested, revert focus to outer widget
        // The owner can supply a function to catch the focus. Used in rowExpander.
        else if (me.isNested && me.owner && !me.owner.catchFocus?.({ source : me })) {
            me.revertFocus(true);
        }
    }

    onTab(keyEvent) {
        const
            me              = this,
            { focusedCell } = me;

        // If no focused cell (e.g. hideHeaders with empty store) - let browser handle Tab
        if (focusedCell) {
            const
                { target } = keyEvent,
                {
                    bodyElement
                }          = me,
                {
                    isActionable,
                    actionTargets = []
                }          = focusedCell,
                onLastCell = focusedCell.columnIndex === me.columns.visibleColumns.length - 1 && focusedCell.rowIndex === me.store.count - 1;

            // If we're on the last actionable in a cell, TAB navigates right
            if (!onLastCell && target === actionTargets[actionTargets.length - 1]) {
                keyEvent.preventDefault();
                return me.navigateRight(keyEvent);
            }
            // If we're *on* a cell, or on last subtarget, TAB moves off the grid.
            // Make entire grid body inert so that default TAB processing exits the grid body.
            else if (!isActionable || target === actionTargets[actionTargets.length - 1]) {
                bodyElement.setAttribute('inert', true);
                me.requestAnimationFrame(() => bodyElement.removeAttribute('inert'));
            }
        }
        // So that Navigator#onKeyDown does not continue to preventDefault;
        return false;
    }

    onShiftTab(keyEvent) {
        const
            me              = this,
            { focusedCell } = me;

        // If no focused cell (e.g. hideHeaders with empty store) - let browser handle Tab
        if (focusedCell) {
            const
                { target }  = keyEvent,
                {
                    bodyElement
                }           = me,
                {
                    isActionable,
                    actionTargets
                }           = focusedCell,
                onFirstCell = focusedCell.columnIndex === 0 && focusedCell.rowIndex === (me.hideHeaders ? 0 : -1);

            // If we're on the first actionable in a cell that is not the first cell, SHIFT+TAB navigates left
            if (!onFirstCell && target === actionTargets[0]) {
                keyEvent.preventDefault();
                return me.navigateLeft(keyEvent);
            }

            // If we're *on* a cell, or on first subtarget, SHIFT+TAB moves off the grid.
            // Make entire grid body inert so that default shift+TAB processing exits the grid body.
            else if (!isActionable || target === actionTargets[0]) {
                bodyElement.setAttribute('inert', true);
                this.requestAnimationFrame(() => bodyElement.removeAttribute('inert'));
            }
        }
        // So that Navigator#onKeyDown does not continue to preventDefault;
        return false;
    }

    onSpace(keyEvent) {
        const { focusedCell } = this;

        // SPACE scrolls, so disable that
        if (focusedCell && !focusedCell.isActionable) {
            keyEvent.preventDefault();
        }
        // Return false to tell keyMap that any other actions should be called
        return false;
    }

    //region Cell

    /**
     * Triggered when a user navigates to a grid cell
     * @event navigate
     * @param {Event} [event] The UI event which caused navigation.
     * @param {String} eventName The name of the event
     * @param {Grid.util.GridLocation} focusedCell The currently focused cell
     * @param {Grid.util.GridLocation} lastFocusedCell The previously focused cell
     * @param {Grid.view.Grid} source The grid instance
     * @param {String} type The type of the event
     */

    /**
     * Grid `GridLocation` which encapsulates the currently focused cell.
     * Set to focus a cell or use {@link #function-focusCell}.
     * @member {Grid.util.GridLocation}
     */
    get focusedCell() {
        return this._focusedCell;
    }

    /**
     * This property is `true` if an element _within_ a cell is focused.
     * @member {Boolean}
     * @readonly
     */
    get isActionableLocation() {
        return this._focusedCell?.isActionable;
    }

    set focusedCell(cellSelector) {
        this.focusCell(cellSelector);
    }

    get focusedRecord() {
        return this._focusedCell?.record;
    }

    /**
     * CSS selector for currently focused cell. Format is "[data-index=index] [data-column-id=columnId]".
     * @member {String}
     * @readonly
     */
    get cellCSSSelector() {
        const cell = this._focusedCell;

        return cell ? `[data-index=${cell.rowIndex}] [data-column-id=${cell.columnId}]` : '';
    }

    afterHide(...args) {
        super.afterHide(...args);

        // Do not scroll back to the last focused cell/last moused over cell upon reshow
        this.lastFocusedCell = null;
    }

    /**
     * Checks whether a cell is focused.
     * @param {GridLocationConfig|Grid.util.GridLocation|String|Number} cellSelector Cell selector { id: x, columnId: xx } or row id
     * @returns {Boolean} true if cell or row is focused, otherwise false
     */
    isFocused(cellSelector) {
        return Boolean(this._focusedCell?.equals(this.normalizeCellContext(cellSelector)));
    }

    get focusElement() {
        if (!this.isDestroying) {
            let focusCell;

            // If the store is not empty, focusedCell can return the closest cell
            if (this.store.count && this._focusedCell) {
                focusCell = this._focusedCell.target;
            }
            // If the store is empty, or we have had no focusedCell set, focus a column header.
            else if (!this.hideHeaders) {
                focusCell = this.normalizeCellContext({
                    rowIndex    : -1,
                    columnIndex : this._focusedCell?.columnIndex || 0
                }).target;
            }

            const superFocusEl = super.focusElement;

            // If there's no cell, or the Container's focus element is before the cell
            // use the Container's focus element.
            // For example, we may have a top toolbar.
            if (superFocusEl && (!focusCell || focusCell.compareDocumentPosition(superFocusEl) === Node.DOCUMENT_POSITION_PRECEDING)) {
                return superFocusEl;
            }

            return focusCell;
        }
        // NOSONAR: returning undefined is intentional here
    }

    afterInternalPaint({ firstPaint }) {
        const me = this;

        super.afterInternalPaint?.(...arguments);

        // Make the grid initally tabbable into.
        // The first cell has to have the initial roving tabIndex set into it.
        const defaultFocus = this.normalizeCellContext({
            rowIndex : me.hideHeaders ? 0 : -1,
            column   : me.hideHeaders ? 0 : me.columns.find(col => col.shown && col.isFocusable)
        });

        if (defaultFocus.cell?.getAttribute('tabIndex')) {
            defaultFocus._isDefaultFocus = true;

            me._focusedCell = defaultFocus;

            const { target } = defaultFocus;

            // If cell doesn't contain a focusable target, it needs tabIndex 0.
            if (target === defaultFocus.cell) {
                defaultFocus.cell.tabIndex = 0;
            }
        }
    }

    /**
     * This function handles focus moving into, or within the grid.
     * @param {Event} focusEvent
     * @private
     */
    onGridBodyFocusIn(focusEvent) {
        const
            me              = this,
            { bodyElement } = me,
            lastFocusedCell = me.focusedCell,
            lastTarget      = lastFocusedCell?.initialTarget || lastFocusedCell?.target,
            {
                relatedTarget
            }               = focusEvent,
            // Handle custom elements containing focus
            target          = focusEvent.browserEvent.target,
            targetCell      = target.closest(me.focusableSelector),
            targetRow       = target.closest('.b-grid-row'),
            focusVisible    = target.matches(':focus-visible');

        // If the last focus point is now inaccessible, default to the first cell on the same row.
        if (!targetCell && lastFocusedCell && !DomHelper.isFocusable(lastTarget)) {
            me._focusedCell = null;
            return me.focusCell({ row : lastFocusedCell.rowIndex, column : 0 });
        }

        // If focus moved into a valid cell...
        // Only allows mouse left och right clicks (no other mouse buttons)
        if (targetCell &&
            (!GlobalEvents.currentMouseDown || GlobalEvents.isMouseDown(0) || GlobalEvents.isMouseDown(2))
        ) {
            const
                cellSelector  = new GridLocation(target),
                { cell }      = cellSelector,
                lastCell      = lastFocusedCell?.cell,
                actionTargets = cellSelector.actionTargets = me.findFocusables(targetCell),
                // Don't select when focusing an interactive element (input, buttons etc.) for a contained
                // actionable location
                doSelect      = (!me._fromFocusCell || me.selectOnFocus) && (target === cell || !targetCell.contains(target.closest(interactiveSelector)) || me._selectActionCell) && !target?._isRevertingFocus;

            // Asked for a row that no longer exists, location resolved to header but focus is not there.
            // Resolve by moving focus
            if (targetRow && cellSelector.rowIndex === -1) {
                cell.focus({
                    preventScroll : true,
                    focusVisible
                });
                return;
            }

            if (target.matches(me.focusableSelector)) {
                if (me.disableActionable) {
                    cellSelector._target = cell;
                }
                // Focus first focusable target if we are configured to.
                else if (actionTargets.length) {
                    const currentMouseDownTarget = GlobalEvents.currentMouseDown?.target;

                    if (!actionTargets.some(el => el.contains(currentMouseDownTarget))) {
                        me.onCellNavigate?.(me, lastFocusedCell, cellSelector, doSelect);
                        me.trigger('navigate', { lastFocusedCell, focusedCell : cellSelector, event : focusEvent });
                    }
                    else {
                        me._selectActionCell = currentMouseDownTarget === target;
                    }
                    actionTargets[0].focus({
                        focusVisible
                    });
                    delete me._selectActionCell;

                    return;
                }
            }
            else {
                // If we have tabbed in and *NOT* mousedowned in, and hit a tabbable element which was not our
                // last focused cell, go back to last focused cell.
                if (DomHelper.isFocusable(lastTarget) &&
                    relatedTarget &&
                    !GlobalEvents.isMouseDown() &&
                    !bodyElement.contains(relatedTarget) &&
                    !cellSelector.equals(lastFocusedCell)
                ) {
                    lastTarget.focus({
                        focusVisible
                    });
                    return;
                }
                cellSelector._target = target;
            }

            if (lastCell) {
                lastCell.classList.remove('b-focused');
                lastCell.tabIndex = -1;
            }
            if (cell) {
                cell.classList.add('b-focused');

                // Column may update DOM on cell focus for A11Y purposes.
                cellSelector.column.onCellFocus(cellSelector);

                // Only switch the cell to be tabbable if focus was not directed to an inner focusable.
                if (cell === target) {
                    cell.tabIndex = 0;
                }

                // Moving back to a cell from a cell-contained Editor
                if (cell.contains(focusEvent.relatedTarget)) {
                    if (lastTarget === target) {
                        return;
                    }
                }
            }

            //Remember
            me._focusedCell = cellSelector;

            me.onCellNavigate?.(me, lastFocusedCell, cellSelector, doSelect);

            me.trigger('navigate', { lastFocusedCell, focusedCell : cellSelector, event : focusEvent });

        }
        // Focus not moved into a valid cell, refocus last cell's target
        // if there was a previously focused cell.
        // Allow text selection inside a row expander body
        else if (!target.closest('.b-row-expander-body')) {
            lastTarget?.focus({
                preventScroll : true,
                focusVisible
            });
        }
    }

    findFocusables(cell) {
        const
            { focusableFinder } = this,
            result              = [];

        focusableFinder.currentNode = this.focusableFinderCell = cell;

        for (let focusable = focusableFinder.nextNode(); focusable; focusable = focusableFinder.nextNode()) {
            result.push(focusable);
        }
        return result;
    }

    get focusableFinder() {
        const me = this;

        if (!me._focusableFinder) {
            me._focusableFinder = me.setupTreeWalker(me.bodyElement, DomHelper.NodeFilter.SHOW_ELEMENT, {
                acceptNode : containedFocusable.bind(me)
            });
        }

        return me._focusableFinder;
    }

    /**
     * Sets the passed record as the current focused ("active") record for keyboard navigation purposes.
     * This API is used by Combo to activate items in its picker. It only moves focus; selection is not
     * altered, since a picker's selection is driven by its shared `selectedRecordCollection`.
     * @param {Core.data.Model|Number|String} activeItem The record, or record index, or record id to highlight as the active ("focused") item.
     * @internal
     */
    restoreActiveItem(item = this._focusedCell) {
        if (this.rowManager.count) {
            // They sent a row number.
            if (!isNaN(item)) {
                item = this.store.getAt(item);
            }
            // Still not a record, treat it as a record ID.
            else if (!item.isModel) {
                item = this.store.getById(item);
            }
            // Activate for navigation only; must not select, or an empty multiSelect picker would
            // pre-select the fallback row 0 and the user's first click would then toggle it off.
            return this.focusCell(item, { doSelect : false });
        }
    }

    /**
     * Navigates to a cell and/or its row (depending on selectionMode)
     * @param {GridLocationConfig|Grid.util.GridLocation} cellSelector Cell location descriptor
     * @param {Object} options Modifier options for how to deal with focusing the cell. These
     * are used as the {@link Core.helper.util.Scroller#function-scrollTo} options.
     * @param {BryntumScrollOptions|Boolean} [options.scroll=true] Pass `false` to not scroll the cell into view, or a
     * scroll options object to affect the scroll.
     * @returns {Grid.util.GridLocation} A `GridLocation` object representing the focused location.
     * @fires navigate
     */
    focusCell(cellSelector, options = defaultFocusOptions) {
        const
            me               = this,
            { _focusedCell } = me,
            {
                scroll,
                disableActionable
            }                = options,
            isDown           = cellSelector === GridLocation.DOWN,
            isUp             = cellSelector === GridLocation.UP,
            isLeftRightKey   = cellSelector === GridLocation.PREV_CELL || cellSelector === GridLocation.NEXT_CELL,
            { cellEdit }     = me.features;

        // If we're being asked to go to a nonexistent header row, revert focus outwards
        if (cellSelector?.rowIndex === -1 && me.hideHeaders) {
            me.revertFocus();
            return;
        }

        // Handle arrow key (relative movement) but no focused cell
        if (typeof cellSelector === 'number' && !_focusedCell?.isLocation) {
            return;
        }

        // Get a Grid GridLocation.
        // If the cellSelector is a number, it is taken to be a "relative" location as defined
        // in the GridLocation class eg GridLocation.UP, and we move the current focus accordingly.
        cellSelector = typeof cellSelector === 'number' && _focusedCell?.isLocation ? _focusedCell.move(cellSelector) : me.normalizeCellContext(cellSelector);

        const doSelect = ('doSelect' in options) ? options.doSelect
            : (!cellSelector.isActionable || cellSelector.initialTarget === cellSelector.cell);

        if (cellSelector.equals(_focusedCell)) {

            // If configured as nested, revert focus outside if navigating by keyboard below last row or above headers
            if (me.isNested && (isDown || isUp)) {
                // The owner can supply a function to catch the focus. Used in rowExpander.
                if (!me.owner?.catchFocus?.({ source : me, navigationDirection : isDown ? 'down' : 'up' })) {
                    me.revertFocus(true);
                }
            }
            else {
                // Request is a no-op, but it's still a navigate request which selection processing needs to know about
                me.onCellNavigate?.(me, _focusedCell, cellSelector, doSelect);
            }
            return _focusedCell;
        }

        // We can now navigate from focusable to focusable while the CellEdit feature is activated.
        // If we are asked to focus a cell while CellEdit is active, we start editing the cell if possible.
        if (cellEdit?.isEditing && !cellSelector.equals(cellEdit.editorContext) && cellEdit.getEditingContext(cellSelector)) {
            cellEdit.startEditing(cellSelector);
            return cellSelector;
        }

        const
            subGrid     = me.getSubGridFromColumn(cellSelector.columnId),
            { cell }    = cellSelector,
            testCell    = cell || me.getCell({
                rowIndex : me.rowManager.topIndex,
                columnId : cellSelector.columnId
            }),
            subGridRect = Rectangle.from(subGrid.element),
            bodyRect    = Rectangle.from(me.bodyElement),
            // The cell might not exist when virtualizing columns and the column is out of view. Scrolling below
            // handles that case without measuring the cell
            cellRect    = testCell && Rectangle.from(testCell).moveTo(null, subGridRect.y);

        if (scroll !== false) {
            // Scroll only horizontally if we're moving to a column header by arrow keypress
            if (cellSelector.rowIndex === -1) {
                if (isLeftRightKey) {
                    me.scrollColumnIntoView(cellSelector.column);
                }
            }
            else {
                options = {
                    ...options,
                    ...scroll
                };

                if (cellRect) {
                    const
                        {
                            cellIsVisibleWidthThreshold,
                            cellIsVisibleHeightThreshold
                        }                = me,
                        minCellWidth     = cellIsVisibleWidthThreshold * subGridRect.width,
                        minCellHeight    = cellIsVisibleHeightThreshold * bodyRect.height,
                        viewIntersection = subGridRect.intersect(cellRect),
                        yIntersection    = Math.min(bodyRect.bottom, cellRect.bottom) -
                            Math.max(bodyRect.y, cellRect.y);

                    // If the test cell is larger than the subGrid
                    if (cellRect.width > subGridRect.width || cellRect.height > bodyRect.height) {
                        // if the cell is wider than the grid but is visible enough horizontally
                        if (cellRect.width > subGridRect.width && viewIntersection.width >= minCellWidth) {
                            // disable horizontal scrolling
                            options.x = false;
                        }
                        // If the cell is higher than the subGrid but is visible enough vertically
                        if (cellRect.height > bodyRect.height && yIntersection >= minCellHeight) {
                            // disable vertical scrolling
                            options.y = false;
                        }
                    }
                }

                // ask for the column to be scrolled into view
                options.column = cellSelector.columnId;

                if (cellSelector.id != null) {
                    me.scrollRowIntoView(cellSelector.id, options);
                }
                else {
                    me.scrollUnloadedRowIntoView(cellSelector.rowIndex, options);
                }
            }
        }

        // When virtualizing columns, cells for a column scrolled into view are added when the scroll event fires,
        // which is too late for the focus call below. Sync intersections now to materialize the cell
        if (me.virtualizeColumns && !cellSelector.cell) {
            subGrid.header.syncIntersections();
        }

        // Clear hovering upon navigating so to not have hover style stick around when keyboard navigating away
        if (me._hoveredRow || me.hoveredCell) {
            me.hoveredCell = null;
        }

        // Disable auto stepping into the focused cell.
        me.disableActionable = disableActionable;

        // Go through select pathway upon focus
        me.selectOnFocus = doSelect;

        // To let onGridBodyFocusIn know where the focus originates
        me._fromFocusCell = true;

        // Focus the location's target, be it a cell, or an interior element.
        // The onFocusIn element in this module responds to this.
        cellSelector[disableActionable ? 'cell' : 'target']?.focus({
            preventScroll : true
        });

        me.disableActionable = me.selectOnFocus = false;
        delete me._fromFocusCell;

        if (!me._focusedCell) {
            me._focusedCell = cellSelector;
        }

        return cellSelector;
    }

    /**
     * Scrolls a row whose record is not yet lazy loaded into view. It has no record to scroll to, so it is located by
     * index. The row is rendered synchronously so that its placeholder cell can be focused.
     * @param {Number} rowIndex
     * @param {GridScrollOptions} options Scroll options, `column` is the column to scroll into view
     * @private
     */
    scrollUnloadedRowIntoView(rowIndex, options) {
        const
            me                         = this,
            { rowManager, scrollable } = me;

        let row = rowManager.getRow(rowIndex);

        // Not rendered, scroll to its estimated position and render the rows there
        if (!row) {
            const estimatedRect = rowManager.getRecordCoordsByIndex(rowIndex);

            scrollable.scrollIntoView(estimatedRect, { block : 'center' });
            // With variable row heights, a long jump might otherwise render a block that misses the estimated row
            rowManager.scrollTargetIndex = rowIndex;
            rowManager.updateRenderedRows(scrollable.y, true);
            row = rowManager.getRow(rowIndex);

            // Centered above, so for nearest scroll it to the edge it came in from, as scrollRowIntoView does
            if ((options.block || 'nearest') === 'nearest') {
                options = { ...options, block : estimatedRect.block };
            }
        }

        const cell = row?.getCell(options.column);

        if (cell) {
            me.getSubGridFromColumn(options.column).scrollable.scrollIntoView(cell, options);
        }
    }

    blurCell(cellSelector) {
        const
            me   = this,
            cell = me.getCell(cellSelector);

        if (cell) {
            cell.classList.remove('b-focused');
        }
    }

    clearFocus(fullClear) {
        const me = this;

        if (me._focusedCell) {
            // set last to have focus return to previous cell when alt tabbing
            me.lastFocusedCell = fullClear ? null : me._focusedCell;

            me.blurCell(me._focusedCell);
            me._focusedCell = null;
        }
    }

    // For override-ability
    catchFocus() {}

    /**
     * Selects the cell before or after currently focused cell.
     * @private
     * @param {Boolean} next Specify true to select the next cell, false to select the previous
     * @returns {Object} Used cell selector
     */
    internalNextPrevCell(next = true) {
        const
            me           = this,
            cellSelector = me._focusedCell;

        if (cellSelector) {
            return me.focusCell({
                id       : cellSelector.id,
                columnId : me.columns.getAdjacentVisibleLeafColumn(cellSelector.column, next, true).id
            });
        }
        return null;
    }

    /**
     * Select the cell after the currently focused one.
     * @returns {Grid.util.GridLocation} Cell selector
     */
    navigateRight() {
        if (arguments[0]?.fromKeyMap) {
            return this.focusCell(this.rtl ? GridLocation.PREV_CELL : GridLocation.NEXT_CELL);
        }
        return this.internalNextPrevCell(!this.rtl);
    }

    /**
     * Select the cell before the currently focused one.
     * @returns {Grid.util.GridLocation} Cell selector
     */
    navigateLeft() {
        if (arguments[0]?.fromKeyMap) {
            return this.focusCell(this.rtl ? GridLocation.NEXT_CELL : GridLocation.PREV_CELL);
        }
        return this.internalNextPrevCell(Boolean(this.rtl));
    }

    //endregion

    //region Row

    /**
     * Selects the next or previous record in relation to the current selection. Scrolls into view if outside.
     * @private
     * @param {Boolean} next Next record (true) or previous (false)
     * @param {Boolean} [skipSpecialRows=true] True to not return specialRows like headers
     * @param {Boolean} [moveToHeader=true] True to allow focus to move to a header
     * @returns {Grid.util.GridLocation|Boolean} Selection context for the focused row (& cell) or false if no selection was made
     */
    internalNextPrevRow(next, skipSpecialRows = true, moveToHeader = true) {
        const
            me   = this,
            cell = me._focusedCell;

        if (!cell) return false;

        const record = me.store[`get${next ? 'Next' : 'Prev'}`](cell.id, false, skipSpecialRows);

        if (record) {
            return me.focusCell({
                id       : record.id,
                columnId : cell.columnId,
                scroll   : {
                    x : false
                }
            });
        }
        else if (!next && moveToHeader && !cell.isColumnHeader) {
            this.clearFocus();
            this.getHeaderElement(cell.columnId).focus();
        }

        return false;
    }

    /**
     * Navigates to the cell below the currently focused cell
     * @returns {Grid.util.GridLocation} Selector for focused row (& cell)
     */
    navigateDown() {
        if (arguments[0]?.fromKeyMap) {
            return this.focusCell(GridLocation.DOWN);
        }
        return this.internalNextPrevRow(true, false);
    }

    /**
     * Navigates to the cell above the currently focused cell
     * @returns {Grid.util.GridLocation} Selector for focused row (& cell)
     */
    navigateUp() {
        if (arguments[0]?.fromKeyMap) {
            return this.focusCell(GridLocation.UP);
        }
        return this.internalNextPrevRow(false, false);
    }

    //endregion

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
