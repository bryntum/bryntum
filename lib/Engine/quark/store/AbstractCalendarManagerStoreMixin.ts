import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/Mixin.js"
import { AbstractPartOfProjectStoreMixin } from "./mixin/AbstractPartOfProjectStoreMixin.js"

/**
 * Shared functionality for [[CoreCalendarManagerStoreMixin]] and [[ChronoCalendarManagerStoreMixin]]
 *
 * @tier community
 */
export class AbstractCalendarManagerStoreMixin extends Mixin(
    [ AbstractPartOfProjectStoreMixin ],
    (base : AnyConstructor<AbstractPartOfProjectStoreMixin, typeof AbstractPartOfProjectStoreMixin>) => {

    class AbstractCalendarManagerStoreMixin extends base {
        // special handling to destroy calendar models as part of destroying this store
        doDestroy () {
            const records = []

            // When chained, traverse can be called on destroyed nodes.
            if (!this.isChained && !this.rootNode?.isDestroyed) {
                this.traverse(record => records.push(record))
            }

            super.doDestroy()

            records.forEach(record => record.destroy())
        }
    }

    return AbstractCalendarManagerStoreMixin
}){}
