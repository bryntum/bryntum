import Base from '../../../Core/Base.js';
import ArrayHelper from '../../../Core/helper/ArrayHelper.js';
import SchedulerEventSelection from '../../../Scheduler/view/mixin/EventSelection.js';
import GlobalEvents from '../../../Core/GlobalEvents.js';

/**
 * @module Calendar/view/mixin/EventSelection
 */

/**
 * Mixin that tracks event selection by clicking on one or more events in the calendar. It manages a collection of
 * selected events and keeps the UI in sync, applying or removing the selected CSS class on event elements as the
 * selection changes. The mixin fires a {@link #event-selectionChange} event whenever events are selected or
 * deselected, allowing application code to respond to user selection gestures.
 *
 * ```javascript
 * const calendar = new Calendar({
 *     listeners : {
 *         selectionChange({ selection }) {
 *             console.log('Selected events:', selection.map(e => e.name));
 *         }
 *     }
 * });
 *
 * // Programmatic selection
 * calendar.selectedEvents = [calendar.eventStore.first];
 * ```
 *
 * @mixin
 * @extends Scheduler/view/mixin/EventSelection
 *
 * @class-alias Scheduler.view.mixin.EventSelection -> Scheduler.view.mixin.SchedulerEventSelection
 */
export default Target => class EventSelection extends SchedulerEventSelection(Target || Base) {
    static $name = 'EventSelection';

    //region Hidden configs

    /**
     * @hideconfigs eventAssignHighlightCls
     */

    /**
     * @hideevents eventSelectionChange, assignmentSelectionChange
     */

    /**
     * @hideproperties selectedAssignments
     */

    /**
     * @hidefunctions deselectAssignment, deselectAssignments, isAssignmentSelected, selectAssignment, selectAssignments
     */

    //endregion

    static configurable = {
        /**
         * Configure as `false` to preserve selection when clicking the empty schedule area.
         * @prp {Boolean}
         * @default
         * @category Selection
         */
        deselectAllOnScheduleClick : true,

        eventSelectedCls : 'b-selected'
    };

    //region Events

    /**
     * Fired any time there is a change to the events selected in the Calendar.
     * @event selectionChange
     * @param {Calendar.view.Calendar} source The Calendar instance.
     * @param {'select'|'deselect'|'update'|'clear'} action One of the actions 'select', 'deselect', 'update',
     * 'clear'
     * @param {Scheduler.model.EventModel[]} selected An array of the Events added to the selection.
     * @param {Scheduler.model.EventModel[]} deselected An array of the Event removed from the selection.
     * @param {Scheduler.model.EventModel[]} selection The new selection.
     */

    //endregion

    normalizeTarget(event) {
        return event.eventRecord;
    }

    updateDeselectAllOnScheduleClick(deselectAllOnScheduleClick) {
        this[deselectAllOnScheduleClick ? 'ion' : 'un']({
            scheduleClick : 'clearEventSelection'
        });
    }

    /**
     * Responds to mutations of the underlying selection Collection.
     * Keeps the UI synced, selectionChange event is fired when `me.silent` is falsy.
     * @private
     */
    onSelectedCollectionChange({ added, removed }) {
        const
            me         = this,
            selection  = me.selectedCollection,
            selected   = added || [],
            deselected = removed || [];

        me.updateSelected();

        if (!me.silent) {
            const action = (selection.count > 0)
                ? ((selected.length > 0 && deselected.length > 0)
                    ? 'update'
                    : (selected.length > 0
                        ? 'select'
                        : 'deselect'))
                : 'clear';

            me.trigger('selectionChange', {
                action,
                selection : selection.values,
                selected,
                deselected
            });
        }
    }

    onCalendarStoreChange({ action, records }) {
        // Deselect on remove, not load.
        // Calendar can load and discard many time periods during navigation.
        // Only events which are actually removed become unselected.
        if (action === 'remove') {
            this.selectedCollection.remove(...records);
        }
        super.onCalendarStoreChange?.(...arguments);
    }

    onEventIdChange(event) {
        const { oldValue, value } = event;

        // If we had registered an event under the old id, we need to update the id index to use the new id
        if (this.selectedCollection.includes(oldValue)) {
            this.selectedCollection.changeId(oldValue, value);
        }
        super.onEventIdChange(event);
    }

    /**
     * Deselects all {@link Scheduler.model.EventModel events}.
     * @category Selection
     */
    clearEventSelection() {
        this.selectedCollection.clear();
    }

    /**
     * The {@link Scheduler.model.EventModel events} which are selected.
     * @member {Scheduler.model.EventModel[]}
     * @category Selection
     */
    get selectedEvents() {
        return this.selectedCollection.values;
    }

    set selectedEvents(events) {
        events = ArrayHelper.asArray(events);

        // Replace the entire selected collection with the new record set
        this.selectedCollection.splice(0, this.selectedCollection.count, events);
    }

    /**
     * Returns `true` if the {@link Scheduler.model.EventModel event} is selected.
     * @param {Scheduler.model.EventModel} event The event
     * @returns {Boolean} Returns `true` if the event is selected
     * @category Selection
     */
    isEventSelected(event) {
        return this.selectedCollection.includes(event);
    }

    /**
     * Selects the passed {@link Scheduler.model.EventModel event} *if it is not selected*.
     * @param {Scheduler.model.EventModel} event The event to select
     * @param {Boolean} [preserveSelection] Pass `true` to preserve any other selected events
     * @category Selection
     */
    select(event, preserveSelection = false) {
        this.selectEvent(event, preserveSelection);
    }

    /**
     * Selects the passed {@link Scheduler.model.EventModel event} *if it is not selected*.
     * @param {Scheduler.model.EventModel} event The event select
     * @param {Boolean} [preserveSelection] Pass `true` to preserve any other selected events
     * @category Selection
     */
    selectEvent(event, preserveSelection = false) {
        const { selectedCollection } = this;

        // If the event is already selected, this is a no-op.
        // In this case, selection must not be cleared even in the absence of preserveSelection
        if (!this.isEventSelected(event) && this.isEventSelectable(event) !== false) {
            preserveSelection ? selectedCollection.add(event) : selectedCollection.splice(0, selectedCollection.count, event);
        }
    }

    /**
     * Deselects the passed {@link Scheduler.model.EventModel event}*if it is selected*.
     * @param {Scheduler.model.EventModel} event The event to deselect.
     * @category Selection
     */
    deselect(event) {
        this.deselectEvent(event);
    }

    /**
     * Deselects the passed {@link Scheduler.model.EventModel event} *if it is selected*.
     * @param {Scheduler.model.EventModel} event The event to deselect.
     * @category Selection
     */
    deselectEvent(event) {
        if (this.isEventSelected(event)) {
            this.selectedCollection.remove(event);
        }
    }

    /**
     * Adds {@link Scheduler.model.EventModel events} to the selection.
     * @param {Scheduler.model.EventModel[]} events Events to be selected
     * @category Selection
     */
    selectEvents(events) {
        this.selectedCollection.add(events.filter(event => this.isEventSelectable(event) !== false));
    }

    /**
     * Removes {@link Scheduler.model.EventModel events} from the selection.
     * @param {Scheduler.model.EventModel[]} events Events to be deselected
     * @category Selection
     */
    deselectEvents(events) {
        this.selectedCollection.remove(events);
    }

    /**
     * Mouse listener to update selection.
     * @private
     */
    onEventSelectionClick(clickedRecord) {
        // Multi selection: CTRL means preserve selection, just add or remove the event.
        // Single selection: CTRL deselects already selected event
        if (this.isEventSelected(clickedRecord)) {
            if (GlobalEvents.ctrlKeyDown) {
                this.deselectEvent(clickedRecord);
            }
        }
        else {
            this.selectEvent(clickedRecord,  this.multiEventSelect && GlobalEvents.ctrlKeyDown);
        }
    }

    /**
     * Navigation listener to update selection.
     * @private
     */
    onEventNavigate({ event, item }) {
        // Navigating out of the navigation domain leaves selection unchanged.
        if (item) {
            const eventRecord = this.activeView.getEventRecord(item);

            if (eventRecord) {
                // Normally, mousedown on a selected record with no modifier deselects.
                // Context menu should never deselect.
                if (event.button === 2 && this.isEventSelected(eventRecord)) {
                    return;
                }

                this.onEventSelectionClick(eventRecord);
            }
            // Clear selection when clicking outside an event
            else if (this.deselectAllOnScheduleClick) {
                this.clearEventSelection();
            }
        }
    }

    // we do not need this class to participate in widget CSS classes
    get widgetClass() {}

};
