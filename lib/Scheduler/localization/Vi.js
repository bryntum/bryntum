import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Vi.js';
import '../../Grid/localization/Vi.js';

const locale = {

    localeName : 'Vi',
    localeDesc : 'Tiếng Việt',
    localeCode : 'vi',
    localeRtl  : false,

    Object : {
        newEvent    : 'Sự kiện mới',
        information : 'Thông tin',
        showDetails : 'Hiển thị chi tiết'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' kiện'
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Chuyển đổi cột bố cục tài nguyên. SPACE cho menu ngữ cảnh.'
    },

    Dependencies : {
        from    : 'Từ',
        to      : 'Đến',
        valid   : 'Hợp lệ',
        invalid : 'Không hợp lệ'
    },

    DependencyType : {
        SS           : 'BB',
        SF           : 'BK',
        FS           : 'KB',
        FF           : 'KK',
        StartToStart : 'Bắt đầu đến Bắt đầu',
        StartToEnd   : 'Bắt đầu đến Kết thúc',
        EndToStart   : 'Kết thúc đến Bắt đầu',
        EndToEnd     : 'Kết thúc đến Kết thúc',
        short        : [
            'BB',
            'BK',
            'KB',
            'KK'
        ],
        long : [
            'Bắt đầu đến Bắt đầu',
            'Bắt đầu đến Kết thúc',
            'Kết thúc đến Bắt đầu',
            'Kết thúc đến Kết thúc'
        ]
    },

    DependencyEdit : {
        From              : 'Từ',
        To                : 'Đến',
        Type              : 'Loại',
        Lag               : 'Lag',
        color             : 'Màu sắc',
        lineStyle         : 'Kiểu đường',
        solid             : 'Liền nét',
        dashed            : 'Nét đứt',
        dotted            : 'Chấm nét',
        dashDot           : 'Nét gạch chấm',
        longDash          : 'Nét dài',
        'Edit dependency' : 'Chỉnh sửa Phụ thuộc',
        Save              : 'Lưu',
        Delete            : 'Xóa',
        Cancel            : 'Hủy bỏ',
        StartToStart      : 'Bắt đầu đến Bắt đầu',
        StartToEnd        : 'Bắt đầu đến Kết thúc',
        EndToStart        : 'Kết thúc đến Bắt đầu',
        EndToEnd          : 'Kết thúc đến Kết thúc',
        Active            : 'Hoạt động'
    },

    EventEdit : {
        Name           : 'Tên',
        Resource       : 'Tài nguyên',
        Start          : 'Bắt đầu',
        startTime      : 'Thời gian bắt đầu',
        End            : 'Kết thúc',
        endTime        : 'Thời gian kết thúc',
        Save           : 'Lưu',
        Delete         : 'Xóa',
        Cancel         : 'Hủy bỏ',
        'Edit event'   : 'Chỉnh sửa sự kiện',
        Repeat         : 'Lặp lại',
        editRecurrence : 'Chỉnh sửa lặp lại'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Sự kiện chồng chéo sự kiện hiện có cho tài nguyên này',
        noDropOutsideTimeline   : 'Sự kiện không thể bị bỏ hoàn toàn ngoài dòng thời gian',
        duplicateAssignmentDrag : 'Sự kiện không thể được gán cho cùng một tài nguyên nhiều lần'
    },

    SchedulerBase : {
        'Add event'      : 'Thêm sự kiện',
        'Delete event'   : 'Xóa sự kiện',
        'Unassign event' : 'Bỏ chỉ định sự kiện',
        color            : 'Màu sắc',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, bắt đầu lúc ${startDate} ${eventRecord.duration > 0 ? `trong ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Thu phóng',
        activeDateRange : 'Phạm vi ngày',
        startText       : 'Ngày bắt đầu',
        endText         : 'Ngày kết thúc',
        todayText       : 'Hôm nay'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Trục thời gian hiển thị từ ${startDate} đến ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Sao chép sự kiện',
        cutEvent   : 'Cắt sự kiện',
        pasteEvent : 'Dán sự kiện'
    },

    EventFilter : {
        filterEvents : 'Lọc nhiệm vụ',
        byName       : 'Theo tên'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Hiển thị dòng thời gian hiện tại'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'giây'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD/MM, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD/MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Ngày'
        },
        day : {
            name : 'Ngày/giờ'
        },
        week : {
            name : 'Tuần/giờ'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Tuần/ngày'
        },
        dayAndMonth : {
            name : 'Tháng'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Tuần'
        },
        weekAndMonth : {
            name : 'Tuần'
        },
        weekAndDayLetter : {
            name : 'Tuần/ngày trong tuần'
        },
        weekDateAndMonth : {
            name : 'Tháng/tuần'
        },
        monthAndYear : {
            name : 'Tháng'
        },
        year : {
            name : 'Năm'
        },
        manyYears : {
            name : 'Năm'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Bạn đang xóa một sự kiện',
        'delete-all-message'        : 'Bạn có muốn xóa tất cả các lần xuất hiện của sự kiện này không?',
        'delete-further-message'    : 'Bạn có muốn xóa sự kiện này và tất cả các lần xuất hiện trong tương lai của sự kiện này hay chỉ sự kiện đã chọn?',
        'delete-only-this-message'  : 'Bạn có muốn xóa sự kiện này không?',
        'delete-further-btn-text'   : 'Xóa tất cả các sự kiện trong tương la',
        'delete-only-this-btn-text' : 'Chỉ xóa sự kiện này',
        'update-title'              : 'Bạn đang thay đổi một sự kiện lặp lại',
        'update-all-message'        : 'Bạn có muốn thay đổi tất cả các lần xuất hiện của sự kiện này không?',
        'update-further-message'    : 'Bạn chỉ muốn thay đổi lần xuất hiện này của sự kiện hay lần này và tất cả các lần xuất hiện trong tương lai?',
        'update-only-this-message'  : 'Bạn có muốn thay đổi sự kiện này không?',
        'update-further-btn-text'   : 'Tất cả các sự kiện trong tương lai',
        'update-only-this-btn-text' : 'Chỉ Sự kiện này',
        Yes                         : 'Có',
        Cancel                      : 'Hủy bỏ',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' và ',
        Daily                           : 'Hằng ngày',
        'Weekly on {1}'                 : ({ days }) => `Hằng tuần vào ngày ${days}`,
        'Monthly on {1}'                : ({ days }) => `Hằng tháng vào tháng ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Hằng nằm vào năm ${days} của ${months}`,
        'Every {0} days'                : ({ interval }) => `Mỗi ${interval} ngày`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Mỗi ${interval} tuần vào ngày ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Mỗi ${interval} tháng vào ngày ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Mỗi ${interval} năm vào ngày ${days} của tháng ${months}`,
        position1                       : 'thứ nhất',
        position2                       : 'thứ hai',
        position3                       : 'thứ ba',
        position4                       : 'thứ tư',
        position5                       : 'thứ năm',
        'position-1'                    : 'cuối cùng',
        day                             : 'ngày',
        weekday                         : 'ngày trong tuần',
        'weekend day'                   : 'ngày cuối tuần',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Lặp lại sự kiện',
        Cancel              : 'Hủy bỏ',
        Save                : 'Lưu',
        Frequency           : 'Tần suất',
        Every               : 'Mỗi',
        DAILYintervalUnit   : 'ngày',
        WEEKLYintervalUnit  : 'tuần',
        MONTHLYintervalUnit : 'tháng',
        YEARLYintervalUnit  : 'năm',
        Each                : 'Mỗi',
        on                  : 'Vào',
        the                 : 'Vào',
        'On the'            : 'Vào',
        'End repeat'        : 'Kết thúc lặp lại',
        'time(s)'           : 'lần',
        Days                : 'Ngày',
        Months              : 'Tháng'
    },

    RecurrenceDaysCombo : {
        day           : 'ngày',
        weekday       : 'ngày trong tuần',
        'weekend day' : 'ngày cuối tuần'
    },

    RecurrencePositionsCombo : {
        position1    : 'thứ nhất',
        position2    : 'thứ hai',
        position3    : 'thứ ba',
        position4    : 'thứ tư',
        position5    : 'thứ năm',
        'position-1' : 'cuối cùng'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Không bao giờ',
        After     : 'Sau',
        'On date' : 'Vào ngày'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Không lặp lại',
        Daily   : 'Hằng ngày',
        Weekly  : 'Hằng tuần',
        Monthly : 'Hằng tháng',
        Yearly  : 'Hằng năm'
    },

    RecurrenceCombo : {
        None   : 'Không',
        Custom : 'Tùy chỉnh...'
    },

    Summary : {
        'Summary for' : date => `Tóm tắt cho ngày ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Hoàn thành lịch trình',
        currentview  : 'Lịch trình hiển thị',
        daterange    : 'Phạm vi ngày',
        completedata : 'Toàn bộ lịch trình (cho tất cả các sự kiện)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Phạm vi lịch trình',
        'Export from'    : 'Xuất từ',
        'Export to'      : 'Xuất đến'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Trang đơn'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Trang đơn (không tỉ lệ)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Nhiều trang (dọc)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Không có tài nguyên nào được chỉ định'
    },

    CrudManagerView : {
        serverResponseLabel : 'Phản hồi của máy chủ:'
    },

    DurationColumn : {
        Duration : 'Thời hạn'
    },

    EventClusteringBase : {
        unnamed         : 'Chưa đặt tên',
        more            : count => `+ ${count} nữa`,
        clusteredEvents : count => `${count} sự kiện được nhóm`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} khoảng thời gian được nhóm`
    },

    ConstraintTypePicker : {
        none                : 'Không có',
        assoonaspossible    : 'Sớm nhất có thể',
        aslateaspossible    : 'Muộn nhất có thể',
        muststarton         : 'Phải bắt đầu từ',
        mustfinishon        : 'Phải kết thúc từ',
        startnoearlierthan  : 'Bắt đầu không sớm hơn',
        startnolaterthan    : 'Bắt đầu không muộn hơn',
        finishnoearlierthan : 'Hoàn thành không sớm hơn',
        finishnolaterthan   : 'Hoàn thành không muộn hơn'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} thời gian đệm trước sự kiện`;
            }
            if (postamble) {
                description += `.${postamble.toString()} thời gian đệm sau sự kiện`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Tiến',
        Backward      : 'Lùi',
        inheritedFrom : 'Thừa hưởng từ',
        enforcedBy    : 'Bắt buộc bởi'
    },

    CalendarField : {
        'Default calendar' : 'Lịch mặc định',
        editCalendar       : 'Chỉnh sửa lịch'
    },

    TaskEditorBase : {
        Information   : 'Thông tin nhiệm vụ',
        Save          : 'Lưu',
        Cancel        : 'Hủy bỏ',
        Delete        : 'Xóa bỏ',
        calculateMask : 'Đang tính ...',
        saveError     : 'Không thể lưu, trước tiên hãy sửa lỗi',
        repeatingInfo : 'Xem một sự kiện lặp lại',
        editRepeating : 'Chỉnh sửa'
    },

    TaskEdit : {
        editEvent              : 'Chỉnh sửa sự kiện',
        ConfirmDeletionTitle   : 'Xác nhận xóa',
        ConfirmDeletionMessage : 'Bạn có chắc chắn muốn xóa sự kiện không?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '33em'
    },

    SchedulerGeneralTab : {
        General      : 'Chung',
        Name         : 'Tên',
        Resources    : 'Tài nguyên',
        '% complete' : '% hoàn thành',
        Duration     : 'Thờ hạn',
        Start        : 'Bắt đầu',
        Finish       : 'Kết thúc',
        Effort       : 'Nỗ lực',
        Preamble     : 'Mở đầu',
        Postamble    : 'Hậu kỳ'
    },

    GeneralTab : {
        General      : 'Chung',
        Name         : 'Tên',
        '% complete' : '% hoàn tất',
        Duration     : 'Thời hạn',
        Start        : 'Bắt đầu',
        Finish       : 'Kết thúc',
        Effort       : 'Nỗ lực',
        Dates        : 'Ngày'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Nâng cao',
        Calendar                   : 'Lịch',
        'Scheduling mode'          : 'Chế độ lập lịch',
        'Effort driven'            : 'Nỗ lực thúc đẩy',
        'Manually scheduled'       : 'Lên lịch thủ công',
        'Constraint type'          : 'Loại ràng buộc',
        'Constraint date'          : 'Ngày ràng buộc',
        Inactive                   : 'Không hoạt động',
        'Ignore resource calendar' : 'Bỏ qua lịch tài nguyên'
    },

    CalendarEditorDatePicker : {
        addException : 'Thêm ngoại lệ',
        addWeek      : 'Thêm tuần'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Thêm ngoại lệ',
        removeException : 'Xóa ngoại lệ',
        noRows          : 'Không có ngoại lệ được thêm vào'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Thêm tuần',
        removeWeek : 'Loại bỏ tuần'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Ngày đang hoạt động theo mặc định',
        workingTimeCalendar        : 'Lịch thời gian làm việc',
        exceptions                 : 'Ngoại lệ',
        general                    : 'Tổng quan',
        name                       : 'Tên',
        parent                     : 'Cha mẹ',
        save                       : 'Cứu',
        weeks                      : 'Tuần',
        error                      : 'Lỗi',
        inputErrors                : 'Có lỗi đầu vào. Vui lòng sửa chúng trước khi lưu các thay đổi của bạn.',
        delete                     : 'Xóa bỏ',
        addCalendar                : 'Thêm một lịch',
        confirmation               : 'Xác nhận',
        removeCalendarWithChildren : 'Lịch có lịch trẻ em. Nhấp vào "Có" để xóa lịch với con cái.',
        removeCalendarAndLinks     : 'Lịch được sử dụng bởi một số hồ sơ. Nhấp vào "Có" để hủy liên kết chúng và xóa lịch.',
        newException               : 'Ngoại lệ mới',
        newWeek                    : 'Tuần mới'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' đang làm việc',
        isNotWorking : ' không hoạt động',
        basedOn      : ' dựa trên:',
        byDefault    : 'Theo mặc định',
        rangeTpl     : (start, end) => `${start} đến ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Ngày làm việc',
        nonWorkingDay : 'Ngay nghỉ'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Có phạm vi chồng chéo',
        errorMissingDate   : 'Thời gian bắt đầu và kết thúc là bắt buộc',
        errorStartAfterEnd : 'Thời gian bắt đầu không thể sau thời gian kết thúc'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Tên',
        from                                 : 'Từ',
        to                                   : 'ĐẾN',
        is                                   : 'Là',
        nonWorking                           : 'Không làm việc',
        working                              : 'Đang làm việc',
        hours                                : 'Giờ',
        repeat                               : 'Lặp lại',
        repeatEnd                            : 'Lặp lại kết thúc',
        errorMissingDate                     : 'Phạm vi ngày ngoại lệ là bắt buộc',
        errorStartAfterEnd                   : '"Từ" Ngày không thể sau ngày "đến" ngày ',
        errorStartAndEndRepeatNumberMismatch : 'Ngoại lệ nên bắt đầu và kết thúc cùng một số lần'
    },

    CalendarEditorWeekPanel : {
        name        : 'Tên',
        from        : 'Từ',
        to          : 'ĐẾN',
        days        : 'Ngày',
        copyDay     : 'Sao chép ngày',
        pasteDay    : 'Ngày dán',
        stopCopying : 'Ngừng sao chép'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Thêm phạm vi',
        removeRange : 'Loại bỏ phạm vi'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"Từ" Ngày không thể sau ngày "đến" ngày ',
        errorNoDefaultWeek           : 'Cấu hình tuần là bắt buộc',
        errorMultipleDefaultWeeks    : 'Nhiều hơn một tuần mặc định được chỉ định',
        errorNoWeekAvailability      : 'Tuần phải cung cấp một số thời gian làm việc',
        errorInvalidWeekAvailability : 'Tuần có lỗi cấu hình thời gian làm việc',
        noRows                       : 'Không có tuần được thêm vào'
    },

    AdvancedTab : {
        Advanced                   : 'Nâng cao',
        Calendar                   : 'Lịch',
        'Scheduling mode'          : 'Chế độ lập lịch',
        'Effort driven'            : 'Nỗ lực thúc đẩy',
        'Manually scheduled'       : 'Lên lịch thủ công',
        'Constraint type'          : 'Loại ràng buộc',
        'Constraint date'          : 'Ngày ràng buộc',
        Constraint                 : 'Ràng buộc',
        Rollup                     : 'Báo cáo tóm tắt',
        Inactive                   : 'Không hoạt động',
        'Ignore resource calendar' : 'Bỏ qua lịch tài nguyên',
        'Scheduling direction'     : 'Hướng lập lịch',
        projectBorder              : 'Biên giới dự án',
        ignore                     : 'Phớt lờ',
        honor                      : 'Tôn kính',
        askUser                    : 'Hỏi người dùng'
    },

    DependencyTab : {
        Predecessors      : 'Sự kiện trước',
        Successors        : 'Sự kiện sau',
        ID                : 'ID',
        Name              : 'Tên',
        Type              : 'Loại',
        Lag               : 'Lag',
        cyclicDependency  : 'Phụ thuộc theo chu kỳ',
        invalidDependency : 'Phụ thuộc không hợp lệ',
        readOnlyTask      : 'Không thể liên kết tác vụ chỉ đọc'
    },

    NotesTab : {
        Notes : 'Lưu ý'
    },

    ResourceCalendarColumn : {
        calendar : 'Lịch'
    },

    ResourceEdit : {
        editResource : 'Chỉnh sửa tài nguyên'
    },

    ResourceEditor : {
        resourceInformation : 'Thông tin tài nguyên',
        costs               : 'Chi phí',
        save                : 'Cứu',
        error               : 'Lỗi',
        inputErrors         : 'Có lỗi đầu vào. Vui lòng sửa chúng trước khi lưu các thay đổi của bạn.',
        delete              : 'Xóa bỏ',
        confirmation        : 'Xác nhận',
        removeUsedResource  : 'Tài nguyên được gán cho một số nhiệm vụ. Nhấp vào "Có" để xóa tài nguyên.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Lịch',
        general     : 'Tổng quan',
        label       : 'Nhãn vật liệu',
        name        : 'Tên tài nguyên',
        type        : 'Kiểu',
        costAccrual : 'Chi phí tích lũy',
        labelHint   : 'ví dụ: kg, tấn hoặc hộp',
        maxUnits    : 'Số lượng tối đa'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Tích lũy tại',
        prorated : 'được chia theo tỷ lệ',
        start    : 'Bắt đầu',
        end      : 'Kết thúc'
    },

    CostAccrualField : {
        prorated : 'được chia theo tỷ lệ',
        start    : 'Bắt đầu',
        end      : 'Kết thúc'
    },

    ResourceType : {
        work     : 'Công việc',
        material : 'Vật liệu',
        cost     : 'Trị giá'
    },

    ResourceTypeColumn : {
        type : 'Kiểu'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Bảng giá',
        newGroup     : 'Bảng mới',
        removeGroup  : 'Xóa bảng',
        useByDefault : 'Sử dụng theo mặc định cho các nhiệm vụ tài nguyên',
        noRates      : 'Không có giá'
    },

    ResourceGrid : {
        name          : 'Tên',
        materialLabel : 'Nhãn vật liệu',
        maxUnits      : 'Đơn vị tối đa',
        cost          : 'Trị giá',
        noRows        : 'Không có tài nguyên'
    },

    ResourceRateTableContainer : {
        startDate    : 'Ngày bắt đầu',
        standardRate : 'Tỷ lệ tiêu chuẩn',
        perUseCost   : 'Chi phí mỗi lần sử dụng',
        addRate      : 'Thêm tỷ lệ',
        removeRate   : 'Xóa tỷ lệ',
        name         : 'Tên',
        noRates      : 'Không có giá'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Thông tin bảng tỷ lệ'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Số lượng',
        Resources   : 'Tài nguyên',
        Resource    : 'Tài nguyên',
        Units       : 'Đơn vị',
        cost        : 'Trị giá',
        effort      : 'Cố gắng',
        start       : 'Bắt đầu',
        finish      : 'Hoàn thành',
        preamble    : 'Lời mở đầu',
        postamble   : 'Lời kết'
    },

    RateTableColumn : {
        rateTable : 'Bảng giá'
    },

    RecurrenceTab : {
        title : 'Lặp lai'
    },

    SchedulingModePicker : {
        Normal           : 'Thường',
        'Fixed Duration' : 'Thời hạn cố định',
        'Fixed Units'    : 'Đơn vị cố định',
        'Fixed Effort'   : 'Nỗ lực cố định'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} của {available}</span> được phân bổ',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} của {available}</span> được phân bổ',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} của {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} của {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'Vào ngày {startDate}<br><span class="{cls}">{allocated} của {available}</span> được phân bổ:<br>{assignments}',
        plusMore              : 'thêm +{value}'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Nỗ lực</div><div class="b-effort-value {cls}">{allocated} trong {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Nỗ lực</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Chi phí</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Số lượng</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} vào {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Tóm tắt cho {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Tóm tắt cho {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} thêm',
        nameColumnText        : 'Tài nguyên / Sự kiện'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Hủy bỏ thay đổi ',
        schedulingConflict : 'Xung đột lịch trình',
        emptyCalendar      : 'Lỗi cấu hình lịch',
        cycle              : 'Lập kế hoạch chu kỳ',
        Apply              : 'Áp dụng'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Vui lòng chọn một phụ thuộc:',
        invalidDependencyLabel : 'Có những phụ thuộc không hợp lệ liên quan cần được giải quyết:'
    },

    SchedulerProBase : {
        propagating     : 'Đang tính toán dự',
        storePopulation : 'Đang tải dữ liệu',
        finalizing      : 'Đang hoàn thiện kết quả'
    },

    EventSegments : {
        splitEvent    : 'Chia tách sự kiện',
        renameSegment : 'Đổi tên'
    },

    NestedEvents : {
        createGroup         : 'Nhóm các sự kiện đã chọn',
        newGroupName        : 'Nhóm mới',
        deNestingNotAllowed : 'Không được phép bỏ làm tổ',
        nestingNotAllowed   : 'Không được phép làm tổ'
    },

    VersionGrid : {
        compare       : 'So sánh',
        description   : 'Mô tả',
        occurredAt    : 'Xảy ra lúc',
        rename        : 'Đổi tên',
        restore       : 'Khôi phục',
        stopComparing : 'Dừng so sánh'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'nhiệm vụ',
            AssignmentModel : 'phân nhiệm',
            DependencyModel : 'liên kết',
            ProjectModel    : 'dự án',
            ResourceModel   : 'nguồn',
            other           : 'đối tượng'
        },
        entityNamesPlural : {
            TaskModel       : 'những nhiệm vụ',
            AssignmentModel : 'những phân nhiệm',
            DependencyModel : 'những liên kết',
            ProjectModel    : 'những dự án',
            ResourceModel   : 'những nguồn',
            other           : 'những đối tượng'
        },
        transactionDescriptions : {
            update : 'Đã thay đổi {n} {entities}',
            add    : 'Đã thêm {n} {entities}',
            remove : 'Loại bỏ {n} {entities}',
            move   : 'Đã chuyển {n} {entities}',
            mixed  : 'Đã thay đổi {n} {entities}'
        },
        propertyNames : {
            active                   : 'Hoạt động',
            allDay                   : 'Cả ngày',
            allowOverlap             : 'Cho phép chồng chéo',
            barMargin                : 'Lề thanh',
            bidirectional            : 'Hai chiều',
            calendar                 : 'Lịch',
            cls                      : 'Lớp CSS',
            constraintDate           : 'Ngày ràng buộc',
            constraintType           : 'Loại ràng buộc',
            daysPerMonth             : 'Ngày mỗi tháng',
            daysPerWeek              : 'Ngày mỗi tuần',
            delayFromParent          : 'Trì hoãn từ cha mẹ',
            direction                : 'Hướng',
            drawDependencies         : 'Vẽ phụ thuộc',
            duration                 : 'Thời lượng',
            durationUnit             : 'Đơn vị thời lượng',
            effort                   : 'Nỗ lực',
            effortDriven             : 'Dựa trên nỗ lực',
            effortUnit               : 'Đơn vị nỗ lực',
            endDate                  : 'Ngày kết thúc',
            eventColor               : 'Màu sắc',
            eventId                  : 'ID Sự kiện',
            eventLayout              : 'Bố cục sự kiện',
            eventStyle               : 'Kiểu thanh',
            exceptionDates           : 'Ngày ngoại lệ',
            fixed                    : 'Cố định',
            from                     : 'Từ',
            fromSide                 : 'Từ phía',
            hoursPerDay              : 'Giờ mỗi ngày',
            href                     : 'Liên kết',
            iconCls                  : 'Biểu tượng',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Bỏ qua lịch tài nguyên',
            ignoreTimeZone           : 'Bỏ qua múi giờ',
            image                    : 'Hình ảnh',
            imageUrl                 : 'URL hình ảnh',
            inactive                 : 'Không hoạt động',
            intervals                : 'Khoảng thời gian',
            lag                      : 'Độ trễ',
            lagUnit                  : 'Đơn vị độ trễ',
            lineStyle                : 'Kiểu đường',
            manuallyScheduled        : 'Lên lịch thủ công',
            milestoneWidth           : 'Chiều rộng cột mốc',
            name                     : 'Tên',
            note                     : 'Ghi chú',
            parentId                 : 'ID Cha',
            parentIndex              : 'Vị trí',
            percentDone              : '% hoàn thành',
            postamble                : 'Hậu tố',
            preamble                 : 'Tiền tố',
            readOnly                 : 'Chỉ đọc',
            recurrenceRule           : 'Quy tắc lặp lại',
            resourceId               : 'ID Tài nguyên',
            resourceMargin           : 'Lề tài nguyên',
            rowHeight                : 'Chiều cao hàng',
            schedulingMode           : 'Chế độ lập lịch',
            segments                 : 'Phân đoạn',
            showAvatar               : 'Hiển thị hình đại diện',
            showInTimeline           : 'Hiển thị trong dòng thời gian',
            startDate                : 'Ngày bắt đầu',
            stickyContents           : 'Nội dung cố định',
            strokeColor              : 'Màu đường',
            style                    : 'Kiểu',
            target                   : 'Mục tiêu liên kết',
            to                       : 'Đến',
            toSide                   : 'Đến phía',
            type                     : 'Loại',
            units                    : 'Đơn vị',
            unscheduled              : 'Chưa lên lịch',
            unspecifiedTimeIsWorking : 'Thời gian không xác định là làm việc',
            version                  : 'Phiên bản'
        },
        intervals : {
            working    : 'Đang làm việc',
            nonWorking : 'Không làm việc',
            fromTo     : 'Từ {from} đến {to}',
            recurring  : 'Lặp lại bắt đầu {start} kết thúc {end}'
        },
        addEntity         : 'Đã thêm {type} **{name}**',
        removeEntity      : 'Đã loại bỏ {type} **{name}**',
        updateEntity      : 'Đã thay đổi {type} **{name}**',
        moveEntity        : 'Đã chuyển {type} **{name}** từ {from} đến {to}',
        addDependency     : 'Đã thêm liên kết từ **{from}** đến **{to}**',
        removeDependency  : 'Đã bỏ liên kết từ **{from}** đến **{to}**',
        updateDependency  : 'Đã sửa liên kết từ **{from}** đến **{to}**',
        addAssignment     : 'Đã phân công **{resource}** đến **{event}**',
        removeAssignment  : 'Đã hủy phân nhiệm **{resource}** từ **{event}**',
        updateAssignment  : 'Đã chỉnh sửa nhiệm vụ **{resource}** từ **{event}**',
        noChanges         : 'Không thay đổi',
        nullValue         : 'không',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Đã lưu lúc {date}',
        autoSavedAt       : 'Tự động lưu lúc {date}',
        undid             : 'Hoàn tác thay đổi',
        redid             : 'Làm lại các thay đổi',
        editedTask        : 'Thuộc tính tác vụ đã chỉnh sửa',
        deletedTask       : 'Đã xóa một nhiệm vụ',
        movedTask         : 'Đã chuyển một nhiệm vụ',
        movedTasks        : 'Đã chuyển nhiều nhiệm vụ'
    }
};

export default LocaleHelper.publishLocale(locale);
