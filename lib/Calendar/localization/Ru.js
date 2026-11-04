import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Ru.js';

const locale = {

    localeName : 'Ru',
    localeDesc : 'Русский',
    localeCode : 'ru',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Календарь',
        'All day' : 'На весь день',
        day       : 'День',
        week      : 'Неделя',
        month     : 'Месяц',
        year      : 'Год',
        decade    : 'Десятилетие'
    },

    EventMenu : {
        duplicateEvent : 'копировать событие',
        copy           : 'копия'
    },

    Calendar : {
        toggleSidebar : 'Переключить видимость боковой панели',
        Today         : 'Сегодня',
        Tomorrow      : 'Завтра',
        next          : range => {
            const next = range.includes('неделя') ? 'следующая' : 'следующий';

            return `${next} ${range}`;
        },
        previous : range => {
            const previous = range.includes('неделя') ?  'предыдущая' : 'предыдущий';

            return `${previous} ${range}`;
        },
        plusMore    : value => `Еще +${value}`,
        moreEvents  : value => `${value} больше событий`,
        allDay      : 'На весь день',
        endsOn      : d => `Заканчивается ${d}`,
        weekOfYear  : ([y, w]) => `Неделя ${w}, ${y}`,
        loadFail    : 'Не удалось загрузить данные календаря. Пожалуйста, обратитесь к системному администратору',
        gotoDate    : 'Перейти к дате',
        timeRange   : 'Диапазон времени',
        noResources : 'Нет ресурсов',
        calendar    : 'Календарь',
        toolbar     : 'Панель инструментов календаря',
        months      : 'Месяцы'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Удерживайте CTRL для повторяющегося события'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Нет'} ${count === 1 ? 'событие' : 'событий'}`,
        allDayEventCount : count => `${count || 'Нет'} события на весь день${count === 1 ? '' : ''}`
    },

    EventTip : {
        'Edit event' : 'Редактировать событие',
        timeFormat   : 'LT'
    },

    ModeSelector : {
        includeWeekends : 'Включить выходные',
        weekends        : 'выходные',
        switcherMenu    : 'Меню переключателя вида'
    },

    AgendaView : {
        Agenda : 'Повестка дня'
    },

    MonthView : {
        Month     : 'Месяц',
        monthUnit : 'месяц'
    },

    MultiWeekView : {
        multiWeek : 'Несколько недель'
    },

    WeekView : {
        weekUnit : 'неделя'
    },

    YearView : {
        Year     : 'Год',
        yearUnit : 'год',
        noEvents : 'Нет событий'
    },

    YearPlanner : {
        yearPlanner      : 'Планировщик года',
        expandMonthRow   : 'Развернуть строку месяца',
        collapseMonthRow : 'Свернуть строку месяца'
    },

    EventList : {
        List   : 'Список',
        Start  : 'Начало',
        Finish : 'Конец',
        days   : count => `${count > 1 ? `${count} ` : ''}${count === 1 ? 'день' : 'дни'}`
    },

    DayView : {
        Day                : 'День',
        dayUnit            : 'день',
        daysUnit           : 'дни',
        expandAllDayRow    : 'Развернуть группу событий на весь день',
        collapseAllDayRow  : 'Свернуть группу событий на весь день',
        timeFormat         : 'LT',
        timeAxisTimeFormat : 'LT',
        noMatchingDates    : 'Нет совпадающих дат'
    },

    DayAgendaView : {
        dayAgenda : 'Повестка дня'
    },

    DayResourceView : {
        dayResourceView : 'Дневные ресурсы'
    },

    MonthGrid : {
        monthGrid : 'Сетка месяца'
    },

    Sidebar : {
        selectDate      : 'Выберите дату в календаре',
        matchEvents     : 'События матча',
        filterEvents    : 'Фильтровать события по названию',
        filterResources : 'Фильтровать события по выбранному ресурсу'
    },

    WeekExpander : {
        expandTip   : 'Нажмите, чтобы развернуть строку',
        collapseTip : 'Нажмите, чтобы свернуть строку'
    },

    keyboardActions : {
        title   : 'Действия с клавиатурой',
        content : 'Показать панель помощи : [?]\nКнопка выбора режима фокуса : [Home]\nСменить вид : [1] до [9] или первая буква текста кнопки выбора\nСледующий временной промежуток : [n]\nПредыдущий временной промежуток : [p]\nПерейти к сегодняшнему дню : [t]\nПерейти к дате : [g]\nПерейти к ячейке текущего дня : [CTRL]+[d]\nНавигация между событиями : [TAB]\nФокус на поле фильтра событий боковой панели : [/]\nСоздать новое событие (фокус на ячейке дня) : [ENTER]\nУдалить выбранное событие : [DELETE]/[BACKSPACE]\nРедактировать выбранное событие : [ENTER]\nВызвать контекстное меню на событии или ячейке : [SHIFT+F10]/[SPACE]\nФокус с события на окружающую ячейку : [ESCAPE]\nНавигация между ячейками : [↑]/[↓]/[←]/[→]\nАктивировать меню диапазона (в виде Повестка дня) : [CTRL]+[r]\nВырезать, копировать, вставить события : [CTRL]+[x]/[c]/[v]\nУвеличить/уменьшить масштаб только в виде Дня : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
