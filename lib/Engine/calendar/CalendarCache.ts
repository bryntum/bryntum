import DateHelper from "../../Core/helper/DateHelper.js"
import { Duration, TimeUnit } from "../scheduling/Types.js"
import { MAX_DATE, MIN_DATE } from "../util/Constants.js"
import { EdgeInclusion } from "../util/Types.js"
import { CacheInterval, IntervalCache } from "./IntervalCache.js"

export interface CalendarCacheIteratorReturnResult<TReturn> extends IteratorReturnResult<TReturn> {
    done  : true;
    value : TReturn;
    flag? : CalendarIteratorResult;
}

export type CalendarCacheIteratorResult<T, TReturn = any> = IteratorYieldResult<T> | CalendarCacheIteratorReturnResult<TReturn>;

export type CalendarCacheIteratorValue<IntervalT> = { startDate : Date, endDate : Date, calendarCacheInterval : IntervalT }


/**
 * The enum type for result of [[forEachAvailabilityInterval]].
 */
export enum CalendarIteratorResult {
    /**
     * Indicates the iteration has completed by iterating the whole given timespan or has reached the MAX_DATE or MIN_DATE.
     */
    FullRangeIterated,
    /**
     * Indicates the iteration has been stopped by returning `false` from the iterator.
     */
    StoppedByIterator,
    /**
     * Indicates the iteration has exceeded the `maxRange` option
     */
    MaxCacheExtendCyclesReached,
    /**
     * Indicates the iteration has exceeded the `maxRange` option
     */
    MaxRangeReached
}

/**
 * Calendar cache.
 */
export class CalendarCache<IntervalT, CombineWithIntervalT> {

    cacheFilledStartDate            : Date = MAX_DATE
    cacheFilledEndDate              : Date = MIN_DATE

    intervalCache                   : IntervalCache<IntervalT, CombineWithIntervalT>

    intervalsCachingChunkDuration   : Duration  = 30
    intervalsCachingChunkUnit       : TimeUnit  = TimeUnit.Day

    maxCacheExtendCycles            : number    = 1000

    // max range for the iteration - 5 years
    maxRange                        : number    = 5 * 365 * 24 * 60 * 60 * 1000

    //
    // Returns the dateHelper to use for date arithmetic. Subclasses (CalendarCacheSingle)
    // override this to return the calendar's timezone-aware dateHelper.
    //
    get dateHelper () : typeof DateHelper {
        return DateHelper
    }


    constructor (config? : Partial<CalendarCache<IntervalT, CombineWithIntervalT>>) {
        config && Object.assign(this, config)
    }


    includeWrappingRangeFrom (cache : CalendarCache<CombineWithIntervalT, any>, startDate : Date, endDate : Date) {
        cache.ensureCacheFilledForInterval(startDate, endDate)

        this.intervalCache.includeWrappingRange(cache.intervalCache, startDate, endDate)
    }


    // after this method, we guarantee, that for every point between `startDate` and `endDate` (_inclusive_)
    // we'll have a final representation of the cache, that is, we'll be able to get an interval to which this point belongs
    // _both_ for forward and backward directions
    ensureCacheFilledForInterval (startDate : Date, endDate : Date) {
        const cacheFilledStartDateN = this.cacheFilledStartDate.getTime()
        const cacheFilledEndDateN   = this.cacheFilledEndDate.getTime()

        if (cacheFilledStartDateN !== MAX_DATE.getTime()) {
            const startDateN        = startDate.getTime()
            const endDateN          = endDate.getTime()

            if (cacheFilledStartDateN <= startDateN && endDateN <= cacheFilledEndDateN) return

            // asked to cache an interval which is to the left from the cached area - extend to the right
            if (endDateN <= cacheFilledStartDateN) {

                endDate             = new Date(cacheFilledStartDateN - 1)

            } else if (startDateN >= cacheFilledEndDateN) {

                startDate           = new Date(cacheFilledEndDateN)

            } else if (cacheFilledStartDateN <= startDateN && startDateN <= cacheFilledEndDateN) {

                startDate           = new Date(cacheFilledEndDateN + 1)

            } else if (cacheFilledStartDateN <= endDateN && endDateN <= cacheFilledEndDateN) {

                endDate             = new Date(cacheFilledStartDateN - 1)

            } else {
                this.ensureCacheFilledForInterval(startDate, new Date(cacheFilledStartDateN - 1))
                this.ensureCacheFilledForInterval(new Date(cacheFilledEndDateN + 1), endDate)

                return
            }
        }

        if (cacheFilledStartDateN === MAX_DATE.getTime() || startDate.getTime() < cacheFilledEndDateN) {
            this.cacheFilledStartDate   = startDate
        }

        if (cacheFilledEndDateN === MIN_DATE.getTime() || cacheFilledEndDateN < endDate.getTime()) {
            this.cacheFilledEndDate     = endDate
        }

        this.fillCache(startDate, endDate)
    }


    fillCache (_1/* startDate */ : Date, _2/* endDate */ : Date) {
        throw new Error("Abstract method")
    }


    clear () {
        this.cacheFilledStartDate   = MAX_DATE
        this.cacheFilledEndDate     = MIN_DATE

        this.intervalCache.clear()
    }


    /**
     * The core iterator method of the calendar cache.
     *
     * @param options The options for iterator. Should contain at least one of the `startDate`/`endDate` properties
     * which indicates what timespan to examine for availability intervals. If one of boundaries is not provided
     * iterator function should return `false` at some point, to avoid infinite loops.
     *
     * Another recognized option is `isForward`, which indicates the direction in which to iterate through the timespan.
     *
     * Another recognized option is `maxRange`, which indicates the maximum timespan for this iterator (in milliseconds). When iterator
     * exceeds this timespan, the iteration is stopped and [[CalendarIteratorResult.MaxRangeReached]] value is returned.
     * Default value is 5 years.
     *
     * @param func The iterator function to call. It will be called for every distinct set of availability intervals, found
     * in the given timespan. All the intervals, which are "active" for current interval are collected in the 3rd argument
     * for this function. If iterator returns `false` (checked with `===`) the iteration stops.
     *
     * @param scope The scope (`this` value) to execute the iterator in.
     */
    forEachAvailabilityInterval (
        options     : { startDate? : Date, endDate? : Date, isForward? : boolean, maxRange? : number },
        func        : (startDate : Date, endDate : Date, calendarCacheInterval : IntervalT) => false | void,
        scope?      : object
    ) : CalendarIteratorResult {
        scope                       = scope || this

        const startDate             = options.startDate
        const endDate               = options.endDate
        const startDateN            = startDate && startDate.getTime()
        const endDateN              = endDate && endDate.getTime()
        const maxRange              = options.maxRange ?? this.maxRange

        // `isForward = true` by default
        const isForward             = options.isForward !== false

        if (isForward ? !startDate : !endDate) {
            throw new Error("At least `startDate` or `endDate` is required, depending from the `isForward` option")
        }

        const intervalCache         = this.intervalCache

        let cacheCursorDate         = isForward ? startDate : endDate
        let cursorDate              = isForward ? startDate : endDate

        const rangeStart            = cursorDate.getTime()

        // this is generally an endless loop, but we artificially limit it to `maxCacheExtendCycles` iterations
        // to avoid freezing in unforeseen edge cases
        for (let cycle = 1; cycle < this.maxCacheExtendCycles; cycle++) {
            if (isForward) {
                this.ensureCacheFilledForInterval(
                    cacheCursorDate,
                    endDate || this.dateHelper.add(cacheCursorDate, this.intervalsCachingChunkDuration, this.intervalsCachingChunkUnit)
                )
            } else {
                this.ensureCacheFilledForInterval(
                    startDate || this.dateHelper.add(cacheCursorDate, -this.intervalsCachingChunkDuration, this.intervalsCachingChunkUnit),
                    cacheCursorDate
                )
            }

            let interval        = intervalCache.getIntervalOf(cursorDate, isForward ? EdgeInclusion.Left : EdgeInclusion.Right)

            while (interval) {
                const intervalStartDate = interval.startDate
                const intervalEndDate   = interval.endDate

                // out of requested range - all done
                if (
                    (isForward && endDateN && intervalStartDate.getTime() >= endDateN)
                    ||
                    (!isForward && startDateN && intervalEndDate.getTime() <= startDateN)
                ) {
                    return CalendarIteratorResult.FullRangeIterated
                }

                if (
                    (isForward && intervalStartDate.getTime() - rangeStart >= maxRange)
                    ||
                    (!isForward && rangeStart - intervalEndDate.getTime() >= maxRange)
                ) {
                    return CalendarIteratorResult.MaxRangeReached
                }


                // we are out of cached area, need to extend the cache,
                // using `>=, <=` here, because, as an edge case the cache can be filled exactly up to that interval
                // and following interval will be infinity, which will trigger premature loop exit
                // caused by the https://github.com/bryntum/bryntum/issues/6406
                if (
                    (isForward && intervalStartDate.getTime() >= this.cacheFilledEndDate.getTime())
                    ||
                    (!isForward && intervalEndDate.getTime() <= this.cacheFilledStartDate.getTime())
                ) {
                    break
                }

                // save the last processed point, from which we should start after cache will be extended
                cursorDate              = isForward ? intervalEndDate : intervalStartDate

                // adjust to start / end date limits in iterator
                const countFrom         = startDateN && intervalStartDate.getTime() < startDateN ? startDate : intervalStartDate
                const countTill         = endDateN && intervalEndDate.getTime() > endDateN ? endDate : intervalEndDate

                if (func.call(scope, countFrom, countTill, interval.cacheInterval) === false) {
                    // indicates premature exit if iterator returns `false`
                    return CalendarIteratorResult.StoppedByIterator
                }

                interval                = isForward ? intervalCache.getNextInterval(interval) : intervalCache.getPrevInterval(interval)
            }

            if (isForward && cursorDate.getTime() === MAX_DATE.getTime() || !isForward && cursorDate.getTime() === MIN_DATE.getTime()) {
                return CalendarIteratorResult.FullRangeIterated
            }

            cacheCursorDate             = isForward ? this.cacheFilledEndDate : this.cacheFilledStartDate
        }

        return CalendarIteratorResult.MaxCacheExtendCyclesReached
    }

    getIterator (
        options : { startDate? : Date, endDate? : Date, isForward? : boolean, maxRange? : number }
    ) :
        Iterable<CalendarCacheIteratorValue<IntervalT>>
        & Iterator<CalendarCacheIteratorValue<IntervalT>, CalendarCacheIteratorValue<IntervalT>>
    {
        const me                    = this
        const startDate             = options.startDate
        const endDate               = options.endDate
        const startDateN            = startDate && startDate.getTime()
        const endDateN              = endDate && endDate.getTime()
        const maxRange              = options.maxRange ?? me.maxRange

        // `isForward = true` by default
        const isForward             = options.isForward !== false

        if (isForward ? !startDate : !endDate) {
            throw new Error("At least `startDate` or `endDate` is required, depending from the `isForward` option")
        }

        let stopped : boolean = false
        let cycle = 1
        let interval : CacheInterval<IntervalT>

        const maxCacheExtendCycles          = me.maxCacheExtendCycles
        const intervalCache                 = me.intervalCache
        const intervalsCachingChunkDuration = me.intervalsCachingChunkDuration
        const intervalsCachingChunkUnit     = me.intervalsCachingChunkUnit

        let cacheCursorDate         = isForward ? startDate : endDate
        let cursorDate              = cacheCursorDate

        const rangeStart            = cursorDate.getTime()

        return {

            return(value) {
                // raise a flag to stop iterating
                stopped = true

                return { done : true, value }
            },

            next() : CalendarCacheIteratorResult<CalendarCacheIteratorValue<IntervalT>, CalendarCacheIteratorValue<IntervalT>> {
                if (stopped) {
                    return { done : true, value : undefined }
                }

                if (isForward) {
                    while (1) {
                        // this is generally an endless loop, but we artificially limit it to `maxCacheExtendCycles` iterations
                        // to avoid freezing in unforeseen edge cases
                        if (cycle >= maxCacheExtendCycles) {
                            return { done : true, value : undefined }
                        }

                        // extend cache
                        me.ensureCacheFilledForInterval(
                            cacheCursorDate,
                            endDate || DateHelper.add(cacheCursorDate, intervalsCachingChunkDuration, intervalsCachingChunkUnit)
                        )

                        // for the first iteration get interval by date ..further steps do getNextInterval
                        interval = interval ? intervalCache.getNextInterval(interval) : intervalCache.getIntervalOf(cursorDate, EdgeInclusion.Left)

                        if (!interval) return { done : true, value : undefined }

                        const intervalStartDate = interval.startDate
                        const intervalEndDate   = interval.endDate

                        // out of requested range - all done
                        if (endDateN && intervalStartDate.getTime() >= endDateN) {
                            return { done : true, value : undefined, flag : CalendarIteratorResult.FullRangeIterated }
                        }

                        if (intervalStartDate.getTime() - rangeStart >= maxRange) {
                            return { done : true, value : undefined, flag : CalendarIteratorResult.MaxRangeReached }
                        }

                        // we are out of cached area, need to extend the cache,
                        // using `>=, <=` here, because, as an edge case the cache can be filled exactly up to that interval
                        // and following interval will be infinity, which will trigger premature loop exit
                        // caused by the https://github.com/bryntum/bryntum/issues/6406
                        if (intervalStartDate.getTime() < me.cacheFilledEndDate.getTime()) {
                            // save the last processed point, from which we should start after cache will be extended
                            cursorDate              = intervalEndDate

                            // adjust to start / end date limits in iterator
                            const countFrom         = startDateN && intervalStartDate.getTime() < startDateN ? startDate : intervalStartDate
                            const countTill         = endDateN && intervalEndDate.getTime() > endDateN ? endDate : intervalEndDate

                            return {
                                value : {
                                    startDate             : countFrom,
                                    endDate               : countTill,
                                    calendarCacheInterval : interval.cacheInterval
                                },
                                done  : false
                            }
                        }

                        if (cursorDate.getTime() === MAX_DATE.getTime()) {
                            return { done : true, value : undefined, flag : CalendarIteratorResult.FullRangeIterated }
                        }

                        cacheCursorDate             = me.cacheFilledEndDate

                        cycle++
                    }
                }
                else {
                    while (1) {
                        // this is generally an endless loop, but we artificially limit it to `maxCacheExtendCycles` iterations
                        // to avoid freezing in unforeseen edge cases
                        if (cycle >= maxCacheExtendCycles) {
                            return { done : true, value : undefined }
                        }

                        // extend cache
                        me.ensureCacheFilledForInterval(
                            startDate || DateHelper.add(cacheCursorDate, -intervalsCachingChunkDuration, intervalsCachingChunkUnit),
                            cacheCursorDate
                        )

                        // for the first iteration get interval by date ..further steps do getPrevInterval
                        interval = interval ? intervalCache.getPrevInterval(interval) : intervalCache.getIntervalOf(cursorDate, EdgeInclusion.Right)

                        if (!interval) return { done : true, value : undefined }

                        const intervalStartDate = interval.startDate
                        const intervalEndDate   = interval.endDate

                        // out of requested range - all done
                        if (startDateN && intervalEndDate.getTime() <= startDateN) {
                            return { done : true, value : undefined, flag : CalendarIteratorResult.FullRangeIterated }
                        }

                        if (rangeStart - intervalEndDate.getTime() >= maxRange) {
                            return { done : true, value : undefined, flag : CalendarIteratorResult.MaxRangeReached }
                        }

                        // we are out of cached area, need to extend the cache,
                        // using `>=, <=` here, because, as an edge case the cache can be filled exactly up to that interval
                        // and following interval will be infinity, which will trigger premature loop exit
                        // caused by the https://github.com/bryntum/bryntum/issues/6406
                        if (intervalEndDate.getTime() > me.cacheFilledStartDate.getTime()) {
                            // save the last processed point, from which we should start after cache will be extended
                            cursorDate              = intervalStartDate

                            // adjust to start / end date limits in iterator
                            const countFrom         = startDateN && intervalStartDate.getTime() < startDateN ? startDate : intervalStartDate
                            const countTill         = endDateN && intervalEndDate.getTime() > endDateN ? endDate : intervalEndDate

                            return {
                                value : {
                                    startDate             : countFrom,
                                    endDate               : countTill,
                                    calendarCacheInterval : interval.cacheInterval
                                },
                                done  : false
                            }
                        }

                        if (cursorDate.getTime() === MIN_DATE.getTime()) {
                            return { done : true, value : undefined, flag : CalendarIteratorResult.FullRangeIterated }
                        }

                        cacheCursorDate             = me.cacheFilledStartDate

                        cycle++
                    }
                }
            },

            [Symbol.iterator]() : Iterator<CalendarCacheIteratorValue<IntervalT>, CalendarCacheIteratorValue<IntervalT>> {
                return this
            }
        }
    }
}
