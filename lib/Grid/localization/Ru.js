import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Ru.js';

const emptyString = new String();

const locale = {

    localeName : 'Ru',
    localeDesc : 'Русский',
    localeCode : 'ru',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Поиск',
        selectAll   : 'Выбрать все',
        removeAll   : 'Убрать все',
        filtersSet  : n => n === 1 ? `1 фильтр установлен` : `${n} фильтров установлено`,
        noItems     : 'Результатов не найдено',
        placeholder : 'Фильтр...',
        apply       : 'Применить'
    },

    ColumnPicker : {
        column          : 'Колонка',
        columnsMenu     : 'Колонки',
        hideColumn      : 'Спрятать колонку',
        hideColumnShort : 'Спрятать',
        newColumns      : 'Новые столбцы',
        allColumns      : 'Все столбцы',
        showName        : column => `Показать столбец${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Скрыть столбец${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Применить фильтр',
        filter        : 'Фильтр',
        editFilter    : 'Изменить фильтр',
        on            : 'В этот день',
        before        : 'До',
        after         : 'После',
        equals        : 'Равно',
        lessThan      : 'Меньше, чем',
        moreThan      : 'Больше, чем',
        removeFilter  : 'Убрать фильтр',
        disableFilter : 'Отключить фильтр'
    },

    FilterBar : {
        enableFilterBar  : 'Показать панель фильтров',
        disableFilterBar : 'Спрятать панель фильтров'
    },

    Group : {
        group                : 'Группа',
        groupAscending       : 'Группа по возрастанию',
        groupDescending      : 'Группа по убыванию',
        groupAscendingShort  : 'Возрастание',
        groupDescendingShort : 'Убывание',
        stopGrouping         : 'Убрать группу',
        stopGroupingShort    : 'Убрать'
    },

    HeaderMenu : {
        moveBefore     : text => `Расположить перед "${text}"`,
        moveAfter      : text => `Расположить после "${text}"`,
        collapseColumn : 'Свернуть колонку',
        expandColumn   : 'Развернуть колонку'
    },

    ColumnRename : {
        rename : 'Переименовать'
    },

    ColumnResize : {
        resizeColumn : 'Изменить размер колонки',
        width        : 'Ширина',
        fitToData    : 'По размеру данных'
    },

    MergeCells : {
        mergeCells  : 'Объединить ячейки',
        menuTooltip : 'Объединить ячейки с одинаковыми значениями при сортировке по этому столбцу'
    },

    Search : {
        searchForValue : 'Найти значение'
    },

    Sort : {
        sort                   : 'Сортировка',
        sortAscending          : 'Сортировать по возрастанию',
        sortDescending         : 'Сортировать по убыванию',
        multiSort              : 'Сложная сортировка',
        removeSorter           : 'Убрать сортировку',
        addSortAscending       : 'Добавить сортировку по возрастанию',
        addSortDescending      : 'Добавить сортировку по убыванию',
        toggleSortAscending    : 'Сортировать по возрастанию',
        toggleSortDescending   : 'Сортировать по убыванию',
        sortAscendingShort     : 'Возрастание',
        sortDescendingShort    : 'Убывание',
        removeSorterShort      : 'Убрать',
        addSortAscendingShort  : '+ Возраст...',
        addSortDescendingShort : '+ Убыв...'
    },

    Split : {
        split        : 'Разделить',
        unsplit      : 'Неразделенный',
        horizontally : 'Горизонтально',
        vertically   : 'Вертикально',
        both         : 'Оба',
        top          : 'вверху',
        bottom       : 'внизу',
        left         : 'слева',
        right        : 'справа'
    },

    LockRows : {
        lockRow   : 'Заблокировать строку',
        unlockRow : 'Разблокировать строку'
    },

    ActionColumn : {
        rowActions : 'Действия с строкой'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} столбец. ` : ''}ПРОБЕЛ для контекстного меню${column.canSort ? ', ENTER для сортировки' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Виджеты строки'
    },

    Checkbox : {
        toggleRowSelect : 'Переключить выделение строки',
        toggleSelection : 'Переключить выбор всего набора данных',
        toggleName      : column => `Переключить ${column.text || 'значение'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `rating : ${column.location.record.get(column.field) || 0} || 0` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Номер строки'
    },

    GridBase : {
        loadFailedMessage  : 'Не удалось загрузить!',
        syncFailedMessage  : 'Не удалось синхронизировать!',
        unspecifiedFailure : 'Неуказанная ошибка',
        networkFailure     : 'Ошибка сети',
        parseFailure       : 'Не удалось разобрать ответ сервера',
        serverResponse     : 'Ответ сервера:',
        noRows             : 'Нет записей для отображения',
        moveColumnLeft     : 'Передвинуть в левую секцию',
        moveColumnRight    : 'Передвинуть в правую секцию',
        moveColumnTo       : region => `Переместить колонку в секцию ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 строка соответствует фильтру` : `${n} строки соответствуют фильтру`) : 'Нет строк, соответствующих фильтру'
    },

    CellMenu : {
        removeRow : 'Удалить'
    },

    RowCopyPaste : {
        copyRecord  : 'Копировать',
        cutRecord   : 'Вырезать',
        pasteRecord : 'Вставить',
        rows        : 'строки',
        row         : 'строка'
    },

    CellCopyPaste : {
        copy  : 'Копировать',
        cut   : 'Вырезать',
        paste : 'Вставить'
    },

    Charts : {
        chartDesigner : 'Создатель графиков',
        newChart      : 'Новая диаграмма',
        download      : 'Скачать',
        settings      : 'Настройки'
    },

    PdfExport : {
        'Waiting for response from server' : 'Ожидание ответа от сервера...',
        'Export failed'                    : 'Не удалось экспортировать',
        'Server error'                     : 'На сервере произошла ошибка',
        'Generating pages'                 : 'Генерация страниц...',
        'Click to abort'                   : 'Отмена'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '13em',
        exportSettings : 'Настройки',
        export         : 'Экспорт',
        printSettings  : 'Настройки печати',
        print          : 'Печать',
        exporterType   : 'Разбивка на страницы',
        cancel         : 'Отмена',
        fileFormat     : 'Формат файла',
        rows           : 'Строки',
        alignRows      : 'Выровнять строки',
        columns        : 'Колонки',
        paperFormat    : 'Размер листа',
        orientation    : 'Ориентация',
        repeatHeader   : 'Повторять заголовок'
    },

    ExportRowsCombo : {
        all     : 'Все строки',
        visible : 'Видимые строки'
    },

    ExportOrientationCombo : {
        portrait  : 'Портретная',
        landscape : 'Ландшафтная'
    },

    SinglePageExporter : {
        singlepage : 'Одна страница'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Одна страница (без масштабирования)'
    },

    MultiPageExporter : {
        multipage     : 'Многостраничный',
        exportingPage : ({ currentPage, totalPages }) => `Экспорт страницы ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Многостраничный (по вертикали)',
        exportingPage     : ({ currentPage, totalPages }) => `Экспорт страницы ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Загрузка',
        expand             : 'Развернуть',
        collapse           : 'Свернуть',
        columnDescription  : 'Переключить детали строки',
        expandedRowContent : 'Расширенное содержимое строки'
    },

    TreeGroup : {
        group                  : 'Группировать по',
        stopGrouping           : 'Прекратить группировку',
        stopGroupingThisColumn : 'Прекратить группировку этого столбца'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Операция фильтрации не удалась, пожалуйста, попробуйте снова'
    },

    AIFilterField : {
        progressText : 'Фильтрация'
    },

    PinColumns : {
        pinColumn  : 'Закрепить столбец',
        unpin      : 'Без закрепления',
        pinToStart : 'Закрепить в начале',
        pinToEnd   : 'Закрепить в конце'
    }
};

export default LocaleHelper.publishLocale(locale);
