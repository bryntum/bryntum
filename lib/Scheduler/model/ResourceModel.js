// The tier build rewrites the variant suffix inside each tier-alias region below, so exactly one class
// is imported and extended per tier. What is written here is what untiered sources resolve to.
import ResourceModelCommunity from './ResourceModelCommunity.js';

/**
 * @module Scheduler/model/ResourceModel
 */

const TierBase = ResourceModelCommunity;

/**
 * This class represent a single Resource in scheduler, usually added to a {@link Scheduler.data.ResourceStore}.
 *
 * It is a subclass of  {@link Core.data.Model}. Please refer to the documentation for that class to become familiar
 * with the base interface of the resource.
 *
 * This is the tier-resolved model class — it is {@link Scheduler.model.ResourceModelCommunity} on the Community tier,
 * {@link Scheduler.model.ResourceModelBusiness} on Business and {@link Scheduler.model.ResourceModelEnterprise} on
 * Enterprise. Import this class and you get the right one for the tier you are running. Sections marked with a tier
 * badge describe behavior that requires that tier or higher. See the [Product tiers and class
 * names](#Scheduler/guides/data/tiers.md) guide for details.
 *
 * ## Fields and references
 *
 * A resource has a few predefined fields, see Fields below. If you want to add more fields with meta data describing
 * your resources then you should subclass this class:
 *
 * ```javascript
 * class MyResource extends ResourceModel {
 *   static fields = [
 *       // "id" and "name" fields are already provided by the superclass
 *       { name: 'company', type : 'string' }
 *   ];
 * }
 * ```
 *
 * If you want to use other names in your data for the id and name fields you can configure them as seen below:
 *
 * ```javascript
 * class MyResource extends ResourceModel {
 *   static fields = [
 *      { name: 'name', dataSource: 'userName' }
 *   ];
 * }
 * ```
 *
 * After load and project normalization, these references are accessible (assuming their respective stores are loaded):
 * - `{@link #property-assignments}` - The linked assignment records
 * - `{@link #property-events}` - The linked (through assignments) event records
 *
 * ## Async resolving of references
 *
 * As described above, a resource has links to assignments and events. These references are populated async, using the
 * calculation engine of the project that the resource via its store is a part of. Because of this asyncness, references
 * cannot be used immediately after assignment modifications:
 *
 * ```javascript
 * assignment.resourceId = 2;
 * // resource.assignments is not yet up to date
 * ```
 *
 * To make sure references are updated, wait for calculations to finish:
 *
 * ```javascript
 * assignment.resourceId = 2;
 * await assignment.project.commitAsync();
 * // resource.assignments is up to date
 * ```
 *
 * As an alternative, you can also use `setAsync()` to trigger calculations directly after the change:
 *
 * ```javascript
 * await assignment.setAsync({ resourceId : 2});
 * // resource.assignments is up to date
 * ```
 *
 * ## Scheduling engine <span class="badge tier tier-enterprise">Enterprise</span>
 *
 * On the Enterprise tier the resource participates in scheduling. It gains a {@link
 * Scheduler.model.ResourceModelEnterprise#field-calendar calendar} defining its working time, availability through
 * {@link Scheduler.model.ResourceModelEnterprise#field-maxUnits maxUnits}, and cost fields such as `cost`,
 * `costAccrual` and `rateTables` used by the resource utilization and histogram views.
 *
 * ## See also
 *
 * - {@link Scheduler.data.ResourceStore} - Store for resources
 * - {@link Scheduler.model.EventModel} - Event data model
 * - {@link Scheduler.model.AssignmentModel} - Assignment data model
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 *
 * @tier-alias ResourceModel
 * @extends Scheduler/model/ResourceModelCommunity
 */
export default class ResourceModel extends TierBase {
    static $name = 'ResourceModel';

    // The highest tier this alias resolves to, which the tier build rewrites to the tier it resolves to there
    static tierAlias = 'community';
}
