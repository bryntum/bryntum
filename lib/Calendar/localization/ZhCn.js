import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/ZhCn.js';

const locale = {

    localeName : 'ZhCn',
    localeDesc : '中文（中国）',
    localeCode : 'zh-CN',
    localeRtl  : false,

    EventEdit : {
        Calendar  : '日历',
        'All day' : '全天',
        day       : '日',
        week      : '周',
        month     : '月',
        year      : '年',
        decade    : '十年'
    },

    EventMenu : {
        duplicateEvent : '重复性事件',
        copy           : '复制'
    },

    Calendar : {
        toggleSidebar : '切换侧边栏可见性',
        Today         : '今天',
        Tomorrow      : '明天',
        next          : range => `下一 ${range}`,
        previous      : range => `上一 ${range}`,
        plusMore      : value => `+${value} 更多`,
        moreEvents    : value => `${value} 个更多事件`,
        allDay        : '全天',
        endsOn        : d => `结束 ${d}`,
        weekOfYear    : ([y, w]) => `周 ${w}, ${y}`,
        loadFail      : '日历数据加载失败。请联系系统管理员',
        gotoDate      : '跳转到日期',
        timeRange     : '时间范围',
        noResources   : '无资源',
        calendar      : '日历',
        toolbar       : '日历工具栏',
        months        : '月份'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : '按住CTRL键以重复事件'
    },

    CalendarMixin : {
        eventCount       : count => `${count || '无'}事件`,
        allDayEventCount : count => `${count || '无'} 全天事件${count === 1 ? '' : '个'}`
    },

    EventTip : {
        'Edit event' : '编辑事件',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : '包括周末',
        weekends        : '周末',
        switcherMenu    : '视图切换菜单'
    },

    AgendaView : {
        Agenda : '日程'
    },

    MonthView : {
        Month     : '月',
        monthUnit : '月'
    },

    MultiWeekView : {
        multiWeek : '多周'
    },

    WeekView : {
        weekUnit : '周'
    },

    YearView : {
        Year     : '年',
        yearUnit : '年',
        noEvents : '没有活动'
    },

    YearPlanner : {
        yearPlanner      : '年度计划',
        expandMonthRow   : '展开月份行',
        collapseMonthRow : '折叠月份行'
    },

    EventList : {
        List   : '列表',
        Start  : '开始',
        Finish : '完成',
        days   : count => `${count}天`
    },

    DayView : {
        Day                : '日',
        dayUnit            : '天',
        daysUnit           : '天',
        expandAllDayRow    : '展开全天内容',
        collapseAllDayRow  : '折叠全天内容',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : '没有匹配的日期'
    },

    DayAgendaView : {
        dayAgenda : '日程安排'
    },

    DayResourceView : {
        dayResourceView : '日资源'
    },

    MonthGrid : {
        monthGrid : '月份网格'
    },

    Sidebar : {
        selectDate      : '选择日历日期',
        matchEvents     : '比赛事件',
        filterEvents    : '按事件名称筛选事件',
        filterResources : '按所选资源筛选事件'
    },

    WeekExpander : {
        expandTip   : '展开提示',
        collapseTip : '折叠提示'
    },

    keyboardActions : {
        title   : '键盘操作',
        content : '显示帮助面板 : [?]\n聚焦模式选择按钮 : [Home]\n更改视图 : [1] 到 [9] 或选择器按钮文本的首字母\n下一个时间跨度 : [n]\n上一个时间跨度 : [p]\n转到今天 : [t]\n导航到日期 : [g]\n转到当前日期的单元格 : [CTRL]+[d]\n在事件之间导航 : [TAB]\n聚焦侧边栏事件过滤器输入 : [/]\n创建新事件（聚焦于日期单元格） : [ENTER]\n删除聚焦的事件 : [DELETE]/[BACKSPACE]\n编辑聚焦的事件 : [ENTER]\n在事件或单元格上调用上下文菜单 : [SHIFT+F10]/[SPACE]\n从事件聚焦到包含的单元格 : [ESCAPE]\n单元格之间导航 : [↑]/[↓]/[←]/[→]\n激活范围菜单（在议程视图中） : [CTRL]+[r]\n剪切、复制、粘贴事件 : [CTRL]+[x]/[c]/[v]\n仅在日视图中放大/缩小 : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
