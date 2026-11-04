import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/SrRs.js';

const locale = {

    localeName : 'SrRs',
    localeDesc : 'Српски (ћирилица)',
    localeCode : 'sr-RS',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Учитавање података није успело!',
        syncFailedMessage : 'Синхронизација података није успела!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Одговор сервера:'
    },

    TaskBoard : {
        column                 : 'колона',
        columns                : 'колоне',
        Columns                : 'Колоне',
        swimlane               : 'график пролазне траке',
        swimlanes              : 'график пролазних трака',
        Swimlanes              : 'График пролазних трака',
        task                   : 'задатак',
        tasks                  : 'задаци',
        addTask                : 'Додај L(TaskBoard.task}',
        cancel                 : 'Откажи',
        changeColumn           : 'Промени L{TaskBoard.column}',
        changeSwimlane         : 'Промени L{TaskBoard.swimlane}',
        collapse               : text => `Collapse ${text}`,
        color                  : 'Боја',
        description            : 'Опис',
        editTask               : 'Уреди L{TaskBoard.task}',
        expand                 : text => `Expand ${text}`,
        filterColumns          : 'Филтрирај L{TaskBoard.columns}',
        filterSwimlanes        : 'Филтрирај L{TaskBoard.swimlanes}',
        filterTasks            : 'Филтрирај L{TaskBoard.tasks}',
        lock                   : 'Замок',
        unlock                 : 'Разблокировать',
        moveColumnLeft         : 'Помери L{TaskBoard.column} лево',
        moveColumnRight        : 'Помери L{TaskBoard.column} десно',
        moveColumnUp           : 'Помери L{TaskBoard.column} горе',
        moveColumnDown         : 'Помери L{TaskBoard.column} доле',
        moveColumnOutOfGroup   : 'Помери L{TaskBoard.column} изван групе',
        moveColumnIntoGroup    : 'Помери L{TaskBoard.column} у групу',
        groupWithLeftNeighbor  : 'Grupiši sa levim susednim L{TaskBoard.column}',
        groupWithRightNeighbor : 'Grupiši sa desnim susednim L{TaskBoard.column}',
        name                   : 'Име',
        newTaskName            : 'Нови L{TaskBoard.task}',
        removeTask             : 'Уклони L{TaskBoard.task}',
        removeTasks            : 'Уклони L{TaskBoard.tasks}',
        resources              : 'Ресурси',
        save                   : 'Сачувај',
        scrollToColumn         : 'Листај до L{TaskBoard.column}',
        scrollToSwimlane       : 'Листај до L{TaskBoard.swimlane}',
        showColumnMenu         : 'Прикажи мени колоне',
        showTask               : 'Прикажи L(TaskBoard.task}',
        unassigned             : 'Нераспоређено',
        zoom                   : 'Зумирај'
    },

    ColumnFilters : {
        show         : 'Прикажи филтер колоне',
        toggle       : 'Пребаци филтер колоне',
        clear        : 'Очисти филтере колона',
        badgeTooltip : count => `${count} филтер(а) примењено`
    },

    ColumnSort : {
        sort     : 'Сортирај колону',
        sortedBy : ({ label, ascending }) =>
            `Колона је сортирана ${ascending ? 'узлазно' : 'силазно'} по "${label}"`,
        reset : 'Ресетуј сортирање колона'
    },

    TaskMenuItem : {
        showTaskMenu : 'Прикажи мени задатака'
    },

    TodoListField : {
        add     : 'Додај',
        newTodo : 'Нови задатак'
    },

    UndoRedo : {
        UndoLastAction : 'Опозови',
        RedoLastAction : 'Понови'
    },

    ColumnRename : {
        rename : 'Преименуј'
    },

    ColumnSearchField : {
        search    : 'Претрага',
        matchMode : (mode) => `Режим претраге: ${mode}`,
        literal   : 'Дословно',
        and       : 'Све речи (И)',
        or        : 'Било која реч (ИЛИ)'
    }
};

export default LocaleHelper.publishLocale(locale);
