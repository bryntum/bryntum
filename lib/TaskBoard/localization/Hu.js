import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Hu.js';

const locale = {

    localeName : 'Hu',
    localeDesc : 'Magyar',
    localeCode : 'hu',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Adatok betöltése sikertelen!',
        syncFailedMessage : 'Adatszinkronizálás sikertelen!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Szerverválasz:'
    },

    TaskBoard : {
        column                 : 'oszlop',
        columns                : 'oszlop',
        Columns                : 'Oszlopok',
        swimlane               : 'sáv',
        swimlanes              : 'sáv',
        Swimlanes              : 'Sáv',
        task                   : 'feladat',
        tasks                  : 'feladat',
        addTask                : 'L{TaskBoard.task} hozzáadása',
        cancel                 : 'Mégse',
        changeColumn           : 'L{TaskBoard.column} módosítása',
        changeSwimlane         : 'L{TaskBoard.swimlane} módosítása',
        collapse               : text => ` ${text} összecsukása`,
        color                  : 'Szín',
        description            : 'Leírás',
        editTask               : 'L{TaskBoard.task} szerkesztése',
        expand                 : text => ` ${text} kibontása`,
        filterColumns          : 'L{TaskBoard.columns} szűrése',
        filterSwimlanes        : 'L{TaskBoard.swimlanes} szűrése',
        filterTasks            : 'L{TaskBoard.tasks} szűrése',
        lock                   : 'Zár',
        unlock                 : 'Kinyit',
        moveColumnLeft         : 'L{TaskBoard.column} mozgatása balra',
        moveColumnRight        : 'L{TaskBoard.column} mozgatása jobbra',
        moveColumnUp           : 'L{TaskBoard.column} mozgatása felfelé',
        moveColumnDown         : 'L{TaskBoard.column} mozgatása lefelé',
        moveColumnOutOfGroup   : 'L{TaskBoard.column} mozgatása ki a csoportból',
        moveColumnIntoGroup    : 'L{TaskBoard.column} mozgatása a csoportba',
        groupWithLeftNeighbor  : 'Csoportosítás a bal oldali szomszéd L{TaskBoard.column} elemmel',
        groupWithRightNeighbor : 'Csoportosítás a jobb oldali szomszéd L{TaskBoard.column} elemmel',
        name                   : 'Név',
        newTaskName            : 'Új L{TaskBoard.task}',
        removeTask             : 'L{TaskBoard.task} eltávolítása',
        removeTasks            : 'L{TaskBoard.tasks} eltávolítása',
        resources              : 'Erőforrások',
        save                   : 'Mentés',
        scrollToColumn         : 'Görgetés ide: L{TaskBoard.column}',
        scrollToSwimlane       : 'Görgetés ide: L{TaskBoard.swimlane}',
        showColumnMenu         : 'Oszlopmenü megjelenítése',
        showTask               : 'L{TaskBoard.task} megjelenítése',
        unassigned             : 'Hozzá nem rendelt',
        zoom                   : 'Nagyítás'
    },

    ColumnFilters : {
        show         : 'Oszlop szűrő megjelenítése',
        toggle       : 'Oszlop szűrő váltása',
        clear        : 'Oszlop szűrők törlése',
        badgeTooltip : count => `${count} szűrő alkalmazva`
    },

    ColumnSort : {
        sort     : 'Oszlop rendezése',
        sortedBy : ({ label, ascending }) =>
            `Oszlop rendezve ${ascending ? 'növekvő' : 'csökkenő'} szerint "${label}"`,
        reset : 'Oszloprendezés visszaállítása'
    },

    TaskMenuItem : {
        showTaskMenu : 'Feladatmenü megjelenítése'
    },

    TodoListField : {
        add     : 'Hozzáadás',
        newTodo : 'Új teendő'
    },

    UndoRedo : {
        UndoLastAction : 'Mégse',
        RedoLastAction : 'Mégis'
    },

    ColumnRename : {
        rename : 'Átnevezés'
    },

    ColumnSearchField : {
        search    : 'Keresés',
        matchMode : (mode) => `Keresési mód: ${mode}`,
        literal   : 'Szó szerinti',
        and       : 'Minden szó (ÉS)',
        or        : 'Bármely szó (VAGY)'
    }
};

export default LocaleHelper.publishLocale(locale);
