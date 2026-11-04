import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Da.js';

const emptyString = new String();

const locale = {

    localeName : 'Da',
    localeDesc : 'Dansk',
    localeCode : 'da',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Søg',
        selectAll   : 'Vælg alle',
        removeAll   : 'Fjern alle',
        filtersSet  : n => n === 1 ? `1 filter indstillet` : `${n} filtre indstillet`,
        noItems     : 'Ingen resultater fundet',
        placeholder : 'Filtrer...',
        apply       : 'Anvend'
    },

    ColumnPicker : {
        column          : 'Kolonne',
        columnsMenu     : 'Kolonner',
        hideColumn      : 'Skjul kolonne',
        hideColumnShort : 'Skjul',
        newColumns      : 'Nye kolonner',
        allColumns      : 'Alle kolonner',
        showName        : column => `Vis kolonne${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Skjul kolonne${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Anvend filter',
        filter        : 'Filter',
        editFilter    : 'Redigér filter',
        on            : 'Aktiv',
        before        : 'Før',
        after         : 'Efter',
        equals        : 'Ligmed',
        lessThan      : 'Mindre end',
        moreThan      : 'Større end',
        removeFilter  : 'Fjern filter',
        disableFilter : 'Deaktiver filter'
    },

    FilterBar : {
        enableFilterBar  : 'Vis filtreringspanel',
        disableFilterBar : 'Skjul filtreringspanel'
    },

    Group : {
        group                : 'Gruppér',
        groupAscending       : 'Gruppér stigende',
        groupDescending      : 'Gruppér faldende',
        groupAscendingShort  : 'Stigende',
        groupDescendingShort : 'Faldende',
        stopGrouping         : 'Stop gruppering',
        stopGroupingShort    : 'Stop'
    },

    HeaderMenu : {
        moveBefore     : text => `Flyt før '${text}'`,
        moveAfter      : text => `Flyt efter '${text}'`,
        collapseColumn : 'Kollaps kolonne',
        expandColumn   : 'Udvid kolonne'
    },

    ColumnRename : {
        rename : 'Omdøb'
    },

    ColumnResize : {
        resizeColumn : 'Ændr kolonnestørrelse',
        width        : 'Bredde',
        fitToData    : 'Tilpas til data'
    },

    MergeCells : {
        mergeCells  : 'Flet celler',
        menuTooltip : 'Flet celler med samme værdi, når de sorteres efter denne kolonne'
    },

    Search : {
        searchForValue : 'Søg efter værdi'
    },

    Sort : {
        sort                   : 'Sortér',
        sortAscending          : 'Sorter stigende',
        sortDescending         : 'Sorter faldende',
        multiSort              : 'Multi sortering',
        removeSorter           : 'Fjern sorteringsenheden',
        addSortAscending       : 'Tilføj stigende sortering',
        addSortDescending      : 'Tilføj faldende sortering',
        toggleSortAscending    : 'Skift til stigende',
        toggleSortDescending   : 'Skift til faldende',
        sortAscendingShort     : 'Stigende',
        sortDescendingShort    : 'Faldende',
        removeSorterShort      : 'Fjerne',
        addSortAscendingShort  : '+ Stigende',
        addSortDescendingShort : '+ Faldende'
    },

    Split : {
        split        : 'Opdel',
        unsplit      : 'Ikke opdelt',
        horizontally : 'Vandret',
        vertically   : 'Lodret',
        both         : 'Begge',
        top          : 'øverst',
        bottom       : 'nederst',
        left         : 'venstre',
        right        : 'højre'
    },

    LockRows : {
        lockRow   : 'Lås række',
        unlockRow : 'Lås op række'
    },

    ActionColumn : {
        rowActions : 'Rækkehandlinger'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} kolonne. ` : ''}MELLEMRUM for kontekstmenu${column.canSort ? ',ENTER for at sortere' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Række widgets'
    },

    Checkbox : {
        toggleRowSelect : 'Skift rækkevalg',
        toggleSelection : 'Skift valg af hele datasættet',
        toggleName      : column => `Skift ${column.text || 'værdi'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? ` bedømmelse : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Rækkenummer'
    },

    GridBase : {
        loadFailedMessage  : 'Dataindlæsning mislykkedes!',
        syncFailedMessage  : 'Datasynkronisering mislykkedes!',
        unspecifiedFailure : 'Uspecificeret fejl',
        networkFailure     : 'Netværksfejl',
        parseFailure       : 'Kunne ikke parse serversvar',
        serverResponse     : 'Serversvar:',
        noRows             : 'Ingen poster at vise',
        moveColumnLeft     : 'Flyt til venstre sektion',
        moveColumnRight    : 'Flyt til højre sektion',
        moveColumnTo       : region => `Flyt kolonne til ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 række matcher filteret` : `${n} rækker matcher filteret`) : 'Ingen rækker matcher filteret'
    },

    CellMenu : {
        removeRow : 'Slet'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopi',
        cutRecord   : 'klip',
        pasteRecord : 'sæt ind',
        rows        : 'rækker',
        row         : 'række'
    },

    CellCopyPaste : {
        copy  : 'Kopi',
        cut   : 'Skære',
        paste : 'Sæt ind'
    },

    Charts : {
        chartDesigner : 'Diagramdesigner',
        newChart      : 'Nyt Diagram',
        download      : 'Hent',
        settings      : 'Indstillinger'
    },

    PdfExport : {
        'Waiting for response from server' : 'Venter på svar fra serveren...',
        'Export failed'                    : 'Eksporten mislykkedes',
        'Server error'                     : 'Serverfejl',
        'Generating pages'                 : 'Generering af sider...',
        'Click to abort'                   : 'Afbestille'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Eksporter indstillinger',
        export         : 'Eksport',
        printSettings  : 'Udskriftsindstillinger',
        print          : 'Udskriv',
        exporterType   : 'Styr paginering',
        cancel         : 'Afbestille',
        fileFormat     : 'Filformat',
        rows           : 'Rækker',
        alignRows      : 'Juster rækker',
        columns        : 'Kolonner',
        paperFormat    : 'Papirformat',
        orientation    : 'Orientering',
        repeatHeader   : 'Gentag overskriften'
    },

    ExportRowsCombo : {
        all     : 'Alle rækker',
        visible : 'Synlige rækker'
    },

    ExportOrientationCombo : {
        portrait  : 'Portræt',
        landscape : 'Landskab'
    },

    SinglePageExporter : {
        singlepage : 'Enkelt side'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Enkelt side (uskaleret)'
    },

    MultiPageExporter : {
        multipage     : 'Flere sider',
        exportingPage : ({ currentPage, totalPages }) => `Eksporterer side ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Flere sider (lodret)',
        exportingPage     : ({ currentPage, totalPages }) => `Eksporterer side ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Indlæser',
        expand             : 'Udvide',
        collapse           : 'Kollaps',
        columnDescription  : 'Skift rækkeoplysninger',
        expandedRowContent : 'Udvidet rækkeindhold'
    },

    TreeGroup : {
        group                  : 'Gruppér efter',
        stopGrouping           : 'Stop gruppering',
        stopGroupingThisColumn : 'Fjern gruppe på kolonne'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Filtreringsoperation mislykkedes, prøv venligst igen'
    },

    AIFilterField : {
        progressText : 'Filtrerer'
    },

    PinColumns : {
        pinColumn  : 'Fastgør kolonne',
        unpin      : 'Ingen fastgørelse',
        pinToStart : 'Fastgør til start',
        pinToEnd   : 'Fastgør til slut'
    }
};

export default LocaleHelper.publishLocale(locale);
