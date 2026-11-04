import DomHelper from '../helper/DomHelper.js';
import DomClassList from '../helper/util/DomClassList.js';
import Checkbox from './Checkbox.js';

DomHelper.loadStylesheet('Core/widget/SlideToggle.css');

// import Stylesheet from './SlideToggle.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'SlideToggle');

/**
 * @module Core/widget/SlideToggle
 */

/**
 * A toggle switch widget — a visually distinct variation of {@link Core.widget.Checkbox} that renders a sliding
 * track-and-thumb instead of a traditional check mark. It wraps `<input type="checkbox">` and shares all Checkbox
 * functionality including {@link #config-color}, {@link #config-text}
 * label, and two-way data binding. Optionally display a label to the right of the toggle via {@link #config-text},
 * in addition to the standard field {@link #config-label}. This field can be used as a cell
 * {@link Grid.column.Column#config-editor} in a Grid.
 *
 * {@inlineexample Core/widget/SlideToggle.js}
 *
 * ```javascript
 * const toggle = new SlideToggle({
 *     label   : 'Notifications',
 *     text    : 'Enable',
 *     checked : true,
 *     appendTo : document.body
 * });
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config                  | Description                                     |
 * |-------------------------|-------------------------------------------------|
 * | {@link #config-checked} | Initial checked state                           |
 * | {@link #config-text}    | Label text displayed to the right of the toggle |
 * | {@link #config-color}   | Color of the toggle track                       |
 * | {@link #config-label}   | Field label displayed beside the toggle         |
 * | {@link #config-value}   | Gets or sets the current toggle value           |
 *
 * ## See also
 *
 * - {@link Core.widget.Checkbox} - Traditional checkbox widget
 * - {@link Core.widget.BooleanCombo} - Dropdown alternative for boolean selection
 *
 * @extends Core/widget/Checkbox
 * @classtype slidetoggle
 * @inputfield
 */
export default class SlideToggle extends Checkbox {

    static $name = 'SlideToggle';

    static type = 'slidetoggle';

    static get properties() {
        return {
            toggledCls : 'b-slide-toggle-checked'
        };
    }

    construct(config) {
        if (config.checked) {
            config.cls = DomClassList.from(config.cls) || {};
            config.cls[this.constructor.properties.toggledCls] = 1;
        }

        super.construct(config);
    }

    get innerElements() {
        const innerEls = super.innerElements;

        innerEls.splice(1, 1, this.toggleElement);

        // if (this.text) {
        //     innerEls[innerEls.length - 1].class = 'b-slide-toggle-label';
        // }
        if (!this.text) {
            // Remove label, not used
            innerEls.pop();
        }

        return innerEls;
    }

    get toggleElement() {
        return {
            class     : 'b-slide-toggle-toggle',
            reference : 'slideToggle',
            children  : [
                {
                    class     : 'b-slide-toggle-thumb',
                    reference : 'slideThumb'
                }
            ]
        };
    }

    internalOnChange(...args) {
        super.internalOnChange(...args);
        const me = this;
        if (!me.isDestroyed) {
            me.toggleCls(me.toggledCls, me.value);
        }
    }
}

SlideToggle.initClass();
