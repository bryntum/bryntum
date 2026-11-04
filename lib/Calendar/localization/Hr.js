import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Hr.js';

const locale = {

    localeName : 'Hr',
    localeDesc : 'Hrvatski',
    localeCode : 'hr',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalendar',
        'All day' : 'Cijeli dan',
        day       : 'Dan',
        week      : 'Tjedan',
        month     : 'Mjesec',
        year      : 'Godina',
        decade    : 'Desetljeće'
    },

    EventMenu : {
        duplicateEvent : 'Dupliciraj događaj',
        copy           : 'kopiraj'
    },

    Calendar : {
        toggleSidebar : 'Prebacivanje vidljivosti bočne trake',
        Today         : 'Danas',
        Tomorrow      : 'Sutra',
        next          : range => `Sljedeći ${range}`,
        previous      : range => `Prethodni ${range}`,
        plusMore      : value => `+${value} više`,
        moreEvents    : value => `${value} više događaja`,
        allDay        : 'Cijeli dan',
        endsOn        : d => `Završava ${d}`,
        weekOfYear    : ([y, w]) => `Tjedan ${w}, ${y}`,
        loadFail      : 'Učitavanje podataka kalendara nije uspjelo. Molimo kontaktirajte svog administratora sustava',
        gotoDate      : 'Idi na datum',
        timeRange     : 'Vremenski raspon',
        noResources   : 'Nema resursa',
        calendar      : 'Kalendar',
        toolbar       : 'Alatna traka kalendara',
        months        : 'Mjeseci'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Drži CTRL za ponavljajući događaj'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Nema'} događaj${(count && count > 1) ? 'a' : '' }`,
        allDayEventCount : count => `${count || 'Nema'} cjelodnevni događaj${count === 1 ? '' : 'a'}`
    },

    EventTip : {
        'Edit event' : 'Uredi događaj',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Uključujući vikende',
        weekends        : 'Vikendi',
        switcherMenu    : 'Izbornik za prebacivanje prikaza'
    },

    AgendaView : {
        Agenda : 'Raspored događanja'
    },

    MonthView : {
        Month     : 'Mjesec',
        monthUnit : 'mjesec'
    },

    MultiWeekView : {
        multiWeek : 'Više tjedana'
    },

    WeekView : {
        weekUnit : 'tjedan'
    },

    YearView : {
        Year     : 'Godina',
        yearUnit : 'godina',
        noEvents : 'Nema događanja'
    },

    YearPlanner : {
        yearPlanner      : 'Godišnji planer',
        expandMonthRow   : 'Proširi red mjeseca',
        collapseMonthRow : 'Smanji red mjeseca'
    },

    EventList : {
        List   : 'Popis',
        Start  : 'Početak',
        Finish : 'Završetak',
        days   : count => `${count > 1 ? `${count} ` : ''}dan${count === 1 ? '' : 'a'}`
    },

    DayView : {
        Day                : 'Dan',
        dayUnit            : 'dan',
        daysUnit           : 'dani',
        expandAllDayRow    : 'Proširi odjeljak cijeloga dana',
        collapseAllDayRow  : 'Sažmi odjeljak cijeloga dana',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Nema odgovarajućih datuma'
    },

    DayAgendaView : {
        dayAgenda : 'Dnevni raspored'
    },

    DayResourceView : {
        dayResourceView : 'Dnevni resursi'
    },

    MonthGrid : {
        monthGrid : 'Mreža mjeseca'
    },

    Sidebar : {
        selectDate      : 'Odaberite datum iz kalendara',
        matchEvents     : 'Događaji utakmice',
        filterEvents    : 'Filtriraj događaje prema nazivu događaja',
        filterResources : 'Filtriraj događaje prema odabranom resursu'
    },

    WeekExpander : {
        expandTip   : 'Klikni za proširivanje retka',
        collapseTip : 'Klikni za sažimanje retka'
    },

    keyboardActions : {
        title   : 'Radnje tipkovnice',
        content : 'Prikaži panel pomoći : [?]\nGumb za odabir načina fokusa : [Home]\nPromjena prikaza : [1] do [9] ili prvo slovo teksta gumba selektora\nSljedeći vremenski raspon : [n]\nPrethodni vremenski raspon : [p]\nIdi na danas : [t]\nNavigacija na datum : [g]\nIdi na ćeliju trenutnog dana : [CTRL]+[d]\nNavigacija između događaja : [TAB]\nFokusiraj unos filtra događaja na bočnoj traci : [/]\nStvori novi događaj (fokusirano na ćeliju dana) : [ENTER]\nIzbriši fokusirani događaj : [DELETE]/[BACKSPACE]\nUredi fokusirani događaj : [ENTER]\nPozovi kontekstni izbornik na događaju ili ćeliji : [SHIFT+F10]/[SPACE]\nFokusiraj s događaja na obuhvaćajuću ćeliju : [ESCAPE]\nNavigacija ćelija po ćelija : [↑]/[↓]/[←]/[→]\nAktiviraj izbornik raspona (u prikazu Dnevnog reda) : [CTRL]+[r]\nIzreži, kopiraj, zalijepi događaje : [CTRL]+[x]/[c]/[v]\nPovećaj/smanji samo prikaz Dana : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
