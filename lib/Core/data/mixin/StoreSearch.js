import Base from '../../Base.js';
import ObjectHelper from '../../helper/ObjectHelper.js';

/**
 * @module Core/data/mixin/StoreSearch
 */

const
    findInString = (value, text) => String(value).toLowerCase().includes(text),
    matchFns     = {
        string  : findInString,
        number  : (value, text) => value === Number(text),
        boolean : findInString,
        date    : (value, text) => {
            if (value instanceof Date && text instanceof Date) {
                return value - text === 0;
            }
            return String(value.getMonth() + 1).includes(text) ||
                String(value.getDate()).includes(text) ||
                String(value.getFullYear()).includes(text);
        },
        object    : (value, text) => value === text, // typeof null === object
        undefined : (value, text) => value === text
    };

/**
 * Format returned by Store#findByField().
 * @typedef {Object} StoreSearchResult
 * @property {Number} index Index of the record in the store
 * @property {Core.data.Model} data The record
 */

/**
 * Mixin for Store that handles searching (multiple records) and finding (single record).
 *
 * ```javascript
 * // find all records that has a field containing the string john
 * const hits = store.search('john');
 * ```
 *
 * ## Useful functions
 *
 * | Function                                     | Description                                       |
 * |----------------------------------------------|---------------------------------------------------|
 * | {@link #function-search}                     | Search all fields for a string, returns all hits   |
 * | {@link #function-findByField}                | Search a specific field for a value                |
 * | {@link #function-find}                       | Find the first record matching a function          |
 * | {@link #function-findRecord}                 | Find a record by field and value                   |
 *
 * ## See also
 *
 * - {@link Core.data.Store} - The main store class
 * - {@link Core.data.mixin.StoreFilter} - Filtering as an alternative to searching
 *
 * @mixin
 */
export default Target => class StoreSearch extends (Target || Base) {
    static $name = 'StoreSearch';

    //region Search (multiple hits)

    /**
     * Find all hits matching the specified input.
     *
     * ```javascript
     * const store = new Store({
     *   fields : ['name', 'kind'],
     *   data : [
     *     { id : 1, name : 'Batman', kind : 'hero' },
     *     { id : 2, name : 'Batkid', kind : 'hero' },
     *     { id : 3, name : 'Joker', kind : 'villain' },
     *     { id : 4, name : 'Penguin', kind : 'villain' }
     *   ]
     * });
     *
     * store.search('villain'); // [{ index : 2, data : joker-record }, { index : 3, data : penguin-record }]
     * ```
     *
     * @param {String} text Value to search for
     * @param {String[]} [fields] Fields to search value in, searches in all defined fields if not specified
     * @param {Function[]} [formatters] An array of field formatting functions to format the found value
     * @param {Boolean} [searchAllRecords] True to ignore any applied filters when searching
     * @returns {StoreSearchResult[]} Array of hits, in the format `{ index: x, data: record }`
     * @category Search
     */
    search(text, fields = null, formatters, searchAllRecords) {
        const
            records = this.isTree && !searchAllRecords ? this.rootNode.allChildren : this.getAllDataRecords(searchAllRecords),
            len     = records.length,
            found   = [];

        if (text == null) {
            return [];
        }

        if (typeof text === 'string') {
            text = text.toLowerCase();
        }

        if (!fields) {
            fields = this.modelClass.allFields.map(field => field.name);
        }

        let i,
            j,
            record,
            value,
            valueType,
            comparison;

        for (i = 0; i < len; i++) {
            record = records[i];
            j      = 0;

            for (const key of fields) {
                value     = record.getValue(key);
                valueType = (value instanceof Date) ? 'date' : typeof value;

                const formatter = formatters?.[j];

                if (formatter) {
                    value     = formatter(value);
                    valueType = 'string';
                }

                comparison = matchFns[valueType];

                if (value && comparison?.(value, text)) {
                    found.push({
                        index : i,
                        data  : record,
                        field : key,
                        id    : record.id
                    });
                }
                j++;
            }
        }

        return found;
    }

    /**
     * Find occurrences of the specified `value` in the specified `field` on all locally available records in the store
     * @param {String} field The record field to search in
     * @param {*} value Value to search for
     * @param {Boolean} distinct True to only return distinct matches, no duplicates
     * @param {Boolean} [searchAllRecords] True to ignore any applied filters when searching
     * @returns {StoreSearchResult[]} Array of hits, in the format { index: x, data: record }
     * @category Search
     */
    findByField(field, value, distinct = false, searchAllRecords = false) {
        const
            records    = this.getAllDataRecords(searchAllRecords),
            len        = records.length,
            usedValues = new Set(),
            found      = [];

        let i, record, fieldValue;

        if (value != null) {
            value = String(value).toLowerCase();
        }

        for (i = 0; i < len; i++) {
            record     = records[i];
            fieldValue = record.getValue(field);

            if (!distinct || !usedValues.has(fieldValue)) {
                const
                    type    = fieldValue instanceof Date ? 'date' : typeof fieldValue,
                    matchFn = matchFns[type];

                if ((value == null && fieldValue === value) || (value === '' && fieldValue === '') || (value && matchFn(fieldValue, value))) {
                    found.push({
                        id    : record.id,
                        index : i,
                        data  : record
                    });

                    if (distinct) {
                        usedValues.add(fieldValue);
                    }
                }
            }
        }

        return found;
    }

    //endregion

    //region Find (single hit)

    /**
     * Finds the first record for which the specified function returns true
     * @param {Function} fn Comparison function, called with record as parameter
     * @param {Core.data.Model} fn.record Record to compare
     * @param {Boolean} [searchAllRecords] True to ignore any applied filters when searching
     * @returns {Core.data.Model} Record or undefined if none found
     *
     * ```javascript
     * store.find(record => record.color === 'blue');
     * ```
     *
     * @category Search
     */
    find(fn, searchAllRecords = false)  {
        return this.getAllDataRecords(searchAllRecords).find(fn);
    }

    /**
     * Finds the first record for which the specified field has the specified value
     * @param {String} fieldName Field name
     * @param {*} value Value to find
     * @param {Boolean} [searchAllRecords] True to ignore any applied filters when searching
     * @returns {Core.data.Model} Record or undefined if none found
     * @category Search
     */
    findRecord(fieldName, value, searchAllRecords = false) {
        const
            matchFn = r => ObjectHelper.isEqual(r[fieldName], value);

        if (this.isTree) {
            return this.query(matchFn, searchAllRecords)[0];
        }
        return this.getAllDataRecords(searchAllRecords).find(matchFn);
    }

    /**
     * Searches the Store records using the passed function.
     * @param {Function} fn A function that is called for each record.
     * @param {Core.data.Model} fn.record Current record
     * @param {Boolean} fn.returns Returns `true` value to indicate a match
     * @param {Boolean} [searchAllRecords] True to ignore any applied filters when searching
     * @returns {Core.data.Model[]} An array of the matching Records
     * @category Search
     */
    query(fn, searchAllRecords = false) {
        return this.getAllDataRecords(searchAllRecords).filter(fn);
    }
    //endregion

    //region Others

    /**
     * Returns true if the supplied function returns true for any record in the store
     * @param {Function} fn A function that should return true to indicate a match
     * @param {Core.data.Model} fn.record Current record
     * @param {Boolean} [searchAllRecords] True to ignore any applied filters when searching
     * @returns {Boolean}
     *
     * ```javascript
     * store.some(record => record.age > 95); // true if any record has age > 95
     * ```
     *
     * @category Search
     */
    some(fn, searchAllRecords = false) {
        return this.getAllDataRecords(searchAllRecords).some(fn);
    }

    //endregion
};
