import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Da.js';

const locale = {

    localeName : 'Da',
    localeDesc : 'Dansk',
    localeCode : 'da',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalender',
        'All day' : 'Hele dag',
        day       : 'dagen',
        week      : 'Uge',
        month     : 'Måned',
        year      : 'År',
        decade    : 'Årti'
    },

    EventMenu : {
        duplicateEvent : 'Dubleret begivenhed',
        copy           : 'kopi'
    },

    Calendar : {
        toggleSidebar : 'Skift sidebjælkevisning',
        Today         : 'I dag',
        Tomorrow      : 'I morgen',
        next          : range => `Næste ${range}`,
        previous      : range => `Tidligere ${range}`,
        plusMore      : value => `+${value} mere`,
        moreEvents    : value => `${value} flere begivenheder`,
        allDay        : 'Hele dagen',
        endsOn        : d => `Slutter ${d}`,
        weekOfYear    : ([y, w]) => `Uge ${w}, ${y}`,
        loadFail      : 'Indlæsning af kalenderdata mislykkedes. Kontakt venligst din systemadministrator',
        gotoDate      : 'Gå til dato',
        timeRange     : 'Tidsinterval',
        noResources   : 'Ingen ressourcer',
        calendar      : 'Kalender',
        toolbar       : 'Kalender værktøjslinje',
        months        : 'Måneder'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Hold CTRL nede for en tilbagevendende begivenhed'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Ingen'} begivenhed${(count && count > 1) ? 'er' : ''}`,
        allDayEventCount : count => `${count || 'Ingen'} heldagsbegivenhed${count === 1 ? '' : 'er'}`
    },

    EventTip : {
        'Edit event' : 'Rediger begivenhed',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Inkluder weekender',
        weekends        : 'Weekender',
        switcherMenu    : 'Visningsskiftemenu'
    },

    AgendaView : {
        Agenda : 'Dagsorden'
    },

    MonthView : {
        Month     : 'måned',
        monthUnit : 'måned'
    },

    MultiWeekView : {
        multiWeek : 'Flere uger'
    },

    WeekView : {
        weekUnit : 'uge'
    },

    YearView : {
        Year     : 'år',
        yearUnit : 'år',
        noEvents : 'Ingen begivenheder'
    },

    YearPlanner : {
        yearPlanner      : 'Årsplanlægger',
        expandMonthRow   : 'Udvid månedsrække',
        collapseMonthRow : 'Skjul månedsrække'
    },

    EventList : {
        List   : 'Liste',
        Start  : 'Start',
        Finish : 'Afslut',
        days   : count => `${count > 1 ? `${count} ` : ''}dag${count === 1 ? '' : 'e'}`
    },

    DayView : {
        Day                : 'dag',
        dayUnit            : 'dag',
        daysUnit           : 'dage',
        expandAllDayRow    : 'Udvid heldagsafsnittet',
        collapseAllDayRow  : 'Skjul heldagsafsnittet',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Ingen matchende datoer'
    },

    DayAgendaView : {
        dayAgenda : 'Dagsorden'
    },

    DayResourceView : {
        dayResourceView : 'Dagsressourcer'
    },

    MonthGrid : {
        monthGrid : 'Månedsgitter'
    },

    Sidebar : {
        selectDate      : 'Vælg kalenderdato',
        matchEvents     : 'Kampbegivenheder',
        filterEvents    : 'Filtrer begivenheder efter begivenhedsnavn',
        filterResources : 'Filtrer begivenheder efter valgt ressource'
    },

    WeekExpander : {
        expandTip   : 'Klik for at udvide rækken',
        collapseTip : 'Klik for at skjule rækken'
    },

    keyboardActions : {
        title   : 'Tastaturhandlinger',
        content : 'Vis hjælpepanel : [?]\nFokusmodus valgknap : [Home]\nSkift visning : [1] til [9] eller første bogstav i valgknaptekst\nNæste tidsinterval : [n]\nForrige tidsinterval : [p]\nGå til i dag : [t]\nNaviger til dato : [g]\nGå til dagens celle : [CTRL]+[d]\nNaviger mellem begivenheder : [TAB]\nFokusér sidebar begivenhedsfilter input : [/]\nOpret ny begivenhed (fokuseret på dagcelle) : [ENTER]\nSlet fokuseret begivenhed : [DELETE]/[BACKSPACE]\nRediger den fokuserede begivenhed : [ENTER]\nAktivér kontekstmenu på begivenhed eller celle : [SHIFT+F10]/[SPACE]\nFokusér fra begivenhed op til omsluttende celle : [ESCAPE]\nCelle til celle navigation : [↑]/[↓]/[←]/[→]\nAktivér rækkevidde menu (på Agenda visning) : [CTRL]+[r]\nKlip, kopier, indsæt begivenheder : [CTRL]+[x]/[c]/[v]\nZoom ind/ud kun DagVisning : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
