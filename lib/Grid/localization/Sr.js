import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Sr.js';

const emptyString = new String();

const locale = {

    localeName : 'Sr',
    localeDesc : 'Srpski',
    localeCode : 'sr',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Pretraga',
        selectAll   : 'Izaberi sve',
        removeAll   : 'Ukloni sve',
        filtersSet  : n => n === 1 ? `1 filter postavljen` : `${n} filtera postavljeno`,
        noItems     : 'Nema rezultata',
        placeholder : 'Filter...',
        apply       : 'Primeni'
    },

    ColumnPicker : {
        column          : 'Kolona',
        columnsMenu     : 'Kolone',
        hideColumn      : 'Sakrij kolonu',
        hideColumnShort : 'Sakrij',
        newColumns      : 'Nove kolone',
        allColumns      : 'Sve kolone',
        showName        : column => `Prikaži kolonu${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Sakrij kolonu${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Primeni filter',
        filter        : 'Filter',
        editFilter    : 'Uredi filter',
        on            : 'Uključeno',
        before        : 'Pre',
        after         : 'Posle',
        equals        : 'Jednako',
        lessThan      : 'Manje od',
        moreThan      : 'Više od',
        removeFilter  : 'Ukloni filter',
        disableFilter : 'Onemogući filter'
    },

    FilterBar : {
        enableFilterBar  : 'Prikaži traku sa filterima',
        disableFilterBar : 'Sakrij traku sa filterima'
    },

    Group : {
        group                : 'Grupiši',
        groupAscending       : 'Grupiši uzlazno',
        groupDescending      : 'Grupiši silazno',
        groupAscendingShort  : 'Uzlazno',
        groupDescendingShort : 'Silazno',
        stopGrouping         : 'Prekini grupisanje',
        stopGroupingShort    : 'Stani'
    },

    HeaderMenu : {
        moveBefore     : text => `Pomeri pre "${text}"`,
        moveAfter      : text => `Pomeri posle "${text}"`,
        collapseColumn : 'Skupi kolonu',
        expandColumn   : 'Proširi kolonu'
    },

    ColumnRename : {
        rename : 'Preimenuj'
    },

    ColumnResize : {
        resizeColumn : 'Promeni veličinu kolone',
        width        : 'Širina',
        fitToData    : 'Prilagodi podacima'
    },

    MergeCells : {
        mergeCells  : 'Spoj ćelije',
        menuTooltip : 'Spoj ćelije sa istim vrednostima sortirane prema ovoj koloni'
    },

    Search : {
        searchForValue : 'Pretraži vrednost'
    },

    Sort : {
        sort                   : 'Sortiraj',
        sortAscending          : 'Sortiraj uzlazno',
        sortDescending         : 'Sortiraj silazno',
        multiSort              : 'Višestruko sortiranje',
        removeSorter           : 'Ukloni sortiranje',
        addSortAscending       : 'Dodaj uzlazno sortiranje',
        addSortDescending      : 'Dodaj silazno sortiranje',
        toggleSortAscending    : 'Promeni u uzlazno',
        toggleSortDescending   : 'Promeni u sliazno',
        sortAscendingShort     : 'Uzlazno',
        sortDescendingShort    : 'Silazno',
        removeSorterShort      : 'Ukloni',
        addSortAscendingShort  : '+ Uzlazno',
        addSortDescendingShort : '+ Silazno'
    },

    Split : {
        split        : 'Podeljeno',
        unsplit      : 'Nepodeljeno',
        horizontally : 'Horizontalno',
        vertically   : 'Vertikalno',
        both         : 'Oboje',
        top          : 'gore',
        bottom       : 'dole',
        left         : 'levo',
        right        : 'desno'
    },

    LockRows : {
        lockRow   : 'Zaključaj red',
        unlockRow : 'Otključaj red'
    },

    ActionColumn : {
        rowActions : 'Radnje u redu'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} kolone. ` : ''}SPACE za kontekstni meni${column.canSort ? ', ENTER za sortiranje' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Red widgeti'
    },

    Checkbox : {
        toggleRowSelect : 'Naizmenični izbor reda',
        toggleSelection : 'Naizmenični izbor kompletnog seta podataka',
        toggleName      : column => `Prebaci ${column.text || 'vrednost'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `ocena : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Број реда'
    },

    GridBase : {
        loadFailedMessage  : 'Učitavanje podataka nije uspelo!',
        syncFailedMessage  : 'Sinhronizacija podataka nije uspela!',
        unspecifiedFailure : 'Neodređena greška',
        networkFailure     : 'Greška mreže',
        parseFailure       : 'Raščlanjivanje odgovora servera nije uspelo',
        serverResponse     : 'Odgovor servera:',
        noRows             : 'Nema zapisa za prikaz',
        moveColumnLeft     : 'Pomeri u levi odeljak',
        moveColumnRight    : 'Pomeri u desni odeljak',
        moveColumnTo       : region => `Pomeri kolonu u ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 red odgovara filteru` : `${n} redova odgovara filteru`) : 'Nijedan red ne odgovara filteru'
    },

    CellMenu : {
        removeRow : 'Obriši'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopiraj',
        cutRecord   : 'Iseci',
        pasteRecord : 'Umetni',
        rows        : 'redova',
        row         : 'red'
    },

    CellCopyPaste : {
        copy  : 'Kopiraj',
        cut   : 'Iseci',
        paste : 'Umetni'
    },

    Charts : {
        chartDesigner : 'Dizajner grafikona',
        newChart      : 'Novi grafikon',
        download      : 'Преузми',
        settings      : 'Подешавања'
    },

    PdfExport : {
        'Waiting for response from server' : 'Čeka se na odgovor servera...',
        'Export failed'                    : 'Izvoz nije uspeo',
        'Server error'                     : 'Greška servera',
        'Generating pages'                 : 'Generišem stranice...',
        'Click to abort'                   : 'Otkaži'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Izvezi podešavanja',
        export         : 'Izvezi',
        printSettings  : 'Postavke štampe',
        print          : 'Štampa',
        exporterType   : 'Kontrola straničenja',
        cancel         : 'Otkaži',
        fileFormat     : 'Format datoteke',
        rows           : 'Redovi',
        alignRows      : 'Poravnaj redove',
        columns        : 'Kolone',
        paperFormat    : 'Format papira',
        orientation    : 'Orijentacija',
        repeatHeader   : 'Ponovi zaglavlje'
    },

    ExportRowsCombo : {
        all     : 'Svi redovi',
        visible : 'Vidljivi redovi'
    },

    ExportOrientationCombo : {
        portrait  : 'Upravno',
        landscape : 'Položeno'
    },

    SinglePageExporter : {
        singlepage : 'Jedna strana'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Jedna stranica (nepromenjena)'
    },

    MultiPageExporter : {
        multipage     : 'Više strana',
        exportingPage : ({ currentPage, totalPages }) => `Izvos stranice ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Više strana (uspravno)',
        exportingPage     : ({ currentPage, totalPages }) => ` Izvos stranice ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Učitavanje',
        expand             : 'Raširi',
        collapse           : 'Skupi',
        columnDescription  : 'Prebaci detalje reda',
        expandedRowContent : 'Prošireni sadržaj reda'
    },

    TreeGroup : {
        group                  : 'Grupiši po',
        stopGrouping           : 'Prekini grupisanje',
        stopGroupingThisColumn : 'Prekini grupisanje ove kolone'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Operacija filtriranja nije uspela, molimo pokušajte ponovo'
    },

    AIFilterField : {
        progressText : 'Filtriranje'
    },

    PinColumns : {
        pinColumn  : 'Prikvači kolonu',
        unpin      : 'Bez prikvačivanja',
        pinToStart : 'Prikvači na početak',
        pinToEnd   : 'Prikvači na kraj'
    }
};

export default LocaleHelper.publishLocale(locale);
