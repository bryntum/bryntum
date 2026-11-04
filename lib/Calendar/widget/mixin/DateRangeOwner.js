import Base from '../../../Core/Base.js';
import Month from '../../../Core/util/Month.js';

/**
 * @module Calendar/widget/mixin/DateRangeOwner
 */

const
    validRangeUnits = {
        day    : 1,
        week   : 1,
        month  : 1,
        year   : 1,
        decade : 1
    },
    compareRange = (r1, r2) => r1 && r2 ? (r1.unit === r2.unit && r1.magnitude === r2.magnitude) : r1 === r2;

/**
 * Parses a range configuration into a canonical object form with `unit` and `magnitude` properties.
 *
 * The input may be a string like 'day' or 'week', or '1d' or '1 day' or '4 weeks', '1десятилетие',
 * an object like { magnitude : 1, unit : 'десятилетие' }, or a DurationConfig object.
 * If a number is passed, it is treated as a number of days.
 * @param {String|Number|DurationConfig} range The range configuration to parse
 * @param {Core.helper.DateHelper} dh The (timezone-aware) DateHelper used to parse time unit and duration strings
 * @returns {DurationConfig} The parsed range object with `magnitude` and `unit` properties
 * @internal
 */
export function parseRange(range, dh) {
    if (range) {
        // '1d' or '1 day' or '4 weeks', '1десятилетие', { magnitude : 1, unit : 'десятилетие' } etc.
        // We parse to an object containing the canonical unit name.
        if (typeof range === 'string') {
            // Parses local or canonical names of units into full canonical name
            const unit = dh.parseTimeUnit(range);

            if (unit) {
                range = {
                    magnitude : 1,
                    unit
                };
            }
            else {
                range = dh.parseDuration(range);
            }
        }
        else if (typeof range === 'number') {
            return {
                magnitude : range,
                unit      : 'day'
            };
        }
        else {
            range.unit = dh.parseTimeUnit(range.unit);
        }

        // range : '100ms' would be invalid.
        if (!validRangeUnits[range.unit]) {
            throw new Error('Range must be in days, weeks, months, years or decades');
        }
    }
    return range;
}

/**
 * Mixin that encapsulates a range of dates specified by a {@link #config-date} and a {@link #config-range} (such as
 * `'1 day'`, `'1 week'`, or `'1 month'`). When the date is set, the mixin automatically snaps the start and end dates
 * to the appropriate range boundaries. It also supports explicit {@link #config-startDate} / {@link #config-endDate}
 * pairs for fixed ranges, and provides navigation methods (`next`, `previous`) that shift the range forward or backward
 * by the configured increment.
 *
 * Calendar views that use this mixin accept range configuration. For example:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     modes : {
 *         day : {
 *             // Show 3 days at a time
 *             range : '3 days'
 *         },
 *         list : {
 *             // Show events for one month
 *             range : '1 month'
 *         }
 *     }
 * });
 *
 * // Navigate the active view forward or backward by its range
 * calendar.activeView.next();
 * calendar.activeView.previous();
 * ```
 *
 * ## See also
 *
 * - {@link Calendar.widget.DayView} — View that uses this mixin for date range management
 * - {@link Calendar.widget.EventList} — View that uses this mixin for date range management
 *
 * @mixin
 */
export default Target => class DateRangeOwner extends (Target || Base) {
    static $name = 'DateRangeOwner';

    static configurable = {
        month : true,

        /**
         * Setting this property may change the encapsulated range if the date is outside the current
         * range.
         *
         * It also causes this view to scroll the view to the passed date, or closest date.
         * See {@link Calendar.widget.mixin.CalendarMixin#function-scrollTo}
         * @member {Date} date
         */
        /**
         * The date to orient this view's {@link #config-range} around.
         *
         * When using a {@link #config-range} of weeks, months, years or decades, the {@link #config-startDate} snaps
         * to the closest lower range boundary, and the end date snaps to the closest larger
         * range boundary.
         *
         * When using a {@link #config-range} of days, the {@link #config-startDate} is set to the passed date.
         * @config {Date}
         */
        date : {
            $config : {
                equal : 'date'
            },
            value : null
        },

        /**
         * The time range encapsulated by the current {@link #property-date}.
         *
         * When a range is used, changing the {@link #config-date} snaps the {@link #config-startDate}
         * to the closest starting date of the range. For Example if the range was configured as `'1 week'`
         * then setting the date to the date of next Wednesday would mean that the {@link #property-startDate}
         * would be the __start__ of next week, and an entire week would be encapsulated by this view.
         * @member {DurationConfig} range
         * @accepts {String|DurationConfig}
         */
        /**
         * The time range around the {@link #config-date} to display events for.
         *
         * Valid values are:
         * - day
         * - week
         * - month
         * - year
         * - decade
         *
         * This may also be specified as a duration with a magnitude part and a unit part. For
         * example `'1m'` would mean one month, and `'4w'` would mean four weeks.
         * See {@link Core.helper.DateHelper#function-parseDuration-static} for details
         * of syntax.
         *
         * When using a range of weeks, months, years or decades, then when this widget's
         * {@link #config-date} is synced with its owning {@link Calendar.view.Calendar}'s
         * {@link Calendar.view.Calendar#property-date}, this widget's {@link #config-startDate}
         * is snapped to the closest start point of the range which encompasses that date.
         *
         * So if using `range : '1w'`, then setting the date to Thursday, 28th October 2021
         * Would mean that the `startDate` snaps to Sunday 24th October 2021 (assuming the locale
         * uses Sunday as the week start day).
         *
         * If configured to use a range of *days*, no snapping is done. There's no defined start point
         * so the {@link #config-startDate} is set to the incoming Calendar date.
         *
         * __Note:__ If an {@link #config-endDate} is specified, any range is ignored. The encompassed range
         * will be specified by the {@link #config-startDate} and {@link #config-endDate}, and when the
         * {@link #config-startDate} changes, the {@link #config-endDate} is changed to keep the duration
         * the same.
         * @config {String|DurationConfig}
         */
        range : {
            $config : {
                lazy  : true,
                equal : compareRange
            },
            value : null
        },

        /**
         * The time range to move by when {@link #function-next} or {@link #function-previous} is called.
         *
         * If not specified, this view moves by its duration in days as derived from its {@link #property-range}
         * or its {@link #property-startDate} and {@link #property-endDate}.
         *
         * Valid values are:
         * - day
         * - week
         * - month
         * - year
         * - decade
         *
         * This may also be specified as a duration with a magnitude part and a unit part. For
         * example `'1m'` would mean one month, and `'4w'` would mean four weeks.
         * See {@link Core.helper.DateHelper#function-parseDuration-static} for details
         * of syntax.
         *
         * When using a range of weeks, months, years or decades, then when this widget's
         * {@link #config-date} is synced with its owning {@link Calendar.view.Calendar}'s
         * {@link Calendar.view.Calendar#property-date}, this widget's {@link #config-startDate}
         * is snapped to the closest start point of the range which encompasses that date.
         *
         * So if using `range : '1w'`, then setting the date to Thursday, 28th October 2021
         * Would mean that the `startDate` snaps to Sunday 24th October 2021 (assuming the locale
         * uses Sunday as the week start day).
         *
         * If configured to use a range of *days*, no snapping is done. There's no defined start point
         * so the {@link #config-startDate} is set to the incoming Calendar date.
         *
         * Setting this property to `null` disables this view's {@link #function-next} and {@link #function-previous} methods,
         * so effectively disables moving this view in time through the UI. The view can still be moved programmatically
         * by setting its {@link #config-date} or its {@link #config-startDate}.
         *
         * __Note:__ If an {@link #config-endDate} is specified, any range is ignored. The encompassed range
         * will be specified by the {@link #config-startDate} and {@link #config-endDate}, and when the
         * {@link #config-startDate} changes, the {@link #config-endDate} is changed to keep the duration
         * the same.
         * @prp {DurationConfig}
         * @accepts {String|DurationConfig}
         */
        shiftIncrement : {
            $config : {
                lazy  : true,
                equal : compareRange
            },
            value : null
        },

        /**
         * Gets the start date of the {@link #config-range} that this view covers.
         * @member {Date} startDate
         * @readonly
         */
        /**
         * The start date (Time component is zeroed) of this view.
         * @config {Date}
         */
        startDate : {
            $config : {
                equal : 'date'
            }
        },

        /**
         * Gets the end date of the {@link #config-range} that this view covers.
         * Note that Date objects are time points, not a representation of a 24 hour period,
         * So `{startDate : '2020-10-24', endDate : '2020-10-25' }` spans the __single__ day
         * 24th October 2020. The end point is `2020-10-25T00:00:00`
         * @member {Date} endDate
         * @readonly
         */
        /**
         * The end date (Time component is zeroed) of this view. Note that in terms of full days,
         * this is exclusive, ie: 2020-01-012 to 2020-01-08 is *seven* days. The end is 00:00:00 on
         * the 8th.
         *
         * __Note:__ This configuration takes precedence over any {@link #config-range} specified.
         * If used, the {@link #config-range} is ignored, and after configuration, the `endDate` is
         * locked to the {@link #config-startDate} when the {@link #config-startDate} is changed.
         * @config {Date}
         */
        endDate : {
            $config : {
                equal : 'date'
            }
        },

        /**
         * When using the {@link Calendar.view.Calendar#config-datePicker Calendar's date picker} with the
         * {@link Core.widget.DatePicker#config-multiSelect} property `true`, the selected range is usually
         * applied to views of this type.
         *
         * However, if this property is set to `true`, then the view will not apply the selected
         * range, but will instead use its configured {@link #config-range} or {@link #config-startDate} and
         * {@link #config-endDate} to determine the range of dates to display.
         * @prp {Boolean}
         */
        fixedDuration : null
    };

    /**
     * Interface method used by an encapsulating Calendar view to implement the "prev" button.
     */
    previous() {
        this.move(-1);
    }

    /**
     * Interface method used by an encapsulating Calendar view to implement the "next" button.
     */
    next() {
        this.move(1);
    }

    move(direction = 1) {
        // 1 or -1
        direction = Math.sign(direction);

        const
            me = this,
            {
                shiftIncrement,
                range
            } = me;

        if (range) {
            // If shiftIncrement is cleared, that disables moving by range
            if (shiftIncrement) {
                // Snapping of date into boundaries to create a startDate in updateDate should use the
                // shiftIncrement when shifting
                me.isShifting = true;
                me.date = me.dateHelper.add(me.date, { unit : shiftIncrement.unit, magnitude : direction * shiftIncrement.magnitude });
                me.isShifting = false;
            }
        }
        else {
            me.startDate = me.dateHelper.add(me.startDate, direction * me.duration, 'day');
        }
    }

    changeDate(date, oldDate) {
        date = super.changeDate(date || this.startDate, oldDate);
        if (this.isConfiguring || this.isValidRange(this.range, date)) {
            return date;
        }
    }

    updateDate(date) {
        const
            me           = this,
            newStartDate = me.changeStartDate(date),
            {
                startDate,
                _month
            }            = me,
            generation   = _month?.generation;

        // Move range so that it encapsulates the target date if necessary
        if (!startDate || (newStartDate - startDate)) {
            // Having an endDate configured takes precedence over a range. This means we're non-snapping.
            // If we have a range measured in days, this is also treated as non-snapping.
            // Non-snapping means we shift the range forward or back so that the target date is in.
            if (me.hasConfig('endDate') || me.range.unit === 'day') {
                const
                    { endDate, duration } = me,
                    // For EventLists, when we are using a startDate->endDate range as opposed to a fixed
                    // range, the dates are *inclusive*, so pick the correct date containment function.
                    dateContainmentFn = me.isEventList && !me.range ? 'betweenLesserEqual' : 'betweenLesser';

                if (!me.isConfiguring || !startDate || !me.dateHelper[dateContainmentFn](date, startDate, endDate)) {
                    // Need to scroll left
                    if (!startDate || !endDate || date < startDate) {
                        me.startDate = date;
                    }
                    // Need to scroll right.
                    // EventList range is *inclusive*
                    else if (me.isEventList ? (date > endDate) : (date >= endDate)) {
                        me.startDate = me.dateHelper.add(date, -(duration - 1), 'day');
                    }
                }
            }
            // If there's no endDate, we MUST be configured with a range, so snap
            // the date to the closest range/shiftIncrement start.
            else {
                const
                    // We use the shiftIncrement if our date is being moved by the previous or next methods
                    // If it's just due to changing date, we use the range
                    increment = me.isShifting ? me.shiftIncrement : me.range,
                    // A single-week range snaps by weekStartDay. The previous startDate must not be the snap base then:
                    // it would pin the result to the old phase, which after a timezone switch is the previous frame's
                    // midnight and poisons every snap after it.
                    base      = increment.unit === 'week' && increment.magnitude === 1 ? undefined : me.startDate;

                me.startDate = me.dateHelper.floor(date, increment, base, me.weekStartDay);
            }
        }

        // If we have not already updated our month by setting startDate above
        // then update the month now.
        // We must only update it once because we react to month mutation to refresh the UI.
        if (_month && (_month.generation === generation)) {
            _month.date = date;
        }
        // AgendaView uses scrollToDateOnDateChange when changing date
        // during a range change. That operation scrolls, so we don't need to.
        else if (!me.isConfiguring && me.scrollToDateOnDateChange !== false) {
            me.whenVisible('scrollTo', me, [date]);
        }
        super.updateDate?.(...arguments);
    }

    changeStartDate(startDate, oldStartDate) {
        const me = this;

        startDate = super.changeStartDate(me.snapDate(me.ingestDate(startDate)), oldStartDate);

        // If this is a no-change set of startDate, proceed to postprocessing.
        // Not if only one arg passed: changeStartDate is used to simply convert a
        // start date by passing only the value to convert.
        if (oldStartDate && !(oldStartDate - startDate)) {
            me.afterStartDateSet(startDate, oldStartDate);
        }
        return startDate;
    }

    updateStartDate(startDate, oldStartDate) {
        const
            me          = this,
            {  _month } = me;

        // We must always have a date.
        // We use the start date only if there's no date incoming, and we have no date
        if (!(me.hasConfig('date') || me.date)) {
            me.date = startDate;
        }

        if (_month) {
            _month.date = me.date;
        }

        // Some views inherit startDate
        super.updateStartDate?.(...arguments);

        // Postprocess change of start date
        me.afterStartDateSet(startDate, oldStartDate);
    }

    afterStartDateSet(startDate, oldStartDate) {
        const
            me               = this,
            {
                refreshCount,
                _endDate
            }                = me,
            incomingEndDate  = me.peekEndDate(),
            endDateSame      = incomingEndDate && _endDate && !(incomingEndDate - _endDate);

        // If we are bounded by an endDate configuration, but are not in the process of being passed
        // a new endDate (unless we are at configure time), keep the end date synced with current duration.
        if (me.hasConfig('endDate') && (!incomingEndDate || me.isConfiguring)) {
            const duration = me.dateHelper.diff(oldStartDate || startDate, me.endDate, 'day');

            me.endDate = me.dateHelper.add(startDate, duration, 'day');
        }

        // If that changed the end date, the updater will have done a refresh.
        // If there was no change to the endDate, so no refresh, we have to refresh here.
        if (!me.isConfiguring && (!incomingEndDate || endDateSame) && me.refreshCount === refreshCount) {
            me._cellMap?.clear();
            me.refresh();
            me.triggerRangeChange(startDate, me.endDate);
        }
    }

    /**
     * Peek at any incoming configured endDate and if there is one, convert it to a Date.
     *
     * startDate, endDate processing may need to know the value of an as yet uningested endDate.
     * @internal
     * @returns {Date} The incoming endDate value from the config object being processed
     */
    peekEndDate() {
        const endDate = this.peekConfig('endDate');

        if (endDate) {
            return this.changeEndDate(endDate);
        }
    }

    updateEndDate(endDate) {
        const
            me           = this,
            { duration } = me;

        super.updateEndDate?.(...arguments);

        if (!me.isConfiguring) {
            me.element.style.setProperty('--bi-range-magnitude', duration);
            me.element.dataset.duration = duration;
            me._cellMap?.clear();
            me.refresh();
            me.triggerRangeChange(me.startDate, endDate);
        }
    }

    triggerRangeChange(startDate, endDate) {
        const
            me                     = this,
            { lastRangeAnnounced } = me;

        if (!lastRangeAnnounced || (lastRangeAnnounced.startDate - startDate) || (lastRangeAnnounced.endDate - endDate)) {
            // Constrain the orientation date into the range.
            // For EventLists in start->end mode, the range is inclusive, all other views, it's exclusive
            if (!me.peekConfig('date')) {
                me.date = me.dateHelper.constrain(me.date, startDate, me.dateHelper.add(endDate, me.isEventList && !me.range ? 0 : -1, 'd'));
            }

            /**
             * Fired when the range of dates encapsulated by this view changes.
             *
             * This will be when initially configured with a {@link #config-startDate} and {@link #config-endDate},
             * and when moving a view in time by changing its {@link #property-date}, or its {@link #property-range},
             * or its {@link #property-startDate}, or its {@link #property-endDate}.
             *
             * This will happen when moving in time using the Calendar's previous and next
             * buttons in its {@link Calendar.view.Calendar#property-tbar}.
             * @event rangeChange
             * @param {Calendar.widget.mixin.DateRangeOwner} source This calendar view instance.
             * @ts-param source {typeof DateRangeOwner}
             * @param {Object} [old] The old date range __if any__.
             * @param {Date} old.startDate the old start date.
             * @param {Date} old.endDate the old end date.
             * @param {Object} new The new date range
             * @param {Date} new.startDate the new start date.
             * @param {Date} new.endDate the new end date.
             */
            me.trigger('rangeChange', {
                old : lastRangeAnnounced,
                new : me.lastRangeAnnounced = {
                    startDate,
                    endDate
                }
            });
        }
    }

    get range() {
        return this.hasConfig('endDate') ? null : this._range;
    }

    get shiftIncrement() {
        // If it's explicitly nulled out, then we cannot return a value, that means shifting is disabled.
        // Merely undefined means use the range or duration days.
        if (this._shiftIncrement !== null) {
            return this._shiftIncrement || this.range || { magnitude : this.duration, unit : 'day' };
        }
    }

    get stepUnit() {
        const { shiftIncrement, dateHelper } = this;

        // If the shiftIncrement is nulled out, we cannot yield a stepUnit
        // If just one unit, return the unit name
        if (shiftIncrement) {
            return shiftIncrement.magnitude === 1 ? dateHelper.getLocalizedNameOfUnit(shiftIncrement.unit) : `${shiftIncrement.magnitude} ${dateHelper.getLocalizedNameOfUnit(shiftIncrement.unit, true)}`;
        }
    }

    get endDate() {
        const me = this;

        return me.hasConfig('endDate')
            ? me._endDate
            : me.startDate && me.dateHelper.add(me.startDate, me.range.magnitude, me.range.unit);
    }

    // Snap the passed date to the start or end of our configured range block if we have one.
    snapDate(date, end) {
        const
            me = this,
            range = me._endDate || me.peekEndDate() ? null : me.range;

        // If we have been configured with a range which needs snapping, snap the date to the required end
        return range && range.unit !== 'day' &&  date
            ? me.dateHelper[end ? 'ceil' : 'floor'](date, range, undefined, me.weekStartDay)
            : date;
    }

    parseRange(range) {
        return parseRange(range, this.dateHelper);
    }

    changeRange(range) {
        if (range && !this.hasConfig('endDate')) {
            range = this.parseRange(range);

            // Veto invalid navigation
            if (this._date && !this.isValidRange(range)) {
                return;
            }
        }
        return range;
    }

    changeShiftIncrement(shiftIncrement) {
        // '1d' or '1 day' or '4 weeks', '1десятилетие' etc.
        return this.changeRange(shiftIncrement);
    }

    updateShiftIncrement(old, shiftIncrement) {
        /**
         * Fired when the {@link #property-shiftIncrement} of this view changes.
         *
         * @event shiftIncrementChange
         *
         * @param {Object} [old] The shift increment *if any*.
         * @param {Object} new The shift increment
         */
        this.trigger('shiftIncrementChange', {
            old,
            new : shiftIncrement
        });
    }

    isValidRange(range, date = this.date) {
        const
            minDate = this.minDate || this.calendar?.minDate,
            maxDate = this.maxDate || this.calendar?.maxDate;

        // Only do date arithmetic if we need to.
        if (range && !isNaN(minDate) || !isNaN(maxDate)) {
            const newRange = this.calculateDateRange(range, date);

            if (!isNaN(minDate)) {
                // Veto navigation to all outside the minDate.
                if (newRange.endDate <= minDate) {
                    return false;
                }
            }
            if (!isNaN(maxDate)) {
                // Veto navigation to all outside the maxDate.
                if (newRange.startDate > maxDate) {
                    return false;
                }
            }
        }
        return true;
    }

    updateRange(range) {
        const
            me     = this,
            {
                date,
                _startDate
            }      = me,
            fixDom = () => {
                const { duration } = me;
                me.element.style.setProperty('--bi-range-magnitude', duration);
                me.element.dataset.duration = duration;
            };

        // Change the start and end dates depending on the range size around the current date
        if (range && date && !me.hasConfig('endDate')) {
            // If we have a range, then endDate is derived
            // If the startDate won't change, skip to updateStartDate to force UI update
            // because the end date will be different.
            if (!_startDate || _startDate - date) {
                me.startDate = date;
            }
            else {
                me.updateStartDate(me._startDate = me.snapDate(_startDate), _startDate);
            }
        }
        // CSS needs to know the range size
        if (me.isConfiguring) {
            me.whenVisible(fixDom);
        }
        else {
            fixDom();
        }
    }

    calculateDateRange(range, date) {
        const { dateHelper } = this;

        // Calculate the start and end dates depending on the range size around the requested date
        if (date) {
            // Only snap for units with definite start points
            if (range.unit !== 'day') {
                return {
                    startDate : dateHelper.floor(date, range, undefined, this.weekStartDay),
                    endDate   : dateHelper.ceil(dateHelper.add(date, 1, 'day'), range, undefined, this.weekStartDay)
                };
            }
            return {
                startDate : date,
                endDate   : dateHelper.add(date, range.magnitude, 'day')
            };
        }
    }

    changeMonth(month) {
        const
            me       = this,
            { date } = me;

        // MonthView, based on CalendarPanel has its own opinions
        if (super.changeMonth) {
            return super.changeMonth(...arguments);
        }

        if (!month?.isMonth) {
            month = new Month({
                date,
                owner              : me,
                weekStartDay       : me.weekStartDay,
                hideNonWorkingDays : me.hideNonWorkingDays,
                nonWorkingDays     : me.nonWorkingDays
            });

            if (me.nonWorkingDays == null) {
                me.nonWorkingDays = month.nonWorkingDays;
            }

            if (me.weekStartDay == null) {
                me.weekStartDay = month.weekStartDay;
            }
        }

        return month;
    }

    /**
     * Returns the range of included dates in the range as a two-element array, i.e., `[0]` is {@link #config-startDate}
     * and `[1]` is {@link #property-lastDate}.
     * @member {Date[]}
     * @internal
     */
    get dateBounds() {
        return [this.startDate, this.lastDate];
    }

    getDuration(startDate = this.startDate) {
        const { range, dateHelper } = this;

        if (range) {
            // If using a range, add the range in days to the start date rather than converting it
            // using as() because as(n, 'month', 'd') cannot be accurate. Fall back to that if we do not yet
            // have a startDate
            return startDate ? dateHelper.diff(startDate, dateHelper.add(startDate, range.magnitude, range.unit), 'd') : dateHelper.as('d', range.magnitude, range.unit);
        }
        else {
            return dateHelper.diff(startDate, this.peekEndDate() || this._endDate, 'day');
        }
    }

    get duration() {
        return this.getDuration();
    }

    /**
     * The last day that is included in the date range. This is different than {@link #config-endDate} since that date
     * is not inclusive. For example, an `endDate` of 2022-07-21 00:00:00 indicates that the time range ends at that
     * time, and so 2022-07-21 is _not_ in the range. In this example, `lastDate` would be 2022-07-20 since that is the
     * last day included in the range.
     * @member {Date}
     * @internal
     */
    get lastDate() {
        const lastDate = this.endDate;

        // endDate is "exclusive" because it means 00:00:00 of that day, so subtract 1
        // to keep description consistent with human expectations.
        return lastDate && this.dateHelper.add(lastDate, -1, 'day');
    }
};
