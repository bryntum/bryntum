import TimelineBaseTag from './TimelineBaseTag.js';
import Scheduler from '../view/Scheduler.js';
import ProjectModel from '../model/ProjectModel.js';


// <remove-on-release>
// TODO: If we want to improve on this, add settings as attributes, replace data-field with field etc.
// </remove-on-release>

/**
 * @module Scheduler/customElements/SchedulerTag
 */

/**
 * Import this file to be able to use the tag `<bryntum-scheduler>` to create a Scheduler.
 *
 * This is more of a proof of concept than a ready to use class. The dataset of the `<data>` and `<bryntum-scheduler>`
 * tags is applied to record and Scheduler configs respectively, which means that you can pass any documented config
 * there, not only the ones demonstrated here. Dataset attributes are translated as follows:
 *
 *  * `data-view-preset` -> `viewPreset`
 *  * `data-start-date` -> `startDate`
 *  etc.
 *
 * ```html
 * <bryntum-scheduler data-view-preset="weekAndDay" data-start-date="2018-04-02" data-end-date="2018-04-09">
 *  <column data-field="name">Name</column>
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
 * </bryntum-scheduler>
 * ```
 *
 * To get styling correct, supply the path to the theme you want to use and to the folder that holds Font Awesome:
 *
 * ```html
 * <bryntum-scheduler stylesheet="resources/scheduler.stockholm.css" fa-path="resources/fonts">
 * </bryntum-scheduler>
 * ```
 *
 * NOTE: Remember to call {@link #function-destroy} before removing this web component from the DOM to avoid memory
 * leaks.
 *
 * ## See also
 *
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 * - {@link Scheduler.model.ProjectModel} - Project data model
 *
 * @demo Scheduler/frameworks/webpack/umd-web-components
 * @extends Scheduler/customElements/TimelineBaseTag
 * @skip-is-property
 */
export default class SchedulerTag extends TimelineBaseTag {
    static $name = 'SchedulerTag';

    connectedCallback() {
        this.widgetClass = Scheduler;
        this.projectModelClass = typeof ProjectModelEnterprise !== 'undefined' ? ProjectModelEnterprise : ProjectModel;

        super.connectedCallback();
    }
}

// <remove-on-release>
// Try-catch to make trial work
// </remove-on-release>
try {
    globalThis.customElements?.define('bryntum-scheduler', SchedulerTag);
}
catch {

}
