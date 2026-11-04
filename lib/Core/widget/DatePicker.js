import CalendarPanel from './CalendarPanel.js';
import TimeZonable from '../mixin/TimeZonable.js';
import MonthPicker from './MonthPicker.js';
import YearPicker from './YearPicker.js';
import DateHelper from '../helper/DateHelper.js';
import EventHelper from '../helper/EventHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import BrowserHelper from '../helper/BrowserHelper.js';
import DomHelper from '../helper/DomHelper.js';
import './DisplayField.js';
import DomSync from '../helper/DomSync.js';

DomHelper.loadStylesheet('Core/widget/DatePicker.css');
// Shared `b-date-picker-cell-payload` + `b-show-events-dots` rules - also
// loaded by Calendar/widget/YearView so the dot row / count badge render
// identically across the DatePicker family and YearView.
DomHelper.loadStylesheet('Core/widget/DatePickerCell.css');

// import Stylesheet from './DatePicker.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'DatePicker');

const
    dateSort         = (lhs, rhs) => lhs.valueOf() - rhs.valueOf(),
    { DateSet }      = DateHelper,
    consecutiveDates = selection => selection.every((date, i) => !i || !(DateHelper.add(selection[i - 1], 1, 'd') - date)),
    weekRange        = { magnitude : 1, unit : 'week' };

/**
 * @module Core/widget/DatePicker
 */

/**
 * A Panel which can display a month of date cells, which navigates between the cells, fires events upon user selection
 * actions, optionally navigates to other months in response to UI gestures, and optionally displays information about
 * each date cell. Appearance in the built-in themes:
 *
 * {@inlineexample Core/widget/DatePicker.js one-column}
 *
 * A date is selected (meaning a single value is selected if {@link #config-multiSelect} is not set, or
 * added to the {@link #property-selection} if {@link #config-multiSelect if set}) by clicking a cell
 * or by pressing <kbd>Enter</kbd> when focused on a cell.
 *
 * The <kbd>Shift</kbd> and <kbd>Ctrl</kbd> keys modify selection behaviour depending on the value of {@link #config-multiSelect}.
 *
 * This class is used as a {@link Core.widget.DateField#config-picker} by the {@link Core.widget.DateField} class.
 *
 * ## Styling cell content via CSS
 *
 * Several different CSS classes are applied to date cells depending on their state. These can be used to style contents
 * of cells via CSS.
 *
 *  * `b-disabled-date` - Applied to disabled days
 *  * `b-weekend` - Applied to weekend days
 *  * `b-past-date` - Applied to dates before today
 *  * `b-today` - Applied to today's date
 *  * `b-non-working-day` - Applied to dates which are {@link #config-nonWorkingDays}
 *
 * By default, disabled dates in a lighter color. You can override this in your own CSS,
 * using the CSS variable API of this class.
 *
 * ## Custom cell rendering
 * You can easily control the content of each date cell using the {@link #config-cellRenderer}. The example below shows
 * a view typically seen when booking hotel rooms or apartments.
 *
 * {@inlineexample Core/widget/DatePickerCellRenderer.js}
 *
 * ## Multi selection
 * You can select multiple date ranges or a single date range using the {@link #config-multiSelect} config.
 *
 * {@inlineexample Core/widget/DatePickerMulti.js}
 *
 * ## Configuring toolbar buttons
 *
 * The datepicker includes a few useful navigation buttons by default. Through the DatePicker´s {@link #config-tbar toolbar},
 * you can manipulate these, via the toolbar´s {@link Core/widget/Toolbar#config-items} config.
 *
 * There are four buttons by default, each of which can be reconfigured using
 * an object, or disabled by configuring them as `null`.
 *
 * ```javascript
 * new DatePicker({
 *    tbar : {
 *       // Remove all navigation buttons
 *       items : {
 *           prevYear  : null,
 *           prevMonth : null,
 *           nextYear  : null,
 *           nextMonth : null
 *       }
 *    },
 *    bbar : {
 *        items : {
 *            todayButton : {
 *                text     : 'Today',
 *                style    : 'margin-inline:auto',
 *                onClick  : 'up.onTodayClick'
 *            }
 *        }
 *    },
 *    onTodayClick() {
 *        this.date = new Date();
 *    }
 * })
 * ```
 *
 * {@inlineexample Core/widget/DatePickerButtons.js}
 *
 * Provided toolbar widgets include:
 *
 * - `prevMonth` Navigates to previous month
 * - `nextMonth` Navigates to next month
 * - `prevYear` Navigates to previous year
 * - `nextYear` Navigates to next year
 *
 * @extends Core/widget/CalendarPanel
 * @classtype datepicker
 * @widget
 */
export default class DatePicker extends CalendarPanel.mixin(TimeZonable) {

    static $name = 'DatePicker';

    static type = 'datepicker';

    static get delayable() {
        return {
            refresh : 'raf'
        };
    }

    static configurable = {
        /**
         * A function (or the name of a function) which creates content in, and may mutate a day cell element.
         *
         * The intention of this function is to allow you to augment the existing cell with additional information
         * about the date.
         *
         * The cell structure passed in the `cell` property is as follows:
         * ```html
         * <div class="b-calendar-panel-cell" data-date="2024-09-15">
         *     <div class="b-date-picker-cell-inner" role="presentation">15</div>
         *     <div class="b-date-picker-cell-payload"></div>
         * </div>
         * ```
         *
         * The `b-calendar-panel-cell` element is the cell element itself. It contains two child elements:
         * - `b-date-picker-cell-inner`: This element contains the date number.
         * - `b-date-picker-cell-payload`: This element is empty by default and can be used to augment the cell content.
         *
         * The payload element is absolutely positioned, docked to the bottom of the cell.
         * You may add content to this element, and target it with CSS to augment the cell content.
         *
         * If you return content, textual HTML will *replace* the contents of the `cell` element. A {@link DomConfig}
         * object will be used by {@link Core.helper.DomSync#function-sync-static} to update the `cell` element.
         * If you want to augment the cell, it is recommended to add content to the `cellPayload` element.
         * @config {Function|String} cellRenderer
         * @param {Object} renderData
         * @param {HTMLElement} renderData.cell The cell's encapsulating element. This has the `b-calendar-panel-cell`
         * class and is the element which receives focus, so this should be the target of any accessibility attributes.
         * @param {HTMLElement} renderData.innerCell The inner element of the cell which contains the date number.
         * This is the `aspect-ratio : 1` element which contains the date. It is not recommeneded to mutate this element.
         * Instead use the `cellPayload` element (see below).
         * @param {HTMLElement} renderData.cellPayload An empty, absolutely positioned element, by default docked
         * at the bottom of the cell. Content may be added to this element to augment cell content.
         * @param {Date} renderData.date The date for the cell
         * @param {Number} renderData.day The day for the cell (`0` to `6` for Sunday to Saturday)
         * @param {Number[]} renderData.rowIndex The row index, 0 to month row count (6 if {@link #config-sixWeeks} is `true`)
         * @param {HTMLElement} renderData.row The row element encapsulating the week which the cell is a part of
         * @param {Core.widget.CalendarPanel} renderData.source The widget being rendered
         * @param {Number[]} renderData.cellIndex The cell index in the whole panel. May be from `0` to up to `42`
         * @param {Number[]} renderData.columnIndex The column index, `0` to `6`
         * @param {Number[]} renderData.visibleColumnIndex The visible column index taking hidden non working days into account
         * @returns {String|DomConfig|null}
         */

        rendition : {
            button : 'text'
        },

        /**
         * The date that the user has navigated to using the UI *prior* to setting the widget's
         * value by selecting it. The initial default is today's date. Can also be supplied as a `YYYY-MM-DD` date
         * string.
         *
         * This may be changed using keyboard navigation. The {@link Core.widget.CalendarPanel#property-date} is set
         * by pressing <kbd>Enter</kbd> when the desired date is reached.
         *
         * Programmatically setting the {@link Core.widget.CalendarPanel#config-date}, or using the UI to select the
         * date by clicking it also sets the `activeDate`
         * @config {Date|'today'|String}
         */
        activeDate : {
            $config : 'date',
            value   : 'today'
        },

        focusable   : true,
        textContent : false,
        tbar        : {
            overflow  : null,
            ariaLabel : 'L{DatePicker.navigation}',
            items     : {
                prevYear : {
                    icon     : 'b-icon-first b-date-picker-nav-button',
                    onAction : 'up.gotoPrevYear',
                    tooltip  : 'L{DatePicker.gotoPrevYear}',
                    weight   : 100
                },
                prevMonth : {
                    icon     : 'b-icon-previous b-date-picker-nav-button',
                    onAction : 'up.gotoPrevMonth',
                    tooltip  : 'L{DatePicker.gotoPrevMonth}',
                    weight   : 200
                },
                fields : {
                    type  : 'container',
                    cls   : 'b-date-picker-title',
                    items : {
                        monthButton : {
                            type              : 'button',
                            cls               : 'b-date-picker-month-button',
                            rendition         : 'text',
                            internalListeners : {
                                click : 'up.onMonthPickerRequested'
                            }
                        },
                        yearButton : {
                            type              : 'button',
                            cls               : 'b-date-picker-year-button',
                            rendition         : 'text',
                            internalListeners : {
                                click : 'up.onYearPickerRequested'
                            }
                        }
                    },
                    weight : 300
                },
                nextMonth : {
                    icon     : 'b-icon-next b-date-picker-nav-button',
                    onAction : 'up.gotoNextMonth',
                    tooltip  : 'L{DatePicker.gotoNextMonth}',
                    weight   : 400
                },
                nextYear : {
                    icon     : 'b-icon-last b-date-picker-nav-button',
                    onAction : 'up.gotoNextYear',
                    tooltip  : 'L{DatePicker.gotoNextYear}',
                    weight   : 500
                }
            }
        },

        monthPicker : {
            value : {
                type              : 'MonthPicker',
                trapFocus         : true,
                positioned        : true,
                hidden            : true,
                internalListeners : {
                    titleClick : 'up.onMonthPickerTitleClick',
                    select     : 'up.onMonthPicked',
                    Escape     : 'up.onMonthPickerTitleClick'
                }
            },
            $config : 'lazy'
        },

        yearPicker : {
            value : {
                type              : 'YearPicker',
                yearButtonCount   : 16,
                trapFocus         : true,
                positioned        : true,
                hidden            : true,
                internalListeners : {
                    titleClick : 'up.onYearPickerTitleClick',
                    select     : 'up.onYearPicked'
                }
            },
            $config : 'lazy'
        },

        /**
         * The initially selected date (or a `YYYY-MM-DD` date string).
         * @config {Date|String}
         */
        date : null,

        /**
         * The minimum selectable date. Selection of and navigation to dates prior
         * to this date will not be possible.
         * @config {Date}
         */
        minDate : {
            $config : 'date',
            value   : null
        },

        /**
         * The maximum selectable date. Selection of and navigation to dates after
         * this date will not be possible.
         * @config {Date}
         */
        maxDate : {
            $config : 'date',
            value   : null
        },

        /**
         * By default, disabled dates cannot be navigated to, and they are skipped over
         * during keyboard navigation. Configure this as `true` to enable navigation to
         * disabled dates.
         * @config {Boolean}
         * @default
         */
        focusDisabledDates : null,

        /**
         * Configure as `true` to enable selecting multiple discontiguous date ranges using
         * click and Shift+click to create ranges and Ctrl+click to select/deselect individual dates.
         *
         * Configure as `'simple'` to enable selecting a single date range by clicking a
         * start date followed by the end date. If you configure multiSelect `range` on touch-devices, `simple`
         * will be the mode used.
         *
         * Configure as `'range'` to enable selecting a single date range by selecting a
         * start and end date. Hold "SHIFT" button to select date range. Ctrl+click may add
         * or remove dates to/from either end of the range.
         *
         * If `'range'` is used, then the {@link #config-dragSelect} config may be used to
         * enable range selection by dragging the mouse pointer across date cells while holding
         * the primary mouse button down.
         * @config {Boolean|'range'|'simple'}
         * @default false
         */
        multiSelect : {
            $config : 'lazy',
            value   : null
        },

        /**
         * This property is only valid if {@link #config-multiSelect} is set to `'range'`
         * or `true`.
         *
         * Configure as `true` to enable selecting a date range by dragging the mouse pointer
         * across date cells while holding the primary mouse button down.
         *
         * If {@link #config-multiSelect} is set to `true`, use CTRL (CMD on Mac) while dragging
         * to select multiple ranges.
         * @prp {Boolean}
         * @default false
         */
        dragSelect : null,

        /**
         * If {@link #config-multiSelect} is configured as `true`, this is an array of dates
         * which are selected. There may be multiple, discontiguous date ranges.
         *
         * If {@link #config-multiSelect} is configured as `'range'` or `'simple'`, this is a two element array
         * specifying the first and last selected dates in a range.
         *
         * You can also provide the selected dates as an array of `YYYY-MM-DD` date strings
         * @config {Date[]|String[]}
         */
        selection : {
            $config : {
                equal : (v1, v2) => v1?.equals(v2)
            },
            value : null
        },

        /**
         * By default, the month and year are editable. Configure this as `false` to prevent that.
         * @config {Boolean}
         * @default true
         */
        editMonth : {
            $config : 'lazy',
            value   : null
        },

        /**
         * By default, the year is visible. Configure this as `false` to prevent that.
         * @config {Boolean}
         * @default true
         */
        includeYear : {
            $config : 'lazy',
            value   : null
        },

        /**
         * The {@link Core.helper.DateHelper} format string to format the day names.
         * @config {String}
         * @default
         */
        dayNameFormat : 'dd',

        trapFocus : true,

        ariaElement : 'weeksElement',

        role : 'grid',

        focusDescendant : true,

        /**
         * By default, when the {@link #property-date} changes, the UI will only refresh
         * if it doesn't contain a cell for that date, so as to keep a stable UI when
         * navigating.
         *
         * Configure this as `true` to refresh the UI whenever the month changes, even if
         * the UI already shows that date.
         * @config {Boolean}
         * @internal
         */
        alwaysRefreshOnMonthChange : null,

        /**
         * Configure as `true` to add a highlighted border and background to the week row which
         * encapsulates the selected date.
         * @prp {Boolean}
         * @default false
         */
        highlightSelectedWeek : null
    };

    static get prototypeProperties() {
        return {
            /**
             * The class name to add to the calendar cell whose date which is outside the
             * {@link #config-minDate}/{@link #config-maxDate} range.
             * @config {String}
             * @private
             */
            outOfRangeCls : 'b-out-of-range',

            /**
             * The class name to add to the currently focused calendar cell.
             * @config {String}
             * @private
             */
            activeCls : 'b-active-date',

            /**
             * The class name to add to selected calendar cells.
             * @config {String}
             * @private
             */
            selectedCls : 'b-selected-date',

            /**
             * The format string to use to create the text of the month button.
             *
             * It defaults to showing the full localized month name.
             * @config {String}
             * @default 'MMMM'
             */
            monthButtonFormat : 'MMMM'
        };
    }

    static _monthNames = DateHelper.getMonthNames();

    // region Init

    construct(config) {
        const me = this;

        super.construct(config);

        const { widgetMap } = me;

        me.externalCellRenderer = me.cellRenderer;
        me.cellRenderer         = me.internalCellRenderer;

        me.element.removeAttribute('tabindex');
        me.ariaElement.setAttribute('aria-activedescendant', `${me.id}-active-day`);
        widgetMap.fields && !me.ariaLabel && me.element.setAttribute('aria-labelledby', widgetMap.fields.id);

        EventHelper.on({
            element     : me.weeksElement,
            pointerdown : {
                handler  : 'onCellPointerDown',
                delegate : `.${me.dayCellCls}`
            },
            thisObj : me
        });

        me.getConfig('editMonth');
        me.getConfig('includeYear');

        // Ensure the DatePicker is immediately ready for use.
        me.refresh.flush();
    }

    get labelledElement() {
        return this.element;
    }

    afterHide(...args) {
        this._monthPicker?.hide();
        this._yearPicker?.hide();
        super.afterHide(...args);
    }

    doDestroy() {
        this.yearButton?.destroy();
        this.monthButton?.destroy();
        super.doDestroy();
    }

    // endregion

    get activeDayCell() {
        return this.weeksElement.querySelector(`#${this.id}-active-day`);
    }

    get focusElement() {
        return (!this.disabled && this.activeDayCell) || this.element;
    }

    get isSingleRangeSelect() {
        return this.multiSelect === 'range' || this.multiSelect === 'simple';
    }

    onMonthDateChange(info) {
        const
            ret = super.onMonthDateChange(info),
            {
                monthButton,
                yearButton
            }   = this.widgetMap;

        this.ariaElement.setAttribute('aria-label', DateHelper.format(this.date, 'MMMM YYYY'));

        monthButton && (monthButton.text = DateHelper.format(this.month.date, this.monthButtonFormat));
        yearButton  && (yearButton.text  = this.month.date.getFullYear());

        // Allowing the Month to be out-of-sync with our state can create race conditions if the Month were to change
        // again before the refresh (as in MultiDatePicker during animated scroll):
        this.refresh.flush();

        return ret;
    }

    updateEditMonth(editMonth) {
        const
            { monthButton, yearButton } = this.widgetMap,
            disallow = editMonth === false;

        monthButton && (monthButton.element.inert = disallow);
        yearButton && (yearButton.element.inert = disallow);
    }

    updateIncludeYear(includeYear) {
        const { yearButton } = this.widgetMap;

        yearButton && (yearButton.hidden = includeYear === false);
    }

    updateReadOnly(readOnly) {
        if (readOnly) {
            this.element.setAttribute('inert', true);
        }
        else {
            this.element.removeAttribute('inert');
        }
    }

    doRefresh(...args) {
        const
            me            = this,
            { date }      = me,
            oldActiveCell = me.activeDayCell,
            // Coerce the active date to be in the visible range.
            // Do not use the setter, the sync is done below
            activeDate    = DateHelper.betweenLesser(me.activeDate, me.month.startDate, me.month.endDate) ? me.activeDate : (me._activeDate = date);

        // toolbar widgets must have been instantiated.
        me.getConfig('tbar');

        me.element.classList.remove('b-date-picker-has-payload');

        super.doRefresh(...args);

        // The focused cell will have been repurposed for a new date
        const dateOfOldActiveCell = DateHelper.parseKey(oldActiveCell?.dataset.date);

        // The position of the cell may have changed, so the "from" cell must
        // be identified by the date that is stamped into it *after* the refresh..
        if (activeDate - dateOfOldActiveCell) {
            me.syncActiveDate(activeDate, dateOfOldActiveCell);
        }
    }

    internalCellRenderer({ cell, date }) {
        const
            me            = this,
            {
                externalCellRenderer
            }             = me,
            isSelected    = me.isSelectedDate(date),
            cellClassList = me.getCellClassList(...arguments);

        if (isSelected) {
            // Fix up start/inner/end range classes
            if (me.multiSelect) {
                const
                    isStart = !me.isSelectedDate(DateHelper.add(date, -1, 'd')),
                    isEnd   = !me.isSelectedDate(DateHelper.add(date, 1, 'd'));

                cellClassList['b-range-start'] = isStart;
                cellClassList['b-range-end'] = isEnd;
                cellClassList['b-in-range'] = !isStart && !isEnd;
            }
        }

        DomHelper.updateClassList(cell, cellClassList);

        // Must replace entire content in case we have an externalCellRenderer
        // Inject payload container for external renderers to place data in.
        // SchedulerDatePicker uses this to place event count badges.
        // CalendarDatePicker uses this to place indicators for dates with events.
        // Application cellRenderers can also use this.
        DomSync.sync({
            targetElement : cell,
            domConfig     : {
                id              : me.isActiveDate(date) ? `${me.id}-active-day` : null,
                role            : 'gridcell',
                'aria-label'    : DateHelper.format(date, 'dddd MMMM Do, YYYY'),
                'aria-selected' : isSelected,
                children        : [{
                    class : 'b-date-picker-cell-inner',
                    role  : 'presentation',
                    text  : date.getDate()
                }, externalCellRenderer ? {
                    class : 'b-date-picker-cell-payload'
                } : undefined]
            }
        });

        if (externalCellRenderer) {
            arguments[0].innerCell = cell.firstChild;
            arguments[0].cellPayload = cell.children[1];
            const result = me.callback(externalCellRenderer, me, arguments);

            if (arguments[0].cellPayload?.childNodes.length) {
                me.element.classList.add('b-date-picker-has-payload');
            }

            // If the app returns something, use it to replace the cell content
            if (result) {
                if (typeof result === 'string') {
                    cell.innerHTML = result;
                }
                else {
                    DomSync.sync({
                        targetElement : cell,
                        domConfig     : result
                    });
                }
            }
        }
    }

    getCellClassList({ date }) {
        const
            me = this,
            {
                activeCls,
                selectedCls
            }  = me;

        return {
            [activeCls]        : activeCls && me.isActiveDate(date),
            [selectedCls]      : me.isSelectedDate(date),
            [me.outOfRangeCls] : (me.minDate && date < me.minDate) || (me.maxDate && date > me.maxDate)
        };
    }

    onCellPointerDown(event) {
        // syncActiveDate() does not need to explicitly focus the active cell
        // because this pointerdown event will do it unless we preventDefault.
        this.pointerDown = true;

        const
            me              = this,
            cell            = event.target.closest('[data-date]'),
            date            = me.activeDate = DateHelper.parseKey(cell.dataset.date),
            { multiSelect } = me;

        me.pointerDown = false;

        if (multiSelect === true || multiSelect === 'range' && me.dragSelect && !event.button) {
            me.dragStartDate = new Date(date);

            // If ctrl is not pressed and shift is not pressed, start a new selection.
            // If ctrl or shift is pressed, the impending click should add to the existing selection.
            // If a click is not incoming and the user is dragging, the drag handler will manage the selection.
            if (!event.ctrlKey && !event.shiftKey) {
                me.selection = [date];
            }
            me.rangeDragListener = EventHelper.on({
                pointermove : {
                    element : me.weeksElement,
                    handler : 'onRangeDrag'
                },
                pointerup : {
                    element : document,
                    capture : true,
                    handler : 'onRangeDragEnd'
                },
                thisObj : me
            });
        }
        else if (!cell.getAttribute('tabindex')) {
            event.preventDefault();
        }
    }

    // A callOnFunctions method called from the CalendarPanel cellClick event
    onCellClick({ date, domEvent }) {
        this.onUIDateSelect(date, domEvent);
    }

    // A callOnFunctions method called from the CalendarPanel weekCellClick event
    onWeekCellClick({ date: startDate, domEvent }) {
        if (this.multiSelect) {
            this.selection = [startDate, DateHelper.add(startDate, 6, 'd')];
        }
    }

    /**
     * Called when the user uses the UI to select the current activeDate. So ENTER when focused
     * or clicking a date cell.
     * @param {Date} date The active date to select
     * @param {Event} event the instigating event, either a `click` event or a `keydown` event.
     * @internal
     */
    onUIDateSelect(date, event) {
        const
            me = this,
            {
                lastClickedDate,
                multiSelect
            }  = me;

        if (!me.isDisabledDate(date)) {
            if (me.trigger('beforeDateSelect', { date, event }) !== false) {
                me.lastClickedDate = date;
                me.activatingEvent = event;

                // Handle multi selecting.
                // * single contiguous date range, eg: an event start and end
                // * multiple discontiguous ranges
                if (multiSelect) {
                    me.handleMultiSelect(lastClickedDate, date, event);
                }
                else {
                    // First set the selection. That *may* set the date.
                    // If it doesn't, we set it here. If done, this is a no-op
                    me.date = me.selection = date;
                    if (me.floating) {
                        me.hide();
                    }
                }

                me.activatingEvent = null;
            }
        }
    }

    // Calls updateSelection if the selection is mutated
    handleMultiSelect(lastClickedDate, date, event) {
        const
            me           = this,
            {
                multiSelect
            }            = me,
            _selection   = me._selection || (me._selection = new DateSet()),
            oldSelection = new DateSet(_selection),
            selection    = _selection.dates,
            singleRange  = me.isSingleRangeSelect,
            isSimpleMultiSelect = multiSelect === 'simple' || DomHelper.isTouchEvent,
            {
                size,
                generation
            }           = _selection,
            rangeEnds   = size && {
                [DateHelper.makeKey(DateHelper.add(selection[0], -1, 'd'))]                   : 1,
                [DateHelper.makeKey(selection[0])]                                            : 1,
                [DateHelper.makeKey(selection[selection.length - 1])]                         : 1,
                [DateHelper.makeKey(DateHelper.add(selection[selection.length - 1], 1, 'd'))] : 1
            },
            isSelected  = _selection.has(date),
            toggleFn    = isSelected ? 'delete' : 'add';

        let shouldClearAndSelect = false;

        // If we're allowed to create one range and they clicked on a togglable date of a range
        const clickedRangeEnd = singleRange && rangeEnds?.[DateHelper.makeKey(date)];

        // In simple mode, if we select a new date with a range present - clear previous range then select single date
        if (isSimpleMultiSelect && size > 1) {
            shouldClearAndSelect = true;
        }
        // Ctrl+click means toggle the date, leaving remaining selection unchanged
        else if (event.ctrlKey) {
        // Allow individual date toggling if we are allowing multi ranges
        // or there's no current selection, or they are on, or adjacent to the range end
            if (multiSelect === true || !size || clickedRangeEnd) {
                _selection[toggleFn](date);

                // Check that the start hasn't been deselected
                if (singleRange && !_selection.has(me.rangeStartDate)) {
                    me.rangeStartDate.setDate(me.rangeStartDate.getDate() + (date < selection[1] ? 1 : -1));
                }
            }
        }
        // Shift+click means add a range, or tapping using touch
        else if ((isSimpleMultiSelect || event.shiftKey) && size) {
            const [start, end] = [
                new Date(singleRange ? (me.rangeStartDate || (me.rangeStartDate = selection[0])) : lastClickedDate),
                date
            ].sort(dateSort);

            // If we can only have one range
            if (singleRange) {
                _selection.clear();
            }

            // Add all dates in the range except disabled dates
            for (const d = start; d <= end; d.setDate(d.getDate() + 1)) { // NOSONAR
                if (!me.isDisabledDate(d)) {
                    _selection.add(d);
                }
            }
        }
        // Make the clicked date the only selected date.
        // Avoid a no-op which would still cause a generation change
        else if (!(_selection.has(date) && _selection.size === 1)) {
            shouldClearAndSelect = true;
        }

        if (shouldClearAndSelect) {
            _selection.clear();
            _selection.add(date);
        }

        const newSize = _selection.size;

        // Keep track of the range start date. The first selected date is the start and the end then
        // can move to either side of that.
        if (newSize === 1) {
            me.rangeStartDate = date;
        }
        else if (!newSize) {
            me.rangeStartDate = null;
        }

        // Process selection change if we changed the selection.
        if (_selection.generation !== generation) {
            me.updateSelection(_selection, oldSelection);
        }
    }

    updateHighlightSelectedWeek(highlightSelectedWeek) {
        this.toggleCls('b-highlight-selected-week', highlightSelectedWeek);
    }

    updateMultiSelect(multiSelect) {
        this.toggleCls('b-multi-select', multiSelect);
        if (!multiSelect) {
            this.selection = [...this.selection][0];
        }
    }

    onRangeDrag(domEvent) {
        const
            me         = this,
            { target } = domEvent,
            cell       = target.closest('[data-date]'),
            date       = me.getDateFromDomEvent(target);

        // Update the selection based on where the pointerdown was and where the pointer is now.
        // Only if we have moved to a new date. If no movement, do nothing because that is a cell click.
        if (cell && date - me.dragStartDate) {
            // Single range select, just set the range start and end
            if (me.multiSelect === 'range') {
                this.selection = [me.dragStartDate, date];
            }
            // Multi range select we have to add individual dates
            else {
                const newSelection = domEvent.ctrlKey ? me.selection : [];

                for (const d = new Date(me.dragStartDate); d <= date; d.setDate(d.getDate() + 1)) { // NOSONAR
                    if (!me.isDisabledDate(d)) {
                        newSelection.push(new Date(d));
                    }
                }
                this.selection = newSelection;
            }
        }
    }

    onRangeDragEnd() {
        // Remove the pointerover and pointerup listeners
        this.rangeDragListener?.();
    }

    /**
     * The selected Date(s).
     *
     * When {@link #config-multiSelect} is `'range'`, then this yields a two element array
     * representing the start and end of the selected range.
     *
     * When {@link #config-multiSelect} is `true`, this yields an array containing every selected
     * Date.
     * @member {Date[]} selection
     */
    get selection() {
        const
            { _selection } = this,
            dates          = _selection ? _selection.dates : DatePicker.emptyArray;

        return this.isSingleRangeSelect && dates.length ? [dates[0], dates[dates.length - 1]] : dates;
    }

    getRange(snapToWeeks) {
        if (this.multiSelect) {
            const
                { selection }  = this,
                startDate      = selection[0],
                endDate        = selection[selection.length - 1],
                endDatePlusOne = DateHelper.add(endDate, 1, 'd');

            // If the dates span a range of months, eg 15th April to 14th May, then the increment
            // unit is one month. The wholeMonth flag is set if *all* dates are selected.
            if (selection.length > 1 && endDatePlusOne.getDate() === startDate.getDate()) {
                return {
                    unit      : 'month',
                    magnitude : DateHelper.diff(startDate, endDatePlusOne, 'month'),
                    wholeMonth :
                        startDate.getDate() === 1 &&
                        endDate.getDate() === DateHelper.getLastDateOfMonth(endDate).getDate() &&
                        consecutiveDates(selection),
                    startDate,
                    endDate
                };
            }

            // The dates span precisely a range of weeks.
            if (startDate.getDay() == DateHelper.weekStartDay && endDate.getDay() === (DateHelper.weekStartDay + 6) % 7) {
                return {
                    unit      : 'week',
                    magnitude : DateHelper.diff(startDate, endDatePlusOne, 'week'),
                    startDate,
                    endDate
                };
            }

            // Expand the range to be a range of week rows which encapsulates all selected dates
            if (snapToWeeks) {
                const
                    snappedStartDate = DateHelper.floor(startDate, weekRange),
                    snappedEndDate   = DateHelper.ceil(endDatePlusOne, weekRange),
                    weekSpan         = Math.max(Math.ceil(DateHelper.diff(snappedStartDate, snappedEndDate, 'w')), 1);

                snappedEndDate.setDate(snappedEndDate.getDate() - 1);

                // Create a larger range, measured in weeks which encompasses all the selected dates
                return {
                    unit      : 'week',
                    magnitude : weekSpan,
                    startDate : snappedStartDate,
                    endDate   : snappedEndDate
                };
            }

            // The default is that we span a range of days
            return {
                unit      : 'day',
                magnitude : DateHelper.diff(startDate, endDate, 'd') + 1,
                startDate,
                endDate
            };
        }
    }

    get snappedRange() {

    }

    changeSelection(selection, was) {
        // We always need a _selection property to be a DateSet.
        // Falsy selection value means empty DateSet.
        const me = this;

        let result, rangeStartDate;

        if (!selection) {
            result = new DateSet();
        }
        else if (selection.isDateSet) {
            if (was === selection || was?.equals(selection)) {
                return was;
            }

            rangeStartDate = ObjectHelper.first(selection);
            result = selection;
        }
        else {
            // Convert single Date into Array
            if (!selection.forEach) {
                selection = [selection];
            }

            // Clamp selection into range and evict disabled dates. May duplicate, but the Set will dedupe.
            selection = selection.reduce((r, d) => {
                d = me.changeDate(d);
                if (!me.isDisabledDate(d)) {
                    r.push(d);
                }
                return r;
            }, []);

            // Cache the first date, regardless of sort order for use as the "clicked date"
            // around which the range revolves when shift+click is used.
            rangeStartDate = selection[0];
            selection.sort(dateSort);

            // A two element array means a start and end
            if (me.isSingleRangeSelect && selection.length === 2) {
                result = new DateSet();
                for (const d = new Date(selection[0]); d <= selection[1]; d.setDate(d.getDate() + 1)) {
                    result.add(d);
                }
            }
            else {
                // Multi dates may be in any order, so use the temporally first date as range start
                rangeStartDate = selection[0];
                result = new DateSet(selection);
            }
        }

        if (rangeStartDate) {
            me.rangeStartDate = DateHelper.clearTime(rangeStartDate);
        }

        return result;
    }

    updateSelection(dateSet, oldDateSet) {
        const
            me              = this,
            { multiSelect } = me,
            { dates }       = dateSet,
            selection       = me.isSingleRangeSelect ? [dates[0], dates[dates.length - 1]] : dates;

        if (!me.isConfiguring) {
            // If we are *single* selecting and there is no `date` incoming, the current `date`
            // must be set *first* to ensure that any refresh and selectionChange event handlers
            // see the new value. By doing it here, *before* onUIDateSelect sets it, event handlers
            // will also see the new `selection` value.
            if (!multiSelect && dates.length && !me.peekConfig('date') && dates[0].getMonth() === me.month.month) {
                me.date = dates[0];
            }

            // We're going to announce the change. UI must be up to date
            me.refresh.now();

            const event = {
                selection,
                userAction : Boolean(me.activatingEvent)
            };
            if (oldDateSet) {
                const { dates } = oldDateSet;

                event.oldSelection =  me.isSingleRangeSelect ? [dates[0], dates[dates.length - 1]] : dates;
            }

            /**
             * Fires when a date or date range is selected. If {@link #config-multiSelect} is specified,
             * this will fire upon deselection and selection of dates.
             * @event selectionChange
             * @param {Core.widget.DatePicker} source This DatePicker.
             * @param {Date[]} selection The selected dates. If {@link #config-multiSelect} is specified
             * this may be a two element array specifying start and end dates.
             * @param {Date[]} oldSelection The previously selected dates. If {@link #config-multiSelect} is specified
             * this may be a two element array specifying start and end dates.
             * @param {Boolean} userAction This will be `true` if the change was caused by user interaction
             * as opposed to programmatic setting.
             */
            me.trigger('selectionChange', event);
        }
    }

    /**
     * Checks whether a date is selected.
     * @param {Date} date The date
     * @returns {Boolean}
     */
    isSelected(date) {
        return this.selection.some(d => DateHelper.isSameDate(d, date));
    }

    onInternalKeyDown(keyEvent) {
        const
            me          = this,
            keyName     = keyEvent.key.trim() || keyEvent.code,
            { ctrlKey } = keyEvent,
            activeDate  = me.activeDate;

        let newDate = new Date(activeDate);

        if (keyName === 'Escape') {
            if (me.monthPicker.isVisible) {
                return me.monthPicker.hide();
            }
            if (me.yearPicker.isVisible) {
                return me.yearPicker.hide();
            }

            if (me.floating) {
                return me.hide();
            }
        }

        // Only navigate if not focused on one of our child widgets.
        // We have a prevMonth and nextMonth tool and possibly month and year pickers.
        if (activeDate && me.weeksElement.contains(keyEvent.target)) {
            do {
                switch (keyName) {
                    case 'ArrowLeft':
                        // Disable browser use of this key.
                        // Ctrl+ArrowLeft navigates back.
                        // ArrowLeft scrolls if there is horizontal scroll.
                        keyEvent.preventDefault();

                        if (ctrlKey) {
                            newDate = me.gotoPrevMonth();
                        }
                        else {
                            newDate.setDate(newDate.getDate() - 1);
                        }
                        break;
                    case 'ArrowUp':
                        // Disable browser use of this key.
                        // ArrowUp scrolls if there is vertical scroll.
                        keyEvent.preventDefault();

                        newDate.setDate(newDate.getDate() - 7);
                        break;
                    case 'ArrowRight':
                        // Disable browser use of this key.
                        // Ctrl+ArrowRight navigates forwards.
                        // ArrowRight scrolls if there is horizontal scroll.
                        keyEvent.preventDefault();

                        if (ctrlKey) {
                            newDate = me.gotoNextMonth();
                        }
                        else {
                            newDate.setDate(newDate.getDate() + 1);
                        }
                        break;
                    case 'ArrowDown':
                        // Disable browser use of this key.
                        // ArrowDown scrolls if there is vertical scroll.
                        keyEvent.preventDefault();

                        newDate.setDate(newDate.getDate() + 7);
                        break;
                    case 'Enter':
                        return me.onUIDateSelect(activeDate, keyEvent);
                }
            } while (me.isDisabledDate(newDate) && !me.focusDisabledDates);

            // Don't allow navigation to outside of date bounds.
            if (me.minDate && newDate < me.minDate) {
                return;
            }
            if (me.maxDate && newDate > me.maxDate) {
                return;
            }
            me.activeDate = newDate;

            // If that changed month and caused a refresh, focus will have been lost.
            // Refocus the new active date cell.
            me.getCell(newDate)?.focus();
        }
    }

    changeMinDate(minDate) {
        // Treat anything that isn't a valid Date as no min. Guards against Invalid Date
        // and stray non-Date values (e.g. plain objects) that the config convert step
        // preserves unchanged.
        if (!DateHelper.isValidDate(minDate)) {
            return null;
        }
        return DateHelper.clearTime(minDate);
    }

    updateMinDate(minDate) {
        this._yearPicker && (this._yearPicker.minYear = minDate?.getFullYear());
        this.refresh();
    }

    changeMaxDate(maxDate) {
        // See changeMinDate — same defensive coercion.
        if (!DateHelper.isValidDate(maxDate)) {
            return null;
        }
        return DateHelper.clearTime(maxDate);
    }

    updateMaxDate(maxDate) {
        this._yearPicker && (this._yearPicker.maxYear = maxDate?.getFullYear());
        this.refresh();
    }

    changeDate(date) {
        return DateHelper.clamp(super.changeDate(date), this.minDate, this.maxDate);
    }

    updateDate(date, oldDate) {
        const
            me        = this,
            { month } = me;

        // Directly configuring a date creates the selection
        if (me.isConfiguring && !me.initializingActiveDate) {
            if (!('selection' in me.initialConfig)) {
                me.selection = date;
            }

            if (!('activeDate' in me.initialConfig)) {
                me.activeDate = date;
            }
        }

        // Only change the month's date if it is within our current month
        // or we have to because we don't have a cell for it.
        // If it's a date in the "otherMonth" part of the grid, do not update.
        if (!month.date || date.getMonth() === month.month || !me.getCell(date) || me.alwaysRefreshOnMonthChange || me.isNavigating) {
            super.updateDate(date);
        }
        else {
            const
                newMonth = month.getOtherMonth(date),
                // Collect changes as bitwise flags:
                // 0001 = date has changed.
                // 0010 = week has changed.
                // 0100 = month has changed.
                // 1000 = year has changed.
                // We need this because 10/1/2010 -> 10/1/2011 must fire a dateChange
                // and a monthChange in addition to the yearChange.
                // And 10/1/2010 -> 10/2/2010 must fire a dateChange in addition to the monthChange.
                changes  = me.eventListeners && (oldDate ? (
                    date.getDate()            !== oldDate.getDate())             |
                    (newMonth.getWeekId(date) !== month.getWeekId(oldDate)) << 1 |
                    (date.getMonth()          !== oldDate?.getMonth())      << 2 |
                    (date.getFullYear()       !== oldDate?.getFullYear())   << 3 : 15);

            me.trigger('dateChange', {
                changes : {
                    d : true,
                    w : Boolean(changes & 2),
                    m : Boolean(changes & 12),
                    y : Boolean(changes & 8),
                    r : newMonth.weekCount !== month.weekCount
                },
                value    : date,
                oldValue : oldDate
            });
        }
    }

    changeActiveDate(activeDate, oldActiveDate) {
        const me = this;

        if (activeDate === 'today') {
            activeDate = new Date();
        }

        if (me.trigger('beforeActiveDateChange', { activeDate, oldActiveDate }) === false) {
            return;
        }

        activeDate = activeDate ? me.changeDate(activeDate) : me.date || (me.date = DateHelper.clearTime(new Date()));

        if (isNaN(activeDate)) {
            throw new Error('DatePicker activeDate must be passed a Date, or a YYYY-MM-DD date string');
        }

        return DateHelper.clamp(activeDate, me.minDate, me.maxDate);
    }

    updateActiveDate(activeDate, wasActiveDate) {
        const
            me                = this,
            { isConfiguring } = me;

        if (isConfiguring || !me.getCell(activeDate)) {
            me.initializingActiveDate = isConfiguring;
            me.date = activeDate;
            me.initializingActiveDate = false;
        }

        if (!isConfiguring && !me.refresh.isPending) {
            me.syncActiveDate(activeDate, wasActiveDate);
        }
    }

    syncActiveDate(activeDate, wasActiveDate) {
        const
            me            = this,
            { activeCls } = me,
            activeCell    = me.getCell(activeDate),
            wasActiveCell = wasActiveDate && me.getCell(wasActiveDate),
            activeElement = DomHelper.getActiveElement(me.element);

        if (activeCell) {
            me.focusable && activeCell.setAttribute('tabIndex', '0');
            activeCls && activeCell.classList.add(activeCls);
            activeCell.id = `${me.id}-active-day`;

            // If we are in the pointerdown handling, that will focus the target cell by default
            // so we do not do it here which results in :focus-visible state.
            if (me.weeksElement.contains(activeElement) && !me.pointerDown) {
                activeCell.focus();
            }
        }

        if (wasActiveCell && wasActiveCell !== activeCell) {
            // Delay rremoval of tabIndex until after focus has moved to the new cell.
            // This prevents focus from being lost if me.pointerDown and we did not focus the new cell
            // above in anticipation of the pointerdown event doing that.
            me.focusable && me.requestAnimationFrame(() => wasActiveCell.removeAttribute('tabIndex'));
            activeCls && wasActiveCell.classList.remove(activeCls);
            wasActiveCell.removeAttribute('id');
        }
    }

    set value(value) {
        const
            me = this,
            {
                selection,
                duration
            }  = me;

        // Setting the value must navigate to the encapsulating month even if we have
        // a cell for the date.
        // updateDate always calls super and CalendarPanel will refresh
        me.isNavigating = true;

        if (value) {
            value = me.changeDate(value, me.value);

            // If we're maintaining a single date range, move the range
            if (me.isSingleRangeSelect && selection?.length === 2) {
                if (!DateHelper.betweenLesserEqual(value, ...selection)) {
                    // Move range back to encapsulate date
                    if (value < selection[0]) {
                        me.selection = [value, DateHelper.add(value, duration - 1, 'd')];
                    }
                    // Move range forwards to encapsulate date
                    else {
                        me.selection = [DateHelper.add(value, -(duration - 1), 'd'), value];
                    }
                }
                me.date = me.activeDate = value;
                return;
            }

            // Undefined return value means no change
            if (value !== undefined) {
                me.selection = value;
                me.date = me.activeDate = value;
            }
        }
        else {
            // Clearing the value - go to today's calendar
            me.date = me.activeDate = new Date();
            me.selection = null;
        }
        me.isNavigating = false;
    }

    get value() {
        const
            { selection } = this,
            n = selection?.length || null;

        return n && selection[n - 1];
    }

    get duration() {
        return this.isSingleRangeSelect ? DateHelper.diff(...this.selection, 'd') + 1 : 1;
    }

    gotoPrevYear() {
        return this.goto(-1, 'year');
    }

    gotoPrevMonth() {
        return this.goto(-1, 'month');
    }

    gotoNextMonth() {
        return this.goto(1, 'month');
    }

    gotoNextYear() {
        return this.goto(1, 'year');
    }

    goto(direction, unit) {
        const
            me = this,
            { activeDate } = me,
            activeCell = activeDate && me.getCell(activeDate);

        let newDate;

        // If active date is already in the month we're going to, use it
        if (unit === 'month' && activeCell && activeDate?.getMonth() === me.month.month + direction) {
            newDate = activeDate;
        }
        // Move the date by the requested unit
        else {
            newDate = DateHelper.add(activeCell ? activeDate : me.date, direction, unit);
        }

        return me.gotoDate(newDate, direction, activeCell);
    }

    gotoDate(newDate, direction, activeCell = this.activeDate && this.getCell(this.activeDate)) {
        const
            me = this,
            firstDateOfNewMonth = new Date(newDate);

        firstDateOfNewMonth.setDate(1);

        const lastDateOfNewMonth  = DateHelper.add(DateHelper.add(firstDateOfNewMonth, 1, 'month'), -1, 'day');

        // Don't navigate if month is outside bounds
        if ((me.minDate && direction < 0 && lastDateOfNewMonth < me.minDate) || (me.maxDate && direction > 0 && firstDateOfNewMonth > me.maxDate)) {
            return;
        }

        // We need to force a UI change even if the UI contains the target date.
        // updateDate always calls super and CalendarPanel will refresh
        me.isNavigating = true;

        // The `date` config short-circuits on equality, so if `me._date` already equals `newDate` (e.g. after clicking
        // an "otherMonth" trailing cell) the setter below won't call `updateDate` and `isNavigating` has no effect.
        // Detect that up front and invoke `updateDate` explicitly so the grid re-syncs.
        const
            oldDate          = me._date,
            willShortCircuit = oldDate?.getTime() === newDate?.getTime(),
            result           = me.date = newDate;

        if (activeCell) {
            me.activeDate = newDate;
        }

        if (willShortCircuit) {
            me.updateDate(oldDate, oldDate);
        }

        me.isNavigating = false;
        return result;
    }

    isActiveDate(date) {
        return !(date - this.activeDate);
    }

    isSelectedDate(date) {
        return this._selection?.has(date);
    }

    onFocusIn(ev) {
        super.onFocusIn(ev);

        if (ev.toWidget === this && ev._target === this.element && !this.disabled) {
            this.focusElement?.focus();
        }
    }

    onMonthPickerRequested() {
        const { monthPicker } = this;

        if (monthPicker.isVisible) {
            monthPicker.hide();
        }
        else {
            monthPicker.month = this.activeDate.getMonth();
            monthPicker.show();
            monthPicker.focus();
        }
    }

    onYearPickerRequested() {
        const { yearPicker } = this;

        if (yearPicker.isVisible) {
            yearPicker.hide();
        }
        else {
            yearPicker.year = yearPicker.startYear = this.activeDate.getFullYear();
            yearPicker.show();
            yearPicker.focus();
        }
    }

    onMonthPickerTitleClick() {
        this.monthPicker.hide();
    }

    onYearPickerTitleClick() {
        this.yearPicker.hide();
    }

    onMonthPicked({ value, source }) {
        const me = this;

        me.gotoDate(DateHelper.add(me.activeDate, value - me.activeDate.getMonth(), 'month'));

        // Move focus without scroll *before* focus reversion from the hide.
        // Browser behaviour of scrolling to focused element would break animation.
        me.focusElement?.focus({ preventScroll : true });
        source.hide();
    }

    onYearPicked({ value, source }) {
        const newDate = new Date(this.activeDate);

        newDate.setFullYear(value);
        this.activeDate = newDate;

        // Move focus without scroll *before* focus reversion from the hide.
        // Browser behaviour of scrolling to focused element would break animation.
        this.focusElement?.focus({ preventScroll : true });
        source.hide();
    }

    changeMonthPicker(monthPicker, oldMonthPicker) {
        return MonthPicker.reconfigure(oldMonthPicker, monthPicker ? MonthPicker.mergeConfigs({
            owner    : this,
            appendTo : this.element
        }, monthPicker) : null, this);
    }

    changeYearPicker(yearPicker, oldYearPicker) {
        return YearPicker.reconfigure(oldYearPicker, yearPicker ? YearPicker.mergeConfigs({
            owner    : this,
            appendTo : this.element,
            minYear  : this.minDate?.getFullYear(),
            maxYear  : this.maxDate?.getFullYear()
        }, yearPicker) : null, this);
    }

    get childItems() {
        const
            { _yearPicker, _monthPicker } = this,
            result          = super.childItems;

        if (_yearPicker) {
            result.push(_yearPicker);
        }

        if (_monthPicker) {
            result.push(_monthPicker);
        }

        return result;
    }

    updateLocalization() {
        const
            me = this,
            { monthButton } = me.widgetMap;

        if (monthButton && !me.isConfiguring) {
            monthButton.text = DateHelper.format(me.month.date, me.monthButtonFormat);
        }

        super.updateLocalization();
    }

    changeMultiSelect(value) {
        if (value === 'range' && BrowserHelper.isTouchDevice) {
            value = 'simple';
        }

        return value;
    }
}

// Register this widget type with its Factory
DatePicker.initClass();
