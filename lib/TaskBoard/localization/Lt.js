import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Lt.js';

const locale = {

    localeName : 'LT',
    localeDesc : 'Lietuvių',
    localeCode : 'lt-LT',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Nepavyko įkelti duomenų!',
        syncFailedMessage : 'Nepavyko sinchronizuoti duomenų!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Serverio atsakas:'
    },

    TaskBoard : {
        column                 : 'stulpelis',
        columns                : 'stulpeliai',
        Columns                : 'Stulpeliai',
        swimlane               : '„swimlane“',
        swimlanes              : '„swimlanes“',
        Swimlanes              : '„Swimlanes“',
        task                   : 'užduotis',
        tasks                  : 'užduotys',
        addTask                : 'Pridėti L{TaskBoard.task}',
        cancel                 : 'Atšaukti',
        changeColumn           : 'Keisti L{TaskBoard.column}',
        changeSwimlane         : 'Keisti L{TaskBoard.swimlane}',
        collapse               : text => `Suskleisti ${text}`,
        color                  : 'Spalva',
        description            : 'Aprašas',
        editTask               : 'Redaguoti L{TaskBoard.task}',
        expand                 : text => `Išplėsti ${text}`,
        filterColumns          : 'Filtruoti L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtruoti L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtruoti L{TaskBoard.tasks}',
        lock                   : 'Užraktas',
        unlock                 : 'Atrakinti',
        moveColumnLeft         : 'Perkelti L{TaskBoard.column} kairėn',
        moveColumnRight        : 'Perkelti L{TaskBoard.column} dešinėn',
        moveColumnUp           : 'Perkelti L{TaskBoard.column} aukštyn',
        moveColumnDown         : 'Perkelti L{TaskBoard.column} žemyn',
        moveColumnOutOfGroup   : 'Perkelti L{TaskBoard.column} iš grupės',
        moveColumnIntoGroup    : 'Perkelti L{TaskBoard.column} į grupę',
        groupWithLeftNeighbor  : 'Grupuoti su kairiuoju gretimu L{TaskBoard.column}',
        groupWithRightNeighbor : 'Grupuoti su dešiniuoju gretimu L{TaskBoard.column}',
        name                   : 'Pavadinimas',
        newTaskName            : 'Naujas L{TaskBoard.task}',
        removeTask             : 'Šalinti L{TaskBoard.task}',
        removeTasks            : 'Šalinti L{TaskBoard.tasks}',
        resources              : 'Ištekliai',
        save                   : 'Įrašyti',
        scrollToColumn         : 'Slinkti į L{TaskBoard.column}',
        scrollToSwimlane       : 'Slinkti į L{TaskBoard.swimlane}',
        showColumnMenu         : 'Rodyti stulpelio meniu',
        showTask               : 'Rodyti L{TaskBoard.task}',
        unassigned             : 'Nepriskirtas',
        zoom                   : 'Mastelis'
    },

    ColumnFilters : {
        show         : 'Rodyti stulpelio filtrą',
        toggle       : 'Perjungti stulpelio filtrą',
        clear        : 'Išvalyti stulpelio filtrus',
        badgeTooltip : count => `${count} filtras(-ai) pritaikyti`
    },

    ColumnSort : {
        sort     : 'Rūšiuoti stulpelį',
        sortedBy : ({ label, ascending }) =>
            `Stulpelis surūšiuotas ${ascending ? 'didėjančia' : 'mažėjančia'} tvarka pagal "${label}"`,
        reset : 'Atstatyti stulpelio rūšiavimą'
    },

    TaskMenuItem : {
        showTaskMenu : 'Rodyti užduočių meniu'
    },

    TodoListField : {
        add     : 'Pridėti',
        newTodo : 'Nauja užduotis'
    },

    UndoRedo : {
        UndoLastAction : 'Anuliuoti',
        RedoLastAction : 'Iš naujo vykdyti'
    },

    ColumnRename : {
        rename : 'Pervardyti'
    },

    ColumnSearchField : {
        search    : 'Ieškoti',
        matchMode : (mode) => `Paieškos režimas: ${mode}`,
        literal   : 'Pažodinis',
        and       : 'Visi žodžiai (IR)',
        or        : 'Bet kuris žodis (ARBA)'
    }
};

export default LocaleHelper.publishLocale(locale);
