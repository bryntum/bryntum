import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/ZhCn.js';

const locale = {

    localeName : 'ZhCn',
    localeDesc : '中文（中国）',
    localeCode : 'zh-CN',
    localeRtl  : false,

    Object : {
        Save : '保存'
    },

    CostColumn : {
        cost : '成本'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : '忽略资源日历'
    },

    InactiveColumn : {
        Inactive : '无效'
    },

    TaskInfoColumn : {
        info                     : '信息',
        postponedConflictTooltip : '此活动存在未解决的日程安排冲突。点击解决即可。'
    },

    ActualEffortColumn : {
        actualEffort : '实际工作量'
    },

    AddNewColumn : {
        'New Column' : '新栏'
    },

    BaselineEffortColumn : {
        baselineEffort : '基准工作量'
    },

    BaselineStartDateColumn : {
        baselineStart : '比较基准开始时间'
    },

    BaselineEndDateColumn : {
        baselineEnd : '比较基准完成时间'
    },

    BaselineDurationColumn : {
        baselineDuration : '比较基准工期'
    },

    BaselineStartVarianceColumn : {
        startVariance : '开始时间差异'
    },

    BaselineEndVarianceColumn : {
        endVariance : '完成时间差异'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : '工期差异'
    },

    CalendarColumn : {
        Calendar : '日历'
    },

    EarlyStartDateColumn : {
        'Early Start' : '提前开始'
    },

    EarlyEndDateColumn : {
        'Early End' : '提前结束'
    },

    LateStartDateColumn : {
        'Late Start' : '延迟开始'
    },

    LateEndDateColumn : {
        'Late End' : '延迟结束'
    },

    TotalSlackColumn : {
        'Total Slack' : '总浮动时间'
    },

    ConstraintDateColumn : {
        'Constraint Date' : '限制日期'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : '限制类型'
    },

    DeadlineDateColumn : {
        Deadline : '截止日期'
    },

    DependencyColumn : {
        'Invalid dependency' : '依附关系无效'
    },

    DurationColumn : {
        Duration : '持续时间'
    },

    EffortColumn : {
        Effort : ' 努力'
    },

    EndDateColumn : {
        Finish : '完成'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : '手动排程'
    },

    MilestoneColumn : {
        Milestone : '里程碑'
    },

    NameColumn : {
        Name : '名称'
    },

    NoteColumn : {
        Note : '备注'
    },

    PercentDoneColumn : {
        '% Done' : '%已完成'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : '计划完成百分比'
    },

    PredecessorColumn : {
        Predecessors : '前导'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : '分配资源',
        'more resources'     : '更多资源'
    },

    RollupColumn : {
        Rollup : '卷起'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : '排程模式'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : '调度方向',
        inheritedFrom       : '继承自',
        enforcedBy          : '强制执行者'
    },

    SequenceColumn : {
        Sequence : '序列'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : '在时间轴中显示'
    },

    StartDateColumn : {
        Start : '开始'
    },

    SuccessorColumn : {
        Successors : '后继'
    },

    TaskCopyPaste : {
        copyTask  : '复制',
        cutTask   : '剪切',
        pasteTask : '粘贴'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : '重新编号'
    },

    DependencyField : {
        invalidDependencyFormat : '依附关系格式无效'
    },

    ProjectLines : {
        'Project Start' : '项目开始',
        'Project End'   : '项目结束',
        statusDate      : '状态日期'
    },

    TaskTooltip : {
        Start    : '开始',
        End      : '结束',
        Duration : '持续时间',
        Complete : '完成'
    },

    BasicTaskEdit : {
        editTask        : '编辑',
        name            : '名称',
        percentComplete : '% 完成',
        start           : '开始',
        finish          : '完成',
        duration        : '持续时间'
    },

    AssignmentGrid : {
        Name     : '资源名称',
        Units    : '单位',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : '数量',
        cost        : '成本',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : '编辑',
        Indent                 : '缩进',
        Outdent                : '减少缩进',
        'Convert to milestone' : '转换为里程碑',
        Add                    : '添加……',
        'New task'             : '新任务',
        'New milestone'        : '新里程碑',
        'Task above'           : '上述任务',
        'Task below'           : '下方任务',
        'Delete task'          : '删除',
        Milestone              : '里程碑',
        'Sub-task'             : '子任务',
        Successor              : '后继任务',
        Predecessor            : '前导任务',
        changeRejected         : '调度引擎拒绝变更',
        linkTasks              : '添加依赖关系',
        unlinkTasks            : '删除依赖关系',
        color                  : '颜色'
    },

    EventSegments : {
        splitTask : '拆分任务'
    },

    Indicators : {
        earlyDates   : '提前开始/结束',
        lateDates    : '延迟开始/结束',
        Start        : '开始',
        End          : '结束',
        deadlineDate : '截止日期'
    },

    Versions : {
        indented      : '缩进',
        outdented     : '减少缩进',
        cut           : '剪切',
        pasted        : '粘贴',
        deletedTasks  : '删除任务',
        propertyNames : {
            baselines                   : '基线',
            deadlineDate                : '截止日期',
            description                 : '描述',
            endDate                     : '结束日期',
            projectConstraintResolution : '项目约束解决方案',
            rollup                      : '汇总',
            taskIconCls                 : '任务图标',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : '项目信息',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : '一般的',
        projectName  : '项目名称',
        start        : '开始日期',
        finish       : '完成日期',
        scheduleFrom : '时间表从',
        calendar     : '日历',
        readOnly     : '只读',
        forward      : '项目开始日期',
        backward     : '项目结束日期'
    },

    ProjectEditorDescriptionTab : {
        description : '描述'
    },

    ProjectEditorAdvancedTab : {
        advanced     : '先进的',
        hoursPerDay  : '每天的小时数',
        daysPerWeek  : '每周天数',
        daysPerMonth : '每月天数'
    }
};

export default LocaleHelper.publishLocale(locale);
