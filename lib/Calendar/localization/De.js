import StringHelper from '../../Core/helper/StringHelper.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/De.js';

const
    next = {
        Tag       : 'Nächster',
        Woche     : 'Nächste',
        Monat     : 'Nächster',
        Jahr      : 'Nächstes',
        Jahrzehnt : 'Nächstes'
    },
    previous = {
        Tag       : 'Vorheriger',
        Woche     : 'Vorherige',
        Monat     : 'Vorheriger',
        Jahr      : 'Vorheriges',
        Jahrzehnt : 'Vorheriges'
    };

const locale = {

    localeName : 'De',
    localeDesc : 'Deutsch',
    localeCode : 'de-DE',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalendar',
        'All day' : 'Ganztägig',
        day       : 'Tag',
        week      : 'Woche',
        month     : 'Monat',
        year      : 'Jahr',
        decade    : 'Jahrzehnt'
    },

    EventMenu : {
        duplicateEvent : 'Ereignis duplizieren',
        copy           : 'kopieren'
    },

    Calendar : {
        toggleSidebar : 'Sichtbarkeit der Seitenleiste umschalten',
        Today         : 'Heute',
        Tomorrow      : 'Morgen',
        next          : range => `${next[range]} ${StringHelper.capitalize(range)}`,
        previous      : range => `${previous[range]} ${StringHelper.capitalize(range)}`,
        plusMore      : value => `+${value} mehr`,
        moreEvents    : value => `${value} weitere Ereignisse`,
        allDay        : 'Ganztägig',
        endsOn        : d => `Endet ${d}`,
        weekOfYear    : ([y, w]) => `Woche ${w}, ${y}`,
        loadFail      : 'Kalenderdaten konnten nicht geladen werden. Bitte wenden Sie sich an Ihren Systemadministrator',
        gotoDate      : 'Gehe zu Datum',
        timeRange     : 'Zeitraum',
        noResources   : 'Keine Ressourcen',
        calendar      : 'Kalender',
        toolbar       : 'Kalender-Symbolleiste',
        months        : 'Monate'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'CTRL für ein wiederkehrendes Ereignis halten'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Kein'} Ereignis${(count && count > 1) ? 'sen' : ''}`,
        allDayEventCount : count => `${count || 'Keine'} Ganztagesveranstaltung${count === 1 ? '' : 'en'}`
    },

    EventTip : {
        'Edit event' : 'Ereignis bearbeiten',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Wochenenden einbeziehen',
        weekends        : 'Wochenenden',
        switcherMenu    : 'Ansichtsumschalter-Menü'
    },

    AgendaView : {
        Agenda : 'Agenda'
    },

    MonthView : {
        Month     : 'Monat',
        monthUnit : 'Monat'
    },

    MultiWeekView : {
        multiWeek : 'Mehrere Wochen'
    },

    WeekView : {
        weekUnit : 'Woche'
    },

    YearView : {
        Year     : 'Jahr',
        yearUnit : 'Jahr',
        noEvents : 'Keine Veranstaltungen'
    },

    YearPlanner : {
        yearPlanner      : 'Jahresplaner',
        expandMonthRow   : 'Monatsreihe erweitern',
        collapseMonthRow : 'Monatsreihe reduzieren'
    },

    EventList : {
        List   : 'Liste',
        Start  : 'Start',
        Finish : 'Ende',
        days   : count => `${count > 1 ? `${count} ` : ''}Tag${count === 1 ? '' : 'e'}`
    },

    DayView : {
        Day                : 'Tag',
        dayUnit            : 'Tag',
        daysUnit           : 'Tage',
        expandAllDayRow    : 'Ganztagsbereich erweitern',
        collapseAllDayRow  : 'Ganztagsbereich einklappen',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Keine passenden Daten'
    },

    DayAgendaView : {
        dayAgenda : 'Tagesordnung'
    },

    DayResourceView : {
        dayResourceView : 'Tagesressourcen'
    },

    MonthGrid : {
        monthGrid : 'Monatsgitter'
    },

    Sidebar : {
        selectDate      : 'Kalenderdatum auswählen',
        matchEvents     : 'Spielereignisse',
        filterEvents    : 'Ereignisse nach Ereignisnamen filtern',
        filterResources : 'Ereignisse nach ausgewählter Ressource filtern'
    },

    WeekExpander : {
        expandTip   : 'Zum Erweitern der Zeile klicken',
        collapseTip : 'Zum Einklappen der Zeile klicken'
    },

    keyboardActions : {
        title   : 'Tastaturaktionen',
        content : 'Hilfe-Panel anzeigen : [?]\nSchaltfläche für Fokusmodus auswählen : [Home]\nAnsicht ändern : [1] bis [9] oder erster Buchstabe des Textes der Auswahl-Schaltfläche\nNächster Zeitabschnitt : [n]\nVorheriger Zeitabschnitt : [p]\nZum heutigen Tag gehen : [t]\nZu Datum navigieren : [g]\nZur Zelle des aktuellen Tages gehen : [CTRL]+[d]\nZwischen Ereignissen navigieren : [TAB]\nFiltereingabe für Ereignisse in der Seitenleiste fokussieren : [/]\nNeues Ereignis erstellen (fokussiert auf Tageszelle) : [ENTER]\nFokussiertes Ereignis löschen : [DELETE]/[BACKSPACE]\nFokussiertes Ereignis bearbeiten : [ENTER]\nKontextmenü für Ereignis oder Zelle aufrufen : [SHIFT+F10]/[SPACE]\nVon Ereignis zur umschließenden Zelle fokussieren : [ESCAPE]\nNavigation von Zelle zu Zelle : [↑]/[↓]/[←]/[→]\nBereichsmenü aktivieren (in der Agenda-Ansicht) : [CTRL]+[r]\nEreignisse ausschneiden, kopieren, einfügen : [CTRL]+[x]/[c]/[v]\nNur in der Tagesansicht ein-/auszoomen : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
