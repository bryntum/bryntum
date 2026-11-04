import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/BetterMixin.js"
import { CoreDependencyStoreMixin } from "./CoreDependencyStoreMixin.js"
import { GanttCoreProjectMixin } from "../model/gantt_core/GanttCoreProjectMixin.js"
import { GanttCoreDependencyMixin } from "../model/gantt_core/GanttCoreDependencyMixin.js"

/**
 * The store of all dependencies the Gantt community engine — [[GanttCoreProjectMixin]] — works with.
 *
 * It is a [[CoreDependencyStoreMixin]] whose records are narrowed to [[GanttCoreDependencyMixin]],
 * so the engine can read `allRecords` / `records` / `rootNode` (and `rootNode.children`) with proper
 * Gantt types instead of `any`.
 *
 * @tier community
 */
export class GanttCoreDependencyStoreMixin extends Mixin(
    [ CoreDependencyStoreMixin ],
    (base : AnyConstructor<CoreDependencyStoreMixin, typeof CoreDependencyStoreMixin>) => {

    class GanttCoreDependencyStoreMixin extends base {

        project : GanttCoreProjectMixin

        modelClass : typeof GanttCoreDependencyMixin

        rootNode   : GanttCoreDependencyMixin

        static configurable : object = {
            modelClass  : GanttCoreDependencyMixin
        }

    }

    return GanttCoreDependencyStoreMixin
}){}
