import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Kk.js';

const locale = {

    localeName : 'Kk',
    localeDesc : 'Қазақ тілі (KZ)',
    localeCode : 'kk-KZ',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Күнтізбе',
        'All day' : 'Бүкіл күн',
        day       : 'Күн',
        week      : 'Апта',
        month     : 'Ай',
        year      : 'Жыл',
        decade    : 'Он жылдық'
    },

    EventMenu : {
        duplicateEvent : 'Оқиға көшірмесі',
        copy           : 'көшірме('
    },

    Calendar : {
        toggleSidebar : 'Жанама тақтаның көрінуін ауыстыру',
        Today         : 'Бүгін',
        Tomorrow      : 'Ертең',
        next          : range => `Келесі ${range}`,
        previous      : range => `Алдыңғы ${range}`,
        plusMore      : value => `Тағы +${value}`,
        moreEvents    : value => `${value} тағы оқиға`,
        allDay        : 'Бүкіл күн',
        endsOn        : d => `${d} аяқталады`,
        weekOfYear    : ([y, w]) => `Апта ${w}, ${y}`,
        loadFail      : 'Күнтізбе деректерін жүктеу мүмкін болмады. Жүйе әкімшісіне хабарласыңыз',
        gotoDate      : 'Күнге өту',
        timeRange     : 'Уақыт аралығы',
        noResources   : 'Ресурстар жоқ',
        calendar      : 'Күнтізбе',
        toolbar       : 'Күнтізбе құралдар тақтасы',
        months        : 'Айлар'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Қайталанатын оқиға үшін CTRL пернесін басып ұстап тұрыңыз'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Жоқ'} event${count === 1 ? '' : 'с'}`,
        allDayEventCount : count => `${count || 'Ешқандай'} күн бойы оқиға${count === 1 ? '' : 'лар'}`
    },

    EventTip : {
        'Edit event' : 'Оқиғаны өңдеу',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Демалыс күндерін қосу',
        weekends        : 'Демалыс күндері',
        switcherMenu    : 'Көрініс ауыстыру мәзірі'
    },

    AgendaView : {
        Agenda : 'Күн тәртібі'
    },

    MonthView : {
        Month     : 'Ай',
        monthUnit : 'ай'
    },

    MultiWeekView : {
        multiWeek : 'Бірнеше апта'
    },

    WeekView : {
        weekUnit : 'апта'
    },

    YearView : {
        Year     : 'Жыл',
        yearUnit : 'жыл',
        noEvents : 'Оқиғалар жоқ'
    },

    YearPlanner : {
        yearPlanner      : 'Жыл жоспары',
        expandMonthRow   : 'Ай қатарын кеңейту',
        collapseMonthRow : 'Ай қатарын жинау'
    },

    EventList : {
        List   : 'Тізім',
        Start  : 'Басталуы',
        Finish : 'Аяқталуы',
        days   : count => `${count > 1 ? `${count} ` : ''}day${count === 1 ? '' : 'с'}`
    },

    DayView : {
        Day                : 'Күн',
        dayUnit            : 'күн',
        daysUnit           : 'күндер',
        expandAllDayRow    : 'Бүкіл күн бөлімін жаю',
        collapseAllDayRow  : 'Бүкіл күн бөлімін жиыру',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Сәйкес келетін күндер жоқ'
    },

    DayAgendaView : {
        dayAgenda : 'Күн тәртібі'
    },

    DayResourceView : {
        dayResourceView : 'Күн ресурстары'
    },

    MonthGrid : {
        monthGrid : 'Ай торы'
    },

    Sidebar : {
        selectDate      : 'Күнтізбе күнін таңдаңыз',
        matchEvents     : 'Матч оқиғалары',
        filterEvents    : 'Іс-шара атауы бойынша оқиғаларды сүзу',
        filterResources : 'Таңдалған ресурстар бойынша оқиғаларды сүзу'
    },

    WeekExpander : {
        expandTip   : 'Қатарды жаю үшін басыңыз',
        collapseTip : 'Қатарды жиыру үшін басыңыз'
    },

    keyboardActions : {
        title   : 'Пернетақта әрекеттері',
        content : 'Көмек панелін көрсету : [?]\nФокус режимін таңдау түймесі : [Home]\nКөріністі өзгерту : [1] - [9] немесе таңдау түймесінің мәтінінің бірінші әрпі\nКелесі уақыт аралығы : [n]\nАлдыңғы уақыт аралығы : [p]\nБүгінге өту : [t]\nКүнге өту : [g]\nАғымдағы күн ұяшығына өту : [CTRL]+[d]\nОқиғалар арасында шарлау : [TAB]\nБүйірлік панель оқиға сүзгісінің енгізу өрісіне фокус : [/]\nЖаңа оқиға жасау (күн ұяшығына фокус) : [ENTER]\nФокусталған оқиғаны жою : [DELETE]/[BACKSPACE]\nФокусталған оқиғаны өңдеу : [ENTER]\nОқиға немесе ұяшық контекстік мәзірін шақыру : [SHIFT+F10]/[SPACE]\nОқиғадан ұяшыққа дейінгі фокус : [ESCAPE]\nҰяшықтан ұяшыққа шарлау : [↑]/[↓]/[←]/[→]\nАуқым мәзірін іске қосу (Күн тәртібі көрінісінде) : [CTRL]+[r]\nОқиғаларды қиып алу, көшіру, қою : [CTRL]+[x]/[c]/[v]\nТек Күн көрінісінде үлкейту/кішірейту : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
