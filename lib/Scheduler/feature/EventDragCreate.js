import DragCreateBase from './base/DragCreateBase.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';

DomHelper.loadStylesheet('Scheduler/feature/EventDragCreate.css');

// import Stylesheet from './EventDragCreate.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'EventDragCreate');
/**
 * @module Scheduler/feature/EventDragCreate
 */

/**
 * Feature that allows the user to create new events by dragging in empty parts of the scheduler rows.
 *
 * {@inlineexample Scheduler/feature/EventDragCreate.js}
 *
 * This feature is **enabled** by default.
 *
 * {@warning}Incompatible with the {@link Scheduler.feature.EventDragSelect} and
 * {@link Scheduler.feature.Pan} features. If either of those features are enabled, this feature has no effect.
 * {/@warning}
 *
 * ## Conditionally preventing drag creation
 *
 * To conditionally prevent drag creation for a certain resource or a certain timespan, you listen for the
 * {@link #event-beforeDragCreate} event, add your custom logic to it and return `false` to prevent the operation
 * from starting. For example to not allow drag creation on the topmost resource:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     listeners : {
 *         beforeDragCreate({ resource }) {
 *             // Prevent drag creating on the topmost resource
 *             if (resource === scheduler.resourceStore.first) {
 *                 return false;
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #event-beforeDragCreate}              | Fires before drag-create starts                     |
 * | {@link #event-dragCreateStart}               | Fires when drag-create begins                       |
 * | {@link #event-beforeDragCreateFinalize}      | Async finalizer before creation completes           |
 * | {@link #event-dragCreateEnd}                 | Fires when drag-create ends                         |
 * | {@link #event-afterDragCreate}               | Fires after event is created                        |
 * | {@link #config-lockLayout}                   | Lock row layout during drag-create                  |
 *
 * ## See also
 *
 * - {@link Scheduler.feature.EventDrag} - Drag to move events
 * - {@link Scheduler.feature.EventEdit} - Event editor
 *
 * @extends Scheduler/feature/base/DragCreateBase
 * @demo Scheduler/basic
 * @classtype eventDragCreate
 * @feature
 * @tier community
 */
export default class EventDragCreate extends DragCreateBase {
    //region Config

    static $name = 'EventDragCreate';

    static tier = 'community';

    static type = 'eventDragCreate';
    static defaultEnabled = true;
    static configurable = {
        /**
         * Locks the layout during drag create, overriding the default behaviour that uses the same rendering
         * pathway for drag creation as for already existing events.
         *
         * This more closely resembles the behaviour of versions prior to 4.2.0.
         *
         * Enabling this config also leads to cheaper drag creation, only the events of the affected resource are
         * refreshed during the operation.
         *
         * For even cheaper drag creation, configure it as `'minimal-updates'`. In this mode, no other events are
         * updated during the operation.
         *
         * @config {Boolean|'minimal-updates'} lockLayout
         * @default true
         */

        /**
         * An empty function by default, but provided so that you can perform custom validation on the event being
         * created. Return `true` if the new event is valid, `false` to prevent an event being created.
         * @param {Object} context A drag create context
         * @param {Date} context.startDate Event start date
         * @param {Date} context.endDate Event end date
         * @param {Scheduler.model.EventModel} context.record Event record
         * @param {Scheduler.model.ResourceModel} context.resourceRecord Resource record
         * @param {Event} event The event object
         * @returns {Boolean} `true` if this validation passes
         * @config {Function}
         */
        validatorFn : () => true
    };

    //endregion

    //region Events

    /**
     * Fires on the owning Scheduler after the new event has been created.
     * @event dragCreateEnd
     * @on-owner
     * @param {Scheduler.view.Scheduler} source
     * @param {Scheduler.model.EventModel} eventRecord The new `EventModel` record.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource for the row in which the event is being
     * created.
     * @param {MouseEvent} event The ending mouseup event.
     * @param {HTMLElement} eventElement The DOM element representing the newly created event un the UI.
     */

    /**
     * Fires on the owning Scheduler at the beginning of the drag gesture. Returning `false` from a listener prevents
     * the drag create operation from starting.
     *
     * ```javascript
     * const scheduler = new Scheduler({
     *     listeners : {
     *         beforeDragCreate({ date }) {
     *             // Prevent drag creating events in the past
     *             return date >= Date.now();
     *         }
     *     }
     * });
     * ```
     *
     * @event beforeDragCreate
     * @on-owner
     * @preventable
     * @param {Scheduler.view.Scheduler} source
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @param {Date} date The datetime associated with the drag start point.
     */

    /**
     * Fires on the owning Scheduler after the drag start has created a new Event record.
     * @event dragCreateStart
     * @on-owner
     * @param {Scheduler.view.Scheduler} source
     * @param {Scheduler.model.EventModel} eventRecord The event record being created
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource record
     * @param {HTMLElement} eventElement The element representing the new event.
     */

    /**
     * Fires on the owning Scheduler to allow implementer to prevent immediate finalization by setting
     * `data.context.async = true` in the listener, to show a confirmation popup etc.
     *
     * ```javascript
     *  scheduler.on('beforeDragCreateFinalize', ({context}) => {
     *      context.async = true;
     *      setTimeout(() => {
     *          // async code don't forget to call finalize
     *          context.finalize();
     *      }, 1000);
     *  })
     * ```
     *
     * Note that at this point the new `eventRecord` does not yet have the dates set, you can instead find the dates in
     * the context object.
     *
     * @event beforeDragCreateFinalize
     * @on-owner
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Scheduler.model.EventModel} eventRecord The event record being created
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource record
     * @param {HTMLElement} eventElement The element representing the new Event record
     * @param {Object} context
     * @param {Date} context.startDate The start date of the event being created
     * @param {Date} context.endDate The end date of the event being created
     * @param {Boolean} context.async Set true to handle drag create asynchronously (e.g. to wait for user
     * confirmation)
     * @param {Function} context.finalize Call this method to finalize drag create. This method accepts one
     * argument: pass true to update records, or false, to ignore changes
     */

    /**
     * Fires on the owning Scheduler at the end of the drag create gesture whether or not
     * a new event was created by the gesture.
     * @event afterDragCreate
     * @on-owner
     * @param {Scheduler.view.Scheduler} source
     * @param {Scheduler.model.EventModel} eventRecord The event record being created
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource record
     * @param {HTMLElement} eventElement The element representing the created event record
     */

    //endregion

    //region Init

    get scheduler() {
        return this.client;
    }

    get store() {
        return this.client.eventStore;
    }

    get project() {
        return this.client.project;
    }

    updateLockLayout(lock) {
        this.dragActiveCls = `b-drag-creating${lock ? ' b-drag-create-lock' : ''}`;
    }

    //endregion

    //region Scheduler specific implementation

    handleBeforeDragCreate(drag, eventRecord, event) {
        const
            me            = this,
            { scheduler } = me,
            {
                // provided if user is dragging over a model link
                resourceRecordLink,
                // actual resource model
                resourceRecord
            } = drag;

        // Prevent drag if:
        // - the feature is disabled
        if (me.disabled ||
            // - resource is read only
            resourceRecord.readOnly ||
            // - resource record is not visible (collapsed or filtered out?)
            !(
                scheduler.resourceStore.isAvailable(resourceRecord) ||
                // if that's a model link then check "store" (could be a view store made by TreeGroup)
                resourceRecordLink && scheduler.store.isAvailable(resourceRecordLink)
            ) ||
            // - date range is not allocated for the resource
            !scheduler.isDateRangeAvailable(drag.mousedownDate, drag.mousedownDate, null, resourceRecord)
        ) {
            return false;
        }

        const
            // For resources with a calendar, ensure the date is inside a working time range
            isWorkingTime      = !scheduler.isEnterpriseTier || eventRecord.ignoreResourceCalendar || resourceRecord.isWorkingTime(drag.mousedownDate),
            result             = isWorkingTime && scheduler.trigger('beforeDragCreate', {
                resourceRecord,
                date : drag.mousedownDate,
                event
            });

        // Save date constraints
        me.dateConstraints = scheduler.getDateConstraints?.(resourceRecord, eventRecord);

        return result;
    }

    dragStart(drag) {
        const
            me         = this,
            { client } = me;



        const
            {
                eventStore,
                assignmentStore,
                enableTransactionalFeatures
            }               = client,
            { changeEvent } = client.transition,
            {
                // provided if user is dragging over a model link
                resourceRecordLink,
                // actual resource model
                resourceRecord
            }               = drag,
            eventRecord     = me.createEventRecord(drag),
            resourceRecords = [resourceRecord];

        eventRecord.set('duration', DateHelper.diff(eventRecord.startDate, eventRecord.endDate, eventRecord.durationUnit, true));

        // It's only a provisional event until gesture is completed (possibly longer if an editor dialog is shown after)
        eventRecord.isCreating = true;

        // Flag used by rendering to not draw a zero length event being drag created as a milestone
        eventRecord.meta.isDragCreating = true;

        // force the transaction canceling in the taskeditor early
        // this is because we are going to add a new event record to the store, and it has to be out of the
        // task editor's stm transaction
        // now there's a re-entrant protection in that method, so hopefully when it will be called by the
        // editor itself that's ok
        // `taskEdit === false` in some cases, so can't just use `?.` here
        client.features.taskEdit && client.features.taskEdit.doCancel();

        // This presents the event to be scheduled for validation at the proposed mouse/date point
        // If rejected, we cancel operation
        if (me.handleBeforeDragCreate(drag, eventRecord, drag.event) === false) {
            return false;
        }



        let assignmentRecords = [];

        if (resourceRecord) {
            if (eventStore.usesSingleAssignment || !enableTransactionalFeatures) {
                assignmentRecords = assignmentStore.assignEventToResource(eventRecord, resourceRecord);
            }
            else {
                // <remove-on-release>
                // TODO: Max and Nick should investigate why this is needed, better if assignment could be there when
                //   event is added to the store, to avoid having it included in chained stores that check for
                //   unassigned events
                // </remove-on-release>
                // Do not add record to the store just yet, otherwise records would get to the STM queue assignment first,
                // then event, which will break `store.added` bag after undo/redo.
                assignmentRecords = [assignmentStore.createRecord({
                    event    : eventRecord,
                    resource : resourceRecord
                })];
            }
        }

        // Vetoable beforeEventAdd allows cancel of this operation
        if (client.trigger('beforeEventAdd', { eventRecord, resourceRecords, assignmentRecords }) === false) {
            if (eventStore.usesSingleAssignment || !enableTransactionalFeatures) {
                assignmentStore.remove(assignmentRecords);
            }
            return false;
        }

        // When configured to lock layout during drag create, set a flag that HorizontalRendering will pick up to
        // exclude the new event from the layout calculations. It will then be at the topmost position in the "cell"
        if (me.lockLayout) {
            eventRecord.meta.excludeFromLayout = true;
        }

        client.onEventCreated?.(eventRecord);

        client.transition.changeEvent = false;

        const result = eventStore.add(eventRecord);
        this.project.commitAsync().then(() => {
            if (!client.isDestroyed) {
                client.transition.changeEvent = changeEvent;
            }
        });

        // EventStore `beforeAdd` could veto the operation
        if (!result) {
            if (eventStore.usesSingleAssignment || !enableTransactionalFeatures) {
                assignmentStore.remove(assignmentRecords);
            }

            return false;
        }

        if (!eventStore.usesSingleAssignment && enableTransactionalFeatures) {
            // Add assignment after event only to keep STM transaction sane
            assignmentStore.add(assignmentRecords[0]);
        }

        // Element must be created synchronously, not after the project's normalizing delays.
        // Overrides the check for isEngineReady in VerticalRendering so that the newly added record
        // will be rendered when we call refreshRows.
        client.isCreating = true;
        if (client.isHorizontal) {
            // Cheaper single row update in horizontal mode
            client.rowManager.renderRows([client.getRowFor(resourceRecordLink || resourceRecord)]);
        }
        else {
            // Only ever a single row in vertical mode
            client.refreshRows();
        }
        client.isCreating = false;

        // Set the element we are dragging
        drag.itemElement = drag.element = client.getElementFromEventRecord(eventRecord);

        // If the resource row is very tall, the event may have been rendered outside of the
        // visible viewport. If so, scroll it into view.
        if (drag.itemElement && !DomHelper.isInView(drag.itemElement)) {
            client.scrollable.scrollIntoView(drag.itemElement, {
                animate    : true,
                edgeOffset : client.barMargin
            });
        }

        return super.dragStart(drag);
    }

    checkValidity(context, event) {
        const
            me             = this,
            { client }     = me,
            // Nicer for users of validatorFn
            resourceRecord = context.resourceRecord = me.dragging.resourceRecord;

        if (!client.isDateRangeAvailable(context.startDate, context.endDate, context.eventRecord, resourceRecord)) {
            return {
                valid   : false,
                message : me.L('L{EventDrag.eventOverlapsExisting}')
            };
        }
        return me.createValidatorFn.call(me.validatorFnThisObj || me, context, event);
    }

    // Determine if resource already has events or not
    isRowEmpty(resourceRecord) {
        const events = this.store.getEventsForResource(resourceRecord);
        return !events || !events.length;
    }

    //endregion

    /**
     * Creates an event by the event object coordinates
     * @param {Object} drag The Bryntum event object
     * @private
     */
    createEventRecord(drag) {
        const
            me          = this,
            { client }  = me,
            dimension   = client.isHorizontal ? 'X' : 'Y',
            {
                timeAxis,
                eventStore,
                weekStartDay
            }           = client,
            {
                event,
                mousedownDate
            }           = drag,
            draggingEnd = me.draggingEnd = event[`page${dimension}`] > drag.startEvent[`page${dimension}`],
            eventConfig = {
                name      : eventStore.modelClass.fieldMap.name.defaultValue || me.L('L{Object.newEvent}'),
                startDate : draggingEnd ? DateHelper.floor(mousedownDate, timeAxis.resolution, null, weekStartDay) : mousedownDate,
                endDate   : draggingEnd ? mousedownDate : DateHelper.ceil(mousedownDate, timeAxis.resolution, null, weekStartDay)
            };

        // if project model has been imported from Gantt, we have to define constraint data directly to correct
        // auto-scheduling while dragCreate
        if (client.project.isGanttProjectMixin) {
            ObjectHelper.assign(eventConfig, {
                constraintDate : eventConfig.startDate,
                constraintType : 'startnoearlierthan'
            });
        }

        return eventStore.createRecord(eventConfig);
    }

    async internalUpdateRecord(context, eventRecord) {
        await super.internalUpdateRecord(context, eventRecord);

        // Toggle isCreating after ending batch, to make sure assignments can become persistable
        if (!this.client.hasEventEditor) {
            context.eventRecord.isCreating = false;
        }
    }

    async finalizeDragCreate(context) {
        const { meta } = context.eventRecord;

        // Remove the layout lock flag, event will jump into place as part of the finalization
        meta.excludeFromLayout = false;
        // Also allow new event to become a milestone now
        meta.isDragCreating    = false;

        const transferred = await super.finalizeDragCreate(context);



        return transferred;
    }

    async cancelDragCreate(context) {
        await super.cancelDragCreate(context);



        await this.afterCancel?.();
    }

    getTipHtml(...args) {
        const
            html        = super.getTipHtml(...args),
            { element } = this.tip;

        element.classList.add('b-sch-drag-create-tooltip');
        element.classList.toggle('b-too-narrow', this.dragging.context.tooNarrow);

        return html;
    }

    onAborted(context) {
        const { eventRecord, resourceRecord } = context.eventContexts[0];

        // The product this is being used in may not have resources.
        this.store.unassignEventFromResource?.(eventRecord, resourceRecord);
        this.store.remove(eventRecord);
    }
}

EventDragCreate.initClass();
