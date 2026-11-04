import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/SvSE.js';

const locale = {

    localeName : 'SvSE',
    localeDesc : 'Svenska',
    localeCode : 'sv-SE',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalender',
        'All day' : 'Heldag',
        day       : 'Dag',
        week      : 'Vecka',
        month     : 'Månad',
        year      : 'År',
        decade    : 'Årtionde'
    },

    EventMenu : {
        duplicateEvent : 'Kopiera uppgift',
        copy           : 'kopia'
    },

    Calendar : {
        toggleSidebar : 'Växla sidofältets synlighet',
        Today         : 'Idag',
        Tomorrow      : 'I morgon',
        next          : range => `Nästa ${range}`,
        previous      : range => `Föregående ${range}`,
        plusMore      : value => `+${value} till`,
        moreEvents    : value => `${value} fler händelser`,
        allDay        : 'Heldag',
        endsOn        : d => `Slutar ${d}`,
        weekOfYear    : ([y, w]) => `Vecka ${w}, ${y}`,
        loadFail      : 'Det gick inte att ladda kalenderdata. Kontakta din systemadministratör',
        gotoDate      : 'Gå till datum',
        timeRange     : 'Tidsintervall',
        noResources   : 'Inga resurser',
        calendar      : 'Kalender',
        toolbar       : 'Kalenderverktygsfält',
        months        : 'Månader'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Håll ner CTRL för att skapa en återkommande uppgift'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Inga'} uppgift${count === 1 ? '' : 'er'}`,
        allDayEventCount : count => `${count || 'Inga'} heldagsaktivitet${count === 1 ? '' : 'er'}`
    },

    EventTip : {
        'Edit event' : 'Redigera uppgift',
        timeFormat   : 'LT'
    },

    ModeSelector : {
        includeWeekends : 'Inkludera helger',
        weekends        : 'Helger',
        switcherMenu    : 'Visa växlingsmeny'
    },

    AgendaView : {
        Agenda : 'Dagordning'
    },

    MonthView : {
        Month     : 'Månad',
        monthUnit : 'månad'
    },

    MultiWeekView : {
        multiWeek : 'Flera veckor'
    },

    WeekView : {
        weekUnit : 'Vecka'
    },

    YearView : {
        Year     : 'År',
        yearUnit : 'år',
        noEvents : 'Inga uppgifter'
    },

    YearPlanner : {
        yearPlanner      : 'Årsplanerare',
        expandMonthRow   : 'Expandera månadsrad',
        collapseMonthRow : 'Komprimera månadsrad'
    },

    EventList : {
        List   : 'Lista',
        Start  : 'Start',
        Finish : 'Avsluta',
        days   : count => `${count > 1 ? `${count} ` : ''}dag${count === 1 ? '' : 'ar'}`
    },

    DayView : {
        Day                : 'Dag',
        dayUnit            : 'dag',
        daysUnit           : 'dagar',
        expandAllDayRow    : 'Expandera heldagssektionen',
        collapseAllDayRow  : 'Fäll ihop heldagssektionen',
        timeFormat         : 'LT',
        timeAxisTimeFormat : 'LT',
        noMatchingDates    : ' Inga matchande datum'
    },

    DayAgendaView : {
        dayAgenda : 'Dagsagenda'
    },

    DayResourceView : {
        dayResourceView : 'Dagliga resurser'
    },

    MonthGrid : {
        monthGrid : 'Månadsrutnät'
    },

    Sidebar : {
        selectDate      : 'Välj kalendardatum',
        matchEvents     : 'Matcha händelser',
        filterEvents    : 'Filtrera händelser efter händelsenamn',
        filterResources : 'Filtrera händelser efter vald resurs'
    },

    WeekExpander : {
        expandTip   : 'Klicka för att expandera raden',
        collapseTip : 'Klicka för att dölja raden'
    },

    keyboardActions : {
        title   : 'Tangentbordsåtgärder',
        content : 'Visa hjälppanel : [?]\nFokuslägevalsknapp : [Home]\nÄndra vy : [1] till [9] eller första bokstaven i väljarknappens text\nNästa tidsintervall : [n]\nFöregående tidsintervall : [p]\nGå till idag : [t]\nNavigera till datum : [g]\nGå till dagens cell : [CTRL]+[d]\nNavigera mellan händelser : [TAB]\nFokusera sidofältets händelsefilterinmatning : [/]\nSkapa ny händelse (fokuserad på dagcell) : [ENTER]\nTa bort fokuserad händelse : [DELETE]/[BACKSPACE]\nRedigera den fokuserade händelsen : [ENTER]\nAnropa kontextmeny på händelse eller cell : [SHIFT+F10]/[SPACE]\nFokusera från händelse upp till omgivande cell : [ESCAPE]\nNavigering mellan celler : [↑]/[↓]/[←]/[→]\nAktivera områdesmeny (i Agendavy) : [CTRL]+[r]\nKlipp, kopiera, klistra in händelser : [CTRL]+[x]/[c]/[v]\nZooma in/ut endast Dagvy : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
