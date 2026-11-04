import Base from '../Base.js';
import DynamicObject from '../util/DynamicObject.js';
import StringHelper from '../helper/StringHelper.js';
import MessageDialog from '../widget/MessageDialog.js';

/**
 * @module Core/mixin/Featureable
 */

// Distribution tiers in cumulative order — a tier includes everything from the tiers before it
const tierNames = ['community', 'business', 'enterprise'];

// The dialog naming features not shipped on the tier the app runs on is shown once per page load
let dialogShown = false;

/**
 * This mixin provides management of a set of features that can be manipulated via the `features` config.
 *
 * The first step in using `Featureable` is to define the family of features using `Factoryable` to declare a base
 * class for features to extend:
 *
 * ```javascript
 *  class SuperWidgetFeature extends InstancePlugin.mixin(Factoryable) {
 *      static get factoryable() {
 *          //
 *      }
 *  }
 * ```
 *
 * The various feature classes extend the `SuperWidgetFeature` base class and call `initClass()` to register themselves:
 *
 * ```javascript
 *  export default class AmazingSuperWidgetFeature extends SuperWidgetFeature {
 *      static get type() {
 *          return 'amazing';
 *      }
 *  }
 *
 *  AmazingSuperWidgetFeature.initClass();
 * ```
 *
 * A class that supports these features via `Featureable` is declared like so:
 *
 * ```javascript
 *  class SuperWidget extends Widget.mixin(Featureable) {
 *      static get featureable() {
 *          return {
 *              factory : SuperWidgetFeature
 *          };
 *      }
 *
 *      static configurable = {
 *          // Declare the default features. These can be disabled by setting them to a falsy value. Using
 *          // configurable(), the value defined by this class is merged with values defined by derived classes
 *          // and ultimately the instance.
 *          features : {
 *              amazing : {
 *                  ...
 *              }
 *          }
 *      };
 *  }
 * ```
 *
 * @mixin
 * @internal
 */
export default Target => class Featureable extends (Target || Base) {
    static $name = 'Featureable';

    static configurable = {
        /**
         * Specifies the features to create and associate with the instance. The keys of this object are the names
         * of features. The values are config objects for those feature instances.
         *
         * After construction, this property can be used to access the feature instances, reconfigure them, and
         * add new features.
         *
         * For example:
         * ```
         *  instance.features.amazing = {
         *      // reconfigure this feature
         *  }
         * ```
         * This can also be done in bulk:
         * ```
         *  instance.features = {
         *      amazing : {
         *          // reconfigure this feature
         *      },
         *      // reconfigure other features
         *  }
         * ```
         * Assigning to this property merges: features not mentioned in the assigned object are left as they are,
         * names not present before are created (see also {@link #function-addFeature}, which validates the names
         * and returns the created instances), and setting a feature to `null` removes it.
         * @prp {Object}
         */
        features : null
    };

    static get declarable() {
        return [
            /**
             * This property getter returns options that control feature management for the derived class. This
             * property getter must be defined by the class that mixes in `Featureable` in order to initialize the
             * class properly.
             * ```
             *  class SuperWidget extends Widget.mixin(Featureable) {
             *      static get featureable() {
             *          return {
             *              factory : SuperWidgetFeature
             *          };
             *      }
             *      ...
             *  }
             * ```
             * @static
             * @member {Object} featureable
             * @property {Core.mixin.Factoryable} featureable.factory The factoryable class (not one of its instances)
             * that will be used to create feature instances.
             * @property {String} [featureable.ownerName='client'] The config or property to assign on each feature as
             * a reference to its creator, the `Featureable` instance.
             * @property {Function} [featureable.transform] Optional transform function passed to DynamicObject to
             * convert shorthand feature configs (e.g. strings, functions) into config objects.
             * @internal
             */
            'featureable'
        ];
    }

    static setupFeatureable(cls) {
        const featureable = {
            ownerName : 'client',
            ...cls.featureable
        };

        featureable.factory.initClass();

        // Replace the class/static getter with a new one that returns the complete featureable object:
        Reflect.defineProperty(cls, 'featureable', {
            get() {
                return featureable;
            }
        });
    }

    doDestroy() {
        const features = this.features;

        // Destroy features before super so they can still access client state (columns, stores).
        for (const name in features) {
            const feature = features[name];
            // ?.() guards features already destroyed by a subclass (e.g. GridBase destroys before columns)
            feature.destroy?.();
        }

        this.$features = null;

        super.doDestroy();
    }

    /**
     * Returns `true` if the specified feature is active for this instance and `false` otherwise.
     * @param {String} name The feature name
     * @returns {Boolean}
     */
    hasFeature(name) {
        const { features } = this;

        if (features) {
            const featureProp = Object.getOwnPropertyDescriptor(features, name);

            if (featureProp) {
                // Do not force creation of the feature
                return Boolean(featureProp.value || featureProp.get);
            }
        }
        return false;
    }

    /**
     * Adds one or more features to this instance at runtime, and returns the created feature instances. This is
     * a validating convenience over assigning to the {@link #config-features} property, which merges the
     * assigned object into the current set of features:
     *
     * ```javascript
     * const { sort } = grid.addFeature({ sort : { prioritizeColumns : true } });
     *
     * // Several at once, same shape as the `features` config — `true` means default config
     * grid.addFeature({
     *     sort   : true,
     *     stripe : { disabled : true }
     * });
     * ```
     *
     * A feature that already exists is reconfigured with the passed config, exactly as a `features` assignment
     * would. Unknown feature names throw before any state is changed, except names of features that are not
     * available on the current product tier — those are skipped, and a dialog names the tier they require,
     * exactly as a `features` assignment would. To remove a feature, assign `null` to it on the `features`
     * property instead.
     *
     * Fires {@link #event-featureAdd} once per feature instance the call creates.
     *
     * @param {Object} features An object mapping feature names to their configs, or `true` for defaults.
     * Falsy configs are rejected — pass `{ disabled : true }` to add a disabled feature.
     * @returns {Object<String,Core.mixin.InstancePlugin>} An object mapping each name to its feature instance.
     * @throws {Error} If a feature name is not registered with this class's feature factory.
     * @throws {Error} If a feature config is falsy.
     * @fires featureAdd
     * @category Features
     */
    addFeature(features) {
        const
            me          = this,
            { factory } = me.constructor.featureable;

        if (me.isDestroyed) {
            return;
        }

        if (!features || typeof features !== 'object') {
            throw new Error('addFeature: expects an object mapping feature names to their configs, ' +
                'e.g. addFeature({ sort : true })');
        }

        for (const name in features) {
            if (!features[name]) {
                throw new Error(`addFeature: config for "${name}" must be truthy — pass { disabled : true } to ` +
                    `add a disabled feature, or assign null to features.${name} to remove one`);
            }

            if (!me.hasFeature(name) && !factory.resolveType(name, true) && !me.resolveUnavailableFeatureTier(name)) {
                throw new Error(`addFeature: unknown feature type "${name}"`);
            }
        }

        // The features setter merges, so this adds new features and reconfigures existing ones
        me.features = features;

        return Object.keys(features).reduce((result, name) => (result[name] = me.features[name], result), {});
    }

    /**
     * Fired when a feature is added to this instance at runtime — via {@link #function-addFeature}, by assigning
     * to the {@link #config-features} property, or by assigning a new feature name on the `features` object.
     * Does not fire for the features created from the initial configuration.
     * @event featureAdd
     * @param {Core.widget.Widget} source This instance.
     * @param {String} name The name under which the feature was added.
     * @param {Core.mixin.InstancePlugin} feature The newly created feature instance.
     */

    /**
     * Returns `true` if the specified feature is included and enabled.
     * @param {String} name The feature name
     * @returns {Boolean}
     */
    hasActiveFeature(name) {
        const { features } = this;

        if (features) {
            const featureProp = Object.getOwnPropertyDescriptor(features, name);

            if (featureProp) {
                // Already instantiated (skips the PENDING Symbol sentinel) -- check enabled directly
                if (featureProp.value && typeof featureProp.value === 'object') {
                    return featureProp.value.enabled;
                }

                // Still lazy (getter or PENDING value) -- check initial config without instantiating
                if (featureProp.get || featureProp.value) {
                    const config = this.initialConfig?.features?.[name];

                    // A feature configured as an object with disabled:true is off
                    return !(typeof config === 'object' && config?.disabled);
                }
            }
        }
        return false;
    }

    /**
     * Resolves a feature's `static defaultEnabled` declaration to a boolean for an owner.
     *
     * A boolean applies everywhere. An object keyed by tier name (`community`, `business`, `enterprise`) is
     * cumulative: the value of the nearest key at or below the owner's tier wins, and with no such key the feature is
     * off. An object keyed by container class name (`SchedulerBase`, `TreeGrid`, ...) picks the most derived name
     * present in the owner's class hierarchy, and its value is in turn a boolean or a tier map. A container with no
     * matching key gets the feature off:
     *
     * ```javascript
     * static defaultEnabled = { enterprise : true }; // enterprise tier only static defaultEnabled = { GanttBase : true
     * }; // Gantt only static defaultEnabled = { SchedulerBase : { community : true, enterprise : false } }; static
     * defaultEnabled = { GridBase : true, TreeGrid : false }; // most derived wins
     * ```
     * @param {Boolean|Object} defaultEnabled The feature class's `static defaultEnabled` value
     * @param {'community'|'business'|'enterprise'} [tier] The owner's tier, defaults to `'community'`
     * @param {String[]} [ownerTypeNames] The owner's class hierarchy names (from `$meta.names`)
     * @returns {Boolean} `true` when the feature is on by default for this owner
     * @internal
     */
    static resolveDefaultEnabled(defaultEnabled, tier, ownerTypeNames) {
        if (!defaultEnabled || typeof defaultEnabled !== 'object') {
            return Boolean(defaultEnabled);
        }

        // Keyed by container rather than by tier: resolve the most derived matching name, then recurse
        // into its value
        if (!tierNames.some(name => name in defaultEnabled)) {
            for (let i = (ownerTypeNames?.length ?? 0) - 1; i >= 0; i--) {
                if (ownerTypeNames[i] in defaultEnabled) {
                    return this.resolveDefaultEnabled(defaultEnabled[ownerTypeNames[i]], tier);
                }
            }

            return false;
        }

        // `tier` is nullable on Tierable, and an owner that does not mix it in has none at all. Both mean
        // "lowest tier" - without this, an unknown tier would turn every tier-keyed default off.
        for (let i = tierNames.indexOf(tier ?? 'community'); i >= 0; i--) {
            if (tierNames[i] in defaultEnabled) {
                return Boolean(defaultEnabled[tierNames[i]]);
            }
        }

        // No key at or below the tier, so the feature is off by default
        return false;
    }

    /**
     * Collects features registered in the factory that are on by default (their `defaultEnabled`
     * resolves to `true` for the owner's tier).
     *
     * A product-level override of a type wins over the base registration (GanttFeature's `cellEdit` over
     * GridFeature's), but the result lists base factory features first, matching the order features were
     * created in before 8.0. That order is visible: features rendering their own canvas (the time range
     * features) stack in creation order.
     *
     * A feature that is on by default may declare `static replaces` - the type names of features it
     * supersedes. Those are then not on by default for the same owner, so a Gantt's `taskMenu` keeps the
     * Grid `cellMenu` off without either the container or the Grid feature knowing about it.
     * @param {Object} featureable The featureable config
     * @param {String[]} [ownerTypeNames] The owner's class hierarchy names (from `$meta.names`)
     * @param {'community'|'business'|'enterprise'} [tier] The owner's tier, used to resolve tier-keyed
     * `defaultEnabled` declarations
     * @returns {Object} `{ enabled }` map of feature type names that are on by default
     * @private
     */
    static collectRegisteredFeatures(featureable, ownerTypeNames, tier) {
        const
            me          = this,
            { factory } = featureable,
            // Lowercased type -> winning class. Lowercasing skips caseless aliases ('cellEdit'/'celledit')
            winners     = new Map(),
            // Registries from most to least specific factory
            registries  = [],
            enabled     = {},
            replaced    = new Set();

        // Most specific factory first, so that a product override of a type wins
        function collect(factoryable) {
            if (!factoryable) {
                return;
            }

            const { registry } = factoryable;

            registries.push(registry);

            for (const type in registry) {
                const lowerType = type.toLowerCase();

                if (!winners.has(lowerType)) {
                    winners.set(lowerType, registry[type]);
                }
            }

            for (const base of factoryable.extends || []) {
                collect(base.factoryable);
            }
        }

        collect(factory.factoryable);

        // Least specific factory first for the creation order
        for (let i = registries.length - 1; i >= 0; i--) {
            for (const type in registries[i]) {
                const
                    lowerType = type.toLowerCase(),
                    cls       = winners.get(lowerType);

                // Already handled at a less specific level
                if (!cls) {
                    continue;
                }

                winners.delete(lowerType);

                if (me.resolveDefaultEnabled(cls.defaultEnabled, tier, ownerTypeNames)) {
                    // Use canonical static type (not the alias registry key) to match feature config keys
                    enabled[cls.type || type] = true;

                    if (cls.replaces) {
                        [].concat(cls.replaces).forEach(name => replaced.add(name));
                    }
                }
            }
        }

        for (const name of replaced) {
            delete enabled[name];
        }

        return { enabled };
    }

    /**
     * The tier a feature type ships on, from the `featureTiers` declared by `factory` and the factories it extends.
     * @param {Core.mixin.Factoryable} factory The feature factory
     * @param {String} type The feature type name
     * @returns {'community'|'business'|'enterprise'|null} The tier, or `null` for a type no factory knows of
     * @internal
     */
    static resolveFeatureTier(factory, type) {
        const
            { featureTiers } = factory,
            // Feature type names are caseless
            key              = featureTiers && Object.keys(featureTiers).find(name => name.toLowerCase() === type.toLowerCase());

        if (key) {
            return featureTiers[key];
        }

        for (const base of factory.factoryable.extends || []) {
            const tier = this.resolveFeatureTier(base, type);

            if (tier) {
                return tier;
            }
        }

        return null;
    }

    /**
     * The tier a feature type requires, if it is above the tier this instance runs on.
     * @param {String} type The feature type name
     * @returns {'business'|'enterprise'|null} The required tier, or `null` if this instance's tier includes the type
     * @internal
     */
    resolveUnavailableFeatureTier(type) {
        const tier = this.constructor.resolveFeatureTier(this.constructor.featureable.factory, type);

        return tierNames.indexOf(tier) > tierNames.indexOf(this.tier ?? 'community') ? tier : null;
    }

    /**
     * Inactivates features the tier build did not ship: types the factory cannot resolve, but whose tier a
     * `featureTiers` declaration knows of and places above the tier the app runs on. Those the app asked for are
     * logged and, once per page load, listed in a dialog naming the tier they require. Other unresolved types, such as
     * a feature the app's tier includes but that was not imported, are left in place for the factory to throw on.
     * @param {Object} features The features config being applied
     * @internal
     */
    stripUnavailableFeatures(features) {
        const
            me          = this,
            { factory } = me.constructor.featureable,
            clientTier  = StringHelper.capitalize(me.tier ?? 'community'),
            unavailable = [];

        for (const name in features) {
            if (features[name] && !factory.resolveType(name, /* optional = */true)) {
                const tier = me.resolveUnavailableFeatureTier(name);

                if (tier) {
                    // Class defaults naming an unavailable feature are dropped silently, only the app's own request
                    // is reported
                    if (!me.isConfiguring || me.initialConfig?.features?.[name]) {
                        unavailable.push(`<li><b>${StringHelper.encodeHtml(name)}</b> requires the ${StringHelper.capitalize(tier)} tier</li>`);
                    }

                    // Assigning rather than deleting, since class defaults are inherited through a prototype chain
                    features[name] = null;
                }
            }
        }

        // The features config is processed in one go, so one dialog covers every unavailable feature of the widget
        if (unavailable.length && !dialogShown) {
            dialogShown = true;

            MessageDialog.alert({
                title   : 'Features unavailable on this tier',
                message : `<p>The following features are unavailable on the <b>${clientTier}</b> tier:</p><ul>${unavailable.join('')}</ul>`
            });
        }
    }

    changeFeatures(features, was) {
        // EventList extends Grid, we need to let it handle the changeFeatures call.
        if (super.changeFeatures) {
            return super.changeFeatures(features, was);
        }

        if (this.isDestroying) {
            return;
        }

        const
            me = this,
            { featureable } = me.constructor,
            manager = me.$features || (me.$features = new DynamicObject({
                configName : 'features',
                factory    : featureable.factory,
                owner      : me,
                ownerName  : featureable.ownerName,
                transform  : featureable.transform,
                created    : (instance, name) => me.onFeatureCreated(instance, name)
            }));

        // If factory supports self-declared defaults (defaultEnabled property), merge them in.
        // Only on first call (no `was`) and only for features not already configured.
        if (!was && features && featureable.factory.defaultEnabled !== undefined) {
            const { enabled } = me.constructor.collectRegisteredFeatures(
                featureable, me.constructor.$meta?.names, me.tier
            );

            // Auto-enable features that declare defaultEnabled = true
            for (const name in enabled) {
                if (!(name in features)) {
                    features[name] = true;
                }
            }
        }

        features && me.stripUnavailableFeatures(features);

        // Collect the features this update creates, to call afterFeatureAdd once for the whole batch —
        // a DOM refresh per added feature would be wasteful for a multi-feature assignment.
        const
            previousBatch = me.$featureAddBatch,
            batch         = me.$featureAddBatch = [];

        try {
            // DynamicObject coerces a `false` feature to `null` and never instantiates it, so `features.X`
            // resolves to `undefined` (falsy), as truthiness checks rely on.
            manager.update(features);
        }
        finally {
            me.$featureAddBatch = previousBatch;
        }

        if (batch.length) {
            me.afterFeatureAdd?.(batch);
        }

        if (!was) {
            // Return the target only on the first call. Returning it again would pass the === test and
            // skip onConfigChange, so later calls return undefined.
            return manager.target;
        }
    }

    afterConfigure() {
        super.afterConfigure();
        this.$featuresInitialized = true;
    }

    // Called by the $features manager for every feature it creates, on all creation paths. Features created
    // after initial configuration fire featureAdd and notify the host's afterFeatureAdd(addedNames) hook —
    // deferred into one batched call by changeFeatures() during a bulk update.
    onFeatureCreated(feature, name) {
        const me = this;

        if (me.$featuresInitialized && !me.isDestroying) {
            me.trigger?.('featureAdd', { name, feature });

            if (me.$featureAddBatch) {
                me.$featureAddBatch.push(name);
            }
            else {
                me.afterFeatureAdd?.([name]);
            }
        }
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}

    getCurrentConfig(options) {
        const
            result          = super.getCurrentConfig(options),
            initialFeatures = this.initialConfig?.features;

        let { features } = result;

        if (features) {
            for (const featureName in features) {
                const featureConfig = features[featureName];

                if (featureConfig && typeof featureConfig === 'object' && Object.keys(featureConfig).length === 0) {
                    // Empty config: use the instance constructor to check defaultEnabled, since the
                    // factory registry may live on a parent factory level.
                    const featureClass = this.features?.[featureName]?.constructor;

                    if (featureClass && this.constructor.resolveDefaultEnabled(
                        featureClass.defaultEnabled, this.tier, this.constructor.$meta?.names)) {
                        // Default-on feature with default config — exclude from output
                        delete features[featureName];
                    }
                    else {
                        features[featureName] = true;
                    }
                }
            }
        }

        // Disabled (`false`) features are never instantiated and so absent from serialized `features`.
        // Re-surface them as `false` to round-trip, matching legacy GridFeatureManager behavior.
        if (initialFeatures) {
            for (const featureName in initialFeatures) {
                if (initialFeatures[featureName] === false) {
                    (features || (features = result.features = {}))[featureName] = false;
                }
            }
        }

        return result;
    }
};
