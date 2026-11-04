import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Ca.js';
import '../../Grid/localization/Ca.js';

const locale = {

    localeName : 'Ca',
    localeDesc : 'Català',
    localeCode : 'ca-ES',
    localeRtl  : false,

    Object : {
        newEvent    : 'Esdeveniment nou',
        information : 'Informació',
        showDetails : 'Mostra detalls'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' esdeveniment' + (data !== 1 ? 's' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Commuta la columna del disseny del recurs. ESPAI per al menú contextual.'
    },

    Dependencies : {
        from    : 'De',
        to      : 'A',
        valid   : 'Vàlid',
        invalid : 'No vàlid'
    },

    DependencyType : {
        SS           : 'II',
        SF           : 'IF',
        FS           : 'FI',
        FF           : 'FF',
        StartToStart : "D'inici a inici",
        StartToEnd   : "D'inici a final",
        EndToStart   : 'De final a inici',
        EndToEnd     : 'De final a final',
        short        : [
            'II',
            'IF',
            'FI',
            'FF'
        ],
        long : [
            "D'inici a inici",
            "D'inici a final",
            'De final a inici',
            'De final a final'
        ]
    },

    DependencyEdit : {
        From              : 'De',
        To                : 'A',
        Type              : 'Tipus',
        Lag               : 'Retard',
        color             : 'Color',
        lineStyle         : 'Estil de línia',
        solid             : 'Sòlid',
        dashed            : 'Discontinu',
        dotted            : 'Puntejat',
        dashDot           : 'Guió-punt',
        longDash          : 'Guió llarg',
        'Edit dependency' : 'Edita la dependència',
        Save              : 'Desa',
        Delete            : 'Suprimeix',
        Cancel            : 'Cancel·la',
        StartToStart      : "D'inici a inici",
        StartToEnd        : "D'inici a final",
        EndToStart        : 'De final a inici',
        EndToEnd          : 'De final a final',
        Active            : 'Actiu'
    },

    EventEdit : {
        Name           : 'Nom',
        Resource       : 'Recurs',
        Start          : 'Inici',
        startTime      : 'Hora d’inici',
        End            : 'Final',
        endTime        : 'Hora de finalització',
        Save           : 'Desa',
        Delete         : 'Suprimeix',
        Cancel         : 'Cancel·la',
        'Edit event'   : "Edita l'esdeveniment",
        Repeat         : 'Repeteix',
        editRecurrence : 'Edita la recurrència'
    },

    EventDrag : {
        eventOverlapsExisting   : "L'esdeveniment se superposa a un esdeveniment existent per a aquest recurs",
        noDropOutsideTimeline   : "És possible que l'esdeveniment no es pugui treure completament de la cronologia",
        duplicateAssignmentDrag : "L'esdeveniment no es pot assignar al mateix recurs diverses vegades"
    },

    SchedulerBase : {
        'Add event'      : 'Afegeix un esdeveniment',
        'Delete event'   : "Suprimeix l'esdeveniment",
        'Unassign event' : "Desassigna l'esdeveniment",
        color            : 'Color',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, comença a ${startDate} ${eventRecord.duration > 0 ? `durant ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zoom',
        activeDateRange : 'Interval de dates',
        startText       : "Data d'inici",
        endText         : 'Data de finalització',
        todayText       : 'Avui'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Eix temporal mostrant de ${startDate} a ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : "Copia l'esdeveniment",
        cutEvent   : "Retalla l'esdeveniment",
        pasteEvent : "Enganxa l'esdeveniment"
    },

    EventFilter : {
        filterEvents : 'Filtra les tasques',
        byName       : 'Per nom'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Mostra la cronologia actual'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Segons'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd MM/DD, hA',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd MM/DD',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Dia'
        },
        day : {
            name : 'Dia/hores'
        },
        week : {
            name : 'Setmana/hores'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Setmana/dies'
        },
        dayAndMonth : {
            name : 'Mes'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Setmana'
        },
        weekAndMonth : {
            name : 'Setmanes'
        },
        weekAndDayLetter : {
            name : 'Setmanes/dies feiners'
        },
        weekDateAndMonth : {
            name : 'Mesos/setmanes'
        },
        monthAndYear : {
            name : 'Mesos'
        },
        year : {
            name : 'Anys'
        },
        manyYears : {
            name : 'Diversos anys'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Esteu suprimint un esdeveniment',
        'delete-all-message'        : "Voleu suprimir totes les repeticions d'aquest esdeveniment?",
        'delete-further-message'    : "Voleu suprimir aquesta i totes les repeticions futures de l'esdeveniment o només la repetició seleccionada?",
        'delete-only-this-message'  : "Vols suprimir aquesta ocurrència d'aquest esdeveniment?",
        'delete-further-btn-text'   : 'Suprimeix tots els esdeveniments futurs',
        'delete-only-this-btn-text' : 'Suprimeix només aquest esdeveniment',
        'update-title'              : 'Esteu canviant un esdeveniment que es repeteix',
        'update-all-message'        : "Voleu canviar totes les repeticions d'aquest esdeveniment?",
        'update-further-message'    : "Voleu canviar només aquesta repetició de l'esdeveniment o aquesta i totes les repeticions futures?",
        'update-only-this-message'  : "Vols canviar aquesta ocurrència d'aquest esdeveniment?",
        'update-further-btn-text'   : 'Tots els esdeveniments futurs',
        'update-only-this-btn-text' : 'Només aquest esdeveniment',
        Yes                         : 'Sí',
        Cancel                      : 'Cancel·la',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' i ',
        Daily                           : 'Diàriament',
        'Weekly on {1}'                 : ({ days }) => `Setmanalment ${days}`,
        'Monthly on {1}'                : ({ days }) => `Mensualment ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Anualment ${days} de ${months}`,
        'Every {0} days'                : ({ interval }) => `Cada ${interval} dies`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Cada ${interval} setmanes ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Cada ${interval} mesos ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Cada ${interval} anys ${days} de ${months}`,
        position1                       : 'el primer',
        position2                       : 'el segon',
        position3                       : 'el tercer',
        position4                       : 'el quart',
        position5                       : 'el cinquè',
        'position-1'                    : "l'últim",
        day                             : 'dia',
        weekday                         : 'dia feiner',
        'weekend day'                   : 'dia del cap de setmana',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : "Repeteix l'esdeveniment",
        Cancel              : 'Cancel·la',
        Save                : 'Desa',
        Frequency           : 'Freqüència',
        Every               : 'Cada',
        DAILYintervalUnit   : 'dia/es',
        WEEKLYintervalUnit  : 'setmana/es',
        MONTHLYintervalUnit : 'mes/os',
        YEARLYintervalUnit  : 'any/s',
        Each                : 'Cada',
        on                  : 'El',
        the                 : 'El',
        'On the'            : 'El dia',
        'End repeat'        : 'Finalitza la repetició',
        'time(s)'           : 'vegada/es',
        Days                : 'Dies',
        Months              : 'meses'
    },

    RecurrenceDaysCombo : {
        day           : 'dia',
        weekday       : 'dia feiner',
        'weekend day' : 'dia del cap de setmana'
    },

    RecurrencePositionsCombo : {
        position1    : 'primer',
        position2    : 'segon',
        position3    : 'tercer',
        position4    : 'quart',
        position5    : 'cinquè',
        'position-1' : 'darrer'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Mai',
        After     : 'Després de',
        'On date' : 'El dia'
    },

    RecurrenceFrequencyCombo : {
        None    : 'No hi ha cap repetició',
        Daily   : 'Diàriament',
        Weekly  : 'Setmanalment {0}',
        Monthly : 'Mensualment',
        Yearly  : 'Anualment'
    },

    RecurrenceCombo : {
        None   : 'Cap',
        Custom : 'Personalitzat...'
    },

    Summary : {
        'Summary for' : date => `Resum del dia ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Planificació completa',
        currentview  : 'Planificació visible',
        daterange    : 'Interval de dates',
        completedata : 'Planificació completa (de tots els esdeveniments)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Interval de planificació',
        'Export from'    : 'De',
        'Export to'      : 'A'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Pàgina única'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Pàgina única (sense escala)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Múltiples pàgines (vertical)'
    },

    ExcelExporter : {
        'No resource assigned' : 'No hi ha cap recurs assignat'
    },

    CrudManagerView : {
        serverResponseLabel : 'Resposta del servidor:'
    },

    DurationColumn : {
        Duration : 'Durada'
    },

    EventClusteringBase : {
        unnamed         : 'Sense nom',
        more            : count => `+ ${count} més`,
        clusteredEvents : count => `${count} esdeveniments agrupats`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} intervals agrupats`
    },

    ConstraintTypePicker : {
        none                : 'Cap',
        assoonaspossible    : 'Al més aviat possible',
        aslateaspossible    : 'Al més tard possible',
        muststarton         : 'Ha de començar el',
        mustfinishon        : "Ha d'acabar el",
        startnoearlierthan  : 'No començar abans de',
        startnolaterthan    : 'No començar després de',
        finishnoearlierthan : 'No acabar abans de',
        finishnolaterthan   : 'No acabar després de'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} temps de buffer abans de l'esdeveniment`;
            }
            if (postamble) {
                description += `.${postamble.toString()} temps de buffer després de l'esdeveniment`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Reenvia',
        Backward      : 'Enrere',
        inheritedFrom : 'Heretat de',
        enforcedBy    : 'Aplicat per'
    },

    CalendarField : {
        'Default calendar' : 'Calendari per defecte',
        editCalendar       : 'Edita el calendari'
    },

    TaskEditorBase : {
        Information   : 'Informació de la tasca',
        Save          : 'Desa',
        Cancel        : 'Cancel·la',
        Delete        : 'Elimina',
        calculateMask : "S'està calculant...",
        saveError     : 'No es pot desar, primer corregiu els errors',
        repeatingInfo : "S'està visualitzant un esdeveniment repetit",
        editRepeating : 'Edita'
    },

    TaskEdit : {
        editEvent              : "Edita l'esdeveniment",
        ConfirmDeletionTitle   : 'Confirma la supressió',
        ConfirmDeletionMessage : "Segur que voleu suprimir l'esdeveniment?"
    },

    GanttTaskEditor : {
        editorWidth : '44 em'
    },

    SchedulerTaskEditor : {
        editorWidth : '35 em'
    },

    SchedulerGeneralTab : {
        General      : 'General',
        Name         : 'Nom',
        Resources    : 'Recursos',
        '% complete' : '% completat',
        Duration     : 'Durada',
        Start        : 'Inici',
        Finish       : 'Final',
        Effort       : 'Esforç',
        Preamble     : 'Preàmbul',
        Postamble    : 'Postàmbul'
    },

    GeneralTab : {
        General      : 'General',
        Name         : 'Nom',
        '% complete' : '% completat',
        Duration     : 'Durada',
        Start        : 'Inici',
        Finish       : 'Final',
        Effort       : 'Esforç',
        Dates        : 'Dates'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Avançat',
        Calendar                   : 'Calendari',
        'Scheduling mode'          : 'Mode de planificació',
        'Effort driven'            : "Basat en l'esforç",
        'Manually scheduled'       : 'Planificat manualment',
        'Constraint type'          : 'Tipus de restricció',
        'Constraint date'          : 'Data de la restricció',
        Inactive                   : 'Inactiu',
        'Ignore resource calendar' : 'Ignora el calendari del recurs'
    },

    CalendarEditorDatePicker : {
        addException : 'Afegeix una excepció',
        addWeek      : 'Afegeix setmana'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Afegeix una excepció',
        removeException : "Elimina l'excepció",
        noRows          : "No s'han afegit excepcions"
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Afegeix setmana',
        removeWeek : 'Elimina la setmana'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Els dies funcionen per defecte',
        workingTimeCalendar        : 'Calendari de temps de treball',
        exceptions                 : 'Excepcions',
        general                    : 'General',
        name                       : 'Nom',
        parent                     : 'Pare',
        save                       : 'Desa',
        weeks                      : 'Setmanes',
        error                      : 'Error',
        inputErrors                : "Hi ha errors d'entrada. Corregiu-los abans de desar els canvis.",
        delete                     : 'Suprimeix',
        addCalendar                : 'Afegeix un calendari',
        confirmation               : 'Confirmació',
        removeCalendarWithChildren : 'El calendari té calendaris infantils. Feu clic a "Sí" per eliminar el calendari amb els seus fills.',
        removeCalendarAndLinks     : 'El calendari és utilitzat per alguns registres. Feu clic a "Sí" per desenllaçar-los i eliminar el calendari.',
        newException               : 'Nova excepció',
        newWeek                    : 'Nova setmana'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' està funcionant',
        isNotWorking : ' no funciona',
        basedOn      : ' basat en:',
        byDefault    : 'per defecte',
        rangeTpl     : (start, end) => `${start} - ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Jornada',
        nonWorkingDay : 'Dia no laborable'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Hi ha rangs superposats',
        errorMissingDate   : "Es requereix l'hora d'inici i de finalització",
        errorStartAfterEnd : "L'hora d'inici no pot ser posterior a l'hora de finalització"
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Nom',
        from                                 : 'Des de',
        to                                   : 'A',
        is                                   : 'És',
        nonWorking                           : 'No treballant',
        working                              : 'Treball',
        hours                                : 'Hores',
        repeat                               : 'Repetiu',
        repeatEnd                            : 'Repetiu el final',
        errorMissingDate                     : "L'interval de dates d'excepció és obligatori",
        errorStartAfterEnd                   : 'La data "Des de" no pot ser posterior a la data "Fins".',
        errorStartAndEndRepeatNumberMismatch : "L'excepció hauria de començar i acabar el mateix nombre de vegades"
    },

    CalendarEditorWeekPanel : {
        name        : 'Nom',
        from        : 'Des de',
        to          : 'A',
        days        : 'Dies',
        copyDay     : 'Dia de còpia',
        pasteDay    : 'Dia de pasta',
        stopCopying : 'Deixa de copiar'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Afegeix un rang',
        removeRange : "Elimina l'interval"
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : 'La data "Des de" no pot ser posterior a la data "Fins".',
        errorNoDefaultWeek           : 'Cal configurar la setmana',
        errorMultipleDefaultWeeks    : "S'especifica més d'una setmana predeterminada",
        errorNoWeekAvailability      : 'La setmana ha de proporcionar un temps de treball',
        errorInvalidWeekAvailability : "La setmana té errors de configuració de l'horari laboral",
        noRows                       : 'Sense setmanes afegides'
    },

    AdvancedTab : {
        Advanced                   : 'Avançat',
        Calendar                   : 'Calendari',
        'Scheduling mode'          : 'Mode de planificació',
        'Effort driven'            : "Basat en l'esforç",
        'Manually scheduled'       : 'Planificat manualment',
        'Constraint type'          : 'Tipus de restricció',
        'Constraint date'          : 'Data de la restricció',
        Constraint                 : 'Restricció',
        Rollup                     : 'Afegeix al resum',
        Inactive                   : 'Inactiu',
        'Ignore resource calendar' : 'Ignora el calendari del recurs',
        'Scheduling direction'     : 'Direcció de la planificació',
        projectBorder              : 'Frontera del projecte',
        ignore                     : 'Ignorar',
        honor                      : 'Honor',
        askUser                    : "Pregunta a l'usuari"
    },

    DependencyTab : {
        Predecessors      : 'Predecessors',
        Successors        : 'Successors',
        ID                : 'Identificador',
        Name              : 'Nom',
        Type              : 'Tipus',
        Lag               : 'Retard',
        cyclicDependency  : 'Dependència cíclica',
        invalidDependency : 'Dependència no vàlida',
        readOnlyTask      : 'No es pot enllaçar una tasca de només lectura'
    },

    NotesTab : {
        Notes : 'Notes'
    },

    ResourceCalendarColumn : {
        calendar : 'Calendari'
    },

    ResourceEdit : {
        editResource : 'Edita el recurs'
    },

    ResourceEditor : {
        resourceInformation : 'Informació de recursos',
        costs               : 'Costos',
        save                : 'Desa',
        error               : 'Error',
        inputErrors         : "Hi ha errors d'entrada. Corregiu-los abans de desar els canvis.",
        delete              : 'Suprimeix',
        confirmation        : 'Confirmació',
        removeUsedResource  : 'El recurs està assignat a algunes tasques. Feu clic a "Sí" per eliminar el recurs de totes maneres.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Calendari',
        general     : 'General',
        label       : 'Etiqueta del material',
        name        : 'Nom del recurs',
        type        : 'Tipus',
        costAccrual : 'Acumulació de costos',
        labelHint   : 'per exemple, kg, tones o caixes',
        maxUnits    : 'Unitats màximes'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Acumular a',
        prorated : 'Prorratejat',
        start    : 'Comença',
        end      : 'Final'
    },

    CostAccrualField : {
        prorated : 'Prorratejat',
        start    : 'Comença',
        end      : 'Final'
    },

    ResourceType : {
        work     : 'Treballar',
        material : 'Material',
        cost     : 'Cost'
    },

    ResourceTypeColumn : {
        type : 'Tipus'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Taula de tarifes',
        newGroup     : 'Nova taula',
        removeGroup  : 'Elimina la taula',
        useByDefault : "S'utilitza per defecte per a les assignacions de recursos",
        noRates      : 'Sense tarifes'
    },

    ResourceGrid : {
        name          : 'Nom',
        materialLabel : 'Etiqueta del material',
        maxUnits      : 'Unitats màximes',
        cost          : 'Cost',
        noRows        : 'Sense recursos'
    },

    ResourceRateTableContainer : {
        startDate    : "Data d'inici",
        standardRate : 'Tarifa estàndard',
        perUseCost   : 'Cost per ús',
        addRate      : 'Afegeix tarifa',
        removeRate   : 'Elimina la taxa',
        name         : 'Nom',
        noRates      : 'Sense tarifes'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Informació de la taula de tarifes'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Quantitat',
        Resources   : 'Recursos',
        Resource    : 'Recurs',
        Units       : 'Unitats',
        cost        : 'Cost',
        effort      : 'Esforç',
        start       : 'Comença',
        finish      : 'Acabar',
        preamble    : 'Preàmbul',
        postamble   : 'Postàmbul'
    },

    RateTableColumn : {
        rateTable : 'Taula de tarifes'
    },

    RecurrenceTab : {
        title : 'Repeteix'
    },

    SchedulingModePicker : {
        Normal           : 'Normal',
        'Fixed Duration' : 'Durada fixa',
        'Fixed Units'    : 'Unitats fixes',
        'Fixed Effort'   : 'Esforç fix'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} de {available}</span> assignats',
        barTipOnDate          : '<b>{resource}</b> el dia {startDate}<br><span class="{cls}">{allocated} de {available}</span> assignats',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} de {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} de {available}</span> assignats:<br>{assignments}',
        groupBarTipOnDate     : 'El dia {startDate}<br><span class="{cls}">{allocated} de {available}</span> assignats:<br>{assignments}',
        plusMore              : '+{value} més'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Esforç</div><div class="b-effort-value {cls}">{allocated} de {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Esforç</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Cost</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Quantitat</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} el {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Resum per {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Resum per {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} més',
        nameColumnText        : 'Recurs / Esdeveniment'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Cancel·la el canvi i no facis res',
        schedulingConflict : 'Conflicte de planificació',
        emptyCalendar      : 'Error de configuració del calendari',
        cycle              : 'Cicle de planificació',
        Apply              : 'Aplica'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Seleccioneu una dependència:',
        invalidDependencyLabel : "Hi ha dependències no vàlides implicades que s'han d'abordar:"
    },

    SchedulerProBase : {
        propagating     : "S'està calculant el projecte",
        storePopulation : "S'estan carregant les dades",
        finalizing      : "S'estan finalitzant els resultats"
    },

    EventSegments : {
        splitEvent    : "Divideix l'esdeveniment",
        renameSegment : 'Canvi de nom'
    },

    NestedEvents : {
        createGroup         : 'Agrupa els esdeveniments seleccionats',
        newGroupName        : 'Grup nou',
        deNestingNotAllowed : 'No es permet cancel·lar la imbricació',
        nestingNotAllowed   : 'No es permet la imbricació'
    },

    VersionGrid : {
        compare       : 'Compara',
        description   : 'Descripció',
        occurredAt    : 'Produït a les',
        rename        : 'Canvia de nom',
        restore       : 'Restaura',
        stopComparing : 'Deixa de comparar'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'tasca',
            AssignmentModel : 'assignació',
            DependencyModel : 'enllaç',
            ProjectModel    : 'projecte',
            ResourceModel   : 'recurs',
            other           : 'objecte'
        },
        entityNamesPlural : {
            TaskModel       : 'tasques',
            AssignmentModel : 'assignacions',
            DependencyModel : 'enllaços',
            ProjectModel    : 'projectes',
            ResourceModel   : 'recursos',
            other           : 'objectes'
        },
        transactionDescriptions : {
            update : "S'han canviat {n} {entities}",
            add    : "S'han afegit {n} {entities}",
            remove : "S'han eliminat {n} {entities}",
            move   : "S'han mogut {n} {entities}",
            mixed  : "S'han canviat {n} {entities}"
        },
        propertyNames : {
            active                   : 'Actiu',
            allDay                   : 'Tot el dia',
            allowOverlap             : 'Permetre superposició',
            barMargin                : 'Marge de barra',
            bidirectional            : 'Bidireccional',
            calendar                 : 'Calendari',
            cls                      : 'Classe CSS',
            constraintDate           : 'Data de restricció',
            constraintType           : 'Tipus de restricció',
            daysPerMonth             : 'Dies per mes',
            daysPerWeek              : 'Dies per setmana',
            delayFromParent          : 'Retard del pare',
            direction                : 'Direcció',
            drawDependencies         : 'Dibuixar dependències',
            duration                 : 'Durada',
            durationUnit             : 'Unitat de durada',
            effort                   : 'Esforç',
            effortDriven             : 'Impulsat per esforç',
            effortUnit               : "Unitat d'esforç",
            endDate                  : 'Data de finalització',
            eventColor               : 'Color',
            eventId                  : "ID d'esdeveniment",
            eventLayout              : "Disseny de l'esdeveniment",
            eventStyle               : 'Estil de barra',
            exceptionDates           : "Dates d'excepció",
            fixed                    : 'Fixat',
            from                     : 'Des de',
            fromSide                 : 'Des del costat',
            hoursPerDay              : 'Hores per dia',
            href                     : 'Enllaç',
            iconCls                  : 'Icona',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignorar el calendari de recursos',
            ignoreTimeZone           : 'Ignorar la zona horària',
            image                    : 'Imatge',
            imageUrl                 : 'URL de la imatge',
            inactive                 : 'Inactiu',
            intervals                : 'Intervals',
            lag                      : 'Retard',
            lagUnit                  : 'Unitat de retard',
            lineStyle                : 'Estil de línia',
            manuallyScheduled        : 'Programat manualment',
            milestoneWidth           : 'Amplada del hito',
            name                     : 'Nom',
            note                     : 'Nota',
            parentId                 : 'ID principal',
            parentIndex              : 'Posició',
            percentDone              : '% completat',
            postamble                : 'Postàmbul',
            preamble                 : 'Preàmbul',
            readOnly                 : 'Només lectura',
            recurrenceRule           : 'Regla de recurrència',
            resourceId               : 'ID de recurs',
            resourceMargin           : 'Marge de recurs',
            rowHeight                : 'Alçada de fila',
            schedulingMode           : 'Mode de programació',
            segments                 : 'Segments',
            showAvatar               : 'Mostrar avatar',
            showInTimeline           : 'Mostrar en la línia de temps',
            startDate                : "Data d'inici",
            stickyContents           : 'Continguts enganxosos',
            strokeColor              : 'Color de línia',
            style                    : 'Estil',
            target                   : "Objectiu de l'enllaç",
            to                       : 'Fins a',
            toSide                   : 'Fins al costat',
            type                     : 'Tipus',
            units                    : 'Unitats',
            unscheduled              : 'No programat',
            unspecifiedTimeIsWorking : 'El temps no especificat és treballador',
            version                  : 'Versió'
        },
        intervals : {
            working    : 'Treballant',
            nonWorking : 'No treballant',
            fromTo     : 'De {from} a {to}',
            recurring  : 'Recurrent començant {start} acabant {end}'
        },
        addEntity         : "S'ha afegit {type} **{name}**",
        removeEntity      : "S'ha eliminat {type} **{name}**",
        updateEntity      : "S'ha canviat {type} **{name}**",
        moveEntity        : "S'ha mogut {type} **{name}** de {from} a {to}",
        addDependency     : "S'ha afegit un enllaç de **{from}** a **{to}**",
        removeDependency  : "S'ha eliminat l'enllaç de **{from}** a **{to}**",
        updateDependency  : "S'ha editat l'enllaç de **{from}** a **{to}**",
        addAssignment     : "S'ha assignat **{resource}** a **{event}**",
        removeAssignment  : "S'ha eliminat l'assignació de **{resource}** a **{event}**",
        updateAssignment  : "S'ha editat l'assignació de **{resource}** a **{event}**",
        noChanges         : 'No hi ha canvis',
        nullValue         : 'cap',
        versionDateFormat : 'D/M/AAAA h:mm a',
        savedAt           : 'Desat a {date}',
        autoSavedAt       : 'Desat automàticament a {date}',
        undid             : "S'han desfet els canvis",
        redid             : "S'han refet els canvis",
        editedTask        : 'Propietats de la tasca editada',
        deletedTask       : "S'ha suprimit una tasca",
        movedTask         : "S'ha mogut una tasca",
        movedTasks        : "S'han mogut tasques"
    }
};

export default LocaleHelper.publishLocale(locale);
