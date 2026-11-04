import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Sk.js';

const locale = {

    localeName : 'Sk',
    localeDesc : 'Slovenský',
    localeCode : 'sk',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Načítanie údajov zlyhalo!',
        syncFailedMessage : 'Synchronizácia údajov zlyhala!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Odpoveď servera:'
    },

    TaskBoard : {
        column                 : 'stĺpec',
        columns                : 'stĺpce',
        Columns                : 'Stĺpce',
        swimlane               : 'swimlane',
        swimlanes              : 'swimlane diagram',
        Swimlanes              : 'Swimlane',
        task                   : 'úloha',
        tasks                  : 'úlohy',
        addTask                : 'Pridať L{TaskBoard.task}',
        cancel                 : 'Zrušiť',
        changeColumn           : 'Zmena L{TaskBoard.column}',
        changeSwimlane         : 'Zmena L{TaskBoard.swimlane}',
        collapse               : text => `Kolaps ${text}`,
        color                  : 'Farba',
        description            : 'Popis',
        editTask               : 'Upraviť L{TaskBoard.task}',
        expand                 : text => `Expand ${text}`,
        filterColumns          : 'Filtrovať L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtrovať L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtrovať L{TaskBoard.tasks}',
        lock                   : 'Zámok',
        unlock                 : 'Odomknúť',
        moveColumnLeft         : 'Posunúť L{TaskBoard.column} doľava',
        moveColumnRight        : 'Posunúť L{TaskBoard.column} doprava',
        moveColumnUp           : 'Posunúť L{TaskBoard.column} nahor',
        moveColumnDown         : 'Posunúť L{TaskBoard.column} nadol',
        moveColumnOutOfGroup   : 'Posunúť L{TaskBoard.column} mimo skupinu',
        moveColumnIntoGroup    : 'Posunúť L{TaskBoard.column} do skupiny',
        groupWithLeftNeighbor  : 'Zoskupiť s ľavým susedným L{TaskBoard.column}',
        groupWithRightNeighbor : 'Zoskupiť s pravým susedným L{TaskBoard.column}',
        name                   : 'Názov',
        newTaskName            : 'Nový L{TaskBoard.task}',
        removeTask             : 'Odstrániť L{TaskBoard.task}',
        removeTasks            : 'Odstrániť L{TaskBoard.tasks}',
        resources              : 'Zdroje',
        save                   : 'Uložiť',
        scrollToColumn         : 'Prejsť na L{TaskBoard.column}',
        scrollToSwimlane       : 'Prejsť na L{TaskBoard.swimlane}',
        showColumnMenu         : 'Zobraziť ponuku stĺpca',
        showTask               : 'Zobraziť úlohu',
        unassigned             : 'Nepriradené',
        zoom                   : 'Zoom'
    },

    ColumnFilters : {
        show         : 'Zobraziť filter stĺpca',
        toggle       : 'Prepnúť filter stĺpca',
        clear        : 'Vymazať filtre stĺpcov',
        badgeTooltip : count => `${count} filter(-y) aplikované`
    },

    ColumnSort : {
        sort     : 'Zoradiť stĺpec',
        sortedBy : ({ label, ascending }) =>
            `Stĺpec zoradený ${ascending ? 'vzostupne' : 'zostupne'} podľa "${label}"`,
        reset : 'Obnoviť triedenie stĺpcov'
    },

    TaskMenuItem : {
        showTaskMenu : 'Zobraziť ponuku úloh'
    },

    TodoListField : {
        add     : 'Pridať',
        newTodo : 'Nová úloha'
    },

    UndoRedo : {
        UndoLastAction : 'Vrátiť späť',
        RedoLastAction : 'Prepracovať'
    },

    ColumnRename : {
        rename : 'Premenovať'
    },

    ColumnSearchField : {
        search    : 'Hľadať',
        matchMode : (mode) => `Režim vyhľadávania: ${mode}`,
        literal   : 'Doslovný',
        and       : 'Všetky slová (AND)',
        or        : 'Akékoľvek slovo (OR)'
    }
};

export default LocaleHelper.publishLocale(locale);
