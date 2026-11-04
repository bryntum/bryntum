import Base from '../Base.js';
import Events from './Events.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import StringHelper from '../helper/StringHelper.js';
import VersionHelper from '../helper/VersionHelper.js';
import Localizable from '../localization/Localizable.js';

/**
 * @module Core/mixin/InstancePlugin
 */

function getDescriptor(me, fnName) {
    const property = ObjectHelper.getPropertyDescriptor(me, fnName);//Object.getOwnPropertyDescriptor(Object.getPrototypeOf(me), fnName);

    return (property && (property.get || property.set)) ? property : null;
}

// Ordering for tier comparisons. Higher value = more capable tier.
const tierRank = {
    community  : 0,
    business   : 1,
    enterprise : 2
};

/**
 * Base class for plugins. Published functions will be available from the other class. `this` in published functions is
 * referenced to the plugin, access the other class using `this.client`.
 *
 * Observe that a plugin doesn't apply itself on class level but instead on instance level. Plugin is its own instance
 * that can have own functions and data that is not exposed to target class.
 *
 * For a comprehensive guide on creating custom features (plugins), see
 * [Creating custom features](#Grid/guides/advanced/customfeatures.md), which covers the Grid, Scheduler
 * and Gantt feature family. Calendar and TaskBoard have their own equivalents.
 *
 * Functions can be published in four ways:
 *
 * * `assign` (when function is not already available on target)
 * * `before` (when function is already available on target, will be called before original function)
 * * `after` (when function is already available on target, will be called after original function)
 * * `override` (replaces function on target, but old function can be reached)
 *
 * To configure which functions get published and in what way, specify `pluginConfig` getter on plugin:
 *
 * ```javascript
 * class Sort extends InstancePlugin {
 *   static get pluginConfig {
 *      return {
 *          before   : ['init'],
 *          after    : ['destroy', 'onElementClick'],
 *          override : ['render']
 *      };
 *   }
 * }
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config / Property               | Description                            |
 * |---------------------------------|----------------------------------------|
 * | {@link #config-disabled}        | The plugin disabled state              |
 * | {@link #property-client}        | Reference to the owning widget         |
 *
 * ## See also
 *
 * - {@link Core.widget.Widget} - Base widget that hosts plugins
 * - {@link Core.mixin.Pluggable} - Mixin that enables plugin support
 *
 * @extends Core/Base
 * @mixes Core/localization/Localizable
 * @mixes Core/mixin/Events
 * @non-mixin
 * @plugin
 * @tier community
 */
export default class InstancePlugin extends Base.mixin(Events, Localizable) {

    static $name = 'InstancePlugin';

    /**
     * @typedef {Object} PluginConfigObject
     * @property {String[]} [assign] Method names to add to the client (when they don't already exist)
     * @property {String[]} [before] Methods called **before** the client's original method
     * @property {String[]|Object} [after] Methods called **after** the client's original method
     */

    /**
     * Defines how the plugin's methods integrate with its client (the widget it is attached to).
     * Override this static getter in subclasses.
     *
     * ```javascript
     * class MyFeature extends InstancePlugin {
     *     static get pluginConfig() {
     *         return {
     *             assign   : ['newMethod'],           // client.newMethod() calls plugin
     *             before   : ['onElementKeyDown'],    // plugin runs first
     *             after    : ['onElementClick'],      // client runs first
     *             override : ['processData']          // plugin replaces, uses this.overridden
     *         };
     *     }
     *
     *     processData(data) {
     *         // Call original: this.overridden.processData(data)
     *         return this.overridden.processData(this.transform(data));
     *     }
     * }
     * ```
     *
     * @member {PluginConfigObject} pluginConfig
     * @static
     * @readonly
     * @category Plugin
     */

    //region Config

    static configurable = {
        /**
         * The plugin/feature `disabled` state.
         *
         * For a feature that is **off** by default that you want to enable later during runtime,
         * configure it with `disabled : true`.
         * ```javascript
         * const grid = new Grid({
         *      features : {
         *          featureName : {
         *              disabled : true // on and disabled, can be enabled later
         *          }
         *      }
         * });
         *
         * // enable the feature
         * grid.features.featureName.disabled = false;
         * ```
         *
         * If the feature is **disabled** by default, and you want to include and enable the feature, configure it as `true`:
         * ```javascript
         * const grid = new Grid({
         *      features : {
         *          featureName : true // on and enabled, can be disabled later
         *      }
         * });
         *
         * // disable the feature
         * grid.features.featureName.disabled = true;
         * ```
         *
         * If the feature is **on** by default, but you want to turn it **off**, configure it as `false`:
         * ```javascript
         * const grid = new Grid({
         *      features : {
         *          featureName : false // turned off, not included at all
         *      }
         * });
         * ```
         *
         * If the feature is **enabled** by default and you have no need of reconfiguring it,
         * you can omit the feature configuration.
         *
         * @prp {Boolean}
         * @ts-returns {Boolean|'inert'}
         * @default
         * @category Common
         */
        disabled : false,

        /**
         * The Widget which was passed into the constructor,
         * which is the Widget we are providing extra services for.
         * @member {Core.widget.Widget} client
         * @readonly
         * @category Misc
         * @advanced
         */
        /**
         * The widget which this plugin is to attach to.
         * @config {Core.widget.Widget}
         * @category Misc
         * @advanced
         */
        client : null,

        // The plugins can define their own keyMap which will then be merged with their client's keyMap.
        keyMap : null

        /**
         * @hideconfigs bubbleEvents, callOnFunctions
         */

        /**
         * @hidefunctions downloadTestCase, destroy
         */

        /**
         * @hideproperties isDestroyed
         */

        /**
         * @hideevents destroy, beforeDestroy
         */
    };

    static properties = {
        clientListeners : null
    };

    /**
     * Per-tier configuration defaults keyed by tier name (`'community'`, `'business'`, `'enterprise'`). At construction
     * time the branch matching the client's {@link Core.mixin.Tierable#config-tier} is merged into the configuration as
     * defaults — any caller-supplied configs take precedence.
     *
     * ```javascript
     * class DependencyEdit extends InstancePlugin {
     *     static tierConfigs = {
     *         enterprise : {
     *             showLagField : true
     *         }
     *     };
     * }
     * ```
     *
     * @member {Object} tierConfigs
     * @static
     * @readonly
     * @category Plugin
     * @internal
     */
    static tierConfigs = null;

    configure(config = {}) {
        const
            clientTier   = this.client?.tier,
            // tierConfigs are declared per-class. If the client's tier matches a branch, that branch is merged into the
            // config object as defaults — top-level caller-supplied values still win.
            tierConfigs  = this.constructor.tierConfigs,
            tierBlock    = clientTier && tierConfigs?.[clientTier];

        if (tierBlock) {
            config = ObjectHelper.merge({}, tierBlock, config);
        }

        super.configure(config);
    }

    onConfigChange(...args) {
        super.onConfigChange(...args);

        if (!this.isConfiguring) {
            // Give the client a chance to react to plugin config changes
            this.client?.afterPluginConfigChange?.({ plugin : this, ...args[0] });
        }
    }

    //endregion

    updateClient(client) {
        // <remove-on-release>
        const pluginConfig = Object.getOwnPropertyDescriptor(this.constructor, 'pluginConfig');
        if (pluginConfig && !pluginConfig.get) {
            throw new Error('pluginConfig must always be defined using a getter');
        }
        // </remove-on-release>
        // So that this.callback can reach the owning Widget when resolving function names.
        if (!this.owner) {
            this.owner = client;
        }
    }

    /**
     * This will merge a feature's (subclass of InstancePlugin) keyMap with it's client's keyMap.
     * @private
     */
    updateKeyMap(keyMap) {
        const { client } = this;
        client.keyMap = client.mergeKeyMaps(client.keyMap, keyMap, StringHelper.uncapitalize(this.constructor.$name));
    }

    //region Init

    /**
     * Call from another instance to add plugins to it.
     *
     * ```javascript
     * InstancePlugin.initPlugins(this, Search, Stripe);
     * ```
     *
     * @param {Object} plugInto Instance to mix into (usually this)
     * @param {...Function} plugins Classes to plug in
     * @internal
     */
    static initPlugins(plugInto, ...plugins) {
        for (const PluginClass of plugins) {
            this.initPlugin(plugInto, PluginClass);
        }
    }

    /**
     * Call from another instance to add a plugin to it
     *
     * @param {Object} plugInto Instance to mix into (usually this)
     * @param {Function} PluginClass Class to plug in
     * @param {Object} [config] Configuration object to pass to the plugin constructor
     * @returns {Core.mixin.InstancePlugin} Initialized plugin instance
     * @internal
     */
    static initPlugin(plugInto, PluginClass, config) {
        const
            property = plugInto.plugins || (plugInto.plugins = {}),
            args     = [plugInto];

        if (config) {
            args.push(config);
        }

        return property[PluginClass.$$name] = new PluginClass(...args);
    }

    /**
     * Simple wrapper for {@link #property-disabled} to make optional chaining simple:
     *
     * ```javascript
     * grid.features.myFeature?.enabled // returns true when feature exists and is enabled
     * ```
     * @member {Boolean}
     * @readonly
     * @internal
     */
    get enabled() {
        return !this.disabled;
    }

    set enabled(value) {
        this.disabled = !value;
    }

    // We can act as an owner of a widget, so must be able to participate in focus reversion
    getFocusRevertTarget() {
        return this.client?.getFocusRevertTarget();
    }

    construct(...args) {
        const me = this;

        let [plugInto, config] = args,
            listeners;

        // Features are created with a single config object carrying the `client`. A legacy custom feature
        // that still declares `construct(client, config)` forwards that object as `client` and an undefined
        // (or defaulted `{}`) `config` - recognize that shape too, so such features keep working.
        if (args.length === 1 || (ObjectHelper.isObject(plugInto) && 'client' in plugInto &&
            (config == null || (ObjectHelper.isObject(config) && Object.keys(config).length === 0)))) {
            if (ObjectHelper.isObject(plugInto)) {
                config = plugInto;
                plugInto = config.client;
            }
        }
        // Two args, so client is the first. Ensure the config doesn't contain a client property.
        else {
            config = ObjectHelper.assign({}, config);
            delete config.client;
        }

        me.client = plugInto;

        // If the plugin declares a required tier and the client carries a lower one, warn and leave the plugin inert:
        // its configs are applied to the instance (so accessing it is safe) but it never binds to the client. Plugins
        // without `static tier` and clients without `tier` are tier-agnostic and always proceed.
        const
            requiredTier = me.constructor.tier,
            clientTier   = plugInto?.tier,
            tierBlocked  = requiredTier && clientTier && tierRank[clientTier] < tierRank[requiredTier];

        /**
         * `true` when the plugin requires a higher tier than its client runs at. Such a plugin stays disabled and
         * never binds to its client, feature code can guard on this flag.
         * @member {Boolean} isTierBlocked
         * @readonly
         * @internal
         */
        // Assigned before super.construct, since changeDisabled reads it during configuration
        me.isTierBlocked = Boolean(tierBlocked);

        super.construct(config);

        if (tierBlocked) {
            if (!VersionHelper.isTestEnv && Boolean(plugInto.initialConfig.features?.[StringHelper.uncapitalize(me.constructor.$name)])) {
                console.warn(`The "${me.constructor.$name}" feature requires ${StringHelper.capitalize(requiredTier)} tier, app is using ${StringHelper.capitalize(clientTier)} tier - feature inactivated`);
            }
            return;
        }

        me.applyPluginConfig(plugInto);

        listeners = me.clientListeners;

        if (listeners) {
            listeners = ObjectHelper.assign({}, listeners);
            listeners.thisObj = me;

            // NOTE: If clientListeners are ever made public, we need to separate internal clientListeners from app ones
            plugInto.ion(listeners);
        }
    }

    /**
     * Applies config as found in plugInto.pluginConfig, or published all if no config found.
     * @private
     * @param {Object} plugInto Target instance to plug into
     */
    applyPluginConfig(plugInto) {
        const
            me     = this,
            config = me.pluginConfig || me.constructor.pluginConfig;

        if (config) {
            const { assign, after, before, override } = config;

            assign && me.applyAssign(plugInto, assign);
            after && me.applyAfter(plugInto, after);
            before && me.applyAfter(plugInto, before, false);
            override && me.applyOverride(plugInto, override);
        }
    }

    /**
     * Applies assigning for specified functions.
     * @param {Object} plugInto Instance to apply assignments to
     * @param {String[]} fnNames Array of function names to assign
     * @private
     */
    applyAssign(plugInto, fnNames) {
        fnNames.forEach(fnName => this.assign(plugInto, fnName));
    }

    /**
     * Applies after/before hooks for specified functions.
     * @param {Object} plugInto Instance to apply chaining to
     * @param {String[]|Object} functions Array of function names or a map of function names to target names
     * @param {Boolean} [after=true] Whether to chain after the original function
     * @private
     */
    applyAfter(plugInto, functions, after = true) {
        if (Array.isArray(functions)) {
            for (const fnName of functions) {
                this.doAfterHook(plugInto, fnName, fnName, after);
            }
        }
        else {
            for (const intoName in functions) {
                this.doAfterHook(plugInto, intoName, functions[intoName], after);
            }
        }
    }

    /**
     * Applies override for specified functions.
     * @param {Object} plugInto Instance to apply overrides to
     * @param {String[]} fnNames Array of function names to override
     * @private
     */
    applyOverride(plugInto, fnNames) {
        const me = this;

        if (!me.overridden) {
            me.overridden = {};
        }

        fnNames.forEach(fnName => {
            const
                pluginDescriptor = getDescriptor(me, fnName),
                targetDescriptor = getDescriptor(plugInto, fnName);

            // Check if it's a getter/setter override
            if (pluginDescriptor) {
                // Store original getter/setter if target has one
                if (targetDescriptor) {
                    Object.defineProperty(me.overridden, fnName, {
                        configurable : true,
                        enumerable   : true,
                        get          : targetDescriptor.get?.bind(plugInto),
                        set          : targetDescriptor.set?.bind(plugInto)
                    });
                }

                // Define the overriding getter/setter on target
                const boundGet = pluginDescriptor.get?.bind(me);

                if (boundGet) {
                    boundGet.$plugin = me;
                }

                Object.defineProperty(plugInto, fnName, {
                    configurable : true,
                    enumerable   : true,
                    get          : boundGet,
                    set          : pluginDescriptor.set?.bind(me)
                });
            }
            // Function override
            else {
                if (!me[fnName]) {
                    throw new Error(`Trying to override fn ${plugInto.$$name}#${fnName}, but plugin fn ${me.$$name}#${fnName} does not exist`);
                }

                if (typeof plugInto[fnName] === 'function') {
                    const stored = plugInto[fnName].bind(plugInto);

                    // Preserve $plugin tag for stacked override tracking
                    if (plugInto[fnName].$plugin) {
                        stored.$plugin = plugInto[fnName].$plugin;
                    }

                    me.overridden[fnName] = stored;
                }

                const boundFn = me[fnName].bind(me);

                boundFn.$plugin = me;
                plugInto[fnName] = boundFn;
            }
        });
    }

    /**
     * Assigns specified functions.
     * @param {Object} plugInto Instance to assign functions to
     * @param {String} fnName Name of the function to assign
     * @private
     */
    assign(plugInto, fnName) {
        const
            me       = this,
            property = getDescriptor(me, fnName);

        if (property) {
            // getter/setter, define corresponding property on target
            Object.defineProperty(plugInto, fnName, {
                configurable : true,
                enumerable   : true,
                get          : property.get && property.get.bind(me),
                set          : property.set && property.set.bind(me)
            });
        }
        else {
            plugInto[fnName] = me[fnName].bind(me);
        }
    }

    //endregion

    //region Hooking

    /**
     * Hooks functions. When the function is called on the target class all functions in the hook chain will be called
     * in the order they were added.
     * @param {Object} plugInto Instance to chain functions onto
     * @param {String|Object} intoName Name of the target function or object with fn property
     * @param {String|Object} hookName Name of the function to add to the chain or object with fn and prio
     * @param {Boolean} [after=true] Whether to add the function after the existing chain
     * @private
     */
    doAfterHook(plugInto, intoName, hookName, runAfter = true) {
        // default hook prio
        let prio = 0;

        if (typeof intoName === 'object') {
            intoName = intoName.fn;
        }

        // if hook is provided as an object
        if (typeof hookName === 'object') {
            // hook prio to order runs
            prio = hookName.prio || 0;
            hookName = hookName.fn;
        }

        const
            me                  = this,
            chains              = plugInto.pluginFunctionChain || (plugInto.pluginFunctionChain = {}),
            hookFn              =
                //<debug>
                // Previously, RowManager was (mistakenly) using after to put a getter on
                // the grid. This will ensure that property getters are not passed in as
                // before/after hooks:
                !getDescriptor(me, hookName) &&
                //</debug>
                me[hookName] && me[hookName].bind(me),
            // Grab the fn so that we won't need our this pointer to call it. This is due
            // to this instance possibly being destroyed by the time a chain call is made.
            functionChainRunner = me.functionChainRunner;

        if (!hookFn) {
            throw new Error(`Trying to hook fn ${plugInto.$$name}#${hookName}, but plugin fn ${me.$$name}#${hookName} does not exist`);
        }

        if (!chains[intoName]) {
            let intoFn = plugInto[intoName];

            if (intoFn) {
                intoFn = intoFn.bind(plugInto);
                intoFn.$this = plugInto;
                // use default prio
                intoFn.$prio = 0;
            }

            chains[intoName] = intoFn ? [intoFn] : [];

            plugInto[intoName] = (...params) => functionChainRunner(chains[intoName], params);
        }

        hookFn.$this = me;
        hookFn.$prio = prio;
        chains[intoName][runAfter ? 'push' : 'unshift'](hookFn);
        chains[intoName].$sorted = false;
    }

    /**
     * Used to run multiple plugged in functions with the same name, see after() above. Returning false from a
     * function will abort the hook chain.
     * @private
     * @param {Array} chain
     * @param {Array} params
     * @returns {*} value returned from last function in hook chain (or false if any returns false)
     */
    functionChainRunner(chain, params) {
        // NOTE: even though we are an instance method, we must not use our "this" pointer
        // since our instance may be destroyed. We cope with that by receiving parameters
        // for everything we need (so we're just a pure function).
        let fn, i, returnValue;

        // sort hooks by prio before running them
        if (!chain.$sorted) {
            chain.sort((a, b) => b.$prio - a.$prio);
            chain.$sorted = true;
        }

        for (i = 0; i < chain.length; i++) {
            fn = chain[i];

            // Feature hooks remain in place even after GridBase loops and destroys its
            // features, so skip over any destroyed features on the chain. In particular,
            // bindStore hooks will be called when GridBase sets store to null.
            if (!fn.$this.isDestroyed) {
                returnValue = fn(...params);

                if (returnValue === false) {
                    break;
                }
            }
        }

        return returnValue;
    }

    //endregion

    doDestroy() {
        const
            me                     = this,
            { client, overridden } = me;

        if (client && !client.isDestroyed && !client.isDestroying) {
            const config = me.pluginConfig || me.constructor.pluginConfig;

            if (config) {
                // Restore overridden functions/properties to their originals
                if (config.override && overridden) {
                    for (const fnName of config.override) {
                        // Only restore if we are still the active override.
                        // Another plugin may have overridden on top of us.
                        const current = Object.getOwnPropertyDescriptor(client, fnName);

                        if ((current?.value?.$plugin || current?.get?.$plugin) !== me) {
                            // Not the active override. Splice ourselves out of the chain
                            // so the plugin above us calls our original instead of our method.
                            if (fnName in overridden && client.plugins) {
                                for (const name in client.plugins) {
                                    const other = client.plugins[name];

                                    if (other !== me && other.overridden?.[fnName]?.$plugin === me) {
                                        other.overridden[fnName] = overridden[fnName];
                                        break;
                                    }
                                }
                            }
                            continue;
                        }

                        if (fnName in overridden) {
                            const descriptor = Object.getOwnPropertyDescriptor(overridden, fnName);

                            // Getter/setter override - restore original accessors
                            if (descriptor.get || descriptor.set) {
                                Object.defineProperty(client, fnName, {
                                    configurable : true,
                                    enumerable   : true,
                                    get          : descriptor.get,
                                    set          : descriptor.set
                                });
                            }
                            // Function override - restore original function
                            else {
                                client[fnName] = overridden[fnName];
                            }
                        }
                        else {
                            // No original existed before our override, remove it
                            delete client[fnName];
                        }
                    }
                }

                // Remove assigned functions/properties
                if (config.assign) {
                    for (const fnName of config.assign) {
                        delete client[fnName];
                    }
                }
            }

            // Remove entries from before/after hook chains
            const chains = client.pluginFunctionChain;

            if (chains) {
                for (const name in chains) {
                    const chain = chains[name];

                    for (let i = chain.length - 1; i >= 0; i--) {
                        if (chain[i].$this === me) {
                            chain.splice(i, 1);
                        }
                    }

                    // If only the original function remains, restore it directly
                    if (chain.length === 1 && chain[0].$this === client) {
                        client[name] = chain[0];
                        delete chains[name];
                    }
                    // If chain is empty (no original existed), remove the chain runner
                    else if (!chain.length) {
                        delete client[name];
                        delete chains[name];
                    }
                }
            }

            if (client.plugins?.[me.$$name]) {
                delete client.plugins[me.$$name];
            }
        }

        super.doDestroy();
    }

    /**
     * Called when disabling/enabling the plugin/feature, not intended to be called directly. To enable or disable a
     * plugin/feature, see {@link #property-disabled}.
     *
     * By default removes the cls of the plugin from its client. Override in subclasses to take any other actions necessary.
     * @category Misc
     * @advanced
     */
    doDisable(disable) {
        const
            me              = this,
            { constructor } = me,
            // _element to not flush composable
            element         = me.client?._element,
            key             = StringHelper.uncapitalize(me.$$name);

        // Clients without an element (stores) have no cls to toggle
        if (element) {
            const cls = 'featureClass' in constructor ? constructor.featureClass : StringHelper.cls`b-${me.$$cssName}`;

            // Some features do not use a cls
            if (cls) {
                element.classList[disable ? 'remove' : 'add'](cls);
                element.classList[disable ? 'add' : 'remove'](`${cls}-disabled`);
            }
        }

        if (!me.isConfiguring) {
            if (disable) {
                /**
                 * Fired when the plugin/feature is disabled.
                 * @event disable
                 * @param {Core.mixin.InstancePlugin} source
                 */
                me.trigger('disable');
            }
            else {
                /**
                 * Fired when the plugin/feature is enabled.
                 * @event enable
                 * @param {Core.mixin.InstancePlugin} source
                 */
                me.trigger('enable');
            }

            // Enable/disable in other splits, if any
            me.client.syncSplits?.(other => {
                // Might be a plugin that is not a feature (there is no Feature baseclass in Grid)
                const otherFeature = other.features[key];
                if (otherFeature) {
                    otherFeature.disabled = disable;
                }
            });
        }
    }

    // A plugin inactivated by its tier stays disabled, so `enabled` / `disabled` report its real state
    changeDisabled(disabled) {
        // Never return undefined, Config treats that as the changer having handled the value
        return this.isTierBlocked || (disabled ?? false);
    }

    updateDisabled(disabled) {
        // A tier blocked plugin must have no side effects on its client
        if (!this.isTierBlocked) {
            this.doDisable(disabled);
        }
    }

    throwOverrideIsMissing(data) {
        throw new Error(`Trying to override fn ${data.plugIntoName}#${data.fnName}, but plugin fn ${data.pluginName}#${data.fnName} does not exist`);
    }

    // Convenience method to read the rootElement from the owner widget
    get rootElement() {
        return this.client.rootElement;
    }

    get state() {
        return this.constructor.stateProperties?.reduce((acc, prop) => {
            acc[prop] = this[prop];
            return acc;
        }, {});
    }

    get dateHelper() {
        return this.client?.dateHelper ?? super.dateHelper;
    }
}
