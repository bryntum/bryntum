import CalendarFeature from './CalendarFeature.js';
import Tooltip from '../../Core/widget/Tooltip.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import Widget from '../../Core/widget/Widget.js';
import GlobalEvents from '../../Core/GlobalEvents.js';
import ClockTemplate from '../../Scheduler/tooltip/ClockTemplate.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import BrowserHelper from '../../Core/helper/BrowserHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';

/**
 * @module Calendar/feature/ScheduleTooltip
 */

const
    isCalendarMixin = w => w.isCalendarMixin,
    emptyArray      = Object.freeze([]);

/**
 * A feature that displays a tooltip containing the time at the mouse position when hovering empty parts of the schedule.
 *
 * By default, in `DayView` and `WeekView`, the time is rounded to the view's {@link Calendar.widget.DayView#config-increment}
 * unless the {@link #config-precise} config is set to `true`.
 *
 * The example below illustrates how to use this feature in a Calendar instance and add a custom renderer to the tooltip.
 * It shows the time at the pointer position, and if the pointer is outside of the core hours.
 *
 * It also validates that any event being created or moved does not extend outside of the core hours:
 *
 * {@inlineexample Calendar/feature/ScheduleTooltip.js}
 *
 * ```javascript
 * const calendar = new Calendar({
 *     features : {
 *         scheduleTooltip : true
 *     }
 * });
 * ```
 *
 * This feature is **disabled** by default.
 *
 * ## Useful configs
 *
 * | Config                          | Description                                               |
 * |---------------------------------|-----------------------------------------------------------|
 * | {@link #config-renderer}        | Custom content renderer for the tooltip                   |
 * | {@link #config-precise}         | Show precise time instead of snapped to increment         |
 * | {@link #config-showOnEvents}    | Also show tooltip when hovering events                    |
 * | {@link #config-showScheduleTip} | Filter which views show the tooltip                       |
 * | {@link #config-anchorToDayCell} | Anchor tooltip to the day cell instead of following mouse |
 *
 * ## See also
 *
 * - {@link Calendar.feature.EventTooltip} — Tooltip for event bars
 * - {@link Calendar.feature.TimeRanges} — Time ranges passed to the tooltip renderer
 * - {@link Calendar.widget.DayView} — The primary view type where this tooltip appears
 *
 * @demo Calendar/tooltips
 *
 * @extends Calendar/feature/CalendarFeature
 * @classtype scheduleTooltip
 * @feature
 * @tier community
 *
 * @class-alias Scheduler.feature.ScheduleTooltip -> Scheduler.feature.SchedulerScheduleTooltip
 */
export default class ScheduleTooltip extends CalendarFeature {
    static $name = 'ScheduleTooltip';
    static tier = 'community';

    static type = 'ScheduleTooltip';

    static configurable = {
        /**
         * A function (or name of a function in the ownership hierarchy) which decides whether to show the ScheduleTooltip
         * depending on the active view. The active view is passed, and if a truthy value is returned, the tip is shown,
         * otherwise it is hidden.
         *
         * *This defaults to only showing for {@link Calendar.widget.DayView}s*
         * @prp {Function} showScheduleTip
         * @param {CalendarView} view The Calendar view that the pointer is over. Return `true` to
         * show the ScheduleTooltip for the passed view.
         * @param {Date} date The date at the pointer position as accurately as can be determined. If the view is a
         * {@link Calendar.widget.DayView}, this date will have hour and minute resolution.
         * @returns {Boolean} Whether to show the ScheduleTooltip.
         * @accepts {Function|String}
         */
        showScheduleTip : null,

        /**
         * Gets the Tooltip instance that this feature is using.
         * @member {Core.widget.Tooltip} tooltip
         * @readonly
         */
        /**
         * This config is used to directly configure the associated {@link Core.widget.Tooltip}.
         * @config {TooltipConfig}
         */
        tooltip : {
            $config : ['lazy', 'nullify'],

            value : {
                type                     : 'tooltip',
                cls                      : 'b-cal-schedule-tooltip',
                allowOver                : true,
                hoverDelay               : 0,
                hideDelay                : 100,
                forSelector              : '*',
                showOnHover              : true,
                anchorToTarget           : false,
                trackMouse               : true,
                updateContentOnMouseMove : true,
                // disable text content and monitor resize for tooltip, otherwise it doesn't
                // get sized properly on first appearance
                monitorResize            : false,
                textContent              : false,
                layoutStyle              : 'white-space:nowrap'
            }
        },

        /**
         * The function or the name of a function to use to create the tooltip content.
         * The function is passed the full context of the pointer position.
         *
         * An implementation may call the {@link #function-defaultRenderer} method to get the default HTML string content.
         * @prp {Function|String} renderer
         * @param {CalendarView} view The Calendar view that the pointer is over.
         * @param {Date} date The date at the pointer position. If the view is a {@link Calendar.widget.DayView}, this date is
         * snapped to the view's {@link Calendar.widget.DayView#config-increment} based on the view's
         * {@link Calendar.widget.DayView#config-timeSnapType} if any.
         * @param {Date} preciseDate The precise date at the pointer position. This may differ from `date` if the view is
         * a {@link Calendar.widget.DayView}. It will be as accurate as can be determined.
         * @param {Scheduler.model.EventModel[]} events The events which coincide with the pointer position.

         * @param {Scheduler.model.ResourceModel} [resource] The resource record if any at the pointer position.
         * @returns {String|DomConfig} The HTML or DOM configuration to display in the tooltip. A falsy return value will hide the tooltip.
         */
        renderer : null,

        /**
         * When in a `DayView`, this config determines whether the tooltip should show the time at the pointer position
         * with a precision of seconds, or rounded to the nearest {@link Calendar.widget.DayView#config-increment}.
         * @prp {Boolean} precise
         * @default false
         */
        precise : false,

        /**
         * Configure whether the tooltip should also show when hovering events.
         *
         * By default, the tooltip only shows when hovering empty parts of the schedule.
         *
         * If you enable this config, the tooltip will also show when hovering events.
         *
         * {@note}This may conflict with the {@link Calendar.feature.EventTooltip} feature if that is configured
         * to show on hover rather than on click.
         *
         * The {@link #property-anchorToDayCell} config will remove this conflict.{/@note}
         * @prp {Boolean} showOnEvents
         * @default false
         */
        showOnEvents : false,

        /**
         * Configure whether the tooltip should anchor to the day cell *when not in a `DayView`.*
         *
         * By default, when not in a `DayView`, the tooltip will follow the mouse pointer.
         *
         * If you enable this config, the tooltip will anchor to the day cell under the pointer instead.
         * @prp {Boolean} anchorToDayCell
         * @default false
         */
        anchorToDayCell : false
    };

    static get pluginConfig() {
        return {
            after : ['render']
        };
    }

    changeTooltip(config, existingInstance) {
        if (config) {
            const
                me         = this,
                { client } = me,
                tip        = Tooltip.reconfigure(existingInstance, ObjectHelper.assign({}, config, {
                    id                : `${client.id}-schedule-tip`,
                    owner             : client,
                    forElement        : client.viewContainer.element,
                    getHtml           : me.getHtml.bind(me),
                    filterTarget      : me.filterTarget.bind(me),
                    rendition         : me.renderer ? 'rich' : 'plain',
                    internalListeners : {
                        innerHtmlUpdate({ source }) {
                            me.clockTemplate.updateDateIndicator(source.element, me.lastTime);
                        }
                    }
                }));

            me.clockTemplate = new ClockTemplate({
                scheduler : client,
                mode      : 'hour'
            });

            return tip;
        }
    }

    filterTarget(domEvent) {
        if (!GlobalEvents.isMouseDown()) {
            const
                { target }          = domEvent,
                { showScheduleTip } = this,
                activeView          = Widget.fromElement(target)?.closest(isCalendarMixin),
                date                = this.client.getDateFromDomEvent(domEvent, true);

            if (activeView && date && (showScheduleTip ? this.callback(this.showScheduleTip, this, [activeView, date]) : activeView.isDayView)) {
                return target.closest('.b-cal-event-wrap') && !this.showOnEvents ? null : (target.closest(`.${activeView.dayCellCls}`) || target);
            }
        }
    }

    getHtml({ tip, event, activeTarget }) {
        const
            me                  = this,
            { showScheduleTip } = me,
            { dateHelper }      = me.client,
            activeView          = Widget.fromElement(activeTarget)?.closest(isCalendarMixin),
            preciseDate         = activeView?.getDateFromDomEvent(event, true);

        if (preciseDate) {
            const
                isMultiResourceView  = activeView.isDayResourceView || activeView.isDayResourceCalendarRow,
                date                 = activeView.timeSnapType ? dateHelper[activeView.timeSnapType](preciseDate, activeView.increment) : preciseDate,
                doShow               = activeView && date && (showScheduleTip ? me.callback(showScheduleTip, me, [activeView, date]) : activeView.isDayView);

            // We cannot track the tooltip if we are also dragging
            if (doShow && !(event.type === 'pointermove' && event.pointerType === 'touch' && Object.values(me.client.features.drag?.zones || {}).some(z => z.dragging))) {
                const
                    cellData   = activeView.cellMap.get(activeView.dayTime.dateKey(preciseDate)),
                    events     = cellData?.events.filter(e => {
                        // cellMap "events" may be EventModel or EventBar objects which have an eventRecord property
                        e = e.eventRecord || e;
                        return dateHelper.betweenLesser(preciseDate, e.startDate, e.endDate);
                    }) || emptyArray,
                    resource   = activeView.getResourceRecord?.(event),
                    timeRanges = (activeView.isDayCellRenderer ? cellData?.timeRanges : cellData?.timeRanges?.filter(r => dateHelper.betweenLesser(preciseDate, r.startDate, r.endDate))) || emptyArray,

                    // Occurrences never join the project, so get no linked resources.
                    // We need to consult the base recurring TimeSpan's resource instead.
                    filterFn   = tr => (tr.isOccurrence ? tr.recurringTimeSpan : tr).resource === resource;

                me.lastTime = me.precise ? preciseDate : date;
                const result = me.callback(me.renderer || me.defaultRenderer, me, [
                    activeView,
                    date,
                    preciseDate,
                    events,
                    isMultiResourceView ? timeRanges.filter(filterFn) : timeRanges,
                    resource
                ]);

                // For DayViews, and when not anchoring to day cell, we want to track mouse
                // This reverts to default behavior of tracking the mouse.
                if (activeView.isDayView || !me.anchorToDayCell) {
                    tip.trackMouse = true;
                    tip.forSelector = '*';
                    tip.anchorToTarget = tip.anchor = false;
                }
                // If anchoring to day cell, configure the tip to do so
                else {
                    tip.trackMouse = false;
                    tip.forSelector = `.${activeView.dayCellCls}`;
                    tip.anchorToTarget = tip.anchor = true;
                }

                return result;
            }
        }
        tip.hide();
    }

    /**
     * The default renderer for the tooltip, which shows the time at the pointer position.
     * If the view is a day view, it will also show the time in the format
     * specified by the `timeFormat` config of the view.
     * @param {CalendarView} view The view that the pointer is over.
     * @param {Date} date The date at the pointer position. If the view is a {@link Calendar.widget.DayView}, this date is
     * snapped to the view's {@link Calendar.widget.DayView#config-increment} based on the view's
     * {@link Calendar.widget.DayView#config-timeSnapType} if any.
     * @param {Date} [preciseDate] The precise date at the pointer position. This may differ from `date` if the view is
     * a {@link Calendar.widget.DayView}. It will be as accurate as can be determined. Only used when
     * {@link #config-precise} is set, so it may be omitted when calling this from a custom
     * {@link #config-renderer}.
     * @param {Scheduler.model.EventModel[]} [events] The events which coincide with the pointer position.

     * @param {Scheduler.model.ResourceModel} [resource] The resource record if any at the pointer position.
     * @returns {String} The HTML to display in the tooltip.
     */
    defaultRenderer(view, date, preciseDate) {
        const
            { isDayView } = view,
            displayDate   = this.precise ? preciseDate : date,
            text          = view.dateHelper.format(displayDate, `${view.dateFormat}${isDayView ? ' ' + (view.timeFormat || 'LST') : ''}`);

        return isDayView ? this.clockTemplate.template({ displayDate, text }) : text;
    }

    onCalendarScroll() {
        const { tooltip } = this;

        // Update tooltip with new over time on scroll
        if (tooltip.isVisible) {
            const
                { triggeredByEvent } = tooltip,
                targetElement        = DomHelper.elementFromPoint(triggeredByEvent.clientX, triggeredByEvent.clientY);

            targetElement?.dispatchEvent(new BrowserHelper.PointerEventConstructor('pointermove', triggeredByEvent));
        }
    }

    render() {
        this.getConfig('tooltip');
        EventHelper.on({
            element : this.client.element,
            scroll  : 'onCalendarScroll',
            thisObj : this,
            capture : true
        });
    }

    //region Internal

    updateDisabled(disabled, was) {
        super.updateDisabled(disabled, was);

        if (this._tooltip) {
            this._tooltip.disabled = disabled;
        }
    }
    //endregion
}

// Register this feature type with its Factory
CalendarFeature.register(ScheduleTooltip.type, ScheduleTooltip, true);
