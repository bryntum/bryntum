import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Da.js';

const locale = {

    localeName : 'Da',
    localeDesc : 'Dansk',
    localeCode : 'da',
    localeRtl  : false,

    Object : {
        Save : 'Gem'
    },

    CostColumn : {
        cost : 'Koste'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorer ressourcekalender'
    },

    InactiveColumn : {
        Inactive : 'Inaktiv'
    },

    TaskInfoColumn : {
        info                     : 'Info',
        postponedConflictTooltip : 'Der er en uløst planlægningskonflikt med denne begivenhed. Klik for at løse det.'
    },

    ActualEffortColumn : {
        actualEffort : 'Faktisk indsats'
    },

    AddNewColumn : {
        'New Column' : 'Tilføj ny kolonne...'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Baseline indsats'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Oprindelig startdato'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Oprindelig slutdato'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Oprindelig varighed'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Startdatoafvigelse'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Slutdatoafvigelse'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Varighedsafvigelse'
    },

    CalendarColumn : {
        Calendar : 'Kalender'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Tidlig start'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Tidlig afslutning'
    },

    LateStartDateColumn : {
        'Late Start' : 'Sen start'
    },

    LateEndDateColumn : {
        'Late End' : 'Sen afslutning'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Samlet buffertid'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Begrænsningsdato'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Begrænsningstype'
    },

    DeadlineDateColumn : {
        Deadline : 'Tidsfrist'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Ugyldig afhængighed, ændringen blev annulleret'
    },

    DurationColumn : {
        Duration : 'Varighed'
    },

    EffortColumn : {
        Effort : 'Indsats'
    },

    EndDateColumn : {
        Finish : 'Færdig'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuelt planlagt'
    },

    MilestoneColumn : {
        Milestone : 'Milepæl'
    },

    NameColumn : {
        Name : 'Navn'
    },

    NoteColumn : {
        Note : 'Note'
    },

    PercentDoneColumn : {
        '% Done' : '% færdig'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Planlagt % Udført'
    },

    PredecessorColumn : {
        Predecessors : 'Forgængere'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Tildelte ressourcer',
        'more resources'     : 'Yderligere ressourcer'
    },

    RollupColumn : {
        Rollup : 'Oprulning'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Planlægningstilstand'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Planlægningsretning',
        inheritedFrom       : 'Arvet fra',
        enforcedBy          : 'Pålagt af'
    },

    SequenceColumn : {
        Sequence : '#'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Vis på tidslinje'
    },

    StartDateColumn : {
        Start : 'Start'
    },

    SuccessorColumn : {
        Successors : 'Efterfølgere'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopi',
        cutTask   : 'klip',
        pasteTask : 'sæt ind'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Omnummer'
    },

    DependencyField : {
        invalidDependencyFormat : 'Ugyldigt afhængighedsformat'
    },

    ProjectLines : {
        'Project Start' : 'Start',
        'Project End'   : 'Slut',
        statusDate      : 'Status dato'
    },

    TaskTooltip : {
        Start    : 'Start',
        End      : 'Afslutning',
        Duration : 'Varighed',
        Complete : 'Færdig'
    },

    BasicTaskEdit : {
        editTask        : 'Rediger',
        name            : 'Navn',
        percentComplete : '% fuldført',
        start           : 'Start',
        finish          : 'Afslut',
        duration        : 'Varighed'
    },

    AssignmentGrid : {
        Name     : 'Ressourcenavn',
        Units    : 'Enheder',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Mængde',
        cost        : 'Omkostning',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Redigér',
        Indent                 : 'Ryk ind',
        Outdent                : 'Ryk ud',
        'Convert to milestone' : 'Konvertér til milepæl',
        Add                    : 'Tilføj...',
        'New task'             : 'Ny opgave',
        'New milestone'        : 'Ny milepæl',
        'Task above'           : 'Opgave over',
        'Task below'           : 'Opgave under',
        'Delete task'          : 'Slet',
        Milestone              : 'Milepæl',
        'Sub-task'             : 'Underopgave',
        Successor              : 'Efterfølger',
        Predecessor            : 'Forgænger',
        changeRejected         : 'Ændring afvist',
        linkTasks              : 'Tilføj afhængigheder',
        unlinkTasks            : 'Fjern afhængigheder',
        color                  : 'Farve'
    },

    EventSegments : {
        splitTask : 'Opdelt opgave'
    },

    Indicators : {
        earlyDates   : 'Tidlig start/afslutning',
        lateDates    : 'Sen start/afslutning',
        Start        : 'Start',
        End          : 'Afslutning',
        deadlineDate : 'Frist'
    },

    Versions : {
        indented      : 'indrykket',
        outdented     : 'Overdenen',
        cut           : 'Skære',
        pasted        : 'Indsat',
        deletedTasks  : 'Slettede opgaver',
        propertyNames : {
            baselines                   : 'Baseline',
            deadlineDate                : 'Deadline',
            description                 : 'Beskrivelse',
            endDate                     : 'Slutdato',
            projectConstraintResolution : 'Projektbegrænsningsløsning',
            rollup                      : 'Opsummering',
            taskIconCls                 : 'Opgaveikon',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Projektinformation',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Generel',
        projectName  : 'Projektnavn',
        start        : 'Startdato',
        finish       : 'Slutdato',
        scheduleFrom : 'Tidsplan fra',
        calendar     : 'Kalender',
        readOnly     : 'Kun læse',
        forward      : 'Projektets startdato',
        backward     : 'Projektets slutdato'
    },

    ProjectEditorDescriptionTab : {
        description : 'Beskrivelse'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Fremskreden',
        hoursPerDay  : 'Timer pr. dag',
        daysPerWeek  : 'Dage pr. uge',
        daysPerMonth : 'Dage pr. måned'
    }
};

export default LocaleHelper.publishLocale(locale);
