import Base from '../../Base.js';
import ObjectHelper from '../../helper/ObjectHelper.js';

/**
 * @module Core/data/mixin/StoreState
 */

/**
 * Mixin for Store that manages persisting and restoring store state (sorters, groupers, collapsed groups, and
 * serializable filters). Works together with the {@link Core.mixin.State} mixin and a {@link Core.state.StateProvider}
 * to automatically save and restore the store's sort/filter/group configuration.
 *
 * Persisted state includes:
 * - **sorters** - Active sort configurations
 * - **groupers** - Active grouping configurations
 * - **collapsedGroups** - Which groups are collapsed
 * - **filters** - Only serializable filters (those defined with `property` and `value`)
 *
 * ```javascript
 * // Store state is automatically saved/restored when the owning widget uses State mixin:
 * const grid = new Grid({
 *     stateId  : 'my-grid',
 *     stateful : ['store'], // Persist store state (sorters, filters, groupers)
 *     store    : myStore
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Core.mixin.State} - Widget-level state persistence mixin
 * - {@link Core.state.StateProvider} - Provider for state storage
 * - {@link Core.data.Store} - The main store class
 *
 * @mixin
 */
export default Target => class StoreState extends (Target || Base) {
    static $name = 'StoreState';

    /**
     * Get store state. Used by State-plugin to serialize state
     * @private
     * @returns {{ sorters, groupers }}
     */
    getState() {
        const
            { sorters, groupers, filters } = this,
            state                          = {};

        if (sorters?.length) {
            state.sorters = sorters.map(sorter => {
                const clone = ObjectHelper.cleanupProperties(ObjectHelper.clone(sorter));

                // Remove sorting fns
                delete clone.fn;
                delete clone.sortFn;

                return clone;
            });
        }

        if (groupers?.length) {
            state.groupers = groupers.map(grouper => {
                const clone = ObjectHelper.cleanupProperties(ObjectHelper.clone(grouper));

                // Remove grouping fns
                delete clone.fn;

                return clone;
            });

            state.collapsedGroups = [...this.collapsedGroups];
        }

        if (filters?.values.length) {
            state.filters = filters.allValues.map(filter => filter.getState());
        }

        return state;
    }

    /**
     * Apply store state. Used by State-plugin to restore a previously serialized state
     * @private
     * @param {{ sorters, groupers }} state
     */
    applyState(state) {
        const
            me = this,
            {
                sorters  = [],
                groupers = [],
                filters  = []
            } = state,
            { sortParamName } = me;

        // No need to perform sorting if we are not sorted, and no sorters provided
        if (me.isSorted || sorters.length !== 0 || groupers.length !== 0) {
            // We cannot apply sorters with a sortFn if we are doing server-side sorting
            me.sorters = sorters.filter(sorter => sorter.field || (sorter.sortFn && !sortParamName));

            // Ensure each grouper has an explicit ascending property, defaulting to true.
            // This prevents UI/data mismatch when state is restored without ascending property.
            // https://github.com/bryntum/bryntum/issues/10235
            me.groupers = groupers.map(grouper => ('ascending' in grouper) ? grouper : { ...grouper, ascending : true });

            if (groupers.length) {
                // This will also result in triggering sort so we don't need an extra call to sort
                me.group();
            }
            else {
                me.sort();
            }
        }

        // Collapsed groups need to be applied after the store is populated with data.
        // Store the pending collapsed groups and apply them when data is available.
        if (state.collapsedGroups?.length) {
            me._pendingCollapsedGroupsState = [...state.collapsedGroups];

            // Only need to listen for refresh if the pending collapsed groups are not applied yet
            if (!me.applyCollapsedGroupsState()) {
                me.ion({
                    name    : 'collapsedGroupsState',
                    refresh : 'applyCollapsedGroupsState',
                    thisObj : me
                });
            }
        }

        me.applyFilterState(filters);
    }

    /**
     * Apply the filter part of a store state, leaving sorters and groupers untouched
     * @private
     * @param {Object[]} filters
     */
    applyFilterState(filters = []) {
        const
            me                  = this,
            { filterParamName } = me;

        // No need to perform filtering if we are not filtered, and no filters provided
        if (me.isFiltered || filters.length !== 0) {
            // We cannot apply filters with a filterBy if we are doing server-side filtering
            // Since we now support nested filters we need to check children too, blocks if there is any child filter
            // not allowed
            const isAllowed = filter => filter.property || (filter.filterBy && !filterParamName) || filter.children?.every(isAllowed);
            me.filters = filters.filter(isAllowed);
            me.filter();
        }
    }

    applyCollapsedGroupsState() {
        const me = this;

        // Can only apply if store is grouped and has group records (meaning data is loaded)
        if (!me._pendingCollapsedGroupsState?.length || !me.isGrouped || !me.groupRecords?.count) {
            return false;
        }

        me._pendingCollapsedGroupsState.forEach((groupId) => {
            const record = me.getById(groupId);
            if (record) {
                me.collapse(record);
            }
        });

        me._pendingCollapsedGroupsState = null;
        me.detachListeners('collapsedGroupsState');
        return true;
    }
};
