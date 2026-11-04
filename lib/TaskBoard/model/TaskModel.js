import EventModel from './EventModel.js';

/**
 * @module TaskBoard/model/TaskModel
 */

/**
 * Represents a single task on your TaskBoard, usually added to a {@link TaskBoard/store/TaskStore}.
 *
 * ## Customizing Task fields
 *
 * The TaskModel has a few predefined fields as seen under Fields below. If you want to add new fields or change
 * existing fields, you can do that by subclassing this class:
 *
 * ```javascript
 * class MyTask extends TaskModel {
 *
 *     static get fields() {
 *         return [
 *            // Add a new field
 *            { name: 'myField', type : 'number', defaultValue : 0 }
 *         ];
 *     }
 *
 *     ...
 * }
 *
 * // Instances of your class now has getters / setters defined for your field
 * const task = new MyTask();
 * console.log(task.myField); // => 0
 * ```
 *
 * If you want to use other names for any predefined field in your data, you can reconfigure them as seen below:
 *
 * ```javascript
 * class MyTask extends TaskModel {
 *
 *     static get fields() {
 *         return [
 *            // Remap status -> state
 *            { name: 'status', dataSource : 'state' }
 *         ];
 *     }
 *
 *     ...
 * }
 * ```
 *
 * ## Configuring the Project to use a custom task model
 *
 * Here's how you configure the {@link TaskBoard/model/ProjectModel Project} to use a certain Model class:
 *
 * ```javascript
 * const taskBoard = new TaskBoard({
 *     // Configure the project to use our custom task model and to load data remotely
 *     project : {
 *         taskModelClass : MyTask,
 *
 *         autoLoad  : true
 *         transport : {
 *             load : {
 *                 url : 'data/data.json'
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ## Read-only tasks
 *
 * A task can be flagged as read-only using the {@link #field-readOnly} field. This protects it from being edited in the
 * UI, but has no effect on the data layer.
 *
 * {@inlineexample TaskBoard/model/TaskModelReadOnly.js}
 *
 * Please refer to {@link Core/data/Model} for additional details.
 *
 * @extends TaskBoard/model/EventModel
 */
export default class TaskModel extends EventModel {

    static $name = 'TaskModel';

    static fields = [
        /**
         * Task status, for example for linking a task to a column on the TaskBoard.
         *
         * @field {String} status
         */
        {
            name        : 'status',
            description : 'Task status, for example for linking a task to a column on the TaskBoard'
        },

        /**
         * Task priority, can be used for sorting, or to link a task to a swimlane on the TaskBoard.
         *
         * @field {String|Number} prio
         */
        {
            name        : 'prio',
            description : 'Task priority, can be used for sorting, or to link a task to a swimlane'
        },

        /**
         * Task description, by default shown in tasks body.
         *
         * @field {String} description
         */
        {
            name        : 'description',
            type        : 'string',
            description : 'Task description, by default shown in tasks body'
        },

        /**
         * Color. Named colors set the card's `--b-primary` CSS variable to `var(--b-color-{color})` (for example,
         * `var(--b-color-red)`). Hex, `rgb()` and other CSS colors set `--b-primary` directly.
         *
         * If no color is specified, any color defined on the {@link TaskBoard/model/ColumnModel#field-color column} or
         * {@link TaskBoard/model/SwimlaneModel#field-color swimlane} will apply instead.
         *
         * By default it does not visually affect the UI, but it applies a color to the task that applications can
         * leverage using `currentColor` to style it in the desired way.
         *
         * Using named colors:
         *
         * ```javascript
         * const taskBoard = new TaskBoard({
         *     project {
         *         tasks : [
         *             { id : 1, name : 'Important task', eventColor : 'b-red' }
         *         ]
         *     }
         * });
         * ```
         *
         * Will result in:
         *
         * ```html
         * <div class="b-task-board-card b-color-red">
         * ```
         *
         * Which can the be used for example like:
         *
         * ```css
         * .b-task-board-card {
         *     // currentColor is the color defined by b-red
         *     border-left : 5px solid var(--b-primary);
         * }
         * ```
         *
         * Using non-named colors:
         *
         * ```javascript
         * const taskBoard = new TaskBoard({
         *     project {
         *         tasks : [
         *             { id : 1, name : 'Important task', eventColor : '#ff0000' }
         *         ]
         *     }
         * });
         * ```
         *
         * Will result in:
         *
         * ```html
         * <div class="b-task-board-card" style="color: #ff0000">
         * ```
         *
         * For the list of predefined named colors, see {@link Core.Base#typedef-Color}.
         *
         * @field {Color} eventColor
         */
        'eventColor',

        /**
         * Task weight, used by default to determine its index in a column. Higher weights are displayed further down.
         *
         * The weight is applied as a default sorter to the {@link TaskBoard/store/TaskStore}.
         *
         * When no weights are defined, task order is determined by store order.
         *
         * @field {Number} weight
         */
        { name : 'weight', type : 'number' },

        /**
         * Set to `true` to make the task read-only, preventing it from being edited in the UI.
         *
         * See the class description above for a live demo.
         *
         * @field {Boolean} readOnly
         */
        { name : 'readOnly', type : 'boolean' },

        /**
         * Set to `true` to make the task render as a small bar in the UI. Toggling this state via UI is done through
         * the {@link TaskBoard/view/item/CollapseItem}.
         *
         * @field {Boolean} collapsed
         */
        {
            name         : 'collapsed',
            type         : 'boolean',
            defaultValue : false,
            description  : 'Set to `true` to make the task render as a small bar in the UI.'
        }
    ];
}
