import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Eu.js';

const locale = {

    localeName : 'Eu',
    localeDesc : 'Euskara',
    localeCode : 'eu-ES',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Ezin izan dira kargatu datuak',
        syncFailedMessage : 'Ezin izan dira sinkronizatu datuak'
    },

    CrudManagerView : {
        serverResponseLabel : 'Zerbitzariaren erantzuna:'
    },

    TaskBoard : {
        column                 : 'zutabea',
        columns                : 'zutabeak',
        Columns                : 'Zutabeak',
        swimlane               : 'lerroa',
        swimlanes              : 'lerroak',
        Swimlanes              : 'Lerroak',
        task                   : 'zeregina',
        tasks                  : 'zeregin',
        addTask                : 'Gehitu L{TaskBoard.task}',
        cancel                 : 'Utzi',
        changeColumn           : 'Aldatu L{TaskBoard.column}',
        changeSwimlane         : 'Aldatu L{TaskBoard.swimlane}',
        collapse               : text => `Itxi ${text}`,
        color                  : 'Kolorea',
        description            : 'Deskribapena',
        editTask               : 'Editatu L{TaskBoard.task}',
        expand                 : text => `Zabaldu ${text}`,
        filterColumns          : 'Iragazi L{TaskBoard.columns}',
        filterSwimlanes        : 'Iragazi L{TaskBoard.swimlanes}',
        filterTasks            : 'Iragazi L{TaskBoard.tasks}',
        lock                   : 'Blokea',
        unlock                 : 'Desblokeatu',
        moveColumnLeft         : 'Mugitu L{TaskBoard.column} ezkerretara',
        moveColumnRight        : 'Mugitu L{TaskBoard.column} eskumatara',
        moveColumnUp           : 'Mugitu L{TaskBoard.column} gora',
        moveColumnDown         : 'Mugitu L{TaskBoard.column} behera',
        moveColumnOutOfGroup   : 'Mugitu L{TaskBoard.column} taldetik kanpora',
        moveColumnIntoGroup    : 'Mugitu L{TaskBoard.column} taldera',
        groupWithLeftNeighbor  : 'Taldekatu ezkerreko L{TaskBoard.column} auzokidearekin',
        groupWithRightNeighbor : 'Taldekatu eskuineko L{TaskBoard.column} auzokidearekin',
        name                   : 'Izena',
        newTaskName            : 'Berria L{TaskBoard.task}',
        removeTask             : 'Ezabatu L{TaskBoard.task}',
        removeTasks            : 'Ezabatu L{TaskBoard.tasks}',
        resources              : 'Baliabideak',
        save                   : 'Gorde',
        scrollToColumn         : 'Korritu hona L{TaskBoard.column}',
        scrollToSwimlane       : 'Korritu hona L{TaskBoard.swimlane}',
        showColumnMenu         : 'Erakutsi zutabearen menua',
        showTask               : 'Erakutsi L{TaskBoard.task}',
        unassigned             : 'Esleitu gabe',
        zoom                   : 'Zooma'
    },

    ColumnFilters : {
        show         : 'Erakutsi zutabe-iragazkia',
        toggle       : 'Aldatu zutabe-iragazkia',
        clear        : 'Garbitu zutabe-iragazkiak',
        badgeTooltip : count => `${count} iragazki(k) aplikatuta`
    },

    ColumnSort : {
        sort     : 'Ordenatu zutabea',
        sortedBy : ({ label, ascending }) =>
            `Zutabea ordenatuta ${ascending ? 'goranzko' : 'beheranzko'} moduan "${label}"-ren arabera`,
        reset : 'Kolumnen ordena berrezarri'
    },

    TaskMenuItem : {
        showTaskMenu : 'Erakutsi lanaren menua'
    },

    TodoListField : {
        add     : 'Gehitu',
        newTodo : 'Todo berria'
    },

    UndoRedo : {
        UndoLastAction : 'Desegin',
        RedoLastAction : 'Berregin'
    },

    ColumnRename : {
        rename : 'Aldatu izena'
    },

    ColumnSearchField : {
        search    : 'Bilatu',
        matchMode : (mode) => `Bilaketa modua: ${mode}`,
        literal   : 'Literala',
        and       : 'Hitz guztiak (ETA)',
        or        : 'Edozein hitz (EDO)'
    }
};

export default LocaleHelper.publishLocale(locale);
