import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/PtBr.js';

const locale = {

    localeName : 'PtBr',
    localeDesc : 'Português do Brasil',
    localeCode : 'pt-BR',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Falha no carregamento dos dados!',
        syncFailedMessage : 'Falha na sincronização dos dados!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Resposta do servidor:'
    },

    TaskBoard : {
        column                 : 'coluna',
        columns                : 'colunas',
        Columns                : 'Colunas',
        swimlane               : 'swimlane',
        swimlanes              : 'swimlanes',
        Swimlanes              : 'Swimlanes',
        task                   : 'tarefa',
        tasks                  : 'tarefas',
        addTask                : 'Adicionar L{TaskBoard.task}',
        cancel                 : 'Cancelar',
        changeColumn           : 'Alterar L {TaskBoard.column}',
        changeSwimlane         : 'Alterar L {TaskBoard.swimlane}',
        collapse               : text => `Colapsar ${text}`,
        color                  : 'Cor',
        description            : 'Descrição',
        editTask               : 'Editar L{TaskBoard.task}',
        expand                 : text => `Expandir ${text}`,
        filterColumns          : 'Filtrar L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtrar L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtrar L{TaskBoard.tasks}',
        lock                   : 'Trancar',
        unlock                 : 'Desbloquear',
        moveColumnLeft         : 'Mover L{TaskBoard.column} para a esquerda',
        moveColumnRight        : 'Mover L{TaskBoard.column} para a direita',
        moveColumnUp           : 'Mover L{TaskBoard.column} para cima',
        moveColumnDown         : 'Mover L{TaskBoard.column} para baixo',
        moveColumnOutOfGroup   : 'Mover L{TaskBoard.column} para fora do grupo',
        moveColumnIntoGroup    : 'Mover L{TaskBoard.column} para o grupo',
        groupWithLeftNeighbor  : 'Agrupar com L{TaskBoard.column} vizinho da esquerda',
        groupWithRightNeighbor : 'Agrupar com L{TaskBoard.column} vizinho da direita',
        name                   : 'Nome',
        newTaskName            : 'Nova L{TaskBoard.task}',
        removeTask             : 'Remover L{TaskBoard.task}',
        removeTasks            : 'Remover L{TaskBoard.tasks}',
        resources              : 'Recursos',
        save                   : 'Guardar',
        scrollToColumn         : 'Deslizar para L{TaskBoard.column}',
        scrollToSwimlane       : 'Deslizar para L{TaskBoard.swimlane}',
        showColumnMenu         : 'Mostrar menu da coluna',
        showTask               : 'Mostrar L{TaskBoard.task}',
        unassigned             : 'Não atribuído',
        zoom                   : 'Zoom'
    },

    ColumnFilters : {
        show         : 'Mostrar filtro de coluna',
        toggle       : 'Alternar filtro de coluna',
        clear        : 'Limpar filtros de coluna',
        badgeTooltip : count => `${count} filtro(s) aplicado(s)`
    },

    ColumnSort : {
        sort     : 'Ordenar coluna',
        sortedBy : ({ label, ascending }) =>
            `Coluna ordenada ${ascending ? 'crescente' : 'decrescente'} por "${label}"`,
        reset : 'Redefinir a ordenação da coluna'
    },

    TaskMenuItem : {
        showTaskMenu : 'Mostrar menu de tarefas'
    },

    TodoListField : {
        add     : 'Adicionar',
        newTodo : 'Novo todo'
    },

    UndoRedo : {
        UndoLastAction : 'Desfazer',
        RedoLastAction : 'Refazer'
    },

    ColumnRename : {
        rename : 'Renomear'
    },

    ColumnSearchField : {
        search    : 'Pesquisar',
        matchMode : (mode) => `Modo de busca: ${mode}`,
        literal   : 'Literal',
        and       : 'Todas as palavras (E)',
        or        : 'Qualquer palavra (OU)'
    }
};

export default LocaleHelper.publishLocale(locale);
