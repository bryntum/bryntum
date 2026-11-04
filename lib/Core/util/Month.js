import Base from '../Base.js';
import DayTime from './DayTime.js';
import Events from '../mixin/Events.js';
import DH from '../helper/DateHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';

/**
 * @module Core/util/Month
 */

/**
 * A class which encapsulates a calendar view of a month, and offers information about
 * the weeks and days within that calendar view.
 *
 * ```javascript
 *   // December 2018 using Monday as week start
 *   const m = new Month({
 *       date         : '2018-12-01',
 *       weekStartDay : 1
 *   });
 *
 *   m.eachWeek((week, dates) => console.log(dates.map(d => d.getDate())))
 * ```
 *
 * ## Useful configs and functions
 *
 * | Config / Function                 | Description                                 |
 * |-----------------------------------|---------------------------------------------|
 * | {@link #config-date}              | Date the month encapsulates                 |
 * | {@link #config-weekStartDay}      | First day of the week (0=Sun, 6=Sat)        |
 * | {@link #function-eachWeek}        | Iterate over each week with its dates       |
 * | {@link #function-eachDay}         | Iterate over each day in the month          |
 *
 * ## See also
 *
 * - {@link Core.helper.DateHelper} - Date manipulation and formatting utility
 * - {@link Core.widget.DatePicker} - Date picker widget using Month
 *
 */
export default class Month extends Events(Base) {

    static $name = 'Month';

    // Getter ensures we always have a valid dateHelper even during construction
    get dh() {
        const
            me = this,
            dh = me.owner?.dateHelper || me._dateHelper || DH;

        // The owner's DateHelper is replaced when its timezone changes. The cached weekBase is a Date
        // computed in the old frame, so drop it
        if (dh !== me._lastDh) {
            if (me._lastDh) {
                me._weekBase = null;
            }
            me._lastDh = dh;
        }

        return dh;
    }

    // The start point week numbers are measured from. Frame-dependent (a Date at a week boundary midnight), recomputed
    // lazily after it is dropped by a weekStartDay change, year change, or a timezone (DateHelper) change.
    get weekBase() {
        if (!this._weekBase) {
            this.calculateWeekBase();
        }

        return this._weekBase;
    }

    set weekBase(weekBase) {
        this._weekBase = weekBase;
    }

    static configurable = {
        owner : null,

        /**
         * The date which the month should encapsulate. May be a `Date` object, or a
         * `YYYY-MM-DD` format string.
         *
         * Mutating a passed `Date` after initializing a `Month` object has no effect on
         * the `Month` object.
         * @config {Date|String}
         */
        date : {
            $config : {
                equal : 'date'
            },
            value : DH.clearTime(new Date())
        },

        month : null,

        year : null,

        /**
         * The week start day, 0 meaning Sunday, 6 meaning Saturday.
         * Defaults to {@link Core.helper.DateHelper#property-weekStartDay-static}.
         * @config {Number}
         */
        weekStartDay : null,

        /**
         * Configure as `true` to have the visibleDayColumnIndex and visibleColumnCount properties
         * respect the configured {@link #config-nonWorkingDays}.
         * @config {Boolean}
         */
        hideNonWorkingDays : null,

        /**
         * Non-working days as an object where keys are day indices, 0-6 (Sunday-Saturday), and the value is `true`.
         * Defaults to {@link Core.helper.DateHelper#property-nonWorkingDays-static}.
         * @config {Object<String,Boolean>}
         */
        nonWorkingDays : null,

        /**
         * Configure as `true` to always have the month encapsulate six weeks.
         * This is useful for UIs which must be a fixed height.
         * @prp {Boolean}
         */
        sixWeeks : null
    };

    //region events

    /**
     * Fired when setting the {@link #config-date} property causes the encapsulated date to change
     * in **any** way, date, week, month or year.
     * @event dateChange
     * @param {Core.util.Month} source The Month which triggered the event.
     * @param {Date} newDate The new encapsulated date value.
     * @param {Date} oldDate The previous encapsulated date value.
     * @param {Object} changes An object which contains properties which indicate what part of the date changed.
     * @param {Boolean} changes.d True if the date changed in any way.
     * @param {Boolean} changes.w True if the week changed (including same week in a different year).
     * @param {Boolean} changes.m True if the month changed (including same month in a different year).
     * @param {Boolean} changes.y True if the year changed.
     * @param {Boolean} changes.r True if the row count (with respect to the {@link #config-sixWeeks} setting) changed.
     */

    /**
     * Fired when setting the {@link #config-date} property causes a change of week. Note that
     * weeks are calculated in the ISO standard form such that if there are fewer than four
     * days in the first week of a year, then that week is owned by the previous year.
     *
     * The {@link #config-weekStartDay} is honoured when making this calculation and this is a
     * locale-specific value which defaults to the ISO standard of 1 (Monday) in provided European
     * locales and 0 (Sunday) in the provided US English locale.
     * @event weekChange
     * @param {Core.util.Month} source The Month which triggered the event.
     * @param {Date} newDate The new encapsulated date value.
     * @param {Date} oldDate The previous encapsulated date value.
     * @param {Object} changes An object which contains properties which indicate what part of the date changed.
     * @param {Boolean} changes.d True if the date changed in any way.
     * @param {Boolean} changes.w True if the week changed (including same week in a different year).
     * @param {Boolean} changes.m True if the month changed (including same month in a different year).
     * @param {Boolean} changes.y True if the year changed.
     * @param {Boolean} changes.r True if the row count (with respect to the {@link #config-sixWeeks} setting) changed.
     */

    /**
     * Fired when setting the {@link #config-date} property causes a change of month. This
     * will fire when changing to the same month in a different year.
     * @event monthChange
     * @param {Core.util.Month} source The Month which triggered the event.
     * @param {Date} newDate The new encapsulated date value.
     * @param {Date} oldDate The previous encapsulated date value.
     * @param {Object} changes An object which contains properties which indicate what part of the date changed.
     * @param {Boolean} changes.d True if the date changed in any way.
     * @param {Boolean} changes.w True if the week changed (including same week in a different year).
     * @param {Boolean} changes.m True if the month changed (including same month in a different year).
     * @param {Boolean} changes.y True if the year changed.
     * @param {Boolean} changes.r True if the row count (with respect to the {@link #config-sixWeeks} setting) changed.
     */

    /**
     * Fired when setting the {@link #config-date} property causes a change of year.
     * @event yearChange
     * @param {Core.util.Month} source The Month which triggered the event.
     * @param {Date} newDate The new encapsulated date value.
     * @param {Date} oldDate The previous encapsulated date value.
     * @param {Object} changes An object which contains properties which indicate what part of the date changed.
     * @param {Boolean} changes.d True if the date changed in any way.
     * @param {Boolean} changes.w True if the week changed (including same week in a different year).
     * @param {Boolean} changes.m True if the month changed (including same month in a different year).
     * @param {Boolean} changes.y True if the year changed.
     * @param {Boolean} changes.r True if the row count (with respect to the {@link #config-sixWeeks} setting) changed.
     */

    //endRegion

    /**
     * For use when this Month's `weekStartDay` is non-zero.
     *
     * An array to map the days of the week 0-6 of this Calendar to the canonical day numbers
     * used by the Javascript [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object.
     * @member {Number[]} canonicalDayNumbers
     * @readonly
     */

    /**
     * An array to map a canonical day number to a *visible* column index.
     * For example, if we have `weekStartDay` as Monday which is 1, and non working days as
     * Wednesday, and `hideNonWorkingDays : true`, then the calendar would look like
     *
     * ```text
     * ┌────┬────┬────┬────┬────┬────┐
     * | Mo | Tu | Th | Fr | Sa | Su |
     * └────┴────┴────┴────┴────┴────┘
     * ```
     *
     * So we'd need this array: `[ 5, 0, 1, undefined, 2, 3, 4]`
     * @member {Number[]} visibleDayColumnIndex
     * @readonly
     */

    /**
     * An array to map a canonical day number to a 0-6 column index.
     * For example, if we have `weekStartDay` as Monday which is 1, then the calendar would look like
     *
     * ```text
     * ┌────┬────┬────┬────┬────┬────┬────┐
     * | Mo | Tu | We | Th | Fr | Sa | Su |
     * └────┴────┴────┴────┴────┴────┴────┘
     * ```
     *
     * So we'd need this array: `[ 6, 0, 1, 2, 3, 4, 5]`
     * @member {Number[]} dayColumnIndex
     * @readonly
     */

    /**
     * The number of visible days in the week as defined by the `nonWorkingDays` and
     * `hideNonWorkingDays` options.
     * @member {Number} weekLength
     * @readonly
     */

    /**
     * Creates a Date for the given year/month/dayOfMonth using the configured dateHelper.
     * Handles denormalized day values (negative, >31) by letting native Date normalize first,
     * then re-creating in the configured tz.
     * @private
     */
    createDate(year, month, dayOfMonth = 1) {
        const
            { dh } = this,
            // Native Date normalizes denormalized values (e.g., month:11, day:-4 → Nov 26)
            local = new Date(year, month, dayOfMonth);

        if (dh === DH) {
            return local;
        }

        // Re-create the normalized Y/M/D in the configured timezone
        return dh.create({ year : local.getFullYear(), month : local.getMonth(), date : local.getDate() });
    }

    configure(config) {
        super.configure(config);

        this.updateDayNumbers();

        // The set is rejected during configuration because everything else has to be set up.
        if (config.date) {
            this.date = config.date;
        }
        this.generation = 0;
    }

    changeDate(date) {
        // Date has to be set after we know everything else
        if (this.isConfiguring) {
            return;
        }

        date = typeof date === 'string' ? this.dh.parse(date, 'YYYY-MM-DD') : new Date(date);

        if (isNaN(date)) {
            throw new Error('Month date ingestion must be passed a Date, or a valid YYYY-MM-DD date string');
        }

        return date;
    }

    updateDate(newDate, oldDate) {
        const
            me            = this,
            {
                dayColumnIndex,
                weekCount,
                dh
            }             = me,
            monthStart    = dh.getFirstDateOfMonth(newDate),
            monthEnd      = dh.getLastDateOfMonth(monthStart),
            startWeekDay  = dayColumnIndex[dh.getDay(monthStart)],
            endWeekDay    = dayColumnIndex[dh.getDay(monthEnd)],
            yearChanged   = !oldDate || (dh.getFullYear(newDate) !== dh.getFullYear(oldDate)),
            monthChanged  = !oldDate || (dh.getMonth(newDate) !== dh.getMonth(oldDate)),
            // Collect changes as bitwise flags if we have any listeners:
            // 0001 = date has changed.
            // 0010 = week has changed.
            // 0100 = month has changed.
            // 1000 = year has changed.
            // We need this because 10/1/2010 -> 10/1/2011 must fire a dateChange
            // and a monthChange in addition to the yearChange.
            // And 10/1/2010 -> 10/2/2010 must fire a dateChange in addition to the monthChange.
            changes       = me.eventListeners && (oldDate ? (dh.getDate(newDate) !== dh.getDate(oldDate)) |
            (me.getWeekId(newDate) !== me.getWeekId(oldDate)) << 1 |
            monthChanged << 2 |
            yearChanged << 3 : 15);

        // Keep our properties in sync with reality.
        // Access the private properties directly to avoid recursion.
        me._year = dh.getFullYear(newDate);
        me._month = dh.getMonth(newDate);

        // These comments assume ISO standard of Monday as week start day.
        //
        // This is the date of month that is the beginning of the first week row.
        // So this may be -ve. Eg: for Dec 2018, Monday 26th Nov is the first
        // cell on the calendar which is the -4th of December. Note that the 0th
        // of December was 31st of November, so needs -4 to get back to the 26th.
        me.startDayOfMonth = 1 - startWeekDay;

        // This is the date of month that is the end of the last week row.
        // So this may be > month end. Eg: for Dec 2018, Sunday 6th Jan is the last
        // cell on the calendar which is the 37th of December.
        me.endDayOfMonth = dh.getDate(monthEnd) + (6 - endWeekDay);

        if (me.sixWeeks) {
            me.endDayOfMonth += (6 - me.weekCount) * 7;
        }

        // Calculate the start point of where we calculate weeks from if we need to.
        // It's either the first "weekStartDay" in this year if this year's
        // first week is last year's, and so should work out as zero,
        // or the "weekStartDay" of the week before, so that dates in the first week
        // the Math.floor(dh.diff(weekBase, date, 'day') / 7) calculates as 1.
        if (!me.weekBase || yearChanged) {
            me.calculateWeekBase();
        }

        // Allow calling code to detect whether a set date operation resulted in a change
        // of month.
        if (monthChanged || yearChanged) {
            me.generation++;
        }

        if (changes) {
            const event = {
                newDate,
                oldDate,
                changes : {
                    d : true,
                    w : Boolean(changes & 2),
                    m : Boolean(changes & 12),
                    y : Boolean(changes & 8),
                    r : me.weekCount !== weekCount
                }
            };

            // If either date, month or year changes, we fire a dateChange
            me.trigger('dateChange', event);

            // If the week has changed, fire a weekChange
            if (changes & 2) {
                me.trigger('weekChange', event);
            }

            // If month or year changed, we fire a monthChange
            if (changes & 12) {
                me.trigger('monthChange', event);
            }

            // If the year has changed, fire a yearChange
            if (changes & 8) {
                me.trigger('yearChange', event);
            }
        }
    }

    calculateWeekBase() {
        const
            me      = this,
            {
                dayColumnIndex,
                dh
            }       = me,
            jan1    = me.createDate(me.year, 0, 1),
            dec31   = me.createDate(me.year, 11, 31),
            january = me.month ? me.getOtherMonth(jan1) : me;

        if (me.dayColumnIndex[dh.getDay(jan1)] > 3) {
            me.weekBase = january.startDate;
        }
        else {
            me.weekBase = me.createDate(me.year, 0, january.startDayOfMonth - 7);
        }

        const dec31Week = Math.floor(dh.diff(me.weekBase, dec31, 'day') / 7);

        me.has53weeks = dec31Week === 53 && dayColumnIndex[dh.getDay(dec31)] > 2;
    }

    /**
     * Returns the week start date, based on the configured {@link #config-weekStartDay} of the
     * passed week.
     * @param {Number| Number[]} week The week number in the current year, or an array containing
     * `[year, weekOfYear]` for any year.
     *
     * Week numbers greater than the number of weeks in the year just wrap into the following year.
     */
    getWeekStart(week) {
        // Week number n of current year
        if (typeof week === 'number') {
            return this.dh.add(this.weekBase, Math.max(week, 1) * 7, 'day');
        }

        // Week n of year nnnn
        const
            me = this,
            [year, weekOfYear] = week;

        // nnnn is our year, so we know it
        if (year === me.year) {
            return me.getWeekStart(weekOfYear);
        }

        return me.getOtherMonth(me.createDate(year, 0, 1)).getWeekStart(weekOfYear);
    }

    getOtherMonth(date) {
        const
            me     = this,
            // Per-instance helper; avoids sharing across views that may have different dateHelpers
            helper = me._otherMonth || (me._otherMonth = new Month(null)),
            config = {
                weekStartDay       : me.weekStartDay,
                nonWorkingDays     : me.nonWorkingDays,
                hideNonWorkingDays : me.hideNonWorkingDays,
                sixWeeks           : me.sixWeeks,
                date               : me.createDate(me.dh.getFullYear(date), 0, 1)
            };

        // Normally week base is recalculated when year changes, but if weekStartDay differs, we must force it
        if (helper.weekStartDay !== me.weekStartDay) {
            config.weekBase = null;
        }
        helper._dateHelper = me._dateHelper;
        helper.owner = me.owner;
        helper.configure(config);

        helper.date = date;

        helper.updateDate(helper.date, helper.date);

        return helper;
    }

    changeYear(year) {
        const newDate = new Date(this.date);

        this.dh.set(newDate, 'year', year);

        // changeDate rejects non-changes, otherwise a change event will be emitted
        this.date = newDate;
    }

    changeMonth(month) {
        const newDate = new Date(this.date);

        this.dh.set(newDate, 'month', month);

        this.date = newDate;
    }

    get weekStartDay() {
        // This trick allows our weekStartDay to float w/the locale even if the locale changes
        return typeof this._weekStartDay === 'number' ? this._weekStartDay : DH.weekStartDay;
    }

    updateWeekStartDay() {
        const me = this;

        me.updateDayNumbers();

        if (!me.isConfiguring && me.date) {
            me.weekBase = null;  // force a calculateWeekBase
            me.updateDate(me.date, me.date);
        }
        // else date will be set soon and weekBase is null so calculateWeekBase will be called by updateDate
    }

    get nonWorkingDays() {
        return this._nonWorkingDays || DH.nonWorkingDays;
    }

    changeNonWorkingDays(nonWorkingDays) {
        return ObjectHelper.assign({}, nonWorkingDays);
    }

    updateNonWorkingDays() {
        this.updateDayNumbers();
    }

    updateHideNonWorkingDays() {
        this.updateDayNumbers();
    }

    updateSixWeeks() {
        if (!this.isConfiguring) {
            this.updateDate(this.date, this.date);
        }
    }

    /**
     * The number of days in the calendar for this month. This will always be
     * a multiple of 7, because this represents the number of calendar cells
     * occupied by this month.
     * @member {Number}
     * @readonly
     */
    get dayCount() {
        // So for the example month, Dec 2018 has 42 days, from Mon 26th Nov (-4th Dec) 2018
        // to Sun 6th Jan (37th Dec) 2019
        return (this.endDayOfMonth + 1) - this.startDayOfMonth;
    }

    /**
     * The number of weeks in the calendar for this month.
     * @member {Number}
     * @readonly
     */
    get weekCount() {
        return this.dayCount / 7;
    }

    /**
     * The date of the first cell in the calendar view of this month.
     * @member {Date}
     * @readonly
     */
    get startDate() {
        const me = this;

        if (me.year != null && me.month != null && me.startDayOfMonth != null) {
            return me.createDate(me.year, me.month, me.startDayOfMonth);
        }
    }

    /**
     * The date of the last cell in the calendar view of this month.
     * @member {Date}
     * @readonly
     */
    get endDate() {
        const me = this;

        if (me.year != null && me.month != null && me.startDayOfMonth != null) {
            return me.createDate(me.year, me.month, me.endDayOfMonth);
        }
    }

    /**
     * The first date of the current month.
     * @member {Date}
     * @readonly
     */
    get firstDate() {
        const me = this;

        if (me.year != null && me.month != null && me.startDayOfMonth != null) {
            return me.createDate(me.year, me.month, 1);
        }
    }

    /**
     * The last date of the current month.
     * @member {Date}
     * @readonly
     */
    get lastDate() {
        const me = this;

        if (me.year != null && me.month != null && me.startDayOfMonth != null) {
            return me.createDate(me.year, me.month + 1, 0);
        }
    }

    /**
     * Iterates through all calendar cells in this month, calling the passed function for each date.
     * @param {Function} fn The function to call.
     * @param {Date} fn.date The date for the cell.
     */
    eachDay(fn) {
        for (let dayOfMonth = this.startDayOfMonth; dayOfMonth <= this.endDayOfMonth; dayOfMonth++) {
            fn(this.createDate(this.year, this.month, dayOfMonth));
        }
    }

    /**
     * Iterates through all weeks in this month, calling the passed function
     * for each week.
     * @param {Function} fn The function to call.
     * @param {Number[]} fn.week An array containing `[year, weekNumber]`
     * @param {Date[]} fn.dates The dates for the week.
     */
    eachWeek(fn) {
        const me = this,
            { weekCount } = me;

        for (let dayOfMonth = me.startDayOfMonth, week = 0; week < weekCount; week++) {
            const weekDates  = [],
                weekOfYear = me.getWeekNumber(me.createDate(me.year, me.month, dayOfMonth));

            for (let day = 0; day < 7; day++, dayOfMonth++) {
                weekDates.push(me.createDate(me.year, me.month, dayOfMonth));
            }
            fn(weekOfYear, weekDates, week, week === weekCount - 1);
        }
    }

    /**
     * Returns the week of the year for the passed date. This returns an array containing *two* values,
     * the year **and** the week number are returned.
     *
     * The week number is calculated according to ISO rules, meaning that if the first week of the year
     * contains less than four days, it is considered to be the last week of the preceding year.
     *
     * The configured {@link #config-weekStartDay} is honoured in this calculation. So if the weekStartDay
     * is **NOT** the ISO standard of `1`, (Monday), then the weeks do not coincide with ISO weeks.
     * @param {Date} date The date to calculate the week for.
     * @returns {Number[]} A numeric array: `[year, week]`
     */
    getWeekNumber(date) {
        const
            me     = this,
            { dh } = me;

        date = dh.clearTime(date);

        // If it's a date in another year, use our otherMonth to find the answer.
        if (dh.getFullYear(date) !== me.year) {
            return me.getOtherMonth(me.createDate(dh.getFullYear(date), 0, 1)).getWeekNumber(date);
        }

        let weekNo = Math.floor(dh.diff(me.weekBase, date, 'day') / 7),
            year = dh.getFullYear(date);

        // No week 0. It's the last week of last year
        if (!weekNo) {
            // Week is the week of last year's 31st Dec
            return me.getOtherMonth(me.createDate(me.year - 1, 0, 1)).getWeekNumber(me.createDate(me.year, 0, 0));
        }
        // Only week 53 if year ends before our week's 5th day
        else if (weekNo === 53 && !me.has53weeks) {
            weekNo = 1;
            year++;
        }
        // 54 wraps round to 2 of next year
        else if (weekNo > 53) {
            weekNo = weekNo % 52;
        }

        // Return array of year and week number
        return [year, weekNo];
    }

    getWeekId(date) {
        const week = this.getWeekNumber(date);

        return week[0] * 100 + week[1];
    }

    getCellData(date, ownerMonth, dayTime = DayTime.MIDNIGHT) {
        const
            me                 = this,
            { dh }             = me,
            day                = dh.getDay(date),
            visibleColumnIndex = me.visibleDayColumnIndex[day],
            isNonWorking       = me.nonWorkingDays[day],
            isHiddenDay        = me.hideNonWorkingDays && isNonWorking;

        // Automatically move to required month
        if (date < me.startDate || date > me.endDate) {
            me.month = dh.getMonth(date);
        }

        return  {
            day,
            dayTime,
            visibleColumnIndex,
            isNonWorking,
            month        : ownerMonth.month,
            week         : me.getOtherMonth(date).getWeekNumber(date),
            key          : dh.makeKey(date),
            columnIndex  : me.dayColumnIndex[day],
            date         : new Date(date),
            dayEnd       : dayTime.duration('s'),
            tomorrow     : dayTime.startShift ? dayTime.dayOfDate(dh.add(date, 1, 'day')) : dh.clearTime(dh.add(date, 1, 'day')),
            // This property is only significant when used by a client view which encapsulates a single month,
            // and is used to determine whether a cell is in thay month or not.
            // It is -1 for previous month, 0 for current month, and 1 for next month.
            isOtherMonth : Math.sign((dh.getMonth(date) + dh.getFullYear(date) * 12) - (ownerMonth.month + ownerMonth.year * 12)),

            // This property is only significant when used by a CalendarPanel which encapsulates
            // a single month.
            visible    : !isHiddenDay && (date >= ownerMonth.startDate && date < dh.add(ownerMonth.endDate, 1, 'day')),
            isRowStart : visibleColumnIndex === 0,
            isRowEnd   : visibleColumnIndex === me.visibleColumnCount - 1
        };
    }

    updateDayNumbers() {
        const
            me                    = this,
            {
                weekStartDay,
                nonWorkingDays,
                hideNonWorkingDays
            }                     = me,
            dayColumnIndex        = me.dayColumnIndex = [],
            canonicalDayNumbers   = me.canonicalDayNumbers = [],
            visibleDayColumnIndex = me.visibleDayColumnIndex = [];

        // So, if they set weekStartDay to 1 meaning Monday which is ISO standard, we will
        // have mapping of internal day number to canonical day number (as used by Date class)
        // and to abbreviated day name like this:
        // canonicalDayNumbers = [1, 2, 3, 4, 5, 6, 0] // Use for translation from our day number to Date class's day number
        //
        // Also, we need a map from canonical day number to *visible* cell index.
        // for example, if we have weekStartDay as Monday which is 1, and non working days as
        // Wednesday, and hideNonWorkingDays:true, then the calendar would look like
        // +----+----+----+----+----+----+
        // | Mo | Tu | Th | Fr | Sa | Su |
        // +----+----+----+----+----+----+
        //
        // So we'd need this array
        // [ 5, 0, 1, undefined, 2, 3, 4]
        // Or think of it as this map:
        // {
        //      1 : 0,
        //      2 : 1,
        //      4 : 2,
        //      5 : 3,
        //      6 : 4,
        //      0 : 5
        // }
        // To be able to ascertain the cell index directly from the canonical day number.
        //
        // We also need a logical column map which would be
        // +----+----+----+----+----+----+----+
        // | Mo | Tu | We | Th | Fr | Sa | Su |
        // +----+----+----+----+----+----+----+
        //
        // So we'd need this array
        // [ 6, 0, 1, 2, 3, 4, 5]
        // Or think of it as this map:
        // {
        //      1 : 0,
        //      2 : 1,
        //      3 : 2
        //      4 : 3,
        //      5 : 4,
        //      6 : 5,
        //      0 : 6
        // }

        // We use this to cache the number of visible columns so that cell renderers can tell whether
        // they are on the last visible column.
        let visibleColumnIndex = 0;

        for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
            const canonicalDay = (weekStartDay + columnIndex) % 7;

            canonicalDayNumbers[columnIndex] = canonicalDay;
            dayColumnIndex[canonicalDay] = columnIndex;

            // If this day is going to have visible representation, we need to
            // map it to a columnIndex;
            if (!hideNonWorkingDays || !nonWorkingDays[canonicalDay]) {
                visibleDayColumnIndex[canonicalDay] = visibleColumnIndex++;
            }
        }
        me.visibleColumnCount = visibleColumnIndex;
        me.weekLength = hideNonWorkingDays ? 7 - ObjectHelper.keys(nonWorkingDays).length : 7;
    }
}
