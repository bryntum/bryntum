import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Pl.js';

const locale = {

    localeName : 'Pl',
    localeDesc : 'Polski',
    localeCode : 'pl',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalendarz',
        'All day' : 'Cały dzień',
        day       : 'Dzień',
        week      : 'Tydzień',
        month     : 'Miesiąc',
        year      : 'Rok',
        decade    : 'Dekada'
    },

    EventMenu : {
        duplicateEvent : 'Zduplikuj wydarzenie',
        copy           : 'kopiuj'
    },

    Calendar : {
        toggleSidebar : 'Przełącz widoczność paska bocznego',
        Today         : 'Dzisiaj',
        Tomorrow      : 'Jutro',
        next          : range => `Następny ${range}`,
        previous      : range => `Poprzedni ${range}`,
        plusMore      : value => `+${value} więcej`,
        moreEvents    : value => `${value} więcej wydarzeń`,
        allDay        : 'Cały dzień',
        endsOn        : d => `Kończy się ${d}`,
        weekOfYear    : ([y, w]) => `Tydzień ${w}, ${y}`,
        loadFail      : 'Nie załadowano danych kalendarza. Skontaktuj się z administratorem systemu',
        gotoDate      : 'Przejdź do daty',
        timeRange     : 'Zakres czasu',
        noResources   : 'Brak zasobów',
        calendar      : 'Kalendarz',
        toolbar       : 'Pasek narzędzi kalendarza',
        months        : 'Miesiące'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Przytrzymaj CTRL dla wydarzenia cyklicznego'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Brak'} wydarzeni${(count && count > 1) ? 'a' : 'e' }`,
        allDayEventCount : count => `${count || 'Brak'} wydarzenie całodniowe${count === 1 ? '' : 'a'}`
    },

    EventTip : {
        'Edit event' : 'Zmień wydarzenie',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Uwzględnij weekendy',
        weekends        : 'Weekendy',
        switcherMenu    : 'Menu przełącznika widoku'
    },

    AgendaView : {
        Agenda : 'Program'
    },

    MonthView : {
        Month     : 'Miesiąc',
        monthUnit : 'miesiąc'
    },

    MultiWeekView : {
        multiWeek : 'Wiele tygodni'
    },

    WeekView : {
        weekUnit : 'tydzień'
    },

    YearView : {
        Year     : 'Rok',
        yearUnit : 'rok',
        noEvents : 'Brak wydarzeń'
    },

    YearPlanner : {
        yearPlanner      : 'Planer roczny',
        expandMonthRow   : 'Rozwiń wiersz miesiąca',
        collapseMonthRow : 'Zwiń wiersz miesiąca'
    },

    EventList : {
        List   : 'Lista',
        Start  : 'Rozpocznij',
        Finish : 'Zakończ',
        days   : count => `${count > 1 ? `${count} ` : ''}${count === 1 ? 'dzień' : 'dni'}`
    },

    DayView : {
        Day                : 'Dzień',
        dayUnit            : 'dzień',
        daysUnit           : 'dni',
        expandAllDayRow    : 'Rozwiń sekcję całodniową',
        collapseAllDayRow  : 'Zwiń sekcję całodniową',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Brak pasujących dat'
    },

    DayAgendaView : {
        dayAgenda : 'Agenda dnia'
    },

    DayResourceView : {
        dayResourceView : 'Zasoby dziennie'
    },

    MonthGrid : {
        monthGrid : 'Siatka miesiąca'
    },

    Sidebar : {
        selectDate      : 'Wybierz datę z kalendarza',
        matchEvents     : 'Wydarzenia meczowe',
        filterEvents    : 'Filtruj wydarzenia według nazwy wydarzenia',
        filterResources : 'Filtruj wydarzenia według wybranego zasobu'
    },

    WeekExpander : {
        expandTip   : 'Kliknij, aby rozwinąć wiersz',
        collapseTip : 'Kliknij, aby zwinąć wiersz'
    },

    keyboardActions : {
        title   : 'Akcje klawiatury',
        content : 'Pokaż panel pomocy : [?]\nPrzycisk wyboru trybu skupienia : [Home]\nZmień widok : [1] do [9] lub pierwsza litera tekstu przycisku selektora\nNastępny przedział czasowy : [n]\nPoprzedni przedział czasowy : [p]\nPrzejdź do dzisiaj : [t]\nPrzejdź do daty : [g]\nPrzejdź do komórki bieżącego dnia : [CTRL]+[d]\nNawigacja między wydarzeniami : [TAB]\nSkup filtr wydarzeń w panelu bocznym : [/]\nUtwórz nowe wydarzenie (skupione na komórce dnia) : [ENTER]\nUsuń skupione wydarzenie : [DELETE]/[BACKSPACE]\nEdytuj skupione wydarzenie : [ENTER]\nWywołaj menu kontekstowe na wydarzeniu lub komórce : [SHIFT+F10]/[SPACE]\nSkupienie od wydarzenia do otaczającej komórki : [ESCAPE]\nNawigacja między komórkami : [↑]/[↓]/[←]/[→]\nAktywuj menu zakresu (w widoku Agenda) : [CTRL]+[r]\nWytnij, kopiuj, wklej wydarzenia : [CTRL]+[x]/[c]/[v]\nPowiększ/pomniejsz tylko widok dnia : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
