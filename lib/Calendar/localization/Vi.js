import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Vi.js';

const locale = {

    localeName : 'Vi',
    localeDesc : 'Tiếng Việt',
    localeCode : 'vi',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Lịch',
        'All day' : 'Cả ngày',
        day       : 'Ngày',
        week      : 'Tuần',
        month     : 'Tháng',
        year      : 'Năm',
        decade    : 'Thập kỷ'
    },

    EventMenu : {
        duplicateEvent : 'Sự kiện lặp lại',
        copy           : 'sao chép'
    },

    Calendar : {
        toggleSidebar : 'Chuyển đổi tính hiển thị của thanh bên',
        Today         : 'Hôm nay',
        Tomorrow      : 'Ngày mai',
        next          : range => `Sau ${range}`,
        previous      : range => `Trước ${range}`,
        plusMore      : value => `+ thêm ${value}`,
        moreEvents    : value => `${value} sự kiện khác`,
        allDay        : 'Cả ngày',
        endsOn        : d => `Kết thúc vào ngày ${d}`,
        weekOfYear    : ([y, w]) => `Tuần trong năm${w}, ${y}`,
        loadFail      : 'Tải dữ liệu lịch không thành công. Vui lòng liên hệ với quản trị hệ thống của quý vị',
        gotoDate      : 'Đi đến ngày',
        timeRange     : 'Khoảng thời gian',
        noResources   : 'Không có tài nguyên',
        calendar      : 'Lịch',
        toolbar       : 'Thanh công cụ Lịch',
        months        : 'Tháng'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Giữ nút CTRL cho một sự kiện lặp lại'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'không'} sự kiện`,
        allDayEventCount : count => `${count || 'Không có'} sự kiện cả ngày${count === 1 ? '' : ''}`
    },

    EventTip : {
        'Edit event' : 'Chỉnh sửa sự kiện',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Bao gồm những ngày cuối tuần',
        weekends        : 'Những ngày cuối tuần',
        switcherMenu    : 'Menu chuyển đổi chế độ xem'
    },

    AgendaView : {
        Agenda : 'Lịch trình'
    },

    MonthView : {
        Month     : 'Tháng',
        monthUnit : 'Đơn vị tháng'
    },

    MultiWeekView : {
        multiWeek : 'Nhiều tuần'
    },

    WeekView : {
        weekUnit : 'Đơn vị tuần'
    },

    YearView : {
        Year     : 'Năm',
        yearUnit : 'Đơn vị năm',
        noEvents : 'Không có sự kiện'
    },

    YearPlanner : {
        yearPlanner      : 'Kế hoạch năm',
        expandMonthRow   : 'Mở rộng hàng tháng',
        collapseMonthRow : 'Thu gọn hàng tháng'
    },

    EventList : {
        List   : 'Danh sách',
        Start  : 'Bắt đầu',
        Finish : 'Kết thúc',
        days   : count => `${count} ngày`
    },

    DayView : {
        Day                : 'Ngày',
        dayUnit            : 'Đơn vị ngày',
        daysUnit           : 'Đơn vị ngày',
        expandAllDayRow    : 'Mở rộng phần cả ngày',
        collapseAllDayRow  : 'Thu gọn phần cả ngày',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Không có ngày phù hợp'
    },

    DayAgendaView : {
        dayAgenda : 'Lịch trình trong ngày'
    },

    DayResourceView : {
        dayResourceView : 'Nguồn tài nguyên hàng ngày'
    },

    MonthGrid : {
        monthGrid : 'Lưới tháng'
    },

    Sidebar : {
        selectDate      : 'Chọn ngày trên lịch',
        matchEvents     : 'Sự kiện trận đấu',
        filterEvents    : 'Lọc sự kiện theo tên sự kiện',
        filterResources : 'Lọc sự kiện theo tài nguyên đã chọn'
    },

    WeekExpander : {
        expandTip   : 'Nhấp để mở rộng hàng',
        collapseTip : 'Nhấp để thu gọn hàng'
    },

    keyboardActions : {
        title   : 'Hành động bàn phím',
        content : 'Hiển thị bảng trợ giúp : [?]\nNút chọn chế độ tập trung : [Home]\nThay đổi chế độ xem : [1] đến [9] hoặc chữ cái đầu tiên của văn bản nút chọn\nKhoảng thời gian tiếp theo : [n]\nKhoảng thời gian trước đó : [p]\nĐi đến hôm nay : [t]\nĐi đến ngày : [g]\nĐi đến ô ngày hiện tại : [CTRL]+[d]\nDi chuyển giữa các sự kiện : [TAB]\nTập trung vào ô lọc sự kiện bên : [/]\nTạo sự kiện mới (tập trung vào ô ngày) : [ENTER]\nXóa sự kiện đang tập trung : [DELETE]/[BACKSPACE]\nChỉnh sửa sự kiện đang tập trung : [ENTER]\nGọi menu ngữ cảnh trên sự kiện hoặc ô : [SHIFT+F10]/[SPACE]\nTập trung từ sự kiện lên ô bao quanh : [ESCAPE]\nDi chuyển giữa các ô : [↑]/[↓]/[←]/[→]\nKích hoạt menu phạm vi (trong chế độ xem Lịch trình) : [CTRL]+[r]\nCắt, sao chép, dán sự kiện : [CTRL]+[x]/[c]/[v]\nPhóng to/thu nhỏ chỉ chế độ xem Ngày : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
