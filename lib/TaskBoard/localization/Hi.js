import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Hi.js';

const locale = {

    localeName : 'Hi',
    localeDesc : 'हिन्दी',
    localeCode : 'hi',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'डेटा लोडिंग विफल रहा!',
        syncFailedMessage : 'डेटा सिक्रोनाइजेशन विफल रहा!'
    },

    CrudManagerView : {
        serverResponseLabel : 'सर्वर प्रतिक्रिया:'
    },

    TaskBoard : {
        column                 : 'कॉलम',
        columns                : 'कॉलम',
        Columns                : 'कॉलम',
        swimlane               : 'स्विमलेन',
        swimlanes              : 'स्विमलेन्स',
        Swimlanes              : 'स्विमलेन्स',
        task                   : 'टास्क',
        tasks                  : 'टास्क',
        addTask                : 'L{TaskBoard.task} जोड़ें',
        cancel                 : 'रद्द करें',
        changeColumn           : 'L{TaskBoard.column} बदलें',
        changeSwimlane         : 'L{TaskBoard.swimlane} बदलें',
        collapse               : text => `${text} समेटें`,
        color                  : 'रंग',
        description            : 'विवरण',
        editTask               : 'L{TaskBoard.task} संपादित करें',
        expand                 : text => `${text} फैलाएं`,
        filterColumns          : 'L{TaskBoard.columns} फिल्टर करें',
        filterSwimlanes        : 'L{TaskBoard.swimlanes} फिल्टर करें',
        filterTasks            : 'L{TaskBoard.tasks} फिल्टर करें',
        lock                   : 'ताला',
        unlock                 : 'अनलॉक',
        moveColumnLeft         : 'L{TaskBoard.column} बाएं ले जाएं',
        moveColumnRight        : 'L{TaskBoard.column} दाएं ले जाएं',
        moveColumnUp           : 'L{TaskBoard.column} ऊपर ले जाएं',
        moveColumnDown         : 'L{TaskBoard.column} नीचे ले जाएं',
        moveColumnOutOfGroup   : 'L{TaskBoard.column} समूह से बाहर ले जाएं',
        moveColumnIntoGroup    : 'L{TaskBoard.column} समूह में ले जाएं',
        groupWithLeftNeighbor  : 'बाएं पड़ोसी L{TaskBoard.column} के साथ समूहित करें',
        groupWithRightNeighbor : 'दाएं पड़ोसी L{TaskBoard.column} के साथ समूहित करें',
        name                   : 'नाम',
        newTaskName            : 'L{TaskBoard.task} नया',
        removeTask             : 'L{TaskBoard.task} निकालें',
        removeTasks            : 'L{TaskBoard.tasks} निकालें',
        resources              : 'संसाधन',
        save                   : 'सहेजें',
        scrollToColumn         : 'L{TaskBoard.column} पर स्क्रोल करें',
        scrollToSwimlane       : 'L{TaskBoard.swimlane} पर स्क्रोल करें',
        showColumnMenu         : 'कॉलम मेनू दिखाएं',
        showTask               : 'L{TaskBoard.task} दिखाएँ',
        unassigned             : 'असाइन नहीं किया गया',
        zoom                   : 'ज़ूम करें'
    },

    ColumnFilters : {
        show         : 'कॉलम फ़िल्टर दिखाएँ',
        toggle       : 'कॉलम फ़िल्टर टॉगल करें',
        clear        : 'कॉलम फ़िल्टर साफ़ करें',
        badgeTooltip : count => `${count} फ़िल्टर लागू किए गए`
    },

    ColumnSort : {
        sort     : 'स्तंभ को क्रमबद्ध करें',
        sortedBy : ({ label, ascending }) =>
            `"${label}" द्वारा ${ascending ? 'आरोही' : 'अवरोही'} क्रम में क्रमबद्ध किया गया`,
        reset : 'कॉलम क्रमबद्धता रीसेट करें'
    },

    TaskMenuItem : {
        showTaskMenu : 'कार्य मेनू दिखाएं'
    },

    TodoListField : {
        add     : 'जोड़ें',
        newTodo : 'नया कार्य'
    },

    UndoRedo : {
        UndoLastAction : 'अनडू करें',
        RedoLastAction : 'रीडू करें'
    },

    ColumnRename : {
        rename : 'नाम बदलें'
    },

    ColumnSearchField : {
        search    : 'खोजें',
        matchMode : (mode) => `खोज मोड: ${mode}`,
        literal   : 'शाब्दिक',
        and       : 'सभी शब्द (AND)',
        or        : 'कोई भी शब्द (OR)'
    }
};

export default LocaleHelper.publishLocale(locale);
