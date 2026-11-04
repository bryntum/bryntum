import Store from '../../Core/data/Store.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import Popup from '../../Core/widget/Popup.js';
import TimeZonable from '../../Core/mixin/TimeZonable.js';
import '../../Core/widget/SlideToggle.js';
import '../../Core/widget/panel/PanelCollapserOverlay.js';

/**
 * @module Scheduler/view/EventEditor
 */

/**
 * Base abstract class used by the {@link Scheduler/feature/EventEdit#config-editorConfig} feature config for the
 * editor dialog. Provides the popup container, scrolling, and mobile maximization behavior for event editing.
 *
 * ## See also
 *
 * - {@link Scheduler.feature.EventEdit} - Event edit feature
 * - {@link Scheduler.feature.SimpleEventEdit} - Simple inline event editing
 * - {@link Core.widget.Popup} - Base popup class
 *
 * @extends Core/widget/Popup
 * @abstract
 */
export default class EventEditor extends Popup.mixin(TimeZonable) {
    // Factoryable type name
    static type = 'eventeditor';

    static $name = 'EventEditor';

    static configurable = {
        items      : [],
        axisLock   : 'flexible',
        scrollable : {
            // In case editor is very tall or window is small, make it scrollable
            overflowY : true
        },
        readOnly : null,

        /**
         * A Function (or *name* of a function) which produces a customized Panel header based upon the event being edited.
         *
         * @config {Function|String}
         * @param {Scheduler.model.EventModel} eventRecord The record being edited
         * @returns {String} The Panel title.
         */
        titleRenderer : null,

        // We want to maximize on phones and tablets
        maximizeOnMobile : true,

        internalListeners : {
            beforeShow : 'onInternalBeforeShow'
        }
    };

    revertFocus() {
        const
            { owner }     = this,
            relatedTarget = this.focusInEvent?.relatedTarget;

        // If we cannot focus the "from" element of our focusIn, and we're operating under a Scheduler,
        // focus its last focused cell.
        if (relatedTarget && !DomHelper.isFocusable(relatedTarget) && owner.isTimelineBase) {
            owner.focusedCell?.cell?.focus();
        }
        super.revertFocus();
    }

    updateLocalization(...args) {
        super.updateLocalization(...args);

        // Use this if there's no titleRenderer
        this.initialTitle = this.title || '';
    }

    chainResourceStore() {
        return this.eventEditFeature.resourceStore.chain(
            record => !record.isSpecialRow,
            null,
            {
                // It doesn't need to be a Project-based Store
                storeClass              : Store,
                // Need to show all records in the combo. Required in case resource store is a tree.
                excludeCollapsedRecords : false
            }
        );
    }

    processWidgetConfig(widget) {
        if (widget.type?.includes('date') && widget.weekStartDay == null) {
            widget.weekStartDay = this.weekStartDay;
        }

        if (widget.type === 'extraItems') {
            return false;
        }

        const
            { eventEditFeature } = this,
            fieldConfig          = {};

        if (widget.ref === 'resourceField') {
            const { store } = widget;

            // Can't use store directly since it may be grouped and then contains irrelevant group records
            widget.store = this.chainResourceStore();

            // Allow the incoming widget's config to augment its store
            if (store) {
                widget.store.setConfig(store);
            }

            // When events are loaded with resourceId, we should only support single select.
            // Only override this if the widget has not been explicitly configured
            // with multiSelect.
            if (!('multiSelect' in widget)) {
                widget.multiSelect = !eventEditFeature.eventStore.usesSingleAssignment;
            }
        }

        if ((widget.name === 'startDate' || widget.name === 'endDate') && widget.type === 'date') {
            fieldConfig.format = eventEditFeature.dateFormat;
        }

        if ((widget.name === 'startDate' || widget.name === 'endDate') && widget.type === 'time') {
            fieldConfig.format = eventEditFeature.timeFormat;
        }

        Object.assign(widget, fieldConfig);

        return super.processWidgetConfig(widget);
    }

    setupEditorButtons() {
        const
            { record }       = this,
            { deleteButton } = this.widgetMap;

        // Hide delete button if we are readOnly or the event is in a create phase
        // which means we are editing a dblclick-created or drag-created event.
        if (deleteButton) {
            deleteButton.hidden = this.readOnly || record.isCreating;
        }
    }

    // This will be called if the editor is floating
    onInternalBeforeShow(...args) {
        this.setupUIForEditing();
    }

    // This will be called if the editor is docked
    onBeforeToggleReveal({ reveal }) {
        // Only when revealing, not when sliding out
        if (reveal) {
            this.setupUIForEditing();
        }
    }

    setupUIForEditing() {
        const
            me               = this,
            {
                record,
                titleRenderer
            }                = me;

        me.setupEditorButtons();
        me.ariaLabel = me.L('L{Object.editing}', record.name);

        if (titleRenderer) {
            me.title = me.callback(titleRenderer, me, [record]);
        }
    }

    onInternalKeyDown(event) {
        this.trigger('keyDown', { event });

        // Route Escape key through the cancel handling
        if (event.key === 'Escape') {
            event.stopImmediatePropagation();
            this.eventEditFeature.onCancelClick();
        }
        else {
            super.onInternalKeyDown(event);
        }
    }

    close(caller) {
        const { eventEditFeature } = this;

        // If the caller is the eventEditFeature, then it is saving or deleting or canceling
        // and we process the close.
        if (!eventEditFeature?.editingContext || caller === eventEditFeature) {
            if (!this.isClosing) {
                this.isClosing = true;
                try {
                    super.close();
                }
                finally {
                    this.isClosing = false;
                }
            }
        }
        // A general close request, *not* from the eventEditFeature
        // we need to cancel the edit first.
        else {
            // This will call us back with isCancelingEdit set to true
            // so that we can go ahead with the close after the cancel
            eventEditFeature.onCancelClick();
        }
    }

    updateReadOnly(readOnly) {
        const
            {
                deleteButton,
                saveButton,
                cancelButton,
                editRecurrenceButton
            } = this.widgetMap;

        super.updateReadOnly(readOnly);

        // The RecurrenceEditor we own is the lazy menu of the editRecurrenceButton, which ignores our readOnly
        // state so that it can be used to view the recurrence settings. Keep the RecurrenceEditor in lockstep
        // with us. Use the _property, the menu is lazy and must not be created here.
        if (editRecurrenceButton?._menu) {
            editRecurrenceButton._menu.readOnly = readOnly;
        }

        if (deleteButton) {
            deleteButton.hidden = readOnly;
        }

        if (saveButton) {
            saveButton.hidden = readOnly;
        }

        if (cancelButton) {
            cancelButton.hidden = readOnly;
        }
    }
}

// Register this widget type with its Factory
EventEditor.initClass();
