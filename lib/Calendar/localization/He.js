import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/He.js';

const locale = {

    localeName : 'He',
    localeDesc : 'עִברִית',
    localeCode : 'he',
    localeRtl  : true,

    EventEdit : {
        Calendar  : 'לוח שנה',
        'All day' : 'כל היום',
        day       : 'יום',
        week      : 'שבוע',
        month     : 'חודש',
        year      : 'שנה',
        decade    : 'עשור'
    },

    EventMenu : {
        duplicateEvent : 'הכפלת אירוע',
        copy           : 'העתק'
    },

    Calendar : {
        toggleSidebar : 'החלפת נראות של סרגל הצד',
        Today         : 'היום',
        Tomorrow      : 'מחר',
        next          : range => `${range} הבא`,
        previous      : range => `${range} קודם`,
        plusMore      : value => `+${value} עוד`,
        moreEvents    : value => `עוד ${value} אירועים`,
        allDay        : 'כל היום',
        endsOn        : d => `${d} מסתיים`,
        weekOfYear    : ([y, w]) => `${y}, ${w}, שבוע`,
        loadFail      : 'טעינת נתוני לוח השנה כשלה. אנא פנה למנהל המערכת שלך.',
        gotoDate      : 'עבור לתאריך',
        timeRange     : 'טווח זמן',
        noResources   : 'אין משאבים',
        calendar      : 'לוּחַ שָׁנָה',
        toolbar       : 'סרגל כלים של לוח שנה',
        months        : 'חודשים'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'לחץ לחיצה ממושכת על מקש קונטרול לאירוע חוזר'
    },

    CalendarMixin : {
        eventCount       : count => `${(count && count > 1) ? 'ים' : ''}אירוע ${count || 'אין'}`,
        allDayEventCount : count => `${count || 'אין'} אירועי יום שלם${count === 1 ? '' : 'ים'}`
    },

    EventTip : {
        'Edit event' : 'ערוך אירוע',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'כלול סופי שבוע',
        weekends        : 'סופי שבוע',
        switcherMenu    : 'תפריט מחליף תצוגה'
    },

    AgendaView : {
        Agenda : 'יומן'
    },

    MonthView : {
        Month     : 'חודש',
        monthUnit : 'חודש'
    },

    MultiWeekView : {
        multiWeek : 'מספר שבועות'
    },

    WeekView : {
        weekUnit : 'שבוע'
    },

    YearView : {
        Year     : 'שנה',
        yearUnit : 'שנה',
        noEvents : 'אין אירועים'
    },

    YearPlanner : {
        yearPlanner      : 'מתכנן שנה',
        expandMonthRow   : 'הרחב שורת חודש',
        collapseMonthRow : 'כווץ שורת חודש'
    },

    EventList : {
        List   : 'רשימה',
        Start  : 'התחל',
        Finish : 'סיים',
        days   : count => `${count === 1 ? 'יְוֹם' : 'ימים'}${count > 1 ? ` ${count}` : ''}`
    },

    DayView : {
        Day                : 'יום',
        dayUnit            : 'יום',
        daysUnit           : 'ימים',
        expandAllDayRow    : 'הרחב את מקטע כל הימים',
        collapseAllDayRow  : 'מזער את מקטע כל הימים',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'אין תאריכים תואמים'
    },

    DayAgendaView : {
        dayAgenda : 'לוח זמנים יומי'
    },

    DayResourceView : {
        dayResourceView : 'משאבי יום'
    },

    MonthGrid : {
        monthGrid : 'רשת חודשים'
    },

    Sidebar : {
        selectDate      : 'בחר תאריך בלוח שנה',
        matchEvents     : 'אירועי משחק',
        filterEvents    : 'סנן אירועים לפי שם אירוע',
        filterResources : 'סנן אירועים לפי משאב נבחר'
    },

    WeekExpander : {
        expandTip   : 'הקלק להרחבת השורה',
        collapseTip : 'הקלק למזעור השורה'
    },

    keyboardActions : {
        title   : 'פעולות מקלדת',
        content : "הצגת לוח עזרה : [?]\nלחצן בחירת מצב מיקוד : [Home]\nשינוי תצוגה : [1] עד [9] או האות הראשונה של טקסט לחצן הבחירה\nטווח זמן הבא : [n]\nטווח זמן קודם : [p]\nמעבר להיום : [t]\nניווט לתאריך : [g]\nמעבר לתא היום הנוכחי : [CTRL]+[d]\nניווט בין אירועים : [TAB]\nמיקוד קלט מסנן אירועים בסרגל הצד : [/]\nיצירת אירוע חדש (ממוקד בתא יום) : [ENTER]\nמחיקת אירוע ממוקד : [DELETE]/[BACKSPACE]\nעריכת האירוע הממוקד : [ENTER]\nהפעלת תפריט הקשר על אירוע או תא : [SHIFT+F10]/[SPACE]\nמיקוד מאירוע עד לתא המכיל : [ESCAPE]\nניווט תא לתא : [↑]/[↓]/[←]/[→]\nהפעלת תפריט טווח (בתצוגת אג'נדה) : [CTRL]+[r]\nגזירה, העתקה, הדבקת אירועים : [CTRL]+[x]/[c]/[v]\nזום פנימה/החוצה בתצוגת יום בלבד : [+]/[-]"
    }
};

export default LocaleHelper.publishLocale(locale);
