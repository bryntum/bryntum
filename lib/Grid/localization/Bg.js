import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Bg.js';

const emptyString = new String();

const locale = {

    localeName : 'Bg',
    localeDesc : 'Български',
    localeCode : 'bg',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Търсене',
        selectAll   : 'Избери всички',
        removeAll   : 'Премахни всички',
        filtersSet  : n => n === 1 ? `1 филтър зададен` : `${n} филтъра зададени`,
        noItems     : 'Няма намерени резултати',
        placeholder : 'Филтрирай...',
        apply       : 'Приложи'
    },

    ColumnPicker : {
        column          : 'Колона',
        columnsMenu     : 'Колони',
        hideColumn      : 'Скриване на колона',
        hideColumnShort : 'Скриване',
        newColumns      : 'Нова колона',
        allColumns      : 'Всички колони',
        showName        : column => `Показване на колоната${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Скриване на колоната${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Прилагане на филтър',
        filter        : 'Филтри',
        editFilter    : 'Редактиране на филтър',
        on            : 'Вкл.',
        before        : 'Преди',
        after         : 'След',
        equals        : 'Равно',
        lessThan      : 'По-малко от',
        moreThan      : 'Повече от',
        removeFilter  : 'Премахване на филтър',
        disableFilter : 'Деактивиране на филтъра'
    },

    FilterBar : {
        enableFilterBar  : 'Показване на лентата с филтри',
        disableFilterBar : 'Скриване на лентата с филтри'
    },

    Group : {
        group                : 'Група',
        groupAscending       : 'Възходяща група',
        groupDescending      : 'Низходящ група',
        groupAscendingShort  : 'Възходящ',
        groupDescendingShort : 'Низходящ',
        stopGrouping         : 'Стоп на групиране',
        stopGroupingShort    : 'Стоп'
    },

    HeaderMenu : {
        moveBefore     : text => `Преместване преди "${text}"`,
        moveAfter      : text => `Преместване след "${text}"`,
        collapseColumn : 'Свиване на колона',
        expandColumn   : 'Разширяване на колона'
    },

    ColumnRename : {
        rename : 'Преименуване'
    },

    ColumnResize : {
        resizeColumn : 'Преоразмеряване на колона',
        width        : 'Ширина',
        fitToData    : 'Напасване към данните'
    },

    MergeCells : {
        mergeCells  : 'Сливане на клетки',
        menuTooltip : 'Сливане на клетки с една и съща стойност при сортиране по тази колона'
    },

    Search : {
        searchForValue : 'Търсене на стойност'
    },

    Sort : {
        sort                   : 'Сортиране',
        sortAscending          : 'Сортиране във възходящ ред',
        sortDescending         : 'Сортиране в низходящ ред',
        multiSort              : 'Мулти сортиране',
        removeSorter           : 'Премахване на сортировач',
        addSortAscending       : 'Добавяне на възходящ сортировач',
        addSortDescending      : 'Добавяне на низходящ сортировач',
        toggleSortAscending    : 'Промяна към възходящ',
        toggleSortDescending   : 'Промяна към низходящ',
        sortAscendingShort     : 'Възходящ',
        sortDescendingShort    : 'Низходящ',
        removeSorterShort      : 'Отстраняване',
        addSortAscendingShort  : '+ Възходящ',
        addSortDescendingShort : '+ Низходящ'
    },

    Split : {
        split        : 'Разделено',
        unsplit      : 'Неразделено',
        horizontally : 'Хоризонтално',
        vertically   : 'Вертикално',
        both         : 'И двете',
        top          : 'горе',
        bottom       : 'долу',
        left         : 'ляво',
        right        : 'дясно'
    },

    LockRows : {
        lockRow   : 'Заключване на ред',
        unlockRow : 'Отключване на ред'
    },

    ActionColumn : {
        rowActions : 'Действия за ред'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} колона. ` : ''}SPACE за контекстно меню${column.canSort ? ', ENTER за сортиране' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Редови джаджи'
    },

    Checkbox : {
        toggleRowSelect : 'Превключване на избора на ред',
        toggleSelection : 'Превключване на избора на целия набор от данни',
        toggleName      : column => `Превключване ${column.text || 'стойност'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `рейтинг : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Номер на реда'
    },

    GridBase : {
        loadFailedMessage  : 'Неуспешно зареждане на данни!',
        syncFailedMessage  : 'Неуспешна синхронизация за данни!',
        unspecifiedFailure : 'Неуточнена неизправност',
        networkFailure     : 'Грешка в мрежата',
        parseFailure       : 'Неуспешен анализ на отговора на сървъра',
        serverResponse     : 'Отговор на сървъра:',
        noRows             : 'Няма записи за показване',
        moveColumnLeft     : 'Преместване в лявата част',
        moveColumnRight    : 'Преместване в дясната част',
        moveColumnTo       : region => `Преместване на колоната в ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 ред съответства на филтъра` : `${n} реда съответстват на филтъра`) : 'Няма редове, които съответстват на филтъра'
    },

    CellMenu : {
        removeRow : 'Изтриване'
    },

    RowCopyPaste : {
        copyRecord  : 'Копирай',
        cutRecord   : 'Изрежи',
        pasteRecord : 'Постави',
        rows        : 'редове',
        row         : 'ред'
    },

    CellCopyPaste : {
        copy  : 'Копиране',
        cut   : 'Изрязване',
        paste : 'Вмъкване'
    },

    Charts : {
        chartDesigner : 'Проектиране на диаграми',
        newChart      : 'Нова диаграма',
        download      : 'Изтегляне',
        settings      : 'Настройки'
    },

    PdfExport : {
        'Waiting for response from server' : 'В очакване на отговор от сървъра...',
        'Export failed'                    : 'Неуспешен експорт',
        'Server error'                     : 'Грешка в сървъра',
        'Generating pages'                 : 'Генериране на страници...',
        'Click to abort'                   : 'Отказ'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Настройки на експорта',
        export         : 'Експорт',
        printSettings  : 'Настройки за печат',
        print          : 'Печат',
        exporterType   : 'Контрол на странирането',
        cancel         : 'Отказ',
        fileFormat     : 'Файлов формат',
        rows           : 'Редове',
        alignRows      : 'Подравняване на редовете',
        columns        : 'Колони',
        paperFormat    : 'Формат на документа',
        orientation    : 'Ориентация',
        repeatHeader   : 'Повтаряне на заглавката'
    },

    ExportRowsCombo : {
        all     : 'Всички редове',
        visible : 'Видими редове'
    },

    ExportOrientationCombo : {
        portrait  : 'Портрет',
        landscape : 'Пейзаж'
    },

    SinglePageExporter : {
        singlepage : 'Единична страница'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Една страница (без мащабиране)'
    },

    MultiPageExporter : {
        multipage     : 'Няколко страници',
        exportingPage : ({ currentPage, totalPages }) => `Експортиране на страница ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Няколко страници (вертикално)',
        exportingPage     : ({ currentPage, totalPages }) => `Експортиране на страница ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Зареждане',
        expand             : 'Разгръщане',
        collapse           : 'Свиване',
        columnDescription  : 'Превключване на детайлите на реда',
        expandedRowContent : 'Разширено съдържание на ред'
    },

    TreeGroup : {
        group                  : 'Групиране по',
        stopGrouping           : 'Спиране на групирането',
        stopGroupingThisColumn : 'Разгрупиране на колона'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Операцията по филтриране неуспешна, моля опитайте отново'
    },

    AIFilterField : {
        progressText : 'Филтриране'
    },

    PinColumns : {
        pinColumn  : 'Закрепи колона',
        unpin      : 'Без закрепване',
        pinToStart : 'Закрепи в началото',
        pinToEnd   : 'Закрепи в края'
    }
};

export default LocaleHelper.publishLocale(locale);
