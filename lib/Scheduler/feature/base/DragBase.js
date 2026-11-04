import SchedulerFeature from '../SchedulerFeature.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import DragHelper from '../../../Core/helper/DragHelper.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import ClockTemplate from '../../tooltip/ClockTemplate.js';
import Tooltip from '../../../Core/widget/Tooltip.js';
import Objects from '../../../Core/helper/util/Objects.js';
import Widget from '../../../Core/widget/Widget.js';

/**
 * @module Scheduler/feature/base/DragBase
 */

/**
 * Object containing information on the dragged records.
 *
 * @typedef {Object} DragData
 * @param {Scheduler.model.TimeSpan|Scheduler.model.AssignmentModel} record Dragged record (use `records` for the full
 * array of dragged records).
 * **Please note** the property won't appear in Scheduler and Gantt features since the type is extended
 * there. See the `EventDrag`, `TaskDrag` features documentation there for actual properties
 * @param {Scheduler.model.TimeSpan[]|Scheduler.model.AssignmentModel[]} records Dragged records.
 * **Please note** the property won't appear in Scheduler and Gantt features since the type is extended
 * there. See the `EventDrag`, `TaskDrag` features documentation there for actual properties
 * @param {Date} startDate Dragged record new start date.
 * @param {Date} endDate Dragged record new end date.
 * @param {Number} timeDiff The time, in milliseconds, by which the records are dragged.
 * @param {Boolean} valid Set this to `false` to indicate that updating records was unsuccessful.
 */

/**
 * Base class for EventDrag (Scheduler) and TaskDrag (Gantt) features. Contains shared code for drag-and-drop
 * operations on events including tooltip display, snapping, and constraint handling. Not to be used directly.
 *
 * ## See also
 *
 * - {@link Scheduler.feature.EventDrag} - Scheduler event drag feature
 * - {@link Scheduler.feature.base.DragCreateBase} - Base class for drag-to-create
 *
 * @extends Scheduler/feature/SchedulerFeature
 * @abstract
 */
export default class DragBase extends SchedulerFeature {
    static $name = 'DragBase';

    //region Config

    static configurable = {
        // documented on Schedulers EventDrag feature and Gantt's TaskDrag
        tooltipTemplate : data => `
            <div class="b-sch-tip-${data.valid ? 'valid' : 'invalid'}">
                ${data.startClockHtml}
                ${data.endClockHtml}
                ${data.message ? `<div class="b-sch-tip-message">${data.message}</div>` : ''}
            </div>
        `,

        recordProperty : 'record',

        recordsProperty : 'records',

        /**
         * Specifies whether to show tooltip while dragging event
         * @prp {Boolean}
         * @default
         */
        showTooltip : true,

        /**
         * When enabled, the event being dragged always "snaps" to the exact start date that it will have after drop.
         * @config {Boolean}
         * @default
         */
        showExactDropPosition : false,

        /*
         * The store from which the dragged items are mapped to the UI.
         * In Scheduler's implementation of this base class, this will be
         * an EventStore, in Gantt's implementations, this will be a TaskStore.
         * Because both derive from this base, we must refer to it as this.store.
         * @private
         */
        store : null,

        /**
         * An object used to configure the internal {@link Core.helper.DragHelper} class
         * @config {DragHelperConfig}
         */
        dragHelperConfig : null,

        tooltipCls : 'b-event-drag-tooltip',

        /**
         * Set to `false` to allow dragging tasks outside the client Scheduler.
         * Useful when you want to drag tasks between multiple Scheduler instances
         * @config {Boolean}
         * @default
         */
        constrainDragToTimeline : true,

        // documented on Schedulers EventDrag feature, not used for Gantt
        constrainDragToResource : true,

        constrainDragToTimeSlot : false,

        /**
         * Yields the {@link Core.widget.Tooltip} which tracks the event during a drag operation.
         * @member {Core.widget.Tooltip} tip
         */
        /**
         * A config object to allow customization of the {@link Core.widget.Tooltip} which tracks
         * the event during a drag operation.
         * @config {TooltipConfig}
         */
        tip : {
            $config : ['lazy', 'nullify'],
            value   : {
                align : {
                    align          : 'b-t',
                    allowTargetOut : true,
                    offset         : [-3, -3]
                },
                autoShow                 : true,
                updateContentOnMouseMove : true,
                applyMinWidth            : true
            }
        },

        /**
         * The `eventDrag`and `taskDrag` events are normally only triggered when the drag operation will lead to a
         * change in date or assignment. By setting this config to `false`, that logic is bypassed to trigger events
         * for each native mouse move event.
         * @prp {Boolean}
         */
        throttleDragEvent : true,

        capitalizedEventName : null,

        eventName : null,

        /**
         * Function that updates the dragged records.
         * Use this config to customize how the drag changes are applied to the data.
         *
         * Providing this function replaces the internal calls to the {@link #function-updateRecords} method on drop,
         * replacing it with your own logic.
         * If you instead want to extend the default logic, you can can call it from the provided function:
         *
         * ```javascript
         * eventDrag : {
         *     async updateRecordsFn(...args) {
         *         // call default logic first
         *         await this.updateRecords(...args);
         *
         *         // some additional custom code goes here
         *         ...
         *     }
         * }
         * ```
         *
         * @config {Function|String}
         * @param {DragData} dragData Drag data.
         * @returns {Promise|void} Can return a `Promise` resolving once the changes are applied
         * (if the process is asynchronous).
         */
        updateRecordsFn : 'updateRecords'
    };

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            after : ['onInternalPaint', 'internalOnBeforeModeSwitch', 'internalOnModeChange']
        };
    }

    //endregion

    //region Init

    afterConstruct(...args) {
        const
            me = this,
            { client } = this;

        me.capitalizedEventName = me.capitalizedEventName || client.capitalizedEventName;
        me.eventName = me.eventName || client.scheduledEventName;

        super.afterConstruct(...args);
    }

    // Hook used by subclasses
    internalSnapToPosition(snapTo) {}

    buildDragHelperConfig() {
        const
            me                                  = this,
            {
                client,
                constrainDragToTimeline,
                constrainDragToResource,
                constrainDragToTimeSlot,
                dragHelperConfig = {}
            }                                   = me,
            { timeAxisViewModel, isHorizontal } = client,
            lockY                               = isHorizontal ? constrainDragToResource : constrainDragToTimeSlot,
            lockX                               = isHorizontal ? constrainDragToTimeSlot : constrainDragToResource;

        // If implementer wants to allow users dragging outside the timeline element, setup the internal dropTargetSelector
        if (me.externalDropTargetSelector) {
            dragHelperConfig.dropTargetSelector = `.b-time-axis-sub-grid,${me.externalDropTargetSelector}`;
        }

        return Objects.merge({
            name                 : me.constructor.name, // useful when debugging with multiple draggers
            positioning          : 'inset',
            rtlSource            : client,
            lockX,
            lockY,
            minX                 : true, // Allows dropping with start before time axis
            maxX                 : true, // Allows dropping with end after time axis
            constrain            : false,
            cloneTarget          : !constrainDragToTimeline,
            // If we clone event dragged bars, we assume ownership upon drop so we can reuse the element and have animations
            removeProxyAfterDrop : false,
            dragWithin           : constrainDragToTimeline ? null : client.floatRoot,
            hideOriginalElement  : true,
            dropTargetSelector   : '.b-timeline-base',
            allowDropOutside     : !constrainDragToTimeline,
            // A CSS class added to drop target while dragging events
            dropTargetCls        : me.externalDropTargetSelector ? 'b-drop-target' : '',

            outerElement   : client.timeAxisSubGridElement,
            targetSelector : client.eventSelector,
            scrollManager  : constrainDragToTimeline ? client.scrollManager : null,
            createProxy    : el => me.createProxy(el),

            snapCoordinates : ({ element, newX, newY }) => {
                const
                    { dragData, recordProperty } = me,
                    record                       = dragData?.[recordProperty];

                // Guard against snapCoordinates being called before dragData is initialized
                if (!record) {
                    return { x : newX, y : newY };
                }

                // Snapping not supported when dragging outside a scheduler
                if (client && me.constrainDragToTimeline && !me.constrainDragToTimeSlot && (me.showExactDropPosition || timeAxisViewModel.snap)) {
                    const
                        { timeAxis }       = client,
                        draggedEventRecord = record.event ?? record,
                        { calendar }       = draggedEventRecord,
                        { startDate }      = dragData,
                        coordinate         = me.getCoordinate(draggedEventRecord, element, [newX, newY]);

                    let snappedDate;
                    // fillTicks and snap features have different behaviours in rounding the new startDate while dragging, then snap feature needs to be forced to use the same date as fillTicks (if is active).
                    if (client.fillTicks && timeAxis.isContinuous) {
                        // Must calculate date from current coordinate (derived from mouse position). Previously, using roundDate on startDate
                        // could incorrectly round to the next day based on resolutionUnit and resolutionIncrement when snap is enabled.
                        snappedDate = timeAxisViewModel.getDateFromPosition(coordinate, client.snap ? 'round' : null);
                    }
                    else {
                        snappedDate = timeAxisViewModel.getDateFromPosition(coordinate, 'round');
                        if (snappedDate && (client.snapRelativeToEventStartDate || (client.snap && client.fillTicks))) {
                            snappedDate = timeAxis.roundDate(snappedDate, startDate);
                        }
                    }

                    if (!calendar || snappedDate && calendar.isWorkingTime(snappedDate, DateHelper.add(snappedDate, draggedEventRecord.fullDuration))) {
                        const snappedPosition = snappedDate && timeAxisViewModel.getPositionFromDate(snappedDate);

                        if (snappedDate && snappedDate >= client.startDate && snappedPosition != null) {
                            if (isHorizontal) {
                                newX = snappedPosition;
                            }
                            else {
                                newY = snappedPosition;
                            }
                        }
                    }

                    // Affect snapping on drag, making events snap to the vertical center of each resource
                    if (client.snap && me.snapToResource && !constrainDragToResource) {
                        let resourceHover;

                        if (isHorizontal) {
                            const rowIdHover = client.rowManager.getRowAt(dragData.context.clientY)?.id;
                            resourceHover    = client.resourceStore.getById(rowIdHover);
                        }
                        else {
                            const pointerX = dragData.context.clientX - client.timeAxisSubGrid.rectangle().x + client.timeAxisSubGrid.scrollable.x;

                            resourceHover = client.vertical.allResourceRecords.find(resource => {
                                const { insetStart, insetEnd } = resource.instanceMeta(client);
                                return insetStart <= pointerX && insetEnd > pointerX;
                            });
                        }

                        const
                            resourceRecord             = resourceHover || dragData.newResource || dragData.resourceRecord,
                            { start : resourceMargin } = client.getResourceMarginObject(resourceRecord),
                            rowHeight                  = isHorizontal ? client.getRowFor(resourceRecord)?.height : client.getResourceWidth(resourceRecord),
                            rowTop                     = isHorizontal ? client.getRowFor(resourceRecord)?.top : resourceRecord.instanceMeta(client)?.insetStart;

                        if (rowHeight !== undefined && rowTop !== undefined) {
                            let
                                eventTop             = rowTop + resourceMargin,
                                distanceToCheck      = me.snapToResource.threshold ? Math.min(rowHeight, me.snapToResource.threshold) : rowHeight / 4 + resourceMargin,
                                distanceFromEventTop = isHorizontal ? Math.abs(newY - rowTop) :  Math.abs(newX - rowTop);

                            if (resourceRecord.id === dragData.resourceRecord.id) {
                                eventTop             = isHorizontal ? dragData.context.elementStartY : dragData.context.elementStartX;
                                distanceFromEventTop = isHorizontal ? Math.abs(newY - eventTop) :  Math.abs(newX - eventTop);
                            }

                            if (distanceFromEventTop <= distanceToCheck) {
                                if (isHorizontal) {
                                    newY = eventTop;
                                }
                                else {
                                    newX = eventTop;
                                }
                            }
                        }
                    }
                }

                const snapTo = { x : newX, y : newY };

                me.internalSnapToPosition(snapTo);

                return snapTo;
            },
            internalListeners : {
                beforedragstart : 'onBeforeDragStart',
                dragstart       : 'onDragStart',
                afterdragstart  : 'onAfterDragStart',
                drag            : 'onDrag',
                drop            : 'onDrop',
                abort           : 'onDragAbort',
                abortFinalized  : 'onDragAbortFinalized',
                reset           : 'onDragReset',
                thisObj         : me
            }
        }, dragHelperConfig, {
            isElementDraggable : (el, event) => {
                return (!dragHelperConfig || !dragHelperConfig.isElementDraggable || dragHelperConfig.isElementDraggable(el, event)) &&
                    me.isElementDraggable(el, event);
            }
        });
    }

    /**
     * Called when scheduler is rendered. Sets up drag and drop and hover tooltip.
     * @private
     */
    onInternalPaint({ firstPaint }) {
        const
            me         = this,
            { client } = me;

        me.drag?.destroy();

        me.drag = DragHelper.new(me.buildDragHelperConfig());

        if (firstPaint) {
            client.rowManager.ion({
                changeTotalHeight : () => me.updateYConstraint(me.dragData?.[`${client.scheduledEventName}Record`]),
                thisObj           : me
            });
        }

        if (me.showTooltip) {
            me.clockTemplate = new ClockTemplate({
                scheduler : client
            });
        }
    }

    doDestroy() {
        this.drag?.destroy();
        this.clockTemplate?.destroy();
        this.tip?.destroy();
        super.doDestroy();
    }

    get tipId() {
        return `${this.client.id}-event-drag-tip`;
    }

    changeTip(tip, oldTip) {
        const me = this;

        if (tip) {
            const result = Tooltip.reconfigure(oldTip, Tooltip.mergeConfigs({
                forElement : me.element,
                id         : me.tipId,
                getHtml    : me.getTipHtml.bind(me),
                cls        : me.tooltipCls,
                owner      : me.client
            }, tip), {
                owner    : me.client,
                defaults : {
                    type : 'tooltip'
                }
            });

            result.ion({ innerHtmlUpdate : 'updateDateIndicator', thisObj : me });

            return result;
        }
        else {
            oldTip?.destroy();
        }
    }

    changeUpdateRecordsFn(value) {
        return this.resolveCallback(value, this);
    }

    //endregion

    //region Drag events

    createProxy(element) {
        const proxy = element.cloneNode(true);

        // id is Element accessor, delete can't clear it
        proxy.removeAttribute('id');

        proxy.classList.add(`b-sch-${this.client.mode}`, 'b-selected');
        return proxy;
    }

    // The resource a bar of the passed record represents on the passed row, the row itself unless rendered on behalf
    // of another resource
    getRowResource(record, rowRecord) {
        return rowRecord;
    }

    onBeforeDragStart({ context, event }) {
        const
            me              = this,
            { client }      = me,
            dragData        = me.getMinimalDragData(context, event),
            eventRecord     = dragData?.[`${client.scheduledEventName}Record`],
            resourceRecord  = dragData.resourceRecord,
            noDirectionOpen = me.constrainDragToResource && me.constrainDragToTimeSlot;

        if (client.readOnly || me.disabled || !eventRecord || eventRecord.isDraggable === false || eventRecord.readOnly || me.getRowResource(dragData.assignmentRecord, resourceRecord)?.readOnly || noDirectionOpen) {
            return false;
        }

        // Resolve lockX/lockY axes now rather than reacting to mode changes: the current orientation is the only thing
        // that matters for this drag, so computing here avoids stale state from a prior mode switch and keeps the
        // DragHelper config in sync without a separate listener. Skip axes the app pinned explicitly via
        // dragHelperConfig so that raw lockX/lockY overrides are not clobbered by the constrain-based resolution.
        if (me.drag) {
            const
                { isHorizontal }          = client,
                { dragHelperConfig = {} } = me;

            if (!('lockY' in dragHelperConfig)) {
                me.drag.lockY = isHorizontal ? me.constrainDragToResource : me.constrainDragToTimeSlot;
            }
            if (!('lockX' in dragHelperConfig)) {
                me.drag.lockX = isHorizontal ? me.constrainDragToTimeSlot : me.constrainDragToResource;
            }
        }

        // Cache the date corresponding to the drag start point so that on drag, we can always
        // perform the same calculation to then find the time delta without having to calculate
        // the new start and end times from the position that the element is.
        context.pointerStartDate = client.getDateFromCoord({ coord : client.isVertical ? context.startPageY : context.startPageX, local : false });

        const result = me.triggerBeforeEventDrag(
            `before${me.capitalizedEventName}Drag`,
            {
                ...dragData,
                event,
                domEvent : event,
                // to be deprecated
                context  : {
                    ...context,
                    ...dragData
                }
            }
        ) !== false;

        if (result) {
            me.updateYConstraint(eventRecord, resourceRecord);

            // Hook for features that need to react to drag starting, used by NestedEvents
            client[`before${me.capitalizedEventName}DragStart`]?.(context, dragData);
        }

        return result;
    }

    onAfterDragStart({ context, event }) {}

    /**
     * Returns true if a drag operation is active
     * @member {Boolean}
     * @readonly
     */
    get isDragging() {
        return this.drag?.isDragging;
    }

    // Checked by dependencies to determine if live redrawing is needed
    get isActivelyDragging() {
        return this.isDragging && !this.finalizing;
    }

    /**
     * Triggered when dragging of an event starts. Initializes drag data associated with the event being dragged.
     * @private
     */
    onDragStart({ context, event }) {
        const
            me     = this,
            // When testing with Selenium, it simulates drag and drop with a single mousemove event, we might be over
            // another client already
            client = me.findClientFromTarget(event, context) ?? me.client;

        me.currentOverClient = client;
        me.drag.unifiedProxy = me.unifiedDrag;

        me.onMouseOverNewTimeline(client, true);

        const dragData = me.dragData = me.getDragData(context);

        // Do not let DomSync reuse the element
        me.suspendElementRedrawing(context.element);

        if (me.showTooltip && me.tip) {
            const tipTarget = dragData.context.dragProxy ? dragData.context.dragProxy.firstChild : context.element;

            me.tip.showBy(tipTarget);
        }

        me.triggerDragStart(dragData);

        // Hook for features that need to take action after drag starts
        client[`after${me.capitalizedEventName}DragStart`]?.(context, dragData);

        const
            {
                eventMenu,
                taskMenu
            }           = client.features,
            menuFeature = eventMenu || taskMenu;

        // If this is a touch action, hide the context menu which may have shown
        menuFeature?.hideContextMenu?.(false);
    }

    updateDateIndicator() {
        const
            { startDate, endDate } = this.dragData,
            { tip, clockTemplate } = this,
            endDateElement         = tip.element.querySelector('.b-sch-tooltip-end-date');

        clockTemplate.updateDateIndicator(tip.element, startDate);

        endDateElement && clockTemplate.updateDateIndicator(endDateElement, endDate);
    }

    findClientFromTarget(event, context) {
        let { target } = event;

        // Can't detect target under a touch event
        if (/^touch/.test(event.type)) {
            const center = Rectangle.from(context.element, null, true).center;

            target = DomHelper.elementFromPoint(center.x, center.y);
        }

        const client = Widget.fromElement(target, 'timelinebase');
        // Do not allow drops on histogram widgets
        return client?.isResourceHistogram ? null : client;
    }

    /**
     * Triggered while dragging an event. Updates drag data, validation etc.
     * @private
     */
    onDrag({ context, event }) {
        const
            me      = this,
            dd      = me.dragData,
            start   = dd.startDate;

        let client;

        if (me.constrainDragToTimeline) {
            client = me.client;
        }
        else {
            client = me.findClientFromTarget(event, dd.context);
        }

        // Update currentOverClient before updateDragContext so resolveResource() uses the correct scheduler
        if (client && client !== me.currentOverClient) {
            me.onMouseOverNewTimeline(client);
        }

        me.updateDragContext(context, event);

        if (!client || (!client.isGanttBase && !dd.newResource && me.currentOverClient !== me.client)) {
            return;
        }

        if (client !== me.currentOverClient) {
            me.onMouseOverNewTimeline(client);
        }

        //this.checkShiftChange();

        // Let product specific implementations trigger drag event (eventDrag, taskDrag)
        if (dd.dirty || !me.throttleDragEvent) {
            const valid = dd.valid;

            me.triggerEventDrag(dd, start);

            if (valid !== dd.valid) {
                dd.context.valid = dd.externalDragValidity = dd.valid;
            }
        }

        if (me.showTooltip && me.tip) {
            // If we've an error message to show, force the tip to be visible
            // even if the target is not in view.
            me.tip.lastAlignSpec.allowTargetOut = !dd.valid;
            me.tip.realign();
        }
    }

    onMouseOverNewTimeline(newTimeline, initial) {
        const
            me                          = this,
            { drag : { lockX, lockY } } = me,
            scrollables                 = [];

        me.currentOverClient.removeCls('b-dragging-' + me.currentOverClient.scheduledEventName);

        newTimeline.addCls('b-dragging-' + newTimeline.scheduledEventName);

        if (!initial) {
            me.currentOverClient.scrollManager.stopMonitoring();
        }

        if (!lockX) {
            scrollables.push({
                element   : newTimeline.timeAxisSubGrid.scrollable.element,
                direction : 'horizontal'
            });
        }

        if (!lockY) {
            scrollables.push({
                element   : newTimeline.scrollable.element,
                direction : 'vertical'
            });
        }

        newTimeline.scrollManager.startMonitoring({
            scrollables,
            callback : me.drag.onScrollManagerScrollCallback
        });

        me.currentOverClient = newTimeline;
    }

    triggerBeforeEventDropFinalize(eventType, eventData, client) {
        client.trigger(eventType, eventData);
    }

    /**
     * Triggered when dropping an event. Finalizes the operation.
     * @private
     */
    onDrop({ context, event }) {
        const
            me                              = this,
            { currentOverClient, dragData } = me;

        let modified = false;

        // Stop monitoring early, to avoid scrolling during finalization
        currentOverClient?.scrollManager.stopMonitoring();

        me.tip?.hide();

        context.valid = context.valid && me.isValidDrop(dragData);

        // If dropping outside scheduler, we opt in on DragHelper removing the proxy element.
        // Also remove proxy when cloneTarget is explicitly set with constrainDragToTimeline (internal drop with clone)
        me.drag.removeProxyAfterDrop = Boolean(dragData.externalDropTarget) ||
            (me.drag.cloneTarget && me.constrainDragToTimeline);

        if (context.valid && dragData.startDate && dragData.endDate) {
            let beforeDropTriggered = false;

            dragData.finalize = async(valid) => {
                // The app can finalize long after the drop, so by then the feature may be inert
                if (me.isDestroying) {
                    return;
                }

                if (beforeDropTriggered || dragData.async) {
                    await me.finalize(valid);
                }
                else {
                    // If user finalized operation synchronously in the beforeDropFinalize listener, just use
                    // the valid param and carry on
                    // but ignore it, if the context is already marked as invalid
                    context.valid = context.valid && valid;
                }
            };

            me.triggerBeforeEventDropFinalize(`before${me.capitalizedEventName}DropFinalize`, {
                context  : dragData,
                domEvent : event
            }, currentOverClient);

            beforeDropTriggered = true;

            // Allow implementer to take control of the flow, by returning false from this listener,
            // to show a confirmation popup etc. This event is documented in EventDrag and TaskDrag
            context.async = dragData.async;

            // Internal validation, making sure all dragged records fit inside the view
            if (!context.async && !dragData.externalDropTarget) {
                const
                    { eventRecord, targetEventRecord, parentChanged : contextParentChanged } = dragData,
                    // Check for nested event parent change (de-nesting or re-nesting). Prefer the value computed
                    // in the drag context (e.g. NestedEvents) and fall back to a local heuristic if absent.
                    parentChanged = Boolean(contextParentChanged ?? (eventRecord?.parent && !eventRecord.parent.isRoot && targetEventRecord !== eventRecord.parent));

                modified = (dragData.startDate - dragData.origStart) !== 0 || dragData.newResource !== dragData.resourceRecord || parentChanged;
            }
        }

        // The before-drop listener above is triggered synchronously, so it can have destroyed the client by now
        if (!context.async && !me.isDestroying) {
            me.finalize(dragData.valid && context.valid && modified);
        }
    }

    onDragAbort({ context }) {
        const me = this;

        // Flag checked by dependencies feature, to live redraw during abort
        me.isAborting = true;

        // Stop monitoring early, to avoid scrolling during finalization
        me.currentOverClient?.scrollManager.stopMonitoring();

        me.client.currentOrientation.onDragAbort({ context, dragData : me.dragData });

        // otherwise the event disappears on next refresh (#62)
        me.resetDraggedElements();

        me.tip?.hide();

        // Trigger eventDragAbort / taskDragAbort depending on product
        me.triggerDragAbort(me.dragData);
    }

    // Fired after any abort animation has completed (the point where we want to trigger redraw of progress lines etc)
    onDragAbortFinalized({ context }) {
        const me = this;

        me.triggerDragAbortFinalized(me.dragData);

        // Hook for features that need to react on drag abort, used by NestedEvents
        me.client[`after${me.capitalizedEventName}DragAbortFinalized`]?.(context, me.dragData);

        me.isAborting = false;
    }

    // For the drag across multiple schedulers, tell all involved scroll managers to stop monitoring
    onDragReset({ source : dragHelper }) {
        const
            me              = this,
            currentTimeline = me.currentOverClient;

        if (dragHelper.context?.started) {
            me.resetDraggedElements();

            currentTimeline.trigger(`${me.eventName}DragReset`);
        }

        currentTimeline?.removeCls(`b-dragging-${currentTimeline.scheduledEventName}`);
        me.dragData = null;
    }

    resetDraggedElements() {
        const
            me           = this,
            { dragData } = me;

        if (!dragData) {
            return;
        }

        const
            { recordProperty, recordsProperty } = me,
            { eventBarEls }                     = dragData,
            { draggingCls }                     = me.drag;

        me.resumeRecordElementRedrawing(dragData[recordProperty]);

        dragData[recordsProperty].forEach((record, i) => {
            me.resumeRecordElementRedrawing(record);

            // <remove-on-release>
            // TODO: why?
            // </remove-on-release>
            if (eventBarEls[i]) {
                eventBarEls[i].classList.remove(draggingCls);
                eventBarEls[i].retainElement = false;
            }
        });

        // Code expects 1:1 ratio between eventBarEls & dragged assignments, but when dragging an event of a linked
        // resource that is not the case, and we need to clean up some more
        dragData.context.element.retainElement = false;
    }

    /**
     * Triggered internally on invalid drop.
     * @private
     */
    onInternalInvalidDrop(abort) {
        const
            me          = this,
            { context } = me.drag;

        me.tip?.hide();

        me.triggerAfterDrop(me.dragData, false);

        context.valid = false;

        if (abort) {
            me.drag.abort();
        }
    }

    //endregion

    //region Finalization & validation

    /**
     * Called on drop to update the record of the event being dropped.
     * @private
     * @param {Boolean} updateRecords Specify true to update the record, false to treat as invalid
     */
    async finalize(updateRecords) {
        const
            me           = this,
            { dragData } = me;

        // Drag could've been aborted by window blur event. If it is aborted - we have nothing to finalize.
        if (!dragData || me.finalizing) {
            return;
        }

        const
            {
                currentOverClient,
                recordsProperty
            }                     = me,
            {
                context,
                eventBarEls,
                externalDropTarget
            }                     = dragData,
            { features }          = currentOverClient,
            clientEventTipFeature = features.taskTooltip || features.eventTooltip,
            { draggingCls }       = me.drag;

        let result;

        me.finalizing = true;

        dragData[recordsProperty].forEach((record, i) => {
            me.resumeRecordElementRedrawing(record);

            // <remove-on-release>
            // TODO: Why is this needed? EventResize.t.js fails without it
            // </remove-on-release>

            if (eventBarEls[i]) {
                eventBarEls[i].classList.remove(draggingCls);
                eventBarEls[i].retainElement = false;
            }
        });

        // Code expects 1:1 ratio between eventBarEls & dragged assignments, but when dragging an event of a linked
        // resource that is not the case, and we need to clean up some more
        context.element.retainElement = false;

        if ((externalDropTarget && dragData.valid) || updateRecords) {


            const { handler, thisObj } = me.updateRecordsFn;
            // updateRecordsFn may or may not be async.
            // We see if it returns a Promise.
            result = handler.call(thisObj, dragData);

            // If updateRecordsFn is async, the calling DragHelper must know this and
            // go into a awaitingFinalization state.
            if (!externalDropTarget && Objects.isPromise(result)) {
                context.async = true;
                await result;
            }

            // An async finalizer above may have let the feature be destroyed, and an inert feature must not continue
            // the drop — its pending transaction is rejected by doDestroy instead
            if (me.isDestroying) {
                return;
            }

            // If the finalize handler decided to change the dragData's validity...
            if (!dragData.valid) {
                me.onInternalInvalidDrop(true);
            }
            else {
                me.triggerDrop(dragData);

                if (context.async) {
                    context.finalize();
                }
                if (externalDropTarget) {
                    // Force a refresh early so that removed events will not temporary be visible while engine is
                    // recalculating (the row below clears the 'b-hidden' CSS class of the original drag element)
                    me.client.refreshRows(null, false);
                }
                me.triggerAfterDrop(dragData, true);
            }
        }
        else {
            me.onInternalInvalidDrop(context.async || dragData.async);
        }

        me.finalizing = false;

        // Prevent event tooltip showing after a drag drop
        if (clientEventTipFeature?.enabled) {
            clientEventTipFeature.disabled = true;

            currentOverClient.setTimeout(() => {
                clientEventTipFeature.disabled = false;
            }, 200);
        }

        return result;
    }

    //endregion

    //region Drag data

    getEventNewStartEndDates(eventRecord, timeDiff, toClient) {
        // calculate and round new startDate based on actual timeDiff
        const startDate = this.adjustStartDate(eventRecord.startDate, timeDiff);

        return {
            startDate,
            endDate : DateHelper.add(startDate, eventRecord.fullDuration)
        };
    }

    /**
     * Updates drag data's dates and validity (calls #validatorFn if specified)
     * @private
     */
    updateDragContext(info, event) {
        const
            me                         = this,
            { drag, recordProperty }   = me,
            dd                         = me.dragData,
            client                     = me.currentOverClient,
            { isHorizontal, timeAxis } = client,
            record                     = dd[recordProperty],
            eventRecord                = record.isAssignment ? record.event : record,
            lastDragStartDate          = dd.startDate,
            constrainToTimeSlot        = me.constrainDragToTimeSlot || (isHorizontal ? drag.lockX : drag.lockY);

        dd.browserEvent = event;

        // getProductDragContext may switch valid flag, need to keep it here
        Object.assign(dd, me.getProductDragContext(dd));

        if (constrainToTimeSlot) {
            dd.timeDiff = 0;
        }
        else {
            let timeDiff;

            // Time diff is calculated differently for continuous and non-continuous time axis
            // (except if element starts and ends outside of view)
            if (timeAxis.isContinuous || (dd.startsOutsideView && dd.endsOutsideView)) {
                const
                    timeAxisPosition = client.isHorizontal ? info.pageX ?? info.startPageX : info.pageY ?? info.startPageY,
                    // Use the localized coordinates to ask the TimeAxisViewModel what date the mouse is at.
                    // Pass allowOutOfRange as true in case we have dragged out of either side of the timeline viewport.
                    pointerDate      = client.getDateFromCoordinate(timeAxisPosition, null, false, true);

                timeDiff = dd.timeDiff = pointerDate - info.pointerStartDate;

                if (timeDiff !== null) {
                    Object.assign(dd, me.getEventNewStartEndDates(eventRecord, timeDiff, client));

                    if (dd.valid) {
                        dd.timeDiff = dd.startDate - dd.origStart;
                    }
                }
            }
            else {
                const range = me.resolveStartEndDates(info.element);
                // if dragging is out of timeAxis rect bounds, we will not be able to get dates
                dd.valid = Boolean(range.startDate && range.endDate);

                if (dd.valid) {
                    timeDiff = range.startDate - dd.origStart;
                }

                if (timeDiff !== undefined) {
                    me.applyResolvedStartEndDates(eventRecord, range, client);
                }

                dd.timeDiff = timeDiff;
            }
        }

        const positionDirty = dd.dirty = dd.dirty || lastDragStartDate - dd.startDate !== 0;

        if (dd.valid) {
            // If it's fully outside, we don't allow them to drop it - the event would disappear from their control.
            if (me.constrainDragToTimeline && (dd.endDate <= timeAxis.startDate || dd.startDate >= timeAxis.endDate)) {
                dd.valid           = false;
                dd.context.message = me.L('L{EventDrag.noDropOutsideTimeline}');
            }
            else if (positionDirty || dd.externalDropTarget) {
                // Used to rely on faulty code above that would not be valid initially. With that changed we ignore
                // checking validity here on drag start, which is detected by not having a pageX
                const result = dd.externalDragValidity = !event || (info.pageX && me.checkDragValidity(dd, event));

                if (!result || typeof result === 'boolean') {
                    dd.valid           = result !== false;
                    dd.context.message = '';
                }
                else {
                    dd.valid           = result.valid !== false;
                    dd.context.message = result.message;
                }
            }
            else {
                // Apply cached value from external drag validation
                dd.valid = dd.externalDragValidity !== false && dd.externalDragValidity?.valid !== false;
            }
        }
        else {
            dd.valid = false;
        }

        dd.context.valid = dd.valid;
    }

    suspendRecordElementRedrawing(record, suspend = true) {
        this.suspendElementRedrawing(this.getRecordElement(record), suspend);
        // <remove-on-release>
        // TODO: temporary get rid of retainElement joggling to check tests
        // </remove-on-release>
        record.instanceMeta(this.client).retainElement = suspend;
    }

    resumeRecordElementRedrawing(record) {
        this.suspendRecordElementRedrawing(record, false);
    }

    suspendElementRedrawing(element, suspend = true) {
        // <remove-on-release>
        // TODO: temporary get rid of retainElement joggling to check tests
        // </remove-on-release>
        if (element) {
            element.retainElement = suspend;
        }
    }

    resumeElementRedrawing(element) {
        this.suspendElementRedrawing(element, false);
    }

    /**
     * Initializes drag data (dates, constraints, dragged events etc). Called when drag starts.
     * @private
     * @param {Object} info
     * @returns {*}
     */
    getDragData(info) {
        const
            me                = this,
            {
                client,
                drag,
                recordProperty,
                recordsProperty
            }  = me,
            productDragData   = me.setupProductDragData(info),
            {
                [recordProperty]  : record,
                [recordsProperty] : records,
                eventBarEls
            }                 = productDragData,
            { startEvent }    = drag,
            timespan          = record.isAssignment ? record.event : record,
            origStart         = timespan.startDate,
            origEnd           = timespan.endDate,
            timeAxis          = client.timeAxis,
            startsOutsideView = origStart < timeAxis.startDate,
            endsOutsideView   = origEnd > timeAxis.endDate,
            multiSelect       = client.isSchedulerBase ? Boolean(client.multiEventSelect) : client.selectionMode.multiSelect,
            coordinate        = me.getCoordinate(timespan, info.element, [info.elementStartX, info.elementStartY]),
            clientCoordinate  = me.getCoordinate(timespan, info.element, [info.startClientX, info.startClientY]);

        me.suspendRecordElementRedrawing(record);

        // prevent elements from being released when out of view
        records.forEach(record => me.suspendRecordElementRedrawing(record));

        // Make sure the dragged event is selected (no-op for already selected)
        // Preserve other selected events if ctrl/meta is pressed
        if (!client.selectionMode.checkboxOnly) {
            if (record.isAssignment) {
                client.selectAssignment(record, startEvent.ctrlKey && multiSelect);
            }
            else {
                client.selectEvent(record, startEvent.ctrlKey && multiSelect);
            }
        }

        const dragData = {
            context : info,
            ...productDragData,

            sourceDate       : startsOutsideView ? origStart : client.getDateFromCoordinate(coordinate),
            screenSourceDate : client.getDateFromCoordinate(clientCoordinate, null, false),

            startDate : origStart,
            endDate   : origEnd,
            timeDiff  : 0,

            origStart,
            origEnd,
            startsOutsideView,
            endsOutsideView,

            duration     : origEnd - origStart,
            browserEvent : startEvent // So we can know if SHIFT/CTRL was pressed
        };

        if (eventBarEls.length > 1) {
            // RelatedElements are secondary elements moved by the same delta as the grabbed element
            info.relatedElements = eventBarEls.filter(el => el && el !== drag.context.grabbed);
        }

        eventBarEls.forEach(el => el?.classList.remove('b-sch-event-hover', 'b-active'));

        return dragData;
    }

    //endregion

    //region Constraints

    // private
    setupConstraints(constrainRegion, elRegion, tickSize, constrainX, constrainY) {
        const
            me        = this,
            xTickSize = !me.showExactDropPosition && tickSize > 1 ? tickSize : 0,
            yTickSize = 0;

        // If `constrained` is false then we have no date constraints and should constrain mouse position to scheduling area
        // else we have specified date constraints and so we should limit mouse position to smaller region inside the
        // constrained region using offsets and width.
        if (constrainX) {
            me.setXConstraint(constrainRegion.left, constrainRegion.right - elRegion.width, xTickSize);
        }
        // And if not constrained, release any constraints from the previous drag.
        else {
            // minX being true means allow the start to be before the time axis.
            // maxX being true means allow the end to be after the time axis.
            me.setXConstraint(true, true, xTickSize);
        }

        if (constrainY) {
            me.setYConstraint(constrainRegion.top, constrainRegion.bottom - elRegion.height, yTickSize);
        }
        else {
            me.setYConstraint(0, true, yTickSize);
        }
    }

    updateYConstraint(eventRecord, resourceRecord) {
        const
            me          = this,
            { client }  = me,
            { context } = me.drag,
            tickSize    = client.timeAxisViewModel.snapPixelAmount;

        // If we're dragging when the vertical size is recalculated by the host grid,
        // we must update our Y constraint unless we are locked in the Y axis.
        if (context && !me.drag.lockY) {
            let constrainRegion;

            // This calculates a relative region which the DragHelper uses within its outerElement
            if (me.constrainDragToTimeline) {
                constrainRegion = client.getScheduleRegion(resourceRecord, eventRecord);
            }
            // Not constraining to timeline.
            // Unusual configuration, but this must mean no Y constraining.
            else {
                me.setYConstraint(null, null, tickSize);
                return;
            }

            me.setYConstraint(
                constrainRegion.top,
                constrainRegion.bottom - context.element.offsetHeight,
                tickSize
            );
        }
        else {
            me.setYConstraint(null, null, tickSize);
        }
    }

    setXConstraint(iLeft, iRight, iTickSize) {
        const { drag } = this;

        drag.minX = iLeft;
        drag.maxX = iRight;
    }

    setYConstraint(iUp, iDown, iTickSize) {
        const { drag } = this;

        drag.minY = iUp;
        drag.maxY = iDown;
    }

    //endregion

    //region Other stuff

    adjustStartDate(startDate, timeDiff) {
        const
            { currentOverClient } = this,
            rounded               = currentOverClient.timeAxis.roundDate(
                new Date(startDate - 0 + timeDiff),
                currentOverClient.snapRelativeToEventStartDate || (currentOverClient.snap && currentOverClient.fillTicks) ? startDate : false
            );

        // For fillTicks mode with a day-timeaxis, maintain event time when drag dropping
        if (currentOverClient.fillTicks && (currentOverClient.timeAxis.mainUnit === 'day' || DateHelper.compareUnits(currentOverClient.timeResolution.unit, 'd') === 0)) {
            DateHelper.copyTimeValues(rounded, this.dragData.origStart);
        }

        return this.constrainStartDate(rounded);
    }

    normalizeDraggedElement(draggedElement) {
        return DomHelper.down(draggedElement, this.currentOverClient.eventInnerSelector);
    }

    resolveStartEndDates(draggedElement) {
        const
            {
                recordProperty,
                currentOverClient : timeline
            }                 = this,
            { timeAxis, rtl } = timeline,
            normalizedElement = this.normalizeDraggedElement(draggedElement),
            proxyRect         = Rectangle.from(normalizedElement, !rtl && timeline.timeAxisSubGridElement),
            dd                = this.dragData,
            record            = dd[recordProperty],
            eventRecord       = record.isAssignment ? record.event : record,
            fillSnap          = timeline.fillTicks && timeline.snapRelativeToEventStartDate,
            // Cannot calculate using `eventRecord.duration`, since it in Enterprise does not include non-working time
            totalDurationMS   = eventRecord.endDate - eventRecord.startDate;

        // Non-continuous time axis will return null instead of date for a rectangle outside of the view unless
        // told to estimate date.
        // When using fillTicks, we need exact dates for calculations below
        let {
            start : startDate, end : endDate
        } = timeline.getStartEndDatesFromRectangle(proxyRect, fillSnap ? null : 'round', totalDurationMS, true, !rtl);

        // if dragging is out of timeAxis rect bounds, we will not be able to get dates
        if (startDate && endDate) {
            // When filling ticks, proxy start does not represent actual start date.
            // Need to compensate to get expected result
            if (fillSnap) {
                const
                    // Events offset into the tick, in MS
                    offsetMS = eventRecord.startDate - DateHelper.startOf(eventRecord.startDate, timeAxis.unit),
                    // Proxy length in MS
                    proxyMS  = endDate - startDate,
                    // Part of proxy that is "filled" and needs to be removed
                    offsetPx = (offsetMS / proxyMS) * proxyRect.width;

                // Deflate top for vertical mode, left for horizontal mode
                proxyRect.deflate(timeline.isVertical ? offsetPx : 0, 0, 0, timeline.isHorizontal ? offsetPx : 0);

                const proxyStart = proxyRect.getStart(timeline.rtl, !timeline.isVertical);

                // Get date from offset proxy start
                startDate = timeline.getDateFromCoordinate(proxyStart, null, true);
                // Snap relative to event start date
                startDate = timeAxis.roundDate(startDate, eventRecord.startDate);
            }

            startDate = this.adjustStartDate(startDate, 0);

            if (!dd.startsOutsideView) {
                // Make sure we didn't target a start date that is filtered out, if we target last hour cell (e.g. 21:00) of
                // the time axis, and the next tick is 08:00 following day. Trying to drop at end of 21:00 cell should target start of next cell
                if (!timeAxis.dateInAxis(startDate, false)) {
                    const tick = timeAxis.getTickFromDate(startDate);

                    if (tick >= 0) {
                        startDate = timeAxis.getDateFromTick(tick);
                    }
                }

                // In RTL mode with non-continuous time axis, the "start" position actually represents
                // the end of the event in RTL. We need to swap startDate and endDate to maintain correct
                // chronological order: startDate becomes endDate, and we calculate the new startDate by subtracting duration.
                if (rtl) {
                    endDate   = startDate;
                    startDate = endDate && DateHelper.add(endDate, -totalDurationMS);
                }
                else {
                    endDate = startDate && DateHelper.add(startDate, totalDurationMS);
                }
            }
            else if (!dd.endsOutsideView) {
                // In RTL mode with non-continuous time axis, the "end" position actually represents
                // the start of the event in RTL. We need to swap startDate and endDate to maintain correct
                // chronological order: endDate becomes startDate, and we calculate the new endDate by adding duration.
                if (rtl) {
                    startDate = endDate;
                    endDate = endDate && DateHelper.add(endDate, totalDurationMS);
                }
                else {
                    startDate = endDate && DateHelper.add(endDate, -totalDurationMS);
                }
            }
        }

        return {
            startDate,
            endDate
        };
    }

    applyResolvedStartEndDates(eventRecord, range, client) {
        const { dragData } = this;

        dragData.startDate = range.startDate;
        dragData.endDate = range.endDate;
    }

    //endregion

    //region Dragtip

    /**
     * Gets html to display in tooltip while dragging event. Uses clockTemplate to display start & end dates.
     */
    getTipHtml() {
        const
            me = this,
            {
                dragData,
                client,
                tooltipTemplate,
                recordProperty
            }                                      = me,
            { startDate, endDate, newResource }    = dragData,
            startText                              = client.getFormattedDate(startDate),
            endText                                = (endDate && client.getFormattedEndDate(endDate, startDate)) || '',
            { valid, message, element, dragProxy } = dragData.context,
            tipTarget                              = dragProxy ? dragProxy.firstChild : element,
            record                                 = dragData[recordProperty],
            // Scheduler always drags assignments
            timeSpanRecord                         = record.isAssignment ? record.event : record;

        // Keep align target up to date in case of derendering the target when
        // dragged outside render window, and re-entry into the render window.
        me.tip.lastAlignSpec.target = tipTarget;

        return tooltipTemplate({
            valid,
            startDate,
            endDate,
            startText,
            endText,
            dragData,
            newResource                            : newResource || dragData.resourceRecord,
            message                                : message || '',
            [client.scheduledEventName + 'Record'] : timeSpanRecord,
            startClockHtml                         : me.clockTemplate.template({
                date : startDate,
                text : startText,
                cls  : 'b-sch-tooltip-start-date'
            }),
            endClockHtml : timeSpanRecord.isMilestone
                ? ''
                : me.clockTemplate.template({
                    date : endDate,
                    text : endText,
                    cls  : 'b-sch-tooltip-end-date'
                })
        });
    }

    //endregion

    //region Configurable

    // Constrain to time slot means lockX if we're horizontal, otherwise lockY
    updateConstrainDragToTimeSlot(value) {
        if (this.drag) {
            const axis = this.client.isHorizontal ? 'lockX' : 'lockY';
            this.drag[axis] = value;
        }
    }

    // Constrain to resource means lockY if we're horizontal, otherwise lockX
    updateConstrainDragToResource(constrainDragToResource) {
        const me = this;

        if (me.drag) {
            const
                { constrainDragToTimeSlot } = me,
                { isHorizontal }            = me.client;

            if (constrainDragToResource) {
                me.constrainDragToTimeline = true;
            }
            me.drag.lockY = isHorizontal ? constrainDragToResource : constrainDragToTimeSlot;
            me.drag.lockX = isHorizontal ? constrainDragToTimeSlot : constrainDragToResource;
        }
    }

    internalOnBeforeModeSwitch() {
        // Abort any in-flight drag before the scheduler switches modes
        this.drag?.abort?.();
    }

    internalOnModeChange() {
        // Rebuild the DragHelper after a runtime mode switch
        this.drag?.destroy();
        this.drag = DragHelper.new(this.buildDragHelperConfig());
    }

    updateConstrainDragToTimeline(constrainDragToTimeline) {
        if (!this.isConfiguring) {
            Object.assign(this.drag, {
                cloneTarget      : !constrainDragToTimeline,
                allowDropOutside : !constrainDragToTimeline,
                dragWithin       : constrainDragToTimeline ? null : this.client.floatRoot,
                scrollManager    : constrainDragToTimeline ? this.client.scrollManager : null
            });
        }
    }

    constrainStartDate(startDate) {
        const
            {
                dragData,
                recordProperty
            }                   = this,
            { dateConstraints } = dragData,
            record              = dragData[recordProperty],
            eventRecord         = record.isAssignment ? record.event : record;

        if (dateConstraints?.start) {
            startDate = DateHelper.max(dateConstraints.start, startDate);
        }

        if (dateConstraints?.end) {
            startDate = DateHelper.min(new Date(dateConstraints.end - eventRecord.rawDurationMS), startDate);
        }

        return startDate;
    }

    //endregion

    //region Product specific, implemented in subclasses
    getElementFromContext(context) {
        return context.grabbed || context.dragProxy || context.element;
    }

    // Provide your custom implementation of this to allow additional selected records to be dragged together with the original one.
    getRelatedRecords(record) {
        return [];
    }

    getMinimalDragData(info, event) {
        // Can be overridden in subclass
        return {};
    }

    // Check if element can be dropped at desired location
    isValidDrop(dragData) {
        throw new Error('Implement in subclass');
    }

    // Similar to the fn above but also calls validatorFn
    checkDragValidity(dragData) {
        throw new Error('Implement in subclass');
    }

    /**
     * Updates the dragged records.
     * The method is called to apply changes to the records on successful completion of the drag operation.
     *
     * Should not be called directly, except if the app is configured with a {@link #config-updateRecordsFn}
     * to customize the logic for applying changes.
     * @param {DragData} dragData Drag data.
     * @returns {Promise|void} Can return a `Promise` resolving once the changes are applied
     * (if the process is asynchronous).
    */
    updateRecords(dragData) {
        throw new Error('Implement in subclass');
    }

    // Determine if an element can be dragged
    isElementDraggable(el, event) {
        throw new Error('Implement in subclass');
    }

    // Get coordinate for correct axis
    getCoordinate(record, element, coord) {
        throw new Error('Implement in subclass');
    }

    // Product specific drag data
    setupProductDragData(info) {
        throw new Error('Implement in subclass');
    }

    // Product specific data in drag context
    getProductDragContext(dd) {
        throw new Error('Implement in subclass');
    }

    getRecordElement(record) {
        throw new Error('Implement in subclass');
    }

    //endregion
}
