import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Ar.js';

const locale = {

    localeName : 'Ar',
    localeDesc : 'اللغة العربية',
    localeCode : 'ar',
    localeRtl  : true,

    GridBase : {
        loadFailedMessage : '!فشل تحميل البيانات',
        syncFailedMessage : '!فشل تزامن البيانات'
    },

    CrudManagerView : {
        serverResponseLabel : ':استجابة الخادم'
    },

    TaskBoard : {
        column                 : 'عمود',
        columns                : 'أعمدة',
        Columns                : 'أعمدة',
        swimlane               : 'حارة السباحة',
        swimlanes              : 'حارات السباحة',
        Swimlanes              : 'حارات السباحة',
        task                   : 'المهمة',
        tasks                  : 'المهام',
        addTask                : 'L{TaskBoard.task} إضافة',
        cancel                 : 'إلغاء',
        changeColumn           : 'L{TaskBoard.column} تغيير',
        changeSwimlane         : 'L{TaskBoard.swimlane} تغيير',
        collapse               : text => `${text} تصغير`,
        color                  : 'لون',
        description            : 'وصف',
        editTask               : 'L{TaskBoard.task} تعديل',
        expand                 : text => `${text} توسيع`,
        filterColumns          : 'L{TaskBoard.columns} تصفية',
        filterSwimlanes        : 'L{TaskBoard.swimlanes} تصفية',
        filterTasks            : 'L{TaskBoard.tasks} تصفية',
        lock                   : 'قفل',
        unlock                 : 'فتح',
        moveColumnLeft         : ' اليسارL{TaskBoard.column} نقل',
        moveColumnRight        : ' الحقL{TaskBoard.column} نقل',
        moveColumnUp           : ' الأعلىL{TaskBoard.column} نقل',
        moveColumnDown         : ' الأسفلL{TaskBoard.column} نقل',
        moveColumnOutOfGroup   : ' خارج المجموعةL{TaskBoard.column} نقل',
        moveColumnIntoGroup    : ' إلى المجموعةL{TaskBoard.column} نقل',
        groupWithLeftNeighbor  : 'تجميع مع L{TaskBoard.column} المجاور الأيسر',
        groupWithRightNeighbor : 'تجميع مع L{TaskBoard.column} المجاور الأيمن',
        name                   : 'اسم',
        newTaskName            : 'L{TaskBoard.task} جديد',
        removeTask             : 'L{TaskBoard.task} إزالة',
        removeTasks            : 'L{TaskBoard.tasks} إزالة',
        resources              : 'موارد',
        save                   : 'حفظ',
        scrollToColumn         : 'L{TaskBoard.column} التمرير حتى',
        scrollToSwimlane       : 'L{TaskBoard.swimlane} التمرير حتى',
        showColumnMenu         : 'إظهار قائمة العمود',
        showTask               : 'L{TaskBoard.task} عرض',
        unassigned             : 'غير معين',
        zoom                   : 'تكبير'
    },

    ColumnFilters : {
        show         : 'إظهار مرشح العمود',
        toggle       : 'تبديل مرشح العمود',
        clear        : 'مسح مرشحات الأعمدة',
        badgeTooltip : count => `${count} مرشح/مرشحات مطبقة`
    },

    ColumnSort : {
        sort     : 'فرز العمود',
        sortedBy : ({ label, ascending }) =>
            `تم فرز العمود ${ascending ? 'تصاعديًا' : 'تنازليًا'} حسب "${label}"`,
        reset : 'إعادة تعيين ترتيب الأعمدة'
    },

    TaskMenuItem : {
        showTaskMenu : 'إظهار قائمة المهام'
    },

    TodoListField : {
        add     : 'إضافة',
        newTodo : 'جديدة مهمة'
    },

    UndoRedo : {
        UndoLastAction : 'إلغاء',
        RedoLastAction : 'إعادة'
    },

    ColumnRename : {
        rename : 'إعادة التسمية'
    },

    ColumnSearchField : {
        search    : 'بحث',
        matchMode : (mode) => `وضع البحث: ${mode}`,
        literal   : 'حرفي',
        and       : 'جميع الكلمات (و)',
        or        : 'أي كلمة (أو)'
    }
};

export default LocaleHelper.publishLocale(locale);
