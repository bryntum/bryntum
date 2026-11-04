import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Lt.js';

const emptyString = new String();

const locale = {

    localeName : 'LT',
    localeDesc : 'Lietuvių',
    localeCode : 'lt-LT',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Paieška',
        selectAll   : 'Pasirinkti viską',
        removeAll   : 'Pašalinti viską',
        filtersSet  : n => n === 1 ? `1 filtras nustatytas` : `${n} filtrai nustatyti`,
        noItems     : 'Rezultatų nerasta',
        placeholder : 'Filtruoti...',
        apply       : 'Taikyti'
    },

    ColumnPicker : {
        column          : 'Stulpelis',
        columnsMenu     : 'Stulpeliai',
        hideColumn      : 'Slėpti stulpelį',
        hideColumnShort : 'Slėpti',
        newColumns      : 'Nauji stulpeliai',
        allColumns      : 'Visi stulpeliai',
        showName        : column => `Rodyti stulpelį${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Slėpti stulpelį${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Taikyti filtrą',
        filter        : 'Filtras',
        editFilter    : 'Redaguoti filtrą',
        on            : 'Įjungti',
        before        : 'Prieš',
        after         : 'Po',
        equals        : 'Lygu',
        lessThan      : 'Mažiau nei',
        moreThan      : 'Daugiau nei',
        removeFilter  : 'Pašalinti filtrą',
        disableFilter : 'Išjungti filtrą'
    },

    FilterBar : {
        enableFilterBar  : 'Rodyti filtro juostą',
        disableFilterBar : 'Slėpti filtro juostą'
    },

    Group : {
        group                : 'Grupuoti',
        groupAscending       : 'Grupuoti didėjimo tvarka',
        groupDescending      : 'Grupuoti mažėjimo tvarka',
        groupAscendingShort  : 'Didėjimo tvarka',
        groupDescendingShort : 'Mažėjimo tvarka',
        stopGrouping         : 'Stabdyti grupavimą',
        stopGroupingShort    : 'Stabdyti'
    },

    HeaderMenu : {
        moveBefore     : text => `Perkelti prieš "${text}"`,
        moveAfter      : text => `Perkelti po "${text}"`,
        collapseColumn : 'Sutraukti stulpelį',
        expandColumn   : 'Išplėsti stulpelį'
    },

    ColumnRename : {
        rename : 'Pervardyti'
    },

    ColumnResize : {
        resizeColumn : 'Keisti stulpelio dydį',
        width        : 'Plotis',
        fitToData    : 'Pritaikyti prie duomenų'
    },

    MergeCells : {
        mergeCells  : 'Sulieti langelius',
        menuTooltip : 'Suliekite langelius su tokia pačia reikšme, kai surikiuota pagal šį stulpelį'
    },

    Search : {
        searchForValue : 'Ieškoti reikšmių'
    },

    Sort : {
        sort                   : 'Rikiavimas',
        sortAscending          : 'Rikiuoti didėjimo tvarka',
        sortDescending         : 'Rikiuoti mažėjimo tvarka',
        multiSort              : 'Kelių reikšmių rikiavimas',
        removeSorter           : 'Pašalinti rūšiavimą',
        addSortAscending       : 'Įtraukti didėjantį rūšiavimą',
        addSortDescending      : 'Įtraukti mažėjantį rūšiavimą',
        toggleSortAscending    : 'Keisti į didėjimo tvarką',
        toggleSortDescending   : 'Keisti į mažėjimo tvarką',
        sortAscendingShort     : 'Didėjimo tvarka',
        sortDescendingShort    : 'Mažėjimo tvarka',
        removeSorterShort      : 'Šalinti',
        addSortAscendingShort  : '+ Didėjantis',
        addSortDescendingShort : '+ Mažėjantis'
    },

    Split : {
        split        : 'Perskirti',
        unsplit      : 'Nepadalytas',
        horizontally : 'Horizontaliai',
        vertically   : 'Vertikaliai',
        both         : 'Abu',
        top          : 'viršus',
        bottom       : 'apačia',
        left         : 'kairė',
        right        : 'dešinė'
    },

    LockRows : {
        lockRow   : 'Užrakinti eilutę',
        unlockRow : 'Atrakinti eilutę'
    },

    ActionColumn : {
        rowActions : 'Eilutės veiksmai'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} stulpelis. ` : ''}TARPAS kontekstiniam meniu${column.canSort ? ', norėdami rikiuoti, spauskite ENTER' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Eilutės valdikliai'
    },

    Checkbox : {
        toggleRowSelect : 'Perjungti eilutės pasirinkimą',
        toggleSelection : 'Perjungti viso duomenų rinkinio pasirinkimą',
        toggleName      : column => `Perjungti ${column.text || 'vertė'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `įvertinimas: ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Eilutės numeris'
    },

    GridBase : {
        loadFailedMessage  : 'Nepavyko įkelti duomenų!',
        syncFailedMessage  : 'Nepavyko sinchronizuoti duomenų!',
        unspecifiedFailure : 'Nenurodytas triktis',
        networkFailure     : 'Tinklo klaida',
        parseFailure       : 'Nepavyko išanalizuoti serverio atsakymo',
        serverResponse     : 'Serverio atsakas:',
        noRows             : 'Rodytinų įrašų nėra',
        moveColumnLeft     : 'Perkelti į kairį skyrių',
        moveColumnRight    : 'Perkelti į dešinį skyrių',
        moveColumnTo       : region => `Perkelti stulpelį į ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 eilutė atitinka filtrą` : `${n} eilutės atitinka filtrą`) : 'Nė viena eilutė neatitinka filtro'
    },

    CellMenu : {
        removeRow : 'Naikinti'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopijuoti',
        cutRecord   : 'Kirpimas',
        pasteRecord : 'Įklijavimas',
        rows        : 'eilutės',
        row         : 'eilutė'
    },

    CellCopyPaste : {
        copy  : 'Kopijuoti',
        cut   : 'Kirpimas',
        paste : 'Įklijavimas'
    },

    Charts : {
        chartDesigner : 'Diagramos kūrėjas',
        newChart      : 'Nauja Diagrama',
        download      : 'Atsisiųsti',
        settings      : 'Nustatymai'
    },

    PdfExport : {
        'Waiting for response from server' : 'Laukiama atsakymo iš serverio...',
        'Export failed'                    : 'Nepavyko eksportuoti',
        'Server error'                     : 'Serverio klaida',
        'Generating pages'                 : 'Kuriami puslapiai...',
        'Click to abort'                   : 'Atšaukti'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Eksportuoti parametrus',
        export         : 'Eksportuoti',
        printSettings  : 'Spausdinimo nustatymai',
        print          : 'Spausdinti',
        exporterType   : 'Kontroliuoti psulapių numeravimą',
        cancel         : 'Atšaukti',
        fileFormat     : 'Rinkmenos formatas',
        rows           : 'Eilutės',
        alignRows      : 'Centruoti eilutes',
        columns        : 'Stulpeliai',
        paperFormat    : 'Dokumento formatas',
        orientation    : 'Orientacija',
        repeatHeader   : 'Kartoti antraštę'
    },

    ExportRowsCombo : {
        all     : 'Visos eilutės',
        visible : 'Matomos eilutės'
    },

    ExportOrientationCombo : {
        portrait  : 'Stačias',
        landscape : 'Gulsčias'
    },

    SinglePageExporter : {
        singlepage : 'Vienkartinis puslapis'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Viena puslapis (nekeistas mastelis)'
    },

    MultiPageExporter : {
        multipage     : 'Vienkartiniai puslapiai',
        exportingPage : ({ currentPage, totalPages }) => `Puslapio eksportavimas ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Daugybiniai puslapiai (vertikalūs)',
        exportingPage     : ({ currentPage, totalPages }) => `Puslapio eksportavimas ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Įkeliama',
        expand             : 'Išplėsti',
        collapse           : 'Sutraukti',
        columnDescription  : 'Perjungti eilutės detales',
        expandedRowContent : 'Išplėsto eilutės turinys'
    },

    TreeGroup : {
        group                  : 'Grupuoti pagal',
        stopGrouping           : 'Stabdyti grupavimą',
        stopGroupingThisColumn : 'Išgrupuoti stulpelį'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Filtravimo operacija nesėkminga, bandykite dar kartą'
    },

    AIFilterField : {
        progressText : 'Filtruojama'
    },

    PinColumns : {
        pinColumn  : 'Prisegti stulpelį',
        unpin      : 'Atsegti',
        pinToStart : 'Prisegti pradžioje',
        pinToEnd   : 'Prisegti pabaigoje'
    }
};

export default LocaleHelper.publishLocale(locale);
