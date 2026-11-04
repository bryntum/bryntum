import SchedulerFeature from './SchedulerFeature.js';
import Draggable from '../../Core/mixin/Draggable.js';
import Droppable from '../../Core/mixin/Droppable.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import Tooltip from '../../Core/widget/Tooltip.js';
import ClockTemplate from '../tooltip/ClockTemplate.js';
import TimeSpan from '../model/TimeSpan.js';


DomHelper.loadStylesheet('Scheduler/feature/EventResize.css');

// import Stylesheet from './EventResize.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'EventResize');

/**
 * @module Scheduler/feature/EventResize
 */

const tipAlign = {
    top    : { align : 'b-t', offset : [-3, -3] },
    right  : { align : 'b100-t100', offset : [-3, -3] },
    bottom : { align : 't-b', offset : [-3, -3] },
    left   : { align : 'b0-t0',  offset : [-3, -3] }
};

/**
 * An object containing data related to event resize.
 * @typedef {Object} EventResizeData
 * @property {Scheduler.model.EventModel} eventRecord Event record being resized
 * @property {Date} startDate New startDate (changed if resizing start side)
 * @property {Date} endDate New endDate (changed if resizing end side)
 * @property {Date} originalStartDate Start date before resize
 * @property {Date} originalEndDate End date before resize
 * @property {HTMLElement} [element] The event element
 */

/**
 * Feature that allows resizing an event by dragging its end.
 *
 * By default, it displays a tooltip with the new start and end dates, formatted using
 * {@link Scheduler/view/mixin/TimelineViewPresets#config-displayDateFormat}.
 *
 * {@inlineexample Scheduler/feature/EventResize.js}
 *
 * ## Customizing the resize tooltip
 *
 * To show custom HTML in the tooltip, please see the {@link #config-tooltipTemplate} config. Example:
 *
 * ```javascript
 * eventResize : {
 *     // A minimal end date tooltip
 *     tooltipTemplate : ({ record, endDate }) => {
 *         return DateHelper.format(endDate, 'MMM D');
 *     }
 * }
 * ```
 *
 * This feature is **enabled** by default
 *
 * This feature is extended with a few overrides by the Gantt's `TaskResize` feature.
 *
 * This feature updates the event's `startDate` or `endDate` live in order to leverage the
 * rendering pathway to always yield a correct appearance. The changes are done in
 * {@link Core.data.Model#function-beginBatch batched} mode so that changes do not become
 * eligible for data synchronization or propagation until the operation is completed.
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #event-beforeEventResize}             | Fires before resize starts                          |
 * | {@link #event-eventResizeStart}              | Fires when resize begins                            |
 * | {@link #event-eventPartialResize}            | Fires continuously during resize                    |
 * | {@link #event-beforeEventResizeFinalize}     | Async finalizer before resize completes             |
 * | {@link #event-eventResizeEnd}                | Fires when resize ends                              |
 * | {@link #config-tooltipTemplate}              | Template for the resize tooltip                     |
 *
 * ## See also
 *
 * - {@link Scheduler.feature.EventDrag} - Drag to move events
 * - {@link Scheduler.feature.EventDragCreate} - Drag to create events
 *
 * @demo Scheduler/basic
 * @extends Scheduler/feature/SchedulerFeature
 * @classtype eventResize
 * @feature
 * @tier community
 */
export default class EventResize extends SchedulerFeature.mixin(
    Draggable,
    Droppable,

) {
    //region Events

    /**
     * Fired on the owning Scheduler before resizing starts. Return `false` to prevent the action.
     * @event beforeEventResize
     * @on-owner
     * @preventable
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Scheduler.model.EventModel} eventRecord Event record being resized
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record the resize starts within
     * @param {MouseEvent} event Browser event
     */

    /**
     * Fires on the owning Scheduler when event resizing starts
     * @event eventResizeStart
     * @on-owner
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Scheduler.model.EventModel} eventRecord Event record being resized
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record the resize starts within
     * @param {MouseEvent} event Browser event
     * @param {EventResizeData[]} resizeData Resize data for selected events. Only available when {@link #config-resizeSelected} is `true`
     */

    /**
     * Fires on the owning Scheduler on each resize move event
     * @event eventPartialResize
     * @on-owner
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Scheduler.model.EventModel} eventRecord Event record being resized
     * @param {Date} startDate
     * @param {Date} endDate
     * @param {HTMLElement} element
     * @param {EventResizeData[]} resizeData Resize data for selected events
     */

    /**
     * Fired on the owning Scheduler to allow implementer to prevent immediate finalization by returning a promise
     * in the listener, to show a confirmation popup etc
     *
     * ```javascript
     *  scheduler.on('beforeeventresizefinalize', event => {
     *      event.async = true;
     *      setTimeout(() => {
     *          // async code don't forget to call finalize
     *          event.finalize();
     *      }, 1000);
     *  })
     * ```
     *
     * @event beforeEventResizeFinalize
     * @on-owner
     * @async
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Object} context [DEPRECATED] de-nested to outer params object
     * @param {Scheduler.model.EventModel} eventRecord Event record being resized
     * @param {Date} startDate New startDate (changed if resizing start side)
     * @param {Date} endDate New endDate (changed if resizing end side)
     * @param {Date} originalStartDate Start date before resize
     * @param {Date} originalEndDate End date before resize
     * @param {Boolean} async Set true to handle resize asynchronously (e.g. to wait for user confirmation)
     * @param {Function} finalize Call this method to finalize resize. This method accepts one argument:
     *                   pass `true` to update records, or `false`, to ignore changes
     * @param {Event} event Browser event
     * @param {EventResizeData[]} resizeData Data of all events that are being resized
     */

    /**
     * Fires on the owning Scheduler after the resizing gesture has finished.
     * @event eventResizeEnd
     * @on-owner
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Boolean} changed Shows if the record has been changed by the resize action
     * @param {Scheduler.model.EventModel} eventRecord Event record being resized
     * @param {EventResizeData[]} resizeData Resize data for selected events
     */

    //endregion

    //region Config

    static $name = 'EventResize';

    static tier = 'community';

    static type = 'eventResize';

    static defaultEnabled = true;
    static configurable = {
        draggingItemCls : 'b-sch-event-wrap-resizing',

        resizingItemInnerCls : 'b-sch-event-resizing',

        /**
         * Use left handle when resizing. Only applies when owning client's direction is 'horizontal'
         * @config {Boolean}
         * @default
         */
        leftHandle : true,

        /**
         * Use right handle when resizing. Only applies when owning client's direction is 'horizontal'
         * @config {Boolean}
         * @default
         */
        rightHandle : true,

        /**
         * Use top handle when resizing. Only applies when owning client's direction is 'vertical'
         * @config {Boolean}
         * @default
         */
        topHandle : true,

        /**
         * Use bottom handle when resizing. Only applies when owning client's direction is 'vertical'
         * @config {Boolean}
         * @default
         */
        bottomHandle : true,

        /**
         * Automatically shrink virtual handles when available space < handleSize. The virtual handles will
         * decrease towards width/height 1, reserving space between opposite handles to for example leave room for
         * dragging. To configure reserved space, see {@link #config-reservedSpace}.
         * @config {Boolean}
         * @default false
         */
        dynamicHandleSize : true,

        /**
         * Set to `true` to allow resizing to a zero-duration span
         * @config {Boolean}
         * @default false
         */
        allowResizeToZero : null,

        /**
         * Room in px to leave unoccupied by handles when shrinking them dynamically (see
         * {@link #config-dynamicHandleSize}).
         * @config {Number}
         * @default
         */
        reservedSpace : 1,

        /**
         * The amount of pixels to move pointer/mouse before it counts as a drag operation.
         * @config {Number}
         * @default
         */
        dragThreshold : 0,

        /**
         * The amount of time (ms) to delay a touch-resize interaction.
         * @config {Number}
         * @default
         */
        dragTouchStartDelay : 300,

        draggingClsSelector : '.b-timeline-base',

        /**
         * `false` to not show a tooltip while resizing
         * @config {Boolean}
         * @default
         */
        showTooltip : true,

        /**
         * true to see exact event length during resizing
         * @config {Boolean}
         * @default
         */
        showExactResizePosition : false,

        /**
         * An empty function by default, but provided so that you can perform custom validation on
         * the item being resized. Return true if the new duration is valid, false to signal that it is not.
         * @param {Object} context The resize context, contains the record & dates.
         * @param {Scheduler.model.TimeSpan} context.record The record being resized.
         * @param {Date} context.startDate The new start date.
         * @param {Date} context.endDate The new end date.
         * @param {Date} context.originalStartDate Start date before resize
         * @param {Date} context.originalEndDate End date before resize
         * @param {Event} event The browser Event object
         * @returns {Boolean}
         * @config {Function}
         */
        validatorFn : () => true,

        /**
         * `this` reference for the validatorFn
         * @config {Object}
         */
        validatorFnThisObj : null,

        /**
         * Setting this property may change the configuration of the {@link #config-tip}, or
         * cause it to be destroyed if `null` is passed.
         *
         * Reading this property returns the Tooltip instance.
         * @member {Core.widget.Tooltip|TooltipConfig} tip
         */
        /**
         * If a tooltip is required to illustrate the resize, specify this as `true`, or a config
         * object for the {@link Core.widget.Tooltip}.
         * @config {Core.widget.Tooltip|TooltipConfig}
         */
        tip : {
            $config : ['lazy', 'nullify'],
            value   : {
                cls                      : 'b-sch-event-resize-tip',
                autoShow                 : false,
                axisLock                 : true,
                trackMouse               : false,
                updateContentOnMouseMove : true,
                applyMinWidth            : true,
                hideDelay                : 0
            }
        },

        /**
         * A template function returning the content to show during a resize operation.
         *
         * @config {Function} tooltipTemplate
         * @param {Object} context A context object
         * @param {Date} context.startDate New start date
         * @param {Date} context.endDate New end date
         * @param {Scheduler.model.TimeSpan} context.record The record being resized
         * @param {Boolean} context.valid Whether the current resize position is valid
         * @param {String} context.startClockHtml Predefined HTML to show the start time
         * @param {String} context.endClockHtml Predefined HTML to show the end time
         * @returns {String} String representing the HTML markup
         */
        tooltipTemplate : context => `
            <div class="b-sch-tip-${context.valid ? 'valid' : 'invalid'}">
                ${context.startClockHtml}
                ${context.endClockHtml}
                <div class="b-sch-tip-message">${context.message}</div>
            </div>
        `,

        ignoreSelector : '.b-sch-terminal',
        dragActiveCls  : 'b-resizing-event',

        /**
         * Locks the layout during drag resize, opt out to use the same rendering pathway for drag resize as for
         * already existing events (updating the layout of all events during the resize operation).
         *
         * Keeping this config enabled also leads to cheaper resizing, only the resized event's resources are
         * refreshed during the operation.
         *
         * For even cheaper resizing, configure it as `'minimal-updates'`. In this mode, only the resized event
         * is refreshed during the operation (not the other events assigned to the same resource).
         *
         * @config {Boolean|'minimal-updates'}
         */
        lockLayout : true,

        /**
         * Set to `false` to not resize all selected events simultaneously.
         *
         * Please note that {@link Scheduler/view/Scheduler#config-multiEventSelect} needs to be enabled for it to
         * work
         *
         * @config {Boolean}
         * @default
         */
        resizeSelected : true
    };

    static get pluginConfig() {
        return {
            after : ['render', 'onEventDataGenerated', 'isEventElementDraggable']
        };
    }

    //endregion

    //region Init & destroy

    doDestroy() {
        super.doDestroy();

        this.dragging?.destroy();
    }

    render() {
        const
            me         = this,
            { client } = me;

        // Only active when in these items. The :not(.b-sch-event-segment) exclusion lets the dedicated
        // EventSegmentResize feature (Enterprise tier) handle segments; the selector is a no-op when no segment
        // elements exist (Community/Business).
        me.dragSelector = me.dragItemSelector = `${client.eventSelector}:not(.b-sch-event-segment)`;

        // Set up elements and listeners
        me.dragRootElement = me.dropRootElement = client.timeAxisSubGridElement;

        // Drag only in time dimension
        me.dragLock = client.isVertical ? 'y' : 'x';
    }

    // Prevent event dragging when it happens over a resize handle
    isEventElementDraggable(eventElement, eventRecord, el, event) {
        const
            me             = this,
            eventResizable = eventRecord?.resizable;

        // ALLOW event drag:
        // - if resizing is disabled or event is not resizable
        // - if it's a milestone Milestones cannot be resized
        if (me.disabled || !eventResizable || eventRecord.isMilestone) {
            return true;
        }

        // not over the event handles
        return ((eventResizable !== true && eventResizable !== 'start') || !me.isOverStartHandle(event, eventElement)) &&
            ((eventResizable !== true && eventResizable !== 'end') || !me.isOverEndHandle(event, eventElement));
    }

    // Called for each event during render, allows manipulation of render data.
    onEventDataGenerated({ eventRecord, wrapperCls, cls }) {
        const context = this.dragging?.context;

        // if that's an event we are resizing - indicate it with corresponding CSS classes
        if (context?.eventContexts.some(ctx => ctx.eventRecord === eventRecord) && !context.updatingRecord) {
            const
                { edge }  = context,
                direction = { left : 'start', top : 'start' }[edge] || 'end';

            wrapperCls['b-active'] =
                wrapperCls[this.draggingItemCls] =
                wrapperCls['b-over-resize-handle'] =
                wrapperCls[`b-over-${direction}-handle`] =
                cls['b-resize-handle'] =
                cls[this.resizingItemInnerCls] = 1;
        }
    }

    // Sneak a first peek at the drag event to put necessary date values into the context
    onDragPointerMove(event) {
        const
            {
                client,
                dragging
            }          = this,
            {
                visibleDateRange,
                isHorizontal
            }          = client,
            rtl        = isHorizontal && client.rtl,
            dimension  = isHorizontal ? 'X' : 'Y',
            pageScroll = globalThis[`page${dimension}Offset`],
            coord      = event[`page${dimension}`] + (dragging.context?.offset || 0),
            clientRect = Rectangle.from(client.timeAxisSubGridElement, null, true),
            startCoord = clientRect.getStart(rtl, isHorizontal),
            endCoord   = clientRect.getEnd(rtl, isHorizontal);

        let date = client.getDateFromCoord({ coord, local : false });

        if (rtl) {
            // If we're dragging off the start side, fix at the visible startDate
            if (coord - pageScroll > startCoord) {
                date = visibleDateRange.startDate;
            }
            // If we're dragging off the end side, fix at the visible endDate
            else if (coord < endCoord) {
                date = visibleDateRange.endDate;
            }
        }
        // If we're dragging off the start side, fix at the visible startDate
        else if (coord - pageScroll < startCoord) {
            date = visibleDateRange.startDate;
        }
        // If we're dragging off the end side, fix at the visible endDate
        else if (coord - pageScroll > endCoord) {
            date = visibleDateRange.endDate;
        }

        dragging.clientStartCoord = startCoord;
        dragging.clientEndCoord = endCoord;
        dragging.date = date;

        super.onDragPointerMove(event);
    }

    /**
     * Returns true if a resize operation is active
     * @member {Boolean}
     * @readonly
     */
    get isResizing() {
        return Boolean(this.dragging);
    }

    /**
     * Returns true if resizing multiple events
     * @private
     * @member {Boolean}
     * @readonly
     */
    get isMultiResizing() {
        return this.isResizing && this.dragging?.context.eventContexts.length > 1;
    }

    beforeDrag(drag) {
        const
            me             = this,
            { client }     = me,
            eventRecord    = client.resolveTimeSpanRecord(drag.itemElement),
            resourceRecord = !client.isGanttBase && client.resolveResourceRecord(client.isVertical ? drag.startEvent : drag.itemElement);

        // Resolve the resize drag axis now (the current orientation is all that matters for this resize)
        me.dragLock = client.isVertical ? 'y' : 'x';

        // Events not part of project are transient records in a Gantt display store and not meant to be modified
        if (me.disabled || client.readOnly || resourceRecord?.readOnly ||
            (eventRecord && (eventRecord.readOnly || !(eventRecord.project || eventRecord.isOccurrence))) ||
            super.beforeDrag(drag) === false) {
            return false;
        }



        drag.mousedownDate = drag.date = client.getDateFromCoordinate(drag.event[`page${client.isHorizontal ? 'X' : 'Y'}`], null, false);

        // trigger beforeEventResize or beforeTaskResize depending on product
        return me.triggerBeforeResize(drag);
    }

    initEventRecordContext(record, mainContext) {
        const
            element     = record === mainContext.timespanRecord ? mainContext.element : this.getSelectedRecordElement(record),
            eventRecord = record.isAssignmentModel ? record.event : record,
            {
                isBatchUpdating,
                // For EventBuffer feature
                wrapEndDate,
                wrapStartDate
            }           = eventRecord,
            startDate   = isBatchUpdating ? eventRecord.get('startDate') : eventRecord.startDate,
            endDate     = isBatchUpdating ? eventRecord.get('endDate') : eventRecord.endDate,
            date        = mainContext.draggingEnd ? endDate : startDate;

        return {
            mainContext,
            eventRecord,
            element,
            startDate,
            endDate,
            date,
            wrapEndDate,
            wrapStartDate,
            oldValue          : date,
            originalStartDate : startDate,
            originalEndDate   : endDate,
            timespanRecord    : eventRecord
        };
    }

    initResizeContext(drag) {
        const
            me             = this,
            { client }     = me,
            {
                startEvent,
                itemElement
            }              = drag,
            eventRecord    = client.resolveEventRecord(itemElement),
            endDate        = eventRecord.endDate,
            startDate      = eventRecord.startDate,
            useEventBuffer = client.features.eventBuffer?.enabled,
            horizontal     = me.dragLock === 'x',
            rtl            = horizontal && client.rtl,
            draggingEnd    = me.isOverEndHandle(startEvent, itemElement),
            elRect         = Rectangle.from(itemElement, null, true),
            startCoord     = horizontal ? startEvent.clientX : startEvent.clientY,
            endCoord       = draggingEnd ? elRect.getEnd(rtl, horizontal) : elRect.getStart(rtl, horizontal),
            oldValue       = draggingEnd ? endDate : startDate,
            context        = {
                owner          : me,
                valid          : true,
                offset         : useEventBuffer ? 0 : endCoord - startCoord,
                edge           : horizontal ? (draggingEnd ? 'right' : 'left') : (draggingEnd ? 'bottom' : 'top'),
                finalize       : me.finalize,
                event          : drag.event,
                toSet          : draggingEnd ? 'endDate' : 'startDate',
                otherEnd       : draggingEnd ? 'startDate' : 'endDate',
                setMethod      : draggingEnd ? 'setEndDate' : 'setStartDate',
                setOtherMethod : draggingEnd ? 'setStartDate' : 'setEndDate',
                wrapToSet      : !useEventBuffer ? null : draggingEnd ? 'wrapEndDate' : 'wrapStartDate',
                oldValue,
                draggingEnd,

                // For Nested Events feature
                timespanRecord : eventRecord,

                // EventRecord for products
                [`${client.scheduledEventName}Record`] : eventRecord,

                // For backwards compatibility (mostly tests)
                element : this.eventContexts?.[0]?.element || itemElement
            };

        let events;

        // An occurrence is a virtual record sharing its base event's assignment, so it only appears selected when the
        // base is selected. It cannot be part of a real multi-event resize, so resize it on its own.
        if (me.resizeSelected && !eventRecord.isOccurrence && me.isRecordSelected(eventRecord)) {
            // collect selected events and also filter out the unscheduled tasks
            events = me.selectedRecords.filter(r => r.isAssignmentModel ? !r.event.readOnly && r.event.isScheduled : !r.readOnly && r.isScheduled);

            // place eventRecord first (selectedRecords holds assignments, so resolve to their events to compare)
            events.sort((a, b) => {
                const
                    aEvent = a.isAssignmentModel ? a.event : a,
                    bEvent = b.isAssignmentModel ? b.event : b;

                return aEvent === eventRecord ? -1 : bEvent === eventRecord ? 1 : 0;
            });
        }
        else {
            events = [eventRecord];
        }
        context.eventContexts = events.map(event => me.initEventRecordContext(event, context));

        return context;
    }

    get selectedRecords() {
        return this.client.selectedAssignments;
    }

    isRecordSelected(record) {
        return this.client.isEventSelected?.(record);
    }

    getSelectedRecordElement(record) {
        return record.isAssignmentModel ? this.client.getElementFromAssignmentRecord(record, false, false, this.client.isLockedRowsView)
            : this.client.getElementFromEventRecord(record);
    }



    dragStart(drag) {
        const
            me              = this,
            { client, tip } = me,
            context         = drag.context = me.initResizeContext(drag);

        client.addCls(...me.dragActiveCls.split(' '));

        // During this batch we want the client's UI to update itself using the proposed changes
        // Only if startDrag has not already done it
        if (!client.listenToBatchedUpdates) {
            client.beginListeningForBatchedUpdates();
        }

        for (const ctx of context.eventContexts) {
            const { eventRecord } = ctx;

            // The record(s) must know that it is being resized.
            eventRecord.meta.isResizing = true;

            // No changes must get through to data.
            // Only if startDrag has not already started the batch
            if (!eventRecord.isBatchUpdating) {
                me.beginEventRecordBatch(eventRecord);
            }

            // Event record might not be rendered
            if (ctx.element) {
                // Let products do their specific stuff
                me.setupProductResizeContext(ctx, drag.startEvent);
            }
        }

        // Trigger eventResizeStart or taskResizeStart depending on product
        // Subclasses (like EventDragCreate) won't actually fire this event.
        me.triggerEventResizeStart(`${client.scheduledEventName}ResizeStart`, me.getTriggerParams(context), context);

        if (tip) {
            // Tip needs to be shown first for getTooltipTarget to be able to measure anchor size
            tip.show();
            tip.align = tipAlign[context.edge];
            me.realignTooltip(drag);
        }
    }

    getTriggerParams(context) {
        const
            resizeData = context.eventContexts.map(eventContext => ({ ...eventContext })),
            eventName  = this.client.capitalizedEventName.toLowerCase(),
            data       = resizeData.find(({
                element,
                mainContext
            }) => element?.closest(`.b-sch-${eventName}-wrap`)?.isEqualNode(mainContext.element)) || resizeData[0],
            result     = {
                ...data,
                event    : context.event,
                async    : context.async,
                finalize : (...args) => context.finalize(...args),
                resizeData
            };

        // don't need mainContext on the main context level
        delete result.mainContext;

        return result;
    }

    // Subclasses may override this
    triggerBeforeResize(drag) {
        const
            { client }  = this,
            eventRecord = client.resolveTimeSpanRecord(drag.itemElement);

        return client.trigger(
            `before${client.capitalizedEventName}Resize`,
            {
                [`${client.scheduledEventName}Record`] : eventRecord,
                event                                  : drag.event,
                ...this.getBeforeResizeParams({ event : drag.startEvent, element : drag.itemElement })
            }
        );
    }

    // Subclasses may override this
    triggerEventResizeStart(eventType, event, context) {
        this.client.trigger(eventType, event);

        // Hook for features that needs to react on resize start
        this.client[`after${StringHelper.capitalize(eventType)}`]?.(context, event);
    }

    triggerEventResizeEnd(eventType, event) {
        this.client.trigger(eventType, event);
    }

    triggerEventPartialResize(eventType, resizeData) {
        const
            name     = this.client.scheduledEventName + 'Record',
            batching = new Map();

        // Enable handlers to mutate the record without hitting the batching.
        for (const params of resizeData) {
            const record = params[name];

            // remember record batching state
            batching.set(record, record.batching);
            record.batching = 0;
        }

        // Trigger eventPartialResize or taskPartialResize depending on product
        this.client.trigger(eventType, {
            ...resizeData[0],
            resizeData
        });

        // restore record batching back
        for (const params of resizeData) {
            const record = params[name];
            record.batching = batching.get(record);
        }
    }

    async triggerBeforeEventResizeFinalize(eventType, event) {
        await this.client.trigger(eventType, event);
    }

    dragEnter(drag) {
        // We only respond to our own DragContexts
        return drag.context?.owner === this;
    }

    resizeEventPartiallyInternal(eventRecord, context) {
        const { toSet } = context.mainContext;

        // <debug>
        const { detectExcessiveRendering } = this.client;

        this.client.detectExcessiveRendering = false;
        // </debug>



        eventRecord.set(toSet, context[toSet]);

        // <debug>
        this.client.detectExcessiveRendering = detectExcessiveRendering;
        // </debug>
    }

    applyDateConstraints(date, eventRecord, context) {
        const
            minDate = context.dateConstraints?.start,
            maxDate = context.dateConstraints?.end;

        // Keep desired date within constraints
        if (minDate || maxDate) {
            date = DateHelper.constrain(date, minDate, maxDate);
            context.snappedDate = DateHelper.constrain(context.snappedDate, minDate, maxDate);
        }

        return date;
    }

    isDateRangeValid(context) {
        const { startDate, endDate, eventRecord } = context;

        return this.isBufferedRangeAvailable(eventRecord, startDate, endDate);
    }

    isBufferedRangeAvailable(eventRecord, startDate, endDate) {
        const
            { client }    = this,
            { resources } = eventRecord;



        return client.isDateRangeAvailable(startDate, endDate, eventRecord, resources);
    }

    /**
     * Validates that the resized event has a valid size based on configuration.
     * Returns true if zero-size events are allowed or if snapping is enabled.
     * Otherwise checks that the event duration is non-zero.
     * @private
     */
    hasValidSize(context, toSet) {
        const
            { client }  = this,
            oppositeEnd = toSet === 'startDate' ? 'endDate' : 'startDate';

        if (client.timeAxisViewModel.snap || this.allowResizeToZero) {
            return true;
        }

        return context[toSet] - context[oppositeEnd] !== 0;
    }

    resizeEventRecord(context, drag, date) {
        const
            me          = this,
            { client }  = me,
            {
                timeAxis
            }           = client,
            {
                changeEvent
            }           = client.transition,
            {
                eventRecord,
                oldValue,
                element
            }           = context,
            {
                resolutionUnit,
                resolutionIncrement
            }           = timeAxis,
            startDate   = eventRecord.get('startDate'),
            endDate     = eventRecord.get('endDate'),
            dragContext = context.mainContext;

        let {
                toSet,
                otherEnd
            } = dragContext,
            crossedOver, avoidedZeroSize;

        // Detect crossover which some subclasses might need to process
        if (toSet === 'endDate') {
            if (date < startDate) {
                crossedOver = -1;
            }
        }
        else if (date > endDate) {
            crossedOver = 1;
        }

        // If we dragged the dragged end over to the opposite side of the start end.
        // Some subclasses allow this and need to respond. EventDragCreate does this.
        if (crossedOver && me.onDragEndSwitch) {
            me.onDragEndSwitch(context, date, crossedOver);
            otherEnd = dragContext.otherEnd;
            toSet = dragContext.toSet;
        }

        if (client.snapRelativeToEventStartDate) {
            date = timeAxis.roundDate(date, oldValue);
        }

        // The displayed and eventual data value
        context.snappedDate = DateHelper.round(date, timeAxis.resolution, null, timeAxis.weekStartDay);

        const duration = DateHelper.diff(date, context[otherEnd], resolutionUnit) * (dragContext.draggingEnd ? -1 : 1);

        // Narrower than half resolutionIncrement will abort drag creation, set flag to have UI reflect this
        if (me.isEventDragCreate && context.eventRecord === context.mainContext.eventRecord) {
            context.mainContext.tooNarrow = Math.abs(duration) < resolutionIncrement / 2;
        }
        // The mousepoint date means that the duration is less than resolutionIncrement resolutionUnits.
        // Ensure that the dragged end is at least resolutionIncrement resolutionUnits from the other end.
        else if (duration < resolutionIncrement) {
            if (duration < 0) {
                return;
            }
            // Snap to zero if allowed
            if (me.allowResizeToZero) {
                context.snappedDate = date = context[otherEnd];
            }
            else {
                const sign = otherEnd === 'startDate' ? 1 : -1;

                let snappedDate = timeAxis.ceilDate(DateHelper.add(eventRecord.get(otherEnd), resolutionIncrement * sign, resolutionUnit));

                const newDuration = DateHelper.diff(snappedDate, context[otherEnd], resolutionUnit) * (dragContext.draggingEnd ? -1 : 1);
                if (newDuration > resolutionIncrement) {
                    snappedDate = timeAxis.roundDate(DateHelper.add(snappedDate, -sign, resolutionUnit));
                }

                // Only snap if dragging bigger; multiplying by sign handles reverse drag direction (leftward)
                if ((snappedDate - oldValue) * sign < 0 || (date - oldValue) * sign > 0) {
                    date = sign > 0 ? DateHelper.max(date, snappedDate) : DateHelper.min(date, snappedDate);
                    context.snappedDate = snappedDate;
                }
                else {
                    // Fix snappedDate to stay on original date and prevent `date` making event smaller than starting value
                    date = sign > 0 ? DateHelper.max(date, oldValue) : DateHelper.min(date, oldValue);
                    context.snappedDate = oldValue;
                }

                avoidedZeroSize = true;
            }
        }

        // take dateConstraints into account
        date = me.applyDateConstraints(date, eventRecord, context);

        // If the mouse move has changed the detected date
        if (!context.date || date - context.date || avoidedZeroSize) {
            context.date = date;

            // The validityFn needs to see the proposed value.
            // Consult our snap config to see if we should be dragging in snapped mode
            context[toSet] = me.showExactResizePosition || client.timeAxisViewModel.snap ? context.snappedDate : date;

            // Snapping would take it to zero size - this is not allowed in drag resizing.
            context.valid = me.isDateRangeValid(context) && me.hasValidSize(context, toSet);

            // If the date to push into the record is new...
            if (eventRecord.get(toSet) - context[toSet]) {
                context.valid = me.checkValidity(context, drag.event, toSet);
                context.message = '';

                if (context.valid && typeof context.valid !== 'boolean') {
                    context.message = context.valid.message;
                    context.valid = context.valid.valid;
                }

                // If users returns nothing, that's interpreted as valid
                context.valid = (context.valid !== false);

                // An occurrence must have a store to announce its batched changes through.
                // They must usually never have a store - they are transient, but we
                // need to update the UI.
                if (eventRecord.isOccurrence) {
                    eventRecord.stores = [client.eventStore];
                }

                // Update the eventRecord.
                // Use setter rather than accessor so that in a Project, the entity's
                // accessor doesn't propagate the change to the whole project.
                // Scheduler must not animate this.
                client.transition.changeEvent = false;

                this.resizeEventPartiallyInternal(eventRecord, context);

                client.transition.changeEvent = changeEvent;

                if (eventRecord.isOccurrence) {
                    eventRecord.stores = null;
                }

                // Flag drag created too narrow events as invalid late, want all code above to execute for them
                // to get the proper size rendered
                if (context.tooNarrow) {
                    context.valid = false;
                }

                return {
                    [client.scheduledEventName + 'Record'] : eventRecord,
                    startDate,
                    endDate,
                    element,
                    ...{ [toSet] : context[toSet] }
                };
            }
        }
    }

    moveDrag(drag) {
        const
            me                   = this,
            { context, event }   = drag,
            { client, tip }      = me,
            horizontal           = me.dragLock === 'x',
            dimension            = horizontal ? 'X' : 'Y',
            { visibleDateRange } = client,
            rtl                  = horizontal && client.rtl,
            offset               = context.offset * (rtl ? -1 : 1),
            coord                = event[`client${dimension}`] + offset,
            clientRect           = Rectangle.from(client.timeAxisSubGridElement, null, true),
            startCoord           = clientRect.getStart(rtl, horizontal),
            endCoord             = clientRect.getEnd(rtl, horizontal),
            resizeData           = [];

        let { date } = drag;

        context.event = event;

        // If this is the last move event recycled because of a scroll, refresh the date
        if (event.isScroll) {
            drag.date = client.getDateFromCoordinate(event[`page${dimension}`] + offset, null, false);
        }

        if (rtl) {
            // If we're dragging off the start side, fix at the visible startDate
            if (coord > startCoord) {
                date = drag.date = visibleDateRange.startDate;
            }
            // If we're dragging off the end side, fix at the visible endDate
            else if (coord < endCoord) {
                date = drag.date = visibleDateRange.endDate;
            }

        }
        // If we're dragging off the start side, fix at the visible startDate
        else if (coord < startCoord) {
            date = drag.date = visibleDateRange.startDate;
        }
        // If we're dragging off the end side, fix at the visible endDate
        else if (coord > endCoord) {
            date = drag.date = visibleDateRange.endDate;
        }

        context.message = '';
        context.valid = true;

        let deltaMS = date - context.oldValue;
        if (me.client.capitalizedEventName === 'Task') {
            deltaMS = date - context.eventContexts[0].oldValue;
        }

        for (const ctx of context.eventContexts) {
            const
                eventDate        = new Date(ctx.oldValue.getTime() + deltaMS),
                recordResizeData = me.resizeEventRecord(ctx, drag, eventDate);

            if (recordResizeData) {
                resizeData.push(recordResizeData);
            }

            if (!ctx.valid) {
                context.valid = false;
            }
            if (ctx.message?.length) {
                context.message = ctx.message;
            }
        }

        if (tip) {
            // In case of edge flip (EventDragCreate), the align point may change
            tip.align = tipAlign[context.edge];
            me.realignTooltip(drag);
        }

        // Trigger eventPartialResize or taskPartialResize depending on product
        if (resizeData.length) {
            me.triggerEventPartialResize(`${me.client.scheduledEventName}PartialResize`, resizeData);
        }

        super.moveDrag(drag);
    }

    dragEnd(drag) {
        const { context } = drag;

        if (context) {
            context.event = drag.event;
        }

        if (drag.aborted) {
            context?.finalize(false);
        }
        // 062_resize.t.js specifies that if drag was not started but the mouse has moved,
        // the eventresizestart and eventresizeend must fire
        else if (!this.isEventDragCreate && !drag.started && !EventHelper.getPagePoint(drag.event).equals(EventHelper.getPagePoint(drag.startEvent))) {
            this.dragStart(drag);
            this.cleanup(drag.context, false);
        }
    }

    async dragDrop({ context, event }) {
        const
            me         = this,
            { client } = me,
            { toSet }  = context;

        let valid = true,
            modified;

        me.tip?.hide();

        for (const eventContext of context.eventContexts) {
            // Set the start/end date, whichever we were dragging
            // to the correctly rounded value before updating
            eventContext[toSet] = eventContext.snappedDate;

            const { startDate, endDate } = eventContext;

            // Input sanity check
            eventContext.valid = startDate && endDate && (me.allowResizeToZero || (endDate - startDate > 0)) &&
                // Make sure dragged end changed
                (eventContext[toSet] - eventContext.oldValue) &&
                eventContext.valid !== false;

            if (!eventContext.valid) {
                valid = false;
            }
        }

        if (valid) {
            const
                params = me.getTriggerParams(context),
                event = {
                    ...params,
                    // <remove-on-release>
                    // DEPRECATED: Backwards compatibility, remove in 7.0?
                    // </remove-on-release>
                    context : params
                };

            // Seems to be a valid resize operation, ask outside world if anyone wants to take control over the finalizing,
            // to show a confirm dialog prior to applying the new values. Triggers beforeEventResizeFinalize or
            // beforeTaskResizeFinalize depending on product
            await me.triggerBeforeEventResizeFinalize(`before${client.capitalizedEventName}ResizeFinalize`, event);

            if (event.async || params.async) {
                context.async = true;
            }

            modified = true;
        }

        // If a handler has set the async flag, it means that they are going to finalize
        // the operation at some time in the future, so we should not call it.
        if (!context.async) {
            await context.finalize(modified);
        }
    }

    async eventRecordFinalize(context, updateRecord) {
        const
            me         = this,
            { client } = me;

        let
            updatePromises = [],
            changed        = false;

        if (updateRecord) {
            updatePromises = context.eventContexts.map(ctx => me.internalUpdateRecord(ctx, ctx.eventRecord));
        }
        else {
            for (const ctx of context.eventContexts) {
                const { eventRecord } = ctx;
                // Reverts the changes, a batchedUpdate event will fire which will reset the UI
                me.cancelEventRecordBatch(eventRecord);

                // Manually trigger redraw of occurrences since they are not part of any stores
                if (eventRecord.isOccurrence) {
                    eventRecord.resources.forEach(resource => client.repaintEventsForResource(resource));
                }
            }
        }

        if (updatePromises.length) {
            await Promise.all(updatePromises);

            if (me.isDestroying) {
                // The records outlive the feature, so the resizing flag they carry must be cleared here — a stale
                // flag makes a later Scheduler on the same project render them unvirtualized
                for (const { eventRecord } of context.eventContexts) {
                    eventRecord.meta.isResizing = false;
                }

                return;
            }

            changed = updatePromises.some(b => b);
        }

        me.cleanup(context, changed);
    }

    // This is called with a thisObj of the context object
    // We set "me" to the owner, and "context" to the thisObj so that it
    // reads as if it were a method of this class.
    async finalize(updateRecord) {
        const
            me      = this.owner,
            context = this;

        // This is reached through a plain reference on the context object, which outlives the feature, so a listener
        // that destroyed the client leaves it callable with me.client already gone
        if (me.isDestroying) {
            return;
        }

        const
            {
                snapRelativeToEventStartDate,
                timeAxis
            }         = me.client,
            { toSet } = context;

        if (context.finalizing) {
            return;
        }

        context.finalizing = true;



        if (updateRecord) {
            context.eventContexts.forEach(ctx => {
                const { oldValue } = ctx;

                if (snapRelativeToEventStartDate) {
                    ctx[toSet] = ctx.snappedDate = timeAxis.roundDate(ctx.date, oldValue);
                }

                // adjust event record last time before disabling batch changes and resizing real data
                me.adjustRecordBeforeUpdating(ctx, ctx.eventRecord);
            });

            me.client.endListeningForBatchedUpdates();
        }

        // finalize resize - apply changes to the data
        await me.eventRecordFinalize(context, updateRecord);

        // The feature may have been destroyed while this was parked above, and an inert feature must not continue
        // finalizing — its pending transaction is rejected by doDestroy instead
        if (me.isDestroying) {
            return;
        }


    }

    // This is always called on drop or abort.
    cleanup(context, changed) {
        const
            me         = this,
            { client } = me;

        for (const { element, eventRecord } of context.eventContexts) {
            // The record must know that it is being resized.
            eventRecord.meta.isResizing = false;

            me.unHighlightHandle(element);
        }

        client.endListeningForBatchedUpdates();

        me.tip?.hide();

        client.removeCls(...me.dragActiveCls.split(' '));

        // Triggers eventResizeEnd or taskResizeEnd depending on product
        me.triggerEventResizeEnd(`${client.scheduledEventName}ResizeEnd`, { ...me.getTriggerParams(context), changed });
    }

    // It does the last adjustment event record adjustment.
    // Called before we disable batch changes tracking.
    adjustRecordBeforeUpdating(context, timespanRecord) {
        const
            { startDate, endDate }           = context,
            { toSet, draggingEnd, otherEnd } = context.mainContext;

        // If we have the Engine available, consult it to calculate a corrected duration.
        // Adjust the dragged date point to conform with the calculated duration.
        if (!timespanRecord.isOccurrence && timespanRecord.isEntity && timespanRecord.project &&
            (!timespanRecord.manuallyScheduled || timespanRecord.project.skipNonWorkingTimeWhenSchedulingManually)
        ) {
            // get the duration according to the Entity's rules.
            const duration = timespanRecord.run('calculateProjectedDuration', startDate, endDate);

            // Update the record to its final correct state using *batched changes*
            // These will *not* be propagated, it's just to force the dragged event bar
            // into its corrected shape before the real changes which will propagate are applied below.
            // We MUST do it like this because the final state may not be a net change if the changes
            // got rejected, and in that case, the engine will not end up firing any change events.
            timespanRecord.set({
                // Fix the dragged date point according to the Entity's rules.
                [toSet] : timespanRecord.run('calculateProjectedXDateWithDuration',
                    draggingEnd ? startDate : endDate, draggingEnd, duration),
                [otherEnd] : context[otherEnd]
            });
        }
    }

    async internalUpdateRecord(context, timespanRecord) {
        const
            { client }     = this,
            { generation } = timespanRecord,
            {
                startDate,
                endDate
            }              = context,
            {
                toSet,
                wrapToSet,
                setMethod

            }              = context.mainContext;

        // Flag to not reapply dragging cls when DomSyncing, to allow transitions
        context.updatingRecord = true;

        // Special handling of occurrences, they need normalization since that is not handled by engine at the moment
        if (timespanRecord.isOccurrence) {
            // If >1 level deep, just unwind one level.
            timespanRecord[timespanRecord.batching > 1 ? 'endBatch' : 'cancelBatch']();
            timespanRecord.set(TimeSpan.prototype.inSetNormalize.call(timespanRecord, { startDate, endDate }));
        }
        else {
            // Collect any changes (except the start/end date and duration) that happened during the resize operation
            const batchChanges = { ...timespanRecord.meta.batchChanges };
            delete batchChanges[toSet];
            delete batchChanges.duration;

            this.cancelEventRecordBatch(timespanRecord);
            // Clear estimated wrap dates, exact wrap dates will be calculated when referred to from renderer
            if (client.features.eventBuffer?.enabled) {
                timespanRecord[wrapToSet] = null;

            }

            // Really update the data after cancelling the batch
            timespanRecord[setMethod](context[toSet], false);

            if (Object.keys(batchChanges).length) {
                timespanRecord.set(batchChanges);
            }
        }

        // wait for project data update
        await client.project.commitAsync();
        // If the record has been changed
        return timespanRecord.generation !== generation;
    }

    onDragItemMouseMove(event) {
        if (event.pointerType !== 'touch' && !this.handleSelector && event.buttons === 0) {
            this.checkResizeHandles(event);
        }
    }

    /**
     * Check if mouse is over a resize handle (virtual). If so, highlight.
     * @private
     * @param {MouseEvent} event
     */
    checkResizeHandles(event) {
        const
            me           = this,
            { overItem } = me;

        // mouse over a target element and allowed to resize?
        if (overItem && !me.client.readOnly && (!me.allowResize || me.allowResize(overItem, event))) {
            const eventRecord = me.client.resolveTimeSpanRecord(overItem);

            if (eventRecord?.readOnly) {
                return;
            }

            if (me.isOverStartHandle(event, overItem)) {
                me.highlightHandle(true);
            }
            else if (me.isOverEndHandle(event, overItem)) {
                me.highlightHandle(false);
            }
            else {
                me.unHighlightHandle(); // not over handle
            }
        }
    }

    onDragItemMouseLeave(event, oldOverItem) {
        this.unHighlightHandle(oldOverItem);
    }

    /**
     * Highlights handles (applies css that changes cursor).
     * @private
     */
    highlightHandle(overStart) {
        const
            {
                overItem: item,
                client
            }                   = this,
            handleTargetElement = item.syncIdMap?.[client.scheduledEventName] ?? item.querySelector(client.eventInnerSelector);

        // over a handle, add cls to change cursor
        handleTargetElement.classList.add('b-resize-handle');
        item.classList.add('b-over-resize-handle');
        item.classList.toggle('b-over-start-handle', overStart);
        item.classList.toggle('b-over-end-handle', !overStart);
    }

    /**
     * Unhighlight handles (removes css).
     * @private
     */
    unHighlightHandle(item = this.overItem) {
        if (item) {
            const
                me    = this,
                inner = item.syncIdMap?.[me.client.scheduledEventName] ?? item.querySelector(me.client.eventInnerSelector);

            if (inner) {
                inner.classList.remove('b-resize-handle', me.resizingItemInnerCls);
            }

            item.classList.remove('b-over-resize-handle', 'b-over-start-handle', 'b-over-end-handle', me.draggingItemCls);
        }
    }

    isOverAnyHandle(event, target) {
        return Boolean(this.isOverStartHandle(event, target) || this.isOverEndHandle(event, target));
    }

    isOverStartHandle(event, target) {
        return Boolean(this.getHandleRect('start', event, target)?.contains(EventHelper.getPagePoint(event)));
    }

    isOverEndHandle(event, target) {
        return Boolean(this.getHandleRect('end', event, target)?.contains(EventHelper.getPagePoint(event)));
    }

    getHandleRect(side, event, eventEl) {
        if (this.overItem) {
            eventEl = event.target.closest(`.${this.client.eventCls}`) || eventEl.querySelector(`.${this.client.eventCls}`);
            if (!eventEl) {
                return;
            }

            const
                me             = this,
                start          = side === 'start',
                { client }     = me,
                rtl            = Boolean(client.rtl),
                axis           = me.dragLock,
                horizontal     = axis === 'x',
                dim            = horizontal ? 'width' : 'height',
                handleSpec     = `${horizontal ? (start ? (rtl ? 'right' : 'left') : (rtl ? 'left' : 'right')) : (start ? 'top' : 'bottom')}Handle`,
                timespanRecord = client.resolveTimeSpanRecord(eventEl),
                resizable      = timespanRecord?.isResizable,
                eventRect      = Rectangle.from(eventEl),
                result         = eventRect.clone(),
                barStyle       = globalThis.getComputedStyle(eventEl),
                centerGap      = me.dynamicHandleSize ? me.reservedSpace / 2 : 0,
                deflateArgs    = [0, 0, 0, 0];

            let handleSize = (DomHelper.parsePx(barStyle, '--b-event-resize-handle-other-size') + DomHelper.parsePx(barStyle, `--bi-event-resize-handle-inset-${horizontal ? 'inline' : 'block'}`));

            // To decide if we are over a valid handle, we first check disabled state
            // Then this.leftHandle/this.rightHandle/this.topHandle/this.bottomHandle
            // Then whether there's enough event bar width to accommodate separate handles
            // Then whether the event itself allows resizing at the specified side.
            if (!me.disabled && handleSize && !isNaN(handleSize) && me[handleSpec] && me.dynamicHandleSize && (resizable === true || resizable === side)) {
                const
                    oppositeEnd = (!horizontal && !start) || (horizontal && (rtl === start)),
                    eventSize   = eventRect[dim];

                // Reduce handleSize for narrow events
                if (handleSize > 0.5 * eventSize) {
                    handleSize = Math.max(Math.floor(eventSize / 4) - 1, 1);
                }
                if (oppositeEnd) {
                    // Push handle start point to other end and clip result to other end
                    result[axis] += (eventSize - handleSize);
                    deflateArgs[horizontal ? 3 : 0] = eventSize / 2 + centerGap;
                }
                else {
                    deflateArgs[horizontal ? 1 : 2] = eventSize / 2 + centerGap;
                }

                // Deflate the event bar rectangle to encapsulate 2px less than the side's own half
                // so that we can constrain the handle zone to be inside its own half when bar is small.
                eventRect.deflate(...deflateArgs);
                result[dim] = handleSize;

                // Constrain handle rectangles to each side so that they can never collide.
                // Each handle is constrained into its own half.
                result.constrainTo(eventRect);

                // Zero sized handles cannot be hovered
                if (result[dim]) {
                    return result;
                }
            }
        }
    }

    setupDragContext(event) {
        const me = this;

        // Only start a drag if we are over a handle zone.
        if (me.overItem && me.isOverAnyHandle(event, me.overItem) && me.isElementResizable(me.overItem, event)) {
            const result = super.setupDragContext(event);

            result.scrollManager = me.client.scrollManager;

            return result;
        }
    }

    changeTip(tip, oldTip) {
        const me = this;

        if (!me.showTooltip) {
            return null;
        }

        if (tip) {
            if (tip.isTooltip) {
                tip.owner = me;
            }
            else {
                tip = Tooltip.reconfigure(oldTip, Tooltip.mergeConfigs({
                    id : me.tipId
                }, tip, {
                    getHtml : me.getTipHtml.bind(me),
                    owner   : me.client
                }, me.tip), {
                    owner    : me,
                    defaults : {
                        type : 'tooltip'
                    }
                });
            }

            tip.ion({
                innerhtmlupdate : 'updateDateIndicator',
                thisObj         : me
            });

            me.clockTemplate = new ClockTemplate({
                scheduler : me.client
            });
        }
        else if (oldTip) {
            oldTip.destroy();
            me.clockTemplate?.destroy();
        }

        return tip;
    }

    //endregion

    //region Events

    isElementResizable(element, event) {
        const
            me             = this,
            { client }     = me,
            timespanRecord = client.resolveTimeSpanRecord(element);

        if (client.readOnly) {
            return false;
        }

        let resizable = timespanRecord?.isResizable;

        // Not resizable if the mousedown is on a resizing handle of
        // a percent bar.
        const
            handleHoldingElement = element?.syncIdMap[client.scheduledEventName] ?? element,
            handleEl             = event.target.closest('[class$="-handle"]');

        if (!resizable || (handleEl && handleEl !== handleHoldingElement)) {
            return false;
        }

        element = event.target.closest(me.dragSelector);

        if (!element) {
            return false;
        }

        const
            startsOutside = element.classList.contains('b-sch-event-startsoutside'),
            endsOutside   = element.classList.contains('b-sch-event-endsoutside');

        if (resizable === true) {
            if (startsOutside && endsOutside) {
                return false;
            }
            else if (startsOutside) {
                resizable = 'end';
            }
            else if (endsOutside) {
                resizable = 'start';
            }
            else {
                return me.isOverStartHandle(event, element) || me.isOverEndHandle(event, element);
            }
        }

        if (
            (startsOutside && resizable === 'start') ||
            (endsOutside && resizable === 'end')
        ) {
            return false;
        }

        if (
            (me.isOverStartHandle(event, element) && resizable === 'start') ||
            (me.isOverEndHandle(event, element) && resizable === 'end')
        ) {
            return true;
        }

        return false;
    }

    updateDateIndicator() {
        const
            { clockTemplate } = this,
            { context }       = this.dragging,
            {
                eventRecord,
                snappedDate
            }                 = context.eventContexts[0],
            { draggingEnd }   = context,
            startDate         = draggingEnd ? eventRecord.get('startDate') : snappedDate,
            endDate           = draggingEnd ? snappedDate : eventRecord.get('endDate'),
            { element }       = this.tip;

        clockTemplate.updateDateIndicator(element.querySelector('.b-sch-tooltip-start-date'), startDate);
        clockTemplate.updateDateIndicator(element.querySelector('.b-sch-tooltip-end-date'), endDate);
    }

    realignTooltip(drag) {
        const { tip } = this;

        // A tip can be hidden if the drag is outside the view, in that case we need to show it again
        if (tip.hidden) {
            tip.show();
        }

        const target = this.getTooltipTarget(drag);

        target ? tip.alignTo(target) : tip.hide(false);
    }

    getTooltipTarget({ itemElement, context }) {
        const
            me      = this,
            { rtl } = me.client,
            target  = Rectangle.from(itemElement, null, true);

        // The target can have zero width/height if the event is outside the view,
        // in that case we don't have any rendered target to align the tooltip to
        // https://github.com/bryntum/bryntum/issues/13572
        if (!target.width || !target.height) {
            return null;
        }

        if (me.dragLock === 'x') {
            const borderRadius = parseFloat(getComputedStyle(me.tip.element).borderRadius);

            // Align to the dragged edge of the proxy, and then bump right so that the anchor aligns perfectly.
            if ((!rtl && context.edge === 'right') || (rtl && context.edge === 'left')) {
                target.x = target.right + borderRadius - me.tip.anchorSize[0] / 2;
            }
            else {
                target.x -= borderRadius + 2;
            }
            target.width = me.tip.anchorSize[0] / 2;
        }
        else {
            // Align to the dragged edge of the proxy, and then bump bottom so that the anchor aligns perfectly.
            if (context.edge === 'bottom') {
                target.y = target.bottom - 1;
            }
            target.height = me.tip.anchorSize[1] / 2;
        }

        return { target };
    }

    basicValidityCheck(context, event) {
        return context.startDate &&
            (context.endDate > context.startDate || this.allowResizeToZero) &&
            this.validatorFn.call(this.validatorFnThisObj || this, context, event);
    }

    //endregion

    //region Tooltip

    getTipHtml({ tip }) {
        const
            me                   = this,
            { context }          = me.dragging,
            draggingEventContext = context.eventContexts.find(ctx => ctx.eventRecord === context.timespanRecord),
            {
                startDate,
                endDate,
                snappedDate,
                eventRecord
            }                    = draggingEventContext,
            {
                toSet,
                valid,
                message = ''
            }                    = context;

        // Empty string hides the tip - we get called before the Resizer, so first call will be empty
        if (!startDate || !endDate) {
            return tip.html;
        }

        // Set whichever one we are moving
        const tipData = {
            record  : eventRecord,
            valid,
            message,
            startDate,
            endDate,
            [toSet] : snappedDate
        };

        // Format the two ends. This has to be done outside of the object initializer
        // because they use properties that are only in the tipData object.
        tipData.startText = me.client.getFormattedDate(tipData.startDate);
        tipData.endText = me.client.getFormattedDate(tipData.endDate);
        tipData.startClockHtml = me.clockTemplate.template({
            date : tipData.startDate,
            text : tipData.startText,
            cls  : 'b-sch-tooltip-start-date'
        });
        tipData.endClockHtml = me.clockTemplate.template({
            date : tipData.endDate,
            text : tipData.endText,
            cls  : 'b-sch-tooltip-end-date'
        });

        return me.tooltipTemplate(tipData);
    }

    //endregion

    //region Product specific, may be overridden in subclasses

    beginEventRecordBatch(eventRecord) {
        eventRecord.beginBatch();
    }

    cancelEventRecordBatch(eventRecord) {
        // Reverts the changes, a batchedUpdate event will fire which will reset the UI
        eventRecord.cancelBatch();
    }

    getBeforeResizeParams(context) {
        const { client } = this;

        return {
            resourceRecord : client.resolveResourceRecord(client.isVertical ? context.event : context.element)
        };
    }

    setupProductResizeContext(context, event) {
        const
            { client }       = this,
            { element }      = context,
            eventRecord      = client.resolveEventRecord(element),
            resourceRecord   = client.resolveResourceRecord?.(element),
            assignmentRecord = client.resolveAssignmentRecord?.(element);

        Object.assign(context, {
            eventRecord,
            resourceRecord,
            assignmentRecord,
            dateConstraints : client.getDateConstraints?.(resourceRecord, eventRecord)
        });
    }

    // Helper method to check for event overlap
    checkForEventOverlap({ startDate, endDate, snappedDate, eventRecord, toSet }) {
        // When resizing start date, check range from new start to existing end, and the other way around for end date
        const resizingStart = toSet === 'startDate';

        return !this.isBufferedRangeAvailable(
            eventRecord,
            resizingStart ? snappedDate : startDate,
            resizingStart ? endDate : snappedDate
        );
    }

    checkValidity({ startDate, endDate, eventRecord, snappedDate, resourceRecord }, event, toSet) {
        const isOverlapping = this.checkForEventOverlap({ startDate, endDate, snappedDate, eventRecord, toSet });

        if (isOverlapping) {
            return {
                valid   : false,
                message : this.L('L{EventDrag.eventOverlapsExisting}')
            };
        }
        return this.basicValidityCheck(...arguments);
    }

    get tipId() {
        return `${this.client.id}-event-resize-tip`;
    }

    //endregion
}

EventResize.initClass();
