import Base from '../../../Core/Base.js';
import Navigator from '../../../Core/helper/util/Navigator.js';
import Delayable from '../../../Core/mixin/Delayable.js';
import GridLocation from '../../../Grid/util/GridLocation.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';

/**
 * @module Scheduler/view/mixin/EventNavigation
 */

const
    preventDefault  = e => e.preventDefault(),
    isArrowKey = {
        ArrowRight : 1,
        ArrowLeft  : 1,
        ArrowUp    : 1,
        ArrowDown  : 1
    },
    animate100 = {
        animate : 100
    },
    emptyObject = Object.freeze({}),
    sortAssignmentsAsc = ({ event : { startDate : lhs } }, { event : { startDate : rhs } }) => lhs - rhs,
    sortAssignmentsDesc = ({ event : { startDate : lhs } }, { event : { startDate : rhs } }) => rhs - lhs;

/**
 * Mixin that enables keyboard navigation between events in the scheduler. It supports arrow keys for
 * moving between events, Tab for sequential navigation, and Enter for activating events.
 *
 * ## See also
 *
 * - {@link Scheduler.view.mixin.EventSelection} - Event selection tracking
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 *
 * @mixin
 */
export default Target => class EventNavigation extends Delayable(Target || Base) {
    static $name = 'EventNavigation';

    //region Default config

    static configurable = {
        /**
         * A config object to use when creating the {@link Core.helper.util.Navigator}
         * to use to perform keyboard navigation in the timeline.
         * @config {NavigatorConfig}
         * @default
         * @category Misc
         * @internal
         */
        navigator : {
            allowCtrlKey   : true,
            scrollSilently : true,
            keys           : {
                Space     : 'onEventSpaceKey',
                Enter     : 'onEventEnterKey',
                Delete    : 'onDeleteKey',
                Backspace : 'onDeleteKey',
                ArrowUp   : 'onArrowUpKey',
                ArrowDown : 'onArrowDownKey',
                Escape    : 'onEscapeKey'
            },
            internalListeners : {
                navigate : 'up.onNavigate'
            }
        },

        isNavigationKey : {
            ArrowDown  : 1,
            ArrowUp    : 1,
            ArrowLeft  : 1,
            ArrowRight : 1
        },

        /**
         * A CSS class name to add to focused events.
         * @config {String}
         * @default
         * @category CSS
         * @private
         */
        focusCls : 'b-active',

        /**
         * Allow using <kbd>Delete</kbd> and <kbd>Backspace</kbd> to remove events/assignments
         * @config {Boolean}
         * @default
         * @category Misc
         */
        enableDeleteKey : true,

        // Number in milliseconds to buffer handlers execution. See `Delayable.throttle` function docs.
        onDeleteKeyBuffer      : 500,
        navigatePreviousBuffer : 200,
        navigateNextBuffer     : 200,

        testConfig : {
            onDeleteKeyBuffer : 1
        }
    };

    //endregion

    //region Events

    /**
     * Fired when a user gesture causes the active item to change.
     * @event navigate
     * @param {Event} event The browser event which instigated navigation. May be a click or key or focus event.
     * @param {HTMLElement|null} item The newly active item, or `null` if focus moved out.
     * @param {HTMLElement|null} oldItem The previously active item, or `null` if focus is moving in.
     */

    //endregion

    construct(config) {
        const me = this;

        super.construct(config);

        me.isInTimeAxis = me.isInTimeAxis.bind(me);
        me.onDeleteKey = me.throttle(me.onDeleteKey, me.onDeleteKeyBuffer, me);
    }

    changeNavigator(navigator) {
        const
            me             = this,
            { isVertical } = me;

        me.getConfig('subGridConfigs');

        if (isVertical) {
            navigator.prevKey = 'ArrowUp';
            navigator.nextKey = 'ArrowDown';
            navigator.keys.ArrowUp = navigator.keys.ArrowDown = null;
            navigator.keys.ArrowLeft = navigator.keys.ArrowRight = 'navigateResourceHeaderCells';
        }

        return new Navigator(me.constructor.mergeConfigs({
            ownerCmp         : me,
            target           : isVertical ? me.bodyElement : me.timeAxisSubGridElement,
            processEvent     : me.processEvent,
            itemSelector     : `.${me.eventCls}-wrap${me._extraNavigableSelectors ?? ''}${isVertical ? ',.b-resource-header-cell' : ''}`,
            focusCls         : me.focusCls,
            navigatePrevious : me.throttle(me.navigatePrevious, { delay : me.navigatePreviousBuffer, throttled : preventDefault }),
            navigateNext     : me.throttle(me.navigateNext, { delay : me.navigateNextBuffer, throttled : preventDefault })
        }, navigator));
    }

    doDestroy() {
        this.navigator.destroy();
        super.doDestroy();
    }

    /**
     * Selector matching the elements keyboard navigation of events visits: events, and elements features add using
     * {@link #function-addNavigableSelector}.
     * @member {String}
     * @readonly
     * @internal
     */
    get navigableEventSelector() {
        return this.eventSelector + (this._extraNavigableSelectors ?? '');
    }

    /**
     * Makes elements matching the selector take part in keyboard navigation of events, used by features rendering
     * their own items through the event rendering pipeline (EventClustering's clusters). They are navigated to using
     * {@link #function-navigateToItem}.
     * @param {String} selector
     * @internal
     */
    addNavigableSelector(selector) {
        const me = this;

        me._extraNavigableSelectors = `${me._extraNavigableSelectors ?? ''},${selector}`;

        // Created lazily, it picks the selector up when created later
        if (me._navigator) {
            me._navigator.itemSelector += `,${selector}`;
        }
    }

    /**
     * Determines if an event is within the time axis.
     *
     * @param {Scheduler.model.EventModel} eventRecord The event to check
     * @returns {Boolean} `true` if the record is within the time axis
     */
    isInTimeAxis(eventRecord) {
        const isExcluded =
            // If event is hidden by workingTime configs, horizontal mapper will set a flag on instance meta
            eventRecord.instanceMeta(this).excluded ||

            // We still need to check if time span is included in axis.
            !this.timeAxis.isTimeSpanInAxis(eventRecord)

        ;

        return !isExcluded;
    }

    onElementKeyDown(keyEvent) {
        const
            me              = this,
            { navigator }   = me;

        // If we're focused in the time axis, and *not* on an event, then ENTER means
        // jump down into the first visible assignment in the cell.
        if (me.focusedCell?.rowIndex !== -1 && me.focusedCell?.column === me.timeAxisColumn && !keyEvent.target.closest(navigator.itemSelector) && keyEvent.key === 'Enter') {
            const firstAssignment = me.getFirstVisibleAssignment();
            if (firstAssignment) {
                me.navigateTo(firstAssignment, {
                    uiEvent : keyEvent
                });
                return false;
            }
        }
        else {
            super.onElementKeyDown?.(keyEvent);
        }
    }

    getFirstVisibleAssignment(location = this.focusedCell) {
        const
            me = this,
            {
                currentOrientation,
                rowManager,
                eventStore
            } = me;

        if (me.isHorizontal) {
            let renderedEvents = currentOrientation.rowMap.get(rowManager.getRow(location.rowIndex));

            if (renderedEvents?.length) {
                // Features render other items in the row too (clusters, resource time ranges), those have no assignment
                return renderedEvents.find(rendered => rendered.elementData.assignmentRecord)?.elementData.assignmentRecord;
            }
            else {
                renderedEvents = currentOrientation.resourceMap.get(location.id)?.eventsData;
                if (renderedEvents?.length) {
                    // When events are gathered from resource, we need to check they're available
                    return renderedEvents.filter(e => e.assignmentRecord && eventStore.isAvailable(e.eventRecord))[0]?.assignmentRecord;
                }
            }
        }
        else {
            const
                firstResource = [...currentOrientation.resourceMap.values()][0],
                renderedEvents = firstResource && Object.values(firstResource);

            if (renderedEvents?.length) {
                return renderedEvents.filter(e => e.renderData.assignmentRecord && eventStore.isAvailable(e.renderData.eventRecord))[0]?.renderData.assignmentRecord;
            }
        }
    }

    onGridBodyFocusIn(focusEvent) {
        const
            // We must use the document activeElement here because prior handlers may have moved focus
            target          = DomHelper.getActiveElement(this.element),
            isGridCellFocus = target.closest(this.focusableSelector);

        // Event navigation only has a say when navigation is inside the TimeAxisSubGrid
        if (this.timeAxisSubGridElement.contains(target)) {
            const
                me                  = this,
                { navigationEvent } = me,
                eventFocus          = target.closest(me.navigator.itemSelector),
                destinationCell     = eventFocus ? me.normalizeCellContext({
                    rowIndex : me.isVertical ? 0
                        : me.navigationRowStore.indexOf(me.resolveRowRecord(target)),
                    column : me.timeAxisColumn,
                    target
                }) : new GridLocation(target);

            // Don't take over what the event navigator does if it's doing event navigation.
            // Just silently cache our actionable location.
            if (eventFocus) {
                const { _focusedCell } = me;

                me._focusedCell = destinationCell;
                me.onCellNavigate?.(me, _focusedCell, destinationCell, navigationEvent, true);
                return;
            }

            // Depending on how we got here, try to focus the first event in the cell *if we're in a cell*.
            if (isGridCellFocus && (!navigationEvent || isArrowKey[navigationEvent.key])) {
                const firstAssignment = me.getFirstVisibleAssignment(destinationCell);
                if (firstAssignment) {
                    me.navigateTo(firstAssignment, {
                        // Only change scroll if focus came from key press
                        scrollIntoView : Boolean(navigationEvent && navigationEvent.type !== 'mousedown'),
                        uiEvent        : navigationEvent || focusEvent
                    });
                    return;
                }
            }
        }

        // Grid-level focus movement, let superclass handle it.
        if (isGridCellFocus) {
            super.onGridBodyFocusIn(focusEvent);
        }
    }

    /*
     * Override of GridNavigation#focusCell method to handle the TimeAxisColumn.
     * Not needed until we implement full keyboard accessibility.
     */
    accessibleFocusCell(cellSelector, options) {
        const me                     = this;

        cellSelector = me.normalizeCellContext(cellSelector);

        if (cellSelector.columnId !== me.timeAxisColumn.id) {
            return super.focusCell(cellSelector, options);
        }
    }

    /**
     * Override which, when a `from` location is supplied (Up/Down navigation), targets the assignment
     * in the destination cell whose time span is horizontally closest to the previously focused one
     * instead of the first.
     *
     * This mixin is also inherited by Gantt (alongside Gantt's TaskNavigation).
     * The closest-event realignment only activates for the Scheduler event-navigation path; it stays
     * inert elsewhere.
     * @internal
     */
    normalizeCellContext(cellContext) {
        const
            me         = this,
            location   = super.normalizeCellContext(cellContext),
            fromTarget = cellContext.from?.target;

        // Only realign when moving between rows in horizontal mode and the destination is a real
        // event cell. The leftmost-event fallback only applies when no explicit target was supplied.
        if (fromTarget && me.isHorizontal && location.record && !location._target && location.column === me.timeAxisColumn) {
            const
                fromAssignment    = me.resolveAssignmentRecord(fromTarget),
                closestAssignment = fromAssignment && me.getClosestAssignment(location.record, fromAssignment),
                closestElement    = closestAssignment && me.getElementFromAssignmentRecord(closestAssignment, true);

            // Target the closest assignment's element directly when rendered. Out-of-view assignments have no
            // element here, so we leave the default cell location for the focus/scroll path (see `navigateTo`).
            if (closestElement) {
                return super.normalizeCellContext({
                    record : location.record,
                    column : me.timeAxisColumn,
                    target : closestElement
                });
            }
        }

        return location;
    }

    /**
     * Horizontal center coordinate (along the time axis) of an assignment's event, derived purely from
     * the event's start/end dates via the time axis. Does not touch the DOM, so it works for assignments
     * whose elements are not currently rendered (scrolled out of view).
     *
     * Clamps the event span to the axis so off-axis edges are measured from the visible portion, not the left edge.
     * @param {Scheduler.model.AssignmentModel} assignmentRecord The assignment to measure.
     * @returns {Number|null} The local center coordinate along the time axis, or `null` if the event lies
     * entirely outside the time axis span (not a navigable target).
     * @internal
     */
    getAssignmentCenterCoordinate(assignmentRecord) {
        const
            me                                           = this,
            { startDate, endDate }                       = assignmentRecord.event,
            { startDate : axisStart, endDate : axisEnd } = me.timeAxis;

        // Event entirely outside the time axis span has no position on the axis.
        if (endDate <= axisStart || startDate >= axisEnd) {
            return null;
        }

        return (
            me.getCoordinateFromDate(DateHelper.max(startDate, axisStart), true) +
            me.getCoordinateFromDate(DateHelper.min(endDate, axisEnd), true)
        ) / 2;
    }

    /**
     * Finds the assignment of the passed resource that best aligns with `fromAssignment` when crossing into an
     * adjacent resource row. Time-intersecting candidates win over non-intersecting ones.
     *
     * Among time-intersecting candidates the one in the **entry band** of the destination resource wins: when
     * moving Down (`rowOffset > 0`) focus enters from the top, so the candidate with the smallest layout `top`
     * (topmost band) is preferred; when moving Up (`rowOffset < 0`) focus enters from the bottom, so the largest
     * `top` (bottommost band) is preferred. This matches the visual entry point a user expects rather than picking
     * a lower/upper stacked event that merely sits a few pixels closer in horizontal center. Within the same band
     * (and among non-intersecting candidates) the horizontally closest center along the time axis wins. All
     * ranking is date-/layout-derived (`getResourceEventBox`), so no DOM measurement is performed.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource whose assignments to scan.
     * @param {Scheduler.model.AssignmentModel} fromAssignment The assignment to measure against.
     * @param {Number} [rowOffset] Travel direction: `1` for Down (prefer the topmost intersecting band),
     * `-1` for Up (prefer the bottommost intersecting band). When omitted, intersecting candidates rank by
     * closest center only.
     * @returns {Scheduler.model.AssignmentModel|null} The best-aligned assignment, or `null` if the
     * resource has no assignment within the time axis span.
     * @internal
     */
    getClosestAssignment(resourceRecord, fromAssignment, rowOffset) {
        const
            me                                           = this,
            { assignmentStore, eventStore }              = me,
            fromX                                        = me.getAssignmentCenterCoordinate(fromAssignment),
            { startDate : fromStart, endDate : fromEnd } = fromAssignment.event;

        let closestAssignment     = null,
            closestDelta          = Infinity,
            closestIntersecting   = null,
            closestIntersectDelta = Infinity,
            // Entry-band tracking for the intersecting group. `bestBandTop` is the layout `top` of the currently
            // chosen intersecting candidate; Down prefers a smaller top, Up prefers a larger one.
            bestBandTop           = null;

        for (const assignmentRecord of me.getRowAssignments(resourceRecord)) {
            // Skip assignments/events hidden by a store filter so navigation never lands on a
            // filtered-out event (mirrors the filtered traversal in `SchedulerBase#getEvents`). Also assignments of
            // events that are not loaded
            if (!assignmentRecord.event || assignmentStore.isFilteredOut(assignmentRecord) || eventStore.isFilteredOut(assignmentRecord.event)) {
                continue;
            }

            const centerX = me.getAssignmentCenterCoordinate(assignmentRecord);

            if (centerX != null) {
                // Intersecting candidates always win first; when the source is off-axis (no `fromX`) the
                // center fallback ranks by absolute position, so the leftmost in-axis event becomes the center.
                const delta = fromX == null ? centerX : Math.abs(centerX - fromX);

                // Prefer a time-intersecting candidate: it is the expected vertical-navigation target.
                const { startDate, endDate } = assignmentRecord.event;
                if (DateHelper.intersectSpans(fromStart, fromEnd, startDate, endDate)) {
                    // When a travel direction is known, rank the intersecting group by the destination's entry
                    // band (topmost for Down, bottommost for Up) so focus lands where it enters the row, with the
                    // closest center as the in-band tie-break. Falls back to pure closest-center when no direction.
                    const top = rowOffset ? me.getAssignmentVerticalCoordinate(assignmentRecord) : null;

                    if (me.isBetterIntersectingCandidate(rowOffset, top, delta, bestBandTop, closestIntersectDelta, closestIntersecting)) {
                        bestBandTop           = top;
                        closestIntersectDelta = delta;
                        closestIntersecting   = assignmentRecord;
                    }
                }
                else if (delta < closestDelta) {
                    closestDelta      = delta;
                    closestAssignment = assignmentRecord;
                }
            }
        }

        // A time-intersecting candidate always wins over the closest non-intersecting one.
        return closestIntersecting || closestAssignment;
    }

    /**
     * Ranks an intersecting closest-assignment candidate against the current best. With a known travel
     * direction (`rowOffset`) the candidate's entry band wins first (smaller layout `top` for Down, larger for
     * Up), tie-broken by the closer horizontal center; without a direction (or when band tops are unavailable)
     * it falls back to pure closest-center ranking.
     * @param {Number} rowOffset Travel direction (`1` Down, `-1` Up, falsy = no direction).
     * @param {Number|null} top Candidate's layout band `top`, or `null` if unavailable.
     * @param {Number} delta Candidate's horizontal-center distance to the source.
     * @param {Number|null} bestBandTop Current best candidate's band `top`.
     * @param {Number} bestDelta Current best candidate's horizontal-center distance.
     * @param {Scheduler.model.AssignmentModel|null} currentBest The current best candidate (null if none yet).
     * @returns {Boolean} `true` if the candidate should replace the current best.
     * @internal
     */
    isBetterIntersectingCandidate(rowOffset, top, delta, bestBandTop, bestDelta, currentBest) {
        // First intersecting candidate always wins.
        if (!currentBest) {
            return true;
        }

        // No usable band info (no direction, or a candidate without a layout box): rank by closest center.
        if (!rowOffset || top == null || bestBandTop == null) {
            return delta < bestDelta;
        }

        // Different entry bands: the one nearer the entry edge wins (top for Down, bottom for Up).
        if (top !== bestBandTop) {
            return rowOffset > 0 ? top < bestBandTop : top > bestBandTop;
        }

        // Same band: closer horizontal center wins.
        return delta < bestDelta;
    }

    // Interface method to extract the navigated to record from a populated 'navigate' event.
    // Gantt, Scheduler and Calendar handle event differently, adding different properties to it.
    // This method is meant to be overridden to return correct target from event
    normalizeTarget(event) {
        return event.assignmentRecord ?? event.navigationTarget;
    }

    /**
     * Returns the items of a resource that keyboard navigation visits, events in the time axis in the order they
     * are laid out. Passed through {@link #function-processNavigationItems}, which lets features navigate to their
     * own items.
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @param {Object} [options] Additional options for `getRowEvents()`
     * @returns {Object[]}
     * @internal
     */
    getNavigationItems(resourceRecord, options) {
        const
            me                     = this,
            // start/end dates are required to limit time span to look at in case recurrence feature is enabled
            { startDate, endDate } = me.timeAxis,
            events                 = me
                .getRowEvents({
                    resourceRecord,
                    startDate,
                    endDate,
                    ...options
                })
                .filter(me.isInTimeAxis)
                .sort(me.currentOrientation.eventSorter);

        return me.processNavigationItems(resourceRecord, events);
    }

    /**
     * Hook for features to modify the items keyboard navigation visits in a resource, see
     * {@link #function-getNavigationItems}. Items which are not events are navigated to by
     * {@link #function-navigateToItem}.
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @param {Scheduler.model.EventModel[]} items Events in layout order
     * @returns {Object[]}
     * @internal
     */
    processNavigationItems(resourceRecord, items) {
        return items;
    }

    /**
     * Returns what keyboard navigation navigates to for an item of {@link #function-getNavigationItems}: the
     * assignment of an event, or an object describing an item that has none.
     * @param {Object} item
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @returns {Scheduler.model.AssignmentModel|Object|null}
     * @internal
     */
    getNavigationTarget(item, resourceRecord) {
        return item
            ? this.assignmentStore.getAssignmentForEventAndResource(item, resourceRecord) ??
                { isNavigationTarget : true, event : item, resource : resourceRecord }
            : null;
    }

    // The store holding the rows navigated between. In horizontal mode the rows, which with TreeGroup are links of the
    // resources and generated parents, not the resources of the resourceStore
    get navigationRowStore() {
        return this.isHorizontal ? this.store : this.resourceStore;
    }

    /**
     * Hook for features to resolve the navigation target of an element which is not an event, see
     * {@link #function-getNavigationTarget}.
     * @param {HTMLElement} element
     * @returns {Object|undefined}
     * @internal
     */
    resolveNavigationTarget(element) {}

    /**
     * Hook for features to navigate to a navigation target which is not an assignment, see
     * {@link #function-getNavigationTarget}.
     * @param {Object} target
     * @param {Object} options
     * @internal
     */
    navigateToItem(target, options) {}

    /**
     * Returns the navigation target next to the passed one, continuing in the adjacent resources.
     * @param {Scheduler.model.AssignmentModel|Object} assignmentRecord
     * @param {Number} direction `-1` for previous, `1` for next
     * @param {Boolean} [isDelete]
     * @returns {Scheduler.model.AssignmentModel|Object|null}
     * @private
     */
    getAdjacentNavigationTarget(assignmentRecord, direction, isDelete) {
        const
            me                                  = this,
            {
                navigationRowStore : rowStore,
                visibleDateRange
            }                                   = me,
            eventRecord                         = assignmentRecord.event,
            // The row it is rendered on, which might not be its resource's (GroupRollups)
            rowRecord                           = me.getAssignmentRow(assignmentRecord),
            resourceItems                       = me.getNavigationItems(rowRecord, { visibleDateRange }),
            // Items which are not events (clusters) are recreated by each call, they are found by id
            index                               = resourceItems.includes(eventRecord)
                ? resourceItems.indexOf(eventRecord)
                : resourceItems.findIndex(item => item.id === eventRecord?.id);

        let resourceRecord = rowRecord,
            item           = resourceItems[index + direction];

        // At first or last item of the resource, traverse the rows
        if (!item) {
            for (let rowIdx = rowStore.indexOf(resourceRecord) + direction; rowIdx >= 0 && rowIdx < rowStore.count; rowIdx += direction) {
                resourceRecord = rowStore.getAt(rowIdx);

                const items = me.getNavigationItems(resourceRecord);

                item = direction > 0 ? items[0] : items.at(-1);

                // We have a usable item unless we are deleting and landed on another instance of the same event
                // (multi-assignment), in which case keep traversing
                if (item && !(isDelete && item === eventRecord)) {
                    break;
                }
            }
        }

        return me.getNavigationTarget(item, resourceRecord);
    }

    getPrevious(assignmentRecord, isDelete) {
        return this.getAdjacentNavigationTarget(assignmentRecord, -1, isDelete);
    }

    // Invoked only in vertical mode when navigating resource header cells
    navigateResourceHeaderCells(keyEvent) {
        const { target } = keyEvent;

        if (target.closest('.b-resource-header-cell')) {
            const
                targetResource = this.resourceStore[keyEvent.key === 'ArrowRight' ? 'getNext' : 'getPrev'](this.resolveResourceRecord(target)),
                toFocus        = target.parentElement.querySelector(`[data-resource-id="${CSS.escape(targetResource?.id)}"]`);

            if (toFocus) {
                keyEvent.handled = true;
                keyEvent.preventDefault();
                toFocus.focus({
                    preventScroll : false,
                    focusVisible  : true
                });
            }
        }
    }

    navigatePrevious(keyEvent) {
        const
            me                 = this,
            previousAssignment = keyEvent.target.closest(me.navigableEventSelector) && me.getPrevious(me.normalizeTarget(keyEvent));

        if (previousAssignment) {
            keyEvent.preventDefault();
            if (!keyEvent.ctrlKey) {
                me.clearEventSelection();
            }
            return me.navigateTo(previousAssignment, {
                uiEvent : keyEvent
            });
        }

        // No previous event/task, fall back to Grid's handling of this gesture
        keyEvent.handled = false;
        return me.doGridNavigation(keyEvent);
    }

    getNext(assignmentRecord, isDelete) {
        return this.getAdjacentNavigationTarget(assignmentRecord, 1, isDelete);
    }

    navigateNext(keyEvent) {
        const
            me             = this,
            { target }     = keyEvent,
            nextAssignment = target.closest(me.navigableEventSelector) && me.getNext(me.normalizeTarget(keyEvent));

        if (nextAssignment) {
            keyEvent.preventDefault();
            if (!keyEvent.ctrlKey) {
                me.clearEventSelection();
            }
            return me.navigateTo(nextAssignment, {
                uiEvent : keyEvent
            });
        }
        if (me.isVertical && target.closest('.b-resource-header-cell')) {
            const
                resource       = me.resolveResourceRecord(target),
                nextAssignment = me.getNavigationTarget(me.getNavigationItems(resource, { visibleDateRange : me.visibleDateRange })[0], resource);

            // Try to navigate to the first event in the resource
            if (nextAssignment) {
                return me.navigateTo(nextAssignment, {
                    uiEvent : keyEvent
                });
            }
            // Otherwise, just go into the single, big cell
            return me.navigateDown();
        }
        else {
            // No next event/task, fall back to Grid's handling of this gesture
            keyEvent.handled = false;
            return me.doGridNavigation(keyEvent);
        }
    }

    doGridNavigation(keyEvent) {
        if (!keyEvent.handled && keyEvent.key.indexOf('Arrow') === 0) {
            this[`navigate${keyEvent.key.substring(5)}ByKey`]?.(keyEvent);
        }
    }

    async navigateTo(targetAssignment, {
        scrollIntoView = true,
        uiEvent        = {},
        silent         = false
    } = emptyObject) {
        const
            me                      = this,
            { navigator }           = me,
            { skipScrollIntoView }  = navigator;

        // Something without an assignment, handled by the feature that made it navigable
        if (targetAssignment?.isNavigationTarget) {
            return me.navigateToItem(targetAssignment, { scrollIntoView, uiEvent, silent });
        }

        if (targetAssignment) {
            if (scrollIntoView) {
                // No key processing during scroll
                navigator.disabled = true;

                await me.scrollAssignmentIntoView(targetAssignment, {
                    extendTimeAxis : me.infiniteScroll,
                    ...animate100
                });
                navigator.disabled = false;
            }
            else {
                navigator.skipScrollIntoView = true;
            }

            // Panel can be destroyed before promise is resolved
            // Perform a sanity check to make sure element is still in the DOM (syncIdMap actually).
            if (!me.isDestroyed && this.getElementFromAssignmentRecord(targetAssignment)) {
                me.activeAssignment = targetAssignment;
                navigator.skipScrollIntoView = skipScrollIntoView;

                // Silent navigations (internal focus management, not user-initiated)
                // skip the navigate event entirely, no selection change, no listeners
                if (!silent) {
                    navigator.trigger('navigate', {
                        event : uiEvent,
                        item  : me.getElementFromAssignmentRecord(targetAssignment).closest(navigator.itemSelector)
                    });
                }
            }
        }
    }

    set activeAssignment(assignmentRecord) {
        const assignmentEl = this.getElementFromAssignmentRecord(assignmentRecord, true);

        if (assignmentEl) {
            this.navigator.activeItem = assignmentEl;
        }
    }

    get activeAssignment() {
        const { activeItem } = this.navigator;

        if (activeItem) {
            return this.resolveAssignmentRecord(activeItem);
        }
    }

    get previousActiveEvent() {
        const { previousActiveItem } = this.navigator;

        if (previousActiveItem) {
            return this.resolveEventRecord(previousActiveItem);
        }
    }

    processEvent(keyEvent) {
        const
            me           = this,
            eventElement = keyEvent.target.closest(me.navigableEventSelector);

        if (eventElement) {
            keyEvent.assignmentRecord = me.resolveAssignmentRecord(eventElement);
            keyEvent.eventRecord = me.resolveEventRecord(eventElement);
            keyEvent.resourceRecord = me.resolveResourceRecord(eventElement);

            // Something else navigable, rendered by a feature
            if (!keyEvent.assignmentRecord) {
                keyEvent.navigationTarget = me.resolveNavigationTarget(eventElement);
            }
        }

        return keyEvent;
    }

    onTab(event) {
        // Attempt to navigate to the next event
        if (event.target.closest(this.navigableEventSelector)) {
            this.navigateNext(this.processEvent(event));
        }
        // If the navigate did not succeed, let the grid handle the tab
        if (!event.defaultPrevented) {
            super.onTab(event);
        }
    }

    onShiftTab(event) {
        // Attempt to navigate to the previous event
        if (event.target.closest(this.navigableEventSelector)) {
            this.navigatePrevious(this.processEvent(event));
        }
        // If the navigate did not succeed, let the grid handle the tab
        if (!event.defaultPrevented) {
            super.onShiftTab(event);
        }
    }

    onDeleteKey(keyEvent) {
        const me = this;
        if (!me.readOnly && me.enableDeleteKey) {
            const records = me.eventStore.usesSingleAssignment ? me.selectedEvents : me.selectedAssignments;
            // Here we could be attempting to delete either an Event or an Assignment. For assignments, check readOnly
            // flag of its Event as well
            me.removeEvents(records.filter(record => !record.readOnly && !record.event?.readOnly));
        }
    }

    onArrowUpKey(keyEvent) {
        // No guard needed for Up: navigation naturally no-ops at the top row (unlike Down, which guards below).
        this.navigateToClosestInAdjacentRow(-1);
        keyEvent.handled = true;
    }

    onArrowDownKey(keyEvent) {
        // Stacked-navigation guard: allow Down when there is a row below to cross into, or when an event is
        // stacked below the focused one on the current resource (stacked siblings are stepped through first).
        const
            me              = this,
            { focusedCell } = me,
            fromAssignment  = me.isHorizontal && focusedCell.target && me.resolveAssignmentRecord(focusedCell.target);

        if (focusedCell.rowIndex < me.navigationRowStore.count - 1 ||
            (fromAssignment && me.getStackedAssignment(fromAssignment, 1))) {
            me.navigateToClosestInAdjacentRow(1);
            keyEvent.handled = true;
        }
    }

    /**
     * Vertical band position (layout `top`, in px) of an assignment's event, used to order stacked events in a
     * resource. Reliable when laid out; off-viewport siblings may share a `top`, degrading to horizontal proximity.
     * @param {Scheduler.model.AssignmentModel} assignmentRecord The assignment to measure.
     * @returns {Number|null} The vertical band coordinate, or `null` if the event has no layout box.
     * @internal
     */
    getAssignmentVerticalCoordinate(assignmentRecord) {
        // The third arg (`includeOutside`) keeps events whose span falls outside the time axis, so off-viewport
        // siblings still yield a box.
        return this.getResourceEventBox(assignmentRecord.event, this.getAssignmentRow(assignmentRecord), true)?.top ?? null;
    }

    /**
     * Finds the assignment **on the same resource** in the adjacent vertical band in the travel direction (next event
     * below for Down, above for Up), nearest along the time axis — so Up/Down walks stacked events before crossing rows.
     * @param {Scheduler.model.AssignmentModel} fromAssignment The currently focused assignment.
     * @param {Number} rowOffset `-1` for Up, `1` for Down.
     * @returns {Scheduler.model.AssignmentModel|null} The stacked sibling to move to, or `null` if there is
     * no further stacked event in that direction on the same resource.
     * @internal
     */
    getStackedAssignment(fromAssignment, rowOffset) {
        const
            me                              = this,
            { assignmentStore, eventStore } = me,
            fromTop                         = me.getAssignmentVerticalCoordinate(fromAssignment),
            fromX                           = me.getAssignmentCenterCoordinate(fromAssignment);

        if (fromTop == null) {
            return null;
        }

        let bestAssignment = null,
            bestBandDelta  = Infinity,
            bestX          = Infinity;

        for (const assignmentRecord of me.getRowAssignments(me.getAssignmentRow(fromAssignment))) {
            // Skip self, assignments of events that are not loaded and any assignment/event hidden by a store filter
            // (matches getClosestAssignment).
            if (assignmentRecord === fromAssignment || !assignmentRecord.event ||
                assignmentStore.isFilteredOut(assignmentRecord) ||
                eventStore.isFilteredOut(assignmentRecord.event)) {
                continue;
            }

            const top = me.getAssignmentVerticalCoordinate(assignmentRecord);

            // Only consider events in a band strictly in the direction of travel (below for Down, above for Up).
            if (top == null || (rowOffset > 0 ? top <= fromTop : top >= fromTop)) {
                continue;
            }

            const
                bandDelta = Math.abs(top - fromTop),
                centerX   = me.getAssignmentCenterCoordinate(assignmentRecord),
                // Tie-break events in the same band by horizontal proximity to the source.
                deltaX    = centerX == null ? Infinity : (fromX == null ? centerX : Math.abs(centerX - fromX));

            if (bandDelta < bestBandDelta || (bandDelta === bestBandDelta && deltaX < bestX)) {
                bestBandDelta  = bandDelta;
                bestX          = deltaX;
                bestAssignment = assignmentRecord;
            }
        }

        return bestAssignment;
    }

    /**
     * Moves focus to the event in the row `rowOffset` rows away whose time span is horizontally closest
     * to the currently focused event. When that event is scrolled out of view it is scrolled into view
     * and focused (the date-based proximity check does not require the target to be rendered); otherwise
     * the default cell-navigation path is used.
     *
     * Before crossing to the adjacent resource, events stacked vertically on the **current** resource are
     * stepped through first (see {@link #function-getStackedAssignment}), so Up/Down lands on the next
     * stacked event on the same resource when there is one.
     * @param {Number} rowOffset `-1` for the previous row (Up), `1` for the next row (Down).
     * @private
     */
    navigateToClosestInAdjacentRow(rowOffset) {
        const
            me                = this,
            { focusedCell }   = me,
            fromTarget        = me.isHorizontal && focusedCell.target,
            fromAssignment    = fromTarget && me.resolveAssignmentRecord(fromTarget),
            // See onArrowDownKey for why stacked siblings are preferred before crossing to the adjacent resource.
            stackedAssignment = fromAssignment && me.getStackedAssignment(fromAssignment, rowOffset);

        if (stackedAssignment) {
            const stackedElement = me.getElementFromAssignmentRecord(stackedAssignment, true);

            // Same-row navigation, so the cell location does not change; target the element directly when
            // rendered, otherwise scroll the out-of-view stacked event into view via navigateTo.
            if (stackedElement) {
                me.focusCell({
                    rowIndex : focusedCell.rowIndex,
                    column   : me.timeAxisColumn,
                    target   : stackedElement
                });
            }
            else {
                me.navigateTo(stackedAssignment, { uiEvent : me.navigationEvent });
            }
            return;
        }

        const
            destinationRow    = me.navigationRowStore.getAt(focusedCell.rowIndex + rowOffset),
            // Pass the travel direction so the entry band of the destination row (topmost for Down, bottommost
            // for Up) is preferred among time-intersecting candidates.
            closestAssignment = fromAssignment && destinationRow && me.getClosestAssignment(destinationRow, fromAssignment, rowOffset),
            // Resolved once here; reused below to avoid normalizeCellContext recomputing the O(N) scan + element lookup.
            closestElement    = closestAssignment && me.getElementFromAssignmentRecord(closestAssignment, true);

        // A closest assignment that is not currently rendered must be navigated to via navigateTo so it
        // gets scrolled into view; the cell-navigation path below can only target rendered sub-elements.
        if (closestAssignment && !closestElement) {
            me.navigateTo(closestAssignment, { uiEvent : me.navigationEvent });
            return;
        }

        me.focusCell(closestElement
            // Closest assignment already resolved and rendered: target its element directly. Passing an explicit
            // `target` makes normalizeCellContext skip recomputing getClosestAssignment/getElementFromAssignmentRecord.
            ? {
                rowIndex : focusedCell.rowIndex + rowOffset,
                column   : me.timeAxisColumn,
                target   : closestElement
            }
            // No closest assignment (e.g. off-axis source or empty destination row): let the default
            // `from`-based path in normalizeCellContext pick the leftmost event in the destination row.
            : {
                rowIndex : focusedCell.rowIndex + rowOffset,
                column   : me.timeAxisColumn,
                from     : focusedCell
            });
    }

    navigateLeft(keyEvent) {
        if (this.isVertical && this.activeAssignment) {
            const
                me = this,
                { activeAssignment, eventStore, resourceStore } = me,
                { resource } = activeAssignment,
                { startDate, endDate } = activeAssignment.event;

            // Try to get assignments in the previous stripe of this resource cell.
            let assignments = eventStore.getAssignmentsForResource(resource).filter(assignment => {
                if (!assignment.event || assignment === activeAssignment) {
                    return false;
                }
                const { startDate : s, endDate : e } = assignment.event;
                return me.dateHelper.intersectSpans(s, e, startDate, endDate) && s < startDate;
            });

            // If no assignments in the previous stripe, try to get assignments from the previous resource.
            if (!assignments.length) {
                for (let r = resourceStore.indexOf(resource) - 1; !assignments.length && r >= 0; r--) {
                    assignments = me.eventStore.getAssignmentsForResource(resourceStore.getAt(r)).filter(a => a.event);
                }
            }
            if (assignments.length) {
                return me.navigateTo(assignments.sort(sortAssignmentsDesc)[0], {
                    uiEvent : keyEvent
                });
            }
            return super.navigateLeft(keyEvent);
        }
        else {
            return super.navigateLeft(keyEvent);
        }
    }

    navigateRight(keyEvent) {
        if (this.isVertical && this.activeAssignment) {
            const
                me = this,
                { activeAssignment, eventStore, resourceStore } = me,
                { resource } = activeAssignment,
                { startDate, endDate } = activeAssignment.event;

            // Try to get assignments in the next stripe of this resource cell.
            let assignments = eventStore.getAssignmentsForResource(resource).filter(assignment => {
                if (!assignment.event || assignment === activeAssignment) {
                    return false;
                }
                const { startDate : s, endDate : e } = assignment.event;
                return me.dateHelper.intersectSpans(s, e, startDate, endDate) && s >= startDate;
            });

            // If no assignments in the next stripe, try to get assignments from the next resource.
            if (!assignments.length) {
                for (let r = resourceStore.indexOf(resource) + 1; !assignments.length && r < resourceStore.count; r++) {
                    assignments = this.eventStore.getAssignmentsForResource(resourceStore.getAt(r)).filter(a => a.event);
                }
            }
            if (assignments.length) {
                return me.navigateTo(assignments.sort(sortAssignmentsAsc)[0], {
                    uiEvent : keyEvent
                });
            }
            return super.navigateRight(keyEvent);
        }
        else {
            return super.navigateRight(keyEvent);
        }
    }

    onEscapeKey(keyEvent) {
        if (!keyEvent.target.closest('.b-dragging')) {
            this.focusCell({
                rowIndex : this.focusedCell.rowIndex,
                column   : this.timeAxisColumn
            }, {
                disableActionable : true,
                scroll            : false
            });
            keyEvent.handled = true;
        }
    }

    onEventSpaceKey(keyEvent) {
        // Empty, to be chained by features
    }

    onEventEnterKey(keyEvent) {
        // Empty, to be chained by features
    }

    get isActionableLocation() {
        // Override from grid if the Navigator's location is an event (or task if we're in Gantt)
        // Being focused on a task/event means that it's *not* actionable. It's not valid to report
        // that we're "inside" the cell in a TimeLine, so ESC must not attempt to focus the cell.
        if (!this.navigator.activeItem) {
            return super.isActionableLocation;
        }
    }

    onNavigate({ item }) {
        const
            eventRecord = item && this.resolveEventRecord(item),
            // Event bars are named declaratively at render time, per assignment. Other focusables pushed through the
            // event render path, such as ResourceTimeRanges, are not, so they are still named here when focused
            ariaLabel   = eventRecord && !eventRecord.isEvent && this.getEventAriaLabel?.(eventRecord, {});

        if (ariaLabel) {
            item.setAttribute('aria-label', ariaLabel);
        }
    }

    /**
     * Internal utility function to remove events. Used when pressing <kbd>Delete</kbd> or <kbd>Backspace</kbd> or when
     * clicking the delete button in the event editor. Triggers a preventable `beforeEventDelete` or
     * `beforeAssignmentDelete` event.
     *
     * On tiers above Community, overridden by `RecurringEvents.removeEvents()`
     *
     * @param {Scheduler.model.EventModel[]|Scheduler.model.AssignmentModel[]} eventRecords Records to remove
     * @param {Function} [callback] Optional callback executed after triggering the event but before deletion
     * @returns {Boolean} Returns `false` if the operation was prevented, otherwise `true`
     * @internal
     * @fires beforeEventDelete
     * @fires beforeAssignmentDelete
     * @async
     */
    async removeEvents(eventRecords, callback = null, ...args) {
        const me = this;

        if (super.removeEvents) {
            return super.removeEvents(eventRecords, callback, ...args);
        }

        if (!me.readOnly && eventRecords.length) {
            const context = {
                finalize(removeRecord = true) {
                    if (callback) {
                        callback(removeRecord);
                    }

                    if (removeRecord !== false) {
                        const store = eventRecords[0].isAssignment ? me.assignmentStore : me.eventStore;

                        store.remove(eventRecords);
                    }
                }
            };

            let shouldFinalize;

            if (eventRecords[0].isAssignment) {
                /**
                 * Fires before an assignment is removed. Can be triggered by user pressing <kbd>Delete</kbd> or
                 * <kbd>Backspace</kbd> or by the event editor. Can for example be used to display a custom dialog to
                 * confirm deletion, in which case records should be "manually" removed after confirmation.
                 *
                 * Note that the handler must be `async` to be able to `await` the confirmation dialog and must return
                 * `false` to immediately veto the removal.
                 *
                 * ```javascript
                 * scheduler.on({
                 *     async beforeAssignmentDelete() {
                 *         const result = await MessageDialog.confirm({
                 *             title   : 'Please confirm',
                 *             message : 'Do you want to delete this assignment?'
                 *         });
                 *         // Return false to prevent default onward processing if user does not confirm
                 *         return (result === MessageDialog.yesButton);
                 *     }
                 * });
                 * ```
                 *
                 * @event beforeAssignmentDelete
                 * @param {Scheduler.view.Scheduler} source  The Scheduler instance
                 * @param {Scheduler.model.AssignmentModel[]} assignmentRecords  The assignment records about to be
                 *      deleted
                 * @param {Object} context  Additional removal context. This allows you to process the deletion by
                 * calling `context.finalize()` if you return `false` from the event handler.
                 * @param {Function} context.finalize  Function to call to finalize the removal.
                 *      Used to asynchronously decide to remove the records or not. Provide `false` to the function to
                 *      prevent the removal.
                 * @param {Boolean} [context.finalize.removeRecords = true]   Provide `false` to the function to prevent
                 *      the removal.
                 * @preventable
                 * @async
                 */
                shouldFinalize = await me.trigger('beforeAssignmentDelete', { assignmentRecords : eventRecords, context });
            }
            else {
                /**
                 * Fires before an event is removed. Can be triggered by user pressing <kbd>Delete</kbd> or
                 * <kbd>Backspace</kbd> or by the event editor. Return `false` to immediately veto the removal (or a
                 * `Promise` yielding `true` or `false` for async vetoing).
                 *
                 * Can for example be used to display a custom dialog to confirm deletion, in which case
                 * records should be "manually" removed after confirmation:
                 *
                 * ```javascript
                 * scheduler.on({
                 *     async beforeEventDelete() {
                 *         const result = await MessageDialog.confirm({
                 *             title   : 'Please confirm',
                 *             message : 'Do you want to delete this task?'
                 *         });
                 *         // Return false to prevent default onward processing if user does not confirm
                 *         return (result === MessageDialog.yesButton);
                 *     }
                 * });
                 * ```
                 *
                 * @event beforeEventDelete
                 * @param {Scheduler.view.Scheduler} source The Scheduler instance
                 * @ts-param source {Scheduler.view.Scheduler|any}
                 * @param {Scheduler.model.EventModel[]} eventRecords  The records about to be deleted
                 * @param {Object} context  Additional removal context. This allows you to process the deletion by
                 * calling `context.finalize()` if you return `false` from the event handler.
                 * @param {Function} context.finalize  Function to call to finalize the removal.
                 *      Used to asynchronously decide to remove the records or not. Provide `false` to the function to
                 *      prevent the removal.
                 * @param {Boolean} [context.finalize.removeRecords = true]  Provide `false` to the function to prevent
                 *      the removal.
                 * @preventable
                 * @async
                 */
                shouldFinalize = await me.trigger('beforeEventDelete', { eventRecords, context });
            }

            if (shouldFinalize !== false) {
                context.finalize(true);
                return true;
            }
        }

        return false;
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
