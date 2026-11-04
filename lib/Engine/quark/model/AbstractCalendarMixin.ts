import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/BetterMixin.js"
import { CalendarIntervalStore } from "../../calendar/CalendarIntervalStore.js"
import { CalendarCacheInterval } from "../../calendar/CalendarCacheInterval.js"
import { CalendarIteratorResult } from "../../calendar/CalendarCache.js"
import { Duration, TimeUnit, TreatInconsistentIntervals } from "../../scheduling/Types.js"
import { CalendarIntervalMixin } from "../../calendar/CalendarIntervalMixin.js"
import { CalendarCacheSingle } from "../../calendar/CalendarCacheSingle.js"
import { UnspecifiedTimeIntervalModel } from "../../calendar/UnspecifiedTimeIntervalModel.js"
import DateHelper from "../../../Core/helper/DateHelper.js"
import { AbstractProjectMixin } from "./AbstractProjectMixin.js"
import { AbstractPartOfProjectModelMixin } from "./mixin/AbstractPartOfProjectModelMixin.js"


/**
 * Result of the [[accumulateWorkingTime]].
 */
export type AccumulateWorkingTimeResult = {
    /**
     * The date at which iterator stopped
     */
    finalDate : Date,
    /**
     * Remaining duration in milliseconds.
     */
    remainingDurationInMs : number
}


/**
 * Calendar for project scheduling, mixed by CoreCalendarMixin and BaseCalendarMixin. It is used to mark certain time
 * intervals as "non-working" and ignore them during scheduling.
 *
 * The calendar consists from several [[CalendarIntervalMixin|intervals]]. The intervals can be either static or recurrent.
 *
 * @tier community
 */
export class AbstractCalendarMixin extends Mixin(
    [ AbstractPartOfProjectModelMixin ],
    (base : AnyConstructor<AbstractPartOfProjectModelMixin, typeof AbstractPartOfProjectModelMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class CalendarMixin extends base {

        project                 : AbstractProjectMixin

        adjustDurationToDST     : boolean

        static get fields () {
            return [
                { name : 'version', type : 'number' },
                'name',
                { name : 'unspecifiedTimeIsWorking', type : 'boolean', defaultValue : true },
                { name : 'intervals', type : 'store', subStore : true },
                'cls',
                'iconCls',
                { name : 'treatInconsistentIntervals', persist : false }
            ]
        }

        version                  : number    = 1

        /**
         * The calendar name
         */
        name                     : string

        /**
         * A CSS class to add to non-working time elements rendered in the UI
         */
        cls                    : string

        /**
         * A CSS class defining an icon to display inside non-working time elements rendered in the UI
         */
        iconCls                : string

        /**
         * The flag, indicating, whether the "unspecified" time (time that does not belong to any [[CalendarIntervalMixin|interval]])
         * is working (`true`) or not (`false`). Default value is `true`
         */
        unspecifiedTimeIsWorking : boolean

        /**
         * If set to `true`, the calendar will ignore the project current timeZone setting. Used in the default
         * "weekends" calendar
         */
        ignoreTimeZone : boolean

        /**
         * Returns the timezone-aware date helper if the project has one configured,
         * otherwise returns the static DateHelper class.
         * @internal
         */
        get dateHelper () : any {
            return (this.getProject?.() as any)?.dateHelper || DateHelper
        }

        /**
         * A flag indicating how to treat invalid intervals produced by recurrence start/end rules.
         * The recurrences could be misconfigured, producing unmatched start and end date instances.
         *
         * The field supports the following set of values:
         * - [TreatInconsistentIntervals.Skip Skip] - skip such intervals silently (default)
         * - [TreatInconsistentIntervals.Throw Throw] - throw an exception when facing such invalid interval
         */
        treatInconsistentIntervals : TreatInconsistentIntervals

        intervals                : Partial<CalendarIntervalMixin>[]

        get intervalStoreClass () : typeof CalendarIntervalStore {
            return CalendarIntervalStore
        }


        get intervalStore () : CalendarIntervalStore {
            // @ts-ignore
            return this.meta.intervalsStore
        }


        // Not a typo, name is generated from the fields name = intervals
        initIntervalsStore (config) {
            config.storeClass       = this.intervalStoreClass
            // @ts-ignore
            config.modelClass       = this.getDefaultConfiguration().calendarIntervalModelClass || this.intervalStoreClass.defaultConfig?.modelClass || this.intervalStoreClass.configurable.modelClass
            config.calendar         = this
            config.syncDataOnLoad   = true
        }

        // this method is called when the new value for the `intervals` field of this model is assigned
        // the type of the `intervals` field is "store" that's why this magic
        processIntervalsStoreData (intervals) {
            this.bumpVersion()
        }


        isDefault () : boolean {
            const project = this.getProject()

            if (project) {
                return this === project.defaultCalendar
            }

            return false
        }

        // <remove-on-release>
        // TODO: move to Model?
        // </remove-on-release>
        getDepth () : number {
            return this.childLevel + 1
        }


        /**
         * The core iterator method of the calendar.
         *
         * @param options The options for iterator. Should contain at least one of the `startDate`/`endDate` properties
         * which indicates what timespan to examine for availability intervals. If one of boundaries is not provided
         * iterator function should return `false` at some point, to avoid infinite loops.
         *
         * Another recognized option is `isForward`, which indicates the direction in which to iterate through the timespan.
         *
         * @param func The iterator function to call. It will be called for every distinct set of availability intervals, found
         * in the given timespan. All the intervals, which are "active" for current interval are collected in the 3rd argument
         * for this function - [[CalendarCacheInterval|calendarCacheInterval]]. If iterator returns `false` (checked with `===`)
         * the iteration stops.
         *
         * @param scope The scope (`this` value) to execute the iterator in.
         */
        forEachAvailabilityInterval (
            options     : { startDate? : Date, endDate? : Date, isForward? : boolean, maxRange? : number },
            func        : (startDate : Date, endDate : Date, calendarCacheInterval : CalendarCacheInterval) => any,
            scope?      : object
        ) : CalendarIteratorResult {
            const maxRange  = options.maxRange ?? this.getProject()?.maxCalendarRange

            if (maxRange) {
                options     = { ...options, maxRange }
            }

            return this.calendarCache.forEachAvailabilityInterval(options, func, scope)
        }


        /**
         * This method starts at the given `date` and moves forward or backward in time, depending on `isForward`.
         * It stops moving as soon as it accumulates the `durationMs` milliseconds of working time and returns the date
         * at which it has stopped and remaining duration - the [[AccumulateWorkingTimeResult]] object.
         *
         * Normally, the remaining duration will be 0, indicating the full `durationMs` has been accumulated.
         * However, sometimes, calendar might not be able to accumulate enough working time due to various reasons,
         * like if it does not contain enough working time - this case will be indicated with remaining duration bigger than 0.
         *
         * @param date
         * @param durationMs
         * @param isForward
         */
        accumulateWorkingTime (date : Date, durationMs : Duration, isForward : boolean) : AccumulateWorkingTimeResult {
            // if duration is 0 - return the same date
            if (durationMs === 0) return { finalDate : new Date(date), remainingDurationInMs : 0 }

            if (isNaN(durationMs)) throw new Error("Invalid duration")

            let finalDate               = date

            const adjustDurationToDST   = this.getProject()?.adjustDurationToDST ?? this.adjustDurationToDST ?? false
            const dh                    = this.dateHelper

            this.forEachAvailabilityInterval(
                isForward ? { startDate : date, isForward : true } : { endDate : date, isForward : false },

                (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                    let result = true

                    if (calendarCacheInterval.getIsWorking()) {
                        let diff                    = intervalEndDate.getTime() - intervalStartDate.getTime()

                        if (durationMs <= diff) {
                            if (adjustDurationToDST) {
                                const dstDiff       = isForward
                                    ? dh.getTimezoneOffset(intervalStartDate) - dh.getTimezoneOffset(new Date(intervalStartDate.getTime() + durationMs))
                                    : dh.getTimezoneOffset(new Date(intervalEndDate.getTime() - durationMs)) - dh.getTimezoneOffset(intervalEndDate)
                                durationMs          -= dstDiff * 60 * 1000
                            }

                            finalDate               = isForward
                                ? new Date(intervalStartDate.getTime() + durationMs)
                                : new Date(intervalEndDate.getTime() - durationMs)

                            durationMs   = 0

                            result = false
                        } else {
                            if (adjustDurationToDST) {
                                const dstDiff       = dh.getTimezoneOffset(intervalStartDate) - dh.getTimezoneOffset(intervalEndDate)
                                diff                += dstDiff * 60 * 1000
                            }

                            finalDate               = isForward ? intervalEndDate : intervalStartDate

                            durationMs              -= diff
                        }
                    }

                    return result
                }
            )

            return { finalDate : new Date(finalDate), remainingDurationInMs : durationMs }
        }


        /**
         * Calculate the working time duration between the 2 dates, in milliseconds.
         *
         * @param {Date} startDate
         * @param {Date} endDate
         * @param {Boolean} [allowNegative] Method ignores negative values by default, returning 0. Set to true to get
         * negative duration.
         */
        calculateDurationMs (startDate : Date, endDate : Date, allowNegative : Boolean = false) : Duration {
            let multiplier = 1

            // if start/end dates are swapped
            if (startDate.getTime() > endDate.getTime()) {
                // and negative duration is expected
                if (allowNegative) {
                    // use negative multiplier
                    multiplier = -1;
                    // set date values in proper order
                    [ startDate, endDate ] = [ endDate, startDate ]
                }
                // if negative duration is not expected - duration is zero
                else {
                    return 0
                }
            }

            const adjustDurationToDST   = this.getProject()?.adjustDurationToDST ?? this.adjustDurationToDST ?? false
            const dh                    = this.dateHelper

            let duration = 0

            this.forEachAvailabilityInterval(
                { startDate : startDate, endDate : endDate },

                (intervalStartDate, intervalEndDate, calendarCacheInterval) => {

                    if (calendarCacheInterval.getIsWorking()) {
                        duration            += intervalEndDate.getTime() - intervalStartDate.getTime()

                        if (adjustDurationToDST) {
                            const dstDiff   = dh.getTimezoneOffset(intervalStartDate) - dh.getTimezoneOffset(intervalEndDate)
                            duration        += dstDiff * 60 * 1000
                        }
                    }
                }
            )

            return duration * multiplier
        }


        /**
         * Calculate the end date of the time interval which starts at `startDate` and has `durationMs` working time duration
         * (in milliseconds).
         *
         * @param startDate
         * @param durationMs
         */
        calculateEndDate (startDate : Date, durationMs : Duration) : Date | null {
            // the method goes forward by default ..unless a negative duration provided
            const isForward : boolean   = durationMs >= 0

            const res   = this.accumulateWorkingTime(startDate, Math.abs(durationMs), isForward)

            return res.remainingDurationInMs === 0 ? res.finalDate : null
        }


        /**
         * Calculate the start date of the time interval which ends at `endDate` and has `durationMs` working time duration
         * (in milliseconds).
         *
         * @param endDate
         * @param durationMs
         */
        calculateStartDate (endDate : Date, durationMs : Duration) : Date | null {
            // the method goes backwards by default ..unless a negative duration provided
            const isForward : boolean   = durationMs <= 0

            const res   = this.accumulateWorkingTime(endDate, Math.abs(durationMs), isForward)

            return res.remainingDurationInMs === 0 ? res.finalDate : null
        }


        /**
         * Returns the earliest point at which a working period of time starts, following the given date.
         * Can be the date itself, if it comes on the working time.
         *
         * @param date The date after which to skip the non-working time.
         * @param isForward Whether the "following" means forward in time or backward.
         */
        skipNonWorkingTime (date : Date, isForward : boolean = true) : Date | null | 'empty_calendar' {
            let workingDate : Date

            const res = this.forEachAvailabilityInterval(
                isForward ? { startDate : date, isForward : true } : { endDate : date, isForward : false },

                (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                    if (calendarCacheInterval.getIsWorking()) {
                        workingDate = isForward ? intervalStartDate : intervalEndDate

                        return false
                    }
                }
            )

            if (res === CalendarIteratorResult.MaxRangeReached || res === CalendarIteratorResult.FullRangeIterated) return 'empty_calendar'

            return workingDate ? new Date(workingDate) : new Date(date)
        }


        /**
         * This method adds a single [[CalendarIntervalMixin]] to the internal collection of the calendar
         */
        addInterval (interval : Partial<CalendarIntervalMixin>) : CalendarIntervalMixin {
            return this.addIntervals([ interval ])[0]
        }


        /**
         * This method adds an array of [[CalendarIntervalMixin]] to the internal collection of the calendar
         */
        addIntervals (intervals : Partial<CalendarIntervalMixin>[]) : CalendarIntervalMixin[] {
            this.bumpVersion()

            return this.intervalStore.add(intervals)
        }


        /**
         * This method removes a single [[CalendarIntervalMixin]] from the internal collection of the calendar
         */
        removeInterval (interval : CalendarIntervalMixin) {
            return this.removeIntervals([ interval ])
        }


        /**
         * This method removes an array of [[CalendarIntervalMixin]] from the internal collection of the calendar
         */
        removeIntervals (intervals : CalendarIntervalMixin[]) {
            this.bumpVersion()

            return this.intervalStore.remove(intervals)
        }


        /**
         * This method removes all intervals from the internal collection of the calendar
         */
        clearIntervals (silent? : boolean) {
            if (!silent) {
                this.bumpVersion()
            }

            return this.intervalStore.removeAll(silent)
        }


        bumpVersion () {
            this.clearCache()
            this.version++
        }


        $calendarCache           : CalendarCacheSingle

        get calendarCache () : CalendarCacheSingle {
            if (this.$calendarCache !== undefined) return this.$calendarCache

            const unspecifiedTimeInterval       = new UnspecifiedTimeIntervalModel({
                isWorking       : this.unspecifiedTimeIsWorking
            })

            unspecifiedTimeInterval.calendar    = this

            return this.$calendarCache = new CalendarCacheSingle({
                calendar                   : this,
                unspecifiedTimeInterval    : unspecifiedTimeInterval,
                intervalStore              : this.intervalStore,
                treatInconsistentIntervals : this.treatInconsistentIntervals,
                parentCache                : this.parent && !this.parent.isRoot ? this.parent.calendarCache : null
            })
        }


        clearCache () {
            // not strictly needed, we just help garbage collector
            this.$calendarCache && this.$calendarCache.clear()
            this.$calendarCache = undefined
        }


        resetPriorityOfAllIntervals () {
            this.traverse((calendar : CalendarMixin) => {
                for (const interval of calendar.intervalStore) interval.resetPriority()
            })
        }


        insertChild (child, before?, silent?) {
            let res = superProto.insertChild.call(this, ...arguments)

            if (!Array.isArray(res)) {
                res = [res]
            }

            // invalidate cache of the child record, since now it should take parent into account
            res.forEach((r : CalendarMixin) => {
                r.bumpVersion()
                r.resetPriorityOfAllIntervals()
            })

            return res
        }


        joinProject () {
            superProto.joinProject.call(this)

            this.intervalStore.setProject(this.getProject())
        }


        leaveProject () {
            superProto.leaveProject.call(this)

            this.intervalStore.setProject(null)

            this.clearCache()
        }

        doDestroy () {
            this.leaveProject()
            this.intervalStore.destroy()
            super.doDestroy()
        }

        isDayHoliday (day : Date) : boolean {
            const
                dh = this.dateHelper,
                startDate = dh.clearTime(day),
                endDate = dh.getNext(day, TimeUnit.Day)

            let hasWorkingTime = false

            this.forEachAvailabilityInterval(
                { startDate, endDate, isForward : true },
                (_intervalStartDate, _intervalEndDate, calendarCacheInterval) => {
                    hasWorkingTime = calendarCacheInterval.getIsWorking()
                    return !hasWorkingTime
                }
            )

            return !hasWorkingTime
        }

        getDayIntervals (day : Date) : [Date, Date, CalendarIntervalMixin][] {
            const
                dh = this.dateHelper,
                startDate = dh.clearTime(day),
                endDate = dh.getNext(day, TimeUnit.Day)

            let intervals : [Date, Date, CalendarIntervalMixin][] = []

            this.forEachAvailabilityInterval(
                { startDate, endDate, isForward : true },
                (_intervalStartDate, _intervalEndDate, calendarCacheInterval) => intervals.push([_intervalStartDate, _intervalEndDate, calendarCacheInterval.intervals[0]])
            )

            return intervals
        }

        // <remove-on-release>
        // TODO: tests
        // </remove-on-release>
        getDailyHolidaysRanges (startDate : Date, endDate : Date) : { startDate : Date, endDate : Date }[] {
            const
                result = [],
                dh       = this.dateHelper

            startDate = dh.clearTime(startDate)

            while (startDate < endDate) {
                if (this.isDayHoliday(startDate)) {
                    result.push({
                        startDate,
                        endDate : dh.getStartOfNextDay(startDate, true, true)
                    })
                }
                startDate = dh.getNext(startDate, TimeUnit.Day)
            }

            return result
        }

        /**
         * Returns working time ranges between the provided dates.
         * @param {Date} startDate Start of the period to get ranges from.
         * @param {Date} endDate End of the period to get ranges from.
         */
        getWorkingTimeRanges (startDate : Date, endDate : Date, maxRange? : number) : { startDate : Date, endDate : Date }[] {
            const result = []

            this.forEachAvailabilityInterval(
                { startDate, endDate, isForward : true, maxRange },
                (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                    if (calendarCacheInterval.getIsWorking()) {
                        const entry = calendarCacheInterval.intervals[0]
                        result.push({
                            name      : entry.name,
                            startDate : intervalStartDate,
                            endDate   : intervalEndDate
                        })
                    }
                }
            )

            return result
        }

        /**
         * Returns non-working time ranges between the provided dates.
         * @param {Date} startDate Start of the period to get ranges from.
         * @param {Date} endDate End of the period to get ranges from.
         */
        getNonWorkingTimeRanges (startDate : Date, endDate : Date, maxRange? : number) : { startDate : Date, endDate : Date }[] {
            const result = []

            let lastEndDate : Date
            let lastInterval : CalendarIntervalMixin
            let lastRange

            this.forEachAvailabilityInterval(
                { startDate, endDate, isForward : true, maxRange },
                (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                    if (!calendarCacheInterval.getIsWorking()) {
                        const interval = calendarCacheInterval.intervals[0]

                        if (interval === lastInterval && lastEndDate.getTime() === intervalStartDate.getTime()) {
                            lastRange.endDate = intervalEndDate
                        }
                        else {
                            lastRange = {
                                name      : interval.name,
                                type      : interval.type,
                                iconCls   : interval.iconCls,
                                cls       : interval.cls,
                                startDate : intervalStartDate,
                                endDate   : intervalEndDate
                            }

                            result.push(lastRange)
                        }

                        lastInterval = interval
                        lastEndDate = intervalEndDate
                    }
                }
            )

            return result
        }

        /**
         * Checks if there is a working time interval in the provided time range (or when just startDate is provided,
         * checks if the date is contained inside a working time interval in this calendar)
         * @param startDate
         * @param [endDate]
         * @param [fullyContained] Pass true to check if the range is fully covered by a single continuous working time block
         */
        isWorkingTime (startDate : Date, endDate? : Date, fullyContained? : boolean) : boolean {
            if (fullyContained) {
                let found : boolean
                const res = this.forEachAvailabilityInterval(
                    { startDate, endDate, isForward : true },

                    (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                        if (calendarCacheInterval.getIsWorking() && intervalStartDate <= startDate && intervalEndDate >= endDate) {
                            found = true

                            return false
                        }
                    }
                )

                if (res === CalendarIteratorResult.MaxRangeReached || res === CalendarIteratorResult.FullRangeIterated) return false

                return found
            }
            else {
                // Can be Date | null | 'empty_calendar'
                const workingTimeStart : any = this.skipNonWorkingTime(startDate)
                return workingTimeStart && workingTimeStart !== 'empty_calendar' ? (endDate ? workingTimeStart < endDate : workingTimeStart.getTime() === startDate.getTime()) : false
            }
        }
    }

    return CalendarMixin
}){}
