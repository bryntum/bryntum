import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/ZhTw.js';

const locale = {

    localeName : 'ZhTw',
    localeDesc : '繁體中文 (台灣)',
    localeCode : 'zh-TW',
    localeRtl  : false,

    EventEdit : {
        Calendar  : '行事曆',
        'All day' : '整日',
        day       : '日',
        week      : '週',
        month     : '月',
        year      : '年',
        decade    : '十年'
    },

    EventMenu : {
        duplicateEvent : '複製事件',
        copy           : '複製'
    },

    Calendar : {
        toggleSidebar : '切換側邊欄可見性',
        Today         : '今天',
        Tomorrow      : '明天',
        next          : range => `下一個 ${range}`,
        previous      : range => `上一個 ${range}`,
        plusMore      : value => `+${value} 更多`,
        moreEvents    : value => `另外 ${value} 個事件`,
        allDay        : '整日',
        endsOn        : d => `結束 ${d}`,
        weekOfYear    : ([y, w]) => `週 ${w}, ${y}`,
        loadFail      : '行事曆資料載入失敗。請聯絡您的系統管理者',
        gotoDate      : '前往日期',
        timeRange     : '時間範圍',
        noResources   : '無資源',
        calendar      : '日曆',
        toolbar       : '日曆工具列',
        months        : '月份'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : '按下CTRL循環事件'
    },

    CalendarMixin : {
        eventCount       : count => `${count || '否'} 事件${count === 1 ? '' : '秒'}`,
        allDayEventCount : count => `${count || '無'} 全天事件${count === 1 ? '' : 's'}`
    },

    EventTip : {
        'Edit event' : '編輯事件',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : '包含週末',
        weekends        : '週末',
        switcherMenu    : '檢視切換選單'
    },

    AgendaView : {
        Agenda : '行程'
    },

    MonthView : {
        Month     : '月',
        monthUnit : '個月'
    },

    MultiWeekView : {
        multiWeek : '多週'
    },

    WeekView : {
        weekUnit : '個週'
    },

    YearView : {
        Year     : '年',
        yearUnit : '年',
        noEvents : '無事件'
    },

    YearPlanner : {
        yearPlanner      : '年度計劃',
        expandMonthRow   : '展開月份行',
        collapseMonthRow : '收起月份行'
    },

    EventList : {
        List   : '列表',
        Start  : '開始',
        Finish : '結束',
        days   : count => `${count > 1 ? `${count} ` : ''}天${count === 1 ? '' : '秒'}`
    },

    DayView : {
        Day                : '天',
        dayUnit            : '天',
        daysUnit           : '天',
        expandAllDayRow    : '展開整日區段',
        collapseAllDayRow  : '摺叠整日區段',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : '沒有匹配的日期'
    },

    DayAgendaView : {
        dayAgenda : '行程表'
    },

    DayResourceView : {
        dayResourceView : '日資源'
    },

    MonthGrid : {
        monthGrid : '月份網格'
    },

    Sidebar : {
        selectDate      : '選擇日曆日期',
        matchEvents     : '比賽事件',
        filterEvents    : '按事件名稱篩選事件',
        filterResources : '按選擇的資源篩選事件'
    },

    WeekExpander : {
        expandTip   : '點擊擴展列',
        collapseTip : '點擊縮回列'
    },

    keyboardActions : {
        title   : '鍵盤操作',
        content : '顯示幫助面板 : [?]\n焦點模式選擇按鈕 : [Home]\n更改視圖 : [1] 至 [9] 或選擇按鈕文字的首字母\n下一時間範圍 : [n]\n上一時間範圍 : [p]\n跳至今天 : [t]\n導航至日期 : [g]\n跳至當前日期的單元格 : [CTRL]+[d]\n在事件之間導航 : [TAB]\n焦點側邊欄事件篩選輸入 : [/]\n創建新事件（聚焦於日期單元格） : [ENTER]\n刪除聚焦事件 : [DELETE]/[BACKSPACE]\n編輯聚焦事件 : [ENTER]\n在事件或單元格上調用上下文菜單 : [SHIFT+F10]/[SPACE]\n從事件聚焦到包含的單元格 : [ESCAPE]\n單元格到單元格導航 : [↑]/[↓]/[←]/[→]\n激活範圍菜單（在議程視圖中） : [CTRL]+[r]\n剪切、複製、粘貼事件 : [CTRL]+[x]/[c]/[v]\n僅在日視圖中縮放 : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
