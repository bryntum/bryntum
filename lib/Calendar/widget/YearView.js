import CalendarMixin from './mixin/CalendarMixin.js';
import DayCellCollecter from './mixin/DayCellCollecter.js';
import DayCellRenderer from './mixin/DayCellRenderer.js';
import Panel from '../../Core/widget/Panel.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import Month from '../../Core/util/Month.js';
import DomSync from '../../Core/helper/DomSync.js';
import Tooltip from '../../Core/widget/Tooltip.js';
import ElementVisitor from '../../Core/util/ElementVisitor.js';

DomHelper.loadStylesheet('Calendar/widget/YearView.css');
// Shared `b-date-picker-cell-payload` + `b-show-events-dots` rules - same
// stylesheet that DatePicker loads, so the dot row / count badge render
// identically here and in CalendarDatePicker.
DomHelper.loadStylesheet('Core/widget/DatePickerCell.css');

// import Stylesheet from './YearView.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'YearView');

/**
 * @module Calendar/widget/YearView
 */

const
    isHoverGesture = {
        hover     : 1,
        mouseover : 1
    },
    emptyString = new String(), // NOSONAR: Need a truthy string here, so use the Object form.
    countEvents = (v, e) => v + e.renderedEvents.filter(e => !e.isOverflow).length;

/**
 * A data block created by all {@link Calendar.widget.mixin.DayCellCollecter} Calendar views to
 * encapsulate occupied year cells and the events which intersect with each date to be shown in the UI.
 * All useful data about the date and the shape of the UI is included.
 * @typedef {DayCell} YearCell
 * @property {DomConfig} cellConfig A {@link Core.helper.DomHelper#typedef-DomConfig}
 *   object that contains data about the cells element.
 * @property {String} cellConfig.style The style property is an object containing
 *   style properties for the cell header element.
 * @property {String} cellConfig.cls The cls property is an object whose property
 *   names will be added to the cell element if the property value is truthy.
 */

/**
 * This is normally used as a {@link Calendar.view.Calendar#config-modes mode} of a Calendar (as seen in the live
 * demo below) but may be used standalone as a regular Widget.
 *
 * {@inlineexample Calendar/widget/CalendarYearView.js}
 *
 * As a standalone widget, it will lack the capabilities of the {@link Calendar.view.Calendar}
 * class, such as keyboard-based event to event navigation and drag/drop features. As seen in this demo:
 *
 * {@inlineexample Calendar/widget/YearView.js}
 *
 * A Panel which displays a year's worth of months with days which have events highlighted.
 *
 * ## Useful configs
 *
 * | Config                          | Description                                           |
 * |---------------------------------|-------------------------------------------------------|
 * | {@link #config-year}            | The year to display                                   |
 * | {@link #config-dayCellRenderer} | Custom renderer for day cells                         |
 * | {@link #config-showEvents}      | How to indicate event presence (heatmap, dots, count) |
 * | {@link #config-sixWeeks}        | Show six week rows per month or fit to content        |
 *
 * ## See also
 *
 * - {@link Calendar.view.Calendar} — The main Calendar that hosts this view
 * - {@link Calendar.widget.MonthGrid} — Subclass showing a grid of monthly event lists
 *
 * @extends Core/widget/Panel
 * @mixes Core/widget/mixin/Responsive
 * @mixes Calendar/widget/mixin/CalendarMixin
 * @mixes Calendar/widget/mixin/DayCellCollecter
 * @mixes Calendar/widget/mixin/DayCellRenderer
 *
 * @classtype yearview
 * @tier community
 * @classtypealias year
 * @calendarview
 * @ts-widget
 */
export default class YearView extends Panel.mixin(CalendarMixin, DayCellCollecter, DayCellRenderer) {

    static $name = 'YearView';

    static type = 'yearview';

    static configurable = {
        //region Hidden configs

        /**
         * @hideconfigs stackMultiDayEvents
         */
        /**
         * @hideproperties stackMultiDayEvents
         */

        //endregion

        textContent : false,

        localizableProperties : ['title', 'stepUnit'],

        title : 'L{Year}',

        scrollable : {
            overflowY : true
        },

        stepUnit : 'L{yearUnit}',

        dragUnit : 'day',

        month : true,

        /**
         * A date which specifies the year to display. All types of calendar view have a `date`
         * config which they use to set their visible date range according to their configuration
         * and type.
         * @config {Date}
         */
        date : {
            $config : {
                equal : 'date'
            },
            value : null
        },

        descriptionFormat : 'YYYY',

        /**
         * The year to display
         * @config {Number}
         */
        year : null,

        monitorResize : false,

        showWeekColumn : true,

        hideWeekColumnCls : 'b-hide-week-numbers',

        /**
         * The class name to add to calendar cells which are in the previous or next month.
         * @config {String}
         * @private
         */
        otherMonthCls : 'b-other-month',

        /**
         * By default, all months show six week rows. Pass `false` to only render as many rows
         * as needed.
         * @config {Boolean}
         */
        sixWeeks : true,

        /**
         * An empty function by default, but provided so that you can override it.
         *
         * This function is called for each cell rendered to allow developers to mutate the cell metadata, or
         * the CSS classes to be applied to the cell.
         *
         * The cellConfig (a {@link Core.helper.DomHelper#typedef-DomConfig}) definition passed as part of the
         * single parameter may be mutated to add `style` and `className`.
         *
         * ```javascript
         * dayCellRenderer : function(cellData) {
         *     // I don't like Mondays!
         *     if (cellData.date === 1) {
         *         cellData.cls['dayoff'] = true;
         *     }
         * }
         *
         * ```
         *
         * A non-null return value from the renderer is used as the content of the day cell element.
         *
         * @config {Function} dayCellRenderer
         * @param {YearCell} cellData A `DayCell` object that contains data about the cell.
         * @returns {DomConfig|String|null}
         *
         * @category Rendering
         */
        dayCellRenderer : null,

        monthSelector : '.b-year-view-month-name',

        focusable : false,

        /**
         * How to indicate the presence of events for a date. The default is `heatmap` which adds
         * classes depending on how many events intersect the date.Values may be:
         *
         * * `false` - Do not show events in cells.
         * * `true` - Show a heatmap of colours the intensity of which indicates event load.
         * * `'heatmap'` - Show a heatmap of colours the intensity of which indicates event load.
         * * `'count'` - Show a themeable badge containing the event count for a date.
         * * `'dots'` - Show small event-coloured bullets up to a maximum of `{@link #config-eventDots}.max`
         *   to indicate event presence.
         * to indicate event presence.
         * @prp {Boolean|'heatmap'|'dots'}
         * @default
         */
        showEvents : 'heatmap',

        /**
         * When {@link #config-showEvents} is `'dots'`, this controls the layout of the dots
         * below the day number.
         *
         * If the `max` property is 1, the dots will be coloured using the default event colour,
         * *not* the colour of the event. This is to create a consistent appearance.
         *
         * @prp {Object}
         * @property {Number} marginTop The margin above the dots. Default is -5 which embeds
         * the dots into the bottom of the cell.
         * @property {Number} max The maximum number of dots to show. Default is 4.
         * @property {Number} gap The gap between dots. Default is 3.
         * @property {Number} size The size of the dots. Default is 5.
         * @property {Boolean} stripe If `true`, the dots will be striped, meaning they will be
         * joined together with _no gap_ between them and rounded at each end. Default is `false`.
         */
        eventDots : {
            marginTop : -5,
            max       : 4,
            gap       : 3,
            size      : 5
        },

        /**
         * When {@link #config-overflowPopupTrigger} is not a mouseover gesture, setting this to
         * a truthy value means that a tooltip containing the event count will be shown on hover of
         * a day cell.
         *
         * It may be specified as an Object which contains {@link Core.widget.Tooltip} config options,
         * and also the following option:
         *
         * - showNoEvents - When set to `true`, a tooltip containing "No events" is shown when
         * hovering empty day cells.
         *
         * For example:
         *
         * ```javascript
         * {
         *     modes : {
         *         year : {
         *             // We want it to show if there are no visible events for that date.
         *             // And we want the tip showing to the right of the cell
         *             eventCountTip : {
         *                 showNoEvents : true,
         *                 align        : 'l-r
         *             }
         *         }
         *     }
         * }
         * ```
         * @prp {Boolean|Object<String,Boolean|String>}
         * @default
         */
        eventCountTip : null
    };

    /**
     * Returns the resource associated with this year view when used inside a {@link Calendar.widget.ResourceView}
     * @readonly
     * @member {Scheduler.model.ResourceModel} resource
     */

    onCalendarKeyDown(keyEvent) {
        const
            {
                dh,
                dayTime,
                eventContentElement
            }                  = this,
            { target }         = keyEvent,
            eventCellSelector  = `.${this.dayCellCls}:not(.b-other-month)`,
            eventCellFocusable = `${eventCellSelector}>[tabIndex]`,
            gridCellFocusable  = `:is(.b-week-number-cell>[tabIndex],${eventCellFocusable})`,
            from               = target.closest(eventCellFocusable) || target;

        if (keyEvent.key === 'Escape') {
            keyEvent.preventDefault();
            from.closest('.b-year-view-month')?.querySelector('.b-year-view-month-name')?.focus();
            return;
        }

        if (from.matches(eventCellFocusable)) {
            const date = dayTime.parseKey(from.parentNode.dataset.date);

            switch (keyEvent.key) {
                case 'ArrowUp':
                    keyEvent.preventDefault();
                    eventContentElement.querySelector(`${eventCellSelector}[data-date="${dayTime.dateKey(dh.add(date, -7, 'd'))}"]>[tabIndex]`)?.focus();
                    break;
                case 'ArrowDown':
                    keyEvent.preventDefault();
                    eventContentElement.querySelector(`${eventCellSelector}[data-date="${dayTime.dateKey(dh.add(date, +7, 'd'))}"]>[tabIndex]`)?.focus();
                    break;
                case 'ArrowLeft':
                    keyEvent.preventDefault();
                    ElementVisitor.getVisitor(eventContentElement, gridCellFocusable).previous(from)?.focus();
                    break;
                case 'ArrowRight':
                    keyEvent.preventDefault();
                    ElementVisitor.getVisitor(eventContentElement, gridCellFocusable).next(from)?.focus();
                    break;
                case 'PageUp': {
                    keyEvent.preventDefault();
                    let target = dh.add(date, -1, 'M');
                    target = dh.create({
                        year  : dh.getFullYear(target),
                        month : dh.getMonth(target),
                        date  : Math.min(dh.getDate(date), dh.getLastDateOfMonth(target))
                    });
                    eventContentElement.querySelector(`${eventCellSelector}[data-date="${dayTime.dateKey(target)}"]>[tabIndex]`)?.focus();
                    break;
                }
                case 'PageDown': {
                    keyEvent.preventDefault();
                    let target = dh.add(date, 1, 'M');
                    target = dh.create({
                        year  : dh.getFullYear(target),
                        month : dh.getMonth(target),
                        date  : Math.min(dh.getDate(date), dh.getLastDateOfMonth(target))
                    });
                    eventContentElement.querySelector(`${eventCellSelector}[data-date="${dayTime.dateKey(target)}"]>[tabIndex]`)?.focus();
                    break;
                }
                default:
                    return super.onCalendarKeyDown(keyEvent);
            }
        }
        else if (from.matches('.b-week-number-cell > [tabIndex]')) {
            const date = dayTime.parseKey(from.parentNode.nextSibling.dataset.date);
            let week, sel;

            switch (keyEvent.key) {
                case 'ArrowUp':
                    keyEvent.preventDefault();
                    week = dh.getWeekNumber(dh.add(date, -1, 'w'));
                    sel = `[data-week="${week[0]},${week[1]}"]:not(.b-other-month)>.b-week-number-cell>[tabIndex]`;
                    (from.closest('.b-year-view-month').querySelector(sel) || eventContentElement.querySelector(sel))?.focus();
                    break;
                case 'ArrowDown':
                    keyEvent.preventDefault();
                    week = dh.getWeekNumber(dh.add(date, 1, 'w'));
                    eventContentElement.querySelector(`[data-week="${week[0]},${week[1]}"]:not(.b-other-month)>.b-week-number-cell>[tabIndex]`)?.focus();
                    break;
                case 'ArrowLeft':
                    keyEvent.preventDefault();
                    ElementVisitor.getVisitor(eventContentElement, gridCellFocusable).previous(from)?.focus();
                    break;
                case 'ArrowRight':
                    keyEvent.preventDefault();
                    ElementVisitor.getVisitor(eventContentElement, gridCellFocusable).next(from)?.focus();
                    break;
                case 'PageUp':
                    keyEvent.preventDefault();
                    week = dh.getWeekNumber(dh.add(date, -6, 'w'));
                    eventContentElement.querySelector(`[data-week="${week[0]},${week[1]}"]>.b-week-number-cell>[tabIndex]`)?.focus();
                    break;
                case 'PageDown':
                    keyEvent.preventDefault();
                    week = dh.getWeekNumber(dh.add(date, 6, 'w'));
                    eventContentElement.querySelector(`[data-week="${week[0]},${week[1]}"]>.b-week-number-cell>[tabIndex]`)?.focus();
                    break;
                default:
                    return super.onCalendarKeyDown(keyEvent);
            }
        }
        else if (from.matches('.b-year-view-month-name')) {
            const date = dayTime.parseKey(from.dataset.monthDate);

            switch (keyEvent.key) {
                // Enter the month grid
                case 'ArrowDown':
                    keyEvent.preventDefault();
                    from.parentElement.querySelector(gridCellFocusable)?.focus();
                    break;
                case 'ArrowLeft':
                    keyEvent.preventDefault();
                    eventContentElement.querySelector(`[data-month-date="${dayTime.dateKey(dh.add(date, -1, 'M'))}"]`)?.focus();
                    break;
                case 'ArrowRight':
                    keyEvent.preventDefault();
                    eventContentElement.querySelector(`[data-month-date="${dayTime.dateKey(dh.add(date, 1, 'M'))}"]`)?.focus();
                    break;
                default:
                    return super.onCalendarKeyDown(keyEvent);
            }
        }
        else {
            return super.onCalendarKeyDown(keyEvent);
        }
    }

    // Override from DayCellCollecter
    // We don't propagate. We copy all events into renderedEvents.
    createCellMap(options) {
        // We use the dateIndex, so gather all events which intersect. No need for propagation.
        const result = super.createCellMap(options = {
            skipPropagate : true,
            ...options
        });

        // YearView always places all its events as rendered events because we use skipPropagate
        // when creating the cell map, and just copy them all in so that the overflowPopup uses
        // them all. Any number of events is overflow for a YearView
        for (const cellData of result.values()) {
            cellData.renderedEvents.setEvents(cellData.events);
        }

        return result;
    }

    get date() {
        // If we have been injected with a specific date (Such from the Calendar Sidebar)
        // then use that as our anchor point. Fall back to the first visible event. If we are
        // without orientation use 1st January
        return this._date || (!this.isConfiguring && this.firstEventDate) || this.dateHelper.create({ year : this.year, month : 0, date : 1 });
    }

    next() {
        this.date = this.dh.create({ year : this.year + 1, month : this.dh.getMonth(this.date), date : this.dh.getDate(this.date) });
    }

    previous() {
        this.date = this.dh.create({ year : this.year - 1, month : this.dh.getMonth(this.date), date : this.dh.getDate(this.date) });
    }

    get firstEventDate() {
        const entries = [...this.cellMap.values()];

        if (entries.length) {
            return entries[0].date;
        }
    }

    get lastEventDate() {
        const entries = [...this.cellMap.values()];

        if (entries.length) {
            return entries[entries.length - 1].date;
        }
    }

    onCalendarPointerInteraction(domEvent) {
        const
            me        = this,
            superCall = super.onCalendarPointerInteraction,
            {
                target,
                type
            }         = domEvent;

        if (type === 'mousedown' || type.endsWith('click')) {
            // Any clicking after kicking off the overflow timer cancels it
            me.clearTimeout(me.cellOverflowTimer);
        }

        // Veto focusing out of the overflowPopup when mousedowning overflow button
        // (which is a cell which contains elements) so that the overflow popup doesn't flicker.
        if (type === 'mousedown' && me._overflowPopup?.isVisible && target.closest('.b-cal-cell-overflow')) {
            domEvent.preventDefault();
        }

        // If we're showing the overflow popup on click, and they clicked on an empty
        // cell, then they *might* be intending a dblclick, so we need to pause the
        // propagation of the click event into the processing
        if (me.overflowPopupTrigger === 'click' && me.autoCreate?.gesture === 'dblclick' && type === 'click' && target.closest(`.${me.emptyCellCls}`) && !me.emptyCellRenderer) {
            me.cellOverflowTimer = me.setTimeout({
                fn    : superCall,
                delay : 300,
                args  : [domEvent]
            });
        }
        else {
            return superCall.apply(me, arguments);
        }
    }

    changeMonth(month, oldMonth) {
        const
            me = this,
            listeners = {
                name       : 'yearChangeListener',
                yearChange : 'onMonthYearChange',
                thisObj    : me
            };

        me.detachListeners('yearChangeListener');

        if (month instanceof Month) {
            month.ion(listeners);
            me._year = month.year;
        }
        else {
            month = new Month({
                date               : me.dh.create({ year : me.year || me.dh.getFullYear(new Date()), month : 0, date : 1 }),
                owner              : me,
                weekStartDay       : me.weekStartDay,
                hideNonWorkingDays : me.hideNonWorkingDays,
                nonWorkingDays     : me.nonWorkingDays,
                sixWeeks           : me.sixWeeks,
                internalListeners  : listeners
            });
        }
        if (me.nonWorkingDays == null) {
            me.nonWorkingDays = me._month.nonWorkingDays;
        }

        // Keep our property in line with reality
        me._year = month.year;

        return month;
    }

    onMonthYearChange({ source : { year, date } }) {
        const me = this;

        // Keep our property in line with reality
        me._year = year;

        if (!me.isConfiguring) {
            me._cellMap?.clear();

            me.date = date;

            me.refresh();
        }
    }

    // Override for the YearView. We have to scroll *months* into view
    scrollTo(date, options = { animate : true }) {
        const
            me = this,
            { dh } = me;

        // We do not display events. If passed an event, scroll to its start date.
        date = me.ingestDate(date.isEventModel ? date.startDate : date);

        // If we do not own the date, move to that date.
        if (!dh.betweenLesser(date, me.startDate, me.endDate) || !me.getDayElement(date, true)) {
            me.date = date;
        }
        else {
            const monthEl = me.eventContentElement.querySelector(`[data-month-index="${dh.getMonth(date)}"]`);
            monthEl && me.scrollable.scrollIntoView(monthEl, options);
        }
    }

    get eventsPerCell() {
        return 0;
    }

    get startDate() {
        return this.month.getOtherMonth(this.dh.create({ year : this.year, month : 0, date : 1 })).startDate;
    }

    get endDate() {
        // It's exclusive of the day itself - this is a timepoint; 00:00 on the day after
        return this.dh.add(this.month.getOtherMonth(this.dh.create({ year : this.year, month : 11, date : 1 })).endDate, 1, 'day');
    }

    /**
     * For a consistent API, allow startDate to set the year
     * @member {Date}
     * @readonly
     * @internal
     */
    set startDate(startDate) {
        this.date = startDate;
    }

    updateDate(date) {
        this.month.date = date;
        // Only scroll if visible; onInternalPaint scrolls the active date into view when we are shown
        // preventScroll means the date came *from* an interaction with us, see Calendar#onViewCatchAll
        if (!this.preventScroll && this.isVisible && !this.isConfiguring) {
            this.scrollTo(date);
        }
    }

    changeYear(year) {
        if (this.isConfiguring) {
            return year;
        }
        this.month.year = year;
        return this.month.year;
    }

    changeShowEvents(showEvents, oldShowEvents) {
        return showEvents === true ? 'heatmap' : showEvents;
    }

    updateShowEvents(showEvents, oldShowEvents) {
        const
            me            = this,
            { classList } = me.contentElement;

        showEvents && classList.add(`b-show-events-${showEvents}`);
        classList.remove(`b-show-events-${oldShowEvents}`);

        if (!me.isConfiguring) {
            me.whenVisible(() => {
                me.doRefresh();

                // Month blocks may change size, so in small UIs, we need to scroll to
                // the date again.
                me.scrollTo(me.date);
            });
        }
    }

    changeEventDots(eventDots) {
        const me = this;
        return new Proxy(eventDots, {
            set(target) {
                const result = Reflect.set(...arguments);
                me.updateEventDots(target);
                return result;
            }
        });
    }

    updateEventDots({ marginTop, gap, size, stripe }) {
        const { style, classList } = this.contentElement;

        style.setProperty('--bi-event-count-margin-top', `${marginTop}px`);
        style.setProperty('--bi-event-count-dot-size', `${size}px`);
        style.setProperty('--bi-event-count-dot-gap', `${gap}px`);
        classList[stripe ? 'add' : 'remove']('b-event-count-dots-striped');
        if (!this.isConfiguring) {
            this.refresh();
        }
    }

    updateShowWeekNumber() {
        this.bodyElement.classList[this.showWeekColumn ? 'remove' : 'add'](this.hideWeekColumnCls);
    }

    createCellData(date) {
        // So that createCellData can evaluate if the cell is "other month"
        // For YearView, the month needs to be moved along as the cells are created.
        this.month.month = this.dateHelper.getMonth(date);

        return super.createCellData(date);
    }

    // We must implement the CalendarMixin interface.
    // All views must expose a doRefresh method.
    doRefresh() {
        const
            me = this,
            {
                dh,
                bodyElement : targetElement,
                month,
                dayCellCls,
                otherMonthCls,
                weekendCls,
                todayCls,
                nonWorkingDayCls,
                emptyCellCls,
                cellMap,
                showEvents,
                eventCountTip
            } = me,
            children = [],
            today = me.calendar?.today || new Date(),
            todayKey = dh.makeKey(today);

        for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
            month.month = monthIndex;

            const
                monthKey    = `${month.year}-${String(month.month + 1).padStart(2, '0')}`,
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator/filter
                // Iterator filter not yet supported by Safari. Spread the values() iterator into an array until fixed.
                monthEvents = [...cellMap.values()].filter(e => e.key.startsWith(monthKey)).reduce(countEvents, 0),
                monthName   = dh.getMonthName(monthIndex),
                monthDesc   = `${monthName} ${me.year}. ${me.L('eventCount', monthEvents)}`,
                monthHeader = {
                    tabIndex     : 0,
                    role         : 'link',
                    className    : 'b-year-view-month-name',
                    html         : monthName,
                    'aria-label' : monthDesc,
                    dataset      : {
                        // Month names must not look like day cells which have data-date="YYYY-MM-DD"
                        monthDate : dh.makeKey(dh.create({ year : me.year, month : monthIndex, date : 1 }))
                    }
                },
                weekNameCells = [{
                    className : 'b-week-number-cell'
                }],
                weekNameRow = {
                    'aria-hidden' : true,
                    className     : 'b-calendar-week b-calendar-week-days',
                    children      : weekNameCells
                },
                weeksGrid = {
                    role         : 'grid',
                    className    : 'b-calendar-weeks',
                    'aria-label' : monthDesc,
                    children     : []
                },
                monthElement = {
                    role      : 'presentation',
                    className : 'b-year-view-month',
                    children  : [monthHeader, weekNameRow, weeksGrid],
                    dataset   : {
                        monthIndex
                    }
                },
                weeks = weeksGrid.children;

            children.push(monthElement);

            let cellIndex = 0;

            month.eachWeek((week, dates, weekIndex, isLastWeek) => {
                // Populate week day cells when processing first week of month.
                if (weekNameCells.length === 1) {
                    for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
                        weekNameCells.push({
                            className : {
                                'b-year-view-weekday-cell' : 1,
                                [nonWorkingDayCls]         : me.nonWorkingDays[month.canonicalDayNumbers[columnIndex]]
                            },
                            text : dh.format(dates[columnIndex], 'd1')
                        });
                    }
                }

                const
                    isFirstWeekOfYear = monthIndex === 0 && weekIndex === 0,
                    isLastWeekOfYear  = monthIndex === 11 && isLastWeek,
                    weekElement       = {
                        role      : 'row',
                        tabIndex  : -1, // Prevent screen reader from over-announcing the cells
                        className : {
                            'b-calendar-week' : 1
                        },
                        dataset : {
                            week : `${week[0]},${week[1]}`
                        }
                    },
                    dayCells          = weekElement.children = [{
                        role      : 'gridcell',
                        className : 'b-week-number-cell'
                    }];

                weeks.push(weekElement);

                let weekEventCount = 0,
                    otherMonthCells = 0;

                for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
                    const
                        date          = dates[columnIndex],
                        isToday       = me.isToday(date),
                        todayText     = isToday ? me.L('L{Object.today}, ') : '',
                        isOtherMonth  = dh.getMonth(date) !== month.month,
                        key           = dh.makeKey(date),
                        day           = dh.getDay(date),
                        cellData      = !me.isConfiguring && cellMap.get(key),
                        events        = cellData?.events,
                        eventCount    = isOtherMonth ? 0 : events?.length || 0,
                        showOverflow  = eventCount,
                        cell          = {
                            role  : 'gridcell',
                            style : {
                                '--bi-event-count' : eventCount
                            },
                            className : {
                                'b-day-name'         : 1,
                                'b-colorize'         : 1,
                                // YearView shares the date-picker cell class with
                                // CalendarDatePicker / SchedulerDatePicker so the rules
                                // in Core/widget/DatePickerCell.css apply identically
                                // in both contexts.
                                'b-date-picker-cell' : 1,
                                [dayCellCls]         : 1,
                                [emptyCellCls]       : !eventCount
                            },
                            dataset : {
                                date : key,
                                cellIndex,
                                columnIndex,
                                eventCount
                            }
                        };

                    weekEventCount += eventCount;

                    let content = String(dh.getDate(date));

                    Object.assign(cell.className, {
                        [weekendCls]             : dh.weekends[day],
                        [todayCls]               : key === todayKey && !isOtherMonth,
                        [nonWorkingDayCls]       : me.nonWorkingDays[day],
                        [otherMonthCls]          : isOtherMonth,
                        'b-cal-cell-overflow'    : showOverflow,
                        // Hooks mirroring SchedulerDatePicker / CalendarDatePicker so
                        // selectors can target a cell that hosts a count badge or dot
                        // markers.
                        'b-has-badge'            : showEvents === 'count' && Boolean(eventCount),
                        'b-has-events'           : showEvents === 'dots'  && Boolean(eventCount),
                        [`b-day-of-week-${day}`] : 1
                    });

                    if (me.dayCellRenderer) {
                        const result = me.callback(me.dayCellRenderer, me, [{ cellConfig : cell, date, events : cellData?.events?.map(data => data.eventRecord) || [] }]);

                        if (result != null) {
                            content = result;
                        }
                    }

                    // Event count tooltip to show only if the overflow popup is not shown on hover.
                    if (eventCountTip && !(isHoverGesture[me.overflowPopupTrigger])) {
                        const btip = eventCount ? me.L('L{ResourceInfoColumn.eventCountText}', eventCount) : eventCountTip.showNoEvents ? me.L('L{noEvents}') : null;
                        if (btip) {
                            const tipData = Tooltip.encodeConfig(eventCountTip);

                            cell.dataset = {
                                ...cell.dataset,
                                ...tipData,
                                btip
                            };
                        }
                    }

                    // Cell content - the inner element holds *only* the date number (or
                    // whatever the dayCellRenderer returned). Event indicators (count
                    // badge / dot markers) live on the payload sibling below.
                    // The inner uses the same class as CalendarDatePicker's inner so
                    // the shared rules in Core/widget/DatePickerCell.css cover it.
                    cell.children = [{
                        className : {
                            'b-year-view-cell-inner'   : 1,
                            'b-date-picker-cell-inner' : 1
                        },
                        [typeof content === 'string' ? 'html' : 'children'] : content
                    }];

                    // Event indicators live in a payload element which is a *sibling* of
                    // the inner, mirroring the SchedulerDatePicker / CalendarDatePicker
                    // pattern (see Scheduler/widget/SchedulerDatePicker.js#cellRenderer
                    // and Calendar/widget/CalendarDatePicker.js#cellRenderer where the
                    // same payload element does double duty for the count badge and the
                    // event dots).
                    //
                    // - In count mode the payload itself is the badge: when there's a
                    //   non-zero count it gains the `b-cell-events-badge` class plus the
                    //   count text. Empty cells get an empty payload (no badge class,
                    //   no text) which keeps an unstyled zero off the screen.
                    // - In dots mode the payload becomes the `b-cal-minimal-event-container`
                    //   and holds the dot DomConfigs as children.
                    if (showEvents === 'count' || showEvents === 'dots') {
                        const payloadConfig = {
                            className : {
                                'b-date-picker-cell-payload' : 1
                            },
                            dataset : {
                                count : eventCount
                            }
                        };

                        if (showEvents === 'count') {
                            payloadConfig.className['b-cell-events-badge'] = Boolean(eventCount);
                            payloadConfig.text = eventCount || '';
                        }
                        else {
                            // dots
                            const
                                { max }  = me.eventDots,
                                children = [];

                            for (let i = 0; i < Math.min(eventCount || 0, max); i++) {
                                children.push(me.createEventDomConfig({
                                    date,
                                    eventRecord : events[i].eventRecord,

                                    // If we only show one dot, we don't want to show
                                    // whatever the event colour is - use the default
                                    // dot colour for visual consistency.
                                    eventColor : max > 1 ? null : emptyString,

                                    // Renders without content, just background colour.
                                    minimal : true
                                }));
                            }
                            payloadConfig.className['b-cal-minimal-event-container'] = 1;
                            payloadConfig.children = children;
                        }

                        cell.children.push(payloadConfig);
                    }

                    if (isOtherMonth) {
                        otherMonthCells++;
                    }
                    else {
                        // Non-other-month cells are interactive (focusable / accessible).
                        cell.children[0].role = 'link';
                        cell.children[0].tabIndex = -1;
                        cell.children[0]['aria-label'] = `${todayText}${dh.format(date, 'dddd Do MMMM')}, ${me.L('eventCount', eventCount)}`;
                    }

                    dayCells.push(cell);

                    cellIndex++;
                }

                if (otherMonthCells === 7) {
                    dayCells[0].text = week[1];
                }
                else {
                    dayCells[0].children = [{
                        className    : 'b-calendar-cell-inner',
                        tabIndex     : -1,
                        role         : 'link',
                        text         : week[1],
                        'aria-label' : `${me.L('L{Calendar.weekOfYear}', week)}, ${me.L('eventCount', weekEventCount)}`
                    }];
                }

                const rowIsOtherMonth = otherMonthCells === 7 || (otherMonthCells > 3 && !(isFirstWeekOfYear || isLastWeekOfYear)) ? 1 : 0;

                // The week number cell is only accessible if it is not in an "other month".
                // If there are *no* current month cells in the week, it is not accessible.
                // If it has more than three "other month" cells, it is considered to be in an other month.
                // Unless it's the first or last week of the year, in which case it must be accessible.
                weekElement.className['b-other-month'] = rowIsOtherMonth;
                if (rowIsOtherMonth) {
                    weekElement['aria-disabled'] = true;
                }
            });
        }

        DomSync.sync({
            targetElement,
            domConfig : {
                children
            }
        });

        me.refreshCount = (me.refreshCount || 0) + 1;

        /**
         * Fires when this YearView refreshes.
         * @param {Calendar.widget.YearView} source The triggering instance.
         * @ts-param source {Calendar.widget.YearView|*}
         * @event refresh
         */
        me.trigger('refresh');
    }

    getDayElement(date, strict) {
        if (typeof date !== 'string') {
            date = this.dateHelper.makeKey(date);
        }

        // Enforce strict meaning this view must own that date
        if (strict && parseInt(date.substr(0, 4)) !== this.year) {
            return;
        }

        // In a multi month view, we must filter out dates which are in the "other month" category.
        return this.contentElement.querySelector(`.b-calendar-cell[data-date="${date}"]:not(.b-other-month)`);
    }

    // Override in this class to eliminate "other" month cells.
    getCell() {
        return this.getDayElement(...arguments);
    }

    onInternalPaint({ firstPaint }) {
        if (firstPaint) {
            this.refresh();
        }
        // If we are animating into view, we have to jump over that.
        this.setTimeout(() => this.scrollTo(this.date, { animate : false }), 10);
    }
}

YearView.initClass();
