import Base from '../../../Core/Base.js';

/**
 * @module Scheduler/data/mixin/PartOfProject
 */

/**
 * This is a mixin, included in all models and stores of the Scheduler project. It provides a common API for accessing
 * all stores of the project.
 *
 * @mixin
 */
export default Target => class PartOfProject extends (Target || Base) {

    /**
     * Returns the project this entity belongs to.
     *
     * @member {Scheduler.model.ProjectModel} project
     * @readonly
     * @category Models & Stores
     */

    /**
     * Returns the event store of the project this entity belongs to.
     *
     * @member {Scheduler.data.EventStore} eventStore
     * @readonly
     * @category Models & Stores
     */

    /**
     * Returns the dependency store of the project this entity belongs to.
     *
     * @member {Scheduler.data.DependencyStoreEnterprise} dependencyStore
     * @readonly
     * @category Models & Stores
     */

    /**
     * Returns the assignment store of the project this entity belongs to.
     *
     * @member {Scheduler.data.AssignmentStore} assignmentStore
     * @readonly
     * @category Models & Stores
     */

    /**
     * Returns the resource store of the project this entity belongs to.
     *
     * @member {Scheduler.data.ResourceStore} resourceStore
     * @readonly
     * @category Models & Stores
     */

    static $name = 'PartOfProject';

    /**
     * Returns the {@link Core.helper.DateHelper} for this store / record by deferring to the owning
     * {@link #property-project project}'s `dateHelper`, falling back to the inherited resolution chain
     * (master store / timezone owner / static DateHelper).
     *
     * Lives here because `PartOfProject` is the marker for any entity (store *or* model) that belongs to a project —
     * so project records read their tz directly from the project instead of going through their store.
     *
     * @member {Core.helper.DateHelper}
     * @ts-returns {typeof DateHelper}
     * @readonly
     * @category Models & Stores
     */
    get dateHelper() {
        return this.project?.dateHelper ?? super.dateHelper;
    }
};
