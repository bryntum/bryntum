/**
 * @module Gantt/data/mixin/TaskStoreSharedMixin
 */

/**
 * Mixin holding TaskStore API shared between the Gantt {@link Gantt.data.TaskStore} and the community-tier
 * {@link Gantt.data.TaskStoreCommunity}.
 * @mixin
 * @tier community
 */
export default Target => class TaskStoreSharedMixin extends Target {
    static $name = 'TaskStoreSharedMixin';

    /**
     * Returns the `{ from, to }` pairs {@link #function-linkTasks} would create dependencies for, i.e. each consecutive
     * pair of the supplied tasks that is not already linked in either direction.
     * @param {Gantt.model.TaskModel[]} tasks The tasks to link, in the order they should be linked
     * @returns {Object[]}
     * @internal
     */
    getLinkableTaskPairs(tasks) {
        const
            { dependencyStore } = this,
            pairs               = [];

        for (let i = 1; i < tasks.length; i++) {
            const
                from = tasks[i - 1],
                to   = tasks[i];

            // Avoid creating duplicate dependencies or dependencies between parent and child when manually scheduled
            if (dependencyStore.getEventsLinkingDependency(from, to) || (from.manuallyScheduled || to.manuallyScheduled) && (from.contains(to) || to.contains(from))) {
                continue;
            }

            pairs.push({ from, to });
        }

        return pairs;
    }

    /**
     * Creates dependencies between each consecutive pair of the supplied tasks, skipping pairs that are already
     * linked in either direction. All new dependencies are added to the dependency store in a single batch.
     * @param {Gantt.model.TaskModel[]} tasks The tasks to link, in the order they should be linked
     * @internal
     */
    linkTasks(tasks) {
        this.dependencyStore.add(this.getLinkableTaskPairs(tasks));
    }

    /**
     * Returns `true` if any of the supplied tasks has a dependency that {@link #function-unlinkTasks} would remove.
     * @param {Gantt.model.TaskModel[]} tasks
     * @returns {Boolean}
     * @internal
     */
    hasUnlinkableDependencies(tasks) {
        tasks = new Set(tasks);

        return this.dependencyStore.some(({ fromTask, toTask }) => tasks.has(fromTask) || tasks.has(toTask));
    }

    /**
     * Removes all dependencies to or from the supplied tasks.
     * @param {Gantt.model.TaskModel[]} tasks The tasks to unlink
     * @internal
     */
    unlinkTasks(tasks) {
        tasks = new Set(tasks);

        this.dependencyStore.remove(this.dependencyStore.query(({ fromTask, toTask }) => tasks.has(fromTask) || tasks.has(toTask)));
    }

    getTotalTimeSpan() {
        return {
            startDate : this.getProject().startDate,
            endDate   : this.getProject().endDate
        };
    }

    assignEventToResource(event, resource, removeExistingAssignments = false) {
        return this.assignmentStore.assignEventToResource(event, resource, undefined, removeExistingAssignments);
    }

    unassignEventFromResource(event, resource) {
        this.assignmentStore.unassignEventFromResource(event, resource);
    }
};
