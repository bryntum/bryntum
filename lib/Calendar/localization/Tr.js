import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Tr.js';

const locale = {

    localeName : 'Tr',
    localeDesc : 'Türkçe',
    localeCode : 'tr',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Takvim',
        'All day' : 'Tüm gün',
        day       : 'Gün',
        week      : 'Hafta',
        month     : 'Ay',
        year      : 'Yıl',
        decade    : 'On yıl'
    },

    EventMenu : {
        duplicateEvent : 'Yinelenen etkinlik',
        copy           : 'kopyala'
    },

    Calendar : {
        toggleSidebar : 'Yan çubuk görünürlüğünü değiştir',
        Today         : 'Bugün',
        Tomorrow      : 'Yarın',
        next          : range => `Sonraki ${range}`,
        previous      : range => `Önceki ${range}`,
        plusMore      : value => `+${value} daha fazla`,
        moreEvents    : value => `${value} daha fazla etkinlik`,
        allDay        : 'Tüm gün',
        endsOn        : d => `Bitiş tarihi ${d}`,
        weekOfYear    : ([y, w]) => `Hafta ${w}, ${y}`,
        loadFail      : 'Takvim verisi yüklemesi başarısız. Lütfen sistem yöneticiniz ile iletişime geçin.',
        gotoDate      : 'Tarihe git',
        timeRange     : 'Zaman aralığı',
        noResources   : 'Kaynak yok',
        calendar      : 'Takvim',
        toolbar       : 'Takvim araç çubuğu',
        months        : 'Aylar'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Yinelenen etkinlik için CTRL’ye basılı tutun'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Yok'} Etkinli${(count && count > 1) ? 'kleri' : 'ği'}`,
        allDayEventCount : count => `${count || 'Hiç'} tüm gün etkinlik${count === 1 ? '' : 'ler'}`
    },

    EventTip : {
        'Edit event' : 'Etkinliği düzenle',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Hafta sonlarını dahil et',
        weekends        : 'Hafta sonları',
        switcherMenu    : 'Görünüm değiştirici menüsü'
    },

    AgendaView : {
        Agenda : 'Ajanda'
    },

    MonthView : {
        Month     : 'Ay',
        monthUnit : 'ay'
    },

    MultiWeekView : {
        multiWeek : 'Çoklu hafta'
    },

    WeekView : {
        weekUnit : 'hafta'
    },

    YearView : {
        Year     : 'Yıl',
        yearUnit : 'yıl',
        noEvents : 'Etkinlik yok'
    },

    YearPlanner : {
        yearPlanner      : 'Yıl Planlayıcı',
        expandMonthRow   : 'Ay satırını genişlet',
        collapseMonthRow : 'Ay satırını daralt'
    },

    EventList : {
        List   : 'Liste',
        Start  : 'Başlangıç',
        Finish : 'Son',
        days   : count => `${count} gün`
    },

    DayView : {
        Day                : 'Gün',
        dayUnit            : 'gün',
        daysUnit           : 'gün',
        expandAllDayRow    : 'Tüm gün alanını genişlet',
        collapseAllDayRow  : 'Tüm gün alanını daralt',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Eşleşen tarih yok'
    },

    DayAgendaView : {
        dayAgenda : 'Günlük gündem'
    },

    DayResourceView : {
        dayResourceView : 'Günlük kaynaklar'
    },

    MonthGrid : {
        monthGrid : 'Ay tablosu'
    },

    Sidebar : {
        selectDate      : 'Takvim tarihini seçin',
        matchEvents     : 'Maç olayları',
        filterEvents    : 'Etkinlikleri etkinlik adına göre filtrele',
        filterResources : 'Etkinlikleri seçilen kaynağa göre filtrele'
    },

    WeekExpander : {
        expandTip   : 'Satırı genişletmek için tıkla',
        collapseTip : 'Satırı daraltmak için tıkla'
    },

    keyboardActions : {
        title   : 'Klavye eylemleri',
        content : 'Yardım panelini göster : [?]\nOdak modu seçim düğmesi : [Home]\nGörünümü değiştir : [1] ile [9] arasında veya seçim düğmesi metninin ilk harfi\nSonraki zaman aralığı : [n]\nÖnceki zaman aralığı : [p]\nBugüne git : [t]\nTarihe git : [g]\nBugünkü hücreye git : [CTRL]+[d]\nEtkinlikler arasında gezin : [TAB]\nKenar çubuğu etkinlik filtresi girişine odaklan : [/]\nYeni etkinlik oluştur (gün hücresine odaklanılmış) : [ENTER]\nOdaklanılan etkinliği sil : [DELETE]/[BACKSPACE]\nOdaklanılan etkinliği düzenle : [ENTER]\nEtkinlik veya hücrede bağlam menüsünü çağır : [SHIFT+F10]/[SPACE]\nEtkinlikten kapsayıcı hücreye odaklan : [ESCAPE]\nHücreden hücreye gezinme : [YÖN TUŞLARI]\nAralık menüsünü etkinleştir (Ajanda görünümünde) : [CTRL]+[r]\nEtkinlikleri kes, kopyala, yapıştır : [CTRL]+[x]/[c]/[v]\nSadece Gün Görünümünde yakınlaştır/uzaklaştır : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
