/**
 * @module Gantt/model/mixin/TaskModelSharedMixin
 */

/**
 * Mixin holding task API shared between the Gantt {@link Gantt.model.TaskModel} and the community-tier
 * {@link Gantt.model.TaskModelCommunity}.
 * @mixin
 * @tier community
 */
export default Target => class TaskModelSharedMixin extends Target {
    static $name = 'TaskModelSharedMixin';

    /**
     * This static configuration option allows you to control whether an empty parent task should be converted into a
     * leaf. Enable/disable it for a whole class:
     *
     * ```javascript
     * TaskModel.convertEmptyParentToLeaf = false;
     * ```
     *
     * By specifying `true`, all empty parents will be considered leafs. Can also be assigned a configuration object
     * with the following Boolean properties to customize the behavior:
     *
     * * `onLoad` - Apply the transformation on load to any parents without children (`children : []`)
     * * `onRemove` - Apply the transformation when all children have been removed from a parent
     *
     * ```javascript
     * TaskModel.convertEmptyParentToLeaf = {
     *     onLoad   : false,
     *     onRemove : true
     * }
     * ```
     *
     * @member {Boolean|ConvertEmptyParentToLeafOptions} convertEmptyParentToLeaf
     * @default true
     * @static
     * @category Parent & children
     */

    static get fields() {
        return [
            /**
             * Unique identifier of task (mandatory)
             * @field {String|Number} id
             * @category Common
             */

            /**
             * Name of the task
             * @field {String} name
             * @category Common
             */

            /**
             * A set of resources assigned to this task
             * @field {Set} assigned
             * @readonly
             * @category Common
             */

            /**
             * Start date of the task in ISO 8601 format
             *
             * UI fields representing this data field are disabled for summary events
             * except the {@link #field-manuallyScheduled manually scheduled} events.
             * See {@link Gantt/model/TaskModel#function-isEditable} for details.
             *
             * Note that the field always returns a `Date`.
             *
             * @field {Date} startDate
             * @accepts {String|Date}
             * @category Scheduling
             */

            /**
             * End date of the task in ISO 8601 format
             *
             * UI fields representing this data field are disabled for summary events
             * except the {@link #field-manuallyScheduled manually scheduled} events.
             * See {@link Gantt/model/TaskModel#function-isEditable} for details.
             *
             * Note that the field always returns a `Date`.
             *
             * @field {Date} endDate
             * @accepts {String|Date}
             * @category Scheduling
             */

            /**
             * The numeric part of the task duration (the number of units).
             *
             * For a summary task the duration is calculated from its {@link #field-startDate} and
             * {@link #field-endDate}, which span the dates of its active children (all children if the summary task
             * is inactive too), unless the summary task is {@link #field-manuallyScheduled manually scheduled}.
             * The whole project duration is available as {@link Gantt.model.ProjectModel#field-duration}.
             *
             * UI fields representing this data field are disabled for summary events
             * except the {@link #field-manuallyScheduled manually scheduled} events.
             * See {@link Gantt/model/TaskModel#function-isEditable} for details.
             *
             * @field {Number} duration
             * @category Scheduling
             */

            /**
             * The unit part of the task duration, defaults to "day" (days). Valid values are:
             *
             * | Unit           | Description   |
             * |----------------|---------------|
             * | `millisecond`  | Milliseconds  |
             * | `second`       | Seconds       |
             * | `minute`       | Minutes       |
             * | `hour`         | Hours         |
             * | `day`          | Days          |
             * | `week`         | Weeks         |
             * | `month`        | Months        |
             * | `quarter`      | Quarters      |
             * | `year`         | Years         |
             *
             * It also supports `e*` (elapsed) duration units, where tasks run continuously
             * 24 hours a day, 7 days a week, ignoring all non-working time, ideal for tasks
             * that need to run without breaks or for rough project planning with limited date/duration info.
             *
             * | Unit       | Description                                                  |
             * |------------|--------------------------------------------------------------|
             * | `eminute`  | Elapsed minute. Lasts 60 seconds.                            |
             * | `ehour`    | Elapsed hours. Lasts 60 minutes.                             |
             * | `eday`     | Elapsed day. Lasts 24 hours.                                 |
             * | `eweek`    | Elapsed week. Lasts 7 elapsed days.                          |
             * | `emonth`   | Elapsed month. Lasts 30 elapsed days.                        |
             * | `equarter` | Elapsed quarter. Lasts 3 elapsed months.                     |
             * | `eyear`    | Elapsed year. Lasts 3 elapsed quarters or 12 elapsed months. |
             *
             * For example:
             *
             * ```js
             * new TaskModel({
             *     startDate    : '2024-09-10',
             *     endDate      : '2024-09-17',
             *     duration     : 7,
             *     durationUnit : 'ed'
             * });
             * ```
             *
             * This field is readonly after creation, to change it use the {@link Gantt/model/TaskModel#function-setDuration} call.
             * @field {DurationUnit} durationUnit
             * @default "day"
             * @category Scheduling
             */



            /**
             * A freetext note about the task.
             * @field {String} note
             * @category Common
             */
            { name : 'note', type : 'string' },

            'parentId',

            /**
             * When set to `true`, the {@link #field-startDate} of the task will not be changed by any of its incoming
             * dependencies or constraints.
             *
             * @field {Boolean} manuallyScheduled
             * @category Scheduling
             */

            /**
             * Child nodes. To allow loading children on demand, specify `children : true` in your data. Omit the field
             * for leaf tasks.
             *
             * Note, if the task store loads data from a remote origin, make sure {@link Core/data/AjaxStore#config-readUrl}
             * is specified, and optionally {@link Core/data/AjaxStore#config-parentIdParamName} is set, otherwise
             * {@link Core/data/Store#function-loadChildren} has to be implemented.
             *
             * @field {Gantt.model.TaskModel[]} children
             * @accepts {Boolean|Object[]|Gantt.model.TaskModel[]}
             * @readonly
             * @category Parent & children
             */
            { name : 'children', persist : false },

            /**
             * An encapsulation of the CSS classes to be added to the rendered event element.
             *
             * Always returns a {@link Core.helper.util.DomClassList}, but may still be treated as a string. For
             * granular control of adding and removing individual classes, it is recommended to use the
             * {@link Core.helper.util.DomClassList} API.
             *
             * @field {Core.helper.util.DomClassList} cls
             * @accepts {Core.helper.util.DomClassList|String} cls
             * @category Styling
             */
            {
                name      : 'cls',
                serialize : value => value.isDomClassList ? value.toString() : value,
                persist   : true
            },

            /**
             * CSS class specifying an icon to apply to the task row
             * @field {String} iconCls
             * @category Styling
             */
            'iconCls',

            /**
             * CSS class specifying an icon to apply to the task bar
             * @field {String} taskIconCls
             * @category Styling
             */
            'taskIconCls',

            /**
             * Specify false to prevent the event from being dragged (if {@link Gantt/feature/TaskDrag} feature is used)
             * @field {Boolean} draggable
             * @default true
             * @category Interaction
             */
            { name : 'draggable', type : 'boolean', persist : false, defaultValue : true },   // true or false

            /**
             * Specify false to prevent the task from being resized (if {@link Gantt/feature/TaskResize} feature is
             * used). You can also specify 'start' or 'end' to only allow resizing in one direction
             * @field {Boolean|String} resizable
             * @default true
             * @category Interaction
             */
            { name : 'resizable', persist : false, defaultValue : true },                  // true, false, 'start' or 'end'

            { name : 'sequenceNumber', persist : false, calculated : true, internal : true },

            // Override TreeNode parentIndex to make it persistable
            { name : 'parentIndex', type : 'number', persist : true }
        ];
    }

    get isTask() {
        return true;
    }

    // To pass as an event when using a Gantt project with Scheduler
    get isEvent() {
        return true;
    }

    //region Milestone

    get milestone() {
        // a summary task may have zero duration due to working time periods mismatch w/ its children
        // so we operate start and end date pair here
        if (!this.isLeaf) {
            const { startDate, endDate } = this;

            if (startDate && endDate) {
                return endDate.getTime() === startDate.getTime();
            }
        }

        return this.duration === 0;
    }

    set milestone(value) {
        value ? this.convertToMilestone() : this.convertToRegular();
    }

    async setMilestone(value) {
        return value ? this.convertToMilestone() : this.convertToRegular();
    }

    /**
     * Converts this task to a milestone (start date will match the end date).
     * @propagating
     */
    async convertToMilestone() {
        return this.setDuration(0, this.durationUnit, false);
    }

    /**
     * Converts the milestone task to a regular task with a duration of 1 (keeping current {@link #field-durationUnit}).
     * @propagating
     */
    async convertToRegular() {
        if (this.milestone) {
            return this.setDuration(1, this.durationUnit, false);
        }
    }

    //endregion

    //region SequenceNumber

    /**
     * Returns count of all sibling nodes (including their children).
     * @member {Number}
     * @readonly
     */
    get previousSiblingsTotalCount() {
        let task  = this.previousSibling,
            count = this.parentIndex;

        while (task) {
            count += task.descendantCount;
            task = task.previousSibling;
        }

        return count;
    }

    /**
     * Returns the sequential number of the task. A sequential number means the ordinal position of the task in the
     * total dataset, regardless of its nesting level and collapse/expand state of any parent tasks. The root node has a
     * sequential number equal to 0.
     *
     * For example, in the following tree data sample sequential numbers are specified in the comments:
     * ```javascript
     * root : {
     *     children : [
     *         {   // 1
     *             leaf : true
     *         },
     *         {       // 2
     *             children : [
     *                 {   // 3
     *                     children : [
     *                         {   // 4
     *                             leaf : true
     *                         },
     *                         {   // 5
     *                             leaf : true
     *                         }
     *                     ]
     *                 }]
     *         },
     *         {   // 6
     *             leaf : true
     *         }
     *     ]
     * }
     * ```
     * If we collapse parent tasks, sequential number of collapsed tasks won't change.
     *
     * @member {Number}
     * @readonly
     */
    get sequenceNumber() {
        // Shortcut when part of a store, much cheaper (adapted to work for links)
        const { $original } = this;
        if ($original.taskStore) {
            return $original.taskStore.allIndexOf($original) + 1;
        }

        // More expensive calculation when not part of a store, to please tests
        let code = 0,
            task = this;

        while (task.parent) {
            code += task.previousSiblingsTotalCount + 1;
            task = task.parent;
        }

        return code;
    }

    //endregion
};

