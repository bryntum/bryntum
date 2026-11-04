import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/BetterMixin.js"
import { DependencyType, Duration, TimeUnit } from "../../../scheduling/Types.js"
import { CoreDependencyMixin } from "../scheduler_core/CoreDependencyMixin.js"
import { GanttCoreEvent } from "./GanttCoreEvent.js"


/**
 * The dependency class the Gantt community engine — [[GanttCoreProjectMixin]] — works with.
 *
 * It is a [[CoreDependencyMixin]] whose resolved endpoints are typed as [[GanttCoreEvent]] and whose `fromEvent` /
 * `toEvent` getters fall back to the raw id when the reference is not yet resolved (matching the enterprise engine).
 * The base community mixin returns `null` while unresolved; returning the id instead lets store helpers such as
 * `isValidDependency()` resolve a standalone dependency model via the event store.
 *
 * @tier community
 */
export class GanttCoreDependencyMixin extends Mixin(
    [ CoreDependencyMixin ],
    (base : AnyConstructor<CoreDependencyMixin, typeof CoreDependencyMixin>) => {

    class GanttCoreDependencyMixin extends base {

        get isGanttCoreDependencyMixin () {
            return true
        }

        type    : DependencyType
        lag     : Duration
        lagUnit : TimeUnit

        static get fields () : any {
            return [
                { name : 'type', defaultValue : DependencyType.EndToStart },
                { name : 'lag', type : 'number', defaultValue : 0 },
                { name : 'lagUnit', defaultValue : TimeUnit.Day }
            ]
        }

        // Field changes of which should cause propagation
        static fieldsCausingPropagation = [...base.fieldsCausingPropagation, 'fromEvent', 'toEvent', 'type', 'lag', 'lagUnit']

        beforeRemove () {
            // propagation should track dependency removals too
            this.project?.$invalidated.add(this)
        }

        get fromEvent () {
            const fromEvent = this.get('fromEvent')
            // Resolved event instance when available, otherwise the raw id/value (or null).
            return fromEvent?.id != null ? fromEvent : (fromEvent ?? null)
        }

        set fromEvent (fromEvent : string | number | GanttCoreEvent) {
            super.fromEvent = fromEvent
        }

        get toEvent () {
            const toEvent = this.get('toEvent')
            // Resolved event instance when available, otherwise the raw id/value (or null).
            return toEvent?.id != null ? toEvent : (toEvent ?? null)
        }

        set toEvent (toEvent : string | number | GanttCoreEvent) {
            super.toEvent = toEvent
        }

        getLag () : Duration {
            return this.lag
        }

        putLag (lag : Duration, unit? : TimeUnit) {
           this.set({
              lag,
              ...(unit ? { lagUnit : unit } : {})
            });
        }

        setLag (lag : Duration, unit? : TimeUnit) {
            this.putLag(lag, unit)

            return this.project?.commitAsync()
        }
    }

    return GanttCoreDependencyMixin
}){}
