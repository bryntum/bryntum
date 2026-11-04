// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import ResourceModelCommunity from './ResourceModelCommunity.js';

/**
 * @module Gantt/model/ResourceModel
 */

const TierBase = ResourceModelCommunity;

/**
 * This class represents a single resource in your Gantt project.
 *
 * If you want to add or change some fields, describing resources - subclass this class:
 *
 * ```javascript
 * class MyResourceModel extends ResourceModel {
 *
 *   static get fields() {
 *     return [
 *       { name: 'company', type: 'string' }
 *     ]
 *   }
 * }
 * ```
 *
 * See also: {@link Gantt.model.AssignmentModel}
 *
 * This is the tier-resolved model class — it is {@link Gantt.model.ResourceModelCommunity} on the Community tier,
 * {@link Gantt.model.ResourceModelBusiness} on Business and {@link Gantt.model.ResourceModelEnterprise} on
 * Enterprise. Import this class and you get the right one for the tier you are running. Sections marked with a tier
 * badge describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Gantt/guides/data/tiers.md) guide for details.
 *
 * @tier-alias ResourceModel
 * @extends Gantt/model/ResourceModelCommunity
 * @class-alias Scheduler.model.ResourceModel -> Scheduler.model.SchedulerResourceModel
 */
export default class ResourceModel extends TierBase {
    static $name = 'ResourceModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
