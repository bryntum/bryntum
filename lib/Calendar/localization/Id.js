import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Id.js';

const locale = {

    localeName : 'Id',
    localeDesc : 'Bahasa Indonesia',
    localeCode : 'id',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Kalender',
        'All day' : 'Sepanjang hari',
        day       : 'Hari',
        week      : 'Minggu',
        month     : 'Bulan',
        year      : 'Tahun',
        decade    : 'Dekade'
    },

    EventMenu : {
        duplicateEvent : 'Duplikasi acara',
        copy           : 'salin'
    },

    Calendar : {
        toggleSidebar : 'Alihkan visibilitas sidebar',
        Today         : 'Hari ini',
        Tomorrow      : 'Besok',
        next          : range => `${range} Berikutnya`,
        previous      : range => `${range} Sebelumnya`,
        plusMore      : value => `+${value} lagi`,
        moreEvents    : value => `${value} acara lainnya`,
        allDay        : 'Sepanjang hari',
        endsOn        : d => `Berakhir ${d}`,
        weekOfYear    : ([y, w]) => `Minggu ${w}, ${y}`,
        loadFail      : 'Pemuatan data kalender gagal. Harap hubungi administrator sistem Anda',
        gotoDate      : 'Pergi ke tanggal',
        timeRange     : 'Rentang waktu',
        noResources   : 'Tidak ada sumber daya',
        calendar      : 'Kalender',
        toolbar       : 'Toolbar kalender',
        months        : 'Bulan'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Tahan CTRL untuk acara rutin'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Tidak ada'} event`,
        allDayEventCount : count => `${count || 'Tidak ada'} acara sepanjang hari${count === 1 ? '' : 's'}`
    },

    EventTip : {
        'Edit event' : 'Edit acara',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Termasuk akhir pekan',
        weekends        : 'Akhir pekan',
        switcherMenu    : 'Menu pengalih tampilan'
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
        noEvents : 'Tidak ada acara'
    },

    YearPlanner : {
        yearPlanner      : 'Perencana Tahun',
        expandMonthRow   : 'Perluas baris bulan',
        collapseMonthRow : 'Ciutkan baris bulan'
    },

    EventList : {
        List   : 'Daftar',
        Start  : 'Mulai',
        Finish : 'Selesai',
        days   : count => `${count > 1 ? `${count} ` : ''}hari${count === 1 ? '' : 's'}`
    },

    DayView : {
        Day                : 'Hari',
        dayUnit            : 'hari',
        daysUnit           : 'hari',
        expandAllDayRow    : 'Luaskan bagian sepanjang hari',
        collapseAllDayRow  : 'Ciutkan bagian sepanjang hari',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Tidak ada tanggal yang cocok'
    },

    DayAgendaView : {
        dayAgenda : 'Agenda Harian'
    },

    DayResourceView : {
        dayResourceView : 'Sumber daya harian'
    },

    MonthGrid : {
        monthGrid : 'Grid bulan'
    },

    Sidebar : {
        selectDate      : 'Pilih tanggal kalender',
        matchEvents     : 'Acara pertandingan',
        filterEvents    : 'Saring acara berdasarkan nama acara',
        filterResources : 'Saring acara berdasarkan sumber daya yang dipilih'
    },

    WeekExpander : {
        expandTip   : 'Klik untuk memperluas baris',
        collapseTip : 'Klik untuk menciutkan baris'
    },

    keyboardActions : {
        title   : 'Aksi keyboard',
        content : 'Tampilkan panel bantuan : [?]\nTombol pemilihan mode fokus : [Home]\nUbah tampilan : [1] hingga [9] atau huruf pertama dari teks tombol pemilih\nRentang waktu berikutnya : [n]\nRentang waktu sebelumnya : [p]\nPergi ke hari ini : [t]\nNavigasi ke tanggal : [g]\nPergi ke sel hari saat ini : [CTRL]+[d]\nNavigasi antar acara : [TAB]\nFokus pada input filter acara di sidebar : [/]\nBuat acara baru (terfokus pada sel hari) : [ENTER]\nHapus acara yang terfokus : [DELETE]/[BACKSPACE]\nEdit acara yang terfokus : [ENTER]\nPanggil menu konteks pada acara atau sel : [SHIFT+F10]/[SPACE]\nFokus dari acara ke sel yang melingkupinya : [ESCAPE]\nNavigasi antar sel : [↑]/[↓]/[←]/[→]\nAktifkan menu rentang (pada tampilan Agenda) : [CTRL]+[r]\nPotong, salin, tempel acara : [CTRL]+[x]/[c]/[v]\nPerbesar/perkecil hanya Tampilan Hari : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
