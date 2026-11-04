import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Ja.js';
import '../../Grid/localization/Ja.js';

const locale = {

    localeName : 'Ja',
    localeDesc : '日本語',
    localeCode : 'ja',
    localeRtl  : false,

    Object : {
        newEvent    : '新しいイベント',
        information : '情報',
        showDetails : '詳細を表示'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' イベント'
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'リソースレイアウト列を切り替えます。 SPACEでコンテキストメニューを表示。'
    },

    Dependencies : {
        from    : 'から',
        to      : 'まで',
        valid   : '有効',
        invalid : '無効'
    },

    DependencyType : {
        SS           : 'SS',
        SF           : 'SF',
        FS           : 'FS',
        FF           : 'FF',
        StartToStart : '開始 – 開始',
        StartToEnd   : '開始 – 終了',
        EndToStart   : '終了 – 開始',
        EndToEnd     : '終了 – 終了',
        short        : [
            'SS',
            'SF',
            'FS',
            'FF'
        ],
        long : [
            '開始 – 開始',
            '開始 – 終了',
            '終了 – 開始',
            '終了 – 終了'
        ]
    },

    DependencyEdit : {
        From              : 'から',
        To                : 'まで',
        Type              : '種類',
        Lag               : 'ラグ',
        color             : '色',
        lineStyle         : '線のスタイル',
        solid             : '実線',
        dashed            : '破線',
        dotted            : '点線',
        dashDot           : '破点線',
        longDash          : '長い破線',
        'Edit dependency' : '依存関係を編集する',
        Save              : '保存する',
        Delete            : '削除する',
        Cancel            : '取り消す',
        StartToStart      : '開始 – 開始',
        StartToEnd        : '開始 – 終了',
        EndToStart        : '終了 – 開始',
        EndToEnd          : '終了 – 終了',
        Active            : 'アクティブ'
    },

    EventEdit : {
        Name           : '名前',
        Resource       : 'リソース',
        Start          : '開始',
        startTime      : '開始時間',
        End            : '終了',
        endTime        : '終了時間',
        Save           : '保存する',
        Delete         : '削除する',
        Cancel         : '取り消す',
        'Edit event'   : 'イベントを編集する',
        Repeat         : '繰り返す',
        editRecurrence : '繰り返しを編集'
    },

    EventDrag : {
        eventOverlapsExisting   : 'イベントはこのリソースの既存イベントと重複しています',
        noDropOutsideTimeline   : 'イベントはタイムラインの外に完全にドロップすることはできません',
        duplicateAssignmentDrag : 'イベントを同じリソースに複数回割り当てることはできません'
    },

    SchedulerBase : {
        'Add event'      : 'イベントを追加する',
        'Delete event'   : 'イベントを削除する',
        'Unassign event' : 'イベントを割り当て解除する',
        color            : '色',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}、${startDate}に開始 ${eventRecord.duration > 0 ? `${eventRecord.fullDuration.toString(false)}間` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'ズーム',
        activeDateRange : '日付範囲',
        startText       : '開始日',
        endText         : '終了日',
        todayText       : '今日'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `時間軸は${startDate}から${endDate}を表示`
    },

    EventCopyPaste : {
        copyEvent  : 'イベントをコピーする',
        cutEvent   : 'イベントを切り取る',
        pasteEvent : 'イベントを貼り付ける'
    },

    EventFilter : {
        filterEvents : 'タスクをフィルターする',
        byName       : '名前'
    },

    TimeRanges : {
        showCurrentTimeLine : '現在のタイムラインを表示する'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : '秒'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd MM月DD日, hA',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd MM月DD日',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : '日'
        },
        day : {
            name : '日/時間'
        },
        week : {
            name : '週/時間'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : '週/日'
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
            name : '週/平日'
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
            name : '複数の年'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'イベントを削除しようとしています',
        'delete-all-message'        : 'このイベントのすべての出来事を削除しますか？',
        'delete-further-message'    : 'イベントのこの出来事と将来のすべての出来事を削除しますか、それとも選択された出来事のみ削除しますか？',
        'delete-only-this-message'  : 'このイベントのこの発生を削除しますか？',
        'delete-further-btn-text'   : '将来のすべてのイベントを削除する',
        'delete-only-this-btn-text' : 'このイベントのみ削除する',
        'update-title'              : '繰り返しイベントを変更しようとしています',
        'update-all-message'        : 'このイベントのすべての出来事を変更しますか？',
        'update-further-message'    : 'イベントのこの出来事のみ変更しますか、それともこの出来事と将来のすべての出来事を変更しますか？',
        'update-only-this-message'  : 'このイベントのこの発生を変更しますか？',
        'update-further-btn-text'   : '将来のすべてのイベント',
        'update-only-this-btn-text' : 'このイベントのみ',
        Yes                         : 'はい',
        Cancel                      : '取り消す',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' と ',
        Daily                           : '毎日',
        'Weekly on {1}'                 : ({ days }) => `毎週 ${days}`,
        'Monthly on {1}'                : ({ days }) => `毎月 ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => ` 毎年${months}${days}`,
        'Every {0} days'                : ({ interval }) => `各 ${interval} 日ごと`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `各 ${interval} 週ごとの ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `各 ${interval} カ月ごとの ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `各 ${interval} 年ごとの ${months}${days}`,
        position1                       : '第1',
        position2                       : '第２',
        position3                       : '第３',
        position4                       : '第4',
        position5                       : '第5',
        'position-1'                    : '最後の',
        day                             : '日',
        weekday                         : 'ウィークデイ',
        'weekend day'                   : '週末',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'イベントを繰り返す',
        Cancel              : '取り消す',
        Save                : '保存する',
        Frequency           : '頻度',
        Every               : '各',
        DAILYintervalUnit   : '日',
        WEEKLYintervalUnit  : '週',
        MONTHLYintervalUnit : '月',
        YEARLYintervalUnit  : '年',
        Each                : '各',
        on                  : 'オン',
        the                 : 'の',
        'On the'            : 'の',
        'End repeat'        : '繰り返しを終了する',
        'time(s)'           : '期間',
        Days                : '日々',
        Months              : '数ヶ月'
    },

    RecurrenceDaysCombo : {
        day           : '日',
        weekday       : '平日',
        'weekend day' : '週末'
    },

    RecurrencePositionsCombo : {
        position1    : '第1',
        position2    : '第2',
        position3    : '第3',
        position4    : '第4',
        position5    : '第5',
        'position-1' : '最後の'
    },

    RecurrenceStopConditionCombo : {
        Never     : '決して',
        After     : '後で',
        'On date' : '指定日'
    },

    RecurrenceFrequencyCombo : {
        None    : '繰り返しなし',
        Daily   : '毎日',
        Weekly  : '毎週',
        Monthly : '毎月',
        Yearly  : '毎年'
    },

    RecurrenceCombo : {
        None   : 'なし',
        Custom : 'ユーザー…'
    },

    Summary : {
        'Summary for' : date => ` ${date}の概要`
    },

    ScheduleRangeCombo : {
        completeview : 'スケジュール全体',
        currentview  : '表示中のスケジュール',
        daterange    : '日付範囲',
        completedata : 'スケジュール全体（すべてのイベント用）'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'スケジュール範囲',
        'Export from'    : 'から',
        'Export to'      : 'まで'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : '単一ページ'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : '単一ページ（未縮尺）'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : '複数ページ（縦）'
    },

    ExcelExporter : {
        'No resource assigned' : 'リソースが割り当てられていません'
    },

    CrudManagerView : {
        serverResponseLabel : 'サーバーの応答:'
    },

    DurationColumn : {
        Duration : '期間'
    },

    EventClusteringBase : {
        unnamed         : '無名',
        more            : count => `他 ${count} 件`,
        clusteredEvents : count => `クラスタリングされたイベント ${count} 件`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `クラスタリングされた範囲 ${count} 件`
    },

    ConstraintTypePicker : {
        none                : 'なし',
        assoonaspossible    : 'できるだけ早く',
        aslateaspossible    : 'できるだけ遅く',
        muststarton         : '指定日に開始',
        mustfinishon        : '指定日に終了',
        startnoearlierthan  : '指定日以降に開始',
        startnolaterthan    : '指定日までに開始',
        finishnoearlierthan : '指定日以降に終了',
        finishnolaterthan   : '指定日までに終了'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} イベント前のバッファ時間`;
            }
            if (postamble) {
                description += `.${postamble.toString()} イベント後のバッファ時間`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : '前進',
        Backward      : '後退',
        inheritedFrom : '継承された',
        enforcedBy    : '強制された'
    },

    CalendarField : {
        'Default calendar' : '既定の予定表',
        editCalendar       : 'カレンダーを編集します'
    },

    TaskEditorBase : {
        Information   : 'タスク情報',
        Save          : '保存する',
        Cancel        : '取り消す',
        Delete        : '削除する',
        calculateMask : '計算中',
        saveError     : '保存できません。まずエラーを修正してください',
        repeatingInfo : '繰り返しイベントを表示',
        editRepeating : '編集する'
    },

    TaskEdit : {
        editEvent              : 'イベントを編集する',
        ConfirmDeletionTitle   : '削除を確認する',
        ConfirmDeletionMessage : 'イベントを本当に削除しますか？'
    },

    GanttTaskEditor : {
        editorWidth : '45em'
    },

    SchedulerTaskEditor : {
        editorWidth : '34em'
    },

    SchedulerGeneralTab : {
        General      : '全般',
        Name         : '名前',
        Resources    : 'リソース',
        '% complete' : '％完了',
        Duration     : '期間',
        Start        : '開始',
        Finish       : '終了',
        Effort       : '工数',
        Preamble     : 'プリアンブル',
        Postamble    : 'ポストアンブル'
    },

    GeneralTab : {
        General      : '全般',
        Name         : '名前',
        '% complete' : '％完了',
        Duration     : '期間',
        Start        : '開始',
        Finish       : '終了',
        Effort       : '工数',
        Dates        : '日付'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'アドバンスト',
        Calendar                   : '予定表',
        'Scheduling mode'          : 'スケジュールモード',
        'Effort driven'            : '存作業の優先',
        'Manually scheduled'       : 'スケジュール',
        'Constraint type'          : '制約タイプ',
        'Constraint date'          : '制約日',
        Inactive                   : '非アクティブ',
        'Ignore resource calendar' : 'リソースカレンダーを無視する'
    },

    CalendarEditorDatePicker : {
        addException : '例外を追加します',
        addWeek      : '週を追加します'
    },

    CalendarEditorExceptionTab : {
        addException    : '例外を追加します',
        removeException : '例外を削除します',
        noRows          : '例外は追加されていません'
    },

    CalendarEditorWeekTab : {
        addWeek    : '週を追加します',
        removeWeek : '週を削除します'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'デフォルトでは日が機能しています',
        workingTimeCalendar        : '勤務時間カレンダー',
        exceptions                 : '例外',
        general                    : '一般的な',
        name                       : '名前',
        parent                     : '親',
        save                       : '保存',
        weeks                      : '週',
        error                      : 'エラー',
        inputErrors                : '入力エラーがあります。変更を保存する前に修正してください。',
        delete                     : '消去',
        addCalendar                : 'カレンダーを追加します',
        confirmation               : '確認',
        removeCalendarWithChildren : 'カレンダーには子供のカレンダーがあります。 「はい」をクリックして、子供と一緒にカレンダーを削除します。',
        removeCalendarAndLinks     : 'カレンダーはいくつかのレコードで使用されます。 [はい]をクリックしてリンクしてカレンダーを削除します。',
        newException               : '新しい例外',
        newWeek                    : '新しい週'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' は働いている',
        isNotWorking : ' 動かない',
        basedOn      : ' に基づく：',
        byDefault    : 'デフォルトで',
        rangeTpl     : (start, end) => `${start}〜${end}`
    },

    CalendarEditorLegend : {
        workingDay    : '就業日',
        nonWorkingDay : '非操作日'
    },

    AvailabilityRangeError : {
        errorOverlap       : '重複する範囲があります',
        errorMissingDate   : '開始時間と終了時間が必要です',
        errorStartAfterEnd : '開始時間は終了後にはできません'
    },

    CalendarEditorExceptionPanel : {
        name                                 : '名前',
        from                                 : 'から',
        to                                   : 'に',
        is                                   : 'は',
        nonWorking                           : '非労働',
        working                              : '働く',
        hours                                : '時間',
        repeat                               : '繰り返す',
        repeatEnd                            : 'エンドを繰り返します',
        errorMissingDate                     : '例外日付範囲が必要です',
        errorStartAfterEnd                   : '"From" date cannot be after the "To" date ',
        errorStartAndEndRepeatNumberMismatch : '例外は同じ回数を起動および終了する必要があります'
    },

    CalendarEditorWeekPanel : {
        name        : '名前',
        from        : 'から',
        to          : 'に',
        days        : '日々',
        copyDay     : 'コピー日',
        pasteDay    : '貼り付け日',
        stopCopying : 'コピーを停止します'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : '範囲を追加します',
        removeRange : '範囲を削除します'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"From" date cannot be after the "To" date ',
        errorNoDefaultWeek           : '週の構成が必要です',
        errorMultipleDefaultWeeks    : '複数のデフォルトの週が指定されています',
        errorNoWeekAvailability      : '週はいくらかの労働時間を提供する必要があります',
        errorInvalidWeekAvailability : '週には作業時間構成エラーがあります',
        noRows                       : '週は追加されていません'
    },

    AdvancedTab : {
        Advanced                   : 'アドバンスト',
        Calendar                   : '予定表',
        'Scheduling mode'          : 'スケジュールモード',
        'Effort driven'            : '存作業の優先',
        'Manually scheduled'       : '手動スケジュール',
        'Constraint type'          : '制約タイプ',
        'Constraint date'          : '制約日',
        Constraint                 : '制約',
        Rollup                     : 'ロールアップ',
        Inactive                   : '非アクティブ',
        'Ignore resource calendar' : 'リソースカレンダーを無視する',
        'Scheduling direction'     : 'スケジュールの方向',
        projectBorder              : 'プロジェクトボーダー',
        ignore                     : '無視する',
        honor                      : '名誉',
        askUser                    : 'ユーザーに聞いてください'
    },

    DependencyTab : {
        Predecessors      : '先行タスク',
        Successors        : '後続タスク',
        ID                : 'ID',
        Name              : '名前',
        Type              : '種類',
        Lag               : 'ラグ',
        cyclicDependency  : '循環依存関係',
        invalidDependency : '無効な依存関係',
        readOnlyTask      : '読み取り専用タスクはリンクできません'
    },

    NotesTab : {
        Notes : '備考'
    },

    ResourceCalendarColumn : {
        calendar : 'カレンダー'
    },

    ResourceEdit : {
        editResource : 'リソースの編集'
    },

    ResourceEditor : {
        resourceInformation : 'リソース情報',
        costs               : 'コスト',
        save                : '保存',
        error               : 'エラー',
        inputErrors         : '入力ミスがあります。変更を保存する前に修正してください。',
        delete              : '消去',
        confirmation        : '確認',
        removeUsedResource  : 'リソースはいくつかのタスクに割り当てられます。とにかくリソースを削除するには、「はい」をクリックします。'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'カレンダー',
        general     : '一般的な',
        label       : '材質ラベル',
        name        : 'リソース名',
        type        : 'タイプ',
        costAccrual : '発生原価',
        labelHint   : 'たとえば、kg、トン、箱など',
        maxUnits    : '最大単位'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'で発生します',
        prorated : '日割り計算',
        start    : '始める',
        end      : '終わり'
    },

    CostAccrualField : {
        prorated : '日割り計算',
        start    : '始める',
        end      : '終わり'
    },

    ResourceType : {
        work     : '仕事',
        material : '材料',
        cost     : '料金'
    },

    ResourceTypeColumn : {
        type : 'タイプ'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : '料金表',
        newGroup     : '新しいテーブル',
        removeGroup  : 'テーブルの削除',
        useByDefault : 'リソース割り当てにデフォルトで使用します',
        noRates      : '料金なし'
    },

    ResourceGrid : {
        name          : '名前',
        materialLabel : '材質ラベル',
        maxUnits      : '最大単位',
        cost          : '料金',
        noRows        : 'リソースがありません'
    },

    ResourceRateTableContainer : {
        startDate    : '開始日',
        standardRate : '標準料金',
        perUseCost   : '使用ごとのコスト',
        addRate      : '加算率',
        removeRate   : '除去率',
        name         : '名前',
        noRates      : '料金なし'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'レートテーブル情報'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : '量',
        Resources   : 'リソース',
        Resource    : 'リソース',
        Units       : '単位',
        cost        : '料金',
        effort      : '努力',
        start       : '始める',
        finish      : '仕上げる',
        preamble    : '前文',
        postamble   : '後文'
    },

    RateTableColumn : {
        rateTable : '料金表'
    },

    RecurrenceTab : {
        title : '繰り返す'
    },

    SchedulingModePicker : {
        Normal           : '普通',
        'Fixed Duration' : '期間固定',
        'Fixed Units'    : '単位数固定',
        'Fixed Effort'   : '工数固定'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} の {available}</span> 割り当て済',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} の {available}</span> 割り当て済',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} の {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} の {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'に {startDate}<br><span class="{cls}">{allocated} の {available}</span> 割り当て済:<br>{assignments}',
        plusMore              : '+{value} 増'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">努力</div><div class="b-effort-value {cls}">{allocated} / {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">努力</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">費用</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">数量</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} {startDate} に</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">{startDate} - {endDate} の概要</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">{startDate} の概要</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} さらに',
        nameColumnText        : 'リソース / イベント'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : '変更を取り消し、何もしない',
        schedulingConflict : 'スケジュール上の矛盾',
        emptyCalendar      : '予定表設定のエラー',
        cycle              : 'スケジュールサイクル',
        Apply              : '適用する'
    },

    CycleResolutionPopup : {
        dependencyLabel        : '依存関係を選択してください:',
        invalidDependencyLabel : '対処すべき無効な依存関係があります:'
    },

    SchedulerProBase : {
        propagating     : 'プロジェクト計算中',
        storePopulation : 'データ読み込み中',
        finalizing      : '確定中'
    },

    EventSegments : {
        splitEvent    : 'イベントを分割する',
        renameSegment : '名前を変更する'
    },

    NestedEvents : {
        createGroup         : '選択したイベントをグループ化',
        newGroupName        : '新しいグループ',
        deNestingNotAllowed : '入れ子の解除はできません',
        nestingNotAllowed   : '入れ子はできません'
    },

    VersionGrid : {
        compare       : '比較',
        description   : '説明',
        occurredAt    : '発生日時',
        rename        : '名前を変更',
        restore       : '復元する',
        stopComparing : '比較を停止する'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'タスク',
            AssignmentModel : '割り当て',
            DependencyModel : 'リンク',
            ProjectModel    : 'プロジェクト',
            ResourceModel   : 'リソース',
            other           : '対象'
        },
        entityNamesPlural : {
            TaskModel       : '複数のタスク',
            AssignmentModel : '複数の割り当て',
            DependencyModel : '複数のリンク',
            ProjectModel    : '複数のプロジェクト',
            ResourceModel   : '複数のリソース',
            other           : '複数の対象'
        },
        transactionDescriptions : {
            update : ' {n} {entities}を変更した',
            add    : ' {n} {entities}を追加した',
            remove : ' {n} {entities}を削除した',
            move   : ' {n} {entities}を移動した',
            mixed  : ' {n} {entities}を変更した'
        },
        propertyNames : {
            active                   : 'アクティブ',
            allDay                   : '終日',
            allowOverlap             : '重複を許可',
            barMargin                : 'バーの余白',
            bidirectional            : '双方向',
            calendar                 : 'カレンダー',
            cls                      : 'CSSクラス',
            constraintDate           : '制約日',
            constraintType           : '制約タイプ',
            daysPerMonth             : '月あたりの日数',
            daysPerWeek              : '週あたりの日数',
            delayFromParent          : '親からの遅延',
            direction                : '方向',
            drawDependencies         : '依存関係を描画',
            duration                 : '期間',
            durationUnit             : '期間単位',
            effort                   : '努力',
            effortDriven             : '努力駆動',
            effortUnit               : '努力単位',
            endDate                  : '終了日',
            eventColor               : '色',
            eventId                  : 'イベントID',
            eventLayout              : 'イベントレイアウト',
            eventStyle               : 'バーのスタイル',
            exceptionDates           : '例外日',
            fixed                    : '固定',
            from                     : '開始',
            fromSide                 : '開始側',
            hoursPerDay              : '1日あたりの時間',
            href                     : 'リンク',
            iconCls                  : 'アイコン',
            id                       : 'ID',
            ignoreResourceCalendar   : 'リソースカレンダーを無視',
            ignoreTimeZone           : 'タイムゾーンを無視',
            image                    : '画像',
            imageUrl                 : '画像URL',
            inactive                 : '非アクティブ',
            intervals                : '間隔',
            lag                      : '遅延',
            lagUnit                  : '遅延単位',
            lineStyle                : '線のスタイル',
            manuallyScheduled        : '手動でスケジュール',
            milestoneWidth           : 'マイルストーンの幅',
            name                     : '名前',
            note                     : 'メモ',
            parentId                 : '親ID',
            parentIndex              : '位置',
            percentDone              : '% 完了',
            postamble                : '後書き',
            preamble                 : '前書き',
            readOnly                 : '読み取り専用',
            recurrenceRule           : '繰り返しルール',
            resourceId               : 'リソースID',
            resourceMargin           : 'リソースの余白',
            rowHeight                : '行の高さ',
            schedulingMode           : 'スケジュールモード',
            segments                 : 'セグメント',
            showAvatar               : 'アバターを表示',
            showInTimeline           : 'タイムラインに表示',
            startDate                : '開始日',
            stickyContents           : '固定コンテンツ',
            strokeColor              : '線の色',
            style                    : 'スタイル',
            target                   : 'リンクターゲット',
            to                       : '終了',
            toSide                   : '終了側',
            type                     : 'タイプ',
            units                    : '単位',
            unscheduled              : '未スケジュール',
            unspecifiedTimeIsWorking : '未指定の時間は作業中',
            version                  : 'バージョン'
        },
        intervals : {
            working    : '作業中',
            nonWorking : '非作業中',
            fromTo     : '{from} から {to} まで',
            recurring  : '{start} から始まり {end} で終了する繰り返し'
        },
        addEntity         : '{type} **{name}**を追加した',
        removeEntity      : '{type} **{name}**を削除した',
        updateEntity      : '{type} **{name}**を変更した',
        moveEntity        : '{from} から {to}　へ{type} **{name}**を移動した',
        addDependency     : '**{from}** から **{to}**　へのリンクを追加した',
        removeDependency  : '**{from}** から **{to}**　へのリンクを削除した',
        updateDependency  : '**{from}** から **{to}**　へのリンクを編集した',
        addAssignment     : '**{resource}** を **{event}**　に割り当てた',
        removeAssignment  : '**{event}**　から　**{resource}**　の割り当てを削除した',
        updateAssignment  : '**{event}**　へ　**{resource}**　の割り当てを編集した',
        noChanges         : '変更なし',
        nullValue         : 'なし',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : '{date} に保存されました',
        autoSavedAt       : '{date} に自動保存されました',
        undid             : '変更を取り消す',
        redid             : '変更をやり直す',
        editedTask        : 'タスクプロパティを編集した',
        deletedTask       : 'ひとつのタスクを削除した',
        movedTask         : 'ひとつのタスクを移動した',
        movedTasks        : '複数のタスクを移動した'
    }
};

export default LocaleHelper.publishLocale(locale);
