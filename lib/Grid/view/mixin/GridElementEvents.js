import Base from '../../../Core/Base.js';
import DomDataStore from '../../../Core/data/DomDataStore.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import DragHelper from '../../../Core/helper/DragHelper.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import EventHelper from '../../../Core/helper/EventHelper.js';
import StringHelper from '../../../Core/helper/StringHelper.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import BrowserHelper from '../../../Core/helper/BrowserHelper.js';
import GridLocation from '../../util/GridLocation.js';

// <remove-on-release>
// TODO: Should it fire more own events instead and rely less on function chaining?
// </remove-on-release>

const
    gridBodyElementEventHandlers = {
        touchstart  : 'onElementTouchStart',
        touchmove   : 'onElementTouchMove',
        touchend    : 'onElementTouchEnd',
        pointerover : 'onElementMouseOver',
        mouseout    : 'onElementMouseOut',
        mousedown   : 'onElementMouseDown',
        mousemove   : 'onElementMouseMove',
        mouseup     : 'onElementMouseUp',
        click       : 'onHandleElementClick',
        dblclick    : 'onElementDblClick',
        keyup       : 'onElementKeyUp',
        keypress    : 'onElementKeyPress',
        contextmenu : 'onElementContextMenu',
        pointerdown : 'onElementPointerDown',
        pointerup   : 'onElementPointerUp'
    },
    eventProps                   = [
        'pageX',
        'pageY',
        'clientX',
        'clientY',
        'screenX',
        'screenY'
    ],
    textKeys                     = {
        ArrowUp    : 1,
        ArrowDown  : 1,
        ArrowLeft  : 1,
        ArrowRight : 1,
        Backspace  : 1,
        Delete     : 1,
        Home       : 1,
        End        : 1
    };

function toggleHover(element, add = true) {
    element?.classList.toggle('b-hover', add);
}

function setCellHover(columnId, row, add = true) {
    row && columnId && toggleHover(row.getCell(columnId), add);
}

function eventAllowsHover(event) {
    return (typeof event.buttons !== 'number' || event.buttons === 0) && event.pointerType !== 'touch';
}

/**
 * @module Grid/view/mixin/GridElementEvents
 */

/**
 * Mixin for Grid that handles dom events. Some listeners fire own events but all can be chained by features. None of
 * the functions in this class are indented to be called directly.
 *
 * See {@link Grid.view.Grid} for more information on grid keyboard interaction.
 *
 * ## See also
 *
 * - {@link Grid.view.Grid} - The Grid widget
 * - {@link Grid.view.mixin.GridNavigation} - Cell navigation mixin
 *
 * @mixin
 */
export default Target => class GridElementEvents extends (Target || Base) {
    static $name = 'GridElementEvents';

    //region Config

    static configurable = {
        /**
         * The currently hovered grid cell
         * @member {HTMLElement}
         * @readonly
         * @category Misc
         */
        hoveredCell : null,

        /**
         * Time in ms until a longpress is triggered
         * @prp {Number}
         * @default
         * @category Misc
         */
        longPressTime : 400,

        /**
         * Set to `true` to listen for CTRL-Z (CMD-Z on Mac OS) keyboard event and trigger undo (redo when SHIFT is
         * pressed). Only applicable when using a {@link Core.data.stm.StateTrackingManager}.
         * @prp {Boolean}
         * @default
         * @category Misc
         */
        enableUndoRedoKeys : true,

        /**
         * A CSS class to add to hovered row elements
         * @config {String}
         * @default
         * @category Misc
         */
        hoverCls : 'b-hover',

        keyMap : {
            // Keystrokes which do not originate in a grid cell should not be processed by the
            // grid's KeyMap because features expect there to be a `focusedCell`.
            //
            // *Some* keyMap entries need to process key events from a wide range of targets,
            // such as undo/redo which should work as long as the grid is focused, even if
            // the focused element is not a cell. CopyPasteBase also does this.
            //
            // Note that the TimelineDomEvents mixin has a different default targetSelector,
            // which includes the scheduler canvas as well as the headers and footers.
            targetSelector : '.b-grid-cell,.b-grid-header,.b-grid-footer',

            'Ctrl+z'       : { handler : 'undoRedoKeyPress', targetSelector : '.b-grid-panel-body' },
            'Ctrl+Shift+z' : { handler : 'undoRedoKeyPress', targetSelector : '.b-grid-panel-body' },
            ' '            : { handler : 'clickCellByKey', weight : 1000 }
        }
    };

    //endregion

    //region Events

    /**
     * Fired when user clicks in a grid cell
     * @event cellClick
     * @param {Grid.view.Grid} grid The grid instance
     * @param {Core.data.Model} record The record representing the row
     * @param {Grid.column.Column} column The column to which the cell belongs
     * @param {HTMLElement} cellElement The cell HTML element
     * @param {HTMLElement} target The target element
     * @param {MouseEvent} event The native DOM event
     */

    /**
     * Fired when user double clicks a grid cell
     * @event cellDblClick
     * @param {Grid.view.Grid} grid The grid instance
     * @param {Core.data.Model} record The record representing the row
     * @param {Grid.column.Column} column The column to which the cell belongs
     * @param {HTMLElement} cellElement The cell HTML element
     * @param {HTMLElement} target The target element
     * @param {MouseEvent} event The native DOM event
     */

    /**
     * Fired when user activates contextmenu in a grid cell
     * @event cellContextMenu
     * @param {Grid.view.Grid} grid The grid instance
     * @param {Core.data.Model} record The record representing the row
     * @param {Grid.column.Column} column The column to which the cell belongs
     * @param {HTMLElement} cellElement The cell HTML element
     * @param {HTMLElement} target The target element
     * @param {MouseEvent} event The native DOM event
     */

    /**
     * Fired when user moves the mouse over a grid cell
     * @event cellMouseOver
     * @param {Grid.view.Grid} grid The grid instance
     * @param {Core.data.Model} record The record representing the row
     * @param {Grid.column.Column} column The column to which the cell belongs
     * @param {HTMLElement} cellElement The cell HTML element
     * @param {HTMLElement} target The target element
     * @param {MouseEvent} event The native DOM event
     */

    /**
     * Fired when a user moves the mouse out of a grid cell
     * @event cellMouseOut
     * @param {Grid.view.Grid} grid The grid instance
     * @param {Core.data.Model} record The record representing the row
     * @param {Grid.column.Column} column The column to which the cell belongs
     * @param {HTMLElement} cellElement The cell HTML element
     * @param {HTMLElement} target The target element
     * @param {MouseEvent} event The native DOM event
     */

    /**
     * Fired when the mouse enters a row
     * @event rowMouseEnter
     * @param {Grid.view.Grid} source The grid instance
     * @param {Core.data.Model} record The record representing the hovered row
     * @param {Grid.column.Column} column The column currently hovered
     * @param {HTMLElement} cellElement The cell HTML element
     * @param {MouseEvent} event The native DOM event
     */

    /**
     * Fired when the mouse leaves a row
     * @event rowMouseLeave
     * @param {Grid.view.Grid} source The grid instance
     * @param {Core.data.Model} record The record representing the row that the mouse left
     * @param {HTMLElement} cellElement The cell HTML element that the mouse left
     * @param {MouseEvent} event The native DOM event
     */

    /**
     * Fired when the mouse enters a cell
     * @event cellMouseEnter
     * @param {Grid.view.Grid} source The grid instance
     * @param {Core.data.Model} record The record representing the hovered cell
     * @param {Grid.column.Column} column The column currently hovered
     * @param {HTMLElement} cellElement The cell HTML element
     * @param {MouseEvent} event The native DOM event
     */

    /**
     * Fired when the mouse leaves a cell
     * @event cellMouseLeave
     * @param {Grid.view.Grid} source The grid instance
     * @param {Core.data.Model} record The record representing the cell that the mouse left
     * @param {Grid.column.Column} column The column representing the cell that the mouse left
     * @param {HTMLElement} cellElement The cell HTML element that the mouse left
     * @param {MouseEvent} event The native DOM event
     */
    //endregion

    //region Event handling

    /**
     * Init listeners for a bunch of dom events. All events are handled by handleEvent().
     * @private
     * @category Events
     */
    initInternalEvents() {
        const
            handledEvents = Object.keys(gridBodyElementEventHandlers),
            len           = handledEvents.length,
            listeners     = {
                element : this.bodyElement,
                thisObj : this
            };

        // Route all events through handleEvent, so that we can capture this.event
        // before we route to the handlers
        for (let i = 0; i < len; i++) {
            const eventName = handledEvents[i];

            listeners[eventName] = {
                handler : 'handleEvent'
            };
            // Override default for touch events.
            // Other event types already have correct default.
            if (eventName.startsWith('touch')) {
                listeners[eventName].passive = false;
            }
        }

        EventHelper.on(listeners);

        EventHelper.on({
            mouseenter : 'onGridBodyMouseEnterOrLeave',
            mouseleave : 'onGridBodyMouseEnterOrLeave',
            focusin    : 'onGridBodyFocusIn',
            element    : this.bodyElement,
            thisObj    : this,
            capture    : true
        });
    }

    /**
     * This method finds the cell location of the passed event. It returns an object describing the cell.
     * @param {Event} event A Mouse, Pointer or Touch event targeted at part of the grid.
     * @param {Boolean} [includeSingleAxisMatch] Set to `true` to return a cell from xy either above or below the Grid's
     * body or to the left or right.
     * @returns {Object} An object containing the following properties:
     * - `cellElement` - The cell element clicked on.
     * - `column` - The {@link Grid.column.Column column} clicked under.
     * - `columnId` - The `id` of the {@link Grid.column.Column column} clicked under.
     * - `record` - The {@link Core.data.Model record} clicked on.
     * - `id` - The `id` of the {@link Core.data.Model record} clicked on.
     * @internal
     * @category Events
     */
    getCellDataFromEvent(event, includeSingleAxisMatch = false) {
        const
            me          = this,
            { target }  = event;

        let cellElement = target.closest('.b-grid-cell');

        if (!cellElement && includeSingleAxisMatch && !target.classList.contains('b-grid-sub-grid')) {
            const
                { columns } = me,
                {
                    top,
                    left,
                    right,
                    bottom
                }           = me.bodyContainer.getBoundingClientRect();
            let match,
                { x, y }    = event;

            // X axis correct
            if (x >= left && x <= right) {
                // y will match row either at the top or at the bottom, dependent on what the provided x is
                y = match = Math.ceil(me[`${y < top ? 'first' : 'last'}FullyVisibleRow`].element.getBoundingClientRect().y);
            }
            // Y axis correct
            else if (y >= top && y <= bottom) {
                // x will match row either at to the left or to the right, dependent on what the provided y is
                x = match = Math.ceil(columns.visibleColumns[x < left ? 0 : columns.visibleColumns.length - 1].element.getBoundingClientRect().x);
            }
            if (match !== undefined) {
                cellElement = DomHelper.childFromPoint(target, event.offsetX, event.offsetY)?.closest('.b-grid-cell');
            }
        }

        if (cellElement) {
            return me.getCellDataFromElement(cellElement);
        }
    }

    /**
     * This method finds the cell location of the passed element. It returns an object describing the cell.
     * @param {HTMLElement} cellElement A cell element or any element inside a cell.
     * @returns {Object} An object containing the following properties:
     * - `cellElement` - The cell element clicked on.
     * - `column` - The {@link Grid.column.Column column} clicked under.
     * - `columnId` - The `id` of the {@link Grid.column.Column column} clicked under.
     * - `record` - The {@link Core.data.Model record} clicked on.
     * - `id` - The `id` of the {@link Core.data.Model record} clicked on.
     * @internal
     * @category Events
     */
    getCellDataFromElement(cellElement) {
        const me = this;

        if (cellElement /* assignment */ = cellElement.closest('.b-grid-cell')) {
            const
                cellData         = DomDataStore.get(cellElement),
                { id, columnId } = cellData,
                record           = me.store.getById(id),
                column           = me.columns.getById(columnId);

            // Row might not have a record, since we transition record removal
            return record ? {
                cellElement,
                cellData,
                columnId,
                id,
                record,
                column,
                cellSelector : { id, columnId }
            } : null;
        }
    }

    /**
     * This method finds the header location of the passed event. It returns an object describing the header.
     * @param {Event} event A Mouse, Pointer or Touch event targeted at part of the grid.
     * @returns {Object} An object containing the following properties:
     * - `headerElement` - The header element clicked on.
     * - `column` - The {@link Grid.column.Column column} clicked under.
     * - `columnId` - The `id` of the {@link Grid.column.Column column} clicked under.
     * @internal
     * @category Events
     */
    getHeaderDataFromEvent(event) {
        const headerElement = event.target.closest('.b-grid-header');

        // There is a header
        if (headerElement) {
            const
                headerData   = ObjectHelper.assign({}, headerElement.dataset),
                { columnId } = headerData,
                column       = this.columns.getById(columnId);

            return column ? {
                headerElement,
                headerData,
                columnId,
                column
            } : null;
        }
    }

    /**
     * Handles all dom events, routing them to correct functions (touchstart -> onElementTouchStart)
     * @param {Object} event Event object
     * @private
     * @category Events
     */
    handleEvent(event) {
        // If it's a focus-induced pointerover event, ignore it
        if (!this.disabled && gridBodyElementEventHandlers[event.type] && event.pointerType !== 'focus') {
            this[gridBodyElementEventHandlers[event.type]](event);
        }
    }

    //endregion

    //region Touch events

    /**
     * Touch start, chain this function in features to handle the event.
     * @param {Object} event Event object
     * @category Touch events
     * @internal
     */
    onElementTouchStart(event) {
        const me = this;

        DomHelper.isTouchEvent = true;

        if (event.touches.length === 1) {
            me.longPressTimeout = me.setTimeout(() => {
                me.onElementLongPress(event);
                event.preventDefault();
                me.longPressPerformed = true;
            }, me.longPressTime);
        }
    }

    /**
     * Touch move, chain this function in features to handle the event.
     * @param {Object} event Event object
     * @category Touch events
     * @internal
     */
    onElementTouchMove(event) {
        const
            me          = this,
            {
                lastTouchTarget
            }           = me,
            touch       = event.changedTouches[0],
            {
                pageX,
                pageY
            }           = touch,
            touchTarget = event.target.getRootNode().elementFromPoint(pageX, pageY);

        if (me.longPressTimeout) {
            me.clearTimeout(me.longPressTimeout);
            me.longPressTimeout = null;
        }

        // Keep grid informed about mouseover/outs during touch-based dragging
        if (touchTarget !== lastTouchTarget && lastTouchTarget) {
            const mouseoutEvent = new MouseEvent('mouseout', ObjectHelper.copyProperties({
                relatedTarget : touchTarget,
                pointerType   : 'touch',
                bubbles       : true
            }, touch, eventProps));

            mouseoutEvent.preventDefault = () => event.preventDefault();
            touchTarget?.dispatchEvent(mouseoutEvent);

            const mouseoverEvent = new MouseEvent('mouseover', ObjectHelper.copyProperties({
                relatedTarget : lastTouchTarget,
                pointerType   : 'touch',
                bubbles       : true
            }, touch, eventProps));

            mouseoverEvent.preventDefault = () => event.preventDefault();
            lastTouchTarget?.dispatchEvent(mouseoverEvent);
        }

        me.lastTouchTarget = touchTarget;
    }

    /**
     * Touch end, chain this function in features to handle the event.
     * @param {Object} event Event object
     * @category Touch events
     * @internal
     */
    onElementTouchEnd(event) {
        const me = this;

        if (me.longPressPerformed) {
            if (event.cancelable) {
                event.preventDefault();
            }
            me.longPressPerformed = false;
        }

        if (me.longPressTimeout) {
            me.clearTimeout(me.longPressTimeout);
            me.longPressTimeout = null;
        }
    }

    onElementLongPress(event) {}

    //endregion

    //region Mouse events

    // Trigger events in same style when clicking, dblclicking and for contextmenu
    triggerCellMouseEvent(name, event, cellData = this.getCellDataFromEvent(event), target = 'cell') {
        const me = this;

        // There is a cell
        if (cellData) {
            const
                column    = me.columns.getById(cellData.columnId),
                eventData = {
                    grid         : me,
                    record       : cellData.record,
                    column,
                    cellSelector : cellData.cellSelector,
                    cellElement  : cellData.cellElement,
                    target       : event.target,
                    event
                };

            me.trigger(target + StringHelper.capitalize(name), eventData);

            if (target === 'cell' && name === 'click') {
                column.onCellClick?.(eventData);
            }
        }
    }

    /**
     * Mouse down, chain this function in features to handle the event.
     * @param {Object} event Event object
     * @category Mouse events
     * @internal
     */
    onElementMouseDown(event) {
        const
            me       = this,
            cellData = me.getCellDataFromEvent(event);

        me.skipFocusSelection = true;

        // If click was on a scrollbar or splitter, preventDefault to not steal focus
        if (me.isScrollbarOrRowBorderOrSplitterClick(event)) {
            event.preventDefault();
        }
        else {
            me.triggerCellMouseEvent('mousedown', event, cellData);

            // Browser event unification fires a mousedown on touch tap prior to focus.
            if (cellData && !event.defaultPrevented) {
                me.onFocusGesture(event);
            }
        }
    }

    isScrollbarOrRowBorderOrSplitterClick({ target, x, y }) {
        // Normally cells catch the click, directly on row = user clicked border, which we ignore.
        // Also ignore clicks on the virtual width element used to stretch fake scrollbar
        if (target.closest('.b-grid-splitter') || target.matches('.b-grid-row, .b-virtual-width')) {
            return true;
        }
        if (target.matches('.b-vertical-overflow')) {
            const rect = target.getBoundingClientRect();
            return x > rect.right - DomHelper.scrollBarWidth;
        }
        else if (target.matches('.b-horizontal-overflow')) {
            const rect = target.getBoundingClientRect();
            return y > rect.bottom - DomHelper.scrollBarWidth - 1; // -1 for height of virtualScrollerWidth element
        }
    }

    /**
     * Mouse move, chain this function in features to handle the event.
     * @param {Object} event Event object
     * @category Mouse events
     * @internal
     */
    onElementMouseMove(event) {
        // Keep track of the last mouse position in case, due to OSX sloppy focusing,
        // focus is moved into the browser before a mousedown is delivered.
        // The cached mousemove event will provide the correct target in
        // GridNavigation#onGridElementFocus.
        this.mouseMoveEvent = event;
    }

    /**
     * Mouse up, chain this function in features to handle the event.
     * @param {Object} event Event object
     * @category Mouse events
     * @internal
     */
    onElementMouseUp(event) {}

    onElementPointerDown(event) {}

    /**
     * Pointer up, chain this function in features to handle the event.
     * @param {Object} event Event object
     * @category Mouse events
     * @internal
     */
    onElementPointerUp(event) {}

    /**
     * Called before {@link #function-onElementClick}.
     * Fires 'beforeElementClick' event which can return false to cancel further onElementClick actions.
     * @param {Object} event Event object
     * @fires beforeElementClick
     * @category Mouse events
     * @internal
     */

    onHandleElementClick(event) {
        if (this.trigger('beforeElementClick', { event }) !== false) {
            this.onElementClick(event);
        }
    }

    /**
     * Click, select cell on click and also fire 'cellClick' event.
     * Chain this function in features to handle the dom event.
     * @param {Object} event Event object
     * @fires cellClick
     * @category Mouse events
     * @internal
     */
    onElementClick(event) {
        const
            me       = this,
            cellData = me.getCellDataFromEvent(event);

        // There is a cell
        if (cellData) {
            return me.triggerCellMouseEvent('click', event, cellData);
        }
        else {
            const
                header = event.target?.closest('.b-grid-header'),
                column = header && me.columns.getById(header.dataset.columnId);

            if (column) {
                /**
                 * Fired when a grid header is clicked on.
                 *
                 * Returning `false` from a handler prevents any features (such as {@link Grid.feature.Sort})
                 * from recieving and processing the click event.
                 * @event headerClick
                 * @param {Event} domEvent The triggering DOM event.
                 * @param {Grid.column.Column} column The column clicked on.
                 * @preventable
                 */
                return me.trigger('headerClick', {
                    domEvent : event,
                    column
                });
            }
        }
    }

    onFocusGesture(event) {
        const
            me                    = this,
            { navigationEvent }   = me,
            { target }            = event,
            isContextMenu         = event.button === 2,
            // Interaction with tree expand/collapse icons doesn't focus
            isTreeExpander        = !isContextMenu && me.features.tree?.treeColumn?.isTreeExpanderIcon?.(target),
            // Mac OS specific behaviour: when you right click a non-active window, the window does not receive focus, but the context menu is shown.
            // So for Mac OS we treat the right click as a non-focusable action, if window is not active
            isUnfocusedRightClick = !document.hasFocus() && BrowserHelper.isMac && isContextMenu;

        // Tree expander clicks and contextmenus on unfocused windows don't focus
        if (isTreeExpander || isUnfocusedRightClick) {
            event.preventDefault();
        }
        else {
            // Used by the GridNavigation mixin to detect what interaction event if any caused
            // the focus to be moved. If it's a programmatic focus, there won't be one.
            // Grid doesn't use a Navigator which maintains this property, so we need to set it.
            me.navigationEvent = event;

            // Target may sit outside any focusable cell (e.g. TimelineHistogram's SVG overlay bars);
            // resolve it to the owning cell so GridLocation locates it instead of yielding a grid-less location.
            const
                cellElement = target.closest(me.focusableSelector) ? target : me.getCellDataFromEvent(event)?.cellElement,
                location    = new GridLocation(cellElement || target);

            // Context menu doesn't focus by default, so that needs to explicitly focus.
            // If they're re-clicking the current focus, GridNavigation#focusCell
            // still needs to know. It's a no-op, but it informs the GridSelection of the event.
            // Only when the grid already owns focus though; otherwise the click triggers a real
            // focusin which drives selection, and firing here too would double-process the click
            // (e.g. a Combo picker whose focusedCell was pre-activated while focus sits on the input).
            if (isContextMenu || (me.focusedCell?.equals(location) && me.containsFocus)) {
                const focusOptions = { scroll : false };

                // If current event is a MouseEvent and previous event is a TouchEvent on same target, this event is
                // most likely a MouseEvent triggered by a TouchEvent, which should not trigger selection
                if (globalThis.TouchEvent && event instanceof MouseEvent && navigationEvent instanceof TouchEvent &&
                    target === navigationEvent.target
                ) {
                    focusOptions.doSelect = false;
                }

                me.focusCell(location, focusOptions);
            }
        }
    }

    /**
     * Double click, fires 'cellDblClick' event.
     * Chain this function in features to handle the dom event.
     * @param {Event} event
     * @fires cellDblClick
     * @fires columnResize
     * @category Mouse events
     * @internal
     */
    onElementDblClick(event) {
        const { target } = event;

        this.triggerCellMouseEvent('dblClick', event);

        if (target.classList.contains('b-grid-header-resize-handle')) {
            const
                header = target.closest('.b-grid-header'),
                column = this.columns.getById(header.dataset.columnId);

            if (column.resizeToFitContent()) {
                this.trigger('columnResize', { column, domEvent : event });
            }
        }
    }

    shouldHover(event) {
        // No hover effect desired if a mouse button is pressed (like when resizing window, region, or resizing something etc).
        return DragHelper.dragging ? event.pointerType !== 'touch' : eventAllowsHover(event);
    }

    /**
     * Mouse over, adds 'hover' class to elements.
     * @param {Object} event Event object
     * @fires mouseOver
     * @category Mouse events
     * @internal
     */
    onElementMouseOver(event) {
        // bail out early if scrolling
        if (!this.scrolling) {
            const
                me              = this,
                { hoveredCell } = me,
                shouldHover     = me.shouldHover(event),
                cellElement     = event.target.closest('.b-grid-cell');

            me._lastMouseOverOutEvent = event;

            if (cellElement) {
                if (shouldHover) {
                    me.hoveredCell = cellElement;
                }

                if (hoveredCell !== me.hoveredCell) {
                    me.triggerCellMouseEvent('mouseOver', event);
                }
            }
            // If we're not over a cell, we might be over a splitter etc.
            // In any case, we should not have a hoveredCell anymore.
            else if (shouldHover && !event.target.closest('.b-sub-grid')) {
                me.hoveredCell = null;
            }

            /**
             * Mouse moved in over element in grid
             * @event mouseOver
             * @param {MouseEvent} event The native browser event
             */
            me.trigger('mouseOver', { event });
        }
    }

    /**
     * Mouse out, removes 'hover' class from elements.
     * @param {Object} event Event object
     * @fires mouseOut
     * @category Mouse events
     * @internal
     */
    onElementMouseOut(event) {
        const
            me          = this,
            {
                target,
                relatedTarget
            }           = event,
            // Mouse positions are sampled, so a fast exit can jump from a cell descendant straight out of the
            // grid without the cell itself ever being the mouseout target — resolve the containing cell instead
            cellElement = target?.closest('.b-grid-cell');

        me._lastMouseOverOutEvent = event;

        if (eventAllowsHover(event) && relatedTarget && cellElement && !cellElement.contains(relatedTarget) && (!relatedTarget.matches('.b-grid-row,.b-grid-cell') || !me.bodyElement.contains(relatedTarget)) && !me.hoveredCell?.contains(relatedTarget)) {
            me.hoveredCell = null;
        }

        // bail out early if scrolling
        if (!me.scrolling) {

            // Check that we are not within the same grid cell
            if (relatedTarget?.closest('.b-grid-cell') !== cellElement) {
                if (cellElement) {
                    me.triggerCellMouseEvent('mouseOut', event);
                }
            }

            /**
             * Mouse moved out from element in grid
             * @event mouseOut
             * @param {MouseEvent} event The native browser event
             */
            me.trigger('mouseOut', { event });
        }
    }

    // The may be chained in features
    updateHoveredCell(cellElement, was) {
        const
            me                        = this,
            { selectionMode }         = me,
            rowNumberColumnId         = selectionMode.rowNumber && me.columns.find(c => c.type == 'rownumber')?.id,
            checkboxSelectionColumnId = selectionMode.checkbox && me.checkboxSelectionColumn?.id;

        let prevRow, row;

        // Clear last hovered cell
        if (was) {
            toggleHover(was, false);

            // Also remove hovered class on checkcol, rownumbercol and column header
            const
                prevSelector = DomDataStore.get(was);

            prevRow = prevSelector.row;

            if (prevRow && !prevRow.isDestroyed) {
                setCellHover(rowNumberColumnId, prevRow, false);
                setCellHover(checkboxSelectionColumnId, prevRow, false);
            }

            if (prevSelector?.columnId) {
                toggleHover(me.columns.getById(prevSelector.columnId)?.element, false);
            }
        }

        // Clears hovered row
        // Only remove cls if row isn't destroyed
        if (me._hoveredRow && !me._hoveredRow.isDestroyed) {
            me.toggleRowHover(me._hoveredRow, false);
        }
        me._hoveredRow = null;

        // Set hovered
        if (cellElement && !me.scrolling) {
            const
                selector = DomDataStore.get(cellElement);

            row = selector.row;

            if (row) {
                // Set cell if cell selection mode is on
                if (selectionMode.cell && selector.columnId !== rowNumberColumnId && selector.columnId !== checkboxSelectionColumnId) {
                    const column = me.columns.getById(selector.columnId);
                    toggleHover(cellElement);

                    // In cell selection mode:
                    // Also "hover" checkcolumn cell if such exists
                    setCellHover(checkboxSelectionColumnId, row);
                    // And also rownumbercolumn cell
                    setCellHover(rowNumberColumnId, row);

                    // And also column header
                    if (column?.element && column.headerHoverable !== false) {
                        toggleHover(column.element);
                    }
                }
                // Else row
                else {
                    me._hoveredRow = row;
                    me.toggleRowHover(row, true);
                }
            }
            else {
                me.hoveredCell = null;
            }
        }

        // Trigger rowMouseEnter/rowMouseLeave events manually
        if (row !== prevRow) {
            const { _lastMouseOverOutEvent } = me;

            if (prevRow && !prevRow.isDestroyed) {
                me.trigger('rowMouseLeave', { event : _lastMouseOverOutEvent, record : prevRow.cellContext.record, cellElement : was });
            }
            if (row) {
                const cellData = me.getCellDataFromEvent(_lastMouseOverOutEvent);
                me.triggerCellMouseEvent('mouseEnter', _lastMouseOverOutEvent, cellData, 'row');
            }

        }
    }

    toggleRowHover(row, hover) {
        if (this.hoverCls) {
            row.toggleCls(this.hoverCls, hover);
        }
    }

    //endregion

    //region Keyboard events

    // Hooks on to keyMaps keydown-listener to be able to run before
    keyMapOnKeyDown(event) {
        // Handle custom elements containing focus
        const
            me         = this,
            { target } = event.browserEvent;

        if (me.element.contains(target)) {
            const
                isArrowKey  = event.key.startsWith('Arrow'),
                isActionKey = event.key === 'Escape' || event.key === 'F2' || event.key === 'Tab' || event.key === 'Enter';

            me.onElementKeyDown(event);

            // Prevents keys from editable input fields which the Grid handles from reaching grid's KeyMap.
            // Allow navigation action keys to reach the grid's KeyMap from inside an actionable cell.
            if (((textKeys[event.key] && DomHelper.isEditable(target, true)) || (me.focusedCell?.containsFocus && !isActionKey && !isArrowKey && !me.matchKeyMapEntry(event))) && !target.getAttribute('readOnly') && me.matchKeyMapEntry(event)) {
                // Don't allow browser key commands such as PAGE-UP, PAGE-DOWN to continue.
                if (!isArrowKey && !event.key === 'Backspace') {
                    event.preventDefault();
                }
                event.handled = true;
                event.stopPropagation();
                return false;
            }
            else {
                super.keyMapOnKeyDown(event);
            }
        }
    }

    /**
     * To catch all keydowns. For more specific keydown actions, use keyMap.
     * @param {Object} event Event object
     * @category Keyboard events
     * @internal
     */
    onElementKeyDown(event) {
        // If some other function flagged the event as handled, we ignore it.
        if (event.handled || !this.element.contains(event.target)) {
            return;
        }

        const
            me          = this,
            // Read this to refresh cached reference in case this keystroke lead to the removal of current row
            focusedCell = me.focusedCell;

        if (focusedCell?.isCell && !focusedCell.isActionable) {
            const data = event.target.closest('.b-grid-cell') ? me.getCellDataFromEvent(event) : me.getCellDataFromElement(focusedCell.cell);

            // If a cell is focused and column is interested - call special callback
            // "data" may not exist if row is currently being removed
            data?.column.onCellKeyDown?.({ ...data, event });
        }
    }

    undoRedoKeyPress(event) {
        const { stm } = this.store;
        if (stm && this.enableUndoRedoKeys && !this.features.cellEdit?.isEditing) {
            stm.onUndoKeyPress(event);
            return true;
        }
        return false;
    }

    // Trigger column.onCellClick when space bar is pressed
    clickCellByKey(event) {
        const
            me          = this,
            // Read this to refresh cached reference in case this keystroke lead to the removal of current row
            focusedCell = me.focusedCell,
            cellElement = focusedCell?.cell,
            column      = me.columns.getById(cellElement.dataset.columnId);

        if (focusedCell?.isCell && !focusedCell.isActionable) {
            if (column.onCellClick) {
                column.onCellClick({
                    grid   : me,
                    column,
                    record : me.store.getById(focusedCell.id),
                    cellElement,
                    target : event.target,
                    event
                });
                return true;
            }
        }
        return false;
    }

    /**
     * Key press, chain this function in features to handle the dom event.
     * @param {Object} event Event object
     * @category Keyboard events
     * @internal
     */
    onElementKeyPress(event) {}

    /**
     * Key up, chain this function in features to handle the dom event.
     * @param {Object} event Event object
     * @category Keyboard events
     * @internal
     */
    onElementKeyUp(event) {}

    //endregion

    //region Other events

    /**
     * Context menu, chain this function in features to handle the dom event.
     * In most cases, include ContextMenu feature instead.
     * @param {Object} event Event object
     * @category Other events
     * @internal
     */
    onElementContextMenu(event) {
        const
            me       = this,
            cellData = me.getCellDataFromEvent(event);

        // There is a cell
        if (cellData) {
            me.triggerCellMouseEvent('contextMenu', event, cellData);

            // Focus on tap for touch events.
            // Selection follows from focus.
            if (DomHelper.isTouchEvent) {
                me.onFocusGesture(event);
            }
        }
    }

    onGridBodyMouseEnterOrLeave(event) {
        const
            me       = this,
            cellData = event.target.classList.contains('b-grid-cell') && me.getCellDataFromEvent(event);

        if (cellData) {
            me.triggerCellMouseEvent(event.type, event, cellData);
        }

        // Leaving the browser window entirely yields no mouseout with a relatedTarget for onElementMouseOut to act
        // on. The body element's mouseleave fires regardless, so it is the reliable signal to clear the hover state.
        if (event.type === 'mouseleave' && event.target === me.bodyElement && me.hoveredCell && eventAllowsHover(event)) {
            me.hoveredCell = null;
        }
    }

    /**
     * Overrides empty base function in View, called when view is resized.
     * @param {HTMLElement} element Resized element
     * @param {Number} width New width
     * @param {Number} height New height
     * @param {Number} oldWidth Previous width
     * @param {Number} oldHeight Previous height
     * @fires resize
     * @category Other events
     * @internal
     */
    onInternalResize(element, width, height, oldWidth, oldHeight) {
        const me = this;

        // cache to avoid recalculations in the middle of rendering code (RowManger#getRecordCoords())
        me._bodyRectangle    = Rectangle.client(me.bodyContainer);

        super.onInternalResize(element, width, height, oldWidth, oldHeight);

        if (height !== oldHeight) {
            me._bodyHeight = me.bodyContainer.offsetHeight;
            if (me.isPainted) {
                // initial height will be set from render(),
                // it reaches onInternalResize too early when rendering, headers/footers are not sized yet
                me.rowManager.initWithHeight(me._bodyHeight);
            }
        }
        me.refreshVirtualScrollbars();

        if (width !== oldWidth) {
            // Slightly delay to avoid resize loops.
            me.setTimeout(() => {
                if (!me.isDestroyed) {
                    me.updateResponsive(width, oldWidth);
                }
            }, 0);
        }
    }

    //endregion

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
