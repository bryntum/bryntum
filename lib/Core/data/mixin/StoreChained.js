import Base from '../../Base.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import StringHelper from '../../helper/StringHelper.js';
import WalkHelper from '../../helper/WalkHelper.js';
import Filter from '../../util/CollectionFilter.js';

/**
 * @module Core/data/mixin/StoreChained
 */

const returnTrue = () => true;

/**
 * A chained Store contains a subset of records from a master store. Which records to include is determined by a
 * filtering function, {@link #config-chainedFilterFn}.
 *
 * ```javascript
 * masterStore.chain(record => record.percent < 10);
 *
 * // or
 *
 * new Store({
 *   masterStore     : masterStore,
 *   chainedFilterFn : record => record.percent < 10
 * });
 * ```
 *
 * ## Behavior of chained stores
 *
 * By default, chained stores will be resorted when the master store is sorted. This can be disabled by setting
 * {@link #config-syncSort} to `false`:
 *
 * ```javascript
 * store.chain(record => record.percent < 10, null, {
 *  syncSort : false
 * });
 * ```
 *
 * By default, reordering records in a flat chained store will not affect the order in the master store. This can be
 * enabled by setting {@link #config-syncOrder} to `true`:
 *
 * ```javascript
 * store.chain(record => record.percent < 10, null, {
 *   syncOrder : true
 * });
 * ```
 *
 * See {@link #config-syncOrder} for a note about the predictability of the outcome. Also note that reordering in a
 * chained tree store will always affect the order in the master store.
 *
 * ## Useful configs and functions
 *
 * | Config / Function                            | Description                                       |
 * |----------------------------------------------|---------------------------------------------------|
 * | {@link #config-chainedFilterFn}              | Function that determines which records to include  |
 * | {@link #config-masterStore}                  | The store from which records are sourced           |
 * | {@link #config-syncSort}                     | Sync sorting with the master store                 |
 * | {@link #function-fillFromMaster}             | Re-evaluate the chained filter                     |
 *
 * ## See also
 *
 * - {@link Core.data.Store} - The main store class with the `chain()` method
 *
 * @mixin
 */
export default Target => class StoreChained extends (Target || Base) {
    static $name = 'StoreChained';

    //region Config

    static configurable = {
        /**
         * Function used to filter records in the masterStore into a chained store. If not provided,
         * all records from the masterStore will be included in the chained store.
         * Return `true` to include the passed record, or a `false` to exclude it.
         *
         * {@note}Only applies to chained stores{/@note}
         *
         * @config {Function}
         * @param {Core.data.Model} record
         * @returns {Boolean}
         * @category Chained store
         * @non-lazy-load
         */
        chainedFilterFn : null,

        /**
         * Array of field names that should trigger filtering of chained store when the fields are updated.
         *
         * {@note}Only applies to chained stores{/@note}
         *
         * @config {String[]}
         * @category Chained store
         * @non-lazy-load
         */
        chainedFields : null,

        /**
         * Set to `true` to have the chained store react to expand/collapse changes in the master store.
         * By default, expand/collapse in the master store does not trigger a refill of the chained store.
         *
         * {@note}Only applies to chained stores{/@note}
         *
         * @config {Boolean}
         * @default false
         * @category Chained store
         * @non-lazy-load
         */
        chainExpandCollapse : false,

        /**
         * Master store that a chained store gets its records from.
         *
         * {@note}Only applies to chained stores{/@note}
         *
         * @config {Core.data.Store}
         * @category Chained store
         * @non-lazy-load
         */
        masterStore : null,

        /**
         * Method names calls to which should be relayed to master store.
         *
         * {@note}Only applies to chained stores{/@note}
         *
         * @config {String[]}
         * @category Chained store
         * @non-lazy-load
         */
        doRelayToMaster : ['add', 'remove', 'insert'],

        /**
         * Method names calls to which shouldn't be relayed to master store.
         *
         * {@note}Only applies to chained stores{/@note}
         *
         * @config {String}
         * @category Chained store
         * @non-lazy-load
         */
        dontRelayToMaster : [],

        /**
         * If `true`, collapsed records in original tree will be excluded from the chained store.
         *
         * {@note}Only applies to chained stores, and not when chaining using `chainTree()`{/@note}
         *
         * @config {Boolean}
         * @category Chained store
         * @non-lazy-load
         * @default
         */
        excludeCollapsedRecords : true,

        /**
         * If `true`, chained stores will be sorted when the master store is sorted. Note that this replaces
         * any existing sorters defined on the chained store.
         *
         * {@note}Only applies to chained stores{/@note}
         *
         * @config {Boolean}
         * @category Chained store
         * @default
         */
        syncSort : true,

        /**
         * If `true`, changing the order of records in a flat chained store (for example by using the `RowReorder`
         * feature in a Grid-based widget) will also change the order of records in the master store.
         *
         * {@note}Note that this config does not apply to chained tree stores (created using
         * {@link #function-chainTree}). Chained tree stores always sync the order of their records with the
         * master store.{/@note}
         *
         * Example usage:
         * ```javascript
         * store.chain(record => record.percent < 10, null, {
         *   syncOrder : true
         * });
         * ```
         *
         * {@note}The predictability of the outcome depends on the order of the records in both stores, and if the
         * subset of records in the chained store is contiguous. For example, if the master store has records
         * <code>A B C D E</code>, and the chained store has <code>E C A</code>, it will be difficult for users to
         * predict the outcome of moving <code>E</code> to between <code>C A</code>.{/@note}
         *
         * @config {Boolean}
         * @category Chained store
         * @default false
         */
        syncOrder : null,

        /**
         * Set to true to prevent including links (when grouping by array field)
         *
         * {@note}Only applies to chained stores{/@note}
         *
         * @config {Boolean}
         * @category Chained store
         * @non-lazy-load
         * @default false
         */
        ignoreLinkRecords : null,

        /**
         * If `true`, chained stores will apply filters from the master store. Filters flagged with `ignoreForChain`
         * will be ignored.
         *
         * {@note}Only applies to chained stores{/@note}
         *
         * @config {Boolean}
         * @category Chained store
         * @default false
         */
        chainFilters : null,

        chainSuspended : 0
    };

    // All props should be predefined to work properly with objectified stores
    static get properties() {
        return {
            chainedStores : null,
            isChainedTree : null
        };
    }

    //endregion

    construct(config) {
        super.construct(config);

        const
            me              = this,
            { masterStore } = me;

        if (masterStore) {
            me.methodNamesToRelay.forEach(fnName => me[fnName] = (...params) => me.relayToMaster(fnName, params));

            me.removeAll = (...params) => {
                masterStore.remove(me.getRange(), ...params);
                return true;
            };

            // <remove-on-release>
            // TODO: prevent other functions?
            // </remove-on-release>

            masterStore.ion({
                name            : 'masterStoreListeners',
                // HACK to have chained stores react early in an async events scenario (with engine). Could be turned
                // into a config, but this way one does not have to think about it
                changePreCommit : me.onMasterDataChangedPreCommit,
                change          : me.onMasterDataChanged,
                refresh         : me.onMasterStoreRefresh,
                prio            : 1,
                thisObj         : me
            });

            if (me.syncSort) {
                masterStore.ion({
                    sort    : () => me.sort(masterStore.sorters),
                    thisObj : me
                });
            }

            if (!masterStore.chainedStores) {
                masterStore.chainedStores = [];
            }
            masterStore.chainedStores.push(me);

            me.fillFromMaster();
        }
    }

    //region Properties

    // For accessing the full set of records, whether chained or not
    get $master() {
        return this.masterStore || this;
    }

    /**
     * Is this a chained store?
     * @member {Boolean}
     * @readonly
     * @category Advanced
     * @non-lazy-load
     */
    get isChained() {
        return Boolean(this.masterStore);
    }

    /**
     * Returns the root store in the chain — the store that is not itself chained. For a store chained
     * off another chained store, this walks up the full chain. Returns `this` if the store is not chained.
     * @member {Core.data.Store}
     * @readonly
     * @category Advanced
     */
    get baseStore() {
        return this.masterStore?.baseStore || this;
    }

    changeChainedFilterFn(chainedFilterFn) {
        return this.thisObj ? chainedFilterFn.bind(this.thisObj) : chainedFilterFn;
    }

    get chainedFilterFn() {
        return this._chainedFilterFn || returnTrue;
    }

    get methodNamesToRelay() {
        const
            doIsArray   = Array.isArray(this.doRelayToMaster),
            dontIsArray = Array.isArray(this.dontRelayToMaster);

        return doIsArray && this.doRelayToMaster.filter(name => !dontIsArray || !this.dontRelayToMaster.includes(name)) || [];
    }

    //endregion

    //region Internal

    updateChainedStores() {
        this.chainedStores?.forEach(store => store.fillFromMaster());
    }

    /**
     * Updates records available in a chained store by filtering the master store records using
     * {@link #config-chainedFilterFn}
     * @category Chained store
     * @non-lazy-load
     */
    fillFromMaster() {
        const
            me                              = this,
            { masterStore, isTree }         = me,
            { isFiltered : masterFiltered } = masterStore;

        if (!me.isChained) {
            throw new Error('fillFromMaster only allowed on chained store');
        }

        if (me.isChainSuspended) {
            return;
        }

        let records;

        // Generate a filter function based on the master store's filters if we're configured to honour them,
        // so that we can apply it to the master store's allRecords collection.
        // This is needed to match the master store's filtering when chainFilters is `true`.
        const filterFn = me.generateMasterFilterFn();

        // Trees chained with chainTree() have their own fill method
        if (me.isChainedTree) {
            return me.fillTreeFromMaster(filterFn);
        }

        records = masterStore.allRecords.filter(r => {
            // We exclude special rows and linked records by default.
            // We honour our chainedFilterFn. We honour the filterFn from the master store if configured to do so.
            if (r && !r.isSpecialRow && (!me.ignoreLinkRecords || !r.isLinked) && me.chainedFilterFn(r) && (!filterFn || filterFn(r))) {
                // If we exclude collapsed records, we need to honour the record's
                // *currently* expanded ancestor state in the master store.
                return !(me.excludeCollapsedRecords && !r.ancestorsExpanded(masterStore));
            }
        });

        // If the store is filtered, then a sort only affects the visible records.
        // We see the allRecords array which is not sorted, so we have to apply the
        // masterStore sorter so we get the same view of the data
        if (me.masterStore.sorterFn && masterFiltered && masterStore.isSorted && !masterStore.remoteSort) {
            records.sort(masterStore.sorterFn);
        }

        if (isTree) {
            // All nodes will be registered
            me.idRegister = {};
            me.internalIdRegister = {};

            // *all* owned records have to join, as they would have done if they'd all gone through
            // the appendChild route for this store.
            records.forEach(r => {
                if (r.stores.includes(me)) {
                    me.register(r);
                }
                else {
                    r.joinStore(me);
                }
            });

            // We exclude collapsed records by default. It's used in Columns Store.
            // Because grid columns is a tree store when subgrid columns is just a chained store of the columns store.
            // And we don't need to include collapsed column.
            // If we need to show collapsed nodes in Combo we need to chain tree store and set `excludeCollapsedRecords` to `false`.
            if (me.excludeCollapsedRecords) {
                const children = me.getChildren(me.rootNode);
                records = me.doIncludeExclude(children, true);
            }
            // If we're *not* excluding collapsed records, ensure all parent nodes
            // are expanded so that a UI which renders tree structures renders them all.
            else {
                records.forEach(r => r.instanceMeta(me).collapsed = false);
            }
        }

        me.isFillingFromMaster = true;

        me.data = records;

        me.isFillingFromMaster = false;
    }

    /**
     * Generates a filter function for filtering which records from the master store should be included in the chained store,
     * based on the master store's filters, if {@link #config-chainFilters} is `true`.
     *
     * Master store filters flagged with `ignoreForChain` will be ignored.
     * @internal
     * @returns {Function} A filter function which returns `true` for records that should be included in the chained store, and `false` for records that should be excluded.
     */
    generateMasterFilterFn() {
        const
            me              = this,
            { masterStore } = me;

        // Allow opting in to using filters from the master store
        if (me.chainFilters && masterStore.isFiltered) {
            const filters = masterStore.filters.values.filter(filter => !filter.ignoreForChain);
            if (filters.length) {
                const filterFn = Filter.generateFiltersFunction(filters);
                return r => r.isCreating || filterFn(r);
            }
        }
    }

    // Should not be called directly, call fillFromMaster() instead
    fillTreeFromMaster(filterFn) {
        const
            me                  = this,
            { chainedFilterFn } = me,
            masterRoot          = me.masterStore.rootNode,
            newParents          = [],
            oldTreeLinkMap      = me.treeLinkMap || {},
            // All nodes will be registered
            idRegister          = me.idRegister = {},
            internalIdRegister  = me.internalIdRegister = {};

        // Track links, to reuse when refilling
        me.treeLinkMap = {};

        // The isLeaf check is needed because of how converting a leaf to parent works, it will first have children but
        // momentarily be a leaf.
        WalkHelper.postWalk({ children : masterRoot.unfilteredOrChildren }, r => !r.isLeaf && (r.unfilteredOrChildren || r.children), record => {
            if (
                // Include leaves that match filters
                (record.isLeaf && (!filterFn || filterFn(record)) && chainedFilterFn(record)) ||
                // And parents that have a leaf included
                (!record.isLeaf && record.meta?.tempChildren?.length)
            ) {
                const
                    parentMeta   = record.parent?.meta,
                    existingLink = oldTreeLinkMap[record.id],
                    // Reuse links to leafs, to boost performance a bit. Reusing parents proved to be more complex,
                    // and not currently worth the effort
                    reuse        = record.isLeaf && existingLink,
                    link         = reuse || record.link(),
                    proxyData    = link.proxyMeta.data;

                me.treeLinkMap[record.id] = link;

                // When reusing, reset parent in case it has changed (indentation, move etc.).
                // If we don't, appendChild below won't work as expected
                if (reuse) {
                    proxyData.parent = proxyData.parentIndex = proxyData.unfilteredIndex = proxyData.parentId =
                        proxyData.children = proxyData.orderedChildren = proxyData.unfilteredChildren = null;

                    // Re-used nodes already in the store won't be re-registered automatically,
                    // and we forcefully cleared the register above
                    idRegister[link.id] = existingLink;
                    internalIdRegister[link.internalId] = existingLink;
                }
                // Get rid of link that won't be reused
                else if (existingLink) {
                    link.removeLink(existingLink);
                }

                if (!parentMeta.tempChildren) {
                    parentMeta.tempChildren = [];
                }
                parentMeta.tempChildren.push(link);

                record.isParent && newParents.unshift(link);
            }
        });

        me.rootNode.meta.isFillingFromMaster = me.isFillingFromMaster = true;

        for (let i = newParents.length - 1; i >= 0; i--) {
            const
                record = newParents[i],
                { meta } = record.$original;

            if (meta.tempChildren) {
                record.meta.isFillingFromMaster = true;
                record.appendChild(meta.tempChildren, true);
                record.meta.isFillingFromMaster = false;

                meta.tempChildren = null;
            }
        }

        me.data = masterRoot.meta.tempChildren || [];

        me.rootNode.meta.isFillingFromMaster = me.isFillingFromMaster = false;

        masterRoot.meta.tempChildren = null;
    }

    /**
     * Commits changes back to master.
     * - the records deleted from chained store and present in master will be deleted from master
     * - the records added to chained store and missing in master will added to master
     * Internally calls {Store#function-commit commit()}.
     * @returns {Object} Changes, see Store#changes
     * @internal
     */
    commitToMaster() {
        const
            me = this,
            master = me.masterStore;

        if (!me.isChained) {
            throw new Error('commitToMaster only allowed on chained store');
        }

        master.beginBatch();
        master.remove(me.removed.values);
        master.add(me.added.values);
        master.endBatch();

        return me.commit();
    }

    /**
     * Relays some function calls to the master store
     * @private
     */
    relayToMaster(fnName, params) {
        return this.masterStore[fnName](...params);
    }

    // HACK, when used with engine the chained store will catch events early (sync) and prevent late (async) listeners
    onMasterDataChangedPreCommit(event) {
        this.$masterEventhandled = false;
        this.onMasterDataChanged(event);
        this.$masterEventhandled = true;
    }

    /**
     * Handles changes in master stores data. Updates the chained store accordingly
     * @private
     */
    onMasterDataChanged({ action, changes, isMove, isExpand, isCollapse }) {
        const me = this;

        // Handled early in engine store (above), bail out
        if (me.$masterEventhandled) {
            me.$masterEventhandled = false;
            return;
        }

        // 'move' action triggers a remove event first, we wait for the 'add' - no need to fill twice
        if (isMove && action === 'remove') {
            return;
        }

        // Skip expand/collapse events unless opted in via chainExpandCollapse config
        if (!me.chainExpandCollapse && (isExpand || isCollapse)) {
            return;
        }

        // If a field not defined in chainedFields is changed, ignore the change. There is no need to re-filter the
        // store in such cases, the change will be available anyhow since data is shared. With exception for `isLeaf`
        // and `parentId`, since they affect structure
        if (
            action !== 'update' || me.chainedFields === '*' || me.chainedFields?.some(field => field in changes) ||
            'isLeaf' in changes || 'parentId' in changes
        ) {
            me.fillFromMaster();
        }
    }

    /**
     * Handles refresh events from the master store. During batch operations, individual change events are
     * suppressed and only a refresh event with `action: 'batch'` fires after `endBatch()`. This ensures the
     * chained store stays in sync after batch operations.
     * @private
     */
    onMasterStoreRefresh({ action }) {
        if (action === 'batch') {
            this.fillFromMaster();
        }
    }

    //endregion

    //region public API

    /**
     * Creates a chained store, a new Store instance that contains a subset of the records from current store.
     * Which records is determined by a filtering function, which is reapplied when data in the base store changes.
     *
     * ```javascript
     * // Chain all records
     * const all = store.chain();
     *
     * // Or a subset using a filter function
     * const oldies = store.chain(record => record.age > 50);
     * ```
     *
     * {@note}If you want to chain a tree store, consider using {@link Core.data.Store#function-chainTree} instead. It
     * will create a new tree store with links to the records in this store. This will let you expand/collapse and
     * filter nodes in the chained store without affecting the original store.{/@note}
     *
     * If this store is a {@link Core.data.mixin.StoreTree#property-isTree tree} store, then the resulting chained store
     * will be a tree store sharing the same root node, but only child nodes which pass the `chainedFilterFn` will be
     * considered when iterating the tree through the methods such as {@link Core.data.Store#function-traverse}
     * or {@link Core.data.Store#function-forEach}.
     *
     * @param {Function} [chainedFilterFn] An optional filter function called for every record to determine if it should
     * be included (return `true` / `false`). Leave it out to include all records.
     * @param {Core.data.Model} chainedFilterFn.record The record to test
     * @param {String[]} [chainedFields] Array of fields that trigger filtering when they are updated
     * @param {StoreConfig} [config] Additional chained store configuration. See {@link Core.data.Store#configs}
     * @returns {Core.data.Store}
     * @category Chained store
     * @non-lazy-load
     */
    chain(chainedFilterFn = returnTrue, chainedFields, config) {
        //<debug>
        // Guard against instances being passed in an attempt to clone.
        if (config && !ObjectHelper.isObject(config)) {
            throw new Error('Raw config object must be passed to chain');
        }
        //</debug>

        // If we are chained, the resulting store drills directly to the master store
        // But we still need to honour our chainedFilterFn as well as the incoming one.
        if (this.isChained) {
            const newChainedFilterFn = chainedFilterFn;
            chainedFilterFn = r => newChainedFilterFn(r) && this.chainedFilterFn(r);
        }

        return new (config?.storeClass || this.constructor)({
            id             : `${this.id}-chained-${StringHelper.generateUUID()}`,
            tree           : false,
            autoTree       : false,
            // Make sure we don't share instanceMeta with the master store
            ...(config || {}),
            // If someone ever chains a chained store, chain master instead
            masterStore    : this.$master,
            modelClass     : this.modelClass,
            // Chained store should never use syncDataOnLoad, that will create an infinite loop when they determine
            // that a record is added and then add it to master, repopulating this store and round we go
            syncDataOnLoad : false,
            chainedFilterFn,
            chainedFields
        });
    }

    /**
     * Creates a chained tree store, a new Store instance that contains a subset of the records from current store.
     * Which records is determined by a filtering function, which is reapplied when data in the base store changes.
     *
     * ```javascript
     * // Chain all nodes
     * const fullTree = store.chainTree();
     * // Or a subset
     * const oldies = store.chainTree(record => record.age > 50);
     * ```
     *
     * The resulting chained store will be a tree store with its own root node, under which all children are links to
     * the nodes in this store. This allows for expanding/collapsing and filtering nodes in the chained store without
     * affecting the original store.
     *
     * @param {Function} [chainedFilterFn] An optional filter function called for every leaf record to determine if it
     * should be included (return `true` / `false`). Leave it out to include all records.
     * @param {String[]} [chainedFields] Array of fields that trigger filtering when they are updated
     * @param {StoreConfig} [config] Additional chained store configuration. See {@link Core.data.Store#configs}
     * @returns {Core.data.Store}
     * @category Chained store
     * @non-lazy-load
     */
    chainTree(chainedFilterFn, chainedFields, config) {
        if (!this.tree) {
            throw new Error('chainTree only allowed on tree stores');
        }

        return this.chain(chainedFilterFn, chainedFields, {
            tree          : true,
            isChainedTree : true,
            // Ensure we use same type of root node as the master store
            rootNode      : this.rootNode.link(),
            ...config
        });
    }

    //endregion

    doDestroy() {
        // Remove our mutation listeners from our master store
        this.detachListeners('masterStoreListeners');

        // Destroy chained store on master store destroy
        this.chainedStores?.forEach(chainedStore => chainedStore.destroy());

        // Events superclass fires destroy event.
        super.doDestroy();
    }

    suspendChain() {
        this.chainSuspended++;
    }

    resumeChain(refill = false) {
        if (this.chainSuspended && !--this.chainSuspended && refill) {
            this.fillFromMaster();
        }
    }

    get isChainSuspended() {
        return this.chainSuspended > 0;
    }
};
