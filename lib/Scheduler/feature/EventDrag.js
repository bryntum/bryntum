import DragBase from './base/DragBase.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import Rectangle, { Point } from '../../Core/helper/util/Rectangle.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import BrowserHelper from '../../Core/helper/BrowserHelper.js';


DomHelper.loadStylesheet('Scheduler/feature/EventDrag.css');

// import Stylesheet from './EventDrag.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'EventDrag');

/**
 * @module Scheduler/feature/EventDrag
 */

/**
 * Object with information on the dragged events.
 *
 * @typedef {Object} EventDragData
 * @extends DragData
 * @param {Scheduler.model.AssignmentModel} assignmentRecord Dragged assignment (use `assignmentRecords` for the full
 * array of dragged records).
 * @param {Scheduler.model.AssignmentModel[]} assignmentRecords Dragged assignments.
 * @param {Scheduler.model.EventModel} eventRecord Dragged event (use `eventRecords` for the full
 * array of dragged records).
 * @param {Scheduler.model.EventModel[]} eventRecords Dragged events.
 * @param {Scheduler.model.ResourceModel} resourceRecord Dragged event resource (initial one if dragging
 * to another resource).
 * @param {Scheduler.model.ResourceModel} newResource The new resource record (if dragging
 * to another resource).
 */

/**
 * Object with information about the drop point for a single dragged event.
 *
 * @typedef {Object} EventDropData
 * @property {Scheduler.model.EventModel} eventRecord The event about to be dropped. Note, that when
 * "copying" mode is enabled, this will still be the originally dragged event, not the copy
 * (which will be created only during drag'n'drop finalization).
 * @property {Date} startDate The estimated start date of the event after drop. Note, that actual start date
 * might be different because of the other features, affecting the scheduling, like dependencies and constraints.
 * @property {Date} endDate The estimated end date of the event after drop. Note, that actual end date
 * might be different because of the other features, affecting the scheduling, like dependencies and constraints.
 */

/**
 * Object with information about the drop point for a dragged assignment.
 *
 * @typedef {Object} AssignmentDropData
 * @property {Scheduler.model.AssignmentModel} assignmentRecord The assignment about to be dropped. Note, that in case
 * if "copying" mode is enabled, this will still be the originally dragged assignment, not the copy
 * (which will be created only during drag'n'drop finalization).
 * @property {Scheduler.model.ResourceModel} resourceRecord The new resource for the assignment. Note, that resource
 * might belong to another project (in case of drag and drop between different scheduler instances).
 */

/**
 * Object with information about the drop points for the dragged events.
 * It is used in the Scheduler's {@link Scheduler.view.Scheduler#event-beforeEventDropFinalize} event.
 *
 * @typedef {Object} DropData
 * @property {Array<EventDropData>} events The array of drop points for every dragged event.
 * @property {Array<AssignmentDropData>} assignments The array of drop points for every dragged assignment.
 */

/**
 * Object specifying how constraints and dependencies should be treated when dragging in engine-driven products.
 *
 * @typedef {Object} ConstrainDragByEngineData
 * @property {Boolean} constraints `true` to constrain by constraints
 * @property {Boolean} dependencies `true` to constrain by dependencies
 * @tier enterprise
 */

/**
 * Allows user to drag and drop events within the scheduler, to change `startDate` or resource assignment.
 *
 * {@inlineexample Scheduler/feature/EventDrag.js}
 *
 * This feature is **enabled** by default
 *
 * ## Customizing the drag drop tooltip
 *
 * To show custom HTML in the tooltip, please see the {@link #config-tooltipTemplate} config. Example:
 *
 * ```javascript
 * features: {
 *     eventDrag : {
 *         // A minimal start date tooltip
 *         tooltipTemplate : ({ eventRecord, startDate }) => {
 *             return DateHelper.format(startDate, 'HH:mm');
 *         }
 *     }
 * }
 * ```
 *
 * ## Constraining the drag drop area
 *
 * You can constrain how the dragged event is allowed to move by using the following configs
 * * {@link #config-constrainDragToResource} Resource fixed, only allowed to change start date
 * * {@link #config-constrainDragToTimeSlot} Start date is fixed, only move between resources
 * * {@link Scheduler.view.Scheduler#config-getDateConstraints} A method on the Scheduler instance
 *    which lets you define the date range for the dragged event programmatically
 *
 * ```javascript
 * // Enable dragging + constrain drag to current resource
 * const scheduler = new Scheduler({
 *     features : {
 *         eventDrag : {
 *             constrainDragToResource : true
 *         }
 *     }
 * });
 * ```
 *
 * ## Drag drop events from outside
 *
 * Dragging unplanned events from an external grid is a very popular use case. There are
 * several demos showing you how to do this. Please see the [Drag from grid demo](../examples/dragfromgrid)
 * and study the **Drag from grid guide** to learn more.
 *
 * ## Drag drop events to outside target
 *
 * You can also drag events outside the schedule area by setting {@link #config-constrainDragToTimeline} to `false`. You
 * should also either:
 * * provide a {@link #config-validatorFn} to programmatically define if a drop location is valid or not
 * * configure a {@link #config-externalDropTargetSelector} CSS selector to define where drops are allowed
 *
 * See [this demo](../examples/drag-outside) to see this in action.
 *
 * ## Validating drag drop
 *
 * It is easy to programmatically decide what is a valid drag drop operation. Use the {@link #config-validatorFn}
 * and return either `true` / `false` (optionally a message to show to the user).
 *
 * ```javascript
 * features : {
 *     eventDrag : {
 *        validatorFn({ eventRecords, newResource }) {
 *            const task  = eventRecords[0],
 *                  valid = newResource.role === task.resource.role;
 *
 *            return {
 *                valid   : newResource.role === task.resource.role,
 *                message : valid ? '' : 'Resource role does not match required role for this task'
 *            };
 *        }
 *     }
 * }
 * ```
 *
 * See [this demo](../examples/validation) to see validation in action.
 *
 * If you instead want to do a single validation upon drop, you can listen to {@link #event-beforeEventDropFinalize}
 * and set the `valid` flag on the context object provided.
 *
 * ```javascript
 *   const scheduler = new Scheduler({
 *      listeners : {
 *          beforeEventDropFinalize({ context }) {
 *              const { eventRecords } = context;
 *              // Don't allow dropping events in the past
 *              context.valid = Date.now() <= eventRecords[0].startDate;
 *          }
 *      }
 *  });
 * ```
 *
 * ## Preventing drag of certain events
 *
 * To prevent certain events from being dragged, you have two options. You can set {@link Scheduler.model.EventModel#field-draggable}
 * to `false` in your data, or you can listen for the {@link Scheduler.view.Scheduler#event-beforeEventDrag} event and
 * return `false` to block the drag.
 *
 * ```javascript
 * new Scheduler({
 *    listeners : {
 *        beforeEventDrag({ eventRecord }) {
 *            // Don't allow dragging events that have already started
 *            return Date.now() <= eventRecord.startDate;
 *        }
 *    }
 * })
 * ```
 *
 * {@note}
 * Events that are selected, but not visually accessible, are not included in drag operations. This means that events
 * in collapsed groups or filtered out resources are not dragged, even if they were selected prior to being collapsed
 * or filtered out of visibility.
 * {/@note}
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #event-beforeEventDrag}               | Fires before drag starts, return `false` to prevent |
 * | {@link #event-eventDragStart}                | Fires when event drag begins                        |
 * | {@link #event-eventDrag}                     | Fires continuously during drag                      |
 * | {@link #event-eventDrop}                     | Fires when event is dropped at new position         |
 * | {@link #event-beforeEventDropFinalize}       | Async finalizer before drop is applied              |
 * | {@link #config-tooltipTemplate}              | Template for the drag tooltip                       |
 *
 * ## See also
 *
 * - {@link Scheduler.feature.EventDragCreate} - Drag to create events
 * - {@link Scheduler.feature.EventResize} - Resize events by dragging
 *
 * @demo Scheduler/basic
 * @extends Scheduler/feature/base/DragBase
 * @classtype eventDrag
 * @feature
 * @tier community
 */
export default class EventDrag extends DragBase

{
    //region Config

    static $name = 'EventDrag';

    static tier = 'community';

    static type = 'eventDrag';
    static defaultEnabled = true;
    static configurable = {
        recordProperty : 'assignmentRecord',

        recordsProperty : 'assignmentRecords',

        /**
         * Function that updates the dragged records.
         * Use this config to customize how the drag changes are applied to the data.
         *
         * Providing this function replaces the internal calls to the {@link #function-updateRecords} method on drop,
         * replacing it with your own logic.
         * If you instead want to extend the default logic, you can can call it from the provided function:
         *
         * ```javascript
         * eventDrag : {
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
         * @param {EventDragData} dragData Drag data.
         * @returns {Promise|void} Can return a `Promise` resolving once the changes are applied
         * (if the process is asynchronous).
         */

        /**
         * Template used to generate drag tooltip contents.
         * ```javascript
         * const scheduler = new Scheduler({
         *     features : {
         *         eventDrag : {
         *             tooltipTemplate({eventRecord, startText}) {
         *                 return `${eventRecord.name}: ${startText}`
         *             }
         *         }
         *     }
         * });
         * ```
         * @config {Function} tooltipTemplate
         * @param {Object} data Tooltip data
         * @param {Scheduler.model.EventModel} data.eventRecord
         * @param {Scheduler.model.ResourceModel} data.newResource The new resource record
         * @param {Boolean} data.valid Currently over a valid drop target or not
         * @param {Date} data.startDate New start date
         * @param {Date} data.endDate New end date
         * @returns {String}
         */

        /**
         * Set to `true` to only allow dragging in one direction (based on initial movement)
         * @prp {Boolean}
         * @default false
         */
        singleDirection : null,

        /**
         * Set to true to only allow dragging events within the same resource.
         * @prp {Boolean}
         * @default
         */
        constrainDragToResource : false,

        /**
         * Set to true to only allow dragging events to different resources, and disallow rescheduling by dragging.
         * @prp {Boolean}
         * @default
         */
        constrainDragToTimeSlot : false,

        /**
         * A CSS selector specifying elements outside the scheduler element which are valid drop targets.
         * @config {String}
         */
        externalDropTargetSelector : null,

        /**
         * An empty function by default, but provided so that you can perform custom validation on the item being
         * dragged. This function is called during the drag and drop process and also after the drop is made.
         * Return `true` if the new position is valid, `false` to prevent the drag.
         *
         * ```javascript
         * features : {
         *     eventDrag : {
         *         validatorFn({ eventRecords, newResource }) {
         *             const
         *                 task  = eventRecords[0],
         *                 valid = newResource.role === task.resource.role;
         *
         *             return {
         *                 valid   : newResource.role === task.resource.role,
         *                 message : valid ? '' : 'Resource role does not match required role for this task'
         *             };
         *         }
         *     }
         * }
         * ```
         * @param {Object} context A drag drop context object
         * @param {Date} context.startDate New start date
         * @param {Date} context.endDate New end date
         * @param {Scheduler.model.AssignmentModel[]} context.assignmentRecords Assignment records which were dragged
         * @param {Scheduler.model.EventModel[]} context.eventRecords Event records which were dragged
         * @param {Scheduler.model.ResourceModel} context.newResource New resource record
         * @param {Scheduler.model.EventModel} context.targetEventRecord Currently hovering this event record
         * @param {Event} event The event object
         * @returns {Boolean|Object} `true` if this validation passes, `false` if it does not.
         *
         * Or an object with 2 properties: `valid` -  Boolean `true`/`false` depending on validity,
         * and `message` - String with a custom error message to display when invalid.
         * @config {Function}
         */
        validatorFn : (context, event) => {},

        /**
         * The `this` reference for the validatorFn
         * @config {Object}
         */
        validatorFnThisObj : null,

        /**
         * A function which resolves the resource a drag operation would drop on, or the name of one (which may be
         * prefixed with `up.` to resolve it in the widget ownership hierarchy).
         *
         * Providing this replaces the feature's own {@link #function-resolveResource} for the whole drag, which by
         * default resolves the resource occluded by the *centre* of the drag proxy. Override it when that is not the
         * resource your app considers the drop target.
         *
         * The function is passed a single object argument and must return a resource record, or `null` when the drag
         * is not over one. Combined with {@link Scheduler.view.Scheduler#function-getResourceBounds}, whose coordinates
         * are in the same space as `coordinate`, it can be written once for both modes:
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     features : {
         *         eventDrag : {
         *             resolveResourceFn({ source, coordinate }) {
         *                 return source.resourceStore.records.find(resourceRecord => {
         *                     const bounds = source.getResourceBounds(resourceRecord);
         *
         *                     return bounds && bounds.start <= coordinate && bounds.end > coordinate;
         *                 }) ?? null;
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * To fall back to the default resolution for some drags, call {@link #function-resolveResource} on the
         * feature (`this`, unless a `up.`-prefixed name moved the `this` reference elsewhere).
         *
         * @config {Function|String}
         * @param {Object} context
         * @param {Scheduler.view.Scheduler} context.source The Scheduler the pointer is currently over. May be a
         * different instance than the drag started in, when dragging between schedulers
         * @param {Scheduler.model.EventModel} context.eventRecord The event being dragged
         * @param {Scheduler.model.AssignmentModel} context.assignmentRecord The assignment being dragged
         * @param {Scheduler.model.ResourceModel} context.resourceRecord The resource the drag started from
         * @param {Number} context.coordinate The dragged element's leading edge along the resource axis, tracking the
         * pointer and not yet snapped to a resource. This is the `y` axis in `horizontal` mode and the `x` axis in
         * `vertical` mode
         * @param {MouseEvent|TouchEvent} context.domEvent The browser event driving the drag
         * @returns {Scheduler.model.ResourceModel|null} The resource to drop on, or `null` when over none
         */
        resolveResourceFn : 'resolveResource',

        /**
         * When the host Scheduler is `{@link Scheduler.view.mixin.EventSelection#config-multiEventSelect}: true`
         * then, there are two modes of dragging *within the same Scheduler*.
         *
         * Non unified means that all selected events are dragged by the same number of resource rows.
         *
         * Unified means that all selected events are collected together and dragged as one, and are all dropped
         * on the same targeted resource row at the same targeted time.
         * @prp {Boolean}
         * @default false
         */
        unifiedDrag : null,

        /**
         * A hook that allows manipulating the position the drag proxy snaps to. Manipulate the `snapTo` property
         * to alter snap position.
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     features : {
         *         eventDrag : {
         *             snapToPosition({ eventRecord, snapTo }) {
         *                 if (eventRecord.late) {
         *                     snapTo.x = 400;
         *                 }
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * @config {Function}
         * @param {Object} context
         * @param {Scheduler.view.Scheduler} context.source The Scheduler the pointer is currently over. May be a
         * different instance than the drag started in, when dragging between schedulers
         * @param {Scheduler.model.AssignmentModel} context.assignmentRecord Dragged assignment
         * @param {Scheduler.model.EventModel} context.eventRecord Dragged event
         * @param {Scheduler.model.ResourceModel} context.resourceRecord Currently over this resource
         * @param {Date} context.startDate Start date for current position
         * @param {Date} context.endDate End date for current position
         * @param {Object} context.snapTo
         * @param {Number} context.snapTo.x X to snap to
         * @param {Number} context.snapTo.y Y to snap to
         * @returns {void}
         */
        snapToPosition : null,

        /**
         * Defaults to `true`, which snaps events to resources while dragging, i.e. vertical row snap in horizontal
         * mode and vice versa. Requires Scheduler to be configured to {@link Scheduler.view.Scheduler#config-snap}
         * to have any effect:
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     ...
         *     // Snap to time & resource
         *     snap : true
         * });
         * ```
         *
         * If you want to customize the number of pixels from the dragged event that will trigger the snapping
         * behavior to the new resource, you can set the `threshold` property:
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     ...
         *     snap     : true,
         *     features : {
         *         eventDrag : {
         *             // Customized snap threshold
         *             snapToResource : {
         *                 threshold : 30
         *             }
         *         }
         *     },
         *     ...
         * });
         * ```
         *
         * @prp {Boolean|Object}
         * @property {Number} [threshold] Amount of pixels from dragged event to the edge of new resource
         * that will trigger the snapping behaviour to the new resource.
         * @default
         */
        snapToResource : true,

        /**
         * A modifier key (CTRL, SHIFT, ALT, META) that when pressed will copy an event instead of moving it. Set to
         * empty string to disable copying. Defaults to "CTRL" which is the Ctrl-key for Windows, and Meta-key for
         * MacOS.
         * @prp {'CTRL'|'ALT'|'SHIFT'|'META'|''}
         * @default
         */
        copyKey : 'CTRL',

        /**
         * Event can be copied two ways: either by adding new assignment to an existing event ('assignment'), or
         * by copying the event itself ('event'). 'auto' mode will pick 'event' for a single-assignment mode (when
         * event has `resourceId` field) and 'assignment' mode otherwise.
         * @prp {'auto'|'assignment'|'event'}
         * @default
         */
        copyMode : 'auto',

        /**
         * Mode of the current drag drop operation.
         * @member {'move'|'copy'}
         * @readonly
         */
        mode : 'move',

        /**
         * Set this to `true` to always copy the event on drag drop operation.
         * @prp {Boolean}
         * @default false
         */
        alwaysCopy : null,

        /**
         * Whether to allow the SNET constraint generated by an event drag to be placed in non-working time. When `true`
         * and the event is dragged so that its `startDate` is in non-working time, the SNET constraint date will be
         * kept on the non-working date where the task is dropped. When `false`, snaps the SNET date to working time in
         * the same way as the `startDate`. The `startDate` is not affected by this config.
         *
         * Applies only when the scheduling engine is active (Enterprise tier and Gantt). Inert on the Community and
         * Business tiers of Scheduler.
         *
         * @config {Boolean}
         * @default false
         * @tier enterprise
         */
        allowNonWorkingTimeSNET : null,

        /**
         * Specifies how the engine should constrain dragged event dates — whether to adjust them according to the
         * event (and its parents) constraints and dependencies. Providing `true` enables both constraints and
         * dependencies; `false` disables both. Use an object to enable one selectively:
         *
         * ```javascript
         * constrainDragByEngine : {
         *     // honor dependencies but ignore constraints
         *     dependencies : true,
         *     constraints  : false
         * }
         * ```
         *
         * Applies only when the scheduling engine is active (Enterprise tier and Gantt).
         *
         * @config {Boolean|ConstrainDragByEngineData}
         * @default false
         * @tier enterprise
         */
        constrainDragByEngine : false
    };

    //endregion

    changeConstrainDragByEngine(value) {
        if (typeof value === 'boolean') {
            return {
                constraints  : value,
                dependencies : value
            };
        }
        return value;
    }

    changeMode(value) {
        const { dragData, copyMode } = this;

        // Do not create assignments in case scheduler doesn't use multiple assignments
        // Do not allow to copy recurring events
        if (
            (copyMode === 'event' || copyMode === 'auto' ||
                copyMode === 'assignment' && !this.scheduler.eventStore.usesSingleAssignment) &&
            (!dragData || dragData.eventRecords.every(r => !r.isRecurring))
        ) {
            return value;
        }
    }

    updateMode(mode) {
        if (this.dragData) {
            if (mode === 'copy') {
                this.setCopying();
            }
            else {
                this.setMoving();
            }

            /**
             * Triggered when drag mode is changed, for example when copy key is
             * pressed or released while dragging.
             * @event eventDragModeChange
             * @param {String} mode Drag mode, could be either 'move', 'copy', or 'auto'
             * @on-owner
             */
            this.client.trigger('eventDragModeChange', { mode });
        }
    }

    setCopying() {
        const { dragData } = this;

        if (!dragData) {
            return;
        }

        // Check if proxies are added to the DOM by checking if any of them is
        if (!dragData.eventBarCopies.some(el => el.isConnected)) {
            dragData.eventBarCopies.forEach(el => {
                el.classList.add('b-drag-proxy-copy');
                // hidden class can be added by the drag feature if we're dragging event outside
                el.classList.remove('b-hidden');

                dragData.context.grabbedParent.appendChild(el);
                // Mark this node as ignored for the DomSync
                el.retainElement = true;
            });
        }
        else {
            dragData.eventBarCopies.forEach(el => {
                el.classList.remove('b-hidden');
            });
        }
    }

    setMoving() {
        const { dragData } = this;

        if (!dragData) {
            return;
        }

        dragData.eventBarCopies.forEach(el => {
            el.classList.add('b-hidden');
        });
    }

    //region Events

    /**
     * This event is fired on the owning Scheduler after the event drag operation completes, but before changing any data.
     * It allows implementer to use asynchronous validation/finalization by setting `context.async = true`
     * in the listener, for example, to show a confirmation popup, make async data request etc.
     * In such case, implementer need to call the `context.finalize()` method manually:
     *
     * ```javascript
     *  scheduler.on('beforeeventdropfinalize', ({ context }) => {
     *      context.async = true;
     *      setTimeout(() => {
     *          // `true` to perform the drop, `false` to ignore it
     *          context.finalize(true);
     *      }, 1000);
     *  })
     * ```
     *
     * For synchronous one-time validation, simply set `context.valid` to true or false.
     * ```javascript
     *  scheduler.on('beforeeventdropfinalize', ({ context }) => {
     *      context.valid = false;
     *  })
     * ```
     * @event beforeEventDropFinalize
     * @on-owner
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Object} context
     * @param {DropData} context.dropData Information about the drop points for dragged events/assignments.
     * @param {Boolean} context.async Set to `true` to not finalize the drag-drop operation immediately (e.g. to wait for user confirmation)
     * @param {Scheduler.model.EventModel} context.eventRecord The primary event record being dragged
     * @param {Scheduler.model.EventModel[]} context.eventRecords Event records being dragged
     * @param {Scheduler.model.AssignmentModel[]} context.assignmentRecords Assignment records being dragged
     * @param {Scheduler.model.EventModel} context.targetEventRecord The event record (if any) where the drop happened
     * @param {Scheduler.model.ResourceModel} context.resourceRecord Resource record the drag started from
     * @param {Scheduler.model.ResourceModel} context.newResource Resource record for drop target
     * @param {Date} context.startDate New start date after the drop
     * @param {Date} context.endDate New end date after the drop
     * @param {Boolean} context.valid Set this to `false` to abort the drop immediately.
     * @param {Function} context.finalize Call this method after an **async** finalization flow, to finalize the drag-drop operation. This method accepts one
     * argument: pass `true` to update records, or `false` to ignore changes
     * @param {MouseEvent} domEvent Browser event
     */

    /**
     * Fired on the owning Scheduler after event drop
     * @event afterEventDrop
     * @on-owner
     * @param {Scheduler.view.Scheduler} source
     * @param {Scheduler.model.AssignmentModel[]} assignmentRecords
     * @param {Scheduler.model.EventModel[]} eventRecords
     * @param {Boolean} valid
     * @param {Object} context
     * @param {MouseEvent} domEvent Browser event
     */

    /**
     * Fired on the owning Scheduler when an event is dropped
     * @event eventDrop
     * @on-owner
     * @param {Scheduler.view.Scheduler} source
     * @param {Scheduler.model.EventModel[]} eventRecords
     * @param {Scheduler.model.AssignmentModel[]} assignmentRecords
     * @param {HTMLElement} externalDropTarget The HTML element dropped upon, if drop happened on a valid external drop target
     * @param {Boolean} isCopy
     * @param {Object} context
     * @param {Scheduler.model.EventModel} context.targetEventRecord Event record for drop target
     * @param {Scheduler.model.ResourceModel} context.newResource Resource record for drop target
     * @param {MouseEvent} domEvent Browser event
     */

    /**
     * Fired on the owning Scheduler before event dragging starts. Return `false` to prevent the action.
     * @event beforeEventDrag
     * @on-owner
     * @preventable
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Scheduler.model.EventModel} eventRecord Event record the drag starts from
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record the drag starts from
     * @param {Scheduler.model.EventModel[]} eventRecords Event records being dragged
     * @param {Scheduler.model.AssignmentModel[]} assignmentRecords Assignment records being dragged
     * @param {MouseEvent} domEvent Browser event
     */

    /**
     * Fired on the owning Scheduler when event dragging starts
     * @event eventDragStart
     * @on-owner
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record the drag starts from
     * @param {Scheduler.model.EventModel[]} eventRecords Event records being dragged
     * @param {Scheduler.model.AssignmentModel[]} assignmentRecords Assignment records being dragged
     * @param {MouseEvent} domEvent Browser event
     */

    /**
     * Fired on the owning Scheduler when event is dragged
     * @event eventDrag
     * @on-owner
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Scheduler.model.EventModel[]} eventRecords Event records being dragged
     * @param {Scheduler.model.AssignmentModel[]} assignmentRecords Assignment records being dragged
     * @param {Date} startDate Start date for the current location
     * @param {Date} endDate End date for the current location
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record the drag started from
     * @param {Scheduler.model.ResourceModel} newResource Resource at the current location
     * @param {Object} context
     * @param {Boolean} context.valid Set this to `false` to signal that the current drop position is invalid.
     * @param {MouseEvent} domEvent Browser event
     */

    /**
     * Fired on the owning Scheduler after an event drag operation has been aborted
     * @event eventDragAbort
     * @on-owner
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Scheduler.model.EventModel[]} eventRecords Event records being dragged
     * @param {Scheduler.model.AssignmentModel[]} assignmentRecords Assignment records being dragged
     * @param {MouseEvent} domEvent Browser event
     */
    /**
     * Fired on the owning Scheduler after an event drag operation regardless of the operation being cancelled or not
     * @event eventDragReset
     * @on-owner
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     */
    //endregion

    //region Data layer

    // Deprecated. Use this.client instead
    get scheduler() {
        return this.client;
    }

    //endregion

    //#region Drag lifecycle





    onAfterDragStart(event) {
        const
            me                        = this,
            { drag }                  = me,
            { context : { element } } = event;

        if (me.singleDirection) {
            drag.lockY = event.initialDirection === 'horizontal';
            drag.lockX = !drag.lockY;
        }
        super.onAfterDragStart(event);

        me.handleKeyDownOrMove(event.event);

        me.keyEventDetacher = EventHelper.on({
            // In case we drag event between scheduler focused event gets moved and focus
            // moves to the body. We only need to read the key from this event
            element : DomHelper.getRootElement(element),
            keydown : me.handleKeyDownOrMove,
            keyup   : me.handleKeyUp,
            thisObj : me
        });
    }

    onDragReset(event) {
        super.onDragReset(event);

        this.keyEventDetacher?.();

        this.mode = 'move';
    }

    onDrop(event) {
        // Always remove proxy on drop
        this.dragData.eventBarCopies?.forEach(el => el.remove());
        return super.onDrop(event);
    }

    //#endregion

    //region Drag events

    getDraggableElement(el) {
        return el?.closest(this.drag.targetSelector);
    }

    resolveEventRecord(eventElement, client = this.client) {
        return client.resolveEventRecord(eventElement);
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
        if (el.matches('[class$="-handle"]')) {
            return false;
        }

        const eventRecord = me.resolveEventRecord(eventElement, client);

        if (!eventRecord || !eventRecord.isDraggable || eventRecord.readOnly) {
            return false;
        }

        // Hook for features that need to prevent drag
        const prevented = client[`is${me.capitalizedEventName}ElementDraggable`]?.(
            eventElement, eventRecord, el, event
        ) === false;

        return !prevented;
    }

    // Overrides DragBase#getRowResource. The row might render the assignment for another resource (see
    // Scheduler#getRenderedResource())
    getRowResource(assignmentRecord, rowRecord) {
        return assignmentRecord && rowRecord ? this.client.getRenderedResource(assignmentRecord, rowRecord) : rowRecord;
    }

    // Resource the passed dragged assignment is dropped on, offset from the row it is rendered on. Pass the resource
    // it had when the drag started, it might have changed during the drag
    getAssignmentNewResource(dragData, assignmentRecord, indexDiff, resourceRecord = assignmentRecord.resource) {
        const row = this.client.getAssignmentRow(assignmentRecord);

        return this.getRowResource(
            assignmentRecord,
            this.getNewResource(dragData, row === assignmentRecord.resource ? resourceRecord : row, indexDiff)
        );
    }

    getTriggerParams(dragData) {
        const { assignmentRecords, eventRecords, browserEvent : domEvent } = dragData;

        return {
            // `context` is now private, but used in WebSocketHelper
            context        : dragData,
            eventRecords,
            resourceRecord : this.getRowResource(dragData.assignmentRecord, dragData.resourceRecord),
            assignmentRecords,
            domEvent
        };
    }

    getGroupedToStoreResources(dragData) {
        if (dragData.resourcesInStore) {
            return dragData.resourcesInStore;
        }

        const
            fromScheduler     = this.client,
            fromResourceStore = fromScheduler.isVertical ? fromScheduler.resourceStore : fromScheduler.store;

        return dragData.resourcesInStore = [...new Set(fromResourceStore.getAllDataRecords().map(r => r.$original))].filter(r => r.isLeaf);
    }

    getIndexDiff(dragData) {
        const
            me                = this,
            fromScheduler     = me.client,
            toScheduler       = me.currentOverClient,
            isCrossScheduler  = fromScheduler !== toScheduler,
            { isVertical }    = toScheduler,
            // When using TreeGroup in horizontal mode, store != resourceStore. Does not apply for vertical mode.
            fromResourceStore = fromScheduler.isVertical ? fromScheduler.resourceStore : fromScheduler.store,
            toResourceStore   = isVertical ? toScheduler.resourceStore : toScheduler.store,
            {
                resourceRecord : fromResource,
                newResource    : toResource
            }                 = dragData;

        let indexDiff;

        if (isCrossScheduler) {
            // The difference in indices via first dragged event will help us find resources for all the rest of the
            // events accordingly
            indexDiff = toResourceStore.indexOf(toResource) - fromResourceStore.indexOf(fromResource.$original);
        }
        else if (me.constainDragToResource) {
            indexDiff = 0;
        }
        else if (isVertical && toResourceStore.isGrouped) {
            const resourcesInStore = me.getGroupedToStoreResources(dragData);

            indexDiff = resourcesInStore.indexOf(fromResource.$original) - resourcesInStore.indexOf(toResource);
        }
        else {
            indexDiff = fromResourceStore.indexOf(fromResource.$original) - fromResourceStore.indexOf(toResource);
        }

        return indexDiff;
    }

    getNewResource(dragData, originalResourceRecord, indexDiff) {
        const
            me                = this,
            fromScheduler     = me.client,
            toScheduler       = me.currentOverClient,
            isCrossScheduler  = fromScheduler !== toScheduler,
            { isVertical }    = toScheduler,
            // When using TreeGroup in horizontal mode, store != resourceStore. Does not apply for vertical mode.
            fromResourceStore = fromScheduler.isVertical ? fromScheduler.resourceStore : fromScheduler.store,
            toResourceStore   = isVertical ? toScheduler.resourceStore : toScheduler.store;

        let { newResource } = dragData;

        if (!isCrossScheduler) {
            // If not dragging events as a unified block, distribute each to a new resource
            // using the same offset as the dragged event.
            if (indexDiff !== 0) {
                let newIndex;
                if (isVertical && toResourceStore.isGrouped) {
                    const resourcesInStore = me.getGroupedToStoreResources(dragData);

                    newIndex    = Math.max(
                        Math.min(
                            resourcesInStore.indexOf(originalResourceRecord) - indexDiff,
                            resourcesInStore.length - 1
                        ),
                        0
                    );
                    newResource = resourcesInStore[newIndex];
                }
                else {
                    newIndex = Math.max(
                        Math.min(
                            fromResourceStore.indexOf(originalResourceRecord) - indexDiff,
                            fromResourceStore.count - 1
                        ),
                        0
                    );

                    newResource = fromResourceStore.getAt(newIndex);

                    // Exclude group headers, footers, summary row etc
                    if (newResource.isSpecialRow) {
                        newResource = fromResourceStore.getNext(newResource, false, true) || fromResourceStore.getPrevious(newResource, false, true);
                    }
                }

                newResource = newResource?.$original;
            }
            else {
                newResource = originalResourceRecord;
            }
        }
        // we have a resource for first dragged event in toResource
        else {
            const draggedEventResourceIndex = fromResourceStore.indexOf(originalResourceRecord);
            newResource                     = toResourceStore.getAt(draggedEventResourceIndex + indexDiff) || newResource;
        }

        return newResource;
    }

    getDropData(dragData) {
        const indexDiff = this.getIndexDiff(dragData);

        return {
            events : dragData.eventRecords.map(eventRecord => {
                return {
                    eventRecord,
                    ...this.getEventNewStartEndDates(eventRecord, dragData.timeDiff, this.currentOverClient)
                };
            }),
            assignments : dragData.assignmentRecords.map(assignmentRecord => {
                return {
                    assignmentRecord,
                    resourceRecord : this.getAssignmentNewResource(dragData, assignmentRecord, indexDiff)
                };
            })
        };
    }

    triggerDrop(dragData) {
        this.currentOverClient.trigger('eventDrop', Object.assign(
            this.getTriggerParams(dragData), {
                isCopy               : this.mode === 'copy',
                copyMode             : this.copyMode,
                domEvent             : dragData.browserEvent,
                targetEventRecord    : dragData.targetEventRecord,
                targetResourceRecord : this.getRowResource(dragData.assignmentRecord, dragData.newResource),
                externalDropTarget   : dragData.externalDropTarget
            })
        );
    }

    triggerBeforeEventDropFinalize(eventType, eventData, client) {
        eventData.context.dropData = this.getDropData(eventData.context);

        super.triggerBeforeEventDropFinalize(eventType, eventData, client);
    }

    triggerBeforeEventDrag(eventType, event) {
        // The resource of the dragged bar, not the row it is dragged from (see getRowResource())
        event.resourceRecord = event.context.resourceRecord = this.getRowResource(event.assignmentRecord, event.resourceRecord);

        return this.client.trigger(eventType, event);
    }

    triggerEventDrag(dragData, start) {
        this.client.trigger('eventDrag', Object.assign(this.getTriggerParams(dragData), {
            startDate   : dragData.startDate,
            endDate     : dragData.endDate,
            newResource : this.getRowResource(dragData.assignmentRecord, dragData.newResource)
        }));
    }

    triggerDragStart(dragData) {
        this.client.navigator.skipNextClick = true;
        this.client.trigger('eventDragStart', this.getTriggerParams(dragData));
    }

    triggerDragAbort(dragData) {
        this.client.trigger('eventDragAbort', this.getTriggerParams(dragData));
    }

    triggerDragAbortFinalized(dragData) {
        this.client.trigger('eventDragAbortFinalized', this.getTriggerParams(dragData));
    }

    triggerAfterDrop(dragData, valid) {
        const me = this;

        me.currentOverClient.trigger('afterEventDrop', Object.assign(me.getTriggerParams(dragData), {
            valid
        }));

        if (!valid) {
            // Edge cases:
            // 1. If this drag was a no-op, and underlying data was changed while drag was ongoing (e.g. web socket
            // push), we need to manually force a view refresh to ensure a correct render state
            //
            // or
            // 2. Events were removed before we dropped at an invalid point
            const
                { assignmentStore, eventStore } = me.client,
                needRefresh                     = me.dragData.initialAssignmentsState.find(({
                    resource, assignment
                }, i) => {
                    return !assignmentStore.includes(assignment) ||
                        !eventStore.includes(assignment.event) ||
                        resource.id !== me.dragData.assignmentRecords[i]?.resourceId;
                });

            if (needRefresh) {
                me.client.refresh();
            }
        }
        // Reset the skipNextClick after a potential click event fires. https://github.com/bryntum/bryntum/issues/5135
        me.client.setTimeout(() => me.client.navigator.skipNextClick = false, 10);

        if (me.singleDirection) {
            me.drag.lockY = me.drag.lockX = false;
        }
    }

    handleKeyDownOrMove(event) {
        const me = this;
        if (me.mode !== 'copy' && (me.alwaysCopy || me.isCtrlKeyPress(event) || (event.key && EventHelper.specialKeyFromEventKey(event.key) === me.copyKey?.toLowerCase()) || event[`${me.copyKey?.toLowerCase()}Key`])) {
            me.mode = 'copy';
        }
    }

    handleKeyUp(event) {
        if (this.isCtrlKeyPress(event) || EventHelper.specialKeyFromEventKey(event.key) === this.copyKey.toLowerCase()) {
            this.mode = 'move';
        }
    }

    isCtrlKeyPress(event) {
        return this.copyKey === 'CTRL' && (event.key === (BrowserHelper.ctrlKey === 'ctrlKey' ? 'Ctrl' : 'Meta'));
    }

    //endregion

    //region Finalization & validation

    /**
     * Checks if an event can be dropped on the specified position.
     * @private
     * @returns {Boolean} Valid (true) or invalid (false)
     */
    isValidDrop(dragData) {
        const
            {
                newResource,
                browserEvent,
                assignmentRecords
            } = dragData;

        // Only allowed to drop outside scheduler element if we hit an element matching the externalDropTargetSelector
        if (!newResource) {
            return Boolean(!this.constrainDragToTimeline && this.externalDropTargetSelector
                && browserEvent.target.closest(this.externalDropTargetSelector));
        }

        const targetResource = this.getRowResource(dragData.assignmentRecord, dragData.newResource);

        // Not allowed to drop an event on a group header or a readOnly resource
        if (targetResource.isSpecialRow || targetResource.readOnly) {
            return false;
        }

        // Not allowed to assign an event twice to the same resource
        if (this.getRowResource(dragData.assignmentRecord, dragData.resourceRecord).$original !== targetResource) {
            return !assignmentRecords[0].event.resources.includes(targetResource);
        }

        return true;
    }

    checkDragValidity(dragData, event) {
        const
            me              = this,
            scheduler       = me.currentOverClient,
            { newResource } = dragData;

        let result;

        // Cannot assign anything to readOnly resources
        if (me.getRowResource(dragData.assignmentRecord, dragData.newResource)?.readOnly) {
            return false;
        }

        // Check for duplicate assignments when dragging multiple assignments
        if (newResource) {
            const indexDiff = me.getIndexDiff(dragData);

            // Check each assignment against its actual target resource
            for (const assignmentRecord of dragData.assignmentRecords) {
                const
                    targetResource = me.getAssignmentNewResource(dragData, assignmentRecord, indexDiff),
                    eventRecord    = assignmentRecord.event;

                // Not allowed to assign an event twice to the same resource
                // Only check if this is actually a different resource than the original
                if (assignmentRecord.resource.$original !== targetResource && eventRecord.resources.includes(targetResource)) {
                    return {
                        valid   : false,
                        message : me.L('L{duplicateAssignmentDrag}')
                    };
                }
            }
        }

        // First make sure there's no undesired overlap, if not run the external validatorFn
        if (newResource && me.hasOverlaps()) {
            result = {
                valid   : false,
                message : me.L('L{eventOverlapsExisting}')
            };
        }
        else {
            const
                resourceRecord = me.getRowResource(dragData.assignmentRecord, dragData.resourceRecord),
                newResource    = me.getRowResource(dragData.assignmentRecord, dragData.newResource);

            result = me.validatorFn.call(
                me.validatorFnThisObj || me,
                // A bar rendered on behalf of another resource reports that resource
                resourceRecord === dragData.resourceRecord && newResource === dragData.newResource
                    ? dragData
                    : { ...dragData, resourceRecord, newResource },
                event
            );
        }

        if (!result || result.valid) {
            // Hook for features to have a say on validity
            result = scheduler['checkEventDragValidity']?.(dragData, event) ?? result;
        }

        return result;
    }

    hasOverlaps() {
        const
            me = this,
            {
                dragData,
                currentOverClient
            }                        = me,
            { startDate, origStart } = dragData,
            msDiff                   = startDate - origStart, // By how many ms has the drag moved.
            indexDiff                = me.getIndexDiff(me.dragData); // By how many resource rows has the drag moved.



        return dragData.assignmentRecords.some(assignmentRecord => {
            const
                newResource = me.getAssignmentNewResource(dragData, assignmentRecord, indexDiff),
                eventRecord = assignmentRecord.event;

            let eventStart = eventRecord.startDate,
                eventEnd   = eventRecord.endDate;



            return !currentOverClient.isDateRangeAvailable(
                DateHelper.add(eventStart, msDiff, 'ms'),
                DateHelper.add(eventEnd, msDiff, 'ms'),
                dragData.assignmentRecords,
                newResource
            );
        });
    }

    //endregion

    //region Update records

    internalSnapToPosition(snapTo) {
        const { dragData } = this;

        this.snapToPosition?.({
            source           : this.currentOverClient,
            assignmentRecord : dragData.assignmentRecord,
            eventRecord      : dragData.eventRecord,
            resourceRecord   : dragData.newResource || dragData.resourceRecord,
            startDate        : dragData.startDate,
            endDate          : dragData.endDate,
            snapTo
        });
    }

    /**
     * Updates the dragged records.
     * The method is called to apply changes to the records on successful completion of the drag operation.
     *
     * Should not be called directly, except if the app is configured with a {@link #config-updateRecordsFn}
     * to customize the logic for applying changes.
     * @param {EventDragData} dragData Drag data.
     * @returns {Promise|void} Can return a `Promise` resolving once the changes are applied
     * (if the process is asynchronous).
     */
    async updateRecords(context) {
        const
            me = this,
            {
                client            : fromScheduler,
                currentOverClient : toScheduler
            } = me,
            copyKeyPressed = me.mode === 'copy',
            {
                assignmentRecords,
                timeDiff,
                initialAssignmentsState
            }                 = context,
            originalStartDate = initialAssignmentsState[0].startDate,
            droppedStartDate  = me.adjustStartDate(originalStartDate, timeDiff);

        let result;

        if (!context.externalDropTarget) {
            // Dropping dragged event completely outside the time axis is not allowed
            if (!toScheduler.timeAxis.timeSpanInAxis(droppedStartDate, DateHelper.add(droppedStartDate, assignmentRecords[0].event.rawDurationMS, 'ms'))) {
                context.valid = false;
            }

            if (context.valid) {
                fromScheduler.eventStore.suspendAutoCommit();
                toScheduler.eventStore.suspendAutoCommit();

                result = await me.updateAssignments(fromScheduler, toScheduler, context, copyKeyPressed);

                fromScheduler.eventStore.resumeAutoCommit();
                toScheduler.eventStore.resumeAutoCommit();
            }
        }

        return result;
    }

    /**
     * Update assignments being dragged
     * @private
     */
    async updateAssignments(fromScheduler, toScheduler, context, copy) {
        // The code is written to emit as few store events as possible
        const
            me                  = this,
            { copyMode }        = me,
            isCrossScheduler    = (fromScheduler !== toScheduler),
            { isVertical }      = toScheduler,
            {
                assignmentStore : fromAssignmentStore,
                eventStore      : fromEventStore
            }                   = fromScheduler,
            {
                assignmentStore : toAssignmentStore,
                eventStore      : toEventStore
            }                   = toScheduler,
            // When using TreeGroup in horizontal mode, store != resourceStore. Does not apply for vertical mode.
            fromResourceStore   = fromScheduler.isVertical ? fromScheduler.resourceStore : fromScheduler.store,
            {
                eventRecords,
                assignmentRecords,
                timeDiff,
                initialAssignmentsState,
                newResource : toResource
            }                   = context,
            { unifiedDrag }     = me,
            // For an empty target event store, check if it has usesSingleAssignment explicitly set, otherwise use
            // the value from the source event store
            useSingleAssignment = (toEventStore.usesSingleAssignment ||
                (toEventStore.usesSingleAssignment !== false && fromEventStore.usesSingleAssignment)),
            // this value has clear semantic only for same scheduler case
            effectiveCopyMode   = copyMode === 'event'
                ? 'event'
                : copyMode === 'assignment'
                    ? 'assignment'
                    : useSingleAssignment ? 'event' : 'assignment',
            event1Date          = me.adjustStartDate(assignmentRecords[0].event.startDate, timeDiff),
            eventsToAdd         = [],
            eventsToRemove      = [],
            assignmentsToAdd    = [],
            assignmentsToRemove = [],
            eventsToCheck       = [],
            eventsToBatch       = new Set();

        fromScheduler.suspendRefresh();
        toScheduler.suspendRefresh();

        let updated      = false,
            updatedEvent = false;
        const indexDiff    = me.getIndexDiff(context); // By how many resource rows has the drag moved.

        if (isVertical) {
            eventRecords.forEach((draggedEvent, i) => {
                const eventBar = context.eventBarEls[i];

                delete draggedEvent.instanceMeta(fromScheduler).hasTemporaryDragElement;

                // If it was created by a call to scheduler.currentOrientation.addTemporaryDragElement
                // then release it back to be available to DomSync next time the rendered event block
                // is synced.
                if (eventBar.dataset.transient) {
                    eventBar.remove();
                }
            });
        }

        const
            { proxyElements }    = context,
            eventBarEls          = context.eventBarEls.slice(),
            addedEvents          = [],
            // this map holds references between original assignment and its copy
            copiedAssignmentsMap = {};

        // Using for to support await inside
        for (let i = 0; i < assignmentRecords.length; i++) {
            const originalAssignment = assignmentRecords[i];

            // Reassigned when dropped on other scheduler, thus not const
            let draggedEvent = originalAssignment.event,
                draggedAssignment;

            if (copy) {
                draggedAssignment                           = originalAssignment.copy();
                copiedAssignmentsMap[originalAssignment.id] = draggedAssignment;
            }
            else {
                draggedAssignment = originalAssignment;
            }

            if (!draggedAssignment.isOccurrenceAssignment && (!fromAssignmentStore.includes(originalAssignment) || !fromEventStore.includes(draggedEvent))) {
                // Event was removed externally during the drag, just remove element from DOM (DomSync already has
                // tried to clean it up at this point, but could not due to retainElement being set)
                eventBarEls[i].remove();
                eventBarEls.splice(i, 1);
                assignmentRecords.splice(i, 1);
                i--;
                continue;
            }

            const
                initialState           = initialAssignmentsState[i],
                originalEventRecord    = draggedEvent,
                originalStartDate      = initialState.startDate,
                // grabbing resource early, since after ".copy()" the record won't belong to any store
                // and ".getResources()" won't work. If it's a move to another scheduler, ensure the
                // array still has a length. The process function will do an assign as opposed
                // to a reassignment
                originalResourceRecord = initialState.resource,
                // Calculate new startDate (and round it) based on timeDiff up here, might be added to another
                // event store below in which case it is invalidated. But this is anyway the target date
                newStartDate           = this.constrainDragToTimeSlot
                    ? originalStartDate
                    : (unifiedDrag
                        ? event1Date
                        : me.adjustStartDate(originalStartDate, timeDiff));

            // equals will drill through chain to see if the underlying AssignmentStores are equal
            if (!fromAssignmentStore.equals(toAssignmentStore)) {
                // Single assignment from a multi assigned event dragged over, event needs to be copied over
                // Same if we hold the copy key
                const keepEvent = originalEventRecord.assignments.length > 1 || copy;

                let newAssignment;

                if (copy) {
                    // In a copy mode dragged assignment is already a copy
                    newAssignment = draggedAssignment;
                }
                else {
                    newAssignment                              = draggedAssignment.copy();
                    copiedAssignmentsMap[draggedAssignment.id] = newAssignment;
                }

                // Enterprise Engine does not seem to handle having the event already in place on the copied assignment,
                // replacing it with id to have events bucket properly set up on commit
                if (newAssignment.event && !useSingleAssignment) {
                    newAssignment.event    = newAssignment.event.id;
                    newAssignment.resource = newAssignment.resource.id;
                }

                if (!copy) {
                    // If we're not copying, remove assignment from source scheduler
                    assignmentsToRemove.push(draggedAssignment);
                }

                // If it was the last assignment, the event should also be removed
                if (!keepEvent) {
                    eventsToRemove.push(originalEventRecord);
                }

                // If event does not already exist in target scheduler a copy is added
                // if we're copying the event, we always need to create new record
                if (
                    copy && (copyMode === 'event' || (copyMode === 'auto' && toEventStore.usesSingleAssignment)) ||
                    !toEventStore.getById(originalEventRecord.id)
                ) {
                    draggedEvent = toEventStore.createRecord({
                        ...originalEventRecord.data,
                        children : originalEventRecord.children?.map(child => child.copy()),
                        // If we're copying the event (not making new assignment to existing), we need to generate
                        // phantom id to link event to the assignment record
                        id       : copy && (copyMode === 'event' || copyMode === 'auto') ? undefined : originalEventRecord.id,
                        // Engine gets mad if not nulled
                        calendar : null
                    });

                    newAssignment.set({
                        eventId : draggedEvent.id,
                        event   : draggedEvent
                    });

                    eventsToAdd.push(draggedEvent);
                }

                // And add it to the target scheduler
                // <remove-on-release>
                // TODO: Should be handled on the data layer ideally
                // </remove-on-release>
                if (!useSingleAssignment) {
                    assignmentsToAdd.push(newAssignment);
                }
                draggedAssignment = newAssignment;
            }

            let newResource    = toResource,
                reassignedFrom = null;

            newResource = unifiedDrag
                ? me.getRowResource(originalAssignment, toResource)
                : me.getAssignmentNewResource(context, originalAssignment, indexDiff, originalResourceRecord) || toResource;

            // Never assigned to a group header, only valid targets when rendering a dragged event (unifiedDrag)
            if (newResource.isSpecialRow) {
                newResource = originalResourceRecord;
            }

            newResource = newResource.$original;

            const isCrossResource = draggedAssignment.resourceId !== newResource.id;

            // Cannot rely on assignment generation to detect update, since it might be a new assignment
            // <remove-on-release>
            // TODO: what about a case when we drag between schedulers which have different resource with same ids?
            // </remove-on-release>
            if (isCrossResource) {
                reassignedFrom = fromResourceStore.getById(draggedAssignment.resourceId);

                // equals will drill through chain to see if the underlying AssignmentStores are equal
                if (copy && fromAssignmentStore.equals(toAssignmentStore)) {
                    // Scheduler Core patch
                    // need to completely clear the resource/resourceId on the copied assignment, before setting the new
                    // otherwise, what happens is that in the `$beforeChange.resource/Id` are still
                    // stored the resource/Id of the original assignment
                    // then, when finalizing commit, Core engine performs this:
                    //     // First silently revert any data change (used by buckets), otherwise it won't be detected by `set()`
                    //     me.setData(me.$beforeChange)
                    // and then updates the data to new, which is recorded as UpdateAction in the STM with old/new data
                    // then, when that update action in STM is undo-ed, the old data is written back to the record
                    // and newly added assignment is pointing to the old resource
                    // then, when STM action is redo-ed, a "duplicate assignment" exception is thrown
                    // this is covered with the test:
                    // Scheduler/tests/features/EventDragCopy.t.js -> Should not remove the original when undo-ing the copy-drag action ("multi-assignment")
                    draggedAssignment.setData({
                        resource   : null,
                        resourceId : null
                    });
                    // eof Scheduler Core patch

                    draggedAssignment.resource = newResource;
                    draggedAssignment.event    = toEventStore.getById(draggedAssignment.eventId);

                    const shouldCopyEvent = copyMode === 'event' || (fromEventStore.usesSingleAssignment && copyMode === 'auto');

                    if (shouldCopyEvent) {
                        draggedEvent = draggedEvent.copy();
                        // need to clear the `endDate` of the copy
                        // this is because when we drag the copy to a different position on the timeline
                        // it will set the new start date and re-calculate end date
                        // as a result, in STM transaction for this drag-copy there will be "add" action
                        // and "update" action and NO COMMIT in the middle
                        // so when re-doing this transaction the duration change is lost
                        // this is covered with the test:
                        // "Scheduler/tests/features/EventDragCopy.t.js -> Should not remove the original when undo-ing the copy-drag action (usesSingleAssignment)",
                        // Before doing it, save a copy of endDate in meta object, considering timeDiff: that's because below it will check if event is in timeAxis.
                        draggedEvent.meta.endDateCached = me.adjustStartDate(draggedEvent.endDate, timeDiff);
                        draggedEvent.endDate            = null;

                        draggedAssignment.event = draggedEvent;

                        if (toEventStore.usesSingleAssignment) {
                            draggedEvent.resource   = newResource;
                            draggedEvent.resourceId = newResource.id;
                        }
                    }

                    if (
                        !toAssignmentStore.find(a => a.eventId === draggedAssignment.eventId && a.resourceId === draggedAssignment.resourceId) &&
                        !assignmentsToAdd.find(r => r.eventId === draggedAssignment.eventId && r.resourceId === draggedAssignment.resourceId)
                    ) {
                        shouldCopyEvent && eventsToAdd.push(draggedEvent);
                        assignmentsToAdd.push(draggedAssignment);
                    }
                }
                else {
                    // Here we need to set resource on the assignment such as it gets recorded by the STM. If we set
                    // only `resource`, that field gets ignored because it is not persistable. If we set `resourceId`,
                    // accessor will ignore the attempt and will try to set `resource` instead. To do it right we need
                    // to set first `resource` and then - `resourceId` Covered by
                    // enterprise/view/live_updates/EventDrag.t and features/EventDragCreate.t
                    draggedAssignment.resource = newResource;
                    if (useSingleAssignment) {
                        draggedAssignment.event.resourceId = newResource.id;
                    }
                    else {
                        draggedAssignment.resourceId = newResource.id;
                    }
                    // update Proxy dataset w/ new recordId so mouseover
                    // handler in onElementMouseOver could resolve resource from the element properly.
                    // In TreeGroup mode, the visible store has linked records (e.g. "kate_link_131")
                    // while newResource is the $original ("kate"). Use getById(record) to resolve
                    // the linked record so resolveRowRecord() can find it via store.getById(id).
                    // In vertical mode, store is the event store, so we must use resourceStore.
                    const resourceStore = isVertical ? toScheduler.resourceStore : toScheduler.store;
                    proxyElements[i].dataset.resourceId = (resourceStore.getById(newResource) || newResource).id;
                }

                // Actual events should be batched, not data for new events when dragging between
                draggedEvent.isEvent && eventsToBatch.add(draggedEvent);
                updated = true;

                // When dragging an occurrence, the assignment is only temporary. We have to tag the newResource along
                // to be picked up by the occurrence -> event conversion
                // <remove-on-release>
                // TODO: replace the temporary `newResource` tag with a cleaner mechanism
                // </remove-on-release>
                if (draggedEvent.isOccurrence) {
                    draggedEvent.set('newResource', newResource);
                }

                // <remove-on-release>
                // TODO: This belongs in the data layer, but it is an edge case
                // </remove-on-release>
                if (isCrossScheduler && useSingleAssignment) {
                    // In single assignment mode, when dragged to another scheduler it will not copy the assignment
                    // over but instead set the resourceId of the event. To better match expected behaviour
                    draggedEvent.resourceId = newResource.id;
                }
            }
            else if (
                copy &&
                (copyMode === 'event' || (copyMode === 'auto' && fromEventStore.usesSingleAssignment)) &&
                !eventsToAdd.includes(draggedEvent)
            ) {
                draggedEvent                    = draggedEvent.copy();
                // see the comment above
                draggedEvent.meta.endDateCached = me.adjustStartDate(draggedEvent.endDate, timeDiff);
                draggedEvent.endDate            = null;

                eventsToAdd.push(draggedEvent);

                draggedAssignment.event = draggedEvent;

                if (toEventStore.usesSingleAssignment) {
                    draggedEvent.set({
                        resource   : newResource,
                        resourceId : newResource.id
                    });
                }

                // Always add assignment to the store to allow proper element reuse
                assignmentsToAdd.push(draggedAssignment);
            }

            // Same for event
            if (!eventsToCheck.find(ev => ev.draggedEvent === draggedEvent) && !DateHelper.isEqual(draggedEvent.startDate, newStartDate)) {

                // only do for non occurrence records
                while (!draggedEvent.isOccurrence && draggedEvent.isBatchUpdating) {
                    draggedEvent.endBatch(true);
                }

                // for same scheduler with multi-assignments, and copyMode === assignment, need to keep the start date
                // because user intention is to create a new assignment, not re-schedule the event
                // but only for cross-resource dragging, same resource dragging has semantic of regular drag
                // <remove-on-release>
                // TODO should also keep the proxy element on the same X coordinate
                // </remove-on-release>
                const shouldKeepStartDate = copy && !isCrossScheduler && !useSingleAssignment && effectiveCopyMode === 'assignment' && isCrossResource;

                if (!shouldKeepStartDate) {
                    draggedEvent.startDate = newStartDate;

                    eventsToCheck.push({ draggedEvent, originalStartDate });
                }

                draggedEvent.isEvent && eventsToBatch.add(draggedEvent);
                updatedEvent = true;
            }

            // Hook for features that need to do additional processing on drop (used by NestedEvents)
            toScheduler.processEventDrop({
                eventRecord    : draggedEvent,
                resourceRecord : newResource,
                element        : i === 0 ? context.context.element : context.context.relatedElements[i - 1],
                context,
                toScheduler,
                reassignedFrom,
                eventsToAdd,
                addedEvents,
                draggedAssignment
            });

            // There are two cases to consider when triggering this event - `copy` and `move` mode. In case we are
            // copying the assignment (we can also copy the event) draggedAssignment will point to the copy of the
            // original assignment record. Same for draggedEvent. These records are new records which are not yet added
            // to the store and they contain correct state of the drop - which event is going to be assigned to which
            // resource on what time.
            // These records possess no knowledge about original records which they were cloned from. And that might be
            // useful. Let's say you want to copy assignment (or event) to every row in the way. You need to know start
            // row and the end row. That information is kept in the `originalAssignment` record. Which might be identical
            // to the `draggedAssignment` record in `move` mode.
            toScheduler.trigger('processEventDrop', {
                originalAssignment,
                draggedAssignment,
                context,
                copyMode,
                isCopy : copy
            });
        }

        fromAssignmentStore.remove(assignmentsToRemove);
        fromEventStore.remove(eventsToRemove);
        toAssignmentStore.add(assignmentsToAdd);

        // Modify syncIdMap on the FGCanvas to make sure elements get animated nicely to new position
        // equals will drill through chain to see if the underlying AssignmentStores are equal
        if (copy && fromAssignmentStore.equals(toAssignmentStore)) {
            const { syncIdMap } = fromScheduler.foregroundCanvas;

            Object.entries(copiedAssignmentsMap).forEach(([originalId, cloneRecord]) => {
                const element = syncIdMap[originalId];
                delete syncIdMap[originalId];
                syncIdMap[cloneRecord.id] = element;
            });
        }

        eventsToAdd.length && addedEvents.push(...toEventStore.add(eventsToAdd));

        addedEvents?.forEach(added => eventsToBatch.add(added));

        // addedEvents order is the same with [context.element, ..context.relatedElements]
        // Any added or removed events or assignments => something changed
        // Also check for parentChanged flag (set by NestedEvents feature when de-nesting)
        if (assignmentsToRemove.length || eventsToRemove.length || assignmentsToAdd.length || eventsToAdd.length || context.parentChanged) {
            updated = true;
        }

        // Commit changes to affected projects
        if (updated || updatedEvent) {
            // When not constrained to timeline we are dragging a clone and need to manually do some cleanup if
            // dropped in view, but only for valid drops
            if (!me.constrainDragToTimeline) {
                // go through assignmentRecords again after events has been added to toEventStore (if any)
                // now we have updated assignment ids and can properly reuse event HTML elements
                for (let i = 0; i < assignmentRecords.length; i++) {
                    const
                        assignmentRecord     = copiedAssignmentsMap[assignmentRecords[i].id] || assignmentRecords[i],
                        originalDraggedEvent = assignmentRecord.event,
                        // try to get dragged event from addedEvents array, it will be there with updated ids
                        // if toScheduler is different
                        draggedEvent         = addedEvents?.find(r => r.id === originalDraggedEvent.id) || originalDraggedEvent,
                        eventBar             = context.eventBarEls[i],
                        element              = i === 0 ? context.context.element : context.context.relatedElements[i - 1],
                        // Determine if in time axis here also, since the records date might be invalidated further below
                        inTimeAxis           = toScheduler.isInTimeAxis(draggedEvent);

                    // after checking if is in time axis, meta.endDateCached can be deleted
                    delete draggedEvent.meta.endDateCached;

                    if (!copy) {
                        // Remove original element properly
                        DomSync.remove(eventBar);
                    }

                    if (draggedEvent.resource && (isVertical || toScheduler.rowManager.getRowFor(assignmentRecord.resource)) && inTimeAxis) {
                        // Nested events are added to correct parent by the feature
                        if (!draggedEvent.parent || draggedEvent.parent.isRoot) {
                            const
                                elRect = Rectangle.from(element, toScheduler.foregroundCanvas, true),
                                // Ensure that after inserting the dragged element clone into the toScheduler's foregroundCanvas
                                // it's at the same visual position that it was dragged to.
                                x = toScheduler.rtl ? toScheduler.timeAxisViewModel.totalSize - elRect.right : elRect.x;

                            DomHelper.setTopInsetInlineStart(element, elRect.y, x);

                            // Add element properly, so that DomSync will reuse it on next update
                            DomSync.addChild(toScheduler.foregroundCanvas, element, draggedEvent.assignments[0].id);

                            isCrossScheduler && toScheduler.processCrossSchedulerEventDrop({
                                eventRecord : draggedEvent,
                                toScheduler
                            });
                        }

                        element.classList.remove('b-sch-event-hover', 'b-active', 'b-drag-proxy', 'b-dragging');
                        element.retainElement = false;
                    }
                    else {
                        // Row not found after dropping, might have been scrolled out of view. Ensure we clean up always.
                        element.remove();
                    }
                }
            }

            // By batching event changes when using single assignment we avoid two updates, without it there will be one
            // for date change and one when changed assignment updates resourceId on the event
            useSingleAssignment && eventsToBatch.forEach(eventRecord => eventRecord.beginBatch());

            const
                // When chaining stores, need to wait for correct project to commit
                toProject   = toEventStore.$master.project ?? toScheduler.project,
                fromProject = fromEventStore.$master.project ?? fromScheduler.project;

            await Promise.all([
                toProject !== fromProject ? toProject.commitAsync() : null,
                fromProject.commitAsync()
            ]);

            // End batch in engine friendly way, avoiding to have `set()` trigger another round of calculations
            useSingleAssignment && eventsToBatch.forEach(eventRecord => eventRecord.endBatch(false, true));
        }

        if (!updated) {
            // Engine might have reverted the date change, in which case this should be considered an invalid op
            updated = eventsToCheck.some(({ draggedEvent, originalStartDate }) =>
                !DateHelper.isEqual(draggedEvent.startDate, originalStartDate)
            );
        }

        // Resumes self twice if not cross scheduler, but was suspended twice above also so all good
        toScheduler.resumeRefresh(false);
        fromScheduler.resumeRefresh(false);

        if (assignmentRecords.length > 0) {
            if (!updated) {
                context.valid = false;
            }
            else {
                // Always force re-render of the bars, to return them to their original position when:
                // * Fill ticks leading to small date adjustment not actually changing the DOM
                //   (https://github.com/bryntum/bryntum/issues/630)
                // * Dragging straight down with multiselection, events in the last resource will still be assigned to
                //   that resource = no change in the DOM (https://github.com/bryntum/bryntum/issues/6293)
                eventBarEls.forEach(el => delete el.lastDomConfig);

                // Not doing full refresh above, to allow for animations
                toScheduler.refreshWithTransition();

                if (isCrossScheduler) {
                    fromScheduler.refreshWithTransition();

                    toScheduler.selectedEvents = addedEvents;
                }
            }
        }
    }

    //endregion

    //region Drag data

    isDragOverClient({ browserEvent }) {
        const client = this.currentOverClient;

        if (!client) {
            return false;
        }

        return browserEvent.touches
            ? Rectangle.from(client.element).contains(Point.from(browserEvent, true))
            : client.element.contains(this.getMouseMoveEventTarget(browserEvent));
    }

    callResolveResourceFn(dragData) {
        const
            me                   = this,
            { drag }             = me,
            client               = me.currentOverClient,
            { context }          = dragData,
            { handler, thisObj } = me.resolveResourceFn;

        // Dragged outside the view there is no resource to resolve, so a resolveResourceFn is never asked
        if (!me.isDragOverClient(dragData)) {
            return null;
        }

        const
            // Matches how DragHelperTranslate derives the untranslated position, so `coordinate` agrees with where
            // the proxy tracks the pointer
            rtlFlip              = (drag?.isRTL && drag.positioning === 'inset') ? -1 : 1,
            coordinate           = client.isVertical
                ? context.elementStartX + (context.pageX - context.startPageX + context.scrollX) * rtlFlip
                : context.elementStartY + (context.pageY - context.startPageY + context.scrollY);

        return handler.call(thisObj, {
            source           : client,
            eventRecord      : dragData.eventRecord,
            assignmentRecord : dragData.assignmentRecord,
            resourceRecord   : dragData.resourceRecord,
            coordinate,
            domEvent         : dragData.browserEvent
        }) ?? null;
    }

    getProductDragContext(dragData) {
        const
            me                                = this,
            { currentOverClient : scheduler } = me,
            { target }                        = dragData.browserEvent,
            previousResolvedResource          = dragData.newResource || dragData.resourceRecord,
            previousTargetEventRecord         = dragData.targetEventRecord;

        let
            targetEventRecord = scheduler ? me.resolveEventRecord(target, scheduler) : null,
            newResource, externalDropTarget;

        // Ignore if over dragged event
        if (dragData.eventRecords.includes(targetEventRecord)) {
            targetEventRecord = null;
        }

        if (me.constrainDragToResource) {
            newResource = dragData.resourceRecord;
        }
        else if (!me.constrainDragToTimeline) {
            newResource = me.callResolveResourceFn(dragData);
        }
        else if (scheduler) {
            newResource = me.callResolveResourceFn(dragData) || dragData.newResource || dragData.resourceRecord;
        }

        // Fall back to the hovered event's resource when resolveResource() can't determine the row.
        // For multi-assigned events, .resource returns the first resource, which is acceptable
        // for drag preview positioning since the exact resource is refined on drop.
        if (!newResource && targetEventRecord) {
            newResource = targetEventRecord.resource;
        }

        if (targetEventRecord && !targetEventRecord.isParent && !targetEventRecord.parent) {
            const targetEventResourceId = target.closest(scheduler.eventSelector).dataset.resourceId;

            // If hovering partly over an event belonging to another resource than the one we are dropping on,
            // look for an event on the destination resource instead
            if (newResource && targetEventResourceId != null && targetEventResourceId != newResource.id) {
                const eventsForActualResource = scheduler.eventStore.getEvents({
                    startDate      : dragData.startDate,
                    endDate        : dragData.endDate,
                    resourceRecord : newResource
                });

                targetEventRecord = eventsForActualResource[0];
            }
        }

        const
            { assignmentRecords, eventRecords } = dragData,
            isOverNewResource                   = previousResolvedResource !== newResource;

        // Not on group headers, unless rendering the dragged event for its resource
        let valid = Boolean(newResource && !me.getRowResource(dragData.assignmentRecord, newResource).isSpecialRow);

        if (!newResource && me.externalDropTargetSelector) {
            externalDropTarget = target.closest(me.externalDropTargetSelector);
            valid              = Boolean(externalDropTarget);
        }

        return {
            valid,
            externalDropTarget,
            eventRecords,
            assignmentRecords,
            newResource,
            targetEventRecord,
            dirty         : isOverNewResource || targetEventRecord !== previousTargetEventRecord,
            proxyElements : [dragData.context.element, ...dragData.context.relatedElements || []]
        };
    }

    getMinimalDragData(info) {
        const
            me                = this,
            { scheduler }     = me,
            { resourceStore } = scheduler,
            element           = me.getElementFromContext(info),
            eventRecord       = me.resolveEventRecord(element, scheduler),
            // The row dragged from, which might render the event on behalf of another resource
            resourceRecord    = scheduler.resolveRowRecord(element),
            assignmentRecord  = scheduler.resolveAssignmentRecord(element);

        let assignmentRecords = assignmentRecord ? [assignmentRecord] : [];

        // We multi drag other selected events if the dragged event is already selected, or the ctrl key is pressed
        if (assignmentRecord && (scheduler.isAssignmentSelected(assignmentRecords[0]) || (me.drag.startEvent.ctrlKey && scheduler.multiEventSelect))) {
            assignmentRecords.push.apply(assignmentRecords, me.getRelatedRecords(assignmentRecord));
        }

        // When multi-group is used, there might be resources that are part of two groups.
        // If one group is collapsed, the resource is still available,
        // so we won't evict the assignment.
        // Evict assignments for resources that are collapsed or filtered away
        assignmentRecords = assignmentRecords.filter(assignment =>
            resourceStore.isAvailable(assignment.resource) ||
            assignment.resource?.$links.some(l => resourceStore.isAvailable(l)) ||
            // Rendered on another row than its resource's
            resourceStore.isAvailable(scheduler.getAssignmentRow(assignment))
        );

        const eventRecords = [...new Set(assignmentRecords.map(assignment => assignment.event))];

        return {
            eventRecord,
            resourceRecord,
            assignmentRecord,
            eventRecords,
            assignmentRecords
        };
    }

    setupProductDragData(info) {
        const
            me            = this,
            { scheduler } = me,
            element       = me.getElementFromContext(info),
            {
                eventRecord,
                resourceRecord,
                assignmentRecord,
                assignmentRecords
            }             = me.getMinimalDragData(info),
            eventBarEls   = [];

        if (me.constrainDragToResource && !resourceRecord) {
            throw new Error('Resource could not be resolved for event: ' + eventRecord.id);
        }

        let dateConstraints;

        if (me.constrainDragToTimeline) {
            // For the resource of the bar, not the row it is rendered on
            dateConstraints = me.getDateConstraints?.(me.getRowResource(assignmentRecord, resourceRecord), eventRecord);

            const
                constrainRectangle = me.constrainRectangle = me.getConstrainingRectangle(dateConstraints, resourceRecord, eventRecord),
                eventRegion        = Rectangle.from(element, scheduler.timeAxisSubGridElement),
                isDateConstrained  = Boolean(dateConstraints.start);

            super.setupConstraints(
                constrainRectangle,
                eventRegion,
                scheduler.timeAxisViewModel.snapPixelAmount,
                isDateConstrained && scheduler.isHorizontal,
                isDateConstrained && scheduler.isVertical
            );
        }

        // Collecting all elements to drag
        assignmentRecords.forEach(assignment => {
            // Element for the grabbed event is already available
            if (assignment === assignmentRecord) {
                eventBarEls.push(element);
            }
            else {
                let eventBarEl = scheduler.getElementFromAssignmentRecord(
                    assignment, true, false, scheduler.isLockedRowsView
                );

                if (!eventBarEl) {
                    eventBarEl = scheduler.currentOrientation.addTemporaryDragElement(
                        assignment.event, assignment.resource
                    );
                }

                eventBarEls.push(eventBarEl);
            }
        });

        return {
            assignmentRecord,
            assignmentRecords,
            dateConstraints : dateConstraints?.start ? dateConstraints : null,
            // Create copies of the elements
            eventBarCopies  : eventBarEls.map(el => me.createProxy(el)),
            eventBarEls
        };
    }

    getDateConstraints(resourceRecord, eventRecord) {
        const
            { scheduler }           = this,
            externalDateConstraints = scheduler.getDateConstraints?.(resourceRecord, eventRecord);

        let minDate, maxDate;

        if (this.constrainDragToTimeSlot) {
            minDate = eventRecord.startDate;
            maxDate = eventRecord.endDate;
        }
        else if (externalDateConstraints) {
            minDate = externalDateConstraints.start || new Date(0);
            maxDate = externalDateConstraints.end || new Date(9999, 0, 1);
        }

        return {
            start : minDate,
            end   : maxDate
        };
    }

    getConstrainingRectangle(dateRange, resourceRecord, eventRecord) {
        return this.scheduler.getScheduleRegion(this.constrainDragToResource && resourceRecord, eventRecord, true, dateRange && {
            start : dateRange.start, end : dateRange.end
        });
    }

    /**
     * Initializes drag data (dates, constraints, dragged events etc). Called when drag starts.
     * @private
     * @param {Object} info
     * @returns {*}
     */
    getDragData(info) {
        const dragData = this.getMinimalDragData(info) || {};

        return {
            ...super.getDragData(info),
            ...dragData,
            initialAssignmentsState : dragData.assignmentRecords.map(assignment => ({
                startDate : assignment.event.startDate,
                resource  : assignment.resource,
                assignment
            }))
        };
    }

    /**
     * Provide your custom implementation of this to allow additional selected records to be dragged together with the original one.
     * @param {Scheduler.model.AssignmentModel} assignmentRecord The assignment about to be dragged
     * @returns {Scheduler.model.AssignmentModel[]} An array of assignment records to drag together with the original
     */
    getRelatedRecords(assignmentRecord) {
        return this.scheduler.selectedAssignments.filter(selectedRecord => selectedRecord !== assignmentRecord && !selectedRecord.resource.readOnly && selectedRecord.event.isDraggable);
    }

    /**
     * Get correct axis coordinate depending on schedulers mode (horizontal -> x, vertical -> y). Also takes milestone
     * layout into account.
     * @private
     * @param {Scheduler.model.EventModel} eventRecord Record being dragged
     * @param {HTMLElement} element Element being dragged
     * @param {Number[]} coord XY coordinates
     * @returns {Number|Number[]} X,Y or XY
     */
    getCoordinate(eventRecord, element, coord) {
        const scheduler = this.currentOverClient;

        if (scheduler.isHorizontal) {
            let x = coord[0];

            // Adjust coordinate for milestones if using a layout mode, since they are aligned differently than events
            if (scheduler.milestoneLayoutMode !== 'default' && eventRecord.isMilestone) {
                switch (scheduler.milestoneAlign) {
                    case 'center':
                        x += element.offsetWidth / 2;
                        break;
                    case 'end':
                        x += element.offsetWidth;
                        break;
                }
            }

            return x;
        }
        else {
            let y = coord[1];
            // Adjust coordinate for milestones if using a layout mode, since they are aligned differently than events
            if (scheduler.milestoneLayoutMode !== 'default' && eventRecord.isMilestone) {
                switch (scheduler.milestoneAlign) {
                    case 'center':
                        y += element.offsetHeight / 2;
                        break;
                    case 'end':
                        y += element.offsetHeight;
                        break;
                }
            }

            return y;
        }
    }

    changeResolveResourceFn(value) {
        return this.resolveCallback(value, this);
    }

    /**
     * Returns the resource record occluded by the centre of the drag proxy. This is the default implementation of
     * the {@link #config-resolveResourceFn} config.
     *
     * Should not be called directly, except from a {@link #config-resolveResourceFn} which wants to fall back to the
     * default resolution.
     *
     * @returns {Scheduler.model.ResourceModel} The resource under the drag proxy, or `null` when over none
     * @category Dragging
     */
    resolveResource() {
        const
            me                 = this,
            client             = me.currentOverClient,
            { isHorizontal }   = client,
            {
                context,
                dragProxy
            }                  = me.dragData,
            element            = dragProxy || context.element,
            // Page coords for elementFromPoint
            pageRect           = Rectangle.from(element, null, true),
            y                  = (client.isVertical || me.unifiedDrag) ? context.clientY : pageRect.center.y,
            // Local coords to resolve resource in vertical
            localRect          = Rectangle.from(element, client.timeAxisSubGridElement, true, client.rtl),
            { x : lx, y : ly } = localRect.center;

        let resource = null;

        if (me.isDragOverClient(me.dragData)) {
            // This is benchmarked as the fastest way to find a Grid Row from a viewport Y coordinate
            // so use it in preference to elementFromPoint (which causes a forced synchronous layout) in horizontal mode.
            if (isHorizontal) {
                const row = client.rowManager.getRowAt(y);

                resource = row && client.store.storage.getAt(row.dataIndex);
            }
            else {
                // In vertical mode, just use the X coordinate to find out which resource we are under.
                // The method requires that a .b-sch-time-axis-cell element be passed.
                // There is only one in vertical mode, so use that.
                resource = client.resolveResourceRecord(client.timeAxisSubGridElement.querySelector('.b-sch-time-axis-cell'), [lx, ly]);
            }
        }

        return resource?.$original;
    }

    //endregion

    //region Other stuff

    getRecordElement(assignmentRecord) {
        return this.client.getElementFromAssignmentRecord(assignmentRecord, true);
    }

    // Used by the Dependencies feature to draw lines to the drag proxy instead of the original event element
    getProxyElement(assignmentRecord) {
        const { dragData } = this;

        if (this.isDragging && dragData?.proxyElements?.length) {
            const index = dragData.assignmentRecords.indexOf(assignmentRecord);

            if (index >= 0) {
                const proxyElement = dragData.proxyElements[index];

                // Proxy is the event wrap; anchor to its inner core bar (like the static path) so the
                // endpoint tracks the bar, not a buffer strip. Falls back to the proxy when drag-creating.
                return DomHelper.down(proxyElement, this.client.eventInnerSelector) || proxyElement;
            }
        }

        return null;
    }

    //endregion

    //#region Salesforce hooks

    getMouseMoveEventTarget(event) {
        return event.target;
    }

    //#endregion

    //region Engine-driven date resolution

    // The methods below replace DragBase's default date calculation when the event participates in a scheduling
    // engine graph

    getEventStartEndDatesFromGraph(eventRecord, startDate, toClient) {
        let endDate;

        // resolve link to true record
        eventRecord = eventRecord.originalRecord;

        const
            {
                newResource,
                resourceRecord,
                assignmentRecords
            }              = this.dragData,
            {
                constraints : adjustByConstraints,
                dependencies : adjustByDependencies
            }              = this.constrainDragByEngine,
            targetProject  = toClient.project,
            targetGraph    = targetProject.graph,
            isCrossProject = targetProject !== eventRecord.project,
            // make a new branch to operate in
            branch         = targetGraph.branch({
                autoCommit         : false,
                onComputationCycle : 'throw',
                project            : targetProject
            });

        // If we are dragging the event to another client
        if (isCrossProject) {
            // Cannot compute dates without a target resource in a cross-project scenario
            if (!newResource) {
                branch.clearBranch();
                return false;
            }

            // copy the event
            eventRecord             = eventRecord.copy();
            eventRecord.parentEvent = targetProject.eventStore.rootNode;
            eventRecord.project     = targetProject;
            // and add it to the client graph
            branch.addEntity(eventRecord);

            // copy the assignments and add them to the client graph
            for (const assignment of assignmentRecords) {
                branch.addEntity(assignment.copy({
                    eventId    : eventRecord.id,
                    event      : eventRecord,
                    resourceId : newResource.id,
                    resource   : newResource
                }));
            }
        }
        // if dragging in the same project and moving to other resource
        else if (newResource && newResource !== resourceRecord) {
            for (const assignment of assignmentRecords) {
                branch.write(assignment.$.resource, newResource);
            }
        }

        if (!adjustByConstraints || !adjustByDependencies) {
            // deactivate own and all parent constraints since we don't want them to restrict our setting of startDate
            eventRecord.bubbleWhile(node => {
                // parent is not in the graph? ..stop iterating
                if (!node.graph) {
                    return false;
                }

                if (!adjustByConstraints && node.$.constraintType) {
                    branch.write(node.$.constraintType, null);
                }

                if (!adjustByDependencies) {
                    // deactivate all dependencies to not interfere with setting startDate
                    for (const predecessor of node.dependencies) {
                        branch.write(predecessor.$.active, false);
                    }
                }

                return true;
            });
        }

        branch.write(eventRecord.$.startDate, startDate);

        // If that's a Gantt task — disable its respect for the project border to not interfere our reading dates
        if (eventRecord.$.projectConstraintResolution) {
            branch.write(eventRecord.$.projectConstraintResolution, 'ignore');
        }

        try {
            startDate = branch.read(eventRecord.$.startDate);
            endDate   = branch.read(eventRecord.$.endDate);
        }
        catch {
            return false;
        }
        finally {
            // cleanup the branch
            branch.clearBranch();
        }

        return { startDate, endDate };
    }

    getEventNewStartEndDates(eventRecord, timeDiff, toClient) {
        // Use the engine's actual outcome when a graph is attached, ignoring non-working time
        if (eventRecord.graph && !this.allowNonWorkingTimeSNET &&
            (!eventRecord.manuallyScheduled || eventRecord.project.skipNonWorkingTimeWhenSchedulingManually)
        ) {
            // calculate and round new startDate based on actual timeDiff
            const startDate = this.adjustStartDate(eventRecord.startDate, timeDiff);

            try {
                return this.getEventStartEndDatesFromGraph(eventRecord, startDate, toClient);
            }
            catch {
                // the `skipNonWorkingTime` and other calendar-related methods can issue `EmptyCalendarEffect` effect
                // when the calendar does not contain sufficient work space to schedule the event from the given drop
                // point — the `run` method throws in such case, marking the drop as invalid
                return { valid : false };
            }
        }

        return super.getEventNewStartEndDates(eventRecord, timeDiff, toClient);
    }

    applyResolvedStartEndDates(eventRecord, range, client) {
        const { dragData } = this;

        // Use the engine's actual outcome when a graph is attached, ignoring non-working time
        if (eventRecord.graph && !this.allowNonWorkingTimeSNET) {
            const result = this.getEventStartEndDatesFromGraph(eventRecord, range.startDate, client);

            // false means no valid target resource (e.g., cross-project drag over header)
            if (result) {
                Object.assign(dragData, result);
            }
            else {
                dragData.valid = false;
            }
        }
        else {
            super.applyResolvedStartEndDates(eventRecord, range, client);
        }
    }

    //endregion
}

EventDrag.initClass();
