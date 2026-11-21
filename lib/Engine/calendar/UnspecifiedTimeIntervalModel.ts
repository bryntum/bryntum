import { AnyConstructor, Mixin } from "../../ChronoGraph/class/BetterMixin.js"
import { CalendarIntervalMixin } from "./CalendarIntervalMixin.js"
import { AbstractCalendarMixin } from "../quark/model/AbstractCalendarMixin.js"



// Calendar interval model denoting unspecified interval
export class UnspecifiedTimeIntervalModel extends Mixin(
    [ CalendarIntervalMixin ],
    (base : AnyConstructor<CalendarIntervalMixin, typeof CalendarIntervalMixin>) => {

    class UnspecifiedTimeIntervalModel extends base {

        static $name = 'UnspecifiedTimeIntervalModel';

        calendar        : AbstractCalendarMixin

        mainInterval    : CalendarIntervalMixin


        // @model_field({ type : 'number', defaultValue : 10 })
        priority        : number

        prioritySortValue   : number


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
