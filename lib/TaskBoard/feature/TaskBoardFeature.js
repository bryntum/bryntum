import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import Factoryable from '../../Core/mixin/Factoryable.js';

/**
 * @module TaskBoard/feature/TaskBoardFeature
 */

/**
 * The abstract base class for TaskBoard features.
 *
 * @extends Core/mixin/InstancePlugin
 * @abstract
 */
export default class TaskBoardFeature extends InstancePlugin.mixin(Factoryable) {
    static $name = 'TaskBoardFeature';

    static factoryable = {};

    static featureTiers = {
        AI             : 'enterprise',
        columnDrag     : 'enterprise',
        columnFilter   : 'business',
        columnLock     : 'enterprise',
        columnRename   : 'business',
        columnResize   : 'business',
        columnSort     : 'enterprise',
        filterBar      : 'business',
        simpleTaskEdit : 'business',
        swimlaneDrag   : 'enterprise'
    };

    static configurable = {};

    // This makes all feature config changes after initialization recompose TaskBoard
    onConfigChange(args) {
        if (!this.isConfiguring && !this.isDestroying) {
            this.client.recompose();
        }
        super.onConfigChange(args);
    }
}
