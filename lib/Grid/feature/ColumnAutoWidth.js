import GridFeature from './GridFeature.js';
import Delayable from '../../Core/mixin/Delayable.js';

const storeListenerName = 'store';

/**
 * @module Grid/feature/ColumnAutoWidth
 */

/**
 * Enables the {@link Grid.column.Column#config-autoWidth} config for a grid's columns. When a column
 * has `autoWidth` set, this feature measures the rendered content of all visible cells in that column
 * and adjusts the column width to fit. The measurement is triggered automatically when data changes
 * or rows are rendered.
 *
 * This feature is <strong>enabled</strong> by default.
 *
 * ```javascript
 * const grid = new Grid({
 *     columns : [
 *         { field : 'name', text : 'Name', autoWidth : true },
 *         { field : 'city', text : 'City', autoWidth : [100, 300] } // min/max
 *     ]
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Grid.column.Column#config-autoWidth} - Per-column auto-width config
 * - {@link Grid.feature.ColumnResize} - Manual column resizing
 *
 * @extends Grid/feature/GridFeature
 * @mixes Core/mixin/Delayable
 * @classtype columnAutoWidth
 * @feature
 * @tier community
 */
export default class ColumnAutoWidth extends Delayable(GridFeature) {
    static $name = 'ColumnAutoWidth';
    static tier = 'community';

    static type = 'columnAutoWidth';
    static defaultEnabled = true;
    //region Config

    static configurable = {
        /**
         * The default `autoWidth` option for columns with `autoWidth: true`. This can
         * be a single number for the minimum column width, or an array of two numbers
         * for the `[minWidth, maxWidth]`.
         *
         * Each column's own {@link Grid.column.Column#config-minWidth} is applied on top of these limits, so it wins
         * over a smaller `maxWidth` specified here.
         * @config {Number|Number[]}
         */
        default : null,

        /**
         * The amount of time (in milliseconds) to delay after a store modification
         * before synchronizing `autoWidth` columns.
         * @config {Number}
         * @default
         */
        delay : 0
    };

    //endregion

    //region Internals

    static get pluginConfig() {
        return {
            after : {
                bindStore        : 'bindStore',
                unbindStore      : 'unbindStore',
                renderRows       : 'syncAutoWidthColumns',
                onInternalResize : 'onInternalResize'
            },

            assign : [
                'columnAutoWidthPending',
                'syncAutoWidthColumns'
            ]
        };
    }

    construct(config) {
        super.construct(config);

        const { store } = this;

        // The initial bindStore can come super early such that our hooks won't catch it:
        store && this.bindStore(store);
    }

    doDestroy() {
        this.unbindStore();

        super.doDestroy();
    }

    get store() {
        return this.client.$store;
    }

    bindStore(store) {
        this.lastSync = null;

        store.ion({
            name : storeListenerName,

            [`change${this.client.asyncEventSuffix}`] : 'onStoreChange',

            thisObj : this
        });
    }

    unbindStore() {
        this.detachListeners(storeListenerName);
    }

    get columnAutoWidthPending() {
        return this.lastSync === null || this.hasTimeout('syncAutoWidthColumns');
    }

    onStoreChange({ action, source : store }) {
        const
            me         = this,
            { client } = me;

        // Filtered tree reload fires `dataset` then a non-silent `filter`; skip the redundant `dataset` and
        // measure on `filter`. Flat & remote-filtered stores fire no trailing `filter`, so must NOT be skipped (#13410).
        if (action === 'dataset' && store.isTree && store.isFiltered && !store.remoteFilter) {
            return;
        }

        if (action !== 'move' && client.isPainted) {
            const { cellEdit } = client.features;

            ++me.storeGeneration;

            // If we are filtering/editing, sync right away so cell editing can align correctly to next cell
            // unless editing is finished/canceled by tapping outside of grid body.
            if (action === 'filter' || cellEdit?.isEditing && !cellEdit.editingStoppedByTapOutside) {
                me.syncAutoWidthColumns();
            }
            // If refresh is suspended for any reason, we need to wait on the rendering to complete
            else if (!client.refreshSuspended) {
                me.setTimeout({ fn : 'syncAutoWidthColumns', delay : me.delay, cancelOutstanding : true });
            }
            else {
                client.rowManager.once('renderDone', () => me.syncAutoWidthColumns());
            }
        }
    }

    // Handle scenario with Grid being inside DIV with display none, and no width. Sync column widths after being shown
    onInternalResize(element, newWidth, newHeight, oldWidth) {
        if (oldWidth === 0) {
            // Force remeasure after we get a width
            this.lastSync = null;
            this.syncAutoWidthColumns();
        }
    }

    syncAutoWidthColumns() {
        const { client } = this;

        // No point in measuring if we are a split controlled by an original grid
        if (this.disabled || client.store.count === 0 || client.rowManager.rows.length === 0 || (client.splitFrom && !client.splitFrom.features?.lockRows?.enabled)) {
            return;
        }

        this.doSyncAutoWidthColumns();
    }

    doSyncAutoWidthColumns() {
        const
            me = this,
            {
                client,
                storeGeneration
            }  = me;

        // No point in measuring if we are a split controlled by an original grid
        if ((client.splitFrom && !client.usesLockRows) || !client.isPainted) {
            return;
        }

        if (me.lastSync !== storeGeneration) {
            me.lastSync = storeGeneration;

            let autoWidth, resizingColumns;

            for (const column of client.columns.visibleColumns) {
                autoWidth = column.autoWidth;

                if (autoWidth) {
                    if (autoWidth === true) {
                        autoWidth = me.default;
                    }

                    client.resizingColumns = resizingColumns = true;
                    column.resizeToFitContent(autoWidth);
                }
            }

            if (resizingColumns) {
                client.resizingColumns = false;
                client.afterColumnsResized();
            }
        }

        if (me.hasTimeout('syncAutoWidthColumns')) {
            me.clearTimeout('syncAutoWidthColumns');
        }
    }

    //endregion
}

ColumnAutoWidth.prototype.storeGeneration = 0;

ColumnAutoWidth.initClass();
