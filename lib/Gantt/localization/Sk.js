import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Sk.js';

const locale = {

    localeName : 'Sk',
    localeDesc : 'Slovenský',
    localeCode : 'sk',
    localeRtl  : false,

    Object : {
        Save : 'Uložiť'
    },

    CostColumn : {
        cost : 'náklady'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorovať kalendár zdrojov'
    },

    InactiveColumn : {
        Inactive : 'Neaktívny'
    },

    TaskInfoColumn : {
        info                     : 'Info',
        postponedConflictTooltip : 'V súvislosti s touto udalosťou existuje nevyriešený konflikt v plánovaní. Kliknutím to vyriešite.'
    },

    ActualEffortColumn : {
        actualEffort : 'Skutočné úsilie'
    },

    AddNewColumn : {
        'New Column' : 'Nový stĺpec'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Základné úsilie'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Začatie podľa pôvodného plánu'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Dokončenie podľa pôvodného plánu'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Trvanie podľa pôvodného plánu'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Odchýlka začiatku'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Koncová odchýlka'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Odchýlka trvania'
    },

    CalendarColumn : {
        Calendar : 'Kalendár'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Early Začiatok'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Skorý End'
    },

    LateStartDateColumn : {
        'Late Start' : 'Neskorý začiatok'
    },

    LateEndDateColumn : {
        'Late End' : 'Neskorý koniec'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Celkový Slack'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Dátum obmedzenia'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Typ obmedzenia'
    },

    DeadlineDateColumn : {
        Deadline : 'Termín odovzdania'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Neplatná súvislosť'
    },

    DurationColumn : {
        Duration : 'Trvanie'
    },

    EffortColumn : {
        Effort : 'Úsilie'
    },

    EndDateColumn : {
        Finish : 'Ukončiť'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuálne naplánované'
    },

    MilestoneColumn : {
        Milestone : 'Míľnik'
    },

    NameColumn : {
        Name : 'Názov'
    },

    NoteColumn : {
        Note : 'Poznámka'
    },

    PercentDoneColumn : {
        '% Done' : '% Hotové'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Plánované % Hotovo'
    },

    PredecessorColumn : {
        Predecessors : 'Predecessors'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Pridelené zdroje',
        'more resources'     : 'viac zdrojov'
    },

    RollupColumn : {
        Rollup : 'Akumulácia'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Plánovací režim'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Smer plánovania',
        inheritedFrom       : 'Zdedené od',
        enforcedBy          : 'Vynútené od'
    },

    SequenceColumn : {
        Sequence : 'Poradie'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Zobraziť na časovej osi'
    },

    StartDateColumn : {
        Start : 'Začiatok'
    },

    SuccessorColumn : {
        Successors : 'Následníci'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopírovať',
        cutTask   : 'Orezať',
        pasteTask : 'Vložiť'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Prečíslovať'
    },

    DependencyField : {
        invalidDependencyFormat : 'Neplatný formát súvislosti'
    },

    ProjectLines : {
        'Project Start' : 'Začiatok projektu',
        'Project End'   : 'Koniec projektu',
        statusDate      : 'Dátum stavu'
    },

    TaskTooltip : {
        Start    : 'Začiatok',
        End      : 'Koniec',
        Duration : 'Trvanie',
        Complete : 'Dokončiť'
    },

    BasicTaskEdit : {
        editTask        : 'Upraviť',
        name            : 'Názov',
        percentComplete : '% dokončené',
        start           : 'Začiatok',
        finish          : 'Koniec',
        duration        : 'Trvanie'
    },

    AssignmentGrid : {
        Name     : 'Názov zdroja',
        Units    : 'Jednotky',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Množstvo',
        cost        : 'Cena',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Upraviť',
        Indent                 : 'Zarážka',
        Outdent                : 'Odsek',
        'Convert to milestone' : 'Konvertovať na míľnik',
        Add                    : 'Pridať...',
        'New task'             : 'Nová úloha',
        'New milestone'        : 'Nový míľnik',
        'Task above'           : 'Úloha nad',
        'Task below'           : 'Úloha pod',
        'Delete task'          : 'Vymazať',
        Milestone              : 'Míľnik',
        'Sub-task'             : 'Podúloha',
        Successor              : 'Následník',
        Predecessor            : 'Predchodca',
        changeRejected         : 'Systém plánovania odmietol zmeny',
        linkTasks              : 'Pridať závislosti',
        unlinkTasks            : 'Odstrániť závislosti',
        color                  : 'Farba'
    },

    EventSegments : {
        splitTask : 'Rozdeliť úlohu'
    },

    Indicators : {
        earlyDates   : 'Skorý začiatok/koniec',
        lateDates    : 'Neskorý začiatok/koniec',
        Start        : 'Začiatok',
        End          : 'Koniec',
        deadlineDate : 'Termín odovzdania'
    },

    Versions : {
        indented      : 'Odsadené',
        outdented     : 'Predsadené',
        cut           : 'Vystrihnuté',
        pasted        : 'Vložené',
        deletedTasks  : 'Odstránené úlohy',
        propertyNames : {
            baselines                   : 'Základné línie',
            deadlineDate                : 'Termín',
            description                 : 'Popis',
            endDate                     : 'Dátum ukončenia',
            projectConstraintResolution : 'Riešenie obmedzení projektu',
            rollup                      : 'Zhrnutie',
            taskIconCls                 : 'Ikona úlohy',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Informácie o projekte',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'generál',
        projectName  : 'Názov projektu',
        start        : 'Dátum začiatku',
        finish       : 'Dátum ukončenia',
        scheduleFrom : 'Plán od',
        calendar     : 'Kalendár',
        readOnly     : 'Iba na čítanie',
        forward      : 'Dátum začiatku projektu',
        backward     : 'Dátum ukončenia projektu'
    },

    ProjectEditorDescriptionTab : {
        description : 'Popis'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Pokročilé',
        hoursPerDay  : 'Hodiny za deň',
        daysPerWeek  : 'Dni v týždni',
        daysPerMonth : 'Dni v mesiaci'
    }
};

export default LocaleHelper.publishLocale(locale);
