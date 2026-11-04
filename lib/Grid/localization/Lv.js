import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Lv.js';

const emptyString = new String();

const locale = {

    localeName : 'Lv',
    localeDesc : 'Latviešu',
    localeCode : 'lv-LV',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Meklēt',
        selectAll   : 'Izvēlēties visu',
        removeAll   : 'Noņemt visu',
        filtersSet  : n => n === 1 ? `1 filtrs iestatīts` : `${n} filtri iestatīti`,
        noItems     : 'Rezultāti netika atrasti',
        placeholder : 'Filtrēt...',
        apply       : 'Pielietot'
    },

    ColumnPicker : {
        column          : 'Kolonna',
        columnsMenu     : 'Kolonnas',
        hideColumn      : 'Paslēpt kolonnu',
        hideColumnShort : 'Paslēpt',
        newColumns      : 'Jaunas kolonnas',
        allColumns      : 'Visas kolonnas',
        showName        : column => `Rādīt kolonnu${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Paslēpt kolonnu${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Lietot filtru',
        filter        : 'Filtrs',
        editFilter    : 'Rediģēt filtru',
        on            : 'šādā datumā',
        before        : 'pirms',
        after         : 'pēc',
        equals        : 'vienāds ar',
        lessThan      : 'mazāks par',
        moreThan      : 'lielāks par',
        removeFilter  : 'Noņemt filtru',
        disableFilter : 'Atspējot filtru'
    },

    FilterBar : {
        enableFilterBar  : 'Rādīt filtra joslu',
        disableFilterBar : 'Paslēpt filtra joslu'
    },

    Group : {
        group                : 'Grupa',
        groupAscending       : 'Grupēt augošā secībā',
        groupDescending      : 'Grupēt dilstošā secībā',
        groupAscendingShort  : 'Augoši',
        groupDescendingShort : 'Dilstoši',
        stopGrouping         : 'Apturēt grupēšanu',
        stopGroupingShort    : 'Apturēt'
    },

    HeaderMenu : {
        moveBefore     : text => `Pārvietot pirms "${text}"`,
        moveAfter      : text => `Pārvietot pēc "${text}"`,
        collapseColumn : 'Sakļaut kolonnu',
        expandColumn   : 'Izvērst kolonnu'
    },

    ColumnRename : {
        rename : 'Pārdēvēt'
    },

    ColumnResize : {
        resizeColumn : 'Mainīt kolonnas izmēru',
        width        : 'Platums',
        fitToData    : 'Pielāgot datiem'
    },

    MergeCells : {
        mergeCells  : 'Apvienot šūnas',
        menuTooltip : 'Apvienot šūnas ar vienādu vērtību, ja kārto pēc šīs kolonnas'
    },

    Search : {
        searchForValue : 'Meklēt vērtību'
    },

    Sort : {
        sort                   : 'Kārtot',
        sortAscending          : 'Kārtot augošā secībā',
        sortDescending         : 'Kārtot dilstošā secībā',
        multiSort              : 'Vairāku līmeņu kārtošana',
        removeSorter           : 'Noņemt kārtotāju',
        addSortAscending       : 'Pievienot kārtotāju augošā secībā',
        addSortDescending      : 'Pievienot kārtotāju dilstošā secībā',
        toggleSortAscending    : 'Mainīt uz augošu secību',
        toggleSortDescending   : 'Mainīt uz dilstošu secību',
        sortAscendingShort     : 'Augoši',
        sortDescendingShort    : 'Dilstoši',
        removeSorterShort      : 'Noņemt',
        addSortAscendingShort  : '+ Augoši',
        addSortDescendingShort : '+ Dilstoši'
    },

    Split : {
        split        : 'Sadalīt',
        unsplit      : 'Atcelt sadali',
        horizontally : 'Horizontāli',
        vertically   : 'Vertikāli',
        both         : 'Abi',
        top          : 'augšā',
        bottom       : 'apakšā',
        left         : 'kreisā',
        right        : 'labā'
    },

    LockRows : {
        lockRow   : 'Bloķēt rindu',
        unlockRow : 'Atbloķēt rindu'
    },

    ActionColumn : {
        rowActions : 'Rindas darbības'
    },

    Column : {
        columnLabel : column => `${column.text ? `Kolonna: ${column.text}. ` : ''}ATSTARPES TAUSTIŅŠ kontekstizvēlnei${column.canSort ? ', TAUSTIŅŠ ENTER kārtošanai' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Rindu logrīki'
    },

    Checkbox : {
        toggleRowSelect : 'Pārslēgt rindas atlasi',
        toggleSelection : 'Pārslēgt visas datu kopas atlasi',
        toggleName      : column => `Pārslēgt ${column.text || 'vērtību'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `vērtējums: ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Rindas numurs'
    },

    GridBase : {
        loadFailedMessage  : 'Neizdevās ielādēt datus!',
        syncFailedMessage  : 'Datu sinhronizācija neizdevās!',
        unspecifiedFailure : 'Nenorādīta kļūme',
        networkFailure     : 'Tīkla kļūda',
        parseFailure       : 'Neizdevās parsēt servera atbildi',
        serverResponse     : 'Servera atbilde:',
        noRows             : 'Nav parādāmu ierakstu',
        moveColumnLeft     : 'Pārvietot uz kreiso sadaļu',
        moveColumnRight    : 'Pārvietot uz labo sadaļu',
        moveColumnTo       : region => `Move column to ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 rinda atbilst filtram` : `${n} rindas atbilst filtram`) : 'Neviena rinda neatbilst filtram'
    },

    CellMenu : {
        removeRow : 'Dzēst'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopēt',
        cutRecord   : 'Izgriezt',
        pasteRecord : 'Ielīmēt',
        rows        : 'rindas',
        row         : 'rinda'
    },

    CellCopyPaste : {
        copy  : 'Kopēt',
        cut   : 'Izgriezt',
        paste : 'Ielīmēt'
    },

    Charts : {
        chartDesigner : 'Diagrammas izveidotājs',
        newChart      : 'Jauna Diagramma',
        download      : 'Lejupielādēt',
        settings      : 'Iestatījumi'
    },

    PdfExport : {
        'Waiting for response from server' : 'Gaida atbildi no servera...',
        'Export failed'                    : 'Eksportēšana neizdevās',
        'Server error'                     : 'Servera kļūda',
        'Generating pages'                 : 'Ģenerē lapas',
        'Click to abort'                   : 'Noklikšķiniet, lai atceltu'
    },

    ExportDialog : {
        width          : '40 em',
        labelWidth     : '12 em',
        exportSettings : 'Eksportēšanas iestatījumi',
        export         : 'Eksportēt',
        printSettings  : 'Drukas iestatījumi',
        print          : 'Drukāt',
        exporterType   : 'Noteikt pielāgojumu lapai',
        cancel         : 'Atcelt',
        fileFormat     : 'Faila formāts',
        rows           : 'Rindas',
        alignRows      : 'Izlīdzināt rindas',
        columns        : 'Kolonnas',
        paperFormat    : 'Papīra formāts',
        orientation    : 'Orientācija',
        repeatHeader   : 'Atkārtot galveni'
    },

    ExportRowsCombo : {
        all     : 'Visas rindas',
        visible : 'Redzamās rindas'
    },

    ExportOrientationCombo : {
        portrait  : 'Portretorientācija',
        landscape : 'Ainavorientācija'
    },

    SinglePageExporter : {
        singlepage : 'Viena lapa'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Viena lapa (nemainīts mērogs)'
    },

    MultiPageExporter : {
        multipage     : 'Vairākas lapas',
        exportingPage : ({ currentPage, totalPages }) => `Exporting page ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Vairākas lapas (vertikāli)',
        exportingPage     : ({ currentPage, totalPages }) => `Exporting page ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Ielādē',
        expand             : 'Izvērst',
        collapse           : 'Sakļaut',
        columnDescription  : 'Pārslēgt rindas detaļas',
        expandedRowContent : 'Izvērstā rindas saturs'
    },

    TreeGroup : {
        group                  : 'Grupēt pēc',
        stopGrouping           : 'Apturēt grupēšanu',
        stopGroupingThisColumn : 'Atgrupēt kolonnu'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Filtrēšanas operācija neizdevās, lūdzu, mēģiniet vēlreiz'
    },

    AIFilterField : {
        progressText : 'Filtrēšana'
    },

    PinColumns : {
        pinColumn  : 'Piestiprināt kolonnu',
        unpin      : 'Noņemt piestiprinājumu',
        pinToStart : 'Piestiprināt sākumā',
        pinToEnd   : 'Piestiprināt beigās'
    }
};

export default LocaleHelper.publishLocale(locale);
