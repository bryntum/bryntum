import Base from '../../Base.js';
import ObjectHelper from '../../helper/ObjectHelper.js';

/**
 * @module Core/data/mixin/StoreSort
 */

/**
 * An immutable object representing a store sorter.
 *
 * @typedef {Object} Sorter
 * @property {String} [field] Field name
 * @property {Function} [fn] A custom sorting function that compares two records, to be used instead of the "field".
 * @property {Core.data.Model} fn.recordA The first record to compare
 * @property {Core.data.Model} fn.recordB The second record to compare
 * @property {Number} fn.returns Returns a negative number if the first record should come before the second,
 *   a positive number if it should come after, or `0` if they are equal
 * @property {Boolean} [ascending=true] `true` to sort ascending, `false` to sort descending
 */

/**
 * Mixin for Store that handles simple sorting as well as multi-level sorting.
 *
 * ```javascript
 * // single sorter
 * store.sort('age');
 *
 * // single sorter as object, descending order
 * store.sort({ field : 'age', ascending : false });
 *
 * // multiple sorters
 * store.sort(['age', 'name']);
 *
 * // using custom sorting function
 * store.sort({
 *     fn : (recordA, recordB) => {
 *         // apply custom logic, for example:
 *         return recordA.name.length < recordB.name.length ? -1 : 1;
 *     }
 * });
 *
 * // using locale specific sort (slow)
 * store.sort({ field : 'name', useLocaleSort : 'sv-SE' });
 * ```
 * <div class="note">
 * If the store is configured with {@link Core.data.Store#config-lazyLoad}, only remote sorting is supported. See
 * AjaxStore {@link Core/data/AjaxStore#remote-sorting} for more details about remote sorting.
 * </div>
 *
 * ## Useful configs and functions
 *
 * | Config / Function                            | Description                                       |
 * |----------------------------------------------|---------------------------------------------------|
 * | {@link #config-sorters}                      | Initial set of sorters to apply                    |
 * | {@link #function-sort}                       | Sort by field name, object, or array of sorters    |
 * | {@link #function-clearSorters}               | Remove all sorters                                 |
 *
 * ## See also
 *
 * - {@link Core.util.CollectionSorter} - The sorter class used by this mixin
 * - {@link Core.data.mixin.StoreFilter} - Store filtering mixin
 *
 * @mixin
 */
export default Target => class StoreSort extends (Target || Base) {
    static $name = 'StoreSort';

    //region Config

    static configurable = {
        /**
         * Use `localeCompare()` when sorting, which lets the browser sort in a locale specific order. Set to `true`,
         * a locale string or a locale config to enable.
         *
         * Enabling this has big negative impact on sorting
         * performance. For more info on `localeCompare()`, see [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare).
         *
         * Examples:
         *
         * ```javascript
         * const store = new Store({
         *     // Swedish sorting
         *     useLocaleSort : 'sv-SE'
         * });
         *
         * const store = new Store({
         *     // Swedish sorting with custom casing order
         *     useLocaleSort : {
         *         locale    : 'sv-SE',
         *         caseFirst : 'upper'
         *     }
         * });
         * ```
         *
         * Can also be configured on a per-sorter basis:
         *
         * ```javascript
         * store.sort({ field: 'name', useLocaleSort : 'sv-SE' });
         * ```
         *
         * @config {Boolean|String|Object}
         * @default false
         * @category Advanced
         */
        useLocaleSort : null,

        /**
         * Initial sorters, format is:
         * ```javascript
         * { sorters : [{ field: 'name', ascending: false }, ...] }
         * // or
         * { sorters : ['name', ...] }
         * ```
         * @config {Sorter[]|String[]}
         * @category Common
         */
        sorters : [],

        /**
         * Specify true to sort this store after records are added.
         * @config {Boolean}
         * @default
         * @category Sorting
         */
        reapplySortersOnAdd : false,

        /**
         * Specify `true` to reapply sorting when a record is updated in the store. You can also provide an array
         * of field names, to only trigger sort when certain data fields are updated.
         *
         * {@note}If the app processes many records or many record fields in a loop or similar, be sure to temporarily
         * disable this setting. Otherwise, each change will trigger a sort, which will make the processing slow{/@note}
         *
         * @prp {Boolean|Object} reapplySortersOnUpdate
         * @property {String[]} reapplySortersOnUpdate.fields Fields that reapply sorting when updated
         * @default
         * @category Filtering
         */
        reapplySortersOnUpdate : false,

        /**
         * Set this to `true` to activate remote sorting in this Store. This makes it possible to use the built-in
         * sorting features of the Store and corresponding UI functionality, without using local data.
         *
         * For a non-{@link Core.data.AjaxStore}, data will be requested by the Store by calling a by the app
         * implemented {@link Core.data.Store#config-requestData} function. Data can also be provided by listening to
         * the {@link Core.data.Store#event-requestData} event, and updating the {@link Core.data.Store#config-data}
         * property with new data.
         *
         * For {@link Core.data.AjaxStore}, data will be loaded via the configured
         * {@link Core.data.AjaxStore#config-readUrl}.
         *
         * @config {Boolean}
         * @category Sorting
         */
        remoteSort : false,

        /**
         * The name of the parameter to use to pass any sorters when loading data remotely.
         *
         * **Note:** When this is set, sorters must be defined using a field name and an ascending flag,
         * **not** a sort function.
         * @config {String}
         * @category Sorting
         */
        sortParamName : null
    };

    //endregion

    //region Events

    /**
     * Fired before sorting
     * @event beforeSort
     * @param {Core.data.Store} source This Store
     * @param {Sorter[]} sorters Sorter configs
     * @param {Core.data.Model[]} records Records to sort
     */

    /**
     * Fired after sorting
     * @event sort
     * @param {Core.data.Store} source This Store
     * @param {Sorter[]} sorters Sorter configs
     * @param {Core.data.Model[]} records Sorted records
     */

    //endregion

    //region Properties

    /**
     * Currently applied sorters
     * @member {Sorter[]} sorters
     * @readonly
     * @category Sort, group & filter
     */

    /**
     * Is store sorted?
     * @member {Boolean}
     * @readonly
     * @category Sort, group & filter
     */
    get isSorted() {
        return Boolean(this.sorters.length) || this.isGrouped;
    }

    // Keeping for now in case it is useful elsewhere in the future
    // /**
    //  * Determines if the store is sorted as specified by its sorters. Only applicable for local sorting.
    //  * Note that this is an expensive operation that iterates all records.
    //  * @member {Boolean}
    //  * @internal
    //  */
    // get isInOrder() {
    //     if (!this.isSorted || this.remoteSort) {
    //         return false;
    //     }
    //
    //     const { sorterFn } = this;
    //
    //     let inOrder = true;
    //
    //     this.traverse(record => {
    //         const { previousSibling } = record;
    //         if (previousSibling) {
    //             if (sorterFn(previousSibling, record) > 0) {
    //                 inOrder = false;
    //                 return false;
    //             }
    //         }
    //     });
    //
    //     return inOrder;
    // }

    changeSorters(sorters) {
        return sorters.map(sorter => this.normalizeSorterConfig(sorter, true));
    }

    updateSortParamName(param) {
        if (!('remoteSort' in this.initialConfig)) {
            this.remoteSort = param != null;
        }
    }

    //endregion

    //region Add & remove sorters

    /**
     * Sort records, either by replacing current sorters or by adding to them.
     * A sorter can specify a **_custom sorting function_** which will be called with arguments (recordA, recordB).
     * Works in the same way as a standard array sorter, except that returning `null` triggers the stores
     * normal sorting routine.
     *
     * ```javascript
     * // single sorter
     * store.sort('age');
     *
     * // single sorter as object, descending order
     * store.sort({ field : 'age', ascending : false });
     *
     * // multiple sorters
     * store.sort(['age', 'name']);
     *
     * // using custom sorting function
     * store.sort((recordA, recordB) => {
     *     // apply custom logic, for example:
     *     return recordA.name.length < recordB.name.length ? -1 : 1;
     * });
     *
     * // using locale specific sort (slow)
     * store.sort({ field : 'name', useLocaleSort : 'sv-SE' });
     * ```
     *
     * @param {String|Sorter[]|Sorter|Function} field Field to sort by.
     * Can also be an array of {@link Core.util.CollectionSorter sorter} config objects, or a sorting function, or a
     * {@link Core.util.CollectionSorter sorter} config.
     * @param {Boolean} [ascending] Sort order.
     * Applicable when the `field` is a string (if not specified and already sorted by the field, reverts direction),
     * or an object and `ascending` property is not specified for the object. `true` by default.
     * Not applicable when `field` is a function. `ascending` is always `true` in this case.
     * @param {Boolean} [add] If `true`, adds a sorter to the sorters collection.
     * Not applicable when `field` is an array. In this case always replaces active sorters.
     * @param {Boolean} [silent] Set as true to not fire events. UI will not be informed about the changes.
     * @category Sort, group & filter
     * @fires beforeSort
     * @fires sort
     * @fires Core.data.Store#event-refresh
     * @returns {Promise|null} If {@link Core/data/Store#config-remoteSort} is enabled on the store, this method returns
     * a `Promise` which is resolved after data is loaded from remote server, otherwise it returns `null`
     */
    sort(field, ascending, add = false, silent = false) {
        const
            me             = this,
            records        = me.allRecords,
            currentSorters = me.sorters ? me.sorters.slice() : [];

        let currentDir = null,
            curSort;

        if (field) {
            if (Array.isArray(field)) {
                // array of strings make fields always be sorted ascending
                me.sorters = field.map(sorter => me.normalizeSorterConfig(sorter, typeof sorter === 'string' ? true : ascending));
            }
            else {
                const sorter = me.normalizeSorterConfig(field, ascending);

                if (add) {
                    curSort = me.getCurrentSorterByField(sorter.field);

                    // Field already among sorters? change sort direction instead of adding new sorter
                    if (curSort) {
                        currentDir        = curSort.ascending;
                        curSort.ascending = sorter.ascending;
                    }
                    else {
                        me.sorters.push(sorter);
                    }
                }
                else {
                    me.sorters = [sorter];
                }
            }
        }

        if (!silent && me.trigger('beforeSort', { sorters : me.sorters, records, currentSorters }) === false) {
            // Restore sorters
            me.sorters = currentSorters;

            // Restore sorting direction if toggled
            if (currentDir !== null) {
                curSort.ascending = currentDir;
            }

            return null;
        }

        return me.remoteSort ? me.performRemoteSort(silent) : me.performSort(silent);
    }

    normalizeSorterConfig(field, ascending) {
        const
            me     = this,
            sorter = { ascending };

        if (typeof field === 'object') {
            ObjectHelper.assign(sorter, field);

            if (field.fn) {
                delete sorter.fn;
                sorter.sortFn = field.fn;
            }

            sorter.ascending = field.ascending ?? ascending;
        }
        else if (typeof field === 'function') {
            sorter.sortFn = field;
        }
        else {
            sorter.field = field;
        }

        // sort in opposite direction if not specified and already sorted, default to sorting ascending
        if (sorter.ascending == null) {
            const curSort = me.getCurrentSorterByField(sorter.field);
            sorter.ascending = curSort ? !curSort.ascending : true;
        }

        if (sorter.sortFn == null) {
            const compareItems = me.modelClass?.$meta.fields.map[sorter.field]?.compareItems;

            if (compareItems) {
                // These sorters will be ignored by AjaxStore when remoting...
                sorter.sortFn = compareItems;
            }
        }

        return sorter;
    }

    getCurrentSorterByField(field) {
        return typeof field === 'string' && this.sorters.find(s => s.field === field) || null;
    }

    /**
     * Add a sorting level (a sorter).
     * @param {String|Sorter[]|Sorter|Function} field Field to sort by. Can also be an array of sorters, or a sorting
     * function, or a {@link Core.util.CollectionSorter sorter} config.
     * @param {Boolean} [ascending] Sort order (used only if field specified as string)
     * @returns {Promise|null} If {@link Core/data/Store#config-remoteSort} is enabled on the store, this method returns
     * a `Promise` which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @category Sort, group & filter
     */
    addSorter(field, ascending = true) {
        return this.sort(field, ascending, true);
    }

    /**
     * Remove a sorting level (a sorter)
     * @param {String|Function} field Stop sorting by this field (or sorter function)
     * @returns {Promise|null} If {@link Core/data/Store#config-remoteSort} is enabled on the store, this method returns
     * a `Promise` which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @category Sort, group & filter
     */
    removeSorter(field) {
        const
            sorterIndex = this.sorters.findIndex(sorter => sorter.field === field || sorter.sortFn === field);

        if (sorterIndex > -1) {
            this.sorters.splice(sorterIndex, 1);
            return this.sort();
        }
    }

    /**
     * Removes all sorters, turning store sorting off.
     * @returns {Promise|null} If {@link Core/data/Store#config-remoteSort} is enabled on the store, this method returns
     * a `Promise` which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @category Sort, group & filter
     */
    clearSorters(silent = false) {
        if (this.sorters.length) {
            this.sorters.length = 0;
            return this.sort(undefined, undefined, undefined, silent);
        }
    }

    suspendSortOnUpdate() {
        if (!('_reapplySortersSuspended' in this)) {
            this._reapplySortersSuspended = 0;
        }

        this._reapplySortersSuspended++;
    }

    resumeSortOnUpdate(sort = true) {
        const me = this;

        if (me._reapplySortersSuspended) {
            me._reapplySortersSuspended--;

            if (!me._reapplySortersSuspended && me._shouldReapplySorters) {
                sort && me.sort();
                me._shouldReapplySorters = false;
            }
        }
    }

    //endregion

    //region Sorting logic

    /**
     * Creates a function used with Array#sort when sorting the store. Override to use your own custom sorting logic.
     * @param {Sorter[]} sorters An array of sorter config objects
     * @returns {Function}
     * @category Sort, group & filter
     */
    createSorterFn(sorters) {
        const storeLocaleSort = this.useLocaleSort;

        return (lhs, rhs) => {
            for (let i = 0; i < sorters.length; i++) {
                const
                    sorter = sorters[i],
                    { field, ascending = true, useLocaleSort = storeLocaleSort, caseSensitive = true } = sorter,
                    fn = sorter.fn || sorter.sortFn,
                    direction = ascending ? 1 : -1,
                    directionString = ascending ? 'ASC' : 'DESC';

                if (fn) {
                    const val = fn.call(sorter, lhs, rhs, directionString);
                    if (val === 0) {
                        // equal values, let next sorter define order
                        continue;
                    }

                    if (val !== null) {
                        return val * direction;
                    }
                }

                let
                    lhsValue = lhs.isModel ? lhs.getValue(field) : lhs[field],
                    rhsValue = rhs.isModel ? rhs.getValue(field) : rhs[field];

                if (!caseSensitive) {
                    if (typeof lhsValue === 'string') {
                        lhsValue = lhsValue.toLowerCase();
                    }

                    if (typeof rhsValue === 'string') {
                        rhsValue = rhsValue.toLowerCase();
                    }
                }

                if (lhsValue === rhsValue) {
                    continue;
                }

                if (lhsValue == null) {
                    return -direction;
                }

                if (rhsValue == null) {
                    return direction;
                }

                if (useLocaleSort && typeof lhsValue === 'string') {
                    // Use systems locale
                    if (useLocaleSort === true) {
                        return String(lhsValue).localeCompare(rhsValue) * direction;
                    }

                    // Use specified locale
                    if (typeof useLocaleSort === 'string') {
                        return String(lhsValue).localeCompare(rhsValue, useLocaleSort) * direction;
                    }

                    // Use locale config
                    if (typeof useLocaleSort === 'object') {
                        return String(lhsValue).localeCompare(rhsValue, useLocaleSort.locale, useLocaleSort) * direction;
                    }
                }

                if (lhsValue > rhsValue) {
                    return direction;
                }
                if (lhsValue < rhsValue) {
                    return -direction;
                }
            }

            return 0;
        };
    }

    /**
     * The sorter function for sorting records in the store.
     * @member {Function}
     * @internal
     * @readonly
     */
    get sorterFn() {
        // When remoteSort is enabled then always sort by data order received from remote server
        // _remoteSortIndex is set inside store.setStoreData() method
        return this.createSorterFn(this.remoteSort ?  [{ field : '_remoteSortIndex' }] : this.sorters);
    }

    /**
     * Perform sorting according to the {@link #config-sorters} configured.
     * This is the internal implementation which is overridden in {@link Core.data.AjaxStore} and
     * must not be overridden.
     * @private
     * @category Sort, group & filter
     */
    performSort(silent) {
        const
            me = this,
            { rootNode, storage, sorterFn: sorter } = me;

        if (me.tree) {
            (!me.isChained || me.isChainedTree) && rootNode.traverse(node => {
                if (node.isLoaded && node.isParent) {
                    node.children.sort(sorter);
                    // Since child nodes change order their parentIndex needs to be updated.
                    // Update is silent, records won't be considered modified because of the sort
                    node.updateChildrenIndices(node.children, 'parentIndex', true);
                }
            });
            storage.replaceValues({
                values : me.collectDescendants(rootNode).visible,
                silent : true
            });
        }
        else if (me.isGrouped) {
            storage.replaceValues({
                ...me.prepareGroupRecords(),
                silent : true
            });
        }
        else {
            storage.replaceValues({
                values : storage.values.sort(sorter),
                silent : true
            });
        }

        me.afterPerformSort(silent || me.isRemoteDataLoading);
    }

    /**
     * Internal sort method, only called if {@link Core/data/Store#config-remoteSort} is set on store.
     * Should not be used in application code directly.
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Promise|null} If {@link Core/data/Store#config-remoteSort} is enabled on the store, this method returns
     * a `Promise` which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @internal
     */
    async performRemoteSort(silent) {
        if (await this.beforePerformSort?.() !== false && await this.performDataRequest(silent) !== false) {
            this.afterPerformSort(silent);
        }
    }

    buildRemoteParams(params = {}, encode = false) {
        let
            {
                sorters,
                groupers,
                groupParamName,
                sortParamName = 'sorters' // For AjaxStore
            } = this;

        super.buildRemoteParams?.(params, encode);

        if (groupers && !groupParamName) {
            sorters = groupers.concat(sorters);
        }

        if (this.remoteSort && sortParamName && sorters.length) {
            params[sortParamName] = encode ? this.encodeSorterParams(sorters) : this.getSorterParams(sorters);
        }

        return params;
    }

    getSorterParams(sorters) {
        return sorters.filter(sorter => !sorter.sortFn).map(({ field, ascending }) => ({ field, ascending }));
    }

    afterPerformSort(silent) {
        if (silent) {
            return;
        }

        const me = this;

        me._idMap = null;

        const event = {
            action  : 'sort',
            sorters : me.sorters,
            records : me.allRecords
        };

        me.trigger('sort', event);
        me.trigger('refresh', event);
    }

    //endregion
};
