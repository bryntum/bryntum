import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/ZhCn.js';

const locale = {

    localeName : 'ZhCn',
    localeDesc : '中文（中国）',
    localeCode : 'zh-CN',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : '数据加载失败！',
        syncFailedMessage : '数据同步失败！'
    },

    CrudManagerView : {
        serverResponseLabel : '服务器响应：'
    },

    TaskBoard : {
        column                 : '栏',
        columns                : '栏',
        Columns                : '栏',
        swimlane               : '泳道',
        swimlanes              : '泳道',
        Swimlanes              : '泳道',
        task                   : '任务',
        tasks                  : '任务',
        addTask                : '添加L{TaskBoard.task}',
        cancel                 : '取消',
        changeColumn           : '变更 L{TaskBoard.column}',
        changeSwimlane         : '变更 L{TaskBoard.swimlane}',
        collapse               : text => `折叠 ${text}`,
        color                  : '颜色',
        description            : '说明',
        editTask               : '编辑 L{TaskBoard.task}',
        expand                 : text => `展开${text}`,
        filterColumns          : '筛选器 L{TaskBoard.column}',
        filterSwimlanes        : '筛选器 L{TaskBoard.swimlanes}',
        filterTasks            : '筛选器 L{TaskBoard.tasks}',
        lock                   : '锁',
        unlock                 : '开锁',
        moveColumnLeft         : '向左移动 L{TaskBoard.column}',
        moveColumnRight        : '向右移动 L{TaskBoard.column}',
        moveColumnUp           : '向上移动 L{TaskBoard.column}',
        moveColumnDown         : '向下移动 L{TaskBoard.column}',
        moveColumnOutOfGroup   : '移出分组 L{TaskBoard.column}',
        moveColumnIntoGroup    : '移入分组 L{TaskBoard.column}',
        groupWithLeftNeighbor  : '与左侧相邻的 L{TaskBoard.column} 分组',
        groupWithRightNeighbor : '与右侧相邻的 L{TaskBoard.column} 分组',
        name                   : '名称',
        newTaskName            : '新 L{TaskBoard.task}',
        removeTask             : '移除 L{TaskBoard.task}',
        removeTasks            : '移除 L{TaskBoard.tasks}',
        resources              : '资源',
        save                   : '保存',
        scrollToColumn         : '滚动到 L{TaskBoard.column}',
        scrollToSwimlane       : '滚动到 L{TaskBoard.swimlane}',
        showColumnMenu         : '显示列菜单',
        showTask               : '显示L{TaskBoard.task}',
        unassigned             : '未分配',
        zoom                   : '缩放'
    },

    ColumnFilters : {
        show         : '显示列过滤器',
        toggle       : '切换列过滤器',
        clear        : '清除列过滤器',
        badgeTooltip : count => `${count} 个过滤器已应用`
    },

    ColumnSort : {
        sort     : '排序列',
        sortedBy : ({ label, ascending }) =>
            `列已按“${label}”${ascending ? '升序' : '降序'}排序`,
        reset : '重置列排序'
    },

    TaskMenuItem : {
        showTaskMenu : '显示任务菜单'
    },

    TodoListField : {
        add     : '添加',
        newTodo : '新待办事项'
    },

    UndoRedo : {
        UndoLastAction : '撤销',
        RedoLastAction : '恢复'
    },

    ColumnRename : {
        rename : '重命名'
    },

    ColumnSearchField : {
        search    : '搜索',
        matchMode : (mode) => `搜索模式：${mode}`,
        literal   : '字面',
        and       : '所有词（与）',
        or        : '任意词（或）'
    }
};

export default LocaleHelper.publishLocale(locale);
