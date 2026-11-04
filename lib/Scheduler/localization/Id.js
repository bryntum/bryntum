import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Id.js';
import '../../Grid/localization/Id.js';

const locale = {

    localeName : 'Id',
    localeDesc : 'Bahasa Indonesia',
    localeCode : 'id',
    localeRtl  : false,

    Object : {
        newEvent    : 'Acara baru',
        information : 'Informasi',
        showDetails : 'Tampilkan detail'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' acara'
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Beralih kolom tata letak sumber daya. SPACE untuk menu konteks.'
    },

    Dependencies : {
        from    : 'Dari',
        to      : 'Hingga',
        valid   : 'Valid',
        invalid : 'Tidak valid'
    },

    DependencyType : {
        SS           : 'MM',
        SF           : 'MS',
        FS           : 'SM',
        FF           : 'SS',
        StartToStart : 'Mulai-hingga-Mulai',
        StartToEnd   : 'Mulai-hingga-Selesai',
        EndToStart   : 'Selesai-hingga-Mulai',
        EndToEnd     : 'Selesai-hingga-Selesai',
        short        : [
            'MM',
            'MS',
            'SM',
            'SS'
        ],
        long : [
            'Mulai-hingga-Mulai',
            'Mulai-hingga-Selesai',
            'Selesai-hingga-Selesai',
            'Selesai-hingga-Selesai'
        ]
    },

    DependencyEdit : {
        From              : 'Dari',
        To                : 'Hingga',
        Type              : 'Jenis',
        Lag               : 'Lag',
        color             : 'Warna',
        lineStyle         : 'Gaya garis',
        solid             : 'Penuh',
        dashed            : 'Putus-putus',
        dotted            : 'Bertitik',
        dashDot           : 'Putus-titik',
        longDash          : 'Garis panjang',
        'Edit dependency' : 'Edit dependensi',
        Save              : 'Simpan',
        Delete            : 'Hapus',
        Cancel            : 'Batalkan',
        StartToStart      : 'Mulai hingga Mulai',
        StartToEnd        : 'Mulai hingga Selesai',
        EndToStart        : 'Selesai hingga Mulai',
        EndToEnd          : 'Selesai hingga Selesai',
        Active            : 'Aktif'
    },

    EventEdit : {
        Name           : 'Nama',
        Resource       : 'Sumber daya',
        Start          : 'Mulai',
        startTime      : 'Waktu mulai',
        End            : 'Akhiri',
        endTime        : 'Waktu berakhir',
        Save           : 'Simpan',
        Delete         : 'Hapus',
        Cancel         : 'Batalkan',
        'Edit event'   : 'Edit acara',
        Repeat         : 'Ulangi',
        editRecurrence : 'Edit pengulangan'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Acara tumpang tindih dengan acara yang sudah ada untuk sumber daya ini',
        noDropOutsideTimeline   : 'Acara tidak dapat dibatalkan sepenuhnya di luar linimasa',
        duplicateAssignmentDrag : 'Acara tidak dapat ditetapkan ke sumber yang sama beberapa kali'
    },

    SchedulerBase : {
        'Add event'      : 'Tambahkan acara',
        'Delete event'   : 'Hapus acara',
        'Unassign event' : 'Batalkan penugasan acara',
        color            : 'Warna',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, dimulai pada ${startDate} ${eventRecord.duration > 0 ? `selama ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Perbesar',
        activeDateRange : 'Rentang tanggal',
        startText       : 'Tanggal mulai',
        endText         : 'Tanggal berakhir',
        todayText       : 'Hari ini'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Sumbu waktu menampilkan ${startDate} hingga ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Salin acara',
        cutEvent   : 'Potong acara',
        pasteEvent : 'Tempel acara'
    },

    EventFilter : {
        filterEvents : 'Filter tugas',
        byName       : 'Berdasarkan nama'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Tampilkan linimasa terkini'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Detik'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD/MM, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD/MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Hari'
        },
        day : {
            name : 'Hari/jam'
        },
        week : {
            name : 'Minggu/jam'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Minggu/hari'
        },
        dayAndMonth : {
            name : 'Bulan'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Minggu'
        },
        weekAndMonth : {
            name : 'Minggu-minggu'
        },
        weekAndDayLetter : {
            name : 'Minggu/hari kerja'
        },
        weekDateAndMonth : {
            name : 'Bulan/minggu'
        },
        monthAndYear : {
            name : 'Bulan'
        },
        year : {
            name : 'Tahun'
        },
        manyYears : {
            name : 'Beberapa tahun'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Anda menghapus acara',
        'delete-all-message'        : 'Anda ingin menghapus semua kejadian dari acara ini?',
        'delete-further-message'    : 'Anda ingin menghapus kejadian ini dan semua kejadian di masa mendatang terkait acara ini, atau hanya kejadian tertentu saja?',
        'delete-only-this-message'  : 'Apakah Anda ingin menghapus kejadian ini dari acara ini?',
        'delete-further-btn-text'   : 'Hapus Semua Acara Di Masa Mendatang',
        'delete-only-this-btn-text' : 'Hapus Hanya Acara Ini',
        'update-title'              : 'Anda mengganti acara rutin',
        'update-all-message'        : 'Anda ingin mengganti semua kejadian dari acara ini?',
        'update-further-message'    : 'Anda ingin hanya mengubah kejadian ini dari acara ini, atau ini dan kejadian di masa mendatang?',
        'update-only-this-message'  : 'Apakah Anda ingin mengubah kejadian ini dari acara ini?',
        'update-further-btn-text'   : 'Semua Kejadian di Masa Mendatang',
        'update-only-this-btn-text' : 'Hanya Acara Ini',
        Yes                         : 'Iya',
        Cancel                      : 'Batal',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' dan ',
        Daily                           : 'Harian',
        'Weekly on {1}'                 : ({ days }) => `Mingguan pada ${days}`,
        'Monthly on {1}'                : ({ days }) => `Bulanan pada ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Tahunan pada ${days} dari ${months}`,
        'Every {0} days'                : ({ interval }) => `Setiap ${interval} hari`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Setiap ${interval} minggu pada ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Setiap ${interval} bulan pada ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Setiap ${interval} tahun pada ${days} dari ${months}`,
        position1                       : 'pertama',
        position2                       : 'kedua',
        position3                       : 'ketiga',
        position4                       : 'keempat',
        position5                       : 'kelima',
        'position-1'                    : 'terakhir',
        day                             : 'hari',
        weekday                         : 'hari kerja',
        'weekend day'                   : 'akhir pekan',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Ulangi acara',
        Cancel              : 'Batalkan',
        Save                : 'Simpan',
        Frequency           : 'Frekuensi',
        Every               : 'Setiap',
        DAILYintervalUnit   : 'hari',
        WEEKLYintervalUnit  : 'minggu',
        MONTHLYintervalUnit : 'bulan',
        YEARLYintervalUnit  : 'tahun',
        Each                : 'Setiap',
        on                  : 'Pada',
        the                 : 'Pada',
        'On the'            : 'Pada',
        'End repeat'        : 'Akhiri pengulangan',
        'time(s)'           : 'kali',
        Days                : 'Hari -hari',
        Months              : 'Bulan'
    },

    RecurrenceDaysCombo : {
        day           : 'hari',
        weekday       : 'hari kerja',
        'weekend day' : 'akhir pekan'
    },

    RecurrencePositionsCombo : {
        position1    : 'pertama',
        position2    : 'kedua',
        position3    : 'ketiga',
        position4    : 'keempat',
        position5    : 'kelima',
        'position-1' : 'terakhir'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Tidak',
        After     : 'Setelah',
        'On date' : 'Pada tanggal'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Tidak berulang',
        Daily   : 'Harian',
        Weekly  : 'Mingguan',
        Monthly : 'Bulanan',
        Yearly  : 'Tahunan'
    },

    RecurrenceCombo : {
        None   : 'Tidak ada',
        Custom : 'Kustom...'
    },

    Summary : {
        'Summary for' : date => `Ringkasan untuk ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Jadwal lengkap',
        currentview  : 'Jadwal terlihat',
        daterange    : 'Rentang tanggal',
        completedata : 'Jadwal lengkap (untuk semua acara)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Rentang jadwal',
        'Export from'    : 'Dari',
        'Export to'      : 'Hingga'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Halaman tunggal'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Halaman tunggal (tidak diskalakan)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Beberapa halaman (vertikal)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Tidak ada sumber daya yang ditugaskan'
    },

    CrudManagerView : {
        serverResponseLabel : 'Respons server:'
    },

    DurationColumn : {
        Duration : 'Durasi'
    },

    EventClusteringBase : {
        unnamed         : 'Tidak Bernama',
        more            : count => `+ ${count} lainnya`,
        clusteredEvents : count => `${count} acara yang dikelompokkan`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} rentang yang dikelompokkan`
    },

    ConstraintTypePicker : {
        none                : 'Tidak ada',
        assoonaspossible    : 'Secepat mungkin',
        aslateaspossible    : 'Se-lambat mungkin',
        muststarton         : 'Harus dimulai pada',
        mustfinishon        : 'Harus diselesaikan pada',
        startnoearlierthan  : 'Dimulai secepatnya pada',
        startnolaterthan    : 'Dimulai selambatnya pada',
        finishnoearlierthan : 'Diselesaikan secepatnya pada',
        finishnolaterthan   : 'Diselesaikan selambatnya pada'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} waktu buffer sebelum acara`;
            }
            if (postamble) {
                description += `.${postamble.toString()} waktu buffer setelah acara`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Maju',
        Backward      : 'Mundur',
        inheritedFrom : 'Diwarisi dari',
        enforcedBy    : 'Dipaksakan oleh'
    },

    CalendarField : {
        'Default calendar' : 'Kalender default',
        editCalendar       : 'Edit Kalender'
    },

    TaskEditorBase : {
        Information   : 'Informasi tugas',
        Save          : 'Simpan',
        Cancel        : 'Batalkan',
        Delete        : 'Hapus',
        calculateMask : 'Menghitung...',
        saveError     : 'Tidak dapat menyimpan, perbaiki kesalahan dulu',
        repeatingInfo : 'Melihat peristiwa yang berulang',
        editRepeating : 'Mengedit'
    },

    TaskEdit : {
        editEvent              : 'Edit acara',
        ConfirmDeletionTitle   : 'Konfirmasi penghapusan',
        ConfirmDeletionMessage : 'Anda ingin menghapus acara?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '35em'
    },

    SchedulerGeneralTab : {
        General      : 'Umum',
        Name         : 'Nama',
        Resources    : 'Sumber daya',
        '% complete' : '% selesai',
        Duration     : 'Durasi',
        Start        : 'Mulai',
        Finish       : 'Selesaikan',
        Effort       : 'Upaya',
        Preamble     : 'Pembuka',
        Postamble    : 'Penutup'
    },

    GeneralTab : {
        General      : 'Umum',
        Name         : 'Nama',
        '% complete' : '% selesai',
        Duration     : 'Durasi',
        Start        : 'Mulai',
        Finish       : 'Selesaikan',
        Effort       : 'Upaya',
        Dates        : 'Tanggal'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Lanjutan',
        Calendar                   : 'Kalender',
        'Scheduling mode'          : 'Mode penjadwalan',
        'Effort driven'            : 'Upaya yang dilakukan',
        'Manually scheduled'       : 'Dijadwalkan secara manual',
        'Constraint type'          : 'Jenis batasan',
        'Constraint date'          : 'Tanggal batasan',
        Inactive                   : 'Tidak aktif',
        'Ignore resource calendar' : 'Mengabaikan kalender resource'
    },

    CalendarEditorDatePicker : {
        addException : 'Tambahkan pengecualian',
        addWeek      : 'Tambahkan minggu'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Tambahkan pengecualian',
        removeException : 'Hapus pengecualian',
        noRows          : 'Tidak ada pengecualian yang ditambahkan'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Tambahkan minggu',
        removeWeek : 'Hapus minggu'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Hari bekerja secara default',
        workingTimeCalendar        : 'Kalender Waktu Kerja',
        exceptions                 : 'Pengecualian',
        general                    : 'Umum',
        name                       : 'Nama',
        parent                     : 'Induk',
        save                       : 'Menyimpan',
        weeks                      : 'Minggu -minggu',
        error                      : 'Kesalahan',
        inputErrors                : 'Ada kesalahan input. Harap perbaiki sebelum menyimpan perubahan Anda.',
        delete                     : 'Menghapus',
        addCalendar                : 'Tambahkan kalender',
        confirmation               : 'Konfirmasi',
        removeCalendarWithChildren : 'Kalender memiliki kalender anak. Klik "Ya" untuk menghapus kalender dengan anak -anaknya.',
        removeCalendarAndLinks     : 'Kalender digunakan oleh beberapa catatan. Klik "Ya" untuk melepaskannya dan menghapus kalender.',
        newException               : 'Pengecualian baru',
        newWeek                    : 'Minggu baru'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' sedang kerja',
        isNotWorking : ' tidak bekerja',
        basedOn      : ' berdasarkan:',
        byDefault    : 'secara default',
        rangeTpl     : (start, end) => `${start} hingga ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Hari kerja',
        nonWorkingDay : 'Hari yang tidak bekerja'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Ada rentang yang tumpang tindih',
        errorMissingDate   : 'Diperlukan waktu mulai dan akhir',
        errorStartAfterEnd : 'Waktu mulai tidak bisa setelah akhir zaman'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Nama',
        from                                 : 'Dari',
        to                                   : 'Ke',
        is                                   : 'Adalah',
        nonWorking                           : 'Tidak bekerja',
        working                              : 'Bekerja',
        hours                                : 'Jam',
        repeat                               : 'Mengulang',
        repeatEnd                            : 'Ulangi akhir',
        errorMissingDate                     : 'Kisaran tanggal pengecualian diperlukan',
        errorStartAfterEnd                   : '"From" date cannot be after the "To" date ',
        errorStartAndEndRepeatNumberMismatch : 'Pengecualian harus dimulai dan mengakhiri jumlah yang sama'
    },

    CalendarEditorWeekPanel : {
        name        : 'Nama',
        from        : 'Dari',
        to          : 'Ke',
        days        : 'Hari -hari',
        copyDay     : 'Salin hari',
        pasteDay    : 'Tempel hari',
        stopCopying : 'Berhenti Menyalin'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Tambahkan jangkauan',
        removeRange : 'Hapus jangkauan'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"From" date cannot be after the "To" date ',
        errorNoDefaultWeek           : 'Konfigurasi minggu diperlukan',
        errorMultipleDefaultWeeks    : 'Lebih dari satu minggu default ditentukan',
        errorNoWeekAvailability      : 'Minggu harus memberikan waktu kerja',
        errorInvalidWeekAvailability : 'Minggu memiliki kesalahan konfigurasi waktu kerja',
        noRows                       : 'Tidak ada minggu yang ditambahkan'
    },

    AdvancedTab : {
        Advanced                   : 'Lanjutan',
        Calendar                   : 'Kalender',
        'Scheduling mode'          : 'Mode penjadwalan',
        'Effort driven'            : 'Upaya yang dilakukan',
        'Manually scheduled'       : 'Dijadwalkan secara manual',
        'Constraint type'          : 'Jenis batasan',
        'Constraint date'          : 'Tanggal batasan',
        Constraint                 : 'Batasan',
        Rollup                     : 'Penggabungan',
        Inactive                   : 'Tidak aktif',
        'Ignore resource calendar' : 'Mengabaikan kalender resource',
        'Scheduling direction'     : 'Arah penjadwalan',
        projectBorder              : 'Perbatasan Proyek',
        ignore                     : 'Mengabaikan',
        honor                      : 'Menghormati',
        askUser                    : 'Tanya Pengguna'
    },

    DependencyTab : {
        Predecessors      : 'Pendahulu',
        Successors        : 'Penerus',
        ID                : 'ID',
        Name              : 'Nama',
        Type              : 'Jenis',
        Lag               : 'Lag',
        cyclicDependency  : 'Dependensi siklik',
        invalidDependency : 'Dependensi tidak valid',
        readOnlyTask      : 'Tugas hanya-baca tidak dapat ditautkan'
    },

    NotesTab : {
        Notes : 'Catatan'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalender'
    },

    ResourceEdit : {
        editResource : 'Sunting sumber daya'
    },

    ResourceEditor : {
        resourceInformation : 'Informasi sumber daya',
        costs               : 'Biaya',
        save                : 'Menyimpan',
        error               : 'Kesalahan',
        inputErrors         : 'Ada kesalahan masukan. Harap perbaiki sebelum menyimpan perubahan Anda.',
        delete              : 'Menghapus',
        confirmation        : 'Konfirmasi',
        removeUsedResource  : 'Sumber daya ditugaskan untuk beberapa tugas. Klik "Ya" untuk tetap menghapus sumber daya.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalender',
        general     : 'Umum',
        label       : 'Label bahan',
        name        : 'Nama sumber daya',
        type        : 'Jenis',
        costAccrual : 'Akrual biaya',
        labelHint   : 'misalnya kg, ton atau kotak',
        maxUnits    : 'Unit maksimum'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Bertambah pada',
        prorated : 'Diprorata',
        start    : 'Awal',
        end      : 'Akhir'
    },

    CostAccrualField : {
        prorated : 'Diprorata',
        start    : 'Awal',
        end      : 'Akhir'
    },

    ResourceType : {
        work     : 'Bekerja',
        material : 'Bahan',
        cost     : 'Biaya'
    },

    ResourceTypeColumn : {
        type : 'Jenis'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Tabel tarif',
        newGroup     : 'meja baru',
        removeGroup  : 'Hapus tabel',
        useByDefault : 'Gunakan secara default untuk penetapan sumber daya',
        noRates      : 'Tidak ada tarif'
    },

    ResourceGrid : {
        name          : 'Nama',
        materialLabel : 'Label bahan',
        maxUnits      : 'Unit maks',
        cost          : 'Biaya',
        noRows        : 'Tidak ada sumber daya'
    },

    ResourceRateTableContainer : {
        startDate    : 'Tanggal mulai',
        standardRate : 'Tarif standar',
        perUseCost   : 'Biaya per penggunaan',
        addRate      : 'Tambahkan tarif',
        removeRate   : 'Hapus tarif',
        name         : 'Nama',
        noRates      : 'Tidak ada tarif'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Informasi tabel tarif'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Kuantitas',
        Resources   : 'Sumber daya',
        Resource    : 'Sumber daya',
        Units       : 'Unit',
        cost        : 'Biaya',
        effort      : 'Upaya',
        start       : 'Awal',
        finish      : 'Menyelesaikan',
        preamble    : 'Pendahuluan',
        postamble   : 'Penutup'
    },

    RateTableColumn : {
        rateTable : 'Tabel tarif'
    },

    RecurrenceTab : {
        title : 'Mengulangi'
    },

    SchedulingModePicker : {
        Normal           : 'Normal',
        'Fixed Duration' : 'Durasi Tetap',
        'Fixed Units'    : 'Unit Tetap',
        'Fixed Effort'   : 'Upaya Tetap'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} dari {available}</span> yang dialokasikan',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} dari {available}</span> yang dialokasikan',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} dari {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} dari {available}</span> yang dialokasikan:<br>{assignments}',
        groupBarTipOnDate     : 'Pada {startDate}<br><span class="{cls}">{allocated} dari {available}</span> yang dialokasikan:<br>{assignments}',
        plusMore              : '+{value} lagi'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Upaya</div><div class="b-effort-value {cls}">{allocated} dari {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Upaya</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Biaya</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Kuantitas</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} pada {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Ringkasan untuk {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Ringkasan untuk {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} lagi',
        nameColumnText        : 'Sumber Daya / Acara'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Batalkan perubahan dan jangan terapkan apa pun',
        schedulingConflict : 'Konflik penjadwalan',
        emptyCalendar      : 'Kesalahan konfigurasi kalender',
        cycle              : 'Siklus penjadwalan',
        Apply              : 'Terapkan'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Pilih dependensi:',
        invalidDependencyLabel : 'Ada dependensi tidak valid yang terlibat yang harus ditangani:'
    },

    SchedulerProBase : {
        propagating     : 'Menghitung proyek',
        storePopulation : 'Memuat data',
        finalizing      : 'Memfinalisasi hasil'
    },

    EventSegments : {
        splitEvent    : 'Bagikan peristiwa',
        renameSegment : 'Ganti nama'
    },

    NestedEvents : {
        createGroup         : 'Kelompokkan acara yang dipilih',
        newGroupName        : 'Grup Baru',
        deNestingNotAllowed : 'De-nesting tidak diizinkan',
        nestingNotAllowed   : 'Nesting tidak diizinkan'
    },

    VersionGrid : {
        compare       : 'Bandingkan',
        description   : 'Deskripsi',
        occurredAt    : 'Terjadi pada',
        rename        : 'Ganti nama',
        restore       : 'Pulihkan',
        stopComparing : 'Berhenti membandingkan'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'tugas',
            AssignmentModel : 'penugasan',
            DependencyModel : 'tautan',
            ProjectModel    : 'proyek',
            ResourceModel   : 'resource',
            other           : 'objek'
        },
        entityNamesPlural : {
            TaskModel       : 'tugas',
            AssignmentModel : 'penugasan',
            DependencyModel : 'tautan',
            ProjectModel    : 'proyek',
            ResourceModel   : 'resource',
            other           : 'objek'
        },
        transactionDescriptions : {
            update : 'Mengubah {n} {entities}',
            add    : 'Menambahkan {n} {entities}',
            remove : 'Menghapus {n} {entities}',
            move   : 'Memindahkan {n} {entities}',
            mixed  : 'Mengubah {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktif',
            allDay                   : 'Sepanjang hari',
            allowOverlap             : 'Izinkan tumpang tindih',
            barMargin                : 'Margin bar',
            bidirectional            : 'Dua arah',
            calendar                 : 'Kalender',
            cls                      : 'Kelas CSS',
            constraintDate           : 'Tanggal batasan',
            constraintType           : 'Jenis batasan',
            daysPerMonth             : 'Hari per bulan',
            daysPerWeek              : 'Hari per minggu',
            delayFromParent          : 'Penundaan dari induk',
            direction                : 'Arah',
            drawDependencies         : 'Gambar ketergantungan',
            duration                 : 'Durasi',
            durationUnit             : 'Unit durasi',
            effort                   : 'Upaya',
            effortDriven             : 'Berdasarkan upaya',
            effortUnit               : 'Unit upaya',
            endDate                  : 'Tanggal akhir',
            eventColor               : 'Warna',
            eventId                  : 'ID Acara',
            eventLayout              : 'Tata letak acara',
            eventStyle               : 'Gaya bar',
            exceptionDates           : 'Tanggal pengecualian',
            fixed                    : 'Tetap',
            from                     : 'Dari',
            fromSide                 : 'Dari sisi',
            hoursPerDay              : 'Jam per hari',
            href                     : 'Tautan',
            iconCls                  : 'Ikon',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Abaikan kalender sumber daya',
            ignoreTimeZone           : 'Abaikan zona waktu',
            image                    : 'Gambar',
            imageUrl                 : 'URL gambar',
            inactive                 : 'Tidak aktif',
            intervals                : 'Interval',
            lag                      : 'Keterlambatan',
            lagUnit                  : 'Unit keterlambatan',
            lineStyle                : 'Gaya garis',
            manuallyScheduled        : 'Dijadwalkan secara manual',
            milestoneWidth           : 'Lebar tonggak',
            name                     : 'Nama',
            note                     : 'Catatan',
            parentId                 : 'ID Induk',
            parentIndex              : 'Posisi',
            percentDone              : '% selesai',
            postamble                : 'Postamble',
            preamble                 : 'Preamble',
            readOnly                 : 'Hanya baca',
            recurrenceRule           : 'Aturan pengulangan',
            resourceId               : 'ID Sumber Daya',
            resourceMargin           : 'Margin sumber daya',
            rowHeight                : 'Tinggi baris',
            schedulingMode           : 'Mode penjadwalan',
            segments                 : 'Segmen',
            showAvatar               : 'Tampilkan avatar',
            showInTimeline           : 'Tampilkan di garis waktu',
            startDate                : 'Tanggal mulai',
            stickyContents           : 'Konten lengket',
            strokeColor              : 'Warna garis',
            style                    : 'Gaya',
            target                   : 'Target tautan',
            to                       : 'Ke',
            toSide                   : 'Ke sisi',
            type                     : 'Jenis',
            units                    : 'Unit',
            unscheduled              : 'Tidak dijadwalkan',
            unspecifiedTimeIsWorking : 'Waktu yang tidak ditentukan adalah waktu kerja',
            version                  : 'Versi'
        },
        intervals : {
            working    : 'Bekerja',
            nonWorking : 'Tidak bekerja',
            fromTo     : 'Dari {from} hingga {to}',
            recurring  : 'Berulang mulai {start} berakhir {end}'
        },
        addEntity         : 'Menambahkan {type} **{name}**',
        removeEntity      : 'Menghapus {type} **{name}**',
        updateEntity      : 'Mengubah {type} **{name}**',
        moveEntity        : 'Memindahkan {type} **{name}** dari {from} ke {to}',
        addDependency     : 'Menambahkan tautan dari **{from}** ke **{to}**',
        removeDependency  : 'Menghapus tautan dari **{from}** ke **{to}**',
        updateDependency  : 'Mengedit tautan dari **{from}** ke **{to}**',
        addAssignment     : 'Menugaskan **{resource}** ke **{event}**',
        removeAssignment  : 'Menghapus penugasan **{resource}** dari **{event}**',
        updateAssignment  : 'Mengedit penugasan **{resource}** ke **{event}**',
        noChanges         : 'Tidak ada perubahan',
        nullValue         : 'tidak ada',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Disimpan pada {date}',
        autoSavedAt       : 'Disimpan otomatis pada {date}',
        undid             : 'Mengurungkan perubahan',
        redid             : 'Mengulangi perubahan',
        editedTask        : 'Mengedit properti tugas',
        deletedTask       : 'Menghapus tugas',
        movedTask         : 'Memindahkan tugas',
        movedTasks        : 'Memindahkan tugas-tugas'
    }
};

export default LocaleHelper.publishLocale(locale);
