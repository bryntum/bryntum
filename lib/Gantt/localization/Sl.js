import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Sl.js';

const locale = {

    localeName : 'Sl',
    localeDesc : 'Slovensko',
    localeCode : 'sl',
    localeRtl  : false,

    Object : {
        Save : 'Shrani'
    },

    CostColumn : {
        cost : 'Stroški'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignoriraj koledar virov'
    },

    InactiveColumn : {
        Inactive : 'Neaktiven'
    },

    TaskInfoColumn : {
        info                     : 'Informacije',
        postponedConflictTooltip : 'S tem dogodkom obstaja nerazrešen spor glede razporeda. Kliknite za rešitev.'
    },

    ActualEffortColumn : {
        actualEffort : 'Dejanski napor'
    },

    AddNewColumn : {
        'New Column' : 'Nov stolpec'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Osnovni napor'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Začetni datum po osnovnem načrtu'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Zaključek po osnovnem načrtu'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Trajanje po osnovnem načrta'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Odmik od začetka'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Odmik zaključka'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Odmik trajanja'
    },

    CalendarColumn : {
        Calendar : 'Koledar'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Zgodnji začetek'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Zgodnji konec'
    },

    LateStartDateColumn : {
        'Late Start' : 'Pozni začetek'
    },

    LateEndDateColumn : {
        'Late End' : 'Pozni konec'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Kompletno mrtvilo'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Datum omejitve'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Vrsta omejitve'
    },

    DeadlineDateColumn : {
        Deadline : 'Rok'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Neveljavna odvisnost'
    },

    DurationColumn : {
        Duration : 'Trajanje'
    },

    EffortColumn : {
        Effort : 'Trud'
    },

    EndDateColumn : {
        Finish : 'Končaj'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Ročno razporejeno'
    },

    MilestoneColumn : {
        Milestone : 'Mejnik'
    },

    NameColumn : {
        Name : 'Ime'
    },

    NoteColumn : {
        Note : 'Opomba'
    },

    PercentDoneColumn : {
        '% Done' : '% dokončano'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Načrtovani % narejeno'
    },

    PredecessorColumn : {
        Predecessors : 'Predhodniki'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Dodeljeni viri',
        'more resources'     : 'več virov'
    },

    RollupColumn : {
        Rollup : 'Akumulacija'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Način razporejanja'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Smer razporejanja',
        inheritedFrom       : 'Podedovani od',
        enforcedBy          : 'Prisiljeni od'
    },

    SequenceColumn : {
        Sequence : 'Zaporedje'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Pokaži na časovnici'
    },

    StartDateColumn : {
        Start : 'Začetek'
    },

    SuccessorColumn : {
        Successors : 'Nasledniki'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopiraj',
        cutTask   : 'Izreži',
        pasteTask : 'Prilepi'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Preštevilči'
    },

    DependencyField : {
        invalidDependencyFormat : 'Neveljavna oblika odvisnosti'
    },

    ProjectLines : {
        'Project Start' : 'Začetek projekta',
        'Project End'   : 'Konec projekta',
        statusDate      : 'Datum stanja'
    },

    TaskTooltip : {
        Start    : 'Začetek',
        End      : 'Konec',
        Duration : 'Trajanje',
        Complete : 'Dokončano'
    },

    BasicTaskEdit : {
        editTask        : 'Uredi',
        name            : 'Ime',
        percentComplete : '% dokončano',
        start           : 'Začetek',
        finish          : 'Konec',
        duration        : 'Trajanje'
    },

    AssignmentGrid : {
        Name     : 'Ime vira',
        Units    : 'Enote',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Količina',
        cost        : 'Cena',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Uredi',
        Indent                 : 'Zamik',
        Outdent                : 'Odmik',
        'Convert to milestone' : 'Pretvori v mejnik',
        Add                    : 'Dodaj ...',
        'New task'             : 'Novo opravilo',
        'New milestone'        : 'Nov mejnik',
        'Task above'           : 'Opravilo zgoraj',
        'Task below'           : 'Opravilo spodaj',
        'Delete task'          : 'Izbriši',
        Milestone              : 'Mejnik',
        'Sub-task'             : 'Podopravilo',
        Successor              : 'Naslednik',
        Predecessor            : 'Predhodnik',
        changeRejected         : 'Mehanizem za razporejanje je zavrnil spremembe',
        linkTasks              : 'Dodaj odvisnosti',
        unlinkTasks            : 'Odstrani odvisnosti',
        color                  : 'Barva'
    },

    EventSegments : {
        splitTask : 'Razdeli nalogo'
    },

    Indicators : {
        earlyDates   : 'Zgodnji začetek/konec',
        lateDates    : 'Pozni začetek/konec',
        Start        : 'Začetek',
        End          : 'Konec',
        deadlineDate : 'Rok'
    },

    Versions : {
        indented      : 'Zamaknjeno',
        outdented     : 'Primaknjeno',
        cut           : 'Rezi',
        pasted        : 'Prilepljeno',
        deletedTasks  : 'Izbrisana opravila',
        propertyNames : {
            baselines                   : 'Osnovne črte',
            deadlineDate                : 'Rok',
            description                 : 'Opis',
            endDate                     : 'Datum zaključka',
            projectConstraintResolution : 'Rešitev omejitev projekta',
            rollup                      : 'Združevanje',
            taskIconCls                 : 'Ikona naloge',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Informacije o projektu',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Splošno',
        projectName  : 'Ime projekta',
        start        : 'Začetni datum',
        finish       : 'Končni datum',
        scheduleFrom : 'Urnik od',
        calendar     : 'Koledar',
        readOnly     : 'Samo za branje',
        forward      : 'Datum začetka projekta',
        backward     : 'Končni datum projekta'
    },

    ProjectEditorDescriptionTab : {
        description : 'Opis'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Napredno',
        hoursPerDay  : 'ur na dan',
        daysPerWeek  : 'Dni na teden',
        daysPerMonth : 'Dni na mesec'
    }
};

export default LocaleHelper.publishLocale(locale);
