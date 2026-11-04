import Base from '../../Base.js';
import ArrayHelper from '../../helper/ArrayHelper.js';
import SparseIndexHelper from '../../helper/SparseIndexHelper.js';

/**
 * @module Core/data/mixin/StoreSparseIndex
 */

/**
 * Object form of {@link Core.data.mixin.StoreSparseIndex#config-useSparseIndex}, enabling sparse index handling with
 * an application supplied generator instead of the built in fractional one.
 *
 * @typedef {Object} SparseIndexGenerator
 * @property {Function} generateSparseIndex Returns the `sparseIndex` value to assign to a single record. The record it
 *   returned a value for is handed to the following call as its `prevSibling`, so a block of records is generated one
 *   record at a time rather than by distributing a single arithmetic series over the block.
 *
 *   The store may ask for a value for the same record more than once - appending to a tree node asks once while the
 *   node is ingested, and again when it is placed among its siblings - and it may ask for a value which turns out to
 *   equal the one the record already has. The function must therefore be free of side effects, and in particular must
 *   not draw keys from a backend sequence.
 *
 *   `index` and `count` describe the *calls*, not the records: a block can contain records which already hold a
 *   value and which the function is therefore never asked about, and those occupy no position. A record asked about
 *   more than once appears in two separate blocks, with its own `index` and `count` in each, and an answer which is
 *   later discarded still consumed a position in the block it was given for.
 * @property {Object} generateSparseIndex.context Describes the position the value is generated for
 * @property {Core.data.Model|null} generateSparseIndex.context.prevSibling The record the new value has to sort
 *   after, or `null` when there is no such record, or when that record does not hold a `sparseIndex` itself yet
 * @property {Core.data.Model|null} generateSparseIndex.context.nextSibling The record the new value has to sort
 *   before, or `null` when there is no such record, or when that record does not hold a `sparseIndex` itself yet
 * @property {Number} generateSparseIndex.context.index The 0-based position of this call among the calls made for the
 *   block of records being generated
 * @property {Number} generateSparseIndex.context.count The number of times the function will be asked for a value for
 *   that block. `count - index + 1` is the number of requests still outstanding plus one, which is the divisor that
 *   spreads the remaining gap evenly across them
 * @property {Number} generateSparseIndex.returns The value to assign. It must be a finite `Number`: returning
 *   anything else is a programming error and always throws, in every build, on every path including loading. It must
 *   also sort strictly between `prevSibling` and `nextSibling`, wherever each of them exists. A value which does not
 *   is refused: the operation which asked for it throws and leaves the store exactly as it was. Loading is the one
 *   exception to that second rule, and warns instead; see {@link #config-useSparseIndex}.
 */

// Incremented per restoreSparseIndexOrder call to mark the visible records of a filtered store
let visibleGeneration = 0;

// Runs over the whole storage on every drag start, so it is kept as tight as possible
const isInSparseIndexOrder = values => {
    const { sorter } = SparseIndexHelper;

    for (let i = 1; i < values.length; i++) {
        if (sorter(values[i - 1], values[i]) > 0) {
            return false;
        }
    }

    return true;
};

/**
 * Mixin for Store that handles sparse index generation for its records. Sparse indexes are useful for manually ordering
 * of records. To prevent the necessity to update indexes on a large number of records when inserting or reordering
 * records, sparse indexes are fractional numbers that will be generated inbetween the sparse indexes of the surrounding
 * record.
 *
 * This mixin is **disabled** by default and needs to be enabled on a per-Store basis.
 *
 * ```javascript
 * const store = new Store({
 *     useSparseIndex : true,
 *     data : [
 *         { id : 1, name : 'First' },
 *         { id : 2, name : 'Second' }
 *     ]
 * });
 * // Records automatically receive sparseIndex values (1000, 2000, ...)
 * ```
 *
 * ## Useful configs
 *
 * | Config                                           | Description                                      |
 * |--------------------------------------------------|--------------------------------------------------|
 * | {@link #config-useSparseIndex}                   | Enable sparse index handling on the store         |
 *
 * ## See also
 *
 * - {@link Core.data.Store} - The main store class
 *
 * @mixin
 */
export default Target => class StoreSparseIndex extends (Target || Base) {
    static $name = 'StoreSparseIndex';

    //region Config

    static configurable = {
        /**
         * Enable sparse index handling. When enabled, the store's model will be augmented with a `sparseIndex` field
         * (unless it already exists) which will be automatically managed by the store. When adding or inserting records
         * into the store, sparse indexes will be generated for those records. When moving records, their sparse index
         * will be updated with a fractional number. They will be used to sort records when no other sorter is defined
         * on the store.
         *
         * Sparse indexes are a tree-defining property. They will also be used to determine the order of records when
         * persisting the store's data. When using sparse indexes in a tree store, the store's
         * {@link Core.data.mixin.TreeNode#field-parentId} will also be made persistent to allow reconstruction of the
         * tree structure when loading data.
         *
         * When using sparse indexes, the other tree-defining properties `parentIndex` and `orderedParentIndex` will no
         * longer be persistent. Their values will still be updated when items are added, removed, or re-ordered, but
         * they won't be marked as dirty and won't be included when persisting the store's data. If it is necessary to
         * persist these fields, use {@link Core.data.mixin.TreeNode#property-hierarchyModificationDataToWrite}.
         *
         * Sparse indexes describe a single order, so records cannot be reordered while the store is sorted by
         * something else. Dropping rows dragged with the {@link Grid.feature.RowReorder} feature therefore first
         * restores the sparse index order, which removes any user sorters and re-sorts the view by sparse index.
         * Filters stay applied, and only the moved records get a new sparse index value. This applies to flat,
         * non-chained stores which are neither grouped nor sorted remotely; other stores keep their sorters, which are
         * handled on drop as usual.
         *
         * The generated values are fractional numbers seeded from zero, so they may become adjacent or negative. A
         * backend which cannot store IEEE 754 floats, or which gives meaning to zero and to negative keys, can take
         * generation over by configuring a {@link SparseIndexGenerator} object instead of `true`:
         *
         * ```javascript
         * const store = new Store({
         *     useSparseIndex : {
         *         // Integers, spread evenly over the gap so a whole block fits where bisecting would crowd it
         *         generateSparseIndex({ prevSibling, nextSibling, index, count }) {
         *             const
         *                 prev    = prevSibling?.sparseIndex,
         *                 next    = nextSibling?.sparseIndex,
         *                 // Requests still to come, including this one, plus one for the gap kept before `next`
         *                 divisor = count - index + 1;
         *
         *             if (prev == null && next == null) {
         *                 return 1024;
         *             }
         *             if (next == null) {
         *                 return prev + 1024;
         *             }
         *             if (prev == null) {
         *                 return Math.max(1, Math.floor(next / divisor));
         *             }
         *             return prev + Math.floor((next - prev) / divisor);
         *         }
         *     }
         * });
         * ```
         *
         * The generator decides every value the store generates, including the values which repair duplicate sparse
         * indexes found in *loaded* data. Values which arrive with the data are never passed through it.
         *
         * A generated value must sort strictly between `prevSibling` and `nextSibling`, wherever each of them
         * exists, and one which does not is refused rather than written: two records sharing a value in a store
         * sorted by that value have no defined order, and it would be persisted that way.
         *
         * Nothing renumbers records to make room, so a generator has to cope with running out of it. Using `index`
         * and `count` as above settles one of the two ways that happens: a whole block, such as a multi-row drag,
         * is spread evenly over the gap rather than each record halving what the one before it left, so a block
         * fits wherever there is room for it. What it does not settle is *repeated* insertion at the same position,
         * which halves the gap each time whatever the block size, until no integer is left between the two records.
         * The generator then has nothing valid left to return.
         *
         * How that is reported depends on where it happens:
         *
         * - **Mutating** the store - {@link Core.data.Store#function-add}, {@link Core.data.Store#function-insert},
         *   {@link Core.data.Store#function-move}, `appendChild` - **throws**, and the store is left holding what it
         *   held before. Catch the error, renumber the affected sibling group, persist the new values, and retry.
         *   Taking back a refused `add` or `insert` runs the model's `beforeRemove` hook, so linked records are
         *   removed as they would be for a real removal.
         * - **Loading** warns and completes. The data is already what it is, and refusing it would leave the
         *   application unable to start over a dataset it could otherwise show. The record keeps the value it
         *   arrived with, so a duplicate in loaded data stays until the group is renumbered.
         *
         * @config {Boolean|SparseIndexGenerator}
         * @default
         */
        useSparseIndex : false
    };

    //endregion

    /**
     * Yields `true` when sparse index handling is enabled for this store's records, as configured by
     * {@link #config-useSparseIndex}. A chained store holds the records of its
     * {@link Core.data.Store#config-masterStore}, which therefore decides for it.
     *
     * Yields the configured value, so an object enabling the feature with a generator yields that object.
     *
     * The tree paths in {@link Core.data.mixin.TreeNode} read this, since a node cannot answer the question from its
     * own class, as does {@link #property-sparseIndexGenerator}. The flat paths deliberately keep reading the raw
     * config for the enabled/disabled question, which needs no resolving.
     * @member {Boolean|SparseIndexGenerator}
     * @readonly
     * @internal
     */
    get usesSparseIndex() {
        return this.masterStore?.usesSparseIndex ?? this.useSparseIndex;
    }

    /**
     * The `generateSparseIndex` function of this store's {@link #config-useSparseIndex}, or `null` when the store
     * generates sparse indexes itself. Resolved through {@link #property-usesSparseIndex}, so a chained store uses
     * the generator of the store which owns its records.
     * @member {Function|null}
     * @readonly
     * @internal
     */
    get sparseIndexGenerator() {
        const generate = this.usesSparseIndex?.generateSparseIndex;

        // Only a callable value selects the generator path. Anything else falls back to fractional generation, which
        // is what the debug warning in `updateModelClass` promises, rather than failing inside the generator
        return typeof generate === 'function' ? generate : null;
    }

    /**
     * Generates the sparse indexes the passed records are missing, honouring a configured
     * {@link SparseIndexGenerator}. Every sparse index this store generates goes through here, so the choice between
     * the built in fractional values and an application supplied generator is made in exactly one place.
     * @param {Core.data.Model[]} records The block of records which need sparse indexes
     * @param {Core.data.Model} [prev] The preceding record
     * @param {Core.data.Model} [next] The succeeding record
     * @param {Boolean} [silent=true] Specify `false` to announce the generated values with an `update` event
     * @param {Boolean} [abort=true] Specify `false` to warn and keep the existing value instead of throwing when a
     * generated value does not sort between its siblings. Only the load path passes `false`
     * @param {Boolean} [forceOrder=false] Specify `true` when the caller's record order is authoritative, which makes
     * the generated values overwrite existing ones even when neither boundary is present. Only `move` passes `true`
     * @internal
     */
    addSparseIndexes(records, prev = null, next = null, silent = true, abort = true, forceOrder = false) {
        const { sparseIndexGenerator : generate } = this;

        if (generate) {
            SparseIndexHelper.generateSparseIndexes(records, { generate, prev, next, silent, abort, forceOrder });
        }
        else {
            SparseIndexHelper.addSparseIndexes(records, prev, next, silent, forceOrder);
        }
    }

    /**
     * Generates and validates the sparse indexes the passed records are missing **without writing them**, for a
     * caller which has to settle structure before it can apply them. Returns `null` when no generator is configured,
     * which tells the caller to fall back to {@link #function-addSparseIndexes}.
     * @param {Core.data.Model[]} records The block of records which need sparse indexes
     * @param {Core.data.Model} [prev] The preceding record
     * @param {Core.data.Model} [next] The succeeding record
     * @returns {Object[]|null} The generated values for {@link #function-applySparseIndexes}, or `null`
     * @internal
     */
    computeSparseIndexes(records, prev = null, next = null) {
        const { sparseIndexGenerator : generate } = this;

        return generate ? SparseIndexHelper.computeSparseIndexes(records, { generate, prev, next }) : null;
    }

    /**
     * Writes the values returned by {@link #function-computeSparseIndexes}.
     * @param {Object[]} generated The generated values
     * @internal
     */
    applySparseIndexes(generated) {
        SparseIndexHelper.applySparseIndexes(generated);
    }

    /**
     * Repairs duplicate sparse indexes among the passed records, honouring a configured
     * {@link SparseIndexGenerator}. The repaired values are generated the same way as any other, so data carrying
     * duplicates cannot reintroduce fractional values into a store whose generator avoids them.
     * @param {Core.data.Model[]} records Records in ascending sparse index order
     * @param {Boolean} [abort=true] Specify `false` to warn and leave an unrepairable duplicate in place instead of
     * throwing. Only the load path passes `false`
     * @internal
     */
    consolidateSparseIndexes(records, abort = true) {
        // `fieldName` is deliberately not exposed here: the generator is handed records and reads `sparseIndex` off
        // them, so it can only ever be correct for that field
        SparseIndexHelper.consolidateSparseIndexes(records, 'sparseIndex', this.sparseIndexGenerator, abort);
    }

    updateModelClass(modelClass, oldModelClass) {
        const me = this;

        // This mixin is applied after StoreGroup, which also updates on modelClass changes
        super.updateModelClass?.(modelClass, oldModelClass);

        if (me.useSparseIndex) {
            //<debug>
            // A wrong or misspelled key would silently leave the store on the fractional path, producing exactly the
            // values a generator is usually configured to avoid, and only discovered when the data is synced
            if (typeof me.useSparseIndex === 'object' && typeof me.useSparseIndex.generateSparseIndex !== 'function') {
                console.warn(`'useSparseIndex' was configured with an object which has no callable 'generateSparseIndex' function. Sparse indexes will be generated as fractional numbers.`);
            }
            //</debug>

            modelClass.addField(/** @type ModelFieldConfig */{
                name     : 'sparseIndex',
                persist  : true,
                internal : true,
                type     : 'number'
            });
            // we don't want to sync other tree order indexes when persisting sparseIndex
            const parentIndex = modelClass.getFieldDefinition('parentIndex');
            parentIndex && (parentIndex.persist = false);
            const orderedParentIndex = modelClass.getFieldDefinition('orderedParentIndex');
            orderedParentIndex && (orderedParentIndex.persist = false);

            if (me.isTree) {
                const def = modelClass.getFieldDefinition(modelClass.parentIdField);
                if (def) {
                    def.persist = true;
                }
                else {
                    modelClass.addField(/** @type ModelFieldConfig */{
                        name     : modelClass.parentIdField,
                        persist  : true,
                        internal : true,
                        type     : 'number'
                    });
                }
            }
        }
    }

    afterConstruct() {
        super.afterConstruct();

        const me = this;

        if (me.useSparseIndex && !me.isTree) {
            if (me.count) {
                me.initSparseIndexes();
            }
            else if (me.isPartOfProject) {
                me.ion({
                    refreshprecommit : 'initSparseIndexes',
                    thisObj          : me,
                    once             : true
                });
            }
            else {
                me.ion({
                    load    : 'initSparseIndexes',
                    thisObj : me
                });
            }
        }
    }

    /**
     * Initialize sparse indexes for existing records which don't have a sparseIndex value.
     * If the store is not sorted, it will first be sorted by sparseIndex; records without one are sorted to the end.
     * After all records have a sparseIndex value, the values will be consolidated to ensure that no duplicates exist.
     * @param {Object} [event] The event object if called as an event handler
     * @param {String} [event.action] The action that triggered this call. Only 'dataset' and 'load' will cause
     * initialization of sparse indexes.
     * @internal
     */
    initSparseIndexes({ action } = {}) {
        const
            me          = this,
            { records } = me;

        if (
            !me.useSparseIndex
            || me.isTree
            || records.length === 0
            || (action && !['dataset', 'load', 'read'].includes(action))) {
            return;
        }

        if (!me.isSorted) {
            me.sort(SparseIndexHelper.sorter);
        }

        me.beginBatch();

        // A generator throwing on the first row of real backend data would otherwise leave the store's events
        // suspended forever, with nothing in the stack trace pointing at the store
        try {
            // Loading warns rather than aborts; refusing would leave the application unable to start
            me.addSparseIndexes(records, null, null, true, false);
            me.consolidateSparseIndexes(records, false);
        }
        finally {
            me.endBatch();
        }
    }

    // region Sort

    /**
     * Yields `true` when sparse indexes are used and the store's sorters put records in sparse index order, either
     * because no sorters are defined at all or because the single sorter sorts ascending by sparse index.
     * @member {Boolean}
     * @readonly
     * @category Sort, group & filter
     * @internal
     */
    get isSortedBySparseIndex() {
        const { useSparseIndex, sorters } = this;

        if (!useSparseIndex || sorters.length > 1) {
            return false;
        }

        if (!sorters.length) {
            return true;
        }

        const { ascending, field, sortFn } = sorters[0];

        return ascending !== false && (sortFn === SparseIndexHelper.sorter || (!sortFn && field === 'sparseIndex'));
    }

    /**
     * Creates a function used with Array#sort when sorting the store. This override adds a sorter on the sparseIndex
     * field if sparse indexes are used and no other sorters are defined.
     * @param {Sorter[]} sorters An array of sorter config objects
     * @returns {Function}
     * @category Sort, group & filter
     * @internal
     */
    createSorterFn(sorters) {
        if (this.useSparseIndex && sorters.length === 0) {
            // If no sorters are defined, use sparse index to sort records
            sorters = [{ sortFn : SparseIndexHelper.sorter }];
        }

        return super.createSorterFn(sorters);
    }

    /**
     * Restores the sparse index order of the store, removing any user sorters. Both the visible and the filtered out
     * records are put back in sparse index order, and filters stay applied. Only the order of the store's storage
     * changes, and no record is modified.
     *
     * Returns `false` without firing any event when there is nothing to restore, or when sparse indexes don't define
     * the order of the store, which is the case for empty, tree, grouped, chained and remotely sorted stores.
     * @param {Boolean} [silent=false] Specify `true` to suppress the `sort` and `refresh` events
     * @returns {Boolean} `true` if the sparse index order was restored
     * @fires sort
     * @fires refresh
     * @category Sort, group & filter
     * @internal
     */
    restoreSparseIndexOrder(silent = false) {
        const
            me          = this,
            { storage } = me;

        if (
            !me.useSparseIndex
            || me.isTree
            || me.isGrouped
            || me.isChained
            || me.remoteSort
            || !storage.totalCount) {
            return false;
        }

        const
            { sorter }                = SparseIndexHelper,
            { allValues }             = storage,
            { isSortedBySparseIndex } = me;

        // Sorting a filtered store only reorders its visible records, so the storage can be left out of sparse index
        // order even when the sorters already sort by sparse index
        if (isSortedBySparseIndex && isInSparseIndexOrder(allValues)) {
            return false;
        }

        if (!isSortedBySparseIndex) {
            // Skips the vetoable beforeSort event by design, same technique as clearSorters
            me.sorters.length = 0;
        }

        const sortedValues = allValues.slice().sort(sorter);

        let filteredValues;

        // Derive the visible records from the sorted storage, so they always remain a subsequence of it. Visible
        // records are marked with a per-call generation value; marks left from earlier calls compare unequal, so
        // there is nothing to clean up afterward.
        if (storage.isFiltered) {
            const
                generation     = ++visibleGeneration,
                visibleRecords = storage.values;

            for (let i = 0; i < visibleRecords.length; i++) {
                visibleRecords[i].meta.sparseIndexVisible = generation;
            }

            filteredValues = sortedValues.filter(record => record.meta.sparseIndexVisible === generation);
        }

        // filteredValues is ignored unless the storage is filtered
        storage.replaceValues({
            values : sortedValues,
            filteredValues,
            silent : true
        });

        // Record indexes are cached, afterPerformSort only invalidates them when not silent
        me._idMap = null;

        me.afterPerformSort(silent);

        return true;
    }

    // endregion

    // region CRUD

    /**
     * Wrapper for StoreCRUD.add, adding sparse indexes to appended records
     *
     * @param {Core.data.Model|Core.data.Model[]|Object|Object[]} records Array of records/data or a single record/data to add to store
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @param {Object} options
     * @returns {Core.data.Model[]} Added records
     * @internal
     */
    /**
     * Whether the sort a mutation applied has to be reapplied after sparse indexes are generated. Only a store which
     * sorts on add does, and only when it sorts locally.
     * @member {Boolean}
     * @readonly
     * @internal
     */
    get reappliesSortersOnGeneration() {
        const me = this;

        return me.reapplySortersOnAdd && me.isSorted && !me.remoteSort;
    }

    /**
     * Sorts the store again once sparse indexes have been generated.
     *
     * {@link Core.data.mixin.StoreSort#config-reapplySortersOnAdd} sorts inside `super.add`, which runs before the
     * values exist, so that sort used values which have since changed. Sparse indexes describe the order, so the
     * store follows them once they are there.
     *
     * The values are compared rather than tested for gaps, because generation overwrites a value a record arrived
     * with whenever a neighbour has one: what a record held before is no guide to whether the order still holds.
     *
     * Unlike the sort it corrects, this one runs *after* the store has announced the mutation, so it announces
     * itself. A caller which asked for silence owns the refresh, so silence is passed on.
     * @param {Core.data.Model[]} records The records the mutation added
     * @param {Number[]|null} previousValues Their sparse indexes from before generation, or `null` when the store
     * does not sort on add and nothing has to be compared
     * @param {Boolean} silent Pass the originating call's `silent`
     * @internal
     */
    reapplySortersAfterGeneration(records, previousValues, silent) {
        if (previousValues?.some((value, i) => records[i].sparseIndex !== value)) {
            this.sort(null, null, false, silent);
        }
    }

    add(records, silent = false, options = {}) {
        const
            me        = this,
            useSparse = me.useSparseIndex && !me.isTree,
            prev      = me.last,
            // Only `insert` records `meta.previousIndex`, so a rollback which read it here would see whatever a past
            // insert left on the record and splice an evicted record back in. Captured against this call instead
            priorState = useSparse ? me.captureSparseIndexState(records) : null,
            added      = super.add(records, silent, options);

        // TreeNode has its own handling of sparse index generation
        if (useSparse) {
            // Taken before generation, which overwrites a supplied value whenever a neighbour has one, so what a
            // record arrived with is no guide to whether the order still holds
            const previousValues = me.reappliesSortersOnGeneration ? added.map(record => record.sparseIndex) : null;

            try {
                me.addSparseIndexes(added, prev);
            }
            catch (error) {
                // A refusal puts the store back as it was, so there is nothing for a corrective sort to do
                me.rollbackSparseIndexAdd(added, silent, priorState);
                throw error;
            }

            me.reapplySortersAfterGeneration(added, previousValues, silent);
        }

        return added;
    }

    /**
     * Captures which of the passed records are already members, and the store's order, for a refused `add` or `insert`
     * to restore. Returns `null` when none of them is a member.
     * @param {Core.data.Model[]|Object[]} records The records the call was given
     * @returns {Object|null} The captured state for {@link #function-rollbackSparseIndexAdd}, or `null`
     * @internal
     */
    captureSparseIndexState(records) {
        const
            { storage } = this,
            members     = ArrayHelper.asArray(records).filter(record => record.isModel && storage.includes(record, true));

        return members.length
            ? {
                members        : new Set(members),
                values         : storage.allValues.slice(),
                filteredValues : storage.isFiltered ? storage.values.slice() : undefined,
                // `replaceValues` forgets which values were added, which positions the added records of a sorted,
                // filtered store
                addedValues    : storage.addedValues && new Set(storage.addedValues)
            }
            : null;
    }

    /**
     * Puts the store back as a refused `add` or `insert` found it: records which were not in it are evicted, and the
     * order of the records which were, unfiltered and visible, is restored as it was captured.
     * @param {Core.data.Model[]} added The records the call added
     * @param {Boolean} silent Pass the originating call's `silent`
     * @param {Object|null} priorState The state captured by {@link #function-captureSparseIndexState} before the call
     * @internal
     */
    rollbackSparseIndexAdd(added, silent, priorState) {
        const
            me    = this,
            evict = priorState ? added.filter(record => !priorState.members.has(record)) : added;

        // Silent, since StoreCRUD.remove lets a `beforeRemove` listener veto, which would fail the rollback itself.
        // `super` skips this mixin's own remove, which would null sparse indexes these records never received.
        if (evict.length) {
            super.remove(evict, true);
        }

        // The evicted records were not members when the state was captured, so it already leaves them out. Restored
        // in one step, since splicing records back by index moves them in the unfiltered order only
        if (priorState) {
            const { storage } = me;

            storage.replaceValues({
                values         : priorState.values,
                filteredValues : priorState.filteredValues,
                addedValues    : priorState.addedValues,
                silent         : true
            });

            // Record indexes are cached, and only a non silent change invalidates them
            me._idMap = null;
        }

        if (!silent) {
            // The add/insert announced records the store no longer holds, so the retraction is announced too
            if (evict.length) {
                me.trigger('remove', { records : evict, isMove : false });
                me.trigger('change', { action : 'remove', records : evict });
            }

            // The add/insert also announced records it relocated, which the silent restore above has moved back
            // without a word. Last, so views render the final order once the retraction has been processed. A
            // `batch` refresh, as `endBatch` fires, is the one which chained stores refill from
            if (priorState) {
                const { values : records } = me.storage;

                me.trigger('refresh', {
                    action : 'batch',
                    data   : records,
                    records
                });
            }
        }
    }

    /**
     * Wrapper for StoreCRUD.insert, adding sparse indexes to inserted records
     *
     * @param {Number} [index] The position at which to insert the records
     * @param {Core.data.Model[]|Object[]} [records] Records to insert
     * @param {Boolean} [silent=false] Specify true to suppress events
     * @returns {Core.data.Model[]} Inserted records
     * @internal
     */
    insert(index, records, silent = false) {
        const
            me        = this,
            // TreeNode has its own handling of sparse index generation
            useSparse = me.useSparseIndex && !me.isTree;

        let prev, next;

        // `index` is a visible (filtered) index: resolve `next` from the filtered collection, then `prev` from its
        // physical neighbor (respecting filtered-out records). Must be captured before super.insert() splices them in.
        if (useSparse) {
            const { allRecords } = me;

            next = me.storage.getAt(index);
            prev = next ? allRecords[allRecords.indexOf(next) - 1] : allRecords[allRecords.length - 1];
        }

        const
            priorState = useSparse ? me.captureSparseIndexState(records) : null,
            added      = super.insert(index, records, silent);

        if (useSparse && added) {
            const previousValues = me.reappliesSortersOnGeneration ? added.map(record => record.sparseIndex) : null;

            try {
                me.addSparseIndexes(added, prev, next);
            }
            catch (error) {
                me.rollbackSparseIndexAdd(added, silent, priorState);
                throw error;
            }

            me.reapplySortersAfterGeneration(added, previousValues, silent);
        }

        return added;
    }

    /**
     * Wrapper for StoreCRUD.remove, clearing sparse indexes on removed records
     *
     * @param {Core.data.Model[]|Object[]} records Records to remove
     * @param {Boolean} [silent=false] Specify `true` to suppress events
     * @returns {Core.data.Model[]} Removed records
     * @internal
     */
    remove(records, silent = false) {
        const removed = super.remove(records, silent);

        if (this.useSparseIndex) {
            removed.forEach(record => record.set('sparseIndex', null, silent));
        }

        return removed;
    }

    /**
     * Wrapper for StoreCRUD.move, adding sparse indexes to inserted records
     *
     * The generated sparse indexes are derived from the physical neighbors the records end up between, so they are only
     * meaningful when the storage is in sparse index order. The {@link Grid.feature.RowReorder} feature restores that
     * order before it moves the dropped records.
     *
     * A block which already sits in the gap between the records it ends up between is left untouched: no record is
     * dirtied and no `update` event fires.
     *
     * @param {Core.data.Model[]|Object[]} records Records to move
     * @param {Core.data.Model|Object|null} beforeRecord Record before which to insert the moved records
     * @param {Boolean} [silent=false] Specify `true` to suppress events
     * @returns {void}
     * @internal
     */
    move(records, beforeRecord, silent = false) {
        const
            me        = this,
            // TreeNode has its own handling of sparse index generation
            useSparse = me.useSparseIndex && !me.isTree;

        records = ArrayHelper.asArray(records);

        // Each moved record with the record it sat in front of, last first, so a refused move can put a block with
        // gaps back. Captured up front, since the move shifts leading records moved before themselves out of `records`
        const restore = [];

        if (useSparse && records.length) {
            const
                { allRecords } = me,
                moved          = new Set(records);

            for (let i = allRecords.length - 1; i >= 0; i--) {
                if (moved.has(allRecords[i])) {
                    restore.push([allRecords[i], allRecords[i + 1] ?? null]);
                }
            }
        }

        // Leading records which are moved before themselves are shifted out of the array
        super.move(records, beforeRecord, silent);

        if (useSparse && records.length) {
            let prev, next;

            if (me.isGrouped) {
                // Special rows are skipped because a group header carries no sparse index and cannot bound the block
                prev = me.getPrev(records[0], false, true);
                next = beforeRecord;
            }
            else {
                // The visible neighbors can have filtered out records between them, whose sparse indexes would then
                // collide with the ones generated below, so use the physical neighbors instead
                const
                    { allRecords } = me,
                    blockStart     = allRecords.indexOf(records[0]);

                prev = allRecords[blockStart - 1] ?? null;
                next = allRecords[blockStart + records.length] ?? null;
            }

            // A move asserts the caller's order, so the block is renumbered in full unless it already sits in the gap
            // between the neighbors resolved above
            if (!SparseIndexHelper.isPositionedBetween(records, prev?.sparseIndex, next?.sparseIndex)) {
                try {
                    me.addSparseIndexes(records, prev, next, silent, true, true);
                }
                catch (error) {
                    // A refused value is never written, so only the order goes back. One `super.move` per record, so
                    // events and a synced master store follow, last first so each anchor is already back in place
                    restore.forEach(([record, anchor]) => super.move(record, anchor, silent));
                    throw error;
                }
            }
        }
    }

    // endregion
};
