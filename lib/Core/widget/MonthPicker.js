import Panel from './Panel.js';
import EventHelper from '../helper/EventHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import DateHelper from '../helper/DateHelper.js';
import DomHelper from '../helper/DomHelper.js';

// Styling shared with YearPicker
DomHelper.loadStylesheet('Core/widget/YearPicker.css');

// import Stylesheet from './YearPicker.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'YearPicker');

/**
 * @module Core/widget/MonthPicker
 */

/**
 * A panel that displays all 12 months of the year and lets the user pick one. The {@link #config-month} property
 * reflects and controls the selected month (0-based, 0–11). The {@link #event-select} event fires when the user
 * picks a month, and {@link #event-titleClick} fires when the panel's title (showing the current year) is clicked —
 * useful for navigating to a {@link Core.widget.YearPicker}.
 *
 * {@inlineexample Core/widget/MonthPicker.js}
 *
 * ```javascript
 * const monthPicker = new MonthPicker({
 *     month    : new Date().getMonth(),
 *     appendTo : document.body,
 *     onSelect({ value }) {
 *         console.log('Selected month:', value);
 *     }
 * });
 * ```
 *
 * ## Useful configs and events
 *
 * | Config / Event            | Description                           |
 * |---------------------------|---------------------------------------|
 * | {@link #config-month}     | The selected month (0-based, 0–11)    |
 * | {@link #event-select}     | Fired when a month is selected        |
 * | {@link #event-titleClick} | Fired when the panel title is clicked |
 *
 * ## See also
 *
 * - {@link Core.widget.YearPicker} - Year selection panel
 * - {@link Core.widget.DatePicker} - Full date picker with day/month/year navigation
 *
 * @extends Core/widget/Panel
 * @classtype monthpicker
 * @widget
 */
export default class MonthPicker extends Panel {

    static $name = 'MonthPicker';

    static type = 'monthpicker';

    static configurable = {
        rendition : {
            button : 'text'
        },

        textContent : false,

        tbar : {
            overflow : null,
            items    : {
                title : {
                    type     : 'button',
                    cls      : 'b-month-picker-title',
                    onAction : 'up.handleTitleClick'
                }
            }
        },

        itemCls : 'b-month-container',

        /**
         * The month to use as the selected month (zero-based, 0-11). Defaults to the current month.
         * @prp {Number} month
         **/
        month : null
    };

    construct(config) {
        super.construct({
            month : new Date().getMonth(),
            ...config
        });

        EventHelper.on({
            element  : this.contentElement,
            click    : 'onMonthClick',
            delegate : '.b-month-picker-month',
            thisObj  : this
        });
    }

    get focusElement() {
        return this.getMonthButton(this.month);
    }

    getMonthButton(month) {
        return this.contentElement.querySelector(`.b-month-picker-month[data-month="${month}"]`);
    }

    onMonthClick({ target }) {
        target = target.closest('.b-month-picker-month');

        const clickedMonth = parseInt(target.getAttribute('data-month'));

        // The updater won't run, so fire the select event here.
        if (this.month === clickedMonth) {
            this.trigger('select', { oldValue : clickedMonth, value : clickedMonth });
        }
        else {
            this.month = clickedMonth;
        }
    }

    handleTitleClick(event) {
        /**
         * Fires when the month title of this Panel is clicked.
         * @event titleClick
         * @param {Core.widget.Button} source The clicked button
         * @param {Event} event DOM event
         */
        this.trigger('titleClick', event);
    }

    changeMonth(month) {
        if (!isNaN(month)) {
            return ObjectHelper.isDate(month)
                ? month.getMonth()
                : month >= 0 && month <= 11
                    ? month
                    : undefined;
        }
    }

    updateMonth(month, oldValue) {
        if (!this.isConfiguring) {
            /**
             * Fired when a month is selected.
             * @event select
             * @param {Number} value The previously selected month.
             * @param {Core.widget.MonthPicker} source This MonthPicker
             */
            this.trigger('select', { oldValue, value : month });
        }
    }

    composeBody() {
        // Must be ingested before first compose.
        this.getConfig('month');

        const
            result   = super.composeBody(),
            buttonRendition = this.rendition?.button,
            children = result.children[this.tbar ? 1 : 0].children = [];

        this.widgetMap.title.text = DateHelper.getMonthName(this.month);

        for (let month = 0; month <= 11; month++) {
            children.push({
                tag     : 'button',
                dataset : { month },
                class   : {
                    'b-widget '            : 1,
                    'b-button'             : 1,
                    'b-button-elevated'    : buttonRendition === 'elevated',
                    'b-button-filled'      : buttonRendition === 'filled',
                    'b-button-tonal'       : buttonRendition === 'tonal',
                    'b-button-outlined'    : buttonRendition === 'outlined',
                    'b-button-text'        : buttonRendition === 'text' || !buttonRendition,
                    'b-text'               : 1,
                    'b-month-picker-month' : 1,
                    'b-selected'           : month === this.month
                },
                children : [
                    {
                        tag  : 'label',
                        text : DateHelper.getMonthShortName(month)
                    }
                ]
            });
        }

        return result;
    }

    async updateLocalization() {
        if (!this.isConfiguring) {
            await this.recompose();
        }

        super.updateLocalization();
    }
}

// Register this widget type with its Factory
MonthPicker.initClass();
