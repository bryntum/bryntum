import DomHelper from '../../Core/helper/DomHelper.js';
import TimeAxisBase from './TimeAxisBase.js';

DomHelper.loadStylesheet('Scheduler/view/VerticalTimeAxis.css');

// import Stylesheet from './VerticalTimeAxis.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'VerticalTimeAxis');

/**
 * @module Scheduler/view/VerticalTimeAxis
 */

/**
 * Widget that renders a vertical time axis. Only renders ticks in view. Used in vertical mode.
 * @extends Core/widget/Widget
 * @private
 */
export default class VerticalTimeAxis extends TimeAxisBase {

    static $name = 'VerticalTimeAxis';

    static configurable = {
        cls : 'b-vertical-time-axis',

        sizeProperty : 'height',

        positionProperty : 'top',

        wrapText : true
    };

    get height() {
        return this.size;
    }
}
