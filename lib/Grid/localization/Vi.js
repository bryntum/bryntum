import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Vi.js';

const emptyString = new String();

const locale = {

    localeName : 'Vi',
    localeDesc : 'Tiếng Việt',
    localeCode : 'vi',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Tìm kiếm',
        selectAll   : 'Chọn tất cả',
        removeAll   : 'Bỏ chọn tất cả',
        filtersSet  : n => n === 1 ? `Đã thiết lập 1 bộ lọc` : `Đã thiết lập ${n} bộ lọc`,
        noItems     : 'Không tìm thấy kết quả',
        placeholder : 'Bộ lọc...',
        apply       : 'Áp dụng'
    },

    ColumnPicker : {
        column          : 'Cột',
        columnsMenu     : 'Cột',
        hideColumn      : 'Ẩn Cột',
        hideColumnShort : 'Ẩn',
        newColumns      : 'Cột mới',
        allColumns      : 'Tất cả các cột',
        showName        : column => `Hiển thị cột${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Ẩn cột${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Áp dụng bộ lọc',
        filter        : 'Bộ lọc',
        editFilter    : 'Chỉnh sửa bộ lọc',
        on            : 'Bật',
        before        : 'Trước',
        after         : 'Sau',
        equals        : 'Bằng',
        lessThan      : 'Ít hơn',
        moreThan      : 'Nhiều hơn',
        removeFilter  : 'Xóa bỏ bộ lọc',
        disableFilter : 'Bỏ bộ lọc'
    },

    FilterBar : {
        enableFilterBar  : 'Hiển thị thanh bộ lọc',
        disableFilterBar : 'Ẩn thanh bộ lọc'
    },

    Group : {
        group                : 'Nhóm',
        groupAscending       : 'Nhóm tăng dần',
        groupDescending      : 'Nhóm giảm dần',
        groupAscendingShort  : 'Tăng dần',
        groupDescendingShort : 'Giảm dần',
        stopGrouping         : 'Dừng nhóm',
        stopGroupingShort    : 'Dừng'
    },

    HeaderMenu : {
        moveBefore     : text => `Di chuyển trước "${text}"`,
        moveAfter      : text => `Di chuyển sau "${text}"`,
        collapseColumn : 'Thu gọn cột',
        expandColumn   : 'Mở rộng cột'
    },

    ColumnRename : {
        rename : 'Đổi tên'
    },

    ColumnResize : {
        resizeColumn : 'Thay đổi kích thước cột',
        width        : 'Chiều rộng',
        fitToData    : 'Vừa với dữ liệu'
    },

    MergeCells : {
        mergeCells  : 'Hợp nhất các ô',
        menuTooltip : 'Hợp nhất các ô có cùng giá trị khi được sắp xếp theo Column này'
    },

    Search : {
        searchForValue : 'Tìm kiếm giá trị'
    },

    Sort : {
        sort                   : 'Sắp xếp',
        sortAscending          : 'Sắp xếp tăng dần',
        sortDescending         : 'Sắp xếp giảm dần',
        multiSort              : 'Sắp xếp nhiều kiểu',
        removeSorter           : 'Xóa bộ sắp xếp',
        addSortAscending       : 'Thêm bộ sắp xếp tăng dần',
        addSortDescending      : 'Thêm bộ sắp xếp giảm dần',
        toggleSortAscending    : 'Thay đổi thành tăng dần',
        toggleSortDescending   : 'Thay đổi thành giảm dần',
        sortAscendingShort     : 'Tăng dần',
        sortDescendingShort    : 'Giảm dần',
        removeSorterShort      : 'Xóa',
        addSortAscendingShort  : '+ Tăng dần',
        addSortDescendingShort : '+ Giảm dần'
    },

    Split : {
        split        : 'Chia',
        unsplit      : 'Gộp',
        horizontally : 'Ngang',
        vertically   : 'Dọc',
        both         : 'Cả hai',
        top          : 'trên',
        bottom       : 'dưới',
        left         : 'trái',
        right        : 'phải'
    },

    LockRows : {
        lockRow   : 'Khóa dòng',
        unlockRow : 'Mở khóa dòng'
    },

    ActionColumn : {
        rowActions : 'Hành động hàng'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} column. ` : ''}nhấn phím SPACE cho menu ngữ cảnh menu${column.canSort ? ', nhấn phím ENTER để sắp xếp' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Các tiện ích hàng'
    },

    Checkbox : {
        toggleRowSelect : 'Chuyển đổi lựa chọn hàng',
        toggleSelection : 'Chuyển đổi lựa chọn của toàn bộ tập dữ liệu',
        toggleName      : column => `Chuyển đổi ${column.text || 'giá trị'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `xếp hạng : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Số hàng'
    },

    GridBase : {
        loadFailedMessage  : 'Tải dữ liệu không thành công!',
        syncFailedMessage  : 'Đồng bộ hóa dữ liệu không thành công!',
        unspecifiedFailure : 'Lỗi không xác định',
        networkFailure     : 'Lỗi mạng',
        parseFailure       : 'Không thể phân tích cú pháp phản hồi của máy chủ',
        serverResponse     : 'Phản hồi của máy chủ:',
        noRows             : 'Không có hồ sơ nào để hiển thị',
        moveColumnLeft     : 'Di chuyển sang phần bên trái',
        moveColumnRight    : 'Di chuyển sang phần bên phải',
        moveColumnTo       : region => `Di chuyển cột đến ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 hàng khớp với bộ lọc` : `${n} hàng khớp với bộ lọc`) : 'Không có hàng nào khớp với bộ lọc'
    },

    CellMenu : {
        removeRow : 'Xóa hàng'
    },

    RowCopyPaste : {
        copyRecord  : 'Sao chép',
        cutRecord   : 'Cắt',
        pasteRecord : 'Dán',
        rows        : 'hàng',
        row         : 'hàng'
    },

    CellCopyPaste : {
        copy  : 'Sao chép',
        cut   : 'Cắt',
        paste : 'Dán'
    },

    Charts : {
        chartDesigner : 'Nhà Thiết kế Biểu đồ',
        newChart      : 'Biểu đồ mới',
        download      : 'Tải xuống',
        settings      : 'Cài đặt'
    },

    PdfExport : {
        'Waiting for response from server' : 'Đang chờ phản hồi từ máy chủ ...',
        'Export failed'                    : 'Xuất không thành công',
        'Server error'                     : 'Lỗi máy chủ',
        'Generating pages'                 : 'Đang tạo trang ...',
        'Click to abort'                   : 'Hủy bỏ'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Cài đặt xuất',
        export         : 'Xuất',
        printSettings  : 'Cài đặt in',
        print          : 'In',
        exporterType   : 'Kiểm soát phân trang',
        cancel         : 'Hủy bỏ',
        fileFormat     : 'Định dạng tệp',
        rows           : 'Dòng',
        alignRows      : 'Căn chỉnh các dòng',
        columns        : 'Các cột',
        paperFormat    : 'Định dạng trang',
        orientation    : 'Hướng',
        repeatHeader   : 'Lặp lại tiêu đề'
    },

    ExportRowsCombo : {
        all     : 'Tất cả các hàng',
        visible : 'Dòng có thể nhìn thấy'
    },

    ExportOrientationCombo : {
        portrait  : 'Dọc',
        landscape : 'Ngang'
    },

    SinglePageExporter : {
        singlepage : 'Trang đơn'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Một trang (không tỷ lệ)'
    },

    MultiPageExporter : {
        multipage     : 'Nhiều trang',
        exportingPage : ({ currentPage, totalPages }) => `Xuất trang ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Nhiều trang (theo chiều dọc)',
        exportingPage     : ({ currentPage, totalPages }) => `Xuất trang ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Đang tải',
        expand             : 'Mở rộng',
        collapse           : 'Thu gọn',
        columnDescription  : 'Chuyển đổi chi tiết hàng',
        expandedRowContent : 'Nội dung hàng đã mở rộng'
    },

    TreeGroup : {
        group                  : 'Nhóm theo',
        stopGrouping           : 'Dừng nhóm',
        stopGroupingThisColumn : 'Hủy nhóm cột này'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Hoạt động lọc không thành công, vui lòng thử lại'
    },

    AIFilterField : {
        progressText : 'Đang lọc'
    },

    PinColumns : {
        pinColumn  : 'Ghim cột',
        unpin      : 'Không ghim',
        pinToStart : 'Ghim vào đầu',
        pinToEnd   : 'Ghim vào cuối'
    }
};

export default LocaleHelper.publishLocale(locale);
