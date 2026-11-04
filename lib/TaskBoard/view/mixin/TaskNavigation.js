import Base from '../../../Core/Base.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import DomSync from '../../../Core/helper/DomSync.js';
import EventHelper from '../../../Core/helper/EventHelper.js';

/**
 * @module TaskBoard/view/mixin/TaskNavigation
 */

const
    navigationActions          = ['navigateDown', 'navigateLeft', 'navigateUp', 'navigateRight', 'activate'],
    // The composite's way in and out of card items, also available from an editable item
    cardItemActions            = ['nextCardItem', 'previousCardItem', 'deactivateCard'],
    cardSelector               = '.b-task-board-card',
    columnHeaderSelector       = '.b-task-board-column-header',
    columnExpanderSelector     = '.b-task-board-column-expander',
    laneExpanderSelector       = '.b-task-board-swimlane-expander',
    fieldSelector              = '.b-field',
    tabStopSelector            = `${cardSelector},${laneExpanderSelector}`,
    isVisiblyFocusable         = element => DomHelper.getFocusability(element, true).focusable,
    focusableContentFilter     = {
        acceptNode : element => DomHelper.isFocusable(element) && !element.disabled
            ? DomHelper.NodeFilter.FILTER_ACCEPT
            : DomHelper.NodeFilter.FILTER_SKIP
    },
    headerContentFilter        = {
        acceptNode : element => element.matches(fieldSelector)
            ? DomHelper.NodeFilter.FILTER_REJECT
            : focusableContentFilter.acceptNode(element)
    };

/**
 * Mixin that handles keyboard navigation for the TaskBoard.
 *
 * The board body is a single composite widget: it holds one Tab stop which roves with focus, and the arrow keys move
 * between the cards, the column header controls and the swimlane expanders. Features which render their own focusable
 * elements into the board join the composite by overriding the client's navigation methods, see
 * {@link TaskBoard.feature.ColumnToolbars}.
 *
 * See {@link TaskBoard.view.TaskBoard#keyboard-shortcuts} for information on keyboard navigation.
 *
 * @mixin
 */
export default Target => class TaskNavigation extends (Target || Base) {

    //region Config

    static $name = 'TaskNavigation';

    static configurable = {
        // Documented on TaskBoard
        keyMap : {
            ArrowDown   : 'navigateDown',
            ArrowLeft   : 'navigateLeft',
            ArrowUp     : 'navigateUp',
            ArrowRight  : 'navigateRight',
            Enter       : 'activate',
            F2          : 'activateCard',
            Escape      : 'deactivateCard',
            // preventDefault only when moving between card items
            Tab         : { handler : 'nextCardItem', preventDefault : false },
            'Shift+Tab' : { handler : 'previousCardItem', preventDefault : false }
        },

        navigateable : true,

        /**
         * Configure with `true` to change the default behaviour of keyboard navigation from moving focus to selecting
         * tasks:
         *
         * ```javascript
         * const taskBoard = new TaskBoard({
         *     selectOnNavigation : true
         * });
         * ```
         *
         * @config {Boolean|String}
         * @default
         * @category Selection
         */
        selectOnNavigation : false
    };

    get widgetClass() {}

    //endregion

    //region Utility

    getTaskNear(x, y) {
        const gap = DomHelper.measureSize(
            this.css.cardGap || '1em',
            this.bodyElement.querySelector('.b-task-board-swimlane-body .b-task-board-column')
        );

        const { documentRoot } = this;

        let task = DomHelper.elementFromPoint(x, y, documentRoot)?.closest('.b-task-board-card');

        // Nothing there, might have hit a gap, look up
        if (!task) {
            task = DomHelper.elementFromPoint(x, y - gap, documentRoot)?.closest('.b-task-board-card');
        }

        // Still nothing, look down
        if (!task) {
            task = DomHelper.elementFromPoint(x, y + gap, documentRoot)?.closest('.b-task-board-card');
        }

        return task;
    }

    //endregion

    //region Roving tabIndex

    /**
     * The element which currently holds the single Tab stop in the roving tabIndex composite.
     * @member {HTMLElement} tabStopElement
     * @private
     * @category Navigation
     */
    get tabStopElement() {
        return this._tabStopElement;
    }

    set tabStopElement(element) {
        const
            me      = this,
            current = me._tabStopElement;

        if (current !== element) {
            current && (current.tabIndex = -1);
            me._tabStopElement = element;
        }

        element && (element.tabIndex = 0);
    }

    // Focusable by script and pointer, but not a Tab stop. Tab enters on the body's roving stop
    compose(domConfig) {
        domConfig.tabIndex = -1;
    }

    // Programmatic focus and focus reversion land on the roving stop. Disabled skips it, Widget writes disabled to it
    get focusElement() {
        const
            me      = this,
            tabStop = me._tabStopElement;

        if (!me.disabled && tabStop && me._bodyElement?.contains(tabStop) && isVisiblyFocusable(tabStop)) {
            return tabStop;
        }

        return super.focusElement || me._element;
    }

    afterRecompose() {
        const me = this;

        super.afterRecompose();

        // _bodyElement, the getter would flush the recompose we are in
        if (me._bodyElement) {
            me.attachTabStopListeners();
            me.syncTabStop();
        }
    }

    afterInternalPaint(...args) {
        super.afterInternalPaint?.(...args);

        // A hidden board defers the Tab stop to paint
        this._bodyElement && this.syncTabStop();
    }

    doDestroy() {
        this.tabStopDetacher?.();

        super.doDestroy();
    }

    // Re-attaches if the panel re-renders its body element
    attachTabStopListeners() {
        const
            me               = this,
            { _bodyElement } = me;

        if (me.tabStopListenerElement !== _bodyElement) {
            me.tabStopDetacher?.();
            me.tabStopListenerElement = _bodyElement;

            me.tabStopDetacher = EventHelper.on({
                element : _bodyElement,
                focusin : 'onBodyFocusIn',
                // Hardening against tabIndex rewrites by focus gestures (eg Siesta's focus simulation)
                click   : 'syncTabStop',
                thisObj : me
            });
        }
    }

    // DomSync re-applies the rendered tabIndex -1 and recycles elements, so re-assert after each compose
    syncTabStop() {
        const
            me      = this,
            element = me._tabStopElement;

        // Hidden reads as unfocusable; _element, the getter would flush a pending recompose
        if (!DomHelper.isVisible(me._element)) {
            return;
        }

        if (me.hasRovingMemory && element && me._bodyElement.contains(element) && isVisiblyFocusable(element)) {
            element.tabIndex = 0;
        }
        else {
            // No stop chosen by focus, or it was lost: track the default (the first card once one renders) until focus
            // re-enters the body
            me.hasRovingMemory = false;
            me.tabStopElement  = me.getDefaultTabStopElement() ?? element;
        }
    }

    getDefaultTabStopElement() {
        const me = this;

        return me.findFocusable(me._bodyElement.querySelectorAll(cardSelector)) ??
            me.findFocusable(me.getTabStopCandidates());
    }

    getTabStopCandidates() {
        const
            me         = this,
            candidates = [];

        for (const element of me._bodyElement.querySelectorAll(`${tabStopSelector},${columnHeaderSelector}`)) {
            if (element.matches(columnHeaderSelector)) {
                candidates.push(...me.getHeaderFocusables(element));
            }
            else {
                candidates.push(element);
            }
        }

        return candidates;
    }

    findFocusable(elements) {
        for (const element of elements) {
            if (isVisiblyFocusable(element)) {
                return element;
            }
        }

        return null;
    }

    resolveTabStop(element) {
        const inHeader = element.closest(columnHeaderSelector) && !element.closest(fieldSelector);

        return element.closest(tabStopSelector) ?? (inHeader ? element : null);
    }

    onBodyFocusIn({ target }) {
        const
            me      = this,
            element = me.resolveTabStop(target);

        // Focus inside a card gives the stop to the card, never to the item
        if (element) {
            const columnRecord = me.resolveColumnRecord(element);

            // Remember which column the focus came from
            if (columnRecord) {
                me.navigationColumnId = columnRecord.id;
            }

            me.hasRovingMemory = true;
            me.tabStopElement  = element;
        }
    }

    //endregion

    //region Navigation chains

    // Returns the column in which the control currently exists. If the control is for example a swimlane
    // expander, it will return the last remembered column if its visible otherwise the first visible column.
    getNavigationColumn(element) {
        const
            me               = this,
            rememberedColumn = me.columns.getById(me.navigationColumnId),
            columnRecord     = me.resolveColumnRecord(element);

        return columnRecord ?? ((!rememberedColumn?.hidden && rememberedColumn) ||
            me.getColumns().find(columnRecord => !columnRecord.hidden));
    }

    getColumnHeaderTabStops(columnRecord) {
        const headerElement = this.getColumnHeaderElement(columnRecord);

        return headerElement ? this.getHeaderFocusables(headerElement) : [];
    }

    findContainedFocusables(root, filter = focusableContentFilter) {
        const
            walker     = this.setupTreeWalker(root, DomHelper.NodeFilter.SHOW_ELEMENT, filter),
            focusables = [];

        while (walker.nextNode()) {
            focusables.push(walker.currentNode);
        }

        return focusables;
    }

    // Open set, features render their own buttons into the headers
    getHeaderFocusables(headerElement) {
        return this.findContainedFocusables(headerElement, headerContentFilter);
    }

    sortByRenderedPosition(elements) {
        const
            direction = this.rtl ? -1 : 1,
            positions = new Map(elements.map(element => [element, element.getBoundingClientRect().x]));

        return elements.sort((a, b) => direction * (positions.get(a) - positions.get(b)));
    }

    getHeaderNavigationChain() {
        const
            me             = this,
            chain          = [],
            headerElements = DomSync.getChild(me.bodyElement, 'header')?.querySelectorAll(columnHeaderSelector) ?? [];

        for (const headerElement of headerElements) {
            // Hidden controls measure 0, the walker has already dropped them
            chain.push(...me.sortByRenderedPosition(me.getHeaderFocusables(headerElement)));
        }

        return chain;
    }

    getCardFocusables(cardElement) {
        const
            focusables  = this.findContainedFocusables(cardElement),
            isInnermost = element => !focusables.some(other => other !== element && element.contains(other));

        // Wrappers around other focusables yield to their content
        return focusables.filter(isInnermost);
    }

    getColumnNavigationChain(element) {
        const
            me           = this,
            columnRecord = me.getNavigationColumn(element);

        // Every column hidden
        if (!columnRecord) {
            return [];
        }

        let columns = [columnRecord];



        return columns.flatMap(column => me.getSingleColumnNavigationChain(column, element));
    }

    getSingleColumnNavigationChain(columnRecord, element) {
        const
            me           = this,
            headerChain  = me.getColumnHeaderTabStops(columnRecord),
            headerAnchor = headerChain.includes(element)
                ? element
                : headerChain.find(control => control.matches(columnExpanderSelector)) ?? headerChain[0],
            chain        = headerAnchor ? [headerAnchor] : [];

        // Iterate through the swimlane and build the vertical chain of the focusable elements
        // i.e. swimlane expander -> column cell content
        for (const swimlaneRecord of me.hasSwimlanes && !me.isIgnoringSwimlanes ? me.swimlanes : [null]) {
            if (swimlaneRecord?.hidden) {
                continue;
            }

            const
                expander    = swimlaneRecord && me.getSwimlaneElement(swimlaneRecord)?.querySelector(laneExpanderSelector),
                cellElement = me.getSwimlaneColumnElement(swimlaneRecord, columnRecord);

            expander && chain.push(expander);

            cellElement && chain.push(...me.getColumnCellNavigationChain(cellElement));
        }

        return chain;
    }

    getColumnCellNavigationChain(cellElement) {
        return [...cellElement.querySelectorAll(cardSelector)];
    }

    // The horizontal chain for an element. Features override this to supply the chain for their own elements
    getRowNavigationChain(element) {
        // Get all the header items in order of their visibility
        if (element.closest(columnHeaderSelector)) {
            return this.getHeaderNavigationChain();
        }

        // Swimlane expanders span the full width
        return [element];
    }

    // Wraps, keeping focus inside the board
    findInChain(chain, element, step) {
        const
            { length } = chain,
            start      = chain.indexOf(element);

        if (start === -1) {
            return null;
        }

        for (let i = 1; i <= length; i++) {
            const
                index     = (start + i * step) % length,
                candidate = chain[index < 0 ? index + length : index];

            if (isVisiblyFocusable(candidate)) {
                return candidate;
            }
        }

        return null;
    }

    //endregion

    //region Navigation

    focusAndOptionallySelect(taskElement, forceSelect) {
        if (taskElement) {
            const
                me = this,
                // getRootNode() is required for compatibility with LockerService
                // added as a fix for https://github.com/bryntum/bryntum/issues/10598
                currentlyFocusedTask = me.resolveTaskRecord(document.getRootNode().activeElement);

            // If a task is focused but not selected and we navigate away from it holding SPACE we want that task to
            // become selected in addition to the newly focused task
            if (forceSelect && currentlyFocusedTask && !me.isSelected(currentlyFocusedTask)) {
                me.selectTask(currentlyFocusedTask, true);
            }

            // When configured with `selectOnNavigation : true` we should move the selection. If user holds SHIFT we
            // should always extend it
            if (me.selectOnNavigation || forceSelect) {
                const taskToFocus = me.resolveTaskRecord(taskElement);
                // Newly focused task is not selected, always select it (optionally extending the selection)
                if (!me.isSelected(taskToFocus)) {
                    me.selectTask(taskToFocus, forceSelect);
                }
                // Newly focused task already selected, deselect current if SHIFT is pressed (to allow extending and
                // shrinking selection holding SHIFT)
                else if (forceSelect) {
                    me.deselectTask(currentlyFocusedTask);
                }
            }

            // Always move focus
            taskElement.focus();
        }
    }

    /**
     * Shared implementation behind `navigateNext` and `navigatePrev`. Walks the rendered column order, which
     * features may order differently from the store.
     * @param {Event} keyEvent Key event that triggered the navigation
     * @param {Boolean} select Select the task that focus lands on
     * @param {Number} step Columns to step, negative to step backwards. Hidden columns are skipped and the walk
     * wraps at both ends
     * @internal
     */
    navigateHorizontally(keyEvent, select, step) {
        const
            me             = this,
            focusedControl = me.resolveTabStop(keyEvent.target);

        // If the focused control is not a card, navigate within the control row
        if (focusedControl && !focusedControl.matches(cardSelector)) {
            me.findInChain(me.getRowNavigationChain(focusedControl), focusedControl, step)?.focus();
            return;
        }

        const
            { taskRecord, swimlaneRecord, columnRecord } = keyEvent.taskBoardData,
            taskElement                                  = me.getTaskElement(taskRecord),
            columns                                      = me.columns.records,
            { length }                                   = columns,
            startIndex                                   = columns.indexOf(columnRecord);

        // A column that is not rendered offers nothing to step from
        if (startIndex === -1) {
            return;
        }

        let found = null;

        // The walk is a bounded integer, so it terminates on a board where no other column holds a task rather than
        // relying on stepping back onto the column it started from
        for (let i = 1; !found && i <= length; i++) {
            const targetColumn = columns[((startIndex + i * step) % length + length) % length];

            if (!targetColumn.hidden) {
                const
                    columnElement = me.getSwimlaneColumnElement(swimlaneRecord, targetColumn),
                    x             = Rectangle.from(columnElement, null, true).center.x,
                    y             = Rectangle.from(taskElement, null, true).center.y;

                found = me.getTaskNear(x, y);
            }
        }

        me.focusAndOptionallySelect(found, select);
    }

    // To task at same Y in next column
    navigateNext(keyEvent, select) {
        this.navigateHorizontally(keyEvent, select, 1);
    }

    // To task at same Y in prev column
    navigatePrev(keyEvent, select) {
        this.navigateHorizontally(keyEvent, select, -1);
    }

    // Right navigates to next column for LTR and previous for RTL
    navigateRight(event, select = false) {
        this['navigate' + (this.rtl ? 'Prev' : 'Next')](event, select);
    }

    // Left navigates to previous column for LTR and next for RTL
    navigateLeft(event, select = false) {
        this['navigate' + (this.rtl ? 'Next' : 'Prev')](event, select);
    }

    // Find next task in same column (might be in next swimlane)
    navigateDown(keyEvent, select = false) {
        this.navigateVertical(keyEvent, 1, select);
    }

    // Find prev task in same column (might be in prev swimlane)
    navigateUp(keyEvent, select = false) {
        this.navigateVertical(keyEvent, -1, select);
    }

    navigateVertical(keyEvent, step, select) {
        const
            me      = this,
            element = me.resolveTabStop(keyEvent.target),
            chain   = element && me.getColumnNavigationChain(element),
            // When select is true, only consider the cards as only they are selectable
            found   = chain && me.findInChain(select ? chain.filter(el => el.matches(cardSelector)) : chain, element, step);

        if (found?.matches(cardSelector)) {
            me.focusAndOptionallySelect(found, select);
        }
        else {
            found?.focus();
        }
    }

    // Returns false when there is nothing to enter, leaving F2 unhandled
    activateCard({ target }) {
        const first = target.matches(cardSelector) ? this.getCardFocusables(target)[0] : null;

        first?.focus();

        return Boolean(first);
    }

    deactivateCard(keyEvent) {
        const
            { target } = keyEvent,
            card       = target.closest(cardSelector);

        if (card && card !== target) {
            // Must not also close a hosting Popup
            keyEvent.stopImmediatePropagation();
            card.focus();

            return true;
        }

        return false;
    }

    nextCardItem(keyEvent) {
        return this.navigateCardItem(keyEvent, 1);
    }

    previousCardItem(keyEvent) {
        return this.navigateCardItem(keyEvent, -1);
    }

    // Tab on the card itself is left to the browser, it exits the board (#3894)
    navigateCardItem(keyEvent, step) {
        const
            me         = this,
            { target } = keyEvent,
            card       = target.closest(cardSelector),
            found      = card && card !== target ? me.findInChain(me.getCardFocusables(card), target, step) : null;

        if (found) {
            keyEvent.preventDefault();
            found.focus();
        }

        return Boolean(found);
    }

    // Activate (show editor)
    activate(event) {
        const { taskRecord } = this.resolveEvent(event);
        // Only care about ENTER on a task
        taskRecord && this.trigger('activateTask', { taskRecord, event });
    }

    isActionAvailable({ action, event }) {
        const
            me             = this,
            taskBoardData  = me.resolveEvent(event),
            { taskRecord } = taskBoardData;

        event.taskBoardData = taskBoardData;

        if (event.target.closest('.b-editing')) {
            return false;
        }

        // A field keeps its keys, the arrows move its caret
        if (DomHelper.isEditable(event.target, true) && !(taskRecord && cardItemActions.includes(action))) {
            return false;
        }

        // Block activation if a task item has focus (e.g. a button in the card)
        if (action === 'activate') {
            return Boolean(taskRecord && event.target === me.getTaskElement(taskRecord) && me.navigateable);
        }

        if (navigationActions.includes(action)) {
            return Boolean(me.navigateable && (taskRecord || me.resolveTabStop(event.target)));
        }

        return Boolean(taskRecord);
    }

    //endregion

};
