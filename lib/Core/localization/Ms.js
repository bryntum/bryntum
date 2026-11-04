import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Ms',
    localeDesc : 'Melayu',
    localeCode : 'ms',
    localeRtl  : false,

    Object : {
        Yes      : 'Ya',
        No       : 'Tidak',
        Cancel   : 'Batal',
        Ok       : 'OK',
        Week     : 'Minggu',
        None     : 'Tiada',
        previous : 'Sebelumnya',
        next     : 'Seterusnya',
        to       : 'hingga',
        at       : 'pada',
        on       : 'pada',
        editing  : what => `Menyunting ${what}`,
        settings : 'Tetapan',
        close    : 'Tutup',
        go       : 'Pergi',
        save     : 'Simpan',
        cancel   : 'Batal',
        revert   : 'Batal perubahan',
        collapse : 'Kecil',
        expand   : 'Kembang',
        today    : 'Hari ini',
        andNMore : n => `dan ${n} lagi`
    },

    AIBase : {
        delayStatusTexts : [
            'Menunggu',
            'Menunggu ...',
            'Masih menunggu',
            'Masih menunggu ...'
        ],
        autoStartDialogMessage        : 'Adakah anda ingin mengaktifkan pengaktifan suara AI?',
        voiceActivationToast          : phrase => `Pengaktifan suara diaktifkan, gunakan frasa "${phrase}" untuk memulakan perbualan`,
        voiceControlNotSupportedToast : 'Kawalan suara tidak disokong pada peranti ini',
        voiceControlErrorToast        : 'Kawalan suara tidak dapat dimulakan pada peranti anda',
        voiceControlSilenceToast      : phrase => `Perbualan suara AI berakhir kerana senyap. Gunakan frasa ${phrase} untuk memulakan semula perbualan`,
        noAudioDetected               : 'Tiada audio dikesan, sila cuba lagi',
        transcriptionErrorToast       : 'Transkripsi gagal, sila cuba lagi',
        playbackErrorToast            : 'Main balik audio gagal, sila periksa peranti output audio anda',
        failed                        : '(gagal)',
        awaitingConfirmation          : 'Menunggu pengesahan',
        timeoutToast                  : 'Mesej tamat masa',
        readingStatusText             : modelName => `Membaca ${modelName}s`,
        updatingStatusText            : modelName => `Mengemas kini ${modelName}s`,
        removingStatusText            : modelName => `Mengalih keluar ${modelName}s`,
        addingStatusText              : modelName => `Menambah ${modelName}`,
        filteringStatusText           : modelName => `Menapis ${modelName}s`,
        thinkingStatusText            : 'Berfikir',
        processingStatusText          : 'Memproses'
    },

    AISettingsPanel : {
        highlight               : 'Sorotan',
        verbosity               : 'Kebisingan',
        voiceActivation         : 'Pengaktifan Suara',
        enableVoiceActivation   : 'Aktifkan Pengaktifan Suara',
        voiceOnly               : 'Hanya Suara',
        autostart               : 'Mula Automatik',
        dataChangeConfirmations : 'Pengesahan Perubahan Data',
        add                     : 'Tambah',
        remove                  : 'Buang',
        update                  : 'Kemas kini',
        planning                : 'Perancangan',
        enablePlanning          : 'Aktifkan perancangan',
        aiModel                 : 'Model AI',
        timeline                : 'Garis Masa',
        'in-view'               : 'Dalam paparan',
        all                     : 'Semua',
        timeRangeContext        : 'Konteks julat masa'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI sedang bercakap',
        recordingTooltip      : 'Merakam',
        waitingTooltip        : 'AI sedang berfikir',
        startRecordingTooltip : 'Klik untuk mula',
        stopRecordingTooltip  : 'Klik untuk berhenti',
        inactiveTooltip       : 'Tidak merakam',
        openChatTooltip       : 'Klik kanan untuk membuka sembang'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Taipkan mesej',
        noConnectionTooltip     : 'Tiada sambungan dikesan, klik untuk cuba lagi',
        undone                  : 'dibatalkan',
        aborted                 : '(dibatalkan)',
        readAloudTooltip        : 'Baca mesej dengan kuat',
        confidenceTooltip       : confidence => `Keyakinan: ${confidence}%`,
        undoTooltip             : 'Batalkan perubahan data',
        redoTooltip             : 'Ulangi perubahan data',
        thumbsUp                : 'Suka',
        thumbsDown              : 'Tidak suka',
        feedbackToast           : 'Terima kasih atas maklum balas anda!',
        clearChat               : 'Kosongkan sembang',
        closeChat               : 'Tutup sembang',
        settings                : 'Tetapan',
        closeSettings           : 'Tutup tetapan'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Pilih tepat ${min}`,
        tooFewOptionsSelected     : min => `Pilih sekurang-kurangnya ${min}`,
        tooManyOptionsSelected    : max => `Pilih tidak lebih daripada ${max}`
    },

    CodeEditor : {
        apply        : 'Terapkan',
        autoApply    : 'Terapkan secara automatik',
        downloadCode : 'Muat turun kod'
    },

    ColorPicker : {
        noColor : 'Tiada warna'
    },

    Combo : {
        noResults          : 'Tiada keputusan',
        recordNotCommitted : 'Rekod tidak boleh ditambah',
        addNewValue        : value => `Tambah ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Sorotan',
        preview         : 'Pratonton',
        approve         : 'Luluskan',
        reject          : 'Tolak',
        confirmAdd      : 'Sahkan tambah:',
        confirmUpdate   : 'Sahkan kemas kini:',
        confirmRemove   : 'Sahkan keluarkan:',
        confirmCopy     : 'Sahkan salin',
        confirmAssign   : 'Sahkan tugasan',
        confirmReassign : 'Sahkan tugasan semula',
        confirmUnassign : 'Sahkan pembatalan tugasan',
        confirmLink     : 'Sahkan pautan',
        confirmUnlink   : 'Sahkan nyahpaut'
    },

    FilePicker : {
        file : 'Fail'
    },

    Field : {
        badInput              : 'Nilai medan tak sah',
        patternMismatch       : 'Nilai harus sepadan dengan corak tertentu',
        rangeOverflow         : value => `Nilai mestilah kurang daripada atau sama dengan ${value.max}`,
        rangeUnderflow        : value => `Nilai mestilah lebih besar daripada atau sama dengan ${value.max}`,
        stepMismatch          : 'Nilai harus sesuai dengan langkah',
        tooLong               : 'Nilai harus lebih pendek',
        tooShort              : 'Nilai harus lebih panjang',
        typeMismatch          : 'Nilai diperlukan dalam format khas',
        valueMissing          : 'Medan ini diperlukan',
        invalidValue          : 'Nilai medan tak sah',
        minimumValueViolation : 'Pelanggaran nilai minimum',
        maximumValueViolation : 'Pelanggaran nilai maksimum',
        fieldRequired         : 'Medan ini diperlukan',
        validateFilter        : 'Nilai mesti dipilih daripada senarai'
    },

    DateField : {
        invalidDate : format => 'Input tarikh tidak sah, format yang dijangka ialah ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Pergi ke tahun sebelumnya',
        gotoPrevMonth : 'Pergi ke bulan sebelumnya',
        gotoNextMonth : 'Pergi ke bulan berikutnya',
        gotoNextYear  : 'Pergi ke tahun berikutnya',
        navigation    : 'Navigasi pemilih tarikh'
    },

    Hint : {
        dontShowAgain : 'Jangan tunjuk lagi'
    },

    NumberFormat : {
        locale   : 'ms',
        currency : 'MYR'
    },

    DurationField : {
        invalidUnit : 'Unit tak sah'
    },

    TimeField : {
        invalidTime : 'Input masa tak sah'
    },

    TimePicker : {
        hour   : 'Jam',
        minute : 'Minit',
        second : 'Saat'
    },

    Tooltip : {
        loading : 'Memuat...'
    },

    List : {
        loading   : 'Memuatkan...',
        selectAll : 'Pilih Semua'
    },

    GridBase : {
        loadMask : 'Memuatkan...',
        syncMask : 'Menyimpan perubahan, sila tunggu...'
    },

    PagingToolbar : {
        firstPage         : 'Pergi ke halaman pertama',
        prevPage          : 'Pergi ke halaman sebelumnya',
        page              : 'Halaman',
        nextPage          : 'Pergi ke halaman berikutnya',
        lastPage          : 'Pergi ke halaman terakhir',
        reload            : 'Muat semula halaman semasa',
        noRecords         : 'Tiada rekod untuk dipaparkan',
        pageCountTemplate : data => `daripada ${data.lastPage}`,
        summaryTemplate   : data => `Memaparkan rekod ${data.start} - ${data.end} daripada ${data.allCount}`
    },

    Popup : {
        close    : 'Tutup Pop Timbul',
        maximize : 'Maksimumkan'
    },

    Splitter : {
        ariaLabel      : 'Splitter, gunakan kekunci anak panah untuk mengubah saiz panel yang berdekatan',
        collapseLeft   : 'Kuncupkan panel kiri',
        collapseRight  : 'Kuncupkan panel kanan',
        collapseTop    : 'Kuncupkan panel atas',
        collapseBottom : 'Kuncupkan panel bawah',
        expandLeft     : 'Kembangkan panel kiri',
        expandRight    : 'Kembangkan panel kanan',
        expandTop      : 'Kembangkan panel atas',
        expandBottom   : 'Kembangkan panel bawah'
    },

    TabPanel : {
        containsInvalidFields : 'Tab mengandungi medan tidak sah'
    },

    Toolbar : {
        showOverflowingItems : 'Tunjukkan item melimpah',
        scrollForMore        : 'Tatal untuk lebih'
    },

    UndoRedo : {
        Undo           : 'Buat Asal',
        Redo           : 'Buat Semula',
        UndoLastAction : 'Buat asal tindakan terakhir',
        RedoLastAction : 'Buat semula tindakan buat asal yang terakhir',
        NoActions      : 'Tiada item dalam baris gilir buat asal'
    },

    FieldFilterPicker : {
        equals                 : 'sama dengan',
        doesNotEqual           : 'tidak sama dengan',
        isEmpty                : 'kosong',
        isNotEmpty             : 'tidak kosong',
        contains               : 'mengandungi',
        doesNotContain         : 'tidak mengandungi',
        startsWith             : 'bermula dengan',
        endsWith               : 'berakhir dengan',
        isOneOf                : 'salah satu daripada',
        isNotOneOf             : 'bukan salah satu daripada',
        isGreaterThan          : 'lebih besar daripada',
        isLessThan             : 'kurang daripada',
        isGreaterThanOrEqualTo : 'lebih besar daripada atau sama dengan',
        isLessThanOrEqualTo    : 'kurang daripada atau sama dengan',
        isBetween              : 'antara',
        isNotBetween           : 'tidak antara',
        isBefore               : 'sebelum',
        isAfter                : 'selepas',
        timeEquals             : 'masa sama dengan',
        timeDoesNotEqual       : 'masa tidak sama dengan',
        isToday                : 'hari ini',
        isTomorrow             : 'esok',
        isYesterday            : 'semalam',
        isThisWeek             : 'minggu ini',
        isNextWeek             : 'minggu depan',
        isLastWeek             : 'minggu lepas',
        isThisMonth            : 'bulan ini',
        isNextMonth            : 'bulan depan',
        isLastMonth            : 'bulan lepas',
        isThisYear             : 'tahun ini',
        isNextYear             : 'tahun depan',
        isLastYear             : 'tahun lepas',
        isYearToDate           : 'tahun hingga kini',
        isTrue                 : 'betul',
        isFalse                : 'salah',
        selectAProperty        : 'Pilih properti',
        selectAnOperator       : 'Pilih operator',
        caseSensitive          : 'Sensitif huruf',
        and                    : 'dan',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Pilih nilai',
        selectOneOrMoreValues  : 'Pilih satu atau lebih nilai',
        enterAValue            : 'Masukkan nilai',
        enterANumber           : 'Masukka nombor',
        selectADate            : 'Pilih tarikh',
        selectATime            : 'Pilih masa'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Tambah penapis',
        applyCond : applied => applied ? 'Langkau penapis (sedang digunakan)' : 'Guna penapis (sedang dilangkau)'
    },

    DateHelper : {
        locale         : 'ms',
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
            { single : 'milisaat', plural : 'ms', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'saat', plural : 'saat', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minit', plural : 'minit', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'jam', plural : 'jam', abbrev : 'j' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'hari', plural : 'hari', abbrev : 'h' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'minggu', plural : 'minggu', abbrev : 'm' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'bulan', plural : 'bulan', abbrev : 'bul' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'sukutahun', plural : 'sukutahun', abbrev : 'st' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'tahun', plural : 'tahun', abbrev : 'th' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'dekad', plural : 'dekad', abbrev : 'dek' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil'],
            [],
            ['s', 'saat'],
            [],
            ['m', 'min'],
            [],
            ['j', 'jam'],
            [],
            ['h'],
            [],
            ['m', 'mg'],
            [],
            ['b', 'bul', 'bln'],
            [],
            ['st', 'suku', 'skt'],
            [],
            ['t', 'th'],
            [],
            ['dek'],
            []
        ],
        parsers : {
            L   : 'DD-MM-YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => 'ke-' + number,
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}an`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
