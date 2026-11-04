import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Nl.js';

const emptyString = new String();

const locale = {

    localeName : 'Nl',
    localeDesc : 'Nederlands',
    localeCode : 'nl',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Zoeken',
        selectAll   : 'Alles selecteren',
        removeAll   : 'Alles verwijderen',
        filtersSet  : n => n === 1 ? `1 filter ingesteld` : `${n} filters ingesteld`,
        noItems     : 'Geen resultaten gevonden',
        placeholder : 'Filteren...',
        apply       : 'Toepassen'
    },

    ColumnPicker : {
        column          : 'Kolom',
        columnsMenu     : 'Kolommen',
        hideColumn      : 'Verberg Kolom',
        hideColumnShort : 'Verberg',
        newColumns      : 'Nieuwe kolommen',
        allColumns      : 'Alle kolommen',
        showName        : column => `Kolom${column.text ? ` ${column.text}` : ''} weergeven`,
        hideName        : column => `Kolom${column.text ? ` ${column.text}` : ''} verbergen`
    },

    Filter : {
        applyFilter   : 'Pas filter toe',
        filter        : 'Filter',
        editFilter    : 'Wijzig filter',
        on            : 'Aan',
        before        : 'Voor',
        after         : 'Na',
        equals        : 'Is gelijk',
        lessThan      : 'Minder dan',
        moreThan      : 'Meer dan',
        removeFilter  : 'Verwijder filter',
        disableFilter : 'Uitschakelen filter'
    },

    FilterBar : {
        enableFilterBar  : 'Maak filterbalk zichtbaar',
        disableFilterBar : 'Verberg filterbalk'
    },

    Group : {
        group                : 'Groepeer',
        groupAscending       : 'Groepeer oplopend',
        groupDescending      : 'Groepeer aflopend',
        groupAscendingShort  : 'Oplopend',
        groupDescendingShort : 'Aflopend',
        stopGrouping         : 'Maak groepering ongedaan',
        stopGroupingShort    : 'Maak ongedaan'
    },

    HeaderMenu : {
        moveBefore     : text => `Verplaatsen naar voor "${text}"`,
        moveAfter      : text => `Verplaatsen naar na "${text}"`,
        collapseColumn : 'Kolom inklappen',
        expandColumn   : 'Kolom uitklappen'
    },

    ColumnRename : {
        rename : 'Hernoemen'
    },

    ColumnResize : {
        resizeColumn : 'Kolombreedte aanpassen',
        width        : 'Breedte',
        fitToData    : 'Aan gegevens aanpassen'
    },

    MergeCells : {
        mergeCells  : 'Cellen samenvoegen',
        menuTooltip : 'Met deze kolom sortering cellen met dezelfde waarde samenvoegen'
    },

    Search : {
        searchForValue : 'Zoek op term'
    },

    Sort : {
        sort                   : 'Sorteer',
        sortAscending          : 'Sorteer oplopend',
        sortDescending         : 'Sorteer aflopend',
        multiSort              : 'Meerdere sorteringen',
        removeSorter           : 'Verwijder sortering',
        addSortAscending       : 'Voeg oplopende sortering toe',
        addSortDescending      : 'Voeg aflopende sortering toe',
        toggleSortAscending    : 'Sorteer oplopend',
        toggleSortDescending   : 'Sorteer aflopend',
        sortAscendingShort     : 'Oplopend',
        sortDescendingShort    : 'Aflopend',
        removeSorterShort      : 'Verwijder',
        addSortAscendingShort  : '+ Oplopend',
        addSortDescendingShort : '+ Aflopend'
    },

    Split : {
        split        : 'Gesplitst',
        unsplit      : 'Ongeplitst',
        horizontally : 'Horizontaal',
        vertically   : 'Verticaal',
        both         : 'Beide',
        top          : 'boven',
        bottom       : 'onder',
        left         : 'links',
        right        : 'rechts'
    },

    LockRows : {
        lockRow   : 'Rij vergrendelen',
        unlockRow : 'Rij ontgrendelen'
    },

    ActionColumn : {
        rowActions : 'Rijacties'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} kolom. ` : ''}SPATIEBALK voor contextmenu${column.canSort ? ', ENTER om te sorteren' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Rijwidgets'
    },

    Checkbox : {
        toggleRowSelect : 'Rijselectie wisselen',
        toggleSelection : 'Toggle selectie van volledige dataset',
        toggleName      : column => `Schakel ${column.text || 'waarde'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `rating : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Rijnummer'
    },

    GridBase : {
        loadFailedMessage  : 'Laden mislukt!',
        syncFailedMessage  : 'Gegevenssynchronisatie is mislukt!',
        unspecifiedFailure : 'Niet-gespecificeerde fout',
        networkFailure     : 'Netwerk fout',
        parseFailure       : 'Kan server response niet parsen',
        serverResponse     : 'Server reactie:',
        noRows             : 'Geen rijen om weer te geven',
        moveColumnLeft     : 'Plaats naar het linker kader',
        moveColumnRight    : 'Plaats naar het rechter kader',
        moveColumnTo       : region => `Kolom verplaatsen naar ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 rij komt overeen met filter` : `${n} rijen komen overeen met filter`) : 'Geen rijen komen overeen met filter'
    },

    CellMenu : {
        removeRow : 'Verwijder'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopieer',
        cutRecord   : 'Knip',
        pasteRecord : 'Plak',
        rows        : 'rijen',
        row         : 'row'
    },

    CellCopyPaste : {
        copy  : 'Kopieer',
        cut   : 'Knip',
        paste : 'Plak'
    },

    Charts : {
        chartDesigner : 'Grafiekontwerper',
        newChart      : 'Nieuwe Grafiek',
        download      : 'Downloaden',
        settings      : 'Instellingen'
    },

    PdfExport : {
        'Waiting for response from server' : 'Wachten op antwoord van server...',
        'Export failed'                    : 'Export mislukt',
        'Server error'                     : 'Serverfout',
        'Generating pages'                 : "Pagina's genereren...",
        'Click to abort'                   : 'Annuleren'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Instellingen exporteren',
        export         : 'Exporteren',
        printSettings  : 'Afdrukinstellingen',
        print          : 'Afdrukken',
        exporterType   : 'Paginering beheren',
        cancel         : 'Annuleren',
        fileFormat     : 'Bestandsformaat',
        rows           : 'Rijen',
        alignRows      : 'Rijen uitlijnen',
        columns        : 'Kolommen',
        paperFormat    : 'Papier formaat',
        orientation    : 'Oriëntatatie',
        repeatHeader   : 'Herhaal koptekst'
    },

    ExportRowsCombo : {
        all     : 'Alle rijen',
        visible : 'Zichtbare rijen'
    },

    ExportOrientationCombo : {
        portrait  : 'Staand',
        landscape : 'Liggend'
    },

    SinglePageExporter : {
        singlepage : 'Enkele pagina'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Enkele pagina (ongeschaald)'
    },

    MultiPageExporter : {
        multipage     : "Meerdere pagina's",
        exportingPage : ({ currentPage, totalPages }) => `Exporteren van de pagina ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : "Meerdere pagina's (verticaal)",
        exportingPage     : ({ currentPage, totalPages }) => `Exporteren van de pagina ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Bezig met laden',
        expand             : 'Klap uit',
        collapse           : 'Klap in',
        columnDescription  : 'Rijdetails wisselen',
        expandedRowContent : 'Uitgevouwen rij-inhoud'
    },

    TreeGroup : {
        group                  : 'Groeperen op',
        stopGrouping           : 'Stop groeperen',
        stopGroupingThisColumn : 'Groeperen opheffen voor deze kolom'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Filterbewerking mislukt, probeer het opnieuw'
    },

    AIFilterField : {
        progressText : 'Filteren'
    },

    PinColumns : {
        pinColumn  : 'Kolom vastzetten',
        unpin      : 'Niet vastzetten',
        pinToStart : 'Vastzetten aan begin',
        pinToEnd   : 'Vastzetten aan einde'
    }
};

export default LocaleHelper.publishLocale(locale);
