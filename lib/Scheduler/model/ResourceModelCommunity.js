import GridRowModel from '../../Grid/data/GridRowModel.js';
import PartOfProject from '../data/mixin/PartOfProject.js';
import ResourceModelMixin from './mixin/ResourceModelMixin.js';
import { CoreResourceMixin } from '../../Engine/quark/model/scheduler_core/CoreResourceMixin.js';

const EngineMixin = CoreResourceMixin;

/**
 * @module Scheduler/model/ResourceModelCommunity
 */

/**
 * Community-tier ResourceModel.
 *
 * The full documentation lives on {@link Scheduler.model.ResourceModel}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @extends Grid/data/GridRowModel
 * @mixes Scheduler/model/mixin/ResourceModelMixin
 * @tier community
 */
export default class ResourceModelCommunity extends ResourceModelMixin(PartOfProject(EngineMixin.derive(GridRowModel))) {
    /**
     * Get associated events
     *
     * @member {Scheduler.model.EventModel[]} events
     * @readonly
     * @category Common
     */

    static $name = 'ResourceModelCommunity';

    // Preserves the `isResourceModel` flag that Core/Base derives from $name; the tier split renamed
    // $name, and code across the suite branches on isResourceModel. Must be a prototype getter, not a
    // class field - some of these are read during construction, before a subclass's field
    // initialisers have run, and a field would still be undefined at that point.
    get isResourceModel() {
        return true;
    }

}

ResourceModelCommunity.exposeProperties();
