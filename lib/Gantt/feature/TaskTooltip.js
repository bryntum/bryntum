import TooltipBase from '../../Scheduler/feature/base/TooltipBase.js';
import GanttFeature from './GanttFeature.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';

DomHelper.loadStylesheet('Gantt/feature/TaskTooltip.css');

// import Stylesheet from './TaskTooltip.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TaskTooltip');

/**
 * @module Gantt/feature/TaskTooltip
 */

/**
 * This feature displays a task tooltip on mouse hover. The template of the tooltip is customizable
 * with the {@link #config-template} function.
 *
 * ## Showing custom HTML in the tooltip
 *
 * ```javascript
 * new Gantt({
 *     features : {
 *         taskTooltip : {
 *             template : ({ taskRecord }) => `Tooltip for ${taskRecord.name}`,
 *             // Tooltip configs can be used here
 *             align    : 'l-r' // Align left to right
 *         }
 *     }
 * });
 * ```
 *
 * ## Showing remotely loaded data
 * Loading remote data into the task tooltip is easy. Simply use the {@link #config-template} and return a Promise which yields the content to show.
 *
 * ```javascript
 * new Gantt({
 *     features : {
 *         taskTooltip : {
 *             template : ({ taskRecord }) => AjaxHelper.get(`./fakeServer?name=${taskRecord.name}`).then(response => response.text())
 *         }
 *     }
 * });
 * ```
 *
 * This feature is **enabled** by default.
 *
 * @extends Scheduler/feature/base/TooltipBase
 * @demo Gantt/tooltips
 * @classtype taskTooltip
 * @feature
 * @tier community
 */
export default class TaskTooltip extends TooltipBase {

    static $name = 'TaskTooltip';

    static type = 'taskTooltip';

    // Registers with the Gantt factory, see GridFeature#featureFactory
    static featureFactory = GanttFeature;
    static defaultEnabled = true;
    static tier = 'community';

    // region Localization test
    static localization = [
        'L{TaskTooltip.Complete}'
    ];
    // endregion

    static configurable = {
        /**
         * Template (a function accepting task data and returning a string) used to display info in the tooltip.
         * The template will be called with an object as with fields as detailed below
         *
         * @config {Function} template
         * @param {Object} data Tooltip data
         * @param {Gantt.model.TaskModel} data.taskRecord Task record
         * @param {String} data.startClockHtml Predefined HTML to show the start time
         * @param {String} data.endClockHtml Predefined HTML to show the end time
         * @returns {String} String representing the HTML markup
         */
        template(data) {
            const
                me              = this,
                { taskRecord }  = data,
                displayDuration = me.client.formatDuration(taskRecord.duration || 0, me.decimalPrecision),
                name            = taskRecord.generatedParent ? `${StringHelper.capitalize(taskRecord.field || '')}: ${taskRecord.name}` : taskRecord.name;

            let percentDoneHtml = '';



            return `
                ${name ? `<div class="b-gantt-task-title">${StringHelper.encodeHtml(name)}</div>` : ''}
                <table>
                ${!taskRecord.isScheduled ? '' : `
                    <tr class="b-start-date"><td>${me.L('L{Start}')}:</td><td class="b-start-date-text">${data.startText}</td></tr>
                    ${taskRecord.milestone ? '' : `
                        <tr class="b-end-date"><td>${me.L('L{End}')}:</td><td class="b-end-date-text">${data.endText}</td></tr>
                        <tr class="b-duration"><td>${me.L('L{Duration}')}:</td><td class="b-duration-text">${displayDuration} ${DateHelper.getLocalizedNameOfUnit(taskRecord.durationUnit, taskRecord.duration !== 1)}</td></tr>
                        ${percentDoneHtml}
                    `}
                `}
                </table>
            `;
        },

        /**
         * Precision of displayed duration, defaults to use {@link Gantt.view.Gantt#config-durationDisplayPrecision}.
         * Specify an integer value to override that setting, or `false` to use raw value
         * @member {Number|Boolean} decimalPrecision
         */
        /**
         * Precision of displayed duration, defaults to use {@link Gantt.view.Gantt#config-durationDisplayPrecision}.
         * Specify an integer value to override that setting, or `false` to use raw value
         * @config {Number|Boolean}
         */
        decimalPrecision : null,

        cls : 'b-gantt-task-tooltip',

        monitorRecordUpdate : true
    };
}

TaskTooltip.initClass();
