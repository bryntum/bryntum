import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/BetterMixin.js"
import { CoreEventStoreMixin } from "./CoreEventStoreMixin.js"
import { GanttCoreEvent } from "../model/gantt_core/GanttCoreEvent.js"
import { GanttCoreProjectMixin } from "../model/gantt_core/GanttCoreProjectMixin.js"


/**
 * The store of all events (tasks) the Gantt community engine — [[GanttCoreProjectMixin]] — works with.
 *
 * It is a [[CoreEventStoreMixin]] whose records are narrowed to [[GanttCoreEvent]], so the engine can read
 * `allRecords` / `records` / `rootNode` (and `rootNode.children`) with proper Gantt types instead of `any`.
 *
 * @tier community
 */
export class GanttCoreEventStoreMixin extends Mixin(
    [ CoreEventStoreMixin ],
    (base : AnyConstructor<CoreEventStoreMixin, typeof CoreEventStoreMixin>) => {

    class GanttCoreEventStoreMixin extends base {

        project : GanttCoreProjectMixin

        // Narrowing the model class is enough — the base store already types `allRecords` / `records` as
        // `InstanceType<this['modelClass']>[]`, so they become `GanttCoreEvent[]` automatically.
        modelClass : typeof GanttCoreEvent

        rootNode   : GanttCoreEvent

        static configurable : object = {
            modelClass  : GanttCoreEvent,
            tree        : true
        }

    }

    return GanttCoreEventStoreMixin
}){}
