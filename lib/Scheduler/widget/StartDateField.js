import DateField from '../../Core/widget/DateField.js';
import DateHelper from '../../Core/helper/DateHelper.js';

/**
 * @module Scheduler/widget/StartDateField
 */

const year2300 = new Date(2300, 0, 1);

/**
 * Date field widget (text field + date picker) to be used together with Scheduling Engine.
 * This field adjusts time to the earliest possible time of the day based on either:
 *
 * - the event calendars (which is a combination of its own calendar and assigned resources ones) - if
 *   {@link #config-eventRecord} is provided.
 * - the project {@link Scheduler.model.ProjectModelEnterprise#field-calendar calendar} - if {@link #config-project} is
 *   provided. The project start date is used as a default value for the {@link #property-min} property.
 *   Also, the default value of the {@link #property-max} property is set to be 200 years
 *   after the project's end date (or to the year 2300 if no project is provided).
 *
 * **Please note, that either {@link #config-eventRecord} or {@link #config-project} value must be provided.**
 *
 * This field can be used as an editor for the {@link Grid.column.Column Column}.
 * It is used as the default editor for the `StartDateColumn`.
 *
 * {@inlineexample Scheduler/widget/StartDateFieldPro.js}
 *
 * ## Useful configs
 *
 * | Config                       | Description                                         |
 * |------------------------------|-----------------------------------------------------|
 * | {@link #config-project}      | Project model providing the calendar                |
 * | {@link #config-eventRecord}  | Event model defining the calendar to use            |
 * | {@link #config-keepTime}     | How to adjust time (`'sod'`, `false`, `true`, etc.) |
 * | {@link #config-minDateDelta} | Offset from project start for minimum date          |
 * | {@link #config-maxDateDelta} | Offset from project start for maximum date          |
 *
 * ## See also
 *
 * - {@link Scheduler.widget.EndDateField} — Companion field for editing the task end date
 * - {@link Scheduler.model.EventModelEnterprise} — Task model whose {@link
 * Scheduler.model.EventModelEnterprise#field-startDate} this field edits
 * - {@link Scheduler.widget.taskeditor.GeneralTab} — Task editor tab that embeds this field
 *
 * @extends Core/widget/DateField
 * @classtype startdatefield
 * @classtypealias startdate
 * @inputfield
 * @tier community
 */
export default class StartDateField extends DateField {

    //region Config

    static $name = 'StartDateField';

    static type = 'startdatefield';

    static alias = 'startdate';

    static configurable = {
        /**
         * Project model calendar of which should be used by the field.
         * @config {Scheduler.model.ProjectModelEnterprise}
         */
        project : null,

        /**
         * Event model calendars of which should be used by the field.
         * @config {Scheduler.model.EventModelEnterprise}
         */
        eventRecord : null,

        strictParsing : true,

        /**
         * Number of milliseconds to add to the project's start date (should be negative). Then, during editing,
         * the resulting date is assigned to the {@link #config-min} property of the field,
         * preventing the user from entering too low values.
         *
         * This also prevents freezing, when user enters the incomplete date with one-digit year.
         *
         * The value of this config will be passed to {@link Core.helper.DateHelper#function-add-static},
         * so in addition to number of milliseconds, strings like "-1 year" are recognized.
         *
         * Default value is '-10 years'
         *
         * @config {Number|String}
         * @default
         */
        minDateDelta : '-10 years',

        /**
         * Number of milliseconds to add to the project's start date. Then, during editing,
         * the resulting date is assigned to the {@link #config-max} property of the field,
         * preventing the user from entering too high values.
         *
         * This also prevents freezing, when user enters the date with five-digits year.
         *
         * The value of this config will be passed to {@link Core.helper.DateHelper#function-add-static},
         * so in addition to number of milliseconds, strings like "1 year" are recognized.
         *
         * Default value is '200 years'
         *
         * @config {Number|String}
         * @default
         */
        maxDateDelta : '200 years',

        /**
         * A flag which indicates what time should be used for selected date.
         * `sod` by default which adjusts user provided value time to start of the working day.
         *
         * Possible options are:
         * - `'sod'` adjust user provided value time to start of the working day
         * - `false` to reset time to midnight
         * - `true` to keep original time value
         * - `'17:00'` a string which is parsed automatically
         * - `new Date(2020, 0, 1, 17)` a date object to copy time from
         * - `'entered'` to keep time value entered by user (in case {@link #config-format} includes time info)
         *
         * @config {Boolean|Date|String}
         * @default
         */
        keepTime : 'sod'
    };

    //endregion

    //region Internal

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

        if (result && forward) {
            // Need to skip non-working time
            // since after the above step "result" can be set at 17:00 for example (for business calendar)
            result = me.calendarProvider.run('skipNonWorkingTime', result, true);
        }

        return result;
    }

    isTimeValue(value) {
        return value !== 'sod' && super.isTimeValue(...arguments);
    }

    transformTimeValue(value) {
        const { calendarProvider } = this;

        // adjust time to start of the working day (except if it's a record values loading case)
        if (calendarProvider?.graph && this.keepTime === 'sod' && !this.assigningValue) {
            const
                startOfTheDay = DateHelper.clearTime(value),
                // search for the earliest available time for this day
                earliestTime  = calendarProvider.run('skipNonWorkingTime', startOfTheDay);

            // if it's the same day, the earliest time is found, use it
            if (DateHelper.isValidDate(earliestTime) && DateHelper.isEqual(earliestTime, startOfTheDay, 'day')) {
                return DateHelper.copyTimeValues(startOfTheDay, earliestTime);
            }
        }

        return super.transformTimeValue(value);
    }

    get min() {
        return super.min || (this.project?.startDate ? DateHelper.add(this.project.startDate, this.minDateDelta) : null);
    }

    set min(value) {
        super.min = value;
    }

    get max() {
        return super.max || (this.project?.startDate ? DateHelper.add(this.project.startDate, this.maxDateDelta) : year2300);
    }

    set max(value) {
        super.max = value;
    }
    //endregion

}

// Register this widget type with its Factory
StartDateField.initClass();
