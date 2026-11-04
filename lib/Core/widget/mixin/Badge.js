import Base from '../../Base.js';
import DomHelper from '../../helper/DomHelper.js';

DomHelper.loadStylesheet('Core/widget/mixin/Badge.css');

// import Stylesheet from './Badge.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Badge');

/**
 * @module Core/widget/mixin/Badge
 */

/**
 * Mixin that allows a widget to display a badge (mostly done as css)
 *
 * ```javascript
 * // show badge
 * button.badge = 5;
 *
 * // hide badge
 * button.badge = null;
 * ```
 *
 * {@inlineexample Core/widget/Badge.js}
 *
 * ## Useful configs
 *
 * | Config                  | Description                                      |
 * |-------------------------|--------------------------------------------------|
 * | {@link #config-badge}   | Text or number to display in the badge           |
 *
 * ## See also
 *
 * - {@link Core.widget.Button} - Common widget that uses Badge
 *
 * @mixin
 */
export default Target => class Badge extends (Target || Base) {

    static $name = 'Badge';

    static configurable = {
        /**
         * Get/sets and display badge, set to null or empty string to hide.
         * @member {String} badge
         * @category Misc
         */
        /**
         * Initial text to show in badge.
         * @config {String} badge
         * @category Misc
         */
        badge : null
    };

    compose() {
        const { badge } = this;

        return {
            dataset : {
                badge
            },
            class : {
                'b-badge' : badge != null && badge !== ''
            }
        };
    }
};
