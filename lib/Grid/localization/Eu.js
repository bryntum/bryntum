import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Eu.js';

const emptyString = new String();

const locale = {

    localeName : 'Eu',
    localeDesc : 'Euskara',
    localeCode : 'eu-ES',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Bilatu',
        selectAll   : 'Hautatu guztiak',
        removeAll   : 'Kendu guztiak',
        filtersSet  : n => n === 1 ? `1 iragazki ezarrita` : `${n} iragazki ezarrita`,
        noItems     : 'Emaitzarik aurkitu ez da',
        placeholder : 'Iragazi...',
        apply       : 'Aplikatu'
    },

    ColumnPicker : {
        column          : 'Zutabea',
        columnsMenu     : 'Zutabeak',
        hideColumn      : 'Ezkutatu zutabea',
        hideColumnShort : 'Ezkutatu',
        newColumns      : 'Zutabe berriak',
        allColumns      : 'Zutabe guztiak',
        showName        : column => `Erakutsi${column.text ? ` ${column.text}` : ''} zutabea`,
        hideName        : column => `Ezkutatu${column.text ? ` ${column.text}` : ''} zutabea`
    },

    Filter : {
        applyFilter   : 'Aplikatu iragazkia',
        filter        : 'Iragazkia',
        editFilter    : 'Editatu iragazkia',
        on            : 'Aktibatuta',
        before        : 'lehen',
        after         : 'geroago',
        equals        : 'Berdinak',
        lessThan      : 'Hau baino txikiagoa',
        moreThan      : 'Hau baino handiagoa',
        removeFilter  : 'Kendu iragazkia',
        disableFilter : 'Desgaitu iragazkia'
    },

    FilterBar : {
        enableFilterBar  : 'Erakutsi iragazki-barra',
        disableFilterBar : 'Ezkutatu iragazki-barra'
    },

    Group : {
        group                : 'Taldea',
        groupAscending       : 'Taldekatu gorantz',
        groupDescending      : 'Taldekatu beherantz',
        groupAscendingShort  : 'Gorantz',
        groupDescendingShort : 'Beherantz',
        stopGrouping         : 'Utzi taldekatzeari',
        stopGroupingShort    : 'Gelditu'
    },

    HeaderMenu : {
        moveBefore     : text => `Mugitu hau baino lehen "${text}"`,
        moveAfter      : text => `Mugitu hau eta gero "${text}"`,
        collapseColumn : 'Itxi zutabea',
        expandColumn   : 'Zabaldu zutabea'
    },

    ColumnRename : {
        rename : 'Aldatu izena'
    },

    ColumnResize : {
        resizeColumn : 'Aldatu zutabearen tamaina',
        width        : 'Zabalera',
        fitToData    : 'Doitu datuetara'
    },

    MergeCells : {
        mergeCells  : 'Konbinatu gelaxkak',
        menuTooltip : 'Konbinatu balio bera duten gelaxkak, zutabe honen arabera ordenatzean'
    },

    Search : {
        searchForValue : 'Bilatu balio bat'
    },

    Sort : {
        sort                   : 'Ordena',
        sortAscending          : 'Ordenatu gorantz',
        sortDescending         : 'Ordenatu beherantz',
        multiSort              : 'Sailkapen anizkoitza',
        removeSorter           : 'Kendu sailkatzailea',
        addSortAscending       : 'Gehitu goranzko ordena',
        addSortDescending      : 'Gehitu beheranzko ordena',
        toggleSortAscending    : 'Aldatu goranzko ordenara',
        toggleSortDescending   : 'Aldatu beheranzko ordenara',
        sortAscendingShort     : 'Gorantz',
        sortDescendingShort    : 'Beherantz',
        removeSorterShort      : 'Kendu',
        addSortAscendingShort  : '+ Goranzkoa',
        addSortDescendingShort : '+ Beheranzkoa'
    },

    Split : {
        split        : 'Zatitu',
        unsplit      : 'Elkartu',
        horizontally : 'Horizontalki',
        vertically   : 'Bertikalki',
        both         : 'Biak',
        top          : 'goian',
        bottom       : 'behean',
        left         : 'ezkerra',
        right        : 'eskuina'
    },

    LockRows : {
        lockRow   : 'Blokeatu errenkada',
        unlockRow : 'Desblokeatu errenkada'
    },

    ActionColumn : {
        rowActions : 'Errenkada ekintzak'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} zutabea. ` : ''}Sakatu ZURIUNE-BARRA laster-menua ikusteko${column.canSort ? ' eta SARTU ordenatzeko' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Errenkada widgetak'
    },

    Checkbox : {
        toggleRowSelect : 'Aldatu errenkaden hautapena',
        toggleSelection : 'Aldatu datu multzo osoaren hautapena',
        toggleName      : column => `Txandakatu ${column.text || 'balioa'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `erregistroaren balorazioa: ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Errenkada zenbakia'
    },

    GridBase : {
        loadFailedMessage  : 'Ezin izan dira kargatu datuak',
        syncFailedMessage  : 'Ezin izan dira sinkronizatu datuak',
        unspecifiedFailure : 'Zehaztu gabeko hutsegitea',
        networkFailure     : 'Sareko errorea',
        parseFailure       : 'Ezin izan da analizatu zerbitzariaren erantzuna',
        serverResponse     : 'Zerbitzariaren erantzuna:',
        noRows             : 'Ez dago erregistrorik bistaratzeko',
        moveColumnLeft     : 'Eraman ezkerreko sekziora',
        moveColumnRight    : 'Eraman eskuineko sekziora',
        moveColumnTo       : region => `Mugitu zutabea hona ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 errenkada iragazkiarekin bat dator` : `${n} errenkadak iragazkiarekin bat datoz`) : 'Ez dago errenkadarik iragazkiarekin bat datorrenik'
    },

    CellMenu : {
        removeRow : 'Ezabatu'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopiatu',
        cutRecord   : 'Ebaki',
        pasteRecord : 'Itsatsi',
        rows        : 'errenkadak',
        row         : 'errenkada'
    },

    CellCopyPaste : {
        copy  : 'Kopiatu',
        cut   : 'Ebaki',
        paste : 'Itsatsi'
    },

    Charts : {
        chartDesigner : 'Grafiko Diseinatzailea',
        newChart      : 'Grafiko Berria',
        download      : 'Deskargatu',
        settings      : 'Ezarpenak'
    },

    PdfExport : {
        'Waiting for response from server' : 'Zerbitzariaren erantzunaren zain...',
        'Export failed'                    : 'Esportazioahuts egin du',
        'Server error'                     : 'Zerbitzari-errorea',
        'Generating pages'                 : 'Orrialdeak sortzen...',
        'Click to abort'                   : 'Utzi'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Esportazio-baldintzak',
        export         : 'Esportzioa',
        printSettings  : 'Inprimatzeko ezarpenak',
        print          : 'Inprimatu',
        exporterType   : 'Orrialde-zenbaketa kontrolatu',
        cancel         : 'Utzi',
        fileFormat     : 'Fitxategi-formatua',
        rows           : 'Errenkadak',
        alignRows      : 'Lerrokatu errenkadak',
        columns        : 'Zutabeak',
        paperFormat    : 'Paper-formatua',
        orientation    : 'Orientation',
        repeatHeader   : 'Goiburua errepikatu'
    },

    ExportRowsCombo : {
        all     : 'Errenkadad guztiak',
        visible : 'Ageriko errenkadak'
    },

    ExportOrientationCombo : {
        portrait  : 'Bertikala',
        landscape : 'Horizontala'
    },

    SinglePageExporter : {
        singlepage : 'Orrialde bakarra'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Orri bakarra (eskalatu gabe)'
    },

    MultiPageExporter : {
        multipage     : 'Orrialde asko',
        exportingPage : ({ currentPage, totalPages }) => `Orrialde hau esportatzen ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Orrialde asko (bertikala)',
        exportingPage     : ({ currentPage, totalPages }) => `Orrialde hau esportatzen ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Kargatzen',
        expand             : 'Zabaldu',
        collapse           : 'Itxi',
        columnDescription  : 'Aldatu errenkadaren xehetasunak',
        expandedRowContent : 'Hedatutako errenkadaren edukia'
    },

    TreeGroup : {
        group                  : 'Taldekatu honen arabera',
        stopGrouping           : 'Utzi taldekatzeari',
        stopGroupingThisColumn : 'Banandu zutabeen arabera'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Iragazketa eragiketa ez da arrakastatsua izan, saiatu berriro mesedez'
    },

    AIFilterField : {
        progressText : 'Iragazten'
    },

    PinColumns : {
        pinColumn  : 'Kolumna finkatu',
        unpin      : 'Ez finkatu',
        pinToStart : 'Hasieran finkatu',
        pinToEnd   : 'Amaieran finkatu'
    }
};

export default LocaleHelper.publishLocale(locale);
