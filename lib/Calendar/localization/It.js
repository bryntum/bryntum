import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/It.js';

const locale = {

    localeName : 'It',
    localeDesc : 'Italiano',
    localeCode : 'it',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Calendario',
        'All day' : 'Tutto il giorno',
        day       : 'Giorno',
        week      : 'Settimana',
        month     : 'Mese',
        year      : 'Anno',
        decade    : 'Decennio'
    },

    EventMenu : {
        duplicateEvent : 'Duplica evento',
        copy           : 'copia'
    },

    Calendar : {
        toggleSidebar : 'Attiva/disattiva la visibilità della barra laterale',
        Today         : 'Oggi',
        Tomorrow      : 'Domani',
        next          : range => `Prossimo ${range}`,
        previous      : range => `Scorso ${range}`,
        plusMore      : value => `altri +${value}`,
        moreEvents    : value => `${value} eventi in più`,
        allDay        : 'Tutto il giorno',
        endsOn        : d => `Termina ${d}`,
        weekOfYear    : ([y, w]) => `Settimana ${w}, ${y}`,
        loadFail      : 'Caricamento dei dati del calendario non riuscito. Contatta il tuo amministratore di sistema',
        gotoDate      : 'Vai alla data',
        timeRange     : 'Intervallo di tempo',
        noResources   : 'Nessuna risorsa',
        calendar      : 'Calendario',
        toolbar       : 'Barra degli strumenti del calendario',
        months        : 'Mesi'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Tieni premuto CTRL per un evento ricorrente'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Nessun'} event${(count && count > 1) ? 'i' : 'o'}`,
        allDayEventCount : count => `${count || 'Nessun'} evento per l'intera giornata${count === 1 ? '' : 'i'}`
    },

    EventTip : {
        'Edit event' : 'Modifica evento',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Includi fine settimana',
        weekends        : 'Fine settimana',
        switcherMenu    : 'Menu di selezione visualizzazione'
    },

    AgendaView : {
        Agenda : 'Agenda'
    },

    MonthView : {
        Month     : 'Mese',
        monthUnit : 'mese'
    },

    MultiWeekView : {
        multiWeek : 'Più settimane'
    },

    WeekView : {
        weekUnit : 'settimana'
    },

    YearView : {
        Year     : 'Anno',
        yearUnit : 'anno',
        noEvents : 'Nessun evento'
    },

    YearPlanner : {
        yearPlanner      : 'Pianificatore annuale',
        expandMonthRow   : 'Espandi riga del mese',
        collapseMonthRow : 'Comprimi riga del mese'
    },

    EventList : {
        List   : 'Elenco',
        Start  : 'Inizio',
        Finish : 'Fine',
        days   : count => `${count > 1 ? `${count} ` : ''}giorn${count === 1 ? 'o' : 'i'}`
    },

    DayView : {
        Day                : 'Giorno',
        dayUnit            : 'giorno',
        daysUnit           : 'giorni',
        expandAllDayRow    : 'Espandi la sezione di tutti i giorni',
        collapseAllDayRow  : 'Comprimi la sezione di tutti i giorni',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Nessuna data corrispondente'
    },

    DayAgendaView : {
        dayAgenda : 'Agenda del giorno'
    },

    DayResourceView : {
        dayResourceView : 'Risorse giornaliere'
    },

    MonthGrid : {
        monthGrid : 'Griglia mensile'
    },

    Sidebar : {
        selectDate      : 'Seleziona la data del calendario',
        matchEvents     : 'Eventi della partita',
        filterEvents    : 'Filtra eventi per nome evento',
        filterResources : 'Filtra eventi per risorsa selezionata'
    },

    WeekExpander : {
        expandTip   : 'Fai clic per espandere la riga',
        collapseTip : 'Fai clic per comprimere la riga'
    },

    keyboardActions : {
        title   : 'Azioni della tastiera',
        content : "Mostra pannello di aiuto : [?]\nPulsante di selezione modalità di messa a fuoco : [Home]\nCambia vista : [1] a [9] o prima lettera del testo del pulsante selettore\nProssimo intervallo di tempo : [n]\nIntervallo di tempo precedente : [p]\nVai a oggi : [t]\nNaviga alla data : [g]\nVai alla cella del giorno corrente : [CTRL]+[d]\nNaviga tra gli eventi : [TAB]\nFocalizza l'input del filtro eventi della barra laterale : [/]\nCrea un nuovo evento (focalizzato sulla cella del giorno) : [ENTER]\nElimina l'evento focalizzato : [DELETE]/[BACKSPACE]\nModifica l'evento focalizzato : [ENTER]\nRichiama il menu contestuale su evento o cella : [SHIFT+F10]/[SPACE]\nFocalizza dall'evento fino alla cella circostante : [ESCAPE]\nNavigazione da cella a cella : [↑]/[↓]/[←]/[→]\nAttiva il menu intervallo (nella vista Agenda) : [CTRL]+[r]\nTaglia, copia, incolla eventi : [CTRL]+[x]/[c]/[v]\nZoom avanti/indietro solo nella vista Giorno : [+]/[-]"
    }
};

export default LocaleHelper.publishLocale(locale);
