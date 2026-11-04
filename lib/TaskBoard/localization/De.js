import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/De.js';

const locale = {

    localeName : 'De',
    localeDesc : 'Deutsch',
    localeCode : 'de-DE',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Das Laden der Daten ist fehlgeschlagen!',
        syncFailedMessage : 'Datensynchronisation fehlgeschlagen!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Serverantwort:'
    },

    TaskBoard : {
        column                 : 'spalte',
        columns                : 'spalten',
        Columns                : 'Spalten',
        swimlane               : 'swimlane',
        swimlanes              : 'swimlanes',
        Swimlanes              : 'Swimlanes',
        task                   : 'Aufgabe',
        tasks                  : 'Aufgaben',
        addTask                : 'Hinzufügen L{TaskBoard.task}',
        cancel                 : 'Abbrechen',
        changeColumn           : 'ändern L{TaskBoard.column}',
        changeSwimlane         : 'ändern L{TaskBoard.swimlane}',
        collapse               : text => `Einklappen ${text}`,
        color                  : 'farbe',
        description            : 'Beschreibung',
        editTask               : 'L{TaskBoard.task} bearbeiten',
        expand                 : text => `Ausklappen ${text}`,
        filterColumns          : 'Filtern L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtern L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtern L{TaskBoard.tasks}',
        lock                   : 'Sperren',
        unlock                 : 'Entsperren',
        moveColumnLeft         : 'Bewegen L{TaskBoard.column} nach links',
        moveColumnRight        : 'Bewegen L{TaskBoard.column} nach rechts',
        moveColumnUp           : 'Bewegen L{TaskBoard.column} nach oben',
        moveColumnDown         : 'Bewegen L{TaskBoard.column} nach unten',
        moveColumnOutOfGroup   : 'Bewegen L{TaskBoard.column} aus der Gruppe',
        moveColumnIntoGroup    : 'Bewegen L{TaskBoard.column} in die Gruppe',
        groupWithLeftNeighbor  : 'Gruppieren mit linker Nachbar-L{TaskBoard.column}',
        groupWithRightNeighbor : 'Gruppieren mit rechter Nachbar-L{TaskBoard.column}',
        name                   : 'Name',
        newTaskName            : 'Neu L{TaskBoard.task}',
        removeTask             : 'Löschen L{TaskBoard.task}',
        removeTasks            : 'Löschen L{TaskBoard.tasks}',
        resources              : 'Ressourcen',
        save                   : 'Speichern',
        scrollToColumn         : 'Scrollen zu L{TaskBoard.column}',
        scrollToSwimlane       : 'Scrollen zu L{TaskBoard.swimlane}',
        showColumnMenu         : 'Spaltenmenü anzeigen',
        showTask               : 'L{TaskBoard.task} anzeigen',
        unassigned             : 'Nicht zugewiesen',
        zoom                   : 'Zoomen'
    },

    ColumnFilters : {
        show         : 'Spaltenfilter anzeigen',
        toggle       : 'Spaltenfilter umschalten',
        clear        : 'Spaltenfilter löschen',
        badgeTooltip : count => `${count} Filter angewendet`
    },

    ColumnSort : {
        sort     : 'Spalte sortieren',
        sortedBy : ({ label, ascending }) =>
            `Spalte ${ascending ? 'aufsteigend' : 'absteigend'} sortiert nach "${label}"`,
        reset : 'Spaltensortierung zurücksetzen'
    },

    TaskMenuItem : {
        showTaskMenu : 'Aufgabenmenü anzeigen'
    },

    TodoListField : {
        add     : 'Hinzufügen',
        newTodo : 'Neues To-Do'
    },

    UndoRedo : {
        UndoLastAction : 'Rückgängig machen',
        RedoLastAction : 'Wiederholen'
    },

    ColumnRename : {
        rename : 'Umbenennen'
    },

    ColumnSearchField : {
        search    : 'Suchen',
        matchMode : (mode) => `Suchmodus: ${mode}`,
        literal   : 'Wörtlich',
        and       : 'Alle Wörter (UND)',
        or        : 'Beliebiges Wort (ODER)'
    }
};

export default LocaleHelper.publishLocale(locale);
