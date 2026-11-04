import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Hr.js';

const locale = {

    localeName : 'Hr',
    localeDesc : 'Hrvatski',
    localeCode : 'hr',
    localeRtl  : false,

    Object : {
        Save : 'Spremi'
    },

    CostColumn : {
        cost : 'trošak'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Zanemari kalendar resursa'
    },

    InactiveColumn : {
        Inactive : 'Neaktivno'
    },

    TaskInfoColumn : {
        info                     : 'Info',
        postponedConflictTooltip : 'Postoji neriješen sukob rasporeda s ovim događajem. Kliknite da biste to riješili.'
    },

    ActualEffortColumn : {
        actualEffort : 'Stvarni napor'
    },

    AddNewColumn : {
        'New Column' : 'Novi stupac'
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
        'Total Slack' : 'Ukupni slobodni hod'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Datum ograničenja'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Vrsta ograničenja'
    },

    DeadlineDateColumn : {
        Deadline : 'Rok'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Nevažeća ovisnost'
    },

    DurationColumn : {
        Duration : 'Trajanje'
    },

    EffortColumn : {
        Effort : 'Napor'
    },

    EndDateColumn : {
        Finish : 'Završetak'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Ručno zakazano'
    },

    MilestoneColumn : {
        Milestone : 'Kontrolna točka'
    },

    NameColumn : {
        Name : 'Naziv'
    },

    NoteColumn : {
        Note : 'Bilješka'
    },

    PercentDoneColumn : {
        '% Done' : '% dovršeno'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Planirani % izvršeno'
    },

    PredecessorColumn : {
        Predecessors : 'Prethodnici'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Dodijeljeni resursi',
        'more resources'     : 'više resursa'
    },

    RollupColumn : {
        Rollup : 'Smotajte'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Način zakazivanja'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Smjer planiranja',
        inheritedFrom       : 'Naslijeđeno od',
        enforcedBy          : 'Nametnuto od'
    },

    SequenceColumn : {
        Sequence : 'Redoslijed'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Prikaži u stupcu s vremenskim razdobljima'
    },

    StartDateColumn : {
        Start : 'Početak'
    },

    SuccessorColumn : {
        Successors : 'Nasljednici'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopiraj',
        cutTask   : 'Izreži',
        pasteTask : 'Zalijepi'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Ponovno numeriraj'
    },

    DependencyField : {
        invalidDependencyFormat : 'Nevažeći oblik ovisnosti'
    },

    ProjectLines : {
        'Project Start' : 'Početak projekta',
        'Project End'   : 'Završetak projekta',
        statusDate      : 'Statusni datum'
    },

    TaskTooltip : {
        Start    : 'Početak',
        End      : 'Završetak',
        Duration : 'Trajanje',
        Complete : 'Dovršeno'
    },

    BasicTaskEdit : {
        editTask        : 'Uredi',
        name            : 'Ime',
        percentComplete : '% dovršeno',
        start           : 'Početak',
        finish          : 'Završetak',
        duration        : 'Trajanje'
    },

    AssignmentGrid : {
        Name     : 'Naziv resursa',
        Units    : 'Jedinice',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Količina',
        cost        : 'Trošak',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Uredi',
        Indent                 : 'Uvuci',
        Outdent                : 'Izvuci',
        'Convert to milestone' : 'Pretvori u kontrolnu točku',
        Add                    : 'Dodaj...',
        'New task'             : 'Novi zadatak',
        'New milestone'        : 'Nova kontrola točka',
        'Task above'           : 'Zadatak iznad',
        'Task below'           : 'Zadatak ispod',
        'Delete task'          : 'Obriši',
        Milestone              : 'Kontrolna točka',
        'Sub-task'             : 'Podzadatak',
        Successor              : 'Nasljednik',
        Predecessor            : 'Prethodnik',
        changeRejected         : 'Mehanizam zakazivanja odbio je promjene',
        linkTasks              : 'Dodaj zavisnosti',
        unlinkTasks            : 'Uklonite zavisnosti',
        color                  : 'Boja'
    },

    EventSegments : {
        splitTask : 'Odvojeni zadatak'
    },

    Indicators : {
        earlyDates   : 'Rani početak/završetak',
        lateDates    : 'Kasni početak/završetak',
        Start        : 'Početak',
        End          : 'Završetak',
        deadlineDate : 'Rok'
    },

    Versions : {
        indented      : 'Uvučeno',
        outdented     : 'Izvučeno',
        cut           : 'Izrezano',
        pasted        : 'Zalijepljeno',
        deletedTasks  : 'Obrisani zadaci',
        propertyNames : {
            baselines                   : 'Osnovne linije',
            deadlineDate                : 'Rok',
            description                 : 'Opis',
            endDate                     : 'Datum završetka',
            projectConstraintResolution : 'Rješavanje ograničenja projekta',
            rollup                      : 'Sažetak',
            taskIconCls                 : 'Ikona zadatka',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Informacije o projektu',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'General',
        projectName  : 'Naziv projekta',
        start        : 'Datum početka',
        finish       : 'Datum završetka',
        scheduleFrom : 'Raspored Od',
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
        hoursPerDay  : 'Sati dnevno',
        daysPerWeek  : 'Dana u tjednu',
        daysPerMonth : 'Dana u mjesecu'
    }
};

export default LocaleHelper.publishLocale(locale);
