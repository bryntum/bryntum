import Base from '../../Base.js';
import ArrayHelper from '../../helper/ArrayHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import StringHelper from '../../helper/StringHelper.js';
import Collection from '../../util/Collection.js';
import Model from '../Model.js';

/**
 * @module Core/data/mixin/StoreGroup
 */

const
    resortActions      = {
        add     : 1,
        replace : 1
    },
    NO_VALUE = '!!novalue!!',
    defaultGroupSortFn = ({ _groupValue: lhs }, { _groupValue: rhs }) => lhs < rhs ? -1 : lhs > rhs ? 1 : 0,
    arrayAt            = (array, index) => array[index < 0 ? array.length + index : index];

/**
 * An immutable object representing a store grouper.
 *
 * @typedef {Object} Grouper
 * @property {String} field Field name
 * @property {Function} [fn] A custom sorting function that compares two records, to be used instead of the "field".
 * @property {Core.data.Model} fn.recordA The first record to compare
 * @property {Core.data.Model} fn.recordB The second record to compare
 * @property {Number} fn.returns Returns a negative number if the first record should come before the second,
 *   a positive number if it should come after, or `0` if they are equal
 * @property {Boolean} [ascending=true] `true` to group ascending, `false` to group descending
 */

/**
 * Mixin for Store that handles grouping.
 *
 * ```javascript
 * // simple grouper
 * store.group('city');
 *
 * // grouper as object, descending order
 * store.group({ field : 'city', ascending : false });
 *
 * // using custom sorting function
 * store.group({
 *     field : 'city',
 *     fn : (recordA, recordB) => {
 *         // apply custom logic, for example:
 *         return recordA.city.length < recordB.city.length ? -1 : 1;
 *     }
 * });
 * ```
 *
 * <div class="note">
 * Grouping with {@link Core.data.Store#config-lazyLoad} requires that the server provide group metadata in the load
 * response. Configure {@link #config-groupParamName} so groupers are sent as a dedicated request parameter, and have
 * the server respond with a `groups` array describing every group parent (the client derives the total group count from
 * its length).
 * </div>
 *
 * ## Useful configs and functions
 *
 * | Config / Function               | Description                              |
 * |---------------------------------|------------------------------------------|
 * | {@link #config-groupers}        | Initial set of groupers to apply         |
 * | {@link #function-group}         | Group by field name or grouper config    |
 * | {@link #function-clearGroupers} | Remove all groupers and flatten records  |
 * | {@link #property-isGrouped}     | `true` if the store is currently grouped |
 *
 * ## See also
 *
 * - {@link Core.data.mixin.StoreSort} - Store sorting mixin
 * - {@link Core.data.mixin.StoreFilter} - Store filtering mixin
 *
 * @mixin
 */
export default Target => class StoreGroup extends (Target || Base) {
    static $name = 'StoreGroup';

    //region Config

    static configurable = {
        /**
         * Currently used groupers.
         * To set groupers when remote sorting is enabled by {@link Core/data/Store#config-remoteSort} you should
         * use {@link #function-setGroupers} instead to be able to wait for the operation to finish.
         * @member {Grouper[]} groupers
         * @category Sort, group & filter
         */
        /**
         * Initial groupers, specify to have store grouped automatically after initially setting data.
         *
         * For {@link Core.data.Store#config-lazyLoad lazy-loaded} stores, also set {@link #config-groupParamName} so
         * the server knows it is expected to ship grouped data plus a `groups` metadata array in the load response.
         * @config {Grouper[]}
         * @category Common
         */
        groupers : null,

        useGroupFooters : false,

        /**
         * To have all groups __initially loaded__ start collapsed, configure this as `true`.
         *
         * Note that this only affects the initial load of the store. Subsequent reloads maintain
         * current group state where possible.
         *
         * To decide per group, configure a function. It is called for each group header the store creates, both on
         * the initial load and for group values that appear later, and should return `true` for groups that should
         * start collapsed. Since it runs when the store is grouped, the group is never rendered expanded:
         *
         * ```javascript
         * const store = new Store({
         *     groupers             : [{ field : 'city' }],
         *     startGroupsCollapsed : ({ groupValue }) => groupValue === 'Paris'
         * });
         * ```
         *
         * @config {Boolean|Function}
         * @param {Object} context
         * @param {*} context.groupValue The value of the group, `null` for the group of records without a value
         * @param {Core.data.Store} context.store This store
         * @returns {Boolean} `true` to have the group start collapsed
         * @default false
         * @category Advanced
         */
        startGroupsCollapsed : null,

        /**
         * The name of the parameter to use to pass any {@link #config-groupers} when loading data remotely with
         * {@link Core/data/Store#config-lazyLoad}
         *
         * When set, groupers are sent to the server as their own request parameter (by default encoded as JSON),
         * instead of being piggy-backed onto the {@link Core/data/mixin/StoreSort#config-sortParamName} request
         * parameter.
         *
         * Setting this config also opts in to server-supplied group metadata in the load response. The response must
         * include a `groups` array describing every group parent in the dataset (field, value, count and optional
         * summaries). See the Grid lazy loading guide for details.
         *
         * **Note:** When this is set, groupers must be defined using a field name and an ascending flag, **not** a sort
         * function.
         * @config {String}
         * @category Grouping
         */
        groupParamName : null
    };

    static get properties() {
        return {
            collapsedGroups : new Set()
        };
    }

    //endregion

    //region Init

    construct(config) {
        super.construct(config);

        // For handling record mutation, *not* add/remove of records.
        // Sorts dataset if necessary.
        this.ion({
            change  : 'onDataChanged',
            refresh : 'onBatchRefresh',
            thisObj : this
        });
    }

    doDestroy() {
        // The GroupRow class is generated per store instance, its ancestors would otherwise hold on to it forever
        Model.unregisterSubModel(this._GroupRowClass);

        super.doDestroy();
    }

    updateModelClass(modelClass, oldModelClass) {
        // The GroupRow class extends the outgoing modelClass, so it has to be regenerated from the incoming one
        Model.unregisterSubModel(this._GroupRowClass);
        this._GroupRowClass = null;

        super.updateModelClass?.(modelClass, oldModelClass);
    }

    get GroupRow() {
        return this._GroupRowClass || (this._GroupRowClass = class extends this.modelClass {
            static isSpecialRow = true;

            // The calculated group value for this group header/footer.
            static fields = [{
                name : '_groupValue'
            }];

            get isCollapsed() {
                return this.meta.collapsed;
            }
        });
    }

    updateGroupers(groupers) {
        this.setGroupers(groupers);
    }

    /**
     * Set groupers.
     * @param {Grouper[]} groupers Array of groupers to apply to store
     * @returns {Promise|null} If {@link Core/data/Store#config-remoteSort} is enabled on the store, this method returns
     * a `Promise` which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @category Sort, group & filter
     */
    setGroupers(groupers, options = null) {
        const
            me          = this,
            { storage } = me;

        let result;

        // Need to clear the id map so it gets rebuilt next time its accessed
        me._idMap = null;

        if (groupers?.length) {
            me._groupers = groupers.map(g => me.createGrouper(g));
        }
        else if (me.groupers) {
            delete me._groupers;

            me.includeCollapsed();

            storage.replaceValues({
                values         : me.removeHeadersAndFooters(storage._values),
                filteredValues : storage.isFiltered ? me.removeHeadersAndFooters(storage._filteredValues) : null,
                silent         : true
            });

            me.groupRecords = null;
            me._unfilteredGroupRecords = null;
            result = me.group(null, null, null, Boolean(me.remoteSort || me.groupParamName), options?.silent);
        }

        return result;
    }

    createGrouper(grouper, ascending) {
        if (!grouper || grouper.isGrouper) {
            return grouper;
        }
        if (typeof grouper === 'string') {
            grouper = {
                field                                                      : grouper,
                [typeof ascending === 'boolean' ? 'ascending' : undefined] : ascending
            };
        }

        const
            { field }      = grouper,
            dotPos         = field?.indexOf('.'),
            complexMapping = dotPos > 0,
            path           = field?.split('.'),
            rootFieldName  = complexMapping ? path[0] : field,
            leafFieldName  = complexMapping ? arrayAt(path, -1) : field,
            fieldPath      = complexMapping ? field.slice(dotPos + 1) : field;

        return {
            isGrouper : true,
            ...grouper,
            complexMapping,
            rootFieldName,
            leafFieldName,
            fieldPath
        };
    }

    get unfilteredGroupRecords() {
        const me = this;

        if (me.isGrouped) {
            const { generation } = me.storage;

            if (me._unfilteredGroupRecords?.generation !== generation) {
                me._unfilteredGroupRecords = me.storage.allValues.filter(r => r.isSpecialRow);
                me._unfilteredGroupRecords.generation = generation;
            }
        }

        return me._unfilteredGroupRecords || [];
    }

    /**
     * Returns group header record for the passed record or last group header in the store
     * @param {Core.data.Model} [targetRecord]
     * @param {Boolean} [ignoreFilter] Pass true to search in the complete collection
     * @returns {Core.data.Model}
     * @internal
     */
    getGroupHeaderForRecord(targetRecord, ignoreFilter = false) {
        if (this.isGrouped) {
            return targetRecord ? ('groupRowFor' in targetRecord.meta ? targetRecord : targetRecord.instanceMeta(this).groupParent) : this.groupRecords.last;
        }
    }

    // Temporarily include records from collapsed groups, for example prior to filtering
    includeCollapsed() {
        for (const groupId of this.collapsedGroups) {
            this.expand(this.getById(groupId), false);
        }
    }

    // Exclude records in collapsed groups, intended to be used after a call to includeCollapsed()
    excludeCollapsed() {
        for (const groupId of this.collapsedGroups) {
            this.collapse(this.getById(groupId));
        }
    }

    onDataChange(...args) {
        const
            me                          = this,
            { groupers }                = me,
            { source: storage, action } = args[0];

        // Remote grouping owns the storage layout
        if (me.lazyLoad?.$remoteGroupingActive) {
            return super.onDataChange?.(...args);
        }

        // Only do grouping transformations if we have groupers to apply.
        // In stores which never use grouping, this code is superfluous and will reduce performance.
        // The else side will simply replace the ungrouped data with itself.
        if (groupers) {
            // When records are added or removed, re-evaluate the group records
            // so that when the events are fired by the super call, the group
            // records are in place.
            if (groupers.length) {
                if (action === 'splice' || action === 'move') {
                    storage.replaceValues({
                        ...me.prepareGroupRecords(),
                        silent : true
                    });
                }
            }
            // Remove all group headers and footers
            else {
                storage.replaceValues({
                    values         : me.removeHeadersAndFooters(storage._values),
                    filteredValues : storage.isFiltered ? me.removeHeadersAndFooters(storage._filteredValues) : null,
                    silent         : true
                });
            }
        }

        super.onDataChange?.(...args);
    }

    move(records, beforeRecord) {
        const me = this;

        let needRegroup;

        if (me.isGrouped && !me.tree) {
            let prevRecord = beforeRecord;

            if (beforeRecord?.isSpecialRow) {
                prevRecord = me.getPrev(beforeRecord, false, false);

                if (!prevRecord) {
                    // Trying to move above first group header, no-op
                    return;
                }
            }

            // Target group header always exists
            const
                targetGroupHeader         = me.getGroupHeaderForRecord(prevRecord),
                groupField                = me.groupers[0].field,
                { reapplyFilterOnUpdate } = me,
                isArrayField              = me.modelClass.getFieldDefinition(groupField)?.type === 'array';

            let newGroupValue = targetGroupHeader.meta.groupRowFor;

            // Disable reapply filter on update because it will rebuild groups faster than we need. Groups will be
            // updated in super.move call anyway
            me.reapplyFilterOnUpdate = false;

            // Suppress onBatchRefresh re-sort during this internal batch — super.move() handles regrouping; an extra sort here would shuffle storage indices.
            me._suppressBatchRegroup = true;
            me.beginBatch();

            records.forEach(record => {
                if (isArrayField) {
                    const currentValue = record.get(groupField) || [];
                    if (currentValue.includes(newGroupValue)) {
                        return;
                    }
                    else {
                        const
                            fromGroup  = record.instanceMeta(this).groupParent,
                            groupValue = targetGroupHeader._groupValue;

                        ArrayHelper.remove(currentValue, fromGroup);
                        newGroupValue = currentValue.slice();
                        if (groupValue === NO_VALUE) {
                            newGroupValue = undefined;
                        }
                        else if (Array.isArray(groupValue) && groupValue.length === 0) {
                            newGroupValue = [];
                        }
                        else {
                            newGroupValue.push(groupValue);
                        }
                        needRegroup = true;
                    }
                }
                record.setValue(groupField, newGroupValue);
            });

            me.endBatch();
            me._suppressBatchRegroup = false;

            if (isArrayField && !needRegroup) {
                return;
            }
            me.reapplyFilterOnUpdate = reapplyFilterOnUpdate;

            // If store is filtered, we might have hidden groups between target group header and `beforeRecord`. To
            // make move safe we need to find new target group (visible) and find next group in the unfiltered
            // collection. But only if `beforeRecord is a group header
            if (me.isFiltered && beforeRecord?.isSpecialRow) {
                const
                    { unfilteredGroupRecords } = me,
                    // Find index of the group header we're moving record into
                    index                      = unfilteredGroupRecords.indexOf(targetGroupHeader);

                // If `beforeRecord` exists, index cannot point to the last group in the store, meaning we can
                // safely access element at index + 1
                beforeRecord = unfilteredGroupRecords[index + 1];
            }
        }

        super.move(records, beforeRecord);

        if (needRegroup) {
            me.group(me.groupers[0]);
        }
    }

    // private function that collapses on the data level
    collapse(groupRecords) {
        let result = false;
        if (groupRecords) {
            groupRecords = ArrayHelper.asArray(groupRecords);

            groupRecords.forEach(groupRecord => {
                if (groupRecord && !groupRecord.meta.collapsed) {
                    this.excludeGroupRecords(groupRecord);
                    groupRecord.meta.collapsed = true;
                    // Track which groups are collapsed
                    this.collapsedGroups.add(groupRecord.id);

                    this.trigger('toggleGroup', { groupRecord, collapse : true });
                    result = true;
                }
            });
        }
        return result;
    }

    // private function that expands on the data level
    expand(groupRecords, updateMap = true) {
        let result = false;
        if (groupRecords) {
            groupRecords = ArrayHelper.asArray(groupRecords);

            groupRecords.forEach(groupRecord => {
                if (groupRecord?.meta.collapsed) {
                    this.includeGroupRecords(groupRecord);
                    groupRecord.meta.collapsed = false;
                    // Optionally track which groups are collapsed (not done when expanding temporarily prior to filtering etc)
                    updateMap && this.collapsedGroups.delete(groupRecord.id);

                    updateMap && this.trigger('toggleGroup', { groupRecord, collapse : false });

                    result = true;
                }
            });
        }
        return result;
    }

    removeHeadersAndFooters(records) {
        return records.filter(r => {
            // Clear down a group header's children so it is reusable
            if (r?.unfilteredGroupChildren) {
                r.groupChildren.length = r.unfilteredGroupChildren.length = r.meta.childCount = 0;
            }

            // Remove the group headers/footers and any linked records which may have been
            // interpolated due to a record being a member of two groups.
            // Unregister them. If they are reused, they will be registered.
            if (r?.isSpecialRow || (r?.isLinked && r.instanceMeta(this).groupParent)) {
                this.unregister(r);
                return false;
            }
            return true;
        });
    }

    // Compose the id used for a GroupRow of the given kind and value
    groupRowId(prefix, value) {
        return `${prefix}-${typeof value === 'number' ? value : StringHelper.createId(value)}`;
    }

    // Create a new header GroupRow
    buildGroupHeader({ value, collapsed = false, emptyArray = false } = {}) {
        return this.buildGroupRow('group-header', value, { collapsed, groupRowFor : value, emptyArray });
    }

    // Create a header for a group value that has no header yet, deciding whether it starts collapsed
    buildNewGroupHeader({ value, collapseAll, emptyArray }) {
        const
            me                       = this,
            { startGroupsCollapsed } = me,
            collapsed                = typeof startGroupsCollapsed === 'function'
                // Blank groups use an internal placeholder value, not exposed
                ? Boolean(startGroupsCollapsed({ groupValue : value === NO_VALUE ? null : value, store : me }))
                : collapseAll,
            groupRec                 = me.buildGroupHeader({ value, collapsed, emptyArray });

        // Tracked the same way as groups collapsed later. Also drops the id of a discarded header for the same value
        // (its group emptied and came back), which would otherwise collapse this one when filtering
        me.collapsedGroups[collapsed ? 'add' : 'delete'](groupRec.id);

        return groupRec;
    }

    // Create a new footer GroupRow linked to the given header
    buildGroupFooter({ value, headerRec } = {}) {
        return this.buildGroupRow('group-footer', value, { groupFooterFor : value, groupRecord : headerRec });
    }

    // Shared factory behind buildGroupHeader / buildGroupFooter.
    buildGroupRow(prefix, value, extraMeta) {
        const
            me            = this,
            { groupers }  = me,
            { idField }   = me.modelClass,
            groupingById  = groupers?.[0]?.field === idField,
            leafFieldName = groupers?.[0]?.leafFieldName;

        return new me.GroupRow({
            [idField]                           : me.groupRowId(prefix, value),
            [groupingById ? '' : leafFieldName] : value,
            _groupValue                         : value
        }, me, {
            specialRow : true,
            groupField : leafFieldName,
            ...extraMeta
        });
    }

    // Populate group records from a server-provided `groups` metadata array.
    ingestServerGroupRecords(groups) {
        const me = this;

        if (!groups?.length) {
            me.groupRecords = null;
            return;
        }

        const
            prevGroupRecords    = me.groupRecords,
            newCollection       = me.groupRecords = new Collection(),
            { _values }         = me.storage,
            { useGroupFooters } = me,
            collapseAll         = Boolean(me.startGroupsCollapsed && !prevGroupRecords?.count);

        let cursor = 0;

        for (const { field, value, count = 0, summaries } of groups) {
            const
                headerId  = me.groupRowId('group-header', value),
                headerRec = prevGroupRecords?.get(headerId) ?? me.buildNewGroupHeader({ value, collapseAll }),
                { meta }  = headerRec,
                arrayLen  = count + (useGroupFooters ? 1 : 0);

            meta.childCount = count;
            meta.hasFooter  = useGroupFooters;
            meta.summaries  = summaries ?? null;
            if (field) {
                meta.groupField = field;
            }
            headerRec.stores = [me];
            headerRec.unfilteredGroupChildren = headerRec.unfilteredGroupChildren ?? Array.from({ length : arrayLen }, () => undefined);
            headerRec.groupChildren = headerRec.groupChildren ?? headerRec.unfilteredGroupChildren;

            newCollection.add(headerRec);
            me.register(headerRec);

            if (_values[cursor] !== headerRec) {
                _values[cursor] = headerRec;
            }

            if (useGroupFooters) {
                const
                    footerId  = me.groupRowId('group-footer', value),
                    footerRec = me.getById(footerId) ?? me.buildGroupFooter({ value, headerRec });

                footerRec.stores = [me];
                footerRec.groupChildren = headerRec.groupChildren;
                me.register(footerRec);

                // Insert footer at the end of unfilteredGroupChildren so collapse/expand treats it as the last child in
                // the group.
                headerRec.unfilteredGroupChildren[arrayLen - 1] = footerRec;

                if (!headerRec.meta.collapsed) {
                    _values[cursor + 1 + headerRec.meta.childCount] = footerRec;
                }
            }

            cursor += 1 + (headerRec.meta.collapsed ? 0 : arrayLen);
        }
    }

    prepareGroupRecords() {
        const
            me                = this,
            {
                isFiltered,
                reapplyFilterOnUpdate,
                groupRecords
            }                 = me,
            grouper           = me.groupers[0],
            multiplier        = grouper.ascending !== false ? 1 : -1,
            {
                field,
                fn: groupSortFn = defaultGroupSortFn,
                leafFieldName
            }                 = grouper,
            byFn              = typeof field === 'function',
            newGroupRecords   = new Collection(),
            // this property is set by StoreChanges mixin to keep in view records which were visible prior to
            // `applyChangeset` call but after update no longer match the filter
            visibleRecordsIds = me._groupVisibleRecordIds || [],
            isVisible         = (record) => {
                const matchesFilter = !isFiltered || me.filtersFunction(record);

                return reapplyFilterOnUpdate ? matchesFilter : (matchesFilter || visibleRecordsIds.includes(record.id));
            },
            collapseAll       = Boolean(me.startGroupsCollapsed && !groupRecords?.count);

        // Expand collapsed groups back into the storage to that groups can be rebuilt.
        groupRecords?.forEach(groupRec => {
            if (groupRec.isCollapsed) {
                me.includeGroupRecords(groupRec);
            }
        });

        const records = me.removeHeadersAndFooters(me.storage._values);

        // Ensure main Store sorters are applied before we extract the groups and groupChildren
        if (me.sorters.length) {
            records.sort(me.sorterFn);
        }

        // Update filters function
        if (isFiltered) {
            me.filtersFunction = null;
        }

        // Collect new group records into which we will go on to add groupChildren
        records.forEach(rec => {
            const
                original    = rec,
                v           = byFn ? field(rec) : rec.getValue(field),
                groupValues = ArrayHelper.asArray(v == undefined ? NO_VALUE : v),
                multiValue  = Array.isArray(groupValues),
                emptyArray  = multiValue && !groupValues.length,
                length      = emptyArray ? 1 : groupValues.length;

            for (let i = 0; i < length; i++) {
                const
                    groupValue = emptyArray ? [] : groupValues[i],
                    id         = me.groupRowId('group-header', groupValue);

                // If we already processed this group in this pass, reuse it as-is.
                let groupRec = newGroupRecords.get(id);

                // Otherwise, reuse from the previous group set (keeps collapsed state / meta) or
                // create a new one; then seed it into the new set and clear it for fresh counting.
                if (!groupRec) {
                    groupRec = groupRecords?.get(id) ?? me.buildNewGroupHeader({
                        value : groupValue,
                        collapseAll,
                        emptyArray
                    });

                    // Put it in the new group set
                    newGroupRecords.add(groupRec);

                    // It needs clearing
                    groupRec.meta.childCount = 0;
                    groupRec.groupChildren = [];
                    groupRec.unfilteredGroupChildren = [];

                    // Update groupField in case the group record is being reused from a previous
                    // grouping by a different column (e.g., both columns had null/empty values)
                    // https://github.com/bryntum/bryntum/issues/11762
                    groupRec.meta.groupField = leafFieldName;

                    // Used by indexOf to determine if part of store
                    groupRec.stores = [me];
                }

                me.register(groupRec);
                //<debug>
                if (groupValue.toString() === '[object Object]') {
                    throw new Error(groupValue.constructor.name + ' missing toString() implementation');
                }
                //</debug>

                // When in multiple groups, child records are links
                if (i > 0) {
                    const links = original.groupLinks || (original.groupLinks = {});
                    rec = links[groupValue] || (links[groupValue] = original.link());
                    rec.stores = [me];
                    me.register(rec);
                }

                rec.instanceMeta(me).groupParent = groupRec;

                // Add the record to its group parent if it's filtered in
                if (isVisible(rec)) {
                    groupRec.groupChildren.push(rec);
                    groupRec.meta.childCount++;
                }

                groupRec.unfilteredGroupChildren.push(rec);
            }
        });

        // Sort the groups by the calculated group value
        newGroupRecords._values.sort((lhs, rhs) => groupSortFn(lhs, rhs) * multiplier);

        // Now that all the groups have all their groupChildren, we can calculate the footers
        if (me.useGroupFooters) {
            for (let index = 0, length = newGroupRecords.count; index < length; index++) {
                const
                    groupRec = newGroupRecords.values[index],
                    val      = groupRec.meta.groupRowFor,
                    footerId = me.groupRowId('group-footer', val),
                    footer   = me.getById(footerId) ?? me.buildGroupFooter({ value : val, headerRec : groupRec });

                // Used by indexOf to determine if part of store
                footer.stores = [me];

                me.register(footer);
                footer.groupChildren = groupRec.groupChildren;

                // Inject the group footer record after the group header record
                newGroupRecords.splice(++index, 0, footer);
                length++;

                // Add the footer to the  children of the group header
                groupRec.groupChildren.push(footer);
                groupRec.unfilteredGroupChildren.push(footer);
                groupRec.meta.childCount++;
            }
        }

        me._idMap = null;

        // Unroll all the groups into the result array
        const result = {
            values : newGroupRecords.reduce((result, groupRec) => {
                if (!groupRec.isGroupFooter) {
                    result.push(groupRec);
                    if (!groupRec.meta.collapsed) {
                        result.push(...groupRec.unfilteredGroupChildren);
                    }
                }
                return result;
            }, false, [])
        };

        if (isFiltered) {
            result.filteredValues = result.values.filter(isVisible);
        }

        // Ensure obsolete group records are destroyed.
        me.groupRecords?.forEach(oldGroupRec => {
            if (!newGroupRecords.includes(oldGroupRec)) {
                oldGroupRec.destroy();
            }
        });

        // Our new group set
        me.groupRecords = newGroupRecords;

        return result;
    }

    //endregion

    //region Group and ungroup

    /**
     * Is store currently grouped?
     * @member {Boolean}
     * @readonly
     * @category Sort, group & filter
     */
    get isGrouped() {
        return Boolean(this.groupers?.length);
    }

    /**
     * Group records, either by replacing current sorters or by adding to them.
     * A grouper can specify a **_custom sorting function_** which will be called with arguments (recordA, recordB).
     * Works in the same way as a standard array sorter, except that returning `null` triggers the stores
     * normal sorting routine. Grouped store **must** always be sorted by the same field.
     *
     * To clear groupers and stop grouping, use {@link #function-clearGroupers} method.
     *
     * ```javascript
     * // simple grouper
     * store.group('city');
     *
     * // grouper as object, descending order
     * store.group({ field : 'city', ascending : false });
     *
     * // using custom sorting function
     * store.group({
     *     field : 'city',
     *     fn : (recordA, recordB) => {
     *         // apply custom logic, for example:
     *         return recordA.city.length < recordB.city.length ? -1 : 1;
     *     }
     * });
     *
     * // Stop grouping
     * store.clearGroupers();
     * ```
     *
     * @param {String|Grouper} field Field to group by.
     * Can also be a {@link Core.data.mixin.StoreGroup#typedef-Grouper Grouper} config containing a field to group by
     * and a custom sorting function called `fn`.
     * @param {Boolean} [ascending] Sort order of the group titles
     * @param {Boolean} [add] Add a grouper (true) or use only this grouper (false)
     * @param {Boolean} [performSort] Trigger sort directly, which does the actual grouping
     * @param {Boolean} [silent] Set as true to not fire events
     * @category Sort, group & filter
     * @fires group
     * @fires Core.data.Store#event-refresh
     * @returns {Promise|null} If {@link Core/data/Store#config-remoteSort} is enabled on the store, this method returns
     * a `Promise` which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     */
    group(field, ascending, add = false, performSort = true, silent = false) {
        const
            me      = this,
            { sorters = [] } = me,
            grouper = me.createGrouper(field, ascending);

        let newGrouper, sortersModified = false;

        if (add) {
            me.groupers.push(grouper);
        }
        else if (field) {
            if (ascending == null && !('ascending' in grouper)) {
                grouper.ascending = grouper.fn && me.groupInfo?.field === grouper.field && me.groupInfo?.fn === grouper.fn ? !me.groupInfo.ascending : true;
            }

            me.groupInfo = newGrouper = grouper;
            me.groupers = [me.groupInfo];

            // https://github.com/bryntum/bryntum/issues/9518
            // If there is a matching sorter, remove it.
            if (sorters.some(sorter => sorter.field === field)) {
                me.sorters = sorters.filter(sorter => sorter.field !== field);
                sortersModified = true;
            }
        }
        // null values are only passed when being called from clearGroupers
        else if (field === null && ascending === null) {
            // force restoring sort order if sorters exist after removing grouper
            performSort = true;
            sortersModified = true;
        }
        else if (!sortersModified && sorters.length && performSort) {
            sortersModified = true;
        }

        if (newGrouper) {
            const { prototype } = me.modelClass;

            // Create a getter for complex field names like "get resource.city"
            if (newGrouper.complexMapping && !Object.prototype.hasOwnProperty.call(prototype, field)) {
                Object.defineProperty(prototype, field, {
                    get() {
                        return ObjectHelper.getPath(this, field);
                    }
                });
            }
        }

        // as far as the store is concerned, grouping is just more sorting. so trigger sort
        if (performSort !== false) {
            if (me.remoteSort && !me.isRemoteDataLoading) {
                return me.sort(null, null, false, !sortersModified).then(() => me.onAfterGrouping(silent, !sortersModified));
            }

            me.sort(null, null, false, silent || !sortersModified);
        }

        me.onAfterGrouping(silent, !sortersModified);
    }

    onAfterGrouping(silent, doRefresh = true) {
        if (silent) {
            return;
        }
        const
            me       = this,
            groupers = me.groupers || [];
        /**
         * Fired when grouping changes
         * @event group
         * @param {Core.data.Store} source This Store
         * @param {Grouper[]} groupers Applied groupers
         * @param {Core.data.Model[]} records Grouped records
         */
        me.trigger('group', { isGrouped : me.isGrouped, groupers, records : me.storage.values });
        if (doRefresh) {
            me.trigger('refresh', { action : 'group', isGrouped : me.isGrouped, groupers, records : me.storage.values });
        }
    }

    // Internal since UI does not support multi grouping yet
    /**
     * Add a grouping level (a grouper).
     * @param {String} field Field to group by
     * @param {Boolean} ascending Group direction
     * @category Sort, group & filter
     * @returns {Promise|null} If {@link Core/data/Store#config-remoteSort} is enabled on the store, this method returns
     * a `Promise` which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @internal
     */
    addGrouper(field, ascending = true) {
        return this.group(field, ascending, true);
    }

    // Internal since UI does not support multi grouping yet
    /**
     * Removes a grouping level (a grouper)
     * @param {String} field Grouper to remove
     * @category Sort, group & filter
     * @returns {Promise|null} If {@link Core/data/Store#config-remoteSort} is enabled on the store, this method returns
     * a `Promise` which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @internal
     */
    removeGrouper(field) {
        const
            me           = this,
            { groupers } = me;

        if (!groupers) {
            return;
        }

        const index = groupers.findIndex(grouper => grouper.field === field);

        if (index > -1) {
            groupers.splice(index, 1);

            if (!groupers.length) {
                return me.clearGroupers();
            }
            else {
                return me.group();
            }
        }
    }

    /**
     * Removes all groupers, turning store grouping off.
     * @privateparam {Boolean} [silent=false] Pass true to suppress events.
     * @returns {Promise|null} If {@link Core/data/Store#config-remoteSort} is enabled on the store, this method returns
     * a `Promise` which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @category Sort, group & filter
     */
    clearGroupers(silent = false) {
        return this.setGroupers(null, { silent });
    }

    //endregion

    //region Get and check

    /**
     * Check if a record belongs to a certain group (only for the first grouping level)
     * @param {Core.data.Model} record The Record
     * @param {*} groupValue The group value
     * @returns {Boolean} True if the record belongs to the group, otherwise false
     * @category Sort, group & filter
     */
    isRecordInGroup(record, groupValue) {
        if (!this.isGrouped) {
            return false;
        }

        const groupField = this.groupers[0]?.field;

        return record.getValue(groupField) === groupValue && !record.isSpecialRow;
    }

    isInCollapsedGroup(record) {
        const { groupParent } = record.instanceMeta(this);

        return groupParent?.meta.collapsed;
    }

    /**
     * Returns all locally available records in the group with specified groupValue.
     * @param {*} groupValue
     * @returns {Core.data.Model[]} Records in specified group or null if store not grouped
     * @category Sort, group & filter
     */
    getGroupRecords(groupValue) {
        if (!this.isGrouped) {
            return null;
        }

        return this.storage.values.filter(record => record && this.isRecordInGroup(record, groupValue));
    }

    /**
     * Get all group titles.
     * @returns {String[]} Group titles
     * @category Sort, group & filter
     * @non-lazy-load
     */
    getGroupTitles() {
        if (!this.isGrouped) {
            return null;
        }

        return this.getDistinctValues(this.groupers[0].field);
    }

    /**
     * Returns all the group header records
     * @member {Core.data.Model[]} groupHeaderRecords The records representing the group header rows
     * @readonly
     */
    get groupHeaderRecords() {
        if (this.useGroupFooters) {
            return this.groupRecords.values.filter(r => r.isGroupHeader);
        }
        return this.groupRecords.values;
    }

    //endregion

    onDataChanged({ changes, action }) {
        if (
            this.isGrouped && (
                // If an action flagged as requiring resort is performed...
                (!changes && resortActions[action]) ||
                // ...or if the group field has changes...
                (changes && this.groupers.some(grouper => grouper.rootFieldName in changes))
            )
        ) {
            // ...then re-sort
            this.sort();
        }
    }

    onBatchRefresh({ action }) {
        // Change events are suppressed during a batch, so re-sort silently when it ends to land records in the correct groups before re-render.
        // Skipped during move()'s internal batch — super.move() already regroups, an extra sort here would invalidate indices.
        if (action === 'batch' && this.isGrouped && !this._suppressBatchRegroup) {
            this.sort(undefined, undefined, false, true);
        }
    }

    /**
     * Adds or removes records in a group from storage. Used when expanding/collapsing groups.
     * @param {Core.data.Model} groupRecord Group which records should be added or removed
     * @param {Boolean} include Include (true) or exclude (false) records
     * @private
     * @category Grouping
     */
    internalIncludeExcludeGroupRecords(groupRecord, include) {
        const
            me                     = this,
            index                  = me.indexOf(groupRecord),
            allIndex               = me.allIndexOf(groupRecord),
            { id: mapId, storage } = me,
            {
                _filteredValues,
                _values
            }                      = storage,
            {
                meta,
                groupChildren,
                unfilteredGroupChildren
            }                      = groupRecord;

        // Skip if group record is not found, otherwise it removes records from wrong position.
        // Also prevent removing from already collapsed and vice versa
        if (allIndex === -1 || (meta.collapsed && !include) || (!meta.collapsed && include)) {
            return;
        }

        unfilteredGroupChildren.forEach(child =>
            child && (child.instanceMeta(mapId).hiddenByCollapse = !include)
        );

        if (include) {
            // Avoid adding record duplicates which may already have been reinserted by clearing filters
            if (_filteredValues) {
                _filteredValues.splice(index + 1, 0, ...groupChildren.filter(r => !me.isAvailable(r.id)));
            }

            storage._values.splice(allIndex + 1, 0, ...unfilteredGroupChildren.filter(r => !r || !me.isAvailable(r.id)));
        }
        else {
            if (_filteredValues) {
                _filteredValues.splice(index + 1, groupChildren.length);
            }

            _values.splice(allIndex + 1, unfilteredGroupChildren.length);
        }

        storage._indicesInvalid = true;
        me._idMap = null;
    }

    /**
     * Removes records in a group from storage. Used when collapsing a group.
     * @param {Core.data.Model} groupRecord Group which records should be removed
     * @category Grouping
     * @private
     */
    excludeGroupRecords(groupRecord) {
        this.internalIncludeExcludeGroupRecords(groupRecord, false);
    }

    /**
     * Adds records in a group to storage. Used when expanding a group.
     * @param {Core.data.Model} groupRecord Group which records should be added
     * @category Grouping
     * @private
     */
    includeGroupRecords(groupRecord) {
        this.internalIncludeExcludeGroupRecords(groupRecord, true);
    }

    /**
     * Collects all group headers + children, whether expanded or not
     * @private
     * @param {Boolean} allRecords True to include filtered out records
     * @param {Boolean} includeHeaders True to also include group headers
     * @returns {Core.data.Model[]}
     */
    collectGroupRecords(allRecords, includeHeaders = true) {
        const records = allRecords ? this.storage.allValues : this.storage.values;

        return records.reduce((records, record) => {
            if (record.isSpecialRow) {
                if (includeHeaders && !record.isGroupFooter) {
                    records.push(record);
                }

                if (record.isGroupHeader) {
                    records.push.apply(records, allRecords ? record.unfilteredGroupChildren : record.groupChildren);
                }
            }

            return records;
        }, []);
    }

    //region Remote grouping

    buildRemoteParams(params = {}, encode = false) {
        super.buildRemoteParams?.(params, encode);

        const { groupParamName, groupers } = this;

        if (groupParamName && groupers?.length) {
            params[groupParamName] = encode ? this.encodeGrouperParams(groupers) : this.getGrouperParams(groupers);
        }

        return params;
    }

    getGrouperParams(groupers) {
        return groupers.filter(grouper => !grouper.fn && !grouper.sortFn).map(({ field, ascending }) => ({ field, ascending }));
    }

    encodeGrouperParams(groupers) {
        return JSON.stringify(this.getGrouperParams(groupers));
    }

    //endregion
};
