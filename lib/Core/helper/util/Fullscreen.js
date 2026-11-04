import StringHelper from '../StringHelper.js';
import DomHelper from '../DomHelper.js';
import GlobalEvents from '../../GlobalEvents.js';
import Widget from '../../widget/Widget.js';

/**
 * @module Core/helper/util/Fullscreen
 */

/**
 * A static utility class that encapsulates the functionality for switching cross-browser to full screen view and back.
 * It normalizes vendor-prefixed fullscreen APIs across browsers.
 *
 * ```javascript
 * // Enter fullscreen
 * if (Fullscreen.enabled) {
 *     await Fullscreen.request(document.getElementById('my-panel'));
 * }
 *
 * // Exit fullscreen
 * if (Fullscreen.isFullscreen) {
 *     await Fullscreen.exit();
 * }
 * ```
 *
 * ## See also
 *
 * - {@link Core.helper.DomHelper} - DOM element utilities
 */
export default class Fullscreen {
    static init() {
        const fnNames  = ['fullscreenEnabled', 'requestFullscreen', 'exitFullscreen', 'fullscreenElement'],
            // turns fnNames into function calls to prefixed functions, fullscreenEnabled -> document.mozFullscreenEnabled
            prefixFn = prefix => fnNames.map(fn => {
                let result = prefix + StringHelper.capitalize(fn);

                // fullscreenEnabled in Firefox is called fullScreenEnabled
                if (prefix === 'moz') {
                    result = result.replace('screen', 'Screen');

                    // #6555 - Crash when clicking full screen button twice
                    // firefox doesn't support exitFullScreen method
                    if ('mozCancelFullScreen' in document && fn === 'exitFullscreen') {
                        result = 'mozCancelFullScreen';
                    }
                }

                return result;
            });

        this.functions = (
            ('fullscreenEnabled' in document && fnNames) ||
            ('webkitFullscreenEnabled' in document && prefixFn('webkit')) ||
            ('mozFullScreenEnabled' in document && prefixFn('moz')) ||
            ('msFullscreenEnabled' in document && prefixFn('ms')) ||
            []
        );

        const eventNames   = [
                'fullscreenchange',
                'fullscreenerror'
            ],
            msEventNames = [
                'MSFullscreenChange',
                'MSFullscreenError'
            ],
            prefixEvt    = prefix => eventNames.map(eventName => prefix + StringHelper.capitalize(eventName));

        this.events = (
            ('fullscreenEnabled' in document && eventNames) ||
            ('webkitFullscreenEnabled' in document && prefixEvt('webkit')) ||
            ('mozFullscreenEnabled' in document && prefixEvt('moz')) ||
            ('msFullscreenEnabled' in document && msEventNames) ||
            []
        );

        this.onFullscreenChange(this.onInternalFullscreenChange.bind(this));
    }

    /**
     * True if the fullscreen mode is supported and enabled, false otherwise
     * @member {Boolean}
     * @readonly
     */
    static get enabled() {
        return Boolean(this.functions[0] && document[this.functions[0]]);
    }

    /**
     * Request entering the fullscreen mode.
     * @param {HTMLElement} element Element to be displayed fullscreen
     * @returns {Promise} A promise which is resolved with a value of undefined when the transition to full screen is complete.
     */
    static async request(element) {
        return this.functions[1] && element?.[this.functions[1]]();
    }

    /**
     * Exit the previously entered fullscreen mode.
     * @returns {Promise} A promise which is resolved once the user agent has finished exiting full-screen mode
     */
    static async exit() {
        return this.functions[2] && document[this.functions[2]]();
    }

    /**
     * True if fullscreen mode is currently active, false otherwise
     * @member {Boolean}
     * @readonly
     */
    static get isFullscreen() {
        return Boolean(this.element);
    }

    static get element() {
        return this.functions[3] && document[this.functions[3]];
    }

    /**
     * Installs the passed listener to fullscreenchange event
     * @param {Function} fn The listener to install
     */
    static onFullscreenChange(fn) {
        if (this.events[0]) {
            document.addEventListener(this.events[0], fn);
        }
    }

    /**
     * Uninstalls the passed listener from fullscreenchange event
     * @param {Function} fn
     */
    static unFullscreenChange(fn) {
        if (this.events[0]) {
            document.removeEventListener(this.events[0], fn);
        }
    }

    // Make sure the floatRoot is added to any element going fullscreen
    static onInternalFullscreenChange(event) {
        const
            me                              = globalThis.bryntum,
            { element : fullscreenElement } = Fullscreen;

        // Avoid second call when two or more Fullscreen classes loaded from few sources
        if ((Fullscreen.isFullscreen && me._floatRoot) || (!Fullscreen.isFullscreen && !me._floatRoot)) {
            return;
        }

        let floatRoot, floatParent;

        if (fullscreenElement) {
            if (!fullscreenElement.closest('.b-float-root')) {
                const rootElement   = DomHelper.getRootElement(fullscreenElement);

                floatRoot = rootElement.floatRoot;

                if (floatRoot) {
                    me._floatRoot = floatRoot;
                    me._oldParent = floatRoot.parentElement;
                    floatParent   = fullscreenElement;
                }
            }
        }
        else {
            floatRoot = me._floatRoot;
            floatParent = floatRoot && me._oldParent;

            me._oldParent = me._floatRoot = null;
        }

        if (floatParent) {
            const floatingWidgets = Array.from(floatRoot.querySelectorAll('.b-widget')).map(e => Widget.fromElement(e));

            // Moving the floatRoot in the DOM resets the scroll positions for all floating widgets in the floatRoot,
            // however, simply saving and restoring their state is insufficient for Carousel (at least). Instead, give
            // a before/after call to any interested floaters...
            floatingWidgets.forEach(fw => fw.beforeFloatReparent?.());
            floatParent.appendChild(floatRoot);
            floatingWidgets.forEach(fw => fw.afterFloatReparent?.());
        }

        GlobalEvents.trigger('fullScreenChange', { event });
    }
}

Fullscreen.init();
