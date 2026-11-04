import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Sk.js';

const emptyString = new String();

const locale = {

    localeName : 'Sk',
    localeDesc : 'Slovenský',
    localeCode : 'sk',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Hľadať',
        selectAll   : 'Vybrať všetko',
        removeAll   : 'Odstrániť všetko',
        filtersSet  : n => n === 1 ? `1 filter nastavený` : `${n} filtre nastavené`,
        noItems     : 'Neboli nájdené žiadne výsledky',
        placeholder : 'Filter...',
        apply       : 'Použiť'
    },

    ColumnPicker : {
        column          : 'Stĺpec',
        columnsMenu     : 'Stĺpce',
        hideColumn      : 'Skryť stĺpec',
        hideColumnShort : 'Skryť',
        newColumns      : 'Nové stĺpce',
        allColumns      : 'Všetky stĺpce',
        showName        : column => `Zobraziť stĺpec${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Skryť stĺpec${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Použiť filter',
        filter        : 'Filter',
        editFilter    : 'Upraviť filter',
        on            : 'On',
        before        : 'Pred',
        after         : 'Po',
        equals        : 'Rovná sa',
        lessThan      : 'Menej ako',
        moreThan      : 'Viac ako',
        removeFilter  : 'Odstrániť filter',
        disableFilter : 'Deaktivovať filter'
    },

    FilterBar : {
        enableFilterBar  : 'Ukázať lištu filtra',
        disableFilterBar : 'Skryť lištu filtra'
    },

    Group : {
        group                : 'Group',
        groupAscending       : 'Vzostup skupiny',
        groupDescending      : 'Pokles skupiny',
        groupAscendingShort  : 'Vzostu',
        groupDescendingShort : 'Pokles',
        stopGrouping         : 'Zastaviť zoskupovanie',
        stopGroupingShort    : 'Zastaviť'
    },

    HeaderMenu : {
        moveBefore     : text => `Pohyb pred "${text}"`,
        moveAfter      : text => `Pohyb po "${text}"`,
        collapseColumn : 'Zbaliť stĺpec',
        expandColumn   : 'Rozbaliť stĺpec'
    },

    ColumnRename : {
        rename : 'Premenovať'
    },

    ColumnResize : {
        resizeColumn : 'Zmeniť veľkosť stĺpca',
        width        : 'Šírka',
        fitToData    : 'Prispôsobiť údajom'
    },

    MergeCells : {
        mergeCells  : 'Zlúčiť bunky',
        menuTooltip : 'Zlúčiť bunky s rovnakou hodnotou, keď sú triedené podľa tohto stĺpca'
    },

    Search : {
        searchForValue : 'Hľadať hodnotu'
    },

    Sort : {
        sort                   : 'Sort',
        sortAscending          : 'Triediť vzrastajúce',
        sortDescending         : 'Triediť klesajúce',
        multiSort              : 'Viacnásobné triedenie',
        removeSorter           : 'Odstrániť filter',
        addSortAscending       : 'Pridať stúpajúci filetr',
        addSortDescending      : 'Pridať klesajúci filter',
        toggleSortAscending    : 'Zmeniť na stúpajúci',
        toggleSortDescending   : 'Zmeniť na klesajúci',
        sortAscendingShort     : 'Stúpajúci',
        sortDescendingShort    : 'Klesajúci',
        removeSorterShort      : 'Odstrániť',
        addSortAscendingShort  : '+ Stúpajúci',
        addSortDescendingShort : '+ Klesajúci'
    },

    Split : {
        split        : 'Rozdelené',
        unsplit      : 'Nerozdelené',
        horizontally : 'Horizontálne',
        vertically   : 'Vertikálne',
        both         : 'Obe',
        top          : 'nahore',
        bottom       : 'dole',
        left         : 'vľavo',
        right        : 'vpravo'
    },

    LockRows : {
        lockRow   : 'Zamknúť riadok',
        unlockRow : 'Odomknúť riadok'
    },

    ActionColumn : {
        rowActions : 'Akcie riadku'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} stĺpec. ` : ''}MEDZERNÍK pre kontextové menu${column.canSort ? ', ZADAŤ na triedenie' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Riadkové widgety'
    },

    Checkbox : {
        toggleRowSelect : 'Prepnúť výber riadka',
        toggleSelection : 'Prepnúť výber celej sady údajov',
        toggleName      : column => `Prepnúť ${column.text || 'hodnotu'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `hodnotenie : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Číslo riadku'
    },

    GridBase : {
        loadFailedMessage  : 'Načítavanie údajov zlyhalo!',
        syncFailedMessage  : 'Synchronizácia údajov zlyhala!',
        unspecifiedFailure : 'Nešpecifikované zlyhanie',
        networkFailure     : 'Chyba siete',
        parseFailure       : 'Analýza odpovede server zlyhala',
        serverResponse     : 'Odpoveď servera:',
        noRows             : 'Žiadne záznamy na zobrazenie',
        moveColumnLeft     : 'Presunúť do ľavej časti',
        moveColumnRight    : 'Presunúť do pravej časti',
        moveColumnTo       : region => `Presunúť stĺpec do ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 riadok zodpovedá filtru` : `${n} riadky zodpovedajú filtru`) : 'Žiadne riadky nezodpovedajú filtru'
    },

    CellMenu : {
        removeRow : 'Vymazať'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopírovať',
        cutRecord   : 'Orezať',
        pasteRecord : 'Vložiť',
        rows        : 'riadky',
        row         : 'radok'
    },

    CellCopyPaste : {
        copy  : 'Kopírovať',
        cut   : 'Vystrihnúť',
        paste : 'Vložiť'
    },

    Charts : {
        chartDesigner : 'Návrhár grafov',
        newChart      : 'Nový graf',
        download      : 'Stiahnuť',
        settings      : 'Nastavenia'
    },

    PdfExport : {
        'Waiting for response from server' : 'Čakanie na odpoveď servera...',
        'Export failed'                    : 'Export zlyhal',
        'Server error'                     : 'Chyba servera',
        'Generating pages'                 : 'Generujú sa stránky...',
        'Click to abort'                   : 'Zrušiť'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Exportovať nastavenia',
        export         : 'Exportovať',
        printSettings  : 'Nastavenia tlače',
        print          : 'Tlačiť',
        exporterType   : 'Kontrolovať stránkovanie',
        cancel         : 'Zrušiť',
        fileFormat     : 'Formát súboru',
        rows           : 'Riadky',
        alignRows      : 'Zarovnať riaky',
        columns        : 'Stĺpce',
        paperFormat    : 'Formát papiera',
        orientation    : 'Orientácia',
        repeatHeader   : 'Zopakovať hlavičku'
    },

    ExportRowsCombo : {
        all     : 'Všetky riadky',
        visible : 'Viditeľné riadky'
    },

    ExportOrientationCombo : {
        portrait  : 'Portrét',
        landscape : 'Krajina'
    },

    SinglePageExporter : {
        singlepage : 'Jedna strana'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Jedna strana (nezmenšená)'
    },

    MultiPageExporter : {
        multipage     : 'Viaceré strany',
        exportingPage : ({ currentPage, totalPages }) => `Exportuje sa strana ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Viaceré strany (vertikálne)',
        exportingPage     : ({ currentPage, totalPages }) => `Exportuje sa strana ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Načítavanie',
        expand             : 'Rozbaliť',
        collapse           : 'Zbaliť',
        columnDescription  : 'Prepnúť podrobnosti riadku',
        expandedRowContent : 'Rozšírený obsah riadku'
    },

    TreeGroup : {
        group                  : 'Zoskupiť podľa',
        stopGrouping           : 'Zastaviť zoskupovanie',
        stopGroupingThisColumn : 'Zrušiť zoskupovanie tejto stĺpca'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Operácia filtrovania nebola úspešná, skúste to prosím znova'
    },

    AIFilterField : {
        progressText : 'Filtrovanie'
    },

    PinColumns : {
        pinColumn  : 'Pripnúť stĺpec',
        unpin      : 'Odopnúť',
        pinToStart : 'Pripnúť na začiatok',
        pinToEnd   : 'Pripnúť na koniec'
    }
};

export default LocaleHelper.publishLocale(locale);
