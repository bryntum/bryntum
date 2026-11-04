/**
 * @module Core/helper/Helpers
 */

// Not every module can import *Helper modules (because the Helpers ultimately import them). So, instead, the Helpers
// register themselves in this namespace (object) that all modules can import since this module imports nothing.

const
    registry = Object.create(null),
    helpers  = [
        // One of these things is not like the others...
        'Array', 'Browser', ['Css', 'CSSHelper'], 'Date', 'Dom', 'Event', 'Function', 'Object', 'String', 'TimeZone',
        'Version'
    ].map(el => Array.isArray(el) ? el : [el, `${el}Helper`]),
    mapify = entries => Object.assign(Object.create(null), Object.fromEntries(entries)),
    byName = mapify(helpers),
    byType = mapify(helpers.map(([k, v]) => [v, k])),
    denied = reason => (obj, name) => {
        throw new Error(`Cannot ${reason} "Helpers.${name}": object is readonly`);
    },
    /**
     * Collection of registered Helper singletons.
     * @type {HelpersType}
     * @internal
     */
    Helpers = new Proxy(registry, {
        defineProperty : denied('define property'),
        deleteProperty : denied('delete'),
        set            : denied('assign'),

        get(obj, name) {
            const ret = registry[name];

            if (!ret) {
                throw new Error(`Property not defined "Helpers.${name}": ${name in byName
                    ? `import ${byName[name]} before using it`
                    : `invalid helper name`}`);
            }

            return ret;
        }

        // we don't need any other getter traps because we populate "registry" (the proxy target) below.
    });

Object.defineProperty(registry, 'register', {
    // not enumerable, configurable, writable
    value(helper) {
        const
            name = helper.$name,
            key = byType[name];

        // <remove-on-release>
        if (!key) {
            throw new Error(`Invalid Helper registration "${name}"`);
        }

        if (registry[key]) {
            throw new Error(`Duplicate Helper registration for "${name}"`);
        }
        // </remove-on-release>

        registry[key] = helper;
    }
});

// Populating the proxy target object makes Object.keys(), for...in, etc work by default
helpers.forEach(ent => registry[ent[0]] = null);

// this typedef enables auto-completion in IntelliJ while the singleton class + members does not... they describe
// all the same properties
/**
 * @typedef {Object} HelpersType
 * @property {Core.helper.ArrayHelper} Array Reference to `ArrayHelper`.
 * @ts-property Array {typeof ArrayHelper}
 * @property {Core.helper.BrowserHelper} Browser Reference to `BrowserHelper`.
 * @ts-property Browser {typeof BrowserHelper}
 * @property {Core.helper.CSSHelper} Css Reference to `CSSHelper`.
 * @ts-property Css {typeof CSSHelper}
 * @property {Core.helper.DateHelper} Date Reference to `DateHelper`.
 * @ts-property Date {typeof DateHelper}
 * @property {Core.helper.DomHelper} Dom Reference to `DomHelper`.
 * @ts-property Dom {typeof DomHelper}
 * @property {Core.helper.EventHelper} Event Reference to `EventHelper`.
 * @ts-property Event {typeof EventHelper}
 * @property {Core.helper.FunctionHelper} Function Reference to `FunctionHelper`.
 * @ts-property Function {typeof FunctionHelper}
 * @property {Core.helper.ObjectHelper} Object Reference to `ObjectHelper`.
 * @ts-property Object {typeof ObjectHelper}
 * @property {Core.helper.StringHelper} String Reference to `StringHelper`.
 * @ts-property String {typeof StringHelper}
 * @property {Core.helper.TimeZoneHelper} TimeZone Reference to `TimeZoneHelper`.
 * @ts-property TimeZone {typeof TimeZoneHelper}
 * @property {Core.helper.VersionHelper} Version Reference to `VersionHelper`.
 * @ts-property Version {typeof VersionHelper}
 * @internal
 */

/**
 * A singleton for accessing various `Core.helper.*` singletons.
 *
 * @class
 * @singleton
 * @internal
 */
export default Helpers;

(globalThis.bryntum || (globalThis.bryntum = {})).Helpers = Helpers;

/**
 * Reference to {@link Core.helper.ArrayHelper} helper class.
 * @member {Core.helper.ArrayHelper} Array
 * @ts-returns {typeof Core.helper.ArrayHelper}
 */
/**
 * Reference to {@link Core.helper.BrowserHelper} helper class.
 * @member {Core.helper.BrowserHelper} Browser
 * @ts-returns {typeof Core.helper.BrowserHelper}
 */
/**
 * Reference to {@link Core.helper.CSSHelper} helper class.
 * @member {Core.helper.CSSHelper} Css
 * @ts-returns {typeof Core.helper.CSSHelper}
 */
/**
 * Reference to {@link Core.helper.DateHelper} helper class.
 * @member {Core.helper.DateHelper} Date
 * @ts-returns {typeof Core.helper.DateHelper}
 */
/**
 * Reference to {@link Core.helper.DomHelper} helper class.
 * @member {Core.helper.DomHelper} Dom
 * @ts-returns {typeof Core.helper.DomHelper}
 */
/**
 * Reference to {@link Core.helper.EventHelper} helper class.
 * @member {Core.helper.EventHelper} Event
 * @ts-returns {typeof Core.helper.EventHelper}
 */
/**
 * Reference to {@link Core.helper.FunctionHelper} helper class.
 * @member {Core.helper.FunctionHelper} Function
 * @ts-returns {typeof Core.helper.FunctionHelper}
 */
/**
 * Reference to {@link Core.helper.ObjectHelper} helper class.
 * @member {Core.helper.ObjectHelper} Object
 * @ts-returns {typeof Core.helper.ObjectHelper}
 */
/**
 * Reference to {@link Core.helper.StringHelper} helper class.
 * @member {Core.helper.StringHelper} String
 * @ts-returns {typeof Core.helper.StringHelper}
 */

/**
 * Reference to {@link Core.helper.VersionHelper} helper class.
 * @member {Core.helper.VersionHelper} Version
 * @ts-returns {typeof Core.helper.VersionHelper}
 */
