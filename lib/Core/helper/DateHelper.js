import Localizable from '../localization/Localizable.js';
import LocaleManager from '../localization/LocaleManager.js';
import '../localization/En.js';
import StringHelper from './StringHelper.js';
import Helpers from './Helpers.js';
import Objects from './util/Objects.js';

const
    { toString }      = Object.prototype,
    DATE_TYPE         = toString.call(new Date()),
    tempDate          = new Date(),
    MS_PER_HOUR       = 1000 * 60 * 60,
    defaultValue      = (value, defValue) => isNaN(value) || value == null ? defValue : value,
    rangeFormatPartRe = /([ES]){([^}]+)}/g,
    enOrdinalSuffix   = number => {
        const hasSpecialCase = ['11', '12', '13'].find((n) => number.endsWith(n));

        let suffix = 'th';

        if (!hasSpecialCase) {
            const lastDigit = number[number.length - 1];
            suffix          = { 1 : 'st', 2 : 'nd', 3 : 'rd' }[lastDigit] || 'th';
        }

        return number + suffix;
    },
    defineUnitConversion = (fromUnit, toUnit, conversionRate, targetObject = validConversions) => {
        // get (or init if not exist) source and target unit conversion rates
        targetObject[fromUnit] = targetObject[fromUnit] || {
            [fromUnit] : 1
        };
        targetObject[toUnit] = targetObject[toUnit] || {
            [toUnit] : 1
        };

        // fromUnit => toUnit conversion rate
        targetObject[fromUnit][toUnit] = conversionRate;
        // and register opposite too: toUnit => fromUnit conversion rate
        targetObject[toUnit][fromUnit] = 1 / conversionRate;

        return targetObject;
    },
    useIntlFormat     = (name, options, date) => {
        // When the date is a TZDateView partition the cache by tz and inject the timeZone option into the Intl
        // formatter. Pass the real Date so Intl does the tz conversion natively.
        const { timeZone } = date;
        if (timeZone) {
            name += `|${timeZone}`;
            options = { ...options, timeZone };
            date = date.realDate;
        }

        const formatter = intlFormatterCache[name] || (intlFormatterCache[name] = new Intl.DateTimeFormat(locale, options));

        return formatter.format(date);
    },
    formatTime        = (name, options, date, isShort = false) => {
        let strTime = useIntlFormat(name, options, date);

        // remove '0' from time when has AM/PM (from 01:00 PM to 1:00 PM): https://github.com/bryntum/bryntum/issues/1483
        if (/am|pm/i.test(strTime)) {
            // remove first character only if is 0
            strTime = strTime.replace(/^0/, '');

            // if isShort is true, remove minutes if is :00
            if (isShort) {
                strTime = strTime.replace(/:00/, '');
            }
        }

        return strTime;
    },
    getDayDiff        = (end, start) => Math.floor((end.getTime() - start.getTime() -
        (end.getTimezoneOffset() - start.getTimezoneOffset()) * validConversions.minute.millisecond) / validConversions.day.millisecond) + 1,
    normalizeDay      = day => day >= 0 ? day : day + 7,
    msRegExp          = /([^\w])(S+)/gm,
    msReplacer        = (match, g1) => g1 + 'SSS',
    splitRegExp       = /[:.\-/\s]/,
    dayPrefixRe       = /^(?:יום |ال)/,
    timeZoneFormatRe  = /(Z{1,2})$/,
    timeZoneRegExp    = (/(?:Z|[+-]\d{2}:\d{2})$/),
    uRegExp           = /(\d{4})(\d{2})(\d{2})/,
    uuRegExp          = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;

// These vars are set when changing locale or timezone

let locale             = 'en-US',
    ordinalSuffix      = enOrdinalSuffix,
    // Used to cache used formats, to not have to parse format string each time
    formatCache        = {},
    formatRedirects    = {},
    intlFormatterCache = {},
    parserCache        = {},
    // Key cache IS timezone-dependent: the same UTC ms maps to different YYYY-MM-DD in different timezones.
    // Partitioned as { [tzKey]: { [msTrunc]: 'YYYY-MM-DD' } } where tzKey is '__local__' for no timezone.
    keyCache           = {},
    amIndicator        = 'AM',
    pmIndicator        = 'PM',
    keyDivisor         = MS_PER_HOUR,
    dayName,
    dayPrefix;

// Returns the timezone-specific partition of the key cache for the given date
const getKeyCache = date => {
    const tzKey = date?.timeZone || '__local__';
    return keyCache[tzKey] || (keyCache[tzKey] = {});
};

const redirectFormat = (format) => {
    const intlConfig = intlFormatConfigs[format];
    if (!intlConfig) {
        throw new Error('Only international formats should be used here');
    }

    if (formatRedirects[format] !== undefined) {
        return formatRedirects[format];
    }

    const
        intl = new Intl.DateTimeFormat(locale, intlConfig),
        fmt  = intl.formatToParts(new Date(2001, 1, 2, 3, 4, 5, 6)).map(part => {
            const
                type    = part.type,
                intlCfg = intlConfig[type];

            if (type === 'literal') {
                // The parser cannot skip unknown separators, so commas are stripped
                return part.value.replace(/,/g, '');
            }
            else if (type === 'day') {
                return intlCfg === 'numeric' ? 'D' : 'DD';
            }
            else if (type === 'month') {
                return intlCfg === 'short'
                    ? 'MMM'
                    : intlCfg === 'long'
                        ? 'MMMM'
                        : intlCfg === 'numeric'
                            ? 'M'
                            : 'MM';
            }
            else if (type === 'year') {
                // `YYYY` is substituted for numeric year in `ll`, a known simplification
                // See https://github.com/bryntum/bryntum/issues/5179
                return intlCfg === 'numeric' ? 'YYYY' : 'YY';
            }
        }).join('');

    return formatRedirects[format] = fmt;
};

const
    DEFAULT_YEAR               = 2020, // 2020 is the year that has no issues in Safari, see: https://github.com/bryntum/bryntum/issues/554
    DEFAULT_MONTH              = 0,
    DEFAULT_DAY                = 1,
    intlFormatConfigs          = {
        l  : { year : 'numeric', month : 'numeric', day : 'numeric' },
        ll : { year : 'numeric', month : 'short', day : 'numeric' }
    },
    formats                    = {
        // 1, 2, ... 11, 12
        M    : date => date.getMonth() + 1, //date.toLocaleDateString(locale, { month : 'numeric' }),
        // 1st, 2nd, 3rd, 4th, ... 11th, 12th
        Mo   : date => ordinalSuffix(formats.M(date).toString()),
        // 01, 02, ...
        MM   : date => (date.getMonth() + 1).toString().padStart(2, '0'), //date.toLocaleDateString(locale, { month : '2-digit' }),
        // Jan, Feb, ...
        MMM  : date => useIntlFormat('MMM', { month : 'short' }, date),
        // January, February, ...
        MMMM : date => useIntlFormat('MMMM', { month : 'long' }, date),

        // Decade, eg 17-Jun-1962 => 1960s
        DC : date => DateHelper.localize('L{decade}', date),

        // 1, 2, ...
        Q  : date => Math.ceil((date.getMonth() + 1) / 3),
        // 1st, 2nd, ...
        Qo : date => ordinalSuffix(formats.Q(date).toString()),

        // 1, 2, ...
        D  : date => date.getDate(), //date.toLocaleDateString(locale, { day : 'numeric' }),
        // 1st, 2nd, ...
        Do : date => ordinalSuffix(formats.D(date).toString()),
        // 01, 02, ...
        DD : date => date.getDate().toString().padStart(2, '0'), //date.toLocaleDateString(locale, { day : '2-digit' }),

        // 1, 2, ..., 365, 365
        DDD : date => Math.ceil(
            (
                new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0) -
                new Date(date.getFullYear(), 0, 0, 12, 0, 0)
            ) / validConversions.day.millisecond),
        // 1st, 2nd, ...
        DDDo : date => ordinalSuffix(formats.DDD(date).toString()),
        // 001, 002, ...
        DDDD : date => formats.DDD(date).toString().padStart(3, '0'),
        // 0, 1, ..., 6
        d    : date => date.getDay(),
        // 0th, 1st, ...
        do   : date => ordinalSuffix(date.getDay().toString()),
        // S, M, ...
        d1   : date => useIntlFormat('d1', { weekday : 'narrow' }, date).substr(0, 1),
        // Su, Mo, ...
        dd   : date => formats.ddd(date).substring(0, 2),
        // Sun, Mon, ...
        ddd  : date => {
            dayName = useIntlFormat('ddd', { weekday : 'short' }, date);
            dayPrefix = dayName.match(dayPrefixRe)?.[0];
            return dayName.substring(dayPrefix ? dayPrefix.length : 0);
        },
        // Sunday, Monday, ...
        dddd : date => {
            dayName = useIntlFormat('dddd', { weekday : 'long' }, date);
            dayPrefix = dayName.match(dayPrefixRe)?.[0];
            return dayName.substring(dayPrefix ? dayPrefix.length : 0);
        },

        u : date => {
            const
                formatter = intlFormatterCache.u || (intlFormatterCache.u = new Intl.DateTimeFormat('en-GB', {
                    timeZone : 'UTC',
                    year     : 'numeric',
                    month    : '2-digit',
                    day      : '2-digit'
                })),
                parts     = formatter.formatToParts(date);

            return `${parts[4].value}${parts[2].value}${parts[0].value}`;
        },
        uu : date => {
            const
                formatter = intlFormatterCache.uu || (intlFormatterCache.uu = new Intl.DateTimeFormat('en-GB', {
                    timeZone : 'UTC',
                    hour12   : false,
                    year     : 'numeric',
                    month    : '2-digit',
                    day      : '2-digit',
                    hour     : '2-digit',
                    minute   : '2-digit',
                    second   : '2-digit'
                })),
                parts     = formatter.formatToParts(date);

            return `${parts[4].value}${parts[2].value}${parts[0].value}T${parts[6].value}${parts[8].value}${parts[10].value}`;
        },

        e : date => date.getDay(),
        E : date => date.getDay() + 1,

        // ISO week, 1, 2, ...
        W  : date => DH.getWeekNumber(date)[1],
        Wo : date => ordinalSuffix(formats.W(date).toString()),
        WW : date => formats.W(date).toString().padStart(2, '0'),

        // ISO week, 1, 2, ... with localized 'Week ' prefix
        Wp   : date => `${DateHelper.localize('L{Week}')} ${formats.W(date)}`,
        WWp  : date => `${DateHelper.localize('L{Week}')} ${formats.WW(date)}`,
        Wp0  : date => `${DateHelper.localize('L{Week}')[0]}${formats.W(date)}`,
        WWp0 : date => `${DateHelper.localize('L{Week}')[0]}${formats.WW(date)}`,

        // 1979, 2018
        Y    : date => date.getFullYear(), //date.toLocaleDateString(locale, { year : 'numeric' }),
        // 79, 18
        YY   : date => (date.getFullYear() % 100).toString().padStart(2, '0'), //date.toLocaleDateString(locale, { year : '2-digit' }),
        // 1979, 2018
        YYYY : date => date.getFullYear(), //date.toLocaleDateString(locale, { year : 'numeric' }),

        A : date => (date.getHours() < 12 ? amIndicator : pmIndicator).toLocaleUpperCase(),
        a : date => (date.getHours() < 12 ? amIndicator : pmIndicator).toLocaleLowerCase(),

        // 0, 1, ... 23
        H  : date => date.getHours(),
        // 00, 01, ...
        HH : date => date.getHours().toString().padStart(2, '0'),
        // 1, 2, ... 12
        h  : date => (date.getHours() % 12) || 12,
        // 01, 02, ...
        hh : date => formats.h(date).toString().padStart(2, '0'),
        // 1, 2, ... 24
        k  : date => date.getHours() || 24,
        // 01, 02, ...
        kk : date => formats.k(date).toString().padStart(2, '0'),
        // Locale specific (0 -> 24 or 1 AM -> 12 PM)
        K  : date => formatTime('K', { hour : 'numeric' }, date),
        // Locale specific (00 -> 24 or 1 AM -> 12 PM)
        KK : date => formatTime('KK', { hour : '2-digit' }, date),

        // 0, 1, ... 59
        m  : date => date.getMinutes(), //date.toLocaleTimeString(locale, { minute : 'numeric' }),
        // 00, 01, ...
        mm : date => formats.m(date).toString().padStart(2, '0'),

        // 0, 1, ... 59
        s  : date => date.getSeconds(), //date.toLocaleTimeString(locale, { second : 'numeric' }),
        // 00, 01, ...
        ss : date => formats.s(date).toString().padStart(2, '0'),

        // 0, 1, ... 9 which are 000, 100, 200 ... 900 in milliseconds
        S   : date => Math.floor(date.getMilliseconds() / 100).toString(),
        // 00, 01, ... 99 which are 000, 010, 020 ... 990 in milliseconds
        SS  : date => Math.floor(date.getMilliseconds() / 10).toString().padStart(2, '0'),
        // 000, 001, ... 999 in milliseconds
        SSS : date => date.getMilliseconds().toString().padStart(3, '0'),

        z  : date => useIntlFormat('z', { timeZoneName : 'short' }, date),
        zz : date => useIntlFormat('zz', { timeZoneName : 'long' }, date),
        Z  : date => DH.getGMTOffset(date),

        LT  : date => formatTime('LT', { hour : '2-digit', minute : '2-digit' }, date),
        // if minutes is 0, doesn't show it
        LST : date => formatTime('LST', { hour : 'numeric', minute : '2-digit' }, date, true),
        LTS : date => formatTime('LTS', { hour : '2-digit', minute : '2-digit', second : '2-digit' }, date),
        L   : date => useIntlFormat('L', { year : 'numeric', month : '2-digit', day : '2-digit' }, date),
        l   : date => useIntlFormat('l', intlFormatConfigs.l, date),
        LL  : date => useIntlFormat('LL', { year : 'numeric', month : 'long', day : 'numeric' }, date),
        ll  : date => useIntlFormat('ll', intlFormatConfigs.ll, date),
        LLL : date => useIntlFormat('LLL', {
            year   : 'numeric',
            month  : 'long',
            day    : 'numeric',
            hour   : 'numeric',
            minute : '2-digit'
        }, date),
        lll : date => useIntlFormat('lll', {
            year   : 'numeric',
            month  : 'short',
            day    : 'numeric',
            hour   : 'numeric',
            minute : '2-digit'
        }, date),
        LLLL : date => useIntlFormat('LLLL', {
            year    : 'numeric',
            month   : 'long',
            day     : 'numeric',
            hour    : 'numeric',
            minute  : '2-digit',
            weekday : 'long'
        }, date),
        llll : date => useIntlFormat('llll', {
            year    : 'numeric',
            month   : 'short',
            day     : 'numeric',
            hour    : 'numeric',
            minute  : '2-digit',
            weekday : 'short'
        }, date)
    },
    // Want longest keys first, to not stop match at L of LTS etc.
    formatKeys                 = Object.keys(formats).sort((a, b) => b.length - a.length),
    formatRegexp               = `^(?:${formatKeys.join('|')})`,

    // return empty object, meaning value cannot be processed to a valuable date part
    emptyFn                    = () => ({}),
    isNumber                   = (str) => numberRegex.test(str),
    parseMilliseconds          = (str) => isNumber(str) && { milliseconds : parseInt(str.padEnd(3, '0').substring(0, 3)) },
    parsers                    = {
        YYYY : str => {
            const year = parseInt(str);
            return { year : year >= 1000 && year <= 9999 ? year : NaN };
        },
        Y  : str => ({ year : parseInt(str) }),
        YY : str => {
            const year = parseInt(str);
            return { year : year + (year > 1968 ? 1900 : 2000) };
        },
        M   : str => ({ month : parseInt(str) - 1 }),
        MM  : str => ({ month : parseInt(str) - 1 }),
        Mo  : str => ({ month : parseInt(str) - 1 }),
        MMM : str => {
            const month = (str || '').toLowerCase();

            for (const [name, entry] of Object.entries(DH._monthShortNamesIndex)) {
                if (month.startsWith(name)) {
                    return { month : entry.value };
                }
            }
        },
        MMMM : str => {
            const month = (str || '').toLowerCase();

            for (const [name, entry] of Object.entries(DH._monthNamesIndex)) {
                if (month.startsWith(name)) {
                    return { month : entry.value };
                }
            }
        },
        DD   : str => ({ date : parseInt(str) }),
        D    : str => ({ date : parseInt(str) }),
        Do   : str => ({ date : parseInt(str) }),
        DDD  : emptyFn,
        DDDo : emptyFn,
        DDDD : emptyFn,
        d    : emptyFn,
        do   : emptyFn,
        d1   : emptyFn,
        dd   : emptyFn,
        ddd  : emptyFn,
        dddd : emptyFn,
        Q    : emptyFn,
        Qo   : emptyFn,
        W    : emptyFn,
        Wo   : emptyFn,
        WW   : emptyFn,
        e    : emptyFn,
        E    : emptyFn,
        HH   : str => ({ hours : parseInt(str) }),
        hh   : str => ({ hours : parseInt(str) }),
        mm   : str => ({ minutes : parseInt(str) }),
        H    : str => ({ hours : parseInt(str) }),
        h    : str => ({ hours : parseInt(str) }),
        m    : str => ({ minutes : parseInt(str) }),
        ss   : str => ({ seconds : parseInt(str) }),
        s    : str => ({ seconds : parseInt(str) }),
        S    : parseMilliseconds,
        SS   : parseMilliseconds,
        SSS  : parseMilliseconds,
        u    : str => {
            let parts = uRegExp.exec(str).splice(1);
            if (parts.length === 3) {
                parts = parts.map(Number);
                return { year : parts[0], month : parts[1] - 1, date : parts[2], timeZone : 0 };
            }
        },
        uu : str => {
            let parts = uuRegExp.exec(str).splice(1);
            if (parts.length === 6) {
                parts = parts.map(Number);
                return { year : parts[0], month : parts[1] - 1, date : parts[2], hours : parts[3], minutes : parts[4], seconds : parts[5], timeZone : 0 };
            }
        },

        A : str => ({ amPm : str.toLowerCase() }),
        a : str => ({ amPm : str.toLowerCase() }),

        L   : 'MM/DD/YYYY',
        LT  : 'HH:mm A',
        LTS : 'HH:mm:ss A',

        l  : { type : 'dynamic', parser : () => redirectFormat('l') },
        ll : { type : 'dynamic', parser : () => redirectFormat('ll') },

        // Can either be Z (=UTC, 0) or +-HH:MM
        Z : str => {
            if (!str || (!timeZoneRegEx.test(str) && str !== 'Z')) {
                return null;
            }

            let timeZone = 0;
            // If string being parsed is more detailed than the format specified we can have more chars left,
            // thus check the last (for example HH:mmZ with input HH:mm:ssZ -> ssZ)
            if (str !== 'Z') {
                const matches = timeZoneRegEx.exec(str);

                // If timezone regexp matches, sting has time zone offset like '+02:00'
                if (matches) {
                    const
                        sign    = matches[1] === '+' ? 1 : -1,
                        hours   = parseInt(matches[2]) || 0,
                        minutes = parseInt(matches[3]) || 0;

                    timeZone = sign * (hours * 60 + minutes);
                }
                // otherwise we just return current time zone, because there's a Z key in the input
                else {
                    timeZone = -1 * new Date().getTimezoneOffset();
                }
            }
            return { timeZone };
        }
    },
    parserKeys                 = Object.keys(parsers).sort((a, b) => b.length - a.length),
    parserRegexp               = new RegExp(`(${parserKeys.join('|')})`),

    // Following regexp includes all formats that should be handled by Date class
    // !!! except `l|ll`, plus made all-string capturing, otherwise the left-most `l` pattern
    // matches all `l*` formats
    // localeStrRegExp            = new RegExp('(l|LL|ll|LLL|lll|LLLL|llll)'),
    localeStrRegExp            = new RegExp('^(LL|LLL|lll|LLLL|llll)$'), // NOSONAR
    //    ISODateRegExp             = new RegExp('YYYY-MM-DD[T ]HH:mm:ss(.s+)?Z'),

    // Some validConversions are negative to show that it's not an exact conversion, just an estimate.
    validConversions           = {
        // The units below assume:
        // 30 days in a month, 91 days for a quarter and 365 for a year
        // 52 weeks per year, 4 per month, 13 per quarter
        // 3652 days per decade (assuming two of the years will be leap with 366 days)
        decade : {
            decade      : 1,
            year        : 10,
            quarter     : 40,
            month       : 120,
            week        : 520,
            day         : 3652,
            hour        : 24 * 3652,
            minute      : 1440 * 3652,
            second      : 86400 * 3652,
            millisecond : 86400000 * 3652
        },
        year : {
            decade      : 0.1,
            year        : 1,
            quarter     : 4,
            month       : 12,
            week        : 52,
            day         : 365,
            hour        : 24 * 365,
            minute      : 1440 * 365,
            second      : 86400 * 365,
            millisecond : 86400000 * 365
        },
        quarter : {
            decade      : 1 / 40,
            year        : 1 / 4,
            quarter     : 1,
            month       : 3,
            week        : 4,
            day         : 91,
            hour        : 24 * 91,
            minute      : 1440 * 91,
            second      : 86400 * 91,
            millisecond : 86400000 * 91
        },
        month : {
            decade      : 1 / 120,
            year        : 1 / 12,
            quarter     : 1 / 3,
            month       : 1,
            week        : 4,
            day         : -30,
            hour        : -24 * 30,
            minute      : -1440 * 30,
            second      : -86400 * 30,
            millisecond : -86400000 * 30
        },
        week : {
            decade      : -1 / 520,
            year        : -1 / 52,
            quarter     : -1 / 13,
            month       : -1 / 4,
            day         : 7,
            hour        : 168,
            minute      : 10080,
            second      : 604800,
            millisecond : 604800000
        },
        day : {
            decade      : -1 / 3652,
            year        : -1 / 365,
            quarter     : -1 / 91,
            month       : -1 / 30,
            week        : 1 / 7,
            hour        : 24,
            minute      : 1440,
            second      : 86400,
            millisecond : 86400000
        },
        hour : {
            decade      : -1 / (3652 * 24),
            year        : -1 / (365 * 24),
            quarter     : -1 / (91 * 24),
            month       : -1 / (30 * 24),
            week        : 1 / 168,
            day         : 1 / 24,
            minute      : 60,
            second      : 3600,
            millisecond : 3600000
        },
        minute : {
            decade      : -1 / (3652 * 1440),
            year        : -1 / (365 * 1440),
            quarter     : -1 / (91 * 1440),
            month       : -1 / (30 * 1440),
            week        : 1 / 10080,
            day         : 1 / 1440,
            hour        : 1 / 60,
            second      : 60,
            millisecond : 60000
        },
        second : {
            decade      : -1 / (3652 * 86400),
            year        : -1 / (365 * 86400),
            quarter     : -1 / (91 * 86400),
            month       : -1 / (30 * 86400),
            week        : 1 / 604800,
            day         : 1 / 86400,
            hour        : 1 / 3600,
            minute      : 1 / 60,
            millisecond : 1000
        },
        millisecond : {
            decade  : -1 / (3652 * 86400000),
            year    : -1 / (365 * 86400000),
            quarter : -1 / (91 * 86400000),
            month   : -1 / (30 * 86400000),
            week    : 1 / 604800000,
            day     : 1 / 86400000,
            hour    : 1 / 3600000,
            minute  : 1 / 60000,
            second  : 1 / 1000
        }
    },

    normalizedUnits            = {
        ms            : 'millisecond',
        milliseconds  : 'millisecond',
        ems           : 'emillisecond',
        emilliseconds : 'emillisecond',
        s             : 'second',
        seconds       : 'second',
        es            : 'esecond',
        eseconds      : 'esecond',
        m             : 'minute',
        mi            : 'minute',
        min           : 'minute',
        minutes       : 'minute',
        em            : 'eminute',
        emi           : 'eminute',
        emin          : 'eminute',
        eminutes      : 'eminute',
        h             : 'hour',
        hours         : 'hour',
        eh            : 'ehour',
        ehours        : 'ehour',
        d             : 'day',
        days          : 'day',
        ed            : 'eday',
        edays         : 'eday',
        w             : 'week',
        weeks         : 'week',
        ew            : 'eweek',
        eweeks        : 'eweek',
        M             : 'month',
        mo            : 'month',
        mon           : 'month',
        months        : 'month',
        EM            : 'emonth',
        eM            : 'emonth',
        emo           : 'emonth',
        emon          : 'emonth',
        emonths       : 'emonth',
        q             : 'quarter',
        quarters      : 'quarter',
        eq            : 'equarter',
        equarters     : 'equarter',
        y             : 'year',
        years         : 'year',
        ey            : 'eyear',
        eyears        : 'eyear',
        dec           : 'decade',
        decades       : 'decade',
        edec          : 'edecade',
        edecades      : 'edecade'
    },

    withDecimalsDurationRegex  = /^\s*([-+]?\d+(?:[.,]\d*)?|[-+]?(?:[.,]\d+))\s*([^\s]+)?/i,
    noDecimalsDurationRegex    = /^\s*([-+]?\d+)(?![.,])\s*([^\s]+)?/i,
    canonicalUnitNames         = [
        'millisecond',
        'emillisecond',
        'second',
        'esecond',
        'minute',
        'eminute',
        'hour',
        'ehour',
        'day',
        'eday',
        'week',
        'eweek',
        'month',
        'emonth',
        'quarter',
        'equarter',
        'year',
        'eyear',
        'decade',
        'edecade'
    ],
    canonicalUnitAbbreviations = [
        ['ms', 'mil'],
        ['ems', 'emil'],
        ['s', 'sec'],
        ['es', 'esec'],
        ['m', 'min'],
        ['em', 'emin'],
        ['h', 'hr'],
        ['eh', 'ehr'],
        ['d'],
        ['ed'],
        ['w', 'wk'],
        ['ew', 'ewk'],
        ['mo', 'mon', 'mnt', 'M'],
        ['emo', 'emon', 'emnt'],
        ['q', 'quar', 'qrt'],
        ['eq', 'equar', 'eqrt'],
        ['y', 'yr'],
        ['ey', 'eyr'],
        ['dec'],
        ['edec']
    ],
    deltaUnits                 = [
        'decade',
        'year',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
        'millisecond'
    ],
    // Used when creating a date from an object, to fill in any blanks
    dateProperties             = [
        'milliseconds',
        'seconds',
        'minutes',
        'hours',
        'date',
        'month',
        'year'
    ],
    // <remove-on-release>
    // TODO: Should we provide special number parsing?
    // </remove-on-release>
    parseNumber                = (n) => {
        const result = parseFloat(n);
        return isNaN(result) ? null : result;
    },
    numberRegex                = /^[0-9]+$/, // NOSONAR
    timeZoneRegEx              = /([+-])(\d\d):*(\d\d)*$/,
    unitChain                  = {
        // standard units chain
        millisecond : {
            magnitude : 0,
            smaller   : undefined,
            greater   : 'second'
        },
        second : {
            magnitude : 2,
            smaller   : 'millisecond',
            greater   : 'minute'
        },
        minute : {
            magnitude : 4,
            smaller   : 'second',
            greater   : 'hour'
        },
        hour : {
            magnitude : 6,
            smaller   : 'minute',
            greater   : 'day'
        },
        day : {
            magnitude : 8,
            smaller   : 'hour',
            greater   : 'week'
        },
        week : {
            magnitude : 10,
            smaller   : 'day',
            greater   : 'month'
        },
        month : {
            magnitude : 12,
            smaller   : 'week',
            greater   : 'quarter'
        },
        quarter : {
            magnitude : 14,
            smaller   : 'month',
            greater   : 'year'
        },
        year : {
            magnitude : 16,
            smaller   : 'quarter',
            greater   : 'decade'
        },
        decade : {
            magnitude : 18,
            smaller   : 'year'
        },
        // Elapsed units chain
        emillisecond : {
            magnitude : 1,
            smaller   : undefined,
            greater   : 'esecond'
        },
        esecond : {
            magnitude : 3,
            smaller   : 'emillisecond',
            greater   : 'eminute'
        },
        eminute : {
            magnitude : 5,
            smaller   : 'esecond',
            greater   : 'ehour'
        },
        ehour : {
            magnitude : 7,
            smaller   : 'eminute',
            greater   : 'eday'
        },
        eday : {
            magnitude : 9,
            smaller   : 'ehour',
            greater   : 'eweek'
        },
        eweek : {
            magnitude : 11,
            smaller   : 'eday',
            greater   : 'emonth'
        },
        emonth : {
            magnitude : 12,
            smaller   : 'eweek',
            greater   : 'equarter'
        },
        equarter : {
            magnitude : 14,
            smaller   : 'emonth',
            greater   : 'eyear'
        },
        eyear : {
            magnitude : 16,
            smaller   : 'equarter',
            greater   : 'edecade'
        },
        edecade : {
            magnitude : 18,
            smaller   : 'eyear'
        }
    },
    snapFns                    = {
        round(number, step = 1) {
            return Math.round(number / step) * step;
        },
        floor(number, step = 1) {
            return Math.floor(number / step) * step;
        },
        ceil(number, step = 1) {
            return Math.ceil(number / step) * step;
        }
    };

// Register elapsed unit conversion rates
defineUnitConversion('edecade', 'millisecond', 3600 * 86400000);
defineUnitConversion('eyear', 'millisecond', 360 * 86400000);
defineUnitConversion('equarter', 'millisecond', 90 * 86400000);
defineUnitConversion('emonth', 'millisecond', 30 * 86400000);
defineUnitConversion('eweek', 'millisecond', 7 * 86400000);
defineUnitConversion('eday', 'millisecond', 86400000);
defineUnitConversion('ehour', 'millisecond', 3600000);
defineUnitConversion('eminute', 'millisecond', 60000);
defineUnitConversion('esecond', 'millisecond', 1000);
defineUnitConversion('emillisecond', 'millisecond', 1000);

/**
 * @module Core/helper/DateHelper
 */

/**
 * A string defining a duration unit. Valid values are:
 * - "millisecond" - Milliseconds
 * - "second" - Seconds
 * - "minute" - Minutes
 * - "hour" - Hours
 * - "day" - Days
 * - "week" - Weeks
 * - "month" - Months
 * - "quarter" - Quarters
 * - "year"- Years
 * @typedef {'millisecond'|'second'|'minute'|'hour'|'day'|'week'|'month'|'quarter'|'year'|String} DurationUnit
 */

/**
 * A string defining an abbreviated duration unit. Valid values are:
 * - "ms" - Milliseconds
 * - "s" - Seconds
 * - "m" - Minutes
 * - "h" - Hours
 * - "d" - Days
 * - "w" - Weeks
 * - "M" - Months
 * - "q" - Quarters
 * - "y"- Years
 * @typedef {'ms'|'s'|'m'|'h'|'d'|'w'|'M'|'y'|String} DurationUnitShort
 */

// Documented at the export below, to work for singleton
class DateHelper extends Localizable() {

    // <debug>
    // region Localization test
    localization = [
        'L{Object.Week}',
        'L{DateHelper.decade}'
    ];
    // endregion
    // </debug>

    MS_PER_DAY = MS_PER_HOUR * 24;

    static $name = 'DateHelper';

    // Locale state is module level and refreshed by applyLocale on the singleton (see the LocaleManager listener at the
    // end of this file). Time zone instances are never destroyed, so subscribing them would leak each one
    static subscribeToLocale = false;

    //region Parse & format
    /**
     * Get/set the default format used by `format()` and `parse()`. Defaults to `'YYYY-MM-DDTHH:mm:ssZ'`
     * (~ISO 8601 Date and time, `'1962-06-17T09:21:34Z'`).
     * @member {String} defaultFormat
     * @static
     * @memberof module:Core/helper/DateHelper
     */
    set defaultFormat(format) {
        DH._defaultFormat = format;
    }

    get defaultFormat() {
        return DH._defaultFormat || 'YYYY-MM-DDTHH:mm:ssZ';
    }

    /**
     * Get/set the default format used by `parse()`. Defaults to `'YYYY-MM-DDTHH:mm:ss.SSSZ'` or {@link #property-defaultFormat-static}
     * (~ISO 8601 Date and time, `'1962-06-17T09:21:34.123Z'`).
     * @member {String} defaultParseFormat
     * @static
     * @memberof module:Core/helper/DateHelper
     */
    set defaultParseFormat(parseFormat) {
        this._defaultParseFormat = parseFormat;
    }

    get defaultParseFormat() {
        return this._defaultParseFormat || this._defaultFormat || 'YYYY-MM-DDTHH:mm:ss.SSSZ';
    }

    get today() {
        return this.clearTime(new Date(), false);
    }

    get tomorrow() {
        return this.add(this.today, 1, 'day');
    }

    get yesterday() {
        return this.add(this.today, -1, 'day');
    }

    /**
     * Returns the current date and time as a `Date` object (with the time-of-day component intact).
     * @returns {Date} Current date and time
     * @internal
     * @static
     * @function now
     * @memberof module:Core/helper/DateHelper
     */
    now() {
        return new Date();
    }

    /**
     * Construct a Date from a Unix epoch timestamp (milliseconds since 1970-01-01 UTC).
     * @param {Number} ms Epoch milliseconds
     * @returns {Date}
     * @internal
     * @static
     * @function fromTime
     * @memberof module:Core/helper/DateHelper
     */
    fromTime(ms) {
        return new Date(ms);
    }

    /**
     * Returns the Unix epoch timestamp (milliseconds since 1970-01-01 UTC) for the given date.
     * @param {Date} date
     * @returns {Number} Epoch milliseconds
     * @internal
     * @static
     * @function toTime
     * @memberof module:Core/helper/DateHelper
     */
    toTime(date) {
        return date.getTime();
    }

    /**
     * Returns the zero-based day of the week for the given date (0 = Sunday … 6 = Saturday).
     * @param {Date} date
     * @returns {Number} Day of week (0–6)
     * @internal
     * @static
     * @function dayOfWeek
     * @memberof module:Core/helper/DateHelper
     */
    dayOfWeek(date) {
        return this.getDay(date);
    }

    buildParser(format) {
        // Split input format by regexp, which includes predefined patterns. Normally format would have some
        // splitters, like 'YYYY-MM-DD' or 'D/M YYYY' so output will contain matched patterns as well as splitters
        // which would serve as anchors. E.g. provided format is 'D/M!YYYY' and input is `11/6!2019` algorithm would work like:
        // 1. split format by regexp                // ['', 'D', '/', 'M', '!', 'YYYY', '']
        // 2. find splitters                        // ['/', '!']
        // 3. split input by seps, step by step     // ['11', ['6', ['2019']]]

        // Inputs like 'YYYYY' (5*Y) means 'YYYY' + 'Y', because it matches patterns from longer to shorter,
        // but if few patterns describe same unit the last one is applied, for example
        // this.parse('20182015', 'YYYYY') equals to new Date(2015, 0, 0)

        const
            parts  = format.split(parserRegexp),
            parser = [];

        // if length of the parts array is 1 - there are no regexps in the input string. thus - no parsers
        // do same if there are patterns matching locale strings (l, ll, LLLL etc.)
        // returning empty array to use new Date() as parser
        if (parts.length === 1 || localeStrRegExp.test(format)) {
            return [];
        }
        else {
            parts.reduce((prev, curr, index, array) => {

                // ignore first and last empty string
                if (index !== 0 || curr !== '') {

                    // if current element matches parser regexp store it as a parser
                    if (parserRegexp.test(curr)) {
                        const
                            localeParsers = DateHelper.localize('L{parsers}') || {},
                            fn            = localeParsers[curr] || parsers[curr];

                        // Z should be last element in the string that matches regexp. Last array element is always either
                        // an empty string (if format ends with Z) or splitter (everything that doesn't match regexp after Z)
                        // If there is a pattern after Z, then Z index will be lower than length - 2
                        if (curr === 'Z' && index < array.length - 2) {
                            throw new Error(`Invalid format ${format} TimeZone (Z) must be last token`);
                        }

                        const parserObj = (typeof fn === 'function') || (typeof fn === 'string')
                            ? fn
                            : fn.parser();

                        // If fn is a string, we found an alias (L, LLL, l etc.).
                        // Need to build parsers from mapped format and merge with existing
                        if (typeof parserObj === 'string') {

                            // we are going to merge nested parsers with current, some cleanup required:
                            // 1. last element is no longer last
                            // 2. need to pass last parser to the next step
                            const
                                nestedParsers = this.buildParser(parserObj),
                                lastItem      = nestedParsers.pop();
                            delete lastItem.last;

                            // elevate nested parsers
                            parser.push(...nestedParsers);

                            prev = lastItem;
                        }
                        else {
                            prev.pattern = curr;
                            prev.fn      = parserObj;
                        }

                    }
                    // if it doesn't match - we've found a splitter
                    else {
                        prev.splitter = curr;
                        prev.escapedSplitter = StringHelper.escapeRegExp(curr);
                        prev.canUseUnstrictSplitter = splitRegExp.test(curr);
                        parser.push(prev);
                        prev = {};
                    }
                }
                else if (Object.prototype.hasOwnProperty.call(prev, 'pattern')) {
                    parser.push(prev);
                }
                return prev;
            }, {});
        }

        parser[parser.length - 1].last = true;

        // Cache if the format includes time zone information, to not have to determine for each date parsed
        parser.parseTimeZone = timeZoneFormatRe.test(format);

        return parser;
    }

    // The cache-key time bucket size in ms. Smaller divisors mean finer cache granularity. In time zones with
    // odd offsets (e.g. Nepal +5:45) the divisor must be small enough that a bucket cannot span a day boundary.
    // Overridden by `DateHelperTZ` to use a fixed 1-minute granularity that works for any IANA zone.
    get keyDivisor() {
        return keyDivisor;
    }

    /**
     * A utility function to create a sortable string key for the passed date or ms timestamp using the `'YYYY-MM-DD'`
     * format.
     * @param {Number|Date} ms The Date instance or ms timestamp to generate a key for
     * @returns {String} Date/timestamp as a string with `'YYYY-M-D'` format
     * @internal
     * @static
     * @function makeKey
     * @memberof module:Core/helper/DateHelper
     */
    makeKey(input) {
        // If a ten character string passed, assume it's already a key
        if (input.length === 10) {
            return input;
        }

        // Number → shared local-time `tempDate`. Object inputs (Date / TZDateView) read fields directly,
        // so a tz-aware view yields tz-aware key components without any branching here.
        let view = input;
        if (typeof input === 'number') {
            tempDate.setTime(input);
            view = tempDate;
        }

        // Cache holds msTrunc -> YYYY-MM-DD, partitioned by timezone via the view's `timeZone` field.
        const
            tzCache  = getKeyCache(view),
            cacheKey = Math.trunc(view.getTime() / this.keyDivisor),
            cached   = tzCache[cacheKey];

        if (cached) {
            return cached;
        }

        const
            year  = view.getFullYear(),
            month = view.getMonth() + 1,
            date  = view.getDate();

        // Not using DateHelper.format to save some cycles, hit a lot
        return tzCache[cacheKey] = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;
    }

    /**
     * A utility function to parse a sortable string to a date using the `'YYYY-MM-DD'` format.
     *
     * This is the format used by the date keys which the Calendar passes to a load request as its `startDate` and
     * `endDate` params, so it is the correct way to parse those values in a backend or a mocked request.
     * @param {String} key The string to return a date for
     * @returns {Date} new Date instance
     * @category Parse & format
     * @static
     * @function parseKey
     * @memberof module:Core/helper/DateHelper
     */
    parseKey(key) {
        const
            bc = key?.[0] === '-',
            date = this.parse(bc ? key.slice(1) : key, 'YYYY-MM-DD');

        bc && date.setFullYear(-date.getFullYear());
        return date;
    }

    /**
     * Returns a date created from the supplied string using the specified format. Will try to create even if format
     * is left out, by first using the default format (see {@link #property-defaultFormat-static}, by default
     * `YYYY-MM-DDTHH:mm:ssZ`) and then using `new Date(dateString)`.
     * Supported tokens:
     *
     * | Unit        | Token      | Description                                      |
     * |-------------|-----------|--------------------------------------------------|
     * | Year        | YYYY      | 4-digits year, like: 2018                        |
     * |             | Y         | numeric, any number of digits                    |
     * |             | YY        | < 68 -> 2000, > 68 -> 1900                       |
     * | Month       | MM        | 01 - 12                                          |
     * | Month       | MMM       | Short name of the month                          |
     * | Date        | DD, D     | 01 - 31                                          |
     * | Hour        | HH, hh, h | 00 - 23 or 1 - 12                                |
     * | Minute      | mm, m     | 00 - 59                                          |
     * | Second      | ss, s     | 00 - 59                                          |
     * | Millisecond | S         | 0 - 9 [000, 100, 200 .. 900 ]                    |
     * |             | SS        | 00 - 99 [000, 010, 020 .. 990 ]                  |
     * |             | SSS       | 000 - 999 [000, 001, 002 .. 999 ]                |
     * | AM/PM       | A         | AM or PM                                         |
     * |             | a         | am or pm                                         |
     * | TimeZone    | Z         | Z for UTC or +-HH:mm. Local timezone if left out |
     * | Predefined  | L         | Long date, MM/DD/YYYY                            |
     * |             | LT        | Long time, HH:mm A                               |
     *
     * Predefined formats and functions used to parse tokens can be localized, see for example the swedish locale
     * `SvSE.js`.
     *
     * NOTE: If no date parameters are provided then `Jan 01 2020` is used as a default date.
     *
     * {@note}Note that date strings without timezone information ('Z' or '+-HH:mm') will be in the local timezone. Eg.
     * '2024-05-14' -> local time, '2024-05-14Z' -> UTC{/@note}
     *
     * @param {String} dateString Date string
     * @param {String} [format] Date format (or {@link #property-defaultParseFormat-static} if left out)
     * @returns {Date} new Date instance parsed from the string
     * @category Parse & format
     * @static
     * @function parse
     * @memberof module:Core/helper/DateHelper
     */
    parse(dateString, format = this.defaultParseFormat, strict = false) {
        if (dateString instanceof Date) {
            return dateString;
        }

        if (typeof dateString !== 'string' || !dateString) {
            return null;
        }

        // // For ISO 8601 native is faster, but not very forgiving
        // if (format === defaultFormat) {
        //     const dt = new Date(dateString);
        //     if (!isNaN(dt)) {
        //         return dt;
        //     }
        // }

        const config = {
            year         : null,
            month        : null,
            date         : null,
            hours        : null,
            minutes      : null,
            seconds      : null,
            milliseconds : null
        };

        // Milliseconds parser is the same for S, SS, SSS
        // We search for a string of 'S' characters *not* preceded by an alpha character.
        // So that the formats such as 'LTS' do not get corrupted
        format = format.replace(msRegExp, msReplacer);

        let
            parser      = parserCache[format],
            result      = null,
            timeZoneStr = null;

        if (!parser) {
            parser = parserCache[format] = this.buildParser(format);
        }

        // Since Unicode 15 standard arrived to browsers (Chrome 110+ and FF 109+) they add unicode "thin" space before AM/PM
        // https://icu.unicode.org/download/72
        // Convert unicode spaces to regular for parser
        if (dateString.includes('\u202f')) {
            dateString = dateString.replace(/\s/g, ' ');
        }

        if (parser.parseTimeZone) {
            const timeZoneMatch = dateString.match(timeZoneRegExp);
            if (timeZoneMatch) {
                timeZoneStr = timeZoneMatch[0]; // e.g. "-04:00", "+05:30", or "Z"
                dateString = dateString.slice(0, timeZoneMatch.index);
            }
        }

        // Each parser knows its pattern and splitter. It looks for splitter in the
        // input string, takes first substring and tries to process it. Remaining string
        // is passed to the next parser.
        parser.reduce((dateString, parser) => {
            if (parser.last) {
                dateString = timeZoneStr || dateString;
                Objects.assign(config, parser.fn(dateString));
            }
            else {
                let splitAt;

                // ISO 8601 says that T symbol can be replaced with a space
                if (parser.splitter === 'T' && dateString.indexOf('T') === -1) {
                    splitAt = dateString.indexOf(' ');
                }
                else {
                    let splitter;

                    // Use more forgiving regexp for parsing if strict mode is off
                    if (!strict && parser.canUseUnstrictSplitter) {
                        splitter = splitRegExp;
                    }
                    else {
                        splitter = parser.escapedSplitter;
                    }

                    // If splitter specified find its position, otherwise try to determine pattern length
                    splitAt = splitter !== '' ? dateString.search(splitter) : parser.pattern?.length || -1;
                }

                let part, rest;

                // If splitter is not found in the current string we may be dealing with
                // 1. partial input - in that case we just feed all string to current parser and move on
                // 2. time zone (ssZ - splitter is empty string) and pattern is not specified, see comment below
                // 3. parse milliseconds before Z
                if (splitAt === -1 || ((parser.pattern === 'SSS') && dateString.match(/^\d+Z$/))) {
                    // NOTE: parentheses are required here as + and - signs hold valuable information
                    // with parentheses we get array like ['00','+','01:00'], omitting them we won't get
                    // regexp match in result, loosing information
                    const chunks = dateString.split(/([Z\-+])/);

                    // If splitter is not found in the string, we may be dealing with string that contains info about TZ.
                    // For instance, if format contains Z as last arg which is not separated (normally it is not indeed),
                    // like 'YYYY-MM-DD HH:mm:ssZ', then second to last parser will have string that it cannot just parse, like
                    // '2010-01-01 10:00:00'        -> '00'
                    // '2010-01-01 10:00:00Z'       -> '00Z'
                    // '2010-01-01 10:00:00-01'     -> '00-01'
                    // '2010-01-01 10:00:00+01:30'  -> '00+01:30'
                    // this cannot be processed by date parsers, so we need to process that additionally. So we
                    // split string by symbols that can be found around timezone info: Z,-,+
                    if (chunks.length === 1) {
                        part = dateString;
                        rest = '';
                    }
                    else {
                        part = chunks[0];
                        rest = `${chunks[1]}${chunks[2]}`;
                    }
                }
                else {
                    part = dateString.substring(0, splitAt) || dateString;
                    rest = dateString.substring(splitAt + parser.splitter.length);
                }

                if (parser.fn) {
                    // Run parser and add result to config on successful parse otherwise continue parsing
                    const res = parser.fn(part);
                    if (res) {
                        Objects.assign(config, res);
                    }
                    else {
                        rest = part + rest;
                    }
                }

                return rest;
            }
        }, dateString);

        // If year is specified date has to be greater than 0
        if (config.year && !config.date) {
            config.date = 1;
        }

        if (config.date > 31 || config.month > 12) {
            return null;
        }

        const date = this.create(config, strict, false);

        if (date) {
            result = date;
        }
        // Last resort, try if native parsing can do it (ignoring very short strings)
        else if (!strict && dateString.length > 3) {
            result = new Date(dateString);

            // Limit to years >= 1900
            // (Safari parses '2' -> Jan 0002, while Chrome parses it as Feb 2001)
            if (result.getFullYear() < 1900) {
                result = null;
            }
        }

        return result;
    }

    /**
     * Creates a date from a date definition object. The object can have the following properties:
     * - year
     * - month
     * - date (day in month)
     * - hours
     * - minutes
     * - seconds
     * - milliseconds
     * - amPm : 'am' or 'pm', implies 12-hour clock
     * - timeZone : offset from UTC in minutes
     * @param {Object} definition
     * @param {Number} definition.year
     * @param {Number} [definition.month]
     * @param {Number} [definition.date]
     * @param {Number} [definition.hours]
     * @param {Number} [definition.minutes]
     * @param {Number} [definition.seconds]
     * @param {Number} [definition.milliseconds]
     * @param {Number} [definition.amPm]
     * @param {Number} [definition.timeZone]
     * @returns {Date} new Date instance
     * @category Parse & format
     * @static create
     * @memberof module:Core/helper/DateHelper
     */
    create(definition, strict = false, clone = true) {
        // Shallow clone to not alter input
        const def = clone ? { ...definition } : definition;

        let invalid = isNaN(def.year) || (strict && (isNaN(def.month) || isNaN(def.date))),
            useUTC  = false;

        // Not much validation yet, only considered invalid if all properties are null
        if (!invalid) {
            let allNull = true;

            for (let i = 0; i < dateProperties.length; i++) {
                const property = dateProperties[i];
                if (!(property in def) || isNaN(def[property])) {
                    def[property] = 0;
                }
                else if (allNull) {
                    allNull = def[property] === null;
                }
            }

            invalid = allNull;
        }

        if (invalid) {
            return null;
        }

        if (def.amPm === 'am') {
            def.hours = def.hours % 12;
        }
        else if (def.amPm === 'pm') {
            def.hours = (def.hours % 12) + 12;
        }

        if ('timeZone' in def) {
            useUTC = true;

            def.minutes -= def.timeZone;
        }

        if (strict && (def.year == null || def.month == null || def.date == null)) {
            return null;
        }

        const
            year   = defaultValue(def.year, DEFAULT_YEAR),
            month  = defaultValue(def.month, DEFAULT_MONTH),
            date   = defaultValue(def.date, DEFAULT_DAY),
            hours  = def.hours,
            mins   = def.minutes,
            secs   = def.seconds,
            ms     = def.milliseconds;

        if (useUTC) {
            return new Date(Date.UTC(year, month, date, hours, mins, secs, ms));
        }

        return this._createLocal(year, month, date, hours, mins, secs, ms);
    }

    // Hook for subclass override — base creates a local-time Date.
    _createLocal(year, month, date, hours, mins, secs, ms) {
        return new Date(year, month, date, hours, mins, secs, ms);
    }

    toUTC(date) {
        return new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds(),
            date.getUTCMilliseconds()
        ));
    }

    /**
     * Converts a date to string with the specified format. Formats heavily inspired by https://momentjs.com.
     * Available formats (input used for output below is `new Date(2018,8,9,18,7,8,145)`):
     *
     * | Unit                  | Token | Description & output                  |
     * |-----------------------|-------|---------------------------------------|
     * | Decade                | DC    | 2010s                                 |
     * | Year                  | YYYY  | 2018                                  |
     * |                       | YY    | 18                                    |
     * |                       | Y     | 2018                                  |
     * | Quarter               | Q     | 3                                     |
     * |                       | Qo    | 3rd                                   |
     * | Month                 | MMMM  | September                             |
     * |                       | MMM   | Sep                                   |
     * |                       | MM    | 09                                    |
     * |                       | Mo    | 9th                                   |
     * |                       | M     | 9                                     |
     * | Week (iso)            | WW    | 37 (2 digit, zero padded)             |
     * |                       | Wo    | 37th                                  |
     * |                       | W     | 37                                    |
     * |                       | WWp   | Week 37 (localized prefix, zero pad)  |
     * |                       | Wp    | Week 37 (localized prefix)            |
     * |                       | WWp0  | W37 (localized prefix)                |
     * |                       | Wp0   | W37 (localized prefix)                |
     * | Date                  | DDDD  | Day of year, 3 digits                 |
     * |                       | DDDo  | Day of year, ordinal                  |
     * |                       | DDD   | Day of year                           |
     * |                       | DD    | 09                                    |
     * |                       | Do    | 9th                                   |
     * |                       | D     | 9                                     |
     * | Weekday               | dddd  | Sunday                                |
     * |                       | ddd   | Sun                                   |
     * |                       | dd    | Su                                    |
     * |                       | d1    | S                                     |
     * |                       | do    | 0th                                   |
     * |                       | d     | 0                                     |
     * | Hour                  | HH    | 18 (00 - 23)                          |
     * |                       | H     | 18 (0 - 23)                           |
     * |                       | hh    | 06 (00 - 12)                          |
     * |                       | h     | 6 (0 - 12)                            |
     * |                       | KK    | 19 (01 - 24)                          |
     * |                       | K     | 19 (1 - 24)                           |
     * |                       | kk    | 06 or 18, locale determines           |
     * |                       | k     | 6 or 18, locale determines            |
     * | Minute                | mm    | 07                                    |
     * |                       | m     | 7                                     |
     * | Second                | ss    | 08                                    |
     * |                       | s     | 8                                     |
     * | Millisecond           | S     | 1 (100ms)                             |
     * |                       | SS    | 14 (140ms)                            |
     * |                       | SSS   | 145 (145ms)                           |
     * | AM/PM                 | A     | AM or PM                              |
     * |                       | a     | am or pm                              |
     * | Predefined            | LT    | H: 2-digit (2d), m: 2d                |
     * | (uses browser locale) | LTS   | H: 2d, m: 2d, s : 2d                  |
     * |                       | LST   | Depends on 12 or 24 hour clock        |
     * |                       |       | 12h, H : 1d, m : 0 or 2d              |
     * |                       |       | 24h, H : 2d, m : 2d                   |
     * |                       | L     | Y: numeric (n), M : 2d, D : 2d        |
     * |                       | l     | Y: n, M : n, D : n                    |
     * |                       | LL    | Y: n, M : long (l), D : n             |
     * |                       | ll    | Y: n, M : short (s), D : n            |
     * |                       | LLL   | Y: n, M : l, D : n, H: n, m: 2d       |
     * |                       | lll   | Y: n, M : s, D : n, H: n, m: 2d       |
     * |                       | LLLL  | Y: n, M : l, D : n, H: n, m: 2d, d: l |
     * |                       | llll  | Y: n, M : s, D : n, H: n, m: 2d, d: s |
     *
     * Some examples:
     *
     * ```javascript
     * DateHelper.format(new Date(2019, 7, 16), 'dddd') -> Friday
     * DateHelper.format(new Date(2019, 7, 16, 14, 27), 'HH:mm') --> 14:27
     * DateHelper.format(new Date(2019, 7, 16, 14, 27), 'L HH') --> 2019-07-16 14
     * ```
     *
     * ### Using embedded text inside format string
     * Arbitrary text can be embedded in the format string by wrapping it with {}:
     *
     * ```javascript
     * DateHelper.format(new Date(2019, 7, 16), '{It is }dddd{, yay!}') -> It is Friday, yay!
     * ```
     *
     * @param {Date} date Date
     * @param {String|Function} [format] Desired format (uses `defaultFormat` if left out), or a function
     * which accepts a `Date` and returns the required formatted string.
     * @returns {String} Formatted string
     * @param {Date} [format.date]
     * @category Parse & format
     * @static
     * @function format
     * @memberof module:Core/helper/DateHelper
     */
    format(date, format = this.defaultFormat) {
        // Bail out if no date or invalid date
        if (!date || isNaN(date)) {
            return null;
        }

        if (typeof format === 'function') {
            return format(date);
        }

        let formatter = formatCache[format],
            output    = '';

        if (!formatter) {
            formatter = formatCache[format] = [];

            // Build formatter array with the steps needed to format the date
            for (let i = 0; i < format.length; i++) {
                // Matches a predefined format?
                const
                    formatMatch = format.slice(i).match(formatRegexp),
                    predefined  = formatMatch?.[0];

                if (predefined) {
                    const
                        localeFormats = DateHelper.localize('L{formats}') || {},
                        fn            = localeFormats[predefined] || formats[predefined];
                    formatter.push(fn);
                    i += predefined.length - 1; // NOSONAR
                }
                // Start of text block? Append it
                else if (format[i] === '{') {
                    // Find closing brace
                    const index = format.indexOf('}', i + 1);

                    // No closing brace, grab rest of string
                    if (index === -1) {
                        formatter.push(format.substr(i + 1));
                        i = format.length; // NOSONAR
                    }
                    // Closing brace found
                    else {
                        formatter.push(format.substring(i + 1, index));
                        // Carry on after closing brace
                        i = index; // NOSONAR
                    }
                }
                // Otherwise append to output (for example - / : etc)
                else {
                    formatter.push(format[i]);
                }
            }
        }

        formatter.forEach(step => {
            if (typeof step === 'string') {
                output += step;
            }
            else {
                output += step(date);
            }
        });

        return output;
    }

    /**
     * Formats a range of `dates` using the specified `format`. Because two dates are involved, the `format` specifier
     * uses the tokens `S{}` and `E{}`. The text contained between the `{}` is the {@link #function-format-static format}
     * for the start date or end date, respectively. Text not inside these tokens is retained verbatim.
     *
     * For example:
     *
     * ```javascript
     *  DateHelper.formatRange(dates, 'S{DD MMM YYYY} - E{DD MMM YYYY}');
     * ```
     *
     * The above will format `dates[0]` based on the `S{DD MMM YYYY}` segment and `dates[1]` using `E{DD MMM YYYY}`. The
     * `' - '` between these will remain between the two formatted dates.
     *
     * @param {Date[]} dates An array of start date and end date (`[startDate, endDate]`)
     * @param {String} format The format specifier
     * @returns {String}
     * @static
     * @function formatRange
     * @memberof module:Core/helper/DateHelper
     */
    formatRange(dates, format) {
        return format.replace(rangeFormatPartRe,
            (s, which, fmt) => this.format(dates[(which === 'S') ? 0 : 1], fmt));
    }

    /**
     * Converts the specified amount of desired unit into milliseconds. Can be called by only specifying a unit as the
     * first argument, it then uses `amount = 1`.
     *
     * For example:
     *
     * ```javascript
     * asMilliseconds('hour') == asMilliseconds(1, 'hour')
     * ```
     *
     * @param {Number|String} amount Amount, what of is decided by specifying unit (also takes a unit which implies an amount of 1)
     * @param {DurationUnit|DurationUnitShort} [unit] Time unit (s, hour, months etc.)
     * @returns {Number}
     * @category Parse & format
     * @static
     * @function asMilliseconds
     * @memberof module:Core/helper/DateHelper
     */
    asMilliseconds(amount, unit = null) {
        if (typeof amount === 'string') {
            unit   = amount;
            amount = 1;
        }

        return this.as('millisecond', amount, unit);
    }

    /**
     * Converts the passed Date to an accurate number of months passed since the epoch start.
     * @param {Date} time The Date to find the month value of
     * @returns {Number} The number of months since the system time epoch start. May be a fractional value
     * @static
     * @function asMonths
     * @memberof module:Core/helper/DateHelper
     */
    asMonths(time) {
        const
            monthStart  = new Date(time.getFullYear(), time.getMonth()),
            // Actual length, a month with a DST transition is an hour shorter or longer than its days suggest
            monthLength = new Date(time.getFullYear(), time.getMonth() + 1) - monthStart,
            fraction    = (time - monthStart) / monthLength;

        return time.getYear() * 12 + time.getMonth() + fraction;
    }

    monthsToDate(months) {
        const
            intMonths = Math.floor(months),
            fraction  = months - intMonths,
            result    = new Date(0, intMonths),
            // Actual length, see asMonths()
            msInMonth = new Date(0, intMonths + 1) - result;

        result.setTime(result.getTime() + fraction * msInMonth);
        return result;
    }

    /**
     * Converts a millisecond time delta to a human-readable form. For example `1000 * 60 * 60 * 50`
     * milliseconds would be rendered as `'2 days, 2 hours'`.
     * @param {Number} delta The millisecond delta value
     * @param {Object} [options] Formatting options
     * @param {Boolean} [options.abbrev] Pass `true` to use abbreviated unit names, eg. `'2d, 2h'` for the above example
     * @param {String} [options.precision] The minimum precision unit
     * @param {String} [options.separator] The separator to use between magnitude and unit
     * @param {String} [options.unitSeparator] The separator to use between each duration part, defaults to ", " eg. `'2d, 2h'`
     * @param {Boolean} [options.asString] Pass `false` to return the result as an array, eg ['2d', '2h'] for the above example
     * @returns {String} Formatted string
     * @category Parse & format
     * @static
     * @function formatDelta
     * @memberof module:Core/helper/DateHelper
     */
    formatDelta(delta, options) {
        let abbrev, unitName, unitSeparator = ', ';

        if (typeof options === 'boolean') {
            abbrev = options;
        }
        else if (options) {
            abbrev        = options.abbrev;
            unitSeparator = options.unitSeparator || unitSeparator;
        }

        const
            deltaObj = this.getDelta(delta, options),
            result   = [],
            sep      = options?.separator || (abbrev ? '' : ' ');

        for (unitName in deltaObj) {
            result.push(`${deltaObj[unitName]}${sep}${unitName}`);
        }

        return options?.asString === false ? result : result.join(unitSeparator);
    }

    /**
     * Converts a millisecond time delta to an object structure. For example `1000 * 60 * 60 * 50`
     * milliseconds the result would be as:
     *
     * ```javascript
     * {
     *     day  : 2,
     *     hour : 2
     * }
     * ```
     *
     * @param {Number} delta The millisecond delta value
     * @param {Object} [options] Formatting options
     * @param {Boolean} [options.abbrev] Pass `true` to use abbreviated unit names, eg `{ d: 2, h: 2 }` for the above example
     * @param {DurationUnit} [options.precision] The minimum precision unit
     * @param {Boolean} [options.ignoreLocale] Pass true to return unlocalized unit name. Requires `abbrev` to be false
     * @param {DurationUnit} [options.maxUnit] Name of the maximum unit in the output. e.g. if you pass `day` then you'll get
     * `{ h: 25 }` instead of `{ d: 1, h: 1 }`
     * @returns {Object} The object with the values for each unit
     * @static
     * @function getDelta
     * @memberof module:Core/helper/DateHelper
     */
    getDelta(delta, options) {
        let abbrev, d, done, precision, unitName, maxUnit, ignoreLocale;

        if (typeof options === 'boolean') {
            abbrev = options;
        }
        else if (options) {
            abbrev       = options.abbrev;
            precision    = this.normalizeUnit(options.precision);
            maxUnit      = options.maxUnit;
            ignoreLocale = !abbrev && options.ignoreLocale;
        }

        const
            result  = {},
            getUnit = abbrev ? this.getShortNameOfUnit.bind(this) : this.getLocalizedNameOfUnit.bind(this);

        const units = maxUnit ? deltaUnits.slice(deltaUnits.indexOf(maxUnit)) : deltaUnits;

        // Loop downwards through the magnitude of units from year -> ms
        for (unitName of units) {
            d = this.as(unitName, delta);

            done = precision === unitName;
            d    = Math[done ? 'round' : 'floor'](d);

            // If there's a non-zero integer quantity of this unit, add it to result
            // and subtract from the delta, then go round to next unit down.
            if (d || (done && !result.length)) {
                // <remove-on-release>
                // TODO: 0 is plural in EN but...?
                // </remove-on-release>
                result[ignoreLocale ? unitName : getUnit.call(DH, unitName, d !== 1)] = d;
                delta -= this.as('ms', d, unitName);
            }

            if (done || !delta) {
                break;
            }
        }

        return result;
    }

    /**
     * Converts the specified amount of one unit (`fromUnit`) into an amount of another unit (`toUnit`).
     * @param {DurationUnit|DurationUnitShort} toUnit The name of units to convert to, eg: `'ms'`
     * @param {Number|String|Core.data.Duration} amount The time to convert. Either the magnitude number form, a duration
     * string such as '2d', or a {@link Core.data.Duration} instance, in which case its own unit is used as `fromUnit`
     * @param {DurationUnit|DurationUnitShort} [fromUnit='ms'] If the amount was passed as a number, the units to use to convert from
     * @returns {Number}
     * @category Parse & format
     * @static
     * @function as
     * @memberof module:Core/helper/DateHelper
     */
    as(toUnit, amount, fromUnit = 'ms') {
        // Allow this.as('ms', '2d')
        if (typeof amount === 'string') {
            amount = this.parseDuration(amount);
        }
        // Allow this.as('ms', myDurationObject)
        if (typeof amount === 'object') {
            fromUnit = amount.unit;
            amount   = amount.magnitude;
        }

        if (toUnit === fromUnit || !fromUnit || !toUnit) {
            return amount;
        }

        toUnit   = this.normalizeUnit(toUnit);
        fromUnit = this.normalizeUnit(fromUnit);

        if (toUnit === fromUnit) {
            return amount;
        }
        // validConversions[][] can be negative to signal that conversion is not exact, ignore sign here
        else if (unitChain[fromUnit].magnitude > unitChain[toUnit].magnitude) {
            return amount * Math.abs(validConversions[fromUnit][toUnit]);
        }
        else {
            return amount / Math.abs(validConversions[toUnit][fromUnit]);
        }
    }

    formatContainsHourInfo(format) {
        const
            stripEscapeRe = /(\\.)/g,
            hourInfoRe    = /([HhKkmSsAa]|LT|L{3,}|l{3,})/;

        return hourInfoRe.test(format.replace(stripEscapeRe, ''));
    }

    /**
     * Returns `true` for 24-hour format.
     * @param {String} format Date format
     * @returns {Boolean} `true` for 24-hour format
     * @category Parse & format
     * @static
     * @function is24HourFormat
     * @memberof module:Core/helper/DateHelper
     */
    is24HourFormat(format) {
        return this.format(this.getTime(13, 0, 0), format).includes('13');
    }

    //endregion

    //region Manipulate

    /**
     * Add days, hours etc. to a date. Always clones the date, original will be left unaffected.
     * @param {Date|String} date Original date
     * @param {Number|String|Core.data.Duration|DurationConfig} amount Amount of days, hours etc. or a string representation of a duration
     * as accepted by {@link #function-parseDuration-static} or an object with `{ magnitude, unit }` properties
     * @param {DurationUnitShort} [unit='ms'] Unit for amount
     * @privateparam {Boolean} [clone=true] Pass `false` to affect the original
     * @returns {Date} New calculated date
     * @category Manipulate
     * @static
     * @function add
     * @memberof module:Core/helper/DateHelper
     */
    add(date, amount, unit = 'ms', clone = true) {
        let d;

        if (typeof date === 'string') {
            d = this.parse(date);
        }
        else if (clone) {
            d = new Date(date.getTime());
        }
        else {
            d = date;
        }

        if (typeof amount === 'string') {
            const duration = this.parseDuration(amount);
            amount         = duration.magnitude;
            unit           = duration.unit;
        }
        else if (amount && typeof amount === 'object') {
            unit   = amount.unit;
            amount = amount.magnitude;
        }

        if (!unit || amount === 0) {
            return d;
        }

        unit = this.normalizeUnit(unit);

        // Sub-day units: always pure UTC math, regardless of timezone setting
        switch (unit) {
            case 'millisecond':
                d.setTime(d.getTime() + amount);
                return d;
            case 'second':
                d.setTime(d.getTime() + (amount * 1000));
                return d;
            case 'minute':
                d.setTime(d.getTime() + (amount * 60000));
                return d;
            case 'hour':
                d.setTime(d.getTime() + (amount * 3600000));
                return d;
        }

        // Calendar units (day+) — local-time logic
        switch (unit) {
            case 'day':
                // Integer value added, do calendar calculation to correctly handle DST etc.
                if (amount % 1 === 0) {
                    d.setDate(d.getDate() + amount);

                    // When crossing DST in Brazil, we expect hours to end up the same
                    if (d.getHours() === 23 && date.getHours() === 0) {
                        d.setHours(d.getHours() + 1);
                    }
                }
                // No browsers support fractional values for dates any longer, do time based calculation
                else {
                    d.setTime(d.getTime() + (amount * 86400000));
                }
                break;
            case 'week':
                d.setDate(d.getDate() + amount * 7);
                break;
            case 'month': {
                let day = d.getDate();
                if (day > 28) {
                    day = Math.min(day, this.getLastDateOfMonth(this.add(this.getFirstDateOfMonth(d), amount, 'month')).getDate());
                }
                d.setDate(day);
                d.setMonth(d.getMonth() + amount);
                break;
            }
            case 'quarter':
                this.add(d, amount * 3, 'month', false);
                break;
            case 'year':
                this.add(d, amount * 12, 'month', false); // To leverage last day of month logic
                break;
            case 'decade':
                d.setFullYear(d.getFullYear() + amount * 10);
                break;
        }
        return d;
    }

    /**
     * Calculates the difference between two dates, in the specified unit.
     * @param {Date} start First date
     * @param {Date} end Second date
     * @param {DurationUnitShort} [unit='ms'] Unit to calculate difference in
     * @param {Boolean} [fractional=true] Specify false to round result
     * @returns {Number} Difference in the specified unit
     * @category Manipulate
     * @static
     * @function diff
     * @memberof module:Core/helper/DateHelper
     */
    diff(start, end, unit = 'ms', fractional = true) {
        unit = this.normalizeUnit(unit);

        if (!start || !end) {
            return 0;
        }

        let amount;

        // Sub-day units: pure UTC MS math
        switch (unit) {
            case 'hour':
                amount = (end - start) / 3600000;
                return fractional ? amount : Math.round(amount);

            case 'minute':
                amount = (end - start) / 60000;
                return fractional ? amount : Math.round(amount);

            case 'second':
                amount = (end - start) / 1000;
                return fractional ? amount : Math.round(amount);

            case 'millisecond':
                amount = (end - start);
                return fractional ? amount : Math.round(amount);
        }

        // Calendar units — local-time logic
        switch (unit) {
            case 'year':
                amount = this.diff(start, end, 'month') / 12;
                break;

            case 'quarter':
                amount = this.diff(start, end, 'month') / 3;
                break;

            case 'month':
                amount = ((end.getFullYear() - start.getFullYear()) * 12) + (end.getMonth() - start.getMonth());
                if (amount === 0 && fractional) {
                    amount = this.diff(start, end, 'day', fractional) / this.daysInMonth(start);
                }
                break;

            case 'week':
                amount = this.diff(start, end, 'day') / 7;
                break;

            case 'day': {
                const dstDiff = start.getTimezoneOffset() - end.getTimezoneOffset();
                amount        = (end - start + dstDiff * 60 * 1000) / 86400000;
                break;
            }
        }

        return fractional ? amount : Math.round(amount);
    }

    /**
     * Sets the date to the start of the specified unit, by default returning a clone of the date instead of changing it
     * in place.
     * @param {Date} date Original date
     * @param {DurationUnit} [unit='day'] Start of this unit, `'day'`, `'month'` etc
     * @param {Boolean} [clone=true] Manipulate a copy of the date
     * @param {Number} [weekStartDay] The first day of week, `0-6` (Sunday-Saturday). Defaults to the {@link #property-weekStartDay-static}
     * @returns {Date} Manipulated date
     * @category Manipulate
     * @static
     * @function startOf
     * @memberof module:Core/helper/DateHelper
     */
    startOf(date, unit = 'day', clone = true, weekStartDay = this.weekStartDay) {
        if (!date) {
            return null;
        }

        unit = this.normalizeUnit(unit);

        if (clone) {
            date = this.clone(date);
        }

        // Local-time logic
        switch (unit) {
            case 'year':
                date.setMonth(0, 1);
                date.setHours(0, 0, 0, 0);
                return date;
            case 'quarter':
                date.setMonth((this.get(date, 'quarter') - 1) * 3, 1);
                date.setHours(0, 0, 0, 0);
                return date;
            case 'month':
                date.setDate(1);
                date.setHours(0, 0, 0, 0);
                return date;
            case 'week': {
                const dayOfWeek = date.getDay();
                let delta = dayOfWeek - weekStartDay;
                // If current day is before weekStartDay then go back to previous week
                if (delta < 0) {
                    delta += 7;
                }
                date.setDate(date.getDate() - delta);
                date.setHours(0, 0, 0, 0);
                return date;
            }
            case 'day':
                date.setHours(0, 0, 0, 0);
                return date;

            // Cant use setMinutes(0, 0, 0) etc. for DST transitions
            case 'hour':
                date.getMinutes() > 0 && date.setMinutes(0);
            // eslint-disable-next-line no-fallthrough
            case 'minute':
                date.getSeconds() > 0 && date.setSeconds(0);
            // eslint-disable-next-line no-fallthrough
            case 'second':
                date.getMilliseconds() > 0 && date.setMilliseconds(0);
            // eslint-disable-next-line no-fallthrough
            case 'millisecond':
                return date;
        }
    }

    /**
     * Returns the end point of the passed date, that is 00:00:00 of the day after the passed date.
     * @param {Date} date The date to return the end point of
     * @returns {Date} Manipulated date
     * @static
     * @function endOf
     * @memberof module:Core/helper/DateHelper
     */
    endOf(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    }

    /**
     * Creates a clone of the specified date
     * @param {Date} date Original date
     * @returns {Date} Cloned date
     * @category Manipulate
     * @static
     * @function clone
     * @memberof module:Core/helper/DateHelper
     */
    clone(date) {
        return new Date(date.getTime());
    }

    /**
     * Removes time from a date (same as calling {@link #function-startOf-static startOf(date)}).
     * @param {Date} date Date to remove time from
     * @param {Boolean} [clone=true] Manipulate a copy of the date
     * @returns {Date} Manipulated date
     * @category Manipulate
     * @static
     * @function clearTime
     * @memberof module:Core/helper/DateHelper
     */
    clearTime(date, clone = true) {
        if (!date) {
            return null;
        }

        if (clone) {
            date = new Date(date.getTime());
        }

        date.setHours(0, 0, 0, 0);

        return date;
    }

    midnight(date, inclusive) {
        let ret = this.clearTime(date);

        if (inclusive && ret < date) {
            ret = this.add(ret, 1, 'd');
        }

        return ret;
    }

    isMidnight(date) {
        return this.midnight(date).getTime() === date.getTime();
    }

    /**
     * Returns the elapsed milliseconds from the start of the specified date.
     * @param {Date} date Date to remove date from
     * @param {DurationUnitShort} [unit='ms'] The time unit to return
     * @returns {Number} The elapsed milliseconds from the start of the specified date
     * @category Manipulate
     * @static
     * @function getTimeOfDay
     * @memberof module:Core/helper/DateHelper
     */
    getTimeOfDay(date, unit = 'ms') {
        const
            hour        = this.getHours(date),
            minute      = this.getMinutes(date),
            second      = this.getSeconds(date),
            millisecond = this.getMilliseconds(date),
            t           = (hour * validConversions.hour.millisecond) + (minute * validConversions.minute.millisecond) +
                          (second * validConversions.second.millisecond) + millisecond;

        return (unit === 'ms') ? t : this.as(unit, t, 'ms');
    }

    /**
     * Returns the hour of day (0–23) for the given `date` in the currently active timezone
     * @param {Date} date
     * @returns {Number}
     * @category Query
     * @static
     * @function getHours
     * @memberof module:Core/helper/DateHelper
     */
    getHours(date) {
        return date.getHours();
    }

    /**
     * Returns the minute of hour (0–59) for the given `date`.
     * @param {Date} date
     * @returns {Number}
     * @category Query
     * @static
     * @function getMinutes
     * @memberof module:Core/helper/DateHelper
     */
    getMinutes(date) {
        return date.getMinutes();
    }

    /**
     * Returns the second of minute (0–59) for the given `date`.
     * @param {Date} date
     * @returns {Number}
     * @category Query
     * @static
     * @function getSeconds
     * @memberof module:Core/helper/DateHelper
     */
    getSeconds(date) {
        return date.getSeconds();
    }

    /**
     * Returns the milliseconds-of-second for the given `date`.
     * @param {Date} date
     * @returns {Number}
     * @category Query
     * @static
     * @function getMilliseconds
     * @memberof module:Core/helper/DateHelper
     */
    getMilliseconds(date) {
        return date.getMilliseconds();
    }

    /**
     * Returns the day of week (0=Sun … 6=Sat) for the given `date`.
     * @param {Date} date
     * @returns {Number}
     * @category Query
     * @static
     * @function getDay
     * @memberof module:Core/helper/DateHelper
     */
    getDay(date) {
        return date.getDay();
    }

    /**
     * Returns the day of month (1–31) for the given `date`.
     * @param {Date} date
     * @returns {Number}
     * @category Query
     * @static
     * @function getDate
     * @memberof module:Core/helper/DateHelper
     */
    getDate(date) {
        return date.getDate();
    }

    /**
     * Returns the month (0–11) for the given `date`.
     * @param {Date} date
     * @returns {Number}
     * @category Query
     * @static
     * @function getMonth
     * @memberof module:Core/helper/DateHelper
     */
    getMonth(date) {
        return date.getMonth();
    }

    /**
     * Returns the full year for the given `date`.
     * @param {Date} date
     * @returns {Number}
     * @category Query
     * @static
     * @function getFullYear
     * @memberof module:Core/helper/DateHelper
     */
    getFullYear(date) {
        return date.getFullYear();
    }

    /**
     * Sets a part of a date (in place).
     * @param {Date} date Date to manipulate
     * @param {String|Object} unit Part of date to set, for example `'minute'`. Or an object like `{ second: 1, minute: 1 }`
     * @param {Number} amount Value to set
     * @returns {Date} Passed date instance modified according to the arguments
     * @category Manipulate
     * @static
     * @function set
     * @memberof module:Core/helper/DateHelper
     */
    set(date, unit, amount) {
        if (!unit) {
            return date;
        }

        if (typeof unit === 'string') {
            unit = this.normalizeUnit(unit);
            switch (unit) {
                case 'millisecond':
                    // Setting value to 0 when it is 0 at DST crossing messes it up
                    if (amount !== 0 || date.getMilliseconds() > 0) {
                        date.setMilliseconds(amount);
                    }
                    break;
                case 'second':
                    if (amount !== 0 || date.getSeconds() > 0) {
                        date.setSeconds(amount);
                    }
                    break;
                case 'minute':
                    if (amount !== 0 || date.getMinutes() > 0) {
                        date.setMinutes(amount);
                    }
                    break;
                case 'hour':
                    date.setHours(amount);
                    break;
                case 'day':
                case 'date':
                    date.setDate(amount);
                    break;
                case 'week':
                    throw new Error('week not implemented');
                case 'month':
                    date.setMonth(amount);
                    break;
                case 'quarter':
                    // Setting quarter = first day of first month of that quarter
                    date.setDate(1);
                    date.setMonth((amount - 1) * 3);
                    break;
                case 'year':
                    date.setFullYear(amount);
                    break;
            }
        }
        else {
            Object.entries(unit)
                // Make sure smallest unit goes first, to not change month before changing day
                .sort((a, b) => {
                    const
                        unitA     = a[0],
                        unitB     = b[0],
                        // "date" is called "day" in unitChain
                        unitAData = unitChain[unitA === 'date' ? 'day' : unitA],
                        unitBData = unitChain[unitB === 'date' ? 'day' : unitB];

                    return unitAData.magnitude - unitBData.magnitude;
                })
                .forEach(([unit, amount]) => {
                    this.set(date, unit, amount);
                });
        }

        return date;
    }

    setDateToMidday(date, clone = true) {
        return this.set(this.clearTime(date, clone), 'hour', 12);
    }

    /**
     * Constrains the date within a min and a max date.
     * @param {Date} date The date to constrain
     * @param {Date} [min] Min date
     * @param {Date} [max] Max date
     * @returns {Date} The constrained date
     * @category Manipulate
     * @static
     * @function constrain
     * @memberof module:Core/helper/DateHelper
     */
    constrain(date, min, max) {
        if (min != null) {
            date = this.max(date, min);
        }
        return max == null ? date : this.min(date, max);
    }

    /**
     * Returns time with default year, month, and day (Jan 1, 2020).
     * @param {Number|Date} hours Hours value or the full date to extract the time of
     * @param {Number} [minutes=0] Minutes value
     * @param {Number} [seconds=0] Seconds value
     * @param {Number} [ms=0] Milliseconds value
     * @returns {Date} A new default date with the time extracted from the given date or from the time values provided individually
     * @category Manipulate
     * @static
     * @function getTime
     * @memberof module:Core/helper/DateHelper
     */
    getTime(hours, minutes = 0, seconds = 0, ms = 0) {
        const me = this;

        if (hours instanceof Date) {
            ms      = me.getMilliseconds(hours);
            seconds = me.getSeconds(hours);
            minutes = me.getMinutes(hours);
            hours   = me.getHours(hours);
        }
        return me._createLocal(DEFAULT_YEAR, DEFAULT_MONTH, DEFAULT_DAY, hours, minutes, seconds, ms);
    }

    /**
     * Copies hours, minutes, seconds, milliseconds from one date to another.
     *
     * @param {Date} targetDate The target date
     * @param {Date} sourceDate The source date
     * @returns {Date} The adjusted target date
     * @category Manipulate
     * @static
     * @function copyTimeValues
     * @memberof module:Core/helper/DateHelper
     */
    copyTimeValues(targetDate, sourceDate) {
        targetDate.setHours(sourceDate.getHours());
        targetDate.setMinutes(sourceDate.getMinutes());
        targetDate.setSeconds(sourceDate.getSeconds());
        targetDate.setMilliseconds(sourceDate.getMilliseconds());
        return targetDate;
    }

    /**
     * Combines the hours, minutes, seconds, milliseconds from one date with the year, month, and date of another.
     * The result is returned in a new `Date` instance
     *
     * @param {Date} date The `Date` object providing the day, month, and year components.
     * @param {Date} time The `Date` object providing the hours, minutes, seconds, and milliseconds components.
     * @returns {Date} A new `Date` combining the date from `date` and the time from `time`.
     * @category Manipulate
     * @static
     * @internal
     * @function combineDateAndTime
     * @memberof module:Core/helper/DateHelper
     */
    combineDateAndTime(date, time) {
        return this.copyTimeValues(new Date(date), time);
    }

    //endregion

    //region Comparison

    get isDSTEnabled() {
        const
            year = new Date().getFullYear(),
            jan  = new Date(year, 0, 1),
            jul  = new Date(year, 6, 1);
        return jan.getTimezoneOffset() !== jul.getTimezoneOffset();
    }

    /**
     * Returns the timezone offset in minutes for the given date. When a timezone is configured, returns the offset in
     * the configured timezone. Otherwise returns the local machine's offset via `Date.getTimezoneOffset()`.
     * @param {Date} date
     * @returns {Number} Offset in minutes (positive = west of UTC, like Date.getTimezoneOffset)
     * @category Query
     * @static
     * @function getTimezoneOffset
     * @memberof module:Core/helper/DateHelper
     */
    getTimezoneOffset(date) {
        return date.getTimezoneOffset();
    }

    isDST(date) {
        const
            year = date.getFullYear(),
            jan  = new Date(year, 0, 1),
            jul  = new Date(year, 6, 1);
        return date.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }

    /**
     * Determines if a date is today's date.
     * @param {Date} date The date to check
     * @param {String} [timeZone] The time zone to use for the comparison. If not specified, the local time zone is used.
     * Not available on the Community tier, where dates are always compared in the local time zone:
     *
     * ```javascript
     * // Check if a date is today in the local time zone
     * DateHelper.isToday(new Date());  // true if today
     * // Check if a date is today in a specific time zone
     * DateHelper.isToday(new Date(), 'America/New_York');  // true if today in New York
     * ```
     * @returns {Boolean} `true` if the date is today, otherwise false
     * @category Comparison
     * @static
     * @function isToday
     * @memberof module:Core/helper/DateHelper
     */
    isToday(date, tz) {
        // If an explicit tz parameter is provided, use the old TimeZoneHelper approach for backward compat.
        // If the global timeZone is set, clearTime is already tz-aware.

        return this.isEqual(this.clearTime(date), this.today);
    }

    /**
     * Determines if a date precedes another.
     * @param {Date} first First date
     * @param {Date} second Second date
     * @returns {Boolean} `true` if first precedes second, otherwise false
     * @category Comparison
     * @static
     * @function isBefore
     * @memberof module:Core/helper/DateHelper
     */
    isBefore(first, second) {
        return first < second;
    }

    /**
     * Determines if a date succeeds another.
     * @param {Date} first First date
     * @param {Date} second Second date
     * @returns {Boolean} `true` if first succeeds second, otherwise false
     * @category Comparison
     * @static
     * @function isAfter
     * @memberof module:Core/helper/DateHelper
     */
    isAfter(first, second) {
        return first > second;
    }

    /**
     * Checks if two dates are equal.
     * @param {Date} first First date
     * @param {Date} second Second date
     * @param {DurationUnit} [unit] Unit to calculate difference in. If not given, the comparison will be done up to a millisecond
     * @returns {Boolean} `true` if the dates are equal
     * @category Comparison
     * @static
     * @function isEqual
     * @memberof module:Core/helper/DateHelper
     */
    isEqual(first, second, unit = null) {
        if (unit === null) {
            // https://jsbench.me/3jk2bom2r3/1
            // https://jsbench.me/ltkb3vk0ji/1 (more flavors) - getTime is >2x faster vs valueOf/Number/op+
            return first && second && first.getTime() === second.getTime();
        }

        return this.startOf(first, unit) - this.startOf(second, unit) === 0;
    }

    /**
     * Compares two dates using the specified precision.
     * @param {Date} first First date
     * @param {Date} second Second date
     * @param {DurationUnit} [unit] Unit to calculate difference in. If not given, the comparison will be done up to a millisecond
     * @returns {Number} `0` = equal, `-1` = first before second, `1` = first after second
     * @category Comparison
     * @static
     * @function compare
     * @memberof module:Core/helper/DateHelper
     */
    compare(first, second, unit = null) {
        // Unit specified, cut the rest out
        if (unit) {
            first  = this.startOf(first, unit);
            second = this.startOf(second, unit);
        }

        // Comparison on ms level
        if (first < second) return -1;
        if (first > second) return 1;
        return 0;
    }

    /**
     * Coerces the passed Date between the passed minimum and maximum values.
     * @param {Date|Number|null|undefined} date The date to clamp between the `min` and `max`, either a Date or a ms
     * timestamp. `null` and `undefined` are returned as passed
     * @param {Date} min The minimum Date
     * @param {Date} max The maximum Date
     * @returns {Date|null|undefined} If the passed `date` is valid, a *new* Date object which is clamped between the
     * `min` and `max`. `null` or `undefined` if that was passed, and `undefined` if the passed `date` is invalid
     * @static
     * @function clamp
     * @memberof module:Core/helper/DateHelper
     */
    clamp(date, min, max) {
        // Nullish passes through. Loose == is deliberate, since `!date` would also trap 0 and '': 0 is a valid ms
        // timestamp which must still clamp, and '' is out of contract, https://github.com/bryntum/bryntum/issues/13590
        // Must precede the isNaN check below, which null would pass since Number(null) === 0
        if (date == null) {
            return date;
        }
        if (!isNaN(date)) {
            if (min != null) {
                date = Math.max(date, min);
            }
            if (max != null) {
                date = Math.min(date, max);
            }
            return new Date(date);
        }
    }

    isSameDate(first, second) {
        return this.compare(first, second, 'd') === 0;
    }

    isSameTime(first, second) {
        return first.getHours() === second.getHours() &&
            first.getMinutes() === second.getMinutes() &&
            first.getSeconds() === second.getSeconds() &&
            first.getMilliseconds() === second.getMilliseconds();
    }

    /**
     * Checks if date is the start of specified unit.
     * @param {Date} date Date
     * @param {DurationUnit} unit Time unit
     * @returns {Boolean} `true` if date is the start of specified unit
     * @category Comparison
     * @static
     * @function isStartOf
     * @memberof module:Core/helper/DateHelper
     */
    isStartOf(date, unit) {
        return this.isEqual(date, this.startOf(date, unit));
    }

    /**
     * Checks if this date is `>= start` and `< end`.
     * @param {Date} date The source date
     * @param {Date} start Start date
     * @param {Date} end End date
     * @returns {Boolean} `true` if this date falls on or between the given start and end dates
     * @category Comparison
     * @static
     * @function betweenLesser
     * @memberof module:Core/helper/DateHelper
     */
    betweenLesser(date, start, end) {
        //return start <= date && date < end;
        return start.getTime() <= date.getTime() && date.getTime() < end.getTime();
    }

    /**
     * Checks if this date is `>= start` and `<= end`.
     * @param {Date} date The source date
     * @param {Date} start Start date
     * @param {Date} end End date
     * @returns {Boolean} `true` if this date falls on or between the given start and end dates
     * @category Comparison
     * @static
     * @function betweenLesserEqual
     * @memberof module:Core/helper/DateHelper
     */
    betweenLesserEqual(date, start, end) {
        return start.getTime() <= date.getTime() && date.getTime() <= end.getTime();
    }

    /**
     * Returns `true` if date ranges intersect.
     * @param {Date} date1Start Start date of first span
     * @param {Date} date1End End date of first span
     * @param {Date} date2Start Start date of second span
     * @param {Date} date2End End date of second span
     * @returns {Boolean} Returns `true` if dates intersect
     * @category Comparison
     * @static
     * @function intersectSpans
     * @memberof module:Core/helper/DateHelper
     */
    intersectSpans(date1Start, date1End, date2Start, date2End) {
        return this.betweenLesser(date1Start, date2Start, date2End) ||
            this.betweenLesser(date2Start, date1Start, date1End);
    }

    /**
     * Compare two units. Returns `1` if first param is a greater unit than second param, `-1` if the opposite is true or `0` if they're equal.
     * @param {DurationUnit} unit1 The 1st unit
     * @param {DurationUnit} unit2 The 2nd unit
     * @returns {Number} Returns `1` if first param is a greater unit than second param, `-1` if the opposite is true or `0` if they're equal
     * @category Comparison
     * @static
     * @function compareUnits
     * @memberof module:Core/helper/DateHelper
     */
    compareUnits(unit1, unit2) {
        const
            unit1Data = unitChain[this.normalizeUnit(unit1)],
            unit2Data = unitChain[this.normalizeUnit(unit2)];

        return Math.sign((unit1Data?.magnitude || 0) - (unit2Data?.magnitude || 0));
    }

    /**
     * Returns `true` if the first time span completely 'covers' the second time span.
     *
     * ```javascript
     * DateHelper.timeSpanContains(
     *     new Date(2010, 1, 2),
     *     new Date(2010, 1, 5),
     *     new Date(2010, 1, 3),
     *     new Date(2010, 1, 4)
     * ) ==> true
     * DateHelper.timeSpanContains(
     *   new Date(2010, 1, 2),
     *   new Date(2010, 1, 5),
     *   new Date(2010, 1, 3),
     *   new Date(2010, 1, 6)
     * ) ==> false
     * ```
     *
     * @param {Date} spanStart The start date for initial time span
     * @param {Date} spanEnd The end date for initial time span
     * @param {Date} otherSpanStart The start date for the 2nd time span
     * @param {Date} otherSpanEnd The end date for the 2nd time span
     * @returns {Boolean} `true` if the first time span completely 'covers' the second time span
     * @category Comparison
     * @static
     * @function timeSpanContains
     * @memberof module:Core/helper/DateHelper
     */
    timeSpanContains(spanStart, spanEnd, otherSpanStart, otherSpanEnd) {
        return (otherSpanStart - spanStart) >= 0 && (spanEnd - otherSpanEnd) >= 0;
    }

    //endregion

    //region Query

    /**
     * Get the local AM indicator string.
     * @member {String} amIndicator
     * @readonly
     * @static
     * @memberof module:Core/helper/DateHelper
     */
    get amIndicator() {
        return amIndicator;
    }

    /**
     * Get the local PM indicator string.
     * @member {String} pmIndicator
     * @readonly
     * @static
     * @memberof module:Core/helper/DateHelper
     */
    get pmIndicator() {
        return pmIndicator;
    }

    /**
     * Get the first day of week, 0-6 (Sunday-Saturday).
     * This is determined by the current locale's `DateHelper.weekStartDay` parameter.
     * @member {Number} weekStartDay
     * @readonly
     * @static
     * @memberof module:Core/helper/DateHelper
     */
    get weekStartDay() {
        // Cache is reset in applyLocale
        if (DH._weekStartDay == null) {
            // Defaults to 0, should not need to happen in real world scenarios when a locale is always loaded
            DH._weekStartDay = DateHelper.localize('L{weekStartDay}') || 0;
        }

        return DH._weekStartDay;
    }

    /**
     * Get non-working days as an object where keys are day indices, 0-6 (Sunday-Saturday), and the value is `true`.
     * This is determined by the current locale's `DateHelper.nonWorkingDays` parameter.
     *
     * For example:
     * ```javascript
     * {
     *     0 : true, // Sunday
     *     6 : true  // Saturday
     * }
     * ```
     *
     * @member {Object<Number,Boolean>} nonWorkingDays
     * @readonly
     * @static
     * @memberof module:Core/helper/DateHelper
     */
    get nonWorkingDays() {
        return { ...DateHelper.localize('L{nonWorkingDays}') };
    }

    /**
     * Get non-working days as an array of day indices, 0-6 (Sunday-Saturday).
     * This is determined by the current locale's `DateHelper.nonWorkingDays` parameter.
     *
     * For example:
     *
     * ```javascript
     * [ 0, 6 ] // Sunday & Saturday
     * ```
     *
     * @member {Number[]} nonWorkingDaysAsArray
     * @readonly
     * @internal
     * @static
     * @memberof module:Core/helper/DateHelper
     */
    get nonWorkingDaysAsArray() {
        // transform string keys to integers
        return Object.keys(this.nonWorkingDays).map(Number);
    }

    /**
     * Get weekend days as an object where keys are day indices, 0-6 (Sunday-Saturday), and the value is `true`.
     * Weekends are days which are declared as weekend days by the selected country and defined by the current locale's
     * `DateHelper.weekends` parameter.
     * To get non-working days see {@link #property-nonWorkingDays-static}.
     *
     * For example:
     * ```javascript
     * {
     *     0 : true, // Sunday
     *     6 : true  // Saturday
     * }
     * ```
     * @member {Object<Number,Boolean>} weekends
     * @readonly
     * @internal
     * @static
     * @memberof module:Core/helper/DateHelper
     */
    get weekends() {
        return { ...DateHelper.localize('L{weekends}') };
    }

    /**
     * Get the specified part of a date.
     * @param {Date} date
     * @param {DurationUnit} unit Part of date, hour, minute etc.
     * @returns {Number} The requested part of the specified date
     * @category Query
     * @static
     * @function get
     * @memberof module:Core/helper/DateHelper
     */
    get(date, unit) {
        unit = this.normalizeUnit(unit);

        // Use tz-overridable accessor methods so DateHelperTZ inherits this for free.
        switch (unit) {
            case 'millisecond':
                return this.getMilliseconds(date);
            case 'second':
                return this.getSeconds(date);
            case 'minute':
                return this.getMinutes(date);
            case 'hour':
                return this.getHours(date);
            case 'date':
            case 'day': // Scheduler has a lot of calculations expecting this to work
                return this.getDate(date);
            case 'week':
                return formats.W(date);
            case 'month':
                return this.getMonth(date);
            case 'quarter':
                return Math.floor(this.getMonth(date) / 3) + 1;
            case 'year':
                return this.getFullYear(date);
        }

        return null;
    }

    /**
     * Get number of days in the current year for the supplied date.
     * @param {Date} date Date to check
     * @returns {Number} Days in year
     * @category Query
     * @internal
     * @static
     * @function daysInYear
     * @memberof module:Core/helper/DateHelper
     */
    daysInYear(date) {
        const
            fullYear = this.getFullYear(date),
            duration = new Date(fullYear + 1, 0, 1) - new Date(fullYear, 0, 1);

        return this.as('day', duration);
    }

    /**
     * Get number of days in the current month for the supplied date.
     * @param {Date} date Date which month should be checked
     * @returns {Number} Days in month
     * @category Query
     * @static
     * @function daysInMonth
     * @memberof module:Core/helper/DateHelper
     */
    daysInMonth(date) {
        return 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
    }

    /**
     * Get number of hours in the current day for the supplied date.
     * @param {Date} date Date to check
     * @returns {Number} Hours in day
     * @category Query
     * @internal
     * @static
     * @function hoursInDay
     * @memberof module:Core/helper/DateHelper
     */
    hoursInDay(date) {
        const
            fullYear = date.getFullYear(),
            month    = date.getMonth(),
            day      = date.getDate(),
            duration = new Date(fullYear, month, day + 1) - new Date(fullYear, month, day);

        return this.as('hour', duration);
    }

    /**
     * Converts unit related to the date to actual amount of milliseconds in it. Takes into account leap years and
     * different duration of months.
     * @param {Date} date Date
     * @param {DurationUnit} unit Time unit
     * @returns {Number} Returns amount of milliseconds
     * @internal
     * @static
     * @function getNormalizedUnitDuration
     * @memberof module:Core/helper/DateHelper
     */
    getNormalizedUnitDuration(date, unit) {
        let result;

        switch (unit) {
            case 'month':
                result = this.asMilliseconds(this.daysInMonth(date), 'day');
                break;
            case 'year':
                result = this.asMilliseconds(this.daysInYear(date), 'day');
                break;
            case 'day':
                result = this.asMilliseconds(this.hoursInDay(date), 'hour');
                break;
            default:
                result = this.asMilliseconds(unit);
        }

        return result;
    }

    /**
     * Get the first date of the month for the supplied date.
     * @param {Date} date Date
     * @returns {Date} New Date instance
     * @category Query
     * @static
     * @function getFirstDateOfMonth
     * @memberof module:Core/helper/DateHelper
     */
    getFirstDateOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    /**
     * Get the last date of the month for the supplied date.
     * @param {Date} date Date
     * @returns {Date} New Date instance
     * @category Query
     * @static
     * @function getLastDateOfMonth
     * @memberof module:Core/helper/DateHelper
     */
    getLastDateOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    /**
     * Get the earliest of two dates.
     * @param {Date} first First date
     * @param {Date} second Second date
     * @returns {Date} Earliest date
     * @category Query
     * @static
     * @function min
     * @memberof module:Core/helper/DateHelper
     */
    min(first, second) {
        return first.getTime() < second.getTime() ? first : second;
    }

    /**
     * Get the latest of two dates.
     * @param {Date} first First date
     * @param {Date} second Second date
     * @returns {Date} Latest date
     * @category Query
     * @static
     * @function max
     * @memberof module:Core/helper/DateHelper
     */
    max(first, second) {
        return first.getTime() > second.getTime() ? first : second;
    }

    /**
     * Get an incremented date. Incrementation based on specified unit and optional amount.
     * @param {Date} date Date
     * @param {DurationUnit} unit Time unit
     * @param {Number} [increment=1] Increment amount
     * @param {Number} [weekStartDay] Will default to what is set in locale
     * @returns {Date} New Date instance
     * @category Query
     * @static
     * @function getNext
     * @memberof module:Core/helper/DateHelper
     */
    getNext(date, unit, increment = 1, weekStartDay = this.weekStartDay) {
        if (unit === 'week') {
            const
                dt  = this.clone(date),
                day = this.getDay(dt);

            this.startOf(dt, 'day', false);
            this.add(dt, weekStartDay - day + 7 * (increment - (weekStartDay <= day ? 0 : 1)), 'day', false);

            // For south american timezones, midnight does not exist on DST transitions, adjust...
            if (this.getDay(dt) !== weekStartDay) {
                this.add(dt, 1, 'hour');
            }

            return dt;
        }

        return this.startOf(this.add(date, increment, unit), unit, false);
    }

    /**
     * Checks if date object is valid.
     *
     * For example:
     *
     * ```javascript
     * date = new Date('foo')
     * date instanceof Date // true
     * date.toString() // Invalid Date
     * isNaN(date) // true
     * DateHelper.isValidDate(date) // false
     *
     * date = new Date()
     * date instanceof Date // true
     * date.toString() // Mon Jan 13 2020 18:27:38 GMT+0300 (GMT+03:00)
     * isNaN(date) // false
     * DateHelper.isValidDate(date) // true
     * ```
     *
     * @param {Date} date Date
     * @returns {Boolean} `true` if date object is valid
     * @static
     * @function isValidDate
     * @memberof module:Core/helper/DateHelper
     */
    isValidDate(date) {
        return this.isDate(date) && !isNaN(date);
    }

    /**
     * Checks if value is a date object. Allows recognizing date object even from another context,
     * like the top frame when used in an iframe.
     *
     * @param {*} value Value to check
     * @returns {Boolean} `true` if value is a date object
     * @static
     * @function isDate
     * @memberof module:Core/helper/DateHelper
     */
    isDate(value) {
        // see https://jsbench.me/s7kb49w83j/1 (cannot use instanceof cross-frame):
        return value && toString.call(value) === DATE_TYPE;
    }

    /**
     * Get the start of the next day.
     * @param {Date} date Date
     * @param {Boolean} [clone=false] Clone date
     * @param {Boolean} [noNeedToClearTime=false] Flag to not clear time from the result
     * @returns {Date} Passed Date or new Date instance, depending on the `clone` flag
     * @category Query
     * @static
     * @function getStartOfNextDay
     * @memberof module:Core/helper/DateHelper
     */
    getStartOfNextDay(date, clone = false, noNeedToClearTime = false) {
        let nextDay = this.add(noNeedToClearTime ? date : this.clearTime(date, clone), 1, 'day');

        // DST case
        if (nextDay.getDate() === date.getDate()) {
            const
                offsetNextDay = this.add(this.clearTime(date, clone), 2, 'day').getTimezoneOffset(),
                offsetDate    = date.getTimezoneOffset();

            nextDay = this.add(nextDay, offsetDate - offsetNextDay, 'minute');
        }

        return nextDay;
    }

    /**
     * Get the end of previous day.
     * @param {Date} date Date
     * @param {Boolean} [noNeedToClearTime=false] Flag to not clear time from the result
     * @returns {Date} New Date instance
     * @category Query
     * @static
     * @function getEndOfPreviousDay
     * @memberof module:Core/helper/DateHelper
     */
    getEndOfPreviousDay(date, noNeedToClearTime = false) {
        const dateOnly = noNeedToClearTime ? date : this.clearTime(date, true);

        // dates are different
        if (dateOnly - date) {
            return dateOnly;
        }
        else {
            return this.add(dateOnly, -1, 'day');
        }
    }

    /**
     * Returns a string describing the specified week. For example, `'39, September 2020'` or `'40, Sep - Oct 2020'`.
     * @param {Date} startDate Start date
     * @param {Date} [endDate] End date
     * @returns {String} String describing the specified week
     * @internal
     * @static
     * @function getWeekDescription
     * @memberof module:Core/helper/DateHelper
     */
    getWeekDescription(startDate, endDate = startDate) {
        const
            monthDesc = startDate.getMonth() === endDate.getMonth()
                ? this.format(startDate, 'MMMM')
                : `${this.format(startDate, 'MMM')} - ${this.format(endDate, 'MMM')}`,
            week      = this.getWeekNumber(startDate);

        return `${week[1]}, ${monthDesc} ${week[0]}`;
    }

    /**
     * Get week number for the date.
     * @param {Date} date The date
     * @param {Number} [weekStartDay] The first day of week, 0-6 (Sunday-Saturday). Defaults to the {@link #property-weekStartDay-static}
     * @returns {Number[]} year and week number
     * @category Query
     * @static
     * @function getWeekNumber
     * @memberof module:Core/helper/DateHelper
     */
    getWeekNumber(date, weekStartDay = this.weekStartDay) {
        const
            jan01     = new Date(date.getFullYear(), 0, 1),
            dec31     = new Date(date.getFullYear(), 11, 31),
            firstDay  = normalizeDay(jan01.getDay() - weekStartDay),
            lastDay   = normalizeDay(dec31.getDay() - weekStartDay),
            dayNumber = getDayDiff(date, jan01);

        let weekNumber;

        // Check if the year starts before the middle of a week
        if (firstDay < 4) {
            weekNumber = Math.floor((dayNumber + firstDay - 1) / 7) + 1;
        }
        else {
            weekNumber = Math.floor((dayNumber + firstDay - 1) / 7);
        }

        if (weekNumber) {
            let year = date.getFullYear();

            // Might be week 1 of next year if the year ends before day 3 (0 based)
            if (weekNumber === 53 && lastDay < 3) {
                year++;
                weekNumber = 1;
            }
            return [year, weekNumber];
        }

        // We're in week zero which is the last week of the previous year, so ask what
        // week encapsulates 31 Dec in the previous year.
        const lastWeekOfLastYear = this.getWeekNumber(new Date(date.getFullYear() - 1, 11, 31))[1];

        return [date.getFullYear() - 1, lastWeekOfLastYear];
    }

    getDateFromISOWeek(isoYear, isoWeek, weekday = 1) {
        const
            simple    = new Date(isoYear, 0, 1 + (isoWeek - 1) * 7),
            dayOfWeek = simple.getDay(),
            isoDay    = dayOfWeek === 0 ? 7 : dayOfWeek, // make Sunday = 7
            diff      = weekday - isoDay;

        simple.setDate(simple.getDate() + diff);

        return simple;
    }

    //endregion

    //region Unit helpers

    /**
     * Turns `(10, 'day')` into `'10 days'` etc.
     * @param {Number} count Amount of unit
     * @param {DurationUnit} unit Unit, will be normalized (days, d -> day etc.)
     * @returns {String} Amount formatted to string
     * @category Unit helpers
     * @static
     * @function formatCount
     * @memberof module:Core/helper/DateHelper
     */
    formatCount(count, unit) {
        unit = this.normalizeUnit(unit);
        if (count !== 1) unit += 's';
        return count + ' ' + unit;
    }

    /**
     * Get the ratio between two units ( year, month -> 1/12 ).
     * @param {DurationUnit} baseUnit Base time unit
     * @param {DurationUnit} unit Time unit
     * @param {Boolean} [acceptEstimate=false] If `true`, process negative values of validConversions
     * @returns {Number} Ratio
     * @category Unit helpers
     * @static
     * @function getUnitToBaseUnitRatio
     * @memberof module:Core/helper/DateHelper
     */
    getUnitToBaseUnitRatio(baseUnit, unit, acceptEstimate = false) {
        baseUnit = this.normalizeUnit(baseUnit);
        unit     = this.normalizeUnit(unit);

        if (baseUnit === unit) return 1;

        // Some validConversions have negative sign to signal that it is not an exact conversion.
        // Ignore those here unless acceptEstimate is provided.
        if (validConversions[baseUnit] && validConversions[baseUnit][unit] && (acceptEstimate || validConversions[baseUnit][unit] > 0)) {
            return 1 / this.as(unit, 1, baseUnit);
        }

        if (validConversions[unit] && validConversions[unit][baseUnit] && (acceptEstimate || validConversions[unit][baseUnit] > 0)) {
            return this.as(baseUnit, 1, unit);
        }

        return -1;
    }

    /**
     * Returns a localized abbreviated form of the name of the duration unit.
     * For example in the `EN` locale, for `'qrt'` it will return `'q'`.
     * @param {DurationUnit} unit Duration unit
     * @returns {String} Localized abbreviated form of the name of the duration unit
     * @category Unit helpers
     * @static
     * @function getShortNameOfUnit
     * @memberof module:Core/helper/DateHelper
     */
    getShortNameOfUnit(unit) {
        // Convert abbreviations to the canonical name.
        // See locale file and the applyLocale method below.
        unit = this.parseTimeUnit(unit);

        // unitLookup is keyed by eg 'DAY', 'day', 'MILLISECOND', 'millisecond' etc
        return DH.unitLookup[unit].abbrev;
    }

    /**
     * Returns a localized full name of the duration unit.
     *
     * For example in the `EN` locale, for `'d'` it will return either
     * `'day'` or `'days'`, depending on the `plural` argument
     *
     * Preserves casing of first letter.
     *
     * @static
     * @param {DurationUnit} unit Time unit
     * @param {Boolean} [plural=false] Whether to return a plural name or singular
     * @returns {String} Localized full name of the duration unit
     * @category Unit helpers
     * @function getLocalizedNameOfUnit
     * @memberof module:Core/helper/DateHelper
     */
    getLocalizedNameOfUnit(unit, plural = false) {
        const capitalize = unit.charAt(0) === unit.charAt(0).toUpperCase();

        // Normalize to not have to have translations for each variation used in code
        unit = this.normalizeUnit(unit);

        // Convert abbreviations to the canonical name.
        // See locale file and the applyLocale method below.
        unit = this.parseTimeUnit(unit);

        // Translate
        // unitLookup is keyed by eg 'DAY', 'day', 'MILLISECOND', 'millisecond' etc
        unit = DH.unitLookup[unit][plural ? 'plural' : 'single'];

        // Preserve casing of first letter
        if (capitalize) {
            unit = StringHelper.capitalize(unit);
        }

        return unit;
    }

    /**
     * Normalizes a unit for easier usage in conditionals. For example `'year'`, `'years'`, `'y'` -> `'year'`.
     * @param {DurationUnit} unit Time unit
     * @returns {String} Normalized unit name
     * @category Unit helpers
     * @static
     * @function normalizeUnit
     * @memberof module:Core/helper/DateHelper
     */
    normalizeUnit(unit) {
        if (!unit) {
            return null;
        }

        const unitLower = unit.toLowerCase();

        if (unitLower === 'date') {
            return unitLower;
        }

        return canonicalUnitNames.includes(unitLower)
            // Already valid
            ? unitLower
            // Trying specified case first, since we have both 'M' for month and 'm' for minute
            : normalizedUnits[unit] || normalizedUnits[unitLower];
    }

    getUnitByName(name) {
        // Allow either a canonical name to be passed, or, if that fails, parse it as a localized name or abbreviation.
        return this.normalizeUnit(name) || this.normalizeUnit(this.parseTimeUnit(name));
    }

    /**
     * Returns a duration of the timeframe in the given unit.
     * @param {Date} start The start date of the timeframe
     * @param {Date} end The end date of the timeframe
     * @param {DurationUnit} unit Duration unit
     * @privateparam {Boolean} [doNotRound]
     * @returns {Number} The duration in the units
     * @category Unit helpers
     * @ignore
     * @static
     * @function getDurationInUnit
     * @memberof module:Core/helper/DateHelper
     */
    getDurationInUnit(start, end, unit, doNotRound) {
        return this.diff(start, end, unit, doNotRound);
    }

    /**
     * Checks if two date units align.
     * @private
     * @param {DurationUnit} majorUnit Major time unit
     * @param {DurationUnit} minorUnit Minor time unit
     * @returns {Boolean} `true` if two date units align
     * @category Unit helpers
     * @static
     * @function doesUnitsAlign
     * @memberof module:Core/helper/DateHelper
     */
    doesUnitsAlign(majorUnit, minorUnit) {
        // <remove-on-release>
        // TODO: probably needs some fleshing out to be generally useful, otherwise move to TimeAxisViewModel?
        //  Maybe also use getUnitToBaseUnitRatio() for assertion?
        // </remove-on-release>
        return !(majorUnit !== minorUnit && minorUnit === 'week');
    }

    getSmallerUnit(unit) {
        unit = this.normalizeUnit(unit);

        const smallerUnitName = unitChain[unit]?.smaller;

        return canonicalUnitNames[unitChain[smallerUnitName]?.magnitude] || null;
    }

    getLargerUnit(unit) {
        unit = this.normalizeUnit(unit);

        const largerUnitName = unitChain[unit]?.greater;

        return canonicalUnitNames[unitChain[largerUnitName]?.magnitude] || null;
    }

    /**
     * Rounds the passed Date value to the nearest `increment` value.
     *
     * Optionally may round relative to a certain base time point.
     *
     * For example `DH.round(new Date('2020-01-01T09:35'), '30 min', new Date('2020-01-01T09:15'))`
     * would round to 9:45 because that's the nearest integer number of 30 minute increments
     * from the base.
     *
     * Note that `base` is ignored when rounding to weeks. The configured {@link #property-weekStartDay-static}
     * dictates what the base of a week is.
     *
     * @param {Date} time The time to round
     * @param {String|Number} increment A millisecond value by which to round the time
     * May be specified in string form eg: `'15 minutes'`
     * @param {Date} [base] The start from which to apply the rounding
     * @param {Number} [weekStartDay] Will default to what is set in locale
     * @returns {Date} New Date instance
     * @static
     * @function round
     * @memberof module:Core/helper/DateHelper
     */
    round(time, increment, base, weekStartDay) {
        return this.snap('round', time, increment, base, weekStartDay);
    }

    /**
     * Floor the passed Date value to the nearest `increment` value.
     *
     * Optionally may floor relative to a certain base time point.
     *
     * For example `DH.floor(new Date('2020-01-01T09:35'), '30 min', new Date('2020-01-01T09:15'))`
     * would floor to 9:15 because that's the closest lower integer number of 30 minute increments
     * from the base.
     *
     * Note that `base` is ignored when flooring to weeks. The configured {@link #property-weekStartDay-static}
     * dictates what the base of a week is.
     *
     * @param {Date} time The time to floor
     * @param {String|Number|DurationConfig|Object} increment A numeric millisecond value by which to floor the time.
     * or a duration in string form eg `'30 min'` or object form : `{unit: 'minute', magnitude: 30}`
     * or `{unit: 'minute', increment: 30}`
     * @param {Date} [base] The start from which to apply the flooring
     * @param {Number} [weekStartDay] Will default to what is set in locale
     * @returns {Date} New Date instance
     * @static
     * @function floor
     * @memberof module:Core/helper/DateHelper
     */
    floor(time, increment, base, weekStartDay) {
        return this.snap('floor', time, increment, base, weekStartDay);
    }

    /**
     * Ceils the passed Date value to the nearest `increment` value.
     *
     * Optionally may ceil relative to a certain base time point.
     *
     * For example `DH.ceil(new Date('2020-01-01T09:35'), '30 min', new Date('2020-01-01T09:15'))`
     * would ceil to 9:45 because that's the closest higher integer number of 30 minute increments
     * from the base.
     *
     * Note that `base` is ignored when ceiling to weeks. Use weekStartDay argument which default to the configured
     * {@link #property-weekStartDay-static} dictates what the base of a week is
     *
     * @param {Date} time The time to ceil
     * @param {String|Number|DurationConfig|Object} increment A numeric millisecond value by which to ceil the time
     * or a duration in string form eg `'30 min'` or object form : `{unit: 'minute', magnitude: 30}`
     * or `{unit: 'minute', increment: 30}`
     * @param {Date} [base] The start from which to apply the ceiling
     * @param {Number} [weekStartDay] Will default to what is set in locale
     * @returns {Date} New Date instance
     * @static
     * @function ceil
     * @memberof module:Core/helper/DateHelper
     */
    ceil(time, increment, base, weekStartDay) {
        return this.snap('ceil', time, increment, base, weekStartDay);
    }

    /**
     * Implementation for round, floor and ceil.
     * @internal
     * @static
     * @function snap
     * @memberof module:Core/helper/DateHelper
     */
    snap(operation, time, increment, base, weekStartDay = this.weekStartDay) {
        const
            me     = this,
            snapFn = snapFns[operation];

        if (typeof increment === 'string') {
            increment = me.parseDuration(increment);
        }
        if (Objects.isObject(increment)) {
            // Allow {unit: 'minute', increment: 30} or {unit: 'minute', magnitude: 30}
            // parseDuration produces 'magnitude'. The Scheduler's TimeAxis uses 'increment'
            // in its resolution object, so we allow that too.
            const magnitude = increment.magnitude || increment.increment;

            // increment is in weeks, months, quarters or years, then it can't be handled
            // using millisecond arithmetic.
            switch (increment.unit) {
                case 'week': {
                    if (!base) {
                        const weekDay = me.getDay(time);

                        // weekStartDay gives our base
                        // Our base is the start of the week
                        base = me.add(
                            me.clearTime(time),
                            weekDay >= weekStartDay ? weekStartDay - weekDay : -(weekDay - weekStartDay + 7),
                            'day'
                        );
                    }

                    return me[operation](time, `${magnitude * 7} days`, base);
                }
                case 'month': {
                    // Express the time as a number of months from epoch start.
                    // May be a fraction, eg the 15th will be 0.5 through a month.
                    time = me.asMonths(time);

                    let resultMonths;

                    // Snap the month count in the way requested
                    if (base) {
                        base = me.asMonths(base);

                        resultMonths = base + snapFn(time - base, magnitude);
                    }
                    else {
                        resultMonths = snapFn(time, magnitude);
                    }

                    // Convert resulting month value back to a date
                    return me.monthsToDate(resultMonths);
                }
                case 'quarter':
                    return me[operation](time, `${magnitude * 3} months`, base);
                case 'year':
                    return me[operation](time, `${magnitude * 12} months`, base);
                case 'decade':
                    // We assume that decades begin with a year divisible by 10
                    return me[operation](time, `${magnitude * 10} years`, base);
            }

            // Convert to a millisecond value
            increment = me.as('ms', magnitude, increment.unit);
        }

        // Local-timezone logic with DST compensation. `this.getTimezoneOffset` resolves to a tz-aware
        // offset for `DateHelperTZ` instances, so the same logic snaps in wall-clock space for either.
        const timeUtcOffset = me.getTimezoneOffset(time) * 1000 * 60;

        if (base) {
            const
                baseUtcOffset = me.getTimezoneOffset(base) * 1000 * 60,
                // Diff is adjusted for any DST changes. This will compensate for rounding errors in the snapFn
                // For example, the calculated diff is smaller than a certain amount of increment, giving the result
                // that a floor operation returns a value 1 increment to small.
                diff          = (time - base) + baseUtcOffset - timeUtcOffset,
                snappedDate   = new Date(base.getTime() + snapFn(diff, increment)),
                dstChange     = baseUtcOffset - (me.getTimezoneOffset(snappedDate) * 1000 * 60);

            // If there is a DST change in our calculated interval, we need to compensate. For example, the snapFn will
            // return a number of ms dividable by the increment. But, if the snappedDate has passed DST (and the base
            // has not), this amount will be too small or too large.
            if (dstChange) {
                me.add(snappedDate, -dstChange, 'ms', false);
            }

            return new Date(snappedDate);
        }
        else {
            // Assuming current TZ is GMT+3
            // new Date(2000, 0, 1) / 86400000      -> 10956.875
            // new Date(2000, 0, 1, 3) / 86400000   -> 10957
            // Before calculation we need to align time value of the current timezone to GMT+0
            // And after calculate we need to adjust time back
            const
                wallClock        = snapFn(time.valueOf() - timeUtcOffset, increment),
                result           = new Date(wallClock + timeUtcOffset),
                // On a DST switch day the snapped value may have another offset than `time`, for example flooring
                // 20:00 CET to the day gives 01:00 CEST. Adjust back by the snapped value's own offset instead, unless
                // that lands in a DST gap (where the offset differs again)
                snappedUtcOffset = me.getTimezoneOffset(result) * 1000 * 60;

            if (snappedUtcOffset !== timeUtcOffset) {
                result.setTime(wallClock + snappedUtcOffset);

                if (me.getTimezoneOffset(result) * 1000 * 60 !== snappedUtcOffset) {
                    result.setTime(wallClock + timeUtcOffset);
                }
            }

            return result;
        }
    }

    //endregion

    //region Date picker format

    /**
     * Parses a typed duration value according to locale rules.
     *
     * The value is taken to be a string consisting of the numeric magnitude and the units:
     * - The numeric magnitude can be either an integer or a float value. Both `','` and `'.'` are valid decimal separators.
     * - The units may be a recognised unit abbreviation of this locale or the full local unit name.
     *
     * For example:
     * `'2d'`, `'2 d'`, `'2 day'`, `'2 days'` will be turned into `{ magnitude : 2, unit : 'day' }`
     * `'2.5d'`, `'2,5 d'`, `'2.5 day'`, `'2,5 days'` will be turned into `{ magnitude : 2.5, unit : 'day' }`
     *
     * **NOTE:** Doesn't work with complex values like `'2 days, 2 hours'`
     *
     * @param {String} value The value to parse
     * @param {Boolean} [allowDecimals=true] Decimals are allowed in the magnitude
     * @param {DurationUnit|String} [defaultUnit] Default unit to use if only magnitude passed
     * @returns {DurationConfig} If successfully parsed, the result contains two properties, `magnitude` being a number, and
     * `unit` being the canonical unit name, *NOT* a localized name. If parsing was unsuccessful, `null` is returned
     * @category Parse & format
     * @static
     * @function parseDuration
     * @memberof module:Core/helper/DateHelper
     */
    parseDuration(value, allowDecimals = true, defaultUnit = null) {
        const
            durationRegEx = allowDecimals ? withDecimalsDurationRegex : noDecimalsDurationRegex,
            match         = durationRegEx.exec(value);

        if (value == null || !match) {
            return null;
        }

        const
            magnitude = parseNumber(match[1]?.replace(',', '.')),
            unit      = this.parseTimeUnit(match[2]) || defaultUnit;

        if (!unit) {
            return null;
        }

        return {
            magnitude,
            unit
        };
    }

    /**
     * Parses a typed unit name, for example `'ms'` or `'hr'` or `'yr'` into the
     * canonical form of the unit name which may be passed to {@link #function-add-static}
     * or {@link #function-diff-static}.
     * @param {DurationUnit|DurationUnitShort|String} unitName Time unit name
     * @category Parse & format
     * @static
     * @function parseTimeUnit
     * @memberof module:Core/helper/DateHelper
     */
    parseTimeUnit(unitName) {
        // NOTE: In case you get a crash here when running tests, it is caused by missing locale. Build locales
        // using `scripts/build.js locales` to resolve.
        // At first, try to match the correct unit object with unitName passed. If it was not found, try to convert to lower case the unit name passed.
        // That's because unit names are case sensitive (i.e. M stands for minutes and m stands for months) but we want to give user
        // the flexibility to find a unit when non lowered unit name is passed (i.e. Day -> day)
        const unitMatch = unitName == null ? null : DH.durationRegEx.exec(unitName) || DH.durationRegEx.exec(unitName.toLowerCase());

        if (!unitMatch) {
            return null;
        }

        // See which group in the unitAbbrRegEx matched match[2]
        for (let unitOrdinal = 0; unitOrdinal < canonicalUnitNames.length; unitOrdinal++) {
            if (unitMatch[unitOrdinal + 1]) {
                return canonicalUnitNames[unitOrdinal];
            }
        }
    }

    //endregion

    //region Internal

    getGMTOffset(date = new Date()) {
        if (!date) {
            return;
        }

        const offsetInMinutes = date.getTimezoneOffset();

        // return 'Z' for UTC
        if (!offsetInMinutes) return 'Z';

        return (offsetInMinutes > 0 ? '-' : '+') +
            Math.abs(Math.trunc(offsetInMinutes / 60)).toString().padStart(2, '0') +
            ':' +
            Math.abs(offsetInMinutes % 60).toString().padStart(2, '0');
    }

    fillDayNames() {
        const
            tempDate      = new Date('2000-01-01T12:00:00'),
            dayNames      = DH._dayNames || [],
            dayShortNames = DH._dayShortNames || [];

        dayNames.length      = 0;
        dayShortNames.length = 0;

        for (let day = 2; day < 9; day++) {
            tempDate.setDate(day);
            dayNames.push(this.format(tempDate, 'dddd'));
            dayShortNames.push(this.format(tempDate, 'ddd'));
        }

        DH._dayNames      = dayNames;
        DH._dayShortNames = dayShortNames;
    }

    getDayNames() {
        return DH._dayNames;
    }

    getDayName(day) {
        return DH._dayNames[day];
    }

    getDayShortNames() {
        return DH._dayShortNames;
    }

    getDayShortName(day) {
        return DH._dayShortNames[day];
    }

    fillMonthNames() {
        const
            tempDate             = new Date('2000-01-15T12:00:00'),
            monthNames           = DH._monthNames || [],
            monthShortNames      = DH._monthShortNames || [],
            monthNamesIndex      = {},
            monthShortNamesIndex = {};

        monthNames.length      = 0;
        monthShortNames.length = 0;

        for (let month = 0; month < 12; month++) {
            tempDate.setMonth(month);

            const monthName = this.format(tempDate, 'MMMM');
            monthNames.push(monthName);

            const monthShortName = this.format(tempDate, 'MMM');
            monthShortNames.push(monthShortName);

            monthNamesIndex[monthName.toLowerCase()]           = { name : monthName, value : month };
            monthShortNamesIndex[monthShortName.toLowerCase()] = { name : monthShortName, value : month };
        }

        DH._monthNames      = monthNames;
        DH._monthShortNames = monthShortNames;

        DH._monthNamesIndex      = monthNamesIndex;
        DH._monthShortNamesIndex = monthShortNamesIndex;
    }

    getMonthShortNames() {
        return DH._monthShortNames;
    }

    getMonthShortName(month) {
        return DH._monthShortNames[month];
    }

    getMonthNames() {
        return DH._monthNames;
    }

    getMonthName(month) {
        return DH._monthNames[month];
    }

    set locale(name) {
        locale             = name;
        intlFormatterCache = {};
        formatCache        = {};
        formatRedirects    = {};
    }

    get locale() {
        return locale;
    }

    setupDurationRegEx(unitNames = [], unitAbbreviations = []) {
        const
            me         = this,
            unitLookup = {};

        let unitAbbrRegEx = '';

        for (let i = 0; i < unitAbbreviations.length; i++) {
            const
                // for example ['s', 'sec']
                abbreviations = unitAbbreviations[i],
                // for example { single : 'second', plural : 'seconds', abbrev : 's' }
                unitNamesCfg  = unitNames[i];

            unitNamesCfg.canonicalUnitName = canonicalUnitNames[i];

            // Create a unitLookup object keyed by unit full names
            // lower, upper and original case to be able to look up plurals or abbreviations
            // also always include english names, since those are used in sources
            unitLookup[unitNamesCfg.single] =
                unitLookup[unitNamesCfg.single.toLowerCase()] =
                    unitLookup[unitNamesCfg.single.toUpperCase()] =
                        unitLookup[unitNamesCfg.canonicalUnitName] =
                            unitLookup[unitNamesCfg.canonicalUnitName.toUpperCase()] = unitNamesCfg;

            unitAbbrRegEx += `${i ? '|' : ''}(`;

            for (let j = 0; j < abbreviations.length; j++) {
                unitAbbrRegEx += `${abbreviations[j]}|`;
            }

            locale = DateHelper.localize('L{locale}') || 'en-US';

            if (locale !== 'en-US') {
                // Add canonical values to be able to parse durations specified in configs
                const canonicalAbbreviations = canonicalUnitAbbreviations[i];

                for (let j = 0; j < canonicalAbbreviations.length; j++) {
                    unitAbbrRegEx += `${canonicalAbbreviations[j]}|`;
                }
            }

            // Include both original and lowercase forms of localized names so that
            // parsing works regardless of input casing (e.g. both "Sekunde" and "sekunde")
            unitAbbrRegEx += `${unitNamesCfg.single}|${unitNamesCfg.single.toLowerCase()}|${unitNamesCfg.plural}|${unitNamesCfg.plural.toLowerCase()}|${unitNamesCfg.canonicalUnitName}|${unitNamesCfg.canonicalUnitName}s)`;
        }

        me.unitLookup    = unitLookup;
        me.durationRegEx = new RegExp(`^(?:${unitAbbrRegEx})$`);
    }

    applyLocale() {
        const
            me                = this,
            unitAbbreviations = DateHelper.localize('L{unitAbbreviations}') || [],
            unitNames         = me.unitNames = DateHelper.localize('L{unitNames}'),
            d                 = new Date(2020, 6, 15, 6),
            tzo               = Math.abs(d.getTimezoneOffset() % 60),
            locale            = DateHelper.localize('L{locale}') || 'en-US',
            localeName        = LocaleManager.locale.localeName;

        // Warn if locale is missing unitNames or unitAbbreviations which are required for duration parsing
        if (!unitNames) {
            console.warn(`Locale '${localeName}' is missing 'unitNames'. Duration parsing will not work correctly without it.`);
        }

        if (!unitAbbreviations.length) {
            console.warn(`Locale '${localeName}' is missing 'unitAbbreviations'. Duration parsing will not work correctly without it.`);
        }

        // This happens when applying an incomplete locale, as done in Localizable.t.js.
        // Invalid usecase, but return to prevent a crash in that test.
        if (unitNames === 'unitNames') {
            return;
        }

        // Capture locale AM/PM strings
        const ampmFormatter = intlFormatterCache.a || (intlFormatterCache.a = new Intl.DateTimeFormat(locale, {
            hour      : 'numeric',
            hourCycle : 'h12'
        }));
        amIndicator = ampmFormatter.formatToParts(d)[2].value;
        pmIndicator = ampmFormatter.formatToParts(new Date(2020, 6, 15, 18))[2].value;

        if (locale === 'en-US') {
            // <remove-on-release>
            // TODO: Include in En locale instead?
            // </remove-on-release>
            ordinalSuffix = enOrdinalSuffix;
        }
        else {
            ordinalSuffix = DateHelper.localize('L{ordinalSuffix}') || ordinalSuffix;
        }

        formatCache        = {};
        formatRedirects    = {};
        parserCache        = {};
        intlFormatterCache = {};
        keyCache           = {};

        // The millizecond key cache has to be granular to the same extent that the timezone offet is.
        // So for example, the Kathmandu timezone is 5:45 ahead of GMT, so makeKey needs to cache the key for
        // every 15 minutes. See makeKey for more info.
        keyDivisor         = (!tzo || tzo > 30 ? 60 - tzo : tzo) * 60000;
        DH._weekStartDay   = null;

        DH.setupDurationRegEx(unitNames, unitAbbreviations);

        // rebuild day/month names cache
        DH.fillDayNames();
        DH.fillMonthNames();
    }

    //endregion
}

// Singleton instance — the actual default export. External code's `DateHelper.format(date)`
// resolves to instance methods on this singleton.
const DH = new DateHelper();
DH.$name = DateHelper.$name;
Helpers.register(DH);

DH.useIntlFormat = useIntlFormat; // to use on tests

/* <remove-on-release> */
// Need to preserve name before locale is applied
// Fixes trial localization example
/* </remove-on-release> */

// Update when changing locale
LocaleManager.ion({
    locale  : 'applyLocale',
    prio    : 1000,
    thisObj : DH
});

// Apply default locale
if (LocaleManager.locale) {
    DH.applyLocale();
}

// Dates are never equal, so raw Set won't work.
class DateSet extends Set {
    get isDateSet() {
        return true;
    }

    add(d) {
        d = DH.makeKey(d);
        if (!this.has(d)) {
            this.generation = (this.generation || 0) + 1;
        }
        return super.add(d);
    }

    delete(d) {
        d = DH.makeKey(d);
        if (this.has(d)) {
            this.generation++;
        }
        return super.delete(d);
    }

    has(d) {
        return super.has(DH.makeKey(d));
    }

    clear() {
        if (this.size) {
            this.generation++;
        }
        return super.clear();
    }

    equals(other) {
        Array.isArray(other) && (other = new DateSet(other));

        return (other.size === this.size) && [...this].every(s => other.has(s));
    }

    get dates() {
        return [...this].sort().map(k => DH.parseKey(k)); // NOSONAR — keys are zero-padded YYYY-MM-DD, so lexicographic sort is already chronological
    }
}

DH.DateSet = DateSet;
/**
 * A static class offering date manipulation, comparison, parsing and formatting helper methods.
 *
 * ## Parsing strings
 * Use `DateHelper.parse()` to parse strings into dates. It accepts a date string and a format specifier.
 * The format specifier is string built up using the following tokens:
 *
 * | Unit        | Token      | Description                                      |
 * |-------------|-----------|--------------------------------------------------|
 * | Year        | YYYY      | 4-digits year, like: 2018                        |
 * |             | Y         | numeric, any number of digits                    |
 * |             | YY        | < 68 -> 2000, > 68 -> 1900                       |
 * | Month       | MM        | 01 - 12                                          |
 * | Month       | MMM       | Short name of the month                          |
 * | Date        | DD, D     | 01 - 31                                          |
 * | Hour        | HH, hh, h | 00 - 23 or 1 - 12                                |
 * | Minute      | mm, m     | 00 - 59                                          |
 * | Second      | ss, s     | 00 - 59                                          |
 * | Millisecond | S         | 0 - 9 [000, 100, 200 .. 900 ]                    |
 * |             | SS        | 00 - 99 [000, 010, 020 .. 990 ]                  |
 * |             | SSS       | 000 - 999 [000, 001, 002 .. 999 ]                |
 * | AM/PM       | A         | AM or PM                                         |
 * |             | a         | am or pm                                         |
 * | TimeZone    | Z         | Z for UTC or +-HH:mm. Local timezone if left out |
 * | Predefined  | L         | Long date, MM/DD/YYYY                            |
 * |             | LT        | Long time, HH:mm A                               |
 *
 * Default parse format is: `'YYYY-MM-DDTHH:mm:ss.SSSZ'` see {@link #property-defaultParseFormat-static}.
 *
 * For example:
 *
 * ```javascript
 * DateHelper.parse('2018-11-06', 'YYYY-MM-DD');
 * DateHelper.parse('13:14', 'HH:mm');
 * DateHelper.parse('6/11/18', 'DD/MM/YY');
 * ```
 *
 * {@note}Note that date strings without timezone information ('Z' or '+-HH:mm') will be in the local timezone. Eg.
 * '2024-05-14' -> local time, '2024-05-14Z' -> UTC{/@note}
 *
 * ## Formatting dates
 * Use `DateHelper.format()` to create a string from a date using a format specifier. The format specifier is similar to
 * that used when parsing strings. It can use the following tokens (input used for output below is
 * `new Date(2018,8,9,18,7,8,145)`):
 *
 * | Unit                  | Token | Description & output                  |
 * |-----------------------|-------|---------------------------------------|
 * | Year                  | YYYY  | 2018                                  |
 * |                       | YY    | 18                                    |
 * |                       | Y     | 2018                                  |
 * | Quarter               | Q     | 3                                     |
 * |                       | Qo    | 3rd                                   |
 * | Month                 | MMMM  | September                             |
 * |                       | MMM   | Sep                                   |
 * |                       | MM    | 09                                    |
 * |                       | Mo    | 9th                                   |
 * |                       | M     | 9                                     |
 * | Week (iso)            | WW    | 37 (2 digit, zero padded)             |
 * |                       | Wo    | 37th                                  |
 * |                       | W     | 37                                    |
 * |                       | WWp   | Week 37 (localized prefix, zero pad)  |
 * |                       | Wp    | Week 37 (localized prefix)            |
 * |                       | WWp0  | W37 (localized prefix)                |
 * |                       | Wp0   | W37 (localized prefix)                |
 * | Date                  | DDDD  | Day of year, 3 digits                 |
 * |                       | DDDo  | Day of year, ordinal                  |
 * |                       | DDD   | Day of year                           |
 * |                       | DD    | 09                                    |
 * |                       | Do    | 9th                                   |
 * |                       | D     | 9                                     |
 * | Weekday               | dddd  | Sunday                                |
 * |                       | ddd   | Sun                                   |
 * |                       | dd    | Su                                    |
 * |                       | d1    | S                                     |
 * |                       | do    | 0th                                   |
 * |                       | d     | 0                                     |
 * | Hour                  | HH    | 18 (00 - 23)                          |
 * |                       | H     | 18 (0 - 23)                           |
 * |                       | hh    | 06 (00 - 12)                          |
 * |                       | h     | 6 (0 - 12)                            |
 * |                       | KK    | 19 (01 - 24)                          |
 * |                       | K     | 19 (1 - 24)                           |
 * |                       | kk    | 06 or 18, locale determines           |
 * |                       | k     | 6 or 18, locale determines            |
 * | Minute                | mm    | 07                                    |
 * |                       | m     | 7                                     |
 * | Second                | ss    | 08                                    |
 * |                       | s     | 8                                     |
 * | Millisecond           | S     | 1 (100ms)                             |
 * |                       | SS    | 14 (140ms)                            |
 * |                       | SSS   | 145 (145ms)                           |
 * | AM/PM                 | A     | AM or PM                              |
 * |                       | a     | am or pm                              |
 * | Predefined            | LT    | H: 2-digit (2d), m: 2d                |
 * | (uses browser locale) | LTS   | H: 2d, m: 2d, s : 2d                  |
 * |                       | LST   | Depends on 12 or 24 hour clock        |
 * |                       |       | 12h, H : 1d, m : 0 or 2d              |
 * |                       |       | 24h, H : 2d, m : 2d                   |
 * |                       | L     | Y: numeric (n), M : 2d, D : 2d        |
 * |                       | l     | Y: n, M : n, D : n                    |
 * |                       | LL    | Y: n, M : long (l), D : n             |
 * |                       | ll    | Y: n, M : short (s), D : n            |
 * |                       | LLL   | Y: n, M : l, D : n, H: n, m: 2d       |
 * |                       | lll   | Y: n, M : s, D : n, H: n, m: 2d       |
 * |                       | LLLL  | Y: n, M : l, D : n, H: n, m: 2d, d: l |
 * |                       | llll  | Y: n, M : s, D : n, H: n, m: 2d, d: s |
 * |                       | u     | YYYYMMDDZ in UTC zone                 |
 * |                       | uu    | YYYYMMDDTHHMMSSZ in UTC zone          |
 *
 * Default format is: `'YYYY-MM-DDTHH:mm:ssZ'` see {@link #property-defaultFormat-static}
 *
 * For example:
 *
 * ```javascript
 * DateHelper.format(new Date(2018,10,6), 'YYYY-MM-DD'); // 2018-11-06
 * DateHelper.format(new Date(2018,10,6), 'M/D/YY'); // 11/6/18
 * ```
 *
 * ### Using embedded text inside format string
 * Arbitrary text can be embedded in the format string by wrapping it with {}:
 *
 * ```javascript
 * DateHelper.format(new Date(2019, 7, 16), '{It is }dddd{, yay!}') -> It is Friday, yay!
 * ```
 *
 * ## Overriding Formatters
 * To override formatters, you need to configure the locale.
 *
 * Here is a sample code snippet demonstrating how to override formatters using a custom locale.
 * ```javascript
 * const customLocale = {
 *     DateHelper : {
 *         formats : {
 *             ll : date => {
 *                 return DateHelper.format(date, 'DD.MM.YYYY');
 *             },
 *             L : date => {
 *                 return DateHelper.format(date, 'DD--MM--YYYY')
 *             },
 *             LT : date => {
 *                 return DateHelper.format(date, 'HH-mm');
 *             },
 *             LTS : date => {
 *                 return DateHelper.format(date, 'HH-mm-ss');
 *             }
 *         }
 *     }
 * };
 *
 * // Extend the English locale with the custom locale
 * LocaleHelper.publishLocale('En', locale);
 * ```
 *
 * Once the custom locale is published, you can use the overridden formatters with `DateHelper.format()`.
 *
 * ```javascript
 * DateHelper.format(new Date(2024, 0, 12, 12, 4, 5), 'll') // Output: 12.01.2024
 * DateHelper.format(new Date(2024, 0, 12, 12, 4, 5), 'L') // Output: 12--01--2024
 * DateHelper.format(new Date(2024, 0, 12, 12, 4, 5), 'LT') // Output: 12-04
 * DateHelper.format(new Date(2024, 0, 12, 12, 4, 5), 'LTS') // Output: 12-04-05
 * ```
 *
 * ## Unit names
 * Many DateHelper functions (for example add, as, set) accepts a unit among their params. The following units are
 * available:
 *
 * | Unit        | Aliases                       |
 * |-------------|-------------------------------|
 * | millisecond | millisecond, milliseconds, ms |
 * | second      | second, seconds, s            |
 * | minute      | minute, minutes, m            |
 * | hour        | hour, hours, h                |
 * | day         | day, days, d                  |
 * | week        | week, weeks, w                |
 * | month       | month, months, mon, mo, M     |
 * | quarter     | quarter, quarters, q          |
 * | year        | year, years, y                |
 * | decade      | decade, decades, dec          |
 *
 * For example:
 * ```javascript
 * DateHelper.add(date, 2, 'days');
 * DateHelper.as('hour', 7200, 'seconds');
 * ```
 *
 * ## Useful functions
 *
 * | Function                             | Description                                   |
 * |--------------------------------------|-----------------------------------------------|
 * | {@link #function-format-static}      | Format a date to a string using tokens         |
 * | {@link #function-parse-static}       | Parse a string into a Date object              |
 * | {@link #function-add-static}         | Add a specified amount of time to a date       |
 * | {@link #function-diff-static}        | Get the difference between two dates           |
 * | {@link #function-as-static}          | Convert between time units                     |
 *
 * ## See also
 *
 * - {@link Core.data.Duration} - Duration model field
 * - {@link Core.widget.DateField} - Date input field
 * - {@link Core.widget.TimeField} - Time input field
 *
 * @class
 */
export default DH;

// Named export of the class itself, for inheritance (e.g. DateHelperTZ).
export { DateHelper, DEFAULT_YEAR, DEFAULT_MONTH, DEFAULT_DAY };
