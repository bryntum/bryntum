import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Uk.js';

const locale = {

    localeName : 'Uk',
    localeDesc : 'Українська',
    localeCode : 'uk-UA',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Не вдалося завантажити дані!',
        syncFailedMessage : 'Не вдалося синхронізувати дані!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Відповідь сервера:'
    },

    TaskBoard : {
        column                 : 'стовпець',
        columns                : 'стовпці',
        Columns                : 'Стовпці',
        swimlane               : 'доріжка',
        swimlanes              : 'доріжки',
        Swimlanes              : 'Доріжки',
        task                   : 'завдання',
        tasks                  : 'завдання',
        addTask                : 'Додати L{TaskBoard.task}',
        cancel                 : 'Скасувати',
        changeColumn           : 'Змінити L{TaskBoard.column}',
        changeSwimlane         : 'Змінити L{TaskBoard.swimlane}',
        collapse               : text => `Згорнути ${text}`,
        color                  : 'Колір',
        description            : 'Опис',
        editTask               : 'Редагувати L{TaskBoard.task}',
        expand                 : text => `Розгорнути ${text}`,
        filterColumns          : 'Фільтрувати по L{TaskBoard.columns}',
        filterSwimlanes        : 'Фільтрувати по L{TaskBoard.swimlanes}',
        filterTasks            : 'Фільтрувати по L{TaskBoard.tasks}',
        lock                   : 'Замок',
        unlock                 : 'Розблокувати',
        moveColumnLeft         : 'Перемістити L{TaskBoard.column} ліворуч',
        moveColumnRight        : 'Перемістити L{TaskBoard.column} праворуч',
        moveColumnUp           : 'Перемістити L{TaskBoard.column} вгору',
        moveColumnDown         : 'Перемістити L{TaskBoard.column} вниз',
        moveColumnOutOfGroup   : 'Перемістити L{TaskBoard.column} за межі групи',
        moveColumnIntoGroup    : 'Перемістити L{TaskBoard.column} до групи',
        groupWithLeftNeighbor  : 'Згрупувати з лівим сусіднім L{TaskBoard.column}',
        groupWithRightNeighbor : 'Згрупувати з правим сусіднім L{TaskBoard.column}',
        name                   : 'Назва',
        newTaskName            : 'Нове L{TaskBoard.task}',
        removeTask             : 'Видалити L{TaskBoard.task}',
        removeTasks            : 'Видалити L{TaskBoard.tasks}',
        resources              : 'Ресурси',
        save                   : 'Зберегти',
        scrollToColumn         : 'Прокрутити до L{TaskBoard.column}',
        scrollToSwimlane       : 'Прокрутити до L{TaskBoard.swimlane}',
        showColumnMenu         : 'Показати меню стовпця',
        showTask               : 'Показати L{TaskBoard.task}',
        unassigned             : 'Не призначено',
        zoom                   : 'Змінити масштаб'
    },

    ColumnFilters : {
        show         : 'Показати фільтр стовпця',
        toggle       : 'Перемкнути фільтр стовпця',
        clear        : 'Очистити фільтри стовпців',
        badgeTooltip : count => `${count} фільтр(и) застосовано`
    },

    ColumnSort : {
        sort     : 'Сортувати стовпець',
        sortedBy : ({ label, ascending }) =>
            `Стовпець відсортовано ${ascending ? 'за зростанням' : 'за спаданням'} за "${label}"`,
        reset : 'Скинути сортування стовпців'
    },

    TaskMenuItem : {
        showTaskMenu : 'Показати меню завдань'
    },

    TodoListField : {
        add     : 'Додати',
        newTodo : 'Нове завдання'
    },

    UndoRedo : {
        UndoLastAction : 'Скасувати',
        RedoLastAction : 'Повторити'
    },

    ColumnRename : {
        rename : 'Перейменувати'
    },

    ColumnSearchField : {
        search    : 'Пошук',
        matchMode : (mode) => `Режим пошуку: ${mode}`,
        literal   : 'Дослівно',
        and       : 'Усі слова (І)',
        or        : 'Будь-яке слово (АБО)'
    }
};

export default LocaleHelper.publishLocale(locale);
