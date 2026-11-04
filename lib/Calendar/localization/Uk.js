import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Uk.js';

const locale = {

    localeName : 'Uk',
    localeDesc : 'Українська',
    localeCode : 'uk-UA',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Календар',
        'All day' : 'Увесь день',
        day       : 'День',
        week      : 'Тиждень',
        month     : 'Місяць',
        year      : 'Рік',
        decade    : 'Десятиліття'
    },

    EventMenu : {
        duplicateEvent : 'Копіювати подію',
        copy           : 'Копіювати'
    },

    Calendar : {
        toggleSidebar : 'Перемкнути видимість бічної панелі',
        Today         : 'Сьогодні',
        Tomorrow      : 'Завтра',
        next          : range => `Далі ${range}`,
        previous      : range => `Назад ${range}`,
        plusMore      : value => `Ще +${value}`,
        moreEvents    : value => `${value} ще подій`,
        allDay        : 'Увесь день',
        endsOn        : d => `Завершується ${d}`,
        weekOfYear    : ([y, w]) => `Тиждень ${w}, ${y}`,
        loadFail      : 'Не вдалося завантажити дані календаря. Зверніться до системного адміністратора',
        gotoDate      : 'Перейти до дати',
        timeRange     : 'Діапазон часу',
        noResources   : 'Немає ресурсів',
        calendar      : 'Календар',
        toolbar       : 'Панель інструментів календаря',
        months        : 'Місяці'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Утримуйте клавішу CTRL для повторення події'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Події відсутні'} event${count === 1 ? '' : 'с'}`,
        allDayEventCount : count => `${count || 'Немає'} події на весь день${count === 1 ? '' : ''}`
    },

    EventTip : {
        'Edit event' : 'Редагувати подію',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Включити тижні',
        weekends        : 'Тижні',
        switcherMenu    : 'Меню перемикача перегляду'
    },

    AgendaView : {
        Agenda : 'Порядок денний'
    },

    MonthView : {
        Month     : 'Місяць',
        monthUnit : 'міс.'
    },

    MultiWeekView : {
        multiWeek : 'Кілька тижнів'
    },

    WeekView : {
        weekUnit : 'тиж.'
    },

    YearView : {
        Year     : 'Рік',
        yearUnit : 'р.',
        noEvents : 'Події відсутні'
    },

    YearPlanner : {
        yearPlanner      : 'Річний планувальник',
        expandMonthRow   : 'Розгорнути рядок місяця',
        collapseMonthRow : 'Згорнути рядок місяця'
    },

    EventList : {
        List   : 'Список',
        Start  : 'Початок',
        Finish : 'Завершення',
        days   : count => `${count > 1 ? `${count} ` : ''}day${count === 1 ? '' : 'Дні'}`
    },

    DayView : {
        Day                : 'День',
        dayUnit            : 'дн.',
        daysUnit           : 'дн.',
        expandAllDayRow    : 'Розгорнути розділ з розкладом дня',
        collapseAllDayRow  : 'Згорнути  розділ з розкладом дня',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Немає відповідних дат'
    },

    DayAgendaView : {
        dayAgenda : 'Порядок денний'
    },

    DayResourceView : {
        dayResourceView : 'Ресурси на день'
    },

    MonthGrid : {
        monthGrid : 'Сітка місяця'
    },

    Sidebar : {
        selectDate      : 'Виберіть дату в календарі',
        matchEvents     : 'Події матчу',
        filterEvents    : 'Фільтрувати події за назвою',
        filterResources : 'Фільтрувати події за обраним ресурсом'
    },

    WeekExpander : {
        expandTip   : 'Натисніть, щоб розгорнути рядок',
        collapseTip : 'Натисніть, щоб згорнути рядок'
    },

    keyboardActions : {
        title   : 'Дії з клавіатурою',
        content : 'Показати панель допомоги : [?]\nКнопка вибору режиму фокуса : [Home]\nЗмінити вигляд : [1] до [9] або перша буква тексту кнопки вибору\nНаступний часовий проміжок : [n]\nПопередній часовий проміжок : [p]\nПерейти до сьогодні : [t]\nПерейти до дати : [g]\nПерейти до комірки поточного дня : [CTRL]+[d]\nНавігація між подіями : [TAB]\nФокус на полі фільтра подій бічної панелі : [/]\nСтворити нову подію (фокус на комірці дня) : [ENTER]\nВидалити фокусовану подію : [DELETE]/[BACKSPACE]\nРедагувати фокусовану подію : [ENTER]\nВикликати контекстне меню на події або комірці : [SHIFT+F10]/[SPACE]\nФокус з події на оточуючу комірку : [ESCAPE]\nНавігація між комірками : [↑]/[↓]/[←]/[→]\nАктивувати меню діапазону (в вигляді Порядку денного) : [CTRL]+[r]\nВирізати, копіювати, вставити події : [CTRL]+[x]/[c]/[v]\nЗбільшити/зменшити масштаб тільки в вигляді Дня : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
