/* eslint-disable bryntum/no-on-in-lib */
import Helpers from './Helpers.js';
import DomHelper from './DomHelper.js';
import ObjectHelper from './ObjectHelper.js';
import FunctionHelper from './FunctionHelper.js';
import BrowserHelper from './BrowserHelper.js';
import Gesture from './util/Gesture.js';
import Rectangle, { Point } from './util/Rectangle.js';
import StringHelper from './StringHelper.js';
import GlobalEvents from '../GlobalEvents.js';

import './util/LongPress.js';
import './util/Swipe.js';

/**
 * @module Core/helper/EventHelper
 */

/**
 * @typedef {Object<String,Function|Boolean|Object|Object[]|Number|String>} ElementListenerConfig
 * @property {EventTarget} element The element or document to add the listener to.
 * @property {Object} [thisObj] The default `this` reference for all handlers added in this call.
 * @property {Boolean} [autoDetach=true] The listeners are automatically removed when the `thisObj` is destroyed.
 * @property {String} [delegate] A CSS selector string which only fires the handler when the event takes place in a
 * matching element.
 * @property {Boolean} [once] Specify as `true` to have the listener(s) removed upon first invocation.
 * @property {Number} [delay] The number of milliseconds to delay the handler call after the event fires.
 * @property {Boolean} [capture] Specify as `true` to add the listener in the capture phase.
 * @property {Boolean} [passive] Specify as `true` to add the listener as a passive listener.
 * @property {Number|Object} [throttled] Specify as a number of milliseconds to throttle repeated handler calls to or an
 * object.
 * @property {number} [throttled.buffer] Specify as a number of milliseconds to throttle repeated handler calls to.
 * @property {Function} [throttled.alt] Specify an alternative function to call if called between throttled calls.
 * @property {Number|Object} [expires] The listener only waits for a specified time before
 * being removed. The value may be a number or an object containing an expiry handler.
 * @property {Number} [expires.delay] How long to wait for the event for.
 * @property {String|Function} [expires.alt] The function to call when the listener expires *without having been
 * triggered*.
 * @property {Boolean} [raw] Specify as `true` to receive the raw DOM event instead of the browser-normalized event.
 */

const
    touchProperties = [
        'clientX',
        'clientY',
        'pageX',
        'pageY',
        'screenX',
        'screenY'
    ],
    isHandlerOption = {
        element : 1,
        expires : 1,
        handler : 1
    },
    isOption = {
        element    : 1,
        thisObj    : 1,
        once       : 1,
        delegate   : 1,
        delay      : 1,
        capture    : 1,
        passive    : 1,
        throttled  : 1,
        autoDetach : 1,
        expires    : 1,
        block      : 1,
        raw        : 1,
        fromGlobal : 1
    },
    normalizedKeyNames = {
        Spacebar : 'Space',
        Del      : 'Delete',
        Esc      : 'Escape',
        Left     : 'ArrowLeft',
        Up       : 'ArrowUp',
        Right    : 'ArrowRight',
        Down     : 'ArrowDown'
    },
    // Required to identify a keyup event for special key
    specialKeys = {
        Control : 'ctrl',
        Alt     : 'alt',
        Shift   : 'shift',
        Meta    : 'meta'
    },
    specialKeyRe           = /^(ctrl|shift|alt|meta)$/,
    eventProps             = [
        'altKey',
        'bubbles',
        'button',
        'buttons',
        'cancelable',
        'clientX',
        'clientY',
        'ctrlKey',
        'layerX',
        'layerY',
        'metaKey',
        'pageX',
        'pageY',
        'returnValue',
        'screenX',
        'screenY',
        'shiftKey'
    ],
    powerSet = (...names) => names.reduce((a, v) => {
        /*
            Produces the following combinations of the given names 'A', 'B', 'C', 'D':

                A :  A
                B :  B, A+B
                C :  C, A+C, B+C, A+B+C
                D :  D, A+D, B+D, A+B+D, C+D, A+C+D, B+C+D, A+B+C+D

            The array is ordered in such a way that the index is determined by assigned each name to a bit position
            (i.e., A = 2**0 = 1, B = 2**1 = 2, C = 2**2 = 4, D = 2**3 = 8).
         */
        for (let i = 0, n = a.length; i < n; ++i) {
            a.push(i ? `${a[i]}+${v}` : v);
        }

        return a;
    }, ['']),
    letterKeyNames = Object.fromEntries('abcdefghijklmnopqrstuvwxyz'.split('').map(c => [c, c.toUpperCase()])),
    modifierKeys = powerSet('Ctrl', 'Alt', 'Meta', 'Shift'),
    getModKeys = ev => modifierKeys[(ev.ctrlKey && 1) | (ev.altKey && 2) | (ev.metaKey && 4) | (ev.shiftKey && 8)],
    getKeyName = event => {
        const
            parts = [getModKeys(event)],
            { code, key } = event;

        parts[parts[0] ? 1 : 0] = code?.includes('Numpad') ? code : (letterKeyNames[key] || key);

        return parts.join('+');
    },
    {
        isSafari,
        isMobileSafari,
        safariVersion
    } = BrowserHelper,
    wrapperMap = new WeakMap(),
    // FF sometimes dispatch events on text nodes
    fixTarget = target => target?.nodeType === Element.TEXT_NODE ? target.parentElement : target,
    // Handler wrappers for createHandler
    blockWrapper = (block, prev) => {
        let lastCallTime, lastTarget;
        return (e, ...args) => {
            const now = performance.now();
            if (!lastCallTime || e.target !== lastTarget || now - lastCallTime > block) {
                lastTarget = e.target;
                lastCallTime = now;
                prev(e, ...args);
            }
        };
    },
    delayWrapper = (delay, prev, thisObj, fromGlobal) => {
        const delayable = thisObj?.setTimeout ? thisObj : globalThis;
        let timerId;
        const handler = (event, ...args) => {
            // Fix event early to make delayed listeners in Salesforce not to lose target
            event = EventHelper.fixEvent(event, fromGlobal);

            if (timerId) {
                delayable.clearTimeout(timerId);
            }
            timerId = delayable.setTimeout(() => {
                prev(event, ...args);
                timerId = null;
            }, delay);
        };
        // Expose method to cancel any pending delayed call
        handler.cancelDelay = () => {
            if (timerId) {
                delayable.clearTimeout(timerId);
                timerId = null;
            }
        };
        return handler;
    },
    throttledWrapper = (throttled, prev, thisObj, fromGlobal) => {
        let alt, buffer = throttled;
        if (throttled.buffer) {
            alt = e => throttled.alt.call(EventHelper, EventHelper.fixEvent(e, fromGlobal));
            buffer = throttled.buffer;
        }
        if (thisObj?.isDelayable) {
            return thisObj.throttle(prev, { delay : buffer, throttled : alt });
        }
        return FunctionHelper.createThrottled(prev, buffer, thisObj, null, alt);
    },
    onceDelegateWrapper = (element, eventName, prev, delegate, fromGlobal) => {
        const result = (event, ...args) => {
            event = EventHelper.fixEvent(event, fromGlobal);
            const delegatedTarget = event.target?.closest?.(delegate);
            if (delegatedTarget) {
                event.delegatedTarget = delegatedTarget;
                EventHelper.removeEventListener(element, eventName, result);
                prev(event, ...args);
            }
        };
        return result;
    },
    delegateWrapper = (delegate, prev, fromGlobal) => {
        return (event, ...args) => {
            event = EventHelper.fixEvent(event, fromGlobal);
            const delegatedTarget = event.target?.closest?.(delegate);
            if (!delegatedTarget) return;
            event.delegatedTarget = delegatedTarget;
            prev(event, ...args);
        };
    };

/**
 * A static utility class for adding, removing, and normalizing DOM events across browsers. It provides a
 * unified API for mouse, touch, and pointer events via {@link #function-on-static} and handles event delegation,
 * throttling, expiration, and auto-detaching of listeners.
 *
 * ```javascript
 * const detacher = EventHelper.on({
 *     element : myElement,
 *     click   : 'onClick',
 *     thisObj : myWidget
 * });
 *
 * // Remove listeners later
 * detacher();
 * ```
 *
 * ## Useful functions
 *
 * | Function                                   | Description                                  |
 * |--------------------------------------------|----------------------------------------------|
 * | {@link #function-on-static}                | Add DOM event listeners with options         |
 * | {@link #function-getXY-static}             | Get `[x, y]` coordinates from an event       |
 * | {@link #function-getPagePoint-static}      | Get a page-level Point from an event         |
 *
 * ## See also
 *
 * - {@link #typedef-ElementListenerConfig} - Options for adding listeners
 * - {@link Core.helper.DomHelper} - DOM element utilities
 *
 */
export default class EventHelper {
    static $name = 'EventHelper';

    /**
     * DOM event to trigger name mapping.
     * @member {Object} eventNameMap
     * @readonly
     * @static
     * @internal
     */
    static eventNameMap = {
        mousedown   : 'MouseDown',
        mouseup     : 'MouseUp',
        click       : 'Click',
        dblclick    : 'DblClick',
        contextmenu : 'ContextMenu',
        mouseenter  : 'MouseEnter',
        mouseleave  : 'MouseLeave',
        mousemove   : 'MouseMove',
        mouseover   : 'MouseOver',
        mouseout    : 'MouseOut',
        keyup       : 'KeyUp',
        keydown     : 'KeyDown',
        keypress    : 'KeyPress'
    };

    static normalizeEvent(event) {
        return ObjectHelper.copyPropertiesIf(event, event.changedTouches[0] || event.touches[0], touchProperties);
    }

    /**
     * For use when synthesizing events from native DOM events. Copies valid properties from the passed
     * event into the destination object;
     * @param {Object} dest Destination object
     * @param {Event} event The event whose properties to copy
     * @returns {Object} An event construction object.
     * @internal
     */
    static copyEvent(dest, event) {
        return ObjectHelper.copyProperties(dest, event, eventProps);
    }

    /**
     * Returns the `[x, y]` coordinates of the event in the viewport coordinate system.
     * @param {Event} event The event
     * @returns {Number[]} The coordinate.
     */
    static getXY(event) {
        if (event.touches) {
            event = event.touches[0];
        }
        return [event.clientX, event.clientY];
    }

    /**
     * Returns the pixel distance between two mouse/touch/pointer events.
     * @param {Event} event1 The first event.
     * @param {Event} event2 The second event.
     * @returns {Number} The distance in pixels between the two events.
     */
    static getDistanceBetween(event1, event2, options) {
        const
            xy1 = EH.getXY(event1),
            xy2 = EH.getXY(event2),
            xDistance = xy1[0] - xy2[0],
            yDistance = xy1[1] - xy2[1];

        if (options?.x) {
            return xDistance;
        }
        if (options?.y) {
            return yDistance;
        }
        // No point in moving this to Point. We are dealing only with number values here.
        return Math.hypot(xDistance, yDistance);
    }

    /**
     * Returns a {@link Core.helper.util.Rectangle.Point} which encapsulates the `pageX/Y` position of the event.
     * May be used in {@link Core.helper.util.Rectangle} events.
     * @param {Event} event A browser mouse/touch/pointer event.
     * @returns {Core.helper.util.Rectangle.Point} The page point.
     */
    static getPagePoint(event) {
        return new Point(event.pageX, event.pageY);
    }

    /**
     * Returns a {@link Core.helper.util.Rectangle.Point} which encapsulates the `clientX/Y` position of the event.
     * May be used in {@link Core.helper.util.Rectangle} events.
     * @param {Event} event A browser mouse/touch/pointer event.
     * @returns {Core.helper.util.Rectangle.Point} The page point.
     */
    static getClientPoint(event) {
        return new Point(event.clientX, event.clientY);
    }

    /**
     * Add a listener or listeners to an element
     * The `options` parameter allows supplying options for the listener(s), for available options see {@link #typedef-ElementListenerConfig}.
     *
     * @param {EventTarget} element The event target to add a listener/listeners to.
     * @param {String|Object} eventName Either a string, being the name of the event to listen for,
     * or an options object containing event names and options as keys. See the options parameter
     * for details, or the {@link #function-on-static} method for details.
     * @param {Function} [handler] If the second parameter is a string event name, this is the handler function.
     * @param {ElementListenerConfig} [options] If the second parameter is a string event name, this is the options.
     * @returns {Function} A detacher function which removes all the listeners when called.
     */
    static addListener(element, eventName, handler, options) {
        if (element.nodeType) {
            // All separate params, element, eventName and handler
            if (typeof eventName === 'string') {
                options = {
                    element,
                    [eventName] : handler,
                    ...options
                };
            }
            // element, options
            else {
                options = {
                    element,
                    ...eventName
                };
            }
        }
        // Just an options object passed
        else {
            options = element;
        }
        return EH.on(options);
    }

    /**
     * Adds a listener or listeners to an element.
     * all property names other than the options listed below are taken to be event names,
     * and the values as handler specs.
     *
     * A handler spec is usually a function reference or the name of a function in the `thisObj`
     * option.
     *
     * But a handler spec may also be an options object containing a `handler` property which is
     * the function or function name, and local options, including `element` and `thisObj`
     * which override the top level options.
     *
     * The `options` parameter allows supplying options for the listener(s), for available options see {@link #typedef-ElementListenerConfig}.
     *
     *  Usage example
     *
     * ```javascript
     * construct(config) {
     *     super.construct(config);
     *
     *     // Add auto detaching event handlers to this Widget's reference elements
     *     EventHelper.on({
     *         element : this.iconElement,
     *         click   : '_handleIconClick',
     *         thisObj : this,
     *         contextmenu : {
     *             element : document,
     *             handler : '_handleDocumentContextMenu'
     *         }
     *     });
     * }
     * ```
     *
     * The `click` handler on the `iconElement` calls `this._handleIconClick`.
     *
     * The `contextmenu` handler is added to the `document` element, but the `thisObj`
     * is defaulted in from the top `options` and calls `this._handleDocumentContextMenu`.
     *
     * Note that on touch devices, `dblclick` and `contextmenu` events are synthesized.
     * Synthesized events contain a `browserEvent` property containing the final triggering
     * event of the gesture. For example a synthesized `dblclick` event would contain a
     * `browserEvent` property which is the last `touchend` event. A synthetic `contextmenu`
     * event will contain a `browserEvent` property which the longstanding `touchstart` event.
     *
     * @param {ElementListenerConfig} options The full listener specification.
     * @returns {Function} A detacher function which removes all the listeners when called.
     */
    static on(options) {
        const
            element        = options.element,
            thisObj        = options.thisObj,
            handlerDetails = [];

        for (const eventName in options) {
            // Only treat it as an event name if it's not a supported option
            if (!isOption[eventName]) {
                let handlerSpec = options[eventName];
                if (typeof handlerSpec !== 'object') {
                    handlerSpec = {
                        handler : handlerSpec
                    };
                }
                const targetElement = handlerSpec.element || element;

                // Keep track of the real handlers added.
                // addElementLister returns [ element, eventName, addedFunction, capture ]
                handlerDetails.push(EH.addElementListener(targetElement, eventName, handlerSpec, options));
            }
        }

        const detacher = () => {
            for (let handlerSpec, i = 0; i < handlerDetails.length; i++) {
                handlerSpec = handlerDetails[i];
                EH.removeEventListener(handlerSpec[0], handlerSpec[1], handlerSpec[2]);
            }
            handlerDetails.length = 0;
        };

        // { autoDetach : true, thisObj : scheduler } means remove all listeners when the scheduler dies.
        if (thisObj && options.autoDetach !== false) {
            thisObj.doDestroy = FunctionHelper.createInterceptor(thisObj.doDestroy, detacher, thisObj);
        }

        return detacher;
    }

    /**
     * Used internally to add a single event handler to an element.
     * @param {EventTarget} element The event target to add the handler to.
     * @param {String} eventName The name of the event to add a handler for.
     * @param {Function|String|Object} handlerSpec Either a function to call, or
     * the name of a function to call in the `thisObj`, or an object containing
     * the handler local options.
     * @param {Function|String} [handlerSpec.handler] Either a function to call, or
     * the name of a function to call in the `thisObj`.
     * @param {EventTarget} [handlerSpec.element] Optionally a local event target for the listener.
     * @param {Object} [handlerSpec.thisObj] A local `this` specification for the handler.
     * @param {Object} defaults The `options` parameter from the {@link #function-addListener-static} call.
     * @private
     */
    static addElementListener(element, eventName, handlerSpec, defaults) {
        const
            handler  = EH.createHandler(element, eventName, handlerSpec, defaults),
            { spec } = handler,
            expires  = handlerSpec.expires || defaults.expires,
            options  = spec.capture != null || spec.passive != null || spec.once != null ? {
                capture : spec.capture,
                passive : spec.passive,
                once    : spec.once && !spec.delegate // only use native once if not delegating
            } : undefined;

        if (Gesture.is(eventName)) {
            Gesture.on(element, eventName, handler, Helpers.Object.filter(handlerSpec, (v, key) => !isHandlerOption[key]));
        }
        else {
            element.addEventListener(eventName, handler, options);
        }

        if (expires) {
            // Extract expires : { delay : 100, alt : 'onExpireFn' }
            const
                thisObj   = handlerSpec.thisObj || defaults.thisObj,
                delayable = thisObj?.isDelayable ? thisObj : globalThis,
                { alt }   = expires,
                delay     = alt ? expires.delay : expires;

            // expires is not applied with other options in createHandler(), store it here
            spec.expires = expires;

            spec.timerId = delayable[typeof delay === 'number' ? 'setTimeout' : 'requestAnimationFrame'](() => {
                spec.timerId = null;

                EH.removeEventListener(element, eventName, handler);

                // If we make it here and the handler has not been called, invoke the alt handler
                if (alt && !handler.called) {
                    (typeof alt === 'string' ? thisObj[alt] : alt).call(thisObj);
                }
            }, delay, `listener-timer-${performance.now()}`);
        }

        return [element, eventName, handler, options];
    }

    // composedPath throws in salesforce
    // https://github.com/bryntum/bryntum/issues/4432
    static getComposedPath(event) {
        // eslint-disable-next-line bryntum/no-salesforce-unsupported-methods -- Salesforce-safe wrapper; overridden by EventHelperOverride
        return event.composedPath();
    }

    // composedPath throws in salesforce
    // https://github.com/bryntum/bryntum/issues/4432
    static getComposedPathTarget(event) {
        // eslint-disable-next-line bryntum/no-salesforce-unsupported-methods -- Salesforce-safe wrapper; overridden by EventHelperOverride
        return event.composedPath()[0] || event.path?.[0];
    }

    static fixEvent(browserEvent, fromGlobal) {
        if (browserEvent.isBryntumEvent) {
            return browserEvent;
        }
        // If the event is on a bubble, return the wrapper we have stashed.
        // WeakMap will release the entry when its ref count is zero.
        if (wrapperMap.has(browserEvent)) {
            return wrapperMap.get(browserEvent);
        }

        const
            { ctrlKey, metaKey, type, target } = browserEvent,
            deepTarget    = this.getComposedPathTarget(browserEvent),
            isOpenWC      = deepTarget?.getRootNode?.()?.mode === 'open',
            eventWrapper  = {
                set(event, prop, value) {
                    // https://github.com/bryntum/bryntum/issues/11920
                    // In Salesforce Lightning Locker every property of the event has a setter. Some properties are not
                    // writable, however. To support Lightning Locker we avoid changing the actual event, and instead
                    // we keep overridden property value on the proxy. Our code does not rely on
                    // `getOwnPropertyDescriptor` to peek into Event properties, therefore change appears safe.
                    this[prop] = value;
                    return true;
                },
                get(event, prop) {
                    // If the property has been set on the wrapper, return it
                    if (ObjectHelper.hasOwn(this, prop)) {
                        return this[prop];
                    }
                    switch (prop) {
                        case 'fixed':
                        case 'isBryntumEvent':
                            return true;
                        case 'key':
                            // Normalize key names
                            return normalizedKeyNames[event.key] || event.key;
                        case 'code':
                            // Polyfill the code property for SPACE because it is not set for synthetic events.
                            return event.key === ' ' && !event.code ? 'Space' : event.code;

                        // Swap metaKey (Command) with the ctrlKey for Mac OS (these are read-only, so define local property). Note,
                        // these swaps must come before calls to getKeyName/getModKeys
                        case 'ctrlKey':
                            return BrowserHelper.isMac && metaKey !== ctrlKey ? metaKey : ctrlKey;
                        case 'metaKey':
                            return BrowserHelper.isMac && metaKey !== ctrlKey ? ctrlKey : metaKey;

                        case 'virtualKey':
                            return getKeyName(result);    // ex 'Ctrl+A'

                        case 'virtualModKeys':
                            return getModKeys(result);  // ex 'Ctrl+Shift'

                        // Work round Chrome bug https://issues.chromium.org/issues/40651184
                        // where offsetX/Y can be negative when event occurs near edge.
                        case 'offsetX':
                            return Math.max(event.offsetX, 0);
                        case 'offsetY':
                            return Math.max(event.offsetY, 0);

                        // offsetX/Y are within padding box. Border is outside padding box, so -ve values are possible
                        // which are not useful for calculating intra-element positions.
                        // We add borderOffsetX and borderOffsetY properties which are offsets within the border box.
                        // Tested in EventHelper.js
                        case 'borderOffsetX':
                            return !isNaN(event.offsetX) ? event.offsetX + (isSafari && safariVersion < 26.4 ? 0 : parseInt(target.ownerDocument.defaultView.getComputedStyle(fixTarget(target)).getPropertyValue('border-left-width'))) : undefined;
                        case 'borderOffsetY':
                            return !isNaN(event.offsetY) ? event.offsetY + (isSafari && safariVersion < 26.4 ? 0 : parseInt(target.ownerDocument.defaultView.getComputedStyle(fixTarget(target)).getPropertyValue('border-top-width'))) : undefined;
                        case 'target':
                            return isOpenWC ? deepTarget : fixTarget(event.target);
                        case 'relatedTarget':
                            return fixTarget(event.relatedTarget);
                        case 'originalTarget':
                            return target;
                        case 'deepTarget':
                            return deepTarget;
                        case 'currentTarget':
                            return this.delegatedTarget || event.currentTarget;
                        case 'browserEvent':
                            return event;
                        case 'timeStamp':
                            // https://bugs.webkit.org/show_bug.cgi?id=185040
                            // Safari on iOS can return a timeStamp of 0.
                            if (isMobileSafari) {
                                this.timeStamp || (this.timeStamp = Date.now());
                            } // eslint-disable-next-line no-fallthrough
                        default:
                            if (!(prop in this)) {
                                const result = event[prop];

                                return (typeof result === 'function') ? result.bind(event) : result;
                            }
                            else {
                                return this[prop];
                            }
                    }
                },
                has(event, key) {
                    return (key in event) || (key in this);
                }
            };

        // Wrap event to allow us to normalize browser quirks and set any properties we need.
        // Some of our handlers inject domain-specific data such as eventRecord, resourceRecord etc.
        const result = new Proxy(browserEvent.detail?.type ? browserEvent.detail : browserEvent, eventWrapper);

        // Keep the wrapper keyed by the event because we can encounter an event many times on a bubble
        wrapperMap.set(browserEvent, result);

        // If it's a touch event, move the positional details of changedTouches[0] or touches[0] up to the event.
        // This is so that the outer touch event has clientX and clientY etc.
        if (type.startsWith('touch')) {
            this.normalizeEvent(result);
        }

        // Keep GlobalEvents's view of the currently processed event up to date unless GlobalEvents is the caller
        if (!fromGlobal) {
            switch (type) {
                case 'keydown':
                    GlobalEvents.currentKeyDown = result;
                    break;
                case 'mousedown':
                    GlobalEvents.currentMouseDown = result;
                    break;
                case 'pointerdown':
                    GlobalEvents.currentPointerDown = result;
                    break;
                case 'touchstart':
                    GlobalEvents.currentTouch = result;
            }
        }

        return result;

    }

    static createHandler(element, eventName, handlerSpec, defaults) {
        const
            isGesture  = Gesture.is(eventName),
            delay      = handlerSpec.delay || defaults.delay,
            throttled  = handlerSpec.throttled || defaults.throttled,
            block      = handlerSpec.block || defaults.block,
            once       = ('once'       in handlerSpec) ? handlerSpec.once       : defaults.once,
            capture    = ('capture'    in handlerSpec) ? handlerSpec.capture    : defaults.capture,
            passive    = ('passive'    in handlerSpec) ? handlerSpec.passive    : defaults.passive,
            delegate   = ('delegate'   in handlerSpec) ? handlerSpec.delegate   : defaults.delegate,
            fromGlobal = ('fromGlobal' in handlerSpec) ? handlerSpec.fromGlobal : defaults.fromGlobal,
            raw        = ('raw'        in handlerSpec) ? handlerSpec.raw        : defaults.raw,
            wrappedFn  = handlerSpec.handler,
            expires    = handlerSpec.expires,
            thisObj    = handlerSpec.thisObj || defaults.thisObj;

        //Capture initial conditions in case of destruction of thisObj.
        // Destruction completely wipes the object.
        //<debug>
        const
            thisObjClassName = thisObj?.constructor.name || 'Object',
            thisObjId        = thisObj?.id || 'unknown';
        //</debug>

        // Innermost level of wrapping which calls the user's handler.
        // Normalize the event cross-browser, and attempt to normalize touch events.
        let handler = (...args) => {
            const event = args[0];

            // When playing a demo using DemoBot, only handle synthetic events
            if (EH.playingDemo && event.isTrusted) {
                return;
            }

            // If the thisObj is already destroyed, we cannot call the function.
            // If in dev mode, warn the developer with a JS error.

            //<debug>
            // Separate debug block to not break minification
            if (thisObj?.isDestroyed) {
                throw new Error(`Attempting to fire ${eventName} event on destroyed ${thisObjClassName} instance with id: ${thisObjId}`);
            }
            //</debug>

            if (thisObj?.isDestroyed) {
                return;
            }

            // Flag for the expiry timer
            handler.called = true;

            if (!isGesture && !raw) {
                args[0] = EH.fixEvent(event, fromGlobal);
            }

            (typeof wrappedFn === 'string') ? thisObj[wrappedFn](...args) : wrappedFn.apply(thisObj, args);
        };

        // Each wrapper is created to call the previous handler in the chain.
        if (delegate && !once) {
            handler = delegateWrapper(delegate, handler, fromGlobal);
        }
        if (throttled != null) {
            handler = throttledWrapper(throttled, handler, thisObj, fromGlobal);
        }
        if (delay != null) {
            handler = delayWrapper(delay, handler, thisObj, fromGlobal);
        }
        if (block) {
            handler = blockWrapper(block, handler);
        }

        // Only wrap for once if delegate is used.
        // We cannot use native once because that would remove the listener even if it doesn't
        // match the delegate selector. We treat once : true as "remove after first successful
        // match and handler call".
        if (once && delegate) {
            handler = onceDelegateWrapper(element, eventName, handler, delegate, fromGlobal);
        }

        handler.spec = {
            delay,
            throttled,
            block,
            once,
            thisObj,
            capture,
            expires,
            passive,
            delegate,
            raw
        };

        // Only autoDetach here if there's a local thisObj is in the handlerSpec for this one listener.
        // If it's in the defaults, then the "on" method will handle it.
        if (handlerSpec.thisObj && handlerSpec.autoDetach !== false) {
            thisObj.doDestroy = FunctionHelper.createInterceptor(thisObj.doDestroy, () => EH.removeEventListener(element, eventName, handler), thisObj);
        }

        return handler;
    }

    /**
     * Used internally to remove a single event handler from an element.
     * @param {EventTarget} element The event target to add the handler to.
     * @param {String} eventName The name of the event to add a handler for.
     * @param {Function} handler The event handler function.
     * @private
     */
    static removeEventListener(element, eventName, handler) {
        const { expires, timerId, thisObj } = handler.spec;

        // Cancel outstanding expires.alt() call when removing the listener
        if (expires?.alt && timerId) {
            const delayable = thisObj?.isDelayable ? thisObj : globalThis;
            delayable[typeof expires.delay === 'number' ? 'clearTimeout' : 'cancelAnimationFrame'](timerId);
        }

        // Cancel any pending delayed handler call (https://github.com/bryntum/bryntum/issues/4085)
        handler.cancelDelay?.();

        if (Gesture.is(eventName)) {
            Gesture.un(element, eventName, handler);
        }
        else {
            element.removeEventListener(eventName, handler, handler.spec);
        }
    }

    /**
     * Calls a callback when the described animation completes.
     *
     * @param {Object} detail
     * @param {HTMLElement} detail.element The element which is being animated.
     * @param {String|RegExp} [detail.animationName] The name of the animation to wait for.
     * @param {String} [detail.property] If no `animationName` specified, the CSS property
     * which is being animated.
     * @param {Function} detail.handler The function to call on animation end.
     * @param {Number} [detail.duration] Optional fallback time to wait until calling the callback.
     * @param {Object} [detail.thisObj] The `this` reference to call the callback with.
     * @param {Array} [detail.args] Optional arguments to call the callback with.
     * @param {Core.mixin.Delayable} [detail.timerSource] A Delayable to provide the fallback timeout.
     * @param {Boolean} [detail.runOnDestroy] If `timerSource` is a {@link Core.mixin.Delayable},
     * `true` to invoke the callback if it is destroyed during the animation.
     * @returns {Function} a function which detaches the animation end listener.
     */
    static onTransitionEnd({
        element,
        animationName,
        property,
        handler,
        mode     = animationName ? 'animation' : 'transition',
        duration = DomHelper[`get${mode === 'transition' ? 'Property' : ''}${StringHelper.capitalize(mode)}Duration`](element, property),
        timeout,
        thisObj  = globalThis,
        args     = [],
        timerSource,
        runOnDestroy,
        forceResolve
    }) {
        let timerId,
            maxDurationTimerId;

        timerSource = timerSource || (thisObj.isDelayable ? thisObj : globalThis);

        const
            { isDelayable }   = timerSource,
            now               = performance.now(),
            transitionTimerId = `transitionTimer${now}`,
            timeoutTimerId    = `timeoutTimer${now}`,
            callbackArgs      = [element, property, ...args],
            doCallback        = () => {
                detacher();
                if (!thisObj.isDestroyed) {
                    // If it's one of our objects with the callback method...
                    if (thisObj.$meta?.class.isBase) {
                        thisObj.callback(handler, thisObj, callbackArgs);
                    }
                    else {
                        handler.apply(thisObj, callbackArgs);
                    }
                }
            },
            detacher          = EH.on({
                element,
                [`${mode}end`]({ animationName : endedAnimation,  propertyName, target }) {
                    if (target === element) {
                        if (property === '*' || propertyName === property || endedAnimation?.match(animationName)) {
                            if (timerId) {
                                if (maxDurationTimerId) {
                                    timerSource.clearTimeout?.(isDelayable ? timeoutTimerId : maxDurationTimerId);
                                }
                                timerSource.clearTimeout?.(isDelayable ? transitionTimerId : timerId);
                                timerId = null;
                            }

                            doCallback();
                        }
                    }
                }
            });

        if (timeout) {
            maxDurationTimerId = timerSource.setTimeout(doCallback, Math.max(timeout, (duration || 0) + 100), timeoutTimerId);
        }
        // If the transition has not signalled its end within duration + 50 milliseconds
        // then give up on it. Remove the listener and call the handler.
        if (duration != null) {
            timerId = timerSource.setTimeout(doCallback, duration + 50, transitionTimerId, runOnDestroy);
        }
        else if (forceResolve) {
            doCallback();
        }

        return detacher;
    }

    /**
     * Waits for the described animation completes.
     *
     * @param {Object} config
     * @param {HTMLElement} config.element The element which is being animated.
     * @param {String|RegExp} [config.animationName] The name of the animation to wait for.
     * @param {String} [config.property] If no `animationName` specified, the CSS property
     * which is being animated.
     * @param {Number} [config.duration] Optional fallback time to wait until calling the callback.
     * @param {Core.mixin.Delayable} [config.timerSource] A Delayable to provide the fallback timeout.
     * @param {Boolean} [config.runOnDestroy] If `timerSource` is a {@link Core.mixin.Delayable},
     * `true` to invoke the callback if it is destroyed during the animation.
     * @async
     */
    static async waitForTransitionEnd(config) {
        return new Promise(resolve => {
            config.forceResolve = true;
            config.handler = resolve;
            EventHelper.onTransitionEnd(config);
        });
    }

    /**
     * Private function to wrap the passed function. The returned wrapper function to be used as
     * a `touchend` handler which will call the passed function passing a fabricated `dblclick`
     * event if there is a `click` within 300ms.
     * @param {Element} element element
     * @param {String|Function} handler The handler to call.
     * @param {Object} thisObj The owner of the function.
     * @private
     */
    static createDblClickWrapper(element, handler, thisObj) {
        let startId, secondListenerDetacher, tapholdTimer;

        return () => {
            if (!secondListenerDetacher) {
                secondListenerDetacher = EH.on({
                    element,

                    // We only get here if a touchstart arrives within 300ms of a click
                    touchstart : secondStart => {
                        startId = secondStart.changedTouches[0].identifier;
                        // Prevent zoom
                        secondStart.preventDefault();
                    },
                    touchend : secondClick => {
                        if (secondClick.changedTouches[0].identifier === startId) {
                            secondClick.preventDefault();

                            clearTimeout(tapholdTimer);
                            startId = secondListenerDetacher = null;

                            const
                                targetRect          = Rectangle.from(secondClick.changedTouches[0].target, null, true),
                                offsetX             = secondClick.changedTouches[0].pageX - targetRect.x,
                                offsetY             = secondClick.changedTouches[0].pageY - targetRect.y,
                                dblclickEventConfig = {
                                    browserEvent : secondClick,
                                    ...secondClick
                                },
                                dblclickEvent       = new MouseEvent('dblclick', dblclickEventConfig);

                            Object.defineProperties(dblclickEvent, {
                                target  : { value : secondClick.target },
                                offsetX : { value : offsetX },
                                offsetY : { value : offsetY }
                            });

                            if (typeof handler === 'string') {
                                handler = thisObj[handler];
                            }

                            // Call the wrapped handler passing the fabricated dblclick event
                            handler.call(thisObj, dblclickEvent);
                        }
                    },
                    once : true
                });

                // Cancel the second listener is there's no second click within <dblClickTime> milliseconds.
                tapholdTimer = setTimeout(() => {
                    secondListenerDetacher();
                    startId = secondListenerDetacher = null;
                }, EH.dblClickTime);
            }
        };
    }

    /**
     * Handles various inputs to figure out the name of the special key of the event.
     *
     * ```javascript
     * EventHelper.toSpecialKey('ctrl') // 'ctrlKey'
     * EventHelper.toSpecialKey(true)   // 'ctrlKey'
     * EventHelper.toSpecialKey(false)  // false
     * EventHelper.toSpecialKey('foo')  // false
     * ```
     *
     * @param {*} value User input value to process.
     * @param {String} defaultValue Default value to fall back to if `true` value is passed.
     * @returns {Boolean|String} Returns `false` if provided value cannot be converted to special key and special key
     * name otherwise.
     * @internal
     */
    static toSpecialKey(value, defaultValue = 'ctrlKey') {
        let result = false;

        if (value === true) {
            result = defaultValue;
        }
        else if (typeof value === 'string') {
            value = value.toLowerCase();

            if (specialKeyRe.test(value)) {
                result = `${value}Key`;
            }
        }

        return result;
    }

    /**
     * If keyup event is triggered when special key is pressed, we don't get special key value from properties like
     * `ctrlKey`. Instead we need to read `event.key`. That property uses full name and we use abbreviations, so we
     * need to convert the key.
     * @param {String} code
     * @returns {String}
     * @internal
     */
    static specialKeyFromEventKey(code) {
        return specialKeys[code] || 'no-special-key';
    }
}

Helpers.register(EventHelper);

const EH = EventHelper;

/**
 * The time in milliseconds for a `taphold` gesture to trigger a `contextmenu` event.
 * @member {Number} [longPressTime=700]
 * @readonly
 * @static
 */
EH.longPressTime = 700;

/**
 * The time in milliseconds within which a second touch tap event triggers a `dblclick` event.
 * @member {Number} [dblClickTime=300]
 * @readonly
 * @static
 */
EH.dblClickTime = 300;

// When dragging on a touch device, we need to prevent scrolling from happening.
// Dragging only starts on a touchmove event, by which time it's too late to preventDefault
// on the touchstart event which started it.
// To do this we need a capturing, non-passive touchmove listener at the document level so we can preventDefault.
// This is in lieu of a functioning touch-action style on iOS Safari. When that's fixed, this will not be needed.
if (BrowserHelper.isTouchDevice) {
    EH.on({
        element   : document,
        touchmove : event => {
            // If we're touching a b-dragging event, then stop any panning by preventing default.
            if (event.target.closest('.b-dragging')) {
                event.preventDefault();
            }
        },
        passive : false,
        capture : true
    });
}
