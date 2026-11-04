import ObjectHelper from '../helper/ObjectHelper.js';
import StringHelper from '../helper/StringHelper.js';
import Base from '../Base.js';

/**
 * @module Core/mixin/Fencible
 */

const
    { defineProperty } = Object,
    fencibleSymbol     = Symbol('fencible'),
    NONE               = [],
    distinct           = array => Array.from(new Set(array)),
    parseNames         = names => names ? distinct(StringHelper.split(names)) : NONE;

/**
 * A description of how to protect a method from reentry.
 *
 * A value of `true` is transformed using the key as the `all` value. For example, this:
 *
 * ```javascript
 *  class Foo extends Base.mixin(Fencible) {
 *      static fenced = {
 *          foo : true
 *      };
 * ```
 *
 * Is equivalent to this:
 *
 * ```javascript
 *  class Foo extends Base.mixin(Fencible) {
 *      static fenced = {
 *          foo : {
 *              all : ['foo']
 *          }
 *      };
 * ```
 *
 * Strings are split on spaces to produce the `all` array. For example, this:
 *
 * ```javascript
 *  class Foo extends Base.mixin(Fencible) {
 *      static fenced = {
 *          foo : 'foo bar'
 *      };
 * ```
 *
 * Is equivalent to this:
 *
 * ```javascript
 *  class Foo extends Base.mixin(Fencible) {
 *      static fenced = {
 *          foo : {
 *              all : ['foo', 'bar']
 *          }
 *      };
 * ```
 *
 * This indicates that `foo()` cannot be reentered if `foo()` or `bar()` are already executing. On entry to `foo()`,
 * both `foo()` and `bar()` will be fenced (prevented from entering).
 *
 * @typedef {Object} MethodFence
 * @property {String|String[]} [all] One or more keys that must all be currently unlocked to allow entry to the fenced
 * method. String values are converted to an array by splitting on spaces.
 * @property {String|String[]} [any] One or more keys of which at least one must be currently unlocked to allow entry
 * to the fenced method. String values are converted to an array by splitting on spaces.
 * @property {String|String[]} [lock] One or more keys that will be locked on entry to the fenced method and released
 * on exit. String values are converted to an array by splitting on spaces. By default, this array includes all keys
 * in `all` and `any`.
 */

/**
 * This mixin is used to apply reentrancy barriers to instance methods. For details, see
 * {@link Core.mixin.Fencible#property-fenced-static}.
 * @mixin
 * @internal
 */
export default Target => class Fencible extends (Target || Base) {
    static $name = 'Fencible';

    static declarable = [
        /**
         * This class property returns an object that specifies the instance methods which need reentrancy protection.
         *
         * It is used like so:
         * ```javascript
         *  class Foo extends Base.mixin(Fencible) {
         *      static fenced = {
         *          reentrantMethod : true
         *      };
         *
         *      reentrantMethod() {
         *          // things() may cause reentrantMethod() to be called...
         *          // but we won't be allowed to reenter this method since we are already inside it
         *          this.things();
         *      }
         *  }
         * ```
         *
         * This can also be used to protect mutually reentrant method groups:
         *
         * ```javascript
         *  class Foo extends Base.mixin(Fencible) {
         *      static fenced = {
         *          foo : 'foobar'
         *          bar : 'foobar'
         *      };
         *
         *      foo() {
         *          console.log('foo');
         *          this.bar();
         *      }
         *
         *      bar() {
         *          console.log('bar');
         *          this.foo();
         *      }
         *  }
         *
         *  instance = new Foo();
         *  instance.foo();
         *  >> foo
         *  instance.bar();
         *  >> bar
         * ```
         *
         * The value for a fenced method value can be `true`, a string, an array of strings, or a
         * {@link #typedef-MethodFence} options object.
         *
         * Internally these methods are protected by defining a wrapper function on the instance. The class methods
         * remain on the class prototype and are guarded by the instance-level method. This allows these methods to use
         * `super` calls, just like other methods.
         *
         * @static
         * @member {Object} fenced
         * @internal
         */
        'fenced'
    ];

    static setupFenced(cls, meta) {
        const
            { fenced } = cls,
            methods = meta.getInherited('fenced');

        let all, any, lock, methodName, options;

        // Decode the fenced options at the class declaration level to make instance-level processing as simple as
        // possible
        for (methodName in fenced) {
            options = fenced[methodName];

            if (options === true) {
                options = methodName;
            }

            if (!ObjectHelper.isObject(options)) {
                options = {
                    all : options
                };
            }

            all  = parseNames(options.all);
            any  = parseNames(options.any);
            lock = options.lock ? parseNames(options.lock) : distinct(all.concat(any));
            any  = any.length ? any : null;  // [].some(f) is always false, but [].every(f) is always true

            methods[methodName] = { any, all, lock };
        }
    }

    construct(...args) {
        const
            me     = this,
            proto  = Object.getPrototypeOf(me),
            fenced = me.$meta.getInherited('fenced'),
            fences = me[fencibleSymbol] = {},
            isFree = key => !fences[key];

        // not a for-of loop since we don't want stale closures for any/all/lock/name
        ObjectHelper.forEach(fenced, ({ any, all, lock }, name) => {
            defineProperty(me, name, {
                configurable : true,

                value(...params) {
                    if (all.every(isFree) && (!any || any.some(isFree))) {
                        let key;

                        try {
                            for (key of lock) {
                                fences[key] = (fences[key] || 0) + 1;
                            }

                            return proto[name].apply(me, params);  // instance methods are on the prototype chain
                        }
                        finally {
                            for (key of lock) {
                                --fences[key];
                            }
                        }
                    }
                }
            });
        });

        return super.construct(...args);
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
