import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Id',
    localeDesc : 'Bahasa Indonesia',
    localeCode : 'id',
    localeRtl  : false,

    Object : {
        Yes      : 'Ya',
        No       : 'Tidak',
        Cancel   : 'Batal',
        Ok       : 'OK',
        Week     : 'Minggu',
        None     : 'Tidak ada',
        previous : 'Sebelumnya',
        next     : 'Berikutnya',
        to       : 'ke',
        at       : 'pada',
        on       : 'di',
        editing  : what => `Mengedit ${what}`,
        settings : 'Pengaturan',
        close    : 'Tutup',
        go       : 'Pergi',
        save     : 'Simpan',
        cancel   : 'Batal',
        revert   : 'Batalkan perubahan',
        collapse : 'Ciutkan',
        expand   : 'Perluas',
        today    : 'Hari Ini',
        andNMore : n => `dan ${n} lagi`
    },

    AIBase : {
        delayStatusTexts : [
            'Menunggu',
            'Menunggu ...',
            'Masih menunggu',
            'Masih menunggu ...'
        ],
        autoStartDialogMessage        : 'Apakah Anda ingin mengaktifkan suara AI?',
        voiceActivationToast          : phrase => `Aktivasi suara diaktifkan, gunakan frasa "${phrase}" untuk memulai percakapan`,
        voiceControlNotSupportedToast : 'Kontrol suara tidak didukung pada perangkat ini',
        voiceControlErrorToast        : 'Kontrol suara tidak dapat dimulai pada perangkat Anda',
        voiceControlSilenceToast      : phrase => `Percakapan suara AI berakhir karena diam. Gunakan frasa ${phrase} untuk memulai kembali percakapan`,
        noAudioDetected               : 'Tidak ada audio terdeteksi, silakan coba lagi',
        transcriptionErrorToast       : 'Transkripsi gagal, silakan coba lagi',
        playbackErrorToast            : 'Pemutaran audio gagal, silakan periksa perangkat output audio Anda',
        failed                        : '(gagal)',
        awaitingConfirmation          : 'Menunggu konfirmasi',
        timeoutToast                  : 'Pesan habis waktu',
        readingStatusText             : modelName => `Membaca ${modelName}s`,
        updatingStatusText            : modelName => `Memperbarui ${modelName}s`,
        removingStatusText            : modelName => `Menghapus ${modelName}s`,
        addingStatusText              : modelName => `Menambahkan ${modelName}`,
        filteringStatusText           : modelName => `Memfilter ${modelName}s`,
        thinkingStatusText            : 'Berpikir',
        processingStatusText          : 'Memproses'
    },

    AISettingsPanel : {
        highlight               : 'Sorot',
        verbosity               : 'Verbositas',
        voiceActivation         : 'Aktivasi Suara',
        enableVoiceActivation   : 'Aktifkan Aktivasi Suara',
        voiceOnly               : 'Hanya Suara',
        autostart               : 'Mulai Otomatis',
        dataChangeConfirmations : 'Konfirmasi Perubahan Data',
        add                     : 'Tambah',
        remove                  : 'Hapus',
        update                  : 'Perbarui',
        planning                : 'Perencanaan',
        enablePlanning          : 'Aktifkan perencanaan',
        aiModel                 : 'Model AI',
        timeline                : 'Linimasa',
        'in-view'               : 'Dalam tampilan',
        all                     : 'Semua',
        timeRangeContext        : 'Konteks rentang waktu'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI sedang berbicara',
        recordingTooltip      : 'Merekam',
        waitingTooltip        : 'AI sedang berpikir',
        startRecordingTooltip : 'Klik untuk memulai',
        stopRecordingTooltip  : 'Klik untuk berhenti',
        inactiveTooltip       : 'Tidak merekam',
        openChatTooltip       : 'Klik kanan untuk membuka obrolan'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Ketik pesan',
        noConnectionTooltip     : 'Tidak ada koneksi terdeteksi, klik untuk mencoba lagi',
        undone                  : 'dibatalkan',
        aborted                 : '(dibatalkan)',
        readAloudTooltip        : 'Baca pesan dengan suara keras',
        confidenceTooltip       : confidence => `Kepercayaan: ${confidence}%`,
        undoTooltip             : 'Batalkan perubahan data',
        redoTooltip             : 'Ulangi perubahan data',
        thumbsUp                : 'Jempol ke atas',
        thumbsDown              : 'Jempol ke bawah',
        feedbackToast           : 'Terima kasih atas umpan balik Anda!',
        clearChat               : 'Bersihkan Obrolan',
        closeChat               : 'Tutup obrolan',
        settings                : 'Pengaturan',
        closeSettings           : 'Tutup Pengaturan'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Pilih tepat ${min}`,
        tooFewOptionsSelected     : min => `Pilih setidaknya ${min}`,
        tooManyOptionsSelected    : max => `Pilih tidak lebih dari ${max}`
    },

    CodeEditor : {
        apply        : 'Terapkan',
        autoApply    : 'Terapkan otomatis',
        downloadCode : 'Unduh kode'
    },

    ColorPicker : {
        noColor : 'Tidak ada warna'
    },

    Combo : {
        noResults          : 'Tidak ada hasil',
        recordNotCommitted : 'Data tidak dapat ditambahkan',
        addNewValue        : value => `Tambahkan ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Sorot',
        preview         : 'Pratinjau',
        approve         : 'Setujui',
        reject          : 'Tolak',
        confirmAdd      : 'Konfirmasi penambahan:',
        confirmUpdate   : 'Konfirmasi pembaruan:',
        confirmRemove   : 'Konfirmasi penghapusan:',
        confirmCopy     : 'Konfirmasi penyalinan',
        confirmAssign   : 'Konfirmasi penugasan',
        confirmReassign : 'Konfirmasi penugasan ulang',
        confirmUnassign : 'Konfirmasi pembatalan penugasan',
        confirmLink     : 'Konfirmasi tautan',
        confirmUnlink   : 'Konfirmasi pemutusan tautan'
    },

    FilePicker : {
        file : 'File'
    },

    Field : {
        badInput              : 'Nilai bidang tidak valid',
        patternMismatch       : 'Nilai harus cocok dengan pola tertentu',
        rangeOverflow         : value => `Nilai harus kurang dari atau sama dengan ${value.max}`,
        rangeUnderflow        : value => `Nilai harus lebih besar atau sama dengan ${value.min}`,
        stepMismatch          : 'Nilai harus cocok dengan langkah',
        tooLong               : 'Nilai harus lebih singkat',
        tooShort              : 'Nilai harus lebih panjang',
        typeMismatch          : 'Nilai harus dalam format khusus',
        valueMissing          : 'Bidang ini wajib diisi',
        invalidValue          : 'Nilai bidang tidak valid',
        minimumValueViolation : 'Pelanggaran nilai minimum',
        maximumValueViolation : 'Pelanggaran nilai maksimum',
        fieldRequired         : 'Bidang ini wajib diisi',
        validateFilter        : 'Nilai harus dipilih dari daftar'
    },

    DateField : {
        invalidDate : format => 'Input tanggal tidak valid, format yang diharapkan adalah ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Buka tahun sebelumnya',
        gotoPrevMonth : 'Buka bulan sebelumnya',
        gotoNextMonth : 'Buka bulan berikutnya',
        gotoNextYear  : 'Buka tahun berikutnya',
        navigation    : 'Navigasi pemilih tanggal'
    },

    Hint : {
        dontShowAgain : 'Jangan tampilkan lagi'
    },

    NumberFormat : {
        locale   : 'id',
        currency : 'IDR'
    },

    DurationField : {
        invalidUnit : 'Unit tidak valid'
    },

    TimeField : {
        invalidTime : 'Input waktu tidak valid'
    },

    TimePicker : {
        hour   : 'Jam',
        minute : 'Menit',
        second : 'Detik'
    },

    Tooltip : {
        loading : 'Memuat...'
    },

    List : {
        loading   : 'Memuat...',
        selectAll : 'Pilih Semua'
    },

    GridBase : {
        loadMask : 'Memuat...',
        syncMask : 'Menyimpan perubahan, mohon tunggu...'
    },

    PagingToolbar : {
        firstPage         : 'Buka halaman pertama',
        prevPage          : 'Buka halaman sebelumnya',
        page              : 'Halaman',
        nextPage          : 'Buka halaman berikutnya',
        lastPage          : 'Buka halaman terakhir',
        reload            : 'Muat ulang halaman saat ini',
        noRecords         : 'Tidak ada data untuk ditampilkan',
        pageCountTemplate : data => `dari ${data.lastPage}`,
        summaryTemplate   : data => `Menampilkan data ${data.start} - ${data.end} dari ${data.allCount}`
    },

    Popup : {
        close    : 'Tutup Sembulan',
        maximize : 'Maksimalkan'
    },

    Splitter : {
        ariaLabel      : 'Splitter, gunakan tombol panah untuk mengubah ukuran panel yang berdekatan',
        collapseLeft   : 'Ciutkan panel kiri',
        collapseRight  : 'Ciutkan panel kanan',
        collapseTop    : 'Ciutkan panel atas',
        collapseBottom : 'Ciutkan panel bawah',
        expandLeft     : 'Bentangkan panel kiri',
        expandRight    : 'Bentangkan panel kanan',
        expandTop      : 'Bentangkan panel atas',
        expandBottom   : 'Bentangkan panel bawah'
    },

    TabPanel : {
        containsInvalidFields : 'Tab mengandung kolom yang tidak valid'
    },

    Toolbar : {
        showOverflowingItems : 'Tampilkan item melimpah',
        scrollForMore        : 'Gulir untuk lebih'
    },

    UndoRedo : {
        Undo           : 'Urungkan',
        Redo           : 'Ulangi',
        UndoLastAction : 'Urungkan tindakan terakhir',
        RedoLastAction : 'Ulangi tindakan terakhir yang diurungkan',
        NoActions      : 'Tidak ada item dalam antrean yang diurungkan'
    },

    FieldFilterPicker : {
        equals                 : 'sama dengan',
        doesNotEqual           : 'tidak sama dengan',
        isEmpty                : 'kosong',
        isNotEmpty             : 'tidak kosong',
        contains               : 'berisi',
        doesNotContain         : 'tidak berisi',
        startsWith             : 'diawali dengan',
        endsWith               : 'diakhiri dengan',
        isOneOf                : 'salah satu dari',
        isNotOneOf             : 'bukan salah satu dari',
        isGreaterThan          : 'lebih besar dari',
        isLessThan             : 'lebih kecil dari',
        isGreaterThanOrEqualTo : 'lebih besar dari atau sama dengan',
        isLessThanOrEqualTo    : 'lebih kecil dari atau sama dengan',
        isBetween              : 'antara',
        isNotBetween           : 'bukan antara',
        isBefore               : 'adalah sebelum',
        isAfter                : 'adalah setelah',
        timeEquals             : 'waktu sama dengan',
        timeDoesNotEqual       : 'waktu tidak sama dengan',
        isToday                : 'adalah hari ini',
        isTomorrow             : 'adalah besok',
        isYesterday            : 'adalah kemarin',
        isThisWeek             : 'adalah minggu ini',
        isNextWeek             : 'adalah minggu depan',
        isLastWeek             : 'adalah minggu lalu',
        isThisMonth            : 'adalah bulan ini',
        isNextMonth            : 'adalah bulan depan',
        isLastMonth            : 'adalah bulan lalu',
        isThisYear             : 'adalah tahun ini',
        isNextYear             : 'adalah tahun depan',
        isLastYear             : 'adalah tahun lalu',
        isYearToDate           : 'adalah tahun berjalan',
        isTrue                 : 'benar',
        isFalse                : 'salah',
        selectAProperty        : 'Pilih properti',
        selectAnOperator       : 'Pilih operator',
        caseSensitive          : 'Peka huruf besar/kecil',
        and                    : 'dan',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Pilih nilai',
        selectOneOrMoreValues  : 'Pilih satu nilai atau lebih',
        enterAValue            : 'Masukkan nilai',
        enterANumber           : 'Masukkan angka',
        selectADate            : 'Pilih tanggal',
        selectATime            : 'Pilih waktu'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Tambahkan filter',
        applyCond : applied => applied ? 'Lewati filter (saat ini diterapkan)' : 'Terapkan filter (saat ini dilewati)'
    },

    DateHelper : {
        locale         : 'id',
        weekStartDay   : 1,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : 'milidetik', plural : 'md', abbrev : 'md' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'detik', plural : 'detik', abbrev : 'dtk' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'menit', plural : 'menit', abbrev : 'mnt' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'jam', plural : 'jam', abbrev : 'j' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'hari', plural : 'hari', abbrev : 'h' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'minggu', plural : 'minggu', abbrev : 'm' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'bulan', plural : 'bulan', abbrev : 'bln' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'triwulan', plural : 'triwulan', abbrev : 'tw' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'tahun', plural : 'tahun', abbrev : 'thn' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'dekade', plural : 'dekade', abbrev : 'dek' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['md'],
            [],
            ['d', 'dtk'],
            [],
            ['m', 'mnt'],
            [],
            ['j', 'j'],
            [],
            ['h'],
            [],
            ['m', 'minggu'],
            [],
            ['b', 'bln', 'bulan'],
            [],
            ['tw', 'tri', 'triwulan'],
            [],
            ['t', 'thn'],
            [],
            ['dek'],
            []
        ],
        parsers : {
            L   : 'DD/MM/YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number,
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}an`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
