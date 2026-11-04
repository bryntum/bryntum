import Base from '../../../Core/Base.js';
import StringHelper from '../../../Core/helper/StringHelper.js';
import DaySelector from '../DaySelector.js';

/**
 * @module Calendar/widget/mixin/DaySelectable
 */

/**
 * Mixin that provides the ability to add a {@link Calendar.widget.DaySelector} as a
 * {@link Core.widget.Panel#config-tbar}.
 *
 * This is used by the {@link Calendar.widget.EventList} and also {@link Calendar.widget.DayView} to
 * optionally be able to show a day selector row docked at the top.
 *
 * Views that use this mixin can show a compact day selector header:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     modes : {
 *         list : {
 *             // Show a day selector at the top of the list view
 *             daySelector : true
 *         }
 *     }
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Calendar.widget.DaySelector} — The day selector widget shown at the top
 * - {@link Calendar.widget.EventList} — View that can use this mixin
 * - {@link Calendar.widget.DayView} — View that can use this mixin
 *
 * @mixin
 */
export default Target => class DaySelectable extends (Target || Base) {
    static $name = 'CalendarMixin';

    static configurable = {
        /**
         * If {@link #config-daySelector} is set, then this will be an instance
         * of {@link Calendar.widget.DaySelector} which encapsulates the day selector at the top
         * of this view.
         * @member {Calendar.widget.DaySelector} daySelector
         * @readonly
         * @internal
         */
        /**
         * A Configure this as `true` to show a {@link Calendar.widget.DaySelector} docked at the top to
         * act as a day selector. By default, the DaySelector will be seven days in duration and locked
         * to start a the `weekStartDay`
         * @config {Boolean|DaySelectorConfig}
         * @internal
         */
        daySelector : null
    };

    changeDaySelector(daySelector, oldDaySelector) {
        const me = this;

        if (daySelector) {
            // Whatever we are mixed into, it's because it is showing only one day.
            me.range = '1 day';

            // In case we are mixed into an EventList.
            me.settings = null;
            me.hideHeaders = true;

            const
                startDate = me.dayTime.shiftDate(me.month.getWeekStart(me.month.getWeekNumber(me.startDate))),
                result    = DaySelector.reconfigure(oldDaySelector, daySelector, {
                    owner    : me,
                    defaults : {
                        type     : 'dayselector',
                        calendar : me.calendar,
                        parent   : me,

                        cls : {
                            [StringHelper.cls`b-${me.$$name}-day-selector`] : 1
                        },

                        dayStartShift      : me.dayStartShift,
                        dayTime            : me.dayTime,
                        month              : me.month,
                        date               : me.date,
                        startDate,
                        range              : { magnitude : 1, unit : 'week' },
                        shiftIncrement     : { unit : 'd', magnitude : me.duration },
                        hideNonWorkingDays : me.hideNonWorkingDays,
                        nonWorkingDays     : me.nonWorkingDays,
                        nonWorkingDayCls   : me.nonWorkingDayCls,
                        weekendCls         : me.weekendCls,
                        weekStartDay       : me.weekStartDay
                    }
                });

            me.addCls(StringHelper.cls`b-${me.$$name}-with-day-selector`);
            me.tbar = result;
            return result;
        }
        else {
            oldDaySelector?.destroy();
        }
    }

    //region Current config

    getCurrentConfig(options) {
        const result = super.getCurrentConfig(options);

        // Internal matter
        delete result.daySelector;

        return result;
    }

    //endregion
};
