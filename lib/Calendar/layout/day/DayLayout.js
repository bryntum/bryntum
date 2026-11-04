import Base from '../../../Core/Base.js';
import Duration from '../../../Core/data/Duration.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import Factoryable from '../../../Core/mixin/Factoryable.js';
import LayoutDim from '../LayoutDim.js';

/**
 * @module Calendar/layout/day/DayLayout
 */

const
    getStyles = function(rtl) {
        const me  = this;   // a DayLayoutItem (also why we cannot use => fn here)

        return {
            [rtl ? 'right' : 'left'] : me.left?.stringify(),
            top                      : me.top.stringify(),
            width                    : me.width?.stringify(),
            height                   : me.height.stringify(),
            minWidth                 : me.minWidth
        };
    };

/**
 * The item returned by the `layoutEvents` method.
 *
 * @typedef {Object} DayLayoutItem
 * @property {Scheduler.model.EventModel} eventRecord The `event` being displayed.
 * @property {DayLayoutCluster} cluster The cluster of events with overlapping times.
 * @property {Number} start The start time (as the number seconds since midnight) of the item.
 * @property {Number} end The end time (as the number seconds since midnight) of the item.
 * @property {Calendar.layout.LayoutDim} left The left position of the item.
 * @property {Calendar.layout.LayoutDim} top The top position of the item.
 * @property {Calendar.layout.LayoutDim} width The width of the item.
 * @property {Calendar.layout.LayoutDim} height The height of the item.
 * @property {Boolean} startsBefore Set to `true` if the event started in a previous day.
 * @property {Boolean} endsAfter Set to `true` if the event end in a future day.
 * @internal
 */

/**
 * A set of `items` that overlap. This object is passed to the `layoutCluster` method.
 *
 * @typedef {Object} DayLayoutCluster
 * @property {DayLayoutContext} context The layout context
 * @property {DayLayoutItem[]} items The items in this event cluster.
 * @property {Number} start The start time (as the number seconds since midnight) of the item.
 * @property {Number} end The end time (as the number seconds since midnight) of the item.
 * @internal
 */

/**
 * The object returned by `createLayoutContext`.
 *
 * @typedef {Object} DayLayoutContext
 * @property {DayCell} cellData An object containing information about the day cell being created.
 * @property {DayLayoutCluster[]} clusters The item clusters produced by `layoutEvents`.
 * @property {DayLayoutItem[]} items The items created by the `layoutEvents` method.
 * @property {Calendar.layout.day.DayLayout} layout The owing layout instance.
 * @internal
 */

/**
 * The base class for {@link Calendar.widget.DayView} layout algorithms. It determines how overlapping intra-day
 * events are arranged horizontally within a day column by grouping them into clusters and calculating their
 * position and size as {@link Calendar.layout.LayoutDim} values. Subclasses such as
 * {@link Calendar.layout.day.FluidDayLayout} implement specific strategies for distributing available width
 * among overlapping events.
 *
 * The layout is configured through the DayView's {@link Calendar.widget.DayView#config-eventLayout} config:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     modes : {
 *         day : {
 *             eventLayout : {
 *                 // Use the fluid layout (default)
 *                 type        : 'fluid',
 *                 // Enable a gutter for creating events in occupied time slots
 *                 gutter      : true,
 *                 gutterWidth : 15
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * @extends Core/Base
 * @abstract
 */
export default class DayLayout extends Base.mixin(Factoryable) {
    static $name = 'DayLayout';

    static factoryable = {
        // establish this class as the Factoryable base
    };

    static configurable = {
        /**
         * Set to `false` to disable the gap on the right-most edge of events. See {@link #config-gutterWidth} to
         * control the size of the gutter.
         *
         * The gutter allows the user to select the times overlapped by events, for example, to create new events.
         * @config {Boolean}
         * @default
         */
        gutter : true,

        /**
         * The size of the gutter applied to the event containing column to inset events from the column edges when
         * {@link #config-gutter} is `true`. May be a single number giving the inline-end size, or an object
         * specifying both inline-start and inline-end sizes:
         *
         * ```javascript
         * gutterWidth : {
         *     start : 4,
         *     end   : 8
         * }
         * ```
         *
         * A single numeric value is normalized to `{ start : 0, end : <value> }`.
         *
         * Values less than 1 are the fractional proportion of the width (for example, 0.04 is 4% of the width),
         * while values greater than or equal to 1 are a number of pixels.
         *
         * @config {Number|Object}
         * @property {Number|String} [start=0] The inline-start gutter size.
         * @property {Number|String} [end] The inline-end gutter size.
         * @default
         */
        gutterWidth : 5,

        /**
         * The number of pixels or proportion of the overall width to allocate for rendering on outside the area where
         * events are displayed. This space is used by {@link Calendar.feature.TimeRanges} to render arbitrary spans of
         * time on either side of the day's events.
         *
         * Values less than 1 are the fractional proportion of the width (for example, 0.04 is 4% of the width),
         * while values greater than or equal to 1 are a number of pixels.
         * @config {Number}
         * @default
         */
        inset : 40,

        /**
         * The minimum number of minutes an event must overlap another event before it is considered an overlap
         * for layout purposes.
         *
         * The default value of 0 treats any overlap in time as an overlap in the layout.
         * @config {Number}
         * @default 0
         * @internal
         */
        overlapTolerance : null,

        owner : null
    };

    /**
     * This method is called prior to performing the layout in {@link #function-layoutEvents}.
     * @param {DayLayoutContext} context The layout context
     * @returns {DayLayoutContext}
     * @internal
     */
    beforeLayoutEvents(context) {
        this.owner.trigger('beforeLayoutEvents', {
            context
        });

        return context;
    }

    /**
     * This method packages items into clusters of overlapping items.
     * @param {DayLayoutCluster[]} clusters The cluster array being produced. This method adds to this array.
     * @param {DayLayoutItem[]} items The items array being produced. This method adds `item` to this array.
     * @param {DayLayoutItem} item The item to add and pack into a cluster.
     * @param {DayLayoutContext} context The layout context
     * @internal
     */
    clusterize(clusters, items, item, context) {
        const cluster = clusters[clusters.length - 1] || null;  // undefined => null when clusters.length=0

        items.push(item);

        // Because items are in order of increasing start times, we don't have to worry about coalescing clusters.
        if (cluster && this.overlaps(cluster, item)) {
            item.cluster = cluster;

            cluster.end = Math.max(cluster.end, item.end);
            cluster.items.push(item);

            // If the item overlaps a cluster, we simply add it there and return. No other items can overlap
            // since items are added in order of start time.
        }
        else {
            // Item does not overlap, so make a new cluster.
            clusters.push(item.cluster = {
                context,

                start : item.start,
                end   : item.end,
                items : [item]
            });
        }
    }

    /**
     * Populates and returns a layout context used for the layout process.
     * @param {DayCell} cellData An object containing information about the day cell being created.
     * @param {DomConfig} [dayDomConfig] The DomConfig element definition for the day cell into which events are being
     * rendered.
     * @returns {DayLayoutContext}
     * @internal
     */
    createLayoutContext(cellData, dayDomConfig) {
        const events = cellData?.events;

        return {
            cellData,
            dayDomConfig,

            // We need the events for the day to be sorted by startDate but limited to the start of the day. In
            // other words, all events that start before "midnight" are equally considered as starting at midnight.
            // This order of events is an assumption that runs deep in FluidDayLayout but also in clusterization.
            events : events?.length > 1 ? cellData.dayTime.sortEvents(cellData.date, events.slice()) : (events || []),

            clusters : [],
            items    : [],
            layout   : this
        };
    }

    //<debug>
    /**
     * The derived class implements this abstract method to finalize the position of the specified `cluster`. This is
     * done by storing position properties (`left` and `width`) on the items of the cluster.
     *
     * @param {DayLayoutCluster} cluster The cluster of items to position.
     * @internal
     * @abstract
     */
    layoutCluster(cluster) {
        //
    }
    //</debug>

    /**
     * Calculate the placements for the given events within the specified time range.
     * @param {DayCell} cellData An object containing information about the day cell being created.
     * @param {DomConfig} [dayDomConfig] The DomConfig element definition for the day cell into which events are being
     * rendered.
     * @returns {DayLayoutContext}
     * @internal
     */
    layoutEvents(cellData, dayDomConfig) {
        const
            me         = this,
            context    = me.beforeLayoutEvents(me.createLayoutContext(cellData, dayDomConfig)),
            { clusters, events, items } = context;

        let event, i, item, n;

        // As the base class, we simply pick up the events and wrap them in a layout item to contain their positions:
        for (event of events) {
            item = me.createLayoutItem(event, context);

            // Events that are fully outside the day bounds are not rendered.
            if (item) {
                me.clusterize(clusters, items, item, context);
            }
        }

        // cluster layouts are done in seconds:
        for (i = 0, n = clusters.length; i < n; ++i) {
            me.layoutCluster(clusters[i]);
        }

        me.owner.trigger('layoutEvents', {
            context
        });

        return context;
    }

    /**
     * Returns the base of a {@link Calendar.layout.day.DayLayout#typedef-DayLayoutItem} for the passed
     * event record.
     * @param {Scheduler.model.EventModel} eventRecord The event record for which to create a layout item.
     * @param {DayLayoutContext} context The layout context
     * @returns {DayLayoutItem}
     * @internal
     */
    createLayoutItem(eventRecord, context) {
        // Note: DH.diff() does not produce the correct layout position if DST adjustment lands on "date"

        const
            { date, tomorrow, dayEnd, dayTime } = context.cellData,
            { allDay, startDate, endingDate } = eventRecord,
            startSec  = (allDay || startDate < date) ? 0 : dayTime.delta(startDate, 's'),
            preamble  = Duration.from(eventRecord.preamble),
            postamble = Duration.from(eventRecord.postamble);

        let endSec = (allDay || endingDate >= tomorrow) ? dayEnd : dayTime.delta(endingDate, 's');

        // Rejects items ending before day start or starting after day end (zero duration may sit on the end);
        // mirrored in CalendarDrag DayZone#getDaySegment
        if (endSec > 0 && (startSec < dayEnd || (startSec === dayEnd && !(endingDate - startDate)))) {
            // Milestones must grow to appear to have "milestoneDuration"
            if (eventRecord.isMilestone && !eventRecord.isTimeRangeModel && !eventRecord.allDay) {
                endSec = startSec + (this.owner.milestoneDuration / 1000);
            }

            const
                start    = Math.max(startSec, 0),
                end      = Math.min(endSec, dayEnd),
                top      = LayoutDim.from(start / dayEnd);

            return {
                eventRecord,
                getStyles,
                start,
                end,
                top,

                id           : eventRecord.id,
                height       : new LayoutDim(end / dayEnd, 0).sub(top),
                // All-day events are date-anchored, so compare calendar days (not the possibly dayStartShift-ed cell
                // window); clearTime makes this a no-op for unshifted views.
                startsBefore : allDay ? (DateHelper.clearTime(startDate) < DateHelper.clearTime(date)) : (startDate < date || startSec < 0),
                endsAfter    : allDay ? (DateHelper.add(DateHelper.clearTime(date), 1, 'day') < endingDate) : (tomorrow < endingDate || endSec > dayEnd),
                preambleSec  : preamble ? DateHelper.as('s', preamble) : 0,
                postambleSec : postamble ? DateHelper.as('s', postamble) : 0
            };
        }
    }

    overlaps(a, b, tolerance, end) {  // minutes => seconds
        if (typeof tolerance === 'string') {
            end = tolerance;
            tolerance = null;
        }

        end = end || 'end';
        tolerance = tolerance ?? (this.overlapTolerance * 60 || 0); // avoid NaN

        return a.start < (b[end] - tolerance) && b.start < (a[end] - tolerance);
    }

    changeGutterWidth(gutterWidth) {
        // Normalize the single-number form to the { start, end } object form.
        if (typeof gutterWidth === 'number') {
            gutterWidth = { start : 0, end : gutterWidth };
        }

        return gutterWidth;
    }

    syncGutter() {
        const
            { gutter, gutterWidth, owner } = this,
            // gutter Boolean gates the gutter; gutterWidth is normalized to { start, end } by changeGutterWidth.
            start = gutter ? gutterWidth.start : 0,
            end   = gutter ? gutterWidth.end   : 0;

        owner.setStyle('--bi-day-view-cell-gutter-start', String(LayoutDim.get(start)));
        owner.setStyle('--bi-day-view-cell-gutter-end',   String(LayoutDim.get(end)));

        // Keep the legacy single-value variable in sync with the inline-end side for callers that
        // still reference --bi-day-view-cell-gutter (e.g. TimeRanges.css, DayView.css overflow rules).
        owner.setStyle('--bi-day-view-cell-gutter', String(LayoutDim.get(start + end)));
    }

    updateGutter() {
        this.syncGutter();
    }

    updateGutterWidth() {
        this.syncGutter();
    }

    updateInset(inset) {
        this.owner.setStyle('--bi-day-view-cell-inset-size', String(LayoutDim.get(inset)));
    }
}
