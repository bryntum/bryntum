import Base from '../../Base.js';
import DomHelper from '../../helper/DomHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import GlobalEvents from '../../GlobalEvents.js';

/**
 * @module Core/widget/mixin/Labelable
 */

/**
 * This mixin provides label functionality to {@link Core.widget.Field} and {@link Core.widget.FieldSet}.
 *
 * Not to be used directly.
 *
 * @mixin
 */
export default Target => class Labelable extends (Target || Base) {
    //region Config

    static $name = 'Labelable';

    static configurable = {
        /**
         * Get/set fields label. Please note that the Field needs to have a label specified from start for this to
         * work, otherwise no element is created.
         * @member {String} label
         * @category Misc
         */

        /**
         * Label, prepended to field
         * @config {String}
         * @category Label
         */
        label : null,

        /**
         * Label position, either 'before' the field or 'above' the field
         *
         * Leaving it out, or specifying `null`, lets the theme decide on label placement.
         *
         * @config {'before'|'above'|null}
         * @default
         * @category Label
         */
        labelPosition : null,

        /**
         * CSS class name or class names to add to any configured {@link #config-label}
         * @config {String|Object}
         * @category Label
         */
        labelCls : null,

        /**
         * The width to apply to the `<label>` element. If a number is specified, `px` will be used.
         * @config {String|Number}
         * @category Label
         */
        labelWidth : {
            value   : null,
            $config : {
                localeKey : 'L{labelWidth}'
            }
        },

        // Used by CellEdit, to not add b-has-label class (which affects padding in material)
        preventLabelCls : null
    };

    construct(...args) {
        super.construct(...args);

        GlobalEvents.ion({
            theme   : 'processBackground',
            thisObj : this
        });

        this.processBackground();
    }

    get hasLabel() {
        return Boolean(this.label);
    }

    compose() {
        const { hasLabel, labelPosition, preventLabelCls } = this;

        return {
            class : {
                [`b-label-${labelPosition}`] : hasLabel && labelPosition,
                'b-has-label'                : hasLabel && !preventLabelCls
            }
        };
    }

    changeLabel(label) {
        return label || '';
    }

    setupLabel(lbl) {
        const
            { labelWidth } = this,
            domConfig      = ObjectHelper.merge({
                tag   : 'label',
                for   : `${this.id}-input`,
                class : {
                    'b-label'                           : 1,
                    [`b-align-${lbl.align || 'start'}`] : 1,
                    'b-has-label-width'                 : Boolean(labelWidth)
                }
            }, lbl);

        if (labelWidth) {
            // width & minWidth, to ensure it doesn't shrink or grow with content in a grid layout
            domConfig.style = `--b-label-width: ${DomHelper.setLength(labelWidth)}`;
        }

        return domConfig;
    }

    // <remove-on-release>
    // updateLabel(label) {
    //     // since value is used in template it is not certain that element is available
    //     // TODO: move the code from template here instead
    //     if (this.labelElement) {
    //         // using innerHTML since we sometimes use icons as label
    //         this.labelElement.innerHTML = label;
    //     }
    // }
    // </remove-on-release>

    updateLabelWidth(labelWidth) {
        const { labelElement } = this;
        if (labelElement) {
            labelElement.style.setProperty('--b-label-width', DomHelper.setLength(labelWidth));
            labelElement.classList.toggle('b-has-label-width', Boolean(labelWidth));
        }
    }

    processBackground() {
        if (DomHelper.getThemeInfo(this.rootElementEarly)?.overlapLabel) {
            this.whenVisible('extractBackgroundColor');
        }
    }

    async extractBackgroundColor() {
        if (this.rendition === 'outlined') {
            const { element } = this;

            let backgroundColor, parent = element.parentElement;

            element.style.removeProperty('--b-parent-background-color');

            do {
                // Background might be transitioned in theme change, wait for that to finish
                await Promise.allSettled(DomHelper.getAnimations(parent).flatMap(a => a.effect.getTiming().iterations !== Infinity ? a.finished : []));

                backgroundColor = globalThis.getComputedStyle(parent).backgroundColor;
                parent = parent.parentElement;
            } while (backgroundColor === 'rgba(0, 0, 0, 0)' && parent?.parentElement);

            element.style.setProperty('--b-parent-background-color', backgroundColor);
        }
    }

    //endregion

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
