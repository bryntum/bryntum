import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'ZhCn',
    localeDesc : '中文（中国）',
    localeCode : 'zh-CN',
    localeRtl  : false,

    Object : {
        Yes      : '是',
        No       : '否',
        Cancel   : '取消',
        Ok       : '好',
        Week     : '周',
        None     : '无',
        previous : '上一个',
        next     : '下一个',
        to       : '到',
        at       : '在',
        on       : '在',
        editing  : what => `编辑 ${what}`,
        settings : '设置',
        close    : '关闭',
        go       : '去',
        save     : '保存',
        cancel   : '取消',
        revert   : '还原',
        collapse : '折叠',
        expand   : '展开',
        today    : '今天',
        andNMore : n => `和 ${n} 更多`
    },

    AIBase : {
        delayStatusTexts : [
            '等待中',
            '等待中 ...',
            '仍在等待',
            '仍在等待 ...'
        ],
        autoStartDialogMessage        : '您是否要启用 AI 语音激活功能？',
        voiceActivationToast          : phrase => `语音激活已启用，使用短语 "${phrase}" 开始对话`,
        voiceControlNotSupportedToast : '此设备不支持语音控制',
        voiceControlErrorToast        : '您的设备无法启动语音控制',
        voiceControlSilenceToast      : phrase => `由于静默，AI语音对话已结束。使用短语 ${phrase} 重新开始对话`,
        noAudioDetected               : '未检测到音频，请重试',
        transcriptionErrorToast       : '转录失败，请重试',
        playbackErrorToast            : '音频播放失败，请检查您的音频输出设备',
        failed                        : '（失败）',
        awaitingConfirmation          : '等待确认',
        timeoutToast                  : '消息超时',
        readingStatusText             : modelName => `正在读取 ${modelName}s`,
        updatingStatusText            : modelName => `正在更新 ${modelName}s`,
        removingStatusText            : modelName => `正在删除 ${modelName}s`,
        addingStatusText              : modelName => `正在添加 ${modelName}`,
        filteringStatusText           : modelName => `正在筛选 ${modelName}s`,
        thinkingStatusText            : '正在思考',
        processingStatusText          : '正在处理'
    },

    AISettingsPanel : {
        highlight               : '高亮',
        verbosity               : '详细程度',
        voiceActivation         : '语音激活',
        enableVoiceActivation   : '启用语音激活',
        voiceOnly               : '仅语音',
        autostart               : '自动启动',
        dataChangeConfirmations : '数据更改确认',
        add                     : '添加',
        remove                  : '移除',
        update                  : '更新',
        planning                : '计划',
        enablePlanning          : '启用计划',
        aiModel                 : 'AI 模型',
        timeline                : '时间线',
        'in-view'               : '在视图中',
        all                     : '全部',
        timeRangeContext        : '时间范围上下文'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI正在讲话',
        recordingTooltip      : '录音中',
        waitingTooltip        : 'AI正在思考',
        startRecordingTooltip : '点击开始',
        stopRecordingTooltip  : '点击停止',
        inactiveTooltip       : '未录音',
        openChatTooltip       : '右键点击打开聊天'
    },

    ChatPanel : {
        messageFieldPlaceholder : '输入消息',
        noConnectionTooltip     : '未检测到连接，点击重试',
        undone                  : '未完成',
        aborted                 : '（已中止）',
        readAloudTooltip        : '朗读消息',
        confidenceTooltip       : confidence => `置信度：${confidence}%`,
        undoTooltip             : '撤销数据更改',
        redoTooltip             : '重做数据更改',
        thumbsUp                : '点赞',
        thumbsDown              : '点踩',
        feedbackToast           : '感谢您的反馈！',
        clearChat               : '清除聊天',
        closeChat               : '关闭聊天',
        settings                : '设置',
        closeSettings           : '关闭设置'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `请选择正好 ${min}`,
        tooFewOptionsSelected     : min => `请至少选择 ${min}`,
        tooManyOptionsSelected    : max => `请最多选择 ${max}`
    },

    CodeEditor : {
        apply        : '应用',
        autoApply    : '自动应用',
        downloadCode : '下载代码'
    },

    ColorPicker : {
        noColor : '无色'
    },

    Combo : {
        noResults          : '无结果',
        recordNotCommitted : '无法添加记录',
        addNewValue        : value => `添加 ${value}`
    },

    ConfirmationDialog : {
        highlight       : '高亮',
        preview         : '预览',
        approve         : '批准',
        reject          : '拒绝',
        confirmAdd      : '确认添加：',
        confirmUpdate   : '确认更新：',
        confirmRemove   : '确认移除：',
        confirmCopy     : '确认复制',
        confirmAssign   : '确认分配',
        confirmReassign : '确认重新分配',
        confirmUnassign : '确认取消分配',
        confirmLink     : '确认链接',
        confirmUnlink   : '确认取消链接'
    },

    FilePicker : {
        file : '文件'
    },

    Field : {
        badInput              : '字段值无效',
        patternMismatch       : '值应与特定模式相匹配',
        rangeOverflow         : value => `值必须小于或等于 ${value.max}`,
        rangeUnderflow        : value => `值必须大于或等于 ${value.min}`,
        stepMismatch          : '值应符合步骤',
        tooLong               : '值应更短',
        tooShort              : '值应更长',
        typeMismatch          : '值要采用特殊格式',
        valueMissing          : '该字段为必填',
        invalidValue          : '字段值无效',
        minimumValueViolation : '不符合最小值限制',
        maximumValueViolation : '不符合最大值限制',
        fieldRequired         : '该字段为必填',
        validateFilter        : '必须从列表中选择值'
    },

    DateField : {
        invalidDate : format => '日期输入无效，预期格式为 ' + format
    },

    DatePicker : {
        gotoPrevYear  : '转至上一年',
        gotoPrevMonth : '转至上一月',
        gotoNextMonth : '转至下一月',
        gotoNextYear  : '转至下一年',
        navigation    : '日期选择器导航'
    },

    Hint : {
        dontShowAgain : '不再显示'
    },

    NumberFormat : {
        locale   : 'zh-CN',
        currency : 'CNY'
    },

    DurationField : {
        invalidUnit : '单位无效'
    },

    TimeField : {
        invalidTime : '时间输入无效'
    },

    TimePicker : {
        hour   : '时',
        minute : '分',
        second : '秒'
    },

    Tooltip : {
        loading : '加载中...'
    },

    List : {
        loading   : '加载中……',
        selectAll : '全选'
    },

    GridBase : {
        loadMask : '加载中……',
        syncMask : '正在保存变更，请稍等……'
    },

    PagingToolbar : {
        firstPage         : '转至第一页',
        prevPage          : '转至上一页',
        page              : '页',
        nextPage          : '转至下一页',
        lastPage          : '转至最后一页',
        reload            : '重新载入当前页面',
        noRecords         : '无记录显示',
        pageCountTemplate : data => `的 ${data.lastPage}`,
        summaryTemplate   : data => `显示记录 ${data.start} - ${data.end} 的 ${data.allCount}`
    },

    Popup : {
        close    : '关闭弹窗',
        maximize : '最大化'
    },

    Splitter : {
        ariaLabel      : '分割器，使用箭头键调整相邻面板的大小',
        collapseLeft   : '折叠左侧面板',
        collapseRight  : '折叠右侧面板',
        collapseTop    : '折叠顶部面板',
        collapseBottom : '折叠底部面板',
        expandLeft     : '展开左侧面板',
        expandRight    : '展开右侧面板',
        expandTop      : '展开顶部面板',
        expandBottom   : '展开底部面板'
    },

    TabPanel : {
        containsInvalidFields : '选项卡包含无效字段'
    },

    Toolbar : {
        showOverflowingItems : '显示溢出项',
        scrollForMore        : '滚动查看更多'
    },

    UndoRedo : {
        Undo           : '撤销',
        Redo           : '恢复',
        UndoLastAction : '撤销上个操作',
        RedoLastAction : '恢复上个撤销的操作',
        NoActions      : '撤销队列中没有项目'
    },

    FieldFilterPicker : {
        equals                 : '等于',
        doesNotEqual           : '不等于',
        isEmpty                : '为空',
        isNotEmpty             : '不为空',
        contains               : '包含',
        doesNotContain         : '不包含',
        startsWith             : '开始为',
        endsWith               : '结束为',
        isOneOf                : '是之一',
        isNotOneOf             : '不是之一',
        isGreaterThan          : '大于',
        isLessThan             : '小于',
        isGreaterThanOrEqualTo : '大于或等于',
        isLessThanOrEqualTo    : '小于或等于',
        isBetween              : '在之间',
        isNotBetween           : '不在之间',
        isBefore               : '在之前',
        isAfter                : '在之后',
        timeEquals             : '时间等于',
        timeDoesNotEqual       : '时间不等于',
        isToday                : '在今天',
        isTomorrow             : '在明天',
        isYesterday            : '在昨天',
        isThisWeek             : '在本周',
        isNextWeek             : '在下周',
        isLastWeek             : '在上周',
        isThisMonth            : '在本月',
        isNextMonth            : '在下月',
        isLastMonth            : '在上月',
        isThisYear             : '在今年',
        isNextYear             : '在明年',
        isLastYear             : '在去年',
        isYearToDate           : '是年初至今',
        isTrue                 : '为真',
        isFalse                : '为假',
        selectAProperty        : '选择一项属性',
        selectAnOperator       : '选择操作员',
        caseSensitive          : '区分大小写',
        and                    : '和',
        dateFormat             : '年/月/日',
        selectValue            : '选择一个值',
        selectOneOrMoreValues  : '选择一个或多个值',
        enterAValue            : '输入一个值',
        enterANumber           : '输入一个数字',
        selectADate            : '选择一个日期',
        selectATime            : '选择时间'
    },

    FieldFilterPickerGroup : {
        addFilter : '增加过滤条件',
        applyCond : applied => applied ? '跳过筛选器（当前已应用）' : '应用筛选器（当前已跳过）'
    },

    DateHelper : {
        locale         : 'zh-CN',
        weekStartDay   : 0,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : '毫秒', plural : '毫秒', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : '秒', plural : '秒', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : '分', plural : '分', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : '时', plural : '时', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : '天', plural : '天', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : '周', plural : '周', abbrev : 'w' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : '月', plural : '月', abbrev : 'mon' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : '季', plural : '季', abbrev : 'q' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : '年', plural : '年', abbrev : 'yr' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : '十年', plural : '十年', abbrev : 'dec' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['毫秒'],
            [],
            ['s', '秒'],
            [],
            ['m', '分'],
            [],
            ['h', '时'],
            [],
            ['天'],
            [],
            ['w', '周'],
            [],
            ['mo', '月', '月'],
            [],
            ['q', '季', '季'],
            [],
            ['y', '年'],
            [],
            ['十年'],
            []
        ],
        parsers : {
            L   : 'YYYY-MM-DD',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => '第' + number,
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}年代`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
