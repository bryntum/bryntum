import Base from '../../Base.js';
import DateHelper from '../../helper/DateHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import StringHelper from '../../helper/StringHelper.js';

/**
 * @module Core/widget/mixin/Styleable
 */

const
    hasPrefixRe = /^b[iA-Z]/,
    isVarRe = /^--/;

/**
 * Mixin for widgets that allows manipulating CSS variables. Works by setting style properties of the target widgets
 * element.
 *
 * As part of configuration:
 *
 * ```javascript
 * const taskBoard = new TaskBoard({
 *    css : {
 *        cardBorderTop    : '5px solid currentColor',
 *        columnBackground : '#ddd'
 *    }
 * });
 * ```
 *
 * And/or at runtime:
 *
 * ```javascript
 * taskBoard.css.cardBackground = '#333';
 * ```
 *
 * ## Useful configs
 *
 * | Config                                  | Description                                         |
 * |-----------------------------------------|-----------------------------------------------------|
 * | {@link #config-css}                     | Object of CSS variable name/value pairs to apply     |
 * | {@link #config-cssVarPrefix}            | Prefix prepended to CSS variable names               |
 *
 * ## See also
 *
 * - {@link Core.widget.Widget} - Base widget class
 *
 * @mixin
 */
export default Target => class Styleable extends (Target || Base) {

    static $name = 'Styleable';

    static configurable = {
        /**
         * CSS variable prefix, appended to the keys used in {@link #config-css}.
         *
         * For example:
         *
         * ```javascript
         * {
         *    cssVarPrefix : 'taskboard',
         *
         *    css : {
         *        cardBackground : '#333'
         *    }
         * }
         * ```
         *
         * Results in the css var `--taskboard-card-background` being set to `#333`.
         *
         * Bryntum widgets defaults to using `-b-{type}` as prefix: `--b-button-font-size` etc.
         *
         * @config {String}
         * @category CSS
         */
        cssVarPrefix : '',

        /**
         * Allows runtime manipulating of CSS variables.
         *
         * See {@link #config-css} for more information.
         *
         * ```javascript
         * taskBoard.css.columnBackground = '#ccc';
         *
         * // Will set "--taskboard-column-background : #ccc"
         * ```
         *
         * @member {Proxy} css
         * @ts-returns {typeof Proxy}
         * @category DOM
         */

        /**
         * Initial CSS variables to set.
         *
         * Each key will be applied as a CSS variable to the target elements style. Key names are hyphenated and
         * prefixed with {@link #config-cssVarPrefix} in the process. For example:
         *
         * ```javascript
         * {
         *    cssVarPrefix : 'taskboard',
         *
         *    css : {
         *        cardBackground : '#333'
         *    }
         * }
         * ```
         *
         * Results in the css var `--taskboard-card-background` being set to `#333`.
         *
         * @config {Object<String,String>}
         * @category CSS
         */
        css : {}
    };

    changeCssVarPrefix(prefix) {
        ObjectHelper.assertString(prefix, 'prefix');

        if (prefix && !prefix.endsWith('-')) {
            prefix = prefix + '-';
        }

        return prefix || '';
    }

    getCSSValue(property) {
        const
            // <remove-on-release>
            // TODO: Worth keeping the live css object? Or just overhead if not often used?
            // </remove-on-release>
            styles = getComputedStyle(this.element || document.documentElement),
            name   = this.getCSSVarName(property);

        return styles.getPropertyValue(name)?.trim();
    }

    changeCss(css) {
        ObjectHelper.assertObject(css, 'css');

        const me = this;

        if (!globalThis.Proxy) {
            throw new Error('Proxy not supported');
        }

        const proxy = new Proxy({}, {
            get(target, property) {
                if (property === '__REFADR__') {
                    return target[property];
                }

                if (property === Symbol.toStringTag) {
                    return 'CSS';
                }

                if (property === 'asMilliseconds') {
                    return me.styleAsMilliseconds.bind(me);
                }

                return me.getCSSValue(property);
            },

            set(target, property, value) {
                const element = me.element || document.documentElement;
                me.setCSS(element, property, value);
                return true;
            }
        });

        if (css) {
            if (me._element) {
                ObjectHelper.assign(proxy, css);
            }
            else {
                me.$initialCSS = css;
            }
        }

        return proxy;
    }

    getCSSVarName(property) {
        // If the property is already a CSS variable, return as is
        if (property.match(isVarRe)) {
            return property;
        }
        // If the property doesn't have a prefix, add the configured one
        if (!property.match(hasPrefixRe)) {
            property = this.cssVarPrefix + property;
        }
        return `--${StringHelper.hyphenate(property)}`;
    }

    setCSS(element, property, value) {
        if (globalThis.brk) debugger;
        if (typeof property === 'string') {
            element.style.setProperty(this.getCSSVarName(property), value);
        }
        else {
            for (const key in property) {
                element.style.setProperty(this.getCSSVarName(property), property[key]);
            }
        }
    }

    styleAsMilliseconds(cssProperty) {
        const value = this.getCSSValue(cssProperty);

        // Guard against missing/empty CSS values which cause parseDuration to return null
        if (!value) {
            return 0;
        }

        const duration = DateHelper.parseDuration(value);

        // If parsing failed, return a sensible fallback instead of throwing
        if (!duration) {
            return 0;
        }
        return DateHelper.asMilliseconds(duration.magnitude, duration.unit);
    }

    // Apply any initially supplied CSS when we have an element
    updateElement(element, ...args) {
        super.updateElement(element, ...args);

        if (this.$initialCSS) {
            ObjectHelper.assign(this.css, this.$initialCSS);
        }
    }

    get widgetClass() {}
};
