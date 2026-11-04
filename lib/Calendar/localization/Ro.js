import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Ro.js';

const locale = {

    localeName : 'Ro',
    localeDesc : 'Română',
    localeCode : 'ro',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Calendar',
        'All day' : 'Toată ziua',
        day       : 'Zi',
        week      : 'Săptămână',
        month     : 'Lună',
        year      : 'An',
        decade    : 'Decadă'
    },

    EventMenu : {
        duplicateEvent : 'Duplicare eveniment',
        copy           : 'copiere'
    },

    Calendar : {
        toggleSidebar : 'Comută vizibilitatea barei laterale',
        Today         : 'Zi',
        Tomorrow      : 'Mâine',
        next          : range => `Următor ${range}`,
        previous      : range => `Anterior ${range}`,
        plusMore      : value => `+${value} mai mult`,
        moreEvents    : value => `${value} mai multe evenimente`,
        allDay        : 'Toată ziua',
        endsOn        : d => `Se încheie ${d}`,
        weekOfYear    : ([y, w]) => `Săptămâna ${w}, ${y}`,
        loadFail      : 'Încărcarea datelor din calendar a eșuat. Vă rugăm să contactați administratorul de sistem',
        gotoDate      : 'Mergi la dată',
        timeRange     : 'Interval de timp',
        noResources   : 'Nu există resurse',
        calendar      : 'Calendar',
        toolbar       : 'Bara de instrumente a calendarului',
        months        : 'Luni'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Țineți apăsat CTRL pentru un eveniment recurent'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Nu'} eveniment${(count && count > 1) ? 'e' : '' }`,
        allDayEventCount : count => `${count || 'Niciun'} eveniment de toată ziua${count === 1 ? '' : 'e'}`
    },

    EventTip : {
        'Edit event' : 'Editare eveniment',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Includeți weekend-uri',
        weekends        : 'Weekend-uri',
        switcherMenu    : 'Meniu de comutare vizualizare'
    },

    AgendaView : {
        Agenda : 'Ordine de zi'
    },

    MonthView : {
        Month     : 'Lună',
        monthUnit : 'lună'
    },

    MultiWeekView : {
        multiWeek : 'Mai multe săptămâni'
    },

    WeekView : {
        weekUnit : 'săptămână'
    },

    YearView : {
        Year     : 'An',
        yearUnit : 'an',
        noEvents : 'Niciun eveniment'
    },

    YearPlanner : {
        yearPlanner      : 'Planificator anual',
        expandMonthRow   : 'Extinde rândul lunii',
        collapseMonthRow : 'Restrânge rândul lunii'
    },

    EventList : {
        List   : 'Listă',
        Start  : 'Start',
        Finish : 'Finalizare',
        days   : count => `${count > 1 ? `${count} ` : ''}zi${count === 1 ? '' : 'le'}`
    },

    DayView : {
        Day                : 'Zi',
        dayUnit            : 'zi',
        daysUnit           : 'zile',
        expandAllDayRow    : 'Extindere secțiune toată ziua',
        collapseAllDayRow  : 'Restrângere secțiune toată ziua',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Nu există date corespunzătoare'
    },

    DayAgendaView : {
        dayAgenda : 'Agenda zilnică'
    },

    DayResourceView : {
        dayResourceView : 'Resurse zilnice'
    },

    MonthGrid : {
        monthGrid : 'Grilă lună'
    },

    Sidebar : {
        selectDate      : 'Selectați data din calendar',
        matchEvents     : 'Evenimente meci',
        filterEvents    : 'Filtrează evenimentele după numele evenimentului',
        filterResources : 'Filtrează evenimentele după resursa selectată'
    },

    WeekExpander : {
        expandTip   : 'Faceți clic pentru a extinde rândul',
        collapseTip : 'Faceți clic pentru a restrânge rândul'
    },

    keyboardActions : {
        title   : 'Acțiuni tastatură',
        content : 'Afișează panoul de ajutor : [?]\nButon de selecție mod focalizare : [Home]\nSchimbă vizualizarea : [1] la [9] sau prima literă a textului butonului selector\nUrmătorul interval de timp : [n]\nIntervalul de timp anterior : [p]\nMergi la astăzi : [t]\nNavighează la dată : [g]\nMergi la celula zilei curente : [CTRL]+[d]\nNavighează între evenimente : [TAB]\nFocalizează filtrul de evenimente din bara laterală : [/]\nCreează un eveniment nou (focalizat pe celula zilei) : [ENTER]\nȘterge evenimentul focalizat : [DELETE]/[BACKSPACE]\nEditează evenimentul focalizat : [ENTER]\nInvocă meniul contextual pe eveniment sau celulă : [SHIFT+F10]/[SPACE]\nFocalizează de la eveniment până la celula înconjurătoare : [ESCAPE]\nNavigare între celule : [↑]/[↓]/[←]/[→]\nActivează meniul intervalului (în vizualizarea Agendă) : [CTRL]+[r]\nTaie, copiază, lipește evenimente : [CTRL]+[x]/[c]/[v]\nMărește/micșorează doar vizualizarea Zilei : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
