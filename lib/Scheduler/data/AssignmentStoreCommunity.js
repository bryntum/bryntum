import AjaxStore from '../../Core/data/AjaxStore.js';
import AssignmentModelCommunity from '../model/AssignmentModelCommunity.js';
import PartOfProject from './mixin/PartOfProject.js';
import AssignmentStoreMixin from './mixin/AssignmentStoreMixin.js';
import { CoreAssignmentStoreMixin } from '../../Engine/quark/store/CoreAssignmentStoreMixin.js';

const EngineMixin = PartOfProject(CoreAssignmentStoreMixin.derive(AjaxStore));

/**
 * @module Scheduler/data/AssignmentStoreCommunity
 */

/**
 * Community-tier AssignmentStore.
 *
 * The full documentation lives on {@link Scheduler.data.AssignmentStore}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @mixes Scheduler/data/mixin/AssignmentStoreMixin
 * @mixes Scheduler/data/mixin/PartOfProject
 * @extends Core/data/AjaxStore
 * @tier community
 */
export default class AssignmentStoreCommunity extends AssignmentStoreMixin(EngineMixin) {

    /**
     * Returns all assignments for a given event.
     * @function getAssignmentsForEvent
     * @param {Scheduler.model.EventModel} event The event to get assignments for
     * @returns {Scheduler.model.AssignmentModel[]} Array of assignments for the event
     * @category Assignments
     */

    static $name = 'AssignmentStoreCommunity';

    static type = 'assignmentStoreCommunity';

    // Preserves the `isAssignmentStore` flag that Core/Base derives from $name; the tier split renamed
    // $name, and code across the suite branches on isAssignmentStore. Must be a prototype getter, not a
    // class field - some of these are read during construction, before a subclass's field
    // initialisers have run, and a field would still be undefined at that point.
    get isAssignmentStore() {
        return true;
    }

    static configurable = {
        modelClass : AssignmentModelCommunity
    };
}

// Register this store type with its Factory
AssignmentStoreCommunity.initClass();
