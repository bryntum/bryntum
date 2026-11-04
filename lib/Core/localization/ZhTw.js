import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'ZhTw',
    localeDesc : '繁體中文 (台灣)',
    localeCode : 'zh-TW',
    localeRtl  : false,

    Object : {
        Yes      : '是',
        No       : '否',
        Cancel   : '取消',
        Ok       : '確定',
        Week     : '週',
        None     : '没有任何',
        previous : '上一個',
        next     : '下一個',
        to       : '到',
        at       : '在',
        on       : '在',
        editing  : what => `編輯 ${what}`,
        settings : '設定',
        close    : '關閉',
        go       : '走',
        save     : '保存',
        cancel   : '取消',
        revert   : '還原',
        collapse : '摺疊',
        expand   : '展開',
        today    : '今天',
        andNMore : n => `和另外 ${n} 個`
    },

    AIBase : {
        delayStatusTexts : [
            '等待中',
            '等待中 ...',
            '仍在等待',
            '仍在等待 ...'
        ],
        autoStartDialogMessage        : '您是否要啟用 AI 語音激活功能？',
        voiceActivationToast          : phrase => `語音激活已啟用，使用短語 "${phrase}" 開始對話`,
        voiceControlNotSupportedToast : '此設備不支持語音控制',
        voiceControlErrorToast        : '無法在您的設備上啟動語音控制',
        voiceControlSilenceToast      : phrase => `由於靜默，AI 語音對話已結束。使用短語 ${phrase} 重新開始對話`,
        noAudioDetected               : '未檢測到音訊，請再試一次',
        transcriptionErrorToast       : '轉錄失敗，請重試',
        playbackErrorToast            : '音頻播放失敗，請檢查您的音頻輸出設備',
        failed                        : '（失敗）',
        awaitingConfirmation          : '等待確認',
        timeoutToast                  : '消息超時',
        readingStatusText             : modelName => `正在閱讀 ${modelName}s`,
        updatingStatusText            : modelName => `正在更新 ${modelName}s`,
        removingStatusText            : modelName => `正在刪除 ${modelName}s`,
        addingStatusText              : modelName => `正在新增 ${modelName}`,
        filteringStatusText           : modelName => `正在篩選 ${modelName}s`,
        thinkingStatusText            : '正在思考',
        processingStatusText          : '正在處理'
    },

    AISettingsPanel : {
        highlight               : '突出顯示',
        verbosity               : '詳細程度',
        voiceActivation         : '語音啟動',
        enableVoiceActivation   : '啟用語音啟動',
        voiceOnly               : '僅語音',
        autostart               : '自動啟動',
        dataChangeConfirmations : '資料變更確認',
        add                     : '新增',
        remove                  : '移除',
        update                  : '更新',
        planning                : '規劃',
        enablePlanning          : '啟用規劃',
        aiModel                 : 'AI 模型',
        timeline                : '時間軸',
        'in-view'               : '在視圖中',
        all                     : '全部',
        timeRangeContext        : '時間範圍上下文'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI正在說話',
        recordingTooltip      : '錄音中',
        waitingTooltip        : 'AI正在思考',
        startRecordingTooltip : '點擊開始',
        stopRecordingTooltip  : '點擊停止',
        inactiveTooltip       : '未錄音',
        openChatTooltip       : '右鍵點擊以開啟聊天'
    },

    ChatPanel : {
        messageFieldPlaceholder : '輸入消息',
        noConnectionTooltip     : '未檢測到連接，點擊重試',
        undone                  : '未完成',
        aborted                 : '（已中止）',
        readAloudTooltip        : '朗讀消息',
        confidenceTooltip       : confidence => `信心指數：${confidence}%`,
        undoTooltip             : '撤銷數據更改',
        redoTooltip             : '重做數據更改',
        thumbsUp                : '讚',
        thumbsDown              : '踩',
        feedbackToast           : '感謝您的反饋！',
        clearChat               : '清除聊天',
        closeChat               : '關閉聊天',
        settings                : '設定',
        closeSettings           : '關閉設定'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `請選擇正好 ${min}`,
        tooFewOptionsSelected     : min => `請至少選擇 ${min}`,
        tooManyOptionsSelected    : max => `請勿超過 ${max}`
    },

    CodeEditor : {
        apply        : '應用',
        autoApply    : '自動應用',
        downloadCode : '下載程式碼'
    },

    ColorPicker : {
        noColor : '無色彩'
    },

    Combo : {
        noResults          : '沒有結果',
        recordNotCommitted : '無法新增記錄',
        addNewValue        : value => `新增${value}`
    },

    ConfirmationDialog : {
        highlight       : '突出顯示',
        preview         : '預覽',
        approve         : '批准',
        reject          : '拒絕',
        confirmAdd      : '確認新增：',
        confirmUpdate   : '確認更新：',
        confirmRemove   : '確認移除：',
        confirmCopy     : '確認複製',
        confirmAssign   : '確認分配',
        confirmReassign : '確認重新分配',
        confirmUnassign : '確認取消分配',
        confirmLink     : '確認連結',
        confirmUnlink   : '確認取消連結'
    },

    FilePicker : {
        file : '檔案'
    },

    Field : {
        badInput              : '欄位值無效',
        patternMismatch       : '值應該符合特定模式',
        rangeOverflow         : value => `位值必須小於或等於 ${value.max}`,
        rangeUnderflow        : value => `位值必須大於或等於 ${value.min}`,
        stepMismatch          : '值應該適合步驟',
        tooLong               : '值應該短一點',
        tooShort              : '值應該長一點',
        typeMismatch          : '值需要採用特殊格式',
        valueMissing          : '這是必填欄位',
        invalidValue          : '欄位值無效',
        minimumValueViolation : '違反值個數下限規則',
        maximumValueViolation : '違反值個數上限規則',
        fieldRequired         : '這是必填欄位',
        validateFilter        : '值必須從清單中選取'
    },

    DateField : {
        invalidDate : format => '日期輸入無效，預期格式為 ' + format
    },

    DatePicker : {
        gotoPrevYear  : '移至上一年',
        gotoPrevMonth : '移至上個月',
        gotoNextMonth : '移至下個月',
        gotoNextYear  : '移至下一年',
        navigation    : '日期選擇器導航'
    },

    Hint : {
        dontShowAgain : '不再顯示'
    },

    NumberFormat : {
        locale   : 'zh-TW',
        currency : 'CNY'
    },

    DurationField : {
        invalidUnit : '單位無效'
    },

    TimeField : {
        invalidTime : '輸入的時間無效'
    },

    TimePicker : {
        hour   : '小時',
        minute : '分鐘',
        second : '秒'
    },

    Tooltip : {
        loading : '載入中...'
    },

    List : {
        loading   : '正在載入...',
        selectAll : '全選'
    },

    GridBase : {
        loadMask : '正在載入...',
        syncMask : '正在儲存變更，請稍候...'
    },

    PagingToolbar : {
        firstPage         : '移至第一頁',
        prevPage          : '移至上一頁',
        page              : '頁',
        nextPage          : '移至下一頁',
        lastPage          : '移至最後一頁',
        reload            : '重新載入目前頁面',
        noRecords         : '沒有可顯示的記錄',
        pageCountTemplate : data => `/${data.lastPage}`,
        summaryTemplate   : data => `顯示記錄 ${data.start} - ${data.end} 的 ${data.allCount}`
    },

    Popup : {
        close    : '關閉',
        maximize : '最大化'
    },

    Splitter : {
        ariaLabel      : '分割器，使用箭頭鍵調整相鄰面板的大小',
        collapseLeft   : '折疊左側面板',
        collapseRight  : '折疊右側面板',
        collapseTop    : '折疊頂部面板',
        collapseBottom : '折疊底部面板',
        expandLeft     : '展開左側面板',
        expandRight    : '展開右側面板',
        expandTop      : '展開頂部面板',
        expandBottom   : '展開底部面板'
    },

    TabPanel : {
        containsInvalidFields : '標籤包含無效欄位'
    },

    Toolbar : {
        showOverflowingItems : '顯示溢出項目',
        scrollForMore        : '滾動以查看更多'
    },

    UndoRedo : {
        Undo           : '復原',
        Redo           : '重做',
        UndoLastAction : '復原上次動作',
        RedoLastAction : '重做上次的復原動作',
        NoActions      : '復原佇列中沒有項目'
    },

    FieldFilterPicker : {
        equals                 : '等於',
        doesNotEqual           : '不等於',
        isEmpty                : '空白',
        isNotEmpty             : '不是空的',
        contains               : '包含',
        doesNotContain         : '不包含',
        startsWith             : '開始於',
        endsWith               : '結尾為',
        isOneOf                : '其一',
        isNotOneOf             : '不是其中之一',
        isGreaterThan          : '大於',
        isLessThan             : '小於',
        isGreaterThanOrEqualTo : '大於或等於',
        isLessThanOrEqualTo    : '小於或等於',
        isBetween              : '介於',
        isNotBetween           : '不介於之間',
        isBefore               : '之前',
        isAfter                : '之後',
        timeEquals             : '時間等於',
        timeDoesNotEqual       : '時間不等於',
        isToday                : '今天',
        isTomorrow             : '明天',
        isYesterday            : '昨天',
        isThisWeek             : '本週',
        isNextWeek             : '下週',
        isLastWeek             : '上週',
        isThisMonth            : '本月',
        isNextMonth            : '下個月',
        isLastMonth            : '上個月',
        isThisYear             : '今年',
        isNextYear             : '下一年',
        isLastYear             : '去年',
        isYearToDate           : '年初至今',
        isTrue                 : '真',
        isFalse                : '假',
        selectAProperty        : '選取屬性',
        selectAnOperator       : '選取運算子',
        caseSensitive          : '區分大小寫',
        and                    : '且',
        dateFormat             : 'YY/M/D',
        selectValue            : '选择值',
        selectOneOrMoreValues  : '選取一或多個值',
        enterAValue            : '輸入值',
        enterANumber           : '輸入號碼',
        selectADate            : '選取日期',
        selectATime            : '选择时间'
    },

    FieldFilterPickerGroup : {
        addFilter : '新增篩選條件',
        applyCond : applied => applied ? '跳過篩選器（目前已應用）' : '應用篩選器（目前已跳過）'
    },

    DateHelper : {
        locale         : 'zh-TW',
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
            { single : '毫秒', plural : '毫秒', abbrev : '毫秒' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : '秒', plural : '秒', abbrev : '秒' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : '分', plural : '分', abbrev : '分' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : '小時', plural : '小時', abbrev : '小時' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : '天', plural : '天', abbrev : '天' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : '週', plural : '週', abbrev : '週' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : '月', plural : '月', abbrev : '月' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : '季', plural : '季', abbrev : '季' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : '年', plural : '年', abbrev : '年' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : '十年', plural : '十年', abbrev : '十年' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['毫秒'],
            [],
            ['秒', '秒'],
            [],
            ['分鐘', '分鐘'],
            [],
            ['小時', '小時'],
            [],
            ['天'],
            [],
            ['週', '週'],
            [],
            ['月', '月', '月'],
            [],
            ['季', '季', '季'],
            [],
            ['年', '年'],
            [],
            ['十年'],
            []
        ],
        parsers : {
            L   : 'YYYY/MM/DD',
            LT  : 'HH:mm A',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {
            const hasSpecialCase = ['11', '12', '13'].find((n) => number.endsWith(n));

            let suffix = '第';

            if (!hasSpecialCase) {
                const lastDigit = number[number.length - 1];
                suffix = { 1 : '第', 2 : '第', 3 : '第' }[lastDigit] || '第';
            }

            return number + suffix;
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}年代`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
