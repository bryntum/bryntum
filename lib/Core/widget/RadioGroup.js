import DomHelper from '../helper/DomHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import FieldSet from './FieldSet.js';
import Widget from './Widget.js';

import './Radio.js';
import './layout/Box.js';
import BrowserHelper from '../helper/BrowserHelper.js';

DomHelper.loadStylesheet('Core/widget/RadioGroup.css');

// import Stylesheet from './RadioGroup.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'RadioGroup');

/**
 * @module Core/widget/RadioGroup
 */

/**
 * A container for a set of related {@link Core.widget.Radio} buttons, allowing the user to select exactly one option
 * from the group. Provide the choices via the convenient {@link #config-options} shorthand or as individual Radio
 * child items. The group's {@link #property-value} reflects the selected radio button's value and can be read from
 * a parent container's {@link #property-values}. Set {@link #config-clearable} to allow
 * unchecking the current selection.
 *
 * {@inlineexample Core/widget/RadioGroup.js one-column}
 *
 * ```javascript
 * new RadioGroup({
 *     title   : 'Resolve Conflict',
 *     name    : 'resolution',
 *     value   : 'A',
 *     options : {
 *         A : 'Keep the original version',
 *         B : 'Use the new version',
 *         C : 'Reconcile individual conflicts'
 *     }
 * });
 * ```
 *
 * {@inlineexample Core/widget/RadioGroup.js}
 *
 * ## Nested Items
 * Radio buttons can also have a {@link Core.widget.Radio#config-container} of additional
 * {@link #config-items}. These items can be displayed immediately following the field's label
 * (which is the default when there is only one item) or below the radio button. This can be controlled using the
 * {@link Core.widget.Radio#config-inline} config.
 *
 * In the demo below notice how additional fields are displayed for the checked radio button:
 *
 * {@inlineexample Core/widget/RadioGroupNested.js vertical}
 *
 * ## Useful configs and properties
 *
 * | Config / Property         | Description                                          |
 * |---------------------------|------------------------------------------------------|
 * | {@link #config-options}   | Object mapping values to display labels              |
 * | {@link #config-name}      | Name used when reading/writing container values      |
 * | {@link #config-clearable} | Allow unchecking the currently selected radio button |
 * | {@link #property-value}   | The value of the currently checked radio button      |
 *
 * ## See also
 *
 * - {@link Core.widget.Radio} - Individual radio button widget
 * - {@link Core.widget.CheckboxGroup} - Similar group widget for multiple-selection checkboxes
 * - {@link Core.widget.FieldSet} - Base fieldset container
 *
 * @extends Core/widget/FieldSet
 * @classtype radiogroup
 * @widget
 */
export default class RadioGroup extends FieldSet {
    //region Config

    static $name = 'RadioGroup';

    static type = 'radiogroup';

    /**
     * Fired before the checked radio button of this group is changed, return `false` to prevent the action.
     * @event beforeChange
     * @param {String} value This widget's new value, the
     * {@link Core.widget.Radio#config-checkedValue} of the radio button which is being checked.
     * @param {String|null} lastValue This widget's value prior to this change, or `null` when nothing was checked.
     * @param {Core.widget.Radio} item The radio button which is being checked.
     * @param {Boolean} userAction This will be `true` if the change was caused by user interaction as opposed to
     * programmatic setting.
     * @param {Core.widget.RadioGroup} source This widget
     * @preventable
     */

    /**
     * Fired when the checked radio button of this group is changed.
     * @event change
     * @param {String} value This widget's value, the
     * {@link Core.widget.Radio#config-checkedValue} of the checked radio button.
     * @param {String|null} lastValue This widget's value prior to this change, or `null` when nothing was checked.
     * @param {Core.widget.Radio} item The radio button which was checked.
     * @param {Boolean} userAction This will be `true` if the change was caused by user interaction as opposed to
     * programmatic setting.
     * @param {Core.widget.RadioGroup} source This widget
     */

    static configurable = {
        defaultType : 'radio',

        /**
         * Set this to `true` so that clicking the currently checked radio button will clear the check from all
         * radio buttons in the group.
         * @config {Boolean}
         * @default false
         */
        clearable : null,

        /**
         * The name by which this widget's {@link #property-value} is accessed using the parent container's
         * {@link #property-values}.
         *
         * It is used to set the {@link Core.widget.Radio#config-name} of the child {@link Core.widget.Radio radio buttons}.
         *
         * If not provided, it will be set to the `ref` or `id` of the widget.
         *
         * @config {String}
         */
        name : null,

        /**
         * The set of radio button options for this radio button group. This is a shorthand for defining these in
         * the {@link #config-items}. The keys of this object hold the radio button's
         * {@link Core.widget.Radio#config-checkedValue} while the object values are a string for the radio button's
         * {@link Core.widget.Radio#config-text} or a config object for that radio button.
         *
         * The {@link #property-value} of this radio button group will be one of the keys in this object or `null`
         * if no radio button is checked.
         *
         * For example, consider the following configuration:
         * ```javascript
         *  {
         *      type    : 'radiogroup',
         *      name    : 'resolution',
         *      value   : 'A',
         *      options : {
         *          A : 'Keep the original version',
         *          B : 'Use the new version',
         *          C : 'Reconcile individual conflicts'
         *      }
         *  }
         * ```
         *
         * The above is equivalent to this configuration below using {@link #config-items}:
         * ```javascript
         *  {
         *      type  : 'radiogroup',
         *      items : [{
         *          text         : 'Keep the original version',
         *          name         : 'resolution',
         *          ref          : 'resolution_A',
         *          checked      : true,
         *          checkedValue : 'A'
         *      }, {
         *          text         : 'Use the new version',
         *          name         : 'resolution',
         *          ref          : 'resolution_B',
         *          checkedValue : 'B'
         *      }, {
         *          text         : 'Reconcile individual conflicts',
         *          name         : 'resolution',
         *          ref          : 'resolution_C',
         *          checkedValue : 'C'
         *      }]
         *  }
         * ```
         * @config {Object<String,String|RadioConfig>} options
         */
        options : {
            value : null,

            $config : {
                merge : 'items'
            }
        },

        defaultBindProperty : 'value'
    };

    afterConstruct() {
        super.afterConstruct();

        // always has to have some name
        if (!this.name) {
            this.name = this.ref || this.id;
        }
    }

    triggerPaint(...args) {
        const
            me         = this,
            firstPaint = !me.isPainted,
            value      = me.__value;

        super.triggerPaint(...args);

        // Firefox loses the checked value of disconnected radio elements.
        // Reapply the value once the field makes it to the DOM.
        if (BrowserHelper.isFirefox && me.isVisible && firstPaint &&
            value !== undefined &&
            value !== me.value
        ) {
            // Clear the field value and set it again
            me.value = undefined;
            me.value = value;
        }
    }

    get existingOptions() {
        const { name } = this;

        return this.ensureItems().filter(c => c.name === name);
    }

    get refPrefix() {
        return `${this.name || this.ref || this.id}_`;
    }

    get selected() {
        return this.existingOptions.filter(c => c.input.checked)[0] || null;
    }

    /**
     * This property corresponds to the {@link Core.widget.Radio#config-checkedValue} of the currently
     * {@link Core.widget.Radio#property-checked} radio button.
     * @prp {String}
     * @ts-returns {String|String[]}  // Fix for value type in CheckboxGroup
     */
    get value() {
        const { selected } = this;

        return selected ? selected.checkedValue : null;
    }

    set value(v) {
        this.existingOptions.forEach(c => {
            c.isConfiguring = this.isConfiguring;
            c.checked = c.checkedValue === v;
            c.isConfiguring = false;
        });

        // in FireFox if the field is detached remember the provided value to reapply it later
        if (BrowserHelper.isFirefox && !this.isConnected) {
            this.__value = v;
        }
    }

    ensureItems() {
        this.getConfig('options');

        return super.ensureItems();
    }

    changeOptions(options, was) {
        if (!(options && was && ObjectHelper.isDeeplyEqual(was, options))) {
            return options;
        }
    }

    convertOption(key, option, existing) {
        const
            me       = this,
            { name } = me,
            ret      = {
                name,
                type         : me.defaultType,
                value        : me.peekConfig('value'),
                ref          : `${me.refPrefix}${key}`,
                disabled     : me.disabled,
                checkedValue : key
            };

        if (typeof option === 'string') {
            ret.text = option;
        }
        else {
            ObjectHelper.assign(ret, option);
        }

        return existing ? Widget.reconfigure(existing, ret) : ret;
    }

    isOurRadio(item) {
        // Radio groups could be nested using field containers, so we need isRadio and name equality check:
        return (item.isRadio || item.isCheckbox) && item.name === this.name;
    }

    isolateFieldChange(field) {
        // if this is one of our radio buttons, swallow the field change:
        return this.isOurRadio(field);
    }

    onChildAdd(item) {
        super.onChildAdd(item);

        if (this.isOurRadio(item)) {
            item.ion({
                name         : item.id,
                beforeChange : 'onItemBeforeChange',
                change       : 'onItemChange',
                click        : 'onItemClick',
                thisObj      : this
            });
        }
    }

    onChildRemove(item) {
        if (this.isOurRadio(item)) {
            this.detachListeners(item.id);
        }

        super.onChildRemove(item);
    }

    onItemClick(ev) {
        const { source } = ev;

        if (source.checked && this.clearable && source.clearable == null) {
            source.checked = false;
        }
    }

    onItemBeforeChange(ev) {
        if (ev.checked) {
            const
                me            = this,
                { lastValue } = me;

            if (!me.reverting && me.trigger('beforeChange', me.wrapRadioEvent(ev)) === false) {
                if (lastValue != null && lastValue !== me.value) {
                    me.reverting = true;

                    ev.source.uncheckToggleGroupMembers();
                    me.value = lastValue;
                    me.lastValue = lastValue;

                    me.reverting = false;
                }

                return false;
            }
        }
    }

    onItemChange(ev) {
        const me = this;

        if (ev.checked && !me.reverting) {
            me.triggerFieldChange(me.wrapRadioEvent(ev));
            me.lastValue = me.value;
        }
    }

    wrapRadioEvent(ev) {
        return {
            from       : ev,
            item       : ev.source,
            userAction : ev.userAction,
            lastValue  : this.lastValue ?? null,
            value      : this.value
        };
    }

    updateName() {
        const { name } = this;
        // all child checkboxes must have the same name
        this.ensureItems().forEach(item => {
            if (item.isRadio || item.isCheckbox) {
                item.name = name;
            }
        });
    }

    updateOptions() {
        const
            me                     = this,
            { options, refPrefix } = me,
            existingOptions        = me.existingOptions.reduce((m, c) => {
                m[c.ref.substring(refPrefix.length)] = c;
                return m;
            }, {});

        let index = 0,
            key, option;

        if (options) {
            for (key in options) {
                option = me.convertOption(key, options[key], existingOptions[key]);

                delete existingOptions[key];
                me.insert(option, index++);
            }
        }

        const existing = Object.values(existingOptions);

        if (existing?.length) {
            me.remove(existing);
            existing.forEach(c => c.destroy());
        }
    }
}

// Register this widget type with its Factory
RadioGroup.initClass();
