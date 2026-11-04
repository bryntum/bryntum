import Container from './Container.js';
import Rotatable from './mixin/Rotatable.js';
import Labelable from './mixin/Labelable.js';
import DomHelper from '../helper/DomHelper.js';
import GlobalEvents from '../GlobalEvents.js';

import { autoRendition } from './Button.js';
import Validatable from './mixin/Validatable.js';

DomHelper.loadStylesheet('Core/widget/ButtonGroup.css');

// import Stylesheet from './ButtonGroup.css' with { type : 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ButtonGroup');

/**
 * @module Core/widget/ButtonGroup
 */

const
    toggleOrderFn = ({ $toggleOrder : a }, { $toggleOrder : b }) => (b || 0) - (a || 0),
    buttonListeners = {
        click        : 'resetValueCache',
        beforeToggle : 'onItemBeforeToggle',
        toggle       : 'onItemToggle'
    };

/**
 * A specialized container that holds {@link Core.widget.Button buttons}, displaying them in a tightly joined
 * horizontal group with shared borders. Only Button widgets are allowed as children — adding other widget types
 * will throw an exception. Use {@link #config-toggleGroup} or {@link #config-toggleable} to turn the group into
 * a toggle bar where one or more buttons can be pressed at a time. The visual style of all buttons can be set
 * uniformly with the {@link #config-rendition} config.
 *
 * {@inlineexample Core/widget/ButtonGroup.js}
 *
 * ```javascript
 * new ButtonGroup({
 *     toggleGroup : true,
 *     items       : [
 *         { icon : 'fa fa-align-left',    pressed : true },
 *         { icon : 'fa fa-align-center' },
 *         { icon : 'fa fa-align-right' }
 *     ]
 * });
 * ```
 *
 * ## Useful configs, properties, and events
 *
 * | Config / Event              | Description                                                       |
 * |-----------------------------|-------------------------------------------------------------------|
 * | {@link #config-items}       | Array of button configs or Button instances                       |
 * | {@link #config-color}       | Default color applied to all contained buttons                    |
 * | {@link #config-toggleGroup} | Enable toggle-group behavior for all buttons                      |
 * | {@link #config-toggleable}  | Min/max range of simultaneously pressed buttons                   |
 * | {@link #config-rendition}   | Visual style: `'filled'`, `'outlined'`, `'tonal'`, `'text'`, etc. |
 * | {@link #event-click}        | Fired when a button in the group is clicked                       |
 * | {@link #event-toggle}       | Fired when a button's pressed state changes                       |
 *
 * ## See also
 *
 * - {@link Core.widget.Button} - Individual button widget
 * - {@link Core.widget.Toolbar} - A more general container for buttons and other widgets
 *
 * A ButtonGroup may also be configured with a {@link #config-label} (along with other label configs such as
 * {@link #config-labelPosition} and {@link #config-labelWidth}), which renders a `<label>` element next to or above the
 * buttons, the same way a {@link Core.widget.Field field} does.
 *
 * @extends Core/widget/Container
 * @mixes Core/widget/mixin/Labelable
 * @classtype buttonGroup
 * @widget
 */
export default class ButtonGroup extends Container.mixin(Rotatable, Validatable, Labelable) {
    static $name = 'ButtonGroup';
    static type = 'buttongroup';

    /**
     * Fires when a button in the group is clicked
     * @event click
     * @param {Core.widget.Button} source Clicked button
     * @param {Event} event DOM event
     */

    /**
     * Fires when the default action is performed on a button in the group (the button is clicked)
     * @event action
     * @param {Core.widget.Button} source Clicked button
     * @param {Event} event DOM event
     */

    /**
     * Fires when a button in the group is toggled (the {@link Core.widget.Button#property-pressed} state is changed).
     * If you need to process the pressed button only, consider using {@link #event-click} event or {@link #event-action} event.
     * @event toggle
     * @param {Core.widget.Button} source Toggled button
     * @param {Boolean} pressed New pressed state
     * @param {Event} event DOM event
     */

    static configurable = {
        defaultType : 'button',

        localizableProperties : ['label'],

        /**
         * Custom CSS class to add to element.
         *
         * ```
         * new ButtonGroup({
         *   cls : 'custom-css-class,
         *   items : [
         *       { icon : 'fa fa-unicorn', cls : 'button-cls-class' },
         *       ...
         *   ]
         * });
         * ```
         *
         * @config {String}
         * @category CSS
         */
        cls : null,

        /**
         * An array of Buttons or typed Button config objects.
         * @config {ButtonConfig[]|Core.widget.Button[]}
         */
        items : null,

        /**
         * Default color to apply to all contained buttons, see {@link Core.widget.Button#config-color Button#color}.
         * Individual buttons can override the default.
         * @config {String}
         */
        color : null,

        /**
         * If you use gaps between your buttons, set this to `true` (controls whether to use border-radius for the
         * button elements)
         * @config {Boolean}
         * @default
         */
        useGap : false,

        /**
         * Set to `true` to turn the ButtonGroup into a toggle group, assigning a generated value to each contained
         * buttons {@link Core.widget.Button#config-toggleGroup toggleGroup config}. Individual buttons can
         * override the default.
         * @config {Boolean}
         */
        toggleGroup : null,

        /**
         * The separator used when joining the values of the pressed buttons into the group's
         * {@link #property-value}.
         * @config {String}
         * @default
         */
        valueSeparator : ',',

        columns : null,

        hideWhenEmpty : true,

        defaultBindProperty : 'value',

        errorTooltipCachePath : 'buttonGroupErrorTooltip',

        errorTooltipConfig : {
            forSelector : '.b-button-group.b-invalid'
        },

        overflowable : true,

        /**
         * A two-element array containing the minimum and maximum number of toggleable buttons. If a single number is
         * specified, it is converted to an array using that given value as the maximum and 1 is used as the minimum.
         * If `true` is specified, it is equivalent to `[0, Infinity]`, allowing any buttons to be toggled independently
         * or all buttons to be untoggled.
         *
         * A value of `null` (the default) is similar to `toggleable : 1` unless {@link #config-toggleGroup} is set,
         * or individual buttons are configured with their own {@link Core.widget.Button#config-toggleable} or
         * {@link Core.widget.Button#config-toggleGroup} values. If this config is used, `toggleable` and `toggleGroup`
         * should not be assigned to individual buttons.
         *
         * @prp {Number[]}
         * @accepts {Boolean|Number}
         */
        toggleable : null,

        /**
         * Predefined style to use for the buttons. Possible values are:
         * * `'elevated'` - Raised buttons with box-shadow
         * * `'filled'` - Filled with the primary color
         * * `'tonal'` - Filled with a faded shade of the primary color
         * * `'outlined'` - Outlined with borders and pale or transparent fill
         * * `'text'` - Transparent text-only button
         * * `'padded'` - Adds a background to the ButtonGroup and padding around the buttons + neutral background for
         *   toggled buttons
         * * `'padded-filled'` - Same as 'padded', but uses a primary color shade for the background of toggled buttons
         *
         * The supplied value will be part of the button group's and each button's class list, as `b-button-{rendition}`.
         *
         * If not value is supplied, it will search upwards for one, falling back to using the first button's rendition.
         *
         * @prp {'elevated'|'filled'|'tonal'|'outlined'|'text'|'padded'|'padded-filled'|String} rendition
         */
        rendition : autoRendition,

        extractBackground : false,

        /**
         * The group's value, composed of the {@link Core.widget.Button#property-value values} of the currently
         * pressed buttons, joined by the {@link #config-valueSeparator}. Assigning a value presses the buttons
         * whose values match.
         * @accepts {String|String[]|Number[]}
         * @prp {String}
         * @category Common
         */
        value : null
    };

    afterConstruct() {
        super.afterConstruct();

        this.ion({
            change : 'internalOnChange'
        });
    }

    // ButtonGroup has no wrapper like field does
    // so return element instead since error tooltip uses field.inputWrap
    get inputWrap() {
        return this.element;
    }

    get isValid() {
        let result = super.isValid;

        const
            me = this,
            { toggleable } = me;

        me.clearError('L{Field.fieldRequired}', true);

        if (result && !me.disabled) {
            if ((me.required && !me.value) || (toggleable && me.pressed.length < toggleable[0])) {
                result = false;
                me.setError('L{Field.fieldRequired}', true);
            }
        }

        if (me.checkValidity && me.callback(me.checkValidity, me, [me]) === false) {
            result = false;
        }

        if (result && me.errors && Object.keys(me.errors).length) {
            result = false;
        }

        return result;
    }

    get pressed() {
        return this.items.filter(b => b.pressed).sort(toggleOrderFn);
    }

    internalOnChange() {
        this.syncInvalid();
    }

    onChildAdd(item) {
        super.onChildAdd(item);

        item.ion({
            thisObj : this,
            ...buttonListeners,

            // This needs to run before the 'click' event is relayed by this button group, in such listener
            // the `value` must already be updated
            prio : 10000
        });
    }

    onChildRemove(item) {
        item.un({
            thisObj : this,
            ...buttonListeners
        });

        super.onChildRemove(item);
    }

    onItemBeforeToggle({ pressed }) {
        const { toggleable } = this;

        return pressed || !toggleable || (this.pressed.length > toggleable[0]);
    }

    onItemToggle(event) {
        const
            me = this,
            toggleCount = (me.toggleCount || 0) + 1,
            { toggleable, _value } = me;

        me.resetValueCache();

        if (!me.isSettingValue && (!me.toggleGroup || event.pressed)) {
            if (toggleable) {
                event.source.$toggleOrder = toggleCount;
                me.toggleCount = toggleCount;

                me.isSettingValue = true;
                me.pressed.slice(toggleable[1]).forEach(b => b.pressed = false);
                me.isSettingValue = false;
            }

            // trigger change event only if the value has changed
            if (_value !== me.value) {
                me.triggerFieldChange({ value : me.value, userAction : true, event });
            }
        }
    }

    resetValueCache() {
        // reset cached value to revalidate next time it's requested
        this._value = null;
    }

    createWidget(widget) {
        const
            me   = this,
            type = me.constructor.resolveType(widget.type || 'button');

        if (type.isButton) {
            if (me.color && !widget.color) {
                widget.color = me.color;
            }

            // Allow non-toggleable buttons to coexist in the group
            if (widget.toggleable !== false) {
                if (!widget.toggleGroup && me.toggleGroup) {
                    widget.toggleGroup = me.toggleGroup;
                }

                if (me.toggleable) {
                    widget.toggleable = true;
                }
            }
        }

        if (me.columns) {
            widget.width = `${100 / me.columns}%`;
        }

        widget = super.createWidget(widget);

        me.relayEvents(widget, ['click', 'action', 'toggle']);

        return widget;
    }

    changeToggleable(toggleable) {
        if (toggleable === true) {
            toggleable = [0, Infinity];
        }
        else if (typeof toggleable === 'number') {
            toggleable = [1, toggleable];
        }

        return toggleable || null;
    }

    updateToggleable(toggleable) {
        if (toggleable && !this.isConstructing) {
            this.pressed.slice(toggleable[1]).forEach(b => b.pressed = false);
        }
    }

    changeToggleGroup(toggleGroup, was) {
        return toggleGroup === true ? was || ButtonGroup.generateId('toggleGroup') : toggleGroup;
    }

    updateRotate(rotate) {
        this.eachWidget(btn => {
            if (btn.rotate !== false) {
                btn.rotate = rotate;
            }
        });
    }

    get valueAsArray() {
        // Collect pressed item values
        return this.items.flatMap(w => w.pressed && w.value !== undefined ? w.value : []);
    }

    get value() {
        const me = this;

        // if we don't have cached value
        // let's calculate it based on item values
        if (!me._value) {
            // build a string
            me._value = me.valueAsArray.join(me.valueSeparator);
        }

        return me._value;
    }

    changeValue(value, oldValue) {
        const me = this;

        if (value == null) {
            value = [];
        }
        else if (typeof value == 'string') {
            value = value.split(me.valueSeparator);
        }
        else if (!Array.isArray(value)) {
            value = [value];
        }

        me.isSettingValue = true;

        // Reflect value on items
        me.items.forEach(w => {
            if (w.value !== undefined) {
                w.pressed = value.includes(w.value);
            }
        });

        me.isSettingValue = false;

        // Returning base on valueAsArray instead of on value ensures we get the visual order for the values correct
        return me.valueAsArray.join(me.valueSeparator);
    }

    updateValue(value) {
        if (!this.isConfiguring) {
            this.triggerFieldChange({ value, userAction : Boolean(this._isUserAction) });
        }
    }

    get validity() {
        return {};
    }

    onDisabled(disabled) {
        this.syncInvalid();

        // translate state to child buttons
        this.items.forEach(button => button.disabled = disabled || (!button.ignoreParentReadOnly && this.readOnly));
    }

    updateReadOnly(readOnly) {
        super.updateReadOnly(readOnly);

        this.updateDisabled(this.disabled);
    }

    addToOverflowMenu(menu, overrides, onCreateTwin) {
        const { toggleable, toggleGroup } = this;

        if (toggleGroup || (toggleable?.[0] === 1 && toggleable[1] === 1)) {
            overrides = {
                ...overrides,
                radio : true
            };
        }

        this.items.forEach(it => it.addToOverflowMenu(menu, overrides, onCreateTwin));
    }

    updateRendition(rendition) {
        if (rendition === autoRendition && !this.themeRenditionDetacher) {
            this.themeRenditionDetacher = GlobalEvents.ion({
                theme   : 'onThemeRenditionChange',
                thisObj : this
            });
        }
    }

    // Global `theme` event handler, recomposes to apply the theme's rendition
    onThemeRenditionChange({ mode }) {
        // A light/dark switch does not change the theme's button rendition
        if (!mode) {
            this.recompose();
        }
    }

    get useRendition() {
        return this.closest(w => w.rendition)?.rendition ?? this.items[0]?.rendition;
    }

    compose() {
        // rendition included for reactivity
        const
            me = this,
            { useRendition, columns, useGap, label, labelCls } = me;

        let applyRendition = useRendition?.button ?? useRendition;

        if (applyRendition === autoRendition) {
            applyRendition = DomHelper.getThemeInfo(me.rootElementEarly)?.buttonRendition;
        }

        // Labelable.compose() contributes the b-has-label / b-label-${labelPosition} classes; here we render the
        // <label> itself via setupLabel() (which strips the `for` attribute, see overridden setupLabel below).
        // The label is rendered before buttonGroupContent so it sits outside the border carried by the inner element.
        return {
            class : {
                [`b-button-group-${applyRendition}`] : applyRendition,
                'b-columned'                         : columns,
                'b-no-gap'                           : !useGap,
                'b-toggle-group'                     : me.toggleGroup
            },
            children : {
                labelElement : (label || null) && me.setupLabel({
                    html  : label,
                    class : {
                        [labelCls] : labelCls
                    }
                }),
                buttonGroupContent : {
                    class : {
                        'b-button-group-content' : 1
                    }
                }
            }
        };
    }

    // Buttons (Container children) render into the inner content wrapper, which carries the group's border/box.
    get contentElement() {
        return this.buttonGroupContent;
    }

    // A ButtonGroup has no single input element to associate the label with, so strip the `for` attribute that
    // Labelable#setupLabel would otherwise point at a non-existent `${id}-input` element (matches FieldSet).
    setupLabel(lbl) {
        const domConfig = super.setupLabel(lbl);

        delete domConfig.for;

        return domConfig;
    }
}

// Register this widget type with its Factory
ButtonGroup.initClass();
