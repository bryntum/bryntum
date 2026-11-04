import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Lv.js';

const locale = {

    localeName : 'Lv',
    localeDesc : 'Latviešu',
    localeCode : 'lv-LV',
    localeRtl  : false,

    Object : {
        Save : 'Saglabāt'
    },

    CostColumn : {
        cost : 'Izmaksas'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorēt resursu kalendāru'
    },

    InactiveColumn : {
        Inactive : 'Neaktīva'
    },

    TaskInfoColumn : {
        info                     : 'Informācija',
        postponedConflictTooltip : 'Ar šo notikumu ir neatrisināts plānošanas konflikts. Noklikšķiniet, lai to atrisinātu.'
    },

    ActualEffortColumn : {
        actualEffort : 'Faktiskās pūles'
    },

    AddNewColumn : {
        'New Column' : 'Jauna kolonna'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Pamata pūles'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Pamatvarianta sākums'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Pamatvarianta beigas'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Pamatvarianta ilgums'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Sākuma variācijas'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Beigu variācijas'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Ilguma variācijas'
    },

    CalendarColumn : {
        Calendar : 'Kalendārs'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Agrīns sākums'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Agrīnas beigas'
    },

    LateStartDateColumn : {
        'Late Start' : 'Vēlīns sākums'
    },

    LateEndDateColumn : {
        'Late End' : 'Vēlīnas beigas'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Total Slack'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Ierobežojuma datums'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Ierobežojuma veids'
    },

    DeadlineDateColumn : {
        Deadline : 'Termiņš'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Nederīga atkarība'
    },

    DurationColumn : {
        Duration : 'Ilgums'
    },

    EffortColumn : {
        Effort : 'Pūliņi'
    },

    EndDateColumn : {
        Finish : 'Pabeigt'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuāli plānojams'
    },

    MilestoneColumn : {
        Milestone : 'Šķirtne'
    },

    NameColumn : {
        Name : 'Nosaukums'
    },

    NoteColumn : {
        Note : 'Piezīme'
    },

    PercentDoneColumn : {
        '% Done' : '% paveikts'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Plānotais % paveiktais'
    },

    PredecessorColumn : {
        Predecessors : 'Priekšgājēji'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Piešķirtie resursi',
        'more resources'     : 'vairāk resursu'
    },

    RollupColumn : {
        Rollup : 'Saritinājums'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Plānošanas režīms'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Plānošanas virziens',
        inheritedFrom       : 'Pārmantots no',
        enforcedBy          : 'Ieviesa'
    },

    SequenceColumn : {
        Sequence : 'Secība'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Parādīt laika skalā'
    },

    StartDateColumn : {
        Start : 'Sākums'
    },

    SuccessorColumn : {
        Successors : 'Pēcnācēji'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopēt',
        cutTask   : 'Izgriezt',
        pasteTask : 'Ielīmēt'
    },

    WBSColumn : {
        WBS      : 'DSS',
        renumber : 'Pārnumurēt'
    },

    DependencyField : {
        invalidDependencyFormat : 'Nederīgs atkarības formāts'
    },

    ProjectLines : {
        'Project Start' : 'Projekta sākums',
        'Project End'   : 'Projekta beigas',
        statusDate      : 'Statusa datums'
    },

    TaskTooltip : {
        Start    : 'Sākums',
        End      : 'Beigas',
        Duration : 'Ilgums',
        Complete : 'Pabeigt'
    },

    BasicTaskEdit : {
        editTask        : 'Rediģēt',
        name            : 'Nosaukums',
        percentComplete : '% pabeigts',
        start           : 'Sākums',
        finish          : 'Beigas',
        duration        : 'Ilgums'
    },

    AssignmentGrid : {
        Name     : 'Resursa nosaukums',
        Units    : 'Vienības',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Daudzums',
        cost        : 'Izmaksas',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Rediģēt',
        Indent                 : 'Atkāpe',
        Outdent                : 'Izkāpe',
        'Convert to milestone' : 'Konvertēt par šķirtni (starpposma mērķi)',
        Add                    : 'Pievienot...',
        'New task'             : 'Jauns uzdevums',
        'New milestone'        : 'Jauna šķirtne',
        'Task above'           : 'Uzdevumu augšā',
        'Task below'           : 'Uzdevumu apakšā',
        'Delete task'          : 'Dzēst',
        Milestone              : 'Šķirtne',
        'Sub-task'             : 'Apakšuzdevums',
        Successor              : 'Pēcnācējs',
        Predecessor            : 'Priekšgājējs',
        changeRejected         : 'Plānošanas dzinējs noraidīja izmaiņas',
        linkTasks              : 'Pievienot atkarības',
        unlinkTasks            : 'Noņemt atkarības',
        color                  : 'Krāsa'
    },

    EventSegments : {
        splitTask : 'Sadalīt notikumu'
    },

    Indicators : {
        earlyDates   : 'Agrīns sākums/beigas',
        lateDates    : 'Vēlīns sākums/beigas',
        Start        : 'Sākums',
        End          : 'Beigas',
        deadlineDate : 'Termiņš'
    },

    Versions : {
        indented      : 'Ar atkāpi',
        outdented     : 'Ar izkāpi',
        cut           : 'Izgriezts',
        pasted        : 'Ielīmēts',
        deletedTasks  : 'Dzēsti uzdevumi',
        propertyNames : {
            baselines                   : 'Bāzlīnijas',
            deadlineDate                : 'Termiņš',
            description                 : 'Apraksts',
            endDate                     : 'Beigu datums',
            projectConstraintResolution : 'Projekta ierobežojumu risinājums',
            rollup                      : 'Apkopojums',
            taskIconCls                 : 'Uzdevuma ikona',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Informācija par projektu',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Ģenerālis',
        projectName  : 'Projekta nosaukums',
        start        : 'Sākuma datums',
        finish       : 'Pabeigšanas datums',
        scheduleFrom : 'Grafiks No',
        calendar     : 'Kalendārs',
        readOnly     : 'Tikai lasāms',
        forward      : 'Projekta sākuma datums',
        backward     : 'Projekta beigu datums'
    },

    ProjectEditorDescriptionTab : {
        description : 'Apraksts'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Papildu',
        hoursPerDay  : 'Stundas Dienā',
        daysPerWeek  : 'Dienas nedēļā',
        daysPerMonth : 'Dienas Mēnesī'
    }
};

export default LocaleHelper.publishLocale(locale);
