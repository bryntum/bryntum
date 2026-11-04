import Base from '../../../Core/Base.js';
// Each branch of the per-tier map must name its tier class explicitly. The bare `ProjectModel` is the
// tier-resolved alias, so using it here would make every branch resolve to the built tier's own class and
// silently ignore the widget's own `tier`.
import ProjectModelCommunity from '../../model/ProjectModelCommunity.js';


import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import StringHelper from '../../../Core/helper/StringHelper.js';


/**
 * @module Scheduler/data/mixin/ProjectConsumer
 */

const engineStoreNames = [
    'assignmentStore',
    'dependencyStore',
    'eventStore',
    'resourceStore'
];

// <debug>
const
    // The stores whose class or model class can extend a tier-resolved alias, with the project config of their model
    // class, see `warnTierAliasMismatch()`
    tierAliasModelConfigs  = {
        assignmentStore      : 'assignmentModelClass',
        dependencyStore      : 'dependencyModelClass',
        eventStore           : 'eventModelClass',
        resourceStore        : 'resourceModelClass',
        calendarManagerStore : 'calendarModelClass'
    },
    // Warned once each, an app may create many projects
    warnedTierAliasClasses = new WeakSet();
// </debug>

/**
 * Creates a Project using any configured stores, and sets the stores configured into the project into
 * the host object.
 *
 * @mixin
 */
export default Target => class ProjectConsumer extends (Target || Base) {
    static $name = 'ProjectConsumer';

    //region Default config

    static get declarable() {
        return ['projectStores'];
    }

    static configurable = {
        /**
         * The project model class to use when creating the project instance. Override this to use a custom project
         * model class. In Gantt, this is overridden to use its own project model class.
         *
         * On Scheduler this is by default a map of per-tier project classes, from which the class is resolved using
         * the scheduler's {@link Core.mixin.Tierable#config-tier}:
         *
         * ```javascript
         * projectModelClass : {
         *     community  : ProjectModelCommunity,
         *     business   : ProjectModelBusiness,
         *     enterprise : ProjectModelEnterprise
         * }
         * ```
         *
         * Overriding with a single class disables per-tier resolution.
         * @config {Class<Scheduler.model.ProjectModel>|Object<String,Class<Scheduler.model.ProjectModel>>}
         * @ts-returns {typeof ProjectModel}
         * @category Data
         */
        projectModelClass : {
            community  : ProjectModelCommunity,


        },

        /**
         * A {@link Scheduler.model.ProjectModel} instance or a config object. The project holds all Scheduler data.
         * Can be omitted in favor of individual store configs or {@link Scheduler.view.mixin.SchedulerStores#config-crudManager} config.
         *
         * **Note:** On the enterprise tier the project is by default an instance of the
         * Scheduler.model.ProjectModelEnterprise class.
         * @prp {Scheduler.model.ProjectModel|ProjectModelConfig} project
         * @ts-returns {ProjectModel|ProjectModelConfig}
         * @category Data
         */
        project : {},

        /**
         * Configure as `true` to destroy the Project and stores when `this` is destroyed.
         * @config {Boolean}
         * @category Data
         */
        destroyStores : null,

        // Will be populated by AttachToProjectMixin which features mix in
        projectSubscribers : []
    };

    #suspendedByRestore;

    //endregion

    startConfigure(config) {
        // process the project first which ingests any configured data sources,
        this.getConfig('project');

        super.startConfigure(config);
    }

    //region Project

    // Resolves the project class to instantiate a project config with. When `projectModelClass` is a per-tier map, the
    // class is picked using the widget's own tier. A directly supplied class (custom project classes, products with a
    // single project class) disables per-tier resolution.
    resolveProjectModelClass() {
        const { projectModelClass } = this;

        if (typeof projectModelClass === 'function') {
            return projectModelClass;
        }

        const
            { tier }     = this,
            projectClass = projectModelClass[tier];

        if (!projectClass) {
            throw new Error(`Project tier "${tier}" is not available`);
        }

        return projectClass;
    }

    // This is where all the ingestion happens.
    // At config time, the changers inject incoming values into the project config object
    // that we are building. At the end we instantiate the project with all incoming
    // config values filled in.
    changeProject(project, oldProject) {
        const
            me = this,
            {
                projectDataNames
            }  = me.constructor;

        me.projectCallbacks = new Set();

        if (project) {
            // Flag for changes to know what stage we are at
            me.buildingProjectConfig = true;

            if (!project.isModel) {
                // When configuring, prio order:
                // 1. If using an already existing CrudManager, it is assumed to already have the stores we should use,
                //    adopt them as ours.
                // 2. If a supplied store already has a project, it is assumed to be shared with another scheduler and
                //    that project is adopted as ours. Unless we are given some store not part of that project,
                //    in which case we create a new project.
                // 3. Use stores from a supplied project config.
                // 4. Use stores configured on scheduler.
                // + Pass on inline data (events, resources, dependencies, assignments -> xxData on the project config)
                //
                // What happens during project initialization is this:
                // this._project is the project *config* object.
                // changeXxxx methods put incoming values directly into it through this.project
                // to be used as its configuration.
                // So when it is instantiated, it has had all configs injected.
                if (me.isConfiguring) {
                    // Set property for changers to put incoming values into
                    me._project = project;

                    // crudManager will be a clone of the raw config if it is a raw config.
                    const { crudManager } = me;

                    // Pull in stores from the crudManager config first
                    if (crudManager) {
                        this.updateStoresFromCrudManager();
                    }

                    // Pull in all our configured stores into the project config object.
                    // That also extracts any project into this._sharedProject
                    me.getConfig('projectStores');

                    // Referencing these data configs causes them to be pulled into
                    // the _project.xxxData config property if they are present.
                    for (const dataName of projectDataNames) {
                        me.getConfig(dataName);
                    }
                }

                const { eventStore } = project;
                let { _sharedProject : sharedProject } = me;

                // Delay autoLoading until listeners are set up, to be able to inject params
                if (eventStore?.autoLoad  && !eventStore.isEventStoreMixin && !eventStore.count && !eventStore.lazyLoad) {
                    eventStore.autoLoad = false;
                    me.delayAutoLoad = true;
                }

                // We should not adopt a project from a store if we are given any store not part of that project
                if (sharedProject && engineStoreNames.some(store => project[store] && project[store] !== sharedProject[store])) {
                    // We have to chain any store used by the other project, they can only belong to one
                    for (const store of engineStoreNames) {
                        if (project[store] && project[store] === sharedProject[store]) {
                            project[store] = project[store].chain();
                        }
                    }

                    sharedProject = null;
                }

                // Use sharedProject if found, else instantiate our config.
                if (sharedProject) {
                    project = sharedProject;
                }
                else {
                    const projectClass = me.resolveProjectModelClass();

                    // A project config picked up from a class' `configurable` block arrives as a prototype-chained
                    // fork of the class default. Model's constructor shallow copies its incoming object, which would
                    // drop every inherited value, so flatten the chain into own properties first.
                    project = new projectClass(ObjectHelper.assign({}, project));
                }

                // Clear the property so that the updater is called.
                delete me._project;
            }



            // In the updater, configs are live
            me.buildingProjectConfig = false;
        }

        return project;
    }

    updateStoresFromCrudManager() {
        const
            { crudManager } = this,
            { isCrudManager } = crudManager;

        for (const storeName of this.constructor.projectStoreNames) {
            if (crudManager[storeName]) {

                // We configure the project with the stores, and *not* the CrudManager.
                // The CrudManager ends up having its project set and thereby adopting ours.
                this[storeName] = crudManager[storeName];

                // If it's just a config, take the stores out.
                // We will *configure* it with this project and it will ingest
                // its stores from there.
                if (!isCrudManager) {
                    delete crudManager[storeName];
                }
            }
        }
    }

    /**
     * Implement in subclass to take action when project is replaced.
     *
     * __`super.updateProject(...arguments)` must be called first.__
     *
     * @param {Scheduler.model.ProjectModel} project
     * @category Data
     */
    updateProject(project, oldProject) {
        const
            me = this,
            {
                projectListeners,
                crudManager
            }  = me;

        me.detachListeners('projectConsumer');
        me.detachListeners('projectDestroy');

        // When we set the crudManager now, it will go through to the CrudManagerVIew
        delete me._crudManager;

        if (project) {
            projectListeners.thisObj = me;
            project.ion(projectListeners);

            // An explicitly supplied standalone CrudManager instance (legacy, deprecated) takes precedence over the
            // project's own built-in CrudManager. Apply the project to it, making sure the same stores are used
            // there and here. Must not match a project bound as the crudManager — when the project is replaced at
            // runtime, the new project takes over below
            if (crudManager?.isCrudManager && !crudManager.isProjectModel) {
                crudManager.project = project;

                // CrudManager goes through the changer as usual and is initialized
                // from the Project, not any stores it was originally configured with.
                me.crudManager = crudManager;
            }
            // A raw crudManager config is applied to the project's built-in CrudManager by the changer
            else if (crudManager && !crudManager.isCrudManager) {
                me.crudManager = crudManager;
            }
            // If the project is a CrudManager, use it as such.
            else if (project.isCrudManager) {
                me.crudManager = project;
            }

            // Notifies classes that mix AttachToProjectMixin that we have a new project
            me.projectSubscribers.forEach(subscriber => {
                subscriber.detachFromProject(oldProject);
                subscriber.attachToProject(project);
            });

            // Sets the project's stores into the host object
            for (const storeName of me.constructor.projectStoreNames) {
                me[storeName] = project[storeName];
            }

            // <debug>
            me.warnTierAliasMismatch(project);
            // </debug>

            // Listeners are set up, if EventStore was configured with autoLoad now is the time to load
            if (me.delayAutoLoad) {
                // Restore the flag, not needed but to look good on inspection
                project.eventStore.autoLoad = true;
                project.eventStore.load();
            }



            // attach listeners to the new project
            project.ion({
                name          : 'projectDestroy',
                beforeDestroy : 'onProjectBeforeDestroy',
                thisObj       : me
            });
        }

        me.trigger('projectChange', { project });
    }

    // <debug>
    // A class extending a tier-resolved alias (`class Flight extends EventModel`) follows the tier of the build, not
    // the tier of the project, so a project pinned to a lower tier (`tier : 'business'`) gets higher tier models in a
    // higher tier build. Untiered sources resolve the alias to the pinned tier and hide that, which is why `tierAlias`
    // names the highest tier the alias resolves to there. Checked here rather than in the project, its `tier` field is
    // not set until its constructor returns. An alias project, like Calendar's, follows the build too.
    // A product capped below the build's tier, like Calendar, has aliases of its own at the project's tier. Its project
    // class defaults to them, so the warning points there too
    warnTierAliasMismatch(project) {
        const
            projectTier = project.constructor.tierAlias ?? project.tier,
            // The project class's own defaults, not the configs that replaced them
            defaults    = project.$meta.config;

        if (!projectTier) {
            return;
        }

        for (const [storeName, modelConfig] of Object.entries(tierAliasModelConfigs)) {
            const store = project[storeName];

            if (!store) {
                continue;
            }

            // The configured model class, not the subclass the store generates from it
            for (const [cls, config] of [
                [store.constructor, `${storeName}Class`],
                [store.originalModelClass ?? store.modelClass, modelConfig]
            ]) {
                if (cls?.tierAlias && cls.tierAlias !== projectTier && !warnedTierAliasClasses.has(cls)) {
                    const
                        own  = defaults[config],
                        hint = own?.tierAlias === projectTier
                            ? `, or the project's default ${config} (${own.$$name}),`
                            : '';
                    let alias = cls;

                    while (Object.getPrototypeOf(alias).tierAlias) {
                        alias = Object.getPrototypeOf(alias);
                    }

                    warnedTierAliasClasses.add(cls);

                    // The marker names the tier the alias resolves to in the builds of that tier, untiered sources
                    // resolve it lower
                    console.warn(
                        `${cls === alias ? 'The' : `${cls.$$name} extends the`} tier-resolved ${alias.$name}, which ` +
                        `resolves to the ${cls.tierAlias} tier in ${cls.tierAlias} builds, while the project runs at ` +
                        `the ${projectTier} tier. ${cls === alias ? 'Use' : 'Extend'} ` +
                        `${alias.$name}${StringHelper.capitalize(projectTier)}${hint} instead.`
                    );
                }
            }
        }
    }
    // </debug>

    // Implementation here because we need to get first look at it to adopt its stores
    changeCrudManager(crudManager) {
        // Set the property to be scanned for incoming stores.
        // If it's a config, it will be stripped of those stores prior to construction.
        if (this.buildingProjectConfig) {
            this._crudManager = crudManager.isCrudManager ? crudManager : { ...crudManager };
        }
        else {
            return super.changeCrudManager(crudManager);
        }
    }

    updateCrudManager(crudManager) {
        if (!this.isConfiguring && crudManager) {
            this.updateStoresFromCrudManager();
        }
    }

    onProjectBeforeDestroy(event) {
        // <remove-on-release>
        Base.skipDestroyCheck = true;
        // </remove-on-release>
        const emptyProject = new event.source.constructor();
        // <remove-on-release>
        Base.skipDestroyCheck = false;
        // </remove-on-release>

        this.project = emptyProject;
    }

    // Called when project changes are committed, after data is written back to records
    onProjectDataReady() {
        const me = this;

        // Only update the UI when we are visible
        me.whenVisible(() => {
            if (me.projectCallbacks.size) {
                me.projectCallbacks.forEach(callback => callback());
                me.projectCallbacks.clear();
            }
        }, null, null, 'onProjectDataReady');
    }



    onStartApplyChangeset() {
        this.suspendRefresh();
    }

    onEndApplyChangeset() {
        this.resumeRefresh(true);
    }

    /**
     * Accepts a callback that will be called when the underlying project is ready (no commit pending and current commit
     * finalized)
     * @param {Function} callback
     * @category Data
     */
    whenProjectReady(callback) {
        // Might already be ready, call directly
        if (this.isEngineReady) {
            callback();
        }
        else {
            this.projectCallbacks.add(callback);
        }
    }

    /**
     * Returns `true` if engine is in a stable calculated state, `false` otherwise.
     * @member {Boolean}
     * @readonly
     * @category Misc
     */
    get isEngineReady() {
        // NonWorkingTime calls this during destruction, hence the ?.
        return Boolean(this.project.isEngineReady?.());
    }

    //endregion

    //region Destroy

    // Cleanup, destroys stores if this.destroyStores is true.
    doDestroy() {
        super.doDestroy();

        if (this.destroyStores) {
            // Shared project might already be destroyed
            !this.project.isDestroyed && this.project.destroy();
        }
    }

    //endregion

    get projectStores() {
        const { projectStoreNames } = this.constructor;

        return projectStoreNames.map(storeName => this[storeName]);
    }

    static get projectStoreNames() {
        return Object.keys(this.projectStores);
    }

    static get projectDataNames() {
        return this.projectStoreNames.reduce((result, storeName) => {
            const { dataName } = this.projectStores[storeName];

            if (dataName) {
                result.push(dataName);
            }
            return result;
        }, []);
    }

    static setupProjectStores(cls, meta) {
        const { projectStores } = cls;

        if (projectStores) {
            const
                projectListeners  = {
                    name                 : 'projectConsumer',
                    dataReady            : 'onProjectDataReady',
                    change               : 'relayProjectDataChange',

                    // Next 4 handles only suspend/resume view refresh
                    startApplyChangeset  : 'onStartApplyChangeset',
                    endApplyChangeset    : 'onEndApplyChangeset',

                    startApplyingRevision : 'onStartApplyChangeset',
                    stopApplyingRevision  : 'onEndApplyChangeset'
                },
                storeConfigs      = {
                    projectListeners
                };

            let previousDataName;

            // Create a property and updater for each dataName and a changer for each store
            for (const storeName in projectStores) {
                const { dataName } = projectStores[storeName];

                // Define "eventStore" and "events" configs
                storeConfigs[storeName] = storeConfigs[dataName] = null;

                // Define up the "events" property
                if (dataName) {
                    // Getter to return store data
                    Object.defineProperty(meta.class.prototype, dataName, {
                        configurable : true, // So that Config can add its setter.
                        get() {
                            // get events() { return this.project.eventStore.records; }
                            return this.project[storeName]?.records;
                        }
                    });

                    // Create an updater for the data name;
                    this.createDataUpdater(storeName, dataName, previousDataName, meta);
                }

                this.createStoreDescriptor(meta, storeName, projectStores[storeName], projectListeners);

                // The next data updater must reference this data name
                previousDataName = dataName;
            }

            // Create the projectListeners config.
            this.setupConfigs(meta, storeConfigs);
        }
    }

    static createDataUpdater(storeName, dataName, previousDataName, meta) {
        // Create eg "updateEvents(data)".
        // We need it to call this.getConfig('resources') so that ordering of
        // data ingestion is corrected.
        meta.class.prototype[`update${StringHelper.capitalize(dataName)}`] = function(data) {
            const { project } = this;

            // Ensure a dataName that we depend on is called in.
            // For example dependencies must load in order after the events.
            previousDataName && this.getConfig(previousDataName);

            if (this.buildingProjectConfig) {
                // Set the property in the project config object, e.g. project.events = [...]
                project[dataName] = data;
            }
            else {
                // Live update the project when in use.
                project[storeName].data = data;
            }
        };
    }

    // eslint-disable-next-line bryntum/no-listeners-in-lib
    static createStoreDescriptor(meta, storeName, { listeners }, projectListeners) {
        const
            { prototype : clsProto } = meta.class,
            storeNameCap             = StringHelper.capitalize(storeName);

        // Set up onProjectEventStoreChange to set this.eventStore
        projectListeners[`${storeName}Change`] = function({ store }) {
            this[storeName] = store;
        };

        // create changeEventStore
        clsProto[`change${storeNameCap}`] = function(store, oldStore) {
            const
                me           = this,
                { project }  = me,
                storeProject = store?.project;

            if (me.buildingProjectConfig) {
                // Capture any project found at project config time
                // to use as our shared project
                if (storeProject?.isProjectModel) {
                    me._sharedProject = storeProject;
                }

                // Set the property in the project config object.
                // Must not go through the updater. It's too early to
                // inform host of store change.
                project[storeName] = store;
                return;
            }

            // Live update the project when in use.
            if (!me.initializingProject) {
                if (project[storeName] !== store) {
                    project[`set${storeNameCap}`](store);
                    store = project[storeName];
                }
            }

            // Implement processing here instead of creating a separate updater.
            // Subclasses can implement updaters.
            if (store !== oldStore) {
                if (listeners) {
                    listeners.thisObj = me;
                    listeners.name = `${storeName}Listeners`;
                    // Ensure we don't trigger one refresh per record during data loading
                    listeners.startApplyChangeset = 'onProjectStoreStartApplyChangeset';
                    listeners.endApplyChangeset = 'onProjectStoreEndApplyChangeset';

                    me.detachListeners(listeners.name);

                    store.ion(listeners);
                }

                // Set backing var temporarily, so it can be accessed from AttachToProjectMixin subscribers
                me[`_${storeName}`] = store;

                // Notifies classes that mix AttachToProjectMixin that we have a new XxxxxStore
                me.projectSubscribers.forEach(subscriber => {
                    subscriber[`attachTo${storeNameCap}`]?.(store);
                });

                me[`_${storeName}`] = null;
            }
            return store;
        };
    }

    onProjectStoreStartApplyChangeset() {
        this.suspendRefresh();
    }

    onProjectStoreEndApplyChangeset() {
        this.resumeRefresh(true);
    }

    relayProjectDataChange(event) {
        // Don't trigger change event for tree node collapse/expand
        if ((event.isExpand || event.isCollapse) && !event.records[0].fieldMap.expanded.persist) {
            return;
        }

        /**
         * Fired when data in any of the projects stores changes.
         *
         * Basically a relayed version of each store's own change event, decorated with which store it originates from.
         * See the {@link Core.data.Store#event-change store change event} documentation for more information.
         *
         * @event dataChange
         * @param {Scheduler.data.mixin.ProjectConsumer} source Owning component
         * @ts-param source {typeof Scheduler.data.mixin.ProjectConsumer|any}
         * @param {Scheduler.model.mixin.ProjectModelMixin} project Project model
         * @ts-param project {typeof Scheduler.model.mixin.ProjectModelMixin|any}
         * @param {Core.data.Store} store Affected store
         * @param {'remove'|'removeAll'|'add'|'clearchanges'|'filter'|'update'|'dataset'|'replace'} action
         * Name of action which triggered the change. May be one of:
         * * `'remove'`
         * * `'removeAll'`
         * * `'add'`
         * * `'clearchanges'`
         * * `'filter'`
         * * `'update'`
         * * `'dataset'`
         * * `'replace'`
         * @param {Core.data.Model} record Changed record, for actions that affects exactly one record (`'update'`)
         * @param {Core.data.Model[]} records Changed records, passed for all actions except `'removeAll'`
         * @param {Object} changes Passed for the `'update'` action, info on which record fields changed
         */
        return this.trigger('dataChange', { project : event.source, ...event, source : this });
    }

    //region WidgetClass

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}

    //endregion
};
