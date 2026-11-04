import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/PtBr.js';
import '../../Grid/localization/PtBr.js';

const locale = {

    localeName : 'PtBr',
    localeDesc : 'Português do Brasil',
    localeCode : 'pt-BR',
    localeRtl  : false,

    Object : {
        newEvent    : 'Novo evento',
        information : 'Informação',
        showDetails : 'Mostrar detalhes'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' evento' + (data !== 1 ? 's' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Alternar a coluna do layout do recurso. SPACE para o menu de contexto.'
    },

    Dependencies : {
        from    : 'De',
        to      : 'Até',
        valid   : 'Válido',
        invalid : 'Inválido'
    },

    DependencyType : {
        SS           : 'II',
        SF           : 'IF',
        FS           : 'FI',
        FF           : 'FF',
        StartToStart : 'Início a Início',
        StartToEnd   : 'Início a Fim',
        EndToStart   : 'Fim a Início',
        EndToEnd     : 'Fim a Fim',
        short        : [
            'II',
            'IF',
            'FI',
            'FF'
        ],
        long : [
            'Início a Início',
            'Início a Fim',
            'Fim a Início',
            'Fim a Fim'
        ]
    },

    DependencyEdit : {
        From              : 'De',
        To                : 'A',
        Type              : 'Tipo',
        Lag               : 'Atraso',
        color             : 'Cor',
        lineStyle         : 'Estilo de linha',
        solid             : 'Sólido',
        dashed            : 'Tracejado',
        dotted            : 'Pontilhado',
        dashDot           : 'Traço-ponto',
        longDash          : 'Traço longo',
        'Edit dependency' : 'Editar dependência',
        Save              : 'Guardar',
        Delete            : 'Eliminar',
        Cancel            : 'Cancelar',
        StartToStart      : 'Início a Início',
        StartToEnd        : 'Início a Fim',
        EndToStart        : 'Fim a Início',
        EndToEnd          : 'Fim a Fim',
        Active            : 'Ativo'
    },

    EventEdit : {
        Name           : 'Nome',
        Resource       : 'Recurso',
        Start          : 'Início',
        startTime      : 'Hora de início',
        End            : 'Fim',
        endTime        : 'Hora de término',
        Save           : 'Guardar',
        Delete         : 'Eliminar',
        Cancel         : 'Cancelar',
        'Edit event'   : 'Editar evento',
        Repeat         : 'Repetir',
        editRecurrence : 'Editar recorrência'
    },

    EventDrag : {
        eventOverlapsExisting   : 'O evento sobrepõe-se ao evento existente para este recurso',
        noDropOutsideTimeline   : 'O evento não pode ser deixado completamente fora da cronologia',
        duplicateAssignmentDrag : 'O evento não pode ser atribuído várias vezes ao mesmo recurso'
    },

    SchedulerBase : {
        'Add event'      : 'Adicionar evento',
        'Delete event'   : 'Eliminar evento',
        'Unassign event' : 'Remover atribuição de evento',
        color            : 'Cor',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, começa às ${startDate} ${eventRecord.duration > 0 ? `por ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Ampliação',
        activeDateRange : 'Intervalo de datas',
        startText       : 'Data de início',
        endText         : 'Data de fim',
        todayText       : 'Hoje'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Eixo do tempo mostrando de ${startDate} a ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Copiar evento',
        cutEvent   : 'Cortar evento',
        pasteEvent : 'Colar evento'
    },

    EventFilter : {
        filterEvents : 'Filtrar tarefas',
        byName       : 'Por nome'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Mostrar cronologia atual'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Segundos'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD/MM, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD/MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Dia'
        },
        day : {
            name : 'Dia/horas'
        },
        week : {
            name : 'Semana/horas'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Semana/dias'
        },
        dayAndMonth : {
            name : 'Mês'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Semana'
        },
        weekAndMonth : {
            name : 'Semanas'
        },
        weekAndDayLetter : {
            name : 'Semanas/dias da semana'
        },
        weekDateAndMonth : {
            name : 'Meses/semanas'
        },
        monthAndYear : {
            name : 'Meses'
        },
        year : {
            name : 'Anos'
        },
        manyYears : {
            name : 'Múltiplos anos'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Está removendo um evento',
        'delete-all-message'        : 'Quer remover todas as ocorrências deste evento?',
        'delete-further-message'    : 'Quer remover esta e todas as ocorrências futuras deste evento ou apenas a ocorrência selecionada?',
        'delete-only-this-message'  : 'Deseja excluir esta ocorrência deste evento?',
        'delete-further-btn-text'   : 'Remover todos os eventos futuros',
        'delete-only-this-btn-text' : 'Remover apenas este evento',
        'update-title'              : 'Está a alterar um evento recorrente',
        'update-all-message'        : 'Quer alterar todas as ocorrências deste evento?',
        'update-further-message'    : 'Quer alterar apenas esta ocorrência do evento ou esta e todas as ocorrências futuras?',
        'update-only-this-message'  : 'Deseja alterar esta ocorrência deste evento?',
        'update-further-btn-text'   : 'Todos os eventos futuros',
        'update-only-this-btn-text' : 'Apenas este evento',
        Yes                         : 'Sim',
        Cancel                      : 'Cancelar',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' e ',
        Daily                           : 'Diariamente',
        'Weekly on {1}'                 : ({ days }) => `Semanalmente a ${days}`,
        'Monthly on {1}'                : ({ days }) => `Mensalmente a ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Anualmente a ${days} de ${months}`,
        'Every {0} days'                : ({ interval }) => `A cada ${interval} dias`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `A cada ${interval} semanas em ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `A cada ${interval} meses em ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `A cada ${interval} anos em ${days} de ${months}`,
        position1                       : 'no primeiro',
        position2                       : 'no segundo',
        position3                       : 'no terceiro',
        position4                       : 'no quarto',
        position5                       : 'no quinto',
        'position-1'                    : 'no último',
        day                             : 'dia',
        weekday                         : 'dia da semana',
        'weekend day'                   : 'dia de fim de semana',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Repetir evento',
        Cancel              : 'Cancelar',
        Save                : 'Guardar',
        Frequency           : 'Frequência',
        Every               : 'A cada',
        DAILYintervalUnit   : 'dia(s)',
        WEEKLYintervalUnit  : 'semana(s)',
        MONTHLYintervalUnit : 'mês(es)',
        YEARLYintervalUnit  : 'ano(s)',
        Each                : 'Cada',
        on                  : 'Em',
        the                 : 'Em',
        'On the'            : 'Em',
        'End repeat'        : 'Repetir no fim',
        'time(s)'           : 'vez(es)',
        Days                : 'Dias',
        Months              : 'Meses'
    },

    RecurrenceDaysCombo : {
        day           : 'dia',
        weekday       : 'dia da semana',
        'weekend day' : 'dia do fim de semana'
    },

    RecurrencePositionsCombo : {
        position1    : 'primeiro',
        position2    : 'segundo',
        position3    : 'terceiro',
        position4    : 'quarto',
        position5    : 'quinto',
        'position-1' : 'último'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Nunca',
        After     : 'Depois',
        'On date' : 'Na data'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Sem repetição',
        Daily   : 'Diariamente',
        Weekly  : 'Semanalmente',
        Monthly : 'Mensalmente',
        Yearly  : 'Anualmente'
    },

    RecurrenceCombo : {
        None   : 'Nenhum',
        Custom : 'Personalizar'
    },

    Summary : {
        'Summary for' : date => `Resumo de ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Agendamento completo',
        currentview  : 'Agendamento visível',
        daterange    : 'Intervalo de datas',
        completedata : 'Agendamento completo (para todos os eventos)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Intervalo de agendamento',
        'Export from'    : 'De',
        'Export to'      : 'Até'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Página única'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Página única (sem escala)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Múltiplas páginas (vertical)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Nenhum recurso atribuído'
    },

    CrudManagerView : {
        serverResponseLabel : 'Resposta do servidor:'
    },

    DurationColumn : {
        Duration : 'Duração'
    },

    EventClusteringBase : {
        unnamed         : 'Sem nome',
        more            : count => `+ ${count} mais`,
        clusteredEvents : count => `${count} eventos agrupados`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} intervalos agrupados`
    },

    ConstraintTypePicker : {
        none                : 'Nenhum',
        assoonaspossible    : 'O mais cedo possível',
        aslateaspossible    : 'O mais tarde possível',
        muststarton         : 'Tem de começar em',
        mustfinishon        : 'Tem de terminar em',
        startnoearlierthan  : 'Iniciar não antes de',
        startnolaterthan    : 'Iniciar não depois de',
        finishnoearlierthan : 'Terminar não antes de',
        finishnolaterthan   : 'Terminar não depois de'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} tempo de buffer antes do evento`;
            }
            if (postamble) {
                description += `.${postamble.toString()} tempo de buffer após o evento`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Para a frente',
        Backward      : 'Para trás',
        inheritedFrom : 'Herdado de',
        enforcedBy    : 'Imposto por'
    },

    CalendarField : {
        'Default calendar' : 'Calendário predefinido',
        editCalendar       : 'Editar calendário'
    },

    TaskEditorBase : {
        Information   : 'Informações da tarefa',
        Save          : 'Guardar',
        Cancel        : 'Cancelar',
        Delete        : 'Eliminar',
        calculateMask : 'A calcular...',
        saveError     : 'Não é possível salvar, corrija os erros primeiro',
        repeatingInfo : 'Visualizar um evento repetido',
        editRepeating : 'Editar'
    },

    TaskEdit : {
        editEvent              : 'Editar evento',
        ConfirmDeletionTitle   : 'Confirmar remoção',
        ConfirmDeletionMessage : 'Tem a certeza de que quer remover o evento?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '33em'
    },

    SchedulerGeneralTab : {
        General      : 'Geral',
        Name         : 'Nome',
        Resources    : 'Recursos',
        '% complete' : '% concluído',
        Duration     : 'Duração',
        Start        : 'Início',
        Finish       : 'Fim',
        Effort       : 'Esforço',
        Preamble     : 'Preâmbulo',
        Postamble    : 'Conclusão'
    },

    GeneralTab : {
        General      : 'Geral',
        Name         : 'Nome',
        '% complete' : '% concluído',
        Duration     : 'Duração',
        Start        : 'Início',
        Finish       : 'Fim',
        Effort       : 'Esforço',
        Dates        : 'Datas'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Avançado',
        Calendar                   : 'Calendário',
        'Scheduling mode'          : 'Modo de agendamento',
        'Effort driven'            : 'Esforço impulsionado',
        'Manually scheduled'       : 'Agendado manualmente',
        'Constraint type'          : 'Tipo de restrição',
        'Constraint date'          : 'Data de restrição',
        Inactive                   : 'Inativo',
        'Ignore resource calendar' : 'Ignorar calendário de recursos'
    },

    CalendarEditorDatePicker : {
        addException : 'Adicione exceção',
        addWeek      : 'Adicionar semana'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Adicione exceção',
        removeException : 'Remover exceção',
        noRows          : 'Nenhuma exceção adicionada'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Adicionar semana',
        removeWeek : 'Remover semana'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Os dias estão funcionando por padrão',
        workingTimeCalendar        : 'Calendário de horário de trabalho',
        exceptions                 : 'Exceções',
        general                    : 'Em geral',
        name                       : 'Nome',
        parent                     : 'Pai',
        save                       : 'Salvar',
        weeks                      : 'Semanas',
        error                      : 'Erro',
        inputErrors                : 'Existem erros de entrada. Corrija-os antes de salvar suas alterações.',
        delete                     : 'Excluir',
        addCalendar                : 'Adicionar um calendário',
        confirmation               : 'Confirmação',
        removeCalendarWithChildren : 'O calendário tem calendários secundários. Clique em “Sim” para remover o calendário com seus filhos.',
        removeCalendarAndLinks     : 'O calendário é usado por alguns registros. Clique em “Sim” para desvinculá-los e remover o calendário.',
        newException               : 'Nova exceção',
        newWeek                    : 'Nova semana'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' está funcionando',
        isNotWorking : ' não está funcionando',
        basedOn      : ' baseado em:',
        byDefault    : 'por padrão',
        rangeTpl     : (start, end) => `${start} - ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Dia de trabalho',
        nonWorkingDay : 'Dia não útil'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Existem intervalos sobrepostos',
        errorMissingDate   : 'Os horários de início e término são obrigatórios',
        errorStartAfterEnd : 'O horário de início não pode ser posterior ao horário de término'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Nome',
        from                                 : 'De',
        to                                   : 'Para',
        is                                   : 'É',
        nonWorking                           : 'Não trabalhando',
        working                              : 'Trabalhando',
        hours                                : 'Horas',
        repeat                               : 'Repita',
        repeatEnd                            : 'Repetir fim',
        errorMissingDate                     : 'O período de exceção é obrigatório',
        errorStartAfterEnd                   : 'A data "De" não pode ser posterior à data "Até"',
        errorStartAndEndRepeatNumberMismatch : 'A exceção deve começar e terminar o mesmo número de vezes'
    },

    CalendarEditorWeekPanel : {
        name        : 'Nome',
        from        : 'De',
        to          : 'Para',
        days        : 'Dias',
        copyDay     : 'Dia de cópia',
        pasteDay    : 'Colar dia',
        stopCopying : 'Pare de copiar'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Adicionar intervalo',
        removeRange : 'Remover intervalo'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : 'A data "De" não pode ser posterior à data "Até"',
        errorNoDefaultWeek           : 'A configuração da semana é obrigatória',
        errorMultipleDefaultWeeks    : 'Mais de uma semana padrão é especificada',
        errorNoWeekAvailability      : 'A semana deve fornecer algum tempo de trabalho',
        errorInvalidWeekAvailability : 'Semana tem erros de configuração de horário de trabalho',
        noRows                       : 'Nenhuma semana adicionada'
    },

    AdvancedTab : {
        Advanced                   : 'Avançado',
        Calendar                   : 'Calendário',
        'Scheduling mode'          : 'Modo de agendamento',
        'Effort driven'            : 'Esforço impulsionado',
        'Manually scheduled'       : 'Agendado manualmente',
        'Constraint type'          : 'Tipo de restrição',
        'Constraint date'          : 'Data de restrição',
        Constraint                 : 'Restrição',
        Rollup                     : 'Sumarização',
        Inactive                   : 'Inativo',
        'Ignore resource calendar' : 'Ignorar calendário de recursos',
        'Scheduling direction'     : 'Direção de agendamento',
        projectBorder              : 'Fronteira do projeto',
        ignore                     : 'Ignorar',
        honor                      : 'Honra',
        askUser                    : 'Pergunte ao usuário'
    },

    DependencyTab : {
        Predecessors      : 'Anteriores',
        Successors        : 'Sucessores',
        ID                : 'ID',
        Name              : 'Nome',
        Type              : 'Tipo',
        Lag               : 'Atraso',
        cyclicDependency  : 'Dependência cíclica',
        invalidDependency : 'Dependência inválida',
        readOnlyTask      : 'Não é possível vincular uma tarefa somente leitura'
    },

    NotesTab : {
        Notes : 'Notas'
    },

    ResourceCalendarColumn : {
        calendar : 'Calendário'
    },

    ResourceEdit : {
        editResource : 'Editar recurso'
    },

    ResourceEditor : {
        resourceInformation : 'Informações sobre recursos',
        costs               : 'Custos',
        save                : 'Salvar',
        error               : 'Erro',
        inputErrors         : 'Existem erros de entrada. Corrija-os antes de salvar suas alterações.',
        delete              : 'Excluir',
        confirmation        : 'Confirmação',
        removeUsedResource  : 'O recurso é atribuído a algumas tarefas. Clique em “Sim” para remover o recurso de qualquer maneira.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Calendário',
        general     : 'Em geral',
        label       : 'Etiqueta do material',
        name        : 'Nome do recurso',
        type        : 'Tipo',
        costAccrual : 'Acréscimo de custos',
        labelHint   : 'por exemplo, kg, toneladas ou caixas',
        maxUnits    : 'Unidades máximas'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Acumule em',
        prorated : 'Rateado',
        start    : 'Começar',
        end      : 'Fim'
    },

    CostAccrualField : {
        prorated : 'Rateado',
        start    : 'Começar',
        end      : 'Fim'
    },

    ResourceType : {
        work     : 'Trabalhar',
        material : 'Material',
        cost     : 'Custo'
    },

    ResourceTypeColumn : {
        type : 'Tipo'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Tabela de taxas',
        newGroup     : 'Nova tabela',
        removeGroup  : 'Remover tabela',
        useByDefault : 'Use por padrão para as atribuições de recursos',
        noRates      : 'Sem taxas'
    },

    ResourceGrid : {
        name          : 'Nome',
        materialLabel : 'Etiqueta do material',
        maxUnits      : 'Máximo de unidades',
        cost          : 'Custo',
        noRows        : 'Sem recursos'
    },

    ResourceRateTableContainer : {
        startDate    : 'Data de início',
        standardRate : 'Taxa padrão',
        perUseCost   : 'Custo por uso',
        addRate      : 'Adicionar taxa',
        removeRate   : 'Remover taxa',
        name         : 'Nome',
        noRates      : 'Sem taxas'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Informações da tabela de taxas'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Quantidade',
        Resources   : 'Recursos',
        Resource    : 'Recurso',
        Units       : 'Unidades',
        cost        : 'Custo',
        effort      : 'Esforço',
        start       : 'Começar',
        finish      : 'Terminar',
        preamble    : 'Preâmbulo',
        postamble   : 'Pós-âmbulo'
    },

    RateTableColumn : {
        rateTable : 'Tabela de taxas'
    },

    RecurrenceTab : {
        title : 'Repetir'
    },

    SchedulingModePicker : {
        Normal           : 'Normal',
        'Fixed Duration' : 'Duração fixa',
        'Fixed Units'    : 'Unidades fixas',
        'Fixed Effort'   : 'Esforço fixo'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} de {available}</span> atribuídos',
        barTipOnDate          : '<b>{resource}</b> em {startDate}<br><span class="{cls}">{allocated} de {available}</span> atribuídos',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} de {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} de {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'Em {startDate}<br><span class="{cls}">{allocated} de {available}</span> atribuídos:<br>{assignments}',
        plusMore              : '+{value} mais'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Esforço</div><div class="b-effort-value {cls}">{allocated} de {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Esforço</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Custo</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Quantidade</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} em {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Resumo para {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Resumo para {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} mais',
        nameColumnText        : 'Recurso / Evento'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Cancelar a alteração e não fazer nada',
        schedulingConflict : 'Conflito de agendamento',
        emptyCalendar      : 'Erro de configuração de calendário',
        cycle              : 'Ciclo de agendamento',
        Apply              : 'Aplicar'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Selecione uma dependência:',
        invalidDependencyLabel : 'Existem dependências inválidas envolvidas que têm de ser resolvidas:'
    },

    SchedulerProBase : {
        propagating     : 'Calculando projeto',
        storePopulation : 'Carregando dados',
        finalizing      : 'Finalizando resultados'
    },

    EventSegments : {
        splitEvent    : 'Dividir evento',
        renameSegment : 'Renomear'
    },

    NestedEvents : {
        createGroup         : 'Agrupar eventos selecionados',
        newGroupName        : 'Novo grupo',
        deNestingNotAllowed : 'A remoção de aninhamento não é permitida',
        nestingNotAllowed   : 'O aninhamento não é permitido'
    },

    VersionGrid : {
        compare       : 'Comparar',
        description   : 'Descrição',
        occurredAt    : 'Ocorreu em',
        rename        : 'Renomear',
        restore       : 'Restaurar',
        stopComparing : 'Parar comparação'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'tarefa',
            AssignmentModel : 'atribuição',
            DependencyModel : 'hiperligação',
            ProjectModel    : 'projeto',
            ResourceModel   : 'recurso',
            other           : 'objeto'
        },
        entityNamesPlural : {
            TaskModel       : 'tarefas',
            AssignmentModel : 'atribuições',
            DependencyModel : 'hiperligações',
            ProjectModel    : 'projetos',
            ResourceModel   : 'recursos',
            other           : 'objetos'
        },
        transactionDescriptions : {
            update : 'Alterada(s) {n} {entities}',
            add    : 'Adicionada(s) {n} {entities}',
            remove : 'Removida(s) {n} {entities}',
            move   : 'Movida(s) {n} {entities}',
            mixed  : 'Alterada(s) {n} {entities}'
        },
        propertyNames : {
            active                   : 'Ativo',
            allDay                   : 'O dia todo',
            allowOverlap             : 'Permitir sobreposição',
            barMargin                : 'Margem da barra',
            bidirectional            : 'Bidirecional',
            calendar                 : 'Calendário',
            cls                      : 'Classe CSS',
            constraintDate           : 'Data de restrição',
            constraintType           : 'Tipo de restrição',
            daysPerMonth             : 'Dias por mês',
            daysPerWeek              : 'Dias por semana',
            delayFromParent          : 'Atraso do pai',
            direction                : 'Direção',
            drawDependencies         : 'Desenhar dependências',
            duration                 : 'Duração',
            durationUnit             : 'Unidade de duração',
            effort                   : 'Esforço',
            effortDriven             : 'Orientado por esforço',
            effortUnit               : 'Unidade de esforço',
            endDate                  : 'Data de término',
            eventColor               : 'Cor',
            eventId                  : 'ID do Evento',
            eventLayout              : 'Layout do evento',
            eventStyle               : 'Estilo da barra',
            exceptionDates           : 'Datas de exceção',
            fixed                    : 'Fixo',
            from                     : 'De',
            fromSide                 : 'Do lado',
            hoursPerDay              : 'Horas por dia',
            href                     : 'Link',
            iconCls                  : 'Ícone',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignorar calendário de recursos',
            ignoreTimeZone           : 'Ignorar fuso horário',
            image                    : 'Imagem',
            imageUrl                 : 'URL da imagem',
            inactive                 : 'Inativo',
            intervals                : 'Intervalos',
            lag                      : 'Atraso',
            lagUnit                  : 'Unidade de atraso',
            lineStyle                : 'Estilo da linha',
            manuallyScheduled        : 'Agendado manualmente',
            milestoneWidth           : 'Largura do marco',
            name                     : 'Nome',
            note                     : 'Nota',
            parentId                 : 'ID do Pai',
            parentIndex              : 'Posição',
            percentDone              : '% concluído',
            postamble                : 'Pós-âmago',
            preamble                 : 'Preâmbulo',
            readOnly                 : 'Somente leitura',
            recurrenceRule           : 'Regra de recorrência',
            resourceId               : 'ID do Recurso',
            resourceMargin           : 'Margem do recurso',
            rowHeight                : 'Altura da linha',
            schedulingMode           : 'Modo de agendamento',
            segments                 : 'Segmentos',
            showAvatar               : 'Mostrar avatar',
            showInTimeline           : 'Mostrar na linha do tempo',
            startDate                : 'Data de início',
            stickyContents           : 'Conteúdo fixo',
            strokeColor              : 'Cor da linha',
            style                    : 'Estilo',
            target                   : 'Destino do link',
            to                       : 'Para',
            toSide                   : 'Para o lado',
            type                     : 'Tipo',
            units                    : 'Unidades',
            unscheduled              : 'Não agendado',
            unspecifiedTimeIsWorking : 'Tempo não especificado é de trabalho',
            version                  : 'Versão'
        },
        intervals : {
            working    : 'Trabalhando',
            nonWorking : 'Não trabalhando',
            fromTo     : 'De {from} a {to}',
            recurring  : 'Recorrente começando {start} terminando {end}'
        },
        addEntity         : 'Adicionado {type} **{name}**',
        removeEntity      : 'Removido {type} **{name}**',
        updateEntity      : 'Alterado {type} **{name}**',
        moveEntity        : 'Movido {type} **{name}** de {from} para {to}',
        addDependency     : 'Adicionada hiperligação de **{from}** para **{to}**',
        removeDependency  : 'Removida hiperligação de **{from}** para **{to}**',
        updateDependency  : 'Editada hiperligação de **{from}** para **{to}**',
        addAssignment     : 'Atribuído **{resource}** para **{event}**',
        removeAssignment  : 'Removida atribuição de **{resource}** de **{event}**',
        updateAssignment  : 'Editada atribuição de **{resource}** para **{event}**',
        noChanges         : 'Sem alterações',
        nullValue         : 'nenhum',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Salvo em {date}',
        autoSavedAt       : 'Salvo automaticamente em {date}',
        undid             : 'Alterações anuladas',
        redid             : 'Alterações refeitas',
        editedTask        : 'Propriedades da tarefa editadas',
        deletedTask       : 'Uma tarefa removida',
        movedTask         : 'Uma tarefa movida',
        movedTasks        : 'Tarefas movidas'
    }
};

export default LocaleHelper.publishLocale(locale);
