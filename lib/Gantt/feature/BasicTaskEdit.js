import EventEdit from '../../Scheduler/feature/EventEdit.js';
import GanttFeature from './GanttFeature.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import TimeSpan from '../../Scheduler/model/TimeSpan.js';
import '../../Core/widget/NumberField.js';
import '../../Core/widget/DurationField.js';

DomHelper.loadStylesheet('Gantt/feature/BasicTaskEdit.css');

/**
 * @module Gantt/feature/BasicTaskEdit
 */

/**
 * A lightweight alternative to the {@link Gantt/feature/TaskEdit} feature. Instead of the tabbed
 * {@link Gantt/widget/TaskEditor}, this feature reuses the Scheduler {@link Scheduler/feature/EventEdit} popup to
 * present a single, compact form with the most commonly edited task fields: name, start, finish, duration and
 * percent done.
 *
 * **Note**: This feature does not support Revisions feature.
 *
 * It is intended for applications that want a quick "basic" task editor without the predecessors, successors,
 * resources, advanced and notes tabs of the full editor.
 *
 * {@inlineexample Gantt/feature/BasicTaskEdit.js}
 *
 * ## Enabling the feature
 *
 * This feature is **enabled** by default on the Community tier, which has no {@link Gantt/feature/TaskEdit} feature,
 * so there is nothing to configure.
 *
 * On the Business and Enterprise tiers it is **disabled** by default and conflicts with the default
 * {@link Gantt/feature/TaskEdit} feature (both react to `eventdblclick`). To use it, disable `taskEdit` and enable
 * `basicTaskEdit`:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     features : {
 *         taskEdit      : false,
 *         basicTaskEdit : true
 *     }
 * });
 * ```
 *
 * ## Built-in widgets
 *
 * | Widget ref         | Type                              | Weight | Description                                   |
 * |--------------------|-----------------------------------|--------|-----------------------------------------------|
 * | `nameField`        | {@link Core.widget.TextField}     | 100    | Edit the task name                            |
 * | `startDateField`   | {@link Core.widget.DateField}     | 200    | Edit the task start date                      |
 * | `endDateField`     | {@link Core.widget.DateField}     | 300    | Edit the task finish date                     |
 * | `durationField`    | {@link Core.widget.DurationField} | 400    | Edit the task duration                        |
 *
 * The bottom toolbar contains `saveButton`, `deleteButton` and `cancelButton`, inherited from
 * {@link Scheduler/feature/EventEdit}.
 *
 * Adding, removing and customizing fields works exactly as documented for {@link Scheduler/feature/EventEdit} - use
 * the {@link Scheduler.feature.base.EditBase#config-items} config to merge in changes. A field added this way is
 * loaded from and saved back to the task record using its `name`, so declare the field on the task store first:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     project : {
 *         taskStore : {
 *             fields : ['complexity']
 *         }
 *     },
 *
 *     features : {
 *         basicTaskEdit : {
 *             items : {
 *                 // Relabel a provided field
 *                 nameField : {
 *                     label : 'Task'
 *                 },
 *                 // Add a field for the custom `complexity` task field
 *                 complexityField : {
 *                     type   : 'combo',
 *                     name   : 'complexity',
 *                     label  : 'Complexity',
 *                     items  : ['Low', 'Medium', 'High'],
 *                     weight : 150
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * @extends Scheduler/feature/EventEdit
 * @classtype basicTaskEdit
 * @feature
 * @tier community
 * @demo Gantt/basic-task-editor
 */
export default class BasicTaskEdit extends EventEdit {
    static $name = 'BasicTaskEdit';

    static type = 'basicTaskEdit';

    // Registers with GanttFeature rather than the inherited GridFeature factory, so a Grid or
    // Scheduler never resolves this Gantt-only feature. See GridFeature#featureFactory.
    static featureFactory = GanttFeature;

    // On by default at the community tier only, where TaskEdit is not available
    static defaultEnabled = { community : true, business : false, enterprise : false };

    static tier = 'community';

    /**
     * Fires on the owning Gantt before the task editor is shown.
     * @event beforeTaskEditShow
     * @on-owner
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.feature.BasicTaskEdit} taskEdit The feature instance
     * @param {Gantt.model.TaskModel} taskRecord The task about to be shown in the editor
     * @param {Core.widget.Popup} editor The editor
     */

    /**
     * Fires on the owning Gantt before editing a task starts. Return `false` to prevent the editor showing.
     * @event beforeTaskEdit
     * @on-owner
     * @preventable
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.feature.BasicTaskEdit} taskEdit The feature instance
     * @param {Gantt.model.TaskModel} taskRecord The task about to be shown in the editor
     * @param {HTMLElement} taskElement The element which represents the task in the Gantt display
     */

    /**
     * Fires on the owning Gantt before a new task is created. Return `false` to prevent the task being added.
     * @event beforeTaskAdd
     * @on-owner
     * @preventable
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.feature.BasicTaskEdit} taskEdit The feature instance
     * @param {Gantt.model.TaskModel} taskRecord The task about to be added
     * @param {Gantt.model.ResourceModel[]} resourceRecords The resource records for the task (typically empty for
     *     Gantt)
     * @param {Gantt.model.AssignmentModel[]} assignmentRecords The assignment records for the task (typically empty
     *     for Gantt)
     */

    /**
     * Fires on the owning Gantt before a task is saved. Return `false` to prevent the save.
     * @event beforeTaskSave
     * @on-owner
     * @preventable
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The task about to be saved
     * @param {Object} values The new values
     * @param {Core.widget.Popup} [editor] The editor. Only the {@link Gantt.feature.TaskEdit} feature
     *     passes it
     */

    /**
     * Fires on the owning Gantt after a task is saved.
     * @event afterTaskSave
     * @on-owner
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The saved task
     */

    /**
     * Fires on the owning Gantt after the editor is closed by any action - save, delete or cancel.
     * @event afterTaskEdit
     * @on-owner
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {'save'|'delete'|'cancel'} action The action that ended the edit
     * @param {Gantt.model.TaskModel} taskRecord The edited task
     */

    /**
     * Fires on the owning Gantt when task editing is canceled.
     * @event taskEditCanceled
     * @on-owner
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The task that was being edited
     */

    construct(config) {
        super.construct(config);

        if (this.client.hasFeature('taskEdit')) {
            throw new Error('The basicTaskEdit feature conflicts with the taskEdit feature - disable taskEdit (features : { taskEdit : false }) to use basicTaskEdit.');
        }
    }

    static configurable = {
        // Gantt fires `taskdblclick` (not Scheduler's `eventdblclick`). onActivateEditor below bridges the Gantt
        // payload keys (taskRecord/taskElement) to the inherited editEvent.
        triggerEvent    : 'taskdblclick',
        showRecurringUI : false,

        recurringEventsItems : {
            recurrenceCombo      : null,
            editRecurrenceButton : null
        },

        editorConfig : {
            cls         : 'b-basic-task-editor',
            title       : 'L{BasicTaskEdit.editTask}',
            localeClass : this,

            defaults : {
                localeClass : this
            },

            items : {
                nameField : {
                    label  : 'L{name}',
                    weight : 100
                },
                startDateField : {
                    label  : 'L{start}',
                    cls    : 'b-half-width',
                    weight : 200
                },
                endDateField : {
                    label  : 'L{finish}',
                    cls    : 'b-half-width',
                    weight : 300
                },
                durationField : {
                    type   : 'duration',
                    label  : 'L{duration}',
                    name   : 'fullDuration',
                    cls    : 'b-half-width',
                    weight : 500
                },

                // Remove the EventEdit fields that do not apply to Gantt tasks
                resourceField  : null,
                startTimeField : null,
                endTimeField   : null,
                colorField     : null
            }
        }
    };

    // EventEdit's pluginConfig chains the Scheduler hooks (onEventEnterKey / populateEventMenu) and assigns
    // `editEvent`. Gantt instead dispatches onTaskEnterKey / populateTaskMenu and exposes `editTask`, so chain those.
    static get pluginConfig() {
        return {
            after  : ['populateTaskMenu', 'onTaskEnterKey'],
            assign : ['editTask']
        };
    }

    //region Event names

    // Override the base editor event names to fire the Gantt task-scoped variants documented above.
    get beforeEventEditShowEventName() {
        return 'beforeTaskEditShow';
    }
    get beforeEventAddEventName() {
        return 'beforeTaskAdd';
    }
    get beforeEventEditEventName() {
        return 'beforeTaskEdit';
    }
    get beforeEventSaveEventName() {
        return 'beforeTaskSave';
    }
    get afterEventSaveEventName() {
        return 'afterTaskSave';
    }
    get afterEventEditEventName() {
        return 'afterTaskEdit';
    }
    get eventEditCanceledEventName() {
        return 'taskEditCanceled';
    }

    //endregion

    // Rename the inherited entity-scoped payload keys (eventRecord/eventElement/eventEdit) to the Gantt task
    // vocabulary (taskRecord/taskElement/taskEdit) before the public task events fire. 'Edit' renames the
    // feature-instance key (eventEdit -> taskEdit), not an entity record.
    composeEditEventData(data) {
        const result = { ...data };

        for (const key of ['Record', 'Element', 'Edit']) {
            if (`event${key}` in result) {
                result[`task${key}`] = result[`event${key}`];
                delete result[`event${key}`];
            }
        }

        return result;
    }

    /**
     * Shows the {@link Gantt/feature/BasicTaskEdit} editor for the passed task. Exposed on the Gantt instance and
     * callable as `gantt.editTask()`.
     * @param {Gantt.model.TaskModel} taskRecord Task to edit
     * @param {HTMLElement} [element] The task element
     * @returns {Promise} Promise which resolves after the editor is shown
     * @on-owner
     * @async
     */
    editTask(taskRecord, element) {
        return this.editEvent(taskRecord, null, element);
    }

    onTaskEnterKey({ taskRecord }) {
        this.editTask(taskRecord);
    }

    populateTaskMenu({ taskRecord, selection, items }) {
        const canEdit = !taskRecord.readOnly && !this.client.readOnly;

        // Task without project is a transient record in a display store and not meant to be manipulated
        if (selection.length <= 1 && taskRecord.project) {
            items.editTask = {
                text        : 'L{Gantt.Edit}',
                localeClass : this.client,
                cls         : 'b-separator',
                icon        : 'b-icon b-icon-edit',
                weight      : 100,
                hidden      : !canEdit,
                onItem      : () => this.editTask(taskRecord)
            };
        }
    }

    // Gantt is a tree (no resource rows), so the Scheduler `scrollResourceEventIntoView` used by EventEdit#doEditEvent
    // does not exist. Override to scroll the task bar into view using the Gantt `scrollTaskIntoView` API instead.
    async doEditEvent(eventRecord, resourceRecord, element = null) {
        const
            me            = this,
            { scheduler } = me;

        if (eventRecord.isCreating) {
            // Ensure temporal data fields are ready when the editor is shown
            TimeSpan.prototype.normalize.call(eventRecord);
        }

        // If an element is supplied (e.g. from the double-click) or the task has no schedule yet, no scrolling needed.
        if (element || eventRecord.isCreating || !eventRecord.isScheduled) {
            return me.internalShowEditor(eventRecord, resourceRecord, element ? { target : element } : null);
        }

        // Bring the task bar into view before showing the editor.
        await scheduler.scrollTaskIntoView(eventRecord, {
            animate    : true,
            edgeOffset : 0
        });

        if (!scheduler.isDestroyed) {
            await me.internalShowEditor(eventRecord, resourceRecord);

            if (!scheduler.isDestroyed) {
                scheduler.removeCls('b-event-editor-editing');
            }
        }
    }

    // Bridge Gantt's `taskdblclick` payload (taskRecord/taskElement) to the inherited editEvent, which the base
    // EventEdit#onActivateEditor reads as eventRecord/eventElement.
    onActivateEditor({ taskRecord, taskElement, domEvent }) {
        const { ignoreSelector } = this;

        if (!ignoreSelector || !domEvent.target?.closest(ignoreSelector)) {
            this.editEvent(taskRecord, null, taskElement);
        }
    }

    // Hook called from EventEdit#getEditor after the editor widget has been created.
    // Used to wire up the duration field so editing it drives the schedule.
    onEditorConstructed(editor) {
        super.onEditorConstructed?.(editor);

        this.durationField?.ion({ change : 'onDurationChange', thisObj : this });
    }

    internalLoadRecord(eventRecord, resourceRecord) {
        const me = this;

        // Reset which scheduling field the user last touched whenever a new record is loaded.
        me.scheduleEdit = null;

        super.internalLoadRecord(eventRecord, resourceRecord);

        // Honor TaskModel#isEditable - e.g. on auto-scheduled summary tasks finish/duration/percentDone are not
        // editable, so disable those fields (and re-enable for normal leaf tasks). Mirrors GeneralTab#toggleFieldsDisabled.
        if (eventRecord) {
            const { nameField, startDateField, endDateField, durationField } = me;

            nameField && (nameField.disabled = eventRecord.isEditable('name') === false);
            startDateField && (startDateField.disabled = eventRecord.isEditable('startDate') === false);
            endDateField && (endDateField.disabled = eventRecord.isEditable('endDate') === false);
            durationField && (durationField.disabled = eventRecord.isEditable('fullDuration') === false);
        }
    }

    // EditBase handles start/end date changes (keeping duration when start changes). We additionally track which
    // scheduling field the user touched last so `updateRecord` can send a minimal, non-conflicting set to the engine.
    onDatesChange(event) {
        super.onDatesChange(event);

        // Ignore the finish change we trigger from onDurationChange - that is a duration edit, not a date edit, and
        // must not overwrite the tracked scheduling intent.
        if (!this.loadingRecord && !this.syncingFinish) {
            // Changing the start keeps the (working-time) duration; changing the finish sets explicit dates.
            this.scheduleEdit = event.source.ref.startsWith('start') ? 'startKeepDuration' : 'dates';
        }
    }

    onDurationChange({ value }) {
        const
            me = this,
            { startDateField, endDateField } = me;

        // Skip while loading - the field value already reflects the record and the finish date is correct.
        if (me.loadingRecord || !value || !startDateField?.value || !endDateField) {
            return;
        }

        me.scheduleEdit = 'duration';

        // Move the finish for immediate (calendar-unaware) feedback; the engine recomputes the real finish from
        // start + duration on commit. Guard so this endDate change is not mistaken for a user date edit.
        me.syncingFinish = true;
        endDateField.value = DateHelper.add(startDateField.value, value.magnitude, value.unit);
        me.syncingFinish = false;
    }

    // Persist a minimal, non-conflicting set of *scheduling* fields so the engine resolves the rest using the task
    // calendar (working time) - sending startDate + endDate + duration together would over-determine the schedule.
    // Every other editor value is passed straight through, so custom fields added through `items` are saved too.
    updateRecord(record) {
        const
            { values, scheduleEdit }                      = this,
            { startDate, endDate, fullDuration, ...data } = values;

        if (scheduleEdit === 'dates') {
            // User edited the finish - honor the explicit start/finish and let the engine derive the duration.
            data.startDate = startDate;
            data.endDate   = endDate;
        }
        else if (scheduleEdit === 'startKeepDuration') {
            // User moved the start - drive by start + duration so the engine recomputes the finish.
            data.startDate    = startDate;
            data.fullDuration = fullDuration;
        }
        else if (scheduleEdit === 'duration') {
            // User edited the duration - keep the existing start, engine recomputes the finish.
            data.fullDuration = fullDuration;
        }
        // Else: user edited neither dates nor duration, so do not re-assert startDate (which could introduce a
        // spurious startnoearlier constraint when autoSetConstraints is on).

        return record.set(data);
    }
}

BasicTaskEdit.initClass();
