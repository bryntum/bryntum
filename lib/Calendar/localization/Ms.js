import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Ms.js';

const locale = {

    localeName : 'Ms',
    localeDesc : 'Melayu',
    localeCode : 'ms',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalendar',
        'All day' : 'Sepanjang hari',
        day       : 'Hari',
        week      : 'Minggu',
        month     : 'Bulan',
        year      : 'Tahun',
        decade    : 'Dekad'
    },

    EventMenu : {
        duplicateEvent : 'Duplikat peristiwa',
        copy           : 'salin'
    },

    Calendar : {
        toggleSidebar : 'Togol keterlihatan sidebar',
        Today         : 'Hari ini',
        Tomorrow      : 'Esok',
        next          : range => `Berikutnya ${range}`,
        previous      : range => `Sebelumnya ${range}`,
        plusMore      : value => `+${value} lagi`,
        moreEvents    : value => `${value} acara lagi`,
        allDay        : 'Sepanjang hari',
        endsOn        : d => `Berakhir ${d}`,
        weekOfYear    : ([y, w]) => `Minggu ${w}, ${y}`,
        loadFail      : 'Pemuatan data kalendar gagal. Sila hubungi pentadbir sistem anda',
        gotoDate      : 'Pergi ke tarikh',
        timeRange     : 'Julat masa',
        noResources   : 'Tiada sumber',
        calendar      : 'Kalendar',
        toolbar       : 'Bar alat Kalendar',
        months        : 'Bulan'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Tahan CTRL untuk peristiwa berulang'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Jumlah'} peristiwa`,
        allDayEventCount : count => `${count || 'Tiada'} acara sepanjang hari${count === 1 ? '' : ''}`
    },

    EventTip : {
        'Edit event' : 'Ubah peristiwa',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Termasuk hujung minggu',
        weekends        : 'Hujung minggu',
        switcherMenu    : 'Menu penukar paparan'
    },

    AgendaView : {
        Agenda : 'Agenda'
    },

    MonthView : {
        Month     : 'Bulan',
        monthUnit : 'bulan'
    },

    MultiWeekView : {
        multiWeek : 'Beberapa minggu'
    },

    WeekView : {
        weekUnit : 'minggu'
    },

    YearView : {
        Year     : 'Tahun',
        yearUnit : 'tahun',
        noEvents : 'Tiada acara'
    },

    YearPlanner : {
        yearPlanner      : 'Perancang Tahun',
        expandMonthRow   : 'Kembangkan baris bulan',
        collapseMonthRow : 'Runtuhkan baris bulan'
    },

    EventList : {
        List   : 'Senarai',
        Start  : 'Mula',
        Finish : 'Selesai',
        days   : count => `${count > 1 ? `${count} ` : ''}hari`
    },

    DayView : {
        Day                : 'Hari',
        dayUnit            : 'hari',
        daysUnit           : 'hari',
        expandAllDayRow    : 'Kembangkan bahagian sepanjang hari',
        collapseAllDayRow  : 'Kecilkan bahagian sepanjang hari',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Tiada tarikh yang sepadan'
    },

    DayAgendaView : {
        dayAgenda : 'Agenda Harian'
    },

    DayResourceView : {
        dayResourceView : 'Sumber harian'
    },

    MonthGrid : {
        monthGrid : 'Grid bulan'
    },

    Sidebar : {
        selectDate      : 'Pilih tarikh kalendar',
        matchEvents     : 'Peristiwa perlawanan',
        filterEvents    : 'Tapis peristiwa mengikut nama peristiwa',
        filterResources : 'Tapis peristiwa mengikut sumber yang dipilih'
    },

    WeekExpander : {
        expandTip   : 'Klik untuk kembangkan baris',
        collapseTip : 'Klik untuk kecilkan baris'
    },

    keyboardActions : {
        title   : 'Tindakan papan kekunci',
        content : 'Tunjukkan panel bantuan : [?]\nButang pemilihan mod fokus : [Home]\nTukar paparan : [1] hingga [9] atau huruf pertama teks butang pemilih\nJangka masa seterusnya : [n]\nJangka masa sebelumnya : [p]\nPergi ke hari ini : [t]\nNavigasi ke tarikh : [g]\nPergi ke sel hari semasa : [CTRL]+[d]\nNavigasi antara acara : [TAB]\nFokus input penapis acara bar sisi : [/]\nBuat acara baru (fokus pada sel hari) : [ENTER]\nPadamkan acara yang difokuskan : [DELETE]/[BACKSPACE]\nEdit acara yang difokuskan : [ENTER]\nPanggil menu konteks pada acara atau sel : [SHIFT+F10]/[SPACE]\nFokus dari acara ke sel yang melingkungi : [ESCAPE]\nNavigasi sel ke sel : [↑]/[↓]/[←]/[→]\nAktifkan menu julat (pada paparan Agenda) : [CTRL]+[r]\nPotong, salin, tampal acara : [CTRL]+[x]/[c]/[v]\nZum masuk/keluar hanya pada DayView : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
