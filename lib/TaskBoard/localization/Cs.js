import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Cs.js';

const locale = {

    localeName : 'Cs',
    localeDesc : 'Česky',
    localeCode : 'cs',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Načítání dat se nezdařilo!',
        syncFailedMessage : 'Synchronizace dat se nezdařila!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Odezva serveru:'
    },

    TaskBoard : {
        column                 : 'sloupec',
        columns                : 'sloupce',
        Columns                : 'Sloupce',
        swimlane               : 'plavecká dráha',
        swimlanes              : 'plavecké dráhy',
        Swimlanes              : 'Plavecké dráhy',
        task                   : 'úkol',
        tasks                  : 'úkoly',
        addTask                : 'Přidat L{TaskBoard.task}',
        cancel                 : 'Zrušit',
        changeColumn           : 'Změnit L{TaskBoard.column}',
        changeSwimlane         : 'Změnit L{TaskBoard.swimlane}',
        collapse               : text => `Sbalit ${text}`,
        color                  : 'Barva',
        description            : 'Popis',
        editTask               : 'Upravit L{TaskBoard.task}',
        expand                 : text => `Expand ${text}`,
        filterColumns          : 'Filtr L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtr L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtr L{TaskBoard.tasks}',
        lock                   : 'Zámek',
        unlock                 : 'Odemknout',
        moveColumnLeft         : 'Pohyb L{TaskBoard.column} doleva',
        moveColumnRight        : 'Pohyb L{TaskBoard.column} doprava',
        moveColumnUp           : 'Pohyb L{TaskBoard.column} nahoru',
        moveColumnDown         : 'Pohyb L{TaskBoard.column} dolů',
        moveColumnOutOfGroup   : 'Pohyb L{TaskBoard.column} ze skupiny',
        moveColumnIntoGroup    : 'Pohyb L{TaskBoard.column} do skupiny',
        groupWithLeftNeighbor  : 'Seskupit s levým sousedním L{TaskBoard.column}',
        groupWithRightNeighbor : 'Seskupit s pravým sousedním L{TaskBoard.column}',
        name                   : 'Název',
        newTaskName            : 'Nový L{TaskBoard.task}',
        removeTask             : 'Odebrat L{TaskBoard.task}',
        removeTasks            : 'Odebrat L{TaskBoard.tasks}',
        resources              : 'Zdroje',
        save                   : 'Uložit',
        scrollToColumn         : 'Přejít na L{TaskBoard.column}',
        scrollToSwimlane       : 'Přejít na L{TaskBoard.swimlane}',
        showColumnMenu         : 'Zobrazit nabídku sloupce',
        showTask               : 'Zobrazit L{TaskBoard.task}',
        unassigned             : 'Nepřiřazeno',
        zoom                   : 'Zoom'
    },

    ColumnFilters : {
        show         : 'Zobrazit filtr sloupce',
        toggle       : 'Přepnout filtr sloupce',
        clear        : 'Vymazat filtry sloupců',
        badgeTooltip : count => `${count} filtr(y) aplikovány`
    },

    ColumnSort : {
        sort     : 'Seřadit sloupec',
        sortedBy : ({ label, ascending }) =>
            `Sloupec seřazen ${ascending ? 'vzestupně' : 'sestupně'} podle "${label}"`,
        reset : 'Obnovit řazení sloupců'
    },

    TaskMenuItem : {
        showTaskMenu : 'Zobrazit nabídku úkolů'
    },

    TodoListField : {
        add     : 'Přidat',
        newTodo : 'Nový úkol'
    },

    UndoRedo : {
        UndoLastAction : 'Vrátit',
        RedoLastAction : 'Zopakovat'
    },

    ColumnRename : {
        rename : 'Přejmenovat'
    },

    ColumnSearchField : {
        search    : 'Hledat',
        matchMode : (mode) => `Režim hledání: ${mode}`,
        literal   : 'Doslovný',
        and       : 'Všechna slova (AND)',
        or        : 'Jakékoliv slovo (OR)'
    }
};

export default LocaleHelper.publishLocale(locale);
