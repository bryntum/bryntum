import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Hu.js';

const emptyString = new String();

const locale = {

    localeName : 'Hu',
    localeDesc : 'Magyar',
    localeCode : 'hu',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Keresés',
        selectAll   : 'Mind kijelölése',
        removeAll   : 'Összes eltávolítása',
        filtersSet  : n => n === 1 ? `1 szűrő beállítva` : `${n} szűrő beállítva`,
        noItems     : 'Nincs találat',
        placeholder : 'Szűrés...',
        apply       : 'Alkalmaz'
    },

    ColumnPicker : {
        column          : 'Oszlop',
        columnsMenu     : 'Oszlopok',
        hideColumn      : 'Oszlop elrejtése',
        hideColumnShort : 'Elrejtés',
        newColumns      : 'Új oszlopok',
        allColumns      : 'Összes oszlop',
        showName        : column => `Oszlop megjelenítése${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Oszlop elrejtése${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Szűrő alkalmazása',
        filter        : 'Szűrő',
        editFilter    : 'Szűrő szerkesztése',
        on            : 'Feltétel',
        before        : 'Előtte',
        after         : 'Utána',
        equals        : 'Egyenlő',
        lessThan      : 'Kevesebb mint',
        moreThan      : 'Több mint',
        removeFilter  : 'Szűrő törlése',
        disableFilter : 'Szűrő tiltása'
    },

    FilterBar : {
        enableFilterBar  : 'Szűrősáv megjelenítése',
        disableFilterBar : 'Szűrősáv elrejtése'
    },

    Group : {
        group                : 'Csoportosítás',
        groupAscending       : 'Csoport növekvő',
        groupDescending      : 'Csoport csökkenő',
        groupAscendingShort  : 'Növekvő',
        groupDescendingShort : 'Csökkenő',
        stopGrouping         : 'Csoportbontás',
        stopGroupingShort    : 'Befejezés'
    },

    HeaderMenu : {
        moveBefore     : text => `Áthelyezés elé "${text}"`,
        moveAfter      : text => `Áthelyezés mögé "${text}"`,
        collapseColumn : 'Oszlop összecsukása',
        expandColumn   : 'Oszlop kibontása'
    },

    ColumnRename : {
        rename : 'Átnevezés'
    },

    ColumnResize : {
        resizeColumn : 'Oszlop átméretezése',
        width        : 'Szélesség',
        fitToData    : 'Igazítás az adatokhoz'
    },

    MergeCells : {
        mergeCells  : 'Cellák egyesítése',
        menuTooltip : 'Azonos értékű cellák egyesítése az oszlop alapján történő rendezéskor'
    },

    Search : {
        searchForValue : 'Érték keresése'
    },

    Sort : {
        sort                   : 'Rendezés',
        sortAscending          : 'Növekvő sorrend',
        sortDescending         : 'Csökkenő sorrend',
        multiSort              : 'Többszörös rendezés',
        removeSorter           : 'Rendező törlése',
        addSortAscending       : 'Növekvő rendező hozzáadása',
        addSortDescending      : 'Csökkenő rendező hozzáadása',
        toggleSortAscending    : 'Váltás növekvőre',
        toggleSortDescending   : 'Váltás csökkenőre',
        sortAscendingShort     : 'Növekvő',
        sortDescendingShort    : 'Csökkenő',
        removeSorterShort      : 'Eltávolítás',
        addSortAscendingShort  : '+ Növekvő',
        addSortDescendingShort : '+ Csökkenő'
    },

    Split : {
        split        : 'Szétválasztás',
        unsplit      : 'Egybeválasztás',
        horizontally : 'Vízszintesen',
        vertically   : 'Függőlegesen',
        both         : 'Mindkettő',
        top          : 'fent',
        bottom       : 'lent',
        left         : 'bal',
        right        : 'jobb'
    },

    LockRows : {
        lockRow   : 'Sor zárolása',
        unlockRow : 'Sor feloldása'
    },

    ActionColumn : {
        rowActions : 'Sor műveletek'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} oszlop. ` : ''}SZÓKÖZ a helyi menühöz${column.canSort ? ', ENTER a rendezéshez' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Sor widgetek'
    },

    Checkbox : {
        toggleRowSelect : 'Sorválasztás váltása',
        toggleSelection : 'Teljes adatlap kiválasztásának váltása',
        toggleName      : column => `Váltás ${column.text || 'érték'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `értékelés : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Sorszám'
    },

    GridBase : {
        loadFailedMessage  : 'Adatok betöltése sikertelen!',
        syncFailedMessage  : 'Adatszinkronizálás sikertelen!',
        unspecifiedFailure : 'Ismeretlen hiba',
        networkFailure     : 'Hálózati hiba',
        parseFailure       : 'Szerverválasz értelmezési hiba',
        serverResponse     : 'Szerverválasz:',
        noRows             : 'Nincs megjeleníthető bejegyzés',
        moveColumnLeft     : 'Áthelyezés a bal oldalra',
        moveColumnRight    : 'Áthelyezés a jobb oldalra',
        moveColumnTo       : region => `Oszlop áthelyezése ide: ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 sor felel meg a szűrőnek` : `${n} sor felel meg a szűrőnek`) : 'Nincs sor, amely megfelel a szűrőnek'
    },

    CellMenu : {
        removeRow : 'Törlés'
    },

    RowCopyPaste : {
        copyRecord  : 'Másolás',
        cutRecord   : 'Kivágás',
        pasteRecord : 'Beillesztés',
        rows        : 'sorok',
        row         : 'sor'
    },

    CellCopyPaste : {
        copy  : 'Másolás',
        cut   : 'Kivágás',
        paste : 'Beillesztés'
    },

    Charts : {
        chartDesigner : 'Diagram tervező',
        newChart      : 'Új Diagram',
        download      : 'Letöltés',
        settings      : 'Beállítások'
    },

    PdfExport : {
        'Waiting for response from server' : 'Várakozás a szerver válaszára...',
        'Export failed'                    : 'Sikertelen exportálás',
        'Server error'                     : 'Szerverhiba',
        'Generating pages'                 : 'Oldalak létrehozása...',
        'Click to abort'                   : 'Mégse'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Beállítások exportálása',
        export         : 'Exportálás',
        printSettings  : 'Nyomtatási beállítások',
        print          : 'Nyomtatás',
        exporterType   : 'Oldalszámozás szabályozása',
        cancel         : 'Mégse',
        fileFormat     : 'Fájlformátum',
        rows           : 'Sorok',
        alignRows      : 'Sorok igazítása',
        columns        : 'Oszlopok',
        paperFormat    : 'Papírformátum',
        orientation    : 'Tájolás',
        repeatHeader   : 'Fejléc ismétlése'
    },

    ExportRowsCombo : {
        all     : 'Összes sor',
        visible : 'Látható sorok'
    },

    ExportOrientationCombo : {
        portrait  : 'Álló',
        landscape : 'Fekvő'
    },

    SinglePageExporter : {
        singlepage : 'Egy oldal'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Egyoldalas (méretezés nélkül)'
    },

    MultiPageExporter : {
        multipage     : 'Több oldal',
        exportingPage : ({ currentPage, totalPages }) => `Oldal exportálása ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Több oldal (függőleges)',
        exportingPage     : ({ currentPage, totalPages }) => `Oldal exportálása ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Betöltés',
        expand             : 'Kibontás',
        collapse           : 'Összecsukás',
        columnDescription  : 'Sor részleteinek átkapcsolása',
        expandedRowContent : 'Kibontott sor tartalma'
    },

    TreeGroup : {
        group                  : 'Csoportosítás',
        stopGrouping           : 'Csoportosítás megszakítása',
        stopGroupingThisColumn : 'Oszlop szétbontása'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'A szűrési művelet sikertelen, kérjük, próbálja újra'
    },

    AIFilterField : {
        progressText : 'Szűrés'
    },

    PinColumns : {
        pinColumn  : 'Oszlop rögzítése',
        unpin      : 'Rögzítés megszüntetése',
        pinToStart : 'Rögzítés az elejére',
        pinToEnd   : 'Rögzítés a végére'
    }
};

export default LocaleHelper.publishLocale(locale);
