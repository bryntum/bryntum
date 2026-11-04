import DragBase from '../../Scheduler/feature/base/DragBase.js';
import GanttFeature from './GanttFeature.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import EventHelper from '../../Core/helper/EventHelper.js';


DomHelper.loadStylesheet('Gantt/feature/TaskDrag.css');

// import Stylesheet from './TaskDrag.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TaskDrag');

/**
 * @module Gantt/feature/TaskDrag
 */

/**
 * @typedef {Object} ValidationMessage
 * @property {Boolean} valid `true` for valid, `false` for invalid
 * @property {String} message Validation message
 */

/**
 * Object containing information on the dragged tasks.
 *
 * @typedef {Object} TaskDragData
 * @extends DragData
 * @param {Gantt.model.TaskModel} taskRecord Dragged task (use `taskRecords` for the full array of dragged records).
 * @param {Gantt.model.TaskModel[]} taskRecords Dragged tasks.
 */

/**
 * Allows user to drag and drop tasks within Gantt, to change their start date.
 *
 * ## Constraining the drag drop area
 *
 * You can constrain how the dragged task is allowed to move by using {@link Gantt.view.Gantt#config-getDateConstraints}.
 * This method is configured on the Gantt instance and lets you define the date range for the dragged task programmatically.
 *
 * ## Drag drop tasks from outside
 *
 * Dragging unplanned tasks from an external grid is a very popular use case. Please refer to the [Drag from grid demo](../examples/drag-from-grid)
 * and study the [Drag from grid guide](#Gantt/guides/dragdrop/drag_tasks_from_grid.md) to learn more.
 *
 * ## Validating a drag drop operation
 *
 * It is easy to programmatically decide what is a valid drag drop operation. Use the {@link #config-validatorFn}
 * and return either `true` / `false` (optionally a message to show to the user).
 *
 * ```javascript
 * features : {
 *     taskDrag : {
 *        validatorFn(draggedTaskRecords, newStartDate) {
 *            const valid = Date.now() >= newStartDate;
 *
 *            return {
 *                valid,
 *                message : valid ? '' : 'Not allow to drag a task into the past'
 *            };
 *        }
 *     }
 * }
 * ```
 *
 * If you instead want to do a single validation upon drop, you can listen to {@link #event-beforeTaskDropFinalize}
 * and set the `valid` flag on the context object provided.
 *
 * ```javascript
 * const gantt = new Gantt({
 *     listeners : {
 *         beforeTaskDropFinalize({ context }) {
 *             const { taskRecords } = context;
 *             // Don't allow dropping a task in the past
 *             context.valid = Date.now() <= eventRecords[0].startDate;
 *         }
 *     }
 * });
 * ```
 *
 * ## Preventing drag of certain tasks
 *
 * To prevent certain tasks from being dragged, you have two options. You can set {@link Gantt.model.TaskModel#field-draggable}
 * to `false` in your data, or you can listen for the {@link Gantt.view.Gantt#event-beforeTaskDrag} event and
 * return `false` to block the drag.
 *
 * ```javascript
 * new Gantt({
 *     listeners : {
 *         beforeTaskDrag({ taskRecord }) {
 *             // Only allow dragging tasks that has not started
 *             return taskRecord.percentDone === 0;
 *         }
 *     }
 * })
 * ```
 *
 * ## Customizing the drag drop tooltip
 *
 * To show custom HTML in the tooltip, please see the {@link #config-tooltipTemplate} config. Example:
 *
 * ```javascript
 * features: {
 *     taskDrag: {
 *         // A minimal start date tooltip
 *         tooltipTemplate : ({ taskRecord, startDate }) => {
 *             return DateHelper.format(startDate, 'HH:mm');
 *         }
 *     }
 * }
 * ```
 *
 * This feature is **enabled** by default
 *
 * @extends Scheduler/feature/base/DragBase
 * @demo Gantt/basic
 * @classtype taskDrag
 * @feature
 * @tier community
 */
export default class TaskDrag extends DragBase

{
    //region Config

    static $name = 'TaskDrag';

    static tier = 'community';

    static type = 'taskDrag';

    // Registers with the Gantt factory, see GridFeature#featureFactory
    static featureFactory = GanttFeature;
    static defaultEnabled = true;
    static configurable = {
        recordProperty : 'taskRecord',

        recordsProperty : 'taskRecords',

        /**
         * Function that updates the dragged records.
         * Use this config to customize how the drag changes are applied to the data.
         *
         * Providing this function replaces the internal calls to the {@link #function-updateRecords} method on drop,
         * replacing it with your own logic.
         * If you instead want to extend the default logic, you can can call it from the provided function:
         *
         * ```javascript
         * taskDrag : {
         *     async updateRecordsFn(...args) {
         *         // call default logic first
         *         await this.updateRecords(...args);
         *
         *         // some additional custom code goes here
         *         ...
         *     }
         * }
         * ```
         *
         * @config {Function|String} updateRecordsFn
         * @param {TaskDragData} dragData Drag data.
         * @returns {Promise|void} Can return a `Promise` resolving once the changes are applied
         * (if the process is asynchronous).
         */

        /**
         * An empty function by default, but provided so that you can perform custom validation on
         * the item being dragged. This function is called during the drag and drop process and also after the drop is made.
         * Return true if the new position is valid, false to prevent the drag.
         * @param {Gantt.model.TaskModel[]} taskRecords An array of tasks being dragged
         * @param {Date} startDate The new start date
         * @param {Number} duration The duration of the item being dragged
         * @param {Event} event The event object
         * @returns {Boolean|ValidationMessage} `true` if this validation passes, `false` if it does not.
         *
         * Or an object with 2 properties: `valid` -  Boolean `true`/`false` depending on validity,
         * and `message` - String with a custom error message to display when invalid.
         * @config {Function}
         */
        validatorFn : (taskRecords, startDate, duration, event) => true,

        /**
         * `this` reference for the validatorFn
         * @config {Object}
         */
        validatorFnThisObj : null,

        /**
         * Gets or sets special key to activate successor pinning behavior. Supported values are:
         * * 'ctrl'
         * * 'shift'
         * * 'alt'
         * * 'meta'
         *
         * Assign false to disable it.
         * @member {Boolean|String} pinSuccessors
         */
        /**
         * Set to `true` to enable dragging task while pinning dependent tasks. By default, this behavior is activated
         * if you hold CTRL key during drag. Alternatively, you may provide key name to use. Supported values are:
         * * 'ctrl'
         * * 'shift'
         * * 'alt'
         * * 'meta'
         *
         * **Note**: Only supported in forward-scheduled project
         *
         * @config {Boolean|String}
         * @default false
         */
        pinSuccessors : false,

        /**
         * Set to `true` to drag all selected tasks. Set to `false` to only drag one task at a time
         * @prp {Boolean}
         * @default true
         */
        dragAllSelectedTasks : true,

        tooltipCls : 'b-gantt-task-drag-tooltip'
    };

    changePinSuccessors(value) {
        return EventHelper.toSpecialKey(value);
    }

    /**
     * Template used to generate drag tooltip contents.
     * ```javascript
     * const gantt = new Gantt({
     *     features : {
     *         taskDrag : {
     *             tooltipTemplate({taskRecord, startText}) {
     *                 return `${taskRecord.name}: ${startText}`
     *             }
     *         }
     *     }
     * });
     * ```
     * @config {Function} tooltipTemplate
     * @param {Object} data Tooltip data
     * @param {Gantt.model.TaskModel} data.taskRecord
     * @param {Boolean} data.valid Currently over a valid drop target or not
     * @param {Date} data.startDate New start date
     * @param {Date} data.endDate New end date
     * @returns {String}
     */

    //endregion

    //region Events

    /**
     * Fires on the owning Gantt before task dragging starts. Return false to prevent the action.
     * @event beforeTaskDrag
     * @preventable
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel} taskRecord
     * @param {Event} event The native browser event
     * @param {MouseEvent} domEvent Browser event
     */

    /**
     * Fires on the owning Gantt when task dragging starts
     * @event taskDragStart
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel[]} taskRecords
     * @param {TaskDragData} dragData Object containing information about the drag operation
     */

    /**
     * Fires on the owning Gantt while a task is being dragged
     * @event taskDrag
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel[]} taskRecords
     * @param {Date} startDate
     * @param {Date} endDate
     * @param {Object} dragData
     * @param {Boolean} changed `true` if startDate has changed.
     */

    /**
     * Fires on the owning Gantt to allow implementer to prevent immediate finalization by setting `data.context.async = true`
     * in the listener, to show a confirmation popup etc
     * ```javascript
     * gantt.on('beforetaskdropfinalize', ({ context }) => {
     *     context.async = true;
     *     setTimeout(() => {
     *         // async code don't forget to call finalize
     *         context.finalize();
     *     }, 1000);
     * })
     * ```
     * @event beforeTaskDropFinalize
     * @on-owner
     * @param {Gantt.view.Gantt} source Gantt instance
     * @param {Object} context
     * @param {Gantt.model.TaskModel[]} context.taskRecords The dragged task records
     * @param {Boolean} context.valid Set this to `false` to mark the drop as invalid
     * @param {Boolean} context.async Set true to handle dragdrop asynchronously (e.g. to wait for user
     * confirmation)
     * @param {Function} context.finalize Call this method to finalize dragdrop. This method accepts one
     * argument: pass true to update records, or false, to ignore changes
     */

    /**
     * Fires on the owning Gantt after a valid task drop
     * @event taskDrop
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel[]} taskRecords
     */

    /**
     * Fires on the owning Gantt after a task drop, regardless if the drop validity
     * @event afterTaskDrop
     * @on-owner
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel[]} taskRecords
     * @param {TaskDragData} context Object containing information about the drag operation
     * @param {Boolean} valid
     */

    /**
     * Fires on the owning Gantt after a task drag operation regardless of the operation being cancelled or not
     * @event taskDragReset
     * @on-owner
     * @param {Gantt.view.Gantt} source Gantt instance
     */

    //endregion

    //region Init

    construct(config) {
        this.gantt = config.client;

        super.construct(config);
    }

    get store() {
        return this.gantt.store;
    }

    //endregion

    //region Drag events

    getDraggableElement(el) {
        return el?.closest(this.drag.targetSelector);
    }

    resolveEventRecord(eventElement, client = this.client) {
        return client.resolveTaskRecord(eventElement);
    }

    isElementDraggable(el, event) {
        const
            me           = this,
            { client }   = me,
            eventElement = me.getDraggableElement(el);

        if (!eventElement || me.disabled || client.readOnly) {
            return false;
        }

        // displaying something resizable within the event?
        // if (el.closest(gantt.eventSelector).matches('[class$="-handle"]')) {
        if (el.matches('[class$="-handle"]')) {
            return false;
        }

        const eventRecord = me.resolveEventRecord(eventElement, client);

        // Tasks not part of project are transient tasks in a display store, which are not meant to be manipulated
        if (!eventRecord || !eventRecord.isDraggable || eventRecord.readOnly || !eventRecord.project || !eventRecord.isScheduled) {
            return false;
        }

        // Hook for features that need to prevent drag
        const prevented = client[`is${me.capitalizedEventName}ElementDraggable`]?.(
            eventElement, eventRecord, el, event
        ) === false;

        return !prevented;
    }

    triggerBeforeEventDrag(eventType, event) {
        return this.client.trigger(eventType, event);
    }

    triggerEventDrag(dragData, start) {
        // Trigger the event on every mousemove so that features which need to adjust
        // Such as dependencies and baselines can keep adjusted.
        this.client.trigger('taskDrag', {
            taskRecords : dragData.taskRecords,
            startDate   : dragData.startDate,
            endDate     : dragData.endDate,
            dragData,
            changed     : dragData.startDate - start !== 0
        });
    }

    triggerDragStart(dragData) {
        this.client.trigger('taskDragStart', {
            taskRecords : dragData.taskRecords,
            dragData
        });

    }

    triggerDragAbort(dragData) {
        this.client.trigger('taskDragAbort', {
            taskRecords : dragData.taskRecords,
            context     : dragData
        });
    }

    triggerDragAbortFinalized(dragData) {

        this.client.trigger('taskDragAbortFinalized', {
            taskRecords : dragData.taskRecords,
            context     : dragData
        });
    }

    triggerDrop({ taskRecords, eventBarEls }) {
        this.currentOverClient.trigger('taskDrop', {
            taskRecords
        });

        // A date clamped back to its prior value fires no data-change event, so the dragged bars
        // keep their stale drag offset — explicitly redraw the dragged rows from committed data (#13351)
        eventBarEls.forEach(el => el && delete el.lastDomConfig);
        this.currentOverClient.refreshRows(taskRecords);
    }

    triggerAfterDrop(dragData, valid) {

        this.currentOverClient.trigger('afterTaskDrop', {
            taskRecords : dragData.taskRecords,
            context     : dragData,
            valid
        });
    }

    triggerBeforeEventDropFinalize(eventType, eventData, client) {
        client.trigger(eventType, eventData);
    }

    //endregion

    //region Drag data

    getProductDragContext(dd) {
        return {
            valid : true
        };
    }

    getMinimalDragData(info) {
        const
            element    = this.getElementFromContext(info),
            taskRecord = this.client.resolveTaskRecord(element);

        return { taskRecord };
    }

    getTaskScheduleRegion(taskRecord, dateConstraints) {
        return this.client.getScheduleRegion(taskRecord, true, dateConstraints);
    }

    getDateConstraints(taskRecord) {
        return this.client.getDateConstraints?.(taskRecord);
    }

    setupProductDragData(context) {
        const
            me              = this,
            { client }      = me,
            element         = context.element,
            taskRecord      = client.resolveTaskRecord(element),
            taskRegion      = Rectangle.from(element),
            relatedRecords  = me.getRelatedRecords(taskRecord) || [],
            dateConstraints = me.getDateConstraints(taskRecord),
            taskRecords     = client.selectedRecords.length < 2 || !me.dragAllSelectedTasks ? [taskRecord] : client.selectedRecords.filter(t => t.isScheduled && t.isDraggable),
            scheduleRegion  = me.getTaskScheduleRegion(taskRecord, dateConstraints);

        me.setupConstraints(
            scheduleRegion,
            taskRegion,
            client.timeAxisViewModel.snapPixelAmount,
            Boolean(dateConstraints)
        );

        // Collecting elements to drag
        const eventBarEls = taskRecord.isEventSegment ? [element] : taskRecords.map(r => client.getElementFromTaskRecord(r, false));

        taskRecords.push(...relatedRecords);

        return {
            taskRecord,
            taskRecords,
            dateConstraints,
            eventBarEls
        };
    }

    /**
     * Get correct axis coordinate.
     * @private
     * @param {Gantt.model.TaskModel} taskRecord Record being dragged
     * @param {HTMLElement} element Element being dragged
     * @param {Number[]} coord XY coordinates
     * @returns {Number|Number[]} X,Y or XY
     */
    getCoordinate(taskRecord, element, coord) {
        return coord[0];
    }

    //endregion

    //region Finalize & validation

    // Called from EventDragBase to assert if a drag is valid or not
    checkDragValidity(dragData, event) {
        return this.validatorFn.call(this.validatorFnThisObj || this,
            dragData.taskRecords,
            dragData.startDate,
            dragData.duration,
            event
        );
    }

    /**
     * Checks if a task can be dropped on the specified location
     * @private
     * @returns {Boolean} Valid (true) or invalid (false)
     */
    isValidDrop(dragData) {
        return true;
    }

    /**
     * Updates the dragged task records.
     * The method is called to apply changes to the records on successful completion of the drag operation.
     *
     * Should not be called directly, except if the app is configured with a {@link #config-updateRecordsFn}
     * to customize the logic for applying changes.
     * @returns {Promise|void} Can return a `Promise` resolving once the changes are applied
     * (if the process is asynchronous).
     */
    async updateRecords(dragData) {
        const
            {
                client,
                pinSuccessors
            }             = this,
            {
                startDate,
                browserEvent,
                taskRecord,
                taskRecords
            }             = dragData,
            oldStartDate  = taskRecord.startDate,
            timeDelta     = startDate - oldStartDate,
            oldStartDates = taskRecords.map(task => task.startDate),
            // The same for every task, `browserEvent` is the event which ended the drag. Optional chained since a
            // custom `updateRecordsFn` may call this with a synthetic `dragData`
            pinning       = Boolean(pinSuccessors && browserEvent?.[pinSuccessors]);

        client.suspendRefresh();

        try {
            taskRecords.forEach((task, i) => {
                // Pre-drag date. Dragging a task together with its parent would otherwise read the date the parent
                // shifted the child to and apply `timeDelta` to the child twice
                const oldDate = oldStartDates[i];

                if (oldDate) {
                    const newStartDate = task === taskRecord ? startDate : DateHelper.add(oldDate, timeDelta, 'ms');
                    if (client.tier === 'community') {
                        task.startDate = newStartDate;
                    }

                }
            });

            await client.project.commitAsync();
        }
        finally {
            client.resumeRefresh();
        }

        // Rejected if the startDate of no task changed
        if (taskRecords.every((task, i) => task.startDate - oldStartDates[i] === 0)) {
            dragData.valid = false;
        }
    }

    getRecordElement(task) {
        return this.client.getElementFromTaskRecord(task, true);
    }

    get tipId() {
        return `${this.client.id}-task-drag-tip`;
    }

    //endregion
}

TaskDrag.initClass();
