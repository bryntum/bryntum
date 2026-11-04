import Base from '../../../Core/Base.js';
import Delayable from '../../../Core/mixin/Delayable.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import DomSync from '../../../Core/helper/DomSync.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import VerticalLayout from '../../eventlayout/VerticalLayout.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import AttachToProjectMixin from '../../data/mixin/AttachToProjectMixin.js';
import ZoomSnapshotRendering from './ZoomSnapshotRendering.js';

/**
 * @module Scheduler/view/orientation/VerticalRendering
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
    chronoFields        = {
        startDate : 1,
        endDate   : 1,
        duration  : 1
    },
    emptyObject        = Object.freeze({});

function getDataDate(scheduler, eventRecord, useEnd, fieldName, useEventBuffer, resourceRecord) {


    // Model.get is needed to see the latest value while EventResize batches a tentative change
    return eventRecord.isBatchUpdating && eventRecord.hasBatchedChange(fieldName)
        ? eventRecord.get(fieldName) : eventRecord[fieldName];
}

/**
 * Handles event rendering in Schedulers vertical mode. Reacts to project/store changes to keep the UI up to date.
 *
 * @internal
 */
export default class VerticalRendering extends Base.mixin(Delayable, AttachToProjectMixin, ZoomSnapshotRendering) {
    static $name = 'VerticalRendering';

    //region Config & Init

    static get properties() {
        return {
            eventMap               : new Map(),
            resourceMap            : new Map(),
            releasedElements       : {},
            toDrawOnProjectRefresh : new Set(),
            resourceBufferSize     : 1,
            // Track all entity names that have been seen, to ensure DomSync.sync is called for
            // each canvas even when empty (so elements can be properly released/removed)
            entityNames            : new Set()
        };
    }

    construct(scheduler) {
        this.client         = this.scheduler = scheduler;
        this.verticalLayout = new VerticalLayout({ scheduler });

        super.construct({});
    }

    init() {
        const
            me                             = this,
            { scheduler, resourceColumns } = me;

        // Resource header/columns
        resourceColumns.resourceStore = me.resourceStore;

        resourceColumns.ion({
            name              : 'resourceColumns',
            columnWidthChange : 'onResourceColumnWidthChange',
            thisObj           : me
        });

        me.initialized = true;

        // Set availableWidth before first render so column widths are calculated correctly
        resourceColumns.availableWidth = scheduler.timeAxisSubGridElement.offsetWidth;

        if (scheduler.isPainted) {
            me.renderer();
        }
    }

    // Activates this rendering engine. Called when switching from horizontal to vertical mode at runtime.
    activate() {
        const
            me                  = this,
            { scheduler }       = me,
            { project }         = scheduler;

        me.clearAll();

        // Flag that the first event/assignment change after this mode switch needs an extra render pass for proper DOM
        // synchronization
        me._needsPostModeRender = true;

        if (me.project !== project) {
            me.attachToProject(project);
        }
        // Always reattach to stores - they may have been detached or not yet attached
        me.attachToResourceStore(project.resourceStore);
        me.attachToEventStore(project.eventStore);
        me.attachToAssignmentStore(project.assignmentStore);

        if (!me.initialized) {
            me.init();
        }

        // Refresh the ResourceHeader so resource columns render for the new vertical view
        scheduler.timeAxisColumn?.resourceColumns?.refresh();
    }

    // Deactivates this rendering engine. Called when switching from vertical to horizontal mode at runtime.
    deactivate() {
        this.detachListeners('project', 'assignmentStore', 'eventStore', 'resourceStore');
        this.resourceColumns?.detachListeners('resourceStore');
        this.clearAll();
    }

    //endregion

    //region Elements <-> Records

    resolveRowRecord(elementOrEvent, xy) {
        const
            me            = this,
            { scheduler } = me,
            event         = elementOrEvent.nodeType ? null : elementOrEvent,
            element       = event ? event.target : elementOrEvent,
            coords        = event ? [event.borderOffsetX, event.borderOffsetY] : xy,
            // Fix for FF on Linux having text nodes as event.target
            el            = element.nodeType === Element.TEXT_NODE ? element.parentElement : element,
            eventElement  = el.closest(scheduler.eventSelector);

        if (eventElement) {
            return scheduler.resourceStore.getById(eventElement.dataset.resourceId);
        }

        // Need to be inside schedule at least
        if (!me.resourceColumns || !element.closest('.b-sch-time-axis-cell')) {
            return null;
        }

        if (!coords) {
            throw new Error(`Vertical mode needs coordinates to resolve this element. Can also be called with a browser
                event instead of element to extract element and coordinates from`);
        }

        let x = coords[0];

        if (scheduler.rtl) {
            // Flip x to distance-from-right; scrollWidth is correct in both the fits-container and overflow-scrolled cases.
            x = scheduler.timeAxisSubGridElement.scrollWidth - x;
        }

        if (scheduler.variableColumnWidths || scheduler.resourceStore.isGrouped) {
            let totalWidth = 0;

            for (const resourceRecord of me.allResourceRecords) {
                totalWidth += scheduler.getResourceWidth(resourceRecord);

                if (totalWidth >= x) {
                    return resourceRecord;
                }
            }

            return null;
        }

        const index = Math.floor(x / me.resourceColumns.columnWidth);

        return me.allResourceRecords[index];
    }

    toggleCls(assignmentRecord, cls, add = true, useWrapper = false) {
        const eventData = this.eventMap.get(assignmentRecord.eventId)?.[assignmentRecord.resourceId];

        if (eventData) {
            eventData.renderData[useWrapper ? 'wrapperCls' : 'cls'][cls] = add;
            // Element from the map cannot be trusted, might be reused in which case map is not updated to reflect that.
            // To be safe, retrieve using `getElementFromAssignmentRecord`
            const element = this.client.getElementFromAssignmentRecord(assignmentRecord, useWrapper);

            if (element) {
                element.classList[add ? 'add' : 'remove'](cls);
            }
        }
    }

    //endregion

    //region Coordinate <-> Date

    getDateFromXY(xy, roundingMethod, local, allowOutOfRange = false) {
        let coord = xy[1];

        if (!local) {
            coord = this.translateToScheduleCoordinate(coord);
        }

        return this.scheduler.timeAxisViewModel.getDateFromPosition(coord, roundingMethod, allowOutOfRange);
    }

    translateToScheduleCoordinate(y) {
        return y - this.scheduler.timeAxisSubGridElement.getBoundingClientRect().top - globalThis.scrollY;
    }

    translateToPageCoordinate(y) {
        return y + this.scheduler.timeAxisSubGridElement.getBoundingClientRect().top + globalThis.scrollY;
    }

    //endregion

    //region Regions

    getResourceEventBox(event, resource, includeOutside = false) {
        const
            me        = this,
            eventId    = event.id,
            resourceId = resource.id;

        let { renderData } = me.eventMap.get(eventId)?.[resourceId] || emptyObject;

        if (!renderData) {
            // Never been in view, lay it out
            me.layoutResourceEvents(me.scheduler.resourceStore.getById(resourceId));

            // Have another go at getting the layout data
            renderData = me.eventMap.get(eventId)?.[resourceId]?.renderData;
        }

        // layoutResourceEvents uses getEvents scoped to the time axis range, so events whose
        // dates fall entirely outside the time axis are filtered out and never added to eventMap.
        // When includeOutside is true (e.g. called from addTemporaryDragElement during multi-drag
        // with constrainDragToTimeline : false) we still need a valid box, so compute the render
        // data directly from the event's dates.
        if (!renderData && includeOutside) {
            renderData = me.getTimeSpanRenderData(event, resource);
        }

        if (!renderData) {
            return null;
        }

        let { left, top, width, bottom } = renderData;

        // getCoordinateFromDate returns -1 as a sentinel for dates outside the time axis bounds,
        // not as a real pixel value. When includeOutside is true, extrapolate the correct pixel
        // coordinate using the linear pixels-per-millisecond scale so that the returned box is
        // correctly positioned relative to events that are inside the time axis. Also recompute
        // bottom from duration so that bottom - (-1) does not corrupt the height.
        if (includeOutside && top === -1) {
            const
                pixelsPerMs     = me.scheduler.timeAxisViewModel.getSingleUnitInPixels('millisecond'),
                timeAxisStartMs = me.scheduler.timeAxis.startDate.getTime();

            top    = Math.round((renderData.startDateMS - timeAxisStartMs) * pixelsPerMs);
            bottom = top + Math.round((renderData.endDateMS - renderData.startDateMS) * pixelsPerMs);
        }

        return new Rectangle(left, top, width, bottom - top);
    }

    getScheduleRegion(resourceRecord, eventRecord, local) {
        const
            me            = this,
            { scheduler } = me,
            // Only interested in width / height (in "local" coordinates)
            region        = Rectangle.from(scheduler.timeAxisSubGridElement, scheduler.timeAxisSubGridElement);

        if (resourceRecord) {
            // <remove-on-release>
            // TODO: How to account for eventRecord here?
            // </remove-on-release>
            region.left  = me.allResourceRecords.indexOf(resourceRecord) * scheduler.resourceColumnWidth;
            region.right = region.left + scheduler.resourceColumnWidth;
        }

        const
            start           = scheduler.timeAxis.startDate,
            end             = scheduler.timeAxis.endDate,
            dateConstraints = scheduler.getDateConstraints?.(resourceRecord, eventRecord) || {
                start,
                end
            },
            startY          = scheduler.getCoordinateFromDate(DateHelper.max(start, dateConstraints.start)),
            endY            = scheduler.getCoordinateFromDate(DateHelper.min(end, dateConstraints.end));

        if (!local) {
            region.top    = me.translateToPageCoordinate(startY);
            region.bottom = me.translateToPageCoordinate(endY);
        }
        else {
            region.top    = startY;
            region.bottom = endY;
        }

        return region;
    }

    getRowRegion(resourceRecord, startDate, endDate) {
        const
            me            = this,
            { scheduler } = me,
            x             = me.allResourceRecords.indexOf(resourceRecord) * scheduler.resourceColumnWidth,
            taStart       = scheduler.timeAxis.startDate,
            taEnd         = scheduler.timeAxis.endDate,
            start         = startDate ? DateHelper.max(taStart, startDate) : taStart,
            end           = endDate ? DateHelper.min(taEnd, endDate) : taEnd,
            startY        = scheduler.getCoordinateFromDate(start),
            endY          = scheduler.getCoordinateFromDate(end, true, true),
            y             = Math.min(startY, endY),
            height        = Math.abs(startY - endY);

        return new Rectangle(x, y, scheduler.resourceColumnWidth, height);
    }

    get visibleDateRange() {
        const
            scheduler = this.scheduler,
            scrollPos = scheduler.scrollable.y,
            height    = scheduler.scrollable.clientHeight,
            startDate = scheduler.getDateFromCoordinate(scrollPos) || scheduler.timeAxis.startDate,
            endDate   = scheduler.getDateFromCoordinate(scrollPos + height) || scheduler.timeAxis.endDate;

        return {
            startDate,
            endDate,
            startMS : startDate.getTime(),
            endMS   : endDate.getTime()
        };
    }

    //endregion

    //region Events

    // Column width changed, rerender fully
    onResourceColumnWidthChange({ width, oldWidth }) {
        const
            me            = this,
            { scheduler } = me;

        // Fix width of column & header
        me.resourceColumns.width = scheduler.timeAxisColumn.width = me.allResourceRecords.length * width;
        me.clearAll();

        // Only transition large changes, otherwise it is janky when dragging slider in demo
        me.refresh(Math.abs(width - oldWidth) > 30);

        // Not detected by resizeobserver? Need to call this for virtual scrolling to react to update
        //        scheduler.callEachSubGrid('refreshFakeScroll');
        //        scheduler.refreshVirtualScrollbars();

        scheduler.onVisibleResourceColumnChange(width, oldWidth);
    }

    //endregion

    //region Project

    attachToProject(project) {
        super.attachToProject(project);

        if (project) {
            project.ion({
                name            : 'project',
                refresh         : 'onProjectRefresh',
                // changePreCommit handlers can defer work onto toDrawOnProjectRefresh /
                // refreshAllWhenReady AFTER the commit's own `refresh` event has fired (#13045).
                // commitFinalized is the last event of the commit lifecycle, so drain there too.
                commitFinalized : 'onProjectRefresh',
                thisObj         : this
            });
        }
    }

    onProjectRefresh() {
        const
            me                                    = this,
            { scheduler, toDrawOnProjectRefresh } = me;

        // Only update the UI immediately if we are visible
        if (scheduler.isVisible) {
            if (scheduler.rendered && !scheduler.refreshSuspended) {
                // Either refresh all rows (on for example dataset)
                if (me.refreshAllWhenReady) {
                    me.clearAll();
                    //scheduler.refreshWithTransition();
                    me.refresh();
                    me.refreshAllWhenReady = false;
                }
                // Or only affected rows (if any)
                else if (toDrawOnProjectRefresh.size) {
                    me.refresh();
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

    //region EventStore

    attachToEventStore(eventStore) {
        super.attachToEventStore(eventStore);

        this.refreshAllWhenReady = true;

        eventStore?.ion({
            name             : 'eventStore',
            addConfirmed     : 'onEventStoreAddConfirmed',
            refreshPreCommit : 'onEventStoreRefresh',
            thisObj          : this
        });
    }

    onEventStoreAddConfirmed({ record }) {
        for (const element of this.client.getElementsFromEventRecord(record)) {
            element.classList.remove('b-is-creating');
        }
    }

    onEventStoreRefresh({ action }) {
        if (action === 'batch') {
            this.refreshAllWhenReady = true;
        }
    }

    onEventStoreChange({ action, records : eventRecords = [], record, replaced, changes, isAssign, source }) {
        const
            me                  = this,
            { resourceStore }   = me,
            isResourceTimeRange = source.isResourceTimeRangeStore,
            resourceIds         = new Set();

        eventRecords.forEach(eventRecord => {
            // Update all resource rows to which this event is assigned *if* the resourceStore contains that resource
            // (We could have filtered the resourceStore). Resources in collapsed groups are not in the store, but are
            // still rendered since vertical mode ignores collapsed state
            const renderedEventResources = eventRecord.$linkedResources?.filter(r =>
                resourceStore.includes(r) || resourceStore.isInCollapsedGroup(r)
            );

            renderedEventResources?.forEach(resourceRecord => resourceIds.add(resourceRecord.id));
        });

        // ResourceTimeRanges don't have assignments, so we need to handle removal specially
        // (events rely on assignment removal to trigger cleanup, but RTRs don't have assignments)
        if (isResourceTimeRange) {
            // Bulk operations need full clear + refresh since they don't pass through the engine
            if (action === 'removeall' || action === 'dataset' || action === 'lazyload') {
                me.clearAll();
                me.refresh();
            }
            // Other actions (add, remove, update) only need to refresh affected resources
            else {
                me.refreshResources([...resourceIds]);
            }
            return;
        }

        switch (action) {
            // No-ops
            case 'sort':  // Order in EventStore does not matter, so these actions are no-ops
            case 'group':
            case 'move':
            case 'remove': // Remove is a no-op since assignment will also be removed
            case 'batch':
                return;

            case 'dataset':
                me.refreshAllResourcesWhenReady();
                return;

            case 'add':
                // Just refresh below
                break;

            case 'replace':
                // Gather resources from both the old record and the new one
                replaced.forEach(([, newEvent]) => {
                    // Old cleared by changed assignment
                    newEvent.resources.map(resourceRecord => resourceIds.add(resourceRecord.id));
                });
                // And clear them
                me.clearResources(resourceIds);
                break;

            case 'removeall':
            case 'filter':
                // Clear all when filtering for simplicity. If that turns out to give bad performance, one would need to
                // figure out which events was filtered out and only clear their resources.
                me.clearAll();
                me.refresh();
                return;

            case 'update': {
                // Check if changes are graph related or not
                const allChrono = record.$entity
                    ? !Object.keys(changes).some(name => !record.$entity.getField(name))
                    : !Object.keys(changes).some(name => !chronoFields[name]);

                // If any one of these in changes, it will affect visuals
                let changeCount = 0;
                if ('startDate' in changes) changeCount++;
                if ('endDate' in changes) changeCount++;
                if ('duration' in changes) changeCount++;

                // Always redraw non chrono changes (name etc)
                if (!allChrono || changeCount || 'percentDone' in changes || 'inactive' in changes || 'segments' in changes) {
                    // changePreCommit fires AFTER the project's `refresh` event during engine
                    // propagation, so calling refresh() synchronously here re-renders N times for an
                    // N-record commit. Defer to commitFinalized when the project is still writing
                    // data or propagating a load (#13045).
                    if (me.shouldWaitForInitializeAndEngineReady
                        || me.project?.isWritingData
                        || me.project?.propagatingLoadChanges) {
                        me.refreshResourcesWhenReady(resourceIds);
                    }
                    else {
                        me.clearResources(resourceIds);

                        // After a mode switch, defer rendering to next animation frame to ensure proper DOM
                        // synchronization
                        if (me._needsPostModeRender) {
                            me._needsPostModeRender = false;
                            me.scheduler.requestAnimationFrame(() => me.renderer());
                        }
                        else {
                            me.refresh();
                        }
                    }
                }
                return;
            }
        }

        me.refreshResourcesWhenReady(resourceIds);
    }

    //endregion

    //region ResourceStore

    attachToResourceStore(resourceStore) {
        const me = this;

        super.attachToResourceStore(resourceStore);

        me.refreshAllWhenReady = true;

        if (me.resourceColumns) {
            me.resourceColumns.resourceStore = resourceStore;
        }

        resourceStore.ion({
            name             : 'resourceStore',
            changePreCommit  : 'onResourceStoreChange',
            refreshPreCommit : 'onResourceStoreRefresh',
            // In vertical, resource store is not the row store but should toggle the load mask
            load             : () => me.scheduler.unmaskBody(),
            thisObj          : me,
            prio             : 1 // Call before others to clear cache before redraw
        });

        if (me.initialized && me.scheduler.isPainted) {
            // Invalidate resource range and events
            me.firstResource = me.lastResource = null;
            me.clearAll();

            me.renderer();
        }
    }

    onResourceStoreChange({ source : resourceStore, action, records = [], record, replaced, changes }) {
        const
            me              = this,
            // records for add, record for update, replaced [[old, new]] for replace
            resourceRecords = replaced ? replaced.map(r => r[1]) : records,
            resourceIds     = new Set(resourceRecords.map(resourceRecord => resourceRecord.id));

        // Invalidate resource range
        me.firstResource                  = me.lastResource = null;
        resourceStore._allResourceRecords = null;

        const { allResourceRecords } = resourceStore;

        // Operation that did not invalidate engine, refresh directly
        if (me.scheduler.isEngineReady) {
            switch (action) {
                case 'remove':
                    me.refreshAllResourcesWhenReady();
                    return;

                case 'update':
                    if (changes?.id) {
                        me.clearResources([changes.id.oldValue, changes.id.value]);
                    }
                    // columnWidth change triggers clearAll() below, no need to also clearResources
                    else if (!(changes && 'columnWidth' in changes)) {
                        me.clearResources([record.id]);
                    }
                    // Only the invalidation above needed
                    break;

                case 'filter':
                    // All filtered out resources needs clearing and so does those not filtered out since they might have
                    // moved horizontally when others hide
                    me.clearAll();
                    break;

                case 'move':
                    // Moving resources changes horizontal positions of affected resources, need to clear all
                    me.clearAll();
                    break;
            }

            // Changing a column width means columns after that will have to be recalculated so clear all cached
            // layouts. Must sync instanceMeta (columnWidth, insetStart) and the variableColumnWidths flag *before*
            // refreshing events, because VerticalRendering fires before ResourceHeader (prio:1) and
            // getTimeSpanRenderData reads instanceMeta.insetStart to position events.
            if (changes && ('columnWidth' in changes)) {
                me.resourceColumns.updateWidthCache();
                me.clearAll();
            }
            me.refresh(true);
        }
        // Operation that did invalidate project, update on project refresh
        else {
            switch (action) {
                case 'dataset':
                case 'remove': // Cannot tell from which index it was removed
                case 'removeall':
                    me.refreshAllResourcesWhenReady();
                    return;

                case 'replace':
                case 'add': {
                    if (!resourceStore.isGrouped) {
                        // Make sure all existing events following added resources are offset correctly
                        const
                            firstIndex = resourceRecords.reduce(
                                (index, record) => Math.min(index, allResourceRecords.indexOf(record)),
                                allResourceRecords.length
                            );

                        for (let i = firstIndex; i < allResourceRecords.length; i++) {
                            resourceIds.add(allResourceRecords[i].id);
                        }
                    }
                }
            }

            me.refreshResourcesWhenReady(resourceIds);
        }
    }

    onResourceStoreRefresh({ action }) {
        const me = this;

        if (action === 'sort' || action === 'group') {
            // Invalidate resource range & cache
            me.firstResource = me.lastResource = me.resourceStore._allResourceRecords = null;
            me.clearAll();
            me.refresh();
        }
    }

    //endregion

    //region AssignmentStore

    attachToAssignmentStore(assignmentStore) {
        super.attachToAssignmentStore(assignmentStore);

        this.refreshAllWhenReady = true;

        if (assignmentStore) {
            assignmentStore.ion({
                name             : 'assignmentStore',
                changePreCommit  : 'onAssignmentStoreChange',
                refreshPreCommit : 'onAssignmentStoreRefresh',
                thisObj          : this
            });
        }
    }

    onAssignmentStoreChange({ action, records : assignmentRecords = [], replaced, changes }) {
        const
            me          = this,
            resourceIds = new Set(assignmentRecords.map(assignmentRecord => assignmentRecord.resourceId));

        // Operation that did not invalidate engine, refresh directly
        if (me.scheduler.isEngineReady) {
            switch (action) {
                case 'add':
                case 'remove':
                    me.clearResources(resourceIds);
                    break;

                case 'filter':
                case 'removeall':
                    me.clearAll();
                    break;

                case 'update': {
                    // When reassigning, clear old resource also
                    if ('resourceId' in changes) {
                        resourceIds.add(changes.resourceId.oldValue);
                    }

                    // Ignore engine resolving resourceId -> resource, eventId -> event
                    if (!Object.keys(changes).filter(field => field !== 'resource' && field !== 'event').length) {
                        return;
                    }

                    me.clearResources(resourceIds);
                }
            }

            // changePreCommit fires AFTER the project's `refresh` event during engine propagation,
            // so calling refresh() synchronously here re-renders N times for an N-record commit.
            // Defer to commitFinalized when the project is still writing data or propagating a
            // load (#13045).
            if (me.project?.isWritingData || me.project?.propagatingLoadChanges) {
                me.refreshResourcesWhenReady(resourceIds);
            }
            else {
                me.refresh(true);

                // After a mode switch with resource reassignment, defer rendering to next animation
                // frame to ensure proper DOM synchronization after layout pass.
                // One-shot: only the first assignment change after a mode switch triggers this.
                if (action === 'update' && changes && 'resourceId' in changes && me._needsPostModeRender) {
                    me._needsPostModeRender = false;
                    me.scheduler.requestAnimationFrame(() => me.renderer());
                }
            }
        }
        // Operation that did invalidate project, update on project refresh
        else {
            if (changes && 'resourceId' in changes) {
                resourceIds.add(changes.resourceId.oldValue);
            }

            switch (action) {
                case 'removeall':
                    me.refreshAllResourcesWhenReady();
                    return;

                case 'replace':
                    // Gather resources from both the old record and the new one
                    replaced.forEach(([oldAssignment, newAssignment]) => {
                        resourceIds.add(oldAssignment.resourceId);
                        resourceIds.add(newAssignment.resourceId);
                    });
            }

            me.refreshResourcesWhenReady(resourceIds);
        }
    }

    onAssignmentStoreRefresh({ action, records }) {
        if (action === 'batch') {
            this.clearAll();
            this.refreshAllResourcesWhenReady();
        }
    }

    //endregion

    //region View hooks

    refreshRows(resourceRecords, reLayoutEvents) {
        const { scheduler } = this;

        // A zoom gesture reusing the event layout keeps it, its bars are moved when rendering, see
        // ZoomSnapshotRendering
        if (reLayoutEvents && !(scheduler.$reusingEventLayout && this.supportsLayoutReuse)) {
            this.clearAll();
            this.scheduler.refreshFromRerender = false;
        }
    }

    // Called from SchedulerEventRendering
    repaintEventsForResource(resourceRecord) {
        const { resourceColumns } = this.scheduler;

        this.renderResource(resourceRecord);

        // When using custom layout, it needs to refresh resource column header because the width of each resource could be changed after the layout is applied.
        if (this.scheduler.internalEventLayout.type === 'layoutFn') {
            resourceColumns.updateWidthCache();
            resourceColumns.refresh();
        }
    }

    updateFromHorizontalScroll(scrollX) {
        if (scrollX !== this.prevScrollX) {
            this.fromScroll = true;
            this.renderer();
            this.prevScrollX = scrollX;
        }
    }

    updateFromVerticalScroll() {
        this.fromScroll = true;
        this.renderer();
    }

    scrollResourceIntoView(resourceRecord, options) {
        const
            { scheduler } = this,
            x             = this.allResourceRecords.indexOf(resourceRecord) * scheduler.resourceColumnWidth;

        return scheduler.scrollHorizontallyTo(x, options);
    }

    get allResourceRecords() {
        return this.scheduler.resourceStore.allResourceRecords;
    }

    // Called when viewport size changes
    onViewportResize(width) {
        if (this.resourceColumns.availableWidth !== width) {
            this.resourceColumns.availableWidth = width;
            // In vertical mode, after changing availableWith, all resources could fit in the availableWidth without the need of the scrollbar.
            // Then it needs to call refreshVirtualScrollbars in order to hide that scrollbar. After hiding the scrollbar,
            // the timeline has more space and its height increases, with the result that more events could be displayed (instead of releasing them).
            this.scheduler.refreshVirtualScrollbars();
        }
        this.renderer();
    }

    get resourceColumns() {
        return this.scheduler.timeAxisColumn?.resourceColumns;
    }

    // Clear events in case they use date as part of displayed info
    onLocaleChange() {
        this.clearAll();
    }

    // No need to do anything special
    onDragAbort() {}

    onBeforeRowHeightChange() {}

    onTimeAxisViewModelUpdate() {}

    //region Zoom snapshot, see ZoomSnapshotRendering

    // Whether a zoom gesture may reuse the event layout instead of laying out again, see
    // HorizontalRendering#supportsLayoutReuse. Custom layouts are laid out per render
    get supportsLayoutReuse() {
        const { scheduler } = this;

        return !scheduler.fillTicks &&
            scheduler.internalEventLayout?.type !== 'layoutFn' &&
            scheduler.timeAxis?.isContinuous !== false;
    }

    // Where a rendered bar sits on the time axis
    getSnapshotTimeSpan({ renderData }) {
        return renderData?.startDateMS == null
            ? null
            : { startMS : renderData.startDateMS, endMS : renderData.endDateMS };
    }

    // The resources of the rendered columns
    get snapshotResources() {
        const { first, last } = this.resourceRange;

        return first === -1 ? [] : this.allResourceRecords.slice(first, last + 1);
    }

    // The dates rendered, including the tick buffer, see dateRange
    get snapshotDateRange() {
        const { topDateMS, bottomDateMS, scheduler } = this;

        return topDateMS == null ? scheduler.timeAxis : { startMS : topDateMS, endMS : bottomDateMS };
    }

    get snapshotViewport() {
        const { scrollTop, bodyHeight, tickSize } = this.scheduler;

        return {
            start          : scrollTop,
            end            : scrollTop + bodyHeight,
            // Same buffering as dateRange
            buffer         : tickSize,
            zeroSizeBuffer : tickSize,
            positionStyle  : 'top',
            sizeStyle      : 'height'
        };
    }

    // Draws a zoom gesture with liveZoom off: the snapshotted bars are moved directly and placeholders indicate the
    // events not rendered for the resources in view
    renderZoomSnapshot(firstResource, lastResource) {
        const
            me                                = this,
            { scheduler, allResourceRecords } = me,
            {
                scrollTop,
                bodyHeight,
                variableColumnWidths,
                resourceColumnWidth
            }                                 = scheduler;

        if (me.hiddenSpans) {
            me.placeholderConfigs.clear();

            for (let i = Math.max(firstResource, 0); i <= lastResource; i++) {
                const
                    resourceRecord                 = allResourceRecords[i],
                    { start : marginStart, total } = scheduler.getResourceMarginObject(resourceRecord),
                    columnStart                    = variableColumnWidths
                        ? resourceRecord.instanceMeta(scheduler).insetStart
                        : i * resourceColumnWidth,
                    columnSize                     = scheduler.getResourceWidth(resourceRecord) - total;

                me.placeholderConfigs.set(resourceRecord, me.getPlaceholderDOMConfigs(resourceRecord, scrollTop,
                    scrollTop + bodyHeight, columnStart + marginStart, columnSize));
            }
        }

        me.moveSnapshotElements();
        me.syncPlaceholders();

        me.fromScroll = false;
    }

    //endregion

    updateElementId() {}

    releaseTimeSpanDiv() {}

    //endregion

    //region Dependency connectors

    /**
     * Gets displaying item start side
     *
     * @param {Scheduler.model.EventModel} eventRecord
     * @returns {'top'|'left'|'bottom'|'right'} 'left' / 'right' / 'top' / 'bottom'
     */
    getConnectorStartSide(eventRecord) {
        return 'top';
    }

    /**
     * Gets displaying item end side
     *
     * @param {Scheduler.model.EventModel} eventRecord
     * @returns {'top'|'left'|'bottom'|'right'} 'left' / 'right' / 'top' / 'bottom'
     */
    getConnectorEndSide(eventRecord) {
        return 'bottom';
    }

    //endregion

    //region Refresh resources

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
     * Clears all resources directly and redraws them on next project refresh
     * @private
     */
    refreshAllResourcesWhenReady() {
        this.clearAll();
        this.refreshAllWhenReady = true;
    }

    //region Rendering

    // Resources in view + buffer
    get resourceRange() {
        return this.getResourceRange(true);
    }

    // Resources strictly in view
    get visibleResources() {
        const { first, last } = this.getResourceRange();

        return {
            first : this.allResourceRecords[first],
            last  : this.allResourceRecords[last]
        };
    }

    getResourceRange(withBuffer) {
        const
            {
                scheduler,
                resourceStore,
                allResourceRecords
            }                  = this,
            {
                resourceColumnWidth,
                scrollX
            }                  = scheduler,
            {
                scrollWidth
            }                  = scheduler.timeAxisSubGrid.scrollable,
            resourceBufferSize = withBuffer ? this.resourceBufferSize : 0,
            viewportStart      = scrollX - resourceBufferSize,
            viewportEnd        = scrollX + scrollWidth + resourceBufferSize;

        if (!resourceStore?.count) {
            return { first : -1, last : -1 };
        }

        // Some resources define their own width
        if (scheduler.variableColumnWidths) {
            let first, last = 0, start, end = 0;

            for (let i = 0; i < allResourceRecords.length; i++) {
                const resource = allResourceRecords[i];
                resource.instanceMeta(scheduler).insetStart = start = end;
                end                                         = start + scheduler.getResourceWidth(resource);

                if (start > viewportEnd) {
                    break;
                }
                if (end > viewportStart && first == null) {
                    first = i;
                }
                else if (start < viewportEnd) {
                    last = i;
                }
            }
            // No column intersects the viewport — report the same empty sentinel as the no-resources case above
            return first == null ? { first : -1, last : -1 } : { first, last };
        }
        // We are using fixed column widths
        else {
            // A scroll position past the last column (a stale scrollX after resources were removed, say) would
            // otherwise yield a `first` beyond the end of `allResourceRecords` and index it to undefined
            const max = allResourceRecords.length - 1;

            return {
                first : Math.min(Math.max(Math.floor(scrollX / resourceColumnWidth) - resourceBufferSize, 0), max),
                last  : Math.min(
                    Math.floor((scrollX + scheduler.timeAxisSubGrid.width) / resourceColumnWidth) + resourceBufferSize,
                    max
                )
            };
        }
    }

    // Dates in view + buffer
    get dateRange() {
        const { scheduler } = this;

        let bottomDate = scheduler.getDateFromCoordinate(Math.min(
            scheduler.scrollTop + scheduler.bodyHeight + scheduler.tickSize - 1,
            (scheduler.virtualScrollHeight || scheduler.scrollable.scrollHeight) - 1)
        );

        // Might end up below time axis (out of ticks)
        // <remove-on-release>
        // TODO: Change call order on refresh to make sure this is not needed?
        // </remove-on-release>
        if (!bottomDate) {
            bottomDate = scheduler.timeAxis.last.endDate;
        }

        let topDate = scheduler.getDateFromCoordinate(Math.max(scheduler.scrollTop - scheduler.tickSize, 0));

        // Might end up above time axis when reconfiguring (since this happens as part of rendering)
        if (!topDate) {
            topDate    = scheduler.timeAxis.first.startDate;
            bottomDate = scheduler.getDateFromCoordinate(scheduler.bodyHeight + scheduler.tickSize - 1) || scheduler.timeAxis.last.endDate;
        }

        return {
            topDate,
            bottomDate
        };
    }

    getTimeSpanRenderData(eventRecord, resourceRecord, includeOutside = false) {
        const
            me             = this,
            {
                scheduler
            }              = me,
            {
                variableColumnWidths
            }              = scheduler;

        let useEventBuffer = false;



        const
            startDateField = useEventBuffer ? 'wrapStartDate' : 'startDate',
            endDateField   = useEventBuffer ? 'wrapEndDate' : 'endDate',
            dataStartDate  = getDataDate(scheduler, eventRecord, false, startDateField, useEventBuffer, resourceRecord),
            dataEndDate    = getDataDate(scheduler, eventRecord, true, endDateField, useEventBuffer, resourceRecord),
            {
                resourceMarginObject : { total }
            }              = scheduler.getResourceLayoutSettings(resourceRecord),
            instanceMeta   = resourceRecord.instanceMeta(scheduler),
            // Preliminary values for left & width, used for proxy. Will be changed on layout.
            // The property "left" is utilized based on Scheduler's rtl setting.
            // If RTL, then it's used as the "right" style position.
            left           = variableColumnWidths ? instanceMeta.insetStart : me.allResourceRecords.indexOf(resourceRecord) * scheduler.resourceColumnWidth,
            resourceWidth  = scheduler.getResourceWidth(resourceRecord),
            width          = resourceWidth - total,
            // Use shared helper for fillTicks date snapping
            startDate                       = scheduler.getTickSnappedDate(dataStartDate, false, eventRecord, startDateField),
            endDate                         = scheduler.getTickSnappedDate(dataEndDate, true, eventRecord, endDateField),
            startDateMS                     = startDate.getTime(),
            endDateMS                       = endDate.getTime(),
            { timeAxis, timeAxisViewModel } = scheduler,
            startsOutsideView               = startDateMS < timeAxis.startMS,
            endsOutsideView                 = endDateMS > timeAxis.endMS,
            pxPerMs                         = timeAxisViewModel.getSingleUnitInPixels('millisecond');

        // Mirrors HorizontalRendering.calculateHorizontalPosition. End first so start can snap when end is in view.
        let bottom = endsOutsideView ? null : scheduler.getCoordinateFromDate(endDate, {
                respectExclusion : true,
                isEnd            : true
            }),
            top = startsOutsideView ? Math.round((startDateMS - timeAxis.startMS) * pxPerMs) : scheduler.getCoordinateFromDate(startDate, {
                respectExclusion   : true,
                isEnd              : false,
                snapToNextIncluded : bottom !== -1
            });

        // Extrapolate bottom for events whose end is past the time-axis end (mirrors HorizontalRendering.calculateHorizontalPosition)
        if (endsOutsideView) {
            bottom = timeAxisViewModel.totalSize + Math.round((endDateMS - timeAxis.endMS) * pxPerMs);
        }

        const
            clippedStart = !startsOutsideView && top === -1,
            clippedEnd   = !endsOutsideView   && bottom === -1;

        if (clippedEnd && !clippedStart) {
            // Snap end to next included tick (the opposite is already handled by `snapToNextIncluded` above)
            bottom = scheduler.getCoordinateFromDate(endDate, {
                respectExclusion   : true,
                isEnd              : true,
                snapToNextIncluded : true
            });
        }

        if (clippedStart && clippedEnd) {
            // Both endpoints land in excluded periods; snap both with bounds and drop if they collapse
            top = scheduler.getCoordinateFromDate(startDate, {
                respectExclusion   : true,
                isEnd              : false,
                snapToNextIncluded : true,
                max                : endDateMS
            });
            bottom = scheduler.getCoordinateFromDate(endDate, {
                respectExclusion   : true,
                isEnd              : true,
                snapToNextIncluded : true,
                min                : startDateMS
            });

            if (top === bottom) {
                eventRecord.instanceMeta(scheduler).excluded = true;
                return null;
            }
        }

        const height = bottom - top;

        const renderData = {
            eventRecord,
            resourceRecord,
            left,
            top,
            bottom,
            resourceWidth,
            width,
            height,
            startDate,
            endDate,
            startDateMS,
            endDateMS,
            startsOutsideView,
            endsOutsideView,
            clippedStart,
            clippedEnd,
            useEventBuffer,

            children : [],

            // <remove-on-release>
            // TODO: should change there to match horizontal
            // </remove-on-release>
            start   : startDate,
            end     : endDate,
            startMS : startDateMS,
            endMS   : endDateMS
        };

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
                renderData.dataStartMS = dataStartDate.getTime();
                renderData.dataEndMS   = dataEndDate.getTime();
            }
        }

        return renderData;
    }

    // Earlier start dates are above later tasks
    // If same start date, longer tasks float to top
    // If same start + duration, sort by name
    eventSorter(a, b) {
        const
            startA = a.dataStartMS || a.startDateMS, // dataXX are used if configured with fillTicks
            endA   = a.dataEndMS || a.endDateMS,
            startB = b.dataStartMS || b.startDateMS,
            endB   = b.dataEndMS || b.endDateMS,
            nameA  = a.isModel ? a.name : a.eventRecord.name,
            nameB  = b.isModel ? b.name : b.eventRecord.name;

        return startA - startB || endB - endA || (nameA < nameB ? -1 : nameA == nameB ? 0 : 1);
    }

    layoutEvents(resourceRecord, allEvents, includeOutside = false, parentEventRecord = null, eventSorter = null) {
        const
            me                        = this,
            { scheduler }             = me,
            {
                variableColumnWidths
            }                         = scheduler,
            { id : resourceId }       = resourceRecord,
            instanceMeta              = resourceRecord.instanceMeta(scheduler),
            cacheKey                  = parentEventRecord ? `${resourceId}-${parentEventRecord.id}` : resourceId,
            // Cache per resource
            cache                     = me.resourceMap.set(cacheKey, {}).get(cacheKey),
            // Resource "column"
            resourceIndex             = me.allResourceRecords.indexOf(resourceRecord);

        const layoutData = allEvents.reduce((toLayout, eventRecord) => {
            if (eventRecord.isScheduled) {
                const renderData = scheduler.generateRenderData(eventRecord, resourceRecord, false);

                // Both-endpoints-in-excluded-period collapse skips the event entirely (mirrors HorizontalRendering)
                if (renderData) {
                    // Elements will be appended to eventData during syncing
                    const
                        eventData      = { renderData },
                        eventResources = ObjectHelper.getMapPath(me.eventMap, renderData.eventId, {});

                    // Cache per event, { e1 : { r1 : { xxx }, r2 : ... }, e2 : ... }
                    // Uses renderData.eventId in favor of eventRecord.id to work with ResourceTimeRanges
                    eventResources[resourceId] = eventData;

                    // Cache per resource
                    cache[renderData.eventId] = eventData;

                    // Position ResourceTimeRanges directly, they do not affect the layout of others
                    if (renderData.fillSize) {
                        // With `fillSize : 'content'`, fill the column inside the resource margins (EventClustering)
                        const { start, total } = renderData.fillSize === 'content'
                            ? scheduler.getResourceMarginObject(resourceRecord)
                            : { start : 0, total : 0 };

                        // The property "left" is utilized based on Scheduler's rtl setting.
                        // If RTL, then it's used as the "right" style position.
                        renderData.left = (variableColumnWidths ? instanceMeta.insetStart : resourceIndex * scheduler.resourceColumnWidth) + start;

                        renderData.width = scheduler.getResourceWidth(resourceRecord) - total;
                    }
                    // Anything not flagged with `fillSize` should take part in layout
                    else {
                        toLayout.push(renderData);
                    }
                }
            }

            return toLayout;
        }, []);

        // Ensure the events are rendered in natural order so that navigation works.
        layoutData.sort(eventSorter ?? me.eventSorter);

        // Apply per resource event layout (pack, overlap, mixed or custom (avaialable only for Enterprise version))
        me.verticalLayout.applyLayout(
            layoutData,
            resourceRecord,
            parentEventRecord
        );

        // Documented on SchedulerBase. Allows features and application code to adjust the render data of a resource's
        // events when final pixel positions are known
        scheduler.trigger('eventLayoutDone', {
            resourceRecord,
            parentEventRecord,
            eventsData  : layoutData,
            eventLayout : scheduler.getEventLayout(resourceRecord, parentEventRecord)?.type
        });

        return cache;
    }

    // Calculate the layout for all events assigned to a resource. Since we are never stacking, the layout of one
    // resource will never affect the others
    layoutResourceEvents(resourceRecord, startDate, endDate) {
        const
            me                  = this,
            { scheduler }       = me,
            // Used in loop, reduce access time a wee bit
            {
                assignmentStore,
                eventStore,
                timeAxis
            }                   = scheduler,
            // When using an AssignmentStore we will get all events for the resource even if the EventStore is
            // filtered
            eventFilter        = (eventStore.isFiltered || assignmentStore.isFiltered) && (eventRecord =>
                eventRecord.assignments.some(a => a.resource === resourceRecord.$original && assignmentStore.includes(a)));

        // Events for the resource, minus those that are filtered out by filtering assignments and events
        let events = scheduler.getEvents({
            resourceRecord,

            startDate          : startDate ?? timeAxis.startDate,
            endDate            : endDate ?? timeAxis.endDate,
            filter             : eventFilter
        });

        // Hook for features to inject additional timespans to render
        events = scheduler.getEventsToRender(resourceRecord, events);

        return me.layoutEvents(resourceRecord, events);
    }

    /**
     * Used by event drag features to bring into existence event elements that are outside of the rendered block.
     * @param {Scheduler.model.TimeSpan} eventRecord The event to render
     * @private
     */
    addTemporaryDragElement(eventRecord) {
        const
            { scheduler } = this,
            renderData    = scheduler.generateRenderData(
                eventRecord,
                eventRecord.resource,
                { timeAxis : true, viewport : true }
            );

        // Event collapsed away by time-axis exclusions
        if (!renderData) {
            return null;
        }

        renderData.top = renderData.row
            ? (renderData.top + renderData.row.top)
            : scheduler.getResourceEventBox(eventRecord, eventRecord.resource, true).top;

        const
            domConfig   = this.renderEvent({ renderData }),
            { dataset } = domConfig;

        // The drag proxy is a positional ghost, it must not be a second focusable, named button
        delete domConfig.tabIndex;
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

                jsx && scheduler.processEventContent?.({
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

    // <remove-on-release>
    // TODO: Pretty much identical to HorizontalRendering#renderEvent.
    //  Make shared base class Render a single event, aborting if already in DOM.
    // </remove-on-release>
    // To update an event, first release its element and then render it again.
    // The element will be reused and updated. Keeps code simpler
    renderEvent(eventData) {
        // No point in rendering event that already has an element
        const
            { scheduler } = this,
            data          = eventData.renderData,
            {
                resourceRecord,
                assignmentRecord,
                eventRecord
            }             = data,
            // Sync using assignment id for events and event id for ResourceTimeRanges. Add eventId for occurrences to
            // make them unique
            syncId                                            = assignmentRecord
                // Assignment, might be an occurrence
                ? this.assignmentStore.getOccurrence(assignmentRecord, eventRecord).id
                // Something else, probably a ResourceTimeRange
                : data.eventId,
            isNestedParent                                    = scheduler.features?.nestedEvents?.enabled &&
                eventRecord.isParent,
            // Event element config, applied to existing element or used to create a new one below
            elementConfig = {
                className    : data.wrapperCls,
                // See HorizontalRendering#renderEvent, non-event records pushed through this path by features such
                // as ResourceTimeRanges must not become buttons, and a nested parent must not prune its children
                role         : ('role' in data) ? data.role : (eventRecord.isEvent ? (isNestedParent ? 'group' : 'button') : undefined),
                tabIndex     : -1,
                'aria-label' : data.ariaLabel,
                children     : [
                    {
                        role      : 'presentation',
                        className : data.cls,
                        style     : (data.internalStyle || '') + DomHelper.getCSSText(data.style),
                        children  : data.children,
                        dataset   : {
                            // Each feature putting contents in the event wrap should have this to simplify syncing and
                            // element retrieval after sync
                            taskFeature : 'event'
                        },
                        syncOptions : {
                            syncIdField : 'taskBarFeature'
                        }
                    },
                    ...data.wrapperChildren
                ],
                style : {
                    top              : data.top,
                    insetInlineStart : data.left,
                    // DomHelper appends px to dimensions when using numbers
                    height           : data.height,
                    width            : data.width,
                    style            : data.wrapperStyle || '',
                    '--b-event-size' : Math.min(data.width ?? scheduler.getResourceHeight(resourceRecord), 40)
                },
                dataset : {
                    // assignmentId is set in this function conditionally
                    resourceId : resourceRecord.id,
                    eventId    : data.eventId, // Not using eventRecord.id to distinguish between Event and ResourceTimeRange
                    syncId     : resourceRecord.isLinked ? `${syncId}_${resourceRecord.id}` : syncId

                },
                // Will not be part of DOM, but attached to the element
                elementData   : eventData,
                // Dragging etc. flags element as retained, to not reuse/release it during that operation
                retainElement : this.getRetainElement(data),
                // Options for this level of sync, lower levels can have their own
                syncOptions   : {
                    syncIdField      : 'taskFeature',
                    // Remove instead of release when a feature is disabled
                    releaseThreshold : 0
                }
            };

        elementConfig.className['b-sch-vertical'] = 1;

        // Some browsers throw warnings on zIndex = ''
        if (data.zIndex) {
            elementConfig.style.zIndex = data.zIndex;
        }

        // Do not want to spam dataset with empty prop when not using assignments (ResourceTimeRanges)
        if (assignmentRecord) {
            elementConfig.dataset.assignmentId = assignmentRecord.id;
        }

        // Allows access to the used config later, for example to retrieve element
        data.elementConfig = eventData.elementConfig = elementConfig;

        scheduler.afterRenderEvent({ renderData : data, domConfig : elementConfig });

        return elementConfig;
    }

    // Events always use assignments but ResourceTimeRanges do not, hence the fallback. Read at sync time by both the
    // fresh and the reuse path, `retainElement` is transient and a value cached mid-drag freezes the element (#13576)
    getRetainElement({ assignmentRecord, eventRecord }) {
        return (assignmentRecord || eventRecord).instanceMeta(this.scheduler).retainElement;
    }

    renderResource(resourceRecord, startDate, endDate) {
        const
            me              = this,
            // Date at top and bottom for determining which events to include
            topDateMS       = startDate?.getTime() ?? me.topDateMS,
            bottomDateMS    = endDate?.getTime() ?? me.bottomDateMS,
            // Will hold element configs
            eventDOMConfigs = [];

        let resourceEntry = me.resourceMap.get(resourceRecord.id);

        // Layout all events for the resource unless already done
        if (!resourceEntry) {
            resourceEntry = me.layoutResourceEvents(resourceRecord, startDate, endDate);
        }

        // Iterate over all events for the resource
        for (const eventId in resourceEntry) {
            const
                eventData                               = resourceEntry[eventId],
                { endDateMS, startDateMS, eventRecord } = eventData.renderData,
                inDateRange                             = endDateMS >= topDateMS && startDateMS <= bottomDateMS,
                hasTempElement                          = eventRecord.instanceMeta(me.scheduler).hasTemporaryDragElement;

            if (inDateRange && !hasTempElement) {
                // Reuse DomConfig if available, otherwise render event to create one
                const reusedConfig = eventData.elementConfig?.className !== 'b-released' && eventData.elementConfig;

                if (reusedConfig) {
                    reusedConfig.retainElement = me.getRetainElement(eventData.renderData);
                }

                eventDOMConfigs.push(reusedConfig || me.renderEvent(eventData));
            }
        }

        return eventDOMConfigs;
    }

    get shouldWaitForInitializeAndEngineReady() {
        return !this.initialized || (!this.scheduler.isEngineReady && !this.scheduler.isCreating);
    }

    // Single cell so only one call to this renderer, determine which events are in view and draw them.
    // Drawing on scroll is triggered by `updateFromVerticalScroll()` and `updateFromHorizontalScroll()`
    renderer() {
        const
            me                                           = this,
            { scheduler }                                = me,
            // Date at top and bottom for determining which events to include
            { topDate, bottomDate }                      = me.dateRange,
            syncConfigs                                  = [],
            featureDomConfigs                            = [],
            { entityNames }                              = me,
            visibleDomConfigs                            = { event : [] },
            { allResourceRecords, fromScroll }           = me;

        // Respect the host Scheduler's refresh suspension, symmetric with HorizontalRendering (#13045).
        // `SchedulerBase.resumeRefresh()` replays via an explicit `refresh()` when the counter drops
        // to zero, so no work is lost by bailing out here.
        if (scheduler.refreshSuspended) {
            return;
        }

        // Pre-initialize arrays for all previously seen entity types (e.g., 'resourceTimeRange').
        // This ensures DomSync.sync is called for each canvas even when empty, allowing proper
        // element release when all items of that type are removed.
        for (const entityName of entityNames) {
            visibleDomConfigs[entityName] = [];
        }

        // Resources actually in view (plus scroll buffer). The getter recomputes on each read, so read it once
        // and reuse it below, both as the hook's input and as the range reported after rendering.
        const visibleRange = me.resourceRange;

        // Determine resource range to draw events for, allowing subclasses/features to widen it
        let { first : firstResource, last : lastResource } =
            scheduler.getVerticalResourceRange({ ...visibleRange, allResourceRecords });

        // If scheduler is creating a new event, the render needs to be synchronous, so
        // we cannot wait for the engine to normalize - the new event will have correct data set.
        if (me.shouldWaitForInitializeAndEngineReady) {
            // This pass is discarded, so it has to be owed to `onProjectRefresh` (refresh /
            // commitFinalized), which is the only thing that drains it. A scroll-driven render that
            // lands while an auto-commit is pending sets no other flag, so without this the previous
            // scroll position's events stay in the DOM until something else happens to trigger a
            // render — leaving the newly scrolled-to region blank.
            me.refreshAllWhenReady = true;

            return;
        }

        // Update current time range, reflecting the change on the vertical time axis header
        if (!DateHelper.isEqual(topDate, me.topDate) || !DateHelper.isEqual(bottomDate, me.bottomDate)) {
            // Calculated values used by `renderResource()`
            me.topDate      = topDate;
            me.bottomDate   = bottomDate;
            me.topDateMS    = topDate.getTime();
            me.bottomDateMS = bottomDate.getTime();

            const range = me.timeView.range = { startDate : topDate, endDate : bottomDate };

            scheduler.internalOnVisibleDateRangeChange(range);
        }

        // A zoom gesture with liveZoom off moves the snapshotted bars itself, only the placeholders go through DomSync
        if (me.frozenElements) {
            me.renderZoomSnapshot(firstResource, lastResource);

            return;
        }

        if (firstResource !== -1 && lastResource !== -1) {
            if (scheduler.internalEventLayout.type === 'layoutFn') {
                // Custom layout is an Enterprise tier feature, and it is located in ProVerticalRendering.js
                me.renderResourceCustomLayout(syncConfigs);
            }
            else {
                // Collect all events for resources in view
                for (let i = firstResource; i <= lastResource; i++) {
                    syncConfigs.push.apply(syncConfigs, me.renderResource(allResourceRecords[i]));
                }
            }

            // Deliberately discard any widening applied above. The widened range says what had to be *drawn*
            // (wide events spilling in from off-screen columns); `visibleResources`, `me.firstResource/lastResource`
            // and the `resourceRangeChange` event all describe what the user can actually *see*.
            firstResource = visibleRange.first;
            lastResource  = visibleRange.last;
        }

        scheduler.getForegroundDomConfigs(featureDomConfigs);

        syncConfigs.push.apply(syncConfigs, featureDomConfigs);

        // Sync to a per-feature canvas, determined by entityName
        for (const domConfig of syncConfigs) {
            const { entityName = 'event' } = domConfig.elementData.renderData;
            if (!visibleDomConfigs[entityName]) {
                visibleDomConfigs[entityName] = [];
                // Track this entity name so future renders call DomSync.sync even when empty
                entityNames.add(entityName);
            }
            visibleDomConfigs[entityName].push(domConfig);
        }

        for (const entityName in visibleDomConfigs) {
            DomSync.sync({
                domConfig : {
                    onlyChildren : true,
                    children     : visibleDomConfigs[entityName]
                },
                targetElement    : scheduler.canvases[entityName],
                syncIdField      : 'syncId',
                releaseThreshold : scheduler.eventReleaseThreshold,

                // Called by DomHelper when it creates, releases or reuses elements
                callback : ({ action, domConfig, lastDomConfig, targetElement, jsx }) =>
                    verticalRenderingDomSyncCallback(scheduler, fromScroll, {
                        domConfig,
                        jsx,
                        action,
                        targetElement,
                        lastDomConfig
                    })
            });
        }

        // Change in displayed resources?
        if (me.firstResource !== firstResource || me.lastResource !== lastResource) {
            //<debug>
            // Logged here rather than before rendering, so it fires once per actual change instead of on every
            // render, and only for indices that have been validated against `allResourceRecords`
            if (globalThis.DEBUG && firstResource !== -1) {
                console.log(`Resources in view ${allResourceRecords[firstResource].id} -> ${allResourceRecords[lastResource].id}`);
            }
            //</debug>

            // Update header to match
            const range = me.resourceColumns.visibleResources = { firstResource, lastResource };

            // Store which resources are currently in view
            me.firstResource = firstResource;
            me.lastResource  = lastResource;

            scheduler.onVisibleResourceRangeChange(range);
            scheduler.trigger('resourceRangeChange', range);
        }

        // Clears out the placeholders after a zoom gesture
        me.syncPlaceholders();

        me.fromScroll = false;

        scheduler.trigger('renderEventDone');
    }

    refresh(shouldAnimate) {
        this.scheduler.runWithTransition(() => this.renderer(), shouldAnimate);
    }

    // To match horizontals API. Pass `clearLayout` as `false` to reuse the cached event layout
    refreshEvents(transition = true, clearLayout = true) {
        if (clearLayout) {
            this.clearAll();
        }
        this.refresh(transition);
    }

    // To match horizontals API, used from EventDrag
    refreshResources(resourceIds) {
        resourceIds = resourceIds.map(r => r.id ?? r);

        this.clearResources(resourceIds);
        this.refresh();
    }

    // To match horizontals API, used from EventDrag
    refreshEventsForResource(recordOrRow, force = true, draw = true) {
        this.refreshResources([recordOrRow.id]);
    }

    onRenderDone() {

    }

    //endregion

    //region Other

    get timeView() {
        return this.scheduler.timeView;
    }

    //endregion

    //region Cache

    // Clears cached resource layout
    clearResources(resourceIds) {
        const { resourceMap, eventMap } = this;

        //<debug>
        if (globalThis.DEBUG) console.log('%Clearing resources ' + Array.from(resourceIds).join(','), 'color: #770000');
        //</debug>

        resourceIds.forEach(resourceId => {
            if (resourceMap.has(resourceId)) {
                // The *keys* of an Object are strings, so we must iterate the values
                // and use the original eventId to look up in the Map which preserves key type.
                Object.values(resourceMap.get(resourceId)).forEach(({ renderData : { eventId } }) => {
                    delete eventMap.get(eventId)[resourceId];
                });

                resourceMap.delete(resourceId);
            }
        });
    }

    clearAll() {
        //<debug>
        if (globalThis.DEBUG) console.log('%Clearing all', 'color: #770000');
        //</debug>

        this.resourceMap.clear();
        this.eventMap.clear();
    }

    //endregion
}

export function verticalRenderingDomSyncCallback(scheduler, fromScroll, {
    domConfig,
    jsx,
    action,
    targetElement,
    lastDomConfig
}) {
    const { reactComponent } = scheduler;

    if (action === 'beforeRelease' && lastDomConfig) {
        // Determine if a removal lead to the release
        const renderData = lastDomConfig.elementData?.renderData;

        // Clusters are recreated on each render, a released one was not removed from a store
        if (renderData?.eventRecord && !renderData.isCluster) {
            const { eventRecord, assignmentRecord, entityName = 'event' } = renderData;

            // Check the appropriate store based on entity type to determine if record still exists
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

            // If record is removed from store, transition it out instead of making element available for reuse
            if (!inStore && scheduler.transition?.removeEvent) {
                // Tell DomSync to leave it alone in future syncs
                targetElement.retainElement = true;

                scheduler.executeAndAwaitAnimations(
                    targetElement,
                    () => targetElement.classList.add('b-removing'),
                    null,
                    // Use the correct canvas for the entity type
                    () => DomSync.remove(targetElement)
                );

                // Prevent release
                return false;
            }
        }
    }

    // If element is an event wrap, trigger appropriate events
    if (scheduler.isEventElement(domConfig) || jsx || domConfig?.elementData?.jsx) {
        const
            // Some actions are considered first a release and then a render (reusing another element).
            // This gives clients code a chance to clean up before reusing an element
            isRelease = releaseEventActions[action],
            isRender  = renderEventActions[action];

        if (scheduler.processEventContent?.({
            action,
            domConfig,
            isRelease : false,
            targetElement,
            reactComponent,
            jsx,
            scrolling : fromScroll
        })) return;

        // If we are reusing an element that was previously released we should not trigger again
        if (isRelease && scheduler.isEventElement(lastDomConfig) && !lastDomConfig.isReleased) {
            const data = lastDomConfig.elementData?.renderData;

            // Guard against missing renderData which can happen during mode switches
            if (!data) {
                return;
            }

            const event = {
                renderData       : data,
                assignmentRecord : data.assignmentRecord,
                eventRecord      : data.eventRecord,
                resourceRecord   : data.resourceRecord,
                element          : targetElement
            };

            // Release any portal in React event content
            scheduler.processEventContent?.({
                isRelease,
                domConfig : lastDomConfig,
                targetElement,
                reactComponent
            });

            // Some browsers do not blur on set to display:none, so releasing the active element
            // must *explicitly* move focus outwards to the view.
            if (targetElement === DomHelper.getActiveElement(targetElement)) {
                scheduler.focusElement.focus();
            }

            // This event is documented on Scheduler
            scheduler.trigger('releaseEvent', event);
        }

        if (isRender) {
            const
                data  = domConfig.elementData.renderData,
                event = {
                    renderData       : data,
                    assignmentRecord : data.assignmentRecord,
                    eventRecord      : data.eventRecord,
                    resourceRecord   : data.resourceRecord,
                    element          : targetElement,
                    isReusingElement : action === 'reuseElement',
                    isRepaint        : action === 'reuseOwnElement'
                };

            event.reusingElement = action === 'reuseElement';

            // This event is documented on Scheduler
            scheduler.trigger('renderEvent', event);
        }
    }
}
