import Base from '../../Base.js';
import ArrayHelper from '../../helper/ArrayHelper.js';
import StringHelper from '../../helper/StringHelper.js';
import WalkHelper from '../../helper/WalkHelper.js';
import Wbs from '../Wbs.js';

/**
 * @module Core/data/mixin/StoreTree
 */
const
    StopBranch  = Symbol('StopBranch'),
    nullKeyUUID = StringHelper.generateUUID(),
    // Generated parents are distinguished by `generatedParent`; everything else (leaves and preserved
    // non-leaf source records) sorts by the level field extractors so groupings inside a generated
    // parent stay ordered.
    defaultSort = (lhs, rhs, fields) => {
        const
            lhsSrc = !lhs.generatedParent,
            rhsSrc = !rhs.generatedParent;

        // If both records are either groups or sources (leaves / preserved)
        if (lhsSrc === rhsSrc) {
            // If they are source records, sort by comparing all "fields"
            if (lhsSrc) {
                let result;

                for (let i = 0; !result && i < fields.length; i++) {
                    const
                        lv = fields[i](lhs),
                        rv = fields[i](rhs);

                    // If a grouping callback returned StopBranch symbol
                    if (lv === StopBranch || rv === StopBranch) {
                        return lhs.isLeaf < rhs.isLeaf ? -1 : lhs.isLeaf > rhs.isLeaf ? 1 : 0;
                    }

                    result = lv < rv ? -1 : rv < lv ? 1 : 0;
                }

                return result;
            }
            // Sort branch nodes by their key values
            // Sort numbers in strings nicely
            else if (typeof lhs.key === 'string' && typeof rhs.key === 'string') {
                // Use natural numeric sorting in strings
                return lhs.key.localeCompare(rhs.key, undefined, { numeric : true });
            }
            else {
                return lhs.key < rhs.key ? -1 : lhs.key > rhs.key ? 1 : 0;
            }
        }
        else {
            // Match historical order: branches (now generated parents) before sources
            return lhsSrc < rhsSrc ? -1 : lhsSrc > rhsSrc ? 1 : 0;
        }
    },
    isLeaf = node => node.isLeaf;

/**
 * Mixin for store with tree related functionality. To learn more about working with tree nodes please see the
 * {@link Core/data/mixin/TreeNode} class and [this guide](#Core/guides/data/treedata.md).
 *
 * ## See also
 *
 * - {@link Core.data.mixin.TreeNode} - Node-level tree operations
 * - {@link Core.data.Store} - The main store class
 *
 * @mixin
 */
export default Target => class StoreTree extends (Target || Base) {
    static $name = 'StoreTree';

    /**
     * A special `Symbol` signalizing treeify method that the current record grouping should be stopped.
     *
     * ```javascript
     * const newRoot = workerStore.treeify([
     *     // group workers by company
     *     worker => {
     *         // if the worker is unemployed we don't put it in a group
     *         // we just show such record on the root level
     *         if (!worker.company) {
     *             return Store.StopBranch
     *         }
     *
     *         return worker.company;
     *     }
     * ]);
     * ```
     * @member {Symbol} StopBranch
     * @static
     * @category Advanced
     */
    static StopBranch = StopBranch;

    get StopBranch() {
        return StopBranch;
    }

    static configurable = {
        /**
         * Set to `true` to on load transform a flat dataset with raw objects containing `parentId` into the format
         * expected for tree data.
         *
         * Example input format:
         *
         * ```javascript
         * [
         *   { id : 1, name : 'Parent' },
         *   { id : 2, name : 'Child', parentId : 1 }
         * ]
         * ```
         *
         * Will be transformed into:
         *
         * ```javascript
         * [
         *   {
         *     id       : 1,
         *     name     : 'Parent',
         *     children : [
         *       { id : 2, name : 'Child', parentId : 1 }
         *     ]
         *   }
         * ]
         * ```
         *
         * @config {Boolean}
         * @category Tree
         */
        transformFlatData : null,

        /**
         * Set to `true` to fire a 'remove' event when moving a node (to mimic the behavior of versions < 6.0).
         * @config {Boolean}
         * @category Tree
         * @default
         */
        fireRemoveEventForMoveAction : false,

        /**
         * When set to `true`, restores the expanded states of tree nodes when reloading data.
         * @config {Boolean}
         * @default false
         */
        keepExpandedOnLoad : false
    };

    //region Getters

    /**
     * `true` if this Store is configured to handle tree data (with `tree : true`) or if this is a
     * {@link Core.data.Store#function-chain chained store} and the master store is a tree store.
     * @member {Boolean}
     * @readonly
     * @category Tree
     */
    get isTree() {
        return this.tree ?? (this.masterStore?.tree);
    }

    /**
     * Returns all leaf records in a tree store
     * @member {Core.data.Model[]}
     * @readonly
     * @category Tree
     */
    get leaves() {
        const result = [];

        if (this.isTree) {
            this.traverse(record => {
                if (record.isLeaf) {
                    result.push(record);
                }
            });
        }
        else {
            this.allRecords.forEach(r => {
                if (r.isLeaf) {
                    result.push(r);
                }
                r.traverse(record => {
                    if (record.isLeaf) {
                        result.push(record);
                    }
                }, true);
            });
        }
        return result;
    }

    //endregion

    //region Children

    /**
     * Loads children for a parent node that uses load on demand (when expanding it). Base implementation does nothing,
     * either use AjaxStore which implements it, create your own subclass with an implementation or listen for
     * `toggleNode` and insert records when you have them available.
     * @param {Core.data.Model} parentRecord
     * @returns {Promise} A Promise which will be resolved if the load succeeds, and rejected if the load is
     * vetoed by a {@link Core.data.AjaxStore#event-beforeLoadChildren} handler, or if an {@link Core.data.AjaxStore#event-exception} is detected.
     * The resolved function is passed the event object passed to any event handlers.
     * The rejected function is passed the {@link Core.data.AjaxStore#event-exception} event if an exception occurred,
     * or `false` if the load was vetoed by a {@link Core.data.AjaxStore#event-beforeLoadChildren} handler.
     * @category Tree
     */
    async loadChildren(parentRecord) {}

    /**
     * Called from Model when adding children. Not to be called directly, use Model#appendChild() instead.
     * @internal
     * @param {Core.data.mixin.TreeNode} parent
     * @param {Core.data.mixin.TreeNode[]} children
     * @param {Number} index
     * @param {Object} [isMove]
     * @param {Boolean} [silent]
     * @fires add
     * @fires Core.data.Store#event-change
     * @category Tree
     */
    onNodeAddChild(parent, children, index, isMove, silent = false) {
        const
            me                  = this,
            isRootLoad          = parent === me.rootNode && parent.isLoading,
            { storage }         = me,
            { previousSibling } = children[0];

        let storeInsertionPoint;

        const { visible : toAddToUI, all : toAdd } = me.collectDescendants(children, undefined, undefined, {
            inCollapsedBranch : !(parent.isExpanded(me) && parent.ancestorsExpanded(me)),
            applyFilter       : me.isFiltered && me.reapplyFilterOnAdd
        });

        // Keep CRUD caches up to date unless it's a root load
        if (!isRootLoad && toAdd.length) {
            for (const record of toAdd) {
                // Only considered an add if not modified or moved
                if (!me.modified.includes(record) && !isMove[record.id]) {
                    // If was removed, remove from `removed` list
                    if (me.removed.includes(record)) {
                        me.removed.remove(record);
                    }
                    // Else add to `added` list
                    else if (!record.isLinked) {
                        me.added.add(record);
                    }
                }
            }
        }

        // Root node inserted first
        if (isRootLoad && me.rootVisible) {
            toAddToUI.unshift(parent);
            toAdd.unshift(parent);
        }

        if (toAddToUI.length) {
            // Calculate the insertion point into the flat store.
            // If the new node is the first, then it goes after the parent node.
            if (index === 0 || !previousSibling) {
                storeInsertionPoint = storage.indexOf(parent);
            }
            // Otherwise it has to go after the previous visible node which has
            // to be calculated. See indexOfPreviousVisibleNode for explanation.
            else {
                storeInsertionPoint = storage.indexOf(previousSibling) + previousSibling.getDescendantCount(true, me);
            }

            // Insert added child nodes at correct location in storage.
            // We must not react to change - we fire the events here.
            storage.suspendEvents();
            me.storage.splice(++storeInsertionPoint, 0, toAddToUI);
            storage.resumeEvents();
            me._idMap = null;
        }
        else {
            // Since storage is not updated, need to invalidate allRecords
            me._allRecords = null;
        }

        // Since we do not pass through Store#onDataChange we have to handle relations manually here. And since they are
        // not tied to flat part of store, use all children
        me.updateDependentStores('add', children);

        // If it's a root level set data op, then signal 'dataset'
        if (isRootLoad) {
            // If we have initial sorters, perform a silent sort before triggering `dataset`
            // NOTE: Records in toAddToUI will be in the original order, not affected by the sort
            if (me.sorters.length) {
                me.sort(null, null, false, true);
            }

            me.afterLoadData?.();

            if (!silent) {
                const event = { action : 'dataset', data : me._data, records : toAddToUI };
                me.trigger('refresh', event);
                me.trigger('change', event);
            }
        }
        // Else, continue as before to signal an "isChild" add.
        else if (!silent) {
            const
                // When a refilter follows this add, views render on its `filter` event instead of on this one
                isRefiltering = Boolean(me.isFiltered && (me.stm?.isRestoringState || me.reapplyFilterOnAdd || children.some(record => isMove?.[record.id]))),
                event         = { action : 'add', parent, isChild : true, isMove, isRefiltering, records : children, allRecords : toAdd, index : storeInsertionPoint };
            me.trigger('add', event);
            me.trigger('change', event);

            // Check if any add is actually a move
            if (isMove && Object.values(isMove).some(wasMoved => wasMoved)) {
                const event = {
                    newParent  : parent,
                    records    : children.filter(record => isMove[record.id]),
                    oldParents : children.map(child => {
                        return me.getById(child.meta.oldParentId);
                    })
                };
                me.trigger('move', event);
            }
        }
    }

    onNodeRemoveChild(parent, children, index, flags = { isMove : false, silent : false, unfiltered : false }) {
        const
            me                             = this,
            { storage }                    = me,
            toRemoveFromUI                 = [],
            toRemove                       = [],
            { isMove, silent, unfiltered } = flags,
            removeUnfiltered               = unfiltered && me.isFiltered;

        me.collectDescendants(
            children,
            toRemoveFromUI,
            toRemove,
            { inCollapsedBranch : !(parent.isExpanded(me) && parent.ancestorsExpanded(me)), unfiltered : removeUnfiltered }
        );
        // test StoreTree.t.js should fail if the next line replaces the above line
        // me.collectDescendants(children, toRemoveFromUI, toRemove, { inCollapsedBranch : !(parent.isExpanded(me) && parent.ancestorsExpanded(me)) });

        if (!isMove) {
            // Unjoin is recursive, use flat children array
            for (const record of children) {
                record.unjoinStore(me);
            }

            // Keep CRUD caches up to date
            for (const record of toRemove) {
                // <remove-on-release>
                // TODO: remove this check as unjoinStore already checks (currently makes StoreTree.t.js fail)
                // </remove-on-release>
                if (record.stores.includes(me)) {
                    record.unjoinStore(me);
                }

                // If was newly added, remove from `added` list
                if (me.added.includes(record)) {
                    me.added.remove(record);
                }
                // Else add to `removed` list
                else if (!record.isLinked) {
                    me.removed.add(record);
                }
            }
            me.modified.remove(toRemove);
        }

        // Remove removed child nodes at correct location in storage
        if (toRemoveFromUI.length) {
            index = storage.indexOf(toRemoveFromUI[0]);
            // We must not react to change - we fire the events here.
            if (index > -1) {
                storage.suspendEvents();
                storage.splice(index, toRemoveFromUI.length);
                storage.resumeEvents();
                me._idMap = null;
            }
        }
        else {
            // If nothing is removed from UI (storage) return -1, showing that removed node was in a collapsed branch
            index = -1;
            // Since storage is not updated, need to invalidate allRecords
            me._allRecords = null;
        }

        if (!silent && (me.fireRemoveEventForMoveAction || !isMove)) {
            const event = {
                action     : 'remove',
                parent,
                isChild    : true,
                isMove,
                records    : children,
                allRecords : toRemove,
                index
            };
            me.trigger('remove', event);
            me.trigger('change', event);
        }

        return toRemove;
    }

    // IMPORTANT when using `applyFilter` option, should use the return value of this function
    // instead of relying on arguments mutation
    collectDescendants(node, visible = [], all = [], flags = {}) {
        const
            me = this,
            { inCollapsedBranch = false, unfiltered = false, applyFilter = false } = flags,
            children = Array.isArray(node) ? node : me.getChildren(node, unfiltered) ?? [];

        if (applyFilter) {
            return {
                visible : !inCollapsedBranch && children.flatMap(child => me.collectVisibleNodeDescendantsFiltered(child)),
                all     : children.concat(children.flatMap(child => child.allChildren))
            };
        }
        else {
            for (let i = 0, len = children.length, child; i < len; i++) {
                child = children[i];

                if (!inCollapsedBranch) {
                    visible.push(child);
                }

                all.push(child);

                me.collectDescendants(child, visible, all, {
                    inCollapsedBranch : inCollapsedBranch || !child.isExpanded(me),
                    unfiltered
                });
            }

            return { visible, all };
        }
    }

    collectVisibleNodeDescendantsFiltered(node) {
        const children = node.unfilteredOrChildren;

        if (!children || children.length === 0 || !node.isLeaf && !node.isExpanded(this)) {
            return this.filtersFunction(node) ? [node] : [];
        }

        const filteredChildren = children.flatMap(child => this.collectVisibleNodeDescendantsFiltered(child));

        return filteredChildren.length || this.filtersFunction(node)
            // Can't use spread operator here, since it will not work with large amount of records
            ? [node].concat(filteredChildren)
            : [];
    }

    /**
     * Returns the children of the passed branch node which this store owns. By default, this
     * is the entire `children` array.
     *
     * **If this store {@link Core.data.mixin.StoreChained#property-isChained}**, then
     * this returns only the subset of children which are filtered into this store by the
     * {@link Core.data.mixin.StoreChained#config-chainedFilterFn chainedFilterFn}.
     * @param {Core.data.Model} parent The node to return the children of.
     * @returns {Core.data.Model[]}
     * @category Tree
     */
    getChildren(parent, unfiltered = false) {
        const
            me       = this,
            chained  = me.isChained && !me.isChainedTree,
            children = ((unfiltered || chained) && parent.unfilteredChildren) || parent.children;

        return !children?.length ? Base.emptyArray : (
            chained
                // In case of chained store we need to apply chainedFilterFn and sorter
                ? children.filter(me.chainedFilterFn).sort(me.sorterFn)
                : children
        );
    }

    /**
     * Includes or excludes all records beneath parentRecord in storage. Used when expanding or collapsing
     * nodes.
     * @param {Core.data.Model|Object} parent Parent record
     * @param {Boolean} include Include (true) or exclude (false)
     * @returns {void}
     * @private
     * @category Tree
     */
    internalToggleTreeSubRecords(parent, include) {
        const
            me          = this,
            { storage } = me,
            index       = storage.indexOf(parent),
            children    = me.doIncludeExclude(me.getChildren(parent), include);

        // When expanded a parent node while being filtered, need to update the hidden flag of its children
        if (me.isFiltered && include && parent.unfilteredChildren) {
            me.updateChildrenHiddenState(parent);
        }

        // If we expanded a node which is yet to load children, the collected children
        // array will be empty, so do not broadcast any change event.
        // If we are collapsing a record which isn't visible (because parent is collapsed) we won't get an index,
        // which is fine since it is already removed from processedRecords
        if (children.length && index !== false) {
            // We must not react to change - we fire the events here with a flag
            // to tell responders that it's due to an expand or collapse.
            storage.suspendEvents();

            if (include) {
                storage.splice(index + 1, 0, children);

                const event = { action : 'add', isExpand : true, parent, records : children, index : index + 1 };
                me.trigger('add', event);
                me.trigger('change', event);
            }
            else {
                // Assumes storage still holds the parent's children contiguously after index; a rebuild
                // (e.g. filter reapply) since index was located would splice out the wrong records (#11680).
                storage.splice(index + 1, children.length);

                const event = { action : 'remove', isCollapse : true, parent, records : children, index : index + 1 };
                me.trigger('remove', event);
                me.trigger('change', event);
            }
            storage.resumeEvents();
            me._idMap = null;
        }
    }

    // Updates the hidden flag of its children while store is filtered
    updateChildrenHiddenState(parentRecord) {
        parentRecord.unfilteredChildren?.forEach(child => {
            child.instanceMeta(this.id).hidden = false;

            if (!child.isLeaf) {
                this.updateChildrenHiddenState(child);
            }
        });
    }

    doIncludeExclude(children, include, result = []) {
        const
            me         = this,
            childCount = children?.length || 0;

        for (let i = 0; i < childCount; i++) {
            const child = children[i];

            // Only consider child nodes who we own.
            // If we are a chained store, skip nodes that are not ours.
            if (!me.isChained || me.chainedFilterFn(child)) {
                const mapMeta = child.instanceMeta(me.id);

                if (include || !mapMeta.hidden) {
                    // if including sub-records, add those who are not hidden by a collapsed sub parent
                    result.push(child);
                }
                mapMeta.hidden = !include;

                if (child.isExpanded(me)) {
                    me.doIncludeExclude(me.getChildren(child), include, result);
                }
            }
        }
        return result;
    }

    // We must react if the underlying data is changed
    onModelChange(record, toSet, wasSet, ...args) {
        if (wasSet.expanded) {
            this.toggleCollapse(record, !wasSet.expanded.value);
        }
        super.onModelChange?.(record, toSet, wasSet, ...args);
    }

    /**
     * Collapse an expanded record or expand a collapsed. Optionally forcing a certain state.
     * @param {String|Number|Core.data.Model} idOrRecord Record (the record itself) or id of a record to toggle
     * @param {Boolean} [collapse] Force collapse (true) or expand (false)
     * @category Tree
     */
    async toggleCollapse(idOrRecord, collapse) {
        const
            me     = this,
            record = me.getById(idOrRecord),
            meta   = record.instanceMeta(me);

        if (collapse === undefined) {
            collapse = !meta.collapsed;
        }

        // Reject if we're in the middle of loading children, or it's a leaf, or it's a no-op
        if (!meta.isLoadingChildren && !record.isLeaf && record.isExpanded(me) === collapse) {
            me.trigger('beforeToggleNode', { record, collapse });

            record.setCollapsed(me, collapse);

            if (collapse) {
                me.onNodeCollapse(record);
                return true;
            }
            else {
                me.onNodeExpand(record);
                let success = true;

                // Children not yet loaded, ask store for them.
                // It will append them. Appending to a node which
                // is expanded will insert the children into the UI.
                if (!record.isLoaded) {
                    meta.isLoadingChildren = true;

                    try {
                        await me.loadChildren(record);
                    }
                    catch (exception) {
                        // Revert to being collapsed
                        record.setCollapsed(me, true);
                        success = false;
                        me.trigger('loadChildrenException', { record, exception });
                    }
                    finally {
                        meta.isLoadingChildren = false;
                    }
                }
                return success;
            }
        }
    }

    /**
     * Remove all records beneath parentRecord from storage.
     * @param {Core.data.Model|Object} parentRecord Parent record
     * @returns {void}
     * @private
     * @category Tree
     */
    onNodeCollapse(parentRecord) {
        // We don't care about collapse if it's inside a collapsed subtree
        if (parentRecord.ancestorsExpanded(this)) {
            return this.internalToggleTreeSubRecords(parentRecord, false);
        }
    }

    /**
     * Add all records beneath parentRecord from storage.
     * @param {Core.data.Model|Object} parentRecord Parent record
     * @returns {void}
     * @private
     * @category Tree
     */
    onNodeExpand(parentRecord) {
        // We don't care about expand if it's inside a collapsed subtree
        if (parentRecord.ancestorsExpanded(this)) {
            return this.internalToggleTreeSubRecords(parentRecord, true);
        }
    }

    //endregion

    //region Transform flat data

    /**
     * Transforms flat data containing parent ids into tree data
     * @param {Object[]} data Flat raw data
     * @returns {Object[]} Tree data
     * @private
     */
    transformToTree(data) {
        const
            {
                parentIdField,
                idField,
                childrenField
            }                = this.modelClass,
            parentIdDataProp = this.modelClass.fieldMap[parentIdField]?.dataSource || 'parentId',
            indexById        = new Map(),
            parentIds        = new Set(),
            transformed      = [];

        // build an index of all nodes, to avoid quadratic complexity
        for (const node of data) {
            const id = node?.[idField];

            if (id != null) {
                indexById.set(id, node);
            }
        }

        // clone the parent, to avoid data mutation
        // https://github.com/bryntum/bryntum/issues/4869
        const cloneParent = node => {
            const clone = { ...node };

            clone[childrenField] = [];

            indexById.set(clone[idField], clone);

            // So we know that it is cloned
            parentIds.add(node[idField]);

            return clone;
        };

        for (let node of data) {
            if (node) {
                const nodeId = node[idField];

                // `node` can be both child and parent - need to clone it as soon as possible
                // unless it's already been cloned
                if (parentIds.has(nodeId)) {
                    node = indexById.get(nodeId); // NOSONAR: Intentionally assigning the already cloned node
                }
                else {
                    node = cloneParent(node); // NOSONAR: Intentionally assigning the cloned node
                }

                const parentId = node[parentIdDataProp];

                // Child, find parent
                if (parentId != null) {
                    let parent = indexById.get(parentId);

                    // Parent found, add node as child of it
                    if (parent) {
                        if (!parent[childrenField]) {
                            parent = cloneParent(parent);
                        }

                        parent[childrenField].push(node);
                    }
                }
                // parent - clone if needed (might be already cloned) and push to transformed
                // already cloned, push as is
                else if (node[childrenField]) {
                    transformed.push(node);
                }
                // not cloned, clone and push
                else if (node[idField] != null) {
                    transformed.push(cloneParent(node));
                }
                else {
                    transformed.push(node);
                }
            }
        }

        indexById.forEach(parent => {
            // Only sort if node actually has children
            if (parent[childrenField]?.length > 0) {
                parent[childrenField].sort((child1, child2) => child1.parentIndex - child2.parentIndex);
            }
            // When transforming to tree, we treat every node as a parent initially because we don't want to
            // iterate over all the data to get the parents which could be costly. When converting a node to a
            // parent, it gets children : [] for leaf nodes as well which is not expected. So we are intentionally
            // deleting the empty children array from leaf nodes to make sure they are treated as leafs
            else if (parent[childrenField]?.length === 0) {
                delete parent[childrenField];
            }
        });
        return transformed;
    }

    /**
     * Transforms passed data into a tree with parent levels based on supplied fields.
     *
     * ```javascript
     * const newRoot = store.treeify(
     *     [
     *         { name : "Julia", age : 21 },
     *         { name : "Macie", age : 12 },
     *         { name : "Julia", age : 18 },
     *         { name : "Olivia", age : 8 },
     *     ],
     *     ['name', r => r.age % 10]
     * );
     * ```
     *
     * Generated parent records are indicated with `generatedParent` and `key` properties. The first one is set to
     * `true` and the latter one has a value for the group the parent represents.
     *
     * @param {Array<String|Function>} fields The field names, or a function to call to extract a value to create parent
     * nodes for records with the same value.
     * @param {Function} [parentTransform] A function which is called to allow the caller to transform the raw data
     * object of any newly created parent nodes.
     * @param {Boolean} [convertParents] Pass `true` to convert raw new parent data objects to this Store's
     * {@link Core.data.Store#config-modelClass}.
     * @privateparam {Function} [valueFormatter] A function which is called to allow the caller to format the raw data
     * before grouping
     * @privateparam {Function} [parentSortFn] A function which is called to allow the caller to sort the generated
     * parent nodes after grouping them
     * @privateparam {Function} [isSource] Predicate identifying which records are the "atoms" that grouping operates
     * on. Defaults to `n => n.isLeaf`. Records returning `true` are treated as opaque (the walker does not descend
     * into them), letting callers preserve a sub-tree below each source record.
     * @privateparam {Function} [cloneSource] A function which is called when a source record belongs to multiple
     * groups (array group values) to produce the extra membership. Defaults to `n => n.link()`. Lets callers
     * replicate state that a plain link does not carry, such as a preserved sub-tree.
     * @returns {Core.data.Model} New root node
     * @internal
     */
    treeifyData(data, fields, parentTransform, convertParents = false, valueFormatter = null, parentSortFn = null, isSource = isLeaf, cloneSource = null) {
        const
            { length } = fields,
            parents    = [],
            orphans    = [],
            newRoot    = {};

        let i, lastParents;

        // New branch nodes are ID'd by their field values concatenated into
        // string form.
        //
        // The key value that was used to create them is their "key" property.
        //
        // rootNode : {
        //    children : [{
        //        id       : 'p1',
        //        name     : 'Parent 1',
        //        expanded : true,
        //        children : [
        //            { id : 700, name : 'Task 700', startDate : '2021-11-26', duration : 3, percentDone : 20 },
        //            { id : 500, name : 'Task 500', startDate : '2021-11-22', duration : 5, percentDone : 20 },
        //            { id : 300, name : 'Task 300', startDate : '2021-11-24', duration : 3, percentDone : 10 },
        //            { id : 100, name : 'Task 100', startDate : '2021-11-22', duration : 5, percentDone : 10 }
        //       ]
        //    },
        //    {
        //        id       : 'p2',
        //        name     : 'Parent 2',
        //        expanded : true,
        //        children : [
        //            { id : 600, name : 'Task 600', startDate : '2021-11-22', duration : 6, percentDone : 20 },
        //            { id : 800, name : 'Task 800', startDate : '2021-11-26', duration : 2, percentDone : 20 },
        //            { id : 400, name : 'Task 400', startDate : '2021-11-24', duration : 2, percentDone : 10 },
        //            { id : 200, name : 'Task 200', startDate : '2021-11-22', duration : 6, percentDone : 10 }
        //        ]
        //    }]
        // }
        //
        // Becomes the following. Note that all records are sorted into ascending
        // order of their field values:
        //
        // rootNode : {
        //    children : [{
        //        id       : '10',
        //        key      : 10,
        //        expanded : true,
        //        children : [
        //            {
        //                id       : '10Mon Nov 22 2021 00:00:00 GMT+0100 (Central European Standard Time)',
        //                key      : new Date(2021, 10, 22),
        //                expanded : true,
        //                children : [
        //                    { id : 100, name : 'Task 100', startDate : '2021-11-22', duration : 5, percentDone : 10 },
        //                    { id : 200, name : 'Task 200', startDate : '2021-11-22', duration : 6, percentDone : 10 }
        //                ]
        //            },
        //            {
        //                id       : '10Wed Nov 24 2021 00:00:00 GMT+0100 (Central European Standard Time)',
        //                key      : new Date(2021, 10, 24),
        //                expanded : true,
        //                children : [
        //                    { id : 300, name : 'Task 300', startDate : '2021-11-24', duration : 3, percentDone : 10 },
        //                    { id : 400, name : 'Task 400', startDate : '2021-11-24', duration : 2, percentDone : 10 }
        //                ]
        //            }
        //        ]
        //    },
        //    {
        //        id       : '20',
        //        key      : 20,
        //        expanded : true,
        //        children : [
        //            {
        //                id       : '20Mon Nov 22 2021 00:00:00 GMT+0100 (Central European Standard Time)',
        //                key      : new Date(2021, 10, 22),
        //                expanded : true,
        //                children : [
        //                    { id : 500, name : 'Task 500', startDate : '2021-11-22', duration : 5, percentDone : 20 },
        //                    { id : 600, name : 'Task 600', startDate : '2021-11-22', duration : 6, percentDone : 20 }
        //                ]
        //            },
        //            {
        //                id       : '20Fri Nov 26 2021 00:00:00 GMT+0100 (Central European Standard Time)',
        //                key      : new Date(2021, 10, 26),
        //                expanded : true,
        //                children : [
        //                    { id : 700, name : 'Task 700', startDate : '2021-11-26', duration : 3, percentDone : 20 },
        //                    { id : 800, name : 'Task 800', startDate : '2021-11-26', duration : 2, percentDone : 20 }
        //                ]
        //            }
        //        ]
        //    }]
        // }
        //

        // Convert field definitions to a function which extracts the field
        // for a simpler field value extraction.
        for (i = 0; i < length; i++) {
            let field = fields[i];
            field = field.field || field;

            if (!fields[i].call) {
                fields[i] = n => n[field];
                fields[i].fieldName = field;
            }
            parents[i] = new Map();
        }

        // this.rootNode.traverse(n => {
        // Halt descent at source records — they are the atoms to be grouped, and their original children
        // (if any) are preserved as a sub-tree by the caller (TreeGroup).
        WalkHelper.preWalkWithParent({ isRoot : true, id : this.rootNode.id, children : data }, n => (n.isRoot || !isSource(n)) ? n.children : null, (parent, n) => {

            lastParents = [];

            if (!n.isRoot && isSource(n)) {
                for (i = 0; i < length; i++) {
                    const
                        field      = fields[i],
                        fieldValue = valueFormatter ? valueFormatter(field(n), field.fieldName) : field(n),
                        nodeMap    = parents[i],
                        key        = fieldValue === '' ? nullKeyUUID : fieldValue,
                        keys       = ArrayHelper.asArray(key) || [nullKeyUUID],
                        newParents = [];

                    // Break if level function has requested to skip further groups building for this record
                    if (keys[0] === StopBranch) {
                        break;
                    }

                    // in the beginning we need to iterate once, even with empty `lastParents`
                    const lastParentsToIterate = lastParents.length > 0 ? lastParents : [null];

                    lastParentsToIterate.forEach(lastParent => {
                        // Allow multiple group membership if the key is an array.
                        // Multiple parents can result from this, and the current node
                        // (or a link to it) must be added to them all.
                        for (let j = 0, { length } = keys; j < length; j++) {
                            const
                                key    = keys[j],
                                path   = `${(lastParent?.path ?? '') + (key?.isModel ? key.id : key)}/`,
                                id     = StringHelper.makeValidDomId(`generated_${path}`, '_'),
                                parent = nodeMap.get(id) || (nodeMap.set(id, {
                                    id,
                                    key             : keys[j] === nullKeyUUID ? '' : key,
                                    path,
                                    readOnly        : true,
                                    children        : [],
                                    generatedParent : true,
                                    field           : field.fieldName,
                                    firstGroupChild : n
                                })).get(id);

                            newParents.push(parent);

                            if (lastParent && !lastParent.children.includes(parent)) {
                                lastParent.children.push(parent);
                            }
                        }
                    });

                    lastParents = newParents;
                }

                if (lastParents.length) {
                    lastParents.forEach((lastParent, j) => lastParent.children.push(j ? (cloneSource ? cloneSource(n) : n.link()) : n));
                }
                else {
                    orphans.push(n);
                }
            }
        }, true);

        // Call the optional transformer, and if we are configured to do so,
        // convert the new branches into TreeNodes.
        if (parentTransform || convertParents) {
            parents.forEach(p => p.forEach((p, id, map) => {
                parentTransform?.(p);

                if (convertParents) {
                    p = this.createRecord(p);
                    map.set(id, p);
                }
            }));
        }

        newRoot.children = [...parents[0].values(), ...orphans];

        const defaultSortFn = (lhs, rhs) => defaultSort(lhs, rhs, fields);

        // Cascade a sort down so that all "groups" are in order. Descent stops at source records — their
        // preserved sub-trees (when the caller passes an `isSource` selecting non-leaf records) keep their
        // original order.
        const sort = (n) => {
            if (n.children) {
                // Only use the custom sort on generated parents, never on source records
                const useParentSort = parentSortFn && n.children[0]?.generatedParent;

                n.children.sort(useParentSort ? parentSortFn : defaultSortFn);

                n.children.forEach(child => child.generatedParent && sort(child));
            }
        };
        sort(newRoot);

        return newRoot;
    }

    /**
     * Transforms this store data into a tree with parent levels based on supplied fields.
     *
     * ```javascript
     * const newRoot = store.treeify(['name', r => r.age % 10]);
     * ```
     *
     * Generated parent records are indicated with `generatedParent` and `key` properties. The first one is set to
     * `true` and the latter one has a value for the group the parent represents.
     *
     * @param {Array<String|Function>} fields The field names, or a function to call to extract a value to create parent
     * nodes for records with the same value.
     * @param {Function} [parentTransform] A function which is called to allow the caller to transform the raw data
     * object of any newly created parent nodes.
     * @param {Boolean} [convertParents] Pass `true` to convert raw new parent data objects to this Store's
     * {@link Core.data.Store#config-modelClass}.
     * @privateparam {Function} [valueFormatter] A function which is called to allow the caller to format the raw data
     * before grouping
     * @returns {Core.data.Model} New root node
     * @internal
     */
    treeify(fields, parentTransform, convertParents = false, valueFormatter = null) {
        return this.treeifyData(this.rootNode.children, fields, parentTransform, convertParents, valueFormatter);
    }

    //endregion

    treeifyFlatData(data) {
        const
            { childrenField, parentIdField } = this.modelClass,
            parentIdDataProp = this.modelClass.fieldMap[parentIdField]?.dataSource || 'parentId';

        let hasParentId     = false,
            shouldTransform = true;

        // Configured to transform flat data into tree data, make sure that we have:
        // - raw data without children defined
        // - parentIds
        for (const node of data) {
            if (node?.isModel || Array.isArray(node?.[childrenField])) {
                shouldTransform = false;
                break;
            }

            if (node?.[parentIdDataProp] != null) {
                hasParentId = true;
            }
        }

        if (shouldTransform && hasParentId) {
            data = this.transformToTree(data);
        }

        return data;
    }

    /**
     * Increase the indentation level of one or more nodes in the tree
     * @param {Core.data.Model|Core.data.Model[]} nodes The nodes to indent.
     * @fires indent
     * @fires Core.data.Store#event-change
     * @category Tree
     * @non-lazy-load
     */
    async indent(nodes) {
        const me = this;

        nodes = Array.isArray(nodes) ? nodes : [nodes];

        // 2. Filtering out all nodes which parents are also to be indented as well as the ones having no previous
        //    sibling since such nodes can't be indented
        nodes = nodes.filter(node => {
            let result = Boolean(node.previousSibling);

            while (result && !node.isRoot) {
                result = !nodes.includes(node.parent);
                node   = node.parent;
            }

            return result;
        });

        /**
         * Fired before nodes in the tree are indented. Return `false` from a listener to prevent the indent.
         * @event beforeIndent
         * @preventable
         * @param {Core.data.Store} source The
         * @ts-param source {Core.data.Store|any}
         * @param {Core.data.Model[]} records The nodes to indent.
         * @ts-param records {Array<Core.data.Model|any>}
         */
        if (nodes.length && me.trigger('beforeIndent', { records : nodes }) !== false) {
            // announce we start indenting
            me.trigger('indentStart', { records : nodes });

            // 3. Sorting nodes into tree walk order
            nodes.sort((lhs, rhs) => Wbs.compare(lhs.wbsCode, rhs.wbsCode));

            // No events should go to the UI until we have finished the operation successfully
            me.beginBatch();

            // Ask the project to try the indent operation
            for (const node of nodes) {
                const newParent = node.previousSibling;
                newParent.appendChild(node);
                me.toggleCollapse(newParent, false);
            }

            // Now show the successful result
            me.endBatch();

            /**
             * Fired after tasks in the tree are indented
             * @event indent
             * @param {Core.data.Store} source The store
             * @ts-param source {Core.data.Store|any}
             * @param {Core.data.Model[]} records Nodes that were indented
             * @ts-param records {Array<Core.data.Model|any>}
             */
            me.trigger('indent', { records : nodes });
            me.trigger('change', {
                action  : 'indent',
                records : nodes
            });
        }
    }

    /**
     * Decrease the indentation level of one or more nodes in the tree
     * @param {Core.data.Model|Core.data.Model[]} nodes The nodes to outdent.
     * @fires outdent
     * @fires Core.data.Store#event-change
     * @category Tree
     * @non-lazy-load
     */
    async outdent(nodes) {
        const me = this;

        nodes = Array.isArray(nodes) ? nodes : [nodes];

        // 2. Filtering out all nodes which parents are also to be outdented as well as the ones having no previous sibling
        //    since such nodes can't be indented
        nodes = nodes.filter(node => {
            const { parent } = node;
            let result       = parent && !parent.isRoot;

            while (result && !node.isRoot) {
                result = !nodes.includes(parent);
                node   = node.parent;
            }

            return result;
        });

        /**
         * Fired before nodes in the tree are outdented. Return `false` from a listener to prevent the outdent.
         * @event beforeOutdent
         * @preventable
         * @param {Core.data.Store} source This store
         * @ts-param source {Core.data.Store|any}
         * @param {Core.data.Model[]} records Nodes to be outdented
         * @ts-param records {Array<Core.data.Model|any>}
         */
        if (nodes.length && me.trigger('beforeOutdent', { records : nodes }) !== false) {
            // 3. Sorting nodes into reverse tree walk order
            nodes.sort((lhs, rhs) => Wbs.compare(lhs.wbsCode, rhs.wbsCode));

            // No events should go to the UI until we have finished the operation successfully
            me.beginBatch();

            for (const node of nodes) {
                const
                    { parent }  = node,
                    newChildren = parent.children.slice(parent.children.indexOf(node) + 1);

                parent.parent.insertChild(node, parent.nextSibling);

                // https://github.com/bryntum/bryntum/issues/12934
                // newChildren might be empty when outdenting the only existing child node
                if (newChildren.length) {
                    node.appendChild(newChildren);
                    me.toggleCollapse(node, false);
                }
            }

            me.endBatch();

            /**
             * Fired after tasks in the tree are outdented
             * @event outdent
             * @param {Core.data.Store} source The store
             * @ts-param source {Core.data.Store|any}
             * @param {Core.data.Model[]} records Nodes that were outdented
             * @ts-param records {Array<Core.data.Model|any>}
             */
            me.trigger('outdent', { records : nodes });
            me.trigger('change', {
                action  : 'outdent',
                records : nodes
            });
        }
    }
};
