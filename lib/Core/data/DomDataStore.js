/**
 * @module Core/data/DomDataStore
 */

const
    NOT_PASSED = {};

/**
 * Stores data on a dom element (by setting element._domData).
 * Instead of using HTML5:s element.dataset, which turned out to be slow.
 * @internal
 */
export default class DomDataStore {
    /**
     * Get the data that is connected to a specified `element` or just a specific `key`.
     * @param {HTMLElement} element DOM element
     * @param {String} [key] The name of the property in the element data to return
     * @returns {*}
     */
    static get(element, key = NOT_PASSED) {
        const result = (element._domData || (element._domData = {}));

        return (key === NOT_PASSED) ? result : result[key];
    }

    /**
     * Remove the specified `key` from the data connected to a given `element`.
     * @param {HTMLElement} element DOM element
     * @param {String} key The name of the property in the element data to remove.
     */
    static remove(element, key) {
        const
            { _domData } = element,
            was = _domData?.[key];

        delete _domData?.[key];

        return was;
    }

    /**
     * Sets all data connected to specified element (completely replacing any existing) or just a specific key.
     * To update data, use DomDataStore#assign instead.
     * @param {HTMLElement} element DOM element
     * @param {Object|String} data Data object to set, or property name to set
     * @param {*} [value] If the previous parameter was a property name, this is the value to set.
     * @returns {*} The `value` or `data` passed.
     */
    static set(element, data, value = NOT_PASSED) {
        if (value === NOT_PASSED) {
            element._domData = value = data;
        }
        else {
            (element._domData || (element._domData = {}))[data] = value;
        }

        return value;
    }

    /**
     * Updates data connected to specified element.
     * @param {HTMLElement} element DOM element
     * @param {Object} data Data to assign
     */
    static assign(element, data) {
        Object.assign((element._domData || (element._domData = {})), data);
    }
}
