import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/ZhTw.js';
import '../../Grid/localization/ZhTw.js';

const locale = {

    localeName : 'ZhTw',
    localeDesc : '繁體中文 (台灣)',
    localeCode : 'zh-TW',
    localeRtl  : false,

    Object : {
        newEvent    : '新增事件',
        information : '資訊',
        showDetails : '顯示詳細資料'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' 事件' + (data !== 1 ? '秒' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : '切換資源佈局列。按 SPACE 開啟上下文選單。'
    },

    Dependencies : {
        from    : '從',
        to      : '到',
        valid   : '有效',
        invalid : '無效'
    },

    DependencyType : {
        SS           : '開始到開始',
        SF           : '開始到完成',
        FS           : '完成到開始',
        FF           : '完成到完成',
        StartToStart : '開始到開始',
        StartToEnd   : '開始到完成',
        EndToStart   : '完成到開始',
        EndToEnd     : '完成到完成',
        short        : [
            '開始到開始',
            '開始到完成',
            '完成到開始',
            '完成到完成'
        ],
        long : [
            '開始到開始',
            '開始到完成',
            '完成到開始',
            '完成到完成'
        ]
    },

    DependencyEdit : {
        From              : '從',
        To                : '到',
        Type              : '類型',
        Lag               : '滯後',
        color             : '顏色',
        lineStyle         : '線條樣式',
        solid             : '實線',
        dashed            : '虛線',
        dotted            : '點線',
        dashDot           : '虛點線',
        longDash          : '長虛線',
        'Edit dependency' : '編輯相依性',
        Save              : '儲存',
        Delete            : '刪除',
        Cancel            : '取消',
        StartToStart      : '開始到開始',
        StartToEnd        : '開始到結束',
        EndToStart        : '結束到開始',
        EndToEnd          : '結束到結束',
        Active            : '使用中'
    },

    EventEdit : {
        Name           : '名稱',
        Resource       : '資源',
        Start          : '開始',
        startTime      : '開始時間',
        End            : '結束',
        endTime        : '結束時間',
        Save           : '儲存',
        Delete         : '刪除',
        Cancel         : '取消',
        'Edit event'   : '編輯事件',
        Repeat         : '重複',
        editRecurrence : '編輯重複'
    },

    EventDrag : {
        eventOverlapsExisting   : '事件與此資源的現有事件重疊',
        noDropOutsideTimeline   : '事件可能無法在時間表外完整清除',
        duplicateAssignmentDrag : '事件不能多次分配給同一資源'
    },

    SchedulerBase : {
        'Add event'      : '新增事件',
        'Delete event'   : '刪除事件',
        'Unassign event' : '取消指派事件',
        color            : '色彩',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}，開始於 ${startDate} ${eventRecord.duration > 0 ? `持續 ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : '縮放',
        activeDateRange : '日期範圍',
        startText       : '開始日期',
        endText         : '結束日期',
        todayText       : '今天'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `時間軸顯示從 ${startDate} 到 ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : '複製事件',
        cutEvent   : '剪下事件',
        pasteEvent : '貼上事件'
    },

    EventFilter : {
        filterEvents : '篩選工作',
        byName       : '依名稱'
    },

    TimeRanges : {
        showCurrentTimeLine : '顯示目前時間表'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : '秒'
        },
        minuteAndHour : {
            topDateFormat     : 'MM/DD，ddd，hA',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'MM/DD，ddd',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : '天'
        },
        day : {
            name : '天/小時'
        },
        week : {
            name : '週/小時'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : '週/天'
        },
        dayAndMonth : {
            name : '月'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : '週'
        },
        weekAndMonth : {
            name : '週'
        },
        weekAndDayLetter : {
            name : '週/工作日'
        },
        weekDateAndMonth : {
            name : '月/週'
        },
        monthAndYear : {
            name : '月'
        },
        year : {
            name : '年'
        },
        manyYears : {
            name : '多年'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : '您正在刪除事件',
        'delete-all-message'        : '您想要刪除此事件的所有發生次數嗎?',
        'delete-further-message'    : '您想要刪除此事件的此次及之後的所有未來事件，還是僅刪除選取的事件?',
        'delete-only-this-message'  : '您要删除此事件的这一发生吗？',
        'delete-further-btn-text'   : '刪除所有未來事件',
        'delete-only-this-btn-text' : '僅刪除此事件',
        'update-title'              : '您正在變更重複事件',
        'update-all-message'        : '您想要變更此事件的所有發生次數嗎?',
        'update-further-message'    : '您只要變更事件的這次發生，還是變更這一次及之後的所有未來事件?',
        'update-only-this-message'  : '您要更改此事件的这一发生吗？',
        'update-further-btn-text'   : '所有未來事件',
        'update-only-this-btn-text' : '僅此事件',
        Yes                         : '是',
        Cancel                      : '取消',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' 和 ',
        Daily                           : '每天',
        'Weekly on {1}'                 : ({ days }) => `每周在 ${days}`,
        'Monthly on {1}'                : ({ days }) => `每月在 ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `每年在 ${months} 的 ${days}`,
        'Every {0} days'                : ({ interval }) => `每隔 ${interval} 天`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `每隔 ${days} 週的${interval}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `每隔 ${interval} 個月的${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `每隔 ${interval} 年 ${months} 的${days}`,
        position1                       : '第一個',
        position2                       : '第二個',
        position3                       : '第三個',
        position4                       : '第四個',
        position5                       : '第五個',
        'position-1'                    : '最後一個',
        day                             : '天',
        weekday                         : '工作日',
        'weekend day'                   : '週末',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : '重複事件',
        Cancel              : '取消',
        Save                : '儲存',
        Frequency           : '頻率',
        Every               : '每隔',
        DAILYintervalUnit   : '天',
        WEEKLYintervalUnit  : '週',
        MONTHLYintervalUnit : '個月',
        YEARLYintervalUnit  : '年',
        Each                : '每個',
        on                  : '在',
        the                 : '在',
        'On the'            : '在',
        'End repeat'        : '結束重複',
        'time(s)'           : '次',
        Days                : '天',
        Months              : '個月的'
    },

    RecurrenceDaysCombo : {
        day           : '天',
        weekday       : '工作日',
        'weekend day' : '週末'
    },

    RecurrencePositionsCombo : {
        position1    : '第一次',
        position2    : 'second',
        position3    : '第三',
        position4    : '第四',
        position5    : '第五',
        'position-1' : '最後'
    },

    RecurrenceStopConditionCombo : {
        Never     : '永不',
        After     : '之後',
        'On date' : '於日期'
    },

    RecurrenceFrequencyCombo : {
        None    : '沒有重複',
        Daily   : '每天',
        Weekly  : '每週{0}',
        Monthly : '每月',
        Yearly  : '每年'
    },

    RecurrenceCombo : {
        None   : '無',
        Custom : '自訂...'
    },

    Summary : {
        'Summary for' : date => `总结 ${date}`
    },

    ScheduleRangeCombo : {
        completeview : '完整排程',
        currentview  : '可見排程',
        daterange    : '日期範圍',
        completedata : '完整排程 (所有事件)'
    },

    SchedulerExportDialog : {
        'Schedule range' : '排程範圍',
        'Export from'    : '從',
        'Export to'      : '到'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : '單頁'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : '單頁（未縮放）'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : '多頁（垂直）'
    },

    ExcelExporter : {
        'No resource assigned' : '未指派任何資源'
    },

    CrudManagerView : {
        serverResponseLabel : '伺服器回覆:'
    },

    DurationColumn : {
        Duration : '期間'
    },

    EventClusteringBase : {
        unnamed         : '未命名',
        more            : count => `+ 另外 ${count} 個`,
        clusteredEvents : count => `${count} 個群集事件`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} 個群集範圍`
    },

    ConstraintTypePicker : {
        none                : '無',
        assoonaspossible    : '越快越好',
        aslateaspossible    : '越晚越好',
        muststarton         : '必須於下列時間開始',
        mustfinishon        : '必須於下列時間完成',
        startnoearlierthan  : '最早開始時間',
        startnolaterthan    : '最晚開始時間',
        finishnoearlierthan : '最早完成時間',
        finishnolaterthan   : '最晚完成時間'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} 活動前的緩衝時間`;
            }
            if (postamble) {
                description += `.${postamble.toString()} 活動後的緩衝時間`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : '向前',
        Backward      : '反向',
        inheritedFrom : '繼承自',
        enforcedBy    : '強制執行者'
    },

    CalendarField : {
        'Default calendar' : '預設行事曆',
        editCalendar       : '编辑日历'
    },

    TaskEditorBase : {
        Information   : '任務資訊',
        Save          : '儲存',
        Cancel        : '取消',
        Delete        : '刪除',
        calculateMask : '正在計算...',
        saveError     : '無法儲存，請先更正錯誤',
        repeatingInfo : '正在檢視重複事件',
        editRepeating : '編輯'
    },

    TaskEdit : {
        editEvent              : '编辑活动',
        ConfirmDeletionTitle   : '確認刪除',
        ConfirmDeletionMessage : '您確定要刪除事件嗎?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '35em'
    },

    SchedulerGeneralTab : {
        General      : '一般',
        Name         : '名稱',
        Resources    : '資源',
        '% complete' : '完成百分比',
        Duration     : '期間',
        Start        : '開始',
        Finish       : '結束',
        Effort       : '工作量',
        Preamble     : '前文',
        Postamble    : '後文'
    },

    GeneralTab : {
        General      : '一般',
        Name         : '名稱',
        '% complete' : '完成百分比',
        Duration     : '期間',
        Start        : '開始',
        Finish       : '結束',
        Effort       : '工作量',
        Dates        : '日期'
    },

    SchedulerAdvancedTab : {
        Advanced                   : '進階',
        Calendar                   : '行事曆',
        'Scheduling mode'          : '排程模式',
        'Effort driven'            : '工作量驅動',
        'Manually scheduled'       : '手動排程',
        'Constraint type'          : '限制類型',
        'Constraint date'          : '限制日期',
        Inactive                   : '不活動',
        'Ignore resource calendar' : '忽略資源行事曆'
    },

    CalendarEditorDatePicker : {
        addException : '添加例外',
        addWeek      : '添加周数'
    },

    CalendarEditorExceptionTab : {
        addException    : '添加例外',
        removeException : '移除异常',
        noRows          : '没有添加例外'
    },

    CalendarEditorWeekTab : {
        addWeek    : '添加周数',
        removeWeek : '删除星期'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : '默认工作日',
        workingTimeCalendar        : '工作时间日历',
        exceptions                 : '例外情况',
        general                    : '一般的',
        name                       : '姓名',
        parent                     : '家长',
        save                       : '节省',
        weeks                      : '周数',
        error                      : '错误',
        inputErrors                : '有输入错误。请在保存更改之前修复它们。',
        delete                     : '删除',
        addCalendar                : '添加日历',
        confirmation               : '确认',
        removeCalendarWithChildren : '该日历有子日历。单击"是"删除日历及其子日历。',
        removeCalendarAndLinks     : '某些记录使用日历。单击"是"取消链接并删除日历。',
        newException               : '新異常',
        newWeek                    : '新的一周'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' 工作中',
        isNotWorking : ' 不管用',
        basedOn      : ' 基于：',
        byDefault    : '默认情况下',
        rangeTpl     : (start, end) => `${start} - ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : '工作日',
        nonWorkingDay : '非工作日'
    },

    AvailabilityRangeError : {
        errorOverlap       : '存在重叠范围',
        errorMissingDate   : '需要开始和结束时间',
        errorStartAfterEnd : '开始时间不能晚于结束时间'
    },

    CalendarEditorExceptionPanel : {
        name                                 : '姓名',
        from                                 : '从',
        to                                   : '到',
        is                                   : '是',
        nonWorking                           : '非工作状态',
        working                              : '在职的',
        hours                                : '小时',
        repeat                               : '重复',
        repeatEnd                            : '重复结束',
        errorMissingDate                     : '需要例外日期范围',
        errorStartAfterEnd                   : '"开始"日期不能晚于"结束"日期',
        errorStartAndEndRepeatNumberMismatch : '异常开始和结束的次数应该相同'
    },

    CalendarEditorWeekPanel : {
        name        : '姓名',
        from        : '从',
        to          : '到',
        days        : '天',
        copyDay     : '复制日',
        pasteDay    : '粘贴日',
        stopCopying : '停止复制'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : '添加范围',
        removeRange : '删除范围'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"开始"日期不能晚于"结束"日期',
        errorNoDefaultWeek           : '需要周配置',
        errorMultipleDefaultWeeks    : '指定了超过一周的默认值',
        errorNoWeekAvailability      : '每周必须提供一些工作时间',
        errorInvalidWeekAvailability : '周有工作时间配置错误',
        noRows                       : '没有添加周数'
    },

    AdvancedTab : {
        Advanced                   : '進階',
        Calendar                   : '行事曆',
        'Scheduling mode'          : '排程模式',
        'Effort driven'            : '工作量驅動',
        'Manually scheduled'       : '手動排程',
        'Constraint type'          : '限制類型',
        'Constraint date'          : '限制日期',
        Constraint                 : '限制',
        Rollup                     : '總計',
        Inactive                   : '不活動',
        'Ignore resource calendar' : '忽略資源行事曆',
        'Scheduling direction'     : '排程方向',
        projectBorder              : '项目边框',
        ignore                     : '忽略',
        honor                      : '荣誉',
        askUser                    : '询问用户'
    },

    DependencyTab : {
        Predecessors      : '前導子',
        Successors        : '後繼子',
        ID                : '識別碼',
        Name              : '名稱',
        Type              : '類型',
        Lag               : '滯後',
        cyclicDependency  : '循環相依性',
        invalidDependency : '無效相依性',
        readOnlyTask      : '無法連結唯讀任務'
    },

    NotesTab : {
        Notes : '附注'
    },

    ResourceCalendarColumn : {
        calendar : '日历'
    },

    ResourceEdit : {
        editResource : '編輯資源'
    },

    ResourceEditor : {
        resourceInformation : '資源資訊',
        costs               : '成本',
        save                : '節省',
        error               : '錯誤',
        inputErrors         : '有輸入錯誤。請在儲存變更之前修復它們。',
        delete              : '刪除',
        confirmation        : '確認',
        removeUsedResource  : '資源被指派給某些任務。按一下「是」仍會刪除該資源。'
    },

    ResourceEditorGeneralTab : {
        calendar    : '日曆',
        general     : '一般的',
        label       : '材質標籤',
        name        : '資源名稱',
        type        : '類型',
        costAccrual : '應計成本',
        labelHint   : '例如，公斤、噸或箱',
        maxUnits    : '最大單位'
    },

    ResourceCostAccrualColumn : {
        accrueAt : '累積於',
        prorated : '按比例分配',
        start    : '開始',
        end      : '結尾'
    },

    CostAccrualField : {
        prorated : '按比例分配',
        start    : '開始',
        end      : '結尾'
    },

    ResourceType : {
        work     : '工作',
        material : '材料',
        cost     : '成本'
    },

    ResourceTypeColumn : {
        type : '類型'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : '費率表',
        newGroup     : '新表',
        removeGroup  : '刪除表格',
        useByDefault : '預設用於資源分配',
        noRates      : '無費率'
    },

    ResourceGrid : {
        name          : '姓名',
        materialLabel : '材質標籤',
        maxUnits      : '最大單位',
        cost          : '成本',
        noRows        : '沒有資源'
    },

    ResourceRateTableContainer : {
        startDate    : '開始日期',
        standardRate : '標準費率',
        perUseCost   : '每次使用費用',
        addRate      : '添加率',
        removeRate   : '去除率',
        name         : '姓名',
        noRates      : '無費率'
    },

    ResourceRateTableEditor : {
        rateTableInformation : '費率表資訊'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : '數量',
        Resources   : '資源',
        Resource    : '資源',
        Units       : '單位',
        cost        : '成本',
        effort      : '努力',
        start       : '開始',
        finish      : '結束',
        preamble    : '前言',
        postamble   : '後記'
    },

    RateTableColumn : {
        rateTable : '費率表'
    },

    RecurrenceTab : {
        title : '重複'
    },

    SchedulingModePicker : {
        Normal           : '正常',
        'Fixed Duration' : '固定期間',
        'Fixed Units'    : '固定單位',
        'Fixed Effort'   : '固定投入'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} 的 {available}</span> 已指派',
        barTipOnDate          : '<b>{resource}</b> 在 {startDate}<br><span class="{cls}">{allocated} 的 {available}</span> 已指派',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} 的 {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} 的 {available}</span> 已指派:<br>{assignments}',
        groupBarTipOnDate     : '在 {startDate}<br><span class="{cls}">{allocated} 的 {available}</span> 已指派:<br>{assignments}',
        plusMore              : '+{value} 更多'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">努力</div><div class="b-effort-value {cls}">{allocated} / {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">努力</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">成本</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">數量</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} 於 {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">摘要 {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">摘要 {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} 更多',
        nameColumnText        : '資源 / 事件'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : '取消變更，不執行任何操作',
        schedulingConflict : '排程發生衝突',
        emptyCalendar      : '行事曆設定錯誤',
        cycle              : '排程週期',
        Apply              : '套用'
    },

    CycleResolutionPopup : {
        dependencyLabel        : '請選取相依性:',
        invalidDependencyLabel : '涉及的無效相依性需要解決:'
    },

    SchedulerProBase : {
        propagating     : '正在計算專案',
        storePopulation : '正在載入資料',
        finalizing      : '正在完成結果'
    },

    EventSegments : {
        splitEvent    : '分割事件',
        renameSegment : '重新命名'
    },

    NestedEvents : {
        createGroup         : '群組選定的事件',
        newGroupName        : '新群組',
        deNestingNotAllowed : '不允許取消巢狀結構',
        nestingNotAllowed   : '不允許巢狀結構'
    },

    VersionGrid : {
        compare       : '比較',
        description   : '描述',
        occurredAt    : '出現在',
        rename        : '重新命名',
        restore       : '復原',
        stopComparing : '停止比較'
    },

    Versions : {
        entityNames : {
            TaskModel       : '工作',
            AssignmentModel : '指派',
            DependencyModel : '連結',
            ProjectModel    : '專案',
            ResourceModel   : '資源',
            other           : '物件'
        },
        entityNamesPlural : {
            TaskModel       : '工作',
            AssignmentModel : '指派',
            DependencyModel : '連結',
            ProjectModel    : '專案',
            ResourceModel   : '資源',
            other           : '物件'
        },
        transactionDescriptions : {
            update : '已變更 {n} {entities}',
            add    : '已新增 {n} {entities}',
            remove : '已移除 {n} {entities}',
            move   : '已移動 {n} {entities}',
            mixed  : '已變更 {n} {entities}'
        },
        propertyNames : {
            active                   : '啟用',
            allDay                   : '全天',
            allowOverlap             : '允許重疊',
            barMargin                : '條形圖邊距',
            bidirectional            : '雙向',
            calendar                 : '日曆',
            cls                      : 'CSS 類別',
            constraintDate           : '限制日期',
            constraintType           : '限制類型',
            daysPerMonth             : '每月天數',
            daysPerWeek              : '每週天數',
            delayFromParent          : '與父項的延遲',
            direction                : '方向',
            drawDependencies         : '繪製依賴關係',
            duration                 : '持續時間',
            durationUnit             : '持續時間單位',
            effort                   : '努力',
            effortDriven             : '努力驅動',
            effortUnit               : '努力單位',
            endDate                  : '結束日期',
            eventColor               : '顏色',
            eventId                  : '事件 ID',
            eventLayout              : '事件佈局',
            eventStyle               : '條形圖樣式',
            exceptionDates           : '例外日期',
            fixed                    : '固定',
            from                     : '從',
            fromSide                 : '從側面',
            hoursPerDay              : '每天小時數',
            href                     : '連結',
            iconCls                  : '圖標',
            id                       : 'ID',
            ignoreResourceCalendar   : '忽略資源日曆',
            ignoreTimeZone           : '忽略時區',
            image                    : '圖片',
            imageUrl                 : '圖片 URL',
            inactive                 : '未啟用',
            intervals                : '間隔',
            lag                      : '延遲',
            lagUnit                  : '延遲單位',
            lineStyle                : '線條樣式',
            manuallyScheduled        : '手動排程',
            milestoneWidth           : '里程碑寬度',
            name                     : '名稱',
            note                     : '備註',
            parentId                 : '父項 ID',
            parentIndex              : '位置',
            percentDone              : '完成百分比',
            postamble                : '後置',
            preamble                 : '前置',
            readOnly                 : '唯讀',
            recurrenceRule           : '重複規則',
            resourceId               : '資源 ID',
            resourceMargin           : '資源邊距',
            rowHeight                : '行高',
            schedulingMode           : '排程模式',
            segments                 : '段落',
            showAvatar               : '顯示頭像',
            showInTimeline           : '在時間軸中顯示',
            startDate                : '開始日期',
            stickyContents           : '固定內容',
            strokeColor              : '線條顏色',
            style                    : '樣式',
            target                   : '連結目標',
            to                       : '到',
            toSide                   : '到側面',
            type                     : '類型',
            units                    : '單位',
            unscheduled              : '未排程',
            unspecifiedTimeIsWorking : '未指定時間為工作時間',
            version                  : '版本'
        },
        intervals : {
            working    : '工作中',
            nonWorking : '非工作中',
            fromTo     : '從 {from} 到 {to}',
            recurring  : '從 {start} 開始重複，結束於 {end}'
        },
        addEntity         : '已新增 {type} **{name}**',
        removeEntity      : '已移除 {type} **{name}**',
        updateEntity      : '已變更 {type} **{name}**',
        moveEntity        : '已移動 {type} **{name}** 從 {from} 至 {to}',
        addDependency     : '已新增連結 **{from}** 至 **{to}**',
        removeDependency  : '移除連從 **{from}** 至 **{to}**',
        updateDependency  : '已編輯連結從 **{from}** 至 **{to}**',
        addAssignment     : '已指派 **{resource}** 至 **{event}**',
        removeAssignment  : '已移除指派的 **{resource}** 從 **{event}**',
        updateAssignment  : '已編輯指派 **{resource}** 至 **{event}**',
        noChanges         : '沒有變更',
        nullValue         : '無',
        versionDateFormat : 'YYYY/M/D a h:mm',
        savedAt           : '儲存於 {date}',
        autoSavedAt       : '自動儲存於 {date}',
        undid             : '復原變更',
        redid             : '重做變更',
        editedTask        : '已編輯的工作屬性',
        deletedTask       : '已刪除工作',
        movedTask         : '已移動一個任務',
        movedTasks        : '已移動多個任務'
    }
};

export default LocaleHelper.publishLocale(locale);
