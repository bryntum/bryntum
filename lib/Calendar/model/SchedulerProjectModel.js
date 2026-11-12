// Calendar caps Scheduler's aliases at the Core tier (`consumerCaps` in scripts/types/grunt-types-tiers.js)
import ProjectModelCommunity from '../../Scheduler/model/ProjectModelCommunity.js';

/**
 * @module Calendar/model/SchedulerProjectModel
 */

const TierBase = ProjectModelCommunity;

/**
 * Per-tier base of {@link Calendar.model.ProjectModel}: {@link Scheduler.model.ProjectModelCommunity} on the Community
 * tier and {@link Scheduler.model.ProjectModelCore} on the Core tier and the Enterprise tier. See
 * [tiers](#Calendar/guides/data/tiers.md).
 *
 * See {@link Scheduler.model.ProjectModel} for the full documentation.
 *
 * @tier-alias ProjectModel
 * @extends Scheduler/model/ProjectModelCommunity
 */
export default class SchedulerProjectModel extends TierBase {
    static $name = 'SchedulerProjectModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
