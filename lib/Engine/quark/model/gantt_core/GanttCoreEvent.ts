import { AnyConstructor, Mixin } from '../../../../ChronoGraph/class/Mixin.js'
import { DependencyType, Duration, TimeUnit } from '../../../scheduling/Types.js'
import { SchedulerCoreEvent } from '../scheduler_core/SchedulerCoreEvent.js'
import { GanttCoreDependencyMixin } from './GanttCoreDependencyMixin.js'
import { CommitResult } from '../../Types.js'
import { MAX_DATE, MIN_DATE } from '../../../util/Constants.js'
import { GanttCoreProjectMixin } from './GanttCoreProjectMixin.js'

/**
 * Accumulated completion data a [[GanttCoreEvent]] subtree contributes.
 */
export interface ChildEventSummaryData {
    minDate : Date | null,
    maxDate : Date | null
}

/**
 * The event (task) class the Gantt community engine — [[GanttCoreProjectMixin]] — works with.
 *
 * It is a [[SchedulerCoreEvent]] (so it already has `startDate` / `endDate` / `duration` / `durationUnit` plus
 * assignments and dependencies) enriched with the Gantt-specific fields the engine reads while cascading
 * dependencies and rolling up summaries. Concrete products (e.g. the community `TaskModel`) plug in their own
 * record class at runtime; this class only describes the shape the engine relies on.
 *
 * @tier community
 */
export class GanttCoreEvent extends Mixin([SchedulerCoreEvent], (base : AnyConstructor<SchedulerCoreEvent, typeof SchedulerCoreEvent>) => {

    class GanttCoreEvent extends base {

        get isGanttCoreEvent () {
            return true
        }

        forceRescheduling : boolean

        _manuallyScheduled : boolean

        /**
         * When `true` the engine never repositions or resizes the task — not by dependencies, seeding or child roll-up.
         */
        get manuallyScheduled () { return this._manuallyScheduled ?? this.get('manuallyScheduled') ?? false }
        set manuallyScheduled (value : boolean) { this.proposeManuallyScheduled(value) }

        static get fields () : any {
            return [
                { name : 'manuallyScheduled', type : 'boolean', defaultValue : false }
            ]
        }

        /**
         * Returns all the incoming dependencies affecting the event.
         * This includes both the event own incoming dependencies
         * and the ones inherited from its parent events
         */
        getAllIncomingDeps () : Set<GanttCoreDependencyMixin> {
            let result : Set<GanttCoreDependencyMixin> = new Set()

            this.bubble(node => {
                result = new Set([...result, ...(node.incomingDeps as Set<GanttCoreDependencyMixin>)])
            })

            return result
        }

        /**
         * An alias for `children` property.
         */
        get childEvents () : Set<this> {
            return new Set(this.children || [])
        }

        get unscheduled () : boolean {
            return !this.startDate || !this.endDate
        }

        putStartDate(date : Date, keepDuration = true) {
            return this.proposeStartDate(date, keepDuration)
        }

        putEndDate(date : Date, keepDuration = false) {
            return this.proposeEndDate(date, keepDuration)
        }

        putDuration(duration : Duration, unit? : TimeUnit, keepStart : boolean = true) {
            return this.proposeDuration(duration, unit, keepStart)
        }

        calculateDatesByDelayFromParent(delayFromParentMs : Duration) : [Date, Date] | undefined {
            const me = this;

            if (delayFromParentMs != null) {
                const parentStartDate = (me.parent || me.project)?.startDate;

                if (parentStartDate) {
                    let durationMs : number;

                    const { startDate, endDate } = me;

                    if (startDate && endDate) {
                        durationMs = endDate.getTime() - startDate.getTime()
                    }
                    else {
                        const { duration } = me;

                        durationMs = duration ? me.dateHelper.as('ms', duration, me.durationUnit) : 0
                    }

                    return [
                        new Date(parentStartDate.getTime() + delayFromParentMs),
                        new Date(parentStartDate.getTime() + delayFromParentMs + durationMs)
                    ];
                }
            }
        }

        calculateDuration(startDate : Date, endDate : Date, durationUnit? : TimeUnit) : Duration {
            const
                { dateHelper }      = this,
                { Millisecond }     = TimeUnit,
                adjustDurationToDST = this.getProject()?.adjustDurationToDST

            let result = dateHelper.diff(startDate, endDate, Millisecond);

            if (adjustDurationToDST) {
                const dstDiff = startDate.getTimezoneOffset() - endDate.getTimezoneOffset();
                result += dstDiff * 60000;
            }

            return dateHelper.as(durationUnit || this.durationUnit, result, Millisecond);
        }

        calculateXDateByDuration(baseDate : Date, duration : Duration, unit : TimeUnit, isForward : boolean = true) {
            const result = this.dateHelper.add(baseDate, (isForward ? 1 : -1) * duration, unit)

            if (this.getProject()?.adjustDurationToDST) {
                const dstDiff = baseDate.getTimezoneOffset() - result.getTimezoneOffset()
                result.setTime(result.getTime() - dstDiff * 60000)
            }

            return result
        }

        proposeManuallyScheduled (manuallyScheduled : boolean) {
            if (typeof manuallyScheduled === 'string') {
                manuallyScheduled = this.fieldMap.manuallyScheduled.convert(manuallyScheduled, this.data, this);
            }

            if (this.inSetting || this._manuallyScheduled !== manuallyScheduled) {
                this._manuallyScheduled = manuallyScheduled
                this.propose({ manuallyScheduled })
            }
        }

        async setManuallyScheduled (value : boolean) : Promise<CommitResult> {
            this.proposeManuallyScheduled(value)

            return this.project?.commitAsync()
        }

        getManuallyScheduled () : boolean {
            return this.manuallyScheduled
        }

        static fieldsCausingPropagation = [...base.fieldsCausingPropagation, 'manuallyScheduled']

        _childSummaryData : ChildEventSummaryData | null

        get earlyStartDate () : Date {
            const dates = this.getEarlyDates();

            return dates?.[0];
        }

        get earlyEndDate () : Date {
            const dates = this.getEarlyDates();

            return dates?.[1];
        }

        getEarlyDates (incomingDeps? : Set<GanttCoreDependencyMixin>) : [Date, Date] {
            const
                me = this,
                { dateHelper, startDate, endDate } = me;

            // Manually scheduled tasks keep their dates — dependencies never reposition them. They can still act as
            // predecessors, so successors follow the dates the user pinned.
            if (me.manuallyScheduled) {
                return [startDate, endDate];
            }

            let durationMs : number;

            if (startDate && endDate) {
                durationMs = endDate.getTime() - startDate.getTime();
            }
            else {
                const { duration } = me;

                durationMs = duration ? dateHelper.as('ms', duration, me.durationUnit) : 0;
            }

            let earliestStart = -Infinity;

            for (const dependency of incomingDeps || me.getAllIncomingDeps()) {
                const
                    fromEvent                        = dependency.fromEvent as GanttCoreEvent,
                    { startDate, endDate }           = fromEvent,
                    { lag, lagUnit, type : depType } = dependency,
                    lagMs                            = lag && lagUnit ? dateHelper.as('ms', lag, lagUnit) : 0

                let candidate : number

                switch (depType) {
                    case DependencyType.StartToStart :
                        if (!startDate) {
                            continue;
                        }

                        candidate = startDate.getTime() + lagMs
                        break
                    case DependencyType.StartToEnd :
                        if (!startDate) {
                            continue;
                        }
                        candidate = startDate.getTime() + lagMs - durationMs
                        break
                    case DependencyType.EndToEnd :
                        if (!endDate) {
                            continue;
                        }
                        candidate = endDate.getTime() + lagMs - durationMs
                        break
                    case DependencyType.EndToStart :
                        if (!endDate) {
                            continue;
                        }
                        candidate = endDate.getTime() + lagMs
                        break
                }

                if (candidate > earliestStart) earliestStart = candidate;
            }

            const earlStartDate = earliestStart === -Infinity ? (me.project as GanttCoreProjectMixin).startDate : new Date(earliestStart);

            if (earlStartDate) {
                return [
                    earlStartDate,
                    new Date(earlStartDate.getTime() + durationMs)
                ];
            }
        }

        /**
         * Collects the task and its descendants span in a single pass.
         * Children are processed first, so a summary sees its children's fully rolled-up spans before computing its own.
         * Returns the accumulated [[ChildEventSummaryData]].
         * @internal
         */
        getChildSummaryData() : ChildEventSummaryData | null {
            const
                me           = this,
                dh           = me.dateHelper,
                { children } = me;

            let
                minDate : Date,
                maxDate : Date;

            // Leaf — contribute its own work duration and completion; nothing to roll up.
            if (!children?.length) {
                const { startDate, endDate, duration, durationUnit } = me;

                if (startDate && endDate) {
                    if (startDate > endDate) {
                        minDate = endDate;
                        maxDate = startDate;
                    }
                    else {
                        minDate = startDate;
                        maxDate = endDate;
                    }
                }
                else {
                    minDate = startDate || endDate;
                    maxDate = minDate && new Date(minDate);
                }

                return {
                    minDate,
                    maxDate
                }
            }

            // use cached value if have any
            if (me._childSummaryData) return me._childSummaryData;

            minDate = MAX_DATE;
            maxDate = MIN_DATE;

            const summaryData : ChildEventSummaryData = {
                minDate : null,
                maxDate : null
            }

            if (me.manuallyScheduled) {
                if (me.startDate) {
                    minDate = me.startDate;
                    maxDate = me.startDate;
                }
                if (me.endDate) {
                    minDate = minDate || me.endDate;
                    maxDate = me.endDate;
                }
            }

            me._childSummaryData = summaryData;

            for (const child of children) {
                const childData = child.getChildSummaryData()
                if (childData) {
                    if (childData.minDate && childData.minDate < minDate) {
                        minDate = childData.minDate
                    }

                    if (childData.maxDate && childData.maxDate > maxDate) {
                        maxDate = childData.maxDate
                    }
                }
            }

            if (minDate && minDate.getTime() - MAX_DATE.getTime() !== 0) {
                summaryData.minDate = minDate;
            }

            if (maxDate && maxDate.getTime() - MIN_DATE.getTime() !== 0) {
                summaryData.maxDate = maxDate;
            }

            return summaryData;
        }

        /**
         * Applies rolled-up span values to this task.
         * @internal
         */
        rollupChildSummaryData () : ChildEventSummaryData | null {
            const
                me           = this,
                $invalidated = me.project?.$invalidated,
                dh           = me.dateHelper;

            if (!$invalidated) return null

            const summaryData = this.getChildSummaryData() as ChildEventSummaryData;

            if (summaryData) {
                const
                    { startDate, endDate } = me,
                    { minDate, maxDate } = summaryData;

                // Span roll-up — skip for manually scheduled summaries (they keep their own dates/duration), when no child
                // is scheduled, or when the span is unchanged.
                if (!me.manuallyScheduled && minDate && maxDate &&
                    ((!startDate || (startDate.getTime() - minDate.getTime()))
                    || (!endDate || (endDate.getTime() - maxDate.getTime())))
                ) {
                    const newDuration = dh.as(me.durationUnit, maxDate.getTime() - minDate.getTime(), 'millisecond')

                    me._startDate = minDate;
                    me._endDate   = maxDate;
                    me._duration  = newDuration;

                    me.propose({
                        startDate : minDate,
                        endDate   : maxDate,
                        duration  : newDuration
                    });
                }
            }

            return summaryData
        }

        scheduleAtDates (newStartDate : Date, newEndDate? : Date) : void {
            const me = this;

            if (!newEndDate) {
                const { startDate, endDate } = me;

                let durationMs : number

                if (startDate && endDate) {
                    durationMs = endDate.getTime() - startDate.getTime()
                }
                else {
                    const { duration } = me
                    durationMs = duration ? me.dateHelper.as('ms', duration, me.durationUnit) : 0
                }

                newEndDate = new Date(newStartDate.getTime() + durationMs)
            }

            me._startDate = newStartDate;
            me._endDate   = newEndDate;

            me.propose({
                startDate : newStartDate,
                endDate   : newEndDate
            });
        }
    }

    return GanttCoreEvent
}){}
