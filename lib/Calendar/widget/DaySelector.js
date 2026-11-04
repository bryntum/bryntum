import CalendarRow from './CalendarRow.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import FunctionHelper from '../../Core/helper/FunctionHelper.js';

DomHelper.loadStylesheet('Calendar/widget/DaySelector.css');

// import Stylesheet from './DaySelector.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'DaySelector');

/**
 * @module Calendar/widget/DaySelector
 */

/**
 * A specialized {@link Calendar.widget.CalendarRow} used as a compact day selector header, typically docked
 * at the top of an {@link Calendar.widget.EventList} or {@link Calendar.widget.DayView}. It displays a
 * single row of day cells (usually one week) that act as clickable date navigation targets. Clicking a day
 * number updates the owning view's date, and the selected day is highlighted. This widget also takes over
 * its owner's description renderer to show the week-level date description.
 *
 * It should not be used standalone as a regular Widget.
 *
 * @internal
 * @extends Calendar/widget/CalendarRow
 * @classtype dayselector
 * @tier community
 */
export default class DaySelector extends CalendarRow {
    static $name = 'DaySelector';

    // Factoryable type name
    static type = 'dayselector';

    static configurable = {
        readOnly   : true,
        autoCreate : false,
        flex       : '0 0 auto',
        dock       : 'top'
    };

    afterConfigure() {
        const
            me        = this,
            { owner } = me;

        super.afterConfigure();

        owner.scrollable?.ion({
            overflowChange : 'onOwnerOverflowChange',
            thisObj        : me
        });

        // We take over our owner's descriptionRenderer
        owner.descriptionRenderer = me.descriptionRenderer.bind(me);

        // We need to update ourselves in sync with our owner's date
        FunctionHelper.before(owner, 'updateDate', this.beforeOwnerDateUpdate, this);
    }

    beforeOwnerDateUpdate(date) {
        // isShifting flag means startDate is moved by the shiftIncrement which is *not* our range which is usually 1 week.
        // shiftIncrement is inherited from our owning view's duration - usually 1 day.
        this.isShifting = true;
        this.date = date;
        this.isShifting = false;
    }

    onOwnerOverflowChange({ y }) {
        this.headerElement.classList.toggle('b-show-yscroll-padding', Boolean(y));
    }

    onDayNumberClick({ date }) {
        if (this.owner) {
            this.owner.date = date;
        }
        // No further navigation must take place. Note that this is not a scheduleClick - this
        // widget is merely a slave of its owning Calendar widget. This is an internal gesture
        // which sets the owning Calendar widget's date.
        return false;
    }

    scrollTo() {} // We don't scroll

    descriptionRenderer() {
        const
            {
                startDate,
                endDate,
                owner,
                dh
            }          = this,
            startMonth = dh.getMonth(startDate),
            endMonth   = dh.getMonth(endDate),
            monthDesc  = startMonth === endMonth ? dh.format(startDate, 'MMMM') : `${dh.format(startDate, 'MMM')} - ${dh.format(endDate, 'MMM')}`,
            week       = owner.month.getWeekNumber(startDate);

        return `${this.L('L{Object.Week}')} ${week[1]}, ${monthDesc} ${week[0]}`;
    }
}

DaySelector.initClass();
