// Documents the global `bryntum` object for the API docs and the typings, this module is not imported anywhere

/**
 * @module Core/Bryntum
 */

/**
 * The global `bryntum` object. Bryntum creates it when it loads, and it is used to register the license key and to
 * query widgets from the browser console.
 *
 * Register the license key for the Business and Enterprise tiers in the application entry file, before the first
 * component is created:
 *
 * ```javascript
 * (globalThis.bryntum ??= {}).licenseKey = 'your-license-key';
 * ```
 *
 * The object only exists once Bryntum has loaded, and the entry file can run before that, for example when Bryntum is
 * only used in a lazy-loaded route or component. The line above creates the object when it is missing, and Bryntum
 * picks up the key when it loads. Once Bryntum has loaded, `bryntum.licenseKey = 'your-license-key'` does the same.
 * See the [Licensing guide](#Core/guides/licensing.md) for how keys and trials work.
 *
 * @class
 * @singleton
 * @ts-global bryntum
 */
export default globalThis.bryntum;

/**
 * The license key for the Business and Enterprise tiers. Can be set before or after Bryntum has loaded, and before or
 * after components are created.
 *
 * @member {String} licenseKey
 */

/**
 * Set to `true` before Bryntum loads to not throw when the Bryntum bundle is loaded more than once, for example in
 * a host page that loads several applications which each include Bryntum.
 *
 * {@warning}Loading Bryntum more than once is usually a bundling mistake, which this only hides. Each copy has its
 * own classes and state, so widgets from one copy do not work with another.{/@warning}
 *
 * @member {Boolean} silenceBundleException
 * @advanced
 */

/**
 * Finds the first widget matching the passed selector. Useful in the browser console to get hold of a widget.
 *
 * ```javascript
 * bryntum.query('grid').destroy();
 * bryntum.query('#myScheduler');
 * ```
 *
 * See {@link Core.widget.Widget#function-query-static} for the supported selectors.
 *
 * @function query
 * @param {Core.widget.Widget|String|Function} selector A widget instance, widget type, id selector (#id), attribute
 * selector ([attr=value]), or filter function
 * @param {Boolean} [deep] Specify `true` to search the prototype chain (requires a string `selector`). For example,
 * `'widget'` would then find a Grid
 * @returns {Core.widget.Widget} The first matched widget if any
 */

/**
 * Finds all widgets matching the passed selector. Useful in the browser console to get hold of widgets.
 *
 * ```javascript
 * bryntum.queryAll('field', true);
 * ```
 *
 * See {@link Core.widget.Widget#function-queryAll-static} for the supported selectors.
 *
 * @function queryAll
 * @param {String|Function} selector A widget type, id selector (#id), attribute selector ([attr=value]), or filter
 * function
 * @param {Boolean} [deep] Specify `true` to search the prototype chain (requires a string `selector`). For example,
 * `'widget'` would then find a Grid
 * @returns {Core.widget.Widget[]} The matched widgets, an empty array if there are none
 */

/**
 * Registers a patch provided by Bryntum support. See {@link Core.Patch} for how to apply a patch.
 *
 * @function applyPatch
 * @param {Object} config Patch configuration
 * @returns {Boolean} `true` if any patches were applied immediately
 */
