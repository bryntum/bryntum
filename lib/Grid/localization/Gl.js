import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Gl.js';

const emptyString = new String();

const locale = {

    localeName : 'Gl',
    localeDesc : 'Galego',
    localeCode : 'gl-ES',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Buscar',
        selectAll   : 'Seleccionar todo',
        removeAll   : 'Quitar todo',
        filtersSet  : n => n === 1 ? `1 filtro configurado` : `${n} filtros configurados`,
        noItems     : 'Non se atoparon resultados',
        placeholder : 'Filtrar...',
        apply       : 'Aplicar'
    },

    ColumnPicker : {
        column          : 'Columna',
        columnsMenu     : 'Columnas',
        hideColumn      : 'Ocultar columna',
        hideColumnShort : 'Ocultar',
        newColumns      : 'Novas columnas',
        allColumns      : 'Todas as columnas',
        showName        : column => `Amosar a columna${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Ocultar a columna${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Aplicar filtro',
        filter        : 'Filtro',
        editFilter    : 'Editar filtro',
        on            : 'Activado',
        before        : 'Antes de',
        after         : 'Despois de',
        equals        : 'Igual a',
        lessThan      : 'Menor que',
        moreThan      : 'Maior que',
        removeFilter  : 'Eliminar filtro',
        disableFilter : 'Desactivar filtro'
    },

    FilterBar : {
        enableFilterBar  : 'Mostrar barra de filtros',
        disableFilterBar : 'Ocultar barra de filtros'
    },

    Group : {
        group                : 'Agrupar',
        groupAscending       : 'Agrupar de forma ascendente',
        groupDescending      : 'Agrupar de forma descendente',
        groupAscendingShort  : 'Ascendente',
        groupDescendingShort : 'Descendente',
        stopGrouping         : 'Deixar de agrupar',
        stopGroupingShort    : 'Deter'
    },

    HeaderMenu : {
        moveBefore     : text => `Mover antes de "${text}"`,
        moveAfter      : text => `Mover despois de "${text}"`,
        collapseColumn : 'Contraer columna',
        expandColumn   : 'Expandir columna'
    },

    ColumnRename : {
        rename : 'Renomear'
    },

    ColumnResize : {
        resizeColumn : 'Redimensionar columna',
        width        : 'Ancho',
        fitToData    : 'Axustar aos datos'
    },

    MergeCells : {
        mergeCells  : 'Combinar celas',
        menuTooltip : 'Combinar celas co mesmo valor cando se clasifican por esta columna'
    },

    Search : {
        searchForValue : 'Buscar valor'
    },

    Sort : {
        sort                   : 'Ordenar',
        sortAscending          : 'Orde ascendente',
        sortDescending         : 'Orde descendente',
        multiSort              : 'Ordenación múltiple',
        removeSorter           : 'Eliminar ordenación',
        addSortAscending       : 'Engadir orde ascendente',
        addSortDescending      : 'Engadir orde descendente',
        toggleSortAscending    : 'Cambiar a ascendente',
        toggleSortDescending   : 'Cambiar a ascendente',
        sortAscendingShort     : 'Ascendente',
        sortDescendingShort    : 'Descendente',
        removeSorterShort      : 'Eliminar',
        addSortAscendingShort  : '+ Ascendente',
        addSortDescendingShort : '+ Descendente'
    },

    Split : {
        split        : 'Dividir',
        unsplit      : 'Cancelar a división',
        horizontally : 'Horizontalmente',
        vertically   : 'Verticalmente',
        both         : 'Ambos',
        top          : 'superior',
        bottom       : 'inferior',
        left         : 'esquerda',
        right        : 'dereita'
    },

    LockRows : {
        lockRow   : 'Fila de bloqueo',
        unlockRow : 'Desbloquear fila'
    },

    ActionColumn : {
        rowActions : 'Accións de fila'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} columna. ` : ''}Espazo para menú contextual${column.canSort ? ', INTRO para ordenar' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Widgets de fila'
    },

    Checkbox : {
        toggleRowSelect : 'Alternar selección de filas',
        toggleSelection : 'Alternar selección de todo o conxunto de datos',
        toggleName      : column => `Alternar ${column.text || 'valor'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `Clasificación de : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Número de fila'
    },

    GridBase : {
        loadFailedMessage  : 'Erro ao cargar os datos',
        syncFailedMessage  : 'Erro na sincronización dos datos',
        unspecifiedFailure : 'Erro non especificado',
        networkFailure     : 'Erro de rede',
        parseFailure       : 'Non se puido analizar a resposta do servidor',
        serverResponse     : 'Resposta do servidor:',
        noRows             : 'Non hai rexistros para mostrar',
        moveColumnLeft     : 'Mover á sección esquerda',
        moveColumnRight    : 'Mover á sección dereita',
        moveColumnTo       : region => `Mover columna a ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 fila coincide co filtro` : `${n} filas coinciden co filtro`) : 'Ningunha fila coincide co filtro'
    },

    CellMenu : {
        removeRow : 'Eliminar'
    },

    RowCopyPaste : {
        copyRecord  : 'Copiar',
        cutRecord   : 'Cortar',
        pasteRecord : 'Pegar',
        rows        : 'filas',
        row         : 'fila'
    },

    CellCopyPaste : {
        copy  : 'Copiar',
        cut   : 'Cortar',
        paste : 'Pegar'
    },

    Charts : {
        chartDesigner : 'Deseñador de Gráficos',
        newChart      : 'Novo Gráfico',
        download      : 'Descargar',
        settings      : 'Axustes'
    },

    PdfExport : {
        'Waiting for response from server' : 'Agardando pola resposta do servidor...',
        'Export failed'                    : 'Erro na exportación',
        'Server error'                     : 'Erro do servidor',
        'Generating pages'                 : 'Xerando as páxinas...',
        'Click to abort'                   : 'Cancelar'
    },

    ExportDialog : {
        width          : '40 em',
        labelWidth     : '12 em',
        exportSettings : 'Exportar a configuración',
        export         : 'Exportar',
        printSettings  : 'Configuración de impresión',
        print          : 'Imprimir',
        exporterType   : 'Controlar a paxinación',
        cancel         : 'Cancelar',
        fileFormat     : 'Formato do ficheiro',
        rows           : 'Filas',
        alignRows      : 'Aliñar filas',
        columns        : 'Columnas',
        paperFormat    : 'Formato do papel',
        orientation    : 'Orientation',
        repeatHeader   : 'Repetir cabeceira'
    },

    ExportRowsCombo : {
        all     : 'Todas as filas',
        visible : 'Filas visibles'
    },

    ExportOrientationCombo : {
        portrait  : 'Vertical',
        landscape : 'Horizontal'
    },

    SinglePageExporter : {
        singlepage : 'Unha páxina'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Única páxina (sen escalar)'
    },

    MultiPageExporter : {
        multipage     : 'Varias páxinas',
        exportingPage : ({ currentPage, totalPages }) => `Exportando a páxina ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Varias páxinas (vertical)',
        exportingPage     : ({ currentPage, totalPages }) => `Exportando a páxina ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Cargando',
        expand             : 'Expandir',
        collapse           : 'Contraer',
        columnDescription  : 'Alternar detalles da fila',
        expandedRowContent : 'Contido da fila expandida'
    },

    TreeGroup : {
        group                  : 'Agrupar por',
        stopGrouping           : 'Deixar de agrupar',
        stopGroupingThisColumn : 'Desagrupar columnas'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Operación de filtro non exitosa, por favor inténteo de novo'
    },

    AIFilterField : {
        progressText : 'Filtrando'
    },

    PinColumns : {
        pinColumn  : 'Fixar columna',
        unpin      : 'Desfixar',
        pinToStart : 'Fixar ao inicio',
        pinToEnd   : 'Fixar ao final'
    }
};

export default LocaleHelper.publishLocale(locale);
