import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Ja.js';

const locale = {

    localeName : 'Ja',
    localeDesc : '日本語',
    localeCode : 'ja',
    localeRtl  : false,

    EventEdit : {
        Calendar  : '予定表',
        'All day' : '終日',
        day       : '日',
        week      : '週',
        month     : '月',
        year      : '年',
        decade    : '十年'
    },

    EventMenu : {
        duplicateEvent : 'イベントを繰り返す',
        copy           : 'コピーする'
    },

    Calendar : {
        toggleSidebar : 'サイドバーの表示切り替え',
        Today         : '今日',
        Tomorrow      : '明日',
        next          : range => `次へ ${range}`,
        previous      : range => `前へ ${range}`,
        plusMore      : value => `+${value} 増`,
        moreEvents    : value => `さらに ${value} 件のイベント`,
        allDay        : '終日',
        endsOn        : d => `終了 ${d}`,
        weekOfYear    : ([y, w]) => `週 ${w}, ${y}`,
        loadFail      : 'カレンダーデータの読み込みに失敗しました。システム管理者に連絡してください',
        gotoDate      : '日付に移動',
        timeRange     : '時間範囲',
        noResources   : 'リソースがありません',
        calendar      : 'カレンダー',
        toolbar       : 'カレンダーのツールバー',
        months        : '月'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : '繰り返しイベントはCTRLキーを押したままにする'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'なし'} イベント`,
        allDayEventCount : count => `${count || 'なし'} 終日イベント${count === 1 ? '' : 's'}`
    },

    EventTip : {
        'Edit event' : 'イベントを編集する',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : '週末を含む',
        weekends        : '週末',
        switcherMenu    : 'ビュー切り替えメニュー'
    },

    AgendaView : {
        Agenda : 'アジェンダ'
    },

    MonthView : {
        Month     : '月',
        monthUnit : '月'
    },

    MultiWeekView : {
        multiWeek : '複数週'
    },

    WeekView : {
        weekUnit : '週'
    },

    YearView : {
        Year     : '年',
        yearUnit : '年',
        noEvents : 'イベントがありません'
    },

    YearPlanner : {
        yearPlanner      : '年間計画',
        expandMonthRow   : '月の行を展開',
        collapseMonthRow : '月の行を折りたたむ'
    },

    EventList : {
        List   : 'リスト',
        Start  : '開始',
        Finish : '終了',
        days   : count => `${count > 1 ? `${count} ` : ''}日${count === 1 ? '' : '々'}`
    },

    DayView : {
        Day                : '日',
        dayUnit            : '日',
        daysUnit           : '日',
        expandAllDayRow    : '終日セクションを拡大する',
        collapseAllDayRow  : '終日セクションを縮小する',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : '一致する日付はありません'
    },

    DayAgendaView : {
        dayAgenda : '日程表'
    },

    DayResourceView : {
        dayResourceView : '日のリソース'
    },

    MonthGrid : {
        monthGrid : '月グリッド'
    },

    Sidebar : {
        selectDate      : 'カレンダーの日付を選択',
        matchEvents     : '試合イベント',
        filterEvents    : 'イベント名でイベントをフィルタリング',
        filterResources : '選択したリソースでイベントをフィルタリング'
    },

    WeekExpander : {
        expandTip   : 'クリックして行を拡大する',
        collapseTip : 'クリックして行を縮小する'
    },

    keyboardActions : {
        title   : 'キーボード操作',
        content : 'ヘルプパネルを表示 : [?]\nフォーカスモード選択ボタン : [Home]\nビューを変更 : [1] から [9] またはセレクターボタンテキストの最初の文字\n次の時間範囲 : [n]\n前の時間範囲 : [p]\n今日に移動 : [t]\n日付に移動 : [g]\n現在の日のセルに移動 : [CTRL]+[d]\nイベント間を移動 : [TAB]\nサイドバーイベントフィルター入力にフォーカス : [/]\n新しいイベントを作成 (日セルにフォーカス) : [ENTER]\nフォーカスされたイベントを削除 : [DELETE]/[BACKSPACE]\nフォーカスされたイベントを編集 : [ENTER]\nイベントまたはセルのコンテキストメニューを呼び出す : [SHIFT+F10]/[SPACE]\nイベントから囲むセルにフォーカス : [ESCAPE]\nセル間のナビゲーション : [↑]/[↓]/[←]/[→]\n範囲メニューを有効化 (アジェンダビューで) : [CTRL]+[r]\nイベントを切り取り、コピー、貼り付け : [CTRL]+[x]/[c]/[v]\nDayView のみズームイン/アウト : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
