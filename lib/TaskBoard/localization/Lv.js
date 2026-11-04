import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Lv.js';

const locale = {

    localeName : 'Lv',
    localeDesc : 'Latviešu',
    localeCode : 'lv-LV',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Neizdevās ielādēt datus!',
        syncFailedMessage : 'Datu sinhronizācija neizdevās!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Servera atbilde:'
    },

    TaskBoard : {
        column                 : 'kolonna',
        columns                : 'kolonnas',
        Columns                : 'Kolonnas',
        swimlane               : 'swimlane',
        swimlanes              : 'swimlanes',
        Swimlanes              : 'Swimlanes',
        task                   : 'uzdevumu',
        tasks                  : 'uzdevumus',
        addTask                : 'Pievienot L{TaskBoard.task}',
        cancel                 : 'Atcelt',
        changeColumn           : 'Mainīt L{TaskBoard.column}',
        changeSwimlane         : 'Mainīt L{TaskBoard.swimlane}',
        collapse               : text => `Collapse ${text}`,
        color                  : 'Krāsa',
        description            : 'Apraksts',
        editTask               : 'Rediģēt L{TaskBoard.task}',
        expand                 : text => `Expand ${text}`,
        filterColumns          : 'Filtrēt L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtrēt L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtrēt L{TaskBoard.tasks}',
        lock                   : 'Slēdzene',
        unlock                 : 'Atbloķēt',
        moveColumnLeft         : 'Pārvietot L{TaskBoard.column} pa kreisi',
        moveColumnRight        : 'Pārvietot L{TaskBoard.column} pa labi',
        moveColumnUp           : 'Pārvietot L{TaskBoard.column} uz augšu',
        moveColumnDown         : 'Pārvietot L{TaskBoard.column} uz leju',
        moveColumnOutOfGroup   : 'Pārvietot L{TaskBoard.column} ārpus grupas',
        moveColumnIntoGroup    : 'Pārvietot L{TaskBoard.column} grupā',
        groupWithLeftNeighbor  : 'Grupēt ar kreiso blakus L{TaskBoard.column}',
        groupWithRightNeighbor : 'Grupēt ar labo blakus L{TaskBoard.column}',
        name                   : 'Nosaukums',
        newTaskName            : 'Jauns L{TaskBoard.task}',
        removeTask             : 'Noņemt L{TaskBoard.task}',
        removeTasks            : 'Noņemt L{TaskBoard.tasks}',
        resources              : 'Resursi',
        save                   : 'Saglabāt',
        scrollToColumn         : 'Ritināt uz: L{TaskBoard.column}',
        scrollToSwimlane       : 'Ritināt uz: L{TaskBoard.swimlane}',
        showColumnMenu         : 'Parādīt kolonnas izvēlni',
        showTask               : 'Rādīt L{TaskBoard.task}',
        unassigned             : 'Nepiešķirts',
        zoom                   : 'Tālummainīt'
    },

    ColumnFilters : {
        show         : 'Rādīt kolonnu filtru',
        toggle       : 'Pārslēgt kolonnu filtru',
        clear        : 'Notīrīt kolonnu filtrus',
        badgeTooltip : count => `${count} filtrs(i) piemērots`
    },

    ColumnSort : {
        sort     : 'Kārtot kolonnu',
        sortedBy : ({ label, ascending }) =>
            `Kolonna sakārtota ${ascending ? 'augošā' : 'dilstošā'} secībā pēc "${label}"`,
        reset : 'Atiestatīt kolonnu kārtošanu'
    },

    TaskMenuItem : {
        showTaskMenu : 'Parādīt uzdevumu izvēlni'
    },

    TodoListField : {
        add     : 'Pievienot',
        newTodo : 'Jauns veicamdarbs'
    },

    UndoRedo : {
        UndoLastAction : 'Atsaukt',
        RedoLastAction : 'Atsaukt atcelšanu'
    },

    ColumnRename : {
        rename : 'Pārdēvēt'
    },

    ColumnSearchField : {
        search    : 'Meklēt',
        matchMode : (mode) => `Meklēšanas režīms: ${mode}`,
        literal   : 'Burtisks',
        and       : 'Visi vārdi (UN)',
        or        : 'Jebkurš vārds (VAI)'
    }
};

export default LocaleHelper.publishLocale(locale);
