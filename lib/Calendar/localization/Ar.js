import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Ar.js';

const locale = {

    localeName : 'Ar',
    localeDesc : 'اللغة العربية',
    localeCode : 'ar',
    localeRtl  : true,

    EventEdit : {
        Calendar  : 'التقويم',
        'All day' : 'طوال اليوم',
        day       : 'يوم',
        week      : 'أسبوع',
        month     : 'شهر',
        year      : 'سنة',
        decade    : 'عقد'
    },

    EventMenu : {
        duplicateEvent : 'حدث مكرر',
        copy           : 'نسخ'
    },

    Calendar : {
        toggleSidebar : 'تبديل رؤية الشريط الجانبي',
        Today         : 'اليوم',
        Tomorrow      : 'غدًا',
        next          : range => `${range} التالي`,
        previous      : range => `${range} السابق`,
        plusMore      : value => `+${value} أكثر`,
        moreEvents    : value => `${value} أحداث أخرى`,
        allDay        : 'طوال اليوم',
        endsOn        : d => `${d} النهايات`,
        weekOfYear    : ([y, w]) => `${y} ,${w} أسبوع`,
        loadFail      : 'فشل تحميل بيانات التقويم. يُرجى الاتصال بمسؤول النظام الخاص بك',
        gotoDate      : 'اذهب إلى التاريخ',
        timeRange     : 'النطاق الزمني',
        noResources   : 'لا توجد موارد',
        calendar      : 'التقويم',
        toolbar       : 'شريط أدوات التقويم',
        months        : 'الشهور'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'اضغط باستمرار على CTRL من أجل حدث متكرر'
    },

    CalendarMixin : {
        eventCount       : count => `حدث${(count && count > 1) ? 'الأ' : ''} ${count || 'لا'}`,
        allDayEventCount : count => `${count || 'لا توجد'} فعالية طوال اليوم${count === 1 ? '' : 's'}`
    },

    EventTip : {
        'Edit event' : 'تعديل حدث',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'تضمين عطلات نهاية الأسبوع',
        weekends        : 'عطلات نهاية الأسبوع',
        switcherMenu    : 'قائمة تبديل العرض'
    },

    AgendaView : {
        Agenda : 'جدول أعمال'
    },

    MonthView : {
        Month     : 'شهر',
        monthUnit : 'شهر'
    },

    MultiWeekView : {
        multiWeek : 'عدة أسابيع'
    },

    WeekView : {
        weekUnit : 'أسبوع'
    },

    YearView : {
        Year     : 'سنة',
        yearUnit : 'سنة',
        noEvents : 'لا توجد أحداث'
    },

    YearPlanner : {
        yearPlanner      : 'مخطط السنة',
        expandMonthRow   : 'توسيع صف الشهر',
        collapseMonthRow : 'طي صف الشهر'
    },

    EventList : {
        List   : 'قائمة',
        Start  : 'بدء',
        Finish : 'إنهاء',
        days   : count => `${count === 1 ? 'يوم' : 'أيام'}${count > 1 ? ` ${count}` : ''}`
    },

    DayView : {
        Day                : 'يوم',
        dayUnit            : 'يوم',
        daysUnit           : 'أيام',
        expandAllDayRow    : 'توسيع قسم طوال اليوم',
        collapseAllDayRow  : 'تصغير قسم طوال اليوم',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'لا توجد تواريخ مطابقة'
    },

    DayAgendaView : {
        dayAgenda : 'جدول اليوم'
    },

    DayResourceView : {
        dayResourceView : 'موارد اليومية'
    },

    MonthGrid : {
        monthGrid : 'شبكة الشهر'
    },

    Sidebar : {
        selectDate      : 'حدد تاريخ التقويم',
        matchEvents     : 'أحداث المباراة',
        filterEvents    : 'تصفية الأحداث حسب اسم الحدث',
        filterResources : 'تصفية الأحداث حسب المورد المحدد'
    },

    WeekExpander : {
        expandTip   : 'انقر لتوسيع صف',
        collapseTip : 'انقر لتصغير صف'
    },

    keyboardActions : {
        title   : 'إجراءات لوحة المفاتيح',
        content : 'عرض لوحة المساعدة : [?]\nزر اختيار وضع التركيز : [Home]\nتغيير العرض : [1] إلى [9] أو الحرف الأول من نص زر المُحدد\nالفترة الزمنية التالية : [n]\nالفترة الزمنية السابقة : [p]\nالانتقال إلى اليوم : [t]\nالتنقل إلى التاريخ : [g]\nالانتقال إلى خلية اليوم الحالي : [CTRL]+[d]\nالتنقل بين الأحداث : [TAB]\nتركيز إدخال تصفية أحداث الشريط الجانبي : [/]\nإنشاء حدث جديد (مُركز على خلية اليوم) : [ENTER]\nحذف الحدث المُركز عليه : [DELETE]/[BACKSPACE]\nتعديل الحدث المُركز عليه : [ENTER]\nاستدعاء قائمة السياق على الحدث أو الخلية : [SHIFT+F10]/[SPACE]\nالتركيز من الحدث إلى الخلية المحيطة : [ESCAPE]\nالتنقل من خلية إلى أخرى : [↑]/[↓]/[←]/[→]\nتفعيل قائمة النطاق (في عرض الأجندة) : [CTRL]+[r]\nقص، نسخ، لصق الأحداث : [CTRL]+[x]/[c]/[v]\nتكبير/تصغير عرض اليوم فقط : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
