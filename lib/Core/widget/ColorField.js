import Combo from './Combo.js';
import DomHelper from '../helper/DomHelper.js';
import './ColorPicker.js';

DomHelper.loadStylesheet('Core/widget/ColorField.css');

// import Stylesheet from './ColorField.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ColorField');

/**
 * @module Core/widget/ColorField
 */

/**
 * A field that displays a CSS color swatch and lets the user select from a color palette using a
 * {@link Core.widget.ColorPicker} dropdown. Clicking the field (or pressing <kbd>ArrowDown</kbd>) opens the picker.
 * The selected color value is available via the inherited {@link #config-value} config. This widget is fully
 * keyboard-navigable and can be used as a cell {@link Grid.column.Column#config-editor} in a Grid.
 *
 * ```javascript
 * // Using the default predefined colors (b-red, b-blue, etc.)
 * const colorField = new ColorField({
 *     label    : 'Pick a color',
 *     appendTo : document.body
 * });
 *
 * console.log(colorField.value);  // e.g., 'b-red' after selection
 * ```
 *
 * ## Color Modes
 *
 * The ColorField supports two ways of configuring colors (see {@link Core.widget.ColorPicker} for details):
 *
 * ### 1. Default Predefined Colors
 *
 * When no `colors` config is provided, the field defaults to Bryntum's predefined named palette (
 * {@link Core.Base#typedef-Color default colors}). Colors emit the canonical `b-` prefixed form:
 *
 * {@inlineexample Core/widget/ColorField.js}
 *
 * ### 2. List of colors
 *
 * Provide an array of CSS colors or descriptor objects:
 *
 * {@inlineexample Core/widget/ColorFieldConfigured.js}
 *
 * ## Useful configs and properties
 *
 * | Config                            | Description                                             |
 * |-----------------------------------|---------------------------------------------------------|
 * | {@link #config-colors}            | Array of CSS color strings or `{ color, text }` objects |
 * | {@link #config-label}             | Label text displayed beside the field                   |
 * | {@link #config-value}             | The currently selected color value                      |
 *
 * ## See also
 *
 * - {@link Core.widget.ColorPicker} - The standalone color palette widget used as this field's picker
 * - {@link Core.widget.Field} - Base field class with label and validation support
 *
 * @extends Core/widget/Combo
 * @classtype colorfield
 * @inputfield
 */
export default class ColorField extends Combo {

    static $name = 'ColorField';

    static type = 'colorfield';

    static configurable = {

        /**
         * @hideconfigs text,color,editable,picker
         */

        displayField : 'text',
        valueField   : 'color',
        editable     : false,
        picker       : {
            type : 'colorpicker'
            // align : {
            //     align     : 't100-b100',
            //     matchSize : false
            // }
        },
        showBoxForNoColor : true,
        allowFiltering    : false,

        /**
         * Array of colors available in the picker dropdown. Can be a mix of:
         *
         * **String CSS colors** — hex, rgb, named CSS colors, etc.:
         * ```javascript
         * new ColorField({
         *     label  : 'Color',
         *     colors : ['#00FFFF', '#F0FFFF', '#89CFF0', '#0000FF', '#7393B3']
         * });
         * ```
         *
         * **Descriptor objects** — with `color` and `text` properties:
         * ```javascript
         * new ColorField({
         *     label  : 'Color',
         *     colors : [
         *         { color : '#FF0000', text : 'Red' },
         *         { color : '#00FF00', text : 'Green' },
         *         { color : '#0000FF', text : 'Blue' }
         *     ]
         * });
         * ```
         *
         * When not configured, the field defaults to the predefined named colors (see {@link Core.Base#typedef-Color} color type
         * definition), rendered via CSS theme classes and emitting the canonical `b-` form (e.g., `b-red`, `b-blue`).
         * See {@link Core.widget.ColorPicker#config-colors} for complete details, or
         * {@link Core/guides/upgrades/8.0.0#ColorField-API-update} for migration information.
         * @prp {Array<String|ColorDescriptor>}
         */
        colors : null,

        /**
         * Adds an option in the picker to set no background color
         * @prp {Boolean}
         */
        addNoColorItem : true,

        transition : {
            clear : false
        }
    };

    configure(config) {
        const pickerCfg = config.picker ?? {};

        if (config.colors) {
            pickerCfg.colors = config.colors;
        }

        if ('addNoColorItem' in config) {
            pickerCfg.addNoColorItem = config.addNoColorItem;
        }

        config.picker = pickerCfg;

        super.configure(config);
    }

    updatePicker(picker, was) {
        super.updatePicker(picker, was);

        if (picker) {
            this.items = picker.store.records;
        }
    }

    updateColors(colors) {
        if (!this.isConfiguring) {
            this.picker.colors = colors;
        }
    }

    updateAddNoColorItem(addNoColorItem) {
        if (!this.isConfiguring) {
            this.picker.addNoColorItem = addNoColorItem;
        }
    }

    set value(value) {
        const me = this;

        if (!me.store) {
            me.items = [];
            me.store = me.picker.store;
        }

        // Normalize legacy un-prefixed predefined color names (e.g. `red`) to their canonical `b-` form (e.g. `b-red`)
        // so they match the picker's records. Custom CSS colors and hex pickers are unaffected.
        if (typeof value === 'string') {
            value = me.picker?.normalizeColorValue?.(value) ?? value;
        }

        if (!value) {
            value = me.store.findRecord('color', null);
        }

        super.value = value;
    }

    showPicker(...args) {
        // Not happy about this. Previously selected value doesn't trigger refresh
        this.picker.refresh();
        super.showPicker(...args);
    }

    get value() {
        return super.value;
    }

    syncInputFieldValue(...args) {
        const
            me        = this,
            { value } = me;

        let className = me.picker?.getColorClassName(value) ?? '';

        if (!className) {
            me.colorBox.style.color = value;
        }

        className = 'b-color-box ' + className;

        me.colorBox.className = className.trim();

        if (!me.showBoxForNoColor) {
            me.toggleCls('b-colorless', !value);
        }

        super.syncInputFieldValue(...args);
    }

    // Hide clear trigger if "No color" is picked
    syncEmpty() {
        super.syncEmpty();

        if (this.element && this.valueCollection.first?.id === null) {
            this.triggers?.clear?.hide();
        }
    }

    async clear(event) {
        if (this.picker.addNoColorItem) {
            this.value = null;
        }
        else {
            return super.clear(event);
        }
    }

    get innerElements() {
        return [
            {
                reference : 'colorBox',
                className : 'b-color-box'
            },
            ...super.innerElements
        ];
    }

    get nonEditableClickTarget() {
        if (this.hideTrigger) {
            return this.element.firstChild;
        }
        return super.nonEditableClickTarget;
    }
}

// Register this widget type with its Factory
ColorField.initClass();
