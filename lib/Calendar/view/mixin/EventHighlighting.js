import Base from '../../../Core/Base.js';
import EventHelper from '../../../Core/helper/EventHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';

/**
 * @module Calendar/view/mixin/EventHighlighting
 */

/**
 * Mixin that provides event highlighting for the Calendar. Highlighted events are displayed at full opacity
 * while non-highlighted events fade to 20% opacity.
 *
 * This matches the `highlightEvents()` / `unhighlightEvents()` API available on Scheduler and Gantt
 * via {@link Scheduler.view.TimelineBase}.
 *
 * ```javascript
 * const calendar = new Calendar({ ... });
 *
 * // Highlight specific events by id
 * calendar.highlightEvents({ events : [1, 2, 3] });
 *
 * // Highlight and scroll to the event
 * calendar.highlightEvents({ events : 42, scroll : true });
 *
 * // Remove all highlighting
 * calendar.unhighlightEvents();
 * ```
 *
 * @mixin
 */
export default Target => class EventHighlighting extends (Target || Base) {
    static $name = 'EventHighlighting';

    /**
     * Highlights the elements of the passed event records (or record ids). The first highlighted event element
     * will be scrolled into view by default.
     *
     * Adds the CSS class `b-highlighted` to highlighted event elements, and `b-is-highlighting`
     * to the Calendar's root element, which fades non-highlighted events to 20% opacity.
     *
     * ```javascript
     * // Highlight single event
     * calendar.highlightEvents({ events : 22 });
     * // Highlight multiple events
     * calendar.highlightEvents({ events : [1, 40] });
     * // Don't scroll to highlighted event, and don't un-highlight on click
     * calendar.highlightEvents({ events : 1000, scroll : false, unhighlightOnClick : false });
     * ```
     *
     * @param {Object} options Options config object
     * @param {Scheduler.model.EventModel|Number|String|Scheduler.model.EventModel[]|Number[]|String[]} options.events
     * The event records or record ids to highlight. If an empty array is passed, the `b-is-highlighting` class
     * will be applied, rendering all event elements in the style of `:not(.b-highlighted)`.
     * @param {Boolean} [options.scroll=true] If `false`, no scrolling will be performed.
     * @param {Boolean} [options.unhighlightOnClick=true] If `false`, a call to {@link #function-unhighlightEvents}
     * is needed to remove the highlighting. Otherwise, the highlighting will be removed when the user clicks
     * somewhere in the browser window.
     * @param {Boolean} [options.unhighlightOthers=false] If `true` this will automatically un-highlight events
     * not present in the `events` property
     * @category Misc
     */
    highlightEvents({ events, scroll = true, unhighlightOnClick = true, unhighlightOthers = false }) {
        const
            me          = this,
            highlighted = me._highlightedEvents ??= new Set(),
            records     = me.eventStore.getByIds(events);

        if (unhighlightOthers && highlighted.size) {
            me.unhighlightEvents();
        }

        for (const eventRecord of records) {
            highlighted.add(eventRecord);
        }

        me.updateHighlighted();
        me.toggleCls('b-is-highlighting', highlighted.size > 0);

        if (scroll && records.length) {
            me.activeView.scrollTo?.(records[0]);
        }

        if (unhighlightOnClick && !me._highlightEventsListener) {
            me._highlightEventsListener = EventHelper.on({
                element     : globalThis,
                autoDetach  : true,
                thisObj     : me,
                pointerdown : me.unhighlightEvents
            });
        }
    }

    /**
     * Removes highlighting from the elements of the passed event records (or record ids). If no events
     * are passed all highlighted events will be un-highlighted.
     *
     * ```javascript
     * calendar.unhighlightEvents({ events : 22 }); // single event
     * calendar.unhighlightEvents({ events : [1, 40] }); // multiple events
     * calendar.unhighlightEvents(); // un-highlight all
     * ```
     *
     * @param {Object} [options] Options config object
     * @param {Scheduler.model.EventModel|Number|String|Scheduler.model.EventModel[]|Number[]|String[]} [options.events]
     * The event records or record ids to un-highlight. Omit this to un-highlight all.
     * @category Misc
     */
    unhighlightEvents(options) {
        const
            me                     = this,
            { _highlightedEvents } = me;
        let events                 = options?.events;

        // When called from click listener, options will be the browser event
        if (DomHelper.isDOMEvent(options)) {
            const { target } = options;

            // Try to detect scrollbar clicks
            if (target.closest('.b-virtual-scroller') ||
                (options.offsetX > target.clientWidth || options.offsetY > target.clientHeight)
            ) {
                return;
            }
            events = null;
        }

        if (_highlightedEvents?.size) {
            if (events) {
                const records = me.eventStore.getByIds(events);

                for (const eventRecord of records) {
                    _highlightedEvents.delete(eventRecord);
                }
            }
            else {
                _highlightedEvents.clear();
            }

            me.updateHighlighted();
        }

        me.toggleCls('b-is-highlighting', _highlightedEvents?.size > 0);

        // Clear tap listener if we have no highlighting
        if (!_highlightedEvents?.size) {
            me._highlightEventsListener = me._highlightEventsListener?.();
        }
    }

    /**
     * Returns `true` if the passed event (or event id) is currently highlighted.
     * @param {Scheduler.model.EventModel|Number|String} eventOrId An event record or its id
     * @returns {Boolean}
     * @category Misc
     */
    isEventHighlighted(eventOrId) {
        const id = eventOrId?.isModel ? eventOrId.id : eventOrId;

        return this._highlightedEvents?.has(this.eventStore.getById(id)) ?? false;
    }

    /**
     * Syncs the `b-highlighted` CSS class on all visible event elements to match the
     * current set of highlighted event records.
     * @private
     */
    updateHighlighted() {
        const eventEls = this.viewContainer.contentElement.querySelectorAll('.b-cal-event-wrap');

        eventEls.forEach(el => {
            el.classList.toggle('b-highlighted', this.isEventHighlighted(el.dataset.eventId));
        });
    }

    onCalendarStoreChange(...args) {
        if (this.isPainted) {
            this.cleanupHighlightedEvents();
        }
        super.onCalendarStoreChange?.(...args);
    }

    /**
     * Called from `onCalendarStoreChange` to clean up highlighted events for records
     * that have been removed from the event store.
     * @private
     */
    cleanupHighlightedEvents() {
        const { _highlightedEvents } = this;

        if (_highlightedEvents?.size) {
            for (const event of [..._highlightedEvents]) {
                if (!this.eventStore.includes(event)) {
                    _highlightedEvents.delete(event);
                }
            }
            if (!_highlightedEvents.size) {
                this.removeCls('b-is-highlighting');
            }
        }
    }
};
