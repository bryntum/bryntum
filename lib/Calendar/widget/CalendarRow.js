import Widget from '../../Core/widget/Widget.js';
import DayCellCollecter from './mixin/DayCellCollecter.js';
import CalendarMixin from './mixin/CalendarMixin.js';
import DayCellRenderer from './mixin/DayCellRenderer.js';
import EventSlots from '../util/EventSlots.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import DayTime from '../../Core/util/DayTime.js';
import Scroller from '../../Core/helper/util/Scroller.js';
import Objects from '../../Core/helper/util/Objects.js';
import DateRangeOwner from './mixin/DateRangeOwner.js';
import AsyncHelper from '../../Core/helper/AsyncHelper.js';

DomHelper.loadStylesheet('Calendar/widget/CalendarRow.css');

// import Stylesheet from './CalendarRow.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'CalendarRow');

/**
 * @module Calendar/widget/CalendarRow
 */

const
    expandGestures = {
        shrinkwrap : 1,
        expand     : 1
    },
    formatDayPart = (dh, format, sep, d1, d2, compress) => {
        const s1 = dh.format(d1, format);

        return d2 ? `${s1}${compress ? sep.trim() : sep}${dh.format(d2, format).slice(compress ? -1 : 0)}` : s1;
    };

/**
 * This is normally used as the "All day events" section of a {@link Calendar.widget.DayView} or
 * {@link Calendar.widget.WeekView}. But it may be used standalone as a regular Widget.
 *
 * As a standalone widget, it will lack the capabilities of the {@link Calendar.view.Calendar}
 * class, such as keyboard-based event to event navigation and drag/drop features.
 *
 * A Widget which displays a single row of calendar cells for a configured range of dates.
 *
 * Cell rendering can be customized using the {@link #config-dayCellRenderer} method.
 *
 * Event rendering can be customized using the {@link #config-eventRenderer} method.
 *
 * When used inside a Calendar, the all day events row at the top of a DayView or WeekView is a
 * CalendarRow. It can be configured through the {@link Calendar.widget.DayView#config-allDayEvents} config:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     modes : {
 *         week : {
 *             allDayEvents : {
 *                 // Configure how overflow is handled
 *                 overflowClickAction : 'popup',
 *                 // Customize the day header
 *                 dayHeaderRenderer(cellData, domConfig) {
 *                     return `${cellData.date.getDate()} ${cellData.isNonWorking ? '(off)' : ''}`;
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ## Useful configs
 *
 * | Config                               | Description                             |
 * |--------------------------------------|-----------------------------------------|
 * | {@link #config-defaultEventRowCount} | Max visible event rows before overflow  |
 * | {@link #config-autoHeight}           | Grow to accommodate all events          |
 * | {@link #config-overflowPopup}        | Config for the overflow popup           |
 * | {@link #config-overflowClickAction}  | Action when clicking overflow indicator |
 * | {@link #config-eventRenderer}        | Custom renderer for event bars          |
 *
 * ## See also
 *
 * - {@link Calendar.widget.DayView#config-allDayEvents} — Config that creates this row in a DayView
 * - {@link Calendar.widget.OverflowPopup} — Popup shown when events overflow a cell
 * - {@link Calendar.widget.DayResourceCalendarRow} — Subclass used in resource-grouped views
 *
 * @extends Core/widget/Widget
 * @mixes Core/widget/mixin/Responsive
 * @mixes Calendar/widget/mixin/DayCellRenderer
 * @mixes Calendar/widget/mixin/CalendarMixin
 * @mixes Calendar/widget/mixin/DateRangeOwner
 * @mixes Calendar/widget/mixin/DayCellCollecter
 * @classtype calendarrow
 * @tier community
 * @calendarview
 */
export default class CalendarRow extends Widget.mixin(
    CalendarMixin, DayCellCollecter, DayCellRenderer, DateRangeOwner
) {
    static $name = 'CalendarRow';

    // Factoryable type name
    static type = 'calendarrow';

    static configurable = {
        cls : 'b-calendar-days',

        dragUnit : 'day',

        /**
         * Set this to `false` to not use transition for this Widget as it changes height
         *
         * @config {Boolean}
         * @default
         */
        animate : true,

        /**
         * By default, this widget displays a maximum of {@link #config-defaultEventRowCount} events
         * before showing overflow indicators, and becoming {@link #function-toggleExpandCollapse expandable}.
         *
         * Configuring this as `true` makes this widget accommodate all events with no overflow.
         * @config {Boolean}
         */
        autoHeight : null,

        // Used by YearPlannerRow. Indicates that this has a fixed height dictated by
        // layout or configuration, and its height is not derived from a number
        // of event bars in the way it is in the all day row of a DayView
        fixedHeight : null,

        autoRefresh : [
            'dayNameFormat',
            'dayNumberCompress',
            'dayNumberFormat',
            'daySeparator',
            'hideEmptyDays',
            'dateFilter'
        ],

        descriptionFormat : [true, true],

        /**
         * Either the start hour of the day, or a *24 hour* `HH:MM` string denoting the start of the first rendered
         * daily time block.
         *
         * @config {String|Number}
         * @default 0
         */
        dayStartShift : null,

        dayTime : 0,

        /**
         * The number of events to show to define the height of this widget by default if this widget
         * {@link #config-autoHeight} is *not* defined as `true`. The widget may be expanded to accommodate all
         * the events if there are overflowing events.
         * @config {Number}
         * @default
         */
        defaultEventRowCount : 3,

        /**
         * When `true`, a full week of dates is rendered for a single day range. This should not be applied when
         * the `duration` spans multiple days.
         * @prp {Boolean}
         */
        fullWeek : null,

        /**
         * By default, the day columns flex to all fit within the width of this widget.
         *
         * configuring a `minDayWidth` means that if the day columns do not fit within this
         * widget's width, it becomes horizontally scrollable.
         * @config {Number}
         */
        minDayWidth : null,

        scrollable : {
            overflowX     : 'hidden',
            overflowY     : 'hidden',
            propagateSync : true
        },

        headerScroller : {
            $config : ['lazy', 'nullify'],
            value   : {
                overflowX     : 'hidden',
                overflowY     : 'hidden',
                propagateSync : true
            }
        },

        /**
         * The {@link Core.helper.DateHelper} format string/function for day names (e.g., "ddd" for "Mon", "Tue", ...)
         * @config {String|Function}
         * @param {Date} date The date to format.
         * @returns {String} The formatted date.
         * @default
         */
        dayNameFormat : 'ddd',

        /**
         * Specify `true` to textually compress day number pairs. For example, compress "11/12" to "11/2". Also
         * when `true`, the {@link #config-daySeparator} is trimmed of any whitespace.
         * @config {Boolean}
         * @default false
         */
        dayNumberCompress : null,

        /**
         * The {@link Core.helper.DateHelper} format string for day numbers (e.g., "D" for "9", "10", ...)
         * @config {String}
         * @default
         */
        dayNumberFormat : 'D',

        /**
         * The separator between day names and numbers. If a single string is provided, it applies to both day
         * names and day numbers. If an array of 2 strings is provided, the [0] element is the separator for day
         * names and [1] element is the separator for day numbers.
         * @config {String|String[]}
         */
        daySeparator : '-',

        responsive : {
            small : {
                // dayNameFormat     : 'd1/d1',
                // dayNumberFormat   : 'D/D',
                dayNameFormat     : 'dd',
                dayNumberCompress : true,
                daySeparator      : '/'
            },

            '*' : {
                // dayNameFormat     : 'ddd-ddd',
                // dayNumberFormat   : 'D-D',
                dayNameFormat     : 'ddd',
                dayNumberCompress : false,
                daySeparator      : '-'
            }
        },

        dayNameSelector : '.b-cal-cell-header',

        // We need to read our height during refresh, so to avoid having to measure, monitor our own size.
        monitorResize : true,

        /**
         * How much extra space in pixels or other DOM units to allow below the event bars to
         * facilitate drag-create gestures.
         * @config {Number|String}
         * @default
         */
        gutterHeight : null,

        /**
         * Set to `true` to show all events, sized by content. Collapse with {@link #function-toggleExpandCollapse}.
         * Has no effect when {@link #config-autoHeight} is set, which always shows all events.
         * @config {Boolean}
         */
        expanded : null,

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

        /**
         * A function, or name of a function which is passed the {@link DomConfig} object which
         * will be used to sync with a day cell header.
         *
         * ```javascript
         * dayHeaderRenderer : function(cellData, headerDomConfig) {
         *     if (this.isSpecialDate(cellData.date)) {
         *         headerDomConfig.className['b-is-special-date'] = 1;
         *
         *         // Add to the content element's children
         *         headerDomConfig.children.push({
         *             text : 'Special day',
         *             className : 'b-special-day
         *         });
         *     }
         * }
         * ```
         *
         * The result is used to sync the DOM of the day column.
         *
         * {@note}When working with text content from user data or events, ensure any HTML is encoded using
         * {@link Core.helper.StringHelper#function-encodeHtml-static StringHelper.encodeHtml()} to prevent
         * XSS vulnerabilities.{/@note}
         *
         * @config {Function|String} dayHeaderRenderer
         * @param {DayCell} cellData A `DayCell` object that contains data about the cell.
         * @param {DomConfig|Object} headerDomConfig A {@link DomConfig} config object which is used to sync the day header element.
         * @param {Object} headerDomConfig.className An object who's truthy property names will be applied as class names.
         * @param {Object} headerDomConfig.style A CSS style definition object.
         * @param {Object} headerDomConfig.dataset The DOM data properties to set.
         * @param {DomConfig[]} headerDomConfig.children The {@link DomConfig} definitions the header content.
         *   There will be 2 `children` encapsulating the day name and the date.
         * @returns {String}
         */
        dayHeaderRenderer : null,

        /**
         * Configure this as `true` to hide day columns which contain no events.
         *
         * {@note}Use with care. This may result in no day columns being rendered
         * for completely empty time ranges.{/@note}
         * @prp {Boolean}
         * @default false
         */
        hideEmptyDays : null,

        /**
         * A callback function which an application may provide to filter out day columns for
         * individual dates.
         * @prp {Function|String} dateFilter A function, or the name of a function in the ownership hierarchy.
         * @param {DayCell} context Information about the day column to be created.
         * @returns {Boolean} Return `false` to not display a column for the passed date.
         */
        dateFilter : null,

        /**
         * Configure this property as `true` to show the day name and date headers in a more compact style.
         *
         * When this is set, the day name and date are displayed side by side instead of on separate lines
         * and with a smaller font size.
         *
         * This applies the `b-compact-header` CSS class to this widget which may be styled as required.
         * @prp {Boolean}
         * @default false
         */
        compactHeader : null,

        /**
         * The CSS class to apply to the header element for this view's {@link #property-date}.
         * @config {String}
         * @default
         */
        selectedDateCls : 'b-selected-date',

        /**
         * A function, or name of a function which is called to render custom content in the row header area
         * (the prefix element before day cells). This enables displaying row labels, month names, or other
         * row-specific information.
         *
         * The function should populate the `prefixDomConfig` object with children and other properties
         * to define the header content.
         *
         * ```javascript
         * rowHeaderRenderer(prefixDomConfig, calendarRow) {
         *     prefixDomConfig.children = {
         *         label : {
         *             tag       : 'div',
         *             className : 'my-row-label',
         *             text      : 'Week ' + calendarRow.weekNumber
         *         }
         *     };
         * }
         * ```
         *
         * See {@link Calendar.widget.YearPlanner#function-renderRowHeader} for the YearPlanner implementation
         * which displays month names and expand buttons.
         *
         * @config {Function|String} rowHeaderRenderer
         * @internal
         * @param {DomConfig|Object} prefixDomConfig A {@link DomConfig} object to be synced with the prefix element.
         *   Populate its `children`, `className`, `dataset`, and `style` properties to define the header content.
         * @param {Calendar.widget.CalendarRow} calendarRow The CalendarRow instance being rendered
         */
        rowHeaderRenderer : null
    };

    static delayable = {
        afterUpdateMinDayWidth : {
            type              : 'raf',
            cancelOutstanding : true
        }
    };

    /**
     * A Promise which will be in _Pending_ state only when the `minHeight` is animating to a new value.
     * @member {Promise} heightAnimation
     */
    heightAnimation = Promise.resolve;

    get prefixDomConfig() {
        return {
            className : {
                'b-calendar-row-prefix' : 1
            },
            reference : 'prefixElement'
        };
    }

    compose() {
        const
            me                    = this,
            { rowHeaderRenderer } = me,
            prefixElement         = rowHeaderRenderer ? me.prefixDomConfig : null,
            result                = {
                class : {
                    'b-has-row-header' : rowHeaderRenderer
                },
                children : {
                    prefixElement,
                    headerElement : {
                        className : 'b-calendar-row-header',
                        children  : {
                            headerCellContainer : {
                                role      : 'row',
                                tabIndex  : -1, // Prevent screen reader from over-announcing the cells
                                className : 'b-calendar-row-header-container'
                            },
                            scrollPadElement : {
                                // retainElement : true, // DomSync should leave this alone
                                ...DomHelper.scrollBarPadElement
                            }
                        }
                    },
                    bodyElement : {
                        className : 'b-calendar-row-body',
                        children  : {
                            cellContainer : {
                                role      : 'row',
                                tabIndex  : -1, // Prevent screen reader from over-announcing the cells
                                reference : 'cellContainer',
                                className : 'b-calendar-row-cell-container'
                            }
                        }
                    }
                }
            };

        if (me.isYearPlannerRow) {
            // YearPlannerRow cells are not part of the accessibility tree so header is purely presentational
            result.children.headerElement.role = 'presentation';
        }

        // Add prefix element if rowHeaderRenderer is configured
        if (rowHeaderRenderer) {
            me.callback(rowHeaderRenderer, me, [prefixElement, me]);
        }

        return result;
    }

    onInternalPaint({ firstPaint }) {
        const
            me          = this,
            { animate } = me;

        // On first paint, create measurable elements, the refresh measures and caches uninitialized
        // heights, so delete the cached values so that they get measured again
        if (firstPaint) {
            const
                { fonts }    = document,
                onFirstPaint = () => {
                    // In case we are arriving here after the font load. Need to remeasure
                    // elements that are sized by text.
                    me._eventContainerTop = me._eventContainerHeight = null;

                    if (me.eventStore.count && !me.fixedHeight) {
                        me.performResizeRefresh(null, null, true);
                    }
                };

            // If the API is available, we need to remeasure when fonts become ready
            if (fonts?.status !== 'loaded') {
                fonts.ready.then(() => !me.isDestroyed && onFirstPaint());
            }
            onFirstPaint();

            // The sizing mode sync below is part of the initial render, so it is not animated
            me.animate = false;
        }

        // Sizing changes applied while hidden could not switch between extrinsic and content sizing
        me.syncFixedHeight();
        me.animate = animate;
    }

    changeDaySeparator(daySeparator) {
        return Array.isArray(daySeparator) ? daySeparator : [daySeparator, daySeparator];
    }

    changeElement() {
        const result = super.changeElement(...arguments);

        // Ensure header scroller is in sync in the X axis with the main scroller
        this.scrollable.addPartner(this.headerScroller, 'x');

        return result;
    }

    changeHeaderScroller(headerScroller, oldHeaderScroller) {
        if (headerScroller) {
            headerScroller = Scroller.new({
                _id     : `${this.id}-header-scroller`,
                element : this.headerCellContainer,
                widget  : this
            }, headerScroller);
        }
        else {
            oldHeaderScroller?.destroy();
        }

        return headerScroller;
    }

    /**
     * Brings an event or a time into view.
     * @param {Scheduler.model.EventModel|Date|Number} target The event to scroll to or
     * a `Date` to read the hour value from, or an hour number.
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A promise which is resolved when the target has been scrolled into view.
     */
    async scrollTo(target) {
        const
            me              = this,
            { eventFilter } = me;

        // If it's an event and filtered in, and intersects our date range, but we don't have an element
        // for it, then it must be because we are collapsed. Expand so it is rendered.
        if (target.isEvent && (!eventFilter || eventFilter(target)) && me.dateHelper.intersectSpans(me.startDate, me.endDate, target.startDate, target.endDate)) {
            if (!me.getEventElement(target)) {
                if (!(me.expanded || me.autoHeight)) {
                    await me.toggleExpandCollapse();
                }
            }
        }
        return super.scrollTo(...arguments);
    }

    updateDate(date, oldDate) {
        const me = this;

        let el = oldDate && me.getDayHeader(oldDate);
        el?.classList.remove('b-selected-date');

        // Base class may move our range if new date is outside of current range.
        super.updateDate?.(date, oldDate);

        el = date && me.getDayHeader(date);
        el?.classList.add('b-selected-date');
    }

    getDayHeader(date) {
        if (typeof date !== 'string') {
            date = this.dateKey(date);
        }
        return this.headerCellContainer.querySelector(`.b-cal-cell-header[data-header-date="${date}"]`);
    }

    get overflowElement() {
        return this.bodyElement;
    }

    get maxHeightElement() {
        // If we are the allDayEvents of a DayView, the maxHeight is on the allDayRowElement
        // of that DayView because that is the full width element which encapsulates this view
        // and also the "corner" element which is the row expander button above the time axis.
        return this.owner?.alldayRowElement || super.maxHeightElement;
    }

    createCellMap(getEventsOptions = {}) {
        const
            me                = this,
            {
                owner,
                maxEventCount,
                hiddenNonWorkingDays
            }                 = me,
            options           = ObjectHelper.assign({
                dayTime      : me.dayTime,
                // Only the first *visible* cell needs overflows flowing into it.
                // from after that, propagateCellEvents copies events forward, so
                // the getEvents will use the "startDate" index to extract events for a date.
                getDateIndex : date => Number(date) === Number(me.firstVisibleDate || me.startDate) ? 'date' : 'startDate'
            }, getEventsOptions),
            cellMap           = super.createCellMap(options),
            [
                newMaxEventCount,
                lastVisibleCellData
            ]                 = Array.from(cellMap.values()).reduce((v, cellData) => {
                if (!hiddenNonWorkingDays[cellData.day]) {
                    v[1] = cellData;
                }
                v[0] = Math.max(v[0], cellData.renderedEvents.length);
                return v;
            }, [0, null]);

        me.maxEventCount = newMaxEventCount;

        // If we changed maxEventCount, recreate the data
        if (!me.fixedHeight && maxEventCount != null && newMaxEventCount !== maxEventCount) {
            cellMap.clear();
            return me.createCellMap(options);
        }

        // Have to set this on the last cellData entry which is visible
        lastVisibleCellData && (lastVisibleCellData.isRowEnd = true);

        owner?.toggleCls('b-has-all-day-events', cellMap.size);

        return cellMap;
    }

    collectEvents(options) {
        // Only the first cell needs overflows flowing into it.
        // from after that, propagateCellEvents copies events forward
        options = ObjectHelper.assign({
            dayTime : this.dayTime
        }, options, {
            // Only the first *visible* cell needs overflows flowing into it.
            // from after that, propagateCellEvents copies events forward, so
            // the getEvents will use the "startDate" index to extract events for a date.
            getDateIndex : date => Number(date) === Number(this.firstVisibleDate || this.startDate) ? 'date' : 'startDate'
        });

        return super.collectEvents(options);
    }

    createCellData(date) {
        const
            me = this,
            columnIndex = me.dateHelper.diff(me.startDate, date, 'day'),
            visibleColumnIndex = columnIndex;

        return Object.assign(super.createCellData(date), {
            visibleColumnIndex,
            columnIndex,
            isRowStart : visibleColumnIndex === 0,
            isRowEnd   : false,

            // Events can forward-occupy slots if they
            // overrun their start day.
            // So the next step is to propagate forward
            // multi day events into future cells they cover.
            renderedEvents : new EventSlots()
        });
    }

    get dayStartShift() {
        return this.dayTime?.startShift ?? this._dayStartShift;
    }

    updateDayStartShift(dayStartShift) {
        // Day number circle needs to be oval to accommodate 00-00
        this.toggleCls('b-shifted-day', dayStartShift);
        this.dayTime = new DayTime(dayStartShift);
    }

    updateCompactHeader(compactHeader) {
        this.toggleCls('b-compact-header', Boolean(compactHeader));
    }

    changeDayTime(dayTime) {
        if (!dayTime) {
            dayTime = new DayTime(this.dayStartShift);
        }

        // Allow DayTime config object to be passed
        if (!dayTime.isDayTime) {
            dayTime = new DayTime(dayTime);
        }

        dayTime.owner ??= this;

        if (!this._dayTime?.equals(dayTime)) {
            return dayTime;
        }
    }

    dayOfDate(date) {
        return this.dayTime.dayOfDate(date);
    }

    updateMinDayWidth(minDayWidth) {
        const { style } = this.element;

        // Need min-width : 0 to allow the element to shrink
        style.setProperty('--bi-min-day-width', minDayWidth ? DomHelper.setLength(minDayWidth) : 0);
        style.setProperty('--bi-cell-container-overflow', minDayWidth ? 'visible' : 'hidden');

        // Avoid forced synchronous layout by deferring horizontal layout update until AF
        this.afterUpdateMinDayWidth();
    }

    // Fix up scrollability after minDayWidth update. This happens on AF.
    afterUpdateMinDayWidth() {
        const
            { headerScroller, minDayWidth, scrollable } = this,
            { element } = scrollable;

        if (minDayWidth && element.scrollWidth > element.clientWidth) {
            // Overflow 'hidden-scroll' is a special Scroller setting.
            // With overlayed scrollbars it just means 'auto'
            // With space-consuming scrollbars, it hides scrollbars using CSS while using auto.
            // But if the two axes scroll, then both scrollbars should not be hidden so it will
            // fall back to using overflow:hidden and a `wheel` listener.
            scrollable.overflowX = headerScroller.overflowX = 'hidden-scroll';
        }
        else {
            scrollable.overflowX = headerScroller.overflowX = false;
        }
    }

    /**
     * Renders the row header content by calling the configured {@link #config-rowHeaderRenderer} function
     * and syncing the result to the DOM.
     *
     * This method is called automatically during the refresh cycle if a {@link #config-rowHeaderRenderer}
     * is configured.
     *
     * @internal
     */
    renderRowHeader() {
        const me = this;

        if (me.rowHeaderRenderer && me.prefixElement) {
            const { prefixDomConfig } = me;

            me.callback(me.rowHeaderRenderer, me, [prefixDomConfig, me]);

            DomSync.sync({
                targetElement : me.prefixElement,
                domConfig     : DomHelper.normalizeChildren(prefixDomConfig)
            });
        }
    }

    updateEventHeight() {
        // CalendarMixin needs to know first
        super.updateEventHeight(...arguments);

        if (!this.autoHeight && !this.isConfiguring && !this.expanded) {
            this.setEventContentHeight(this.cellContentHeight);
        }
    }

    updateGutterHeight() {
        if (!this.isConfiguring && !this._isTemporarilyExpanded) {
            this.setEventContentHeight(this.cellContentHeight);
        }
    }

    updateNonWorkingDays() {
        this.onVisibleDateRangeChange();
    }

    updateHideNonWorkingDays() {
        super.updateHideNonWorkingDays(...arguments);

        this.onVisibleDateRangeChange();
    }

    // Override from DayCellRenderer
    // Called automatically on the CellOverflow${overflowPopupTrigger} event because of callOnFunctions
    onCellOverflowGesture({ date }) {
        if (expandGestures[this.overflowClickAction.toLowerCase()]) {
            this.expanded = true;
        }
        else {
            super.onCellOverflowGesture(...arguments);
        }
    }

    onVisibleDateRangeChange() {
        if (!this.isConfiguring) {
            this._cellMap?.clear();
            this.refresh();
        }
    }

    changeAutoHeight(autoHeight) {
        const
            me                = this,
            // Must be cached before property changes. This is calculated in this class
            { eventsPerCell } = me;

        // We need to update in the changer because we need to cache conditions that
        // applied before the change: eventsPerCell
        me._autoHeight = autoHeight;

        // Rows sized by layout switch sizing mode instead, on paint if not yet visible
        if (me.fixedHeight || me.wasFixedHeight) {
            // autoHeight overrides expanded, so the expanded state and header follow it
            me.toggleCls('b-expanded', me.expanded && !autoHeight);

            if (me.isVisible) {
                me.syncFixedHeight(eventsPerCell);
                me.renderRowHeader();
            }
            return;
        }

        me.setEventContentHeight(me.cellContentHeight);

        // Calculates new values for eventsPerCell and eventContainerTop
        // and handles changes to either.
        if (!me.isConfiguring) {
            me.performResizeRefresh(eventsPerCell, me.eventContainerTop, true);
        }
    }

    onInternalResize(...args) {
        // The resize monitor caught up, its height is the latest again
        this._measuredHeight = null;

        super.onInternalResize(...args);
    }

    async setEventContentHeight(eventContentHeight, force, syncingSiblings) {
        const
            me      = this,
            {
                cellContainer : element,
                parent
            }       = me,
            // No animations when owning DayView is shifting in time (unless it's a single day)
            animate = me.animate && (!me.owner?.isShifting || me.duration === 1);

        if (me.heightAnimation && eventContentHeight === me._animatingToHeight) {
            // If we are in the middle of an animation to this height, we can just return
            return;
        }

        // Extrinsic height means we do not get to set the cell container height.
        // But when collapsing back to fixed height, the content height does
        // need to be controlled, so the force flag is set.
        if (me.fixedHeight && !force) {
            element.style.minHeight = '';
        }
        // Reject non-changes.
        // This isn't a config because setting it is an async awaitable method.
        else if (me._eventContentHeight !== eventContentHeight) {
            // This is the read which does *not* cause a forced synchronous layout because
            // we have monitorResize : true and always know our own size. Unless we measured since the last resize
            // notification, which is then more recent
            const oldHeight = me._measuredHeight ?? me.height;

            // Update any smaller sibling rows unless that is what is being done to us
            if (!syncingSiblings && parent?.isDayView && parent.parent?.isResourceView) {
                const siblings = parent.parent.items.map(v => v.allDayEvents).filter(v => v && v !== me);

                // If we are the allDayEvents of a DayView which has siblings, we must consult
                // all siblings which are not time axes/scrollers and find the max so that we all
                // stay in sync.
                // This may be the case in a ResourceView of several DayViews side-by-side.
                eventContentHeight = Math.max(eventContentHeight || 0, ...siblings.filter(v => !v.owner.isResourceDayViewTimeAxis).map(v => v.calculateCellContentHeight() || 0));
                siblings?.forEach(v => {
                    v.setEventContentHeight(eventContentHeight, force, true);
                });
            }

            // Only show the scrollbar when we need to - if there's a space-consuming scrollbar shown.
            // We pre-change the cell heights in unanimated mode and see if there's overflow so that
            // we can set overflowY appropriately before the animation is kicked off.
            // Needs to be at least 1px so that horizontal scrolling can stay in sync
            // So height is set to 1px if eventContentHeight is zero

            // If it's zero height, the top border will not be shown because this border would collide
            // with the border-top of the day content element below.
            me.bodyElement.classList.toggle('b-zero-height', !eventContentHeight);

            if (animate) {
                me._animatingToHeight = eventContentHeight;
                await (me.heightAnimation = Promise.all([
                    // Start any height animation on a clean DOM with no invalidated layout
                    AsyncHelper.animationFrame(),
                    me.executeAndAwaitAnimations(element, () => {
                        // Set this widget to the animating state if we are configured to animate the height
                        me.isAnimating = true;
                        element.style.minHeight = `${eventContentHeight || 1}px`;
                    })
                ]));
            }
            else {
                element.style.minHeight = `${eventContentHeight || 1}px`;
            }

            if (!me.isDestroyed) {
                // Measured, the resize monitor may not have reported the new height yet. It has not when the
                // change was not animated, or when transitions are blocked (DayView's b-no-transitions). Only
                // reached when the content height changed
                const height = me._measuredHeight = me.heightElement.offsetHeight;

                me.heightAnimation = null;
                me.isAnimating = false;
                me._eventContentHeight = eventContentHeight;
                me.owner?.syncScrollbarPadding?.();
                /**
                 * Fires when this CalendarRow has completely changed its height.
                 * This fires *after* the animation has finished.
                 * @param {Calendar.widget.CalendarRow} source The triggering instance.
                 * @param {Number} oldHeight The old height.
                 * @param {Number} height The new height.
                 * @event heightChange
                 */
                if (height !== oldHeight) {
                    me.trigger('heightChange', {
                        height,
                        oldHeight
                    });
                }
            }
        }
    }

    get hasOverflow() {
        return !this.autoHeight && this.maxEventCount > this.defaultEventRowCount;
    }

    get eventsPerCell() {
        const
            me = this,
            { maxEventCount } = me;

        // Extrinsic height, ie configured or layout
        if (me.fixedHeight) {
            return super.eventsPerCell;
        }
        return (me.expanded || me.autoHeight) ? maxEventCount : Math.min(maxEventCount, me.defaultEventRowCount);
    }

    get cellContentHeight() {
        return this.owner?.showAllDayHeader === false ? 0 : this.calculateCellContentHeight();
    }

    calculateCellContentHeight() {
        // The minHeight must accommodate at least one row, but by default, defaultEventRowCount rows of events.
        // The all day section is expandable. If autoHeight, the minHeight must accommodate all events.
        const
            me = this,
            { gutterHeight } = me;

        let result = Math.ceil(me.eventContainerTop + me.eventsPerCell * (me.eventHeightInPixels + me.eventSpacing));

        // Allow gutterHeight : 1em to result in a 'calc(100px + 5em)' type value
        if (gutterHeight) {
            // The gutter is *instead of* the ${eventSpacing}px below the last event
            if (me.eventsPerCell) {
                result -= me.eventSpacing;
            }

            if (isNaN(gutterHeight)) {
                result = `calc(${result}px + ${gutterHeight})`;
            }
            else {
                result += Number(gutterHeight);
            }
        }

        return result;
    }

    getDateFromPosition(clientX, clientY, local = false, keyParser = null) {
        const
            me         = this,
            {
                eventContentElement
            }          = me,
            rowRect    = eventContentElement.getBoundingClientRect(),
            dx         = me.rtl ? rowRect.right - clientX : clientX - rowRect.left,
            width      = eventContentElement.scrollWidth,
            // We have to compare element position because day columns may have different widths
            overCell   = me.getDayElementFromX(clientX);

        if (dx < 0 || width < dx || clientY < rowRect.top || rowRect.bottom < clientY) {
            return null;
        }

        return me.getDateFromElement(overCell, keyParser);
    }

    /**
     * If not {@link #config-autoHeight}, this toggles between the collapsed state where it shows
     * the {@link #config-defaultEventRowCount} even if more event rows exist, and the expanded state
     * (which is equivalent to {@link #config-autoHeight}) where all event rows are shown.
     */
    async toggleExpandCollapse() {
        const { expanded } = this;

        // Do not go through the setter because this method is async and needs to be awaited
        await this.updateExpanded(!expanded, expanded);
    }

    get isContentSized() {
        return Boolean(this.expanded || this.autoHeight);
    }

    // Moves a fixedHeight row into or out of content sizing to match its expanded/autoHeight state
    async syncFixedHeight(prevEventsPerCell) {
        const
            me                 = this,
            { isContentSized } = me;

        if (me.fixedHeight && isContentSized) {
            if (!me.autoHeight) {
                await me.updateExpanded(true, false);
            }
            else {
                // Must be read before leaving fixed height
                const eventsPerCell = prevEventsPerCell ?? me.eventsPerCell;

                me.leaveFixedHeight();
                me.performResizeRefresh(eventsPerCell, me.eventContainerTop, true);
                await me.heightAnimation; // NOSONAR
            }
        }
        else if (me.wasFixedHeight && !me.fixedHeight && !isContentSized) {
            // The row still renders all its events, so that is the count being left
            await me.restoreFixedHeight(prevEventsPerCell ?? me.maxEventCount, true);
        }
    }

    // Exits extrinsic sizing. The row is then heighted by its content from the current height
    leaveFixedHeight() {
        const me = this;

        me.wasFixedHeight = true;
        me.fixedHeight = false;
        me._eventContentHeight = null;
        me.cellContainer.style.minHeight = `${me.cellContainer.getBoundingClientRect().height}px`;

        // Insist that our encapsulating element is heighted by its content
        me.setStyle('flex', '0 0 auto');
    }

    // Leaves content sizing, and only then refreshes to cut the event bars back
    async restoreFixedHeight(prevEventsPerCell, refresh) {
        const
            me          = this,
            fixedHeight = me.fixedHeight = me.wasFixedHeight;

        me.scrollable.overflowY = 'hidden';

        // If we're collapsing back to extrinsic sizing, flip back to that height
        // and measure it
        if (fixedHeight) {
            me.setStyle('flex', '');
            me._cellContentHeight = null;
        }
        const { cellContentHeight } = me;
        if (fixedHeight) {
            me.setStyle('flex', '0 0 auto');
        }
        await me.setEventContentHeight(cellContentHeight, true);

        // Calculates new values for eventsPerCell and eventContainerTop
        // and handles changes to either.
        if (refresh && !me.isDestroyed && me.fixedHeight === fixedHeight) {
            me.setStyle('flex', '');
            if (fixedHeight) {
                me._eventContentHeight = null;
            }

            me.performResizeRefresh(prevEventsPerCell, me.eventContainerTop, true);
        }
    }

    async updateExpanded(expanded, wasExpanded) {
        const me = this;

        // autoHeight rows are permanently content-sized, expanded has no effect
        if (me.autoHeight) {
            return;
        }

        // Temporarily set the property so that eventsPerCell yields the "from" count.
        me._expanded = wasExpanded;

        const { eventsPerCell, element } = me;

        me._expanded = expanded;

        // If we are expanding, a refresh will update the height *after* the refresh
        // which is what we want: it will "reveal" existing event bars
        if (me.expanded) {
            // If not yet visible, onInternalPaint completes this.
            if (me.isVisible) {
                // Expanding from extrinsic sizing, we temporarily exit that mode
                if (me.fixedHeight) {
                    me.leaveFixedHeight();
                }

                me.performResizeRefresh(eventsPerCell, me.eventContainerTop, true);
                await me.heightAnimation; // NOSONAR

                if (me.isDestroyed) {
                    return;
                }
            }
        }

        // If we are collapsing however, we want to hide the overflowing event bars
        // and *only then* refresh to cut the event bars back.
        // Rows sized by layout cannot measure while hidden. If not yet visible, onInternalPaint completes this.
        else if (me.isVisible || !(me.fixedHeight || me.wasFixedHeight)) {
            await me.restoreFixedHeight(eventsPerCell, wasExpanded);
        }
        element.classList.toggle('b-expanded', expanded);

        /**
         * Fires after this CalendarRow has been expanded or collapsed to show or hide overflowing events.
         * @param {Calendar.widget.CalendarRow} source The triggering instance.
         * @param {Boolean} expanded `true` if the row is now expanded, `false` if collapsed.
         * @event toggleExpanded
         */
        me.trigger?.('toggleExpanded', { expanded });
    }

    get visibleDateHeaders() {
        const
            me = this,
            { dh } = me;

        let firstDate, lastDate;

        if (me.fullWeek) {
            firstDate = me.month.getWeekStart(me.month.getWeekNumber(me.startDate));

            while (me.hiddenNonWorkingDays[dh.getDay(firstDate)]) {
                firstDate = dh.add(firstDate, 1, 'd');
            }

            lastDate = dh.add(firstDate, 6, 'd');  // inclusive

            while (me.hiddenNonWorkingDays[dh.getDay(lastDate)]) {
                lastDate = dh.add(lastDate, -1, 'd');
            }
        }
        else {
            firstDate = me.firstVisibleDate;
            lastDate = me.lastVisibleDate;
        }

        return [firstDate, lastDate];
    }

    // We must implement the CalendarMixin interface.
    // All views must expose a doRefresh method.
    doRefresh() {
        this._cellMap?.clear();

        const
            me             = this,
            {
                dh,
                dayTime,
                fullWeek,
                startDate,
                endDate,
                headerCellContainer,
                cellContainer,
                dayHeaderRenderer,
                hiddenNonWorkingDays,
                hideEmptyDays,
                dateFilter,
                owner,
                selectedDateCls
            }              = me,
            [from, to]     = me.visibleDateHeaders,
            cellMap        = (startDate || endDate) && me.cellMap,
            nonWorkingDays = me.nonWorkingDays ?? me.month.nonWorkingDays,
            cellDataBlocks = [],
            eventCells     = [],
            headerCells    = [];

        if (!cellMap) {
            return;
        }

        if (!me.fwComponent) {
            me.fwComponent = me.calendar?.processEventContent ? me.calendar : me.up(cmp => Boolean(cmp.processEventContent)) || {};
        }

        let columnIndex = 0,
            visibleColumnIndex = 0,
            currentDay, i, lastWorkingDayCell, hasOverflow;

        // Collect all our cell data blocks and measure our week length
        // Note: "!(to < date)" ==> "date <= to" but works for Date since they are never ==
        for (let date = from; !(to < date); date = dh.add(date, 1, 'd')) {
            const
                cellData     = cellMap.get(dayTime.dateKey(date)) || me.createCellData(date),
                { day, key } = cellData,
                dayEvents    = hideEmptyDays && (owner?.getEventsForDay?.(key, me.startDate) ?? cellData.renderedEvents),
                skipDay      = (hideEmptyDays && !dayEvents?.length) || (dateFilter && !me.callback(dateFilter, me, [cellData]));

            // There'll be no cell if it's a hidden, nonworking day or an empty date that we are hiding
            if (!(hiddenNonWorkingDays[day] || skipDay)) {
                cellData.columnIndex = cellData.cellIndex = columnIndex++;
                cellData.isRowStart = visibleColumnIndex === 0;
                cellData.visibleColumnIndex = visibleColumnIndex;

                if (!fullWeek) {
                    visibleColumnIndex++;
                }

                cellDataBlocks.push(cellData);

                hasOverflow ||= cellData.hasOverflow;
            }
        }

        // Needed for event bar %age width calculation in getCellDomConfig
        me.weekLength = fullWeek ? 1 : visibleColumnIndex;
        const length = cellDataBlocks.length;

        for (i = 0; i < length; i++) {
            const
                cellData     = cellDataBlocks[i],
                {
                    date,
                    day,
                    key
                }            = cellData,
                isNonWorking = nonWorkingDays[day],
                dayCls       = `b-day-of-week-${day}`;

            currentDay = !(date - (owner?.date || me.date));
            cellData.cell = me.getCell(key);

            // The contract of DayCellRenderer is defined in Core/widget/CalendarPanel.
            cellData.row = me.cellContainer;

            const cellDomConfig = me.getCellDomConfig(cellData);

            // YearPlanner "other month" cells are not navigable or announced by screen readers, so mark them as presentation and inert.
            if (me.isYearPlannerRow && cellData.isOtherMonth) {
                cellDomConfig.role = 'presentation';
                cellDomConfig.inert = 'inert';
                cellDomConfig.tabIndex = null;
            }

            // Falsy means omit the column
            if (cellDomConfig) {
                const headerDomConfig = Objects.merge({
                    dataset : {
                        // The [data-date] property marks an event content cell.
                        headerDate : key
                    }
                }, cellDomConfig.children[0]);

                headerDomConfig.className[selectedDateCls]   = currentDay;
                headerDomConfig.className['b-current-date']  = fullWeek && currentDay;
                headerDomConfig.className[dayCls]            = 1;

                // If the header cell is focusable, it should have an aria-label for screen readers.
                // Use the same label as the content cell if not provided by the renderer.
                if ('tabIndex' in headerDomConfig) {
                    headerDomConfig['aria-label'] = cellDomConfig['aria-label'];
                }

                // Show the dayHeaderRenderer the day header domConfig
                dayHeaderRenderer && me.callback(dayHeaderRenderer, me, [cellData, headerDomConfig]);

                cellDomConfig.dataset.date = key;
                cellDomConfig.dataset.dayOfWeek = cellData.day;

                Object.assign(cellDomConfig.className, {
                    'b-day-view-all-day'  : owner?.isDayView,
                    [me.nonWorkingDayCls] : isNonWorking,
                    [me.weekendCls]       : dh.weekends[day],
                    [me.dayCellCls]       : 1,
                    [dayCls]              : 1
                });

                // Remove header child from cell config
                cellDomConfig.children.shift();

                headerCells.push(headerDomConfig);

                if (!fullWeek || currentDay) {
                    eventCells.push(cellDomConfig);

                    if (!isNonWorking) {
                        lastWorkingDayCell = cellDomConfig;
                    }
                }
            }
        }

        // Identify last working day in row if there were any.
        lastWorkingDayCell && (lastWorkingDayCell.className['b-last-working-day'] = 1);

        DomSync.sync({
            targetElement : headerCellContainer,
            domConfig     : {
                children     : headerCells,
                onlyChildren : true,

                // Ensure DOM order matches children order.
                syncOptions : {
                    syncIdField      : 'headerDate',
                    releaseThreshold : 0,
                    strict           : true
                }
            }
        });
        DomSync.sync({
            targetElement : cellContainer,
            domConfig     : {
                children     : eventCells,
                onlyChildren : true,

                // Ensure DOM order matches children order.
                syncOptions : {
                    releaseThreshold : 0,
                    strict           : true
                }
            },
            callback({ action, domConfig, targetElement, jsx }) {
                me.fwComponent?.processEventContent?.({
                    jsx,
                    action,
                    domConfig,
                    targetElement,
                    reactComponent : me.fwComponent.reactComponent || me.fwComponent
                });
            }
        });

        // Set the empty row class of no cells have events.
        me.toggleCls('b-empty-row', !cellMap.size);
        me.toggleCls('b-has-overflow', hasOverflow);

        me.refreshCount = (me.refreshCount || 0) + 1;

        // Must only ever be a temporary state to accommodate dropping into an empty row.
        // As soon as a refresh happens, the state must be revoked.
        me.collapseGutter();

        // Needs day elements to be in place before this can be measured and fixed.
        me.setEventContentHeight(this.owner?.showAllDayHeader === false ? 0 : me.cellContentHeight);

        // Call row header renderer if configured
        me.renderRowHeader();

        /**
         * Fires when this CalendarRow refreshes.
         * @param {Calendar.widget.CalendarRow} source The triggering instance.
         * @event refresh
         */
        me.trigger('refresh');
    }

    get eventContainerTop() {
        return 0;
    }

    async expandGutter() {
        const me = this;

        if (!me._isTemporarilyExpanded) {
            me.gutterHeight = (me.gutterHeight || 0) + me.eventHeightInPixels + me.eventSpacing;
            await me.setEventContentHeight(me.cellContentHeight);
            me._isTemporarilyExpanded = true;
        }
    }

    async collapseGutter() {
        const me = this;

        if (me._isTemporarilyExpanded) {
            me.gutterHeight = me.gutterHeight - (me.eventHeightInPixels + me.eventSpacing);
            me._isTemporarilyExpanded = false;
            await me.setEventContentHeight(me.cellContentHeight);
        }
    }

    onCalendarKeyDown(keyEvent) {
        const
            {
                dh,
                dayTime,
                element,
                owner
            }                 = this,
            { target }        = keyEvent,
            eventCellSelector = `.${this.dayCellCls}`,
            from              = target.closest(`.b-cal-cell-header,${eventCellSelector}`) || target,
            headerFocused     = from.matches('.b-cal-cell-header'),
            eventCellFocused  = from.matches(eventCellSelector),
            cellKey           = eventCellFocused ? 'date' : 'header-date',
            dateKey           = this.duration === 1 && keyEvent.key === 'ArrowDown' ? dayTime.dateKey(this.date) : from.dataset[eventCellFocused ? 'date' : 'headerDate'],
            date              = dateKey && dayTime.parseKey(dateKey),
            nextNodeSelector  = `${headerFocused ? '.b-cal-cell-header:not([inert])' : eventCellSelector}:not([inert])`;

        // TAB navigates out of header cell
        if (target.closest('.b-calendar-row-prefix')) {
            return;
        }

        let to;

        switch (keyEvent.key) {
            case 'ArrowUp':
                // Up from an event cell goes to the header cell for that date
                if (eventCellFocused) {
                    keyEvent.preventDefault();
                    element.querySelector(`.b-cal-cell-header:not([inert])[data-header-date="${dateKey}"]`)?.focus();
                }
                break;
            case 'ArrowDown':
                // Down from a header cell goes to the event cell for that date
                if (headerFocused && DomHelper.isInView(to = element.querySelector(`${eventCellSelector}[data-date="${dateKey}"]`))) {
                    keyEvent.preventDefault();
                    to?.focus();
                }
                // Down from an event cell goes into our owning DayView cell for that date
                else if (owner.isDayView) {
                    keyEvent.preventDefault();
                    owner.eventContentElement.querySelector(`.${owner.dayCellCls}[data-date="${dateKey}"]`)?.focus();
                }

                break;
            case 'ArrowLeft':
                keyEvent.preventDefault();
                element.querySelector(`${nextNodeSelector}[data-${cellKey}="${dayTime.dateKey(dh.add(date, -1, 'd'))}"]`)?.focus();
                break;
            case 'ArrowRight':
                keyEvent.preventDefault();
                element.querySelector(`${nextNodeSelector}[data-${cellKey}="${dayTime.dateKey(dh.add(date, 1, 'd'))}"]`)?.focus();
                break;
            default:
                return super.onCalendarKeyDown(keyEvent);
        }
    }

    // Override from CalendarMixin.
    // CalendarRow's "today" may be shifted by the dayStartShift.
    // So when dayStartShift is 18, days start at 6pm, so today is 6pm today.
    // If we are the all day row of a DayView, use the owning DayView's isToday.
    isToday(date) {
        const { owner } = this;

        // A tz-aware DateHelper ignores the arg (resolves "today" in its own zone); the static one uses it for the
        // legacy conversion.
        return owner?.isDayView ? owner.isToday(date) : this.dateHelper.isToday(date, this.project?.timeZone);
    }

    // addCellHeaderContent mutates the cellHeader DomConfig block.
    // And if we are to have a day name element, returns the DomConfig for it.
    // It's called from DayCellRenderer#getCellDomConfig
    addCellHeaderContent(cellHeader, cellData) {
        const
            me = this,
            { resource, dh } = me,
            { date, day, tomorrow } = cellData,
            todayText = me.isToday(date) ? me.L('L{Object.today}, ') : '',
            { dayNameFormat, dayNumberCompress, daySeparator } = me,
            shifted = me?.dayTime?.startShift;

        cellHeader.children = [{
            className     : `b-day-name-part b-day-name-day${dayNumberCompress ? ' b-day-name-short' : ''}`,
            html          : formatDayPart(dh, dayNameFormat, daySeparator[0], date, shifted && tomorrow),
            'aria-hidden' : 'true'
        }, {
            tabIndex     : 0,
            role         : 'link',
            className    : `b-day-name-part b-day-name-date`,
            'aria-label' : `${todayText}${dh.format(date, 'dddd Do MMMM')}${resource ? ` ${resource.name}` : ''}.`,
            html         : formatDayPart(dh, me.dayNumberFormat, daySeparator[1], date, shifted && tomorrow, dayNumberCompress)
        }];

        cellHeader.className[me.nonWorkingDayCls] = cellData.isNonWorking;
        cellHeader.className[me.weekendCls] = dh.weekends[day];
    }

    updateLocalization() {
        if (!this.isConfiguring) {
            this.refresh();
        }
        super.updateLocalization();
    }

    updateFullWeek() {
        if (!this.isConfiguring) {
            this.refresh();
        }
    }
}

CalendarRow.initClass();
