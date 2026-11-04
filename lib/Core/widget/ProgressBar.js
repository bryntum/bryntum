import Widget from './Widget.js';
import DomHelper from '../helper/DomHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';

DomHelper.loadStylesheet('Core/widget/ProgressBar.css');

// A value that computes to a blank accessible name names nothing. Matches `Boolean(message.trim())` in
// Mask#compose so the two widgets cannot diverge on what counts as a name.
const isBlank = value => !(typeof value === 'string' ? value.trim() : value);

/**
 * @module Core/widget/ProgressBar
 */

/**
 * A horizontal progress bar widget for visualizing completion or loading state. It displays a colored bar whose width
 * represents the current {@link #config-value}, with optional {@link #config-label} text on the left and a
 * {@link #config-valueText} on the right. The value can be specified as a fraction (0–1) or as an absolute number when
 * a {@link #config-max} is provided. Customize the appearance with the {@link #config-color} config and the displayed
 * text with a {@link #config-valueRenderer}.
 *
 * {@inlineexample Core/widget/ProgressBar.js one-column}
 *
 * ```javascript
 * const progressBar = new ProgressBar({
 *     label    : 'Upload',
 *     value    : 0,
 *     max      : 100,
 *     color    : 'b-green',
 *     appendTo : document.body
 * });
 *
 * // Update progress
 * progressBar.value = 45;
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config                        | Description                                                                |
 * |-------------------------------|----------------------------------------------------------------------------|
 * | {@link #config-value}         | Current progress value (0–1 fractional, or absolute when `max` is set)     |
 * | {@link #config-max}           | Maximum value; when set, `value` is treated as absolute                    |
 * | {@link #config-label}         | Text label displayed at the top left                                       |
 * | {@link #config-valueText}     | Text displayed at the top right (auto-generated as "value/max" if omitted) |
 * | {@link #config-valueRenderer} | Custom function to format the displayed value text                         |
 * | {@link #config-color}         | Bar color CSS class (e.g. `'b-green'`, `'b-orange'`)                       |
 *
 * ## Accessibility
 *
 * The widget exposes the WAI-ARIA `progressbar` role, publishing `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and
 * `aria-valuetext`. The role makes all descendants presentational, so the visible {@link #config-label} and value text
 * are not exposed to assistive technology - the displayed text is carried by `aria-valuetext` instead.
 *
 * A progress bar has no accessible name of its own, and an unnamed `progressbar` fails WCAG 4.1.2, so **the role
 * and its `aria-value*` attributes are only published once the bar has a name**, so supplying one is required
 * rather than merely recommended. It is resolved in this order:
 *
 * 1. {@link Core.widget.Widget#config-ariaLabel} - when non-empty, becomes `aria-label` and suppresses the link below
 * 2. {@link #config-label} - otherwise exposed using `aria-labelledby`
 * 3. {@link Core.widget.Widget#config-tooltip} - `Widget` falls back to the tooltip text when no `ariaLabel` is set
 *
 * A blank or whitespace-only value does not name the bar, since its accessible name would still compute to empty.
 *
 * `aria-valuetext` is likewise withheld when the displayed value text is blank, because assistive technology
 * announces it *instead of* the numeric value - a whitespace-only {@link #config-valueText} or
 * {@link #config-valueRenderer} result would otherwise silence the progress reading altogether.
 *
 * ## See also
 *
 * - {@link Core.widget.Mask} - An alternative way to show progress with a loading mask overlay
 *
 * @extends Core/widget/Widget
 * @classtype progressbar
 * @widget
 */
export default class ProgressBar extends Widget {
    static $name = 'ProgressBar';

    static type = 'progressbar';

    static configurable = {
        // compose() reads this and writes the `role` attribute itself, since the role is withheld when the bar
        // has no accessible name. Also the declared role for Widget#ownersRole.
        role : 'progressbar',

        /**
         * The label text to display at the top left. Also supplies the widget's accessible name (using
         * `aria-labelledby`) unless {@link Core.widget.Widget#config-ariaLabel} is configured. A whitespace-only
         * label does not name the bar - see the Accessibility section above.
         * @prp {String}
         */
        label : '',

        /**
         * The value text to display at the top right
         * If not specified and max is provided, will auto-generate as "value/max"
         * @prp {String}
         */
        valueText : null,

        /**
         * Progress value. If max is specified, this is an absolute value (e.g., 8 out of 10).
         * If max is not specified, this should be between 0 and 1 (e.g., 0.5 for 50%)
         *
         * Values outside the range are clamped to it for rendering - the bar never draws past either end, and
         * `aria-valuenow` matches what is drawn. The displayed text still reflects the raw, unclamped value.
         *
         * A non-finite value describes no quantity at all, so it is normalised to `0`, in the same way and for the
         * same reason as {@link #config-max}. Reading this property back therefore yields `0`, not `NaN`.
         * @prp {Number}
         */
        value : 0,

        /**
         * Template function that can be used to customize the displayed value.
         *
         * The returned value is rendered as text and copied to `aria-valuetext`, never as HTML, so it needs no
         * encoding - passing it through `StringHelper.encodeHtml()` would show the entities literally.
         * @prp {Function}
         * @param {Number} value The value to provide a textual value for
         * @param {Number} max The max value of the progress bar
         * @returns {String|Number|null}
         */
        valueRenderer : null,

        /**
         * Maximum value for progress calculation. When specified, {@link #config-value} is treated as absolute.
         *
         * A non-positive `max` cannot describe a range, so it is normalised to `null`, returning the widget to
         * fractional mode. Reading this property back therefore yields `null`, not the value passed in.
         * @prp {Number}
         */
        max : null,

        /**
         * Color of the progress bar ('b-green', 'b-yellow', 'b-orange', etc.)
         * @prp {Color}
         */
        color : 'b-blue'
    };

    changeMax(max) {
        // Only a finite positive max can describe a range. Anything else falls back to fractional mode, rather than
        // dividing by it or publishing `aria-valuemax="Infinity"`, which is not a number AT can parse.
        return Number.isFinite(max) && max > 0 ? max : null;
    }

    changeValue(value) {
        // Normalised here rather than at each point of use so that the drawn width, the announced `aria-valuenow`
        // and the displayed text cannot disagree. A non-finite value would otherwise publish
        // `aria-valuenow="NaN"`, which is not a number AT can parse, and `width: NaN%`, which is no style at all.
        return Number.isFinite(value) ? value : 0;
    }

    /**
     * `true` when a non-blank `ariaLabel` is in effect, resolved without ingesting the lazy config.
     * @member {Boolean}
     * @internal
     */
    get hasAriaLabel() {
        // Reading `me.ariaLabel` from compose() would flush the lazy config, whose updater reaches for
        // `ariaElement` -> `getConfig('element')`, re-entering element creation. `_ariaLabel` is null until ingest.
        return !isBlank(this._ariaLabel ?? this.peekConfig('ariaLabel'));
    }

    /**
     * `true` when a tooltip supplies this bar's accessible name.
     * @member {Boolean}
     * @internal
     */
    get hasTooltipName() {
        // Widget derives `aria-label` from the tooltip text, but ingests the lazy `tooltip` config at first paint,
        // after compose() has run. peekConfig() reads the pending value without flushing the changer.
        const tooltip = this.peekConfig('tooltip');

        return !isBlank(typeof tooltip === 'string' ? tooltip : tooltip?.html);
    }

    compose() {
        const
            me                            = this,
            { label, role, hasAriaLabel } = me,
            // No `min` config, 0 is the implicit floor. The fractional 0-1 range must be published because the
            // ARIA default for `aria-valuemax` is 100, which would announce 0.5 as half a percent.
            max                           = me.max ?? 1,
            // `aria-valuenow` must describe the same quantity the fill width describes, so both derive from one
            // clamped value. Rounded to shake off float noise such as 0.30000000000000004.
            value                         = ObjectHelper.round(Math.min(max, Math.max(0, me.value)), 6),
            displayValue                  = me.getDisplayValue(),
            // `aria-valuetext` is what AT announces instead of the numeric value, so a blank one suppresses the
            // value entirely. Stringified first, since a `valueRenderer` may return a number - `0` is real text.
            displayText                   = displayValue == null ? '' : String(displayValue).trim(),
            labelId                       = `${me.id}-label`,
            labelText                     = label == null ? '' : String(label),
            labelNames                    = !isBlank(labelText),
            // `aria-label` is only ever written imperatively - by Widget#updateAriaLabel, or by Widget#changeTooltip
            // from the tooltip text - so the live attribute covers every later compose, and hasTooltipName the first.
            named                         = labelNames || hasAriaLabel || me.hasTooltipName ||
                !isBlank(me._element?.getAttribute('aria-label'));

        return {
            class : {
                'b-progress-bar' : 1
            },
            // An unnamed progressbar fails WCAG 4.1.2 / axe `aria-progressbar-name`, so the role and the values it
            // carries are withheld together. The `role` key stays present either way: both creation paths stamp
            // `role="presentation"` when it is absent, and they test for the key, not its value.
            role              : named ? role : null,
            'aria-valuemin'   : named ? 0 : null,
            'aria-valuemax'   : named ? max : null,
            'aria-valuenow'   : named ? value : null,
            // The role makes descendants presentational, so `aria-valuetext` is all that announces the value - a
            // blank one would suppress even the native percentage, so omit it instead. Whitespace is blank: a
            // `valueText` or `valueRenderer` result of '   ' names no value but would still silence the number.
            'aria-valuetext'  : named && displayText ? displayValue : null,
            // `aria-label` is written imperatively, so emitting it here would let DomSync wipe a configured
            // `ariaLabel` on the next recompose. Point at the visible label instead.
            'aria-labelledby' : labelNames && !hasAriaLabel ? labelId : null,
            children          : [
                {
                    class    : 'b-progress-bar-header',
                    children : [
                        // `role : null` suppresses the automatic `role="presentation"` stamp on these two labels
                        // only - header, track and fill keep it, and `progressbar` makes the subtree presentational.
                        labelText ? {
                            tag   : 'label',
                            id    : labelId,
                            role  : null,
                            class : 'b-label b-progress-bar-label',
                            text  : labelText
                        } : undefined,
                        {
                            tag   : 'label',
                            role  : null,
                            class : 'b-label b-progress-bar-value',
                            text  : displayValue
                        }
                    ]
                },
                {
                    class    : 'b-progress-bar-track',
                    children : [
                        {
                            tag   : 'div',
                            class : 'b-progress-bar-fill',
                            style : {
                                width : `${(value / max) * 100}%`
                            }
                        }
                    ]
                }
            ]
        };
    }

    changeTooltip(tooltip, oldTooltip) {
        const result = super.changeTooltip(tooltip, oldTooltip);

        // super writes `aria-label` from the tooltip text, which compose() reads to decide whether the bar is named.
        // The changer runs on every assignment, unlike the updater, which the shared-tooltip path never reaches.
        this.recompose();

        return result;
    }

    updateRole() {
        // compose() writes the `role` attribute because the role is withheld without an accessible name, and two
        // writers would let whichever wrote last win. Same reason as PickerField#updateRole.
    }

    updateAriaLabel(ariaLabel, oldAriaLabel) {
        super.updateAriaLabel(ariaLabel);

        // compose() emits `aria-labelledby` only in the absence of an `ariaLabel` but cannot read the config
        // itself (see hasAriaLabel), so that dependency has to be declared by hand.
        if (!this.isConfiguring && isBlank(ariaLabel) !== isBlank(oldAriaLabel)) {
            this.recompose();
        }
    }

    getDisplayValue() {
        const
            me                                       = this,
            { value, max, valueText, valueRenderer } = me;

        if (valueRenderer) {
            return valueRenderer(value, max);
        }
        // If valueText is explicitly set, use it
        if (valueText != null) {
            return valueText;
        }
        if (max != null) {
            return `${Math.round(value / max * 100)}%`;
        }
        // Otherwise, show percentage
        return `${Math.round(value * 100)}%`;
    }

}

// Register this widget type with the Factory
ProgressBar.initClass();
