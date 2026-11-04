/**
 * @tier community
 */
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/BetterMixin.js"
import { SchedulerCoreProjectMixin } from "../scheduler_core/SchedulerCoreProjectMixin.js"
import { GanttCoreEvent } from "./GanttCoreEvent.js"
import { GanttCoreDependencyMixin } from "./GanttCoreDependencyMixin.js"
import { GanttCoreEventStoreMixin } from "../../store/GanttCoreEventStoreMixin.js"
import { GanttCoreDependencyStoreMixin } from "../../store/GanttCoreDependencyStoreMixin.js"
import { CanWalkInPropagationOrderMixin, PropagationStateColor, PropagationEventColorMap, PropagationEdgeColorMap } from "./CanWalkInPropagationOrderMixin.js"
import { TimeUnit } from "../../../scheduling/Types.js"
import { MIN_DATE, MAX_DATE } from "../../../util/Constants.js"
import { CorePartOfProjectModelMixin } from "../mixin/CorePartOfProjectModelMixin.js"

/**
 * Gantt community engine. Extends [[SchedulerCoreProjectMixin]] with basic Gantt scheduling - forward dependency
 * cascade in topological order.
 *
 * It works with [[GanttCoreEvent]] records held in a [[GanttCoreEventStoreMixin]].
 *
 * Dependency types follow `DependencyBaseModel.Type` (0=SS, 1=SF, 2=FS, 3=FF). Lag honors `lag` + `lagUnit` from the
 * dependency model.
 *
 * Cascade is **As Soon As Possible**: a successor is positioned at the earliest start its incoming dependencies
 * allow, so it follows its predecessors both ways — pushed later when a predecessor grows/moves later, and pulled
 * earlier when a predecessor is moved back in time or resized smaller.
 *
 * Tasks flagged `manuallyScheduled` are exempt: the engine never repositions or
 * resizes them (not by dependencies, not by seeding, and — for summaries — not by child roll-up); they keep the
 * dates and duration the user set. They still participate as predecessors, so their successors follow them.
 *
 * Summary task roll-up runs after the cascade: each summary's start/end is recomputed from its children's span
 * (`min(child.start)` … `max(child.end)`), in post-order so nested summaries roll up correctly.
 *
 * @tier community
 */
export class GanttCoreProjectMixin extends Mixin(
    [ CorePartOfProjectModelMixin, SchedulerCoreProjectMixin, CanWalkInPropagationOrderMixin ],
    (base : AnyConstructor<
        CorePartOfProjectModelMixin & SchedulerCoreProjectMixin & CanWalkInPropagationOrderMixin,
        typeof CorePartOfProjectModelMixin & typeof SchedulerCoreProjectMixin & typeof CanWalkInPropagationOrderMixin
    >) => {

    class GanttCoreProjectMixin extends base {

        static $name = 'GanttCoreProjectMixin'

        inSetting       : boolean

        // The Gantt engine works with Gantt-typed events / event store (concrete products plug in their own
        // runtime classes; these narrow the types the engine sees).
        eventModelClass : typeof GanttCoreEvent

        eventStore      : GanttCoreEventStoreMixin

        dependencyStore : GanttCoreDependencyStoreMixin

        static get configurable () {
            return {
                eventModelClass      : GanttCoreEvent,
                dependencyModelClass : GanttCoreDependencyMixin,

                eventStoreClass      : GanttCoreEventStoreMixin,
                dependencyStoreClass : GanttCoreDependencyStoreMixin,
            }
        }

        invalidate (record?) {
            // This class combines project and part-of-project API. Both of them have invalidate() methods.
            // When we call project.invalidate() we refer part-of-project API
            // but super.invalidate() is the project API one and it expects 'record' as an argument
            if (!record) {
                record = this
            }

            super.invalidate(record)
        }

        get project () {
            return this
        }

        /**
         * A shorthand for reading event store root `children`
         */
        get childEvents () : Set<GanttCoreEvent> {
            return new Set(this.eventStore.rootNode?.children ?? [])
        }

        _startDate : Date

        get startDate () {
            return this._startDate ?? this.get('startDate') ?? null;
        }

        set startDate (date : Date) {
            this.proposeStartDate(date);
        }

        proposeStartDate (date : Date) {
            if (typeof date === 'string') {
                date = this.fieldMap.startDate.convert(date, this.data, this);
            }

            if (this.inSetting || date?.getTime() !== this.startDate?.getTime()) {
                this._startDate = date
                this.propose({ startDate : date });
            }
        }

        putStartDate (date : Date) {
            this.proposeStartDate(date);
        }

        setStartDate (date : Date) {
            this.startDate = date;

            return this.project?.commitAsync();
        }

        getStartDate () : Date {
            return this.startDate
        }

        getEndDate () : Date {
            return this.endDate
        }

        fillProjectDates () {
            const { startDate } = this;

            let
                earliestDate = MAX_DATE,
                latestDate = MIN_DATE;

            for (const event of this.eventStore.allRecords) {
                const { startDate, endDate } = event;

                if (startDate) {
                    if (startDate < earliestDate) earliestDate = startDate;
                    if (startDate > latestDate) latestDate = startDate;
                }

                if (endDate) {
                    if (endDate < earliestDate) earliestDate = endDate;
                    if (endDate > latestDate) latestDate = endDate;
                }
            }

            let hasChanges = false;
            const data : Partial<this> = {};

            if (!startDate && earliestDate.getTime() !== MAX_DATE.getTime()) {
                hasChanges = true;
                data.startDate = new Date(earliestDate);
            }

            if (latestDate.getTime() !== MIN_DATE.getTime()) {
                if (startDate && latestDate < startDate) {
                    latestDate = startDate;
                }
                hasChanges = true;
                data.endDate = new Date(latestDate);
            }

            if (hasChanges) {
                this.setData(data);
            }
        }

        /**
         * Invoked by the parent's commit pipeline after per-record normalization and before records are finalized.
         * Runs the dependency cascade, then rolls up summary spans and the project span in a single post-order pass;
         * records moved by any step are pushed into `$invalidated` so the commit's finalize loop writes them back.
         *
         * @internal
         */
        async propagateChanges () : Promise<void> {
            const
                affectedEvents = {} as Record<string | number, GanttCoreEvent>,
                sourceEvents   = this.getPropagationSourceEvents(),
                isSourceEvent  = sourceEvents.reduce<Record<string | number, GanttCoreEvent>>((acc, cur) => {
                    acc[cur.internalId] = cur;
                    return acc;
                }, {});

            // Fill the project startDate if needed
            this.fillProjectDates();

            await this.walkByPropagationSpecification(
                sourceEvents,
                (
                    event : GanttCoreEvent,
                    color : PropagationStateColor,
                    _eventColors : PropagationEventColorMap,
                    _edgeColors : PropagationEdgeColorMap
                ) => {
                    let
                        {
                            isLeaf,
                            forceRescheduling,
                            parent
                        }                    = event,
                        isParent             = !isLeaf,
                        autoScheduled        = !(event.manuallyScheduled /* || isSourceEvent[event.internalId] */),
                        parentOrProject      = parent ?? this,
                        parentNewStartDate   = parentOrProject?.$changed.startDate,
                        parentOldStartDate   = parentOrProject.$beforeChange.startDate,
                        parentNodeDateOffset = parentNewStartDate && parentOldStartDate && (parentNewStartDate.getTime() - parentOldStartDate.getTime());

                    if (autoScheduled) {
                        switch (true) {
                            case isLeaf && color == 'green' :
                            case isParent && color == 'yellow' :
                                // Support moving parent as a group. An event which start was changed in the same
                                // transaction (e.g. restored by undo along with its parent) keeps that start
                                if (parentNodeDateOffset && !('startDate' in event.$changed)) {
                                    const
                                        startDate         = event.getCurrentOrProposed('startDate'),
                                        delayFromParentMs = event.calculateDuration(parentOldStartDate as Date, startDate, TimeUnit.Millisecond);

                                    event.scheduleAtDates(...event.calculateDatesByDelayFromParent(delayFromParentMs));
                                }
                                else {
                                    let
                                        isPredecessorAffected = false,
                                        incomingDeps;

                                    if (!forceRescheduling) {
                                        incomingDeps = event.getAllIncomingDeps();

                                        for (const dep of incomingDeps) {
                                            const fromEvent = dep.fromEvent as GanttCoreEvent;

                                            if ((isPredecessorAffected = fromEvent && (affectedEvents.hasOwnProperty(fromEvent.internalId) ||
                                                isSourceEvent.hasOwnProperty(fromEvent.internalId)))
                                            ) {
                                                break;
                                            }
                                        }
                                    }

                                    // Reschedule the event if some of its predecessors were modified
                                    if (forceRescheduling || isPredecessorAffected || (isSourceEvent[event.internalId] && !isParent)) {
                                        const earlyDates = event.getEarlyDates(incomingDeps);

                                        if (earlyDates) {
                                            const
                                                [earlyStartDate, earlyEndDate] = earlyDates,
                                                { startDate, endDate } = event;

                                            // also reschedule if the event is a source and its dates violate its earliest dates
                                            if (forceRescheduling || isPredecessorAffected || ((startDate && startDate < earlyStartDate) || (endDate && endDate < earlyEndDate))) {
                                                event.scheduleAtDates(earlyStartDate, earlyEndDate);
                                            }

                                            event.forceRescheduling = false
                                        }
                                    }
                                }
                                break;

                            // The event is parent and all its children are processed -> rollup their data
                            case isParent && color == 'green':
                                event.rollupChildSummaryData();
                                break;
                        }

                        // remember the affected event
                        if (Object.keys(event.$changed).length) {
                            affectedEvents[event.internalId] = event;
                        }
                    }
                },
                {
                    self        : true,
                    // rollup children data to parents
                    ancestors   : true,
                    // move parent as a group
                    descendants : true,
                    // cascade changes through dependencies forward
                    successors  : true
                }
            );

            // Fill the project startDate if needed
            this.fillProjectDates();

            // clear child data rollup cache
            for (const event of this.eventStore.allRecords) {
                event._childSummaryData = null;
            }
            this.eventStore.rootNode._childSummaryData = null;
        }


        /**
         * Lightweight community-tier validation of a hypothetical dependency (the enterprise engine uses a ChronoGraph
         * branch for full conflict detection — not available here). Rejects self-links, duplicates, parent/child links
         * and dependency-graph cycles. Does not account for scheduling conflicts.
         *
         * @internal
         */
        async isValidDependency (fromEvent? : GanttCoreEvent, toEvent? : GanttCoreEvent, type? : number, ignoreDependency? : GanttCoreDependencyMixin | GanttCoreDependencyMixin[]) : Promise<boolean> {
            if (!fromEvent || !toEvent || fromEvent === toEvent) return false

            const ignored = ignoreDependency
                ? (Array.isArray(ignoreDependency) ? ignoreDependency : [ ignoreDependency ])
                : null

            // Already linked from → to (a duplicate dependency).
            const outgoing = (fromEvent as any).outgoingDeps
            if (outgoing) {
                for (const dep of outgoing) {
                    if (dep.toEvent === toEvent && !ignored?.includes(dep)) return false
                }
            }

            // Linking an ancestor to its descendant (or vice versa) is not allowed.
            if (typeof (fromEvent as any).contains === 'function' && ((fromEvent as any).contains(toEvent) || (toEvent as any).contains(fromEvent))) {
                return false
            }

            // Adding from → to is cyclic if `fromEvent` is already reachable from `toEvent` by following
            // outgoing dependency edges.
            if (this.dependencyChainReaches(toEvent, fromEvent, ignored)) return false

            return true
        }


        /**
         * Returns `true` if `target` is reachable from `start` by following outgoing dependency edges.
         *
         * @internal
         */
        dependencyChainReaches (start : GanttCoreEvent, target : GanttCoreEvent, ignored : GanttCoreDependencyMixin[] | null) : boolean {
            const visited = new Set<GanttCoreEvent>()
            const stack   = [ start ]

            while (stack.length) {
                const event = stack.pop()
                if (event === target) return true
                if (visited.has(event)) continue
                visited.add(event)

                const outgoing = (event as any).outgoingDeps
                if (outgoing) {
                    for (const dep of outgoing) {
                        if (ignored?.includes(dep)) continue
                        const next = dep.toEvent
                        if (next) stack.push(next)
                    }
                }
            }

            return false
        }

        getPropagationSources() : Array<CorePartOfProjectModelMixin> {
            const { removed : removedDependencies } = this.dependencyStore;

            return [...this.$invalidated].filter(record => Object.values(record.$changed).length ||
                (record as GanttCoreDependencyMixin).isGanttCoreDependencyMixin
                    // @ts-ignore
                    && removedDependencies.includes(record));
        }

        getPropagationSourceEvents() : GanttCoreEvent[] {
            const
                sources         = this.getPropagationSources(),
                [project]       = sources.filter(record => record === this) as GanttCoreProjectMixin[],
                result          = sources.filter(record => (record as GanttCoreEvent).isGanttCoreEvent) as GanttCoreEvent[],
                dependencies    = sources.filter(record => (record as GanttCoreDependencyMixin).isGanttCoreDependencyMixin) as GanttCoreDependencyMixin[];

            for (const dependency of dependencies) {
                const toEvent = dependency.toEvent as GanttCoreEvent
                if (toEvent?.isGanttCoreEvent) {
                    result.push(toEvent)
                    toEvent.forceRescheduling = true;
                }
            }

            if (project) {
                result.push(this.eventStore.rootNode);
            }

            // remove duplicating events
            return Array.from(new Set(result))
        }
    }

    return GanttCoreProjectMixin
}){}
