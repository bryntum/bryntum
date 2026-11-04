import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Pl.js';

const locale = {

    localeName : 'Pl',
    localeDesc : 'Polski',
    localeCode : 'pl',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Ładowanie danych nie powiodło się',
        syncFailedMessage : 'Synchronizacja danych nie powiodła się! '
    },

    CrudManagerView : {
        serverResponseLabel : 'Odpowiedź serwera:'
    },

    TaskBoard : {
        column                 : 'kolumna',
        columns                : 'kolumny',
        Columns                : 'Kolumny',
        swimlane               : 'swimlane',
        swimlanes              : 'diagramy sekwencji działań',
        Swimlanes              : 'Diagramy sekwencji działań',
        task                   : 'zadanie',
        tasks                  : 'zadania',
        addTask                : 'Dodaj L{TaskBoard.task}',
        cancel                 : 'Anuluj',
        changeColumn           : 'Zmień L{TaskBoard.column}',
        changeSwimlane         : 'Zmień L{TaskBoard.swimlane}',
        collapse               : text => `Zwiń ${text}`,
        color                  : 'Pokoloruj',
        description            : 'Opis',
        editTask               : 'Edytuj L{TaskBoard.task}',
        expand                 : text => `Expand ${text}`,
        filterColumns          : 'Filtr L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtr L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtr L{TaskBoard.tasks}',
        lock                   : 'Zamek',
        unlock                 : 'Odblokować',
        moveColumnLeft         : 'Przenieś na lewo {TaskBoard.column}',
        moveColumnRight        : 'Przenieś na prawo{TaskBoard.column}',
        moveColumnUp           : 'Przenieś L{TaskBoard.column} w górę',
        moveColumnDown         : 'Przenieś L{TaskBoard.column} w dół',
        moveColumnOutOfGroup   : 'Przenieś L{TaskBoard.column} poza grupę',
        moveColumnIntoGroup    : 'Przenieś L{TaskBoard.column} do grupy',
        groupWithLeftNeighbor  : 'Grupuj z lewym sąsiednim L{TaskBoard.column}',
        groupWithRightNeighbor : 'Grupuj z prawym sąsiednim L{TaskBoard.column}',
        name                   : 'Nazwa',
        newTaskName            : 'Nowy L{TaskBoard.task}',
        removeTask             : 'Usuń L{TaskBoard.task}',
        removeTasks            : 'Usuń L{TaskBoard.tasks}',
        resources              : 'Zasoby',
        save                   : 'Zapisz',
        scrollToColumn         : 'Przewiń do L{TaskBoard.column}',
        scrollToSwimlane       : 'Przewiń do L{TaskBoard.swimlane}',
        showColumnMenu         : 'Pokaż menu kolumny',
        showTask               : 'Pokaż L{TaskBoard.task}',
        unassigned             : 'Nieprzypisane',
        zoom                   : 'Zoom'
    },

    ColumnFilters : {
        show         : 'Pokaż filtr kolumny',
        toggle       : 'Przełącz filtr kolumny',
        clear        : 'Wyczyść filtry kolumn',
        badgeTooltip : count => `${count} filtr(y) zastosowane`
    },

    ColumnSort : {
        sort     : 'Sortuj kolumnę',
        sortedBy : ({ label, ascending }) =>
            `Kolumna posortowana ${ascending ? 'rosnąco' : 'malejąco'} według "${label}"`,
        reset : 'Resetuj sortowanie kolumn'
    },

    TaskMenuItem : {
        showTaskMenu : 'Pokaż menu zadań'
    },

    TodoListField : {
        add     : 'Dodaj',
        newTodo : 'Nowa lista zadań do wykonania'
    },

    UndoRedo : {
        UndoLastAction : 'Cofnij',
        RedoLastAction : 'Powtórz'
    },

    ColumnRename : {
        rename : 'Zmień nazwę'
    },

    ColumnSearchField : {
        search    : 'Szukaj',
        matchMode : (mode) => `Tryb wyszukiwania: ${mode}`,
        literal   : 'Dosłowny',
        and       : 'Wszystkie słowa (AND)',
        or        : 'Dowolne słowo (OR)'
    }
};

export default LocaleHelper.publishLocale(locale);
