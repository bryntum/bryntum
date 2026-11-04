import Base from '../../Core/Base.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';

DomHelper.loadStylesheet('Scheduler/tooltip/ClockTemplate.css');

// import Stylesheet from './ClockTemplate.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ClockTemplate');

/**
 * @module Scheduler/tooltip/ClockTemplate
 */

/**
 * A template showing a clock, it consumes an object containing a date and a text
 * @private
 */
export default class ClockTemplate extends Base {
    static $name = 'ClockTemplate';

    static configurable = {
        scheduler : null, // May be passed to the constructor if needed
        mode      : null, // Auto detected if not specified
        // `b-sch-clock-day` for calendar icon
        // `b-sch-clock-hour` for clock icon
        /**
         * Get the clock template, which accepts an object of format { date, text }
         * @member {Function} template
         * @param {Object} data Data object
         * @param {Date} data.date The date to show
         * @param {String} data.text The text to show
         * @returns {String}
         */
        template(data) {
            if (this.mode === 'hour') {
                return `
                    <div class="b-sch-clock-wrap ${data.cls || ''}">
                        <svg class="b-sch-clock" viewBox="0 0 40 40">
                            <circle cx="20" cy="20" r="17" class="b-dial" />
                            <line x1="20" y1="20" x2="20" y2="12" class="b-hour-hand" />
                            <line x1="20" y1="20" x2="20" y2="6" class="b-minute-hand" />
                        </svg>
                        <span class="b-sch-clock-text">${StringHelper.encodeHtml(data.text || '')}</span>
                    </div>
                `;
            }

            return `
                <div class="b-sch-date-wrap ${data.cls || ''}">
                    <div class="b-sch-date">
                        <div class="b-sch-date-month">${data.date ? DateHelper.format(data.date, 'MMM') : ''}</div>
                        <div class="b-sch-date-date">${data.date ? DateHelper.format(data.date, 'D') : ''}</div>
                    </div>
                    <span class="b-sch-date-text">${StringHelper.encodeHtml(data.text || '')}</span>
                 </div>      
            `;
        }
    };

    // generateContent(data) {
    //     return this.div.innerHTML = this.template(data);
    // }

    updateDateIndicator(el, date) {
        if (date && el) {
            el.style.setProperty('--bi-sch-clock-hour', date.getHours() % 12);
            el.style.setProperty('--bi-sch-clock-minute', date.getMinutes());
        }
    }

    // `day` mode for calendar icon
    // `hour` mode for clock icon
    get mode() {
        if (this._mode) {
            return this._mode;
        }

        const { scheduler } = this;

        //<debug>
        if (!scheduler) {
            throw new Error('`scheduler` config has to be specified for the clock template');
        }
        //</debug>

        const
            unitLessThanDay        = DateHelper.compareUnits(scheduler.timeAxisViewModel.timeResolution.unit, 'day') < 0,
            formatContainsHourInfo = DateHelper.formatContainsHourInfo(scheduler.displayDateFormat);

        return unitLessThanDay && formatContainsHourInfo ? 'hour' : 'day';
    }
}
