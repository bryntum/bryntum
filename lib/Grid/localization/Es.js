import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Es.js';

const emptyString = new String();

const locale = {

    localeName : 'Es',
    localeDesc : 'Español',
    localeCode : 'es',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Buscar',
        selectAll   : 'Seleccionar todo',
        removeAll   : 'Quitar todo',
        filtersSet  : n => n === 1 ? `1 filtro configurado` : `${n} filtros configurados`,
        noItems     : 'No se encontraron resultados',
        placeholder : 'Filtrar...',
        apply       : 'Aplicar'
    },

    ColumnPicker : {
        column          : 'Columna',
        columnsMenu     : 'Columnas',
        hideColumn      : 'Ocultar columna',
        hideColumnShort : 'Ocultar',
        newColumns      : 'Nuevas columnas',
        allColumns      : 'Todas las columnas',
        showName        : column => `Mostrar columna${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Ocultar columna${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Aplicar filtro',
        filter        : 'Filtro',
        editFilter    : 'Editar filtro',
        on            : 'Activo',
        before        : 'Antes',
        after         : 'Después',
        equals        : 'Equivale a',
        lessThan      : 'Inferior a',
        moreThan      : 'Superior a',
        removeFilter  : 'Quitar filtro',
        disableFilter : 'Deshabilitar filtro'
    },

    FilterBar : {
        enableFilterBar  : 'Mostrar barra de filtro',
        disableFilterBar : 'Ocultar barra de filtro'
    },

    Group : {
        group                : 'Agrupar',
        groupAscending       : 'Agrupar ascendentes',
        groupDescending      : 'Agrupar descendentes',
        groupAscendingShort  : 'Ascendentes',
        groupDescendingShort : 'Descendentes',
        stopGrouping         : 'Dejar de agrupar',
        stopGroupingShort    : 'Dejar'
    },

    HeaderMenu : {
        moveBefore     : text => `Mover delante de "${text}"`,
        moveAfter      : text => `Mover detrás de "${text}"`,
        collapseColumn : 'Comprimir columna',
        expandColumn   : 'Expandir columna'
    },

    ColumnRename : {
        rename : 'Renombrar'
    },

    ColumnResize : {
        resizeColumn : 'Redimensionar columna',
        width        : 'Ancho',
        fitToData    : 'Ajustar a los datos'
    },

    MergeCells : {
        mergeCells  : 'Combinar celdas',
        menuTooltip : 'Combinar celdas con el mismo valor al ordenarlas por esta columna'
    },

    Search : {
        searchForValue : 'Buscar valor'
    },

    Sort : {
        sort                   : 'Ordenar',
        sortAscending          : 'Orden ascendente',
        sortDescending         : 'Orden descendente',
        multiSort              : 'Orden múltiple',
        removeSorter           : 'Eliminar criterio de orden',
        addSortAscending       : 'Añadir criterio ascendente',
        addSortDescending      : 'Añadir criterio ascendente',
        toggleSortAscending    : 'Cambiar a ascendente',
        toggleSortDescending   : 'Cambiar a descendente',
        sortAscendingShort     : 'Ascendente',
        sortDescendingShort    : 'Descendente',
        removeSorterShort      : 'Eliminar',
        addSortAscendingShort  : '+ Ascendente',
        addSortDescendingShort : '+ Descendente'
    },

    Split : {
        split        : 'Dividir',
        unsplit      : 'No dividir',
        horizontally : 'Horizontalmente',
        vertically   : 'Verticalmente',
        both         : 'Ambos',
        top          : 'superior',
        bottom       : 'inferior',
        left         : 'izquierda',
        right        : 'derecha'
    },

    LockRows : {
        lockRow   : 'Bloquear fila',
        unlockRow : 'Desbloquear fila'
    },

    ActionColumn : {
        rowActions : 'Acciones de fila'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} columna. ` : ''}ESPACIO para el menú contextual${column.canSort ? ', INTRO para ordenar' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Widgets de fila'
    },

    Checkbox : {
        toggleRowSelect : 'Alternar selección de filas',
        toggleSelection : 'Alternar selección de todo el conjunto de datos',
        toggleName      : column => `Alternar ${column.text || 'valor'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `clasificación : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Número de fila'
    },

    GridBase : {
        loadFailedMessage  : 'Fallo al cargar los datos',
        syncFailedMessage  : 'Fallo al sincronizar los datos',
        unspecifiedFailure : 'Fallo no especificado',
        networkFailure     : 'Error de red',
        parseFailure       : 'Fallo al analizar la respuesta del servidor',
        serverResponse     : 'Respuesta del servidor:',
        noRows             : 'Sin registros que mostrar',
        moveColumnLeft     : 'Mover a la sección izquierda',
        moveColumnRight    : 'Mover a la sección derecha',
        moveColumnTo       : region => `Mover columna a ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 fila coincide con el filtro` : `${n} filas coinciden con el filtro`) : 'Ninguna fila coincide con el filtro'
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
        chartDesigner : 'Diseñador de gráficos',
        newChart      : 'Nuevo Gráfico',
        download      : 'Descargar',
        settings      : 'Configuraciones'
    },

    PdfExport : {
        'Waiting for response from server' : 'Esperando respuesta del servidor...',
        'Export failed'                    : 'Fallo al exportar',
        'Server error'                     : 'Error del servidor',
        'Generating pages'                 : 'Generando páginas...',
        'Click to abort'                   : 'Cancelar'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Exportar ajustes',
        export         : 'Exportar',
        printSettings  : 'Configuración de impresión',
        print          : 'Imprimir',
        exporterType   : 'Controlar la paginación',
        cancel         : 'Cancelar',
        fileFormat     : 'Formato de archivo',
        rows           : 'Filas',
        alignRows      : 'Alinear filas',
        columns        : 'Columnas',
        paperFormat    : 'Formato de papel',
        orientation    : 'Orientación',
        repeatHeader   : 'Repetir encabezado'
    },

    ExportRowsCombo : {
        all     : 'Todas las filas',
        visible : 'Filas visibles'
    },

    ExportOrientationCombo : {
        portrait  : 'Retrato',
        landscape : 'Panorámica'
    },

    SinglePageExporter : {
        singlepage : 'Una sola página'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Página única (sin escala)'
    },

    MultiPageExporter : {
        multipage     : 'Páginas múltiples',
        exportingPage : ({ currentPage, totalPages }) => `Exportando página ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Páginas múltiples (vertical)',
        exportingPage     : ({ currentPage, totalPages }) => `Exportando página  ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Cargando',
        expand             : 'Expandir',
        collapse           : 'Contrar',
        columnDescription  : 'Alternar detalles de la fila',
        expandedRowContent : 'Contenido de la fila expandida'
    },

    TreeGroup : {
        group                  : 'Agrupar por',
        stopGrouping           : 'Detener agrupación',
        stopGroupingThisColumn : 'Desagrupar esta columna'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Operación de filtro no exitosa, por favor intente nuevamente'
    },

    AIFilterField : {
        progressText : 'Filtrando'
    },

    PinColumns : {
        pinColumn  : 'Fijar columna',
        unpin      : 'Sin fijar',
        pinToStart : 'Fijar al inicio',
        pinToEnd   : 'Fijar al final'
    }
};

export default LocaleHelper.publishLocale(locale);
