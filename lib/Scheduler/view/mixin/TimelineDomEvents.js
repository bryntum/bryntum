import Base from '../../../Core/Base.js';
import BrowserHelper from '../../../Core/helper/BrowserHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import StringHelper from '../../../Core/helper/StringHelper.js';
import EventHelper from '../../../Core/helper/EventHelper.js';
import DomDataStore from '../../../Core/data/DomDataStore.js';
import GlobalEvents from '../../../Core/GlobalEvents.js';
import TimelineContext from '../../util/TimelineContext.js';

/**
 * @module Scheduler/view/mixin/TimelineDomEvents
 */

const { eventNameMap } = EventHelper;

/**
 * Mixin that handles dom events (click etc) for scheduler and rendered events. Provides the base event
 * processing pipeline that identifies which schedule element was interacted with and fires corresponding
 * component events.
 *
 * ## See also
 *
 * - {@link Scheduler.view.mixin.SchedulerDomEvents} - Scheduler DOM events
 * - {@link Scheduler.view.TimelineBase} - Timeline base class
 *
 * @mixin
 */
export default Target => class TimelineDomEvents extends (Target || Base) {
    /**
     * Fires after a click on a time axis cell
     * @event timeAxisHeaderClick
     * @param {Scheduler.column.TimeAxisColumn|Scheduler.column.VerticalTimeAxisColumn} source The column object
     * @param {Date} startDate The start date of the header cell
     * @param {Date} endDate The end date of the header cell
     * @param {Event} event The event object
     */

    /**
     * Fires after a double click on a time axis cell
     * @event timeAxisHeaderDblClick
     * @param {Scheduler.column.TimeAxisColumn|Scheduler.column.VerticalTimeAxisColumn} source The column object
     * @param {Date} startDate The start date of the header cell
     * @param {Date} endDate The end date of the header cell
     * @param {Event} event The event object
     */

    /**
     * Fires after a right click on a time axis cell
     * @event timeAxisHeaderContextMenu
     * @param {Scheduler.column.TimeAxisColumn|Scheduler.column.VerticalTimeAxisColumn} source The column object
     * @param {Date} startDate The start date of the header cell
     * @param {Date} endDate The end date of the header cell
     * @param {Event} event The event object
     */

    static $name = 'TimelineDomEvents';

    //region Default config

    static configurable = {
        timelineContextClass : TimelineContext,

        /**
         * The currently hovered timeline context. This is updated as the mouse or pointer moves over the timeline.
         * @member {Scheduler.util.TimelineContext} timelineContext
         * @readonly
         * @category Dates
         */
        timelineContext : {
            $config : {
                // Reject non-changes so that when set from scheduleMouseMove and EventMouseMove,
                // we only update the context and fire events when it changes.
                equal(c1, c2) {
                    // index is the resource index, tickParentIndex is the
                    // tick's index in the TimeAxis.
                    return c1?.index === c2?.index &&
                        c1?.tickParentIndex === c2?.tickParentIndex &&
                        !((c1?.tickStartDate || 0) - (c2?.tickStartDate || 0)) &&
                        c1?.eventRecord === c2?.eventRecord;
                }
            }
        },

        updateTimelineContextOnScroll : false,

        /**
         * Set to `true` to ignore reacting to DOM events (mouseover/mouseout etc) while scrolling. Useful if you
         * want to maximize scroll performance.
         * @config {Boolean}
         * @default false
         */
        ignoreDomEventsWhileScrolling : null,

        keyMap : {
            // Keystrokes which do not originate in a scheduler cell or in the scheduler canvas
            // or inside the SchedulerContext element should not be processed by the scheduler's KeyMap
            // because features expect there to be a `focusedCell` or an `activeEvent`.
            // Note that the GridElementEvents mixin has a smaller target selector set,
            // which includes only the grid cells and headers/footers.
            targetSelector : '.b-grid-cell,.b-grid-header,.b-grid-footer,.b-sch-canvas,.b-schedule-context-canvas'
        }
    };

    static properties = {
        schedulerEvents : {
            pointermove : 'handleScheduleEvent',
            mouseover   : 'handleScheduleEvent',
            mousedown   : 'handleScheduleEvent',
            mouseup     : 'handleScheduleEvent',
            click       : 'handleScheduleEvent',
            dblclick    : 'handleScheduleEvent',
            contextmenu : 'handleScheduleEvent',
            mousemove   : 'handleScheduleEvent',
            mouseout    : 'handleScheduleEvent'
        }
    };

    static delayable = {
        // Allow the scroll event to complete in its thread, and dispatch the mousemove event next AF
        onScheduleScroll : 'raf'
    };

    // Flipped to true by handleScheduleEvent on the first mousemove inside the sub-grid, which
    // is when the `onFirstMouseMove` template method fires. Declared here so the lifecycle is
    // visible at a glance alongside the other instance state.
    _hasSeenMouseMove = false;

    //endregion

    //region Init

    construct(...args) {
        // Currently hovered events (can be parent + child)
        this.hoveredEvents = new Set();

        super.construct(...args);
    }

    /**
     * Adds listeners for DOM events for the scheduler and its events.
     * Which events is specified in Scheduler#schedulerEvents.
     * @private
     */
    initDomEvents() {
        const
            me = this,
            { schedulerEvents }  = me;

        // Set thisObj and element of the configured listener specs.
        schedulerEvents.element = me.timeAxisSubGridElement;
        schedulerEvents.thisObj = me;
        EventHelper.on(schedulerEvents);
        EventHelper.on({
            element    : me.timeAxisSubGridElement,
            mouseleave : 'handleScheduleLeaveEvent',
            capture    : true,
            thisObj    : me
        });

        // This is to handle scroll events while the mouse is over the schedule.
        // For example magic mouse or touchpad scrolls, or scrolls caused by keyboard
        // navigation while the mouse happens to be over the schedule.
        // The context must update. We must consider any scroll because the document
        // or some other wrapping element could be scrolling the Scheduler under the mouse.
        if (me.updateTimelineContextOnScroll && BrowserHelper.supportsPointerEventConstructor) {
            EventHelper.on({
                element : document,
                scroll  : 'onScheduleScroll',
                capture : true,
                thisObj : me
            });
        }
    }

    //endregion

    //region Event handling
    getTimeSpanMouseEventParams(eventElement, event) {
        throw new Error('Implement in subclass');
    }

    getScheduleMouseEventParams(cellData, event) {
        throw new Error('Implement in subclass');
    }

    /**
     * Wraps dom Events for the scheduler and event bars and fires as our events.
     * For example click -> scheduleClick or eventClick
     * @private
     * @param {Object} event Event object
     */
    handleScheduleEvent(event) {
        const me = this;

        if (me.ignoreDomEventsWhileScrolling && (me.scrolling || me.timeAxisSubGrid.scrolling)) {
            return;
        }

        // Template method hook — called once on the first mousemove inside the schedule.
        // Features (plugins) can chain into this via `pluginConfig.after = ['onFirstMouseMove']`
        // to defer expensive setup until the user actually interacts with the timeline.
        if (event.type === 'mousemove' && !me._hasSeenMouseMove) {
            me._hasSeenMouseMove = true;
            me.onFirstMouseMove(event);
        }

        const timelineContext = me.getTimelineEventContext(event);

        // Cache the last pointer event so that when scrolling below the mouse
        // we can inject mousemove events at that point.
        me.lastPointerEvent = event;

        // We are over the schedule region
        if (timelineContext) {
            // Only fire a scheduleXXXX event if we are *not* over an event.
            // If over an event fire (event|task)XXXX.
            me.trigger(`${timelineContext.eventElement ? me.scheduledEventName : 'schedule'}${eventNameMap[timelineContext.domEvent.type] || StringHelper.capitalize(timelineContext.domEvent.type)}`, timelineContext);
        }

        // If the context has changed, updateTimelineContext will fire events
        me.timelineContext = timelineContext;
    }

    /**
     * Template method called once on the very first mousemove inside the time axis sub-grid.
     * Features can chain into this via `pluginConfig.after = ['onFirstMouseMove']` to defer
     * expensive setup (DOM creation, listener wiring) until the user actually interacts with
     * the timeline.
     * @param {Event} event The mousemove DOM event
     * @protected
     */
    onFirstMouseMove(event) {}

    handleScheduleLeaveEvent(event) {
        if (event.target === this.timeAxisSubGridElement) {
            this.handleScheduleEvent(event);
        }
    }

    /**
     * This handles the scheduler being scrolled below the mouse by trackpad or keyboard events.
     * The context, if present needs to be recalculated.
     * @private
     */
    onScheduleScroll({ target }) {
        const me = this;

        // If the latest mouse event resulted in setting a context, we need to reproduce that event at the same clientX,
        // clientY in order to keep the context up to date while scrolling.
        // If the scroll is because of a pan feature drag (on us or a partner), we must not do this.
        // Target might be removed in salesforce by Locker Service if scroll event occurs on body.
        // Partner might not be resolved yet when using string mapping (happens in Safari)
        // The handler is rAF buffered, so bodyElement may be gone by the time a queued scroll is processed.
        if (
            target && me.updateTimelineContextOnScroll && !me.features.pan?.isActive &&
            !me.partners.some(p => typeof p !== 'string' && p.features.pan?.isActive) &&
            (target.contains(me.element) || me.bodyElement?.contains(target))
        ) {
            const { timelineContext, lastPointerEvent } = me;

            if (timelineContext) {
                const
                    targetElement = DomHelper.elementFromPoint(timelineContext.domEvent.clientX, timelineContext.domEvent.clientY),
                    pointerEvent  = new BrowserHelper.PointerEventConstructor('pointermove', lastPointerEvent),
                    mouseEvent    = new MouseEvent('mousemove', lastPointerEvent);

                // See https://github.com/bryntum/bryntum/issues/6274
                // The pointerId does not propagate correctly on the synthetic PointerEvent, but also is readonly, so
                // redefine the property. This is required by Ext JS gesture publisher which tracks pointer movements
                // while a pointer is down. Without the correct pointerId, Ext JS would see this move as a "missed"
                // pointerdown and forever await its pointerup (i.e., it would get stuck in the activeTouches). This
                // would cause all future events to be perceived as part of or the end of a drag and would never again
                // dispatch pointer events correctly. Finally, lastPointerEvent.pointerId is often incorrect (undefined
                // in fact), so check the most recent pointerdown/touchstart event and default to 1
                Object.defineProperty(pointerEvent, 'pointerId', {
                    value : GlobalEvents.currentPointerDown?.pointerId ?? GlobalEvents.currentTouch?.identifier ?? 1
                });

                // Drag code should ignore these synthetic events
                pointerEvent.scrollInitiated = mouseEvent.scrollInitiated = true;

                // Emulate the correct browser sequence for mouse move events
                targetElement?.dispatchEvent(pointerEvent);
                targetElement?.dispatchEvent(mouseEvent);
            }
        }
    }

    updateTimelineContext(context, oldContext) {
        /**
         * Fired when the pointer-activated {@link #property-timelineContext} has changed.
         * @event timelineContextChange
         * @param {Scheduler.util.TimelineContext} oldContext The tick/resource context being deactivated.
         * @param {Scheduler.util.TimelineContext} context The tick/resource context being activated.
         */
        this.trigger('timelineContextChange', { oldContext, context });

        if (context && !oldContext) {
            this.trigger('scheduleMouseEnter', context);
        }
        else if (!context) {
            this.trigger('scheduleMouseLeave', { event : oldContext.event });
        }
    }

    buildTimelineContext(config) {
        if (config && !config.isTimelineContext) {
            const { domEvent } = config;

            if (domEvent && !config.time) {
                const time = this.getDateFromDomEvent(domEvent);

                if (!time) {
                    return;
                }

                config.time = time;
            }

            config = new this.timelineContextClass(this.constructor.mergeConfigs(config, { scheduler : this }));
        }

        return config;
    }

    /**
     * Gathers contextual information about the schedule contextual position of the passed event.
     *
     * Used by schedule mouse event handlers, but also by the scheduleContext feature.
     * @param {Event} domEvent The DOM event to gather context for.
     * @returns {Scheduler.util.TimelineContext} the schedule DOM event context
     * @internal
     */
    getTimelineEventContext(domEvent) {
        const
            me                  = this,
            { scheduleContext } = me.features;

        // We are over the ScheduleContext element, or a descendant widget
        if (scheduleContext) {
            const
                { context } = scheduleContext,
                { type }    = domEvent,
                t           = type.endsWith('leave') || type.endsWith('out') ? domEvent.relatedTarget : domEvent.target;

            if (context && (scheduleContext.widget?.owns(t) || scheduleContext.element.contains(t))) {
                // Look "through" the context element to find any event bar the pointer is over
                scheduleContext.element.style.pointerEvents = 'none';
                context.eventElement = document.elementFromPoint(domEvent.clientX, domEvent.clientY)?.closest(me.eventSelector);
                context.eventRecord = me.resolveEventRecord(context.eventElement);
                scheduleContext.element.style.pointerEvents = '';

                // Ensure the config system ingests this value so that a contextChange event fires
                // so that context disappears if activateOnEvent is false.
                me._timelineContext = null;
                return context;
            }
        }

        const
            eventElement = domEvent.target.closest(me.eventInnerSelector),
            cellElement  = me.getCellElementFromDomEvent(domEvent);

        if (cellElement) {
            const time = me.getDateFromDomEvent(domEvent);

            if (!time) {
                return;
            }

            const
                cellData    = DomDataStore.get(cellElement),
                mouseParams = eventElement ? me.getTimeSpanMouseEventParams(eventElement, domEvent) : me.getScheduleMouseEventParams(cellData, domEvent);

            if (!mouseParams) {
                return;
            }

            const
                index = me.isVertical ? me.resourceStore.allResourceRecords.indexOf(mouseParams.resourceRecord)
                    : cellData.row.dataIndex,
                result = me.buildTimelineContext({
                    domEvent,
                    eventElement,
                    cellElement,
                    index,
                    time,
                    row : cellData.row,
                    ...mouseParams
                });

            if (result.tick) {
                return result;
            }
        }
    }

    getCellElementFromDomEvent({ target, clientY, type }) {
        const
            me           = this,
            {
                isVertical,
                foregroundCanvas
            }            = me,
            eventElement = target.closest(me.eventSelector);

        // In vertical mode, there is only one cell, so just return that
        if (isVertical) {
            return me.timeAxisSubGridElement.querySelector(me.timeCellSelector);
        }

        // If event was on an event bar, calculate the cell.
        if (eventElement) {
            const record = me.resolveRowRecord(eventElement) || me.store.getAt(me.rowManager.getRowAt(clientY, false)?.dataIndex);

            // A stale bar whose resource is gone and has no row beneath it has no schedule context
            return record ? me.getCell({ record, column : me.timeAxisColumn }) : null;
        }

        // If event was triggered by an element in the foreground canvas, but not an event element
        // we need to ascertain the cell "behind" that element to be able to create the context.
        if (foregroundCanvas.contains(target)) {
            // Only trigger a Scheduler event if the event was on the background itself.
            // Otherwise, we will trigger unexpected events on things like dependency lines which historically
            // have never triggered scheduleXXXX events. The exception to this is the mousemove event which
            // needs to always fire so that timelineContext and scheduleTooltip correctly track the mouse
            if (target === foregroundCanvas || target.closest('.b-sch-resource-time-range') || type === 'mousemove') {
                return me.rowManager.getRowAt(clientY, false)?.getCell(me.timeAxisColumn.id);
            }
        }

        // Event was inside a row, or on a row border.
        return target.matches('.b-grid-row') ? target.firstElementChild : target.closest(me.timeCellSelector);
    }

    // Overridden by ResourceTimeRanges to "pass events through" to the schedule
    matchScheduleCell(element) {
        return element.closest(this.timeCellSelector);
    }

    onElementMouseButtonEvent(event) {
        const targetCell = event.target.closest('.b-sch-header-time-axis-cell');
        if (targetCell) {
            const
                me           = this,
                position     = targetCell.parentElement.dataset.headerPosition,
                headerCells  = me.timeAxisViewModel.columnConfig[position],
                index        = me.timeAxis.isFiltered ? headerCells.findIndex(cell => cell.index == targetCell.dataset.tickIndex) : targetCell.dataset.tickIndex,
                cellConfig   = headerCells[index],
                contextMenu  = me.features.contextMenu;

            // Skip same events with Grid context menu triggerEvent
            if (!contextMenu || event.type !== contextMenu.triggerEvent) {
                this.trigger(`timeAxisHeader${StringHelper.capitalize(event.type)}`, {
                    startDate : cellConfig.start,
                    endDate   : cellConfig.end,
                    event
                });
            }
        }
    }

    onElementMouseDown(event) {
        this.onElementMouseButtonEvent(event);
        super.onElementMouseDown(event);
    }

    onElementClick(event) {
        this.onElementMouseButtonEvent(event);
        super.onElementClick(event);
    }

    onElementDblClick(event) {
        this.onElementMouseButtonEvent(event);
        super.onElementDblClick(event);
    }

    onElementContextMenu(event) {
        this.onElementMouseButtonEvent(event);
        super.onElementContextMenu(event);
    }

    /**
     * Relays mouseover events as eventmouseenter if over rendered event.
     * Also adds Scheduler#overScheduledEventClass to the hovered element.
     * @private
     */
    onElementMouseOver(event) {
        const
            me                = this;

        if (me.ignoreDomEventsWhileScrolling && (me.scrolling || me.timeAxisSubGrid.scrolling)) {
            return;
        }

        super.onElementMouseOver(event);

        const
            { target }        = event,
            { hoveredEvents } = me;

        // We must be over the event or dependency terminal hover area
        if ((target.closest(me.eventInnerSelector) || target.matches('.b-sch-terminal-hover-area')) && !me.features.eventDrag?.isDragging) {
            const eventElement = target.closest(me.eventSelector);

            if (!hoveredEvents.has(eventElement) && !me.preventOverCls) {
                hoveredEvents.add(eventElement);
                eventElement.classList.add(me.overScheduledEventClass);
                eventElement.classList.remove('b-unhover');

                const params = me.getTimeSpanMouseEventParams(eventElement, event);
                if (params) {
                    // do not fire this event if model cannot be found
                    // this can be the case for "b-sch-dragcreator-proxy" elements for example
                    me.trigger(`${me.scheduledEventName}MouseEnter`, params);
                }
            }
        }
        else if (hoveredEvents.size) {
            me.unhoverAll(event);
        }
    }

    /**
     * Relays mouseout events as eventmouseleave if out from rendered event.
     * Also removes Scheduler#overScheduledEventClass from the hovered element.
     * @private
     */
    onElementMouseOut(event) {
        const
            me                        = this,
            { features }              = me,
            { target, relatedTarget } = event;

        // If it's not a mouseout into an event (or anything inside one of the schedule's
        // extra drawing canvases), continue up to the Grid base.
        // A mouseout cell->(event|dep-line|timeRange) should *not* trigger a mouseout of the cell
        // or row even though the event element is in fact outside. To a user, the event is in the cell.
        if (!relatedTarget?.closest('.b-sch-canvas *')) {
            super.onElementMouseOut(event);
        }

        const
            eventWrap      = target.closest(me.eventSelector),
            eventInner     = eventWrap?.querySelector(me.eventInnerSelector),
            timeSpanRecord = eventWrap && me.resolveTimeSpanRecord(eventWrap);

        // We must be over the event bar
        // <remove-on-release>
        // TODO: this isDragging check should be done in the feature (all drag/resize features actually) and here we should have a hook call
        // </remove-on-release>
        if (eventInner && timeSpanRecord && me.hoveredEvents.has(eventWrap) && !features.eventDrag?.isDragging) {
            // out to child or terminal hover area shouldn't count...
            if (relatedTarget && (DomHelper.isDescendant(eventInner, relatedTarget) || relatedTarget.matches('.b-sch-terminal-hover-area'))) {
                return;
            }
        }

        if (eventWrap && me.hoveredEvents.size) {
            me.unhover(eventWrap, event);
        }
    }

    async unhover(element, event) {
        const
            me     = this,
            params = me.getTimeSpanMouseEventParams(element, event);

        if (params) {
            me.trigger(`${me.scheduledEventName}MouseLeave`, me.getTimeSpanMouseEventParams(element, event));
        }

        await me.executeAndAwaitAnimations(element, () => element.classList.remove(me.overScheduledEventClass), 'b-unhover');

        if (me.isDestroyed) {
            return;
        }

        me.hoveredEvents.delete(element);
    }

    unhoverAll(event) {
        for (const element of this.hoveredEvents) {
            !element.isReleased && !element.classList.contains('b-released') && this.unhover(element, event);
        }

        // Might not be empty because of conditional unhover above
        this.hoveredEvents.clear();
    }

    //endregion

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
