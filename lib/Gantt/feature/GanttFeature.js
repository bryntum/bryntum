import TimelineFeature from '../../Scheduler/feature/TimelineFeature.js';

/**
 * @module Gantt/feature/GanttFeature
 */

/**
 * The abstract base class for Gantt features.
 *
 * Features registered with this factory are resolved when creating a Gantt. Falls back to
 * {@link Scheduler/feature/TimelineFeature} and then {@link Grid/feature/GridFeature} for features not
 * found in this registry. Scheduler-only features are not visible to a Gantt; a Scheduler feature the
 * Gantt also offers registers with both factories via `featureFactory`.
 *
 * @extends Scheduler/feature/TimelineFeature
 * @abstract
 */
export default class GanttFeature extends TimelineFeature {
    static $name = 'GanttFeature';

    static featureTiers = {
        baselines          : 'enterprise',
        criticalPaths      : 'enterprise',
        indicators         : 'core',
        labels             : 'core',
        mspExport          : 'enterprise',
        parentArea         : 'core',
        pdfExport          : 'enterprise',
        print              : 'enterprise',
        progressLine       : 'core',
        projectEdit        : 'enterprise',
        projectLines       : 'core',
        rollups            : 'enterprise',
        rowExpander        : 'core',
        rowReorder         : 'core',
        taskCopyPaste      : 'core',
        taskEdit           : 'core',
        taskNonWorkingTime : 'core',
        taskSegmentDrag    : 'enterprise',
        taskSegmentResize  : 'enterprise',
        timelineChart      : 'enterprise',
        versions           : 'enterprise'
    };

    static get factoryable() {
        return {
            extends : [TimelineFeature]
        };
    }
}

GanttFeature.initClass();
