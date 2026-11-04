import Base from '../../../Core/Base.js';
import ArrayHelper from '../../../Core/helper/ArrayHelper.js';

/**
 * @module Scheduler/view/mixin/DelayedRecordsRendering
 */

/**
 * Mixin that implements scheduling/unscheduling a delayed row refresh.
 * @mixin
 * @internal
 */
export default Target => class DelayedRecordsRendering extends (Target || Base) {

    static $name = 'DelayedRecordsRendering';

    static configurable = {
        scheduledRecordsRefreshTimeout : 15
    };

    static get properties() {
        return {
            recordsToRefresh : new Set()
        };
    }

    beforeRenderRow(data) {
        // unscheduler records refresh when corresponding rows are rendered
        if (this.recordIsReadyForRendering?.(data.record)) {
            this.unscheduleRecordRefresh(data.record);
        }

        return super.beforeRenderRow(data);
    }

    cleanupScheduledRecord() {
        const { rowManager, store } = this;

        for (const record of [...this.recordsToRefresh]) {
            // Remove the record from to-refresh list if:
            // - it has been destroyed, as a group header is when a regroup drops its group
            // - it's not in the view store
            // - or it's not visible
            if (record.isDestroyed || !record.stores.includes(store) || !rowManager.getRowById(record)) {
                this.recordsToRefresh.delete(record);
            }
        }
    }

    renderScheduledRecords() {
        const me = this;

        if (!me.refreshSuspended) {
            // remove invisible records from the set of scheduled
            me.cleanupScheduledRecord();

            const
                { rowManager } = me,
                records        = [...me.recordsToRefresh],
                rows           = records.map(record => rowManager.getRowById(record));

            if (rows.length) {
                rowManager.renderRows(rows);

                /**
                 * This event fires when records which rendering
                 * was previously scheduled is finally done.
                 * @event scheduledRecordsRender
                 * @param {Grid.view.Grid} source The component.
                 * @param {Core.data.Model[]} records Rendered records.
                 * @param {Grid.row.Row[]} rows Rendered rows.
                 */
                me.trigger('scheduledRecordsRender', { records, rows });
            }

            if (me.recordsToRefresh.size) {
                me.scheduleRecordRefresh();
            }
        }
        // reschedule this call if view refresh is suspended
        else {
            me.scheduleRecordRefresh();
        }
    }

    /**
     * Cancels scheduled rows refresh.
     * @param {Core.data.Model|Core.data.Model[]|Boolean} [clearRecords=true] `true` to also clear the list of records
     * scheduled for refreshing. `false` will result only canceling the scheduled call and keeping intact
     * the list of records planned for refreshing.
     */
    unscheduleRecordRefresh(clearRecords = true) {
        const me = this;

        if (clearRecords === true) {
            me.recordsToRefresh.clear();
        }
        else if (clearRecords) {
            ArrayHelper.asArray(clearRecords).forEach(record => me.recordsToRefresh.delete(record));
        }

        if (me.scheduledRecordsRefreshTimer && !me.recordsToRefresh.size) {
            me.clearTimeout(me.scheduledRecordsRefreshTimer);
        }
    }

    /**
     * Schedules the provided record row refresh.
     * @param {Core.data.Model} records Record to refresh the row of.
     */
    scheduleRecordRefresh(records) {
        const me = this;

        if (records) {
            ArrayHelper.asArray(records).forEach(record => me.recordsToRefresh.add(record));
        }

        me.scheduledRecordsRefreshTimer = me.setTimeout({
            fn                : 'renderScheduledRecords',
            delay             : me.scheduledRecordsRefreshTimeout,
            cancelOutstanding : true
        });
    }

    get widgetClass() {}

};
