import TimelineFeature from './TimelineFeature.js';

/**
 * @module Scheduler/feature/SchedulerFeature
 */

/**
 * The abstract base class for Scheduler features.
 *
 * Features registered with this factory are resolved when creating a Scheduler (or its subclasses).
 * Falls back to {@link Scheduler/feature/TimelineFeature} and then {@link Grid/feature/GridFeature} for
 * features not found in this registry. A Gantt does not see this registry - it is a sibling, extending
 * {@link Scheduler/feature/TimelineFeature} through {@link Gantt/feature/GanttFeature}.
 *
 * @extends Scheduler/feature/TimelineFeature
 * @abstract
 */
export default class SchedulerFeature extends TimelineFeature {
    static $name = 'SchedulerFeature';

    static featureTiers = {
        allocationCellEdit          : 'enterprise',
        calendarHighlight           : 'enterprise',
        dependencyEdit              : 'core',
        dependencyMenu              : 'core',
        eventBuffer                 : 'enterprise',
        eventClustering             : 'enterprise',
        eventCopyPaste              : 'core',
        eventDragSelect             : 'core',
        eventFilter                 : 'core',
        eventNonWorkingTime         : 'enterprise',
        eventSegmentDrag            : 'enterprise',
        eventSegmentResize          : 'enterprise',
        eventSegments               : 'enterprise',
        excelExporter               : 'enterprise',
        groupRollups                : 'enterprise',
        headerZoom                  : 'core',
        labels                      : 'core',
        nestedEvents                : 'enterprise',
        pan                         : 'core',
        pdfExport                   : 'enterprise',
        print                       : 'enterprise',
        resourceColumnReorder       : 'core',
        resourceEdit                : 'enterprise',
        resourceNonWorkingTime      : 'enterprise',
        resourceTimeRangeClustering : 'enterprise',
        resourceTimeRanges          : 'core',
        scheduleContext             : 'core',
        scrollButtons               : 'core',
        simpleEventEdit             : 'core',
        stickyEvents                : 'core',
        taskEdit                    : 'enterprise',
        timeSelection               : 'core',
        timeSpanHighlight           : 'enterprise',
        versions                    : 'enterprise'
    };

    static get factoryable() {
        return {
            extends : [TimelineFeature]
        };
    }
}

SchedulerFeature.initClass();
