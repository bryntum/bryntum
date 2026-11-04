import Objects from '../../../Core/helper/util/Objects.js';
import ArrayHelper from '../../../Core/helper/ArrayHelper.js';
import FunctionHelper from '../../../Core/helper/FunctionHelper.js';

/**
 * @module Scheduler/data/mixin/GetEventsMixin
 */

const
    returnTrue        = () => true,

    // Wrap a store's filter function to take into account its `reapplyFilterOnAdd` because there may be newly
    // added events which may not be subject to the filter. Records which are still in
    // the added bag must be tested for presence using indexOf so as to be always in sync
    // with the store being refiltered.
    wrapStoreFilterFn = (store, filterFn) => {
        if (filterFn && !store.reapplyFilterOnAdd) {
            return eventRecord => store.added.includes(eventRecord) ? store.indexOf(eventRecord) > -1 : filterFn(eventRecord);
        }
        return filterFn;
    };

/**
 * A mixin containing functionality for retrieving a range of events, mainly used during rendering.
 *
 * Consumed by EventStore in Calendar and Scheduler and TaskStore in Gantt.
 *
 * @mixin
 */
export default Target => class GetEventsMixin extends Target {
    bufferIsUnavailableTime = false;

    static $name = 'GetEventsMixin';

    /**
     * Returns an array of events for the date range specified by the `startDate` and `endDate` options.
     *
     * By default, for any date, this includes any event which *intersects* that date.
     *
     * To only include events that are fully contained *within* the date range, pass the `allowPartial`
     * option as `false`.
     *
     * By default, any occurrences of recurring events are included in the resulting array (not applicable in Gantt or
     * on the Community tier). If that is not required, pass the `includeOccurrences` option as `false`.
     *
     * {@note}Note that if `includeOccurrences` is `true`, the start date and end date options are mandatory.
     * The method must know what range of occurrences needs to be generated and returned.{/@note}
     *
     * Example:
     *
     * ```javascript
     *  visibleEvents = eventStore.getEvents({
     *      resourceRecord : myResource,
     *      startDate      : scheduler.timeAxis.startDate,
     *      endDate        : scheduler.timeAxis.endDate
     *  });
     * ```
     *
     * @param {Object} options An options object determining which events to return
     * @param {Date} [options.date] If only one date is required, pass this option instead of the
     * `startDate` and `endDate` options.
     * @param {Date} options.startDate The start date for the range of events to include.
     * @param {Date} [options.endDate] The end date for the range of events to include. Defaults to a startDate + one day
     * range if only startDate passed
     * @param {Scheduler.model.ResourceModel} [options.resourceRecord] Pass a resource to only return events assigned to
     *   this resource. Not supported when using the `dateMap` option (see below)
     * @param {Function} [options.filter] A function to filter out events which are not required.
     * @param {Boolean} [options.ignoreFilters] By default, store filters are honoured. Pass this
     * as `true` to include filtered out events.
     * @param {Boolean} [options.includeOccurrences=true] Occurrences of recurring events are included by default.
     * @param {Boolean} [options.allowPartial=true] Events which start before or after the range, but *intersect* the
     *   range are included by default.
     * @param {Boolean} [options.startOnly] Pass `true` to only include events which *start on* each date in the range.
     * @param {Boolean} [options.silent] Pass `true` to not fire the {@link #event-loadDateRange} event.
     * @param {Boolean} [options.onlyAssigned] Pass `true` to only include events that are assigned to a resource
     * @param {Boolean|Map} [options.dateMap] Populates the passed `Map`, or if passed as `true`, creates and
     * returns a new `Map`. The keys are `YYYY-MM-DD` date strings and the entries are arrays of
     * {@link Scheduler.model.EventModel}s.
     * @returns {Scheduler.model.EventModel[]|Map} Events which match the passed configuration.
     * @category Events
     */
    getEvents({
        filter,
        date,
        startDate,                  // Events which intersect the startDate/endDate
        endDate,                    // will be returned
        startOnly,                  // Only events which start on each date will be returned
        includeOccurrences,         // Interpolate occurrences into the returned event set
        allowPartial,               // Include events which *intersect* the date range
        onlyAssigned = false,       // Only include events that are assigned to a resource
        dateMap = false,            // Return a Map keyed by date each value being an array of events
        dayTime = null,
        silent,

        // Private option. Select which date index to look up events in depending on the date
        // we are examining in the date iteration process. Some callers may want to use
        // different indices depending on the stage through the date iteration.
        // See Calendar package for usage.
        getDateIndex,
        fromRowHeight
    }) {
        const
            me                = this,
            options           = arguments[0],
            { lastDateRange } = me,
            passedFilter      = filter;

        // Add filtering for only assigned events if requested.
        if (onlyAssigned) {
            options.filter = passedFilter ? e => passedFilter(e) && e.resources.length : e => e.resources.length;
        }

        // Note that we cannot use defaulting in the argument block because we pass
        // the incoming options object down into implementations.
        if (!('startDate' in options)) {
            startDate = options.startDate = date;
        }
        if (!('includeOccurrences' in options)) {
            includeOccurrences = options.includeOccurrences = true;
        }
        if (!('allowPartial' in options)) {
            allowPartial = options.allowPartial = !startOnly;
        }


        // Don't use the store's filtering function if we were asked to ignore filters.
        if (!options.ignoreFilters) {
            // Wrap the store's filter function to take into account its `reapplyFilterOnAdd` because there may be newly
            // added events which may not be subject to the filter. Records which are still in
            // the added bag must be tested for presence using indexOf so as to be always in sync
            // with the store being refiltered.
            options.storeFilterFn = wrapStoreFilterFn(me, me.isFiltered && !me.remoteFilter ? me.filtersFunction : null);

            // If this store is chained to a master store and configured to honour the master store's filters,
            // combine this store's filterFn with the master store's filterFn.
            if (me.isChained && me.chainFilters) {
                options.storeFilterFn = wrapStoreFilterFn(me.masterStore, FunctionHelper.combineFilterFns(options.storeFilterFn, me.generateMasterFilterFn()));
            }
        }

        // Default to a one day range if only startDate passed
        if (!endDate) {
            if (startDate) {
                endDate = options.endDate = me.dh.clearTime(startDate);
                endDate.setDate(endDate.getDate() + 1);
            }
            // If no dates passed, the dateFilter will include all.
            else {

                options.dateFilter = returnTrue;
            }
        }

        if (!options.dateFilter) {
            // Must start in the date range
            if (startOnly) {
                options.dateFilter = e => {
                    // Avoid hitting getter twice. Use batched value if present.
                    const eventStartDate = e.hasBatchedChange('startDate') ? e.get('startDate') : e.startDate;

                    return eventStartDate && !(me.dh.clearTime(eventStartDate) - startDate);
                };
            }
            // Any intersection with our date range
            else if (allowPartial) {
                options.dateFilter = e => {
                    // Avoid hitting getter twice. Use batched value if present.
                    const
                        eventStartDate = e.hasBatchedChange('startDate') ? e.get('startDate') : e.startDate,
                        eventEndDate   = e.hasBatchedChange('endDate') ? e.get('endDate') : e.endDate || eventStartDate,
                        isMilestone    = !(eventStartDate - eventEndDate);

                    return eventStartDate && (isMilestone ? me.dh.betweenLesserEqual(eventStartDate, startDate, endDate) : me.dh.intersectSpans(eventStartDate, eventEndDate, startDate, endDate));
                };
            }
            // Must be wholly contained with the our range
            else {
                options.dateFilter = e => {
                    // Avoid hitting getter twice. Use batched value if present.
                    const
                        eventStartDate = e.hasBatchedChange('startDate') ? e.get('startDate') : e.startDate,
                        eventEndDate   = e.hasBatchedChange('endDate') ? e.get('endDate') : e.endDate || eventStartDate;

                    return eventStartDate && eventStartDate >= startDate && eventEndDate <= endDate;
                };
            }
        }

        const
            newDateRange = { startDate, endDate },
            changed      = Boolean(!lastDateRange ||
                (lastDateRange.startDate - newDateRange.startDate || lastDateRange.endDate - newDateRange.endDate));

        // Ensure the listeners are present
        me.processConfiguredListeners();

        if (!silent) {
            /**
             * Fired when a range of events is requested from the {@link #function-getEvents} method.
             *
             * {@note}This event fires <span style="font-weight:bold">every time</span> a range of events is requested from
             * the store.{/@note}
             *
             * An application may have one of two levels of interest in events being read from a store.<br>
             *
             * 1. To be notified when **any** event block is requested regardless of what the date range is.
             * 2. To be notified when a **new date range** is requested.
             *
             * This event allows both types of application to be written. The `changed` property is set if a different date
             * range is requested.
             *
             * ```javascript
             * new Scheduler({
             *     eventStore : {
             *         listeners : {
             *             loadDateRange({ new : { startDate, endDate }, changed }) {
             *                 // Load new data if user is requesting a different time window.
             *                 if (changed) {
             *                     fetch(...);
             *                 }
             *             }
             *         }
             *     },
             *     ...
             * });
             * ```
             *
             * @event loadDateRange
             * @param {Scheduler.data.EventStore} source This EventStore
             * @param {Object} old The old date range
             * @param {Date} old.startDate the old start date
             * @param {Date} old.endDate the old end date
             * @param {Object} new The new date range
             * @param {Date} new.startDate the new start date
             * @param {Date} new.endDate the new end date
             * @param {Boolean} changed `true` if the date range is different from the last time a request was made
             */
            me.trigger('loadDateRange', {
                old : lastDateRange || {},
                new : Objects.clone(newDateRange),
                changed
            });
        }
        // Dates are mutable, so we must keep our own copy.
        me.lastDateRange = Objects.clone(newDateRange);

        return dateMap ? me.getEventsAsMap(options) : me.getEventsAsArray(options);
    }

    /**
     * Internal implementation for {@link #function-getEvents} to use when not using dateMap.
     * @private
     */
    getEventsAsArray({
        filter,
        date,
        resourceRecord,
        // Private option, the candidate events for resourceRecord when the view renders other events than its own
        resourceEvents,
        startDate = date,           // Events which intersect the startDate/endDate
        endDate,                    // will be returned
        startOnly,                  // Only events which start on each date will be returned
        includeOccurrences = true,  // Interpolate occurrences into the returned event set
        dayTime = null,

        // Injected by the getEvents master method
        dateFilter,

        storeFilterFn,

        // Private option. Select which date index to look up events in depending on the date
        // we are examining in the date iteration process. Some callers may want to use
        // different indices depending on the stage through the date iteration.
        // See Calendar package for usage.
        getDateIndex
    }) {
        const
            me     = this,
            events = [],
            count  = storeFilterFn ? me.count : me.totalCount;

        if (count) {
            let candidateEvents = resourceRecord ? (resourceEvents ?? me.getEventsForResource(resourceRecord)) : null;

            // If there *was* a resourceRecord, candidateEvents will already be set up using me.getEventsForResource.
            // If no resourceRecord specified, we are gathering by date, so use the indices.
            if (!resourceRecord) {
                const
                    dateIndex = me.useDayIndex(dayTime),
                    eventSet  = new Set(),
                    indexName = startOnly ? 'startDate' : 'date';



                // Iterate the date range, using the indices to find qualified events.
                for (let date = new Date(startDate); date < endDate; date = dateIndex.dayTime.dateHelper.add(date, 1, 'day')) {
                    const coincidingEvents = dateIndex.get(getDateIndex ? getDateIndex(date) : indexName, date);

                    coincidingEvents?.forEach(e => eventSet.add(e));
                }

                // We gathered all events which *coincide* with each date.

                // All these were made unique by the Set.
                // Return it to array form.
                candidateEvents = [...eventSet];
            }

            // Events found from the date indices won't be filtered.
            // On the other side, when using getEventForResource we will get all events for
            // the resource even if the EventStore is filtered, handle this by excluding "invisible" events here
            if (storeFilterFn) {
                candidateEvents = candidateEvents.filter(storeFilterFn);
            }

            // Go through candidates.
            // For a recurring event, and we are including recurrences, add date-qualifying occurrences.
            // For a non-recurring event, add it if it's date-qualified.
            for (let i = 0, { length } = candidateEvents; i < length; i++) {
                const e = candidateEvents[i];

                //<remove-on-release>
                // https://github.com/bryntum/bryntum/issues/12391
                // When this is fixed we will always add date-qualifying occurrences.
                // The code at Scheduler/view/mixin/EventNavigation#isInTimeAxis will be simpler.
                // What we should do here is:
                // if (dateFilter(e)) {
                //     events.push(e);
                // }
                // if (isRecurring) {
                //     events.push.apply(events, e.getOccurrencesForDateRange(startDate, endDate).filter(dateFilter));
                // }
                //</remove-on-release>


                    if (dateFilter(e)) {
                        events.push(e);
                    }
            }
        }

        return filter ? events.filter(filter) : events;
    }

    /**
     * Internal implementation for {@link #function-getEvents} to use when using dateMap.
     * @private
     */
    getEventsAsMap({
        filter : passedFilter,
        date,
        resourceRecord,                     // Not supported yet. Will add if ever requested.
        startDate = date,                   // Events which intersect the startDate/endDate
        endDate,                            // will be returned
        startOnly,                          // Only events which start on each date will be returned

        dateMap,                            // Return a Map keyed by date each value being an array of events
        dayTime = null,

        storeFilterFn,

        // Private option. Select which date index to look up events in depending on the date
        // we are examining in the date iteration process. Some callers may want to use
        // different indices depending on the stage through the date iteration.
        // See Calendar package for usage.
        getDateIndex
    }) {
        const me = this;

        // Convert `true` to a Map.
        if (dateMap?.clear) {
            dateMap.clear();
        }
        else {
            dateMap = new Map();
        }

        if (me.count) {
            const
                dateIndex       = me.useDayIndex(dayTime),
                indexName       = startOnly ? 'startDate' : 'date',

                filter          = e => (!passedFilter || passedFilter(e)) && (!storeFilterFn || storeFilterFn(e)),
                baseEventFilter = e =>

                    filter(e),
                { dateHelper }  = me;

            dayTime = dateIndex.dayTime;  // dayTime=null becomes DayTime instance for midnight

            // We can't yet do this for just a resource.
            if (resourceRecord) {
                throw new Error('Querying for events for a resource and returning a date-keyed Map is not supported');
            }
            else {


                // Iterate the date range, using the indices to find qualified events.
                let lastKey;

                for (const date = new Date(startDate); date < endDate; dayTime.dateHelper.add(date, 1, 'day', false)) { // NOSONAR
                    let [coincidingEvents, key] = dateIndex.get(getDateIndex ? getDateIndex(date) : indexName, date, true);

                    // Belt and braces for unlucky alignments (e.g. a range starting mid-day): never fill the same day
                    // bucket twice.
                    if (key === lastKey) {
                        continue;
                    }
                    lastKey = key;

                    // The index entry may be there, but it could be empty.
                    if (coincidingEvents?.size) {
                        // Convert Set which index holds into an Array.

                        // Then filter by the passed filter and this Store's filter function
                        // because events found from the date indices won't be filtered.
                        coincidingEvents = [...coincidingEvents].filter(baseEventFilter);

                        // Only create the entry for the day if there are events found
                        if (coincidingEvents.length) {
                            (dateMap.get(key) || (dateMap.set(key, []).get(key))).push(...coincidingEvents);
                        }
                    }
                }
            }

        }

        return dateMap;
    }

    /**
     * Checks if a date range is available for a given resource.
     *
     * Note that when asked to check a 0 duration range, any 0 duration events at the same point in time will be
     * considered overlapping.
     *
     * @param {Date} startDate The start date
     * @param {Date} endDate The end date
     * @param {Scheduler.model.EventModel|Scheduler.model.AssignmentModel|Scheduler.model.EventModel[]|Scheduler.model.AssignmentModel[]|null} excludeEventOrAssignment An event or
     * assignment to exclude from the check (or null). An assignment excludes only itself, keeping the event's other
     * assignments in the check
     * @param {Scheduler.model.ResourceModel|Scheduler.model.ResourceModel[]} resourceRecord The resource
     * @returns {Boolean} True if the timespan is available for the resource
     * @category Resource
     */
    isDateRangeAvailable(startDate, endDate, excludeEventOrAssignment, resourceRecord) {
        // NOTE: Also exists in TaskStore.js
        // The single argument form carries the view level options, the positional form is the public signature
        const options = arguments.length === 1 ? startDate : { startDate, endDate, excludeEventOrAssignment, resourceRecord };

        return ArrayHelper.asArray(options.resourceRecord).every(resource =>
            this.isResourceAvailable({ ...options, resource })
        );
    }

    // Takes the same options as `getConflictingEventsForResource`, which they are passed straight on to
    isResourceAvailable(options) {
        // Cannot assign anything to generated parents
        if (options.resource.data.generatedParent) {
            return false;
        }

        return this.getConflictingEventsForResource(options)?.length === 0;
    }

    getConflictingEventsForResource({ startDate, endDate, excludeEventOrAssignment, resource, allowOverlap, useBufferFromAssignments, bufferIsUnavailableTime }) {
        if (typeof resource.allowOverlap === 'boolean' ? resource.allowOverlap : allowOverlap) {
            return [];
        }

        const
            me             = this,
            { dateHelper } = me,
            events         = me.getEventsForResource(resource);

        // Views pass their own setting, the store property is the fallback for store level callers which have no view
        bufferIsUnavailableTime = bufferIsUnavailableTime ?? me.bufferIsUnavailableTime;



        // This should be a collection of unique event records + occurrences
        const allEvents = new Set(events);



        // In private mode we can pass an AssignmentModel. In this case, we assume that multi-assignment is used.
        // So we need to make sure that other resources are available for this time too.
        // No matter if the event retrieved from the assignment belongs to the target resource or not.
        // We gather all events from the resources the event is assigned to except of the one from the assignment record.
        // Note, events from the target resource are added above.
        if (excludeEventOrAssignment) {
            ArrayHelper.asArray(excludeEventOrAssignment).forEach(excluded => {
                if (excluded.isAssignment) {
                    const
                        excludedEvent     = excluded.event,
                        excludedResources = excludedEvent.resources;

                    excludedResources.forEach(excludedResource => {
                        // Ignore events for the resource which is passed as an AssignmentModel to excludeEventOrAssignment
                        if (excludedResource.id !== excluded.resourceId) {
                            me.getEventsForResource(excludedResource).forEach(otherEvent => {
                                allEvents.add(otherEvent);


                            });
                        }
                    });
                }

                const eventToRemove = excluded.isAssignment ? excluded.event : excluded;
                allEvents.delete(eventToRemove);

            });
        }

        const all = Array.from(allEvents);

        // Asked to check a 0 duration range, use different logic to consider 0 duration events at the same point in
        // time as overlapping
        if (startDate.getTime() === endDate.getTime()) {
            return all.filter(event =>
                event.isScheduled && (event.duration === 0
                    // Same point in time for 0 duration events
                    ? event.startDate.getTime() === startDate.getTime()
                    // Normal overlap check for others
                    : me.dh.intersectSpans(startDate, endDate, event.startDate, event.endDate))
            );
        }

        // For events with preamble/postamble (Enterprise tier), use outer bounds for the check
        return all.filter(event => {
            if (!event.isScheduled) {
                return false;
            }



            return dateHelper.intersectSpans(
                startDate,
                endDate,
                bufferIsUnavailableTime && event.outerStartDate || event.startDate,
                bufferIsUnavailableTime && event.outerEndDate || event.endDate
            );
        });
    }

    /**
     * Returns a `Map`, keyed by `YYYY-MM-DD` date keys containing event counts for all the days
     * between the passed `startDate` and `endDate`. Occurrences of recurring events are included.
     *
     * Example:
     *
     * ```javascript
     *  eventCounts = eventStore.getEventCounts({
     *      startDate : scheduler.timeAxis.startDate,
     *      endDate   : scheduler.timeAxis.endDate
     *  });
     * ```
     *
     * @param {Object} options An options object determining which events to return
     * @param {Date} options.startDate The start date for the range of events to include.
     * @param {Date} [options.endDate] The end date for the range of events to include.
     * @category Events
     */
    getEventCounts(options) {
        const
            // Must use getEvents so that the loadDateRange event is triggered.
            result = this.getEvents({
                ...options,
                storeFilterFn : this.isFiltered ? this.filtersFunction  : null,
                dateMap       : options.dateMap || true
            });

        result.forEach((value, key) => result.set(key, value.length));
        return result;
    }

    /**
     * This function will find the next available start date where the provided duration fits without causing any
     * conflicts. It begins by checking the provided `resources` on the provided `startDate`. And if any conflicting
     * events is found, it restarts searching from the last of the conflicting events and continues like this until a
     * matching time slot is found.
     * @param {Object} options
     * @param {Date} options.startDate The date from which to start looking for available date range
     * @param {DurationConfig|string} options.duration The duration of the slot to look for
     * @param {Scheduler.model.ResourceModel[]} options.resources The resources to include in the search
     * @param {Boolean} [options.matchAllResources] Set to `true` to require all resources to be available
     * @param {Date} [options.stopDate] The date to stop looking for available date ranges. Defaults to 10 years from
     * `Date.now()`
     * @param {Function} [options.isConflict] An optional function which will be called for each conflicting event, making
     * it possible to return `false` to ignore that event from the search
     * @param {Function} [options.getValidDate] An optional function which will be called for each date ranged that will
     * be searched for availability. Useful for not allowing certain time slots to be included, like nighttime or
     * lunch-breaks. Return the new `startDate` to make the search skip certain time ranges.
     * @returns {{ resource : (Scheduler.model.ResourceModel|undefined), startDate : Date}|undefined} `{ startDate, resource }` - If an available
     * date range is found, an object will be return containing a matching `resource` (only if `matchAllResources` =
     * `false`) and the `startDate` of the date range.
     */
    getNextAvailableDateRange({ matchAllResources, resources, ...options }) {
        const me = this;

        if (typeof options.duration === 'string') {
            options.duration = me.dateHelper.parseDuration(options.duration, true);
        }
        if (!('stopDate' in options)) {
            options.stopDate = new Date(Date.now() + 10 * 356 * 24 * 60 * 60 * 1000);
        }

        if (!matchAllResources || resources.length === 1) {
            let available;
            resources.forEach(resource => {
                const result = me.getNextAvailableDateRangeForResource({ ...options, resource });
                if (result && (!available || result < available.startDate)) {
                    available = {
                        resource,
                        startDate : result
                    };
                    // If we found one, no need to search further than that one
                    options.stopDate = result;
                }
            });
            return available;
        }

        while (true) { // the call below should stop the loop
            // 1. Start by finding the next available slot for the first resource
            const availableDate = me.getNextAvailableDateRangeForResource({ ...options, resource : resources[0] });
            if (!availableDate) {
                return;
            }

            let available = true;
            resources.forEach((resource, i) => {
                if (i > 0) {
                    // 2. Check if all others are available.
                    const conflictDate = me.getDateAfterConflict({ startDate : availableDate, endDate : me.dateHelper.add(availableDate, options.duration), resource, isConflict : options.isConflict });
                    if (conflictDate) {
                        // 3.  If not, start searching from the last one's endDate (1. above)
                        available = false;
                        if (options.startDate < conflictDate) {
                            options.startDate = conflictDate;
                        }
                    }
                }
            });

            if (available) {
                return {
                    startDate : availableDate
                };
            }
        }
    }

    // Looks for conflicting events and returns the endDate of the last one found
    getDateAfterConflict({ isConflict, ...options }) {
        let conflictingEvents = this.getConflictingEventsForResource({ ...options, allowOverlap : false }),
            date;

        if (conflictingEvents.length && typeof isConflict === 'function') {
            conflictingEvents = conflictingEvents.filter(event => isConflict({ ...options, event }));
        }
        if (conflictingEvents.length) {
            // Pick the last one
            conflictingEvents.forEach(({ endDate }) => {
                if (!date || endDate > date) {
                    date = new Date(endDate);
                }
            });
        }
        return date;
    }

    getNextAvailableDateRangeForResource({ startDate, duration, resource, stopDate, isConflict, getValidDate }) {
        // Start at the provided startDate
        const { dh } = this;
        let endDate;
        while ((endDate = dh.add(startDate, duration)) <= stopDate) {
            if (typeof getValidDate === 'function') {
                // Let app adjust each date
                startDate = new Date(startDate); // Don't allow mutation
                startDate = getValidDate({ resource, startDate, endDate });
                endDate = dh.add(startDate, duration);
            }

            // Check if there are events conflicting this date range
            const conflictDate = this.getDateAfterConflict({ startDate, endDate, resource, isConflict });
            if (conflictDate) {
                // Found one, set startDate to the end of that event and continue this loop
                startDate = new Date(conflictDate);
            }
            else {
                // No conflict found, we have an available date range
                return startDate;
            }
        }

        return false;
    }
};
