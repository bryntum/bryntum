import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Fi.js';

const locale = {

    localeName : 'Fi',
    localeDesc : 'Suomi',
    localeCode : 'fi',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Tietojen lataus epäonnistui!',
        syncFailedMessage : 'Tietojen synkronisointi epäonnistui!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Palvelimen vastaus:'
    },

    TaskBoard : {
        column                 : 'sarake',
        columns                : 'sarakkeet',
        Columns                : 'Sarakkeet',
        swimlane               : 'swimlane',
        swimlanes              : 'swimlanes',
        Swimlanes              : 'Swimlanes',
        task                   : 'tehtävä',
        tasks                  : 'tehtävät',
        addTask                : 'Lisää L{TaskBoard.task}',
        cancel                 : 'Peruuta',
        changeColumn           : 'Vaihda L{TaskBoard.column}',
        changeSwimlane         : 'Vaihda L{TaskBoard.swimlane}',
        collapse               : text => `Kaatuminen ${text}`,
        color                  : 'Väri',
        description            : 'Kuvaus',
        editTask               : 'Muokkaa L{TaskBoard.task}',
        expand                 : text => `Expand ${text}`,
        filterColumns          : 'Suodata L{TaskBoard.columns}',
        filterSwimlanes        : 'Suodata L {TaskBoard.swimlanes}',
        filterTasks            : 'Suodata L {TaskBoard.tasks}',
        lock                   : 'Lukko',
        unlock                 : 'Avata',
        moveColumnLeft         : 'Siirrä L{TaskBoard.column} vasemmalle',
        moveColumnRight        : 'Siirrä L{TaskBoard.column} oikealle',
        moveColumnUp           : 'Siirrä L{TaskBoard.column} ylös',
        moveColumnDown         : 'Siirrä L{TaskBoard.column} alas',
        moveColumnOutOfGroup   : 'Siirrä L{TaskBoard.column} pois ryhmästä',
        moveColumnIntoGroup    : 'Siirrä L{TaskBoard.column} ryhmään',
        groupWithLeftNeighbor  : 'Ryhmittele vasemman naapurin L{TaskBoard.column} kanssa',
        groupWithRightNeighbor : 'Ryhmittele oikean naapurin L{TaskBoard.column} kanssa',
        name                   : 'Nimi',
        newTaskName            : 'Uusi L{TaskBoard.task}',
        removeTask             : 'Poista L{TaskBoard.task}',
        removeTasks            : 'Poista L{TaskBoard.tasks}',
        resources              : 'Lähteet',
        save                   : 'Tallenna',
        scrollToColumn         : 'Vieritä L{TaskBoard.column}',
        scrollToSwimlane       : 'Vieritä L{TaskBoard.swimlane}',
        showColumnMenu         : 'Näytä sarakkeen valikko',
        showTask               : 'Näytä L{TaskBoard.task}',
        unassigned             : 'Ei määritetty',
        zoom                   : 'Zoom'
    },

    ColumnFilters : {
        show         : 'Näytä sarakesuodatin',
        toggle       : 'Vaihda sarakesuodatin',
        clear        : 'Tyhjennä sarakesuodattimet',
        badgeTooltip : count => `${count} suodatin(t) käytössä`
    },

    ColumnSort : {
        sort     : 'Lajittele sarake',
        sortedBy : ({ label, ascending }) =>
            `Sarake lajiteltu ${ascending ? 'nouseva' : 'laskeva'} perusteella "${label}"`,
        reset : 'Nollaa sarakkeen lajittelu'
    },

    TaskMenuItem : {
        showTaskMenu : 'Näytä tehtävävalikko'
    },

    TodoListField : {
        add     : 'Lisää',
        newTodo : 'Uusi todo'
    },

    UndoRedo : {
        UndoLastAction : 'Kumoa',
        RedoLastAction : 'Tee uudelleen'
    },

    ColumnRename : {
        rename : 'Nimeä uudelleen'
    },

    ColumnSearchField : {
        search    : 'Haku',
        matchMode : (mode) => `Hakutila: ${mode}`,
        literal   : 'Kirjaimellinen',
        and       : 'Kaikki sanat (JA)',
        or        : 'Mikä tahansa sana (TAI)'
    }
};

export default LocaleHelper.publishLocale(locale);
