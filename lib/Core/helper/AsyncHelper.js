import DomHelper from './DomHelper.js';

/**
 * @module Core/helper/AsyncHelper
 */

/**
 * A helper class to make asynchronous tasks `await` friendly.
 */
export default class AsyncHelper {
    /**
     * Returns a promise that resolves on next animation frame.
     *
     * ```javascript
     *  async method() {
     *      // do work
     *      await AsyncHelper.animationFrame();
     *      // do more work
     *  }
     * ```
     * @async
     */
    static animationFrame() {
        return new Promise(resolve => {
            requestAnimationFrame(resolve);
        });
    }

    /**
     * Returns a promise that resolves after a specified number of milliseconds.
     *
     * ```javascript
     *  async method() {
     *      await AsyncHelper.sleep(10);
     *      // ...
     *  }
     * ```
     *
     * @param {Number} millis The number of milliseconds to sleep.
     * @async
     */
    static sleep(millis) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, millis);
        });
    }

    /**
     * Returns a Promise which resolves when the passed function returns a truthy value.
     * ```
     *  async method() {
     *       / Wait for a maximum of ten seconds for the eventList to be empty
     *      await AsyncHelper.waitFor(this.eventList.length === 0, 10000);
     *      // ...
     *  }
     * ```
     * @param {Function} fn The function to call repeatedly until it returns a truthy value.
     * @param {Number} [maxWait=60000] The maximum time in milliseconds to wait for the function to return a truthy value.
     * pass `null` to wait indefinitely, pass as a negative number to resolve instead of reject if the wait fails.
     * @param {Number} [interval=100] The interval in milliseconds between calls to the function.
     * @returns {Promise} A Promise which yields the value returned by the passed function *if* it is truthy.
     * @async
     * @internal
     */
    static waitFor(fn, maxWait = 60000, interval = 100) {
        let resolveFn;

        const result = new Promise((resolve, reject) => {
            resolveFn = resolve;
            let timer;
            const predicate = () => {
                const result = fn();
                if (result) {
                    clearInterval(timer);
                    resolve(result);
                    return true;
                }
            };

            // Only kick off the interval if the predicate yields false
            if (!predicate()) {
                timer = setInterval(predicate, interval);
                if (maxWait) {
                    setTimeout(() => {
                        clearInterval(timer);
                        maxWait > 0 ? reject() : resolve();
                    }, Math.abs(maxWait));
                }
            }
        });
        result.resolve = resolveFn;
        return result;
    }

    /**
     * Returns a promise that resolves as soon as possible, allowing the browser to minimally process other messages.
     * This is the shortest possible delay the browser offers, so be aware that it does not necessarily allow the
     * browser to paint or reflow if used in a long loop. It does, however, allow other async methods to execute.
     *
     * ```javascript
     *  async method() {
     *      await AsyncHelper.yield();
     *      // ...
     *  }
     * ```
     *
     * @async
     */
    static yield() {
        return Promise.resolve();
    }

    /**
     * Safe polyfill for `queueMicrotask` that works in environments where
     * the native API is not available.
     *
     * When falling back to `Promise.resolve().then(fn)`, exceptions are
     * rethrown outside the Promise to avoid being silently swallowed.
     *
     * @function queueMicrotask
     * @param {Function} fn The function to queue as a microtask
     * @internal
     */
    static queueMicrotask = globalThis.queueMicrotask?.bind(globalThis) || (fn => Promise.resolve().then(fn).catch(e => setTimeout(() => {
        throw e;
    })));

    /**
     * Returns a promise that resolves when all finite animations on the element have finished.
     * @param {Element} element Target element to check for animations
     * @param {Boolean} [subtree] Include animations from descendants of the element
     * @async
     * @internal
     */
    static async waitForAnimations(element, subtree = true) {
        const
            allAnimations    = DomHelper.getAnimations(element, ({ subtree })),
            finiteAnimations = allAnimations.flatMap(a => a.effect.getTiming().iterations !== Infinity ? a.finished : []);

        if (finiteAnimations.length) {
            // Await any kind of finish, whether resolved or rejected
            await Promise.allSettled(finiteAnimations);
        }
    }
}
