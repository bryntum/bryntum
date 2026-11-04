import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Ca.js';

const locale = {

    localeName : 'Ca',
    localeDesc : 'Català',
    localeCode : 'ca-ES',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'La càrrega de dades ha fallat',
        syncFailedMessage : 'La sincronització de dades ha fallat'
    },

    CrudManagerView : {
        serverResponseLabel : 'Resposta del servidor:'
    },

    TaskBoard : {
        column                 : 'columna',
        columns                : 'columnes',
        Columns                : 'Columnes',
        swimlane               : 'línia de flux',
        swimlanes              : 'línies de flux',
        Swimlanes              : 'Línies de flux',
        task                   : 'tasca',
        tasks                  : 'tasques',
        addTask                : 'Afegeix L{TaskBoard.task}',
        cancel                 : 'Cancel·la',
        changeColumn           : 'Canvia L{TaskBoard.column}',
        changeSwimlane         : 'Canvia L{TaskBoard.swimlane}',
        collapse               : text => `Redueix ${text}`,
        color                  : 'Color',
        description            : 'Descripció',
        editTask               : 'Edita L{TaskBoard.task}',
        expand                 : text => `Expandeix ${text}`,
        filterColumns          : 'Filtra L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtra L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtra L{TaskBoard.tasks}',
        lock                   : 'Bloqueig',
        unlock                 : 'Desbloqueja',
        moveColumnLeft         : "Mou L{TaskBoard.column} cap a l'esquerra",
        moveColumnRight        : 'Mou L{TaskBoard.column} cap a la dreta',
        moveColumnUp           : 'Mou L{TaskBoard.column} cap amunt',
        moveColumnDown         : 'Mou L{TaskBoard.column} cap avall',
        moveColumnOutOfGroup   : 'Mou L{TaskBoard.column} fora del grup',
        moveColumnIntoGroup    : 'Mou L{TaskBoard.column} al grup',
        groupWithLeftNeighbor  : "Agrupa amb L{TaskBoard.column} veí de l'esquerra",
        groupWithRightNeighbor : 'Agrupa amb L{TaskBoard.column} veí de la dreta',
        name                   : 'Nom',
        newTaskName            : 'L{TaskBoard.task} nou',
        removeTask             : 'Elimina L{TaskBoard.task}',
        removeTasks            : 'Elimina L{TaskBoard.tasks}',
        resources              : 'Recursos',
        save                   : 'Desa',
        scrollToColumn         : 'Ves a L{TaskBoard.column}',
        scrollToSwimlane       : 'Ves a L{TaskBoard.swimlane}',
        showColumnMenu         : 'Mostra el menú de la columna',
        showTask               : 'Mostra L{TaskBoard.task}',
        unassigned             : 'Sense assignar',
        zoom                   : 'Zoom'
    },

    ColumnFilters : {
        show         : 'Mostra el filtre de columna',
        toggle       : 'Alterna el filtre de columna',
        clear        : 'Esborra els filtres de columna',
        badgeTooltip : count => `${count} filtre(s) aplicat(s)`
    },

    ColumnSort : {
        sort     : 'Ordena la columna',
        sortedBy : ({ label, ascending }) =>
            `Columna ordenada ${ascending ? 'ascendent' : 'descendent'} per "${label}"`,
        reset : "Restableix l'ordenació de columnes"
    },

    TaskMenuItem : {
        showTaskMenu : 'Mostra el menú de tasques'
    },

    TodoListField : {
        add     : 'Afegeix',
        newTodo : 'Tasca pendent nova'
    },

    UndoRedo : {
        UndoLastAction : 'Desfés',
        RedoLastAction : 'Refés'
    },

    ColumnRename : {
        rename : 'Canvia el nom'
    },

    ColumnSearchField : {
        search    : 'Cerca',
        matchMode : (mode) => `Mode de cerca: ${mode}`,
        literal   : 'Literal',
        and       : 'Totes les paraules (I)',
        or        : 'Qualsevol paraula (O)'
    }
};

export default LocaleHelper.publishLocale(locale);
