import Base from '../../../Core/Base.js';
import FunctionHelper from '../../../Core/helper/FunctionHelper.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import DayTime from '../../../Core/util/DayTime.js';
import Month from '../../../Core/util/Month.js';
import EventSlots from '../../util/EventSlots.js';
import EventSorter from '../../util/EventSorter.js';

/**
 * @module Calendar/widget/mixin/DayCellCollecter
 */

const
    byKey = ({ key : lhs }, { key : rhs }) => {
        return lhs < rhs ? -1 : rhs < lhs ? 1 : 0;
    },
    TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

/**
 * A data block created by all {@link Calendar.widget.mixin.DayCellCollecter} Calendar views to
 * encapsulate occupied day cells and the events which intersect with each date to be shown in the UI.
 * All useful data about the date and the shape of the UI is included.
 * @typedef {Object} DayCell
 * @property {CalendarView} view The owning view of the cell.
 * @property {Date} date The date of the cell.
 * @property {String} key a `YYYY-MM-DD` formatted date key for the cell.
 * @property {Number} cellIndex The overall cell index in the cell-based UI being created.
 * @property {Number} day The day of week for the cell: 0=Sunday, 6=Saturday
 * @property {Number} columnIndex The column index in the cell-based UI being created.
 * @property {Number} visibleColumnIndex The visible column index (eg 0 for a Monday if Sunday is the week start day,
 *   but was hidden)
 * @property {Boolean} isNonWorking `true` if the owning view considers the date a non-working day.
 * @property {Number[]} week The `[year, week]` encapsulating the cell.
 * @property {Boolean} isOtherMonth The cell is outside the view's primary time range. Only significant
 *   when used by a CalendarPanel which encapsulates a single month.
 * @property {Boolean} visible `true` if the date cell is not for a hidden day.
 * @property {Date} tomorrow The date of the following cell.
 * @property {Boolean} isRowStart `true` if the cell is at the start of a visible row.
 * @property {Boolean} isRowEnd `true` if the cell is at the end of a visible row.
 * @property {Boolean} hasOverflow `true` if the `renderedEvents` overflow the cell height and
 *   require a `+n more` button.
 * @property {Scheduler.model.EventModel[]} events The events which are to be shown for this date.
 * @property {Scheduler.model.ResourceModel} resource __Note__ this only exists when the cell is
 *   owned by a subview of a {@link Calendar.widget.ResourceView}, or while creating resource columns
 *   in a {@link Calendar.widget.DayResourceView}.
 * @property {EventBar[]} renderedEvents If this view renders event bars ({@link Calendar.widget.MonthView},
 *   {@link Calendar.widget.CalendarRow}), then this is an array of
 *   {@link EventBar event bar} definitions which belong in the cell. Whether all can be rendered depends
 *   upon the view's configured {@link Calendar.widget.mixin.CalendarMixin#config-eventHeight} and whether
 *   the cell is of fixed height. The `hasOverflow` property is set if the rendered events overflow
 *   a cell's fixed capacity.
 * @property {Scheduler.model.EventModel[]} resourceDayEvents The events for the passed resource for the day (applies in a `DayResourceCalendarRow`)
 *   column

 */

/**
 * A data block which describes how an event bar is to be rendered into a day cell.
 * @typedef {Object} EventBar
 * @property {Scheduler.model.EventModel} eventRecord The event record for which the event bar is being rendered.
 * @property {Date} propagateEndDate The date of the last cell into which the event bar will extend.
 * @property {Core.helper.util.DomClassList} cls The CSS classes to apply to the event bar.
 * @property {Core.helper.util.DomClassList} iconCls The CSS classes to apply to an event icon.
 * @property {Object} dataset Property names and values to be applied to the Event bar's DOM `dataset`
 * @property {String} eventColor Either a predefined colour name, or a DOM colour value to apply to the event bar.
 * @property {Boolean} isAllDay `true` if the event is flagged as an all day event in its data, or
 * if it spans a day boundary and occupies more than one cell.
 * @property {Boolean} isOverflow `true` if this event bar is a continuation from a previous cell.
 * @property {Boolean} overflows `true` if this event bar flows into the next cell.
 * @property {Boolean} solidBar `true` if the event bar is to be rendered with a solid background of
 * its defined colour. All day events are solid by default.
 */

/**
 * Mixin that provides the ability to collect {@link DayCell day cell} data blocks containing the events
 * of interest to a Calendar widget. For each date in the view's range, it builds a `DayCell` object that
 * includes the events intersecting that date, metadata about the cell's position in the UI grid, and
 * information needed by the rendering layer such as overflow state and time range associations. The mixin
 * also supports event filtering via the {@link #config-eventFilter} and resource-specific cell collection
 * for resource-based views.
 *
 * This is used by all implemented Calendar widgets except {@link Calendar.widget.AgendaView},
 * which creates its cellMap from the events it finds in the eventStore.
 *
 * Views that use this mixin support filtering events per cell using {@link #config-eventFilter}:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     modes : {
 *         month : {
 *             // Only show events that are not cancelled
 *             eventFilter({ eventRecord }) {
 *                 return eventRecord.status !== 'cancelled';
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * @mixin
 */
export default Target => class DayCellCollecter extends (Target || Base) {
    static $name = 'DayCellCollecter';

    static configurable = {
        /**
         * A function, or the name of a function in the ownership hierarchy to filter which events
         * are collected into the day cell data blocks.
         * Return `true` to include the passed event, or a *falsy* value to exclude the event.
         *
         * @config {Function|String}
         * @param {Scheduler.model.EventModel} event the passed event
         * @returns {Boolean}
         */
        eventFilter : {
            $config : 'lazy',
            value   : null
        },

        /**
         * Set to `true` to stack multi-day events within each cell in the order of their start time.
         *
         * When this property is set, multi day events will not sort to the top of day cells and flow
         * in the same row from cell to cell.
         *
         * Rather, the bar in the start cell will be sorted by its start time. In future cells, its
         * bar will be sorted to the top of the cell.
         * @prp {Boolean} stackMultiDayEvents
         * @default false
         */
        stackMultiDayEvents : null
    };

    // A view-owned midnight day frame so DayTime's day-key methods bucket cells in the view's timezone
    // (the shared DayTime.MIDNIGHT singleton is timezone-less, so it can't be used when the view has a tz).
    get dayTime() {
        return this._midnightDayTime ||= new DayTime({
            startShift : 0,
            timeStart  : 0,
            timeEnd    : 24,
            owner      : this
        });
    }

    get cellMonth() {
        return this._cellMonth ||= new Month({ owner : this });
    }

    changeEventFilter(eventFilter) {
        if (typeof eventFilter === 'string') {
            const { handler, thisObj } = this.resolveCallback(eventFilter);
            eventFilter = handler.bind(thisObj);
        }
        return eventFilter;
    }

    updateStackMultiDayEvents() {
        this.whenVisible('refresh');
    }

    /**
     * This function populates and returns the cellMap for this view.
     *
     * If the cellMap does not exist, it will be created.
     *
     * The cellMap is a Map of `YYYY-MM-DD` date keys to {@link DayCell day cell} data blocks.
     *
     * Subclasses usually override this method to customize how events are collected.
     *
     * @param {Object} The options passed are those documented in {@link Scheduler.data.EventStore#function-getEvents}
     * with the addition of:
     * - `cellMap` : An existing cellMap to populate. If not passed, the view's own cellMap is used.
     * - `skipPropagate` : Set to `true` to skip the propagation of multi-day events into future cells.
     *   This may be used when the caller only needs events grouped by their start date.
     * - `rawEvents` : Set to `true` to get raw event records in the cellData blocks rather than
     *   {@link DayCell} 'events' being an array of {@link EventBar event bar} definitions.
     *   This may be used when the caller only needs events grouped by their start date.
     * @returns {Map} A Map of `YYYY-MM-DD` date keys to {@link DayCell day cell} data blocks.
     * @private
     */
    createCellMap(getEventsOptions = {}) {
        const
            me      = this,
            {
                filter,
                skipPropagate
            }       = getEventsOptions,
            {
                dh,
                eventFilter,
                cellMonth,
                lastVisibleDate,
                dayStartShift,
                isDayView
            }       = me,
            cellMap = getEventsOptions.cellMap || (me._cellMap ||= new CellMap(dh));

        // By default, events are sorted by start date and duration, but with multi-day events always sorted to the top.
        // If the view is stacking multi-day events, we must not sort them to the top.
        // Each cell's bars are completely independent of each other in this mode.
        if (me.stackMultiDayEvents) {
            me.eventSorter = EventSorter.defaultSorterFn;
        }

        // For data purposes, last visible Date is 00:00 on the following day
        if (lastVisibleDate) {
            dh.add(lastVisibleDate, 1, 'd', false);
        }

        let startDate = getEventsOptions.startDate || me.firstVisibleDate || me.startDate,
            endDate   = getEventsOptions.endDate || lastVisibleDate || me.endDate,
            {
                dayStartTime,
                dayEndTime
            }         = me;

        if (dayEndTime <= dayStartTime) {
            dayEndTime += TWENTY_FOUR_HOURS;
        }

        // We need a separate Month object to iterate through the cells to create cell context objects
        cellMonth.configure({
            weekBase           : null,
            weekStartDay       : me.weekStartDay,
            nonWorkingDays     : me.nonWorkingDays,
            hideNonWorkingDays : me.hideNonWorkingDays,
            sixWeeks           : me.sixWeeks,
            date               : startDate
        });

        if (me.eventStore) {
            // Create  mutable copy so that collectEvents implementations may intervene
            getEventsOptions = ObjectHelper.assign({
                dayTime : me.dayTime
            }, getEventsOptions, {
                filter  : FunctionHelper.combineFilterFns(eventFilter, filter),
                dateMap : cellMap,
                startDate,
                endDate
            });

            me.collectEvents(getEventsOptions);

            // collectEvents may manipulate the exact view start and end.
            // For example MonthView.hideOtherMonthCells
            startDate = getEventsOptions.startDate;
            endDate = getEventsOptions.endDate;

            // Create a cell entry for every date which this view encapsulates which intersects
            // with an event.
            // To be completely clear: depending upon the requirements of the widget that
            // mixes there will likely be some cell entries created
            // here which may never have any events *STARTING* in them.
            // But they may exist because they have events from previous days
            // flowing into them.
            // These must exist because they still need to propagate their overflowing
            // events forward into visible cells.
            // All cells which require visible event bars will be represented here.
            // Multi day events will be propagated forward into their following cells
            // further down.
            //
            // Extract the keys() iterator into an array first because the cellMap will be
            // added to during the iteration because of forward-propagation cells being added
            // when events reach forward in time. We only want to iterate the *preexisting*
            // set of event dates. The new entries created for propagation will be be added
            // containing empty cellData blocks.
            for (const key of [...cellMap.keys()]) {
                let lastEventEndDate = 0;

                const
                    dayTime    = getEventsOptions.dayTime,
                    realDate   = dh.parseKey(key),
                    date       = dayTime.dayOfDate(realDate),
                    cellData   = me.createCellData(date),
                    sortEvent  = {
                        events : cellMap.get(key),
                        date
                    };

                // For DayViews only:
                // We now have to evict events which do not belong on this date due to being outside the
                // day start and end. This is only necessary if the day is shifted and the cell collection
                // had to include all events intersecting the date.
                if (isDayView && dayStartShift) {
                    const
                        dayStart   = realDate.getTime() + dayStartTime,
                        dayEnd     = realDate.getTime() + dayEndTime;

                    // All-day events are date-anchored (keyed by calendar date), so exempt them from the shifted
                    // day's time-window eviction
                    sortEvent.events = sortEvent.events.filter(({ allDay, startDate, endingDate }) => {
                        return allDay || (endingDate > dayStart && startDate < dayEnd);
                    });
                }

                me.sortEvents(sortEvent.events, date);

                /**
                 * Fired after one day cell's events are collected in sorted order according to the
                 * {@link Calendar.widget.mixin.CalendarMixin#config-eventSorter}
                 *
                 * An application may use this to intervene in the event load received by the UI
                 * by mutating the `events` array.
                 * @event dayCellPopulated
                 * @param {Scheduler.model.EventModel[]} events The events to be shown for the passed date
                 * @param {Date} The date the events are to be shown in.
                 */
                me.trigger('dayCellPopulated', sortEvent);

                // In case an event handler mutated the event
                const events = sortEvent.events;

                if (getEventsOptions.rawEvents) {
                    lastEventEndDate = Math.min(endDate, Math.max.apply(Math, events.map(e => e.endDate || me.dateHelper.add(e.startDate, e.duration, e.durationUnit))));
                    cellData.events = events;
                }
                else {
                    cellData.events = events.map(eventRecord => {
                        const
                            eventEndDate = eventRecord.endingDate,
                            overflows    = eventEndDate > cellData.tomorrow,
                            eventData    = {
                                isAllDay   : me.isInterDayEvent(eventRecord),
                                isOverflow : eventRecord.startDate < cellData.date && (date - startDate),
                                eventRecord,
                                eventEndDate,
                                overflows,
                                date
                            };

                        if (!skipPropagate) {
                            lastEventEndDate = Math.min(endDate, Math.max(lastEventEndDate, eventEndDate));
                            if (overflows) {
                                eventData.propagateEndDate = me.calculatePropagateEndDate(eventData, endDate);
                            }
                        }

                        return eventData;
                    });
                }

                // Create the cells to propagate into based on the latest ending of the events just found.
                // Cells after the first cell are collected on a startDate only basis, so the cells they
                // will extend into will need to be created.
                // This operation mutates the cellMap but the ongoing iteration must not be affected.
                if (!skipPropagate) {
                    for (; date < lastEventEndDate;  dh.add(date, 1, 'd', false )) { // NOSONAR
                        const key = dayTime.dateKey(date);

                        // At the end of the outer cellMap iteration, it is expected that all
                        // entries will consist of cellData blocks, *not* raw arrays
                        // of events, so when creating the cells for propagation, create
                        // cell data blocks for any currently non-existent dates.
                        cellMap.has(key) || cellMap.set(key, me.createCellData(date));
                    }
                }

                // Change the raw event array to a cellData object
                cellMap.set(key, cellData);
            }

            // Pre-fill slots for all days that the events for this day cover
            if (cellMap.size) {
                // Sort the day entries into ascending date order.
                // The creation of the cells to propagate into may create some out of order
                const cellMapEntries = [...cellMap.values()].sort(byKey);
                let previousEvents;

                cellMapEntries.forEach(entry => {
                    if (previousEvents) {
                        previousEvents.nextEvents = entry;
                        entry.previousEvents = previousEvents;
                    }

                    previousEvents = entry;
                });

                // Pre-fill slots for all days that the events for this day cover
                if (!skipPropagate) {
                    me.propagateCellEvents(cellMapEntries[0], cellMap);
                }
            }
        }

        // The getter kicks off a new create for cellMaps which are not populated.
        // A cellMap with zero size may still have been populated.
        cellMap.populated = true;

        /**
         * Fired when a new set of events has been gathered for this view's date range.
         * @event cellMapPopulated
         * @param {Map} cellMap The map of date keys to {@link DayCell day cell} data blocks.
         */
        me.trigger('cellMapPopulated', {
            cellMap
        });

        return cellMap;
    }

    /**
     * Calculates the end date (EXCLUSIVE) to which an event must be propagated based upon the
     * event's data in order to create a day-spanning event bar.
     *
     * If an event overflows into 2011-01-02T01:00, then the exclusive propagateEndDate
     * is 2011-01-03T00:00:00 so the event will be propagated into 2011-01-02.
     *
     * But if an event ends on 2011-01-02T00:00:00, its propagateEndDate will be 2011-01-02T00:00:00
     * so it will be propagated as far as 2011-01-01
     *
     * This may be overridden in subclasses to customize how events are propagated forwards.
     *
     * example:
     * ```javascript
     * class OvernightEventMonthView extends MonthView {
     *     static get name() {
     *         return 'OvernightEventMonthView';
     *     }
     *
     *     static get type() {
     *         return 'overnighteventmonthview';
     *     }
     *
     *     calculatePropagateEndDate(eventData) {
     *         // If the event only spills into the next day but not further
     *         // then we do not want an extended event bar.
     *         // It will still get an arrow indicating that it continues rightwards.
     *         if (eventData.eventEndDate < DateHelper.add(eventData.date, 1, 'd')) {
     *             return DateHelper.add(DateHelper.clearTime(eventData.eventRecord.startDate), 1, 'd');
     *         }
     *         // Default case, propagate event into the future as usual
     *         return super.calculatePropagateEndDate(eventData);
     *     }
     * }
     * // Register the type name
     * OvernightEventMonthView.initClass();
     *
     * new Calendar({
     *     modes : {
     *         // Use our MonthView subclass as the month mode.
     *         month : {
     *             type :'overnighteventmonthview'
     *         }
     *     }
     * })
     * ```
     *
     * Note that this is implemented by both {@link Calendar.widget.MonthView} and {Calendar.widget.CalendarRow}
     * which is the "all day" row in a week or day view.
     *
     * @param {Object} eventData A data block describing the time context of an event.
     * @param {Date} eventData.eventEndDate The end date for which to calculate the propagate end date.
     * @param {Boolean} eventData.isAllDay `true` if the event is an all day event, or spans multiple days.
     * @param {Boolean} eventData.isOverflow `true` if this is being called as part of further propagation.
     * @param {Boolean} eventData.overflows `true` if the event extends into future cells.
     * @param {Scheduler.model.EventModel} eventData.eventRecord The event record being propagated.
     * @param {Date} eventData.date The date from which the event is being propagated.
     * @returns {Date} The date (as a timepoint, *not* a reference to a 24 hour time block)
     * to which the event bar should be propagated
     * @internal
     */
    calculatePropagateEndDate(eventData, viewEndDate = this.endDate) {
        const
            { eventEndDate : endDate } = eventData,
            startOfDay                 = this.dayTime.startOfDay(endDate);

        // Round a timeStamp after midnight to the next midnight.
        // Then minimize with our end date. No point collecting cells after the view's last cell
        eventData.propagateEndDate = new Date(Math.min((endDate > startOfDay) ? this.dateHelper.add(startOfDay, 1, 'day') : endDate, viewEndDate));

        /**
         * Fires when a day spanning event is found, and the date to which its encapsulating event bar
         * extends has been calculated.
         *
         * The default result in the event's `propagateEndDate` property may be mutated by a listener.
         *
         * Note that this is an ending point in time, it does *not* refer to a 24 hour block. So setting
         * the `propagateEndDate` to `new Date(2022, 1, 10)` means that the event bar will occupy cells
         * up to and including February 9 2022 and no further.
         *
         * This is relayed through the owning {@link Calendar.view.Calendar}, so a single listener
         * may be used, for example:
         *
         * ```javascript
         * new Calendar({
         *     listeners : {
         *         eventPropagate(eventData) {
         *             // If the event only spills into the next day but not further
         *             // then we do not want an extended event bar.
         *             // An arrow will indicate that it continues rightwards.
         *             if (eventData.eventEndDate < DateHelper.add(eventData.date, 2, 'd')) {
         *                 eventData.propagateEndDate = DateHelper.add(DateHelper.clearTime(eventData.eventRecord.startDate), 1, 'd');
         *             }
         *         }
         *     }
         * })
         * ```
         *
         * The `eventEndDate` in the data block may also be changed to override the event's real end date.
         * This will mean that there will be no arrow indicating that the event continues:
         *
         * ```javascript
         * new Calendar({
         *     listeners : {
         *         eventPropagate(eventData) {
         *             // If the event spills into the next day but not further
         *             // then we do not want an extended event bar.
         *             // Because we override the eventEndDate, no arrow will be present
         *             // to indicate any continuation.
         *             if (eventData.eventEndDate < DateHelper.add(eventData.date, 2, 'd')) {
         *                 eventData.propagateEndDate = eventData.eventEndDate = DateHelper.add(DateHelper.clearTime(eventData.eventRecord.startDate), 1, 'd');
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * @event eventPropagate
         * @param {Date} eventEndDate The end date for which to calculate the propagate end date.
         * @param {Date} propagateEndDate The system-calculated end point of the event bar.
         * @param {Boolean} isAllDay `true` if the event is an all day event, or spans multiple days.
         * @param {Boolean} isOverflow `true` if this is being called as part of further propagation.
         * @param {Boolean} overflows `true` if the event extends into future cells.
         * @param {Scheduler.model.EventModel} eventRecord The event record being propagated.
         * @param {Date} date The date from which the event is being propagated.
         */
        this.trigger('eventPropagate', eventData);

        return eventData.propagateEndDate;
    }

    /**
     * This is the base event collection method which populates the cell Map passed in the options
     * with events grouped by their start date.
     *
     * This may be overridden in subclasses to customize how events are collected.
     * For example, a resource-orientated view may wish to collect events for a specific resource, and some
     * views filter all day and multi day events in or out.
     *
     * The options passed are those documented in {@link Scheduler.data.EventStore#function-getEvents}
     * @param {Object} options The options passed to {@link Scheduler.data.EventStore#function-getEvents}
     * with the addition of:
     * - `cellMap` : A Map to be populated with events grouped by their start date.
     * - `skipPropagate` : Set to `true` to skip the propagation of multi-day events into future cells.
     * - `rawEvents` : Set to `true` to get raw event records in the cellData blocks rather than
     *   {@link DayCell} `events` being an array of {@link EventBar event bar} definitions.
     *
     * @returns {Map} A Map of `YYYY-MM-DD` date keys to arrays of events starting on that date.
     * @private
     */
    collectEvents(options) {
        // Only the start date of recurring events is placed into its cell.
        // The rest of the recurrence is handled by propagateCellEvents if we're not skipping that operation.
        if (!options.skipPropagate) {
            options.propagateRecurringEvents = false;
        }
        return this.eventStore.getEvents(options);
    }

    propagateCellEvents(cellData, cellMap) {
        const
            me            = this,
            {
                events,
                renderedEvents,
                previousEvents,
                nextEvents,
                date
            }             = cellData,
            {
                stackMultiDayEvents
            }             = me,
            eventsPerCell = me.getEventsPerCell(date),
            { length }    = events;

        for (let i = 0; i < length; i++) {
            const
                event = events[i],
                {
                    eventRecord,
                    propagateEndDate,
                    eventEndDate
                } = event;

            // This is its start slot in its starting cell.
            // For the rest of the week, it must occupy the same slot in cells
            // that iot flow into.
            // Once wrapped to a new week, it just stacks up in available space.
            let renderedSlot = renderedEvents.add(event);

            // The event overflows into future cells.
            // We need to claim the event's slot in any future cells which it covers.
            if (event.overflows) {
                // It's only overflow in cells which come *after* it has become visible
                let isVisible = cellData.visible, lastEvent;

                // Walk forwards until we are on a cell which is not covered by this event.
                for (let nextDay = nextEvents; nextDay && nextDay.date < propagateEndDate; nextDay = nextDay.nextEvents) {

                    // On move to a new week (or to the next cell if stackMultiDayEvents is set),
                    // we no longer have to maintain the same event slot, so we can start from the top.
                    if (!nextDay.columnIndex || stackMultiDayEvents) {
                        renderedSlot = nextDay.renderedEvents.firstFreeSlot;
                    }

                    // For each day into which the event extends, occupy its slot
                    nextDay.renderedEvents.set(renderedSlot, lastEvent = {
                        eventRecord,
                        eventEndDate,
                        propagateEndDate,
                        isAllDay   : event.isAllDay,
                        isOverflow : isVisible,
                        overflows  : true
                    });

                    // Once it's visible, all future cell slots have isOverflow: true
                    isVisible = isVisible || nextDay.visible;
                }
                // Obviously the last one we propagated to does not overflow
                lastEvent && (lastEvent.overflows = false);
            }
        }

        // The loop end when rendering
        cellData.maxRow = renderedEvents.length;

        const lastEvent = renderedEvents[eventsPerCell - 1];

        // If we're just filling our cell, but the last one is an overflow from the previous cell
        // AND the previous cell vertically overflowed, we must show the +1 more indicator to match.
        // This is the *ONLY* case where we ever show a "+1 more" indicator.
        // We show "+2 more" at least because an overflow indicator is the same height as an event bar.
        if (renderedEvents.length === eventsPerCell) {
            if (lastEvent?.isOverflow && previousEvents?.hasOverflow) {
                cellData.maxRow--;
                cellData.hasOverflow = true;
            }
        }

        // Decide whether the cell's rendered events overflow its height.
        else if (renderedEvents.length > eventsPerCell) {
            cellData.maxRow = eventsPerCell - 1;
            cellData.hasOverflow = true;

            // If the last slot is an overflow, its originating cell and all intervening ones
            // must be flagged as overflowing so that they get a +"1 more" indicator.
            // The originating cell and all intervening cells must display the overflow indicator
            // if its last visible slot overflows and any future cells that it flows into overflow.
            // See below. We are processing that 3rd cell.
            // If the 3rd cell was not overflowing, it would be fine.
            // But because it needs its own "+2 More" indicator, that originating
            // cell and all intervening ones must also get a "+1 More" indicator even
            // if they're not overflowing because there must be no long event bar to
            // obscure Oct 12's "+2 More indicator".
            // +----------+----------+----------+----------+
            // |  Oct 10  |  Oct 11  |  Oct 12  |          |
            // +----------+----------+----------+----------+
            // |  Event   |  Event   |  Event   |          |
            // |  Event   |  Event   |  Event   |          |
            // |  Event   |  Event   |  Event   |          |
            // |  EventWhichIsExtremelyLong     |          |
            // +----------+----------+----------+----------+
            //                          Event
            if (lastEvent?.isOverflow && !me.hiddenNonWorkingDays[cellData.day]) {
                const
                    { dh } = me,
                    // Jump back to row's start cell. That will depend what a row is.
                    // If we can find a weekContext (this isa MonthView), use the week start date
                    // else use the view's start date.
                    weekStartValue  = me.getWeekContext?.(date).visibleWeekStart || me.firstVisibleDate,
                    eventStartValue = dh.clearTime(lastEvent.eventRecord.startDate).valueOf();

                // Only go back as far as the start of the current week.
                let originatingCell = cellMap.get(dh.makeKey(new Date(Math.max(weekStartValue, eventStartValue))));

                // So if Oct 12's lastEvent isOverflow, we loop through Oct 10 and 11th's cells
                // and reduce the number of available visual slots
                while (originatingCell.key !== cellData.key) {
                    originatingCell.hasOverflow = true;
                    originatingCell.maxRow = eventsPerCell - 1;
                    originatingCell = originatingCell.nextEvents;
                }
            }
        }

        // Walk on to the next one
        nextEvents && me.propagateCellEvents(nextEvents, cellMap);
    }

    createCellData(date) {
        const
            me     = this,
            {
                project,
                resource
            }      = me,
            result = Object.assign(me.cellMonth.getCellData(date, me.month, me.dayTime), {
                view   : me,
                events : [],

                // This property only exists in subviews of ResourceView
                resource,

                // Events can forward-occupy slots if they
                // overrun their start day.
                // So the next step is to propagate forward
                // multi day events into future cells they cover.
                renderedEvents : new EventSlots()
            });


        return result;
    }
};

// We need a cell map which can be flagged as being populated even if it is empty
// so that the cellMap getter can only actually refill the cell map if it is not populated.
// A cell map may be empty but populated if there are no eligible events in the date range.
class CellMap extends Map {
    populated = false;

    constructor(dateHelper) {
        super();
        this.dateHelper = dateHelper;
    }

    get(d, value) {
        return super.get(this.dateHelper.makeKey(d), value);
    }

    set(d, value) {
        d = this.dateHelper.makeKey(d);
        if (!this.has(d)) {
            this.generation = (this.generation || 0) + 1;
        }
        return super.set(d, value);
    }

    delete(d, value) {
        d = this.dateHelper.makeKey(d);
        if (this.has(d)) {
            this.generation++;
        }
        return super.delete(d, value);
    }

    has(d) {
        return super.has(this.dateHelper.makeKey(d));
    }

    clear() {
        if (this.populated) {
            this.populated = false;
            this.generation = (this.generation || 0) + 1;
            return super.clear();
        }
    }
}
