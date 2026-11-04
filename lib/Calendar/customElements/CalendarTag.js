import TimelineBaseTag from '../../Scheduler/customElements/TimelineBaseTag.js';
import Calendar from '../view/Calendar.js';
import ProjectModel from '../model/ProjectModel.js';

// <remove-on-release>
// TODO: If we want to improve on this, add settings as attributes, replace data-field with field etc.
// </remove-on-release>

/**
 * @module Calendar/customElements/CalendarTag
 */

/**
 * Import this file to be able to use the tag `<bryntum-calendar>` to create a Calendar.
 *
 * This is more of a proof of concept than a ready to use class. The dataset of the `<data>` and `<bryntum-calendar>`
 * tags is applied to record and Calendar configs respectively, which means that you can pass any documented config
 * there, not only the ones demonstrated here. Dataset attributes are translated as follows:
 *
 *  * `data-view-preset` -> `viewPreset`
 *  * `data-start-date` -> `startDate`
 *  etc.
 *
 * ```html
 * <bryntum-calendar data-date="2018-04-02">
 *      <data>
 *          <events>
 *              <data data-id="1" data-resource-id="1" data-start-date="2018-04-03" data-end-date="2018-04-05"></data>
 *              <data data-id="2" data-resource-id="2" data-start-date="2018-04-04" data-end-date="2018-04-06"></data>
 *              <data data-id="3" data-resource-id="3" data-start-date="2018-04-05" data-end-date="2018-04-07"></data>
 *          </events>
 *          <resources>
 *              <data data-id="1" data-name="Daniel"></data>
 *              <data data-id="2" data-name="Steven"></data>
 *              <data data-id="3" data-name="Sergei"></data>
 *          </resources>
 *      </data>
 * </bryntum-calendar>
 * ```
 *
 * To get styling correct, supply the path to the theme you want to use and to the folder that holds Font Awesome:
 *
 * ```html
 * <bryntum-calendar stylesheet="resources/calendar.stockholm.css" fa-path="resources/fonts">
 * </bryntum-calendar>
 * ```
 *
 * NOTE: Remember to call {@link #function-destroy} before removing this web component from the DOM to avoid memory
 * leaks.
 *
 * ## See also
 *
 * - {@link Calendar.view.Calendar} — The Calendar class instantiated by this tag
 *
 * @demo Calendar/frameworks/webpack/umd-web-components
 * @extends Scheduler/customElements/TimelineBaseTag
 * @skip-is-property
 */
export default class CalendarTag extends TimelineBaseTag {
    static $name = 'CalendarTag';

    connectedCallback() {
        this.widgetClass = Calendar;
        this.projectModelClass = ProjectModel;

        super.connectedCallback();
    }

    createInstance(config) {
        for (const tag of this.children) {
            if (tag.tagName === 'MODES') {
                config.modes = {};
                for (const modeTag of tag.children) {
                    const mode = modeTag.tagName.toLowerCase();
                    // WordPress inserts <br>s, ignore those
                    if (mode !== 'br') {
                        if (
                            modeTag.getAttribute('data-use') === 'false' ||
                            modeTag.textContent === 'false' ||
                            modeTag.textContent === 'null'
                        ) {
                            config.modes[mode] = null;
                        }
                        else {
                            config.modes[mode] = { ...this.convertDatasetToConfigs(modeTag.dataset) };
                        }
                    }
                }
            }
        }

        return super.createInstance(config);
    }
}

// <remove-on-release>
// Try-catch to make trial work
// </remove-on-release>
try {
    globalThis.customElements?.define('bryntum-calendar', CalendarTag);
}
catch {

}
