import Base from '../../../Core/Base.js';

/**
 * @module Scheduler/view/mixin/SchedulerDomEvents
 */

/**
 * Mixin that handles dom events (click etc) for scheduler and rendered events. It translates low-level
 * browser events like mouse clicks, double-clicks, and context menus into higher-level scheduler events.
 *
 * ## See also
 *
 * - {@link Scheduler.view.mixin.SchedulerDom} - DOM element mapping
 * - {@link Scheduler.view.mixin.TimelineDomEvents} - Timeline DOM events
 *
 * @mixin
 */
export default Target => class SchedulerDomEvents extends (Target || Base) {
    static $name = 'SchedulerDomEvents';

    //region Events

    /**
     * Triggered when user mousedowns over an empty area in the schedule.
     * @event scheduleMouseDown
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Date} date Date at mouse position
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Resource index
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered when mouse enters an empty area in the schedule.
     * @event scheduleMouseEnter
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Date} date Date at mouse position
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Resource index
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered when mouse leaves an empty area in the schedule.
     * @event scheduleMouseLeave
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered when user mouseups over an empty area in the schedule.
     * @event scheduleMouseUp
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Date} date Date at mouse position
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Resource index
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered when user moves mouse over an empty area in the schedule.
     * @event scheduleMouseMove
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Date} date Date at mouse position
     * @param {Scheduler.model.TimeSpan} tick A record which encapsulates the time axis tick clicked on.
     * @param {Number} tickIndex The index of the time axis tick clicked on.
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Resource index
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered when user clicks an empty area in the schedule.
     * @event scheduleClick
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Date} date Date at mouse position
     * @param {Scheduler.model.TimeSpan} tick A record which encapsulates the time axis tick clicked on.
     * @param {Number} tickIndex The index of the time axis tick clicked on.
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Resource index
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered when user double-clicks an empty area in the schedule.
     * @event scheduleDblClick
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Date} date Date at mouse position
     * @param {Scheduler.model.TimeSpan} tick A record which encapsulates the time axis tick clicked on.
     * @param {Number} tickIndex The index of the time axis tick clicked on.
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Index of double-clicked resource
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered when user right-clicks an empty area in the schedule.
     * @event scheduleContextMenu
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Date} date Date at mouse position
     * @param {Scheduler.model.TimeSpan} tick A record which encapsulates the time axis tick clicked on.
     * @param {Number} tickIndex The index of the time axis tick clicked on.
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Resource index
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered for mouse down on an event.
     * @event eventMouseDown
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.EventModel} eventRecord Event record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record
     * @param {Date} date Date at mouse position
     * @param {Scheduler.model.TimeSpan} tick A record which encapsulates the time axis tick clicked on.
     * @param {Number} tickIndex The index of the time axis tick clicked on.
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Resource index
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered for mouse up on an event.
     * @event eventMouseUp
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.EventModel} eventRecord Event record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record
     * @param {Date} date Date at mouse position
     * @param {Scheduler.model.TimeSpan} tick A record which encapsulates the time axis tick clicked on.
     * @param {Number} tickIndex The index of the time axis tick clicked on.
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Resource index
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered for click on an event.
     * @event eventClick
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.EventModel} eventRecord Event record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record
     * @param {Date} date Date at mouse position
     * @param {Scheduler.model.TimeSpan} tick A record which encapsulates the time axis tick clicked on.
     * @param {Number} tickIndex The index of the time axis tick clicked on.
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Resource index
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered for double-click on an event.
     * @event eventDblClick
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.EventModel} eventRecord Event record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record
     * @param {Date} date Date at mouse position
     * @param {Scheduler.model.TimeSpan} tick A record which encapsulates the time axis tick clicked on.
     * @param {Number} tickIndex The index of the time axis tick clicked on.
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Resource index
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered for right-click on an event.
     * @event eventContextMenu
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.EventModel} eventRecord Event record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record
     * @param {Date} date Date at mouse position
     * @param {Scheduler.model.TimeSpan} tick A record which encapsulates the time axis tick clicked on.
     * @param {Number} tickIndex The index of the time axis tick clicked on.
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Resource index
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered when the mouse enters an event bar.
     * @event eventMouseEnter
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.EventModel} eventRecord Event record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record
     * @param {Date} date Date at mouse position
     * @param {Scheduler.model.TimeSpan} tick A record which encapsulates the time axis tick clicked on.
     * @param {Number} tickIndex The index of the time axis tick clicked on.
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Resource index
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered when the mouse leaves an event bar.
     * @event eventMouseLeave
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.EventModel} eventRecord Event record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record
     * @param {Date} date Date at mouse position
     * @param {Scheduler.model.TimeSpan} tick A record which encapsulates the time axis tick clicked on.
     * @param {Number} tickIndex The index of the time axis tick clicked on.
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Resource index
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered for mouse over events when moving into and within an event bar.
     *
     * Note that `mouseover` events bubble, therefore this event will fire while moving from
     * element to element *within* an event bar.
     *
     * _If only an event when moving into the event bar is required, use the {@link #event-eventMouseEnter} event._
     * @event eventMouseOver
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.EventModel} eventRecord Event record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record
     * @param {Date} date Date at mouse position
     * @param {Scheduler.model.TimeSpan} tick A record which encapsulates the time axis tick clicked on.
     * @param {Number} tickIndex The index of the time axis tick clicked on.
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Resource index
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    /**
     * Triggered for mouse out events within and when moving out of an event bar.
     *
     * Note that `mouseout` events bubble, therefore this event will fire while moving from
     * element to element *within* an event bar.
     *
     * _If only an event when moving out of the event bar is required, use the {@link #event-eventMouseLeave} event._
     * @event eventMouseOut
     * @param {Scheduler.view.Scheduler} source This Scheduler
     * @param {Scheduler.model.EventModel} eventRecord Event record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record
     * @param {Date} date Date at mouse position
     * @param {Scheduler.model.TimeSpan} tick A record which encapsulates the time axis tick clicked on.
     * @param {Number} tickIndex The index of the time axis tick clicked on.
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse (in horizontal mode only)
     * @param {Number} index Resource index
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {MouseEvent} event Browser event
     */

    //endregion

    //region Event handling

    getTimeSpanMouseEventParams(eventElement, event) {
        // May have hovered a record being removed / faded out
        const eventRecord = this.resolveEventRecord(eventElement);

        return eventRecord && {
            eventRecord,
            resourceRecord   : this.resolveResourceRecord(eventElement),
            assignmentRecord : this.resolveAssignmentRecord(eventElement),
            eventElement,
            event
        };
    }

    getScheduleMouseEventParams(cellData, event) {
        const resourceRecord = this.isVertical ? this.resolveResourceRecord(event) : this.store.getById(cellData.id);

        return resourceRecord ? { resourceRecord } : null;
    }

    /**
     * Relays keydown events as eventkeydown if we have a selected task.
     * @private
     */
    onElementKeyDown(event) {
        const
            result = super.onElementKeyDown(event),
            me     = this;

        if (me.selectedEvents.length && event.target.closest('.b-sch-event-wrap')) {
            me.trigger(me.scheduledEventName + 'KeyDown', {
                eventRecords      : me.selectedEvents,
                assignmentRecords : me.selectedAssignments,
                event
            });
        }

        return result;
    }

    /**
     * Relays keyup events as eventkeyup if we have a selected task.
     * @private
     */
    onElementKeyUp(event) {
        super.onElementKeyUp(event);

        const me = this;

        if (me.selectedEvents.length) {
            me.trigger(me.scheduledEventName + 'KeyUp', {
                eventRecords      : me.selectedEvents,
                assignmentRecords : me.selectedAssignments,
                event
            });
        }
    }

    //endregion

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
