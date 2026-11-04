import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/He.js';

const locale = {

    localeName : 'He',
    localeDesc : 'עִברִית',
    localeCode : 'he',
    localeRtl  : true,

    GridBase : {
        loadFailedMessage : 'טעינת הנתונים נכשלה',
        syncFailedMessage : 'סנכרון הנתונים נכשל'
    },

    CrudManagerView : {
        serverResponseLabel : ':תגובת השרת'
    },

    TaskBoard : {
        column                 : 'עמודה',
        columns                : 'עמודות',
        Columns                : 'עמודות',
        swimlane               : 'מסלול שחייה',
        swimlanes              : 'מסלולי שחייה',
        Swimlanes              : 'מסלולי שחייה',
        task                   : 'משימה',
        tasks                  : 'משימות',
        addTask                : 'L{TaskBoard.task} הוסף',
        cancel                 : 'בטל',
        changeColumn           : 'L{TaskBoard.column} שנה',
        changeSwimlane         : 'L{TaskBoard.swimlane} שנה',
        collapse               : text => `${text} מזער`,
        color                  : 'צבע',
        description            : 'תיאור',
        editTask               : 'L{TaskBoard.task} ערוך',
        expand                 : text => `${text} הרחב`,
        filterColumns          : 'L{TaskBoard.columns} סנן',
        filterSwimlanes        : 'L{TaskBoard.swimlanes} סנן',
        filterTasks            : 'L{TaskBoard.tasks} סנן',
        lock                   : 'לִנְעוֹל',
        unlock                 : 'לִפְתוֹחַ',
        moveColumnLeft         : ' שמאלהL{TaskBoard.column} הזז',
        moveColumnRight        : ' ימינהL{TaskBoard.column} הזז',
        moveColumnUp           : ' למעלהL{TaskBoard.column} הזז',
        moveColumnDown         : ' למטהL{TaskBoard.column} הזז',
        moveColumnOutOfGroup   : ' מחוץ לקבוצהL{TaskBoard.column} הזז',
        moveColumnIntoGroup    : ' לקבוצהL{TaskBoard.column} הזז',
        groupWithLeftNeighbor  : 'קבץ עם L{TaskBoard.column} השכן משמאל',
        groupWithRightNeighbor : 'קבץ עם L{TaskBoard.column} השכן מימין',
        name                   : 'שם',
        newTaskName            : 'L{TaskBoard.task} חדש',
        removeTask             : 'L{TaskBoard.task} הסר',
        removeTasks            : 'L{TaskBoard.tasks} הסר',
        resources              : 'משאבים',
        save                   : 'שמור',
        scrollToColumn         : 'L{TaskBoard.column}-גלול ל',
        scrollToSwimlane       : 'L{TaskBoard.swimlane}-גלול ל',
        showColumnMenu         : 'הצג תפריט עמודה',
        showTask               : 'L{TaskBoard.task} הצג',
        unassigned             : 'לא מוקצה',
        zoom                   : 'זום'
    },

    ColumnFilters : {
        show         : 'הצג מסנן עמודות',
        toggle       : 'החלף מסנן עמודות',
        clear        : 'נקה מסנני עמודות',
        badgeTooltip : count => `${count} מסנן/ים הופעלו`
    },

    ColumnSort : {
        sort     : 'מיין עמודה',
        sortedBy : ({ label, ascending }) =>
            `עמודה מוינה ${ascending ? 'בסדר עולה' : 'בסדר יורד'} לפי "${label}"`,
        reset : 'איפוס מיון עמודות'
    },

    TaskMenuItem : {
        showTaskMenu : 'הצג תפריט משימות'
    },

    TodoListField : {
        add     : 'הוסף',
        newTodo : 'רשימת משימות חדשה'
    },

    UndoRedo : {
        UndoLastAction : 'בטל',
        RedoLastAction : 'בצע שוב'
    },

    ColumnRename : {
        rename : 'שינוי שם'
    },

    ColumnSearchField : {
        search    : 'חיפוש',
        matchMode : (mode) => `מצב חיפוש: ${mode}`,
        literal   : 'מילולי',
        and       : 'כל המילים (וגם)',
        or        : 'כל מילה (או)'
    }
};

export default LocaleHelper.publishLocale(locale);
