import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/ZhCn.js';
import '../../Grid/localization/ZhCn.js';

const locale = {

    localeName : 'ZhCn',
    localeDesc : '中文（中国）',
    localeCode : 'zh-CN',
    localeRtl  : false,

    Object : {
        newEvent    : '新事件',
        information : '信息',
        showDetails : '显示详情'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' 事件'
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : '切换资源布局列。按 SPACE 打开上下文菜单。'
    },

    Dependencies : {
        from    : '从',
        to      : '至',
        valid   : '有效',
        invalid : '无效'
    },

    DependencyType : {
        SS           : 'SS',
        SF           : 'SF',
        FS           : 'FS',
        FF           : 'FF',
        StartToStart : '开始到开始',
        StartToEnd   : '开始到结束',
        EndToStart   : '结束到开始',
        EndToEnd     : '结束到结束',
        short        : [
            'SS',
            'SF',
            'FS',
            'FF'
        ],
        long : [
            '开始到开始',
            '开始到结束',
            '结束到开始',
            '结束到结束'
        ]
    },

    DependencyEdit : {
        From              : '从',
        To                : '至',
        Type              : '类型',
        Lag               : '延迟',
        color             : '颜色',
        lineStyle         : '线条样式',
        solid             : '实线',
        dashed            : '虚线',
        dotted            : '点线',
        dashDot           : '点划线',
        longDash          : '长划线',
        'Edit dependency' : '编辑依附关系',
        Save              : '保存',
        Delete            : '删除',
        Cancel            : '取消',
        StartToStart      : '开始到开始',
        StartToEnd        : '开始到结束',
        EndToStart        : '结束到开始',
        EndToEnd          : '结束到结束',
        Active            : '激活'
    },

    EventEdit : {
        Name           : '名称',
        Resource       : '资源',
        Start          : '开始',
        startTime      : '开始时间',
        End            : '结束',
        endTime        : '结束时间',
        Save           : '保存',
        Delete         : '删除',
        Cancel         : '取消',
        'Edit event'   : '编辑事件',
        Repeat         : '重复',
        editRecurrence : '编辑重复'
    },

    EventDrag : {
        eventOverlapsExisting   : '事件与该资源的现有事件重叠',
        noDropOutsideTimeline   : '事件不得完全在时间线之外',
        duplicateAssignmentDrag : '事件不能多次分配给同一资源'
    },

    SchedulerBase : {
        'Add event'      : '增添事件',
        'Delete event'   : '删除事件',
        'Unassign event' : '未安排事件',
        color            : '颜色',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, 开始于 ${startDate} ${eventRecord.duration > 0 ? `持续 ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : '放大/缩小',
        activeDateRange : '日期范围',
        startText       : '起始日期',
        endText         : '结束日期',
        todayText       : '今天'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `时间轴显示从${startDate}到${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : '复制事件',
        cutEvent   : '剪切事件',
        pasteEvent : '粘贴事件'
    },

    EventFilter : {
        filterEvents : '筛选器任务',
        byName       : '根据名称'
    },

    TimeRanges : {
        showCurrentTimeLine : '显示当前时间线'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : '秒'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd MM-DD, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd MM-DD',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : '日'
        },
        day : {
            name : '日/小时'
        },
        week : {
            name : '周/小时'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : '周/日'
        },
        dayAndMonth : {
            name : '月'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : '周'
        },
        weekAndMonth : {
            name : '周'
        },
        weekAndDayLetter : {
            name : '周/工作日'
        },
        weekDateAndMonth : {
            name : '月/周'
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
        'delete-title'              : '您在删除事件',
        'delete-all-message'        : '您是否想彻底删除此事件？',
        'delete-further-message'    : '您是想删除本次和未来的所有事件，和还是仅删除选定的一次事件?',
        'delete-only-this-message'  : '您要删除此事件的这一发生吗？',
        'delete-further-btn-text'   : '删除所有的未来事件',
        'delete-only-this-btn-text' : '仅删除此事件',
        'update-title'              : '您在变更一个重复性事件',
        'update-all-message'        : '您是否想变更所有的事件？',
        'update-further-message'    : '您是想只本更这一事件，还是本次和未来的所有事件？',
        'update-only-this-message'  : '您要更改此事件的这一发生吗？',
        'update-further-btn-text'   : '所有未来的事件',
        'update-only-this-btn-text' : '仅事件',
        Yes                         : '是',
        Cancel                      : '取消',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' 且',
        Daily                           : '每天',
        'Weekly on {1}'                 : ({ days }) => `每周 ${days}`,
        'Monthly on {1}'                : ({ days }) => `每月 ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `每年 ${days}的 ${months}`,
        'Every {0} days'                : ({ interval }) => `每 ${interval} 天`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `每 ${interval} 周 ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `每 ${interval} 月 ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `每 ${interval} 年 ${days} 的 ${months}`,
        position1                       : '第 1',
        position2                       : '第2',
        position3                       : '第3',
        position4                       : '第4',
        position5                       : '第5',
        'position-1'                    : '最后',
        day                             : '天',
        weekday                         : '工作日',
        'weekend day'                   : '周末',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : '重复性事件',
        Cancel              : '取消',
        Save                : '保存',
        Frequency           : '频次',
        Every               : '每',
        DAILYintervalUnit   : '天',
        WEEKLYintervalUnit  : '周',
        MONTHLYintervalUnit : '月',
        YEARLYintervalUnit  : '年',
        Each                : '每',
        on                  : '在',
        the                 : '在',
        'On the'            : '在',
        'End repeat'        : '最后重复一遍',
        'time(s)'           : '次',
        Days                : '天',
        Months              : '月份'
    },

    RecurrenceDaysCombo : {
        day           : '天',
        weekday       : '工作日',
        'weekend day' : '周末'
    },

    RecurrencePositionsCombo : {
        position1    : '第1',
        position2    : '第2',
        position3    : '第3',
        position4    : '第4',
        position5    : '第5',
        'position-1' : '最后'
    },

    RecurrenceStopConditionCombo : {
        Never     : '从不',
        After     : '之后',
        'On date' : '日期'
    },

    RecurrenceFrequencyCombo : {
        None    : '不重复',
        Daily   : '每天',
        Weekly  : '每周',
        Monthly : '每月',
        Yearly  : '每年'
    },

    RecurrenceCombo : {
        None   : '无',
        Custom : '自定义……'
    },

    Summary : {
        'Summary for' : date => `汇总 ${date}`
    },

    ScheduleRangeCombo : {
        completeview : '完成计划',
        currentview  : '可见计划',
        daterange    : '日期范围',
        completedata : '完成计划（所有事件）'
    },

    SchedulerExportDialog : {
        'Schedule range' : '计划范围',
        'Export from'    : '从',
        'Export to'      : '至'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : '单页'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : '单页（未缩放）'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : '多页（垂直）'
    },

    ExcelExporter : {
        'No resource assigned' : '未分配资源'
    },

    CrudManagerView : {
        serverResponseLabel : '服务器响应：'
    },

    DurationColumn : {
        Duration : '持续时间'
    },

    EventClusteringBase : {
        unnamed         : '未命名',
        more            : count => `+ 另外 ${count} 个`,
        clusteredEvents : count => `${count} 个聚类事件`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} 个聚类范围`
    },

    ConstraintTypePicker : {
        none                : '无',
        assoonaspossible    : '尽快',
        aslateaspossible    : '尽晚',
        muststarton         : '必须于（日期）开始',
        mustfinishon        : '必须于（日期）结束',
        startnoearlierthan  : '不早于（日期）开始',
        startnolaterthan    : '不迟于（日期）开始',
        finishnoearlierthan : '不早于（日期）结束',
        finishnolaterthan   : '不迟于（日期）结束'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} 活动前的缓冲时间`;
            }
            if (postamble) {
                description += `.${postamble.toString()} 活动后的缓冲时间`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : '前进',
        Backward      : '后退',
        inheritedFrom : '继承自',
        enforcedBy    : '强制执行者'
    },

    CalendarField : {
        'Default calendar' : '默认日历',
        editCalendar       : '编辑日历'
    },

    TaskEditorBase : {
        Information   : '任务信息',
        Save          : '保存',
        Cancel        : '取消',
        Delete        : '删除',
        calculateMask : '计算……',
        saveError     : '无法保存，请先更正错误',
        repeatingInfo : '查看重复事件',
        editRepeating : '编辑'
    },

    TaskEdit : {
        editEvent              : '编辑事件',
        ConfirmDeletionTitle   : '确认删除',
        ConfirmDeletionMessage : '您确定要删除该事件？'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '34em'
    },

    SchedulerGeneralTab : {
        General      : '通用',
        Name         : '名称',
        Resources    : '资源',
        '% complete' : '完成%',
        Duration     : '持续时间',
        Start        : '开始',
        Finish       : '完成',
        Effort       : 'Effort',
        Preamble     : '前文',
        Postamble    : '后文'
    },

    GeneralTab : {
        General      : '通用',
        Name         : '名称',
        '% complete' : '完成%',
        Duration     : '持续时间',
        Start        : '开始',
        Finish       : '完成',
        Effort       : 'Effort',
        Dates        : '日期'
    },

    SchedulerAdvancedTab : {
        Advanced                   : '高级',
        Calendar                   : '日历',
        'Scheduling mode'          : '日程模式',
        'Effort driven'            : '工作量驱动',
        'Manually scheduled'       : '手动排程',
        'Constraint type'          : '限制类型',
        'Constraint date'          : '限制日期',
        Inactive                   : '无效',
        'Ignore resource calendar' : '忽略资源日历'
    },

    CalendarEditorDatePicker : {
        addException : '添加异常',
        addWeek      : '添加周'
    },

    CalendarEditorExceptionTab : {
        addException    : '添加异常',
        removeException : '删除异常',
        noRows          : '没有例外'
    },

    CalendarEditorWeekTab : {
        addWeek    : '添加周',
        removeWeek : '删除周'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : '默认情况下正在工作',
        workingTimeCalendar        : '工作时间日历',
        exceptions                 : '例外',
        general                    : '一般的',
        name                       : '姓名',
        parent                     : '父母',
        save                       : '节省',
        weeks                      : '几周',
        error                      : '错误',
        inputErrors                : '有输入错误。请在保存更改之前对其进行修复。',
        delete                     : '删除',
        addCalendar                : '添加一个日历',
        confirmation               : '确认',
        removeCalendarWithChildren : '日历有子日历。单击“是”以与孩子一起删除日历。',
        removeCalendarAndLinks     : '日历有些记录使用。单击“是”以取消链接并删除日历。',
        newException               : '新异常',
        newWeek                    : '新的一周'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' 工作中',
        isNotWorking : ' 不管用',
        basedOn      : ' 基于：',
        byDefault    : '默认情况下',
        rangeTpl     : (start, end) => `${start}至${end}`
    },

    CalendarEditorLegend : {
        workingDay    : '工作日',
        nonWorkingDay : '非工作日'
    },

    AvailabilityRangeError : {
        errorOverlap       : '有重叠的范围',
        errorMissingDate   : '需要开始和结束时间',
        errorStartAfterEnd : '开始时间不能在结束时间之后'
    },

    CalendarEditorExceptionPanel : {
        name                                 : '姓名',
        from                                 : '从',
        to                                   : '到',
        is                                   : '是',
        nonWorking                           : '不工作',
        working                              : '在职的',
        hours                                : '小时',
        repeat                               : '重复',
        repeatEnd                            : '重复结束',
        errorMissingDate                     : '需要例外日期范围',
        errorStartAfterEnd                   : '"From" date cannot be after the "To" date ',
        errorStartAndEndRepeatNumberMismatch : '例外应开始和结束相同的次数'
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
        errorStartAfterEnd           : '"From" date cannot be after the "To" date ',
        errorNoDefaultWeek           : '需要周的配置',
        errorMultipleDefaultWeeks    : '指定了多个默认周',
        errorNoWeekAvailability      : '一周必须提供一些工作时间',
        errorInvalidWeekAvailability : '周有工作时间配置错误',
        noRows                       : '没有几周'
    },

    AdvancedTab : {
        Advanced                   : '高级',
        Calendar                   : '日历',
        'Scheduling mode'          : '日程模式',
        'Effort driven'            : '工作量驱动',
        'Manually scheduled'       : '手动排程',
        'Constraint type'          : '限制类型',
        'Constraint date'          : '限制日期',
        Constraint                 : '限制',
        Rollup                     : '打包',
        Inactive                   : '无效',
        'Ignore resource calendar' : '忽略资源日历',
        'Scheduling direction'     : '计划方向',
        projectBorder              : '项目边界',
        ignore                     : '忽略',
        honor                      : '荣誉',
        askUser                    : '询问用户'
    },

    DependencyTab : {
        Predecessors      : '前导',
        Successors        : '后继',
        ID                : 'ID',
        Name              : '名称',
        Type              : '类型',
        Lag               : '延迟',
        cyclicDependency  : '循环依附关系',
        invalidDependency : '依附关系无效',
        readOnlyTask      : '无法链接只读任务'
    },

    NotesTab : {
        Notes : '注释'
    },

    ResourceCalendarColumn : {
        calendar : '日历'
    },

    ResourceEdit : {
        editResource : '编辑资源'
    },

    ResourceEditor : {
        resourceInformation : '资源信息',
        costs               : '成本',
        save                : '节省',
        error               : '错误',
        inputErrors         : '有输入错误。请在保存更改之前修复它们。',
        delete              : '删除',
        confirmation        : '确认',
        removeUsedResource  : '资源被分配给某些任务。单击“是”仍会删除该资源。'
    },

    ResourceEditorGeneralTab : {
        calendar    : '日历',
        general     : '一般的',
        label       : '材质标签',
        name        : '资源名称',
        type        : '类型',
        costAccrual : '应计成本',
        labelHint   : '例如，公斤、吨或箱',
        maxUnits    : '最大单位'
    },

    ResourceCostAccrualColumn : {
        accrueAt : '累积于',
        prorated : '按比例分配',
        start    : '开始',
        end      : '结尾'
    },

    CostAccrualField : {
        prorated : '按比例分配',
        start    : '开始',
        end      : '结尾'
    },

    ResourceType : {
        work     : '工作',
        material : '材料',
        cost     : '成本'
    },

    ResourceTypeColumn : {
        type : '类型'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : '费率表',
        newGroup     : '新表',
        removeGroup  : '删除表格',
        useByDefault : '默认情况下用于资源分配',
        noRates      : '无费率'
    },

    ResourceGrid : {
        name          : '姓名',
        materialLabel : '材质标签',
        maxUnits      : '最大单位',
        cost          : '成本',
        noRows        : '没有资源'
    },

    ResourceRateTableContainer : {
        startDate    : '开始日期',
        standardRate : '标准费率',
        perUseCost   : '每次使用费用',
        addRate      : '添加率',
        removeRate   : '去除率',
        name         : '姓名',
        noRates      : '无费率'
    },

    ResourceRateTableEditor : {
        rateTableInformation : '费率表信息'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : '数量',
        Resources   : '资源',
        Resource    : '资源',
        Units       : '单位',
        cost        : '成本',
        effort      : '努力',
        start       : '开始',
        finish      : '结束',
        preamble    : '前言',
        postamble   : '后记'
    },

    RateTableColumn : {
        rateTable : '费率表'
    },

    RecurrenceTab : {
        title : '重复'
    },

    SchedulingModePicker : {
        Normal           : '正常',
        'Fixed Duration' : '固定时长',
        'Fixed Units'    : '固定单位',
        'Fixed Effort'   : '固定工作量'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} 的 {available}</span> 已分配',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} 的 {available}</span> 已分配',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} 的 {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} 的 {available}</span> 分配的:<br>{assignments}',
        groupBarTipOnDate     : '在 {startDate}<br><span class="{cls}">{allocated} 的 {available}</span> 已分配：<br>{assignments}',
        plusMore              : '+{value} 更多'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">努力</div><div class="b-effort-value {cls}">{allocated} / {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">努力</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">成本</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">数量</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} 于 {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">{startDate} - {endDate} 的摘要</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">{startDate} 的摘要</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} 更多',
        nameColumnText        : '资源 / 事件'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : '取消变更，不做任何改变',
        schedulingConflict : '计划冲突',
        emptyCalendar      : '日历配置错误',
        cycle              : '排程周期',
        Apply              : '应用'
    },

    CycleResolutionPopup : {
        dependencyLabel        : '请选择依附关系：',
        invalidDependencyLabel : '存在无效依附关系，需要解决：'
    },

    SchedulerProBase : {
        propagating     : '计算项目',
        storePopulation : '加载数据',
        finalizing      : '最终确定结果'
    },

    EventSegments : {
        splitEvent    : '拆分事件',
        renameSegment : '重命名'
    },

    NestedEvents : {
        createGroup         : '分组选定的事件',
        newGroupName        : '新建分组',
        deNestingNotAllowed : '不允许去嵌套',
        nestingNotAllowed   : '不允许嵌套'
    },

    VersionGrid : {
        compare       : '比较',
        description   : '描述',
        occurredAt    : '发生于',
        rename        : '重命名',
        restore       : '恢复',
        stopComparing : '停止比较'
    },

    Versions : {
        entityNames : {
            TaskModel       : '任务',
            AssignmentModel : '分配',
            DependencyModel : '关联',
            ProjectModel    : '项目',
            ResourceModel   : '资源',
            other           : '对象'
        },
        entityNamesPlural : {
            TaskModel       : '任务',
            AssignmentModel : '分配',
            DependencyModel : '关联',
            ProjectModel    : '项目',
            ResourceModel   : '资源',
            other           : '对象'
        },
        transactionDescriptions : {
            update : '更改{n} {entities}',
            add    : '添加{n} {entities}',
            remove : '删除 {n} {entities}',
            move   : '移动 {n} {entities}',
            mixed  : '更改{n} {entities}'
        },
        propertyNames : {
            active                   : '活动',
            allDay                   : '全天',
            allowOverlap             : '允许重叠',
            barMargin                : '条形图边距',
            bidirectional            : '双向',
            calendar                 : '日历',
            cls                      : 'CSS 类',
            constraintDate           : '约束日期',
            constraintType           : '约束类型',
            daysPerMonth             : '每月天数',
            daysPerWeek              : '每周天数',
            delayFromParent          : '从父项延迟',
            direction                : '方向',
            drawDependencies         : '绘制依赖关系',
            duration                 : '持续时间',
            durationUnit             : '持续时间单位',
            effort                   : '努力',
            effortDriven             : '努力驱动',
            effortUnit               : '努力单位',
            endDate                  : '结束日期',
            eventColor               : '颜色',
            eventId                  : '事件 ID',
            eventLayout              : '事件布局',
            eventStyle               : '条形图样式',
            exceptionDates           : '例外日期',
            fixed                    : '固定',
            from                     : '从',
            fromSide                 : '从侧面',
            hoursPerDay              : '每天小时数',
            href                     : '链接',
            iconCls                  : '图标',
            id                       : 'ID',
            ignoreResourceCalendar   : '忽略资源日历',
            ignoreTimeZone           : '忽略时区',
            image                    : '图像',
            imageUrl                 : '图像 URL',
            inactive                 : '非活动',
            intervals                : '间隔',
            lag                      : '滞后',
            lagUnit                  : '滞后单位',
            lineStyle                : '线条样式',
            manuallyScheduled        : '手动安排',
            milestoneWidth           : '里程碑宽度',
            name                     : '名称',
            note                     : '备注',
            parentId                 : '父 ID',
            parentIndex              : '位置',
            percentDone              : '完成百分比',
            postamble                : '后缀',
            preamble                 : '前缀',
            readOnly                 : '只读',
            recurrenceRule           : '重复规则',
            resourceId               : '资源 ID',
            resourceMargin           : '资源边距',
            rowHeight                : '行高',
            schedulingMode           : '调度模式',
            segments                 : '段',
            showAvatar               : '显示头像',
            showInTimeline           : '显示在时间轴中',
            startDate                : '开始日期',
            stickyContents           : '粘性内容',
            strokeColor              : '线条颜色',
            style                    : '样式',
            target                   : '链接目标',
            to                       : '到',
            toSide                   : '到侧面',
            type                     : '类型',
            units                    : '单位',
            unscheduled              : '未安排',
            unspecifiedTimeIsWorking : '未指定时间为工作时间',
            version                  : '版本'
        },
        intervals : {
            working    : '工作中',
            nonWorking : '非工作中',
            fromTo     : '从 {from} 到 {to}',
            recurring  : '从 {start} 开始到 {end} 结束的重复'
        },
        addEntity         : '添加{type} **{name}**',
        removeEntity      : '删除{type} **{name}**',
        updateEntity      : '更改{type} **{name}**',
        moveEntity        : '移动 {type} **{name}** 从{from}到{to}',
        addDependency     : '添加从**{from}**到**{to}**的关联',
        removeDependency  : '移除从**{from}**到**{to}**的关联',
        updateDependency  : '编辑从**{from}**到**{to}**的关联',
        addAssignment     : '分配**{resource}**到**{event}**',
        removeAssignment  : '移除**{resource}**到**{event}**的分配',
        updateAssignment  : '编辑**{resource}**到**{event}**的分配',
        noChanges         : '无更改',
        nullValue         : '空',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : '保存于 {date}',
        autoSavedAt       : '自动保存于 {date}',
        undid             : '撤销更改',
        redid             : '恢复更改',
        editedTask        : '编辑任务属性',
        deletedTask       : '删除任务',
        movedTask         : '移动一项任务',
        movedTasks        : '移动多项任务'
    }
};

export default LocaleHelper.publishLocale(locale);
