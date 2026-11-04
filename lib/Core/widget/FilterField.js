import TextField from './TextField.js';
import StringHelper from '../helper/StringHelper.js';

/**
 * @module Core/widget/FilterField
 */

/**
 * A text field that filters a {@link Core.data.Store} as the user types. Connect it to a store via {@link #config-store}
 * and specify which record field to match against using {@link #config-field}, or supply a custom
 * {@link #config-filterFunction} for full control over the matching logic. The filter is applied on each keystroke
 * and automatically removed when the field is cleared. This widget is commonly used as a toolbar search box for
 * grids, lists, or any store-backed component.
 *
 * Allows filtering by {@link #config-field}:
 *
 * ```javascript
 * const filterField = new FilterField({
 *     store : eventStore,
 *     field : 'name'
 * });
 * ```
 *
 * Or by using a {@link #config-filterFunction filter function} for greater control/custom logic:
 *
 * ```javascript
 * const filterField = new FilterField({
 *     store          : eventStore,
 *     filterFunction : (record, value) => record.name.includes(value)
 * });
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config                                           | Description                                        |
 * |--------------------------------------------------|----------------------------------------------------|
 * | {@link #config-store}                            | The store to filter                                |
 * | {@link #config-field}                            | The model field name to match against              |
 * | {@link #config-filterFunction}                   | Custom filter function receiving `(record, value)` |
 * | {@link #config-filterId}                         | Custom ID for the filter added to the store        |
 * | {@link Core.widget.TextField#config-placeholder} | Placeholder text (e.g., "Search...")               |
 *
 * ## See also
 *
 * - {@link Core.widget.TextField} - Parent class for text input
 * - {@link Core.data.Store} - The store class that holds filterable data
 * - {@link Core.util.CollectionFilter} - The underlying filter utility
 *
 * @extends Core/widget/TextField
 * @classtype filterfield
 * @widget
 */
export default class FilterField extends TextField {

    static $name = 'FilterField';

    static type = 'filterfield';

    static configurable = {
        /**
         * The model field name to filter by. Can optionally be replaced by {@link #config-filterFunction}
         * @config {String}
         * @category Filtering
         */
        field : null,

        /**
         * The store to filter.
         * @config {Core.data.Store}
         * @category Filtering
         */
        store : null,

        /**
         * Optional filter function to be called with record and value as parameters for store filtering.
         * ```javascript
         * {
         *     type           : 'filterfield',
         *     store          : myStore,
         *     filterFunction : (record, value)  => {
         *        return record.text.includes(value);
         *     }
         * }
         * ```
         *
         * @config {Function}
         * @param {Core.data.Model} record Record for comparison
         * @param {String} value Value to compare with
         * @returns {Boolean} Returns `true` if record matches comparison requirements
         * @category Filtering
         */
        filterFunction : null,

        /**
         * In case the `filterId` that is used in the store needs to be referenced elsewhere, it can be configured.
         * This applies to a passed {@link #config-filterFunction} as well as for an internally generated filter.
         * If no value is configured, an internal ID will be generated.
         * ```javascript
         * {
         *     type     : 'filterfield',
         *     store    : myStore,
         *     filterId : 'ColumnFilter'
         * }
         * ```
         *
         * @config {String|Symbol}
         * @category Filtering
         */
        filterId : null,

        /**
         * Set this flag to mark the filter as `internal` when adding it to the associated {@link Core/data/Store}.
         * This prevents the filter from being removed when {@link Core/data/Store#function-clearFilters Store.clearFilters()}
         * is called.
         * @config {Boolean}
         * @category Filtering
         * @default false
         */
        internalFilter : null,

        clearable            : true,
        revertOnEscape       : true,
        ignoreParentReadOnly : true,
        keyStrokeChangeDelay : 100,
        internalListeners    : {
            change : 'onInternalChange'
        }
    };

    updateValue(value, old) {
        super.updateValue(value, old);

        // Initial value, apply it
        if (value && this.isConfiguring) {
            this.onInternalChange({ value });
        }
    }

    onInternalChange({ value }) {
        const { store, field, filterFunction, internalFilter, filterId : customFilterId } = this;

        if (store) {
            const filterId = customFilterId ?? `${field || this.id}-Filter`;

            if (value.length === 0) {
                store.removeFilter(filterId);
            }
            else {
                let filterBy;

                if (filterFunction) {
                    filterBy = record => filterFunction(record, value);
                }
                else {
                    // We filter using a RegExp, so quote significant characters
                    value = StringHelper.escapeRegExp(value);

                    filterBy = record => record.getValue(field)?.match(new RegExp(value, 'i'));
                }

                // A filter with an id replaces any previous filter with that id.
                // Leave any other filters which may be in use in place.
                store.filter({
                    id : filterId,
                    filterBy,
                    ...(internalFilter ? { internal : true } : {})
                });
            }
        }
    }
}

FilterField.initClass();
