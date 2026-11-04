import Model from '../../Core/data/Model.js';

/**
 * @module TaskBoard/model/ColumnModel
 */

/**
 * Represents a single column on a TaskBoard.
 *
 * When creating a TaskBoard, you can either supply an initial set of columns or have the columns be loaded remotely
 * as part of the Project data. These columns are either defined as plain strings,
 * ColumnModel data objects or ColumnModel records (or a mix thereof). When using strings, the string will be used as is
 * as the column's id and capitalized as its text.
 *
 * ```javascript
 * const doneColumn = new ColumnModel({
 *     id   : 'done',
 *     text : 'Done'
 * });
 *
 * const taskBoard = new TaskBoard({
 *     columns : [
 *         // String, equal to passing { id : 'todo', text : 'Todo' }
 *         'todo',
 *         // Data object, in this case with a fixed width and not collapsible from the UI
 *         { id : 'doing', text : 'Doing', width : 200, collapsible : false }
 *         // Record, not commonly used since it is easier to supply the data object directly
 *         doneColumn
 *     ]
 * });
 * ```
 *
 * ## Loading Columns remotely
 *
 * ```javascript
 * const taskBoard = new TaskBoard({
 *     // Project will load columns, tasks, resources and assignments
 *     project : {
 *         loadUrl  : 'data/data.json',
 *         autoLoad : true
 *     }
 * });
 * ```
 *
 * data.json
 * ```json
 * {
 *   "success" : true,
 *   "columns" : {
 *     "rows" : [
 *       {
 *         "id"   : "todo",
 *         "text" : "Todo"
 *       },
 *       {
 *         "id"          : "doing",
 *         "text"        : "Doing",
 *         "tasksPerRow" : 2
 *       },
 *       {
 *         "id"          : "review",
 *         "text"        : "Review",
 *         "tasksPerRow" : 2
 *       },
 *       {
 *         "id"          : "done",
 *         "text"        : "Done",
 *         "tasksPerRow" : 2
 *       }
 *     ]
 *   }
 * }
 * ```
 *
 * You can see this in action in the `columns-remote` demo in the examples folder.
 *
 * @extends Core/data/Model
 * @uninherit Core/data/mixin/TreeNode
 */
export default class ColumnModel extends Model {

    static $name = 'ColumnModel';

    static fields = [
        /**
         * This column's unique id, used to match a task to a column (which field on a task to match is specified using
         * then {@link TaskBoard.view.TaskBoardBase#config-columnField} config on TaskBoard).
         * @field {String|Number} id
         */

        /**
         * Text displayed in the column header.
         * @field {String} text
         */
        'text',

        /**
         * By default, the header text is HTML-encoded. Set this flag to `false` to disable this and allow html
         * elements in the column header
         * @field {Boolean} htmlEncodeHeaderText
         */
        { name : 'htmlEncodeHeaderText', type : 'boolean', persist : false },

        /**
         * A tooltip string to show when hovering the column header
         * @field {String} tooltip
         */
        'tooltip',

        /**
         * Color, named colors are applied as a `b-color-{color}` (for example `b-color-red`) CSS class to the column.
         * Colors specified as hex, `rgb()` etc. are also accepted.
         *
         * By default it does not visually affect the UI, but it applies a primary color (sets the `--b-primary` CSS
         * variable) to the column that applications can leverage to style it in the desired way.
         *
         * Using named colors:
         *
         * ```javascript
         * const taskBoard = new TaskBoard({
         *     columns : [
         *         { id : 'todo', text : 'Todo', color : 'b-orange', tooltip : 'These are items to be done' }
         *     ]
         * });
         * ```
         *
         * Will result in:
         *
         * ```html
         * <div class="b-task-board-column b-color-orange">
         * ```
         *
         * Which can the be used for example like:
         *
         * ```css
         * .b-task-board-column-header {
         *     border-left : 5px solid var(--b-primary);
         * }
         * ```
         *
         * Using non-named colors:
         *
         * ```javascript
         * const taskBoard = new TaskBoard({
         *     columns : [
         *         { id : 'todo', text : 'Todo', color : 'hsl(229deg 66% 42%)' }
         *     ]
         * });
         * ```
         *
         * Will result in:
         *
         * ```html
         * <div class="b-task-board-column" style="--b-primary: hsl(229deg 66% 42%)">
         * ```
         *
         * For the list of predefined named colors, see {@link Core.Base#typedef-Color}.
         *
         * @field {Color} color
         */
        { name : 'color', type : 'string', persist : false },

        /**
         * Number of tasks per row to display in this column. Leave blank to use the setting from the
         * {@link TaskBoard.view.TaskBoardBase#config-tasksPerRow} config on TaskBoard.
         * @field {Number} tasksPerRow
         */
        { name : 'tasksPerRow', type : 'int', persist : false },

        /**
         * Allow collapsing this column
         * @field {Boolean} collapsible=true
         */
        { name : 'collapsible', type : 'boolean', defaultValue : true, persist : false },

        /**
         * Collapsed (`true`) or expanded (`false`)
         *
         * To expand or collapse, use {@link #function-expand} and  {@link #function-collapse} functions.
         *
         * @field {Boolean} collapsed
         * @readonly
         */
        { name : 'collapsed', type : 'boolean', persist : false },

        /**
         * Set to `true` to hide the column, `false` to show it again.
         * @field {Boolean} hidden
         */
        { name : 'hidden', type : 'boolean', persist : false },

        /**
         * Column width in px.
         * @field {Number} width
         */
        { name : 'width', type : 'number', persist : false },

        /**
         * Column flex, affects width.
         * @field {Number} flex
         */
        { name : 'flex', type : 'number', persist : false },

        /**
         * Column min-width in px. To override the default min-width specified in CSS.
         * @field {Number} minWidth
         */
        { name : 'minWidth', type : 'number', persist : false },

        /**
         * Set to 'start' or 'end' to lock the column on the inline start or end side (left or right for LTR, vice versa
         * for RTL) of other columns, otherwise set to `null` to do not lock the column.
         * @field {'start'|'end'|null} locked
         */
        { name : 'locked', type : 'string', defaultValue : null, persist : false },

        /**
         * If 'true', a sort icon is displayed in the column header, allowing the user to sort the tasks. Requires the
         * {@link TaskBoard.feature.ColumnSort} feature to be enabled.
         * @field {Boolean} sortable
         */
        { name : 'sortable', type : 'boolean', defaultValue : true, persist : false },

        /**
         * If 'true', a filter icon is displayed in the column header, allowing the user to do complex filter operations
         * on the column's tasks. Requires the {@link TaskBoard.feature.ColumnFilter} feature to be enabled.
         * @field {Boolean} filterable
         */
        { name : 'filterable', type : 'boolean', defaultValue : true, persist : false },

        /**
         * If 'true', a search field is displayed in the column header, allowing the user to quick filter the column's
         * tasks. Requires the {@link TaskBoard.feature.FilterBar} feature to be enabled.
         * @field {Boolean} searchable
         */
        { name : 'searchable', type : 'boolean', defaultValue : true, persist : false },

        /**
         * Id of the column group this column belongs to, or `null` when the column is not grouped.
         *
         * Columns sharing the same `group` id are rendered together inside a chrome-less flex container (see
         * {@link TaskBoard.view.mixin.TaskBoardColumnGroups#config-columnGroupsDirection}). This field is normally populated
         * automatically by nesting column configs in a sub-array of the
         * {@link TaskBoard.view.mixin.TaskBoardColumns#config-columns} config. Power users may also set it explicitly, on
         * a plain column config object, on a record of a `columns` Store instance, or on any record after the store is
         * created - but a `group` carried by a record passed through the `columns` config is cleared, since nesting that
         * record (or not) in a sub-array is what declares its group there.
         *
         * Columns sharing a `group` id must be **contiguous** in the store, and must all share the same
         * {@link #field-locked} value - changing a member's lock so it differs from the rest ejects it from the group.
         *
         * @field {String|null} group
         */
        { name : 'group', type : 'string', defaultValue : null, persist : false }
    ];

    // Holds a chained store for the tasks belonging to this column
    taskStore = null;

    columnFilterVisible = false;

    /**
     * Get the tasks in this column in visual order.
     * @member {TaskBoard.model.TaskModel[]}
     * @readonly
     */
    get tasks() {
        return this.taskStore?.records;
    }

    get taskBoard() {
        return this.firstStore.taskBoard;
    }

    /**
     * `true` if this is the catch-all column (its {@link #field-id} is `'*'`), which holds tasks not matched by any
     * other column. The catch-all column can never be part of a column group.
     * @member {Boolean}
     * @readonly
     * @category Columns
     */
    get isCatchAll() {
        return this.id === '*';
    }

    /**
     * Collapse this column.
     *
     * Uses a transition by default, await the call to be certain that it has finished.
     *
     * @category Expand/collapse
     * @returns {Promise} A promise which is resolved when the column is collapsed
     */
    async collapse() {
        return this.taskBoard.collapse(this);
    }

    /**
     * Expand this column.
     *
     * Uses a transition by default, await the call to be certain that it has finished.
     *
     * @category Expand/collapse
     * @returns {Promise} A promise which is resolved when the column is expanded
     */
    async expand() {
        return this.taskBoard.expand(this);
    }

    onFilter(filter) {}

    onClearFilters() {}

}
