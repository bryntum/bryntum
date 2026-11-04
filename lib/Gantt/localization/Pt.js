import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Pt.js';

const locale = {

    localeName : 'Pt',
    localeDesc : 'Português',
    localeCode : 'pt',
    localeRtl  : false,

    Object : {
        Save : 'Guardar'
    },

    CostColumn : {
        cost : 'Custo'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorar calendário de recursos'
    },

    InactiveColumn : {
        Inactive : 'Inativo'
    },

    TaskInfoColumn : {
        info                     : 'Informações',
        postponedConflictTooltip : 'Há um conflito de agendamento não resolvido com este evento. Clique para resolver.'
    },

    ActualEffortColumn : {
        actualEffort : 'Esforço Real'
    },

    AddNewColumn : {
        'New Column' : 'Nova coluna'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Esforço Base'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Início do Plano Base'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Conclusão do Plano Base'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Duração do Plano Base'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Desvio de Início'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Desvio de Conclusão'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Variância de duração'
    },

    CalendarColumn : {
        Calendar : 'Calendário'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Fase inicial'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Fim prematuro'
    },

    LateStartDateColumn : {
        'Late Start' : 'Início atrasado'
    },

    LateEndDateColumn : {
        'Late End' : 'Fim atrasado'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Folga total'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Data de restrição'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Tipo de restrição'
    },

    DeadlineDateColumn : {
        Deadline : 'Prazo'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Dependência inválida'
    },

    DurationColumn : {
        Duration : 'Duração'
    },

    EffortColumn : {
        Effort : 'Esforço'
    },

    EndDateColumn : {
        Finish : 'Fim'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Agendado manualmente'
    },

    MilestoneColumn : {
        Milestone : 'Marco'
    },

    NameColumn : {
        Name : 'Nome'
    },

    NoteColumn : {
        Note : 'Nota'
    },

    PercentDoneColumn : {
        '% Done' : '% concluído'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : '% Planejado Feito'
    },

    PredecessorColumn : {
        Predecessors : 'Anteriores'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Recursos atribuídos',
        'more resources'     : 'mais recursos'
    },

    RollupColumn : {
        Rollup : 'Sumarização'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Modo de agendamento'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Direção de agendamento',
        inheritedFrom       : 'Herdado de',
        enforcedBy          : 'Imposto por'
    },

    SequenceColumn : {
        Sequence : 'Sequência'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Mostrar na cronologia'
    },

    StartDateColumn : {
        Start : 'Início'
    },

    SuccessorColumn : {
        Successors : 'Sucessores'
    },

    TaskCopyPaste : {
        copyTask  : 'Copiar',
        cutTask   : 'Cortar',
        pasteTask : 'Colar'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Renumerar'
    },

    DependencyField : {
        invalidDependencyFormat : 'Formato de dependência inválido'
    },

    ProjectLines : {
        'Project Start' : 'Início do projeto',
        'Project End'   : 'Fim do projeto',
        statusDate      : 'Data de status'
    },

    TaskTooltip : {
        Start    : 'Início',
        End      : 'Fim',
        Duration : 'Duração',
        Complete : 'Concluído'
    },

    BasicTaskEdit : {
        editTask        : 'Editar',
        name            : 'Nome',
        percentComplete : '% concluído',
        start           : 'Início',
        finish          : 'Término',
        duration        : 'Duração'
    },

    AssignmentGrid : {
        Name     : 'Nome do recurso',
        Units    : 'Unidades',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Quantidade',
        cost        : 'Custo',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Editar',
        Indent                 : 'Avanço',
        Outdent                : 'Diminuir avanço',
        'Convert to milestone' : 'Converter para marco',
        Add                    : 'Adicionar...',
        'New task'             : 'Nova tarefa',
        'New milestone'        : 'Novo marco',
        'Task above'           : 'Tarefa acima',
        'Task below'           : 'Tarefa abaixo',
        'Delete task'          : 'Eliminar',
        Milestone              : 'Marco',
        'Sub-task'             : 'Subtarefa',
        Successor              : 'Successor',
        Predecessor            : 'Predecessor',
        changeRejected         : 'O motor de agendamento rejeitou as alterações',
        linkTasks              : 'Adicionar dependências',
        unlinkTasks            : 'Remover dependências',
        color                  : 'Cor'
    },

    EventSegments : {
        splitTask : 'Dividir tarefa'
    },

    Indicators : {
        earlyDates   : 'Início/fim antecipado',
        lateDates    : 'Início/fim atrasado',
        Start        : 'Início',
        End          : 'Fim',
        deadlineDate : 'Prazo'
    },

    Versions : {
        indented      : 'Indentado',
        outdented     : 'Desindentado',
        cut           : 'Cortado',
        pasted        : 'Colado',
        deletedTasks  : 'Tarefas eliminadas',
        propertyNames : {
            baselines                   : 'Linhas de base',
            deadlineDate                : 'Prazo',
            description                 : 'Descrição',
            endDate                     : 'Data de término',
            projectConstraintResolution : 'Resolução de restrição do projeto',
            rollup                      : 'Consolidar',
            taskIconCls                 : 'Ícone da tarefa',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Informações do projeto',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Em geral',
        projectName  : 'Nome do Projeto',
        start        : 'Data de início',
        finish       : 'Data de término',
        scheduleFrom : 'Agendar de',
        calendar     : 'Calendário',
        readOnly     : 'Somente leitura',
        forward      : 'Data de início do projeto',
        backward     : 'Data de término do projeto'
    },

    ProjectEditorDescriptionTab : {
        description : 'Descrição'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Avançado',
        hoursPerDay  : 'Horas por dia',
        daysPerWeek  : 'Dias por semana',
        daysPerMonth : 'Dias por mês'
    }
};

export default LocaleHelper.publishLocale(locale);
