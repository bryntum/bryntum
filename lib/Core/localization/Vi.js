import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Vi',
    localeDesc : 'Tiếng Việt',
    localeCode : 'vi',
    localeRtl  : false,

    Object : {
        Yes      : 'Có',
        No       : 'Không',
        Cancel   : 'Hủy bỏ ',
        Ok       : 'OK',
        Week     : 'Tuần',
        None     : 'Không',
        previous : 'Trước',
        next     : 'Tiếp theo',
        to       : 'đến',
        at       : 'tại',
        on       : 'trên',
        editing  : what => `Chỉnh sửa ${what}`,
        settings : 'Cài đặt',
        close    : 'Đóng',
        go       : 'Đi',
        save     : 'Lưu',
        cancel   : 'Hủy bỏ',
        revert   : 'Phục hồi',
        collapse : 'Thu gọn',
        expand   : 'Mở rộng',
        today    : 'Hôm nay',
        andNMore : n => `và ${n} nữa`
    },

    AIBase : {
        delayStatusTexts : [
            'Đang chờ',
            'Đang chờ ...',
            'Vẫn đang chờ',
            'Vẫn đang chờ ...'
        ],
        autoStartDialogMessage        : 'Bạn có muốn kích hoạt giọng nói AI không?',
        voiceActivationToast          : phrase => `Kích hoạt giọng nói đã được bật, sử dụng cụm từ "${phrase}" để bắt đầu cuộc trò chuyện`,
        voiceControlNotSupportedToast : 'Điều khiển giọng nói không được hỗ trợ trên thiết bị này',
        voiceControlErrorToast        : 'Không thể bắt đầu điều khiển giọng nói trên thiết bị của bạn',
        voiceControlSilenceToast      : phrase => `Cuộc trò chuyện giọng nói AI đã kết thúc do im lặng. Sử dụng cụm từ ${phrase} để bắt đầu lại cuộc trò chuyện`,
        noAudioDetected               : 'Không phát hiện âm thanh, vui lòng thử lại',
        transcriptionErrorToast       : 'Chuyển đổi giọng nói thất bại, vui lòng thử lại',
        playbackErrorToast            : 'Phát lại âm thanh thất bại, vui lòng kiểm tra thiết bị đầu ra âm thanh của bạn',
        failed                        : '(thất bại)',
        awaitingConfirmation          : 'Đang chờ xác nhận',
        timeoutToast                  : 'Tin nhắn đã hết thời gian',
        readingStatusText             : modelName => `Đang đọc ${modelName}s`,
        updatingStatusText            : modelName => `Đang cập nhật ${modelName}s`,
        removingStatusText            : modelName => `Đang xóa ${modelName}s`,
        addingStatusText              : modelName => `Đang thêm ${modelName}`,
        filteringStatusText           : modelName => `Đang lọc ${modelName}s`,
        thinkingStatusText            : 'Đang suy nghĩ',
        processingStatusText          : 'Đang xử lý'
    },

    AISettingsPanel : {
        highlight               : 'Làm nổi bật',
        verbosity               : 'Độ chi tiết',
        voiceActivation         : 'Kích hoạt giọng nói',
        enableVoiceActivation   : 'Bật kích hoạt giọng nói',
        voiceOnly               : 'Chỉ giọng nói',
        autostart               : 'Tự động khởi động',
        dataChangeConfirmations : 'Xác nhận thay đổi dữ liệu',
        add                     : 'Thêm',
        remove                  : 'Xóa',
        update                  : 'Cập nhật',
        planning                : 'Lập kế hoạch',
        enablePlanning          : 'Bật lập kế hoạch',
        aiModel                 : 'Mô hình AI',
        timeline                : 'Dòng thời gian',
        'in-view'               : 'Trong tầm nhìn',
        all                     : 'Tất cả',
        timeRangeContext        : 'Ngữ cảnh phạm vi thời gian'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI đang nói',
        recordingTooltip      : 'Đang ghi âm',
        waitingTooltip        : 'AI đang suy nghĩ',
        startRecordingTooltip : 'Nhấn để bắt đầu',
        stopRecordingTooltip  : 'Nhấn để dừng',
        inactiveTooltip       : 'Không ghi âm',
        openChatTooltip       : 'Nhấp chuột phải để mở trò chuyện'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Nhập tin nhắn',
        noConnectionTooltip     : 'Không phát hiện kết nối, nhấn để thử lại',
        undone                  : 'đã hoàn tác',
        aborted                 : '(đã hủy)',
        readAloudTooltip        : 'Đọc tin nhắn thành tiếng',
        confidenceTooltip       : confidence => `Độ tin cậy: ${confidence}%`,
        undoTooltip             : 'Hoàn tác thay đổi dữ liệu',
        redoTooltip             : 'Làm lại thay đổi dữ liệu',
        thumbsUp                : 'Thích',
        thumbsDown              : 'Không thích',
        feedbackToast           : 'Cảm ơn bạn đã phản hồi!',
        clearChat               : 'Xóa trò chuyện',
        closeChat               : 'Đóng trò chuyện',
        settings                : 'Cài đặt',
        closeSettings           : 'Đóng cài đặt'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Chọn chính xác ${min}`,
        tooFewOptionsSelected     : min => `Chọn ít nhất ${min}`,
        tooManyOptionsSelected    : max => `Chọn không quá ${max}`
    },

    CodeEditor : {
        apply        : 'Áp dụng',
        autoApply    : 'Tự động áp dụng',
        downloadCode : 'Tải mã'
    },

    ColorPicker : {
        noColor : 'Không màu'
    },

    Combo : {
        noResults          : 'Ko có kết quả',
        recordNotCommitted : 'Không thể thêm hồ sơ',
        addNewValue        : value => `Thêm ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Làm nổi bật',
        preview         : 'Xem trước',
        approve         : 'Phê duyệt',
        reject          : 'Từ chối',
        confirmAdd      : 'Xác nhận thêm:',
        confirmUpdate   : 'Xác nhận cập nhật:',
        confirmRemove   : 'Xác nhận xóa:',
        confirmCopy     : 'Xác nhận sao chép',
        confirmAssign   : 'Xác nhận gán',
        confirmReassign : 'Xác nhận gán lại',
        confirmUnassign : 'Xác nhận hủy gán',
        confirmLink     : 'Xác nhận liên kết',
        confirmUnlink   : 'Xác nhận hủy liên kết'
    },

    FilePicker : {
        file : 'Tập tin'
    },

    Field : {
        badInput              : 'Giá trị trường không hợp lệ',
        patternMismatch       : 'Giá trị phải phù hợp với một mẫu cụ thể',
        rangeOverflow         : value => `Giá trị phải nhỏ hơn hoặc bằng ${value.max}`,
        rangeUnderflow        : value => `Giá trị phải lớn hơn hoặc bằng ${value.min}`,
        stepMismatch          : 'Giá trị phải phù hợp với bước',
        tooLong               : 'Giá trị phải ngắn hơn',
        tooShort              : 'Giá trị phải dài hơn',
        typeMismatch          : 'Giá trị bắt buộc phải ở định dạng đặc biệt',
        valueMissing          : 'Trường này là bắt buộc',
        invalidValue          : 'Giá trị trường không hợp lệ',
        minimumValueViolation : 'Vi phạm giá trị tối thiểu',
        maximumValueViolation : 'Vi phạm giá trị tối đa',
        fieldRequired         : 'Trường này là bắt buộc',
        validateFilter        : 'Giá trị phải được chọn từ danh sách'
    },

    DateField : {
        invalidDate : format => 'Đầu vào ngày không hợp lệ, định dạng mong đợi là ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Chuyển đến năm trước',
        gotoPrevMonth : 'Chuyển đến tháng trước',
        gotoNextMonth : 'Chuyển đến tháng sau',
        gotoNextYear  : 'Sang năm sau',
        navigation    : 'Điều hướng bộ chọn ngày'
    },

    Hint : {
        dontShowAgain : 'Không hiển thị lại'
    },

    NumberFormat : {
        locale   : 'vi',
        currency : 'VND'
    },

    DurationField : {
        invalidUnit : 'Đơn vị không hợp lệ'
    },

    TimeField : {
        invalidTime : 'Đầu vào thời gian không hợp lệ'
    },

    TimePicker : {
        hour   : 'Giờ',
        minute : 'Phút',
        second : 'Thứ hai'
    },

    Tooltip : {
        loading : 'Đang tải...'
    },

    List : {
        loading   : 'Đang tải...',
        selectAll : 'Chọn Tất cả'
    },

    GridBase : {
        loadMask : 'Đang tải...',
        syncMask : 'Đang lưu các thay đổi, vui lòng đợi ...'
    },

    PagingToolbar : {
        firstPage         : 'Đi đến trang đầu tiên',
        prevPage          : 'Đi đến trang trước',
        page              : 'Trang',
        nextPage          : 'Đi đến trang tiếp theo',
        lastPage          : 'Đi đến trang cuối cùng',
        reload            : 'Tải lại trang hiện tại',
        noRecords         : 'Không có hồ sơ nào để hiển thị',
        pageCountTemplate : data => `/ ${data.lastPage}`,
        summaryTemplate   : data => `Hiển thị hồ sơ ${data.start} - ${data.end} of ${data.allCount}`
    },

    Popup : {
        close    : 'Đóng cửa sổ bật lên',
        maximize : 'Phóng to'
    },

    Splitter : {
        ariaLabel      : 'Trình chia, sử dụng các phím mũi tên để thay đổi kích thước các bảng lân cận',
        collapseLeft   : 'Thu gọn bảng bên trái',
        collapseRight  : 'Thu gọn bảng bên phải',
        collapseTop    : 'Thu gọn bảng phía trên',
        collapseBottom : 'Thu gọn bảng phía dưới',
        expandLeft     : 'Mở rộng bảng bên trái',
        expandRight    : 'Mở rộng bảng bên phải',
        expandTop      : 'Mở rộng bảng phía trên',
        expandBottom   : 'Mở rộng bảng phía dưới'
    },

    TabPanel : {
        containsInvalidFields : 'Tab chứa các trường không hợp lệ'
    },

    Toolbar : {
        showOverflowingItems : 'Hiển thị các mục tràn',
        scrollForMore        : 'Cuộn để xem thêm'
    },

    UndoRedo : {
        Undo           : 'Hoàn tác',
        Redo           : 'Làm lại',
        UndoLastAction : 'Hoàn tác hành động cuối cùng',
        RedoLastAction : 'Làm lại hành động đã hoàn tác cuối cùng',
        NoActions      : 'Không có mục nào trong hàng đợi hoàn tác'
    },

    FieldFilterPicker : {
        equals                 : 'bằng',
        doesNotEqual           : 'không bằng',
        isEmpty                : 'trống rỗng',
        isNotEmpty             : 'không trống rỗng',
        contains               : 'chứa',
        doesNotContain         : 'không chứa',
        startsWith             : 'bắt đầu với',
        endsWith               : 'kết thúc với',
        isOneOf                : 'là một trong những',
        isNotOneOf             : 'không phải là một trong những',
        isGreaterThan          : 'lớn hơn',
        isLessThan             : 'nhỏ hơn',
        isGreaterThanOrEqualTo : 'lớn hơn hoặc bằng',
        isLessThanOrEqualTo    : 'nhỏ hơn hoặc bằng',
        isBetween              : 'ở giữa',
        isNotBetween           : 'không ở giữa',
        isBefore               : 'trước',
        isAfter                : 'sau',
        timeEquals             : 'thời gian bằng',
        timeDoesNotEqual       : 'thời gian không bằng',
        isToday                : 'hôm nay',
        isTomorrow             : 'ngày mai',
        isYesterday            : 'hôm qua',
        isThisWeek             : 'tuần này',
        isNextWeek             : 'tuần sau',
        isLastWeek             : 'tuần trước',
        isThisMonth            : 'tháng này',
        isNextMonth            : 'tháng sau',
        isLastMonth            : 'tháng trước',
        isThisYear             : 'năm nay',
        isNextYear             : 'năm sau',
        isLastYear             : 'năm trước',
        isYearToDate           : 'năm cho đến nay',
        isTrue                 : 'đúng',
        isFalse                : 'sai',
        selectAProperty        : 'Chọn một tài sản',
        selectAnOperator       : 'Chọn một nhà điều hành',
        caseSensitive          : 'Phân biệt chữ hoa chữ thường',
        and                    : 'và',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Chọn một giá trị',
        selectOneOrMoreValues  : 'Chọn một hoặc nhiều giá trị',
        enterAValue            : 'Nhập một giá trị',
        enterANumber           : 'Nhập một số',
        selectADate            : 'Nhập một ngày',
        selectATime            : 'Chọn thời gian'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Thêm bộ lọc',
        applyCond : applied => applied ? 'Bỏ qua bộ lọc (hiện đang áp dụng)' : 'Áp dụng bộ lọc (hiện đang bỏ qua)'
    },

    DateHelper : {
        locale         : 'vi',
        weekStartDay   : 1,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : 'milligiây', plural : 'ms', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'giây', plural : 'giây', abbrev : 'sec' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'phút', plural : 'phút', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'giờ', plural : 'giờ', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'ngày', plural : 'ngày', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'tuần', plural : 'tuần', abbrev : 'w' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'tháng', plural : 'tháng', abbrev : 'mon' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'quý', plural : 'quý', abbrev : 'q' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'năm', plural : 'năm', abbrev : 'yr' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'thậpkỷ', plural : 'thậpkỷ', abbrev : 'dec' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil'],
            [],
            ['s', 'sec'],
            [],
            ['m', 'min'],
            [],
            ['h', 'hr'],
            [],
            ['d'],
            [],
            ['w', 'wk'],
            [],
            ['mo', 'mon', 'mnt'],
            [],
            ['q', 'quar', 'qrt'],
            [],
            ['y', 'yr'],
            [],
            ['dec'],
            []
        ],
        parsers : {
            L   : 'DD/MM/YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number,
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `thập niên ${year - (year % 10)}`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
