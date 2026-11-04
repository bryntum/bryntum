import Container from './Panel.js';
import DateHelper from '../helper/DateHelper.js';
import DomHelper from '../helper/DomHelper.js';
import TimeZonable from '../mixin/TimeZonable.js';

DomHelper.loadStylesheet('Core/widget/TimePicker.css');

// import Stylesheet from './TimePicker.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TimePicker');

/**
 * @module Core/widget/TimePicker
 */
const
    hours   = Array.from(Array(24)).map((_, i) => {
        return { id : i, text : String(i + 100).slice(1) };
    }),
    seconds = Array.from(Array(60)).map((_, i) => {
        return { id : i, text : String(i + 100).slice(1) };
    });

/**
 * A floating picker panel that displays scrollable hour, minute, and optionally second columns for time selection.
 * Each column is a {@link Core.widget.List} that the user can scroll or click to pick a value. This widget is used
 * internally as the picker for {@link Core.widget.TimeField} and is not typically instantiated directly.
 *
 * ```javascript
 * new TimeField({
 *     label    : 'Time field',
 *     appendTo : document.body,
 *     // Configure the time picker
 *     picker   : {
 *         cls : 'my-picker-class'
 *     }
 * });
 * ```
 *
 * ## Contained widgets
 *
 * The default widgets contained in this picker are:
 *
 * | Widget ref | Type                     | Description       |
 * |------------|--------------------------|-------------------|
 * | `hour`     | {@link Core.widget.List} | The hour picker   |
 * | `minute`   | {@link Core.widget.List} | The minute picker |
 * | `second`   | {@link Core.widget.List} | The second picker |
 *
 * ## See also
 *
 * - {@link Core.widget.TimeField} - Text input field that uses this picker
 * - {@link Core.widget.DateTimeField} - Combined date and time field
 *
 * This class is not intended for direct use in applications. It is used internally by the
 * {@link Core.widget.TimeField} class.
 *
 * @extends Core/widget/Container
 * @classtype timepicker
 * @widget
 */
export default class TimePicker extends TimeZonable(Container) {

    // <debug>
    // region Localization test
    static localization = [
        'L{hour}',
        'L{minute}',
        'L{second}'
    ];
    // endregion
    // </debug>

    //region Config

    static $name = 'TimePicker';

    static type = 'timepicker';

    static configurable = {
        rendition : {
            button      : 'text',
            numberfield : 'outlined'
        },

        floating : true,
        layout   : 'hbox',
        defaults : {
            type         : 'list',
            displayField : 'id',
            itemTpl(r) {
                const
                    value      = r.id,
                    displayVal = this.ref !== 'hour' || this.owner.is24Hour || value ? value : 12;

                return String(displayVal + 100).slice(1);
            },
            itemCls        : 'b-time-picker-item',
            itemsFocusable : false,
            scrollable     : {
                overflowY : 'hidden-scroll'
            },
            onSelectionChange : 'up.onSelectionChange',
            navigator         : {
                activateOnMouseover : true
            }
        },
        items : {
            hour : {
                items : hours
            },
            minute : {
                items : []
            },
            second : {
                hidden : true,
                items  : seconds
            }
        },

        step : {
            magnitude : 5,
            unit      : 'm'
        },

        autoShow : false,

        trapFocus : true,

        /**
         * Time value, which can be a Date or a string. If a string is specified, it will be converted using the
         * specified {@link #config-format}
         * @prp {Date}
         * @accepts {Date|String}
         */
        value : {
            $config : {
                equal : 'date'
            },
            value : null
        },

        /**
         * Time format. Used to set appropriate 12/24 hour format to display.
         * See {@link Core.helper.DateHelper#function-format-static DateHelper} for formatting options.
         * @prp {String}
         */
        format : null,

        /**
         * Max value, which can be a Date or a string. If a string is specified, it will be converted using the
         * specified {@link #config-format}
         * @prp {Date}
         * @accepts {Date|String}
         */
        max : null,

        /**
         * Min value, which can be a Date or a string. If a string is specified, it will be converted using the
         * specified {@link #config-format}
         * @prp {Date}
         * @accepts {Date|String}
         */
        min : null,

        is24Hour : {
            $config : 'lazy',
            value   : null
        },

        /**
         * Initial value, which can be a Date or a string. If a string is specified, it will be converted using the
         * specified {@link #config-format}. Initial value is restored on Escape click
         * @member {Date} initialValue
         * @accepts {Date|String}
         */
        initialValue : null // Not documented as config on purpose, API was that way
    };

    //endregion



    alignTo(...args) {
        const
            { widgetMap }      = this,
            { minute, second } = this.owner.input;

        this.getConfig('is24Hour');

        // The step count defines the number of minute blocks.
        // Shrink total height to match that if wanted.
        if (this.minimizeHeight) {
            widgetMap.hour.maxHeight = widgetMap.second.maxHeight = widgetMap.minute.height;
        }
        widgetMap.minute[minute ? 'show' : 'hide']();
        widgetMap.second[second ? 'show' : 'hide']();

        return super.alignTo(...args);
    }

    updateIs24Hour(is24Hour) {
        this.widgetMap.hour.store.filter(t => is24Hour ? true : t.id < 12);
    }

    updateStep(step) {
        if (!step) {
            step = { magnitude : 5, unit : 'm' };
        }

        step = DateHelper.as('m', step.magnitude, step.unit);

        const minuteValues = [];

        for (let minutes = 0; minutes < 60; minutes += step) {
            minuteValues.push({
                id   : minutes,
                text : String(100 + minutes).slice(1)
            });
        }
        this.widgetMap.minute.store.data = minuteValues;
    }

    //region Event listeners

    onSelectionChange({ source, selected : [selectedItem] }) {
        const me = this;

        me._isUserAction = source._isUserAction;

        // Keep UI in sync in case selection was programatic, and not instigated by the UI.
        source.navigator.activeItem = selectedItem;

        // Update our value unless we are here because we are updating the value.
        if (!me.updatingValue) {
            me.owner.input.setSubFieldValue(source.ref, selectedItem.id);
        }
        me._isUserAction = false;
    }

    //endregion

    //region Internal functions

    triggerTimeChange(time) {
        /**
         * Fires when a time is changed.
         * @event timeChange
         * @param {Date} time The selected time.
         */
        this.trigger('timeChange', { time });
    }

    //endregion

    //region Getters / Setters

    updateInitialValue(initialValue) {
        this.value = initialValue;
    }

    changeValue(value) {
        if (value) {
            value = typeof value === 'string' ? DateHelper.parse(value, this.format) : value;
        }
        return value ?? this.dateHelper.getTime(0);
    }

    updateValue(value) {
        const
            me      = this,
            {
                hour,
                minute,
                second
            }       = me.widgetMap,
            h       = me.dateHelper.getHours(value),
            hours   = me.is24Hour ? h : h % 12,
            minutes = me.dateHelper.getMinutes(value),
            seconds = me.dateHelper.getSeconds(value);

        me.updatingValue = true;

        // We wrap the value in a Number object so that it is used as the ID of the
        // record to select, not the index. This is because of filtering.
        hour.navigator.activeItem = new Number(hours);
        hour.select(hours, true);
        minute.navigator.activeItem = new Number(minutes);
        minute.select(minutes, true);
        second.navigator.activeItem = new Number(seconds);
        second.select(seconds, true);

        me.updatingValue = false;

        // Re-run the filter to ensure the minutes and seconds are filtered correctly
        minute.store.filter();
        second.store.filter();

        if (me.isVisible) {
            me.triggerTimeChange(value);
        }
    }

    changeMin(min) {
        return typeof min === 'string' ? DateHelper.parse(min, this.format) : min;
    }

    updateMin(min) {
        const
            {
                hour,
                minute,
                second
            }                   = this.widgetMap,
            { owner, is24Hour } = this;

        if (min) {
            const
                { dateHelper } = this,
                minHours       = dateHelper.getHours(min),
                minMinutes     = dateHelper.getMinutes(min),
                minSeconds     = dateHelper.getSeconds(min);

            hour.store.filter({
                id       : 'min-filter',            // no-sanity
                filterBy : ({ id }) => {
                    // Handle minHour:9, but if the field 12 hour and is in the PM,
                    // then 0 to 11 means 12 to 23.
                    if (!is24Hour && dateHelper.getHours(owner.value) >= 12) {
                        id += 12;
                    }
                    return id >= minHours;
                }
            });
            minute.store.filter({
                id       : 'min-filter',            // no-sanity
                // Only filter minutes if the selected hour is the minimum hour
                filterBy : ({ id }) => dateHelper.getHours(owner.value) !== minHours || id >= minMinutes
            });
            second.store.filter({
                id       : 'min-filter',            // no-sanity
                filterBy : ({ id }) => {
                    const { value } = owner;

                    return (dateHelper.getHours(value) * 60 + dateHelper.getMinutes(value) > minHours * 60 + minMinutes) ||
                        id >= minSeconds;
                }
            });
        }
        else {
            hour.store.removeFilter('min-filter');
            minute.store.removeFilter('min-filter');
            second.store.removeFilter('min-filter');
        }
    }

    changeMax(max) {
        return typeof max === 'string' ? DateHelper.parse(max, this.format) : max;
    }

    updateMax(max) {
        const
            {
                hour,
                minute,
                second
            } = this.widgetMap;

        if (max) {
            const
                { dateHelper } = this,
                minHours       = dateHelper.getHours(max),
                minMinutes     = dateHelper.getMinutes(max),
                minSeconds     = dateHelper.getSeconds(max);

            hour.store.filter({
                id       : 'max-filter',            // no-sanity
                filterBy : ({ id }) => id <= minHours
            });
            minute.store.filter({
                id       : 'max-filter',            // no-sanity
                filterBy : ({ id }) => id <= minMinutes
            });
            second.store.filter({
                id       : 'max-filter',            // no-sanity
                filterBy : ({ id }) => id <= minSeconds
            });
        }
        else {
            hour.store.removeFilter('max-filter');
            minute.store.removeFilter('max-filter');
            second.store.removeFilter('max-filter');
        }
    }

    //endregion
}

// Register this widget type with its Factory
TimePicker.initClass();
