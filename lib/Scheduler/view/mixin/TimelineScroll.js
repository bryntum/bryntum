import Base from '../../../Core/Base.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import Scroller from '../../../Core/helper/util/Scroller.js';
import TimelineZoomable from './TimelineZoomable.js';

/**
 * @module Scheduler/view/mixin/TimelineScroll
 */
const
    maintainVisibleStart = {
        maintainVisibleStart : true
    },
    defaultScrollOptions = {
        block : 'nearest'
    };

/**
 * Functions for scrolling to events, dates etc.
 *
 * Note: the mixin applies {@link Scheduler/view/mixin/TimelineZoomable} mixin if it's not applied yet.
 *
 * ```javascript
 * // Scroll to a specific date with animation
 * scheduler.scrollToDate(new Date(2024, 5, 15), {
 *     block   : 'center',
 *     animate : true
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Scheduler.view.mixin.SchedulerScroll} - Scheduler scroll functions
 * - {@link Scheduler.view.mixin.TimelineZoomable} - Zoom functionality
 *
 * @mixin
 */
export default Target => class TimelineScroll extends (Target || Base).mixin(
    // the mixin overrides TimelineZoomable method so should be applied after it
    TimelineZoomable
) {

    static $name = 'TimelineScroll';

    static configurable = {
        /**
         * This config defines the size of the start and end invisible parts of the timespan when {@link #config-infiniteScroll} set to `true`.
         *
         * It should be provided as a coefficient, which will be multiplied by the size of the scheduling area.
         *
         * For example, if `bufferCoef` is `5` and the panel view width is 200px then the timespan will be calculated to
         * have approximately 1000px (`5 * 200`) to the left and 1000px to the right of the visible area, resulting
         * in 2200px of totally rendered content.
         *
         * @config {Number}
         * @category Infinite scroll
         * @advanced
         * @default
         */
        bufferCoef : 5,

        /**
         * This config defines the scroll limit, which, when exceeded will cause a timespan shift.
         * The limit is calculated as the `panelWidth * {@link #config-bufferCoef} * bufferThreshold`. During scrolling, if the left or right side
         * has less than that of the rendered content - a shift is triggered.
         *
         * For example if `bufferCoef` is `5` and the panel view width is 200px and `bufferThreshold` is 0.2, then the timespan
         * will be shifted when the left or right side has less than 200px (5 * 200 * 0.2) of content.
         * @config {Number}
         * @category Infinite scroll
         * @advanced
         * @default
         */
        bufferThreshold : 0.2,

        /**
         * Set to `true` to automatically adjust the panel timespan during scrolling in the time dimension,
         * when the scroller comes close to the start/end edges.
         *
         * The actually rendered timespan in this mode (and thus the amount of HTML in the DOM) is calculated based
         * on the {@link #config-bufferCoef} option, and is thus not controlled by the {@link Scheduler/view/TimelineBase#config-startDate}
         * and {@link Scheduler/view/TimelineBase#config-endDate} configs. The moment when the timespan shift
         * happens is determined by the {@link #config-bufferThreshold} value.
         *
         * To specify initial point in time to view, supply the
         * {@link Scheduler/view/TimelineBase#config-visibleDate} config.
         *
         * {@note}If you activate {@link Scheduler.view.Scheduler#lazy-loading-data-infinite-scroll lazy loading}
         * you get an infinitely scrollable timeline with lazy loading of content.{/@note}
         *
         * @prp {Boolean} infiniteScroll
         * @category Infinite scroll
         * @default
         */
        infiniteScroll : false
    };

    //region TimelineZoomable injections

    onZoomToSpan({ startDate }) {
        if (this.infiniteScroll) {
            this.scrollToDate(startDate, { block : 'start' });
        }
    }

    calculateOptimalDateRange(centerDate, ...args) {
        if (this.infiniteScroll) {
            if (this.zoomKeepsOriginalTimespan) {
                const { startDate, endDate } = this.timeAxis;

                return { startDate, endDate };
            }

            return this.calculateInfiniteScrollingDateRange(centerDate, true);
        }

        return super.calculateOptimalDateRange(centerDate, ...args);
    }

    //endregion TimelineZoomable injections

    initScroll() {
        const
            me = this,
            {
                isHorizontal,
                visibleDate
            }  = me;

        super.initScroll();

        const { scrollable } = isHorizontal ? me.timeAxisSubGrid : me;

        scrollable.ion({
            scroll  : 'onTimelineScroll',
            thisObj : me
        });

        // Ensure the TimeAxis starts life at the correct size with buffer zones
        // outside the visible window.
        if (me.infiniteScroll) {
            // Partners and split clones share the time axis with their partner — just refresh
            // the view, don't run setTimeSpan (which would race with the partner's range).
            if (me.splitFrom?.infiniteScroll || me.partneredWith?.values.some(partner => partner.infiniteScroll)) {
                // Use exact subpixel available space so that tick size calculation is correct.
                const availableSpace = scrollable.element.getBoundingClientRect()[me.isHorizontal ? 'width' : 'height'];

                me.timeAxisViewModel.update(availableSpace, false, true);
            }
            // no infiniteScroll partners involved - calculate & set timespan
            else {
                const
                    setTimeSpanOptions     = visibleDate ? { ...visibleDate, visibleDate : visibleDate.date } : { visibleDate : me.viewportCenterDate, block : 'center' },
                    { startDate, endDate } = me.calculateInfiniteScrollingDateRange(setTimeSpanOptions.visibleDate, setTimeSpanOptions.block === 'center');

                // Don't ask to maintain visible start - we're initializing - there's no visible start yet.
                // If there's a visibleDate set, it will execute its scroll on paint.
                me.setTimeSpan(
                    startDate,
                    endDate,
                    setTimeSpanOptions
                );
            }
        }
    }

    /**
     * A {@link Core.helper.util.Scroller} which scrolls the time axis in whatever {@link Scheduler.view.Scheduler#config-mode} the
     * Scheduler is configured, either `horizontal` or `vertical`.
     *
     * The width and height dimensions are replaced by `size`. So this will expose the following properties:
     *
     *    - `clientSize` The size of the time axis viewport.
     *    - `scrollSize` The full scroll size of the time axis viewport
     *    - `position` The position scrolled to along the time axis viewport
     *
     * @member {Core.helper.util.Scroller}
     * @readonly
     * @category Scrolling
     */
    get timelineScroller() {
        const me = this;

        if (!me.scrollInitialized) {
            me.initScroll();
        }
        return me._timelineScroller || (me._timelineScroller = new TimelineScroller({
            widget       : me,
            scrollable   : me.isHorizontal ? me.timeAxisSubGrid.scrollable : me.scrollable,
            isHorizontal : me.isHorizontal
        }));
    }

    /**
     * Used to calculate the range to extend the TimeAxis to during infinite scroll.
     * @param {Date} date
     * @param {Boolean} centered
     * @param {Scheduler.preset.ViewPreset} [preset] Optional, the preset for which to calculate the range.
     * defaults to the currently active ViewPreset
     * @returns {Object} `{ startDate, endDate }`
     * @internal
     */
    calculateInfiniteScrollingDateRange(date, centered, preset = this.timeAxisViewModel.viewPreset) {
        const
            me = this,
            {
                timeAxisViewModel,
                bufferCoef
            } = me,
            {
                timeAxis,
                availableSpace
            } = timeAxisViewModel,
            // If the TimeAxis is filtered, the range we ask for to get the required number of
            // *visible* ticks will have to be larger by this factor which is the ration of
            // real ticks to visible ticks.
            factor = Math.ceil(timeAxis.totalCount / timeAxis.count),
            {
                leafUnit,
                leafIncrement,
                topUnit,
                topIncrement,
                tickSize
            } = preset,
            // If the units are the same and the increments are integer, snap to the top header's unit & increment
            useTop    = leafUnit === topUnit && Math.round(topIncrement) === topIncrement && Math.round(leafIncrement) === leafIncrement,
            snapSize  = useTop ? topIncrement : leafIncrement,
            snapUnit  = useTop ? topUnit      : leafUnit;

        // if provided date is the central point on the timespan
        if (centered) {
            const
                halfSpan            = Math.ceil((availableSpace * bufferCoef + (availableSpace / 2)) / tickSize) * factor,
                startDate           = timeAxis.floorDate(DateHelper.add(date, -halfSpan * leafIncrement, leafUnit), false, snapUnit, snapSize),
                endDate             = timeAxis.ceilDate(DateHelper.add(date, halfSpan * leafIncrement, leafUnit), false, snapUnit, snapSize),
                diffStartEndDates   = endDate - startDate,
                startDateAdjMinDate = me.getMinDateOrDate(startDate);
            let endDateAdjMaxDate = me.getMaxDateOrDate(endDate);

            if (endDateAdjMaxDate <= startDateAdjMinDate) {
                endDateAdjMaxDate = me.getMaxDateOrDate(DateHelper.add(startDateAdjMinDate, diffStartEndDates));
            }

            return {
                startDate : startDateAdjMinDate,
                endDate   : endDateAdjMaxDate
            };
        }
        // if provided date is the left coordinate of the visible timespan area
        else {
            const
                bufferedTicks       = Math.ceil(availableSpace * bufferCoef / tickSize) * factor,
                startDate           = DateHelper.add(date, -bufferedTicks * leafIncrement, leafUnit),
                endDate             = DateHelper.add(date, Math.ceil((availableSpace / tickSize + bufferedTicks) * leafIncrement), leafUnit),
                diffStartEndDates   = endDate - startDate,
                startDateAdjMinDate = me.getMinDateOrDate(startDate);
            let endDateAdjMaxDate = me.getMaxDateOrDate(endDate);

            if (endDateAdjMaxDate <= startDateAdjMinDate) {
                endDateAdjMaxDate = me.getMaxDateOrDate(DateHelper.add(startDateAdjMinDate, diffStartEndDates));
            }

            return {
                startDate : timeAxis.floorDate(startDateAdjMinDate, false, snapUnit, snapSize),
                endDate   : timeAxis.ceilDate(endDateAdjMaxDate, false, snapUnit, snapSize)
            };
        }
    }

    doDestroy() {
        this._timelineScroller?.destroy();

        super.doDestroy();
    }

    onTimelineScroll() {
        // On scroll, check if we are nearing the end to see if the sliding window needs moving.
        // onSchedulerHorizontalScroll is delayed to animationFrame
        if (this.infiniteScroll) {
            this.checkTimeAxisScroll();
        }
    }

    checkTimeAxisScroll() {
        const
            me             = this,
            {
                minDate,
                maxDate
            }              = me,
            {
                startDate,
                endDate
            }              = me.timeAxis,
            scrollable     = me.timelineScroller,
            {
                position
            }              = scrollable,
            clientSize     = me.timeAxisViewModel.availableSpace,
            requiredSize   = clientSize * me.bufferCoef,
            limit          = requiredSize * me.bufferThreshold,
            maxScroll      = me.timeAxisViewModel.totalSize - clientSize,
            closeToStart   = position < limit && (!minDate || DateHelper.isAfter(startDate, minDate)),
            closeToEnd     = maxScroll - position < limit && (!maxDate || DateHelper.isBefore(endDate, maxDate));

        // if scroll violates limits let's shift timespan
        if (closeToStart || closeToEnd) {
            // A native thumb drag survives hiding the scrollbar (Chromium's compositor keeps it until pointerup),
            // so recreate the scrollbar node, which ends the drag and leaves a visible, centred thumb
            me.isHorizontal && me.timeAxisSubGrid.recreateVirtualScroller();

            let datePos;

            // Both ends too near, we will be centered in the new, larger date range
            if (closeToStart && closeToEnd) {
                // Choose center
                datePos = scrollable.position + clientSize / 2;
            }
            else {
                // keep the start date in view
                datePos = scrollable.position;
            }
            // Round using floor so that the tick's time will be in working time.
            // The centered param is true if *both* ends are too close for comfort.
            me.shiftToDate(me.getDateFromCoordinate(datePos, 'floor', true, false, true), closeToStart && closeToEnd);
        }
    }

    shiftToDate(date, centered) {
        const newRange = this.calculateInfiniteScrollingDateRange(date, centered);

        // this will trigger a refresh (`refreshKeepingScroll`) which will perform `restoreScrollState` and sync the scrolling position
        this.setTimeSpan(newRange.startDate, newRange.endDate, centered ? (centered === true ? {
            visibleDate : this.viewportCenterDate,
            block       : 'center'
        } : centered) : maintainVisibleStart);
    }

    // If we change to infinite scrolling dynamically, it should create the buffer zones.
    updateInfiniteScroll(infiniteScroll) {
        // At construction time, this is handled in initScroll.
        // This is just here to handle dynamic updates.
        if (!this.isConfiguring && infiniteScroll) {
            this.checkTimeAxisScroll();
        }
    }

    //region Scroll to date

    /**
     * Scrolls the timeline "tick" encapsulating the passed `Date` into view according to the passed options.
     * @param {Date} date The date to which to scroll the timeline
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A Promise which resolves when the scrolling is complete.
     * @category Scrolling
     */
    async scrollToDate(date, options = {}) {
        const me = this;

        // If the timeAxisSubGrid width is 0, do nothing and return early
        if (me.timeAxisSubGrid.width === 0) {
            return;
        }

        const
            {
                timeAxis,
                visibleDateRange,
                infiniteScroll,
                minDate,
                maxDate
            }              = me,
            {
                unit,
                increment
            }              = timeAxis,
            edgeOffset     = options.edgeOffset || 0,
            visibleWidth   = DateHelper.ceil(visibleDateRange.endDate, increment + ' ' + unit) - DateHelper.floor(visibleDateRange.startDate, increment + ' ' + unit),
            direction      = date > me.viewportCenterDate ? 1 : -1,
            extraScroll    = (infiniteScroll ? visibleWidth * me.bufferCoef * me.bufferThreshold : (options.block === 'center' ? visibleWidth / 2 : (edgeOffset ? me.getMilliSecondsPerPixelForZoomLevel(me.viewPreset) * edgeOffset : 0))) * direction,
            visibleDate    = new Date(date.getTime() + extraScroll),
            shiftDirection = visibleDate > timeAxis.endDate ? 1 : visibleDate < timeAxis.startDate ? -1 : 0;

        // If exceed timeline boundaries try to scroll to minDate/maxDate
        if (me.isBeforeMinDate(date) || me.isAfterMaxDate(date)) {
            date = minDate && date < minDate ? minDate : maxDate;
            return me.scrollToDate(date, options);
        }

        // Required visible date outside TimeAxis and infinite scrolling, that has opinions about how
        // much scroll range has to be created after the target date.
        if (shiftDirection && me.infiniteScroll) {
            // need to wait for a possible scroll event to happen, which will update the timeline's scroll state
            await me.nextAnimationFrame();

            me.shiftToDate(new Date(date - extraScroll), null, true);
            // shift to date could trigger a native browser async scroll out of our control. If a scroll
            // happens during scrollToCoordinate, the scrolling is cancelled so we wait a bit here
            await me.nextAnimationFrame();
        }

        const
            scrollerViewport = me.timelineScroller.viewport,
            localCoordinate  = me.getCoordinateFromDate(date, true),
            // Available space can be less than tick size (Export.t.js in Gantt)
            width            = Math.min(me.timeAxisViewModel.tickSize, me.timeAxisViewModel.availableSpace),
            target           = me.isHorizontal
                // In RTL coordinate is for the right edge of the tick, so we need to subtract width
                ? new Rectangle(me.getCoordinateFromDate(date, false) - (me.rtl ? width : 0), scrollerViewport.y, width, scrollerViewport.height)
                : new Rectangle(scrollerViewport.x, me.getCoordinateFromDate(date, false), scrollerViewport.width, me.timeAxisViewModel.tickSize);

        await me.scrollToCoordinate(localCoordinate, target, date, options);
    }

    /**
     * Scrolls to current time.
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A Promise which resolves when the scrolling is complete.
     * @category Scrolling
     */
    scrollToNow(options = {}) {
        return this.scrollToDate(new Date(), options);
    }

    /**
     * Used by {@link #function-scrollToDate} to scroll to correct coordinate.
     * @param {Number} localCoordinate Coordinate to scroll to
     * @param {Element|Core.helper.util.Rectangle} target The target
     * @param {Date} date Date to scroll to, used for reconfiguring the time axis
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A Promise which resolves when the scrolling is complete.
     * @private
     * @category Scrolling
     */
    async scrollToCoordinate(localCoordinate, target, date, options = {}) {
        const
            me = this,
            {
                startDate,
                endDate,
                hasTimelineBoundaries,
                minDate,
                maxDate
            } = me,
            {
                isContinuous,
                unit,
                increment
            } = me.timeAxis;

        // Not currently have this date in the timeAxis.
        // It could happen that date is still not present in the timeAxis but localCoordinate has a positive value.
        // This could happen when the date and timeAxis edge dates have different timezoneOffset from each other.
        // Then we can not rely only to localCoordinate, another check is needed.
        if (localCoordinate < 0 || (isContinuous && (date < startDate || date > endDate))) {
            // adjust the timeaxis first
            const visibleSpan = endDate - startDate;

            let
                newStartDate = DateHelper.floor(new Date(date.getTime() - (visibleSpan / 2)), increment + ' ' + unit),
                newEndDate   = DateHelper.add(newStartDate, visibleSpan);

            // If timeSpan exceed timeline boundaries but the date is ok, we try to set correct timespan.
            // Otherwise scroll to minDate/maxDate.
            if (hasTimelineBoundaries) {
                if (!me.isBeforeMinDate(date) && !me.isAfterMaxDate(date)) {
                    if (me.isBeforeMinDate(newStartDate)) {
                        newStartDate = minDate;
                        newEndDate = DateHelper.add(newStartDate, visibleSpan);
                    }
                    else if (me.isAfterMaxDate(newEndDate)) {
                        newEndDate = maxDate;
                        newStartDate = DateHelper.add(newEndDate, -visibleSpan);
                    }
                }
                else {
                    date = minDate && date < minDate ? minDate : maxDate;
                    return me.scrollToDate(date, options);
                }
            }

            // We're trying to reconfigure time span to current dates, which means we are as close to center as it
            // could be. Do nothing then.
            // covered by 1102_panel_api
            if (newStartDate - startDate !== 0 && newEndDate - endDate !== 0) {
                await me.setTimeSpan(newStartDate, newEndDate);
                return me.scrollToDate(date, options);
            }

            return;
        }

        await me.timelineScroller.scrollIntoView(target, options);

        // Horizontal scroll is triggered on next frame in SubGrid.js, view is not up to date yet. Resolve on next frame
        return !me.isDestroyed && me.nextAnimationFrame();
    }

    //endregion

    //region Relative scrolling
    // These methods are important to users because although they are mixed into the top level Grid/Scheduler,
    // for X scrolling the explicitly target the SubGrid that holds the scheduler.

    /**
     * Get/set the `scrollLeft` value of the SubGrid that holds the scheduler.
     *
     * This may be __negative__ when the writing direction is right-to-left.
     * @member {Number}
     * @category Scrolling
     */
    set scrollLeft(left) {
        this.timeAxisSubGrid.scrollable.element.scrollLeft = left;
    }

    get scrollLeft() {
        return this.timeAxisSubGrid.scrollable.element.scrollLeft;
    }

    /**
     * Get/set the writing direction agnostic horizontal scroll position.
     *
     * This is always the __positive__ offset from the scroll origin whatever the writing
     * direction in use.
     *
     * Applies to the SubGrid that holds the scheduler
     * @member {Number}
     * @category Scrolling
     */
    set scrollX(x) {
        this.timeAxisSubGrid.scrollable.x = x;
    }

    get scrollX() {
        return this.timeAxisSubGrid.scrollable.x;
    }

    /**
     * Get/set vertical scroll
     * @member {Number}
     * @category Scrolling
     */
    set scrollTop(top) {
        this.scrollable.y = top;
    }

    get scrollTop() {
        return this.scrollable.y;
    }

    /**
     * Horizontal scrolling. Applies to the SubGrid that holds the scheduler
     * @param {Number} x
     * @param {BryntumScrollOptions|Boolean} [options] How to scroll. May be passed as `true` to animate.
     * @returns {Promise} A promise which is resolved when the scrolling has finished.
     * @category Scrolling
     */
    scrollHorizontallyTo(coordinate, options = true) {
        return this.timeAxisSubGrid.scrollable.scrollTo(coordinate, null, options);
    }

    /**
     * Vertical scrolling
     * @param {Number} y
     * @param {BryntumScrollOptions|Boolean} [options] How to scroll. May be passed as `true` to animate.
     * @returns {Promise} A promise which is resolved when the scrolling has finished.
     * @category Scrolling
     */
    scrollVerticallyTo(y, options = true) {
        return this.scrollable.scrollTo(null, y, options);
    }

    /**
     * Scrolls the subgrid that contains the scheduler
     * @param {Number} x
     * @param {BryntumScrollOptions|Boolean} [options] How to scroll. May be passed as `true` to animate.
     * @returns {Promise} A promise which is resolved when the scrolling has finished.
     * @category Scrolling
     */
    scrollTo(x, options = true) {
        return this.timeAxisSubGrid.scrollable.scrollTo(x, null, options);
    }

    //endregion

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};

// Internal class used to interrogate and manipulate the timeline scroll position.
// This delegates all operations to the appropriate Scroller, horizontal or vertical.
class TimelineScroller extends Scroller {
    static $name = 'TimelineScroller';

    static configurable = {
        position : null,
        x        : null,
        y        : null
    };

    // This class is passive about configuring the element.
    // It has no opinions about *how* the overflow is handled.
    updateOverflowX() {}
    updateOverflowY() {}

    onScroll(e) {
        super.onScroll(e);
        this._position = null;
    }

    syncPartners(force) {
        this.scrollable.syncPartners(force);
    }

    updatePosition(position) {
        this.scrollable[this.isHorizontal ? 'x' : 'y'] = position;
    }

    get viewport() {
        return this.scrollable.viewport;
    }

    get position() {
        return this._position = this.scrollable[this.isHorizontal ? 'x' : 'y'];
    }

    get clientSize() {
        return this.scrollable[`client${this.isHorizontal ? 'Width' : 'Height'}`];
    }

    get scrollSize() {
        return this.scrollable[`scroll${this.isHorizontal ? 'Width' : 'Height'}`];
    }

    get maxPosition() {
        return this.scrollable[`max${this.isHorizontal ? 'X' : 'Y'}`];
    }

    scrollTo(position, options) {
        return this.isHorizontal ? this.scrollable.scrollTo(position, null, options) : this.scrollable.scrollTo(null, position, options);
    }

    scrollBy(xDelta = 0, yDelta = 0, options = defaultScrollOptions) {
        // Use the correct delta by default, but if it's zero, accommodate axis error.
        return this.isHorizontal ? this.scrollable.scrollBy(xDelta || yDelta, 0, options) : this.scrollable.scrollBy(0, yDelta || xDelta, options);
    }

    scrollIntoView(...args) {
        return this.scrollable.scrollIntoView(...args);
    }

    // We accommodate mistakes. Setting X and Y sets the appropriate scroll axis position
    changeX(x) {
        this.position = x;
    }

    changeY(y) {
        this.position = y;
    }

    get x() {
        return this.position;
    }

    set x(x) {
        this.scrollable[this.isHorizontal ? 'x' : 'y'] = x;
    }

    get y() {
        return this.position;
    }

    set y(y) {
        this.scroller[this.isHorizontal ? 'x' : 'y'] = y;
    }

    get clientWidth() {
        return this.clientSize;
    }

    get clientHeight() {
        return this.clientSize;
    }

    get scrollWidth() {
        return this.scrollSize;
    }

    get scrollHeight() {
        return this.scrollSize;
    }

    get maxX() {
        return this.maxPosition;
    }

    get maxY() {
        return this.maxPosition;
    }
}
