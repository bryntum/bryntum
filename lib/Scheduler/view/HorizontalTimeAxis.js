import TimeAxisBase from './TimeAxisBase.js';
import DomHelper from '../../Core/helper/DomHelper.js';

DomHelper.loadStylesheet('Scheduler/view/HorizontalTimeAxis.css');

// import Stylesheet from './HorizontalTimeAxis.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'HorizontalTimeAxis');

/**
 * @module Scheduler/view/HorizontalTimeAxis
 */

/**
 * A visual horizontal representation of the time axis described in the
 * {@link Scheduler.preset.ViewPreset#field-headers} field.
 * Normally you should not interact with this class directly.
 *
 * @extends Scheduler/view/TimeAxisBase
 * @private
 */
export default class HorizontalTimeAxis extends TimeAxisBase {

    static $name = 'HorizontalTimeAxis';

    static type = 'horizontaltimeaxis';

    static configurable = {
        model            : null,
        sizeProperty     : 'width',
        positionProperty : 'insetInlineStart'
    };

    get width() {
        return this.size;
    }
}
