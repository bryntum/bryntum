import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Ms.js';

const emptyString = new String();

const locale = {

    localeName : 'Ms',
    localeDesc : 'Melayu',
    localeCode : 'ms',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Cari',
        selectAll   : 'Pilih Semua',
        removeAll   : 'Buang Semua',
        filtersSet  : n => n === 1 ? `1 penapis ditetapkan` : `${n} penapis ditetapkan`,
        noItems     : 'Tiada hasil ditemui',
        placeholder : 'Tapis...',
        apply       : 'Terapkan'
    },

    ColumnPicker : {
        column          : 'Kolum',
        columnsMenu     : 'Kolum',
        hideColumn      : 'Sembunyi kolum',
        hideColumnShort : 'Sembunyi',
        newColumns      : 'Kolum baharu',
        allColumns      : 'Semua lajur',
        showName        : column => `Tunjukkan lajur${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Sembunyikan lajur${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Guna penapis',
        filter        : 'Penapis',
        editFilter    : 'Edit penapis',
        on            : 'Hidup',
        before        : 'Sebelum',
        after         : 'Selepas',
        equals        : 'Sama dengan',
        lessThan      : 'Kurang daripada',
        moreThan      : 'Lebih daripada',
        removeFilter  : 'Buang penapis',
        disableFilter : 'Nyahdaya penapis'
    },

    FilterBar : {
        enableFilterBar  : 'Tunjuk bar penapis',
        disableFilterBar : 'Sembunyi bar penapis'
    },

    Group : {
        group                : 'Kumpulan',
        groupAscending       : 'Kumpulan menaik',
        groupDescending      : 'Kumpulan menurun',
        groupAscendingShort  : 'Menaik',
        groupDescendingShort : 'Menurun',
        stopGrouping         : 'Henti mengumpulkan',
        stopGroupingShort    : 'Henti'
    },

    HeaderMenu : {
        moveBefore     : text => `Gerak sebelum "${text}"`,
        moveAfter      : text => `Gerak selepas "${text}"`,
        collapseColumn : 'Runtuh lajur',
        expandColumn   : 'Kembang lajur'
    },

    ColumnRename : {
        rename : 'Nama semula'
    },

    ColumnResize : {
        resizeColumn : 'Ubah saiz kolum',
        width        : 'Lebar',
        fitToData    : 'Muat ke data'
    },

    MergeCells : {
        mergeCells  : 'Gabung sel',
        menuTooltip : 'Gabungkan sel dengan nilai yang sama apabila diisih mengikut kolum ini'
    },

    Search : {
        searchForValue : 'Cari nilai'
    },

    Sort : {
        sort                   : 'Isih',
        sortAscending          : 'Isih menaik',
        sortDescending         : 'Isih menurun',
        multiSort              : 'Multi isih',
        removeSorter           : 'Buang pengisih',
        addSortAscending       : 'Tambah pengisih menaik',
        addSortDescending      : 'Tambah pengisih menurun',
        toggleSortAscending    : 'Tukar kepada menaik',
        toggleSortDescending   : 'Tukar kepada menurun',
        sortAscendingShort     : 'Menaik',
        sortDescendingShort    : 'Menurun',
        removeSorterShort      : 'Buang',
        addSortAscendingShort  : '+ Menaik',
        addSortDescendingShort : '+ Menurun'
    },

    Split : {
        split        : 'Bahagi',
        unsplit      : 'Tidak Dipisah',
        horizontally : 'Secara Menegak',
        vertically   : 'Secara Mendatar',
        both         : 'Kedua-duanya',
        top          : 'atas',
        bottom       : 'bawah',
        left         : 'kiri',
        right        : 'kanan'
    },

    LockRows : {
        lockRow   : 'Kunci baris',
        unlockRow : 'Buka kunci baris'
    },

    ActionColumn : {
        rowActions : 'Tindakan baris'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} kolum. ` : ''}SPACE untuk menu konteks${column.canSort ? ', ENTER untuk isih' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Widget baris'
    },

    Checkbox : {
        toggleRowSelect : 'Togel pemilihan baris',
        toggleSelection : 'Togel pemilihan set data keseluruhan',
        toggleName      : column => `Togol ${column.text || 'nilai'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? ` penilaian : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Nombor baris'
    },

    GridBase : {
        loadFailedMessage  : 'Pemuatan data gagal!',
        syncFailedMessage  : 'Sinkronisasi data gagal!',
        unspecifiedFailure : 'Kegagalan tak dinyata',
        networkFailure     : 'Ralat rangkaian',
        parseFailure       : 'Gagal menghuraikan respons pelayan',
        serverResponse     : 'Respons pelayan:',
        noRows             : 'Tiada rekod untuk dipaparkan',
        moveColumnLeft     : 'Gerak ke bahagian kiri',
        moveColumnRight    : 'Gerak ke bahagian kanan',
        moveColumnTo       : region => `Gerak kolum ke ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 baris sepadan dengan penapis` : `${n} baris sepadan dengan penapis`) : 'Tiada baris sepadan dengan penapis'
    },

    CellMenu : {
        removeRow : 'Hapus'
    },

    RowCopyPaste : {
        copyRecord  : 'Salin',
        cutRecord   : 'Potong',
        pasteRecord : 'Tampal',
        rows        : 'baris-baris',
        row         : 'baris'
    },

    CellCopyPaste : {
        copy  : 'Salin',
        cut   : 'Potong',
        paste : 'Tampal'
    },

    Charts : {
        chartDesigner : 'Pereka Carta',
        newChart      : 'Carta Baharu',
        download      : 'Muat Turun',
        settings      : 'Tetapan'
    },

    PdfExport : {
        'Waiting for response from server' : 'Menunggu respons daripada pelayan...',
        'Export failed'                    : 'Eksport gagal',
        'Server error'                     : 'Ralat pelayan',
        'Generating pages'                 : 'Menjana halaman...',
        'Click to abort'                   : 'Batal'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Tetapan eksport',
        export         : 'Eksport',
        printSettings  : 'Tetapan Cetakan',
        print          : 'Cetak',
        exporterType   : 'Kawal penomboran',
        cancel         : 'Batal',
        fileFormat     : 'Format fail',
        rows           : 'Baris',
        alignRows      : 'Jajarkan baris',
        columns        : 'Kolum',
        paperFormat    : 'Format kertas',
        orientation    : 'Orientasi',
        repeatHeader   : 'Pengepala ulang'
    },

    ExportRowsCombo : {
        all     : 'Semua baris',
        visible : 'Baris boleh lihat'
    },

    ExportOrientationCombo : {
        portrait  : 'Portret',
        landscape : 'Landskap'
    },

    SinglePageExporter : {
        singlepage : 'Halaman tunggal'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Halaman tunggal (tidak diskala)'
    },

    MultiPageExporter : {
        multipage     : 'Halaman pelbagai',
        exportingPage : ({ currentPage, totalPages }) => `Mengeksport halaman ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Halaman pelbagai (menegak)',
        exportingPage     : ({ currentPage, totalPages }) => `Mengeksport halaman ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Memuat',
        expand             : 'Kembang',
        collapse           : 'Kecil',
        columnDescription  : 'Togol butiran baris',
        expandedRowContent : 'Kandungan baris yang diperluas'
    },

    TreeGroup : {
        group                  : 'Kumpulkan mengikut',
        stopGrouping           : 'Berhenti mengumpulkan',
        stopGroupingThisColumn : 'Batalkan pengumpulan baris ini'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Operasi penapisan tidak berjaya, sila cuba lagi'
    },

    AIFilterField : {
        progressText : 'Menapis'
    },

    PinColumns : {
        pinColumn  : 'Pin lajur',
        unpin      : 'Tiada pin',
        pinToStart : 'Pin ke permulaan',
        pinToEnd   : 'Pin ke penghujung'
    }
};

export default LocaleHelper.publishLocale(locale);
