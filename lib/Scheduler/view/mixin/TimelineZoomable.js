import Base from '../../../Core/Base.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import EventHelper from '../../../Core/helper/EventHelper.js';

/**
 * @module Scheduler/view/mixin/TimelineZoomable
 */

/**
 * Options which may be used when changing the {@link Scheduler.view.Scheduler#property-viewPreset} property.
 *
 * @typedef {Object} ChangePresetOptions
 * @property {VisibleDate} [visibleDate] A `visibleDate` specification to bring into view after the new
 * `ViewPreset` is applied.
 * @property {Date} [startDate] New time frame start. If provided along with end, view will be centered in this
 * time interval, ignoring centerDate config. __Ignored if {@link Scheduler.view.Scheduler#config-infiniteScroll} is used.__
 * @property {Date} [endDate] New time frame end. __Ignored if {@link Scheduler.view.Scheduler#config-infiniteScroll} is used.__
 * @property {Date} [centerDate] Date to keep in center. Is ignored when start and end are provided.
 * @property {Date} [zoomDate] The date that should be positioned at the passed `zoomPosition` client offset.
 * @property {Number} [zoomPosition] The client offset at which the passed `zoomDate` should be positioned.
 * @property {Number} [width] Lowest tick width. Might be increased automatically
 * @property {Boolean} [animate] When `true` and `smoothZoom` is enabled, animates a zoom operation.
 */

/**
 * Mixin providing the zooming API. Zooming is {@link Scheduler.view.mixin.TimelineSmoothZoom smooth} by default, the
 * legacy zoom system described below is used only with `smoothZoom : false`, which is deprecated.
 *
 * ## Legacy zooming
 *
 * The zoom levels are stored as instances of {@link Scheduler.preset.ViewPreset}s, and are
 * cached centrally in the {@link Scheduler.preset.PresetManager}.
 *
 * The default presets are loaded into the {@link Scheduler.view.mixin.TimelineViewPresets#config-presets}
 * store upon Scheduler instantiation. Preset selection is covered in the
 * {@link Scheduler.view.mixin.TimelineViewPresets} mixin.
 *
 * To specify custom zoom levels please provide a set of view presets to the global PresetManager store **before**
 * scheduler creation, or provide a set of view presets to a specific scheduler only:
 *
 * ```javascript
 * const myScheduler = new Scheduler({
 *     presets : [
 *         {
 *             base : 'hourAndDay',
 *             id   : 'MyHourAndDay',
 *             // other preset configs....
 *         },
 *         {
 *             base : 'weekAndMonth',
 *             id   : 'MyWeekAndMonth',
 *             // other preset configs....
 *         }
 *     ],
 *     viewPreset : 'MyHourAndDay',
 *     // other scheduler configs....
 *     });
 * ```
 *
 * ## Smooth zooming
 *
 * See {@link Scheduler.view.mixin.TimelineSmoothZoom} for information on the smooth zooming system, which is enabled
 * by default.
 *
 * ## See also
 *
 * - {@link Scheduler.view.mixin.TimelineViewPresets} - View preset handling
 * - {@link Scheduler.preset.PresetStore} - Preset store (zoom levels)
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 * - {@link Scheduler.view.mixin.TimelineSmoothZoom} - Smooth zoom functionality
 *
 * @mixin
 */
export default Target => class TimelineZoomable extends (Target || Base) {
    static $name = 'TimelineZoomable';

    static configurable = {
        /**
         * If `true`, you can zoom in and out on the time axis using <kbd>CTRL</kbd> + mouse wheel.
         * @config {Boolean}
         * @default
         * @category Zoom
         */
        zoomOnMouseWheel : true,

        /**
         * If `true`, you can zoom to a time span by double-clicking a time axis cell.
         * @config {Boolean}
         * @default
         * @category Zoom
         */
        zoomOnTimeAxisDoubleClick : true,

        /**
         * The minimum zoom level to which {@link #function-zoomOut} will work.
         *
         * When using {@link Scheduler.view.Scheduler#config-smoothZoom smooth zoom}:
         *
         * This config accepts a number which indicates the minimum smooth zoom level allowed. Since smooth zoom levels
         * are generated based on the provided presets, it is often instead easier to pass a preset name. Passing
         * `weekAndDayLetter` would prevent zooming further out than that, so for example the `weekDateAndMonth` preset
         * would not be reachable.
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *   smoothZoom   : true,
         *   minZoomLevel : 'weekAndDayLetter'
         * });
         * ```
         *
         * Only presets that are part of the smooth zoom chain are valid as a boundary here. A preset that is excluded
         * from the chain (for example via `useForSmoothZoom : false`) is ignored as `minZoomLevel` and triggers a
         * console warning. See the {@link Scheduler.view.Scheduler#config-smoothZoom} config for a list of presets
         * included in the smooth zoom chain by default.
         *
         * When using legacy zoom:
         *
         * Defaults to 0 (year ticks).
         *
         * @prp {Number}
         * @accepts {Number|String}
         * @category Zoom
         * @default 0
         */
        minZoomLevel : 0,

        /**
         * The maximum zoom level to which {@link #function-zoomIn} will work.
         *
         * When using {@link Scheduler.view.Scheduler#config-smoothZoom smooth zoom}:
         *
         * This config accepts a number which indicates the maximum smooth zoom level allowed. Since smooth zoom levels
         * are generated based on the provided presets, it is often instead easier to pass a preset name. Passing
         * `hourAndDay` would prevent zooming further in than that, so for example the `minuteAndHour` preset would not
         * be reachable.
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *   smoothZoom   : true,
         *   maxZoomLevel : 'hourAndDay'
         * });
         * ```
         *
         * Only presets that are part of the smooth zoom chain are valid as a boundary here. A preset that is excluded
         * from the chain (for example via `useForSmoothZoom : false`) is ignored as `maxZoomLevel` and triggers a
         * console warning. See the {@link Scheduler.view.Scheduler#config-smoothZoom} config for the list of presets
         * included in the smooth zoom chain by default.
         *
         * When using legacy zoom:
         *
         * Defaults to the number of {@link Scheduler.preset.ViewPreset ViewPresets} available, see
         * {@link Scheduler/view/mixin/TimelineViewPresets#property-presets} for information. Unless you have modified
         * the collection of available presets, the max zoom level is milliseconds.
         *
         * @prp {Number}
         * @accepts {Number|String}
         * @category Zoom
         * @default 23
         */
        maxZoomLevel : null,

        /**
         * Integer number indicating the size of timespan during zooming. When zooming, the timespan is adjusted to make
         * the scrolling area `visibleZoomFactor` times wider than the timeline area itself. Used in
         * {@link #function-zoomToSpan} and {@link #function-zoomToLevel} functions.
         * @config {Number}
         * @default
         * @category Zoom
         */
        visibleZoomFactor : 5,

        /**
         * Whether the originally rendered timespan should be preserved while zooming. By default, it is set to `false`,
         * meaning the timeline panel will adjust the currently rendered timespan to limit the amount of HTML content to
         * render. When setting this option to `true`, be careful not to allow to zoom a big timespan in seconds
         * resolution for example. That will cause **a lot** of HTML content to be rendered and affect performance. You
         * can use {@link #config-minZoomLevel} and {@link #config-maxZoomLevel} config options for that.
         * @config {Boolean}
         * @default
         * @category Zoom
         */
        zoomKeepsOriginalTimespan : null
    };

    // We cache the last mousewheel position, so that during zooming we can
    // maintain a stable zoom point even if the mouse moves a little.
    lastWheelTime = -1;

    construct(config) {
        const me = this;

        super.construct(config);

        if (me.zoomOnMouseWheel) {
            EventHelper.on({
                element   : me.timeAxisSubGridElement,
                wheel     : 'onWheel',
                // Throttle zooming with the wheel a bit to have greater control of it
                throttled : {
                    buffer : 50,
                    // Prevent events from slipping through the throttle, causing scroll
                    alt    : e => (e.ctrlKey || e.metaKey) && e.preventDefault()
                },
                thisObj : me,
                capture : true,
                passive : false
            });
        }

        if (me.zoomOnTimeAxisDoubleClick) {
            me.ion({
                timeAxisHeaderDblClick({ startDate, endDate }) {
                    if (!me.forceFit) {
                        me.zoomToSpan({
                            startDate,
                            endDate
                        });
                    }
                }
            });
        }
    }

    get zoomViewportSize() {
        const me = this;

        return me.timeAxisViewModel.availableSpace || (me.isHorizontal ? Math.floor(me.width / 2) : 0);
    }

    get maxZoomLevel() {
        if (this.smoothZoom) {
            return this.maxSmoothZoomLevel;
        }

        return this._maxZoomLevel ?? (this.presets.count - 1);
    }

    /**
     * Get/set the {@link #config-maxZoomLevel} value
     * @member {Number} maxZoomLevel
     * @category Zoom
     */
    changeMaxZoomLevel(level) {
        // String preset names are resolved at build time in buildSmoothZoomIndex
        if (typeof level === 'string') {
            return level;
        }

        if (level == null) {
            return null;
        }

        if (typeof level !== 'number') {
            level = this.presets.count - 1;
        }

        if (level < 0 || level >= this.presets.count) {
            throw new Error('Invalid range for `maxZoomLevel`');
        }

        return level;
    }

    updateMaxZoomLevel() {
        if (this.smoothZoom) {
            this.$smoothZoomIndex = null;

            if (!this.isConfiguring) {
                this.buildSmoothZoomIndex();
            }
        }
    }

    get minZoomLevel() {
        if (this.smoothZoom) {
            return this.minSmoothZoomLevel;
        }

        return this._minZoomLevel ?? 0;
    }

    /**
     * Sets the {@link #config-minZoomLevel} value
     * @member {Number} minZoomLevel
     * @category Zoom
     */
    changeMinZoomLevel(level) {
        // String preset names are resolved at build time in buildSmoothZoomIndex
        if (typeof level === 'string') {
            return level;
        }

        if (level == null) {
            return null;
        }

        if (typeof level !== 'number') {
            level = 0;
        }

        if (level < 0 || level >= this.presets.count) {
            throw new Error('Invalid range for `minZoomLevel`');
        }

        return level;
    }

    updateMinZoomLevel() {
        if (this.smoothZoom) {
            this.$smoothZoomIndex = null;

            if (!this.isConfiguring) {
                this.buildSmoothZoomIndex();
            }
        }
    }

    /**
     * Current zoom level.
     *
     * When not using smoothZoom, it is equal to the {@link Scheduler.preset.ViewPreset} index in the provided array of
     * {@link Scheduler.view.mixin.TimelineViewPresets#config-presets zoom levels}.
     *
     * When using smoothZoom, it returns the smooth zoom index closest to the current tick size. If the current preset
     * is not flagged with `useForSmoothZoom`, finds the closest preset that is.
     *
     * @member {Number}
     * @category Zoom
     */
    get zoomLevel() {
        if (this.smoothZoom) {
            return this.smoothZoomLevel;
        }

        return this.presets.indexOf(this.viewPreset);
    }

    // noinspection JSAnnotator
    set zoomLevel(level) {
        if (this.smoothZoom) {
            this.smoothZoomLevel = level;
        }
        else {
            this.zoomToLevel(level);
        }
    }

    /**
     * Returns number of milliseconds per pixel.
     * @param {Object} level Element from array of {@link Scheduler.view.mixin.TimelineViewPresets#config-presets}.
     * @param {Boolean} ignoreActualWidth If true, then density will be calculated using default zoom level settings.
     * Otherwise, density will be calculated for actual tick width.
     * @returns {Number} Return number of milliseconds per pixel.
     * @private
     */
    getMilliSecondsPerPixelForZoomLevel(preset, ignoreActualWidth) {
        const
            { bottomHeader } = preset,
            // Scheduler uses direction independent tickSize, but presets are allowed to define different sizes for
            // vertical and horizontal -> cant use preset.tickSize here
            width            = this.isHorizontal ? preset.tickWidth : preset.tickHeight;

        // trying to convert the unit + increment to a number of milliseconds
        // this number is not fixed (month can be 28, 30 or 31 day), but at least this conversion
        // will be consistent (should be no DST changes at year 1)
        return Math.round(
            (DateHelper.add(new Date(1, 0, 1), bottomHeader.increment || 1, bottomHeader.unit) - new Date(1, 0, 1)) /
            // `actualWidth` is a column width after view adjustments applied to it (see `calculateTickWidth`)
            // we use it if available to return the precise index value from `getCurrentZoomLevelIndex`
            (ignoreActualWidth ? width : preset.actualWidth || width)
        );
    }

    /**
     * Zooms to passed view preset, saving center date. Method accepts config object as a first argument, which can be
     * reduced to primitive type (string,number) when no additional options required. e.g.:
     *
     * ```javascript
     * // zooming to preset
     * scheduler.zoomTo({ preset : 'hourAndDay' })
     * // shorthand
     * scheduler.zoomTo('hourAndDay')
     *
     * // zooming to level
     * scheduler.zoomTo({ level : 0 })
     * // shorthand
     * scheduler.zoomTo(0)
     * ```
     *
     * It is also possible to zoom to a time span by omitting `preset` and `level` configs, in which case scheduler sets
     * the time frame to a specified range and applies zoom level which allows fitting all columns to this range. The
     * given time span will be centered in the scheduling view (unless `centerDate` config provided). In the same time,
     * the start/end date of the whole time axis will be extended to allow scrolling for user.
     *
     * ```javascript
     * // zooming to time span
     * scheduler.zoomTo({
     *     startDate : new Date(..),
     *     endDate : new Date(...)
     * });
     * ```
     *
     * @param {ViewPresetConfig|Object|String|Number} config Config object, preset name or zoom level index.
     * @param {String} [config.preset] Preset name to zoom to. Ignores level config in this case
     * @param {Number} [config.level] Zoom level to zoom to. Is ignored, if preset config is provided
     * @param {VisibleDate} [config.visibleDate] A `visibleDate` specification to bring into view after the zoom.
     * @param {Date} [config.startDate] New time frame start. If provided along with end, view will be centered in this
     * time interval (unless `centerDate` is present)
     * @param {Date} [config.endDate] New time frame end
     * @param {Date} [config.centerDate] Date that should be kept in the center. Has priority over start and end params
     * @param {Date} [config.zoomDate] The date that should be positioned at the passed `datePosition` client offset.
     * @param {Number} [config.zoomPosition] The client offset at which the passed `date` should be positioned.
     * @param {Number} [config.width] Lowest tick width. Might be increased automatically
     * @param {Number} [config.leftMargin] Amount of pixels to extend span start on (used, when zooming to span)
     * @param {Number} [config.rightMargin] Amount of pixels to extend span end on (used, when zooming to span)
     * @param {Number} [config.adjustStart] Amount of units to extend span start on (used, when zooming to span)
     * @param {Number} [config.adjustEnd] Amount of units to extend span end on (used, when zooming to span)
     * @category Zoom
     */
    zoomTo(config) {
        const me = this;

        if (typeof config === 'object') {
            if (config.preset) {
                me.zoomToLevel(config.preset, config);
            }
            else if (config.level != null) {
                me.zoomToLevel(config.level, config);
            }
            else {
                me.zoomToSpan(config);
            }
        }
        else {
            me.zoomToLevel(config);
        }
    }

    /**
     * Allows zooming to certain level of {@link Scheduler.view.mixin.TimelineViewPresets#config-presets} array.
     * Automatically limits zooming between {@link #config-maxZoomLevel} and {@link #config-minZoomLevel}. Can also set
     * time axis timespan to the supplied start and end dates.
     *
     * @param {Number|String|ViewPresetConfig} preset Level index, preset id, or preset config to zoom to.
     * @param {ChangePresetOptions} [options] Object containing options which affect how the new preset is applied.
     * @returns {Number|null} level Current zoom level or null if it hasn't changed.
     * @category Zoom
     */
    zoomToLevel(preset, options = {}) {
        const me = this;

        if (me.forceFit) {
            console.warn('Warning: The forceFit setting and zooming cannot be combined');
            return null;
        }

        // Use smooth zoom system when enabled (provided by TimelineSmoothZoom mixin)
        if (me.smoothZoom) {
            const result = me.smoothZoomToLevel(preset, options);

            // smoothZoomToLevel returns false when the preset is not part of smooth zoom system
            if (result !== false) {
                return result;
            }
            else if (typeof preset === 'string') {
                preset = me.presets.indexOf(preset);
            }
        }

        // Sanitize numeric zooming.
        if (typeof preset === 'number') {
            preset = Math.min(Math.max(preset, me.minZoomLevel), me.maxZoomLevel);
        }

        const
            { presets }        = me,
            tickSizeProp       = me.isVertical ? 'tickHeight' : 'tickWidth',
            newPreset          = presets.createRecord(preset),
            configuredTickSize = newPreset[tickSizeProp],
            startDate          = options.startDate ? new Date(options.startDate) : null,
            endDate            = options.endDate ? new Date(options.endDate) : null;

        // If an existing ViewPreset id is used, this will replace it.
        presets.add(newPreset);

        let span                   = startDate && endDate ? { startDate, endDate } : null,
            // availableSpace is cheapest, but we get here early when configured with zoomLevel, hence the fallback
            scrollableViewportSize = me.timeAxisViewModel.availableSpace || me.timeAxisSubGrid.width;

        const centerDate = options.centerDate ? new Date(options.centerDate) : (span ? new Date((startDate.getTime() + endDate.getTime()) / 2) : me.viewportCenterDateCached);

        // The time axis might currently have no size, either because its region is collapsed, or because it was
        // dragged shut using the splitter. Zoom using a fallback size, so that the new preset is in effect once the
        // time axis gets a size back.
        if (scrollableViewportSize === 0) {
            const { _beforeCollapseState } = me.timeAxisSubGrid;

            if (me.isHorizontal && me.timeAxisSubGrid.collapsed && _beforeCollapseState?.width) {
                scrollableViewportSize = _beforeCollapseState.width;
            }
            else {
                scrollableViewportSize = me.zoomViewportSize;
            }

            if (!scrollableViewportSize) {
                return null;
            }
        }

        // Always calculate an optimal date range for the new zoom level
        if (!span) {
            span = me.calculateOptimalDateRange(centerDate, scrollableViewportSize, newPreset);
        }

        // Temporarily override tick size while reconfiguring the TimeAxisViewModel
        if ('width' in options) {
            newPreset.setData(tickSizeProp, options.width);
        }

        me.isZooming = true;

        // Passed through to the viewPreset changing method
        newPreset.options = {
            ...options,
            startDate : span.startDate || me.startDate,
            endDate   : span.endDate || me.endDate,
            centerDate
        };
        me.viewPreset = newPreset;

        // after switching the view preset the `width` config of the zoom level may change, because of adjustments
        // we will save the real value in the `actualWidth` property, so that `getCurrentZoomLevelIndex` method
        // will return the exact level index after zooming
        newPreset.actualWidth = me.timeAxisViewModel.tickSize;

        me.isZooming = false;

        // Restore the tick size because the default presets are shared.
        newPreset.setData(tickSizeProp, configuredTickSize);

        return me.zoomLevel;
    }

    /**
     * Changes the range of the scheduling chart to fit all the events in its event store.
     * @param {Object} [options] Options object for the zooming operation.
     * @param {Number} [options.leftMargin] Defines margin in pixel between the first event start date and first visible
     * date
     * @param {Number} [options.rightMargin] Defines margin in pixel between the last event end date and last visible
     * date
     * @param {Boolean} [options.animate] When `true` and {@link Scheduler.view.mixin.TimelineSmoothZoom#config-smoothZoom}
     * is enabled, animates the zoom operation
     * @returns {Number|null|Promise|undefined} The new zoom level, or `null` if the view could not be zoomed. When
     * {@link Scheduler.view.mixin.TimelineSmoothZoom#config-smoothZoom} is enabled, a `Promise` resolving to the new
     * zoom level is returned instead. If the events occupy a single point in time, the view scrolls to that date
     * instead of zooming and a `Promise` is returned which resolves when the scrolling is complete. Returns
     * `undefined` if the event store is empty
     * @category Zoom
     */
    zoomToFit(options) {
        const
            eventStore = this.eventStore,
            span       = eventStore.getTotalTimeSpan();

        options = {
            leftMargin  : 0,
            rightMargin : 0,
            ...options,
            ...span
        };

        // Make sure we received a time span, event store might be empty
        if (options.startDate && options.endDate) {
            if (options.endDate > options.startDate) {
                return this.zoomToSpan(options);
            }
            else {
                // If we only had a zero time span, just scroll it into view
                return this.scrollToDate(options.startDate);
            }
        }
    }

    /**
     * Sets time frame to specified range and applies zoom level which allows fitting all columns to this range.
     *
     * The given time span will be centered in the scheduling view, in the same time, the start/end date of the whole
     * time axis will be extended in the same way as {@link #function-zoomToLevel} method does, to allow scrolling for
     * user.
     *
     * @param {Object} config The time frame.
     * @param {Date} config.startDate The time frame start.
     * @param {Date} config.endDate The time frame end.
     * @param {Date} [config.centerDate] Date that should be kept in the center. Has priority over start and end params
     * @param {Number} [config.leftMargin] Amount of pixels to extend span start on
     * @param {Number} [config.rightMargin] Amount of pixels to extend span end on
     * @param {Number} [config.adjustStart] Amount of units to extend span start on
     * @param {Number} [config.adjustEnd] Amount of units to extend span end on
     *
     * @returns {Number|null} The current zoom level, or `null` if the view could not be zoomed.
     * @category Zoom
     */
    zoomToSpan(config = {}) {
        const
            me                = this,
            availableSpace    = me.zoomViewportSize,
            diffStartEndDates = config.endDate - config.startDate;

        // If there's nothing shown, let's move on
        if (availableSpace <= 0) {
            return;
        }

        // Use smooth zoom system when enabled (provided by TimelineSmoothZoom mixin)
        if (me.smoothZoom) {
            return me.smoothZoomToSpan(config);
        }

        if (config.leftMargin || config.rightMargin) {
            config.adjustStart = 0;
            config.adjustEnd = 0;
        }

        if (!config.leftMargin) config.leftMargin = 0;
        if (!config.rightMargin) config.rightMargin = 0;

        if (!config.startDate || !config.endDate) throw new Error('zoomToSpan: must provide startDate + endDate dates');

        config.startDate = me.getMinDateOrDate(config.startDate);
        config.endDate = me.getMaxDateOrDate(config.endDate);

        if (config.endDate <= config.startDate) {
            config.endDate = me.getMaxDateOrDate(DateHelper.add(config.startDate, diffStartEndDates));
        }

        const
            { timeAxis } = me,
            // this config enables old zoomToSpan behavior which we want to use for zoomToFit in Gantt
            needToAdjust = config.adjustStart >= 0 || config.adjustEnd >= 0;

        let {
            startDate,
            endDate
        } = config;

        if (needToAdjust) {
            startDate = DateHelper.add(startDate, -config.adjustStart, timeAxis.mainUnit);
            endDate   = DateHelper.add(endDate, config.adjustEnd, timeAxis.mainUnit);
        }

        if (startDate <= endDate) {
            // get scheduling view width
            const
                presets = me.presets.allRecords,
                diffMS  = endDate - startDate || 1;

            let currLevel = me.zoomLevel,
                inc, range;

            // if we zoomed out even more than the highest zoom level - limit it to the highest zoom level
            if (currLevel === -1) {
                currLevel = 0;
            }

            // Use configured width (ignoreActualWidth=true) to avoid issues with inflated actualWidth from previous
            // zoom operations
            let msPerPixel = me.getMilliSecondsPerPixelForZoomLevel(presets[currLevel], true),
                candidateLevel         = currLevel + (inc = diffMS / msPerPixel + config.leftMargin + config.rightMargin > availableSpace ? -1 : 1),
                zoomLevel, levelToZoom = null;

            // loop over zoom levels
            while (candidateLevel >= 0 && candidateLevel <= presets.length - 1) {
                // get zoom level
                zoomLevel = presets[candidateLevel];

                // Use configured width for consistent level selection
                msPerPixel = me.getMilliSecondsPerPixelForZoomLevel(zoomLevel, true);
                const spanWidth = diffMS / msPerPixel + config.leftMargin + config.rightMargin;

                // if zooming out
                if (inc === -1) {
                    // if columns fit into available space, then all is fine, we've found appropriate zoom level
                    if (spanWidth <= availableSpace) {
                        levelToZoom = candidateLevel;
                        // stop searching
                        break;
                    }
                }
                else if (spanWidth <= availableSpace) {
                    // if it's not currently active level
                    if (currLevel !== candidateLevel - inc) {
                        // remember this level as applicable
                        levelToZoom = candidateLevel;
                    }
                }
                else {
                    break;
                }

                candidateLevel += inc;
            }

            // If we didn't find a large/small enough zoom level, use the lowest/highest level
            levelToZoom = levelToZoom ?? candidateLevel - inc;

            // presets is the array of all ViewPresets this Scheduler is using
            zoomLevel = presets[levelToZoom];

            const unitToZoom = zoomLevel.bottomHeader.unit;

            // Extract the correct msPerPixel value for the new zoom level
            msPerPixel = me.getMilliSecondsPerPixelForZoomLevel(zoomLevel, true);

            if (config.leftMargin || config.rightMargin) {
                // time axis doesn't yet know about new view preset (zoom level) so it cannot round/ceil date correctly
                startDate = new Date(startDate.getTime() - msPerPixel * config.leftMargin);
                endDate   = new Date(endDate.getTime() + msPerPixel * config.rightMargin);
            }

            const tickCount = DateHelper.getDurationInUnit(startDate, endDate, unitToZoom, true) / zoomLevel.bottomHeader.increment;

            if (tickCount === 0) {
                return null;
            }

            const
                customWidth = Math.floor(availableSpace / tickCount),
                centerDate  = config.centerDate || new Date((startDate.getTime() + endDate.getTime()) / 2);

            if (needToAdjust) {
                range = {
                    startDate,
                    endDate
                };
            }
            else {
                range = me.calculateOptimalDateRange(centerDate, availableSpace, zoomLevel);
            }

            // Always use zoomToLevel with customWidth to ensure passed timeSpan even if level doesn't change
            const result = me.zoomToLevel(levelToZoom,
                Object.assign(range, {
                    width : customWidth,
                    centerDate
                })
            );

            if (me.zoomLevel === levelToZoom) {
                /**
                 * Fires when the requested date range cannot fit into any zoom level higher than the current level.
                 * @event noZoomChange
                 * @param {Number} currentZoomLevel The current zoom level
                 * @param {Date} startDate The requested start date
                 * @param {Date} endDate The requested end date
                 */
                me.trigger('noZoomChange', { currentZoomLevel : levelToZoom, startDate, endDate });
            }
            else {
                me.trigger('zoomToSpan', { zoomLevel : levelToZoom, startDate, endDate, centerDate });
            }

            return result;
        }

        return null;
    }

    /**
     * Zooms in the timeline according to the array of zoom levels. If the amount of levels to zoom is given, the view
     * will zoom in by this value. Otherwise, a value of `1` will be used.
     *
     * When using {@link Scheduler.view.mixin.TimelineSmoothZoom#config-smoothZoom}:
     * * `levels` instead specifies how many view presets to zoom in (by default it zooms to the next view preset).
     * * Passing a fractional `levels` value (<1) will zoom to a point between the current and next view preset,
     *   allowing for more precise zooming. Eg. `0.5` will zoom to a point halfway between the current and next preset.
     * * Can be animated by passing `{ animate : true }` in the `options` parameter.
     *
     * ```javascript
     * // Zoom in by one level with animation (requires smoothZoom: true)
     * scheduler.zoomIn({ animate : true });
     *
     * // Zoom in by 0.5 levels (halfway to the next preset) with animation (requires smoothZoom: true)
     * scheduler.zoomIn(0.5, { animate : true });
     * ```
     *
     * @param {Number} [levels] Amount of levels (view presets when smooth zooming) to zoom in.
     * @param {ChangePresetOptions} [options] Object containing options which affect how the new preset is applied.
     * @returns {Number|null|Promise} New zoom level of the panel, `null` if level hasn't changed, or a `Promise`
     * if animating with smoothZoom.
     * @category Zoom
     */
    zoomIn(levels = 1, options = {}) {
        // Allow zoomIn({ visibleDate : ... })
        if (typeof levels === 'object') {
            options = levels;
            levels = 1;
        }

        const me = this;

        // Use smooth zoom system when enabled (provided by TimelineSmoothZoom mixin)
        if (me.smoothZoom) {
            return me.smoothZoomIn(levels, options);
        }

        const currentZoomLevelIndex = me.zoomLevel;

        if (currentZoomLevelIndex >= me.maxZoomLevel) {
            return null;
        }

        return me.zoomToLevel(currentZoomLevelIndex + levels, options);
    }

    /**
     * Zooms out the timeline according to the array of zoom levels. If the amount of levels to zoom is given, the view
     * will zoom out by this value. Otherwise, a value of `1` will be used.
     *
     * When using {@link Scheduler.view.mixin.TimelineSmoothZoom#config-smoothZoom}:
     * * `levels` instead specifies how many view presets to zoom out (by default it zooms to the previous view preset).
     * * Passing a fractional `levels` value (<1) will zoom to a point between the current and previous view preset,
     *   allowing for more precise zooming. Eg. `0.5` will zoom to a point halfway between the current and previous
     *   preset.
     * * Can be animated by passing `{ animate : true }` in the `options` parameter.
     *
     * ```javascript
     * // Zoom out by one level with animation (requires smoothZoom: true)
     * scheduler.zoomOut({ animate : true });
     *
     * // Zoom out by 0.5 levels (halfway to the previous preset) with animation (requires smoothZoom: true)
     * scheduler.zoomOut(0.5, { animate : true });
     * ```
     *
     * @param {Number} [levels] Amount of levels (view presets when smooth zooming) to zoom out.
     * @param {ChangePresetOptions} [options] Object containing options which affect how the new preset is applied.
     * @returns {Number|null|Promise} New zoom level of the panel, `null` if level hasn't changed, or a Promise
     * if animating with smoothZoom.
     * @category Zoom
     */
    zoomOut(levels = 1, options = {}) {
        // Allow zoomOut({ visibleDate : ... })
        if (typeof levels === 'object') {
            options = levels;
            levels = 1;
        }

        const me = this;

        // Use smooth zoom system when enabled (provided by TimelineSmoothZoom mixin)
        if (me.smoothZoom) {
            return me.smoothZoomOut(levels, options);
        }

        const currentZoomLevelIndex = me.zoomLevel;

        if (currentZoomLevelIndex <= me.minZoomLevel) {
            return null;
        }

        return me.zoomToLevel(currentZoomLevelIndex - levels, options);
    }

    /**
     * Zooms in the timeline to the {@link #config-maxZoomLevel} according to the array of zoom levels.
     *
     * When {@link Scheduler.view.Scheduler#config-smoothZoom} is enabled, this zooms to the
     * maximum smooth zoom level.
     *
     * @param {ChangePresetOptions} [options] Object containing options which affect how the new preset is applied.
     * @returns {Number|null|Promise} currentLevel New zoom level of the panel, null if level hasn't changed,
     * or a Promise if animating with smoothZoom.
     * @category Zoom
     */
    zoomInFull(options = {}) {
        const me = this;

        // Use smooth zoom system when enabled (provided by TimelineSmoothZoom mixin)
        if (me.smoothZoom) {
            return me.smoothZoomInFull(options);
        }

        return me.zoomToLevel(me.maxZoomLevel, options);
    }

    /**
     * Zooms out the timeline to the {@link #config-minZoomLevel} according to the array of zoom levels.
     *
     * When {@link Scheduler.view.Scheduler#config-smoothZoom} is enabled, this zooms to the
     * minimum smooth zoom level.
     *
     * @param {ChangePresetOptions} [options] Object containing options which affect how the new preset is applied.
     * @returns {Number|null|Promise} currentLevel New zoom level of the panel, null if level hasn't changed,
     * or a Promise if animating with smoothZoom.
     * @category Zoom
     */
    zoomOutFull(options = {}) {
        const me = this;

        // Use smooth zoom system when enabled (provided by TimelineSmoothZoom mixin)
        if (me.smoothZoom) {
            return me.smoothZoomOutFull(options);
        }

        return me.zoomToLevel(me.minZoomLevel, options);
    }

    /*
     * Adjusts the timespan of the panel to the new zoom level. Used for performance reasons,
     * as rendering too many columns takes noticeable amount of time so their number is limited.
     * @category Zoom
     * @private
     */
    calculateOptimalDateRange(centerDate, viewportSize, viewPreset, useTickSize = null, zoomFactor = this.visibleZoomFactor) {
        const
            me               = this,
            {
                timeAxis,
                minDate,
                maxDate
            }                = me,
            { bottomHeader } = viewPreset,
            tickWidth        = useTickSize ?? (me.isHorizontal ? viewPreset.tickWidth : viewPreset.tickHeight);

        me._originalConfiguredDateRange = me._originalConfiguredDateRange || { startDate : me.startDate, endDate : me.endDate };

        if (me.zoomKeepsOriginalTimespan) {
            return me.getAllowedDateRange(centerDate, viewPreset);
        }

        const
            unit       = bottomHeader.unit,
            difference = Math.ceil(viewportSize / tickWidth * bottomHeader.increment * zoomFactor / 2);

        let
            startDate  = DateHelper.add(centerDate, -difference, unit),
            endDate    = DateHelper.add(centerDate, difference, unit);

        // If minDate and maxDate are set, we need to check if the range calculated is outside the timeline boundaries.
        if (me.isBeforeMinDate(startDate)) {
            startDate = minDate;
            endDate = DateHelper.add(startDate, difference * 2, unit);
        }
        else if (me.isAfterMaxDate(endDate)) {
            endDate = maxDate;
            startDate = DateHelper.add(endDate, difference * -2, unit);
        }

        return {
            startDate : timeAxis.floorDate(startDate, false, unit, bottomHeader.increment),
            endDate   : timeAxis.ceilDate(endDate, false, unit, bottomHeader.increment)
        };
    }

    /**
     * Returns the widest timespan, in milliseconds, that the time axis may span without exceeding
     * its `maxAllowedTickCount` for the given view preset (based on the duration of one bottom
     * level header tick).
     * @param {Scheduler.preset.ViewPreset} [viewPreset] View preset whose tick size to use.
     * Defaults to the current view preset.
     * @returns {Number} Maximum allowed timespan in milliseconds
     * @internal
     */
    getMaxAllowedMs(viewPreset) {
        viewPreset = viewPreset || this.viewPreset;

        const
            { timeAxis }            = this,
            { bottomHeader }        = viewPreset,
            { maxAllowedTickCount } = timeAxis;

        return maxAllowedTickCount * DateHelper.asMilliseconds(bottomHeader.increment, bottomHeader.unit);
    }

    /*
     * Calculates allowed data range for viewPreset using centerDate, according to maxAllowedTickCount value.
     * If no canterDate, viewPreset passed, current one will be used.
     * @private
     */
    getAllowedDateRange(centerDate, viewPreset) {
        const me = this;

        centerDate = centerDate || new Date((me.startDate.getTime() + me.endDate.getTime()) / 2);
        viewPreset = viewPreset || me.viewPreset;

        const
            { timeAxis }      = me,
            incrementDiff     = me.getMaxAllowedMs(viewPreset) / 2,
            maxAllowedEndDate = DateHelper.add(centerDate, incrementDiff);

        if (me.endDate > maxAllowedEndDate) {
            console.warn('Warn: start/end dates exceeds max allowed date range for current viewPreset, it was recalculated automatically.');
            const
                startDate = DateHelper.add(centerDate, -incrementDiff),
                endDate   = DateHelper.add(centerDate, incrementDiff);

            return { startDate, endDate };
        }
        else {
            // recover original dateRange if applicable
            const { startDate, endDate } = me._originalConfiguredDateRange || me;

            if (endDate < maxAllowedEndDate) {
                return { startDate, endDate };
            }
        }

        return {
            startDate : timeAxis.startDate,
            endDate   : timeAxis.endDate
        };
    }

    onElementMouseMove(event) {
        const
            {
                isHorizontal,
                zoomContext
            } = this;

        super.onElementMouseMove(event);

        // Invalidate the zoomContext if mouse has strayed away from it
        if (event.isTrusted && zoomContext) {
            if (Math.abs(event[`client${isHorizontal ? 'X' : 'Y'}`] - zoomContext.coordinate) > 10) {
                this.zoomContext = null;
            }
        }
    }

    onWheel(event) {
        // Checking both ctrlKey and metaKey for Mac, since pinch zooming translates to ctrl+wheel, but we remap that to
        // meta
        if ((event.ctrlKey || event.metaKey) && !this.forceFit) {
            event.preventDefault();

            const me = this;

            // Use smooth zoom system for finer-grained wheel zooming (provided by TimelineSmoothZoom mixin)
            if (me.smoothZoom) {
                me.onSmoothWheel(event);
            }
            // Use discrete preset-based zooming (original behavior)
            else {
                const
                    {
                        zoomContext,
                        isHorizontal,
                        timelineScroller,
                        zoomLevel
                    }            = me,
                    now          = performance.now(),
                    coordinate   = event[`client${isHorizontal ? 'X' : 'Y'}`];

                let zoomPosition;

                // zoomPosition is the offset into the TimeAxisSubGridElement.
                if (isHorizontal && me.rtl) {
                    zoomPosition = timelineScroller.viewport.width + timelineScroller.viewport.x - coordinate;
                }
                else {
                    zoomPosition = coordinate - timelineScroller.viewport[`${isHorizontal ? 'x' : 'y'}`];
                }

                // If we are in a fast-arriving stream of wheel events, we use the same zoomDate as last time.
                // If it's a new zoom gesture or the pointer has strayed away from the context then ascertain
                // the gesture's center date
                if (now - me.lastWheelTime > 200 || !zoomContext || Math.abs(coordinate - me.zoomContext.coordinate) > 20) {
                    // We're creating a zoom gesture which lasts as long as the
                    // wheel events keep arriving at the same timeline position
                    me.zoomContext = {
                        // So we can track if we're going in (to finer resolutions)
                        zoomLevel,

                        // Pointer client(X|Y)
                        coordinate,

                        // Full TimeAxis offset position at which to place the date
                        zoomPosition,

                        // The date to place at the position
                        zoomDate : me.getDateFromDomEvent(event)
                    };
                }
                // Use the current zoomContext's zoomDate, but at each level, the relative position of that date
                // in the TimeAxis has to be corrected as the TimeAxis grows and scrolls to keep the zoomPosition
                // stable.
                else {
                    // If we zoom in to a finer resolution, get a more accurate centering date.
                    // If gesture was started at a years/months level, the date will be inaccurate.
                    if (zoomLevel > zoomContext.zoomLevel) {
                        zoomContext.zoomDate = me.getDateFromDomEvent(event);
                        zoomContext.zoomLevel = zoomLevel;
                    }
                    zoomContext.zoomPosition = zoomPosition;
                }

                me.lastWheelTime = now;
                me[`zoom${event.deltaY > 0 ? 'Out' : 'In'}`](undefined, me.zoomContext);
            }
        }
    }

    /**
     * Moves the time axis by the passed amount and unit.
     *
     * NOTE: If using a filtered time axis, see {@link Scheduler.data.TimeAxis#function-shift} for more information.
     *
     * @param {Number} amount The number of units to jump
     * @param {DurationUnitShort} [unit] The unit (Day, Week etc.)
     */
    shift(amount, unit) {
        // Clear cached center date and original date range so that the next zoom operation
        // recalculates the new center date and the date range for zoomKeepsOriginalTimespan
        this._originalConfiguredDateRange = null;
        this.cachedCenterDate = null;
        this.timeAxis.shift(amount, unit);
    }

    /**
     * Moves the time axis forward in time in units specified by the view preset `shiftUnit`, and by the amount
     * specified by the `shiftIncrement` config of the current view preset.
     *
     * NOTE: If using a filtered time axis, see {@link Scheduler.data.TimeAxis#function-shiftNext} for more information.
     *
     * @param {Number} [amount] The number of units to jump forward
     */
    shiftNext(amount) {
        // Clear cached center date and original date range so that the next zoom operation
        // recalculates the new center date and the date range for zoomKeepsOriginalTimespan
        this._originalConfiguredDateRange = null;
        this.cachedCenterDate = null;
        this.timeAxis.shiftNext(amount);
    }

    /**
     * Moves the time axis backward in time in units specified by the view preset `shiftUnit`, and by the amount
     * specified by the `shiftIncrement` config of the current view preset.
     *
     * NOTE: If using a filtered time axis, see {@link Scheduler.data.TimeAxis#function-shiftPrevious} for more
     * information.
     *
     * @param {Number} [amount] The number of units to jump backward
     */
    shiftPrevious(amount) {
        // Clear cached center date and original date range so that the next zoom operation
        // recalculates the new center date and the date range for zoomKeepsOriginalTimespan
        this._originalConfiguredDateRange = null;
        this.cachedCenterDate = null;
        this.timeAxis.shiftPrevious(amount);
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
