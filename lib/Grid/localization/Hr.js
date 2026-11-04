import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Hr.js';

const emptyString = new String();

const locale = {

    localeName : 'Hr',
    localeDesc : 'Hrvatski',
    localeCode : 'hr',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Pretraži',
        selectAll   : 'Odaberi sve',
        removeAll   : 'Ukloni sve',
        filtersSet  : n => n === 1 ? `1 filter postavljen` : `${n} filtera postavljeno`,
        noItems     : 'Nema rezultata',
        placeholder : 'Filtriraj...',
        apply       : 'Primijeni'
    },

    ColumnPicker : {
        column          : 'Stupac',
        columnsMenu     : 'Stupci',
        hideColumn      : 'Sakrij stupac',
        hideColumnShort : 'Sakrij',
        newColumns      : 'Novi stupci',
        allColumns      : 'Svi stupci',
        showName        : column => `Prikaži stupac${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Sakrij stupac${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Primijeni filtar',
        filter        : 'Filtar',
        editFilter    : 'Uredi filtar',
        on            : 'Na',
        before        : 'Prije',
        after         : 'Poslije',
        equals        : 'Jednako',
        lessThan      : 'Manje od',
        moreThan      : 'Više od',
        removeFilter  : 'Ukloni filtar',
        disableFilter : 'Onemogući filtar'
    },

    FilterBar : {
        enableFilterBar  : 'Pokaži traku s filtrima',
        disableFilterBar : 'Sakrij traku s filtrima'
    },

    Group : {
        group                : 'Grupiraj',
        groupAscending       : 'Grupiraj uzlazno',
        groupDescending      : 'Grupiraj silazno',
        groupAscendingShort  : 'Uzlazno',
        groupDescendingShort : 'Silazno',
        stopGrouping         : 'Zaustavi grupiranje',
        stopGroupingShort    : 'Zaustavi'
    },

    HeaderMenu : {
        moveBefore     : text => `Pomakni prije "${text}"`,
        moveAfter      : text => `Pomakni nakon "${text}"`,
        collapseColumn : 'Sažmi stupac',
        expandColumn   : 'Proširi stupac'
    },

    ColumnRename : {
        rename : 'Preimenuj'
    },

    ColumnResize : {
        resizeColumn : 'Promijeni veličinu stupca',
        width        : 'Širina',
        fitToData    : 'Prilagodi podacima'
    },

    MergeCells : {
        mergeCells  : 'Spoji ćelije',
        menuTooltip : 'Spoji ćelije s istom vrijednosti kad su razvrstane po ovom stupcu'
    },

    Search : {
        searchForValue : 'Pretraži vrijednost'
    },

    Sort : {
        sort                   : 'Razvrstaj',
        sortAscending          : 'Razvrstaj uzlazno',
        sortDescending         : 'Razvrstaj silazno',
        multiSort              : 'Višestruko razvrstavanje',
        removeSorter           : 'Ukloni razvrstavač',
        addSortAscending       : 'Dodaj uzlazni razvrstavač',
        addSortDescending      : 'Dodaj silazni razvrstavač',
        toggleSortAscending    : 'Promijeni na uzlazno',
        toggleSortDescending   : 'Promijeni na silazno',
        sortAscendingShort     : 'Uzlazno',
        sortDescendingShort    : 'Silazno',
        removeSorterShort      : 'Ukloni',
        addSortAscendingShort  : '+ Uzlazno',
        addSortDescendingShort : '+ Silazno'
    },

    Split : {
        split        : 'Podijeljeno',
        unsplit      : 'Nepodijeljeno',
        horizontally : 'Horizontalno',
        vertically   : 'Vertikalno',
        both         : 'Oboje',
        top          : 'gore',
        bottom       : 'dolje',
        left         : 'lijevo',
        right        : 'desno'
    },

    LockRows : {
        lockRow   : 'Zaključaj redak',
        unlockRow : 'Otključaj redak'
    },

    ActionColumn : {
        rowActions : 'Radnje u retku'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} stupac. ` : ''}RAZMAKNICA za kontekstni izbornik${column.canSort ? ', ENTER za razvrstavanje' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Redak widgeti'
    },

    Checkbox : {
        toggleRowSelect : 'Prebaci odabir retka',
        toggleSelection : 'Prebaci odabir čitavog skupa podataka',
        toggleName      : column => `Prebaci ${column.text || 'vrijednost'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `ocjena : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Broj reda'
    },

    GridBase : {
        loadFailedMessage  : 'Učitavanje podataka nije uspjelo!',
        syncFailedMessage  : 'Sinkronizacija podataka nije uspjela!',
        unspecifiedFailure : 'Neočekivana pogreška',
        networkFailure     : 'Pogreška mreže',
        parseFailure       : 'Analiziranje odgovora poslužitelja nije uspjelo',
        serverResponse     : 'Odgovor poslužitelja:',
        noRows             : 'Nema zapisa za prikazivanje',
        moveColumnLeft     : 'Pomakni se na lijevi odjeljak',
        moveColumnRight    : 'Pomakni se na desni odjeljak',
        moveColumnTo       : region => `Pomakni stupac na ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 redak odgovara filtru` : `${n} redaka odgovara filtru`) : 'Nijedan redak ne odgovara filtru'
    },

    CellMenu : {
        removeRow : 'Obriši'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopiraj',
        cutRecord   : 'Izreži',
        pasteRecord : 'Zalijepi',
        rows        : 'redci',
        row         : 'redak'
    },

    CellCopyPaste : {
        copy  : 'Kopiraj',
        cut   : 'Izreži',
        paste : 'Zalijepi'
    },

    Charts : {
        chartDesigner : 'Dizajner grafikona',
        newChart      : 'Novi Grafikon',
        download      : 'Preuzmi',
        settings      : 'Postavke'
    },

    PdfExport : {
        'Waiting for response from server' : 'Čeka se odgovor poslužitelja...',
        'Export failed'                    : 'Izvoz nije uspio',
        'Server error'                     : 'Pogreška poslužitelja',
        'Generating pages'                 : 'Izrada stranica...',
        'Click to abort'                   : 'Otkaži'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Postavke izvoza',
        export         : 'Izvoz',
        printSettings  : 'Postavke ispisa',
        print          : 'Ispis',
        exporterType   : 'Kontrola numeriranja stranica',
        cancel         : 'Otkaži',
        fileFormat     : 'Oblik datoteke',
        rows           : 'Retci',
        alignRows      : 'Poravnaj retke',
        columns        : 'Stupci',
        paperFormat    : 'Oblik papira',
        orientation    : 'Usmjerenje',
        repeatHeader   : 'Ponovi zaglavlje'
    },

    ExportRowsCombo : {
        all     : 'Svi retci',
        visible : 'Vidljivi retci'
    },

    ExportOrientationCombo : {
        portrait  : 'Okomito',
        landscape : 'Vodoravno'
    },

    SinglePageExporter : {
        singlepage : 'Jedna stranica'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Jedna stranica (neprilagođeno)'
    },

    MultiPageExporter : {
        multipage     : 'Višestruke stranice',
        exportingPage : ({ currentPage, totalPages }) => `Izvoz stranice ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Višestruke stranice (okomito)',
        exportingPage     : ({ currentPage, totalPages }) => `Izvoz stranice ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Učitavanje',
        expand             : 'Proširi',
        collapse           : 'Sažmi',
        columnDescription  : 'Prebaci detalje retka',
        expandedRowContent : 'Prošireni sadržaj retka'
    },

    TreeGroup : {
        group                  : 'Grupiraj po',
        stopGrouping           : 'Prekini grupiranje',
        stopGroupingThisColumn : 'Poništi grupiranje stupca'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Operacija filtriranja nije uspjela, pokušajte ponovno'
    },

    AIFilterField : {
        progressText : 'Filtriranje'
    },

    PinColumns : {
        pinColumn  : 'Prikvači stupac',
        unpin      : 'Ukloni prikvačivanje',
        pinToStart : 'Prikvači na početak',
        pinToEnd   : 'Prikvači na kraj'
    }
};

export default LocaleHelper.publishLocale(locale);
