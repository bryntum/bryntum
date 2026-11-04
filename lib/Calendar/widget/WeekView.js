import DayView from './DayView.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';

DomHelper.loadStylesheet('Calendar/widget/WeekView.css');

// import Stylesheet from './WeekView.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'WeekView');

/**
 * @module Calendar/widget/WeekView
 */

/**
 * This is normally used as a {@link Calendar.view.Calendar#config-modes mode} of a Calendar (as seen in the live
 * demo below) but may be used standalone as a regular Widget.
 *
 * {@inlineexample Calendar/widget/CalendarWeekView.js}
 *
 * As a standalone widget, it will lack the capabilities of the {@link Calendar.view.Calendar}
 * class, such as keyboard-based event to event navigation and drag/drop features. As seen in this demo:
 *
 * {@inlineexample Calendar/widget/WeekView.js}
 *
 * A Panel which displays up to 7 columns of days with events for each day arranged in ascending
 * time order in each column.
 *
 * All day events, and multi day events which intersect that day are displayed in a row at the top.
 *
 * Intra day events are arranged in ascending time order down the column from the {@link Calendar.widget.DayView#config-dayStartTime} to
 * the {@link Calendar.widget.DayView#config-dayEndTime}
 *
 * Event rendering can be customized using the {@link #config-eventRenderer} method.
 *
 * ## Useful configs
 *
 * | Config                             | Description                          |
 * |------------------------------------|--------------------------------------|
 * | {@link #config-dayStartTime}       | Start hour of the visible time range |
 * | {@link #config-dayEndTime}         | End hour of the visible time range   |
 * | {@link #config-hourHeight}         | Pixel height of one hour cell        |
 * | {@link #config-allDayEvents}       | Config for the all-day events row    |
 * | {@link #config-hideNonWorkingDays} | Hide weekend/non-working day columns |
 *
 * ## See also
 *
 * - {@link Calendar.view.Calendar} — The main Calendar that hosts this view
 * - {@link Calendar.widget.DayView} — Parent class providing day column rendering
 * - {@link Calendar.widget.CalendarRow} — The all-day events row at the top of this view
 *
 * @extends Calendar/widget/DayView
 *
 * @classtype weekview
 * @tier community
 * @classtypealias week
 * @calendarview
 * @ts-widget
 */
export default class WeekView extends DayView {

    // <debug>
    // region Localization test
    static localization = [
        'L{weekUnit}'
    ];
    // endregion
    // </debug>

    static $name = 'WeekView';

    static type = 'weekview';

    static configurable = {
        localizableProperties : ['title'],

        title : 'L{Week}',

        range : {
            magnitude : 1,
            unit      : 'week'
        },

        responsive : {
            small : {
                descriptionFormat : 'Wp YYYY'
            },

            large : {
                descriptionFormat : ['MMMM YYYY (Wp)', 'S{MMM} - E{MMM YYYY} (S{Wp})']
            },

            '*' : {
                descriptionFormat : ['MMMM YYYY', 'S{MMM} - E{MMM YYYY}']
            }
        },

        week : null,

        // Override from DayView. This means that in addition to endDate being
        // locked to startDate, and being changed when startDate changes, startDate
        // is also locked to endDate and is changed when the endDate changes.
        fixedDuration : true
    };

    /**
     * Returns the resource associated with this week view when used inside a {@link Calendar.widget.ResourceView}
     * @readonly
     * @member {Scheduler.model.ResourceModel} resource
     */

    calculateDuration() {
        // Override from CalendarMixin where the value is calculated from two passed dates.
        return 7;
    }

    updateWeekStartDay(weekStartDay, oldWeekStartDay) {
        super.updateWeekStartDay?.(weekStartDay);

        if (!this.isConfiguring) {
            this.startDate = this.dateHelper.add(this.startDate, weekStartDay - oldWeekStartDay, 'd');
        }
    }

    changeMonth() {
        const result = super.changeMonth(...arguments);

        result.ion({
            weekChange : 'onMonthWeekChange',
            thisObj    : this
        });
        return result;
    }

    onMonthWeekChange({ source, newDate }) {
        // We have to keep the week number in sync only if we have not been configured away from
        // encapsulating one week.
        if (this.range?.unit === 'week') {
            this.week = source.getWeekNumber(newDate);
        }
    }

    changeWeek(week, oldWeek) {
        const me = this;

        // If not an array, assume it's the week number
        week = Array.isArray(week) ? week : [me.month.year, week];

        // Only return a value if a change has been requested
        if (!ObjectHelper.isEqual(week, oldWeek)) {
            const
                minDate = me.minDate || me.calendar?.minDate,
                maxDate = me.maxDate || me.calendar?.maxDate;

            // Only do date arithmetic if we need to validate.
            if (!isNaN(minDate) || !isNaN(maxDate)) {
                const
                    { month } = me,
                    weekStart = month.getWeekStart(week),
                    weekEnd   = me.dateHelper.add(weekStart, me.duration, 'd');

                // In case of change to outside of our min/max, return a week
                // constraied into the span.
                if (!isNaN(minDate) && weekEnd <= minDate) {
                    return month.getWeekNumber(minDate);
                }
                if (!isNaN(maxDate) && weekStart > maxDate) {
                    return month.getWeekNumber(maxDate);
                }
            }

            return week;
        }
    }

    updateWeek(week) {
        const
            me                       = this,
            { month, date, dayTime } = me;

        // If our current date is outside of the requested week, move it
        // to the week start which will set the startDate
        if (!date || !ObjectHelper.isEqual(month.getWeekNumber(date), week)) {
            me.date = dayTime.shiftDate(month.getWeekStart(week));
        }
        // In case a beforeDateChange handler.
        // vetoed the date change - we have to sync the week to our date.
        me.week = month.getWeekNumber(me.date);
    }

    // https://github.com/bryntum/bryntum/issues/12895
    // Transform the description to show the date range first, followed by the week number wrapped in a span
    get customDescription() {
        const { range } = this;

        if (!this.descriptionRenderer && range?.magnitude === 1 && range?.unit === 'week') {
            const parts = super.description.split(', ');

            if (parts.length === 2) {
                return StringHelper.xss`<span class="b-calendar-view-desc-range">${parts[1]}</span><span class="b-calendar-view-desc-week-badge">${parts[0]}</span>`;
            }
        }
        return null;
    }
}

WeekView.initClass();
