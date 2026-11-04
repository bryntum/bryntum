import SchedulerDependencyModel from '../../Scheduler/model/DependencyModelCommunity.js';
import { GanttCoreDependencyMixin } from '../../Engine/quark/model/gantt_core/GanttCoreDependencyMixin.js';

/**
 * @module Gantt/model/DependencyModelCommunity
 */

/**
 * Community-tier DependencyModel.
 *
 * The full documentation lives on {@link Gantt.model.DependencyModel}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @extends Scheduler/model/DependencyModelCommunity
 * @tier community
 * @class-alias Scheduler.model.DependencyModelCommunity -> Scheduler.model.SchedulerDependencyModelCommunity
 */
export default class DependencyModelCommunity extends GanttCoreDependencyMixin.derive(SchedulerDependencyModel) {
    static $name = 'DependencyModelCommunity';

    // `from` / `to` are computed from the resolved event references (mirrors the enterprise Gantt DependencyModel), so
    // a task instance, id or `fromTask`/`toTask` passed on creation always reads back as the task id.
    get from() {
        return this.fromEvent?.id;
    }

    set from(value) {
        super.from = value;
    }

    get to() {
        return this.toEvent?.id;
    }

    set to(value) {
        super.to = value;
    }

    get fromTask() {
        return this.fromEvent;
    }

    set fromTask(task) {
        this.fromEvent = task;
    }

    get toTask() {
        return this.toEvent;
    }

    set toTask(task) {
        this.toEvent = task;
    }
}
