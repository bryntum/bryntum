import AjaxStore from '../../Core/data/AjaxStore.js';
import DependencyModelCommunity from '../model/DependencyModelCommunity.js';
import PartOfProject from './mixin/PartOfProject.js';
import DependencyStoreMixin from './mixin/DependencyStoreMixin.js';
import { CoreDependencyStoreMixin } from '../../Engine/quark/store/CoreDependencyStoreMixin.js';

const EngineMixin = PartOfProject(CoreDependencyStoreMixin.derive(AjaxStore));

/**
 * @module Scheduler/data/DependencyStoreCommunity
 */

/**
 * Community-tier DependencyStore.
 *
 * The full documentation lives on {@link Scheduler.data.DependencyStore}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @mixes Scheduler/data/mixin/PartOfProject
 * @mixes Scheduler/data/mixin/DependencyStoreMixin
 * @extends Core/data/AjaxStore
 * @tier community
 */
export default class DependencyStoreCommunity extends DependencyStoreMixin(EngineMixin.derive(AjaxStore)) {

    static $name = 'DependencyStoreCommunity';

    static type = 'dependencyStoreCommunity';

    // Preserves the `isDependencyStore` flag that Core/Base derives from $name; the tier split renamed
    // $name, and code across the suite branches on isDependencyStore. Must be a prototype getter, not a
    // class field - some of these are read during construction, before a subclass's field
    // initialisers have run, and a field would still be undefined at that point.
    get isDependencyStore() {
        return true;
    }

    /**
     * @hideconfigs lazyLoad
     */
    /**
     * @hideproperties lazyLoad
     */
    /**
     * @hideevents lazyLoadStarted, lazyLoadEnded
     */

    static configurable = {
        modelClass : DependencyModelCommunity
    };
}

// Register this store type with its Factory
DependencyStoreCommunity.initClass();
