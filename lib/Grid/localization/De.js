import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/De.js';

const emptyString = new String();

const locale = {

    localeName : 'De',
    localeDesc : 'Deutsch',
    localeCode : 'de-DE',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Suchen',
        selectAll   : 'Alle auswählen',
        removeAll   : 'Alle entfernen',
        filtersSet  : n => n === 1 ? `1 Filter gesetzt` : `${n} Filter gesetzt`,
        noItems     : 'Keine Ergebnisse gefunden',
        placeholder : 'Filtern...',
        apply       : 'Anwenden'
    },

    ColumnPicker : {
        column          : 'Spalte',
        columnsMenu     : 'Spalten',
        hideColumn      : 'Spalten verbergen',
        hideColumnShort : 'Verbergen',
        newColumns      : 'Neue Spalten',
        allColumns      : 'Alle Spalten',
        showName        : column => `Spalte${column.text ? ` ${column.text}` : ''} anzeigen`,
        hideName        : column => `Spalte${column.text ? ` ${column.text}` : ''} ausblenden`
    },

    Filter : {
        applyFilter   : 'Filter anwenden',
        filter        : 'filtern',
        editFilter    : 'Filter bearbeiten',
        on            : 'An',
        before        : 'Davor',
        after         : 'Danach',
        equals        : 'Ist gleich',
        lessThan      : 'Weniger als',
        moreThan      : 'Mehr als',
        removeFilter  : 'Filter löschen',
        disableFilter : 'Filter deaktivieren'
    },

    FilterBar : {
        enableFilterBar  : 'Filterleiste anzeigen',
        disableFilterBar : 'Filterleiste verbergen'
    },

    Group : {
        group                : 'Gruppieren',
        groupAscending       : 'Gruppierung aufsteigend',
        groupDescending      : 'Gruppierung absteigend',
        groupAscendingShort  : 'Absteigend',
        groupDescendingShort : 'Aufsteigend',
        stopGrouping         : 'Gruppierung stoppen',
        stopGroupingShort    : 'Stop'
    },

    HeaderMenu : {
        moveBefore     : text => `Verschieben vor "${text}"`,
        moveAfter      : text => `Verschieben nach "${text}"`,
        collapseColumn : 'Spalte einklappen',
        expandColumn   : 'Spalte ausklappen'
    },

    ColumnRename : {
        rename : 'Umbenennen'
    },

    ColumnResize : {
        resizeColumn : 'Spaltenbreite ändern',
        width        : 'Breite',
        fitToData    : 'An Daten anpassen'
    },

    MergeCells : {
        mergeCells  : 'Zellen zusammenführen',
        menuTooltip : 'Zellen mit gleichem Wert bei Sortierung nach dieser Spalte zusammenführen'
    },

    Search : {
        searchForValue : 'Nach Wert suchen'
    },

    Sort : {
        sort                   : 'Sortieren',
        sortAscending          : 'Aufsteigend sortieren',
        sortDescending         : 'Absteigend sortieren',
        multiSort              : 'Multi sortieren',
        removeSorter           : 'Sortierer entfernen',
        addSortAscending       : 'Aufsteigenden Sortierer hinzufügen',
        addSortDescending      : 'Absteigenden Sortierer hinzufügen',
        toggleSortAscending    : 'Zu Aufsteigend wechseln',
        toggleSortDescending   : 'Zu Absteigend wechseln',
        sortAscendingShort     : 'Aufsteigend',
        sortDescendingShort    : 'Absteigend',
        removeSorterShort      : 'Entfernen',
        addSortAscendingShort  : '+ Aufsteigend',
        addSortDescendingShort : '+ Absteigend'
    },

    Split : {
        split        : 'Teilen',
        unsplit      : 'Nicht teilen',
        horizontally : 'Horizontal',
        vertically   : 'Vertikal',
        both         : 'Beides',
        top          : 'oben',
        bottom       : 'unten',
        left         : 'links',
        right        : 'rechts'
    },

    LockRows : {
        lockRow   : 'Zeile sperren',
        unlockRow : 'Zeile entsperren'
    },

    ActionColumn : {
        rowActions : 'Zeilenaktionen'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} spalte. ` : ''}LEERTASTE für Kontextmenü${column.canSort ? ', ENTER um zu sortieren' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Zeilen-Widgets'
    },

    Checkbox : {
        toggleRowSelect : 'Zeilenauswahl umschalten',
        toggleSelection : 'Auswahl des gesamten Datensatzes umschalten',
        toggleName      : column => `${column.text || 'Wert'} umschalten`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `Bewertung : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Zeilennummer'
    },

    GridBase : {
        loadFailedMessage  : 'Das Laden der Daten ist fehlgeschlagen!',
        syncFailedMessage  : 'Das synchronisieren der Daten ist fehlgeschlagen!',
        unspecifiedFailure : 'Nicht spezifizierter Fehler',
        networkFailure     : 'Netzwerkfehler',
        parseFailure       : 'Antwort des Servers konnte nicht analysiert werden',
        serverResponse     : 'Server Antwort:',
        noRows             : ' Keine Datensätze zum Anzeigen',
        moveColumnLeft     : 'In den linken Bereich verschieben',
        moveColumnRight    : 'In den rechten Bereich verschieben',
        moveColumnTo       : region => `Spalte verschieben zu ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 Zeile entspricht dem Filter` : `${n} Zeilen entsprechen dem Filter`) : 'Keine Zeilen entsprechen dem Filter'
    },

    CellMenu : {
        removeRow : 'Löschen'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopieren',
        cutRecord   : 'Ausschneiden',
        pasteRecord : 'Einfügen',
        rows        : 'Zeilen',
        row         : 'Zeile'
    },

    CellCopyPaste : {
        copy  : 'Kopieren',
        cut   : 'Ausschneiden',
        paste : 'Einfügen'
    },

    Charts : {
        chartDesigner : 'Diagramm-Designer',
        newChart      : 'Neues Diagramm',
        download      : 'Herunterladen',
        settings      : 'Einstellungen'
    },

    PdfExport : {
        'Waiting for response from server' : 'Warte auf Antwort vom Server...',
        'Export failed'                    : 'Export fehlgeschlagen',
        'Server error'                     : 'Serverfehler',
        'Generating pages'                 : 'Seiten werden generiert',
        'Click to abort'                   : 'Abbrechen'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Einstellungen exportieren',
        export         : 'Exportieren',
        printSettings  : 'Druckeinstellungen',
        print          : 'Drucken',
        exporterType   : 'Kontrolle des Umbruchs',
        cancel         : 'Abbrechen',
        fileFormat     : 'Dateiformat',
        rows           : 'Reihen',
        alignRows      : 'Zeilen ausrichten',
        columns        : 'Spalten',
        paperFormat    : 'Papierformat',
        orientation    : 'Orientierung',
        repeatHeader   : 'Kopfzeile wiederholen'
    },

    ExportRowsCombo : {
        all     : 'Alle Zeilen',
        visible : 'Sichtbare Zeilen'
    },

    ExportOrientationCombo : {
        portrait  : 'Hochformat',
        landscape : 'Querformat'
    },

    SinglePageExporter : {
        singlepage : 'Einzelne Seite'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Einzelne Seite (unskaliert)'
    },

    MultiPageExporter : {
        multipage     : 'Mehrere Seiten',
        exportingPage : ({ currentPage, totalPages }) => `Seite ${currentPage}/${totalPages} wird exportiert`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Mehrere Seiten (vertikal)',
        exportingPage     : ({ currentPage, totalPages }) => `Seite ${currentPage}/${totalPages} wird exportiert`
    },

    RowExpander : {
        loading            : 'Wird geladen',
        expand             : 'Aufklappen',
        collapse           : 'Zusammenklappen',
        columnDescription  : 'Zeileninformationen umschalten',
        expandedRowContent : 'Erweiterter Zeileninhalt'
    },

    TreeGroup : {
        group                  : 'Gruppieren nach',
        stopGrouping           : 'Gruppierung beenden',
        stopGroupingThisColumn : 'Gruppierung dieser Spalte aufheben'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Filtervorgang nicht erfolgreich, bitte versuchen Sie es erneut'
    },

    AIFilterField : {
        progressText : 'Filtern'
    },

    PinColumns : {
        pinColumn  : 'Spalte anheften',
        unpin      : 'Nicht anheften',
        pinToStart : 'Am Anfang anheften',
        pinToEnd   : 'Am Ende anheften'
    }
};

export default LocaleHelper.publishLocale(locale);
