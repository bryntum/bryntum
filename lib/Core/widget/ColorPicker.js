import List from './List.js';
import DomHelper from '../helper/DomHelper.js';
import TemplateHelper from '../helper/TemplateHelper.js';
import StringHelper from '../helper/StringHelper.js';
import Colors from '../util/Colors.js';

DomHelper.loadStylesheet('Core/widget/ColorPicker.css');

// import Stylesheet from './ColorPicker.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ColorPicker');

/**
 * @module Core/widget/ColorPicker
 */

/**
 * Describes a color in the color picker.
 * @typedef {Object} ColorDescriptor
 * @property {String} color The color value
 * @property {String} text The text to display for the color
 */

/**
 * A color palette widget that displays a grid of {@link #config-colors} which the user can select using mouse or
 * keyboard. Colors can be provided as simple CSS strings, as `{ color, text }` descriptor objects with tooltips, or
 * the widget can default to a predefined named color palette. Use {@link #config-addNoColorItem} to include a
 * "no color" option. The {@link #config-colorSelected} callback is invoked when a color is picked. This widget is
 * used internally by {@link Core.widget.ColorField} as its dropdown picker but can also be used standalone.
 *
 * {@inlineexample Core/widget/ColorPicker.js}
 *
 * ```javascript
 * // Using the default predefined colors (b-red, b-blue, etc.)
 * new ColorPicker({
 *     appendTo : document.body,
 *     width    : '14em',
 *     colorSelected({ color }) {
 *         console.log('Selected:', color);  // e.g., 'b-red', 'b-blue'
 *     }
 * });
 * ```
 *
 * ## Color Modes
 *
 * The ColorPicker supports three ways of configuring colors:
 *
 * ### 1. Default Predefined Colors
 *
 * When no `colors` or `colorClasses` config is provided, the picker defaults to Bryntum's predefined named palette
 * (see {@link Core.Base#typedef-Color}). Colors are rendered via CSS theme classes (`b-color-red`,
 * `b-color-blue`, etc.) and emit the canonical `b-` prefixed value:
 *
 * ```javascript
 * const picker = new ColorPicker({
 *     appendTo : document.body
 * });
 *
 * picker.on('colorSelected', ({ color }) => {
 *     console.log(color);  // e.g., 'b-red', 'b-blue', 'b-green'
 * });
 *
 * ```
 *
 * See {@link Core/guides/upgrades/8.0.0#ColorField-API-update} for migration details.
 *
 * ### 2. User-Defined Colors (Array of Strings)
 *
 * Provide an array of CSS color strings (hex, rgb, named CSS colors, etc.):
 *
 * ```javascript
 * new ColorPicker({
 *     appendTo : document.body,
 *     colors   : ['#FF0000', '#00FF00', '#0000FF']
 * });
 *
 * // Selecting emits the exact string provided
 * picker.on('colorSelected', ({ color }) => {
 *     console.log(color);  // e.g., '#FF0000', '#00FF00'
 * });
 * ```
 *
 * ### 3. Named Colors with Descriptors
 *
 * Provide objects with `color` and `text` properties for custom labels and tooltips:
 *
 * ```javascript
 * new ColorPicker({
 *     appendTo : document.body,
 *     colors   : [
 *         { color : '#FF0000', text : 'Red' },
 *         { color : '#00FF00', text : 'Green' },
 *         { color : '#0000FF', text : 'Blue' }
 *     ]
 * });
 *
 * // Selecting emits the color field value
 * picker.on('colorSelected', ({ color }) => {
 *     console.log(color);  // e.g., '#FF0000'
 * });
 * ```
 *
 * Or use array-pair form (alternative syntax):
 *
 * ```javascript
 * new ColorPicker({
 *     colors : [
 *         ['#FF0000', 'Red'],
 *         ['#00FF00', 'Green'],
 *         ['#0000FF', 'Blue']
 *     ]
 * });
 * ```
 *
 * ## Useful configs and events
 *
 * | Config / Event                 | Description                                          |
 * |--------------------------------|------------------------------------------------------|
 * | {@link #config-colors}         | Array of CSS colors or `{ color, text }` descriptors |
 * | {@link #config-addNoColorItem} | Include a "no color" option in the palette           |
 * | {@link #config-columns}        | Number of columns in the color grid (default 6)      |
 * | {@link #config-colorSelected}  | Callback fired when a color is selected              |
 *
 * ## See also
 *
 * - {@link Core.widget.ColorField} - A form field that uses ColorPicker as its dropdown
 * - {@link Core.widget.List} - Base list class
 *
 * @extends Core/widget/List
 * @classtype colorpicker
 */
export default class ColorPicker extends List {

    static $name = 'ColorPicker';

    static type = 'colorpicker';

    static configurable = {
        itemCls        : 'b-color-picker-swatch',
        itemsFocusable : false,
        navigator      : {
            focusCls : 'b-color-active'
        },
        scrollable : null,

        itemWrapperTpl(record, i) {
            const
                { color }      = record,
                { selected }   = this,
                { text }       = record,
                colorClassName = this.getColorClassName(color);

            return TemplateHelper.tpl`
                    <li
                        class="${this.getItemClasses(record, i)} ${colorClassName}"
                        role="option"
                        aria-selected="${selected.includes(record)}"
                        data-index="${i}"
                        data-id="${StringHelper.encodeHtml(color)}"
                        data-btip="${StringHelper.encodeHtml(text)}"
                        ${this.itemsFocusable ? 'tabindex="-1"' : ''}
                        style="${colorClassName ? '' : 'color: ' + StringHelper.encodeHtml(color)}"
                    ></li>`;
        },

        /**
         * Array of internal color class names, without prefix, like `red`, `violet` etc.
         * @config {String[]}
         * @private
         */
        colorClasses : null,

        /**
         * Prefix to be inserted before the color class names in {@link #config-colorClasses}, like `b-sch-`
         * @config {String}
         * @private
         */
        colorClassPrefix : null,

        /**
         * Array of colors available in the picker. Can be a mix of:
         *
         * **String CSS colors** — hex, rgb, named CSS colors, etc.:
         * ```javascript
         * new ColorPicker({
         *     colors : ['#00FFFF', '#F0FFFF', '#89CFF0', '#0000FF', '#7393B3']
         * });
         * ```
         *
         * **Descriptor objects** — with `color` and `text` properties:
         * ```javascript
         * new ColorPicker({
         *     colors : [
         *         { color : '#000000', text : 'Black' },
         *         { color : '#FF0000', text : 'Red' },
         *         { color : '#00FF00', text : 'Green' }
         *     ]
         * });
         * ```
         *
         * **Array pairs** (alternative form):
         * ```javascript
         * new ColorPicker({
         *     colors : [
         *         ['#000000', 'Black'],
         *         ['#FF0000', 'Red'],
         *         ['#00FF00', 'Green']
         *     ]
         * });
         * ```
         *
         * When not configured, the picker defaults to Bryntum's predefined named colors. These render via CSS theme
         * classes (`b-color-red`, `b-color-blue`, etc.) and emit the canonical `b-` prefixed form (e.g., `b-red`,
         * `b-blue`). See {@link Core.Base#typedef-Color}
         * for the full list of predefined colors, or {@link Core/guides/upgrades/8.0.0#ColorField-API-update} for
         * migration details.
         * @prp {Array<String|ColorDescriptor>}
         */
        colors : null,

        /**
         * Adds an option to set no background color
         * @prp {Boolean}
         */
        addNoColorItem : true,

        /**
         * The color items is displayed in a grid layout with 6 columns as default. Change this to another number to
         * affect appearance.
         * @prp {Number}
         */
        columns : null,

        /**
         * A callback function that will be called when the user selects a color in the picker.
         * @param {Object} event Object containing event data
         * @param {Core.data.Model} event.record The selected color's record instance
         * @param {String} event.color The string color value
         * @config {Function}
         * @returns {void}
         */
        colorSelected : null,

        store : {
            // Don't pollute items
            useRawData : false
        }
    };

    configure(config) {
        super.configure(config);

        const me = this;

        // When neither `colors` nor `colorClasses` is configured, default to the predefined named colors rendered
        // via the `b-color-<name>` theme classes (the same setup TaskColorPicker uses).
        if (!me.colors && !me.colorClasses) {
            me.colorClasses     = Colors.names;
            me.colorClassPrefix = 'b-color-';
        }

        me.setItems();

        me.ion({
            item : 'onColorSelect'
        });
    }

    setItems() {
        const
            me                       = this,
            { colors, colorClasses } = me;
        let useColors = colors || colorClasses;

        if (me.addNoColorItem) {
            me.store.modelClass.allowNullId = true;
            useColors = [...useColors, null];
        }

        me.items = useColors.map(color => {
            // Predefined named colors (colorClasses) are exposed with the canonical `b-` prefix as their value/id
            // (e.g. `b-red`), while the displayed text and the CSS class use the bare name.
            if (!color || typeof color == 'string') {
                const value = colorClasses && color ? `${Colors.prefix}${color}` : color;
                return { id : value, color : value, text : (colorClasses ? StringHelper.capitalize(color) : color) || me.L('L{noColor}') };
            }
            if (Array.isArray(color)) {
                return { id : color[0], color : color[0], text : color[1] };
            }
            // Object form `{ color, text }` in colorClasses
            if (colorClasses && color.color) {
                return { ...color, id : `${Colors.prefix}${color.color}`, color : `${Colors.prefix}${color.color}` };
            }
            return color;
        });
    }

    afterConfigure(...args) {
        super.afterConfigure(...args);

        if (this.addNoColorItem || this.value) {
            this.select(this.value ?? null);
        }
    }

    updateColors() {
        if (!this.isConfiguring) {
            this.setItems();
        }
    }

    updateAddNoColorItem() {
        if (!this.isConfiguring) {
            this.setItems();
        }
    }

    onColorSelect({ record }) {
        this.refresh();
        const event = { color : record.color, record, bubbles : true };
        this.colorSelected?.(event);
        this.trigger('colorSelected', event);
    }

    select(value) {
        if (!value || typeof value === 'string') {
            // Accept legacy un-prefixed predefined color names (e.g. `red`) and match them to the `b-red` records
            const lookup = this.normalizeColorValue(value) ?? null;
            value = this.store.findRecord('color', lookup) ?? this.store.findRecord('text', lookup);
        }
        value && super.select(value);
    }

    /**
     * Returns the canonical value for a color. For `colorClasses`-based pickers (predefined named colors), a bare
     * predefined name (e.g. `red`) is normalized to its `b-` form (e.g. `b-red`); values that already use the prefix
     * and custom CSS colors are returned unchanged. Pickers using literal `colors` (e.g. hex values) always return
     * the value unchanged.
     * @param {String} value
     * @returns {String}
     * @internal
     */
    normalizeColorValue(value) {
        const { colorClasses } = this;

        if (value && colorClasses && !value.startsWith(Colors.prefix) &&
            (colorClasses.includes(value) || colorClasses.some(c => c && c.color === value))
        ) {
            value = `${Colors.prefix}${value}`;
        }

        return value;
    }

    updateColumns(columns) {
        this.style = columns ? `grid-template-columns:repeat(${columns}, 1fr);` : '';
    }

    getColorClassName(color) {
        const name = this.colorClasses && color ? Colors.stripPrefix(color) : color;

        if (this.colorClasses?.includes(name) || this.colorClasses?.find(r => r && r.color === name)) {
            return this.colorClassPrefix + name;
        }
        return color ? '' : 'b-no-color';
    }
}

ColorPicker.initClass();
