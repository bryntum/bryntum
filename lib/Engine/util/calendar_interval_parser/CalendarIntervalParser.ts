import DateHelper from "../../../Core/helper/DateHelper.js";
import TimePeriodsMixin from "./mixin/TimePeriodsMixin.js";
import ScheduleTextParserMixin from "./mixin/ScheduleTextParserMixin.js";
import { ScheduleBuilder } from "./ScheduleBuilder.js";
import { IntervalParseHelpers } from "./IntervalParseHelpers.js";
export { ScheduleBuilder } from "./ScheduleBuilder.js";

/**
 * Convert recurrence definitions into executable schedule objects. Provides parsing of human-readable text
 * expressions and a fluent builder API for defining recurring schedules. Compiled schedules can enumerate
 * forward and backward occurrences, check validity, compute ranges, and drive timers.
 *
 * @module Engine/util/calendar_interval_parser/CalendarIntervalParser
 */

// ─── Types ──────────────────────────────────────────────────────────────────────

/**
 * A single schedule constraint. Maps time-period keys to arrays of valid values.
 *
 * Recognized keys:
 * - `t` — time (seconds since midnight)
 * - `s` — second (0–59)
 * - `m` — minute (0–59)
 * - `h` — hour (0–23)
 * - `D` — day of month (1–31)
 * - `d` / `dw` — day of week (1=Sun … 7=Sat)
 * - `dc` — day-of-week count (1st Monday, etc.)
 * - `dy` — day of year (1–366)
 * - `wm` — week of month
 * - `wy` — week of year (ISO)
 * - `M` — month (1–12)
 * - `Y` — year (1970–2099)
 * - `fd` — full date (epoch ms)
 * - `fd_a` — after full date (modifier)
 * - `fd_b` — before full date (modifier)
 */
export type ScheduleConstraint = Record<string, number[]>;

/**
 * A parsed schedule definition containing inclusion and exclusion constraints.
 *
 * @property {ScheduleConstraint[]} schedules Array of inclusion constraints (OR'd together)
 * @property {ScheduleConstraint[]} exceptions Array of exclusion constraints
 * @property {Number} error Position of parse error in the input string, or `-1` if parsing succeeded
 */
export type ScheduleDefinition = {
    schedules   : ScheduleConstraint[]
    exceptions  : ScheduleConstraint[]
    error       : number
};

/**
 * A compiled schedule with methods for enumerating occurrences.
 *
 * Returned by [[CalendarIntervalParser.compile]]. All enumeration methods return `0`
 * (the [[NEVER]] sentinel) when no valid occurrence exists within the search range.
 */
export type CompiledSchedule = {

    /**
     * Check whether the given date satisfies the schedule constraints.
     * @param {Date} d The date to check
     * @returns {Boolean} `true` if the date is a valid occurrence
     */
    isValid(d : Date) : boolean

    /**
     * Find the next occurrence(s) on or after `startDate`.
     * @param {Number} [count=1] Number of occurrences to find
     * @param {Date} [startDate] Search start (defaults to now)
     * @param {Date} [endDate] Search boundary — stops if the next occurrence would exceed this date
     * @returns {Date|Date[]|0} A single Date when `count` is 1, an array when `count` > 1, or `0` if none found
     */
    next(count? : number, startDate? : Date, endDate? : Date) : Date | Date[] | 0

    /**
     * Find the previous occurrence(s) on or before `startDate`.
     * @param {Number} [count=1] Number of occurrences to find
     * @param {Date} [startDate] Search start (defaults to now)
     * @param {Date} [endDate] Search boundary
     * @returns {Date|Date[]|0} A single Date when `count` is 1, an array when `count` > 1, or `0` if none found
     */
    prev(count? : number, startDate? : Date, endDate? : Date) : Date | Date[] | 0

    /**
     * Find the next date range(s) where the schedule is valid, moving forward.
     * @param {Number} [count=1] Number of ranges to find
     * @param {Date} [startDate] Search start (defaults to now)
     * @param {Date} [endDate] Search boundary
     * @returns {Array|0} Array of `[rangeStart, rangeEnd]` tuples, or `0` if none found
     */
    nextRange(count? : number, startDate? : Date, endDate? : Date) : [Date?, Date?][] | 0

    /**
     * Find the previous date range(s) where the schedule is valid, moving backward.
     * @param {Number} [count=1] Number of ranges to find
     * @param {Date} [startDate] Search start (defaults to now)
     * @param {Date} [endDate] Search boundary
     * @returns {Array|0} Array of `[rangeStart, rangeEnd]` tuples, or `0` if none found
     */
    prevRange(count? : number, startDate? : Date, endDate? : Date) : [Date?, Date?][] | 0
};

/**
 * Alias kept for semantic clarity in schedule-engine signatures.
 */
export type ScheduleDate = Date;

/**
 * A time-period object used by the schedule compiler. Each period (year, month, day, etc.)
 * provides methods for value extraction, validation, extent computation, and navigation.
 */
export type TimePeriod = {
    name   : string
    range  : number
    val(date : ScheduleDate) : number
    isValid(date : ScheduleDate, value : number) : boolean
    extent(date? : ScheduleDate) : number[]
    start(date : ScheduleDate) : Date
    end(date : ScheduleDate) : Date
    next(date : ScheduleDate, value : number) : Date | 0
    prev(date : ScheduleDate, value : number) : Date | 0
};

/**
 * Modifier function that wraps a [[TimePeriod]] to restrict it to a subset of its extent.
 */
export type ModifierFn = (constraint : TimePeriod, values : number[]) => TimePeriod;

/**
 * Map of modifier functions keyed by name (`after`, `before`) and alias (`a`, `b`).
 */
export type ModifierMap = Record<string, ModifierFn>;

/**
 * Map of [[TimePeriod]] objects keyed by name and alias (e.g., `year`/`Y`, `month`/`M`).
 */
export type TimePeriodMap = Record<string, TimePeriod>;

/**
 * A compiled constraint resolution engine produced by [[CalendarIntervalParser.compileConstraint]].
 */
export type CompiledConstraint = {
    start(dir : string, startDate : Date) : Date | 0
    end(dir : string, startDate : Date) : Date | undefined
    tick(dir : string, date : Date) : Date
    tickSafe(dir : string, date : Date) : Date
    tickStart(date : Date) : Date
};

/**
 * Array-lookup function signature used by the schedule compiler dispatch map.
 */
export type ArrayLookupFn = (value : number, values : number[], extent : number[]) => number | undefined;

// ─── Constants ──────────────────────────────────────────────────────────────────

/**
 * Sentinel value meaning "no valid occurrence".
 */
export const NEVER : 0 = 0;


/**
 * Base class used as the target for the mixin chain. Holds no members of its own — all
 * static surface is contributed by `TimePeriodsMixin` and `ScheduleTextParserMixin`,
 * plus the remaining statics declared directly on [[CalendarIntervalParser]] below.
 *
 * @internal
 */
class CalendarIntervalParserBase {}

/**
 * Calendar interval parser which compiles recurrence definitions into executable schedule objects.
 * Provides parsing of human-readable text expressions and a fluent builder API for defining
 * recurring schedules. Compiled schedules can enumerate forward and backward occurrences,
 * check validity, compute ranges, and drive timers.
 *
 */
export class CalendarIntervalParser extends TimePeriodsMixin(ScheduleTextParserMixin(CalendarIntervalParserBase)) {
    static $name = 'CalendarIntervalParser';

    /**
     * The `DateHelper` used by the time-period operations (`val`/`start`/`end`/`next`/`prev`) and by
     * [[nextDate]]/[[prevDate]] while enumerating occurrences. Defaults to the static (local-time) `DateHelper`. Set to
     * a timezone-aware `DateHelperTZ` (by `CalendarCacheSingle`) for the duration of a generation pass so recurring
     * calendar intervals are computed directly in the intended timezone, with correct DST handling. Always restored in
     * a `finally`, so the shared periods stay timezone agnostic and the compiled-schedule caches remain valid.
     */
    static activeDateHelper : typeof DateHelper = DateHelper;

    /**
     * Compile a parsed schedule definition into an executable schedule object. The returned
     * [[CompiledSchedule]] provides `next`, `prev`, `nextRange`, `prevRange`, and `isValid`
     * methods for enumerating occurrences.
     *
     * @param {ScheduleDefinition} definition A schedule definition produced by [[parseText]] or [[recur]]
     * @returns {CompiledSchedule} Compiled schedule with enumeration methods
     */
    static compile(definition : ScheduleDefinition | any) : CompiledSchedule {
        const compile = this.createCompiler();
        return this.createCompiledSchedule(definition, compile);
    }

    /**
     * Create a fluent recurrence builder for composing schedule definitions programmatically.
     * Chain constraint methods (`.on()`, `.every()`, `.after()`, `.before()`) followed by
     * a time-period method (`.second()`, `.minute()`, `.hour()`, `.dayOfMonth()`,
     * `.dayOfWeek()`, `.month()`, `.year()`, etc.) to build up a definition.
     *
     * The returned builder can be passed directly as a `recurrentStartDate` or `recurrentEndDate`
     * value on calendar intervals, or compiled via [[compile]].
     *
     * @returns {ScheduleBuilder} Fluent builder with `.schedules` and `.exceptions` arrays
     */
    static recur() : any {
        return new ScheduleBuilder();
    }

    /**
     * Build a Date for the start of a period. Uses 1-based month. Omitted fields default to the start of the period (Jan 1, 00:00:00).
     *
     * @param {Number} year Full year
     * @param {Number} [month] 1-based month (1 = January)
     * @param {Number} [dayOfMonth=1] Day of month
     * @param {Number} [hours=0] Hours
     * @param {Number} [minutes=0] Minutes
     * @param {Number} [seconds=0] Seconds
     * @returns {Date}
     */
    static nextDate(year : number, month? : number, dayOfMonth? : number, hours? : number, minutes? : number, seconds? : number) : Date {
        return CalendarIntervalParser.activeDateHelper.create({
            year,
            month   : month !== undefined ? month - 1 : 0,
            date    : dayOfMonth !== undefined ? dayOfMonth : 1,
            hours   : hours || 0,
            minutes : minutes || 0,
            seconds : seconds || 0
        });
    }

    /**
     * Build a Date for the end of a period. Uses 1-based month. Omitted fields default to the end of the period (Dec 31, 23:59:59).
     *
     * @param {Number} year Full year
     * @param {Number} [month] 1-based month (1 = January)
     * @param {Number} [dayOfMonth] Day of month (defaults to last day of month)
     * @param {Number} [hours=23] Hours
     * @param {Number} [minutes=59] Minutes
     * @param {Number} [seconds=59] Seconds
     * @returns {Date}
     */
    static prevDate(year : number, month? : number, dayOfMonth? : number, hours? : number, minutes? : number, seconds? : number) : Date {
        const
            m  = month === undefined ? 11 : month - 1,
            dh = CalendarIntervalParser.activeDateHelper;

        return dh.create({
            year,
            month   : m,
            date    : dayOfMonth === undefined ? dh.daysInMonth(dh.create({ year, month : m, date : 1 })) : dayOfMonth,
            hours   : hours === undefined ? 23 : hours,
            minutes : minutes === undefined ? 59 : minutes,
            seconds : seconds === undefined ? 59 : seconds
        });
    }

    /**
     * Roll forward to the next period if the current value is past or equal to `value`.
     *
     * @param {Date} date Current date
     * @param {Number} value Target constraint value
     * @param {TimePeriod} constraint The constraint being resolved
     * @param {TimePeriod} period The containing period to roll over
     * @returns {Date}
     */
    static nextRollover(date : Date, value : number, constraint : TimePeriod, period : TimePeriod) : Date {
        const
            cur = constraint.val(date),
            max = constraint.extent(date)[1];

        return (value || max) <= cur || value > max
            ? DateHelper.add(period.end(date), 1, 'second')
            : period.start(date);
    }

    /**
     * Roll backward to the previous period if the current value is at or past `value`.
     *
     * @param {Date} date Current date
     * @param {Number} value Target constraint value
     * @param {TimePeriod} constraint The constraint being resolved
     * @param {TimePeriod} period The containing period to roll over
     * @returns {Date}
     */
    static prevRollover(date : Date, value : number, constraint : TimePeriod, period : TimePeriod) : Date {
        const cur = constraint.val(date);

        return value >= cur || !value
            ? period.start(period.prev(date, period.val(date) - 1) as Date)
            : period.start(date);
    }

    /**
     * Build the [[TimePeriodMap]], a long-name/short-alias view over the `TimePeriodsMixin` singletons.
     *
     * @returns {TimePeriodMap} Map of period objects keyed by name and alias (e.g. both `year` and `Y` map to the `periodYear` static)
     */
    static createTimePeriods() : TimePeriodMap {
        const me = this;

        return {
            year           : me.periodYear,           Y  : me.periodYear,
            month          : me.periodMonth,          M  : me.periodMonth,
            day            : me.periodDay,            D  : me.periodDay,
            dayOfWeek      : me.periodDayOfWeek,      dw : me.periodDayOfWeek,   d : me.periodDayOfWeek,
            dayOfYear      : me.periodDayOfYear,      dy : me.periodDayOfYear,
            dayOfWeekCount : me.periodDayOfWeekCount, dc : me.periodDayOfWeekCount,
            hour           : me.periodHour,           h  : me.periodHour,
            minute         : me.periodMinute,         m  : me.periodMinute,
            second         : me.periodSecond,         s  : me.periodSecond,
            time           : me.periodTime,           t  : me.periodTime,
            weekOfMonth    : me.periodWeekOfMonth,    wm : me.periodWeekOfMonth,
            weekOfYear     : me.periodWeekOfYear,     wy : me.periodWeekOfYear,
            fullDate       : me.periodFullDate,       fd : me.periodFullDate
        };
    }

    /**
     * `after N` modifier which restricts `constraint` to values `>= N`.
     *
     * @param {TimePeriod} constraint Period to restrict
     * @param {Number[]} values `[N]` — threshold value
     * @returns {TimePeriod} Restricted period
     * @internal
     */
    static modifierAfter(constraint : TimePeriod, values : number[]) : TimePeriod {
        const value = values[0];

        return {
            name  : "after " + constraint.name,
            range : (constraint.extent(DateHelper.create({ year : 2000, month : 0, date : 1, hours : 0, minutes : 0, seconds : 0 }) as ScheduleDate)[1] - value) * constraint.range,
            val   : constraint.val,
            isValid(date : ScheduleDate) {
                return this.val(date) >= value;
            },
            extent : constraint.extent,
            start  : constraint.start,
            end    : constraint.end,
            next(startDate : ScheduleDate, currentValue : number) {
                if (currentValue != value) currentValue = constraint.extent(startDate)[0];
                return constraint.next(startDate, currentValue);
            },
            prev(startDate : ScheduleDate, currentValue : number) {
                currentValue = currentValue === value ? constraint.extent(startDate)[1] : value - 1;
                return constraint.prev(startDate, currentValue);
            }
        } as TimePeriod;
    }

    /**
     * `before N` modifier which restricts `constraint` to values `< N`.
     *
     * @param {TimePeriod} constraint Period to restrict
     * @param {Number[]} values `[N]` — threshold value (last entry used)
     * @returns {TimePeriod} Restricted period
     * @internal
     */
    static modifierBefore(constraint : TimePeriod, values : number[]) : TimePeriod {
        const value = values[values.length - 1];

        return {
            name  : "before " + constraint.name,
            range : constraint.range * (value - 1),
            val   : constraint.val,
            isValid(date : ScheduleDate) {
                return this.val(date) < value;
            },
            extent : constraint.extent,
            start  : constraint.start,
            end    : constraint.end,
            next(startDate : ScheduleDate, currentValue : number) {
                currentValue = currentValue === value ? constraint.extent(startDate)[0] : value;
                return constraint.next(startDate, currentValue);
            },
            prev(startDate : ScheduleDate, currentValue : number) {
                currentValue = currentValue === value ? value - 1 : constraint.extent(startDate)[1];
                return constraint.prev(startDate, currentValue);
            }
        } as TimePeriod;
    }

    /**
     * Create modifier functions (`after`/`before`) used by the schedule compiler.
     * Modifiers wrap a [[TimePeriod]] constraint to restrict it to a subset of its extent.
     *
     * @returns {ModifierMap} Map of modifier functions keyed by name (`after`, `before`) and short alias (`a`, `b`)
     */
    static createModifiers() : ModifierMap {
        return {
            after  : this.modifierAfter,
            before : this.modifierBefore,
            a      : this.modifierAfter,
            b      : this.modifierBefore
        };
    }

    /**
     * Internal factory hook for the text parser to obtain a fresh [[ScheduleBuilder]].
     * External callers should use [[recur]] instead.
     *
     * @returns {ScheduleBuilder}
     * @internal
     */
    static createRecurBuilder() : ScheduleBuilder {
        return new ScheduleBuilder();
    }

    /**
     * Compile a single schedule constraint into a resolution engine.
     *
     * @param {ScheduleConstraint} scheduleDefinition Constraint mapping period keys to allowed values
     * @param {TimePeriodMap} periods Period objects from [[createTimePeriods]]
     * @param {ModifierMap} modifiers Modifier functions from [[createModifiers]]
     * @returns {CompiledConstraint} Engine with `start`, `end`, `tick`, `tickSafe`, `tickStart` methods
     */
    static compileConstraint(scheduleDefinition : ScheduleConstraint, periods : TimePeriodMap, modifiers : ModifierMap) : CompiledConstraint {
        return new CompiledConstraintImpl(scheduleDefinition, periods, modifiers);
    }

    /**
     * Cached compile function. Lazily created by [[createCompiler]].
     */
    static cachedCompiler : ((scheduleDefinition : ScheduleConstraint) => CompiledConstraint) | null = null;

    /**
     * Create (or retrieve from cache) the compile function. The compile function transforms a single [[ScheduleConstraint]] into a resolution engine.
     *
     * @returns {Function} A function that compiles a [[ScheduleConstraint]] into a [[CompiledConstraint]]
     */
    static createCompiler() : (scheduleDefinition : ScheduleConstraint) => CompiledConstraint {
        const me = this;

        if (me.cachedCompiler) {
            return me.cachedCompiler;
        }

        const
            periods   = me.createTimePeriods(),
            modifiers = me.createModifiers();

        me.cachedCompiler = (scheduleDefinition : ScheduleConstraint) =>
            this.compileConstraint(scheduleDefinition, periods, modifiers);

        return me.cachedCompiler;
    }

    /**
     * Build a [[CompiledSchedule]] from a parsed [[ScheduleDefinition]].
     *
     * @param {ScheduleDefinition} definition Parsed schedule definition
     * @param {Function} compile Compile function from [[createCompiler]]
     * @returns {CompiledSchedule}
     */
    static createCompiledSchedule(definition : ScheduleDefinition, compile : (s : ScheduleConstraint) => CompiledConstraint) : CompiledSchedule {
        return new CompiledScheduleImpl(definition, compile);
    }

}

/**
 * Resolution engine for a single [[ScheduleConstraint]]. Constraints are sorted by range
 * descending so the outermost period (year > month > day > …) is walked first; the
 * innermost period becomes the `tickConstraint` used to align and step occurrences.
 *
 * @internal
 */
class CompiledConstraintImpl implements CompiledConstraint {
    private readonly constraints    : { constraint : TimePeriod, vals : number[] }[];
    private readonly constraintsLen : number;
    private readonly tickConstraint : TimePeriod;

    constructor(scheduleDefinition : ScheduleConstraint, periods : TimePeriodMap, modifiers : ModifierMap) {
        const constraints : { constraint : TimePeriod, vals : number[] }[] = [];
        let constraintsLen = 0;

        for (const key in scheduleDefinition) {
            const
                nameParts  = key.split("_"),
                name       = nameParts[0],
                mod        = nameParts[1],
                values     = scheduleDefinition[key],
                constraint = mod ? modifiers[mod](periods[name], values) : periods[name];

            constraints.push({ constraint, vals : values });
            constraintsLen++;
        }

        // Sort by range descending — largest periods first
        constraints.sort((a, b) => {
            const
                ra = a.constraint.range,
                rb = b.constraint.range;
            return rb < ra ? -1 : rb > ra ? 1 : 0;
        });

        this.constraints    = constraints;
        this.constraintsLen = constraintsLen;
        this.tickConstraint = constraints[constraintsLen - 1].constraint;
    }

    /**
     * First date on or after `startDate` that satisfies every constraint. Uses a bounded
     * fixpoint loop — bailout at 1e3 iterations guards against pathological combinations
     * that would otherwise spin indefinitely.
     */
    start(dir : string, startDate : Date) : Date | 0 {
        const
            me             = this,
            constraints    = me.constraints,
            constraintsLen = me.constraintsLen,
            nextVal        = IntervalParseHelpers.scheduleArray[dir] as ArrayLookupFn;

        let
            next : Date | 0 = startDate,
            maxAttempts     = 1e3,
            done;

        while (maxAttempts-- && !done && next) {
            done = true;

            for (let i = 0; i < constraintsLen; i++) {
                const
                    constraint = constraints[i].constraint,
                    curVal     = constraint.val(next),
                    extent     = constraint.extent(next),
                    newVal     = nextVal(curVal, constraints[i].vals, extent);

                if (!constraint.isValid(next, newVal as number)) {
                    next = constraint[dir](next, newVal as number);
                    done = false;
                    break;
                }
            }
        }

        if (next !== NEVER) {
            next = dir === "next" ? me.tickConstraint.start(next) : me.tickConstraint.end(next);
        }

        return next;
    }

    /**
     * End of the current satisfying range starting at `startDate`, found by walking
     * constraints innermost-first to locate the nearest gap.
     */
    end(dir : string, startDate : Date) : Date | undefined {
        const
            constraints    = this.constraints,
            constraintsLen = this.constraintsLen,
            nextVal        = IntervalParseHelpers.scheduleArray[dir + "Invalid"] as ArrayLookupFn,
            compare        = dir === "next"
                ? (a : Date, b : Date) => DateHelper.isAfter(a, b)
                : (a : Date, b : Date) => DateHelper.isAfter(b, a);
        let result : Date | undefined;

        for (let i = constraintsLen - 1; i >= 0; i--) {
            const
                constraint = constraints[i].constraint,
                curVal     = constraint.val(startDate),
                extent     = constraint.extent(startDate),
                newVal     = nextVal(curVal, constraints[i].vals, extent);

            if (newVal !== undefined) {
                const next = constraint[dir](startDate, newVal);
                if (next && (!result || compare(result, next))) {
                    result = next;
                }
            }
        }
        return result;
    }

    tick(dir : string, date : Date) : Date {
        return dir === "next"
            ? DateHelper.add(this.tickConstraint.end(date), 1, 'second')
            : DateHelper.add(this.tickConstraint.start(date), -1, 'second');
    }

    /**
     * DST-safe variant of `tick`. Currently delegates to `tick`; kept as a separate
     * entry point so [[IntervalParseHelpers.tickStarts]] can fall back here when the naive tick would
     * loop on a DST transition.
     */
    tickSafe(dir : string, date : Date) : Date {
        return this.tick(dir, date);
    }

    tickStart(date : Date) : Date {
        return this.tickConstraint.start(date);
    }
}

/**
 * Compiled schedule produced by [[CalendarIntervalParser.createCompiledSchedule]].
 * Implements the public [[CompiledSchedule]] contract — `next` / `prev` /
 * `nextRange` / `prevRange` / `isValid` all funnel through [[getInstances]].
 *
 * @internal
 */
class CompiledScheduleImpl implements CompiledSchedule {
    private readonly schedules     : CompiledConstraint[];
    private readonly exceptions    : CompiledConstraint[];
    private readonly exceptionsLen : number;

    constructor(definition : ScheduleDefinition, compile : (s : ScheduleConstraint) => CompiledConstraint) {
        if (!definition) {
            throw new Error("Missing schedule definition.");
        }
        if (!definition.schedules) {
            throw new Error("Definition must include at least one schedule.");
        }

        const
            schedules : CompiledConstraint[]  = [],
            schedulesLen                      = definition.schedules.length,
            exceptions : CompiledConstraint[] = [],
            exceptionsLen                     = definition.exceptions ? definition.exceptions.length : 0;

        for (let i = 0; i < schedulesLen; i++) {
            schedules.push(compile(definition.schedules[i]));
        }
        for (let j = 0; j < exceptionsLen; j++) {
            exceptions.push(compile(definition.exceptions[j]));
        }

        this.schedules     = schedules;
        this.exceptions    = exceptions;
        this.exceptionsLen = exceptionsLen;
    }

    /**
     * Core iteration engine shared by `next` / `prev` / `nextRange` / `prevRange` / `isValid`.
     * When `isRange` is set, emits `[start, end]` tuples (merging adjacent ranges) instead of
     * single dates. Bounded by a 1e6 maxAttempts safety counter.
     */
    private getInstances(dir : string, count : number, startDate? : Date, endDate? : Date, isRange? : boolean) : any {
        const
            schedules     = this.schedules,
            exceptions    = this.exceptions,
            exceptionsLen = this.exceptionsLen,
            compare       = IntervalParseHelpers.compareFn(dir),
            isForward     = dir === "next",
            rStart        = isForward ? 0 : 1,
            rEnd          = isForward ? 1 : 0,
            schedStarts   = [],
            exceptStarts  = [],
            results       = [];
        let
            loopCount   = count,
            maxAttempts = 1e6,
            next, end, lastResult;

        startDate = startDate ? DateHelper.clone(startDate) : DateHelper.now();
        if (!startDate || !DateHelper.isValidDate(startDate)) {
            throw new Error("Invalid start date.");
        }

        IntervalParseHelpers.setNextStarts(dir, schedules, schedStarts, startDate);
        IntervalParseHelpers.setRangeStarts(dir, exceptions, exceptStarts, startDate);

        while (maxAttempts-- && loopCount && (next = IntervalParseHelpers.findNext(schedStarts, compare))) {
            if (endDate && compare(next, endDate)) {
                break;
            }

            if (exceptionsLen) {
                IntervalParseHelpers.updateRangeStarts(dir, exceptions, exceptStarts, next);
                if ((end = IntervalParseHelpers.calcRangeOverlap(dir, exceptStarts, next))) {
                    IntervalParseHelpers.updateNextStarts(dir, schedules, schedStarts, end);
                    continue;
                }
            }

            if (isRange) {
                const maxEndDate = IntervalParseHelpers.calcMaxEndDate(exceptStarts, compare);
                end = IntervalParseHelpers.calcEnd(dir, schedules, schedStarts, next, maxEndDate);

                let range : [Date | undefined, Date | undefined];
                if (isForward) {
                    range = [
                        DateHelper.max(startDate, next),
                        end ? (endDate ? DateHelper.min(end, endDate) : end) : undefined
                    ];
                }
                else {
                    const
                        endPlusSec  = end ? DateHelper.add(end, 1, 'second') : undefined,
                        nextPlusSec = DateHelper.add(next, 1, 'second');
                    range = [
                        endPlusSec ? (endDate ? DateHelper.max(endDate, endPlusSec) : endPlusSec) : undefined,
                        DateHelper.min(startDate, nextPlusSec)
                    ];
                }

                if (lastResult && DateHelper.isEqual(range[rStart], lastResult[rEnd])) {
                    lastResult[rEnd] = range[rEnd];
                    loopCount++;
                }
                else {
                    lastResult = range;
                    results.push(lastResult);
                }

                if (!end) break;
                IntervalParseHelpers.updateNextStarts(dir, schedules, schedStarts, end);
            }
            else {
                results.push(
                    isForward
                        ? DateHelper.max(startDate, next)
                        : IntervalParseHelpers.getStart(schedules, schedStarts, next, endDate)
                );
                IntervalParseHelpers.tickStarts(dir, schedules, schedStarts, next);
            }

            loopCount--;
        }

        for (let i = 0, len = results.length; i < len; i++) {
            const result = results[i];
            results[i] = Array.isArray(result)
                ? [IntervalParseHelpers.cleanDate(result[0]), IntervalParseHelpers.cleanDate(result[1])]
                : IntervalParseHelpers.cleanDate(result);
        }

        return results.length === 0 ? NEVER : count === 1 ? results[0] : results;
    }

    isValid(date : Date) : boolean {
        return this.getInstances("next", 1, date, date) !== NEVER;
    }

    next(count? : number, startDate? : Date, endDate? : Date) : Date | Date[] | 0 {
        return this.getInstances("next", count || 1, startDate, endDate);
    }

    prev(count? : number, startDate? : Date, endDate? : Date) : Date | Date[] | 0 {
        return this.getInstances("prev", count || 1, startDate, endDate);
    }

    nextRange(count? : number, startDate? : Date, endDate? : Date) : [Date?, Date?][] | 0 {
        return this.getInstances("next", count || 1, startDate, endDate, true);
    }

    prevRange(count? : number, startDate? : Date, endDate? : Date) : [Date?, Date?][] | 0 {
        return this.getInstances("prev", count || 1, startDate, endDate, true);
    }
}
