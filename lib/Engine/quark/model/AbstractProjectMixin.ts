import { CommitResult } from "../Types.js"
import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/BetterMixin.js"
import { AnyFunction } from "../../../ChronoGraph/class/Mixin.js"
import Delayable, { DelayableMixin } from "../../../Core/mixin/Delayable.js"
import Events, { EventsMixin } from "../../../Core/mixin/Events.js"
import Model from "../../../Core/data/Model.js"
import Store from "../../../Core/data/Store.js"
import { AbstractCalendarMixin } from "./AbstractCalendarMixin.js"
import { AbstractPartOfProjectStoreMixin } from "../store/mixin/AbstractPartOfProjectStoreMixin.js"

export class EventsWrapper extends Mixin(
    [],
    Events as ((base : AnyConstructor) => AnyConstructor<EventsMixin>)
){}

export class DelayableWrapper extends Mixin(
    [],
    Delayable as ((base : AnyConstructor) => AnyConstructor<DelayableMixin>)
){}


/**
 * This is an abstract project, which just lists the available stores.
 *
 * The actual project classes are [[SchedulerCoreProjectMixin]], [[SchedulerBasicProjectMixin]],
 * [[SchedulerProProjectMixin]], [[GanttProjectMixin]].
 *
 * @tier community
 */
export class AbstractProjectMixin extends Mixin(
    [
        EventsWrapper,
        DelayableWrapper,
        Model
    ],
    (base : AnyConstructor<
        EventsWrapper &
        DelayableWrapper &
        Model
        ,
        typeof EventsWrapper &
        typeof DelayableWrapper &
        typeof Model
>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class AbstractProjectMixin extends base {

        eventModelClass           : typeof Model

        dependencyModelClass      : typeof Model

        resourceModelClass        : typeof Model

        assignmentModelClass      : typeof Model

        calendarModelClass        : typeof Model

        eventStoreClass           : typeof Store

        dependencyStoreClass      : typeof Store

        resourceStoreClass        : typeof Store

        assignmentStoreClass      : typeof Store

        calendarManagerStoreClass : typeof Store

        eventStore                : Store

        dependencyStore           : Store

        resourceStore             : Store

        assignmentStore           : Store

        calendarManagerStore      : Store

        defaultCalendar           : AbstractCalendarMixin

        isInitialCommitPerformed  : boolean

        ignoreRecordChanges       : boolean

        isLoadingInlineData       : boolean

        hasLoadedDataToCommit     : boolean

        isWritingData             : boolean

        /**
         * Specifies whether the changes calculated when loading data
         * should be silently accepted (`true`) or not (`false`) and then an application
         * can persist them.
         */
        silenceInitialCommit      : boolean

        /**
         * Setting this to `true` vetoes [[silenceInitialCommit]] effect
         * by preventing silent accepting changes
         * on initial data loading if some scheduling issue gets resolved during it.
         */
        preventSilencingOnIssueResolve : boolean

        adjustDurationToDST       : boolean

        dataReadyDetacher         : Function | null

        queuedDataReadyEvents     : Array<any>

        /**
         * IANA timezone identifier for the project. In legacy mode (`useLegacyTimeZoneMode = true`), setting this
         * mutates record dates. In temporal mode (default), setting this makes the project a tz-cascade owner without
         * mutating dates, and it can only be set when the project is configured (not changed at runtime).
         */
        timeZone                  : string | number

        /**
         * Selects the timezone implementation. `false` (default) = Temporal-based projection without mutating record
         * dates; `true` = deprecated legacy mutation.
         */
        useLegacyTimeZoneMode       : boolean

        /**
         * Returns the timezone-aware date helper if the project has a `timeZone` configured and
         * `useLegacyTimeZoneMode` is `false`, otherwise returns the static DateHelper class.
         */
        dateHelper                : any


        isRestoringData             : boolean   = false

        /**
         * Maximum range the project calendars can iterate.
         * The value is defined in milliseconds and by default equals `5 years` roughly.
         */
        maxCalendarRange           : number

        get isRepopulatingStores () : boolean {
            return false
        }

        get isInitialCommit () : boolean {
            return !this.isInitialCommitPerformed || this.hasLoadedDataToCommit
        }

        construct (config : Partial<this> = {}) {
            // Define default values for these flags here
            // if defined where declared then TS compiles them this way:
            // constructor() {
            //     super(...arguments)
            //     this.isInitialCommitPerformed   = false
            //     this.isLoadingInlineData        = false
            //     this.isWritingData              = false
            //
            // }
            // which messes the flags values for inline data loading (since it's async)
            this.isInitialCommitPerformed   = false
            this.isLoadingInlineData        = false
            this.isWritingData              = false
            this.hasLoadedDataToCommit      = false

            const silenceInitialCommit      = ('silenceInitialCommit' in config) ? config.silenceInitialCommit : true

            const preventSilencingOnIssueResolve = ('preventSilencingOnIssueResolve' in config) ? config.preventSilencingOnIssueResolve : true
            const adjustDurationToDST       = ('adjustDurationToDST' in config) ? config.adjustDurationToDST : false

            // 5 years roughly === 5 * 365 * 24 * 60 * 60 * 1000
            this.maxCalendarRange           = ('maxCalendarRange' in config) ? config.maxCalendarRange : 157680000000

            // delete configs otherwise super.construct() call treat them as fields and makes accessors for them
            delete config.maxCalendarRange
            delete config.silenceInitialCommit
            delete config.preventSilencingOnIssueResolve
            delete config.adjustDurationToDST

            superProto.construct.call(this, config)

            this.silenceInitialCommit = silenceInitialCommit
            this.preventSilencingOnIssueResolve = preventSilencingOnIssueResolve
            this.adjustDurationToDST  = adjustDurationToDST
        }


        // Template method called when a stores dataset is replaced. Implemented in SchedulerBasicProjectMixin
        repopulateStore (store : AbstractPartOfProjectStoreMixin) {}


        // Template method called when replica should be repopulated. Implemented in SchedulerBasicProjectMixin
        repopulateReplica () {}


        deferUntilRepopulationIfNeeded (deferId : string, func : AnyFunction, args : any[]) {
            // no deferring at this level (happens in projects using engine)
            func(...args)
        }


        // Template method called when a store is attached to the project
        attachStore (store : AbstractPartOfProjectStoreMixin) {}


        // Template method called when a store is detached to the project
        detachStore (store : AbstractPartOfProjectStoreMixin) {}


        async commitAsync () : Promise<CommitResult> {
            throw new Error("Abstract method called")
        }


        // Different implementations for Core and Basic engines
        isEngineReady () : boolean {
            throw new Error("Abstract method called")
        }
    }

    return AbstractProjectMixin
}){}
