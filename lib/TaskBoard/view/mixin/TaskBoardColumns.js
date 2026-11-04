import Base from '../../../Core/Base.js';
import Store from '../../../Core/data/Store.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import StringHelper from '../../../Core/helper/StringHelper.js';
import SparseIndexHelper from '../../../Core/helper/SparseIndexHelper.js';
import ColumnModel from '../../model/ColumnModel.js';

/**
 * @module TaskBoard/view/mixin/TaskBoardColumns
 */

const transitionChangeActions = {
    remove : 1,
    move   : 1,
    update : 1,
    filter : 1
};

/**
 * Mixin that handles columns for the TaskBoard.
 *
 * ### Adding a catch-all column
 *
 * To add a column to display tasks not contained in any other column, simply add a column with name `'*'` to the
 * {@link #config-columns} config.
 *
 * ```javascript
 *     static configurable = {
 *         columnField : 'alignment`,
 *         columns     : [ 'left', 'center', 'right', { name : '*', label : 'Other' } ],
 *         ...
 *     }
 * ```
 *
 * {@inlineexample TaskBoard/view/mixin/CatchAllColumn.js}
 *
 * ### Column Groups
 *
 * Columns can be grouped together by nesting their configs in a sub-array of the {@link #config-columns} config. Each
 * sub-array becomes a chrome-less group that arranges its member columns together:
 *
 * ```javascript
 *     columns : [
 *         'todo',
 *         ['doing', 'review'],  // grouped columns
 *         'done'
 *     ]
 * ```
 *
 * See {@link TaskBoard.view.mixin.TaskBoardColumnGroups} for details.
 *
 * @mixin
 */
export default Target => class TaskBoardColumns extends (Target || Base) {

    //region Config

    static $name = 'TaskBoardColumns';

    static configurable = {
        /**
         * Store containing the TaskBoard columns.
         *
         * @member {Core.data.Store} columns
         * @category Common
         */
        /**
         * Store containing the TaskBoard columns. A tasks {@link #config-columnField} is matched against the `id` of a
         * column to determine in which column it is displayed.
         *
         * Accepts an array of column records/objects/primitive scalars, a store instance, a store id or a store config object
         * used to create a new store.
         *
         * When supplying an array, a store configured with {Core.data.mixin.StoreProxy#config-objectify} is
         * automatically created. Using that config allows for a nicer interaction syntax with the columns:
         *
         * ```javascript
         * // Without objectify:
         * taskBoard.columns.getById('done').text = 'Finished';
         *
         * // With objectify:
         * taskBoard.columns.done.text = 'Finished';
         * ```
         *
         * When supplying primitive scalars (strings, numbers, etc.), the value will be used as the columns `id` and a
         * capitalized string version of it is used as the columns text:
         *
         * ```javascript
         * taskBoard = new TaskBoard({
         *    columns : [
         *        'doing',
         *        'done'
         *    ]
         * });
         * ```
         *
         * Is equivalent to:
         *
         * ```javascript
         * taskBoard = new TaskBoard({
         *    columns : [
         *        { id : 'doing', text : 'Doing' },
         *        { id : 'done', text : 'Done' }
         *    ]
         * });
         * ```
         *
         * Columns data can be also be loaded remotely as part of the Project dataset.
         *
         * Columns can be grouped together by nesting their configs in a sub-array. Each sub-array becomes a chrome-less
         * group that arranges its member columns together:
         *
         * ```javascript
         * taskBoard = new TaskBoard({
         *    columns : [
         *        'todo',
         *        ['doing', 'review'],  // grouped columns
         *        'done'
         *    ]
         * });
         * ```
         *
         * See {@link TaskBoard.view.mixin.TaskBoardColumnGroups} for details.
         *
         * {@note}By adding a column with id `*`, a catch-all column is created that will hold all tasks that do not
         * match any of the other columns, including tasks where the column id is not set.{/@note}
         *
         * @config {TaskBoard.model.ColumnModel[]|ColumnModelConfig[]|String[]|Number[]|Core.data.Store|String|StoreConfig}
         * @category Common
         */
        columns : {},

        /**
         * Set to `true` to auto generate columns when {@link #config-columns} is undefined.
         *
         * A column will be created for each distinct value of {@link #config-columnField} on the tasks. The columns
         * will be sorted in alphabetical order. The following snippet will yield two columns, Q1 and Q2:
         *
         * ```javascript
         * const taskBoard = new TaskBoard({
         *    columnField : 'quarter',
         *
         *    autoGenerateColumns : true,
         *
         *    project : {
         *        tasks : [
         *            { id : 1, name : 'Inform tenants', quarter : 'Q1' },
         *            { id : 2, name : 'Renovate roofs', quarter : 'Q2' }
         *        ]
         *    }
         * });
         * ```
         *
         * @config {Boolean}
         * @category Advanced
         */
        autoGenerateColumns : false,

        /**
         * Field on a task record used to determine which column the task belongs to.
         *
         * ```javascript
         * taskBoard.columnField = 'category';
         * ```
         *
         * @member {String} columnField
         * @category Common
         */
        /**
         * Field on a task record used to determine which column the task belongs to.
         *
         * ```javascript
         * const taskBoard = new TaskBoard({
         *    columnField : 'status',
         *
         *    columns : [
         *        'todo',
         *        'done'
         *    ],
         *
         *    project : {
         *        tasks : [
         *            // Linked using the status field, to the done column
         *            { id : 1, name : 'Fun task', status : 'done' }
         *        ]
         *    }
         * });
         * ```
         *
         * @config {String}
         * @category Common
         */
        columnField : null,

        /**
         * Columns hold their tasks in stores chained off the project's task store. Filters applied to the project store
         * are by default not applied to the column stores; they are only affected by their own filters. By configuring
         * `chainFilters : true`, the filters from the project store will also be taken into account when filtering the
         * columns.
         *
         * Filters on the columns' stores are applied separately, and clearing the filters on them by using
         * {@link Core/data/mixin/StoreFilter#function-clearFilters} will *not* clear the filter(s) on the project's store.
         *
         * See also {@link Core/data/mixin/StoreChained#config-chainFilters}.
         *
         * @prp {Boolean}
         * @category Common
         * @default
         */
        chainFilters : false
    };

    static properties = {
        shouldAutoGenerateColumns : false,
        /**
         * Object with ids of non-catch-all columns as keys, used to determine tasks to show in the catch-all column.
         * @member {Object<String|Number, Boolean>}
         * @internal
         */
        matchColumnIds            : null
    };

    get widgetClass() {}

    //endregion

    //region Column groups fallback

    // Column groups are an enterprise feature (see TaskBoardColumnGroups, which is mixed in after this mixin and
    // replaces the members below). These fallbacks let the community / business tiers run the shared render and DOM
    // code without any column group knowledge: nothing is ever grouped, a nested `columns` sub-array is flattened.
    get hasColumnGroups() {
        return false;
    }

    get isVerticalColumnGroups() {
        return false;
    }

    get isIgnoringSwimlanes() {
        return false;
    }

    flattenColumnGroups(columns) {
        return columns.flat();
    }

    invalidateColumnGroups() {}

    syncColumnGroupLock() {}

    dissolveColumnGroupRemainder() {}

    getColumnGroupContainerId() {
        return null;
    }

    getColumnGroupColumns(columnRecord) {
        return [columnRecord];
    }

    mapColumnGroupItems(columns, renderFn) {
        return columns.map(column => !column.hidden && renderFn(column));
    }

    //endregion

    //region Type assertions

    changeAutoGenerateColumns(autoGenerateColumns) {
        ObjectHelper.assertBoolean(autoGenerateColumns, 'autoGenerateColumns');

        return autoGenerateColumns;
    }

    changeColumnField(columnField) {
        ObjectHelper.assertString(columnField, 'columnField');

        return columnField;
    }

    //endregion

    //region Config - columnField

    updateColumnField(field, old) {
        const
            me        = this,
            taskStore = me.project?.taskStore;

        if (old) {
            const { storage } = taskStore;

            if (old !== me.swimlaneField) {
                storage.removeIndex(old);
            }

            storage.addIndex({ property : field, unique : false });
            storage.addIndex({
                property    : me.swimlaneField,
                unique      : false,
                dependentOn : { [me.swimlaneField] : true }
            });
        }

        me.shouldAutoGenerateColumns = field && me.autoGenerateColumns;

        // When columns are updated before columnField, their taskStores need to be chained here too.
        me.columns?.forEach(columnRecord => {
            columnRecord.taskStore = null;
            me.chainColumnTaskStore(columnRecord, taskStore);
        });
    }

    //endregion

    //region Config - columns

    updateMatchColumnIds(columns) {
        const
            me             = this,
            catchAllColumn = columns?.getById('*'),
            taskStore      = me.project?.taskStore;

        if (catchAllColumn) {
            me.matchColumnIds = columns.reduce((ids, col) => {
                if (col.id !== '*') {
                    ids[col.id] = true;
                }
                return ids;
            }, {});
            me.chainColumnTaskStore(catchAllColumn, taskStore);
        }
        else {
            me.matchColumnIds = null;
        }
    }

    changeColumns(columns) {
        const me = this;

        // Nested sub-arrays in the columns config express chrome-less column groups. Flatten them into the flat store,
        // assigning a synthetic `group` id to each member so grouping survives in the data model (see TaskBoardColumnGroups).
        if (Array.isArray(columns)) {
            columns = me.flattenColumnGroups(columns);
        }
        // `columns` also accepts a store config object, which holds its rows in `data`. `Store.from` applies the
        // converterFn to the array form only, so that form is given the exact same flatten + scalar normalization here
        // (without it a nested array reaches Model#processData raw and throws).
        else if (columns && !columns.isStore && typeof columns === 'object' && Array.isArray(columns.data)) {
            columns = {
                ...columns,
                data : me.flattenColumnGroups(columns.data).map(column => me.normalizeColumnConfig(column))
            };
        }

        return Store.from(columns, { objectify : true, id : 'columns', modelClass : ColumnModel }, column => me.normalizeColumnConfig(column)); // no-sanity
    }

    // Normalizes any primitive scalar (string, number, etc.) to a column config, otherwise ColumnModel would be
    // constructed directly from the primitive and throw in Model#processData
    normalizeColumnConfig(column) {
        if (column != null && typeof column !== 'object') {
            return { id : column, text : StringHelper.capitalize(String(column)) };
        }

        return column;
    }

    updateColumns(columns) {
        const
            me        = this,
            taskStore = me.project?.taskStore;

        me.detachListeners('columns');

        // The columns store (or its group membership) changed, drop the cached hasColumnGroups result
        me.invalidateColumnGroups();

        me.updateMatchColumnIds(columns);

        if (columns) {
            // Link to us to be able to retrieve tasks in visual order
            // $store is the store instance of an objectified store
            (columns.$store || columns).taskBoard = me;

            columns.forEach(columnRecord => me.chainColumnTaskStore(columnRecord, taskStore));

            columns.ion({
                change  : 'onColumnsChange',
                refresh : 'onColumnsChange',
                thisObj : me
            });
        }
    }

    updateChainFilters(chainFilters, oldValue) {
        const
            me          = this,
            { columns } = me,
            taskStore   = me.project?.taskStore;

        // skip for initial update; columns will be chained in updateColumns
        if (columns && oldValue != null) {
            columns.forEach(columnRecord => {
                columnRecord.taskStore = null;
                me.chainColumnTaskStore(columnRecord, taskStore);
            });
        }
    }

    get columns() {
        const
            me        = this,
            taskStore = me.project?.taskStore;

        // If there are no columns defined but we have a column field configured and we have tasks loaded, generate
        // columns from the tasks
        if (me.shouldAutoGenerateColumns && taskStore?.count) {
            me.columns = taskStore.getDistinctValues(me.columnField).filter(col => col != null).sort();
            me.shouldAutoGenerateColumns = false;
        }

        return me._columns;
    }

    // Creates a chained store to hold the items belonging to the column, to enable per-column filtering/sorting.
    chainColumnTaskStore(columnRecord, taskStore) {
        const
            me                            = this,
            {
                columnField,
                swimlaneField,
                chainFilters,
                matchColumnIds
            }                             = me,
            isCatchAllColumn              = columnRecord.id === '*',
            {
                reapplyFilterOnAdd,
                reapplyFilterOnUpdate
            }                             = taskStore ?? {},
            { taskStore : previousStore } = columnRecord;

        if (!taskStore || (previousStore?.masterStore === taskStore && !isCatchAllColumn)) {
            return;
        }

        if (previousStore) {
            previousStore.removeAllListeners();
            previousStore.destroy();
        }

        const chainFn = isCatchAllColumn
            ? task => !matchColumnIds[task[columnField]]
            : task => task[columnField] && task[columnField] === columnRecord.id;

        columnRecord.taskStore = taskStore.chain(
            chainFn,
            [columnField],
            {
                chainFilters,
                useSparseIndex          : taskStore.useSparseIndex,
                excludeCollapsedRecords : false,
                reapplyFilterOnAdd,
                reapplyFilterOnUpdate
            }
        );
        // make absolutely sure that the chained store uses the same model constructor as its master
        Object.defineProperty(columnRecord.taskStore, 'modelClass', {
            get() {
                return taskStore.modelClass;
            }
        });
        // index will not be inherited from master store, generate a new one
        columnRecord.taskStore.storage.addIndex({
            property    : swimlaneField,
            unique      : false,
            dependentOn : { [swimlaneField] : true }
        });

        columnRecord.taskStore.ion({
            change  : 'onTaskStoreChange',
            refresh : 'onTaskStoreChange',
            thisObj : me
        });
    }

    onColumnsChange(event) {
        const
            me                                   = this,
            { taskStore }                        = me.project,
            { action, changes, record, records } = event;

        // A column may have been added/removed or had its group field changed, drop the cached hasColumnGroups result
        me.invalidateColumnGroups();

        if (action === 'update' && (changes?.locked || changes?.group)) {
            // The catch-all can never be grouped, however the group field got assigned
            if (changes.group && record.group != null && record.isCatchAll) {
                record.group = null;
            }
            // All members of a group run must share one `locked` value, so a lock or group change may eject the
            // changed member
            else if (record.group != null && me.hasColumnGroups) {
                me.syncColumnGroupLock(record);
            }

            // Leaving a group must not leave a single-member remainder behind
            changes.group?.oldValue != null && me.dissolveColumnGroupRemainder(changes.group.oldValue);
        }
        else if (action === 'remove') {
            records.forEach(removed => removed.group != null && me.dissolveColumnGroupRemainder(removed.group));
        }

        me.updateMatchColumnIds(me.columns);

        // CRUD invalidates column/swimlane intersection index
        if (action === 'add' || action === 'remove' || action === 'removeAll' || action === 'update') {
            taskStore.storage.invalidateIndices();
        }

        if (records.length) {
            records.forEach(columnRecord => me.chainColumnTaskStore(columnRecord, taskStore));
        }

        if (transitionChangeActions[action]) {
            const options = {};

            if (action === 'update' || action === 'remove') {
                options.addTransition = { width : 1, opacity : 1 };
                options.removeTransition = { width : 1, opacity : 1 };
            }

            me.recomposeWithDomTransition(options);
        }
        else {
            me.recompose();
        }
    }

    // endregion

    //region Data

    getTaskColumn(taskRecord) {
        return this.columns.getById(taskRecord.getValue(this.columnField)) ?? this.columns.getById('*');
    }

    getColumnTaskCount(columnRecord) {
        if (!columnRecord.taskStore) {
            this.chainColumnTaskStore(columnRecord, this.project.taskStore);
        }

        const
            { taskStore }   = columnRecord,
            { columnField } = this;

        // Collapsed away tasks are evicted from storage, but we do not want that to affect the column task count
        if (taskStore.isTree) {
            return taskStore.query(task => task[columnField] === columnRecord.id).length;
        }

        return taskStore.count;
    }

    // <remove-on-release>
    // TODO: Move to datalayer
    // </remove-on-release>
    getColumnTasks(columnRecord, inVisualOrder = false) {
        const me = this;

        if (!columnRecord.taskStore) {
            me.chainColumnTaskStore(columnRecord);
        }

        const
            { taskStore } = columnRecord,
            {
                records : tasks,
                count,
                useSparseIndex
            }             = taskStore;

        if (inVisualOrder && count > 0) {

                if (taskStore.useSparseIndex) {
                    tasks.sort(SparseIndexHelper.sorter);
                }
                else {
                // Sort by weight within column
                    tasks.sort((a, b) => a.weight - b.weight);
                }
        }

        return tasks;
    }

    getColumn(taskRecord) {
        return this.columns.getById(taskRecord.getValue(this.columnField));
    }

    // Next task in the same column as supplied task
    getNextTask(taskRecord, wrap = true) {
        const
            columnRecord = this.getColumn(taskRecord),
            columnTasks  = this.getColumnTasks(columnRecord, true);

        let nextTaskIndex = columnTasks.indexOf(taskRecord) + 1;

        if (nextTaskIndex === columnTasks.length) {
            if (wrap) {
                nextTaskIndex = 0;
            }
            else {
                return null;
            }
        }

        return columnTasks[nextTaskIndex];
    }

    // Prev task in the same column as supplied task
    getPreviousTask(taskRecord, wrap = true) {
        const
            columnRecord = this.getColumn(taskRecord),
            columnTasks  = this.getColumnTasks(columnRecord, true);

        let prevTaskIndex = columnTasks.indexOf(taskRecord) - 1;

        if (prevTaskIndex < 0) {
            if (wrap) {
                prevTaskIndex = columnTasks.length - 1;
            }
            else {
                return null;
            }
        }

        return columnTasks[prevTaskIndex];
    }

    //endregion

    attachToProject({ taskStore }) {
        if (this.isConfiguring) {
            return;
        }

        this.columns.forEach(columnRecord => {
            if (columnRecord.taskStore) {
                columnRecord.taskStore = null;
            }

            this.chainColumnTaskStore(columnRecord, taskStore);
        });

        this.recompose();
    }
};
