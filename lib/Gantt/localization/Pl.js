import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Pl.js';

const locale = {

    localeName : 'Pl',
    localeDesc : 'Polski',
    localeCode : 'pl',
    localeRtl  : false,

    Object : {
        Save : 'Zapisz'
    },

    CostColumn : {
        cost : 'Koszt'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignoruj kalendarz zasobów'
    },

    InactiveColumn : {
        Inactive : 'Nieaktywny'
    },

    TaskInfoColumn : {
        info                     : 'Informacje',
        postponedConflictTooltip : 'Występuje nierozwiązany konflikt harmonogramu związany z tym wydarzeniem. Kliknij, aby rozwiązać ten problem.'
    },

    ActualEffortColumn : {
        actualEffort : 'Rzeczywisty wysiłek'
    },

    AddNewColumn : {
        'New Column' : 'Nowa kolumna'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Podstawowy wysiłek'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Rozpoczęcie według planu bazowego'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Zakończenie według planu bazowego'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Czas trwania według planu bazowego'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Odchylenie rozpoczęcia'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Odchylenie zakończenia'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Odchylenie czasu trwania'
    },

    CalendarColumn : {
        Calendar : 'Kalendarz'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Wczesne rozpoczęcie'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Wczesne zakończenie'
    },

    LateStartDateColumn : {
        'Late Start' : 'Późne rozpoczęcie'
    },

    LateEndDateColumn : {
        'Late End' : 'Późne zakończenie'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Całkowity zastój'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Data ograniczenia'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Rodzaj ograniczenia'
    },

    DeadlineDateColumn : {
        Deadline : 'Termin'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Nieprawidłowa zależność'
    },

    DurationColumn : {
        Duration : 'Czas trwania'
    },

    EffortColumn : {
        Effort : 'Wysiłek'
    },

    EndDateColumn : {
        Finish : 'Zakończ'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Zaplanowany ręcznie'
    },

    MilestoneColumn : {
        Milestone : 'Krok milowy'
    },

    NameColumn : {
        Name : 'Nazwa'
    },

    NoteColumn : {
        Note : 'Uwaga'
    },

    PercentDoneColumn : {
        '% Done' : 'Ukończone w %'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Planowany % wykonania'
    },

    PredecessorColumn : {
        Predecessors : 'Poprzednie wydarzenia'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Przypisane zasoby',
        'more resources'     : 'więcej zasobów'
    },

    RollupColumn : {
        Rollup : ' Zestawienie'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Tryb planowania'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Kierunek planowania',
        inheritedFrom       : 'Odziedziczone z',
        enforcedBy          : 'Narzucone przez'
    },

    SequenceColumn : {
        Sequence : 'Kolejność'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Pokaż na osi czasu'
    },

    StartDateColumn : {
        Start : 'Rozpocznij'
    },

    SuccessorColumn : {
        Successors : 'Następne wydarzenia'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopiuj',
        cutTask   : 'Wytnij',
        pasteTask : 'Wklej'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Zmień numer'
    },

    DependencyField : {
        invalidDependencyFormat : 'Nieprawidłowy format zależności'
    },

    ProjectLines : {
        'Project Start' : 'Rozpoczęcie projektu',
        'Project End'   : 'Zakończenie projektu',
        statusDate      : 'Data stanu'
    },

    TaskTooltip : {
        Start    : 'Początek',
        End      : 'Koniec',
        Duration : 'Czas trwania',
        Complete : 'Zakończony'
    },

    BasicTaskEdit : {
        editTask        : 'Edytuj',
        name            : 'Nazwa',
        percentComplete : '% ukończono',
        start           : 'Rozpocznij',
        finish          : 'Zakończ',
        duration        : 'Czas trwania'
    },

    AssignmentGrid : {
        Name     : 'Nazwa zasobu',
        Units    : 'Jednostki',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Ilość',
        cost        : 'Koszt',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Edytuj',
        Indent                 : 'Akapit',
        Outdent                : 'Zmniejsz akapit',
        'Convert to milestone' : 'Konwertuj na krok milowy',
        Add                    : 'Dodaj..',
        'New task'             : 'Nowe zadanie',
        'New milestone'        : 'Nowy krok milowy',
        'Task above'           : 'Zadanie powyżej',
        'Task below'           : 'Zadanie poniżej',
        'Delete task'          : 'Usuń',
        Milestone              : 'Krok milowy',
        'Sub-task'             : 'Podzadanie',
        Successor              : 'Następne wydarzenie',
        Predecessor            : 'Poprzednie wydarzenie',
        changeRejected         : 'Mechanizm planowania odrzucił zmiany',
        linkTasks              : 'Dodaj zależności',
        unlinkTasks            : 'Usuń zależności',
        color                  : 'Kolor'
    },

    EventSegments : {
        splitTask : 'Podziel zadanie'
    },

    Indicators : {
        earlyDates   : 'Wczesny początek/koniec',
        lateDates    : 'Późny początek/koniec',
        Start        : 'Początek',
        End          : 'Koniec',
        deadlineDate : 'Termin'
    },

    Versions : {
        indented      : 'Z wcięciem',
        outdented     : 'Bez wcięcia',
        cut           : 'Wytnij',
        pasted        : 'Wklejono',
        deletedTasks  : 'Usunięto zadania',
        propertyNames : {
            baselines                   : 'Podstawy',
            deadlineDate                : 'Termin',
            description                 : 'Opis',
            endDate                     : 'Data zakończenia',
            projectConstraintResolution : 'Rozwiązanie ograniczeń projektu',
            rollup                      : 'Podsumowanie',
            taskIconCls                 : 'Ikona zadania',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Informacje o projekcie',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Ogólny',
        projectName  : 'Nazwa projektu',
        start        : 'Data rozpoczęcia',
        finish       : 'Data zakończenia',
        scheduleFrom : 'Harmonogram od',
        calendar     : 'Kalendarz',
        readOnly     : 'Tylko do odczytu',
        forward      : 'Data rozpoczęcia projektu',
        backward     : 'Data zakończenia projektu'
    },

    ProjectEditorDescriptionTab : {
        description : 'Opis'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Zaawansowany',
        hoursPerDay  : 'Godziny dziennie',
        daysPerWeek  : 'Dni w tygodniu',
        daysPerMonth : 'Dni w miesiącu'
    }
};

export default LocaleHelper.publishLocale(locale);
