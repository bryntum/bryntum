import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Es.js';

const locale = {

    localeName : 'Es',
    localeDesc : 'Español',
    localeCode : 'es',
    localeRtl  : false,

    Object : {
        Save : 'Guardar'
    },

    CostColumn : {
        cost : 'Costo'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorar calendario de recursos'
    },

    InactiveColumn : {
        Inactive : 'Inactiva'
    },

    TaskInfoColumn : {
        info                     : 'Información',
        postponedConflictTooltip : 'Hay un conflicto de programación no resuelto con este evento. Haga clic para resolverlo.'
    },

    ActualEffortColumn : {
        actualEffort : 'Esfuerzo Real'
    },

    AddNewColumn : {
        'New Column' : 'Nueva columna'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Esfuerzo Base'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Comienzo previsto'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Fin previsto'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Duración prevista'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Variación de comienzo'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Variación de fin'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Varianza de duración'
    },

    CalendarColumn : {
        Calendar : 'Calendario'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Adelanto de inicio'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Finalización adelantada'
    },

    LateStartDateColumn : {
        'Late Start' : 'Inicio retrasado'
    },

    LateEndDateColumn : {
        'Late End' : 'Finalización retrasada'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Plazo total'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Fecha de restricción'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Tipo de restricción'
    },

    DeadlineDateColumn : {
        Deadline : 'Plazo límite'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Dependencia no válida'
    },

    DurationColumn : {
        Duration : 'Duración'
    },

    EffortColumn : {
        Effort : 'Trabajo'
    },

    EndDateColumn : {
        Finish : 'Finalizar'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Programado manualmente'
    },

    MilestoneColumn : {
        Milestone : 'Objetivo'
    },

    NameColumn : {
        Name : 'Nombre'
    },

    NoteColumn : {
        Note : 'Nota'
    },

    PercentDoneColumn : {
        '% Done' : '% realizado'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : '% planificado realizado'
    },

    PredecessorColumn : {
        Predecessors : 'Anteriores'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Recursos asignados',
        'more resources'     : 'más recursos'
    },

    RollupColumn : {
        Rollup : 'Aplazamiento al resumen'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Modo de programación'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Dirección de programación',
        inheritedFrom       : 'Heredado de',
        enforcedBy          : 'Impuesto por'
    },

    SequenceColumn : {
        Sequence : 'Secuencia'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Mostrar en la cronología'
    },

    StartDateColumn : {
        Start : 'Inicio'
    },

    SuccessorColumn : {
        Successors : 'Posteriores'
    },

    TaskCopyPaste : {
        copyTask  : 'Copiar',
        cutTask   : 'Cortar',
        pasteTask : 'Pegar'
    },

    WBSColumn : {
        WBS      : 'Estructura de desglose de trabajo',
        renumber : 'Renumerar'
    },

    DependencyField : {
        invalidDependencyFormat : 'Formato de dependencia no válido'
    },

    ProjectLines : {
        'Project Start' : 'Inicio del proyecto',
        'Project End'   : 'Finalización del proyecto',
        statusDate      : 'Situación a la fecha'
    },

    TaskTooltip : {
        Start    : 'Inicio',
        End      : 'Finalización',
        Duration : 'Duración',
        Complete : 'Completo'
    },

    BasicTaskEdit : {
        editTask        : 'Editar',
        name            : 'Nombre',
        percentComplete : '% completado',
        start           : 'Inicio',
        finish          : 'Finalizar',
        duration        : 'Duración'
    },

    AssignmentGrid : {
        Name     : 'Nombre del recurso',
        Units    : 'Unidades',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Cantidad',
        cost        : 'Costo',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Editar',
        Indent                 : 'Sangrar',
        Outdent                : 'Alargar',
        'Convert to milestone' : 'Convertir en objetivo',
        Add                    : 'Añadir...',
        'New task'             : 'Nueva tarea',
        'New milestone'        : 'Nuevo objetivo',
        'Task above'           : 'Tarea anterior',
        'Task below'           : 'Tarea siguiente',
        'Delete task'          : 'Eliminar',
        Milestone              : 'Objetivo',
        'Sub-task'             : 'Subtarea',
        Successor              : 'Anterior',
        Predecessor            : 'Posterior',
        changeRejected         : 'El motor de programación ha rechazado los cambios',
        linkTasks              : 'Agregar dependencias',
        unlinkTasks            : 'Eliminar dependencias',
        color                  : 'Color'
    },

    EventSegments : {
        splitTask : 'Dividir tarea'
    },

    Indicators : {
        earlyDates   : 'Inicio/finalización adelantado/a',
        lateDates    : 'Inicio/finalización retrasado/a',
        Start        : 'Inicio',
        End          : 'Finalización',
        deadlineDate : 'Plazo'
    },

    Versions : {
        indented      : 'Endentado',
        outdented     : 'Alargado',
        cut           : 'Cortado',
        pasted        : 'Pegado',
        deletedTasks  : 'Tareas eliminadas',
        propertyNames : {
            baselines                   : 'Bases',
            deadlineDate                : 'Fecha límite',
            description                 : 'Descripción',
            endDate                     : 'Fecha de finalización',
            projectConstraintResolution : 'Resolución de restricciones del proyecto',
            rollup                      : 'Resumen',
            taskIconCls                 : 'Icono de tarea',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Información del proyecto',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'General',
        projectName  : 'Nombre del proyecto',
        start        : 'Fecha de inicio',
        finish       : 'Fecha de finalización',
        scheduleFrom : 'Horario desde',
        calendar     : 'Calendario',
        readOnly     : 'Solo lectura',
        forward      : 'Fecha de inicio del proyecto',
        backward     : 'Fecha de finalización del proyecto'
    },

    ProjectEditorDescriptionTab : {
        description : 'Descripción'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Avanzado',
        hoursPerDay  : 'Horas por día',
        daysPerWeek  : 'Días por semana',
        daysPerMonth : 'Días por mes'
    }
};

export default LocaleHelper.publishLocale(locale);
