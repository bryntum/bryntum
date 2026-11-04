import CalendarMixin from './mixin/CalendarMixin.js';
import DayCellCollecter from './mixin/DayCellCollecter.js';
import DayCellRenderer from './mixin/DayCellRenderer.js';
import CalendarPanel from '../../Core/widget/CalendarPanel.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import Scroller from '../../Core/helper/util/Scroller.js';
import EventSorter from '../util/EventSorter.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import DateHelper from '../../Core/helper/DateHelper.js';

DomHelper.loadStylesheet('Calendar/widget/MonthView.css');

// import Stylesheet from './MonthView.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'MonthView');

/**
 * @module Calendar/widget/MonthView
 */

const
    evRegexp       = /^(\d+)ev$/,
    // A row animating back to a flexed height still carries b-shrinkwrapped, so b-flexing is what
    // distinguishes rows which are on their way out from rows which are to stay shrinkwrapped.
    isNotFlexing   = row => !row.classList.contains('b-flexing'),
    expandGestures = {
        shrinkwrap : 1,
        expand     : 1
    };

/**
 * This is normally used as a {@link Calendar.view.Calendar#config-modes mode} of a Calendar (as seen in the live
 * demo below) but may be used standalone as a regular Widget.
 *
 * In the example below, the MonthView may be resized vertically by dragging the splitter handle just below it.
 *
 * When the height is changed by dragging the splitter, the view responsively adjusts the event height to show
 * more or fewer events per cell. See {@link #config-responsiveEventHeight}.
 *
 * {@inlineexample Calendar/widget/CalendarMonthView.js}
 *
 * As a standalone widget, it will lack the capabilities of the {@link Calendar.view.Calendar}
 * class, such as keyboard-based event to event navigation and drag/drop features. As seen in this demo:
 *
 * {@inlineexample Calendar/widget/MonthView.js}
 *
 * A Panel which displays a single month in a calendar like view.
 *
 * Cell rendering can be customized using the {@link #config-dayCellRenderer} method.
 *
 * Event rendering can be customized using the {@link Calendar.widget.mixin.EventRenderer#config-eventRenderer} method.
 *
 * ## Useful configs
 *
 * | Config                             | Description                          |
 * |------------------------------------|--------------------------------------|
 * | {@link #config-eventHeight}        | Height of event bars in pixels       |
 * | {@link #config-showWeekNumber}     | Show week number in day cells        |
 * | {@link #config-dayCellRenderer}    | Custom renderer for day cells        |
 * | {@link #config-autoRowHeight}      | Flex week rows or shrinkwrap events  |
 * | {@link #config-hideNonWorkingDays} | Hide weekend/non-working day columns |
 *
 * ## See also
 *
 * - {@link Calendar.view.Calendar} — The main Calendar that hosts this view
 * - {@link Calendar.widget.OverflowPopup} — Popup shown for overflowing events in day cells
 * - {@link Calendar.feature.WeekExpander} — Feature to expand week rows showing all events
 * - {@link Calendar.widget.mixin.DayCellRenderer} — Mixin providing cell rendering
 *
 * @extends Core/widget/CalendarPanel
 * @mixes Core/widget/mixin/Responsive
 * @mixes Calendar/widget/mixin/DayCellCollecter
 * @mixes Calendar/widget/mixin/DayCellRenderer
 * @mixes Calendar/widget/mixin/CalendarMixin
 * @classtype monthview
 * @tier community
 * @classtypealias month
 * @calendarview
 * @ts-widget
 */
export default class MonthView extends CalendarPanel.mixin(CalendarMixin, DayCellCollecter, DayCellRenderer) {

    static $name = 'MonthView';

    static type = 'monthview';

    static configurable = {
        // MonthView needs to monitor its resize events immediately so that no scrollbar appears
        // when eventHeight is changed.
        monitorResize : {
            immediate : true
        },

        eventSorter : EventSorter.interDaySorterFn,

        localizableProperties : ['title', 'stepUnit'],

        title : 'L{Month}',

        stepUnit : 'L{monthUnit}',

        dragUnit : 'day',

        localeClass : this,

        descriptionFormat : 'MMMM YYYY',

        dayNumberCentered : null,

        /**
         * Configure as `true` to render the day name before the day number in each cell's header
         * (formatted with {@link Core.widget.CalendarPanel#config-dayNameFormat}), and hide the shared
         * weekday-name header row (`.b-calendar-week-days`) at the top of the view.
         * @prp {Boolean}
         * @default false
         */
        dayNameInCellHeader : null,

        /**
         * Configure as `false` to hide the week number shown at the top-left of each day cell
         * @prp {Boolean}
         * @default
         */
        showWeekNumber : true,

        /**
         * The height of event bars in this view. This can be a numeric value in pixels or a CSS unit measure such
         * as `'2em'`.
         *
         * Note that the default event bar height is slightly larger when the user has configured their system for
         * increased contrast to adhere to WCAG guidelines for increased target size in that mode.
         * @prp {Number|String}
         * @default 20
         */
        eventHeight : globalThis.matchMedia?.('(prefers-contrast: more)')?.matches ? 24 : 20,

        scrollable : {
            overflowY : true
        },

        /**
         * By default, weeks rows all flex to share the available height equally.
         *
         * To make them shrinkwrap their events to show all events in every row, configure this as `true`
         * @prp {Boolean}
         * @default false
         */
        autoRowHeight : {
            $config : 'lazy',
            value   : false
        },

        /**
         * By default, rows which have been modified by the {@link Calendar.feature.WeekExpander}
         * feature, __not by the {@link #config-autoRowHeight} setting__, to shinkwrap large content
         * are reset to flexed height on month change.
         *
         * To have rows persist their shrinkwrapped status across month changes, confgure this as `true`.
         *
         * If {@link #config-autoRowHeight} is set, then the new month always has auto heighted rows.
         * @prp {Boolean}
         * @default false
         */
        persistShrinkWrappedRows : null,

        /**
         * The maximum number of events to show in a cell when the row is shrinkwrapped.
         * Use this to keep rows to a sane size when using {@link #config-autoRowHeight},
         * or the {@link Calendar.feature.WeekExpander} feature.
         * @prp {Number}
         * @default
         */
        maxEventsPerCell : 100,

        /**
         * By default, week rows flex to share available Panel height equally.
         *
         * This may be configured as a number, in which case it means pixels, or a CSS length.
         *
         * The non-standard unit `ev` may also be specified to mean "events". For example
         * `'3ev'` means rows will always be three events bars (plus the day header)
         * tall.
         *
         * This is a useful config when using {@link #config-autoRowHeight}, or using
         * {@link #config-overflowClickAction} when rows may be switched to shrinkwrapping
         * their event content and may shrink in height.
         *
         * Setting this config causes the month grid to become scrollable in the `Y` axis.
         * @config {Number|String}
         */
        minRowHeight : null,

        /**
         * How the view responds to clicking on a `+n more` button in an overflowing day cell.
         *
         * The default value, `'popup'`, means that a small dialog box showing the full complement
         * of events for that cell is shown aligned to the cell.
         *
         * When set to `'expand'`, then clicking the `+n more` button causes the encapsulating
         * row to expand to accommodate all events in that row with no overflow.
         *
         * Navigating to a new month resets the row to its default, flexed height.
         * @config {'popup'|'expand'} overflowClickAction
         * @default
         */
        overflowClickAction : 'popup',

        // So that when clicking the prev and next buttons, the UI will change
        // even if a cell for the new date is present.
        alwaysRefreshOnMonthChange : true,

        /**
         * An object which describes how the event bar height in month cells should respond to changes
         * in available vertical space.
         *
         * The object keys may be
         *
         * - threshold : The minimum number of event bars which should be visible in a cell before
         *   the event bar height starts to be reduced.
         * - minHeight : The minimum event bar height to use when the threshold is reached.
         *
         * When the number of event bars visible in a cell (based on the current row height) hits the
         * threshold, from then on, further reductions in row height will cause the event bar height
         * to be reduced, but never less than the configured minHeight.
         *
         * ```javascript
         * new Calendar({
         *    ...,
         *    modes : {
         *        month : {
         *            // When the visible event bar count gets down to 3, then when the row height
         *            // shrinks, start reducing the event height, stop at a minimum of 14px
         *            responsiveEventHeight : {
         *                threshold : 3,
         *                minHeight : 14
         *            }
         *        }
         *    }
         * });
         * ```
         *
         * This may also be configured as an object whose keys are breakpoint heights (in pixels) and whose values
         * are the corresponding event heights to use when the height of the event container in a cell is less than the breakpoint.
         *
         * This allows events to use a larger height when more vertical space is available,
         * and a smaller height when space is constrained:
         *
         * ```javascript
         * new Calendar({
         *    ...,
         *    modes : {
         *        month : {
         *            // When the event container height is less than 58px, use 16px event height
         *            // When the event container height is less than 75px, use 18px event height
         *            // Otherwise, use the configured eventHeight (the default is 20px)
         *            responsiveEventHeight : {
         *                58 : 16,
         *                75 : 18
         *            }
         *        }
         *    }
         * });
         * ```
         * @config {Object<'threshold'|'minHeight', Number>|Object<Number, Number>}
         * @property {Number} threshold The minimum number of event bars which should be visible in a cell before the event bar height starts to be reduced.
         * @property {Number} [minHeight=14] The minimum event bar height to use when the threshold is reached.
         *
         */
        responsiveEventHeight : {
            $config : 'lazy',
            value   : null
        },

        testConfig : {
            eventHeight : 20
        }
    };

    static delayable = {
        syncCalendarWeekDaysWithScrollable : {
            type              : 'raf',
            cancelOutstanding : true
        },

        // Need to handle cleanup after the row collapse animation
        // in the next AF so that all scrolling has been recalculated
        // and the overflowY can be set accurately
        onAllWeekElementsFlexed : {
            type              : 'raf',
            cancelOutstanding : true
        }
    };

    onCalendarKeyDown(keyEvent) {
        const
            me                = this,
            {
                dh,
                dayTime,
                eventContentElement
            }                 = me,
            { target }        = keyEvent,
            eventCellSelector = `.${this.dayCellCls}`,
            from              = target.closest(eventCellSelector) || target,
            eventCellFocused  = from.matches(eventCellSelector),
            cellKey           = eventCellFocused ? 'date' : 'header-date',
            dateKey           = from.dataset[eventCellFocused ? 'date' : 'headerDate'],
            date              = dayTime.parseKey(dateKey);

        let incr, focusTarget;

        switch (keyEvent.key) {
            case 'ArrowUp':
                keyEvent.preventDefault();
                incr = -7;
                break;
            case 'ArrowDown':
                keyEvent.preventDefault();
                incr = 7;
                break;
            case 'ArrowLeft':
                keyEvent.preventDefault();
                incr = -1;
                break;
            case 'ArrowRight':
                keyEvent.preventDefault();
                incr = 1;
                break;
            default:
                return super.onCalendarKeyDown(keyEvent);
        }
        const
            newDate = dh.add(date, incr, 'd'),
            sibling = incr > 0 ? me.nextSibling : me.previousSibling;

        // Skip hidden, non-working days
        while (me.hiddenNonWorkingDays[dh.getDay(newDate)]) {
            dh.add(newDate, Math.sign(incr), 'd', /* clone = */false);
        }

        focusTarget = eventContentElement.querySelector(`${eventCellSelector}[data-${cellKey}="${dayTime.dateKey(newDate)}"]`);

        // If we are on the last or first cell of the view and we're part of a set of subviews
        // then we need to focus the next or previous view
        if (!focusTarget && sibling) {
            const targetDate = incr > 0 ? me.firstVisibleDate : me.lastVisibleDate;

            focusTarget = sibling.eventContentElement.querySelector(`${eventCellSelector}[data-${cellKey}="${dayTime.dateKey(targetDate)}"]`);
        }

        focusTarget?.focus();
    }

    onInternalResize(element, newWidth, newHeight, oldWidth, oldHeight) {
        // Run the responsiveEventHeight check on the new event container height
        if (oldHeight && newHeight !== oldHeight) {
            const
                me                 = this,
                { weeksElement }   = me,
                { scrollBarWidth } = DomHelper,
                {
                    overflowX,
                    overflowY
                }                  = weeksElement.style;

            me._eventsPerCell = me._eventContainerHeight = null;

            // If no scrollbar is currently visible, then avoid visible scrollbars
            // appearing momentarily during resize adjustment
            if (scrollBarWidth && !me.scrollable?.hasOverflowY) {
                weeksElement.style.overflow = 'clip';
            }
            me.updateResponsiveEventHeight();

            // In order to never see a scrollbar appearing on resize, restore
            // overflow setting after everything is done.
            if (scrollBarWidth) {
                me.requestAnimationFrame(() => {
                    weeksElement.style.overflowX = overflowX;
                    weeksElement.style.overflowY = overflowY;
                });
            }
        }

        super.onInternalResize(element, newWidth, newHeight, oldWidth, oldHeight);
    }

    get eventContainerHeight() {
        const
            me            = this,
            { classList } = me.weeksElement;

        // Must not bake the property in as zero if called during configuration.
        if (me._eventContainerHeight == null && me.isVisible && !me.isConfiguring) {
            // Rows must revert to strictly flexed heights during measuring.
            // This class uses a !important CSS rule to ensure that.
            classList.add('b-measuring-container-height');
            me._eventContainerHeight = super.eventContainerHeight;
            classList.remove('b-measuring-container-height');
        }
        return me._eventContainerHeight;
    }

    onCalendarStoreChange() {
        super.onCalendarStoreChange(...arguments);

        // Keep any shrinkwrapped rows in the correct shape
        this.syncShrinkwrappedRows();
    }

    onDateChange({ changes }) {
        // When month changes, keep any shrinkwrapped rows in the correct shape if configured to do so
        if (changes.m) {
            const
                me                = this,
                { autoRowHeight } = me;

            // If we are auto heighting rows, then it must be applied on each month change.
            if (autoRowHeight) {
                me.weekElements.forEach(({ classList }) => classList.add('b-shrinkwrapped'));
            }
            if (me.persistShrinkWrappedRows || autoRowHeight) {
                me.syncShrinkwrappedRows();
            }
            else {
                me.shrinkwrappedRows.forEach(r => me.flexWeekRow(r));
            }
        }
    }

    /**
     * Returns the resource associated with this month view when used inside a {@link Calendar.widget.ResourceView}
     * @readonly
     * @member {Scheduler.model.ResourceModel} resource
     */

    // Override from DayCellRenderer
    // Called automatically on the CellOverflow${overflowPopupTrigger} event because of callOnFunctions
    onCellOverflowGesture({ date }) {
        if (expandGestures[this.overflowClickAction.toLowerCase()]) {
            this.shrinkwrapWeekRow(date);
        }
        else {
            super.onCellOverflowGesture(...arguments);
        }
    }

    // addCellHeaderContent mutates the cellHeader DomConfig block.
    // And if we are to have a day name element, returns the DomConfig for it.
    // It's called from DayCellRenderer#getCellDomConfig
    addCellHeaderContent(cellHeader, cellData) {
        const
            me      = this,
            dayName = {
                className : {
                    'b-day-name' : true
                },
                role : 'button'
            };

        // showWeekColumn refers to the extra week number cell.
        // MonthView shows the week in the first day cell if that's *false*
        cellHeader.children = [
            cellData.visibleColumnIndex || me.showWeekColumn ? null : {
                tabIndex     : 0,
                role         : 'link',
                'aria-label' : me.L('L{Calendar.weekOfYear}', cellData.week),
                className    : 'b-week-num',
                text         : cellData.week[1]
            },
            // When configured, the day name is shown before the day number in each cell header (and
            // the shared weekday header row is hidden - see updateDayNameInCellHeader).
            me.dayNameInCellHeader ? {
                className : {
                    'b-cell-header-day-name'      : true,
                    // The full weekday name ('dddd') is the widest form, so shrink it a little to fit.
                    'b-cell-header-day-name-long' : me.dayNameFormat === 'dddd'
                },
                text : DateHelper.format(cellData.date, me.dayNameFormat)
            } : null,
            dayName
        ];

        return dayName;
    }

    updateDayNameInCellHeader(dayNameInCellHeader) {
        this.toggleCls('b-day-name-in-cell-header', dayNameInCellHeader);

        // If we are putting textual day name in week headers, push the week number into its own column
        // unless the week column is explicitly configured.
        if (!('showWeekColumn' in this.initialConfig)) {
            this.showWeekColumn = Boolean(dayNameInCellHeader);
        }

        if (!this.isConfiguring) {
            this.refresh();
        }
    }

    get shrinkwrappedRows() {
        return this.weeksElement.querySelectorAll('.b-shrinkwrapped');
    }

    get shrinkwrapRowHeights() {
        const
            me              = this,
            rowHeights      = [],
            { dh, cellMap } = me;

        me.month.eachWeek((week, [date]) => {
            let eventCount = 0;

            for (let i = 0; i < 7; i++, dh.add(date, 1, 'd', false)) {
                const cellData = cellMap.get(dh.makeKey(date));

                if (cellData) {
                    eventCount = Math.max(eventCount, cellData.renderedEvents.length);
                }
            }

            rowHeights.push(eventCount);
        });
        return rowHeights.map(maxEventCount => {
            if (maxEventCount === 0) {
                return this.oneEventRowHeight;
            }
            else {
                return me.eventHeightInPixels * maxEventCount + (me.eventSpacing * (maxEventCount + 1)) + Math.ceil(me._eventContainerTop);
            }
        });
    }

    get oneEventRowHeight() {
        const
            me = this,
            eventHeightInPixels = me.responsiveEventHeight
                ? Math.min(...Object.values(me.responsiveEventHeight))
                : me.eventHeightInPixels;

        return ((eventHeightInPixels + 1) + me.eventSpacing + Math.ceil(me.eventContainerTop));
    }

    /**
     * Returns the number of complete event bars which will fit inside the referenced cell.
     *
     * It's only in MonthView when some rows are shrinkwrapped round their event content (meaning
     * either expanded or contracted away from the 1/6 height default) that there may be a customized
     * eventsPerCell for a certain date.
     * @internal
     */
    getEventsPerCell(date) {
        const me =  this;

        if (me.hasShrinkwrappedRows) {
            const rowIndex = Math.floor(me.dateHelper.diff(me.startDate, date, 'd') / 7);

            // For a shrinkwrapped row, all events are rendered, so use the configured upper limit
            if (me.weekElements[rowIndex].classList.contains('b-shrinkwrapped')) {
                return me.maxEventsPerCell;
            }
            // If there are shrinkwrapped rows, other row heights are unpredictable.
            // Some may be flexed, but they also have a minRowHeight.
            else {
                const
                    firstCell            = me.weekElements[rowIndex].querySelector(me.visibleCellSelector),
                    eventContainerHeight = firstCell.offsetHeight - me.eventContainerTop;

                return Math.floor((eventContainerHeight + me.eventSpacing) / (me.eventHeightInPixels + me.eventSpacing));
            }
        }
        else {
            return me.eventsPerCell;
        }
    }

    getMaxEventsForWeek(week) {
        const { row } = this.getWeekContext(week);

        return Math.max(...Array.from(row.querySelectorAll(this.visibleCellSelector)).map(c => {
            const cellData = this.cellMap.get(c.dataset.date);

            return cellData?.renderedEvents.length || 0;
        }));
    }

    getWeekContext(week) {
        const
            me = this,
            { dh } = me;
        let weekStart, visibleWeekStart, rowIndex;

        // Zero-based row index used. Extract the date of its first cell
        if (typeof week === 'number') {
            rowIndex  = week;
            weekStart = dh.parseKey(me.weekElements[week].querySelector('[data-date]')?.dataset.date);
        }
        // Element passed
        else if (week.nodeType === 1) {
            weekStart = dh.parseKey(week.closest('.b-calendar-panel-row').querySelector('[data-date]')?.dataset.date);
            rowIndex  = Math.floor(dh.diff(me.startDate, weekStart, 'd') / 7);
        }
        // Date passed
        else {
            const incr = ((dh.getDay(week) - me.weekStartDay) + 7) % 7;

            weekStart = dh.add(dh.clearTime(week), -incr, 'd');
            rowIndex  = Math.floor(dh.diff(me.startDate, week, 'd') / 7);
        }

        // Step over initial hidden days. For example, US has Sunday as the week start day.
        // If that's hidden, then the Monday is the *visible* week start.
        if (weekStart) {
            visibleWeekStart = new Date(weekStart);
            while (me.hiddenNonWorkingDays[dh.getDay(visibleWeekStart)]) {
                dh.add(visibleWeekStart, 1, 'd', /* clone = */false);
            }
        }

        return {
            rowIndex,
            weekStart,
            visibleWeekStart,
            row : me.weekElements[rowIndex]
        };
    }

    /**
     * Causes the week row referenced by the parameter (Either a Date, or the **zero based** row index)
     * to size itself to exactly wrap the maximum number of events for any day of that week.
     *
     * If there are a *lot* of events, the row may grow in height. If few, or none, the row will shrink
     * in height. The day name header along the top will always be visible by default.
     *
     * The row has the CSS class `'b-shrinkwrapped'` added when it is in the shrinkwrapped state
     * to allow querying, and custom styling.
     *
     * See {@link #function-flexWeekRow} for the converse operation.
     *
     * @param {Date|Number} week Either the date of a day within the week, or the **zero based** week row
     * to shrinkwrap.
     */
    async shrinkwrapWeekRow(week, /* private */ isLastCall = true) {
        const
            me               = this,
            {
                weekStart,
                row
            }                = me.getWeekContext(week),
            {
                maxEventsPerCell,
                eventContainerTop
            } = me,
            wasShrinkwrapped = row.classList.contains('b-shrinkwrapped'),
            maxEventsForWeek = me.getMaxEventsForWeek(week),
            maxEventCount    = maxEventsPerCell ? Math.min(maxEventsPerCell, maxEventsForWeek) : maxEventsForWeek,
            shrinkwrapHeight = me.eventHeightInPixels * maxEventCount + (me.eventSpacing * (maxEventCount + 1)) + Math.ceil(eventContainerTop),
            expanded         = maxEventsForWeek > me.eventsPerCell,
            t                = row.querySelector('.b-week-toggle-tool');

        // Create, or reconfigure any existing scrollable in the read phase
        if (isLastCall) {
            me.scrollable = {
                overflowY : 'auto'
            };
        }

        // All rows get the class. It's mainly a flag to indicate that the row
        // *should* be measured and re-flexed when any data changes.
        row.classList.add('b-shrinkwrapped');

        // Empty rows do not get a calculated size
        if (row.classList.contains('b-empty-row')) {
            row.style.flex = row.style.minHeight = '';
        }
        else {
            t && (t.dataset.btip = me.L('L{WeekExpander.collapseTip}'));

            row.classList.remove('b-has-overflow');

            // We need to know if it's expanded
            row.classList.toggle('b-expanded', expanded);

            // If we need to expand, grow and shrink must be 0.
            // If it was not a full row, it's allowed to grow.
            row.style.flex = expanded ? `0 0 ${shrinkwrapHeight}px` : `1 0 ${shrinkwrapHeight}px`;
            row.style.minHeight = `${Math.max(shrinkwrapHeight, (this.minRowHeight || 0))}px`;
        }

        // Keep a flag so that our getEventsPerCell(date) can shortcut is answer
        // if all rows are evenly flexed without having to query.
        me.hasShrinkwrappedRows = true;

        // Refresh content before it achieves its new height.
        // Content will be revealed by the transition.
        if (isLastCall) {
            me.refresh();
        }

        /**
         * This event is fired as soon as a week row is requested to be shrinkwrapped.
         *
         * It's not called if we are just re-synching the height of shrinkwrapped rows
         * which needs to be done if the shape of the data changes.
         *
         * The animated transition to the new height will still be in progress, but the row's
         * flex style is set to its calculated height.
         *
         * To wait until the animated transition is finished, use the Promise returned
         * from {@link #function-shrinkwrapWeekRow}
         *
         * ```javascript
         *     monthView.shrinkwrapWeekRow(0).then() => Toast.show('Row zero shrinkwraps event content);
         * ```
         * @event weekShrinkwrap
         * @param {Date} weekStart The start date of the week being shrinkwrapped.
         * @param {HTMLElement} element The week row being shrinkwrapped.
         */
        if (!wasShrinkwrapped) {
            me.trigger('weekShrinkwrap', {
                weekStart,
                element : row
            });
        }

        // Sets the flag class on the widget which warns all and sundry that styles may be in flux.
        if (isLastCall) {
            if (!me.isAnimating) {
                me.isAnimating = true;
            }

            await me.executeAndAwaitAnimations(me.weeksElement);

            me.onAllWeekElementsExpanded?.();
        }
    }

    onAllWeekElementsExpanded() {
        this.isAnimating = false;
        // Account for any scrollbar.
        // The call from the refresh in shrinkwrapWeekRow will find that there is no overflow yet
        // due to animated nature of expansion. We must check when expansion has finished.
        this.syncCalendarWeekDaysWithScrollable();
    }

    /**
     * Causes the week row referenced by the parameter (Either a Date, or the **zero-based** row index)
     * to become flexed in height to share the available height of the Calendar equally with other
     * flexed rows.
     *
     * See {@link #function-shrinkwrapWeekRow} for the converse operation.
     *
     * @param {Date|Number} date Either the date of a day within the week, or the **zero based** week row
     * to flex.
     */
    async flexWeekRow(date, /* private */ isLastCall = true, allRows = false) {
        const
            me = this,
            {
                weekStart,
                row
            }  = me.getWeekContext(date),
            t  = row.querySelector('.b-week-toggle-tool');

        if (row.classList.contains('b-shrinkwrapped')) {
            // Week will transition back to flex-basis : 1/6 * 100% from CSS
            row.style.flex = row.style.minHeight = '';
            row.classList.add('b-flexing');
            t && (t.dataset.btip = this.L('L{WeekExpander.expandTip}'));

            /**
             * This event is fired as soon as a week row is requested to be flexed. The animated
             * transition to the new height will still be in progress, but the row's flex style is
             * set to its evenly shared flex value.
             *
             * To wait until the animated transition is finished, use the Promise returned
             * from {@link #function-flexWeekRow}
             *
             * ```javascript
             *     monthView.flexWeekRow(0).then() => Toast.show('Row zero flexed);
             * ```
             * @event weekFlex
             * @param {Date} weekStart The start date of the week being reverted to a flexed height.
             * @param {HTMLElement} element The week row being reverted to a flexed height.
             */
            me.trigger('weekFlex', {
                weekStart,
                element : row
            });

            // Set the underlying property. We do not want to trigger a full switch to all flexed.
            me._autoRowHeight = false;

            // Sets the flag class on the widget which warns all and sundry that styles may be in flux.
            if (isLastCall && !me.isAnimating) {
                me.isAnimating = true;
            }
            await me.executeAndAwaitAnimations(me.weeksElement);

            if (isLastCall) {
                me.onAllWeekElementsFlexed(row, allRows);
            }
            // If we are inside the loop which is flexing all rows, we must not call the single week handler
            // The CSS classes which indicate row sizing must be fixed at the end.
            else if (!allRows) {
                me.onWeekElementFlexed(row);
            }
        }
    }

    onWeekElementFlexed(weekElement) {
        weekElement.classList.remove('b-shrinkwrapped', 'b-flexing', 'b-expanded');
    }

    onAllWeekElementsFlexed(weekElement, allRows) {
        const me = this;

        // Reconfigure any existing scrollable.
        me.scrollable.overflowY = me.scrollable.hasOverflow('y');

        // If we are flexing *all* rows, ensure they are all fixed.
        if (allRows) {
            me.shrinkwrappedRows.forEach(r => r.classList.remove('b-shrinkwrapped', 'b-flexing', 'b-expanded'));
        }
        else {
            weekElement.classList.remove('b-shrinkwrapped', 'b-flexing', 'b-expanded');
        }

        // Fire animationEnd event after element classes have been fixed up.
        me.isAnimating = false;

        // Keep a flag so that our getEventsPerCell(date) can shortcut is answer
        // if all rows are evenly flexed without having to query.
        me.hasShrinkwrappedRows = me.shrinkwrappedRows.length;

        // Refresh after the height shrink animation has ended.
        // Old, overflowing data will be clipped. The visual effect will just be
        // the +n more appearing
        me.refresh();

        // Account for any scrollbar.
        // The call from the refresh in flexWeekRow will find that there is still overflow
        // due to animated nature of collapse. We must check when collapse has finished.
        me.syncCalendarWeekDaysWithScrollable();
    }

    // The header must allow a scrollbar width if the platform displays scrollbars
    syncCalendarWeekDaysWithScrollable() {
        this.weekdaysHeader.classList[this.scrollable?.hasScrollbar() ? 'add' : 'remove']('b-show-yscroll-padding');
    }

    updateHideOtherMonthCells() {
        super.updateHideOtherMonthCells(...arguments);
        this.refresh();
    }

    updateEventHeight(height, oldHeight) {
        const me = this;

        me._eventContainerHeight = null;

        // Must call super first to set eventHeightInPixels
        super.updateEventHeight(height, oldHeight);

        if (me.isConfiguring) {
            return me.ion({
                paint : 'ensureMinRowHeight',
                once  : true
            });
        }
        else {
            // If the minRowHeight is expressed in evs, it has to be reavaluated.
            if (me.minRowHeight?.match?.(evRegexp)) {
                me.updateMinRowHeight(me._minRowHeight);
            }
            // Keep any shrinkwrapped rows in the correct shape
            me.syncShrinkwrappedRows();

            // We cannot set minHeight on a calendar view. The view *itself* must scroll its weeksContainer.
            // Its day header must stay visible, so we set the minRowHeight.
            me.ensureMinRowHeight();

            /**
             * This event is fired when the event height changes due to resizing of the view
             * and the application of {@link #config-responsiveEventHeight}.
             *
             * @event eventHeightChange
             * @param {Number} height The new event height.
             * @param {Number} oldHeight The previous event height.
             */
            me.trigger('eventHeightChange', { height, oldHeight });
        }
    }

    ensureMinRowHeight() {
        // We need to ensure that there is always room for at least two events + spacing in the row
        // by setting twoEventRowHeight to accommodate two events at the current event height.
        // Empty rows in an autoRowHeight month are sized to a one event row height.
        const
            { style }           = this.element,
            eventHeightInPixels = this.responsiveEventHeight ? Math.min(...Object.values(this.responsiveEventHeight)) : this.eventHeightInPixels,
            oneEventRowHeight   = this.oneEventRowHeight,
            twoEventRowHeight   = oneEventRowHeight + eventHeightInPixels + this.eventSpacing;

        style.setProperty('--bi-one-event-row-height', `${oneEventRowHeight}px`);
        style.setProperty('--bi-two-event-row-height', `${twoEventRowHeight}px`);
    }

    calculateEventHeightBreakpoints(threshold, minEventheight = 14, step = 1) {
        this.getConfig('eventHeight'); // Ensure configuredEventHeight is set
        const
            breakpoints = {},
            {
                eventSpacing,
                configuredEventHeightInPixels
            }           = this;

        for (let eventHeight = minEventheight; eventHeight < configuredEventHeightInPixels; eventHeight += step) {
            // Calculate what eventContainerHeight is necessary to show the threshold number of events
            // at each eventHeight from minEventHeight up to configuredEventHeightInPixels - 1
            const eventContainerHeight =
                eventHeight  * threshold +
                eventSpacing * (threshold + 1);

            breakpoints[eventContainerHeight] = eventHeight;
        }

        return breakpoints;
    }

    changeResponsiveEventHeight(responsiveEventHeight) {
        if (responsiveEventHeight.threshold) {
            return this.calculateEventHeightBreakpoints(
                responsiveEventHeight.threshold,
                responsiveEventHeight.minHeight,
                responsiveEventHeight.step
            );
        }
        return responsiveEventHeight;
    }

    updateResponsiveEventHeight() {
        const
            me                        = this,
            eventSpace                = Math.floor(me.eventContainerHeight),
            { responsiveEventHeight } = me;

        // Prevent any row height transitions while we adjust event height
        // This is called during change of height which will be under user control
        // and will not look good with row height transitions in play.
        DomHelper.addTemporaryClass(me.element, 'b-notransition');

        if (responsiveEventHeight) {
            for (const breakpoint of Object.keys(responsiveEventHeight)) {
                if (eventSpace < breakpoint) {
                    me.adjustEventHeight(responsiveEventHeight[breakpoint]);
                    return;
                }
            }
        }
        // Revert to initial event height if no breakpoints matched
        // Need to set the isUpdatingEventHeight flag to signal that this is not
        // the original value, or an app-initiated change, so the configuredEventHeight
        // is not updated.
        me.adjustEventHeight(me.configuredEventHeight || me.constructor.configurable.eventHeight);
    }

    adjustEventHeight(eventHeight) {
        // When we adjust it here, we do not want to update configuredEventHeight
        // as this is not a app-initiated change.
        this.isAdaptingEventHeight = true;
        this.eventHeight = eventHeight;
        this.isAdaptingEventHeight = false;
    }

    updateMinRowHeight(minRowHeight) {
        const
            me         = this,
            eventCount = parseInt(minRowHeight?.match?.(evRegexp)?.[1]);

        // See if they configured it in evs which is our own "CSS" units meaning events
        if (!isNaN(eventCount)) {
            if (me.isConfiguring) {
                return me.ion({
                    paint : 'updateMinRowHeight',
                    args  : [minRowHeight],
                    once  : true
                });
            }
            minRowHeight = me.eventHeightInPixels * eventCount + (me.eventSpacing * (eventCount + 1)) + Math.ceil(me.eventContainerTop);
        }

        super.updateMinRowHeight(minRowHeight);

        // If we are in the middle of a flexWeekRow or shrinkwrapWeekRow animation
        // We cannot do this as it needs to measure a final value
        if (me.isAnimating) {
            me.ion({
                animationEnd : 'performResizeRefresh',
                thisObj      : me,
                args         : [me._eventsPerCell, me._eventContainerTop],
                once         : true
            });
        }
        else {
            // Calculates new values for eventsPerCell and eventContainerTop
            // and handles changes to either.
            me.performResizeRefresh(me._eventsPerCell, me._eventContainerTop);
        }
    }

    changeMonth(month, oldMonth) {
        month = super.changeMonth(month, oldMonth);

        // The Month must compute its day metadata (day, key, tomorrow, week) in this view's day frame
        // (timezone-aware when a timezone is active). CalendarPanel does not do this because the
        // DatePicker — also CalendarPanel based — is deliberately a machine-local wall-clock widget.
        if (month?.isMonth) {
            month.owner = this;
        }

        return month;
    }

    changeMaxEventsPerCell(maxEventsPerCell) {
        return maxEventsPerCell == null ? this.constructor.configurable.maxEventsPerCell : maxEventsPerCell;
    }

    updateMaxEventsPerCell() {
        if (!this.isConfiguring) {
            this.syncShrinkwrappedRows();
        }
    }

    async updateAutoRowHeight(autoRowHeight, wasAutoRowHeight) {
        // The change from undefined to false during initialization is a noop.
        if (this.initializingAutoRowHeight && autoRowHeight === Boolean(wasAutoRowHeight)) {
            return;
        }

        const
            me                   = this,
            { visibleWeekCount } = me,
            weekExpander         = (me.features || me.calendar?.features)?.weekExpander;

        let finalPromise;

        // Disable WeekExpander *before*() we shrinkwrap so that the WeekExpander's
        // UI disappears immediately.
        if (weekExpander && autoRowHeight) {
            weekExpander.disabled = weekExpander.disabledByAutoRowHeight = true;
        }

        me.weeksElement.classList.toggle('b-auto-row-height', Boolean(autoRowHeight));

        // Either shrinkwrap or reset to flex all week rows.
        // autoRowHeight disables weekExpander and decides row heights.
        if (autoRowHeight) {
            for (let i = 0; i < visibleWeekCount; i++) {
                finalPromise = me.shrinkwrapWeekRow(i, i === visibleWeekCount - 1);
            }
        }
        else {
            for (let i = 0; i < visibleWeekCount; i++) {
                finalPromise = me.flexWeekRow(i, i === visibleWeekCount - 1, true);
            }
        }

        // Wait for the last row to finish.
        await finalPromise;

        // Re-enable *after* collapsing so that WeekExpander UI only
        // appears if needed.
        if (weekExpander && autoRowHeight && weekExpander.disabledByAutoRowHeight) {
            weekExpander.disabled = weekExpander.disabledByAutoRowHeight = false;
        }

        // Will need to redraw when we reach all flexed row heights because
        // the eventsPerCell will need to be recalculated
        if (!autoRowHeight) {
            me._eventContainerHeight = me._eventsPerCell = null;
            me.refresh();
        }
    }

    // When data changes or eventHeight changes, any shrinkwrapped rows need to be
    // kept in the correct shape;
    syncShrinkwrappedRows() {
        if (this.isVisible) {
            // A row which is animating back to a flexed height keeps the b-shrinkwrapped class until the
            // transition ends, so it is still reported as shrinkwrapped. Shrinkwrapping it again here would
            // restore the inline height it is in the middle of discarding, leaving it tall but showing only
            // the few events a flexed row renders.
            const shrinkwrappedRows = Array.from(this.shrinkwrappedRows).filter(isNotFlexing);

            for (let i = 0, length = Math.min(shrinkwrappedRows.length, this.visibleWeekCount); i < length; i++) {
                this.shrinkwrapWeekRow(shrinkwrappedRows[i], i === length - 1);
            }
        }
        else {
            // In case the data changed while the view was not visible
            // ensure the refresh happens *before* the shrinkwrap is applied.
            this.whenVisible('refreshNow');
            this.whenVisible('syncShrinkwrappedRows');
        }
    }

    changeScrollable(scrollable, oldScrollable) {
        scrollable = super.changeScrollable(scrollable, oldScrollable);

        if (scrollable?.overflowX) {
            // Create a Scroller to scroll the day header's X axis in sync with the month grid
            this.weekdaysScrollable || (this.weekdaysScrollable = new Scroller({
                widget    : this,
                element   : this.weekdaysHeader,
                overflowX : 'hidden-scroll'
            }));
            scrollable.addPartner(this.weekdaysScrollable, 'x');
        }

        return scrollable;
    }

    async scrollTo(target, options) {
        const
            me                 = this,
            { dh, scrollable } = me,
            targetDate         = typeof target === 'string' ? dh.parse(target) : new Date(target),
            targetIsDate       = !isNaN(targetDate);

        await me.scrollPromise;

        // Component might get destroyed by the time promises above get resolved
        if (me.isDestroyed) {
            return;
        }

        // CalendarMixin knows how to do this.
        // If it's a Date It must not scroll; we do that below unless disabled.
        await super.scrollTo(targetIsDate ? targetDate : target, { x : false, y : false });

        // Scrollable will only exist only if minColumnWidth or minRowHeight is set
        if (targetIsDate && scrollable) {
            // We may have moved to a new date above, so ingest the visible range after that.
            const { firstVisibleDate, lastVisibleDate } = me;

            lastVisibleDate.setHours(23, 59, 59);
            targetDate.setTime(dh.clamp(targetDate, firstVisibleDate, lastVisibleDate));

            // Dodge being asked to scroll to hidden days, eg filtered out dates, or hidden non working days
            let incr = dh.getDay(targetDate) === (me.weekStartDay + 6) % 7 ? -1 : 1;
            while (!DomHelper.isVisible(me.getDayElement(targetDate))) {
                // If we walked off either end of the range, flip direction
                if (targetDate < firstVisibleDate || targetDate > lastVisibleDate) {
                    incr = -incr;

                    // Flipped direction a second time - no visible day found
                    if (incr < 0) {
                        return;
                    }
                }
                dh.add(targetDate, incr, 'd', /* clone = */false);
            }

            target = me.getDayElement(targetDate);
            if (target) {
                scrollable.scrollIntoView(target, ObjectHelper.assign({}, me.defaultScrollOptions, typeof options == 'boolean' ? { animate : options } : options));
            }
        }
    }

    collectEvents(options) {
        if (this.hideOtherMonthCells) {
            const
                { year, month } = this.month,
                { dh } = this;

            // use strict bounds of the month, not of the cells in the UI.
            // The "other month" cells in the UI are not visible in this mode.
            options.startDate = dh.create({ year, month, date : 1 });
            options.endDate   = dh.create({ year, month : month + 1, date : 1 });
        }

        // Only the first *visible* cell needs overflows flowing into it.
        // from after that, propagateCellEvents copies events forward, so
        // the getEvents will use the "startDate" index to extract events for a date.
        options.getDateIndex = date => Number(date) === Number(this.firstVisibleDate || this.startDate) ? 'date' : 'startDate';

        return super.collectEvents(options);
    }

    getDayElement(date, strict) {
        if (typeof date !== 'string') {
            date = this.dateHelper.makeKey(date);
        }

        // Enforce strict meaning this view must own that date.
        // month.month is the *zero based* index that the Date class uses.
        if (strict && parseInt(date.substr(5, 2)) !== this.month.month + 1) {
            return;
        }

        return super.getDayElement(date);
    }

    /**
     * Determines what is under the cursor of the specified event or what is described by the given element.
     * @param {Event|Element} domEvent The event or element
     * @returns {CalendarHit}
     */
    calendarHitTest(domEvent) {
        const
            hit = super.calendarHitTest(domEvent),
            target = DomHelper.getEventElement(domEvent);

        if (hit) {
            // Two levels of disabling other month cells.
            // Disabled means they are visible but unresponsive.
            // hidden means they are invisible
            if (this.dateHelper.getMonth(hit.date) !== this.month.month && (this.disableOtherMonthCells || this.hideOtherMonthCells)) {
                return;
            }

            const
                weekElement = target.closest('.b-calendar-week'),
                week = weekElement?.dataset.week?.split(',').map(Number);

            if (week) {
                hit.cell = hit.cell || target.closest('.b-calendar-cell');
                hit.dayNumber = Number(hit.cell?.dataset.columnIndex);
                hit.week = week;
                hit.weekElement = weekElement;
                hit.weekNumber = week[1];
                hit.weekOffset = week[1] - Number(this.weeksElement.firstElementChild.dataset.week.split(',')[1]);
            }
        }

        return hit;
    }

    getDateFromPosition(clientX, clientY) {
        const
            me = this,
            weekEls = me.weeksElement.childNodes;

        for (let rect, i = 0; i < weekEls.length; ++i) {
            rect = weekEls[i].getBoundingClientRect();

            if (rect.top <= clientY && clientY < rect.bottom) {
                if (rect.left <= clientX && clientX < rect.right) {
                    const
                        dx     = me.rtl ? rect.right - clientX : clientX - rect.x,
                        column = Math.floor(dx * me.weekLength / rect.width);

                    // Some days may be hidden.
                    if (me.hideNonWorkingDays) {
                        const cellDates = Array.from(weekEls[i].querySelectorAll(me.visibleCellSelector)).map(e => me.getDateFromElement(e));
                        return cellDates[column];
                    }
                    else {
                        const date = me.getDateFromElement(weekEls[i].querySelector(me.visibleCellSelector));
                        return me.dateHelper.add(date, column, 'd');
                    }
                }
            }
        }

        return null;
    }

    /**
     * Determines the week container element of the specified event or the given element.
     * @param {Event|Element} domEvent The event or element
     * @returns {Element}
     * @internal
     */
    getWeekElementFor(domEvent) {
        const target = DomHelper.getEventElement(domEvent);

        return target?.closest('.b-calendar-week') || null;
    }

    updateEventStore(eventStore, was) {
        super.updateEventStore?.(eventStore, was);

        // Create the empty cell structure before the first refresh with data
        // so that boilerplate elements may be measured.
        this.doEmptyRefresh();
    }

    updateOverflowClickAction() {
        this.refresh();
    }

    updateSixWeeks() {
        // Invalidate the values so that they are recalculated in the superclass's refresh
        this._eventsPerCell = this._eventContainerTop = this._eventContainerHeight = null;

        super.updateSixWeeks(...arguments);
    }

    onMonthDateChange({ changes }) {
        // Month's row count with respect to the sixWeeks setting has changed...
        if (changes.r && !this.sixWeeks) {
            // Invalidate the values so that they are recalculated in the superclass's refresh
            this._eventsPerCell = this._eventContainerTop = this._eventContainerHeight = null;
        }

        super.onMonthDateChange(...arguments);
    }

    doRefresh() {
        const me = this;

        // Only ingest and process autoRowHeight when we have visibility
        if (!me.isConfiguring) {
            me.getConfig('autoRowHeight');
            me._cellMap?.clear();
        }

        const result = super.doRefresh();

        // Mark rows with no events. These are willing to flex-shrink to a CSS-defined minimum
        for (let i = 0, { length } = me.weekElements; i < length; i++) {
            const
                row = me.weekElements[i],
                maxEvents = Array.prototype.reduce.call(row.querySelectorAll(me.visibleCellSelector), (result, cell) => {
                    const cellData = me.cellMap.get(cell.dataset.date);

                    return result + (cellData?.renderedEvents.length || 0);
                }, 0);

            row.classList.toggle('b-empty-row', !maxEvents);
        }

        // Account for any scrollbar
        me.syncCalendarWeekDaysWithScrollable();

        return result;
    }

    showEvent(eventRecord) {
        this.setDate(eventRecord.startDate);
    }

    changeDayNumberCentered(dayNumberCentered) {
        return Boolean(dayNumberCentered);
    }

    updateShowWeekColumn(showWeekColumn) {
        // If we are hiding the week column and we never created any in-cell week number
        // elements (They are not rendered if not required), we have to refresh to get them.
        if (!showWeekColumn && !this.element.querySelector('.b-week-num')) {
            this.doRefresh();
        }

        super.updateShowWeekColumn(showWeekColumn);
    }

    updateShowWeekNumber(showWeekNumber) {
        this.element.classList.toggle('b-show-week-number', showWeekNumber);
    }

    updateHideNonWorkingDays(hideNonWorkingDays) {
        super.updateHideNonWorkingDays?.(hideNonWorkingDays);

        // Widths will change, so a refresh is needed.
        if (!this.isConfiguring) {
            this.refresh();
        }
    }

    updateDayNumberCentered(dayNumberCentered) {
        const me = this;

        // First time we flip to center, cache was the week number showing was
        // so that we can restore it.
        if (!me._dayNumberCentered && !('nonCenteredDayNumShowWeekColumn' in me)) {
            me.nonCenteredDayNumShowWeekColumn = me.showWeekColumn;
        }
        me._dayNumberCentered = dayNumberCentered;
        me.toggleCls('day-number-center', dayNumberCentered);

        // Centered day number with week number inside the cell header looks bad.
        me.showWeekColumn = dayNumberCentered ? true : me.nonCenteredDayNumShowWeekColumn;
    }

    get dayNameSelector() {
        return this.showWeekColumn ? '.b-cal-cell-header' : super.dayNameSelector;
    }

    set dayNameSelector(dayNameSelector) {
        this._dayNameSelector = dayNameSelector;
    }

    set startDate(date) {
        this.date = date;
    }

    get startDate() {
        return super.startDate;
    }

    next() {
        this.date = this.dateHelper.add(this.date || this.startDate, 1, 'month');
    }

    previous() {
        this.date = this.dateHelper.add(this.date || this.startDate, -1, 'month');
    }
}

MonthView.initClass();
