import DependencyBaseModel from './DependencyBaseModel.js';
import PartOfProject from '../data/mixin/PartOfProject.js';
import { CoreDependencyMixin } from '../../Engine/quark/model/scheduler_core/CoreDependencyMixin.js';

const EngineMixin = CoreDependencyMixin;

/**
 * @module Scheduler/model/DependencyModelCommunity
 */

/**
 * Community-tier DependencyModel.
 *
 * The full documentation lives on {@link Scheduler.model.DependencyModel}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @extends Scheduler/model/DependencyBaseModel
 * @uninherit Core/data/mixin/TreeNode
 * @tier community
 */
export default class DependencyModelCommunity extends PartOfProject(EngineMixin.derive(DependencyBaseModel)) {
    static $name = 'DependencyModelCommunity';

    // Preserves the `isDependencyModel` flag that Core/Base derives from $name; the tier split renamed
    // $name, and code across the suite branches on isDependencyModel. Must be a prototype getter, not a
    // class field - some of these are read during construction, before a subclass's field
    // initialisers have run, and a field would still be undefined at that point.
    get isDependencyModel() {
        return true;
    }

    // Determines the type of dependency based on fromSide and toSide
    getTypeFromSides(fromSide, toSide, rtl) {
        const
            types     = DependencyBaseModel.Type,
            startSide = rtl ? 'right' : 'left',
            endSide   = rtl ? 'left' : 'right';

        if (fromSide === startSide) {
            return (toSide === startSide) ? types.StartToStart : types.StartToEnd;
        }

        return (toSide === endSide) ? types.EndToEnd : types.EndToStart;
    }
}

DependencyModelCommunity.exposeProperties();
