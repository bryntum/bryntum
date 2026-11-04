import Base from '../../Core/Base.js';

export default class TimelineHistogramRendering extends Base {
    static $name = 'TimelineHistogramRendering';

    static configurable = {
        scrollBuffer : 0
    };

    construct(client) {
        super.construct();
        this.client = client;
    }

    init() {}

    clearAll() {
        // Called when switching RTL
    }

    onTimeAxisViewModelUpdate() {
        const { scrollable } = this.client.timeAxisSubGrid;

        // scrollLeft is the DOM's concept which is -ve in RTL mode.
        // scrollX i always the +ve scroll offset from the origin.
        // Both may be needed for different calculations.
        this.updateFromHorizontalScroll(scrollable.x);
    }

    // Update header range on horizontal scroll
    updateFromHorizontalScroll(scrollX) {
        const
            me            = this,
            {
                client,
                // scrollBuffer is an export only thing
                scrollBuffer
            }             = me,
            {
                timeAxis,
                rtl
            }             = client,
            {
                totalSize,
                availableSpace : width
            }             = client.timeAxisViewModel,
            maxX          = Math.abs(totalSize - width),
            start         = scrollX,
            // If there are few pixels left from the right most position then just render all remaining ticks,
            // there wouldn't be many. It makes end date reachable with more page zoom levels while not having any poor
            // implications.
            // 5px to make TimeViewRangePageZoom test stable in puppeteer.
            returnEnd     = maxX !== 0 && maxX <= Math.round(start) + 5,
            startDate     = client.getDateFromVirtualCoord({ coord : Math.max(0, start - scrollBuffer) }),
            endDate       = returnEnd ? timeAxis.endDate : (client.getDateFromVirtualCoord({ coord : start + width + scrollBuffer }) || timeAxis.endDate);

        if (startDate && !client._viewPresetChanging) {
            me._visibleDateRange = { startDate, endDate, startMS : startDate.getTime(), endMS : endDate.getTime() };
            me.viewportCoords  = rtl
                // RTL starts all the way to the right (and goes in opposite direction)
                ? { left : totalSize - scrollX - width + scrollBuffer, right : totalSize - scrollX - scrollBuffer }
                // LTR all the way to the left
                : { left : scrollX - scrollBuffer, right : scrollX + width + scrollBuffer };

            // Update timeaxis header making it display the new dates
            const range = client.timeView.range = { startDate, endDate };

            client.internalOnVisibleDateRangeChange(range);

            // If refresh is suspended, someone else is responsible for updating the UI later
            if (!client.refreshSuspended && client.rowManager.rows.length) {
                // Gets here too early in Safari for ResourceHistogram. ResizeObserver triggers a scroll before rows are
                // rendered first time. Could not track down why, bailing out
                if (client.rowManager.rows[0].id === null) {
                    return;
                }

                // re-render all rows is timeAxis range has been updated
                if (me._timeAxisStartDate - timeAxis.startDate || me._timeAxisEndDate - timeAxis.endDate) {
                    me._timeAxisStartDate = timeAxis.startDate;
                    me._timeAxisEndDate = timeAxis.endDate;

                    client.rowManager.renderRows(client.rowManager.rows);
                }
            }
        }
    }

    onViewportResize() {}

    refreshRows() {}

    // To match horizontals API, histogram bars are rendered by the time axis column cells
    refreshEvents(transition = true) {
        this.client.refreshColumn(this.client.timeAxisColumn, transition);
    }

    get visibleDateRange() {
        return this._visibleDateRange;
    }

    translateToPageCoordinate(x) {
        const
            { client } = this,
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

    translateToScheduleCoordinate(x) {
        const
            { client } = this,
            { scrollable } = client.timeAxisSubGrid;

        let result = x - client.timeAxisSubGridElement.getBoundingClientRect().left - globalThis.scrollX;

        // Because we use getBoundingClientRect's left, we have to adjust for page scroll.

        if (client.rtl) {
            result += scrollable.maxX - Math.abs(client.scrollLeft);
        }
        else {
            result += client.scrollLeft;
        }

        return result;
    }

    getDateFromXY(xy, roundingMethod, local, allowOutOfRange = false) {
        const { client } = this;

        let coord = xy[0];

        if (!local) {
            coord = this.translateToScheduleCoordinate(coord);
        }

        coord = client.getRtlX(coord);

        return client.timeAxisViewModel.getDateFromPosition(coord, roundingMethod, allowOutOfRange);
    }

    // Implement basic getTimeSpanRenderData to come closer to Scheduler
    // to support ScheduleContext feature
    getTimeSpanRenderData(timeSpan, rowRecord, includeOutside = false) {
        const
            me                  = this,
            { client }          = me,
            {
                timeAxis,
                timeAxisViewModel
            }                   = client,
            pxPerMinute         = timeAxisViewModel.getSingleUnitInPixels('minute'),
            timeSpanStart       = timeSpan.startDate,
            timeSpanEnd         = timeSpan.endDate || timeSpanStart,
            viewStartMS         = timeAxis.startMS,
            viewEndMS           = timeAxis.endMS,
            elementStartMS      = timeSpanStart?.getTime(),
            elementEndMS        = timeSpanEnd?.getTime(),
            durationMS          = elementEndMS - elementStartMS,
            startsOutsideView   = elementStartMS < viewStartMS | ((elementStartMS > viewEndMS) << 1),
            endsOutsideView     = elementEndMS > viewEndMS | ((elementEndMS <= viewStartMS) << 1),
            durationMinutes     = durationMS / (1000 * 60),
            left                = client.getCoordinateFromDate(timeSpanStart, { ignoreRTL : true }),
            right               = client.getCoordinateFromDate(timeSpanEnd, { ignoreRTL : true }),
            width               = endsOutsideView ? pxPerMinute * durationMinutes : Math.abs(right - left),
            row                 = client.getRowById(rowRecord);

        return {
            eventRecord : timeSpan,
            taskRecord  : timeSpan,
            start       : timeSpanStart,
            end         : timeSpanEnd,
            rowId       : rowRecord.id,
            children    : [],
            startsOutsideView,
            endsOutsideView,
            top         : row.top,
            height      : row.height,
            row,
            left,
            right,
            width
        };
    }

}
