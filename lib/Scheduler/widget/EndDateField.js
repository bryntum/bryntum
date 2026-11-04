import DateField from '../../Core/widget/DateField.js';
import DateHelper from '../../Core/helper/DateHelper.js';

/**
 * @module Scheduler/widget/EndDateField
 */

const year2300 = new Date(2300, 0, 1);

/**
 * Date field widget (text field + date picker) to be used together with Scheduling Engine.
 * This field adjusts time to the latest possible time of the day based on either:
 *
 * - the event calendars (which is a combination of its own calendar and assigned resources ones) - if
 *   {@link #config-eventRecord} is provided.
 * - the project {@link Scheduler.model.ProjectModelEnterprise#field-calendar calendar} - if {@link #config-project} is
 *   provided. The default value of the {@link #property-max} property is set to be 200 years
 *   after the project's end date (or to the year 2300 if no project is provided).
 *
 * **Please note, that either {@link #config-eventRecord} or {@link #config-project} value must be provided.**
 *
 * This field can be used as an editor for a {@link Grid.column.Column}.
 * It is used as the default editor for the `EndDateColumn`.
 *
 * {@inlineexample Scheduler/widget/EndDateFieldPro.js}
 *
 * ## Useful configs
 *
 * | Config                      | Description                                         |
 * |-----------------------------|-----------------------------------------------------|
 * | {@link #config-project}     | Project model providing the calendar                |
 * | {@link #config-eventRecord} | Event model defining the calendar to use            |
 * | {@link #config-keepTime}    | How to adjust time (`'eod'`, `false`, `true`, etc.) |
 *
 * ## See also
 *
 * - {@link Scheduler.widget.StartDateField} — Companion field for editing the task start date
 * - {@link Scheduler.model.EventModelEnterprise} — Task model whose {@link
 * Scheduler.model.EventModelEnterprise#field-endDate} this field edits
 * - {@link Scheduler.widget.taskeditor.GeneralTab} — Task editor tab that embeds this field
 *
 * @extends Core/widget/DateField
 * @classtype enddatefield
 * @classtypealias enddate
 * @inputfield
 * @tier community
 */
export default class EndDateField extends DateField {

    //region Config

    static $name = 'EndDateField';

    static type = 'enddatefield';

    static alias = 'enddate';

    static configurable = {
        /**
         * Project model calendar of which should be used by the field.
         * @config {Scheduler.model.ProjectModelEnterprise}
         */
        project     : null,
        /**
         * The Event model defining the calendar to be used by the field.
         * @config {Scheduler.model.EventModelEnterprise}
         */
        eventRecord : null,

        strictParsing : true,

        /**
         * A flag which indicates what time should be used for selected date.
         * `eod` by default which adjusts user provided value time to end of the working day.
         *
         * Possible options are:
         * - `'eod'` adjust user provided value time to end of the working day
         * - `false` to reset time to midnight
         * - `true` to keep original time value
         * - `'17:00'` a string which is parsed automatically
         * - `new Date(2020, 0, 1, 17)` a date object to copy time from
         * - `'entered'` to keep time value entered by user (in case {@link #config-format} includes time info)
         *
         * @config {Boolean|Date|String}
         * @default
         */
        keepTime : 'eod'
    };

    //endregion

    //region Internal

    get min() {
        let min               = this._min;
        const eventStartDate  = this.eventRecord?.startDate;

        if (eventStartDate) {
            min = DateHelper.max(min || eventStartDate, eventStartDate);
        }

        return min;
    }

    set min(value) {
        super.min = value;
    }

    get max() {
        return super.max || (this.project?.startDate ? DateHelper.add(this.project.startDate, 200, 'year') : year2300);
    }

    set max(value) {
        super.max = value;
    }

    get calendarProvider() {
        // Occurrences does not have their own calendar, use master events calendar
        return (this.eventRecord?.recurringEvent ?? this.eventRecord) || this.project;
    }

    getStepDate(direction) {
        const me = this;

        // Degrade to the plain calendar step while there is no graph to consult
        if (!me.calendarProvider?.graph) {
            return super.getStepDate(direction);
        }

        const
            forward       = direction > 0,
            { stepValue } = me;

        let result = me.calendarProvider.run('skipWorkingTime', me.value, forward, stepValue.magnitude, stepValue.unit);

        if (result && !forward) {
            // Need to skip non-working time
            // since after the above step "result" can be set at 08:00 for example (for business calendar)
            result = me.calendarProvider.run('skipNonWorkingTime', result, false);
        }

        return result;
    }

    isTimeValue(value) {
        return value !== 'eod' && super.isTimeValue(...arguments);
    }

    transformTimeValue(value) {
        const { calendarProvider, min } = this;

        // adjust time to end of working day (except if it's a record values loading case)
        if (calendarProvider?.graph && this.keepTime === 'eod' && !this.assigningValue) {
            const
                startOfTheDay  = DateHelper.clearTime(value),
                startOfNextDay = DateHelper.add(startOfTheDay, 1, 'day'),
                // search for the latest available time for this day
                latestTime     = calendarProvider.run('skipNonWorkingTime', startOfNextDay, false);

            // if it's the same day, the latest time is found, use it
            if (DateHelper.isValidDate(latestTime) && DateHelper.isEqual(latestTime, startOfTheDay, 'day')) {
                return DateHelper.copyTimeValues(startOfTheDay, latestTime);
            }
        }

        const result = super.transformTimeValue(value);

        // make sure we do not violate "min" value
        if (result && min && result < min) {
            return min;
        }

        return result;
    }

    //endregion

}

// Register this widget type with its Factory
EndDateField.initClass();
