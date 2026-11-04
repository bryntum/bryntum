import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Pl.js';

const emptyString = new String();

const locale = {

    localeName : 'Pl',
    localeDesc : 'Polski',
    localeCode : 'pl',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Szukaj',
        selectAll   : 'Zaznacz wszystko',
        removeAll   : 'Usuń wszystko',
        filtersSet  : n => n === 1 ? `1 filtr ustawiony` : `${n} filtry ustawione`,
        noItems     : 'Nie znaleziono wyników',
        placeholder : 'Filtruj...',
        apply       : 'Zastosuj'
    },

    ColumnPicker : {
        column          : 'Kolumna',
        columnsMenu     : 'Kolumny',
        hideColumn      : 'Ukryj kolumnę',
        hideColumnShort : 'Ukryj',
        newColumns      : 'Nowe kolumny',
        allColumns      : 'Wszystkie kolumny',
        showName        : column => `Pokaż kolumnę${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Ukryj kolumnę${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Zastosuj filtr',
        filter        : 'Filtr',
        editFilter    : 'Edytuj filtr',
        on            : 'Pod',
        before        : 'Przed',
        after         : 'Po',
        equals        : 'Równa się',
        lessThan      : 'Mniej niż',
        moreThan      : 'Więcej niż',
        removeFilter  : 'Usuń filtr',
        disableFilter : 'Wyłącz filtr'
    },

    FilterBar : {
        enableFilterBar  : 'Pokaż pasek filtra',
        disableFilterBar : 'Ukryj pasek filtra'
    },

    Group : {
        group                : 'Group',
        groupAscending       : 'Grupa rosnąco',
        groupDescending      : 'Grupa malejąco',
        groupAscendingShort  : 'Rosnąco',
        groupDescendingShort : 'Malejąco',
        stopGrouping         : 'Zatrzymaj grupowanie',
        stopGroupingShort    : 'Zatrzymaj'
    },

    HeaderMenu : {
        moveBefore     : text => `Przenieś przed "${text}"`,
        moveAfter      : text => `Przenieś po” "${text}"`,
        collapseColumn : 'Zwiń kolumnę',
        expandColumn   : 'Rozwiń kolumnę'
    },

    ColumnRename : {
        rename : 'Zmień nazwę'
    },

    ColumnResize : {
        resizeColumn : 'Zmień rozmiar kolumny',
        width        : 'Szerokość',
        fitToData    : 'Dopasuj do danych'
    },

    MergeCells : {
        mergeCells  : 'Scal komórki',
        menuTooltip : 'Scal komórki z tą samą wartością po posortowaniu według tej kolumny'
    },

    Search : {
        searchForValue : 'Szukaj wartości'
    },

    Sort : {
        sort                   : 'Sort',
        sortAscending          : 'Sortuj rosnąco',
        sortDescending         : 'Sortuj malejąco',
        multiSort              : 'Wielosortowanie',
        removeSorter           : 'Usuń sortownik',
        addSortAscending       : 'Dodaj sortownik rosnąco',
        addSortDescending      : 'Dodaj sortownik malejąco',
        toggleSortAscending    : 'Zmień na rosnąco',
        toggleSortDescending   : 'Zmień na malejąco',
        sortAscendingShort     : 'Rosnąco',
        sortDescendingShort    : 'Malejąco',
        removeSorterShort      : 'Usuń',
        addSortAscendingShort  : '+ Rosnąco',
        addSortDescendingShort : '+ Malejąco'
    },

    Split : {
        split        : 'Podzielone',
        unsplit      : 'Nierozdzielone',
        horizontally : 'Poziomo',
        vertically   : 'Pionowo',
        both         : 'Oba',
        top          : 'góra',
        bottom       : 'dół',
        left         : 'lewo',
        right        : 'prawo'
    },

    LockRows : {
        lockRow   : 'Zablokuj wiersz',
        unlockRow : 'Odblokuj wiersz'
    },

    ActionColumn : {
        rowActions : 'Działania wiersza'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} kolumna. ` : ''}SPACJA dla menu kontekstowego${column.canSort ? ', ENTER aby posortować' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Widżety wiersza'
    },

    Checkbox : {
        toggleRowSelect : 'Przełącz wybór wiersza',
        toggleSelection : 'Przełącz wybór całego zbioru danych',
        toggleName      : column => `Przełącz ${column.text || 'wartość'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `ocena : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Numer wiersza'
    },

    GridBase : {
        loadFailedMessage  : 'Wczytywanie danych nie powiodło się!',
        syncFailedMessage  : 'Synchronizacja danych nie powiodła się!',
        unspecifiedFailure : 'Nieokreślona awaria',
        networkFailure     : 'Błąd sieci',
        parseFailure       : 'Nie udało się przeanalizować odpowiedzi serwera',
        serverResponse     : 'Odpowiedź serwera:',
        noRows             : 'Brak danych do wyświetlenia',
        moveColumnLeft     : 'Przenieś do lewej części',
        moveColumnRight    : 'Przenieś do prawej części',
        moveColumnTo       : region => `Przenieś kolumnę do ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 wiersz pasuje do filtra` : `${n} wiersze pasują do filtra`) : 'Brak wierszy pasujących do filtra'
    },

    CellMenu : {
        removeRow : 'Usuń'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopiuj',
        cutRecord   : 'Wytnij',
        pasteRecord : 'Wklej',
        rows        : 'wiersze',
        row         : 'wiersz'
    },

    CellCopyPaste : {
        copy  : 'Kopiuj',
        cut   : 'Wytnij',
        paste : 'Wklej'
    },

    Charts : {
        chartDesigner : 'Projektant wykresów',
        newChart      : 'Nowy Wykres',
        download      : 'Pobierz',
        settings      : 'Ustawienia'
    },

    PdfExport : {
        'Waiting for response from server' : 'Oczekiwanie na odpowiedź serwera...',
        'Export failed'                    : 'Eksport nie powiódł się',
        'Server error'                     : 'Błąd serwera',
        'Generating pages'                 : 'Generowanie stron...',
        'Click to abort'                   : 'Anuluj'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Eksportuj ustawienia',
        export         : 'Eksportuj',
        printSettings  : 'Ustawienia druku',
        print          : 'Drukuj',
        exporterType   : 'Kontroluj stronicowanie',
        cancel         : 'Anuluj',
        fileFormat     : 'Format pliku',
        rows           : 'Wiersze',
        alignRows      : 'Wyrównaj wiersze',
        columns        : 'Kolumny',
        paperFormat    : 'Format papieru',
        orientation    : 'Orientacja',
        repeatHeader   : 'Powtórz nagłówek'
    },

    ExportRowsCombo : {
        all     : 'Wszystkie wiersze',
        visible : 'Widoczne wiersze'
    },

    ExportOrientationCombo : {
        portrait  : 'Portret',
        landscape : 'Krajobraz'
    },

    SinglePageExporter : {
        singlepage : 'Jedna strona'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Pojedyncza strona (bez skalowania)'
    },

    MultiPageExporter : {
        multipage     : 'Wiele stron',
        exportingPage : ({ currentPage, totalPages }) => `Eksportowanie strony ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Wiele stron (w pionie)',
        exportingPage     : ({ currentPage, totalPages }) => `Eksportowanie strony ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Ładowanie',
        expand             : 'Rozwiń',
        collapse           : 'Zwiń',
        columnDescription  : 'Przełącz szczegóły wiersza',
        expandedRowContent : 'Rozwinięta zawartość wiersza'
    },

    TreeGroup : {
        group                  : 'Grupuj według',
        stopGrouping           : 'Przerwij grupowanie',
        stopGroupingThisColumn : 'Odgrupuj tę kolumnę'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Operacja filtrowania nie powiodła się, spróbuj ponownie'
    },

    AIFilterField : {
        progressText : 'Filtrowanie'
    },

    PinColumns : {
        pinColumn  : 'Przypnij kolumnę',
        unpin      : 'Bez przypięcia',
        pinToStart : 'Przypnij na początku',
        pinToEnd   : 'Przypnij na końcu'
    }
};

export default LocaleHelper.publishLocale(locale);
