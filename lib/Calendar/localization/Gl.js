import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Gl.js';

const locale = {

    localeName : 'Gl',
    localeDesc : 'Galego',
    localeCode : 'gl-ES',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Calendario',
        'All day' : 'Todo o día',
        day       : 'Día',
        week      : 'Semana',
        month     : 'Mes',
        year      : 'Ano',
        decade    : 'Década'
    },

    EventMenu : {
        duplicateEvent : 'Duplicar evento',
        copy           : 'copiar'
    },

    Calendar : {
        toggleSidebar : 'Alternar visibilidade da barra lateral',
        Today         : 'Hoxe',
        Tomorrow      : 'Mañá',
        next          : range => `${range} seguinte`,
        previous      : range => `${range} anterior`,
        plusMore      : value => `+${value} máis`,
        moreEvents    : value => `${value} eventos máis`,
        allDay        : 'Todo o día',
        endsOn        : d => `Finaliza o ${d}`,
        weekOfYear    : ([y, w]) => `Semana ${w}, ${y}`,
        loadFail      : 'Non se puideron cargar os datos do calendario. Póñase en conatacto co administrador do sistema',
        gotoDate      : 'Ir á data',
        timeRange     : 'Intervalo de tempo',
        noResources   : 'Sen recursos',
        calendar      : 'Calendario',
        toolbar       : 'Barra de ferramentas do calendario',
        months        : 'Meses'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Manteña premido CTRL para un evento recorrente'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Non'} event${count === 1 ? '' : 's'}`,
        allDayEventCount : count => `${count || 'Ningún'} evento de todo o día${count === 1 ? '' : 's'}`
    },

    EventTip : {
        'Edit event' : 'Editar evento',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Incluír fins de semana',
        weekends        : 'Fins de semana',
        switcherMenu    : 'Menú de cambio de vista'
    },

    AgendaView : {
        Agenda : 'Axenda'
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
        Year     : 'Ano',
        yearUnit : 'ano',
        noEvents : 'Sen eventos'
    },

    YearPlanner : {
        yearPlanner      : 'Planificador anual',
        expandMonthRow   : 'Expandir fila do mes',
        collapseMonthRow : 'Colapsar fila do mes'
    },

    EventList : {
        List   : 'Lista',
        Start  : 'Inicio',
        Finish : 'Fin',
        days   : count => `${count > 1 ? `${count} ` : ''}day${count === 1 ? '' : 's'}`
    },

    DayView : {
        Day                : 'Día',
        dayUnit            : 'día',
        daysUnit           : 'días',
        expandAllDayRow    : 'Expandir a sección todo o día',
        collapseAllDayRow  : 'Contraer a sección todo o día',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Non hai datas coincidentes'
    },

    DayAgendaView : {
        dayAgenda : 'Axenda do día'
    },

    DayResourceView : {
        dayResourceView : 'Recursos de día'
    },

    MonthGrid : {
        monthGrid : 'Grade de meses'
    },

    Sidebar : {
        selectDate      : 'Selecciona a data do calendario',
        matchEvents     : 'Eventos do partido',
        filterEvents    : 'Filtrar eventos por nome do evento',
        filterResources : 'Filtrar eventos polo recurso seleccionado'
    },

    WeekExpander : {
        expandTip   : 'Prema para expandir a fila',
        collapseTip : 'Prema para contraer a fila'
    },

    keyboardActions : {
        title   : 'Accións do teclado',
        content : 'Mostrar panel de axuda : [?]\nBotón de selección de modo de enfoque : [Inicio]\nCambiar vista : [1] a [9] ou primeira letra do texto do botón selector\nPróximo intervalo de tempo : [n]\nIntervalo de tempo anterior : [p]\nIr a hoxe : [t]\nNavegar ata a data : [g]\nIr á cela do día actual : [CTRL]+[d]\nNavegar entre eventos : [TAB]\nEnfocar entrada de filtro de eventos da barra lateral : [/]\nCrear novo evento (enfocado na cela do día) : [ENTER]\nEliminar evento enfocado : [DELETE]/[BACKSPACE]\nEditar o evento enfocado : [ENTER]\nInvocar menú contextual en evento ou cela : [SHIFT+F10]/[SPACE]\nEnfocar desde o evento ata a cela contedora : [ESCAPE]\nNavegación de cela a cela : [TECLAS DE FLECHA]\nActivar menú de rango (na vista Axenda) : [CTRL]+[r]\nCortar, copiar, pegar eventos : [CTRL]+[x]/[c]/[v]\nAmpliar/reducir só a vista do día : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
