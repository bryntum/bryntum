// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import AssignmentModelCommunity from './AssignmentModelCommunity.js';

/**
 * @module Scheduler/model/AssignmentModel
 */

const TierBase = AssignmentModelCommunity;

/**
 * This model represents a single assignment of a resource to an event in the scheduler, usually added to a
 * {@link Scheduler.data.AssignmentStore}.
 *
 * It is a subclass of the {@link Core.data.Model} class. Please refer to the documentation for that class to become
 * familiar with the base interface of this class.
 *
 * This is the tier-resolved model class — it is {@link Scheduler.model.AssignmentModelCommunity} on the Community tier,
 * {@link Scheduler.model.AssignmentModelBusiness} on Business and {@link Scheduler.model.AssignmentModelEnterprise} on
 * Enterprise. Import this class and you get the right one for the tier you are running. Sections marked with a tier
 * badge describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Scheduler/guides/data/tiers.md) guide for details.
 *
 * ## Fields and references
 *
 * An Assignment has the following fields:
 * - `id` - The id of the assignment
 * - `resourceId` - The id of the resource assigned (optionally replaced with `resource` for load)
 * - `eventId` - The id of the event to which the resource is assigned (optionally replaced with `event` for load)
 *
 * The data source for these fields can be customized by subclassing this class:
 *
 * ```javascript
 * class MyAssignment extends AssignmentModel {
 *   static get fields() {
 *       return [
 *          { name : 'resourceId', dataSource : 'linkedResource' }
 *       ];
 *   }
 * }
 * ```
 *
 * After load and project normalization, these references are accessible (assuming their respective stores are loaded):
 * - `event` - The linked event record
 * - `resource` - The linked resource record
 *
 * ## Async resolving of references
 *
 * As described above, an assignment links an event to a resource. It holds references to an event record and a resource
 * record. These references are populated async, using the calculation engine of the project that the assignment via
 * its store is a part of. Because of this asyncness, references cannot be used immediately after modifications:
 *
 * ```javascript
 * assignment.resourceId = 2;
 * // assignment.resource is not yet available
 * ```
 *
 * To make sure references are updated, wait for calculations to finish:
 *
 * ```javascript
 * assignment.resourceId = 2;
 * await assignment.project.commitAsync();
 * // assignment.resource is available
 * ```
 *
 * As an alternative, you can also use `setAsync()` to trigger calculations directly after the change:
 *
 * ```javascript
 * await assignment.setAsync({ resourceId : 2});
 * // assignment.resource is available
 * ```
 *
 * ## Scheduling engine <span class="badge tier tier-enterprise">Enterprise</span>
 *
 * On the Enterprise tier the assignment participates in scheduling. It gains {@link
 * Scheduler.model.AssignmentModelEnterprise#field-units units}, effort fields (`effort`, `fullEffort`) and its own
 * calculated `startDate` / `endDate`, plus cost fields such as `cost` and `rateTable`.
 *
 * ## See also
 *
 * - {@link Scheduler.data.AssignmentStore} - Store for assignments
 * - {@link Scheduler.model.EventModel} - Event data model
 * - {@link Scheduler.model.ResourceModel} - Resource data model
 *
 * @tier-alias AssignmentModel
 * @extends Scheduler/model/AssignmentModelCommunity
 */
export default class AssignmentModel extends TierBase {
    static $name = 'AssignmentModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
