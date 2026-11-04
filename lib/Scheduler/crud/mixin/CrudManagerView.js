/**
 * @module Scheduler/crud/mixin/CrudManagerView
 */

import LoadMaskable from '../../../Core/mixin/LoadMaskable.js';
import Mask from '../../../Core/widget/Mask.js';

/**
 * Mixin to track Crud Manager requests to the server and mask the view during them. For masking, it
 * uses the {@link Core.mixin.LoadMaskable#config-loadMask} and {@link Core.mixin.LoadMaskable#config-syncMask}
 * properties.
 *
 * @mixin
 * @extends Core/mixin/LoadMaskable
 */
export default Target => class CrudManagerView extends Target.mixin(LoadMaskable) {

    // <debug>
    // region Localization test
    static localization = [
        'L{GridBase.loadFailedMessage}',
        'L{GridBase.syncFailedMessage}'
    ];
    // endregion
    // </debug>

    static $name = 'CrudManagerView';

    static config = {
        clearMaskDelay : null,

        // Test environment may be in a poll wait for mask to disappear.
        // Hiding the mask immediately, before the load sequence ends releases it too early
        testConfig : {
            clearMaskDelay : 0
        }
    };

    //region Init

    afterConstruct() {
        super.afterConstruct();

        const { crudManager, project } = this;

        if (this.loadMask && (crudManager || project).isCrudManagerLoading) {
            // Show loadMask if crud manager is already loading
            this.onCrudManagerLoadStart({ source : this });
        }
    }

    //endregion

    /**
     * Applies the {@link Scheduler.crud.mixin.CrudManagerView#config-syncMask} as the
     * {@link Core.widget.Widget#config-masked mask} for this widget.
     * @internal
     */
    applySyncMask() {
        const { syncMask } = this;

        if (syncMask) {
            this.masked = Mask.mergeConfigs(this.loadMaskDefaults, syncMask);
        }
    }

    /**
     * Hooks up crud manager listeners
     * @private
     * @category Store
     */
    bindCrudManager(crudManager) {
        this.detachListeners('crudManager');

        let additionalListeners = {};

        // TaskBoard does not need suspending/resuming refreshes
        if (!this.isTaskBoardBase) {
            additionalListeners = {
                beforeApplyResponse            : 'onCrudManagerBeforeApplyResponse',
                applyResponse                  : 'onCrudManagerApplyResponse',
                beforeLoadCrudManagerData      : 'onCrudManagerBeforeLoadCrudManagerData',
                loadCrudManagerDataCommitStart : 'onCrudManagerLoadCrudManagerDataCommitStart'
            };
        }

        crudManager?.ion({
            name         : 'crudManager',
            loadStart    : 'onCrudManagerLoadStart',
            beforeSend   : 'onCrudManagerBeforeSend',
            load         : 'onCrudManagerLoad',
            loadCanceled : 'onCrudManagerLoadCanceled',
            syncStart    : 'onCrudManagerSyncStart',
            sync         : 'onCrudManagerSync',
            syncCanceled : 'onCrudManagerSyncCanceled',
            requestFail  : 'onCrudManagerRequestFail',
            requestDone  : 'onAjaxTransportResponseDone',
            ...additionalListeners,
            thisObj      : this
        });
    }

    onCrudManagerBeforeSend({ params }) {
        this.applyStartEndParameters?.(params);
    }

    onCrudManagerLoadStart() {
        // Show loadMask before crud manager starts loading
        this.applyLoadMask();
        this.toggleEmptyText?.();
    }

    onCrudManagerSyncStart() {
        this.applySyncMask();
    }

    onCrudManagerBeforeApplyResponse({ request }) {
        // Prevent redrawing for each applied change on sync, instead do it once after all changes are applied
        if (request.type === 'sync' || this.crudManager.lazyLoad) {
            this.suspendRefresh();
        }
    }

    onCrudManagerApplyResponse({ request }) {
        // Repaint rows once after applying changes when syncing
        if (request.type === 'sync' || this.crudManager.lazyLoad) {
            this.resumeRefresh(true, request.type === 'sync');
        }
    }

    onCrudManagerBeforeLoadCrudManagerData() {
        const me = this;

        // Disable view startDate/endDate calculation after events loading.
        // It's too early since project own fields are not there yet.
        // The calculation is implemented in TimelineEarlyPositioning mixin and expects
        // me._initialStartDateFilled === 'pending' so changing its value disabled that logic.
        if (me._initialStartDateFilled === 'pending') {
            me._initialStartDateFilled = 'paused';
        }

        if (!me.crudManager.lazyLoad) {
            // Suspend when loading data
            me.suspendRefresh();

            // Resume temporarily on first project refresh (before calculations) to allow for early rendering
            me.project.once('refresh', () => {
                // the view could be destroyed in the meantime
                if (!me.isDestroyed) {
                    // Might look strange, but this call does an unanimated refresh (early rendering) of the loaded
                    // data. A hidden view (e.g. an inactive Calendar mode sharing the project) must not force a
                    // refresh — rendering it would query the stores for its own date range, which for example makes
                    // the Calendar's LoadOnDemand feature issue load requests for a range no visible view needs
                    me.resumeRefresh(me.isVisible, false);

                    // Unmask early too
                    me.masked = null;

                    // And this call suspend it again, to prevent multiple refreshes during calculation result writeback.
                    // The final resume happens below in `onCrudManagerLoadCrudManagerDataCommitStart`.
                    me.suspendRefresh();
                }
            });
        }
    }

    async onCrudManagerLoadCrudManagerDataCommitStart() {
        const me = this;

        // Now when all data is applied calculate the view start/end dates (if it's not done yet)
        if (me._initialStartDateFilled === 'paused') {
            me.tryToApplyPreCommitStartEndDates(me.crudManager.eventStore);
        }

        if (!me.crudManager.lazyLoad) {
            await me.project.commitAsync();

            // Hidden views refresh when they get painted instead
            !me.isDestroyed && me.resumeRefresh(me.isVisible);
        }
    }

    onCrudManagerRequestFinalize(requestType, response, successful = true) {
        const me = this;

        if (successful) {
            me.toggleEmptyText?.();
        }
        else {
            if (!me.masked) {
                me.applyLoadMask();
            }
            me.applyMaskError(
                `<div class="b-grid-load-failure">
                    <div class="b-grid-load-fail">${me.L(`L{GridBase.${requestType}FailedMessage}`)}</div>
                    ${response && response.message ? `<div class="b-grid-load-fail">${me.L('L{CrudManagerView.serverResponseLabel}')} ${response.message}</div>` : ''}
                </div>`);
        }
    }

    onCrudManagerLoadCanceled() {
        this.onCrudManagerRequestFinalize('load');
    }

    onCrudManagerSyncCanceled() {
        this.onCrudManagerRequestFinalize('sync');
    }

    onCrudManagerLoad() {
        this.onCrudManagerRequestFinalize('load');
    }

    onCrudManagerSync() {
        this.onCrudManagerRequestFinalize('sync');
    }

    onCrudManagerRequestFail({ requestType, response }) {
        this.onCrudManagerRequestFinalize(requestType, response, false);
    }

    onAjaxTransportResponseDone() {
        const me = this;

        if (me.clearMaskDelay != null) {
            me.setTimeout(() => me.masked = null, me.clearMaskDelay);
        }
        else {
            me.masked = null;
        }
    }

    get widgetClass() {}
};
