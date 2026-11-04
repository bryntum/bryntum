import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Hr.js';

const locale = {

    localeName : 'Hr',
    localeDesc : 'Hrvatski',
    localeCode : 'hr',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Učitavanje podataka nije uspjelo!',
        syncFailedMessage : 'Sinkronizacija podataka nije uspjela!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Odgovor poslužitelja:'
    },

    TaskBoard : {
        column                 : 'stupac',
        columns                : 'stupci',
        Columns                : 'Stupci',
        swimlane               : 'staza',
        swimlanes              : 'staze',
        Swimlanes              : 'Staze',
        task                   : 'zadatak',
        tasks                  : 'zadaci',
        addTask                : 'Dodaj L{TaskBoard.task}',
        cancel                 : 'Otkaži',
        changeColumn           : 'Promijeni L{TaskBoard.column}',
        changeSwimlane         : 'Promijeni L{TaskBoard.swimlane}',
        collapse               : text => `Sažmi ${text}`,
        color                  : 'Boja',
        description            : 'Opis',
        editTask               : 'Uredi L{TaskBoard.task}',
        expand                 : text => `Proširi ${text}`,
        filterColumns          : 'Filtriraj L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtriraj L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtriraj L{TaskBoard.tasks}',
        lock                   : 'brava',
        unlock                 : 'Otključati',
        moveColumnLeft         : 'Pomakni L{TaskBoard.column} lijevo',
        moveColumnRight        : 'Pomakni L{TaskBoard.column} desno',
        moveColumnUp           : 'Pomakni L{TaskBoard.column} gore',
        moveColumnDown         : 'Pomakni L{TaskBoard.column} dolje',
        moveColumnOutOfGroup   : 'Pomakni L{TaskBoard.column} izvan grupe',
        moveColumnIntoGroup    : 'Pomakni L{TaskBoard.column} u grupu',
        groupWithLeftNeighbor  : 'Grupiraj s lijevim susjednim L{TaskBoard.column}',
        groupWithRightNeighbor : 'Grupiraj s desnim susjednim L{TaskBoard.column}',
        name                   : 'Naziv',
        newTaskName            : 'Novi L{TaskBoard.task}',
        removeTask             : 'Ukloni L{TaskBoard.task}',
        removeTasks            : 'Ukloni L{TaskBoard.tasks}',
        resources              : 'Resursi',
        save                   : 'Spremi',
        scrollToColumn         : 'Pomakni se do L{TaskBoard.column}',
        scrollToSwimlane       : 'Pomakni se do L{TaskBoard.swimlane}',
        showColumnMenu         : 'Prikaži izbornik stupca',
        showTask               : 'Prikaži L{TaskBoard.task}',
        unassigned             : 'Nedodijeljeno',
        zoom                   : 'Povećaj ili smanji'
    },

    ColumnFilters : {
        show         : 'Prikaži filtar stupca',
        toggle       : 'Prebaci filtar stupca',
        clear        : 'Očisti filtre stupaca',
        badgeTooltip : count => `${count} filtar(a) primijenjeno`
    },

    ColumnSort : {
        sort     : 'Sortiraj stupac',
        sortedBy : ({ label, ascending }) =>
            `Stupac sortiran ${ascending ? 'uzlazno' : 'silazno'} prema "${label}"`,
        reset : 'Poništi sortiranje stupaca'
    },

    TaskMenuItem : {
        showTaskMenu : 'Prikaži izbornik zadataka'
    },

    TodoListField : {
        add     : 'Dodaj',
        newTodo : 'Nova obaveza'
    },

    UndoRedo : {
        UndoLastAction : 'Poništi',
        RedoLastAction : 'Vrati poništeno'
    },

    ColumnRename : {
        rename : 'Preimenuj'
    },

    ColumnSearchField : {
        search    : 'Pretraži',
        matchMode : (mode) => `Način pretraživanja: ${mode}`,
        literal   : 'Doslovno',
        and       : 'Sve riječi (I)',
        or        : 'Bilo koja riječ (ILI)'
    }
};

export default LocaleHelper.publishLocale(locale);
