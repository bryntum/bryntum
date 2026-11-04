import DateHelper from '../../Core/helper/DateHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import ViewPreset from './ViewPreset.js';
import PresetStore from './PresetStore.js';

// No module tag here. That stops the singleton from being included by the docs.

/**
 * ## Intro
 * This is a global Store of {@link Scheduler.preset.ViewPreset ViewPresets}, required to supply initial data to
 * Scheduler's {@link Scheduler.view.mixin.TimelineViewPresets#config-presets}.
 *
 * You can provide new view presets globally or for a specific scheduler.
 *
 * **NOTE:** You **cannot** modify existing records in the PresetManager store. You can either remove
 * preset records from the store or add new records to the store.
 * Also please keep in mind, all changes provided to the PresetManager store are not reflected to the
 * {@link Scheduler.view.mixin.TimelineViewPresets#config-presets} of schedulers that already exist!
 *
 * If you want to have just a few presets (also known as zoom levels) in your Scheduler, you can slice corresponding records
 * from the `PresetManager` and apply them to the Scheduler `presets` config.
 * ```javascript
 * const newPresets = PresetManager.records.slice(10, 12);
 *
 * const scheduler = new Scheduler({
 *     presets    : newPresets, // Only 2 zoom levels are available
 *     viewPreset : newPresets[0].id
 * });
 * ```
 *
 * If you want to adjust all default presets and assign to a specific scheduler you are going to create,
 * you can extend them and pass as an array to the Scheduler `presets` config.
 * Here is an example of how to set the same `timeResolution` to all `ViewPresets`.
 * ```javascript
 * const newPresets = PresetManager.map(preset => {
 *     return {
 *         id             : 'my_' + preset.id,
 *         base           : preset.id, // Based on an existing preset
 *         timeResolution : {
 *             unit      : 'day',
 *             increment : 1
 *         }
 *     };
 * });
 *
 * const scheduler = new Scheduler({
 *     presets     : newPresets,
 *     viewPreset : 'my_hourAndDay'
 * });
 * ```
 *
 * If you want to do the same for **all** schedulers which will be created next, you can register new presets in a loop.
 * ```javascript
 * PresetManager.records.forEach(preset => {
 *     // Pass the same ID, so when a new preset is added to the store,
 *     // it will replace the current one.
 *     PresetManager.registerPreset(preset.id, {
 *        id             : preset.id,
 *        base           : preset.id,
 *        timeResolution : {
 *            unit      : 'day',
 *            increment : 1
 *        }
 *    });
 * });
 * ```
 *
 * Here is an example of how to add a new `ViewPreset` to the global `PresetManager` store and to the already created
 * scheduler `presets`.
 * ```javascript
 * const scheduler = new Scheduler({...});
 *
 * const newGlobalPresets = PresetManager.add({
 *     id              : 'myNewPreset',
 *     base            : 'hourAndDay', // Based on an existing preset
 *     columnLinesFor  : 0,
 *     // Override headers
 *     headers : [
 *         {
 *             unit       : 'day',
 *             // Use different date format for top header 01.10.2020
 *             dateFormat : 'DD.MM.YYYY'
 *         },
 *         {
 *             unit       : 'hour',
 *             dateFormat : 'LT'
 *         }
 *     ]
 * });
 *
 * // Add new presets to the scheduler that has been created before changes
 * // to PresetManager are applied
 * scheduler.presets.add(newGlobalPresets);
 * ```
 *
 * ## Predefined presets
 *
 * Predefined presets are:
 *
 * - `secondAndMinute` - creates a 2 level header - minutes and seconds:
 * {@inlineexample Scheduler/preset/secondAndMinute.js}
 * - `minuteAndHour` - creates a 2 level header - hours and minutes:
 * {@inlineexample Scheduler/preset/minuteAndHour.js}
 * - `hourAndDay` - creates a 2 level header - days and hours:
 * {@inlineexample Scheduler/preset/hourAndDay.js}
 * - `sixHoursAndDay` - creates a 2 level header - days and 6 hour blocks:
 * {@inlineexample Scheduler/preset/sixHoursAndDay.js}
 * - `amPm` - creates a 2 level header - days and AM/PM halves:
 * {@inlineexample Scheduler/preset/amPm.js}
 * - `dayAndWeek` - creates a 2 level header - weeks and days:
 * {@inlineexample Scheduler/preset/dayAndWeek.js}
 * - `dayAndMonth` - creates a 2 level header - months and days:
 * {@inlineexample Scheduler/preset/dayAndMonth.js}
 * - `weekAndDay` - just like `dayAndWeek` but with different formatting:
 * {@inlineexample Scheduler/preset/weekAndDay.js}
 * - `weekAndDayLetter` - creates a 2 level header - weeks and day letters:
 * {@inlineexample Scheduler/preset/weekAndDayLetter.js}
 * - `weekAndMonth` - creates a 2 level header - months and weeks:
 * {@inlineexample Scheduler/preset/weekAndMonth.js}
 * - `weekDateAndMonth` - creates a 2 level header - months and weeks (weeks shown by first day only):
 * {@inlineexample Scheduler/preset/weekDateAndMonth.js}
 * - `monthAndYear` - creates a 2 level header - years and months:
 * {@inlineexample Scheduler/preset/monthAndYear.js}
 * - `year` - creates a 2 level header - years and quarters:
 * {@inlineexample Scheduler/preset/year.js}
 * - `manyYears` - creates a 2 level header - 5-years and years:
 * {@inlineexample Scheduler/preset/manyYears.js}
 *
 * See the {@link Scheduler.preset.ViewPreset} and {@link Scheduler.preset.ViewPresetHeaderRow} classes for a
 * description of the view preset properties.
 *
 * ## Localizing View Presets
 * Bryntum Scheduler uses locales for translations including date formats for view presets.
 *
 * To translate date format for view presets just define the date format for the specified region
 * for your locale file, like this:
 * ```javascript
 * const locale = {
 *
 *     localeName : 'En',
 *
 *     // ... Other translations here ...
 *
 *     PresetManager : {
 *         // Translation for the "weekAndDay" ViewPreset
 *         weekAndDay : {
 *             // Change the date format for the top and middle levels
 *             topDateFormat    : 'MMM',
 *             middleDateFormat : 'D'
 *         },
 *         // Translation for the "dayAndWeek" ViewPreset
 *         dayAndWeek : {
 *             // Change the date format for the top level
 *             topDateFormat : 'MMMM YYYY'
 *         }
 *     }
 * }
 *
 * LocaleManager.applyLocale(locale);
 * ```
 *
 * Check the <a target="_blank" href="../examples/localization/">localization demo</a> and [this guide](#Scheduler/guides/customization/localization.md) for more details.
 *
 * ## See also
 *
 * - {@link Scheduler.preset.ViewPreset} - View preset configuration
 * - {@link Scheduler.preset.PresetStore} - Preset store
 * - {@link Scheduler.widget.ViewPresetCombo} - Combo for selecting presets
 *
 * @singleton
 * @extends Scheduler/preset/PresetStore
 * @tier community
 */
class PresetManager extends PresetStore {

    // <debug>
    // region Localization test
    static localization = [
        'L{secondAndMinute}',
        'L{minuteAndHour}',
        'L{hourAndDay}',
        'L{dayAndWeek}',
        'L{weekAndDay}',
        'L{day}',
        'L{week}',
        'L{dayAndMonth}',
        'L{weekAndMonth}',
        'L{weekAndDayLetter}',
        'L{weekDateAndMonth}',
        'L{monthAndYear}',
        'L{year}',
        'L{manyYears}'
    ];
    // endregion
    // </debug>

    static $name = 'PresetManager';

    static configurable = {
        // To not break CSP demo
        preventSubClassingModel : true,

        basePresets : {
            secondAndMinute : {
                name              : 'Seconds',
                tickWidth         : 30,   // Time column width
                tickHeight        : 40,
                minTickWidth      : 20,
                minTickHeight     : 15,
                displayDateFormat : 'll LTS', // Controls how dates will be displayed in tooltips etc
                shiftIncrement    : 10,     // Controls how much time to skip when calling shiftNext and shiftPrevious.
                shiftUnit         : 'minute', // Valid values are "millisecond", "second", "minute", "hour", "day", "week", "month", "quarter", "year".
                defaultSpan       : 24,    // By default, if no end date is supplied to a view it will show 24 hours
                timeResolution    : {      // Dates will be snapped to this resolution
                    unit      : 'second',  // Valid values are "millisecond", "second", "minute", "hour", "day", "week", "month", "quarter", "year".
                    increment : 5
                },
                // This defines your header rows.
                // For each row you can define "unit", "increment", "dateFormat", "renderer", "align", and "thisObj"
                headers : [
                    {
                        unit       : 'minute',
                        dateFormat : 'lll'
                    },
                    {
                        unit       : 'second',
                        increment  : 10,
                        dateFormat : 'ss'
                    }
                ],
                useForSmoothZoom : false
            },
            fifteenMinutesAndHour : {
                name              : '15 Minutes',
                tickWidth         : 60,
                tickHeight        : 60,
                minTickWidth      : 60,
                minTickHeight     : 40,
                displayDateFormat : 'll LT',
                shiftIncrement    : 1,
                shiftUnit         : 'hour',
                defaultSpan       : 24,
                timeResolution    : {
                    unit      : 'minute',
                    increment : 15
                },
                headers : [
                    {
                        unit       : 'hour',
                        dateFormat : 'ddd MM/DD, hA'
                    },
                    {
                        unit       : 'minute',
                        increment  : 15,
                        dateFormat : 'mm'
                    }
                ],
                useForLegacyZoom : false
            },
            minuteAndHour : {
                name              : 'Minutes',
                tickWidth         : 70,    // Time column width
                tickHeight        : 60,
                minTickWidth      : 60,
                minTickHeight     : 40,
                displayDateFormat : 'll LT', // Controls how dates will be displayed in tooltips etc
                shiftIncrement    : 1,     // Controls how much time to skip when calling shiftNext and shiftPrevious.
                shiftUnit         : 'hour', // Valid values are "MILLI", "SECOND", "minute", "HOUR", "DAY", "WEEK", "MONTH", "QUARTER", "YEAR".
                defaultSpan       : 24,    // By default, if no end date is supplied to a view it will show 24 hours
                timeResolution    : {      // Dates will be snapped to this resolution
                    unit      : 'minute',  // Valid values are "MILLI", "SECOND", "minute", "HOUR", "DAY", "WEEK", "MONTH", "QUARTER", "YEAR".
                    increment : 15
                },
                headers : [
                    {
                        unit       : 'hour',
                        dateFormat : 'ddd MM/DD, hA'
                    },
                    {
                        unit       : 'minute',
                        increment  : 30,
                        dateFormat : 'mm'
                    }
                ]
            },
            hourAndDay : {
                name              : 'Day',
                tickWidth         : 70,
                tickHeight        : 40,
                minTickWidth      : 43,
                minTickHeight     : 20,
                displayDateFormat : 'll LT',
                shiftIncrement    : 1,
                shiftUnit         : 'day',
                defaultSpan       : 24,
                timeResolution    : {
                    unit      : 'minute',
                    increment : 30
                },
                headers : [
                    {
                        unit       : 'day',
                        dateFormat : 'ddd DD/MM' //Mon 01/10
                    },
                    {
                        unit       : 'hour',
                        dateFormat : 'LT'
                    }
                ]
            },
            sixHoursAndDay : {
                name              : 'Six hours',
                tickWidth         : 60,
                tickHeight        : 40,
                // Just enough for the widest label ("12AM"). Keeping it tight also keeps the handover from
                // `weekAndDayLetter` tight, since that preset stretches until a tick here fits
                minTickWidth      : 48,
                minTickHeight     : 20,
                displayDateFormat : 'll LT',
                shiftIncrement    : 1,
                shiftUnit         : 'day',
                defaultSpan       : 24,
                timeResolution    : {
                    unit      : 'minute',
                    increment : 30
                },
                headers : [
                    {
                        unit       : 'day',
                        dateFormat : 'ddd DD/MM' //Mon 01/10
                    },
                    {
                        unit       : 'hour',
                        increment  : 6,
                        dateFormat : 'hA'
                    }
                ],
                // Keeps the 12AM/6AM/12PM/6PM sequence aligned across DST transitions
                preserveHoursAcrossDST : true,
                useForLegacyZoom       : false
            },
            amPm : {
                name              : 'AM/PM',
                tickWidth         : 150,
                tickHeight        : 40,
                minTickWidth      : 40,
                minTickHeight     : 20,
                displayDateFormat : 'll LT',
                shiftIncrement    : 1,
                shiftUnit         : 'day',
                defaultSpan       : 24,
                timeResolution    : {
                    unit      : 'minute',
                    increment : 30
                },
                headers : [
                    {
                        unit       : 'day',
                        dateFormat : 'ddd DD/MM' //Mon 01/10
                    },
                    {
                        unit      : 'hour',
                        increment : 12,
                        renderer(value) {
                            return DateHelper.format(value, 'A');
                        }
                    }
                ],
                useForLegacyZoom : false
            },
            day : {
                name              : 'Day/hours',
                displayDateFormat : 'LT',
                shiftIncrement    : 1,
                shiftUnit         : 'day',
                defaultSpan       : 1,
                timeResolution    : {
                    unit      : 'minute',
                    increment : 30
                },
                mainHeaderLevel : 0,
                headers         : [
                    {
                        unit       : 'day',
                        dateFormat : 'ddd DD/MM', // Mon 01/02
                        splitUnit  : 'day'
                    },
                    {
                        unit : 'hour',
                        renderer(value) {
                            return `
                                <div class="b-sch-calendarcolumn-ct"><span class="b-sch-calendarcolumn-hours">${DateHelper.format(value, 'HH')}</span>
                                <span class="b-sch-calendarcolumn-minutes">${DateHelper.format(value, 'mm')}</span></div>
                            `;
                        }
                    }
                ]
            },
            week : {
                name              : 'Week/hours',
                displayDateFormat : 'LT',
                shiftIncrement    : 1,
                shiftUnit         : 'week',
                defaultSpan       : 24,
                timeResolution    : {
                    unit      : 'minute',
                    increment : 30
                },
                mainHeaderLevel : 0,
                headers         : [
                    {
                        unit       : 'week',
                        dateFormat : 'D d',
                        splitUnit  : 'day'
                    },
                    {
                        unit       : 'hour',
                        dateFormat : 'LT',    // will be overridden by renderer
                        renderer(value) {
                            return `
                                <div class="sch-calendarcolumn-ct">
                                <span class="sch-calendarcolumn-hours">${DateHelper.format(value, 'HH')}</span>
                                <span class="sch-calendarcolumn-minutes">${DateHelper.format(value, 'mm')}</span>
                                </div>
                            `;
                        }
                    }
                ]
            },
            dayAndWeek : {
                name              : 'Days & Weeks',
                tickWidth         : 100,
                tickHeight        : 80,
                displayDateFormat : 'll LT',
                shiftUnit         : 'day',
                shiftIncrement    : 1,
                defaultSpan       : 5,
                timeResolution    : {
                    unit      : 'hour',
                    increment : 1
                },
                headers : [
                    {
                        unit : 'week',
                        renderer(start) {
                            // Use the view's (timezone-aware) DateHelper so week numbers/labels are computed in the
                            // view's zone. `this` is the TimeAxisViewModel; fall back to the static DateHelper if
                            // unavailable. Resolve weekStartDay from the time axis / owner rather than the
                            // DateHelper's `weekStartDay` getter — that getter reflects the shared/static value, not
                            // a per-instance (per-view) setting, and the TimeAxisViewModel only applies the owner's
                            // weekStartDay to its dateHelper transiently during header generation.
                            const
                                dh           = this?.dateHelper || DateHelper,
                                weekStartDay = this?.timeAxis?.weekStartDay ?? this?.owner?.weekStartDay ?? dh.weekStartDay;

                            if (weekStartDay === 1) {
                                const
                                    [isoYear, isoWeek] = dh.getWeekNumber(start, weekStartDay),
                                    // Get the date for Thursday in that ISO week
                                    thursdayOfISOWeek  = dh.getDateFromISOWeek(isoYear, isoWeek, 4), // 4 = Thursday
                                    monthName          = dh.format(thursdayOfISOWeek, 'MMM');

                                return `${dh.getShortNameOfUnit('week')}.${String(isoWeek).padStart(2, '0')} ${monthName} ${isoYear}`;
                            }
                            else {
                                return dh.getShortNameOfUnit('week') + '.' + dh.format(start, 'WW MMM YYYY');
                            }
                        }

                    },
                    {
                        unit       : 'day',
                        dateFormat : 'dd DD'
                    }
                ],
                useForSmoothZoom : false
            },
            // dayAndMonth : {
            //     name              : 'Days & Months',
            //     tickWidth         : 100,
            //     tickHeight        : 80,
            //     displayDateFormat : 'll LT',
            //     shiftUnit         : 'day',
            //     shiftIncrement    : 1,
            //     defaultSpan       : 5,
            //     timeResolution    : {
            //         unit      : 'hour',
            //         increment : 1
            //     },
            //     headers : [
            //         {
            //             unit       : 'month',
            //             dateFormat : 'MMMM YYYY',
            //             align      : 'start'
            //         },
            //         {
            //             unit       : 'day',
            //             dateFormat : 'dd DD'
            //         }
            //     ]
            // },
            dayAndMonth : {
                name              : 'Month',
                tickWidth         : 100,
                tickHeight        : 80,
                displayDateFormat : 'll LT',
                shiftUnit         : 'month',
                shiftIncrement    : 1,
                defaultSpan       : 1,
                mainUnit          : 'month',
                timeResolution    : {
                    unit      : 'hour',
                    increment : 1
                },
                headers : [
                    {
                        unit       : 'month',
                        dateFormat : 'MMMM YYYY'
                    },
                    {
                        unit       : 'day',
                        dateFormat : 'DD'
                    }
                ],
                useForSmoothZoom : false
            },
            weekAndDay : {
                name              : 'Week',
                tickWidth         : 100,
                tickHeight        : 80,
                displayDateFormat : 'll hh:mm A',
                shiftUnit         : 'week',
                shiftIncrement    : 1,
                defaultSpan       : 1,
                timeResolution    : {
                    unit      : 'day',
                    increment : 1
                },
                mainHeaderLevel : 0,
                headers         : [
                    {
                        unit       : 'week',
                        dateFormat : 'YYYY MMMM DD' // 2017 January 01
                    },
                    {
                        unit       : 'day',
                        dateFormat : 'DD MMM'
                    }
                ],
                useForSmoothZoom : false
            },
            weekAndMonth : {
                name              : 'Weeks',
                tickWidth         : 100,
                tickHeight        : 105,
                displayDateFormat : 'll',
                shiftUnit         : 'week',
                shiftIncrement    : 5,
                defaultSpan       : 6,
                timeResolution    : {
                    unit      : 'day',
                    increment : 1
                },
                headers : [
                    {
                        unit       : 'month',
                        dateFormat : 'MMM YYYY' //Jan 2017
                    },
                    {
                        unit       : 'week',
                        dateFormat : 'DD MMM'
                    }
                ],
                useForSmoothZoom : false
            },
            weekAndDayLetter : {
                name              : 'Weeks/weekdays',
                tickWidth         : 20,
                tickHeight        : 50,
                displayDateFormat : 'll',
                shiftUnit         : 'week',
                shiftIncrement    : 1,
                defaultSpan       : 10,
                timeResolution    : {
                    unit      : 'day',
                    increment : 1
                },
                mainHeaderLevel : 0,
                headers         : [
                    {
                        unit                : 'week',
                        dateFormat          : 'ddd DD MMM YYYY',
                        verticalColumnWidth : 115
                    },
                    {
                        unit                : 'day',
                        dateFormat          : 'd1',
                        verticalColumnWidth : 25
                    }
                ]
            },
            weekDateAndMonth : {
                name              : 'Months/weeks',
                tickWidth         : 30,
                tickHeight        : 40,
                displayDateFormat : 'll',
                shiftUnit         : 'week',
                shiftIncrement    : 1,
                defaultSpan       : 10,
                timeResolution    : {
                    unit      : 'day',
                    increment : 1
                },
                headers : [
                    {
                        unit       : 'month',
                        dateFormat : 'YYYY MMMM'
                    },
                    {
                        unit       : 'week',
                        dateFormat : 'DD'
                    }
                ]
            },
            monthAndYear : {
                name              : 'Months',
                tickWidth         : 100,
                tickHeight        : 100,
                minTickWidth      : 64,
                displayDateFormat : 'll',
                shiftIncrement    : 3,
                shiftUnit         : 'month',
                defaultSpan       : 12,
                timeResolution    : {
                    unit      : 'day',
                    increment : 1
                },
                headers : [
                    {
                        unit       : 'year',
                        dateFormat : 'YYYY' //2017
                    },
                    {
                        unit       : 'month',
                        dateFormat : 'MMM YYYY' //Jan 2017
                    }
                ]
            },
            year : {
                name                : 'Years',
                tickWidth           : 100,
                tickHeight          : 100,
                minTickWidth        : 40,
                resourceColumnWidth : 100,
                displayDateFormat   : 'll',
                shiftUnit           : 'year',
                shiftIncrement      : 1,
                defaultSpan         : 1,
                mainHeaderLevel     : 0,
                timeResolution      : {
                    unit      : 'month',
                    increment : 1
                },
                headers : [
                    {
                        unit       : 'year',
                        dateFormat : 'YYYY'
                    },
                    {
                        unit : 'quarter',
                        renderer(start, end, cfg) {
                            return DateHelper.getShortNameOfUnit('quarter').toUpperCase() + (Math.floor(start.getMonth() / 3) + 1);
                        }
                    }
                ]
            },
            manyYears : {
                name              : 'Multiple years',
                tickWidth         : 40,
                tickHeight        : 50,
                displayDateFormat : 'll',
                shiftUnit         : 'year',
                shiftIncrement    : 1,
                defaultSpan       : 10,
                timeResolution    : {
                    unit      : 'year',
                    increment : 1
                },
                mainHeaderLevel : 0,
                headers         : [
                    {
                        unit      : 'year',
                        increment : 5,
                        renderer  : (start, end) => start.getFullYear() + ' - ' + end.getFullYear()
                    },
                    {
                        unit       : 'year',
                        dateFormat : 'YY',
                        increment  : 1
                    }
                ]
            }
        },

        // This is a list of bryntum-supplied preset adjustments used to create the Scheduler's
        // default initial set of ViewPresets.
        defaultPresets : [
            // Years over years
            'manyYears',
            { width : 80, increment : 1, resolution : 1, base : 'manyYears', resolutionUnit : 'YEAR', useForSmoothZoom : false, excludeForSmoothZoom : true },

            // Years over quarters
            'year',
            { width : 30,  increment : 1, resolution : 1, base : 'year', resolutionUnit : 'MONTH', useForSmoothZoom : false, excludeForSmoothZoom : true },
            { width : 50,  increment : 1, resolution : 1, base : 'year', resolutionUnit : 'MONTH', useForSmoothZoom : false, excludeForSmoothZoom : true },
            { width : 200, increment : 1, resolution : 1, base : 'year', resolutionUnit : 'MONTH', useForSmoothZoom : false, excludeForSmoothZoom : true },

            // Years over months
            'monthAndYear',

            // Months over weeks
            'weekDateAndMonth',

            // Months over weeks
            'weekAndMonth',

            // Months over weeks
            'weekAndDayLetter',

            // Months over days
            'dayAndMonth',

            // Weeks over days
            'weekAndDay',
            { width : 54, increment : 1, resolution : 1, base : 'weekAndDay', resolutionUnit : 'HOUR', useForSmoothZoom : false, excludeForSmoothZoom : true },

            // Days over 6 hour blocks
            'sixHoursAndDay',

            // Days over hours
            'hourAndDay',
            { width : 64,  increment : 6, resolution : 30, base : 'hourAndDay', resolutionUnit : 'MINUTE', useForSmoothZoom : false, excludeForSmoothZoom : true },
            { width : 100, increment : 6, resolution : 30, base : 'hourAndDay', resolutionUnit : 'MINUTE', useForSmoothZoom : false, excludeForSmoothZoom : true },
            { width : 64,  increment : 2, resolution : 30, base : 'hourAndDay', resolutionUnit : 'MINUTE', useForSmoothZoom : false, excludeForSmoothZoom : true },

            // Hours over minutes
            'minuteAndHour',
            { width : 60,  increment : 15, resolution : 5, base : 'minuteAndHour', useForSmoothZoom : false, excludeForSmoothZoom : true },
            { width : 130, increment : 15, resolution : 5, base : 'minuteAndHour', useForSmoothZoom : false, excludeForSmoothZoom : true },
            { width : 60,  increment : 5,  resolution : 5, base : 'minuteAndHour', useForSmoothZoom : false, excludeForSmoothZoom : true },
            { width : 100, increment : 5,  resolution : 5, base : 'minuteAndHour', useForSmoothZoom : false, excludeForSmoothZoom : true },

            'fifteenMinutesAndHour',

            // Minutes over seconds
            'secondAndMinute',
            { width : 60,  increment : 10, resolution : 5, base : 'secondAndMinute', useForSmoothZoom : false },
            { width : 130, increment : 5,  resolution : 5, base : 'secondAndMinute', useForSmoothZoom : false }
        ],

        internalListeners : {
            locale : 'updateLocalization'
        }
    };

    changeBasePresets(basePresets) {
        const presetCache = {};

        // createRecord uses _modelClass for performance reasons, make sure it is available
        this.getConfig('modelClass');

        for (const id in basePresets) {
            basePresets[id].id = id;
            presetCache[id] = this.createRecord(basePresets[id]);
        }

        return presetCache;
    }

    updateDefaultPresets(defaultPresets) {
        for (let i = 0, { length } = defaultPresets; i < length; i++) {
            const
                presetAdjustment   = defaultPresets[i],
                isBase             = typeof presetAdjustment === 'string',
                baseType           = isBase ? presetAdjustment : presetAdjustment.base;

            let preset;

            // The default was just a string, so it's an unmodified instance of a base type.
            if (isBase) {
                preset = this.basePresets[baseType];
            }
            // If it's an object, it's an adjustment to a base type
            else {
                const
                    config             = Object.assign(Object.create({ id : baseType }), ObjectHelper.clone(this.basePresets[baseType].data)),
                    { timeResolution } = config,
                    bottomHeader       = config.headers[config.headers.length - 1];

                config.id = undefined;

                if ('width' in presetAdjustment) {
                    config.tickWidth = presetAdjustment.width;
                }
                if ('height' in presetAdjustment) {
                    config.tickHeight = presetAdjustment.height;
                }
                if ('increment' in presetAdjustment) {
                    bottomHeader.increment = presetAdjustment.increment;
                }
                if ('resolution' in presetAdjustment) {
                    timeResolution.increment = presetAdjustment.resolution;
                }
                if ('resolutionUnit' in presetAdjustment) {
                    timeResolution.unit = DateHelper.getUnitByName(presetAdjustment.resolutionUnit);
                }

                config.useForSmoothZoom = presetAdjustment.useForSmoothZoom;
                config.excludeForSmoothZoom = presetAdjustment.excludeForSmoothZoom;
                // config.useForLegacyZoom = presetAdjustment.useForLegacyZoom;

                preset = this.createRecord(config);

                // Keep id of original preset around, used with localization in PresetStore
                preset.baseId = baseType;
            }
            this.add(preset);
        }
    }

    getById(id) {
        // Look first in the default set, and if it's one of the base types that is not imported into the
        // default set, then look at the bases.
        return super.getById(id) || this.basePresets[id];
    }

    /**
     * Registers a new view preset base to be used by any scheduler grid or tree on the page.
     * @param {String} id The unique identifier for this preset
     * @param {ViewPresetConfig} config The configuration properties of the view preset (see
     * {@link Scheduler.preset.ViewPreset} for more information)
     * @returns {Scheduler.preset.ViewPreset} A new ViewPreset based upon the passed configuration.
     */
    registerPreset(id, config) {
        const
            preset = this.createRecord(Object.assign({
                id
            }, config)),
            existingDuplicate = this.find(p => p.equals(preset));

        if (existingDuplicate) {
            return existingDuplicate;
        }

        if (preset.isValid) {
            this.add(preset);
        }
        else {
            throw new Error('Invalid preset, please check your configuration');
        }

        return preset;
    }

    getPreset(preset) {
        if (typeof preset === 'number') {
            preset = this.getAt(preset);
        }
        if (typeof preset === 'string') {
            preset = this.getById(preset);
        }
        else if (!(preset instanceof ViewPreset)) {
            preset = this.createRecord(preset);
        }
        return preset;
    }

    /**
     * Applies preset customizations or fetches a preset view preset using its name.
     * @param {String|ViewPresetConfig} presetOrId Id of a predefined preset or a preset config object
     * @returns {Scheduler.preset.ViewPreset} Resulting ViewPreset instance
     */
    normalizePreset(preset) {
        const me = this;

        if (!(preset instanceof ViewPreset)) {
            if (typeof preset === 'string') {
                preset = me.getPreset(preset);
                if (!preset) {
                    throw new Error('You must define a valid view preset. See PresetManager for reference');
                }
            }
            else if (typeof preset === 'object') {
                // Look up any existing ViewPreset that it is based upon.
                if (preset.base) {
                    const base = this.getById(preset.base);

                    if (!base) {
                        throw new Error(`ViewPreset base '${preset.base}' does not exist`);
                    }
                    // The config is based upon the base's data with the new config object merged in.
                    preset = ObjectHelper.merge(ObjectHelper.clone(base.data), preset);
                }

                // Ensure the new ViewPreset has a legible, logical id which does not already
                // exist in our store.
                if (preset.id) {
                    preset = me.createRecord(preset);
                }
                else {
                    preset = me.createRecord(ObjectHelper.assign({}, preset));
                    preset.id = preset.generateId(preset);
                }
            }
        }

        return preset;
    }

    /**
     * Deletes a view preset
     * @param {String} id The id of the preset, or the preset instance.
     */
    deletePreset(presetOrId) {
        if (typeof presetOrId === 'string') {
            presetOrId = this.getById(presetOrId);
        }
        else if (typeof presetOrId === 'number') {
            presetOrId = this.getAt(presetOrId);
        }

        if (presetOrId) {
            this.remove(presetOrId);

            // ALso remove it from our base list
            delete this.basePresets[presetOrId.id];
        }
    }
}

const pm = new PresetManager();

globalThis.bryntum.PresetManager = pm;

export { pm as default };
