import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Es.js';

const locale = {

    localeName : 'Es',
    localeDesc : 'Español',
    localeCode : 'es',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Calendario',
        'All day' : 'Todo el día',
        day       : 'Día',
        week      : 'Semana',
        month     : 'Mes',
        year      : 'Año',
        decade    : 'Década'
    },

    EventMenu : {
        duplicateEvent : 'Duplicar evento',
        copy           : 'copiar'
    },

    Calendar : {
        toggleSidebar : 'Alternar visibilidad de la barra lateral',
        Today         : 'Hoy',
        Tomorrow      : '',
        next          : range => `Siguiente ${range}`,
        previous      : range => `Anterior ${range}`,
        plusMore      : value => `+${value} más`,
        moreEvents    : value => `${value} eventos más`,
        allDay        : 'Todo el día',
        endsOn        : d => `Termina el ${d}`,
        weekOfYear    : ([y, w]) => `Semana ${w}, ${y}`,
        loadFail      : 'Fallo al cargar los datos del calendario. Contacte con el administrador de su sistema',
        gotoDate      : 'Ir a la fecha',
        timeRange     : 'Rango de tiempo',
        noResources   : 'Sin recursos',
        calendar      : 'Calendario',
        toolbar       : 'Barra de herramientas del calendario',
        months        : 'Meses'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Presionar CTRL para un evento recurrente'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Sin'} evento${(count && count > 1) ? 's' : ''}`,
        allDayEventCount : count => `${count || 'Ningún'} evento de todo el día${count === 1 ? '' : 's'}`
    },

    EventTip : {
        'Edit event' : 'Editar evento',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Incluir fines de semana',
        weekends        : 'Fines de semana',
        switcherMenu    : 'Menú de cambio de vista'
    },

    AgendaView : {
        Agenda : 'Agenda'
    },

    MonthView : {
        Month     : 'Mes',
        monthUnit : 'mes'
    },

    MultiWeekView : {
        multiWeek : 'Varias semanas'
    },

    WeekView : {
        weekUnit : 'semana'
    },

    YearView : {
        Year     : 'Año',
        yearUnit : 'año',
        noEvents : 'No hay eventos'
    },

    YearPlanner : {
        yearPlanner      : 'Planificador Anual',
        expandMonthRow   : 'Expandir fila del mes',
        collapseMonthRow : 'Colapsar fila del mes'
    },

    EventList : {
        List   : 'Lista',
        Start  : 'Inicio',
        Finish : 'Finalización',
        days   : count => `${count > 1 ? `${count} ` : ''}día${count === 1 ? '' : 's'}`
    },

    DayView : {
        Day                : 'Día',
        dayUnit            : 'día',
        daysUnit           : 'días',
        expandAllDayRow    : 'Expandir sección de todo el día',
        collapseAllDayRow  : 'Contraer sección de todo el día',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'No hay fechas coincidentes'
    },

    DayAgendaView : {
        dayAgenda : 'Agenda del día'
    },

    DayResourceView : {
        dayResourceView : 'Recursos diarios'
    },

    MonthGrid : {
        monthGrid : 'Cuadrícula de meses'
    },

    Sidebar : {
        selectDate      : 'Seleccionar fecha del calendario',
        matchEvents     : 'Eventos del partido',
        filterEvents    : 'Filtrar eventos por nombre del evento',
        filterResources : 'Filtrar eventos por recurso seleccionado'
    },

    WeekExpander : {
        expandTip   : 'Hacer clic para expandir fila',
        collapseTip : 'Hacer clic para contraer fila'
    },

    keyboardActions : {
        title   : 'Acciones del teclado',
        content : 'Mostrar panel de ayuda : [?]\nBotón de selección de modo de enfoque : [Inicio]\nCambiar vista : [1] a [9] o primera letra del texto del botón selector\nSiguiente intervalo de tiempo : [n]\nIntervalo de tiempo anterior : [p]\nIr a hoy : [t]\nNavegar a la fecha : [g]\nIr a la celda del día actual : [CTRL]+[d]\nNavegar entre eventos : [TAB]\nEnfocar entrada de filtro de eventos en la barra lateral : [/]\nCrear nuevo evento (enfocado en la celda del día) : [ENTER]\nEliminar evento enfocado : [DELETE]/[BACKSPACE]\nEditar el evento enfocado : [ENTER]\nInvocar menú contextual en evento o celda : [SHIFT+F10]/[SPACE]\nEnfocar desde el evento hasta la celda que lo contiene : [ESCAPE]\nNavegación de celda a celda : [TECLAS DE FLECHA]\nActivar menú de rango (en vista de Agenda) : [CTRL]+[r]\nCortar, copiar, pegar eventos : [CTRL]+[x]/[c]/[v]\nAcercar/alejar solo en VistaDiaria : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
