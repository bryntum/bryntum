import Base from '../../Core/Base.js';

/**
 * @module Calendar/util/EventSorter
 */

/**
 * This class contains static methods to sort events into appropriate display order within a day for all
 * Calendar view contexts. It provides two sorting strategies: a default sorter that orders events by
 * start date and then by duration (longest first), and an inter-day sorter used by {@link Calendar.widget.MonthView}
 * that additionally prioritizes multi-day (inter-day) events above intra-day events to ensure they render
 * as continuous bars across day cells.
 *
 * Whenever a day's events are rendered, those events are sorted with {@link #function-defaultSorterFn-static} method.
 *
 * To use a custom event sort order in a Calendar view, configure the view's `eventSorter`:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     modes : {
 *         month : {
 *             // Custom sort: prioritize by event name after the default sort
 *             eventSorter(event1, event2) {
 *                 return EventSorter.defaultSorterFn(event1, event2) || event1.name.localeCompare(event2.name);
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Calendar.widget.MonthView} — Uses the inter-day sorter for mixed event display
 * - {@link Calendar.widget.mixin.CalendarMixin} — Views accept an `eventSorter` config
 *
 */
export default class EventSorter extends Base {
    static $name = 'EventSorter';

    /**
     * This sorting method implement following rules:
     *
     *  0. Unscheduled events go before scheduled ones
     *  1. Compare by floored start date
     *  2. If equal, compare by floored duration
     *  3. If equal, compare by start date
     *  4. If equal, compare by duration
     * @param {Scheduler.model.EventModel|EventBar} event1
     * @param {Scheduler.model.EventModel|EventBar} event2
     * @returns {Number}
     */
    static defaultSorterFn(event1, event2) {
        // Handle event wrapping which is what MonthView does.
        event1 = event1.eventRecord || event1;
        event2 = event2.eventRecord || event2;

        const
            { startDate  : start1 } = event1,
            { startDate  : start2 } = event2;

        // Unscheduled events sort to the top.
        if (!start1) {
            return -1;
        }
        if (!start2) {
            return 1;
        }

        // Sort by start timestamp first, then duration.
        // This is *in-cell* sorting.
        return start1 - start2 || event2.durationMS - event1.durationMS;
    }

    /**
     * This sorting method implement following rules:
     *
     *  0. Unscheduled events go before scheduled ones
     *  1. An {@link Scheduler.model.EventModel#property-isInterDay} event sorts before events that are not.
     *  2. Compare floored start date, if the events have different values
     *  3. Compare floored duration, if the events have different values
     *  4. Compare start date, if the events have different values
     *  5. Compare duration
     *
     * This is used by {@link Calendar.widget.MonthView} since this view mixes
     * both interday and intraday events in the same view but render them differently.
     * @param {Scheduler.model.EventModel|EventBar} event1
     * @param {Scheduler.model.EventModel|EventBar} event2
     * @returns {Number}
     * @internal
     */
    static interDaySorterFn(event1, event2) {
        // Handle event wrapping which is what MonthView does.
        event1 = event1.eventRecord || event1;
        event2 = event2.eventRecord || event2;

        const
            {
                startDate  : start1,
                isInterDay : event1InterDay
            } = event1,
            {
                startDate  : start2,
                isInterDay : event2InterDay
            } = event2;

        // Unscheduled events sort to the top.
        if (!start1) {
            return -1;
        }
        if (!start2) {
            return 1;
        }

        // InterDay events sort to the top (https://github.com/bryntum/bryntum/issues/1693).
        if (event1InterDay !== event2InterDay) {
            return Number(event2InterDay) - Number(event1InterDay);
        }

        // If both events fit inside one day cell, the only sort order we care about is start time.
        if (!event1InterDay && !event2InterDay) {
            return start1 - start2;
        }

        // Sort Duration (longest first), then by ending date (furthest in future first), then by start timestamp.
        // This is *in-cell* sorting.
        return event2.durationMS - event1.durationMS || event2.endingDate - event1.endingDate || start1 - start2;
    }
}
