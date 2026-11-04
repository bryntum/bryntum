import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/ZhTw.js';

const locale = {

    localeName : 'ZhTw',
    localeDesc : '繁體中文 (台灣)',
    localeCode : 'zh-TW',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : '資料載入失敗!',
        syncFailedMessage : '資料同步失敗!'
    },

    CrudManagerView : {
        serverResponseLabel : '伺服器回覆:'
    },

    TaskBoard : {
        column                 : '列',
        columns                : '列',
        Columns                : '欄',
        swimlane               : '間隔綫',
        swimlanes              : '間隔綫',
        Swimlanes              : '間隔綫',
        task                   : '任務',
        tasks                  : '任務',
        addTask                : '新增 L{TaskBoard.task}',
        cancel                 : '取消',
        changeColumn           : '變更 L{TaskBoard.column}',
        changeSwimlane         : '變更 L{TaskBoard.swimlane}',
        collapse               : text => `摺叠 ${text}`,
        color                  : '色彩',
        description            : '描述',
        editTask               : '編輯 L{TaskBoard.task}',
        expand                 : text => `Expand ${text}`,
        filterColumns          : '篩選 L{TaskBoard.columns}',
        filterSwimlanes        : '篩選 L{TaskBoard.swimlanes}',
        filterTasks            : '篩選 L{TaskBoard.tasks}',
        lock                   : '锁',
        unlock                 : '开锁',
        moveColumnLeft         : '移動 L{TaskBoard.column} left',
        moveColumnRight        : '篩選 L{TaskBoard.column} right',
        moveColumnUp           : '向上移動 L{TaskBoard.column}',
        moveColumnDown         : '向下移動 L{TaskBoard.column}',
        moveColumnOutOfGroup   : '移出群組 L{TaskBoard.column}',
        moveColumnIntoGroup    : '移入群組 L{TaskBoard.column}',
        groupWithLeftNeighbor  : '與左側相鄰的 L{TaskBoard.column} 群組',
        groupWithRightNeighbor : '與右側相鄰的 L{TaskBoard.column} 群組',
        name                   : '名稱',
        newTaskName            : '新 L{TaskBoard.task}',
        removeTask             : '移除 L{TaskBoard.task}',
        removeTasks            : '移除 L{TaskBoard.tasks}',
        resources              : '資源',
        save                   : '儲存',
        scrollToColumn         : '捲動至 L{TaskBoard.column}',
        scrollToSwimlane       : '捲動至 L{TaskBoard.swimlane}',
        showColumnMenu         : '顯示列選單',
        showTask               : '顯示L{TaskBoard.task}',
        unassigned             : '未分配',
        zoom                   : '縮放'
    },

    ColumnFilters : {
        show         : '顯示欄位篩選器',
        toggle       : '切換欄位篩選器',
        clear        : '清除欄位篩選器',
        badgeTooltip : count => `${count} 個篩選器已套用`
    },

    ColumnSort : {
        sort     : '排序欄位',
        sortedBy : ({ label, ascending }) =>
            `欄位已按 "${label}" ${ascending ? '升序' : '降序'} 排序`,
        reset : '重設欄位排序'
    },

    TaskMenuItem : {
        showTaskMenu : '顯示任務選單'
    },

    TodoListField : {
        add     : '新增',
        newTodo : '新增待辦事項'
    },

    UndoRedo : {
        UndoLastAction : '復原',
        RedoLastAction : '重做'
    },

    ColumnRename : {
        rename : '改名'
    },

    ColumnSearchField : {
        search    : '搜尋',
        matchMode : (mode) => `搜尋模式: ${mode}`,
        literal   : '文字',
        and       : '所有字詞 (AND)',
        or        : '任一字詞 (OR)'
    }
};

export default LocaleHelper.publishLocale(locale);
