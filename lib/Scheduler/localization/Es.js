import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Es.js';
import '../../Grid/localization/Es.js';

const locale = {

    localeName : 'Es',
    localeDesc : 'Español',
    localeCode : 'es',
    localeRtl  : false,

    Object : {
        newEvent    : 'Nuevo evento',
        information : 'Información',
        showDetails : 'Mostrar detalles'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' evento' + (data !== 1 ? 's' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Alternar columna de diseño de recursos. ESPACIO para el menú contextual.'
    },

    Dependencies : {
        from    : 'Desde',
        to      : 'a',
        valid   : 'Válido',
        invalid : 'No válido'
    },

    DependencyType : {
        SS           : 'II',
        SF           : 'IF',
        FS           : 'FI',
        FF           : 'FF',
        StartToStart : 'De inicio a inicio',
        StartToEnd   : 'De inicio a finalización',
        EndToStart   : 'De finalización a inicio',
        EndToEnd     : 'De finalización a finalización',
        short        : [
            'II',
            'IF',
            'FI',
            'FF'
        ],
        long : [
            'De inicio a inicio',
            'De inicio a finalización',
            'De finalización a inicio',
            'De finalización a finalización'
        ]
    },

    DependencyEdit : {
        From              : 'Desde',
        To                : 'Hasta',
        Type              : 'Tipo',
        Lag               : 'Retraso',
        color             : 'Color',
        lineStyle         : 'Estilo de línea',
        solid             : 'Sólido',
        dashed            : 'Discontinuo',
        dotted            : 'Punteado',
        dashDot           : 'Guion-punto',
        longDash          : 'Guion largo',
        'Edit dependency' : 'Editar dependencia',
        Save              : 'Guardar',
        Delete            : 'Eliminar',
        Cancel            : 'Cancelar',
        StartToStart      : 'De inicio a inicio',
        StartToEnd        : 'De inicio a finalización',
        EndToStart        : 'De finalización a inicio',
        EndToEnd          : 'De finalización a finalización',
        Active            : 'Activa'
    },

    EventEdit : {
        Name           : 'Nombre',
        Resource       : 'Recurso',
        Start          : 'Inicio',
        startTime      : 'Hora de inicio',
        End            : 'Finalización',
        endTime        : 'Hora de finalización',
        Save           : 'Guardar',
        Delete         : 'Eliminar',
        Cancel         : 'Cancelar',
        'Edit event'   : 'Editar evento',
        Repeat         : 'Repetir',
        editRecurrence : 'Editar recurrencia'
    },

    EventDrag : {
        eventOverlapsExisting   : 'El evento se superpone con un evento existente para este recurso',
        noDropOutsideTimeline   : 'No se puede soltar el evento completamente fuera de la línea temporal',
        duplicateAssignmentDrag : 'El evento no puede asignarse al mismo recurso varias veces'
    },

    SchedulerBase : {
        'Add event'      : 'Añadir evento',
        'Delete event'   : 'Eliminar evento',
        'Unassign event' : 'Desasignar evento',
        color            : 'Color',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, comienza a las ${startDate} ${eventRecord.duration > 0 ? `durante ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zoom',
        activeDateRange : 'Rango de fechas',
        startText       : 'Fecha de inicio',
        endText         : 'Fecha de finalización',
        todayText       : 'Hoy'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Eje temporal mostrando de ${startDate} a ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Copiar evento',
        cutEvent   : 'Cortar evento',
        pasteEvent : 'Pegar evento'
    },

    EventFilter : {
        filterEvents : 'Filtrar tareas',
        byName       : 'Por nombre'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Mostrar línea temporal actual'
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
            name : 'Semanas/días laborables'
        },
        weekDateAndMonth : {
            name : 'Meses/semanas'
        },
        monthAndYear : {
            name : 'Mes'
        },
        year : {
            name : 'Años'
        },
        manyYears : {
            name : 'Múltiples años'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Está eliminando un evento',
        'delete-all-message'        : '¿Desea eliminar todas las instancias de este evento?',
        'delete-further-message'    : 'Desea eliminar esta y toda otra futura instancia de este evento o solo la instancia selecccionada?',
        'delete-only-this-message'  : '¿Desea eliminar esta ocurrencia de este evento?',
        'delete-further-btn-text'   : 'Eliminar todos los eventos futuros',
        'delete-only-this-btn-text' : 'Eliminar solo este evento',
        'update-title'              : 'Está cambiando un evento recurrente',
        'update-all-message'        : '¿Desea cambiar todas las instancias de este evento?',
        'update-further-message'    : '¿Desea cambiar solo esta instancia del evento o esta instancia y toda otra futura instancia?',
        'update-only-this-message'  : '¿Desea cambiar esta ocurrencia de este evento?',
        'update-further-btn-text'   : 'Todos los futuros eventos',
        'update-only-this-btn-text' : 'Solo este evento',
        Yes                         : 'Sí',
        Cancel                      : 'Cancelar',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : 'y',
        Daily                           : 'Diariamente',
        'Weekly on {1}'                 : ({ days }) => `Semanalmente los ${days}`,
        'Monthly on {1}'                : ({ days }) => `Mensualmente el ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Anualmente el ${days} de ${months}`,
        'Every {0} days'                : ({ interval }) => `Cada ${interval} días`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Cada ${interval} semanas el ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Cada ${interval} meses el ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Cada ${interval} años el ${days} de ${months}`,
        position1                       : 'el primero',
        position2                       : 'el segundo',
        position3                       : 'el tercero',
        position4                       : 'el cuarto',
        position5                       : 'el quinto',
        'position-1'                    : 'el último',
        day                             : 'día',
        weekday                         : 'día laborable',
        'weekend day'                   : 'día del fin de semana',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Repetir evento',
        Cancel              : 'Cancelar',
        Save                : 'Guardar',
        Frequency           : 'Frecuencia',
        Every               : 'Cada',
        DAILYintervalUnit   : 'día(s)',
        WEEKLYintervalUnit  : 'semana(s)',
        MONTHLYintervalUnit : 'mes(es)',
        YEARLYintervalUnit  : 'año(s)',
        Each                : 'Cada',
        on                  : 'El',
        the                 : 'The',
        'On the'            : 'El',
        'End repeat'        : 'Repetir finalización',
        'time(s)'           : 'vez(es)',
        Days                : 'Días',
        Months              : 'Meses'
    },

    RecurrenceDaysCombo : {
        day           : 'día',
        weekday       : 'día de la semana',
        'weekend day' : 'día del fin de semana'
    },

    RecurrencePositionsCombo : {
        position1    : 'primero',
        position2    : 'segundo',
        position3    : 'tercero',
        position4    : 'cuarto',
        position5    : 'quinto',
        'position-1' : 'último'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Nunca',
        After     : 'Después',
        'On date' : 'En fecha'
    },

    RecurrenceFrequencyCombo : {
        None    : 'No repetir',
        Daily   : 'Diariamente',
        Weekly  : 'Semanalmente',
        Monthly : 'Mensualmente',
        Yearly  : 'Anualmente'
    },

    RecurrenceCombo : {
        None   : 'Ninguno',
        Custom : 'Personalizar...'
    },

    Summary : {
        'Summary for' : date => `Resumen para ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Programa completo',
        currentview  : 'Programa visible',
        daterange    : 'Rango de fechas',
        completedata : 'Programa completo (para todos los eventos)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Rango del programa',
        'Export from'    : 'Desde',
        'Export to'      : 'a'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Página única'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Página única (sin escala)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Múltiples páginas (vertical)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Sin recursos asignados'
    },

    CrudManagerView : {
        serverResponseLabel : 'Respuesta del servidor:'
    },

    DurationColumn : {
        Duration : 'Duración'
    },

    EventClusteringBase : {
        unnamed         : 'Sin nombre',
        more            : count => `+ ${count} más`,
        clusteredEvents : count => `${count} eventos agrupados`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} rangos agrupados`
    },

    ConstraintTypePicker : {
        none                : 'Ninguno',
        assoonaspossible    : 'Lo antes posible',
        aslateaspossible    : 'Lo más tarde posible',
        muststarton         : 'Debe empezar el',
        mustfinishon        : 'Debe terminar el',
        startnoearlierthan  : 'Empezar no antes del',
        startnolaterthan    : 'Empezar no después del',
        finishnoearlierthan : 'Terminar no antes del',
        finishnolaterthan   : 'Terminar no después del'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} tiempo de espera antes del evento`;
            }
            if (postamble) {
                description += `.${postamble.toString()} tiempo de espera después del evento`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Adelante',
        Backward      : 'Atrás',
        inheritedFrom : 'Heredado de',
        enforcedBy    : 'Impuesto por'
    },

    CalendarField : {
        'Default calendar' : 'Calendario predeterminado',
        editCalendar       : 'Editar calendario'
    },

    TaskEditorBase : {
        Information   : 'Información de la tarea',
        Save          : 'Guardar',
        Cancel        : 'Cancelar',
        Delete        : 'Eliminar',
        calculateMask : 'Calculando...',
        saveError     : 'No se puede guardar, corrija antes los errores',
        repeatingInfo : 'Viendo una evento que se repite',
        editRepeating : 'Editar'
    },

    TaskEdit : {
        editEvent              : 'Editar evento',
        ConfirmDeletionTitle   : 'Confirmar eliminación',
        ConfirmDeletionMessage : '¿Seguro que desea eliminar el evento?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '33em'
    },

    SchedulerGeneralTab : {
        General      : 'General',
        Name         : 'Nombre',
        Resources    : 'Recursos',
        '% complete' : '% realizado',
        Duration     : 'Duración',
        Start        : 'Inicio',
        Finish       : 'Finalización',
        Effort       : 'Trabajo',
        Preamble     : 'Prólogo',
        Postamble    : 'Epílogo'
    },

    GeneralTab : {
        General      : 'General',
        Name         : 'Nombre',
        '% complete' : '% realizado',
        Duration     : 'Duración',
        Start        : 'Inicio',
        Finish       : 'Finalización',
        Effort       : 'Trabajo',
        Dates        : 'Fechas'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Avanzado',
        Calendar                   : 'Calendario',
        'Scheduling mode'          : 'Modo de programación',
        'Effort driven'            : 'Trabajo invertido',
        'Manually scheduled'       : 'Programado manualmente',
        'Constraint type'          : 'Tipo de restricción',
        'Constraint date'          : 'Fecha de la restricción',
        Inactive                   : 'Inactivo',
        'Ignore resource calendar' : 'Ignorar calendario de recursos'
    },

    CalendarEditorDatePicker : {
        addException : 'Añadir excepción',
        addWeek      : 'Agregar semana'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Añadir excepción',
        removeException : 'Eliminar excepción',
        noRows          : 'No se agregaron excepciones'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Agregar semana',
        removeWeek : 'Eliminar la semana'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Los días funcionan de forma predeterminada',
        workingTimeCalendar        : 'Calendario de tiempo de trabajo',
        exceptions                 : 'Excepciones',
        general                    : 'General',
        name                       : 'Nombre',
        parent                     : 'Padre',
        save                       : 'Guardar',
        weeks                      : 'Semanas',
        error                      : 'Error',
        inputErrors                : 'Hay errores de entrada. Por favor, arreglelos antes de guardar sus cambios.',
        delete                     : 'Borrar',
        addCalendar                : 'Agregar un calendario',
        confirmation               : 'Confirmación',
        removeCalendarWithChildren : 'El calendario tiene calendarios infantiles. Haga clic en "Sí" para eliminar el calendario con sus hijos.',
        removeCalendarAndLinks     : 'El calendario es utilizado por algunos registros. Haga clic en "Sí" para desactivarlos y eliminar el calendario.',
        newException               : 'Nueva excepción',
        newWeek                    : 'Nueva semana'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' está trabajando',
        isNotWorking : ' no está trabajando',
        basedOn      : ' Residencia en:',
        byDefault    : 'por defecto',
        rangeTpl     : (start, end) => `${start} a ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Día de trabajo',
        nonWorkingDay : 'Día de no trabajar'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Hay rangos superpuestos',
        errorMissingDate   : 'Se requieren tiempo de inicio y finalización',
        errorStartAfterEnd : 'La hora de inicio no puede ser después de la hora final'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Nombre',
        from                                 : 'De',
        to                                   : 'A',
        is                                   : 'Es',
        nonWorking                           : 'No funciona',
        working                              : 'Laboral',
        hours                                : 'Horas',
        repeat                               : 'Repetir',
        repeatEnd                            : 'Repetido final',
        errorMissingDate                     : 'Se requiere un rango de fechas de excepción',
        errorStartAfterEnd                   : '"Desde" La fecha no puede ser después de la fecha "para" ',
        errorStartAndEndRepeatNumberMismatch : 'La excepción debe comenzar y terminar el mismo número de veces'
    },

    CalendarEditorWeekPanel : {
        name        : 'Nombre',
        from        : 'De',
        to          : 'A',
        days        : 'Días',
        copyDay     : 'Día de copia',
        pasteDay    : 'Día de pasta',
        stopCopying : 'Dejar de copiar'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Agregar rango',
        removeRange : 'Eliminar el rango'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"Desde" La fecha no puede ser después de la fecha "para" ',
        errorNoDefaultWeek           : 'Se requiere la configuración de la semana',
        errorMultipleDefaultWeeks    : 'Se especifica más de una semana predeterminada',
        errorNoWeekAvailability      : 'La semana debe proporcionar algo de tiempo de trabajo',
        errorInvalidWeekAvailability : 'La semana tiene errores de configuración del tiempo de trabajo',
        noRows                       : 'No se agregan semanas'
    },

    AdvancedTab : {
        Advanced                   : 'Avanzado',
        Calendar                   : 'Calendario',
        'Scheduling mode'          : 'Modo de programación',
        'Effort driven'            : 'Trabajo invertido',
        'Manually scheduled'       : 'Programado manualmente',
        'Constraint type'          : 'Tipo de restricción',
        'Constraint date'          : 'Fecha de la restricción',
        Constraint                 : 'Restricción',
        Rollup                     : 'Aplazamiento al resumen',
        Inactive                   : 'Inactivo',
        'Ignore resource calendar' : 'Ignorar calendario de recursos',
        'Scheduling direction'     : 'Dirección de programación',
        projectBorder              : 'Border de proyectos',
        ignore                     : 'Ignorar',
        honor                      : 'Honor',
        askUser                    : 'Pedirle al usuario'
    },

    DependencyTab : {
        Predecessors      : 'Anteriores',
        Successors        : 'Posteriores',
        ID                : 'DNI',
        Name              : 'Nombre',
        Type              : 'Tipo',
        Lag               : 'Retraso',
        cyclicDependency  : 'Dependencia cíclica',
        invalidDependency : 'Dependencia no válida',
        readOnlyTask      : 'No se puede vincular una tarea de solo lectura'
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
        costs               : 'Costos',
        save                : 'Ahorrar',
        error               : 'Error',
        inputErrors         : 'Hay errores de entrada. Corríjalos antes de guardar los cambios.',
        delete              : 'Borrar',
        confirmation        : 'Confirmación',
        removeUsedResource  : 'El recurso está asignado a algunas tareas. Haga clic en "Sí" para eliminar el recurso de todos modos.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Calendario',
        general     : 'General',
        label       : 'Etiqueta de material',
        name        : 'Nombre del recurso',
        type        : 'Tipo',
        costAccrual : 'Acumulación de costos',
        labelHint   : 'por ejemplo, kg, toneladas o cajas',
        maxUnits    : 'Unidades máximas'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Acumular en',
        prorated : 'prorrateado',
        start    : 'Comenzar',
        end      : 'Fin'
    },

    CostAccrualField : {
        prorated : 'prorrateado',
        start    : 'Comenzar',
        end      : 'Fin'
    },

    ResourceType : {
        work     : 'Trabajar',
        material : 'Material',
        cost     : 'Costo'
    },

    ResourceTypeColumn : {
        type : 'Tipo'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'tabla de tarifas',
        newGroup     : 'Nueva mesa',
        removeGroup  : 'Quitar tabla',
        useByDefault : 'Usar por defecto para las asignaciones de recursos.',
        noRates      : 'Sin tarifas'
    },

    ResourceGrid : {
        name          : 'Nombre',
        materialLabel : 'Etiqueta de material',
        maxUnits      : 'Unidades máximas',
        cost          : 'Costo',
        noRows        : 'Sin recursos'
    },

    ResourceRateTableContainer : {
        startDate    : 'Fecha de inicio',
        standardRate : 'Tarifa estándar',
        perUseCost   : 'Costo por uso',
        addRate      : 'Agregar tarifa',
        removeRate   : 'Eliminar tarifa',
        name         : 'Nombre',
        noRates      : 'Sin tarifas'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Información de la tabla de tarifas'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Cantidad',
        Resources   : 'Recursos',
        Resource    : 'Recurso',
        Units       : 'Unidades',
        cost        : 'Costo',
        effort      : 'Esfuerzo',
        start       : 'Comenzar',
        finish      : 'Finalizar',
        preamble    : 'Preámbulo',
        postamble   : 'Postámbulo'
    },

    RateTableColumn : {
        rateTable : 'tabla de tarifas'
    },

    RecurrenceTab : {
        title : 'Repetir'
    },

    SchedulingModePicker : {
        Normal           : 'Normal',
        'Fixed Duration' : 'Duración',
        'Fixed Units'    : 'Unidades fijas',
        'Fixed Effort'   : 'Trabajo fijo'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} de {available}</span> asignados',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} de {available}</span> asignados',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} de {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} de {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'El {startDate}<br><span class="{cls}">{allocated} de {available}</span> asignado:<br>{assignments}',
        plusMore              : '+{value} más'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Esfuerzo</div><div class="b-effort-value {cls}">{allocated} de {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Esfuerzo</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Costo</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Cantidad</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} el {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Resumen para {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Resumen para {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} más',
        nameColumnText        : 'Recurso / Evento'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Cancelar el cambio y no hacer nada',
        schedulingConflict : 'Conflicto de programación',
        emptyCalendar      : 'Error de configuración del calendario',
        cycle              : 'Programando ciclo',
        Apply              : 'Aplicar'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Seleccione una dependencia:',
        invalidDependencyLabel : 'Hay dependencias no válidas implicadas que deben ser corregidas:'
    },

    SchedulerProBase : {
        propagating     : 'Calculando proyecto',
        storePopulation : 'Cargando datos',
        finalizing      : 'Finalizando resultados'
    },

    EventSegments : {
        splitEvent    : 'Dividir evento',
        renameSegment : 'Renombrar'
    },

    NestedEvents : {
        createGroup         : 'Agrupar eventos seleccionados',
        newGroupName        : 'Nuevo grupo',
        deNestingNotAllowed : 'Desagrupado no permitido',
        nestingNotAllowed   : 'Agrupado permitido'
    },

    VersionGrid : {
        compare       : 'Comparar',
        description   : 'Descripción',
        occurredAt    : 'Ocurrió en',
        rename        : 'Renombrar',
        restore       : 'Restaurar',
        stopComparing : 'Detener comparación'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'tarea',
            AssignmentModel : 'asignación',
            DependencyModel : 'enlace',
            ProjectModel    : 'proyecto',
            ResourceModel   : 'recurso',
            other           : 'objeto'
        },
        entityNamesPlural : {
            TaskModel       : 'tares',
            AssignmentModel : 'asignaciones',
            DependencyModel : 'enlaces',
            ProjectModel    : 'proyectos',
            ResourceModel   : 'recursos',
            other           : 'objetos'
        },
        transactionDescriptions : {
            update : 'Se han cambiado {n} {entities}',
            add    : 'Se han añadido {n} {entities}',
            remove : 'Se han quitado {n} {entities}',
            move   : 'Se han movido {n} {entities}',
            mixed  : 'Se han cambiado {n} {entities}'
        },
        propertyNames : {
            active                   : 'Activo',
            allDay                   : 'Todo el día',
            allowOverlap             : 'Permitir superposición',
            barMargin                : 'Margen de barra',
            bidirectional            : 'Bidireccional',
            calendar                 : 'Calendario',
            cls                      : 'Clase CSS',
            constraintDate           : 'Fecha de restricción',
            constraintType           : 'Tipo de restricción',
            daysPerMonth             : 'Días por mes',
            daysPerWeek              : 'Días por semana',
            delayFromParent          : 'Retraso desde el padre',
            direction                : 'Dirección',
            drawDependencies         : 'Dibujar dependencias',
            duration                 : 'Duración',
            durationUnit             : 'Unidad de duración',
            effort                   : 'Esfuerzo',
            effortDriven             : 'Impulsado por esfuerzo',
            effortUnit               : 'Unidad de esfuerzo',
            endDate                  : 'Fecha de finalización',
            eventColor               : 'Color',
            eventId                  : 'ID de Evento',
            eventLayout              : 'Diseño del evento',
            eventStyle               : 'Estilo de barra',
            exceptionDates           : 'Fechas de excepción',
            fixed                    : 'Fijo',
            from                     : 'Desde',
            fromSide                 : 'Desde el lado',
            hoursPerDay              : 'Horas por día',
            href                     : 'Enlace',
            iconCls                  : 'Ícono',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignorar calendario de recursos',
            ignoreTimeZone           : 'Ignorar zona horaria',
            image                    : 'Imagen',
            imageUrl                 : 'URL de la imagen',
            inactive                 : 'Inactivo',
            intervals                : 'Intervalos',
            lag                      : 'Retraso',
            lagUnit                  : 'Unidad de retraso',
            lineStyle                : 'Estilo de línea',
            manuallyScheduled        : 'Programado manualmente',
            milestoneWidth           : 'Ancho del hito',
            name                     : 'Nombre',
            note                     : 'Nota',
            parentId                 : 'ID de Padre',
            parentIndex              : 'Posición',
            percentDone              : '% completado',
            postamble                : 'Postámbulo',
            preamble                 : 'Preámbulo',
            readOnly                 : 'Solo lectura',
            recurrenceRule           : 'Regla de recurrencia',
            resourceId               : 'ID de Recurso',
            resourceMargin           : 'Margen de recurso',
            rowHeight                : 'Altura de fila',
            schedulingMode           : 'Modo de programación',
            segments                 : 'Segmentos',
            showAvatar               : 'Mostrar avatar',
            showInTimeline           : 'Mostrar en la línea de tiempo',
            startDate                : 'Fecha de inicio',
            stickyContents           : 'Contenido fijo',
            strokeColor              : 'Color de línea',
            style                    : 'Estilo',
            target                   : 'Destino del enlace',
            to                       : 'Hasta',
            toSide                   : 'Hasta el lado',
            type                     : 'Tipo',
            units                    : 'Unidades',
            unscheduled              : 'No programado',
            unspecifiedTimeIsWorking : 'El tiempo no especificado es laboral',
            version                  : 'Versión'
        },
        intervals : {
            working    : 'Trabajando',
            nonWorking : 'No laborable',
            fromTo     : 'De {from} a {to}',
            recurring  : 'Recurrente comenzando {start} terminando {end}'
        },
        addEntity         : 'Se ha añadido {type} **{name}**',
        removeEntity      : 'Se ha quitado {type} **{name}**',
        updateEntity      : 'Se ha cambiado {type} **{name}**',
        moveEntity        : 'Se ha movido {type} **{name}** de {from} a {to}',
        addDependency     : 'Se ha añadido el enlace de **{from}** a **{to}**',
        removeDependency  : 'Se ha quitado el enlace de **{from}** a **{to}**',
        updateDependency  : 'Se ha editado el enlace de **{from}** a **{to}**',
        addAssignment     : 'Se ha asignado **{resource}** a **{event}**',
        removeAssignment  : 'Se ha quitado la asignación de **{resource}** a **{event}**',
        updateAssignment  : 'Se ha editado la asignación de **{resource}** a **{event}**',
        noChanges         : 'Sin cambios',
        nullValue         : 'ninguno',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Guardado a las {date}',
        autoSavedAt       : 'Guardado automáticamente a las {date}',
        undid             : 'Se han deshecho los cambios',
        redid             : 'Se han rehecho los cambios',
        editedTask        : 'Se han editado las propiedades de tarea',
        deletedTask       : 'Se ha eliminado una tarea',
        movedTask         : 'Se ha movido una tarea',
        movedTasks        : 'Se han movido tareas'
    }
};

export default LocaleHelper.publishLocale(locale);
