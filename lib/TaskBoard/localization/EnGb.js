import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/EnGb.js';

const locale = {

    localeName : 'EnGb',
    localeDesc : 'English (GB)',
    localeCode : 'en-GB',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Data loading failed!',
        syncFailedMessage : 'Data synchronisation failed!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Server response:'
    },

    TaskBoard : {
        column                 : 'column',
        columns                : 'columns',
        Columns                : 'Columns',
        swimlane               : 'swimlane',
        swimlanes              : 'swimlanes',
        Swimlanes              : 'Swimlanes',
        task                   : 'task',
        tasks                  : 'tasks',
        addTask                : 'Add L{TaskBoard.task}',
        cancel                 : 'Cancel',
        changeColumn           : 'Change L{TaskBoard.column}',
        changeSwimlane         : 'Change L{TaskBoard.swimlane}',
        collapse               : text => `Collapse ${text}`,
        color                  : 'Color',
        description            : 'Description',
        editTask               : 'Edit L{TaskBoard.task}',
        expand                 : text => `Expand ${text}`,
        filterColumns          : 'Filter L{TaskBoard.columns}',
        filterSwimlanes        : 'Filter L{TaskBoard.swimlanes}',
        filterTasks            : 'Filter L{TaskBoard.tasks}',
        lock                   : 'Lock',
        unlock                 : 'Unlock',
        moveColumnLeft         : 'Move L{TaskBoard.column} left',
        moveColumnRight        : 'Move L{TaskBoard.column} right',
        moveColumnUp           : 'Move L{TaskBoard.column} up',
        moveColumnDown         : 'Move L{TaskBoard.column} down',
        moveColumnOutOfGroup   : 'Move L{TaskBoard.column} out of group',
        moveColumnIntoGroup    : 'Move L{TaskBoard.column} into group',
        groupWithLeftNeighbor  : 'Group with left neighbour L{TaskBoard.column}',
        groupWithRightNeighbor : 'Group with right neighbour L{TaskBoard.column}',
        name                   : 'Name',
        newTaskName            : 'New L{TaskBoard.task}',
        removeTask             : 'Remove L{TaskBoard.task}',
        removeTasks            : 'Remove L{TaskBoard.tasks}',
        resources              : 'Resources',
        save                   : 'Save',
        scrollToColumn         : 'Scroll to L{TaskBoard.column}',
        scrollToSwimlane       : 'Scroll to L{TaskBoard.swimlane}',
        showColumnMenu         : 'Show column menu',
        showTask               : 'Show L{TaskBoard.task}',
        unassigned             : 'Unassigned',
        zoom                   : 'Zoom'
    },

    ColumnFilters : {
        show         : 'Show column filter',
        toggle       : 'Toggle column filter',
        clear        : 'Clear column filters',
        badgeTooltip : count => `${count} filter(s) applied`
    },

    ColumnSort : {
        sort     : 'Sort column',
        sortedBy : ({ label, ascending }) =>
            `Column sorted ${ascending ? 'ascending' : 'descending'} by "${label}"`,
        reset : 'Reset column sorting'
    },

    TaskMenuItem : {
        showTaskMenu : 'Show task menu'
    },

    TodoListField : {
        add     : 'Add',
        newTodo : 'New todo'
    },

    UndoRedo : {
        UndoLastAction : 'Undo',
        RedoLastAction : 'Redo'
    },

    ColumnRename : {
        rename : 'Rename'
    },

    ColumnSearchField : {
        search    : 'Search',
        matchMode : (mode) => `Search mode: ${mode}`,
        literal   : 'Literal',
        and       : 'All words (AND)',
        or        : 'Any word (OR)'
    }
};

export default LocaleHelper.publishLocale(locale);
