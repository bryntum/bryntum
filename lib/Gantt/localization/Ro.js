import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Ro.js';

const locale = {

    localeName : 'Ro',
    localeDesc : 'Română',
    localeCode : 'ro',
    localeRtl  : false,

    Object : {
        Save : 'Salvare'
    },

    CostColumn : {
        cost : 'Cost'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorați calendarul de resurse'
    },

    InactiveColumn : {
        Inactive : 'Inactiv'
    },

    TaskInfoColumn : {
        info                     : 'Info',
        postponedConflictTooltip : 'Există un conflict de programare nerezolvat cu acest eveniment. Faceți clic pentru a o rezolva.'
    },

    ActualEffortColumn : {
        actualEffort : 'Efort Real'
    },

    AddNewColumn : {
        'New Column' : 'Coloană nouă'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Efort de Referință'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Pornire linie de bază'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Dată de finalizare linie de bază'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Durată de referință'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Pornirea varianță'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Varianta de finisare'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Varianță durată'
    },

    CalendarColumn : {
        Calendar : 'Calendar'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Începere anticipată'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Finalizare anticipată'
    },

    LateStartDateColumn : {
        'Late Start' : 'Începere târzie'
    },

    LateEndDateColumn : {
        'Late End' : 'Finalizare târzie'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Marjă totală'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Data restricției'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Tip de restricție'
    },

    DeadlineDateColumn : {
        Deadline : 'Termen limită'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Dependență nevalidă'
    },

    DurationColumn : {
        Duration : 'Durată'
    },

    EffortColumn : {
        Effort : 'Efort'
    },

    EndDateColumn : {
        Finish : 'Finalizare'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Programat manual'
    },

    MilestoneColumn : {
        Milestone : 'Reper'
    },

    NameColumn : {
        Name : 'Nume'
    },

    NoteColumn : {
        Note : 'Notă'
    },

    PercentDoneColumn : {
        '% Done' : '% efectuat'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : '% planificat gata'
    },

    PredecessorColumn : {
        Predecessors : 'Predecesori'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Resurse alocate',
        'more resources'     : 'mai multe resurse'
    },

    RollupColumn : {
        Rollup : 'Cumul'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Mod programare'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Direcția programării',
        inheritedFrom       : 'Moștenit de la',
        enforcedBy          : 'Impus de'
    },

    SequenceColumn : {
        Sequence : 'Secvență'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Afișare în cronologie'
    },

    StartDateColumn : {
        Start : 'Start'
    },

    SuccessorColumn : {
        Successors : 'Succesori'
    },

    TaskCopyPaste : {
        copyTask  : 'Copiere',
        cutTask   : 'Decupare',
        pasteTask : 'Lipire'
    },

    WBSColumn : {
        WBS      : 'SDL',
        renumber : 'Renumerotare'
    },

    DependencyField : {
        invalidDependencyFormat : 'Format dependență nevalid'
    },

    ProjectLines : {
        'Project Start' : 'Începere proiect',
        'Project End'   : 'Finalizare proiect',
        statusDate      : 'Data statusului'
    },

    TaskTooltip : {
        Start    : 'Începere',
        End      : 'Finalizare',
        Duration : 'Durată',
        Complete : 'Finalizat'
    },

    BasicTaskEdit : {
        editTask        : 'Editează',
        name            : 'Nume',
        percentComplete : '% complet',
        start           : 'Început',
        finish          : 'Final',
        duration        : 'Durată'
    },

    AssignmentGrid : {
        Name     : 'Nume resursă',
        Units    : 'Unități',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Cantitate',
        cost        : 'Cost',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Editare',
        Indent                 : 'Indentare',
        Outdent                : 'Indentare negativă',
        'Convert to milestone' : 'Convertire în reper',
        Add                    : 'Adăugare...',
        'New task'             : 'Sarcină nouă',
        'New milestone'        : 'Reper nou',
        'Task above'           : 'Sarcină deasupra',
        'Task below'           : 'Sarcină dedesubt',
        'Delete task'          : 'Ștergere',
        Milestone              : 'Reper',
        'Sub-task'             : 'Subsarcină',
        Successor              : 'Succesor',
        Predecessor            : 'Predecesor',
        changeRejected         : 'Motorul de programare a respins modificările',
        linkTasks              : 'Adăugați dependențe',
        unlinkTasks            : 'Eliminați dependențele',
        color                  : 'Culoare'
    },

    EventSegments : {
        splitTask : 'Împărțiți sarcina'
    },

    Indicators : {
        earlyDates   : 'Începere/finalizare anticipată',
        lateDates    : 'Începere/finalizare târzie',
        Start        : 'Începere',
        End          : 'Finalizare',
        deadlineDate : 'Termen limită'
    },

    Versions : {
        indented      : 'Indentat',
        outdented     : 'Adus la margine',
        cut           : 'Tăiat',
        pasted        : 'Lipit',
        deletedTasks  : 'Sarcini șterse',
        propertyNames : {
            baselines                   : 'Bazele',
            deadlineDate                : 'Termen limită',
            description                 : 'Descriere',
            endDate                     : 'Data de finalizare',
            projectConstraintResolution : 'Rezolvarea constrângerilor proiectului',
            rollup                      : 'Sumar',
            taskIconCls                 : 'Pictogramă sarcină',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Informații despre proiect',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'General',
        projectName  : 'Numele proiectului',
        start        : 'Data de începere',
        finish       : 'Data de terminare',
        scheduleFrom : 'Program de la',
        calendar     : 'Calendaristic',
        readOnly     : 'Numai citire',
        forward      : 'Data începerii proiectului',
        backward     : 'Data de încheiere a proiectului'
    },

    ProjectEditorDescriptionTab : {
        description : 'Descriere'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Avansat',
        hoursPerDay  : 'Ore pe zi',
        daysPerWeek  : 'Zile pe săptămână',
        daysPerMonth : 'Zile pe lună'
    }
};

export default LocaleHelper.publishLocale(locale);
