import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Cs.js';

const emptyString = new String();

const locale = {

    localeName : 'Cs',
    localeDesc : 'Česky',
    localeCode : 'cs',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Hledat',
        selectAll   : 'Vybrat vše',
        removeAll   : 'Odebrat vše',
        filtersSet  : n => n === 1 ? `1 filtr nastaven` : `${n} filtry nastaveny`,
        noItems     : 'Nebyla nalezena žádná data',
        placeholder : 'Filtrovat...',
        apply       : 'Použít'
    },

    ColumnPicker : {
        column          : 'Sloupec',
        columnsMenu     : 'Sloupce',
        hideColumn      : 'Skýrt sloupec',
        hideColumnShort : 'Skrýt',
        newColumns      : 'Nové sloupce',
        allColumns      : 'Všechny sloupce',
        showName        : column => `Zobrazit sloupec${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Skrýt sloupec${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Použít filtr',
        filter        : 'Filtr',
        editFilter    : 'Upravit filtr',
        on            : 'Zap.',
        before        : 'Před',
        after         : 'Po',
        equals        : 'Rovná se',
        lessThan      : 'Méně než',
        moreThan      : 'Více než',
        removeFilter  : 'Odebrat filtr',
        disableFilter : 'Deaktivovat filtr'
    },

    FilterBar : {
        enableFilterBar  : 'Zobrazit lištu s filtrem',
        disableFilterBar : 'Skrýt lištu s filtrem'
    },

    Group : {
        group                : 'Seskupit',
        groupAscending       : 'Seskupit vzestupně',
        groupDescending      : 'Seskupit sestupně',
        groupAscendingShort  : 'Vzestupně',
        groupDescendingShort : 'Sestupně',
        stopGrouping         : 'Zastavit seskupování',
        stopGroupingShort    : 'Zastavit'
    },

    HeaderMenu : {
        moveBefore     : text => `Posunout před "${text}"`,
        moveAfter      : text => `Posunout za "${text}"`,
        collapseColumn : 'Sloučit sloupec',
        expandColumn   : 'Rozšířit sloupec'
    },

    ColumnRename : {
        rename : 'Přejmenovat'
    },

    ColumnResize : {
        resizeColumn : 'Změnit velikost sloupce',
        width        : 'Šířka',
        fitToData    : 'Přizpůsobit datům'
    },

    MergeCells : {
        mergeCells  : 'Sloučit buňky',
        menuTooltip : 'Při řazení tohoto sloupce sloučit buňky se stejnou hodnotou'
    },

    Search : {
        searchForValue : 'Vyhledat hodnotu'
    },

    Sort : {
        sort                   : 'Seřadit',
        sortAscending          : 'Seřadit vzestupně',
        sortDescending         : 'Seřadit sestupně',
        multiSort              : 'Multi řazení',
        removeSorter           : 'Odebrat řazení',
        addSortAscending       : 'Přidat vzestupné řazení',
        addSortDescending      : 'Přidat sestupné řazení',
        toggleSortAscending    : 'Změnit na vzestupné',
        toggleSortDescending   : 'Změnit na sestupné',
        sortAscendingShort     : 'Vzestupně',
        sortDescendingShort    : 'Sestupně',
        removeSorterShort      : 'Odebrat',
        addSortAscendingShort  : '+ vzestupně',
        addSortDescendingShort : '+ sestupně'
    },

    Split : {
        split        : 'Rozdělit',
        unsplit      : 'Nerozdělit',
        horizontally : 'Vodorovně',
        vertically   : 'Svisle',
        both         : 'Oboje',
        top          : 'nahoře',
        bottom       : 'dole',
        left         : 'vlevo',
        right        : 'vpravo'
    },

    LockRows : {
        lockRow   : 'Uzamknout řádek',
        unlockRow : 'Odemknout řádek'
    },

    ActionColumn : {
        rowActions : 'Akce řádku'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} sloupec. ` : ''}MEZERNÍK pro kontextová nabídka${column.canSort ? ', ENTER pro řazení' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Řádkové widgety'
    },

    Checkbox : {
        toggleRowSelect : 'Přepnout výběr řádku',
        toggleSelection : 'Přepnout výběr celé sady dat',
        toggleName      : column => `Přepnout ${column.text || 'hodnotu'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `hodnocení : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Číslo řádku'
    },

    GridBase : {
        loadFailedMessage  : 'Nahrání dat se nezdařilo!',
        syncFailedMessage  : 'Synchronizace dat se nezdařila!',
        unspecifiedFailure : 'Nespecifikované selhání',
        networkFailure     : 'Chyba sítě',
        parseFailure       : 'Nepodařilo se analyzovat odezvu serveru',
        serverResponse     : 'Odezva serveru:',
        noRows             : 'Žádné záznamy k zobrazení',
        moveColumnLeft     : 'Přesunout do levé části',
        moveColumnRight    : 'Přesunout do pravé části',
        moveColumnTo       : region => `Přesunout sloupec do ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 řádek odpovídá filtru` : `${n} řádky odpovídají filtru`) : 'Žádné řádky neodpovídají filtru'
    },

    CellMenu : {
        removeRow : 'Vymazat'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopírovat',
        cutRecord   : 'Vyjmout',
        pasteRecord : 'Vložit',
        rows        : 'řádky',
        row         : 'řádek'
    },

    CellCopyPaste : {
        copy  : 'Kopírovat',
        cut   : 'Vyříznout',
        paste : 'Vložit'
    },

    Charts : {
        chartDesigner : 'Návrhář grafu',
        newChart      : 'Nový Graf',
        download      : 'Stáhnout',
        settings      : 'Nastavení'
    },

    PdfExport : {
        'Waiting for response from server' : 'Čekání na odezvu serveru...',
        'Export failed'                    : 'Export se nezdařil',
        'Server error'                     : 'Chyba serveru',
        'Generating pages'                 : 'Generování stránek...',
        'Click to abort'                   : 'Zrušit'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Nastavení exportu',
        export         : 'Export',
        printSettings  : 'Nastavení tisku',
        print          : 'Tisk',
        exporterType   : 'Kontrola stránkování',
        cancel         : 'Zrušit',
        fileFormat     : 'Formát souboru',
        rows           : 'Řádky',
        alignRows      : 'Srovnat řádky',
        columns        : 'Sloupce',
        paperFormat    : 'Formát papíru',
        orientation    : 'Orientace',
        repeatHeader   : 'Opakovat záhlaví'
    },

    ExportRowsCombo : {
        all     : 'Všechny řádky',
        visible : 'Viditelné řádky'
    },

    ExportOrientationCombo : {
        portrait  : 'Na výšku',
        landscape : 'Na šířku'
    },

    SinglePageExporter : {
        singlepage : 'Jedna stránka'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Jedna stránka (nezměněná velikost)'
    },

    MultiPageExporter : {
        multipage     : 'Více stránek',
        exportingPage : ({ currentPage, totalPages }) => `Export stránky ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Více stránek (vertikálně) ',
        exportingPage     : ({ currentPage, totalPages }) => `Export stránky ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Nahrávání',
        expand             : 'Rozbalit',
        collapse           : 'Sbalit',
        columnDescription  : 'Přepnout podrobnosti řádku',
        expandedRowContent : 'Rozšířený obsah řádku'
    },

    TreeGroup : {
        group                  : 'Seskupit podle',
        stopGrouping           : 'Ukončit seskupování',
        stopGroupingThisColumn : 'Zrušit seskupení sloupce'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Operace filtru nebyla úspěšná, zkuste to prosím znovu'
    },

    AIFilterField : {
        progressText : 'Filtrování'
    },

    PinColumns : {
        pinColumn  : 'Připnout sloupec',
        unpin      : 'Bez připnutí',
        pinToStart : 'Připnout na začátek',
        pinToEnd   : 'Připnout na konec'
    }
};

export default LocaleHelper.publishLocale(locale);
