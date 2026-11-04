import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Ca.js';

const locale = {

    localeName : 'Ca',
    localeDesc : 'Català',
    localeCode : 'ca-ES',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Calendari',
        'All day' : 'Tot el dia',
        day       : 'Dia',
        week      : 'Setmana',
        month     : 'Mes',
        year      : 'Any',
        decade    : 'Dècada'
    },

    EventMenu : {
        duplicateEvent : "Duplica l'esdeveniment",
        copy           : 'copia'
    },

    Calendar : {
        toggleSidebar : 'Canviar la visibilitat de la barra lateral',
        Today         : 'Avui',
        Tomorrow      : 'Demà',
        next          : range => `${range} següents`,
        previous      : range => `${range} anteriors`,
        plusMore      : value => `+${value} més`,
        moreEvents    : value => `${value} més esdeveniments`,
        allDay        : 'Tot el dia',
        endsOn        : d => `Acaba el dia ${d}`,
        weekOfYear    : ([y, w]) => `Setmana ${w}, ${y}`,
        loadFail      : "No s'han pogut carregar les dades del calendari. Poseu-vos en contacte amb l'administrador del sistema.",
        gotoDate      : 'Anar a la data',
        timeRange     : 'Interval de temps',
        noResources   : 'Sense recursos',
        calendar      : 'Calendari',
        toolbar       : "Barra d'eines del calendari",
        months        : 'Mesos'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Manteniu premut CTRL per crear un esdeveniment recurrent'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'No hi ha'} esdeveniment${count === 1 ? '' : 's'}`,
        allDayEventCount : count => `${count || 'Cap'} esdeveniment de tot el dia${count === 1 ? '' : 's'}`
    },

    EventTip : {
        'Edit event' : "Edita l'esdeveniment",
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Inclou caps de setmana',
        weekends        : 'Caps de setmana',
        switcherMenu    : 'Menú de canvi de vista'
    },

    AgendaView : {
        Agenda : 'Agenda'
    },

    MonthView : {
        Month     : 'Mes',
        monthUnit : 'mes'
    },

    MultiWeekView : {
        multiWeek : 'Diverses setmanes'
    },

    WeekView : {
        weekUnit : 'setmana'
    },

    YearView : {
        Year     : 'Any',
        yearUnit : 'any',
        noEvents : 'No hi ha cap esdeveniment'
    },

    YearPlanner : {
        yearPlanner      : 'Planificador anual',
        expandMonthRow   : 'Expandir fila del mes',
        collapseMonthRow : 'Contraure fila del mes'
    },

    EventList : {
        List   : 'Llista',
        Start  : 'Inici',
        Finish : 'Final',
        days   : count => `${count > 1 ? `${count} ` : ''}di${count === 1 ? 'a' : 'es'}`
    },

    DayView : {
        Day                : 'Dia',
        dayUnit            : 'dia',
        daysUnit           : 'dies',
        expandAllDayRow    : 'Expandeix la secció de tot el dia',
        collapseAllDayRow  : 'Redueix la secció de tot el dia',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'No hi ha dates coincidents'
    },

    DayAgendaView : {
        dayAgenda : 'Agenda del dia'
    },

    DayResourceView : {
        dayResourceView : 'Recursos del dia'
    },

    MonthGrid : {
        monthGrid : 'Graella de mesos'
    },

    Sidebar : {
        selectDate      : 'Selecciona la data del calendari',
        matchEvents     : 'Esdeveniments del partit',
        filterEvents    : "Filtra esdeveniments pel nom de l'esdeveniment",
        filterResources : 'Filtra esdeveniments pel recurs seleccionat'
    },

    WeekExpander : {
        expandTip   : 'Feu clic per expandir la fila',
        collapseTip : 'Feu clic per reduir la fila'
    },

    keyboardActions : {
        title   : 'Accions del teclat',
        content : "Mostra el panell d'ajuda : [?]\nBotó de selecció del mode de concentració : [Home]\nCanvia la vista : [1] a [9] o primera lletra del text del botó selector\nSegüent interval de temps : [n]\nInterval de temps anterior : [p]\nVes a avui : [t]\nNavega a la data : [g]\nVes a la cel·la del dia actual : [CTRL]+[d]\nNavega entre esdeveniments : [TAB]\nFocalitza l'entrada del filtre d'esdeveniments de la barra lateral : [/]\nCrea un nou esdeveniment (focalitzat a la cel·la del dia) : [ENTER]\nElimina l'esdeveniment focalitzat : [DELETE]/[BACKSPACE]\nEdita l'esdeveniment focalitzat : [ENTER]\nInvoca el menú contextual sobre l'esdeveniment o la cel·la : [SHIFT+F10]/[SPACE]\nFocalitza des de l'esdeveniment fins a la cel·la que l'envolta : [ESCAPE]\nNavegació de cel·la a cel·la : [↑]/[↓]/[←]/[→]\nActiva el menú d'interval (a la vista Agenda) : [CTRL]+[r]\nRetalla, copia, enganxa esdeveniments : [CTRL]+[x]/[c]/[v]\nAmplia/reduïx la vista de dia només : [+]/[-]"
    }
};

export default LocaleHelper.publishLocale(locale);
