import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Lt.js';

const locale = {

    localeName : 'LT',
    localeDesc : 'Lietuvių',
    localeCode : 'lt-LT',
    localeRtl  : false,

    Object : {
        Save : 'Įrašyti'
    },

    CostColumn : {
        cost : 'Kaina'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignoruoti ištekliaus kalendorių'
    },

    InactiveColumn : {
        Inactive : 'Neaktyvi'
    },

    TaskInfoColumn : {
        info                     : 'Informacija',
        postponedConflictTooltip : 'Yra neišspręstas planavimo konfliktas su šiuo įvykiu. Spustelėkite, kad išspręstumėte.'
    },

    ActualEffortColumn : {
        actualEffort : 'Faktinės pastangos'
    },

    AddNewColumn : {
        'New Column' : 'Naujas stulpelis'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Pagrindinės pastangos'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Pradinė pradžia'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Pradinė pabaiga'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Pradinė trukmė'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Pražios neatiktis'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Pabaigos pokytis'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Trukmės neatitiktis'
    },

    CalendarColumn : {
        Calendar : 'Kalendorius'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Ankstyva pradžia'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Ankstyva pabaiga'
    },

    LateStartDateColumn : {
        'Late Start' : 'Vėlyva pradžia'
    },

    LateEndDateColumn : {
        'Late End' : 'Vėlyva pabaiga'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Bendras laiko rezervas'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Apribojimo data'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Apribojimo tipas'
    },

    DeadlineDateColumn : {
        Deadline : 'Galutinis terminas'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Negaliojantis priklausymas'
    },

    DurationColumn : {
        Duration : 'Trukmė'
    },

    EffortColumn : {
        Effort : 'Pastanga'
    },

    EndDateColumn : {
        Finish : 'Pabaiga'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Suplanuota rankiniu būdu'
    },

    MilestoneColumn : {
        Milestone : 'Etapas'
    },

    NameColumn : {
        Name : 'Pavadinimas'
    },

    NoteColumn : {
        Note : 'Pastaba'
    },

    PercentDoneColumn : {
        '% Done' : '% Atlikta'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Planuojama % atlikta'
    },

    PredecessorColumn : {
        Predecessors : 'Pirmtakai'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Priskirti ištekliai',
        'more resources'     : 'daugiau išteklių'
    },

    RollupColumn : {
        Rollup : 'Suktinis'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Planavimo režimas'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Planavimo kryptis',
        inheritedFrom       : 'Paveldėta iš',
        enforcedBy          : 'Įgalinta pagal'
    },

    SequenceColumn : {
        Sequence : 'Seka'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Rodyti laiko skalėje'
    },

    StartDateColumn : {
        Start : 'Pradžia'
    },

    SuccessorColumn : {
        Successors : 'Perėmėjai'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopijuoti',
        cutTask   : 'Kirpimas',
        pasteTask : 'Įklijavimas'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Pernumeruoti'
    },

    DependencyField : {
        invalidDependencyFormat : 'Negaliojantis priklausymo formatas'
    },

    ProjectLines : {
        'Project Start' : 'Projekto pradžia',
        'Project End'   : 'Projekto pabaiga',
        statusDate      : 'Statuso data'
    },

    TaskTooltip : {
        Start    : 'Pradėti',
        End      : 'Baigti',
        Duration : 'Trukmė',
        Complete : 'Baigti'
    },

    BasicTaskEdit : {
        editTask        : 'Redaguoti',
        name            : 'Pavadinimas',
        percentComplete : '% baigta',
        start           : 'Pradžia',
        finish          : 'Pabaiga',
        duration        : 'Trukmė'
    },

    AssignmentGrid : {
        Name     : 'Ištekliaus pavadinimas',
        Units    : 'Vienetai',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Kiekis',
        cost        : 'Kaina',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Redaguoti',
        Indent                 : 'Įtrauka',
        Outdent                : 'Ištrauka',
        'Convert to milestone' : 'Konvertuoti į etapą',
        Add                    : 'Pridėti...',
        'New task'             : 'Nauja užduotis',
        'New milestone'        : 'Naujas etapas',
        'Task above'           : 'Užduotis aukščiau',
        'Task below'           : 'Užduotis žemiau',
        'Delete task'          : 'Naikinti',
        Milestone              : 'Etapas',
        'Sub-task'             : 'Pagalbinė užduotis',
        Successor              : 'Perėmėjas',
        Predecessor            : 'Pirmtakas',
        changeRejected         : 'Planavimo modulis apmetė pokyčius',
        linkTasks              : 'Pridėti priklausymus',
        unlinkTasks            : 'Šalinti priklausymus',
        color                  : 'Spalva'
    },

    EventSegments : {
        splitTask : 'Skaidyti užduotį'
    },

    Indicators : {
        earlyDates   : 'Ankstyva pradžia / pabaiga',
        lateDates    : 'Vėlyva pradžia / pabaiga',
        Start        : 'Pradžia',
        End          : 'Pabaiga',
        deadlineDate : 'Galutinis terminas'
    },

    Versions : {
        indented      : 'Įtraukta',
        outdented     : 'Ištraukti',
        cut           : 'Kirpimas',
        pasted        : 'Įklijuota',
        deletedTasks  : 'Pašalintos užduotys',
        propertyNames : {
            baselines                   : 'Bazės',
            deadlineDate                : 'Terminas',
            description                 : 'Aprašymas',
            endDate                     : 'Pabaigos data',
            projectConstraintResolution : 'Projekto apribojimų sprendimas',
            rollup                      : 'Sujungimas',
            taskIconCls                 : 'Užduoties piktograma',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Informacija apie projektą',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Generolas',
        projectName  : 'Projekto pavadinimas',
        start        : 'Pradžios data',
        finish       : 'Baigimo data',
        scheduleFrom : 'Tvarkaraštis Nuo',
        calendar     : 'Kalendorius',
        readOnly     : 'Tik skaityti',
        forward      : 'Projekto pradžios data',
        backward     : 'Projekto pabaigos data'
    },

    ProjectEditorDescriptionTab : {
        description : 'Aprašymas'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Išplėstinė',
        hoursPerDay  : 'Valandos per dieną',
        daysPerWeek  : 'Dienos per savaitę',
        daysPerMonth : 'Dienos per mėnesį'
    }
};

export default LocaleHelper.publishLocale(locale);
