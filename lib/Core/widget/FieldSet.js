import Panel from './Panel.js';
import Labelable from './mixin/Labelable.js';
import DomHelper from '../helper/DomHelper.js';

DomHelper.loadStylesheet('Core/widget/FieldSet.css');

// import Stylesheet from './FieldSet.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'FieldSet');

/**
 * @module Core/widget/FieldSet
 */

/**
 * A container that wraps an HTML `<fieldset>` element, providing a titled group for related form fields. It renders
 * a styled {@link Core.widget.Panel} with an optional {@link #config-title} displayed as a `<legend>`. Child
 * widgets are added via {@link #config-items} and can be laid out horizontally or vertically using
 * {@link #config-inline}. Supports collapsing via {@link #config-collapsible}.
 *
 * {@inlineexample Core/widget/FieldSet.js one-column}
 *
 * ```javascript
 * const fieldSet = new FieldSet({
 *     title : 'Contact Details',
 *     items : {
 *         name  : { type : 'textfield', label : 'Name' },
 *         email : { type : 'textfield', label : 'Email' }
 *     },
 *     appendTo : document.body
 * });
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config                      | Description                                      |
 * |-----------------------------|--------------------------------------------------|
 * | {@link #config-title}       | Legend text displayed at the top of the fieldset |
 * | {@link #config-items}       | Child widgets (typically form fields)            |
 * | {@link #config-inline}      | Horizontal layout (`true`) or vertical (`false`) |
 * | {@link #config-label}       | Optional label displayed beside the fieldset     |
 * | {@link #config-collapsible} | Allow collapsing/expanding the fieldset          |
 *
 * ## See also
 *
 * - {@link Core.widget.RadioGroup} - Fieldset variant for radio button groups
 * - {@link Core.widget.CheckboxGroup} - Fieldset variant for checkbox groups
 * - {@link Core.widget.Panel} - Base panel class
 *
 * @extends Core/widget/Panel
 * @mixes Core/widget/mixin/Labelable
 * @classtype fieldset
 * @widget
 */
export default class FieldSet extends Panel.mixin(Labelable) {
    //region Config
    static $name = 'FieldSet';

    static type = 'fieldset';

    static configurable = {
        bodyTag   : 'fieldset',
        focusable : false,

        localizableProperties : ['label'],

        /**
         * Setting this config to `true` assigns a horizontal box layout (`flex-flow: row`) to the items in this
         * container, while `false` assigns a vertical box layout (`flex-flow: column`).
         *
         * By default, this value is automatically determined based on the {@link #config-label} and
         * {@link #config-labelPosition} configs.
         * @prp {Boolean}
         */
        inline : null,

        inlineInternal : null
    };

    //endregion

    //region Composition

    afterConfigure() {
        super.afterConfigure();

        this.syncInlineInternal();
    }

    get bodyConfig() {
        const
            result                                       = super.bodyConfig,
            { className }                                = result,
            { inlineInternal : inline, hasLabel, title } = this;

        delete result.html;

        className['b-inline'] = inline;
        className['b-field-set-has-label'] = hasLabel;

        if (title) {
            result.children = {
                // We render the <legend> element for a11y (not 100% sure it is needed)
                legendElement : {
                    tag   : 'legend',
                    text  : title,
                    class : {
                        'b-field-set-legend' : 1
                    }
                }
            };
        }

        return result;
    }

    composeBody() {
        const result = super.composeBody();

        // Mostly for RadioGroup, to line up with fields
        result.class['b-field-inner'] = this.inline || this.parent?.labelPosition === 'align-before';

        return result;
    }

    compose() {
        const { label, labelCls, labelWidth, labelPosition } = this;

        return {
            class : {
                'b-field'                    : label,
                [`b-label-${labelPosition}`] : labelPosition,
                'b-vbox'                     : false
            },
            children : {
                'labelElement > headerElement' : (label || null) && {
                    tag   : 'label',
                    html  : label,
                    class : {
                        'b-label'       : 1,
                        'b-align-start' : 1,
                        [labelCls]      : labelCls
                    },
                    style : {
                        width : DomHelper.unitize('width', labelWidth)[1]
                    }
                }
            }
        };
    }

    //endregion

    syncInlineInternal() {
        const me = this;

        me.inlineInternal = me.inline ?? (me.label != null && me.labelPosition === 'before');

        me.layout = me.inlineInternal ? { type : 'box' } : { type : 'vbox' };
    }

    updateDisabled(value, was) {
        super.updateDisabled(value, was);

        // Needs {}'s to avoid a "return false" that ends iteration
        this.eachWidget(item => {
            item.disabled = value;
        }, /* deep = */false);
    }

    updateInline() {
        this.syncInlineInternal();
    }

    updateInlineInternal(inline) {
        this.layout.horizontal = inline;
    }

    updateLabel() {
        this.syncInlineInternal();
    }

    updateLabelPosition() {
        this.syncInlineInternal();
    }

    // updateTitle(title) {
    //     if (title && !this.collapsible && !this.tools && !this.inline) {
    //         this.header = false;
    //     }
    // }
}

// Register this widget type with its Factory
FieldSet.initClass();
