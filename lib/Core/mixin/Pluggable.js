import Base from '../Base.js';
import InstancePlugin from './InstancePlugin.js';

/**
 * @module Core/mixin/Pluggable
 */

/**
 * Enables using plugins for a class by specifying property plugins as an array of plugin classes. If only a single plugin
 * is used, just give the plugin class instead of an array. This class isn't required for using plugins, just makes it
 * easier. Without mixin you can otherwise use `InstancePlugin.initPlugins(this, PluginClass)`.
 *
 * ```javascript
 * new Store({
 *   plugins: [PluginClass, ...]
 * });
 * ```
 *
 * ## Useful configs
 *
 * | Config                                  | Description                                          |
 * |-----------------------------------------|------------------------------------------------------|
 * | {@link #config-plugins}                 | Array of plugin classes to instantiate on the host    |
 *
 * ## See also
 *
 * - {@link Core.mixin.InstancePlugin} - Base class for plugin implementations
 *
 * @mixin
 */
export default Target => class Pluggable extends (Target || Base) {
    static $name = 'Pluggable';

    /**
     * Specify plugins (an array of classes) in config
     * @config {Core.mixin.InstancePlugin[]|Core.mixin.InstancePlugin} plugins Array of plugin classes or single plugin class
     * @category Misc
     * @advanced
     */

    /**
     * Map of applied plugins
     * @member {Object<String,Core.mixin.InstancePlugin>}
     * @readonly
     * @category Misc
     * @advanced
     */
    get plugins() {
        if (!this._plugins) {
            this._plugins = {};
        }
        return this._plugins;
    }

    set plugins(plugins) {
        if (plugins) {
            if (!Array.isArray(plugins)) plugins = [plugins];
            InstancePlugin.initPlugins(this, ...plugins);
        }
        this.initPlugins();
    }

    /**
     * Template method which may be implemented in subclasses to initialize any plugins.
     * This method is empty in the `Pluggable` base class.
     * @internal
     */
    initPlugins() {

    }

    /**
     * Adds plugins to an instance.
     * @param {Function[]} plugins The plugins to add
     * @category Misc
     * @advanced
     */
    addPlugins(...plugins) {
        InstancePlugin.initPlugins(this, ...plugins);
    }

    /**
     * Adds a plugin to an instance, with a configuration object passed to the plugin constructor
     * @param {Function} plugin The plugin class to instantiate
     * @param {Object} config Configuration object for the plugin
     * @returns {Core.mixin.InstancePlugin} The created plugin instance
     * @internal
     */
    addPlugin(plugin, config) {
        return InstancePlugin.initPlugin(this, plugin, config);
    }

    /**
     * Checks if instance has plugin.
     * @param {String|Function} pluginClassOrName Plugin or name to check for
     * @returns {Boolean}
     * @category Misc
     * @advanced
     */
    hasPlugin(pluginClassOrName) {
        return this.getPlugin(pluginClassOrName) != null;
    }

    /**
     * Get a plugin instance.
     * @param {String|Function} pluginClassOrName Plugin class or plugin name to get
     * @returns {Core.mixin.InstancePlugin|null} The plugin instance or null if not found
     * @category Misc
     * @advanced
     */
    getPlugin(pluginClassOrName) {
        if (typeof pluginClassOrName === 'function') {
            pluginClassOrName = pluginClassOrName.$$name;
        }
        return this.plugins?.[pluginClassOrName];
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
