import TimeSpan from './TimeSpan.js';
import EventModelMixin from './mixin/EventModelMixin.js';
import PartOfProject from '../data/mixin/PartOfProject.js';
import { SchedulerCoreEvent } from '../../Engine/quark/model/scheduler_core/SchedulerCoreEvent.js';

/**
 * @module Scheduler/model/EventModelCommunity
 */

/**
 * Community-tier event.
 *
 * The full documentation lives on {@link Scheduler.model.EventModel}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @extends Scheduler/model/TimeSpan
 * @mixes Scheduler/model/mixin/EventModelMixin
 * @tier community
 */
export default class EventModelCommunity extends SchedulerCoreEvent.derive(TimeSpan).mixin(
    PartOfProject,
    EventModelMixin
) {
    static $name = 'EventModelCommunity';

    // Preserves the `isEventModel` flag that Core/Base derives from $name; the tier split renamed
    // $name, and code across the suite branches on isEventModel. Must be a prototype getter, not a
    // class field - some of these are read during construction, before a subclass's field
    // initialisers have run, and a field would still be undefined at that point.
    get isEventModel() {
        return true;
    }
}

EventModelCommunity.exposeProperties();
