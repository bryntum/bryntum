import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/SvSE.js';

const locale = {

    localeName : 'SvSE',
    localeDesc : 'Svenska',
    localeCode : 'sv-SE',
    localeRtl  : false,

    Object : {
        Save : 'Spara'
    },

    CostColumn : {
        cost : 'Kostnad'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorera resurskalender'
    },

    InactiveColumn : {
        Inactive : 'Inaktiv'
    },

    TaskInfoColumn : {
        info                     : 'Info',
        postponedConflictTooltip : 'Det finns en olöst schemaläggningskonflikt med denna händelse. Klicka för att lösa det.'
    },

    ActualEffortColumn : {
        actualEffort : 'Faktisk insats'
    },

    AddNewColumn : {
        'New Column' : 'Lägg till ny kolumn...'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Grundinsats'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Originalstart'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Originalslut'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Originalvaraktighet'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Startavvikelse'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Slutavvikelse'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Varaktighetsavvikelse'
    },

    CalendarColumn : {
        Calendar : 'Kalender'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Tidig Start'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Tidigt Slut'
    },

    LateStartDateColumn : {
        'Late Start' : 'Sen Start'
    },

    LateEndDateColumn : {
        'Late End' : 'Sent Slut'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Totalt slack'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Måldatum'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Villkorstyp'
    },

    DeadlineDateColumn : {
        Deadline : 'Deadline'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Ogiltigt beroende'
    },

    DurationColumn : {
        Duration : 'Varaktighet'
    },

    EffortColumn : {
        Effort : 'Arbetsinsats'
    },

    EndDateColumn : {
        Finish : 'Slut'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuellt planerad'
    },

    MilestoneColumn : {
        Milestone : 'Milstolpe (v)'
    },

    NameColumn : {
        Name : 'Aktivitet'
    },

    NoteColumn : {
        Note : 'Anteckning'
    },

    PercentDoneColumn : {
        '% Done' : '% Färdig'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Planerad % Klar'
    },

    PredecessorColumn : {
        Predecessors : 'Föregående'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Tilldelade Resurser',
        'more resources'     : 'ytterligare resurser'
    },

    RollupColumn : {
        Rollup : 'Upplyft'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Läge'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Schemaläggningsriktning',
        inheritedFrom       : 'Ärvd från',
        enforcedBy          : 'Tvingad av'
    },

    SequenceColumn : {
        Sequence : '#'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Visa i tidslinje'
    },

    StartDateColumn : {
        Start : 'Start'
    },

    SuccessorColumn : {
        Successors : 'Efterföljande'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopiera',
        cutTask   : 'Klipp ut',
        pasteTask : 'Klistra in'
    },

    WBSColumn : {
        WBS      : 'Strukturkod',
        renumber : 'Numrera om'
    },

    DependencyField : {
        invalidDependencyFormat : 'Ogiltigt format för beroende'
    },

    ProjectLines : {
        'Project Start' : 'Projektstart',
        'Project End'   : 'Projektslut',
        statusDate      : 'Status datum'
    },

    TaskTooltip : {
        Start    : 'Börjar',
        End      : 'Slutar',
        Duration : 'Längd',
        Complete : 'Färdig'
    },

    BasicTaskEdit : {
        editTask        : 'Redigera',
        name            : 'Namn',
        percentComplete : '% klart',
        start           : 'Start',
        finish          : 'Slut',
        duration        : 'Varaktighet'
    },

    AssignmentGrid : {
        Name     : 'Resursnamn',
        Units    : 'Enheter',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Kvantitet',
        cost        : 'Kostnad',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Redigera',
        Indent                 : 'Indrag',
        Outdent                : 'Minska indrag',
        'Convert to milestone' : 'Konvertera till milstolpe',
        Add                    : 'Lägg till...',
        'New task'             : 'Ny aktivitet',
        'New milestone'        : 'Ny milstolpe',
        'Task above'           : 'Aktivitet över',
        'Task below'           : 'Aktivitet under',
        'Delete task'          : 'Ta bort',
        Milestone              : 'Milstolpe',
        'Sub-task'             : 'Underaktivitet',
        Successor              : 'Efterföljare',
        Predecessor            : 'Föregångare',
        changeRejected         : 'Schemaläggningsmotorn avvisade ändringarna',
        linkTasks              : 'Lägg till beroenden',
        unlinkTasks            : 'Ta bort beroenden',
        color                  : 'Färg'
    },

    EventSegments : {
        splitTask : 'Dela aktivitet'
    },

    Indicators : {
        earlyDates   : 'Tidigt start/slut',
        lateDates    : 'Sent start/slut',
        Start        : 'Start',
        End          : 'Slut',
        deadlineDate : 'Deadline'
    },

    Versions : {
        indented      : 'Ökade indrag',
        outdented     : 'Minskade indrag',
        cut           : 'Klippte ut',
        pasted        : 'Klistrade in',
        deletedTasks  : 'Tog bort aktiviteter',
        propertyNames : {
            baselines                   : 'Baslinjer',
            deadlineDate                : 'Deadline',
            description                 : 'Beskrivning',
            endDate                     : 'Slutdatum',
            projectConstraintResolution : 'Projektbegränsningslösning',
            rollup                      : 'Sammanställning',
            taskIconCls                 : 'Uppgiftsikon',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Projektinformation',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Allmänt',
        projectName  : 'Projektnamn',
        start        : 'Startdatum',
        finish       : 'Slutdatum',
        scheduleFrom : 'Schema från',
        calendar     : 'Kalender',
        readOnly     : 'Endast läs',
        forward      : 'Projektets startdatum',
        backward     : 'Projektets slutdatum'
    },

    ProjectEditorDescriptionTab : {
        description : 'Beskrivning'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Avancerat',
        hoursPerDay  : 'Timmar per dag',
        daysPerWeek  : 'Dagar per vecka',
        daysPerMonth : 'Dagar per månad'
    }
};

export default LocaleHelper.publishLocale(locale);
