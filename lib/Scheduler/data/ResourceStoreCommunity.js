import ResourceStoreMixin from './mixin/ResourceStoreMixin.js';
import ResourceModelCommunity from '../model/ResourceModelCommunity.js';
import AjaxStore from '../../Core/data/AjaxStore.js';
import PartOfProject from './mixin/PartOfProject.js';
import { CoreResourceStoreMixin } from '../../Engine/quark/store/CoreResourceStoreMixin.js';

const EngineMixin = PartOfProject(CoreResourceStoreMixin.derive(AjaxStore));

/**
 * @module Scheduler/data/ResourceStoreCommunity
 */

/**
 * Community-tier ResourceStore.
 *
 * The full documentation lives on {@link Scheduler.data.ResourceStore}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @mixes Scheduler/data/mixin/PartOfProject
 * @mixes Scheduler/data/mixin/ResourceStoreMixin
 * @extends Core/data/AjaxStore
 * @tier community
 */
export default class ResourceStoreCommunity extends ResourceStoreMixin(EngineMixin) {
    static $name = 'ResourceStoreCommunity';

    static type = 'resourceStoreCommunity';

    // Preserves the `isResourceStore` flag that Core/Base derives from $name; the tier split renamed
    // $name, and code across the suite branches on isResourceStore. Must be a prototype getter, not a
    // class field - some of these are read during construction, before a subclass's field
    // initialisers have run, and a field would still be undefined at that point.
    get isResourceStore() {
        return true;
    }

    static configurable = {
        modelClass : ResourceModelCommunity
    };
}

// Register this store type with its Factory
ResourceStoreCommunity.initClass();
