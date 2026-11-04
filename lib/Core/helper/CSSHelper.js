import Helpers from './Helpers.js';
import DomHelper from './DomHelper.js';

/**
 * @module Core/helper/CSSHelper
 */

/**
 * A style specification to apply to an element. Accepted by the {@link Core.widget.Widget#config-style} config
 * and by {@link Core.helper.DomHelper#function-applyStyle-static DomHelper.applyStyle()}.
 *
 * Either a cssText string:
 *
 * ```javascript
 * style : 'margin-inline-end: 2em'
 * ```
 *
 * or an object whose keys are camelCase CSS property names. A bare number gets a `px` unit for length
 * properties, and a `null` value removes the property:
 *
 * ```javascript
 * style : {
 *     marginInlineEnd : '2em',
 *     width           : 100,
 *     color           : null
 * }
 * ```
 *
 * A live `CSSStyleDeclaration` is also accepted.
 *
 * @typedef {String|Object<String,String|Number|null>|CSSStyleDeclaration} CSSStyleConfig
 */

/**
 * A static utility class for inserting, deleting, and finding CSS style rules at runtime. It creates and manages a
 * dedicated `<style>` element in the document head (or a specified parent element) and provides methods to manipulate
 * rules within it.
 *
 * Note that this class is incompatible with [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
 *
 * ```javascript
 * // Insert a rule dynamically
 * const rule = CSSHelper.insertRule('.b-sch-event.critical { background-color: red }');
 *
 * // Later, remove it
 * CSSHelper.deleteRule(rule);
 *
 * // Find an existing rule by selector
 * const existing = CSSHelper.findRule('.b-grid-header');
 * ```
 *
 * ## Useful functions
 *
 * | Function                                     | Description                                   |
 * |----------------------------------------------|-----------------------------------------------|
 * | {@link #function-insertRule-static insertRule} | Insert one or more CSS rules                 |
 * | {@link #function-findRule-static findRule}     | Find a rule by selector string or function   |
 *
 * ## See also
 *
 * - {@link Core.helper.DomHelper} - DOM element utilities
 */
export default class CSSHelper {
    static $name = 'CSSHelper';

    /**
     * Inserts a CSS style rule based upon the passed text
     * @param {String|String[]} cssText The text of the rule including selector and rule body just as it would
     * be specified in a CSS file.
     * @returns {CSSRule|CSSRule[]} The resulting `CSSRule` object(s) if the add was successful.
     */
    static insertRule(cssText, parentElement = document.head) {
        const
            styleSheet   = this.getStyleSheet(parentElement),
            { cssRules } = styleSheet,
            oldCount     = cssRules.length,
            one          = typeof cssText === 'string';

        /* <remove-on-release> */
        if (globalThis.DocsBrowser?.isDocsBrowser && (!parentElement || parentElement === document.head)) {
            throw new Error('parentElement must be specified in DocsBrowser environment to avoid unstyled examples');
        }
        /* </remove-on-release> */

        (one ? [cssText] : cssText).forEach((rule, index) => styleSheet.insertRule(rule, index));

        // Only return element zero if the add was successful.
        if (cssRules.length > oldCount) {
            styleSheet.cssRules[0].$bryntumStylesheet = styleSheet;
            return one ? cssRules[0] : Array.from(cssRules).slice(0, cssText.length);
        }
    }

    static deleteRule(rule) {
        const styleSheet = rule.$bryntumStylesheet;

        for (let i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i] === rule) {
                styleSheet.deleteRule(i);
                return;
            }
        }
    }

    /**
     * Looks up the first rule which matched the passed selector.
     * @param {String|Function} selector Either the selector string to exactly match or a function which
     * when passed a required selector, returns `true`.
     * @returns {CSSRule} The first matching CSS Rule object if any found.
     */
    static findRule(selector) {
        let result;
        const isFn = typeof selector === 'function';

        // Array#find will stop when the function returns true, stop when the inner
        // find call yields a value from the search string.
        // Array#find better: to http://www.andygup.net/fastest-way-to-find-an-item-in-a-javascript-array/
        Array.prototype.find.call(document.head.querySelectorAll('link[rel=stylesheet],style[type*=css]'), element => {
            result = Array.prototype.find.call(element.sheet.rules || element.sheet.cssRules, r => {
                return isFn ? selector(r) : r.selectorText === selector;
            });
            if (result) {
                return true;
            }
        });

        return result;
    }

    static getStyleSheet(parentElement = document.head) {
        if (!parentElement.$bryntumStylesheet) {
            parentElement.$bryntumStylesheet = DomHelper.createElement({
                tag    : 'style',
                type   : 'text/css',
                parent : parentElement
            }).sheet;
        }
        return parentElement.$bryntumStylesheet;
    }

    /**
     * Returns current CSS version
     * @param {HTMLElement} [contextElement] The element for which to read the version. Pass document element or shadow
     * root document-fragment
     * @returns {String}
     * @internal
     */
    static getCSSVersion(contextElement = document.documentElement) {
        // --bryntum-version is declared on both :root and :host, so in shadow DOM contexts it is set on the shadow root
        // host. Reading from document.documentElement misses it, so read from first element in that case
        if (contextElement.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            contextElement = contextElement.firstElementChild;
        }

        return getComputedStyle(contextElement).getPropertyValue('--bryntum-version').replace(/[" ]/gm, '');
    }
}

Helpers.register(CSSHelper);
