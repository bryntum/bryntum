import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Vi.js';

const locale = {

    localeName : 'Vi',
    localeDesc : 'Tiếng Việt',
    localeCode : 'vi',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Tải dữ liệu không thành công!',
        syncFailedMessage : 'Đồng bộ hóa dữ liệu không thành công!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Phản hồi của máy chủ:'
    },

    TaskBoard : {
        column                 : 'cột',
        columns                : 'cột',
        Columns                : 'Cột',
        swimlane               : 'làn nhiệm vụ',
        swimlanes              : 'làn nhiệm vụ',
        Swimlanes              : 'Làn nhiệm vụ',
        task                   : 'nhiệm vụ',
        tasks                  : 'nhiệm vụ',
        addTask                : 'Thêm nhiệm vụ L{TaskBoard.task}',
        cancel                 : 'Hủy bỏ',
        changeColumn           : 'Thay đổi L{TaskBoard.column}',
        changeSwimlane         : 'Thay đổi L{TaskBoard.swimlane}',
        collapse               : text => `Thu gọn ${text}`,
        color                  : 'Màu',
        description            : 'Mô tả',
        editTask               : 'Chỉnh sửa L{TaskBoard.task}',
        expand                 : text => `Mở rộng ${text}`,
        filterColumns          : 'Lọc L{TaskBoard.columns}',
        filterSwimlanes        : 'Lọc L{TaskBoard.swimlanes}',
        filterTasks            : 'Lọc L{TaskBoard.tasks}',
        lock                   : 'Khóa',
        unlock                 : 'Mở khóa',
        moveColumnLeft         : 'Di chuyển sang trái L{TaskBoard.column}',
        moveColumnRight        : 'Di chuyển sang phải L{TaskBoard.column}',
        moveColumnUp           : 'Di chuyển lên L{TaskBoard.column}',
        moveColumnDown         : 'Di chuyển xuống L{TaskBoard.column}',
        moveColumnOutOfGroup   : 'Di chuyển L{TaskBoard.column} ra khỏi nhóm',
        moveColumnIntoGroup    : 'Di chuyển L{TaskBoard.column} vào nhóm',
        groupWithLeftNeighbor  : 'Nhóm với L{TaskBoard.column} liền kề bên trái',
        groupWithRightNeighbor : 'Nhóm với L{TaskBoard.column} liền kề bên phải',
        name                   : 'Tên',
        newTaskName            : 'L{TaskBoard.task} Tên nhiệm vụ mới',
        removeTask             : 'Xóa nhiệm vụ L{TaskBoard.task}',
        removeTasks            : 'Xóa nhiệm vụ L{TaskBoard.tasks}',
        resources              : 'Tài nguyên',
        save                   : 'Lưu',
        scrollToColumn         : 'Di chuyển đến cột L{TaskBoard.column}',
        scrollToSwimlane       : 'Di chuyển đến làn L{TaskBoard.swimlane}',
        showColumnMenu         : 'Hiển thị menu cột',
        showTask               : 'Hiển thị L{TaskBoard.task}',
        unassigned             : 'Chưa được gán',
        zoom                   : 'Thu phóng'
    },

    ColumnFilters : {
        show         : 'Hiển thị bộ lọc cột',
        toggle       : 'Chuyển đổi bộ lọc cột',
        clear        : 'Xóa bộ lọc cột',
        badgeTooltip : count => `${count} bộ lọc đã được áp dụng`
    },

    ColumnSort : {
        sort     : 'Sắp xếp cột',
        sortedBy : ({ label, ascending }) =>
            `Cột được sắp xếp ${ascending ? 'tăng dần' : 'giảm dần'} theo "${label}"`,
        reset : 'Đặt lại sắp xếp cột'
    },

    TaskMenuItem : {
        showTaskMenu : 'Hiển thị menu công việc'
    },

    TodoListField : {
        add     : 'Thêm',
        newTodo : 'Danh sách cần làm mới'
    },

    UndoRedo : {
        UndoLastAction : 'Hoàn tác hành động cuối cùng',
        RedoLastAction : 'Làm lại hành động cuối cùng '
    },

    ColumnRename : {
        rename : 'Đổi tên'
    },

    ColumnSearchField : {
        search    : 'Tìm kiếm',
        matchMode : (mode) => `Chế độ tìm kiếm: ${mode}`,
        literal   : 'Nguyên văn',
        and       : 'Tất cả từ (AND)',
        or        : 'Bất kỳ từ nào (OR)'
    }
};

export default LocaleHelper.publishLocale(locale);
