import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Ru.js';

const locale = {

    localeName : 'Ru',
    localeDesc : 'Русский',
    localeCode : 'ru',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Не удалось загрузить!',
        syncFailedMessage : 'Не удалось синхронизировать!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Ответ сервера:'
    },

    TaskBoard : {
        column                 : 'колонку',
        columns                : 'колонки',
        Columns                : 'Колонки',
        swimlane               : 'полосу',
        swimlanes              : 'полосы',
        Swimlanes              : 'Полосы',
        task                   : 'задачу',
        tasks                  : 'задачи',
        addTask                : 'Добавить L{TaskBoard.task}',
        cancel                 : 'Отмена',
        changeColumn           : 'Изменить L{TaskBoard.column}',
        changeSwimlane         : 'Изменить L{TaskBoard.swimlane}',
        collapse               : text => `Сжать ${text}`,
        color                  : 'Цвет',
        description            : 'Описание',
        editTask               : 'Изменить L{TaskBoard.task}',
        expand                 : text => `Расширить ${text}`,
        filterColumns          : 'Фильтровать L{TaskBoard.columns}',
        filterSwimlanes        : 'Фильтровать L{TaskBoard.swimlanes}',
        filterTasks            : 'Фильтровать L{TaskBoard.tasks}',
        lock                   : 'Замок',
        unlock                 : 'Разблокировать',
        moveColumnLeft         : 'Переместить L{TaskBoard.column} влево',
        moveColumnRight        : 'Переместить L{TaskBoard.column} вправо',
        moveColumnUp           : 'Переместить L{TaskBoard.column} вверх',
        moveColumnDown         : 'Переместить L{TaskBoard.column} вниз',
        moveColumnOutOfGroup   : 'Переместить L{TaskBoard.column} из группы',
        moveColumnIntoGroup    : 'Переместить L{TaskBoard.column} в группу',
        groupWithLeftNeighbor  : 'Сгруппировать с левым соседним L{TaskBoard.column}',
        groupWithRightNeighbor : 'Сгруппировать с правым соседним L{TaskBoard.column}',
        name                   : 'Имя',
        newTaskName            : 'Создать L{TaskBoard.task}',
        removeTask             : 'Удалить L{TaskBoard.task}',
        removeTasks            : 'Удалить L{TaskBoard.tasks}',
        resources              : 'Ресурсы',
        save                   : 'Сохранить',
        scrollToColumn         : 'Переместиться в L{TaskBoard.column}',
        scrollToSwimlane       : 'Переместиться в L{TaskBoard.swimlane}',
        showColumnMenu         : 'Показать меню столбца',
        showTask               : 'Показать задание',
        unassigned             : 'Не назначено',
        zoom                   : 'Увеличить'
    },

    ColumnFilters : {
        show         : 'Показать фильтр столбца',
        toggle       : 'Переключить фильтр столбца',
        clear        : 'Очистить фильтры столбцов',
        badgeTooltip : count => `${count} фильтр(ов) применено`
    },

    ColumnSort : {
        sort     : 'Сортировать столбец',
        sortedBy : ({ label, ascending }) =>
            `Столбец отсортирован ${ascending ? 'по возрастанию' : 'по убыванию'} по "${label}"`,
        reset : 'Сбросить сортировку столбцов'
    },

    TaskMenuItem : {
        showTaskMenu : 'Показать меню задач'
    },

    TodoListField : {
        add     : 'Добавить',
        newTodo : 'Новая задача'
    },

    UndoRedo : {
        UndoLastAction : 'Повторить',
        RedoLastAction : 'Отменить'
    },

    ColumnRename : {
        rename : 'Переименовать'
    },

    ColumnSearchField : {
        search    : 'Поиск',
        matchMode : (mode) => `Режим поиска: ${mode}`,
        literal   : 'Буквальный',
        and       : 'Все слова (И)',
        or        : 'Любое слово (ИЛИ)'
    }
};

export default LocaleHelper.publishLocale(locale);
