import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/EnGb.js';

const locale = {

    localeName : 'EnGb',
    localeDesc : 'English (GB)',
    localeCode : 'en-GB',
    localeRtl  : false,

    Object : {
        Save : 'Save'
    },

    CostColumn : {
        cost : 'Cost'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignore resource calendar'
    },

    InactiveColumn : {
        Inactive : 'Inactive'
    },

    TaskInfoColumn : {
        info                     : 'Info',
        postponedConflictTooltip : 'There is an unresolved scheduling conflict with this task. Click to resolve it.'
    },

    ActualEffortColumn : {
        actualEffort : 'Actual Effort'
    },

    AddNewColumn : {
        'New Column' : 'New Column'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Baseline Effort'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Baseline Start'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Baseline End'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Baseline Duration'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Start Variance'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'End Variance'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Duration Variance'
    },

    CalendarColumn : {
        Calendar : 'Calendar'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Early Start'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Early End'
    },

    LateStartDateColumn : {
        'Late Start' : 'Late Start'
    },

    LateEndDateColumn : {
        'Late End' : 'Late End'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Total Slack'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Constraint Date'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Constraint Type'
    },

    DeadlineDateColumn : {
        Deadline : 'Deadline'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Invalid dependency'
    },

    DurationColumn : {
        Duration : 'Duration'
    },

    EffortColumn : {
        Effort : 'Effort'
    },

    EndDateColumn : {
        Finish : 'Finish'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manually scheduled'
    },

    MilestoneColumn : {
        Milestone : 'Milestone'
    },

    NameColumn : {
        Name : 'Name'
    },

    NoteColumn : {
        Note : 'Note'
    },

    PercentDoneColumn : {
        '% Done' : '% Done'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Planned % Done'
    },

    PredecessorColumn : {
        Predecessors : 'Predecessors'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Assigned Resources',
        'more resources'     : 'more resources'
    },

    RollupColumn : {
        Rollup : 'Rollup'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Scheduling Mode'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Scheduling direction',
        inheritedFrom       : 'Inherited from',
        enforcedBy          : 'Enforced by'
    },

    SequenceColumn : {
        Sequence : 'Sequence'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Show in timeline'
    },

    StartDateColumn : {
        Start : 'Start'
    },

    SuccessorColumn : {
        Successors : 'Successors'
    },

    TaskCopyPaste : {
        copyTask  : 'Copy',
        cutTask   : 'Cut',
        pasteTask : 'Paste'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Renumber'
    },

    DependencyField : {
        invalidDependencyFormat : 'Invalid dependency format'
    },

    ProjectLines : {
        'Project Start' : 'Project start',
        'Project End'   : 'Project end',
        statusDate      : 'Status date'
    },

    TaskTooltip : {
        Start    : 'Start',
        End      : 'End',
        Duration : 'Duration',
        Complete : 'Complete'
    },

    BasicTaskEdit : {
        editTask        : 'Edit',
        name            : 'Name',
        percentComplete : '% complete',
        start           : 'Start',
        finish          : 'Finish',
        duration        : 'Duration'
    },

    AssignmentGrid : {
        Name     : 'Resource name',
        Units    : 'Units',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Quantity',
        cost        : 'Cost',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Edit',
        Indent                 : 'Indent',
        Outdent                : 'Outdent',
        'Convert to milestone' : 'Convert to milestone',
        Add                    : 'Add...',
        'New task'             : 'New task',
        'New milestone'        : 'New milestone',
        'Task above'           : 'Task above',
        'Task below'           : 'Task below',
        'Delete task'          : 'Delete',
        Milestone              : 'Milestone',
        'Sub-task'             : 'Subtask',
        Successor              : 'Successor',
        Predecessor            : 'Predecessor',
        changeRejected         : 'Scheduling engine rejected the changes',
        linkTasks              : 'Add dependencies',
        unlinkTasks            : 'Remove dependencies',
        color                  : 'Colour'
    },

    EventSegments : {
        splitTask : 'Split task'
    },

    Indicators : {
        earlyDates   : 'Early start/end',
        lateDates    : 'Late start/end',
        Start        : 'Start',
        End          : 'End',
        deadlineDate : 'Deadline'
    },

    Versions : {
        indented      : 'Indented',
        outdented     : 'Outdented',
        cut           : 'Cut',
        pasted        : 'Pasted',
        deletedTasks  : 'Deleted tasks',
        propertyNames : {
            baselines                   : 'Baselines',
            deadlineDate                : 'Deadline',
            description                 : 'Description',
            endDate                     : 'Finish date',
            projectConstraintResolution : 'Project constraint resolution',
            rollup                      : 'Rollup',
            taskIconCls                 : 'Task icon',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Project information',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'General',
        projectName  : 'Project Name',
        start        : 'Start Date',
        finish       : 'Finish Date',
        scheduleFrom : 'Schedule From',
        calendar     : 'Calendar',
        readOnly     : 'Read Only',
        forward      : 'Project start date',
        backward     : 'Project end date'
    },

    ProjectEditorDescriptionTab : {
        description : 'Description'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Advanced',
        hoursPerDay  : 'Hours Per Day',
        daysPerWeek  : 'Days Per Week',
        daysPerMonth : 'Days Per Month'
    }
};

export default LocaleHelper.publishLocale(locale);
