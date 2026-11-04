import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/SvSE.js';

const locale = {

    localeName : 'SvSE',
    localeDesc : 'Svenska',
    localeCode : 'sv-SE',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Ett fel har uppstått, vänligen försök igen!',
        syncFailedMessage : 'Datasynkronisering misslyckades!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Serversvar:'
    },

    TaskBoard : {
        column                 : 'kolumn',
        columns                : 'kolumner',
        Columns                : 'Kolumner',
        swimlane               : 'simbana',
        swimlanes              : 'simbanor',
        Swimlanes              : 'Simbanor',
        task                   : 'uppgift',
        tasks                  : 'uppgifter',
        addTask                : 'Lägg till L{TaskBoard.task}',
        cancel                 : 'Cancel',
        changeColumn           : 'Byt L{TaskBoard.column}',
        changeSwimlane         : 'Byt L{TaskBoard.swimlane}',
        collapse               : text => `Collapse ${text}`,
        color                  : 'Färg',
        description            : 'Beskrivning',
        editTask               : 'Redigera L{TaskBoard.task}',
        expand                 : text => `Expandera ${text}`,
        filterColumns          : 'Filtrera L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtrera L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtrera L{TaskBoard.tasks}',
        lock                   : 'Lås',
        unlock                 : 'Lås upp',
        moveColumnLeft         : 'Flytta L{TaskBoard.column} vänster',
        moveColumnRight        : 'Flytta L{TaskBoard.column} höger',
        moveColumnUp           : 'Flytta L{TaskBoard.column} upp',
        moveColumnDown         : 'Flytta L{TaskBoard.column} ner',
        moveColumnOutOfGroup   : 'Flytta L{TaskBoard.column} ut ur gruppen',
        moveColumnIntoGroup    : 'Flytta L{TaskBoard.column} in i gruppen',
        groupWithLeftNeighbor  : 'Gruppera med vänster granne L{TaskBoard.column}',
        groupWithRightNeighbor : 'Gruppera med höger granne L{TaskBoard.column}',
        name                   : 'Namn',
        newTaskName            : 'Ny L{TaskBoard.task}',
        removeTask             : 'Ta bort L{TaskBoard.task}',
        removeTasks            : 'Ta bort L{TaskBoard.tasks}',
        resources              : 'Resurser',
        save                   : 'Spara',
        scrollToColumn         : 'Scrolla till L{TaskBoard.column}',
        scrollToSwimlane       : 'Scrolla till L{TaskBoard.swimlane}',
        showColumnMenu         : 'Visa kolumnmeny',
        showTask               : 'Visa L{TaskBoard.task}',
        unassigned             : 'Oassignerad',
        zoom                   : 'Zoom'
    },

    ColumnFilters : {
        show         : 'Visa kolumnfilter',
        toggle       : 'Växla kolumnfilter',
        clear        : 'Rensa kolumnfilter',
        badgeTooltip : count => `${count} filter tillämpade`
    },

    ColumnSort : {
        sort     : 'Sortera kolumn',
        sortedBy : ({ label, ascending }) =>
            `Kolumn sorterad ${ascending ? 'stigande' : 'fallande'} efter "${label}"`,
        reset : 'Återställ kolumnsortering'
    },

    TaskMenuItem : {
        showTaskMenu : 'Visa uppgiftsmeny'
    },

    TodoListField : {
        add     : 'Lägg till',
        newTodo : 'Ny "att göra"'
    },

    UndoRedo : {
        UndoLastAction : 'Ångra',
        RedoLastAction : 'Gör om'
    },

    ColumnRename : {
        rename : 'Byt namn'
    },

    ColumnSearchField : {
        search    : 'Sök',
        matchMode : (mode) => `Sökläge: ${mode}`,
        literal   : 'Bokstavlig',
        and       : 'Alla ord (OCH)',
        or        : 'Något ord (ELLER)'
    }
};

export default LocaleHelper.publishLocale(locale);
