import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Kk.js';

const locale = {

    localeName : 'Kk',
    localeDesc : 'Қазақ тілі (KZ)',
    localeCode : 'kk-KZ',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Деректерді жүктеу сәтсіз аяқталды!',
        syncFailedMessage : 'Деректерді синхрондау сәтсіз аяқталды!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Сервер жауабы:'
    },

    TaskBoard : {
        column                 : 'баған',
        columns                : 'бағандар',
        Columns                : 'Бағандар',
        swimlane               : 'жүзу жолы',
        swimlanes              : 'жүзу жолдары',
        Swimlanes              : 'Жүзу жолдары',
        task                   : 'тапсырма',
        tasks                  : 'тапсырмалар',
        addTask                : 'L{TaskBoard.task} қосу',
        cancel                 : 'Баc тарту',
        changeColumn           : 'L{TaskBoard.column} өзгерту',
        changeSwimlane         : 'L{TaskBoard.swimlane} өзгерту',
        collapse               : text => `${text} жиыру`,
        color                  : 'Түсі',
        description            : 'Сипаттамасы',
        editTask               : 'L{TaskBoard.task} өңдеу',
        expand                 : text => `${text} жаю`,
        filterColumns          : 'L{TaskBoard.columns} сүзгісі',
        filterSwimlanes        : 'L{TaskBoard.swimlanes} сүзгісі',
        filterTasks            : 'L{TaskBoard.tasks} сүзгісі',
        lock                   : 'Құлыптау',
        unlock                 : 'Құлыпты ашу',
        moveColumnLeft         : 'L{TaskBoard.column} солға қарай жылжыту',
        moveColumnRight        : 'L{TaskBoard.column} оңға қарай жылжыту',
        moveColumnUp           : 'L{TaskBoard.column} жоғары қарай жылжыту',
        moveColumnDown         : 'L{TaskBoard.column} төмен қарай жылжыту',
        moveColumnOutOfGroup   : 'L{TaskBoard.column} топтан тыс жылжыту',
        moveColumnIntoGroup    : 'L{TaskBoard.column} топқа жылжыту',
        groupWithLeftNeighbor  : 'Сол жақ көрші L{TaskBoard.column} бірге топтау',
        groupWithRightNeighbor : 'Оң жақ көрші L{TaskBoard.column} бірге топтау',
        name                   : 'Аты',
        newTaskName            : 'Жаңа L{TaskBoard.task}',
        removeTask             : 'L{TaskBoard.task} алып тастау',
        removeTasks            : 'L{TaskBoard.tasks} алып тастау',
        resources              : 'Ресурстар',
        save                   : 'Сақтау',
        scrollToColumn         : 'L{TaskBoard.column} бағанына дейін айналдыру',
        scrollToSwimlane       : 'L{TaskBoard.swimlane} жүзу жолына дейін айналдыру',
        showColumnMenu         : 'Баған менюсін көрсету',
        showTask               : 'L{TaskBoard.task} көрсету',
        unassigned             : 'Тағайындалмаған',
        zoom                   : 'Ұлғайту'
    },

    ColumnFilters : {
        show         : 'Баған сүзгісін көрсету',
        toggle       : 'Баған сүзгісін ауыстыру',
        clear        : 'Баған сүзгілерін тазалау',
        badgeTooltip : count => `${count} сүзгі(лер) қолданылды`
    },

    ColumnSort : {
        sort     : 'Бағанды сұрыптау',
        sortedBy : ({ label, ascending }) =>
            `Баған "${label}" бойынша ${ascending ? 'өсу ретімен' : 'кему ретімен'} сұрыпталды`,
        reset : 'Бағанды сұрыптауды қалпына келтіру'
    },

    TaskMenuItem : {
        showTaskMenu : 'Тапсырма менюсін көрсету'
    },

    TodoListField : {
        add     : 'Қосу',
        newTodo : 'Жаңа тапсырма'
    },

    UndoRedo : {
        UndoLastAction : 'Болдырмау',
        RedoLastAction : 'Қайталау'
    },

    ColumnRename : {
        rename : 'Атын өзгерту'
    },

    ColumnSearchField : {
        search    : 'Іздеу',
        matchMode : (mode) => `Іздеу режимі: ${mode}`,
        literal   : 'Әріптік',
        and       : 'Барлық сөздер (ЖӘНЕ)',
        or        : 'Кез келген сөз (НЕМЕСЕ)'
    }
};

export default LocaleHelper.publishLocale(locale);
