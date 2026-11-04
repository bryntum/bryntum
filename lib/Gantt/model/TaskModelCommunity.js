import Wbs from '../../Core/data/Wbs.js';
import TaskModelSharedMixin from './mixin/TaskModelSharedMixin.js';
import '../data/field/WbsField.js';
import { GanttCoreEvent } from '../../Engine/quark/model/gantt_core/GanttCoreEvent.js';
import EventModelMixin from '../../Scheduler/model/mixin/EventModelMixin.js';
import TimeSpan from '../../Scheduler/model/TimeSpan.js';
import PartOfProject from '../../Scheduler/data/mixin/PartOfProject.js';

/**
 * @module Gantt/model/TaskModelCommunity
 */

/**
 * Community-tier TaskModel.
 *
 * The full documentation lives on {@link Gantt.model.TaskModel}, the tier-resolved class that
 * resolves to this one on the Community tier. Refer to it for the complete description — this page
 * lists only what is specific to this tier.
 *
 * @mixes Gantt/model/mixin/TaskModelSharedMixin
 * @extends Scheduler/model/EventModelCommunity
 * @tier community
 */
export default class TaskModelCommunity extends GanttCoreEvent.derive(TimeSpan).mixin(PartOfProject, EventModelMixin, TaskModelSharedMixin) {
    static $name = 'TaskModelCommunity';

    get isTaskModel() {
        return true;
    }

    static get fields() {
        return [
            { name : 'name', type : 'string', defaultValue : '' },
            { name : 'wbsCode', type : 'wbs', persist : false, calculated : true },
            { name : 'wbsValue', type : 'wbs', persist : false, calculated : true },
            { name : 'note', type : 'string' },
            { name : 'children', persist : false },
            { name : 'parentIndex', type : 'number', persist : true },
            { name : 'manuallyScheduled', type : 'boolean', defaultValue : false }
        ];
    }

    //region Wbs

    /**
     * Computed WBS value (e.g. `1.2.3`) derived from the task's position in the tree.
     * @member {Core.data.Wbs} wbsValue
     */
    get wbsValue() {
        const path = [];

        let node = this;
        while (node && !node.isRoot) {
            path.unshift((node.parentIndex ?? 0) + 1);
            node = node.parent;
        }
        return path.length ? new Wbs(path.join('.')) : null;
    }

    get wbsCode() {
        return this.wbsValue?.toString() ?? '';
    }

    //endregion

    /**
     * Defines if the given task field should be manually editable in UI.
     * You can override this method to provide your own logic.
     *
     * By default, the method defines:
     * - {@link #field-endDate}, {@link #field-duration} and {@link #field-fullDuration} fields as not editable for
     *   summary tasks except the {@link #field-manuallyScheduled manually scheduled} ones.
     *
     * @param {String} fieldName Name of the field
     * @returns {Boolean} Returns `true` if the field is editable, `false` if it is not and `undefined` if the task has
     * no such field.
     */
    isEditable(fieldName) {
        const me = this;

        let editable = true;

        switch (fieldName) {
            // end/duration is allowed to edit for leafs and manually scheduled summaries
            case 'endDate' :
            case 'duration' :
            case 'fullDuration' :
                editable = me.isLeaf/* || me.manuallyScheduled*/;
                break;
        }

        return editable && super.isEditable(fieldName);
    }
}

TaskModelCommunity.convertEmptyParentToLeaf = true;
