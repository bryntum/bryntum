import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Sr.js';

const locale = {

    localeName : 'Sr',
    localeDesc : 'Srpski',
    localeCode : 'sr',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalendar',
        'All day' : 'Ceo dan',
        day       : 'Dan',
        week      : 'Nedelja',
        month     : 'Mesec',
        year      : 'Godina',
        decade    : 'Decenija'
    },

    EventMenu : {
        duplicateEvent : 'Dupliraj događaj',
        copy           : 'kopiraj'
    },

    Calendar : {
        toggleSidebar : 'Prebaci vidljivost bočne trake',
        Today         : 'Danas',
        Tomorrow      : 'Сутра',
        next          : range => `Sledeći ${range}`,
        previous      : range => `Prethodni ${range}`,
        plusMore      : value => `+${value} više`,
        moreEvents    : value => `${value} још догађаја`,
        allDay        : 'Ceo dan',
        endsOn        : d => `Završava ${d}`,
        weekOfYear    : ([y, w]) => `Nedelja ${w}, ${y}`,
        loadFail      : 'Učitavanje podataka kalendara nije uspelo. Obratite se svom sistemskom administratoru',
        gotoDate      : 'Idi na datum',
        timeRange     : 'Vremenski opseg',
        noResources   : 'Nema resursa',
        calendar      : 'Kalendar',
        toolbar       : 'Kalendarska alatna traka',
        months        : 'Meseci'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Držite CTRL za događaje koji se ponavljaju'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Nema'} događaj${(count && count > 1) ? 'e' : '' }`,
        allDayEventCount : count => `${count || 'Nema'} celodnevni događaj${count === 1 ? '' : 'a'}`
    },

    EventTip : {
        'Edit event' : 'Uredi događaj',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Uključi vikende',
        weekends        : 'Vikendi',
        switcherMenu    : 'Meni za prebacivanje prikaza'
    },

    AgendaView : {
        Agenda : 'Rokovnik'
    },

    MonthView : {
        Month     : 'Mesec',
        monthUnit : 'mesec'
    },

    MultiWeekView : {
        multiWeek : 'Više nedelja'
    },

    WeekView : {
        weekUnit : 'nedelja'
    },

    YearView : {
        Year     : 'Godina',
        yearUnit : 'godina',
        noEvents : 'Nema događaja'
    },

    YearPlanner : {
        yearPlanner      : 'Godišnji planer',
        expandMonthRow   : 'Proširi red meseca',
        collapseMonthRow : 'Skupi red meseca'
    },

    EventList : {
        List   : 'Lista',
        Start  : 'Početak',
        Finish : 'Kraj',
        days   : count => `${count > 1 ? `${count} ` : ''}dan${count === 1 ? '' : 'a'}`
    },

    DayView : {
        Day                : 'Dan',
        dayUnit            : 'dan',
        daysUnit           : 'dana',
        expandAllDayRow    : 'Proširi red ceo dan',
        collapseAllDayRow  : 'Skupi red ceo dan',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Nema odgovarajućih datuma'
    },

    DayAgendaView : {
        dayAgenda : ' Дневни ред'
    },

    DayResourceView : {
        dayResourceView : 'Dnevni resursi'
    },

    MonthGrid : {
        monthGrid : 'Mesečna mreža'
    },

    Sidebar : {
        selectDate      : 'Izaberite datum iz kalendara',
        matchEvents     : 'Utakmice događaja',
        filterEvents    : 'Filtrirajte događaje prema nazivu događaja',
        filterResources : 'Filtrirajte događaje prema izabranom resursu'
    },

    WeekExpander : {
        expandTip   : 'Klkni da raširiš red',
        collapseTip : 'Klikni da skupiš red'
    },

    keyboardActions : {
        title   : 'Akcije tastature',
        content : 'Prikaži panel za pomoć : [?]\nDugme za izbor režima fokusa : [Home]\nPromeni prikaz : [1] do [9] ili prvo slovo teksta dugmeta selektora\nSledeći vremenski raspon : [n]\nPrethodni vremenski raspon : [p]\nIdi na danas : [t]\nNavigacija do datuma : [g]\nIdi na ćeliju trenutnog dana : [CTRL]+[d]\nNavigacija između događaja : [TAB]\nFokusiraj unos filtera događaja u bočnoj traci : [/]\nKreiraj novi događaj (fokusirano na ćeliju dana) : [ENTER]\nObriši fokusirani događaj : [DELETE]/[BACKSPACE]\nIzmeni fokusirani događaj : [ENTER]\nPozovi kontekstni meni na događaju ili ćeliji : [SHIFT+F10]/[SPACE]\nFokusiraj sa događaja na obuhvatnu ćeliju : [ESCAPE]\nNavigacija između ćelija : [↑]/[↓]/[←]/[→]\nAktiviraj meni opsega (u prikazu Agende) : [CTRL]+[r]\nIseci, kopiraj, nalepi događaje : [CTRL]+[x]/[c]/[v]\nUvećaj/smanji samo prikaz Dana : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
