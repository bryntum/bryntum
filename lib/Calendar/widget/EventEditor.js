import SchedulerEventEditor from '../../Scheduler/view/EventEditor.js';

/**
 * @module Calendar/widget/EventEditor
 */

/**
 * The Calendar's event editor dialog, used internally by the {@link Calendar.feature.EventEdit} feature to
 * display a popup form for creating and editing events. This editor extends the Scheduler's EventEditor with
 * Calendar-specific behavior such as toggling the visibility of time fields when the "All day" toggle is
 * switched, and restoring underlying time data when the toggle is cleared.
 *
 * This class is not intended to be instantiated directly. To customize the editor layout, use the
 * {@link Scheduler.feature.EventEdit#config-items} config of the EventEdit feature. See
 * {@link Calendar.feature.EventEdit} for more information and examples.
 *
 * ```javascript
 * const calendar = new Calendar({
 *     features : {
 *         eventEdit : {
 *             items : {
 *                 // Add a custom field to the event editor
 *                 locationField : {
 *                     type   : 'text',
 *                     name   : 'location',
 *                     label  : 'Location',
 *                     weight : 200
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Calendar.feature.EventEdit} — The feature that manages this editor
 * - {@link Calendar.widget.TimeVisualizingEditor} — Specialized editor with an embedded day view
 * - {@link Scheduler.model.EventModel} — The event model being edited
 *
 * @extends Scheduler/view/EventEditor
 * @abstract
 * @tier community
 *
 * @class-alias Scheduler.view.EventEditor -> Scheduler.view.SchedulerEventEditor
 */
export default class EventEditor extends SchedulerEventEditor {

    //region Config

    static $name = 'EventEditor';

    // Factoryable type name
    static type =  'calendareventeditor';

    static configurable = {
        align : {
            monitorResize : true // Needed because DayView events change size
        }
    };

    //endregion

    updateRecord(record) {
        this.fixTimeFieldVisibility(record.allDay);
        super.updateRecord(record);
    }

    onAllDayChange({ value, userAction }) {
        this.fixTimeFieldVisibility(value, userAction);
    }

    fixTimeFieldVisibility(allDay, fromUI) {
        const
            hideShowMethod  = allDay ? 'hide' : 'show',
            gridColumn      = allDay ? '1/3' : '',
            {
                startDateField,
                startTimeField,
                endDateField,
                endTimeField
            } = this.widgetMap;

        // Times hidden for allDay events
        startTimeField?.[hideShowMethod]();
        endTimeField?.[hideShowMethod]();
        startDateField && (startDateField.element.style.gridColumn = gridColumn);
        endDateField && (endDateField.element.style.gridColumn = gridColumn);

        // Restore the time fields from the underlying data if the UI checkbox is cleared.
        // If the record was promoted to being allDay, the time portion does not get cleared,
        // just the date getters return snapped values. So the underlying data restores the fields
        // to the originally set start and end times so that the save operation will work as expected.
        if (!allDay && fromUI) {
            startDateField && (startDateField.value = startTimeField.value = this.record.getData('startDate'));
            endDateField && (endDateField.value = endTimeField.value = this.record.getData('endDate'));
        }
    }

    onFocusOut() {
        super.onFocusOut(...arguments);
        this.owner = this.initialConfig.owner;
    }
}

// Register this widget type with its Factory
EventEditor.initClass();
