import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Gl.js';

const locale = {

    localeName : 'Gl',
    localeDesc : 'Galego',
    localeCode : 'gl-ES',
    localeRtl  : false,

    Object : {
        Save : 'Gardar'
    },

    CostColumn : {
        cost : 'Custo'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorar calendario de recursos'
    },

    InactiveColumn : {
        Inactive : 'Inactivo'
    },

    TaskInfoColumn : {
        info                     : 'Información',
        postponedConflictTooltip : 'Hai un conflito de programación sen resolver con este evento. Fai clic para resolvelo.'
    },

    ActualEffortColumn : {
        actualEffort : 'Esforzo Real'
    },

    AddNewColumn : {
        'New Column' : 'Nova columna'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Esforzo Base'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Inicio previsto'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Fin previsto'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Duración prevista'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Variación do inicio'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Variación do fin'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Variación da duración'
    },

    CalendarColumn : {
        Calendar : 'Calendario'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Inicio anticipado'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Fin anticipado'
    },

    LateStartDateColumn : {
        'Late Start' : 'Inicio tardío'
    },

    LateEndDateColumn : {
        'Late End' : 'Fin tardío'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Atraso total'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Data de restrición'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Tipo de restrición'
    },

    DeadlineDateColumn : {
        Deadline : 'Data límite'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Dependencia non válida'
    },

    DurationColumn : {
        Duration : 'Duración'
    },

    EffortColumn : {
        Effort : 'Esforzo'
    },

    EndDateColumn : {
        Finish : 'Finalizar'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Programación manual'
    },

    MilestoneColumn : {
        Milestone : 'Fito'
    },

    NameColumn : {
        Name : 'Nome'
    },

    NoteColumn : {
        Note : 'Nota'
    },

    PercentDoneColumn : {
        '% Done' : '% finalizado'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : '% de feito previsto'
    },

    PredecessorColumn : {
        Predecessors : 'Predecesores'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Recursos atribuídos',
        'more resources'     : 'máis recursos'
    },

    RollupColumn : {
        Rollup : 'Resumo'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Modo de programación'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Dirección de programación',
        inheritedFrom       : 'Herdado de',
        enforcedBy          : 'Aplicado por'
    },

    SequenceColumn : {
        Sequence : 'Secuencia'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Mostrar na liña de tempo'
    },

    StartDateColumn : {
        Start : 'Inicio'
    },

    SuccessorColumn : {
        Successors : 'Succesores'
    },

    TaskCopyPaste : {
        copyTask  : 'Copiar',
        cutTask   : 'Cortar',
        pasteTask : 'Pegar'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Renumerar'
    },

    DependencyField : {
        invalidDependencyFormat : 'Formato de dependencia non válido'
    },

    ProjectLines : {
        'Project Start' : 'Inicio do proxecto',
        'Project End'   : 'Fin do proxecto',
        statusDate      : 'Data de estado'
    },

    TaskTooltip : {
        Start    : 'Inicio',
        End      : 'Finalización',
        Duration : 'Duración',
        Complete : 'Completar'
    },

    BasicTaskEdit : {
        editTask        : 'Editar',
        name            : 'Nome',
        percentComplete : '% completado',
        start           : 'Inicio',
        finish          : 'Finalizar',
        duration        : 'Duración'
    },

    AssignmentGrid : {
        Name     : 'Nome do recurso',
        Units    : 'Unidades',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Cantidade',
        cost        : 'Custo',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Editar',
        Indent                 : 'Sangría',
        Outdent                : 'Anular sangría',
        'Convert to milestone' : 'Converter en fito',
        Add                    : 'Engadir...',
        'New task'             : 'Nova tarefa',
        'New milestone'        : 'Novo fito',
        'Task above'           : 'Tarefa anterior',
        'Task below'           : 'Tarefa seguinte',
        'Delete task'          : 'Eliminar',
        Milestone              : 'Fito',
        'Sub-task'             : 'Subtarefa',
        Successor              : 'Succesor',
        Predecessor            : 'Predecesor',
        changeRejected         : 'O motor de programación rexeitou as modificacións',
        linkTasks              : 'Engadir dependencias',
        unlinkTasks            : 'Eliminar dependencias',
        color                  : 'Cor'
    },

    EventSegments : {
        splitTask : 'Dividir tarefa'
    },

    Indicators : {
        earlyDates   : 'Inicio/fin anticipado',
        lateDates    : 'Inicio/fin tardío',
        Start        : 'Inicio',
        End          : 'Finalización',
        deadlineDate : 'Data límite'
    },

    Versions : {
        indented      : 'Con sangría',
        outdented     : 'Sen sangría',
        cut           : 'Cortado',
        pasted        : 'Pegado',
        deletedTasks  : 'Tarefas eliminadas',
        propertyNames : {
            baselines                   : 'Liñas base',
            deadlineDate                : 'Data límite',
            description                 : 'Descrición',
            endDate                     : 'Data de finalización',
            projectConstraintResolution : 'Resolución de restrición do proxecto',
            rollup                      : 'Resumo',
            taskIconCls                 : 'Icona da tarefa',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Información do proxecto',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Xeral',
        projectName  : 'Nome do proxecto',
        start        : 'Data de inicio',
        finish       : 'Data de remate',
        scheduleFrom : 'Horario Desde',
        calendar     : 'Calendario',
        readOnly     : 'Só lectura',
        forward      : 'Data de inicio do proxecto',
        backward     : 'Data de finalización do proxecto'
    },

    ProjectEditorDescriptionTab : {
        description : 'Descrición'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Avanzado',
        hoursPerDay  : 'Horas por día',
        daysPerWeek  : 'Días por semana',
        daysPerMonth : 'Días ao mes'
    }
};

export default LocaleHelper.publishLocale(locale);
