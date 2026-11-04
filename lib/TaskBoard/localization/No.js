import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/No.js';

const locale = {

    localeName : 'No',
    localeDesc : 'Norsk',
    localeCode : 'no',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Datainnlasting mislyktes!',
        syncFailedMessage : 'Datasynkroniserg mislyktes!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Serversvar:'
    },

    TaskBoard : {
        column                 : 'kolonne',
        columns                : 'kolonner',
        Columns                : 'Kolonner',
        swimlane               : 'svømmebanediagram',
        swimlanes              : 'svømmebanediagrammer',
        Swimlanes              : 'Svømmebanediagrammer',
        task                   : 'oppgave',
        tasks                  : 'oppgaver',
        addTask                : 'Legg til L{TaskBoard.task}',
        cancel                 : 'Avbryt',
        changeColumn           : 'Endre L{TaskBoard.column}',
        changeSwimlane         : 'Endre L{TaskBoard.swimlane}',
        collapse               : text => `Skjul ${text}`,
        color                  : 'Farge',
        description            : 'Beskrivelse',
        editTask               : 'Rediger L{TaskBoard.task}',
        expand                 : text => `Utvid ${text}`,
        filterColumns          : 'Filtrer L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtrer L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtrer L{TaskBoard.tasks}',
        lock                   : 'Låse',
        unlock                 : 'Låse opp',
        moveColumnLeft         : 'Flytt L{TaskBoard.column} venstre',
        moveColumnRight        : 'Flytt L{TaskBoard.column} høyre',
        moveColumnUp           : 'Flytt L{TaskBoard.column} opp',
        moveColumnDown         : 'Flytt L{TaskBoard.column} ned',
        moveColumnOutOfGroup   : 'Flytt L{TaskBoard.column} ut av gruppen',
        moveColumnIntoGroup    : 'Flytt L{TaskBoard.column} inn i gruppen',
        groupWithLeftNeighbor  : 'Grupper med venstre nabo L{TaskBoard.column}',
        groupWithRightNeighbor : 'Grupper med høyre nabo L{TaskBoard.column}',
        name                   : 'Navn',
        newTaskName            : 'Ny L{TaskBoard.task}',
        removeTask             : 'Fjern L{TaskBoard.task}',
        removeTasks            : 'Fjern L{TaskBoard.tasks}',
        resources              : 'Ressurser',
        save                   : 'Lagre',
        scrollToColumn         : 'Bla til L{TaskBoard.column}',
        scrollToSwimlane       : 'Bla til L{TaskBoard.swimlane}',
        showColumnMenu         : 'Vis kolonnemeny',
        showTask               : 'Vis L{TaskBoard.task}',
        unassigned             : 'Uten tildeling',
        zoom                   : 'Zoom'
    },

    ColumnFilters : {
        show         : 'Vis kolonnefilter',
        toggle       : 'Veksle kolonnefilter',
        clear        : 'Fjern kolonnefiltre',
        badgeTooltip : count => `${count} filter(e) brukt`
    },

    ColumnSort : {
        sort     : 'Sorter kolonne',
        sortedBy : ({ label, ascending }) =>
            `Kolonne sortert ${ascending ? 'stigende' : 'synkende'} etter "${label}"`,
        reset : 'Tilbakestill kolonne sortering'
    },

    TaskMenuItem : {
        showTaskMenu : 'Vis oppgavemeny'
    },

    TodoListField : {
        add     : 'Legg til',
        newTodo : 'Nytt gjøremål'
    },

    UndoRedo : {
        UndoLastAction : 'Angre',
        RedoLastAction : 'Gjør om'
    },

    ColumnRename : {
        rename : 'Gi nytt navn'
    },

    ColumnSearchField : {
        search    : 'Søk',
        matchMode : (mode) => `Søkemodus: ${mode}`,
        literal   : 'Bokstavelig',
        and       : 'Alle ord (OG)',
        or        : 'Ethvert ord (ELLER)'
    }
};

export default LocaleHelper.publishLocale(locale);
