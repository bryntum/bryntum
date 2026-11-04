import BrowserHelper from '../../../Core/helper/BrowserHelper.js';
import DomSync from '../../../Core/helper/DomSync.js';
import Base from '../../../Core/Base.js';
import Model from '../../../Core/data/Model.js';
import ArrayHelper from '../../../Core/helper/ArrayHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import AttachToProjectMixin from '../../data/mixin/AttachToProjectMixin.js';
import ZoomSnapshotRendering from './ZoomSnapshotRendering.js';


/**
 * @module Scheduler/view/orientation/HorizontalRendering
 */

/**
 * @typedef {Object} HorizontalRenderData
 * @property {Scheduler.model.EventModel} eventRecord
 * @property {Date} start Span start
 * @property {Date} end Span end
 * @property {String} rowId Id of the resource row
 * @property {DomConfig[]} children Child elements
 * @property {Number} startMS Wrap element start in milliseconds
 * @property {Number} endMS Span Wrap element end in milliseconds
 * @property {Number} durationMS Wrap duration in milliseconds (not just a difference between start and end)
 * @property {Number} innerStartMS Actual event start in milliseconds
 * @property {Number} innerEndMS Actual event end in milliseconds
 * @property {Number} innerDurationMS Actual event duration in milliseconds
 * @property {Boolean} startsOutsideView True if span starts before time axis start
 * @property {Boolean} endsOutsideView True if span ends after time axis end
 * @property {Number} left Absolute left coordinate of the wrap element
 * @property {Number} width
 * @property {Number} top Absolute top coordinate of the wrap element (can be changed by layout)
 * @property {Number} height
 * @property {Boolean} clippedStart True if start is clipped
 * @property {Boolean} clippedEnd True if end is clipped
 * @private
 */

const
    releaseEventActions = {
        releaseElement : 1, // Not used at all at the moment
        reuseElement   : 1  // Used by some other element
    },
    renderEventActions  = {
        newElement      : 1,
        reuseOwnElement : 1,
        reuseElement    : 1
    },
    MAX_WIDTH           = 9999999,
    MIN_DATE            = new Date(0),
    MAX_DATE            = new Date(9999, 0, 1),
    heightEventSorter   = ({ startDateMS : lhs }, { startDateMS : rhs }) => lhs - rhs,
    chronoFields        = {
        startDate : 1,
        endDate   : 1,
        duration  : 1
    };

function getStartEnd(scheduler, eventRecord, useEnd, fieldName, useEventBuffer, resourceRecord) {


    // Must use Model.get in order to get latest values in case we are inside a batch.
    // EventResize changes the endDate using batching to enable a tentative change
    // via the batchedUpdate event which is triggered when changing a field in a batch.
    // Fall back to accessor if propagation has not populated date fields.
    const date = eventRecord.isBatchUpdating ? eventRecord.get(fieldName) : eventRecord[fieldName];

    // Use shared helper for fillTicks date snapping
    return scheduler.getTickSnappedDate(date, useEnd, eventRecord, fieldName)?.getTime();
}

/**
 * Handles event rendering in Schedulers horizontal mode. Reacts to project/store changes to keep the UI up to date.
 *
 * @internal
 */
export default class HorizontalRendering extends Base.mixin(AttachToProjectMixin, ZoomSnapshotRendering) {
    //region Config & Init

    static $name = 'HorizontalRendering';

    static configurable = {
        /**
         * Amount of pixels to extend the current visible range at both ends with when deciding which events to
         * render. Only applies when using labels or for milestones
         * @config {Number}
         * @default
         */
        bufferSize : 150,

        verticalBufferSize : 150,

        maxZIndexStacks : 50
    };

    static get properties() {
        return {
            // Map with event DOM configs, keyed by resource id
            resourceMap            : new Map(),
            // Map with visible events DOM configs, keyed by row instance
            rowMap                 : new Map(),
            eventConfigs           : [],
            entityNames            : new Set(),
            toDrawOnProjectRefresh : new Set(),
            toDrawOnDataReady      : new Set()
        };
    }

    construct(scheduler) {
        const me = this;

        me.client = me.scheduler = scheduler;
        me.eventSorter = me.eventSorter.bind(scheduler);
        me.scrollBuffer = scheduler.scrollBuffer;

        // Catch scroll before renderers are called
        scheduler.scrollable.ion({
            scroll  : 'onEarlyScroll',
            prio    : 1,
            thisObj : me
        });

        me.attachRowManagerListeners();

        super.construct({});
    }

    attachRowManagerListeners() {
        // Detach first to avoid duplicates when reactivating
        this.detachListeners('rowManager');
        this.scheduler.rowManager.ion({
            name            : 'rowManager',
            renderDone      : 'onRenderDone',
            removeRows      : 'onRemoveRows',
            translateRow    : 'onTranslateRow',
            offsetRows      : 'onOffsetRows',
            beforeRowHeight : 'onBeforeRowHeightChange',
            thisObj         : this
        });
    }

    // No-op for horizontal mode. Vertical mode uses init() to set up resource columns.
    // Called from TimelineBase.construct().
    init() {}

    // Activates this rendering engine. Called when switching from vertical to horizontal mode at runtime.
    activate() {
        const
            me            = this,
            { scheduler } = me,
            { project }   = scheduler;

        me.clearAll(); // Clear any cached data

        // Flag that the first resource change after this mode switch needs an extra render pass for proper DOM
        // synchronization
        me._needsPostModeRender = true;

        // Reattach rowManager listeners (detached on deactivate)
        me.attachRowManagerListeners();

        if (me.project !== project) {
            me.attachToProject(project);
        }
        // Always reattach to stores - they may have been detached or not yet attached
        me.attachToResourceStore(project.resourceStore);
        me.attachToEventStore(project.eventStore);
        me.attachToAssignmentStore(project.assignmentStore);
    }

    // Deactivates this rendering engine. Called when switching from horizontal to vertical mode at runtime.
    deactivate() {
        this.detachListeners('rowManager', 'assignmentStore', 'eventStore', 'resourceStore', 'project');
        this.clearAll({ clearDom : true });
    }

    updateVerticalBufferSize() {
        const { scheduler } = this;
        if (scheduler.isPainted && scheduler.currentOrientation === this) {
            // Refresh rows when vertical buffer size changes to trigger event repaint. Required for the export feature.
            scheduler.rowManager.renderRows(scheduler.rowManager.rows);
        }
    }

    //endregion

    //region Region, dates & coordinates

    get visibleDateRange() {
        return this._visibleDateRange;
    }

    getDateFromXY(xy, roundingMethod, local, allowOutOfRange = false) {
        const { scheduler } = this;

        let coord = xy[0];

        if (!local) {
            coord = this.translateToScheduleCoordinate(coord);
        }

        coord = scheduler.getRtlX(coord);

        return scheduler.timeAxisViewModel.getDateFromPosition(coord, roundingMethod, allowOutOfRange);
    }

    translateToScheduleCoordinate(x) {
        const
            { scheduler }  = this,
            { scrollable } = scheduler.timeAxisSubGrid;

        let result = x - scheduler.timeAxisSubGridElement.getBoundingClientRect().left - globalThis.scrollX;

        // Because we use getBoundingClientRect's left, we have to adjust for page scroll.
        // The vertical counterpart uses the _bodyRectangle which was created with that adjustment.

        if (scheduler.rtl) {
            result += scrollable.maxX - scrollable.x;
        }
        else {
            result += scrollable.x;
        }

        return result;
    }

    translateToPageCoordinate(x) {
        const
            { scheduler }  = this,
            { scrollable } = scheduler.timeAxisSubGrid;

        let result = x + scheduler.timeAxisSubGridElement.getBoundingClientRect().left;

        if (scheduler.rtl) {
            result -= scrollable.maxX - Math.abs(scheduler.scrollLeft);
        }
        else {
            result -= scheduler.scrollLeft;
        }

        return result;
    }

    /**
     * Gets the region, relative to the page, represented by the schedule and optionally only for a single resource.
     * This method will call getDateConstraints to allow for additional resource/event based constraints. By overriding
     * that method you can constrain events differently for different resources.
     * @param {Scheduler.model.ResourceModel} [resourceRecord] (optional) The row record
     * @param {Scheduler.model.EventModel} [eventRecord] (optional) The event record
     * @returns {Core.helper.util.Rectangle} The region of the schedule
     */
    getScheduleRegion(resourceRecord, eventRecord, local = true, dateConstraints = null, stretch = false) {
        const
            me                                   = this,
            { scheduler }                        = me,
            { timeAxisSubGridElement, timeAxis } = scheduler,
            { start, end }                       = (!stretch || resourceRecord) && scheduler.getResourceMarginObject(resourceRecord) || { start : 0, end : 0 };

        let region;

        if (resourceRecord) {
            const
                row          = scheduler.getRowById(resourceRecord.id),
                eventElement = eventRecord && scheduler.getElementsFromEventRecord(eventRecord, resourceRecord)[0];

            // If the row is in rendered space, use its rectangle.
            // If not, use the calculated rectangle. This will be adjusted as we respond
            // to change events
            region = row ? Rectangle.from(row.getElement('normal'), timeAxisSubGridElement) : scheduler.getRecordCoords(resourceRecord, true);

            if (!region) {
                return null;
            }

            if (eventElement) {
                const eventRegion = Rectangle.from(eventElement, timeAxisSubGridElement);

                region.y      = eventRegion.y;
                region.bottom = eventRegion.bottom;
            }
            else {
                region.y      = region.y + start;
                region.bottom = region.bottom - end;
            }
        }
        else {
            // <remove-on-release>
            // TODO: This is what the function that was removed here did.
            // </remove-on-release>
            // The coordinate space needs to be sorted out here!
            region       = Rectangle.from(timeAxisSubGridElement).moveTo(null, 0);
            region.width = timeAxisSubGridElement.scrollWidth;

            region.y      = region.y + start;
            region.bottom = region.bottom - end;
        }

        const
            taStart = timeAxis.startDate,
            taEnd   = timeAxis.endDate;

        dateConstraints = (dateConstraints?.start && dateConstraints) || scheduler.getDateConstraints?.(resourceRecord, eventRecord) || {
            start : taStart,
            end   : taEnd
        };

        dateConstraints.start = dateConstraints.start || MIN_DATE;
        dateConstraints.end = dateConstraints.end || MAX_DATE;

        const fullyOutSide = dateConstraints.end <= taStart || dateConstraints.start >= taEnd;

        let startX = fullyOutSide ? -1 : scheduler.getVirtualCoordFromDate(dateConstraints.start ? DateHelper.max(taStart, dateConstraints.start) : taStart),
            endX   = fullyOutSide ? -1 : scheduler.getVirtualCoordFromDate(dateConstraints.end ? DateHelper.min(taEnd, dateConstraints.end) : taEnd);

        if (!local) {
            startX = me.translateToPageCoordinate(startX);
            endX   = me.translateToPageCoordinate(endX);
        }

        region.left  = Math.min(startX, endX);
        region.right = Math.max(startX, endX);

        return region;
    }

    /**
     * Gets the Region, relative to the timeline view element, representing the passed row and optionally just for a
     * certain date interval.
     * @param {Core.data.Model} rowRecord The row record
     * @param {Date} startDate A start date constraining the region
     * @param {Date} endDate An end date constraining the region
     * @returns {Core.helper.util.Rectangle} The Rectangle which encapsulates the row
     */
    getRowRegion(rowRecord, startDate, endDate) {
        const
            { scheduler } = this,
            { timeAxis }  = scheduler,
            row           = scheduler.getRowById(rowRecord.id);

        // might not be rendered
        if (!row) {
            return null;
        }

        const
            taStart = timeAxis.startDate,
            taEnd   = timeAxis.endDate,
            start   = startDate ? DateHelper.max(taStart, startDate) : taStart,
            end     = endDate ? DateHelper.min(taEnd, endDate) : taEnd,
            startX  = scheduler.getCoordinateFromDate(start),
            endX    = scheduler.getCoordinateFromDate(end, true, true),
            y       = row.top,
            x       = Math.min(startX, endX),
            bottom  = y + row.offsetHeight;

        return new Rectangle(x, y, Math.max(startX, endX) - x, bottom - y);
    }

    getResourceEventBox(eventRecord, resourceRecord, includeOutside, roughly = false) {
        const
            { scheduler } = this,
            resourceData  = this.resourceMap.get(resourceRecord.id);

        let eventLayout = null,
            approx      = false;

        if (resourceData) {
            eventLayout = resourceData.eventsData.find(d => d.eventRecord === eventRecord);
        }

        // Outside of view, layout now if supposed to be included
        if (!eventLayout) {
            eventLayout = this.getTimeSpanRenderData(
                eventRecord,
                resourceRecord,
                { viewport : true, timeAxis : includeOutside }
            );

            approx = true;
        }

        if (eventLayout) {
            // Event layout is relative to row, need to make to absolute before returning
            const
                // Event might be outside visible area, estimate the height (for managedEventSizing = false case)
                boxHeight   = eventLayout.height ?? scheduler.getResourceLayoutSettings(resourceRecord).contentHeight,
                rowBox      = scheduler.rowManager.getRecordCoords(resourceRecord, true, roughly);

            if (!rowBox) {
                return null;
            }

            const
                absoluteTop = eventLayout.top + rowBox.top,
                box         = new Rectangle(eventLayout.left, absoluteTop, eventLayout.width, boxHeight);

            // Flag informing other parts of the code that this box is approximated
            box.layout    = !approx;
            box.rowTop    = rowBox.top;
            box.rowBottom = rowBox.bottom;

            box.resourceId = resourceRecord.id;

            return box;
        }

        return null;
    }

    getMilestoneInnerRect(wrapRect, eventRecord) {
        if (!eventRecord?.isMilestone) {
            return wrapRect;
        }

        const { x, y, height } = wrapRect;

        if (this.client.isMilestoneInsetLayout(eventRecord)) {
            // Inset layout: wrap spans tip-to-tip [◆━━bar━━◆]; inner is the connecting bar, inset by half a milestone each side
            return new Rectangle(x + height / 2, y, Math.max(0, wrapRect.width - height), height);
        }

        // Default / always-outside: inner is the diamond square (height × height) anchored at wrap.x; wrap may extend for label,
        // So we need to adjust for just the milestone diamond.
        return new Rectangle(x, y, height, height);
    }

    //endregion

    //region Element <-> Record mapping

    resolveRowRecord(elementOrEvent) {
        const
            me            = this,
            { scheduler } = me,
            element       = elementOrEvent.nodeType ? elementOrEvent : elementOrEvent.target,
            // Fix for FF on Linux having text nodes as event.target
            el            = element.nodeType === Element.TEXT_NODE ? element.parentElement : element,
            eventNode     = el.closest('[data-resource-id]');

        if (eventNode) {
            return me.resourceStore.getById(eventNode.dataset.resourceId);
        }

        return scheduler.getRecordFromElement(el);
    }

    //endregion

    //region Project

    attachToProject(project) {
        super.attachToProject(project);

        this.refreshAllWhenReady = true;

        // Perform a full clear when replacing the project, to not leave any references to old project in DOM
        if (!this.scheduler.isConfiguring) {
            this.clearAll({ clearDom : true });
        }

        project?.ion({
            name            : 'project',
            refresh         : 'onProjectRefresh',
            commitFinalized : 'onProjectCommitFinalized',
            thisObj         : this
        });
    }

    onProjectCommitFinalized() {
        const { scheduler, toDrawOnDataReady, project } = this;

        // Only update the UI immediately if we are visible
        if (scheduler.isVisible) {
            if (scheduler.isPainted && !scheduler.refreshSuspended) {
                // If this is a timezone commit, we got here from a store dataset
                // We need to do a full refresh
                if (!toDrawOnDataReady.size && project.timeZone != null && project.ignoreRecordChanges) {
                    project.resourceStore.forEach(r => toDrawOnDataReady.add(r.id));
                }
                if (toDrawOnDataReady.size) {
                    this.clearResources(toDrawOnDataReady);
                    this.refreshResources(toDrawOnDataReady);
                }

                toDrawOnDataReady.clear();
            }
        }
        // Otherwise wait till next time we get painted (shown, or a hidden ancestor shown)
        else {
            scheduler.whenVisible('refreshRows');
        }
    }

    onProjectRefresh({ isCalculated, isInitialCommit }) {
        const
            me                                    = this,
            { scheduler, toDrawOnProjectRefresh } = me;

        // Only update the UI immediately if we are visible
        if (scheduler.isVisible) {

            // We want to ensure we know correct heights even if refresh is suspended
            if (me.refreshAllWhenReady || (isInitialCommit && isCalculated)) {
                scheduler.calculateAllRowHeights(true);
            }

            if (scheduler.isPainted && !scheduler.isConfiguring && !scheduler.refreshSuspended) {
                // Either refresh all rows (on for example dataset or when delayed calculations are finished)
                if (me.refreshAllWhenReady || (isInitialCommit && isCalculated)) {
                    const { rowManager } = scheduler;

                    // Rows rendered? Refresh
                    if (rowManager.topRow) {
                        me.clearAll();

                        // Refresh only if it won't be refreshed elsewhere (SchedulerStore#onProjectRefresh())
                        if (!scheduler.refreshAfterProjectRefresh) {
                            // If refresh was suspended when replacing the dataset in a scrolled view we might end up with a
                            // topRow outside of available range -> reset it. Call renderRows() to mimic what normally happens
                            // when refresh is not suspended
                            if (rowManager.topRow.dataIndex >= scheduler.store.count) {
                                scheduler.renderRows(false);
                            }
                            else {
                                scheduler.refreshWithTransition(false, isCalculated && !isInitialCommit);
                            }
                        }
                    }
                    // No rows yet, reinitialize (happens if initial project empty and then non empty project assigned)
                    else {
                        rowManager.reinitialize();
                    }

                    me.refreshAllWhenReady = false;
                }
                // Or only affected rows (if any)
                else if (toDrawOnProjectRefresh.size) {
                    me.refreshResources(toDrawOnProjectRefresh);
                }

                toDrawOnProjectRefresh.clear();
            }
        }
        // Otherwise wait till next time we get painted (shown, or a hidden ancestor shown)
        else {
            scheduler.whenVisible('refresh', scheduler, [true]);
        }
    }

    //endregion

    //region AssignmentStore

    attachToAssignmentStore(assignmentStore) {
        this.refreshAllWhenReady = true;

        super.attachToAssignmentStore(assignmentStore);

        if (assignmentStore) {
            assignmentStore.ion({
                name             : 'assignmentStore',
                changePreCommit  : 'onAssignmentStoreChange',
                refreshPreCommit : 'onAssignmentStoreRefresh',
                thisObj          : this
            });
        }
    }

    onAssignmentStoreChange({ source, action, records : assignmentRecords = [], replaced, changes }) {
        const
            me            = this,
            { scheduler } = me,
            resourceIds   = new Set(assignmentRecords.flatMap(assignmentRecord => ([
                assignmentRecord.resourceId,
                // Also include any linked resources (?. twice since resource might not be resolved and point to id)
                ...assignmentRecord.resource?.$links?.map(link => link.id) ?? []
            ])));

        // Ignore assignment changes caused by removing resources, the remove will redraw things anyway
        // Also ignore case when resource id is changed. In this case row will be refreshed by the grid
        if (me.resourceStore.isRemoving || me.resourceStore.isChangingId) {
            return;
        }

        if (action === 'replace') {
            // Gather resources from both the old record and the new one
            replaced.forEach(([oldAssignment, newAssignment]) => {
                resourceIds.add(oldAssignment.resourceId);
                resourceIds.add(newAssignment.resourceId);
            });
        }
        // When reassigning, refresh old resource also
        else if (action === 'update' && 'resourceId' in changes) {
            resourceIds.add(changes.resourceId.oldValue);
        }
        else if (action === 'update' && 'resource' in changes) {
            resourceIds.add(changes.resource.oldValue);
        }
        else if (action === 'clearchanges') {
            changes.added.forEach(r => resourceIds.add(r.resourceId));
            changes.removed.forEach(r => resourceIds.add(r.resourceId));
        }

        // Also the rows rendering the events on behalf of their resources (GroupRollups)
        scheduler.addRenderingRowIds(resourceIds);

        switch (action) {
            // These operations will invalidate the graph, need to draw later
            case 'dataset': {
                // Ignore dataset when using single assignment mode
                if (!me.eventStore.usesSingleAssignment) {
                    if (resourceIds.size) {
                        me.refreshResourcesWhenReady(resourceIds);
                    }
                    else {
                        me.clearAll();
                        scheduler.refreshWithTransition();
                    }
                }
                return;
            }

            case 'add':
            case 'remove':
                me.refreshResourcesWhenReady(resourceIds);
                return;

            case 'removeall':
                me.refreshAllWhenReady = true;
                return;

            case 'replace':
                // Resources from both the old record and the new one, gathered above
                me.refreshResourcesWhenReady(resourceIds);
                return;

            // These operations won't invalidate the graph, redraw now
            case 'filter':
                me.clearAll();
                scheduler.calculateAllRowHeights(true);
                scheduler.refreshWithTransition();
                return;

            case 'update': {
                // Buffer time is not a graph field, so no dataReady arrives for it and it has to refresh directly
                let bufferChanged = false;



                if (bufferChanged || 'eventId' in changes || 'resourceId' in changes || 'id' in changes || 'resource' in changes || 'event' in changes) {
                    // When chaining stores in single assignment mode, we might not be the project store
                    if (!bufferChanged && source === scheduler.project.assignmentStore) {
                        me.refreshResourcesOnDataReady(resourceIds);
                    }
                    // Refresh directly when we are not
                    else {
                        me.refreshResources(resourceIds);
                    }
                }
                break;
            }

            case 'clearchanges': {
                // If modified records appear in the clearchanges action we need to refresh entire view
                // because we have not enough information about previously assigned resource
                if (changes.modified.length) {
                    scheduler.refreshWithTransition();
                }
                else {
                    // Resources of the added and removed records, gathered above
                    me.refreshResourcesOnDataReady(resourceIds);
                }
            }
        }
    }

    onAssignmentStoreRefresh({ action, records }) {
        if (action === 'batch') {
            this.clearAll();
            this.scheduler.refreshWithTransition();
        }
    }

    //endregion

    //region EventStore

    attachToEventStore(eventStore) {
        this.refreshAllWhenReady = true;

        super.attachToEventStore(eventStore);

        if (eventStore) {
            eventStore.ion({
                name             : 'eventStore',
                addConfirmed     : 'onEventStoreAddConfirmed',
                refreshPreCommit : 'onEventStoreRefresh',
                thisObj          : this
            });
        }
    }

    onEventStoreAddConfirmed({ record }) {
        for (const element of this.client.getElementsFromEventRecord(record)) {
            element.classList.remove('b-is-creating');
        }
    }

    onEventStoreRefresh({ action }) {
        if (action === 'batch') {
            const { scheduler } = this;
            if (scheduler.isEngineReady && scheduler.isPainted) {
                this.clearAll();
                scheduler.refreshWithTransition();
            }
        }
    }

    onEventStoreChange({ action, records : eventRecords = [], record, replaced, changes, source }) {
        const
            me                  = this,
            { scheduler }       = me,
            isResourceTimeRange = source.isResourceTimeRangeStore,
            resourceIds         = new Set();

        if (!scheduler.isPainted) {
            return;
        }

        eventRecords.forEach(eventRecord => {
            // When rendering a Gantt project, the project model also passes through here -> no `resources`
            eventRecord.$linkedResources?.forEach(resourceRecord => resourceIds.add(resourceRecord.id));
        });

        // Also rows rendering the events on behalf of their resources (GroupRollups)
        scheduler.addRenderingRowIds(resourceIds);

        // Update all resource rows to which this event is assigned *if* the resourceStore
        // contains that resource (We could have filtered the resourceStore)
        for (const id of resourceIds) {
            if (!me.resourceStore.includes(id)) {
                resourceIds.delete(id);
            }
        }

        if (isResourceTimeRange) {
            switch (action) {
                // - dataset cant pass through same path as events, which relies on project being invalidated. and
                // resource time ranges does not pass through engine
                // - removeall also needs special path, since no resources to redraw will be collected
                case 'removeall':
                case 'dataset':
                case 'lazyload':
                    me.clearAll();
                    scheduler.refreshWithTransition();
                    return;
            }

            me.refreshResources(resourceIds, action !== 'lazyload');
        }
        else {
            switch (action) {
                // No-ops
                case 'batch': // Handled elsewhere, don't want it to clear again
                case 'sort':  // Order in EventStore does not matter, so these actions are no-ops
                case 'group':
                case 'move':
                    return;

                case 'remove':
                    // Remove is a no-op since assignment will also be removed
                    return;

                case 'clearchanges':
                    me.clearAll();
                    scheduler.refreshWithTransition();
                    return;

                case 'lazyload': {
                    if (scheduler.isEngineReady) {
                        scheduler.refreshRows();
                    }
                    else {
                        me.refreshAllWhenReady = true;
                    }
                    return;
                }
                case 'dataset': {
                    me.clearAll();
                    // This is mainly for chained stores, where data is set from main store without project being
                    // invalidated. Nothing to wait for, refresh now
                    if (scheduler.isEngineReady) {
                        scheduler.refreshWithTransition();
                    }
                    else {
                        me.refreshAllWhenReady = true;
                    }
                    return;
                }

                case 'add':
                    // Just refresh below
                    break;

                case 'replace':
                    // Gather resources from both the old record and the new one
                    replaced.forEach(([, newEvent]) => {
                        // Old cleared by changed assignment
                        newEvent.resources.map(resourceRecord => resourceIds.add(resourceRecord.id));
                    });
                    break;

                case 'removeall':
                case 'filter':
                    // Filter might be caused by add retriggering filters, in which case we need to refresh later
                    if (!scheduler.isEngineReady) {
                        me.refreshAllWhenReady = true;
                        return;
                    }

                    // Clear all when filtering for simplicity. If that turns out to give bad performance, one would need to
                    // figure out which events was filtered out and only clear their resources.
                    me.clearAll();
                    scheduler.calculateAllRowHeights(true);
                    scheduler.refreshWithTransition();
                    return;

                case 'update': {
                    // Check if changes are graph related or not
                    const allChrono = record.$entity
                        ? !Object.keys(changes).some(name => !record.$entity.getField(name))
                        : !Object.keys(changes).some(name => !chronoFields[name]);

                    let dateChanges = 0;
                    'startDate' in changes && dateChanges++;
                    'endDate' in changes && dateChanges++;
                    'duration' in changes && dateChanges++;

                    if ('resourceId' in changes) {
                        resourceIds.add(changes.resourceId.oldValue);
                    }

                    // If we have a set of resources to update, refresh them.
                    // Always redraw non chrono changes (name etc) and chrono changes that can affect appearance
                    if (
                        resourceIds.size && (
                            !allChrono ||
                            // Skip case when changed "duration" only (w/o start/end affected)
                            dateChanges && !('duration' in changes && dateChanges === 1) ||
                            'percentDone' in changes ||
                            'inactive' in changes ||
                            'constraintDate' in changes ||
                            'constraintType' in changes ||
                            'segments' in changes
                        )
                    ) {
                        const
                            { eventResize, eventDragCreate } = scheduler.features,
                            isResizing                       = eventResize?.isResizing,
                            isDragCreating                   = eventDragCreate?.isResizing,
                            { store }                        = scheduler,
                            allUsesOverlap                   = record.isBatchUpdating && [...resourceIds].every(resourceId => {
                                const
                                    resourceRecord = store.getById(resourceId),
                                    eventLayout    = scheduler.getEventLayout(resourceRecord);

                                return !scheduler.getEventLayoutHandler(eventLayout);
                            });

                        // Cheaper updates when resizing/drag creating using lockLayout (or using overlap layout)
                        if (record.isBatchUpdating && ((isResizing && eventResize.lockLayout) || (isDragCreating && eventDragCreate.lockLayout) || ((isResizing || isDragCreating) && allUsesOverlap))) {
                            // Determine if we should use minimal updates
                            const useMinimalUpdates = (isResizing && eventResize.lockLayout === 'minimal-updates') || (isDragCreating && eventDragCreate.lockLayout === 'minimal-updates');

                            for (const id of resourceIds) {
                                // resourceIds includes links, not all might be available in this store
                                const resource = scheduler.store.getById(id);
                                if (resource) {
                                    // minimal-updates = update only the resized event
                                    if (useMinimalUpdates) {
                                        const
                                            // Cached render data for the event
                                            renderData = me.resourceMap.get(id)?.eventsData.find(entry => entry.eventRecord === record),
                                            row        = scheduler.getRowFor(id),
                                            // Cached dom config for the event
                                            domConfig  = me.rowMap.get(row)?.find(entry => entry.elementData.eventRecord === record);

                                        if (renderData && domConfig) {
                                            // Update cached data in place
                                            const newRenderData = scheduler.generateRenderData(record, store.getById(id), true);

                                            Object.assign(renderData, newRenderData);

                                            const newDomConfig = this.renderEvent(renderData);

                                            Object.assign(domConfig, newDomConfig);
                                        }
                                    }
                                    // Update all events for the resource
                                    else {
                                        me.refreshEventsForResource(resource, undefined, false);
                                    }
                                }
                            }

                            me.onRenderDone();
                        }
                        // If we are finalizing data loading let's delay the resources refresh till all the
                        // propagation results get into stores
                        else if (me.project?.propagatingLoadChanges || me.project?.isWritingData) {
                            me.refreshResourcesOnDataReady(resourceIds);
                        }
                        else {
                            me.refreshResources(resourceIds);
                        }
                    }
                    return;
                }
            }

            me.refreshResourcesWhenReady(resourceIds);
        }
    }

    //endregion

    //region ResourceStore

    attachToResourceStore(resourceStore) {

        this.refreshAllWhenReady = true;

        super.attachToResourceStore(resourceStore);

        if (resourceStore) {
            this.clearAll({ clearLayoutCache : true });

            resourceStore.ion({
                name            : 'resourceStore',
                changePreCommit : 'onResourceStoreChange',
                thisObj         : this
            });
        }
    }

    get resourceStore() {
        return this.client.store;
    }

    onResourceStoreChange({ action, isExpand, records, changes }) {
        const
            me          = this,
            // Update link + original when asked for link
            resourceIds = records?.flatMap(r => r.isLinked ? [r.id, r.$originalId] : [r.id]);

        if (!me.scheduler.isPainted) {
            return;
        }

        switch (action) {
            case 'add':
                // #635 Events disappear when toggling other node
                // If we are expanding project won't fire refresh event
                if (!isExpand) {
                    // Links won't cause calculations, refresh now
                    if (records.every(r => r.isLinked)) {
                        me.refreshResources(resourceIds);
                    }
                    // Otherwise refresh when project is ready
                    else {
                        me.refreshResourcesWhenReady(resourceIds);
                    }
                }
                return;
            case 'update': {
                // Ignore changes from project commit, if they affect events they will be redrawn anyway
                // Also ignore explicit transformation of leaf <-> parent
                if (!me.project.isChangeTrackingSuspended && !changes.isLeaf) {
                    // Resource changes might affect events, refresh
                    me.refreshResources(resourceIds);
                }
                return;
            }
            case 'filter':
                // Bail out on filter action. Map was already updated on `refresh` event triggered before this `change`
                // one. And extra records are removed from rowMap by `onRemoveRows`
                return;
            case 'removeall':
                me.clearAll({ clearLayoutCache : true });
                return;

            // We must not clear all resources when whole dataset changes
            // https://github.com/bryntum/bryntum/issues/3292
            case 'dataset':
                return;
        }

        resourceIds && me.clearResources(resourceIds);
    }

    //endregion

    //region RowManager

    onTranslateRow({ row }) {
        // Newly added rows are translated prior to having an id, rule those out since they will be rendered later.
        // Also ignore translation as part of row managers animated insertion
        if (row.id != null && !this.scheduler.rowManager.inserting) {
            // Event layouts are stored relative to the resource, only need to rerender the row to have its absolute
            // position updated to match new translation
            this.refreshEventsForResource(row, false);
        }
    }

    // RowManager error correction, cached layouts will no longer match.
    // Redraw to have events correctly positioned for dependency feature to draw to their elements
    onOffsetRows() {
        this.clearAll();
        this.doUpdateTimeView();
    }

    // Used to pre-calculate row heights
    calculateRowHeight(resourceRecord) {
        const
            { scheduler } = this,
            rowHeight     = scheduler.getResourceHeight(resourceRecord),
            eventLayout   = scheduler.getEventLayout(resourceRecord),
            resizeLock    = scheduler.features.eventResize?.lockLayout,
            createLock    = scheduler.features.eventDragCreate?.lockLayout;

        if (
            eventLayout.type === 'stack' &&
            scheduler.isEngineReady &&
            // Group rows hold no events to lay out. Their height is normally resolved by
            // SchedulerBase#internalGetRowHeight, this is only reached for app supplied group row heights
            !resourceRecord.isSpecialRow &&
            // Generated parents when TreeGrouping do not have assigned bucket. If only one event is assigned, height
            // will be the configured one
            resourceRecord.assigned?.size > 1
        ) {
            const
                {
                    timeAxis
                }                  = scheduler,
                {
                    barMargin,
                    resourceMarginObject : { total },
                    contentHeight
                }                  = scheduler.getResourceLayoutSettings(resourceRecord),
                rawEvents          = scheduler.getRowEvents({
                    resourceRecord,

                    startDate          : timeAxis.startDate,
                    endDate            : timeAxis.endDate,
                    fromRowHeight      : true
                }),
                // Features may leave events out of the measurement and require a minimum number of bands
                // (EventClustering, its clustered events are not laid out but the cluster needs room)
                {
                    events : measurableEvents,
                    minBands
                }                  = scheduler.processRowHeightEvents(resourceRecord, rawEvents),
                events             = measurableEvents
                    .sort(heightEventSorter)
                    .map(eventRecord => {
                        const
                            useCurrent = eventRecord.isBatchUpdating && (!(resizeLock && eventRecord.meta?.isResizing) && !(createLock && eventRecord.meta?.isCreating)),
                            // Must use Model.get in order to get latest values in case we are inside a batch.
                            // EventResize changes the endDate using batching to enable a tentative change
                            // via the batchedUpdate event which is triggered when changing a field in a batch.
                            // Fall back to accessor if propagation has not populated date fields.
                            startDate  = useCurrent ? eventRecord.get('startDate') : eventRecord.startDate,
                            endDate    = useCurrent ? eventRecord.get('endDate') : eventRecord.endDate || startDate;

                        return {
                            eventRecord,
                            resourceRecord,
                            startMS : startDate.getTime(),
                            endMS   : endDate.getTime()
                        };
                    }),
                layoutHandler      = scheduler.getEventLayoutHandler(eventLayout),
                rawBandCount       = layoutHandler.layoutEventsInBands(events, resourceRecord, scheduler, true),
                nbrOfBandsRequired = Math.max(rawBandCount, minBands);

            // Border is part of cell height, have to add it to keep height correct
            return (nbrOfBandsRequired * contentHeight) + ((nbrOfBandsRequired - 1) * barMargin) + total + scheduler.rowBorderHeight;
        }

        return rowHeight + scheduler.rowBorderHeight;
    }

    //endregion

    //region TimeAxis

    doUpdateTimeView() {
        const { scrollable } = this.scheduler.timeAxisSubGrid;

        // scrollLeft is the DOM's concept which is -ve in RTL mode.
        // scrollX is always the +ve scroll offset from the origin.
        // Both may be needed for different calculations.
        this.updateFromHorizontalScroll(scrollable.x, true, undefined, true);
    }

    // Whether a zoom gesture may reuse the event layout instead of laying out again. False when an event's layout
    // dates depend on the tick size, or when its position is not a linear function of them, since the reused layout
    // could not then be corrected arithmetically. Also false with a custom layout, which may place events based on
    // their geometry, that the gesture changes without laying out again
    get supportsLayoutReuse() {
        const { scheduler } = this;

        return !scheduler.fillTicks &&
            scheduler.milestoneLayoutMode === 'default' &&
            scheduler.timeAxis?.isContinuous !== false &&
            !this.usesCustomLayout;
    }

    // A custom layout, for the scheduler or any rendered row's resource
    get usesCustomLayout() {
        const
            { scheduler } = this,
            { store }     = scheduler,
            isCustom      = layout => layout?.type === 'layoutFn' || Boolean(layout?.layoutFn);

        return isCustom(scheduler.internalEventLayout) ||
            Array.from(this.rowMap.keys()).some(row => {
                const resourceRecord = store.getById(row.id);

                return resourceRecord?.eventLayout && isCustom(scheduler.getEventLayout(resourceRecord));
            });
    }

    //region Zoom snapshot, see ZoomSnapshotRendering

    // Where a rendered bar sits on the time axis
    getSnapshotTimeSpan({ elementStartMS, elementEndMS }) {
        return elementStartMS == null ? null : { startMS : elementStartMS, endMS : elementEndMS };
    }

    // The resources of the rendered rows
    get snapshotResources() {
        const { store } = this.scheduler;

        return Array.from(this.rowMap.keys(), row => store.getById(row.id));
    }

    // The dates rendered, including the scroll buffer
    get snapshotDateRange() {
        return this._visibleDateRange ?? this.scheduler.timeAxis;
    }

    get snapshotViewport() {
        const
            { bufferSize }  = this,
            { left, right } = this.viewportCoords;

        return {
            start          : left,
            end            : right,
            // Same buffering as when not zooming, see getEventDOMConfigForCurrentView()
            buffer         : this.usesRenderBuffer ? bufferSize : 0,
            zeroSizeBuffer : bufferSize,
            positionStyle  : 'insetInlineStart',
            sizeStyle      : 'width'
        };
    }

    //endregion

    onTimeAxisViewModelUpdate() {
        const
            me            = this,
            { scheduler } = me;

        // A gesture reusing the event layout keeps it, its bars are moved when rendering, see moveSnapshotElements()
        if (!scheduler.$reusingEventLayout || !me.supportsLayoutReuse) {
            me.clearAll();
        }

        // If refresh is suspended, update timeView as soon as refresh gets unsuspended
        if (scheduler.refreshSuspended) {
            me.detachListeners('renderingSuspend');

            scheduler.ion({
                name : 'renderingSuspend',
                resumeRefresh({ trigger }) {
                    // This code will try to refresh rows, but resumeRefresh event doesn't guarantee rowManager rows are
                    // in actual state. e.g. if resources were removed during a suspended refresh rowManager won't get a
                    // chance to update them until `refresh` event from the project. We can safely update the view only
                    // if engine in ready (not committing), otherwise we leave refresh a liability of normal project refresh
                    // logic. Covered by SchedulerRendering.t.js
                    // https://github.com/bryntum/bryntum/issues/1462
                    if (scheduler.isEngineReady && trigger) {
                        me.doUpdateTimeView();
                    }
                },
                thisObj : me,
                once    : true
            });
        }

        // Call update anyway. If refresh is suspended this call will only update visible date range and will not redraw
        // rows. Unless this is from the setTimeSpan part of a wheel zoom, because then we will get here again from the
        // tickSize adjustment following it
        if (!scheduler.$skipWheelUpdate) {
            me.doUpdateTimeView();
        }
    }

    //endregion

    //region Dependency connectors

    /**
     * Gets displaying item start side
     *
     * @param {Scheduler.model.EventModel} eventRecord
     * @returns {'start'|'end'|'top'|'bottom'} 'start' / 'end' / 'top' / 'bottom'
     */
    getConnectorStartSide(eventRecord) {
        return 'start';
    }

    /**
     * Gets displaying item end side
     *
     * @param {Scheduler.model.EventModel} eventRecord
     * @returns {'start'|'end'|'top'|'bottom'} 'start' / 'end' / 'top' / 'bottom'
     */
    getConnectorEndSide(eventRecord) {
        return 'end';
    }

    //endregion

    //region Scheduler hooks

    refreshRows(resourceRecords, reLayoutEvents) {
        if (resourceRecords) {
            this.clearResources(resourceRecords);
        }
        else if (reLayoutEvents) {
            this.clearAll();
        }
    }

    // Clear events in case they use date as part of displayed info
    onLocaleChange() {
        this.clearAll();
    }

    // Called when viewport size changes
    onViewportResize(width, height, oldWidth, oldHeight) {
        // We don't draw events for all rendered rows, "refresh" when height changes to make sure events in previously
        // invisible rows gets displayed
        if (height > oldHeight) {
            this.onRenderDone();
        }
    }

    // Called from EventDrag
    onDragAbort({ context, dragData }) {
        const { assignmentRecord } = dragData;
        // Aborted a drag in a scrolled scheduler, with origin now out of view. Element is no longer needed
        if (!assignmentRecord.isEventSegmentModel && this.resourceStore.indexOf(this.scheduler.getAssignmentRow(assignmentRecord)) < this.scheduler.topRow.dataIndex) {
            context.element.remove();
        }
    }

    // Called from EventSelection
    toggleCls(assignmentRecord, cls, add = true, useWrapper = false, checkReleased = false) {
        const
            me      = this,
            element = me.client.getElementFromAssignmentRecord(assignmentRecord, useWrapper, checkReleased),
            rowIds  = new Set([
                // <remove-on-release>
                // TODO: Should be assignmentRecord.resourceId, but breaks engine. Hoping https://github.com/bryntum/bryntum-suite/pull/1252 will fix it
                // </remove-on-release>
                assignmentRecord.isModel ? assignmentRecord.get('resourceId') : assignmentRecord.resourceId,
                // Might be rendered on another row (GroupRollups)
                me.scheduler.getAssignmentRow(assignmentRecord)?.id
            ]);

        // Update cached config
        for (const rowId of rowIds) {
            const eventData = me.resourceMap.get(rowId)?.eventsData.find(d => d.eventId === assignmentRecord.eventId);

            if (eventData) {
                eventData[useWrapper ? 'wrapperCls' : 'cls'][cls] = add;
            }
        }

        // Live update element
        if (element) {
            // Update element
            element.classList.toggle(cls, add);
            // And its DOM config (that has not been released)
            element.lastDomConfig && !element.lastDomConfig.isReleased && (element.lastDomConfig.className[cls] = add);
        }
    }

    // React to rows being removed, refreshes view without any relayouting needed since layout is cached relative to row
    onRemoveRows({ rows }) {
        rows.forEach(row => {
            this.rowMap.delete(row);
            this.placeholderConfigs.delete(row);
        });
        this.onRenderDone();
    }

    // Reset renderer flag before any renderers are called
    onEarlyScroll() {
        this.rendererCalled = false;
    }

    // If vertical scroll did not cause a renderer to be called we still want to update since we only draw events in
    // view, "independent" from their rows
    updateFromVerticalScroll() {
        this.fromScroll = true;
        if (!this.rendererCalled) {
            this.onRenderDone();
        }
    }

    // Update header range on horizontal scroll
    updateFromHorizontalScroll(scrollX, force, noScrollAction, fromTAVMUpdate = false) {

        if (this.scheduler.$fromWheelUpdate) {
            return;
        }

        const
            me            = this,
            {
                scheduler,
                scrollBuffer
            }             = me,
            renderAll     = scrollBuffer === -1,
            {
                timeAxisSubGrid,
                timeAxis
            }             = scheduler,
            { width }     = timeAxisSubGrid,
            { totalSize } = scheduler.timeAxisViewModel,
            start         = scrollX,
            maxX          = Math.abs(totalSize - width),
            // If there are few pixels left from the right most position then just render all remaining ticks,
            // there wouldn't be many. It makes end date reachable with more page zoom levels while not having any poor
            // implications.
            // 5px to make TimeViewRangePageZoom test stable in puppeteer.
            // > 1, Safari reports a scrollWidth of 1 even when there is no scroll
            returnEnd     = maxX > 1 && maxX <= Math.round(start) + 5,
            // returnEnd     = Math.abs(timeAxisSubGrid.scrollable.maxX) > 1 && Math.abs(timeAxisSubGrid.scrollable.maxX) <= Math.round(start) + 5,
            startDate     = renderAll ? timeAxis.startDate : scheduler.getDateFromVirtualCoord({ coord : Math.max(0, start - scrollBuffer) }),
            endDate       = returnEnd || renderAll ? timeAxis.endDate : (scheduler.getDateFromVirtualCoord({ coord : start + width + scrollBuffer }) || timeAxis.endDate);

        if (
            startDate && (!scheduler._viewPresetChanging || noScrollAction) &&
            // If rendering all, no action needed if scrolling horizontally unless start/end/tick size etc changes
            (!renderAll || force || (startDate - (me._visibleDateRange?.startDate || 0)) || (endDate - (me._visibleDateRange?.endDate || 0)))
        ) {
            me._visibleDateRange = { startDate, endDate, startMS : startDate.getTime(), endMS : endDate.getTime() };
            me.viewportCoords    = renderAll
                ? { left : 0, right : totalSize }
                : { left : scrollX - scrollBuffer, right : scrollX + width + scrollBuffer };

            // Update time axis header making it aware of the new dates, but do not refresh if we go there from a
            // view model update, header will catch that on its own
            const range = scheduler.timeView.range = { startDate, endDate, skipRefresh : fromTAVMUpdate };

            scheduler.internalOnVisibleDateRangeChange(range);

            // If refresh is suspended, someone else is responsible for updating the UI later
            if (!scheduler.refreshSuspended && scheduler.rowManager.rows.length) {
                // Gets here too early in Safari for ResourceHistogram. ResizeObserver triggers a scroll before rows are
                // rendered first time. Could not track down why, bailing out
                if (scheduler.rowManager.rows[0].id === null) {
                    return;
                }

                me.fromScroll = true;
                scheduler.rowManager.rows.forEach(row => me.refreshEventsForResource(row, false, false));

                me.onRenderDone();
            }
        }
    }

    // Called from SchedulerEventRendering
    repaintEventsForResource(resourceRecord) {
        this.refreshResources([resourceRecord.id]);
    }

    onBeforeRowHeightChange() {
        // Row height is cached per resource, all have to be re-laid out
        this.clearAll();
    }

    //endregion

    //region Refresh resources

    refreshResourcesOnDataReady(resourceIds) {
        resourceIds.forEach(id => this.toDrawOnDataReady.add(id));
    }

    /**
     * Clears resources directly and redraws them on next project refresh
     * @param {Number[]|String[]} resourceIds
     * @private
     */
    refreshResourcesWhenReady(resourceIds) {
        this.clearResources(resourceIds);
        resourceIds.forEach(id => this.toDrawOnProjectRefresh.add(id));
    }

    /**
     * Clears and redraws resources directly. Respects schedulers refresh suspension
     * @param {Number[]|String[]} ids Resource ids
     * @param {Boolean} [shouldAnimate] Use transition or not
     * @private
     */
    refreshResources(ids, shouldAnimate = true) {
        const
            me            = this,
            { scheduler } = me;

        me.clearResources(ids);

        if (!scheduler.refreshSuspended) {
            const
                rows   = [],
                noRows = [];

            ids.forEach(id => {
                const row = scheduler.getRowById(id);
                if (row) {
                    rows.push(row);
                }
                else {
                    noRows.push(row);
                }
            });

            scheduler.runWithTransition(() => {
                // Rendering rows populates row heights, but not all resources might have a row in view
                scheduler.calculateRowHeights(noRows.map(id => this.resourceStore.getById(id)), true);

                // Render those that do
                scheduler.rowManager.renderRows(rows);
            }, shouldAnimate);

            // After a mode switch, render rows again on the next animation frame to ensure proper DOM synchronization
            if (me._needsPostModeRender && rows.length && scheduler.isPainted) {
                me._needsPostModeRender = false;
                scheduler.requestAnimationFrame(() => {
                    scheduler.rowManager.renderRows(rows);
                });
            }
        }
    }

    //endregion

    //region Stack & pack

    layoutEventVerticallyStack(bandIndex, eventRecord, resourceRecord) {
        const
            {
                barMargin,
                resourceMarginObject : { start },
                contentHeight
            } = this.scheduler.getResourceLayoutSettings(resourceRecord, eventRecord.parent);

        return bandIndex === 0
            ? start
            : start + bandIndex * contentHeight + bandIndex * barMargin;
    }

    layoutEventVerticallyPack(topFraction, heightFraction, eventRecord, resourceRecord, scale) {
        const
            {
                barMargin,
                resourceMarginObject : { start },
                contentHeight
            }         = this.scheduler.getResourceLayoutSettings(resourceRecord, eventRecord.parent);

        topFraction *= scale;
        heightFraction *= scale;

        const
            count     = 1 / heightFraction,
            bandIndex = topFraction * count, // "y" within row
            height    = (contentHeight - ((count - 1) * barMargin)) * heightFraction,
            top       = start + bandIndex * height + bandIndex * barMargin;

        return {
            top,
            // Don't let events shrink below zero, that will cause crashes
            height : Math.max(height, 0)
        };
    }

    //endregion

    //region Render

    /**
     * Used by event drag features to bring into existence event elements that are outside of the rendered block.
     * @param {Scheduler.model.TimeSpan} eventRecord The event to render
     * @param {Scheduler.model.ResourceModel} [resourceRecord] The event to render
     * @private
     */
    addTemporaryDragElement(eventRecord, resourceRecord = eventRecord.resource) {
        const
            { scheduler } = this,
            renderData    = scheduler.generateRenderData(eventRecord, resourceRecord, {
                timeAxis : true,
                viewport : true
            });

        // Event collapsed away by time-axis exclusions
        if (!renderData) {
            return null;
        }

        renderData.absoluteTop = renderData.row
            ? (renderData.top + renderData.row.top)
            : scheduler.getResourceEventBox(eventRecord, resourceRecord, true).top;

        const
            domConfig   = this.renderEvent(renderData),
            { dataset } = domConfig;

        // The drag proxy is a positional ghost, it must not be a second focusable, named button
        delete domConfig.tabIndex;
        delete domConfig.id;
        delete domConfig.role;
        delete domConfig['aria-label'];
        delete dataset.eventId;
        delete dataset.resourceId;
        delete dataset.assignmentId;
        delete dataset.syncId;
        dataset.transient = true;
        domConfig.parent  = this.scheduler.foregroundCanvas;

        // So that the regular DomSyncing which may happen during scroll does not
        // sweep up and reuse the temporary element.
        domConfig.retainElement = true;

        const result = DomHelper.createElement(domConfig, {
            reactCallback({ jsx, domConfig, targetElement }) {
                const { reactComponent } = scheduler;

                jsx && scheduler.fwComponent?.processEventContent?.({
                    jsx,
                    action    : 'add',
                    domConfig,
                    targetElement,
                    isRelease : false,
                    reactComponent
                });
            }
        });

        result.innerElement = result.firstChild;

        eventRecord.instanceMeta(scheduler).hasTemporaryDragElement = true;

        return result;
    }

    // Earlier start dates are above later tasks
    // If same start date, longer tasks float to top
    // If same start + duration, sort by name
    // Fn can be called with layout date or event records (from EventNavigation)
    eventSorter(a, b) {
        if (this.overlappingEventSorter) {
            return this.overlappingEventSorter(a.eventRecord || a, b.eventRecord || b);
        }

        const
            // <remove-on-release>
            // TODO: Rename startMS -> startDateMS to not have to have isModel check here (and to be consistent)
            // </remove-on-release>
            startA = a.isModel ? a.startDateMS : a.dataStartMS || a.startMS, // dataXX are used if configured with fillTicks
            endA   = a.isModel ? a.endDateMS : a.dataEndMS || a.endMS,
            startB = b.isModel ? b.startDateMS : b.dataStartMS || b.startMS,
            endB   = b.isModel ? b.endDateMS : b.dataEndMS || b.endMS,
            nameA  = a.isModel ? a.name : a.eventRecord.name,
            nameB  = b.isModel ? b.name : b.eventRecord.name;

        return startA - startB || endB - endA || (nameA < nameB ? -1 : nameA == nameB ? 0 : 1);
    }

    /**
     * Converts a start/endDate into a MS value used when rendering the event. If scheduler is configured with
     * `fillTicks: true` the value returned will be snapped to tick start/end.
     * @private
     * @param {Scheduler.model.TimeSpan} eventRecord
     * @param {String} startDateField
     * @param {String} endDateField
     * @param {Boolean} useEventBuffer
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @returns {Object} Object of format { startMS, endMS, durationMS }
     */
    calculateMS(eventRecord, startDateField, endDateField, useEventBuffer, resourceRecord) {
        const
            me                    = this,
            { scheduler }         = me,
            { timeAxisViewModel } = scheduler,
            { eventResize }       = scheduler.features;

        let startMS    = getStartEnd(scheduler, eventRecord, false, startDateField, useEventBuffer, resourceRecord),
            endMS      = getStartEnd(scheduler, eventRecord, true, endDateField, useEventBuffer, resourceRecord),
            durationMS = endMS - startMS;

        if (scheduler.milestoneLayoutMode !== 'default' && durationMS === 0) {
            const
                pxPerMinute = timeAxisViewModel.getSingleUnitInPixels('minute'),
                lengthInPx  = scheduler.getMilestoneLabelWidth(eventRecord, resourceRecord),
                duration    = lengthInPx * (1 / pxPerMinute);

            durationMS = duration * 60 * 1000;

            if (scheduler.milestoneTextPosition === 'always-outside') {
                // Milestone is offset half a diamond to the left (compensated in CSS with padding) for the layout pass,
                // to take diamond corner into account
                const
                    diamondSize = scheduler.getResourceLayoutSettings(resourceRecord, eventRecord.parent).contentHeight,
                    diamondMS   = diamondSize * (1 / pxPerMinute) * 60 * 1000;
                startMS -= diamondMS / 2;
                endMS = startMS + durationMS;

                if (scheduler.timeAxis.isContinuous === false) {
                    // Need to calculate with pixels in non-continuous timeaxis
                    const startX = scheduler.getCoordinateFromDate(startMS);

                    endMS = scheduler.getDateFromCoordinate(startX + lengthInPx) ?? endMS;
                }

            }
            else {
                switch (scheduler.milestoneAlign) {
                    case 'start':
                    case 'left':
                        endMS = startMS + durationMS;
                        break;
                    case 'end':
                    case 'right':
                        endMS   = startMS;
                        startMS = endMS - durationMS;
                        break;
                    default: // using center as default
                        endMS   = startMS + durationMS / 2;
                        startMS = endMS - durationMS;
                        break;
                }
            }
        }

        // Normally the event bar element and the event layout use the same timestamps for sizing,
        // but during resize if we have locked the layout we need them to differ
        const
            elementStartMS    = startMS,
            elementEndMS      = endMS,
            elementDurationMS = durationMS;

        // Use initial values for the layout during resize
        if (
            eventRecord.meta?.isResizing &&
            eventResize?.isResizing &&
            eventResize.lockLayout &&
            !eventResize.isMultiResizing
        ) {
            // When fillTicks is enabled, snap dates to tick boundaries
            if (scheduler.fillTicks) {
                const
                    { timeAxis }           = scheduler,
                    { startDate, endDate } = eventRecord,
                    startTick              = timeAxis.getTickFromDate(startDate);

                if (startTick >= 0) {
                    startMS = timeAxis.getAt(Math.floor(startTick)).startDate.getTime();
                }
                else {
                    startMS = startDate.getTime();
                }

                let endTick = timeAxis.getTickFromDate(endDate);
                if (endTick >= 0) {
                    if (endTick === Math.round(endTick) && endTick > 0) {
                        endTick--;
                    }
                    endMS = timeAxis.getAt(Math.floor(endTick)).endDate.getTime();
                }
                else {
                    endMS = endDate.getTime();
                }
            }
            else {
                startMS = eventRecord.startDate.getTime();
                endMS   = eventRecord.endDate.getTime();
            }
            durationMS = elementEndMS - elementStartMS;
        }

        return {
            startMS,
            endMS,
            durationMS,
            elementStartMS,
            elementEndMS,
            elementDurationMS
        };
    }

    /**
     * Resolves the date fields and the start/end dates to render a time span at, taking buffer time into account.
     * @param {Object} timeSpan The time span record
     * @param {Object} rowRecord The row record
     * @returns {Object} Date fields and dates
     * @private
     */
    getWrapDateInfo(timeSpan, rowRecord) {
        const { isBatchUpdating } = timeSpan;

        let useEventBuffer = false,
            timespanStart, timespanEnd;



        const
            startDateField = useEventBuffer ? 'wrapStartDate' : 'startDate',
            endDateField   = useEventBuffer ? 'wrapEndDate' : 'endDate';

        // Must use Model.get in order to get latest values in case we are inside a batch.
        // EventResize changes the endDate using batching to enable a tentative change
        // via the batchedUpdate event which is triggered when changing a field in a batch.
        // Fall back to accessor if propagation has not populated date fields.
        // Use endDate accessor if duration has not been propagated to create endDate
        if (!useEventBuffer) {
            timespanStart = isBatchUpdating ? timeSpan.get(startDateField) : timeSpan[startDateField];
            // Allow timespans to be rendered even when they are missing an end date
            timespanEnd   = isBatchUpdating ? timeSpan.get(endDateField) : timeSpan[endDateField] || timespanStart;
        }

        return {
            useEventBuffer,
            startDateField,
            endDateField,
            timespanStart,
            timespanEnd
        };
    }

    /**
     * Returns event render data except actual position information.
     * @param {Scheduler.model.TimeSpan} timeSpan TimeSpan
     * @param {Core.data.Model} rowRecord The row record
     * @returns {HorizontalRenderData}
     * @private
     */
    setupRenderData(timeSpan, rowRecord) {
        const
            me                  = this,
            { scheduler }       = me,
            {
                timeAxis,
                timeAxisViewModel
            }                   = scheduler,
            pxPerMinute         = timeAxisViewModel.getSingleUnitInPixels('minute'),
            viewStartMS         = timeAxis.startMS,
            viewEndMS           = timeAxis.endMS,
            {
                useEventBuffer,
                startDateField,
                endDateField,
                timespanStart,
                timespanEnd
            }                   = me.getWrapDateInfo(timeSpan, rowRecord),
            // Convert start/end dates to milliseconds, taking fillTicks, lockLayout etc. into account
            msValues            = me.calculateMS(timeSpan, startDateField, endDateField, useEventBuffer, rowRecord),
            // elementStartMS & elementEndMS are used here over startMS & endMS to take preamble & postamble into
            // account for the "outside of view" calculations below when resizing events
            {
                durationMS,
                elementStartMS,
                elementEndMS
            }                   = msValues,
            // These flags have two components because includeOutsideViewport
            // means that we can be calculating data for events either side of
            // the TimeAxis.
            // The start is outside of the view if it's before *or after* the TimeAxis range.
            // 1 set means the start is before the TimeAxis
            // 2 set means the start is after the TimeAxis
            // Either way, a truthy value means that the start is outside of the TimeAxis.
            startsOutsideView   = elementStartMS < viewStartMS | ((elementStartMS > viewEndMS) << 1),
            // The end is outside of the view if it's before *or after* the TimeAxis range.
            // 1 set means the end is after the TimeAxis
            // 2 set means the end is before the TimeAxis
            // Either way, a truthy value means that the end is outside the TimeAxis.
            endsOutsideView     = elementEndMS > viewEndMS | ((elementEndMS <= viewStartMS) << 1),
            durationMinutes     = durationMS / (1000 * 60),
            width               = endsOutsideView ? pxPerMinute * durationMinutes : null,
            row                 = scheduler.getRowById(rowRecord);

        // Make milestones 1 ms wide during layout
        if (durationMS === 0) {
            msValues.startMS--;
        }

        return {
            eventRecord : timeSpan,
            taskRecord  : timeSpan, // Helps with using Gantt projects in Scheduler
            start       : timespanStart,
            end         : timespanEnd,
            rowId       : rowRecord.id,
            // The row it is rendered on. Its resourceRecord is the resource it represents, which might be another
            // (GroupRollups, see SchedulerEventRendering#getRenderedResource())
            rowRecord,
            children    : [],
            startsOutsideView,
            endsOutsideView,
            width,
            row,
            useEventBuffer,
            ...msValues
        };
    }

    /**
     * Populates render data with information about width and horizontal position of the wrap.
     * @param {HorizontalRenderData} renderData
     * @returns {Boolean}
     * @private
     */
    fillTimeSpanHorizontalPosition(renderData) {
        const
            { elementStartMS : startMS, elementEndMS : endMS, elementDurationMS : durationMS } = renderData,
            // With delayed calculation there is no guarantee data is normalized, might be missing a crucial component
            result = startMS != null && endMS != null && this.calculateHorizontalPosition(renderData, startMS, endMS, durationMS);

        if (result) {
            Object.assign(renderData, result);
            return true;
        }

        return false;
    }

    /**
     * Fills render data with `insetInlineStart` and `width` properties
     * @param {HorizontalRenderData} renderData
     * @param {Number} startMS
     * @param {Number} endMS
     * @param {Number} durationMS
     * @returns {{insetInlineStart: number, width: number, clippedStart: boolean, clippedEnd: boolean}|null}
     * @private
     */
    calculateHorizontalPosition(renderData, startMS, endMS, durationMS) {
        const
            { scheduler } = this,
            {
                timeAxis,
                timeAxisViewModel
            }             = scheduler,
            {
                startsOutsideView,
                endsOutsideView,
                eventRecord
            }             = renderData,
            viewStartMS   = timeAxis.startMS,
            pxPerMinute   = timeAxisViewModel.getSingleUnitInPixels('minute');

        let
            width        = null,
            endX         = scheduler.getVirtualCoordFromDate(endMS, {
                local            : true,
                respectExclusion : true,
                isEnd            : true
            }),
            startX,
            clippedStart = false,
            clippedEnd   = false;

        // If event starts outside of view, estimate where.
        if (startsOutsideView) {
            startX = (startMS - viewStartMS) / (1000 * 60) * pxPerMinute;
        }
        // Starts in view, calculate exactly
        else {
            // If end date is included in time axis but start date is not (when using time axis exclusions), snap start date to next included data
            startX = scheduler.getVirtualCoordFromDate(startMS, {
                local              : true,
                respectExclusion   : true,
                isEnd              : false,
                snapToNextIncluded : endX !== -1
            });

            clippedStart = startX === -1;
        }

        if (endsOutsideView) {
            // Estimate where the end is, based on where time axis ends + how much the event overflows
            const
                distanceToTimeAxisEnd   = timeAxisViewModel.totalSize - startX,
                overflowDurationMS      = endMS - timeAxis.endMS,
                overflowDurationMinutes = overflowDurationMS / (1000 * 60);

            width =  distanceToTimeAxisEnd + pxPerMinute * overflowDurationMinutes;

            // Have to clip the events in older Safari when using stickyEvents, it does not support `overflow: clip`
            if (BrowserHelper.isSafari && BrowserHelper.safariVersion < 16 && scheduler.features.stickyEvents && timeAxis.endMS && !startsOutsideView) {
                endX = scheduler.getCoordinateFromDate(timeAxis.endMS);
            }
            else {
                // Parentheses needed
                endX = startX + width;
            }
        }
        else {
            clippedEnd = endX === -1;
        }

        if (clippedEnd && !clippedStart) {
            // We know where to start but not where to end, snap it (the opposite is already handled by the
            // snapToNextIncluded flag when calculating startX above)

            endX = scheduler.getVirtualCoordFromDate(endMS, {
                local              : true,
                respectExclusion   : true,
                isEnd              : true,
                snapToNextIncluded : true
            });
        }

        // If the element is very wide there's no point in displaying it all.
        // Indeed the element may not be displayable at extremely large widths.
        if (width > MAX_WIDTH) {
            // The start is before the TimeAxis start
            if (startsOutsideView === 1) { // NOSONAR
                // Both ends outside - spans TimeAxis
                if (endsOutsideView === 1) { // NOSONAR
                    startX = -100;
                    endX   = scheduler.timeAxisColumn.width + 100;
                }
                // End is in view
                else {
                    startX = endX - MAX_WIDTH;
                }
            }
            // The end is after, but the start is in view
            else if (endsOutsideView === 1) { // NOSONAR
                endX = startX + MAX_WIDTH;
            }
        }

        if (clippedStart && clippedEnd) {
            // Both ends excluded, but there might be some part in between that should be displayed...
            startX = scheduler.getVirtualCoordFromDate(startMS, {
                local              : true,
                respectExclusion   : true,
                isEnd              : false,
                snapToNextIncluded : true,
                max                : endMS
            });

            endX = scheduler.getVirtualCoordFromDate(endMS, {
                local              : true,
                respectExclusion   : true,
                isEnd              : true,
                snapToNextIncluded : true,
                min                : startMS
            });

            if (startX === endX) {
                // Raise flag on instance meta to avoid duplicating this logic
                eventRecord.instanceMeta(scheduler).excluded = true;
                // Excluded by time axis exclusion rules, render nothing
                return null;
            }
        }

        return {
            left  : Math.min(startX, endX),
            // Use min width 5 for normal events, 0 for milestones (won't have width specified at all in the
            // end). During drag create a normal event can get 0 duration, in this case we still want it to
            // get a min width of 5 (6px for wrapper, -1 px for event element
            width : Math.abs(endX - startX) || (eventRecord.isMilestone && !eventRecord.meta.isDragCreating ? 0 : 6),
            clippedStart,
            clippedEnd
        };
    }

    fillTimeSpanVerticalPosition(renderData, rowRecord) {
        const
            { scheduler }               = this,
            { start, end, eventRecord } = renderData,
            {
                resourceMarginObject : { start : resourceMarginStart },
                contentHeight
            }              = scheduler.getResourceLayoutSettings(rowRecord);

        // If filling ticks we need to also keep data's MS values, since they are used for sorting timespans
        if (scheduler.fillTicks) {
            const { eventResize } = scheduler.features;
            if (
                eventRecord.meta?.isResizing &&
                eventResize?.isResizing &&
                eventResize.lockLayout &&
                !eventResize.isMultiResizing
            ) {
                renderData.dataStartMS = eventRecord.startDate.getTime();
                renderData.dataEndMS   = eventRecord.endDate.getTime();
            }
            else {
                renderData.dataStartMS = start.getTime();
                renderData.dataEndMS   = end.getTime();
            }
        }

        renderData.top = Math.max(0, resourceMarginStart);

        if (scheduler.managedEventSizing) {
            // Timespan height should be at least 1px
            renderData.height = contentHeight;
        }
    }

    /**
     * Gets timespan coordinates etc. Relative to containing row. If the timespan is outside of the zone in
     * which timespans are rendered, that is outside of the TimeAxis, or outside of the vertical zone in which timespans
     * are rendered, then `undefined` is returned.
     * @private
     * @param {Scheduler.model.TimeSpan} timeSpan TimeSpan record
     * @param {Core.data.Model} rowRecord Row record
     * @param {Boolean|Object} includeOutside Specify true to get boxes for timespans outside of the rendered zone in both
     * dimensions. This option is used when calculating dependency lines, and we need to include routes from timespans
     * which may be outside the rendered zone.
     * @param {Boolean} includeOutside.timeAxis Pass as `true` to include timespans outside of the TimeAxis's bounds
     * @param {Boolean} includeOutside.viewport Pass as `true` to include timespans outside of the vertical timespan viewport's bounds.
     * @returns {{event/task: *, left: number, width: number, start: (Date), end: (Date), startMS: number, endMS: number, startsOutsideView: boolean, endsOutsideView: boolean}}
     */
    getTimeSpanRenderData(timeSpan, rowRecord, includeOutside = false) {
        const data = this.setupRenderData(timeSpan, rowRecord);

        if (!this.fillTimeSpanHorizontalPosition(data)) {
            return null;
        }

        this.fillTimeSpanVerticalPosition(data, rowRecord);

        return data;
    }

    // Layout a set of events, code shared by normal event render path and nested events
    layoutEvents(resourceRecord, allEvents, includeOutside = false, parentEventRecord = null, eventSorter = null) {
        const
            me            = this,
            { scheduler } = me,
            { timeAxis }  = scheduler,
            // Generate layout data
            eventsData    = allEvents.reduce((result, eventRecord) => {
                // includeOutside accepts three shapes:
                //   false (default) - only include events inside the time axis
                //   true            - include all events regardless of time axis
                //   { viewport?, timeAxis? } - object with flags; only timeAxis bypasses the filter
                if (includeOutside === true || includeOutside?.timeAxis || timeAxis.isTimeSpanInAxis(eventRecord)) {
                    const eventBox = scheduler.generateRenderData(eventRecord, resourceRecord, includeOutside);

                    // Collect layouts of visible events
                    if (eventBox) {
                        result.push(eventBox);
                    }
                }

                return result;
            }, []);

        // Ensure the events are rendered in natural order so that navigation works.
        eventsData.sort(eventSorter ?? me.eventSorter);

        let rowHeight = scheduler.getAppliedResourceHeight(resourceRecord, parentEventRecord);

        const
            // Only events and tasks should be considered during layout (not resource time ranges if any, or events
            // being drag created when configured with lockLayout)
            layoutEventData   = eventsData.filter(({ eventRecord }) => eventRecord.isEvent && !eventRecord.meta.excludeFromLayout),
            eventLayout       = scheduler.getEventLayout(resourceRecord, parentEventRecord),
            layoutHandler     = scheduler.getEventLayoutHandler(eventLayout),
            // Layout handlers consume the array they are passed, so the eventLayoutDone event needs a copy of it. This
            // is a hot path, the listener check is there to only pay for the copy when someone listens
            hasLayoutListener = scheduler.hasListener('eventLayoutDone'),
            laidOutEventData  = hasLayoutListener && layoutHandler ? layoutEventData.slice() : layoutEventData;

        if (layoutHandler) {
            const
                {
                    barMargin,
                    resourceMarginObject : { total },
                    contentHeight
                }             = scheduler.getResourceLayoutSettings(resourceRecord, parentEventRecord),
                bandsRequired = layoutHandler.applyLayout(layoutEventData, resourceRecord, scheduler) || 1;

            if (layoutHandler.type === 'layoutFn') {
                rowHeight = bandsRequired;
            }
            else {
                rowHeight = (bandsRequired * contentHeight) + ((bandsRequired - 1) * barMargin) + total + scheduler.rowBorderHeight;
            }
        }
        else {
            rowHeight += scheduler.rowBorderHeight;

            if (layoutEventData.length > 0) {
                // Apply z-index to the first few events, Chrome does not perform well with too many z-index layers
                const limit = Math.min(layoutEventData.length, me.maxZIndexStacks);
                for (let i = 0; i < limit; i++) {
                    const data = layoutEventData[i];
                    // $event-zindex scss var is 5
                    data.wrapperStyle += `;z-index:${i + 5}`;
                }
            }
        }

        // An app-supplied getRowHeight() takes precedence over the height required by the event layout (but not
        // for nested events, which lay out within their parent event, not a row)
        if (!parentEventRecord && scheduler.hasOwnGetRowHeight) {
            rowHeight = scheduler.getRowHeight(resourceRecord) || rowHeight;
        }

        // Chainable hook for features to adjust render data once the row height is known (EventClustering centers
        // its clusters)
        scheduler.afterLayoutEvents({ resourceRecord, parentEventRecord, eventsData, rowHeight });

        // Documented on SchedulerBase. Allows features and application code to adjust the render data of a row's
        // events (for example the DOM configs of their labels) when final pixel positions are known
        if (hasLayoutListener) {
            scheduler.trigger('eventLayoutDone', {
                resourceRecord,
                parentEventRecord,
                eventsData  : laidOutEventData,
                // The layout in effect for this row, note that `scheduler.eventLayout` is not yet updated when the
                // event fires for the refresh caused by assigning it
                eventLayout : eventLayout?.type,
                rowHeight
            });
        }

        return { rowHeight, eventsData };
    }

    // Lay out events within a resource, relative to the resource
    layoutResourceEvents(resourceRecord, includeOutside = false, existingLayout = null) {
        const
            me             = this,
            { scheduler }  = me,
            { timeAxis }   = scheduler,
            // Events for this resource
            resourceEvents = scheduler.getRowEvents({

                resourceRecord,
                startDate          : timeAxis.startDate,
                endDate            : timeAxis.endDate,
                visibleDateRange   : me.visibleDateRange
            }),
            // Call a chainable template function on scheduler to allow features to add additional "events" to render
            // Currently used by ResourceTimeRanges, CalendarHighlight & NestedEvents
            allEvents      = scheduler.getEventsToRender(resourceRecord, resourceEvents) || [];

        // If we have an existingLayout, then this is a pass forced by lazy loading which needs to call getEvents above
        // to trigger loading. But we can skip the rest of the layout pass
        return existingLayout ? null : me.layoutEvents(resourceRecord, allEvents, includeOutside);
    }

    get eventDomIdPrefix() {
        return this._eventDomIdPrefix ??= `${this.scheduler._element?.id ?? this.scheduler.id}-`;
    }

    // Generates a DOMConfig for an EventRecord
    renderEvent(data, rowHeight) {
        const
            { scheduler }                                     = this,
            {
                resourceRecord,
                rowRecord,
                assignmentRecord,
                eventRecord
            }                                                 = data,
            // A parent renders its children inside its own element when the NestedEvents feature is used, and
            // `role : 'button'` is children-presentational, it would prune those child bars from the accessibility
            // tree. `group` is not, so the children survive
            isNestedParent                                    = scheduler.features?.nestedEvents?.enabled &&
                eventRecord.isParent,
            // Sync using assignment id for events and event id for ResourceTimeRanges. Add eventId for occurrences to
            // make them unique
            syncId                                            = assignmentRecord
                // Assignment, might be an occurrence
                ? this.assignmentStore.getOccurrence(assignmentRecord, eventRecord).id
                // Something else, probably a ResourceTimeRange
                : data.eventId,
            // A linked resource renders its own bar for the same assignment, so it takes part in the id
            domSyncId                                         = resourceRecord.isLinked ? `${syncId}_${resourceRecord.id}` : syncId,
            eventElementConfig                                = data.isCluster ? null : {
                className : data.cls,
                style     : data.style || '',
                children  : data.children,
                role      : 'presentation',
                dataset   : {
                    // Each feature putting contents in the event wrap should have this to simplify syncing and
                    // element retrieval after sync
                    taskFeature : 'event'
                },
                syncOptions : {
                    syncIdField : 'taskBarFeature'
                }
            },
            // Event element config, applied to existing element or used to create a new one below
            elementConfig                                     = {
                className    : data.wrapperCls,
                // Only real events are actionable. Features such as ResourceTimeRanges, ResourceNonWorkingTime,
                // TickCells and CalendarHighlight chain getEventsToRender to push their own records through this
                // path, those must not become buttons. Assigned as undefined rather than left out, since this config
                // is also applied to reused elements where a stale role would otherwise remain. Features may supply
                // their own role in the render data (EventClustering's clusters are buttons)
                role         : ('role' in data) ? data.role : (eventRecord.isEvent ? (isNestedParent ? 'group' : 'button') : undefined),
                tabIndex     : ('tabIndex' in data) ? data.tabIndex : -1,
                'aria-label' : data.ariaLabel,
                children     : [
                    eventElementConfig,
                    ...data.wrapperChildren
                ],
                style : {
                    top              : data.absoluteTop,
                    insetInlineStart : data.left,
                    // ResourceTimeRanges fill row height, cannot be done earlier than this since row height is not
                    // known initially
                    height           : data.fillSize ? (rowHeight - (scheduler.rowLines ? 1 : 0)) : data.height,
                    // DomHelper appends px to dimensions when using numbers.
                    width            : data.width,
                    style            : data.wrapperStyle,
                    // Events have no height when using `managedEventSizing : false`, but we still want to set the var
                    // to give milestones an initial height
                    '--b-event-size' : data.height ?? scheduler.getResourceHeight(rowRecord)
                },
                dataset : {
                    // assignmentId is set in this function conditionally
                    resourceId : rowRecord.id,
                    eventId    : data.eventId, // Not using eventRecord.id to distinguish between Event and ResourceTimeRange
                    syncId     : domSyncId
                },
                // Will not be part of DOM, but attached to the element
                elementData   : data,
                // Dragging etc. flags element as retained, to not reuse/release it during that operation. Events
                // always use assignments, but ResourceTimeRanges does not
                retainElement : assignmentRecord?.instanceMeta(scheduler).retainElement || eventRecord.instanceMeta(scheduler).retainElement,
                // Options for this level of sync, lower levels can have their own
                syncOptions   : {
                    syncIdField      : 'taskFeature',
                    // Remove instead of release when a feature is disabled
                    releaseThreshold : 0
                }
            };

        // For packed milestones with measured label on the outside, adjust position for the shrinkage of the diamond
        if (
            eventRecord.isMilestone &&
            scheduler.milestoneLayoutMode !== 'default' &&
            scheduler.milestoneTextPosition === 'always-outside' &&
            scheduler.getEventLayout(rowRecord).type === 'pack'
        ) {
            elementConfig.style.insetInlineStart += (scheduler.getResourceLayoutSettings(rowRecord, eventRecord.parent).contentHeight - data.height) / 2;
        }

        // Write back the correct height for elements filling the row, to not derender them later based on wrong height
        if (data.fillSize) {
            data.height = rowHeight;
        }

        // Some browsers throw warnings on zIndex = ''
        if (data.zIndex) {
            elementConfig.zIndex = data.zIndex;
        }

        // Do not want to spam dataset with empty prop when not using assignments (ResourceTimeRanges)
        if (assignmentRecord) {
            elementConfig.dataset.assignmentId = assignmentRecord.id;

            // Only assignment bars get ids; aria-owns references them
            elementConfig.id = DomHelper.makeValidId(this.eventDomIdPrefix + domSyncId);
        }

        data.elementConfig = elementConfig;

        scheduler.afterRenderEvent({ renderData : data, rowHeight, domConfig : elementConfig });

        return elementConfig;
    }

    // Syncs the aria-owns attribute on the row's time axis cell with the ids of the event bars rendered in that
    // row. Called without ownedIds to reset the attribute, for a row which no longer renders any bars
    syncAriaOwns(row, ownedIds) {
        if (row.isDestroyed) {
            return;
        }

        const
            cell  = row.getCells(this.scheduler.timeAxisColumn.region)[0],
            value = ownedIds?.length ? ownedIds.join(' ') : null;

        if (cell && cell.getAttribute('aria-owns') !== value) {
            DomHelper.setAttributes(cell, { 'aria-owns' : value });
        }
    }

    /**
     * Refresh events for resource record (or Row), clearing its cache and forcing DOM refresh.
     * @param {Scheduler.model.ResourceModel} recordOrRow Record or row to refresh
     * @param {Boolean} [force] Specify `false` to prevent clearing cache and forcing DOM refresh
     * @internal
     */
    refreshEventsForResource(recordOrRow, force = true, draw = true) {
        const
            me        = this,
            { store } = me.scheduler,
            // Using dataIndex, as id can be outdated
            record    = recordOrRow.isRow ? store.getAt(recordOrRow.dataIndex) : store.getById(recordOrRow),
            row       = me.scheduler.rowManager.getRowFor(record);

        if (force) {
            me.clearResources([record]);
        }

        if (row && record) {
            me.renderer({ row, record });

            if (force && draw) {
                me.onRenderDone();
            }
        }
    }

    // Transitioned refresh of all events. Pass `clearLayout` as `false` to reuse the cached event layout
    refreshEvents(transition = true, clearLayout = true) {
        if (clearLayout) {
            this.clearAll();
        }
        this.scheduler.refreshColumn(this.scheduler.timeAxisColumn, transition);
        this.onRenderDone();
    }

    // Returns layout for the current resource. Used by the renderer and exporter
    getResourceLayout(resourceRecord) {
        const me = this;

        // Use cached layout if available
        let resourceLayout = me.resourceMap.get(resourceRecord.id);

        const needsLayout = !resourceLayout || resourceLayout.invalid;

        if (needsLayout || me.eventStore.lazyLoad) {
            // Previously we would bail out here if engine wasn't ready. Now we instead allow drawing in most cases,
            // since data can be read and written during commit (previously it could not)
            if (me.suspended) {
                return;
            }

            const result = me.layoutResourceEvents(resourceRecord, false, !needsLayout && resourceLayout);

            // result will be null when we did not actually need to relayout, but had to call layoutResourceEvents to
            // trigger lazy loading of events for the resource. In that case we should keep the existing layout
            if (result) {
                resourceLayout = result;
                me.resourceMap.set(resourceRecord.id, resourceLayout);
            }
        }

        return resourceLayout;
    }

    // Left/right labels require using a buffer to not derender too early
    get usesRenderBuffer() {
        let usesBuffer = false;





        return usesBuffer;
    }

    getEventDOMConfigForCurrentView(resourceLayout, row, left, right) {
        const
            me                 = this,
            { bufferSize }     = me,
            { eventsData }     = resourceLayout,
            usesLabels         = me.usesRenderBuffer,
            // When scrolling, layout will be reused and any events that are still in view can reuse their DOM configs
            reusableDOMConfigs = me.fromScroll ? me.rowMap.get(row) : null,
            eventDOMConfigs    = [];

        let useLeft, useRight;

        // Only collect configs for those actually in view
        for (let i = 0; i < eventsData.length; i++) {
            const layout = eventsData[i];

            useLeft  = left;
            useRight = right;

            // Labels/milestones requires keeping events rendered longer
            if (usesLabels || layout.width === 0) {
                useLeft -= bufferSize;
                useRight += bufferSize;
            }

            if ((layout.left + layout.width) >= useLeft && layout.left <= useRight) {
                layout.absoluteTop = layout.top + row.top;
                // <remove-on-release>
                // TODO: Consider using a map of maps instead of having to find() here. But it is anyhow much faster
                //  than not reusing dom configs
                // </remove-on-release>
                const prevDomConfig = reusableDOMConfigs?.find(config => config.elementData.eventId === layout.eventId &&
                    config.elementData.resourceId === layout.resourceId);

                // When row height changes because of buffered rendering, the cached config's top can be outdated
                if (prevDomConfig) {
                    prevDomConfig.style.top = layout.absoluteTop;
                }

                layout.hidden = row.cls?.contains('b-row-placeholder');

                eventDOMConfigs.push(prevDomConfig ?? me.renderEvent(layout, resourceLayout.rowHeight));
            }
        }

        return eventDOMConfigs;
    }

    // Called per row in "view", collect configs
    renderer({ row, record : resourceRecord, size = {} }) {
        const me = this;

        // Bail out for group headers/footers, unless they render events (GroupRollups)
        if (!me.scheduler.isEventRow(resourceRecord)) {
            // Clear any cached layout for row retooled to special row, and bail out. onRenderDone() no longer visits
            // the row, so its aria-owns has to be dropped here
            me.rowMap.delete(row);
            me.placeholderConfigs.delete(row);
            me.syncAriaOwns(row);
            return;
        }

        // Ensure viewportCoords is initialized - may not be set yet during mode switch
        if (!me.viewportCoords) {
            const { totalSize } = me.scheduler.timeAxisViewModel;

            // Avoid reading scheduler.width (hits DOM) unless totalSize is unavailable
            if (!totalSize && !me.scheduler.width) {
                return;
            }

            me.viewportCoords = { left : 0, right : totalSize || me.scheduler.width };
        }

        const
            { left, right } = me.viewportCoords,
            resourceLayout  = me.getResourceLayout(resourceRecord);

        // Layout is suspended
        if (!resourceLayout) {
            return;
        }

        if (resourceRecord.eventColor) {
            const value = DomHelper.createColorStyle(resourceRecord.eventColor);
            row.eachElement(el => el.style.setProperty('--b-resource-event-color', value));
        }

        // Size row to fit events
        size.height    = resourceLayout.rowHeight;
        // Avoid storing our calculated height as the rows max height, to not affect next round of calculations
        size.transient = true;

        // During a zoom gesture with liveZoom off the snapshotted bars are moved directly, see moveSnapshotElements()
        if (!me.frozenElements) {
            me.rowMap.set(row, me.getEventDOMConfigForCurrentView(resourceLayout, row, left, right));
        }

        // Indicate the events not rendered during a zoom gesture with liveZoom off
        if (me.hiddenSpans) {
            const
                { scheduler }                  = me,
                { start : marginStart, total } = scheduler.getResourceMarginObject(resourceRecord);

            me.placeholderConfigs.set(row, me.getPlaceholderDOMConfigs(resourceRecord, left, right,
                row.top + marginStart, resourceLayout.rowHeight - total - scheduler.rowBorderHeight));
        }

        // Keep track if we need to draw on vertical scroll or not, to not get multiple onRenderDone() calls
        me.rendererCalled = true;
    }

    // Called when the current row rendering "pass" is complete, sync collected configs to DOM
    onRenderDone() {
        const
            me                                                    = this,
            { scheduler, rowMap, verticalBufferSize, fromScroll } = me;



        if (scheduler.refreshSuspended) {
            return;
        }

        if (!scheduler.fwComponent) {
            scheduler.fwComponent = scheduler.processEventContent ? scheduler : scheduler.up(cmp => Boolean(cmp.processEventContent)) || {};
        }

        const
            { entityNames }   = me,
            visibleDomConfigs = { event : [] },
            bodyTop           = scheduler._scrollTop ?? 0,
            viewTop           = bodyTop - verticalBufferSize,
            viewBottom        = bodyTop + scheduler._bodyRectangle.height + verticalBufferSize,
            unbuffered        = verticalBufferSize < 0,
            unmanagedSize     = !scheduler.managedEventSizing,
            isRowInView       = row => !row.isDestroyed && !row.cls.contains('b-row-placeholder') &&
                (unbuffered || (row.bottom > viewTop && row.top < viewBottom));

        // A zoom gesture with liveZoom off moves the snapshotted bars itself, only the placeholders go through DomSync
        if (me.frozenElements) {
            me.moveSnapshotElements();
            me.syncPlaceholders(isRowInView);
            me.fromScroll = false;
            return;
        }

        // Always use same shape for visibleDomConfigs, to make sure elements are properly released
        for (const entityName of entityNames) {
            visibleDomConfigs[entityName] = [];
        }

        // Event configs are collected when rows are rendered, but we do not want to waste resources on rendering
        // events far out of view. Especially with many events per row giving large row heights, rows in the RowManagers
        // buffer might far away -> collect events for rows within viewport + small vertical buffer
        rowMap.forEach((eventDOMConfigs, row) => {
            const ownedIds = [];

            // Render events "in view". Export specifies a negative verticalBufferSize to disable it
            if (isRowInView(row)) {
                for (let i = 0; i < eventDOMConfigs.length; i++) {
                    const
                        config = eventDOMConfigs[i],
                        data   = config.elementData,
                        {
                            absoluteTop,
                            eventRecord,
                            entityName = 'event'
                        }      = data;

                    // Conditions under which event bars are included in the DOM:
                    //   If bufferSize is -ve, meaning render all events.
                    //   scheduler.managedEventSizing is false.
                    //   The event is being drag-created or drag-resized
                    //   The event is within the bounds of the rendered region.
                    if (unbuffered || unmanagedSize || eventRecord.meta.isDragCreating || eventRecord.meta.isResizing || (absoluteTop + data.height > viewTop && absoluteTop < viewBottom)) {
                        // Sync to a per-feature canvas, determined by entityName
                        if (!visibleDomConfigs[entityName]) {
                            visibleDomConfigs[entityName] = [];
                            entityNames.add(entityName);
                        }

                        visibleDomConfigs[entityName].push(config);

                        if (config.id && data.resourceId === row.id) {
                            ownedIds.push(config.id);
                        }
                    }
                }
            }
            me.syncAriaOwns(row, ownedIds);

            // We are using cached DomConfigs. When DomSync releases an element, it also flags the config as released.
            // Next time we pass it that very same config, it says it is released and nothing shows up.
            //
            // We are breaching the DomSync contract a bit with the cached approach. DomSync expects new configs on each
            // call, so to facilitate that we clone the configs shallowly (nothing deep is affected by sync releasing).
            // That way we can always pass it fresh unreleased configs.
            for (let i = 0; i < eventDOMConfigs.length; i++) {
                eventDOMConfigs[i] = { ...eventDOMConfigs[i] };
            }
        });

        me.fromScroll = false;

        // Sync to a per-feature canvas, determined by entityName
        for (const entityName in visibleDomConfigs) {
            DomSync.sync({
                domConfig : {
                    onlyChildren : true,
                    children     : visibleDomConfigs[entityName]
                },
                targetElement       : scheduler.canvases[entityName],
                syncIdField         : 'syncId',
                releaseThreshold    : scheduler.eventReleaseThreshold,
                // Don't reuse elements when toggling groups, might lead to unwanted transition from above / below
                preventReusingOther : scheduler.rowManager.inserting === 'toggle-add',

                // Called by DomSync when it creates, releases or reuses elements
                callback : ({ action, domConfig, lastDomConfig, targetElement, jsx }) =>
                    horizontalRenderingDomSyncCallback(scheduler, fromScroll, { action, domConfig, lastDomConfig, targetElement, jsx })
            });
        }

        // Clears out the placeholders after a zoom gesture
        me.syncPlaceholders(isRowInView);

        scheduler.trigger('renderEventDone');
    }

    //endregion

    //region Cache

    // Clears cached resource layout
    clearResources(recordsOrIds) {
        recordsOrIds = ArrayHelper.asArray(recordsOrIds);

        const resourceIds = recordsOrIds.map(Model.asId);

        //<debug>
        if (globalThis.DEBUG) {
            console.log('%Clearing resources ' + Array.from(resourceIds).join(','), 'color: #770000');
        }
        //</debug>

        resourceIds.forEach(resourceId => {
            // Invalidate resourceLayout, keeping it around in case we need it before next refresh
            const cached = this.resourceMap.get(resourceId);
            if (cached) {
                cached.invalid = true;
            }

            const row = this.scheduler.getRowById(resourceId);
            row && this.rowMap.delete(row);
        });
    }

    clearAll({ clearDom = false, clearLayoutCache = false } = {}) {
        const
            me                            = this,
            { layouts, foregroundCanvas } = me.scheduler;

        //<debug>
        if (globalThis.DEBUG) {
            console.log('%Clearing all', 'color: #770000');
        }
        //</debug>

        if (clearLayoutCache && layouts) {
            for (const layout in layouts) {
                layouts[layout].clearCache();
            }
        }

        // it seems `foregroundCanvas` can be missing at this point
        // for example if scheduler instance is created w/o of `appendTo` config
        if (foregroundCanvas && clearDom) {
            // Start from scratch when replacing the project, to not retain anything in maps or released elements
            foregroundCanvas.syncIdMap = foregroundCanvas.lastDomConfig = foregroundCanvas.releasedIdMap = null;

            for (const child of foregroundCanvas.children) {
                child.lastDomConfig = child.elementData = null;
            }
        }

        me.resourceMap.clear();
        me.rowMap.clear();
        me.placeholderConfigs.clear();
    }

    //endregion
}

// Clear an in-flight animated removal so the deferred DomSync.remove() becomes a no-op.
// https://github.com/bryntum/bryntum/issues/13130
function cancelPendingRemoval(element) {
    if (element.pendingRemovalCls) {
        element.classList.remove(element.pendingRemovalCls);
    }
    element.pendingRemoval = element.retainElement = element.transitionRemove = element.pendingRemovalCls = null;
}

export function horizontalRenderingDomSyncCallback(scheduler, fromScroll, { action, domConfig, lastDomConfig, targetElement, jsx }) {
    const
        // Some actions are considered first a release and then a render (reusing another element).
        // This gives clients code a chance to clean up before reusing an element
        isRelease          = releaseEventActions[action],
        isRender           = renderEventActions[action],
        { inserting }      = scheduler.rowManager;

    // A live config is reclaiming this element; cancel any pending animated removal. `retainElement` covers
    // DomSync's silent relink path, where the element is flagged retained but the syncId is being rebound.
    if ((action === 'reuseOwnElement' || action === 'reuseElement' || action === 'retainElement') && targetElement.pendingRemoval) {
        cancelPendingRemoval(targetElement);
    }

    if (action === 'beforeRelease' && lastDomConfig) {
        // Determine if a removal lead to the release
        if (lastDomConfig.elementData?.isWrap) {
            const { eventRecord, assignmentRecord, entityName = 'event', isCluster } = lastDomConfig.elementData;

            // Do not transition tickCells. Not doing so makes them look more like grid cells
            if (entityName === 'tickCell' || entityName === 'resourceNonWorkingTime' || isCluster) {
                return;
            }

            let inStore;

            if (entityName === 'resourceTimeRange') {
                // allIncludes resolves occurrences to their base recurring timespan
                inStore = eventRecord && scheduler.resourceTimeRangeStore?.allIncludes(eventRecord);
            }
            else {
                // eventStore.allIncludes() handles occurrences and uses ID-based lookup which is reload-safe (same ID,
                // new record instance after store reload)
                inStore = eventRecord?.isEventOrTaskModel &&
                    scheduler.eventStore.allIncludes(eventRecord) &&
                    assignmentRecord &&
                    scheduler.assignmentStore.allIncludes(assignmentRecord);
            }

            // If rowManager is animating, affected elements will be retained and ready for us to handle and transition
            // here. If an event or assignment is removed, we can also transition it out here instead of making the
            // event available for reuse.
            if ((inserting && targetElement.transitionRemove) || (!inStore && scheduler.transition?.removeEvent)) {
                // Skip removal animation for already-released elements. They are already hidden (b-released class) so
                // transitioning them is pointless. More importantly, starting an animation sets retainElement=true on
                // the element, which prevents DomSync from syncing the element when reused after data reload
                // (e.g. loadInlineData), leaving it stuck with b-released class and event disappeared.
                // https://github.com/bryntum/bryntum/issues/12872
                if (targetElement.isReleased) {
                    return;
                }

                // Tell DomSync to leave it alone in future syncs
                targetElement.retainElement = true;

                // Cancellation token honored by the deferred cleanup below
                // https://github.com/bryntum/bryntum/issues/13130
                targetElement.pendingRemoval = true;

                // b-toggle-add etc. or b-removing. Recorded so cancellation removes the exact class added.
                const animClass = (inserting && 'b-' + inserting) || 'b-removing';
                targetElement.pendingRemovalCls = animClass;

                scheduler.executeAndAwaitAnimations(
                    targetElement,
                    () => targetElement.classList.add(animClass),
                    null,
                    () => {
                        if (targetElement.pendingRemoval) {
                            targetElement.pendingRemoval = false;
                            DomSync.remove(targetElement);
                        }
                    }
                );

                // Prevent release
                return false;
            }
        }
    }

    // A released element stays in the canvas as a recycling candidate, it must not keep the id of the assignment it no
    // longer shows. Also cleared on the config, DomSync only re-stamps an id which differs from it
    if (action === 'releaseElement' && lastDomConfig?.id) {
        targetElement.removeAttribute('id');
        lastDomConfig.id = null;
    }

    !isRelease && scheduler.fwComponent?.processEventContent?.({
        jsx,
        action,
        domConfig,
        targetElement,
        isRelease,
        reactComponent : scheduler.fwComponent.reactComponent,
        scrolling      : fromScroll
    });

    if (action === 'none' || !domConfig?.elementData?.isWrap) {
        return;
    }

    // Trigger release for events (it might be a proxy element, skip those)
    if (isRelease && lastDomConfig?.elementData) {
        const
            { eventRecord, resourceRecord, assignmentRecord } = lastDomConfig.elementData,
            event                                             = {
                renderData : lastDomConfig.elementData,
                element    : targetElement,
                eventRecord,
                resourceRecord,
                assignmentRecord
            };

        // Process event necessary in the case of release
        scheduler.fwComponent?.processEventContent?.({
            isRelease,
            domConfig      : lastDomConfig,
            targetElement,
            reactComponent : scheduler.fwComponent.reactComponent
        });

        // Some browsers do not blur on set to display:none, so releasing the active element
        // must *explicitly* move focus outwards to the view.
        // The focus should only move when the targetElement is both the active element
        // (to ensure it is currently focused) and matches the scheduler's focusElement
        // (to ensure it is the intended element to retain focus).
        if (targetElement === DomHelper.getActiveElement(targetElement) && targetElement === scheduler.focusElement) {
            scheduler.focusElement.focus();
        }

        // This event is documented on Scheduler
        scheduler.trigger('releaseEvent', event);
    }

    if (isRender) {
        const
            { eventRecord, resourceRecord, assignmentRecord, entityName } = domConfig.elementData,
            event                                                         = {
                renderData       : domConfig.elementData,
                element          : targetElement,
                isReusingElement : action === 'reuseElement',
                isRepaint        : action === 'reuseOwnElement',
                eventRecord,
                resourceRecord,
                assignmentRecord
            };

        // When a new event element is created during an animated toggle of group / node, add a temporary animationCls
        // to it (meta flag needed to preserve the cls as the element gets updated by
        // DomSync next time)
        if (action === 'newElement' && inserting === 'toggle-add' && entityName !== 'tickCell') {
            targetElement.classList.add('b-toggle-add');

            // Looks weird flagging both assignment & resource, but since resources might be linked, we need to make
            // sure we only animate the new element
            if (assignmentRecord) {
                assignmentRecord.instanceMeta(scheduler).togglingAdd = true;
            }
            resourceRecord.instanceMeta(scheduler).togglingAdd = true;

            scheduler.setTimeout(() => {
                if (assignmentRecord) {
                    assignmentRecord.instanceMeta(scheduler).togglingAdd = false;
                }
                resourceRecord.instanceMeta(scheduler).togglingAdd = false;
                targetElement.classList.remove('b-toggle-add');
            }, 300);
        }

        // Prevent transitions when reusing some other events element
        if (action === 'reuseElement' && scheduler.isAnimating) {
            // No assignments for ResourceTimeRanges
            DomHelper.addTemporaryClass(targetElement, 'b-reusing-own', 50, scheduler, `b-reusing-own-${(assignmentRecord || eventRecord).id}`);
        }

        // This event is documented on Scheduler
        scheduler.trigger('renderEvent', event);
    }
}
