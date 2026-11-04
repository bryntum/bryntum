import Model from '../../Core/data/Model.js';
import IdHelper from '../../Core/helper/IdHelper.js';
import DH from '../../Core/helper/DateHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';

/**
 * @module Scheduler/preset/ViewPreset
 */

/**
 * An object containing a unit identifier and an increment variable, used to define the `timeResolution` of a
 * `ViewPreset`.
 * @typedef {Object} ViewPresetTimeResolution
 * @property {DurationUnit} unit The unit of the resolution, e.g. 'minute'
 * @property {Number} increment The increment of the resolution, e.g. 15
 */

/**
 * Type describing one header cell returned by a header row's `cellGenerator`.
 * @typedef {Object} ViewPresetHeaderCell
 * @property {Date} start The start date of the header cell
 * @property {Date} end The end date of the header cell
 * @property {DomConfig|String} header The content to render in the header cell
 */

/**
 * Defines a header level for a ViewPreset.
 *
 * A sample header configuration can look like below
 * ```javascript
 * headers    : {
 *     {
 *         unit        : "month",
 *         renderer(start, end, headerConfig, index) {
 *             var month = start.getMonth();
 *             // Simple alternating month in bold
 *             if (start.getMonth() % 2) {
 *                 return '<strong>' + month + '</strong>';
 *             }
 *             return month;
 *         },
 *         align       : 'start' // `start` or `end`, omit to center content (default)
 *     },
 *     {
 *         unit        : "week",
 *         increment   : 1,
 *         renderer(start, end, headerConfig, index) {
 *             return 'foo';
 *         }
 *     },
 * }
 * ```
 *
 * @typedef {Object} ViewPresetHeaderRow
 * @property {'start'|'center'|'end'} align The text alignment for the cell. Valid values are `start` or `end`, omit
 * this to center text content (default). Can also be added programmatically in `the renderer`.
 * @property {DurationUnit} unit The unit of time
 * represented by each cell in this header row. See also increment property. Valid values are "millisecond", "second",
 * "minute", "hour", "day", "week", "month", "quarter", "year".
 * @property {String} headerCellCls A CSS class to add to the cells in the time axis header row. Can also be added
 * programmatically in the `renderer`.
 * @property {Number} increment The number of units each header cell will represent (e.g. 30 together with unit:
 * "minute" for 30 minute cells)
 * @property {String} dateFormat Defines how the cell date will be formatted
 * @property {Function} renderer A custom renderer function used to render the cell content. It should return text/HTML
 * to put in the header cell.
 *
 * ```javascript
 * function (startDate, endDate, headerConfig, i) {
 *   // applies special CSS class to align header left
 *   headerConfig.align = "start";
 *   // will be added as a CSS class of the header cell DOM element
 *   headerConfig.headerCellCls = "myClass";
 *
 *   return DateHelper.format(startDate, 'YYYY-MM-DD');
 * }
 * ```
 *
 * The render function is called with the following parameters:
 *
 * @property {Date} renderer.startDate The start date of the cell.
 * @property {Date} renderer.endDate The end date of the cell.
 * @property {Object} renderer.headerConfig An object containing the header config.
 * @property {'start'|'center'|'end'} [renderer.headerConfig.align] The text alignment for the cell. See `align` above.
 * @property {String} [renderer.headerConfig.headerCellCls] A CSS class to add to the cells in the time axis header row.
 * See `headerCellCls` above.
 * @property {Number} [renderer.index] The index of the cell in the row.
 * @property {Scheduler.view.TimelineBase} [renderer.timeline] The timeline widget (e.g. Scheduler or Gantt)
 * @property {DomConfig|String|null} renderer.returns The rendered content for the header cell
 * @property {Object} thisObj `this` reference for the renderer function
 * @property {Function} cellGenerator A function that should return an array of objects containing 'start', 'end' and
 * 'header' properties. Use this if you want full control over how the header rows are generated.
 *
 * **Note:** `cellGenerator` cannot be used for the bottom level of your headers.
 *
 * Example :
 * ```javascript
 * viewPreset : {
 *     displayDateFormat : 'H:mm',
 *     shiftIncrement    : 1,
 *     shiftUnit         : 'WEEK',
 *     timeResolution    : {
 *         unit      : 'MINUTE',
 *         increment : 10
 *     },
 *     headers           : [
 *         {
 *             unit          : 'year',
 *             // Simplified scenario, assuming view will always just show one US fiscal year
 *             cellGenerator : (viewStart, viewEnd) => [{
 *                 start  : viewStart,
 *                 end    : viewEnd,
 *                 header : `Fiscal Year ${viewStart.getFullYear() + 1}`
 *             }]
 *         },
 *         {
 *             unit : 'quarter',
 *             renderer(start, end, cfg) {
 *                 const
 *                     quarter       = Math.floor(start.getMonth() / 3) + 1,
 *                     fiscalQuarter = quarter === 4 ? 1 : (quarter + 1);
 *
 *                 return `FQ${fiscalQuarter} ${start.getFullYear() + (fiscalQuarter === 1 ? 1 : 0)}`;
 *             }
 *         },
 *         {
 *             unit       : 'month',
 *             dateFormat : 'MMM Y'
 *         }
 *     ]
 *  },
 * ```
 *
 * The `cellGenerator` function is called with the following parameters:
 *
 * @property {Date} cellGenerator.viewStart The start date of the time axis
 * @property {Date} cellGenerator.viewEnd The end date of the time axis
 * @property {ViewPresetHeaderCell[]} cellGenerator.returns Header cells to render
 */

/**
 * A ViewPreset is a record of {@link Scheduler.preset.PresetStore} which describes the granularity
 * of the timeline view of a {@link Scheduler.view.Scheduler} and the layout and subdivisions of the timeline header.
 *
 * You can create a new instance by specifying all fields:
 *
 * ```javascript
 * const myViewPreset = new ViewPreset({
 *     id   : 'myPreset',              // Unique id value provided to recognize your view preset. Not required, but having it you can simply set new view preset by id: scheduler.viewPreset = 'myPreset'
 *
 *     name : 'My view preset',        // A human-readable name provided to be used in GUI, e.i. preset picker, etc.
 *
 *     tickWidth  : 24,                // Time column width in horizontal mode
 *     tickHeight : 50,                // Time column height in vertical mode
 *     displayDateFormat : 'HH:mm',    // Controls how dates will be displayed in tooltips etc
 *
 *     shiftIncrement : 1,             // Controls how much time to skip when calling shiftNext and shiftPrevious.
 *     shiftUnit      : 'day',         // Valid values are 'millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'.
 *     defaultSpan    : 12,            // By default, if no end date is supplied to a view it will show 12 hours
 *
 *     timeResolution : {              // Dates will be snapped to this resolution
 *         unit      : 'minute',       // Valid values are 'millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'.
 *         increment : 15
 *     },
 *
 *     headers : [                     // This defines your header rows from top to bottom
 *         {                           // For each row you can define 'unit', 'increment', 'dateFormat', 'renderer', 'align', and 'thisObj'
 *             unit       : 'day',
 *             dateFormat : 'ddd DD/MM'
 *         },
 *         {
 *             unit       : 'hour',
 *             dateFormat : 'HH:mm'
 *         }
 *     ],
 *
 *     columnLinesFor : 1              // Defines header level column lines will be drawn for. Defaults to the last level.
 * });
 * ```
 *
 * Or you can extend one of view presets registered in {@link Scheduler.preset.PresetManager PresetManager}:
 *
 * ```javascript
 * const myViewPreset2 = new ViewPreset({
 *     id   : 'myPreset',                  // Unique id value provided to recognize your view preset. Not required, but having it you can simply set new view preset by id: scheduler.viewPreset = 'myPreset'
 *     name : 'My view preset',            // A human-readable name provided to be used in GUI, e.i. preset picker, etc.
 *     base : 'hourAndDay',                // Extends 'hourAndDay' view preset provided by PresetManager. You can pick out any of PresetManager's view presets: PresetManager.records
 *
 *     timeResolution : {                  // Override time resolution
 *         unit      : 'minute',
 *         increment : 15                  // Make it increment every 15 mins
 *     },
 *
 *     headers : [                         // Override headers
 *         {
 *             unit       : 'day',
 *             dateFormat : 'DD.MM.YYYY'   // Use different date format for top header 01.10.2020
 *         },
 *         {
 *             unit       : 'hour',
 *             dateFormat : 'LT'
 *         }
 *     ]
 * });
 * ```
 *
 * See {@link Scheduler.preset.PresetManager} for the list of base presets. You may add your own presets to this global
 * list:
 *
 * ```javascript
 * PresetManager.add(myViewPreset);     // Adds new preset to the global scope. All newly created scheduler instances will have it too.
 *
 * const scheduler = new Scheduler({
 *     viewPreset : 'myPreset'
 *     // other configs...
 * });
 * ```
 *
 * Or add them on an individual basis to Scheduler instances:
 *
 * ```javascript
 * const scheduler = new Scheduler({...});
 *
 * scheduler.presets.add(myViewPreset); // Adds new preset to the scheduler instance only. All newly created scheduler instances will **not** have it.
 *
 * scheduler.viewPreset = 'myPreset';
 * ```
 *
 * ## Defining custom header rows
 *
 * You can have any number of header rows by specifying {@link #field-headers}, see {@link #typedef-ViewPresetHeaderRow}
 * for the config object format and {@link Core.helper.DateHelper} for the supported date formats, or use to render
 * custom contents into the row cells.
 *
 * ```javascript
 *  headers : [
 *      {
 *          unit       : 'month',
 *          dateFormat : 'MM.YYYY'
 *      },
 *      {
 *          unit       : 'week',
 *          renderer   : ({ startDate }) => `Week ${DateHelper.format(startDate, 'WW')}`
 *      }
 *  ]
 * ```
 *
 * {@inlineexample Scheduler/preset/CustomHeader.js}
 *
 * This live demo shows a custom ViewPreset with AM/PM time format:
 * {@inlineexample Scheduler/preset/amPmPreset.js}
 *
 * ### Using embedded text inside format string
 * Arbitrary text can be embedded in the format string by wrapping it with {}:
 *
 * ```javascript
 *  headers : [
 *      {
 *          unit       : 'month',
 *          dateFormat : '{It is }MMMM{, yay!}' -> It is January, yay!
 *      },
 *      {
 *          unit       : 'week',
 *          renderer   : ({ startDate }) => `Week ${DateHelper.format(startDate, 'WW')}`
 *      }
 *  ]
 * ```
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #field-base}                          | Base preset to extend from                          |
 * | {@link #field-tickWidth}                     | Width of each time tick in pixels                   |
 * | {@link #field-rowHeight}                     | Default row height in pixels                        |
 * | {@link #field-displayDateFormat}             | Date format string for tooltips                     |
 * | {@link #field-headers}                       | Array of header row configurations                  |
 * | {@link #field-timeResolution}                | Resolution for snapping and rounding                |
 * | {@link #field-shiftUnit}                     | Unit used when shifting the time axis               |
 *
 * ## See also
 *
 * - {@link Scheduler.preset.PresetStore} - Store holding view presets
 * - {@link Scheduler.preset.PresetManager} - Built-in presets
 * - {@link Scheduler.widget.ViewPresetCombo} - Combo for selecting presets
 *
 * @extends Core/data/Model
 * @tier community
 */
export default class ViewPreset extends Model {

    static $name = 'ViewPreset';

    static get fields() {
        return [
            /**
             * The name of an existing view preset to extend
             * @field {String} base
             */
            { name : 'base', type : 'string' },

            /**
             * The name of the view preset
             * @field {String} name
             */
            { name : 'name', type : 'string' },

            /**
             * The height of the row in horizontal orientation
             * @field {Number} rowHeight
             */
            { name : 'rowHeight' },

            /**
             * The width of the time tick column in horizontal orientation
             * @field {Number} tickWidth
             * @default
             */
            {
                name         : 'tickWidth',
                defaultValue : 50
            },

            /**
             * The height of the time tick column in vertical orientation
             * @field {Number} tickHeight
             * @default
             */
            {
                name         : 'tickHeight',
                defaultValue : 50
            },

            /**
             * Defines how dates will be formatted in tooltips etc
             * @field {String} displayDateFormat
             * @default
             */
            {
                name         : 'displayDateFormat',
                defaultValue : 'HH:mm'
            },

            /**
             * The unit to shift when calling shiftNext/shiftPrevious to navigate in the chart.
             * Valid values are "millisecond", "second", "minute", "hour", "day", "week", "month", "quarter", "year".
             * @field {DurationUnit} shiftUnit
             * @default
             */
            {
                name         : 'shiftUnit',
                defaultValue : 'hour'
            },

            /**
             * The amount to shift (in shiftUnits)
             * @field {Number} shiftIncrement
             * @default
             */
            {
                name         : 'shiftIncrement',
                defaultValue : 1
            },

            /**
             * The amount of time to show by default in a view (in the unit defined by {@link #field-mainUnit})
             * @field {Number} defaultSpan
             * @default
             */
            {
                name         : 'defaultSpan',
                defaultValue : 12
            },

            /**
             * Initially set to a unit. Defaults to the unit defined by the middle header.
             * @field {DurationUnit} mainUnit
             */
            {
                name : 'mainUnit'
            },

            /**
             * Note: Currently, this field only applies when changing viewPreset with the {@link Scheduler.widget.ViewPresetCombo}.
             *
             * Set to a number and that amount of {@link #field-mainUnit} will be added to the startDate. For example: A
             * start value of `5` together with the mainUnit `hours` will add 5 hours to the startDate. This can achieve
             * a "day view" that starts 5 AM.
             *
             * Set to a string unit (for example week, day, month) and the startDate will be the start of that unit
             * calculated from current startDate. A start value of `week` will result in a startDate in the first day of
             * the week.
             *
             * If set to a number or not set at all, the startDate will be calculated at the beginning of current
             * mainUnit.
             * @field {Number|String} start
             */
            {
                name : 'start'
            },

            /**
             * An object containing a unit identifier and an increment variable. This value means minimal task duration
             * you can create using UI. For example when you drag create a task or drag & drop a task, if increment is 5
             * and unit is 'minute' that means that you can create a 5-minute-long task, or move it 5 min
             * forward/backward. This config maps to scheduler's
             * {@link Scheduler.view.mixin.TimelineDateMapper#property-timeResolution} config.
             *
             * ```javascript
             * timeResolution : {
             *   unit      : 'minute',  //Valid values are "millisecond", "second", "minute", "hour", "day", "week", "month", "quarter", "year".
             *   increment : 5
             * }
             * ```
             *
             * @field {ViewPresetTimeResolution} timeResolution
             */
            'timeResolution',

            /**
             * An array containing one or more {@link #typedef-ViewPresetHeaderRow} config objects, each of
             * which defines a level of headers for the scheduler.
             * The `main` unit will be the last header's unit, but this can be changed using the
             * {@link #field-mainHeaderLevel} field.
             * @field {ViewPresetHeaderRow[]} headers
             * @ts-returns {Partial<ViewPresetHeaderRow>[]}
             */
            'headers',

            /**
             * Index of the {@link #field-headers} array to define which header level is the `main` header.
             * Defaults to the bottom header.
             * @field {Number} mainHeaderLevel
             */
            'mainHeaderLevel',

            /**
             * Index of a header level in the {@link #field-headers} array for which column lines are drawn. See
             * {@link Scheduler.feature.ColumnLines}.
             * Defaults to the bottom header.
             * @field {Number} columnLinesFor
             */
            'columnLinesFor',

            /**
             * Set to `false` to exclude this preset from the smooth zooming algorithm. This means that when zooming in
             * or out in a Scheduler configured with `smoothZoom : true`, the view will not switch to this preset.
             * @field {Boolean} useForSmoothZoom
             */
            { name : 'useForSmoothZoom', defaultValue : true },
            { name : 'useForLegacyZoom', defaultValue : true },
            { name : 'excludeForSmoothZoom', defaultValue : false },
            'minTickWidth',
            'minTickHeight',

            /**
             * Only applies to view presets with an hour-based bottom header and an `increment` greater than `1` (e.g.
             * `6` hours per tick).
             *
             * When set to `true`, the time axis keeps header hour labels aligned across a Daylight Saving Time
             * transition. Without this flag, the tick containing the DST shift is rendered longer (spring forward) or
             * shorter (fall back) and the next tick is offset by one hour — turning the natural `00, 06, 12, 18` header
             * sequence into `00, 07, 12, 18`
             *
             * With this flag enabled, the tick containing the DST shift is rendered at the same pixel width as the
             * other ticks instead, so the header continues to show `00, 06, 12, 18`. The "DST tick" simply represents
             * one less (or one more) real hour than its neighbours.
             *
             * ```javascript
             * viewPreset : {
             *     base                   : 'hourAndDay',
             *     preserveHoursAcrossDST : true
             * }
             * ```
             *
             * @field {Boolean} preserveHoursAcrossDST
             */
            'preserveHoursAcrossDST'
        ];
    }

    construct(...args) {
        super.construct(...args);
        this.normalizeUnits();
    }

    generateId(owner) {
        const
            me    = this,
            {
                headers
            }     = me,
            parts = [];

        // If we were subclassed from a base, use that id as the basis of our.
        let result = Object.getPrototypeOf(me.data).id;

        if (!result) {
            for (let { length } = headers, i = length - 1; i >= 0; i--) {
                const
                    { unit, increment } = headers[i],
                    multiple            = increment > 1;

                parts.push(`${multiple ? increment : ''}${i ? unit : StringHelper.capitalize(unit)}${multiple ? 's' : ''}`);
            }

            // Use upwards header units so eg "monthAndYear"
            result = parts.join('And');
        }

        // If duplicate, decorate the generated by adding details.
        // For example make it "hourAndDay-50by80"
        // Only interrogate the store if it is loaded. If consulted during
        // a load, the idMap will be created empty
        if (owner.count && owner.includes(result)) {
            result += `-${me.tickWidth}by${me.tickHeight || me.tickWidth}`;
            // If still duplicate use increment
            if (owner.includes(result)) {
                result += `-${me.bottomHeader.increment}`;
                // And if STILL duplicate, make it unique with a suffix
                if (owner.includes(result)) {
                    result = IdHelper.generateId(`${result}-`);
                }
            }
        }

        return result;
    }

    normalizeUnits() {
        const
            me                                     = this,
            { timeResolution, headers, shiftUnit } = me;

        if (headers) {
            // Make sure date "unit" constant specified in the preset are resolved
            for (let i = 0, { length } = headers; i < length; i++) {
                const header = headers[i];

                header.unit = DH.normalizeUnit(header.unit);
                if (header.splitUnit) {
                    header.splitUnit = DH.normalizeUnit(header.splitUnit);
                }
                if (!('increment' in header)) {
                    headers[i] = {
                        increment : 1,
                        ...header
                    };
                }
            }
        }

        if (timeResolution) {
            timeResolution.unit = DH.normalizeUnit(timeResolution.unit);
        }

        if (shiftUnit) {
            me.shiftUnit = DH.normalizeUnit(shiftUnit);
        }
    }

    // Process legacy columnLines config into a headers array.
    static normalizeHeaderConfig(data) {
        const
            { headerConfig, columnLinesFor, mainHeaderLevel } = data,
            headers                                           = data.headers = [];

        if (headerConfig.top) {
            if (columnLinesFor === 'top') {
                data.columnLinesFor = 0;
            }
            if (mainHeaderLevel === 'top') {
                data.mainHeaderLevel = 0;
            }
            headers[0] = headerConfig.top;
        }
        if (headerConfig.middle) {
            if (columnLinesFor === 'middle') {
                data.columnLinesFor = headers.length;
            }
            if (mainHeaderLevel === 'middle') {
                data.mainHeaderLevel = headers.length;
            }
            headers.push(headerConfig.middle);
        }
        else {
            throw new Error('ViewPreset.headerConfig must be configured with a middle');
        }
        if (headerConfig.bottom) {
            // Main level is middle when using headerConfig object.
            data.mainHeaderLevel = headers.length - 1;

            // There *must* be a middle above this bottom header
            // so that is the columnLines one by default.
            if (columnLinesFor == null) {
                data.columnLinesFor = headers.length - 1;
            }
            else if (columnLinesFor === 'bottom') {
                data.columnLinesFor = headers.length;
            }

            // There *must* be a middle above this bottom header
            // so that is the main one by default.
            if (mainHeaderLevel == null) {
                data.mainHeaderLevel = headers.length - 1;
            }
            if (mainHeaderLevel === 'bottom') {
                data.mainHeaderLevel = headers.length;
            }

            headers.push(headerConfig.bottom);
        }
    }

    // Explicitly allow setting useForSmoothZoom
    set useForSmoothZoom(useForSmoothZoom) {
        this.setData('useForSmoothZoom', useForSmoothZoom);
    }

    get useForSmoothZoom() {
        return this.getData('useForSmoothZoom');
    }

    // These are read-only once configured.
    set() {}

    inSet() {}

    // Options is used to apply startDate, endDate etc. when changing to a new view preset
    set options(options) {
        this.data.options = options;
    }

    get options() {
        return this.data.options;
    }

    get columnLinesFor() {
        return ('columnLinesFor' in this.data) ? this.data.columnLinesFor : this.headers.length - 1;
    }

    get tickSize() {
        return this._tickSize || this.tickWidth;
    }

    get tickWidth() {
        return ('tickWidth' in this.data) ? this.data.tickWidth : 50;
    }

    get tickHeight() {
        return ('tickHeight' in this.data) ? this.data.tickHeight : 50;
    }

    get headerConfig() {
        // Configured in the legacy manner, just return the configured value.
        if (this.data.headerConfig) {
            return this.data.headerConfig;
        }

        // Rebuild the object based upon the configured headers array.
        const
            result      = {},
            { headers } = this,
            { length }  = headers;

        switch (length) {
            case 1 :
                result.middle = headers[0];
                break;
            case 2:
                if (this.mainHeaderLevel === 0) {
                    result.middle = headers[0];
                    result.bottom = headers[1];
                }
                else {
                    result.top    = headers[0];
                    result.middle = headers[1];
                }
                break;
            case 3:
                result.top    = headers[0];
                result.middle = headers[1];
                result.bottom = headers[2];
                break;
            default:
                throw new Error('headerConfig object not supported for >3 header levels');
        }

        return result;
    }

    set mainHeaderLevel(mainHeaderLevel) {
        this.data.mainHeaderLevel = mainHeaderLevel;
    }

    get mainHeaderLevel() {
        if ('mainHeaderLevel' in this.data) {
            return this.data.mainHeaderLevel;
        }

        // 3 headers, then it's the middle
        if (this.data.headers.length === 3) {
            return 1;
        }

        // Assume it goes top, middle.
        // If it's middle, top, use mainHeaderLevel : 0
        return this.headers.length - 1;
    }

    get mainHeader() {
        return this.headers[this.mainHeaderLevel];
    }

    get topHeader() {
        return this.headers[0];
    }

    get topUnit() {
        return this.topHeader.unit;
    }

    get topIncrement() {
        return this.topHeader.increment;
    }

    get bottomHeader() {
        return this.headers[this.headers.length - 1];
    }

    get leafUnit() {
        return this.bottomHeader.unit;
    }

    get leafIncrement() {
        return this.bottomHeader.increment;
    }

    get mainUnit() {
        if ('mainUnit' in this.data) {
            return this.data.mainUnit;
        }
        return this.mainHeader.unit;
    }

    get msPerPixel() {
        const { bottomHeader } = this;

        return Math.round(DH.asMilliseconds(bottomHeader.increment || 1, bottomHeader.unit) / this.tickWidth);
    }

    get isValid() {
        const me = this;

        let valid = true;

        // Make sure all date "unit" constants are valid
        for (const header of me.headers) {
            valid = valid && Boolean(DH.normalizeUnit(header.unit));
        }

        if (me.timeResolution) {
            valid = valid && DH.normalizeUnit(me.timeResolution.unit);
        }

        if (me.shiftUnit) {
            valid = valid && DH.normalizeUnit(me.shiftUnit);
        }

        return valid;
    }
}
