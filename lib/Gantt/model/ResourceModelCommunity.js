import SchedulerResourceModel from '../../Scheduler/model/ResourceModelCommunity.js';

/**
 * @module Gantt/model/ResourceModelCommunity
 */

/**
 * Community-tier ResourceModel.
 *
 * The full documentation lives on {@link Gantt.model.ResourceModel}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @extends Scheduler/model/ResourceModelCommunity
 * @tier community
 * @class-alias Scheduler.model.ResourceModelCommunity -> Scheduler.model.SchedulerResourceModelCommunity
 */
export default class ResourceModelCommunity extends SchedulerResourceModel {
    static $name = 'ResourceModelCommunity';
}
