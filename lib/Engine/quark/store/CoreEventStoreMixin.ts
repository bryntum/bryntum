import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/BetterMixin.js"
import { SchedulerCoreProjectMixin } from "../model/scheduler_core/SchedulerCoreProjectMixin.js"
import { SchedulerCoreEvent } from "../model/scheduler_core/SchedulerCoreEvent.js"
import { CorePartOfProjectStoreMixin } from "./mixin/CorePartOfProjectStoreMixin.js"
import { AbstractEventStoreMixin } from "./AbstractEventStoreMixin.js"
import { CoreAssignmentMixin } from "../model/scheduler_core/CoreAssignmentMixin.js"


/**
 * A store mixin class, that represent collection of all events in the [[SchedulerCoreProjectMixin|project]].
 *
 * @tier community
 */
export class CoreEventStoreMixin extends Mixin(
    [ AbstractEventStoreMixin, CorePartOfProjectStoreMixin ],
    (base : AnyConstructor<AbstractEventStoreMixin & CorePartOfProjectStoreMixin, typeof AbstractEventStoreMixin & typeof CorePartOfProjectStoreMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class CoreEventStoreMixin extends base {

        project             : SchedulerCoreProjectMixin

        modelClass          : this[ 'project' ][ 'eventModelClass' ]


        static configurable : object = {
            modelClass  : SchedulerCoreEvent
        }


        joinProject () {
            this.assignmentStore?.linkAssignments(this, 'event')
        }


        afterLoadData () {
            this.afterEventRemoval()
            this.assignmentStore?.linkAssignments(this, 'event')
        }

    }

    return CoreEventStoreMixin
}){}
