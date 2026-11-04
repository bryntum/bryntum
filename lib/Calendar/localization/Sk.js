import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Sk.js';

const locale = {

    localeName : 'Sk',
    localeDesc : 'Slovenský',
    localeCode : 'sk',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalendár',
        'All day' : 'Celý deň',
        day       : 'Deň',
        week      : 'Týždeň',
        month     : 'Mesiac',
        year      : 'Rok',
        decade    : 'Dekáda'
    },

    EventMenu : {
        duplicateEvent : 'Duplicitná udalosť',
        copy           : 'kopírovať'
    },

    Calendar : {
        toggleSidebar : 'Prepnúť viditeľnosť bočnej lišty',
        Today         : 'Dnes',
        Tomorrow      : 'Jutri',
        next          : range => `Ďalší ${range}`,
        previous      : range => `Predchádzajúci ${range}`,
        plusMore      : value => `+${value} viac`,
        moreEvents    : value => `${value} ďalšie udalosti`,
        allDay        : 'Celý deň',
        endsOn        : d => `Končí ${d}`,
        weekOfYear    : ([y, w]) => `Týždeň ${w}, ${y}`,
        loadFail      : 'Načítanie údajov z kalendára zlyhalo. Kontaktujte správcu systému',
        gotoDate      : 'Prejsť na dátum',
        timeRange     : 'Časový rozsah',
        noResources   : 'Žiadne zdroje',
        calendar      : 'Kalendár',
        toolbar       : 'Panel kalendára',
        months        : 'Mesiace'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Podržte CTRL pre opakujúcu sa udalosť'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Žiadne'} udalos${(count && count > 1) ? 'ti' : 'ť' }`,
        allDayEventCount : count => `${count || 'Žiadne'} celodenné podujatie${count === 1 ? '' : 'a'}`
    },

    EventTip : {
        'Edit event' : 'Upraviť udalosť',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Zahrnúť víkendy',
        weekends        : 'Víkendy',
        switcherMenu    : 'Menu prepínača zobrazenia'
    },

    AgendaView : {
        Agenda : 'Agenda'
    },

    MonthView : {
        Month     : 'Mesiac',
        monthUnit : 'mesiac'
    },

    MultiWeekView : {
        multiWeek : 'Viac týždňov'
    },

    WeekView : {
        weekUnit : 'týždeň'
    },

    YearView : {
        Year     : 'Rok',
        yearUnit : 'rok',
        noEvents : 'Žiadne udalosti'
    },

    YearPlanner : {
        yearPlanner      : 'Ročný plánovač',
        expandMonthRow   : 'Rozbaliť riadok mesiaca',
        collapseMonthRow : 'Zbaliť riadok mesiaca'
    },

    EventList : {
        List   : 'Zoznam',
        Start  : 'Začať',
        Finish : 'Skončiť',
        days   : count => `${count === 1 ? 'den' : count === 0 ? '0 dní' : `${count} dni`}`
    },

    DayView : {
        Day                : 'Deň',
        dayUnit            : 'deň',
        daysUnit           : 'dni',
        expandAllDayRow    : 'Rozšíriť časť celého dňa',
        collapseAllDayRow  : 'Zložiť časť celého dňa',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Žiadne zodpovedajúce dátumy'
    },

    DayAgendaView : {
        dayAgenda : 'Denný program'
    },

    DayResourceView : {
        dayResourceView : 'Denné zdroje'
    },

    MonthGrid : {
        monthGrid : 'Mriežka mesiaca'
    },

    Sidebar : {
        selectDate      : 'Vyberte dátum v kalendári',
        matchEvents     : 'Udalosti zápasu',
        filterEvents    : 'Filtrovať udalosti podľa názvu udalosti',
        filterResources : 'Filtrovať udalosti podľa vybraného zdroja'
    },

    WeekExpander : {
        expandTip   : 'Kliknúť pre rozšírenie riadka',
        collapseTip : 'Kliknúť pre zloženie riadka'
    },

    keyboardActions : {
        title   : 'Akcie klávesnice',
        content : 'Zobraziť panel pomoci : [?]\nTlačidlo výberu režimu zamerania : [Home]\nZmeniť zobrazenie : [1] až [9] alebo prvé písmeno textu tlačidla výberu\nĎalší časový rozsah : [n]\nPredchádzajúci časový rozsah : [p]\nPrejsť na dnešok : [t]\nNavigovať na dátum : [g]\nPrejsť na bunku aktuálneho dňa : [CTRL]+[d]\nNavigovať medzi udalosťami : [TAB]\nZamerať vstupný filter udalostí na bočnom paneli : [/]\nVytvoriť novú udalosť (zamerané na bunku dňa) : [ENTER]\nOdstrániť zameranú udalosť : [DELETE]/[BACKSPACE]\nUpraviť zameranú udalosť : [ENTER]\nVyvolať kontextové menu na udalosti alebo bunke : [SHIFT+F10]/[SPACE]\nZamerať sa z udalosti na obklopujúcu bunku : [ESCAPE]\nNavigácia medzi bunkami : [↑]/[↓]/[←]/[→]\nAktivovať menu rozsahu (v zobrazení Agenda) : [CTRL]+[r]\nVystrihnúť, kopírovať, vložiť udalosti : [CTRL]+[x]/[c]/[v]\nPriblížiť/oddialiť iba zobrazenie dňa : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
