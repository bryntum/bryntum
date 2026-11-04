// IMPORTANT - adding imports here can create problems for Base class
//  That is why this file was split from ObjectHelper

import StringHelper from '../StringHelper.js';

/**
 * @module Core/helper/util/Objects
 */

const
    { hasOwnProperty, propertyIsEnumerable, toString } = Object.prototype,
    { isFrozen } = Object,
    afterRe      = /\s*<\s*/,
    beforeRe     = /\s*>\s*/,
    blendOptions = {},
    typeCache    = {},
    emptyObject  = Object.freeze({});

// Static methods are not displayed in derived class documentation. Therefore, since this is an internal class, the
// workaround is to copy method documentation to ObjectHelper (the public interface). Also tried making ObjectHelper
// a singleton.

/**
 * Helper for low-level Object manipulation.
 *
 * While documented on {@link Core.helper.ObjectHelper}, the following static methods are implemented by this class:
 *
 * - `{@link Core.helper.ObjectHelper#function-assign-static}`
 * - `{@link Core.helper.ObjectHelper#function-assignIf-static}`
 * - `{@link Core.helper.ObjectHelper#function-clone-static}`
 * - `{@link Core.helper.ObjectHelper#function-createTruthyKeys-static}`
 * - `{@link Core.helper.ObjectHelper#function-getPath-static}`
 * - `{@link Core.helper.ObjectHelper#function-getTruthyKeys-static}`
 * - `{@link Core.helper.ObjectHelper#function-getTruthyValues-static}`
 * - `{@link Core.helper.ObjectHelper#function-isEmpty-static}`
 * - `{@link Core.helper.ObjectHelper#function-isObject-static}`
 * - `{@link Core.helper.ObjectHelper#function-merge-static}`
 * - `{@link Core.helper.ObjectHelper#function-setPath-static}`
 * - `{@link Core.helper.ObjectHelper#function-typeOf-static}`
 * @internal
 */
export default class Objects {
    static assign(dest, ...sources) {
        for (let source, key, i = 0; i < sources.length; i++) {
            source = sources[i];

            if (source) {
                for (key in source) {
                    // Note: GitHub Advanced Security parses the code of for-in loops looking for specific patterns
                    // to report issues. Check scanner result before changing:
                    if (key !== '__proto__' && key !== 'constructor') {
                        dest[key] = source[key];
                    }
                }
            }
        }

        return dest;
    }

    static assignIf(dest, ...sources) {
        for (let source, key, i = 0; i < sources.length; i++) {
            source = sources[i];

            if (source) {
                for (key in source) {
                    // Note: GitHub Advanced Security parses the code of for-in loops looking for specific patterns
                    // to report issues. Check scanner result before changing:
                    if (key !== '__proto__' && key !== 'constructor') {
                        if (!(key in dest) || dest[key] === undefined) {
                            dest[key] = source[key];
                        }
                    }
                }
            }
        }

        return dest;
    }

    static blend(dest, source, options) {
        options = options || blendOptions;
        dest = dest || {};

        const { clone = Objects.clone, merge = Objects.blend } = options;

        if (Array.isArray(source)) {
            if (source.length > 1) {
                source.forEach(s => {
                    dest = Objects.blend(dest, s, options);
                });

                return dest;
            }

            source = source[0];
        }

        if (source) {
            let destValue, key, value;

            for (key in source) {
                // Note: GitHub Advanced Security parses the code of for-in loops looking for specific patterns
                // to report issues. Check scanner result before changing:
                if (key !== '__proto__' && key !== 'constructor') {
                    value = source[key];

                    // Dates pass isObject but must not be recursed into — treat them as leaves.
                    if (value && Objects.isObject(value) && !Objects.isDate(value)) {
                        destValue = dest[key];
                        options.key = key;

                        if (destValue && Objects.isObject(destValue)) {
                            if (isFrozen(destValue)) {
                                dest[key] = destValue = clone(destValue, options);
                            }

                            value = merge(destValue, value, options);
                        }
                        else {
                            // We don't need to clone frozen objects, but we do clone mutable objects as they get
                            // applied to the dest.
                            value = isFrozen(value) ? value : clone(value, options);
                        }
                    }

                    dest[key] = value;
                }
            }
        }

        return dest;
    }

    static clone(value, handler) {
        let cloned = value,
            key;

        // To fix https://github.com/bryntum/bryntum/issues/10796 we've prevented cloning
        // of Event typed objects. It causes errors in Firefox
        // eslint-disable-next-line bryntum/no-instanceof-event
        if (value && typeof value === 'object' && !(value instanceof Event)) {
            const options = handler && typeof handler === 'object' && handler;

            if (options) {
                // When using blend(), the 2nd argument is the options object, so ignore that case
                handler = null;
            }

            if (Objects.isDate(value)) {
                cloned = new Date(value.getTime());
            }
            else if (Objects.isObject(value)) {
                // When using DomSync, DomConfigs are usually recreated from scratch on each sync, we allow opting out
                // of cloning them (costly for many elements)
                if (value.skipClone) {
                    cloned = value;
                }
                else {
                    cloned = {};

                    for (key in value) {
                        // Note: GitHub Advanced Security parses the code of for-in loops looking for specific patterns
                        // to report issues. Check scanner result before changing:
                        if (key !== '__proto__' && key !== 'constructor') {
                            cloned[key] = Objects.clone(value[key], handler);
                        }
                    }
                }
            }
            else if (Array.isArray(value)) {
                cloned = [];

                // Loop backwards to:
                //  1. read source.length once
                //  2. get result array sized on first pass (avoid growing)
                for (key = value.length; key-- > 0; /* empty */) {
                    cloned[key] = Objects.clone(value[key], handler);
                }
            }
            else if (handler) {
                // Allow other types to be handled (e.g., DOM nodes).
                cloned = handler(value);
            }
        }

        return cloned;
    }

    static mergeUniformObjects(dest, ...sources) {
        for (const source of sources) {
            for (const key in source) {
                // Note: GitHub Advanced Security parses the code of for-in loops looking for specific patterns
                // to report issues. Check scanner result before changing:
                if (key !== '__proto__' && key !== 'constructor') {
                    const value = source[key];

                    if (value) {
                        // Dates pass isObject but must be cloned as leaves, not recursed into.
                        if (this.isObject(value) && !this.isDate(value)) {
                            this.mergeUniformObjects(dest[key] || (dest[key] = {}), value);
                        }
                        else if (Array.isArray(value)) {
                            if (!(key in dest)) {
                                dest[key] = [];
                            }

                            this.mergeArrayOfIdentityObjects(dest[key], value);
                        }
                        else {
                            dest[key] = this.clone(value);
                        }
                    }
                }
            }
        }

        return dest;
    }

    static mergeArrayOfIdentityObjects(dest, sources) {
        for (const source of sources) {
            if (this.isObject(source)) {
                // Newly added records have only a phantom id, and entries without any identity are always distinct
                const
                    identity = source.id ?? source.$PhantomId,
                    existing = identity != null && dest.find(item => (item.id ?? item.$PhantomId) === identity);

                if (existing) {
                    this.mergeUniformObjects(existing, source);
                }
                else {
                    dest.push(this.clone(source));
                }
            }
            else {
                dest.push(source);
            }
        }
    }

    static createTruthyKeys(source) {
        const
            keys = StringHelper.split(source),
            result = keys && {};

        if (keys) {
            for (const key of keys) {
                // StringHelper.split won't return empty keys if passed a string, but we
                // could have been passed a String[]
                if (key) {
                    result[key] = true;
                }
            }
        }

        return result;
    }

    /**
     * Returns value for a given path in the object
     * @param {Object} object Object to check path on
     * @param {String} path Dot-separated path, e.g. 'object.childObject.someKey'
     * @returns {*} Value associated with passed key
     */
    static getPath(object, path) {
        if (!(object && path)) {
            return null;
        }
        return path.split('.').reduce((result, key) => {
            return (result || emptyObject)[key];
        }, object);
    }

    /**
     * Returns value for a given path in the object, placing a passed default value in at the
     * leaf property and filling in undefined properties all the way down.
     * @param {Object} object Object to get path value for.
     * @param {String|Number|String[]|Number[]} path Dot-separated path, e.g. 'firstChild.childObject.someKey',
     * or the key path as an array, e.g. ['firstChild', 'childObject', 'someKey'].
     * @param {*} [defaultValue] Optionally the value to put in as the `someKey` property.
     * @returns {*} Value at the leaf position of the path.
     */
    static getPathDefault(object, path, defaultValue) {
        const
            keys   = Array.isArray(path) ? path : typeof path === 'string' ? path.split('.') : [path],
            length = keys.length - 1;

        return keys.reduce((result, key, index) => {
            if (defaultValue && !(key in result)) {
                // Can't use emptyObject here, we are creating a node in the object tree
                result[key] = index === length ? defaultValue : {};
            }

            return (result || emptyObject)[key];
        }, object);
    }

    /**
     * Finds a property descriptor for the passed object from all inheritance levels.
     * @param {Object} object The Object whose property to find.
     * @param {String} propertyName The name of the property to find.
     * @returns {Object} An ECMA property descriptor is the property was found, otherwise `null`
     */
    static getPropertyDescriptor(object, propertyName) {
        let result = null;

        for (let o = object; o && !result && !Objects.hasOwn(o, 'isBase'); o = Object.getPrototypeOf(o)) {
            result = Object.getOwnPropertyDescriptor(o, propertyName);
        }

        return result;
    }

    /**
     * Determines if the specified path exists
     * @param {Object} object Object to check path on
     * @param {String} path Dot-separated path, e.g. 'object.childObject.someKey'
     * @returns {Boolean}
     */
    static hasPath(object, path) {
        return path.split('.').every(key => {
            if (object && typeof object === 'object' && key in object) {
                object = object[key];
                return true;
            }
            return false;
        });
    }

    static getTruthyKeys(source) {
        let keys;

        if (typeof source === 'string') {
            keys = [source];
        }
        else if (Array.isArray(source)) {
            keys = source.slice();
        }
        else {
            keys = [];

            if (source) {
                for (const key in source) {
                    if (source[key]) {
                        keys.push(key);
                    }
                }
            }
        }

        return keys;
    }

    static getTruthyValues(source) {
        const values = [];

        if (source) {
            for (const key in source) {
                if (source[key]) {
                    values.push(source[key]);
                }
            }
        }

        return values;
    }

    static isClass(object) {
        if (typeof object === 'function' && object.prototype?.constructor === object) {
            // <remove-on-release>
            // TODO: find a way to differentiate function(){} from class{}
            // </remove-on-release>
            return true;
        }

        return false;
    }

    static isDate(object) {
        // A couple quick rejections but only sure way is typeOf:
        return Boolean(object?.getUTCDate) && Objects.typeOf(object) === 'date';
    }

    /**
     * Check if passed object is a Promise or contains `then` method.
     * Used to fix problems with detecting promises in code with `instance of Promise` when
     * Promise class is replaced with any other implementation like `ZoneAwarePromise` in Angular.
     * Related to these issues:
     * https://github.com/bryntum/bryntum/issues/791
     * https://github.com/bryntum/bryntum/issues/2990
     *
     * @param {Object} object object to check
     * @returns {Boolean} truthy value if object is a Promise
     * @internal
     */
    static isPromise(object) {
        if (Promise?.resolve) {
            return Promise.resolve(object) === object || typeof object?.then === 'function';
        }
        throw new Error('Promise not supported in your environment');
    }

    static isEmpty(object) {
        if (object && typeof object === 'object') {
            // noinspection LoopStatementThatDoesntLoopJS
            for (const p in object) { // eslint-disable-line no-unreachable-loop
                return false;
            }
        }

        return true;
    }

    static isObject(value) {
        const C = value?.constructor;

        /* eslint-disable */
        return Boolean(
            (
                C && // most things have a .constructor property, but...
                typeof C === 'function' &&
                !Objects.hasOwn(value, 'constructor') && // ... true constructors are only on prototypes
                !propertyIsEnumerable.call(value, 'constructor') // ... and are not enumerable
            )
            ? (
                // An in-frame instance of Object
                C === Object ||
                // Detect cross-frame objects, but exclude instance of custom classes named Object. typeOf(value) is
                // "object" even for instances of a class and typeOf(C) is "function" for all constructors. We'll have
                // to settle for relying on the fact that getPrototypeOf(Object.prototype) === null.
                // NOTE: this issue does come up in Scheduler unit tests at least.
                (C.getPrototypeOf && C.prototype && !Object.getPrototypeOf(C.prototype))
            ) &&
            // Make sure it isn't some testing tools replacement for globalThis (vitest turns globalThis into an object)
            value !== globalThis
            // Since all classes have a constructor property, an object w/o one is likely from Object.create(null). Of
            // course, primitive types do not have ".constructor"
            : (value && typeof value === 'object')
        );
        /* eslint-enable */
    }

    static isInstantiated(object) {
        return object ? typeof object === 'object' && !Objects.isObject(object) : false;
    }

    static merge(dest, ...sources) {
        return Objects.blend(dest, sources);
    }

    /**
     * Merges two "items" objects. An items object is a simple object whose keys act as identifiers and whose values
     * are "item" objects. An item can be any object type. This method is used to merge such objects while maintaining
     * their property order. Special key syntax is used to allow a source object to insert a key before or after a key
     * in the `dest` object.
     *
     * For example:
     * ```javascript
     *  let dest = {
     *      foo : {},
     *      bar : {},
     *      fiz : {}
     *  }
     *
     *  console.log(Object.keys(dest));
     *  > ["foo", "bar", "fiz"]
     *
     *  dest = mergeItems(dest, {
     *      'zip > bar' : {}    // insert "zip" before "bar"
     *      'bar < zap' : {}    // insert "zap" after "bar"
     *  });
     *
     *  console.log(Object.keys(dest));
     *  > ["foo", "zip", "bar", "zap", "fiz"]
     * ```
     *
     * @param {Object} dest The destination object.
     * @param {Object|Object[]} src The source object or array of source objects to merge into `dest`.
     * @param {Object} [options] The function to use to merge items.
     * @param {Function} [options.merge] The function to use to merge items.
     * @returns {Object} The merged object. This will be the `dest` object.
     * @internal
     */
    static mergeItems(dest, src, options) {
        options = options || blendOptions;

        let anchor, delta, index, indexMap, key, shuffle, srcVal;

        const { merge = Objects.blend } = options;
        dest = dest || {};

        if (Array.isArray(src)) {
            src.forEach(s => {
                dest = Objects.mergeItems(dest, s, options);
            });
        }
        else if (src) {
            // https://2ality.com/2015/10/property-traversal-order-es6.html
            // Bottom line: Object keys are iterated in declared/insertion order... unless the key is an integer or
            // Symbol, but we don't care about those generally.
            for (key in src) {
                // Note: GitHub Advanced Security parses the code of for-in loops looking for specific patterns
                // to report issues. Check scanner result before changing:
                if (key !== '__proto__' && key !== 'constructor') {
                    srcVal = src[key];
                    anchor = null;

                    // Allow a key to be added before or after another:
                    //
                    //  {
                    //      'foo > bar' : {
                    //          ...
                    //      },
                    //      'bar < derp' : {
                    //          ...
                    //      }
                    //  }
                    //
                    // The goal above is to add a 'foo' key before the existing 'bar' key while adding a 'derp' key after
                    // 'bar'.

                    if (key.includes('>')) {
                        [key, anchor] = key.split(beforeRe);
                        delta = 0;
                    }
                    else if (key.includes('<')) {
                        [anchor, key] = key.split(afterRe);
                        delta = 1;
                    }

                    if (key in dest) {
                        // Changing the value of a key does not change its iteration order. Since "key in dest" we can do
                        // what we need directly.
                        if (srcVal && dest[key] && merge) {
                            options.key = key;
                            srcVal = merge(dest[key], srcVal, options);
                        }

                        dest[key] = srcVal;
                    }
                    else if (!anchor) {
                        dest[key] = srcVal;
                        indexMap?.set(key, indexMap.size);
                    }
                    else {
                        // Lazily sprout the item index map. When we first merge an item into an items object, we create this
                        // Map to control the ordering. This is because any keys we add would necessarily be iterated after
                        // the original properties.
                        if (!indexMap) {
                            indexMap = new Map();
                            index = 0;

                            for (const k in dest) {
                                indexMap.set(k, index++);
                            }
                        }

                        index = indexMap.get(anchor);
                        dest[key] = srcVal;

                        if (index == null && delta) {
                            index = indexMap.size;
                        }
                        else {
                            shuffle = shuffle || [];
                            index = (index || 0) + delta;

                            // Adjust all key indices >= index up by 1 to maintain integer indices (required by the above
                            // use case).
                            for (const item of indexMap) {
                                const [k, v] = item;

                                if (index <= v) {
                                    /*
                                    Consider object w/the following order:
                                        {
                                            foo : {}',
                                            bar : {},
                                            baz : {},
                                            zip : {},
                                            goo : {},
                                            fiz : {}
                                        }

                                    The indexMap is:

                                        foo : 0
                                        bar : 1
                                        baz : 2
                                        zip : 3
                                        goo : 4
                                        fiz : 5

                                    To insert before goo, we populate shuffle thusly (to set up for popping):

                                        +-----+-----+
                                        | fiz | goo |
                                        +-----+-----+
                                          0        1
                                          =6-5-1   =6-4-1
                                    */
                                    shuffle && (shuffle[indexMap.size - v - 1] = k);

                                    indexMap.set(k, v + 1);
                                }
                            }

                            // Delete and re-add the keys that should follow the new key to establish the iteration order
                            // we need:
                            if (shuffle) {
                                while (shuffle.length) {
                                    const
                                        k = shuffle.pop(),
                                        v = dest[k];

                                    delete dest[k];
                                    dest[k] = v;
                                }
                            }
                        }

                        indexMap.set(key, index);
                    }
                }
            }
        }

        return dest;
    }

    /**
     * Sets value for a given path in the object
     * @param {Object} object Target object
     * @param {String} path Dot-separated path, e.g. 'object.childObject.someKey'
     * @param {*} value Value for a given path
     * @returns {Object} Returns passed object
     */
    static setPath(object, path, value) {
        path.split('.').reduce((result, key, index, array) => {
            const isLast = index === array.length - 1;

            if (isLast) {
                return result[key] = value;
            }
            else if (!(result[key] instanceof Object)) {
                result[key] = {};
            }

            return result[key];
        }, object);

        return object;
    }

    static typeOf(value) {
        let trueType, type;

        if (value === null) {
            type = 'null';
        }
        // NaN is the only value that is !== to itself
        else if (value !== value) { // eslint-disable-line no-self-compare
            type = 'nan';
        }
        else {
            type = typeof value;

            if (type === 'object') {
                if (value.isBase) {
                    type = 'instance';
                }
                else if (Array.isArray(value)) {
                    type = 'array';
                }
                else if (!(type = typeCache[trueType = toString.call(value)])) {
                    typeCache[trueType] = type = trueType.slice(8, -1).toLowerCase();  // '[object Date]' => 'date'
                }
            }
            else if (type === 'function' && value.isBase) {
                type = 'class';
            }
        }

        return type;
    }

    /**
     * Traverses a tree (or array of trees), collects nodes that match a filter function into a flat array,
     * and recursively visits child nodes of expanded nodes.
     *
     * @param {Object|Object[]} nodes                  Root node or array of root nodes to traverse.
     * @param {Function}        filterFn               Function called with each node; should return `true` to include the node.
     * @param {String}          [childrenField=children] Property name holding child nodes on each node.
     * @param {String}          [expandedField=expanded] Property name indicating whether a node's children should be traversed.
     * @returns {Object[]}                             Flat array of nodes for which `filterFn` returned `true`.
     * @internal
     */
    static filterTreeToArray(nodes, filterFn, childrenField = 'children', expandedField = 'expanded') {
        if (!Array.isArray(nodes)) {
            nodes = [nodes];
        }

        const result = [];

        for (const node of nodes) {
            if (filterFn(node)) {
                result.push(node);
            }

            const children = node[childrenField];

            if (node[expandedField] && children) {
                // Output is potentially a big array, avoid using spread operator
                for (const item of this.filterTreeToArray(children, filterFn, childrenField, expandedField)) {
                    result.push(item);
                }
            }
        }

        return result;
    }
}

// <remove-on-release>
// TODO: remove this once we have the polyfill or don't need it
//  https://caniuse.com/mdn-javascript_builtins_object_hasown
//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn
// </remove-on-release>
Object.defineProperty(Objects, 'hasOwn', {
    // When available, this avoids an extra layer of function call around it:
    value : Object.hasOwn || ((object, property) => hasOwnProperty.call(object, property))
});
