import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Gl.js';

const locale = {

    localeName : 'Gl',
    localeDesc : 'Galego',
    localeCode : 'gl-ES',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Erro ao cargar os datos',
        syncFailedMessage : 'Erro na sincronización dos datos'
    },

    CrudManagerView : {
        serverResponseLabel : 'Resposta do servidor:'
    },

    TaskBoard : {
        column                 : 'columna',
        columns                : 'columnas',
        Columns                : 'Columnas',
        swimlane               : 'carril',
        swimlanes              : 'carrís',
        Swimlanes              : 'Carrís',
        task                   : 'tarefa',
        tasks                  : 'tarefas',
        addTask                : 'Engadir L{TaskBoard.task}',
        cancel                 : 'Cancelar',
        changeColumn           : 'Modificar L{TaskBoard.column}',
        changeSwimlane         : 'Modificar L{TaskBoard.swimlane}',
        collapse               : text => `Contraer ${text}`,
        color                  : 'Cor',
        description            : 'Descrición',
        editTask               : 'Editar L{TaskBoard.task}',
        expand                 : text => `Expandir ${text}`,
        filterColumns          : 'Filtrar L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtrar L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtrar L{TaskBoard.tasks}',
        lock                   : 'Bloqueo',
        unlock                 : 'Desbloquear',
        moveColumnLeft         : 'Mover L{TaskBoard.column} á esquerda',
        moveColumnRight        : 'Mover L{TaskBoard.column} á dereita',
        moveColumnUp           : 'Mover L{TaskBoard.column} arriba',
        moveColumnDown         : 'Mover L{TaskBoard.column} abaixo',
        moveColumnOutOfGroup   : 'Mover L{TaskBoard.column} fóra do grupo',
        moveColumnIntoGroup    : 'Mover L{TaskBoard.column} ao grupo',
        groupWithLeftNeighbor  : 'Agrupar con L{TaskBoard.column} veciño esquerdo',
        groupWithRightNeighbor : 'Agrupar con L{TaskBoard.column} veciño dereito',
        name                   : 'Nome',
        newTaskName            : 'Nova L{TaskBoard.task}',
        removeTask             : 'Eliminar L{TaskBoard.task}',
        removeTasks            : 'Eliminar L{TaskBoard.tasks}',
        resources              : 'Recursos',
        save                   : 'Gardar',
        scrollToColumn         : 'Desprazar a L{TaskBoard.column}',
        scrollToSwimlane       : 'Desprazar o L{TaskBoard.swimlane}',
        showColumnMenu         : 'Amosar o menú da columna',
        showTask               : 'Amosar L{TaskBoard.task}',
        unassigned             : 'Sen asignar',
        zoom                   : 'Zoom'
    },

    ColumnFilters : {
        show         : 'Mostrar filtro de columna',
        toggle       : 'Alternar filtro de columna',
        clear        : 'Limpar filtros de columna',
        badgeTooltip : count => `${count} filtro(s) aplicados`
    },

    ColumnSort : {
        sort     : 'Ordenar columna',
        sortedBy : ({ label, ascending }) =>
            `Columna ordenada ${ascending ? 'ascendente' : 'descendente'} por "${label}"`,
        reset : 'Restablecer a orde das columnas'
    },

    TaskMenuItem : {
        showTaskMenu : 'Amosar o menú de tarefas'
    },

    TodoListField : {
        add     : 'Engadir',
        newTodo : 'Nova tarefa pendente'
    },

    UndoRedo : {
        UndoLastAction : 'Desfacer',
        RedoLastAction : 'Refacer'
    },

    ColumnRename : {
        rename : 'Cambiar o nome'
    },

    ColumnSearchField : {
        search    : 'Buscar',
        matchMode : (mode) => `Modo de busca: ${mode}`,
        literal   : 'Literal',
        and       : 'Todas as palabras (AND)',
        or        : 'Calquera palabra (OR)'
    }
};

export default LocaleHelper.publishLocale(locale);
