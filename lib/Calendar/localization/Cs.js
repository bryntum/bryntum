import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Cs.js';

const locale = {

    localeName : 'Cs',
    localeDesc : 'Česky',
    localeCode : 'cs',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalendář',
        'All day' : 'Celý den',
        day       : 'Den',
        week      : 'Týden',
        month     : 'Měsíc',
        year      : 'Rok',
        decade    : 'Desetiletí'
    },

    EventMenu : {
        duplicateEvent : 'Duplikovat událost',
        copy           : 'kopírovat'
    },

    Calendar : {
        toggleSidebar : 'Přepnout viditelnost postranního panelu',
        Today         : 'Dnes',
        Tomorrow      : 'Zítra',
        next          : range => `Další ${range}`,
        previous      : range => `Předchozí ${range}`,
        plusMore      : value => `+${value} další`,
        moreEvents    : value => `${value} další události`,
        allDay        : 'Celý den',
        endsOn        : d => `Končí ${d}`,
        weekOfYear    : ([y, w]) => `Týden ${w}, ${y}`,
        loadFail      : 'Načtení dat kalendáře se nezdařilo. Obraťte se na správce systému',
        gotoDate      : 'Přejít na datum',
        timeRange     : 'Časový rozsah',
        noResources   : 'Žádné zdroje',
        calendar      : 'Kalendář',
        toolbar       : 'Panel nástrojů kalendáře',
        months        : 'Měsíce'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Při opakující se události podržte CTRL'
    },

    CalendarMixin : {
        eventCount : count => {
            if (!count) {
                return 'Žádná událost';
            }
            else {
                const lastDigit = count[count.length - 1];
                const suffix = { 1 : '', 2 : 'i', 3 : 'i', 4 : 'i' }[lastDigit] || 'í';

                return count + ' událost' + suffix;
            }
        },
        allDayEventCount : count => {
            if (!count) {
                return 'Žádná celodenní událost';
            }
            else {
                const lastDigit = count[count.length - 1];
                const suffix = { 1 : '', 2 : 'i', 3 : 'i', 4 : 'i' }[lastDigit] || 'í';

                return count + ' celodenní událost' + suffix;
            }
        }
    },

    EventTip : {
        'Edit event' : 'Upravit událost',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Zahrnout víkendy',
        weekends        : 'Víkendy',
        switcherMenu    : 'Menu přepínače zobrazení'
    },

    AgendaView : {
        Agenda : 'Program'
    },

    MonthView : {
        Month     : 'Měsíc',
        monthUnit : 'měsíc'
    },

    MultiWeekView : {
        multiWeek : 'Více týdnů'
    },

    WeekView : {
        weekUnit : 'týden'
    },

    YearView : {
        Year     : 'Rok',
        yearUnit : 'rok',
        noEvents : 'Žádné události'
    },

    YearPlanner : {
        yearPlanner      : 'Roční plánovač',
        expandMonthRow   : 'Rozbalit řádek měsíce',
        collapseMonthRow : 'Sbalit řádek měsíce'
    },

    EventList : {
        List   : 'Seznam',
        Start  : 'Začátek',
        Finish : 'Konec',
        days   : count => `${count > 1 ? `${count} ` : ''}den${count === 1 ? '' : 'ů'}`
    },

    DayView : {
        Day                : 'Den',
        dayUnit            : 'den',
        daysUnit           : 'dny',
        expandAllDayRow    : 'Rozšířit výběr na všechny dny',
        collapseAllDayRow  : 'Sloučit výběr na všechny dny',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Žádné odpovídající data'
    },

    DayAgendaView : {
        dayAgenda : 'Denní program'
    },

    DayResourceView : {
        dayResourceView : 'Denní zdroje'
    },

    MonthGrid : {
        monthGrid : 'Měsíční mřížka'
    },

    Sidebar : {
        selectDate      : 'Vyberte datum kalendáře',
        matchEvents     : 'Události zápasu',
        filterEvents    : 'Filtrovat události podle názvu události',
        filterResources : 'Filtrovat události podle vybraného zdroje'
    },

    WeekExpander : {
        expandTip   : 'Kliknutím rozšíříte řádek',
        collapseTip : 'Kliknutím sloučíte řádek'
    },

    keyboardActions : {
        title   : 'Akce klávesnice',
        content : 'Zobrazit panel nápovědy : [?]\nTlačítko výběru režimu zaměření : [Home]\nZměna zobrazení : [1] až [9] nebo první písmeno textu tlačítka výběru\nDalší časový úsek : [n]\nPředchozí časový úsek : [p]\nPřejít na dnešek : [t]\nNavigace na datum : [g]\nPřejít na buňku aktuálního dne : [CTRL]+[d]\nNavigace mezi událostmi : [TAB]\nZaměřit vstupní filtr událostí na postranním panelu : [/]\nVytvořit novou událost (zaměřeno na buňku dne) : [ENTER]\nSmazat zaměřenou událost : [DELETE]/[BACKSPACE]\nUpravit zaměřenou událost : [ENTER]\nVyvolat kontextové menu na události nebo buňce : [SHIFT+F10]/[SPACE]\nZaměřit z události na obklopující buňku : [ESCAPE]\nNavigace mezi buňkami : [↑]/[↓]/[←]/[→]\nAktivovat menu rozsahu (v zobrazení Agenda) : [CTRL]+[r]\nVyjmout, kopírovat, vložit události : [CTRL]+[x]/[c]/[v]\nPřiblížit/oddálit pouze zobrazení dne : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
