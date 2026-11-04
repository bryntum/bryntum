import DateHelper from "../../../../Core/helper/DateHelper.js";
import { CalendarIntervalParser } from "../CalendarIntervalParser.js";
import type { ScheduleDefinition } from "../CalendarIntervalParser.js";
import { ScheduleBuilder } from "../ScheduleBuilder.js";

// Cached regular expressions — declared once so we don't recompile per call.
const
    timeSeparator = /(:|am|pm)/,
    leadingDigits = /^\d+/;

/**
 * Schedule text parser mixin. Exposes the static token-regex table, name-lookup table, and
 * `parseText` entry point. The actual recursive-descent walker is kept as a file-local impl
 * class ([[ScheduleTextParserImpl]]) so callers never instantiate it directly.
 *
 * @module Engine/util/calendar_interval_parser/mixin/ScheduleTextParserMixin
 * @mixin
 */
export default <T extends new (...args : any[]) => any>(Target : T) => class ScheduleTextParserMixin extends Target {
    static $name = 'ScheduleTextParserMixin';

    static readonly WHITESPACE = /\s+/;

    /**
     * Token regexes for the human-readable text parser.
     *
     * @see [[CalendarIntervalParser.parseText]]
     * @internal
     */
    static readonly TEXT_TOKENTYPES : Record<string, RegExp> = {
        eof         : /^$/,
        fullDate    : /^(\d\d\d\d-\d\d-\d\d(t\d\d(:\d\d(:\d\d)?)?)?)\b/,
        rank        : /^((\d\d\d\d)|([2-5]?1(st)?|[2-5]?2(nd)?|[2-5]?3(rd)?|(0|[1-5]?[4-9]|[1-5]0|1[1-3])(th)?))\b/,
        time        : /^((([0]?[1-9]|1[0-2]):[0-5]\d(\s)?(am|pm))|(([0]?\d|1\d|2[0-3]):[0-5]\d))\b/,
        dayName     : /^((sun|mon|tue(s)?|wed(nes)?|thu(r(s)?)?|fri|sat(ur)?)(day)?)\b/,
        monthName   : /^(jan(uary)?|feb(ruary)?|ma((r(ch)?)?|y)|apr(il)?|ju(ly|ne)|aug(ust)?|oct(ober)?|(sept|nov|dec)(ember)?)\b/,
        yearIndex   : /^(\d\d\d\d)\b/,
        every       : /^every\b/,
        after       : /^after\b/,
        before      : /^before\b/,
        second      : /^(s|sec(ond)?(s)?)\b/,
        minute      : /^(m|min(ute)?(s)?)\b/,
        hour        : /^(h|hour(s)?)\b/,
        day         : /^(day(s)?( of the month)?)\b/,
        dayInstance : /^day instance\b/,
        dayOfWeek   : /^day(s)? of the week\b/,
        dayOfYear   : /^day(s)? of the year\b/,
        weekOfYear  : /^week(s)?( of the year)?\b/,
        weekOfMonth : /^week(s)? of the month\b/,
        weekday     : /^weekday\b/,
        weekend     : /^weekend\b/,
        month       : /^month(s)?\b/,
        year        : /^year(s)?\b/,
        between     : /^between (the)?\b/,
        start       : /^(start(ing)? (at|on( the)?)?)\b/,
        at          : /^(at|@)\b/,
        and         : /^(,|and\b)/,
        except      : /^(except\b)/,
        also        : /(also)\b/,
        first       : /^(first)\b/,
        last        : /^last\b/,
        in          : /^in\b/,
        of          : /^of\b/,
        onthe       : /^on the\b/,
        on          : /^on\b/,
        through     : /(-|^(to|through)\b)/
    };

    /**
     * Lowercase month/weekday/ordinal → numeric value. Used by the text parser.
     *
     * @see [[CalendarIntervalParser.parseText]]
     * @see [[CalendarIntervalParser.convertTextTokenValue]]
     * @internal
     */
    static readonly TEXT_NAMES : Record<string, number> = {
        jan   : 1, feb   : 2, mar   : 3, apr   : 4, may   : 5, jun   : 6,
        jul   : 7, aug   : 8, sep   : 9, oct   : 10, nov   : 11, dec   : 12,
        sun   : 1, mon   : 2, tue   : 3, wed   : 4, thu   : 5, fri   : 6, sat   : 7,
        "1st" : 1, fir   : 1,
        "2nd" : 2, sec   : 2,
        "3rd" : 3, thi   : 3,
        "4th" : 4, for   : 4
    };

    /**
     * Normalize a matched token's text into the value the schedule builder expects.
     *
     * @param {String} text Raw matched text (already lowercased)
     * @param {RegExp} tokenType Which [[TEXT_TOKENTYPES]] regex matched
     * @returns {Number|String|Date} Converted token value
     * @internal
     */
    static convertTextTokenValue(text : string, tokenType : RegExp) : any {
        const
            TOKENTYPES = this.TEXT_TOKENTYPES,
            NAMES      = this.TEXT_NAMES;
        let output : any = text;

        switch (tokenType) {
            case TOKENTYPES.time: {
                const
                    parts      = text.split(timeSeparator),
                    parsedHour = parts[3] === "pm" && (parts[0] as any) < 12 ? parseInt(parts[0], 10) + 12 : parts[0],
                    hourStr    = String(parsedHour),
                    min        = parts[2].trim();
                output = (hourStr.length === 1 ? "0" : "") + hourStr + ":" + min;
                break;
            }
            case TOKENTYPES.rank:
                output = parseInt(leadingDigits.exec(text)[0], 10);
                break;

            case TOKENTYPES.monthName:
            case TOKENTYPES.dayName:
                output = NAMES[text.substring(0, 3)];
                break;

            case TOKENTYPES.fullDate:
                output = DateHelper.parse(text.toUpperCase());
                break;
        }
        return output;
    }

    /**
     * Parse a human-readable text expression into a schedule definition. Recognized expressions include patterns like
     * `"every 5 minutes"`, `"on Monday, Wednesday, and Friday at 9:00"`, `"on the 1st and 15th day of the month"`, etc.
     * If parsing fails, the returned definition will have `error >= 0` indicating the character position where parsing stopped.
     *
     * @param {String} str Human-readable schedule expression
     * @returns {ScheduleDefinition} Parsed definition with `schedules`, `exceptions`, and `error` fields
     */
    static parseText(str : string) : ScheduleDefinition {
        return new ScheduleTextParserImpl().parse(str);
    }
};

/**
 * Recursive-descent parser for human-readable schedule text expressions. Drives a [[ScheduleBuilder]]
 * to produce a [[ScheduleDefinition]] consumable by [[CalendarIntervalParser.compile]]. Kept file-local
 * so callers always go through [[CalendarIntervalParser.parseText]].
 *
 * @internal
 */
class ScheduleTextParserImpl {
    private pos   : number  = 0;
    private input : string  = "";
    private error : number | undefined;

    // Per-instance aliases for the class-level constants. Let method bodies reach them via
    // `this.TOKENTYPES` / `this.NAMES` instead of re-declaring a local
    // `const TOKENTYPES = CalendarIntervalParser.TEXT_TOKENTYPES` at the top of every method.
    private readonly TOKENTYPES = (CalendarIntervalParser as any).TEXT_TOKENTYPES as Record<string, RegExp>;
    private readonly NAMES      = (CalendarIntervalParser as any).TEXT_NAMES as Record<string, number>;

    /**
     * Parse a schedule expression.
     *
     * @param {String} str Expression (e.g. `"every 5 minutes"`)
     * @returns {ScheduleDefinition}
     */
    parse(str : string) : ScheduleDefinition {
        return this.parseScheduleExpr(str.toLowerCase());
    }

    // region Tokenizer

    /**
     * Build a token record.
     *
     * @param {Number} start
     * @param {Number} end
     * @param {String} text
     * @param {RegExp} [type]
     * @returns {Object}
     */
    private makeToken(start : number, end : number, text : string, type? : RegExp) : any {
        return { startPos : start, endPos : end, text, type };
    }

    /**
     * Look ahead without consuming; returns the best-matching token for `expected`.
     *
     * @param {RegExp|RegExp[]} expected Regex(es) to try
     * @returns {Object} Matched token (or placeholder)
     */
    private peek(expected : RegExp | RegExp[]) : any {
        const
            me         = this,
            WS         = (CalendarIntervalParser as any).WHITESPACE as RegExp,
            scanTokens = (expected instanceof Array ? expected.slice() : [expected]);

        scanTokens.push(WS);
        let token, curInput, m, scanToken, start = me.pos, len;

        while (!token || token.type === WS) {
            len      = -1;
            curInput = me.input.substring(start);
            token    = me.makeToken(start, start, me.input.split(WS)[0]);

            for (let i = 0, length = scanTokens.length; i < length; i++) {
                scanToken = scanTokens[i];
                m = scanToken.exec(curInput);
                if (m && m.index === 0 && m[0].length > len) {
                    len   = m[0].length;
                    token = me.makeToken(start, start + len, curInput.substring(0, len), scanToken);
                }
            }

            if (token.type === WS) {
                start = token.endPos;
            }
        }

        return token;
    }

    /**
     * Consume the next matching token (advances `pos`).
     *
     * @param {RegExp|RegExp[]} expectedToken
     * @returns {Object}
     */
    private scan(expectedToken : RegExp | RegExp[]) : any {
        const token = this.peek(expectedToken);
        this.pos = token.endPos;
        return token;
    }

    // endregion

    // region Parse helpers

    /**
     * Parse an `a-b` range expression (or a single value).
     *
     * @param {RegExp} tokenType
     * @returns {Number[]}
     */
    private parseThroughExpr(tokenType : RegExp) : number[] {
        const
            me    = this,
            start = +me.parseTokenValue(tokenType),
            end   = me.checkAndParse(me.TOKENTYPES.through) ? +me.parseTokenValue(tokenType) : start,
            nums  = [];

        for (let i = start; i <= end; i++) {
            nums.push(i);
        }
        return nums;
    }

    /**
     * Parse one or more comma/and-separated range expressions.
     *
     * @param {RegExp} tokenType
     * @returns {Number[]}
     */
    private parseRanges(tokenType : RegExp) : number[] {
        const
            me   = this,
            nums = me.parseThroughExpr(tokenType);

        while (me.checkAndParse(me.TOKENTYPES.and)) {
            nums.push.apply(nums, me.parseThroughExpr(tokenType));
        }

        // Sort day names for predictable next() results
        if (tokenType === me.TOKENTYPES.dayName) {
            nums.sort((a, b) => a - b);
        }

        return nums;
    }

    /**
     * Parse an `every N <period>` clause onto `builder`.
     *
     * @param {ScheduleBuilder} builder
     */
    private parseEvery(builder : ScheduleBuilder) : void {
        const
            me         = this,
            TOKENTYPES = me.TOKENTYPES,
            NAMES      = me.NAMES;
        let num, period;

        if (me.checkAndParse(TOKENTYPES.weekend)) {
            builder.on(NAMES.sun, NAMES.sat).dayOfWeek();
        }
        else if (me.checkAndParse(TOKENTYPES.weekday)) {
            builder.on(NAMES.mon, NAMES.tue, NAMES.wed, NAMES.thu, NAMES.fri).dayOfWeek();
        }
        else {
            num = me.parseTokenValue(TOKENTYPES.rank);
            builder.every(num);
            period = me.parseTimePeriod(builder);

            if (me.checkAndParse(TOKENTYPES.start)) {
                num = me.parseTokenValue(TOKENTYPES.rank);
                builder.startingOn(num);
                me.parseToken(period.type);
            }
            else if (me.checkAndParse(TOKENTYPES.between)) {
                const start = me.parseTokenValue(TOKENTYPES.rank);
                if (me.checkAndParse(TOKENTYPES.and)) {
                    const end = me.parseTokenValue(TOKENTYPES.rank);
                    builder.between(start, end);
                }
            }
        }
    }

    /**
     * Parse an `on the first / last / Nth` clause onto `builder`.
     *
     * @param {ScheduleBuilder} builder
     */
    private parseOnThe(builder : ScheduleBuilder) : void {
        const
            me         = this,
            TOKENTYPES = me.TOKENTYPES;
        if (me.checkAndParse(TOKENTYPES.first)) {
            builder.first();
        }
        else if (me.checkAndParse(TOKENTYPES.last)) {
            builder.last();
        }
        else {
            builder.on(me.parseRanges(TOKENTYPES.rank));
        }
        me.parseTimePeriod(builder);
    }

    /**
     * Main recursive-descent entry point; drives the builder to completion.
     *
     * @param {String} expression Lowercased expression
     * @returns {ScheduleDefinition}
     */
    private parseScheduleExpr(expression : string) : ScheduleDefinition {
        const
            me         = this,
            TOKENTYPES = me.TOKENTYPES,
            builder    = CalendarIntervalParser.createRecurBuilder();

        me.pos   = 0;
        me.input = expression;
        me.error = -1;

        while (me.pos < me.input.length && me.error < 0) {
            const token = me.parseToken([
                TOKENTYPES.every, TOKENTYPES.after, TOKENTYPES.before,
                TOKENTYPES.onthe, TOKENTYPES.on, TOKENTYPES.of,
                TOKENTYPES["in"], TOKENTYPES.at, TOKENTYPES.and,
                TOKENTYPES.except, TOKENTYPES.also
            ]);

            switch (token.type) {
                case TOKENTYPES.every:
                    me.parseEvery(builder);
                    break;

                case TOKENTYPES.after:
                    if (me.peek(TOKENTYPES.time).type !== undefined) {
                        builder.after(me.parseTokenValue(TOKENTYPES.time));
                        builder.time();
                    }
                    else if (me.peek(TOKENTYPES.fullDate).type !== undefined) {
                        builder.after(me.parseTokenValue(TOKENTYPES.fullDate));
                        builder.fullDate();
                    }
                    else {
                        builder.after(me.parseTokenValue(TOKENTYPES.rank));
                        me.parseTimePeriod(builder);
                    }
                    break;

                case TOKENTYPES.before:
                    if (me.peek(TOKENTYPES.time).type !== undefined) {
                        builder.before(me.parseTokenValue(TOKENTYPES.time));
                        builder.time();
                    }
                    else if (me.peek(TOKENTYPES.fullDate).type !== undefined) {
                        builder.before(me.parseTokenValue(TOKENTYPES.fullDate));
                        builder.fullDate();
                    }
                    else {
                        builder.before(me.parseTokenValue(TOKENTYPES.rank));
                        me.parseTimePeriod(builder);
                    }
                    break;

                case TOKENTYPES.onthe:
                    me.parseOnThe(builder);
                    break;

                case TOKENTYPES.on:
                    builder.on(me.parseRanges(TOKENTYPES.dayName)).dayOfWeek();
                    break;

                case TOKENTYPES.of:
                    builder.on(me.parseRanges(TOKENTYPES.monthName)).month();
                    break;

                case TOKENTYPES["in"]:
                    builder.on(me.parseRanges(TOKENTYPES.yearIndex)).year();
                    break;

                case TOKENTYPES.at:
                    builder.on(me.parseTokenValue(TOKENTYPES.time)).time();
                    while (me.checkAndParse(TOKENTYPES.and)) {
                        builder.on(me.parseTokenValue(TOKENTYPES.time)).time();
                    }
                    break;

                case TOKENTYPES.and:
                    break;

                case TOKENTYPES.also:
                    builder.and();
                    break;

                case TOKENTYPES.except:
                    builder.except();
                    break;

                default:
                    me.error = me.pos;
            }
        }

        return {
            schedules  : builder.schedules,
            exceptions : builder.exceptions,
            error      : me.error
        };
    }

    /**
     * Consume a time-period token (second/minute/hour/day/…) and call the matching builder method.
     *
     * @param {ScheduleBuilder} builder
     * @returns {Object} Matched token
     */
    private parseTimePeriod(builder : ScheduleBuilder) : any {
        const
            me         = this,
            TOKENTYPES = me.TOKENTYPES,
            timePeriod = me.parseToken([
                TOKENTYPES.second, TOKENTYPES.minute, TOKENTYPES.hour,
                TOKENTYPES.dayOfYear, TOKENTYPES.dayOfWeek, TOKENTYPES.dayInstance,
                TOKENTYPES.day, TOKENTYPES.month, TOKENTYPES.year,
                TOKENTYPES.weekOfMonth, TOKENTYPES.weekOfYear
            ]);

        switch (timePeriod.type) {
            case TOKENTYPES.second:
                builder.second();
                break;
            case TOKENTYPES.minute:
                builder.minute();
                break;
            case TOKENTYPES.hour:
                builder.hour();
                break;
            case TOKENTYPES.dayOfYear:
                builder.dayOfYear();
                break;
            case TOKENTYPES.dayOfWeek:
                builder.dayOfWeek();
                break;
            case TOKENTYPES.dayInstance:
                builder.dayOfWeekCount();
                break;
            case TOKENTYPES.day:
                builder.dayOfMonth();
                break;
            case TOKENTYPES.weekOfMonth:
                builder.weekOfMonth();
                break;
            case TOKENTYPES.weekOfYear:
                builder.weekOfYear();
                break;
            case TOKENTYPES.month:
                builder.month();
                break;
            case TOKENTYPES.year:
                builder.year();
                break;
            default:
                me.error = me.pos;
        }

        return timePeriod;
    }

    /**
     * If `tokenType` matches at the current position, consume it.
     *
     * @param {RegExp} tokenType
     * @returns {Boolean} `true` when consumed
     */
    private checkAndParse(tokenType : RegExp) : boolean {
        const found = this.peek(tokenType).type === tokenType;
        if (found) {
            this.scan(tokenType);
        }
        return found;
    }

    /**
     * Scan the next token and normalize its text via [[CalendarIntervalParser.convertTextTokenValue]].
     *
     * Intentional: pass the outer `tokenType` through (possibly an array).
     * `convertTextTokenValue` only converts when `tokenType` is a known single regex;
     * arrays fall through returning the text unchanged — correct for dispatch-style calls.
     *
     * @param {RegExp|RegExp[]} tokenType
     * @returns {Object} Matched token with normalized `text`
     */
    private parseToken(tokenType : RegExp | RegExp[]) : any {
        const tok = this.scan(tokenType);
        if (tok.type) {
            tok.text = (CalendarIntervalParser as any).convertTextTokenValue(tok.text, tokenType as RegExp);
        }
        else {
            this.error = this.pos;
        }
        return tok;
    }

    /**
     * Shorthand for `this.parseToken(tokenType).text`.
     *
     * @param {RegExp|RegExp[]} tokenType
     * @returns {*} Converted token value
     */
    private parseTokenValue(tokenType : RegExp | RegExp[]) : any {
        return this.parseToken(tokenType).text;
    }

    // endregion
}
