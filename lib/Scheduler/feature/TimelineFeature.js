import GridFeature from '../../Grid/feature/GridFeature.js';

/**
 * @module Scheduler/feature/TimelineFeature
 */

/**
 * The abstract base class for features of every timeline-based widget - Scheduler, Gantt and the
 * histograms. It holds what all of them share, such as {@link Scheduler/feature/ColumnLines} and
 * {@link Scheduler/feature/NonWorkingTime}; {@link Scheduler/feature/SchedulerFeature} and
 * {@link Gantt/feature/GanttFeature} extend it with what is specific to each product.
 *
 * Falls back to {@link Grid/feature/GridFeature} for features not found in this registry.
 *
 * @extends Grid/feature/GridFeature
 * @abstract
 */
export default class TimelineFeature extends GridFeature {
    static $name = 'TimelineFeature';

    static featureTiers = {
        allocationCopyPaste : 'enterprise',
        dependencyEdit      : 'core',
        dependencyMenu      : 'core',
        eventFilter         : 'core',
        eventSegments       : 'enterprise',
        headerZoom          : 'core',
        nonWorkingTime      : 'core',
        pan                 : 'core',
        percentBar          : 'core',
        timeRanges          : 'core',
        timeSelection       : 'core',
        timeSpanHighlight   : 'enterprise',
        treeSummary         : 'enterprise'
    };

    static get factoryable() {
        return {
            extends : [GridFeature]
        };
    }
}

TimelineFeature.initClass();
