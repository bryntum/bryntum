import Override from './mixin/Override.js';

/**
 * @module Core/Patch
 */

/**
 * Registry-based patch system for applying bug fixes using plain objects. Internally uses
 * {@link Core.mixin.Override}.
 *
 * **USE AT OWN RISK:** Patches are provided by Bryntum support as a temporary workaround for known issues. They are
 * a best-effort solution and come with no guarantees. The APIs being patched may change between versions, and patches
 * may stop working or cause unexpected behavior. Always test thoroughly and remove patches when upgrading to a version
 * that includes the official fix.
 *
 * ## How to Apply a Patch
 *
 * When Bryntum support provides you with a patch file (a plain JavaScript module exporting a config object):
 *
 * 1. Add the patch file to your project
 * 2. Import the patch file in your app **before** creating any Bryntum widgets
 * 3. Call `bryntum.applyPatch()` with the config object
 *
 * ### Module Bundle / npm Package
 *
 * ```javascript
 * // security-patch.js — plain object, no imports needed
 * export default {
 *     fixedIn : '6.0.5',
 *
 *     Grid : {
 *         onColumnResize(column, width) {
 *             // Call the original method
 *             this._overridden.onColumnResize.call(this, column, width);
 *             this.syncPartnerRowHeights();
 *         }
 *     },
 *
 *     Column : {
 *         get width() {
 *             return this._overridden.width + 1;
 *         }
 *     }
 * };
 *
 * // app.js
 * import securityPatch from './security-patch.js';
 * bryntum.applyPatch(securityPatch);
 *
 * new Grid({ ... }); // patched
 * ```
 *
 * ### Source Import (Advanced)
 *
 * If you import from source (`lib/`), you can also use `Patch.apply()` directly:
 *
 * ```javascript
 * import Patch from 'PATH_TO_LIB/Core/lib/Core/Patch.js';
 *
 * Patch.apply({
 *     fixedIn : '6.0.5',
 *     Grid    : {
 *         onColumnResize(column, width) {
 *             this._overridden.onColumnResize.call(this, column, width);
 *             this.syncPartnerRowHeights();
 *         }
 *     }
 * });
 * ```
 *
 * ## Version Constraints
 *
 * All Bryntum products share the same version number, so there is no need to specify a product.
 *
 * - **`fixedIn`** — The patch will NOT apply on this version or newer (exclusive). Use this to auto-disable the
 *   patch when upgrading to the version that includes the official fix.
 * - **`minVersion`** — The patch will NOT apply on versions older than this (inclusive).
 *
 * ## Calling the Original Method
 *
 * Inside a patched method, use `this._overridden` to access the original implementation:
 *
 * ```javascript
 * {
 *     someMethod(...args) {
 *         // Call the original
 *         const result = this._overridden.someMethod.call(this, ...args);
 *         // Add your fix
 *         return result + 1;
 *     }
 * }
 * ```
 *
 * ## Multiple Patches (Stacking)
 *
 * When multiple patches target the same method on the same class, they form a chain. Each patch wraps the previous
 * one, so `this._overridden.methodName` calls the previous layer's version — not necessarily the original
 * implementation. The call order is last-applied patch first (outermost), working inward to the original method:
 *
 * ```javascript
 * // Patch A applied first
 * bryntum.applyPatch({
 *     Grid : {
 *         render() {
 *             console.log('Patch A before');
 *             this._overridden.render.call(this); // calls original
 *             console.log('Patch A after');
 *         }
 *     }
 * });
 *
 * // Patch B applied second — wraps Patch A
 * bryntum.applyPatch({
 *     Grid : {
 *         render() {
 *             console.log('Patch B before');
 *             this._overridden.render.call(this); // calls Patch A's render
 *             console.log('Patch B after');
 *         }
 *     }
 * });
 *
 * // Calling grid.render() produces:
 * // "Patch B before" → "Patch A before" → original render → "Patch A after" → "Patch B after"
 * ```
 *
 * ## How It Works
 *
 * 1. Call `bryntum.applyPatch(config)` with a config object containing string class names as keys
 * 2. If the class is already loaded, the patch applies immediately via {@link Core.mixin.Override}
 * 3. If the class hasn't loaded yet (e.g., patch registered before class definition runs), it is stored and
 *    auto-applied when the class initializes
 */
export default class Patch {

    // Map of class $$name to array of pending patches [{methods, versionInfo}]
    static _registry = Object.create(null);

    /**
     * Apply patches from a config object. Each key (other than version metadata) should be a class name
     * with an object of methods to override.
     *
     * @param {Object} config Patch configuration
     * @param {String} [config.minVersion] Minimum version for the patch (inclusive)
     * @param {String} [config.fixedIn] Version where the fix is included (exclusive — patch will NOT apply on this
     * version or newer)
     * @returns {Boolean} `true` if any patches were applied immediately
     */
    static apply(config) {
        const
            { minVersion, fixedIn, ...targets } = config,
            versionInfo = { minVersion, fixedIn };

        let applied = false;

        for (const [name, value] of Object.entries(targets)) {
            // Skip non-class keys (must start with uppercase)
            if (!/^[A-Z]/.test(name)) {
                //<debug>
                console.warn(`Patch: Skipping key "${name}" — class names must start with an uppercase letter`);
                //</debug>
                continue;
            }

            if (!value || typeof value !== 'object') {
                //<debug>
                console.error(`Patch: Expected an object of methods for "${name}", got ${typeof value}`);
                //</debug>
                continue;
            }

            // Registry-based format: { Grid: { method() {} } }
            const cls = globalThis.bryntum._classes?.[name];

            if (cls) {
                applied = Patch._applyToClass(cls, name, value, versionInfo) || applied;
            }
            else {
                // Defer until class registers via _onClassReady
                (Patch._registry[name] || (Patch._registry[name] = [])).push({ methods : value, versionInfo });
            }
        }

        return applied;
    }

    static _onClassReady(cls) {
        const
            name    = cls.$$name,
            pending = name && Patch._registry[name];

        if (!name || name === 'Base') {
            return;
        }

        if (pending) {
            for (const { methods, versionInfo } of pending) {
                Patch._applyToClass(cls, name, methods, versionInfo);
            }
            delete Patch._registry[name];
        }
    }

    static _applyToClass(cls, name, methods, versionInfo) {
        return Override.apply(Patch._createOverride(cls, name, methods, versionInfo));
    }

    static _createOverride(targetClass, name, methods, versionInfo) {
        class PatchOverride {
            static get target() {
                return {
                    class : targetClass,
                    ...versionInfo
                };
            }
        }

        Object.defineProperty(PatchOverride, '$name', { value : `${name}Patch` });

        const descriptors = Object.getOwnPropertyDescriptors(methods);

        for (const key of Object.keys(descriptors)) {
            const desc = descriptors[key];

            // Only copy functions and accessors, skip plain values
            if (typeof desc.value === 'function' || desc.get || desc.set) {
                Object.defineProperty(PatchOverride.prototype, key, desc);
            }
            //<debug>
            else {
                console.warn(`Patch: Skipping non-method property "${key}" on ${name}. Only functions and accessors are supported.`);
            }
            //</debug>
        }

        return PatchOverride;
    }
}

// Module-scope initialization
globalThis.bryntum = globalThis.bryntum || {};

// Hook for future class initializations (subscribe FIRST to avoid race condition)
(globalThis.bryntum._onClassReady || (globalThis.bryntum._onClassReady = [])).push(cls => Patch._onClassReady(cls));
globalThis.bryntum.applyPatch = config => Patch.apply(config);
