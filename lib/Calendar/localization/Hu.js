import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Hu.js';

const locale = {

    localeName : 'Hu',
    localeDesc : 'Magyar',
    localeCode : 'hu',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Naptár',
        'All day' : 'Egész nap',
        day       : 'Nap',
        week      : 'Hét',
        month     : 'Hónap',
        year      : 'Év',
        decade    : 'Évtized'
    },

    EventMenu : {
        duplicateEvent : 'Esemény duplikálása',
        copy           : 'másolás'
    },

    Calendar : {
        toggleSidebar : 'Oldalsáv láthatóságának váltása"',
        Today         : 'Másolás',
        Tomorrow      : 'Holnap',
        next          : range => `Következő ${range}`,
        previous      : range => `Előző ${range}`,
        plusMore      : value => `+${value} további`,
        moreEvents    : value => `${value} további események`,
        allDay        : 'Egész nap',
        endsOn        : d => `Vége ${d}`,
        weekOfYear    : ([y, w]) => `Hét ${w}, ${y}`,
        loadFail      : 'A naptáradatok betöltése sikertelen. Forduljon a rendszergazdához.',
        gotoDate      : 'Ugrás a dátumhoz',
        timeRange     : 'Időtartomány',
        noResources   : 'Nincsenek erőforrások',
        calendar      : 'Naptár',
        toolbar       : 'Naptár eszköztár',
        months        : 'Hónapok'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Ismétlődő eseményhez nyomja a CTRL-t'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Nincs'} esemény`,
        allDayEventCount : count => `${count || 'Nincs'} egész napos esemény${count === 1 ? '' : 'ek'}`
    },

    EventTip : {
        'Edit event' : 'Esemény szerkesztése',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Hétvégék beszámítása',
        weekends        : 'Hétvégék',
        switcherMenu    : 'Nézetváltó menü'
    },

    AgendaView : {
        Agenda : 'Napirend'
    },

    MonthView : {
        Month     : 'Hónap',
        monthUnit : 'hónap'
    },

    MultiWeekView : {
        multiWeek : 'Több hét'
    },

    WeekView : {
        weekUnit : 'hét'
    },

    YearView : {
        Year     : 'Év',
        yearUnit : 'év',
        noEvents : 'Nincsenek események'
    },

    YearPlanner : {
        yearPlanner      : 'Éves tervező',
        expandMonthRow   : 'Hónapsor kibontása',
        collapseMonthRow : 'Hónapsor összecsukása'
    },

    EventList : {
        List   : 'Lista',
        Start  : 'Kezdés',
        Finish : 'Vége',
        days   : count => `${count > 1 ? `${count} ` : ''}nap${count === 1 ? '' : 'ok'}`
    },

    DayView : {
        Day                : 'Nap',
        dayUnit            : 'nap',
        daysUnit           : 'nap',
        expandAllDayRow    : 'Egész nap rész kibontása',
        collapseAllDayRow  : 'Egész nap rész összecsukása',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Nincs egyező dátum'
    },

    DayAgendaView : {
        dayAgenda : 'Napi napirend'
    },

    DayResourceView : {
        dayResourceView : 'Napi erőforrások'
    },

    MonthGrid : {
        monthGrid : 'Hónap rács'
    },

    Sidebar : {
        selectDate      : 'Válasszon naptári dátumot',
        matchEvents     : 'Mérkőzés események',
        filterEvents    : 'Események szűrése eseménynév alapján',
        filterResources : 'Események szűrése kiválasztott erőforrás alapján'
    },

    WeekExpander : {
        expandTip   : 'Kattintson a sor kibontásához',
        collapseTip : 'Kattintson a sor összecsukásához'
    },

    keyboardActions : {
        title   : 'Billentyűzet műveletek',
        content : 'Segédpanel megjelenítése : [?]\nFókusz mód kiválasztó gomb : [Home]\nNézet váltása : [1]–[9] vagy a kiválasztó gomb szövegének első betűje\nKövetkező időszak : [n]\nElőző időszak : [p]\nUgrás a mai napra : [t]\nNavigálás dátumhoz : [g]\nUgrás az aktuális nap cellájára : [CTRL]+[d]\nNavigálás események között : [TAB]\nFókusz az oldalsáv eseményszűrő bemenetére : [/]\nÚj esemény létrehozása (fókuszban a nap cellája) : [ENTER]\nFókuszált esemény törlése : [DELETE]/[BACKSPACE]\nFókuszált esemény szerkesztése : [ENTER]\nKontextusmenü megnyitása eseményen vagy cellán : [SHIFT+F10]/[SPACE]\nFókusz áthelyezése eseményről a környező cellára : [ESCAPE]\nCelláról cellára navigálás : [NYÍLGOMBOK]\nTartomány menü aktiválása (Agenda nézetben) : [CTRL]+[r]\nEsemények kivágása, másolása, beillesztése : [CTRL]+[x]/[c]/[v]\nNagyítás/kicsinyítés csak Napnézetben : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
