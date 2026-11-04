import Base from '../../../Core/Base.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import DomSync from '../../../Core/helper/DomSync.js';

/**
 * @module Scheduler/view/orientation/ZoomSnapshotRendering
 */

/**
 * Mixin for the orientations, zooming a snapshot of the rendered bars during a continuous zoom gesture with
 * {@link Scheduler.view.mixin.SchedulerZoomable#config-liveZoom} off.
 *
 * When the gesture starts, the bars DomSync rendered are snapshotted. On each step of the gesture they are moved and
 * resized along the time axis by writing their styles directly, bypassing the layout and DomSync. No new bars are
 * rendered, bars leaving the view are hidden, and a placeholder bar indicates the events not rendered on either side
 * of the view for each resource. The full render when the gesture ends puts everything right.
 *
 * The orientation provides:
 * * `getSnapshotTimeSpan(elementData)` - `{ startMS, endMS }` of a rendered bar on the time axis
 * * `snapshotResources` - the resources rendered when the gesture starts
 * * `snapshotDateRange` - `{ startMS, endMS }` of the dates rendered when the gesture starts
 * * `snapshotViewport` - `{ start, end, buffer, zeroSizeBuffer, positionStyle, sizeStyle }`, the pixel range along
 *   the time axis to keep bars rendered in and the style properties to write
 *
 * @mixin
 * @private
 */
export default Target => class ZoomSnapshotRendering extends (Target || Base) {
    static $name = 'ZoomSnapshotRendering';

    static get properties() {
        return {
            // Map of element -> { startMS, endMS } for the bars rendered when a zoom gesture started (liveZoom off)
            frozenElements     : null,
            // Map of resource id -> { start, end } date spans (ms) of the events not rendered on either side of the
            // view when a zoom gesture started (liveZoom off)
            hiddenSpans        : null,
            // Map of row or resource -> DOM configs for the placeholders indicating those events
            placeholderConfigs : new Map()
        };
    }

    /**
     * Snapshots the bars rendered by the last render pass. For the rest of the zoom gesture, only those are drawn,
     * scaled to the time axis as it changes, see SchedulerZoomable#liveZoom.
     *
     * Also notes where the events not rendered are, per rendered resource, so that a placeholder can indicate them on
     * the side of the view they are on.
     * @internal
     */
    captureRenderedLayouts() {
        const
            me                 = this,
            { scheduler }      = me,
            { eventStore }     = scheduler,
            { startMS, endMS } = me.snapshotDateRange,
            { timeAxis }       = scheduler,
            frozenElements     = me.frozenElements = new Map(),
            hiddenSpans        = me.hiddenSpans = new Map(),
            extend             = (span, start, end) => span
                ? { startMS : Math.min(span.startMS, start), endMS : Math.max(span.endMS, end) }
                : { startMS : start, endMS : end };

        // What DomSync synced in the last pass, released elements live in releasedIdMap
        for (const entityName of ['event', ...me.entityNames]) {
            for (const element of Object.values(scheduler.canvases[entityName]?.syncIdMap ?? {})) {
                const
                    elementData = element.lastDomConfig?.elementData,
                    span        = elementData && me.getSnapshotTimeSpan(elementData);

                span && frozenElements.set(element, span);
            }
        }

        for (const resourceRecord of me.snapshotResources) {
            let start, end;

            // Through the resource's assignments, cheaper than querying the store per resource. Recurring events only
            // count by their base event, occurrences are generated per date range
            for (const eventRecord of resourceRecord?.events ?? []) {
                const
                    eventStartMS = eventRecord.startDate?.getTime(),
                    eventEndMS   = eventRecord.endDate?.getTime() ?? eventStartMS;

                // Unscheduled or filtered out events have nothing to indicate
                if (eventStartMS == null || !eventStore.includes(eventRecord)) {
                    continue;
                }

                // Bars touching the rendered range are rendered, but an event with a duration is only laid out when it
                // strictly overlaps the time axis, see TimeAxis#isTimeSpanInAxis(). One ending exactly where the axis
                // starts, or starting exactly where it ends, is not rendered either
                const hasDuration = eventEndMS > eventStartMS;

                if (eventEndMS < startMS || (hasDuration && eventEndMS <= timeAxis.startMS)) {
                    start = extend(start, eventStartMS, eventEndMS);
                }
                else if (eventStartMS > endMS || (hasDuration && eventStartMS >= timeAxis.endMS)) {
                    end = extend(end, eventStartMS, eventEndMS);
                }
            }

            if (start || end) {
                hiddenSpans.set(resourceRecord.id, { start, end });
            }
        }
    }

    /**
     * Moves and resizes the bars snapshotted when a zoom gesture started to the time axis as it now stands, by writing
     * their position and size along the time axis directly to their elements. It bypasses DomSync and the layout, and
     * does as little as possible: the continuous time axis maps linearly, classes are not updated, and bars leaving
     * the view are hidden rather than released. The full render when the gesture ends puts everything right, see
     * {@link #function-releaseRenderedLayouts}.
     * @private
     */
    moveSnapshotElements() {
        const
            me            = this,
            { scheduler } = me,
            { startMS }   = scheduler.timeAxis,
            pxPerMS       = scheduler.timeAxisViewModel.getSingleUnitInPixels('millisecond'),
            {
                start,
                end,
                buffer,
                zeroSizeBuffer,
                positionStyle,
                sizeStyle
            }             = me.snapshotViewport;

        for (const [element, span] of me.frozenElements) {
            const
                position = (span.startMS - startMS) * pxPerMS,
                size     = (span.endMS - span.startMS) * pxPerMS,
                extra    = size === 0 ? zeroSizeBuffer : buffer,
                inView   = position + size >= start - extra && position <= end + extra;

            if (inView === Boolean(element.$zoomCulled)) {
                element.$zoomCulled = !inView;
                element.style.display = inView ? '' : 'none';
            }

            if (inView) {
                element.style[positionStyle] = `${position}px`;
                element.style[sizeStyle] = `${size}px`;
            }
        }
    }

    /**
     * Drops the snapshot taken by {@link #function-captureRenderedLayouts}, when the zoom gesture ends.
     * @internal
     */
    releaseRenderedLayouts() {
        const me = this;

        for (const element of me.frozenElements?.keys() ?? []) {
            if (element.$zoomCulled) {
                element.$zoomCulled = false;
                element.style.display = '';
            }

            // DomSync diffs against the config it synced last rather than the DOM, which the gesture changed behind
            // its back. Same as when it releases an element, this makes it reapply the whole style
            if (element.lastDomConfig) {
                element.lastDomConfig.style = null;
            }
        }

        me.frozenElements = me.hiddenSpans = null;
        me.placeholderConfigs.clear();
    }

    /**
     * Returns DOM configs for the placeholders of a resource, one on each side of the view which has events not
     * rendered during a zoom gesture with liveZoom off. They span those events along the time axis, clipped to the
     * time axis and the view.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource
     * @param {Number} viewStart Start of the view along the time axis
     * @param {Number} viewEnd End of the view along the time axis
     * @param {Number} crossStart Start of the resource across the time axis
     * @param {Number} crossSize Size of the resource across the time axis
     * @returns {DomConfig[]}
     * @private
     */
    getPlaceholderDOMConfigs(resourceRecord, viewStart, viewEnd, crossStart, crossSize) {
        const
            me      = this,
            spans   = me.hiddenSpans.get(resourceRecord.id),
            configs = [];

        if (spans) {
            const
                { scheduler }                = me,
                { startMS, endMS }           = scheduler.timeAxis,
                pxPerMS                      = scheduler.timeAxisViewModel.getSingleUnitInPixels('millisecond'),
                { positionStyle, sizeStyle } = me.snapshotViewport,
                horizontal                   = positionStyle === 'insetInlineStart',
                crossPositionStyle           = horizontal ? 'top' : 'insetInlineStart',
                crossSizeStyle               = horizontal ? 'height' : 'width';

            for (const side of ['start', 'end']) {
                const span = spans[side];

                // In the time axis, strictly for spans with a duration like TimeAxis#isTimeSpanInAxis(). Continuous
                // time axis, so a linear mapping is exact
                if (span && (span.endMS > span.startMS
                    ? span.endMS > startMS && span.startMS < endMS
                    : span.endMS >= startMS && span.startMS <= endMS)) {
                    const
                        p1 = Math.max((Math.max(span.startMS, startMS) - startMS) * pxPerMS, viewStart),
                        p2 = Math.min((Math.min(span.endMS, endMS) - startMS) * pxPerMS, viewEnd);

                    // Keep milestones visible
                    if (p2 >= p1) {
                        configs.push({
                            className     : 'b-placeholder',
                            'aria-hidden' : 'true',
                            dataset       : {
                                syncId : `${resourceRecord.id}-${side}`
                            },
                            style : {
                                [crossPositionStyle] : crossStart,
                                [crossSizeStyle]     : crossSize,
                                [positionStyle]      : p1,
                                [sizeStyle]          : Math.max(p2 - p1, 1)
                            }
                        });
                    }
                }
            }
        }

        return configs;
    }

    // Canvas for the placeholders, behind the events. Created on first use
    get placeholderCanvas() {
        const
            me            = this,
            { scheduler } = me;

        if (!me._placeholderCanvas) {
            me._placeholderCanvas = DomHelper.createElement({
                className     : 'b-sch-canvas b-sch-zoom-placeholder-canvas',
                parent        : scheduler.timeAxisSubGridElement,
                nextSibling   : scheduler.foregroundCanvas,
                retainElement : true
            });

            scheduler.timeAxisSubGrid.addCanvas(me._placeholderCanvas);
        }

        return me._placeholderCanvas;
    }

    /**
     * Syncs the placeholders during a zoom gesture with liveZoom off, or clears them out after it.
     * @param {Function} [isInView] Filter for the rows or resources whose placeholders to include
     * @private
     */
    syncPlaceholders(isInView) {
        const me = this;

        if (me.hiddenSpans || me._placeholderCanvas?.firstChild) {
            const placeholders = [];

            me.placeholderConfigs.forEach((configs, key) => (!isInView || isInView(key)) && placeholders.push(...configs));

            DomSync.sync({
                domConfig : {
                    onlyChildren : true,
                    children     : placeholders
                },
                targetElement    : me.placeholderCanvas,
                syncIdField      : 'syncId',
                releaseThreshold : 0
            });
        }
    }
};
