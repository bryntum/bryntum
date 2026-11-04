import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/No.js';

const locale = {

    localeName : 'No',
    localeDesc : 'Norsk',
    localeCode : 'no',
    localeRtl  : false,

    Object : {
        Save : 'Lagre'
    },

    CostColumn : {
        cost : 'Koste'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorer ressurskalender'
    },

    InactiveColumn : {
        Inactive : 'Ikke aktiv'
    },

    TaskInfoColumn : {
        info                     : 'Info',
        postponedConflictTooltip : 'Det er en uløst planleggingskonflikt med denne hendelsen. Klikk for å løse det.'
    },

    ActualEffortColumn : {
        actualEffort : 'Faktisk innsats'
    },

    AddNewColumn : {
        'New Column' : 'Ny kolonne'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Grunnleggende innsats'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Planlagt start'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Planlagt slutt'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Planlagt varighet'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Startavvik'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Sluttavvik'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Varighetsavvik'
    },

    CalendarColumn : {
        Calendar : 'Kalender'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Tidlig start'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Tidlig slutt'
    },

    LateStartDateColumn : {
        'Late Start' : 'Sen start'
    },

    LateEndDateColumn : {
        'Late End' : 'Sen slutt'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Total flyt'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Begrensningsdato'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Begrensningstype'
    },

    DeadlineDateColumn : {
        Deadline : 'Frist'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Ugyldig avhengighet'
    },

    DurationColumn : {
        Duration : 'Varighet'
    },

    EffortColumn : {
        Effort : 'Innsats'
    },

    EndDateColumn : {
        Finish : 'Slutt'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Planlagt manuelt'
    },

    MilestoneColumn : {
        Milestone : 'Milepæl'
    },

    NameColumn : {
        Name : 'Navn'
    },

    NoteColumn : {
        Note : 'Merknad'
    },

    PercentDoneColumn : {
        '% Done' : '% Ferdig'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Planlagt % Ferdig'
    },

    PredecessorColumn : {
        Predecessors : 'Tidligere'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Tildelte ressurser',
        'more resources'     : 'flere ressurser'
    },

    RollupColumn : {
        Rollup : ' Rapporter til oppsummering'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Planleggingsmodus'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Planleggingsretning',
        inheritedFrom       : 'Arvet fra',
        enforcedBy          : 'Påtvunget av'
    },

    SequenceColumn : {
        Sequence : 'Sekvens'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Vis på tidslinje'
    },

    StartDateColumn : {
        Start : 'Start'
    },

    SuccessorColumn : {
        Successors : 'Senere'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopi',
        cutTask   : 'Klipp ut',
        pasteTask : 'Lim'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Omnummerere'
    },

    DependencyField : {
        invalidDependencyFormat : 'Ugyldig avhengighetsformat'
    },

    ProjectLines : {
        'Project Start' : 'Prosjektstart',
        'Project End'   : 'Prosjektslutt',
        statusDate      : 'Status dato'
    },

    TaskTooltip : {
        Start    : 'Start',
        End      : 'Slutt',
        Duration : 'Varighet',
        Complete : 'Fullfør'
    },

    BasicTaskEdit : {
        editTask        : 'Rediger',
        name            : 'Navn',
        percentComplete : '% fullført',
        start           : 'Start',
        finish          : 'Fullfør',
        duration        : 'Varighet'
    },

    AssignmentGrid : {
        Name     : 'Ressursnavn',
        Units    : 'Enheter',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Antall',
        cost        : 'Kostnad',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Redigere',
        Indent                 : 'Innrykk',
        Outdent                : 'Utrykk',
        'Convert to milestone' : 'Konverter til milepæl',
        Add                    : 'Legg til...',
        'New task'             : 'Ny oppgave',
        'New milestone'        : 'Ny milepæl',
        'Task above'           : 'Oppgave ovenfor',
        'Task below'           : 'Oppgave nedenfor',
        'Delete task'          : 'Slett',
        Milestone              : 'Milepæl',
        'Sub-task'             : 'Deloppgave',
        Successor              : 'Senere',
        Predecessor            : 'Tidligere',
        changeRejected         : 'Planleggingsmotoren avviste endringer',
        linkTasks              : 'Legg til avhengigheter',
        unlinkTasks            : 'Fjern avhengigheter',
        color                  : 'Farge'
    },

    EventSegments : {
        splitTask : 'Delt oppgave'
    },

    Indicators : {
        earlyDates   : 'Tidlig start/slutt',
        lateDates    : 'Sen start/slutt',
        Start        : 'Start',
        End          : 'Slutt',
        deadlineDate : 'Frist'
    },

    Versions : {
        indented      : 'Innrykket',
        outdented     : 'Utkantet',
        cut           : 'Klipp ut',
        pasted        : 'Limt inn',
        deletedTasks  : 'Slettede oppgaver',
        propertyNames : {
            baselines                   : 'Baselines',
            deadlineDate                : 'Frist',
            description                 : 'Beskrivelse',
            endDate                     : 'Sluttdato',
            projectConstraintResolution : 'Prosjektbegrensningsløsning',
            rollup                      : 'Oppsummering',
            taskIconCls                 : 'Oppgaveikon',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Prosjektinformasjon',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'General',
        projectName  : 'Prosjektnavn',
        start        : 'Startdato',
        finish       : 'Sluttdato',
        scheduleFrom : 'Tidsplan fra',
        calendar     : 'Kalender',
        readOnly     : 'Kun lesetilgang',
        forward      : 'Startdato for prosjektet',
        backward     : 'Prosjektets sluttdato'
    },

    ProjectEditorDescriptionTab : {
        description : 'Beskrivelse'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Avansert',
        hoursPerDay  : 'Timer per dag',
        daysPerWeek  : 'Dager per uke',
        daysPerMonth : 'Dager per måned'
    }
};

export default LocaleHelper.publishLocale(locale);
