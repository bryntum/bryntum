import Base from '../../../Core/Base.js';
import DomSync from '../../../Core/helper/DomSync.js';
import DomClassList from '../../../Core/helper/util/DomClassList.js';
import FunctionHelper from '../../../Core/helper/FunctionHelper.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import StringHelper from '../../../Core/helper/StringHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';

// <remove-on-release>
// TODO: No need to keep this as an "orientation", make it a mixin for Gantt instead
// </remove-on-release>

/**
 * @module Gantt/view/orientation/NewTaskRendering
 * @internal
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
    };

// Clear an in-flight animated removal so the deferred DomSync.remove() becomes a no-op.
// https://github.com/bryntum/bryntum/issues/13130
function cancelPendingRemoval(element) {
    if (element.pendingRemovalCls) {
        element.classList.remove(element.pendingRemovalCls);
    }
    element.pendingRemoval = element.retainElement = element.transitionRemove = element.pendingRemovalCls = null;
}

/**
 * Handles rendering of tasks, using the following strategy:
 *
 * 1. When a row is rendered, it collects a DOM config for its task bar and stores in a map (row -> config)
 * 2. When a rendering pass is done, it syncs the DOM configs from the map to DOM
 *
 * The need for caching with this approach is minimal, only the map needs to be kept up to date with available rows.
 *
 * @internal
 * @extends Core/Base
 * @tier community
 */
export default class NewTaskRendering extends Base {
    static $name = 'NewTaskRendering';

    //region Config & Init

    static get properties() {
        return {
            rowMap : new Map()
        };
    }

    construct(gantt) {
        this.gantt = gantt;

        gantt.rowManager.ion({
            renderDone      : 'onRenderDone',
            removeRows      : 'onRemoveRows',
            beforeRowHeight : 'onBeforeRowHeightChange',
            translateRow    : 'onTranslateRow',
            thisObj         : this
        });

        super.construct({});
    }

    init() {}

    //endregion

    //region View hooks

    refreshRows() {}

    onTimeAxisViewModelUpdate() {
        if (!this.gantt.$skipWheelUpdate) {
            // Update view bounds
            this.updateFromHorizontalScroll(this.gantt.timeAxisSubGrid.scrollable.x);
        }
    }

    onViewportResize() {}

    onDragAbort() {}

    onBeforeRowHeightChange(event) {
        const
            { gantt } = this,
            { total } = gantt.resourceMarginObject;

        gantt.foregroundCanvas?.style.setProperty('--b-event-size', (event?.height ?? gantt.rowHeight) - total);
    }

    onTranslateRow({ row }) {
        // When updating a single row, and using autoHeight, it might lead to other rows being translated without being
        // re-rendered. We then must force update the task bar, to move with the row
        if (this.gantt.rowManager.updatingSingleRow) {
            this.redraw(this.gantt.store.getById(row.id));
        }
    }

    //endregion

    //region Region & coordinates

    get visibleDateRange() {
        return this._visibleDateRange;
    }

    getTaskBox(taskRecord, includeOutside = false, inner = false) {
        const
            { gantt }                                    = this,
            { start, total }                             = gantt.resourceMarginObject,
            { isBatchUpdating, isScheduled, isBaseline } = taskRecord,
            { store, showUnscheduledTasks, project }     = gantt,
            engineHasCalculated                          = project.usesAdvancedScheduling
                ? Boolean(project.graph)
                : project.isInitialCommitPerformed;

        let
            startDate = isBatchUpdating ? taskRecord.get('startDate') : taskRecord.startDate,
            endDate   = isBatchUpdating ? taskRecord.get('endDate') : taskRecord.endDate;

        if (inner) {
            const innerElement = this.getElementFromTaskRecord(taskRecord);

            if (innerElement) {
                return Rectangle.from(innerElement, gantt.timeAxisSubGridElement);
            }
        }

        // A task that gets startDate during initial propagation, which seems not have happened yet.
        // Or a removed task (this fn is also used for baselines). Nothing to render then
        if ((!showUnscheduledTasks && !isScheduled && (!startDate || !endDate)) || (!isScheduled && !engineHasCalculated) || taskRecord.isTask && (store.isDestroyed || !store.isAvailable(taskRecord))) {
            return null;
        }

        // When a task is unscheduled, fall back to the Gantt-level render-date helpers shared
        // with `Dependencies.drawDependency` so both call sites stay in sync.
        if (!isScheduled && !isBaseline) {
            startDate = startDate || gantt.getTaskStartDate(taskRecord);
            endDate   = endDate   || gantt.getTaskEndDate(taskRecord);
        }

        const positionData = this.getSizeAndPosition(taskRecord, includeOutside, inner, startDate, endDate);

        if (!positionData) {
            return null;
        }

        const
            { position, width } = positionData,
            top                 = gantt.rowManager.calculateTop(store.indexOf(taskRecord.isBaseline ? taskRecord.task : taskRecord)) + start,
            height              = gantt.rowHeight - total,
            bounds              = new Rectangle(position, top, width, height);

        // Position always correct in Gantt, since there is no stacking
        bounds.layout = true;

        return bounds;
    }

    // returns an object with `position` + `width`. If task is not inside current time axis, position is -1
    getSizeAndPosition(taskRecord, includeOutside, inner, startDate, endDate) {
        const
            me                   = this,
            { gantt }            = me,
            { total }            = gantt.resourceMarginObject,
            { timeAxis }         = gantt,
            viewStart            = timeAxis.startDate,
            viewEnd              = timeAxis.endDate,
            isMilestone          = taskRecord.milestone,
            isScheduled          = taskRecord.isScheduled,
            // Dependencies feature resolves to `undefined` when disabled, so guard the access
            horizontalAdjustment = isMilestone ? gantt.features.dependencies?.pathFinder?.startArrowMargin : 0;

        let
            // Must use Model.get in order to get latest values in case we are inside a batch.
            // TaskResize changes the endDate using batching to enable a tentative change
            // via the batchedUpdate event which is triggered when changing a field in a batch.
            // Fall back to accessor if propagation has not populated date fields.
            taskStart = startDate || (taskRecord.isBatchUpdating ? taskRecord.get('startDate') : taskRecord.startDate),
            // Might get here before engine has normalized
            taskEnd   = endDate || (taskRecord.isBatchUpdating
                ? taskRecord.get('endDate')
                : taskRecord.endDate || (taskRecord.duration != null && taskStart
                    ? DateHelper.add(taskStart, taskRecord.duration, taskRecord.durationUnit) : null)),
            startCoordinate, endCoordinate;

        // Early bailout for tasks with invalid dates
        if (!taskStart || !taskEnd) {
            return null;
        }

        // Early bailout for tasks that are fully out of timeaxis
        if (
            !includeOutside &&
            (isMilestone && (taskEnd < viewStart || taskStart > viewEnd) || !isMilestone && (taskEnd <= viewStart || taskStart >= viewEnd))
        ) {
            return null;
        }

        // The calls using `includeOutside` are not used during task rendering, but when rendering dependencies.
        // In those cases the lines are expected to be drawn even to tasks fully out of view, clipped to view bounds
        if (includeOutside && taskStart < viewStart) {
            startCoordinate = gantt.getVirtualCoordFromDate(viewStart) - horizontalAdjustment;
        }
        else if (includeOutside && taskStart > viewEnd) {
            startCoordinate = gantt.getVirtualCoordFromDate(viewEnd) + horizontalAdjustment;
        }
        // Starts before view and ends in or after view, approximate startCoordinate
        else if (taskStart < viewStart) {
            const
                // Using seconds instead of ms in a try to not lose too much precision in year views
                pxPerSecond      = gantt.timeAxisViewModel.getSingleUnitInPixels('second'),
                secondsOutOfView = (timeAxis.startMS - taskRecord.startDateMS) / 1000, // taskRecord.startDateMS is cached in TimeSpan
                pxOutOfView      = secondsOutOfView * pxPerSecond;

            startCoordinate = gantt.getVirtualCoordFromDate(viewStart) - pxOutOfView;
        }
        // The "normal" case, somewhere in the timeaxis
        else {
            if (gantt.fillTicks && !(isMilestone || !isScheduled) && (!taskRecord.isBatchUpdating || gantt.snap)) {
                const
                    tick = timeAxis.getSnappedTickFromDate(taskStart);

                taskStart = tick.startDate;
            }
            startCoordinate = gantt.getVirtualCoordFromDate(taskStart);
        }

        if (!(isMilestone || !isScheduled)) {
            // Same logic applies to `includeOutside` for end date, clip to view
            if (includeOutside && taskEnd < viewStart) {
                endCoordinate = gantt.getVirtualCoordFromDate(viewStart);
            }
            else if (includeOutside && taskEnd > viewEnd) {
                endCoordinate = gantt.getVirtualCoordFromDate(viewEnd);
            }
            // Starts in or before view and ends outside, approximate end
            else if (taskEnd > viewEnd) {
                const
                    pxPerSecond      = gantt.timeAxisViewModel.getSingleUnitInPixels('second'),
                    secondsOutOfView = (taskRecord.endDateMS - timeAxis.endMS) / 1000, // taskRecord.endDateMS is cached in TimeSpan
                    pxOutOfView      = secondsOutOfView * pxPerSecond;

                endCoordinate = gantt.getVirtualCoordFromDate(viewEnd) + pxOutOfView;
            }
            else {
                if (gantt.fillTicks && (!taskRecord.isBatchUpdating || gantt.snap)) {
                    const
                        tickIdx = Math.ceil(gantt.timeAxis.getTickFromDate(taskEnd)) - 1,
                        tick    = gantt.timeAxis.getAt(tickIdx);

                    taskEnd = tick.endDate;
                }
                endCoordinate = gantt.getVirtualCoordFromDate(taskEnd);
            }
        }

        let width = isMilestone || !isScheduled ? 0 : Math.abs(startCoordinate - endCoordinate);

        // Requesting diamond width, in viewport space
        if (inner && isMilestone && taskStart > viewStart && taskStart < viewEnd) {
            // By default as wide as it is high
            width = gantt.rowHeight - total;
            startCoordinate -= width / 2;
        }

        if (!includeOutside && startCoordinate + width < 0) {
            return null;
        }

        return {
            position : startCoordinate,
            width
        };
    }

    getRowRegion(taskRecord, startDate, endDate) {
        const
            { gantt } = this,
            row       = gantt.getRowFor(taskRecord);

        // might not be rendered
        if (!row) {
            return null;
        }

        const
            rowElement = row.getElement(gantt.timeAxisSubGrid.region),
            taStart    = gantt.timeAxis.startDate,
            taEnd      = gantt.timeAxis.endDate,
            start      = startDate ? DateHelper.max(taStart, startDate) : taStart,
            end        = endDate ? DateHelper.min(taEnd, endDate) : taEnd,
            startX     = gantt.getCoordinateFromDate(start),
            endX       = gantt.getCoordinateFromDate(end, true, true),
            y          = row.top + gantt.scrollTop,
            x          = Math.min(startX, endX),
            bottom     = y + rowElement.offsetHeight;

        return new Rectangle(x, y, Math.max(startX, endX) - x, bottom - y);
    }

    getDateFromXY(xy, roundingMethod, local) {
        let coord = xy[0];

        if (!local) {
            coord = this.translateToScheduleCoordinate(coord);
        }

        return this.gantt.timeAxisViewModel.getDateFromPosition(coord, roundingMethod);
    }

    translateToScheduleCoordinate(x) {
        const
            { gantt }      = this,
            { scrollable } = gantt.timeAxisSubGrid;

        let result = x - gantt.timeAxisSubGridElement.getBoundingClientRect().left - globalThis.scrollX;

        if (gantt.rtl) {
            result += scrollable.maxX - Math.abs(gantt.scrollLeft);
        }
        else {
            result += gantt.scrollLeft;
        }

        return result;
    }

    translateToPageCoordinate(x) {
        const
            client         = this.gantt,
            { scrollable } = client.timeAxisSubGrid;

        let result = x + client.timeAxisSubGridElement.getBoundingClientRect().left;

        if (client.rtl) {
            result -= scrollable.maxX - Math.abs(client.scrollLeft);
        }
        else {
            result -= client.scrollLeft;
        }

        return result;
    }

    //endregion

    //region Element <-> Record mapping

    getElementFromTaskRecord(taskRecord, inner = true) {
        const { syncIdMap } = this.gantt.foregroundCanvas;

        let wrapper = syncIdMap?.[taskRecord.id];

        // For linked tasks, we might be trying to find element for the original. If none found, we also check linked
        // tasks. Needed for dependencies, since they point to original tasks, not linked ones.
        if (!wrapper && taskRecord.hasLinks && syncIdMap) {
            taskRecord.forEachLinked((store, linked) => {
                if (syncIdMap[linked.id]) {
                    wrapper = syncIdMap[linked.id];
                }
            });
        }

        return inner ? wrapper?.syncIdMap.task : wrapper;
    }

    //endregion

    //region Dependency connectors

    // Cannot be moved from this file, called from currentOrientation.xx

    /**
     * Gets displaying item start side
     *
     * @param {Gantt.model.TaskModel} taskRecord
     * @returns {String} 'left' / 'right' / 'top' / 'bottom'
     */
    getConnectorStartSide(taskRecord) {
        return this.gantt.rtl ? 'right' : 'left';
    }

    /**
     * Gets displaying item end side
     *
     * @param {Gantt.model.TaskModel} taskRecord
     * @returns {String} 'left' / 'right' / 'top' / 'bottom'
     */
    getConnectorEndSide(taskRecord) {
        return this.gantt.rtl ? 'left' : 'right';
    }

    //endregion

    //region Rendering

    onRemoveRows({ rows }) {
        rows.forEach(row => this.rowMap.delete(row));
        !this.gantt.refreshSuspended && this.onRenderDone();
    }

    // Update header range on horizontal scroll. No need to draw any tasks, Gantt only cares about vertical scroll
    updateFromHorizontalScroll(scrollX) {
        const
            me        = this,
            { gantt } = me,
            {
                timeAxisSubGrid,
                timeAxis,
                timeAxisViewModel
            }         = gantt,
            { width } = timeAxisSubGrid,
            start     = scrollX,
            maxX      = Math.abs(timeAxisViewModel.totalSize - width),
            // If there are few pixels left from the right most position then just render all remaining ticks,
            // there wouldn't be many. It makes end date reachable with more page zoom levels while not having any poor
            // implications.
            // 5px to make TimeViewRangePageZoom test stable in puppeteer.
            returnEnd = maxX !== 0 && Math.abs(maxX) <= Math.round(start) + 5,
            startDate = gantt.getDateFromVirtualCoord({ coord : Math.max(0, start) }),
            endDate   = returnEnd ? timeAxis.endDate : (gantt.getDateFromVirtualCoord({ coord : start + width }) || timeAxis.endDate);

        if (startDate && !gantt._viewPresetChanging) {
            me._visibleDateRange = { startDate, endDate, startMS : startDate.getTime(), endMS : endDate.getTime() };
            me.viewportCoords = { left : scrollX, right : scrollX + width };

            const range = { startDate, endDate };

            gantt.internalOnVisibleDateRangeChange(range);
        }
    }

    internalPopulateTaskRenderData(renderData, taskRecord) {
        const
            { gantt }                = this,
            { showUnscheduledTasks } = gantt,
            taskContent              = {
                className : 'b-gantt-task-content',
                dataset   : {
                    taskBarFeature : 'content'
                },
                children : []
            },
            isSelected               = gantt.selectedRecords.includes(taskRecord);

        if (renderData) {
            let resizable = (taskRecord.isResizable === undefined ? true : taskRecord.isResizable);

            if (renderData.startsOutsideView) {
                if (resizable === true) {
                    resizable = 'end';
                }
                else if (resizable === 'start') {
                    resizable = false;
                }
            }
            if (renderData.endsOutsideView) {
                if (resizable === true) {
                    resizable = 'start';
                }
                else if (resizable === 'end') {
                    resizable = false;
                }
            }

            Object.assign(renderData, {
                iconCls        : new DomClassList(taskRecord.taskIconCls),
                id             : gantt.getEventRenderId(taskRecord.id),
                style          : taskRecord.style || '',
                wrapperStyle   : null,
                taskId         : taskRecord.id,
                // Pass record generations to allow WrapperHelper to decide if portals need recreating or not
                // (it can reach them using wrap.elementData.taskGeneration etc.)
                taskGeneration : taskRecord.generation,
                // Classes for the wrapping div
                wrapperCls     : new DomClassList({
                    [gantt.eventCls + '-wrap']   : 1,
                    [`${gantt.eventCls}-parent`] : taskRecord.isParent,
                    'b-unscheduled'              : showUnscheduledTasks && !taskRecord.isScheduled,
                    'b-milestone-wrap'           : taskRecord.milestone,
                    'b-inactive'                 : taskRecord.inactive,
                    'b-expanded'                 : taskRecord.isParent && taskRecord.isExpanded(gantt.store),
                    'b-read-only'                : taskRecord.readOnly,
                    'b-linked'                   : taskRecord.isLinked,
                    'b-original'                 : taskRecord.hasLinks,
                    'b-temporary'                : !taskRecord.project,
                    'b-selected'                 : isSelected,
                    'b-colorize'                 : 1,
                    'b-toggle-add'               : taskRecord.instanceMeta(gantt).togglingAdd

                }),
                // Task record cls property is now a DomClassList, so clone it
                // so that it can be manipulated here and by renderers.
                cls          : taskRecord.isResourceTimeRange ? new DomClassList() : taskRecord.cls.clone(),
                // Extra DOMConfigs to add to the tasks row, for example for indicators
                extraConfigs : []
            });

            // Gather event element classes as keys to add to the renderData.cls DomClassList.
            // Truthy value means the key will be added as a class name.
            Object.assign(renderData.cls, {
                [gantt.eventCls]                       : 1,
                [gantt.generatedIdCls]                 : taskRecord.hasGeneratedId,
                [gantt.dirtyCls]                       : taskRecord.modifications,
                [gantt.committingCls]                  : taskRecord.isCommitting,
                [gantt.endsOutsideViewCls]             : renderData.endsOutsideView,
                [gantt.startsOutsideViewCls]           : renderData.startsOutsideView,
                [gantt.fixedEventCls]                  : taskRecord.isDraggable === false,
                [`b-sch-event-resizable-${resizable}`] : 1,
                'b-milestone'                          : taskRecord.milestone,

                'b-task-selected'                      : isSelected
            });

            const
                // Segments are seeded with their own style only, with no task or Gantt fallback.
                // See EventSegments#generateSegmentRenderData
                eventStyle = taskRecord.isEventSegment
                    ? taskRecord.eventStyle
                    : taskRecord.eventStyle || gantt.eventStyle,
                eventColor = (gantt.inheritEventColor ? taskRecord.inheritedEventColor : taskRecord.eventColor) || gantt.eventColor;

            renderData.eventColor = eventColor;
            renderData.eventStyle = eventStyle;

            if (gantt.taskRenderer && taskRecord.isScheduled) {
                // User has specified a renderer fn, either to return a simple string, or an object
                const value = gantt.taskRenderer.call(gantt.taskRendererThisObj || gantt, {
                    taskRecord,
                    renderData
                });

                // If the user's renderer coerced it into a string, recreate a DomClassList.
                if (typeof renderData.cls === 'string') {
                    renderData.cls = new DomClassList(renderData.cls);
                }

                // Same goes for iconCls
                if (typeof renderData.iconCls === 'string') {
                    renderData.iconCls = new DomClassList(renderData.iconCls);
                }

                if (typeof renderData.wrapperCls === 'string') {
                    renderData.wrapperCls = new DomClassList(renderData.wrapperCls);
                }

                let childContent = null;

                // Likely HTML content
                if (StringHelper.isHtml(value)) {
                    childContent = {
                        tag  : 'span',
                        html : value
                    };
                }
                // DOM config or plain string can be used as is
                else if (typeof value === 'string' || typeof value === 'object') {
                    childContent = value;
                }
                // Other, use string
                else if (value != null) {
                    childContent = String(value);
                }

                if (childContent) {
                    if (Array.isArray(childContent)) {
                        taskContent.children.push(...childContent);
                    }
                    else {
                        taskContent.children.push(childContent);
                    }
                    renderData.cls.add('b-has-content');
                }
            }

            // If there are any iconCls entries...
            renderData.cls['b-gantt-task-withicon'] = renderData.iconCls.length;

            // renderers have last say on style & color
            renderData.wrapperCls[`b-style-${renderData.eventStyle || 'none'}`] = 1;

            const colorName = DomHelper.getColorName(renderData.eventColor);
            if (colorName) {
                renderData.wrapperCls[`b-color-${colorName}`] = renderData.eventColor;
            }
            else if (renderData.eventColor) {
                const style = `--b-primary:${renderData.eventColor};`;
                renderData.wrapperStyle = style;
                renderData.wrapperCls['b-sch-custom-color'] = 1;
                renderData._customColorStyle = style;
            }
            else {
                renderData.wrapperCls['b-color-none'] = 1;
            }

            renderData.wrapperCls['b-highlighted'] = taskRecord.instanceMeta(gantt).isHighlighted ? 1 : 0;

            // Milestones has to apply styling to b-sch-task-content
            if (renderData.style && (taskRecord.isMilestone || !taskRecord.isScheduled) && taskContent) {
                taskContent.style = renderData.style;
                delete renderData.style;
            }

            if (renderData.iconCls?.length) {
                taskContent.children.unshift({
                    tag       : 'i',
                    className : renderData.iconCls
                });
            }

            if (showUnscheduledTasks && !taskRecord.isScheduled) {
                taskContent.children.unshift({
                    tag       : 'i',
                    className : 'b-icon-calendar b-icon'
                });
            }

            // if we have some children collected or it's a milestone (milestone styling needs content element presence)
            if (taskContent.children.length || taskRecord.milestone) {
                renderData.children.push(taskContent);
            }
        }

        renderData.taskContent = taskContent;

        renderData.wrapperChildren = [];
    }

    populateTaskRenderData(renderData, taskRecord) {
        this.internalPopulateTaskRenderData(...arguments);

        // Method which features may chain in to
        this.gantt.onTaskDataGenerated(renderData);
    }

    // This method is a single entry point to get complete render data for the task
    getTaskRenderData(row, taskRecord) {
        const
            me        = this,
            { gantt } = me,
            { start } = gantt.resourceMarginObject,
            box       = me.getTaskBox(taskRecord, false, false, row),
            data      = {
                taskRecord,
                // <remove-on-release>
                // TODO: Deprecate task
                // </remove-on-release>
                task     : taskRecord,
                row,
                children : []
            };

        if (box) {
            Object.assign(data, {
                isTask : true,
                top    : box.top,
                left   : box.left,
                height : box.height,
                ...(taskRecord.isScheduled ? { width : box.width } : {})
            });
        }
        else {
            // Calculate top position, used by Baselines feature to position its elements
            data.top = row.top + start;
        }

        me.populateTaskRenderData(data, taskRecord);

        return data;
    }

    // This method generates DOM config from the render data
    getTaskDOMConfig(data) {
        let { width, left } = data;
        // Limit the positioning of the element to -100000
        // This is to make sure the element is fully rendered even on a very high zoom level
        if (left < -100000) {
            width += left + 100000;
            left = -100000;
        }

        return {
            id           : data.id,
            className    : data.wrapperCls,
            role         : 'button',
            tabIndex     : '0',
            // A default task bar renders no text of its own, without a name it would be a button named by nothing.
            // Features chaining onTaskDataGenerated may supply their own
            'aria-label' : data.ariaLabel ?? data.taskRecord.name,
            children     : [
                {
                    className : data.cls,
                    style     : (data.internalStyle || '') + DomHelper.getCSSText(data.style),
                    children  : data.children,
                    dataset   : {
                        // Each feature putting contents in the task wrap should have this to simplify syncing and
                        // element retrieval after sync
                        taskFeature : 'task'
                    },
                    syncOptions : {
                        syncIdField : 'taskBarFeature'
                    }
                },
                ...data.wrapperChildren
            ],
            style : {
                top              : data.top,
                insetInlineStart : left,
                // DomHelper appends px to dimensions when using numbers
                width,
                zIndex           : data.zIndex,
                style            : data.wrapperStyle
            },
            dataset : {
                taskId : data.taskId
            },
            // Will not be part of DOM, but attached to the element
            elementData : data,
            // Options for this level of sync, lower levels can have their own
            syncOptions : {
                syncIdField      : 'taskFeature',
                // Remove instead of release when a feature is disabled
                releaseThreshold : 0
            }
        };
    }

    // Called per row in "view", collect configs
    renderer({ row, record : taskRecord }) {
        const
            me   = this,
            data = me.getTaskRenderData(row, taskRecord);

        let config;

        if (data.isTask) {
            config = me.getTaskDOMConfig(data);
            me.gantt.trigger('beforeRenderTask', { renderData : data, domConfig : config });
        }
        else if (data.extraConfigs.length === 0) {
            me.rowMap.delete(row);
            return;
        }

        // To render events exporter creates a special fake row which gets destroyed separately and is not added to
        // row manager. Once set as a map key it stays there. To remove it we add a destroy handler once.
        // https://github.com/bryntum/bryntum/issues/9256
        if (row.isFakeRow && !me.rowMap.has(row)) {
            FunctionHelper.before(row, 'doDestroy', () => {
                if (!me.isDestroying) {
                    me.rowMap.delete(row);
                }
            });
        }

        // Store DOM configs
        me.rowMap.set(row, [config, ...data.extraConfigs]);
    }

    // Syncs the aria-owns attribute on the row's time axis cell with the id of the task bar rendered in that row.
    // Called without ownedId to reset the attribute, for a row whose task renders no bar
    syncAriaOwns(row, ownedId) {
        if (row.isDestroyed) {
            return;
        }

        const
            // The time axis column is the only column of its region, so its cell is the region's first cell
            cell  = row.getCells(this.gantt.timeAxisColumn.region)[0],
            value = ownedId ?? null;

        if (cell && cell.getAttribute('aria-owns') !== value) {
            DomHelper.setAttributes(cell, { 'aria-owns' : value });
        }
    }

    // Called when the current row rendering "pass" is complete, sync collected configs to DOM
    onRenderDone() {
        const
            me                                   = this,
            { gantt }                            = me,
            { reactComponent, foregroundCanvas } = gantt,
            configs                              = Array.from(me.rowMap.values()).flat();

        // Give features a chance to inject or manipulate task configs
        gantt.onBeforeTaskSync(configs);

        DomSync.sync({
            domConfig : {
                onlyChildren : true,
                children     : configs
            },
            targetElement : foregroundCanvas,
            syncIdField   : 'taskId',

            // Called by DomHelper when it creates, releases or reuses elements
            callback({ action, domConfig, lastDomConfig, targetElement : element, jsx }) {

                if (jsx && action === 'syncFwConfig') {
                    gantt.processTaskContent?.({
                        jsx,
                        action,
                        domConfig,
                        targetElement : element,
                        reactComponent
                    });
                    return;
                }

                const { inserting } = gantt.rowManager;

                // A live config is reclaiming this element; cancel any pending animated removal. `retainElement` covers
                // DomSync's silent relink path, where the element is flagged retained but the syncId is being rebound.
                if ((action === 'reuseOwnElement' || action === 'reuseElement' || action === 'retainElement') && element.pendingRemoval) {
                    cancelPendingRemoval(element);
                }

                if (action === 'beforeRelease' && lastDomConfig) {
                    // Determine if a removal lead to the release
                    if (lastDomConfig.elementData?.taskRecord?.isTaskModel) {
                        const { taskRecord } = lastDomConfig.elementData;

                        // If rowManager is animating, affected elements will be retained and ready for us to handle and
                        // transition here. If a task is removed, we can also transition it out here instead of making
                        // the task available for reuse.
                        // We should only do this when rowManager is doing an intentional animated operation (inserting is not null)
                        // Fixed: https://github.com/bryntum/bryntum/issues/12055
                        if (inserting && (element.transitionRemove || !gantt.taskStore.allRecords.includes(taskRecord) && gantt.transition?.removeRecord)) {
                            // Tell DomSync to leave it alone in future syncs
                            element.retainElement = true;

                            // One-shot consumption so subsequent flag checks don't re-trigger this branch
                            element.transitionRemove = false;

                            // Cancellation token honored by the deferred cleanup below
                            // https://github.com/bryntum/bryntum/issues/13130
                            element.pendingRemoval = true;

                            // b-toggle-add etc. or b-remove-remove. Recorded so cancellation removes the exact class added.
                            const animClass = 'b-' + inserting;
                            element.pendingRemovalCls = animClass;

                            gantt.executeAndAwaitAnimations(
                                element,
                                () => element.classList.add(animClass),
                                null,
                                () => {
                                    if (element.pendingRemoval) {
                                        element.pendingRemoval = false;
                                        DomSync.remove(element);
                                    }
                                }
                            );

                            // Prevent release
                            return false;
                        }
                    }
                }

                if (action === 'releaseElement' && lastDomConfig?.id) {
                    element.removeAttribute('id');
                    lastDomConfig.id = null;
                }

                // If element is a task wrap, trigger appropriate events
                if (action !== 'none' && domConfig && domConfig.className && domConfig.className[gantt.eventCls + '-wrap']) {
                    const
                        // Some actions are considered first a release and then a render (reusing another element).
                        // This gives clients code a chance to clean up before reusing an element
                        isRelease = releaseEventActions[action],
                        isRender  = renderEventActions[action];

                    // If we are reusing an element that was previously released we should not trigger again
                    if (isRelease && lastDomConfig?.elementData?.isTask) {
                        const
                            event = {
                                renderData : lastDomConfig.elementData,
                                taskRecord : lastDomConfig.elementData.taskRecord,
                                element
                            };

                        // This event is documented on Gantt
                        gantt.trigger('releaseTask', event);
                    }

                    // Trigger only for actual tasks, not indicators or baselines
                    if (isRender && domConfig?.elementData?.isTask) {
                        const
                            { taskRecord } = domConfig.elementData,
                            event          = {
                                renderData     : domConfig.elementData,
                                taskRecord,
                                reusingElement : action === 'reuseElement',
                                element
                            };

                        // When a new event element is created during an animated toggle of group / node, add a temporary animationCls
                        // to it (meta flag needed to preserve the cls as the element gets updated by
                        // DomSync next time)
                        if (action === 'newElement' && inserting === 'toggle-add') {
                            element.classList.add('b-toggle-add');
                            // Looks weird flagging both assignment & resource, but since resources might be linked, we need to make
                            // sure we only animate the new element
                            taskRecord.instanceMeta(gantt).togglingAdd = true;

                            gantt.setTimeout(() => taskRecord.instanceMeta(gantt).togglingAdd = false, 300);
                        }

                        // This event is documented on Gantt
                        gantt.trigger('renderTask', event);
                    }
                }
            }
        });

        for (const row of gantt.rowManager?.rows ?? []) {
            // In Gantt the row is the task, so the bar id is derivable from the row itself. The first rowMap entry
            // is the task bar config, a row whose task renders no bar has none to own
            me.syncAriaOwns(row, me.rowMap.get(row)?.[0] ? gantt.getEventRenderId(row.id) : null);
        }
    }

    // Transitioned refresh of all events. Pass `clearLayout` as `false` to reuse the cached event layout
    refreshEvents(transition = true, clearLayout = true) {
        if (clearLayout) {
            this.clearAll();
        }
        this.gantt.refreshColumn(this.gantt.timeAxisColumn, transition);
        this.onRenderDone();
    }

    // Redraws a single task by rerendering its cell
    redraw(taskRecord) {
        // Refresh cell, will call `renderer` above and update its DOM config
        if (this.gantt.rowManager.refreshCell(taskRecord, this.gantt.timeAxisColumn.id)) {
            // Update DOM
            this.onRenderDone();
        }
    }

    clearAll() {
        // Empty method, which is called for clearing rendered data on RTL changes in TimelineBase.
        // Add required procedures here.
    }

    toggleCls(taskRecord, cls, add = true, useWrapper = false) {
        const
            element = this.gantt.getElementFromTaskRecord(taskRecord, !useWrapper),
            row     = this.gantt.rowManager.getRowFor(taskRecord),
            configs = row && this.rowMap.get(row);

        // Update cached config
        if (configs) {
            for (const config of configs) {
                if (config?.elementData?.isTask) {
                    for (const child of config.children) {
                        if (child.dataset?.taskFeature === 'task') {
                            child.className[cls] = add;
                        }
                    }
                }
            }
        }

        // Live update element
        if (element) {
            // Update element
            element.classList.toggle(cls, add);
            // And its DOM config
            element.lastDomConfig.className[cls] = add;
        }
    }

    //endregion
}
