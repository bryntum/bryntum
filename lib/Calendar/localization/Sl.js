import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Sl.js';

const locale = {

    localeName : 'Sl',
    localeDesc : 'Slovensko',
    localeCode : 'sl',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Koledar',
        'All day' : 'Ves dan',
        day       : 'Dan',
        week      : 'Teden',
        month     : 'Mesec',
        year      : 'Leto',
        decade    : 'Desetletje'
    },

    EventMenu : {
        duplicateEvent : 'Podvojeni dogodek',
        copy           : 'kopiraj'
    },

    Calendar : {
        toggleSidebar : 'Preklopi vidnost stranske vrstice',
        Today         : 'Danes',
        Tomorrow      : 'Zajtra',
        next          : range => `Naslednji ${range}`,
        previous      : range => `Prejšnji ${range}`,
        plusMore      : value => `+${value} več`,
        moreEvents    : value => `${value} več dogodkov`,
        allDay        : 'Ves dan',
        endsOn        : d => `Konec ${d}`,
        weekOfYear    : ([y, w]) => `Teden ${w}, ${y}`,
        loadFail      : 'Nalaganje podatkov iz koledarja ni uspelo. Obrnite se na skrbnika sistema',
        gotoDate      : 'Pojdi na datum',
        timeRange     : 'Časovno obdobje',
        noResources   : 'Ni virov',
        calendar      : 'Koledar',
        toolbar       : 'Koledarska orodna vrstica',
        months        : 'Meseci'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Drži CTRL za ponavljajoči se dogodek'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Brez'} dogod${(count && count > 1) ? 'ka' : 'ek' }`,
        allDayEventCount : count => `${count || 'Ni'} celodnevni dogodek${count === 1 ? '' : 'i'}`
    },

    EventTip : {
        'Edit event' : 'Uredi dogodek',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Vključno z vikendi',
        weekends        : 'Vikendi',
        switcherMenu    : 'Meni za preklapljanje pogleda'
    },

    AgendaView : {
        Agenda : 'Dnevni red'
    },

    MonthView : {
        Month     : 'Mesec',
        monthUnit : 'mesec'
    },

    MultiWeekView : {
        multiWeek : 'Več tednov'
    },

    WeekView : {
        weekUnit : 'Teden'
    },

    YearView : {
        Year     : 'Leto',
        yearUnit : 'Leto',
        noEvents : 'Ni dogodkov'
    },

    YearPlanner : {
        yearPlanner      : 'Letni načrtovalec',
        expandMonthRow   : 'Razširi vrstico meseca',
        collapseMonthRow : 'Strni vrstico meseca'
    },

    EventList : {
        List   : 'Seznam',
        Start  : 'Začetek',
        Finish : 'Konec',
        days   : count => `${count === 1 ? 'dan' : count === 2 ? '2 dneva' : `${count} dni`}`
    },

    DayView : {
        Day                : 'Dan',
        dayUnit            : 'dan',
        daysUnit           : 'dnevi',
        expandAllDayRow    : 'Razširi celodnevni razdelek',
        collapseAllDayRow  : 'Strni celodnevni razdelek',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Ni ujemajočih se datumov'
    },

    DayAgendaView : {
        dayAgenda : 'Dnevni red'
    },

    DayResourceView : {
        dayResourceView : 'Dnevni viri'
    },

    MonthGrid : {
        monthGrid : 'Mesečni mreža'
    },

    Sidebar : {
        selectDate      : 'Izberite datum v koledarju',
        matchEvents     : 'Dogodki tekme',
        filterEvents    : 'Filtriraj dogodke po imenu dogodka',
        filterResources : 'Filtriraj dogodke po izbranem viru'
    },

    WeekExpander : {
        expandTip   : 'Klikni za razširitev vrstice',
        collapseTip : 'Klikni za strnitev vrstice'
    },

    keyboardActions : {
        title   : 'Dejanja tipkovnice',
        content : 'Prikaži ploščo za pomoč : [?]\nGumb za izbiro načina osredotočenja : [Home]\nSpremeni pogled : [1] do [9] ali prva črka besedila gumba za izbiro\nNaslednji časovni razpon : [n]\nPrejšnji časovni razpon : [p]\nPojdi na danes : [t]\nPomakni se na datum : [g]\nPojdi na celico trenutnega dne : [CTRL]+[d]\nPomikanje med dogodki : [TAB]\nOsredotoči se na vnos filtra dogodkov v stranski vrstici : [/]\nUstvari nov dogodek (osredotočeno na celico dneva) : [ENTER]\nIzbriši osredotočen dogodek : [DELETE]/[BACKSPACE]\nUredi osredotočen dogodek : [ENTER]\nIzvedi kontekstni meni na dogodku ali celici : [SHIFT+F10]/[SPACE]\nOsredotoči se od dogodka do nadrejene celice : [ESCAPE]\nNavigacija med celicami : [↑]/[↓]/[←]/[→]\nAktiviraj meni obsega (v pogledu Agenda) : [CTRL]+[r]\nIzreži, kopiraj, prilepi dogodke : [CTRL]+[x]/[c]/[v]\nPovečaj/pomanjšaj samo pogled dneva : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
