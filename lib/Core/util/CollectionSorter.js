import Base from '../Base.js';
import IdHelper from '../helper/IdHelper.js';

/**
 * @module Core/util/CollectionSorter
 */

/**
 * A class which encapsulates a single sorter operation which may be applied to a {@link Core.util.Collection} to
 * order its elements in a specific way.
 *
 * A CollectionSorter generally has two properties:
 *
 * * `property` - The name of a property in collection objects by which to sort
 * * `direction` - The sort direction, `'ASC'` or `'DESC'`.
 *
 * It may also be configured with just a {@link #config-sortFn} function which returns the desired comparison
 * result when passed two objects to compare. Note that this does *not* require or use the
 * {@link #config-property} config. Two collection items are passed for comparison.
 *
 * Further configurations may affect how the sorter is applied:
 *
 * * `convert` - A function which, when passed the {@link #config-property} value from
 * a collection object, returns the value to sort by.
 *
 * A CollectionSorter may be configured to encapsulate a {@link #config-sortFn} by passing that function as the sole
 * parameter to the constructor:
 *
 * ```javascript
 *     new CollectionSorter((lhs, rhs) => {
 *         lhs = lhs.customerDetails.companyName.toLowerCase();
 *         rhs = rhs.customerDetails.companyName.toLowerCase();
 *
 *         if (lhs < rhs) {
 *             return -1;
 *         }
 *         else if (lhs > rhs) {
 *             return 1;
 *         }
 *         else {
 *             return 0;
 *         }
 *     });
 * ```
 *
 * ## Useful configs
 *
 * | Config                           | Description                               |
 * |----------------------------------|-------------------------------------------|
 * | {@link #config-property}         | Name of the property to sort by           |
 * | {@link #config-direction}        | Sort direction: `'ASC'` or `'DESC'`       |
 * | {@link #config-sortFn}           | Custom comparison function                |
 * | {@link #config-caseSensitive}    | Case-sensitive string comparison          |
 *
 * ## See also
 *
 * - {@link Core.util.Collection} - Keyed, filterable, sortable collection
 * - {@link Core.data.mixin.StoreSort} - Store sorting mixin
 *
 */
export default class CollectionSorter extends Base {
    static $name = 'CollectionSorter';

    static configurable = {
        /**
         * The name of a property of collection objects which yields the value to sort by.
         * @config {String}
         */
        property : null,

        /**
         * Configure as `false` to have string comparisons case-insensitive.
         * @config {Boolean}
         * @default
         */
        caseSensitive : true,

        /**
         * The direction to sort in, `'ASC'` or `'DESC'`
         * @config {'ASC'|'DESC'}
         * @default
         */
        direction : 'ASC',

        /**
         * A function which takes the place of using {@link #config-property} and {@link #config-direction}.
         * The function is passed two objects from the collection to compare and must return the comparison result.
         * @config {Function}
         * @param {*} first The first value to compare
         * @param {*} second The second value to compare
         * @param {'ASC'|'DESC'} direction The sort direction
         * @returns {Number}  Returns `1` if first value is greater than second value, `-1` if the opposite is true
         * or `0` if they're equal
         */
        sortFn : null,

        /**
         * When using {@link #config-property}, this may be specified as a function which takes the raw
         * property value and returns the value to actually sort by.
         * @config {Function}
         * @param {*} value
         * @returns {*}
         */
        convert : null,

        /**
         * The `id` of this Sorter for when used by a {@link Core.util.Collection} Collection.
         * By default the `id` is the {@link #config-property} value.
         * @config {String}
         */
        id : null,

        /**
         * Use `localeCompare()` when sorting, which lets the browser sort in a locale specific order. Set to `true`,
         * a locale string or a locale config to enable.
         *
         * Enabling this has big negative impact on sorting performance. For more info on `localeCompare()`, see
         * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare).
         *
         * ```javascript
         * collection.addSorter({ property : 'name', useLocaleSort : 'sv-SE' });
         * ```
         *
         * @config {Boolean|String|Object}
         * @default false
         */
        useLocaleSort : null
    };

    construct(config) {
        if (typeof config === 'function') {
            config = {
                sortFn : config
            };
        }

        //<debug>
        if (!config.sortFn && !config.property) {
            throw new Error('CollectionFilter must be configured with the name of a property to compare or a sortFn');
        }
        //</debug>

        super.construct(config);
    }

    /**
     * When in a Collection (A Collection holds its Sorters in a Collection), we need an id.
     * @member {String}
     * @private
     */
    get id() {
        return this._id || (this._id = this.property || IdHelper.generateId('b-sorter'));
    }

    get sortFn() {
        return this._sortFn || this.defaultSortFn;
    }

    /**
     * Default sortFn used when no sortFn specified. Uses the {@link #config-property},
     * {@link #config-direction}, and {@link #config-convert}.
     * @private
    */
    defaultSortFn(lhs, rhs) {
        const
            me                                                  = this,
            { convert, property, useLocaleSort, caseSensitive } = me,
            multiplier                                          = me.direction.toLowerCase() === 'desc' ? -1 : 1;

        lhs = lhs[property];
        rhs = rhs[property];

        if (convert) {
            lhs = convert(lhs);
            rhs = convert(rhs);
        }

        if (!caseSensitive) {
            if (typeof lhs === 'string') {
                lhs = lhs.toLowerCase();
            }

            if (typeof rhs === 'string') {
                rhs = rhs.toLowerCase();
            }
        }

        if (useLocaleSort && lhs != null && rhs != null && typeof lhs === 'string') {
            // Use systems locale
            if (useLocaleSort === true) {
                return lhs.localeCompare(rhs);
            }

            // Use specified locale
            if (typeof useLocaleSort === 'string') {
                return lhs.localeCompare(rhs, useLocaleSort);
            }

            // Use locale config
            if (typeof useLocaleSort === 'object') {
                return lhs.localeCompare(rhs, useLocaleSort.locale, useLocaleSort);
            }
        }

        return ((lhs > rhs) ? 1 : (lhs < rhs ? -1 : 0)) * multiplier;
    }

    static generateSortFunction(sorters, tieBreaker) {
        const items = sorters.isCollection ? sorters.values : sorters,
            n = items.length;

        return (lhs, rhs) => {
            let comp, i, sorter;

            for (i = 0; i < n; ++i) {
                sorter = items[i];
                comp = sorter.sortFn(lhs, rhs, sorter.direction);
                if (comp) {
                    return comp;
                }
            }

            return tieBreaker ? tieBreaker(lhs, rhs) : 0;
        };
    }
}
