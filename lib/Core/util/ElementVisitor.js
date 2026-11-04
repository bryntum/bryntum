import Base from '../Base.js';

/**
 * @module Core/util/ElementVisitor
 */

/**
 * A utility class for visiting elements in the DOM tree.
 *
 * It is recommended to use the static {@link #function-getVisitor-static} method to obtain instances of this class
 * because they are cached and reused based on the element and selector.
 * @extends Core/Base
 * @internal
 */
export default class ElementVisitor extends Base {
    static $name = 'ElementVisitor';

    static configurable = {
        /**
         * The element to visit.
         * @config {HTMLElement} element
         */
        element : null,

        /**
         * The selector to use when visiting the element or a function which may accept of reject candidate nodes by returning
         * - NodeFilter.FILTER_ACCEPT
         * - NodeFilter.FILTER_REJECT
         * - NodeFilter.FILTER_SKIP
         *
         * @config {String|Function} selector
         * @param {Node} node The node to accept or reject.
         * @returns {Number} NodeFilter.FILTER_ACCEPT, NodeFilter.FILTER_REJECT, or NodeFilter.FILTER_SKIP.
         */
        selector : null
    };

    // Cache of selectors to ElementVisitor Maps based on the element.
    // Entries will be evicted when the element is removed from the DOM and no longer referenced.
    static elementVisitorMap = new WeakMap();

    /**
     * Returns an ElementVisitor instance for the given element and selector.
     *
     * This is the recommended way to get an ElementVisitor instance as it will reuse instances.
     * @param {HTMLElement} element The element in which to visit selected descendants.
     * @param {String} selector The selector to use when visiting descendant nodes within the element.
     * @returns {Core.util.ElementVisitor} An ElementVisitor instance which visits the element's descendants based on the selector.
     */
    static getVisitor(element, selector) {
        const
            { elementVisitorMap } = this,
            selectorMap           = elementVisitorMap.get(element) || (elementVisitorMap.set(element, new Map()).get(element)),
            key                   = typeof selector === 'string' ? selector : selector.toString();

        return selectorMap.get(key) || (selectorMap.set(key, new ElementVisitor({ element, selector })).get(key));
    }

    updateSelector(selector) {
        this.treeWalker = document.createTreeWalker(this.element, NodeFilter.SHOW_ELEMENT, typeof selector === 'string' ? node => node.matches?.(selector) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP : selector);
    }

    /**
     * Returns the first element in the tree that matches the selector.
     * @returns {HTMLElement}
     */
    first() {
        this.treeWalker.currentNode = this.element;
        return this.treeWalker.firstChild();
    }

    /**
     * Returns the previous element in the tree that matches the selector.
     * @returns {HTMLElement}
     */
    previous(current) {
        if (current) {
            this.treeWalker.currentNode = current;
        }
        return this.treeWalker.previousNode();
    }

    /**
     * Returns the next element in the tree that matches the selector.
     * @returns {HTMLElement}
     */
    next(current) {
        if (current) {
            this.treeWalker.currentNode = current;
        }
        return this.treeWalker.nextNode();
    }

    /**
     * Returns the last element in the tree that matches the selector.
     * @returns {HTMLElement}
     */
    last() {
        this.treeWalker.currentNode = this.element;
        return this.treeWalker.lastChild();
    }
}
