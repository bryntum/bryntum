import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Sr.js';

const locale = {

    localeName : 'Sr',
    localeDesc : 'Srpski',
    localeCode : 'sr',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Učitavanje podataka nije uspelo!',
        syncFailedMessage : 'Sinhronizacija podataka nije uspela!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Odgovor servera:'
    },

    TaskBoard : {
        column                 : 'kolona',
        columns                : 'kolone',
        Columns                : 'Kolone',
        swimlane               : 'traka korisnika',
        swimlanes              : 'trake korisnika',
        Swimlanes              : 'Trake korisnika',
        task                   : 'zadatak',
        tasks                  : 'zadaci',
        addTask                : 'Dodaj L{TaskBoard.task}',
        cancel                 : 'Otkaži',
        changeColumn           : 'Promeni L{TaskBoard.column}',
        changeSwimlane         : 'Promeni L{TaskBoard.swimlane}',
        collapse               : text => `Skupi ${text}`,
        color                  : 'Boja',
        description            : 'Opis',
        editTask               : 'Uredi L{TaskBoard.task}',
        expand                 : text => `Proširi ${text}`,
        filterColumns          : 'Filtriraj L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtriraj L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtriraj L{TaskBoard.tasks}',
        lock                   : 'Zaključati',
        unlock                 : 'Otključati',
        moveColumnLeft         : 'Pomeri L{TaskBoard.column} nalevo',
        moveColumnRight        : 'Pomeri L{TaskBoard.column} udesno',
        moveColumnUp           : 'Pomeri L{TaskBoard.column} nagore',
        moveColumnDown         : 'Pomeri L{TaskBoard.column} nadole',
        moveColumnOutOfGroup   : 'Pomeri L{TaskBoard.column} izvan grupe',
        moveColumnIntoGroup    : 'Pomeri L{TaskBoard.column} u grupu',
        groupWithLeftNeighbor  : 'Групиши са левим суседним L{TaskBoard.column}',
        groupWithRightNeighbor : 'Групиши са десним суседним L{TaskBoard.column}',
        name                   : 'Ime',
        newTaskName            : 'Novi L{TaskBoard.task}',
        removeTask             : 'Ukloni L{TaskBoard.task}',
        removeTasks            : 'Ukloni L{TaskBoard.tasks}',
        resources              : 'Resursi',
        save                   : 'Sačuvaj',
        scrollToColumn         : 'Idi na L{TaskBoard.column}',
        scrollToSwimlane       : 'Idi na L{TaskBoard.swimlane}',
        showColumnMenu         : 'Prikaži meni kolone',
        showTask               : 'Prikaži L{TaskBoard.task}',
        unassigned             : 'Nedodeljeno',
        zoom                   : 'Zum'
    },

    ColumnFilters : {
        show         : 'Prikaži filter kolone',
        toggle       : 'Prebaci filter kolone',
        clear        : 'Obriši filtere kolona',
        badgeTooltip : count => `${count} filter(a) primenjen(a)`
    },

    ColumnSort : {
        sort     : 'Sortiraj kolonu',
        sortedBy : ({ label, ascending }) =>
            `Kolona sortirana ${ascending ? 'rastuće' : 'opadajuće'} po "${label}"`,
        reset : 'Poništi sortiranje kolona'
    },

    TaskMenuItem : {
        showTaskMenu : 'Prikaži meni zadataka'
    },

    TodoListField : {
        add     : 'Dodaj',
        newTodo : 'Novo zaduženje'
    },

    UndoRedo : {
        UndoLastAction : 'Opozovi',
        RedoLastAction : 'Uradi ponovo'
    },

    ColumnRename : {
        rename : 'Preimenuj'
    },

    ColumnSearchField : {
        search    : 'Pretraga',
        matchMode : (mode) => `Režim pretrage: ${mode}`,
        literal   : 'Literalno',
        and       : 'Sve reči (AND)',
        or        : 'Bilo koja reč (OR)'
    }
};

export default LocaleHelper.publishLocale(locale);
