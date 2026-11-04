import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Et.js';

const locale = {

    localeName : 'Et',
    localeDesc : 'Eesti keel',
    localeCode : 'et',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Andmete laadimine nurjus!',
        syncFailedMessage : 'Andmete sünkroonimine nurjus!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Serveri vastus:'
    },

    TaskBoard : {
        column                 : 'veerg',
        columns                : 'veerud',
        Columns                : 'Veerud',
        swimlane               : 'rada',
        swimlanes              : 'rajad',
        Swimlanes              : 'Rajad',
        task                   : 'ülesanne',
        tasks                  : 'ülesanded',
        addTask                : 'Lisa L{TaskBoard.task}',
        cancel                 : 'Tühista',
        changeColumn           : 'Muuda L{TaskBoard.column}',
        changeSwimlane         : 'Muuda L{TaskBoard.swimlane}',
        collapse               : text => `Koonda ${text}`,
        color                  : 'Värv',
        description            : 'Kirjeldus',
        editTask               : 'Redigeeri L{TaskBoard.task}',
        expand                 : text => `Laienda ${text}`,
        filterColumns          : 'Filtreeri L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtreeri L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtreeri L{TaskBoard.tasks}',
        lock                   : 'Lukk',
        unlock                 : 'Avage lukustus',
        moveColumnLeft         : 'Liiguta L{TaskBoard.column} vasakule',
        moveColumnRight        : 'Liiguta L{TaskBoard.column} paremale',
        moveColumnUp           : 'Liiguta L{TaskBoard.column} üles',
        moveColumnDown         : 'Liiguta L{TaskBoard.column} alla',
        moveColumnOutOfGroup   : 'Liiguta L{TaskBoard.column} grupist välja',
        moveColumnIntoGroup    : 'Liiguta L{TaskBoard.column} gruppi',
        groupWithLeftNeighbor  : 'Rühmita vasakpoolse naabri L{TaskBoard.column}-ga',
        groupWithRightNeighbor : 'Rühmita parempoolse naabri L{TaskBoard.column}-ga',
        name                   : 'Nimi',
        newTaskName            : 'Uus L{TaskBoard.task}',
        removeTask             : 'Eemalda L{TaskBoard.task}',
        removeTasks            : 'Eemalda L{TaskBoard.tasks}',
        resources              : 'Ressursid',
        save                   : 'Salvesta',
        scrollToColumn         : 'Keri kuni L{TaskBoard.column}',
        scrollToSwimlane       : 'Keri kuni L{TaskBoard.swimlane}',
        showColumnMenu         : 'Näita veeru menüüd',
        showTask               : 'Näita ülesannet',
        unassigned             : 'Määramata',
        zoom                   : 'Suumi'
    },

    ColumnFilters : {
        show         : 'Näita veeru filtrit',
        toggle       : 'Vaheta veeru filtrit',
        clear        : 'Tühjenda veeru filtrid',
        badgeTooltip : count => `${count} filter(id) rakendatud`
    },

    ColumnSort : {
        sort     : 'Sorteeri veerg',
        sortedBy : ({ label, ascending }) =>
            `Veerg on sorteeritud ${ascending ? 'kasvavalt' : 'kahanevalt'} järgi "${label}"`,
        reset : 'Lähtesta veeru sortimine'
    },

    TaskMenuItem : {
        showTaskMenu : 'Näita ülesande menüüd'
    },

    TodoListField : {
        add     : 'Lisa',
        newTodo : 'Uus ülesanne'
    },

    UndoRedo : {
        UndoLastAction : 'Ennista',
        RedoLastAction : 'Tee uuesti'
    },

    ColumnRename : {
        rename : 'Nimeta ümber'
    },

    ColumnSearchField : {
        search    : 'Otsi',
        matchMode : (mode) => `Otsingurežiim: ${mode}`,
        literal   : 'Sõnasõnaline',
        and       : 'Kõik sõnad (JA)',
        or        : 'Mõni sõna (VÕI)'
    }
};

export default LocaleHelper.publishLocale(locale);
