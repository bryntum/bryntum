import Base from '../../Base.js';
import Filter from '../../util/CollectionFilter.js';
import FunctionHelper from '../../helper/FunctionHelper.js';
import Collection from '../../util/Collection.js';
import ArrayHelper from '../../helper/ArrayHelper.js';

/**
 * @module Core/data/mixin/StoreFilter
 */

/**
 * Special configuration object form accepted by {@link Core.data.Store#function-filter} when replacing or silently
 * applying filters. Pass it instead of (or alongside) a regular filter to control whether existing filters should be
 * removed and whether the operation should fire events.
 * @typedef {Object} StoreFilterConfig
 * @property {CollectionFilterConfig|CollectionFilterConfig[]|Function} [filters] The actual filter(s) to apply.
 *   May be a single filter config, an array of filter configs, or a predicate function `(record) => any`.
 * @property {Boolean} [replace] Set as `true` to remove all existing filters before applying the new one(s).
 * @property {Boolean} [silent] Set as `true` to not fire events. UI will not be informed about the changes.
 * @ts-param filters {CollectionFilterConfig|Array<CollectionFilterConfig>|Function}
 */

/**
 * Mixin for Store that handles filtering.
 * Filters are instances of {@link Core/util/CollectionFilter} class.
 *
 * - Adding a filter for the same property will replace the current one (unless a unique {@link Core.util.CollectionFilter#config-id} is specified),
 * but will not clear any other filters.
 * - Adding a filter through the {@link #function-filterBy} function is ultimate.
 * It will clear all the property based filters and replace the current filterBy function if present.
 * - Removing records from the store does not remove filters!
 * The filters will be reapplied if {@link #config-reapplyFilterOnAdd}/{@link #config-reapplyFilterOnUpdate} are true and you add new records or update current.
 *
 * ```javascript
 * // Add a filter
 * store.filter({
 *     property : 'score',
 *     value    : 10,
 *     operator : '>'
 * });
 *
 * // Add filter as a function
 * store.filter(record => record.score > 10);
 *
 * // Add named filter as a function
 * store.filter({
 *     id : 'my filter',
 *     filterBy : record => record.score > 10
 * });
 *
 * // Replace any filter set with new filters
 * store.filter({
 *     filters : {
 *         property : 'score',
 *         value    : 10,
 *         operator : '>'
 *     },
 *     replace : true
 * });
 *
 * // Remove this one specific filter, leaving any possible others in place.
 * // A filter's id defaults to the `property-operator` value that it's filtering on.
 * store.removeFilter('score');
 *
 * // Reapply filters without firing an event.
 * // Use if making multiple data mutations with the
 * // intention of updating UIs when all finished.
 * store.filter({
 *     silent : true
 * });
 * ```
 *
 * {@note}
 * If the store is configured with {@link Core.data.Store#config-lazyLoad}, only remote filtering is supported. See
 * AjaxStore {@link Core/data/AjaxStore#remote-filtering} for more details about remote filtering.
 * {/@note}
 *
 * ## Useful configs and functions
 *
 * | Config / Function                            | Description                                       |
 * |----------------------------------------------|---------------------------------------------------|
 * | {@link #config-filters}                      | Initial set of filters to apply                    |
 * | {@link #config-reapplyFilterOnAdd}           | Re-filter when records are added                   |
 * | {@link #function-filter}                     | Add or replace a filter                            |
 * | {@link #function-removeFilter}               | Remove a specific filter by id                     |
 * | {@link #function-clearFilters}               | Remove all filters                                 |
 * | {@link #function-filterBy}                   | Filter using a custom function                     |
 *
 * ## See also
 *
 * - {@link Core.util.CollectionFilter} - The filter class used by this mixin
 * - {@link Core.data.mixin.StoreSort} - Store sorting mixin
 *
 * @mixin
 */
export default Target => class StoreFilter extends (Target || Base) {
    static $name = 'StoreFilter';

    //region Config

    static configurable = {
        /**
         * Set this to `true` to activate remote filtering in this Store. This makes it possible to use the built-in
         * filtering features of the Store and corresponding UI functionality, without using local data.
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
         * @category Filtering
         */
        remoteFilter : false,

        /**
         * The name of the parameter to use to pass any filters when loading data remotely.
         *
         * **Note:** When this is set, filters must be defined using a field name, an operator and a value
         * to compare, **not** a comparison function.
         * @config {String}
         * @category Remote
         */
        filterParamName : null,

        /**
         * Specify one or more {@link Core/util/CollectionFilter} config objects to apply initially.
         *
         * For example:
         *
         * ```javascript
         *  // Configure the store to filter in clients over the age of 30
         *  new Store({
         *      ...,
         *      filters : [{
         *          property : 'age',
         *          value    : 30,
         *          operator : '>'
         *      }],
         *      ...
         *  })
         * ```
         *
         * or:
         *
         * ```javascript
         *  // Configure the store to filter based on a complex operation
         *  new Store({
         *      ...,
         *      filters : [{
         *          filterBy(record) {
         *              // Return true or false for filtering in or out
         *              return shouldClientBeVisible(record);
         *          }
         *      }],
         *      ...
         *  })
         * ```
         *
         * @config {CollectionFilterConfig|CollectionFilterConfig[]}
         * @category Filtering
         */
        filters : undefined, // undefined to trigger changer initially

        /**
         * Specify `true` to reapply filters when a record is added to or moved within the store.
         * This includes tree node operations like indent/outdent in Gantt, or any move operation
         * that changes a node's parent.
         * @config {Boolean}
         * @default
         * @category Filtering
         */
        reapplyFilterOnAdd : false,

        /**
         * Specify `true` to reapply filters when a record is updated in the store. You can also provide an array
         * of field names, to only re-filter when certain data fields are updated.
         * @config {Boolean|Object} reapplyFilterOnUpdate
         * @property {String[]} reapplyFilterOnUpdate.fields
         * @default
         * @category Filtering
         */
        reapplyFilterOnUpdate : false,

        /**
         * When `true`, if a parent node matches the active filters, all its descendants are automatically included
         * regardless of whether they individually match.
         *
         * Useful for tree stores when filtering by group/category name and wanting to see all items within matching
         * groups.
         *
         * Only applies to tree stores. Does not affect chained tree stores created via
         * {@link Core.data.Store#function-chainTree}.
         *
         * There is also a complementary {@link #config-filterExcludesChildren} config which governs non-matching
         * parents (exclude all descendants).
         *
         * @prp {Boolean}
         * @default
         * @category Filtering
         */
        filterIncludesChildren : false,

        /**
         * When `true`, if a parent node does NOT match the active filters, all its descendants are automatically
         * excluded regardless of whether they individually match the filter.
         *
         * Useful for tree stores when removing a branch and expecting all sub-items to disappear with it.
         *
         * Only applies to tree stores. Does not affect chained tree stores created via
         * {@link Core.data.Store#function-chainTree}.
         *
         * There is also a complementary {@link #config-filterIncludesChildren} config which governs matching parents
         * (include all descendants).
         *
         * @prp {Boolean}
         * @default
         * @category Filtering
         */
        filterExcludesChildren : false,

        /**
         * By default, when a descendant node matches the active filters, all of its ancestors are kept visible so the
         * matched record is reachable in the tree. Set this to `true` to opt out of that behavior — a non-matching
         * ancestor is dropped from the visible record list, while any matching descendants below it are "lifted" up
         * so they remain visible on their own. In other words: **if a leaf matches, it is shown; its non-matching
         * ancestors are not**.
         *
         * When enabled, matching descendants are lifted into the flat record list even if their ancestors do not
         * match the filter. This means the visible record list contains leaf nodes whose parent records are NOT in
         * the visible set. Features that assume a contiguous parent chain in the record list may encounter
         * non-visible ancestors when walking the parent chain from visible records; in particular, cross-branch
         * row reordering (e.g. {@link Grid.feature.RowReorder}) is not defined when this config is active.
         *
         * Lifted leaves retain their original {@link Core.data.mixin.TreeNode#property-childLevel} — indentation
         * in a {@link Grid.column.TreeColumn} reflects each record's original depth in the tree, not its depth
         * relative to the visible record list.
         *
         * Combine with {@link #config-filterExcludesChildren} to hide both the non-matching parent and its
         * descendants — in that combination a non-matching parent drops its whole subtree, including any
         * descendants that would otherwise be lifted.
         *
         * When {@link #config-filterIncludesChildren} is also active, a matching ancestor's cascade-included
         * descendants remain visible even with `filterExcludesParents` — the include-all cascade still applies
         * below any matching ancestor.
         *
         * Only applies to tree stores. Does not affect chained tree stores created via
         * {@link Core.data.Store#function-chainTree}.
         *
         * @prp {Boolean}
         * @default
         * @category Filtering
         */
        filterExcludesParents : false
    };

    static properties = {
        filterBatching          : 0,
        needsFiltering          : false,
        needsFilterAfterRestore : false
    };

    //endregion

    //region Events

    /**
     * Fired before filtering
     * @event beforeFilter
     * @param {Core.data.Store} source This Store
     * @param {Core.util.Collection} filters Filters to be applied to this Store
     */

    /**
     * Fired after applying filters to the store
     * @event filter
     * @param {Core.data.Store} source This Store
     * @param {Core.util.Collection} filters Filters used by this Store
     * @param {Core.data.Model[]} removed The records which were filtered out by the action.
     * @param {Core.data.Model[]} added The records which were filtered back in by the action.
     * @param {Core.data.Model[]} records Filtered records
     */

    //endregion

    //region Properties

    updateFilterParamName(param) {
        if (!('remoteFilter' in this.initialConfig)) {
            this.remoteFilter = param != null;
        }
    }

    updateReapplyFilterOnAdd(enable) {
        this.storage.autoFilter = enable;
    }

    get reapplyFilterOnAdd() {
        return this.storage.autoFilter;
    }

    // Each of the three cascade configs (filterIncludesChildren, filterExcludesChildren,
    // filterExcludesParents) changes which records are visible under the currently applied filter,
    // so toggling any of them at runtime must reapply the filter. Skipped during initial
    // configuration because filter() runs as part of the normal config sequence.
    reapplyIfFiltered() {
        if (!this.isConfiguring && this.isFiltered) {
            this.filter();
        }
    }

    updateFilterIncludesChildren() {
        this.reapplyIfFiltered();
    }

    updateFilterExcludesChildren() {
        this.reapplyIfFiltered();
    }

    updateFilterExcludesParents() {
        this.reapplyIfFiltered();
    }

    /**
     * Currently applied filters. A collection of {@link Core.util.CollectionFilter} instances.
     * @member {Core.util.Collection} filters
     * @readonly
     * @category Sort, group & filter
     */
    changeFilters(filters, collection) {
        const me = this;

        if (collection) {
            collection.clear();
        }
        else {
            collection = new Collection({ extraKeys : ['property'] });
        }

        // Invalidate the filtersFunction so that it has to be recalculated upon next access
        me._filtersFunction = null;

        // If we are being asked to filter, parse the filters.
        if (filters) {
            if (filters.constructor.name === 'Object') {
                for (const f of Object.entries(filters)) {
                    // Entry keys are either a field name with its value being the filter value
                    // or, there may be one filterBy property which specifies a filtering function.
                    if (f[0] === 'filterBy' && typeof f[1] === 'function') {
                        collection.add(new Filter({
                            filterBy : f[1]
                        }));
                    }
                    else {
                        collection.add(new Filter(f[1].constructor.name === 'Object' ? {
                            property : f[0],
                            ...f[1]
                        } : {
                            property : f[0],
                            value    : f[1]
                        }));
                    }
                }
            }
            else if (Array.isArray(filters)) {
                // Make sure we are adding CollectionFilters
                collection.add(...filters.map(filterConfig => {
                    if (filterConfig instanceof Filter) {
                        return filterConfig;
                    }
                    return new Filter(filterConfig);
                }));
            }
            else if (filters.isCollection) {
                // Use supplied collection? Opting to use items from it currently
                collection.add(...filters.values);
            }
            else {
                //<debug>
                if (typeof filters !== 'function') {
                    throw new Error('Store filters must be an object whose properties are Filter configs keyed by field name, or an array of Filter configs, or a filtering function');
                }
                //</debug>
                collection.add(new Filter({
                    filterBy : filters
                }));
            }

            collection.forEach(item => item.owner = me);
        }

        return collection;
    }

    set filtersFunction(filtersFunction) {
        this._filtersFunction = filtersFunction;
    }

    get filtersFunction() {
        const
            me                     = this,
            { filters, isGrouped } = me;

        if (!me._filtersFunction) {
            if (filters.count) {
                const generatedFilterFunction = Filter.generateFiltersFunction(filters);

                me._filtersFunction = candidate => {
                    // A group record is filtered in if it has passing groupChildren.
                    if (isGrouped && candidate.isSpecialRow) {
                        return candidate.groupChildren.some(generatedFilterFunction);
                    }

                    // We always filter *in* records which are being created by the UI.
                    if (candidate.isCreating) {
                        return true;
                    }

                    return generatedFilterFunction(candidate);
                };
            }
            else {
                me._filtersFunction = FunctionHelper.returnTrue;
            }
        }

        return me._filtersFunction;
    }

    /**
     * Check if store is filtered
     * @member {Boolean}
     * @readonly
     * @category Sort, group & filter
     */
    get isFiltered() {
        if (!this._filters && (!this.isConfiguring || !this.initialConfig.filters)) {
            return false;
        }

        return this.filters.values.some(filter => !filter.disabled);
    }

    isFilteredOut(record) {
        return this.isFiltered && !this.filtersFunction(record);
    }

    //endregion

    traverseFilter(record, deep = true, forceInclusionSet = undefined) {
        const
            me                  = this,
            { filtersFunction } = me,
            hitsCurrent         = !record.isRoot && filtersFunction(record),
            children            = record.unfilteredOrChildren;

        // leaf or lazy-loaded node (children === true means not yet loaded), bail out
        if (!children || children === true || !children.length) {
            return hitsCurrent;
        }

        if (!record.unfilteredChildren) {
            record.unfilteredChildren = record.children.slice();
        }

        let sortedByTraverseIncludeAll = false;

        // Parent matches and filterIncludesChildren — include ALL descendants
        if (hitsCurrent && me.filterIncludesChildren && !forceInclusionSet) {
            me.traverseIncludeAll(record);
            sortedByTraverseIncludeAll = true;
        }
        // Parent does not match and filterExcludesChildren — exclude ALL descendants.
        // Guard against root node: root never "matches", so we must not cascade exclusion from it.
        else if (!hitsCurrent && me.filterExcludesChildren && !record.isRoot && !forceInclusionSet) {
            record.children = [];
            // Ensure descendants have their unfilteredChildren snapshotted for later restoration
            me.traverseSnapshotDescendants(record.unfilteredChildren);
        }
        // Default behavior
        else {
            record.children = record.unfilteredChildren.filter(
                r => deep
                    ? me.traverseFilter(r, deep, forceInclusionSet)
                    : filtersFunction(r) || forceInclusionSet?.has(r)
            );
        }

        // Common post-processing (skip sorting if traverseIncludeAll already handled it)
        if (me.isSorted && !sortedByTraverseIncludeAll) {
            record.children.sort(me.sorterFn);
        }

        // unfilteredIndex must be set for child elements
        record.updateChildrenIndices(record.unfilteredChildren, 'unfilteredIndex', true);

        // parentIndex must be set for visible child elements
        record.updateChildrenIndices(record.children, 'parentIndex', true);

        // With filterExcludesParents, a non-matching parent itself is dropped even if it has matching descendants.
        // The matching descendants are "lifted" up the tree by collectVisibleRecordsExcludingParents so they
        // remain visible in the flat list of store records. Root is exempt so the tree itself isn't collapsed away.
        if (me.filterExcludesParents && !record.isRoot && !forceInclusionSet) {
            return hitsCurrent;
        }

        return hitsCurrent || Boolean(record.children.length);
    }

    /**
     * Builds the flat visible-record list when `filterExcludesParents` is `true`. Walks the
     * `unfilteredChildren` (or `children`) of the given record recursively and returns every
     * descendant that matches the current filter, regardless of whether its ancestors match.
     *
     * This preserves the contract: "a leaf matches → it shows; its non-matching ancestors do not".
     *
     * When `filterIncludesChildren` is also active and an ancestor has already been matched, all of
     * that ancestor's descendants are treated as included by cascade — the `includedByAncestor` flag
     * propagates that state down the recursion so the cascaded descendants are kept visible even if
     * they don't individually match.
     *
     * @param {Core.data.Model} record The node whose visible descendants to collect.
     * @param {Boolean} [includedByAncestor] `true` when a matching ancestor with
     * `filterIncludesChildren` has already included this branch by cascade.
     * @returns {Core.data.Model[]} Flat list of visible records at and below `record`, in traversal order.
     * @private
     */
    collectVisibleRecordsExcludingParents(record, includedByAncestor = false) {
        const
            me                  = this,
            { filtersFunction } = me,
            result              = [];

        // Use unfilteredChildren when available so matches that were dropped from `children`
        // (because their non-matching parent was excluded) are still discovered.
        const children = record.unfilteredOrChildren;

        if (!children || children === true) {
            return result;
        }
        for (const child of children) {
            // No need to guard against `child.isRoot` — the root is never a child of another node.
            const matches = filtersFunction(child);
            // A record is visible if it itself matches OR an ancestor matched under
            // filterIncludesChildren (cascade include).
            if (matches || includedByAncestor) {
                result.push(child);
            }
            const grandchildren = child.unfilteredOrChildren;
            // Recurse unless cascade-exclude applies (a non-matching child with filterExcludesChildren
            // drops its whole subtree — nothing below could be visible, so skip the recursion).
            if (
                grandchildren && grandchildren !== true && grandchildren.length &&
                (matches || !me.filterExcludesChildren)
            ) {
                // If this child matches with filterIncludesChildren, cascade-include all its descendants.
                const childCascadeInclude = includedByAncestor || (matches && me.filterIncludesChildren);
                // Use chunkedPush — with a large tree the spread operator can exceed the max call stack
                ArrayHelper.chunkedPush(result, me.collectVisibleRecordsExcludingParents(
                    child,
                    childCascadeInclude
                ));
            }
        }
        return result;
    }

    traverseIncludeAll(record) {
        if (record.unfilteredChildren) {
            record.children = record.unfilteredChildren.slice();
        }
        // Skip lazy-loaded nodes (children === true means not yet loaded)
        if (record.children && record.children !== true) {
            if (this.isSorted) {
                record.children.sort(this.sorterFn);
            }
            record.updateChildrenIndices(record.children, 'parentIndex', true);
            record.children.forEach(r => this.traverseIncludeAll(r));
        }
    }

    traverseSnapshotDescendants(children) {
        if (!children || children === true) {
            return;
        }
        for (const child of children) {
            const childChildren = child.children;
            // Skip lazy-loaded nodes (children === true means not yet loaded)
            if (childChildren && childChildren !== true && childChildren.length && !child.unfilteredChildren) {
                child.unfilteredChildren = childChildren.slice();
            }
            this.traverseSnapshotDescendants(child.unfilteredOrChildren);
        }
    }

    traverseClearFilter(record) {
        const me = this;

        if (record.unfilteredChildren) {
            // the code might seem a bit weird here, but yes - we want to copy from `orderedChildren`
            // and clear `unfilteredChildren`
            record.children = record.orderedChildren.slice();
            record.unfilteredChildren = null;
        }

        if (record.children && record.children !== true) {
            if (me.isSorted) {
                record.children.sort(me.sorterFn);
            }
            record.children.forEach(r => me.traverseClearFilter(r));
            record.updateChildrenIndices(record.children, 'parentIndex', true);
        }
    }

    // <remove-on-release>
    // TODO: Get rid of this.
    //  The Filter feature of a Grid pokes around in the Store to ask this question.
    // </remove-on-release>
    get latestFilterField() {
        return this.filters.last ? this.filters.last.property : null;
    }

    /**
     * Adds a single filter to the {@link #config-filters} collection. By default, filters are reevaluated
     * and a Store change event fired.
     *
     * If the `silent` parameter is passed as `true`, multiple filters can be added without causing data changes.
     *
     * When the filters are as required, call {@link #function-filter} with no parameters
     * to apply the filters to the store.
     *
     * @param {CollectionFilterConfig|Core.util.CollectionFilter|Function} filter A
     * {@link Core.util.CollectionFilter filter} config, a filter instance, or a function to use for filtering.
     * @param {Boolean} [silent] Pass `true` to *not* refilter the store immediately. Such as when
     * adding multiple filters.
     * @returns {Core.util.CollectionFilter|Promise} The added filter. If
     * {@link Core/data/Store#config-remoteFilter} is enabled on the store, the filter is returned inside a `Promise`
     * which is resolved once data has been loaded from the remote server
     * @category Sort, group & filter
     */
    addFilter(filter, silent = false) {
        //<debug>
        if (filter._filterBy && this.remoteFilter) {
            throw new Error('Cannot filter with a function if remote filtering is being used');
        }
        //</debug>
        const me = this;
        filter = filter instanceof Filter ? filter : new Filter(filter);

        // We want notification upon change of field, value or operator
        filter.owner = me;

        // Collection will replace any already existing filter on the field, unless it has id specified
        me.filters.add(filter);

        if (!silent) {
            if (me.remoteFilter) {
                return me.filter().then(() => filter);
            }
            else {
                me.filter();
            }
        }
        return filter;
    }

    /**
     * Filters the store by **adding** the specified filter(s) to the existing filters collection applied to this Store.
     * If a filter has an {@link Core.util.CollectionFilter#config-id id} specified,
     * or a {@link Core.util.CollectionFilter#config-property property} specified,
     * it will search for corresponding filter(s) in the existing filters first and replace it with a new filter.
     * **It will not remove other filters applied to the store!**
     *
     * To **add** a new filter:
     *
     * ```javascript
     * // Filter using simple object
     * store.filter({
     *     property : 'age',
     *     operator : '>',
     *     value    : 90
     * });
     *
     * // Filter using function
     * store.filter(r => r.age < 90);
     *
     * // Filter using a named filter as a function
     * store.filter({
     *     id : 'my-filter',
     *     filterBy : record => record.score > 10
     * });
     * ```
     *
     * To **remove** a specific filter, but keep other filters applied
     *
     * ```javascript
     * // Remove by filter `id` or `property`. Filter `id` defaults to the `property-operator` value.
     * store.removeFilter('age');
     * store.removeFilter('my-filter');
     * ```
     *
     * To **replace** all existing filters with a new filter
     *
     * ```javascript
     * // Remove all filters and filter using simple object
     * store.filter({
     *     filters : {
     *         property : 'age',
     *         operator : '<',
     *         value    : 90
     *     },
     *     replace : true
     * });
     *
     * // Remove all filters and filter using function
     * store.filter({
     *     filters : r => r.age > 90,
     *     replace : true
     * });
     *
     * // Remove all filters and filter using a named filter as a function
     * store.filter({
     *     filters : {
     *         id : 'my-filter',
     *         filterBy : record => record.score > 10
     *     },
     *     replace : true
     * });
     * ```
     *
     * Basically filters replacing is an equivalent of having two sequenced calls:
     * {@link #function-clearFilters clearFilters} and {@link #function-filter filter}.
     *
     * Call without arguments to reapply filters.
     *
     * ```javascript
     * // Re-filter the store
     * store.filter();
     * ```
     *
     * @param {CollectionFilterConfig|CollectionFilterConfig[]|Function|StoreFilterConfig} [newFilters]
     *        A {@link Core.util.CollectionFilter filter} config,
     *        or an array of {@link Core.util.CollectionFilter filter} configs,
     *        or a function to use for filtering,
     *        or a {@link StoreFilterConfig} object like: ```{ replace : true, filters : newFilters }```
     * @ts-param newFilters {CollectionFilterConfig|Array<CollectionFilterConfig>|Function|StoreFilterConfig}
     * @fires filter
     * @fires Core.data.Store#event-change
     * @returns {Promise|null} If {@link Core/data/Store#config-remoteFilter} is enabled on the store, this method returns Promise
     * which is resolved after data is loaded from remote server, otherwise it returns null value
     * @async
     * @category Sort, group & filter
     */
    filter(newFilters) {
        const me = this;

        let silent = false, internal;

        if (newFilters) {
            let fieldType = typeof newFilters;

            if (fieldType === 'object') {
                if (('silent' in newFilters) || ('replace' in newFilters) || newFilters.filters) {
                    silent = newFilters.silent;
                    if (newFilters.replace) {
                        // If replacing with empty filters (i.e. clearing filters), clearFilters should trigger a re-filter
                        me.clearFilters(newFilters.silent || newFilters.filters.length !== 0);
                    }
                    internal = newFilters.internal;
                    newFilters = newFilters.filters;
                    fieldType = typeof newFilters;
                }
            }

            // If it was just a config object containing no filters, this will be null
            if (newFilters) {
                const wasFiltered = me.isFiltered;

                // We will not be informed about Filter mutations while configuring.
                me.isConfiguring = true;

                // If we provide array of objects looking like :
                //  {
                //      property  : 'fieldName',
                //      value     : 'someValue',
                //      [operator : '>']
                //  }
                //  or ...
                //  {
                //      property : 'fieldName',
                //      filterBy : function (value, record) {
                //          return value > 50;
                //      }
                //  }
                if (Array.isArray(newFilters)) {
                    newFilters.forEach(f => me.addFilter(f, true), me);
                }
                else if (fieldType === 'function') {
                    //<debug>
                    if (me.remoteFilter) {
                        throw new Error('Cannot filter with a function if remote filtering is being used');
                    }
                    //</debug>
                    const filter = new Filter(newFilters);
                    filter.internal = internal;
                    me.addFilter(filter, true);
                }
                // Old signature of field name, value with implicit equality test.
                // Not documented, but still tested.
                else if (fieldType === 'string') {
                    me.addFilter({
                        property : newFilters,
                        value    : arguments[1]
                    }, true);
                }
                // An object-based filter definition
                else {
                    me.addFilter(newFilters, true);
                }

                // Open up to receiving Filter mutation notifications again
                me.isConfiguring = false;

                // We added a disabled filter to either no filters, or all disabled filters, so no change.
                if (!me.isFiltered && !wasFiltered) {
                    return null;
                }
            }
        }

        // Invalidate the filtersFunction so that it has to be recalculated upon next access
        me.filtersFunction = null;

        // Implemented here for local filtering.
        // AjaxStore implements for remote and returns a Promise, so MUST return the call value.
        const result = me.remoteFilter ? me.performRemoteFilter(silent) : me.performFilter(silent);

        // Force rebuild of idMap
        me._idMap = null;

        return result;
    }

    /**
     * Suspends reapplication of filters upon record updates. Can be called multiple times (it uses an internal counter).
     * @internal
     * @category Filtering
     */
    suspendFilterOnUpdate() {
        this.filterBatching++;
    }

    /**
     * Resumes reapplication of filters upon record updates. Will trigger filter reapplication if the internal counter is 0.
     * @param {Boolean} [silent=false] Set to `true` to not fire events.
     * @param {Boolean} [reapply=true] Set to `false` to drop a batched re-filter without running it.
     * @internal
     * @category Filtering
     */
    resumeFilterOnUpdate(silent, reapply = true) {
        this.filterBatching--;

        if (this.filterBatching < 0) {
            throw new Error('No matching `suspendFilterOnUpdate` call');
        }

        if (this.filterBatching === 0 && this.needsFiltering) {
            this.needsFiltering = false;
            // Pass `reapply` as `false` to drop a batched re-filter without running it - used after
            // index-only renumbering which never changes filter membership (mirrors resumeSortOnUpdate).
            reapply && this.performFilter(silent);
        }
    }

    /**
     * Perform filtering according to the {@link #property-filters} Collection.
     * This is the internal implementation which is overridden in {@link Core.data.AjaxStore} and
     * must not be overridden.
     * @private
     */
    performFilter(silent) {
        const
            me                             = this;

        if (me.filterBatching > 0) {
            me.needsFiltering = true;
            return;
        }

        const
            { storage, filters, rootNode } = me,
            oldCount                       = me.count;

        if (!silent) {
            me.trigger('beforeFilter', { filters });
        }

        let added, removed;

        if (me.tree) {
            const oldDataset = storage.values;

            if (me.isFiltered) {
                me.traverseFilter(rootNode);
            }
            else {
                me.traverseClearFilter(rootNode);
            }

            // When filterExcludesParents is active and a filter is applied, matching descendants of
            // non-matching parents are "lifted" so they remain visible in the flat record list even
            // though the tree itself still contains the non-matching ancestors.
            let newDataset;
            if (me.isFiltered && me.filterExcludesParents) {
                newDataset = me.collectVisibleRecordsExcludingParents(rootNode);
                // Because lifting flattens records from different tree levels into one list, any
                // configured sort must be re-applied here so the final order is deterministic and
                // respects the sorter rather than the original insertion order of unfilteredChildren.
                if (me.isSorted) {
                    newDataset.sort(me.sorterFn);
                }
            }
            else {
                newDataset = me.collectDescendants(rootNode).visible;
            }

            storage.replaceValues({
                values : newDataset,
                silent : true
            });

            const delta = ArrayHelper.delta(newDataset, oldDataset, true);

            added   = delta.toAdd;
            removed = delta.toRemove;
        }
        else {
            // Collect the added and removed deltas from the filter operation
            storage.ion({
                change({ removed : r, added : a }) {
                    removed = r;
                    added = a;
                },
                once : true
            });

            if (me.isFiltered) {
                // Bring collapsed away records in, to be considered in filtering
                me.isGrouped && me.includeCollapsed();

                storage.addFilter({
                    id       : 'primary-filter', // no-sanity
                    filterBy : me.filtersFunction
                });

                // Take them back out again after filtering
                me.isGrouped && me.excludeCollapsed();
            }
            else {
                storage.filters.clear();
            }
        }

        me.afterPerformFilter(silent || me.isRemoteDataLoading ? null : {
            action  : 'filter',
            filters,
            oldCount,
            added,
            removed,
            records : me.storage.values
        });
    }

    async performRemoteFilter(silent) {
        const
            me = this,
            {
                filters,
                count : oldCount
            } = me;

        if (await me.beforePerformFilter?.({ filters, oldCount }) === false) {
            return;
        }

        // load should default to page 1
        me.currentPage = 1;

        if (await me.performDataRequest(silent) === false) {
            return;
        }

        const event = silent
            ? null
            : {
                action  : 'filter',
                filters,
                oldCount,
                records : me.storage.values
            };

        me.afterPerformFilter(event);
        me.trigger('refresh', event);

    }

    buildRemoteParams(params = {}, encode = false) {
        super.buildRemoteParams?.(params, encode);

        const
            me = this,
            { filters } = me;

        if (me.remoteFilter && me.isFiltered) {
            params[me.filterParamName ?? 'filters'] = encode ? me.encodeFilterParams(filters) : me.getFilterParams(filters);
        }

        return params;
    }

    afterPerformFilter(event) {
        this.resetRelationCache();

        if (event) {
            this.triggerFilterEvent(event);
        }
    }

    // Called by STM when state restoration (undo/redo) completes.
    // During restore, tree node insertions defer refiltering to avoid sorting with stale field values
    // (InsertChildActions run before UpdateActions). We apply the deferred filter here, after all
    // actions in the transaction have completed and field values are up to date.
    onStmRestoringStop() {
        if (this.needsFilterAfterRestore) {
            this.needsFilterAfterRestore = false;
            this.filter();
        }
    }

    getFilterParams(filters) {
        return filters.values.filter(f => !f.disabled && !f._filterBy).map(f => f.toJSON());
    }

    // Used from filter() and StoreCRUD when reapplying filters
    triggerFilterEvent(event) {
        this.trigger('filter', event);

        // Only fire these events if it's a local filter.
        // If we are configured with filterParamName, the loadData will fire them.
        if (!this.remoteFilter) {
            this.trigger('refresh', event);
            this.trigger('change', event);
        }
    }

    /**
     * *Adds* a function used to filter the store. Alias for calling `filter(fn)`. Return `true` from the function to
     * include record in filtered set
     *
     * ```javascript
     * store.filterBy(record => record.age > 25 && record.name.startsWith('A'));
     * ```
     *
     * @param {Function} fn Function used to test records.
     * @param {Core.data.Model} fn.record Record to check
     * @ts-param fn.record {Core.data.Model|any} // Fix for redeclared TimeAxis.filterBy()
     * @param {Boolean} fn.returns Returns `true` value to indicate a match
     * @returns {Promise|null} If {@link Core/data/Store#config-remoteFilter} is enabled on the store, this method returns `Promise`
     *   which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @category Sort, group & filter
     */
    filterBy(fn) {
        return this.filter(fn);
    }

    /**
     * Removes the passed filter, or the filter by the passed ID from the {@link #config-filters} collection.
     * By default, filters are reevaluated and a Store change event fired.
     *
     * If the `silent` parameter is passed as `true`, multiple filters can be removed without causing data changes.
     *
     * When the filters are as required, call {@link #function-filter} with no parameters
     * to apply the filters to the store.
     *
     * ```javascript
     * // Only view top priority events
     * myEventStore.filter({
     *     id       : 'priorityFilter',
     *     property : 'priority',
     *     value    : 1,
     *     operator : '='
     * });
     *
     * // That individual filter can be removed like this
     * myEventStore.removeFilter('priorityFilter');
     *
     * // Add named filter as a function
     * store.filter({
     *     id : 'my filter',
     *     filterBy : record => record.score > 10
     * });
     *
     * // Remove named filter function
     * store.removeFilter('my filter');
     * ```
     *
     * @param {String|Core.util.CollectionFilter} idOrInstance Filter to remove, or ID of the filter to remove. By default,
     * filters are reevaluated and a change event fired.
     * @param {Boolean} [silent] Pass `true` to *not* refilter the store immediately. Such as when
     * removing multiple filters.
     * @returns {Promise|Core.util.CollectionFilter} If {@link Core/data/Store#config-remoteFilter} is enabled on the store, this method
     * returns Collection filter inside a `Promise` which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @category Sort, group & filter
     */
    removeFilter(idOrInstance, silent = false) {
        if (idOrInstance == null) {
            return null;
        }

        const
            me     = this,
            filter = idOrInstance instanceof Filter ? idOrInstance : me.filters.get(idOrInstance) ?? me.filters.getBy('property', idOrInstance);

        // If we have such a filter, remove it.
        if (filter) {
            me._filters?.remove(filter);

            // Invalidate the filtersFunction so that it has to be recalculated upon next access
            me._filtersFunction = null;

            if (!silent) {
                if (me.remoteFilter) {
                    return me.filter().then(() => filter);
                }
                else {
                    me.filter();
                }
            }

            return filter;
        }
    }

    /**
     * Removes all filters from the store. Filters that are marked as {@link Core/util/CollectionFilter#config-internal}
     * will *not* be removed.
     *
     * @param {Boolean} [silent] Pass `true` to *not* refilter the store immediately.
     * @returns {Promise|null} If {@link Core/data/Store#config-remoteFilter} is enabled on the store, this method returns `Promise`
     * which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @category Sort, group & filter
     */
    clearFilters(silent = false) {
        // Remove all non-internal filters (those have to be explicitly removed)
        this.filters.remove(this.filters.values.filter(f => !f.internal));

        if (!silent) {
            return this.filter();
        }
    }

    convertFilterToString(field) {
        const filter = this.filters.getBy('property', field);
        return (filter && !filter.filterBy) ? String(filter) : '';
    }

    doDestroy() {
        this._filters?.destroy();

        super.doDestroy();
    }
};
