/**
 * @module Core/util/Colors
 */

const
    // Single source of truth for Bryntum predefined named color names. Each name mirrors a `--b-color-*` CSS variable
    // in `Core/lib/Core/Colors.css`, which holds the actual (theme-dependent) color value.
    palette = Object.freeze([
        'red',
        'pink',
        'magenta',
        'purple',
        'violet',
        'deep-purple',
        'indigo',
        'blue',
        'light-blue',
        'cyan',
        'teal',
        'green',
        'light-green',
        'lime',
        'yellow',
        'amber',
        'orange',
        'deep-orange',
        'brown',
        'lighter-gray',
        'light-gray',
        'gray',
        'black'
    ]),
    nameSet     = new Set(palette);

/**
 * Holds the single canonical list of Bryntum predefined named colors, and the logic for resolving a color value
 * (named or any CSS color) to a `--b-primary` style value.
 *
 * The preferred way to refer to a predefined color is with the `b-` prefix, e.g. `b-red`. A value without the prefix
 * that still matches a predefined color (e.g. `red`) is accepted for backwards compatibility, but the `b-` form is the
 * documented, canonical way. Any other non-empty value is treated as a literal CSS color (e.g. `#ff0000`, `rgb(...)` or
 * a CSS named color such as `chocolate`).
 *
 * @internal
 */
export default class Colors {
    /**
     * The names of all predefined colors, e.g. `['red', 'pink', ...]`.
     * @member {String[]} names
     * @readonly
     * @static
     */
    static get names() {
        return [...palette];
    }

    /**
     * The canonical prefix for predefined color values, e.g. the `b-` in `b-red`.
     * @member {String} prefix
     * @readonly
     * @static
     * @internal
     */
    static prefix = 'b-';

    static prefixRe = new RegExp(`^${this.prefix}`);

    /**
     * Strips the canonical `b-` prefix from the passed value, regardless of whether it names a predefined color. Use
     * this for a pure prefix strip; for predefined-color resolution use {@link #function-getColorName-static} instead.
     * @param {String} value
     * @returns {String}
     * @static
     * @internal
     */
    static stripPrefix(value) {
        return String(value).replace(this.prefixRe, '');
    }

    /**
     * Returns `true` if the passed value is one of the predefined named colors, with or without the `b-` prefix
     * (e.g. both `red` and `b-red` return `true`).
     * @param {String} value
     * @returns {Boolean}
     * @static
     */
    static isNamedColor(value) {
        return Boolean(value) && nameSet.has(String(value).replace(this.prefixRe, ''));
    }

    /**
     * Returns the bare predefined color name for the passed value (stripping any `b-` prefix), or `null` if the value
     * is not a predefined color. Both the canonical `b-` form (e.g. `b-red`) and the legacy bare form (e.g. `red`) are
     * recognized.
     * @param {String} value
     * @returns {String|null}
     * @static
     */
    static getColorName(value) {
        if (!value) {
            return null;
        }

        const name = String(value).replace(this.prefixRe, '');

        return nameSet.has(name) ? name : null;
    }

    /**
     * Resolves a color value to a value usable for the `--b-primary` CSS variable. Predefined colors (with or without
     * the `b-` prefix) resolve to `var(--b-color-<name>)`, any other non-empty value is returned as-is (assumed to be
     * a valid CSS color), and an empty value resolves to `''`.
     * @param {String} value
     * @returns {String}
     * @static
     */
    static createColorStyle(value) {
        value = value?.toLowerCase();

        if (!value?.length) {
            return '';
        }

        const name = Colors.getColorName(value);

        return name ? `var(--b-color-${name})` : value;
    }

    /**
     * Resolves a color value to a concrete, literal CSS color (e.g. `#e53935`) read from the loaded theme. Unlike
     * {@link #function-createColorStyle-static}, which returns the `var(--b-color-<name>)` form, this resolves the
     * computed value, for consumers where CSS variables don't work, such as a canvas 2D `fillStyle`.
     *
     * Predefined colors (canonical `b-<name>` or legacy bare `<name>`) resolve to the computed `--b-color-<name>`
     * value of the passed `element` (or the document root). Any other non-empty value is returned unchanged (assumed
     * to be a valid literal CSS color), and an empty value resolves to `''`. With no document available, the value is
     * returned unchanged.
     * @param {String} value
     * @param {HTMLElement} [element] Element to read the theme variable from, defaults to the document root.
     * @returns {String}
     * @static
     * @internal
     */
    static resolveColorValue(value, element = globalThis.document?.documentElement) {
        if (!value) {
            return '';
        }

        const name = Colors.getColorName(value);

        // Not a predefined color, or no document to read the theme from - return the value unchanged.
        if (!name || !element) {
            return value;
        }

        return globalThis.getComputedStyle(element).getPropertyValue(`--b-color-${name}`).trim() || value;
    }
}
