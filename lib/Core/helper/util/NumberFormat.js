import Formatter from './Formatter.js';
import StringHelper from '../StringHelper.js';
import LocaleManager from '../../localization/LocaleManager.js';
import '../../localization/En.js';

/**
 * @module Core/helper/util/NumberFormat
 */

const
    escapeRegExp = StringHelper.escapeRegExp,
    digitsRe = /[\d+-]/g,
    // We cannot pass locale=null:
    newFormatter = (locale, config) => new Intl.NumberFormat(locale || undefined, config),
    numFormatRe = /^(?:([$])\s*)?(?:(\d+)>)?\d+(,\d+)?(?:\.((\d*)(?:#*)|[*]))?(?:\s*([%])?)?$/,
    unicodeMinus = '\u2212';

class NumberParser {
    constructor(formatter) {
        const
            me = this,
            locale = formatter.locale,
            // We need a formatter for this locale that has decimals and grouping:
            numFmt = newFormatter(locale, {
                maximumFractionDigits : 3
            }),
            currency = formatter.is.currency ? me._decodeStyle(locale, {
                style           : 'currency',
                currency        : formatter.currency,
                currencyDisplay : formatter.currencyDisplay
            }) : null,
            percent = formatter.is.percent ? me._decodeStyle(locale, {
                style : 'percent'
            }) : null,
            decimal = numFmt.format(1.2).replace(digitsRe, '')[0],
            grouper = numFmt.format(1e9).replace(digitsRe, '')[0] || '';

        Object.assign(me, { currency, decimal, formatter, grouper, percent });

        me.decimal = decimal;
        me.decimalRe = escapeRegExp(decimal, 'g');
        me.grouper = grouper;

        // The stripRe removes whitespace, currency text, percent text and grouping chars:
        me.stripRe = new RegExp(
            `(?:\\s+|${escapeRegExp(grouper)})` +
            (currency ? `|(?:${escapeRegExp(currency.text)})` : '') +
            (percent ? `|(?:${escapeRegExp(percent.text)})` : ''),
            'g');

        //<debug>
        Object.freeze(me);
        Object.freeze(currency);
        Object.freeze(percent);
        //</debug>
    }

    decimalPlaces(value) {
        value = value.replace(this.stripRe, '');

        const dot = value.indexOf(this.decimal) + 1;

        return dot && (value.length - dot);
    }

    parse(value, strict) {
        if (typeof value === 'string') {
            value = value.replace(this.stripRe, '').replace(this.decimalRe, '.').replace(unicodeMinus, '-');

            value = strict ? Number(value) : parseFloat(value);

            if (this.formatter.is.percent) {
                value /= 100;
            }
        }
        // else, a number is already parsed but could be null...

        return value;
    }

    _decodeStyle(locale, fmtDef) {
        const
            fmt = newFormatter(locale, fmtDef),
            decFmt = newFormatter(locale, Object.assign(
                fmt.resolvedOptions(),
                { style : 'decimal' }
            )),
            zero = fmt.format(0),  // = '0%' or '$0.00' in en-US
            zeroDec = decFmt.format(0);  // = '0' or '0.00' in en-US

        return {
            suffix : zero.startsWith(zeroDec),
            text   : zero.replace(zeroDec, '').trim()
        };
    }
}

/**
 * This class is an enhancement to `Intl.NumberFormat` that has a more flexible
 * constructor as well as other features such as `parse()`.
 *
 * All constructor forms take a single argument. The most common is to pass a format
 * {@link #config-template} string:
 *
 * ```javascript
 *  const formatter = new NumberFormat('9,999.99##');
 * ```
 *
 * The above is equivalent to:
 *
 * ```javascript
 *  const formatter = new Intl.NumberFormat({
 *      useGrouping           : true,
 *      minimumFractionDigits : 2,
 *      maximumFractionDigits : 4
 *  });
 * ```
 *
 * The `formatter` created above is used as follows (in the `en-US` locale):
 *
 * ```javascript
 *  console.log(formatter.format(12345.54321));
 *  console.log(formatter.format(42));
 *
 *  // 12,345.5432
 *  // 42.00
 * ```
 *
 * When a format template is insufficient, a config object can be provided, similar to
 * `Intl.NumberFormat`'s `options` parameter. While all options from `Intl.NumberFormat`
 * are valid properties for this class's config object, additional properties are
 * supported.
 *
 * For example:
 *
 * ```javascript
 *  new NumberFormat({
 *      locale      : 'en-US',
 *      template    : '$9,999',
 *      currency    : 'USD',
 *      significant : 5
 *  });
 * ```
 *
 * The `locale` option takes the place of the first positional parameter to the
 * `Intl.NumberFormat` constructor. The `template` config is the same string that can be
 * passed by itself.
 *
 * Another example: custom decimal and group separators
 *
 * ```javascript
 *  new NumberFormat({
 *      template         : '9,9.99##',
 *      decimalSeparator : '#',
 *      groupSeparator   : ' '
 *  });
 * ```
 * This would format the passed number `123456789.87654` as `123 456 789#8765`.
 *
 * NOTE: These options are not part of `Intl.NumberFormat`.
 *
 * The shorthand properties `fraction`, `integer`, and `significant` set the standard
 * options `minimumFractionDigits`, `maximumFractionDigits`, `minimumIntegerDigits`,
 * `minimumSignificantDigits`, and `maximumSignificantDigits`.
 *
 * NOTE: Instances of `NumberFormat` are immutable after construction.
 *
 * For details about `Intl.NumberFormat` see [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat).
 */
export default class NumberFormat extends Formatter {
    // <debug>
    // region Localization test
    static localization = [
        'L{locale}',
        'L{currency}'
    ];
    // endregion
    // </debug>

    static $name = 'NumberFormat';

    /**
     * Set this to a value to apply a default custom `decimalSeparator` to all formatted numbers in the application.
     * This overrides the localization specific separator.
     *
     * Example: set global decimal separator
     * ```javascript
     * // App init code
     * NumberFormat.decimalSeparator = '-';
     *
     * // All numbers displayed in the application will have the custom decimal separator applied:
     * const fmt = new NumberFormat('9,9.99##');
     * fmt.format(12345.54321);
     *
     * // Result: '12,345-5432'
     * ```
     * @static
     * @member {String} decimalSeparator
     * @advanced
     */
    static decimalSeparator;

    /**
     * Set this to a value to apply a default custom `groupSeparator` to all formatted numbers in the application.
     * This overrides the localization specific separator.
     *
     * Example: set global group separator
     * ```javascript
     * // App init code
     * NumberFormat.groupSeparator = ' ';
     *
     * // All numbers displayed in the application will have the custom decimal separator applied:
     * const fmt = new NumberFormat('9,9.99##');
     * fmt.format(12345.54321);
     *
     * // Result: '12 345.5432'
     * ```
     * @static
     * @member {String} groupSeparator
     * @advanced
     */
    static groupSeparator;

    /**
     * Set this to a value to apply a custom `decimalSeparator` to the instance of `NumberFormat`.
     * This overrides the localization specific separator and the static `NumberFormat.decimalSeparator`.
     *
     * Example: set decimal separator on instance
     * ```
     * const fmt = new NumberFormat({
     *     template         : '',
     *     decimalSeparator : '-'
     * });
     * fmt.format(12345.54321);
     *
     * // Result: '12,345-5432'
     * ```
     * @config {String} decimalSeparator
     * @advanced
     */
    decimalSeparator;

    /**
     * Set this to a value to apply a custom `groupSeparator` to the instance of `NumberFormat`.
     * This overrides the localization specific separator and the static `NumberFormat.groupSeparator`.
     *
     * Example: set group separator on instance
     * ```
     * const fmt = new NumberFormat({
     *     template       : '',
     *     groupSeparator : ' '
     * });
     * fmt.format(12345.54321);
     *
     * // Result: '12 345.5432'
     * ```
     * @config {String} groupSeparator
     * @advanced
     */
    groupSeparator;

    // This object holds only those properties that Intl.NumberFormat accepts in its
    // "options" parameter. Only these options will be copied from the NumberFormat
    // and passed to the Intl.NumberFormat constructor and only these will be copied
    // back from its resolvedOptions:
    static standardOptions = [
        'currency',
        'currencyDisplay',
        'locale',
        'maximumFractionDigits',
        'minimumFractionDigits',
        'minimumIntegerDigits',
        'maximumSignificantDigits',
        'minimumSignificantDigits',
        'style',
        'useGrouping'
    ];

    //<debug>
    constructor(options) {
        super(options);

        this.parse('0');  // throw away parse just to get us freezable

        Object.freeze(this.is);
        Object.freeze(this);
    }
    //</debug>

    initialize() {
        this._as = {
            // cacheKey : cachedInstance
        };

        this.is = {
            decimal  : false,
            currency : false,
            percent  : false,
            null     : true,
            from     : null
        };
    }

    get truncator() {
        const
            scale = this.maximumFractionDigits + (this.is.percent ? 2 : 1),
            digits = Math.min(20, scale);

        return this.as({ style : 'decimal', maximumFractionDigits : digits, minimumFractionDigits : digits }, 'truncator');
    }

    configure(options) {
        // apply static variables first, then overwrite below if more specific options exist
        const { decimalSeparator, groupSeparator } = NumberFormat;
        Object.assign(this, {
            ...(decimalSeparator ? { decimalSeparator } : {}),
            ...(groupSeparator ? { groupSeparator } : {})
        });

        if (typeof options !== 'string') {
            Object.assign(this, options);
        }
        else {
            this.template = options;
        }

        const
            me                  = this,
            config              = {},
            loc                 = me.locale ? (LocaleManager.locales[me.locale] || Object.values(LocaleManager.locales).find(locale => locale.localeCode === me.locale)) : LocaleManager.locale,
            localeDefaults      = loc?.NumberFormat,
            { template }        = me,
            { standardOptions } = me.constructor;

        if (localeDefaults) {
            for (const key in localeDefaults) {
                if (me[key] == null && typeof localeDefaults[key] !== 'function') {
                    me[key] = localeDefaults[key];
                }
            }
        }

        if (template) {
            const
                match = numFormatRe.exec(template),
                m2    = match[2],
                m4    = match[4];

            me.useGrouping = Boolean(match[3]);
            me.style = match[1] ? 'currency' : (match[6] ? 'percent' : 'decimal');

            if (m2) {
                me.integer = +m2;
            }

            if (m4 === '*') {
                me.fraction = [0, 20];
            }
            else if (m4 != null) {
                me.fraction = [match[5].length, m4.length];
            }
        }

        me._minMax('fraction', true, true);
        me._minMax('integer', true, false);
        me._minMax('significant', false, true);

        for (const key of standardOptions) {
            if (me[key] != null) {
                config[key] = me[key];
            }
        }

        me.is.from = me.from && me.from.is;
        me.is[me.style] = !(me.is.null = false);

        me.formatter = newFormatter(me.locale, config);

        if (me.decimalSeparator || me.groupSeparator) {
            const { groupSeparator, decimalSeparator } = me.getLocaleSeparators();

            me.separatorRegex = new RegExp(`[${groupSeparator}${decimalSeparator}]`, 'g');
            me.separatorReplace = {
                [groupSeparator]   : me.groupSeparator ?? groupSeparator,
                [decimalSeparator] : me.decimalSeparator ?? decimalSeparator
            };

            // Inverse map: parse() swaps configured separators back to locale defaults before super.parse().
            me.parseSeparatorReplace = Object.fromEntries(
                Object.entries(me.separatorReplace).map(([from, to]) => [to, from])
            );
            me.parseSeparatorRegex = new RegExp(
                Object.keys(me.parseSeparatorReplace).map(s => escapeRegExp(s)).join('|'), 'g');
        }

    }

    /**
     * Creates a derived `NumberFormat` from this instance, with a different `style`. This is useful for processing
     * currency and percentage styles without the symbols being injected in the formatting.
     *
     * @param {String|Object} change The new style (if a string) or a set of properties to update.
     * @param {String} [cacheAs] A key by which to cache this derived formatter.
     * @returns {Core.helper.util.NumberFormat}
     */
    as(change, cacheAs = null) {
        const
            config = this.resolvedOptions() || { template : '9.*' },
            cache = this._as;

        let ret = cacheAs && cache[cacheAs];

        if (!ret) {
            if (typeof change === 'string') {
                config.style = change;
            }
            else {
                Object.assign(config, change);
            }

            config.from = this;

            ret = new NumberFormat(config);
        }

        if (cacheAs) {
            cache[cacheAs] = ret;
        }

        return ret;
    }

    defaultParse(value, strict) {
        return (value == null) ? value : (strict ? Number(value) : parseFloat(value));
    }

    getLocaleSeparators() {
        const parts = this.formatter.formatToParts(1234567.89);

        let
            decimalSeparator = '.',
            groupSeparator = ',';

        for (const part of parts) {
            if (part.type === 'decimal') {
                decimalSeparator = part.value;
            }
            if (part.type === 'group') {
                groupSeparator = part.value;
            }
        }
        return { decimalSeparator, groupSeparator };
    }

    /**
     * Returns the given `value` formatted in accordance with the specified locale and
     * formatting options.
     *
     * @param {Number} value
     * @returns {String}
     */
    format(value) {
        const
            me                                   = this,
            { separatorRegex, separatorReplace } = me;

        if (typeof value === 'string') {
            const v = Number(value);

            value = isNaN(v) ? me.parse(value) : v;
        }

        value = super.format(value);

        if (separatorRegex) {
            value = String(value).replace(separatorRegex, match => separatorReplace[match]);
        }

        return value;
    }

    /**
     * Returns a `Number` parsed from the given, formatted `value`, in accordance with the
     * specified locale and formatting options.
     *
     * If the `value` cannot be parsed, `NaN` is returned.
     *
     * Pass `strict` as `true` to require all text to convert. In essence, the default is
     * in line with JavaScript's `parseFloat` while `strict=true` behaves like the `Number`
     * constructor:
     *
     * ```javascript
     *  parseFloat('1.2xx');  // = 1.2
     *  Number('1.2xx')       // = NaN
     * ```
     *
     * @param {String} value
     * @param {Boolean} [strict=false]
     * @returns {Number}
     */
    parse(value, strict) {
        const { parseSeparatorRegex, parseSeparatorReplace } = this;

        if (parseSeparatorRegex && typeof value === 'string') {
            value = value.replace(parseSeparatorRegex, match => parseSeparatorReplace[match]);
        }

        return super.parse(value, strict);
    }

    /**
     * Returns a `Number` parsed from the given, formatted `value`, in accordance with the
     * specified locale and formatting options.
     *
     * If the `value` cannot be parsed, `NaN` is returned.
     *
     * This method simply passes the `value` to `parse()` and passes `true` for the second
     * argument.
     *
     * @method parseStrict
     * @param {String} value
     * @returns {Number}
     */

    /**
     * Returns the given `Number` rounded in accordance with the specified locale and
     * formatting options.
     *
     * @param {Number|String} value
     * @returns {Number}
     */
    round(value) {
        return this.parse(this.format(value));
    }

    /**
     * Returns the given `Number` truncated to the `maximumFractionDigits` in accordance
     * with the specified locale and formatting options.
     *
     * @param {Number|String} value
     * @returns {Number}
     */
    truncate(value) {
        const
            me = this,
            scale = me.maximumFractionDigits + (me.is.percent ? 2 : 0),
            { truncator } = me;

        let v = me.parse(value),
            dot;

        if (truncator) {
            v = truncator.format(v);
            dot = v.indexOf(truncator.parser.decimal);

            if (dot > -1 && v.length - dot  - 1 > scale) {
                v = v.slice(0, dot + scale + 1);
            }

            v = truncator.parse(v);
        }

        return v;
    }

    resolvedOptions() {
        const options = super.resolvedOptions();

        for (const key in options) {
            // On TeamCity, tests get `undefined` for some properties. Possibly locale related,
            // root cause not yet established
            if (options[key] === undefined) {
                options[key] = this[key];
            }
        }

        return options;
    }

    /**
     * Expands the provided shorthand into the "minimum*Digits" and "maximum*Digits".
     * @param {String} name
     * @param {Boolean} setMin
     * @param {Boolean} setMax
     * @private
     */
    _minMax(name, setMin, setMax) {
        const
            me = this,
            value = me[name];

        if (value != null) {
            const
                capName = StringHelper.capitalize(name),
                max = `maximum${capName}Digits`,
                min = `minimum${capName}Digits`;

            if (typeof value === 'number') {
                if (setMin) {
                    me[min] = value;
                }

                if (setMax) {
                    me[max] = value;
                }
            }
            else {
                me[min] = value[0];
                me[max] = value[1];
            }
        }
    }
}

NumberFormat.Parser = NumberParser;

Object.assign(NumberFormat.prototype, {
    /**
     * The currency to use when using `style: 'currency'`. For example, `'USD'` (US dollar)
     * or `'EUR'` for the euro.
     *
     * If not provided, the {@link Core.localization.LocaleManager} default will be used.
     * @config {String}
     */
    currency : null,

    /**
     * The format in which to display the currency value when using `style: 'currency'`.
     *
     * Valid values are: `'symbol'` (the default), `'code'`, and `'name'`.
     * @config {'symbol'|'code'|'name'}
     * @default
     */
    currencyDisplay : 'symbol',

    /**
     * Specifies the `minimumFractionDigits` and `maximumFractionDigits` in a compact
     * way. If this value is a `Number`, it sets both the minimum and maximum to that
     * value. If this value is an array, `[0]` sets the minimum and `[1]` sets the
     * maximum.
     * @config {Number|Number[]}
     */
    fraction : null,

    from : null,

    /**
     * An alias for `minimumIntegerDigits`.
     * @config {Number}
     */
    integer : null,

    /**
     * The name of the locale. For example, `'en-US'`. This config is the same as the
     * first argument to the `Intl.NumberFormat` constructor.
     *
     * Defaults to the browser's default locale.
     * @config {String}
     */
    locale : null,

    /**
     * The maximum number of digits following the decimal.
     *
     * This is more convenient to specify using the {@link #config-fraction} config.
     * @config {Number}
     */
    maximumFractionDigits : null,

    /**
     * The minimum number of digits following the decimal.
     *
     * This is more convenient to specify using the {@link #config-fraction} config.
     * @config {Number}
     */
    minimumFractionDigits : null,

    /**
     * The minimum number of digits preceding the decimal.
     *
     * This is more convenient to specify using the {@link #config-integer} config.
     * @config {Number}
     */
    minimumIntegerDigits : null,

    /**
     * The maximum number of significant digits.
     *
     * This is more convenient to specify using the {@link #config-significant} config.
     * @config {Number}
     */
    maximumSignificantDigits : null,

    /**
     * The minimum number of significant digits.
     *
     * This is more convenient to specify using the {@link #config-significant} config.
     * @config {Number}
     */
    minimumSignificantDigits : null,

    /**
     * Specifies the `minimumSignificantDigits` and `maximumSignificantDigits` in a compact
     * format. If this value is a `Number`, it sets only the maximum to that value. If this
     * value is an array, `[0]` sets the minimum and `[1]` sets the maximum.
     *
     * If this value (or `minimumSignificantDigits` or `minimumSignificantDigits`) is set,
     * `integer` (and `minimumIntegerDigits`) and `fraction` (and `minimumFractionDigits`
     * and `minimumFractionDigits`) are ignored.
     *
     * @config {Number|Number[]}
     */
    significant : null,

    /**
     * The formatting style.
     *
     * Valid values are: `'decimal'` (the default), `'currency'`, and `'percent'`.
     * @config {'decimal'|'currency'|'percent'}
     * @default
     */
    style : 'decimal',

    /**
     * A format template consisting of the following parts:
     *
     * ```text
     *  [$] [\d+:] \d+ [,\d+] [.\d* [#*] | *] [%]
     * ```
     *
     * If the template begins with a `'$'`, the formatter's `style` option is set to
     * `'currency'`. If the template ends with `'%'`, `style` is set to `'percent'`.
     * It is invalid to include both characters. When using `'$'`, the `currency` symbol
     * defaults to what is provided by the {@link Core.localization.LocaleManager}.
     *
     * To set the `minimumIntegerDigits`, the desired minimum comes before the first
     * digits in the template and is followed by a `'>'` (greater-than). For example:
     *
     * ```text
     *  5>9,999.00
     * ```
     *
     * The above sets `minimumIntegerDigits` to 5.
     *
     * The `useGrouping` option is enabled if there is a `','` (comma) present and is
     * disabled otherwise.
     *
     * If there is a `'.'` (decimal) present, it may be followed by either of:
     *
     *  - Zero or more digits which may then be followed by zero or more `'#'` characters.
     *    The number of digits determines the `minimumFractionDigits`, while the total
     *    number of digits and `'#'`s determines the `maximumFractionDigits`.
     *  - A single `'*'` (asterisk) indicating any number of fractional digits (no minimum
     *    or maximum).
     *
     * @config {String}
     */
    template : null,

    /**
     * Specify `false` to disable thousands separators.
     * @config {Boolean}
     * @default
     */
    useGrouping : true
});

Formatter.number = (format, value) => NumberFormat.get(format).format(value);

// Cached formatters will become invaid on locale change
LocaleManager.ion({
    locale : () => NumberFormat.cache.clear()
});
