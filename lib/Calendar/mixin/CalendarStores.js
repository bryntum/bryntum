import Base from '../../Core/Base.js';
import ProjectConsumer from '../../Scheduler/data/mixin/ProjectConsumer.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import ProjectModel from '../model/ProjectModel.js';


/**
 * @module Calendar/mixin/CalendarStores
 */

/**
 * Mixin that provides store management and data binding for the Calendar. It connects the Calendar to its
 * underlying data stores (event store, resource store, time range store) through a
 * {@link Calendar.model.ProjectModel project}, and manages the CrudManager for server communication. This
 * mixin also handles default calendar assignment for new events, time zone configuration, and propagation
 * of store references to child widgets such as the sidebar date picker and resource filter.
 *
 * Classes that use this mixin gain access to data stores. For example, through a Calendar:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     // Inline event data
 *     events : [
 *         { id : 1, name : 'Meeting', startDate : '2024-01-15 09:00', endDate : '2024-01-15 10:00' }
 *     ],
 *     // Inline resource data
 *     resources : [
 *         { id : 1, name : 'Default Calendar', eventColor : 'b-blue' }
 *     ],
 *     // Assign events to the default resource
 *     defaultCalendar : 1
 * });
 *
 * // Access stores programmatically
 * calendar.eventStore.add({ name : 'New event', startDate : '2024-01-16 14:00', endDate : '2024-01-16 15:00' });
 * ```
 *
 * ## See also
 *
 * - {@link Calendar.model.ProjectModel} — The project that bundles all stores
 * - {@link Calendar.data.CrudManager} — CrudManager for server communication
 * - {@link Calendar.view.Calendar} — The Calendar class that uses this mixin
 *
 * @mixin
 * @extends Scheduler/data/mixin/ProjectConsumer
 */
export default Target => class CalendarStores extends ProjectConsumer(Target || Base) {
    static $name = 'CalendarStores';

    static configurable = {
        /**
         * The calendar ({@link Scheduler.model.ResourceModel Resource}), (or its `id`) to use as the
         * default calendar for new events created using {@link Calendar.view.Calendar#config-autoCreate dblclick}
         * or {@link Calendar.feature.CalendarDrag drag-create}, or {@link Calendar.feature.ExternalEventSource dragging in}.
         *
         * May be specified as the `id` of an existing resource, or a resource record that is present in the project.
         *
         * If not specified, the first record in the {@link #property-resourceStore} will be used.
         *
         * If specified as `null`, then new events created using {@link Calendar.view.Calendar#config-autoCreate dblclick}
         * or {@link Calendar.feature.CalendarDrag drag-create}, or {@link Calendar.feature.ExternalEventSource dragging in}
         * will not be automatically assigned a calendar.
         * @config {String|Number|Scheduler.model.ResourceModel}
         */
        defaultCalendar : null,



        projectModelClass : ProjectModel
    };

    //region Default config

    // This is the static definition of the Stores we consume from the project, and
    // which we must provide *TO* the project if we or our CrudManager is configured
    // with them.
    // The property name is the store name, and within that there is the dataName which
    // is the property which provides static data definition. And there is a listeners
    // definition which specifies the listeners *on this object* for each store.
    //
    // To process incoming stores, implement an updateXxxxxStore method such
    // as `updateEventStore(eventStore)`.
    //
    // To process an incoming Project implement `updateProject`. __Note that
    // `super.updateProject(...arguments)` must be called first.__
    static get projectStores() {
        return {
            resourceStore : {
                dataName  : 'resources',
                // eslint-disable-next-line bryntum/no-listeners-in-lib
                listeners : {
                    changePreCommit : 'onCalendarStoreChange'
                }
            },

            eventStore : {
                dataName  : 'events',
                // eslint-disable-next-line bryntum/no-listeners-in-lib
                listeners : {
                    changePreCommit : 'onCalendarStoreChange',
                    idChange        : 'onEventIdChange'
                }
            },

            assignmentStore : {
                dataName : 'assignments'
            },


        };
    }



    /**
     * Inline events, will be loaded into the {@link #property-eventStore}.
     * @prp {Scheduler.model.EventModel[]|EventModelConfig[]} events
     * @category Data
     */

    /**
     * The {@link Scheduler.data.EventStore} or a reconfiguring object for a store which will hold
     * the events to be rendered into the Calendar.
     * @config {Scheduler.data.EventStore|EventStoreConfig} eventStore
     * @category Data
     */
    /**
     * The {@link Scheduler.data.EventStore} holding the events to be rendered into the Calendar.
     * @member {Scheduler.data.EventStore} eventStore
     * @readonly
     * @category Data
     */

    /**
     * Inline resources, will be loaded into the {@link #property-resourceStore}.
     * @prp {Scheduler.model.ResourceModel[]|ResourceModelConfig[]} resources
     * @category Data
     */

    /**
     * The {@link Scheduler.data.ResourceStore} or a reconfiguring object for a store which will hold the resources to be rendered into the Calendar.
     * @config {Scheduler.data.ResourceStore|ResourceStoreConfig} resourceStore
     * @category Data
     */
    /**
     * The {@link Scheduler.data.ResourceStore} holding the resources to be rendered into the Calendar.
     * @member {Scheduler.data.ResourceStore} resourceStore
     * @readonly
     * @category Data
     */

    /**
     * Inline assignments, will be loaded into the {@link #property-assignmentStore}.
     * @prp {Scheduler.model.AssignmentModel[]|AssignmentModelConfig[]} assignments
     * @category Data
     */

    /**
     * The {@link Scheduler.data.AssignmentStore} or a reconfiguring object for a store which will hold assignments linking resources to events.
     * @config {Scheduler.data.AssignmentStore|AssignmentStoreConfig} assignmentStore
     * @category Data
     */
    /**
     * The {@link Scheduler.data.AssignmentStore} holding assignments linking resources to events.
     * @member {Scheduler.data.AssignmentStore} assignmentStore
     * @readonly
     * @category Data
     */



    //endregion

    //region CrudManager

    changeCrudManager(crudManager) {
        const
            me          = this,
            { project } = me;

        // While the project config is being built there is no project instance yet — just capture the raw value
        // (clone of a raw config, to be able to safely extract stores from it). It is processed by updateProject
        // once the project instance exists
        if (me.buildingProjectConfig) {
            me._crudManager = crudManager?.isCrudManager ? crudManager : crudManager && { ...crudManager };
            return;
        }

        // The project has CrudManager functionality built in, a raw crudManager config is applied to it.
        // Standalone CrudManager instances (or configs with an explicit `type`) are still supported for
        // backwards compatibility (deprecated)
        if (crudManager && !crudManager.isCrudManager && !crudManager.type && !crudManager.isProjectModel && project?.isCrudManager) {
            VersionHelper.deprecate('9.0.0', 'The `crudManager` config is deprecated. The project has the ' +
                'CrudManager functionality built in, configure `transport`, `autoLoad`, `autoSync` etc. on the ' +
                '`project` config instead');

            // Configuring server communication using both approaches at once is ambiguous
            if (
                (crudManager.transport || crudManager.loadUrl || crudManager.syncUrl) &&
                (project.loadUrl || project.syncUrl)
            ) {
                throw new Error(
                    'Configure CrudManager transport either on the project or using the crudManager config, not both'
                );
            }

            // Assigning `crudStores` (or its classic CrudManager alias `stores`) to the constructed project would
            // replace its store registry, losing the project's own stores — append the extra stores instead,
            // first in the load order like the standalone CrudManager does
            const crudStores = crudManager.crudStores || crudManager.stores;

            if (crudStores) {
                crudManager = { ...crudManager };
                delete crudManager.crudStores;
                delete crudManager.stores;
            }

            // Pass the CrudManager config on to the project's built-in CrudManager
            ObjectHelper.assign(project, crudManager);

            if (crudStores) {
                project.addCrudStore(crudStores, 0);
            }

            // autoLoad is normally handled in afterConstruct(), which has already run for the project
            if (project.autoLoad && !project._autoLoadPromise) {
                project._autoLoadPromise = project.doAutoLoad();
            }

            crudManager = project;
        }

        if (crudManager && !crudManager.isCrudManager) {
            const type = crudManager.type || me.crudManagerClass;

            //<debug>
            if (!type) {
                throw new Error('No CrudManager class configured on CrudManager\'s View');
            }
            //</debug>

            // CrudManager injects itself into is Scheduler's _crudManager property
            // because code it triggers needs to access it through its getter.
            crudManager = type.new({
                scheduler : me
            }, crudManager);
        }

        me.bindCrudManager?.(crudManager);

        // config setter will veto because of above described behaviour
        // of setting the property early on creation
        me._crudManager = null;

        return crudManager;
    }

    //endregion

    // May be implemented in subclasses.
    onEventIdChange() {}



    /**
     * The default Calendar to be used when creating new events which do not initially have a resource.
     *
     * When *set*, this may be specified as either the `id` of an existing resource, or a resource record that is present in the project.
     *
     * When *read*, this returns the resource record which is the default calendar. If there is no default calendar, this returns `undefined`.
     * This includes {@link Calendar.view.Calendar#config-autoCreate dblclick-created} events and
     * {@link Calendar.feature.CalendarDrag drag-created} events and
     * {@link Calendar.feature.ExternalEventSource dragged in} events.
     * @member {Scheduler.model.ResourceModel}
     * @accepts {String|Number|Scheduler.model.ResourceModel}
     */
    get defaultCalendar() {
        const
            { eventStore }  = this,
            defaultCalendar = ObjectHelper.hasOwn(this, '_defaultCalendar') ? this._defaultCalendar : eventStore.defaultCalendarId;

        if (defaultCalendar !== null) {
            return defaultCalendar != undefined ? (defaultCalendar.isResourceModel ? defaultCalendar : eventStore.resourceStore.getById(defaultCalendar)) : eventStore.resourceStore.first;
        }
    }

    get defaultCalendarId() {
        return this.eventStore.modelClass.asId(this.defaultCalendar);
    }

    //region Project

    updateProject(project, oldProject) {
        super.updateProject(project, oldProject);

        const me = this;

        // Now is the time to force timeZone ingestion. When we have all our stores.
        me.getConfig('timeZone');

        me.detachListeners('CalendarStores');

        if (project) {
            project.ion({
                name      : 'CalendarStores',
                dataReady : 'onCalendarStoreChange',
                refresh   : 'onProjectRefresh',
                thisObj   : me
            });

            // Assigned a project at runtime
            if (!me.isConfiguring) {
                me.eachView(view => {
                    view.project = project;
                });
                me.onCalendarStoreChange({ source : project });
            }
        }
    }

    onProjectRefresh({ source : project, isInitialCommit }) {
        // Force reevaluation of date indices next time requested because the
        // initial project commit may have rescheduled the events.
        if (isInitialCommit) {
            project.eventStore.invalidateDayIndices();
        }
    }

    updateEventStore(eventStore) {
        // Decorate the eventStore's createRecord method to inject our defaultCalendar into new
        // events as the default resource.
        if (eventStore && !eventStore.isCalendarEventStore) {
            const storeOwner = this;

            Object.defineProperty(eventStore, 'defaultCalendar', {
                get : () => storeOwner.defaultCalendar
            });

            eventStore.isCalendarEventStore = true;

            // Events should stay available when they are deassigned unless requested otherwise
            if (!('removeUnassignedEvent' in eventStore.initialConfig)) {
                eventStore.removeUnassignedEvent = false;
            }
        }
    }

    //endregion

    //region ChronoWidget compatibility

    set taskStore(store) {
        this.eventStore = store;
    }

    get taskStore() {
        return this.eventStore;
    }

    //endregion

    //region WidgetClass

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}

    //endregion
};
