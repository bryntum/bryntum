import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Ro.js';

const locale = {

    localeName : 'Ro',
    localeDesc : 'Română',
    localeCode : 'ro',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Încărcarea datelor a eșuat!',
        syncFailedMessage : 'Sincronizarea datelor a eșuat!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Răspuns de la server:'
    },

    TaskBoard : {
        column                 : 'coloană',
        columns                : 'coloane',
        Columns                : 'Coloane',
        swimlane               : 'culoar',
        swimlanes              : 'culoare',
        Swimlanes              : 'Culoare',
        task                   : 'sarcină',
        tasks                  : 'sarcini',
        addTask                : 'Adăugare L{TaskBoard.task}',
        cancel                 : 'Anulare',
        changeColumn           : 'Modificare L{TaskBoard.column}',
        changeSwimlane         : 'Modificare L{TaskBoard.swimlane}',
        collapse               : text => `Restrângere ${text}`,
        color                  : 'Culoare',
        description            : 'Descriere',
        editTask               : 'Editare L{TaskBoard.task}',
        expand                 : text => `Extindere ${text}`,
        filterColumns          : 'Filtrare L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtrare L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtrare L{TaskBoard.tasks}',
        lock                   : 'Blocare',
        unlock                 : 'Deblocați',
        moveColumnLeft         : 'Mutare L{TaskBoard.column} la stânga',
        moveColumnRight        : 'Mutare L{TaskBoard.column} la dreapta',
        moveColumnUp           : 'Mutare L{TaskBoard.column} în sus',
        moveColumnDown         : 'Mutare L{TaskBoard.column} în jos',
        moveColumnOutOfGroup   : 'Mutare L{TaskBoard.column} în afara grupului',
        moveColumnIntoGroup    : 'Mutare L{TaskBoard.column} în grup',
        groupWithLeftNeighbor  : 'Grupează cu L{TaskBoard.column} vecin din stânga',
        groupWithRightNeighbor : 'Grupează cu L{TaskBoard.column} vecin din dreapta',
        name                   : 'Nume',
        newTaskName            : 'Nou L{TaskBoard.task}',
        removeTask             : 'Eliminare L{TaskBoard.task}',
        removeTasks            : ' Eliminare L{TaskBoard.tasks}',
        resources              : 'Resurse',
        save                   : 'Salvare',
        scrollToColumn         : 'Derulare la L{TaskBoard.column}',
        scrollToSwimlane       : 'Derulare la L{TaskBoard.swimlane}',
        showColumnMenu         : 'Afișează meniul coloanei',
        showTask               : 'Afișează L{TaskBoard.task}',
        unassigned             : 'Nealocat',
        zoom                   : 'Zoom'
    },

    ColumnFilters : {
        show         : 'Afișează filtrul de coloană',
        toggle       : 'Comută filtrul de coloană',
        clear        : 'Șterge filtrele de coloană',
        badgeTooltip : count => `${count} filtru(e) aplicat(e)`
    },

    ColumnSort : {
        sort     : 'Sortați coloana',
        sortedBy : ({ label, ascending }) =>
            `Coloana sortată ${ascending ? 'ascendent' : 'descendent'} după "${label}"`,
        reset : 'Resetează sortarea coloanei'
    },

    TaskMenuItem : {
        showTaskMenu : 'Afișează meniul de sarcini'
    },

    TodoListField : {
        add     : 'Adăugare',
        newTodo : 'Sarcină nouă'
    },

    UndoRedo : {
        UndoLastAction : 'Anulare',
        RedoLastAction : 'Refacere'
    },

    ColumnRename : {
        rename : 'Redenumiți'
    },

    ColumnSearchField : {
        search    : 'Căutare',
        matchMode : (mode) => `Mod de căutare: ${mode}`,
        literal   : 'Literal',
        and       : 'Toate cuvintele (AND)',
        or        : 'Orice cuvânt (OR)'
    }
};

export default LocaleHelper.publishLocale(locale);
