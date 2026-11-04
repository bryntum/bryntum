/**
 * @module Core/helper/FunctionHelper
 */

/**
 * @typedef {Object} AbortablePromiseMeta
 * @property {Promise} promise Actual promise
 * @property {AbortController} controller Abort controller which could be used to abort the promise
 * @internal
 */

import Helpers from './Helpers.js';

const
    commaSepRe = /,\s*/,
    decompiledSym = Symbol('decompiled'),
    // [async] p => ...
    fnRe1 = /^\s*(async\s+)?([a-z_]\w*)\s*=>([\s\S]+)$/i,
    // [async] (p1?[, px]*) => ...
    fnRe2 = /^\s*(async\s*)?\s*\(((?:[a-z_]\w*(?:, [a-z_]\w*)*)?)\)\s+=>([\s\S]+)$/i,
    // [async] [function] [name] (p1?[, px]*) ...
    fnRe3 = /^(\s*async)?(?:\s*function)?(?:\s*([a-z_]\w*))?\s*\(((?:[a-z_]\w*(?:, [a-z_]\w*)*)?)\)([\s\S]+)$/i,
    { hasOwnProperty } = Object.prototype;

/**
 * Provides functionality for working with functions
 * @internal
 */
export default class FunctionHelper {
    static $name = 'FunctionHelper';

    /**
     * Inserts a function after the specified `method` is called on an `object`. To remove this hook, invoke the
     * function returned by this method.
     * ```
     *  class A {
     *      method() {
     *          console.log('method');
     *      }
     *  }
     *
     *  let instance = new A();
     *
     *  let detach = FunctionHelper.after(instance, 'method', () => { console.log('after') });
     *
     *  instance.method();
     *  > method
     *  > after
     *
     *  detach();
     *  instance.method();
     *  > method
     * ```
     * The value returned by the original method is passed as the first argument to `fn` followed by all the arguments
     * passed by the caller.
     *
     * If `fn` returns a value (not `undefined`), that value is returned from the method call instead of the value
     * returned by the original method.
     * ```
     *  class A {
     *      method(x) {
     *          console.log('method', x);
     *          return x * 2
     *      }
     *  }
     *
     *  let instance = new A();
     *
     *  let detach = FunctionHelper.after(instance, 'method', (ret, x) => {
     *      console.log('after', ret, x);
     *      return x / 2;
     *  });
     *
     *  console.log(instance.method(50));
     *  > method 50
     *  > after 100 50
     *  > 25
     *
     *  detach();
     *  console.log(instance.method(50));
     *  > method 50
     *  > 100
     * ```
     *
     * @param {Object} object The object to hook.
     * @param {String} method The name of the method on `object` to hook.
     * @param {Function|String} fn The function or method name (on `thisObj`) to call after `method`.
     * @param {Object} [thisObj] The `this` pointer value for calling `fn`.
     * @param {Object} [options] Additional options
     * @param {Boolean} [options.return=true] Specify `false` to not include the return value of the hooked method as
     * the first argument to `fn`.
     * @returns {Function} The function to call to remove the hook.
     */
    static after(object, method, fn, thisObj, options) {
        const
            named = typeof fn === 'string',
            withReturn = options?.return !== false,
            hook = (...args) => {
                const
                    // if object.destroy() occurs, our hook will be removed, so this fn won't be called in that case
                    origResult = hook.$nextHook.call(object, ...args),
                    hookResult = thisObj?.isDestroyed ? undefined : (withReturn
                        ? (named ? thisObj[fn](origResult, ...args) : fn.call(thisObj, origResult, ...args))
                        : (named ? thisObj[fn](...args) : fn.call(thisObj, ...args))
                    );

                return (hookResult === undefined) ? origResult : hookResult;
            };

        return FunctionHelper.hookMethod(object, method, hook);
    }

    /**
     * Inserts a function before the specified `method` is called on an `object`. To remove this hook, invoke the
     * function returned by this method.
     * ```
     *  class A {
     *      method() {
     *          console.log('method');
     *      }
     *  }
     *
     *  let instance = new A();
     *
     *  let detach = FunctionHelper.before(instance, 'method', () => { console.log('before') });
     *
     *  instance.method();
     *  > before
     *  > method
     *
     *  detach();
     *  instance.method();
     *  > method
     * ```
     * If `fn` returns `false`, the original method is not invoked and `false` is returned to the caller.
     * ```
     *  class A {
     *      method(x) {
     *          console.log('method', x);
     *          return x * 2;
     *      }
     *  }
     *
     *  let instance = new A();
     *
     *  let detach = FunctionHelper.before(instance, 'method', x => {
     *      console.log('before', x);
     *      return false;
     *  });
     *
     *  console.log(instance.method(50));
     *  > before 50
     *  > false
     *
     *  detach();
     *  console.log(instance.method(50));
     *  > method 50
     *  > 100
     * ```
     *
     * @param {Object} object The object to hook.
     * @param {String} method The name of the method on `object` to hook.
     * @param {Function|String} fn The function or method name (on `thisObj`) to call before `method`.
     * @param {Object} [thisObj] The `this` pointer value for calling `fn`.
     * @returns {Function} The function to call to remove the hook.
     */
    static before(object, method, fn, thisObj) {
        const
            named = typeof fn === 'string',
            hook = (...args) => {
                const ret = (thisObj?.isDestroyed
                    ? 0
                    : (named ? thisObj[fn](...args) : fn.call(thisObj, ...args))
                );

                return (ret === false) ? ret : hook.$nextHook.call(object, ...args);
            };

        return FunctionHelper.hookMethod(object, method, hook);
    }

    static curry(func) {
        return function curried(...args) {
            if (args.length >= func.length) {
                return func.apply(this, args);
            }
            else {
                return function(...args2) {
                    return curried.apply(this, args.concat(args2));
                };
            }
        };
    }

    static bindAll(obj) {
        for (const key in obj) {
            if (typeof obj[key] === 'function') {
                obj[key] = obj[key].bind(obj);
            }
        }
    }

    /**
     * Combines all the passed filtering functions into a single function which returns `false` if any of the
     * passed functions returns `false`, otherwise it returns `true`.
     *
     * If only one function is passed, it is returned without being wrapped in another function.
     *
     * If no functions are passed, `undefined` is returned - this is useful for cases where a filter function
     * is optional and we don't want to add the overhead of an extra function call when there is no filter.
     * @param  {...Function} fns The filter functions to combine. The combined filter function will return `false`
     * if any of the passed functions returns `false`, otherwise it returns `true`.
     * @returns {Function} A function which returns `false` if any of the passed functions returns `false`, otherwise it returns `true`.
     */
    static combineFilterFns(...fns) {
        fns = fns.filter(Boolean);
        if (fns.length) {
            return fns.length > 1 ? v => fns.every(fn => fn(v) !== false) : fns[0];
        }
    }

    /**
     * Returns a function which calls the passed `interceptor` function first, and the passed `original` after
     * as long as the `interceptor` does not return `false`.
     * @param {Function} original The function to call second.
     * @param {Function} interceptor The function to call first.
     * @param {Object} [thisObj] The `this` reference when the functions are called.
     * @returns {Function} A function which yields the return value from the `original` function **if it was called**, else `false`.
     */
    static createInterceptor(original, interceptor, thisObj) {
        return function(...args) {
            const theThis = thisObj || this;
            if (interceptor.call(theThis, ...args) !== false) {
                return original.call(theThis, ...args);
            }
            return false;
        };
    }

    /**
     * Returns a function which calls the passed `sequence` function after calling
     * the passed `original`.
     * @param {Function} original The function to call first.
     * @param {Function} sequence The function to call second.
     * @param {Object} [thisObj] Overrides the `this` reference when the original function is called.
     * @param {Object} [sequenceThisObj] The `this` reference when the sequence function is called (Defaults to `thisObj`).
     * @returns {Function} A function which yields the value returned from the sequence if it returned a value, else the return
     * value from the original function.
     */
    static createSequence(original, sequence, thisObj, sequenceThisObj) {
        return function(...args) {
            const
                origResult     = original.call((thisObj = thisObj || this), ...args),
                sequenceResult = sequence.call(sequenceThisObj || thisObj, ...args);

            return (sequenceResult === undefined) ? origResult : sequenceResult;
        };
    }

    /**
     * Create a "debounced" function which will call on the "leading edge" of a timer period.
     * When first invoked will call immediately, but invocations after that inside its buffer
     * period will be rejected, and *one* invocation will be made after the buffer period has expired.
     *
     * This is useful for responding immediately to a first mousemove, but from then on, only
     * calling the action function on a regular timer while the mouse continues to move.
     *
     * @param {Function} fn The function to call.
     * @param {Number} buffer The milliseconds to wait after each execution before another execution takes place.
     * @param {Object} [thisObj] `this` reference for the function.
     * @param {Array} [extraArgs] The argument list to append to those passed to the function.
     * @param {Function} [alt] A function to call when the invocation is rejected due to buffer time not having expired.
     * @returns {Function} A function which calls the passed `fn` only if at least the passed `buffer`
     * milliseconds has elapsed since its last invocation.
     */
    static createThrottled(fn, buffer, thisObj, extraArgs, alt) {
        let lastCallTime = -Number.MAX_VALUE,
            callArgs,
            timerId;

        const
            timerSource = (thisObj?.isDelayable ? thisObj : globalThis),
            invoke = () => {
                timerId = 0;
                lastCallTime = performance.now();
                callArgs.push.apply(callArgs, extraArgs);
                fn.apply(thisObj, callArgs);
            },
            result = function(...args) {
                const elapsed = performance.now() - lastCallTime;

                callArgs = args;

                // If it's been more then the buffer period since we invoked, we can call it now
                if (elapsed >= buffer) {
                    timerSource.clearTimeout(timerId);
                    invoke();
                }
                // Otherwise, kick off a timer for the requested period.
                else {
                    if (!timerId) {
                        timerId = timerSource.setTimeout(invoke, buffer - elapsed);
                    }
                    if (alt) {
                        callArgs.push.apply(callArgs, extraArgs);
                        alt.apply(thisObj, callArgs);
                    }
                }
            };

        result.cancel = () => timerSource.clearTimeout(timerId);

        return result;
    }

    /**
     * Create a "debounced" function which will call on the "trailing edge" of a timer period.
     * When first invoked will wait until the buffer period has expired to call the function, and
     * more calls within that time will restart the timer.
     *
     * This is useful for responding to keystrokes, but deferring action until the user pauses typing.
     *
     * @param {Function} fn The function to call.
     * @param {Number} buffer The milliseconds to wait after each execution before another execution takes place.
     * @param {Object} [thisObj] `this` reference for the function.
     * @param {Array} [args] The argument list to append to those passed to the function.
     * @returns {Function} A function which calls the passed `fn` when at least the passed `buffer`
     * milliseconds has elapsed since its last invocation.
     */
    static createBuffered(fn, buffer, thisObj, args) {
        let callArgs,
            timerId;

        const
            timerSource = (thisObj?.isDelayable ? thisObj : globalThis),
            invoke      = () => {
                timerId          = 0;
                result.isPending = false;
                callArgs.push.apply(callArgs, args);
                fn.apply(thisObj, callArgs);
            },
            result      = function(...args) {
                callArgs = args;

                // Cancel any impending invocation. It's pushed out for <buffer> ms from each call
                if (timerId) {
                    timerSource.clearTimeout(timerId);
                }

                result.isPending = true;

                timerId = timerSource.setTimeout(invoke, buffer);
            };

        result.cancel = () => {
            result.isPending = false;
            timerSource.clearTimeout(timerId);
        };

        return result;
    }

    static decompile(fn) {
        if (!(decompiledSym in fn)) {
            const code = fn.toString();

            let m = fnRe1.exec(code),
                args, body, name, decompiled, t;

            if (m) {
                // [async] p => ...
                //   [1]   [2]  [3]
                args = [m[2]];
                body = m[3];
            }
            else if ((m /* assignment */ = fnRe2.exec(code))) {
                // [async] (p1?[, px]*) => ...
                //   [1]   [2]             [3]
                t = m[2].trim();
                args = t ? t.split(commaSepRe) : [];
                body = m[3];
            }
            else if ((m /* assignment */ = fnRe3.exec(code))) {
                // [async] [function] [name] (p1?[, px]*) ...
                //   [1]              [2]     [3]         [4]
                name = m[2];
                t = m[3].trim();
                args = t ? t.split(commaSepRe) : [];
                body = m[4];
            }

            body = body?.trim();

            fn[decompiledSym] = decompiled = m && {
                args,
                async : Boolean(m[1]),
                body  : body?.startsWith('{') ? body.substring(1, body.length - 1).trim() : body
            };

            if (name) {
                decompiled.name = name;
            }
        }

        return fn[decompiledSym];
    }

    static hookMethod(object, method, hook) {
        hook.$nextHook = object[method];
        object[method] = hook;

        return () => {
            // Object will have no hooks on the instance if it is destroyed (perhaps other reasons too)
            if (hasOwnProperty.call(object, method)) {
                let f = object[method],
                    next;

                if (f === hook) {
                    // When this is the outermost hook, we may be the last hook. If $nextHook is found on the object's
                    // prototype, simply delete the slot to expose it. Otherwise, there's another hook, so make it the
                    // outermost.
                    if (Object.getPrototypeOf(object)?.[method] === hook.$nextHook) {
                        delete object[method];
                    }
                    else {
                        object[method] = hook.$nextHook;
                    }
                }
                else {
                    // Not being the outermost hook means we have outer hooks that should chain to the one we want to
                    // remove. Be cautious because the object could be destroyed.
                    for (; (next = f?.$nextHook); f = next) {
                        if (next === hook) {
                            f.$nextHook = hook.$nextHook;
                            break;
                        }
                    }
                }
            }
        };
    }

    /**
     * Protects the specified `method` on a given `object` such that calling it will not throw exceptions.
     * @param {Object} object The object whose method is to be protected.
     * @param {String} method The name of the method to protect.
     * @param {Function} [handler] An optional function to call for any thrown exceptions.
     * @internal
     */
    static noThrow(object, method, handler) {
        const fn = object[method];

        object[method] = (...args) => {
            try {
                return fn.apply(object, args);
            }
            catch (e) {
                return handler?.(e);
            }
        };
    }

    static returnTrue() {
        return true;
    }

    /**
     * Calls the passed function on every animation frame while animating the `progress` value from 0 to 1 over the specified duration.
     *
     * The function is called with the current `progress` value as the first argument. That value changes from
     * `0` to `1` over the duration of the animation at a rate determined by the `easing` function.
     *
     * The called function may change the value of any property or perform some other action based on the
     * current `progress` value.
     *
     * The function should return `false` to indicate that the animation should be stopped immediately.
     *
     * ```javascript
     * // Increase hourHeight by 20 pixels in a visually appealing way
     * const
     *     { activeView } = this,
     *     { hourHeight } = activeView;
     *
     * FunctionHelper.animate(
     *     1000,
     *     progress => activeView.hourHeight = hourHeight * progress * 20,
     *     null,
     *     'bounce'
     * );
     * ```
     * @param {Number} duration The duration of the animation in milliseconds.
     * @param {Function} fn The function to call for each animation frame.
     * @param {Number} fn.progress The current progress value from `0` to `1`.
     * @param {Object} thisObj The `this` reference for the function.
     * @param {'linear'|'easeInBack'|'easeOutBack'|'easeInOutBack'|'easeOutBounce'|'easeInOutBounce'|'easeInCirc'|'easeOutCirc'|'easeInOutCirc'|'easeInCubic'|'easeOutCubic'|'easeInOutCubic'|'easeInElastic'|'easeOutElastic'|'easeInOutElastic'|'easeInExpo'|'easeOutExpo'|'easeInOutExpo'|'easeInQuad'|'easeOutQuad'|'easeInOutQuad'|'easeInQuart'|'easeOutQuart'|'easeInOutQuart'|'easeInQuint'|'easeOutQuint'|'easeInOutQuint'|'easeInSine'|'easeOutSine'|'easeInOutSine'} [easing='linear'] The easing function to use.
     * @returns {Promise} A promise which resolves when the animation completes.
     */
    static animate(duration, fn, thisObj, easing = 'linear') {
        let cancel = false;

        const result = new Promise(resolve => {
            const start = performance.now(),
                iterate = () => {
                    const progress = Math.min((performance.now() - start) / duration, 1),
                        delayable = thisObj?.setTimeout ? thisObj : globalThis;

                    if (!cancel) {
                        if (fn.call(thisObj, this.easingFunctions[easing](progress)) === false) {
                            resolve();
                        }
                    }
                    if (cancel || progress === 1) {
                        // Push resolution into the next animation frame so that
                        // this frame completes before the resolution handler runs.
                        delayable.requestAnimationFrame(() => resolve());
                    }
                    else {
                        delayable.requestAnimationFrame(iterate);
                    }
                };

            iterate();
        });

        result.cancel = () => {
            cancel = true;
            result.cancelled = true;
            return false;
        };

        return result;
    }

    /**
     * Returns a constructable `AbortController` class which is always safe to instantiate with `new`.
     *
     * The native `AbortController` may be missing (e.g. in some Node environments) or present but not usable
     * as a constructor (e.g. in Salesforce when Lightning Web Security is disabled, where the global is a
     * locked-down reference). In those cases a no-op mock controller is returned so callers can rely on
     * `new (FunctionHelper.getAbortController())()` working everywhere.
     * @returns {Function} An `AbortController` constructor (native or a mock).
     * @internal
     */
    static getAbortController() {
        if (typeof AbortController !== 'undefined') {
            try {
                // Verify the global can actually be used as a constructor before handing it back
                const controller = new AbortController();
                if (controller) {
                    return AbortController;
                }
            }
            catch {
                // AbortController exists but is not constructable, fall through to the mock below
            }
        }

        return class AbortControllerMock {
            constructor() {
                this.signal = {
                    aborted             : false,
                    reason              : undefined,
                    addEventListener    : () => {},
                    removeEventListener : () => {}
                };
            }

            abort(reason) {
                this.signal.aborted = true;
                this.signal.reason = reason;
            }
        };
    }

    /**
     * Creates an abortable promise and returns an array containing the promise, the abort signal, and the abort
     * controller. When AbortController is invoked, promise gets rejected.
     *
     * @param {Function} executor The executor function to handle the promise's resolve, reject, and abort signal.
     * @param {AbortController} [controller] AbortController instance
     * @returns {AbortablePromiseMeta} An object containing the promise, the abort controller, and the abort signal
     * @internal
     */
    static abortablePromise(executor, controller) {
        controller = controller || new (this.getAbortController())();
        const signal = controller.signal;

        const promise = new Promise((resolve, reject) => {
            // If the signal is already aborted, immediately throw in order to reject the promise.
            if (signal.aborted) {
                reject(signal.reason);
                return;
            }

            function onAbort() {
                reject(signal.reason);
            }

            signal.addEventListener('abort', onAbort);

            executor((...args) => {
                signal.removeEventListener('abort', onAbort);
                resolve(...args);
            }, (...args) => {
                signal.removeEventListener('abort', onAbort);
                reject(...args);
            }, signal);
        });

        return { promise, controller };
    }
}

Helpers.register(FunctionHelper);

const
    half = 0.5,
    e1 = 1.70158,
    e2 = 7.5625,
    e3 = 1.525,
    e4 = 2 / 2.75,
    e5 = 2.25 / 2.75,
    e6 = 1 / 2.75,
    e7 = 1.5 / 2.75,
    e8 = 2.5 / 2.75,
    e9 = 2.625 / 2.75,
    e10 = 0.75,
    e11 = 0.9375,
    e12 = 0.984375,
    s1 = 1.70158,
    s2 = 1.70158;

FunctionHelper.easingFunctions = {
    linear         : t => t,
    easeInQuad     : t => Math.pow(t, 2),
    easeOutQuad    : t => -(Math.pow((t - 1), 2) - 1),
    easeInOutQuad  : t => (t /= half) < 1 ? half * Math.pow(t, 2) : -half * ((t -= 2) * t - 2),
    easeInCubic    : t => Math.pow(t, 3),
    easeOutCubic   : t => Math.pow((t - 1), 3) + 1,
    easeInOutCubic : t => (t /= half) < 1 ? half * Math.pow(t, 3) : half * (Math.pow((t - 2), 3) + 2),
    easeInQuart    : t => Math.pow(t, 4),
    easeOutQuart   : t => -(Math.pow((t - 1), 4) - 1),
    easeInOutQuart : t => (t /= half) < 1 ? half * Math.pow(t, 4) : -half * ((t -= 2) * Math.pow(t, 3) - 2),
    easeInQuint    : t => Math.pow(t, 5),
    easeOutQuint   : t => (Math.pow((t - 1), 5) + 1),
    easeInOutQuint : t => (t /= half) < 1 ? half * Math.pow(t, 5) : half * (Math.pow((t - 2), 5) + 2),
    easeInSine     : t => -Math.cos(t * (Math.PI / 2)) + 1,
    easeOutSine    : t => Math.sin(t * (Math.PI / 2)),
    easeInOutSine  : t => -half * (Math.cos(Math.PI * t) - 1),
    easeInExpo     : t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
    easeOutExpo    : t => t === 1 ? 1 : -Math.pow(2, -10 * t) + 1,
    easeInOutExpo  : t => (t === 0) ? 0 : (t === 1) ? 1 : ((t /= half) < 1) ? half * Math.pow(2, 10 * (t - 1)) : half * (-Math.pow(2, -10 * --t) + 2),
    easeInCirc     : t => -(Math.sqrt(1 - (t * t)) - 1),
    easeOutCirc    : t => Math.sqrt(1 - Math.pow((t - 1), 2)),
    easeInOutCirc  : t => (t /= half) < 1 ? -half * (Math.sqrt(1 - t * t) - 1) : half * (Math.sqrt(1 - (t -= 2) * t) + 1),
    easeOutBounce  : t => ((t) < e6) ? (e2 * t * t) : (t < e4) ? (e2 * (t -= e7) * t + e10) : (t < e8) ? (e2 * (t -= e5) * t + e11) : (e2 * (t -= e9) * t + e12),
    easeInBack     : t => (t) * t * ((e1 + 1) * t - e1),
    easeOutBack    : t => (t = t - 1) * t * ((e1 + 1) * t + e1) + 1,
    easeInOutBack  : t => {
        let v1 = s1;
        return ((t /= half) < 1) ? half * (t * t * (((v1 *= (e3)) + 1) * t - v1)) : half * ((t -= 2) * t * (((v1 *= (e3)) + 1) * t + v1) + 2);
    },
    elastic     : t => -1 * Math.pow(4, -8 * t) * Math.sin((t * 6 - 1) * (2 * Math.PI) / 2) + 1,
    swingFromTo : t => {
        let v2 = s2;
        return ((t /= half) < 1) ? half * (t * t * (((v2 *= (e3)) + 1) * t - v2)) : half * ((t -= 2) * t * (((v2 *= (e3)) + 1) * t + v2) + 2);
    },
    swingFrom  : t => t * t * ((e1 + 1) * t - e1),
    swingTo    : t => (t -= 1) * t * ((e1 + 1) * t + e1) + 1,
    bounce     : t => (t < e6) ? (e2 * t * t) : (t < e4) ? (e2 * (t -= e7) * t + e10) : (t < e8) ? (e2 * (t -= e5) * t + e11) : (e2 * (t -= e9) * t + e12),
    bouncePast : t => (t < e6) ? (e2 * t * t) : (t < e4) ? 2 - (e2 * (t -= e7) * t + e10) : (t < e8) ? 2 - (e2 * (t -= e5) * t + e11) : 2 - (e2 * (t -= e9) * t + e12),
    easeFromTo : t => (t /= half) < 1 ? half * Math.pow(t, 4) : -half * ((t -= 2) * Math.pow(t, 3) - 2),
    easeFrom   : t => Math.pow(t, 4),
    easeTo     : t => Math.pow(t, 0.25)
};
