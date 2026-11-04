import { AnyConstructor, Mixin } from "../../ChronoGraph/class/BetterMixin.js"
import { CalendarIntervalMixin } from "./CalendarIntervalMixin.js"
import { AbstractCalendarMixin } from "../quark/model/AbstractCalendarMixin.js"

// <remove-on-release>
// TODO: if we would be doing just:
//  export class UnspecifiedTimeIntervalModel extends CalendarIntervalMixin ...
//  then an instance of the `CalendarIntervalMixin` `c` would : `c instanceof UnspecifiedTimeIntervalModel`,
//  because it inherit the `hasInstance` symbol
//  need to figure out how it can be handled
// </remove-on-release>

// Calendar interval model denoting unspecified interval
export class UnspecifiedTimeIntervalModel extends Mixin(
    [ CalendarIntervalMixin ],
    (base : AnyConstructor<CalendarIntervalMixin, typeof CalendarIntervalMixin>) => {

    class UnspecifiedTimeIntervalModel extends base {

        static $name = 'UnspecifiedTimeIntervalModel';

        calendar        : AbstractCalendarMixin

        mainInterval    : CalendarIntervalMixin

        // <remove-on-release>
        // TODO: Field
        // </remove-on-release>
        // @model_field({ type : 'number', defaultValue : 10 })
        priority        : number

        prioritySortValue   : number

        // <remove-on-release>
        // TODO: why it overrides the method, is it configured with calendar instance directly?
        // </remove-on-release>
        getCalendar () : AbstractCalendarMixin {
            return this.calendar
        }

        getMainInterval () : CalendarIntervalMixin {
            return this.mainInterval
        }

        // NOTE: See parent class implementation for further comments
        getPrioritySortValue () {
            if (this.prioritySortValue != null) return this.prioritySortValue

            return this.prioritySortValue = this.getCalendar().getDepth()
        }
    }

    return UnspecifiedTimeIntervalModel
}) {}
