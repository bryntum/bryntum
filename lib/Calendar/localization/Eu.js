import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Eu.js';

const locale = {

    localeName : 'Eu',
    localeDesc : 'Euskara',
    localeCode : 'eu-ES',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Egutegia',
        'All day' : 'Egun osoa',
        day       : 'Eguna',
        week      : 'Astea',
        month     : 'Hilabetea',
        year      : 'Urtea',
        decade    : 'Hamarkada'
    },

    EventMenu : {
        duplicateEvent : 'Gertaera bikoiztua',
        copy           : 'kopiatu'
    },

    Calendar : {
        toggleSidebar : 'Alboko barraren ikusgarritasuna aldatu',
        Today         : 'Gaur',
        Tomorrow      : 'Bihar',
        next          : range => `Hurrengo ${range}`,
        previous      : range => `Aurreko ${range}`,
        plusMore      : value => `+${value} gehiago`,
        moreEvents    : value => `${value} gertaera gehiago`,
        allDay        : 'Egun osoa',
        endsOn        : d => `Bukatuta ${d}`,
        weekOfYear    : ([y, w]) => `Astea ${w}, ${y}`,
        loadFail      : 'Egutegiko datuak kargatzeak huts egin du. Jarri harremanetan sistema-administratzailearekin',
        gotoDate      : 'Joan datara',
        timeRange     : 'Denbora tartea',
        noResources   : 'Ez dago baliabiderik',
        calendar      : 'Egutegia',
        toolbar       : 'Egutegiaren tresna-barra',
        months        : 'Hilabeteak'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Sakatu KTRL gertaera errepikari baterako'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Ez'} event${count === 1 ? '' : 's'}`,
        allDayEventCount : count => `${count || 'Ez'} egun osoko ekitaldi${count === 1 ? '' : 'ak'}`
    },

    EventTip : {
        'Edit event' : 'Editatu gertaera',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Asteburuak barne',
        weekends        : 'Asteburuak',
        switcherMenu    : 'Ikuspegi aldatzailearen menua'
    },

    AgendaView : {
        Agenda : 'Agenda'
    },

    MonthView : {
        Month     : 'Hilabetea',
        monthUnit : 'hilabete'
    },

    MultiWeekView : {
        multiWeek : 'Aste anitz'
    },

    WeekView : {
        weekUnit : 'aste'
    },

    YearView : {
        Year     : 'Urtea',
        yearUnit : 'urte',
        noEvents : 'Gertaerarik gabe'
    },

    YearPlanner : {
        yearPlanner      : 'Urteko Plangintza',
        expandMonthRow   : 'Zabaldu hilabeteko errenkada',
        collapseMonthRow : 'Tolestu hilabeteko errenkada'
    },

    EventList : {
        List   : 'Zerrenda',
        Start  : 'Hasiera',
        Finish : 'Amaiera',
        days   : count => `${count > 1 ? `${count} ` : ''}day${count === 1 ? '' : 's'}`
    },

    DayView : {
        Day                : 'Eguna',
        dayUnit            : 'egun',
        daysUnit           : 'egun',
        expandAllDayRow    : 'Zabaldu egun osoko sekzioa',
        collapseAllDayRow  : 'Itxi egun osoko sekzioa',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Ez dago bat datorren datarik'
    },

    DayAgendaView : {
        dayAgenda : 'Eguneko agenda'
    },

    DayResourceView : {
        dayResourceView : 'Eguneko baliabideak'
    },

    MonthGrid : {
        monthGrid : 'Hilabeteko sareta'
    },

    Sidebar : {
        selectDate      : 'Hautatu egutegi-data',
        matchEvents     : 'Partidaren gertaerak',
        filterEvents    : 'Iragazi gertaerak gertaera izenaren arabera',
        filterResources : 'Iragazi gertaerak aukeratutako baliabidearen arabera'
    },

    WeekExpander : {
        expandTip   : 'Egin klik errenkada zabaltzeko',
        collapseTip : 'Egin klik errenkada ixteko'
    },

    keyboardActions : {
        title   : 'Teklatuko ekintzak',
        content : 'Laguntza panela erakutsi : [?]\nFokatu modua hautatzeko botoia : [Home]\nIkuspegia aldatu : [1]etik [9]ra edo hautatzaile botoiaren testuaren lehen letra\nHurrengo denbora tartea : [n]\nAurreko denbora tartea : [p]\nJoan gaur egunera : [t]\nNabigatu datara : [g]\nJoan egungo eguneko gelaxkara : [CTRL]+[d]\nNabigatu gertaeren artean : [TAB]\nFokatu alboko barrako gertaera iragazkiaren sarrera : [/]\nSortu gertaera berria (eguneko gelaxkan fokuratuta) : [ENTER]\nEzabatu fokatutako gertaera : [DELETE]/[BACKSPACE]\nEditatu fokatutako gertaera : [ENTER]\nDeitu testuinguru menuari gertaeran edo gelaxkan : [SHIFT+F10]/[SPACE]\nFokatu gertaeratik goiko gelaxkara : [ESCAPE]\nGelaxka arteko nabigazioa : [↑]/[↓]/[←]/[→]\nAktibatu tarte menu (Agenda ikuspegian) : [CTRL]+[r]\nMoztu, kopiatu, itsatsi gertaerak : [CTRL]+[x]/[c]/[v]\nZooma handitu/murriztu DayView-n bakarrik : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
