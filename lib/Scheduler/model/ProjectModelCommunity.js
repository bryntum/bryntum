import VersionHelper from '../../Core/helper/VersionHelper.js';
import ProjectModelMixin from './mixin/ProjectModelMixin.js';
import ProjectCurrentConfig from './mixin/ProjectCurrentConfig.js';
import ProjectCrudManager from '../data/mixin/ProjectCrudManager.js';
import ModelPersistencyManager from '../data/util/ModelPersistencyManager.js';
import { SchedulerCoreProjectMixin } from '../../Engine/quark/model/scheduler_core/SchedulerCoreProjectMixin.js';
import EventModelCommunity from './EventModelCommunity.js';
import ResourceModelCommunity from './ResourceModelCommunity.js';
import AssignmentModelCommunity from './AssignmentModelCommunity.js';
import EventStoreCommunity from '../data/EventStoreCommunity.js';
import ResourceStoreCommunity from '../data/ResourceStoreCommunity.js';
import AssignmentStoreCommunity from '../data/AssignmentStoreCommunity.js';
import DependencyStoreCommunity from '../data/DependencyStoreCommunity.js';
import DependencyModelCommunity from './DependencyModelCommunity.js';

const EngineMixin = SchedulerCoreProjectMixin;

/**
 * @module Scheduler/model/ProjectModelCommunity
 */

// A store configured with its own AjaxStore write urls persists itself, record by record
const storePersistsItself = store => Boolean(store?.createUrl || store?.updateUrl || store?.deleteUrl);

/**
 * Community-tier ProjectModel.
 *
 * The full documentation lives on {@link Scheduler.model.ProjectModel}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @extends Core/data/Model
 * @mixes Scheduler/model/mixin/ProjectModelMixin
 * @mixes Scheduler/data/mixin/ProjectCrudManager
 * @uninherit Core/data/mixin/TreeNode
 * @tier community
 */
export default class ProjectModelCommunity extends ProjectCurrentConfig(ProjectModelMixin(EngineMixin)).mixin(
    ProjectCrudManager
) {
    static $name = 'ProjectModelCommunity';

    // Preserves the `isProjectModel` flag that Core/Base derives from $name; the tier split renamed
    // $name, and code across the suite branches on isProjectModel.
    // Must be a prototype getter, not a class field: the crud manager reads this while registering
    // stores during construction, before a subclass's field initialisers have run.
    get isProjectModel() {
        return true;
    }

    //region Inline data configs & properties

    /**
     * @hidefields id, readOnly, children, parentId, parentIndex
     */

    /**
     * A flag, indicating whether the dates and duration calculations should adjust the result to DST time shift.
     *
     * @config {Boolean} adjustDurationToDST
     * @default false
     */

    /**
     * Get/set {@link #property-eventStore} data.
     *
     * Always returns an array of {@link Scheduler.model.EventModel EventModels} but also accepts an array of
     * its configuration objects as input.
     *
     * @member {Scheduler.model.EventModel[]} events
     * @accepts {Scheduler.model.EventModel[]|EventModelConfig[]}
     * @category Inline data
     */
    /**
     * Data use to fill the {@link #property-eventStore}. Should be an array of
     * {@link Scheduler.model.EventModel EventModels} or its configuration objects.
     *
     * @config {Scheduler.model.EventModel[]|EventModelConfig[]} events
     * @category Inline data
     */

    /**
     * Get/set {@link #property-resourceStore} data.
     *
     * Always returns an array of {@link Scheduler.model.ResourceModel ResourceModels} but also accepts an array
     * of its configuration objects as input.
     *
     * @member {Scheduler.model.ResourceModel[]} resources
     * @accepts {Scheduler.model.ResourceModel[]|ResourceModelConfig[]}
     * @category Inline data
     */
    /**
     * Data use to fill the {@link #property-resourceStore}. Should be an array of
     * {@link Scheduler.model.ResourceModel ResourceModels} or its configuration objects.
     *
     * @config {Scheduler.model.ResourceModel[]|ResourceModelConfig[]} resources
     * @category Inline data
     */

    /**
     * Get/set {@link #property-assignmentStore} data.
     *
     * Always returns an array of {@link Scheduler.model.AssignmentModel AssignmentModels} but also accepts an
     * array of its configuration objects as input.
     *
     * @member {Scheduler.model.AssignmentModel[]} assignments
     * @accepts {Scheduler.model.AssignmentModel[]|AssignmentModelConfig[]}
     * @category Inline data
     */
    /**
     * Data use to fill the {@link #property-assignmentStore}. Should be an array of
     * {@link Scheduler.model.AssignmentModel AssignmentModels} or its configuration objects.
     *
     * @config {Scheduler.model.AssignmentModel[]|AssignmentModelConfig[]} assignments
     * @category Inline data
     */



    //endregion

    //region Legacy inline data configs & properties

    /**
     * The initial data, to fill the {@link #property-eventStore} with.
     * Should be an array of {@link Scheduler.model.EventModel EventModels} or its configuration objects.
     *
     * @config {Scheduler.model.EventModel[]|EventModelConfig[]} eventsData
     * @category Legacy inline data
     * @deprecated 6.3.0 Use {@link #config-events} instead
     */

    /**
     * The initial data, to fill the {@link #property-resourceStore} with.
     * Should be an array of {@link Scheduler.model.ResourceModel ResourceModels} or its configuration objects.
     *
     * @config {Scheduler.model.ResourceModel[]|ResourceModelConfig[]} [resourcesData]
     * @category Legacy inline data
     * @deprecated 6.3.0 Use {@link #config-resources} instead
     */

    /**
     * The initial data, to fill the {@link #property-assignmentStore} with.
     * Should be an array of {@link Scheduler.model.AssignmentModel AssignmentModels} or its configuration
     * objects.
     *
     * @config {Scheduler.model.AssignmentModel[]|AssignmentModelConfig[]} [assignmentsData]
     * @category Legacy inline data
     * @deprecated 6.3.0 Use {@link #config-assignments} instead
     */

    //endregion

    //region Store configs & properties

    /**
     * The {@link Scheduler.data.EventStore store} holding the events information.
     *
     * See also {@link Scheduler.model.EventModel}
     *
     * @member {Scheduler.data.EventStore} eventStore
     * @category Models & Stores
     */
    /**
     * An {@link Scheduler.data.EventStore} instance or a config object.
     * @config {Scheduler.data.EventStore|EventStoreConfig} eventStore
     * @category Models & Stores
     */

    /**
     * The {@link Scheduler.data.ResourceStore store} holding the resources that can be assigned to the events in the event store.
     *
     * See also {@link Scheduler.model.ResourceModel}
     *
     * @member {Scheduler.data.ResourceStore} resourceStore
     * @category Models & Stores
     */
    /**
     * A {@link Scheduler.data.ResourceStore} instance or a config object.
     * @config {Scheduler.data.ResourceStore|ResourceStoreConfig} resourceStore
     * @category Models & Stores
     */

    /**
     * The {@link Scheduler.data.AssignmentStore store} holding the assignments information.
     *
     * See also {@link Scheduler.model.AssignmentModel}
     *
     * @member {Scheduler.data.AssignmentStore} assignmentStore
     * @category Models & Stores
     */
    /**
     * An {@link Scheduler.data.AssignmentStore} instance or a config object.
     * @config {Scheduler.data.AssignmentStore|AssignmentStoreConfig} assignmentStore
     * @category Models & Stores
     */

    /**
     * The {@link Scheduler.data.DependencyStore store} holding the dependencies information.
     *
     * See also {@link Scheduler.model.DependencyModel}
     *
     * @member {Scheduler.data.DependencyStoreEnterprise} dependencyStore
     * @category Models & Stores
     */
    /**
     * A {@link Scheduler.data.DependencyStoreEnterprise} instance or a config object.
     * @config {Scheduler.data.DependencyStoreEnterprise|DependencyStoreConfig} dependencyStore
     * @category Models & Stores
     */

    //endregion

    //region Configs

    tier = 'community';

    static configurable = {
        crudLoadValidationWarningPrefix : 'Project load response error(s):',

        crudSyncValidationWarningPrefix : 'Project sync response error(s):'
    };

    static get defaultConfig() {
        return {
            /**
             * The constructor of the event model class, to be used in the project. Will be set as the
             * {@link Core.data.Store#config-modelClass} property of the {@link #property-eventStore}
             *
             * @config {Scheduler.model.EventModelCommunity}
             * @ts-returns {typeof EventModelCommunity}
             * @category Models & Stores
             */
            eventModelClass : EventModelCommunity,

            /**
             * The constructor of the resource model class, to be used in the project. Will be set as the
             * {@link Core.data.Store#config-modelClass} property of the {@link #property-resourceStore}
             *
             * @config {Scheduler.model.ResourceModelCommunity}
             * @ts-returns {typeof ResourceModelCommunity}
             * @category Models & Stores
             */
            resourceModelClass : ResourceModelCommunity,

            /**
             * The constructor of the assignment model class, to be used in the project. Will be set as the
             * {@link Core.data.Store#config-modelClass} property of the {@link #property-assignmentStore}
             *
             * @config {Scheduler.model.AssignmentModelCommunity}
             * @ts-returns {typeof AssignmentModelCommunity}
             * @category Models & Stores
             */
            assignmentModelClass : AssignmentModelCommunity,

            /**
             * The constructor to create an event store instance with. Should be a class, subclassing the
             * {@link Scheduler.data.EventStore}
             * @config {Scheduler.data.EventStore|Object}
             * @ts-returns {typeof EventStore|object}
             * @category Models & Stores
             */
            eventStoreClass : EventStoreCommunity,

            /**
             * The constructor to create a resource store instance with. Should be a class, subclassing the
             * {@link Scheduler.data.ResourceStore}
             * @config {Scheduler.data.ResourceStore|Object}
             * @ts-returns {typeof ResourceStore|object}
             * @category Models & Stores
             */
            resourceStoreClass : ResourceStoreCommunity,

            /**
             * The constructor to create an assignment store instance with. Should be a class, subclassing the
             * {@link Scheduler.data.AssignmentStore}
             * @config {Scheduler.data.AssignmentStore|Object}
             * @ts-returns {typeof AssignmentStore|object}
             * @category Models & Stores
             */
            assignmentStoreClass : AssignmentStoreCommunity,

            /**
             * The constructor of the dependency model class, to be used in the project. Will be set as the
             * {@link Core.data.Store#config-modelClass} property of the {@link #property-dependencyStore}
             *
             * @config {Scheduler.model.DependencyModelCommunity}
             * @ts-returns {typeof DependencyModelCommunity}
             * @category Models & Stores
             */
            dependencyModelClass : DependencyModelCommunity,

            /**
             * The constructor to create a dependency store instance with. Should be a class, subclassing the {@link
             * Scheduler.data.DependencyStoreEnterprise}
             * @config {Scheduler.data.DependencyStoreEnterprise|Object}
             * @ts-returns {typeof DependencyStore|object}
             * @category Models & Stores
             */
            dependencyStoreClass : DependencyStoreCommunity
        };
    }

    //endregion

    //region Events

    /**
     * Fired when the engine has finished its calculations and the results has been written back to the records.
     *
     * ```javascript
     * scheduler.project.on({
     *     dataReady() {
     *        console.log('Calculations finished');
     *     }
     * });
     *
     * scheduler.eventStore.first.duration = 10;
     *
     * // At some point a bit later it will log 'Calculations finished'
     * ```
     *
     * @event dataReady
     * @param {Scheduler.model.ProjectModel} source The project
     * @ts-param source {Scheduler.model.ProjectModel|any}
     * @param {Boolean} isInitialCommit Flag that shows if this commit is initial
     * @param {Set} records Set of all {@link Core.data.Model}s that were modified in the completed transaction.
     * Use the {@link Core.data.Model#property-modifications} property of each Model to identify
     * modified fields.
     */

    //endregion

    /**
     * Silences propagations caused by the project loading.
     *
     * Applying the loaded data to the project occurs in two basic stages:
     *
     * 1. Data gets into the engine graph which triggers changes propagation
     * 2. The changes caused by the propagation get written to related stores
     *
     * Setting this flag to `true` makes the component perform step 2 silently without triggering events causing reactions on those changes
     * (like sending changes back to the server if `autoSync` is enabled) and keeping stores in unmodified state.
     *
     * This is safe if the loaded data is consistent so propagation doesn't really do any adjustments.
     * By default the system treats the data as consistent so this option is `true`.
     *
     * ```javascript
     * new Scheduler({
     *     project : {
     *         // We want scheduling engine to recalculate the data properly
     *         // so then we could save it back to the server
     *         silenceInitialCommit : false
     *     }
     *     ...
     * })
     * ```
     *
     * @config {Boolean} silenceInitialCommit
     * @default true
     * @category Advanced
     */

    construct(...args) {
        super.construct(...args);

        const me = this;

        if (VersionHelper.isTestEnv) {
            globalThis.bryntum.testProject = me;
        }

        // Moved here from EventStore, since project is now the container instead of it
        me.modelPersistencyManager = me.createModelPersistencyManager();

        me.registerCrudStores();
    }

    /**
     * Registers the project's stores with the built-in CrudManager, so that load responses are dispatched into
     * them, their changes are included in sync requests and they are requested from the backend when loading.
     * Store ids ("events", "resources" etc.) and load/sync order come from the store classes themselves.
     *
     * Called from `construct()`. Subclasses whose project uses a different set of stores override this.
     * @private
     */
    registerCrudStores() {
        const me = this;

        me.addPrioritizedStore(me.assignmentStore);
        me.addPrioritizedStore(me.dependencyStore);
        me.addPrioritizedStore(me.resourceStore);
        me.addPrioritizedStore(me.eventStore);
        if (me.timeRangeStore) {
            me.addPrioritizedStore(me.timeRangeStore);
        }
    }

    get project() {
        return this;
    }

    set project(value) {
        super.project = value;
    }

    get crudLoadValidationMandatoryStores() {
        // Same mandatory stores as the classic standalone CrudManager
        return [this.getStoreDescriptor(this.eventStore).storeId, this.getStoreDescriptor(this.resourceStore).storeId];
    }

    get handlesStorePersistence() {
        const me = this;

        // The project always has the CrudManager functionality built in, but apps not using it may instead persist
        // the stores individually. It is considered to handle persistence when a transport is configured, or when
        // no store persists itself
        return Boolean(me.loadUrl || me.syncUrl) || !(storePersistsItself(me.eventStore) ||
            storePersistsItself(me.resourceStore) || storePersistsItself(me.assignmentStore));
    }

    acceptChanges() {
        super.acceptChanges();

        // clear project model own field changes
        this.internalClearChanges(true, false);
    }

    async revertChanges() {
        const
            me      = this,
            { stm } = me,
            // STM is not available on the community tier
            stmEnabled = stm && !stm.disabled;

        if (stmEnabled) {
            // in case of auto-recording stm, should not pick up revert changes as a new transaction
            stm.disable();
        }

        me.isRestoringData = true;

        // revertChanges method exists both on the Model and AbstractCrudManagerMixin class
        // so here we have to couple both of them

        // first invoke Crud Manager logic
        me.revertCrudStoreChanges();

        // then invoke Model logic - revert project model own field changes
        me.set(me.meta.modified, undefined, true);

        me.isRestoringData = false;

        await me.commitAsync();

        // clear project model own field changes
        me.internalClearChanges(true, false);

        if (stmEnabled) {
            stm.enable();
        }
    }

    getChangesetPackage() {
        const
            me   = this,
            pack = super.getChangesetPackage();

        // Remove assignments from changes if using single assignment mode (resourceId) or persisted resourceIds,
        // matching the wire format of the classic standalone CrudManager
        if (pack && (me.eventStore.usesSingleAssignment || me.eventStore.modelClass.fieldMap?.resourceIds?.persist)) {
            delete pack[me.getStoreDescriptor(me.assignmentStore).storeId];

            // No other changes?
            if (!me.forceSync && !me.crudStores.some(storeInfo => pack[storeInfo.storeId])) {
                return null;
            }
        }

        return pack;
    }

    /**
     * Creates and returns model persistency manager
     *
     * @returns {Scheduler.data.util.ModelPersistencyManager}
     * @internal
     */
    createModelPersistencyManager() {
        return new ModelPersistencyManager({
            eventStore      : this,
            resourceStore   : this.resourceStore,
            assignmentStore : this.assignmentStore,
            dependencyStore : this.dependencyStore
        });
    }

    doDestroy() {
        this.modelPersistencyManager.destroy();
        super.doDestroy();
    }

    // To comply with TaskBoards expectations
    get taskStore() {
        return this.eventStore;
    }
}

ProjectModelCommunity.applyConfigs = true;

ProjectModelCommunity.initClass();
