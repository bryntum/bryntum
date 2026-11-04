import Base from '../../../Core/Base.js';

/**
 * @module Scheduler/view/mixin/SchedulerRegions
 */

/**
 * Functions to get regions (bounding boxes) for scheduler, events etc. Used internally to calculate
 * positions and sizes for schedule areas, event elements, and resource rows.
 *
 * ## See also
 *
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 *
 * @mixin
 */
export default Target => class SchedulerRegions extends (Target || Base) {
    static $name = 'SchedulerRegions';

    //region Orientation dependent regions

    /**
     * Gets the region represented by the schedule and optionally only for a single resource. The view will ask the
     * scheduler for the resource availability by calling getResourceAvailability. By overriding that method you can
     * constrain events differently for different resources.
     * @param {Scheduler.model.ResourceModel} resourceRecord (optional) The resource record
     * @param {Scheduler.model.EventModel} eventRecord (optional) The event record
     * @returns {Core.helper.util.Rectangle} The region of the schedule
     */
    getScheduleRegion(resourceRecord, eventRecord, local = true, dateConstraints, ...args) {
        return this.currentOrientation.getScheduleRegion(resourceRecord, eventRecord, local, dateConstraints, ...args);
    }

    /**
     * Gets the region, relative to the timeline view element, representing the passed resource and optionally just for a certain date interval.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource record
     * @param {Date} startDate A start date constraining the region
     * @param {Date} endDate An end date constraining the region
     * @returns {Core.helper.util.Rectangle} A Rectangle which encapsulates the resource time span
     */
    getResourceRegion(resourceRecord, startDate, endDate, ...args) {
        return this.currentOrientation.getRowRegion(resourceRecord, startDate, endDate, ...args);
    }

    //endregion

    //region ResourceEventBox

    getAssignmentEventBox(assignmentRecord, includesOutside) {
        // The row it is rendered on, which might not be its resource's (GroupRollups)
        return this.getResourceEventBox(assignmentRecord.event, this.getAssignmentRow(assignmentRecord), includesOutside);
    }

    /**
     * Get the region for a specified resources specified event.
     * @param {Scheduler.model.EventModel} eventRecord
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @param {Boolean} includeOutside Specify true to get boxes for events outside of the rendered zone in both
     *   dimensions. This option is used when calculating dependency lines, and we need to include routes from events
     *   which may be outside the rendered zone.
     * @returns {Core.helper.util.Rectangle}
     */
    getResourceEventBox(eventRecord, resourceRecord, includeOutside = false, roughly = false) {
        return this.currentOrientation.getResourceEventBox(eventRecord, resourceRecord, includeOutside, roughly);
    }

    //endregion

    //region Item box

    /**
     * Gets box for displayed item designated by the record. If several boxes are displayed for the given item
     * then the method returns all of them. Box coordinates are in view coordinate system.
     *
     * Boxes outside scheduling view timeaxis timespan and inside collapsed rows (if row defining store is a tree store)
     * will not be returned. Boxes outside scheduling view vertical visible area (i.e. boxes above currently visible
     * top row or below currently visible bottom row) will be calculated approximately.
     *
     * @param {Scheduler.model.EventModel} event
     * @returns {Core.helper.util.Rectangle[]} Array of resource box rectangles for event resources
     * @internal
     */
    getItemBox(event, includeOutside = false) {
        return event.resources.map(resource => this.getResourceEventBox(event, resource, includeOutside));
    }

    //endregion

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
