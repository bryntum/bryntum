import Model from '../../Core/data/Model.js';
import PartOfProject from '../data/mixin/PartOfProject.js';
import AssignmentModelMixin from './mixin/AssignmentModelMixin.js';
import { CoreAssignmentMixin } from '../../Engine/quark/model/scheduler_core/CoreAssignmentMixin.js';

const EngineMixin = CoreAssignmentMixin;

/**
 * @module Scheduler/model/AssignmentModelCommunity
 */

/**
 * Community-tier AssignmentModel.
 *
 * The full documentation lives on {@link Scheduler.model.AssignmentModel}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @extends Core/data/Model
 * @mixes Scheduler/model/mixin/AssignmentModelMixin
 * @uninherit Core/data/mixin/TreeNode
 * @tier community
 */
export default class AssignmentModelCommunity extends AssignmentModelMixin(PartOfProject(EngineMixin.derive(Model))) {
    // NOTE: Leave field defs at top to be picked up by jsdoc

    /**
     * Id for event to assign. Can be used as an alternative to `eventId`, but please note that after
     * load it will be populated with the actual event and not its id. This field is not persistable.
     * @field {Scheduler.model.EventModel} event
     * @accepts {String|Number|Scheduler.model.EventModel}
     * @ts-returns {String|Number|Scheduler.model.EventModel|Scheduler.model.TimeSpan}
     * @category Common
     */

    /**
     * Id for resource to assign to. Can be used as an alternative to `resourceId`, but please note that after
     * load it will be populated with the actual resource and not its id. This field is not persistable.
     * @field {Scheduler.model.ResourceModel} resource
     * @accepts {String|Number|Scheduler.model.ResourceModel}
     * @category Common
     */

    static $name = 'AssignmentModelCommunity';

    // Preserves the `isAssignmentModel` flag that Core/Base derives from $name; the tier split renamed
    // $name, and code across the suite branches on isAssignmentModel. Must be a prototype getter, not a
    // class field - some of these are read during construction, before a subclass's field
    // initialisers have run, and a field would still be undefined at that point.
    get isAssignmentModel() {
        return true;
    }
}

AssignmentModelCommunity.exposeProperties();
