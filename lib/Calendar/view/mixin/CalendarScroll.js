import Base from '../../../Core/Base.js';

/**
 * @module Calendar/view/mixin/CalendarScroll
 */

/**
 * Functions for scrolling events and resources into view.
 *
 * All functions accept a record or a record id, and operate on the {@link Calendar.view.Calendar#property-activeView}.
 * Bringing an event into view may move the view's date range, since the event may lie outside it.
 *
 * @mixin
 * @tier community
 */
export default Target => class CalendarScroll extends (Target || Base) {
    static $name = 'CalendarScroll';

    //region Scroll to event

    /**
     * Scrolls an event into view in the {@link Calendar.view.Calendar#property-activeView}, moving the view's date
     * range to encompass the event if necessary.
     *
     * In the resource oriented views ({@link Calendar.widget.ResourceView} and
     * {@link Calendar.widget.DayResourceView}) an event which is assigned to several resources is rendered once per
     * resource. This function is not applicable to such events in those views, use
     * {@link #function-scrollResourceEventIntoView} instead.
     *
     * @param {Scheduler.model.EventModel|String|Number} eventRecord The event record or its id to scroll into view
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A Promise which resolves when the scrolling is complete.
     * @category Scrolling
     * @async
     */
    async scrollEventIntoView(eventRecord, options) {
        const
            me             = this,
            eventModel     = me.eventStore.getByIdOrThrow(eventRecord),
            { activeView } = me;

        if (eventModel.resources?.length > 1 && activeView.laysOutResources) {
            throw new Error('scrollEventIntoView() is not applicable for events with multiple assignments in a resource view, please use scrollResourceEventIntoView() instead.');
        }

        return activeView.scrollTo(eventModel, options);
    }

    /**
     * Scrolls an assignment's event into view in the {@link Calendar.view.Calendar#property-activeView}, in the
     * column or sub view which renders the assignment's resource.
     *
     * @param {Scheduler.model.AssignmentModel|String|Number} assignmentRecord The assignment record or its id
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A Promise which resolves when the scrolling is complete.
     * @category Scrolling
     * @async
     */
    async scrollAssignmentIntoView(assignmentRecord, options) {
        const { resource, event } = this.assignmentStore.getByIdOrThrow(assignmentRecord);

        return this.scrollResourceEventIntoView(resource, event, options);
    }

    /**
     * Scrolls an event into view in the column or sub view which renders the passed resource.
     *
     * In views which do not lay resources out separately the event is rendered once, so the resource is not used and
     * this behaves like {@link #function-scrollEventIntoView}.
     *
     * @param {Scheduler.model.ResourceModel|String|Number} resourceRecord The resource record or its id
     * @param {Scheduler.model.EventModel|String|Number} eventRecord The event record or its id to scroll into view
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A Promise which resolves when the scrolling is complete.
     * @category Scrolling
     * @async
     */
    async scrollResourceEventIntoView(resourceRecord, eventRecord, options) {
        const
            me             = this,
            resourceModel  = me.resourceStore.getByIdOrThrow(resourceRecord),
            eventModel     = me.eventStore.getByIdOrThrow(eventRecord),
            { activeView } = me;

        if (activeView.laysOutResources) {
            return activeView.scrollResourceEventIntoView(resourceModel, eventModel, options);
        }

        return activeView.scrollTo(eventModel, options);
    }

    //endregion

    //region Scroll to resource

    /**
     * Scrolls a resource into view in the {@link Calendar.view.Calendar#property-activeView}.
     *
     * This only applies to the views which lay resources out separately,
     * {@link Calendar.widget.ResourceView} and {@link Calendar.widget.DayResourceView}. In other views the resource
     * has no place of its own to scroll to, and a warning is logged.
     *
     * @param {Scheduler.model.ResourceModel|String|Number} resourceRecord The resource record or its id
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A Promise which resolves when the scrolling is complete.
     * @category Scrolling
     * @async
     */
    async scrollResourceIntoView(resourceRecord, options) {
        const
            me             = this,
            resourceModel  = me.resourceStore.getByIdOrThrow(resourceRecord),
            { activeView } = me;

        if (!activeView.laysOutResources) {
            console.warn(`The ${activeView.type} view does not lay resources out separately, so there is nothing to scroll a resource into view in`);
            return;
        }

        return activeView.scrollResourceIntoView(resourceModel, options);
    }

    //endregion

    // This does not need a className on Widgets.
    get widgetClass() {}
};
