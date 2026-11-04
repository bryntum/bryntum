import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Ms.js';
import '../../Grid/localization/Ms.js';

const locale = {

    localeName : 'Ms',
    localeDesc : 'Melayu',
    localeCode : 'ms',
    localeRtl  : false,

    Object : {
        newEvent    : 'Peristiwa baharu',
        information : 'Maklumat',
        showDetails : 'Tunjukkan butiran'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' peristiwa'
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Togolkan lajur susun atur sumber. SPACE untuk menu konteks.'
    },

    Dependencies : {
        from    : 'Daripada',
        to      : 'Kepada',
        valid   : 'Sah',
        invalid : 'Tidak sah'
    },

    DependencyType : {
        SS           : 'MM',
        SF           : 'MS',
        FS           : 'SM',
        FF           : 'SS',
        StartToStart : 'Mula ke Mula',
        StartToEnd   : 'Mula ke Selesai',
        EndToStart   : 'Selesai ke Mula',
        EndToEnd     : 'Selesai ke Selesai',
        short        : [
            'MM',
            'MS',
            'SM',
            'SS'
        ],
        long : [
            'Mula ke Mula',
            'Mula ke Selesai',
            'Selesai ke Mula',
            'Selesai ke Selesai'
        ]
    },

    DependencyEdit : {
        From              : 'Daripada',
        To                : 'Kepada',
        Type              : 'Jenis',
        Lag               : 'Sela',
        color             : 'Warna',
        lineStyle         : 'Gaya Garisan',
        solid             : 'Padu',
        dashed            : 'Berpalang',
        dotted            : 'Bertitik',
        dashDot           : 'Palang-titik',
        longDash          : 'Palang panjang',
        'Edit dependency' : 'Edit kebergantungan',
        Save              : 'Simpan',
        Delete            : 'Hapus',
        Cancel            : 'Batal',
        StartToStart      : 'Mula ke Mula',
        StartToEnd        : 'Mula ke Akhir',
        EndToStart        : 'Akhir ke Mula',
        EndToEnd          : 'Akhir ke Akhir',
        Active            : 'Aktif'
    },

    EventEdit : {
        Name           : 'Nama',
        Resource       : 'Sumber',
        Start          : 'Mula',
        startTime      : 'Masa mula',
        End            : 'Akhir',
        endTime        : 'Masa tamat',
        Save           : 'Simpan',
        Delete         : 'Hapus',
        Cancel         : 'Batal',
        'Edit event'   : 'Edit peristiwa',
        Repeat         : 'Ulang',
        editRecurrence : 'Edit ulangan'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Peristiwa bertindih dengan peristiwa sedia ada untuk sumber ini',
        noDropOutsideTimeline   : 'Peristiwa tidak boleh digugurkan sepenuhnya di luar garis masa',
        duplicateAssignmentDrag : 'Peristiwa tidak boleh diberikan kepada sumber yang sama beberapa kali'
    },

    SchedulerBase : {
        'Add event'      : 'Tambah peristiwa',
        'Delete event'   : 'Hapus peristiwa',
        'Unassign event' : 'Nyahtetap peristiwa',
        color            : 'Warna',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, bermula pada ${startDate} ${eventRecord.duration > 0 ? `selama ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zum',
        activeDateRange : 'Julat tarikh',
        startText       : 'Tarikh mula',
        endText         : 'Tarikh akhir',
        todayText       : 'Hari ini'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Paksi masa menunjukkan ${startDate} hingga ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Salin peristiwa',
        cutEvent   : 'Potong peristiwa',
        pasteEvent : 'Tampal peristiwa'
    },

    EventFilter : {
        filterEvents : 'Tapis tugas',
        byName       : 'Ikut nama'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Tunjuk garis masa semasa'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Saat'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD-MM, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD-MM',
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
            name : 'Minggu'
        },
        weekAndDayLetter : {
            name : 'Minggu/hari biasa'
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
            name : 'Berbilang tahun'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Anda menghapuskan peristiwa',
        'delete-all-message'        : 'Adakah anda mahu menghapuskan semua kejadian peristiwa ini?',
        'delete-further-message'    : 'Adakah anda mahu menghapuskan ini dan semua kejadian masa hadapan peristiwa ini, atau hanya kejadian yang dipilih?',
        'delete-only-this-message'  : 'Adakah anda ingin memadam kejadian ini dari acara ini?',
        'delete-further-btn-text'   : 'Hapus Semua Peristiwa Masa Depan',
        'delete-only-this-btn-text' : 'Padam Hanya Peristiwa Ini',
        'update-title'              : 'Anda mengubah peristiwa berulang',
        'update-all-message'        : 'Adakah anda mahu mengubah semua kejadian peristiwa ini?',
        'update-further-message'    : 'Adakah anda mahu menukar kejadian peristiwa ini sahaja, atau ini dan semua kejadian akan datang?',
        'update-only-this-message'  : 'Adakah anda ingin menukar kejadian ini dari acara ini?',
        'update-further-btn-text'   : 'Semua Peristiwa Masa Depan',
        'update-only-this-btn-text' : 'Hanya Peristiwa Ini',
        Yes                         : 'Ya',
        Cancel                      : 'Batal',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' dan ',
        Daily                           : 'Harian',
        'Weekly on {1}'                 : ({ days }) => `Mingguan pada ${days}`,
        'Monthly on {1}'                : ({ days }) => `Bulanan pada ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Tahunan pada ${days} daripada ${months}`,
        'Every {0} days'                : ({ interval }) => `Setiap ${interval} hari`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Setiap ${interval} minggu pada ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Setiap ${interval} bulan pada ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Setiap ${interval} tahun pada ${days} daripada ${months}`,
        position1                       : 'pertama',
        position2                       : 'kedua',
        position3                       : 'ketiga',
        position4                       : 'keempat',
        position5                       : 'kelima',
        'position-1'                    : 'terakhir',
        day                             : 'hari',
        weekday                         : 'hari minggu',
        'weekend day'                   : 'hari hujung minggu',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Peristiwa ulang',
        Cancel              : 'Batal',
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
        'End repeat'        : 'Akhir ulang',
        'time(s)'           : 'masa',
        Days                : 'Hari',
        Months              : 'Bulan'
    },

    RecurrenceDaysCombo : {
        day           : 'hari',
        weekday       : 'hari minggu',
        'weekend day' : 'hari hujung minggu'
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
        Never     : 'Jangan',
        After     : 'Selepas',
        'On date' : 'Pada tarikh'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Tiada ulangan',
        Daily   : 'Harian',
        Weekly  : 'Mingguan',
        Monthly : 'Bulanan',
        Yearly  : 'Tahunan'
    },

    RecurrenceCombo : {
        None   : 'Tiada',
        Custom : 'Suaikan...'
    },

    Summary : {
        'Summary for' : date => `Ringkasan untuk ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Jadual lengkap',
        currentview  : 'Jadual boleh lihat',
        daterange    : 'Julat tarikh',
        completedata : 'Jadual lengkap (untuk semua peristiwa)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Julat jadual',
        'Export from'    : 'Daripada',
        'Export to'      : 'Kepada'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Halaman tunggal'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Halaman tunggal (tidak diskala)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Berbilang halaman (menegak)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Tiada sumber diperuntukkan'
    },

    CrudManagerView : {
        serverResponseLabel : 'Respons pelayan:'
    },

    DurationColumn : {
        Duration : 'Tempoh'
    },

    EventClusteringBase : {
        unnamed         : 'Tidak dinamakan',
        more            : count => `+ ${count} lagi`,
        clusteredEvents : count => `${count} acara yang dikelompokkan`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} julat yang dikelompokkan`
    },

    ConstraintTypePicker : {
        none                : 'Tiada',
        assoonaspossible    : 'Secepat mungkin',
        aslateaspossible    : 'Selewat-lewatnya',
        muststarton         : 'Mesti mula pada',
        mustfinishon        : 'Mesti selesai ada',
        startnoearlierthan  : 'Mula tidak awal daripada',
        startnolaterthan    : 'Mula tidak lewat daripada',
        finishnoearlierthan : 'Selesai tidak awal daripada',
        finishnolaterthan   : 'Selesai tidak lewat daripada'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} masa penampan sebelum acara`;
            }
            if (postamble) {
                description += `.${postamble.toString()} masa penampan selepas acara`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Ke hadapan',
        Backward      : 'Ke belakang',
        inheritedFrom : 'Diwarisi dari',
        enforcedBy    : 'Dikuatkuasakan oleh'
    },

    CalendarField : {
        'Default calendar' : 'Kalendar lalai',
        editCalendar       : 'Edit kalendar'
    },

    TaskEditorBase : {
        Information   : 'Maklumat tugas',
        Save          : 'Simpan',
        Cancel        : 'Batal',
        Delete        : 'Hapus',
        calculateMask : 'Mengira...',
        saveError     : 'Tak boleh simpan, sila betulkan ralat dahulu',
        repeatingInfo : 'Melihat acara berulang',
        editRepeating : 'Edit'
    },

    TaskEdit : {
        editEvent              : 'Ubah peristiwa',
        ConfirmDeletionTitle   : 'Sahkan penghapusan',
        ConfirmDeletionMessage : 'Adakah anda pasti mahu menghapuskan peristiwa?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '33em'
    },

    SchedulerGeneralTab : {
        General      : 'Umum',
        Name         : 'Nama',
        Resources    : 'Sumber',
        '% complete' : '% selesai',
        Duration     : 'Tempoh',
        Start        : 'Mula',
        Finish       : 'Selesai',
        Effort       : 'Usaha',
        Preamble     : 'Mukadimah',
        Postamble    : 'Pasca Mukadimah'
    },

    GeneralTab : {
        General      : 'Umum',
        Name         : 'Nama',
        '% complete' : '% selesai',
        Duration     : 'Tempoh',
        Start        : 'Mula',
        Finish       : 'Selesai',
        Effort       : 'Usaha',
        Dates        : 'Tarikh'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Lanjutan',
        Calendar                   : 'Kalendar',
        'Scheduling mode'          : 'Mod Penjadualan',
        'Effort driven'            : 'Didorong usaha',
        'Manually scheduled'       : 'Dijadualkan secara manual',
        'Constraint type'          : 'Jenis kekang',
        'Constraint date'          : 'Tarikh kekang',
        Inactive                   : 'Tidak aktif',
        'Ignore resource calendar' : 'Abai kalendar sumber'
    },

    CalendarEditorDatePicker : {
        addException : 'Tambah pengecualian',
        addWeek      : 'Tambah minggu'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Tambah pengecualian',
        removeException : 'Keluarkan pengecualian',
        noRows          : 'Tiada pengecualian ditambah'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Tambah minggu',
        removeWeek : 'Keluarkan minggu'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Hari berfungsi secara lalai',
        workingTimeCalendar        : 'Kalendar masa kerja',
        exceptions                 : 'Pengecualian',
        general                    : 'Umum',
        name                       : 'Nama',
        parent                     : 'Ibu bapa',
        save                       : 'Simpan',
        weeks                      : 'Minggu',
        error                      : 'Ralat',
        inputErrors                : 'Terdapat kesilapan input. Sila selesaikannya sebelum menyimpan perubahan anda.',
        delete                     : 'Padam',
        addCalendar                : 'Tambah kalendar',
        confirmation               : 'Pengesahan',
        removeCalendarWithChildren : 'Kalendar mempunyai kalendar kanak -kanak. Klik "Ya" untuk mengeluarkan kalendar dengan anak -anaknya.',
        removeCalendarAndLinks     : 'Kalendar digunakan oleh beberapa rekod. Klik "YA" untuk menyahkabuman mereka dan keluarkan kalendar.',
        newException               : 'Pengecualian baharu',
        newWeek                    : 'Minggu baru'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' sedang berfungsi',
        isNotWorking : ' tidak berfungsi',
        basedOn      : ' berdasarkan:',
        byDefault    : 'Secara lalai',
        rangeTpl     : (start, end) => `${start} hingga ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Hari bekerja',
        nonWorkingDay : 'Hari yang tidak bekerja'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Terdapat julat bertindih',
        errorMissingDate   : 'Masa permulaan dan akhir diperlukan',
        errorStartAfterEnd : 'Waktu Mula Tidak Boleh Selepas Masa Akhir'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Nama',
        from                                 : 'Dari',
        to                                   : 'Ke',
        is                                   : 'Adalah',
        nonWorking                           : 'Tidak bekerja',
        working                              : 'Bekerja',
        hours                                : 'Jam',
        repeat                               : 'Ulangi',
        repeatEnd                            : 'Ulang akhir',
        errorMissingDate                     : 'Julat tarikh pengecualian diperlukan',
        errorStartAfterEnd                   : '"Dari" Tarikh tidak boleh selepas tarikh "hingga" ',
        errorStartAndEndRepeatNumberMismatch : 'Pengecualian harus bermula dan menamatkan bilangan masa yang sama'
    },

    CalendarEditorWeekPanel : {
        name        : 'Nama',
        from        : 'Dari',
        to          : 'Ke',
        days        : 'Hari',
        copyDay     : 'Salin Hari',
        pasteDay    : 'Hari tampal',
        stopCopying : 'Berhenti menyalin'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Tambah julat',
        removeRange : 'Keluarkan julat'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"Dari" Tarikh tidak boleh selepas tarikh "hingga" ',
        errorNoDefaultWeek           : 'Konfigurasi minggu diperlukan',
        errorMultipleDefaultWeeks    : 'Lebih dari satu minggu lalai ditentukan',
        errorNoWeekAvailability      : 'Minggu mesti menyediakan masa kerja',
        errorInvalidWeekAvailability : 'Minggu mempunyai kesilapan konfigurasi masa kerja',
        noRows                       : 'Tiada minggu ditambah'
    },

    AdvancedTab : {
        Advanced                   : 'Lanjutan',
        Calendar                   : 'Kalendar',
        'Scheduling mode'          : 'Mod Penjadualan',
        'Effort driven'            : 'Didorong usaha',
        'Manually scheduled'       : 'Dijadualkan secara manual',
        'Constraint type'          : 'Jenis kekang',
        'Constraint date'          : 'Tarikh kekang',
        Constraint                 : 'Kekang',
        Rollup                     : 'Menggulung',
        Inactive                   : 'Tidak aktif',
        'Ignore resource calendar' : 'Abai kalendar sumber',
        'Scheduling direction'     : 'Arah jadual',
        projectBorder              : 'Sempadan projek',
        ignore                     : 'Abai',
        honor                      : 'Kehormatan',
        askUser                    : 'Tanya pengguna'
    },

    DependencyTab : {
        Predecessors      : 'Pendahulu',
        Successors        : 'Pengganti',
        ID                : 'ID',
        Name              : 'Nama',
        Type              : 'Jenis',
        Lag               : 'Sela',
        cyclicDependency  : 'Kebergantungan kitaran',
        invalidDependency : 'Kebergantungan tak sah',
        readOnlyTask      : 'Tugas baca sahaja tidak boleh dipautkan'
    },

    NotesTab : {
        Notes : 'Nota'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalendar'
    },

    ResourceEdit : {
        editResource : 'Edit sumber'
    },

    ResourceEditor : {
        resourceInformation : 'Maklumat sumber',
        costs               : 'Kos',
        save                : 'Jimat',
        error               : 'Ralat',
        inputErrors         : 'Terdapat ralat input. Sila betulkan sebelum menyimpan perubahan anda.',
        delete              : 'Padam',
        confirmation        : 'Pengesahan',
        removeUsedResource  : 'Sumber diperuntukkan kepada beberapa tugas. Klik "Ya" untuk mengalih keluar sumber itu.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalendar',
        general     : 'Umum',
        label       : 'Label bahan',
        name        : 'Nama sumber',
        type        : 'taip',
        costAccrual : 'Akruan kos',
        labelHint   : 'contohnya, kg, tan atau kotak',
        maxUnits    : 'Unit maksimum'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Terakru pada',
        prorated : 'Prorata',
        start    : 'Mulakan',
        end      : 'tamat'
    },

    CostAccrualField : {
        prorated : 'Prorata',
        start    : 'Mulakan',
        end      : 'tamat'
    },

    ResourceType : {
        work     : 'Kerja',
        material : 'bahan',
        cost     : 'kos'
    },

    ResourceTypeColumn : {
        type : 'taip'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Jadual kadar',
        newGroup     : 'Meja baru',
        removeGroup  : 'Keluarkan jadual',
        useByDefault : 'Gunakan secara lalai untuk tugasan sumber',
        noRates      : 'Tiada kadar'
    },

    ResourceGrid : {
        name          : 'Nama',
        materialLabel : 'Label bahan',
        maxUnits      : 'Unit maks',
        cost          : 'kos',
        noRows        : 'Tiada sumber'
    },

    ResourceRateTableContainer : {
        startDate    : 'Tarikh mula',
        standardRate : 'Kadar standard',
        perUseCost   : 'Kos setiap penggunaan',
        addRate      : 'Tambah kadar',
        removeRate   : 'Alih keluar kadar',
        name         : 'Nama',
        noRates      : 'Tiada kadar'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Maklumat jadual kadar'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Kuantiti',
        Resources   : 'Sumber',
        Resource    : 'Sumber',
        Units       : 'Unit',
        cost        : 'kos',
        effort      : 'usaha',
        start       : 'Mulakan',
        finish      : 'Selesai',
        preamble    : 'Pendahuluan',
        postamble   : 'Penutup'
    },

    RateTableColumn : {
        rateTable : 'Jadual kadar'
    },

    RecurrenceTab : {
        title : 'Ulang'
    },

    SchedulingModePicker : {
        Normal           : 'Normal',
        'Fixed Duration' : 'Tempoh Tetap',
        'Fixed Units'    : 'Unit Tetap',
        'Fixed Effort'   : 'Usaha Tetap'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} daripada {available}</span> diperuntukkan',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} daripada {available}</span> diperuntukkan',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} daripada {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} daripada {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'Pada {startDate}<br><span class="{cls}">{allocated} daripada {available}</span> diperuntukkan:<br>{assignments}',
        plusMore              : '+{value} lagi'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Usaha</div><div class="b-effort-value {cls}">{allocated} daripada {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Usaha</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Kos</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Kuantiti</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} pada {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Ringkasan untuk {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Ringkasan untuk {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} lagi',
        nameColumnText        : 'Sumber / Acara'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Batalkan perubahan dan jangan lakukan apa-apa',
        schedulingConflict : 'Konflik penjadualan',
        emptyCalendar      : 'Ralat konfigurasi kalendar',
        cycle              : 'Kitaran penjadualan',
        Apply              : 'Guna'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Sila pilih kebergantungan:',
        invalidDependencyLabel : 'Terdapat kebergantungan tak sah yang terlibat yang perlu ditangani:'
    },

    SchedulerProBase : {
        propagating     : 'Mengira projek',
        storePopulation : 'Memuat data',
        finalizing      : 'Memuktamad keputusan'
    },

    EventSegments : {
        splitEvent    : 'Pecah acara',
        renameSegment : 'Nama semula'
    },

    NestedEvents : {
        createGroup         : 'Kumpulkan acara yang dipilih',
        newGroupName        : 'Kumpulan Baharu',
        deNestingNotAllowed : 'Menyahsarangan tak dibenarkan',
        nestingNotAllowed   : 'Sarangan tak dibenarkan'
    },

    VersionGrid : {
        compare       : 'Bandingkan',
        description   : 'Penerangan',
        occurredAt    : 'Berlaku pada',
        rename        : 'Tukar nama',
        restore       : 'Kembalikan',
        stopComparing : 'Berhenti bandingkan'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'tugas',
            AssignmentModel : 'tugasan',
            DependencyModel : 'pautan',
            ProjectModel    : 'projek',
            ResourceModel   : 'sumber',
            other           : 'objek'
        },
        entityNamesPlural : {
            TaskModel       : 'tugas',
            AssignmentModel : 'tugasan',
            DependencyModel : 'pautan',
            ProjectModel    : 'projek',
            ResourceModel   : 'sumber',
            other           : 'objek'
        },
        transactionDescriptions : {
            update : 'Tukar {n} {entities}',
            add    : 'Tambah {n} {entities}',
            remove : 'Buang {n} {entities}',
            move   : 'Alih {n} {entities}',
            mixed  : 'Tukar {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktif',
            allDay                   : 'Sepanjang hari',
            allowOverlap             : 'Benarkan bertindih',
            barMargin                : 'Margin bar',
            bidirectional            : 'Dua hala',
            calendar                 : 'Kalendar',
            cls                      : 'Kelas CSS',
            constraintDate           : 'Tarikh kekangan',
            constraintType           : 'Jenis kekangan',
            daysPerMonth             : 'Hari per bulan',
            daysPerWeek              : 'Hari per minggu',
            delayFromParent          : 'Kelewatan dari induk',
            direction                : 'Arah',
            drawDependencies         : 'Lukis kebergantungan',
            duration                 : 'Tempoh',
            durationUnit             : 'Unit tempoh',
            effort                   : 'Usaha',
            effortDriven             : 'Berdasarkan usaha',
            effortUnit               : 'Unit usaha',
            endDate                  : 'Tarikh tamat',
            eventColor               : 'Warna',
            eventId                  : 'ID Acara',
            eventLayout              : 'Tata letak acara',
            eventStyle               : 'Gaya bar',
            exceptionDates           : 'Tarikh pengecualian',
            fixed                    : 'Tetap',
            from                     : 'Dari',
            fromSide                 : 'Dari sisi',
            hoursPerDay              : 'Jam per hari',
            href                     : 'Pautan',
            iconCls                  : 'Ikon',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Abaikan kalendar sumber',
            ignoreTimeZone           : 'Abaikan zon waktu',
            image                    : 'Imej',
            imageUrl                 : 'URL imej',
            inactive                 : 'Tidak aktif',
            intervals                : 'Selang',
            lag                      : 'Kelewatan',
            lagUnit                  : 'Unit kelewatan',
            lineStyle                : 'Gaya garis',
            manuallyScheduled        : 'Dijadualkan secara manual',
            milestoneWidth           : 'Lebar pencapaian',
            name                     : 'Nama',
            note                     : 'Nota',
            parentId                 : 'ID Induk',
            parentIndex              : 'Kedudukan',
            percentDone              : '% selesai',
            postamble                : 'Postamble',
            preamble                 : 'Preamble',
            readOnly                 : 'Hanya baca',
            recurrenceRule           : 'Peraturan pengulangan',
            resourceId               : 'ID Sumber',
            resourceMargin           : 'Margin sumber',
            rowHeight                : 'Ketinggian baris',
            schedulingMode           : 'Mod penjadualan',
            segments                 : 'Segmen',
            showAvatar               : 'Tunjukkan avatar',
            showInTimeline           : 'Tunjukkan dalam garis masa',
            startDate                : 'Tarikh mula',
            stickyContents           : 'Kandungan melekat',
            strokeColor              : 'Warna garis',
            style                    : 'Gaya',
            target                   : 'Sasaran pautan',
            to                       : 'Ke',
            toSide                   : 'Ke sisi',
            type                     : 'Jenis',
            units                    : 'Unit',
            unscheduled              : 'Tidak dijadualkan',
            unspecifiedTimeIsWorking : 'Masa tidak ditentukan adalah bekerja',
            version                  : 'Versi'
        },
        intervals : {
            working    : 'Bekerja',
            nonWorking : 'Tidak bekerja',
            fromTo     : 'Dari {from} hingga {to}',
            recurring  : 'Berulang bermula {start} berakhir {end}'
        },
        addEntity         : 'Tambah {type} **{name}**',
        removeEntity      : 'Buang {type} **{name}**',
        updateEntity      : 'Tukar {type} **{name}**',
        moveEntity        : 'Alih {type} **{name}** dari {from} ke {to}',
        addDependency     : 'Tambah pautan daripada **{from}** sehingga **{to}**',
        removeDependency  : 'Buang pautan daripada **{from}** sehingga **{to}**',
        updateDependency  : 'Edit pautan daripada **{from}** sehingga **{to}**',
        addAssignment     : 'Tugaskan **{resource}** sehingga **{event}**',
        removeAssignment  : 'Buang tugasan **{resource}** daripada **{event}**',
        updateAssignment  : 'Edit tugasan **{resource}** sehingga **{event}**',
        noChanges         : 'Tiada perubahan',
        nullValue         : 'tiada',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Disimpan pada {date}',
        autoSavedAt       : 'Disimpan secara automatik pada {date}',
        undid             : 'Nyahbuat perubahan',
        redid             : 'Buat semula perubahan',
        editedTask        : 'Edit properti tugas',
        deletedTask       : 'Padam tugas',
        movedTask         : 'Alih satu tugas',
        movedTasks        : 'Alih tugas'
    }
};

export default LocaleHelper.publishLocale(locale);
