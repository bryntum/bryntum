import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Ja',
    localeDesc : '日本語',
    localeCode : 'ja',
    localeRtl  : false,

    Object : {
        Yes      : 'はい',
        No       : 'いいえ',
        Cancel   : '取り消す',
        Ok       : 'OK',
        Week     : '週',
        None     : 'なし',
        previous : '前へ',
        next     : '次へ',
        to       : 'に',
        at       : 'で',
        on       : 'に',
        editing  : what => `${what}を編集中`,
        settings : '設定',
        close    : '閉じる',
        go       : '行け',
        save     : '保存',
        cancel   : 'キャンセル',
        revert   : '変更を元に戻す',
        collapse : '縮小する',
        expand   : '拡張する',
        today    : '今日',
        andNMore : n => `と${n}件の他`
    },

    AIBase : {
        delayStatusTexts : [
            '待機中',
            '待機中 ...',
            'まだ待機中',
            'まだ待機中 ...'
        ],
        autoStartDialogMessage        : 'AI音声アクティベーションを有効にしますか？',
        voiceActivationToast          : phrase => `音声起動が有効になりました。会話を開始するにはフレーズ「${phrase}」を使用してください`,
        voiceControlNotSupportedToast : 'このデバイスでは音声制御がサポートされていません',
        voiceControlErrorToast        : 'このデバイスで音声制御を開始できませんでした',
        voiceControlSilenceToast      : phrase => `AI音声会話は沈黙のため終了しました。会話を再開するにはフレーズ${phrase}を使用してください`,
        noAudioDetected               : '音声が検出されませんでした。もう一度お試しください',
        transcriptionErrorToast       : '文字起こしに失敗しました。もう一度お試しください',
        playbackErrorToast            : '音声再生に失敗しました。音声出力デバイスを確認してください',
        failed                        : '（失敗）',
        awaitingConfirmation          : '確認待ち',
        timeoutToast                  : 'メッセージがタイムアウトしました',
        readingStatusText             : modelName => `${modelName}sを読み込んでいます`,
        updatingStatusText            : modelName => `${modelName}s 更新中`,
        removingStatusText            : modelName => `${modelName}s 削除中`,
        addingStatusText              : modelName => `${modelName} 追加中`,
        filteringStatusText           : modelName => `${modelName}s フィルタリング中`,
        thinkingStatusText            : '考え中',
        processingStatusText          : '処理中'
    },

    AISettingsPanel : {
        highlight               : 'ハイライト',
        verbosity               : '冗長性',
        voiceActivation         : '音声起動',
        enableVoiceActivation   : '音声起動を有効にする',
        voiceOnly               : '音声のみ',
        autostart               : '自動開始',
        dataChangeConfirmations : 'データ変更の確認',
        add                     : '追加',
        remove                  : '削除',
        update                  : '更新',
        planning                : '計画',
        enablePlanning          : '計画を有効にする',
        aiModel                 : 'AIモデル',
        timeline                : 'タイムライン',
        'in-view'               : '表示中',
        all                     : 'すべて',
        timeRangeContext        : '時間範囲のコンテキスト'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AIが話しています',
        recordingTooltip      : '録音中',
        waitingTooltip        : 'AIが考えています',
        startRecordingTooltip : 'クリックして開始',
        stopRecordingTooltip  : 'クリックして停止',
        inactiveTooltip       : '録音していません',
        openChatTooltip       : '右クリックでチャットを開く'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'メッセージを入力してください',
        noConnectionTooltip     : '接続が検出されませんでした。クリックして再試行してください',
        undone                  : '元に戻しました',
        aborted                 : '（中止）',
        readAloudTooltip        : 'メッセージを音読する',
        confidenceTooltip       : confidence => `信頼度: ${confidence}%`,
        undoTooltip             : 'データ変更を元に戻す',
        redoTooltip             : 'データ変更をやり直す',
        thumbsUp                : 'いいね',
        thumbsDown              : '悪いね',
        feedbackToast           : 'フィードバックありがとうございます！',
        clearChat               : 'チャットをクリア',
        closeChat               : 'チャットを閉じる',
        settings                : '設定',
        closeSettings           : '設定を閉じる'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `ちょうど${min}を選択してください`,
        tooFewOptionsSelected     : min => `${min}以上を選択してください`,
        tooManyOptionsSelected    : max => `${max}以下を選択してください`
    },

    CodeEditor : {
        apply        : '適用',
        autoApply    : '自動適用',
        downloadCode : 'コードをダウンロード'
    },

    ColorPicker : {
        noColor : '色なし'
    },

    Combo : {
        noResults          : '結果がありません',
        recordNotCommitted : 'レコードは追加できませんでした',
        addNewValue        : value => `${value} を追加`
    },

    ConfirmationDialog : {
        highlight       : 'ハイライト',
        preview         : 'プレビュー',
        approve         : '承認',
        reject          : '拒否',
        confirmAdd      : '追加を確認:',
        confirmUpdate   : '更新を確認:',
        confirmRemove   : '削除を確認:',
        confirmCopy     : 'コピーを確認',
        confirmAssign   : '割り当てを確認',
        confirmReassign : '再割り当てを確認',
        confirmUnassign : '割り当て解除を確認',
        confirmLink     : 'リンクを確認',
        confirmUnlink   : 'リンク解除を確認'
    },

    FilePicker : {
        file : 'ファイル'
    },

    Field : {
        badInput              : '無効なフィールド値です',
        patternMismatch       : '値は特定のパターンに一致する必要があります',
        rangeOverflow         : value => `値は${value.max}以下である必要があります`,
        rangeUnderflow        : value => `値は${value.min}以上である必要があります`,
        stepMismatch          : '値はステップと合っている必要があります',
        tooLong               : '値が長すぎます',
        tooShort              : '値が短すぎます',
        typeMismatch          : '値は特殊な形式である必要があります',
        valueMissing          : 'このフィールドは必須です',
        invalidValue          : '無効なフィールド値です',
        minimumValueViolation : '最低値エラーです',
        maximumValueViolation : '最高値エラーです',
        fieldRequired         : 'このフィールドは必須です',
        validateFilter        : 'リストから値を選択してください'
    },

    DateField : {
        invalidDate : format => '無効な日付入力です。期待される形式は ' + format
    },

    DatePicker : {
        gotoPrevYear  : '前年へ行く',
        gotoPrevMonth : '前月へ行く',
        gotoNextMonth : '翌月へ行く',
        gotoNextYear  : '翌年へ行く',
        navigation    : '日付ピッカーのナビゲーション'
    },

    Hint : {
        dontShowAgain : '再表示しない'
    },

    NumberFormat : {
        locale   : 'ja',
        currency : 'JPY'
    },

    DurationField : {
        invalidUnit : '無効な単位です'
    },

    TimeField : {
        invalidTime : '無効な時間が入力されました'
    },

    TimePicker : {
        hour   : '時間',
        minute : '分',
        second : '秒'
    },

    Tooltip : {
        loading : '読み込み中...'
    },

    List : {
        loading   : '読み込み中です',
        selectAll : 'すべて選択'
    },

    GridBase : {
        loadMask : '読み込み中です',
        syncMask : '変更を保存中です。お待ちください。'
    },

    PagingToolbar : {
        firstPage         : '先頭ページへ行く',
        prevPage          : '前のページへ行く',
        page              : 'ページ',
        nextPage          : '次のページへ行く',
        lastPage          : '最終ページへ行く',
        reload            : '現在のページを再読み込みする',
        noRecords         : '表示するレコードがありません',
        pageCountTemplate : data => ` ${data.lastPage}件のうち`,
        summaryTemplate   : data => `${data.allCount}件のうち ${data.start} - ${data.end} 件を表示 `
    },

    Popup : {
        close    : 'ポップアップを閉じる',
        maximize : '最大化'
    },

    Splitter : {
        ariaLabel      : 'スプリッター、隣接するパネルのサイズを変更するには矢印キーを使用してください',
        collapseLeft   : '左のパネルを折りたたむ',
        collapseRight  : '右のパネルを折りたたむ',
        collapseTop    : '上のパネルを折りたたむ',
        collapseBottom : '下のパネルを折りたたむ',
        expandLeft     : '左のパネルを展開する',
        expandRight    : '右のパネルを展開する',
        expandTop      : '上のパネルを展開する',
        expandBottom   : '下のパネルを展開する'
    },

    TabPanel : {
        containsInvalidFields : 'タブに無効なフィールドが含まれています'
    },

    Toolbar : {
        showOverflowingItems : 'オーバーフロー項目を表示',
        scrollForMore        : 'さらにスクロール'
    },

    UndoRedo : {
        Undo           : '取り消す',
        Redo           : 'やり直す',
        UndoLastAction : '最後のアクションを取り消す',
        RedoLastAction : '最後に取り消したアクションをやり直す',
        NoActions      : '取り消しキューにアイテムがありません'
    },

    FieldFilterPicker : {
        equals                 : 'に等しい',
        doesNotEqual           : 'に等しくない',
        isEmpty                : 'は空である',
        isNotEmpty             : 'は空でない',
        contains               : 'を含む',
        doesNotContain         : 'を含まない',
        startsWith             : 'で始まる',
        endsWith               : 'で終わる',
        isOneOf                : 'のひとつである',
        isNotOneOf             : 'のひとつでない',
        isGreaterThan          : 'より大きい',
        isLessThan             : 'より小さい',
        isGreaterThanOrEqualTo : '以上である',
        isLessThanOrEqualTo    : '以下である',
        isBetween              : 'との間である',
        isNotBetween           : 'との間ではない',
        isBefore               : 'より前である',
        isAfter                : 'より後である',
        timeEquals             : '時間が等しい',
        timeDoesNotEqual       : '時間が等しくない',
        isToday                : '今日である',
        isTomorrow             : '明日である',
        isYesterday            : '昨日である',
        isThisWeek             : '今週である',
        isNextWeek             : '来週である',
        isLastWeek             : '先週である',
        isThisMonth            : '今月である',
        isNextMonth            : '来月である',
        isLastMonth            : '先月である',
        isThisYear             : '今年である',
        isNextYear             : '来年である',
        isLastYear             : '昨年である',
        isYearToDate           : '今年の始めから今日までである',
        isTrue                 : 'は真実である',
        isFalse                : 'は偽りである',
        selectAProperty        : 'プロパティを選択する',
        selectAnOperator       : 'オペレーターを選択する',
        caseSensitive          : 'ケースセンシティブ',
        and                    : 'および',
        dateFormat             : 'YY/M/DD a',
        selectValue            : '値を選択',
        selectOneOrMoreValues  : 'ひとつ以上の値を選択する',
        enterAValue            : '値を入力する',
        enterANumber           : '数字を入力する',
        selectADate            : '日付を選択する',
        selectATime            : '時間を選択'
    },

    FieldFilterPickerGroup : {
        addFilter : 'フィルタ―を追加する',
        applyCond : applied => applied ? 'フィルターをスキップ（現在適用中）' : 'フィルターを適用（現在スキップ中）'
    },

    DateHelper : {
        locale         : 'ja',
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
            { single : 'ミリ秒', plural : 'ミリ秒', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : '秒', plural : '秒', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : '分', plural : '分', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : '時間', plural : '時間', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : '日', plural : '日', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : '週', plural : '週', abbrev : 'w' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : '月', plural : '月', abbrev : 'mon' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : '四半期', plural : '四半期', abbrev : 'q' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : '年', plural : '年', abbrev : 'yr' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : '十年', plural : '十年', abbrev : 'dec' },
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
            L   : 'YYYY年MM月DD日',
            LT  : 'HH:mm A',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '位',
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}年代`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
