import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/ZhTw.js';

const emptyString = new String();

const locale = {

    localeName : 'ZhTw',
    localeDesc : '繁體中文 (台灣)',
    localeCode : 'zh-TW',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : '搜尋',
        selectAll   : '全選',
        removeAll   : '取消全選',
        filtersSet  : n => n === 1 ? `設定了 1 個篩選條件` : `設定了 ${n} 個篩選條件`,
        noItems     : '未找到結果',
        placeholder : '篩選...',
        apply       : '應用'
    },

    ColumnPicker : {
        column          : '欄',
        columnsMenu     : '欄',
        hideColumn      : '隱藏欄',
        hideColumnShort : '隱藏',
        newColumns      : '新欄',
        allColumns      : '所有欄',
        showName        : column => `顯示欄${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `顯示欄${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : '套用篩選條件',
        filter        : '篩選條件',
        editFilter    : '編輯篩選條件',
        on            : '於',
        before        : '之前',
        after         : '之後',
        equals        : '等於',
        lessThan      : '小於',
        moreThan      : '大於',
        removeFilter  : '移除篩選條件',
        disableFilter : '停用篩選條件'
    },

    FilterBar : {
        enableFilterBar  : '顯示篩選列',
        disableFilterBar : '隱藏篩選列'
    },

    Group : {
        group                : '群組',
        groupAscending       : '群組遞增',
        groupDescending      : '群組遞減',
        groupAscendingShort  : '遞增',
        groupDescendingShort : '遞減',
        stopGrouping         : '停止分組',
        stopGroupingShort    : '停止'
    },

    HeaderMenu : {
        moveBefore     : text => `移至 "${text}" 之前`,
        moveAfter      : text => `移至 "${text}" 之後`,
        collapseColumn : '摺疊欄',
        expandColumn   : '展開欄'
    },

    ColumnRename : {
        rename : '重新命名'
    },

    ColumnResize : {
        resizeColumn : '調整欄寬',
        width        : '寬度',
        fitToData    : '符合資料'
    },

    MergeCells : {
        mergeCells  : '合併儲存格',
        menuTooltip : '依此欄排序時，合併具有相同值的儲存格'
    },

    Search : {
        searchForValue : '搜尋值'
    },

    Sort : {
        sort                   : '排序',
        sortAscending          : '遞增排序',
        sortDescending         : '遞減排序',
        multiSort              : '多重排序',
        removeSorter           : '移除排序',
        addSortAscending       : '新增遞增排序',
        addSortDescending      : '新增遞減排序',
        toggleSortAscending    : '變更為遞增',
        toggleSortDescending   : '變更為遞減',
        sortAscendingShort     : '遞增',
        sortDescendingShort    : '遞減',
        removeSorterShort      : '移除',
        addSortAscendingShort  : '+ 遞增',
        addSortDescendingShort : '+ 遞減'
    },

    Split : {
        split        : '分割',
        unsplit      : '取消分割',
        horizontally : '水平',
        vertically   : '垂直',
        both         : '兩者',
        top          : '上',
        bottom       : '下',
        left         : '左',
        right        : '右'
    },

    LockRows : {
        lockRow   : '锁排',
        unlockRow : '解锁排'
    },

    ActionColumn : {
        rowActions : '列操作'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} 欄。` : ''}按空格鍵存取內容功能表${column.canSort ? '，按 ENTER 鍵進行排序' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : '列小工具'
    },

    Checkbox : {
        toggleRowSelect : '切換列選取範圍',
        toggleSelection : '切換整個資料集選取範圍',
        toggleName      : column => `切換 ${column.text || '值'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `評等: ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : '行號'
    },

    GridBase : {
        loadFailedMessage  : '資料載入失敗!',
        syncFailedMessage  : '資料同步失敗!',
        unspecifiedFailure : '不明故障',
        networkFailure     : '網路錯誤',
        parseFailure       : '無法剖析伺服器回覆',
        serverResponse     : '伺服器回覆:',
        noRows             : '沒有可顯示的記錄',
        moveColumnLeft     : '移至左側區段',
        moveColumnRight    : '移至右側區段',
        moveColumnTo       : region => `移動欄至 ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 行符合篩選條件` : `${n} 行符合篩選條件`) : '沒有行符合篩選條件'
    },

    CellMenu : {
        removeRow : '刪除'
    },

    RowCopyPaste : {
        copyRecord  : '複製',
        cutRecord   : '剪下',
        pasteRecord : '貼上',
        rows        : '列',
        row         : '列'
    },

    CellCopyPaste : {
        copy  : '複製',
        cut   : '剪下',
        paste : '貼上'
    },

    Charts : {
        chartDesigner : '圖表設計器',
        newChart      : '新圖表',
        download      : '下載',
        settings      : '設定'
    },

    PdfExport : {
        'Waiting for response from server' : '等待伺服器回應...',
        'Export failed'                    : '輸出失敗',
        'Server error'                     : '伺服器錯誤',
        'Generating pages'                 : '正在產生頁...',
        'Click to abort'                   : '取消'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : '輸出設定',
        export         : '輸出',
        printSettings  : '打印设置',
        print          : '打印',
        exporterType   : '控制編頁',
        cancel         : '取消',
        fileFormat     : '檔案格式',
        rows           : '列',
        alignRows      : '對齊列',
        columns        : '欄',
        paperFormat    : '紙張格式',
        orientation    : '定向',
        repeatHeader   : '重複 標頭'
    },

    ExportRowsCombo : {
        all     : '所有列',
        visible : '可見列'
    },

    ExportOrientationCombo : {
        portrait  : '直向',
        landscape : '橫向'
    },

    SinglePageExporter : {
        singlepage : '單頁'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : '單頁（未縮放）'
    },

    MultiPageExporter : {
        multipage     : '多頁',
        exportingPage : ({ currentPage, totalPages }) => `輸出頁 ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : '多頁 (直向)',
        exportingPage     : ({ currentPage, totalPages }) => `輸出頁 ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : '正在載入',
        expand             : '展開',
        collapse           : '摺疊',
        columnDescription  : '切換列詳細資訊',
        expandedRowContent : '展開的行內容'
    },

    TreeGroup : {
        group                  : '分組依據',
        stopGrouping           : '停止分組',
        stopGroupingThisColumn : '欄取消分組'
    },

    AIFilter : {
        unsuccessfulFilterMessage : '篩選操作未成功，請再試一次'
    },

    AIFilterField : {
        progressText : '過濾中'
    },

    PinColumns : {
        pinColumn  : '固定欄位',
        unpin      : '取消固定',
        pinToStart : '固定到起始',
        pinToEnd   : '固定到結尾'
    }
};

export default LocaleHelper.publishLocale(locale);
