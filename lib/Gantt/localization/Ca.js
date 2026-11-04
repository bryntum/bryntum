import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Ca.js';

const locale = {

    localeName : 'Ca',
    localeDesc : 'Català',
    localeCode : 'ca-ES',
    localeRtl  : false,

    Object : {
        Save : 'Desa'
    },

    CostColumn : {
        cost : 'Cost'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignora el calendari del recurs'
    },

    InactiveColumn : {
        Inactive : 'Inactiu'
    },

    TaskInfoColumn : {
        info                     : 'Informació',
        postponedConflictTooltip : "Hi ha un conflicte de programació no resolt amb aquest esdeveniment. Feu clic per resoldre'l."
    },

    ActualEffortColumn : {
        actualEffort : 'Esforç Real'
    },

    AddNewColumn : {
        'New Column' : 'Columna nova'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Esforç de Referència'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Inici de referència'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Final de referència'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Durada de referència'
    },

    BaselineStartVarianceColumn : {
        startVariance : "Variància de l'inici"
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Variància del final'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Variància de la durada'
    },

    CalendarColumn : {
        Calendar : 'Calendari'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Inici prematur'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Final prematur'
    },

    LateStartDateColumn : {
        'Late Start' : 'Inici tardà'
    },

    LateEndDateColumn : {
        'Late End' : 'Final tardà'
    },

    TotalSlackColumn : {
        'Total Slack' : "Temps total d'inactivitat"
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Data de restricció'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Tipus de restricció'
    },

    DeadlineDateColumn : {
        Deadline : 'Venciment'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Dependència no vàlida'
    },

    DurationColumn : {
        Duration : 'Durada'
    },

    EffortColumn : {
        Effort : 'Esforç'
    },

    EndDateColumn : {
        Finish : 'Final'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Planificat manualment'
    },

    MilestoneColumn : {
        Milestone : 'Fita'
    },

    NameColumn : {
        Name : 'Nom'
    },

    NoteColumn : {
        Note : 'Nota'
    },

    PercentDoneColumn : {
        '% Done' : '% completat'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : '% planificat fet'
    },

    PredecessorColumn : {
        Predecessors : 'Predecessors'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Recursos assignats',
        'more resources'     : 'més recursos'
    },

    RollupColumn : {
        Rollup : 'Afegeix al resum'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Mode de planificació'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Direcció de la planificació',
        inheritedFrom       : 'Heretat de',
        enforcedBy          : 'Aplicat per'
    },

    SequenceColumn : {
        Sequence : 'Seqüència'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Mostra a la cronologia'
    },

    StartDateColumn : {
        Start : 'Inici'
    },

    SuccessorColumn : {
        Successors : 'Successors'
    },

    TaskCopyPaste : {
        copyTask  : 'Copia',
        cutTask   : 'Retalla',
        pasteTask : 'Enganxa'
    },

    WBSColumn : {
        WBS      : 'Estructura de desglossament de la feina',
        renumber : 'Reenumera'
    },

    DependencyField : {
        invalidDependencyFormat : 'Format de dependència no vàlid'
    },

    ProjectLines : {
        'Project Start' : 'Inici del projecte',
        'Project End'   : 'Final del projecte',
        statusDate      : "Data d'estat"
    },

    TaskTooltip : {
        Start    : 'Inici',
        End      : 'Final',
        Duration : 'Durada',
        Complete : 'Finalitzat'
    },

    BasicTaskEdit : {
        editTask        : 'Edita',
        name            : 'Nom',
        percentComplete : '% complet',
        start           : 'Inici',
        finish          : 'Final',
        duration        : 'Durada'
    },

    AssignmentGrid : {
        Name     : 'Nom del recurs',
        Units    : 'Unitats',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Quantitat',
        cost        : 'Cost',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Edita',
        Indent                 : 'Aplica sagnat',
        Outdent                : 'Elimina el sagnat',
        'Convert to milestone' : 'Converteix en una fita',
        Add                    : 'Afegeix...',
        'New task'             : 'Tasca nova',
        'New milestone'        : 'Fita nova',
        'Task above'           : 'Tasca anterior',
        'Task below'           : 'Tasca posterior',
        'Delete task'          : 'Suprimeix',
        Milestone              : 'Fita',
        'Sub-task'             : 'Subtasca',
        Successor              : 'Successor',
        Predecessor            : 'Predecessor',
        changeRejected         : 'El motor de planificació ha rebutjat els canvis',
        linkTasks              : 'Afegeix dependències',
        unlinkTasks            : 'Elimina dependències',
        color                  : 'Color'
    },

    EventSegments : {
        splitTask : 'Divideix la tasca'
    },

    Indicators : {
        earlyDates   : 'Inici/final prematur',
        lateDates    : 'Inici/final tardà',
        Start        : 'Inici',
        End          : 'Final',
        deadlineDate : 'Venciment'
    },

    Versions : {
        indented      : 'Amb sagnat',
        outdented     : 'Sense sagnat',
        cut           : 'Retalla',
        pasted        : 'Enganxat',
        deletedTasks  : 'Tasques suprimides',
        propertyNames : {
            baselines                   : 'Línies base',
            deadlineDate                : 'Data límit',
            description                 : 'Descripció',
            endDate                     : 'Data de finalització',
            projectConstraintResolution : 'Resolució de restriccions del projecte',
            rollup                      : 'Resum',
            taskIconCls                 : 'Icona de tasca',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Informació del projecte',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'General',
        projectName  : 'Nom del projecte',
        start        : "Data d'inici",
        finish       : "Data d'acabament",
        scheduleFrom : 'Programa des de',
        calendar     : 'Calendari',
        readOnly     : 'Només lectura',
        forward      : "Data d'inici del projecte",
        backward     : 'Data finalització del projecte'
    },

    ProjectEditorDescriptionTab : {
        description : 'Descripció'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Avançat',
        hoursPerDay  : 'Hores per dia',
        daysPerWeek  : 'Dies per setmana',
        daysPerMonth : 'Dies al mes'
    }
};

export default LocaleHelper.publishLocale(locale);
