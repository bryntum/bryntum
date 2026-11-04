import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Lv.js';

const locale = {

    localeName : 'Lv',
    localeDesc : 'Latviešu',
    localeCode : 'lv-LV',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalendārs',
        'All day' : 'Visu dienu',
        day       : 'Diena',
        week      : 'Nedēļa',
        month     : 'Mēnesis',
        year      : 'Gads',
        decade    : 'Desmitgade'
    },

    EventMenu : {
        duplicateEvent : 'Duplicēt notikumu',
        copy           : 'kopēt'
    },

    Calendar : {
        toggleSidebar : 'Pārslēgt sānu joslas redzamību',
        Today         : 'Šodiena',
        Tomorrow      : 'Rīt',
        next          : range => `Nākamais ${range}`,
        previous      : range => `Iepriekšējais ${range}`,
        plusMore      : value => `+${value} vairāk`,
        moreEvents    : value => `${value} daugiau įvykių`,
        allDay        : 'Visu dienu',
        endsOn        : d => `Beidzas ${d}`,
        weekOfYear    : ([y, w]) => `Nedēļa ${w}, ${y}`,
        loadFail      : 'Neizdevās ielādēt kalendāra datus. Sazinieties ar sistēmas administratoru.',
        gotoDate      : 'Doties uz datumu',
        timeRange     : 'Laika diapazons',
        noResources   : 'Nav resursu',
        calendar      : 'Kalendārs',
        toolbar       : 'Kalendāra rīkjosla',
        months        : 'Mēneši'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Turiet nospiestu CTRL, ja notikums ir atkārtojams'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Nav'} event${count === 1 ? '' : 'notikumu'}`,
        allDayEventCount : count => `${count || 'Nav'} visu dienu notikumu${count === 1 ? '' : 'i'}`
    },

    EventTip : {
        'Edit event' : 'Rediģēt notikumu',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Ietvert nedēļas nogales',
        weekends        : 'Nedēļas nogales',
        switcherMenu    : 'Skata pārslēgšanas izvēlne'
    },

    AgendaView : {
        Agenda : 'Dienaskārtība'
    },

    MonthView : {
        Month     : 'Mēnesis',
        monthUnit : 'mēn.'
    },

    MultiWeekView : {
        multiWeek : 'Vairākas nedēļas'
    },

    WeekView : {
        weekUnit : 'ned.'
    },

    YearView : {
        Year     : 'Gads',
        yearUnit : 'g.',
        noEvents : 'Nav notikumu'
    },

    YearPlanner : {
        yearPlanner      : 'Gada plānotājs',
        expandMonthRow   : 'Izvērst mēneša rindu',
        collapseMonthRow : 'Sakļaut mēneša rindu'
    },

    EventList : {
        List   : 'Saraksts',
        Start  : 'Sākums',
        Finish : 'Beigas',
        days   : count => `${count > 1 ? `${count} ` : ''}day${count === 1 ? '' : 's'}`
    },

    DayView : {
        Day                : 'Diena',
        dayUnit            : 'd.',
        daysUnit           : 'd.',
        expandAllDayRow    : 'Izvērst visu dienu sadaļu',
        collapseAllDayRow  : 'Sakļaut visu dienu sadaļu',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Nav atbilstošu datumu'
    },

    DayAgendaView : {
        dayAgenda : 'Dienas plāns'
    },

    DayResourceView : {
        dayResourceView : 'Dienas resursi'
    },

    MonthGrid : {
        monthGrid : 'Mēneša tīkls'
    },

    Sidebar : {
        selectDate      : 'Izvēlieties kalendāra datumu',
        matchEvents     : 'Spēles notikumi',
        filterEvents    : 'Filtrēt notikumus pēc notikuma nosaukuma',
        filterResources : 'Filtrēt notikumus pēc izvēlētā resursa'
    },

    WeekExpander : {
        expandTip   : 'Noklikšķinot izvērsiet rindu',
        collapseTip : 'Noklikšķinot sakļaujiet rindu'
    },

    keyboardActions : {
        title   : 'Tastatūras darbības',
        content : 'Rādīt palīdzības paneli : [?]\nFokusa režīma izvēles poga : [Home]\nMainīt skatu : [1] līdz [9] vai pirmo izvēles pogas teksta burtu\nNākamais laika posms : [n]\nIepriekšējais laika posms : [p]\nDoties uz šodienu : [t]\nPārvietoties uz datumu : [g]\nDoties uz pašreizējās dienas šūnu : [CTRL]+[d]\nPārvietoties starp notikumiem : [TAB]\nFokusēt sānu joslas notikumu filtra ievadi : [/]\nIzveidot jaunu notikumu (fokusēts uz dienas šūnu) : [ENTER]\nDzēst fokusēto notikumu : [DELETE]/[BACKSPACE]\nRediģēt fokusēto notikumu : [ENTER]\nIzsaukt konteksta izvēlni uz notikuma vai šūnas : [SHIFT+F10]/[SPACE]\nFokusēt no notikuma uz aptverošo šūnu : [ESCAPE]\nPārvietošanās starp šūnām : [↑]/[↓]/[←]/[→]\nAktivizēt diapazona izvēlni (Agenda skatā) : [CTRL]+[r]\nIzgriezt, kopēt, ielīmēt notikumus : [CTRL]+[x]/[c]/[v]\nTuvināt/tālināt tikai DayView : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
