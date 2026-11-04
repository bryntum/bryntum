import Carousel from './Carousel.js';
import DateHelper from '../helper/DateHelper.js';
import DomHelper from '../helper/DomHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import DatePicker from './DatePicker.js';
import Fencible from '../mixin/Fencible.js';

DomHelper.loadStylesheet('Core/widget/MultiDatePicker.css');

// import Stylesheet from './MultiDatePicker.css' with { type : 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'MultiDatePicker');

/**
 * @module Core/widget/MultiDatePicker
 */

const
    { isArray }    = Array,
    getMonthNumber = date => date.getFullYear() * 12 + date.getMonth();

/**
 * This widget allows date selection presented across multiple {@link Core.widget.DatePicker date pickers}. The API
 * matches closely to a `DatePicker` since the only meaningful difference in functionality is the use of a carousel to
 * present multiple months at the same time. This widget is a part of `DateRangePicker`.
 *
 * @extends Core/widget/Carousel
 * @internalwidget
 */
export default class MultiDatePicker extends Carousel.mixin(Fencible) {
    static $name = 'MultiDatePicker';
    static type = 'multidatepicker';

    static configurable = {
        configureSlot       : 'configureDatePicker',
        disableReserveSlots : 'inert',
        slots               : 2,

        /**
         * The date that corresponds to carousel slot index 0.
         * @config {Date}
         * @internal
         * @readonly
         */
        baseDate : {
            $config : 'day',
            value   : 'today'
        },

        /**
         * A function (or the name of a function) which creates content in, and may mutate a day cell element.
         *
         * See {@link Core.widget.CalendarPanel#config-cellRenderer}.
         *
         * @config {Function|String}
         * @param {Object} context Renderer context data
         * @param {HTMLElement} context.cell The header element
         * @param {Date} context.date The date for the cell
         * @param {Number} context.day The day for the cell (`0` to `6` for Sunday to Saturday)
         * @param {Number[]} context.rowIndex The row index, 0 to month row count
         * @param {HTMLElement} context.row The row element encapsulating the week which the cell is a part of
         * @param {Core.widget.CalendarPanel} context.source The widget being rendered
         * @param {Number[]} context.cellIndex The cell index in the whole panel. May be from `0` to up to `42`
         * @param {Number[]} context.columnIndex The column index, `0` to `6`
         * @param {Number[]} context.visibleColumnIndex The visible column index taking hidden non-working days into
         *   account
         * @returns {String|DomConfig|null}
         */
        cellRenderer : null,

        /**
         * A function (or the name of a function) which creates content in, and may mutate a day header element.
         *
         * See {@link Core.widget.CalendarPanel#config-headerRenderer}.
         *
         * @config {Function|String}
         * @param {Object} context Renderer context data
         * @param {HTMLElement} context.cell The header element
         * @param {Number} context.day The day number conforming to the specified {@link #config-weekStartDay}. Will
         * be in the range `0` to `6`
         * @param {Number} context.weekDay The canonical day number where Monday is 0 and Sunday is
         * @returns {String|DomConfig|null}
         */
        headerRenderer : null,

        /**
         * A function (or the name of a function) which creates content in, and may mutate the week cell element at the
         * start of a week row.
         *
         * See {@link Core.widget.CalendarPanel#config-weekRenderer}.
         *
         * @config {Function|String}
         * @param {Object} context Renderer context data
         * @param {HTMLElement} context.cell The header element
         * @param {Number[]} context.week An array containing `[year, weekNumber]`
         * @returns {String|DomConfig|null}
         */
        weekRenderer : null,

        /**
         * The week start day, 0 meaning Sunday, 6 meaning Saturday.
         * Defaults to {@link Core.helper.DateHelper#property-weekStartDay-static}.
         * @config {Number}
         */
        weekStartDay : null,

        /**
         * The initially selected date.
         * @config {Date}
         */
        date : {
            $config : 'day',
            value   : 'today'
        },

        /**
         * The minimum selectable date. Selection of and navigation to dates prior
         * to this date will not be possible.
         * @config {Date}
         */
        minDate : {
            $config : 'day'
        },

        /**
         * The maximum selectable date. Selection of and navigation to dates after
         * this date will not be possible.
         * @config {Date}
         */
        maxDate : {
            $config : 'day'
        },

        /**
         * The configuration defaults for all date pickers in the carousel.
         * @config {DatePickerConfig}
         */
        datePickerDefaults : {
            type                : 'datepicker',
            activeDate          : null,
            animateTimeShift    : false,
            dayNameFormat       : 'd1',
            multiSelect         : 'range',
            trapFocus           : false,
            editMonth           : false,
            hideOtherMonthCells : true,

            internalListeners : {
                selectionChange : 'up.onDatePickerSelectionChange'
            },

            tbar : {
                items : {
                    prevMonth : {
                        onAction : 'up.onPrevMonthClick'
                    },
                    nextMonth : {
                        onAction : 'up.onNextMonthClick'
                    }
                }
            },
            yearPicker : {
                internalListeners : {
                    select : 'up.onYearPickedMulti'
                }
            }
        },

        /**
         * Set to `false` to hide the year indicator field, or a function that accepts a `Date` and returns the desired
         * visibility of the year field (`true` or `false`).
         * @config {Function}
         * @param {Date} date The `Date` to evaluate when `includeYear` is a function
         * @returns {Boolean} Return `true` to include the year indicator, `false` to hide it.
         * @default
         * @internal
         */
        includeYear : date => !date.getMonth(),

        items : {
            prevButton : {
                type         : 'button',
                positionable : 'before',
                cls          : 'b-multi-date-picker-nav-button b-multi-date-picker-prev-button b-icon b-icon-previous',
                onAction     : 'up.onPrevMonthClick',
                hideMode     : 'opacity',
                rendition    : 'text'
            },
            nextButton : {
                type         : 'button',
                positionable : 'after',
                cls          : 'b-multi-date-picker-nav-button b-multi-date-picker-next-button b-icon b-icon-next',
                onAction     : 'up.onNextMonthClick',
                hideMode     : 'opacity',
                rendition    : 'text'
            }
        },

        /**
         * Configure as `true` to enable selecting multiple discontiguous date ranges using click and Shift+click to
         * create ranges and Ctrl+click to select/deselect individual dates.
         *
         * Configure as `'range'` to enable selecting a single date range by selecting a start and end date. Hold
         * "SHIFT" button to select date range. Ctrl+click may add or remove dates to/from either end of the range.
         *
         * Set to `false` to not allow multiple date selection.
         * @config {Boolean|'range'}
         * @default false
         */
        multiSelect : null,

        /**
         * Set to `false` to hide the next and previous month buttons.
         * @config {Boolean|'inline'|'floating'}
         * @default
         */
        navButtons : true,

        /**
         * The current date range selection as an array of two `Date` objects.
         * @prp {Date[]}
         */
        selection : {
            $config : 'day[]'
        }
    };

    static fenced = {
        syncSelection : true
    };

    /**
     * Returns all date picker child widgets.
     * @member {Core.widget.DatePicker[]}
     * @readonly
     * @internal
     */
    get datePickers() {
        return this.items.filter(it => it.isDatePicker);
    }

    compose() {
        const { navButtons } = this;

        return {
            class : {
                'b-multi-date-picker-nav-buttons'         : navButtons,
                [`b-multi-date-picker-nav-${navButtons}`] : navButtons  // '-floating' or '-inline'
            }
        };
    }

    onInternalPaint(info) {
        if (info.firstPaint) {
            const
                me = this,
                { date } = me;

            date && me.unanimated(() => {
                // We are have not yet called super, so the following will not be processed in the scroll listeners
                me.scrollPos = me.posFromIndex(me.indexFromDate(date));
            });
        }

        super.onInternalPaint(info);
    }

    applyDate(date, startDateField, endDateField) {
        // Manage the selection change and push focus to either fieldStartDate or fieldEndDate
        const
            me                               = this,
            pickingStartDate                 = startDateField?.containsFocus,
            { _isUserAction : isUserAction } = me;

        let { selection } = me,
            fieldFocus    = pickingStartDate ? endDateField : startDateField;

        // This matches the behavior of Google's date range picker for Google Flights
        if (!selection || (pickingStartDate && date >= selection[1])) {
            fieldFocus = endDateField;
            selection = [date, date];
        }
        else if (pickingStartDate) {
            selection = [date, selection[1] || date];
        }
        else if (date < selection[0]) {
            fieldFocus = endDateField;
            selection = [date, selection[1] || date];
        }
        else {
            selection = [selection[0] || date, date];
        }

        fieldFocus?.focus();

        me._isUserAction = true;
        me.selection = selection;
        me._isUserAction = isUserAction;
    }

    changeIncludeYear(val) {
        if (typeof val === 'number') {
            val = [val];
        }

        return isArray(val) ? d => val.includes(d.getMonth() + 1) : val;  // fn, true|false, null are good as is
    }

    configureDatePicker(index, me, existing) {
        const
            { includeYear } = me,
            date            = DateHelper.add(me.baseDate, index, 'month');

        let config = {
            date,
            activeDate   : null, // index ? null : new Date(),
            includeYear  : includeYear(date),
            multiSelect  : me.multiSelect,
            selection    : me.selection,
            weekStartDay : me.weekStartDay
        };

        if (!existing) {
            config = DatePicker.mergeConfigs(me.datePickerDefaults, config, {
                cellRenderer   : me.cellRenderer,
                headerRenderer : me.headerRenderer,
                weekRenderer   : me.weekRenderer
            });
        }

        return config;
    }

    /**
     * Ensures that the given slot `date` is visible, scrolling if necessary to make it so.
     * @param {Object} options Options to configure which date should be visible and how to scroll if necessary.
     * @param {Date} [options.date] The date to make visible.
     * @param {Number} [options.index] The index of the slot (i.e., the month offset). This property is used by the
     * base-class (`Carousel`) but should not be used for this class. Instead, use `date`.
     * @param {Boolean} [options.animation] Pass `false` to disable scroll animation.
     * @method ensureVisible
     */

    /**
     * Decodes the `options` passed to {@link #function-ensureVisible} and ensures the object has the properties needed
     * by {@link Core.widget.Carousel#function-ensureVisible}.
     * @param {Object} options Options to configure which date should be visible and how to scroll if necessary.
     * @param {Date} [options.date] The date to make visible.
     * @param {Number} [options.index] The index of the slot (i.e., the month offset). This property is used by the
     * base-class (`Carousel`) but should not be used for this class. Instead, use `date`.
     * @param {Boolean} [options.animation] Pass `false` to disable scroll animation.
     * @internal
     */
    ensurePlan(options) {
        if (DateHelper.isDate(options)) {
            options = {
                date : options
            };
        }

        if (options.date) {
            options = {
                ...options,
                index : this.indexFromDate(options.date)
            };

            delete options.date;
        }

        return options;
    }

    getCell(date) {
        if (typeof date !== 'string') {
            date = DateHelper.makeKey(date);
        }

        return this.element.querySelector(`[data-date="${date}"]:not(.b-other-month)`);
    }

    indexFromDate(date) {
        return date ? getMonthNumber(date) - getMonthNumber(this.baseDate) : date;
    }

    onDatePickerSelectionChange({
        selection,
        userAction
    }) {
        if (userAction) {
            const
                me                               = this,
                { _isUserAction : isUserAction } = me;

            me._isUserAction = true;
            me.syncSelection('picker', selection);
            me._isUserAction = isUserAction;
        }
    }

    onNextMonthClick() {
        this.forward(this.animate);
    }

    onPrevMonthClick() {
        this.backward(this.animate);
    }

    onYearPickedMulti({
        source,
        value
    }) {
        const
            me                   = this,
            datePicker           = source.up('datepicker'),
            { focusableElement } = datePicker;

        // Move focus without scroll *before* focus reversion from the hide.
        // Browser behaviour of scrolling to focused element would break animation.
        focusableElement?.focus({ preventScroll : true });

        source.hide();

        value -= datePicker.activeDate.getFullYear();

        me.go(value * 12);
    }

    // atMax

    updateAtMax(atMax, was) {
        const {
            nextButton,
            prevButton
        } = this.widgetMap;

        super.updateAtMax(atMax, was);

        if (nextButton) {
            nextButton.containsFocus && prevButton?.focus();
            nextButton.isTabbable = !atMax;
            nextButton.hidden = atMax;
        }
    }

    // atMin

    updateAtMin(atMin, was) {
        const {
            nextButton,
            prevButton
        } = this.widgetMap;

        super.updateAtMin(atMin, was);

        if (prevButton) {
            prevButton.containsFocus && nextButton?.focus();
            prevButton.isTabbable = !atMin;
            prevButton.hidden = atMin;
        }
    }

    // date

    changeDate(date) {
        return DateHelper.clamp(date, this.minDate, this.maxDate);
    }

    updateDate(date) {
        if (date != null) {
            this.currentIndex = this.indexFromDate(date);
        }
    }

    // maxDate

    updateMaxDate() {
        this.syncDateRange();
    }

    // minDate

    updateMinDate() {
        this.syncDateRange();
    }

    syncDateRange() {
        this.range = [this.minDate, this.maxDate];
    }

    // navButtons

    changeNavButtons(navButtons) {
        if (navButtons === true) {
            navButtons = 'floating';
        }

        return navButtons;
    }

    // range

    changeRange(range, was) {
        if (isArray(range)) {
            let [min, max] = range,
                dates;

            if (DateHelper.isDate(min)) {
                min = this.indexFromDate(min);
                dates = true;
            }

            if (DateHelper.isDate(max)) {
                max = this.indexFromDate(max);
                dates = true;
            }

            if (dates) {
                range = [min, max];
            }
        }

        return super.changeRange(range, was);
    }

    // selection

    changeSelection(selection, was) {
        if (selection && ObjectHelper.isEqual(selection, was)) {
            selection = was;
        }

        return selection;
    }

    updateSelection(selection) {
        const me = this;

        me.syncSelection('selection', selection);

        if (!me.isConfiguring) {
            /**
             * Fires when a date or date range is selected. If {@link #config-multiSelect} is specified,
             * this will fire upon deselection and selection of dates.
             * @event selectionChange
             * @param {Core.widget.MultiDatePicker} source This MultiDatePicker.
             * @param {Date[]} selection The selected date. If {@link #config-multiSelect} is specified
             * this may be a two element array specifying start and end dates.
             * @param {Boolean} userAction This will be `true` if the change was caused by user interaction
             * as opposed to programmatic setting.
             */
            me.trigger('selectionChange', {
                selection,
                userAction : me._isUserAction
            });
        }
        else if (selection) {
            me.date = selection[0];
        }
    }

    /**
     * Synchronizes the `selection` config with each date pickers' selection.
     * @param {'picker'|'selection'} origin The origin of the change in selection
     * @param {Date[]} selection The new selection
     * @internal
     */
    syncSelection(origin, selection = this.selection) {
        const { datePickers } = this;

        if (origin !== 'selection') {
            this.selection = selection;
        }

        if (origin !== 'picker') {
            datePickers.forEach(dp => dp.selection = selection);
        }
    }
}

// Register this widget type with its Factory
MultiDatePicker.initClass();
