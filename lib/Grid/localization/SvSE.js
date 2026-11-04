import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/SvSE.js';

const emptyString = new String();

const locale = {

    localeName : 'SvSE',
    localeDesc : 'Svenska',
    localeCode : 'sv-SE',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Sök',
        selectAll   : 'Välj alla',
        removeAll   : 'Ta bort alla',
        filtersSet  : n => n === 1 ? `1 filter inställt` : `${n} filter inställda`,
        noItems     : 'Inga resultat hittades',
        placeholder : 'Filtrera...',
        apply       : 'Verkställ'
    },

    ColumnPicker : {
        column          : 'Kolumn',
        columnsMenu     : 'Kolumner',
        hideColumn      : 'Dölj kolumn',
        hideColumnShort : 'Dölj',
        newColumns      : 'Nya kolumner',
        allColumns      : 'Alla kolumner',
        showName        : column => `Visa kolumn${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Dölj kolumn${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Använd filter',
        filter        : 'Filter',
        editFilter    : 'Redigera filter',
        on            : 'På',
        before        : 'Före',
        after         : 'Efter',
        equals        : 'Lika med',
        lessThan      : 'Mindre än',
        moreThan      : 'Större än',
        removeFilter  : 'Ta bort filter',
        disableFilter : 'Inaktivera filter'
    },

    FilterBar : {
        enableFilterBar  : 'Visa filterrad',
        disableFilterBar : 'Dölj filterrad'
    },

    Group : {
        group                : 'Gruppera',
        groupAscending       : 'Gruppera stigande',
        groupDescending      : 'Gruppera fallande',
        groupAscendingShort  : 'Stigande',
        groupDescendingShort : 'Fallande',
        stopGrouping         : 'Sluta gruppera',
        stopGroupingShort    : 'Sluta'
    },

    HeaderMenu : {
        moveBefore     : text => `Flytta före "${text}"`,
        moveAfter      : text => `Flytta efter "${text}"`,
        collapseColumn : 'Expandera kolumn',
        expandColumn   : 'Fäll ihop kolumn'
    },

    ColumnRename : {
        rename : 'Byt namn'
    },

    ColumnResize : {
        resizeColumn : 'Ändra kolumnbredd',
        width        : 'Bredd',
        fitToData    : 'Anpassa till data'
    },

    MergeCells : {
        mergeCells  : 'Slå ihop celler',
        menuTooltip : 'Slå ihop celler när kolumnen är sorterad'
    },

    Search : {
        searchForValue : 'Sök efter värde'
    },

    Sort : {
        sort                   : 'Sortera',
        sortAscending          : 'Sortera stigande',
        sortDescending         : 'Sortera fallande',
        multiSort              : 'Multisortering',
        removeSorter           : 'Ta bort sorterare',
        addSortAscending       : 'Lägg till stigande',
        addSortDescending      : 'Lägg till fallande',
        toggleSortAscending    : 'Ändra till stigande',
        toggleSortDescending   : 'Ändra till fallande',
        sortAscendingShort     : 'Stigande',
        sortDescendingShort    : 'Fallande',
        removeSorterShort      : 'Ta bort',
        addSortAscendingShort  : '+ Stigande',
        addSortDescendingShort : '+ Fallande'
    },

    Split : {
        split        : 'Dela',
        unsplit      : 'Odelat',
        horizontally : 'Horisontellt',
        vertically   : 'Vertikalt',
        both         : 'Båda',
        top          : 'övre',
        bottom       : 'nedre',
        left         : 'vänster',
        right        : 'höger'
    },

    LockRows : {
        lockRow   : 'Lås raden',
        unlockRow : 'Lås upp raden'
    },

    ActionColumn : {
        rowActions : 'Radåtgärder'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} kolumn. ` : ''}SPACE för snabbmenyn${column.canSort ? ', ENTER för att sortera' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Rad widgets'
    },

    Checkbox : {
        toggleRowSelect : 'Växla radval',
        toggleSelection : 'Växla val av hela datamängden',
        toggleName      : column => `Växla ${column.text || 'värde'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `rating : ${column.location.record.get(column.field) || 0} || 0` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Radnummer'
    },

    GridBase : {
        loadFailedMessage  : 'Ett fel har uppstått, vänligen försök igen!',
        syncFailedMessage  : 'Datasynkronisering misslyckades!',
        unspecifiedFailure : 'Ospecificerat fel',
        networkFailure     : 'Nätverksfel',
        parseFailure       : 'Det gick inte att bearbeta serversvaret',
        serverResponse     : 'Serversvar:',
        noRows             : 'Inga rader att visa',
        moveColumnLeft     : 'Flytta till vänstra sektionen',
        moveColumnRight    : 'Flytta till högra sektionen',
        moveColumnTo       : region => `Flytta kolumn till ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 rad matchar filtret` : `${n} rader matchar filtret`) : 'Inga rader matchar filtret'
    },

    CellMenu : {
        removeRow : 'Ta bort'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopiera',
        cutRecord   : 'Klipp ut',
        pasteRecord : 'Klistra in',
        rows        : 'rader',
        row         : 'rad'
    },

    CellCopyPaste : {
        copy  : 'Kopiera',
        cut   : 'Klipp',
        paste : 'Klistra'
    },

    Charts : {
        chartDesigner : 'Diagramdesigner',
        newChart      : 'Nytt diagram',
        download      : 'Ladda ner',
        settings      : 'Inställningar'
    },

    PdfExport : {
        'Waiting for response from server' : 'Väntar på svar från servern...',
        'Export failed'                    : 'Export misslyckades',
        'Server error'                     : 'Serverfel',
        'Generating pages'                 : 'Genererar sidor...',
        'Click to abort'                   : 'Avbryt'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '13em',
        exportSettings : 'Exportera inställningar',
        export         : 'Exportera',
        printSettings  : 'Utskriftsinställningar',
        print          : 'Skriv ut',
        exporterType   : 'Styra sidbrytningarna',
        cancel         : 'Avbryt',
        fileFormat     : 'Filformat',
        rows           : 'Rader',
        alignRows      : 'Anpassa raderna',
        columns        : 'Kolumner',
        paperFormat    : 'Pappersformat',
        orientation    : 'Orientering',
        repeatHeader   : 'Upprepa rubriken'
    },

    ExportRowsCombo : {
        all     : 'Alla rader',
        visible : 'Synliga rader'
    },

    ExportOrientationCombo : {
        portrait  : 'Stående',
        landscape : 'Liggande'
    },

    SinglePageExporter : {
        singlepage : 'En sida'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'En sida (oskalad)'
    },

    MultiPageExporter : {
        multipage     : 'Flera sidor',
        exportingPage : ({ currentPage, totalPages }) => `Exporterar sidan ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Flera sidor (lodrätt)',
        exportingPage     : ({ currentPage, totalPages }) => `Exporterar sidan ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Laddar',
        expand             : 'Expandera',
        collapse           : 'Fäll ihop',
        columnDescription  : 'Växla radinformation',
        expandedRowContent : 'Utökad radinnehåll'
    },

    TreeGroup : {
        group                  : 'Gruppera efter',
        stopGrouping           : 'Avsluta gruppering',
        stopGroupingThisColumn : 'Avgruppera kolumn'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Filteroperationen misslyckades, vänligen försök igen'
    },

    AIFilterField : {
        progressText : 'Filtrerar'
    },

    PinColumns : {
        pinColumn  : 'Fäst kolumn',
        unpin      : 'Ingen fästning',
        pinToStart : 'Fäst i början',
        pinToEnd   : 'Fäst i slutet'
    }
};

export default LocaleHelper.publishLocale(locale);
