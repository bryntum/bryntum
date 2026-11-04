import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import Factoryable from '../../Core/mixin/Factoryable.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

/**
 * @module Grid/feature/GridFeature
 */

/**
 * The abstract base class for Grid, Scheduler and Gantt features.
 *
 * Features extending this class should declare a `static type` property (lowercase name used for the `features` config)
 * and call `initClass()` at the bottom of their module:
 *
 * ```javascript
 * export default class MyFeature extends GridFeature {
 *     static $name = 'MyFeature';
 *     static type = 'myFeature';
 * }
 *
 * MyFeature.initClass();
 * ```
 *
 * By default, features are **off** (must be explicitly configured to use). To declare a feature as **on** by default,
 * set `static defaultEnabled = true`:
 *
 * ```javascript
 * export default class Sort extends GridFeature {
 *     static $name = 'Sort';
 *     static type = 'sort';
 *     static defaultEnabled = true;
 * }
 * ```
 *
 * @extends Core/mixin/InstancePlugin
 * @mixes Core/mixin/Factoryable
 * @abstract
 */
export default class GridFeature extends InstancePlugin.mixin(Factoryable) {
    static $name = 'GridFeature';

    static get factoryable() {
        return {};
    }

    /**
     * Feature self-declares whether it is on by default. Features are off unless they say otherwise, so
     * only a feature that should be created without being asked for declares this. A container's
     * `static configurable.features` overrides it either way.
     *
     * Also accepts an object keyed by product tier (`community`, `business`, `enterprise`) for features whose
     * default state differs per tier, or keyed by container class name for features that are on by default on some
     * of the widgets that can resolve them. Tier keys are cumulative — a key applies from that tier and up until
     * overridden by a higher key. Container keys pick the most derived name in the owner's hierarchy, and their
     * values may themselves be tier maps:
     *
     * ```javascript
     * static defaultEnabled = { enterprise : true }; // enterprise tier only static defaultEnabled = { GanttBase : true
     * }; // Gantt only static defaultEnabled = { GridBase : true, TreeGrid : false }; // grids, except TreeGrid static
     * defaultEnabled = { SchedulerBase : { community : true, business : true, enterprise : false } };
     * ```
     *
     * See {@link Core.mixin.Featureable#function-resolveDefaultEnabled-static}.
     * @member {Boolean|Object} defaultEnabled
     * @static
     * @internal
     */
    static defaultEnabled = false;

    /**
     * Type names of features this one supersedes. Where this feature is on by default, the listed
     * features are not, even if they would be on their own. A Gantt's `taskMenu` declares
     * `replaces = 'cellMenu'`, so the Grid menu stays off on a Gantt without `CellMenu` or `GanttBase`
     * knowing about it. Only defaults are affected - an application may still enable both explicitly.
     * @member {String|String[]} replaces
     * @static
     * @internal
     */
    static replaces = null;

    /**
     * The product factory this feature registers itself with.
     *
     * Declaring `static type` registers the class with the factory it *inherits*. For a product-level
     * override of a base product's feature — `Gantt/feature/Labels` extending `Scheduler/feature/Labels`,
     * say — that is the *base* product's factory, so the override would replace Scheduler's registration
     * for every consumer. Declaring the owning product's factory here registers the class there instead,
     * under its inherited `type`, with lookups falling through the factory `extends` chain as usual:
     *
     * ```javascript
     * export default class Labels extends SchedulerLabels {
     *     static featureFactory = GanttFeature;
     * }
     *
     * Labels.initClass();
     * ```
     *
     * It is not inherited safely: a subclass in a further product must declare its own, otherwise it
     * registers with its parent's factory and replaces that product's registration. `register()` warns
     * about that in development builds.
     *
     * A feature shared by sibling products registers with each of their factories by returning an
     * array - `[SchedulerFeature, GanttFeature]` for a Scheduler feature the Gantt also offers.
     * @member {Core.mixin.Factoryable|Core.mixin.Factoryable[]} featureFactory
     * @static
     * @internal
     */
    static featureFactory = null;

    static featureTiers = {
        ai                : 'enterprise',
        aiFilter          : 'enterprise',
        cellCopyPaste     : 'business',
        cellTooltip       : 'business',
        charts            : 'enterprise',
        columnDragToolbar : 'business',
        columnRename      : 'business',
        excelExporter     : 'enterprise',
        fileDrop          : 'enterprise',
        fillHandle        : 'enterprise',
        filter            : 'business',
        group             : 'business',
        groupSummary      : 'enterprise',
        lockRows          : 'enterprise',
        mergeCells        : 'enterprise',
        pdfExport         : 'enterprise',
        pinColumns        : 'business',
        print             : 'enterprise',
        rowCopyPaste      : 'business',
        rowEdit           : 'enterprise',
        rowExpander       : 'enterprise',
        rowReorder        : 'enterprise',
        rowResize         : 'enterprise',
        split             : 'enterprise',
        stickyCells       : 'business',
        summary           : 'enterprise',
        treeGroup         : 'business'
    };

    static get declarable() {
        return ['featureFactory'];
    }

    // Registers a product override under its inherited type. A class that also declares its own `type`
    // is registered by Factoryable's setupType instead, which routes through register() below.
    static setupFeatureFactory(cls) {
        const { featureFactory, type } = cls;

        if (featureFactory && type && !Object.prototype.hasOwnProperty.call(cls, 'type')) {
            cls.register(type, cls, true);
        }
    }

    /**
     * Registers a feature class with this factory.
     *
     * A feature that extends this class registers itself by declaring `static type` and calling
     * `initClass()`. That works because `Factoryable` contributes `type` to the class's declarables, which
     * is what makes `Base` dispatch to `setupType()` and perform the registration.
     *
     * Some features cannot extend this class: `Core/feature/base/ContextMenuBase` and
     * `Core/feature/ai/AIBase` live in Core and are shared with the Calendar and TaskBoard feature
     * families, so they extend `InstancePlugin` instead. With no `Factoryable` in the chain, `static type`
     * on their subclasses is inert — `initClass()` is still callable (it is defined on `Base`) but
     * registers nothing. Those features hand themselves to the factory explicitly instead:
     *
     * ```javascript
     * GridFeature.register(CellMenu.type, CellMenu);
     * ```
     *
     * `Factoryable.register()` calls `initClass()` on the class it is given, so the class is still fully
     * initialized either way.
     * @param {String|String[]} type The type name(s) to register the class under
     * @param {Function} cls The feature class
     * @param {Boolean} [replace] Pass `true` to overwrite an existing registration
     * @internal
     */
    static register(type, cls, replace) {
        const factories = this.featureFactory ? [].concat(this.featureFactory) : null;

        // Route to the declaring product's factories rather than the inherited one. The identity check
        // stops the delegated calls below from recursing, since a factory inherits `featureFactory`.
        if (factories && !factories.includes(this)) {
            // <debug>
            // A class that declares its own `type` but inherits `featureFactory` registers into whichever
            // product its parent belongs to, replacing that product's registration. This is silent at
            // runtime, so flag it here rather than letting it surface as the wrong class being resolved.
            if (Object.prototype.hasOwnProperty.call(this, 'type') &&
                !Object.prototype.hasOwnProperty.call(this, 'featureFactory')) {
                console.warn(`${this.$$name} declares "static type" but inherits featureFactory ` +
                    `${factories.map(f => f.$$name).join(', ')}, so it will replace that product's "${type}" ` +
                    'registration. Declare "static featureFactory" on this class.');
            }
            // </debug>

            factories.forEach(factory => factory.register(type, cls, replace));

            return;
        }

        return super.register(type, cls, replace);
    }

    /**
     * Features are created by the owner's `DynamicObject` with a single config object carrying the
     * `client`. A shorthand config (`features : { sort : 'name' }`) arrives wrapped by
     * {@link #function-transformConfig-static} and is unwrapped here, so {@link #function-processConfig}
     * always sees what the application wrote.
     * @param {Object} config The feature config, including `client`
     * @internal
     */
    construct(config = {}) {
        const
            { client, _shorthand, ...rest } = config,
            processed                       = this.processConfig(_shorthand === undefined ? rest : _shorthand);

        // A shorthand the feature does not handle contributes nothing, matching the previous behaviour
        super.construct({ ...(ObjectHelper.isObject(processed) ? processed : null), client });
    }

    /**
     * Hook for features that accept a shorthand config, such as a field name or a function, to expand it
     * into a config object. Receives the raw value the application wrote, or the config object (without
     * `client`) when no shorthand was used.
     * @param {*} config The raw config value
     * @returns {Object} The config object to apply
     * @internal
     */
    processConfig(config) {
        return config;
    }

    /**
     * Transform function for DynamicObject. Wraps non-object config values (strings, functions, arrays)
     * into an object with `_shorthand` so that {@link #function-construct} can unwrap them.
     * @param {*} config The raw feature config value
     * @param {String} name The feature name
     * @returns {*} The config, possibly wrapped
     * @internal
     * @static
     */
    static transformConfig(config, name) {
        // Boolean values are handled natively by DynamicObject (true → {}, false/null → remove)
        // Non-object values (strings, functions) and arrays need wrapping for the Factoryable pattern.
        // Arrays must be wrapped because DynamicObject.setDefaults uses ObjectHelper.assign({}, config)
        // which converts arrays to { 0: ..., 1: ... }, destroying the array nature.
        if (config != null && config !== true && config !== false && (typeof config !== 'object' || Array.isArray(config))) {
            return { _shorthand : config };
        }
        return config;
    }
}
