import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Et.js';

const locale = {

    localeName : 'Et',
    localeDesc : 'Eesti keel',
    localeCode : 'et',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalender',
        'All day' : 'Kogu päev',
        day       : 'Päev',
        week      : 'Nädal',
        month     : 'Kuu',
        year      : 'Aasta',
        decade    : 'Kümnend'
    },

    EventMenu : {
        duplicateEvent : 'Dubleeri sündmus',
        copy           : 'kopeeri'
    },

    Calendar : {
        toggleSidebar : 'Külgriba nähtavuse lülitamine',
        Today         : 'Täna',
        Tomorrow      : 'Homme',
        next          : range => `Järgmine ${range}`,
        previous      : range => `Eelmine ${range}`,
        plusMore      : value => `+${value} veel`,
        moreEvents    : value => `${value} rohkem sündmusi`,
        allDay        : 'Kogu päev',
        endsOn        : d => `Lõpeb ${d}`,
        weekOfYear    : ([y, w]) => `Nädal ${w}, ${y}`,
        loadFail      : 'Kalendriandmete laadimine nurjus. Palun võtke ühendust oma süsteemiadministraatoriga',
        gotoDate      : 'Mine kuupäevale',
        timeRange     : 'Ajavahemik',
        noResources   : 'Pole ressursse',
        calendar      : 'Kalender',
        toolbar       : 'Kalendri tööriistariba',
        months        : 'Kuud'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Korduva sündmuse korral hoidke all klahvi CTRL'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Ei'} sündmust${(count && count > 1) ? 'ed' : ''}`,
        allDayEventCount : count => `${count || 'Pole'} terve päeva sündmus${count === 1 ? '' : 'ed'}`
    },

    EventTip : {
        'Edit event' : 'Redigeeri sündmust',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Kaasa nädalavahetused',
        weekends        : 'Nädalavahetused',
        switcherMenu    : 'Vaate vahetaja menüü'
    },

    AgendaView : {
        Agenda : 'Tegevuskava'
    },

    MonthView : {
        Month     : 'Kuu',
        monthUnit : 'kuu'
    },

    MultiWeekView : {
        multiWeek : 'Mitu nädalat'
    },

    WeekView : {
        weekUnit : 'nädal'
    },

    YearView : {
        Year     : 'Aasta',
        yearUnit : 'aasta',
        noEvents : 'Sündmusi pole'
    },

    YearPlanner : {
        yearPlanner      : 'Aastaplaneerija',
        expandMonthRow   : 'Laienda kuu rida',
        collapseMonthRow : 'Ahenda kuu rida'
    },

    EventList : {
        List   : 'Loend',
        Start  : 'Algus',
        Finish : 'Lõpp',
        days   : count => `${count > 1 ? `${count} ` : ''}päev${count === 1 ? '' : 'a'}`
    },

    DayView : {
        Day                : 'Päev',
        dayUnit            : 'päev',
        daysUnit           : 'päeva',
        expandAllDayRow    : 'Laienda kogu päeva jaotist',
        collapseAllDayRow  : 'Koonda kogu päeva jaotis',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Vastavaid kuupäevi pole'
    },

    DayAgendaView : {
        dayAgenda : 'Päevakava'
    },

    DayResourceView : {
        dayResourceView : 'Päevased ressursid'
    },

    MonthGrid : {
        monthGrid : 'Kuu ruudustik'
    },

    Sidebar : {
        selectDate      : 'Vali kuupäeva kalendrist',
        matchEvents     : 'Matši sündmused',
        filterEvents    : 'Filtreeri sündmusi sündmuse nime järgi',
        filterResources : 'Filtreeri sündmusi valitud ressursi järgi'
    },

    WeekExpander : {
        expandTip   : 'Klõpsa rea laiendamiseks',
        collapseTip : 'Klõpsa rea koondamiseks'
    },

    keyboardActions : {
        title   : 'Klaviatuuri toimingud',
        content : 'Kuva abipaneel : [?]\nFookusrežiimi valikunupp : [Home]\nVaate muutmine : [1] kuni [9] või valikunupu teksti esimene täht\nJärgmine ajavahemik : [n]\nEelmine ajavahemik : [p]\nMine tänasele päevale : [t]\nLiigu kuupäevale : [g]\nMine praeguse päeva lahtrisse : [CTRL]+[d]\nLiigu sündmuste vahel : [TAB]\nFookus külgriba sündmuste filtri sisendile : [/]\nLoo uus sündmus (fookus päevalahtril) : [ENTER]\nKustuta fookustatud sündmus : [DELETE]/[BACKSPACE]\nMuuda fookustatud sündmust : [ENTER]\nKutsu esile kontekstimenüü sündmuse või lahtri peal : [SHIFT+F10]/[SPACE]\nFookus sündmuselt ümbritsevale lahtrile : [ESCAPE]\nLahtrilt lahtrile navigeerimine : [↑]/[↓]/[←]/[→]\nAktiveeri vahemiku menüü (Agenda vaates) : [CTRL]+[r]\nLõika, kopeeri, kleebi sündmusi : [CTRL]+[x]/[c]/[v]\nSuumi sisse/välja ainult Päevavaates : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
