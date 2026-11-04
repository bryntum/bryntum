import { CalendarIntervalParser, NEVER } from "../CalendarIntervalParser.js";
import type { ScheduleDate, TimePeriod } from "../CalendarIntervalParser.js";

// The active DateHelper for occurrence generation. Resolved at call time (not bound) so each generation pass picks up
// the timezone-aware DateHelperTZ that CalendarCacheSingle installs on CalendarIntervalParser.
const dh = () => CalendarIntervalParser.activeDateHelper;

// `[min, max]` extents for each time period. Reused references avoid allocating a new array on every `extent()` call.
const
    yearExtent      : number[] = [1970, 2099],
    monthExtent     : number[] = [1, 12],
    dayOfWeekExtent : number[] = [1, 7],
    hourExtent      : number[] = [0, 23],
    minuteExtent    : number[] = [0, 59],
    secondExtent    : number[] = [0, 59],
    timeExtent      : number[] = [0, 86399],
    fullDateExtent  : number[] = [0, 3250368e7];

/**
 * Singleton [[TimePeriod]] definitions for the schedule compiler mixin. Each member describes a calendar unit
 * (year, month, day, hour, minute, second, time-of-day, day-of-week, etc.) with value extraction, validation,
 * extent computation, and forward/backward navigation operations. Used by [[CalendarIntervalParser]] to
 * resolve constraints against concrete dates. Applied as a factory-function mixin.
 *
 * @module Engine/util/calendar_interval_parser/mixin/TimePeriodsMixin
 * @mixin
 */
export default <T extends new (...args : any[]) => any>(Target : T) => class TimePeriodsMixin extends Target {
    static $name = 'TimePeriodsMixin';

    /**
     * `year` (alias `Y`) time period, calendar year 1970-2099.
     * @internal
     */
    static readonly periodYear : TimePeriod = {
        name    : "year",
        range   : 31556900,
        val     : (date : ScheduleDate) => dh().get(date, 'year'),
        isValid : (date : ScheduleDate, value : number) => dh().get(date, 'year') === value,
        extent  : () => yearExtent,
        start   : (date : ScheduleDate) => dh().startOf(date, 'year'),
        end     : (date : ScheduleDate) => dh().add(
            dh().add(dh().startOf(date, 'year'), 1, 'year'),
            -1, 'second'
        ),
        next : (date : ScheduleDate, value : number) => value > dh().get(date, 'year') && value <= 2099 ? CalendarIntervalParser.nextDate(value) : NEVER,
        prev : (date : ScheduleDate, value : number) => value < dh().get(date, 'year') && value >= 1970 ? CalendarIntervalParser.prevDate(value) : NEVER
    };

    /**
     * `month` (alias `M`) time period — 1-based month of year (1-12).
     * @internal
     */
    static readonly periodMonth : TimePeriod = {
        name    : "month",
        range   : 2629740,
        val     : (date : ScheduleDate) => dh().get(date, 'month') + 1,
        isValid : (date : ScheduleDate, value : number) => (dh().get(date, 'month') + 1) === (value || 12),
        extent  : () => monthExtent,
        start   : (date : ScheduleDate) => dh().startOf(date, 'month'),
        end     : (date : ScheduleDate) => dh().add(
            dh().add(dh().startOf(date, 'month'), 1, 'month'),
            -1, 'second'
        ),
        next(date : ScheduleDate, value : number) {
            value = value > 12 ? 1 : value || 12;
            return CalendarIntervalParser.nextDate(dh().get(date, 'year') + (value > (dh().get(date, 'month') + 1) ? 0 : 1), value);
        },
        prev(date : ScheduleDate, value : number) {
            value = value > 12 ? 12 : value || 12;
            return CalendarIntervalParser.prevDate(dh().get(date, 'year') - (value >= (dh().get(date, 'month') + 1) ? 1 : 0), value);
        }
    };

    /**
     * `day` (alias `D`) time period, day of month (1-31).
     * @internal
     */
    static readonly periodDay : TimePeriod = {
        name   : "day",
        range  : 86400,
        val    : (date : ScheduleDate) => dh().get(date, 'date'),
        isValid(date : ScheduleDate, value : number) {
            return dh().get(date, 'date') === (value || this.extent(date)[1]);
        },
        extent : (date : ScheduleDate) => [1, dh().daysInMonth(date)],
        start  : (date : ScheduleDate) => dh().startOf(date, 'day'),
        end    : (date : ScheduleDate) => dh().add(dh().endOf(date), -1, 'second'),
        next(date : ScheduleDate, value : number) {
            value = value > this.extent(date)[1] ? 1 : value;
            const m = CalendarIntervalParser.nextRollover(date, value, this, TimePeriodsMixin.periodMonth),
                DMax = this.extent(m)[1];
            value = value > DMax ? 1 : value || DMax;
            return CalendarIntervalParser.nextDate(dh().get(m, 'year'), (dh().get(m, 'month') + 1), value);
        },
        prev(date : ScheduleDate, value : number) {
            const m = CalendarIntervalParser.prevRollover(date, value, this, TimePeriodsMixin.periodMonth),
                DMax = this.extent(m)[1];
            return CalendarIntervalParser.prevDate(dh().get(m, 'year'), (dh().get(m, 'month') + 1), value > DMax ? DMax : value || DMax);
        }
    };

    /**
     * `dayOfWeek` (aliases `dw`, `d`) time period, ISO-ish day of week (1=Sun … 7=Sat).
     * @internal
     */
    static readonly periodDayOfWeek : TimePeriod = {
        name    : "day of week",
        range   : 86400,
        val     : (date : ScheduleDate) => dh().dayOfWeek(date) + 1,
        isValid : (date : ScheduleDate, value : number) => (dh().dayOfWeek(date) + 1) === (value || 7),
        extent  : () => dayOfWeekExtent,
        start   : (date : ScheduleDate) => TimePeriodsMixin.periodDay.start(date),
        end     : (date : ScheduleDate) => TimePeriodsMixin.periodDay.end(date),
        next(date : ScheduleDate, value : number) {
            value = value > 7 ? 1 : value || 7;
            const currentDw = dh().dayOfWeek(date) + 1,
                daysToAdd   = (value - currentDw) + (value <= currentDw ? 7 : 0);
            return dh().startOf(dh().add(date, daysToAdd, 'day'), 'day');
        },
        prev(date : ScheduleDate, value : number) {
            value = value > 7 ? 7 : value || 7;
            const currentDw = dh().dayOfWeek(date) + 1,
                daysToAdd   = (value - currentDw) + (value >= currentDw ? -7 : 0);
            return dh().add(dh().endOf(dh().add(date, daysToAdd, 'day')), -1, 'second');
        }
    };

    /**
     * `dayOfYear` (alias `dy`) time period, 1-based day of year (1-366).
     * @internal
     */
    static readonly periodDayOfYear : TimePeriod = {
        name  : "day of year",
        range : 86400,
        val   : (date : ScheduleDate) => Math.ceil(1 + dh().diff(TimePeriodsMixin.periodYear.start(date), TimePeriodsMixin.periodDay.start(date), 'day', true)),
        isValid(date : ScheduleDate, value : number) {
            return this.val(date) === (value || this.extent(date)[1]);
        },
        extent : (date : ScheduleDate) => [1, dh().daysInYear(date)],
        start  : (date : ScheduleDate) => TimePeriodsMixin.periodDay.start(date),
        end    : (date : ScheduleDate) => TimePeriodsMixin.periodDay.end(date),
        next(date : ScheduleDate, value : number) {
            value = value > this.extent(date)[1] ? 1 : value;
            const y = CalendarIntervalParser.nextRollover(date, value, this, TimePeriodsMixin.periodYear),
                dyMax = this.extent(y)[1];
            value = value > dyMax ? 1 : value || dyMax;
            return CalendarIntervalParser.nextDate(dh().get(y, 'year'), (dh().get(y, 'month') + 1), value);
        },
        prev(date : ScheduleDate, value : number) {
            const y = CalendarIntervalParser.prevRollover(date, value, this, TimePeriodsMixin.periodYear),
                dyMax = this.extent(y)[1];
            value = value > dyMax ? dyMax : value || dyMax;
            return CalendarIntervalParser.prevDate(dh().get(y, 'year'), (dh().get(y, 'month') + 1), value);
        }
    };

    /**
     * `dayOfWeekCount` (alias `dc`) time period, 1-based n-th instance of the current weekday in the current
     * month (e.g. the 2nd Tuesday). A value of `0` denotes "last occurrence".
     * @internal
     */
    static readonly periodDayOfWeekCount : TimePeriod = {
        name  : "day of week count",
        range : 604800,
        val   : (date : ScheduleDate) => Math.floor((dh().get(date, 'date') - 1) / 7) + 1,
        isValid(date : ScheduleDate, value : number) {
            return this.val(date) === value ||
                (value === 0 && dh().get(date, 'date') > TimePeriodsMixin.periodDay.extent(date)[1] - 7);
        },
        extent(date : ScheduleDate) {
            return [1, Math.ceil(TimePeriodsMixin.periodDay.extent(date)[1] / 7)];
        },
        start(date : ScheduleDate) {
            return CalendarIntervalParser.nextDate(
                dh().get(date, 'year'), (dh().get(date, 'month') + 1),
                Math.max(1, (this.val(date) - 1) * 7 + 1 || 1)
            );
        },
        end(date : ScheduleDate) {
            return CalendarIntervalParser.prevDate(
                dh().get(date, 'year'), (dh().get(date, 'month') + 1),
                Math.min(this.val(date) * 7, TimePeriodsMixin.periodDay.extent(date)[1])
            );
        },
        next(date : ScheduleDate, value : number) {
            const day   = TimePeriodsMixin.periodDay,
                month   = TimePeriodsMixin.periodMonth;
            value = value > this.extent(date)[1] ? 1 : value;
            const m = CalendarIntervalParser.nextRollover(date, value, this, month),
                dcMax = this.extent(m)[1];
            value = value > dcMax ? 1 : value;

            const nextDate = CalendarIntervalParser.nextDate(
                dh().get(m, 'year'), (dh().get(m, 'month') + 1),
                value === 0 ? day.extent(m)[1] - 6 : 1 + 7 * (value - 1)
            );

            if (dh().compare(nextDate, date) <= 0) {
                const m2 = month.next(date, (dh().get(date, 'month') + 1) + 1) as ScheduleDate;
                return CalendarIntervalParser.nextDate(
                    dh().get(m2, 'year'), (dh().get(m2, 'month') + 1),
                    value === 0 ? day.extent(m2)[1] - 6 : 1 + 7 * (value - 1)
                );
            }
            return nextDate;
        },
        prev(date : ScheduleDate, value : number) {
            const m = CalendarIntervalParser.prevRollover(date, value, this, TimePeriodsMixin.periodMonth),
                dcMax = this.extent(m)[1];
            value = value > dcMax ? dcMax : value || dcMax;
            return this.end(
                CalendarIntervalParser.prevDate(dh().get(m, 'year'), (dh().get(m, 'month') + 1), 1 + 7 * (value - 1))
            );
        }
    };

    /**
     * `hour` (alias `h`) time period — hour of day (0-23).
     * @internal
     */
    static readonly periodHour : TimePeriod = {
        name    : "hour",
        range   : 3600,
        val     : (date : ScheduleDate) => dh().get(date, 'hour'),
        isValid : (date : ScheduleDate, value : number) => dh().get(date, 'hour') === value,
        extent  : () => hourExtent,
        start   : (date : ScheduleDate) => dh().startOf(date, 'hour'),
        end     : (date : ScheduleDate) => dh().add(
            dh().add(dh().startOf(date, 'hour'), 1, 'hour'),
            -1, 'second'
        ),
        next(date : ScheduleDate, value : number) {
            value = value > 23 ? 0 : value;
            return CalendarIntervalParser.nextDate(
                dh().get(date, 'year'), (dh().get(date, 'month') + 1),
                dh().get(date, 'date') + (value <= dh().get(date, 'hour') ? 1 : 0),
                value
            );
        },
        prev(date : ScheduleDate, value : number) {
            value = value > 23 ? 23 : value;
            return CalendarIntervalParser.prevDate(
                dh().get(date, 'year'), (dh().get(date, 'month') + 1),
                dh().get(date, 'date') + (value >= dh().get(date, 'hour') ? -1 : 0),
                value
            );
        }
    };

    /**
     * `minute` (alias `m`) time period — minute of hour (0-59).
     * @internal
     */
    static readonly periodMinute : TimePeriod = {
        name    : "minute",
        range   : 60,
        val     : (date : ScheduleDate) => dh().get(date, 'minute'),
        isValid : (date : ScheduleDate, value : number) => dh().get(date, 'minute') === value,
        extent  : () => minuteExtent,
        start   : (date : ScheduleDate) => dh().startOf(date, 'minute'),
        end     : (date : ScheduleDate) => dh().add(
            dh().add(dh().startOf(date, 'minute'), 1, 'minute'),
            -1, 'second'
        ),
        next(date : ScheduleDate, value : number) {
            const m   = dh().get(date, 'minute'),
                s   = dh().get(date, 'second'),
                inc = value > 59 ? 60 - m : value <= m ? 60 - m + value : value - m;
            return dh().add(dh().add(date, inc, 'minute'), -s, 'second');
        },
        prev(date : ScheduleDate, value : number) {
            value = value > 59 ? 59 : value;
            return CalendarIntervalParser.prevDate(
                dh().get(date, 'year'), (dh().get(date, 'month') + 1), dh().get(date, 'date'),
                dh().get(date, 'hour') + (value >= dh().get(date, 'minute') ? -1 : 0),
                value
            );
        }
    };

    /**
     * `second` (alias `s`) time period — second of minute (0-59).
     * @internal
     */
    static readonly periodSecond : TimePeriod = {
        name    : "second",
        range   : 1,
        val     : (date : ScheduleDate) => dh().get(date, 'second'),
        isValid : (date : ScheduleDate, value : number) => dh().get(date, 'second') === value,
        extent  : () => secondExtent,
        start   : (date : ScheduleDate) => date,
        end     : (date : ScheduleDate) => date,
        next(date : ScheduleDate, value : number) {
            const s   = dh().get(date, 'second'),
                inc = value > 59 ? 60 - s : value <= s ? 60 - s + value : value - s;
            return dh().add(date, inc, 'second');
        },
        prev(date : ScheduleDate, value : number) {
            value = value > 59 ? 59 : value;
            return CalendarIntervalParser.prevDate(
                dh().get(date, 'year'), (dh().get(date, 'month') + 1), dh().get(date, 'date'),
                dh().get(date, 'hour'),
                dh().get(date, 'minute') + (value >= dh().get(date, 'second') ? -1 : 0),
                value
            );
        }
    };

    /**
     * `time` (alias `t`) time period — seconds since midnight (0-86399). Used by rules like `at 10:00`.
     * @internal
     */
    static readonly periodTime : TimePeriod = {
        name    : "time",
        range   : 1,
        val     : (date : ScheduleDate) => dh().getTimeOfDay(date, 's'),
        isValid : (date : ScheduleDate, value : number) => dh().getTimeOfDay(date, 's') === value,
        extent  : () => timeExtent,
        start   : (date : ScheduleDate) => date,
        end     : (date : ScheduleDate) => date,
        next(date : ScheduleDate, value : number) {
            value = value > 86399 ? 0 : value;
            return CalendarIntervalParser.nextDate(
                dh().get(date, 'year'), (dh().get(date, 'month') + 1),
                dh().get(date, 'date') + (value <= dh().getTimeOfDay(date, 's') ? 1 : 0),
                0, 0, value
            );
        },
        prev(date : ScheduleDate, value : number) {
            value = value > 86399 ? 86399 : value;
            return CalendarIntervalParser.nextDate(
                dh().get(date, 'year'), (dh().get(date, 'month') + 1),
                dh().get(date, 'date') + (value >= dh().getTimeOfDay(date, 's') ? -1 : 0),
                0, 0, value
            );
        }
    };

    /**
     * `weekOfMonth` (alias `wm`) time period — 1-based week-of-month (week starts Sunday). Used for rules like `on the 2nd week of the month`.
     * @internal
     */
    static readonly periodWeekOfMonth : TimePeriod = {
        name  : "week of month",
        range : 604800,
        val   : (date : ScheduleDate) => (dh().get(date, 'date') + dh().dayOfWeek(TimePeriodsMixin.periodMonth.start(date)) + (7 - (dh().dayOfWeek(date) + 1))) / 7,
        isValid(date : ScheduleDate, value : number) {
            return this.val(date) === (value || this.extent(date)[1]);
        },
        extent(date : ScheduleDate) {
            const day   = TimePeriodsMixin.periodDay,
                month   = TimePeriodsMixin.periodMonth;
            return [
                1,
                (day.extent(date)[1] + dh().dayOfWeek(month.start(date)) + (7 - (dh().dayOfWeek(month.end(date)) + 1))) / 7
            ];
        },
        start : (date : ScheduleDate) => dh().max(
            dh().startOf(date, 'week', true, 0),
            dh().startOf(date, 'month')
        ),
        end : (date : ScheduleDate) => CalendarIntervalParser.prevDate(
            dh().get(date, 'year'), (dh().get(date, 'month') + 1),
            Math.min(dh().get(date, 'date') + (7 - (dh().dayOfWeek(date) + 1)), TimePeriodsMixin.periodDay.extent(date)[1])
        ),
        next(date : ScheduleDate, value : number) {
            value = value > this.extent(date)[1] ? 1 : value;
            const m = CalendarIntervalParser.nextRollover(date, value, this, TimePeriodsMixin.periodMonth),
                wmMax = this.extent(m)[1];
            value = value > wmMax ? 1 : value || wmMax;
            return CalendarIntervalParser.nextDate(
                dh().get(m, 'year'), (dh().get(m, 'month') + 1),
                Math.max(1, (value - 1) * 7 - ((dh().dayOfWeek(m) + 1) - 2))
            );
        },
        prev(date : ScheduleDate, value : number) {
            const m = CalendarIntervalParser.prevRollover(date, value, this, TimePeriodsMixin.periodMonth),
                wmMax = this.extent(m)[1];
            value = value > wmMax ? wmMax : value || wmMax;
            return this.end(
                CalendarIntervalParser.nextDate(
                    dh().get(m, 'year'), (dh().get(m, 'month') + 1),
                    Math.max(1, (value - 1) * 7 - ((dh().dayOfWeek(m) + 1) - 2))
                )
            );
        }
    };

    /**
     * `weekOfYear` (alias `wy`) time period. Week 1 is the week containing the first Thursday of the year.
     * @internal
     */
    static readonly periodWeekOfYear : TimePeriod = {
        name  : "week of year (ISO)",
        range : 604800,
        val(date : ScheduleDate) {
            const dayOfWeek = TimePeriodsMixin.periodDayOfWeek,
                year        = TimePeriodsMixin.periodYear,
                wThur       = dayOfWeek.next(this.start(date), 5) as ScheduleDate,
                prevYear    = year.prev(wThur, dh().get(wThur, 'year') - 1);
            if (prevYear === NEVER) return 1;
            const YThur = dayOfWeek.next(prevYear as ScheduleDate, 5) as ScheduleDate;
            return 1 + Math.ceil(dh().diff(YThur, wThur, 'week', true));
        },
        isValid(date : ScheduleDate, value : number) {
            return this.val(date) === (value || this.extent(date)[1]);
        },
        extent(date : ScheduleDate) {
            const dayOfWeek = TimePeriodsMixin.periodDayOfWeek,
                year        = TimePeriodsMixin.periodYear,
                y           = dayOfWeek.next(this.start(date), 5) as ScheduleDate,
                dwFirst     = (dh().dayOfWeek(year.start(y)) + 1),
                dwLast      = (dh().dayOfWeek(year.end(y)) + 1);
            return [1, dwFirst === 5 || dwLast === 5 ? 53 : 52];
        },
        start : (date : ScheduleDate) => dh().startOf(date, 'week', true, 1),
        end   : (date : ScheduleDate) => CalendarIntervalParser.prevDate(
            dh().get(date, 'year'), (dh().get(date, 'month') + 1),
            dh().get(date, 'date') + ((dh().dayOfWeek(date) + 1) > 1 ? 8 - (dh().dayOfWeek(date) + 1) : 0)
        ),
        next(date : ScheduleDate, value : number) {
            const me        = this,
                dayOfWeek = TimePeriodsMixin.periodDayOfWeek,
                year      = TimePeriodsMixin.periodYear;
            value = value > me.extent(date)[1] ? 1 : value;
            const wyThur = dayOfWeek.next(me.start(date), 5) as ScheduleDate;
            let y : ScheduleDate = CalendarIntervalParser.nextRollover(wyThur, value, this, year);
            if (me.val(y) !== 1) {
                y = dayOfWeek.next(y, 2) as ScheduleDate;
            }
            const wyMax   = me.extent(y)[1],
                wyStart = me.start(y);
            value = value > wyMax ? 1 : value || wyMax;
            return CalendarIntervalParser.nextDate(
                dh().get(wyStart, 'year'), (dh().get(wyStart, 'month') + 1),
                dh().get(wyStart, 'date') + 7 * (value - 1)
            );
        },
        prev(date : ScheduleDate, value : number) {
            const me        = this,
                dayOfWeek = TimePeriodsMixin.periodDayOfWeek,
                year      = TimePeriodsMixin.periodYear,
                wyThur    = dayOfWeek.next(me.start(date), 5) as ScheduleDate;
            let y : ScheduleDate = CalendarIntervalParser.prevRollover(wyThur, value, this, year);
            if (me.val(y) !== 1) {
                y = dayOfWeek.next(y, 2) as ScheduleDate;
            }
            const wyMax = me.extent(y)[1],
                wyEnd = me.end(y);
            value = value > wyMax ? wyMax : value || wyMax;
            return me.end(
                CalendarIntervalParser.nextDate(
                    dh().get(wyEnd, 'year'), (dh().get(wyEnd, 'month') + 1),
                    dh().get(wyEnd, 'date') + 7 * (value - 1)
                )
            );
        }
    };

    /**
     * `fullDate` (alias `fd`) time period. Used for anchoring rules like `after 2022-01-01` to a specific date.
     * @internal
     */
    static readonly periodFullDate : TimePeriod = {
        name  : "full date",
        range : 1,
        val(date : ScheduleDate) {
            return dh().toTime(date);
        },
        isValid(date : ScheduleDate, value : number) {
            return dh().toTime(date) === value;
        },
        extent() {
            return fullDateExtent;
        },
        start(date : ScheduleDate) {
            return date;
        },
        end(date : ScheduleDate) {
            return date;
        },
        next(date : ScheduleDate, value : number) {
            return dh().toTime(date) < value ? dh().fromTime(value) : NEVER;
        },
        prev(date : ScheduleDate, value : number) {
            return dh().toTime(date) > value ? dh().fromTime(value) : NEVER;
        }
    };
};
