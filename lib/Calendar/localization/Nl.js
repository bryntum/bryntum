import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Nl.js';

const locale = {

    localeName : 'Nl',
    localeDesc : 'Nederlands',
    localeCode : 'nl',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalender',
        'All day' : 'Hele dag',
        day       : 'Dag',
        week      : 'Week',
        month     : 'Maand',
        year      : 'Jaar',
        decade    : 'Decennium'
    },

    EventMenu : {
        duplicateEvent : 'Kopiëren boeking',
        copy           : 'kopie'
    },

    Calendar : {
        toggleSidebar : 'Zichtbaarheid van de zijbalk wisselen',
        Today         : 'Vandaag',
        Tomorrow      : 'Morgen',
        next          : range => `Volgende ${range}`,
        previous      : range => `Vorige ${range}`,
        plusMore      : value => `+${value} meer`,
        moreEvents    : value => `${value} meer evenementen`,
        allDay        : 'Hele dag',
        endsOn        : d => `Eindigt op ${d}`,
        weekOfYear    : ([y, w]) => `Week ${w}, ${y}`,
        loadFail      : 'Het laden van agendagegevens is mislukt. Neem contact op met uw systeembeheerder',
        gotoDate      : 'Ga naar datum',
        timeRange     : 'Tijdsbereik',
        noResources   : 'Geen bronnen',
        calendar      : 'Kalender',
        toolbar       : 'Kalender werkbalk',
        months        : 'Maanden'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Toets CTRL voor herhalende gebeurtenis'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'No'} event${count === 1 ? '' : 's'}`,
        allDayEventCount : count => `${count || 'Geen'} evenement${count === 1 ? '' : 'en'} de hele dag`
    },

    EventTip : {
        'Edit event' : 'Bewerk boeking',
        timeFormat   : 'LT'
    },

    ModeSelector : {
        includeWeekends : 'Inclusief weekenden',
        weekends        : 'Weekenden',
        switcherMenu    : 'Menu voor weergavewisselaar'
    },

    AgendaView : {
        Agenda : 'Agenda'
    },

    MonthView : {
        Month     : 'Maand',
        monthUnit : 'maand'
    },

    MultiWeekView : {
        multiWeek : 'Meerdere weken'
    },

    WeekView : {
        weekUnit : 'week'
    },

    YearView : {
        Year     : 'Jaar',
        yearUnit : 'jaar',
        noEvents : 'Geen evenementen'
    },

    YearPlanner : {
        yearPlanner      : 'Jaarplanner',
        expandMonthRow   : 'Maandrij uitbreiden',
        collapseMonthRow : 'Maandrij samenvouwen'
    },

    EventList : {
        List   : 'Lijst',
        Start  : 'Begin',
        Finish : 'Af hebben',
        days   : count => `${count > 1 ? `${count} ` : ''}dag${count === 1 ? '' : 'en'}`
    },

    DayView : {
        Day                : 'Dag',
        dayUnit            : 'dag',
        daysUnit           : 'dagen',
        expandAllDayRow    : 'Klap dag overzicht uit',
        collapseAllDayRow  : 'Klap dag overzicht in',
        timeFormat         : 'LT',
        timeAxisTimeFormat : 'LT',
        noMatchingDates    : 'Geen overeenkomende datums'
    },

    DayAgendaView : {
        dayAgenda : 'Dagagenda'
    },

    DayResourceView : {
        dayResourceView : 'Dagelijkse bronnen'
    },

    MonthGrid : {
        monthGrid : 'Maand raster'
    },

    Sidebar : {
        selectDate      : 'Selecteer kalenderdatum',
        matchEvents     : 'Wedstrijdevenementen',
        filterEvents    : 'Filter evenementen op naam van evenement',
        filterResources : 'Filter evenementen op geselecteerde bron'
    },

    WeekExpander : {
        expandTip   : 'Klik om de rij uit te vouwen',
        collapseTip : 'Klik om de rij samen te vouwen'
    },

    keyboardActions : {
        title   : 'Toetsenbordacties',
        content : 'Helpvenster tonen : [?]\nFocusmodus selecteerknop : [Home]\nWeergave wijzigen : [1] tot [9] of eerste letter van de tekst van de selecteerknop\nVolgende tijdspanne : [n]\nVorige tijdspanne : [p]\nGa naar vandaag : [t]\nNavigeer naar datum : [g]\nGa naar de cel van de huidige dag : [CTRL]+[d]\nNavigeer tussen evenementen : [TAB]\nFocus zijbalk evenementfilter invoer : [/]\nNieuw evenement maken (gefocusseerd op dagcel) : [ENTER]\nGeselecteerd evenement verwijderen : [DELETE]/[BACKSPACE]\nGeselecteerd evenement bewerken : [ENTER]\nContextmenu oproepen op evenement of cel : [SHIFT+F10]/[SPACE]\nFocus van evenement naar omringende cel : [ESCAPE]\nNavigatie tussen cellen : [PIJLTOETSEN]\nBereikmenu activeren (in Agendaweergave) : [CTRL]+[r]\nKnippen, kopiëren, plakken van evenementen : [CTRL]+[x]/[c]/[v]\nIn-/uitzoomen alleen in Dagweergave : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
