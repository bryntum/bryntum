import DateHelper from "../../../Core/helper/DateHelper.js";
import type { ScheduleConstraint } from "./CalendarIntervalParser.js";

/**
 * Fluent recurrence builder backing [[CalendarIntervalParser.recur]]. Chain constraint methods
 * (`.on()`, `.every()`, `.after()`, `.before()`) followed by a time-period method (`.second()`,
 * `.minute()`, `.hour()`, `.dayOfMonth()`, `.dayOfWeek()`, `.month()`, `.year()`, etc.) to build
 * up a definition. The resulting builder exposes `.schedules` and `.exceptions` arrays consumable
 * directly as a `ScheduleDefinition` by [[CalendarIntervalParser.compile]].
 *
 * @module Engine/util/calendar_interval_parser/ScheduleBuilder
 */
export class ScheduleBuilder {
    schedules  : ScheduleConstraint[] = [];
    exceptions : ScheduleConstraint[] = [];

    private cur       : any;
    private curArr    : ScheduleConstraint[];
    private curName   : number[];
    private values    : any;
    private increment : number;
    private modifier  : string;
    private applyMin  : number;
    private applyMax  : number;
    private lastAdded : { n : string, x : number, c : number, m : number };

    constructor() {
        this.curArr = this.schedules;
    }

    /**
     * Flush accumulated state (values, increment, modifier, applyMin/Max) into the
     * current schedule entry under `name`.
     *
     * @param {String} name Field key (`"s"`, `"m"`, `"h"`, `"d"`, …)
     * @param {Number} [min] Range minimum (required if `every` was set)
     * @param {Number} [max] Range maximum (required if `every` was set)
     */
    private add(name : string, min? : number, max? : number) : void {
        const me = this;

        name = me.modifier ? name + "_" + me.modifier : name;

        if (!me.cur) {
            me.curArr.push({});
            me.cur = me.curArr[0];
        }

        if (!me.cur[name]) {
            me.cur[name] = [];
        }

        me.curName = me.cur[name];
        let values = me.values;

        if (me.increment) {
            values = [];
            for (let i = min; i <= max; i += me.increment) {
                values.push(i);
            }
            me.lastAdded = { n : name, x : me.increment, c : me.curName.length, m : max };
        }

        values = me.applyMin ? [min] : me.applyMax ? [max] : values;

        const length = values.length;
        for (let i = 0; i < length; i += 1) {
            const value = values[i];
            if (me.curName.indexOf(value) < 0) {
                me.curName.push(value);
            }
        }

        me.values = undefined;
        me.increment = me.modifier = me.applyMin = me.applyMax = 0 as any;
    }

    on(...args : any[]) : ScheduleBuilder {
        this.values = args[0] instanceof Array ? args[0] : args;
        return this;
    }

    every(x? : number) : ScheduleBuilder {
        this.increment = x || 1;
        return this;
    }

    after(x : any) : ScheduleBuilder {
        this.modifier = "a";
        this.values   = [x];
        return this;
    }

    before(x : any) : ScheduleBuilder {
        this.modifier = "b";
        this.values   = [x];
        return this;
    }

    first() : ScheduleBuilder {
        this.applyMin = 1;
        return this;
    }

    last() : ScheduleBuilder {
        this.applyMax = 1;
        return this;
    }

    time() : ScheduleBuilder {
        const values = this.values;
        for (let j = 0, len = values.length; j < len; j++) {
            const split = values[j].split(":");
            if (split.length < 3) split.push(0);
            values[j] = +split[0] * 3600 + +split[1] * 60 + +split[2];
        }
        this.add("t");
        return this;
    }

    second() : ScheduleBuilder {
        this.add("s", 0, 59);
        return this;
    }

    minute() : ScheduleBuilder {
        this.add("m", 0, 59);
        return this;
    }

    hour() : ScheduleBuilder {
        this.add("h", 0, 23);
        return this;
    }

    dayOfMonth() : ScheduleBuilder {
        this.add("D", 1, this.applyMax ? 0 : 31);
        return this;
    }

    dayOfWeek() : ScheduleBuilder {
        this.add("d", 1, 7);
        return this;
    }

    onWeekend() : ScheduleBuilder {
        this.values = [1, 7];
        return this.dayOfWeek();
    }

    onWeekday() : ScheduleBuilder {
        this.values = [2, 3, 4, 5, 6];
        return this.dayOfWeek();
    }

    dayOfWeekCount() : ScheduleBuilder {
        this.add("dc", 1, this.applyMax ? 0 : 5);
        return this;
    }

    dayOfYear() : ScheduleBuilder {
        this.add("dy", 1, this.applyMax ? 0 : 366);
        return this;
    }

    weekOfMonth() : ScheduleBuilder {
        this.add("wm", 1, this.applyMax ? 0 : 5);
        return this;
    }

    weekOfYear() : ScheduleBuilder {
        this.add("wy", 1, this.applyMax ? 0 : 53);
        return this;
    }

    month() : ScheduleBuilder {
        this.add("M", 1, 12);
        return this;
    }

    year() : ScheduleBuilder {
        this.add("Y", 1970, 2450);
        return this;
    }

    fullDate() : ScheduleBuilder {
        const values = this.values;
        for (let j = 0, len = values.length; j < len; j++) {
            values[j] = DateHelper.toTime(values[j]);
        }
        this.add("fd");
        return this;
    }

    startingOn(start : number) : ScheduleBuilder {
        return this.between(start, this.lastAdded.m);
    }

    between(start : number, end : number) : ScheduleBuilder {
        const me = this;

        me.cur[me.lastAdded.n] = me.cur[me.lastAdded.n].splice(0, me.lastAdded.c);
        me.increment           = me.lastAdded.x;

        me.add(me.lastAdded.n, start, end);
        return me;
    }

    and() : ScheduleBuilder {
        this.cur = this.curArr[this.curArr.push({}) - 1];
        return this;
    }

    except() : ScheduleBuilder {
        this.curArr = this.exceptions;
        this.cur    = null;
        return this;
    }
}
