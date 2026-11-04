import { AnyConstructor, Mixin } from "../../ChronoGraph/class/BetterMixin.js"
import { CalendarIntervalMixin } from "./CalendarIntervalMixin.js"
import { AbstractPartOfProjectStoreMixin } from "../quark/store/mixin/AbstractPartOfProjectStoreMixin.js"
import { AbstractCalendarMixin } from "../quark/model/AbstractCalendarMixin.js"

/**
 * This a collection of [[CalendarIntervalMixin]] items. Its a dumb collection though, the "real" calendar
 * is a [[AbstractCalendarMixin]] model, which is part of the [[AbstractCalendarManagerStoreMixin]].
 */
export class CalendarIntervalStore extends Mixin(
    [ AbstractPartOfProjectStoreMixin ],
    (base : AnyConstructor<AbstractPartOfProjectStoreMixin, typeof AbstractPartOfProjectStoreMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class CalendarIntervalStore extends base {
        modelClass      : typeof CalendarIntervalMixin

        calendar        : AbstractCalendarMixin

        disableHasLoadedDataToCommitFlag : boolean      = true


        static configurable = {
            modelClass : CalendarIntervalMixin
        }

        acceptChanges () {
            // Do not sanitize intervalStore changes ..when using CrudManager protocol we treat it as a proper store
            // so should be able to collect its changes
            if (!this.isSyncingDataOnLoad) {
                // @ts-ignore
                return super.acceptChanges(...arguments);
            }
        }

    }

    return CalendarIntervalStore

}){}
