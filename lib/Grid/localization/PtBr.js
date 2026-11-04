import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/PtBr.js';

const emptyString = new String();

const locale = {

    localeName : 'PtBr',
    localeDesc : 'Português do Brasil',
    localeCode : 'pt-BR',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Buscar',
        selectAll   : 'Selecionar Tudo',
        removeAll   : 'Remover Tudo',
        filtersSet  : n => n === 1 ? `1 filtro definido` : `${n} filtros definidos`,
        noItems     : 'Nenhum resultado encontrado',
        placeholder : 'Filtrar...',
        apply       : 'Aplicar'
    },

    ColumnPicker : {
        column          : 'Coluna',
        columnsMenu     : 'Colunas',
        hideColumn      : 'Ocultar colunas',
        hideColumnShort : 'Ocultar',
        newColumns      : 'Novas colunas',
        allColumns      : 'Todas as colunas',
        showName        : column => `Mostrar coluna${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Ocultar coluna${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Aplicar filtro',
        filter        : 'Filtro',
        editFilter    : 'Editar filtro',
        on            : 'em',
        before        : 'Antes',
        after         : 'Depois',
        equals        : 'Igual a',
        lessThan      : 'Inferior a',
        moreThan      : 'Superior a',
        removeFilter  : 'Remover filtro',
        disableFilter : 'Desativar filtro'
    },

    FilterBar : {
        enableFilterBar  : 'Mostrar barra de filtro',
        disableFilterBar : 'Ocultar barra de filtro'
    },

    Group : {
        group                : 'Agrupar',
        groupAscending       : 'Agrupar por ordem ascendente',
        groupDescending      : 'Agrupar por ordem descendente',
        groupAscendingShort  : 'Ascendente',
        groupDescendingShort : 'Descendente',
        stopGrouping         : 'Parar agrupamento',
        stopGroupingShort    : 'Parar'
    },

    HeaderMenu : {
        moveBefore     : text => `Mover para antes de "${text}"`,
        moveAfter      : text => `Mover para depois de "${text}"`,
        collapseColumn : 'Minimizar coluna',
        expandColumn   : 'Ampliar coluna'
    },

    ColumnRename : {
        rename : 'Renomear'
    },

    ColumnResize : {
        resizeColumn : 'Redimensionar coluna',
        width        : 'Largura',
        fitToData    : 'Ajustar aos dados'
    },

    MergeCells : {
        mergeCells  : 'Unir céculas',
        menuTooltip : 'Unir células com o mesmo valor quando ordenadas por esta coluna'
    },

    Search : {
        searchForValue : 'Pesquisar por valor'
    },

    Sort : {
        sort                   : 'Ordenar',
        sortAscending          : 'Ordenar por ordem ascendente',
        sortDescending         : 'Ordenar por ordem descendente',
        multiSort              : 'Ordenação múltipla',
        removeSorter           : 'Remover ordenação',
        addSortAscending       : 'Adicionar ordenação ascendente',
        addSortDescending      : 'Adicionar ordenação descendente',
        toggleSortAscending    : 'Alterar para ascendente',
        toggleSortDescending   : 'Alterar para descendente',
        sortAscendingShort     : 'Ascendente',
        sortDescendingShort    : 'Descendente',
        removeSorterShort      : 'Remover',
        addSortAscendingShort  : '+ Ascendente',
        addSortDescendingShort : '+ Descendente'
    },

    Split : {
        split        : 'Dividido',
        unsplit      : 'Não dividido',
        horizontally : 'Horizontalmente',
        vertically   : 'Verticalmente',
        both         : 'Ambos',
        top          : 'superior',
        bottom       : 'inferior',
        left         : 'esquerda',
        right        : 'direita'
    },

    LockRows : {
        lockRow   : 'Bloquear linha',
        unlockRow : 'Desbloquear linha'
    },

    ActionColumn : {
        rowActions : 'Ações da linha'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} coluna. ` : ''}ESPAÇO para menu de contexto${column.canSort ? ', ENTER para ordenar' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Widgets de linha'
    },

    Checkbox : {
        toggleRowSelect : 'Ativar/desativar seleção de fila',
        toggleSelection : 'Ativar/desativar seleção de todo o conjunto de dados',
        toggleName      : column => `Alternar ${column.text || 'valor'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `avaliação ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Número da linha'
    },

    GridBase : {
        loadFailedMessage  : 'O carregamento de dados falhou!',
        syncFailedMessage  : 'A sincronização de dados falhou!',
        unspecifiedFailure : 'Falha não especificada',
        networkFailure     : 'Erro de rede',
        parseFailure       : 'Falha ao analisar a resposta do servidor',
        serverResponse     : 'Resposta do servidor:',
        noRows             : 'Sem registos para exibir',
        moveColumnLeft     : 'Mover para a seção esquerda',
        moveColumnRight    : 'Mover para a seção direita',
        moveColumnTo       : region => `Mover coluna para ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 linha corresponde ao filtro` : `${n} linhas correspondem ao filtro`) : 'Nenhuma linha corresponde ao filtro'
    },

    CellMenu : {
        removeRow : 'Remover'
    },

    RowCopyPaste : {
        copyRecord  : 'Copiar',
        cutRecord   : 'Cortar',
        pasteRecord : 'Colar',
        rows        : 'linhas',
        row         : 'linha'
    },

    CellCopyPaste : {
        copy  : 'Copiar',
        cut   : 'Cortar',
        paste : 'Colar'
    },

    Charts : {
        chartDesigner : 'Designer de Gráficos',
        newChart      : 'Novo Gráfico',
        download      : 'Baixar',
        settings      : 'Configurações'
    },

    PdfExport : {
        'Waiting for response from server' : 'Aguardando resposta do servidor...',
        'Export failed'                    : 'Falha ao exportar',
        'Server error'                     : 'Erro de servidor',
        'Generating pages'                 : 'Gerando páginas...',
        'Click to abort'                   : 'Cancelar'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Exportar definições',
        export         : 'Exportar',
        printSettings  : 'Configurações de impressão',
        print          : 'Imprimir',
        exporterType   : 'Controle de paginação',
        cancel         : 'Cancelar',
        fileFormat     : 'Formato do arquivo',
        rows           : 'Filas',
        alignRows      : 'Alinhar filas',
        columns        : 'Colunas',
        paperFormat    : 'Formato em papel',
        orientation    : 'Orientação',
        repeatHeader   : 'Repetir cabeçalho'
    },

    ExportRowsCombo : {
        all     : 'Todas as filas',
        visible : 'Filas visíveis'
    },

    ExportOrientationCombo : {
        portrait  : 'Retrato',
        landscape : 'Paisagem'
    },

    SinglePageExporter : {
        singlepage : 'Uma página'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Página única (sem escala)'
    },

    MultiPageExporter : {
        multipage     : 'Várias páginas',
        exportingPage : ({ currentPage, totalPages }) => `Exportando página ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : ' Várias páginas (vertical)',
        exportingPage     : ({ currentPage, totalPages }) => `Exportando página ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Carregando',
        expand             : 'Expandir',
        collapse           : 'Fechar',
        columnDescription  : 'Alternar detalhes da linha',
        expandedRowContent : 'Conteúdo da linha expandida'
    },

    TreeGroup : {
        group                  : 'Agrupar por',
        stopGrouping           : 'Parar agrupamento',
        stopGroupingThisColumn : 'Remover agrupamento desta coluna'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Operação de filtro malsucedida, tente novamente'
    },

    AIFilterField : {
        progressText : 'Filtrando'
    },

    PinColumns : {
        pinColumn  : 'Fixar coluna',
        unpin      : 'Desafixar',
        pinToStart : 'Fixar no início',
        pinToEnd   : 'Fixar no fim'
    }
};

export default LocaleHelper.publishLocale(locale);
