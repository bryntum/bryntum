import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/En.js';

const emptyString = new String();

const locale = {

    localeName : 'En',
    localeDesc : 'English (US)',
    localeCode : 'en-US',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Search',
        selectAll   : 'Select All',
        removeAll   : 'Remove All',
        filtersSet  : n => n === 1 ? `1 filter set` : `${n} filters set`,
        noItems     : 'No results found',
        placeholder : 'Filter...',
        apply       : 'Apply'
    },

    ColumnPicker : {
        column          : 'Column',
        columnsMenu     : 'Columns',
        hideColumn      : 'Hide column',
        hideColumnShort : 'Hide',
        newColumns      : 'New columns',
        allColumns      : 'All columns',
        showName        : column => `Show column${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Hide column${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Apply filter',
        filter        : 'Filter',
        editFilter    : 'Edit filter',
        on            : 'On',
        before        : 'Before',
        after         : 'After',
        equals        : 'Equals',
        lessThan      : 'Less than',
        moreThan      : 'More than',
        removeFilter  : 'Remove filter',
        disableFilter : 'Disable filter'
    },

    FilterBar : {
        enableFilterBar  : 'Show filter bar',
        disableFilterBar : 'Hide filter bar'
    },

    Group : {
        group                : 'Group',
        groupAscending       : 'Group ascending',
        groupDescending      : 'Group descending',
        groupAscendingShort  : 'Ascending',
        groupDescendingShort : 'Descending',
        stopGrouping         : 'Stop grouping',
        stopGroupingShort    : 'Stop'
    },

    HeaderMenu : {
        moveBefore     : text => `Move before "${text}"`,
        moveAfter      : text => `Move after "${text}"`,
        collapseColumn : 'Collapse column',
        expandColumn   : 'Expand column'
    },

    ColumnRename : {
        rename : 'Rename'
    },

    ColumnResize : {
        resizeColumn : 'Resize column',
        width        : 'Width',
        fitToData    : 'Fit to data'
    },

    MergeCells : {
        mergeCells  : 'Merge cells',
        menuTooltip : 'Merge cells with same value when sorted by this column'
    },

    Search : {
        searchForValue : 'Search for value'
    },

    Sort : {
        sort                   : 'Sort',
        sortAscending          : 'Sort ascending',
        sortDescending         : 'Sort descending',
        multiSort              : 'Multi sort',
        removeSorter           : 'Remove sorter',
        addSortAscending       : 'Add ascending sorter',
        addSortDescending      : 'Add descending sorter',
        toggleSortAscending    : 'Change to ascending',
        toggleSortDescending   : 'Change to descending',
        sortAscendingShort     : 'Ascending',
        sortDescendingShort    : 'Descending',
        removeSorterShort      : 'Remove',
        addSortAscendingShort  : '+ Ascending',
        addSortDescendingShort : '+ Descending'
    },

    Split : {
        split        : 'Split',
        unsplit      : 'Unsplit',
        horizontally : 'Horizontally',
        vertically   : 'Vertically',
        both         : 'Both',
        top          : 'top',
        bottom       : 'bottom',
        left         : 'left',
        right        : 'right'
    },

    LockRows : {
        lockRow   : 'Lock row',
        unlockRow : 'Unlock row'
    },

    ActionColumn : {
        rowActions : 'Row actions'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} column. ` : ''}SPACE for context menu${column.canSort ? ', ENTER to sort' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Row widgets'
    },

    Checkbox : {
        toggleRowSelect : 'Toggle row selection',
        toggleSelection : 'Toggle selection of entire dataset',
        toggleName      : column => `Toggle ${column.text || 'value'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `rating : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Row number'
    },

    GridBase : {
        loadFailedMessage  : 'Data loading failed!',
        syncFailedMessage  : 'Data synchronization failed!',
        unspecifiedFailure : 'Unspecified failure',
        networkFailure     : 'Network error',
        parseFailure       : 'Failed to parse server response',
        serverResponse     : 'Server response:',
        noRows             : 'No records to display',
        moveColumnLeft     : 'Move to left section',
        moveColumnRight    : 'Move to right section',
        moveColumnTo       : region => `Move column to ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 row matches filter` : `${n} rows match filter`) : 'No rows match filter'
    },

    CellMenu : {
        removeRow : 'Delete'
    },

    RowCopyPaste : {
        copyRecord  : 'Copy',
        cutRecord   : 'Cut',
        pasteRecord : 'Paste',
        rows        : 'rows',
        row         : 'row'
    },

    CellCopyPaste : {
        copy  : 'Copy',
        cut   : 'Cut',
        paste : 'Paste'
    },

    Charts : {
        chartDesigner : 'Chart Designer',
        newChart      : 'New Chart',
        download      : 'Download',
        settings      : 'Settings'
    },

    PdfExport : {
        'Waiting for response from server' : 'Waiting for response from server...',
        'Export failed'                    : 'Export failed',
        'Server error'                     : 'Server error',
        'Generating pages'                 : 'Generating pages...',
        'Click to abort'                   : 'Cancel'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Export settings',
        export         : 'Export',
        printSettings  : 'Print settings',
        print          : 'Print',
        exporterType   : 'Control pagination',
        cancel         : 'Cancel',
        fileFormat     : 'File format',
        rows           : 'Rows',
        alignRows      : 'Align rows',
        columns        : 'Columns',
        paperFormat    : 'Paper format',
        orientation    : 'Orientation',
        repeatHeader   : 'Repeat header'
    },

    ExportRowsCombo : {
        all     : 'All rows',
        visible : 'Visible rows'
    },

    ExportOrientationCombo : {
        portrait  : 'Portrait',
        landscape : 'Landscape'
    },

    SinglePageExporter : {
        singlepage : 'Single page'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Single page (unscaled)'
    },

    MultiPageExporter : {
        multipage     : 'Multiple pages',
        exportingPage : ({ currentPage, totalPages }) => `Exporting page ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Multiple pages (vertical)',
        exportingPage     : ({ currentPage, totalPages }) => `Exporting page ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Loading',
        expand             : 'Expand row details',
        collapse           : 'Collapse row details',
        columnDescription  : 'Toggle row details',
        expandedRowContent : 'Expanded row content'
    },

    TreeGroup : {
        group                  : 'Group by',
        stopGrouping           : 'Stop grouping',
        stopGroupingThisColumn : 'Ungroup column'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Filter operation unsuccessful, please try again'
    },

    AIFilterField : {
        progressText : 'Filtering'
    },

    PinColumns : {
        pinColumn  : 'Pin column',
        unpin      : 'No pin',
        pinToStart : 'Pin to start',
        pinToEnd   : 'Pin to end'
    }
};

export default LocaleHelper.publishLocale(locale);
