import ArrayHelper from './ArrayHelper.js';
import AsyncHelper from './AsyncHelper.js';
import StringHelper from './StringHelper.js';
import Rectangle from './util/Rectangle.js';
import Helpers from './Helpers.js';
import ObjectHelper from './ObjectHelper.js';
import DomClassList from './util/DomClassList.js';
import Colors from '../util/Colors.js';
import GlobalEvents from '../GlobalEvents.js';
import EventHelper from './EventHelper.js';
import Promissory from './util/Promissory.js';
import { themes, themeNames, themeVariants, familyThemes } from '../theme/themes.js';

// import Stylesheet from './DomHelper.css' with { type : 'css' };

const
    // <remove-on-release>
    // HACK: this value is required to calculate width if it was configured relative to font size (em) but no element is
    // set
    // </remove-on-release>
    DEFAULT_FONT_SIZE        = 14,
    t0t0                     = { align : 't0-t0' },
    {
        DOCUMENT_NODE,
        ELEMENT_NODE,
        TEXT_NODE,
        DOCUMENT_FRAGMENT_NODE
    }                 = Node,
    textualInputs = {
        text             : 1,
        password         : 1,
        date             : 1,
        search           : 1,
        email            : 1,
        number           : 1,
        time             : 1,
        'datetime-local' : 1,
        tel              : 1,
        url              : 1,
        month            : 1,
        week             : 1
    },
    { isObject }             = ObjectHelper,
    // Extract repeating number regexp to simplify next expressions. Available values are: https://developer.mozilla.org/en-US/docs/Web/CSS/number
    numberRe                 = /[+-]?\d*\.?\d+[eE]?-?\d*/g, // -2.4492935982947064e-16 should be supported
    whiteSpaceRe             = /\s+/,
    semicolonRe              = /\s*;\s*/,
    colonRe                  = /\s*:\s*/,
    digitsRe                 = /^-?((\d+(\.\d*)?)|(\.?\d+))$/,
    elementExpandoKey        = '$bryntum',
    focusabilityCache        = {},

    // A blank value means the expando name is the same as the key in this object, otherwise the key in this object is
    // the name of the domConfig property and the value is the name of the DOM element expando property.
    elementCreateExpandos    = {
        elementData   : '',
        for           : 'htmlFor',
        retainElement : ''
    },

    // DomHelper#createElement properties which require special processing.
    // All other configs such as id and type are applied directly to the element.
    elementCreateProperties  = {
        // these two are handled by being in elementCreateExpands:
        // elementData  : 1,
        // for          : 1,
        tag          : 1,
        html         : 1,
        text         : 1,
        children     : 1,
        tooltip      : 1,
        style        : 1,
        dataset      : 1,
        parent       : 1,
        nextSibling  : 1,
        ns           : 1,
        reference    : 1,
        class        : 1,
        className    : 1,
        unmatched    : 1, // Used by syncId approach
        onlyChildren : 1, // Used by sync to not touch the target element itself,
        listeners    : 1, // eslint-disable-line bryntum/no-listeners-in-lib
        compareHtml  : 1, // Sync
        syncOptions  : 1, // Sync
        keepChildren : 1  // Sync
    },

    focusabilities           = [
        ['f', 'focusable'],
        ['n', 'natural'],
        ['p', 'programmatic'],
        ['t', 'tabbable']
    ],

    focusabilityDecode       = f => Object.freeze(Object.fromEntries(focusabilities.map(([c, k]) => [k, f.includes(c)]))),
    /*
     * Given an array of keys, ensure the existence of, and return the expando Object for that key path. For example,
     * consider:
     *
     *      descendExpandos(el, ['$bryntum', 'foo'])
     *
     * The above is equivalent to "el.$bryntum.foo", while ensuring that el.$bryntum and el.$bryntum.foo are both empty
     * objects.
     *
     * @param {HTMLElement} The element from which the path is resolved
     * @param {String} path The array of property names to descend
     * @returns {Object}
     * @internal
     */
    descendExpandos = (element, path) => path.reduce((o, k) => o[k] || (o[k] = Object.create(null)), element),
    /*
     * Expands dotted names and string arrays into a flat string array, beginning with '$bryntum'.
     *
     * @param {...String|...String[]} p One or more strings or string arrays describing the path.
     * @returns {String[]}
     * @internal
     */
    resolveExpandoPath = (...p) => [elementExpandoKey, ...p.flatMap(k => Array.isArray(k) ? k : k.split('.'))],
    /*
     * Returns a two-tuple containing the expando object and property name for the given key and element.
     *
     * For example:
     *
     *      const [obj, prop] = resolveExpandos(el, 'foo');
     *
     * Is equivalent to:
     *
     *      const obj = el.$bryntum || (el.$bryntum = Object.create(null));
     *      const prop = 'foo';
     *
     * Also:
     *
     *      const [obj, prop] = resolveExpandos(el, 'foo.bar');
     *
     * Is equivalent to:
     *
     *      const obj = (el.$bryntum || (el.$bryntum = Object.create(null))).foo ||
     *                  (el.$bryntum.foo = Object.creat(null));
     *      const prop = 'bar';
     *
     * @param {HTMLElement}
     * @param {String} key
     * @returns {Array}
     * @internal
     */
    resolveExpandos = (element, key) => {
        const
            path = resolveExpandoPath(key),
            k = path.pop();

        return [element && descendExpandos(element, path), k];
    },

    styleIgnoreProperties    = {
        length     : 1,
        parentRule : 1,
        style      : 1
    },

    nativeEditableTags       = {
        INPUT    : 1,
        TEXTAREA : 1
    },
    nativeFocusableTags      = {
        BUTTON   : 1,
        IFRAME   : 1,
        EMBED    : 1,
        INPUT    : 1,
        OBJECT   : 1,
        SELECT   : 1,
        TEXTAREA : 1,
        BODY     : 1
    },
    win                      = globalThis,
    doc                      = document,
    emptyObject              = Object.freeze({}),
    arraySlice               = Array.prototype.slice,
    immediatePromise         = Promise.resolve(),
    fontProps                = [
        'font-size',
        'font-size-adjust',
        'font-style',
        'font-weight',
        'font-family',
        'font-kerning',
        'font-stretch',
        'line-height',
        'text-transform',
        'text-decoration',
        'letter-spacing',
        'word-break'
    ],
    isHiddenWidget           = e => e._hidden,
    isDomObject              = obj => (obj instanceof DomClassList) || ObjectHelper.isObject(obj),
    mergeChildren            = (dest, src, options) => {
        if (options.key === 'children') {
            // Normally "children" is an array (for which we won't be here, due to isObject check in caller). To
            // maintain declarative order of children as an object, we need some special sauce:
            return ObjectHelper.mergeItems(dest, src, options);
        }

        return ObjectHelper.blend(dest, src, options);
    },
    isVisible                = (e, skipVisibility) => {
        // Shortcut when node not in DOM
        if (e.isConnected) {
            const style = e.ownerDocument.defaultView.getComputedStyle(e);

            // When being used by DomHelper.isVisible, checking ancestor chain visibility, if it encounters
            // an element with explicit visibility:visible, further ancestors must *not* have visibility checked.
            return style.getPropertyValue('display') !== 'none' && (skipVisibility || style.getPropertyValue('visibility') !== 'hidden');
        }
    },
    // position:fixed and display:contents elements have no offsetParent, so their layout is that of their parentNode
    hasParentLayout          = el => {
        const { position, display } = DomHelper.getStyleValue(el, ['position', 'display']);

        return position === 'fixed' || display === 'contents';
    },
    // Called when the scrollbar measure element is resized or gets rendered. Measures again and announces a changed
    // width, scrollbars may have been toggled on the platform or 0 was reported while the document was not rendered
    onScrollBarMeasureElementResize = () => {
        // Nothing to measure when the document is no longer rendered, keep the cached width
        if (scrollBarMeasureElement.offsetHeight) {
            // null if 0 was reported while the document was not rendered, the previous width is not known then
            const oldScrollBarWidth = announcedScrollBarWidth ?? undefined;

            scrollBarMeasureElement.classList.remove('b-measure-when-rendered');
            scrollBarWidth = null;

            if (DH.scrollBarWidth !== announcedScrollBarWidth) {
                announcedScrollBarWidth = scrollBarWidth;
                GlobalEvents.trigger('scrollBarWidthChange', { scrollBarWidth, oldScrollBarWidth });
            }
        }
    },
    // Nodes such as SVG which do not expose such a property must have an ancestor which has an offsetParent.
    // If position:fixed or display:contents, there's no offsetParent, so continue to interrogate parentNode.
    // If the el has appeared through a timer from a destroyed frame, the defaultView will be null.
    hasLayout                = el => el && el.isConnected && (el === doc.body || Boolean(el.offsetParent) || (el.ownerDocument.defaultView && ('offsetParent' in el && !hasParentLayout(el)) ? el.offsetParent : hasLayout(el.parentNode))),

    elementOrConfigToElement = elementOrConfig => {
        if (elementOrConfig instanceof Node) {
            return elementOrConfig;
        }
        if (typeof elementOrConfig === 'string') {
            return DH.createElementFromTemplate(elementOrConfig);
        }
        return DH.createElement(elementOrConfig);
    },
    canonicalStyles          = Object.create(null),
    canonicalizeStyle        = (name, hasUnit) => {
        const entry = canonicalStyles[name] || [StringHelper.hyphenate(name), hasUnit];

        if (!canonicalStyles[name]) {
            canonicalStyles[entry[0]] = canonicalStyles[name] = entry;
        }

        return entry;
    },
    slideInAnimationName     = /b-slide-in-from-\w+/,
    themeFilenameRe          = /([^/]+)\.css/,
    // Keep identical to the copy in Grid/examples/_shared/browser/helper.js, which cannot import this module
    themeVariantRe           = /-(light|dark)$/,

    // Inline scheme an application declared before the pin stamped the element
    preservedSchemes         = new WeakMap(),

    // Elements carrying a scheme this API wrote. An inline `color-scheme` on any other element belongs to the
    // application, so it is neither reported as a pin nor removed. A pin written before this module loads (the
    // pre-load in Grid/examples/_shared/browser/helper.js) is adopted by re-assigning it through the API
    pinnedElements           = new WeakSet(),
    isColorSchemePinned      = element => pinnedElements.has(element),

    applyColorScheme         = (element, colorScheme) => {
        const { style } = element;

        if (colorScheme) {
            // Only the first pin snapshots, so repinning cannot overwrite the application's own value
            if (!isColorSchemePinned(element)) {
                preservedSchemes.set(element, style.getPropertyValue('color-scheme'));
                pinnedElements.add(element);
            }

            style.setProperty('color-scheme', colorScheme);
        }
        // Only a scheme this API wrote is cleared, so an application's own declaration survives
        else if (isColorSchemePinned(element)) {
            const preserved = preservedSchemes.get(element);

            // Nothing snapshotted means nothing to put back, and the declaration goes away entirely
            if (preserved) {
                style.setProperty('color-scheme', preserved);
            }
            else {
                style.removeProperty('color-scheme');
            }

            preservedSchemes.delete(element);
            pinnedElements.delete(element);
        }
    },

    // Pins the scheme on the document and on every shadow host
    pinColorScheme           = colorScheme => {
        applyColorScheme(document.documentElement, colorScheme);

        // A `:host` rule declaring the scheme inside the tree is outranked by an inline write on the host
        GlobalEvents.observedElements.forEach(root => root.host && applyColorScheme(root.host, colorScheme));
    },

    getParent                = (node, layoutParent) => {
        if (node) {
            // Accept a node or an event. "result" will be parent of node or event target.
            node = node.target?.nodeType === 1 ? node.target : node;

            const result = (node.ownerSVGElement || node)[layoutParent && DomHelper.getStyleValue(node, 'position') !== 'static' ? 'offsetParent' : 'parentNode'];

            // If we reached a shadow root, return the host
            return result?.nodeType === DOCUMENT_FRAGMENT_NODE ? result.host : result;
        }
    },
    isElement                = node => node?.nodeType === ELEMENT_NODE,
    getAnimatedElements      = (within = doc) => {
        // Get all currently running animations which have an end time.
        return DomHelper.getAnimations(within).reduce((result, { effect, playState }) => {
            if (playState === 'running' && effect.getTiming().iterations !== Infinity) {
                result.push(effect.target);
            }
            return result;
        }, []) || [];
    };

export { hasLayout, isVisible, getParent };

// @module has to go below the named export above, otherwise JSDoc picks those fns up instead of same named ones below
/**
 * @module Core/helper/DomHelper
 */

/**
 * An immutable object that describes the various aspects of an element's focus and keyboard navigation.
 *
 * @typedef {Object} Focusability
 * @property {Boolean} focusable Indicates that the element is focusable by keyboard navigation or programmatic means.
 * @property {Boolean} natural Indicates that the element is naturally focusable without assigning a `tabIndex`.
 * @property {Boolean} programmatic Indicates that the element is programmatically focusable (i.e., `tabIndex = -1`).
 * @property {Boolean} tabbable Indicates that the element is reachable by keyboard navigation, e.g. via the TAB key.
 * @internal
 */

/**
 * A theme information object about the current theme.
 *
 * Theme information object containing metadata about the active theme.
 * The theme information is read from CSS custom properties defined in the `.b-theme-info` class.
 *
 * Example CSS:
 * ```css
 * .b-theme-info {
 *     --b-theme-name             : "SvalbardDark";
 *     --b-theme-filename         : "svalbard-dark";
 *     --b-theme-button-rendition : "text";
 *     --b-theme-label-position   : "align-before";
 *     --b-theme-overlap-label    : "false";
 * }
 * ```
 *
 * @typedef {Object} ThemeInfo
 * @property {String} name The display name of the current theme (e.g., "SvalbardDark")
 * @property {String} filename The filename/identifier of the theme (e.g., "svalbard-dark")
 * @property {String} [buttonRendition] The button rendering style for the theme (e.g., "text", "outlined", "filled")
 * @property {String} [labelPosition] The default label position for form fields (e.g., "align-before", "above")
 * @property {Boolean} [overlapLabel] Whether labels should overlap with fields
 */

// Push the styles that have units into the map:
[
    'top', 'right', 'bottom', 'left', 'width', 'height', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight',
    'borderSpacing', 'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'insetBlockEnd', 'insetBlockStart', 'insetInlineEnd', 'insetInlineStart',
    'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'marginInlineStart', 'marginInlineEnd',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'fontSize', 'letterSpacing', 'lineHeight', 'outlineWidth', 'textIndent', 'wordSpacing',
    'insetInlineStart', 'insetBlockStart', 'insetInlineEnd', 'insetBlockEnd'
].forEach(name => canonicalizeStyle(name, true));

// We only do the measurement once, if the value is null
let scrollBarWidth = null,
    idCounter      = 0,
    themeInfo      = null,
    // The scrollbar width that the app has been told about, null after reporting 0 while the document was not rendered
    announcedScrollBarWidth,
    templateElement, htmlParser, scrollBarMeasureElement;

/**
 * An object that describes a DOM element. Used for example by {@link #function-createElement-static createElement()}
 * and by {@link Core.helper.DomSync#function-sync-static DomSync.sync()}.
 *
 * ```javascript
 * DomHelper.createElement({
 *    class : {
 *        big   : true,
 *        small : false
 *    },
 *    children : [
 *        { tag : 'img', src : 'img.png' },
 *        { html : '<b style="color: red">Red text</b>' }
 *    ]
 * });
 * ```
 *
 * @typedef {Object<String, *>} DomConfig
 * @property {String} [tag='div'] Tag name, for example 'span'. If this is passed as `'#fragment'`, a DocumentFragment will be created.
 * @property {HTMLElement} [parent] Parent element
 * @property {HTMLElement} [nextSibling] Element's next sibling in the parent element
 * @property {String|Object} [class] CSS classes, as a string or an object (truthy keys will be applied)
 * @property {String|Object} [className] Alias for `class`
 * @property {CSSStyleConfig} [style] Style, as a string or an object (keys will be hyphenated)
 * @property {Object} [elementData] Data object stored as an expando on the resulting element
 * @property {Object} [dataset] Dataset applied to the resulting element
 * @property {Array<DomConfig|String|HTMLElement|null>|Object<String,DomConfig>} [children] Child elements, as an array
 *   which may mix DomConfigs that will be turned into elements, plain strings that will be used as text nodes and
 *   existing elements that will be moved. `null` entries are skipped, which is convenient when the array is built with
 *   `Array.map()`. Also accepts an object map of DomConfigs, but please note that it cannot be used with
 *   `DomHelper.createElement()`
 * @property {String} [html] Html string, used as the resulting elements `innerHTML`. Mutually exclusive with the `children` property
 * @property {TooltipConfig|String} [tooltip] Tooltip config applied to the resulting element
 * @property {String} [text] Text content, XSS safe when you want to display text in the element. Mutually exclusive with the `children` property
 * @property {String} [id] Element's `id`
 * @property {String} [href] Element's `href`
 * @property {String} [ns] Element's namespace
 * @property {String} [src] Element's `src`
 */

/**
 * An object that describes a vue component configuration.
 *
 * ```javascript
 * {
 *     vue  : true
 *     is   : 'VueWidget'
 *     bind : { prop1: 'value1', prop2: 'value2' }
 *     on   : { myclick: handleMyClick }
 * }
 * ```
 *
 * @typedef {Object} VueConfig
 * @property {Boolean} vue Mandatory flag to mark as vue configuration. Should be set to `true`
 * @property {String} is Name of the Vue component
 * @property {Object} [bind] Object with properties to bind to the Vue Component
 * @property {Object} [on] Object with event listeners. Events emitted by Vue Component
 */

/**
 * Placeholder type for React JSX nodes in plain JS
 * @typedef {*} ReactJSX
 */

/**
 * A static utility class for DOM element creation, querying, and manipulation. It provides
 * {@link #function-createElement-static} to build element trees from {@link #typedef-DomConfig} objects,
 * and includes helpers for measuring, focusing, scrolling, and synchronizing DOM structures.
 *
 * ```javascript
 * DomHelper.createElement({
 *   tag       : 'div',
 *   className : 'parent',
 *   style     : 'background: red',
 *   children  : [
 *      { tag: 'div', className: 'child' },
 *      { tag: 'div', className: 'child' }
 *   ]
 * });
 * ```
 *
 * ## Useful functions
 *
 * | Function                                   | Description                                   |
 * |--------------------------------------------|-----------------------------------------------|
 * | {@link #function-createElement-static}     | Create an element from a DomConfig object     |
 * | {@link #function-sync-static}              | Sync a DomConfig to an existing DOM tree      |
 * | {@link #function-isVisible-static}         | Check whether an element is visible           |
 *
 * ## See also
 *
 * - {@link #typedef-DomConfig} - Element configuration object
 * - {@link Core.helper.EventHelper} - DOM event utilities
 *
 */
export default class DomHelper {
    static $name = 'DomHelper';

    static _usingKeyboard = false;

    /**
     * Set to `false` to not show focus renditions when using keyboard
     * @member {Boolean} enableKeyboardCssModifiers
     * @default true
     */
    static enableKeyboardCssModifiers = true;

    /**
     * Dictionary of all theme keys and their labels.
     * ```javascript
     * {
     *     'high-contrast' : 'High Contrast',
     * }
     * ```
     * @member {Object<String,String>} themeNames
     * @readonly
     * @static
     */
    static get themeNames() {
        return themeNames;
    }

    /**
     * Dictionary of all theme variants.
     * ```javascript
     * {
     *     'dark' : 'Dark',
     * }
     * ```
     * @member {Object<String,String>} themeVariants
     * @readonly
     * @static
     */
    static get themeVariants() {
        return themeVariants;
    }

    /**
     * Dictionary of the family themes, which have no light/dark variant suffix. A family theme renders the
     * `color-scheme` in effect where it sits, for example `light dark` to follow the system preference, and renders
     * light while the application declares none.
     * ```javascript
     * {
     *     'material3'     : 'Material 3',
     *     'stockholm'     : 'Stockholm',
     *     'svalbard'      : 'Svalbard',
     *     'visby'         : 'Visby',
     *     'fluent2'       : 'Fluent 2',
     *     'high-contrast' : 'High Contrast'
     * }
     * ```
     * @member {Object<String,String>} familyThemes
     * @readonly
     * @static
     */
    static get familyThemes() {
        return familyThemes;
    }

    /**
     * Provides a dictionary of all available theme names and variants.
     *
     * Keys are matching the CSS file name part, values are the labels to be displayed in the UI:
     * ```javascript
     * {
     *     'material3-dark' : 'Material 3 Dark',
     * }
     * ```
     * @member {Object<String,String>} themes
     * @readonly
     * @static
     */
    static get themes() {
        return themes;
    }

    static get devicePixelRatio() {
        let result = globalThis.devicePixelRatio;

        // Firefox returns undefined for this when in an iframe.
        if (result == null) {
            const
                STEP       = 0.05,
                MAX        = 5,
                MIN        = 0.5,
                mediaQuery = (v) => `(-webkit-min-device-pixel-ratio: ${v}),
                (min--moz-device-pixel-ratio: ${v}),
                (min-resolution: ${v}dppx)`;

            // * 100 is added to each constants because of JS's float handling and
            // numbers such as `4.9-0.05 = 4.8500000000000005`
            for (let i = MAX * 100; i >= MIN * 100; i -= STEP * 100) {
                if (globalThis.matchMedia(mediaQuery(i / 100)).matches) {
                    result = i / 100;
                    break;
                }
            }
        }
        return result;
    }

    static get usingKeyboard() {
        return DH._usingKeyboard;
    }

    static set usingKeyboard(value) {
        DH._usingKeyboard = value;
    }

    static setUsingKeyboard(element, value) {
        DH.setFocusRendition(element, value);
        DH._usingKeyboard = value;
    }

    static setFocusRendition(element, value) {
        if (DH.enableKeyboardCssModifiers) {
            // if shadow root, remove from children (the shadow root itself lacks a classList)
            if (element.nodeType === DOCUMENT_FRAGMENT_NODE) {
                if (value) {
                    Array.from(element.children).forEach(el => el.matches?.('.b-outer') && el.classList.add('b-using-keyboard'));
                }
                else {
                    DH.removeClsGlobally(element, 'b-using-keyboard');
                }
            }
            else {
                element.classList?.toggle('b-using-keyboard', value);
            }
        }
    }

    static findParent(e, p, limit) {
        return this.closest(e?.parentNode, p, limit);
    }

    static closest(e, p, limit) {
        if (e && e !== limit) {
            return p(e) ? e : this.closest(e.parentNode, p, limit);
        }
    }

    /**
     * Animates the specified element to slide it into view within the visible viewport
     * of its parentElement from the direction of movement.
     *
     * So in a left-to-right Widget, `direction` 1 means it slides in from the right
     * and `direction` -1 means it slides in from the left. RTL reverses the movement.
     *
     * See the forward/backward navigations in {@link Core.widget.DatePicker} for an example
     * of this in action.
     *
     * If "next" should arrive from below and "previous" should arrive from above, add the
     * class `b-slide-vertical` to the element.
     * @param {HTMLElement} element The element to slide in.
     * @param {Number} direction
     * * `1` to slide in from the "next" direction.
     * * `-1` to slide in from the "previous" direction.
     *
     * If the element is inside an RTL widget the directions are reversed.
     * @async
     */
    static async slideIn(element, direction = 1) {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                const
                    cls = `b-slide-in-${direction > 0 ? 'next' : 'previous'}`,
                    {
                        classList,
                        parentNode : { classList : pClassList }
                    }   = element;

                // Parent element set to overflow : clip for the duration
                pClassList.add('b-sliding-child-element');
                classList.add(cls);
                EventHelper.waitForTransitionEnd({
                    element,
                    animationName : slideInAnimationName
                }).then(() => {
                    classList.remove(cls);
                    pClassList.remove('b-sliding-child-element');
                    resolve();
                });
            });
        });
    }

    /**
     * Returns a dynamic property from a DOM element given a dot-path name. All of these properties are stored on a
     * `$bryntum` object property lazily added to the `element`.
     *
     * For example:
     * ```javascript
     * const v = DomHelper.getExpando(el, 'foo');
     * ```
     *
     * Is equivalent to:
     *
     * ```javascript
     * const v = el.$bryntum?.foo;
     * ```
     *
     * Also:
     * ```javascript
     * const v = DomHelper.getExpando(el, 'foo', 42);
     * ```
     *
     * Is equivalent to:
     * ```javascript
     * const v = (el.$bryntum && 'foo' in el.$bryntum) ? el.$bryntum.foo : 42;
     * ```
     *
     * The `key` parameter can also be a dot-path, like so:
     * ```javascript
     * const v = DomHelper.getExpando(el, 'foo.bar', 42);
     * ```
     *
     * Is equivalent to:
     * ```javascript
     * const v = (el.$bryntum?.foo && 'bar' in el.$bryntum.foo) ? el.$bryntum.foo.bar : 42;
     * ```
     *
     * @param {HTMLElement} element The element from which to retrieve the dynamic property.
     * @param {String|String[]} key The name or dot-path to traverse to get the desired property.
     * @param {*} [defaultValue] The value to return if the desired `key` is not present as a dynamic property
     * @returns {*}
     * @internal
     */
    static getExpando(element, key, defaultValue) {
        const [expandos, k] = resolveExpandos(element, key);

        return expandos && (k in expandos) ? expandos[k] : defaultValue;
    }

    /**
     * Returns a lazily created object attached to `element` given its `key`. The `key` parameter can be a simple name
     * or a dot-path.
     *
     * For example:
     * ```javascript
     * const obj = DomHelper.getExpandos(el, 'foo');
     * ```
     *
     * Is equivalent to:
     * ```javascript
     * const obj = (el.$bryntum || (el.$bryntum = Object.create(null))).foo ||
     *             (el.$bryntum.foo = Object.creat(null));
     * ```
     *
     * @param {HTMLElement} element The element from which to retrieve the dynamic object.
     * @param {String|String[]} key The name or dot-path to traverse to get the desired object.
     * @returns {Object}
     * @internal
     */
    static getExpandos(element, key) {
        return descendExpandos(element, resolveExpandoPath(key));
    }

    /**
     * Removes a dynamic property from a DOM element given a dot-path name.
     * @param {HTMLElement} element The element from which to retrieve the dynamic property.
     * @param {String|String[]} key The name or dot-path of the property to remove.
     * @param {*} [ifValueIs] If a truthy value is passed, the current value is removed only if it is `=== ifValueIs`
     * @internal
     */
    static removeExpando(element, key, ifValueIs) {
        const [expandos, k] = resolveExpandos(element, key);

        if (expandos && (!ifValueIs || expandos[k] === ifValueIs)) {
            delete expandos[k];
        }
    }

    /**
     * Stores a dynamic property on a DOM element given a dot-path name. All of these properties are stored on a
     * `$bryntum` object property lazily added to the `element`.
     *
     * For example:
     * ```javascript
     * DomHelper.setExpando(el, 'foo', 42);
     * ```
     *
     * Is equivalent to:
     * ```javascript
     * (el.$bryntum || (el.$bryntum = Object.create(null))).foo = 42;
     * ```
     *
     * @param {HTMLElement} element The element on which to set the dynamic property.
     * @param {String|String[]} key The name or dot-path to traverse for the desired property.
     * @param {*} value The value of the property
     * @returns {HTMLElement} The given `element`
     * @internal
     */
    static setExpando(element, key, value) {
        const [expandos, k] = resolveExpandos(element, key);

        if (expandos) {
            expandos[k] = value;
        }

        return element;
    }

    /**
     * Returns an object describing the focus and keyboard navigation aspects of a given element.
     *
     * {@note}By default, it returns the general abilities of the element to be focused, *not* taking into account
     * whether the element is currently visible.
     *
     * To check whether the element is currently focusable in the UI, pass `true` as the second parameter.{/@note}
     * @param {HTMLElement} element The element to examine.
     * @param {Boolean} [checkAccessibility=false] Pass `true` to check whether the element is currently
     * in an accessible state, ie visible.
     * @returns {Focusability}
     * @internal
     */
    static getFocusability(element, checkAccessibility) {
        let focusability = '';

        // <remove-on-release>
        // TODO: Use this.getStyleValue(element, 'interactivity') === 'inert' when that is widely supported.
        // </remove-on-release>
        if (element && !element.closest('[inert]') && (!checkAccessibility || (DH.isVisible(element)))) {
            const
                { nodeName } = element,
                tabIndex     = element.getAttribute('tabIndex');

            // Naturally focusable:
            //   - certain element types
            //      or
            //   - an anchor or link with href attribute
            //      or
            //   - an editing host (contenteditable="true")
            focusability = (
                nativeFocusableTags[nodeName] ||
                ((nodeName === 'A' || nodeName === 'LINK') && element.href) ||
                element.contentEditable === 'true'
            ) ? 'n' : '';

            if (tabIndex === '-1') {
                focusability += 'fp';
            }
            else if (focusability || tabIndex != null) {
                focusability += 'ft';
            }
        }

        return focusabilityCache[focusability] || (focusabilityCache[focusability] = focusabilityDecode(focusability));
    }

    /**
     * Checks if an element clips its content.
     * @param {HTMLElement} element The element to check.
     * @returns {Boolean} Returns `true` if the element clips its content.
     */
    static isClipping(element) {
        const
            style = element.ownerDocument.defaultView.getComputedStyle(element),
            { overflowX, overflowY, display, contain } = style;

        // If the element is not boxless and has overflow other than visible or contains its paint area then it is clipping.
        return display !== 'contents' && ((overflowX !== 'visible' || overflowY !== 'visible') || contain === 'paint' || contain === 'strict' || contain === 'content');
    }

    /**
     * Returns `true` if the passed element is focusable either programmatically or through pointer gestures.
     * @param {HTMLElement} element The element to test.
     * @returns {Boolean} Returns `true` if the passed element is focusable
     */
    static isFocusable(element, skipAccessibilityCheck) {
        // Only Element nodes can be focusable.
        if (element?.nodeType !== ELEMENT_NODE) {
            return false;
        }
        if (element && !skipAccessibilityCheck) {
            // If element is hidden or in a hidden Widget, it's not focusable.
            if (!DH.isVisible(element) || DH.Widget.fromElement(element, isHiddenWidget)) {
                return false;
            }
        }

        return DH.getFocusability(element).focusable;
    }

    /**
     * Returns `true` if the passed element accepts keystrokes to edit its contents.
     * @returns {Boolean} Returns `true` if the passed element is editable.
     */
    static isEditable(element, onlyTextInputs) {
        return Boolean((element.isContentEditable || nativeEditableTags[element.nodeName]) && (!onlyTextInputs || (element.nodeName !== 'INPUT' || textualInputs[element.type.toLowerCase()])) && !(element.readOnly || element.disabled || element.closest('[inert]')));
    }

    static isTextualInput(element) {
        return nativeEditableTags[element.nodeName] && (element.nodeName !== 'INPUT' || textualInputs[element.type.toLowerCase()]);
    }

    /**
     * Returns the rectangle of the element or event which is currently visible in the browser viewport,
     * i.e. user can find it on screen, or `false` if it is scrolled out of view.
     * @param {HTMLElement|Event} target The element or event to test.
     * @param {Boolean} [whole=false] Whether to check that whole element is visible, not just part of it.
     * If this is passed as true, the result will be a boolean, `true` or `false`.
     * @privateparam {Core.widget.Widget} [caller] the Widget aligning to the target.
     * @returns {Core.helper.util.Rectangle|Boolean} Returns the rectangle of the element which is currently visible in
     * the browser viewport, or `false` if it is out of view.
     */
    static isInView(target, whole = false, caller = undefined) {
        // If the target cannot yield a Rectangle, shortcut all processing.
        if (!target || !hasLayout(isElement(target.target) ? target.target : target)) {
            return false;
        }

        const
            positioned = caller?.positioned && DomHelper.getStyleValue(caller.element, 'position') !== 'fixed',
            docRect    = Rectangle.from(globalThis),
            method     = whole ? 'contains' : 'intersect',
            cOp        = positioned && caller.element.offsetParent,
            cOpR       = positioned && Rectangle.from(cOp);

        // If we get to the top, the visible rectangle is the entire document.
        docRect.height = doc.scrollingElement.scrollHeight;

        // If they asked to test the body, it's always in view
        if (target === doc.body) {
            return docRect;
        }

        const result = this.getViewportIntersection(target, docRect, method);

        // We must use the *viewport* coordinate system to ascertain viewability
        if (result && positioned) {
            result.translate(doc.scrollingElement.scrollLeft, doc.scrollingElement.scrollTop);
        }

        // Return any rectangle to its positioned coordinate system
        return positioned && result ? result.translate(-cOpR.x + cOp.scrollLeft, -cOpR.y + cOp.scrollTop) : result;
    }

    /**
     * This method checks that the passed target is visible in all viewports
     * @param {HTMLElement|Event} target The HTML element or Event to check for intersection with all ancestor viewports.
     * @param {Core.helper.util.Rectangle} docRect Window rectangle
     * @param {'contains'|'intersect'} method 'contains' or 'intersect'
     * @returns {Core.helper.util.Rectangle}
     */
    static getViewportIntersection(target, docRect, method) {
        const
            eventTarget   = isElement(target.target) ? target.target : null,
            elementTarget = eventTarget || target,
            viewportRect  = DomHelper.getVisibleViewport(getParent(elementTarget, 1), docRect, elementTarget),
            targetRect    = Rectangle.from(elementTarget, null, true);

        // If an event, the Rectangle is a zero dimension rectangle inside the target
        if (eventTarget) {
            targetRect.translate(target.offsetX, target.offsetY);
            targetRect.height = targetRect.width = 1;
        }
        return viewportRect?.[method]?.(targetRect, false, true);
    }

    static getVisibleViewport(startElement, docRect, targetEl) {
        const { fullscreenElement } = doc;

        let result = docRect,
            add, done, outermostViewport, viewport;

        for (viewport = startElement; !done && viewport && viewport !== doc.body; viewport = getParent(viewport, 1)) {
            // if we climb to the fullscreenElement we stop ascending because that element overlaps higher up elements
            // in the DOM and intersecting with them would falsely reduce the clipping area. We do need to include
            // the fullscreenElement itself.
            if (!(add = done = viewport === fullscreenElement)) {
                // If the element clips, it is a potential clipping viewport
                add = this.isClipping(viewport);
            }

            if (add) {
                const r = Rectangle.client(viewport, null, true, false, targetEl, false);

                // As soon as we hit an element with no dimensions, we're done; there is no visible viewport
                if (!r.height || !r.width) {
                    return false;
                }
                result = result?.intersect(r) || r;
                outermostViewport = viewport;
            }
        }

        if (outermostViewport) {
            result = Rectangle.clipStickies(result, outermostViewport, null, true, targetEl);
        }

        return result;
    }

    /**
     * Returns `true` if the passed element is deeply visible. Meaning it is not hidden using `display`
     * or `visibility` and no ancestor node is hidden.
     * @param {HTMLElement} element The element to test.
     * @returns {Boolean} `true` if deeply visible.
     */
    static isVisible(element) {
        // Use the parentNode function so that we can traverse upwards through shadow DOM
        // to correctly ascertain visibility of nodes in web components.
        let skipVisibility = false;
        for (; element; element = getParent(element)) {
            // Visible if we've reached top of the owning document without finding a hidden Element.
            if (element.nodeType === DOCUMENT_NODE) {
                return true;
            }

            // Skip non-element nodes. For example the shadow root of a custom element. We skip to the host.
            if (element.nodeType === ELEMENT_NODE) {
                const style = element.ownerDocument?.defaultView.getComputedStyle(element);
                skipVisibility = skipVisibility || style.getPropertyValue('visibility') === 'visible';

                // Must not evaluate a shadow DOM's root fragment.
                if (isElement(element) && !isVisible(element, skipVisibility)) {
                    return false;
                }
            }
        }

        // We get here if the node is detached.
        return false;
    }

    /**
     * Returns true if DOM Event instance is passed.
     * @param {*} event
     * @internal
     * @returns {Boolean}
     */
    static isDOMEvent(event) {
        // Cannot use instanceof due to realm mismatches
        return Boolean(event && ('stopImmediatePropagation' in event));
    }

    /**
     * Merges specified source DOM config objects into a `dest` object.
     * @param {DomConfig} dest The destination DOM config object.
     * @param {...DomConfig} sources The DOM config objects to merge into `dest`.
     * @returns {DomConfig} The `dest` object.
     * @internal
     */
    static merge(dest, ...sources) {
        return ObjectHelper.blend(dest, sources, { isObject : isDomObject, merge : mergeChildren });
    }

    /**
     * Updates in-place a DOM config object whose `children` property may be an object instead of the typical array.
     * The keys of such objects become the `reference` property upon conversion.
     *
     * @param {DomConfig} domConfig
     * @param {Function} [namedChildren] A function to call for each named child element.
     * @privateparam {Boolean} [ignoreRefs] Not meant to be manually set, used when recursing.
     * @returns {DomConfig} Returns the altered DOM config
     * @internal
     */
    static normalizeChildren(domConfig, namedChildren, ignoreRefs) {
        let children = domConfig?.children,
            child, i, name, kids, ref;

        // Allow redirecting/opting out of ref ownership in a hierarchy
        if (domConfig?.syncOptions?.ignoreRefs) {
            ignoreRefs = true;
        }

        if (children && !(domConfig instanceof Node)) {
            if (Array.isArray(children)) {
                for (i = 0; i < children.length; ++i) {
                    DH.normalizeChildren(children[i], namedChildren, ignoreRefs);
                }
            }
            else {
                kids = children;

                domConfig.children = children = [];

                for (name in kids) {
                    child = kids[name];

                    if (child?.isWidget) {
                        child = child.element;
                    }

                    // $ prefix indicates element is not a reference:
                    ref = !name.startsWith('$') && !DH.isElement(child);

                    ref && namedChildren?.(name, /* hoist = */!ignoreRefs);

                    if (child) {
                        if (!(child instanceof Node)) {
                            if (child.reference === false) {
                                delete child.reference;
                            }
                            else if (ref && typeof child !== 'string') {
                                child.reference = name;
                            }

                            DH.normalizeChildren(child, namedChildren, ignoreRefs);
                        }

                        children.push(child);
                    }
                }
            }
        }

        return domConfig;
    }

    static roundPx(px, devicePixelRatio = globalThis.devicePixelRatio || 1) {
        const multiplier = 1 / devicePixelRatio;
        return Math.round(px / multiplier) * multiplier;
    }

    // For use when we are dividing a DOM element into even parts. The resulting value
    // must be floored to prevent overflow. But only floored to the device's resolution,
    // so raw Math.floor will not work - it would leave empty space in hi resolution screens.
    static floorPx(px, devicePixelRatio = globalThis.devicePixelRatio || 1) {
        const multiplier = 1 / devicePixelRatio;
        return Math.floor(px * multiplier) / multiplier;
    }

    /**
     * Returns true if element has opened shadow root
     * @param {HTMLElement} element Element to check
     * @returns {Boolean}
     */
    static isCustomElement(element) {
        return Boolean(element?.shadowRoot);
    }

    /**
     * Resolves element from point, checking shadow DOM if required
     * @param {Number} x
     * @param {Number} y
     * @param {Document|ShadowRoot} [root] Root node to resolve from. Defaults to the document. Pass a widget's
     * `documentRoot` to keep hit testing inside its shadow tree (required for LWC / Salesforce).
     * @returns {HTMLElement}
     */
    static elementFromPoint(x, y, root = document) {
        let el = root.elementFromPoint(x, y);

        // Try to check shadow dom if it exists
        if (DH.isCustomElement(el)) {
            el = el.shadowRoot.elementFromPoint(x, y) || el;
        }

        return el;
    }

    /**
     * Resolves child element from point __in the passed element's coordinate space__.
     * @param {HTMLElement} parent The element to find the occupying element in.
     * @param {Number|Core.helper.util.Rectangle.Point} x Either the `X` part of a point, or the point to find.
     * @param {Number} [y] The `Y` part of the point.
     * @returns {HTMLElement}
     * @internal
     */
    static childFromPoint(el, x, y, /* internal */ parent = el) {
        const p = y == null ? x : new Rectangle(x, y, 0, 0);

        let result = null;

        Array.from(el.children).reverse().some(el => {
            if (Rectangle.from(el, parent).contains(p)) {
                // All rectangles must be relative to the topmost el, so that must be
                // passed down as the "parent" of all Rectangles.
                result = (el.children.length) && DH.childFromPoint(el, p, null, parent) || el;
                return true;
            }
        });

        return result;
    }

    /**
     * Converts a name/value pair of a style name and its value into the canonical (hyphenated) name of the style
     * property and a value with the `defaultUnit` suffix appended if no unit is already present in the `value`.
     *
     * For example:
     * ```javascript
     *  const [property, value] = DomHelper.unitize('marginInlineStart', 50);
     *  console.log(property, value);
     * ```
     *
     * ```
     *  > margin-inline-start 50px
     * ```
     * @param {String} name
     * @param {String|Number} value
     * @param {String} [defaultUnit]
     * @returns {String[]}
     * @internal
     */
    static unitize(name, value, defaultUnit = 'px') {
        const [trueName, hasUnits] = canonicalizeStyle(name);

        if (value != null) {
            value = String(value);
            value = (hasUnits && digitsRe.test(value)) ? value + defaultUnit : value;
        }

        return [trueName, value];
    }

    /**
     * Returns active element checking shadow dom too
     * @member {HTMLElement}
     * @readonly
     */
    static get activeElement() {
        //<debug>
        console.warn('Using DomHelper.activeElement will not work in LockerService environment. Use DomHelper.getActiveElement(element) instead, passing any real element in the current scope');
        //</debug>

        let el = document.activeElement;

        while (el.shadowRoot) {
            el = el.shadowRoot.activeElement;
        }

        return el;
    }

    // returns active element for DOM tree / shadow DOM tree to which element belongs
    static getActiveElement(element) {
        if (element?.isWidget) {
            element = element.element;
        }

        // Find the owning root of the element.
        // If element is inside a closed shadow root, we must use that shadow root to find the active element
        // otherwise we will always get the document's active element.
        let r = element?.getRootNode(),
            el = (r?.mode === 'closed' ? r : document).activeElement;

        while (el?.shadowRoot) {
            el = el.shadowRoot.activeElement;
        }

        return el;
    }

    // Returns the visible root (either document.body or a web component shadow root)
    static getRootElement(element) {
        const
            root         = element.getRootNode?.(),
            { nodeType } = root;

        // If the root is a document, return its body.
        // If it is a document fragment, then it is a shadow root, so return that.
        // fall back to using the passed element's owning document body.
        return nodeType === DOCUMENT_NODE ? root.body : nodeType === DOCUMENT_FRAGMENT_NODE ? root : (element.ownerDocument.contains(element) ? element.ownerDocument.body : null);
    }

    // Returns the topmost HTMLElement inside the current context (either document.body or a direct child of a web component shadow root)
    static getOutermostElement(element) {
        const root = element.getRootNode?.();

        if (root?.body) {
            return root?.body;
        }

        // we are in a shadow root
        // parentNode might be null in salesforce
        while (element.parentNode !== root && element.parentNode) {
            element = element.parentNode;
        }

        return element;
    }

    static isValidFloatRootParent(element) {
        // Checking if an element is a BODY using tag name which is supported in Salesforce too
        return element.tagName?.toUpperCase() === 'BODY' ||
            // This one allows `rootElement` configured to LWC container element
            element.getRootNode().nodeType === DOCUMENT_FRAGMENT_NODE;
    }

    /**
     * Returns the `id` of the passed element. Generates a unique `id` if the element does not have one.
     * @param {HTMLElement} element The element to return the `id` of.
     */
    static getId(element) {
        return element.id || (element.id = 'b-element-' + (++idCounter));
    }

    /**
     * Returns common widget/node ancestor for from/to arguments
     * @param {Core.widget.Widget|HTMLElement} from
     * @param {Core.widget.Widget|HTMLElement} to
     * @returns {Core.widget.Widget|HTMLElement}
     * @internal
     */
    static getCommonAncestor(from, to) {
        if (from === to) {
            return from;
        }

        while (from && !(from[from.isWidget ? 'owns' : 'contains']?.(to) || from === to)) {
            // Safeguard against 3rd party elements that have `owner` attribute,
            // and against owner being self in case they also have a `isWidget` attribute
            from = isElement(from) ? getParent(from) : from.owner?.isWidget && from.owner !== from ? from.owner : null;
        }

        return from;
    }

    /**
     * Waits for the specified target element to be visible and in view, and not within an animation.
     *
     * If the specified selector is not immediately visible and outside of any animations, this method
     * will return a Promise which, if the element becomes available in the specified `maxWait`, resolves
     * to the target `HTMLElement`.
     *
     * If the element does not become available after the `maxWait`, the Promise will reject.
     *
     * If the selector ends with `?`, or the `maxWait` is negative, the target element is optional and if not found,
     * `undefined` is returned.
     *
     * @param {String|HTMLElement} target The target element or CSS selector to wait for
     * @param {Number} [maxWait=5000] The maximum time in milliseconds to wait for the target element
     * @param {Number} [waitInterval=100] The interval in milliseconds to check for the target element
     * @returns {HTMLElement|Promise|void} The target element if it is immediately visible
     * and not within an animation. If the target is not immediately available, a Promise that resolves
     * to the target element when it's visible and not within an animation.
     * @ts-returns {HTMLElement|Promise<HTMLElement>|void}
     * @internal
     */
    static waitForSelector(target, maxWait = 5000, waitInterval = 100) {
        if (target != null) {
            const
                optional       = target.endsWith?.('?'),
                resolvedTarget = target.nodeType ? target : document.querySelector(optional ? target.substring(0, target.length - 1) : target);

            if (optional) {
                if (!resolvedTarget) {
                    return;
                }
                if (maxWait > 0) {
                    maxWait = -maxWait;
                }
            }

            // If the target is not found or not visible or within an animation or not in view, wait for it to be visible and in view and static
            if (!resolvedTarget || !DomHelper.isVisible(resolvedTarget) || getAnimatedElements().some(e => e.contains(resolvedTarget)) || !DomHelper.isInView(resolvedTarget, false)) {
                return AsyncHelper.waitFor(() => {
                    const el = resolvedTarget || document.querySelector(target);

                    // Resolve when the element is found and visible and not within an animation and in view
                    if (el && DomHelper.isVisible(el) && !getAnimatedElements().some(e => e.contains(el)) && DomHelper.isInView(el, false)) {
                        return el;
                    }
                }, maxWait, waitInterval);
            }
            return resolvedTarget;
        }
    }

    //region Internal

    /**
     * Internal convenience fn to allow specifying either an element or a CSS selector to retrieve one
     * @private
     * @param {String|HTMLElement} elementOrSelector element or selector to lookup in DOM
     * @returns {HTMLElement}
     */
    static getElement(elementOrSelector) {
        if (typeof elementOrSelector === 'string') {
            return doc.querySelector(elementOrSelector);
        }
        return elementOrSelector;
    }

    /**
     * Sets attributes passed as object to given element
     * @param {String|Element} elementOrSelector
     * @param {Object} attributes
     * @internal
     */
    static setAttributes(elementOrSelector, attributes) {
        const element = DH.getElement(elementOrSelector);

        if (element && attributes) {
            for (const key in attributes) {
                if (attributes[key] == null) {
                    element.removeAttribute(key);
                }
                else {
                    element.setAttribute(key, attributes[key]);
                }
            }
        }
    }

    static toggleAttribute(elementOrSelector, attribute, force) {
        const element = DH.getElement(elementOrSelector);

        if (element) {
            if (element.toggleAttribute) {
                element.toggleAttribute(attribute, force);
            }
            // https://developer.salesforce.com/docs/component-library/tools/locker-service-viewer
            // Locker Service in salesforce does not support toggleAttribute
            else if (force != null) {
                element[force ? 'setAttribute' : 'removeAttribute'](attribute, '');
            }
            else {
                element.hasAttribute(attribute) ? element.removeAttribute(attribute) : element.setAttribute(attribute, '');
            }
        }
    }

    /**
     * Adds the passed string as a space-separated value to the passed attribute in the passed element.
     * @param {String|Element} elementOrSelector The element to manipulate
     * @param {String} attribute The attruibute name
     * @param {String} value The value to add
     */
    static addAttributeValue(elementOrSelector, attribute, value) {
        const element = DH.getElement(elementOrSelector);

        if (element && value) {
            element.setAttribute(attribute, [...new Set(element.getAttribute(attribute)?.split(' ')).add(value)].join(' '));
        }
    }

    /**
     * Removed the passed string as a space-separated value from the passed attribute in the passed element.
     * @param {String|Element} elementOrSelector The element to manipulate
     * @param {String} attribute The attruibute name
     * @param {String} value The value to remove
     */
    static removeAttributeValue(elementOrSelector, attribute, value) {
        const element = DH.getElement(elementOrSelector);

        if (element && value) {
            const values = new Set(element.getAttribute(attribute)?.split(' '));

            values.delete(value);
            values.size ? element.setAttribute(attribute, [...values].join(' ')) : element.removeAttribute(attribute);
        }
    }

    /**
     * Sets a CSS [length](https://developer.mozilla.org/en-US/docs/Web/CSS/length) style value.
     * @param {String|HTMLElement} element The element to set the style in, or, if just the result is required,
     * the style magnitude to return with units added. If a nullish value is passed, an empty string
     * is returned.
     * @param {String} [style] The name of a style property which specifies a [length](https://developer.mozilla.org/en-US/docs/Web/CSS/length)
     * @param {Number|String} [value] The magnitude. If a number is used, the value will be set in `px` units.
     * @returns {String} The style value string.
     */
    static setLength(element, style, value) {
        if (arguments.length === 1) {
            value = typeof element === 'number' ? `${element}px` : element ?? '';
        }
        else {
            element = DH.getElement(element);
            value = element.style[style] = typeof value === 'number' ? `${value}px` : value ?? '';
        }

        return value;
    }

    /**
     * Returns string percentified and rounded value for setting element's height, width etc.
     * @param {String|Number} value percent value
     * @param {Number} digits number of decimal digits for rounding
     * @returns {string} percentified value or empty string if value can not be parsed
     * @internal
     */
    static percentify(value, digits = 2) {
        const mult = Math.pow(10, digits);
        return value == null || value === '' || isNaN(value) ? '' : `${Math.round(value * mult) / mult}%`;
    }

    //endregion

    //region Children, going down...

    /**
     * Gets the first direct child of `element` that matches `selector`.
     * @param {HTMLElement} element Parent element
     * @param {String} selector CSS selector
     * @returns {HTMLElement}
     * @category Query children
     */
    static getChild(element, selector) {
        return element.querySelector(':scope>' + selector);
    }

    /**
     * Checks if `element` has any child that matches `selector`.
     * @param {HTMLElement} element Parent element
     * @param {String} selector CSS selector
     * @returns {Boolean} true if any child matches selector
     * @category Query children
     */
    static hasChild(element, selector) {
        return DH.getChild(element, selector) != null;
    }

    /**
     * Returns all child elements (not necessarily direct children) that matches `selector`.
     *
     * If `selector` starts with `'>'` or `'# '`, then all components of the `selector` must match inside of `element`.
     * The scope selector, `:scope` is prepended to the selector (and if `#` was used, it is removed).
     *
     * These are equivalent:
     *
     *      DomHelper.children(el, '# .foo .bar');
     *
     *      el.querySelectorAll(':scope .foo .bar');
     *
     * These are also equivalent:
     *
     *      DomHelper.children(el, '> .foo .bar');
     *
     *      el.querySelectorAll(':scope > .foo .bar');
     *
     * @param {HTMLElement} element The parent element
     * @param {String} selector The CSS selector
     * @returns {HTMLElement[]} Matched elements, somewhere below `element`
     * @category Query children
     */
    static children(element, selector) {
        // a '#' could be '#id' but '# ' (hash and space) is not a valid selector...
        if (selector[0] === '>' || selector.startsWith('# ')) {
            if (selector[0] === '#') {
                selector = selector.substr(2);
            }

            selector = ':scope ' + selector;
        }

        return Array.from(element.querySelectorAll(selector));
    }

    // Salesforce doesn't yet support childElementCount. So we replace all native usages with this wrapper and
    // override it for salesforce environment.
    // https://github.com/bryntum/bryntum/issues/3008
    static getChildElementCount(element) {
        return element.childElementCount;
    }

    /**
     * Looks at the specified `element` and all of its children for the one that first matches `selector`.
     * @param {HTMLElement} element Parent element
     * @param {String} selector CSS selector
     * @returns {HTMLElement} Matched element, either element or an element below it
     * @category Query children
     */
    static down(element, selector) {
        if (!element) {
            return null;
        }

        if (element.matches?.(selector)) {
            return element;
        }
        selector = ':scope ' + selector;
        return element.querySelector(selector);
    }

    /**
     * Checks if childElement is a descendant of parentElement (contained in it or a sub element)
     * @param {HTMLElement} parentElement Parent element
     * @param {HTMLElement} childElement Child element, at any level below parent (includes nested shadow roots)
     * @returns {Boolean}
     * @category Query children
     */
    static isDescendant(parentElement, childElement) {
        const defaultResult = parentElement.contains(childElement);

        // "contains()" method might fail finding elements in nested ShadowRoot-s (FireFox is know for that)
        // so we have to do extra manual check here
        if (!defaultResult && childElement) {
            const
                parentRoot = DH.getRootElement(parentElement),
                childRoot  = DH.getRootElement(childElement);

            if (childRoot && parentRoot !== childRoot && childRoot.host) {
                return DH.isDescendant(parentRoot, childRoot.host);
            }
        }

        return defaultResult;
    }

    /**
     * Returns the specified element of the given `event`. If the `event` is an `Element`, it is returned. Otherwise,
     * the `eventName` argument is used to retrieve the desired element property from `event` (this defaults to the
     * `'target'` property).
     * @param {Event|Element} event
     * @param {String} [elementName]
     * @returns {Element}
     */
    static getEventElement(event, elementName = 'target') {
        return (!event || DH.isElement(event)) ? event : event[elementName];
    }

    /**
     * Returns `true` if the provided value is _likely_ a DOM element. If the element can be assured to be from the
     * same document, `instanceof Element` is more reliable.
     * @param {*} value
     * @returns {Boolean}
     */
    static isElement(value) {
        return value?.nodeType === ELEMENT_NODE && DH.isNode(value);
    }

    /**
     * Returns `true` if the provided element is an instance of React Element.
     * @param {*} element
     * @returns {Boolean}
     * @internal
     */
    static isReactElement(element) {
        return Boolean(globalThis.bryntum?.react?.isReactElement(element));
    }

    /**
     * Handles the content provided by a React component for the widget.
     * @param {Core.widget.Widget} widget Owner widget
     * @param {*} element React element
     * @internal
     */
    static handleReactElement(widget, element) {
        return Boolean(globalThis.bryntum?.react?.handleReactElement(widget, element));
    }

    /**
     * Handles the React header element by processing JSX content within the widget.
     * @param {Object} column Object containing grid and id properties
     * @param {HTMLElement} headerElement The header element to be processed
     * @param {*} html JSX content to be processed
     * @internal
     */
    static handleReactHeaderElement(column, headerElement, html) {
        return Boolean(globalThis.bryntum?.react?.handleReactHeaderElement(column, headerElement, html));
    }

    /**
     * Returns `true` if the provided configuration object is valid for Vue processing.
     * @param {Object} config
     * @returns {Boolean}
     * @internal
     */
    static isVueConfig(config) {
        return Boolean(globalThis.bryntum?.vue?.isVueConfig(config));
    }

    /**
     * Handles the content provided by a Vue component for the widget.
     * @param {String} html The HTML content to be processed
     * @internal
     */
    static handleVueContent(widget, html) {
        globalThis.bryntum?.vue?.handleVueContent(widget, html);
    }

    /**
     * Returns `true` if the provided value is _likely_ a DOM node. If the node can be assured to be from the same
     * document, `instanceof Node` is more reliable.
     * @param {*} value
     * @returns {Boolean}
     */
    static isNode(value) {
        // cannot use instanceof across frames. Using it here won't help since we'd need the same logic if it were
        // false... meaning we'd have the same chances of a false-positive.
        return Boolean(value) && typeof value.nodeType === 'number' && !isObject(value);
    }

    /**
     * Iterates over each result returned from `element.querySelectorAll(selector)`. Can also be called with only two
     * arguments, in which case the first argument is used as selector and document is used as the element.
     * @param {HTMLElement} element Parent element
     * @param {String} selector CSS selector
     * @param {Function} fn Function called for each found element
     * @category Query children
     */
    static forEachSelector(element, selector, fn) {
        if (typeof element === 'string') {
            // Legacy internal API, no longer valid
            throw new Error('DomHelper.forEachSelector must provide a root element context (for shadow root scenario)');
        }
        DH.children(element, selector).forEach(fn);
    }

    /**
     * Iterates over the direct child elements of the specified element.
     * @param {HTMLElement} element Parent element
     * @param {Function} fn Function called for each child element
     * @category Query children
     */
    static forEachChild(element, fn) {
        Array.from(element.children).forEach(fn);
    }

    /**
     * Removes each element returned from `element.querySelectorAll(selector)`.
     * @param {HTMLElement} element
     * @param {String} selector
     * @category Query children
     */
    static removeEachSelector(element, selector) {
        DH.forEachSelector(element, selector, child => child.remove());
    }

    /**
     * Removes the passed CSS classes from all descendants of the passed element.
     * @param {HTMLElement} element Outermost element
     * @param {...String} classes CSS classes to remove
     */
    static removeClsGlobally(element, ...classes) {
        classes.forEach(cls => DH.forEachSelector(element, '.' + cls, child => child.classList.remove(cls)));
    }

    /**
     * Removes references to application data (`elementData`, DomDataStore data, cached dom configs) from an
     * element and all its descendants. Should be called before permanently detaching a subtree - the browser
     * may keep detached elements alive indefinitely (for example when an element is removed while a CSS
     * animation or transition on it has not finalized), and such pinned elements must not retain application
     * objects like records.
     * @param {HTMLElement} element Outermost element
     * @internal
     */
    static stripNodeData(element) {
        if (element.nodeType === Element.ELEMENT_NODE) {
            element.elementData = element._domData = element.lastDomConfig = element.syncIdMap = null;

            for (const child of element.querySelectorAll('*')) {
                if (child.elementData || child._domData || child.lastDomConfig || child.syncIdMap) {
                    child.elementData = child._domData = child.lastDomConfig = child.syncIdMap = null;
                }
            }
        }
    }

    //endregion

    //region Parents, going up...

    static getAncestor(element, possibleAncestorParents, outerElement = null) {
        let found  = false,
            ancestor,
            parent = element;

        possibleAncestorParents = ArrayHelper.asArray(possibleAncestorParents);

        while ((parent = parent.parentElement)) {
            if (possibleAncestorParents.includes(parent)) {
                found = true;
                break;
            }
            if (outerElement && parent === outerElement) break;
            ancestor = parent;
        }

        if (!found) return null;
        return ancestor || element;
    }

    /**
     * Retrieves all parents to the specified element.
     * @param {HTMLElement} element Element
     * @returns {HTMLElement[]} All parent elements, bottom up
     * @category Query parents
     */
    static getParents(element) {
        const parents = [];

        while (element.parentElement) {
            parents.push(element.parentElement);
            element = element.parentElement;
        }

        return parents;
    }

    //endregion

    //region Creation

    /**
     * Converts the passed id to an id valid for usage as id on a DOM element.
     * @param {String} id
     * @returns {String}
     */
    static makeValidId(id, replaceValue = '') {
        return StringHelper.makeValidDomId(id, replaceValue);
    }

    /**
     * Creates an Element, accepts a {@link #typedef-DomConfig} object. Example usage:
     *
     * ```javascript
     * DomHelper.createElement({
     *   tag         : 'table', // defaults to 'div'
     *   className   : 'nacho',
     *   html        : 'I am a nacho',
     *   children    : [ { tag: 'tr', ... }, myDomElement ],
     *   parent      : myExistingElement // Or its id
     *   style       : 'font-weight: bold;color: red',
     *   dataset     : { index: 0, size: 10 },
     *   tooltip     : 'Yay!',
     *   ns          : 'http://www.w3.org/1999/xhtml'
     * });
     * ```
     *
     * @param {DomConfig} config Element config object
     * @param {Object} [options] An object specifying creation options. If this is a boolean value, it is
     * understood to be the `returnAll` option.
     * @param {Boolean} [options.ignoreRefs] Pass `true` to ignore element references.
     * @param {Boolean} [options.returnAll] Specify true to return all elements & child elements created as an array.
     * @privateparam {HTMLElement} [options.replaceElement] Pass element which will be replaced with a created one
     * @returns {HTMLElement|HTMLElement[]|Object<String,HTMLElement>} Single element or array of elements `returnAll` was set to `true`.
     * If any elements had a `reference` property, this will be an object containing a reference to
     * all those elements, keyed by the reference name.
     * @category Creation
     */
    static createElement(config = {}, options = undefined) {
        let returnAll = options,
            element, i, ignoreChildRefs, ignoreRefOption, ignoreRefs, key, name, value, refOwner, refs, syncIdField;

        if (typeof returnAll === 'boolean') {
            throw new Error('Clean up');
        }
        else if (options) {
            ignoreRefs = options.ignoreRefs;
            refOwner = options.refOwner;
            refs = options.refs;
            returnAll = options.returnAll;
            syncIdField = options.syncIdField;

            if (ignoreRefs) {
                ignoreChildRefs = true;
                ignoreRefs = ignoreRefs !== 'children';
            }
        }

        if (typeof config.parent === 'string') {
            config.parent = document.getElementById(config.parent);
        }

        // nextSibling implies a parent
        const
            parent = config.parent || (config.nextSibling && config.nextSibling.parentNode),
            {
                dataset,
                html,
                reference,
                syncOptions,
                text
            }      = config;

        if (syncOptions) {
            syncIdField = syncOptions.syncIdField || syncIdField;
            ignoreRefOption = syncOptions.ignoreRefs;

            if (ignoreRefOption) {
                ignoreChildRefs = true;
                ignoreRefs = ignoreRefOption !== 'children';

                options = {
                    ...options,
                    ignoreRefs : true
                };
            }
        }

        if (ignoreRefs) {
            refOwner = null;
        }

        if (config.ns) {
            element = doc.createElementNS(config.ns, config.tag || 'svg');
        }
        else {
            element = config.tag === '#fragment' ? doc.createDocumentFragment() : doc.createElement(config.tag || 'div');
        }

        if (text != null) {
            DH.setInnerText(element, text);
        }
        else if (html != null) {
            if (html instanceof DocumentFragment) {
                element.appendChild(html);
            }
            else {
                element.innerHTML = html;
            }
        }

        if (config.tooltip) {
            DH.Widget.attachTooltip(element, config.tooltip);
        }

        if (config.style) {
            DH.applyStyle(element, config.style);
        }

        if (dataset) {
            for (name in dataset) {
                value = dataset[name];

                if (value != null) {
                    element.dataset[name] = value;
                }
            }
        }

        if (parent) {
            this.addChild(parent, element, config.nextSibling);
        }

        if (refOwner) {
            // Tag each element created by the refOwner's id to enable DomSync
            element.$refOwnerId = refOwner.id;
        }

        if (reference && !ignoreRefs) {
            // SalesForce platform does not allow custom attributes, but existing code
            // uses querySelector('[reference]'), so bypass it when we can:
            if (refOwner) {
                element.$reference = reference;

                refOwner.attachRef(reference, element, config);
            }
            else {
                // <remove-on-release>
                // TODO: fixup callers to do the above
                // </remove-on-release>
                if (!refs) {
                    options = { ...options };
                    options.refs = refs = {};
                }

                refs[reference] = element;
                element.setAttribute('data-reference', reference);
            }
        }

        const
            className = config.className || config.class, // matches DomSync
            keys      = Object.keys(config);

        if (className) {
            element.setAttribute('class', DomClassList.normalize(className));
        }

        for (i = 0; i < keys.length; ++i) {
            name = keys[i];
            value = config[name];

            // We have to use setAttribute() for custom attributes to work and this is inline with how DomSync
            // handles attributes. For "expando" properties, however, we have to simply assign them.
            if ((key = elementCreateExpandos[name]) != null) {
                element[key || name] = value;
            }
            else if (!elementCreateProperties[name] && name && value != null) {
                // if (config.ns) {
                //     element.setAttributeNS(config.ns, name, value);
                // }
                // else {
                //     element.setAttribute(name, value);
                // }
                element.setAttribute(name, value);
            }
        }

        // ARIA. In the absence of a defined role or the element being hidden from ARIA,
        // omit unfocusable elements from the accessibility tree.
        if (element.nodeType === ELEMENT_NODE && !config['aria-hidden'] && !('role' in config) && !config.tabIndex && !config.alt && !DomHelper.isFocusable(element, true) && !element.htmlFor) {
            element.setAttribute('role', 'presentation');
        }

        // Mimic the way DomSync issues callbacks as elements are created (needed by TaskBoard to trigger custom
        // taskRenderer calls as elements get produced).
        options?.callback?.({
            action        : 'newElement',
            domConfig     : config,
            targetElement : element,
            syncId        : refOwner ? reference : (options.syncIdField && config.dataset?.[options.syncIdField])
        });

        // if returnAll is true, use array
        if (returnAll === true) {
            options.returnAll = returnAll = [element];
        }
        // if it already is an array, add to it (we are probably a child)
        else if (Array.isArray(returnAll)) {
            returnAll.push(element);
        }

        if (config.children) {
            if (syncIdField) {
                // Map syncId -> child element to avoid querying dom later on
                element.syncIdMap = {};
            }

            ArrayHelper.asArray(config.children).forEach(child => {
                // Skip null children, convenient to allow those for usage with Array.map()
                if (child) {
                    // Append string children as text nodes
                    if (typeof child === 'string') {
                        const textNode = document.createTextNode(child);

                        if (refOwner) {
                            textNode.$refOwnerId = refOwner.id;
                        }

                        element.appendChild(textNode);
                    }
                    else if (this.isReactElement(child)) {
                        options?.reactCallback?.({
                            jsx           : child,
                            domConfig     : config,
                            targetElement : element
                        });
                    }
                    // Just append Elements directly.
                    else if (isNaN(child.nodeType)) {
                        child.parent = element;

                        if (!child.ns && config.ns) {
                            child.ns = config.ns;
                        }

                        const
                            childElement = DH.createElement(child, {
                                ...options,
                                ignoreRefs : config.syncOptions?.ignoreRef ?? ignoreChildRefs
                            }),
                            syncId       = child.dataset?.[syncIdField];

                        // syncId is used with DomHelper.sync to match elements. Populate a map here to make finding them faster
                        if (syncId != null) {
                            element.syncIdMap[syncId] = childElement;
                        }

                        // Do not want to alter the initial config
                        delete child.parent;
                    }
                    else {
                        element.appendChild(child);
                    }
                }
            });
        }

        // Store used config, to be able to compare on sync to determine if changed without hitting dom
        element.lastDomConfig = config;

        const result = refs || returnAll || element;

        if (config.replaceElement) {
            config.replaceElement.replaceWith(result);
        }

        // If references were used, return them in an object
        // If returnAll was specified, return the array
        // By default, return the root element
        return result;
    }

    /**
     * Create element(s) from a template (html string). Note that
     * `textNode`s are discarded unless the `raw` option is passed
     * as `true`.
     *
     * If the template has a single root element, then the single element will be returned
     * unless the `array` option is passed as `true`.
     *
     * If there are multiple elements, then an Array will be returned.
     *
     * @param {String} template The HTML string from which to create DOM content
     * @param {Object} [options] An object containing properties to modify how the DOM is created and returned.
     * @param {Boolean} [options.array] `true` to return an array even if there's only one resulting element.
     * @param {Boolean} [options.raw] Return all child nodes, including text nodes.
     * @param {Boolean} [options.fragment] Return a DocumentFragment.
     * @private
     */
    static createElementFromTemplate(template, options = emptyObject) {
        const {
            array,
            raw,
            fragment
        } = options;
        let result;

        // Use template by preference if it exists. It's faster on most supported platforms
        // https://jsperf.com/domparser-vs-template/
        if (DH.supportsTemplate) {
            (templateElement || (templateElement = doc.createElement('template'))).innerHTML = template;

            result = templateElement.content;
            if (fragment) {
                // The template is reused, so therefore is its fragment.
                // If we release the fragment to a caller, it must be a clone.
                return result.cloneNode(true);
            }
        }
        else {
            result = (htmlParser || (htmlParser = new DOMParser())).parseFromString(template, 'text/html').body;

            // We must return a DocumentFragment.
            // myElement.append(fragment) inserts the contents of the fragment, not the fragment itself.
            if (fragment) {
                const nodes = result.childNodes;
                result = document.createDocumentFragment();
                while (nodes.length) {
                    result.appendChild(nodes[0]);
                }
                return result;
            }
        }

        // Raw means all child nodes are returned
        if (raw) {
            result = result.childNodes;
        }
        // Otherwise, only element nodes
        else {
            result = result.children;
        }

        return result.length === 1 && !array ? result[0] : arraySlice.call(result);
    }

    /**
     * Dispatches a MouseEvent of the passed type to the element at the visible centre of the passed element.
     * If the element is not in view, the event is not dispatched.
     * @param {HTMLElement} targetElement The element whose center receives the mouse event.
     * @param {String} [type=contextmenu] The mouse event type to dispatch.
     * @param {Object} [props] Additional properties to set on the event.
     * @returns {MouseEvent} The dispatched event.
     * @internal
     */
    static triggerMouseEvent(targetElement, type = 'contextmenu', props = {}) {
        const
            isInView    = this.isInView(targetElement),
            targetPoint = isInView?.center;

        if (isInView) {
            const result = new globalThis[`${type.startsWith('pointer') ? 'PointerEvent' : 'MouseEvent'}`](type, {
                clientX : targetPoint.x,
                clientY : targetPoint.y,
                offsetX : isInView.width / 2,
                offsetY : isInView.height / 2,
                bubbles : true,
                ...props
            });
            targetElement.dispatchEvent(result);
            return result;
        }
    }

    /**
     * Inserts an `element` at first position in `into`.
     * @param {HTMLElement} into Parent element
     * @param {HTMLElement} element Element to insert, or an element config passed on to createElement()
     * @returns {HTMLElement}
     * @category Creation
     */
    static insertFirst(into, element) {
        if (element && element.nodeType !== ELEMENT_NODE && element.tag) {
            element = DH.createElement(element);
        }
        return into.insertBefore(element, into.firstElementChild);
    }

    /**
     * Inserts an `element` before `beforeElement` in `into`.
     * @param {HTMLElement} into Parent element
     * @param {HTMLElement} element Element to insert, or an element config passed on to createElement()
     * @param {HTMLElement} beforeElement Element before which passed element should be inserted
     * @returns {HTMLElement}
     * @category Creation
     */
    static insertBefore(into, element, beforeElement) {
        if (element && element.nodeType !== ELEMENT_NODE && element.tag) {
            element = DH.createElement(element);
        }
        return beforeElement ? into.insertBefore(element, beforeElement) : DH.insertFirst(into, element);
    }

    static insertAt(parentElement, newElement, index) {
        const siblings = Array.from(parentElement.children);

        if (index >= siblings.length) {
            return DH.append(parentElement, newElement);
        }

        const beforeElement = siblings[index];

        return DH.insertBefore(parentElement, newElement, beforeElement);
    }

    /**
     * Empties a DOM `Range`. Overridable hook: Salesforce LWS distorts `Range.deleteContents` to `undefined`.
     * See https://github.com/bryntum/bryntum/issues/13651
     * @param {Range} range The DOM Range to empty
     * @internal
     * @category Creation
     */
    static emptyRange(range) {
        // eslint-disable-next-line bryntum/no-salesforce-unsupported-methods -- native default; Salesforce overrides this method (DomHelperOverrideRange)
        range.deleteContents();
    }

    /**
     * Appends element to parentElement.
     * @param {HTMLElement} parentElement Parent element
     * @param {HTMLElement|DomConfig|String} elementOrConfig Element to insert, or an element config passed on to
     * `createElement()`, or an HTML string passed to `createElementFromTemplate()`
     * @returns {HTMLElement}
     * @category Creation
     */
    static append(parentElement, elementOrConfig) {
        if (elementOrConfig.forEach) {
            // Ensure all elements of an Array are HTMLElements.
            // The other implementor of forEach is a NodeList which needs no conversion.
            if (Array.isArray(elementOrConfig)) {
                elementOrConfig = elementOrConfig.map(elementOrConfig => elementOrConfigToElement(elementOrConfig));
            }
            if (parentElement.append) {
                parentElement.append(...elementOrConfig);
            }
            else {
                const docFrag = document.createDocumentFragment();

                elementOrConfig.forEach(function(child) {
                    docFrag.appendChild(child);
                });

                parentElement.appendChild(docFrag);
            }
            return elementOrConfig;
        }
        else {
            return parentElement.appendChild(elementOrConfigToElement(elementOrConfig));
        }
    }

    //endregion

    //region Get position

    /**
     * Returns the `x` from the element's `translate: x y` value in pixels.
     * @param {HTMLElement} element
     * @returns {Number} X translate
     * @category Position, get
     */
    static getTranslateX(element) {
        let { style } = element;

        if (!style.translate) {
            style = getComputedStyle(element);
        }

        if (style.translate === 'none') {
            return 0;
        }

        return parseFloat(style.translate?.split(' ')[0] || 0);
    }

    /**
     * Returns the `y` from the element's `translate: x y` value in pixels.
     * @param {HTMLElement} element
     * @returns {Number} Y coordinate
     * @category Position, get
     */
    static getTranslateY(element) {
        let { style } = element;

        if (!style.translate) {
            style = getComputedStyle(element);
        }

        if (style.translate === 'none') {
            return 0;
        }

        return parseFloat(style.translate?.split(' ')[1] || 0);
    }

    /**
     * Gets both X and Y coordinates as an array [x, y]
     * @param {HTMLElement} element
     * @returns {Number[]} [x, y]
     * @category Position, get
     */
    static getTranslateXY(element) {
        return [DH.getTranslateX(element), DH.getTranslateY(element)];
    }

    /**
     * Get elements X offset within a containing element
     * @param {HTMLElement} element
     * @param {HTMLElement} container
     * @returns {Number} X offset
     * @category Position, get
     */
    static getOffsetX(element, container = null) {
        return container ? element.getBoundingClientRect().left - container.getBoundingClientRect().left : element.offsetLeft;
    }

    /**
     * Get elements Y offset within a containing element
     * @param {HTMLElement} element
     * @param {HTMLElement} container
     * @returns {Number} Y offset
     * @category Position, get
     */
    static getOffsetY(element, container = null) {
        return container ? element.getBoundingClientRect().top - container.getBoundingClientRect().top : element.offsetTop;
    }

    /**
     * Gets elements X and Y offset within containing element as an array [x, y]
     * @param {HTMLElement} element
     * @param {HTMLElement} container
     * @returns {Number[]} [x, y]
     * @category Position, get
     */
    static getOffsetXY(element, container = null) {
        return [DH.getOffsetX(element, container), DH.getOffsetY(element, container)];
    }

    /**
     * Get elements X position on page
     * @param {HTMLElement} element
     * @returns {Number}
     * @category Position, get
     */
    static getPageX(element) {
        return element.getBoundingClientRect().left + win.pageXOffset;
    }

    /**
     * Get elements Y position on page
     * @param {HTMLElement} element
     * @returns {Number}
     * @category Position, get
     */
    static getPageY(element) {
        return element.getBoundingClientRect().top + win.pageYOffset;
    }

    /**
     * Returns extremal (min/max) size (height/width) of the element in pixels
     * @param {HTMLElement} element
     * @param {String} style minWidth/minHeight/maxWidth/maxHeight
     * @returns {Number}
     * @internal
     */
    static getExtremalSizePX(element, style) {
        const
            prop    = StringHelper.hyphenate(style),
            measure = prop.split('-')[1];

        let value = DH.getStyleValue(element, prop);

        if (/%/.test(value)) {
            // Element might be detached from DOM
            if (element.parentElement) {
                value = parseInt(DH.getStyleValue(element.parentElement, measure), 10);
            }
            else {
                value = NaN;
            }
        }
        else {
            value = parseInt(value, 10);
        }

        return value;
    }

    //endregion

    //region Set position

    /**
     * Set element's `scale`.
     * @param {HTMLElement} element
     * @param {Number} scaleX The value by which the element should be scaled in the X axis (0 to 1)
     * @param {Number} [scaleY] The value by which the element should be scaled in the Y axis (0 to 1).
     * Defaults to `scaleX`
     * @category Position, set
     * @internal
     */
    static setScale(element, scaleX, scaleY = scaleX) {
        element.style.scale = `${scaleX} ${scaleY}`;
    }

    /**
     * Set element's `X` translation in pixels (keepin `Y` translation as is).
     * @param {HTMLElement} element
     * @param {Number} x The value by which the element should be translated from its default position.
     * @category Position, set
     */
    static setTranslateX(element, x) {
        // Round to avoid blurry text on non-retina displays
        element.style.translate = `${DH.roundPx(x)}px ${DH.getTranslateY(element)}px`;
    }

    /**
     * Set element's `Y` translation in pixels (keeping `X` translation as is).
     * @param {HTMLElement} element
     * @param {Number} y  The value by which the element should be translated from its default position.
     * @category Position, set
     */
    static setTranslateY(element, y) {
        // Round to avoid blurry text on non-retina displays
        element.style.translate = `${DH.getTranslateX(element)}px ${DH.roundPx(y)}px`;
    }

    /**
     * Set element's style `top`.
     * @param {HTMLElement} element
     * @param {Number|String} y The top position. If numeric, `'px'` is used as the unit.
     * @category Position, set
     */
    static setTop(element, y) {
        DH.setLength(element, 'top', y);
    }

    /**
     * Set element's style `left`.
     * @param {HTMLElement} element
     * @param {Number|String} x The top position. If numeric, `'px'` is used as the unit.
     * @category Position, set
     */
    static setLeft(element, x) {
        DH.setLength(element, 'left', x);
    }

    static setTopLeft(element, y, x) {
        DH.setLength(element, 'top', y);
        DH.setLength(element, 'left', x);
    }

    static setTopInsetInlineStart(element, y, x) {
        DH.setLength(element, 'top', y);
        DH.setLength(element, 'inset-inline-start', x);
    }

    static setRect(element, {
        x,
        y,
        width,
        height
    }) {
        DH.setTopInsetInlineStart(element, y, x);
        DH.setLength(element, 'width', width);
        DH.setLength(element, 'height', height);
    }

    /**
     * Set elements `X` and `Y` translation in pixels.
     * @param {HTMLElement} element
     * @param {Number} [x] The `X translation.
     * @param {Number} [y] The `Y translation.
     * @category Position, set
     */
    static setTranslateXY(element, x, y) {
        if (x == null) {
            x = DH.getTranslateX(element);
        }
        if (y == null) {
            y = DH.getTranslateY(element);
        }

        // Round to avoid blurry text on non-retina displays
        element.style.translate = `${DH.roundPx(x)}px ${DH.roundPx(y)}px`;
    }

    /**
     * Increase `X` translation
     * @param {HTMLElement} element
     * @param {Number} x The number of pixels by which to increase the element's `X` translation.
     * @category Position, set
     */
    static addTranslateX(element, x) {
        DH.setTranslateXY(element, DH.getTranslateX(element) + x, DH.getTranslateY(element));
    }

    /**
     * Increase `Y` position
     * @param {HTMLElement} element
     * @param {Number} y The number of pixels by which to increase the element's `Y` translation.
     * @category Position, set
     */
    static addTranslateY(element, y) {
        DH.setTranslateXY(element, DH.getTranslateX(element), DH.getTranslateY(element) + y);
    }

    /**
     * Increase X position
     * @param {HTMLElement} element
     * @param {Number} x
     * @category Position, set
     */
    static addLeft(element, x) {
        DH.setLeft(element, DH.getOffsetX(element) + x);
    }

    /**
     * Increase Y position
     * @param {HTMLElement} element
     * @param {Number} y
     * @category Position, set
     */
    static addTop(element, y) {
        DH.setTop(element, DH.getOffsetY(element) + y);
    }

    /**
     * Align the passed element with the passed target according to the align spec.
     * @param {HTMLElement} element The element to align.
     * @param {HTMLElement|Core.helper.util.Rectangle} target The target element or rectangle to align to
     * @param {AlignSpec} [alignSpec] See {@link Core.helper.util.Rectangle#function-alignTo} Defaults to `{ align : 't0-t0' }`
     * @param {Boolean} [round=false] Round the calculated Rectangles (for example if dealing with scrolling which
     * is integer based).
     * @param {String} [method=translate] The method to use to align the element. Can be `translate`, `topLeft` or `topInset`.
     */
    static alignTo(element, target, alignSpec = t0t0, round = false, method = 'translate') {
        target = (target instanceof Rectangle) ? target : Rectangle.from(target, true);

        const
            elRect = Rectangle.from(element, true);

        if (round) {
            elRect.roundPx();
            target.roundPx();
        }

        const targetRect = elRect.alignTo(Object.assign(alignSpec, {
            target
        }));

        if (method === 'topInset') {
            const elXY = [parseInt(element.style.insetInlineStart || 0, 10), parseInt(element.style.top || 0, 10)];
            DH.setTopInsetInlineStart(element, elXY[1] + targetRect.y - elRect.y, elXY[0] + targetRect.x - elRect.x);
        }
        else if (method === 'topLeft') {
            const elXY = [parseInt(element.style.left || 0, 10), parseInt(element.style.top || 0, 10)];
            DH.setTopLeft(element, elXY[1] + targetRect.y - elRect.y, elXY[0] + targetRect.x - elRect.x);
        }
        else {
            const elXY = DH.getTranslateXY(element);
            DH.setTranslateXY(element, elXY[0] + targetRect.x - elRect.x, elXY[1] + targetRect.y - elRect.y);
        }
    }

    //endregion

    //region Styles & CSS

    /**
     * Returns a style value or values for the passed element.
     * @param {HTMLElement} element The element to read styles from
     * @param {String|String[]} propName The property or properties to read
     * @param {Boolean} [inline=false] Pass as `true` to read the element's inline style.
     * Note that this could return inaccurate results if CSS rules apply to this element.
     * @returns {String|Object} The value or an object containing the values keyed by the requested property name.
     * @category CSS
     */
    static getStyleValue(element, propName, inline, pseudo) {
        const styles = inline ? element.style : element.ownerDocument.defaultView.getComputedStyle(element, pseudo);

        if (Array.isArray(propName)) {
            const result = {};

            for (const prop of propName) {
                result[prop] = styles.getPropertyValue(StringHelper.hyphenate(prop));
            }

            return result;
        }

        // Use the elements owning view to get the computed style.
        // Ensure the property name asked for is hyphenated.
        // getPropertyValue doesn't work with camelCase
        return styles.getPropertyValue(StringHelper.hyphenate(propName));
    }

    static parsePx(computedStyleOrElement, prop) {
        if (computedStyleOrElement instanceof Element) {
            computedStyleOrElement = getComputedStyle(computedStyleOrElement);
        }

        const value = computedStyleOrElement.getPropertyValue(prop);

        if (value.endsWith('em')) {
            throw new Error('Trying to parse em value instead of px');
        }

        return parseFloat(value);
    }

    /**
     * Returns an object with the parse style values for the top, right, bottom, and left
     * components of the given edge style.
     *
     * The return value is an object with `top`, `right`, `bottom`, and `left` properties
     * for the respective components of the edge style, as well as `width` (the sum of
     * `left` and `right`) and `height` (the sum of `top` and `bottom`).
     *
     * @param {HTMLElement} element
     * @param {String} edgeStyle The element's desired edge style such as 'padding', 'margin',
     * or 'border'.
     * @param {String} [edges='trbl'] A string with one character codes for each edge. Only
     * those edges will be populated in the returned object. By default, all edges will be
     * populated.
     * @returns {Object}
     */
    static getEdgeSize(element, edgeStyle, edges) {
        const
            suffix = (edgeStyle === 'border') ? '-width' : '',
            ret    = {
                raw : {}
            };

        for (const edge of ['top', 'right', 'bottom', 'left']) {
            if (!edges || edges.includes(edge[0])) {
                // This produces px units even if the provided style is em or other (i.e.,
                // getComputedStyle normalizes this):
                ret[edge] = parseFloat(
                    ret.raw[edge] = DH.getStyleValue(element, `${edgeStyle}-${edge}${suffix}`)
                );
            }
        }

        // These may not even be requested (based on "edges") but conditional code here
        // would be wasted since the caller would still need to know not to use them...
        // Replace NaN with 0 to keep calculations correct if they only asked for one side.
        ret.width = (ret.left || 0) + (ret.right || 0);
        ret.height = (ret.top || 0) + (ret.bottom || 0);

        return ret;
    }

    /**
     * Splits a style string up into object form. For example `'font-weight:bold;font-size:150%'`
     * would convert to
     *
     * ```javascript
     * {
     *     font-weight : 'bold',
     *     font-size : '150%'
     * }
     * ```
     * @param {String} style A DOM style string
     * @returns {Object} the style declaration in object form.
     */
    static parseStyle(style) {
        if (typeof style === 'string') {
            const styles = style.split(semicolonRe);

            style = {};
            for (let i = 0, { length } = styles; i < length; i++) {
                const propVal = styles[i].split(colonRe);

                style[propVal[0]] = propVal[1];
            }
        }
        return style || {};
    }

    /**
     * Applies specified style to the passed element. Style can be an object or a string.
     *
     * ```javascript
     * DomHelper.applyStyle(element, 'border: 1px solid black');
     *
     * DomHelper.applyStyle(element, {
     *     border : '1px solid black',
     *     width  : 100,  // px is added for length properties
     *     color  : null  // removes the property
     * });
     * ```
     *
     * @param {HTMLElement} element Target element
     * @param {CSSStyleConfig} style Style to apply
     * @param {Boolean} [overwrite] Specify `true` to replace style instead of applying changes
     * @category CSS
     */
    static applyStyle(element, style, overwrite = false) {
        if (typeof style === 'string') {
            if (overwrite) {
                // Only assign if either end has any styles, do not want to add empty `style` tag on element
                if (style.length || element.style.cssText.length) {
                    element.style.cssText = style;
                }
            }
            else {
                // Add style so as not to delete configs in style such as width, height, flex etc.
                // If a style is already there, the newest, appended one will take precedence.
                element.style.cssText += style;
            }
        }
        // Live CSSStyleDeclaration, copy its declared properties only. Iterating it with for-in would also visit
        // every empty property, and in Firefox an empty shorthand (font) is visited after its longhands (fontSize),
        // wiping them out
        else if (typeof CSSStyleDeclaration !== 'undefined' && style instanceof CSSStyleDeclaration) {
            if (overwrite) {
                element.style.cssText = style.cssText;
            }
            else {
                element.style.cssText += style.cssText;
            }
        }
        else if (style) {
            if (overwrite) {
                element.style.cssText = '';
                //element.removeAttribute('style');
            }

            // Has a sub-style block in object form? Use it to override style block
            if (style.style && typeof style.style !== 'string') {
                style = ObjectHelper.assign({}, style, style.style);
            }

            let key, value;

            // Prototype chained objects may be passed, so use direct loop.
            for (key in style) {
                // Ignore readonly properties of the CSSStyleDeclaration object:
                // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration
                // Also ignores sub-style blocks, which are applied above
                if (!styleIgnoreProperties[key]) {
                    [key, value] = DH.unitize(key, style[key]);

                    // Cannot use element.style[key], won't work with CSS vars
                    if (value == null) {
                        element.style.removeProperty(key);
                    }
                    else {
                        element.style.setProperty(key, value);
                    }
                }
            }

            // Has sub-styles as string? Add to cssText after applying style block, to override it
            if (style.style && typeof style.style === 'string') {
                element.style.cssText += style.style;
            }
        }
    }

    static getCSSText(style) {
        if (typeof style === 'string') {
            return style;
        }

        let cssText = '';

        for (const key in style) {
            // Ignore readonly properties of the CSSStyleDeclaration object:
            // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration
            if (!styleIgnoreProperties[key]) {
                cssText += `${StringHelper.hyphenate(key)}:${style[key]};`;
            }
        }

        return cssText;
    }

    /**
     * Adds or removes the `classes` contained in the specified object based on the truthy or falsy value of that key.
     *
     * For example:
     * ```javascript
     *  DomHelper.assignClasses(element, {
     *      'b-class-one' : 1   // class will be added
     *      'b-class-two' : 0   // class will be removed
     *  });
     * ```
     * @param {HTMLElement} element
     * @param {Object} classes An object whose truthy keys will be added as classes and whose falsy keys will be removed.
     * @category CSS
     */
    static assignClasses(element, classes) {
        // be sure to handle config values which leverage prototype chains
        ObjectHelper.forEach(classes, (val, cls) => element.classList.toggle(cls, Boolean(val)));
    }

    /**
     * Toggle multiple classes in elements classList. Helper for toggling multiple classes at once.
     * @param {HTMLElement} element
     * @param {String[]} classes
     * @param {Boolean} [force] Specify true to add classes, false to remove. Leave blank to toggle
     * @category CSS
     */
    static toggleClasses(element, classes, force = null) {
        classes = ArrayHelper.asArray(classes);

        if (force === true) {
            element.classList.add(...classes);
        }
        else if (force === false) {
            element.classList.remove(...classes);
        }
        else {
            classes.forEach(cls => element.classList.toggle(cls));
        }
    }

    /**
     * Adds a CSS class to an element during the specified duration
     * @param {HTMLElement} element Target element
     * @param {String} cls CSS class to add temporarily
     * @param {Number} duration Duration in ms, 0 means cls will not be applied
     * @param {Core.mixin.Delayable|Window} [delayable] The delayable to tie the setTimeout call to
     * @ts-param delayable {DelayableClass|Window}
     * @privateparam {String} [name] Timer name
     * @category CSS
     */
    static addTemporaryClass(element, cls, duration, delayable = globalThis, name = cls, cancelOutstanding = true) {
        element.classList.add(cls);
        if (duration) {
            if (delayable === globalThis) {
                delayable.setTimeout(() => element?.classList.remove(cls), duration);
            }
            else {
                delayable.setTimeout({
                    fn    : cls => element.classList.remove(cls),
                    delay : duration,
                    name,
                    args  : [cls],
                    cancelOutstanding
                });
            }
        }
        else {
            AsyncHelper.queueMicrotask(() => element.classList.remove(cls));
        }
    }

    /**
     * Reads computed style from the element and returns transition duration for a given property in milliseconds
     * @param {HTMLElement} element Target DOM element
     * @param {String} property Animated property name, or '*' to get duration of first transition
     * @returns {Number} Duration in ms
     * @internal
     */
    static getPropertyTransitionDuration(element, property) {
        const
            style      = globalThis.getComputedStyle(element),
            properties = style.transitionProperty.split(', '),
            durations  = style.transitionDuration.split(', ');

        // '*' matches any transition — return the first duration
        if (property === '*') {
            return durations[0] ? parseFloat(durations[0]) * 1000 : undefined;
        }

        const index = properties.indexOf(StringHelper.hyphenate(property));

        if (index !== -1) {
            // Get floating value of transition duration in seconds and convert into milliseconds.
            // It is valid to have a single transition duration for multiple properties, so if there is only one
            // duration specified, use it for all properties.
            return parseFloat(durations.length === 1 ? durations[0] : durations[index]) * 1000;
        }

        return null;
    }

    /**
     * Reads computed style from the element and returns the animation duration for any
     * attached animation in milliseconds
     * @param {HTMLElement} element Target DOM element
     * @returns {Number} Duration in ms
     * @internal
     */
    static getAnimationDuration(element) {
        return parseFloat(DH.getStyleValue(element, 'animation-duration')) * 1000;
    }

    /**
     * Returns element animations
     * @param {Element|Document} element
     * @param {*} args
     * @returns {Array}
     */
    // getAnimations is not supported by Salesforce Locker Service. We override this method for Salesforce environment
    // https://developer.salesforce.com/docs/component-library/tools/locker-service-viewer
    static getAnimations(element, ...args) {
        // eslint-disable-next-line bryntum/no-salesforce-unsupported-methods -- Salesforce-safe wrapper; overridden by DomHelperOverride
        return element.getAnimations?.(...args) || [];
    }

    //endregion

    //region Effects

    /**
     * Highlights the passed element or Rectangle according to the theme's highlighting rules.
     * Usually an animated framing effect.
     *
     * The framing effect is achieved by adding the CSS class `b-fx-highlight` which references
     * a `keyframes` animation named `b-fx-highlight-animation`. You may override the animation
     * name referenced, or the animation itself in your own CSS.
     *
     * @param {HTMLElement|Core.helper.util.Rectangle} element The element or Rectangle to highlight.
     */
    static highlight(element, delayable = globalThis) {
        if (element instanceof Rectangle) {
            return element.highlight();
        }
        return new Promise(resolve => {
            delayable.setTimeout(() => {
                const
                    { classList } = element,
                    needsColorize = !classList.contains('b-colorize');

                // b-colorize is needed for the element to access --b-primary-50 used by the animation
                classList.add('b-colorize', 'b-fx-highlight');
                delayable.setTimeout(() => {
                    classList.remove(needsColorize ? 'b-colorize' : '\xa0', 'b-fx-highlight');
                    resolve();
                }, 2000);
            }, 0);
        });
    }

    //endregion

    //region Measuring / Scrollbar

    /**
     * Measures the scrollbar width using a hidden div. Caches result
     * @member {Number} scrollBarWidth
     * @readonly
     * @static
     */
    static get scrollBarWidth() {
        // Ensure the measurement is only done once, when the value is null.
        // Leave measure element in place. It needs to be remeasured when the zoom level is changed
        // which is detected using a window resize listener, so *may* be called frequently.
        if (scrollBarWidth === null) {
            let element = scrollBarMeasureElement;

            if (!element) {
                element = scrollBarMeasureElement = DH.createElement({
                    parent    : doc.documentElement,
                    className : 'b-scrollbar-measure-element',
                    style     : 'position:absolute;top:-9999em;width:100px;height:100px;overflow-y:auto',
                    children  : [{
                        style : 'height:200px'
                    }]
                });

                // Its overflowing child gets the width which the scrollbar leaves, observe it to detect scrollbars
                // being toggled on the platform and the document getting rendered. An overflow:scroll element is not
                // resized when scrollbars are toggled in the platform settings. Not available on all Salesforce
                // platforms
                if (globalThis.ResizeObserver) {
                    new ResizeObserver(onScrollBarMeasureElementResize).observe(element.firstChild);
                }
            }
            if (element.parentNode !== doc.documentElement) {
                doc.documentElement.appendChild(element);
            }

            // The measure element has no layout when the document is not rendered, for example in an iframe which is
            // display:none. Report 0 for now, but do not cache it. Without ResizeObserver, a CSS animation which
            // starts when the document gets rendered triggers the measurement
            if (!element.offsetHeight) {
                announcedScrollBarWidth = null;

                if (!globalThis.ResizeObserver && !element.classList.contains('b-measure-when-rendered')) {
                    element.classList.add('b-measure-when-rendered');
                    element.addEventListener('animationstart', onScrollBarMeasureElementResize, { once : true });
                }

                return 0;
            }

            scrollBarWidth = element.offsetWidth - element.firstChild.offsetWidth;
            doc.documentElement.style.setProperty('--bi-scrollbar-width', `${scrollBarWidth}px`);

            if (announcedScrollBarWidth === undefined) {
                announcedScrollBarWidth = scrollBarWidth;
            }
        }

        return scrollBarWidth;
    }

    static get scrollBarPadElement() {
        return {
            className : 'b-yscroll-pad',
            children  : [
                {
                    className : 'b-yscroll-pad-sizer'
                }
            ]
        };
    }

    /**
     * Returns the maximum scroll range the browser can correctly manage. This value is browser-specific and typically
     * in the millions of pixels. This answer is not intended to be a precise value but a safe and reliable value to
     * avoid encountering browser limitations.
     * @member {Number} scrollLimit
     * @readonly
     * @static
     */
    static get scrollLimit() {
        const
            ct        = DH.createElement({
                parent   : document.body,
                style    : 'position:absolute; left:-999px; top:0; width:5px; height:5px',
                children : [
                    {
                        style : 'position:absolute; width:1px; height:1px'
                    }
                ]
            }),
            stretcher = ct.firstElementChild;

        let ht    = 0,
            limit = 20e6;  // so far, all browsers report < 20m

        // We could binary search but instead we do increments of 1 million, because:
        //  - it was observed (in Chromium) that the answer is not 100% consistent (answer ranged from 16m to 19m)
        //  - it is not necessary to use all theoretically possible space, just that we do not exceed the limit
        //  - the decrement loop is far simpler and avoids off-by-ones and rounding issues
        //  - it is easier to use round numbers of millions vs random-looking values produced by binary search
        while (limit > 1e6) {
            stretcher.style.translate = `0 ${limit}px`;
            ct.style.lineHeight = `${ht = 1 - ht}`;  // force layout on each pass to update scrollHeight

            if (ct.scrollHeight >= limit) {  // if browser can scroll to the stretcher element
                break;
            }

            limit -= 1e6;
        }

        // Answers from some runs of a binary search:
        //  Chromium: 17,620,763
        //  Firefox:   8,947,850

        // replace getter so we don't come back here:
        Object.defineProperty(DomHelper, 'scrollLimit', {
            value : limit
        });

        ct.remove();

        return limit;
    }

    /**
     * Resets DomHelper.scrollBarWidth cache, triggering a new measurement next time it is read
     */
    static resetScrollBarWidth() {
        scrollBarWidth = null;
    }

    /**
     * Measures the text width using a hidden div
     * @param {String} text
     * @param {HTMLElement} sourceElement
     * @returns {Number} width
     * @category Measure
     */
    static measureText(text, sourceElement, useHTML = false, parentElement = undefined, remove = false) {
        const offScreenDiv = DH.getMeasureElement(sourceElement, parentElement);

        offScreenDiv[useHTML ? 'innerHTML' : 'innerText'] = text;

        const result = offScreenDiv.clientWidth;
        offScreenDiv.className = '';

        remove && offScreenDiv.parentElement.remove();

        return result;
    }

    /**
     * Measures a relative size, such as a size specified in `em` units for the passed element.
     * @param {String} size The CSS size value to measure.
     * @param {HTMLElement} sourceElement
     * @param {Boolean} [round] Pass true to return exact width, not rounded value
     * @returns {Number} size The size in pixels of the passed relative measurement.
     * @category Measure
     */
    static measureSize(size, sourceElement, round = true) {
        if (!size) {
            return 0;
        }

        if (typeof size === 'number') {
            return size;
        }

        if (!size.length) {
            return 0;
        }

        if (/^\d+(px)?$/.test(size)) {
            return parseInt(size);
        }

        // Shortcut when measuring em and rem units
        // 1em is equal to the computed value of the font-size property of the element on which it is used.
        // See https://www.w3.org/TR/css-values-3/#font-relative-lengths
        if (size.endsWith('em')) {
            if (size.endsWith('rem')) {
                sourceElement = doc.documentElement;
            }
            if (sourceElement) {
                return parseFloat(DomHelper.getStyleValue(sourceElement, 'font-size').replace('px', '') || 0) * parseFloat(size);
            }
        }
        else if (sourceElement) {
            const
                percent           = size.includes?.('%'),
                offScreenDiv      = DH.getMeasureElement(sourceElement, percent ? sourceElement.parentNode : undefined),
                { parentElement } = offScreenDiv;

            offScreenDiv.innerHTML = '';

            // If we are asking for a %age, the offsetParent of the offscreenDiv must
            // be the encapsulating element, not the measureElement
            percent && (parentElement.style.display = 'contents');

            offScreenDiv.style.minWidth = offScreenDiv.style.maxWidth = DH.setLength(size);
            const result = round ? offScreenDiv.offsetWidth : offScreenDiv.getBoundingClientRect().width;
            parentElement.style.display = '';
            offScreenDiv.style.minWidth = offScreenDiv.style.maxWidth = offScreenDiv.className = '';
            return result;
        }

        if (/^\d+em$/.test(size)) {
            return parseInt(size) * DEFAULT_FONT_SIZE;
        }

        return isNaN(size) ? 0 : parseInt(size);
    }

    // parentElement allows measurement to happen inside a specific element, allowing scoped css rules to match
    static getMeasureElement(sourceElement, parentElement) {
        const
            useParentElement = parentElement || doc.body,
            sourceElementStyle = win.getComputedStyle(sourceElement),
            offScreenDiv       = useParentElement.offScreenDiv = useParentElement.offScreenDiv || DH.createElement({
                parent    : useParentElement,
                style     : 'position:fixed;top:-10000px;left:-10000px;',
                className : 'b-measure-element',
                children  : [
                    {
                        style : 'white-space:nowrap;will-change:contents;width:auto;contain:none;' + (parentElement ? '' : 'display:inline-block')
                    }
                ]
            }, { returnAll : true })[1];

        fontProps.forEach(prop => {
            if (offScreenDiv.style[prop] !== sourceElementStyle[prop]) {
                offScreenDiv.style[prop] = sourceElementStyle[prop];
            }
        });
        offScreenDiv.className = sourceElement.className;

        // In case the measure element was moved/removed, re-add it
        if (offScreenDiv.parentElement.parentElement !== useParentElement) {
            useParentElement.appendChild(offScreenDiv.parentElement);
        }

        return offScreenDiv;
    }

    /**
     * Strips the tags from a html string, returning text content.
     *
     * ```javascript
     * DomHelper.stripTags('<div class="custom"><b>Bold</b><i>Italic</i></div>'); // -> BoldItalic
     * ```
     *
     * @internal
     * @param {String} htmlString HTML string
     * @returns {String} Text content
     */
    static stripTags(htmlString) {
        const
            // we need to avoid any kind of evaluation of embedded XSS scripts or "web bugs" (img tags that issue
            // GET requests)
            parser = DH.$domParser || (DH.$domParser = new DOMParser()),
            doc    = parser.parseFromString(htmlString, 'text/html');

        return doc.body.textContent;
    }

    //endregion

    //region Sync

    /**
     * Sync one source element attributes, children etc. to a target element. Source element can be specified as a html
     * string or an actual HTMLElement.
     *
     * NOTE: This function is superseded by {@link Core/helper/DomSync#function-sync-static DomSync.sync()}, which works
     * with DOM configs. For most usecases, use it instead.
     *
     * @param {String|HTMLElement} sourceElement Source "element" to copy from
     * @param {HTMLElement} targetElement Target element to apply to, can also be specified as part of the config object
     * @returns {HTMLElement} Returns the updated targetElement (which is also updated in place)
     */
    static sync(sourceElement, targetElement) {
        if (typeof sourceElement === 'string') {
            if (sourceElement === '') {
                targetElement.innerHTML = '';
                return;
            }
            else {
                sourceElement = DH.createElementFromTemplate(sourceElement);
            }
        }

        DH.performSync(sourceElement, targetElement);

        return targetElement;
    }

    // Internal helper used for recursive syncing
    static performSync(sourceElement, targetElement) {
        // Syncing identical elements is a no-op
        if (sourceElement.outerHTML !== targetElement.outerHTML) {
            DH.syncAttributes(sourceElement, targetElement);
            DH.syncContent(sourceElement, targetElement);
            DH.syncChildren(sourceElement, targetElement);

            return true;
        }
        return false;
    }

    // Attributes as map { attr : value, ... }, either from an html element or from a config
    static getSyncAttributes(element) {
        const
            attributes = {},
            // Attribute names, simplifies comparisons and calls to set/removeAttribute
            names      = [];

        // Extract from element
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            if (attr.specified) {
                const name = attr.name.toLowerCase();
                attributes[name] = attr.value;
                names.push(name);
            }
        }

        return {
            attributes,
            names
        };
    }

    /**
     * Syncs attributes from sourceElement to targetElement.
     * @private
     * @param {HTMLElement} sourceElement
     * @param {HTMLElement} targetElement
     */
    static syncAttributes(sourceElement, targetElement) {
        const
            // Extract attributes from elements (sourceElement might be a config)
            {
                attributes : sourceAttributes,
                names      : sourceNames
            }          = DH.getSyncAttributes(sourceElement),
            {
                attributes : targetAttributes,
                names      : targetNames
            }          = DH.getSyncAttributes(targetElement),
            // Used to ignore data-xx attributes when we will be setting entire dataset
            hasDataset = sourceNames.includes('dataset'),
            // Intersect arrays to determine what needs adding, removing and syncing
            toAdd      = sourceNames.filter(attr => !targetNames.includes(attr)),
            toRemove   = targetNames.filter(attr => !sourceNames.includes(attr) && (!hasDataset || !attr.startsWith('data-'))),
            toSync     = sourceNames.filter(attr => targetNames.includes(attr));

        if (toAdd.length > 0) {
            for (let i = 0; i < toAdd.length; i++) {
                const attr = toAdd[i];

                // Style requires special handling
                if (attr === 'style') {
                    DH.applyStyle(targetElement, sourceAttributes.style, true);
                }
                // So does dataset
                else if (attr === 'dataset') {
                    Object.assign(targetElement.dataset, sourceAttributes.dataset);
                }
                // Other attributes are set using setAttribute (since it calls toString() DomClassList works fine)
                else {
                    targetElement.setAttribute(attr, sourceAttributes[attr]);
                }
            }
        }

        if (toRemove.length > 0) {
            for (let i = 0; i < toRemove.length; i++) {
                targetElement.removeAttribute(toRemove[i]);
            }
        }

        if (toSync.length > 0) {
            for (let i = 0; i < toSync.length; i++) {
                const attr = toSync[i];
                // Set all attributes that has changed, with special handling for style
                if (attr === 'style') {
                    // <remove-on-release>
                    // TODO: Check for changes?
                    // </remove-on-release>
                    DH.applyStyle(targetElement, sourceAttributes.style, true);
                }
                // And dataset
                else if (attr === 'dataset') {
                    // <remove-on-release>
                    // TODO: Any cost to assigning same values?
                    // </remove-on-release>
                    Object.assign(targetElement.dataset, sourceAttributes.dataset);
                }
                // And class, which might be a DomClassList or an config for a DomClassList
                else if (attr === 'class' && (sourceAttributes.class.isDomClassList || typeof sourceAttributes.class === 'object')) {
                    let classList;

                    if (sourceAttributes.class.isDomClassList) {
                        classList = sourceAttributes.class;
                    }
                    else {
                        // <remove-on-release>
                        // TODO: Reuse a single DomClassList?
                        // </remove-on-release>
                        classList = new DomClassList(sourceAttributes.class);
                    }

                    if (!classList.isEqual(targetAttributes.class)) {
                        targetElement.setAttribute('class', classList);
                    }
                }
                else if (targetAttributes[attr] !== sourceAttributes[attr]) {
                    targetElement.setAttribute(attr, sourceAttributes[attr]);
                }
            }
        }
    }

    /**
     * Sync content (innerText) from sourceElement to targetElement
     * @private
     * @param {HTMLElement} sourceElement
     * @param {HTMLElement} targetElement
     */
    static syncContent(sourceElement, targetElement) {
        if (DH.getChildElementCount(sourceElement) === 0) {
            targetElement.innerText = sourceElement.innerText;
        }
    }

    static setInnerText(targetElement, text) {
        // setting firstChild.data is faster than innerText (and innerHTML),
        // but in some cases the inner node is lost and needs to be recreated
        const { firstChild } = targetElement;

        if (firstChild?.nodeType === TEXT_NODE) {
            firstChild.data = text;
        }
        else {
            // textContent is supposed to be faster than innerText, since it does not trigger layout
            targetElement.textContent = text;
        }
    }

    /**
     * Sync traversing children
     * @private
     * @param {HTMLElement} sourceElement Source element
     * @param {HTMLElement} targetElement Target element
     */
    static syncChildren(sourceElement, targetElement) {
        const
            me          = this,
            sourceNodes = arraySlice.call(sourceElement.childNodes),
            targetNodes = arraySlice.call(targetElement.childNodes);

        while (sourceNodes.length) {
            const
                sourceNode = sourceNodes.shift(),
                targetNode = targetNodes.shift();

            // only textNodes and elements allowed (no comments)
            if (sourceNode && sourceNode.nodeType !== TEXT_NODE && sourceNode.nodeType !== ELEMENT_NODE) {
                throw new Error(`Source node type ${sourceNode.nodeType} not supported by DomHelper.sync()`);
            }
            if (targetNode && targetNode.nodeType !== TEXT_NODE && targetNode.nodeType !== ELEMENT_NODE) {
                throw new Error(`Target node type ${targetNode.nodeType} not supported by DomHelper.sync()`);
            }

            if (!targetNode) {
                // out of target nodes, add to target
                targetElement.appendChild(sourceNode);
            }
            else if (sourceNode.nodeType === targetNode.nodeType) {
                // same type of node, take action depending on which type
                if (sourceNode.nodeType === TEXT_NODE) {
                    // text
                    targetNode.data = sourceNode.data;
                }
                else if (sourceNode.tagName === targetNode.tagName) {
                    me.performSync(sourceNode, targetNode);
                }
                else {
                    // new tag, remove targetNode and insert new element
                    targetElement.insertBefore(sourceNode, targetNode);
                    targetNode.remove();
                }
            }
            // Trying to set text node as element, use it as innerText
            // (we get this in FF with store mutations and List)
            else if (sourceNode.nodeType === TEXT_NODE && targetNode.nodeType === ELEMENT_NODE) {
                targetElement.innerText = sourceNode.data.trim();
            }
            else {
                const logElement = sourceNode.parentElement || sourceNode;
                throw new Error(`Currently no support for transforming nodeType.\n${logElement.outerHTML}`);
            }
        }

        // Out of source nodes, remove remaining target nodes
        targetNodes.forEach(targetNode => {
            targetNode.remove();
        });
    }

    /**
     * Replaces the passed element's `className` with the class names
     * passed in either Array or String format or Object.
     *
     * This method compares the existing class set with the incoming class set and
     * avoids mutating the element's class name set if possible.
     *
     * This can avoid browser style invalidations.
     * @param {HTMLElement} element The element whose class list to synchronize.
     * @param {String[]|String|Object} newClasses The incoming class names to set on the element.
     * @returns {Boolean} `true` if the DOM class list was changed.
     * @category CSS
     */
    static syncClassList(element, newClasses) {
        const
            { classList } = element,
            isString      = typeof newClasses === 'string',
            newClsArray   = isString ? newClasses.split(whiteSpaceRe) : DomClassList.normalize(newClasses, 'array'),
            classCount    = newClsArray.length;

        let changed = classList.length !== classCount,
            i;

        // If the incoming and existing class lists are the same length
        // then check that each contains the same names. As soon as
        // we find a non-matching name, we know we have to update the
        // className.
        for (i = 0; !changed && i < classCount; i++) {
            //<debug>
            // Protect against IE throwing difficult to debug illegalCharacter errors
            // by validating that no className contains spaces.
            if (newClsArray[i].match(whiteSpaceRe)) {
                throw new Error(`Illegal space character detected in CSS className ${newClsArray[i]}`);
            }
            //</debug>
            changed = !classList.contains(newClsArray[i]);
        }

        if (changed) {
            element.className = isString ? newClasses : newClsArray.join(' ');
        }
        return changed;
    }

    /**
     * Applies the key state of the passed object or DomClassList to the passed element.
     *
     * Properties with a falsy value mean that property name is *removed* as a class name.
     *
     * Properties with a truthy value mean that property name is *added* as a class name.
     *
     * This is different from {@link #function-syncClassList-static}. That sets the `className` of the element to the
     * sum of all its truthy keys, regardless of what the pre-existing value of the `className` was, and ignoring falsy
     * keys.
     *
     * This _selectively_ updates the classes in the `className`. If there is a truthy key, the name is added. If there
     * is a falsy key, the name is removed.
     * @param {HTMLElement} element The element to apply the class list to .
     * @param {Object|Core.helper.util.DomClassList} classes The classes to add or remove.
     * @returns {Boolean} `true` if the DOM class list was changed.
     * @category CSS
     */
    static updateClassList(element, classes) {
        const { classList } = element;
        let cls, add, changed = false;

        for (cls in classes) {
            add = Boolean(classes[cls]);

            if (classList.contains(cls) !== add) {
                classList[add ? 'add' : 'remove'](cls);
                changed = true;
            }
        }
        return changed;
    }

    /**
     * Changes the theme to the passed theme name if possible.
     *
     * Theme names are case-insensitive. The `href` used is all lower case.
     *
     * To use this method, the `<link rel="stylesheet">` _must_ use the default, Bryntum-supplied CSS files where the
     * `href` end with `<themeName>.css`, so that it can be found in the document, and switched out for a new link with
     * the modified `href`. The new `href` will use the same path, just with the `themeName` portion substituted for
     * the new name.
     *
     * If no `<link>` with that name pattern can be found, an error will be thrown.
     *
     * If you use this method, you  must ensure that the theme files are all accessible on your server.
     *
     * Because this is an asynchronous operation, a `Promise` is returned. The theme change event is passed to the
     * success function. If the theme was not changed, because the theme name passed is the current theme, nothing is
     * passed to the success function.
     *
     * The theme change event contains two properties:
     *
     *  - `prev` The previous Theme name.
     *  - `theme` The new Theme name.
     *
     * A pinned {@link #property-colorScheme-static} survives the switch, so the incoming theme renders in the mode
     * the user pinned. Applying a theme whose filename ends in `-light` or `-dark` clears the pin instead, since
     * such a theme renders one fixed mode of its own.
     *
     * @param {String} newThemeName the name of the theme that should be applied
     * @returns {Promise} A promise whose success callback receives the theme change event if the theme in fact changed.
     * If the theme `href` could not be loaded, the failure callback is called, passing the error event caught.
     * @async
     */
    static setTheme(newThemeName) {
        // newThemeName = newThemeName.toLowerCase();
        const
            { head }          = document,
            // Use the link href as the authoritative source for oldThemeName — CSS vars may be
            // stale or unreadable in shadow DOM contexts (e.g. Angular ViewEncapsulation.ShadowDom)
            existingThemeLink = head.querySelector('link[data-bryntum-theme]:not([data-loading])');

        let oldThemeName = '';
        if (existingThemeLink?.href) {
            const match = new URL(existingThemeLink.href).pathname.match(themeFilenameRe);
            oldThemeName = match?.[1] ?? '';
        }
        if (!oldThemeName) {
            oldThemeName = DH.getThemeInfo().filename;
        }

        // Only include href* selector when oldThemeName is non-empty (empty string matches everything)
        let oldThemeLinks = head.querySelectorAll(
                oldThemeName
                    ? `[data-bryntum-theme]:not([data-loading]), link[href*="${CSS.escape(oldThemeName)}"]`
                    : '[data-bryntum-theme]:not([data-loading])'
            ),
            loaded        = 0;

        // Nothing changes, so the pin the page already renders with is left alone
        if (oldThemeName === newThemeName) {
            return immediatePromise;
        }

        // Remove any links currently loading
        DH.removeEachSelector(head, '#bryntum-theme[data-loading],link[data-bryntum-theme][data-loading]');

        const themeEvent = {
            theme : newThemeName,
            prev  : oldThemeName
        };

        function replaceTheme(oldThemeLink, resolve, reject) {
            document.body.classList.add('b-theme-transition');

            const newThemeLink = DH.createElement({
                tag     : 'link',
                rel     : 'stylesheet',
                dataset : {
                    loading      : true,
                    bryntumTheme : true
                },
                href : oldThemeName
                    ? oldThemeLink.href.replace(oldThemeName, newThemeName)
                    : oldThemeLink.href.replace(/[^/?]+(?=\.css(?:\?|$))/, newThemeName),
                nextSibling : oldThemeLink
            });

            newThemeLink.addEventListener('load', () => {
                delete newThemeLink.dataset.loading;
                themeInfo = null;
                // Flip all products to the new theme at the same time
                if (++loaded === oldThemeLinks.length) {
                    oldThemeLinks.forEach(link => link.remove());

                    // Not through the setter, which would fire a second `theme` event
                    if (themeVariantRe.test(newThemeName) && DH.colorScheme) {
                        pinColorScheme(null);
                    }

                    GlobalEvents.trigger('theme', themeEvent);

                    setTimeout(() => {
                        document.body.classList.remove('b-theme-transition');
                    }, 300);

                    resolve(themeEvent);
                }
            });

            newThemeLink.addEventListener('error', (e) => {
                delete newThemeLink.dataset.loading;
                reject(e);
            });
        }

        if (oldThemeLinks.length) {
            return new Promise((resolve, reject) => {
                oldThemeLinks.forEach((oldThemeLink, i) => {
                    replaceTheme(oldThemeLink, resolve, reject);
                });
            });
        }
        else {
            const oldThemeLink =
                      head.querySelector('#bryntum-theme:not([data-loading])') ||
                      (oldThemeName
                          ? head.querySelector(`[href*="${CSS.escape(oldThemeName)}.css"]:not([data-loading])`)
                          : null);

            // Theme link href ends with <themeName>.css also there could be a query - css?11111...
            if (!oldThemeLink || (oldThemeName && !oldThemeLink.href.includes(`${oldThemeName}.css`))) {
                throw new Error(`Theme link for ${oldThemeName} not found`);
            }

            oldThemeLinks = [oldThemeLink];

            return new Promise((resolve, reject) => replaceTheme(oldThemeLink, resolve, reject));
        }
    }

    /**
     * The color scheme pinned on top of the active theme, or `null` while the application decides.
     *
     * A family theme, whose filename carries no `-light` or `-dark` suffix, renders both modes from a single
     * stylesheet and follows the `color-scheme` in effect where the widget sits, which is light until the
     * application declares one of its own. Assigning `'light'` or `'dark'` pins the rendered mode, and assigning
     * `null` returns the decision to the application.
     *
     * The value is applied as an inline `color-scheme` on the document element, which every widget inherits,
     * including widgets floating in the document body. It is written inline on every shadow host holding Bryntum
     * widgets too, where it outranks a `color-scheme` declared on the `:host`.
     *
     * Only a scheme written by this API counts as a pin. An inline `color-scheme` the application set itself is
     * reported as no pin and is left in place, so clearing never discards the application's own declaration.
     *
     * Being an inline declaration on the root, a pin outranks any `color-scheme` the application declares on the
     * root through a stylesheet. A scheme the application declares closer to a widget still wins for that subtree,
     * since the nearest declared scheme is the one a widget inherits.
     *
     * A variant theme, carrying such a suffix, renders a single mode and has nothing to pin, so assigning
     * `'light'` or `'dark'` while one is active is ignored with a warning. Clearing the pin is always allowed.
     *
     * Only `'light'`, `'dark'`, `null` and `undefined` are accepted, any other value throws.
     *
     * @member {'light'|'dark'|null} colorScheme
     * @static
     */
    static get colorScheme() {
        const { documentElement } = document;

        // An inline scheme this API did not write is the application's own, not a pin
        if (!isColorSchemePinned(documentElement)) {
            return null;
        }

        const scheme = documentElement.style.getPropertyValue('color-scheme');

        return scheme === 'light' || scheme === 'dark' ? scheme : null;
    }

    static set colorScheme(colorScheme) {
        if (colorScheme === undefined) {
            colorScheme = null;
        }

        if (colorScheme !== null && colorScheme !== 'light' && colorScheme !== 'dark') {
            throw new Error(`DomHelper.colorScheme must be 'light', 'dark' or null, not "${colorScheme}"`);
        }

        if (DH.colorScheme === colorScheme) {
            return;
        }

        if (colorScheme) {
            const { filename } = DH.themeInfo;

            // An unresolved filename cannot prove the theme renders a single fixed mode, so the pin is allowed
            if (filename && !familyThemes[filename]) {
                console.warn(`DomHelper.colorScheme ignored, theme "${filename}" renders a single mode`);
                return;
            }
        }

        pinColorScheme(colorScheme);
        DH.themeChange({ colorScheme : true });
    }

    /**
     * Applies the pinned {@link #property-colorScheme-static} to a root, so widgets rendered into a shadowRoot pick
     * up a pin already set on the document.
     * @param {HTMLElement|ShadowRoot} rootElement The document body, or a shadowRoot
     * @internal
     */
    static syncColorScheme(rootElement) {
        const host = rootElement?.host;

        // Only a shadowRoot needs it: the scheme inherits through the host, but an inline write on the host is what
        // outranks a `:host` rule. Unpinned, only hosts we stamped are touched, so an application's value survives
        if (host && (DH.colorScheme || isColorSchemePinned(host))) {
            applyColorScheme(host, DH.colorScheme);
        }
    }

    /**
     * Whether the active theme is known to have a light and a dark rendition. Optimistic while the theme has not
     * resolved yet, since nothing proves it renders a single fixed mode at that point.
     * @member {Boolean} canToggleColorScheme
     * @internal
     * @static
     */
    static get canToggleColorScheme() {
        const { filename } = DH.themeInfo;

        // An unresolved filename cannot prove the theme renders a single fixed mode
        return !filename || themeVariantRe.test(filename) || Boolean(familyThemes[filename]);
    }

    /**
     * Strips any `-light` or `-dark` suffix off a theme name, mapping a rendition onto the family it belongs to.
     * @param {String} theme The theme name
     * @returns {String} The family name
     * @internal
     */
    static themeFamily(theme) {
        return theme?.replace(themeVariantRe, '') || theme;
    }

    /**
     * Toggles between the light and dark rendition of the active theme.
     *
     * A theme in {@link #property-familyThemes-static} renders both modes from one stylesheet, so its
     * {@link #property-colorScheme-static} is pinned to the opposite of the rendered mode instead. The rendered
     * mode is the pinned scheme, or the mode the page renders while nothing is pinned, so every call flips the mode.
     *
     * A variant theme swaps the `-light` / `-dark` suffix of its filename, without checking that the other variant
     * exists, and drops any pinned scheme. Any other theme is left untouched, as is a theme whose CSS has not
     * resolved yet.
     *
     * @returns {Promise} A promise resolved when the theme is applied, already resolved when only the pin changed.
     */
    static toggleLightDarkTheme() {
        const
            currentTheme = DomHelper.themeInfo.filename,
            variant      = themeVariantRe.exec(currentTheme);

        if (!variant) {
            if (DomHelper.familyThemes[currentTheme]) {
                DomHelper.colorScheme = DomHelper.isDarkTheme ? 'light' : 'dark';
            }

            return immediatePromise;
        }

        // The filename renders the mode, so a pin left over from another theme has nothing to say
        DomHelper.colorScheme = null;

        return DomHelper.setTheme(currentTheme.replace(themeVariantRe, variant[1] === 'dark' ? '-light' : '-dark'));
    }

    /**
     * Notifies widgets that global CSS has changed, so they refresh colours and measurements derived from it. Call
     * this after your application changes global CSS itself, for example toggling `color-scheme`, a theme class or
     * CSS variables, without using {@link #function-setTheme-static} or {@link #property-colorScheme-static}.
     *
     * When your application switches between light and dark mode itself, pass `colorScheme : true`, so listeners
     * can tell a light/dark switch from a stylesheet change:
     *
     * ```javascript
     * document.documentElement.style.colorScheme = 'dark';
     * DomHelper.themeChange({ colorScheme : true });
     * ```
     *
     * For any other change to global CSS, call it without arguments:
     *
     * ```javascript
     * document.body.classList.add('my-compact-theme');
     * DomHelper.themeChange();
     * ```
     *
     * Fires the {@link Core.GlobalEvents#event-theme} event. For a light/dark switch, the `colorScheme` applied at the
     * document body and the `mode` it renders are detected and added to it.
     *
     * {@note}This is aliased on the global `bryntum` object as `bryntum.themeChange()`.{/@note}
     *
     * @param {Object} [details] Describes a light/dark switch. Omit it for any other change to global CSS
     * @param {Boolean} [details.colorScheme] `true` to report a light/dark switch
     */
    static themeChange(details) {
        const prev = DH.getThemeInfo().filename;

        themeInfo = null;

        const event = { theme : DH.getThemeInfo().filename, prev };

        if (details?.colorScheme === true) {
            const
                scheme  = DH.getColorScheme(document.body),
                isDark  = scheme.includes('dark'),
                isLight = scheme.includes('light');

            // A scheme naming both modes, or neither, leaves the system preference or the theme default in charge
            event.colorScheme = null;

            if (isDark !== isLight) {
                event.colorScheme = isDark ? 'dark' : 'light';
            }

            event.mode = DH.isDarkTheme ? 'dark' : 'light';
        }

        GlobalEvents.trigger('theme', event);
    }

    /**
     * A theme information object about the current theme. Note, when using Bryntum widgets inside a shadowRoot context,
     * you need to use {@link #function-getThemeInfo-static} and pass a context element.
     *
     * @member {ThemeInfo} themeInfo
     * @readonly
     * @static
     */
    static get themeInfo() {
        return DH.getThemeInfo();
    }

    /**
     * Gets theme information about the currently active theme by reading CSS custom properties from the
     * `.b-theme-info` class.
     *
     * The method creates a temporary DOM element with the `b-theme-info` class, reads all CSS custom properties
     * that start with `--b-theme-`, converts them to camelCase property names, and returns them as an object.
     *
     * Example theme CSS:
     * ```css
     * .b-theme-info {
     *     --b-theme-name             : "SvalbardDark";
     *     --b-theme-filename         : "svalbard-dark";
     *     --b-theme-button-rendition : "text";
     *     --b-theme-label-position   : "align-before";
     *     --b-theme-overlap-label    : "false";
     * }
     * ```
     *
     * This would result in:
     * ```javascript
     * {
     *     name            : "SvalbardDark",
     *     filename        : "svalbard-dark",
     *     buttonRendition : "text",
     *     labelPosition   : "align-before",
     *     overlapLabel    : false  // String "true"/"false" values are converted to boolean
     * }
     * ```
     *
     * @param {HTMLElement} [contextElement] The element for which to find the theme. If using a web component /
     * shadowRoot, the theme will be encapsulated in the web component's encapsulated style so a context element is
     * required. If no web components are in use, this may be omitted.
     * @privateparam {String} [defaultTheme] The name of the theme used as backup value for the `filename` property in
     * case theme information cannot be read from CSS
     * @returns {ThemeInfo} Current theme information object with properties read from CSS custom properties
     */
    static getThemeInfo(contextElement, defaultTheme = '') {
        if (!themeInfo?.filename) {
            const
                // The content it creates for 'b-theme-info' is described in corresponding theme in Core/lib/theme,
                // for example in Core/lib/material3-light.css
                // ```css
                // .b-theme-info {
                //     --b-theme-name : "Material";
                // }
                // ```
                parent    = contextElement ? DH.getRootElement(contextElement) : document.body,
                testDiv   = DH.createElement({
                    parent,
                    className : 'b-theme-info'
                }),
                styles    = getComputedStyle(testDiv),
                themeVars = [];

            // computedStyleMap not supported by Salesforce Locker Service
            // https://developer.salesforce.com/docs/component-library/tools/locker-service-viewer
            if ('computedStyleMap' in testDiv && testDiv.computedStyleMap) {
                for (const style of testDiv.computedStyleMap().keys()) {
                    if (style.startsWith('--b-theme-')) {
                        themeVars.push(style);
                    }
                }
            }
            else {
                for (let i = 0; i < styles.length; i++) {
                    if (styles[i].startsWith('--b-theme-')) {
                        themeVars.push(styles[i]);
                    }
                }
            }

            themeInfo = {
                filename : defaultTheme
            };

            for (const themeVar of themeVars) {
                const
                    raw      = styles.getPropertyValue(themeVar),
                    variable = StringHelper.unhypenate(themeVar.split('--b-theme-')[1]),
                    value    = StringHelper.safeJsonParse(raw) ?? (raw?.trim() || null);

                themeInfo[variable] = value === 'true' ? true : value === 'false' ? false : value;
            }

            testDiv.remove();

            // In a shadow DOM context the theme CSS link is injected asynchronously by
            // initThemeInShadowRoots(), so it may not have loaded by the time widget
            // initializers (Button, Container, Ripple, etc.) first call getThemeInfo().
            // If no theme was found in the shadow root, fall back to document.body which
            // always reflects the document-head theme link. This prevents an early shadow-root
            // call from poisoning the shared themeInfo cache with an empty result before the
            // link has had a chance to load.
            if (!themeInfo.filename && parent !== document.body) {
                themeInfo = null;
                return DH.getThemeInfo(null, defaultTheme);
            }
        }
        return themeInfo || {};
    }

    /**
     * Get the current themes primary color (by reading it from `document.body`)
     * @member {String}
     * @readonly
     */
    static get primaryColor() {
        return getComputedStyle(document.body).getPropertyValue('--b-primary');
    }

    static applyStylesheet(stylesheet, name) {
        // <debug>
        if (globalThis.applyStylesheets !== false) {
            // </debug>
            // Name assigned only for debugging purposes
            name && (stylesheet.name = name);

            // Some modules import the same stylesheets, only need to expose once
            if (!document.adoptedStyleSheets.includes(stylesheet)) {
                document.adoptedStyleSheets.push(stylesheet);
            }
            // <debug>
        }
        // </debug>
    }

    static stylesheetQueue = new Set();
    static stylesheetBasePath = null;
    static stylesheetLoadCount = 0;
    static stylesheetLoadPromise = null;

    static loadStylesheet(path) {
        if (DH.pageUsesCSSBundle == null) {
            const selector = [
                'calendar',
                'gantt',
                'grid',
                'scheduler',
                'schedulerpro',
                'taskboard'
            ].map(theme => `link[href*="${theme}.css"]`).join(',');

            DH.pageUsesCSSBundle = Boolean(document.querySelector(selector));
        }

        // Using CSS bundle, do not load individual files
        if (DH.pageUsesCSSBundle) {
            return;
        }

        // <remove-from-bundle>
        if (!DH.stylesheetQueue.has(path)) {
            DH.stylesheetQueue.add(path);

            // Extract base path from the theme
            if (!DH.stylesheetBasePath) {
                const themeHref = document.querySelector('link[data-bryntum-theme]')?.href;
                let path = globalThis.bryntumCSSPath;

                if (!path) {
                    if (themeHref?.match(/\/build\//)) {
                        path = themeHref.split(/\/build\//)[0] + '/lib/';
                    }
                    else {
                        path = themeHref?.match(/(.*lib\/)Core\/theme/)?.[1];
                    }
                }

                // Try to be even more helpful (needed for Siesta preloads)
                if (!path) {
                    const selector = Object.keys(this.themeNames)
                        .map(theme => `link[href*="${theme}-light.css"],link[href*="${theme}-dark.css"],link[href*="${theme}.css"]`).join(',');

                    path = document.querySelector(selector)?.href.match(/(.*lib\/)Core\/theme/)?.[1];
                }

                // Still no luck, probably we are in a module page using bundle
                if (!path) {
                    return;
                }

                DH.stylesheetBasePath = path;
            }

            DH.stylesheetLoadPromise = new Promissory();
            DH.stylesheetLoadPromise.resolved = false;

            const link = DH.createElement({
                parent      : document.head,
                nextSibling : document.head.querySelector('link[data-bryntum-theme]'),
                tag         : 'link',
                rel         : 'stylesheet',
                type        : 'text/css',
                href        : DH.stylesheetBasePath + path,
                dataset     : {
                    bryntumDynamic : true
                }
            });

            link.addEventListener('load', async() => {
                DH.stylesheetLoadCount++;

                if (DH.stylesheetLoadCount === DH.stylesheetQueue.size) {
                    await document.fonts.ready;

                    DH.stylesheetLoadPromise.resolved = true;
                    DH.stylesheetLoadPromise.resolve();

                    GlobalEvents.trigger('cssLoad');
                }
            });
        }
        // </remove-from-bundle>
    }

    static get themeLoaded() {
        return DH.stylesheetLoadPromise?.promise;
    }

    /**
     * Check if the currently used theme is a dark theme, by checking the color scheme the document body renders
     * from. Where the page declares `light dark`, the system preference decides, unless a
     * {@link #property-colorScheme-static} is pinned.
     *
     * This reports the mode the body renders, so widgets inside an element the application scopes its own
     * `color-scheme` to render in that scheme while this keeps reporting the body's mode. The value is read
     * from the DOM on every access, so an application changing its own `color-scheme` at runtime is reflected
     * immediately.
     * @member {Boolean}
     */
    static get isDarkTheme() {
        // The body sees a `color-scheme` the application declares on it, which the document element misses
        return DH.isDarkThemeFor(document.body);
    }

    /**
     * The `color-scheme` in effect at the passed element, which is the mode a variant theme forces, and the scheme
     * the element declares or inherits otherwise. A pinned {@link #property-colorScheme-static} is an inline
     * declaration on the root, so it arrives here through inheritance unless a scheme is declared closer.
     * @param {HTMLElement|Document|ShadowRoot} [element] The element to read the scheme at. Defaults to the document
     * element, which is also what a `Document` resolves to, while a `ShadowRoot` resolves to its host.
     * @returns {String} `'light'`, `'dark'`, `'light dark'`, or whatever `color-scheme` value the application
     * declares. `'normal'` where nothing declares one, which is how a family theme renders light.
     * @internal
     */
    static getColorScheme(element) {
        const
            { nodeType } = element ?? {},
            // `host` and `documentElement` are duck-typed on elements, so the node type has to decide
            target       = nodeType === DOCUMENT_NODE ? element.documentElement
                : nodeType === DOCUMENT_FRAGMENT_NODE ? element.host
                    : element ?? document.documentElement,
            schemeStyle  = getComputedStyle(target);

        // Only a variant theme sets the custom property, and the mode it forces outranks any declared scheme
        return schemeStyle.getPropertyValue('--b-widget-color-scheme').trim() || schemeStyle.colorScheme;
    }

    /**
     * Whether the passed element renders in dark mode, which the system preference decides where the page declares
     * `light dark`, unless a {@link #property-colorScheme-static} is pinned or an ancestor scopes its own
     * `color-scheme`. An element which is not in the document reports the mode the document renders.
     * @param {HTMLElement|Document|ShadowRoot} [element] The element to read the rendered mode at. Defaults to the
     * document element.
     * @returns {Boolean} `true` if the element renders in dark mode.
     * @internal
     */
    static isDarkThemeFor(element) {
        const
            // A detached element resolves no scheme of its own, so the mode the document renders is the answer
            target      = element?.nodeType === ELEMENT_NODE && !element.isConnected ? document.body : element,
            colorScheme = DH.getColorScheme(target),
            isDark      = colorScheme.includes('dark'),
            isLight     = colorScheme.includes('light');

        // A scheme naming both modes lets the system preference pick which one is rendered
        if (isDark && isLight) {
            if (!DH._colorSchemeQuery && globalThis.matchMedia) {
                DH._colorSchemeQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');
                DH._colorSchemeQuery.addEventListener('change', () => {
                    // A pin outranks the system preference, so only an unpinned page re-renders
                    if (!DH.colorScheme) {
                        DH.themeChange({ colorScheme : true });
                    }
                });
            }

            return Boolean(DH._colorSchemeQuery?.matches);
        }

        // A scheme naming neither mode is `normal`, which renders light
        return isDark;
    }

    //endregion

    //region Transition

    static async transition({
        element : outerElement,
        selector = '[data-dom-transition]',
        duration,
        action,
        thisObj = this,
        addTransition = {},
        removeTransition = {}
    }) {
        const
            // Moving an element blurs focus within it, and DomSync's reordering in action() can drop it too, so focus
            // is captured before the action and given back after each re-append pass
            getFocused     = () => {
                const activeElement = DH.getActiveElement(outerElement);
                return activeElement !== outerElement && outerElement.contains(activeElement) ? activeElement : null;
            },
            restoreFocus   = focused => {
                const activeElement = DH.getActiveElement(outerElement);

                // Only when focus fell off, never override focus moved deliberately elsewhere
                if (outerElement.contains(focused) && (!activeElement || activeElement === focused.ownerDocument.body)) {
                    focused.focus({ preventScroll : true });
                }
            },
            scrollers      = new Set(),
            forceHeight    = !outerElement.style.height,
            beforeElements = Array.from(outerElement.querySelectorAll(selector)),
            outerBounds    = Rectangle.from(outerElement),
            beforeMap      = new Map(beforeElements.map(element => {
                let depth  = 0,
                    parent = element.parentElement;

                while (parent && parent !== outerElement) {
                    depth++;
                    parent = parent.parentElement;
                }

                element.$depth = depth;

                // Store scrolling elements and their current scroll pos, for restoring later
                if (element.scrollHeight > element.offsetHeight && getComputedStyle(element).overflow === 'auto') {
                    element.$scrollTop = element.scrollTop;
                    scrollers.add(element);
                }

                // Intersect our bounds with parents, to trim away overflow
                const
                    { parentElement } = element,
                    globalBounds      = Rectangle.from(element, outerElement),
                    localBounds       = Rectangle.from(element, parentElement),
                    style             = getComputedStyle(parentElement),
                    borderLeftWidth   = parseFloat(style.borderLeftWidth);

                if (borderLeftWidth) {
                    globalBounds.left -= borderLeftWidth;
                    localBounds.left -= borderLeftWidth;
                }

                return [
                    element.id,
                    {
                        element,
                        globalBounds,
                        localBounds,
                        depth,
                        parentElement
                    }
                ];
            }));

        if (forceHeight) {
            outerElement.style.height = outerElement.offsetHeight + 'px';
        }

        let focusedElement = getFocused();

        action.call(thisObj);

        // Removed elements are re-appended below to transition out, never refocus into them
        if (!focusedElement?.isConnected) {
            focusedElement = null;
        }

        const
            afterElements = Array.from(outerElement.querySelectorAll(selector)),
            afterMap      = new Map(afterElements.map(element => {
                const
                    globalBounds    = Rectangle.from(element, outerElement),
                    localBounds     = Rectangle.from(element, element.parentElement),
                    style           = globalThis.getComputedStyle(element.parentElement),
                    borderLeftWidth = parseFloat(style.borderLeftWidth);

                if (borderLeftWidth) {
                    globalBounds.left -= borderLeftWidth;
                    localBounds.left -= borderLeftWidth;
                }

                return [
                    element.id,
                    {
                        element,
                        globalBounds,
                        localBounds
                    }
                ];
            })),
            styleProps    = ['position', 'top', 'left', 'width', 'height', 'padding', 'paddingBlock', 'margin', 'zIndex', 'minWidth', 'minHeight', 'opacity', 'overflow'];

        outerElement.classList.add('b-dom-transition-snapshot');

        // Convert to absolute layout, iterating elements remaining after action
        for (const [id, before] of beforeMap) {
            // We match before vs after on id and not actual element, allowing adding a new element with the same id to
            // transition from the old (which was removed or released). To match what will happen when DomSyncing with
            // multiple containing elements (columns in TaskBoard)
            const after = afterMap.get(id);

            if (after) {
                const
                    { element }   = after,
                    {
                        style,
                        parentElement
                    }             = element,
                    // Need to keep explicit zIndex to keep above other stuff
                    zIndex        = parseInt(DH.getStyleValue(element, 'zIndex')),
                    {
                        globalBounds,
                        localBounds,
                        depth,
                        parentElement : beforeParent
                    }             = before,
                    parentChanged = beforeParent !== parentElement;

                // Store initial state, in case element has a style prop we need to restore later
                ObjectHelper.copyProperties(element.$initial = { parentElement }, style, styleProps);

                // Prevent transition during the process, forced further down instead
                // element.remove();

                let bounds;

                // Action moved element to another parent, move it to the outer element to allow transitioning to the
                // new parent. Also use coordinates relative to that element
                if (parentChanged) {
                    after.bounds = after.globalBounds;
                    bounds = globalBounds;
                    outerElement.appendChild(element);
                }
                // Keep element in current parent if it was not moved during the action call above.
                // Need to use coords relative to the parent
                else {
                    after.bounds = after.localBounds;
                    bounds = localBounds;
                    beforeParent.appendChild(element);
                }

                let overflow = 'hidden'; // Looks weird with content sticking out if height is transitioned

                if (scrollers.has(element)) {
                    element.$scrollPlaceholder = DH.createElement({
                        parent : element,
                        style  : {
                            height : element.scrollHeight
                        }
                    });

                    overflow = 'auto';
                }

                const targetStyle = {
                    position  : 'absolute',
                    top       : `${bounds.top}px`,
                    left      : `${bounds.left}px`,
                    width     : `${bounds.width}px`,
                    height    : `${bounds.height}px`,
                    minWidth  : 0,
                    minHeight : 0,
                    margin    : 0,
                    zIndex    : depth + (zIndex || 0),
                    overflow
                };

                if (element.dataset.domTransition === 'preserve-padding-inline') {
                    targetStyle.paddingBlock = 0;
                }
                else if (element.dataset.domTransition !== 'preserve-padding') {
                    targetStyle.padding = 0;
                }

                // Move element back to where it started
                Object.assign(style, targetStyle);

                after.processed = true;
            }
            // Existed before but not after = removed
            else {
                const
                    {
                        element,
                        localBounds : bounds,
                        depth,
                        parentElement
                    } = before;

                element.$initial = { removed : true };

                Object.assign(element.style, {
                    position  : 'absolute',
                    top       : `${bounds.top}px`,
                    left      : `${bounds.left}px`,
                    width     : `${bounds.width}px`,
                    height    : `${bounds.height}px`,
                    minWidth  : 0,
                    minHeight : 0,
                    padding   : 0,
                    margin    : 0,
                    zIndex    : depth,
                    overflow  : 'hidden' // Looks weird with content sticking out if height is transitioned
                });

                parentElement.appendChild(element);

                // Inject among non-removed elements to have it transition away
                afterMap.set(id, {
                    element,
                    bounds,
                    removed   : true,
                    processed : true
                });
                afterElements.push(element);
            }
        }

        // Handle new elements
        for (const [, after] of afterMap) {
            if (!after.processed) {
                const
                    { element } = after,
                    {
                        style,
                        parentElement
                    }           = element,
                    bounds      = after.bounds = after.localBounds;

                element.classList.add('b-dom-transition-adding');

                ObjectHelper.copyProperties(element.$initial = { parentElement }, style, styleProps);

                // Props in `addTransition` will be transitioned
                Object.assign(style, {
                    position : 'absolute',
                    top      : addTransition.top ? 0 : `${bounds.top}px`,
                    left     : addTransition.left ? 0 : `${bounds.left}px`,
                    width    : addTransition.width ? 0 : `${bounds.width}px`,
                    height   : addTransition.height ? 0 : `${bounds.height}px`,
                    opacity  : addTransition.opacity ? 0 : null,
                    zIndex   : parentElement.$depth + 1,
                    overflow : 'hidden' // Looks weird with content sticking out if height is transitioned
                });
            }
        }

        restoreFocus(focusedElement);

        // Restore scroll after modifying layout
        for (const element of scrollers) {
            element.scrollTop = element.$scrollTop;
        }

        // Outer element might lose dimensions when contents become absolutely positioned
        const newOuterBounds = Rectangle.from(outerElement);

        if (newOuterBounds.width === 0) {
            outerElement.style.width = `${outerBounds.width}px`;
        }

        if (newOuterBounds.height === 0) {
            outerElement.style.height = `${outerBounds.height}px`;
        }

        // Enable transitions
        outerElement.classList.add('b-dom-transition');
        // Trigger layout, to be able to transition below
        outerElement.firstElementChild.offsetWidth;

        // Transition to new layout
        for (const [
            , {
                element,
                bounds : afterBounds,
                removed
            }
        ] of afterMap) {
            if (removed) {
                Object.assign(element.style, {
                    top     : removeTransition.top ? 0 : `${afterBounds.top}px`,
                    left    : removeTransition.left ? 0 : `${afterBounds.left}px`,
                    width   : removeTransition.width ? 0 : `${afterBounds.width}px`,
                    height  : removeTransition.height ? 0 : `${afterBounds.height}px`,
                    opacity : removeTransition.opacity ? 0 : element.$initial.opacity
                });
            }
            else {
                Object.assign(element.style, {
                    top     : `${afterBounds.top}px`,
                    left    : `${afterBounds.left}px`,
                    width   : `${afterBounds.width}px`,
                    height  : `${afterBounds.height}px`,
                    opacity : element.$initial.opacity
                });
            }
        }

        // Wait for transition to finish
        await AsyncHelper.sleep(duration);

        outerElement.classList.remove('b-dom-transition', 'b-dom-transition-snapshot');

        if (newOuterBounds.width === 0) {
            outerElement.style.width = '';
        }

        if (newOuterBounds.height === 0) {
            outerElement.style.height = '';
        }

        focusedElement = getFocused();

        // Restore layout after transition
        for (const element of afterElements) {
            if (element.$initial) {
                if (element.$initial.removed) {
                    element.remove();
                }
                else {
                    ObjectHelper.copyProperties(element.style, element.$initial, styleProps);

                    if (element.$scrollPlaceholder) {
                        element.$scrollPlaceholder.remove();
                        delete element.$scrollPlaceholder;
                    }

                    element.classList.remove('b-dom-transition-adding');

                    element.$initial.parentElement.appendChild(element);
                }
            }
        }

        restoreFocus(focusedElement);

        if (forceHeight) {
            outerElement.style.height = '';
        }

        // Restore scroll positions last when all layout is restored
        for (const element of scrollers) {
            element.scrollTop = element.$scrollTop;
            delete element.$scrollTop;
        }
    }

    //endregion

    static async loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');

            script.src = url;
            script.onload = resolve;
            script.onerror = reject;

            document.head.appendChild(script);
        });
    }

    /**
     * Returns `true` if the passed value is one of the predefined Bryntum named colors, with or without the `b-`
     * prefix (e.g. both `red` and `b-red` return `true`).
     * @param {String} color
     * @returns {Boolean}
     * @internal
     */
    static isNamedColor(color) {
        return Colors.isNamedColor(color);
    }

    /**
     * Returns the bare predefined color name for the passed value (stripping any `b-` prefix), or `null` if the value
     * is not a predefined color. Use this to build a `b-color-<name>` CSS class from a color value that may use the
     * `b-` prefix.
     * @param {String} color
     * @returns {String|null}
     * @internal
     */
    static getColorName(color) {
        return Colors.getColorName(color);
    }

    /**
     * Resolves a color value (predefined named color or any CSS color) to a value usable for the `--b-primary` CSS
     * variable. Predefined colors (with or without the `b-` prefix) resolve to `var(--b-color-<name>)`, any other
     * non-empty value is returned unchanged, and an empty value resolves to `''`.
     *
     * For example:
     * ```javascript
     * // Predefined named color → CSS variable form (theme-aware, usable in DOM/SVG styles)
     * element.style.color = DomHelper.createColorStyle('b-red'); // 'var(--b-color-red)'
     *
     * // A literal CSS color is returned unchanged
     * element.style.color = DomHelper.createColorStyle('#e53935'); // '#e53935'
     * ```
     * @param {String} color
     * @returns {String}
     * @static
     */
    static createColorStyle(color) {
        return Colors.createColorStyle(color);
    }

    /**
     * Resolves a color value to a concrete, literal CSS color (e.g. `#e53935`) read from the loaded theme. Use this
     * for contexts where CSS variables are not supported, such as a canvas 2D `fillStyle`. A predefined named color
     * (with or without the `b-` prefix, e.g. `b-red` or `red`) resolves to the computed `--b-color-<name>` value;
     * any other non-empty value (a literal hex, `rgb(...)` or CSS keyword) is returned unchanged, and an empty value
     * resolves to `''`. Unlike {@link #function-createColorStyle-static}, which returns the `var(--b-color-<name>)`
     * form, this returns the concrete computed color.
     *
     * For example:
     * ```javascript
     * // Predefined named color → concrete literal color read from the loaded theme
     * canvasContext.fillStyle = DomHelper.resolveColorValue('b-red'); // e.g. '#e53935'
     *
     * // A literal CSS color is returned unchanged
     * canvasContext.fillStyle = DomHelper.resolveColorValue('#e53935'); // '#e53935'
     * ```
     * @param {String} color
     * @param {HTMLElement} [element] Element to read the theme variable from, defaults to the document root.
     * @returns {String}
     * @static
     */
    static resolveColorValue(color, element) {
        return Colors.resolveColorValue(color, element);
    }

    //#region Salesforce hooks

    // Wrap NodeFilter to support salesforce
    static get NodeFilter() {
        return NodeFilter;
    }

    static addChild(parent, child, sibling) {
        parent.insertBefore(child, sibling);
    }

    static cloneStylesIntoShadowRoot(shadowRoot, removeExisting) {
        return new Promise((resolve, reject) => {
            if (removeExisting) {
                // Removes all style-tags or stylesheet link tags from shadowRoot
                shadowRoot.querySelectorAll('style, link[rel="stylesheet"]').forEach(el => el.remove());
            }

            // Clones all stylesheet link tags from document into shadowRoot and waits for them to load
            const links = document.querySelectorAll('link[rel="stylesheet"]');
            let loadCount = 0;

            shadowRoot.adoptedStyleSheets = document.adoptedStyleSheets;

            links.forEach(node => {
                const clone = node.cloneNode();

                clone.addEventListener('load', () => {
                    loadCount += 1;
                    if (loadCount === links.length) {
                        resolve();
                    }
                });

                clone.addEventListener('error', (e) => {
                    reject(clone.href);
                });

                shadowRoot.appendChild(clone);
            });

            // Clones all style tags from document into shadowRoot
            document.querySelectorAll('style').forEach(node => {
                const clone = node.cloneNode();
                clone.innerHTML = node.innerHTML;
                shadowRoot.appendChild(clone);
            });

            if (!links.length) {
                resolve();
            }
        });
    }

    //#endregion
}

Helpers.register(DomHelper);

const DH = DomHelper;

let clearTouchTimer;
const
    clearTouchEvent = () => DH.isTouchEvent = false,
    setTouchEvent   = () => {
        DH.isTouchEvent = true;

        // Jump round the click delay
        clearTimeout(clearTouchTimer);
        clearTouchTimer = setTimeout(clearTouchEvent, 400);
    };

// Set event type flags so that mousedown and click handlers can know whether a touch gesture was used.
// This is used. This must stay until we have a unified DOM event system which handles both touch and mouse events.
doc.addEventListener('touchstart', setTouchEvent, true);
doc.addEventListener('touchend', setTouchEvent, true);

DH.canonicalStyles = canonicalStyles;
DH.supportsTemplate = 'content' in doc.createElement('template');
DH.elementExpandoKey = elementExpandoKey;
DH.numberRe = numberRe;

// Some Node types like DocumentFragment, TextNodes do not have closest method on the Node
// interface. So We still need this polyfill as we use the `closest` method on the Nodes like
// DocumentFragment, TextNodes etc in our codebase.
Node.prototype.closest = function(selector) {
    return this.parentNode?.closest(selector);
};

// CTRL/+ and  CTRL/- zoom gestures must invalidate the scrollbar width.
// Window resize is triggered by this operation on Blink (Chrome & Edge), Firefox and Safari.
globalThis.addEventListener('resize', () => scrollBarWidth = null);

// DomHelper.applyStylesheet(Stylesheet, 'DomHelper');
DH.loadStylesheet('Core/helper/DomHelper.css');
