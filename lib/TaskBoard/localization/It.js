import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/It.js';

const locale = {

    localeName : 'It',
    localeDesc : 'Italiano',
    localeCode : 'it',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Caricamento dati non riuscito!',
        syncFailedMessage : 'Sincronizzazione dati non riuscita!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Risposta del server:'
    },

    TaskBoard : {
        column                 : 'colonna',
        columns                : 'colonne',
        Columns                : 'Colonne',
        swimlane               : 'swim lane',
        swimlanes              : 'swim lane',
        Swimlanes              : 'Swim lane',
        task                   : 'attività',
        tasks                  : 'attività',
        addTask                : 'Aggiungi L{TaskBoard.task}',
        cancel                 : 'Annulla',
        changeColumn           : 'Cambia L{TaskBoard.column}',
        changeSwimlane         : 'Cambia L{TaskBoard.swimlane}',
        collapse               : text => `Comprimi ${text}`,
        color                  : 'Colore',
        description            : 'Descrizione',
        editTask               : 'Modifica L{TaskBoard.task}',
        expand                 : text => `Espandi ${text}`,
        filterColumns          : 'Filtra L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtra L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtra L{TaskBoard.tasks}',
        lock                   : 'Serratura',
        unlock                 : 'Sbloccare',
        moveColumnLeft         : 'Sposta L{TaskBoard.column} a sinistra',
        moveColumnRight        : 'Sposta L{TaskBoard.column} a destra',
        moveColumnUp           : 'Sposta L{TaskBoard.column} in alto',
        moveColumnDown         : 'Sposta L{TaskBoard.column} in basso',
        moveColumnOutOfGroup   : 'Sposta L{TaskBoard.column} fuori dal gruppo',
        moveColumnIntoGroup    : 'Sposta L{TaskBoard.column} nel gruppo',
        groupWithLeftNeighbor  : 'Raggruppa con L{TaskBoard.column} adiacente a sinistra',
        groupWithRightNeighbor : 'Raggruppa con L{TaskBoard.column} adiacente a destra',
        name                   : 'Nome',
        newTaskName            : 'Nuovo L{TaskBoard.task}',
        removeTask             : 'Rimuovi L{TaskBoard.task}',
        removeTasks            : 'Rimuovi L{TaskBoard.tasks}',
        resources              : 'Risorse',
        save                   : 'Salva',
        scrollToColumn         : 'Scorri fino a L{TaskBoard.column}',
        scrollToSwimlane       : 'Scorri fino a L{TaskBoard.swimlane}',
        showColumnMenu         : 'Mostra menu colonna',
        showTask               : 'Mostra L{TaskBoard.task}',
        unassigned             : 'Non assegnato',
        zoom                   : 'Zoom'
    },

    ColumnFilters : {
        show         : 'Mostra filtro colonna',
        toggle       : 'Attiva/disattiva filtro colonna',
        clear        : 'Cancella filtri colonna',
        badgeTooltip : count => `${count} filtro/i applicato/i`
    },

    ColumnSort : {
        sort     : 'Ordina colonna',
        sortedBy : ({ label, ascending }) =>
            `Colonna ordinata ${ascending ? 'in ordine crescente' : 'in ordine decrescente'} per "${label}"`,
        reset : "Reimposta l'ordinamento delle colonne"
    },

    TaskMenuItem : {
        showTaskMenu : 'Mostra menu attività'
    },

    TodoListField : {
        add     : 'Aggiungi',
        newTodo : 'Nuovo elemento da fare'
    },

    UndoRedo : {
        UndoLastAction : 'Annulla',
        RedoLastAction : 'Ripeti'
    },

    ColumnRename : {
        rename : 'Rinomina'
    },

    ColumnSearchField : {
        search    : 'Cerca',
        matchMode : (mode) => `Modalità di ricerca: ${mode}`,
        literal   : 'Letterale',
        and       : 'Tutte le parole (AND)',
        or        : 'Qualsiasi parola (OR)'
    }
};

export default LocaleHelper.publishLocale(locale);
