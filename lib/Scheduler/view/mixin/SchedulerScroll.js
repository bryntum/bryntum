import Base from '../../../Core/Base.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import AsyncHelper from '../../../Core/helper/AsyncHelper.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import Duration from '../../../Core/data/Duration.js';

/**
 * @module Scheduler/view/mixin/SchedulerScroll
 */

const
    defaultScrollOptions = {
        block      : 'nearest',
        edgeOffset : 20
    };

/**
 * Functions for scrolling to events, dates etc. Provides methods to programmatically scroll the schedule
 * to bring specific events, resources, or dates into view.
 *
 * ```javascript
 * // Scroll an event into view with animation
 * scheduler.scrollEventIntoView(eventRecord, {
 *     animate   : true,
 *     highlight : true
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Scheduler.view.mixin.TimelineScroll} - Timeline scroll functions
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 *
 * @mixin
 */
export default Target => class SchedulerScroll extends (Target || Base) {
    static $name = 'SchedulerScroll';

    static configurable = {
        /**
         * Specifies the maximum duration for extending the current {@link Scheduler.model.TimeSpan} to allow for smooth
         * scrolling to an event.
         *
         * This configuration determines how far the scheduler should extend the visible timespan to enable smooth
         * scrolling. If the target event is within this duration from the current view, the scheduler will animate the
         * scroll. If the event lies beyond this threshold, the scheduler will directly jump to it without animation.
         *
         * Setting a shorter duration can enhance performance in views with many events, as it limits the number of
         * events that need to be rendered when extending the timespan.
         *
         * The value can be specified as a string or a {@link DurationConfig} object, allowing for flexible duration
         * definitions, such as '1 week' for one week or `{unit: 'week', magnitude: 1}`.
         *
         * Default value is the duration of the currently rendered timespan at the time of invocation.
         * @config {String|DurationConfig}
         */
        scrollExtensionThreshold : null
    };

    //region Scroll to event

    /**
     * Scrolls an event record into the viewport.
     * If the resource store is a tree store, this method will also expand all relevant parent nodes to locate the event.
     *
     * This function is not applicable for events with multiple assignments, please use #scrollResourceEventIntoView instead.
     *
     * @param {Scheduler.model.EventModel|String|Number} eventRecord the event record or its id to scroll into view
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A Promise which resolves when the scrolling is complete.
     * @async
     * @category Scrolling
     */
    async scrollEventIntoView(eventRecord, options = defaultScrollOptions) {
        eventRecord = this.eventStore.getByIdOrThrow(eventRecord);

        const
            me        = this,
            resources = eventRecord.resources || [eventRecord];

        if (resources.length > 1) {
            throw new Error('scrollEventIntoView() is not applicable for events with multiple assignments, please use scrollResourceEventIntoView() instead.');
        }

        if (!resources.length) {
            console.warn('You have asked to scroll to an event which is not assigned to a resource');
            return;
        }

        await me.scrollResourceEventIntoView(resources[0], eventRecord, options);
    }

    /**
     * Scrolls an assignment record into the viewport.
     *
     * If the resource store is a tree store, this method will also expand all relevant parent nodes
     * to locate the event.
     *
     * @param {Scheduler.model.AssignmentModel|String|Number} assignmentRecord The assignment record or its id
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A Promise which resolves when the scrolling is complete.
     * @category Scrolling
     * @async
     */
    async scrollAssignmentIntoView(assignmentRecord, ...args) {
        const { resource, event } = this.assignmentStore.getByIdOrThrow(assignmentRecord);

        return this.scrollResourceEventIntoView(resource, event, ...args);
    }

    /**
     * Scrolls a resource event record into the viewport.
     *
     * If the resource store is a tree store, this method will also expand all relevant parent nodes
     * to locate the event.
     *
     * @param {Scheduler.model.ResourceModel|String|Number} resourceRecord The resource record or its id
     * @param {Scheduler.model.EventModel|String|Number} eventRecord The event record or its id to scroll into view
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A Promise which resolves when the scrolling is complete.
     * @category Scrolling
     * @async
     */
    async scrollResourceEventIntoView(resourceRecord, eventRecord, options = defaultScrollOptions) {
        const me = this;

        // Wait for any TreeGroup to finish loading and regrouping, so that ids resolve and the display store is final
        await me.waitForReadiness();

        resourceRecord = me.resourceStore.getByIdOrThrow(resourceRecord);
        eventRecord    = me.eventStore.getByIdOrThrow(eventRecord);

        if (options.edgeOffset == null) {
            options.edgeOffset = 20;
        }

        /*
         * Note to maintainers.
         *
         * This is carefully designed to only *move* the current TimeAxis's range so that it
         * encompasses the event's requested edge.
         *
         * It does not change the TimeAxis's duration.
         *
         * If the "nearest" edge is requested, it will scroll to the nearest edge of the event,
         * start or end.
         *
         * A target date is calculated to scroll to depending on the requested edge:
         *
         * - start: The start of the tick containing the event's start date
         * - end: The end of the tick containing the event's end date
         * - center: The midpoint of the event
         *
         * The new start and end dates are calculated to be the same duration as the current
         * TimeAxis, but centered on the target date.
         *
         * Moving to the new TimeAxis range will bring the event into the TimeAxis, even if it
         * if not in the *visible* rendering zone.
         *
         * If it is in the visible rendering zone, the timelineScroller.scrollIntoView call will
         * scroll to it.
         *
         * If it is not in the visible rendering zone, the me.scrollUnrenderedEventIntoView will
         * calculate the event's position and scroll to it.
         *
         * Any changes to this code should be discussed with the dev team first.
        */
        const
            {
                store,
                timeAxis,
                visibleDateRange,
                timelineScroller,
                isVertical
            }                    = me,
            {
                unfilteredStartDate,
                unfilteredEndDate
            }                    = timeAxis,
            currentTimeSpanRange = unfilteredEndDate - unfilteredStartDate,
            eventStart           = eventRecord.startDate,
            eventEnd             = eventRecord.endDate,
            eventStartMs         = eventRecord.isScheduled && eventStart.getTime(),
            eventEndMs           = eventRecord.isScheduled && eventEnd.getTime(),
            eventMidpoint        = (eventStartMs + eventEndMs) / 2,
            timespanRange        = visibleDateRange.endMS - visibleDateRange.startMS,
            halfTimeSpanRange    = timespanRange / 2,
            nearestEdge          = Math.abs((eventStartMs - visibleDateRange.startMS)) < Math.abs((eventEndMs - visibleDateRange.endMS)) ? 'start' : 'end',
            targetEdge           = (!options.block || options.block === 'nearest') ? nearestEdge : options.block,
            tickDuration         = new Duration(timeAxis.increment, timeAxis.unit),
            eventDateRequested   = targetEdge === 'start' ? eventStart : targetEdge === 'end' ? eventEnd : new Date(eventMidpoint),
            edgeOffsetDuration   = new Duration(options.edgeOffset * me.getMilliSecondsPerPixelForZoomLevel(me.viewPreset), 'ms');

        // When asked to scroll to a resource that is not in the store, check if it has a link that is in the store.
        // This happens for example when scrolling to an event in a tree grouped scheduler, since event.resources points
        // to the original resources, not the links.
        resourceRecord = resourceRecord.getStoreLink(isVertical ? me.resourceStore : store) ?? resourceRecord;

        if (me.isLockedRows) {
            me.syncSplits(other => other.scrollResourceEventIntoView(resourceRecord, eventRecord, options));
        }

        // Event not scheduled, just scroll resource row into view
        if (!eventRecord.isScheduled) {
            return me.scrollResourceIntoView(resourceRecord, options);
        }

        // Our Scroller API used "block" to specify how to align both dimensions. Now it
        // accepts both "inline" and "block" to align each dimension independently.
        // If the caller provides both properties, we respect them as-is (2D API).
        // Otherwise, we map the legacy "block" to the time dimension and default
        // the resource dimension to "nearest".
        const
            timeDimProp     = isVertical ? 'block' : 'inline',
            resourceDimProp = isVertical ? 'inline' : 'block';

        options = {
            ...options,
            // Time dimension: use explicit value if provided, else fall back to legacy 'block'
            [timeDimProp]     : options[timeDimProp] ?? options.block,
            // Resource dimension: respect explicit value if using 2D API, else default to 'nearest'
            [resourceDimProp] : timeDimProp in options ? (options[resourceDimProp] ?? 'nearest') : 'nearest'
        };

        // We only need to change the TimeAxis if the target date is not rendered in the TimeAxis.
        if (!DateHelper.betweenLesserEqual(eventDateRequested, unfilteredStartDate, unfilteredEndDate) && options.extendTimeAxis !== false) {
            const
                // Calculate a date to bring into view which is date of the requested edge of the event.
                // This is used to scroll the event into view when the event is not rendered.
                targetDate =  targetEdge === 'start' ? DateHelper.floor(eventStart, tickDuration)
                    : targetEdge === 'end'   ? DateHelper.ceil(eventEnd, tickDuration)
                        : eventDateRequested;

            if (me.infiniteScroll) {
                const
                    extendedTimeSpanRange = me.calculateInfiniteScrollingDateRange(DateHelper.add(targetDate, halfTimeSpanRange * (targetEdge === 'start' ? 1 : -1), 'ms'), true),

                    // Calculate a new center date which will place the event bar in the center if center
                    // is requested, but at an edge requiring scrolling if start or end is requested.
                    visibleDate = targetEdge === 'center' ? new Date((eventStartMs + eventEndMs) / 2)
                        : targetEdge === 'end'    ? DateHelper.ceil(new Date(eventEndMs + halfTimeSpanRange), tickDuration)
                            : DateHelper.floor(new Date(eventStartMs - halfTimeSpanRange), tickDuration);

                // Set the time span to place the event's target edge just out of view.
                // This will then produce the visual scroll effect by the scrollIntoView call below.
                me.setTimeSpan(
                    extendedTimeSpanRange.startDate,
                    extendedTimeSpanRange.endDate,
                    {
                        visibleDate,
                        block : 'center'
                    }
                );

            }
            else {
                const
                    s = DateHelper.add(eventDateRequested, edgeOffsetDuration.negate()),
                    e = DateHelper.add(eventDateRequested, edgeOffsetDuration),

                    // Calculate a range which is requested to start 'edgeOffset' before the
                    // start date or 'edgeOffset' after the end date of the event, or which is
                    // centered on the event's center date if center is requested.
                    range = targetEdge === 'start' ? [s, DateHelper.add(s, currentTimeSpanRange, 'ms')]
                        : targetEdge === 'end' ? [DateHelper.add(e, -currentTimeSpanRange, 'ms'), e]
                            : [DateHelper.add(eventDateRequested, -currentTimeSpanRange / 2, 'ms'), DateHelper.add(eventDateRequested, currentTimeSpanRange / 2, 'ms')];

                await me.setTimeSpan(
                    range[0],
                    range[1],
                    {
                        visibleDate : targetDate,
                        block       : targetEdge
                    }
                );
            }

            // If we are jumping to a new date range, fix the target edge  that we determined
            // using date comparison.
            options = {
                ...options,
                [isVertical ? 'block' : 'inline'] : targetEdge
            };
        }

        if (me.isDestroyed) {
            return;
        }

        // The event of a resource that has no visible row might be rendered on another row (GroupRollups), scroll to
        // it there instead of expanding
        if (!isVertical && !store.isAvailable(resourceRecord)) {
            const
                assignmentRecord = me.assignmentStore.getAssignmentForEventAndResource(eventRecord.recurringTimeSpan ?? eventRecord, resourceRecord),
                rowRecord        = assignmentRecord && me.getAssignmentRow(assignmentRecord);

            if (store.isAvailable(rowRecord)) {
                resourceRecord = rowRecord;
            }
        }

        const isRowVisible = store.isAvailable(resourceRecord);

        if (store.tree && !isRowVisible) {
            // If resources are in a tree, ensure parents are expanded first
            await me.expandTo?.(resourceRecord);
        }

        if (store.isGrouped && !isRowVisible) {
            // If resources are grouped, ensure the relevant group is expanded first
            await store.expand(store.getGroupHeaderForRecord(resourceRecord));
        }

        // Handle nested events too
        if (me.features.nestedEvents?.enabled && eventRecord.parent && !eventRecord.parent.isRoot) {
            await me.scrollEventIntoView(eventRecord.parent);
        }

        // Establishing element to scroll to
        let el = me.getElementFromEventRecord(eventRecord, resourceRecord);

        if (el) {
            // It's usually the event wrapper that holds focus
            if (!DomHelper.isFocusable(el)) {
                el = el.parentNode;
            }

            // Scroll into view with animation and highlighting if needed.
            await timelineScroller.scrollIntoView(el, options);
        }
        else if (!eventRecord.isOccurrence && me.eventStore.isFilteredOut(eventRecord)) {
            console.warn('You have asked to scroll to an event which is not available');
        }
        else {
            await me.scrollUnrenderedEventIntoView(resourceRecord, eventRecord, options);
        }
    }

    /**
     * Scrolls an unrendered event into view. Internal function used from #scrollResourceEventIntoView.
     * @private
     * @category Scrolling
     */
    scrollUnrenderedEventIntoView(resourceRec, eventRec, options = defaultScrollOptions) {
        // We must only resolve when the event's element has been painted
        // *and* the scroll has fully completed.
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async(resolve, reject) => {
            const
                me               = this,
                scroller         = me.timeAxisSubGrid.scrollable,
                { viewport }     = scroller;

            // Event may fall on a time not included by workingTime settings
            if (!viewport) {
                resolve();
                return;
            }

            let eventElement, delta, counter = 0;

            do {
                // don't risk with the infinite loop, better to throw
                if (++counter >= 50) {
                    reject(`Too many preparational scrolls during 'scrollIntoView' for event id = ${eventRec.id}`);
                    return;
                }

                // note, that this box is only a rough estimation of the event position
                // it will be precise only in trivial cases
                // in general case, it indicates the direction in which we should scroll
                // and our best guess on the distance
                // this is because we don't know the row heights (even if `preCalculateHeightLimit` is used)
                // row height might change because of:
                // - horizontal scroll (predictable with certain effort)
                // - row height set in some column renderer (completely unpredictable)
                // so we scroll several times, until we have the event's element (meaning the event is rendered)
                const box = me.getResourceEventBox(eventRec, resourceRec);

                // Event may fall on a time not included by workingTime settings
                if (!box) {
                    resolve();
                    return;
                }

                // In case of subPixel position, scroll the whole pixel into view
                box.x = Math.ceil(box.x);
                box.y = Math.ceil(box.y);

                if (me.rtl) {
                    // RTL scrolls in negative direction, coordinates are positive inset
                    box._x = -(box.x - viewport.width);
                }

                // Note use of scroller.scrollLeft here. We need the natural DOM scrollLeft value
                // not the +ve X position along the scrolling axis.
                box.translate(viewport.x - scroller.scrollLeft, viewport.y - scroller.y);

                // only interested in the direction of initial jump
                if (delta === undefined) {
                    delta = scroller.getDeltaTo(box, options);
                }

                // Make an animated scroll (without highlighting or focusing, as we are scrolling a Rectangle)
                const
                    scrollerOptions = { ...options, highlight : false, focus : false },
                    scrollPromise   = scroller.scrollIntoView(box, scrollerOptions);

                await scrollPromise;

                if (scrollPromise.cancelled || me.isDestroyed) {
                    resolve();
                    return true;
                }

                await AsyncHelper.animationFrame();

                if (me.isDestroyed) {
                    resolve();
                    return true;
                }

                eventElement = me.getElementFromEventRecord(eventRec, resourceRec);
            } while (!eventElement);

            // now we have arrived to the local area of the event
            // this is a quite important call, which fixes the internal scroller state after the scrolls above
            me.fixElementHeights();

            // now make a final scroll, pretending we arrived there from the very 1st jump
            const scrollPromise2 = scroller.scrollIntoView(
                eventElement,
                { ...options, force : true }
            );

            await scrollPromise2;

            if (scrollPromise2.canceled || me.isDestroyed) {
                resolve();
                return true;
            }

            resolve();
        });
    }

    /**
     * Scrolls the specified resource into view, works for both horizontal and vertical modes.
     * @param {Scheduler.model.ResourceModel|String|Number} resourceRecord A resource record or its id
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A promise which is resolved when the scrolling has finished.
     * @category Scrolling
     */
    async scrollResourceIntoView(resourceRecord, options = defaultScrollOptions) {
        const me = this;

        await me.waitForReadiness();

        resourceRecord = me.resourceStore.getByIdOrThrow(resourceRecord);

        if (me.isVertical) {
            await me.currentOrientation.scrollResourceIntoView(resourceRecord, options);
        }
        else {
            await me.scrollRowIntoView(resourceRecord, options);
        }
    }

    //endregion

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
