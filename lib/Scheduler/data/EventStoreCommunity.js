import AjaxStore from '../../Core/data/AjaxStore.js';
import EventStoreMixin from './mixin/EventStoreMixin.js';
import GetEventsMixin from './mixin/GetEventsMixin.js';
import DayIndexMixin from './mixin/DayIndexMixin.js';
import EventModelCommunity from '../model/EventModelCommunity.js';
import PartOfProject from './mixin/PartOfProject.js';
import { CoreEventStoreMixin } from '../../Engine/quark/store/CoreEventStoreMixin.js';

const EngineMixin = PartOfProject(CoreEventStoreMixin.derive(AjaxStore));

/**
 * @module Scheduler/data/EventStoreCommunity
 */

/**
 * Community-tier EventStore.
 *
 * The full documentation lives on {@link Scheduler.data.EventStore}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @mixes Scheduler/data/mixin/PartOfProject
 * @mixes Scheduler/data/mixin/EventStoreMixin
 * @mixes Scheduler/data/mixin/GetEventsMixin
 * @extends Core/data/AjaxStore
 * @tier community
 */
export default class EventStoreCommunity extends EngineMixin.mixin(
    EventStoreMixin,
    DayIndexMixin,
    GetEventsMixin
) {
    static $name = 'EventStoreCommunity';

    static type = 'eventStoreCommunity';

    // Preserves the `isEventStore` flag that Core/Base derives from $name; the tier split renamed
    // $name, and code across the suite branches on isEventStore. Must be a prototype getter, not a
    // class field - some of these are read during construction, before a subclass's field
    // initialisers have run, and a field would still be undefined at that point.
    get isEventStore() {
        return true;
    }

    static configurable = {
        /**
         * Class used to represent records
         * @config {Scheduler.model.EventModelCommunity}
         * @ts-returns {typeof EventModelCommunity}
         * @default
         * @category Common
         */
        modelClass : EventModelCommunity
    };
}

// Register this store type with its Factory
EventStoreCommunity.initClass();
