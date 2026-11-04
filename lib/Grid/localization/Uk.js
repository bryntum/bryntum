import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Uk.js';

const emptyString = new String();

const locale = {

    localeName : 'Uk',
    localeDesc : 'Українська',
    localeCode : 'uk-UA',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Пошук',
        selectAll   : 'Вибрати все',
        removeAll   : 'Скасувати все',
        filtersSet  : n => n === 1 ? `1 фільтр встановлено` : `${n} фільтрів встановлено`,
        noItems     : 'Результати не знайдено',
        placeholder : 'Фільтр...',
        apply       : 'Застосувати'
    },

    ColumnPicker : {
        column          : 'Стовпець',
        columnsMenu     : 'Стовпці',
        hideColumn      : 'Приховати стовпець',
        hideColumnShort : 'Приховати',
        newColumns      : 'Створити стовпці',
        allColumns      : 'Всі стовпці',
        showName        : column => `Показати стовпець${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Приховати стовпець${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Застосувати фільтр',
        filter        : 'Фільтр',
        editFilter    : 'Редагувати фільтр',
        on            : 'В',
        before        : 'До',
        after         : 'Після',
        equals        : 'Дорівнює',
        lessThan      : 'Менше',
        moreThan      : 'Більше',
        removeFilter  : 'Видалити фільтр',
        disableFilter : 'Вимкнути фільтр'
    },

    FilterBar : {
        enableFilterBar  : 'Показати панель фільтрування',
        disableFilterBar : 'Приховати панель фільтрування'
    },

    Group : {
        group                : 'Групувати',
        groupAscending       : 'Групувати за зростанням',
        groupDescending      : 'Групувати за спаданням',
        groupAscendingShort  : 'За зростанням',
        groupDescendingShort : 'За спаданням',
        stopGrouping         : 'Зупинити групування',
        stopGroupingShort    : 'Зупинити'
    },

    HeaderMenu : {
        moveBefore     : text => `Перемістити перед "${text}"`,
        moveAfter      : text => `Перемістити після "${text}"`,
        collapseColumn : 'Згорнути стовпець',
        expandColumn   : 'Розгорнути стовпець'
    },

    ColumnRename : {
        rename : 'Перейменувати'
    },

    ColumnResize : {
        resizeColumn : 'Змінити розмір стовпця',
        width        : 'Ширина',
        fitToData    : 'За розміром даних'
    },

    MergeCells : {
        mergeCells  : 'Об’єднати клітинки',
        menuTooltip : 'Об’єднати клітинки з однаковим значенням у разі сортування за цим стовпцем'
    },

    Search : {
        searchForValue : 'Пошук значення'
    },

    Sort : {
        sort                   : 'Сортувати',
        sortAscending          : 'Сортувати за зростанням',
        sortDescending         : 'Сортувати за спаданням',
        multiSort              : 'Сортування за кількома критеріями',
        removeSorter           : 'Видалити сортування',
        addSortAscending       : 'Додати сортування за зростанням',
        addSortDescending      : 'Додати сортування за спаданням',
        toggleSortAscending    : 'Змінити на сортування за зростанням',
        toggleSortDescending   : 'Змінити на сортування за спаданням',
        sortAscendingShort     : 'За зростанням',
        sortDescendingShort    : 'За спаданням',
        removeSorterShort      : 'Вилучити',
        addSortAscendingShort  : '+ за зростанням',
        addSortDescendingShort : '+ за спаданням'
    },

    Split : {
        split        : 'Розділити',
        unsplit      : 'Скасувати розділення',
        horizontally : 'Горизонтально',
        vertically   : 'Вертикально',
        both         : 'В обох напрямках',
        top          : 'вгорі',
        bottom       : 'внизу',
        left         : 'зліва',
        right        : 'справа'
    },

    LockRows : {
        lockRow   : 'Замковий ряд',
        unlockRow : 'Рядок без замка'
    },

    ActionColumn : {
        rowActions : 'Дії рядка'
    },

    Column : {
        columnLabel : column => `${column.text ? `Стовпець типу ${column.text}. ` : ''}Натисніть клавішу ПРОБІЛ для виклику контекстного меню${column.canSort ? ' або ENTER для сортування' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Віджети рядка'
    },

    Checkbox : {
        toggleRowSelect : 'Вибрати рядок або скасувати вибір',
        toggleSelection : 'Вибрати весь набір даних або скасувати вибір',
        toggleName      : column => `Перемкнути ${column.text || 'значення'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `Оцінка : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Номер рядка'
    },

    GridBase : {
        loadFailedMessage  : 'Не вдалося завантажити дані!',
        syncFailedMessage  : 'Не вдалося синхронізувати дані!',
        unspecifiedFailure : 'Невизначена помилка',
        networkFailure     : 'Помилка мережі',
        parseFailure       : 'Не вдалося проаналізувати відповідь сервера',
        serverResponse     : 'Відповідь сервера:',
        noRows             : 'Немає записів для відображення',
        moveColumnLeft     : 'Перемістити до лівого розділу',
        moveColumnRight    : 'Перемістити до правого розділу',
        moveColumnTo       : region => `Перемістити стовпець до ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 рядок відповідає фільтру` : `${n} рядки відповідають фільтру`) : 'Жоден рядок не відповідає фільтру'
    },

    CellMenu : {
        removeRow : 'Видалити'
    },

    RowCopyPaste : {
        copyRecord  : 'Копіювати',
        cutRecord   : 'Вирізати',
        pasteRecord : 'Вставити',
        rows        : 'Рядки',
        row         : 'Рядок'
    },

    CellCopyPaste : {
        copy  : 'Копіювати',
        cut   : 'Вирізати',
        paste : 'Вставити'
    },

    Charts : {
        chartDesigner : 'Дизайнер діаграм',
        newChart      : 'Нова діаграма',
        download      : 'Завантажити',
        settings      : 'Налаштування'
    },

    PdfExport : {
        'Waiting for response from server' : 'Очікування відповіді від сервера...',
        'Export failed'                    : 'Помилка під час спроби експортувати дані',
        'Server error'                     : 'Помилка сервера',
        'Generating pages'                 : 'Створення сторінок...',
        'Click to abort'                   : 'Скасувати'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Налаштування експорту даних',
        export         : 'Експортувати дані',
        printSettings  : 'Параметри друку',
        print          : 'Роздрукувати',
        exporterType   : 'Контрольна пагінація',
        cancel         : 'Скасувати',
        fileFormat     : 'Формат файлу',
        rows           : 'Рядки',
        alignRows      : 'Вирівняти рядки',
        columns        : 'Стовпці',
        paperFormat    : 'Формат аркуша',
        orientation    : 'Орієнтація',
        repeatHeader   : 'Повторювати заголовок'
    },

    ExportRowsCombo : {
        all     : 'Усі рядки',
        visible : 'Видимі рядки'
    },

    ExportOrientationCombo : {
        portrait  : 'Книжкова',
        landscape : 'Альбомна'
    },

    SinglePageExporter : {
        singlepage : 'Одна сторінка'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Одна сторінка (без масштабування)'
    },

    MultiPageExporter : {
        multipage     : 'Декілька сторінок',
        exportingPage : ({ currentPage, totalPages }) => `Експорт сторінки ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Декілька сторінок (книжкова орієнтація)',
        exportingPage     : ({ currentPage, totalPages }) => `Експорт сторінки ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Завантаження',
        expand             : 'Розгорнути',
        collapse           : 'Згорнути',
        columnDescription  : 'Перемкнути деталі рядка',
        expandedRowContent : 'Розгорнутий вміст рядка'
    },

    TreeGroup : {
        group                  : 'Групувати за',
        stopGrouping           : 'Зупинити групування',
        stopGroupingThisColumn : 'Розгрупувати стовпець'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Операція фільтрації не вдалася, спробуйте ще раз'
    },

    AIFilterField : {
        progressText : 'Фільтрування'
    },

    PinColumns : {
        pinColumn  : 'Закріпити стовпець',
        unpin      : 'Без закріплення',
        pinToStart : 'Закріпити на початку',
        pinToEnd   : 'Закріпити в кінці'
    }
};

export default LocaleHelper.publishLocale(locale);
