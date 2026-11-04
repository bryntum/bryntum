import Store from '../../Core/data/Store.js';
import Column from '../column/Column.js';
import Localizable from '../../Core/localization/Localizable.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import Objects from '../../Core/helper/util/Objects.js';
import TreeColumnMixin from '../column/mixin/TreeColumnMixin.js';

/**
 * @module Grid/data/ColumnStore
 */

const
    columnDefinitions = {
        boolean : {
            type : 'check'
        },
        date : {
            type : 'date'
        },
        integer : {
            type   : 'number',
            format : {
                maximumFractionDigits : 0
            }
        },
        number : {
            type : 'number'
        }
    },
    lockedColumnSorters = [{
        fn : (lhs, rhs) => {
            if (lhs.grid?.features?.pinColumns?.enabled) {
                return;
            }

            return lhs.masterStore.createSorterFn([{ field : 'region' }])(lhs, rhs);
        }
    }],
    isFlex = column => column.flex && (typeof column.flex === 'number' || !column.flex.startsWith('0')),
    // Matches the dotted / bracketed paths which Model#get resolves through the record graph
    pathDelimiterRe = /[.[]/;

/**
 * A store specialized in handling {@link Grid/column/Column columns}. Used by the Grid to hold its columns and used as
 * a chained store by each SubGrid to hold theirs. Should not be instantiated directly, instead access it through
 * `grid.columns` or `subGrid.columns`.
 *
 *  ## Observing for changes
 * If you want to listen for changes to the columns in the ColumnStore. For example, if you are interested in when
 * a column has been moved, simply use the `on` method to listen for the {@link #event-move} event:
 *
 * ```javascript
 * grid.columns.on({
 *     move({ records }) {
 *         // The `records` object contains the moved column records
 *     }
 * });
 * ```
 *
 * ## Modifying columns in the ColumnStore
 *
 * ```javascript
 * // resize first column
 * grid.columns.first.width = 200;
 *
 * // remove city column
 * grid.columns.get('city').remove();
 *
 * // add new column
 * grid.columns.add({text : 'New column'});
 *
 * // add new column to specific region (SubGrid)
 * grid.columns.add({text : 'New column', region : 'locked'});
 *
 * // add new column to 'locked' region (SubGrid)
 * grid.columns.add({text : 'New column', locked : true});
 * ```
 *
 * ## Storing column state
 *
 * To store the size and position of columns after a user makes a change, please see {@link Grid/view/mixin/GridState}.
 *
 * ## Useful functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #function-add}                         | Add a column to the grid                             |
 * | {@link #function-remove}                      | Remove column(s) from the grid                       |
 * | {@link #function-get}                         | Get a column by its id or field name                 |
 * | {@link #property-visibleColumns}              | Array of currently visible columns                   |
 *
 * ## See also
 *
 * - {@link Grid.column.Column} - Base column class
 * - {@link Grid.view.Grid#config-columns} - Where columns are defined
 * - {@link Grid.view.mixin.GridState} - Persisting column state
 *
 * @extends Core/data/Store
 */
export default class ColumnStore extends Localizable(Store) {
    static $name = 'ColumnStore';

    static type = 'columnstore';

    /**
     * @hideconfigs lazyLoad, autoLoad, remoteFilter, pageSize, remotePaging, remoteSort, useRawData
     */
    /**
     * @hideproperties lazyLoad, isPaged, lastPage, pageSize
     */
    /**
     * @hidefunctions requestData, loadPage, nextPage, previousPage
     */
    /**
     * @hideevents lazyLoadStarted, lazyLoadEnded, afterRequest, beforeLoadPage, beforeRequest, loadPage, requestData
     */

    //region Events

    /**
     * Fires when a column is shown.
     * @event columnShow
     * @param {Grid.data.ColumnStore} source The store which triggered the event.
     * @param {Grid.column.Column} column The column which status has been changed.
     */

    /**
     * Fires when a column has been hidden.
     * @event columnHide
     * @param {Grid.data.ColumnStore} source The store which triggered the event.
     * @param {Grid.column.Column} column The column which status has been changed.
     */

    //endregion

    static configurable = {
        modelClass : Column,
        tree       : true,

        /**
         * Automatically adds a field definition to the {@link Core.data.Model model} of the
         * {@link Grid.view.Grid#config-store store used by the grid} (not to this `ColumnStore` itself) when a column
         * displays a field that model does not define, letting the column display and edit its data without the field
         * being declared up front. Added fields are persistable, so their values are included in `toJSON()` output
         * and in the changes sent by a `CrudManager`.
         *
         * A column is excluded when its {@link Grid.column.Column#config-field} contains a `.` or a `[`, since such
         * a path is resolved through the record graph, or when the model already defines the name, as a field or as
         * any other property on its prototype, be it a getter, setter or method. A column displaying the `children` of
         * a tree model is excluded too.
         *
         * To opt out (individual columns such as {@link Grid.column.CheckColumn} still add their own field):
         *
         * ```javascript
         * const grid = new Grid({
         *     columns : {
         *         autoAddField : false,
         *         data         : [
         *             // Column definitions here
         *         ]
         *     }
         * });
         * ```
         *
         * When `columns` is a `ColumnStore` instance, configure `autoAddField` on that instance instead.
         *
         * Fields are added as columns are created, and when a `ColumnStore` instance is assigned as a grid's `columns`,
         * but not when the grid's {@link Grid.view.Grid#config-store store} is replaced. Declare the fields on the new
         * store's model in that case.
         *
         * @config {Boolean}
         * @default
         */
        autoAddField : true,

        /**
         * `ColumnStore` uses `syncDataOnLoad` by default (with `threshold : 1`), to ensure good performance when
         * binding to columns in frameworks.
         *
         * See {@link Core/data/Store#config-syncDataOnLoad} for more information.
         *
         * @config {Boolean|SyncDataOnLoadOptions}
         * @default true
         * @readonly
         */
        syncDataOnLoad : {
            threshold : 1
        },

        // Locked columns must sort to before non-locked
        sorters : lockedColumnSorters,

        // Make sure regions stick together when adding columns
        reapplySortersOnAdd : true,

        useRawData : false
    };

    construct(config) {
        const
            me       = this,
            { grid } = config;

        // Consequences of ColumnStore construction can cause reading of grid.columns
        // so set the property early.
        if (grid) {
            grid._columnStore = me;
            me.id = `${grid.id}-columns`;
            // Visible columns must be invalidated on expand/collapse
            grid.ion({
                subGridCollapse : 'clearSubGridCaches',
                subGridExpand   : 'clearSubGridCaches',
                thisObj         : me
            });
        }

        super.construct(config);

        // So that we can invalidate cached collections which take computing so that we compute them
        // only when necessary. For example when asking for the visible leaf columns, we do not want
        // to compute that each time.
        me.ion({
            change  : me.onStoreChange,
            sort    : () => me.updateChainedStores(),
            thisObj : me,
            prio    : 1
        });
    }

    doDestroy() {
        const allColumns = [];

        if (!this.isChained) {
            this.traverse(column => allColumns.push(column));
        }

        super.doDestroy();

        // Store's destroy unjoins all records. Destroy all columns *after* that.
        if (!this.isChained) {
            allColumns.forEach(column => column.destroy());
        }
    }

    // SubGrid chained ColumnStores are in a special state. They must not have the tree flag set
    // but must still yield isTree as true, so the isTree method must defer to the master store.
    chain(chainedFilterFn, chainedFields, config) {
        return super.chain(chainedFilterFn, chainedFields, {
            ...config,
            tree : null
        });
    }

    forEach(fn, thisObj = this) {
        // Override to omit root
        this.traverseWhile((n, i) => fn.call(thisObj, n, i), true);
    }

    get squashedTotalColumnWidth() {
        // Some code here is duplicating parts of `Column#fixedWidth` getter. Modifying the code in the getter to reuse
        // its result here caused multiple tests to fail. Other consumers rely on the current implementation
        // of `fixedWidth`, so leaving that as-is to limit the blast radius of the change.
        return this.visibleColumns.reduce((sum, column) => {
            const
                { fixedWidth, minWidth, pinned, pinnedWidth, grid } = column,
                pinColumns                                          = grid?.features?.pinColumns;

            let width = fixedWidth;

            if (isFlex(column) || width == null) {
                const toMeasure = pinColumns?.enabled && ['start', 'end'].includes(pinned) && pinnedWidth != null
                    ? pinnedWidth
                    : minWidth;

                width = column.measureSize(toMeasure) ?? 0;
            }

            return sum + width;
        }, 0);
    }

    get hasFlex() {
        // flex : '0 0 15em' won't actually flex
        return this.visibleColumns.some(isFlex);
    }

    /**
     * Returns the top level columns. If using grouped columns, this is the top level columns. If no grouped
     * columns are being used, this is the leaf columns.
     * @member {Grid.column.Column[]}
     * @readonly
     */
    get topColumns() {
        return this.isChained ? this.masterStore.rootNode.children.filter(this.chainedFilterFn) : this.rootNode.children;
    }

    /**
     * Returns the visible leaf headers which drive the rows' cell content.
     * @member {Grid.column.Column[]}
     * @readonly
     */
    get visibleColumns() {
        const me = this;

        if (!me._visibleColumns) {
            me._visibleColumns = me.leaves.filter(column => column.isVisible && (!column.subGrid || !column.subGrid.collapsed)).sort(me.sorterFn);
            // Set version, for O(1) lookups in code that runs per scroll event (Header#syncIntersections)
            me._visibleColumns.asSet = new Set(me._visibleColumns);
        }

        return me._visibleColumns;
    }

    // Columns currently intersecting the viewport, for which cells should be rendered. When not using virtualization,
    // this is the same as visibleColumns
    get intersectingColumns() {
        const me = this;

        if (me.grid.virtualizeColumns) {

            if (!me._intersectingColumns) {
                me._intersectingColumns = me.leaves.filter(column =>
                    column.meta.isIntersecting && column.isVisible && (!column.subGrid || !column.subGrid.collapsed)
                ).sort(me.sorterFn);
            }

            return me._intersectingColumns;
        }

        return me.visibleColumns;
    }

    /**
     * Runs the passed function, coalescing any number of column changes made during its execution into a single grid
     * relayout instead of one per change. Should be used when making changes to several columns at once that would
     * each trigger a render pass, such as toggling {@link Grid.column.Column#config-hidden} /
     * {@link Grid.column.Column#property-visible}.
     *
     * ```javascript
     * grid.columns.batchColumnChanges(() => {
     *     grid.columns.forEach(column => {
     *         column.visible = false;
     *     });
     *     grid.columns.first.visible = true;
     * });
     * ```
     *
     * If `fn` throws, the error is re-thrown but the suspension and batching are always cleaned up first, so the store
     * is never left in a suspended state.
     *
     * @param {Function} fn Function performing the column changes.
     * @category Columns
     */
    batchColumnChanges(fn) {
        this.beginBatch();

        try {
            fn();
        }
        finally {
            this.endBatch();
        }
    }

    // Override to coalesce grid refresh across all column-store batches (see batchColumnChanges)
    beginBatch() {
        this.grid?.suspendRefresh();
        super.beginBatch();
    }

    endBatch() {
        const me = this;

        // Caches need to be cleared to ensure up-to-date visibility when the outermost batch ends
        if (me.eventsSuspended?.count === 1) {
            me.clearCaches();
            me.chainedStores?.forEach(store => store.clearCaches());
        }

        // resume first, so the single `refresh` fired by endBatch is allowed through
        me.grid?.resumeRefresh(false);
        super.endBatch();
    }

    /**
     * Sets the visibility of the passed columns in a single coalesced relayout, leaving all other columns untouched.
     * Implemented on top of {@link #function-batchColumnChanges}.
     *
     * ```javascript
     * // Hide two specific columns in a single render pass
     * grid.columns.setColumnsVisibility([grid.columns.get('age'), grid.columns.get('city')], false);
     * ```
     *
     * @param {Grid.column.Column[]} columns The columns whose visibility should be set.
     * @param {Boolean} visible `true` to show the columns, `false` to hide them.
     * @category Columns
     */
    setColumnsVisibility(columns, visible) {
        this.batchColumnChanges(() => {
            columns.forEach(column => {
                column.visible = visible;
            });
        });
    }

    onStoreChange({ action, changes }) {
        // no need to clear cache while resizing, or if column changes name
        if (action === 'update' && !('hidden' in changes)) {
            return;
        }
        this.clearCaches();
    }

    clearSubGridCaches({ subGrid }) {
        subGrid.columns.clearCaches();
        this.clearCaches();
    }

    clearCaches() {
        this._visibleColumns = this._intersectingColumns = null;
        this.masterStore?.clearCaches();
    }

    onMasterDataChanged(event) {
        super.onMasterDataChanged(event);

        // If master store has changes we also need to clear cached columns, in case a column was hidden
        // no need to clear cache while resizing, or if column changes name
        if (event.action !== 'update' || ('hidden' in event.changes || 'region' in event.changes)) {
            this.clearCaches();
        }
    }

    getAdjacentVisibleLeafColumn(columnOrId, next = true, wrap = false) {
        const
            columns = this.visibleColumns,
            column  = (columnOrId instanceof Column) ? columnOrId : this.getById(columnOrId);
        let idx = columns.indexOf(column) + (next ? 1 : -1);

        // If we walked off either end, wrap if directed to do so,
        // otherwise, return null;
        if (!columns[idx]) {
            if (wrap) {
                idx = next ? 0 : columns.length - 1;
            }
            else {
                return null;
            }
        }

        return columns[idx];
    }

    /**
     * Bottom columns are the ones displayed in the bottom row of a grouped header, or all columns if not using a grouped
     * header. They are the columns that actually display any data.
     * @member {Grid.column.Column[]}
     * @readonly
     */
    get bottomColumns() {
        return this.leaves;
    }

    /**
     * Get column by field. To be sure that you are getting exactly the intended column, use
     * {@link Core.data.Store#function-getById} with the columns id instead.
     * @param {String} field Field name
     * @returns {Grid.column.Column}
     */
    get(field) {
        return this.findRecord('field', field, true);
    }

    lookupStateColumns(config) {
        const
            { field, type, id } = config,
            column              = this.getById(id);

        if (!column && (field || type)) {
            return this.query(col => (
                (!field || col.field === field) &&
                (!type || col.type === type)) &&
                (!id || col.meta?.generatedId || col.id === id));
        }

        return [column];
    }

    lookupStateColumn(config) {
        return this.lookupStateColumns(config)[0];
    }

    /**
     * Used internally to create a new record in the store. Creates a column of the correct type by looking up the
     * specified type among registered columns.
     * @private
     */
    createRecord(data) {
        const
            { grid = {} }       = this, // Some ColumnStore tests lacks Grid
            { store, features } = grid,
            pinColumns          = features?.pinColumns,
            dataField           = store?.modelClass?.fieldMap?.[data.field],
            { pinned }          = data;

        let columnClass = this.modelClass;

        // Use the DataField's column definition as a default into which the incoming data is merged
        if (dataField?.column) {
            data = Objects.merge({}, dataField.column, data);
        }

        if (data.type) {
            columnClass = ColumnStore.getColumnClass(data.type);
            if (!columnClass) {
                throw new Error(`Column type '${data.type}' not registered. Please make sure you have imported the column class.`);
            }
        }

        // Apply TreeColumnMixin if tree: true and not already a tree column
        if (data.tree && !columnClass.isTreeColumn) {
            columnClass = this.getTreeMixedClass(columnClass);
        }

        // Map pin to region first; when pin is 'start' and a locked subgrid exists, map to 'locked'
        if (pinColumns?.enabled && (pinned === 'start' || pinned === 'end')) {
            data.region = (pinned === 'start' && grid.subGrids?.locked) ? 'locked' : pinned;
        }
        else if (data.locked) {
            data.region = 'locked';
        }
        delete data.locked;

        const column = new columnClass(data, this);

        // Doing this after construction, in case the columnClass has a default value for region (Schedulers
        // TimeAxisColumn has)
        if (!column.data.region) {
            column.data.region = grid.defaultRegion || 'normal';
        }

        // After construction, since `field` may be computed or already added by the column
        this.addMissingModelField(column);

        return column;
    }

    // Adds the column's field to the grid store's model when missing, see autoAddField. Paths and names found on the
    // model prototype (getter, setter or method, e.g. Gantt's PredecessorColumn) are excluded, since Model#get and
    // Model#inSet stop routing through those once a field exists. So is the tree children field, an instance property
    // holding the child records, which Model#exposeProperties leaves alone for the same reason
    addMissingModelField(column) {
        const
            { field }  = column,
            modelClass = this.grid?.store?.modelClass;

        if (this.autoAddField && field && !column.noFieldSpecified && modelClass && !modelClass.fieldMap[field] &&
            !pathDelimiterRe.test(field) && !(field in modelClass.prototype) && field !== modelClass.childrenField) {
            let fieldDefinition = field;

            // Some columns define the type to use for new fields (date, number etc)
            if (column.constructor.fieldType) {
                fieldDefinition = {
                    name : field,
                    type : column.constructor.fieldType
                };
            }

            modelClass.addField(fieldDefinition);
        }
    }

    // Called when a store instance is assigned as a grid's `columns`, since columns created before the store had a
    // grid could not reach the model to add their missing fields
    addMissingModelFields() {
        this.forEach(this.addMissingModelField, this);
    }

    /**
     * Returns a cached class that combines the given column class with TreeColumnMixin.
     * Uses class caching to avoid recreating mixed classes repeatedly.
     * @param {Function} BaseClass The column class to mix TreeColumnMixin into
     * @returns {Function} A class combining BaseClass with TreeColumnMixin
     * @private
     */
    getTreeMixedClass(BaseClass) {
        if (!ColumnStore._treeMixedClasses) {
            ColumnStore._treeMixedClasses = new Map();
        }

        if (!ColumnStore._treeMixedClasses.has(BaseClass.type)) {
            const MixedClass = BaseClass.mixin(TreeColumnMixin);

            // Register the mixed class's configurable fields with the Bryntum class system.
            // exposeProperties() processes TreeColumnMixin's configurable properties on the new MixedClass,
            // ensuring that getters/setters and configuration handling (changers, updaters, etc.) are set up
            // correctly for the mixed-in fields when this cached class is used.
            MixedClass.exposeProperties();

            ColumnStore._treeMixedClasses.set(BaseClass.type, MixedClass);
        }

        return ColumnStore._treeMixedClasses.get(BaseClass.type);
    }

    /**
     * indexOf extended to also accept a columns field, for backward compatibility.
     *
     * ```javascript
     * grid.columns.indexOf('name');
     * ```
     *
     * @param {Core.data.Model|String} recordOrId
     * @returns {Number}
     */
    indexOf(recordOrId) {
        if (recordOrId == null) {
            return -1;
        }
        // <remove-on-release>
        // TODO: build the need for field away
        // </remove-on-release>
        const index = super.indexOf(recordOrId);
        if (index > -1) return index;
        // no record found by id, find by field since old code relies on that instead of id
        // <remove-on-release>
        // TODO: replace such cases with columns id
        // </remove-on-release>
        return this.records.findIndex(r => r.field === recordOrId);
    }

    /**
     * Removes all columns.
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Boolean} `true` unless the action was prevented, in which case it returns `false`
     * @fires beforeRemove
     * @fires removeAll
     * @fires Core.data.Store#event-change
     * @category CRUD
     */
    removeAll(silent = false) {
        const
            me         = this,
            isTimeAxis = me.some(i => i.isTimeAxisColumn);

        if (isTimeAxis) {
            return me.remove(me.query(i => !i.isTimeAxisColumn), silent);
        }

        return super.removeAll(silent);
    }

    /**
     * Checks if any column uses autoHeight
     * @internal
     * @member {Boolean}
     * @readonly
     */
    get usesAutoHeight() {
        return this.some(column => column.autoHeight);
    }

    /**
     * Checks if any flex column uses autoHeight
     * @internal
     * @member {Boolean}
     * @readonly
     */
    get usesFlexAutoHeight() {
        return this.some(column => column.autoHeight && column.flex != null);
    }

    // Let syncDataOnLoad match on id, field or type (in that order)
    resolveSyncNode(rawData) {
        if (rawData.id) {
            return super.resolveSyncNode(rawData);
        }

        if (rawData.field) {
            return {
                id   : rawData.field,
                node : this.allRecords.find(r => r.field === rawData.field)
            };
        }

        if (rawData.type) {
            return {
                id   : rawData.type,
                node : this.allRecords.find(r => r.type === rawData.type)
            };
        }

        return { id : null, node : null };
    }

    //region Column types

    /**
     * Call from custom column to register it with ColumnStore. Required to be able to specify type in column config.
     *
     * ```javascript
     * // create and register custom column
     * class CustomColumn {
     *  static get type() {
     *      return 'custom';
     *  }
     * }
     * ColumnStore.registerColumnType(CustomColumn, true);
     * // now possible to specify in column config
     * let grid = new Grid({
     *   columns: [
     *     { type: 'custom', field: 'id' }
     *   ]
     * });
     * ```
     *
     * @param {Function} columnClass The {@link Grid.column.Column} subclass to register
     * @ts-param columnClass {typeof Column}
     * @param {Boolean} [simpleRenderer] Pass `true` if its default renderer does *not* use other fields from the passed record than its
     *   configured {@link Grid.column.Column#config-field}. This enables more granular cell updating upon record mutation.
     */
    static registerColumnType(columnClass, simpleRenderer = false) {
        columnClass.simpleRenderer = simpleRenderer;
        columnClass.register(columnClass.type, columnClass, true);
    }

    /**
     * Returns registered column class for specified type.
     * @param {String} type Type name
     * @returns {Grid.column.Column}
     * @internal
     */
    static getColumnClass(type) {
        return Column.resolveType(type);
    }

    /**
     * Generates a <strong>new </strong> {@link Grid.column.Column} instance which may be subsequently added to this
     * store to represent the passed {@link Core.data.field.DataField} of the owning Grid's store.
     * @param {Core.data.field.DataField|String} dataField The {@link Core.data.field.DataField field}
     * instance or field name to generate a new {@link Grid.column.Column} for.
     *
     * ```javascript
     * // Add column for the "team" field.
     * grid.columns.add(grid.columns.generateColumnForField('team', {
     *     width : 200
     * }));
     * ```
     *
     * @param {Object} [defaults] Defaults to apply to the new column.
     * @returns {Grid.column.Column} A new Column which will render and edit the field correctly.
     * @internal
     */
    generateColumnForField(dataField, defaults) {
        if (typeof dataField === 'string' && this.grid) {
            dataField = this.grid.store?.modelClass.fieldMap[dataField];
        }
        let column = dataField.column || columnDefinitions[dataField.type] || {};

        // Upgrade string to be the column tyope
        if (typeof column === 'string') {
            column = { type : column };
        }

        // Configure over defaults
        column = {
            text  : dataField.text || StringHelper.separate(dataField.name),
            field : dataField.name,
            ...defaults,
            ...column
        };

        // Special formatting for columns which represent number and integer fields.
        if (dataField.precision != null) {
            column.format.maximumFractionDigits = dataField.precision;
        }
        if (dataField.columnType) {
            column.type = dataField.columnType;
        }

        // Upgrade object to a Column instance.
        return this.createRecord(column);
    }

    //endregion
}

// Register type with its Factory
ColumnStore.initClass();

/**
 * Custom {@link Grid.data.ColumnStore} event which triggers when a column is resized, i.e. its width has been changed
 *
 * @param {Function} handler
 * @param {Object} [thisObj]
 */
export const columnResizeEvent = (handler, thisObj) => ({
    update : ({ store, record, changes }) => {
        let result = true;

        if ('width' in changes || 'minWidth' in changes  || 'maxWidth' in changes || 'flex' in changes) {
            result = handler.call(thisObj, { store, record, changes });
        }

        return result;
    }
});
// Can't have this in Column due to circular dependencies
ColumnStore.registerColumnType(Column, true);
