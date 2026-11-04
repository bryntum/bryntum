import Widget from './Widget.js';
import Tooltip from './Tooltip.js';
import ArrayHelper from '../helper/ArrayHelper.js';
import DomHelper from '../helper/DomHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import Labelable from './mixin/Labelable.js';

DomHelper.loadStylesheet('Core/widget/Slider.css');

// import Stylesheet from './Slider.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Slider');

/**
 * @module Core/widget/Slider
 */

const
    arrowKeys       = {
        ArrowUp    : 1,
        ArrowDown  : 1,
        ArrowLeft  : 1,
        ArrowRight : 1
    },
    // A config object tooltip is merged into these by the config system, a string tooltip is not
    tooltipDefaults = {
        type      : 'tooltip',
        align     : 'b-t',
        axisLock  : true,
        autoClose : false,
        autoHide  : false
    };

/**
 * A range slider widget wrapping the native `<input type="range">`. It lets users select a numeric value by
 * dragging a thumb along a track. Configure the range with {@link #config-min}, {@link #config-max}, and
 * {@link #config-step}. The current value can be displayed in the label, the thumb, or in a tooltip. Optional
 * step markers can be shown along the track using {@link #config-showSteps}.
 *
 * {@inlineexample Core/widget/Slider.js}
 *
 * ```javascript
 * const slider = new Slider({
 *     text      : 'Opacity',
 *     min       : 0,
 *     max       : 100,
 *     step      : 10,
 *     value     : 50,
 *     showValue : true,
 *     appendTo  : document.body
 * });
 *
 * // Listen for value changes
 * slider.on('input', ({ value }) => {
 *     console.log('New value:', value);
 * });
 * ```
 *
 * {@inlineexample Core/widget/SliderOptions.js vertical}
 *
 * ## Useful configs, properties, and events
 *
 * | Config / Event              | Description                                                |
 * |-----------------------------|------------------------------------------------------------|
 * | {@link #config-min}         | Minimum value (default 0)                                  |
 * | {@link #config-max}         | Maximum value (default 100)                                |
 * | {@link #config-step}        | Step increment between values                              |
 * | {@link #config-value}       | Current slider value                                       |
 * | {@link #config-text}        | Label text; appends current value if `showValue` is `true` |
 * | {@link #config-showValue}   | Show value in label (`true`) or in the thumb (`'thumb'`)   |
 * | {@link #config-showTooltip} | Show the current value in a tooltip on hover/drag          |
 * | {@link #config-showSteps}   | Show tick marks at each step interval                      |
 * | {@link #event-input}        | Fired on each value change as the thumb is dragged         |
 * | {@link #event-change}       | Fired when the value changes after the thumb is released   |
 *
 * ## See also
 *
 * - {@link Core.widget.NumberField} - A numeric input field for typed values
 * - {@link Core.widget.Widget} - Base class for all widgets
 *
 * @extends Core/widget/Widget
 * @mixes Core/widget/mixin/Labelable
 * @classtype slider
 * @widget
 */
export default class Slider extends Widget.mixin(Labelable) {
    //region Config

    static $name = 'Slider';

    static type = 'slider';

    static configurable = {

        /**
         * Get input element.
         * @readonly
         * @member {HTMLInputElement} input
         */

        /**
         * Text for the sliders internal label. Appends value if `showValue` is `true`
         * @prp {String}
         */
        text : null,

        /**
         * Show value in internal label (specify `true`), or in the thumb (specify 'thumb').
         * @config {Boolean|'thumb'}
         * @default
         */
        showValue : true,

        /**
         * Show the slider value in a tooltip
         * @config {Boolean}
         * @default false
         */
        showTooltip : null,

        /**
         * Show the step markers
         * @config {Boolean}
         * @default false
         */
        showSteps : null,

        /**
         * Minimum value
         * @prp {Number}
         * @default
         */
        min : 0,

        /**
         * Maximum value
         * @prp {Number}
         * @default
         */
        max : 100,

        /**
         * Step size
         * @prp {Number}
         * @default
         */
        step : 1,

        /**
         * Initial value.
         * `String` value allows linking value by reference name.
         *
         * Example:
         * ```javascript
         * new Slider({
         *     text      : 'Tick height',
         *     value     : 100,
         * }
         *
         * new Slider({
         *     text      : 'Tick height',
         *     value     : 'up.tickSize',
         * }
         * ```
         *
         * @prp {Number}
         * @accepts {Number|String}
         */
        value : 50,

        /**
         * Width of the value label when `showValue` is enabled. If a number is specified, `px` will be used.
         *
         * When not specified, the width will be calculated based on the longest possible value string.
         *
         * @prp {String|Number}
         */
        valueLabelWidth : null,

        /**
         * Unit to display next to the value, when configured with `showValue : true`
         * @prp {String}
         * @default
         */
        unit : null,

        /**
         * A function that returns custom tooltip content for the slider.
         * Receives an object with `value`, `unit`, and `slider` properties.
         * When provided, replaces the default tooltip text.
         *
         * ```javascript
         * new Slider({
         *     showTooltip : true,
         *     tipRenderer({ value, unit }) {
         *         return `Threshold is ${value}${unit}`;
         *     }
         * });
         * ```
         *
         * @prp {Function}
         * @param {Object} data
         * @param {Number} data.value Current slider value
         * @param {String} data.unit The configured unit string
         * @param {Core.widget.Slider} data.slider The slider instance
         * @returns {String}
         */
        tipRenderer : null,

        /**
         * A config object for the tooltip to show while hovering the slider, or a string to show as its text instead
         * of the value. Requires {@link #config-showTooltip}.
         * @config {String|TooltipConfig}
         */
        tooltip : {
            $config : ['lazy', 'nullify'],
            value   : tooltipDefaults
        },

        localizableProperties : ['text', 'label'],

        /**
         * By default, the {@link #event-change} event is fired when a change gesture is completed, ie: on
         * the mouse up gesture of a drag.
         *
         * Configure this as `true` to fire the {@link #event-change} event as the value changes *during* a drag.
         * @prp {Boolean}
         */
        triggerChangeOnInput : null,

        /**
         * Icon to show in the thumb. By default, no icon is shown.
         * @prp {String}
         */
        thumbIcon : null,

        defaultBindProperty : 'value',

        twinSyncConfigs : ['max', 'min', 'step', 'value']
    };

    //endregion

    //region Init

    compose() {
        const
            { id, min, max, showValue, showSteps, step, text, unit = '', disabled, readOnly, label, labelCls, inputWidth, valueLabelWidth, thumbIcon } = this,
            inputId = `${id}-input`,
            // Step 0.01 has 4 chars (while max might be 1)
            stepLength = step < 1 ? String(step).length : 0,
            maxValueLength = max ? ((Math.ceil(max / 1000) + 2)) : 0,
            longestString =
                Math.max(maxValueLength, stepLength) +
                (showValue && showValue !== 'thumb' ? (text ? text.length + 1 : 0) + unit?.length || 0 : 0) + 1;

        let { value } = this;

        if (isNaN(value)) {
            value = '';
        }

        // Step 0.1, value 0.200004 -> 0.2
        const formattedValue = step < 1 ? value.toFixed(stepLength - 2) : value;

        return {
            class : {
                'b-show-value'  : showValue && showValue !== 'thumb',
                'b-text'        : text,
                'b-disabled'    : disabled,
                'b-thumb-value' : showValue === 'thumb'
            },

            style : {
                '--bi-slider-value' : value,
                '--bi-slider-min'   : min,
                '--bi-slider-max'   : max
            },

            children : {
                labelElement : label && this.setupLabel({
                    class : {
                        [labelCls] : labelCls
                    },
                    html : label
                }),

                inputWrap : {
                    class     : 'b-field-inner',
                    reference : 'inputWrap',
                    style     : {
                        width : DomHelper.setLength(inputWidth)
                    },
                    children : {
                        input : {
                            tag                          : 'input',
                            type                         : 'range',
                            id                           : inputId,
                            reference                    : 'input',
                            [disabled ? 'disabled' : ''] : disabled,
                            [readOnly ? 'readOnly' : ''] : readOnly,

                            min,
                            max,
                            step,
                            value,
                            // eslint-disable-next-line bryntum/no-listeners-in-lib
                            listeners : {
                                input      : 'onInternalInput',
                                change     : 'onInternalChange',
                                mouseenter : 'onInternalMouseOver',
                                mouseleave : 'onInternalMouseOut'
                            }
                        },

                        track : {
                            class    : 'b-slider-track',
                            children : {
                                progress : {
                                    class : 'b-slider-progress'
                                },
                                thumb : {
                                    class    : 'b-slider-thumb',
                                    children : {
                                        icon : thumbIcon && {
                                            tag   : 'i',
                                            class : `b-slider-thumb-icon ${thumbIcon}`
                                        }
                                    }
                                },
                                steps : showSteps ? {
                                    class    : 'b-slider-steps',
                                    // 0-100 with step 20, we want lines at 20, 40, 60, 80 - but we also include 0 and 100 to
                                    // allow spacing them using flex
                                    children : ArrayHelper.populate(((max - min) / step) - 1, i => ({
                                        class : {
                                            'b-slider-step' : 1,
                                            'b-less'        : min + i * step < value
                                        },
                                        dataset : {
                                            index : i,
                                            value : min + i * step
                                        }
                                    }), true)
                                } : null
                            }
                        },

                        internalLabel : (showValue === true || text) && {
                            tag   : 'label',
                            class : 'b-slider-internal-label',
                            for   : inputId,
                            text  : showValue === true ? (text ? `${text} ${formattedValue}${unit}` : formattedValue + unit) : text,
                            style : {
                                minWidth : valueLabelWidth ? 0 : longestString + 'ch',
                                width    : DomHelper.setLength(valueLabelWidth)
                            }
                        }
                    }
                }
            }
        };
    }

    afterRecompose() {
        this.showTooltip && this.tooltip?.alignTo(this.thumb);
    }

    get focusElement() {
        return this.input;
    }

    //endregion

    //region Events

    /**
     * Fired while slider thumb is being dragged.
     * @event input
     * @param {Core.widget.Slider} source The slider
     * @param {Number} value The value
     */

    /**
     * Fired after the slider value changes (on mouse up following slider interaction).
     * @event change
     * @param {Number} value The value
     * @param {Boolean} userAction Triggered by user taking an action (`true`) or by setting a value (`false`)
     * @param {Core.widget.Slider} source The slider
     */

    /* break from doc comment */

    onInternalKeyDown(e) {
        // Contain arrow keys to be processed by the <input type="range">, do not allow them to bubble
        // up to by any owning container.
        if (!this.readOnly && arrowKeys[e.key]) {
            e.stopImmediatePropagation();
        }
    }

    onInternalChange() {
        this.triggerChange(true);
        this.trigger('action', { value : this.value });
    }

    onInternalInput() {
        const me = this;

        if (me.readOnly) {
            // Undo the change if we are readOnly.
            // readOnly input attribute will not work for non-text fields: https://github.com/w3c/html/issues/89
            me.input.value = me.value;
            return;
        }

        me.value = me.step < 1 ? parseFloat(me.input.value) : parseInt(me.input.value, 10);

        me.trigger('input', { value : me.value });
        me.triggerChangeOnInput && me.triggerChange(true);

        me.updateTooltipContent();
    }

    onInternalMouseOver() {
        this.tooltip?.showBy(this.thumb);
    }

    onInternalMouseOut() {
        this.tooltip?.hide();
    }

    triggerChange(userAction) {
        this.triggerFieldChange({
            value : this.value,
            valid : true,
            userAction
        });
    }

    //endregion

    //region Config Handling

    // max
    updateMax(max) {
        const me = this;

        if (me.input && me._value > max) {
            me.value = max;
            me.trigger('input', { value : me.value });
        }
    }

    // min
    updateMin(min) {
        const me = this;

        if (me.input && me._value < min) {
            me.value = min;
            me.trigger('input', { value : me.value });
        }
    }

    // tooltip
    changeTooltip(config, existingTooltip) {
        const
            me     = this,
            isText = Boolean(config) && typeof config === 'string';

        // A string is static text, kept when the value changes
        me._tooltipText = isText ? config : null;

        if (isText) {
            config = { ...tooltipDefaults, html : config, textContent : true };
        }

        if (config) {
            config.owner = me;
        }

        return me.showTooltip ? Tooltip.reconfigure(existingTooltip, config, {
            owner    : me,
            defaults : {
                forElement : me.input,
                html       : me.updateTooltipContent()
            }
        }) : null;
    }

    changeValue(value) {
        const
            me            = this,
            { min, step } = me;

        value = Math.min(Math.max(value, min), me.max);

        // Round the passed value so that it is in sync with our steps.
        // For example, if our min is 10, and our step is 3, then
        // passing 12 should get 13. Rounding the value directly to the closest
        // step would fail this requirement.
        if (value > min) {
            return min + ObjectHelper.roundTo(value - min, step);
        }
        return ObjectHelper.roundTo(value, step);
    }

    updateValue(value) {
        const
            me        = this,
            { input } = me;

        if (input && input.value !== String(value)) {
            input.value = value;

            me.updateTooltipContent();
            me.triggerChange(false);
        }
    }

    updateTipRenderer() {
        if (!this.isConfiguring) {
            this.updateTooltipContent();
        }
    }

    updateTooltipContent() {
        const
            me   = this,
            html = me.tipRenderer
                ? me.tipRenderer({ value : me.value, unit : me.unit ?? '', slider : me })
                : (me.text ? `${me.text} ` : '') + (me.step < 1 ? me.value.toFixed(2) : me.value) + (me.unit ?? '');

        if (me._tooltip && me._tooltipText == null) {
            me._tooltip.html = html;
        }

        return html;
    }

    //endregion
}

// Register this widget type with its Factory
Slider.initClass();
