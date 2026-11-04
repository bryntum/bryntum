import Base from '../../../Core/Base.js';
import PresetManager from '../../preset/PresetManager.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import PresetStore from '../../preset/PresetStore.js';
import DateHelper from '../../../Core/helper/DateHelper.js';

/**
 * @module Scheduler/view/mixin/TimelineViewPresets
 */

/**
 * Options for setting a view preset.
 * @typedef {ViewPresetConfig} ViewPresetOptions
 * @property {Object} options View preset options
 * @property {Date} [options.startDate] A new start date for the time axis
 * @property {Date} [options.endDate] A new end date for the time axis
 * @property {Date} [options.centerDate] Where to center the new time axis
 * @property {Number} [options.scrollPosition] The scroll position to scroll the new time axis to. This takes precedence over any date-scrolling.
 *   It is used when partnering two timelines which must be scroll-synced
 */

const
    filterLegacy = preset => preset.useForLegacyZoom !== false,
    filterSmooth = preset => preset.excludeForSmoothZoom !== true;

/**
 * View preset handling.
 *
 * A Scheduler's {@link #config-presets} are loaded with a default set of {@link Scheduler.preset.ViewPreset} instances
 * which are defined by the system in the {@link Scheduler.preset.PresetManager}.
 *
 * The zooming feature works by reconfiguring the Scheduler with a new {@link Scheduler.preset.ViewPreset} selected
 * from the {@link #config-presets} store.
 *
 * {@link Scheduler.preset.ViewPreset ViewPresets} can be added and removed from the store to change the amount of
 * available steps. Range of zooming in/out can be also modified with
 * {@link Scheduler.view.TimelineBase#config-maxZoomLevel} / {@link Scheduler.view.TimelineBase#config-minZoomLevel}
 * properties.
 *
 * This mixin adds additional methods to the Scheduler : {@link Scheduler.view.TimelineBase#property-maxZoomLevel},
 * {@link Scheduler.view.TimelineBase#property-minZoomLevel}, {@link Scheduler.view.TimelineBase#function-zoomToLevel},
 * {@link Scheduler.view.TimelineBase#function-zoomIn}, {@link Scheduler.view.TimelineBase#function-zoomOut},
 * {@link Scheduler.view.TimelineBase#function-zoomInFull}, {@link Scheduler.view.TimelineBase#function-zoomOutFull}.
 *
 * {@note}Zooming is not supported when `forceFit` option is set to `true` for the Scheduler or when using a filtered
 * time axis.{/@note}
 *
 * ## See also
 *
 * - {@link Scheduler.preset.ViewPreset} - View preset configuration
 * - {@link Scheduler.preset.PresetStore} - Preset store
 * - {@link Scheduler.view.mixin.TimelineZoomable} - Zoom functionality
 * - {@link Scheduler.view.mixin.TimelineSmoothZoom} - Smooth zoom functionality
 *
 * @mixin
 */
export default Target => class TimelineViewPresets extends (Target || Base) {
    static $name = 'TimelineViewPresets';

    //region Default config

    static configurable = {
        /**
         * A string key used to look up a predefined {@link Scheduler.preset.ViewPreset} (e.g. 'weekAndDay',
         * 'hourAndDay'), managed by {@link Scheduler.preset.PresetManager}. See {@link Scheduler.preset.PresetManager}
         * for more information. Or a config object for a viewPreset.
         *
         * Options:
         * - 'secondAndMinute'
         * - 'minuteAndHour'
         * - 'hourAndDay'
         * - 'dayAndWeek'
         * - 'dayAndMonth'
         * - 'weekAndDay'
         * - 'weekAndMonth',
         * - 'monthAndYear'
         * - 'year'
         * - 'manyYears'
         * - 'weekAndDayLetter'
         * - 'weekDateAndMonth'
         * - 'day'
         * - 'week'
         *
         * If passed as a config object, the settings from the viewPreset with the provided `base` property will be used
         * along with any overridden values in your object.
         *
         * To override:
         * ```javascript
         * viewPreset : {
         *   base    : 'hourAndDay',
         *   id      : 'myHourAndDayPreset',
         *   headers : [
         *       {
         *           unit      : "hour",
         *           increment : 12,
         *           renderer  : (startDate, endDate, headerConfig, cellIdx) => {
         *               return "";
         *           }
         *       }
         *   ]
         * }
         * ```
         * or set a new valid preset config if the preset is not registered in the
         * {@link Scheduler.preset.PresetManager}.
         *
         * @config {String|ViewPresetConfig}
         * @default
         * @category Common
         */
        viewPreset : 'weekAndDayLetter',

        /**
         * Get the {@link Scheduler.preset.PresetStore} created for the Scheduler, or set an array of
         * {@link Scheduler.preset.ViewPreset} config objects.
         * @member {Scheduler.preset.PresetStore|ViewPresetConfig[]} presets
         * @category Common
         */
        /**
         * An array of {@link Scheduler.preset.ViewPreset} config objects which describes the available timeline layouts
         * for this scheduler.
         *
         * By default, a predefined set is loaded from the {@link Scheduler.preset.PresetManager}.
         *
         * A {@link Scheduler.preset.ViewPreset} describes the granularity of the timeline view and the layout and
         * subdivisions of the timeline header.
         * @config {ViewPresetConfig[]} presets
         *
         * @category Common
         */
        presets : true,

        /**
         * Defines how dates will be formatted in tooltips etc. This config has priority over similar config on the
         * view preset. For allowed values see {@link Core.helper.DateHelper#function-format-static}.
         *
         * By default, this is ingested from {@link Scheduler.preset.ViewPreset} upon change of
         * {@link Scheduler.preset.ViewPreset} (Such as when zooming in or out). But Setting this to your own value,
         * overrides that behavior.
         * @prp {String}
         * @category Scheduled events
         */
        displayDateFormat : null
    };

    //endregion

    /**
     * Get/set the current view preset
     * @member {Scheduler.preset.ViewPreset|ViewPresetOptions|String} viewPreset
     * @category Common
    */

    //region Get/set

    changePresets(presets) {
        const config = {
            owner : this,
            // By default includes all presets
            data  : presets === true ? PresetManager.data : []
        };

        if (presets !== true) {
            // Accepts an array of presets
            if (Array.isArray(presets)) {
                for (const preset of presets) {
                    // If we got a presetId
                    if (typeof preset === 'string') {
                        const presetRecord = PresetManager.getById(preset);
                        if (presetRecord) {
                            config.data.push(presetRecord.data);
                        }
                    }
                    else {
                        config.data.push(preset);
                    }
                }
            }
            // Or a store config object
            else {
                ObjectHelper.assign(config, presets);
            }
        }

        // Filter out any presets that should not be used by legacy zooming, or smoothZoomin, depending on mode
        config.data = config.data.filter(this.smoothZoom ? filterSmooth : filterLegacy);

        return new PresetStore(config);
    }

    changeViewPreset(viewPreset, oldViewPreset) {
        const
            me = this,
            {
                presets
            }  = me;

        if (viewPreset) {
            viewPreset = presets.createRecord(viewPreset);

            // If an existing ViewPreset id is used, this will replace it.
            if (!presets.includes(viewPreset)) {
                presets.add(viewPreset);

                // If the new preset is based of an existing preset, and it's minTickSize and leafUnit is not
                // overridden, then the original preset should not be used for smooth zooming, since they would collide
                if (viewPreset.base) {
                    const base = presets.getById(viewPreset.base);
                    if (base && viewPreset.minTickWidth === base.minTickWidth && viewPreset.leafUnit === base.leafUnit) {
                        // ViewPresets are not meant to be modified, work around that
                        base.data.useForSmoothZoom = false;
                    }
                }
            }
        }
        else {
            viewPreset = presets.first;
        }

        const
            lastOpts = me.lastViewPresetOptions || {},
            options  = viewPreset.options || (viewPreset.options = {}),
            event    = {
                ...options,
                from   : oldViewPreset,
                to     : viewPreset,
                preset : viewPreset
            },
            presetChanged  = !me._viewPreset || !me._viewPreset.equals(viewPreset);

        delete lastOpts.event;

        // Only return the value for onward processing if there's a change
        if (presetChanged || !ObjectHelper.isEqual(options, lastOpts)) {
            // Assign event after comparison, to not have it get super expensive
            options.event = event;

            // Bypass the no-change check if the viewPreset is the same and we only got in here
            // because different options were asked for.
            if (!presetChanged) {
                me._viewPreset = null;
            }

            /**
             * Fired before the {@link #config-viewPreset} is changed.
             * @event beforePresetChange
             * @param {Scheduler.view.Scheduler} source This Scheduler instance.
             * @param {Date} startDate The new start date of the timeline.
             * @param {Date} endDate The new end date of the timeline.
             * @param {Scheduler.preset.ViewPreset} from The outgoing ViewPreset.
             * @param {Scheduler.preset.ViewPreset} to The ViewPreset being switched to.
             * @preventable
             */
            // Do not trigger events for the initial preset
            if (me.isConfiguring || me.trigger('beforePresetChange', event) !== false) {
                return viewPreset;
            }
        }
    }

    get displayDateFormat() {
        return this._displayDateFormat || this.viewPreset.displayDateFormat;
    }

    updateDisplayDateFormat(format) {
        // Start/EndDateColumn listens for this to change their format to match
        this.trigger('displayDateFormatChange', { format });
    }

    /**
     * Method to get a formatted display date
     * @private
     * @param {Date} date The date
     * @returns {String} The formatted date
     */
    getFormattedDate(date) {
        return this.dateHelper.format(date, this.displayDateFormat);
    }

    updateViewPreset(preset) {
        const
            me          = this,
            { options } = preset,
            {
                event,
                startDate,
                endDate,
                zoomDate,
                zoomPosition
            }           = options,
            {
                hasTimelineBoundaries,
                isHorizontal,
                _timeAxis : timeAxis,    // Do not tickle the getter, we are just peeking to see if it's there yet.
                _timeAxisViewModel : timeAxisViewModel // Ditto
            }           = me,
            rtl         = isHorizontal && me.rtl;

        me.syncSplits?.(split => split.viewPreset = preset);

        let
            { centerDate } = options,
            forceUpdate    = false;

        // Options must not be reused when this preset is used again.
        delete preset.options;

        // Raise flag to prevent partner from changing view preset if one is in progress
        me._viewPresetChanging = true;

        if (timeAxis && !me.isConfiguring) {
            const { timelineScroller } = me;

            // Cache options only when they are applied so that non-change vetoing in changeViewPreset is accurate
            me.lastViewPresetOptions = options;

            // Timeaxis may already be configured (in case of sharing with the timeline partner), no need to reconfigure it
            if (timeAxis.isConfigured) {
                // None of this reconfiguring should cause a refresh
                me.suspendRefresh();

                // Set up these configs only if we actually have them.
                const timeAxisCfg = ObjectHelper.copyProperties({}, me, [
                    'weekStartDay',
                    'startTime',
                    'endTime'
                ]);

                // If we are using a fixed range, zooming must not change the range.
                if (me.range && me.calendar && !me.isConfiguring) {
                    timeAxisCfg.startDate = me.startDate;
                    timeAxisCfg.endDate = me.endDate;
                }
                else if (me.infiniteScroll) {
                    Object.assign(timeAxisCfg, me.calculateInfiniteScrollingDateRange(
                        centerDate || (startDate && endDate ? new Date((startDate.getTime() + endDate.getTime()) / 2) : me.viewportCenterDateCached),
                        true,
                        preset
                    ));
                }
                // if startDate is provided we use it and the provided endDate
                else if (startDate) {
                    timeAxisCfg.startDate = startDate;
                    timeAxisCfg.endDate = endDate;

                    // if both dates are provided we can calculate centerDate for the viewport
                    if (!centerDate && endDate) {
                        centerDate = new Date((startDate.getTime() + endDate.getTime()) / 2);
                    }

                    // when no start/end dates are provided we use the current timespan
                }
                else {
                    timeAxisCfg.startDate = timeAxis.startDate;
                    timeAxisCfg.endDate = endDate || timeAxis.endDate;

                    if (!centerDate) {
                        centerDate = me.viewportCenterDate;
                    }
                }

                timeAxis.isConfigured = false;
                timeAxisCfg.viewPreset = preset;
                timeAxis.reconfigure(timeAxisCfg, true);

                timeAxisViewModel.reconfigure({
                    viewPreset : preset,
                    headers    : preset.headers,

                    // This was hardcoded to 'middle' prior to the Preset refactor.
                    // In the old code, the default headers were 'top' and 'middle', which
                    // meant that 'middle' meant the lowest header.
                    // So this is now length - 1.
                    columnLinesFor : preset.columnLinesFor != null ? preset.columnLinesFor : preset.headers.length - 1,

                    tickSize : options.tickSize || (isHorizontal ? preset.tickWidth : preset.tickHeight || preset.tickWidth || 60)
                });

                // A ViewPreset is extremely opinionated about its tickSize and imposes it upon the Scheduler.
                // Allow the caller to correct the tick size after the reconfigure using the options block.
                if (options.tickSize) {
                    me.tickSize = options.tickSize;
                }

                // Allow refresh to run after the reconfiguring, without refreshing since we will do that below anyway
                me.resumeRefresh(false);
            }

            // Read the scroll position before refreshing. Reading it afterwards means reading scrollLeft from
            // an invalidated DOM, which forces a synchronous layout of the whole time axis - on a large dataset
            // that single read can cost hundreds of milliseconds on every zoom
            const currentScrollPos = timelineScroller.position;

            // A gesture reusing the event layout keeps it across the preset change, the scroll below leads to its bars
            // being moved, see SchedulerZoomable#liveZoom
            if (!me.$reusingEventLayout || !me.currentOrientation.supportsLayoutReuse) {
                if (me.$wheelZooming) {
                    // Clear layouts, the (forced if needed) scroll below will lead to events being rendered
                    me.currentOrientation.clearAll();
                }
                else {
                    me.refresh();
                }
            }

            // if view is rendered and scroll is not disabled by "notScroll" option
            if (!options.notScroll && me.isPainted) {
                if ('scrollPosition' in options) {
                    // If we are not going to end up scrolling, we need to force an update
                    forceUpdate = timelineScroller.position === options.scrollPosition;
                    timelineScroller.scrollTo(options.scrollPosition);
                }
                else if (options.visibleDate) {
                    me.visibleDate = options.visibleDate;
                }
                // If a zoom at a certain date position is being requested, scroll the zoomDate
                // to the required zoomPosition so that the zoom happens centered where the
                // pointer events that are driving it targeted.
                else if (zoomDate && zoomPosition) {
                    let
                        roundPrecision = 15,
                        unit           = 'minute';

                    // Round the date to either 15 minutes for fine levels or 1 hour for coarse levels
                    if (DateHelper.compareUnits(timeAxis.resolutionUnit, 'hour') > 0) {
                        roundPrecision = 1;
                        unit = 'hour';
                    }

                    const
                        roundPrecisionMs = DateHelper.asMilliseconds(roundPrecision, unit),
                        targetDate       = new Date(Math.round(zoomDate / roundPrecisionMs) * roundPrecisionMs);

                    // if one partner was provided with zoom info, other one has to be too to generate exact
                    // header and set same scroll
                    event.zoomDate = zoomDate;
                    event.zoomPosition = zoomPosition;
                    event.zoomLevel = options.zoomLevel;

                    // If minDate and maxDate are set and timeline is scrolled to 0, horizontal scroll event will be not triggered
                    // and then the new range will be not calculated. We need to call it manually here.
                    if (hasTimelineBoundaries && timelineScroller.position === 0) {
                        me.currentOrientation.updateFromHorizontalScroll(0, true, true);
                    }

                    // Move the targetDate back under the mouse position as indicated by zoomPosition.
                    // That is the offset into the TimeAxisSubGridElement.
                    if (rtl) {
                        timelineScroller.position = timeAxisViewModel.totalSize - (me.getCoordinateFromDate(targetDate) + zoomPosition);
                    }
                    else {
                        timelineScroller.position = me.getCoordinateFromDate(targetDate) - zoomPosition;
                    }
                }
                // and we have centerDate to scroll to
                else if (centerDate) {
                    // remember the central date we scroll to (it gets reset after user scroll)
                    me.cachedCenterDate = centerDate;

                    // if one partner was provided with a centerDate, other one has to be too to generate exact
                    // header and set same scroll
                    event.centerDate = centerDate;

                    const
                        viewportSize     = timelineScroller.clientSize,
                        centerCoord      = rtl ? me.timeAxisViewModel.totalSize - me.getCoordinateFromDate(centerDate, true)
                            : me.getCoordinateFromDate(centerDate, true),
                        coord            = Math.round(Math.max(centerCoord - viewportSize / 2, 0));

                    // If preset change does not lead to a scroll, or if the time axis content fits
                    // within the viewport (no scroll range available), we have to "refresh" manually
                    // at the end. The latter case handles non-uniform time units (e.g. months with
                    // 28-31 days) where the calendar midpoint does not align with the pixel midpoint,
                    // producing a small non-zero coord even though scrolling is not possible.
                    if (coord === currentScrollPos || timeAxisViewModel.isStretchingTicks) {
                        forceUpdate = true;
                    }
                    else {
                        me[me.isHorizontal ? 'scrollHorizontallyTo' : 'scrollVerticallyTo'](coord, { scrollingToCenter : true });
                    }
                }
                // If we don't have a center date to scroll to, we reset scroll (this is bw compatible behavior)
                else {
                    timelineScroller.scrollTo(0);
                }
            }

            // If the scroll position didn't actually change (browser clamped it, e.g. when
            // content fits within viewport after zooming out, or calculated coord < 0), no scroll event will fire
            // and the visible date range won't be updated. Force update in this case (#12655)
            if (timelineScroller.position === currentScrollPos) {
                forceUpdate = true;
            }
        }

        // Update Scheduler element showing what preset is applied
        me.dataset.presetId = preset.id;

        if (preset.rowHeight && !me.initialConfig.rowHeight) {
            me.rowHeight = preset.rowHeight;
        }

        /**
         * Fired after the {@link #config-viewPreset} has changed.
         * @event presetChange
         * @param {Scheduler.view.Scheduler} source This Scheduler instance.
         * @param {Date} startDate The new start date of the timeline.
         * @param {Date} centerDate The new center date of the timeline.
         * @param {Date} endDate The new end date of the timeline.
         * @param {Scheduler.preset.ViewPreset} from The outgoing ViewPreset.
         * @param {Scheduler.preset.ViewPreset} to The ViewPreset being switched to.
         * @preventable
         */
        me.trigger('presetChange', event);

        me._viewPresetChanging = false;

        if (forceUpdate && !me.$wheelZooming) {
            if (me.isHorizontal) {
                me.currentOrientation.updateFromHorizontalScroll(me.scrollX, true);
            }
            else {
                me.currentOrientation.updateFromVerticalScroll(me.scrollTop);
            }
        }
    }

    //endregion

    doDestroy() {
        if (this._presets.owner === this) {
            this._presets.destroy();
        }
        super.doDestroy();
    }

    // This function is not meant to be called by any code other than Base#getCurrentConfig().
    getCurrentConfig(options) {
        const result = super.getCurrentConfig(options);

        // Cannot store name, will not be allowed when reapplying
        if (result.viewPreset && result.viewPreset.name && !result.viewPreset.base) {
            delete result.viewPreset.name;
        }

        return result;
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
