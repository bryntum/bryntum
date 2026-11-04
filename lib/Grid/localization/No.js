import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/No.js';

const emptyString = new String();

const locale = {

    localeName : 'No',
    localeDesc : 'Norsk',
    localeCode : 'no',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Søk',
        selectAll   : 'Velg alle',
        removeAll   : 'Fjern alle',
        filtersSet  : n => n === 1 ? `1 filter satt` : `${n} filtre satt`,
        noItems     : 'Ingen resultater funnet',
        placeholder : 'Filtrer...',
        apply       : 'Bruk'
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
        applyFilter   : 'Bruk filter',
        filter        : 'Filter',
        editFilter    : 'Rediger filter',
        on            : 'På',
        before        : 'Før',
        after         : 'Etter',
        equals        : 'Lik',
        lessThan      : 'Mindre enn',
        moreThan      : 'Flere enn',
        removeFilter  : 'Fjern filter',
        disableFilter : 'Deaktiver filter'
    },

    FilterBar : {
        enableFilterBar  : 'Vis filterlinje',
        disableFilterBar : 'Skjul filterlinje'
    },

    Group : {
        group                : 'Gruppere',
        groupAscending       : 'Gruppere stigende',
        groupDescending      : 'Gruppere synkende',
        groupAscendingShort  : 'Stigende',
        groupDescendingShort : 'Synkende',
        stopGrouping         : 'Stopp gruppering',
        stopGroupingShort    : 'Stopp'
    },

    HeaderMenu : {
        moveBefore     : text => `Flytt før "${text}"`,
        moveAfter      : text => `Flytt etter "${text}"`,
        collapseColumn : 'Skjul kolonne',
        expandColumn   : 'Utvid kolonne'
    },

    ColumnRename : {
        rename : 'Gi nytt navn'
    },

    ColumnResize : {
        resizeColumn : 'Endre kolonnestørrelse',
        width        : 'Bredde',
        fitToData    : 'Tilpass til data'
    },

    MergeCells : {
        mergeCells  : 'Slå sammen celler',
        menuTooltip : 'Slå sammen celler med samme verdi når de sorteres etter denne kolonnen'
    },

    Search : {
        searchForValue : 'Søk for verdi'
    },

    Sort : {
        sort                   : 'Sortere',
        sortAscending          : 'Sortere stigende',
        sortDescending         : 'Sortere synkende',
        multiSort              : 'Multisortere',
        removeSorter           : 'Fjerne sorterer',
        addSortAscending       : 'Legge til sorterer',
        addSortDescending      : 'Legg til synkende sorterer',
        toggleSortAscending    : 'Endre til stigende',
        toggleSortDescending   : 'Endre til synkende',
        sortAscendingShort     : 'Stigende',
        sortDescendingShort    : 'Synkende',
        removeSorterShort      : 'Fjern',
        addSortAscendingShort  : '+ stigende',
        addSortDescendingShort : '+ synkende'
    },

    Split : {
        split        : 'Del',
        unsplit      : 'Ikke delt',
        horizontally : 'Horisontalt',
        vertically   : 'Vertikalt',
        both         : 'Begge',
        top          : 'øverst',
        bottom       : 'nederst',
        left         : 'venstre',
        right        : 'høyre'
    },

    LockRows : {
        lockRow   : 'Lås raden',
        unlockRow : 'Lås opp raden'
    },

    ActionColumn : {
        rowActions : 'Radhandlinger'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} kolonne. ` : ''}MELLOMROM for kontekstmenyen${column.canSort ? ', ENTER for å sortere' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Rad widgets'
    },

    Checkbox : {
        toggleRowSelect : 'Veksle radvalg',
        toggleSelection : 'Veksle valg av hele datasettet',
        toggleName      : column => `Veksle ${column.text || 'verdi'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `vurdering : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Radnummer'
    },

    GridBase : {
        loadFailedMessage  : 'Datainnlasting mislyktes!',
        syncFailedMessage  : 'Datasynkronisering mislyktes!',
        unspecifiedFailure : 'Uspesifisert feil',
        networkFailure     : 'Nettverksfeil',
        parseFailure       : 'Klarte ikke å analysere serversvar',
        serverResponse     : 'Serversvar:',
        noRows             : 'Ingen oppføringer å vise',
        moveColumnLeft     : 'Flytt til venstre valg',
        moveColumnRight    : 'Flytt til høyre valg',
        moveColumnTo       : region => `Flytt kolonne til ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 rad samsvarer med filteret` : `${n} rader samsvarer med filteret`) : 'Ingen rader samsvarer med filteret'
    },

    CellMenu : {
        removeRow : 'Slett'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopier',
        cutRecord   : 'Klipp ut',
        pasteRecord : 'Lim',
        rows        : 'rader',
        row         : 'rad'
    },

    CellCopyPaste : {
        copy  : 'Kopier',
        cut   : 'Klipp',
        paste : 'Lim inn'
    },

    Charts : {
        chartDesigner : 'Diagramdesigner',
        newChart      : 'Ny Diagram',
        download      : 'Undefined',
        settings      : 'Undefined'
    },

    PdfExport : {
        'Waiting for response from server' : 'Venter på svar fra server...',
        'Export failed'                    : 'Eksport mislyktes',
        'Server error'                     : 'Serverfeil',
        'Generating pages'                 : 'Generer sider...',
        'Click to abort'                   : 'Avbryt'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Eksportinnstillinger',
        export         : 'Eksport',
        printSettings  : 'Utskriftsinnstillinger',
        print          : 'Skriv ut',
        exporterType   : 'Kontrollere paginering',
        cancel         : 'Avbryt',
        fileFormat     : 'Filformat',
        rows           : 'Rader',
        alignRows      : 'Juster rader',
        columns        : 'Kolonner',
        paperFormat    : 'Papirformat',
        orientation    : 'Retning',
        repeatHeader   : 'Gjenta overskrift'
    },

    ExportRowsCombo : {
        all     : 'Alle rader',
        visible : 'Synlige rader'
    },

    ExportOrientationCombo : {
        portrait  : 'Stående',
        landscape : 'Liggende'
    },

    SinglePageExporter : {
        singlepage : 'Enkel side'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Enkel side (uskalert)'
    },

    MultiPageExporter : {
        multipage     : 'Flere sider',
        exportingPage : ({ currentPage, totalPages }) => `Eksporterer side ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Flere sider (vertikal)',
        exportingPage     : ({ currentPage, totalPages }) => `Eksporterer side ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Laster',
        expand             : 'Utvid',
        collapse           : 'Skjul',
        columnDescription  : 'Veksle rad detaljer',
        expandedRowContent : 'Utvidet radinnhold'
    },

    TreeGroup : {
        group                  : 'Grupper etter',
        stopGrouping           : 'Stopp gruppering',
        stopGroupingThisColumn : 'Stopp gruppering av denne kolonnen'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Filteroperasjon mislyktes, vennligst prøv igjen'
    },

    AIFilterField : {
        progressText : 'Filtrerer'
    },

    PinColumns : {
        pinColumn  : 'Fest kolonne',
        unpin      : 'Ingen festing',
        pinToStart : 'Fest til start',
        pinToEnd   : 'Fest til slutt'
    }
};

export default LocaleHelper.publishLocale(locale);
