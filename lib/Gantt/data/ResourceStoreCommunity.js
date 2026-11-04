import SchedulerResourceStore from '../../Scheduler/data/ResourceStoreCommunity.js';
import ResourceModelCommunity from '../model/ResourceModelCommunity.js';

/**
 * @module Gantt/data/ResourceStoreCommunity
 */

/**
 * Community-tier ResourceStore.
 *
 * The full documentation lives on {@link Gantt.data.ResourceStore}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @extends Scheduler/data/ResourceStoreCommunity
 * @tier community
 * @class-alias Scheduler.data.ResourceStoreCommunity -> Scheduler.data.SchedulerResourceStoreCommunity
 */
export default class ResourceStoreCommunity extends SchedulerResourceStore {
    static $name = 'ResourceStoreCommunity';

    static configurable = {
        modelClass : ResourceModelCommunity,

        /**
         * CrudManager must load stores in the correct order. Lowest first.
         * @config {Number}
         * @private
         */
        loadPriority : 400,

        /**
         * CrudManager must sync stores in the correct order. Lowest first.
         * @config {Number}
         * @private
         */
        syncPriority : 200
    };
}
