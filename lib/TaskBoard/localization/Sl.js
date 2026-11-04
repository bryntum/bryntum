import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Sl.js';

const locale = {

    localeName : 'Sl',
    localeDesc : 'Slovensko',
    localeCode : 'sl',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Nalaganje podatkov ni uspelo!',
        syncFailedMessage : 'Sinhronizacija podatkov ni uspela!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Odziv strežnika:'
    },

    TaskBoard : {
        column                 : 'stolpec',
        columns                : 'stolpci',
        Columns                : 'Stolpci',
        swimlane               : 'opravilna proga',
        swimlanes              : 'opravilne proge',
        Swimlanes              : 'Opravilne proge',
        task                   : 'opravilo',
        tasks                  : 'opravila',
        addTask                : 'Dodaj L{TaskBoard.task}',
        cancel                 : 'Prekliči',
        changeColumn           : 'Spremeni L{TaskBoard.column}',
        changeSwimlane         : 'Spremeni L{TaskBoard.swimlane}',
        collapse               : text => ` Strni ${text}`,
        color                  : 'Barva',
        description            : 'Opis',
        editTask               : 'Uredi L{TaskBoard.task}',
        expand                 : text => `Razširi ${text}`,
        filterColumns          : 'Filtriraj L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtriraj L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtriraj L{TaskBoard.tasks}',
        lock                   : 'Zaklepanje',
        unlock                 : 'Odkleni',
        moveColumnLeft         : 'Premakni L{TaskBoard.column} levo',
        moveColumnRight        : 'Premakni L{TaskBoard.column} desno',
        moveColumnUp           : 'Premakni L{TaskBoard.column} navzgor',
        moveColumnDown         : 'Premakni L{TaskBoard.column} navzdol',
        moveColumnOutOfGroup   : 'Premakni L{TaskBoard.column} iz skupine',
        moveColumnIntoGroup    : 'Premakni L{TaskBoard.column} v skupino',
        groupWithLeftNeighbor  : 'Združi z levim sosednjim L{TaskBoard.column}',
        groupWithRightNeighbor : 'Združi z desnim sosednjim L{TaskBoard.column}',
        name                   : 'Ime',
        newTaskName            : 'Nov L{TaskBoard.task}',
        removeTask             : 'Odstrani L{TaskBoard.task}',
        removeTasks            : 'Odstrani L{TaskBoard.tasks}',
        resources              : 'Viri',
        save                   : 'Shrani',
        scrollToColumn         : 'Pomakni se do L{TaskBoard.column}',
        scrollToSwimlane       : 'Pomakni se do L{TaskBoard.swimlane}',
        showColumnMenu         : 'Prikaži meni stolpca',
        showTask               : 'Pokaži L{TaskBoard.task}',
        unassigned             : 'Nedodeljeno',
        zoom                   : 'Povečava'
    },

    ColumnFilters : {
        show         : 'Prikaži filter stolpca',
        toggle       : 'Preklopi filter stolpca',
        clear        : 'Počisti filtre stolpcev',
        badgeTooltip : count => `${count} filter(-i) uporabljen(-i)`
    },

    ColumnSort : {
        sort     : 'Razvrsti stolpec',
        sortedBy : ({ label, ascending }) =>
            `Stolpec razvrščen ${ascending ? 'naraščajoče' : 'padajoče'} po "${label}"`,
        reset : 'Ponastavi razvrščanje stolpcev'
    },

    TaskMenuItem : {
        showTaskMenu : 'Prikaži meni opravil'
    },

    TodoListField : {
        add     : 'Dodaj',
        newTodo : 'Nov seznam opravil'
    },

    UndoRedo : {
        UndoLastAction : 'Razveljavi',
        RedoLastAction : 'Ponovno uveljavi'
    },

    ColumnRename : {
        rename : 'Preimenuj'
    },

    ColumnSearchField : {
        search    : 'Iskanje',
        matchMode : (mode) => `Način iskanja: ${mode}`,
        literal   : 'Dobesedno',
        and       : 'Vse besede (IN)',
        or        : 'Katera koli beseda (ALI)'
    }
};

export default LocaleHelper.publishLocale(locale);
