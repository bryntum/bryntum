import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/SrRs.js';

const emptyString = new String();

const locale = {

    localeName : 'SrRs',
    localeDesc : 'Српски (ћирилица)',
    localeCode : 'sr-RS',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Претрага',
        selectAll   : 'Изабери све',
        removeAll   : 'Уклони све',
        filtersSet  : n => n === 1 ? `1 филтер постављен` : `${n} филтера постављено`,
        noItems     : 'Нема резултата',
        placeholder : 'Филтер...',
        apply       : 'Примени'
    },

    ColumnPicker : {
        column          : 'Колона',
        columnsMenu     : 'Колоне',
        hideColumn      : 'Сакриј колону',
        hideColumnShort : 'Сакриј',
        newColumns      : 'Нове колоне',
        allColumns      : 'Све колоне',
        showName        : column => `Прикажи колону${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Сакриј колону${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Примени филтер',
        filter        : 'Филтер',
        editFilter    : 'Уреди филтер',
        on            : 'Дана',
        before        : 'Пре',
        after         : 'након',
        equals        : 'Једнако',
        lessThan      : 'Мање од',
        moreThan      : 'Веће од',
        removeFilter  : 'Уклони филтер',
        disableFilter : 'Онемогући филтер'
    },

    FilterBar : {
        enableFilterBar  : 'Прикажи траку са филтерима',
        disableFilterBar : 'Сакриј траку са филтерима'
    },

    Group : {
        group                : 'Групиши',
        groupAscending       : 'Групиши по растућем редоследу',
        groupDescending      : 'Групиши по опадајућем редоследу',
        groupAscendingShort  : 'Растуће',
        groupDescendingShort : 'Опадајуће',
        stopGrouping         : 'Заустави груписање',
        stopGroupingShort    : 'Заустави'
    },

    HeaderMenu : {
        moveBefore     : text => `Помери пре "${text}"`,
        moveAfter      : text => `Помери после "${text}"`,
        collapseColumn : 'Скупи колону',
        expandColumn   : 'Развиј колону'
    },

    ColumnRename : {
        rename : 'Преименуј'
    },

    ColumnResize : {
        resizeColumn : 'Промени величину колоне',
        width        : 'Ширина',
        fitToData    : 'Прилагоди подацима'
    },

    MergeCells : {
        mergeCells  : 'Обједини ћелије',
        menuTooltip : 'Обједини ћелије са истом вредношћу када су сортиране по овој колони'
    },

    Search : {
        searchForValue : 'Претрага вредности'
    },

    Sort : {
        sort                   : 'Сортирање',
        sortAscending          : 'Сортирај по растућем редоследу',
        sortDescending         : 'Сортирај по опадајућем редоследу',
        multiSort              : 'Вишеструко сортирање',
        removeSorter           : 'Уклони сортирање',
        addSortAscending       : 'Додај сортирање по растућем редоследу',
        addSortDescending      : 'Додај сортирање по опадајућем редоследу',
        toggleSortAscending    : 'Промени на растући редослед',
        toggleSortDescending   : 'Промени на опадајући редослед',
        sortAscendingShort     : 'Растуће',
        sortDescendingShort    : 'Опадајуће',
        removeSorterShort      : 'Уклони',
        addSortAscendingShort  : '+ растуће',
        addSortDescendingShort : '+ опадајуће'
    },

    Split : {
        split        : 'Раздели',
        unsplit      : 'Опозови раздељивање',
        horizontally : 'Хоризонтално',
        vertically   : 'Вертикално',
        both         : 'И једно и друго',
        top          : 'горе',
        bottom       : 'доле',
        left         : 'лево',
        right        : 'десно'
    },

    LockRows : {
        lockRow   : 'Закључај ред',
        unlockRow : 'Откључај ред'
    },

    ActionColumn : {
        rowActions : 'Радње у реду'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} колона. ` : ''}Притисните РАЗМАКНИЦУ за контекстуални мени${column.canSort ? ', тастер ENTER за сортирање' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Ред виджети'
    },

    Checkbox : {
        toggleRowSelect : 'Укључи/искључи избор реда',
        toggleSelection : 'Укључи/искључи избор целог скупа података',
        toggleName      : column => `Пребаци ${column.text || 'вредност'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `оцена: ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Број реда'
    },

    GridBase : {
        loadFailedMessage  : 'Учитавање података није успело!',
        syncFailedMessage  : 'Синхронизација података није успела!',
        unspecifiedFailure : 'Неодређено отказивање',
        networkFailure     : 'Грешка на мрежи',
        parseFailure       : 'Рашчлањивање одговора сервера није успело',
        serverResponse     : 'Одговор сервера:',
        noRows             : 'Нема записа за приказивање',
        moveColumnLeft     : 'Премести у леви одељак',
        moveColumnRight    : 'Премети у десни одељак',
        moveColumnTo       : region => `Помери колону у ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 ред одговара филтеру` : `${n} редова одговара филтеру`) : 'Ниједан ред не одговара филтеру'
    },

    CellMenu : {
        removeRow : 'Избриши'
    },

    RowCopyPaste : {
        copyRecord  : 'Копирај',
        cutRecord   : 'Исеци',
        pasteRecord : 'Налепи',
        rows        : 'редови',
        row         : 'ред'
    },

    CellCopyPaste : {
        copy  : 'Копирај',
        cut   : 'Исеци',
        paste : 'Налепи'
    },

    Charts : {
        chartDesigner : 'Дизајнер графикона',
        newChart      : 'Нови графикон',
        download      : 'Преузимање',
        settings      : 'Подешавања'
    },

    PdfExport : {
        'Waiting for response from server' : 'Чекање на одговор са сервера...',
        'Export failed'                    : 'Извоз није успео',
        'Server error'                     : 'Грешка сервера',
        'Generating pages'                 : 'Генерисање страница...',
        'Click to abort'                   : 'Откажи'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Извоз подешавања',
        export         : 'Извоз',
        printSettings  : 'Подешавања штампања',
        print          : 'Принт',
        exporterType   : 'Контрола поставке страница',
        cancel         : 'Откажи',
        fileFormat     : 'Формат датотека',
        rows           : 'Редови',
        alignRows      : 'Поравнај редове',
        columns        : 'Колоне',
        paperFormat    : 'Папирни формат',
        orientation    : 'Оријентација',
        repeatHeader   : 'Понови заглавље'
    },

    ExportRowsCombo : {
        all     : 'Сви редови',
        visible : 'Видљиви редови'
    },

    ExportOrientationCombo : {
        portrait  : 'Усправно',
        landscape : 'Положено'
    },

    SinglePageExporter : {
        singlepage : 'Једна страница'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Једна страница (без скалирања)'
    },

    MultiPageExporter : {
        multipage     : 'Више страница',
        exportingPage : ({ currentPage, totalPages }) => `Извоз странице ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Више страница (vertical)',
        exportingPage     : ({ currentPage, totalPages }) => `Извоз странице ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Учитавање',
        expand             : 'Развиј',
        collapse           : 'Скупи',
        columnDescription  : 'Прикажи/сакриј детаље реда',
        expandedRowContent : 'Садржај проширеног реда'
    },

    TreeGroup : {
        group                  : 'Групиши по',
        stopGrouping           : 'Заустави груписање',
        stopGroupingThisColumn : 'Разгрупиши колону'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Операција филтрирања није успела, молимо покушајте поново'
    },

    AIFilterField : {
        progressText : 'Филтрирање'
    },

    PinColumns : {
        pinColumn  : 'Закачи колону',
        unpin      : 'Без закачења',
        pinToStart : 'Закачи на почетак',
        pinToEnd   : 'Закачи на крај'
    }
};

export default LocaleHelper.publishLocale(locale);
