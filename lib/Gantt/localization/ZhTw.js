import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/ZhTw.js';

const locale = {

    localeName : 'ZhTw',
    localeDesc : '繁體中文 (台灣)',
    localeCode : 'zh-TW',
    localeRtl  : false,

    Object : {
        Save : '儲存'
    },

    CostColumn : {
        cost : '成本'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : '忽略資源行事麗'
    },

    InactiveColumn : {
        Inactive : '不活動'
    },

    TaskInfoColumn : {
        info                     : '資訊',
        postponedConflictTooltip : '此活動存在未解決的日程安排衝突。點擊解決即可。'
    },

    ActualEffortColumn : {
        actualEffort : '實際工時'
    },

    AddNewColumn : {
        'New Column' : '新增列'
    },

    BaselineEffortColumn : {
        baselineEffort : '基準工時'
    },

    BaselineStartDateColumn : {
        baselineStart : '基線開始'
    },

    BaselineEndDateColumn : {
        baselineEnd : '基線結束'
    },

    BaselineDurationColumn : {
        baselineDuration : '基綫歷時'
    },

    BaselineStartVarianceColumn : {
        startVariance : '開始變異數'
    },

    BaselineEndVarianceColumn : {
        endVariance : '結束變異數'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : '期間變異數'
    },

    CalendarColumn : {
        Calendar : '行事曆'
    },

    EarlyStartDateColumn : {
        'Early Start' : '最早開始'
    },

    EarlyEndDateColumn : {
        'Early End' : '最早結束'
    },

    LateStartDateColumn : {
        'Late Start' : '最晚開始'
    },

    LateEndDateColumn : {
        'Late End' : '最晚結束'
    },

    TotalSlackColumn : {
        'Total Slack' : '總浮時'
    },

    ConstraintDateColumn : {
        'Constraint Date' : '限制日期'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : '限制類型'
    },

    DeadlineDateColumn : {
        Deadline : '截止日期'
    },

    DependencyColumn : {
        'Invalid dependency' : '無效相依性'
    },

    DurationColumn : {
        Duration : '期間'
    },

    EffortColumn : {
        Effort : '工作量'
    },

    EndDateColumn : {
        Finish : '結束'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : '手動排程'
    },

    MilestoneColumn : {
        Milestone : '里程碑'
    },

    NameColumn : {
        Name : '名稱'
    },

    NoteColumn : {
        Note : '附注'
    },

    PercentDoneColumn : {
        '% Done' : '% 已完成'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : '計劃完成百分比'
    },

    PredecessorColumn : {
        Predecessors : '前導子'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : '指派資源',
        'more resources'     : '更多資源'
    },

    RollupColumn : {
        Rollup : '總計'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : '排程模式'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : '排程方向',
        inheritedFrom       : '繼承自',
        enforcedBy          : '強制執行者'
    },

    SequenceColumn : {
        Sequence : '序列'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : '在時間軸中顯示'
    },

    StartDateColumn : {
        Start : '開始'
    },

    SuccessorColumn : {
        Successors : '後繼子'
    },

    TaskCopyPaste : {
        copyTask  : '複製',
        cutTask   : '剪下',
        pasteTask : '貼上'
    },

    WBSColumn : {
        WBS      : '工作細分結構',
        renumber : '重新編號'
    },

    DependencyField : {
        invalidDependencyFormat : '無效相依性格式'
    },

    ProjectLines : {
        'Project Start' : '專案開始',
        'Project End'   : '專案結束',
        statusDate      : '狀態日期'
    },

    TaskTooltip : {
        Start    : '開始',
        End      : '結束',
        Duration : '期間',
        Complete : '完成'
    },

    BasicTaskEdit : {
        editTask        : '編輯',
        name            : '名稱',
        percentComplete : '% 完成',
        start           : '開始',
        finish          : '完成',
        duration        : '持續時間'
    },

    AssignmentGrid : {
        Name     : '資源名稱',
        Units    : '單位',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : '數量',
        cost        : '成本',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : '編輯',
        Indent                 : '縮排',
        Outdent                : '凸排',
        'Convert to milestone' : '轉換為里程碑',
        Add                    : '新增...',
        'New task'             : '新任務',
        'New milestone'        : '新里程碑',
        'Task above'           : '以上任務',
        'Task below'           : '以下任務',
        'Delete task'          : '刪除',
        Milestone              : '里程碑',
        'Sub-task'             : '子任務',
        Successor              : '后機子',
        Predecessor            : '前導子',
        changeRejected         : '排程引擎拒絕變更',
        linkTasks              : '新增相依性',
        unlinkTasks            : '移除相依性',
        color                  : '色彩'
    },

    EventSegments : {
        splitTask : '分割任務'
    },

    Indicators : {
        earlyDates   : '最早開始/結束',
        lateDates    : '最晚開始/結束',
        Start        : '開始',
        End          : '結束',
        deadlineDate : '截止日期'
    },

    Versions : {
        indented      : '已縮排',
        outdented     : '已凸排',
        cut           : '已剪下',
        pasted        : '已貼上',
        deletedTasks  : '已刪除任務',
        propertyNames : {
            baselines                   : '基準',
            deadlineDate                : '截止日期',
            description                 : '描述',
            endDate                     : '完成日期',
            projectConstraintResolution : '專案限制解決方案',
            rollup                      : '匯總',
            taskIconCls                 : '任務圖示',
            wbsValue                    : '工作分解結構'
        }
    },

    ProjectEditor : {
        projectInformation : '專案資訊',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : '一般的',
        projectName  : '項目名稱',
        start        : '開始日期',
        finish       : '完成日期',
        scheduleFrom : '時間表從',
        calendar     : '日曆',
        readOnly     : '只讀',
        forward      : '專案開始日期',
        backward     : '專案結束日期'
    },

    ProjectEditorDescriptionTab : {
        description : '描述'
    },

    ProjectEditorAdvancedTab : {
        advanced     : '先進的',
        hoursPerDay  : '每天的小時數',
        daysPerWeek  : '每週天數',
        daysPerMonth : '每月天數'
    }
};

export default LocaleHelper.publishLocale(locale);
