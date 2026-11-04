import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Ja.js';
const locale = {

    localeName : 'Ja',
    localeDesc : '日本語',
    localeCode : 'ja',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'データの読み込みに失敗しました',
        syncFailedMessage : 'データの同期に失敗しました'
    },

    CrudManagerView : {
        serverResponseLabel : 'サーバーの応答:'
    },

    TaskBoard : {
        column                 : '列',
        columns                : '列',
        Columns                : '列',
        swimlane               : 'スイムレーン',
        swimlanes              : 'スイムレーン',
        Swimlanes              : 'スイムレーン',
        task                   : 'タスク',
        tasks                  : 'タスク',
        addTask                : '追加する L{TaskBoard.task}',
        cancel                 : '取り消す',
        changeColumn           : '変更する L{TaskBoard.column}',
        changeSwimlane         : '変更する L{TaskBoard.swimlane}',
        collapse               : text => `縮小する ${text}`,
        color                  : '色',
        description            : '説明',
        editTask               : '編集する L{TaskBoard.task}',
        expand                 : text => `拡大する ${text}`,
        filterColumns          : 'フィルターする L{TaskBoard.columns}',
        filterSwimlanes        : 'フィルターする L{TaskBoard.swimlanes}',
        filterTasks            : 'フィルターする L{TaskBoard.tasks}',
        lock                   : 'ロック',
        unlock                 : 'ロック解除',
        moveColumnLeft         : '移動する L{TaskBoard.column} 左',
        moveColumnRight        : '移動する L{TaskBoard.column} 右',
        moveColumnUp           : '移動する L{TaskBoard.column} 上',
        moveColumnDown         : '移動する L{TaskBoard.column} 下',
        moveColumnOutOfGroup   : '移動する L{TaskBoard.column} グループ外へ',
        moveColumnIntoGroup    : '移動する L{TaskBoard.column} グループへ',
        groupWithLeftNeighbor  : '左隣の L{TaskBoard.column} とグループ化',
        groupWithRightNeighbor : '右隣の L{TaskBoard.column} とグループ化',
        name                   : '名前',
        newTaskName            : '新規の L{TaskBoard.task}',
        removeTask             : '削除する L{TaskBoard.task}',
        removeTasks            : '削除する L{TaskBoard.tasks}',
        resources              : 'リソース',
        save                   : '保存する',
        scrollToColumn         : 'スクロールする L{TaskBoard.column}',
        scrollToSwimlane       : 'スクロールする L{TaskBoard.swimlane}',
        showColumnMenu         : '列メニューを表示',
        showTask               : 'L{TaskBoard.task}を表示',
        unassigned             : '未割り当て',
        zoom                   : 'ズーム'
    },

    ColumnFilters : {
        show         : '列フィルターを表示',
        toggle       : '列フィルターを切り替え',
        clear        : '列フィルターをクリア',
        badgeTooltip : count => `${count} フィルターが適用されています`
    },

    ColumnSort : {
        sort     : '列を並べ替える',
        sortedBy : ({ label, ascending }) =>
            `列は "${label}" を基準に${ascending ? '昇順' : '降順'}に並べ替えられました`,
        reset : '列の並べ替えをリセット'
    },

    TaskMenuItem : {
        showTaskMenu : 'タスクメニューを表示'
    },

    TodoListField : {
        add     : '追加する',
        newTodo : '新規ToDo'
    },

    UndoRedo : {
        UndoLastAction : '元に戻す',
        RedoLastAction : 'やり直す'
    },

    ColumnRename : {
        rename : '名前を変更する'
    },

    ColumnSearchField : {
        search    : '検索',
        matchMode : (mode) => `検索モード: ${mode}`,
        literal   : 'リテラル',
        and       : 'すべての単語 (AND)',
        or        : 'いずれかの単語 (OR)'
    }
};

export default LocaleHelper.publishLocale(locale);
