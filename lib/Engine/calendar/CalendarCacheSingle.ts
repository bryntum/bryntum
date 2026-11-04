import { CalendarCache } from "./CalendarCache.js"
import { CalendarCacheInterval } from "./CalendarCacheInterval.js"
import { CalendarIntervalMixin } from "./CalendarIntervalMixin.js"
import { CalendarIntervalStore } from "./CalendarIntervalStore.js"
import { IntervalCache } from "./IntervalCache.js"
import { UnspecifiedTimeIntervalModel } from "./UnspecifiedTimeIntervalModel.js"
import { AbstractCalendarMixin } from "../quark/model/AbstractCalendarMixin.js"
import DateHelper from "../../Core/helper/DateHelper.js"

import { CalendarIntervalType, TreatInconsistentIntervals } from "../scheduling/Types.js"
import { MAX_DATE, MIN_DATE } from "../util/Constants.js"
import { CalendarIntervalParser } from "../util/calendar_interval_parser/CalendarIntervalParser.js"

const everySingleDaySchedule = CalendarIntervalParser.compile(CalendarIntervalParser.parseText('every 1 day'))

export class CalendarCacheSingle extends CalendarCache<CalendarCacheInterval, CalendarCacheInterval> {
    parentCache                     : CalendarCacheSingle

    unspecifiedTimeInterval         : UnspecifiedTimeIntervalModel

    intervalUnspecifiedTimeIntervals    : Map<CalendarIntervalMixin, UnspecifiedTimeIntervalModel>

    weekUnspecifiedTimeIntervalsByKey   : Map<string, UnspecifiedTimeIntervalModel>

    calendar                        : AbstractCalendarMixin

    intervalStore                   : CalendarIntervalStore

    staticIntervalsCached           : boolean   = false

    treatInconsistentIntervals      : TreatInconsistentIntervals

    // Reused across cache fills, for intervals whose zone differs from the calendar's
    generationDateHelper            : typeof DateHelper

    get dateHelper () : typeof DateHelper {
        return this.calendar?.dateHelper || super.dateHelper
    }


    constructor (config? : Partial<CalendarCacheSingle>) {
        super(config)

        if (!this.unspecifiedTimeInterval) throw new Error("Required attribute `unspecifiedTimeInterval` is missing")

        this.intervalUnspecifiedTimeIntervals   = new Map()

        this.weekUnspecifiedTimeIntervalsByKey  = new Map()

        this.treatInconsistentIntervals = config?.treatInconsistentIntervals || TreatInconsistentIntervals.Skip

        this.intervalCache = new IntervalCache({

            emptyInterval   : new CalendarCacheInterval({
                intervals       : [  this.unspecifiedTimeInterval ],

                calendar        : this.calendar
            }),

            combineIntervalsFn  : (interval1, interval2) => {
                return interval1.combineWith(interval2)
            }
        })
    }


    fillCache (startDate : Date, endDate : Date) {
        if (!this.staticIntervalsCached) {
            this.cacheStaticIntervals()

            this.staticIntervalsCached  = true
        }

        if (this.parentCache) this.includeWrappingRangeFrom(this.parentCache, startDate, endDate)

        const project        = this.calendar.project
        // Legacy timeZone conversion: shifts recurrence dates from local to the target timezone.
        // Only applies to the legacy path (project.timeZone). The new tz path does not mutate dates.
        const timeZone       = this.calendar.ignoreTimeZone ? null : project?.timeZone

        if (startDate > endDate) throw new Error("Invalid cache fill interval")

        for (const interval of this.intervalStore) {
            if (interval.isRecurrent()) {
                this.cacheRecurrentInterval(startDate, endDate, timeZone, interval)
            }
        }
    }


    cacheRecurrentInterval(startDate : Date, endDate : Date, timeZone : string | number, interval : CalendarIntervalMixin) {
        const project = this.calendar.project

        if (!project || project.useLegacyTimeZoneMode) {
            this.cacheRecurrentIntervalImpl(startDate, endDate, timeZone, false, interval)
            return
        }

        // Install a tz-aware DateHelper so the parser generates occurrences directly in the intended zone. Restored in
        // `finally` so the shared parser periods stay timezone-agnostic and the caches stay valid across timezone
        // changes.
        const previousActiveDateHelper = CalendarIntervalParser.activeDateHelper
        CalendarIntervalParser.activeDateHelper = this.resolveGenerationDateHelper(interval.recurrentDatesTimeZone, project.timeZone)

        try {
            this.cacheRecurrentIntervalImpl(startDate, endDate, timeZone, true, interval)
        }
        finally {
            CalendarIntervalParser.activeDateHelper = previousActiveDateHelper
        }
    }

    // Resolve the timezone-aware DateHelper to generate recurring occurrences in
    resolveGenerationDateHelper(recurrentDatesTimeZone : string | number, projectTz : string | number) : typeof DateHelper {
        // Numeric UTC offsets are unsupported on the new path (IANA only) — ignore a numeric override.
        const tz = (typeof recurrentDatesTimeZone === 'string' ? recurrentDatesTimeZone : null) ?? projectTz

        if (tz == null) {
            return DateHelper
        }

        const
            normalized          = (tz === 'UTC') ? 'Etc/UTC' : tz,
            calendarDateHelper  = this.dateHelper as any



        return calendarDateHelper ?? DateHelper
    }

    cacheRecurrentIntervalImpl(startDate : Date, endDate : Date, timeZone : string | number, useTemporal : boolean, interval : CalendarIntervalMixin) {
        const intervalStartDate : Date                  = interval.startDate
        const intervalEndDate : Date                    = interval.endDate
        const recurrentDatesTimeZone : string | number  = interval.recurrentDatesTimeZone

        const project                                   = this.calendar.project
        const projectTz : string | number               = useTemporal ? project.timeZone : null

        // Resolve end-of-day boundaries in the same zone the start occurrences are generated in.
        const eodDateHelper                              = useTemporal ? CalendarIntervalParser.activeDateHelper : this.dateHelper

        // skip overrides not intersecting the requested time frame
        if (intervalStartDate && intervalStartDate >= endDate || intervalEndDate && intervalEndDate <= startDate) return

        const availabilityStartSchedule = interval.getAvailabilityStartSchedule()
        const availabilityEndSchedule   = interval.getAvailabilityEndSchedule()

        const startSchedule             = interval.getStartDateSchedule() || (availabilityStartSchedule && everySingleDaySchedule)
        const endSchedule               = interval.getEndDateSchedule()
        // indicates the recurring end should be calculated as the recurring start day end
        const useEndOfDay : boolean     = !endSchedule || endSchedule === 'EOD'

        let wrappingStartDate : Date    = startDate
        let wrappingEndDate : Date      = endDate

        // collect the last start date before the frame starts

        let starts = startSchedule.prev(2, startDate)
        let ends

        if (starts) {
            wrappingStartDate = starts[0]

            // if 0th entry matches startDate use the next earlier date
            if (wrappingStartDate.getTime() === startDate.getTime() && starts[1]) {
                wrappingStartDate = starts[1]
            }
        }

        // collect the first end date after the frame ends

        if (useEndOfDay) {
            const tmpDate = startSchedule.next(1, endDate)

            if (tmpDate) {
                wrappingEndDate = eodDateHelper.getStartOfNextDay(tmpDate, true)
            }
        }
        else {
            ends = endSchedule.next(2, endDate)

            if (ends) {
                wrappingEndDate = ends[0]

                // if 0th entry matches endDate use the next later date
                if (wrappingEndDate.getTime() === endDate.getTime() && ends[1]) {
                    wrappingEndDate = ends[1]
                }
            }
        }

        let startDates : Date[] = startSchedule.next(Infinity, wrappingStartDate, new Date(wrappingEndDate.getTime() - 1000))

        // schedule is empty for the interval of interest, do nothing
        if (!startDates?.length) return

        // at this point `startDates` is a non-empty array

        let endDates : Date[] = useEndOfDay
            ? startDates.map(date => eodDateHelper.getStartOfNextDay(date, true))
            : endSchedule.next(Infinity, wrappingStartDate, wrappingEndDate)

        if (!endDates?.length) return

        // If end date matches start date means the same recurrence rule is used for both (like "at 00:00")
        // Get rid of the first matching end date to shift ranges
        if (startDates[0].getTime() === endDates[0].getTime()) {
            endDates.splice(0, 1)
        }

        // If the interval is limited with a start date
        while (intervalStartDate && startDates[0] < intervalStartDate) {
            if (endDates[0] > intervalStartDate) {
                startDates[0] = intervalStartDate
            }
            else {
                startDates.shift()
                endDates.shift()
            }
        }

        // If the interval is limited with an end date
        while (intervalEndDate && endDates[endDates.length - 1] > intervalEndDate) {
            if (startDates[endDates.length - 1] < intervalEndDate) {
                endDates[endDates.length - 1] = intervalEndDate
            }
            else {
                startDates.pop()
                endDates.pop()
            }
        }

        const treatInconsistentIntervals = this.treatInconsistentIntervals

        for (let index = 0, length = startDates.length; index < length; index++) {
            const
                startDate     = startDates[index],
                endDate       = endDates[index]

            if (!startDate || !endDate) {
                break
            }

            // If the interval start is after the corresponding end date
            // (could happen when start recurrence and end recurrence are
            // not configured respectively to each other ..so start recurrence has generated less occurrences
            // than end occurrence has)
            if (startDate > endDate) {
                // skip the end date occurrence ..hoping that next next end date value will do
                if (treatInconsistentIntervals === TreatInconsistentIntervals.Skip) {
                    endDates.splice(index, 1)
                }
                // throw an exception if requested
                else if (treatInconsistentIntervals === TreatInconsistentIntervals.Throw) {
                    throw new Error("Recurrent interval inconsistency: " + (interval.name || interval.id) +
                        ", caching startDate: " + DateHelper.format(startDate) +
                        ", caching endDate: " + DateHelper.format(endDate) +
                        ", recurrentStartDate: " + interval.recurrentStartDate +
                        ", recurrentEndDate: " + interval.recurrentEndDate
                    )
                }
            }
        }

        if (endDates.length > startDates.length) {
            // safe to ignore "extra" end dates
            endDates.length = startDates.length
        }
        else if (endDates.length < startDates.length) {
            // monkey patch
            startDates.length = endDates.length
            // throw new Error("Recurrent interval inconsistency: " + interval + ", caching startDate: " + startDate + ", caching endDate: " + endDate)
        }

        // if the interval has availability provided
        if (availabilityStartSchedule) {
            const
                tmpStartDates   = [],
                tmpEndDates     = [],
                baseInterval    = this.getUnspecifiedTimeIntervalForException(interval, { isWorking : false })

            for (let index = 0, length = startDates.length; index < length; index++) {
                const
                    startDate     = startDates[index],
                    endDate       = endDates[index]

                // add a base interval masking other intervals
                this.intervalCache.addInterval(startDate, endDate, existingCacheInterval => existingCacheInterval.includeInterval(baseInterval))

                // get availability starts in the current startDate - endDate range
                let starts = availabilityStartSchedule.next(Infinity, startDate, endDate)

                if (!starts) return

                // get availability ends in the current startDate - endDate range
                let ends = availabilityEndSchedule.next(Infinity, new Date(startDate.getTime() + 1000), endDate)

                if (!ends) return

                if (ends.length > starts.length) {
                    ends.length = starts.length
                }
                else if (ends.length < starts.length) {
                    starts.length = ends.length
                }

                // If the range was defined in the inverse way
                // like start="17:00", end="08:00"
                // Then add a leading interval:
                // start="00:00", end="08:00"
                // and a trailing one:
                // start="17:00", end="00:00"
                if (ends[0] < starts[0]) {
                    starts.unshift(startDate)
                    ends.push(endDate)
                }

                tmpStartDates.push(...starts)
                tmpEndDates.push(...ends)
            }

            startDates  = tmpStartDates
            endDates    = tmpEndDates
        }

        for (let index = 0, length = startDates.length; index < length; index++) {
            let recStartDate = startDates[ index ]
            let recEndDate   = endDates[ index ]



            this.intervalCache.addInterval(recStartDate, recEndDate, existingCacheInterval => existingCacheInterval.includeInterval(interval))
        }
    }


    getUnspecifiedTimeIntervalForException(interval : CalendarIntervalMixin, data : Partial<UnspecifiedTimeIntervalModel> = {}) : UnspecifiedTimeIntervalModel {

        let result : UnspecifiedTimeIntervalModel   = this.intervalUnspecifiedTimeIntervals.get(interval)

        if (!result) {
            result  = this.unspecifiedTimeInterval.copy()

            this.intervalUnspecifiedTimeIntervals.set(interval, result)

            Object.assign(result, {
                mainInterval        : interval,
                calendar            : this.unspecifiedTimeInterval.calendar,
                name                : interval.name,
                cls                 : interval.cls,
                startDate           : interval.startDate,
                endDate             : interval.endDate,
                prioritySortValue   : interval.getPrioritySortValue() - 1,
                ...data
            })
        }

        return result
    }


    getUnspecifiedTimeIntervalForWeek(week : CalendarIntervalMixin) : UnspecifiedTimeIntervalModel {

        let result : UnspecifiedTimeIntervalModel   = this.intervalUnspecifiedTimeIntervals.get(week)

        if (!result) {
            // First try matching some of existing week screens
            const searchKey = week.compositeIntervalCode

            result = this.weekUnspecifiedTimeIntervalsByKey.get(searchKey)

            // make a new one if no matching exiting
            if (!result) {
                result                  = this.unspecifiedTimeInterval.copy()

                this.intervalUnspecifiedTimeIntervals.set(week, result)
                this.weekUnspecifiedTimeIntervalsByKey.set(searchKey, result)

                Object.assign(result, {
                    mainInterval        : week,
                    calendar            : this.unspecifiedTimeInterval.calendar,
                    name                : week.name,
                    cls                 : week.cls,
                    startDate           : week.startDate,
                    endDate             : week.endDate,
                    prioritySortValue   : week.getPrioritySortValue() - 1
                })
            }

        }

        return result
    }


    clear () {
        this.staticIntervalsCached = false

        super.clear()
    }


    cacheStaticIntervals () {
        const project       = this.calendar.project
        // Legacy date-mutation path only
        const timeZone      = (project && !project.useLegacyTimeZoneMode) ? null : project?.timeZone
        const intervalCache = this.intervalCache

        for (let interval of this.intervalStore) {
            const isStatic          = interval.isStatic()
            const isWeek            = interval.type === CalendarIntervalType.Week

            if (isStatic || isWeek) {
                // Each week has an UnspecifiedTimeIntervalModel instance to screen parent calendars
                if (isWeek) {
                    interval = this.getUnspecifiedTimeIntervalForWeek(interval)
                }

                let { startDate, endDate } = interval



                intervalCache.addInterval(
                    startDate || MIN_DATE,
                    endDate || MAX_DATE,
                    existingCacheInterval => existingCacheInterval.includeInterval(interval)
                )
            }
        }
    }

}
