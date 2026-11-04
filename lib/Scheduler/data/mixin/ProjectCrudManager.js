import AbstractCrudManagerMixin from '../../crud/AbstractCrudManagerMixin.js';
import Base from '../../../Core/Base.js';
import AjaxTransport from '../../crud/transport/AjaxTransport.js';
import JsonEncoder from '../../crud/encoder/JsonEncoder.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';

/**
 * @module Scheduler/data/mixin/ProjectCrudManager
 */

/**
 * This mixin provides Crud Manager functionality supporting loading of scheduling engine projects.
 *
 * @mixin
 * @mixes Scheduler/crud/AbstractCrudManagerMixin
 * @mixes Scheduler/crud/transport/AjaxTransport
 * @mixes Scheduler/crud/encoder/JsonEncoder
 * @tier community
 */
export default Target => class ProjectCrudManager extends (Target || Base).mixin(AbstractCrudManagerMixin, AjaxTransport, JsonEncoder) {
    static $name = 'ProjectCrudManager';

    //region Config

    static get defaultConfig() {
        return {
            project : null
        };
    }

    construct(config = {}, ...args) {
        // The classic standalone CrudManager accepts extra stores through its `stores` config. The project cannot
        // declare a `stores` config of its own (the name collides with Model#stores), so for backwards
        // compatibility it is mapped to the {@link Scheduler.crud.AbstractCrudManagerMixin#config-crudStores}
        // config here
        if (config.stores) {
            config.crudStores = config.stores;
            delete config.stores;
        }

        super.construct(config, ...args);
    }

    //region Convenience aliases (moved from AbstractCrudManager for standalone CrudManager API compatibility)

    addStore(...args) {
        return this.addCrudStore(...args);
    }

    removeStore(...args) {
        return this.removeCrudStore(...args);
    }

    getStore(...args) {
        return this.getCrudStore(...args);
    }

    hasChanges(...args) {
        return this.crudStoreHasChanges(...args);
    }

    get isLoading() {
        return Boolean(this.isCrudManagerLoading || this._isLoadingTreeData);
    }

    // Store#loadTreeData flags its root node with `isLoading` while loading, and the project can serve as a
    // store's root node
    set isLoading(value) {
        this._isLoadingTreeData = value;
    }

    loadData(...args) {
        return this.loadCrudManagerData(...args);
    }

    //endregion

    startConfigure(config) {
        this._restoreAutoCommit = 0;

        // process the project first which ingests any configured data sources,
        this.getConfig('project');

        super.startConfigure(config);

        this._changesToClear = new Map();
    }

    async doAutoLoad() {
        const { project } = this;

        // Delay autoLoad to after projects initial commit if configured with a project
        if (project) {
            await project.commitAsync();
        }

        // If the project is destroyed, we don't want to load data
        if (!this.isDestroyed && !project?.isDestroyed) {
            return super.doAutoLoad?.();
        }
    }

    applyProjectResponse(response) {
        const
            me = this,
            { project } = me;

        me.applyingProjectResponse = true;

        if ('$input' in response) {
            response = response.$input;
        }

        project.setByDataSource(response);

        me._changesToClear.set(me, response);

        me.applyingProjectResponse = false;
    }

    async loadCrudManagerData(response, options, ...args) {
        const { project } = this;

        await super.loadCrudManagerData(response, options, ...args);

        // might be no project in scheduler/calendar/taskboard
        if (!this.applyingResponse && project?.commitAsync) {
            await project.commitAsync();
        }
    }

    async sync() {
        const
            me = this,
            { project } = me;

        // Suspend Crud Manager autoSync to not react on changes during commitAsync() call
        me.suspendAutoSync();
        me.suspendChangeTracking();

        // Make sure data is in a calculated state before syncing
        if (project) {
            await project.commitAsync();
        }

        if (me.isDestroying) {
            return;
        }

        // resume change tracking and autoSync silently
        me.resumeChangeTracking(true);
        me.resumeAutoSync(false);

        return super.sync();
    }

    disableEngineCommits() {
        const graph = this.project?.graph;

        if (graph?.autoCommit || this._restoreAutoCommit) {

            this._restoreAutoCommit++;

            graph.autoCommit = false;

            graph.unScheduleAutoCommit();
        }
    }

    enableEngineCommits() {
        const graph = this.project?.graph;

        if (graph && this._restoreAutoCommit && !--this._restoreAutoCommit) {
            graph.autoCommit = true;
        }
    }

    doBeforeLoadCrudManagerData(response, options) {
        this.disableEngineCommits();

        super.doBeforeLoadCrudManagerData(response, options);
    }

    async internalLoadCrudManagerData(response, options, ...args) {
        const
            me          = this,
            { project } = me;

        if (project) {
            const
                { replica }     = project,
                projectResponse = response?.project;

            // Detach the project from the Engine if "repopulateOnDataset" is enabled.
            // The project anyway will do that later when we start putting data into stores.
            // It's better to detach it here. Project model writes its field values when detaching
            // so we do it now and then override the values when applying the response.
            if (replica && project.repopulateOnDataset) {
                replica.activeTransaction.stop();

                project.unlink(replica, true);

                project.isRepopulating = true;

                // Trigger buffered repopulate of replica
                project.repopulateReplica();
            }

            super.internalLoadCrudManagerData(response, options, ...args);

            if (projectResponse) {
                me.applyProjectResponse(projectResponse);
            }

            if (project.isRepopulating) {
                project.repopulateReplica.now();
                project.isRepopulating = false;
            }

            // A special event for implementing Early Rendering.
            // It indicates all data is loaded but commitAsync() is not called yet.
            me.trigger('loadCrudManagerDataCommitStart', { response, options });

            // set propagatingLoadChanges flag
            me.propagatingLoadChanges = true;

            // for initial commit we still trigger the sync, but not for following
            me.loudAutoSyncResume = project.isInitialCommit && !project.silenceInitialCommit;

            // Wait till calculation gets done
            await project.commitAsync?.();

            // reset propagatingLoadChanges flag
            me.propagatingLoadChanges = false;

            // Accept changes came from the server (might have been destroyed while waiting above)
            me.commitRespondedChanges?.();
        }
        else {
            super.internalLoadCrudManagerData(response, options, ...args);
        }
    }

    doAfterLoadCrudManagerData(response, options) {
        super.doAfterLoadCrudManagerData(response, options);

        this.resumeAutoSync(this.loudAutoSyncResume);

        this.enableEngineCommits();

        this.checkChangesMadeWhileApplyingResponse();
    }

    doBeforeApplySyncResponse(response, options) {
        const { project } = this;

        if (project && !project.isDestroyed) {


            this.disableEngineCommits();
        }

        super.doBeforeApplySyncResponse(response, options);
    }

    async internalApplySyncResponse(response, request) {

        super.internalApplySyncResponse(response, request);

        const
            me          = this,
            { project } = me;

        if (project && !project.isDestroyed) {
            const projectResponse = response?.project;

            if (projectResponse) {
                me.applyProjectResponse(projectResponse);
            }

            // set propagatingSyncChanges flag
            me.propagatingSyncChanges = true;

            const projectChangesToClear = me.getRecordChangesToClear(
                {
                    store : {
                        modelClass : project.constructor
                    }
                },
                request?.pack?.project || {},
                projectResponse,
                project.modificationDataToWrite,
                project
            );

            if (projectChangesToClear) {
                me._changesToClear.set(project, projectChangesToClear);
            }

            // Wait till calculation gets done
            await project.commitAsync();

            // reset propagatingSyncChanges flag
            me.propagatingSyncChanges = false;

            // Accept changes came from the server (might have been destroyed while waiting above)
            me.commitRespondedChanges?.();
        }
    }

    doAfterApplySyncResponse(response, options) {
        const { project } = this;

        if (project) {
            this.enableEngineCommits();


        }

        super.doAfterApplySyncResponse(response, options);

        this.checkChangesMadeWhileApplyingResponse();
    }

    onCrudStoreChange(event) {
        const me = this;

        // Change tracking is suspended while a response is applied. A change made while awaiting the commit of the
        // response, that is not the engine writing calculated values, is made by the app or the user. It is checked
        // for (and auto synced) once the response is applied, see checkChangesMadeWhileApplyingResponse()
        // https://github.com/bryntum/bryntum/issues/13932
        if (me.crudIgnoreUpdates && (me.propagatingLoadChanges || me.propagatingSyncChanges) && !me.project?.isWritingData) {
            me.changesMadeWhileApplyingResponse = true;
        }

        super.onCrudStoreChange(event);
    }

    checkChangesMadeWhileApplyingResponse() {
        const me = this;

        if (me.changesMadeWhileApplyingResponse && !me.isChangeTrackingSuspended && !me.isDestroyed) {
            me.changesMadeWhileApplyingResponse = false;

            // Triggers hasChanges and schedules an auto sync if there are changes
            me.onCrudStoreChange();
        }
    }

    shouldClearRecordFieldChange(record, field, value) {
        const oldValue = record.getValue(field);

        field = record.getFieldDefinition(field);

        // If the field value matches the one responded from the server
        // we silently accept it
        return field?.isEqual ? field.isEqual(oldValue, value) : ObjectHelper.isEqual(oldValue, value);
    }

    commitRespondedChanges() {
        const me = this;
        // We silently accept changes came from the server
        me._changesToClear.forEach((changes, record) => {
            Object.entries(changes).forEach(([key, value]) => {
                // If the field value matches the one responded from the server we silently accept it
                // for scheduler, the `record` can be a crud manager instance (which is not a model)
                // so we filter out this case
                if (!(record === me && me.project !== me) && me.shouldClearRecordFieldChange(record, key, value)) {
                    delete record.meta.modified[key];
                }
            });
        });

        me._changesToClear.clear();
    }

    applyChangesToStore(storeDesc, storeResponse, storeRequest, ...rest) {
        const changesMap = super.applyChangesToStore(storeDesc, storeResponse, storeRequest, ...rest);

        // The changes enter graph first but not store until later, clearing changes in StoreChanges might still leave
        // records modified. We need to clean up after the next propagation, so we store record changes in a map for now
        if (changesMap?.size && this.project) {
            for (const [id, changes] of changesMap) {
                const record = storeDesc.store.getById(id);
                record && this._changesToClear.set(record, changes);
            }
        }

        return changesMap;
    }
};
