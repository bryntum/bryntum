import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/No.js';

const locale = {

    localeName : 'No',
    localeDesc : 'Norsk',
    localeCode : 'no',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalender',
        'All day' : 'Hele dagen',
        day       : 'Dag',
        week      : 'Uke',
        month     : 'Måned',
        year      : 'År',
        decade    : 'Tiår'
    },

    EventMenu : {
        duplicateEvent : 'Duplikat hendelse',
        copy           : 'kopi'
    },

    Calendar : {
        toggleSidebar : 'Bytt sidefeltets synlighet',
        Today         : 'I dag',
        Tomorrow      : 'I morgen',
        next          : range => `Neste ${range}`,
        previous      : range => `Forrige ${range}`,
        plusMore      : value => `+${value} mer`,
        moreEvents    : value => `${value} flere hendelser`,
        allDay        : 'Hele dagen',
        endsOn        : d => `Ender ${d}`,
        weekOfYear    : ([y, w]) => `Uke ${w}, ${y}`,
        loadFail      : 'Innlasting av kalenderdata mislyktes. Ta kontakt med systemadministratoren din',
        gotoDate      : 'Gå til dato',
        timeRange     : 'Tidsområde',
        noResources   : 'Ingen ressurser',
        calendar      : 'Kalender',
        toolbar       : 'Kalender verktøylinje',
        months        : 'Måneder'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Hold CTRL for gjentakende hendelse'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Ingen'} hendelse${(count && count > 1) ? '' : 'r' }`,
        allDayEventCount : count => `${count || 'Ingen'} heldagsarrangement${count === 1 ? '' : 'er'}`
    },

    EventTip : {
        'Edit event' : 'Redigere hendelse',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Inkluder helger',
        weekends        : 'Helger',
        switcherMenu    : 'Visningsvelger-meny'
    },

    AgendaView : {
        Agenda : 'Dagsorden'
    },

    MonthView : {
        Month     : 'Måned',
        monthUnit : 'måned'
    },

    MultiWeekView : {
        multiWeek : 'Flere uker'
    },

    WeekView : {
        weekUnit : 'uke'
    },

    YearView : {
        Year     : 'År',
        yearUnit : 'år',
        noEvents : 'Ingen hendelser'
    },

    YearPlanner : {
        yearPlanner      : 'Årsplanlegger',
        expandMonthRow   : 'Utvid månedsrad',
        collapseMonthRow : 'Skjul månedsrad'
    },

    EventList : {
        List   : 'Liste',
        Start  : 'Start',
        Finish : 'Slutt',
        days   : count => `${count > 1 ? `${count} ` : ''}dag${count === 1 ? '' : 'er'}`
    },

    DayView : {
        Day                : 'Dag',
        dayUnit            : 'dag',
        daysUnit           : 'dager',
        expandAllDayRow    : 'Utvid hele dagens del',
        collapseAllDayRow  : 'Skjul hele dagens del',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : ' Ingen samsvarende datoer'
    },

    DayAgendaView : {
        dayAgenda : 'Dagsorden'
    },

    DayResourceView : {
        dayResourceView : 'Daglige ressurser'
    },

    MonthGrid : {
        monthGrid : 'Månedsrutenett'
    },

    Sidebar : {
        selectDate      : 'Velg kalenderdato',
        matchEvents     : 'Kamphendelser',
        filterEvents    : 'Filtrer hendelser etter hendelsesnavn',
        filterResources : 'Filtrer hendelser etter valgt ressurs'
    },

    WeekExpander : {
        expandTip   : 'Klikk for å utvide rad',
        collapseTip : 'Klikk for å skjule rad'
    },

    keyboardActions : {
        title   : 'Tastaturhandlinger',
        content : 'Vis hjelpepanelet : [?]\nFokusmodusvalgknapp : [Home]\nEndre visning : [1] til [9] eller første bokstav i tekst på valgknapp\nNeste tidsperiode : [n]\nForrige tidsperiode : [p]\nGå til i dag : [t]\nNaviger til dato : [g]\nGå til dagens celle : [CTRL]+[d]\nNaviger mellom hendelser : [TAB]\nFokusere sidefeltets hendelsesfilterinput : [/]\nOpprett ny hendelse (fokusert på dagcelle) : [ENTER]\nSlett fokusert hendelse : [DELETE]/[BACKSPACE]\nRediger den fokuserte hendelsen : [ENTER]\nAktiver kontekstmeny på hendelse eller celle : [SHIFT+F10]/[SPACE]\nFokus fra hendelse opp til omsluttende celle : [ESCAPE]\nNavigasjon mellom celler : [↑]/[↓]/[←]/[→]\nAktiver områdemeny (i Agenda-visning) : [CTRL]+[r]\nKlipp, kopier, lim inn hendelser : [CTRL]+[x]/[c]/[v]\nZoom inn/ut kun Dagvisning : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
