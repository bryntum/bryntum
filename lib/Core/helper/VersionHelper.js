import Helpers from './Helpers.js';
import BrowserHelper from './BrowserHelper.js';
import StringHelper from './StringHelper.js';

import './ObjectHelper.js';

// Capture the URL at module load time for debugging bundle issues
// This runs once per unique import path, helping identify duplicate imports
// Extract URL from error stack trace since bundlers may transform import.meta
let currentImportUrl;
try {
    const
        stack = new Error().stack || '',
        // Match URLs in stack trace (handles both http/https and file:// protocols)
        match = stack.match(/(?:https?|file):\/\/[^\s\)]+/);
        // Remove line:column suffix (e.g., ":123:45" at the end)
    currentImportUrl = match?.[0].replace(/:\d+:\d+$/, '');
}
catch {
    // Stack trace parsing failed
}

/**
 * @module Core/helper/VersionHelper
 */

/**
 * Helper for version handling
 *
 * ```javascript
 * VersionHelper.setVersion('grid', '1.5');
 * if (VersionHelper.grid.isNewerThan('1.0')) {
 *   ...
 * }
 * ```
 *
 * @private
 */
export default class VersionHelper {
    static $name = 'VersionHelper';

    // Release date of this build as `YYYY-MM-DD`, stamped by the release process
    static releaseDate = '2026-11-03';

    /**
     * Set version for specified product
     * @private
     * @param {String} product
     * @param {String} version
     */
    static setVersion(product, version) {
        product = product.toLowerCase();

        VH[product] = {
            version,
            isNewerThan(otherVersion) {
                return VersionHelper.semanticCompareVersion(otherVersion, version, '<');
            },
            isOlderThan(otherVersion) {
                return VersionHelper.semanticCompareVersion(otherVersion, version, '>');
            }
        };

        let bundleFor = '';

        // Var productName is only defined in bundles, it is internal to bundle so not available on window. Used to
        // tell importing combinations of grid/scheduler/gantt bundles apart from loading same bundle twice
        if (typeof productName !== 'undefined') {
            // eslint-disable-next-line no-undef
            bundleFor = `${productName}.`;
        }

        // Set "global" flag to detect bundle being loaded twice
        const globalKey = `${bundleFor}${product}${version.replace(/\./g, '-')}`;

        if (BrowserHelper.isBrowserEnv && !globalThis.bryntum.silenceBundleException) {
            if (globalThis.bryntum[globalKey] === true) {
                if (this.isTestEnv) {
                    globalThis.BUNDLE_EXCEPTION = true;
                }
                else {
                    let errorProduct = bundleFor || product;

                    if (errorProduct === 'core') {
                        errorProduct = 'grid';
                    }

                    const
                        // Product name as used in docs guide paths
                        capitalized = { schedulerpro : 'SchedulerPro', taskboard : 'TaskBoard' }[errorProduct] ?? StringHelper.capitalize(errorProduct),
                        importUrls  = globalThis.bryntum.importUrls || [],
                        urlInfo     = importUrls.length > 0
                            ? `\nThe bundle was imported from these locations:\n${importUrls.map(url => `  - ${url}`).join('\n')}\n`
                            : '';

                    throw new Error(
                        `The Bryntum ${capitalized} bundle was loaded multiple times by the application.\n${urlInfo}\n` +
                        `Common reasons you are getting this error includes:\n\n` +
                        `* Imports point to different types of the bundle (e.g. *.module.js and *.umd.js)\n` +
                        `* Imports point to both sources and bundle\n` +
                        `* Imports do not use the shortest relative path, JS treats them as different files\n` +
                        `* Cache busters differ between imports, JS treats ${errorProduct}.module.js?1 and ${errorProduct}.module.js?2 as different files\n` +
                        `* Imports missing file type, verify they all end in .js\n\n` +
                        `* Combining multiple products require importing thin bundles\n\n` +
                        `See https://bryntum.com/docs/guide/${capitalized}/gettingstarted/es6bundle#troubleshooting for more information\n\n`
                    );
                }
            }
            else {
                globalThis.bryntum[globalKey] = true;
            }
        }
    }

    /**
     * Get (previously set) version for specified product
     * @private
     * @param {String} product
     */
    static getVersion(product) {
        product = product.toLowerCase();

        if (!VH[product]) {
            throw new Error([
                `No version specified for the "${product}" product!`,
                'Please check that you import VersionHelper correctly into the class from where you call `deprecate` function.'
            ].join('\n'));
        }

        return VH[product].version;
    }

    /**
     * Checks the version1 against the passed version2 using the comparison operator.
     * Supports `rc`, `beta`, `alpha` release states. Eg. `1.2.3-alpha-1`.
     * State which is not listed above means some version below `alpha`.
     * @param {String} version1 The version to test against
     * @param {String} version2 The version to test against
     * @param {String} [comparison] The comparison operator, `<=`, `<`, `=`, `>` or `>=`.
     * @returns {Boolean} `true` if the test passes.
     * @internal
     */
    static semanticCompareVersion(version1, version2, comparison = '=') {
        version1 = version1 || '';
        version2 = version2 || '';
        const
            version1Arr  = version1.split(/[-.]/),
            version2Arr  = version2.split(/[-.]/),
            isLower      = comparison.includes('<'),
            normalizeArr = (arr, maxLength) => {
                const
                    states = ['rc', 'beta', 'alpha'],
                    result = arr.map(v => {
                        if (states.includes(v)) {
                            return -states.indexOf(v) - 2;
                        }
                        const res = Number.parseInt(v);
                        return Number.isNaN(res) ? -states.length : res;
                    });

                while (result.length < maxLength) {
                    result.push(-1);
                }
                return result;
            },
            compareArr   = () => {
                const
                    maxLength = Math.max(version1Arr.length, version2Arr.length),
                    arr1      = normalizeArr(version1Arr, maxLength),
                    arr2      = normalizeArr(version2Arr, maxLength);

                for (let i = 0; i < maxLength; i++) {
                    if (arr1[i] !== arr2[i]) {
                        return isLower ? arr1[i] < arr2[i] : arr1[i] > arr2[i];
                    }
                }
                return true;
            };

        switch (comparison) {
            case '=':
                return version1 === version2;
            case '<=':
            case '>=':
                return (version1 === version2) || compareArr();
            case '<':
            case '>':
                return (version1 !== version2) && compareArr();
        }

        return false;
    }

    /**
     * Checks the current version against the passed version using the passed test.
     * @param {String} version The version to test against
     * @param {String} operator The test operator, `<=`, `<`, `=`, `>` or `>=`.
     * @returns {Boolean} `true` if the test passes.
     * @internal
     */
    static checkVersion(version, operator) {
        // Backward compat: old 3-arg form checkVersion(product, version, operator) — shift args, ignore product
        if (arguments.length === 3) {
            version = arguments[1];
            operator = arguments[2];
        }

        return VersionHelper.semanticCompareVersion(VH.getVersion('core'), version, operator);
    }

    /**
     * Based on a comparison of current version and the passed version this method either outputs a console.warn
     * or throws an error.
     * @param {String} invalidAsOfVersion The version where the offending code is invalid (when any compatibility layer
     * is actually removed).
     * @param {String} message Required! A helpful warning message to show to the developer using a deprecated API.
     * @internal
     */
    static deprecate(invalidAsOfVersion, message) {
        // Backward compat: old 3-arg form deprecate(product, version, message) — shift args, ignore product
        if (arguments.length === 3) {
            invalidAsOfVersion = arguments[1];
            message = arguments[2];
        }

        const justWarn = VH.checkVersion(invalidAsOfVersion, '<');

        //<debug>
        if (!invalidAsOfVersion.endsWith('.0.0')) {
            throw new Error('May only break APIs in major releases');
        }
        if (!message) {
            throw new Error('Must provide helpful message for developers');
        }
        //</debug>

        if (justWarn) {
            //<debug>
            // Warnings don't get callstacks but that makes them hard to find especially in automated tests, so add a
            // portion of the callstack that got us here.
            if (VH.skipStack) {
                --VH.skipStack;
            }
            else {
                let stack = new Error().stack;

                if (stack.startsWith('Error\n')) {
                    stack = stack.substr(6);  // Chrome
                }

                stack = stack.split('\n');

                if (stack[0].includes('VersionHelper')) {
                    // excluding this function...
                    stack.shift();
                }

                if (stack.length > 10) {
                    stack[10] = `+ ${stack.length - 10} more...`;
                    stack = stack.slice(0, 11);
                }

                message += ':\n' + stack.join('\n');
            }
            //</debug>

            // During the grace period (until the next major release following the deprecated code), just show a console warning
            console.warn(`Deprecation warning: You are using a deprecated API which will change in v${invalidAsOfVersion}. ${message}`);
        }
        else {
            throw new Error(`Deprecated API use. ${message}`);
        }
    }

    /**
     * Returns truthy value if environment is in testing mode
     * @member {Boolean}
     * @static
     * @readonly
     * @internal
     **/
    static get isTestEnv() {
        const isTestEnv = Boolean(globalThis.bryntum?.isTestEnv);
        try {
            return isTestEnv || Boolean(globalThis.parent?.bryntum?.isTestEnv);
        }
        catch {
            // Accessing parent may cause CORS violation
            return isTestEnv;
        }
    }

    /**
     * Returns `true` if the core version is >= the specified version.
     * Convenience method to replace patterns like `VersionHelper.core?.isNewerThan(version)`.
     * @param {String} version The version to test against
     * @returns {Boolean} `true` if the current version is >= the specified version
     * @private
     */
    static fromVersion(version) {
        return VH.semanticCompareVersion(version, VH.core.version, '<=');
    }

    static get isDebug() {
        let result = false;
        //<debug>
        result = true;
        //</debug>
        return result;
    }
}

const VH = VersionHelper;

//<debug>
VH.skipStack = 0;
//</debug>

if (BrowserHelper.isBrowserEnv) {
    if (VH.isTestEnv) {
        BrowserHelper._isHoverableDevice = true;
    }

    globalThis.bryntum = Object.assign(globalThis.bryntum || {}, {
        getVersion   : VH.getVersion.bind(VH),
        checkVersion : VH.checkVersion.bind(VH),
        deprecate    : VH.deprecate.bind(VH)
    });

    // Store import.meta.url immediately at module load time for debugging bundle issues
    globalThis.bryntum.importUrls = globalThis.bryntum.importUrls || [];
    if (currentImportUrl) {
        globalThis.bryntum.importUrls.push(currentImportUrl);
    }
}

Helpers.register(VersionHelper);
