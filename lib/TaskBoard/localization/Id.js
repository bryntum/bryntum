import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Id.js';

const locale = {

    localeName : 'Id',
    localeDesc : 'Bahasa Indonesia',
    localeCode : 'id',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Pemuatan data gagal!',
        syncFailedMessage : 'Sinkronisasi data gagal!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Respons server:'
    },

    TaskBoard : {
        column                 : 'kolom',
        columns                : 'kolom',
        Columns                : 'Kolom',
        swimlane               : 'swimlane',
        swimlanes              : 'swimlane',
        Swimlanes              : 'Swimlane',
        task                   : 'tugas',
        tasks                  : 'tugas',
        addTask                : 'Tambahkan L{TaskBoard.task}',
        cancel                 : 'Batalkan',
        changeColumn           : 'Ubah L{TaskBoard.column}',
        changeSwimlane         : 'Ubah L{TaskBoard.swimlane}',
        collapse               : text => `Ciutkan ${text}`,
        color                  : 'Warna',
        description            : 'Deskripsi',
        editTask               : 'Edit L{TaskBoard.task}',
        expand                 : text => `Perluas ${text}`,
        filterColumns          : 'Filter L{TaskBoard.columns}',
        filterSwimlanes        : 'Filter L{TaskBoard.swimlanes}',
        filterTasks            : 'Filter L{TaskBoard.tasks}',
        lock                   : 'Kunci',
        unlock                 : 'Membuka kunci',
        moveColumnLeft         : 'Pindahkan L{TaskBoard.column} ke kiri',
        moveColumnRight        : 'Pindahkan L{TaskBoard.column} kanan',
        moveColumnUp           : 'Pindahkan L{TaskBoard.column} ke atas',
        moveColumnDown         : 'Pindahkan L{TaskBoard.column} ke bawah',
        moveColumnOutOfGroup   : 'Pindahkan L{TaskBoard.column} keluar dari grup',
        moveColumnIntoGroup    : 'Pindahkan L{TaskBoard.column} ke dalam grup',
        groupWithLeftNeighbor  : 'Kelompokkan dengan L{TaskBoard.column} tetangga kiri',
        groupWithRightNeighbor : 'Kelompokkan dengan L{TaskBoard.column} tetangga kanan',
        name                   : 'Nama',
        newTaskName            : 'L{TaskBoard.task} baru',
        removeTask             : 'Pindahkan L{TaskBoard.task}',
        removeTasks            : 'Pindahkan L{TaskBoard.tasks}',
        resources              : 'Sumber daya',
        save                   : 'Simpan',
        scrollToColumn         : 'Gulir ke L{TaskBoard.column}',
        scrollToSwimlane       : 'Gulir ke L{TaskBoard.swimlane}',
        showColumnMenu         : 'Tampilkan menu kolom',
        showTask               : 'Tampilkan L{TaskBoard.task}',
        unassigned             : 'Belum ditugaskan',
        zoom                   : 'Perbesar'
    },

    ColumnFilters : {
        show         : 'Tampilkan filter kolom',
        toggle       : 'Alihkan filter kolom',
        clear        : 'Hapus filter kolom',
        badgeTooltip : count => `${count} filter diterapkan`
    },

    ColumnSort : {
        sort     : 'Urutkan kolom',
        sortedBy : ({ label, ascending }) =>
            `Kolom diurutkan ${ascending ? 'menaik' : 'menurun'} berdasarkan "${label}"`,
        reset : 'Atur ulang pengurutan kolom'
    },

    TaskMenuItem : {
        showTaskMenu : 'Tampilkan menu tugas'
    },

    TodoListField : {
        add     : 'Tambahkan',
        newTodo : 'Daftar tugas baru'
    },

    UndoRedo : {
        UndoLastAction : 'Urungkan',
        RedoLastAction : 'Ulangi'
    },

    ColumnRename : {
        rename : 'Ganti nama'
    },

    ColumnSearchField : {
        search    : 'Cari',
        matchMode : (mode) => `Mode pencarian: ${mode}`,
        literal   : 'Literal',
        and       : 'Semua kata (DAN)',
        or        : 'Salah satu kata (ATAU)'
    }
};

export default LocaleHelper.publishLocale(locale);
