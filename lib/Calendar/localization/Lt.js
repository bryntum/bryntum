import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Lt.js';

const locale = {

    localeName : 'LT',
    localeDesc : 'Lietuvių',
    localeCode : 'lt-LT',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalendorius',
        'All day' : 'Visą dieną',
        day       : 'Diena',
        week      : 'Savaitė',
        month     : 'Mėnuo',
        year      : 'Metai',
        decade    : 'Dešimtmetis'
    },

    EventMenu : {
        duplicateEvent : 'Dubliuoti įvykį',
        copy           : 'kopijuoti'
    },

    Calendar : {
        toggleSidebar : 'Perjungti šoninės juostos matomumą',
        Today         : 'Šiandien',
        Tomorrow      : 'Rytoj',
        next          : range => `Kitas ${range}`,
        previous      : range => `Ankstesnis ${range}`,
        plusMore      : value => `+${value} daugiau`,
        moreEvents    : value => `${value} daugiau įvykių`,
        allDay        : 'Visą dieną',
        endsOn        : d => `Baigiasi ${d}`,
        weekOfYear    : ([y, w]) => `Savaitė ${w}, ${y}`,
        loadFail      : 'Nepavyko įkelti duomenų. Prašome susisiekti su savo sistemos administratoriumi',
        gotoDate      : 'Eiti į datą',
        timeRange     : 'Laiko intervalas',
        noResources   : 'Nėra išteklių',
        calendar      : 'Kalendorius',
        toolbar       : 'Kalendoriaus įrankių juosta',
        months        : 'Mėnesiai'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Palaikykite CTRL pasikartojančiam įvykiui'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Ne'} įvykis${count === 1 ? '' : 'sek.'}`,
        allDayEventCount : count => `${count || 'Nėra'} visos dienos įvykio${count === 1 ? '' : 'ų'}`
    },

    EventTip : {
        'Edit event' : 'Redaguoti įvykį',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Įtraukti savaitgalius',
        weekends        : 'Savaitgalis',
        switcherMenu    : 'Peržiūros perjungimo meniu'
    },

    AgendaView : {
        Agenda : 'Darbotvarkė'
    },

    MonthView : {
        Month     : 'Mėnuo',
        monthUnit : 'mėnuo'
    },

    MultiWeekView : {
        multiWeek : 'Kelios savaitės'
    },

    WeekView : {
        weekUnit : 'savaitė'
    },

    YearView : {
        Year     : 'Metai',
        yearUnit : 'metai',
        noEvents : 'NNėra įvykių'
    },

    YearPlanner : {
        yearPlanner      : 'Metų planuotojas',
        expandMonthRow   : 'Išplėsti mėnesio eilutę',
        collapseMonthRow : 'Sutraukti mėnesio eilutę'
    },

    EventList : {
        List   : 'Sąrašas',
        Start  : 'Pradėti',
        Finish : 'Baigti',
        days   : count => `${count > 1 ? `${count} ` : ''}diena${count === 1 ? '' : 's'}`
    },

    DayView : {
        Day                : 'Diena',
        dayUnit            : 'diena',
        daysUnit           : 'dienos',
        expandAllDayRow    : 'Išplėsti visos dienos skirsnį',
        collapseAllDayRow  : 'Suskleisti dienos skirsnį',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Nėra atitinkančių datų'
    },

    DayAgendaView : {
        dayAgenda : 'Dienotvarkė'
    },

    DayResourceView : {
        dayResourceView : 'Dienos ištekliai'
    },

    MonthGrid : {
        monthGrid : 'Mėnesio tinklelis'
    },

    Sidebar : {
        selectDate      : 'Pasirinkite kalendoriaus datą',
        matchEvents     : 'Rungtynių įvykiai',
        filterEvents    : 'Filtruoti įvykius pagal įvykio pavadinimą',
        filterResources : 'Filtruoti įvykius pagal pasirinktą šaltinį'
    },

    WeekExpander : {
        expandTip   : 'Spustelėkite, kad išplėstumėte eilutę',
        collapseTip : 'Spsutelėkite, kad sutrauktumėte eilutę'
    },

    keyboardActions : {
        title   : 'Klaviatūros veiksmai',
        content : 'Rodyti pagalbos skydelį : [?]\nFokusavimo režimo pasirinkimo mygtukas : [Home]\nKeisti vaizdą : [1] iki [9] arba pirmoji pasirinkimo mygtuko teksto raidė\nKitas laiko tarpas : [n]\nAnkstesnis laiko tarpas : [p]\nEiti į šiandieną : [t]\nNaršyti iki datos : [g]\nEiti į dabartinės dienos langelį : [CTRL]+[d]\nNaršyti tarp įvykių : [TAB]\nFokusuoti šoninės juostos įvykių filtravimo įvestį : [/]\nSukurti naują įvykį (fokusuota dienos langelyje) : [ENTER]\nIštrinti fokusuotą įvykį : [DELETE]/[BACKSPACE]\nRedaguoti fokusuotą įvykį : [ENTER]\nIššaukti kontekstinį meniu ant įvykio ar langelio : [SHIFT+F10]/[SPACE]\nFokusuoti nuo įvykio iki apimančio langelio : [ESCAPE]\nLangelio navigacija : [↑]/[↓]/[←]/[→]\nAktyvuoti diapazono meniu (Agenda vaizde) : [CTRL]+[r]\nIškirpti, kopijuoti, įklijuoti įvykius : [CTRL]+[x]/[c]/[v]\nPriartinti/atitolinti tik Dienos vaizdą : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
