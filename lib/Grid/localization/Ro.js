import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Ro.js';

const emptyString = new String();

const locale = {

    localeName : 'Ro',
    localeDesc : 'Română',
    localeCode : 'ro',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Caută',
        selectAll   : 'Selectează Tot',
        removeAll   : 'Elimină Tot',
        filtersSet  : n => n === 1 ? `1 filtru setat` : `${n} filtre setate`,
        noItems     : 'Nu s-au găsit rezultate',
        placeholder : 'Filtrează...',
        apply       : 'Aplică'
    },

    ColumnPicker : {
        column          : 'Coloană',
        columnsMenu     : 'Coloane',
        hideColumn      : 'Ascundere coloană',
        hideColumnShort : 'Ascundere',
        newColumns      : 'Coloane noi',
        allColumns      : 'Toate coloanele',
        showName        : column => `Afișează coloana${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Ascunde coloana${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Aplicare filtru',
        filter        : 'Filtru',
        editFilter    : 'Editare filtru',
        on            : 'Pornit',
        before        : 'Înainte',
        after         : 'După',
        equals        : 'Egal cu',
        lessThan      : 'Mai puțin decât',
        moreThan      : 'Mai mult decât',
        removeFilter  : 'Eliminare filtru',
        disableFilter : 'Dezactivați filtrul'
    },

    FilterBar : {
        enableFilterBar  : 'Afișare bară filtru',
        disableFilterBar : 'Ascundere bară filtru'
    },

    Group : {
        group                : 'Grupare',
        groupAscending       : 'Grupare ascendentă',
        groupDescending      : 'Grupare descendentă',
        groupAscendingShort  : 'Ascendent',
        groupDescendingShort : 'Descendent',
        stopGrouping         : 'Oprire grupare',
        stopGroupingShort    : 'Oprire'
    },

    HeaderMenu : {
        moveBefore     : text => `Mutare înainte de "${text}"`,
        moveAfter      : text => `Mutare după "${text}"`,
        collapseColumn : 'Restrângeți coloana',
        expandColumn   : 'Extindeți coloana'
    },

    ColumnRename : {
        rename : 'Redenumiți'
    },

    ColumnResize : {
        resizeColumn : 'Redimensionează coloana',
        width        : 'Lățime',
        fitToData    : 'Potrivește la date'
    },

    MergeCells : {
        mergeCells  : 'Îmbinare celule',
        menuTooltip : 'Îmbinare celule cu aceeași valoare la sortarea în funcție de această coloană'
    },

    Search : {
        searchForValue : 'Căutare valoare'
    },

    Sort : {
        sort                   : 'Sortare',
        sortAscending          : 'Sortare acendentă',
        sortDescending         : 'Sortare descendentă',
        multiSort              : 'Sortare multiplă',
        removeSorter           : 'Eliminare selector',
        addSortAscending       : 'Adăugare selector ascendent',
        addSortDescending      : 'Adăugare selector descendent',
        toggleSortAscending    : 'Schimbare la ascendent',
        toggleSortDescending   : 'Schimbare la descendent',
        sortAscendingShort     : 'Ascendent',
        sortDescendingShort    : 'Descendent',
        removeSorterShort      : 'Eliminare',
        addSortAscendingShort  : '+ Ascendent',
        addSortDescendingShort : '+ Descendent'
    },

    Split : {
        split        : 'Divizat',
        unsplit      : 'Nedivizat',
        horizontally : 'Orizontal',
        vertically   : 'Vertical',
        both         : 'Ambele',
        top          : 'sus',
        bottom       : 'jos',
        left         : 'stânga',
        right        : 'dreapta'
    },

    LockRows : {
        lockRow   : 'Blochează rândul',
        unlockRow : 'Deblochează rândul'
    },

    ActionColumn : {
        rowActions : 'Acțiuni pe rând'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} coloană. ` : ''}SPAȚIU pentru meniul contextual${column.canSort ? ', ENTER pentru sortare' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Widgeturi de rând'
    },

    Checkbox : {
        toggleRowSelect : 'Comutare selectare rând',
        toggleSelection : 'Comutare selectare pentru întregul set de date',
        toggleName      : column => `Comută ${column.text || 'valoare'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `rating : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Numărul rândului'
    },

    GridBase : {
        loadFailedMessage  : 'Încărcarea datelor a eșuat!',
        syncFailedMessage  : 'Sincronizarea datelor a eșuat!',
        unspecifiedFailure : 'Defecțiune nespecificată',
        networkFailure     : 'Eroare de rețea',
        parseFailure       : 'Analiza răspunsului serverului a eșuat',
        serverResponse     : 'Răspuns server:',
        noRows             : 'Nu există nicio înregistrare de afișat',
        moveColumnLeft     : 'Mutare în secțiunea din stânga',
        moveColumnRight    : 'Mutare în secțiunea din dreapta',
        moveColumnTo       : region => `Mutare coloană în ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 rând se potrivește filtrului` : `${n} rânduri se potrivesc filtrului`) : 'Niciun rând nu se potrivește filtrului'
    },

    CellMenu : {
        removeRow : 'Ștergere'
    },

    RowCopyPaste : {
        copyRecord  : 'Copiere',
        cutRecord   : 'Tăiere',
        pasteRecord : 'Lipire',
        rows        : 'rânduri',
        row         : 'rând'
    },

    CellCopyPaste : {
        copy  : 'Copiere',
        cut   : 'Tăiere',
        paste : 'Lipire'
    },

    Charts : {
        chartDesigner : 'Designer de Grafice',
        newChart      : 'Diagram nou',
        download      : 'Descarcă',
        settings      : 'Setări'
    },

    PdfExport : {
        'Waiting for response from server' : 'Se așteaptă răspunsul de la server...',
        'Export failed'                    : 'Exportare eșuată',
        'Server error'                     : 'Eroare server',
        'Generating pages'                 : 'Se generează paginile...',
        'Click to abort'                   : 'Anulare'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Setări exportare',
        export         : 'Exportare',
        printSettings  : 'Setări de imprimare',
        print          : 'Imprimare',
        exporterType   : 'Control paginație',
        cancel         : 'Anulare',
        fileFormat     : 'Format fișier',
        rows           : 'Rânduri',
        alignRows      : 'Aliniere rânduri',
        columns        : 'Coloane',
        paperFormat    : 'Format hârtie',
        orientation    : 'Orientare',
        repeatHeader   : 'Repetare antet'
    },

    ExportRowsCombo : {
        all     : 'Toate rândurile',
        visible : 'Rânduri vizibile'
    },

    ExportOrientationCombo : {
        portrait  : 'Portret',
        landscape : 'Vedere'
    },

    SinglePageExporter : {
        singlepage : 'Pagină unică'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'O singură pagină (neajustată)'
    },

    MultiPageExporter : {
        multipage     : 'Pagini multiple',
        exportingPage : ({ currentPage, totalPages }) => `Se exportă pagina ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Pagini multiple (vertical)',
        exportingPage     : ({ currentPage, totalPages }) => `Se exportă pagina ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Se încarcă',
        expand             : 'Extindere',
        collapse           : 'Restrângere',
        columnDescription  : 'Comută detaliile rândului',
        expandedRowContent : 'Conținutul rândului extins'
    },

    TreeGroup : {
        group                  : 'Grupează după',
        stopGrouping           : 'Oprește gruparea',
        stopGroupingThisColumn : 'Oprește gruparea acestei coloane'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Operațiunea de filtrare nereușită, vă rugăm să încercați din nou'
    },

    AIFilterField : {
        progressText : 'Filtrare'
    },

    PinColumns : {
        pinColumn  : 'Fixează coloana',
        unpin      : 'Anulează fixarea',
        pinToStart : 'Fixează la început',
        pinToEnd   : 'Fixează la sfârșit'
    }
};

export default LocaleHelper.publishLocale(locale);
