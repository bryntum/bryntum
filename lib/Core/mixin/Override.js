import VersionHelper from '../helper/VersionHelper.js';

/**
 * @module Core/mixin/Override
 */

const excludedPropNames = {
    constructor : 1,
    prototype   : 1,
    name        : 1,
    length      : 1,
    arguments   : 1,
    caller      : 1,
    callee      : 1,
    __proto__   : 1
};

/**
 * Simplifies overriding class methods by allowing methods from another class to be used as overrides. Overrides are
 * defined as own classes. They must at a minimum contain a static getter named `target`, which should return an object
 * with the class to override. Apply the override by calling {@link #function-apply-static apply()}.
 *
 * Versions can be specified in the override target config to only apply the override for specific product versions.
 * Both `minVersion` and `maxVersion` are **inclusive** - the override will be applied when the current product version
 * falls within the range `[minVersion, maxVersion]`. Alternatively, use `fixedIn` which is **exclusive** - the override
 * will NOT apply on that version or newer.
 *
 * ```javascript
 * class TemplateColumnOverride {
 *     static get target() {
 *         return {
 *             class      : TemplateColumn,
 *             product    : 'grid',
 *             minVersion : '1.0',
 *             maxVersion : '1.5'
 *         }
 *     }
 *
 *     renderer(renderData) {
 *         // call overridden function (optional)
 *         const value = this._overridden.renderer.call(this, renderData);
 *
 *         return 'HELLO' + value;
 *     }
 * }
 * Override.apply(TemplateColumnOverride);
 * ```
 *
 * ## See also
 *
 * - {@link Core.mixin.InstancePlugin} - Plugin base class for extending widgets
 *
 * @non-mixin
 */
export default class Override {
    /**
     * Apply override. We strongly suggest that you at least specify `fixedIn` for your overrides, to auto-disable
     * the override when upgrading to the version that includes the official fix.
     *
     * `fixedIn` is **exclusive** — the override will NOT apply on that version or newer.
     * `minVersion` is **inclusive** — the override will only apply on that version or newer.
     *
     * ```javascript
     * class OriginalOverride {
     *     static get target() {
     *         return {
     *             class      : Original,
     *             product    : 'grid',
     *             minVersion : '1.0',
     *             fixedIn    : '1.6'
     *         }
     *     }
     * }
     * ```
     * @param {Object} override An override class definition
     */
    static apply(override) {
        if (!override.target) {
            throw new Error('Override must specify what it overrides, using static getter target');
        }
        if (!override.target.class) {
            throw new Error('Override must specify which class it overrides, using target.class');
        }

        if (!this.shouldApplyOverride(override)) {
            return false;
        }

        const
            staticKeys   = Object.getOwnPropertyNames(override),
            instanceKeys = Object.getOwnPropertyNames(override.prototype);

        staticKeys.splice(staticKeys.indexOf('target'), 1);

        this.internalOverrideAll(override.target.class, staticKeys, override);
        this.internalOverrideAll(override.target.class.prototype, instanceKeys, override.prototype);

        return true;
    }

    static internalOverrideAll(targetClass, properties, overrideDefinition) {
        if (targetClass == null) {
            return;
        }

        Reflect.ownKeys(overrideDefinition).forEach(key => {
            if (properties.includes(key) && !excludedPropNames[key]) {
                const desc = Object.getOwnPropertyDescriptor(overrideDefinition, key);

                // Install on the original target class (not an ancestor), so overriding an inherited member does not
                // contaminate ancestors or sibling classes.
                this.internalOverride(targetClass, key, desc);
            }
        });
    }

    static internalOverride(target, key, desc) {
        // Own `_overridden` bag chained to the ancestor's bag, so originals captured higher up the prototype chain
        // stay reachable via `this._overridden.method` from a subclass whose own bag captured a different method
        const overrides = Object.prototype.hasOwnProperty.call(target, '_overridden') ? target._overridden : (target._overridden = Object.create(target._overridden || null));

        // Capture the resolved original value (data value, evaluated accessor snapshot, or undefined when absent)
        overrides[key] = target[key];

        // Install whatever shape the OVERRIDE declares, regardless of the original's shape
        if (desc.get || desc.set) {
            Object.defineProperty(target, key, {
                enumerable   : false,
                configurable : true,
                get          : desc.get,
                set          : desc.set
            });
        }
        else {
            target[key] = desc.value;
        }
    }

    /**
     * Checks versions if an override should be applied. Specify version in your overrides target config.
     *
     * Both `minVersion` and `maxVersion` are **inclusive** - the override will be applied when the current
     * product version falls within the range `[minVersion, maxVersion]`.
     *
     * ```javascript
     * class OriginalOverride {
     *     static get target() {
     *         return {
     *             class      : Original,
     *             product    : 'grid',
     *             minVersion : '1.0',  // inclusive: override applies to 1.0 and newer
     *             maxVersion : '1.5'   // inclusive: override applies to 1.5 and older
     *         }
     *     }
     * }
     * ```
     *
     * @param {Object} override
     * @returns {Boolean}
     * @private
     */
    static shouldApplyOverride(override) {
        const config = override.target;
        // not using versioning, allow override
        if (!config.fixedIn && !config.maxVersion && !config.minVersion) {
            return true;
        }

        //<debug>
        if (!config.product && (config.minVersion || config.maxVersion || config.fixedIn)) {
            console.warn('Override: No product specified with version constraints, defaulting to "core"');
        }
        //</debug>

        // Use config.product if specified, fall back to 'core' (all products share the same version)
        const
            product      = config.product || 'core',
            // Use $$name if available (survives minification, it is available on Bryntum classes), fall back to $name
            // (in case our pattern is used but class does not extend Base), lastly fall back to native name
            overrideName = override.$$name || override.$name || override.name,
            className    = config.class.$$name || config.class.$name || config.class.name;

        if (!VersionHelper[product]) {
            //<debug>
            console.warn(`Override: product "${product}" not found in VersionHelper, applying without version check`);
            //</debug>
            return true;
        }

        // fixedIn is exclusive - override won't apply on fixedIn version or newer
        if (config.fixedIn && !VersionHelper[product].isOlderThan(config.fixedIn)) {
            //<debug>
            console.log(`Override ${overrideName} for class ${className} is for an older version (fixed in ${config.fixedIn}) and will not be applied`);
            //</debug>
            return false;
        }

        if (config.maxVersion) {
            VersionHelper.deprecate('Core', '9.0.0', '`maxVersion` config is deprecated, use `fixedIn` instead. Note: `fixedIn` is exclusive (does not apply on the specified version or newer)');
        }

        // override is for older version, disallow (maxVersion is inclusive)
        if (config.maxVersion && VersionHelper[product].isNewerThan(config.maxVersion)) {
            //<debug>
            console.log(`Override ${overrideName} for class ${className} is for an older version of ${product} and will not be applied`);
            //</debug>
            return false;
        }

        // override is for newer version, disallow
        if (config.minVersion && VersionHelper[product].isOlderThan(config.minVersion)) {
            //<debug>
            console.log(`Override ${overrideName} for class ${className} is for a newer version of ${product} and will not be applied`);
            //</debug>
            return false;
        }

        // override is for current version, allow
        return true;
    }
}
