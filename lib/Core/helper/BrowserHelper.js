/**
 * @module Core/helper/BrowserHelper
 */

import Helpers from './Helpers.js';

const isMsEdgeBrand = brand => brand.brand === 'Microsoft Edge';

/**
 * A static utility class for detecting the current browser, operating system, and platform capabilities.
 * It exposes boolean flags such as `isChrome`, `isSafari`, `isMobile`, `isMac`, etc., and numeric version
 * properties like `chromeVersion` and `firefoxVersion`.
 *
 * ```javascript
 * if (BrowserHelper.isSafari) {
 *     // Safari-specific workaround
 * }
 *
 * if (BrowserHelper.isMobile) {
 *     // Touch-friendly layout
 * }
 * ```
 *
 * ## See also
 *
 * - {@link Core.helper.DomHelper} - DOM element utilities
 * - {@link Core.helper.EventHelper} - DOM event utilities
 *
 */
export default class BrowserHelper {
    static $name = 'BrowserHelper';

    static supportsPointerEvents = Boolean(globalThis.PointerEvent || globalThis.MSPointerEvent);

    // Locker Service does not allow to instantiate PointerEvents. LWS apparently does, however.
    // https://github.com/bryntum/bryntum/issues/5578

    static supportsPointerEventConstructor = typeof PointerEvent !== 'undefined';
    static PointerEventConstructor = globalThis.PointerEvent || globalThis.CustomEvent;
    //region Init

    /**
     * Yields `true` if the platform running is a phone (screen width or height <= 414 CSS pixels)
     * @member {Boolean}
     * @readonly
     * @static
     * @category Platform
     */
    static isPhone = globalThis.matchMedia?.('(max-height:414px) or (max-width:414px)').matches;

    static cacheFlags(platform = navigator.platform, userAgent = navigator.userAgent) {
        const me = this;

        // os
        me._isLinux = Boolean(platform.match(/Linux/));
        me._isMac = Boolean(platform.match(/Mac/));
        me._isWindows = Boolean(platform.match(/Win32/));
        me._isMobile = Boolean(userAgent.match(/Mobile|Opera Mini|Opera Mobi|Puffin/) || typeof globalThis.orientation === 'number');

        // Edge user agent contains webkit too.
        // This is not a typo. Edge has "Safari/537.36 Edg/96.0.1054.34"
        me._isWebkit = Boolean(userAgent.match(/WebKit/) && !userAgent.match(/Edg/));

        me._firefoxVersion = me.getVersion(userAgent, /Firefox\/(\d+)\./);
        me._isFirefox = me._firefoxVersion > 0;

        me._chromeVersion = me.getVersion(userAgent, /Chrom(?:e|ium)\/(\d+)\./);
        me._isChrome = me._chromeVersion > 0;

        me._isSafari = Boolean(userAgent.match(/Safari/)) && !me._isChrome;
        me._isMobileSafari = me._isSafari && me.isMobile;

        me._safariVersion = me.getVersion(userAgent, /Version\/(.*).Safari/);

        me._isAndroid = Boolean(userAgent.match(/Android/g));

        me._isEdge = navigator.userAgentData?.brands?.some(isMsEdgeBrand);
    }

    //endregion

    //region Device

    /**
     * Yields `true` if the current browser supports CSS style `overflow:clip`.
     * @member {Boolean}
     * @readonly
     * @internal
     */
    static get supportsOverflowClip() {
        if (this._supportsOverflowClip == null) {
            const div = document.createElement('div');

            div.style.overflow = 'clip';
            div.style.display = 'none';
            // If we're called before DOMContentLoaded, body won't be available.
            // HTML element works for style calcs.
            document.documentElement.appendChild(div);
            this._supportsOverflowClip = div.ownerDocument.defaultView.getComputedStyle(div).getPropertyValue('overflow') === 'clip';
            div.remove();
        }
        return this._supportsOverflowClip;
    }

    /**
     * Yields `true` if the current browser supports the `ScrollTimeline` API for
     * scroll-driven animations.
     * @member {Boolean}
     * @readonly
     * @internal
     */
    static get supportsScrollTimeline() {
        if (this._supportsScrollTimeline == null) {
            this._supportsScrollTimeline = typeof ScrollTimeline === 'function';
        }
        return this._supportsScrollTimeline;
    }

    /**
     * Yields `true` if the current browser supports CSS style `position:sticky`.
     * @member {Boolean}
     * @readonly
     * @internal
     */
    static get supportsSticky() {
        return true;
    }

    /**
     * Returns matched version for userAgent.
     * @param {String} versionRe version match regular expression
     * @returns {Number} matched version
     * @readonly
     * @internal
     */
    static getVersion(userAgent, versionRe) {
        const match = userAgent.match(versionRe);
        return match ? parseFloat(match[1]) : 0;
    }

    /**
     * Determines if the user is using a touch device.
     * @member {Boolean}
     * @readonly
     */
    static get isTouchDevice() {
        // Allow tests or client code to set
        if (this._isTouchDevice === undefined) {
            this._isTouchDevice = globalThis.matchMedia('(any-pointer: coarse)').matches;
        }
        return this._isTouchDevice;
    }

    // Reports true by default for our tests
    static get isHoverableDevice() {
        if (this._isHoverableDevice === undefined) {
            this._isHoverableDevice = globalThis.matchMedia('(any-hover: hover)').matches;
        }

        return this._isHoverableDevice;
    }

    //endregion

    //region Platform

    static get isBrowserEnv() {
        // This window reference is left on purpose, globalThis is always defined
        // eslint-disable-next-line bryntum/no-window-in-lib
        return typeof window !== 'undefined';
    }

    /**
     * Checks if platform is Mac.
     * @member {Boolean}
     * @readonly
     * @category Platform
     */
    static get isMac() {
        return this._isMac;
    }

    /**
     * Checks if platform is Windows.
     * @member {Boolean}
     * @readonly
     * @category Platform
     */
    static get isWindows() {
        return this._isWindows;
    }

    /**
     * Checks if platform is Linux.
     * @member {Boolean}
     * @readonly
     * @category Platform
     */
    static get isLinux() {
        return this._isLinux;
    }

    /**
     * Checks if platform is Android.
     * @member {Boolean}
     * @readonly
     * @category Platform
     */
    static get isAndroid() {
        return this._isAndroid;
    }

    //endregion

    //region Browser

    /**
     * Checks if browser is Microsoft Edge, *not* Chrome.
     * @member {Boolean}
     * @readonly
     * @category Browser
     */
    static get isMSEdge() {
        return this._isEdge;
    }

    /**
     * Checks if browser is Webkit.
     * @member {Boolean}
     * @readonly
     * @category Browser
     */
    static get isWebkit() {
        return this._isWebkit;
    }

    /**
     * Checks if browser is Chrome or Chromium based browser.
     * Returns truthy value for Edge Chromium.
     * @member {Boolean}
     * @readonly
     * @category Browser
     */
    static get isChrome() {
        return this._isChrome;
    }

    /**
     * Returns the major Chrome version or 0 for other browsers.
     * @member {Number}
     * @readonly
     * @category Browser
     */
    static get chromeVersion() {
        return this._chromeVersion;
    }

    /**
     * Checks if browser is Firefox.
     * @member {Boolean}
     * @readonly
     * @category Browser
     */
    static get isFirefox() {
        return this._isFirefox;
    }

    /**
     * Returns the major Firefox version or 0 for other browsers.
     * @member {Number}
     * @readonly
     * @category Browser
     */
    static get firefoxVersion() {
        return this._firefoxVersion;
    }

    /**
     * Checks if browser is Safari.
     * @member {Boolean}
     * @readonly
     * @category Browser
     */
    static get isSafari() {
        return this._isSafari;
    }

    static get safariVersion() {
        return this._safariVersion;
    }

    /**
     * Checks if browser is mobile Safari
     * @member {Boolean}
     * @readonly
     * @category Browser
     */
    static get isMobileSafari() {
        return this._isMobileSafari;
    }

    /**
     * Checks if the active device is a mobile device
     * @member {Boolean}
     * @readonly
     * @category Browser
     */
    static get isMobile() {
        return this._isMobile;
    }

    static get platform() {
        const me = this;

        return me._isLinux ? 'linux'
            : me._isMac ? 'mac'
                : me._isWindows ? 'windows'
                    : me._isAndroid ? 'android'
                        : me._isMobileSafari ? 'ios'
                            : null;
    }

    // Only works in secure contexts
    static get supportsRandomUUID() {
        if (this._supportsRandomUUID === undefined) {
            try {
                this._supportsRandomUUID = Boolean(globalThis.crypto.randomUUID?.().length > 0);
            }
            catch {
                this._supportsRandomUUID = false;
            }
        }

        return this._supportsRandomUUID;
    }

    //endregion

    //region Storage

    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    static get storageAvailable() {
        let storage, x;

        try {
            storage = localStorage;
            x = '__storage_test__';

            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch (e) {
            return e instanceof DOMException && (
            // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage.length !== 0;
        }
    }

    static setLocalStorageItem(key, value) {
        this.storageAvailable && localStorage.setItem(key, value);
    }

    static getLocalStorageItem(key) {
        return this.storageAvailable && localStorage.getItem(key);
    }

    static removeLocalStorageItem(key) {
        this.storageAvailable && localStorage.removeItem(key);
    }

    //endregion

    //region Helpers

    /**
     * Returns the event property name for the `ctrlKey`. The `ctrlKey` key is `'ctrlKey'` on all platforms except Mac,
     * where `ctrlKey` is `'metaKey'`.
     *
     * See also {@link #property-metaKey-static}.
     * @member {String}
     * @readonly
     * @category Browser
     * @internal
     */
    static get ctrlKey() {
        return this.isMac ? 'metaKey' : 'ctrlKey';
    }

    /**
     * Returns the event property name for the `metaKey`. The `metaKey` is `'metaKey'` on all platforms except Mac,
     * where `metaKey` is `'ctrlKey'`.
     *
     * See also {@link #property-ctrlKey-static}.
     * @member {String}
     * @readonly
     * @category Browser
     * @internal
     */
    static get metaKey() {
        return this.isMac ? 'ctrlKey' : 'metaKey';
    }

    /**
     * Returns parameter value from search string by parameter name.
     * @param {String} paramName search parameter name
     * @param {String} [defaultValue] default value if parameter not found
     * @param {String} [search] search string. Defaults to `document.location.search`
     * @returns {String} search parameter string value
     * @category Helper
     */
    static searchParam(paramName, defaultValue = null, search = document.location.search) {
        const
            re    = new RegExp(`[?&]${paramName}=?([^&]*)`),
            match = search.match(re);
        return (match && match[1]) || defaultValue;
    }

    /**
     * Returns cookie by name.
     * @param {String} name cookie name
     * @returns {String} cookie string value
     * @category Helper
     */
    static getCookie(name) {
        const
            nameEq      = encodeURIComponent(name) + '=',
            cookieItems = document.cookie.split(';');

        for (let i = 0; i < cookieItems.length; i++) {
            let c = cookieItems[i];

            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }

            if (c.indexOf(nameEq) === 0) {
                return decodeURIComponent(c.substring(nameEq.length, c.length));
            }
        }

        return '';
    }

    /**
     * Triggers a download of a file with the specified name / URL.
     * @param {String} filename The filename of the file to be downloaded
     * @param {String} [url] The URL where the file is to be downloaded from
     * @internal
     * @category Download
     */
    static download(filename, url) {
        const a = document.createElement('a');

        a.download = filename;
        a.href = url || filename;
        a.style.cssText = 'display:none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    /**
     * Triggers a download of a Blob with the specified name.
     * @param {Blob} blob The Blob to be downloaded
     * @param {String} filename The filename of the file to be downloaded
     * @internal
     * @category Download
     */
    static downloadBlob(blob, filename) {
        const url = globalThis.URL.createObjectURL(blob);

        this.download(filename, url);
        globalThis.URL.revokeObjectURL(url);
    }

    /**
     * Returns an object representing the query string parameters of the current URL. A multi-valued query string
     * parameter (eg `?tier=community&tier=enterprise`) is represented as an array of strings.
     * @member {Object<String,String|String[]>}
     * @internal
     * @category Helper
     */
    static get queryString() {
        // new URLSearchParams throws in salesforce
        // https://github.com/salesforce/lwc/issues/1812
        const params = new URL(globalThis.location.href).searchParams;

        // ?. to be nice to users with Chrome versions < 73
        return Object.fromEntries?.([...new Set(params.keys())].map(key => {
            const values = params.getAll(key);

            return [key, values.length > 1 ? values : values[0]];
        }));
    }

    // Used by docs fiddle
    static copyToClipboard(code) {
        let success = true;
        const textArea = document.createElement('textarea');

        textArea.value = code;
        textArea.style.height = textArea.style.width = 0;
        document.body.appendChild(textArea);

        textArea.select();
        try {
            document.execCommand('copy');
        }
        catch {
            success = false;
        }
        textArea.remove();

        return success;
    }

    static isBryntumOnline(searchStrings) {
        searchStrings = Array.isArray(searchStrings) ? searchStrings : [searchStrings];
        return Boolean(/^(www\.)?bryntum\.com$/.test(globalThis.location.host) || searchStrings?.some(str => this.queryString[str] != null));
    }

    /**
     * Returns truthy value if page contains Content Security Policy meta tag or globalThis.bryntum.CSP is truthy value
     * @member {Boolean}
     * @returns {Boolean}
     * @internal
     **/
    static get isCSP() {
        const { bryntum, document } =  globalThis;
        if (bryntum.CSP == null) {
            bryntum.CSP = Boolean(document.querySelector('meta[http-equiv="Content-Security-Policy"]'));
        }
        return bryntum.CSP;
    }

    //endregion
}

Helpers.register(BrowserHelper);

if (BrowserHelper.isBrowserEnv) {
    BrowserHelper.cacheFlags();
}
