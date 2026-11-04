import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/It.js';

const emptyString = new String();

const locale = {

    localeName : 'It',
    localeDesc : 'Italiano',
    localeCode : 'it',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Cerca',
        selectAll   : 'Seleziona tutto',
        removeAll   : 'Rimuovi tutto',
        filtersSet  : n => n === 1 ? `1 filtro impostato` : `${n} filtri impostati`,
        noItems     : 'Nessun risultato trovato',
        placeholder : 'Filtra...',
        apply       : 'Applica'
    },

    ColumnPicker : {
        column          : 'Colonna',
        columnsMenu     : 'Colonne',
        hideColumn      : 'Nascondi colonna',
        hideColumnShort : 'Nascondi',
        newColumns      : 'Nuove colonne',
        allColumns      : 'Tutte le colonne',
        showName        : column => `Mostra colonna${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Nascondi colonna${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Applica filtro',
        filter        : 'Filtra',
        editFilter    : 'Modifica filtro',
        on            : 'Il',
        before        : 'Prima',
        after         : 'Dopo',
        equals        : 'Uguale',
        lessThan      : 'Meno di',
        moreThan      : 'Più di',
        removeFilter  : 'Rimuovi filtro',
        disableFilter : 'Disabilita filtro'
    },

    FilterBar : {
        enableFilterBar  : 'Mostra barra del filtro',
        disableFilterBar : 'Nascondi barra del filtro'
    },

    Group : {
        group                : 'Raggruppa',
        groupAscending       : 'Gruppo ascendente',
        groupDescending      : 'Gruppo discendente',
        groupAscendingShort  : 'Ascendente',
        groupDescendingShort : 'Discendente',
        stopGrouping         : 'Interrompi raggruppamento',
        stopGroupingShort    : 'Stop'
    },

    HeaderMenu : {
        moveBefore     : text => `Sposta prima "${text}"`,
        moveAfter      : text => `Sposta dopo "${text}"`,
        collapseColumn : 'Riduci colonna',
        expandColumn   : 'Espandi colonna'
    },

    ColumnRename : {
        rename : 'Rinomina'
    },

    ColumnResize : {
        resizeColumn : 'Ridimensiona colonna',
        width        : 'Larghezza',
        fitToData    : 'Adatta ai dati'
    },

    MergeCells : {
        mergeCells  : 'Unisci celle',
        menuTooltip : 'Unisci celle con lo stesso valore se ordinate da questa colonna'
    },

    Search : {
        searchForValue : 'Cerca valore'
    },

    Sort : {
        sort                   : 'Ordina',
        sortAscending          : 'Ordine ascendente',
        sortDescending         : 'Ordine discendente',
        multiSort              : 'Ordinamento multiplo',
        removeSorter           : 'Rimuovi ordinatore',
        addSortAscending       : 'Aggiungi ordinatore ascendente',
        addSortDescending      : 'Aggiungi ordinatore discendente',
        toggleSortAscending    : 'Passa ad ascendente',
        toggleSortDescending   : 'Passa a discendente',
        sortAscendingShort     : 'Ascendente',
        sortDescendingShort    : 'Discendente',
        removeSorterShort      : 'Rimuovi',
        addSortAscendingShort  : '+ Ascendente',
        addSortDescendingShort : '+ Discendente'
    },

    Split : {
        split        : 'Dividi',
        unsplit      : 'Unisci',
        horizontally : 'Orizzontalmente',
        vertically   : 'Verticalmente',
        both         : 'Entrambi',
        top          : 'alto',
        bottom       : 'basso',
        left         : 'sinistra',
        right        : 'destra'
    },

    LockRows : {
        lockRow   : 'Blocca riga',
        unlockRow : 'Sblocca riga'
    },

    ActionColumn : {
        rowActions : 'Azioni sulla riga'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} colonna. ` : ''}SPAZIO per il menu contestuale${column.canSort ? ', INVIO per ordinare' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Widget di riga'
    },

    Checkbox : {
        toggleRowSelect : 'Passa a selezione righe',
        toggleSelection : 'Passa a selezione di un intero set di dati',
        toggleName      : column => `Attiva/disattiva ${column.text || 'valore'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `valutazione : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Numero di riga'
    },

    GridBase : {
        loadFailedMessage  : 'Caricamento dati non riuscito!',
        syncFailedMessage  : 'Sincronizzazione dati non riuscita!',
        unspecifiedFailure : 'Errore non specificato',
        networkFailure     : 'Errore di rete',
        parseFailure       : 'Impossibile interpretare la risposta del server',
        serverResponse     : 'Risposta del server:',
        noRows             : 'Nessun record da visualizzare',
        moveColumnLeft     : 'Sposta alla sezione sinistra',
        moveColumnRight    : 'Sposta alla sezione destra',
        moveColumnTo       : region => `Sposta colonna a ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 riga corrisponde al filtro` : `${n} righe corrispondono al filtro`) : 'Nessuna riga corrisponde al filtro'
    },

    CellMenu : {
        removeRow : 'Elimina'
    },

    RowCopyPaste : {
        copyRecord  : 'Copia',
        cutRecord   : 'Taglia',
        pasteRecord : 'Incolla',
        rows        : 'righe',
        row         : 'riga'
    },

    CellCopyPaste : {
        copy  : 'Copia',
        cut   : 'Taglia',
        paste : 'Incolla'
    },

    Charts : {
        chartDesigner : 'Progettista di grafici',
        newChart      : 'Nuovo Grafico',
        download      : 'Scarica',
        settings      : 'Impostazioni'
    },

    PdfExport : {
        'Waiting for response from server' : 'In attesa della risposta dal server...',
        'Export failed'                    : 'Esportazione non riuscita',
        'Server error'                     : 'Errore del server',
        'Generating pages'                 : 'Generazione pagine...',
        'Click to abort'                   : 'Annulla'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Esporta impostazioni',
        export         : 'Esporta',
        printSettings  : 'Impostazioni di stampa',
        print          : 'Stampa',
        exporterType   : 'Controllo dell’impaginazione',
        cancel         : 'Annulla',
        fileFormat     : 'Formato del file',
        rows           : 'Righe',
        alignRows      : 'Allinea righe',
        columns        : 'Colonne',
        paperFormat    : 'Formato carta',
        orientation    : 'Orientamento',
        repeatHeader   : 'Ripeti intestazione'
    },

    ExportRowsCombo : {
        all     : 'Tutte le righe',
        visible : 'Righe visibili'
    },

    ExportOrientationCombo : {
        portrait  : 'Ritratto',
        landscape : 'Paesaggio'
    },

    SinglePageExporter : {
        singlepage : 'Singola pagina'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Pagina singola (non scalata)'
    },

    MultiPageExporter : {
        multipage     : 'Più pagine',
        exportingPage : ({ currentPage, totalPages }) => `Esportazione pagina ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Più pagine (verticale)',
        exportingPage     : ({ currentPage, totalPages }) => `Esportazione pagina ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Caricamento',
        expand             : 'Espandi',
        collapse           : 'Comprimi',
        columnDescription  : 'Attiva/disattiva dettagli riga',
        expandedRowContent : 'Contenuto della riga espansa'
    },

    TreeGroup : {
        group                  : 'Raggruppa per',
        stopGrouping           : 'Interrompi raggruppamento',
        stopGroupingThisColumn : 'Elimina raggruppamento di questa colonna'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Operazione di filtro non riuscita, riprova'
    },

    AIFilterField : {
        progressText : 'Filtraggio'
    },

    PinColumns : {
        pinColumn  : 'Blocca colonna',
        unpin      : 'Nessun blocco',
        pinToStart : "Blocca all'inizio",
        pinToEnd   : 'Blocca alla fine'
    }
};

export default LocaleHelper.publishLocale(locale);
