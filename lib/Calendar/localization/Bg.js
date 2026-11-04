import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Bg.js';

const locale = {

    localeName : 'Bg',
    localeDesc : 'Български',
    localeCode : 'bg',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Календар',
        'All day' : 'Цял ден',
        day       : 'Ден',
        week      : 'Седмица',
        month     : 'Месец',
        year      : 'Година',
        decade    : 'Десетилетие'
    },

    EventMenu : {
        duplicateEvent : 'Дублиране на събитие ',
        copy           : 'копиране'
    },

    Calendar : {
        toggleSidebar : 'Превключване на видимостта на страничната лента',
        Today         : 'Днес',
        Tomorrow      : 'Утре',
        next          : range => `Следващ ${range}`,
        previous      : range => `Предишен ${range}`,
        plusMore      : value => `още +${value}`,
        moreEvents    : value => `Още ${value} събития`,
        allDay        : 'Цял ден',
        endsOn        : d => `Свършва ${d}`,
        weekOfYear    : ([y, w]) => `Седмица ${w}, ${y}`,
        loadFail      : 'Неуспешно зареждане на данните от календара. Моля, свържете се със системния администратор',
        gotoDate      : 'Отиди на дата',
        timeRange     : 'Времеви диапазон',
        noResources   : 'Няма ресурси',
        calendar      : 'Календар',
        toolbar       : 'Лента с инструменти на календара',
        months        : 'Месеци'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Задържане на CTRL за повтарящо се събитие'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Не'} събити${(count && count > 1) ? 'я' : 'е'}`,
        allDayEventCount : count => `${count || 'Няма'} целодневно събитие${count === 1 ? '' : 'я'}`
    },

    EventTip : {
        'Edit event' : 'Редактиране на събитие',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'включване на уикенди',
        weekends        : 'Уикенди',
        switcherMenu    : 'Меню за превключване на изглед'
    },

    AgendaView : {
        Agenda : 'Програма'
    },

    MonthView : {
        Month     : 'Месец',
        monthUnit : 'месец'
    },

    MultiWeekView : {
        multiWeek : 'Няколко седмици'
    },

    WeekView : {
        weekUnit : 'седмица'
    },

    YearView : {
        Year     : 'Година',
        yearUnit : 'година',
        noEvents : 'Няма събития'
    },

    YearPlanner : {
        yearPlanner      : 'Годишен планировач',
        expandMonthRow   : 'Разгъване на реда за месеци',
        collapseMonthRow : 'Свиване на реда за месеци'
    },

    EventList : {
        List   : 'Списък',
        Start  : 'Начало',
        Finish : 'Край',
        days   : count => `${count > 1 ? `${count} ` : ''}ден${count === 1 ? '' : 'а'}`
    },

    DayView : {
        Day                : 'Ден',
        dayUnit            : 'ден',
        daysUnit           : 'дни',
        expandAllDayRow    : 'Разгръщане на секцията за целия ден',
        collapseAllDayRow  : 'Свиване на секцията за целия ден',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Няма съвпадащи дати'
    },

    DayAgendaView : {
        dayAgenda : 'Дневен ред'
    },

    DayResourceView : {
        dayResourceView : 'Дневни ресурси'
    },

    MonthGrid : {
        monthGrid : 'Месечна решетка'
    },

    Sidebar : {
        selectDate      : 'Изберете дата от календара',
        matchEvents     : 'Събития на мача',
        filterEvents    : 'Филтриране на събития по име на събитието',
        filterResources : 'Филтриране на събития по избран ресурс'
    },

    WeekExpander : {
        expandTip   : 'Щракнете, за да разширите реда',
        collapseTip : 'Щракнете, за да свиете реда '
    },

    keyboardActions : {
        title   : 'Действия с клавиатурата',
        content : 'Показване на помощния панел : [?]\nБутон за избор на режим на фокус : [Home]\nСмяна на изглед : [1] до [9] или първата буква от текста на бутона за избор\nСледващ времеви диапазон : [n]\nПредишен времеви диапазон : [p]\nОтиди на днес : [t]\nНавигирай до дата : [g]\nОтиди до клетката за текущия ден : [CTRL]+[d]\nНавигиране между събития : [TAB]\nФокусирай филтъра за събития в страничната лента : [/]\nСъздай ново събитие (фокус върху клетка за ден) : [ENTER]\nИзтрий фокусираното събитие : [DELETE]/[BACKSPACE]\nРедактирай фокусираното събитие : [ENTER]\nИзвикай контекстното меню на събитие или клетка : [SHIFT+F10]/[SPACE]\nФокус от събитие към обгръщащата клетка : [ESCAPE]\nНавигация между клетки : [СТРЕЛКИ]\nАктивирай менюто за диапазон (в изглед Програма) : [CTRL]+[r]\nИзрежи, копирай, постави събития : [CTRL]+[x]/[c]/[v]\nУвеличи/намали мащаба само в изглед Ден : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
