import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Gl.js';
import '../../Grid/localization/Gl.js';

const locale = {

    localeName : 'Gl',
    localeDesc : 'Galego',
    localeCode : 'gl-ES',
    localeRtl  : false,

    Object : {
        newEvent    : 'Novo evento',
        information : 'Information',
        showDetails : 'Amosar detalles'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' evento' + (data !== 1 ? 's' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Alternar columna de deseño de recursos. ESPAZO para o menú contextual.'
    },

    Dependencies : {
        from    : 'Desde',
        to      : 'Até',
        valid   : 'Válido',
        invalid : 'Non válido'
    },

    DependencyType : {
        SS           : 'II',
        SF           : 'IF',
        FS           : 'FI',
        FF           : 'FF',
        StartToStart : 'De inicio a inicio',
        StartToEnd   : 'De inicio a fin',
        EndToStart   : 'De fin a inicio',
        EndToEnd     : 'De fin a fin',
        short        : [
            'II',
            'IF',
            'FI',
            'FF'
        ],
        long : [
            'De inicio a inicio',
            'De inicio a fin',
            'De fin a inicio',
            'De fin a fin'
        ]
    },

    DependencyEdit : {
        From              : 'Desde',
        To                : 'Até',
        Type              : 'Tipo',
        Lag               : 'Atraso',
        color             : 'Cor',
        lineStyle         : 'Estilo de liña',
        solid             : 'Sólido',
        dashed            : 'Discontinuo',
        dotted            : 'Punteado',
        dashDot           : 'Guión-punto',
        longDash          : 'Guión longo',
        'Edit dependency' : 'Editar dependencia',
        Save              : 'Gardar',
        Delete            : 'Eliminar',
        Cancel            : 'Cancelar',
        StartToStart      : 'De inicio a inicio',
        StartToEnd        : 'De inicio a fin',
        EndToStart        : 'De fin a inicio',
        EndToEnd          : 'De fin a fin',
        Active            : 'Activo'
    },

    EventEdit : {
        Name           : 'Nome',
        Resource       : 'Recurso',
        Start          : 'Inicio',
        startTime      : 'Hora de comezo',
        End            : 'Finalización',
        endTime        : 'Hora de finalización',
        Save           : 'Gardar',
        Delete         : 'Eliminar',
        Cancel         : 'Cancelar',
        'Edit event'   : 'Editar evento',
        Repeat         : 'Repetir',
        editRecurrence : 'Editar recorrencia'
    },

    EventDrag : {
        eventOverlapsExisting   : 'O evento está superposto co evento existente para este recurso',
        noDropOutsideTimeline   : 'É posible que o evento non se poida excluír completamente fóra da liña de tempo',
        duplicateAssignmentDrag : 'O evento non se pode asignar ao mesmo recurso varias veces'
    },

    SchedulerBase : {
        'Add event'      : 'Engadir evento',
        'Delete event'   : 'Eliminar evento',
        'Unassign event' : 'Evento non atribuído',
        color            : 'Cor',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, comeza ás ${startDate} ${eventRecord.duration > 0 ? `durante ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zoom',
        activeDateRange : 'Intervalo de datas',
        startText       : 'Data de inicio',
        endText         : 'Data de finalización',
        todayText       : 'Hoxe'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Eixo temporal mostrando de ${startDate} a ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Copiar evento',
        cutEvent   : 'Cortar evento',
        pasteEvent : 'Pegar evento'
    },

    EventFilter : {
        filterEvents : 'Filtrar tarefas',
        byName       : 'Por nome'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Mostrar liña de tempo actual'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Segundos'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd MM/DD, hA',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd MM/DD',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Día'
        },
        day : {
            name : 'Día/horas'
        },
        week : {
            name : 'Semana/horas'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Semana/días'
        },
        dayAndMonth : {
            name : 'Mes'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Semana'
        },
        weekAndMonth : {
            name : 'Semanas'
        },
        weekAndDayLetter : {
            name : 'Semanas/días da semana'
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
            name : 'Varios anos'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Está a eliminar un evento',
        'delete-all-message'        : 'Quere eliminar todas as ocorrencias deste evento?',
        'delete-further-message'    : 'Quere eliminar esta e todas as ocorrencias futuras deste evento ou só a ocorrencia seleccionada?',
        'delete-only-this-message'  : 'Queres eliminar esta ocorrencia deste evento?',
        'delete-further-btn-text'   : 'Eliminar todos os eventos futuros',
        'delete-only-this-btn-text' : 'Eliminar só este evento',
        'update-title'              : 'Está a cambiar un evento repetitivo',
        'update-all-message'        : 'Quere cambiar todas as ocorrencias deste evento?',
        'update-further-message'    : 'Quere cambiar só esta ocorrencia do evento ou esta e todas as ocorrencias futuras?',
        'update-only-this-message'  : 'Queres cambiar esta ocorrencia deste evento?',
        'update-further-btn-text'   : 'Todos os eventos futuros',
        'update-only-this-btn-text' : 'Só este evento',
        Yes                         : 'Si',
        Cancel                      : 'Cancelar',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' e ',
        Daily                           : 'Diario',
        'Weekly on {1}'                 : ({ days }) => `Semanalmente o ${days}`,
        'Monthly on {1}'                : ({ days }) => `Mensualmente os ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Anualmente os ${days} de ${months}`,
        'Every {0} days'                : ({ interval }) => `Cada ${interval} días`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Cada ${interval} semanas o ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Cada ${interval} meses o ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Cada ${interval} anos o ${days} de ${months}`,
        position1                       : 'o primeiro',
        position2                       : 'o segundo',
        position3                       : 'o terceiro',
        position4                       : 'o cuarto',
        position5                       : 'o quinto',
        'position-1'                    : 'o último',
        day                             : 'día',
        weekday                         : 'día da semana',
        'weekend day'                   : 'día da fin de semana',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Repetir evento',
        Cancel              : 'Cancelar',
        Save                : 'Gardar',
        Frequency           : 'Frecuencia',
        Every               : 'Cada',
        DAILYintervalUnit   : 'día(s)',
        WEEKLYintervalUnit  : 'semana(s)',
        MONTHLYintervalUnit : 'mes(es)',
        YEARLYintervalUnit  : 'ano(s)',
        Each                : 'Cada',
        on                  : 'No',
        the                 : 'No',
        'On the'            : 'No',
        'End repeat'        : 'Finalizar repetición',
        'time(s)'           : 'vez(veces)',
        Days                : 'Días',
        Months              : 'Meses'
    },

    RecurrenceDaysCombo : {
        day           : 'día',
        weekday       : 'día da semana',
        'weekend day' : 'día da fin de semana'
    },

    RecurrencePositionsCombo : {
        position1    : 'primeiro',
        position2    : 'segundo',
        position3    : 'terceiro',
        position4    : 'cuarto',
        position5    : 'quinto',
        'position-1' : 'último'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Nunca',
        After     : 'Despois de',
        'On date' : 'Nesa data'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Sen repeticións',
        Daily   : 'Diario',
        Weekly  : 'Semanalmente o {0}',
        Monthly : 'Mensualmente',
        Yearly  : 'Anualmente'
    },

    RecurrenceCombo : {
        None   : 'Ningún',
        Custom : 'Personalizado...'
    },

    Summary : {
        'Summary for' : date => `Resumo para ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Completar programación',
        currentview  : 'Programación visible',
        daterange    : 'Intervalo de datas',
        completedata : 'Completar programación (para todos os eventos)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Intervalo de programación',
        'Export from'    : 'Desde',
        'Export to'      : 'Até'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Páxina única'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Páxina única (sen escala)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Múltiples páxinas (vertical)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Non hai recursos atribuídos'
    },

    CrudManagerView : {
        serverResponseLabel : 'Resposta do servidor:'
    },

    DurationColumn : {
        Duration : 'Duración'
    },

    EventClusteringBase : {
        unnamed         : 'Sen nome',
        more            : count => `+ ${count} máis`,
        clusteredEvents : count => `${count} eventos agrupados`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} rangos agrupados`
    },

    ConstraintTypePicker : {
        none                : 'Ningún',
        assoonaspossible    : 'O antes posible',
        aslateaspossible    : 'O máis tarde posible',
        muststarton         : 'Debe comezar o',
        mustfinishon        : 'Debe finalizar o',
        startnoearlierthan  : 'Comezar non antes do',
        startnolaterthan    : 'Comezar non despois do',
        finishnoearlierthan : 'Finalizar non antes do',
        finishnolaterthan   : 'Finalizar non despois do'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} tempo de espera antes do evento`;
            }
            if (postamble) {
                description += `.${postamble.toString()} tempo de espera despois do evento`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Reenviar',
        Backward      : 'Atrás',
        inheritedFrom : 'Herdado de',
        enforcedBy    : 'Aplicado por'
    },

    CalendarField : {
        'Default calendar' : 'Calendario predefinido',
        editCalendar       : 'Editar calendario'
    },

    TaskEditorBase : {
        Information   : 'Información da tarefa',
        Save          : 'Gardar',
        Cancel        : 'Cancelar',
        Delete        : 'Eliminar',
        calculateMask : 'Calculando...',
        saveError     : 'Non se pode gardar, primeiro corrixa os erros',
        repeatingInfo : 'Ver un evento repetitivo',
        editRepeating : 'Editar'
    },

    TaskEdit : {
        editEvent              : 'Editar evento',
        ConfirmDeletionTitle   : 'Confirmar eliminación',
        ConfirmDeletionMessage : 'Seguro que quere eliminar o evento?'
    },

    GanttTaskEditor : {
        editorWidth : '44 em'
    },

    SchedulerTaskEditor : {
        editorWidth : '35 em'
    },

    SchedulerGeneralTab : {
        General      : 'Xeral',
        Name         : 'Nome',
        Resources    : 'Recursos',
        '% complete' : '% concluído',
        Duration     : 'Duración',
        Start        : 'Inicio',
        Finish       : 'Finalización',
        Effort       : 'Esforzo',
        Preamble     : 'Preámbulo',
        Postamble    : 'Postámbulo'
    },

    GeneralTab : {
        General      : 'Xeral',
        Name         : 'Nome',
        '% complete' : '% concluído',
        Duration     : 'Duración',
        Start        : 'Inicio',
        Finish       : 'Finalización',
        Effort       : 'Esforzo',
        Dates        : 'Datas'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Avanzado',
        Calendar                   : 'Calendario',
        'Scheduling mode'          : 'Modo de programación',
        'Effort driven'            : 'Condicionada polo esforzo',
        'Manually scheduled'       : 'Programación manual',
        'Constraint type'          : 'Tipo de restrición',
        'Constraint date'          : 'Data de restrición',
        Inactive                   : 'Inactivo',
        'Ignore resource calendar' : 'Ignorar calendario de recursos'
    },

    CalendarEditorDatePicker : {
        addException : 'Engadir excepción',
        addWeek      : 'Engadir semana'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Engadir excepción',
        removeException : 'Eliminar excepción',
        noRows          : 'Non hai excepcións engadidas'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Engadir semana',
        removeWeek : 'Eliminar semana'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Os días funcionan por defecto',
        workingTimeCalendar        : 'Calendario do tempo de traballo',
        exceptions                 : 'Excepcións',
        general                    : 'Xeral',
        name                       : 'Nome',
        parent                     : 'Pai',
        save                       : 'Gardar',
        weeks                      : 'Semanas',
        error                      : 'Erro',
        inputErrors                : 'Hai erros de entrada. Corríxaos antes de gardar os cambios.',
        delete                     : 'Eliminar',
        addCalendar                : 'Engadir un calendario',
        confirmation               : 'Confirmación',
        removeCalendarWithChildren : 'O calendario ten calendarios fillos. Fai clic en "Si" para eliminar o calendario cos seus fillos.',
        removeCalendarAndLinks     : 'O calendario é usado por algúns rexistros. Fai clic en "Si" para desligalos e eliminar o calendario.',
        newException               : 'Nova excepción',
        newWeek                    : 'Nova semana'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' está funcionando',
        isNotWorking : ' non funciona',
        basedOn      : ' baseado en:',
        byDefault    : 'por defecto',
        rangeTpl     : (start, end) => `${start} - ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Día de traballo',
        nonWorkingDay : 'Día non laborable'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Hai intervalos superpostos',
        errorMissingDate   : 'Requírese a hora de inicio e finalización',
        errorStartAfterEnd : 'A hora de inicio non pode ser posterior á hora de finalización'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Nome',
        from                                 : 'Desde',
        to                                   : 'Para',
        is                                   : 'É',
        nonWorking                           : 'Non traballando',
        working                              : 'Traballando',
        hours                                : 'Horario',
        repeat                               : 'Repetir',
        repeatEnd                            : 'Repita o final',
        errorMissingDate                     : 'É necesario o intervalo de datas de excepción',
        errorStartAfterEnd                   : 'A data "Desde" non pode ser posterior á data "Ata".',
        errorStartAndEndRepeatNumberMismatch : 'A excepción debería comezar e rematar o mesmo número de veces'
    },

    CalendarEditorWeekPanel : {
        name        : 'Nome',
        from        : 'Desde',
        to          : 'Para',
        days        : 'Días',
        copyDay     : 'Día da copia',
        pasteDay    : 'Día de pegado',
        stopCopying : 'Deixar de copiar'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Engadir intervalo',
        removeRange : 'Eliminar intervalo'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : 'A data "Desde" non pode ser posterior á data "Ata".',
        errorNoDefaultWeek           : 'É necesaria a configuración da semana',
        errorMultipleDefaultWeeks    : 'Especifícase máis dunha semana predeterminada',
        errorNoWeekAvailability      : 'A semana debe proporcionar algún tempo de traballo',
        errorInvalidWeekAvailability : 'A semana ten erros de configuración do tempo de traballo',
        noRows                       : 'Non hai semanas engadidas'
    },

    AdvancedTab : {
        Advanced                   : 'Avanzado',
        Calendar                   : 'Calendario',
        'Scheduling mode'          : 'Modo de programación',
        'Effort driven'            : 'Condicionada polo esforzo',
        'Manually scheduled'       : 'Programación manual',
        'Constraint type'          : 'Tipo de restrición',
        'Constraint date'          : 'Data de restrición',
        Constraint                 : 'Restrición',
        Rollup                     : 'Resumo',
        Inactive                   : 'Inactivo',
        'Ignore resource calendar' : 'Ignorar calendario de recursos',
        'Scheduling direction'     : 'Dirección de programación',
        projectBorder              : 'Borde do proxecto',
        ignore                     : 'Ignorar',
        honor                      : 'Honra',
        askUser                    : 'Pregunta ao usuario'
    },

    DependencyTab : {
        Predecessors      : 'Predecesores',
        Successors        : 'Succesores',
        ID                : 'ID',
        Name              : 'Nome',
        Type              : 'Tipo',
        Lag               : 'Atraso',
        cyclicDependency  : 'Dependencia cíclica',
        invalidDependency : 'Dependencia non válida',
        readOnlyTask      : 'Non se pode vincular unha tarefa de só lectura'
    },

    NotesTab : {
        Notes : 'Notas'
    },

    ResourceCalendarColumn : {
        calendar : 'Calendario'
    },

    ResourceEdit : {
        editResource : 'Editar recurso'
    },

    ResourceEditor : {
        resourceInformation : 'Información de recursos',
        costs               : 'Custos',
        save                : 'Gardar',
        error               : 'Erro',
        inputErrors         : 'Hai erros de entrada. Corríxaos antes de gardar os cambios.',
        delete              : 'Eliminar',
        confirmation        : 'Confirmación',
        removeUsedResource  : 'O recurso está asignado a algunhas tarefas. Fai clic en "Si" para eliminar o recurso de todos os xeitos.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Calendario',
        general     : 'Xeral',
        label       : 'Etiqueta do material',
        name        : 'Nome do recurso',
        type        : 'Tipo',
        costAccrual : 'Devengo de custos',
        labelHint   : 'por exemplo, kg, toneladas ou caixas',
        maxUnits    : 'Unidades máximas'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Acumular ás',
        prorated : 'Prorrateado',
        start    : 'Comeza',
        end      : 'Fin'
    },

    CostAccrualField : {
        prorated : 'Prorrateado',
        start    : 'Comeza',
        end      : 'Fin'
    },

    ResourceType : {
        work     : 'Traballo',
        material : 'Material',
        cost     : 'Custo'
    },

    ResourceTypeColumn : {
        type : 'Tipo'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Táboa de tarifas',
        newGroup     : 'Mesa nova',
        removeGroup  : 'Eliminar a táboa',
        useByDefault : 'Use por defecto para as asignacións de recursos',
        noRates      : 'Sen tarifas'
    },

    ResourceGrid : {
        name          : 'Nome',
        materialLabel : 'Etiqueta do material',
        maxUnits      : 'Unidades máximas',
        cost          : 'Custo',
        noRows        : 'Sen recursos'
    },

    ResourceRateTableContainer : {
        startDate    : 'Data de inicio',
        standardRate : 'Tarifa estándar',
        perUseCost   : 'Costo por uso',
        addRate      : 'Engadir taxa',
        removeRate   : 'Eliminar taxa',
        name         : 'Nome',
        noRates      : 'Sen tarifas'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Información da táboa de tarifas'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Cantidade',
        Resources   : 'Recursos',
        Resource    : 'Recurso',
        Units       : 'Unidades',
        cost        : 'Custo',
        effort      : 'Esforzo',
        start       : 'Comeza',
        finish      : 'Remate',
        preamble    : 'Preámbulo',
        postamble   : 'Postámbulo'
    },

    RateTableColumn : {
        rateTable : 'Táboa de tarifas'
    },

    RecurrenceTab : {
        title : 'Repetir'
    },

    SchedulingModePicker : {
        Normal           : 'Normal',
        'Fixed Duration' : 'Duración fixa',
        'Fixed Units'    : 'Unidades fixas',
        'Fixed Effort'   : 'Esforzo fixo'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} de {available}</span> atribuído',
        barTipOnDate          : '<b>{resource}</b> o {startDate}<br><span class="{cls}">{allocated} de {available}</span> atribuído',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} de {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} de {available}</span> atribuído:<br>{assignments}',
        groupBarTipOnDate     : 'O {startDate}<br><span class="{cls}">{allocated} de {available}</span> atribuído:<br>{assignments}',
        plusMore              : '+{value} máis'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Esforzo</div><div class="b-effort-value {cls}">{allocated} de {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Esforzo</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Custo</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Cantidade</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} en {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Resumo para {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Resumo para {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} máis',
        nameColumnText        : 'Recurso / Evento'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Cancelar o cambio e non facer nada',
        schedulingConflict : 'Conflito de programación',
        emptyCalendar      : 'Erro de configuración do calendario',
        cycle              : 'Ciclo de programación',
        Apply              : 'Aplicar'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Seleccione unha dependencia:',
        invalidDependencyLabel : 'Hai dependencias non válidas implicadas que se deben abordar:'
    },

    SchedulerProBase : {
        propagating     : 'Calculando proxecto',
        storePopulation : 'Cargando datos',
        finalizing      : 'Finalizando resultados'
    },

    EventSegments : {
        splitEvent    : 'Dividir evento',
        renameSegment : 'Renomear'
    },

    NestedEvents : {
        createGroup         : 'Agrupar os eventos seleccionados',
        newGroupName        : 'Novo grupo',
        deNestingNotAllowed : 'Non se permite cancelar o aniñamento',
        nestingNotAllowed   : 'Non se permite o aniñamento'
    },

    VersionGrid : {
        compare       : 'Comparar',
        description   : 'Descrición',
        occurredAt    : 'Produciuse ás',
        rename        : 'Renomear',
        restore       : 'Restaurar',
        stopComparing : 'Deixar de comparar'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'tarefa',
            AssignmentModel : 'atribución',
            DependencyModel : 'ligazón',
            ProjectModel    : 'proxecto',
            ResourceModel   : 'recurso',
            other           : 'obxecto'
        },
        entityNamesPlural : {
            TaskModel       : 'tarefas',
            AssignmentModel : 'atribucións',
            DependencyModel : 'ligazóns',
            ProjectModel    : 'proxectos',
            ResourceModel   : 'recursos',
            other           : 'obxectos'
        },
        transactionDescriptions : {
            update : 'Modificáronse {n} {entities}',
            add    : 'Engadíronse {n} {entities}',
            remove : 'Elimináronse {n} {entities}',
            move   : 'Movéronse {n} {entities}',
            mixed  : 'Modificáronse {n} {entities}'
        },
        propertyNames : {
            active                   : 'Activo',
            allDay                   : 'Todo o día',
            allowOverlap             : 'Permitir solapamento',
            barMargin                : 'Margen da barra',
            bidirectional            : 'Bidireccional',
            calendar                 : 'Calendario',
            cls                      : 'Clase CSS',
            constraintDate           : 'Data de restrición',
            constraintType           : 'Tipo de restrición',
            daysPerMonth             : 'Días por mes',
            daysPerWeek              : 'Días por semana',
            delayFromParent          : 'Retraso desde o pai',
            direction                : 'Dirección',
            drawDependencies         : 'Debuxar dependencias',
            duration                 : 'Duración',
            durationUnit             : 'Unidade de duración',
            effort                   : 'Esforzo',
            effortDriven             : 'Baseado no esforzo',
            effortUnit               : 'Unidade de esforzo',
            endDate                  : 'Data de fin',
            eventColor               : 'Cor',
            eventId                  : 'ID do Evento',
            eventLayout              : 'Disposición do evento',
            eventStyle               : 'Estilo da barra',
            exceptionDates           : 'Datas de excepción',
            fixed                    : 'Fixado',
            from                     : 'Desde',
            fromSide                 : 'Desde o lado',
            hoursPerDay              : 'Horas por día',
            href                     : 'Ligazón',
            iconCls                  : 'Icona',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignorar calendario de recursos',
            ignoreTimeZone           : 'Ignorar zona horaria',
            image                    : 'Imaxe',
            imageUrl                 : 'URL da imaxe',
            inactive                 : 'Inactivo',
            intervals                : 'Intervalos',
            lag                      : 'Retraso',
            lagUnit                  : 'Unidade de retraso',
            lineStyle                : 'Estilo da liña',
            manuallyScheduled        : 'Programado manualmente',
            milestoneWidth           : 'Ancho do fito',
            name                     : 'Nome',
            note                     : 'Nota',
            parentId                 : 'ID do Pai',
            parentIndex              : 'Posición',
            percentDone              : '% completado',
            postamble                : 'Postámbulo',
            preamble                 : 'Preámbulo',
            readOnly                 : 'Só lectura',
            recurrenceRule           : 'Regra de recorrencia',
            resourceId               : 'ID do Recurso',
            resourceMargin           : 'Margen do recurso',
            rowHeight                : 'Altura da fila',
            schedulingMode           : 'Modo de programación',
            segments                 : 'Segmentos',
            showAvatar               : 'Mostrar avatar',
            showInTimeline           : 'Mostrar na liña de tempo',
            startDate                : 'Data de inicio',
            stickyContents           : 'Contidos fixos',
            strokeColor              : 'Cor da liña',
            style                    : 'Estilo',
            target                   : 'Obxectivo da ligazón',
            to                       : 'Ata',
            toSide                   : 'Ata o lado',
            type                     : 'Tipo',
            units                    : 'Unidades',
            unscheduled              : 'Non programado',
            unspecifiedTimeIsWorking : 'O tempo non especificado é traballador',
            version                  : 'Versión'
        },
        intervals : {
            working    : 'Traballando',
            nonWorking : 'Non traballando',
            fromTo     : 'De {from} a {to}',
            recurring  : 'Recorrente comezando {start} rematando {end}'
        },
        addEntity         : 'Engadiuse {type} **{name}**',
        removeEntity      : 'Eliminouse {type} **{name}**',
        updateEntity      : 'Modificouse {type} **{name}**',
        moveEntity        : 'Moveuse {type} **{name}** de {from} a {to}',
        addDependency     : 'Engadiuse a ligazón de **{from}** a **{to}**',
        removeDependency  : 'Eliminouse a ligazón de **{from}** a **{to}**',
        updateDependency  : 'Editouse a ligazón de **{from}** a **{to}**',
        addAssignment     : 'Atribuíuse a ligazón de **{resource}** a **{event}**',
        removeAssignment  : 'Eliminouse a atribución de **{resource}** de **{event}**',
        updateAssignment  : 'Editouse a atribución de **{resource}** a **{event}**',
        noChanges         : 'Non hai modificacións',
        nullValue         : 'ningún',
        versionDateFormat : 'D/M/AAAA h:mm a',
        savedAt           : 'Gardado ás {date}',
        autoSavedAt       : 'Gardado automaticamente ás {date}',
        undid             : 'Desfixéronse os cambios',
        redid             : 'Refixéronse os cambios',
        editedTask        : 'Editar propiedades da tarefa',
        deletedTask       : 'Eliminouse unha tarefa',
        movedTask         : 'Moveuse unha tarefa',
        movedTasks        : 'Movéronse tarefas'
    }
};

export default LocaleHelper.publishLocale(locale);
