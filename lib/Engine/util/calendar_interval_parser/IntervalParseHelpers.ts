import DateHelper from "../../../Core/helper/DateHelper.js";
import { NEVER } from "./CalendarIntervalParser.js";
import type { ArrayLookupFn, CompiledConstraint } from "./CalendarIntervalParser.js";

/**
 * Internal helpers used by [[CompiledConstraintImpl]] and [[CompiledScheduleImpl]] at
 * runtime. Pure static utilities kept separate from [[CalendarIntervalParser]] so the
 * parser class stays focused on its public API surface.
 *
 * @module Engine/util/calendar_interval_parser/IntervalParseHelpers
 * @internal
 */
export class IntervalParseHelpers {

    /**
     * Sort in place, ascending. When `zeroIsLast` is set, a leading `0` is moved to the
     * end which the parser encodes "the maximum extent" as `0` for some periods (e.g. day-of-month
     * `31` or `0` depending on whether `last` was applied).
     */
    static sortArray(arr : number[], zeroIsLast? : boolean) : void {
        arr.sort((a, b) => +a - +b);
        if (zeroIsLast && arr[0] === 0) {
            arr.push(arr.shift()!);
        }
    }

    static findNextInArray(value : number, values : number[], extent : number[]) : number {
        const zeroIsLargest = extent[0] !== 0;
        let cur     : number,
            nextIdx = 0;

        for (let i = values.length - 1; i > -1; --i) {
            cur = values[i];
            if (cur === value) {
                return cur;
            }
            if (cur > value || (cur === 0 && zeroIsLargest && extent[1] > value)) {
                nextIdx = i;
                continue;
            }
            break;
        }
        return values[nextIdx];
    }

    static findNextInvalidInArray(value : number, values : number[], extent : number[]) : number | undefined {
        const
            min     = extent[0],
            max     = extent[1],
            len     = values.length,
            zeroVal = values[len - 1] === 0 && min !== 0 ? max : 0;
        let next    = value,
            i       = values.indexOf(value),
            start   = next;

        while (next === (values[i] || zeroVal)) {
            next++;
            if (next > max) {
                next = min;
            }
            i++;
            if (i === len) {
                i = 0;
            }
            if (next === start) {
                return undefined;
            }
        }
        return next;
    }

    static findPrevInArray(value : number, values : number[], extent : number[]) : number {
        const
            len           = values.length,
            zeroIsLargest = extent[0] !== 0;
        let
            cur     : number,
            prevIdx = len - 1;

        for (let i = 0; i < len; i++) {
            cur = values[i];
            if (cur === value) {
                return cur;
            }
            if (cur < value || (cur === 0 && zeroIsLargest && extent[1] < value)) {
                prevIdx = i;
                continue;
            }
            break;
        }
        return values[prevIdx];
    }

    static findPrevInvalidInArray(value : number, values : number[], extent : number[]) : number | undefined {
        const
            min     = extent[0],
            max     = extent[1],
            len     = values.length,
            zeroVal = values[len - 1] === 0 && min !== 0 ? max : 0;
        let next    = value,
            i       = values.indexOf(value),
            start   = next;

        while (next === (values[i] || zeroVal)) {
            next--;
            if (next < min) {
                next = max;
            }
            i--;
            if (i === -1) {
                i = len - 1;
            }
            if (next === start) {
                return undefined;
            }
        }
        return next;
    }

    /**
     * Dispatch map the schedule compiler indexes by direction string
     * (`next` / `prev` / `nextInvalid` / `prevInvalid` / `sort`) at runtime.
     */
    static readonly scheduleArray : Record<string, ArrayLookupFn | ((...args : any[]) => void)> = {
        sort        : IntervalParseHelpers.sortArray,
        next        : IntervalParseHelpers.findNextInArray,
        nextInvalid : IntervalParseHelpers.findNextInvalidInArray,
        prev        : IntervalParseHelpers.findPrevInArray,
        prevInvalid : IntervalParseHelpers.findPrevInvalidInArray
    };

    // ─── Schedule iteration helpers ─────────────────────────────────────────────

    /**
     * Direction-aware date comparator. Returns a binary comparator whose polarity depends on
     * `dir`: for `"next"` it answers "is `a` after `b`?", for `"prev"` it flips to "is `b`
     * after `a`?". Lets the iteration engine run one loop body for both directions.
     */
    static compareFn(dir : string) : (a : any, b : any) => boolean {
        return dir === "next"
            ? (a : any, b : any) => !b || DateHelper.isAfter(a, b)
            : (a : any, b : any) => !a || DateHelper.isAfter(b, a);
    }

    static findNext(arr : any[], compare : (a : any, b : any) => boolean) : any {
        let next = arr[0];
        for (let i = 1, len = arr.length; i < len; i++) {
            if (arr[i] && compare(next, arr[i])) {
                next = arr[i];
            }
        }
        return next;
    }

    static setNextStarts(dir : string, schedArr : CompiledConstraint[], startsArr : any[], startDate : Date) : void {
        for (let i = 0, len = schedArr.length; i < len; i++) {
            startsArr[i] = schedArr[i].start(dir, startDate);
        }
    }

    static updateNextStarts(dir : string, schedArr : CompiledConstraint[], startsArr : any[], startDate : Date) : void {
        const compare = IntervalParseHelpers.compareFn(dir);
        for (let i = 0, len = schedArr.length; i < len; i++) {
            if (startsArr[i] && !compare(startsArr[i], startDate)) {
                startsArr[i] = schedArr[i].start(dir, startDate);
            }
        }
    }

    static buildRange(schedEntry : CompiledConstraint, dir : string, startDate : Date) : [Date, Date | undefined] | 0 {
        const nextStart = schedEntry.start(dir, startDate);
        return nextStart ? [nextStart, schedEntry.end(dir, nextStart)] : NEVER;
    }

    static setRangeStarts(dir : string, schedArr : CompiledConstraint[], rangesArr : any[], startDate : Date) : void {
        for (let i = 0, len = schedArr.length; i < len; i++) {
            rangesArr[i] = IntervalParseHelpers.buildRange(schedArr[i], dir, startDate);
        }
    }

    static updateRangeStarts(dir : string, schedArr : CompiledConstraint[], rangesArr : any[], startDate : Date) : void {
        const compare = IntervalParseHelpers.compareFn(dir);
        for (let i = 0, len = schedArr.length; i < len; i++) {
            if (rangesArr[i] && !compare(rangesArr[i][0], startDate)) {
                rangesArr[i] = IntervalParseHelpers.buildRange(schedArr[i], dir, startDate);
            }
        }
    }

    /**
     * Advance each `startsArr[i]` past `startDate`. Falls back to `tickSafe` when a DST
     * transition makes `start(tick(...))` land on the same instant again, which would
     * otherwise loop forever.
     */
    static tickStarts(dir : string, schedArr : CompiledConstraint[], startsArr : any[], startDate : Date) : void {
        for (let i = 0, len = schedArr.length; i < len; i++) {
            if (startsArr[i] && DateHelper.isEqual(startsArr[i], startDate)) {
                const newStart = schedArr[i].start(dir, schedArr[i].tick(dir, startDate));

                if (newStart !== NEVER && DateHelper.isEqual(newStart, startsArr[i])) {
                    startsArr[i] = schedArr[i].start(dir, schedArr[i].tickSafe(dir, startDate));
                }
                else {
                    startsArr[i] = newStart;
                }
            }
        }
    }

    static getStart(schedArr : CompiledConstraint[], startsArr : any[], startDate : Date, minEndDate? : Date) : Date | undefined {
        let result;
        for (let i = 0, len = startsArr.length; i < len; i++) {
            if (startsArr[i] && DateHelper.isEqual(startsArr[i], startDate)) {
                const start = schedArr[i].tickStart(startDate);
                if (minEndDate && DateHelper.isBefore(start, minEndDate)) {
                    return minEndDate;
                }
                if (!result || DateHelper.isAfter(start, result)) {
                    result = start;
                }
            }
        }
        return result;
    }

    static calcRangeOverlap(dir : string, rangesArr : any[], startDate : Date) : Date | undefined {
        const compare = IntervalParseHelpers.compareFn(dir);
        let result;
        for (let i = 0, len = rangesArr.length; i < len; i++) {
            const range = rangesArr[i];
            if (range && !compare(range[0], startDate) && (!range[1] || compare(range[1], startDate))) {
                if (!result || compare(range[1], result)) {
                    result = range[1];
                }
            }
        }
        return result;
    }

    static calcMaxEndDate(exceptsArr : any[], compare : (a : any, b : any) => boolean) : Date | undefined {
        let result;
        for (let i = 0, len = exceptsArr.length; i < len; i++) {
            if (exceptsArr[i] && (!result || compare(result, exceptsArr[i][0]))) {
                result = exceptsArr[i][0];
            }
        }
        return result;
    }

    static calcEnd(dir : string, schedArr : CompiledConstraint[], startsArr : any[], startDate : Date, maxEndDate? : Date) : Date | undefined {
        const compare = IntervalParseHelpers.compareFn(dir);
        let result;
        for (let i = 0, len = schedArr.length; i < len; i++) {
            const start = startsArr[i];
            if (start && DateHelper.isEqual(start, startDate)) {
                const end = schedArr[i].end(dir, start);
                if (maxEndDate && (!end || compare(end, maxEndDate))) {
                    return maxEndDate;
                }
                if (!result || compare(end, result)) {
                    result = end;
                }
            }
        }
        return result;
    }

    /**
     * Defensive clone. Applied to every result before it leaves the engine so callers that
     * mutate returned Dates cannot corrupt cached schedule state.
     */
    static cleanDate(date : Date) : Date | undefined {
        return DateHelper.isValidDate(date) ? DateHelper.clone(date) : undefined;
    }
}
