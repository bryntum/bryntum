import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Tr.js';

const emptyString = new String();

const locale = {

    localeName : 'Tr',
    localeDesc : 'Türkçe',
    localeCode : 'tr',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Ara',
        selectAll   : 'Tümünü Seç',
        removeAll   : 'Tümünü Kaldır',
        filtersSet  : n => n === 1 ? `1 filtre ayarlandı` : `${n} filtre ayarlandı`,
        noItems     : 'Sonuç bulunamadı',
        placeholder : 'Filtre...',
        apply       : 'Uygula'
    },

    ColumnPicker : {
        column          : 'Sütun',
        columnsMenu     : 'Sütun menüsü',
        hideColumn      : 'Sütunu gizle',
        hideColumnShort : 'Gizle',
        newColumns      : 'Yeni sütunlar',
        allColumns      : 'Tüm sütunlar',
        showName        : column => `Sütunu göster${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Sütunu gizle${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Filtre uygula',
        filter        : 'Filtre',
        editFilter    : 'Filtre düzenle',
        on            : 'Açık',
        before        : 'Önce',
        after         : 'Sonra',
        equals        : 'Eşittir',
        lessThan      : 'den az',
        moreThan      : 'den çok',
        removeFilter  : 'Filtreyi kaldır',
        disableFilter : 'Filtreyi devre dışı bırak'
    },

    FilterBar : {
        enableFilterBar  : 'Filtre çubuğunu göster',
        disableFilterBar : 'Filtre çubuğunu gizle'
    },

    Group : {
        group                : 'Gruplandır',
        groupAscending       : 'Küçükten büyüğe doğru gruplandır',
        groupDescending      : 'Büyükten küçüğe doğru gruplandır',
        groupAscendingShort  : 'Küçükten büyüğe',
        groupDescendingShort : 'Büyükten küçüğe ',
        stopGrouping         : 'Gruplandırmayı durdur',
        stopGroupingShort    : 'Durdur'
    },

    HeaderMenu : {
        moveBefore     : text => `Önce taşı "${text}"`,
        moveAfter      : text => `Sonra taşı "${text}"`,
        collapseColumn : 'Sütunu daralt',
        expandColumn   : 'Sütunu genişlet'
    },

    ColumnRename : {
        rename : 'Yeniden adlandır'
    },

    ColumnResize : {
        resizeColumn : 'Sütunu yeniden boyutlandır',
        width        : 'Genişlik',
        fitToData    : 'Verilere sığdır'
    },

    MergeCells : {
        mergeCells  : 'Hücreleri birleştir',
        menuTooltip : 'Bu sütuna göre sıralandığında aynı değere sahip hücreleri birleştir'
    },

    Search : {
        searchForValue : 'Değer ara'
    },

    Sort : {
        sort                   : 'Sırala',
        sortAscending          : 'Küçükten büyüğe doğru sırala',
        sortDescending         : 'Büyükten küçüğe doğru sırala',
        multiSort              : 'Çoklu sırala',
        removeSorter           : 'Sıralayıcıyı kaldır',
        addSortAscending       : 'Küçükten büyüğe doğru sıralayıcı ekle',
        addSortDescending      : 'Büyükten küçüğe doğru sıralayıcı ekle',
        toggleSortAscending    : 'Küçükten büyüğe doğru değiştir',
        toggleSortDescending   : 'Büyükten küçüğe doğru değiştir',
        sortAscendingShort     : 'Küçükten büyüğe',
        sortDescendingShort    : 'Büyükten küçüğe',
        removeSorterShort      : 'Kaldır',
        addSortAscendingShort  : '+ Küçükten büyüğe',
        addSortDescendingShort : '+ Büyükten küçüğe'
    },

    Split : {
        split        : 'Bölünmüş',
        unsplit      : 'Bölünmemiş',
        horizontally : 'Yatay',
        vertically   : 'Dikey',
        both         : 'Her İkisi',
        top          : 'üst',
        bottom       : 'alt',
        left         : 'sol',
        right        : 'sağ'
    },

    LockRows : {
        lockRow   : 'Satırı Kilitle',
        unlockRow : 'Satır Kilidini Aç'
    },

    ActionColumn : {
        rowActions : 'Satır eylemleri'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} sütun. ` : ''}bağlam menüsü için SPACE’a dokunun${column.canSort ? `, sıralamak için ENTER’a bas` : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Satır bileşenleri'
    },

    Checkbox : {
        toggleRowSelect : 'Satır seçimini değiştir',
        toggleSelection : 'Tüm veri kümesinin seçimini değiştir',
        toggleName      : column => `Değiştir ${column.text || 'değer'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `değerlendirme : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Satır numarası'
    },

    GridBase : {
        loadFailedMessage  : 'Veri yükleme başarısız!',
        syncFailedMessage  : 'Veri senkronizasyonu başarısız!',
        unspecifiedFailure : 'Belirtilmemiş hata',
        networkFailure     : 'Ağ hatası',
        parseFailure       : 'Sunucu yanıtı ayrıştırma başarısız',
        serverResponse     : 'Sunucu yanıtı:',
        noRows             : 'Gösterilecek kayıt bulunamadı',
        moveColumnLeft     : 'Sol sütuna taşı',
        moveColumnRight    : 'Sağ sütuna taşı',
        moveColumnTo       : region => `Sütunu şuraya taşı ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 satır filtreyle eşleşiyor` : `${n} satır filtreyle eşleşiyor`) : 'Hiçbir satır filtreyle eşleşmiyor'
    },

    CellMenu : {
        removeRow : 'Satır sil'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopyala',
        cutRecord   : 'Kes',
        pasteRecord : 'Yapıştır',
        rows        : 'sıralar',
        row         : 'sıra'
    },

    CellCopyPaste : {
        copy  : 'Kopyala',
        cut   : 'Kes',
        paste : 'Yapıştır'
    },

    Charts : {
        chartDesigner : 'Grafik Tasarımcısı',
        newChart      : 'Yeni Grafik',
        download      : 'İndir',
        settings      : 'Ayarlar'
    },

    PdfExport : {
        'Waiting for response from server' : 'Sunucudan yanıt bekleniyor...',
        'Export failed'                    : 'Dışarı aktarma başarısız',
        'Server error'                     : 'Sunucu hatası',
        'Generating pages'                 : 'Sayfalar oluşturuluyor...',
        'Click to abort'                   : 'İptal et'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Dışarı aktarma ayarları',
        export         : 'Dışarı aktar',
        printSettings  : 'Yazdırma Ayarları',
        print          : 'Yazdır',
        exporterType   : 'Dışarı aktarma aracı türü',
        cancel         : 'İptal et',
        fileFormat     : 'Dosya biçimi',
        rows           : 'Satır',
        alignRows      : 'Satırları hizala',
        columns        : 'Sütun',
        paperFormat    : 'Sayfa formatı',
        orientation    : 'Yön',
        repeatHeader   : 'Başlığı tekrarla'
    },

    ExportRowsCombo : {
        all     : 'Tüm satırlar',
        visible : 'Görünür satırlar'
    },

    ExportOrientationCombo : {
        portrait  : 'Dikey',
        landscape : 'Yatay'
    },

    SinglePageExporter : {
        singlepage : 'Tek sayfa'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Tek sayfa (ölçeklenmemiş)'
    },

    MultiPageExporter : {
        multipage     : 'Birden fazla sayfa',
        exportingPage : ({ currentPage, totalPages }) => `Sayfa ${currentPage}/${totalPages} dışa aktarılıyor`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Birden fazla sayfa (dikey)',
        exportingPage     : ({ currentPage, totalPages }) => `Sayfa ${currentPage}/${totalPages} dışa aktarılıyor`
    },

    RowExpander : {
        loading            : 'Yükleniyor',
        expand             : 'Genişlet',
        collapse           : 'Daralt',
        columnDescription  : 'Satır detaylarını değiştir',
        expandedRowContent : 'Genişletilmiş satır içeriği'
    },

    TreeGroup : {
        group                  : 'Grupla',
        stopGrouping           : 'Gruplamayı Durdur',
        stopGroupingThisColumn : 'Bu Sütunun Gruplamasını Kaldır'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Filtre işlemi başarısız oldu, lütfen tekrar deneyin'
    },

    AIFilterField : {
        progressText : 'Filtreleniyor'
    },

    PinColumns : {
        pinColumn  : 'Sütunu sabitle',
        unpin      : 'Sabitleme yok',
        pinToStart : 'Başa sabitle',
        pinToEnd   : 'Sona sabitle'
    }
};

export default LocaleHelper.publishLocale(locale);
