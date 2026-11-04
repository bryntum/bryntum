/**
 * @tier community
 */

// <remove-on-release>
// TODO: Consider basing on visible row count
// </remove-on-release>
const
    ROWS_PER_CELL     = 25,
    // Store actions that also fire refresh, which resets the cache. Invalidating on their change (mostly fired after
    // refresh) would flag the next cache as invalid before it is built
    REFRESHED_ACTIONS = new Set(['filter', 'dataset', 'group', 'clearchanges']);

// Mixin that handles the dependency grid cache
//
// Grid cache explainer
// ────────────────────
// The purpose of the grid cache is to reduce the amount of dependencies we have to iterate over when drawing by
// partitioning them into a virtual grid. With for example 10k deps we would have to iterate over all 10k on
// each draw since any of them might be intersecting the view.
//
// The cells are horizontally based on ticks (50 per cell) and vertically on rows (also 50 per cell. Each cell
// lists which dependencies intersect it. When drawing we only have to iterate over the dependencies for the
// cells that intersect the viewport.
//
// The grid cache is populated when dependencies are drawn. Any change to deps or resources clears the cache, as do
// most changes to events and assignments. Updated events and assignments are handled incrementally, only their
// dependencies are removed from the cache and cached again on next draw.
//
// The dependency drawn below will be included in the set that is considered for drawing if tickCell 0 or
// tickCell 1 and rowCell 0 intersects the current view (it is thus represented twice in the grid cache)
//
//       tickCell 0           tickCell 1
//       tick 0-49            tick 50-99
//    ┌────────────────────┬─────────────────────┐
// r r│0,0                 │1,0                  │
// o o│     │              │                     │
// w w│     │     !!!!!!!!!│!!!!!!!!!!!          │
// C  │     │     ! View   │          !          │
// e 0│     │     ! port   │          !          │
// l -│     │     !        │          !          │
// l 4│     └─────!────────┼──────────!────►     │
// 0 9│           !        │          !          │
//    ├────────────────────┼─────────────────────┤
// r r│0,1        !        │1,1       !          │
// o o│           !        │          !          │
// w w│           !!!!!!!!!│!!!!!!!!!!!          │
// C  │                    │                     │
// e 5│                    │                     │
// l 0│                    │                     │
// l -│                    │                     │
// 1 9│                    │                     │
//   9└────────────────────┴─────────────────────┘
//               uoᴉʇɐɹʇsnꞁꞁᴉ əɥɔɐɔ pᴉɹ⅁
export default Target => class DependencyGridCache extends Target {
    static $name = 'DependencyGridCache';

    gridCache = null;

    static get properties() {
        return {
            // Updated events (and events of updated assignments), their dependencies are re-cached on next draw
            eventsToRecache  : new Set(),
            // Set when a change that cannot be handled incrementally happened, cache is then rebuilt after the commit
            gridCacheInvalid : false
        };
    }

    // True if the cache can be kept, updating it incrementally. Row indices are cached, rows being added or removed
    // (for example when collapsing groups) requires rebuilding it
    get isGridCacheValid() {
        const me = this;

        return Boolean(me.gridCache) && !me.gridCacheInvalid && me.rowStore.count === me.gridCacheRowCount;
    }

    // Dependencies that might intersect the current viewport and thus should be considered for drawing
    getDependenciesToConsider(startMS, endMS, startIndex, endIndex) {
        const
            me            = this,
            { gridCache } = me,
            { timeAxis }  = me.client;

        if (gridCache) {
            if (me.eventsToRecache.size) {
                me.recacheDependencies();
            }

            const
                dependencies = new Set(),
                fromMSCell   = Math.floor((startMS - timeAxis.startMS) / me.MS_PER_CELL),
                toMSCell     = Math.floor((endMS - timeAxis.startMS) / me.MS_PER_CELL),
                fromRowCell  = Math.floor(startIndex / ROWS_PER_CELL),
                toRowCell    = Math.floor(endIndex / ROWS_PER_CELL);

            for (let i = fromMSCell; i <= toMSCell; i++) {
                const msCell = gridCache[i];
                if (msCell) {
                    for (let j = fromRowCell; j <= toRowCell; j++) {
                        const intersectingDependencies = msCell[j];
                        if (intersectingDependencies) {
                            for (let i = 0; i < intersectingDependencies.length; i++) {
                                dependencies.add(intersectingDependencies[i]);
                            }
                        }
                    }
                }
            }

            return dependencies;
        }
    }

    // A (single) dependency was drawn, we might want to store info about it in the grid cache
    afterDrawDependency(dependency, fromIndex, toIndex, fromDateMS, toDateMS) {
        const me = this;

        if (me.constructGridCache) {
            const
                { MS_PER_CELL } = me,
                {
                    startMS : timeAxisStartMS,
                    endMS   : timeAxisEndMS
                }               = me.client.timeAxis,
                timeAxisCells   = Math.ceil((timeAxisEndMS - timeAxisStartMS) / MS_PER_CELL),
                fromMSCell      = Math.floor((fromDateMS - timeAxisStartMS) / MS_PER_CELL),
                toMSCell        = Math.floor((toDateMS - timeAxisStartMS) / MS_PER_CELL),
                fromRowCell     = Math.floor(fromIndex / ROWS_PER_CELL),
                toRowCell       = Math.floor(toIndex / ROWS_PER_CELL),
                firstMSCell     = Math.min(fromMSCell, toMSCell),
                lastMSCell      = Math.max(fromMSCell, toMSCell),
                firstRowCell    = Math.min(fromRowCell, toRowCell),
                lastRowCell     = Math.max(fromRowCell, toRowCell);

            // Ignore dependencies fully outside of the time axis
            if ((firstMSCell < 0 && lastMSCell < 0) || (firstMSCell > timeAxisCells && lastMSCell > timeAxisCells)) {
                return;
            }

            // Cache from time axis start, to time axis end ("cropping" deps starting or ending outside)
            const
                startMSCell = Math.max(firstMSCell, 0),
                endMSCell   = Math.min(lastMSCell, timeAxisCells);

            for (let i = startMSCell; i <= endMSCell; i++) {
                const msCell = me.gridCache[i] ?? (me.gridCache[i] = {});
                for (let j = firstRowCell; j <= lastRowCell; j++) {
                    const rowCell = msCell[j] ?? (msCell[j] = []);
                    rowCell.push(dependency);
                }
            }
        }
    }

    // All dependencies are about to be drawn, check if we need to build the grid cache
    beforeDraw() {
        const me = this;

        if (!me.gridCache) {
            const { visibleDateRange } = me.client;

            me.constructGridCache = true;

            // Adjust number of ms used in grid cache to match viewport
            me.MS_PER_CELL = Math.max(visibleDateRange.endMS - visibleDateRange.startMS, 1000);

            // Start with empty cache, will be populated as deps are drawn
            me.gridCache = {};

            // Rows being added or removed invalidates the cache, see isGridCacheValid
            me.gridCacheRowCount = me.rowStore.count;
        }
    }

    // All dependencies are drawn, we no longer need to rebuild the cache
    afterDraw() {
        this.constructGridCache = false;
    }

    onEventStoreChange({ action, record }) {
        if (action === 'update') {
            this.invalidateEvents([record]);
        }
        else if (!REFRESHED_ACTIONS.has(action)) {
            this.invalidateGridCache();
        }
    }

    onAssignmentStoreChange({ action, record, records = [record], changes }) {
        if ((action === 'add' || action === 'remove' || action === 'update') && !changes?.event && !changes?.eventId) {
            this.invalidateEvents(records.map(assignment => assignment.event));
        }
        // Other actions, or an assignment moved to another event (the previous event is not known)
        else if (!REFRESHED_ACTIONS.has(action)) {
            this.invalidateGridCache();
        }
    }

    // A change that cannot be handled incrementally, the cache is rebuilt after the commit. No point in re-caching
    // queued events until then
    invalidateGridCache() {
        this.gridCacheInvalid = true;
        this.eventsToRecache.clear();
    }

    // Queue updated events to have their dependencies re-cached on next draw. Their dependencies are not read here,
    // reading them during a commit might trigger calculations in the engine
    invalidateEvents(events) {
        if (this.gridCache && !this.gridCacheInvalid) {
            for (const event of events) {
                // Missing or removed event (assignments of removed events are removed after the event), cannot tell
                // which dependencies are affected
                if (!event?.project) {
                    this.invalidateGridCache();
                    return;
                }

                this.eventsToRecache.add(event);
            }
        }
    }

    // Remove dependencies of queued events from the cache and cache them again by drawing them, instead of rebuilding
    // the cache
    recacheDependencies() {
        const
            me                  = this,
            { eventsToRecache } = me,
            dependencies        = new Set();

        for (const event of eventsToRecache) {
            for (const dependency of event.dependencies) {
                dependencies.add(dependency);
            }
        }

        eventsToRecache.clear();

        for (const msCell of Object.values(me.gridCache)) {
            for (const rowCell of Object.values(msCell)) {
                let kept = 0;

                for (let i = 0; i < rowCell.length; i++) {
                    if (!dependencies.has(rowCell[i])) {
                        rowCell[kept++] = rowCell[i];
                    }
                }

                rowCell.length = kept;
            }
        }

        me.constructGridCache = true;

        for (const dependency of dependencies) {
            if (me.isDependencyToConsider(dependency)) {
                me.drawDependency(dependency, true);
            }
        }

        me.constructGridCache = false;

        // Only drawn to be cached, those in view are drawn again in the order they are considered (Gantt draws critical
        // dependencies last, to be on top)
        me.clearDomConfigs();
    }

    reset() {
        this.gridCache = null;
        this.gridCacheInvalid = false;
        this.eventsToRecache.clear();
    }
};
