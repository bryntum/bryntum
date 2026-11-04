import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Nl.js';

const locale = {

    localeName : 'Nl',
    localeDesc : 'Nederlands',
    localeCode : 'nl',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Laden mislukt!',
        syncFailedMessage : 'Gegevenssynchronisatie mislukt!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Server respons:'
    },

    TaskBoard : {
        column                 : 'kolom',
        columns                : 'kolommen',
        Columns                : 'Kolommen',
        swimlane               : 'zwembaan',
        swimlanes              : 'zwembanen',
        Swimlanes              : 'Zwembanen',
        task                   : 'taak',
        tasks                  : 'taken',
        addTask                : 'Toevoegen L{TaskBoard.task}',
        cancel                 : 'Annuleren',
        changeColumn           : 'wijzig L{TaskBoard.column}',
        changeSwimlane         : 'wijzig L{TaskBoard.swimlane}',
        collapse               : text => `Kollapse ${text}`,
        color                  : 'Kleur',
        description            : 'Beschrijving',
        editTask               : 'Bewerk L{TaskBoard.task}',
        expand                 : text => `Utvide ${text}`,
        filterColumns          : 'Filter L{TaskBoard.columns}',
        filterSwimlanes        : 'Filter L{TaskBoard.swimlanes}',
        filterTasks            : 'Filter L{TaskBoard.tasks}',
        lock                   : 'Slot',
        unlock                 : 'Ontgrendelen',
        moveColumnLeft         : 'Bevege seg L{TaskBoard.column} venstre',
        moveColumnRight        : 'Bevege seg L{TaskBoard.column} riktig',
        moveColumnUp           : 'Bevege seg L{TaskBoard.column} omhoog',
        moveColumnDown         : 'Bevege seg L{TaskBoard.column} omlaag',
        moveColumnOutOfGroup   : 'Bevege seg L{TaskBoard.column} uit de groep',
        moveColumnIntoGroup    : 'Bevege seg L{TaskBoard.column} in de groep',
        groupWithLeftNeighbor  : 'Groeperen met linker buur-L{TaskBoard.column}',
        groupWithRightNeighbor : 'Groeperen met rechter buur-L{TaskBoard.column}',
        name                   : 'Naam',
        newTaskName            : 'Nieuw L{TaskBoard.task}',
        removeTask             : 'Verwijder L{TaskBoard.task}',
        removeTasks            : 'Verwijder L{TaskBoard.tasks}',
        resources              : 'Resources',
        save                   : 'Bewaar',
        scrollToColumn         : 'Scroll naar L{TaskBoard.column}',
        scrollToSwimlane       : 'Scroll naar L{TaskBoard.swimlane}',
        showColumnMenu         : 'Toon kolommenu',
        showTask               : 'L{TaskBoard.task} weergeven',
        unassigned             : 'Niet-toegewezen',
        zoom                   : 'Zoom'
    },

    ColumnFilters : {
        show         : 'Kolomfilter weergeven',
        toggle       : 'Kolomfilter schakelen',
        clear        : 'Kolomfilters wissen',
        badgeTooltip : count => `${count} filter(s) toegepast`
    },

    ColumnSort : {
        sort     : 'Sorteer kolom',
        sortedBy : ({ label, ascending }) =>
            `Kolom gesorteerd ${ascending ? 'oplopend' : 'aflopend'} op "${label}"`,
        reset : 'Kolomsortering opnieuw instellen'
    },

    TaskMenuItem : {
        showTaskMenu : 'Toon taakmenu'
    },

    TodoListField : {
        add     : 'Toevoegen',
        newTodo : 'Nieuw'
    },

    UndoRedo : {
        UndoLastAction : 'Ongedaan maken',
        RedoLastAction : 'Opnieuw uitvoeren'
    },

    ColumnRename : {
        rename : 'Hernoemen'
    },

    ColumnSearchField : {
        search    : 'Zoeken',
        matchMode : (mode) => `Zoekmodus: ${mode}`,
        literal   : 'Letterlijk',
        and       : 'Alle woorden (EN)',
        or        : 'Elk woord (OF)'
    }
};

export default LocaleHelper.publishLocale(locale);
