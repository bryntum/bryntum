import SchedulerFeature from '../SchedulerFeature.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import Config from '../../../Core/Config.js';
import Objects from '../../../Core/helper/util/Objects.js';

/**
 * @module Scheduler/feature/base/EditBase
 */

const
    DH             = DateHelper,
    productFeaturesToDisable = {
        calendar  : ['drag'],
        scheduler : ['eventResize', 'eventDrag', 'eventDragCreate']
    };

/**
 * Base class for EventEdit. Provides shared logic for event editing dialogs including field management, date handling,
 * and feature interaction during edits. Not to be used directly.
 *
 * ## See also
 *
 * - {@link Scheduler.feature.EventEdit} - Scheduler event edit feature
 * - {@link Scheduler.feature.SimpleEventEdit} - Simple inline event editing
 *
 * @extends Scheduler/feature/SchedulerFeature
 * @tier community
 */
export default class EditBase extends SchedulerFeature {
    static $name = 'EditBase';

    //region Config

    static configurable = {
        /**
         * By default, while editing, *all* clicks outside the editor will cancel the edit.
         *
         * Set to `true` to begin editing a new event when an event bar is clicked.
         *
         * This is normally used in combination with a docked editor, allowing interaction
         * with the scheduler/calendar while editing.
         * @config {Boolean}
         * @default
         */
        continueEditingOnEventClick : false,

        /**
         * True to save and close this panel if ENTER is pressed in one of the input fields inside the panel.
         * @config {Boolean}
         * @default
         * @category Editor
         */
        saveAndCloseOnEnter : true,

        triggerEvent : null,

        /**
         * This config parameter is passed to the `startDateField` and `endDateField` constructor.
         * @config {String}
         * @default
         * @category Editor widgets
         */
        dateFormat : 'L', // date format that uses browser locale

        /**
         * This config parameter is passed to the `startTimeField` and `endTimeField` constructor.
         * @config {String}
         * @default
         * @category Editor widgets
         */
        timeFormat : 'LT', // date format that uses browser locale

        /**
         * Default editor configuration, which widgets it shows etc.
         *
         * This is the entry point into configuring any aspect of the editor.
         *
         * The {@link Core.widget.Container#config-items} configuration of a Container
         * is *deeply merged* with its default `items` value. This means that you can specify
         * an `editorConfig` object which configures the editor, or widgets inside the editor:
         * ```javascript
         * const scheduler = new Scheduler({
         *     features : {
         *         eventEdit  : {
         *             editorConfig : {
         *                 autoClose : false,
         *                 modal     : true,
         *                 cls       : 'editor-widget-cls',
         *                 items : {
         *                     resourceField : {
         *                         hidden : true
         *                     },
         *                     // Add our own event owner field at the top of the form.
         *                     // Weight -100 will make it sort top the top.
         *                     ownerField : {
         *                         weight : -100,
         *                         type   : 'usercombo',
         *                         name   : 'owner',
         *                         label  : 'Owner'
         *                     }
         *                 },
         *                 bbar : {
         *                     items : {
         *                         deleteButton : false
         *                     }
         *                 }
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * To configure the editor Panel to be docked, use the {@link Core.widget.Popup#config-drawer} config
         * as shown below:
         * ```javascript
         * const scheduler = new Scheduler({
         *     features : {
         *         eventEdit  : {
         *             // Dock the editor to the inline-end side of the viewport
         *             editorConfig : {
         *                 drawer : true
         *             }
         *         }
         *     }
         * });
         * ```
         * @config {PopupConfig}
         * @category Editor
         */
        editorConfig : null,

        /**
         * An object to merge with the provided items config of the editor to override the
         * configuration of provided fields, or add new fields.
         *
         * To remove existing items, set corresponding keys to `null`:
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     features : {
         *         eventEdit  : {
         *             items : {
         *                 // Merged with provided config of the resource field
         *                 resourceField : {
         *                     label : 'Calendar'
         *                 },
         *                 recurrenceCombo : null,
         *                 owner : {
         *                     weight : -100, // Will sort above system-supplied fields which are weight 0
         *                     type   : 'usercombo',
         *                     name   : 'owner',
         *                     label  : 'Owner'
         *                 }
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * The provided fields are called
         *  - `nameField`
         *  - `resourceField`
         *  - `startDateField`
         *  - `startTimeField`
         *  - `endDateField`
         *  - `endTimeField`
         *  - `recurrenceCombo`
         *  - `editRecurrenceButton`
         * @config {Object<String,ContainerItemConfig|Boolean|null>}
         * @category Editor widgets
         */
        items : null,

        /**
         * The week start day used in all date fields of the feature editor form by default.
         * 0 means Sunday, 6 means Saturday.
         * Defaults to the locale's week start day.
         * @config {Number}
         */
        weekStartDay : null
    };

    //endregion

    //region Init & destroy

    construct(config) {
        const
            me         = this,
            { client } = config;

        client.eventEdit = me;

        super.construct({
            weekStartDay : client.weekStartDay,
            ...config
        });

        me.clientListenersDetacher = client.ion({
            [me.triggerEvent] : 'onActivateEditor',
            dragCreateEnd     : 'onDragCreateEnd',

            // Not fired at the Scheduler level.
            // Calendar, which inherits this, implements this event.
            eventAutoCreated : 'onEventAutoCreated',
            thisObj          : me
        });
    }

    doDestroy() {
        this.clientListenersDetacher();

        this._editor?.destroy();

        super.doDestroy();
    }

    //endregion

    //region Editing

    // Not implemented at this level.
    // Scheduler Editing relies on being called at point of event creation.
    onEventAutoCreated() {}

    changeEditorConfig(editorConfig) {
        const { items } = this;

        // Merge items which is an Object with the default editorConfig's items
        if (items) {
            editorConfig = Objects.clone(editorConfig);
            editorConfig.items = Config.merge(items, editorConfig.items);
        }

        return editorConfig;
    }

    changeItems(items) {
        this.cleanItemsConfig(items);
        return items;
    }

    // Remove any items configured as === true which just means default config options
    cleanItemsConfig(items) {
        for (const ref in items) {
            const itemCfg = items[ref];

            if (itemCfg === true) {
                delete items[ref];
            }
            else if (itemCfg?.items) {
                this.cleanItemsConfig(itemCfg.items);
            }
        }
    }

    // When the startDate changes, the endDate is moved to maintain the same duration and the
    // endDate's minimum is adjusted to be the startDate.
    // When the endDate changes, we recalculate the duration.
    onDatesChange({ value, source }) {
        const me = this;

        if (source.ref.startsWith('start')) {
            // Move end fields to keep duration the same.
            // The two end fields are partnered so will both keep the same value
            if (value && me.endDateField) {
                me.endDateField.value = DateHelper.add(value, me._durationMS, 'ms');
            }

            // End date can never be less than start date
            if (me.endDateField) {
                me.endDateField.min = value;
            }

            // The TimeFields keep the full Date.
            if (me.endTimeField) {
                me.endTimeField.min = value;
            }
        }
        // When the end date changes, we need to recalculate the duration
        else if (source.ref.startsWith('end')) {
            if (value && me.startDateField?.value) {
                me._durationMS = value - me.startDateField.value;
            }
        }
    }

    //endregion

    //region Save

    async save() {
        throw new Error('Implement in subclass');
    }

    get values() {
        const
            { editor }   = this,
            {
                values,
                childItems
            }            = editor,
            visibleNames = new Set();

        // Omit values for hidden fields and fields without a name (like spacers, etc).
        // First collect names that have at least one visible field, so that hiding a TimeField
        // (which shares a name like "startDate" with its DateField) doesn't remove the date value.
        childItems.forEach(widget => {
            if (widget.name && !widget.hidden) {
                visibleNames.add(widget.name);
            }
        });

        childItems.forEach(widget => {
            const { name } = widget;

            if (!name || (widget.hidden && !visibleNames.has(name))) {
                delete values[name];
            }
        });

        // Although the EventEdit feature reads directly from its resourceField when updating the event's
        // assignments, maintain the API which has always returned a resource record in values.resource
        if (values.resource) {
            values.resource = this.resourceField.valueCollection.first;
        }
        // The recurrence rule is not part of the editor's values by default, but it must be included
        // when saving.
        if (this.editRecurrenceButton) {
            values.recurrenceRule = this.editRecurrenceButton.value;
        }

        // Since there is no duration field in the editor,
        // we don't need to recalculate duration value on each date change.
        // It's enough to return correct duration value in `values`,
        // so the record will get updated with the correct data.
        if (('startDate' in values) && ('endDate' in values)) {
            values.duration = DH.diff(values.startDate, values.endDate, editor.record.durationUnit, true);
        }

        return values;
    }

    /**
     * Template method, intended to be overridden. Called before the event record has been updated.
     * @param {Scheduler.model.EventModel} eventRecord The event record
     *
     **/
    onBeforeSave(eventRecord) {}

    /**
     * Template method, intended to be overridden. Called after the event record has been updated.
     * @param {Scheduler.model.EventModel} eventRecord The event record
     *
     **/
    onAfterSave(eventRecord) {}

    /**
     * Updates record being edited with values from the editor
     * @private
     */
    updateRecord(record) {
        const { values } = this;

        // Clean resourceId / resources out of values when using assignment store, it will handle the assignment
        if (this.assignmentStore) {
            delete values.resource;
        }

        this._durationMS = DateHelper.asMilliseconds(values.duration ?? record.duration, record.durationUnit);

        return record.set(values);
    }

    //endregion

    //region Events

    onBeforeEditorShow() {
        const
            { eventRecord, editor } = this.editingContext,
            { nameField } = editor.widgetMap;

        // Editing new event. Make sure user doesn't have to clear the input field.
        // Record field value still should be there because a rendered event block
        // looks bad with no text in it.
        // nameField may have been configured away.
        if (nameField && eventRecord.isCreating) {
            // Avoid initial invalid because required state.
            editor.assigningValues = true;
            nameField.value = '';
            editor.assigningValues = false;

            // Show new event text as a placeholder
            nameField._configuredPlaceholder = nameField.placeholder;
            nameField.placeholder = eventRecord.name;
        }
    }

    onEditorHide() {
        // If we are allowing interaction with the scheduler while editing,
        // We have to re-enable drag features while editing ends.
        if (this.continueEditingOnEventClick) {
            this.onEditorHideShow(false);
        }
    }

    onEditorShow() {
        // If we are allowing interaction with the scheduler while editing,
        // We have to disable drag features while editing is active.
        if (this.continueEditingOnEventClick) {
            this.onEditorHideShow(true);
        }
    }

    onEditorHideShow(visible) {
        const
            { client }        = this,
            { features }      = client,
            featuresToDisable = productFeaturesToDisable[client.isCalendar ? 'calendar' : 'scheduler'];

        featuresToDisable.forEach(feature => {
            if (visible) {
                this[`${feature}Disabled`] = features[feature].disabled;
                features[feature].disabled = true;
            }
            else {
                features[feature].disabled = this[`${feature}Disabled`];
            }
        });
    }

    resetEditingContext() {
        const me = this;

        if (!me.editingContext) {
            return;
        }

        const
            { client }              = me,
            { editor, eventRecord } = me.editingContext,
            { eventStore }          = client,
            { nameField }           = editor.widgetMap;

        // This will remove the record from the store, *and* from the added bag, so no sync will take place.
        if (eventRecord.isCreating) {
            // Ensure that during the engine's async processing of the remove, the element is non-interactive.
            // Mousedown on the just-created element itself passes through here, and the immediate mouseup
            // after that instigates a click which will find no corresponding event.
            if (client.isTimelineBase) {
                me.editingContext.eventElement?.closest('[data-event-id]')?.classList.add('b-released');
            }

            eventStore.remove(eventRecord);

            // Clear isCreating *after* removal.
            // Store doesn't register as a removed record if isCreating is set
            eventRecord.isCreating = false;
        }

        // Revert any placeholder that we may have set
        // nameField may have been configured away.
        if (nameField) {
            nameField.placeholder = nameField._configuredPlaceholder;
        }

        client.removeCls('b-event-editor-editing');

        // Reset context
        me.targetEventElement = me.editingContext = me.resourceRecord = editor._record = null;
    }

    onPopupKeyDown({ event }) {
        const me = this;

        if (!me.readOnly && event.key === 'Enter' && me.saveAndCloseOnEnter && event.target.tagName.toLowerCase() === 'input') {
            // Need to prevent this key events from being fired on whatever receives focus after the editor is hidden
            event.preventDefault();
            me.onSaveClick();
        }
    }

    async finalizeStmCapture(saved) {}

    //region Event names

    // The editor's public event names. Subclasses editing a different entity (e.g. the Gantt task editor) override
    // these getters to fire the entity-scoped variants (beforeTaskEdit, etc.). Kept as literals so every event name
    // is greppable at its trigger site.
    get beforeEventEditShowEventName() {
        return 'beforeEventEditShow';
    }
    get beforeEventAddEventName() {
        return 'beforeEventAdd';
    }
    get beforeEventEditEventName() {
        return 'beforeEventEdit';
    }
    get beforeEventSaveEventName() {
        return 'beforeEventSave';
    }
    get afterEventSaveEventName() {
        return 'afterEventSave';
    }
    get afterEventEditEventName() {
        return 'afterEventEdit';
    }
    get eventEditCanceledEventName() {
        return 'eventEditCanceled';
    }

    //endregion

    // Builds the public event payload from the internal editingContext. The base editor edits events, so the payload
    // keys (eventRecord/eventElement/eventEdit) are already correct and pass through unchanged. Subclasses that edit a
    // different entity override this to rename those keys (see Gantt BasicTaskEdit).
    composeEditEventData(data) {
        return data;
    }

    async onSaveClick() {
        const me = this;

        // <remove-on-release>
        // TODO: add new API on Container: blurFocusedField which manages this scenario
        //  of blurring active field just before hiding
        // </remove-on-release>
        me.editor.focus();

        me.isFinalizingEventSave = true;

        const saved = await me.save();

        me.isFinalizingEventSave = false;

        if (saved) {
            await me.finalizeStmCapture(false);

            if (!me.isDestroyed) {
                // editor.close nulls editingContext (via beforeHide -> resetEditingContext), so capture it first.
                const { editingContext, afterEventEditEventName } = me;

                // Pass this feature as a signal that its an active close, and not a cancel
                me.editor.close(me);

                /**
                 * Fires on the owning Scheduler after editor is closed by any action - save, delete or cancel
                 * @event afterEventEdit
                 * @on-owner
                 * @param {Scheduler.view.Scheduler} source The scheduler
                 * @param {'save'|'delete'|'cancel'} action The action that was taken to end the edit.
                 * One of 'save', 'delete' or 'cancel'
                 * @param {Scheduler.feature.EventEdit} eventEdit The eventEdit feature
                 * @param {Scheduler.model.EventModel} eventRecord The record that has been edited.
                 * @param {Scheduler.model.ResourceModel} resourceRecord The Resource record for the event. If the event
                 * is being created, it will not contain a resource, so this parameter specifies the resource the
                 * event is being created for.
                 * @param {HTMLElement} eventElement The element which represents the event in the scheduler display.
                 * @param {Core.widget.Popup} editor The editor
                 */
                me.client.trigger(afterEventEditEventName, me.composeEditEventData({ ...editingContext, action : 'save' }));
            }
        }
        return saved;
    }

    async onDeleteClick() {
        const me = this;

        // The `deleteEvent` call additionally closes the editor.
        // See the comment for the `editor.revertFocus();` call in the EventEdit.js feature,
        // that triggers `resetEditingContext` in which a cancel flow is assumed by default,
        // so the context reset must be distinguished as belonging to the delete action
        me.isDeletingEvent = true;

        const removed = await me.deleteEvent();

        me.isDeletingEvent = false;

        if (removed) {
            await me.finalizeStmCapture(false);

            if (!me.isDestroyed) {
                // editor.close nulls editingContext (via beforeHide -> resetEditingContext), so capture it first.
                const { editingContext, afterEventEditEventName } = me;

                // Pass this feature as a signal that its an active close, and not a cancel
                me.editor.close(me);

                me.client.trigger(afterEventEditEventName, me.composeEditEventData({ ...editingContext, action : 'delete' }));
            }
        }
    }

    async onCancelClick() {
        const
            me                      = this,
            {
                client,
                editingContext
            }                       = me,
            eventElement            = document.activeElement,
            eventRecord             = eventElement && client.resolveEventRecord(eventElement);

        // If the click was on an eventRecord, and we are configured to continue editing on event clicks,
        // restart editing that event.
        // Do *not* do this if we are reverting focus, which happens when the user clicks
        // the collapse tool if docked.
        if (eventRecord && me.continueEditingOnEventClick && !me.editor._isRevertingFocus) {
            me.resetEditingContext();
            me.editEvent(eventRecord, client.resolveResourceRecord(eventElement), eventElement);
            me.editor.focus();
        }
        else {
            me.isCancelingEdit = true;

            me.editor.close(me);

            me.isCancelingEdit = false;

            if (me.hasStmCapture) {
                await me.finalizeStmCapture(true);
            }
        }

        if (!me.isDestroyed) {
            const
                {
                    afterEventEditEventName,
                    eventEditCanceledEventName
                }         = me,
                eventData = me.composeEditEventData({ ...editingContext });

            me.client.trigger(afterEventEditEventName, { ...eventData, action : 'cancel' });

            /**
             * Fires on the owning Scheduler when an edit is canceled (the editor is closed without saving or deleting).
             * @event eventEditCanceled
             * @on-owner
             * @param {Scheduler.view.Scheduler} source The scheduler
             * @param {Scheduler.feature.EventEdit} eventEdit The eventEdit feature
             * @param {Scheduler.model.EventModel} eventRecord The record that was being edited.
             * @param {Scheduler.model.ResourceModel} resourceRecord The Resource record for the event.
             * @param {HTMLElement} eventElement The element which represents the event in the scheduler display.
             * @param {Core.widget.Popup} editor The editor
             */
            me.client.trigger(eventEditCanceledEventName, eventData);
        }
    }

    //endregion
}
