import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Vi.js';

const locale = {

    localeName : 'Vi',
    localeDesc : 'Tiếng Việt',
    localeCode : 'vi',
    localeRtl  : false,

    Object : {
        Save : 'Lưu'
    },

    CostColumn : {
        cost : 'Trị giá'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Bỏ qua lịch tài nguyên'
    },

    InactiveColumn : {
        Inactive : 'Không hoạt động '
    },

    TaskInfoColumn : {
        info                     : 'Thông tin',
        postponedConflictTooltip : 'Có xung đột về lịch trình chưa được giải quyết với sự kiện này. Nhấn vào đây để giải quyết nó.'
    },

    ActualEffortColumn : {
        actualEffort : 'Nỗ lực thực tế'
    },

    AddNewColumn : {
        'New Column' : 'Cột mới'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Nỗ lực cơ bản'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Ngày bắt đầu cơ bản'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Ngày kết thúc cơ bản'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Thời lượng cơ bản'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Độ lệch ngày bắt đầu cơ bản'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Độ lệch ngày kết thúc cơ bản'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'phương sai thời lượng'
    },

    CalendarColumn : {
        Calendar : 'Lịch'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Khởi đầu sớm'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Kết thúc sớm'
    },

    LateStartDateColumn : {
        'Late Start' : 'Khởi đầu muộn'
    },

    LateEndDateColumn : {
        'Late End' : 'Kết thúc muộn'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Tổng thời gian trì hoãn'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Ngày ràng buộc'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Loại ràng buộc'
    },

    DeadlineDateColumn : {
        Deadline : 'Hạn chót'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Phụ thuộc không hợp lệ'
    },

    DurationColumn : {
        Duration : 'Thời hạn'
    },

    EffortColumn : {
        Effort : 'Cố gắng'
    },

    EndDateColumn : {
        Finish : 'Kết thúc'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Lên lịch thủ công'
    },

    MilestoneColumn : {
        Milestone : 'Cột mốc'
    },

    NameColumn : {
        Name : 'Tên'
    },

    NoteColumn : {
        Note : 'Lưu ý'
    },

    PercentDoneColumn : {
        '% Done' : '% đã hoàn thành'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Kế hoạch % Hoàn thành'
    },

    PredecessorColumn : {
        Predecessors : 'Sự kiện trước'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Tài nguyên được chỉ định',
        'more resources'     : 'thêm tài nguyên'
    },

    RollupColumn : {
        Rollup : 'Báo cáo tóm tắt'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Chế độ lập lịch'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Hướng lập lịch',
        inheritedFrom       : 'Thừa hưởng từ',
        enforcedBy          : 'Bắt buộc bởi'
    },

    SequenceColumn : {
        Sequence : 'Chuỗi'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Hiển thị trong dòng thời gian'
    },

    StartDateColumn : {
        Start : 'Bắt đầu'
    },

    SuccessorColumn : {
        Successors : 'Sự kiện sau'
    },

    TaskCopyPaste : {
        copyTask  : 'Sao chép',
        cutTask   : 'Cắt',
        pasteTask : 'Dán'
    },

    WBSColumn : {
        WBS      : 'Cấu trúc phân chia công việc',
        renumber : 'Đánh số lại'
    },

    DependencyField : {
        invalidDependencyFormat : 'Định dạng phụ thuộc không hợp lệ'
    },

    ProjectLines : {
        'Project Start' : 'Bắt đầu dự án',
        'Project End'   : 'Kế thúc dự án',
        statusDate      : 'Ngay tình trạng'
    },

    TaskTooltip : {
        Start    : 'Bắt đầu',
        End      : 'Kết thúc',
        Duration : 'Thời hạn',
        Complete : 'Hoàn thành'
    },

    BasicTaskEdit : {
        editTask        : 'Chỉnh sửa',
        name            : 'Tên',
        percentComplete : '% hoàn thành',
        start           : 'Bắt đầu',
        finish          : 'Kết thúc',
        duration        : 'Thời lượng'
    },

    AssignmentGrid : {
        Name     : 'Tên ',
        Units    : 'Đơn vị',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Số lượng',
        cost        : 'Chi phí',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Chỉnh sửa',
        Indent                 : 'Thụt lề vào',
        Outdent                : 'Đưa lề ra',
        'Convert to milestone' : 'Chuyển đổi thành cột mốc',
        Add                    : 'Thêm...',
        'New task'             : 'Nhiệm vụ mới',
        'New milestone'        : 'Cột mốc mới',
        'Task above'           : 'Nhiệm vụ ở trên',
        'Task below'           : 'Nhiệm vụ ở dưới',
        'Delete task'          : 'Xóa nhiệm vụ',
        Milestone              : 'Cột mốc',
        'Sub-task'             : 'Nhiệm vụ phụ',
        Successor              : 'Sự kiện sau',
        Predecessor            : 'Sự kiện trước',
        changeRejected         : 'thay đổi bị từ chối',
        linkTasks              : 'Thêm sự phụ thuộc',
        unlinkTasks            : 'Loại bỏ sự phụ thuộc',
        color                  : 'Màu sắc'
    },

    EventSegments : {
        splitTask : 'Chia nhỏ nhiệm vụ'
    },

    Indicators : {
        earlyDates   : 'Bắt đầu/kết thúc sớm',
        lateDates    : 'Bắt đầu/kết thúc muộn',
        Start        : 'Bắt đầu',
        End          : 'Kết thúc',
        deadlineDate : 'Hạn chót'
    },

    Versions : {
        indented      : 'Thụt vào',
        outdented     : 'Nhô ra',
        cut           : 'Cắt',
        pasted        : 'Đã dán',
        deletedTasks  : 'Các nhiệm vụ đã bị xóa',
        propertyNames : {
            baselines                   : 'Các đường cơ sở',
            deadlineDate                : 'Hạn chót',
            description                 : 'Mô tả',
            endDate                     : 'Ngày kết thúc',
            projectConstraintResolution : 'Giải quyết ràng buộc dự án',
            rollup                      : 'Tổng hợp',
            taskIconCls                 : 'Biểu tượng nhiệm vụ',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Thông tin dự án',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Tổng quan',
        projectName  : 'Tên dự án',
        start        : 'Ngày bắt đầu',
        finish       : 'Ngày kết thúc',
        scheduleFrom : 'Lên lịch từ',
        calendar     : 'Lịch',
        readOnly     : 'Chỉ đọc',
        forward      : 'Ngày bắt đầu dự án',
        backward     : 'Ngày kết thúc dự án'
    },

    ProjectEditorDescriptionTab : {
        description : 'Sự miêu tả'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Trình độ cao',
        hoursPerDay  : 'Số giờ mỗi ngày',
        daysPerWeek  : 'Số ngày mỗi tuần',
        daysPerMonth : 'Số ngày mỗi tháng'
    }
};

export default LocaleHelper.publishLocale(locale);
