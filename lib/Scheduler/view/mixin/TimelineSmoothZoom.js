import Base from '../../../Core/Base.js';
import AsyncHelper from '../../../Core/helper/AsyncHelper.js';
import DateHelper from '../../../Core/helper/DateHelper.js';

/**
 * @module Scheduler/view/mixin/TimelineSmoothZoom
 */

const
    MIN_TICK_SIZE               = 19,
    MAX_TICK_SIZE               = 200,
    MAX_TICK_COUNT              = 2000,
    SMOOTH_ZOOM_ANIMATION_DELAY = 20,
    SMOOTH_ZOOM_ANIMATION_STEPS = 10;

/**
 * Mixin providing smooth zooming functionality for timeline views.
 *
 * ## How it works
 *
 * Without smooth zoom, the Scheduler jumps between discrete {@link Scheduler.preset.ViewPreset ViewPresets} when
 * zooming in or out. Each preset defines its own time resolution, header rows and tick size — so zooming feels like
 * switching between a fixed set of snapshots.
 *
 * With smooth zoom enabled, the system builds an internal index of interpolated zoom levels between each pair of
 * presets. Instead of jumping, it continuously scales the tick size within a preset's range and seamlessly transitions
 * to the next preset when the boundary is reached. This produces a fluid, map-like zoom experience.
 *
 * Legacy zoom (discrete presets):
 *
 * {@inlineexample Scheduler/view/mixin/TimelineSmoothZoomLegacy.js}
 *
 * Smooth zoom (interpolated levels):
 *
 * {@inlineexample Scheduler/view/mixin/TimelineSmoothZoomSmooth.js}
 *
 * ## Smooth zoom is the default
 *
 * Smooth zoom is enabled by default. Setting the {@link #config-smoothZoom} config to `false` falls back to the legacy
 * zoom system, which is deprecated.
 *
 * All standard zoom methods ({@link Scheduler.view.mixin.TimelineZoomable#function-zoomIn},
 * {@link Scheduler.view.mixin.TimelineZoomable#function-zoomOut},
 * {@link Scheduler.view.mixin.TimelineZoomable#function-zoomInFull},
 * {@link Scheduler.view.mixin.TimelineZoomable#function-zoomOutFull},
 * {@link Scheduler.view.mixin.TimelineZoomable#function-zoomToSpan}) automatically use the smooth zoom system.
 * Mouse wheel and trackpad pinch gestures also zoom smoothly.
 *
 * ## Animated programmatic zoom
 *
 * Pass `animate : true` to zoom methods for a smooth animated transition:
 *
 * ```javascript
 * // Animated zoom in / out
 * await scheduler.zoomIn({ animate : true });
 * await scheduler.zoomOut({ animate : true, steps : 20 });
 *
 * // Animated zoom to fit
 * await scheduler.zoomToFit({ animate : true });
 * ```
 *
 * ## TimeZoomSlider widget
 *
 * The {@link Scheduler.widget.TimeZoomSlider} widget provides a visual slider for controlling the smooth zoom level.
 * Add it to a toolbar for interactive zoom control:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     tbar : [
 *         { type : 'timezoomslider' }
 *     ]
 * });
 * ```
 *
 * ## Excluding presets
 *
 * By default, the following presets are part of the smooth zoom sequence and will have interpolated levels generated
 * between them:
 *
 * - `manyYears`
 * - `year`
 * - `monthAndYear`
 * - `weekDateAndMonth`
 * - `weekAndDayLetter`
 * - `sixHoursAndDay`
 * - `hourAndDay`
 * - `minuteAndHour`
 * - `fifteenMinutesAndHour`
 *
 * Individual presets can be excluded from the smooth zoom sequence by setting `useForSmoothZoom : false` on the
 * preset. The zoom system will skip these presets when building its interpolated index:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     presets : [
 *         { base : 'hourAndDay' },
 *         { base : 'minuteAndHour', useForSmoothZoom : false },
 *         { base : 'weekAndMonth' }
 *     ]
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Scheduler.view.mixin.TimelineZoomable} - Legacy zooming functionality
 * - {@link Scheduler.widget.TimeZoomSlider} - Zoom slider widget
 * - {@link Scheduler.preset.ViewPreset} - View preset definition
 *
 * @mixin
 */
export default Target => class TimelineSmoothZoom extends (Target || Base) {
    static $name = 'TimelineSmoothZoom';

    static configurable = {
        /**
         * When `true` (default), all zoom operations ({@link Scheduler.view.mixin.TimelineZoomable#function-zoomIn},
         * {@link Scheduler.view.mixin.TimelineZoomable#function-zoomOut},
         * {@link Scheduler.view.mixin.TimelineZoomable#function-zoomInFull},
         * {@link Scheduler.view.mixin.TimelineZoomable#function-zoomOutFull}) will use the smooth zoom system instead
         * of jumping between discrete preset levels. This provides finer-grained control over zoom levels by
         * interpolating tick sizes between presets.
         *
         * When enabled:
         * - `zoomIn()` and `zoomOut()` step through smooth zoom levels proportionally
         * - `zoomInFull()` and `zoomOutFull()` can animate to min/max smooth zoom levels
         * - Mouse wheel zooming uses smooth incremental steps
         * - The `animate` option is supported for smooth animated zooming
         *
         * Pass `false` to use legacy zooming. But note that legacy zooming has been deprecated and support for it
         * will be removed in a future release.
         *
         * By default, the following presets are part of the smooth zoom sequence and will have interpolated levels
         * generated between them:
         *
         * - `manyYears`
         * - `year`
         * - `monthAndYear`
         * - `weekDateAndMonth`
         * - `weekAndDayLetter`
         * - `sixHoursAndDay`
         * - `hourAndDay`
         * - `minuteAndHour`
         * - `fifteenMinutesAndHour`
         *
         * Individual presets can be excluded from the smooth zoom sequence by setting `useForSmoothZoom : false` on the
         * preset. The zoom system will skip these presets when building its interpolated index:
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     presets : [
         *         { base : 'hourAndDay' },
         *         { base : 'minuteAndHour', useForSmoothZoom : false },
         *         { base : 'weekAndMonth' }
         *     ]
         * });
         * ```
         *
         * @config {Boolean}
         * @default
         * @category Zoom
         * @deprecated 8.0.0 The legacy zoom system is deprecated and will be removed in a future release
         */
        smoothZoom : true,

        /**
         * Current smooth zoom level index.
         *
         * On read, it returns the index closest to the current tick size. If the current preset is not flagged with
         * `useForSmoothZoom`, finds the closest preset that is.
         *
         * @prp {Number}
         * @category Zoom
         * @internal
         */
        smoothZoomLevel : -1,

        /**
         * Factor multiplied with wheel delta to calculate smooth zoom level changes when zooming with mouse wheel or
         * trackpad pinch gestures. A higher value means faster zooming.
         *
         * The default value of `1.5` means that a wheel delta of `-1` would zoom in 1.5 smooth zoom levels.
         *
         * {@note}Only applies when using {@link #config-smoothZoom}.{/@note}
         *
         * @prp {Number}
         * @category Zoom
         * @default
         */
        zoomFactor : 1.5,

        /**
         * Maximum number of interpolated zoom levels to generate between each pair of presets when using smooth
         * zooming. This limits the total number of smooth zoom levels and prevents excessively long zooming chains when
         * presets have a large tick size difference.
         *
         * @prp {Number}
         * @category Zoom
         * @default
         * @advanced
         * @internal
         */
        maxZoomSteps : 100
    };

    static delayable = {
        onSmoothWheelEnd : 200
    };

    //region Smooth zoom index

    updateMaxZoomSteps() {
        if (!this.isConfiguring) {
            this.$smoothZoomIndex = null;
            this.buildSmoothZoomIndex();
        }
    }

    /**
     * Builds the smooth zoom index - a flat array of zoom levels between presets.
     * @private
     */
    buildSmoothZoomIndex() {
        const me  = this;

        if (!me.$smoothZoomIndex) {
            const
                smoothZoomIndex     = me.$smoothZoomIndex = [],
                smoothZoomPresetMap = me.$smoothZoomPresetMap = new Map(),
                minPresetName       = typeof me._minZoomLevel === 'string' ? me._minZoomLevel : null,
                maxPresetName       = typeof me._maxZoomLevel === 'string' ? me._maxZoomLevel : null;

            let reachedMin = !minPresetName;

            for (const preset of me.presets) {
                if (preset.useForSmoothZoom !== false) {
                    // Skip presets before the configured minZoomLevel preset
                    if (!reachedMin) {
                        if (preset.id === minPresetName) {
                            reachedMin = true;
                        }
                        else {
                            continue;
                        }
                    }

                    const
                        minTickSize = me.getPresetMinTickSize(preset),
                        isMaxPreset = maxPresetName && preset.id === maxPresetName;

                    let nextPreset = preset, limit;

                    do {
                        nextPreset = me.presets.getNext(nextPreset);
                    } while (nextPreset && nextPreset.useForSmoothZoom === false);

                    // When this is the configured max preset, treat it as the last one
                    if (nextPreset && !isMaxPreset) {
                        const
                            nextMinTickSize = me.getPresetMinTickSize(nextPreset),
                            scaleFactor     = me.getPresetChangeScaleFactor(preset, nextPreset);

                        limit = nextMinTickSize / scaleFactor;
                    }
                    else {
                        limit = me.getPresetMaxTickSize(preset);
                    }

                    const
                        range      = limit - minTickSize,
                        stepCount  = Math.min(Math.floor(range), me.maxZoomSteps),
                        increment  = range / stepCount,
                        startIndex = smoothZoomIndex.length;

                    if (range <= 0 && me.zoomOnMouseWheel) {
                        console.warn(`Preset "${preset.id}" has min tick size ${minTickSize} which does not give it any room to be displayed before the next preset ("${nextPreset.id}") takes over in the smooth zoom chain. The preset will not be included in the smooth zoom chain. To get rid of this warning, tweak the preset's settings or flag it (or the next preset) with "useForSmoothZoom: false" to exclude from smooth zooming.`);
                        continue;
                    }

                    for (let i = 0; i < stepCount; i++) {
                        const tickSize = minTickSize + i * increment;

                        smoothZoomIndex.push({
                            presetName : preset.id,
                            preset,
                            tickSize,
                            msPerPx    : DateHelper.asMilliseconds(preset.leafIncrement, preset.leafUnit) / tickSize
                        });
                    }

                    // Create a map of presets for quicker lookup later
                    smoothZoomPresetMap.set(preset.id, {
                        startIndex,
                        endIndex : smoothZoomIndex.length - 1
                    });

                    // Stop after the configured maxZoomLevel preset
                    if (isMaxPreset) {
                        break;
                    }
                }
            }

            // A preset configured as min/maxZoomLevel boundary only works under smoothZoom if it is part of the
            // smooth zoom chain. Warn when an out-of-chain preset is used so it is not silently ignored.
            if (me.smoothZoom) {
                if (minPresetName && !smoothZoomPresetMap.has(minPresetName)) {
                    console.warn(`minZoomLevel preset "${minPresetName}" is not in the smooth zoom chain and will be ignored. Use a preset that is part of the smooth zoom chain, see Scheduler.view.mixin.TimelineSmoothZoom "Excluding presets" docs.`);
                }

                if (maxPresetName && !smoothZoomPresetMap.has(maxPresetName)) {
                    console.warn(`maxZoomLevel preset "${maxPresetName}" is not in the smooth zoom chain and will be ignored. Use a preset that is part of the smooth zoom chain, see Scheduler.view.mixin.TimelineSmoothZoom "Excluding presets" docs.`);
                }
            }

            // Internal event listened to by the TimeZoomSlider widget to know when the smooth zoom index has changed,
            // to let it update its min & max values
            me.trigger('zoomIndexUpdate');
        }
    }

    get smoothZoomIndex() {
        // Ensure index is set up
        this.buildSmoothZoomIndex();

        return this.$smoothZoomIndex;
    }

    get smoothZoomLevel() {
        const
            me              = this,
            { viewPreset }  = me,
            index           = me.smoothZoomIndex,
            presetMap       = me.$smoothZoomPresetMap,
            indexRange      = presetMap?.get(viewPreset.id),
            currentTickSize = me.timeAxisViewModel.tickSize;

        let closestLevel = -1,
            closestDiff  = Infinity;

        // If current preset is not in smooth zoom index, find the closest one that is
        if (!indexRange) {
            const currentMsPerPx = DateHelper.asMilliseconds(viewPreset.leafIncrement, viewPreset.leafUnit) / currentTickSize;

            // Search all levels for the closest msPerPx match
            for (let i = 0; i < index.length; i++) {
                const diff = Math.abs(index[i].msPerPx - currentMsPerPx);

                if (diff < closestDiff) {
                    closestDiff = diff;
                    closestLevel = i;
                }
            }

            return closestLevel;
        }

        // Search only within the current preset's range for better performance
        for (let i = indexRange.startIndex; i <= indexRange.endIndex; i++) {
            const diff = Math.abs(index[i].tickSize - currentTickSize);

            if (diff < closestDiff) {
                closestDiff = diff;
                closestLevel = i;
            }
            else {
                // Since tick sizes are ordered, we can stop when diff starts increasing
                break;
            }
        }

        return closestLevel;
    }

    updateSmoothZoomLevel(value) {
        this.smoothZoom && this.setSmoothZoomLevel(value);
    }

    /**
     * Maximum smooth zoom level (finest resolution).
     *
     * When {@link Scheduler.view.mixin.TimelineZoomable#config-maxZoomLevel} is set to a preset name string,
     * the smooth zoom index is built only up to that preset, so the last index entry is the limit.
     *
     * @member {Number}
     * @readonly
     * @category Zoom
     * @internal
     */
    get maxSmoothZoomLevel() {
        return this.smoothZoomIndex.length - 1;
    }

    /**
     * Minimum smooth zoom level (coarsest resolution).
     *
     * When {@link Scheduler.view.mixin.TimelineZoomable#config-minZoomLevel} is set to a preset name string,
     * the smooth zoom index starts from that preset, so index 0 is the limit.
     *
     * @member {Number}
     * @readonly
     * @category Zoom
     * @internal
     */
    get minSmoothZoomLevel() {
        return 0;
    }

    //endregion

    //region Preset helpers

    /**
     * Gets the effective minimum tick size for a preset.
     * @param {Scheduler.preset.ViewPreset} preset
     * @returns {Number}
     * @private
     */
    getPresetMinTickSize(preset) {
        return (this.isHorizontal ? preset.minTickWidth : preset.minTickHeight) || preset.tickSize || MIN_TICK_SIZE;
    }

    /**
     * Gets the configured tick size for a preset.
     * @param {Scheduler.preset.ViewPreset} preset
     * @returns {Number}
     * @private
     */
    getPresetTickSize(preset) {
        return (this.isHorizontal ? preset.tickWidth : preset.tickHeight) || preset.tickSize;
    }

    /**
     * Gets the effective maximum tick size for a preset.
     * @param {Scheduler.preset.ViewPreset} preset
     * @returns {Number}
     * @private
     */
    getPresetMaxTickSize(preset) {
        return (this.isHorizontal ? preset.maxTickWidth : preset.maxTickHeight) || MAX_TICK_SIZE;
    }

    //endregion

    //region Smooth zoom methods

    /**
     * Sets the smooth zoom level directly.
     * @param {Number} zoomLevel Target smooth zoom level index
     * @param {Date|String} [zoomDate] Date to keep at the zoom position
     * @param {Number} [zoomPosition] Pixel offset to maintain
     * @param {Object} [options] Additional options
     * @category Zoom
     * @internal
     */
    setSmoothZoomLevel(zoomLevel, zoomDate = this.viewportCenterDate, zoomPosition = this.timeAxisViewModel.availableSpace / 2, options = {}) {
        const
            me = this,
            {
                smoothZoomLevel,
                timeAxisViewModel
            }  = me;

        if (typeof zoomDate === 'string') {
            zoomDate = DateHelper.parse(zoomDate);
        }

        if (typeof options?.startDate === 'string') {
            options.startDate = DateHelper.parse(options.startDate);
        }

        if (typeof options?.endDate === 'string') {
            options.endDate = DateHelper.parse(options.endDate);
        }

        if (zoomLevel === smoothZoomLevel || zoomLevel < me.minSmoothZoomLevel || zoomLevel > me.maxSmoothZoomLevel) {
            return;
        }

        if (typeof zoomDate === 'string') {
            zoomDate = DateHelper.parse(zoomDate);
        }

        if (typeof options?.startDate === 'string') {
            options.startDate = DateHelper.parse(options.startDate);
        }

        if (typeof options?.endDate === 'string') {
            options.endDate = DateHelper.parse(options.endDate);
        }

        const
            level     = me.$smoothZoomIndex[zoomLevel],
            // A caller may ask for an exact tick size, through `zoomToLevel({ width })` or by restoring a state that
            // stored one. The chain's levels are quantized, so apply the requested size rather than the level's,
            // which is what legacy zooming does too
            tickSize  = options.width ?? level.tickSize,
            zoomingIn = zoomLevel > smoothZoomLevel;

        if (zoomingIn) {
            if (level.preset !== me.viewPreset) {
                const
                    // Position of the zoom date. For wheel zooming it is the date under the pointer, zoomToSpan passes
                    // the center of the span, which may be far from the viewport
                    zoomDatePosition = timeAxisViewModel.getPositionFromDate(zoomDate),
                    // Normalized position of the zoom date (0 = start, 1 = end), the time axis is limited around it
                    pointerFraction  = (zoomDatePosition >= 0 ? zoomDatePosition : zoomPosition + me.timelineScroller.position) / timeAxisViewModel.totalSize,
                    // An explicit zoom span (both dates supplied) defines the axis directly, as in the zoom-out branch
                    // below; otherwise just cap the tick count around the pointer.
                    presetOptions    = options.startDate && options.endDate ? { startDate : options.startDate, endDate : options.endDate } : me.limitTimeAxisForZoomIn(level.preset, pointerFraction);

                // With infiniteScroll the time axis is rebuilt around the center date, which must be the zoom date
                me.switchToPreset(level.preset, tickSize, { ...presetOptions, centerDate : zoomDate });
            }
            else {
                timeAxisViewModel.tickSize = tickSize;
            }
        }
        else if (level.preset !== me.viewPreset) {
            const optimalOptions = me.calculateOptimalDateRange(zoomDate, timeAxisViewModel.availableSpace, level.preset, tickSize, 1);
            // Don't shrink the range, only allow it to grow
            optimalOptions.startDate = options?.startDate ?? DateHelper.min(me.startDate, optimalOptions.startDate);
            optimalOptions.endDate = options?.endDate ?? DateHelper.max(me.endDate, optimalOptions.endDate);

            me.switchToPreset(level.preset, tickSize, { ...optimalOptions, centerDate : zoomDate });
        }
        else {
            me.shrinkTickSize(tickSize, zoomDate, options);
        }

        me.scrollSmoothZoomTo(zoomDate, zoomPosition, options);

        /**
         * Fires when the smooth zoom level changes, either through programmatic zoom methods or mouse wheel zooming.
         *
         * Only applies when using {@link #config-smoothZoom}.
         *
         * @event zoomLevelChange
         * @param {Scheduler.view.TimelineBase} source
         * @param {Number} zoomLevel New zoom level
         */
        me.trigger('zoomLevelChange', { zoomLevel });
    }

    /**
     * Scrolls the timeline so the passed date sits at the passed pixel position, without changing the zoom level.
     * Used both while smooth zooming and when re-centering the view on a span whose target zoom level matches the
     * current one.
     * @param {Date} zoomDate Date to position
     * @param {Number} [zoomPosition] Pixel offset from the view start to place the date at
     * @category Zoom
     * @internal
     */
    scrollSmoothZoomTo(zoomDate = this.viewportCenterDate, zoomPosition = this.timeAxisViewModel.availableSpace / 2, options) {
        // Maintain the date under the zoomPosition at the same screen position
        this.applyScrollPosition(options?.scroll ?? this.timeAxisViewModel.getPositionFromDate(zoomDate) - zoomPosition);
    }

    /**
     * Scrolls the timeline to an exact pixel position.
     * @param {Number} targetPosition Pixel offset from the view start to scroll to
     * @category Zoom
     * @internal
     */
    applyScrollPosition(targetPosition) {
        const
            me                   = this,
            { timelineScroller } = me;

        if (targetPosition !== timelineScroller.position) {
            timelineScroller.position = targetPosition;
        }

        // In RTL mode, changes to the column width (in onViewModelUpdate) can cause the fake scroller's position to be
        // clamped by the browser. The fake scroller's native scroll event fires asynchronously and would override our
        // position via partner sync. By syncing partners immediately, the fake scroller receives our intended position,
        // preventing the async event from reverting to the clamped value.
        me.timeAxisSubGrid.scrollable.syncPartners(true);

        // Need to force partners and ourselves to be in sync when partnered
        if (me.partneredWith) {
            // Force partners to update in sync
            me.partneredWith.forEach(partner =>
                partner.isHorizontal && partner.currentOrientation.updateFromHorizontalScroll(partner.timeAxisSubGrid.scrollable.x, true)
            );

            // Force ourselves, otherwise might race with partner
            if (me.isHorizontal && !me._wheelZoomingBars) {
                me.currentOrientation.updateFromHorizontalScroll(me.timeAxisSubGrid.scrollable.x, true);
            }
        }
    }

    /**
     * Animates a pure scroll (no zoom level change) so the passed date settles at the passed pixel position.
     * @param {Date} zoomDate Date to settle at `zoomPosition`
     * @param {Number} zoomPosition Pixel offset from the view start to place the date at
     * @param {Number} [steps=10] Number of animation steps
     * @returns {Promise} Resolves when the animation completes, or `null` if cancelled
     * @category Zoom
     * @internal
     */
    async animateSmoothScroll(zoomDate, zoomPosition, steps = SMOOTH_ZOOM_ANIMATION_STEPS) {
        const
            me             = this,
            startPosition  = me.timelineScroller.position,
            targetPosition = me.timeAxisViewModel.getPositionFromDate(zoomDate) - zoomPosition,
            distance       = targetPosition - startPosition;

        if (!distance) {
            me.cancelSmoothZoomAnimation();
            return me.smoothZoomLevel;
        }

        const useSteps = Math.min(steps, Math.max(1, Math.round(Math.abs(distance))));

        // Each step scrolls via the instant path, which keeps partnered timelines in sync frame-by-frame
        return me.runSmoothZoomAnimation(useSteps, progress => me.applyScrollPosition(startPosition + distance * progress));
    }

    /**
     * Runs a stepped smooth-zoom animation: invokes `stepFn` `steps` times, pausing a fixed delay between steps, and
     * owns the shared `$smoothZoomAnimationId` lifecycle so a newer animation (or an explicit
     * {@link #function-cancelSmoothZoomAnimation cancel}) supersedes this one.
     * @param {Number} steps Number of steps to run
     * @param {Function} stepFn Called once per step with `(progress, step, steps)`
     * @param {Boolean} [isZoom] `true` when the steps change the zoom level, rather than only scrolling. Such an
     * animation is a continuous zoom gesture, which ends with the animation
     * @returns {Promise} Resolves to the resulting {@link #property-smoothZoomLevel}, or `null` if superseded/cancelled
     * @category Zoom
     * @internal
     */
    async runSmoothZoomAnimation(steps, stepFn, isZoom = false) {
        const
            me          = this,
            // Cancel any existing animation and start a new one
            animationId = me.$smoothZoomAnimationId = {};

        for (let step = 1; step <= steps; step++) {
            // Bail if a newer animation (or a cancel) superseded us
            if (me.$smoothZoomAnimationId !== animationId) {
                return null;
            }

            // A zooming animation is a continuous gesture too, so reuse the event layout across its steps. Scheduler
            // only, see SchedulerZoomable
            if (isZoom) {
                me.startLayoutReuse?.();
            }

            stepFn(step / steps, step, steps);
            await AsyncHelper.sleep(SMOOTH_ZOOM_ANIMATION_DELAY);
        }

        if (me.$smoothZoomAnimationId === animationId) {
            me.$smoothZoomAnimationId = null;

            // Unlike for wheel and slider input, the end of the gesture is known. End it now rather than after the
            // buffer, so the view is fully rendered when the returned promise resolves
            if (isZoom) {
                me.endLayoutReuse?.now();
            }
        }

        return me.smoothZoomLevel;
    }

    /**
     * Internal method to zoom in using the smooth zoom system.
     * @param {Number} levels Number of preset levels to zoom in
     * @param {Object} options Options
     * @param {Date} [options.centerDate] Date to keep centered during zoom
     * @param {Date} [options.date] Alias for centerDate
     * @param {Number} [options.position] Pixel position to maintain during zoom
     * @param {Boolean} [options.animate] Whether to animate the zoom
     * @param {Number} [options.steps=10] Number of animation steps when animate is true
     * @returns {Number|null|Promise}
     * @private
     */
    smoothZoomIn(levels, options = {}) {
        const
            me                  = this,
            { smoothZoomLevel } = me;

        if (smoothZoomLevel >= me.maxSmoothZoomLevel) {
            return null;
        }

        const
            wholeSteps = Math.floor(levels),
            fraction   = levels - wholeSteps;

        // Find the target smooth zoom level by stepping through whole preset steps first
        let targetLevel = wholeSteps > 0
            ? me.findSmoothZoomTargetForPresetSteps(smoothZoomLevel, wholeSteps, true)
            : smoothZoomLevel;

        // Handle fractional levels - snap to a grid defined by the fraction within the current preset range,
        // then step one grid increment forward.
        // Eg at level 130 in a preset spanning 100-200, zooming in 0.25: grid = 100,125,150,175,200 ->
        // nearest grid to 130 is 125, step forward to 150
        if (fraction > 0 && targetLevel !== null) {
            targetLevel = me.findFractionalSmoothZoomTarget(targetLevel, fraction, true);
        }

        if (targetLevel === smoothZoomLevel) {
            return null;
        }

        // On last preset, enlarge it to max tick size
        if (targetLevel === null) {
            targetLevel = me.maxSmoothZoomLevel;
        }

        const
            centerDate = options.centerDate || options.date || me.viewportCenterDate,
            position   = options.position ?? me.timeAxisViewModel.availableSpace / 2,
            steps      = options.steps ?? SMOOTH_ZOOM_ANIMATION_STEPS;

        if (options.animate) {
            return me.animateToSmoothZoomLevel(targetLevel, centerDate, position, steps);
        }

        me.setSmoothZoomLevel(targetLevel, centerDate, position);
        return me.smoothZoomLevel;
    }

    /**
     * Internal method to zoom out using the smooth zoom system.
     * @param {Number} levels Number of preset levels to zoom out
     * @param {Object} options Options
     * @param {Date} [options.centerDate] Date to keep centered during zoom
     * @param {Date} [options.date] Alias for centerDate
     * @param {Number} [options.position] Pixel position to maintain during zoom
     * @param {Boolean} [options.animate] Whether to animate the zoom
     * @param {Number} [options.steps=10] Number of animation steps when animate is true
     * @returns {Number|null|Promise}
     * @private
     */
    smoothZoomOut(levels, options = {}) {
        const
            me                  = this,
            { smoothZoomLevel } = me;

        if (smoothZoomLevel <= me.minSmoothZoomLevel) {
            return null;
        }

        const
            wholeSteps = Math.floor(levels),
            fraction   = levels - wholeSteps;

        // Find the target smooth zoom level by stepping through whole preset steps first
        let targetLevel = wholeSteps > 0
            ? me.findSmoothZoomTargetForPresetSteps(smoothZoomLevel, wholeSteps, false)
            : smoothZoomLevel;

        // Handle fractional levels - snap to a grid defined by the fraction within the current preset range, then step
        // one grid increment backward.
        // Eg at level 130 in a preset spanning 100-200, zooming out 0.25: grid = 100,125,150,175,200 ->
        // nearest grid to 130 is 125, step backward to 100
        if (fraction > 0 && targetLevel !== null) {
            targetLevel = me.findFractionalSmoothZoomTarget(targetLevel, fraction, false);
        }

        if (targetLevel === smoothZoomLevel) {
            return null;
        }

        // On last preset, shrink it to min tick size
        if (targetLevel === null) {
            targetLevel = me.minSmoothZoomLevel;
        }

        const
            centerDate = options.centerDate || options.date || me.viewportCenterDate,
            position   = options.position ?? me.timeAxisViewModel.availableSpace / 2,
            steps      = options.steps ?? SMOOTH_ZOOM_ANIMATION_STEPS;

        if (options.animate) {
            return me.animateToSmoothZoomLevel(targetLevel, centerDate, position, steps);
        }

        me.setSmoothZoomLevel(targetLevel, centerDate, position);
        return me.smoothZoomLevel;
    }

    /**
     * Internal method to zoom in to maximum level using the smooth zoom system.
     * @param {Object} options Options
     * @param {Date} [options.centerDate] Date to keep centered during zoom
     * @param {Boolean} [options.animate] Whether to animate the zoom
     * @param {Number} [options.steps=10] Number of animation steps when animate is true
     * @returns {Number|null|Promise}
     * @private
     */
    smoothZoomInFull(options = {}) {
        const
            me                  = this,
            { smoothZoomLevel } = me,
            targetLevel         = me.maxSmoothZoomLevel,
            centerDate          = options.centerDate || me.viewportCenterDate,
            position            = me.timeAxisViewModel.availableSpace / 2;

        if (smoothZoomLevel === targetLevel) {
            return null;
        }

        if (options.animate) {
            return me.animateToSmoothZoomLevel(targetLevel, centerDate, position, options.steps);
        }

        me.setSmoothZoomLevel(targetLevel, centerDate, position);
        return me.smoothZoomLevel;
    }

    /**
     * Internal method to zoom out to minimum level using the smooth zoom system.
     * @param {Object} options Options
     * @param {Date} [options.centerDate] Date to keep centered during zoom
     * @param {Boolean} [options.animate] Whether to animate the zoom
     * @param {Number} [options.steps=10] Number of animation steps when animate is true
     * @returns {Number|null|Promise}
     * @private
     */
    smoothZoomOutFull(options = {}) {
        const
            me                  = this,
            { smoothZoomLevel } = me,
            targetLevel         = me.minSmoothZoomLevel,
            centerDate          = options.centerDate || me.viewportCenterDate,
            position            = me.timeAxisViewModel.availableSpace / 2;

        if (smoothZoomLevel === targetLevel) {
            return null;
        }

        if (options.animate) {
            return me.animateToSmoothZoomLevel(targetLevel, centerDate, position, options.steps);
        }

        me.setSmoothZoomLevel(targetLevel, centerDate, position);
        return me.smoothZoomLevel;
    }

    /**
     * Internal method to zoom to a specific preset level using the smooth zoom system.
     * Resolves the preset, finds the corresponding smooth zoom level closest to the preset's
     * preferred tick size, and applies it.
     * @param {Number|String|Scheduler.preset.ViewPreset} preset Preset index in the presets array or preset instance or
     * id/name
     * @param {Object} [options] Options
     * @param {Date} [options.centerDate] Date to keep centered during zoom
     * @param {Date} [options.startDate] Time axis start date. When passed together with `endDate`, the span and
     * `centerDate` are applied directly, as non-smooth `zoomToLevel` does, instead of stepping through the smooth
     * zoom chain
     * @param {Date} [options.endDate] Time axis end date, see `startDate`
     * @param {Number} [options.width] Tick size to apply. Defaults to that of the chain level closest to the preset's
     * preferred tick size
     * @param {Boolean} [options.animate] Whether to animate the zoom
     * @param {Number} [options.steps=10] Number of animation steps when animate is true
     * @returns {Number|null|Promise} New smooth zoom level, `null` if unchanged, or `Promise` if animating
     * @private
     */
    smoothZoomToLevel(preset, options = {}) {
        const
            me         = this,
            { presets } = me;

        // Resolve preset from index or name
        let targetPreset;

        if (typeof preset === 'number') {
            targetPreset = presets.getAt(preset);
        }
        else {
            targetPreset = presets.getById(preset);
        }

        if (!targetPreset) {
            return null;
        }

        // Find the smooth zoom index range for this preset
        me.buildSmoothZoomIndex();

        // Find the level closest to the preset's preferred tick size
        const
            presetRange       = me.$smoothZoomPresetMap.get(targetPreset.id),
            preferredTickSize = options.width || me.getPresetTickSize(targetPreset),
            index             = me.$smoothZoomIndex;

        if (!presetRange) {
            // Signal back to zoomToLevel that this preset is not in the smooth zoom chain, so it can fall back to
            // legacy zooming
            return false;
        }

        let targetLevel = presetRange.startIndex,
            closestDiff = Infinity;

        for (let i = presetRange.startIndex; i <= presetRange.endIndex; i++) {
            const diff = Math.abs(index[i].tickSize - preferredTickSize);

            if (diff < closestDiff) {
                closestDiff = diff;
                targetLevel = i;
            }
            else {
                break;
            }
        }

        // An explicit span fully defines the time axis, so apply preset, tick size, dates and centerDate directly, as
        // non-smooth `zoomToLevel` does. `setSmoothZoomLevel` cannot be used for this: it steps the chain, which only
        // ever grows the time axis, and it no-ops when the level is unchanged - as it is when restoring a state that
        // was saved at the current level.
        // if (options.startDate && options.endDate) {
        //     const previousLevel = me.smoothZoomLevel;
        //
        //     me.switchToPreset(targetPreset, options.width || index[targetLevel].tickSize, {
        //         notScroll  : false,
        //         startDate  : new Date(options.startDate),
        //         endDate    : new Date(options.endDate),
        //         // Left undefined so that the preset change derives the span midpoint, the same rule non-smooth
        //         // zoomToLevel applies
        //         centerDate : options.centerDate ? new Date(options.centerDate) : undefined
        //     });
        //
        //     // The level is derived from the resulting tick size, so it is only known after the switch
        //     if (me.smoothZoomLevel !== previousLevel) {
        //         me.trigger('zoomLevelChange', { zoomLevel : me.smoothZoomLevel });
        //     }
        //
        //     return me.smoothZoomLevel;
        // }

        if (targetLevel === me.smoothZoomLevel) {
            // Levels are quantized, so a requested exact width can map to the level the view is already at. Apply it
            // anyway, otherwise restoring a state saved between two levels would silently round its tick size
            if (options.width && me.timeAxisViewModel.tickSize !== options.width) {
                me.timeAxisViewModel.tickSize = options.width;
            }

            return null;
        }

        const
            centerDate = options.centerDate || me.viewportCenterDate,
            position   = me.timeAxisViewModel.availableSpace / 2;

        if (options.animate) {
            return me.animateToSmoothZoomLevel(targetLevel, centerDate, position, options.steps);
        }

        me.setSmoothZoomLevel(targetLevel, centerDate, position, options);
        return me.smoothZoomLevel;
    }

    /**
     * Finds the target smooth zoom level when stepping through a given number of preset levels.
     * @param {Number} currentLevel Current smooth zoom level
     * @param {Number} presetSteps Number of preset levels to step
     * @param {Boolean} zoomIn True to zoom in (finer resolution), false to zoom out
     * @returns {Number} Target smooth zoom level
     * @private
     */
    findSmoothZoomTargetForPresetSteps(currentLevel, presetSteps, zoomIn) {
        const
            me        = this,
            index     = me.$smoothZoomIndex,
            entry     = index[currentLevel],
            direction = zoomIn ? 1 : -1;

        if (!entry) {
            return currentLevel;
        }

        let preset         = entry.preset,
            stepsRemaining = presetSteps,
            targetLevel    = -1,
            closestDiff    = Infinity;

        // Walk the flat smooth zoom index from current position, counting preset transitions
        for (let i = currentLevel + direction, last = index.length; i >= 0 && i < last; i += direction) {
            const levelSettings = index[i];

            if (levelSettings.preset !== preset) {
                // We've left the target preset, done
                if (stepsRemaining === 0) {
                    break;
                }

                preset = levelSettings.preset;

                stepsRemaining--;
            }

            // Reached the target preset, start finding best tick size match
            if (stepsRemaining === 0) {
                const diff = Math.abs(levelSettings.tickSize - me.getPresetTickSize(preset));

                if (diff < closestDiff) {
                    closestDiff = diff;
                    targetLevel = i;
                }
                // Since tick sizes are ordered, we can stop when diff starts increasing
                else {
                    break;
                }
            }
        }

        if (stepsRemaining > 0) {
            return null;
        }

        // Clamp to valid range
        return Math.min(Math.max(targetLevel, me.minSmoothZoomLevel), me.maxSmoothZoomLevel);
    }

    /**
     * Finds the target smooth zoom level for a fractional preset step. Divides the current preset's range into a grid
     * based on the fraction, snaps to the nearest grid line, then steps one grid increment in the zoom direction.
     *
     * For example, at level 130 in a preset spanning 100-200 with fraction 0.25:
     * Grid lines are at 100, 125, 150, 175, 200. Nearest to 130 is 125.
     * Zooming in steps to 150, zooming out steps to 100.
     *
     * @param {Number} currentLevel Current smooth zoom level
     * @param {Number} fraction Fractional part of the levels value (0-1)
     * @param {Boolean} zoomIn True to zoom in, false to zoom out
     * @returns {Number} Target smooth zoom level
     * @private
     */
    findFractionalSmoothZoomTarget(currentLevel, fraction, zoomIn) {
        const
            me        = this,
            index     = me.$smoothZoomIndex,
            entry     = index[currentLevel],
            presetMap = me.$smoothZoomPresetMap;

        if (!entry) {
            return currentLevel;
        }

        const
            range      = presetMap.get(entry.presetName),
            presetSpan = range.endIndex - range.startIndex,
            // Work in fraction-space (0-1) to avoid integer rounding accumulation.
            // This ensures eg 4 steps of 0.25 always reaches the next preset boundary.
            position   = (currentLevel - range.startIndex) / presetSpan,
            // Snap to nearest grid line in fraction-space
            snapped    = Math.round(position / fraction) * fraction,
            // Step one grid increment in the zoom direction
            stepped    = zoomIn ? snapped + fraction : snapped - fraction;

        let targetLevel;

        if (stepped >= 1) {
            // Crossed into next preset - carry the overshoot into it
            const nextEntry = index[range.endIndex + 1];

            if (nextEntry) {
                const
                    nextRange = presetMap.get(nextEntry.presetName),
                    nextSpan  = nextRange.endIndex - nextRange.startIndex;

                targetLevel = nextRange.startIndex + Math.round((stepped - 1) * nextSpan);
            }
            else {
                targetLevel = range.endIndex;
            }
        }
        else if (stepped <= 0) {
            // Crossed into previous preset - carry the overshoot into it
            const prevEntry = index[range.startIndex - 1];

            if (prevEntry) {
                const
                    prevRange = presetMap.get(prevEntry.presetName),
                    prevSpan  = prevRange.endIndex - prevRange.startIndex;

                targetLevel = prevRange.startIndex + Math.round((1 + stepped) * prevSpan);
            }
            else {
                targetLevel = range.startIndex;
            }
        }
        else {
            targetLevel = range.startIndex + Math.round(stepped * presetSpan);
        }

        return Math.min(Math.max(targetLevel, me.minSmoothZoomLevel), me.maxSmoothZoomLevel);
    }

    /**
     * Cancels any in-progress smooth zoom animation.
     * @private
     */
    cancelSmoothZoomAnimation() {
        this.$smoothZoomAnimationId = null;
    }

    /**
     * Animates to a target smooth zoom level over multiple steps.
     * @param {Number} targetLevel Target smooth zoom level
     * @param {Date} zoomDate Date to keep at the zoom position
     * @param {Number} zoomPosition Pixel offset to maintain
     * @param {Number} [steps=10] Number of animation steps
     * @returns {Promise} Resolves when animation completes, or `null` if cancelled
     * @private
     */
    async animateToSmoothZoomLevel(targetLevel, zoomDate, zoomPosition, steps = SMOOTH_ZOOM_ANIMATION_STEPS) {
        const me = this;

        let { smoothZoomLevel } = me;

        if (smoothZoomLevel === -1 || targetLevel === smoothZoomLevel) {
            return;
        }

        const
            totalLevels = Math.abs(targetLevel - smoothZoomLevel),
            useSteps    = Math.min(steps, totalLevels),
            levelStep   = Math.ceil(totalLevels / useSteps),
            direction   = targetLevel > smoothZoomLevel ? 1 : -1;

        return me.runSmoothZoomAnimation(useSteps, (progress, step, total) => {
            // Ensure we never overshoot the target (ceiling-based step size can exceed it,
            // causing a temporary preset change that snaps back on the last step)
            if (step === total) {
                smoothZoomLevel = targetLevel;
            }
            else if (direction === 1) {
                smoothZoomLevel = Math.min(smoothZoomLevel + levelStep, targetLevel);
            }
            else {
                smoothZoomLevel = Math.max(smoothZoomLevel - levelStep, targetLevel);
            }

            me.setSmoothZoomLevel(smoothZoomLevel, zoomDate, zoomPosition);
        }, true);
    }

    /**
     * Zooms to fit the specified time span using the smooth zoom system.
     *
     * @param {Object} config The time frame configuration
     * @param {Date} config.startDate The time frame start
     * @param {Date} config.endDate The time frame end
     * @param {Date} [config.centerDate] Date that should be kept in the center
     * @param {Number} [config.leftMargin=0] Amount of pixels to extend span start on
     * @param {Number} [config.rightMargin=0] Amount of pixels to extend span end on
     * @param {Boolean} [config.animate] Whether to animate the zoom operation
     * @param {Number} [config.steps=10] Number of animation steps when animate is true
     * @returns {Number|null|Promise} Resulting smooth zoom level, `null` if the view could not be zoomed, or a Promise resolving to the level when animating
     * @category Zoom
     * @internal
     */
    async smoothZoomToSpan(config = {}) {
        const
            me             = this,
            availableSpace = me.zoomViewportSize;

        if (availableSpace <= 0) {
            return null;
        }

        const
            index            = me.smoothZoomIndex,
            leftMargin       = config.leftMargin || 0,
            rightMargin      = config.rightMargin || 0,
            startDate        = me.getMinDateOrDate(config.startDate),
            endDate          = me.getMaxDateOrDate(config.endDate),
            diffMS           = endDate - startDate || 1,
            targetCenterDate = config.centerDate || new Date((startDate.getTime() + endDate.getTime()) / 2),
            position         = availableSpace / 2;

        // Find the smooth zoom level where the span fits within the available space
        // We want the highest zoom level (most zoomed in) where the span still fits
        let targetLevel = null;

        for (let i = index.length - 1; i >= 0; i--) {
            const
                entry     = index[i],
                spanWidth = diffMS / entry.msPerPx + leftMargin + rightMargin;

            if (spanWidth <= availableSpace) {
                targetLevel = i;
                break;
            }
        }

        // If no level fits, use the minimum (most zoomed out)
        if (targetLevel === null) {
            targetLevel = me.minSmoothZoomLevel;
        }

        // zoomToFit semantics: when the requested span lies outside the current time axis (e.g. zooming to a task
        // far from the configured startDate), reconfigure the axis to contain it
        if (startDate < me.startDate || endDate > me.endDate) {
            const
                targetEntry  = index[targetLevel],
                optimalRange = me.calculateOptimalDateRange(targetCenterDate, availableSpace, targetEntry.preset, targetEntry.tickSize, 1);

            me.setTimeSpan(
                DateHelper.min(startDate, optimalRange.startDate),
                DateHelper.max(endDate, optimalRange.endDate)
            );
        }

        let { smoothZoomLevel } = me;

        // Already at the target zoom level: setSmoothZoomLevel would no-op, so center the requested span directly.
        // The span may be out of view, so we must still scroll even though the level is unchanged.
        if (targetLevel === smoothZoomLevel) {
            if (config.animate) {
                await me.animateSmoothScroll(targetCenterDate, position, config.steps);
            }
            else {
                me.applyScrollPosition(me.timeAxisViewModel.getPositionFromDate(targetCenterDate) - position);
            }
            return me.smoothZoomLevel;
        }

        if (config.animate) {
            // Animate with gradual scrolling towards the target center date
            const
                steps          = config.steps ?? SMOOTH_ZOOM_ANIMATION_STEPS,
                totalLevels    = Math.abs(targetLevel - smoothZoomLevel),
                useSteps       = Math.min(steps, totalLevels),
                levelStep      = Math.ceil(totalLevels / useSteps),
                direction      = targetLevel > smoothZoomLevel ? 1 : -1,
                startCenterMS  = me.viewportCenterDate.getTime(),
                targetCenterMS = targetCenterDate.getTime();

            const level = await me.runSmoothZoomAnimation(useSteps, (progress, step, total) => {
                // Interpolate center date from current to target
                const interpolatedCenterDate = new Date(startCenterMS + (targetCenterMS - startCenterMS) * progress);

                // Calculate zoom level for this step, never overshooting the target on the final step
                smoothZoomLevel = step === total ? targetLevel : smoothZoomLevel + levelStep * direction;

                me.setSmoothZoomLevel(smoothZoomLevel, interpolatedCenterDate, position);
            }, true);

            // There can be a case such that zoomLevel became equal to targetLevel before the final step.
            // In that case, the scroll position will currently not be correct. So we need to scroll
            // explicitly in such case
            if (level !== null) {
                me.scrollSmoothZoomTo(targetCenterDate, position);
            }

            return level;
        }

        me.setSmoothZoomLevel(targetLevel, targetCenterDate, position);
        return me.smoothZoomLevel;
    }

    //endregion

    //region Smooth zoom helpers

    // Calculate scale factor between old and new preset based on their time units
    getPresetChangeScaleFactor(oldPreset, newPreset) {
        const
            oldMS = DateHelper.asMilliseconds(oldPreset.leafIncrement, oldPreset.leafUnit),
            newMS = DateHelper.asMilliseconds(newPreset.leafIncrement, newPreset.leafUnit);
        return newMS / oldMS;
    }

    /**
     * Switches to a new preset with a specific tick size.
     * @param {Scheduler.preset.ViewPreset} preset Target preset
     * @param {Number} tickSize Tick size to use
     * @param {Object} [options] Additional options
     * @private
     */
    switchToPreset(preset, tickSize, options) {
        preset.options = {
            notScroll : true,
            tickSize,
            ...options
        };

        this.viewPreset = preset;
    }

    /**
     * Limits time axis when zooming in would exceed max tick count.
     * @param {Scheduler.preset.ViewPreset} nextPreset Target preset
     * @param {Number} pointerFraction Normalized pointer position (0-1)
     * @returns {Object|null} Date range options or null
     * @private
     */
    limitTimeAxisForZoomIn(nextPreset, pointerFraction) {
        const
            { timeAxis }  = this,
            newMS         = DateHelper.asMilliseconds(nextPreset.leafIncrement, nextPreset.leafUnit),
            expectedTicks = (timeAxis.endMS - timeAxis.startMS) / newMS;

        // Ensure time axis does not exceed max tick count
        if (expectedTicks > MAX_TICK_COUNT) {
            const
                excessTicks   = expectedTicks - MAX_TICK_COUNT,
                removeAtStart = Math.floor(excessTicks * pointerFraction),
                removeAtEnd   = excessTicks - removeAtStart,
                newStartDate  = DateHelper.add(timeAxis.startDate, removeAtStart * nextPreset.leafIncrement, nextPreset.leafUnit),
                newEndDate    = DateHelper.add(timeAxis.endDate, -removeAtEnd * nextPreset.leafIncrement, nextPreset.leafUnit);

            return {
                startDate : newStartDate,
                endDate   : newEndDate
            };
        }

        return null;
    }

    /**
     * Adjusts tick size while maintaining time span.
     * @param {Number} newTickSize New tick size
     * @param {Date} zoomDate Date to keep centered
     * @param {Object} [options] Additional options
     * @private
     */
    shrinkTickSize(newTickSize, zoomDate, options = {}) {
        const
            me                    = this,
            { timeAxisViewModel } = me,
            span                  = me.calculateOptimalDateRange(zoomDate, timeAxisViewModel.availableSpace, me.viewPreset, newTickSize),
            // Only change the time span if it grows the time axis wider than before
            newStartDate          = options.startDate ?? DateHelper.min(me.startDate, span.startDate),
            newEndDate            = options.endDate ?? DateHelper.max(me.endDate, span.endDate);

        // Flag to avoid updating the UI, will be handled by the tick size change below instead
        me.$skipWheelUpdate = true;
        me.setTimeSpan(newStartDate, newEndDate);
        me.$skipWheelUpdate = false;

        me.$fromWheelUpdate = true;
        me.timeAxisViewModel.tickSize = newTickSize;
        me.$fromWheelUpdate = false;
    }

    /**
     * Keeps a stable zoom date/position during wheel zooming.
     * @param {WheelEvent} event
     * @returns {Object} Object with zoomDate and zoomPosition
     * @private
     */
    updateZoomContext(event) {
        const
            me         = this,
            {
                zoomContext,
                isHorizontal,
                timelineScroller,
                zoomLevel
            }          = me,
            now        = performance.now(),
            coordinate = event[`client${isHorizontal ? 'X' : 'Y'}`];

        let zoomPosition;

        // zoomPosition is the offset from the temporal start edge of the viewport
        // (left edge in LTR, right edge in RTL)
        if (isHorizontal && me.rtl) {
            zoomPosition = timelineScroller.viewport.width + timelineScroller.viewport.x - coordinate;
        }
        else {
            zoomPosition = coordinate - timelineScroller.viewport[`${isHorizontal ? 'x' : 'y'}`];
        }

        // Derive zoomDate from the scroller position + zoomPosition. Both are in the same
        // direction-agnostic coordinate space (always from temporal start), so this avoids the
        // coordinate transformation differences between clientX-based zoomPosition and
        // pageX-based getDateFromDomEvent that can cause drift in RTL mode
        const zoomDate = me.timeAxisViewModel.getDateFromPosition(timelineScroller.position + zoomPosition);

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
                zoomDate
            };
        }
        // Use the current zoomContext's zoomDate, but at each level, the relative position of that date
        // in the TimeAxis has to be corrected as the TimeAxis grows and scrolls to keep the zoomPosition
        // stable.
        else {
            // If we zoom in to a finer resolution, get a more accurate centering date.
            // If gesture was started at a years/months level, the date will be inaccurate.
            if (zoomLevel > zoomContext.zoomLevel) {
                zoomContext.zoomDate = zoomDate;
                zoomContext.zoomLevel = zoomLevel;
            }
            zoomContext.zoomPosition = zoomPosition;
        }

        me.lastWheelTime = now;

        return me.zoomContext;
    }

    /**
     * Handles wheel zoom when smoothZoom is enabled.
     * @param {WheelEvent} event
     * @private
     */
    onSmoothWheel(event) {
        const
            me                  = this,
            {
                zoomDate,
                zoomPosition
            }                   = me.updateZoomContext(event),
            { smoothZoomLevel } = me,
            // Limit delta to avoid large numbers when flicking on touchpads
            deltaY              = Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY), 10),
            delta               = deltaY * me.zoomFactor;

        me.addCls('b-wheel-zooming');

        // A wheel/pinch stream is a continuous gesture, so reuse the event layout until it stops. Scheduler only, see
        // SchedulerZoomable
        me.startLayoutReuse?.();

        // Cancel any in-progress animation
        me.cancelSmoothZoomAnimation();

        // The optimizations for Scheduler does not work in Gantt, and are probably not needed either since Gantt
        // is cheaper to redraw
        me.$wheelZooming = !me.isGanttBase;

        // Round since delta can be fractional when using pinch zoom on touchpads
        me.setSmoothZoomLevel(Math.round(smoothZoomLevel - delta), zoomDate, zoomPosition);

        me.$wheelZooming = false;

        // Internal event used by features to hide tooltips
        me.trigger('smoothWheelZoom');

        me.onSmoothWheelEnd();
    }

    // Buffered fn to remove wheel zooming cls after a short delay
    onSmoothWheelEnd() {
        this.removeCls('b-wheel-zooming');
    }

    //endregion

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
