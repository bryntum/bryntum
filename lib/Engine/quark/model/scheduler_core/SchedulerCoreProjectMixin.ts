import { Mixin, AnyConstructor } from "../../../../ChronoGraph/class/BetterMixin.js"
import { SchedulerCoreEvent } from "./SchedulerCoreEvent.js"
import Store from "../../../../Core/data/Store.js"
import Model from "../../../../Core/data/Model.js"
import Delayable, { DelayableMixin } from "../../../../Core/mixin/Delayable.js"
import { CoreEventStoreMixin } from "../../store/CoreEventStoreMixin.js"
import { CorePartOfProjectModelMixin } from "../mixin/CorePartOfProjectModelMixin.js"
import { CoreAssignmentMixin } from "./CoreAssignmentMixin.js"
import { CoreAssignmentStoreMixin } from "../../store/CoreAssignmentStoreMixin.js"
import { CoreResourceMixin } from "./CoreResourceMixin.js"
import { CoreResourceStoreMixin } from "../../store/CoreResourceStoreMixin.js"
import { CorePartOfProjectGenericMixin } from "../../CorePartOfProjectGenericMixin.js"
import { CoreDependencyStoreMixin } from "../../store/CoreDependencyStoreMixin.js"
import { CoreDependencyMixin } from "./CoreDependencyMixin.js"
import { CoreCalendarMixin } from './CoreCalendarMixin.js'
import { CoreCalendarManagerStoreMixin } from '../../store/CoreCalendarManagerStoreMixin.js'
import { delay } from "../../../util/Functions.js"

import { AbstractProjectMixin } from "../AbstractProjectMixin.js"
import ObjectHelper from "../../../../Core/helper/ObjectHelper.js"


export class DelayableWrapper extends Mixin(
    [],
    Delayable as ((base : AnyConstructor) => AnyConstructor<DelayableMixin>)
){}


/**
 * The data package format describing project data
 */
export type ProjectDataPackage = {
    eventsData?             : any[]
    tasksData?              : any[]
    dependenciesData?       : any[]
    resourcesData?          : any[]
    assignmentsData?        : any[]
    calendarsData?          : any[]

    events?             : any[]
    tasks?              : any[]
    dependencies?       : any[]
    resources?          : any[]
    assignments?        : any[]
    calendars?          : any[]
}

/**
 * This is a project, implementing _basic scheduling_ as [[SchedulerBasicProjectMixin]] does.
 * Yet this class does not use _chronograph_ based engine.
 *
 * @tier community
 */
export class SchedulerCoreProjectMixin extends Mixin(
    [
        AbstractProjectMixin,
        CorePartOfProjectGenericMixin,
        DelayableWrapper,
        Model
    ],
    (base : AnyConstructor<
        AbstractProjectMixin &
        CorePartOfProjectGenericMixin &
        DelayableWrapper &
        Model
        ,
        typeof AbstractProjectMixin &
        typeof CorePartOfProjectGenericMixin &
        typeof DelayableWrapper &
        typeof Model
    >) => {
    const superProto : InstanceType<typeof base> = base.prototype

    class SchedulerCoreProjectMixin extends base {

        static $name = 'SchedulerCoreProjectMixin';

        static get fields () : any {
            return [
                { name : 'startDate', type : 'date' },
                { name : 'endDate', type : 'date' }
            ]
        }

        startDate : Date

        endDate : Date

        //region Config

        static applyConfigs = true

        static get configurable () : any {
            return {


                eventStore                : {},
                assignmentStore           : {},
                resourceStore             : {},
                dependencyStore           : {},
                calendarManagerStore      : {},

                eventModelClass           : SchedulerCoreEvent,
                assignmentModelClass      : CoreAssignmentMixin,
                resourceModelClass        : CoreResourceMixin,
                dependencyModelClass      : CoreDependencyMixin,
                calendarModelClass        : CoreCalendarMixin,

                eventStoreClass           : CoreEventStoreMixin,
                assignmentStoreClass      : CoreAssignmentStoreMixin,
                resourceStoreClass        : CoreResourceStoreMixin,
                dependencyStoreClass      : CoreDependencyStoreMixin,
                calendarManagerStoreClass : CoreCalendarManagerStoreMixin
            }
        }

        /**
         * The constructor for the "Event" entity of the project.
         */
        eventModelClass           : typeof SchedulerCoreEvent

        assignmentModelClass      : typeof CoreAssignmentMixin

        resourceModelClass        : typeof CoreResourceMixin

        dependencyModelClass      : typeof CoreDependencyMixin

        calendarModelClass        : typeof CoreCalendarMixin

        /**
         * The constructor for the "Events" collection of the project
         */
        eventStoreClass           : typeof CoreEventStoreMixin

        assignmentStoreClass      : typeof CoreAssignmentStoreMixin

        resourceStoreClass        : typeof CoreResourceStoreMixin

        dependencyStoreClass      : typeof CoreDependencyStoreMixin

        calendarManagerStoreClass : typeof CoreCalendarManagerStoreMixin


        eventStore               : CoreEventStoreMixin

        dependencyStore          : CoreDependencyStoreMixin

        resourceStore            : CoreResourceStoreMixin

        assignmentStore          : CoreAssignmentStoreMixin

        calendarManagerStore     : CoreCalendarManagerStoreMixin

        $invalidated              : Set<CorePartOfProjectModelMixin>

        $leaving                  : Set<CorePartOfProjectModelMixin>

        /**
         * The events data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         *
         * ```typescript
         * const project    = new SchedulerBasicProjectMixin({
         *     eventsData   : [ { name : 'Task 1' } ]
         * })
         * ```
         * @deprecated Use [[events]] instead
         */
        eventsData                  : any[]

        /**
         * The dependencies data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         * @deprecated Use [[dependencies]] instead
         */
        dependenciesData            : any[]

        /**
         * The resources data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         * @deprecated Use [[resources]] instead
         */
        resourcesData               : any[]

        /**
         * The assignments data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         * @deprecated Use [[assignments]] instead
         */
        assignmentsData             : any[]

        /**
         * The calendars data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         * @deprecated Use [[calendars]] instead
         */
        calendarsData               : any[]


        /**
         * The events data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         *
         * ```typescript
         * const project    = new SchedulerBasicProjectMixin({
         *     events   : [ { name : 'Task 1' } ]
         * })
         * ```
         */
        events                  : any[]

        /**
         * The dependencies data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         */
        dependencies            : any[]

        /**
         * The resources data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         */
        resources               : any[]

        /**
         * The assignments data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         */
        assignments             : any[]

        /**
         * The calendars data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         */
        calendars               : any[]

        tasks                   : any[] // For TaskBoard

        defaultCalendar             : CoreCalendarMixin

        // Did not feel worth a mixin, so little code and core only allows it on project
        $calendar                   : CoreCalendarMixin


        // <remove-on-release>
        // TODO: Add actual field
        // </remove-on-release>
        /**
         * This property is used when instantiating the default calendar of the project. This calendar will have no availability intervals,
         * so this setting will either turn the whole timespan into working time or non-working.
         *
         * Default value is `true`
         */
        unspecifiedTimeIsWorking    : boolean



        isPerformingCommit          : boolean

        silenceInitialCommit        : boolean

        ongoing                     : Promise<any>

        isSharingAssignmentStore    : boolean


        //endregion


        //region Init


        construct (config : Partial<this> = {}) {
            const me                                = this

            const { resources, events, dependencies, assignments, calendars } = config

            delete config.resources
            delete config.events
            delete config.dependencies
            delete config.assignments
            delete config.calendars
            delete config.tasks

            // Cannot be created with declaration, because of how TS is compiled to JS. Ends up after `construct()`
            me.$invalidated                         = new Set<CorePartOfProjectModelMixin>()
            me.$leaving                             = new Set<CorePartOfProjectModelMixin>()

            // Define default values for these flags here
            // if defined where declared then TS compiles them this way:
            // constructor() {
            //     super(...arguments)
            //     this.isPerformingCommit   = false
            //     this.silenceInitialCommit = true
            //     this.ongoing              = Promise.resolve()
            // }
            // which messes the flags values for inline data loading (since it's async)
            me.isPerformingCommit                   = false
            me.silenceInitialCommit                 = true
            me.ongoing                              = Promise.resolve()

            if (config.eventStore && !config.assignmentStore) {
                const eventStore                    = (config.eventStore.masterStore as CoreEventStoreMixin) || config.eventStore
                // If chained from a CrudManager, the assignment store might not be part of a project, and we might
                // need to ingest it from the CrudManager
                // @ts-ignore
                const assignmentStore               = eventStore.assignmentStore || eventStore.crudManager?.assignmentStore
                // In this case we must ingest the assignment store from the eventStore
                if (assignmentStore?.isAssignmentStore) {
                     config.assignmentStore         = assignmentStore
                     me.isSharingAssignmentStore    = true
                }
            }
            superProto.construct.call(me, config)

            // not part of the CalendarManagerStore intentionally, not persisted
            me.defaultCalendar                      = new me.calendarManagerStore.modelClass({
                unspecifiedTimeIsWorking: me.unspecifiedTimeIsWorking
            })

            me.defaultCalendar.project              = me

            const {
                calendarsData,
                eventsData,
                dependenciesData,
                resourcesData,
                assignmentsData,
            }                                      = me

            const hasInlineData                    = Boolean(calendarsData || eventsData  || dependenciesData || resourcesData || assignmentsData || calendars || events || dependencies || resources || assignments)

            if (hasInlineData) {
                me.loadInlineData({
                    calendarsData,
                    eventsData,
                    dependenciesData,
                    resourcesData,
                    assignmentsData,
                    calendars,
                    events,
                    dependencies,
                    resources,
                    assignments
                })

                delete me.calendarsData
                delete me.eventsData
                delete me.dependenciesData
                delete me.resourcesData
                delete me.assignmentsData
            }
            else {
                // Trigger initial commit
                me.bufferedCommitAsync()
            }
        }

        doDestroy () {
            const me = this

            me.eventStore?.destroy()
            me.dependencyStore?.destroy()
            me.assignmentStore?.destroy()
            me.resourceStore?.destroy()
            me.calendarManagerStore?.destroy()
            me.defaultCalendar.destroy()



            superProto.doDestroy.call(this)
        }

        /**
         * This method loads the "raw" data into the project. The loading is basically happening by
         * assigning the individual data entries to the `data` property of the corresponding store.
         *
         * @param data
         */
        async loadInlineData (data : ProjectDataPackage) : Promise<any> {
            const me                         = this

            me.isLoadingInlineData           = true

            // @ts-ignore
            me.dataPropertyDeprecation?.(data || {})

            if (data.calendars || data.calendarsData) {
                me.calendarManagerStore.data = data.calendars || data.calendarsData
            }
            if (data.resources || data.resourcesData) {
                me.resourceStore.data        = data.resources || data.resourcesData
            }
            if (data.assignments || data.assignmentsData) {
                me.assignmentStore.data      = data.assignments || data.assignmentsData
            }
            if (data.events || data.eventsData) {
                me.eventStore.data           = data.events || data.eventsData
            }
            if (data.tasks || data.tasksData) {
                me.eventStore.data           = data.tasks || data.tasksData
            }
            if (data.dependencies || data.dependenciesData) {
                me.dependencyStore.data      = data.dependencies || data.dependenciesData
            }

            await me.commitLoad()

            me.isLoadingInlineData           = false

            return
        }


        //endregion


        //region Join


        async commitLoad () {
            await this.commitAsync()

            // Might have been destroyed during the async operation above
            if (!this.isDestroyed) this.trigger('load')
        }


        //endregion


        //region EventStore


        resolveStoreAndModelClass (name : string, config : any) {
            // storeClass from supplied config (as a class, or as a registered store factory `type`) or our properties
            const storeClass = config?.storeClass || (config?.type ? (Store as any).resolveType(config.type) : this[`${name}StoreClass`])

            // modelClass from supplied config
            let modelClass = config?.modelClass

            if (!modelClass) {
                // or from storeClass.modelClass if customized
                // @ts-ignore
                if (this.getDefaultConfiguration()[`${name}ModelClass`] !== storeClass.getDefaultConfiguration().modelClass) {
                    modelClass = storeClass.getDefaultConfiguration().modelClass
                }
                // and if none of the above, use from our properties
                else {
                    modelClass = this[`${name}ModelClass`]
                }
            }

            return { storeClass, modelClass }
        }

        setEventStore (eventStore : CoreEventStoreMixin) {
            this.eventStore = eventStore
        }

        changeEventStore (eventStore : CoreEventStoreMixin, oldStore : CoreEventStoreMixin) {
            const
                me       = this


            me.detachStore(oldStore)

            if (!(eventStore instanceof Store)) {
                const { storeClass, modelClass } = me.resolveStoreAndModelClass('event', eventStore)

                eventStore = new storeClass(ObjectHelper.assign({
                    modelClass,

                    project    : me
                }, eventStore))
            }
            else {
                eventStore.project = me

                // Stores chained from another project are handled by that project — skip STM/engine integration
                if (!eventStore.isChainedFromProject) {

                    eventStore.joinRecordsToProject(me)
                }
            }

            if (oldStore) {

                oldStore.unjoinRecordsFromProject(me)

                const { assignmentsForRemoval } = oldStore

                // remap the assignment
                assignmentsForRemoval.forEach(assignment => {
                    const oldEvent      = assignment.event as SchedulerCoreEvent

                    if (oldEvent) {
                        const newEvent  = eventStore.getById(oldEvent.id)

                        if (newEvent) {
                            assignment.event    = newEvent
                            // keep the assignment
                            assignmentsForRemoval.delete(assignment)
                        }
                    }
                })

                oldStore.afterEventRemoval()
            }

            // Stores chained from another project already have project set above
            if (!eventStore.isChainedFromProject) {
                eventStore.setProject(me)
            }

            return eventStore
        }

        updateEventStore(eventStore : CoreEventStoreMixin, oldStore : CoreEventStoreMixin) {
            this.attachStore(eventStore)

            this.trigger('eventStoreChange', { store : eventStore })
        }


        //endregion


        //region AssignmentStore


        setAssignmentStore (assignmentStore : CoreAssignmentStoreMixin) {
            this.assignmentStore = assignmentStore
        }

        changeAssignmentStore (assignmentStore : CoreAssignmentStoreMixin, oldStore : CoreAssignmentStoreMixin) {
            const
                me       = this


            me.detachStore(oldStore)

            if (oldStore) {

                oldStore.unjoinRecordsFromProject(me)
            }

            if (!(assignmentStore instanceof Store)) {
                const { storeClass, modelClass } = me.resolveStoreAndModelClass('assignment', assignmentStore)

                assignmentStore = new storeClass(ObjectHelper.assign({
                    modelClass,

                    project    : me
                }, assignmentStore))
            }
            else {
                assignmentStore.project = me

                // Stores chained from another project are handled by that project — skip STM/engine integration
                if (!assignmentStore.isChainedFromProject) {

                    assignmentStore.joinRecordsToProject(me)
                }
            }

            // Stores chained from another project already have project set above
            if (!assignmentStore.isChainedFromProject) {
                assignmentStore.setProject(me)
            }
            return assignmentStore
        }

        updateAssignmentStore (assignmentStore : CoreAssignmentStoreMixin, oldStore : CoreAssignmentStoreMixin) {
            this.attachStore(assignmentStore)

            this.trigger('assignmentStoreChange', { store : assignmentStore })
        }


        //endregion


        //region ResourceStore

        setResourceStore (resourceStore : CoreResourceStoreMixin) {
            this.resourceStore = resourceStore
        }


        changeResourceStore (resourceStore : CoreResourceStoreMixin, oldStore : CoreResourceStoreMixin) {
            const
                me       = this


            me.detachStore(oldStore)

            if (!(resourceStore instanceof Store)) {
                const { storeClass, modelClass } = me.resolveStoreAndModelClass('resource', resourceStore)

                resourceStore = new storeClass(ObjectHelper.assign({
                    modelClass,

                    project    : me
                }, resourceStore))
            }
            else {
                resourceStore.project = me

                // Stores chained from another project are handled by that project — skip STM/engine integration
                if (!resourceStore.isChainedFromProject) {

                    resourceStore.joinRecordsToProject(me)
                }
            }

            if (oldStore) {

                oldStore.unjoinRecordsFromProject(me)

                const { assignmentsForRemoval } = oldStore

                // remap the assignment
                assignmentsForRemoval.forEach(assignment => {
                    const oldResource      = assignment.resource as CoreResourceMixin

                    if (oldResource) {
                        const newResource  = resourceStore.getById(oldResource.id)

                        if (newResource) {
                            assignment.resource    = newResource
                            // keep the assignment
                            assignmentsForRemoval.delete(assignment)
                        }
                    }
                })

                oldStore.afterResourceRemoval()
            }

            // Stores chained from another project already have project set above
            if (!resourceStore.isChainedFromProject) {
                resourceStore.setProject(me)
            }
            return resourceStore
        }

        updateResourceStore (resourceStore : CoreResourceStoreMixin, oldStore : CoreResourceStoreMixin) {
            this.attachStore(resourceStore)

            this.trigger('resourceStoreChange', { store : resourceStore })
        }


        //endregion


        //region DependencyStore

        setDependencyStore (dependencyStore : CoreDependencyStoreMixin) {
            this.dependencyStore = dependencyStore
        }


        changeDependencyStore (dependencyStore : CoreDependencyStoreMixin, oldStore : CoreDependencyStoreMixin) {
            const me                = this

            me.detachStore(oldStore)

            if (!(dependencyStore instanceof Store)) {
                const { storeClass, modelClass } = me.resolveStoreAndModelClass('dependency', dependencyStore)

                dependencyStore     = new storeClass(ObjectHelper.assign({
                    modelClass,

                    project    : me
                }, dependencyStore))
            }
            else {
                dependencyStore.project = me

                // Stores chained from another project are handled by that project — skip STM/engine integration
                if (!dependencyStore.isChainedFromProject) {

                    dependencyStore.joinRecordsToProject(me)
                }
            }

            return dependencyStore
        }

        updateDependencyStore (dependencyStore : CoreDependencyStoreMixin, oldStore : CoreDependencyStoreMixin) {
            this.attachStore(dependencyStore)

            this.trigger('dependencyStoreChange', { store : dependencyStore })
        }


        //endregion


        //region CalendarManagerStore

        setCalendarManagerStore (calendarManagerStore : CoreCalendarManagerStoreMixin) {
            this.calendarManagerStore = calendarManagerStore
        }

        changeCalendarManagerStore (calendarManagerStore : CoreCalendarManagerStoreMixin, oldStore : CoreCalendarManagerStoreMixin) {
            const me                      = this

            me.detachStore(oldStore)

            if (!(calendarManagerStore instanceof Store)) {
                // @ts-ignore
                const storeClass = calendarManagerStore?.storeClass || me.calendarManagerStoreClass
                // @ts-ignore
                const modelClass = calendarManagerStore?.modelClass || storeClass.getDefaultConfiguration().modelClass || me.calendarModelClass

                calendarManagerStore      = new storeClass(ObjectHelper.assign({
                    modelClass,

                    project    : me
                }, calendarManagerStore))
            }
            else {
                calendarManagerStore.project = me


            }

            // Stores chained from another project already have project set above
            if (!calendarManagerStore.isChainedFromProject) {
                calendarManagerStore.setProject(me)
            }
            return calendarManagerStore
        }

        updateCalendarManagerStore (calendarManagerStore : CoreCalendarManagerStoreMixin, oldStore : CoreCalendarManagerStoreMixin) {
            this.attachStore(calendarManagerStore)

            this.trigger('calendarManagerStoreChange', { store : calendarManagerStore })
        }


        //endregion


        //region Calendar


        get calendar () : CoreCalendarMixin {
            return this.$calendar || this.defaultCalendar
        }


        set calendar (calendar) {
            this.$calendar = calendar
        }


        get effectiveCalendar () : CoreCalendarMixin {
            return this.calendar
        }


        //endregion


        //region Add records


        async addEvent (event : InstanceType<this[ 'eventModelClass' ]>) : Promise<any> {
            this.eventStore.add(event)

            return this.commitAsync()
        }


        async addAssignment (assignment : InstanceType<this[ 'assignmentModelClass' ]>) : Promise<any> {
            this.assignmentStore.add(assignment)

            return this.commitAsync()
        }


        async addResource (resource : InstanceType<this[ 'resourceModelClass' ]>) : Promise<any> {
            this.resourceStore.add(resource)

            return this.commitAsync()
        }


        async addDependency (dependency : InstanceType<this[ 'dependencyModelClass' ]>) : Promise<any> {
            this.dependencyStore.add(dependency)

            return this.commitAsync()
        }


        //endregion


        //region Auto commit


        // Buffer commitAsync using setTimeout. Not using `buffer` on purpose, for performance reasons and to better
        // mimic how graph does it
        bufferedCommitAsync () {
            if (!this.hasPendingAutoCommit) {
                this.setTimeout({
                    fn    : () => this.commitAsync?.(),
                    name  : 'commitAsync',
                    delay : 10
                })
            }
        }


        get hasPendingAutoCommit () : boolean {
            return this.hasTimeout('commitAsync')
        }


        unScheduleAutoCommit () {
            this.clearTimeout('commitAsync')
        }


        //endregion


        //region Commit

        async commitAsync () : Promise<any> {
            if (this.isPerformingCommit) return this.ongoing

            this.trigger('beforeCommit')

            return this.ongoing = this.doCommitAsync()
        }


        async doCommitAsync () : Promise<any> {
            const me              = this

            // Do not do anything if there is nothing to process
            if (!me.$invalidated.size && !me.$leaving.size && !me.hasLoadedDataToCommit && !me.isInitialCommit) {
                // Matching real project behavior by triggering here
                me.trigger('commitFinalized')
                return
            }

            me.$leaving.clear()

            me.isPerformingCommit = true

            await delay(0)

            if (!me.isDestroying) {
                // Cancel any outstanding commit, what ever changed will be handled below
                me.unScheduleAutoCommit()

                // Calculate all invalidated records, updates their data silently
                for (const record of me.$invalidated) {
                    record.calculateInvalidated()
                }

                // Hook used by Gantt community engine for dependency cascade + summary task roll-up. Runs *after*
                // date/duration normalization, and *before* the finalize loop to keep it in same STM transaction
                await me.propagateChanges()

                const { isInitialCommit, silenceInitialCommit } = me

                // apply changes silently if this is initial commit and "silenceInitialCommit" option is enabled
                const silenceCommit                             = isInitialCommit && silenceInitialCommit

                // Notify stores that care about commit (internal)
                me.assignmentStore.onCommitAsync()
                me.dependencyStore.onCommitAsync()

                me.isInitialCommitPerformed = true
                me.hasLoadedDataToCommit    = false
                me.isPerformingCommit       = false

                const stores = [me.assignmentStore, me.dependencyStore, me.eventStore, me.resourceStore, me.calendarManagerStore]

                stores.forEach(store => {
                    store.suspendAutoCommit?.()

                    // Suspend reapplySortersOnUpdate to avoid multiple sorts
                    store.suspendSortOnUpdate?.()
                })

                me.isWritingData = true

                // "Real" project triggers refresh before data is written back to records
                me.trigger('refresh', { isInitialCommit, isCalculated : true })

                // Coalesce the per-record change announcements from the finalize loop into a single `hasChanges`
                // (a change that propagates touches many records, but should still report once). Resumed below — after
                // `dataReady` — which fires `hasChanges`/`noChanges` exactly once. No-op for a bare engine project
                // without a crud manager. Skipped for the silent (initial) commit, which announces nothing anyway.
                if (!silenceCommit) (me as any).suspendChangeTracking?.()

                // If we are not announcing changes, take a cheaper path
                if (silenceCommit) {
                    for (const record of me.$invalidated) {
                        record.finalizeInvalidated(true)
                    }
                }
                else {
                    // Two loops looks a bit weird, but needed since editing assignment might affect event etc.
                    // And we do only want a single update in the end

                    // 1. Start batches and perform all calculations
                    for (const record of me.$invalidated) {
                        record.beginBatch(true)
                        record.finalizeInvalidated()
                    }

                    // 2. End batches, announcing changes (unless initial commit)
                    for (const record of me.$invalidated) {
                        record.endBatch(false, true)
                    }
                }

                me.isWritingData = false

                me.$invalidated.clear()

                // Mimic real projects events
                me.trigger('dataReady')

                stores.forEach(store => {
                    store.resumeAutoCommit?.()
                    store.resumeSortOnUpdate?.()
                })

                // Resume change tracking; this fires a single `hasChanges` / `noChanges` for the whole commit.
                if (!silenceCommit) (me as any).resumeChangeTracking?.(false)

                // Chrono version triggers "dataReady" only if there were no commit rejection
                // (in case of a rejection it triggers "commitRejected" event)
                // but in both cases it triggers "commitFinalized" afterwards
                me.trigger('commitFinalized')

                return true
            }
        }


        async propagateAsync () : Promise<any> {
            return this.commitAsync()
        }


        // Hook used by GanttCoreProjectMixin
        propagateChanges () : void {}


        // Called when a record invalidates itself, queues it for calculation
        invalidate (record : CorePartOfProjectModelMixin) : void {
            this.$invalidated.add(record)
            // the code adds invalidated records during commitAsync() call
            // we should not react then
            if (!this.isPerformingCommit) {
                this.bufferedCommitAsync()
            }
        }


        // this does not account for possible scheduling conflicts
        async isValidDependency () : Promise<boolean> {
            return true
        }


        //endregion





        isEngineReady () : boolean {
            return !this.hasPendingAutoCommit && !this.isPerformingCommit && this.isInitialCommitPerformed
        }
    }

    return SchedulerCoreProjectMixin
}){}
