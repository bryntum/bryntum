import Base from '../../../Core/Base.js';
import Store from '../../../Core/data/Store.js';
import HorizontalRendering from '../orientation/HorizontalRendering.js';
import VerticalRendering from '../orientation/VerticalRendering.js';


/**
 * @module Scheduler/view/mixin/SchedulerMode
 */

// Toggles the `b-hide-display` class on a subgrid together with its header, footer and virtual scroller elements
function toggleSubGridVisibility(subGrid, hidden) {
    subGrid.toggleCls('b-hide-display', hidden);
    subGrid.header?.toggleCls('b-hide-display', hidden);
    subGrid.footer?.toggleCls('b-hide-display', hidden);
    subGrid.virtualScrollerElement?.classList.toggle('b-hide-display', hidden);
}

/**
 * Scheduler orientation mode string.
 * @typedef {'horizontal'|'vertical'} SchedulerModeValue
 */

/**
 * Mixin that handles horizontal/vertical mode toggling for SchedulerBase.
 * Manages rendering engine lifecycle, row store switching, column/subgrid visibility, and feature mode compatibility
 * during runtime mode changes.
 *
 * When switching to vertical mode, non-normal region columns are temporarily removed and their subgrids are hidden,
 * since the grid uses a dummy single-row store. When switching back to horizontal, columns and subgrids are restored.
 * Features that don't support the target mode are auto-disabled and re-enabled when switching to a mode they support.
 *
 * Please note that not all features are supported in both modes. Features can declare supported modes via a static
 * `supportedModes` getter returning an array of mode strings (e.g. `['horizontal']`).
 *
 * @mixin
 */
export default Target => class SchedulerMode extends (Target || Base) {
    static $name = 'SchedulerMode';

    static configurable = {
        /**
         * Scheduler mode. Supported values: `'horizontal'` or `'vertical'`.
         * This property can be toggled at runtime to switch between orientations without recreating the scheduler.
         * @prp {SchedulerModeValue} mode
         * @default 'horizontal'
         * @category Common
         * @non-lazy-load
         */
        mode : 'horizontal'
    };

    // Rendering engine classes. Override on prototype in subclasses to use product-specific engines
    get horizontalRenderingClass() {
        return HorizontalRendering;
    }

    get verticalRenderingClass() {
        return VerticalRendering;
    }

    //region Mode

    /**
     * `true` when the scheduler is in horizontal mode (the default)
     * @member {Boolean}
     * @readonly
     * @category Common
     */
    get isHorizontal() {
        return this.mode === 'horizontal';
    }

    /**
     * `true` when the scheduler is in vertical mode
     * @member {Boolean}
     * @readonly
     * @category Common
     */
    get isVertical() {
        return this.mode === 'vertical';
    }

    /**
     * Fired before the {@link Scheduler.view.SchedulerBase#config-mode} changes between `'horizontal'` and
     * `'vertical'`. Return `false` from a listener to veto the change.
     * @preventable
     * @event beforeModeChange
     * @param {Scheduler.view.Scheduler} source The scheduler instance
     * @param {SchedulerModeValue} mode The target mode
     * @param {SchedulerModeValue} oldMode The current (about-to-be-replaced) mode
     * @on-owner
     */

    /**
     * Fired after the {@link Scheduler.view.SchedulerBase#config-mode} has changed between `'horizontal'` and
     * `'vertical'`.
     * @event modeChange
     * @param {Scheduler.view.Scheduler} source The scheduler instance
     * @param {SchedulerModeValue} mode The new mode
     * @param {SchedulerModeValue} oldMode The previous mode
     * @on-owner
     */

    changeMode(mode) {
        const me = this;

        if (mode !== 'horizontal' && mode !== 'vertical') {
            console.warn(`Invalid mode "${mode}" - keeping "${me.mode}"`);
            return me.mode;
        }

        // The Tree feature cannot be disabled at runtime
        if (mode === 'vertical' && me.hasFeature('tree')) {
            console.warn('Vertical mode is not supported with the Tree feature - keeping horizontal mode');
            return 'horizontal';
        }

        // Partnered schedulers share a single timeAxisViewModel, which cannot represent two orientations at once
        if (mode !== me.mode && me.isPainted && me.partneredWith?.count) {
            console.warn('Mode cannot be changed on a partnered scheduler - keeping current mode');
            return me.mode;
        }

        if (mode !== me.mode && me.trigger('beforeModeChange', { mode, oldMode : me.mode }) === false) {
            return me.mode;
        }

        if (mode !== me.mode && me.isPainted) {
            me._modeSwitchCenterDate = me.timelineScroller?.position > 1 ? me.viewportCenterDate : null;

            // Disable features which do not support the new mode while the view is still fully in the old mode.
            me.updateFeatureModes(mode, true);
        }

        return mode;
    }

    updateMode(mode, oldMode) {
        const me = this;

        // Remove old mode class if switching modes at runtime
        if (oldMode) {
            me.removeCls(`b-sch-${oldMode}`);

            // Deactivate old rendering engine
            me[oldMode]?.deactivate?.();
        }

        // Add new mode class
        me.addCls(`b-sch-${mode}`);

        // Create rendering engine if not exists
        if (!me[mode]) {
            if (mode === 'horizontal') {
                let RenderingCls = HorizontalRendering;

                me.horizontal = new RenderingCls(me);
            }
            else if (mode === 'vertical') {
                let RenderingCls = VerticalRendering;

                me.vertical = new RenderingCls(me);
            }
        }

        if (mode === 'vertical') {
            me.sortFeatureStore = 'resourceStore';
            me.defaultEmptyTextRegion = 'normal';
        }
        else {
            me.sortFeatureStore = '$store';
            me.defaultEmptyTextRegion = null;
        }

        // Handle runtime mode switch when already painted
        if (me.isPainted && oldMode) {
            me.switchMode(mode, oldMode);
        }
        // Initial setup (not a runtime switch)
        else if (me.isPainted && me.timeAxisColumn) {
            me.timeAxisColumn.mode = mode;
        }
    }

    /**
     * Toggles the scheduler between `'horizontal'` and `'vertical'` mode at runtime. Fires
     * {@link #event-beforeModeChange} (preventable) and {@link #event-modeChange}.
     *
     * ```javascript
     * scheduler.toggleMode();
     * ```
     *
     * @category Common
     */
    toggleMode() {
        this.mode = this.isHorizontal ? 'vertical' : 'horizontal';
    }

    /**
     * Handles switching between horizontal and vertical modes at runtime. Deactivates the old rendering engine and
     * activates the new one, managing row store switching and refresh suspension.
     * @param {SchedulerModeValue} mode The new mode
     * @param {SchedulerModeValue} oldMode The previous mode
     * @internal
     */
    switchMode(mode, oldMode) {
        const me = this;

        if (!me[mode]) {
            return;
        }

        const centerDate = me._modeSwitchCenterDate;

        me._modeSwitchCenterDate = null;

        // Abort any pending vertical-renderer rAF from a previous switchMode
        if (me._pendingVerticalRenderFrame) {
            me.cancelAnimationFrame(me._pendingVerticalRenderFrame);
            me._pendingVerticalRenderFrame = null;
        }

        me.internalOnBeforeModeSwitch({ mode, oldMode });

        // Suspend refresh during mode switch to prevent row rendering before all mode-specific setup is complete
        me.suspendRefresh();
        me._suspendRenderContentsOnColumnsChanged = true;

        // Bind the horizontal store before timeAxisColumn.mode changes
        if (mode === 'horizontal') {
            me.switchRowStore(mode);
        }

        // The VerticalTimeAxisColumn is hosted in the locked region, or the first region
        const timeAxisHostSubGrid = me.subGrids.locked || me.subGrids[Object.keys(me.subGrids)[0]];

        if (timeAxisHostSubGrid) {
            // Remember the host region's width under the mode we are leaving
            if (oldMode === 'horizontal') {
                me._horizontalLockedWidth = timeAxisHostSubGrid.width;
            }
            else if (oldMode === 'vertical') {
                me._verticalLockedWidth = timeAxisHostSubGrid.width;
            }
        }

        if (me.timeAxisColumn) {
            me.timeAxisColumn.mode = mode;
        }

        if (me.timeAxisViewModel) {
            me.timeAxisViewModel.mode = mode;
        }

        // Re-measure the row border for the new orientation
        me.measureRowBorder?.();

        // Handle VerticalTimeAxisColumn visibility
        if (me.verticalTimeAxisColumn?.isVerticalTimeAxisColumn) {
            me.verticalTimeAxisColumn.hidden = mode !== 'vertical';
        }
        else if (mode === 'vertical') {
            me.createVerticalTimeAxisColumn();
        }

        me.toggleLockedColumnsForMode(mode);

        me._suspendRenderContentsOnColumnsChanged = false;

        // Invalidate cached timelineScroller since it's mode-dependent
        me._timelineScroller?.destroy();
        me._timelineScroller = null;

        // Bind the dummy store after toggleLockedColumnsForMode(), else locked columns would measure its single row
        // (RowNumberColumn.bindStore). This is safe since the vertical renderer is skipped while refresh is suspended
        if (mode === 'vertical') {
            me.switchRowStore(mode);
        }

        // Initialize or activate the rendering engine
        me[mode].activate?.();

        // The vertical scroll position means something else in the new mode (time axis vs resources), start over
        // from the top. Otherwise rows are culled based on a stale scroll position when going to horizontal mode.
        // The time axis is recentered below
        me.scrollable.y = me._scrollTop = 0;

        me.resumeRefresh(false);
        me.renderContents();

        // Restore the time axis host region to the width last used in the target mode
        if (timeAxisHostSubGrid) {
            if (mode === 'vertical') {
                const width = me._verticalLockedWidth ?? me.verticalTimeAxisColumn?.width;

                if (width != null) {
                    timeAxisHostSubGrid.width = width;
                }
            }
            else if (me._horizontalLockedWidth != null) {
                timeAxisHostSubGrid.width = me._horizontalLockedWidth;
            }
        }

        // For vertical mode, explicitly trigger the renderer after grid refresh
        if (mode === 'vertical') {
            me._pendingVerticalRenderFrame = me.requestAnimationFrame(() => {
                me._pendingVerticalRenderFrame = null;
                me.vertical.renderer();
            });
        }

        // Auto-disable features that don't support the target mode, and re-enable features
        // that were previously auto-disabled when switching back to a supported mode
        me.updateFeatureModes(mode);
        me.internalOnModeChange({ mode, oldMode });

        // Recenter the viewport on the date that was centered before the switch, once the new orientation has laid out
        if (centerDate) {
            me.requestAnimationFrame(() => {
                if (!me.isDestroying && !me.isDestroyed && me.isVisible) {
                    me.scrollToDate(centerDate, { block : 'center' });
                }
            });
        }
    }

    /**
     * Auto-disables features that don't support the target mode, and re-enables features that were previously
     * auto-disabled when switching back to a supported mode. Features declare supported modes via a static
     * `supportedModes` getter returning an array of mode strings (e.g. `['horizontal']`). Features without
     * `supportedModes` are assumed to support all modes.
     * @param {SchedulerModeValue} mode The mode being switched to
     * @param {Boolean} [disableOnly] Pass `true` to only disable now-unsupported features and skip re-enabling
     * supported ones
     * @internal
     */
    updateFeatureModes(mode, disableOnly = false) {
        const { features } = this;

        for (const name in features) {
            const
                feature        = features[name],
                supportedModes = feature?.isInstancePlugin && feature.constructor.supportedModes;

            // No supportedModes = supports all modes, skip non-plugins too
            if (!supportedModes) {
                continue;
            }

            const isSupported = supportedModes.includes(mode);

            if (!isSupported && !feature.disabled) {
                feature._disabledByMode = true;
                feature.disabled = true;
            }
            else if (!disableOnly && isSupported && feature._disabledByMode) {
                feature._disabledByMode = false;
                feature.disabled = false;
            }
        }
    }

    /**
     * Internal pluggable method called when mode changes between horizontal and vertical. Features can chain into this
     * method via pluginConfig to respond to mode changes.
     *
     * Base implementation fires the public `modeChange` event — firing it from here means features that chain this
     * method run their mode-switch logic before external listeners see the event, in the same predictable order.
     * @param {Object} event Mode change details
     * @param {SchedulerModeValue} event.mode The new mode
     * @param {SchedulerModeValue} event.oldMode The previous mode
     * @internal
     */
    internalOnModeChange({ mode, oldMode }) {
        this.trigger('modeChange', { mode, oldMode });
    }

    /**
     * Hook for features that needs to react on mode change.
     * @param {Object} event Mode change details
     * @param {SchedulerModeValue} event.mode The new mode
     * @param {SchedulerModeValue} event.oldMode The previous mode
     * @internal
     */
    internalOnBeforeModeSwitch(event) {}

    /**
     * Switches the Grid's row store when toggling between horizontal and vertical modes. In horizontal mode, resources
     * are rows (store = resourceStore). In vertical mode, a single dummy row is used (store = dummy store).
     * @param {SchedulerModeValue} mode The mode to switch to
     * @internal
     */
    switchRowStore(mode) {
        const me = this;

        if (mode === 'vertical') {
            me._horizontalStore ||= me.store;

            // Create or reuse the vertical dummy store
            me._verticalDummyStore ||= new Store({
                data : [{
                    id  : 'verticalTimeAxisRow', // no-sanity
                    cls : 'b-vertical-time-axis-row'
                }],
                // This dummy store must be immune to the default operation of any filtering features.
                filter : () => false
            });
            me.store = me._verticalDummyStore;
        }
        else {
            // Restore the previous horizontal store (may be a display store, not resourceStore)
            me.store = me._horizontalStore || me.resourceStore;
        }
    }

    /**
     * Creates the VerticalTimeAxisColumn dynamically when switching from horizontal to vertical mode.
     * @internal
     */
    createVerticalTimeAxisColumn() {
        const
            me            = this,
            lockedSubGrid = me.subGrids.locked,
            // Apps can drop the default locked region; fall back to the first available region so the column still
            // lands in a valid subgrid instead of relying on 'locked' existing.
            region        = lockedSubGrid ? 'locked' : Object.keys(me.subGrids)[0],
            config        = {
                type   : 'verticalTimeAxis',
                region,
                locked : region === 'locked',
                ...me._verticalTimeAxisColumn
            },
            column        = me.columns.insert(0, config)[0];

        me.verticalTimeAxisColumn = column;
        column.relayAll(me);
    }

    /**
     * Manages non-normal region columns and subgrids when switching modes. In vertical mode, columns outside the
     * 'normal' region (except timeAxis columns) are removed since the grid uses a dummy single-row store, and their
     * subgrids are hidden. When switching to horizontal, columns and subgrids are restored.
     * @param {SchedulerModeValue} mode The mode being switched to
     * @internal
     */
    toggleLockedColumnsForMode(mode) {
        const
            me          = this,
            { columns } = me;

        me._horizontalLockedColumns ??= [];

        columns.suspendAutoCommit();

        // Restore any subgrids hidden by a previous mode switch before proceeding
        for (const subGrid of me._hiddenSubGrids || []) {
            toggleSubGridVisibility(subGrid, false);

            // Restore the width that was saved before hiding
            if (subGrid._widthBeforeHide != null) {
                subGrid.width = subGrid._widthBeforeHide;
                subGrid._widthBeforeHide = null;
            }

            // Only restore splitter if it was visible before hiding
            if (subGrid._splitterWasShowing) {
                subGrid.showSplitter();
            }
        }
        me._hiddenSubGrids = [];

        if (mode === 'vertical') {
            // Remove all non-timeAxis columns and store for restoration
            const columnsToRemove = [];

            columns.forEach(column => {
                if (!column.isTimeAxisColumn && !column.isVerticalTimeAxisColumn) {
                    columnsToRemove.push(column);
                }
            });

            // Store the columns for horizontal mode restoration
            me._horizontalLockedColumns = columnsToRemove;

            // Remove from grid
            columnsToRemove.forEach(column => columns.remove(column));
        }
        else {
            // Restore horizontal locked columns
            me._horizontalLockedColumns.forEach((column, index) => {
                columns.insert(index, column);
            });
        }

        // Hide non-normal subgrids that have no visible columns after the column changes above
        for (const region in me.subGrids) {
            if (region === 'normal') {
                continue;
            }

            const subGrid = me.subGrids[region];

            if (!subGrid.columns.visibleColumns.length) {
                // Track whether the splitter was visible so we can restore it correctly
                subGrid._splitterWasShowing = subGrid.$showingSplitter;

                // Save the current width so it can be restored when the subgrid is shown again.
                subGrid._widthBeforeHide = subGrid.width;

                toggleSubGridVisibility(subGrid, true);
                subGrid.hideSplitter();
                me._hiddenSubGrids.push(subGrid);
            }
        }

        // Clear tracked changes from the internal column operations
        columns.commit();
        columns.resumeAutoCommit(false);
    }

    get currentOrientation() {
        return this[this.mode];
    }

    //endregion

    //region Store reconfiguration

    updateStore(store, oldStore) {
        const me = this;

        super.updateStore?.(store, oldStore);

        // Clear the cached horizontal store when an app replaces the scheduler's store externally
        if (store !== me._verticalDummyStore && store !== me._horizontalStore && oldStore !== me._verticalDummyStore) {
            me._horizontalStore = null;
        }
    }

    //endregion

    //region Destroy

    doDestroy() {
        const me = this;

        if (me._pendingVerticalRenderFrame) {
            me.cancelAnimationFrame(me._pendingVerticalRenderFrame);
            me._pendingVerticalRenderFrame = null;
        }

        me._verticalDummyStore?.destroy();

        // Only destroy saved horizontal columns if they are currently detached (scheduler is in vertical mode at
        // teardown). When in horizontal mode, these columns are in me.columns and the Grid's destroy chain will dispose
        // of them
        if (me.mode === 'vertical') {
            me._horizontalLockedColumns?.forEach(col => col.destroy?.());
        }

        me._verticalDummyStore = me._horizontalLockedColumns = me._hiddenSubGrids = me._horizontalStore =
            me._horizontalLockedWidth = me._verticalLockedWidth = me._modeSwitchCenterDate = null;

        super.doDestroy();
    }

    //endregion
};
