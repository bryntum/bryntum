import Panel from './Panel.js';
import ArrayHelper from '../helper/ArrayHelper.js';
import DateHelper from '../helper/DateHelper.js';

import Month from '../util/Month.js';
import Tooltip from './Tooltip.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import DomHelper from '../helper/DomHelper.js';
import EventHelper from '../helper/EventHelper.js';

DomHelper.loadStylesheet('Core/widget/CalendarPanel.css');

// import Stylesheet from './CalendarPanel.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'CalendarPanel');

/**
 * @module Core/widget/CalendarPanel
 */
// Weekend days are a permanent concept.
// Non-working days default to being these two days (from the locale), but may be disparate
const weekendDays = { 0 : 1, 6 : 1 };

// Should not have @classtype, since it should not be created directly

/**
 * A Panel which displays a month of date cells.
 *
 * This is a base class for UI widgets like {@link Core.widget.DatePicker} which need to display a calendar layout.
 *
 * @extends Core/widget/Panel
 * @internalwidget
 */
export default class CalendarPanel extends Panel {

    static $name = 'CalendarPanel';

    static type = 'calendarpanel';

    static configurable = {
        layout : 'vbox',

        textContent : false,

        /**
         * Gets or sets the date that orientates the panel to display a particular month.
         * Changing this causes the content to be refreshed.
         * @member {Date} date
         */
        /**
         * The date which this CalendarPanel encapsulates.
         * @config {Date|String}
         */
        date : {
            $config : 'date'
        },

        /**
         * A {@link Core.util.Month} Month utility object which encapsulates this Panel's month
         * and provides contextual information and navigation services.
         * @config {Core.util.Month|MonthConfig}
         */
        month : {},

        year : null,

        /**
         * The week start day, 0 meaning Sunday, 6 meaning Saturday.
         * Defaults to {@link Core.helper.DateHelper#property-weekStartDay-static}.
         * @config {Number}
         */
        weekStartDay : null,

        /**
         * Configure as `true` to always show a six-week calendar.
         * @config {Boolean}
         * @default
         */
        sixWeeks : true,

        /**
         * Configure as `true` to show a week number column at the start of the calendar block.
         * @prp {Boolean}
         */
        showWeekColumn : null,

        /**
         * Either an array of `Date` objects which are to be disabled (or date strings), or
         * a function (or the name of a function), which, when passed a `Date` returns `true` if the
         * date is disabled. Disabled dates cannot be interacted with.
         * @config {Function|String|Date[]|String[]}
         * @param {Date} date Date to check
         * @returns {Boolean} Returns `true` if the provided date is disabled
         */
        disabledDates : null,

        /**
         * A function (or the name of a function) which creates content in, and may mutate a day header element.
         *
         * The cell element may be mutated, or an HTML string or {@link DomConfig} object may be returned.
         * @config {Function|String}
         * @param {HTMLElement} cell The header element
         * @param {Number} columnIndex The day column. Will be in the range `0` to `6`
         * @param {Number} weekDay The canonical day number where Monday is `0` and Sunday is `6`
         * @returns {String|DomConfig|null}
         */
        headerRenderer : null,

        /**
         * A function (or the name of a function) which creates content in, and may mutate the week cell element at the start of a week row.
         *
         * ```javascript
         * weekRenderer(weekCell, week) {
         *     // week[0] is the year
         *     // week[1] is the week number
         *     cell.innerText = week[1];
         * }
         * ```
         *
         * The cell element may be mutated, or an HTML string or {@link DomConfig} object may be returned.
         * @config {Function|String}
         * @param {HTMLElement} weekCell The header element
         * @param {Number[]} week An array containing `[year, weekNumber]`
         * @returns {String|DomConfig|null}
         */
        weekRenderer : null,

        /**
         * A function (or the name of a function) which creates content in, and may mutate a day cell element.
         *
         * @config {Function|String}
         * @param {Object} context Renderer context data
         * @param {HTMLElement} context.cell The cell element.
         * @param {Date} context.date The date for the cell
         * @param {Number} context.day The day for the cell (`0` to `6` for Sunday to Saturday)
         * @param {Number[]} context.rowIndex The row index, 0 to month row count (6 if {@link #config-sixWeeks} is `true`)
         * @param {HTMLElement} context.row The row element encapsulating the week which the cell is a part of
         * @param {Core.widget.CalendarPanel} context.source The widget being rendered
         * @param {Number[]} context.cellIndex The cell index in the whole panel. May be from `0` to up to `42`
         * @param {Number[]} context.columnIndex The column index, `0` to `6`
         * @param {Number[]} context.visibleColumnIndex The visible column index taking hidden non working days into account
         * @returns {String|DomConfig|null}
         */
        cellRenderer : null,

        /**
         * Configure as `true` to render Saturdays and Sundays as {@link #config-disabledDates}.
         * @config {Boolean}
         */
        disableWeekends : null,

        /**
         * Configure as `true` to render past dates in a lighter text color.
         * @prp {Boolean}
         */
        shadePastDates : null,

        /**
         * Configure as `true` to render non working days as {@link #config-disabledDates}.
         *
         * Note, that by default, non working days are read from the locale, and are normally
         * Saturday and Sunday. But they can be set to other days than weekend days.
         * @config {Boolean}
         */
        disableNonWorkingDays : null,

        hideNonWorkingDays : null,

        hideNonWorkingDaysCls : 'b-hide-non-working-days',

        /**
         * Non-working days as an object where keys are day indices, 0-6 (Sunday-Saturday), and the value is `true`.
         * Defaults to {@link Core.helper.DateHelper#property-nonWorkingDays-static}.
         * @config {Object<Number,Boolean>}
         */
        nonWorkingDays : null,

        /**
         * A config object to create a tooltip which will show on hover of a date cell including disabled, weekend,
         * and "other month" cells.
         *
         * It is the developer's responsibility to hook the `beforeshow` event to either veto the show by returning
         * `false` or provide contextual content for the date.
         *
         * The tip instance will be primed with a `date` property.
         * @config {TooltipConfig}
         */
        tip : {
            $config : 'nullify',
            value   : null
        },

        dayCellCls   : 'b-calendar-panel-cell',
        dayHeaderCls : 'b-calendar-day-header',

        /**
         * The class name to add to disabled calendar cells.
         * @config {String}
         */
        disabledCls : 'b-disabled-date',

        /**
         * The class name to add to calendar cells which are in the previous or next month.
         * @config {String}
         */
        otherMonthCls : 'b-other-month',

        /**
         * The class name to add to calendar cells which are weekend dates.
         * @config {String}
         */
        weekendCls : 'b-weekend',

        pastDateCls : 'b-past-date',

        /**
         * The class name to add to the calendar cell which contains today's date.
         * @config {String}
         */
        todayCls : 'b-today',

        /**
         * The class name to add to calendar cells which are {@link #config-nonWorkingDays}.
         * @config {String}
         */
        nonWorkingDayCls : 'b-non-working-day',

        /**
         * The {@link Core.helper.DateHelper} format string to format the day names
         * in the header row above the calendar cells.
         * @config {String}
         * @default
         */
        dayNameFormat : 'ddd',

        /**
         * By default, week rows flex to share available Panel height equally.
         *
         * Set this config if the available height is too small, and the cell height needs
         * to be larger to show events.
         *
         * Setting this config causes the month grid to become scrollable in the `Y` axis.
         *
         * May be specified as a number in which case it will be taken to mean pixels,
         * or a length in standard CSS units.
         * @config {Number|String}
         */
        minRowHeight : {
            $config : ['lazy'],
            value   : null
        },

        /**
         * By default, day cells flex to share available Panel width equally.
         *
         * Set this config if the available width is too small, and the cell width needs
         * to be larger to show events.
         *
         * Setting this config causes the month grid to become scrollable in the `X` axis.
         * @config {Number}
         */
        minColumnWidth : {
            $config : ['lazy'],
            value   : null
        },

        /**
         * Configure this as true to disable pointer interaction with cells which are outside the
         * range of the current month.
         * @config {Boolean}
         */
        disableOtherMonthCells : null,

        disableOtherMonthCellsCls : 'b-disable-other-month-cells',

        /**
         * Configure this as `true` to hide cells which are outside the range of the current month.
         * @config {Boolean}
         */
        hideOtherMonthCells : null,

        hideOtherMonthCellsCls : 'b-hide-other-month-cells',

        /**
         * By default, when navigating through time, the next time
         * block will be animated in from the appropriate direction.
         *
         * Configure this as `false` to disable this.
         * @prp {Boolean} animateTimeShift
         * @default
         */
        animateTimeShift : true,

        /**
         * The header text for the week number column, if shown.
         * @prp {String}
         */
        weekColumnHeader : null
    };

    construct(config) {
        const me = this;

        super.construct(config);

        EventHelper.on({
            element : me.weeksElement,
            click   : {
                handler  : 'internalOnCellClick',
                delegate : `:is(.${me.dayCellCls},.b-week-number-cell):not(.${me.disabledCls}${me.outOfRangeCls ? `,.${me.outOfRangeCls}` : ''})`
            },
            thisObj : me
        });

        if (!me.refreshCount) {
            me.refresh();
        }
    }

    internalOnCellClick(domEvent) {
        const
            weekRow = domEvent.target.closest('[data-week]'),
            week    = weekRow?.dataset.week.split(',').map(Number),
            cell    = domEvent.target.closest('[data-date]'),
            date    = this.cellDateHelper.parseKey((cell || weekRow.querySelector('[data-date]')).dataset.date),
            event = {
                date,
                week,
                domEvent
            };

        if (cell) {
            /**
             * Fired when a date cell is clicked.
             * @event cellClick
             * @param {HTMLElement} cell The clicked cell element.
             * @param {Date} date The date represented by the cell.
             * @param {Number[]} week The week array `[year, weekNumber]`.
             * @param {Event} domEvent The original DOM event.
             */
            this.trigger('cellClick', { cell, ...event });
        }
        else {
            /**
             * Fired when a week number cell is clicked.
             * @event weekCellClick
             * @param {Date} date The start date of the week.
             * @param {Number[]} week The week array `[year, weekNumber]`.
             * @param {Event} domEvent The original DOM event.
             */
            this.trigger('weekCellClick', event);
        }
    }

    onInternalPaint({ firstPaint }) {
        super.onInternalPaint?.(...arguments);

        // Invoke the lazy configs when we first hit the visible DOM
        if (firstPaint) {
            // The cell structure must exist for the configs to apply to.
            if (!this.refreshCount) {
                this.refresh();
            }
            this.getConfig('minColumnWidth');
            this.getConfig('minRowHeight');
        }
    }

    get overflowElement() {
        return this.weeksElement;
    }

    updateMinRowHeight(minRowHeight) {
        this.element.style.setProperty('--bi-min-row-height', DomHelper.setLength(minRowHeight));

        this.scrollable = {
            overflowY : minRowHeight ? 'auto' : false
        };
        this.toggleCls('b-min-row-height', minRowHeight);
    }

    updateMinColumnWidth(minColumnWidth) {
        this.element.style.setProperty('--bi-min-column-width', DomHelper.setLength(minColumnWidth));

        this.scrollable = {
            overflowX : minColumnWidth ? 'auto' : false
        };
        this.toggleCls('b-min-column-width', minColumnWidth);
    }

    getDateFromDomEvent(domEvent) {
        const element = (domEvent.nodeType === Element.ELEMENT_NODE ? domEvent : domEvent.target).closest(`#${this.id} [data-date]`);

        if (element) {
            return this.cellDateHelper.parseKey(element.dataset.date);
        }
    }

    changeTip(tip, existingTip) {
        const me = this;

        return Tooltip.reconfigure(existingTip, tip, {
            owner    : me,
            defaults : {
                type        : 'tooltip',
                owner       : me,
                id          : `${me.id}-cell-tip`,
                forElement  : me.bodyElement,
                forSelector : `.${me.dayCellCls}`
            }
        });
    }

    updateTip(tip) {
        this.detachListeners('tip');

        tip?.ion({
            pointerOver : 'onTipOverCell',

            name    : 'tip',
            thisObj : this
        });
    }

    updateElement(element, was) {
        const me = this;

        super.updateElement(element, was);

        me.updateHideNonWorkingDays(me.hideNonWorkingDays);
        me.weekdayCells = Array.from(element.querySelectorAll('.b-calendar-day-header'));
        me.weekElements = Array.from(element.querySelectorAll('.b-calendar-week'));
        me.weekDayElements = Array.from(element.querySelectorAll('.b-calendar-panel-days'));
        me.cellElements = [];

        for (let i = 0, { length } = me.weekDayElements; i < length; i++) {
            me.cellElements.push(me.weekDayElements[i].previousSibling, ...me.weekDayElements[i].children);
        }
    }

    changeDate(date) {
        if (!(date instanceof Date)) {
            date = typeof date === 'string' ? DateHelper.parse(date) : new Date(date);
        }
        if (isNaN(date)) {
            throw new Error('CalendarPanel date ingestion must be passed a Date, or a YYYY-MM-DD date string');
        }

        return DateHelper.clearTime(date);
    }

    /**
     * The date which this CalendarPanel encapsulates. Setting this causes the
     * content to be refreshed.
     * @property {Date}
     */
    updateDate(value) {
        // We respond to Month change events to update the UI
        this.month.date = value;
        this.element.dataset.month = DateHelper.format(value, 'YYYY-MM');
    }

    updateDayNameFormat() {
        // 4th June 2000 was a Sunday
        const d = new Date('2000-06-04T12:00:00');

        this.shortDayNames = [];

        // Collect local shortDayNames in default order.
        for (let date = 4; date < 11; date++) {
            d.setDate(date);
            this.shortDayNames.push(DateHelper.format(d, this.dayNameFormat));
        }
    }

    get weekStartDay() {
        // This trick allows our weekStartDay to float w/the locale even if the locale changes
        return typeof this._weekStartDay === 'number' ? this._weekStartDay : DateHelper.weekStartDay;
    }

    /**
     * Set to 0 for Sunday (the default), 1 for Monday etc.
     *
     * Set to `null` to use the default value from {@link Core/helper/DateHelper}.
     */
    updateWeekStartDay(weekStartDay) {
        const me = this;

        if (me._month) {
            me.month.weekStartDay = weekStartDay;

            me.dayNames = [];

            // So, if they set weekStartDay to 1 meaning Monday which is ISO standard, we will
            // dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            for (let i = 0; i < 7; i++) {
                me.dayNames[i] = me.shortDayNames[me.canonicalDayNumbers[i]];
            }

            if (me.refreshCount) {
                me.refresh();
            }
        }
    }

    updateHideNonWorkingDays(hideNonWorkingDays) {
        // Undefined must be cast to Boolean, otherwise it will toggle the class *on*.
        this.contentElement.classList.toggle(this.hideNonWorkingDaysCls, Boolean(hideNonWorkingDays));
        this.scrollable?.syncOverflowState();
        if (this._month) {
            this.month.hideNonWorkingDays = hideNonWorkingDays;
        }
        // First/last visible cell might change
        if (!this.isConfiguring) {
            this.refresh();
        }
    }

    updateHideOtherMonthCells(hideOtherMonthCells) {
        this.toggleCls(this.hideOtherMonthCellsCls, hideOtherMonthCells);
        this.scrollable?.syncOverflowState();
    }

    updateDisableOtherMonthCells(disableOtherMonthCells) {
        this.toggleCls(this.disableOtherMonthCellsCls, disableOtherMonthCells);
        this.scrollable?.syncOverflowState();
    }

    updateShadePastDates(value) {
        this.toggleCls('b-shade-past-dates', value);
    }

    get nonWorkingDays() {
        // If we were not configured with non working days, ask the locale for them. Once.
        // The cached value is cleared on locale change.
        return this._nonWorkingDays || (this._localeNonWorkingDays || (this._localeNonWorkingDays = DateHelper.nonWorkingDays));
    }

    get weekends() {
        // Ask the DateHelper which days are weekend days only once.
        // The cached value is cleared on locale change.
        return this._localeWeekends || (this._localeWeekends = DateHelper.weekends);
    }

    changeNonWorkingDays(nonWorkingDays) {
        return ObjectHelper.assign({}, nonWorkingDays);
    }

    updateNonWorkingDays(nonWorkingDays) {
        if (this._month) {
            this.month.nonWorkingDays = nonWorkingDays;
            this.refresh();
            this.scrollable?.syncOverflowState();
        }
    }

    get visibleDayColumnIndex() {
        return this.month.visibleDayColumnIndex;
    }

    get dayColumnIndex() {
        return this.month.dayColumnIndex;
    }

    get canonicalDayNumbers() {
        return this.month.canonicalDayNumbers;
    }

    get visibleColumnCount() {
        return this.month.visibleColumnCount;
    }

    get weekLength() {
        return this.month.weekLength;
    }

    /**
     * The date of the first day cell in this panel.
     * Note that this may *not* be the first of this panel's current month.
     * @member {Date}
     * @readonly
     */
    get startDate() {
        return this.month.startDate;
    }

    get duration() {
        // The endDate is "exclusive" because it means 00:00:00 of that day.
        return DateHelper.diff(this.month.startDate, this.month.endDate, 'day') + 1;
    }

    /**
     * The end date of this view. Note that in terms of full days, this is exclusive,
     * ie: 2020-01-012 to 2020-01-08 is *seven* days. The end is 00:00:00 on the 8th.
     *
     * Note that this may *not* be the last date of this panel's current month.
     * @member {Date}
     * @readonly
     */
    get endDate() {
        const { endDate } = this.month;

        if (endDate) {
            return DateHelper.add(endDate, 1, 'day');
        }
    }

    changeMonth(month, currentMonth) {
        const me = this;

        if (!(month instanceof Month)) {

            // Setting month to a number when we already have a Month means
            // just updating the month number of our Month
            if (typeof month === 'number') {
                if (currentMonth) {
                    currentMonth.month = month;
                    return;
                }
                const date = me.date || DateHelper.clearTime(new Date());

                date.setMonth(month);
                month = {
                    date
                };
            }
            month = Month.new({
                weekStartDay       : me.weekStartDay,
                nonWorkingDays     : me.nonWorkingDays,
                hideNonWorkingDays : me.hideNonWorkingDays,
                sixWeeks           : me.sixWeeks
            }, month);
        }

        month.ion({
            dateChange : 'onMonthDateChange',
            thisObj    : me
        });

        return month;
    }

    onMonthDateChange({ source : month, newDate, oldDate, changes }) {
        const me = this;

        // Ensure we're always in sync with the data our Month holds
        me.year = month.year;

        if (!me.isConfiguring) {
            // Only refresh if we don't contain a cell for the new date
            // or if, internally, the Month we are mapping to the UI is different.
            if (!me.getCell(newDate) || (changes.m || changes.y)) {
                // Interrogate DOM *before* mutating it with a refresh.
                const { isVisible } = me;

                me.refresh();

                if (me.animateTimeShift && isVisible && (changes.m || changes.y)) {
                    DomHelper.slideIn(me.contentElement, newDate > oldDate ? 1 : -1);
                }
            }

            /**
             * Fires when the date of this CalendarPanel is set.
             * @event dateChange
             * @param {Date} value The new date.
             * @param {Date} oldValue The old date.
             * @param {Object} changes An object which contains properties which indicate what part of the date changed.
             * @param {Boolean} changes.d True if the date changed in any way.
             * @param {Boolean} changes.w True if the week changed (including same week in a different year).
             * @param {Boolean} changes.m True if the month changed (including same month in a different year).
             * @param {Boolean} changes.y True if the year changed.
             */
            me.trigger('dateChange', {
                changes,
                value    : newDate,
                oldValue : oldDate
            });
        }
    }

    updateYear(year) {
        this.month.year = year;
    }

    updateShowWeekNumber(showWeekNumber) {
        this.updateShowWeekColumn(showWeekNumber);
    }

    updateShowWeekColumn(showWeekColumn) {
        this.toggleCls('b-show-week-column', showWeekColumn);
        if (this.floating) {
            // Must realign because content change might change dimensions
            if (!this.isAligning) {
                this.realign();
            }
        }
    }

    updateSixWeeks(sixWeeks) {
        if (this.month) {
            this.month.sixWeeks = sixWeeks;
            this.refresh();
        }
    }

    /**
     * Refreshes the UI after changing a config that would affect the UI.
     */
    refresh() {
        this.month && this.element.style.setProperty('--bi-week-length', this.month.weekLength);

        // This method may be overridden by subclasses to add things like refresh scheduling.
        this.doRefresh();
    }

    /**
     * Implementation of the UI refresh.
     * @private
     */
    doRefresh() {
        const
            me       = this,
            { date } = me,
            now      = new Date();

        // When in the tz cascade, resolve "today" as now's day label in the view zone (me.dh), re-keyed into the cell frame.
        let today;

        if (me.dh && me.dh !== DateHelper) {
            today = me.cellDateHelper.parseKey(me.dh.makeKey(now));
        }
        else {
            let todayDate = now;



            today = DateHelper.clearTime(todayDate);
        }

        // Ensure sub elements are all present
        me.getConfig('element');

        // If we have not been initialized with a current date, use today
        if (!date) {
            me.date = today;
            return;
        }

        const
            cellDh = me.cellDateHelper,
            {
                weekElements,
                weekDayElements,
                month,
                dayCellCls,
                dayHeaderCls,
                disabledCls,
                otherMonthCls,
                weekendCls,
                todayCls,
                nonWorkingDayCls,
                nonWorkingDays,
                pastDateCls,
                canonicalDayNumbers,
                sixWeeks,
                firstVisibleDate,
                lastVisibleDate
            } = me;

        // Useful value for CSS to know. Must be set before refresh.
        me.element.style.setProperty('--bi-visible-week-count', month.weekCount);

        /**
         * Fires before this CalendarPanel refreshes in response to changes in its month.
         * @event beforeRefresh
         * @param {Core.widget.DatePicker} source This DatePicker.
         */
        me.trigger('beforeRefresh');

        // Make sure we've calculated our shortDayNames
        me.getConfig('dayNameFormat');

        for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
            const
                cell          = me.weekdayCells[columnIndex],
                cellDay       = me.canonicalDayNumbers[columnIndex],
                cellClassList = {
                    [dayHeaderCls]     : 1,
                    [weekendCls]       : weekendDays[cellDay],
                    [nonWorkingDayCls] : nonWorkingDays[cellDay]
                };

            if (me.headerRenderer) {
                cell.innerHTML = '';
                const header = me.callback(me.headerRenderer, me, [cell, columnIndex, cellDay]);
                if (header) {
                    if (typeof header === 'string') {
                        DomHelper.setInnerText(cell, header);
                    }
                    else {
                        DomHelper.createElement({
                            ...header,
                            parent : cell
                        });
                    }
                }
            }
            else {
                DomHelper.setInnerText(cell, me.shortDayNames[cellDay]);
            }

            // Sync day name cell classes with its calculated status
            DomHelper.syncClassList(cell, cellClassList);

            cell.dataset.columnIndex = columnIndex;
            cell.dataset.cellDay = cellDay;
        }

        // Create cell content
        let rowIndex = 0,
            cellIndex = 0,
            lastWorkingColumn = 6;

        // Which column is the last working day so it can be tagged with an identifying class
        for (let columnIndex = 6; columnIndex >= 0; columnIndex--) {
            if (!nonWorkingDays[canonicalDayNumbers[columnIndex]]) {
                lastWorkingColumn = columnIndex;
                break;
            }
        }

        // Hide or show the "other month" week row depending on our sixWeeks setting
        weekElements[4].classList.toggle('b-hide-display', month.weekCount < 5 && !sixWeeks);
        weekElements[5].classList.toggle('b-hide-display', month.weekCount < 6 && !sixWeeks);

        month.eachWeek((week, dates) => {
            const
                weekDayElement = weekDayElements[rowIndex],
                weekCells      = [weekDayElement.previousSibling, ...weekDayElement.children],
                weekCell       = weekCells[0],
                { firstChild } = weekCell;

            // Stamp week into week row's dataset and aria-label
            weekElements[rowIndex].dataset.week = `${week[0]},${week[1]}`;
            weekElements[rowIndex].setAttribute('aria-label', `${me.L('L{Week}')} ${week[1]}, ${week[0]}`);

            if (weekCell.innerHTML === '') {
                weekCell.innerText = week[1];
            }
            else if (firstChild.nodeType === Node.TEXT_NODE) {
                firstChild.nodeValue = week[1];
            }

            if (me.weekRenderer) {
                const weekCellContent = me.callback(me.weekRenderer, me, [weekCell, week]);
                if (weekCellContent) {
                    if (typeof weekCellContent === 'string') {
                        DomHelper.setInnerText(weekCell, weekCellContent);
                    }
                    else {
                        weekCell.innerHTML = '';
                        DomHelper.createElement({
                            ...weekCellContent,
                            parent : weekCell
                        });
                    }
                }
            }

            for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
                const
                    date          = dates[columnIndex],
                    // Day-of-week, key and other-month are read in the cell's own frame (cellDh)
                    day           = cellDh.getDay(date),
                    key           = cellDh.makeKey(date),
                    isNonWorking  = nonWorkingDays[day],
                    cell          = weekCells[columnIndex + 1],
                    // `today` is already resolved in this cell frame and the view's timezone (see doRefresh top)
                    isToday       = !(date - today),
                    cellClassList = {
                        [dayCellCls]             : 1,
                        [pastDateCls]            : date < today,
                        [disabledCls]            : me.isDisabledDate(date),
                        [otherMonthCls]          : cellDh.getMonth(date) !== month.month,
                        [weekendCls]             : weekendDays[day],
                        [todayCls]               : isToday,
                        [nonWorkingDayCls]       : isNonWorking,
                        'b-last-working-day'     : columnIndex === lastWorkingColumn,
                        'b-first-visible-cell'   : !(date - (firstVisibleDate || -1)),
                        'b-last-visible-cell'    : !(date - (lastVisibleDate || -1)),
                        [`b-day-of-week-${day}`] : 1
                    };

                // Sync day cell classes with its calculated status
                DomHelper.syncClassList(cell, cellClassList);

                cell.role = 'gridcell';
                cell.dataset.date = key;
                cell.dataset.cellIndex = cellIndex;
                cell.dataset.columnIndex = columnIndex;

                // Since we manipulate the classList/Name directly, we need to trick DomSync's config comparison logic or it
                // may think the class has not changed.
                if (cell.lastDomConfig) {
                    delete cell.lastDomConfig.class;
                    delete cell.lastDomConfig.className;
                }

                if (me.cellRenderer) {
                    me.callback(me.cellRenderer, me, [{
                        cell,
                        date,
                        day,
                        rowIndex,
                        cellIndex,
                        columnIndex,
                        key,
                        week,
                        row                : weekElements[rowIndex],
                        source             : me,
                        visibleColumnIndex : me.visibleDayColumnIndex[day]
                    }]);

                    if (isToday) {
                        const
                            ariaLabel = cell.getAttribute('aria-label'),
                            todayText = me.L('L{Object.today}, ');

                        if (ariaLabel && !ariaLabel.startsWith(todayText)) {
                            cell.setAttribute('aria-label', `${todayText}${ariaLabel}`);
                        }
                    }
                }
                else {
                    cell.innerHTML = cellDh.getDate(date);
                }
                cellIndex++;
            }

            rowIndex++;
        });

        /**
         * The number of rows displayed in this month. If {@link #config-sixWeeks} is not set,
         * this may be from 4 to 6.
         * @member {Number} visibleWeekCount
         * @readonly
         */
        me.visibleWeekCount = rowIndex;

        if (me.floating) {
            // Must realign because content change might change dimensions
            if (!me.isAligning) {
                me.realign();
            }
        }

        me.refreshCount = (me.refreshCount || 0) + 1;

        /**
         * Fires when this CalendarPanel refreshes.
         * @event refresh
         */
        me.trigger('refresh');
    }

    isDisabledDate(date) {
        const
            me  = this,
            day = date.getDay(),
            {
                disabledDates
            }   = me;

        if (me.disableWeekends && weekendDays[day]) {
            return true;
        }
        if (me.disableNonWorkingDays && me.nonWorkingDays[day]) {
            return true;
        }

        if (disabledDates) {
            if (Array.isArray(disabledDates)) {
                date = DateHelper.clearTime(date, true);
                return disabledDates.some(d => {
                    d = typeof d === 'string' ? DateHelper.parse(d) : d;
                    return !(DateHelper.clearTime(d, true) - date);
                });
            }
            else {
                return me.callback(disabledDates, me, [date]);
            }
        }
    }

    get bodyConfig() {
        const
            result = super.bodyConfig,
            weeksContainerChildren = [];

        result.children = [{
            tag           : 'div',
            className     : 'b-calendar-panel-row b-calendar-week-days',
            'aria-hidden' : true,
            reference     : 'weekdaysHeader',
            children      : [
                {
                    class : 'b-week-number-cell',
                    text  : this.weekColumnHeader
                },
                ...ArrayHelper.fill(7, { class : this.dayHeaderCls }),
                DomHelper.scrollBarPadElement
            ]
        }, {
            // `notranslate` prevents google translate messing up the DOM, https://github.com/facebook/react/issues/11538
            className : 'b-weeks-container notranslate',
            reference : 'weeksElement',
            children  : weeksContainerChildren,
            role      : 'grid'
        }];

        for (let i = 0; i < 6; i++) {
            const weekRow = {
                role      : 'row',
                tabIndex  : -1, // Prevent screen reader from over-announcing the cells
                className : 'b-calendar-panel-row b-calendar-week',
                dataset   : {
                    rowIndex : i
                },
                children : [{
                    className : 'b-week-number-cell',
                    role      : 'rowheader'
                }, {
                    className   : 'b-calendar-panel-days',
                    children    : [{}, {}, {}, {}, {}, {}, {}],
                    syncOptions : {
                        ignoreRefs : true,
                        strict     : false  // allow complete replacement of classes w/o matching lastDomConfig
                    }
                }]
            };

            weeksContainerChildren.push(weekRow);
        }

        return result;
    }

    get firstVisibleDate() {
        if (this.hideOtherMonthCells) {
            const { year, month } = this.month;

            return new Date(year, month, 1);
        }
        for (const me = this, date = me.month.startDate; ; date.setDate(date.getDate() + 1)) {
            if (!me.hideNonWorkingDays || !me.nonWorkingDays[date.getDay()]) {
                return date;
            }
        }
    }

    get lastVisibleDate() {
        const lastDate = DateHelper.add(this.endDate, -1, 'd');

        if (this.hideOtherMonthCells) {
            const { year, month } = this.month;

            return new Date(year, month + 1, 0);
        }
        for (const me = this, date = lastDate; ; date.setDate(date.getDate() - 1)) {
            if (!me.hideNonWorkingDays || !me.nonWorkingDays[date.getDay()]) {
                return date;
            }
        }
    }

    // The DateHelper the day cells are generated in (the Month's frame) — used to key/parse cell dates consistently.
    get cellDateHelper() {
        return this.month?.dh || DateHelper;
    }

    /**
     * Returns the cell associated with the passed date.
     *
     * To exclude dates which are outside of the panel's current month, pass the `strict` parameter as `true`
     * @param {Date|String} date The date to find the element for or a key in the format `YYYY-MM-DD`
     * @param {Boolean} strict Only return the element if this view *owns* the date.
     * @returns {HTMLElement} The cell for the passed date if it exists
     */
    getCell(date, strict) {
        if (typeof date !== 'string') {
            date = this.cellDateHelper.makeKey(date);
        }
        const cell = this.weeksElement.querySelector(`[data-date="${date}"]`);

        if (cell && (!strict || !cell.classList.contains(this.otherMonthCls))) {
            return cell;
        }
    }

    onTipOverCell({ source : tip, target }) {
        tip.date = this.cellDateHelper.parseKey(target.dataset.date);
    }

    updateLocalization() {
        // Uncache the cached locale data
        this._localeNonWorkingDays = this._localeWeekends = null;

        this.updateDayNameFormat();
        this.updateWeekStartDay(this.weekStartDay);
        super.updateLocalization();
    }
}

// Register this widget type with its Factory
CalendarPanel.initClass();
