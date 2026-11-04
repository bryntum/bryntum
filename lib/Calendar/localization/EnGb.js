import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/EnGb.js';

const locale = {

    localeName : 'EnGb',
    localeDesc : 'English (GB)',
    localeCode : 'en-GB',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Calendar',
        'All day' : 'All day',
        day       : 'Day',
        week      : 'Week',
        month     : 'Month',
        year      : 'Year',
        decade    : 'Decade'
    },

    EventMenu : {
        duplicateEvent : 'Duplicate event',
        copy           : 'copy'
    },

    Calendar : {
        toggleSidebar : 'Toggle sidebar visibility',
        Today         : 'Today',
        Tomorrow      : 'Tomorrow',
        next          : range => `Next ${range}`,
        previous      : range => `Previous ${range}`,
        plusMore      : value => `+${value} more`,
        moreEvents    : value => `${value} more events`,
        allDay        : 'All day',
        endsOn        : d => `Ends ${d}`,
        weekOfYear    : ([y, w]) => `Week ${w}, ${y}`,
        loadFail      : 'Calendar data load failed. Please contact your system administrator',
        gotoDate      : 'Go to date',
        timeRange     : 'Time range',
        noResources   : 'No resources',
        calendar      : 'Calendar',
        toolbar       : 'Calendar toolbar',
        months        : 'Months'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Hold CTRL for a recurring event'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'No'} event${(count && count > 1) ? 's' : ''}`,
        allDayEventCount : count => `${count || 'No'} all-day event${count === 1 ? '' : 's'}`
    },

    EventTip : {
        'Edit event' : 'Edit event',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Include weekends',
        weekends        : 'Weekends',
        switcherMenu    : 'View switcher menu'
    },

    AgendaView : {
        Agenda : 'Agenda'
    },

    MonthView : {
        Month     : 'Month',
        monthUnit : 'month'
    },

    MultiWeekView : {
        multiWeek : 'Multi week'
    },

    WeekView : {
        weekUnit : 'week'
    },

    YearView : {
        Year     : 'Year',
        yearUnit : 'year',
        noEvents : 'No events'
    },

    YearPlanner : {
        yearPlanner      : 'Year Planner',
        expandMonthRow   : 'Expand month row',
        collapseMonthRow : 'Collapse month row'
    },

    EventList : {
        List   : 'List',
        Start  : 'Start',
        Finish : 'Finish',
        days   : count => `${count > 1 ? `${count} ` : ''}day${count === 1 ? '' : 's'}`
    },

    DayView : {
        Day                : 'Day',
        dayUnit            : 'day',
        daysUnit           : 'days',
        expandAllDayRow    : 'Expand all-day section',
        collapseAllDayRow  : 'Collapse all-day section',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'No matching dates'
    },

    DayAgendaView : {
        dayAgenda : 'Day Agenda'
    },

    DayResourceView : {
        dayResourceView : 'Day resources'
    },

    MonthGrid : {
        monthGrid : 'Month grid'
    },

    Sidebar : {
        selectDate      : 'Select calendar date',
        matchEvents     : 'Filter events',
        filterEvents    : 'Filter events by event name',
        filterResources : 'Filter events by selected resource'
    },

    WeekExpander : {
        expandTip   : 'Click to expand row',
        collapseTip : 'Click to collapse row'
    },

    keyboardActions : {
        title   : 'Keyboard actions',
        content : "Show help panel : [?]\nFocus mode selection button : [Home]\nChange view : [1] to [9] or first letter of selector button text\nNext time span : [n]\nPrevious time span : [p]\nGo to today : [t]\nNavigate to date : [g]\nGo to current day's cell : [CTRL]+[d]\nNavigate between events : [TAB]\nFocus sidebar event filter input : [/]\nCreate new event (focused on day cell) : [ENTER]\nDelete focused event : [DELETE]/[BACKSPACE]\nEdit the focused event : [ENTER]\nInvoke context menu on event or cell : [SHIFT+F10]/[SPACE]\nFocus from event up to enclosing cell : [ESCAPE]\nCell to cell navigation : [↑]/[↓]/[←]/[→]\nActivate range menu (on Agenda view) : [CTRL]+[r]\nCut, copy, paste events : [CTRL]+[x]/[c]/[v]\nZoom in/out DayView only : [+]/[-]"
    }
};

export default LocaleHelper.publishLocale(locale);
