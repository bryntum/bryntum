import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Et.js';

const emptyString = new String();

const locale = {

    localeName : 'Et',
    localeDesc : 'Eesti keel',
    localeCode : 'et',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Otsi',
        selectAll   : 'Vali kõik',
        removeAll   : 'Eemalda kõik',
        filtersSet  : n => n === 1 ? `1 filter määratud` : `${n} filtrit määratud`,
        noItems     : 'Tulemusi ei leitud',
        placeholder : 'Filtreeri...',
        apply       : 'Rakenda'
    },

    ColumnPicker : {
        column          : 'Veerg',
        columnsMenu     : 'Veerud',
        hideColumn      : 'Peida veerg',
        hideColumnShort : 'Peida',
        newColumns      : 'Uued veerud',
        allColumns      : 'Kõik veerud',
        showName        : column => `Näita veergu${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Peida veerg${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Kohalda filtrit',
        filter        : 'Filter',
        editFilter    : 'Redigeeri filtrit',
        on            : 'Kuupäeval',
        before        : 'Enne',
        after         : 'Pärast',
        equals        : 'Võrdub',
        lessThan      : 'Vähem kui',
        moreThan      : 'Rohkem kui',
        removeFilter  : 'Eemalda filter',
        disableFilter : 'Keela filter'
    },

    FilterBar : {
        enableFilterBar  : 'Näita filtritulpa',
        disableFilterBar : 'Peida filtritulp'
    },

    Group : {
        group                : 'Grupeeri',
        groupAscending       : 'Grupeeri kasvavalt',
        groupDescending      : 'Grupeeri kahanevalt',
        groupAscendingShort  : 'Kasvav',
        groupDescendingShort : 'Kahanev',
        stopGrouping         : 'Peata grupeerimine',
        stopGroupingShort    : 'Peata'
    },

    HeaderMenu : {
        moveBefore     : text => `Liiguta enne "${text}"`,
        moveAfter      : text => `Liiguta pärast "${text}"`,
        collapseColumn : 'Koonda veerg',
        expandColumn   : 'Laienda veergu'
    },

    ColumnRename : {
        rename : 'Nimeta ümber'
    },

    ColumnResize : {
        resizeColumn : 'Muuda veeru laiust',
        width        : 'Laius',
        fitToData    : 'Sobita andmetega'
    },

    MergeCells : {
        mergeCells  : 'Ühenda lahtrid',
        menuTooltip : 'Ühenda sama väärtusega lahtrid, kui sorteeritakse selle veeru järgi'
    },

    Search : {
        searchForValue : 'Otsi väärtust'
    },

    Sort : {
        sort                   : 'Sordi',
        sortAscending          : 'Sordi kasvavalt',
        sortDescending         : 'Sordi kahanevalt',
        multiSort              : 'Multisortimine',
        removeSorter           : 'Eemalda sortija',
        addSortAscending       : 'Lisa kasvav sortija',
        addSortDescending      : 'Lisa kahanev sortija',
        toggleSortAscending    : 'Muuda kasvavaks',
        toggleSortDescending   : 'Muuda kahanevaks',
        sortAscendingShort     : 'Kasvav',
        sortDescendingShort    : 'Kahanev',
        removeSorterShort      : 'Eemalda',
        addSortAscendingShort  : '+ Kasvav',
        addSortDescendingShort : '+ Kahanev'
    },

    Split : {
        split        : 'Jaga',
        unsplit      : 'Lõpeta jagamine',
        horizontally : 'Horisontaalselt',
        vertically   : 'Vertikaalselt',
        both         : 'Mõlemad',
        top          : 'üleval',
        bottom       : 'all',
        left         : 'vasak',
        right        : 'parem'
    },

    LockRows : {
        lockRow   : 'Lukusta rida',
        unlockRow : 'Vabasta rida'
    },

    ActionColumn : {
        rowActions : 'Rea toimingud'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} veerg. ` : ''}TÜHIKULAADI - kontekstimenüü jaoks${column.canSort ? ', ENTER - et sortida' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Rea vidinad'
    },

    Checkbox : {
        toggleRowSelect : 'Lülita sisse reavalik',
        toggleSelection : 'Lülita sisse kogu andmekogumi valik',
        toggleName      : column => `Lülita ${column.text || 'väärtus'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `hinnang : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Reanumber'
    },

    GridBase : {
        loadFailedMessage  : 'Andmete laadimine nurjus!',
        syncFailedMessage  : 'Andmete sünrkoonimine nurjus!',
        unspecifiedFailure : 'Täpsustamata tõrge',
        networkFailure     : 'Võrgu viga',
        parseFailure       : 'Serveri vastuse parsimine nurjus',
        serverResponse     : 'Serveri vastus:',
        noRows             : 'Kuvatavad kirjed puuduvad',
        moveColumnLeft     : 'Liiguta vasakpoolsesse jaotisesse',
        moveColumnRight    : 'Liiguta parempoolsesse jaotisesse',
        moveColumnTo       : region => `Liiguta veerg kohta ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 rida vastab filtrile` : `${n} rida vastavad filtrile`) : 'Ükski rida ei vasta filtrile'
    },

    CellMenu : {
        removeRow : 'Kustuta'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopeeri',
        cutRecord   : 'Lõika',
        pasteRecord : 'Kleebi',
        rows        : 'rida',
        row         : 'rida'
    },

    CellCopyPaste : {
        copy  : 'Kopeeri',
        cut   : 'Lõika',
        paste : 'Kleebi'
    },

    Charts : {
        chartDesigner : 'Diagrammi kujundaja',
        newChart      : 'Uus diagramm',
        download      : 'Lae alla',
        settings      : 'Seaded'
    },

    PdfExport : {
        'Waiting for response from server' : 'Serveri vastuse ootamine...',
        'Export failed'                    : 'Eksport nurjus',
        'Server error'                     : 'Serveri viga',
        'Generating pages'                 : 'Lehekülgede loomine...',
        'Click to abort'                   : 'Tühista'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Ekspordi seaded',
        export         : 'Eksport',
        printSettings  : 'Prindi seaded',
        print          : 'Prindi',
        exporterType   : 'Kontrolli leheküljestamist',
        cancel         : 'Tühista',
        fileFormat     : 'Failivorming',
        rows           : 'Read',
        alignRows      : 'Joonda read',
        columns        : 'Veerud',
        paperFormat    : 'Paberi vorming',
        orientation    : 'Paigutus',
        repeatHeader   : 'Korda päist'
    },

    ExportRowsCombo : {
        all     : 'Kõik read',
        visible : 'Nähtavad read'
    },

    ExportOrientationCombo : {
        portrait  : 'Püstpaigutus',
        landscape : 'Rõhtpaigutus'
    },

    SinglePageExporter : {
        singlepage : 'Üks lehekülg'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Üks leht (skaalamata)'
    },

    MultiPageExporter : {
        multipage     : 'Mitu lehekülge',
        exportingPage : ({ currentPage, totalPages }) => `Ekspordi lehekülg ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Mitu lehekülge (vertikaalne)',
        exportingPage     : ({ currentPage, totalPages }) => `Ekspordi lehekülg ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Laadimine',
        expand             : 'Laienda',
        collapse           : 'Koonda',
        columnDescription  : 'Rea üksikasjade lülitamine',
        expandedRowContent : 'Laiendatud rea sisu'
    },

    TreeGroup : {
        group                  : 'Rühmita',
        stopGrouping           : 'Lõpeta rühmitamine',
        stopGroupingThisColumn : 'Eemalda rühmitamine veerult'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Filtreerimistoiming ebaõnnestus, palun proovige uuesti'
    },

    AIFilterField : {
        progressText : 'Filtreerimine'
    },

    PinColumns : {
        pinColumn  : 'Kinnita veerg',
        unpin      : 'Eemalda kinnitus',
        pinToStart : 'Kinnita algusesse',
        pinToEnd   : 'Kinnita lõppu'
    }
};

export default LocaleHelper.publishLocale(locale);
