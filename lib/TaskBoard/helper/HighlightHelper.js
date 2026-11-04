import StringHelper from '../../Core/helper/StringHelper.js';
import ArrayHelper from '../../Core/helper/ArrayHelper.js';

/**
 * @module TaskBoard/helper/HighlightHelper
 */

/**
 * @typedef {Array} RegExpMatch Definition of a single RegExp match result with added `end` property.
 * @property {Number} index - The start index of the match.
 * @property {Number} length - The length of the matched substring.
 * @property {Number} [end] - The end index of the match.
 * @property {Number} 0 - The matched substring.
 * @property {String} input - The original input string.
 */

/**
 * Sort matches by start index, and merge overlapping and adjacent matches.
 *
 * @param {RegExpMatch[]} matches - An array of matches to consolidate.
 * @returns {RegExpMatch[]} - The consolidated matches.
 * @internal
 */
const consolidateMatches = matches => {
    if (matches.length === 0) {
        return [];
    }

    const
        text   = matches[0].input,
        result = [];

    let current = null;

    matches
        .flatMap(match =>
            match[0]
                ? [{
                    ...match,
                    end : match.index + match[0].length
                }]
                : []
        )
        .sort((a, b) => a.index - b.index) // in-place sorting is okay because array is already cloned
        .forEach(({ index, end }) => {
            if (current == null) {
                current = { index, end };
            }
            else if (index <= current.end) {
                current.end = Math.max(current.end, end);
            }
            else {
                current[0]     = text.slice(current.index, current.end);
                current.length = current.end - current.index;
                result.push(current);

                current = { index, end };
            }
        });

    if (current) {
        current[0]     = text.slice(current.index, current.end);
        current.length = current.end - current.index;
        result.push(current);
    }

    return result;
};

/**
 * A helper class for highlighting text matches within HTML elements.
 * @internal
 */
export default class HighlightHelper {
    static $name = 'HighlightHelper';

    // region static methods

    /**
     * Highlights text in the specified fields of the specified element. The fields are specified as a list of field names,
     * like 'name' or 'description'. These are used to find the elements which should contain highlighted matches. The names
     * will be expanded to `[data-field="${field}"]` selectors.
     *
     * This function is intended to be used with {@link TaskBoard.widget.ColumnSearchField} to highlight matches that have
     * been found in the task records. The `matchers` parameter can be retrieved from a {@link TaskBoard.widget.ColumnSearchField#property-matchers} getter.
     *
     * Matching patterns will be wrapped into a `<mark>` tag. The highlighting is done in-place, so the original DOM
     * structure is preserved.
     *
     * {@note} When the parent element is a flex container, `highlight()` will remove the display style when matches are
     * found. This is necessary because the added tags will otherwise break the text flow.
     * When calling `unhighlight()`, the original display style will be restored.{/@note}
     *
     * @param {String|String[]|HTMLElement|HTMLElement[]} elements - The elements or selectors where patterns should be
     *     highlighted.
     * @param {String|String[]|RegExp|RegExp[]} matchers - Patterns to highlight.
     *     - If a string is provided, it will be converted into a RegExp.
     *     - If an array is provided, each string element will be converted into a RegExp.
     *     - If a RegExp is provided, it will be used as-is.
     *     - If an array of RegExps is provided, they will be used as-is.
     * @internal
     */
    static highlightMatches(elements, matchers) {
        if (elements == null) {
            return;
        }

        elements = ArrayHelper.asArray(elements)
            .map(element => element instanceof HTMLElement
                ? element
                : document.querySelector(element))
            .filter(element => element != null);

        if (elements.length === 0) {
            return;
        }

        // Ensure matchers is an array, and turn all strings into RegExp objects
        try {
            matchers = ArrayHelper.asArray(matchers)
                .filter(matcher => matcher != null)
                .map(matcher =>
                    (typeof matcher === 'string' || matcher instanceof String)
                        ? StringHelper.escapeRegExp(matcher, 'gi')
                        : matcher
                );
        }
        catch {
            // Unparseable matcher encountered, bail out
            return;
        }

        if (matchers.length === 0) {
            return;
        }

        HighlightHelper.unhighlightMatches(elements);

        for (const element of elements) {
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

            while (walker.nextNode()) {
                const
                    node = walker.currentNode,
                    text   = node.nodeValue.trim(),
                    parent = node.parentNode;

                let matches = [];

                if (!text.length) {
                    continue;
                }

                matches = matchers.map(term => {
                    // never re-use the same RegExp object, it will carry state across iterations
                    return [...text.matchAll(new RegExp(term))];
                });
                matches = consolidateMatches(matches.flat());

                if (!matches.length) {
                    continue;
                }

                // Since the highlighting adds DOM children, the content might have gaps destroying the
                // text flow. To prevent this, we remove flex from the parent element.
                const computedStyle = globalThis.getComputedStyle(parent);
                if (computedStyle.display.match(/flex/)) {
                    parent.style.display = 'revert';
                }

                const fragment = document.createDocumentFragment();
                let lastIndex = 0;

                for (const match of matches) {
                    const offset = match.index;

                    if (offset > lastIndex) {
                        fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex, offset)));
                    }

                    const mark = document.createElement('mark');
                    mark.textContent = match[0];
                    fragment.appendChild(mark);

                    lastIndex = offset + match[0].length;
                }

                if (lastIndex < node.nodeValue.length) {
                    fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex)));
                }

                parent.replaceChild(fragment, node);
            }
        }
    }

    /**
     * Removes highlighting from specified fields within the given element by replacing highlighted marks with their text
     * content and merging adjacent text nodes.
     *
     * This function is intended to be used with {@link TaskBoard.widget.ColumnSearchField} and in conjunction with
     * `highlightMatches()`.
     *
     * {@note} When the parent element was a flex container before `highlight()` added `<mark>` tags, the original display
     * style will be restored here.{/@note}
     *
     * @param {String|String[]|HTMLElement|HTMLElement[]} elements - The elements or selectors containing matches to unhighlight
     * @internal
     */
    static unhighlightMatches(elements) {
        if (elements == null) {
            return;
        }

        elements = ArrayHelper.asArray(elements)
            .flatMap(el => {
                const node = el instanceof HTMLElement
                    ? el
                    : document.querySelector(el);

                return node ? [node] : [];
            });

        if (elements.length === 0) {
            return;
        }

        const
            marks = elements.reduce((acc, element) => {
                return acc.concat(...element.querySelectorAll('mark'));
            }, []);

        for (const mark of marks) {
            const parent = mark.parentNode;

            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.style.display = '';
            parent.normalize(); // merge adjacent text nodes
        }
    }

    // endregion
}

