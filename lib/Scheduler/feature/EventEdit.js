import EditBase from './base/EditBase.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import '../view/EventEditor.js';
import Delayable from '../../Core/mixin/Delayable.js';
import '../../Core/widget/TextField.js';
import '../widget/ResourceCombo.js';
import TimeSpan from '../model/TimeSpan.js';
import '../../Core/widget/DateField.js';
import '../../Core/widget/TimeField.js';
import '../../Core/widget/Button.js';
import Widget from '../../Core/widget/Widget.js';


DomHelper.loadStylesheet('Scheduler/feature/EventEdit.css');

// import Stylesheet from './EventEdit.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'EventEdit');

/**
 * @module Scheduler/feature/EventEdit
 */

/**
 * Feature that displays a popup containing widgets for editing event data.
 *
 * {@inlineexample Scheduler/feature/EventEdit.js}
 *
 * To customize its contents you can:
 *
 * * Reconfigure built-in widgets by providing override configs in the {@link Scheduler.feature.base.EditBase#config-items} config.
 * * Change the date format of the date & time fields: {@link Scheduler.feature.base.EditBase#config-dateFormat} and {@link Scheduler.feature.base.EditBase#config-timeFormat }
 * * Configure provided widgets in the editor and add your own in the {@link Scheduler.feature.base.EditBase#config-items} config.
 * * Remove fields related to recurring events configuration (such as `recurrenceCombo`) by setting {@link Scheduler.feature.mixin.RecurringEventEdit#config-showRecurringUI} config to `false`².
 * * Advanced: Reconfigure the whole editor widget using {@link #config-editorConfig}
 *
 * ## Built-in widgets
 *
 * The built-in widgets are:
 *
 * | Widget ref             | Type                                                     | Weight | Description                                                       |
 * |------------------------|----------------------------------------------------------|--------|-------------------------------------------------------------------|
 * | `nameField`            | {@link Core.widget.TextField}                            | 100    | Edit name                                                         |
 * | `resourceField`        | {@link Scheduler.widget.ResourceCombo}                   | 200    | Pick resource(s)                                                  |
 * | `startDateField`       | {@link Core.widget.DateField}                            | 300    | Edit startDate (date part)                                        |
 * | `startTimeField`       | {@link Core.widget.TimeField}                            | 400    | Edit startDate (time part)                                        |
 * | `endDateField`         | {@link Core.widget.DateField}                            | 500    | Edit endDate (date part)                                          |
 * | `endTimeField`         | {@link Core.widget.TimeField}                            | 600    | Edit endDate (time part)                                          |
 * | `recurrenceCombo`²     | {@link Scheduler.view.recurrence.field.RecurrenceCombo}  | 700    | Select recurrence rule (only visible if recurrence UI is enabled) |
 * | `editRecurrenceButton` | {@link Scheduler.view.recurrence.RecurrenceLegendButton} | 800    | Edit the recurrence rule  (only visible if recurrence is used)    |
 * | `colorField`¹          | {@link Scheduler.widget.EventColorField}                 | 700    | Choose background color for the event bar                         |
 *
 * **¹** Set the {@link Scheduler.view.SchedulerBase#config-showEventColorPickers} config to `true` to enable this field. Not supported in the Community tier.
 *
 * ## Date and time fields
 * The date and time fields both keep the full date and time value of the event's start and end instant.
 *
 * The date and time fields are {@link Core.widget.DateField#config-partner} linked pairs. Changing one will update the other to keep the full date/time value.
 *
 * The start and end instants of the event are kept consistent while editing. Changing the start date/time will adjust the end date/time to keep the same duration.
 *
 * The {@link Core.widget.DateField#config-min} of the end fields is kept in sync to be no earlier than the start instant.
 *
 * The built-in buttons are:
 *
 * | Widget ref             | Type                       | Weight | Description                                                    |
 * |------------------------|----------------------------|--------|----------------------------------------------------------------|
 * | `saveButton`           | {@link Core.widget.Button} | 100    | Save event button on the bbar                                  |
 * | `deleteButton`         | {@link Core.widget.Button} | 200    | Delete event button on the bbar                                |
 * | `cancelButton`         | {@link Core.widget.Button} | 300    | Cancel event editing button on the bbar                        |
 *
 * ## Removing a built-in item
 *
 * To remove a built-in widget, specify its `ref` as `null` in the `items` config:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         eventEdit : {
 *             items : {
 *                 // Remove the start time field
 *                 startTimeField : null
 *             }
 *         }
 *     }
 * })
 * ```
 *
 * Bottom buttons may be hidden using the `bbar` config passed to `editorConfig`:
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         eventEdit : {
 *             editorConfig : {
 *                 bbar : {
 *                     items : {
 *                         deleteButton : null
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * })
 * ```
 *
 * To remove fields related to recurring events configuration (such as `recurrenceCombo`), set
 * {@link Scheduler.feature.mixin.RecurringEventEdit#config-showRecurringUI} config to `false`².
 *
 * ## Customizing a built-in widget
 *
 * To customize a built-in widget, use its `ref` as the key in the `items` config and specify the configs you want
 * to change (they will merge with the widgets default configs):
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         eventEdit : {
 *             items : {
 *                 // ref for an existing field
 *                 nameField : {
 *                     // Change its label
 *                     label : 'Description'
 *                 }
 *             }
 *         }
 *     }
 * })
 * ```
 *
 * ## Adding custom widgets
 *
 * To add a custom widget, add an entry to the `items` config. The `name` property links the input field to a field in
 * the loaded event record:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         eventEdit : {
 *             items : {
 *                 // Key to use as fields ref (for easier retrieval later)
 *                 color : {
 *                     type  : 'combo',
 *                     label : 'Color',
 *                     items : ['red', 'green', 'blue'],
 *                     // name will be used to link to a field in the event record when loading and saving in the editor
 *                     name  : 'eventColor'
 *                 }
 *             }
 *         }
 *     }
 * })
 * ```
 *
 * ## Video guides
 * {@frameworktabs}
 * {@js}
 * [@youtube](https://youtube.com/embed/a0ikJn1tCmw)
 * {@endjs}
 * {@react}
 * [@youtube](https://www.youtube.com/embed/ghWLmifpO_4)
 * {@endreact}
 * {@vue}
 * [@youtube](https://www.youtube.com/embed/o7xQ6B_Y04w)
 * {@endvue}
 * {@angular}
 * [@youtube](https://www.youtube.com/embed/OuSH7YFndPE)
 * {@endangular}
 * {@endframeworktabs}
 *
 * For more info on customizing the event editor, please see "Customize event editor" guide.
 *
 * This feature is **enabled** by default.
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #event-beforeEventEditShow}           | Fires before the editor is shown                    |
 * | {@link #event-beforeEventEdit}               | Fires before editing starts                         |
 * | {@link #event-beforeEventSave}               | Fires before save, return `false` to prevent        |
 * | {@link #event-afterEventSave}                | Fires after event is saved                          |
 * | {@link #event-eventEditBeforeSetRecord}      | Fires before editor binds to a record               |
 * | {@link #event-eventEditCanceled}             | Fires when editing is canceled                      |
 *
 * ## See also
 *
 * - {@link Scheduler.feature.SimpleEventEdit} - Simplified event editor
 * - {@link Scheduler.model.EventModel} - Event data model
 * - {@link Scheduler.view.EventEditor} - Event editor popup
 *
 * ² Not supported in the Community tier.
 *
 * @mixes Scheduler/feature/mixin/RecurringEventEdit
 * @extends Scheduler/feature/base/EditBase
 * @demo Scheduler/eventeditor
 * @classtype eventEdit
 * @feature
 * @tier community
 */
export default class EventEdit extends EditBase.mixin(
    Delayable,

) {
    //region Config

    static $name = 'EventEdit';

    static type = 'eventEdit';
    // Superseded by TaskEdit at the Enterprise tier
    static defaultEnabled = { community : true, business : true, enterprise : false };
    static tier = 'community';

    static configurable = {
        /**
         * The event that shall trigger showing the editor. Defaults to `eventdblclick`, set to `''` or null to
         * disable editing of existing events.
         * @config {String}
         * @default
         * @category Editor
         */
        triggerEvent : 'eventdblclick',

        /**
         * A CSS selector targeting elements that should not trigger the editor when clicked.
         * @config {String}
         * @category Editor
         */
        ignoreSelector : null,

        /**
         * The data field in the model that defines the eventType.
         * Applied as class (b-event-type-xx) to the editors element, to allow showing/hiding fields depending on
         * eventType. Dynamic toggling of fields in the editor is activated by adding an `eventTypeField` field to
         * your widget:
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *    features : {
         *       eventEdit : {
         *           items : {
         *               eventTypeField : {
         *                  type  : 'combo',
         *                  name  : 'eventType',
         *                  label : 'Type',
         *                  items : ['Appointment', 'Internal', 'Meeting']
         *               }
         *           }
         *        }
         *     }
         * });
         * ```
         * Note, your event model class also must declare this field:
         * ```javascript
         *  class MyEvent extends EventModel {
         *      static get fields() {
         *          return [
         *              { name : 'eventType' }
         *          ];
         *      }
         *  }
         * ```
         * @config {String}
         * @default
         * @category Editor
         */
        typeField : 'eventType',

        /**
         * The current {@link Scheduler.model.EventModel} record, which is being edited by the event editor.
         * @prp {Scheduler.model.EventModel}
         * @readonly
         */
        eventRecord : null,

        /**
         * Specify `true` to put the editor in read only mode.
         *
         * It will also be in read only mode if the Scheduler / Calendar is so, or if the event record is read only.
         *
         * @prp {Boolean}
         * @default false
         */
        readOnly : null,

        /**
         * The configuration for the internal editor widget. With this config you can control the *type*
         * of editor (defaults to `Popup`) and which widgets to show,
         * change the items in the `bbar`, or change whether the popup should be modal etc.
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     features : {
         *         eventEdit  : {
         *             editorConfig : {
         *                 modal  : true,
         *                 cls    : 'my-editor', // A CSS class
         *                 items  : {
         *                     owner : {
         *                         weight : -100, // Will sort above system-supplied fields which are weight 100 to 800
         *                         type   : 'usercombo',
         *                         name   : 'owner',
         *                         label  : 'Owner'
         *                     },
         *                     agreement : {
         *                         weight : 1000, // Will sort below system-supplied fields which are weight 100 to 800
         *                         type   : 'checkbox',
         *                         name   : 'agreement',
         *                         label  : 'Agree to terms'
         *                     },
         *                     resourceField : {
         *                         // Apply a special filter to limit the Combo's access
         *                         // to resources.
         *                         store : {
         *                             filters : [{
         *                                 filterBy(resource) {
         *                                     return shouldShowResource(resource);
         *                                 }
         *                             }]
         *                         }
         *                     }
         *                 },
         *                 bbar : {
         *                     items : {
         *                         deleteButton : {
         *                             hidden : true
         *                         }
         *                     }
         *                 }
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * Or to use your own custom editor:
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     features : {
         *         eventEdit  : {
         *             editorConfig : {
         *                 type : 'myCustomEditorType'
         *             }
         *         }
         *     }
         * });
         * ```
         * @config {EventEditorConfig}
         * @category Editor
         */
        editorConfig : {
            type          : 'eventeditor',
            title         : 'L{EventEdit.Edit event}',
            closable      : true,
            localeClass   : this,
            labelPosition : 'above',

            defaults : {
                localeClass : this
            },
            items : {
                /**
                 * Reference to the name field, if used
                 * @member {Core.widget.TextField} nameField
                 * @readonly
                 */
                nameField : {
                    type      : 'text',
                    label     : 'L{Name}',
                    clearable : true,
                    name      : 'name',
                    weight    : 100
                },
                /**
                 * Reference to the resource field, if used
                 * @member {Core.widget.Combo} resourceField
                 * @readonly
                 */
                resourceField : {
                    type                    : 'resourcecombo',
                    label                   : 'L{Resource}',
                    name                    : 'resource',
                    editable                : true,
                    valueField              : 'id',
                    displayField            : 'name',
                    highlightExternalChange : false,
                    destroyStore            : true,
                    weight                  : 200
                },
                /**
                 * Reference to the start date field, if used
                 * @member {Core.widget.DateField} startDateField
                 * @readonly
                 */
                startDateField : {
                    type             : 'date',
                    clearable        : false,
                    required         : true,
                    label            : 'L{Start}',
                    name             : 'startDate',
                    validateDateOnly : true,
                    weight           : 300,
                    partner          : 'startTimeField'
                },
                /**
                 * Reference to the start time field, if used
                 * @member {Core.widget.TimeField} startTimeField
                 * @readonly
                 */
                startTimeField : {
                    type      : 'timefield',
                    clearable : false,
                    required  : true,
                    ariaLabel : 'L{startTime}',
                    name      : 'startDate',
                    weight    : 400,
                    partner   : 'startDateField'
                },
                /**
                 * Reference to the end date field, if used
                 * @member {Core.widget.DateField} endDateField
                 * @readonly
                 */
                endDateField : {
                    type             : 'date',
                    clearable        : false,
                    required         : true,
                    label            : 'L{End}',
                    name             : 'endDate',
                    validateDateOnly : true,
                    weight           : 500,
                    partner          : 'endTimeField'
                },
                /**
                 * Reference to the end time field, if used
                 * @member {Core.widget.TimeField} endTimeField
                 * @readonly
                 */
                endTimeField : {
                    type      : 'timefield',
                    clearable : false,
                    required  : true,
                    ariaLabel : 'L{endTime}',
                    name      : 'endDate',
                    weight    : 600,
                    partner   : 'endDateField'
                }

            },

            bbar : {
                // When readOnly, child buttons are hidden
                hideWhenEmpty : true,

                defaults : {
                    localeClass : this
                },
                items : {
                    /**
                     * Reference to the save button, if used
                     * @member {Core.widget.Button} saveButton
                     * @readonly
                     */
                    saveButton : {
                        rendition : 'filled',
                        text      : 'L{Save}',
                        weight    : 100
                    },
                    /**
                     * Reference to the delete button, if used
                     * @member {Core.widget.Button} deleteButton
                     * @readonly
                     */
                    deleteButton : {
                        text   : 'L{Delete}',
                        weight : 200
                    },
                    /**
                     * Reference to the cancel button, if used
                     * @member {Core.widget.Button} cancelButton
                     * @readonly
                     */
                    cancelButton : {
                        text   : 'L{Object.Cancel}',
                        weight : 300
                    }
                }
            }
        },

        targetEventElement : null,

        /**
         * How much of a long event bar which is clipped by scrolling must be brought into view
         * to facilitate editing.
         *
         * In a horizontal Scheduler, this will bring 100 pixels of width into view.
         *
         * In a vertical Scheduler, this will bring 100 pixels of height into view.
         * @prp {Number}
         * @default
         */
        minEditSize : 100
    };

    static get pluginConfig() {
        return {
            after : [
                'populateEventMenu',
                'onEventEnterKey',
                'internalOnBeforeModeSwitch'
            ],
            assign : [
                'editEvent'
            ]
        };
    }

    internalOnBeforeModeSwitch() {
        // Close the editor before the scheduler switches modes
        this.editor?.close?.();
    }

    //endregion

    //region Init & destroy

    construct(config) {
        const { client } = config;

        // Default to the scheduler's state, but configs may override
        this.readOnly = client.readOnly;

        super.construct(config);

        client.ion({
            projectChange : 'onChangeProject',
            readOnly      : 'onClientReadOnlyToggle',
            thisObj       : this
        });
    }

    get scheduler() {
        return this.client;
    }

    get project() {
        return this.client.project;
    }

    //endregion

    //region Editing

    onClientReadOnlyToggle({ readOnly }) {
        this.readOnly = readOnly;
    }

    updateReadOnly(readOnly) {
        this._editor && (this.editor.readOnly = readOnly);
    }

    /**
     * Returns the editor widget representing this feature
     * @member {Core.widget.Popup}
     */
    get editor() {
        const
            me              = this,
            editorListeners = {
                beforeHide : 'resetEditingContext',
                beforeShow : 'onBeforeEditorShow',
                hide       : 'onEditorHide',
                show       : 'onEditorShow',
                keyDown    : 'onPopupKeyDown',
                thisObj    : me
            };

        let { _editor : editor } = me;

        if (editor) {
            return editor;
        }

        editor = me._editor = Widget.create(me.getEditorConfig());

        const {
            startDateField,
            startTimeField,
            endDateField,
            endTimeField
        } = editor.widgetMap;

        // If the date field doesn't exist, the time field must encapsulate the
        // date component of the start/end points and must lay out right.
        if (!startDateField && startTimeField) {
            startTimeField.label = me.L('L{Start}');
            startTimeField.flex  = '1 0 100%';
        }
        if (!endDateField && endTimeField) {
            endTimeField.label = me.L('L{End}');
            endTimeField.flex  = '1 0 100%';
        }

        // Must set *after* construction, otherwise it becomes the default state
        // to reset readOnly back to.
        editor.readOnly = me.readOnly;

        if (editor.items.length === 0) {
            console.warn('Event Editor configured without any `items`');
        }

        // add listeners programmatically so users cannot override them accidentally
        editor.ion(editorListeners);

        /**
         * Fired before the editor will load the event record data into its input fields. This is useful if you
         * want to modify the fields before data is loaded (e.g. set some input field to be readonly)
         * @on-owner
         * @event eventEditBeforeSetRecord
         * @param {Core.widget.Container} source The editor widget
         * @param {Scheduler.model.EventModel} record The record
         */
        me.scheduler.relayEvents(editor, ['beforeSetRecord'], 'eventEdit');

        // assign widget variables, using widget name: startDate -> me.startDateField
        // widgets with id set use that instead, id -> me.idField
        Object.values(editor.widgetMap).forEach(widget => {
            const ref = widget.ref || widget.id;
            // don't overwrite if already defined
            if (ref && !me[ref]) {
                me[ref] = widget;

                switch (widget.name) {
                    case 'startDate':
                    case 'endDate':
                        widget.ion({ change : 'onDatesChange', thisObj : me });
                        break;
                }
            }
        });

        // launch onEditorConstructed hook if provided
        me.onEditorConstructed?.(editor);

        me.eventTypeField?.ion({ change : 'onEventTypeChange', thisObj : me });

        me.saveButton?.ion({ click : 'onSaveClick', thisObj : me });
        me.deleteButton?.ion({ click : 'onDeleteClick', thisObj : me });
        me.cancelButton?.ion({ click : 'onCancelClick', thisObj : me });

        return editor;
    }

    getEditorConfig() {
        const
            me                 = this,
            { cls, scheduler } = me,
            result             = ObjectHelper.assign({
                owner            : scheduler,
                eventEditFeature : me,
                weekStartDay     : me.weekStartDay,
                align            : {
                    align  : 'b-t',
                    offset : [-3, -3]
                },
                id           : `${scheduler.id}-event-editor`,
                autoShow     : false,
                anchor       : true,
                scrollAction : me.editorConfig.autoUpdateRecord ? null : 'realign',
                constrainTo  : globalThis,
                cls
            }, me.editorConfig);

        if (result.drawer === true) {
            result.drawer = {};
        }

        // Default drawer autoClose to clicks outside the scheduler's events
        if (result.drawer && !result.drawer.autoClose) {
            result.drawer.autoClose = {
                mousedown : `:not(#${scheduler.id} ${scheduler.eventSelector})`,
                focusout  : true
            };
        }

        // User configuration may have included a render target which means the editor
        // will not be floating.
        if (Widget.prototype.getRenderContext(result)[0]) {
            result.floating = false;
        }



        return result;
    }

    // Called from editEvent() to actually show the editor
    async internalShowEditor(eventRecord, resourceRecord, align = null) {
        const
            me                      = this,
            { scheduler, editor }   = me,
            { useInitialAnimation } = scheduler,
            // Align to the element (b-sch-event) and not the wrapper
            eventElement            = align?.target?.nodeType === Element.ELEMENT_NODE
                ? align.target
                : scheduler.getElementFromEventRecord(eventRecord, resourceRecord),
            isPartOfStore           = eventRecord.isPartOfStore(scheduler.eventStore);

        align = align ?? {
            // Align to the element (b-sch-event) and not the wrapper
            target : eventElement,
            anchor : true
        };

        // Event not in current TimeAxis - cannot be edited without extending the TimeAxis.
        // If there's no event element and the eventRecord is not in the store, we still
        // edit centered on the Scheduler - we're adding a new event
        if (align.target || (!isPartOfStore || eventRecord.resources.length === 0) || eventRecord.isCreating) {
            // need to add this css class as early as possible to prevent
            // the event tooltip from appearing
            scheduler.addCls('b-event-editor-editing');

            me.resourceRecord = resourceRecord;

            me.editingContext = {
                eventEdit : me,
                eventRecord,
                resourceRecord,
                eventElement,
                editor,
                isPartOfStore
            };

            super.internalShowEditor?.(eventRecord, resourceRecord, align);

            if (me.typeField) {
                me.toggleEventType(eventRecord.getValue(me.typeField));
            }

            me.loadRecord(eventRecord, resourceRecord);

            editor.readOnly = me.readOnly || eventRecord.readOnly || scheduler.readOnly;
            editor.title = editor.readOnly ? me.L('L{Object.information}') : editor.initialTitle;

            // If the editor is a drawer, show it in the appropriate way
            if (editor.collapsible) {
                if (editor.collapsed && !editor.revealed) {
                    await editor.collapsible.type === 'inline' ? editor.expand() : editor.collapsible.toggleReveal(true); // TO-DO toggleReveal does not return promise
                    editor.focus();
                }
            }
            // Honour alignment settings "anchor" and "centered" which may be injected from editorConfig.
            else
            // End of deprecated code
                if (editor.centered || !editor.anchor || !editor.floating) {
                    editor.show();
                }
                // avoid aligning to an event being animated into place, just center in these cases
                else if (eventElement && (!eventRecord.isCreating || !useInitialAnimation || useInitialAnimation === true || useInitialAnimation === 'fade-in')) {
                    me.targetEventElement = eventElement;
                    editor.showBy(align);
                }
                // We are adding an unrendered event. Display the editor centered
                else {
                    editor.show();

                    // Must be done after show because show always reverts to its configured centered setting.
                    editor.updateCentered(true);
                }

            // Adjust time field step increment based on timeAxis resolution
            const timeResolution = scheduler.timeAxisViewModel.timeResolution;

            if (timeResolution.unit === 'hour' || timeResolution.unit === 'minute') {
                const step = `${timeResolution.increment}${timeResolution.unit}`;
                if (me.startTimeField) {
                    me.startTimeField.step = step;
                }
                if (me.endTimeField) {
                    me.endTimeField.step = step;
                }
            }

            // Might end up here with the old listener still around in monkey test for stress demo in turbo mode.
            // Some action happening during edit, but cannot track down what is going on
            me.detachListeners('changesWhileEditing');

            scheduler.eventStore.ion({
                change  : me.onChangeWhileEditing,
                refresh : me.onChangeWhileEditing,
                thisObj : me,
                name    : 'changesWhileEditing'
            });
        }
    }

    onChangeWhileEditing() {
        const me = this;
        // If event was removed, cancel editing
        // - however, there's one valid case when even can be removed during save finalization - that is when
        // all its assignments has been removed - in such case ignore the removal and do not call the `onCancelClick`
        // because that will reject the STM transaction and revert all changes
        // - also, do not trigger it when the editor is configured with the `autoUpdateRecord` - because in such case
        // the data change will be happening right during the editing
        if (!me.editor.autoUpdateRecord && !me.isFinalizingEventSave && me.isEditing && me.editingContext.isPartOfStore && !me.eventRecord.isPartOfStore(me.scheduler.eventStore)) {
            me.onCancelClick();
        }
    }

    // Fired in a listener so that it's after the auto-called onBeforeShow listeners so that
    // subscribers to the beforeEventEditShow are called at exactly the correct lifecycle point.
    onBeforeEditorShow(...args) {
        super.onBeforeEditorShow(...args);

        const { beforeEventEditShowEventName } = this;

        /**
         * Fires on the owning Scheduler when the editor for an event is available but before it is populated with
         * data and shown. Allows manipulating fields etc.
         * @event beforeEventEditShow
         * @on-owner
         * @param {Scheduler.view.Scheduler} source The scheduler
         * @param {Scheduler.feature.EventEdit} eventEdit The eventEdit feature
         * @param {Scheduler.model.EventModel} eventRecord The record about to be shown in the event editor.
         * @param {Scheduler.model.ResourceModel} resourceRecord The Resource record for the event. If the event
         * is being created, it will not contain a resource, so this parameter specifies the resource the
         * event is being created for.
         * @param {HTMLElement} eventElement The element which represents the event in the scheduler display.
         * @param {Core.widget.Popup} editor The editor
         */
        this.scheduler.trigger(beforeEventEditShowEventName, this.composeEditEventData({
            ...this.editingContext
        }));
    }

    updateTargetEventElement(targetEventElement, oldTargetEventElement) {
        targetEventElement?.classList.add('b-editing');
        oldTargetEventElement?.classList.remove('b-editing');
    }

    /**
     * Opens an editor for the passed event. This function is exposed on Scheduler and can be called as
     * `scheduler.editEvent()`.
     * @param {Scheduler.model.EventModel|String|Number} eventRecord Event to edit or the id of the eventRecord.
     * When a String or Number is passed, it must be the id of an event that exists in the Scheduler's event store.
     * @param {Scheduler.model.ResourceModel} [resourceRecord] The Resource record for the event.
     * This parameter is needed if the event is newly created for a resource and has not been assigned, or when using
     * multi assignment.
     * @param {HTMLElement} [element] Element to anchor editor to (defaults to events element)
     * @on-owner
     */
    editEvent(eventRecord, resourceRecord, element = null, stmCapture = null) {
        const
            me                  = this,
            {
                client,
                beforeEventAddEventName,
                beforeEventEditEventName
            }                   = me,
            {
                eventStore,
                assignmentStore
            }                   = client,
            { changeEvent }     = client.transition,
            { simpleEventEdit } = client.features;

        if (!eventRecord.isModel) {
            eventRecord = typeof eventRecord === 'object' ? eventStore.createRecord(eventRecord) : eventStore.getById(eventRecord);
        }

        // Check whether the event is owned by this Scheduler's eventStore.
        // $master drills through chained stores to the ultimate owning store
        const isNew = !eventRecord.isOccurrence && !eventStore.$master.includes(eventRecord);

        if (isNew) {
            const resourceRecords = [];

            // It's only a provisional event because we are going to edit it which will
            // allow an opportunity to cancel the add (by removing it).
            eventRecord.isCreating = true;

            let assignmentRecords = [];

            if (resourceRecord && !assignmentStore.includesAssignment(eventRecord.id, resourceRecord.id)) {
                resourceRecords.push(resourceRecord);
                assignmentRecords = assignmentStore.assignEventToResource(eventRecord, resourceRecord);
            }

            if (client.trigger(beforeEventAddEventName, me.composeEditEventData({ eventRecord, resourceRecords, assignmentRecords })) === false) {
                // Remove any assignment created above, to leave store as it was
                assignmentStore?.remove(assignmentRecords);
                eventRecord.isCreating = false;

                return false;
            }
        }

        if (me.isEditing) {
            // old editing flow already running, clean it up
            me.resetEditingContext();
        }

        // If simple edit feature is active, use it when a new event is created
        if (me.disabled || (eventRecord.isCreating && simpleEventEdit?.enabled)) {
            return;
        }

        /**
         * Fires on the owning Scheduler before an event is displayed in an editor.
         * This may be listened for to allow an application to take over event editing duties. Returning `false`
         * stops the default editing UI from being shown.
         *
         * {@note}Be aware of that when returning <code>false</code>, your app must take care of
         * the <code>eventRecord</code> lifecycle  - for example by committing it or removing it
         * from the store.{/@note}
         * @event beforeEventEdit
         * @on-owner
         * @param {Scheduler.view.Scheduler} source The scheduler
         * @param {Scheduler.feature.EventEdit} eventEdit The eventEdit feature
         * @param {Scheduler.model.EventModel} eventRecord The record about to be shown in the event editor.
         * @param {Scheduler.model.ResourceModel} resourceRecord The Resource record for the event. If the event
         * is being created, it will not contain a resource, so this parameter specifies the resource the
         * event is being created for.
         * @param {HTMLElement} eventElement The element which represents the event in the scheduler display.
         * @preventable
         */
        if (client.trigger(beforeEventEditEventName, me.composeEditEventData({
            eventEdit    : me,
            eventRecord,
            resourceRecord,
            eventElement : client.getElementFromEventRecord?.(eventRecord, resourceRecord) || element
        })) === false) {
            client.removeCls('b-event-editor-editing');
            if (client.isCalendar) {
                eventRecord.isCreating = false;
            }
            return false;
        }



        // Code imported from SchedulerBase.editEvent which used to be chained in.
        // It must only be executed for SchedulerBase instances, not for a Calendar.
        if (client.refreshRows) {
            if (isNew) {
                client.transition.changeEvent = false;
                eventStore.$master.add(eventRecord);
                client.project.commitAsync().then(() => {
                    if (!client.isDestroyed) {
                        client.transition.changeEvent = changeEvent;
                    }
                });

                // Element must be created synchronously, not after the project's normalizing delays.
                client.refreshRows();
            }

            // New event bar must get focus so that focus reversion from the EventEditor works
            if (eventRecord.isCreating) {
                client.getElementFromEventRecord?.(eventRecord, resourceRecord, true)?.focus({ preventScroll : true });
            }
        }

        return me.doEditEvent(eventRecord, resourceRecord, element, stmCapture).then(result => {

        });
    }

    /**
     * Returns true if the editor is currently active
     * @member {Boolean}
     * @readonly
     */
    get isEditing() {
        const { _editor } = this;

        return Boolean(
            // Editor is not visible if it is collapsed and not expanded
            _editor?.isVisible && !(_editor.collapsed && !_editor.revealed)
        );
    }

    // editEvent is the single entry point in the base class.
    // Subclass implementations of the action may differ, so are implemented in doEditEvent
    async doEditEvent(eventRecord, resourceRecord, element = null) {
        const
            me            = this,
            { scheduler } = me,
            isNewRecord   = eventRecord.isCreating;

        if (!resourceRecord) {
            // Need to handle resourceId for edge case when creating an event with resourceId and editing it before
            // adding it to the EventStore
            resourceRecord = eventRecord.resource || me.resourceStore.getById(eventRecord.resourceId);
        }

        if (isNewRecord) {
            // Ensure temporal data fields are ready when the editor is shown
            TimeSpan.prototype.normalize.call(eventRecord);
        }

        // If element is specified (call triggered by EventDragCreate)
        // Then we can align to that, and no scrolling is necessary.
        // If we are simply being asked to edit a new event which is not
        // yet added, the editor is centered, and no scroll is necessary
        if (element || isNewRecord || eventRecord.resources.length === 0) {
            return me.internalShowEditor(eventRecord, resourceRecord, element ? {
                target : element
            } : null);
        }
        else {
            const dimension = scheduler.isVertical ? 'maxHeight' : 'maxWidth';

            // Ensure the main part of the event is in view before showing the editor.
            // Note that we first need to extend the time axis to include
            // currently out of range events.
            await scheduler.scrollResourceEventIntoView(resourceRecord, eventRecord, {
                [dimension]    : me.minEditSize,
                animate        : true,
                edgeOffset     : 0,
                extendTimeAxis : false
            });

            if (!scheduler.isDestroyed) {
                await me.internalShowEditor(eventRecord, resourceRecord);
                if (!scheduler.isDestroyed) {
                    scheduler.removeCls('b-event-editor-editing');
                }
            }
        }
    }

    /**
     * Sets fields values from record being edited
     * @private
     */
    loadRecord(eventRecord, resourceRecord) {
        this.loadingRecord = true;

        this.internalLoadRecord(eventRecord, resourceRecord);

        this.loadingRecord = false;
    }

    get eventRecord() {
        return this._editor?.record;
    }

    internalLoadRecord(eventRecord, resourceRecord) {
        const
            me                        = this,
            { eventStore }            = me.client,
            { editor, resourceField } = me,
            { endTimeField }          = editor.widgetMap;

        me.resourceRecord = resourceRecord;

        // Update chained store early, to have records in place when setting value below (avoids adding the resource to
        // empty combo store, https://github.com/bryntum/bryntum/issues/5378). It is not done automatically for
        // grouping/trees or when project is replaced
        if (resourceField && resourceField.store?.masterStore !== me.resourceStore) {
            resourceField.store = editor.chainResourceStore();
        }

        if (endTimeField) {
            // Clear before setting new values to not trigger validation fails. EndTimeField gets min value set in
            // "change" listener
            endTimeField.min = null;
        }

        editor.record = eventRecord;

        if (resourceField) {
            const resources = eventStore.assignmentStore.getResourcesForEvent(eventRecord);

            // Flag on parent Container to indicate that initially blank fields are valid
            editor.assigningValues = true;

            // If this is an unassigned event, select the resource we've been provided
            if (!eventRecord.isOccurrence && !eventStore.storage.includes(eventRecord, true) && resourceRecord) {
                me.resourceField.value = resourceRecord.getValue(me.resourceField.valueField);
            }
            else if (me.assignmentStore) {
                me.resourceField.value = resources.map((resource) => resource.getValue(me.resourceField.valueField));
            }
            editor.assigningValues = false;
        }


    }

    toggleEventType(eventType) {
        // expose eventType in dataset, for querying and styling
        this.editor.element.dataset.eventType = eventType || '';

        this.editor.eachWidget(widget => { // need {}'s here so we don't return false and end iteration
            widget.dataset?.eventType && (widget.hidden = widget.dataset.eventType !== eventType);
        });
    }

    //endregion

    //region Save

    async finalizeEventSave(eventRecord, resourceRecords, resolve, reject) {
        const
            me = this,
            {
                scheduler,
                assignmentStore,
                afterEventSaveEventName
            }  = me;

        const aborted = false;

        // Prevent multiple commits from this flow
        assignmentStore.suspendAutoCommit();

        // Avoid multiple redraws, from event changes + assignment changes
        scheduler.suspendRefresh();

        me.onBeforeSave(eventRecord);

        eventRecord.beginBatch();
        me.updateRecord(eventRecord);
        eventRecord.endBatch();

        if (!eventRecord.isOccurrence) {
            if (me.resourceField) {
                assignmentStore.assignEventToResource(eventRecord, resourceRecords, null, true);
            }
        }
        // An occurrence event record may have changed only resources value. In that case we'll never get into afterChange() method that
        // apply changed data and make an event "real", because resources is not a field and a record won't be marked as dirty.
        // We used temporary field to save updated resources list and get into afterChange() method.
        else if (resourceRecords) {
            eventRecord.set('resourceRecords', resourceRecords);
        }

        // If it was a provisional event, passed in here from drag-create or dblclick or contextmenu,
        // it's now it's no longer a provisional event and will not be removed in resetEditingContext
        // Also, when promoted to be permanent, auto syncing will kick in if configured.
        eventRecord.isCreating = false;

        if (!aborted) {
            await scheduler.project.commitAsync();
        }

        assignmentStore.resumeAutoCommit();

        // Redraw once
        scheduler.resumeRefresh(true);

        if (!aborted) {
            /**
             * Fires on the owning Scheduler after an event is successfully saved
             * @event afterEventSave
             * @on-owner
             * @param {Scheduler.view.Scheduler} source The scheduler instance
             * @param {Scheduler.model.EventModel} eventRecord The record about to be saved
             */
            scheduler.trigger(afterEventSaveEventName, me.composeEditEventData({ eventRecord }));
            me.onAfterSave(eventRecord);
        }
        resolve(aborted ? false : eventRecord);
    }

    /**
     * Saves the changes (applies them to record if valid, if invalid editor stays open)
     * @private
     * @fires beforeEventSave
     * @fires beforeEventAdd
     * @fires afterEventSave
     * @async
     */
    save() {
        return new Promise((resolve, reject) => {
            const
                me = this,
                {
                    scheduler,
                    eventRecord,
                    beforeEventSaveEventName
                }  = me;

            if (!eventRecord || !me.editor.isValid) {
                resolve(false);
                return;
            }

            const
                { eventStore, values } = me,
                resourceRecords        = me.resourceField?.records || (me.resourceRecord ? [me.resourceRecord] : []);

            // Check for potential overlap scenarios before saving (currently not supported in Calendar, hence check
            // for isDateRangeAvailable API)
            if (eventStore && scheduler.isDateRangeAvailable) {
                let { startDate, endDate } = values;

                // Should support using a duration field instead of the end date field
                if (!endDate) {
                    if ('duration' in values) {
                        endDate = DateHelper.add(startDate, values.duration, values.durationUnit || eventRecord.durationUnit);
                    }
                    else if ('fullDuration' in values) {
                        endDate = DateHelper.add(startDate, values.fullDuration);
                    }
                    else {
                        endDate = eventRecord.endDate;
                    }
                }

                const valid = scheduler.isDateRangeAvailable(startDate, endDate, eventRecord, resourceRecords);

                if (!valid) {
                    const { startDateField } = this.editor.widgetMap;

                    if (startDateField) {
                        startDateField.setError(me.L('L{EventDrag.eventOverlapsExisting}'), false, true);
                        startDateField.focus();
                    }
                    resolve(false);
                    return;
                }
            }

            const context = {
                finalize(saveEvent) {
                    try {
                        if (saveEvent !== false) {
                            me.finalizeEventSave(eventRecord, resourceRecords, resolve, reject);
                        }
                        else {
                            resolve(false);
                        }
                    }
                    catch (e) {
                        reject(e);
                    }
                }
            };

            /**
             * Fires on the owning Scheduler before an event is saved.
             * Return `false` to immediately prevent saving
             *
             * ```javascript
             *  scheduler.on({
             *      beforeEventSave() {
             *          // prevent saving if some custom variable hasn't 123 value
             *          return myCustomValue === 123;
             *      }
             *  });
             * ```
             * or a `Promise` yielding `true` or `false` for async vetoing.
             *
             * ```javascript
             *  scheduler.on({
             *      beforeEventSave() {
             *          const
             *              // send ajax request
             *              response = await fetch('http://my-server/check-parameters.php'),
             *              data     = await response.json();
             *
             *          // decide whether it's ok to save based on response "okToSave" property
             *          return data.okToSave;
             *      }
             *  });
             * ```
             *
             * @event beforeEventSave
             * @on-owner
             * @param {Scheduler.view.Scheduler} source The scheduler instance
             * @param {Scheduler.model.EventModel} eventRecord The record about to be saved
             * @param {Scheduler.model.ResourceModel[]} resourceRecords The resources to which the event is assigned
             * @param {Object} values The new values
             * @param {Object} context Extended save context:
             * @param {Boolean} [context.async] Set this to `true` in a listener to indicate that the listener will asynchronously decide to prevent or not the event save.
             * @param {Function} context.finalize Function to call to finalize the save. Used when `async` is `true`. Provide `false` to the function to prevent the save.
             * @preventable
             * @async
             */
            const triggerResult = scheduler.trigger(beforeEventSaveEventName, me.composeEditEventData({
                eventRecord,
                resourceRecords,
                values,
                context
            }));

            // Helper function to handle beforeEventSave listeners result
            function handleEventResult(result, eventRecord, context) {
                // save prevented by a listener
                if (result === false) {
                    resolve(false);
                }
                else {
                    // <remove-on-release>
                    // TODO move this back to RecurringEventEdit mixin
                    // after fixing listeners in https://github.com/bryntum/bryntum-suite/issues/7438
                    // </remove-on-release>

                    // truthy context.async means than a listener will decide to approve saving asynchronously
                    if (!context.async) {
                        context.finalize();
                    }
                }
            }

            if (ObjectHelper.isPromise(triggerResult)) {
                triggerResult.then(result => handleEventResult(result, eventRecord, context));
            }
            else {
                handleEventResult(triggerResult, eventRecord, context);
            }
        });
    }

    //endregion

    //region Delete

    /**
     * Delete event being edited
     * @fires beforeEventDelete
     * @private
     * @async
     */
    async deleteEvent() {
        const
            { editor }    = this,
            { autoClose } = editor;

        this.detachListeners('changesWhileEditing');
        return await this.scheduler.removeEvents([this.eventRecord], this.client.isScheduler ? removeRecord => {
            // Callback only needed at Scheduler level.
            // The reason it does it here is to move focus *before* it gets deleted,
            // and then there's code in the delete to see that it's deleting the focused one,
            // and jump forwards or backwards to move to the next or previous event
            // See 'Should allow key activation' test in tests/view/mixins/EventNavigation.t.js
            if (removeRecord && editor.containsFocus) {
                // Prevent this from closing the editor
                editor.autoClose = false;
                editor.revertFocus();
                editor.autoClose = autoClose;
            }
        } : null, editor);
    }

    //endregion

    //region Stores

    onChangeProject() {
        // Release resource store on project change, it will be re-chained on next show
        if (this.resourceField) {
            this.resourceField.store = {}; // Cannot use null
        }
    }

    get eventStore() {
        return this.scheduler.project.eventStore;
    }

    get resourceStore() {
        return this.scheduler.project.resourceStore;
    }

    get assignmentStore() {
        return this.scheduler.project.assignmentStore;
    }

    //endregion

    //endregion

    //region Events

    onActivateEditor({ eventRecord, resourceRecord, eventElement, domEvent }) {
        const { ignoreSelector } = this;

        if (!ignoreSelector || !domEvent.target?.closest(ignoreSelector)) {
            this.editEvent(eventRecord, resourceRecord, eventElement);
        }
    }

    onDragCreateEnd({ eventRecord, resourceRecord, proxyElement, stmCapture }) {
        this.editEvent(eventRecord, resourceRecord, proxyElement, stmCapture);
    }

    // chained from EventNavigation
    onEventEnterKey({ assignmentRecord, eventRecord, target }) {
        const
            { client } = this,
            // Event can arrive from the wrap element in some products (such as Calendar)
            // so in these cases, we must use querySelector to look *inside* the element.
            element    = target[target.matches(client.eventSelector) ? 'querySelector' : 'closest'](client.eventInnerSelector);

        if (assignmentRecord) {
            this.editEvent(eventRecord, assignmentRecord.resource, element);
        }
        else if (eventRecord) {
            this.editEvent(eventRecord, eventRecord.resource, element);
        }
    }

    // Toggle fields visibility when changing eventType
    onEventTypeChange({ value }) {
        this.toggleEventType(value);
    }

    //endregion

    //region Context menu

    populateEventMenu({ eventRecord, resourceRecord, items }) {
        const
            me = this,
            canEdit =  !me.readOnly && !me.scheduler.readOnly && !eventRecord.readOnly && !me.disabled;

        items.editEvent = {
            text        : 'L{EventEdit.Edit event}',
            localeClass : me,
            icon        : 'b-icon b-icon-edit',
            weight      : 100,
            hidden      : !canEdit,
            onItem      : () => me.editEvent(eventRecord, resourceRecord)
        };
        items.showDetails = {
            text        : 'L{Object.showDetails}',
            localeClass : me,
            icon        : 'b-icon b-icon-show-details',
            weight      : 100,
            hidden      : canEdit,
            onItem      : () =>
                me.editEvent(eventRecord, resourceRecord)

        };
    }

    //endregion

    async resetEditingContext() {
        const me = this;

        me.detachListeners('changesWhileEditing');

        // super call has to go before the `me.rejectStmTransaction();` below
        // because it can be removing an event manually, bypassing the stm
        super.resetEditingContext();



        // Clear to prevent retaining project
        me.resourceRecord = null;
    }


}

EventEdit.initClass();
