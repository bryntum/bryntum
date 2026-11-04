import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Sr.js';

const locale = {

    localeName : 'Sr',
    localeDesc : 'Srpski',
    localeCode : 'sr',
    localeRtl  : false,

    Object : {
        Save : 'Sačuvaj'
    },

    CostColumn : {
        cost : 'Troškovi'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignoriši kalendar resursa'
    },

    InactiveColumn : {
        Inactive : 'Neaktivan'
    },

    TaskInfoColumn : {
        info                     : 'Info',
        postponedConflictTooltip : 'Nerešeni sukob planiranja povezan je sa ovim događajem. Kliknite da biste ga dozvolili.'
    },

    ActualEffortColumn : {
        actualEffort : 'Stvarni napor'
    },

    AddNewColumn : {
        'New Column' : 'Nova kolona'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Osnovni napor'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Originalni datum početka'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Originalni datum završetak'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Originalni trajanje'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Odstupanje od datuma početka'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Odstupanje od datuma završetak'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Varijansa trajanja'
    },

    CalendarColumn : {
        Calendar : 'Kalendar'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Rani početak'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Rani završetak'
    },

    LateStartDateColumn : {
        'Late Start' : 'Kasni početak'
    },

    LateEndDateColumn : {
        'Late End' : 'Kasni završetak'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Ukupno kašnjenje'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Datum ograničenja'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Tip ograničenja'
    },

    DeadlineDateColumn : {
        Deadline : 'Krajnji rok'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Neispravna zavisnost'
    },

    DurationColumn : {
        Duration : 'Trajanje'
    },

    EffortColumn : {
        Effort : 'Trud'
    },

    EndDateColumn : {
        Finish : 'Završetak'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Ručno planirano'
    },

    MilestoneColumn : {
        Milestone : 'Prekretnica'
    },

    NameColumn : {
        Name : 'Ime'
    },

    NoteColumn : {
        Note : 'Napomena'
    },

    PercentDoneColumn : {
        '% Done' : '% dovršeno'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Planirano % Završeno'
    },

    PredecessorColumn : {
        Predecessors : 'Prethodnici'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Dodeljeni resursi',
        'more resources'     : 'još resursa'
    },

    RollupColumn : {
        Rollup : 'Postignuće'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Režim planiranja'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Smer planiranja',
        inheritedFrom       : 'Nasleđeno od',
        enforcedBy          : 'Pitao od'
    },

    SequenceColumn : {
        Sequence : 'Sekvenca'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Prikaži na vremenskoj liniji'
    },

    StartDateColumn : {
        Start : 'Početak'
    },

    SuccessorColumn : {
        Successors : 'Naslednici'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopiraj',
        cutTask   : 'Iseci',
        pasteTask : 'Nalepi'
    },

    WBSColumn : {
        WBS      : 'Pregled strukture rada',
        renumber : 'Prenumerisanje'
    },

    DependencyField : {
        invalidDependencyFormat : 'Neispravni format zavisnosti'
    },

    ProjectLines : {
        'Project Start' : 'Početak projekta',
        'Project End'   : 'Završetak projekta',
        statusDate      : 'Datum statusa'
    },

    TaskTooltip : {
        Start    : 'Početak',
        End      : 'Kraj',
        Duration : 'Trajanje',
        Complete : 'Završen'
    },

    BasicTaskEdit : {
        editTask        : 'Izmeni',
        name            : 'Ime',
        percentComplete : '% završeno',
        start           : 'Početak',
        finish          : 'Završetak',
        duration        : 'Trajanje'
    },

    AssignmentGrid : {
        Name     : 'Ime resursa',
        Units    : 'Jedinice',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Količina',
        cost        : 'Trošak',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Izmeni',
        Indent                 : 'Uvuci',
        Outdent                : 'Izbaci',
        'Convert to milestone' : 'Pretvori u prekretnicu',
        Add                    : 'Dodaj...',
        'New task'             : 'Novi zadatak',
        'New milestone'        : 'Nova prekretnica',
        'Task above'           : 'Zadatak iznad',
        'Task below'           : 'Zadatak ispod',
        'Delete task'          : 'Obriši',
        Milestone              : 'Prekretnica',
        'Sub-task'             : 'Pod-zadatak',
        Successor              : 'Naslednik',
        Predecessor            : 'Prethodnik',
        changeRejected         : 'Projektni algoritam je odbio promene',
        linkTasks              : 'Dodaj zavisnosti',
        unlinkTasks            : 'Uklonite zavisnosti',
        color                  : 'Boja'
    },

    EventSegments : {
        splitTask : 'Podeli zadatak'
    },

    Indicators : {
        earlyDates   : 'Rani početak/završetak',
        lateDates    : 'Kasni početak/kraj',
        Start        : 'Početak',
        End          : 'Kraj',
        deadlineDate : 'Krajnji rok'
    },

    Versions : {
        indented      : 'Uvučeno',
        outdented     : 'Izvučeno',
        cut           : 'Isečeno',
        pasted        : 'Umetnuto',
        deletedTasks  : 'Obrisani zadaci',
        propertyNames : {
            baselines                   : 'Osnovne linije',
            deadlineDate                : 'Rok',
            description                 : 'Opis',
            endDate                     : 'Datum završetka',
            projectConstraintResolution : 'Rešavanje ograničenja projekta',
            rollup                      : 'Sažetak',
            taskIconCls                 : 'Ikonica zadatka',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Informacije o projektu',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Opšte',
        projectName  : 'Naziv projekta',
        start        : 'Datum početka',
        finish       : 'Datum završetka',
        scheduleFrom : 'Planiranje od',
        calendar     : 'Kalendar',
        readOnly     : 'Samo za čitanje',
        forward      : 'Datum početka projekta',
        backward     : 'Datum završetka projekta'
    },

    ProjectEditorDescriptionTab : {
        description : 'Opis'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Napredno',
        hoursPerDay  : 'Sati u danu',
        daysPerWeek  : 'Dana u nedelji',
        daysPerMonth : 'Dana u mesecu'
    }
};

export default LocaleHelper.publishLocale(locale);
