import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Fi.js';

const locale = {

    localeName : 'Fi',
    localeDesc : 'Suomi',
    localeCode : 'fi',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalenteri',
        'All day' : 'Koko päivä',
        day       : 'Päivä',
        week      : 'Viikko',
        month     : 'Kuukausi',
        year      : 'Vuosi',
        decade    : 'Vuosikymmen'
    },

    EventMenu : {
        duplicateEvent : 'Päällekkäinen tapahtuma',
        copy           : 'kopio'
    },

    Calendar : {
        toggleSidebar : 'Vaihda sivupalkin näkyvyys',
        Today         : 'Tänään',
        Tomorrow      : 'Huomenna',
        next          : range => `Seuraava ${range}`,
        previous      : range => `Edellinen ${range}`,
        plusMore      : value => `+${value} lisää`,
        moreEvents    : value => `${value} lisää tapahtumia`,
        allDay        : 'Koko päivä',
        endsOn        : d => `Loppuu ${d}`,
        weekOfYear    : ([y, w]) => `Viikko ${w}, ${y}`,
        loadFail      : 'Kalenteritietojen lataus epäonnistui. Ota yhteyttä järjestelmänvalvojaasi',
        gotoDate      : 'Siirry päivämäärään',
        timeRange     : 'Aikaväli',
        noResources   : 'Ei resursseja',
        calendar      : 'Kalenteri',
        toolbar       : 'Kalenterin työkalupalkki',
        months        : 'Kuukaudet'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Pidä CTRL pohjassa toistuvaa tapahtumaa varten'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Ei'} tapahtuma${(count && count > 1) ? 't' : 'a'}`,
        allDayEventCount : count => `${count || 'Ei'} kokopäiväistä tapahtumaa${count === 1 ? '' : 'a'}`
    },

    EventTip : {
        'Edit event' : 'Muokkaa tapahtumaa',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Sisällytä viikonloput',
        weekends        : 'Viikonloput',
        switcherMenu    : 'Näkymän vaihtovalikko'
    },

    AgendaView : {
        Agenda : 'Asialista'
    },

    MonthView : {
        Month     : 'Kuukausi',
        monthUnit : 'kuukausi'
    },

    MultiWeekView : {
        multiWeek : 'Monta viikkoa'
    },

    WeekView : {
        weekUnit : 'viikko'
    },

    YearView : {
        Year     : 'Vuosi',
        yearUnit : 'vuosi',
        noEvents : 'Ei tapahtumia'
    },

    YearPlanner : {
        yearPlanner      : 'Vuosisuunnittelija',
        expandMonthRow   : 'Laajenna kuukausirivi',
        collapseMonthRow : 'Supista kuukausirivi'
    },

    EventList : {
        List   : 'Lista',
        Start  : 'Aloita',
        Finish : 'Lopeta',
        days   : count => `${count > 1 ? `${count} ` : ''}päivä${count === 1 ? '' : 'ä'}`
    },

    DayView : {
        Day                : 'Päivä',
        dayUnit            : 'päivä',
        daysUnit           : 'päivät',
        expandAllDayRow    : 'Laajenna kokopäivä osio',
        collapseAllDayRow  : 'Kokopäivän osion sulkeminen',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Ei vastaavia päivämääriä'
    },

    DayAgendaView : {
        dayAgenda : 'Päiväohjelma'
    },

    DayResourceView : {
        dayResourceView : 'Päiväresurssit'
    },

    MonthGrid : {
        monthGrid : 'Kuukausiruudukko'
    },

    Sidebar : {
        selectDate      : 'Valitse kalenteripäivämäärä',
        matchEvents     : 'Ottelutapahtumat',
        filterEvents    : 'Suodata tapahtumia tapahtuman nimen mukaan',
        filterResources : 'Suodata tapahtumia valitun resurssin mukaan'
    },

    WeekExpander : {
        expandTip   : 'Napsauta laajentaaksesi riviä',
        collapseTip : 'Napsauta sulkeaksesi rivin'
    },

    keyboardActions : {
        title   : 'Näppäimistötoiminnot',
        content : 'Näytä ohjepaneeli : [?]\nTarkennustilan valintapainike : [Home]\nVaihda näkymää : [1] - [9] tai valintapainikkeen tekstin ensimmäinen kirjain\nSeuraava aikajakso : [n]\nEdellinen aikajakso : [p]\nSiirry tähän päivään : [t]\nSiirry päivämäärään : [g]\nSiirry nykyisen päivän soluun : [CTRL]+[d]\nSiirry tapahtumien välillä : [TAB]\nTarkennus sivupalkin tapahtumasuodattimen syötteeseen : [/]\nLuo uusi tapahtuma (tarkennettuna päivän soluun) : [ENTER]\nPoista tarkennettu tapahtuma : [DELETE]/[BACKSPACE]\nMuokkaa tarkennettua tapahtumaa : [ENTER]\nAvaa kontekstivalikko tapahtumassa tai solussa : [SHIFT+F10]/[SPACE]\nTarkennus tapahtumasta ylöspäin ympäröivään soluun : [ESCAPE]\nSolusta soluun navigointi : [NUOLINÄPPÄIMET]\nAktivoi aluevalikko (Agenda-näkymässä) : [CTRL]+[r]\nLeikkaa, kopioi, liitä tapahtumia : [CTRL]+[x]/[c]/[v]\nLähennä/loitonna vain Päivänäkymässä : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
