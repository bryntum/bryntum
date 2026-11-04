import CalendarFeature from './CalendarFeature.js';
import SchedulerEventEdit from '../../Scheduler/feature/EventEdit.js';
import '../widget/EventEditor.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import '../../Core/widget/SlideToggle.js';
import Scroller from '../../Core/helper/util/Scroller.js';
import AsyncHelper from '../../Core/helper/AsyncHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

/**
 * @module Calendar/feature/EventEdit
 */

const isCalendar = w => w.isCalendar;

/**
 * Feature that displays a popup containing fields for editing event data.
 *
 * To customize its contents you can:
 *
 * * Reconfigure built-in widgets by providing override configs in the {@link Scheduler.feature.base.EditBase#config-items} config.
 * * Change the date format of the date & time fields: {@link Scheduler.feature.base.EditBase#config-dateFormat} and {@link Scheduler.feature.base.EditBase#config-timeFormat}
 * * Configure provided fields in the editor and add your own in the {@link Scheduler.feature.base.EditBase#config-items} config.
 * * Remove fields related to recurring events configuration (such as `recurrenceCombo`) by setting {@link Scheduler.feature.mixin.RecurringEventEdit#config-showRecurringUI} config to `false`.
 * * Advanced: Reconfigure the whole editor widget using {@link Scheduler.feature.EventEdit#config-editorConfig}
 *
 * For more info on customizing the event editor, please see [Customize event editor](#Calendar/guides/customization/eventedit.md) guide.
 *
 * {@inlineexample Calendar/feature/EventEdit.js}
 *
 * ## Using the TimeVisualizingEditor
 *
 * The default event editor can be replaced with a {@link Calendar.widget.TimeVisualizingEditor}, a specialized
 * editor that includes an embedded day view showing the event being edited in context of the day's time span.
 * This allows users to visually adjust the event's time by dragging it within the day, while simultaneously
 * editing other event fields in the form.
 *
 * The time visualizer is only shown for intra-day events; day-spanning events use the standard editor layout.
 *
 * To enable it, configure the {@link #config-editorConfig} with `type : 'timevisualizingeditor'`:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     features : {
 *         eventEdit : {
 *             editorConfig : {
 *                 type           : 'timevisualizingeditor',
 *                 maximizable    : true,
 *                 timeVisualizer : {
 *                     hourHeight : 30
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * {@inlineexample Calendar/widget/TimeVisualizingEditor.js}
 *
 * This feature is **enabled** by default.
 *
 * ## Useful configs
 *
 * | Config                       | Description                            |
 * |------------------------------|----------------------------------------|
 * | {@link #config-items}        | Editor field definitions               |
 * | {@link #config-triggerEvent} | DOM event that opens the editor        |
 * | {@link #config-editorConfig} | Additional config for the editor popup |
 *
 * ## See also
 *
 * - {@link Calendar.widget.EventEditor} — The editor dialog widget used by this feature
 * - {@link Calendar.widget.TimeVisualizingEditor} — Alternative editor with embedded day view
 * - {@link Scheduler.model.EventModel} — The event model being edited
 *
 * @demo Calendar/eventedit
 *
 * @extends Scheduler/feature/EventEdit
 * @classtype eventEdit
 * @feature
 * @tier community
 *
 * @class-alias Scheduler.feature.EventEdit -> Scheduler.feature.SchedulerEventEdit
 */
export default class EventEdit extends SchedulerEventEdit {

    static $name = 'EventEdit';

    static tier = 'community';

    static type = 'eventEdit';

    // Extends the Scheduler feature, so without this it registers into the Grid family's factory
    // and replaces Scheduler's registration. A getter, not a field: fields initialize after
    // setupType may already have run.
    static featureFactory = CalendarFeature;

    static configurable = {
        editorConfig : {
            type  : 'calendareventeditor',
            items : {
                resourceField : {
                    label          : 'L{Calendar}',
                    showEventColor : true
                },
                allDay : {
                    type              : 'slidetoggle',
                    cls               : 'b-match-label',
                    name              : 'allDay',
                    weight            : 250,
                    text              : 'L{All day}',
                    internalListeners : {
                        change : 'up.onAllDayChange'
                    }
                }
            }
        }
    };

    async onDragCreateEnd({ eventRecord, resourceRecord }) {
        eventRecord._dragCreated = true;
        await this.editNewlyCreatedEvent(eventRecord, resourceRecord);
        eventRecord._dragCreated = null;
    }

    onEventAutoCreated({ eventRecord }) {
        this.editNewlyCreatedEvent(eventRecord);
    }

    editNewlyCreatedEvent(eventRecord, resourceRecord) {
        if (!this.disabled) {
            // The Drag feature adds the record so we must set the flag here.
            eventRecord.isCreating = true;

            // Implementations may be async, so the return value must always be propagated.
            // also, set the `stmCapture` argument to `false` do disable the STM capturing mechanism
            // calendar is performing its own handling
            return this.editEvent(eventRecord, resourceRecord, null, false);
        }
    }

    /**
     * Opens an editor for the passed event. This function is exposed on Calendar and can be called as
     * `calendar.editEvent()`.
     *
     * If the event is not present in the `eventStore`, the event will be added so that it becomes
     * visible in the UI. The editor will then shows a "Cancel" button which removes the event when
     * clicked to abort a "New Event" operation.
     * @method editEvent
     * @param {Scheduler.model.EventModel} eventRecord Event to edit
     * @param {Scheduler.model.ResourceModel} [resourceRecord] Not used. Inherited from Scheduler.
     * @param {HTMLElement} [element] Element to anchor editor to (defaults to events element)
     * @async
     * @on-owner
     */

    // editEvent is the single entry point in the base class.
    // Subclass implementations of the action may differ, so are implemented in doEditEvent
    async doEditEvent(eventRecord, resourceRecord, element) {
        const
            me             = this,
            { client }     = me,
            wasReadOnly    = Boolean(me.readOnly),
            { eventStore } = client,
            { startDate, endDate } = eventRecord;

        // eventSource is the descendant view that is being interacted with.
        // See Calendar#onViewCatchAll
        // activeSubView is the lowest level active view in the currently visible view in the
        // card layout of the viewContainer.
        // eventSource might be a descendant of the activeView.
        let view       = client.eventSource || client.activeSubView;

        // A Scheduler mode which carries the engine aware task editor owns editing of its own events.
        // Resolved from the active view at call time, so that a Calendar with several Scheduler modes
        // always edits in the one the user is looking at.
        if (view.isSchedulerBase && view.features.taskEdit) {
            return me.editViaTaskEdit(view, view, eventRecord, resourceRecord, element);
        }

        // If we are using a Chronograph project, find an Enterprise tier Scheduler or Gantt which owns that project.
        // If we find one, use its taskEdit feature to edit the event.
        if (eventRecord.isChronoModelMixin) {
            const chronoWidget = bryntum.query(w => (w.isGantt || (w.isSchedulerBase && w.isEnterpriseTier)) && w.project === client.project);

            if (chronoWidget) {
                await eventStore.addAsync(eventRecord);
                // Only a Calendar view has this. The active view may be a Scheduler or a Gantt.
                view.doRefresh?.();
                // editEvent is the entry point both task editors share - Gantt's editTask is a shorthand for it, the
                // enterprise tier Scheduler's TaskEdit has no editTask
                return me.editViaTaskEdit(chronoWidget, view, eventRecord, resourceRecord, element);
            }
        }

        // If we get this event from a Scheduler view, use superclass's edit process.
        if (view.isSchedulerBase) {
            me.client = view;
            await super.doEditEvent(...arguments);
            me.client = client;
            return;
        }

        // If we get this event from a non-Calendar view, or the view is cell editing, ignore it.
        if (!view.isCalendarMixin || view.features?.cellEdit?.isEditing) {
            return;
        }

        if (eventRecord.startDate && eventRecord.endDate &&
            !DateHelper.intersectSpans(
                startDate,
                endDate,
                view.startDate,
                view.endDate)) {
            client.date = eventRecord.startDate;
        }

        // If we've created in a DayView, and we are editing an inter day event, the responsible
        // view is the DayView's alldayEvents row **if there is one, and it's being used**.
        if (view.allDayEvents && view.isInterDayEvent(eventRecord) && view.showAllDayHeader) {
            view = view.allDayEvents;
        }

        // Occurrences are *never* added to the eventStore, but any other event being edited,
        // make sure it's in and set the `isCreating` flag to show the Cancel UI.
        if (!eventRecord.isOccurrence) {
            let added;
            if (!eventStore.includes(eventRecord)) {
                eventStore.add(eventRecord);
                added = true;
            }

            if (added || eventRecord._dragCreated) {
                // We need the view to contain the event's element, not the drag-create proxy.
                // So wait for refresh for a max of 100ms, if the refresh has not triggered, force the issue.
                await view.afterRefresh({ forceRefresh : true });

                // Wait (For a max of 3 seconds) for the tentative event to be cleaned up
                await AsyncHelper.waitFor(() => !view.eventContentElement?.querySelector('.b-cal-tentative-event'), -3000);

                // If the view was destroyed during waiting, we cannot show the editor
                if (view.isDestroyed) {
                    return;
                }
            }
        }

        // Special handling if editing from an overflow popup
        const
            { _overflowPopup } = view,
            activeDate         = view.getDateFromElement(element);

        // Get the element for the date into which the element was rendered.
        // AgendaView can render multiple elements for day-spanning events
        // so we must attach to the correct one.
        let fromOverflow = _overflowPopup?.isVisible,
            eventElement = fromOverflow ? _overflowPopup.getEventElement(eventRecord) : view.getEventElement(eventRecord, activeDate);

        if (fromOverflow) {
            if (eventElement) {
                fromOverflow = false;
            }
            else {
                eventElement = _overflowPopup.getEventElement(eventRecord);
            }
        }

        // Call Calendar template method
        if (eventRecord.isCreating) {
            client.onEventCreated?.(eventRecord);
        }

        // If called from eventlist
        if (!eventElement && view.isEventList) {
            eventElement = view?.rowManager?.getRowFor(eventRecord)?.element;
        }

        // If editing triggered from overflow popup, ensure that the eventElement is focused.
        if (fromOverflow) {
            eventElement.focus();
        }
        else if (eventElement) {
            const
                visibleRect = DomHelper.isInView(eventElement),
                needsScroll = (!visibleRect || (visibleRect.height < 100 && eventElement.offsetHeight > Math.ceil(visibleRect.height)) || visibleRect.width < eventElement.getBoundingClientRect().width);

            if (needsScroll) {
                // If we found a rendered element, ensure the top 100 px and full width is visible in all
                // scroll viewports.
                // Sometimes there are two encapsulating scroll elements, one for horizontal
                // and one for vertical. For example ResourceView with multiple dayViews.
                // Static scrollIntoView searches all ancestors.
                await Scroller.scrollIntoView(eventElement, ObjectHelper.assign({}, view.defaultScrollOptions, {
                    focus     : true,
                    maxHeight : 100
                }));
            }
            else {
                eventElement.focus({ preventScroll : true });
            }
        }
        // If no element found, then we have to ask the view to navigate in time to encompass that event
        else {
            // If it's a single day event on a hidden, non-working day, show it centered.
            // align : { target : true } means centered.
            if (!view.isInterDayEvent(eventRecord) && (!startDate || view.hiddenNonWorkingDays[startDate.getDay()])) {
                me.internalShowEditor(eventRecord, null, {
                    target : true
                });
                return;
            }

            // This test is meant to prevent scrolling the element into the view if we dragcreate event and scroll the
            // view in the process. If we're creating event, then check if event was already added. If event was not
            // created allow scrolling - we haven't dragcreated event and should try to scroll to the element
            if (startDate && (!eventRecord.isCreating || !eventRecord._dragCreated)) {
                // Ensure we have an in-view element to align to - data change response is async.
                // scrollTo refreshes if the element is not present
                await view.scrollTo(eventRecord);
            }

            // scrollTo might have to refresh to create the target.
            eventElement = view.getEventElement(eventRecord);
        }

        // If event element is missing and we render days (month, year), try to align editor to the date
        if (!eventElement && !element && view.isDayCellRenderer) {
            eventElement = view.getCell(eventRecord.startDate);
        }

        // Async code which waits for the data layer to complete means we can arrive here with the
        // UI destroyed, or in a different state to when we started, so the element to align to may
        // not exist. Just return if so.
        if (me.isDestroyed || !eventElement) {
            return;
        }

        me.internalShowEditor(eventRecord, null, {
            target         : eventElement || element,
            allowTargetOut : view.isAnimating
        });

        // If the edit start was not vetoed, honour a view's readOnly state if it's different to what we have.
        if (me.editor?.isVisible && ('readOnly' in view) && view.readOnly !== wasReadOnly) {
            me.readOnly = view.readOnly;

            // Reset the readOnly state to the original value on editor hide
            me.editor.ion({
                hide : () => me.readOnly = wasReadOnly,
                once : true
            });
        }

        // Only on first show do we ignore clipping.
        // If target is scrolled out of view, editor must hide.
        if (me.editor?.lastAlignSpec) {
            me.editor.lastAlignSpec.allowTargetOut = false;
        }
    }

    /**
     * Routes an edit to the engine aware task editor of `taskEditOwner`, resolving the element to align the
     * editor to from `view`, which is the view the user is interacting with.
     * @param {Scheduler.view.SchedulerBase|Gantt.view.Gantt} taskEditOwner The widget whose `taskEdit` feature edits.
     * @param {Core.widget.Widget} view The active view, used to resolve the event element.
     * @param {Scheduler.model.EventModel} eventRecord The event to edit.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource the event is being edited for.
     * @param {HTMLElement} [element] Element to align the editor to.
     * @private
     */
    async editViaTaskEdit(taskEditOwner, view, eventRecord, resourceRecord, element) {
        const
            { eventStore } = this.client,
            _overflowPopup = view?._overflowPopup;

        if (_overflowPopup?.isVisible) {
            element = _overflowPopup.getEventElement(eventRecord);
        }

        // Access the element using the current view's API.
        if (!element) {
            if (view.isSchedulerBase) {
                element = view.getElementFromEventRecord(eventRecord, resourceRecord);

                // Already being edited (for example from a 'dragCreateEnd' event).
                // `record` outlives the edit, so an edit must actually be in progress.
                const { taskEdit } = view.features;

                if (taskEdit?.isEditing && taskEdit.record === eventRecord) {
                    return;
                }
            }
            else if (eventRecord.isCreating) {
                eventStore.add(eventRecord);
                // We need the view to contain the event's element, not the drag-create proxy.
                // So wait for refresh for a max of 100ms, if the refresh has not triggered, force the issue.
                await view.afterRefresh({ forceRefresh : true });

                // Wait (For a max of 3 seconds) for the tentative event to be cleaned up
                await AsyncHelper.waitFor(() => !view.eventContentElement?.querySelector('.b-cal-tentative-event'), -3000);

                // If the view was destroyed during waiting, we cannot show the editor
                if (view.isDestroyed) {
                    return;
                }
                element = view.getEventElement(eventRecord, eventRecord.startDate);
            }
            else {
                element = view.getEventElement(eventRecord, view.date);
            }
        }

        // Always hook the closest owning widget as our owner because there may be intervening
        // focused widgets between the Calendar (our default), and us.
        // For example, the all day row of a DayView may show an OverflowPopup. We have
        // to be owned by the OverflowPopup so that our owner chain is correct.
        // The delegated edit may exit before firing beforeTaskEdit - for example when it is vetoed or the
        // feature is disabled - so the listener must be removed whatever happens, or it would retarget the
        // owner of a later edit.
        let taskEditor;

        const detacher = taskEditOwner.ion({
            beforeTaskEdit : ({ editor }) => {
                taskEditor = editor;

                editor.owner = _overflowPopup?.isVisible ? _overflowPopup : view;
            },
            once : true
        });

        try {
            // Delegate to the feature, not to the widget's public editEvent. The Calendar's own editEvent
            // wrapper has already run the shared lifecycle, and going through the widget would fire a second,
            // relayed beforeEventEdit from the mode.
            // The fourth argument, stmCapture, is not used by the mode's own TaskEdit feature, so not passed.
            return await taskEditOwner.features.taskEdit.editEvent(eventRecord, resourceRecord, element);
        }
        finally {
            if (taskEditor) {
                taskEditor.owner = taskEditOwner;
            }
            detacher();
        }
    }

    async onSaveClick() {
        const
            me              = this,
            { eventRecord } = me,
            { isCreating }  = eventRecord.meta;

        if (me.isValid) {
            eventRecord.isCreating = false;
        }

        // So that resetting editing context doesn't remove the record
        const saved = await super.onSaveClick(...arguments);

        if (isCreating && saved) {
            me.eventStore.added.add(eventRecord);

            if (!me.eventStore.usesSingleAssignment) {
                me.assignmentStore.added.add(eventRecord.assignments);
            }

            me.client.crudManager?.onCrudStoreChange();
        }
    }

    internalShowEditor() {
        const
            {
                client,
                editor,
                startTimeField,
                endTimeField
            }                 = this,
            calendar          = client.closest(isCalendar) || client,
            autoCreate        = calendar.activeView?.autoCreate ?? (calendar.autoCreate || client.constructor.configurable.autoCreate),
            step              = autoCreate?.step,
            { activeSubView } = calendar,
            _overflowPopup    = activeSubView?._overflowPopup;

        // In case the tooltip is visible, we must hide it.
        // This reverts focus so that we pick up focusIn from the event.
        (client.isSchedulerBase ? client.calendar : client).features.eventTooltip?._tooltip?.hide();

        // Always hook the closest owning widget as our owner because there may be intervening
        // focused widgets between the Calendar (our default), and us.
        // For example, the all day row of a DayView may show an OverflowPopup. We have
        // to be owned by the OverflowPopup so that our owner chain is correct.
        editor.owner = _overflowPopup?.isVisible ? _overflowPopup : activeSubView;

        if (super.internalShowEditor(...arguments) === false) {
            // Editing was vetoed
            editor.owner = editor.initialConfig.owner;
            return;
        }

        if (step) {
            if (startTimeField && !startTimeField.initialConfig.step) {
                startTimeField.step = step;
            }

            if (endTimeField && !endTimeField.initialConfig.step) {
                endTimeField.step = step;
            }
        }
    }

    // calendar drag/auto create is different enough from scheduler's, so we just override this method
    // to empty function to opt-out of the STM capture mechanism
    async finalizeStmCapture(saved) {
    }
}

// Register this feature type with its Factory
CalendarFeature.register(EventEdit.type, EventEdit);
