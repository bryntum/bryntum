import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Es.js';

const locale = {

    localeName : 'Es',
    localeDesc : 'Español',
    localeCode : 'es',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Fallo al cargar los datos',
        syncFailedMessage : 'Fallo al sincronizar los datos'
    },

    CrudManagerView : {
        serverResponseLabel : 'Respuesta del servidor:'
    },

    TaskBoard : {
        column                 : 'columna',
        columns                : 'columnas',
        Columns                : 'Columnas',
        swimlane               : 'carril',
        swimlanes              : 'carriles',
        Swimlanes              : 'Carriles',
        task                   : 'tarea',
        tasks                  : 'tareas',
        addTask                : 'Añadir L{TaskBoard.task}',
        cancel                 : 'Cancelar',
        changeColumn           : 'Cambiar L{TaskBoard.column}',
        changeSwimlane         : 'Cambiar L{TaskBoard.swimlane}',
        collapse               : text => `Contraer ${text}`,
        color                  : 'Color',
        description            : 'Descripción',
        editTask               : 'Editar L{TaskBoard.task}',
        expand                 : text => `Expandir ${text}`,
        filterColumns          : 'Filtrar L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtrar L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtrar L{TaskBoard.tasks}',
        lock                   : 'Cerrar',
        unlock                 : 'Descubrir',
        moveColumnLeft         : 'Mover L{TaskBoard.column} a la izquierda',
        moveColumnRight        : 'Mover L{TaskBoard.column} a la derecha',
        moveColumnUp           : 'Mover L{TaskBoard.column} hacia arriba',
        moveColumnDown         : 'Mover L{TaskBoard.column} hacia abajo',
        moveColumnOutOfGroup   : 'Mover L{TaskBoard.column} fuera del grupo',
        moveColumnIntoGroup    : 'Mover L{TaskBoard.column} al grupo',
        groupWithLeftNeighbor  : 'Agrupar con L{TaskBoard.column} vecino izquierdo',
        groupWithRightNeighbor : 'Agrupar con L{TaskBoard.column} vecino derecho',
        name                   : 'Nombre',
        newTaskName            : 'Nueva L{TaskBoard.task}',
        removeTask             : 'Quitar L{TaskBoard.task}',
        removeTasks            : 'Quitar L{TaskBoard.tasks}',
        resources              : 'Recursos',
        save                   : 'Guardar',
        scrollToColumn         : 'Desplazarse hasta L{TaskBoard.column}',
        scrollToSwimlane       : 'Desplazarse hasta L{TaskBoard.swimlane}',
        showColumnMenu         : 'Mostrar menú de columna',
        showTask               : 'Mostrar L{TaskBoard.task}',
        unassigned             : 'No asignado',
        zoom                   : 'Zoom'
    },

    ColumnFilters : {
        show         : 'Mostrar filtro de columna',
        toggle       : 'Alternar filtro de columna',
        clear        : 'Borrar filtros de columna',
        badgeTooltip : count => `${count} filtro(s) aplicado(s)`
    },

    ColumnSort : {
        sort     : 'Ordenar columna',
        sortedBy : ({ label, ascending }) =>
            `Columna ordenada ${ascending ? 'ascendente' : 'descendente'} por "${label}"`,
        reset : 'Restablecer el orden de las columnas'
    },

    TaskMenuItem : {
        showTaskMenu : 'Mostrar menú de tareas'
    },

    TodoListField : {
        add     : 'Añadir',
        newTodo : 'Nueva tarea pendiente'
    },

    UndoRedo : {
        UndoLastAction : 'Deshacer',
        RedoLastAction : 'Rehacer'
    },

    ColumnRename : {
        rename : 'Renombrar'
    },

    ColumnSearchField : {
        search    : 'Buscar',
        matchMode : (mode) => `Modo de búsqueda: ${mode}`,
        literal   : 'Literal',
        and       : 'Todas las palabras (Y)',
        or        : 'Cualquier palabra (O)'
    }
};

export default LocaleHelper.publishLocale(locale);
