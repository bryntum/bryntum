import { AnyConstructor, Mixin } from "../../ChronoGraph/class/BetterMixin.js"
import { CalendarIntervalParser } from "../util/calendar_interval_parser/CalendarIntervalParser.js"
import { CalendarIntervalStore } from "./CalendarIntervalStore.js"
import { AbstractPartOfProjectModelMixin } from "../quark/model/mixin/AbstractPartOfProjectModelMixin.js"
import { AbstractCalendarMixin } from "../quark/model/AbstractCalendarMixin.js"
import { CalendarIntervalType } from "../scheduling/Types.js"

function convertAvailabilityValue(value) {
    if (value) {
        if (typeof value == 'string') {
            value = value.split(',')

            value.map(range => {
                const [startDate, endDate] = range.split('-')

                return { startDate, endDate }
            })
        }
    }
    else {
        value = null
    }

    return value
}

export type AvailabilityRange = {
    startDate   : string

    endDate     : string
}

const JSON_START = /^[\s\n]*[[{]/;

/**
 * This is a calendar interval mixin.
 *
 * Can be either a static time interval (if [[startDate]]/[[endDate]] are specified and no [[recurrentStartDate]] provided)
 * or recurrent time interval (has [[recurrentStartDate]] provided).
 *
 * By default it defines a non-working period ([[isWorking]] field has default value `false`),
 * but can also define an explicit working time, for example to override some previous period.
 *
 * You probably don't need to create instances of this mixin directly, instead you pass its configuration object to the [[AbstractCalendarMixin.addInterval]]
 */
export class CalendarIntervalMixin extends Mixin(
    [ AbstractPartOfProjectModelMixin ],
    (base : AnyConstructor<AbstractPartOfProjectModelMixin, typeof AbstractPartOfProjectModelMixin>) => {


    class CalendarIntervalMixin extends base {
        protected prioritySortValue         : number
        private startDateSchedule           : any
        private endDateSchedule             : any
        private availabilityStartSchedule   : any
        private availabilityEndSchedule     : any

        static get fields () {
            return [
                'name',
                { name : 'startDate', type : 'date' },
                { name : 'endDate', type : 'date' },
                'recurrentStartDate',
                'recurrentEndDate',
                'cls',
                'color',
                'iconCls',
                { name : 'isWorking', type : 'boolean', defaultValue : false },
                { name : 'priority', type : 'number' },
                { name : 'type' },
                { name : 'availability', convert : convertAvailabilityValue },
                { name : 'compositeCode' },
                'recurrentDatesTimeZone'
            ]
        }

        /**
         * The name of the recurrent time interval. Might be used in the UI when visualizing intervals.
         */
        name                            : string

        /**
         * The start date of the fixed (not recurrent) time interval.
         */
        startDate                       : Date

        /**
         * The end date of the fixed (not recurrent) time interval.
         */
        endDate                         : Date

        /**
         * The start date of the recurrent time interval. Should be specified as any expression recognized
         * by the `CalendarIntervalParser.parseText` parser.
         */
        recurrentStartDate              : string

        /**
         * The end date of the recurrent time interval. Should be specified as any expression recognized
         * by the `CalendarIntervalParser.parseText` parser.
         *
         * The field value can be omitted when [[recurrentStartDate]] has a recurrence rule provided.
         * In this case the interval will be calculated based on [[recurrentStartDate|start date schedule]] only.
         * And then the effective interval end will be calculated as the end of the day found based on the
         * start date schedule.
         */
        recurrentEndDate                : string

        /**
         * A timezone in which [[recurrentStartDate]] and [[recurrentEndDate]] rules are specified.
         * If not provided the local machine timezone is used for the dates.
         * Can be provided either as a IANA time zone (i.e. `Europe/Stockholm`)
         * or a UTC offset in minutes (i.e. `-120`).
         */
        recurrentDatesTimeZone          : string | number

        /**
         * Working time for the interval.
         */
        availability                    : AvailabilityRange[]

        /**
         * The "is working" flag, which defines what kind of interval this is - either working or non-working. Default value is `false`,
         * denoting non-working intervals.
         */
        isWorking                       : boolean

        /**
         * The priority of the interval.
         */
        // @model_field({ type : 'number' }) // number in [ 1, 9 ] range
        priority                        : number

        /**
         * A CSS class to add to the element visualizing this interval.
         */
        cls                            : string

        /**
         * A CSS class used to add an icon to the element visualizing this interval.
         */
        iconCls                        : string

        /**
         * The interval color (the value is used in the calendar editor popup).
         */
        color                           : string

        /**
         * Interval type (can be either a week or an exception).
         */
        type                           : CalendarIntervalType

        compositeCode                  : string

        getCalendar () : AbstractCalendarMixin {
            return (this.stores as unknown as CalendarIntervalStore[])[ 0 ].calendar
        }


        get compositeIntervalCode() {
            return this.compositeCode || (
                (this.startDate?.getTime() || '') + '-' + (this.endDate?.getTime() || '') + '-' + (this.type || '')
            )
        }


        resetPriority () {
            this.prioritySortValue       = null

            this.getCalendar().getDepth()
        }


        getPrioritySortValue () : number {
            if (this.prioritySortValue != null) return this.prioritySortValue

            // 0 - 10000 interval is reserved for the root level "unspecified time" intervals
            let base        = 10000

            let priority    = this.priority

            if (priority == null) {
                // Weeks have lower priority than Exceptions
                // Week priority is:            10000 + (depth * 100) + 20
                // Week override priority is:   10000 + (depth * 100) + 30
                // Exception priority is:       10000 + (depth * 10000) + 40
                //
                // So for the following two levels calendars structure:
                //  + calendar1 (intervals: exception1, week1)
                //  |-- calendar2 (intervals: exception2, week2)
                //
                // The intervals priorities will be:
                //  - week1 :       10000 + 1 * 100 + 20  = 10120
                //  - exception1 :  10000 + 1 * 10000 + 40 = 20040
                //  - week2 :       10000 + 2 * 100 + 20  = 10220
                //  - exception2 :  10000 + 2 * 10000 + 40 = 30040
                //
                // Which results the intervals will be considered in this order:
                //  - exception2 :  10000 + 2 * 10000 + 40 = 30040
                //  - exception1 :  10000 + 1 * 10000 + 40 = 20040
                //  - week2 :       10000 + 2 * 100 + 20  = 10220
                //  - week1 :       10000 + 1 * 100 + 20  = 10120
                //
                // Exceptions (including onces inherited from parent calendars)
                // take precedence over weeks

                switch (this.type) {
                    case CalendarIntervalType.Week :
                        base        += this.getCalendar().getDepth() * 100
                        priority    = this.isOverride() ? 30 : 20
                        break

                    case CalendarIntervalType.Exception :
                        base        += this.getCalendar().getDepth() * 10000
                        priority    = 40
                        break

                    // BW compatibility
                    default :
                        base += this.getCalendar().getDepth() * 100

                        // recurrent intervals are considered "base" and have lower priority
                        // static intervals are considered special case overrides and have higher priority
                        if (this.isRecurrent()) {
                            priority    = 20

                            if (this.isOverride()) {
                                priority += 10
                            }
                        }
                        else {
                            priority    = 40
                        }
                }

                // the last affecting factor is the order interval was added (last one wins)
                priority += this.parentIndex
            }

            // intervals from parent calendars will have lower priority
            return this.prioritySortValue = base + priority
        }


        /**
         * Whether this interval is recurrent (both [[recurrentStartDate]] and [[recurrentEndDate]] are present and parsed correctly
         * by the `CalendarIntervalParser.parseText` parser)
         */
        isRecurrent () : boolean {
            return Boolean(
                this.getStartDateSchedule() ||
                // exceptions w/ daily availability are recurrent by definition
                (this.type === CalendarIntervalType.Exception && this.getAvailabilityStartSchedule())
            )
        }


        /**
         * Whether this interval is static - both [[startDate]] and [[endDate]] are present and no recurrence rules provided to
         * [[recurrentStartDate]] and [[recurrentEndDate]] fields.
         */
        isStatic () : boolean {
            return Boolean(this.startDate && this.endDate && !this.isRecurrent())
        }

        isOverride () : boolean {
            return Boolean(this.startDate || this.endDate)
        }

        /**
         * Helper method to parse [[recurrentStartDate]] and [[recurrentEndDate]] field values.
         * @param {Object|String} schedule Recurrence schedule
         * @returns {Object} Processed schedule ready to be used by CalendarIntervalParser.compile() method.
         * @private
         */
        parseDateSchedule (value) {
            let schedule

            // pass-through if object is provided
            if (value && value !== Object(value)) {
                // basic check if the value looks like JSON
                // to not bother triggering JSON.parse() each time
                if (value.match(JSON_START)) {
                    // otherwise, first try to parse as a JSON string
                    try {
                        schedule = JSON.parse(value)
                    }
                    catch (e) {}
                }

                if (!schedule) {
                    // finally, if failed - parsing as schedule string
                    schedule        = CalendarIntervalParser.parseText(value.trim())

                    if (schedule.error >= 0) {
                        throw new Error(
                            `Parsing the schedule has failed: "${ value }". ` +
                            `Supported syntax: "every weekday", "at 10:00", "on Mon and Fri", "every 5 minutes", etc. ` +
                            `See the recurrentStartDate/recurrentEndDate field documentation for details.`
                        )
                    }
                }
            }
            else {
                schedule = value
            }

            return schedule
        }

        getStartDateSchedule () {
            if (!this.recurrentStartDate) return null

            if (this.startDateSchedule) return this.startDateSchedule

            const schedule = this.parseDateSchedule(this.recurrentStartDate)

            if (schedule?.schedules?.[0]) {
                const sched = schedule.schedules[0]

                // Move "after ..." date to startDate field
                if (!this.startDate && sched.fd_a) {
                    this.startDate = new Date(sched.fd_a[0])
                    // delete from the schedule
                    delete sched.fd_a
                }

                // Move "before ..." date to endDate field
                if (!this.endDate && sched.fd_b) {
                    this.endDate = new Date(sched.fd_b[0])
                    // delete from the schedule
                    delete sched.fd_b
                }
            }

            return this.startDateSchedule = CalendarIntervalParser.compile(schedule)
        }

        getEndDateSchedule () {
            if (this.endDateSchedule) return this.endDateSchedule

            if (!this.recurrentEndDate || this.recurrentEndDate === 'EOD') return null

            const schedule = this.parseDateSchedule(this.recurrentEndDate)

            if (schedule?.schedules?.[0]) {
                const sched = schedule.schedules[0]

                // if got both startDate and "after {{startDate}}" in the recurrence rule
                // remove it from the recurrence rule
                if (this.startDate?.getTime() && sched.fd_a?.[0] && this.startDate?.getTime() === sched.fd_a?.[0]) {
                    delete sched.fd_a
                }

                // if got both endDate and "before {{endDate}}" in the recurrence rule
                // remove it from the recurrence rule
                if (this.endDate?.getTime() && sched.fd_b?.[0] && this.endDate?.getTime() === sched.fd_b?.[0]) {
                    delete sched.fd_b
                }
            }

            return this.endDateSchedule = CalendarIntervalParser.compile(schedule)
        }

        getAvailabilityStartSchedule () {
            if (this.availability?.length) {
                if (this.availabilityStartSchedule) return this.availabilityStartSchedule

                // collect range start times into a single rule like "at 08:00,13:00"
                const textRule = 'at ' + this.availability.map(range => range.startDate).sort().join(',')

                const schedule = this.parseDateSchedule(textRule)

                return this.availabilityStartSchedule = CalendarIntervalParser.compile(schedule)
            }
        }

        getAvailabilityEndSchedule () {
            if (this.availability?.length) {
                if (this.availabilityEndSchedule) return this.availabilityEndSchedule

                // collect range start times into a single rule like "at 12:00,17:00"
                const textRule = 'at ' + this.availability.map(range => range.endDate).sort().join(',')

                const schedule = this.parseDateSchedule(textRule)

                return this.availabilityEndSchedule = CalendarIntervalParser.compile(schedule)
            }
        }

        afterChange(_toSet, wasSet, _silent, _fromRelationUpdate, _skipAccessors) {
            super.afterChange(_toSet, wasSet, _silent, _fromRelationUpdate, _skipAccessors)

            // reset cached schedules on corresponding field changes

            if (wasSet?.recurrentStartDate) {
                this.startDateSchedule              = undefined
            }

            if (wasSet?.recurrentEndDate) {
                this.endDateSchedule                = undefined
            }

            if (wasSet?.availability) {
                // reset cached availability when availability store data is set
                this.availabilityStartSchedule      = undefined
                this.availabilityEndSchedule        = undefined
            }
        }

    }

    return CalendarIntervalMixin
}){}
