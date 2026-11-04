import AjaxStore from '../../Core/data/AjaxStore.js';
import PartOfProject from '../../Scheduler/data/mixin/PartOfProject.js';
import DependencyStoreMixin from '../../Scheduler/data/mixin/DependencyStoreMixin.js';
import { CoreDependencyStoreMixin } from '../../Engine/quark/store/CoreDependencyStoreMixin.js';
import DependencyModelCommunity from '../model/DependencyModelCommunity.js';

/**
 * @module Gantt/data/DependencyStoreCommunity
 */

const EngineMixin = PartOfProject(CoreDependencyStoreMixin.derive(AjaxStore));

/**
 * Community-tier DependencyStore.
 *
 * The full documentation lives on {@link Gantt.data.DependencyStore}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @mixes Scheduler/data/mixin/DependencyStoreMixin
 * @extends Core/data/AjaxStore
 * @tier community
 * @class-alias Scheduler.data.DependencyStoreCommunity -> Scheduler.data.SchedulerDependencyStoreCommunity
 */
export default class DependencyStoreCommunity extends DependencyStoreMixin(EngineMixin) {
    static $name = 'DependencyStoreCommunity';

    static configurable = {
        modelClass : DependencyModelCommunity,

        /**
         * CrudManager must load stores in the correct order. Lowest first.
         * @config {Number}
         * @private
         */
        loadPriority : 300,

        /**
         * CrudManager must sync stores in the correct order. Lowest first.
         * @config {Number}
         * @private
         */
        syncPriority : 500
    };
}
