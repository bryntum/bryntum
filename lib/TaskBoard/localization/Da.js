import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Da.js';

const locale = {

    localeName : 'Da',
    localeDesc : 'Dansk',
    localeCode : 'da',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Dataindlæsning mislykkedes!',
        syncFailedMessage : 'Datasynkronisering mislykkedes!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Server svar:'
    },

    TaskBoard : {
        column                 : 'kolonne',
        columns                : 'kolonner',
        Columns                : 'kolonner',
        swimlane               : 'svømmebane',
        swimlanes              : 'svømmebane',
        Swimlanes              : 'svømmebane',
        task                   : 'opgave',
        tasks                  : 'opgaver',
        addTask                : 'Tilføje L{TaskBoard.task}',
        cancel                 : 'Afbestille',
        changeColumn           : 'Ændre kolonne{TaskBoard.column}',
        changeSwimlane         : 'Ændre svømmebane{TaskBoard.swimlane}',
        collapse               : text => `Samle ${text}`,
        color                  : 'Farve',
        description            : 'Beskrivelse',
        editTask               : 'Redigere L{TaskBoard.task}',
        expand                 : text => `Udvid ${text}`,
        filterColumns          : 'Filter L{TaskBoard.columns}',
        filterSwimlanes        : 'Filter L{TaskBoard.swimlanes}',
        filterTasks            : 'Filter L{TaskBoard.tasks}',
        lock                   : 'Låse',
        unlock                 : 'Lås op',
        moveColumnLeft         : 'Bevæge sig L{TaskBoard.column} venstre',
        moveColumnRight        : 'Bevæge sig L{TaskBoard.column} højre',
        moveColumnUp           : 'Bevæge sig L{TaskBoard.column} op',
        moveColumnDown         : 'Bevæge sig L{TaskBoard.column} ned',
        moveColumnOutOfGroup   : 'Bevæge sig L{TaskBoard.column} ud af gruppen',
        moveColumnIntoGroup    : 'Bevæge sig L{TaskBoard.column} ind i gruppen',
        groupWithLeftNeighbor  : 'Gruppér med venstre nabo L{TaskBoard.column}',
        groupWithRightNeighbor : 'Gruppér med højre nabo L{TaskBoard.column}',
        name                   : 'Navn',
        newTaskName            : 'Ny L{TaskBoard.task}',
        removeTask             : 'Fjerne L{TaskBoard.task}',
        removeTasks            : 'Fjerne L{TaskBoard.tasks}',
        resources              : 'Ressourcer',
        save                   : 'Gem',
        scrollToColumn         : 'Rul til L{TaskBoard.column}',
        scrollToSwimlane       : 'Rul til L{TaskBoard.swimlane}',
        showColumnMenu         : 'Vis kolonnemenu',
        showTask               : 'Vis L{TaskBoard.task}',
        unassigned             : 'Ikke tildelt',
        zoom                   : 'Zoom'
    },

    ColumnFilters : {
        show         : 'Vis kolonnefilter',
        toggle       : 'Skift kolonnefilter',
        clear        : 'Ryd kolonnefiltre',
        badgeTooltip : count => `${count} filter(er) anvendt`
    },

    ColumnSort : {
        sort     : 'Sorter kolonne',
        sortedBy : ({ label, ascending }) =>
            `Kolonne sorteret ${ascending ? 'stigende' : 'faldende'} efter "${label}"`,
        reset : 'Nulstil kolonne sortering'
    },

    TaskMenuItem : {
        showTaskMenu : 'Vis opgavemenu'
    },

    TodoListField : {
        add     : 'Tilføje',
        newTodo : 'Ny opgave'
    },

    UndoRedo : {
        UndoLastAction : 'Fortryd',
        RedoLastAction : 'Gentag'
    },

    ColumnRename : {
        rename : 'Omdøb'
    },

    ColumnSearchField : {
        search    : 'Søg',
        matchMode : (mode) => `Søgetilstand: ${mode}`,
        literal   : 'Bogstavelig',
        and       : 'Alle ord (OG)',
        or        : 'Ethvert ord (ELLER)'
    }
};

export default LocaleHelper.publishLocale(locale);
