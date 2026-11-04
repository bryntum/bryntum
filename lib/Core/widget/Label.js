import Widget from './Widget.js';
import DomHelper from '../helper/DomHelper.js';

DomHelper.loadStylesheet('Core/widget/Label.css');

// import Stylesheet from './Label.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Label');

/**
 * @module Core/widget/Label
 */

/**
 * A lightweight widget that renders a `<label>` HTML element. Use it to display static text, headings, or descriptive
 * labels alongside other widgets in a {@link Core.widget.Container}. The displayed text is set via the
 * {@link #config-text} config and can be updated at any time.
 *
 * ```javascript
 * const label = new Label({
 *     text     : 'Status: OK',
 *     appendTo : document.body
 * });
 *
 * // Update text at runtime
 * label.text = 'Status: Error';
 * ```
 *
 * {@inlineexample Core/widget/Label.js vertical}
 *
 * ## Useful configs and properties
 *
 * | Config                                  | Description                              |
 * |-----------------------------------------|------------------------------------------|
 * | {@link #config-text}                    | The text content to display              |
 * | {@link Core.widget.Widget#config-html}  | Raw HTML content (inherited from Widget) |
 * | {@link Core.widget.Widget#config-cls}   | CSS class(es) for custom styling         |
 * | {@link Core.widget.Widget#config-style} | Inline styles                            |
 *
 * ## See also
 *
 * - {@link Core.widget.Widget} - Base class providing positioning, visibility, and lifecycle
 * - {@link Core.widget.Container} - Use containers to arrange labels alongside other widgets
 *
 * @extends Core/widget/Widget
 * @classtype label
 * @widget
 */
export default class Label extends Widget {

    static $name = 'Label';

    static type = 'label';

    static configurable = {

        /**
         * Get/set label text
         * @prp {String}
         */
        text : null,

        localizableProperties : ['text']
    };

    compose() {
        const { text, html } = this;

        return {
            tag : 'label',
            text,
            html
        };
    }

}

Label.initClass();
