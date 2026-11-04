import SchedulerFeature from '../SchedulerFeature.js';
import Tooltip from '../../../Core/widget/Tooltip.js';
import ClockTemplate from '../../tooltip/ClockTemplate.js';

/**
 * @module Scheduler/feature/base/TooltipBase
 */

let id = 0;
/**
 * Base class for `EventTooltip` (Scheduler) and `TaskTooltip` (Gantt) features. Shows a tooltip next to an event bar
 * in the timeline. Provides shared tooltip configuration, positioning, and content generation logic.
 *
 * ## See also
 *
 * - {@link Scheduler.feature.EventTooltip} - Scheduler event tooltip
 * - {@link Scheduler.feature.ScheduleTooltip} - Schedule area tooltip
 * - {@link Scheduler.tooltip.ClockTemplate} - Clock template for tooltips
 *
 * @extends Scheduler/feature/SchedulerFeature
 * @extendsconfigs Core/widget/Tooltip
 */
export default class TooltipBase extends SchedulerFeature {
    static $name = 'TooltipBase';

    //region Config

    static configurable = {
        /**
         * Specify true to have tooltip updated when mouse moves, if you for example want to display date at mouse
         * position.
         * @config {Boolean}
         * @default
         * @category Misc
         */
        autoUpdate : false,

        /**
         * The amount of time to hover before showing
         * @config {Number}
         * @default
         */
        hoverDelay : 250,

        /**
         * The time (in milliseconds) for which the Tooltip remains visible when the mouse leaves the target.
         *
         * May be configured as `false` to persist visible after the mouse exits the target element. Configure it
         * as 0 to always retrigger `hoverDelay` even when moving mouse inside `fromElement`
         * @config {Number}
         * @default
         */
        hideDelay : 100,

        // <remove-on-release>
        // TODO: Rename to tooltipTemplate, deprecate template
        // </remove-on-release>
        template : null,

        cls : null,

        align : {
            align  : 'b-t',
            offset : [-3, -3]
        },

        // Set to `true` to update tooltip contents if record changes while tip is open
        monitorRecordUpdate : null,

        testConfig : {
            hoverDelay : 0
        },

        clockTemplate : true
    };

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            after : ['onInternalPaint']
        };
    }

    //endregion

    //region Events

    /**
     * Triggered before a tooltip is shown. Return `false` to prevent the action.
     * @preventable
     * @event beforeShow
     * @param {Core.widget.Tooltip|Object} source The tooltip being shown.
     * @param {Scheduler.model.EventModel} source.eventRecord The event record.
     */

    /**
     * Triggered after a tooltip is shown.
     * @event show
     * @param {Core.widget.Tooltip|Object} source The tooltip.
     * @param {Scheduler.model.EventModel} source.eventRecord The event record.
     */

    //endregion

    //region Init

    construct(config) {
        const me = this;

        super.construct(config);

        const { client } = me;

        // Default triggering selector is the client's inner element selector
        if (!me.forSelector) {
            me.forSelector = `${client.eventInnerSelector}:not(.b-drag-proxy,.b-is-creating)`;
        }

        client.ion({
            [`before${client.scheduledEventName}drag`] : () => {
                // Using {} on purpose to not return the promise
                me.tooltip?.hide();
            }
        });
    }

    // TooltipBase feature handles special config cases, where user can supply a function to use as template
    // instead of a normal config object
    processConfig(config) {
        if (typeof config === 'function') {
            return {
                template : config
            };
        }

        return config;
    }

    changeClockTemplate(clockTemplate) {
        if (clockTemplate === true) {
            return new ClockTemplate({
                scheduler : this.client
            });
        }

        return !clockTemplate ? null : clockTemplate;
    }

    // override setConfig to process config before applying it (used mainly from ReactScheduler)
    setConfig(config) {
        super.setConfig(this.processConfig(config));
    }

    doDestroy() {
        this.destroyProperties('clockTemplate', 'tooltip');

        super.doDestroy();
    }

    doDisable(disable) {
        if (this.tooltip) {
            this.tooltip.disabled = disable;
        }

        super.doDisable(disable);
    }

    //endregion

    onInternalPaint({ firstPaint }) {
        if (firstPaint) {
            const
                me             = this,
                { client }     = me,
                ignoreSelector = `:not(${[
                    '.b-drag-selecting',
                    '.b-event-editor-editing',
                    '.b-task-editor-editing',
                    '.b-resizing-event',
                    '.b-task-percent-bar-resizing-task',
                    '.b-drag-creating',
                    `.b-dragging-${client.scheduledEventName}`,
                    '.b-creating-dependency',
                    '.b-drag-proxy'
                ].join()})`;

            me.tooltip?.destroy();

            /**
             * A reference to the tooltip instance, which will have a special `eventRecord` property that
             * you can use to get data from the contextual event record to which this tooltip is related.
             * @member {Core.widget.Tooltip} tooltip
             * @readonly
             * @category Misc
             */
            const tip = me.tooltip = new Tooltip({
                axisLock          : 'flexible',
                id                : me.tipId || `${me.client.id}-event-tip-${id++}`,
                cls               : me.tipCls,
                forSelector       : `.b-timeline-base${ignoreSelector} .b-grid-body-container:not(.b-scrolling) ${me.forSelector}`,
                scrollAction      : 'realign',
                forElement        : client.timeAxisSubGridElement,
                showOnHover       : true,
                anchorToTarget    : true,
                getHtml           : me.getTipHtml.bind(me),
                internalCanShow   : me.internalCanShow.bind(me),
                disabled          : me.disabled,
                // on Core/mixin/Events constructor, me.config.listeners is deleted and attributed its value to me.configuredListeners
                // to then on processConfiguredListeners it set me.listeners to our TooltipBase
                // but since we need our initial config.listeners to set to our internal tooltip, we leave processConfiguredListeners empty
                // to avoid lost our listeners to apply for our internal tooltip here and force our feature has all Tooltip events firing
                ...me.config,
                internalListeners : me.configuredListeners
            });

            tip.ion({
                innerhtmlupdate : 'updateDateIndicator',
                overtarget      : 'onOverNewTarget',
                show            : 'onTipShow',
                hide            : 'onTipHide',
                thisObj         : me
            });

            // Once instantiated, any Tooltip configs are relayed through the feature directly to the tip
            Object.keys(tip.$meta.configs).forEach(name => {
                Object.defineProperty(this, name, {
                    set : v => tip[name] = v,
                    get : () => tip[name]
                });
            });
        }
    }

    //region Listeners

    // leave configuredListeners alone until render time at which they are used on the tooltip
    processConfiguredListeners() {}

    addListener(...args) {
        const
            // Call super method to handle enable/disable feature events
            defaultDetacher = super.addListener(...args),
            // Add listener to the `tooltip` instance
            tooltipDetacher = this.tooltip?.addListener(...args);

        if (defaultDetacher || tooltipDetacher) {
            return () => {
                defaultDetacher?.();
                tooltipDetacher?.();
            };
        }
    }

    removeListener(...args) {
        super.removeListener(...args);

        // Remove listener from the `tooltip` instance
        this.tooltip?.removeListener(...args);
    }

    //endregion

    updateDateIndicator() {
        const
            me                         = this,
            { tooltip, clockTemplate } = me,
            endDateElement             = tooltip.element.querySelector('.b-sch-tooltip-end-date');

        if (!me.record) {
            return;
        }

        if (clockTemplate) {
            clockTemplate.updateDateIndicator(tooltip.element, me.record.startDate);

            endDateElement && clockTemplate.updateDateIndicator(endDateElement, me.record.endDate);
        }
    }

    resolveTimeSpanRecord(forElement) {
        return this.client.resolveTimeSpanRecord(forElement);
    }

    resolveData(tip, activeTarget) {
        const
            me             = this,
            { client }     = me,
            recordProp     = me.recordType || `${client.scheduledEventName}Record`,
            timeSpanRecord = me.resolveTimeSpanRecord(activeTarget);

        // If user has mouseovered a fading away element of a deleted event,
        // an event record will not be found. In this case the tip must hide.
        if (timeSpanRecord && !timeSpanRecord.isCommitting) {
            tip.eventRecord = tip.record = timeSpanRecord;

            const
                { startDate, endDate } = timeSpanRecord,
                startText              = client.getFormattedDate(startDate),
                endDateValue           = client.getDisplayEndDate(endDate, startDate),
                endText                = client.getFormattedDate(endDateValue);

            return {
                tip,
                // eventRecord for Scheduler, taskRecord for Gantt
                [`${recordProp}`] : timeSpanRecord,
                startDate,
                endDate,
                startText,
                endText,
                startClockHtml    : me.clockTemplate?.template({
                    date : startDate,
                    text : startText,
                    cls  : 'b-sch-tooltip-start-date'
                }) ?? startText,
                endClockHtml : timeSpanRecord.isMilestone ? '' : me.clockTemplate?.template({
                    date : endDateValue || '',
                    text : endText || '',
                    cls  : 'b-sch-tooltip-end-date'
                }) ?? endText
            };
        }

        return null;
    }

    getTipHtml({ tip, activeTarget }) {
        if (!activeTarget) {
            return;
        }

        const templateData = this.resolveData(tip, activeTarget);

        if (!templateData || !this.template) {
            return;
        }

        // If user has mouseovered a fading away element of a deleted event,
        // an event record will not be found. In this case the tip must hide.
        // Instance of check is to not display while propagating
        if (!(templateData.startDate instanceof Date)) {
            tip.hide();
            return '';
        }

        return this.template(templateData);
    }

    get record() {
        return this.tooltip.eventRecord;
    }

    // Overridden in EventTooltip.js
    internalCanShow() {}

    onTipShow() {
        const me = this;

        if (me.monitorRecordUpdate && !me.updateListener) {
            me.updateListener = me.client.eventStore.ion({
                change  : me.onRecordUpdate,
                buffer  : 300,
                thisObj : me
            });
        }
    }

    onTipHide() {
        // To not retain full project when changing project
        this.tooltip.eventRecord = this.tooltip.record = null;

        this.updateListener?.();
        this.updateListener = null;
    }

    onOverNewTarget({ newTarget }) {
        const { tooltip } = this;

        if (tooltip.isVisible) {
            if (this.client.timeAxisSubGrid.scrolling || this.client.scrolling) {
                tooltip.hide(false);
            }
            else {
                tooltip.eventRecord = this.resolveTimeSpanRecord(newTarget);
            }
        }
    }

    onRecordUpdate({ record }) {
        const { tooltip } = this;

        // Make sure the record we are showing the tip for is still relevant
        // If the change moved the element out from under the mouse, we will be hidden.
        if (tooltip?.isVisible && record === this.record) {
            tooltip.updateContent();

            // If we were aligning to the event bar, realign to it.
            if (tooltip.lastAlignSpec.aligningToElement) {
                tooltip.realign();
            }
            // The pointer is still over the target (otherwise tooltip would be hidden)
            // So invoke the tooltip's positioning
            else {
                tooltip.internalOnPointerOver(this.client.lastPointerEvent);
            }
        }
    }
}
