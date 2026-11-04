import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Bg.js';

const locale = {

    localeName : 'Bg',
    localeDesc : 'Български',
    localeCode : 'bg',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Зареждането на данните е неуспешно!',
        syncFailedMessage : 'Синхронизацията на данните е неуспешна!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Отговор на сървъра:'
    },

    TaskBoard : {
        column                 : 'колона',
        columns                : 'колони',
        Columns                : 'Колони',
        swimlane               : 'swimlane диаграма',
        swimlanes              : 'swimlane диаграми',
        Swimlanes              : 'Swimlane диаграми',
        task                   : 'задача',
        tasks                  : 'задачи',
        addTask                : 'Добавяне на L{TaskBoard.task}',
        cancel                 : 'Отказ',
        changeColumn           : 'Промяна на L{TaskBoard.column}',
        changeSwimlane         : 'Промяна на L{TaskBoard.swimlane}',
        collapse               : text => `Свиване ${text}`,
        color                  : 'Цвят',
        description            : 'Описание',
        editTask               : 'Редактиране на L{TaskBoard.task}',
        expand                 : text => `Разгъване на ${text}`,
        filterColumns          : 'Филтър L{TaskBoard.columns}',
        filterSwimlanes        : 'Филтър L{TaskBoard.swimlanes}',
        filterTasks            : 'Филтър L{TaskBoard.tasks}',
        lock                   : 'Заключване',
        unlock                 : 'Отключи',
        moveColumnLeft         : 'Преместване L{TaskBoard.column} наляво',
        moveColumnRight        : 'Преместване L{TaskBoard.column} надясно',
        moveColumnUp           : 'Преместване L{TaskBoard.column} нагоре',
        moveColumnDown         : 'Преместване L{TaskBoard.column} надолу',
        moveColumnOutOfGroup   : 'Преместване L{TaskBoard.column} извън групата',
        moveColumnIntoGroup    : 'Преместване L{TaskBoard.column} в групата',
        groupWithLeftNeighbor  : 'Групиране с лявата съседна L{TaskBoard.column}',
        groupWithRightNeighbor : 'Групиране с дясната съседна L{TaskBoard.column}',
        name                   : 'Име',
        newTaskName            : 'Нов L{TaskBoard.task}',
        removeTask             : 'Премахване на L{TaskBoard.task}',
        removeTasks            : 'Премахване на L{TaskBoard.tasks}',
        resources              : 'Ресурси',
        save                   : 'Запис',
        scrollToColumn         : 'Превъртане до L{TaskBoard.column}',
        scrollToSwimlane       : 'Превъртане до L{TaskBoard.swimlane}',
        showColumnMenu         : 'Покажи меню на колоната',
        showTask               : 'Покажи L{TaskBoard.task}',
        unassigned             : 'Неприсвоени',
        zoom                   : 'Увеличаване'
    },

    ColumnFilters : {
        show         : 'Показване на филтър за колони',
        toggle       : 'Превключване на филтър за колони',
        clear        : 'Изчистване на филтрите за колони',
        badgeTooltip : count => `${count} филтър(и) приложени`
    },

    ColumnSort : {
        sort     : 'Сортиране на колоната',
        sortedBy : ({ label, ascending }) =>
            `Колоната е сортирана ${ascending ? 'възходящо' : 'низходящо'} по "${label}"`,
        reset : 'Нулиране на сортирането на колоните'
    },

    TaskMenuItem : {
        showTaskMenu : 'Покажи меню на задачата'
    },

    TodoListField : {
        add     : 'Добавяне',
        newTodo : 'Нова задача'
    },

    UndoRedo : {
        UndoLastAction : 'Отмяна',
        RedoLastAction : 'Възстановяване'
    },

    ColumnRename : {
        rename : 'Преименуване'
    },

    ColumnSearchField : {
        search    : 'Търсене',
        matchMode : (mode) => `Режим на търсене: ${mode}`,
        literal   : 'Буквално',
        and       : 'Всички думи (И)',
        or        : 'Всяка дума (ИЛИ)'
    }
};

export default LocaleHelper.publishLocale(locale);
