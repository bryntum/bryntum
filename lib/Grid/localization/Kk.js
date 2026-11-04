import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Kk.js';

const emptyString = new String();

const locale = {

    localeName : 'Kk',
    localeDesc : 'Қазақ тілі (KZ)',
    localeCode : 'kk-KZ',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Іздеу',
        selectAll   : 'Барлығын таңдау',
        removeAll   : 'Барлығын өшіру',
        filtersSet  : n => n === 1 ? `1 сүзгі орнатылды` : `${n} сүзгі орнатылды`,
        noItems     : 'Нәтиже табылмады',
        placeholder : 'Сүзу...',
        apply       : 'Қолдану'
    },

    ColumnPicker : {
        column          : 'Баған',
        columnsMenu     : 'Бағандар',
        hideColumn      : 'Бағанды жасыру',
        hideColumnShort : 'Жасыру',
        newColumns      : 'Жаңа бағандар',
        allColumns      : 'Барлық бағандар',
        showName        : column => `${column.text ? `${column.text} ` : ''}бағанын көрсету`,
        hideName        : column => `${column.text ? `${column.text} ` : ''}бағанын жасыру`
    },

    Filter : {
        applyFilter   : 'Сүзгіні қолдану',
        filter        : 'Сүзгі',
        editFilter    : 'Сүзгіні өңдеу',
        on            : 'күні',
        before        : 'бұрын',
        after         : 'кейін',
        equals        : 'тең',
        lessThan      : 'аз',
        moreThan      : 'артық',
        removeFilter  : 'Сүзгіні жою',
        disableFilter : 'Сүзгіні өшіру'
    },

    FilterBar : {
        enableFilterBar  : 'Сүзгі жолағын көрсету',
        disableFilterBar : 'Сүзгі жолағын жасыру'
    },

    Group : {
        group                : 'Топтау',
        groupAscending       : 'Өсу ретімен топтау',
        groupDescending      : 'Кему ретімен топтау',
        groupAscendingShort  : 'Өсу реті бойынша',
        groupDescendingShort : 'Кему реті бойынша',
        stopGrouping         : 'Топтастыруды тоқтату',
        stopGroupingShort    : 'Тоқтату'
    },

    HeaderMenu : {
        moveBefore     : text => `Move before "${text}"`,
        moveAfter      : text => `Move after "${text}"`,
        collapseColumn : 'Бағанды жию',
        expandColumn   : 'Бағанды шығарып алу'
    },

    ColumnRename : {
        rename : 'Атауын өзгерту'
    },

    ColumnResize : {
        resizeColumn : 'Баған өлшемін өзгерту',
        width        : 'Ені',
        fitToData    : 'Деректерге сәйкестендіру'
    },

    MergeCells : {
        mergeCells  : 'Ұяшықтарды біріктіру',
        menuTooltip : 'Осы баған бойынша сұрыптау кезінде бірдей мәнді ұяшықтарды біріктіру'
    },

    Search : {
        searchForValue : 'Мәнді іздеу'
    },

    Sort : {
        sort                   : 'Сұрыптау',
        sortAscending          : 'Өсу ретімен сұрыптау',
        sortDescending         : 'Кему ретімен сұрыптау',
        multiSort              : 'Көп сұрыптау',
        removeSorter           : 'Сұрыптаушыны жою',
        addSortAscending       : 'Өсу реті бойынша сұрыптағышты қосу',
        addSortDescending      : 'Кему реті бойынша сұрыптағышты қосу',
        toggleSortAscending    : 'Өсу реті бойынша өзгерту',
        toggleSortDescending   : 'Кему реті бойынша өзгерту',
        sortAscendingShort     : 'Өсу реті бойынша',
        sortDescendingShort    : 'Кему реті бойынша',
        removeSorterShort      : 'Жою',
        addSortAscendingShort  : '+ арту ретімен',
        addSortDescendingShort : '+ кему ретімен'
    },

    Split : {
        split        : 'Бөлу',
        unsplit      : 'Бөлінбеген',
        horizontally : 'Көлденең',
        vertically   : 'Тігінен',
        both         : 'Екеуі де',
        top          : 'жоғарғы',
        bottom       : 'төменгі',
        left         : 'сол',
        right        : 'оң'
    },

    LockRows : {
        lockRow   : 'Құлыптау қатары',
        unlockRow : 'Құлыптау қатарын ашу'
    },

    ActionColumn : {
        rowActions : 'Жол әрекеттері'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} баған. ` : ''}Контекстік мәзірге арналған БОС ОРЫН${column.canSort ? ', сұрыптау үшін ЕНГІЗУ пернесін басыңыз' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Қатар виджеттері'
    },

    Checkbox : {
        toggleRowSelect : 'Жол таңдауын ауыстырып қосу',
        toggleSelection : 'Бүкіл деректер жиынын таңдауды ауыстырып қосу',
        toggleName      : column => `Ауыстыру ${column.text || 'мән'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `бағалау : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Жол нөмірі'
    },

    GridBase : {
        loadFailedMessage  : 'Деректерді жүктеу сәтсіз аяқталды!',
        syncFailedMessage  : 'Деректерді синхрондау сәтсіз аяқталды!',
        unspecifiedFailure : 'Көрсетілмеген ақау',
        networkFailure     : 'Желі қатесі',
        parseFailure       : 'Сервер жауабын талдау сәтсіз аяқталды',
        serverResponse     : 'Сервер жауабы:',
        noRows             : 'Көрсетілетін жазбалар жоқ',
        moveColumnLeft     : 'Сол жақ бөлімге жылжыту',
        moveColumnRight    : 'Оң жақ бөлімге жылжыту',
        moveColumnTo       : region => `Move column to ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 жол сүзгіге сәйкес келеді` : `${n} жолдар сүзгіге сәйкес келеді`) : 'Ешқандай жолдар сүзгіге сәйкес келмейді'
    },

    CellMenu : {
        removeRow : 'Жою'
    },

    RowCopyPaste : {
        copyRecord  : 'Көшіру',
        cutRecord   : 'Қию',
        pasteRecord : 'Қою',
        rows        : 'жолдар',
        row         : 'жол'
    },

    CellCopyPaste : {
        copy  : 'Көшіру',
        cut   : 'Қию',
        paste : 'Қою'
    },

    Charts : {
        chartDesigner : 'Диаграмма жасаушысы',
        newChart      : 'Жаңа Кесте',
        download      : 'Жүктеу',
        settings      : 'Баптаулар'
    },

    PdfExport : {
        'Waiting for response from server' : 'Серверден жауап күтілуде...',
        'Export failed'                    : 'Экспорттау мүмкін болмады',
        'Server error'                     : 'Сервер қатесі',
        'Generating pages'                 : 'Беттер құрылуда...',
        'Click to abort'                   : 'Баc тарту'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Экспорттау параметрлері',
        export         : 'Экспорттау',
        printSettings  : 'Басып шығару параметрлері',
        print          : 'Басып шығару',
        exporterType   : 'Беттерді нөмірлендіруді басқару',
        cancel         : 'Баc тарту',
        fileFormat     : 'Файл форматы',
        rows           : 'Қатарлар',
        alignRows      : 'Қатарларды тураландыру',
        columns        : 'Бағандар',
        paperFormat    : 'Қағаз форматы',
        orientation    : 'Бағдар',
        repeatHeader   : 'Жоғарғы колонтитулды басқару'
    },

    ExportRowsCombo : {
        all     : 'Барлық қатарлар',
        visible : 'Көрінетін қатарлар'
    },

    ExportOrientationCombo : {
        portrait  : 'Портрет',
        landscape : 'Пейзаж'
    },

    SinglePageExporter : {
        singlepage : 'Бір бет'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'Бір бет (масштабталмаған)'
    },

    MultiPageExporter : {
        multipage     : 'Бірнеше бет',
        exportingPage : ({ currentPage, totalPages }) => `Exporting page ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Бірнеше бет (тік)',
        exportingPage     : ({ currentPage, totalPages }) => `${currentPage}/${totalPages}-бет экспортталуда`
    },

    RowExpander : {
        loading            : 'Жүктелуде',
        expand             : 'Шығарып алу',
        collapse           : 'Жию',
        columnDescription  : 'Жол мәліметтерін ауыстыру',
        expandedRowContent : 'Кеңейтілген жол мазмұны'
    },

    TreeGroup : {
        group                  : 'Топтау әдісі',
        stopGrouping           : 'Топтастыруды тоқтату',
        stopGroupingThisColumn : 'Бағанды топтан шығару'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'Сүзгілеу операциясы сәтсіз аяқталды, қайтадан әрекет етіңіз'
    },

    AIFilterField : {
        progressText : 'Сүзу'
    },

    PinColumns : {
        pinColumn  : 'Бағанды бекіту',
        unpin      : 'Бекітуді алып тастау',
        pinToStart : 'Бастауға бекіту',
        pinToEnd   : 'Аяқтауға бекіту'
    }
};

export default LocaleHelper.publishLocale(locale);
