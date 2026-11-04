/**
 * The enumeration for possible resources types: work, materials and cost.
 */
export enum ResourceType {
    /**
     * Work resources like people and equipment.
     */
    Work     = 'work',
    /**
     * Materials (consumable supplies, such as concrete, or soil).
     */
    Material = 'material',
    /**
     * Cost resources (like some extra expenditures).
     */
    Cost     = 'cost'
}

/**
 * The enumeration for possible methods of cost charging - in the beginning,
 * on completion or prorated in time.
 */
export enum CostAccrual {
    /**
     * Costs are charged in the beginning
     */
    Start    = 'start',
    /**
     * Costs are charged afterwards on completion
     */
    End      = 'end',
    /**
     * Costs are prorated across event durations
     */
    Prorated = 'prorated'
}

/**
 * The enumeration for the time units
 */
export enum TimeUnit {
    Millisecond     = 'millisecond',
    Second          = 'second',
    Minute          = 'minute',
    ElapsedMinute   = 'eminute',
    Hour            = 'hour',
    ElapsedHour     = 'ehour',
    Day             = 'day',
    ElapsedDay      = 'eday',
    Week            = 'week',
    ElapsedWeek     = 'eweek',
    Month           = 'month',
    ElapsedMonth    = 'emonth',
    Quarter         = 'quarter',
    ElapsedQuarter  = 'equarter',
    Year            = 'year',
    ElapsedYear     = 'eyear'
}

/**
 * Type alias for duration values
 */
export type Duration = number

/**
 * The enumeration for the project constraint resolution ways.
 */
export enum ProjectConstraintResolution {
    /**
     * Adjust the event dates to honor the constraint.
     */
    Honor       = 'honor',
    /**
     * Ignore the constraint date and keep the event dates.
     */
    Ignore      = 'ignore',
    /**
     * Yield a conflict to pick a resolution based on some application logic
     * (like UI dialog allowing user to choose a resolution).
     */
    Conflict    = 'conflict'
}

/**
 * The enumeration for the supported constraint types
 */
export enum ConstraintType {
    /**
     * "Must start on" constraint.
     * Restricts an event to start on a [[HasDateConstraintMixin.constraintDate|specified date]].
     * The constraint cannot be used for a summary event.
     */
    MustStartOn         = 'muststarton',
    /**
     * "Must finish on" constraint.
     * Restricts an event to finish on a [[HasDateConstraintMixin.constraintDate|specified date]].
     * The constraint cannot be used for a summary event.
     */
    MustFinishOn        = 'mustfinishon',
    /**
     * "Start no earlier than" constraint.
     * Restricting an event to start on or after a [[HasDateConstraintMixin.constraintDate|specified date]].
     */
    StartNoEarlierThan  = 'startnoearlierthan',
    /**
     * "Start no later than" constraint.
     * Restricting an event to start on or before a [[HasDateConstraintMixin.constraintDate|specified date]].
     *
     * The constraint cannot be used for a summary task.
     */
    StartNoLaterThan    = 'startnolaterthan',
    /**
     * "Finish no earlier than" constraint.
     * Restricting an event to finish on or after a [[HasDateConstraintMixin.constraintDate|specified date]].
     *
     * The constraint cannot be used for a summary task.
     */
    FinishNoEarlierThan = 'finishnoearlierthan',
    /**
     * "Finish no later than" constraint.
     * Restricting an event to finish on or before a [[HasDateConstraintMixin.constraintDate|specified date]].
     */
    FinishNoLaterThan   = 'finishnolaterthan',
    /**
     * "As soon as possible" constraint.
     * Note this is not a date constraint per se, but a flag, that indicates that a task "gravitates" (is "stickying")
     * to the project's start date.
     */
    AsSoonAsPossible    = 'assoonaspossible',
    /**
     * "As late as possible" constraint.
     * Note this is not a date constraint per se, but a flag, that indicates that a task "gravitates" (is "stickying")
     * to the project's end date.
     */
    AsLateAsPossible    = 'aslateaspossible'
}

/**
 * The enumeration for the supported scheduling modes
 */
export enum SchedulingMode {
    Normal              = 'Normal',
    FixedDuration       = 'FixedDuration',
    FixedEffort         = 'FixedEffort',
    FixedUnits          = 'FixedUnits'
}

/**
 * The enumeration for the dependency validation result
 */
export enum DependencyValidationResult {
    /**
     * Dependency has no errors
     */
    NoError               = 0,
    /**
     * Indicates that the validated dependency builds a cycle
     */
    CyclicDependency      = 1,
    /**
     * Indicates that a dependency with the same predecessor and successor as validated one's already exists
     */
    DuplicatingDependency = 2
}

/**
 * The enumeration for the supported dependency types
 */
export enum DependencyType {
    /**
     * Start-to-Start (_SS_)
     *
     * With this dependency type, the succeeding event is delayed to start not earlier than the preceding event starts.
     */
    StartToStart = 0,
    /**
     * Start-to-Finish (_SF_)
     *
     * The finish of the succeeding event is constrained by the start of the preceding event.
     * So the successor cannot finish before the predecessor starts.
     */
    StartToEnd   = 1,
    /**
     * Finish-to-Start (_FS_)
     *
     * This type of dependency, restricts the dependent event to not start earlier than the preceding event finishes.
     */
    EndToStart   = 2,
    /**
     * Finish-to-Finish (_FF_)
     *
     * The succeeding event cannot finish before the completion of the preceding event.
     */
    EndToEnd     = 3
}

/**
 * The enumeration for the supported sources of the calendar for applying dependency lag.
 */
export enum DependenciesCalendar {
    /**
     * Use project calendar for the dependency lag
     */
    Project    = "Project",
    /**
     * Use predecessor calendar for the dependency lag
     */
    FromEvent  = "FromEvent",
    /**
     * Use successor calendar for the dependency lag
     */
    ToEvent    = "ToEvent",
    /**
     * Use 24/7 working time calendar for the dependency lag
     */
    AllWorking = "AllWorking"
}

/**
 * Enumerates ways the Engine should schedule started tasks.
 */
export enum StartedTaskScheduling {
    Auto       = "Auto",
    Manual     = "Manual"
}

/**
 * Engine provides with different project types, the enumeration describes the types currently available
 */
export enum ProjectType {
    SchedulerBasic = 1,
    SchedulerPro   = 2,
    Gantt          = 3,
}

/**
 * The enumeration for the scheduling direction
 */
export enum Direction {
    /**
     * Forward (or As Soon As Possible (ASAP)) scheduling.
     */
    Forward = 'Forward',
    /**
     * Backward (or As Late As Possible (ALAP)) scheduling.
     */
    Backward = 'Backward',

    None = 'None'
}



export enum ConstraintIntervalSide {
    Start = 'Start',
    End   = 'End'
}

export enum CalendarIntervalType {
    Week      = 'Week',
    Exception = 'Exception'
}

export enum TreatInconsistentIntervals {
    Skip    = 'Skip',
    Throw   = 'Throw'
}
