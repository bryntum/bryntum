import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Ca.js';

const emptyString = new String();

const locale = {

    localeName : 'Ca',
    localeDesc : 'Català',
    localeCode : 'ca-ES',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Cerca',
        selectAll   : 'Selecciona-ho tot',
        removeAll   : 'Elimina-ho tot',
        filtersSet  : n => n === 1 ? `1 filtre configurat` : `${n} filtres configurats`,
        noItems     : 'No s’han trobat resultats',
        placeholder : 'Filtrar...',
        apply       : 'Aplicar'
    },

    ColumnPicker : {
        column          : 'Columna',
        columnsMenu     : 'Columnes',
        hideColumn      : 'Amaga la columna',
        hideColumnShort : 'Amaga',
        newColumns      : 'Columnes noves',
        allColumns      : 'Totes les columnes',
        showName        : column => `Mostra la columna${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Amaga la columna${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Aplica un filtre',
        filter        : 'Filtre',
        editFilter    : 'Edita el filtre',
        on            : 'a',
        before        : 'abans de',
        after         : 'després de',
        equals        : 'és igual a',
        lessThan      : 'Inferior a',
        moreThan      : 'Superior a',
        removeFilter  : 'Suprimeix el filtre',
        disableFilter : 'Desactiva el filtre'
    },

    FilterBar : {
        enableFilterBar  : 'Mostra la barra de filtres',
        disableFilterBar : 'Amaga la barra de filtres'
    },

    Group : {
        group                : 'Agrupa',
        groupAscending       : 'Agrupa de manera ascendent',
        groupDescending      : 'Agrupa de manera descendent',
        groupAscendingShort  : 'Ascendent',
        groupDescendingShort : 'Descendent',
        stopGrouping         : "Atura l'agrupament",
        stopGroupingShort    : 'Atura'
    },

    HeaderMenu : {
        moveBefore     : text => `Mou abans de "${text}"`,
        moveAfter      : text => `Mou després de "${text}"`,
        collapseColumn : 'Redueix la columna',
        expandColumn   : 'Expandeix la columna'
    },

    ColumnRename : {
        rename : 'Canvi de nom'
    },

    ColumnResize : {
        resizeColumn : 'Redimensiona la columna',
        width        : 'Amplada',
        fitToData    : 'Ajusta a les dades'
    },

    MergeCells : {
        mergeCells  : 'Combina cel·les',
        menuTooltip : "Combina cel·les amb el mateix valor quan s'ordeni per aquesta columna"
    },

    Search : {
        searchForValue : 'Cerca un valor'
    },

    Sort : {
        sort                   : 'Ordena',
        sortAscending          : 'Ordena en sentit ascendent',
        sortDescending         : 'Ordena en sentit descendent',
        multiSort              : 'Ordenació múltiple',
        removeSorter           : "Suprimeix l'ordenador",
        addSortAscending       : 'Afegeix ordre ascendent',
        addSortDescending      : 'Afegeix ordre descendent',
        toggleSortAscending    : 'Canvia a ascendent',
        toggleSortDescending   : 'Canvia a descendent',
        sortAscendingShort     : 'Ascendent',
        sortDescendingShort    : 'Descendent',
        removeSorterShort      : 'Suprimeix',
        addSortAscendingShort  : '+ Ascendent',
        addSortDescendingShort : '+ Descendent'
    },

    Split : {
        split        : 'Divideix',
        unsplit      : 'Anul·la la divisió',
        horizontally : 'Horitzontal',
        vertically   : 'Vertical',
        both         : 'Totes dues',
        top          : 'superior',
        bottom       : 'inferior',
        left         : 'esquerra',
        right        : 'dreta'
    },

    LockRows : {
        lockRow   : 'Fila de bloqueig',
        unlockRow : 'Desbloqueja la fila'
    },

    ActionColumn : {
        rowActions : 'Accions de fila'
    },

    Column : {
        columnLabel : column => `${column.text ? `Columna ${column.text}. ` : ''}ESPAI per al menú contextual${column.canSort ? ', RETORN per ordenar' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Widgets de fila'
    },

    Checkbox : {
        toggleRowSelect : 'Commuta la selecció de files',
        toggleSelection : 'Commuta la selecció de tot el conjunt de dades',
        toggleName      : column => `Commuta ${column.text || 'valor'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `valoració: ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Número de fila'
    },

    GridBase : {
        loadFailedMessage  : 'La càrrega de dades ha fallat',
        syncFailedMessage  : 'La sincronització de dades ha fallat',
        unspecifiedFailure : 'Error sense especificar',
        networkFailure     : 'Error de la xarxa',
        parseFailure       : "No s'ha pogut analitzar la resposta del servidor",
        serverResponse     : 'Resposta del servidor:',
        noRows             : 'No hi ha cap registre per visualitzar',
        moveColumnLeft     : 'Desplaça a la secció esquerra',
        moveColumnRight    : 'Desplaça a la secció dreta',
        moveColumnTo       : region => `Mou la columna a ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 fila coincideix amb el filtre` : `${n} files coincideixen amb el filtre`) : 'Cap fila coincideix amb el filtre'
    },

    CellMenu : {
        removeRow : 'Elimina'
    },

    RowCopyPaste : {
        copyRecord  : 'Copia',
        cutRecord   : 'Retalla',
        pasteRecord : 'Enganxa',
        rows        : 'files',
        row         : 'fila'
    },

    CellCopyPaste : {
        copy  : 'Copia',
        cut   : 'Retalla',
        paste : 'Enganxa'
    },

    Charts : {
        chartDesigner : 'Dissenyador de Gràfics',
        newChart      : 'Nou Gràfic',
        download      : 'Descarregar',
        settings      : 'Configuració'
    },

    PdfExport : {
        'Waiting for response from server' : "S'està esperant la resposta del servidor...",
        'Export failed'                    : "L'exportació ha fallat",
        'Server error'                     : 'Error del servidor',
        'Generating pages'                 : "S'estan generant les pàgines...",
        'Click to abort'                   : 'Cancel·la'
    },

    ExportDialog : {
        width          : '40 em',
        labelWidth     : '12 em',
        exportSettings : "Configuració de l'exportació",
        export         : 'Exporta',
        printSettings  : "Configuració d'impressió",
        print          : 'Imprimir',
        exporterType   : 'Paginació de control',
        cancel         : 'Cancel·la',
        fileFormat     : 'Format del fitxer',
        rows           : 'Files',
        alignRows      : 'Alinea les files',
        columns        : 'Columnes',
        paperFormat    : 'Format del paper',
        orientation    : 'Orientació',
        repeatHeader   : 'Repeteix la capçalera'
    },

    ExportRowsCombo : {
        all     : 'Totes les files',
        visible : 'Files visibles'
    },

    ExportOrientationCombo : {
        portrait  : 'Vertical',
        landscape : 'Horitzontal'
    },

    SinglePageExporter : {
        singlepage : 'Una pàgina'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Pàgina única (sense escala)'
    },

    MultiPageExporter : {
        multipage     : 'Diverses pàgines',
        exportingPage : ({ currentPage, totalPages }) => `S'està exportant la pàgina ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Diverses pàgines (vertical)',
        exportingPage     : ({ currentPage, totalPages }) => `S'està exportant la pàgina ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : "S'està carregant",
        expand             : 'Expandeix',
        collapse           : 'Redueix',
        columnDescription  : 'Commuta els detalls de la fila',
        expandedRowContent : 'Contingut de la fila ampliada'
    },

    TreeGroup : {
        group                  : 'Agrupa per',
        stopGrouping           : "Atura l'agrupament",
        stopGroupingThisColumn : 'Desagrupa la columna'
    },

    AIFilter : {
        unsuccessfulFilterMessage : "L'operació de filtratge no ha tingut èxit, si us plau, torna-ho a intentar."
    },

    AIFilterField : {
        progressText : 'Filtrant'
    },

    PinColumns : {
        pinColumn  : 'Fixar columna',
        unpin      : 'Desfixar',
        pinToStart : 'Fixar al principi',
        pinToEnd   : 'Fixar al final'
    }
};

export default LocaleHelper.publishLocale(locale);
