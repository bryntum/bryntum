import Base from '../../../Core/Base.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import Colors from '../../../Core/util/Colors.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';

DomHelper.loadStylesheet('Scheduler/view/mixin/TimelineEventRendering.css');

// import Stylesheet from './TimelineEventRendering.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TimelineEventRendering');

/**
 * @module Scheduler/view/mixin/TimelineEventRendering
 */

/**
 * Functions to handle event rendering (EventModel -> dom elements). Provides base rendering configuration
 * for event bars, including style, color, layout mode, and content generation.
 *
 * ## See also
 *
 * - {@link Scheduler.view.mixin.SchedulerEventRendering} - Scheduler event rendering
 * - {@link Scheduler.view.TimelineBase} - Timeline base class
 *
 * @mixin
 */
export default Target => class TimelineEventRendering extends (Target || Base) {
    static $name = 'TimelineEventRendering';

    //region Default config

    static configurable = {
        /**
         * When `true`, events are sized and positioned based on rowHeight, resourceMargin and barMargin settings.
         * Set this to `false` to control event height and vertical position yourself using CSS in horizontal mode,
         * or event width and horizontal position yourself (e.g. via the `eventRenderer` setting `renderData.width`)
         * in {@link Scheduler.view.Scheduler#config-mode vertical} mode.
         *
         * Note that events always get an absolute top position, but when this setting is enabled that position
         * will match row's top. To offset within the row using CSS, use `translate : 0 y`.
         *
         * {@note}The two orientations differ in what they leave you to supply. In horizontal mode the event height
         * falls back to CSS, so a stylesheet alone is enough. In vertical mode Core pre-fills `renderData.width`
         * with the column width minus margins before calling the
         * {@link Scheduler.view.mixin.SchedulerEventRendering#config-eventRenderer}, so a renderer that widens
         * events can simply add to it.{/@note}
         *
         * @config {Boolean}
         * @default
         * @category Scheduled events
         */
        managedEventSizing : true,

        /**
         * The CSS class added to an event/assignment when it is newly created
         * in the UI and unsynced with the server.
         * @config {String}
         * @default
         * @private
         * @category CSS
         */
        generatedIdCls : 'b-sch-dirty-new',

        /**
         * The CSS class added to an event when it has unsaved modifications
         * @config {String}
         * @default
         * @private
         * @category CSS
         */
        dirtyCls : 'b-sch-dirty',

        /**
         * The CSS class added to an event when it is currently committing changes
         * @config {String}
         * @default
         * @private
         * @category CSS
         */
        committingCls : 'b-sch-committing',

        /**
         * The CSS class added to an event/assignment when it ends outside of the visible time range.
         * @config {String}
         * @default
         * @private
         * @category CSS
         */
        endsOutsideViewCls : 'b-sch-event-endsoutside',

        /**
         * The CSS class added to an event/assignment when it starts outside of the visible time range.
         * @config {String}
         * @default
         * @private
         * @category CSS
         */
        startsOutsideViewCls : 'b-sch-event-startsoutside',

        /**
         * The CSS class added to an event/assignment when it is not draggable.
         * @config {String}
         * @default
         * @private
         * @category CSS
         */
        fixedEventCls : 'b-sch-event-fixed',

        /**
         * Controls how much space to leave between stacked event bars in px.
         *
         * Value will be constrained by half the row height in horizontal mode.
         *
         * @prp {Number}
         * @default
         * @category Scheduled events
         */
        barMargin : 10,

        /**
         * Minimum height in pixels for event bars when margins are constrained by a small row height.
         *
         * @prp {Number}
         * @default
         * @category Scheduled events
         */
        minEventBarHeight : 8,

        /**
         * Specify `true` to force rendered events/tasks to fill entire ticks. This only affects rendering, start
         * and end dates retain their value on the data level.
         *
         * When enabling `fillTicks`, drag-drop interactions use the same granularity as the bottom time
         * axis "ticks". This means if you are viewing a day schedule, and you move an event starting 8am from Monday to
         * Tuesday, it will still always start at 8am. Enabling {@link Scheduler/view/mixin/TimelineDateMapper#config-snap}
         * might also improve the UX.
         *
         * @prp {Boolean}
         * @default
         * @category Scheduled events
         */
        fillTicks : false,

        resourceMargin : null,

        /**
         * Event color used by default. Events and resources can specify their own color, with priority order being:
         * Event -> Resource -> Scheduler default.
         *
         * Specify `null` to use the current primary color, and allow easier control using custom CSS.
         *
         * For available standard colors, see {@link Core/Base#typedef-Color}.
         *
         * @prp {Color} eventColor
         * @category Scheduled events
         */
        eventColor : null,

        /**
         * Event style used by default. Events and resources can specify their own style, with priority order being:
         * Event -> Resource -> Scheduler default. Determines the appearance of the event by assigning a CSS class
         * to it. Available styles are:
         *
         * * `'tonal'` (default) - flat pale look with text in darker shade of events color
         * * `'filled'` flat look
         * * `'bordered'` - has border in darker shade of events color
         * * `'traced'` - has border in darker shade of events color with a pale fill
         * * `'outlined'` - only border + text until hovered
         * * `'indented'` - has colored text and wide left border in same color
         * * `'rounded'` - minimalistic style with rounded corners
         * * `'line'` - as a line with the text below it
         * * `'dashed'` - as a dashed line with the text below it
         * * `'minimal'` - as a thin line with small text above it
         * * `'gantt'` - The default style used for Gantt task bars
         * * `null` - do not apply a default style and take control using custom CSS (easily overridden basic styling will be used).
         *
         * In addition, there are two styles intended to be used when integrating with Bryntum Calendar. To match
         * the look of Calendar events, you can use:
         *
         * * `'calendar'` - a variation of the "colored" style matching the default style used by Calendar
         * * `'interday'` - a variation of the "plain" style, for interday events
         *
         * @prp {'tonal'|'filled'|'bordered'|'traced'|'outlined'|'indented'|'line'|'dashed'|'minimal'|'rounded'|'calendar'|'interday'|'gantt'|null}
         * @default
         * @category Scheduled events
         */
        eventStyle : 'tonal',

        /**
         * The width/height (depending on vertical / horizontal mode) of all the time columns.
         *
         * There is a limit for the tick size value. Its minimal allowed value is calculated so ticks would fit the
         * available space. Only applicable when {@link Scheduler.view.TimelineBase#config-forceFit} is set to
         * `false`. To set `tickSize` freely skipping that limitation please set
         * {@link Scheduler.view.TimelineBase#config-suppressFit} to `true`.
         *
         * @prp {Number}
         * @category Scheduled events
         */
        tickSize : null
    };

    //endregion

    //region Settings

    updateFillTicks(fillTicks) {
        const me = this;
        if (!me.isConfiguring) {
            const { timeAxis } = me;

            timeAxis.forceFullTicks = fillTicks && me.snap;

            if (fillTicks) {
                me.timeResolution = {
                    unit      : timeAxis.unit,
                    increment : 1
                };
            }

            me.refreshWithTransition();

            me.trigger('stateChange');
        }
    }

    /**
     * Snaps a date to tick boundaries when fillTicks is enabled.
     * Used by both horizontal and vertical rendering to ensure consistent behavior.
     * @param {Date} date The date to snap
     * @param {Boolean} isEnd If true, snap to tick end; if false, snap to tick start
     * @param {Core.data.Model} eventRecord The event record (used to check resize state)
     * @param {String} fieldName The field name ('startDate' or 'endDate')
     * @returns {Date} The snapped date, or the original date if fillTicks is disabled
     * @private
     */
    getTickSnappedDate(date, isEnd, eventRecord, fieldName) {
        const
            me               = this,
            { timeAxis }     = me,
            hasBatchedChange = eventRecord.hasBatchedChange?.(fieldName),
            // fillTicks shouldn't be used during resizing for smooth animation.
            // Correct date will be applied after resize, when `isResizing` will be falsy.
            useTickDates     = me.fillTicks && (!eventRecord.meta?.isResizing || !hasBatchedChange);

        if (useTickDates) {
            let tick = timeAxis.getTickFromDate(date);

            if (tick >= 0) {
                // If date matches a tick start/end exactly, use the earlier tick
                if (isEnd && tick === Math.round(tick) && tick > 0) {
                    tick--;
                }

                const
                    tickIndex  = Math.floor(tick),
                    tickRecord = timeAxis.getAt(tickIndex);

                return tickRecord[fieldName];
            }
        }

        return date;
    }

    changeBarMargin(margin) {
        ObjectHelper.assertNumber(margin, 'barMargin', true);

        // Run changeResourceMargin if its default value is null, to make sure resourceMarginObject is available
        if (this._resourceMargin == null) {
            this.changeResourceMargin(margin);
        }

        // bar margin should not exceed half of the row height
        if (this.isHorizontal && this.rowHeight) {
            return Math.min(Math.ceil(this.rowHeight / 2), margin);
        }

        return margin;
    }

    updateBarMargin() {
        if (this.rendered) {
            this.currentOrientation.onBeforeRowHeightChange();
            this.refreshWithTransition();
            this.trigger('stateChange');
        }
    }

    // Documented in SchedulerEventRendering to not show up in Gantt docs
    get resourceMargin() {
        return this._resourceMargin == null ? this.barMargin : this._resourceMargin;
    }

    constrainResourceMargins(start, end, rowHeight = this.rowHeight) {
        const
            total    = start + end,
            maxTotal = Math.max(rowHeight - this.minEventBarHeight, 0);

        if (this.isHorizontal && rowHeight && total > maxTotal) {
            // If start/end margins are not same, then we increase scale proportionaly
            const scale = maxTotal / total;

            start *= scale;
            end   *= scale;
        }

        return { start, end, total : start + end };
    }

    // Calculates resourceMarginObject from the passed margin, constrained to fit within the row height
    setResourceMarginObject(resourceMargin, rowHeight = this.rowHeight) {
        const
            me                      = this,
            isResourceMarginANumber = typeof resourceMargin === 'number',
            marginStart             = isResourceMarginANumber ? resourceMargin : resourceMargin?.start || 0,
            marginEnd               = isResourceMarginANumber ? resourceMargin : resourceMargin?.end || 0,
            constrainedMargin       = me.constrainResourceMargins(marginStart, marginEnd, rowHeight);

        if (isResourceMarginANumber) {
            me.resourceMarginObject = constrainedMargin;
        }
        else {
            me.resourceMarginObject = ObjectHelper.assign({}, resourceMargin, constrainedMargin);
        }
    }

    // The second argument passed to changers is the old value, so the row height is not accepted here
    changeResourceMargin(margin) {
        const resourceMargin = margin ?? this.resourceMargin;

        this.setResourceMarginObject(resourceMargin);

        return resourceMargin;
    }

    updateResourceMargin() {
        const me = this;

        if (me.rendered) {
            me.currentOrientation.onBeforeRowHeightChange();
            me.refreshWithTransition();
        }
    }

    updateRowHeight(rowHeight, oldRowHeight) {
        if (this.resourceMarginObject) {
            this.setResourceMarginObject(this.resourceMargin, rowHeight);
        }

        super.updateRowHeight(rowHeight, oldRowHeight);
    }

    changeTickSize(width) {
        ObjectHelper.assertNumber(width, 'tickSize', true);

        return width;
    }

    updateTickSize(width) {
        const
            me                    = this,
            { timeAxisViewModel } = me;

        let
            timelineScroller = null,
            scrollAdjustment = 0,
            scrollTarget     = 0;

        if (!me.isConfiguring && me.isHorizontal && !me.$wheelZooming) {
            timelineScroller = me.timelineScroller;

            const
                { position }     = timelineScroller,
                pxScrollToCenter = timelineScroller.viewport.width / 2 + position,
                centerDate       = me.getDateFromCoordinate(pxScrollToCenter);

            if (centerDate) {
                const centerTick = me.timeAxis.getTickFromDate(centerDate);
                scrollAdjustment = centerTick * (width - timeAxisViewModel.tickSize);
                // Absolute target based on the position before the tick size is applied. Shrinking the tick
                // size shrinks the scroll range, which may clamp the current position before we get to scroll,
                // making a relative scroll land wrong (and with infiniteScroll trigger a spurious span shift)
                scrollTarget     = position + scrollAdjustment;
            }
        }

        timeAxisViewModel.tickSize = width;

        if (scrollAdjustment) {
            timelineScroller.scrollTo(scrollTarget);
        }

        /**
         * Fired when the tick size changes.
         *
         * ```javascript
         * listeners : {
         *     tickSizeChange({ source, tickSize }) {
         *         ....
         *     },
         * }
         * ```
         * @event tickSizeChange
         * @param {Scheduler.view.Scheduler} source This Scheduler instance.
         * @param {Number} tickSize The tick size in pixels
         */
        me.trigger('tickSizeChange', { tickSize : width });
    }

    get tickSize() {
        return this.timeAxisViewModel.tickSize;
    }

    /**
     * Predefined event colors, useful in combos etc.
     * @type {String[]}
     * @category Scheduled events
     */
    static get eventColors() {
        // The predefined colors available by default for Scheduler and Gantt, from the single source of truth
        // in Core/util/Colors.js
        return Colors.names;
    }

    /**
     * Predefined event styles , useful in combos etc.
     * @type {String[]}
     * @category Scheduled events
     */
    static get eventStyles() {
        return ['tonal', 'filled', 'bordered', 'outlined', 'traced', 'indented', 'line', 'dashed', 'minimal', 'rounded'];
    }

    updateEventStyle(style) {
        if (!this.isConfiguring) {
            this.refreshWithTransition();
            this.trigger('stateChange');
        }
    }

    updateEventColor(color) {
        if (!this.isConfiguring) {
            this.refreshWithTransition();
            this.trigger('stateChange');
        }
    }

    //endregion

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {
    }
};
