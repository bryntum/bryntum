import SchedulerFeature from './SchedulerFeature.js';
import Tooltip from '../../Core/widget/Tooltip.js';
import ClockTemplate from '../tooltip/ClockTemplate.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';

DomHelper.loadStylesheet('Scheduler/feature/ScheduleTooltip.css');

// import Stylesheet from './ScheduleTooltip.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ScheduleTooltip');
/**
 * @module Scheduler/feature/ScheduleTooltip
 */

/**
 * Feature that displays a tooltip containing the time at the mouse position when hovering empty parts of the schedule.
 *
 * {@inlineexample Scheduler/feature/ScheduleTooltip.js}
 *
 * To hide the schedule tooltip, just disable this feature:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleTooltip : false
 *     }
 * });
 * ```
 *
 * You can also output a message along with the default time indicator (to indicate resource availability etc)
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *    features : {
 *       scheduleTooltip : {
 *           getText(date, event, resource) {
 *               return 'Hovering ' + resource.name;
 *           }
 *       }
 *   }
 * });
 * ```
 *
 * To take full control over the markup shown in the tooltip you can override the {@link #function-generateTipContent} method:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleTooltip : {
 *             generateTipContent({ date, event, resourceRecord }) {
 *                 return `
 *                     <dl>
 *                         <dt>Date</dt><dd>${date}</dd>
 *                         <dt>Resource</dt><dd>${resourceRecord.name}</dd>
 *                     </dl>
 *                 `;
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Configuration properties from the feature are passed down into the resulting {@link Core.widget.Tooltip} instance.
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleTooltip : {
 *             // Don't show the tip until the mouse has been over the schedule for three seconds
 *             hoverDelay : 3000
 *         }
 *     }
 * });
 * ```
 *
 * This feature is **enabled** by default in `Scheduler` and **disabled** in `ResourceUtilization`.
 * For info on enabling it, see {@link Grid/view/mixin/GridFeatures}.
 *
 * ## See also
 *
 * - {@link Scheduler.feature.EventTooltip} - Event tooltips
 * - {@link Scheduler.tooltip.ClockTemplate} - Clock template for tooltips
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 *
 * @demo Scheduler/basic
 * @extends Scheduler/feature/SchedulerFeature
 * @classtype scheduleTooltip
 * @feature
 * @tier community
 */
export default class ScheduleTooltip extends SchedulerFeature {
    //region Config

    static $name = 'ScheduleTooltip';

    static tier = 'community';

    static type = 'scheduleTooltip';

    static defaultEnabled = true;
    static configurable = {
        messageTemplate : data => `<div class="b-sch-hover-tip-msg">${data.message}</div>`,

        /**
         * Set to `true` to hide this tooltip when hovering non-working time. Defaults to `false`, or `true`
         * on the Enterprise tier
         * @config {Boolean}
         */
        hideForNonWorkingTime : null
    };

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            after : ['onInternalPaint']
        };
    }

    //endregion

    //region Init

    /**
     * Set up drag and drop and hover tooltip.
     * @private
     */
    onInternalPaint({ firstPaint }) {
        if (!firstPaint) {
            return;
        }

        const
            me         = this,
            { client } = me;

        if (client.isEnterpriseTier && me.hideForNonWorkingTime === undefined) {
            me.hideForNonWorkingTime = true;
        }

        let reshowListener;

        const tip = me.hoverTip = new Tooltip({
            id                       : `${client.id}-schedule-tip`,
            cls                      : 'b-sch-schedule-tip',
            allowOver                : true,
            hoverDelay               : 0,
            hideDelay                : 100,
            showOnHover              : true,
            forElement               : client.timeAxisSubGridElement,
            anchorToTarget           : false,
            trackMouse               : true,
            updateContentOnMouseMove : true,
            applyMinWidth            : true,
            // disable text content and monitor resize for tooltip, otherwise it doesn't
            // get sized properly on first appearance
            monitorResize            : false,
            textContent              : false,
            rendition                : 'plain',
            forSelector              : '.b-scheduler-base:not(.b-dragging-event,.b-drag-creating,.b-creating-dependency,.b-resizing-event,.b-wheel-zooming) .b-grid-body-container:not(.b-scrolling) .b-timeline-sub-grid:not(.b-scrolling) > :not(.b-sch-foreground-canvas,.b-group-footer,.b-group-row) *:not(.b-scroll-button-wrap *,.b-sch-dependency,.b-sch-resource-time-range,.b-sch-resource-time-range *)',
            // Do not constrain at all, want it to be able to go outside of the viewport to not get in the way
            getHtml                  : me.getHoverTipHtml.bind(me),
            onDocumentMouseDown(event) {
                // Click on the scheduler hides until the very next
                // non-button-pressed mouse move!
                if (tip.forElement.contains(event.domEvent.target)) {
                    reshowListener = EventHelper.on({
                        thisObj   : me,
                        element   : client.timeAxisSubGridElement,
                        mousemove : e => tip.internalOnPointerOver(e),
                        capture   : true
                    });
                }

                const hideAnimation = tip.hideAnimation;
                tip.hideAnimation = false;
                tip.constructor.prototype.onDocumentMouseDown.call(tip, event);
                tip.hideAnimation = hideAnimation;
            },
            // on Core/mixin/Events constructor, me.config.listeners is deleted and attributed its value to me.configuredListeners
            // to then on processConfiguredListeners it set me.listeners to our TooltipBase
            // but since we need our initial config.listeners to set to our internal tooltip, we leave processConfiguredListeners empty
            // to avoid lost our listeners to apply for our internal tooltip here and force our feature has all Tooltip events firing
            ...me.config,
            internalListeners : me.configuredListeners
        });

        // We have to add our own listener after instantiation because it may conflict with a configured listener
        tip.ion({
            pointerOver({ event }) {
                const buttonsPressed = 'buttons' in event ? event.buttons > 0
                    : event.which > 0; // fallback for Safari which doesn't support 'buttons'

                // This is the non-button-pressed mousemove
                // after the document mousedown
                if (!buttonsPressed && reshowListener) {
                    reshowListener();
                }

                // Never any tooltip while interaction is ongoing and a mouse button is pressed
                if (me.disabled || buttonsPressed) {
                    tip.hide();
                    return false;
                }
            },
            innerHtmlUpdate({ source }) {
                me.clockTemplate.updateDateIndicator(source.element, me.lastTime);
            }
        });

        // Update tooltip after zooming
        client.ion({
            timeAxisViewModelUpdate : () => {
                // Updating tip content interferes with zoom scroll, don't update during zooming
                // realign leads to elementFromPoint, which forces the browser to scroll
                if (!client.$wheelZooming) {
                    me.updateTip();
                }
            },
            smoothWheelZoom : () => {
                me.hoverTip.hide();
            },
            thisObj : me
        });

        me.clockTemplate = new ClockTemplate({
            scheduler : client
        });
    }

    // leave configuredListeners alone until render time at which they are used on the tooltip
    processConfiguredListeners() {}

    updateTip() {
        if (this.hoverTip.isVisible) {
            this.hoverTip.updateContent();
        }
    }

    doDestroy() {
        this.destroyProperties('clockTemplate', 'hoverTip');
        super.doDestroy();
    }

    //endregion

    //region Contents

    /**
     * @deprecated Use {@link #function-generateTipContent} instead.
     * Gets html to display in hover tooltip (tooltip displayed on empty parts of scheduler)
     * @private
     */
    getHoverTipHtml({ tip, event }) {
        const
            me        = this,
            scheduler = me.client,
            date      = event && scheduler.getDateFromDomEvent(event, 'floor', true);

        let html      = me.lastHtml;

        // event.target might be null in the case of being hosted in a web component https://github.com/bryntum/bryntum-suite/pull/4488
        if (date && event.target) {
            const resourceRecord = scheduler.resolveResourceRecord(event);

            // resourceRecord might be null if user hover over the tooltip, but we shouldn't hide the tooltip in this case
            if ((resourceRecord && (date - me.lastTime !== 0 || resourceRecord.id !== me.lastResourceId))) {
                if (me.hideForNonWorkingTime) {
                    const isWorkingTime = resourceRecord.isWorkingTime(date);

                    tip.toggleCls('b-nonworking-time', !isWorkingTime);
                }

                me.lastResourceId = resourceRecord.id;
                html              = me.lastHtml = me.generateTipContent({ date, event, resourceRecord });
            }
        }
        else {
            tip.hide();
            me.lastTime = null;
            me.lastResourceId = null;
        }

        return html;
    }

    /**
     * Called as mouse pointer is moved over a new resource or time block. You can override this to show
     * custom HTML in the tooltip.
     * @param {Object} context
     * @param {Date} context.date The date of the hovered point
     * @param {Event} context.event The DOM event that triggered this tooltip to show
     * @param {Scheduler.model.ResourceModel} context.resourceRecord The resource record
     * @returns {String} The HTML contents to show in the tooltip (an empty return value will hide the tooltip)
     */
    generateTipContent({ date, event, resourceRecord }) {
        const
            me          = this,
            text        = me.getText(date, event, resourceRecord),
            clockHtml   = me.clockTemplate.template({
                date,
                text : me.client.getFormattedDate(date)
            }),
            messageHtml = text ? me.messageTemplate({
                message : text
            }) : '';

        me.lastTime = date;

        return clockHtml + messageHtml;
    }

    /**
     * Override this to render custom text to default hover tip
     * @param {Date} date
     * @param {Event} event Browser event
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource record
     * @returns {String}
     */
    getText(date, event, resourceRecord) {}

    //endregion
}

// <remove-on-release>
// TODO: Refactor SASS so that auto-generated class name of 'b-' + cls.name.toLowerCase() can be used.
// </remove-on-release>
ScheduleTooltip.featureClass = 'b-schedule-tip';

ScheduleTooltip.initClass();
