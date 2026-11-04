import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Ms.js';

const locale = {

    localeName : 'Ms',
    localeDesc : 'Melayu',
    localeCode : 'ms',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Pemuatan data gagal!',
        syncFailedMessage : 'Penyegerakan data gagal!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Respons pelayan:'
    },

    TaskBoard : {
        column                 : 'kolum',
        columns                : 'kolum',
        Columns                : 'Kolum',
        swimlane               : 'lorong renang',
        swimlanes              : 'lorong renang',
        Swimlanes              : 'Lorong renang',
        task                   : 'tugas',
        tasks                  : 'tugas',
        addTask                : 'Tambah L{TaskBoard.task}',
        cancel                 : 'Batal',
        changeColumn           : 'Ubah L{TaskBoard.column}',
        changeSwimlane         : 'Ubah L{TaskBoard.swimlane}',
        collapse               : text => `Kecilkan ${text}`,
        color                  : 'Warna',
        description            : 'Penerangan',
        editTask               : 'Edit L{TaskBoard.task}',
        expand                 : text => `Kembang ${text}`,
        filterColumns          : 'Tapis L{TaskBoard.columns}',
        filterSwimlanes        : 'Tapis L{TaskBoard.swimlanes}',
        filterTasks            : 'Tapis L{TaskBoard.tasks}',
        lock                   : 'Kunci',
        unlock                 : 'Buka kunci',
        moveColumnLeft         : 'Gerak L{TaskBoard.column} kiri',
        moveColumnRight        : 'Gerak L{TaskBoard.column} kanan',
        moveColumnUp           : 'Gerak L{TaskBoard.column} atas',
        moveColumnDown         : 'Gerak L{TaskBoard.column} bawah',
        moveColumnOutOfGroup   : 'Gerak L{TaskBoard.column} keluar kumpulan',
        moveColumnIntoGroup    : 'Gerak L{TaskBoard.column} ke dalam kumpulan',
        groupWithLeftNeighbor  : 'Kumpulkan dengan L{TaskBoard.column} jiran kiri',
        groupWithRightNeighbor : 'Kumpulkan dengan L{TaskBoard.column} jiran kanan',
        name                   : 'Nama',
        newTaskName            : 'Baharu L{TaskBoard.task}',
        removeTask             : 'Buang L{TaskBoard.task}',
        removeTasks            : 'Buang L{TaskBoard.tasks}',
        resources              : 'Sumber',
        save                   : 'Simpan',
        scrollToColumn         : 'Skrol ke L{TaskBoard.column}',
        scrollToSwimlane       : 'Skrol ke L{TaskBoard.swimlane}',
        showColumnMenu         : 'Tunjukkan menu lajur',
        showTask               : 'Tunjukkan L{TaskBoard.task}',
        unassigned             : 'Tidak diperuntukkan',
        zoom                   : 'Zum'
    },

    ColumnFilters : {
        show         : 'Tunjukkan penapis lajur',
        toggle       : 'Tukar penapis lajur',
        clear        : 'Kosongkan penapis lajur',
        badgeTooltip : count => `${count} penapis digunakan`
    },

    ColumnSort : {
        sort     : 'Susun lajur',
        sortedBy : ({ label, ascending }) =>
            `Lajur disusun ${ascending ? 'menaik' : 'menurun'} mengikut "${label}"`,
        reset : 'Tetapkan semula pengisihan lajur'
    },

    TaskMenuItem : {
        showTaskMenu : 'Tunjukkan menu tugas'
    },

    TodoListField : {
        add     : 'Tambah',
        newTodo : 'Untuk buat baharu'
    },

    UndoRedo : {
        UndoLastAction : 'Buat Asal',
        RedoLastAction : 'Buat Semula'
    },

    ColumnRename : {
        rename : 'Nama semula'
    },

    ColumnSearchField : {
        search    : 'Cari',
        matchMode : (mode) => `Mod carian: ${mode}`,
        literal   : 'Literal',
        and       : 'Semua perkataan (DAN)',
        or        : 'Mana-mana perkataan (ATAU)'
    }
};

export default LocaleHelper.publishLocale(locale);
