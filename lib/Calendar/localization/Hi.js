import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Hi.js';

const locale = {

    localeName : 'Hi',
    localeDesc : 'हिन्दी',
    localeCode : 'hi',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'कैलेन्डर',
        'All day' : 'सारा दिन',
        day       : 'दिन',
        week      : 'सप्ताह',
        month     : 'महीना',
        year      : 'साल',
        decade    : 'दशक'
    },

    EventMenu : {
        duplicateEvent : 'डुप्लीकेट ईवेंट',
        copy           : 'कॉपी करें'
    },

    Calendar : {
        toggleSidebar : 'साइडबार दृश्यता को टॉगल करें',
        Today         : 'आज',
        Tomorrow      : 'कल',
        next          : range => `अगली ${range}`,
        previous      : range => `पिछली ${range}`,
        plusMore      : value => `+${value} और`,
        moreEvents    : value => `${value} अधिक इवेंट्स`,
        allDay        : 'सारा दिन',
        endsOn        : d => `समाप्ति तिथि ${d}`,
        weekOfYear    : ([y, w]) => `सप्ताह ${w}, ${y}`,
        loadFail      : 'कैलेंडर डेटा लोड विफल रहा। कृपया अपने सिस्टम प्रशासक से संपर्क करें',
        gotoDate      : 'तिथि पर जाएं',
        timeRange     : 'समय सीमा',
        noResources   : 'कोई संसाधन नहीं',
        calendar      : 'कैलेंडर',
        toolbar       : 'कैलेंडर टूलबार',
        months        : 'महीने'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'बार-बार होने वाले ईवेंट के लिए CTRL दबाएं'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'शून्य'} ईवेंट`,
        allDayEventCount : count => `${count || 'कोई नहीं'} पूरे दिन की घटना${count === 1 ? '' : 'एं'}`
    },

    EventTip : {
        'Edit event' : 'ईवेंट संपादित करें',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'सप्ताहांत शामिल करें',
        weekends        : 'सप्ताहांत',
        switcherMenu    : 'दृश्य स्विचर मेनू'
    },

    AgendaView : {
        Agenda : 'एजेंडा'
    },

    MonthView : {
        Month     : 'महीना',
        monthUnit : 'महीना'
    },

    MultiWeekView : {
        multiWeek : 'कई सप्ताह'
    },

    WeekView : {
        weekUnit : 'सप्ताह'
    },

    YearView : {
        Year     : 'साल',
        yearUnit : 'साल',
        noEvents : 'कोई घटनाएँ नहीं'
    },

    YearPlanner : {
        yearPlanner      : 'वर्ष योजना',
        expandMonthRow   : 'महीने की पंक्ति विस्तारित करें',
        collapseMonthRow : 'महीने की पंक्ति संकुचित करें'
    },

    EventList : {
        List   : 'सूची',
        Start  : 'शुरू करें',
        Finish : 'समाप्त करें',
        days   : count => `${count > 1 ? `${count} ` : ''}दिन}`
    },

    DayView : {
        Day                : 'दिन',
        dayUnit            : 'दिन',
        daysUnit           : 'दिन',
        expandAllDayRow    : 'सारा-दिन सेक्शन फैलाएं',
        collapseAllDayRow  : 'सारा-दिन सेक्शन समेटें',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'कोई मेल खाने वाली तिथियाँ नहीं'
    },

    DayAgendaView : {
        dayAgenda : 'दिनचर्या'
    },

    DayResourceView : {
        dayResourceView : 'दैनिक संसाधन'
    },

    MonthGrid : {
        monthGrid : 'महीने का ग्रिड'
    },

    Sidebar : {
        selectDate      : 'कैलेंडर की तारीख का चयन करें',
        matchEvents     : 'मैच की घटनाएँ',
        filterEvents    : 'इवेंट नाम से इवेंट्स को फ़िल्टर करें',
        filterResources : 'चयनित संसाधन के अनुसार घटनाओं को फ़िल्टर करें'
    },

    WeekExpander : {
        expandTip   : 'पंक्ति फैलाने के लिए क्लिक करें',
        collapseTip : 'पंक्ति समेटने के लिए क्लिक करें'
    },

    keyboardActions : {
        title   : 'कीबोर्ड क्रियाएँ',
        content : 'सहायता पैनल दिखाएँ : [?]\nफोकस मोड चयन बटन : [Home]\nदृश्य बदलें : [1] से [9] या चयनकर्ता बटन पाठ का पहला अक्षर\nअगला समय अवधि : [n]\nपिछला समय अवधि : [p]\nआज पर जाएँ : [t]\nतिथि पर नेविगेट करें : [g]\nवर्तमान दिन की सेल पर जाएँ : [CTRL]+[d]\nघटनाओं के बीच नेविगेट करें : [TAB]\nसाइडबार घटना फ़िल्टर इनपुट पर फोकस करें : [/]\nनई घटना बनाएँ (दिन की सेल पर फोकस) : [ENTER]\nफोकस की गई घटना हटाएँ : [DELETE]/[BACKSPACE]\nफोकस की गई घटना संपादित करें : [ENTER]\nघटना या सेल पर संदर्भ मेनू सक्रिय करें : [SHIFT+F10]/[SPACE]\nघटना से संलग्न सेल तक फोकस करें : [ESCAPE]\nसेल से सेल नेविगेशन : [↑]/[↓]/[←]/[→]\nरेंज मेनू सक्रिय करें (एजेंडा दृश्य पर) : [CTRL]+[r]\nघटनाओं को काटें, कॉपी करें, चिपकाएँ : [CTRL]+[x]/[c]/[v]\nकेवल डे व्यू में ज़ूम इन/आउट करें : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
