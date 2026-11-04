import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/SrRs.js';

const locale = {

    localeName : 'SrRs',
    localeDesc : 'Српски (ћирилица)',
    localeCode : 'sr-RS',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Календар',
        'All day' : 'Цео дан',
        day       : 'Дан',
        week      : 'Седмица',
        month     : 'Mесец',
        year      : 'Година',
        decade    : 'Деценија'
    },

    EventMenu : {
        duplicateEvent : 'Дуплирај догађај',
        copy           : 'копирај'
    },

    Calendar : {
        toggleSidebar : 'Промени видљивост бочне траке',
        Today         : 'Данас',
        Tomorrow      : 'Завтра',
        next          : range => `Следећи ${range}`,
        previous      : range => `Претходни ${range}`,
        plusMore      : value => `+${value} више`,
        moreEvents    : value => `${value} ещё событий`,
        allDay        : 'Цео дан',
        endsOn        : d => `Завршава се ${d}`,
        weekOfYear    : ([y, w]) => `Седмица ${w}, ${y}`,
        loadFail      : 'Учитавање података није успело. Контактирајте свог администратора система',
        gotoDate      : 'Иди на датум',
        timeRange     : 'Временски опсег',
        noResources   : 'Нема ресурса',
        calendar      : 'Календар',
        toolbar       : 'Трака са алаткама календара',
        months        : 'Месеци'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Задржите CTRL за понављање догађаја'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Не'} event${count === 1 ? '' : 'с'}`,
        allDayEventCount : count => `${count || 'Нема'} целодневни догађај${count === 1 ? '' : 'и'}`
    },

    EventTip : {
        'Edit event' : 'Уредите догађај',
        timeFormat   : 'ЛСТ'
    },

    ModeSelector : {
        includeWeekends : 'Укључи викенде',
        weekends        : 'Викенди',
        switcherMenu    : 'Мени за промену приказа'
    },

    AgendaView : {
        Agenda : 'Распоред'
    },

    MonthView : {
        Month     : 'Месец',
        monthUnit : 'месец'
    },

    MultiWeekView : {
        multiWeek : 'Више недеља'
    },

    WeekView : {
        weekUnit : 'недеља'
    },

    YearView : {
        Year     : 'Година',
        yearUnit : 'година',
        noEvents : 'Нема догађаја'
    },

    YearPlanner : {
        yearPlanner      : 'Годишњи планер',
        expandMonthRow   : 'Прошири ред месеца',
        collapseMonthRow : 'Скупи ред месеца'
    },

    EventList : {
        List   : 'Листа',
        Start  : 'Почетак',
        Finish : 'Крај',
        days   : count => `${count > 1 ? `${count} ` : ''}day${count === 1 ? '' : 'с'}`
    },

    DayView : {
        Day                : 'Дан',
        dayUnit            : 'дан',
        daysUnit           : 'дана',
        expandAllDayRow    : 'Прошири одељак за цео дан',
        collapseAllDayRow  : 'Скупи догађај за цео дан',
        timeFormat         : 'ЛСТ',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Нема одговарајућих датума'
    },

    DayAgendaView : {
        dayAgenda : 'Дневной график'
    },

    DayResourceView : {
        dayResourceView : 'Ресурси за дан'
    },

    MonthGrid : {
        monthGrid : 'Месечна мрежа'
    },

    Sidebar : {
        selectDate      : 'Изаберите дату из календаря',
        matchEvents     : 'События матча',
        filterEvents    : 'Фильтровать события по названию',
        filterResources : 'Фильтровать события по выбранному ресурсу'
    },

    WeekExpander : {
        expandTip   : 'Кликните за проширење реда',
        collapseTip : 'Кликните за скупљање реда'
    },

    keyboardActions : {
        title   : 'Акције тастатуре',
        content : 'Прикажи панел помоћи : [?]\nДугме за избор режима фокуса : [Home]\nПромени приказ : [1] до [9] или прво слово текста дугмета селектора\nСледећи временски опсег : [n]\nПретходни временски опсег : [p]\nИди на данас : [t]\nНавигирај до датума : [g]\nИди на ћелију тренутног дана : [CTRL]+[d]\nНавигирај између догађаја : [TAB]\nФокусирај унос филтера догађаја бочне траке : [/]\nКреирај нови догађај (фокусирано на ћелију дана) : [ENTER]\nОбриши фокусирани догађај : [DELETE]/[BACKSPACE]\nУреди фокусирани догађај : [ENTER]\nПозови контекст мени на догађају или ћелији : [SHIFT+F10]/[SPACE]\nФокусирај са догађаја на обухватну ћелију : [ESCAPE]\nНавигација између ћелија : [↑]/[↓]/[←]/[→]\nАктивирај мени опсега (у приказу Агенде) : [CTRL]+[r]\nИсеци, копирај, налепи догађаје : [CTRL]+[x]/[c]/[v]\nЗумирај у/из приказа Дана само : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
