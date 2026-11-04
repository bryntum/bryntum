import { GanttCoreEvent } from "./GanttCoreEvent.js";
import { Mixin, AnyConstructor } from "../../../../ChronoGraph/class/Mixin.js";
import { SchedulerCoreProjectMixin } from "../scheduler_core/SchedulerCoreProjectMixin.js";

export enum CoreResolutionResult {
    /**
     * A chosen resolution is "do nothing" so changes should be cancelled.
     */
    Cancel      = 'Cancel',
    /**
     * A resolution is applied and current transaction should be continued.
     */
    Resume      = 'Resume'
}

export type PropagationWalkingSpecification = {
    self           : boolean
    // recalculateParents
    ancestors      : boolean
    // moveParentAsGroup
    descendants    : boolean
    // cascadeChanges
    successors     : boolean
}

export type PropagationStateColor = 'green' | 'yellow' | 'red'

export type WrappedPropagationStateColor = [ PropagationStateColor ]

export type PropagationEventColorMap = Record<string | number, {
    task  : GanttCoreEvent,
    color : PropagationStateColor
}>;

export type PropagationEdgeColorMap = {
    // Horizontal successor edges from a task
    // {
    //     taskId : {
    //         successorTaskId : [dependency color]
    //         ...
    //     }
    //     ...
    //     1 : {
    //         2 : ['red'] // the array instance is shared with toById
    //     }
    // }
    fromById      : Record<string | number, Record<string | number, WrappedPropagationStateColor>>,

    // Horizontal predecessor edges to a task
    // {
    //     taskId : {
    //         predecessorTaskId : [dependency color]
    //         ...
    //     }
    //     ...
    //     2 : {
    //         1 : ['red'] // the array instance is shared with fromById
    //     }
    // }
    toById        : Record<string | number, Record<string | number, WrappedPropagationStateColor>>,

    // Vertical downward edge from a parent task to a children tasks
    // {
    //     parentTaskId : {
    //         childTaskId : [dependency color] // the array instance is shared with downToById
    //         ...
    //     }
    //     ...
    // }
    downFromById  : Record<string | number, Record<string | number, WrappedPropagationStateColor>>,

    // Vertical downward edge to a child task from a parent task
    // {
    //    childTaskId : [dependency color] // the array instance is shared with downFromById
    //    ...
    // }
    // The other participant is uniquely identified by child task parent node
    downToById    : Record<string | number, WrappedPropagationStateColor>,

    // Vertical upward edges from a child task to a parent task
    // {
    //    childTaskId : [dependency color] // the array instance is shared with upToById
    //    ...
    // }
    // The other participant is uniquely identified by child task parent node
    upFromById    : Record<string | number, WrappedPropagationStateColor>,

    // Vertical upward edges to a parent task from a child task
    // {
    //    parentTaskId : {
    //        childTaskId : [dependency color] // the array instance is shared with upFromById
    //        ...
    //    }
    //    ...
    // }
    upToById      : Record<string | number, Record<string | number, WrappedPropagationStateColor>>
};

type PropagationProcessor = (event : GanttCoreEvent, color : PropagationStateColor, tasksColorMap : PropagationEventColorMap, depsColorMap : PropagationEdgeColorMap) => void
type PropagationEventCollector = (event : GanttCoreEvent, eventColors : PropagationEventColorMap, edgeColors : PropagationEdgeColorMap) => GanttCoreEvent[]

export class CanWalkInPropagationOrderMixin extends Mixin(
    [SchedulerCoreProjectMixin],
    (base : AnyConstructor<SchedulerCoreProjectMixin, typeof SchedulerCoreProjectMixin>) => {

    class CanWalkInPropagationOrderMixin extends base {

        _propagationWalkingSpecificationsCache : Record<string, {
            collectorFn : PropagationEventCollector
        }> = {};

        /**
         * Walks source task list and it's dependent tasks in dependency resolution order.
         *
         * @param sourceEvents Walking source events
         * @param processorFn Function to call at each walking step
         */
        walkByPropagationSpecification(sourceEvents : GanttCoreEvent[], processorFn : PropagationProcessor, walkingSpec : PropagationWalkingSpecification) {
            const
                { project }     = this,
                { collectorFn } = this.resolveWalkingSpecification(walkingSpec);

            // Normalize provided propagation sources
            sourceEvents = sourceEvents.reduce((acc, curr) => {
                // we want to deal with real events
                curr = curr.originalRecord;
                // registered in the project
                if (curr.getProject() === project) {
                    acc.push(curr);
                }

                return acc;
            }, [] as GanttCoreEvent[]);

            return this.internalWalkPropagationAffectedEvents(
                [...sourceEvents],
                processorFn,
                collectorFn
            );
        }

        async internalWalkPropagationAffectedEvents(sourceEvents : GanttCoreEvent[], processorFn : PropagationProcessor, collectorFn : PropagationEventCollector) {
            const me = this;

            let
                // init affected events & edges maps
                eventColors = me.initPropagationEventColorMap(),
                edgeColors  = me.initPropagationEdgeColorMap(),
                done        = false,
                hadCycle    = true,
                event : GanttCoreEvent,
                eventId : string | number,
                color : PropagationStateColor;

            // collect affected events & edges between them
            me.collectInfoIntoPropagationColorMaps(sourceEvents, collectorFn, eventColors, edgeColors);

            while (hadCycle) {

                done = false;

                while (!done) {
                    done        = true;
                    hadCycle    = false;

                    for (eventId in eventColors) {
                        if (eventColors.hasOwnProperty(eventId) && eventColors[ eventId ].color != 'green') {

                            event = eventColors[ eventId ].task;
                            color = me.calculateEventPropagationColor(event, edgeColors);

                            if (color != 'red') {
                                me.setEventPropagationColor(color, event, eventColors, edgeColors);

                                processorFn(event, color, eventColors, edgeColors);

                                done = false;
                            }
                            else {
                                hadCycle = true;
                            }
                        }
                    }
                }

                if (hadCycle) {
                    let resolution;

                    if (me.hasListener('cycle')) {
                        resolution = await new Promise<CoreResolutionResult>((resolve, reject) => {
                            me.trigger('cycle', {
                                propagationData : {
                                    sourceEvents,
                                    eventColors,
                                    edgeColors
                                },
                                continueWithResolutionResult(result : CoreResolutionResult) {
                                    return resolve(result);
                                },
                            });
                        });
                    }

                    // selecting Resume means there were some fixes made
                    if (resolution === CoreResolutionResult.Resume) {
                        // re-initialize and collect affected events & edges between them
                        eventColors = me.initPropagationEventColorMap();
                        edgeColors  = me.initPropagationEdgeColorMap();

                        me.collectInfoIntoPropagationColorMaps(sourceEvents, collectorFn, eventColors, edgeColors);
                    }
                    // Stop iterating as-is
                    else {
                        hadCycle = false;
                    }
                }
            }
        }

        resolveWalkingSpecification(spec : PropagationWalkingSpecification) : { collectorFn : PropagationEventCollector } {
            const
                me = this,
                walkingSpecificationKey = (me.constructor as typeof CanWalkInPropagationOrderMixin).getWalkingSpecificationKey(spec);

            let result = me._propagationWalkingSpecificationsCache[walkingSpecificationKey];

            if (!result) {
                let collectingFns = [] as PropagationEventCollector[];

                spec.self            && (collectingFns.push(me.collectEventSelfPropagationInfo));
                // recalculateParents
                spec.ancestors       && (collectingFns.push(me.collectEventParentPropagationInfo));
                // moveParentAsGroup
                spec.descendants     && (collectingFns.push(me.collectEventChildrenPropagationInfo));
                // cascadeChanges
                spec.successors      && (collectingFns.push(me.collectEventSuccessorsPropagationInfo));

                result = {
                    collectorFn : me.composeTasksDepsCollectors(collectingFns)
                };

                this._propagationWalkingSpecificationsCache[walkingSpecificationKey] = result;
            }

            return result;
        }

        static getWalkingSpecificationKey(spec : PropagationWalkingSpecification) : string {
            const parts = [];

            for (let [prop, value] of Object.entries(spec)) {
                parts.push(prop, '=', String(value));
            }

            return parts.join(';');
        }

        composeTasksDepsCollectors(collectors : PropagationEventCollector[]) : PropagationEventCollector {
            return function(event : GanttCoreEvent, eventColorMap : PropagationEventColorMap, edgeColorMap : PropagationEdgeColorMap) : GanttCoreEvent[] {
                let collectedTasks = [] as GanttCoreEvent[];

                collectors.forEach(collectorFn => {
                    collectedTasks = collectedTasks.concat(collectorFn(event, eventColorMap, edgeColorMap));
                });

                return collectedTasks;
            };
        }

        collectInfoIntoPropagationColorMaps(events : GanttCoreEvent[], collectorFn : PropagationEventCollector, eventColors : PropagationEventColorMap, edgeColors : PropagationEdgeColorMap) {
            for (const event of events) {
                const collectedEvents = collectorFn(event, eventColors, edgeColors);
                if (collectedEvents.length > 0) {
                    this.collectInfoIntoPropagationColorMaps(collectedEvents, collectorFn, eventColors, edgeColors);
                }
            }
        }

        collectEventSelfPropagationInfo(event : GanttCoreEvent, eventColors : PropagationEventColorMap, edgeColors : PropagationEdgeColorMap) : GanttCoreEvent[] {
            const taskId = event.internalId;

            let result : GanttCoreEvent[] = [];

            if (!eventColors.hasOwnProperty(taskId)) {
                // Collecting task
                eventColors[ taskId ] = {
                    task  : event,
                    color : 'red'
                };
                result = [ event ];
            }

            return result;
        }

        collectEventParentPropagationInfo(event : GanttCoreEvent, eventColors : PropagationEventColorMap, edgeColors : PropagationEdgeColorMap) : GanttCoreEvent[] {
            const
                collectedEvents : GanttCoreEvent[] = [],
                { downFromById, downToById, upFromById, upToById } = edgeColors,
                { internalId : taskId, parent } = event;

            // Collecting task
            if (parent) {
                const parentId = parent.internalId;

                if (!eventColors.hasOwnProperty(parentId)) {
                    eventColors[ parentId ] = {
                        task  : parent,
                        color : 'red'
                    };

                    collectedEvents.push(parent);
                }

                // Collecting dependencies
                // NOTE: if a task is collected it doesn't mean all it's directional dependencies are collected
                const
                    downColor : WrappedPropagationStateColor = [ 'red' ],
                    upColor : WrappedPropagationStateColor   = [ 'red' ];

                !downFromById[ parentId ]           && (downFromById[ parentId ]            = {});
                !downFromById[ parentId ][ taskId ] && (downFromById[ parentId ][ taskId ]  = downColor);
                !downToById[ taskId ]               && (downToById[ taskId ]                = downColor);

                !upToById[ parentId ]           && (upToById[ parentId ]           = {});
                !upToById[ parentId ][ taskId ] && (upToById[ parentId ][ taskId ] = upColor);
                !upFromById[ taskId ]           && (upFromById[ taskId ]           = upColor);
            }

            return collectedEvents;
        }

        collectEventChildrenPropagationInfo(event : GanttCoreEvent, eventColors : PropagationEventColorMap, edgeColors : PropagationEdgeColorMap) : GanttCoreEvent[] {
            const
                collectedEvents : GanttCoreEvent[] = [],
                { downFromById, downToById, upFromById, upToById } = edgeColors,
                eventId = event.internalId;

            event.children?.forEach?.(childEvent => {
                const childId = childEvent.internalId;

                // Collecting tasks
                if (!eventColors[childId]) {

                    eventColors[ childId ] = {
                        task  : childEvent,
                        color : 'red'
                    };

                    collectedEvents.push(childEvent);
                }

                // Collecting dependencies
                // NOTE: if a task is collected it doesn't mean all it's directional dependencies are collected
                const
                    downColor : WrappedPropagationStateColor = [ 'red' ],
                    upColor : WrappedPropagationStateColor   = [ 'red' ];

                !downFromById[ eventId ]            && (downFromById[ eventId ]            = {});
                !downFromById[ eventId ][ childId ] && (downFromById[ eventId ][ childId ] = downColor);
                !downToById[ childId ]              && (downToById[ childId ]              = downColor);

                !upToById[ eventId ]            && (upToById[ eventId ]            = {});
                !upToById[ eventId ][ childId ] && (upToById[ eventId ][ childId ] = upColor);
                !upFromById[ childId ]          && (upFromById[ childId ]          = upColor);
            });

            return collectedEvents;
        }

        collectEventSuccessorsPropagationInfo(event : GanttCoreEvent, eventColors : PropagationEventColorMap, edgeColors : PropagationEdgeColorMap) : GanttCoreEvent[] {
            const
                collectedEvents : GanttCoreEvent[] = [],
                { fromById, toById } = edgeColors,
                eventId = event.internalId;

            for (const dependency of event.outgoingDeps) {

                const successorTask = (dependency.toEvent as GanttCoreEvent)?.originalRecord;

                if (!successorTask?.isModel) continue;

                const successorId = successorTask.internalId;

                // Collecting tasks
                if (!eventColors[successorId]) {

                    eventColors[ successorId ] = {
                        task  : successorTask,
                        color : 'red'
                    };

                    collectedEvents.push(successorTask);
                }

                // Collecting dependencies
                // NOTE: if a task is collected it doesn't mean all it's directional dependencies are collected
                const color : WrappedPropagationStateColor = [ 'red' ];

                !fromById[ eventId ]                && (fromById[ eventId ] = {});
                !fromById[ eventId ][ successorId ] && (fromById[ eventId ][ successorId ] = color);

                !toById[ successorId ]             && (toById[ successorId ] = {});
                !toById[ successorId ][ eventId ]   && (toById[ successorId ][ eventId ] = color);
            }

            return collectedEvents;
        }

        initPropagationEventColorMap() : PropagationEventColorMap {
            return {};
        }

        initPropagationEdgeColorMap() : PropagationEdgeColorMap {
            return {
                fromById     : {},
                toById       : {},
                downFromById : {},
                downToById   : {},
                upFromById   : {},
                upToById     : {}
            };
        }

        hasRedPropagationEdgesTo(event : GanttCoreEvent, edgeColors : PropagationEdgeColorMap) : boolean {
            const edges = edgeColors.toById[ event.internalId ];

            if (edges) {
                for (let value of Object.values(edges)) {
                    if (value?.[ 0 ] == 'red') {
                        return true;
                    }
                }
            }

            return false;
        }

        hasRedPropagationEdgesDownTo(event : GanttCoreEvent, edgeColors : PropagationEdgeColorMap) : boolean {
            const edges = edgeColors.downToById[event.internalId];

            return edges?.[0] == 'red';
        }

        hasRedPropagationEdgesDownFrom(event : GanttCoreEvent, edgeColors : PropagationEdgeColorMap) : boolean {
            const edges = edgeColors.downFromById[ event.internalId ];

            if (edges) {
                for (let value of Object.values(edges)) {
                    if (value?.[ 0 ] == 'red') {
                        return true;
                    }
                }
            }

            return false;
        }

        hasRedPropagationEdgesUpTo(event : GanttCoreEvent, edgeColors : PropagationEdgeColorMap) : boolean {
            const edges = edgeColors.upToById[ event.internalId ];

            if (edges) {
                for (const value of Object.values(edges)) {
                    if (value?.[ 0 ] == 'red') {
                        return true;
                    }
                }
            }

            return false;
        }

        calculateEventPropagationColor(event : GanttCoreEvent, edgeColors : PropagationEdgeColorMap) : PropagationStateColor {
            let color : PropagationStateColor = 'red';

            if (!this.hasRedPropagationEdgesTo(event, edgeColors) && !this.hasRedPropagationEdgesDownTo(event, edgeColors)) {
                if (!this.hasRedPropagationEdgesUpTo(event, edgeColors)) {
                    color = 'green';
                }
                else if (this.hasRedPropagationEdgesDownFrom(event, edgeColors)) {
                    color = 'yellow';
                }
            }

            return color;
        }

        setEventPropagationColor(color : PropagationStateColor, event : GanttCoreEvent, eventColors : PropagationEventColorMap, edgeColors : PropagationEdgeColorMap) {
            const
                eventId         = event.internalId,
                fromByIdMap     = edgeColors.fromById[ eventId ],
                downFromByIdMap = edgeColors.downFromById[ eventId ],
                upFromByIdMap   = edgeColors.upFromById[ eventId ];

            eventColors[ eventId ].color   = color;

            if (color == 'green') {

                if (fromByIdMap) {
                    for (let i in fromByIdMap) {
                        if (fromByIdMap.hasOwnProperty(i)) {
                            fromByIdMap[ i ][ 0 ] = color;
                        }
                    }
                }

                if (downFromByIdMap) {
                    for (let i in downFromByIdMap) {
                        if (downFromByIdMap.hasOwnProperty(i)) {
                            downFromByIdMap[ i ][ 0 ] = color;
                        }
                    }
                }

                if (upFromByIdMap) {
                    upFromByIdMap[ 0 ] = color;
                }
            }
            else if (color == 'yellow') {

                if (downFromByIdMap) {
                    for (let i in downFromByIdMap) {
                        if (downFromByIdMap.hasOwnProperty(i)) {
                            downFromByIdMap[ i ][ 0 ] = color;
                        }
                    }
                }
            }
            // else red and do nothing
        }
    }

    return CanWalkInPropagationOrderMixin;
}){};
