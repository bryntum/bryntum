import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/El.js';

const locale = {

    localeName : 'El',
    localeDesc : 'Ελληνικά',
    localeCode : 'el',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Η φόρτωση των δεδομένων απέτυχε!',
        syncFailedMessage : 'Ο συγχρονισμός των δεδομένων απέτυχε!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Απόκριση διακομιστή:'
    },

    TaskBoard : {
        column                 : 'στήλη',
        columns                : 'στήλες',
        Columns                : 'Στήλες',
        swimlane               : 'κλειστή λωρίδα',
        swimlanes              : 'κλειστές λωρίδες',
        Swimlanes              : 'Κλειστές λωρίδες',
        task                   : 'διεργασία',
        tasks                  : 'διεργασίες',
        addTask                : 'Προσθήκη L{TaskBoard.task}',
        cancel                 : 'Ακύρωση',
        changeColumn           : 'Αλλαγή L{TaskBoard.column}',
        changeSwimlane         : 'Αλλαγή L{TaskBoard.swimlane}',
        collapse               : text => `Κλείσιμο ${text}`,
        color                  : 'Χρώμα',
        description            : 'Περιγραφή',
        editTask               : 'Επεξεργασία L{TaskBoard.task}',
        expand                 : text => `Άνοιγμα ${text}`,
        filterColumns          : 'Φίλτρο L{TaskBoard.columns}',
        filterSwimlanes        : 'Φίλτρο L{TaskBoard.swimlanes}',
        filterTasks            : 'Φίλτρο L{TaskBoard.tasks}',
        lock                   : 'Κλειδαριά',
        unlock                 : 'Ξεκλειδώνω',
        moveColumnLeft         : 'Μετακίνηση του L{TaskBoard.column} αριστερά',
        moveColumnRight        : 'Μετακίνηση του L{TaskBoard.column} δεξιά',
        moveColumnUp           : 'Μετακίνηση του L{TaskBoard.column} πάνω',
        moveColumnDown         : 'Μετακίνηση του L{TaskBoard.column} κάτω',
        moveColumnOutOfGroup   : 'Μετακίνηση του L{TaskBoard.column} εκτός ομάδας',
        moveColumnIntoGroup    : 'Μετακίνηση του L{TaskBoard.column} στην ομάδα',
        groupWithLeftNeighbor  : 'Ομαδοποίηση με το αριστερό γειτονικό L{TaskBoard.column}',
        groupWithRightNeighbor : 'Ομαδοποίηση με το δεξί γειτονικό L{TaskBoard.column}',
        name                   : 'Όνομα',
        newTaskName            : 'Δημιουργία νέου L{TaskBoard.task}',
        removeTask             : 'Κατάργηση L{TaskBoard.task}',
        removeTasks            : 'Κατάργηση L{TaskBoard.tasks}',
        resources              : 'Πόροι',
        save                   : 'Αποθήκευση',
        scrollToColumn         : 'Κύλιση σε L{TaskBoard.column}',
        scrollToSwimlane       : 'Κύλιση σε L{TaskBoard.swimlane}',
        showColumnMenu         : 'Εμφάνιση μενού στήλης',
        showTask               : 'Εμφάνιση L{TaskBoard.task}',
        unassigned             : 'Μη εκχωρημένο',
        zoom                   : 'Εστίαση'
    },

    ColumnFilters : {
        show         : 'Εμφάνιση φίλτρου στήλης',
        toggle       : 'Εναλλαγή φίλτρου στήλης',
        clear        : 'Καθαρισμός φίλτρων στήλης',
        badgeTooltip : count => `${count} φίλτρο(α) εφαρμοσμένα`
    },

    ColumnSort : {
        sort     : 'Ταξινόμηση στήλης',
        sortedBy : ({ label, ascending }) =>
            `Η στήλη ταξινομήθηκε ${ascending ? 'αύξουσα' : 'φθίνουσα'} κατά "${label}"`,
        reset : 'Επαναφορά ταξινόμησης στήλης'
    },

    TaskMenuItem : {
        showTaskMenu : 'Εμφάνιση μενού εργασιών'
    },

    TodoListField : {
        add     : 'Προσθήκη',
        newTodo : 'Νέα εργασία'
    },

    UndoRedo : {
        UndoLastAction : 'Αναίρεση',
        RedoLastAction : 'Επανάληψη'
    },

    ColumnRename : {
        rename : 'Μετονομασία'
    },

    ColumnSearchField : {
        search    : 'Αναζήτηση',
        matchMode : (mode) => `Λειτουργία αναζήτησης: ${mode}`,
        literal   : 'Κυριολεκτικό',
        and       : 'Όλες οι λέξεις (ΚΑΙ)',
        or        : 'Οποιαδήποτε λέξη (Ή)'
    }
};

export default LocaleHelper.publishLocale(locale);
