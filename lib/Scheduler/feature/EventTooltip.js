import TooltipBase from './base/TooltipBase.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import { parseAlign } from '../../Core/helper/util/Rectangle.js';

DomHelper.loadStylesheet('Scheduler/feature/EventTooltip.css');

// import Stylesheet from './EventTooltip.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'EventTooltip');

/**
 * @module Scheduler/feature/EventTooltip
 */

// Alignment offsets to clear any dependency terminals depending on whether
// the tooltip is aligned top/bottom (1) or left/right (2) as parsed from the
// align string by Rectangle's parseAlign
const
    zeroOffset = [0, 0],
    depOffset  = [
        null, [0, 10], [10, 0]
    ];

/**
 * Displays a tooltip when hovering events. The template used to render the tooltip can be customized, see {@link #config-template}.
 * Config options are also applied to the tooltip shown, see {@link Core.widget.Tooltip} for available options.
 *
 * {@inlineexample Scheduler/feature/EventTooltip.js}
 *
 * This feature is **enabled** by default.
 *
 * ## Showing local data
 *
 * To show a basic "local" tooltip (with data available in the Event record) upon hover:
 *
 * ```javascript
 * new Scheduler({
 *   features : {
 *     eventTooltip : {
 *         // Tooltip configs can be used here
 *         align : 'l-r' // Align left to right,
 *         // A custom HTML template
 *         template : ({ eventRecord }) => `<dl>
 *              <dt>Assigned to:</dt>
 *              <dd>
 *                  ${eventRecord.resource.name}
 *              </dd>
 *              <dt>Time:</dt>
 *              <dd>
 *                  ${DateHelper.format(eventRecord.startDate, 'LT')} - ${DateHelper.format(eventRecord.endDate, 'LT')}
 *              </dd>
 *              ${eventRecord.note ? `<dt>Note:</dt><dd>${eventRecord.note}</dd>` : ''}
 *
 *              ${eventRecord.image ? `<dt>Image:</dt><dd><img class="image" src="${eventRecord.image}"/></dd>` : ''}
 *          </dl>`
 *     }
 *   }
 * });
 * ```
 *
 * ## Showing remotely loaded data
 *
 * Loading remote data into the event tooltip is easy. Simply use the {@link #config-template} and return a Promise
 * which yields the content to show.
 *
 * ```javascript
 * new Scheduler({
 *   features : {
 *     eventTooltip : {
 *        template : ({ eventRecord }) => AjaxHelper.get(`./fakeServer?name=${eventRecord.name}`).then(response => response.text())
 *     }
 *   }
 * });
 * ```
 *
 * By default, the tooltip {@link Core.widget.Widget#config-scrollAction realigns on scroll}
 * meaning that it will stay aligned with its target should a scroll interaction make the target move.
 *
 * If this is causing performance issues in a Scheduler, such as if there are many dozens of events
 * visible, you can configure this feature with `scrollAction: 'hide'`. This feature's configuration is
 * applied to the tooltip, so that will mean that the tooltip will hide if its target is moved by a
 * scroll interaction.
 *
 * ## Keeping tooltip visible after mouse exits target element
 *
 * By default, a Tooltip is transient, and will {@link #function-hide} when the mouse leaves the target element.
 * Configure this feature with {@link #config-autoHide} set to `false` to make the Tooltip stay visible.
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-template}                     | Tooltip content template function                   |
 * | {@link #config-autoHide}                     | Auto-hide tooltip on pointer leave                  |
 *
 * ## See also
 *
 * - {@link Scheduler.feature.base.TooltipBase} - Base tooltip class
 * - {@link Scheduler.feature.ScheduleTooltip} - Tooltip for empty schedule areas
 * - {@link Scheduler.feature.EventEdit} - Editing events
 *
 * @demo Scheduler/basic
 * @extends Scheduler/feature/base/TooltipBase
 * @classtype eventTooltip
 * @feature
 * @tier community
 */
export default class EventTooltip extends TooltipBase {
    //region Config

    static $name = 'EventTooltip';

    static type = 'eventTooltip';
    static defaultEnabled = true;
    static tier = 'community';

    static configurable = {
        /**
         * Set this value to `false` to keep Tooltip visible after mouse leaves the target element.
         * @config {Boolean} autoHide
         * @default true
         */

        /**
         * A function which receives data about the event and returns a string,
         * or a Promise yielding a string (for async tooltips), to be displayed in the tooltip.
         * This method will be called with an object containing the fields below
         *
         * @config {Function} template
         * @param {Object} data Data context
         * @param {Scheduler.model.EventModel} data.eventRecord Hovered event bar's record
         * @param {Scheduler.model.AssignmentModel} data.assignmentRecord Hovered event bar's associated assignment
         * @param {Scheduler.model.ResourceModel} data.resourceRecord Hovered event bar's associated resource
         * @param {Date} data.startDate Hovered event bar's start date
         * @param {Date} data.endDate Hovered event bar's end date
         * @param {String} data.startText Start text
         * @param {String} data.endText End text
         * @param {Core.widget.Tooltip} data.tip Current tooltip instance
         * @param {String} data.startClockHtml Predefined HTML to show the start time
         * @param {String} data.endClockHtml Predefined HTML to show the end time
         * @returns {DomConfig|String|null}
         *
         * @category Rendering
         */
        template : data => `
            ${data.eventRecord.name ? StringHelper.xss`<div class="b-sch-event-title">${data.eventRecord.name}</div>` : ''}
            ${data.startClockHtml}
            ${data.endClockHtml}`,

        cls : 'b-sch-event-tooltip',

        monitorRecordUpdate : true,

        /**
         * Defines what to do if document is scrolled while the tooltip is visible.
         *
         * Valid values: `null`: do nothing, `hide`: hide the tooltip or `realign`: realign to the target if possible.
         *
         * @config {'hide'|'realign'|null}
         * @default
         */
        scrollAction : 'hide'
    };

    /**
     * The event which the tooltip feature has been activated for.
     * @member {Scheduler.model.EventModel} eventRecord
     * @readonly
     */

    //endregion

    construct(config) {
        super.construct(config);

        if (typeof this.align === 'string') {
            this.align = { align : this.align };
        }
    }

    // Bail if the record gets removed in the delay between mouseover and show
    internalCanShow(tip) {
        if (!tip.eventRecord) {
            return false;
        }
    }

    // https://github.com/bryntum/bryntum/issues/9562
    /**
     * Augment tooltip with extra data
     *
     * @param {Core.widget.Tooltip} tooltip
     * @param {Event} activeTarget
     * @internal
     * @returns {{resourceRecord: (Scheduler.model.ResourceModel|*), assignmentRecord: (*|Scheduler.model.AssignmentModel)}}
     */
    resolveData(tooltip, activeTarget) {
        const
            client = this.client,
            data   = super.resolveData(tooltip, activeTarget);

        return data && {
            ...data,
            resourceRecord   : client.resolveResourceRecord(activeTarget),
            assignmentRecord : client.resolveAssignmentRecord(activeTarget)
        };
    }

    onInternalPaint({ firstPaint }) {
        super.onInternalPaint(...arguments);

        if (firstPaint) {
            const { dependencies } = this.client.features;

            if (dependencies) {
                this.tooltip.ion({
                    beforeAlign({ source : tooltip, offset = zeroOffset }) {
                        const
                            { edgeAligned }   = parseAlign(tooltip.align.align),
                            depTerminalOffset = (dependencies.disabled  || !dependencies.allowCreate) ? zeroOffset : depOffset[edgeAligned];

                        // Add the spec's offset to the offset necessitated by dependency terminals
                        arguments[0].offset = [
                            offset[0] + depTerminalOffset[0],
                            offset[1] + depTerminalOffset[1]
                        ];
                    }
                });
            }
        }
    }
}

EventTooltip.initClass();
