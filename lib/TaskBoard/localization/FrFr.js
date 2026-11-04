import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/FrFr.js';

const locale = {

    localeName : 'FrFr',
    localeDesc : 'Français (France)',
    localeCode : 'fr-FR',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Échec du chargement des données !',
        syncFailedMessage : 'Échec de la synchronisation des données !'
    },

    CrudManagerView : {
        serverResponseLabel : 'Réponse du serveur :'
    },

    TaskBoard : {
        column                 : 'colonne',
        columns                : 'colonnes',
        Columns                : 'Colonnes',
        swimlane               : 'couloir',
        swimlanes              : 'couloirs',
        Swimlanes              : 'Couloirs',
        task                   : 'tâche',
        tasks                  : 'tâches',
        addTask                : 'Ajouter L{TaskBoard.task}',
        cancel                 : 'Annuler',
        changeColumn           : 'Changer de L{TaskBoard.column}',
        changeSwimlane         : 'Changer de L{TaskBoard.swimlane}',
        collapse               : text => `Réduire ${text}`,
        color                  : 'Couleur',
        description            : 'Description',
        editTask               : 'Éditer L{TaskBoard.task}',
        expand                 : text => `Développer ${text}`,
        filterColumns          : 'Filtrer L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtrer L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtrer L{TaskBoard.tasks}',
        lock                   : 'Verrouillage',
        unlock                 : 'Ouvrir',
        moveColumnLeft         : 'Déplacer L{TaskBoard.column} à gauche',
        moveColumnRight        : 'Déplacer L{TaskBoard.column} vers la droite',
        moveColumnUp           : 'Déplacer L{TaskBoard.column} vers le haut',
        moveColumnDown         : 'Déplacer L{TaskBoard.column} vers le bas',
        moveColumnOutOfGroup   : 'Déplacer L{TaskBoard.column} hors du groupe',
        moveColumnIntoGroup    : 'Déplacer L{TaskBoard.column} dans le groupe',
        groupWithLeftNeighbor  : 'Grouper avec L{TaskBoard.column} voisin de gauche',
        groupWithRightNeighbor : 'Grouper avec L{TaskBoard.column} voisin de droite',
        name                   : 'Nom',
        newTaskName            : 'Nouveau L{TaskBoard.task}',
        removeTask             : 'Supprimer L{TaskBoard.task}',
        removeTasks            : 'Supprimer L{TaskBoard.tasks}',
        resources              : 'Ressources',
        save                   : 'Enregistrer',
        scrollToColumn         : "Faire défiler jusqu'à L{TaskBoard.column}",
        scrollToSwimlane       : "Faire défiler jusqu'à L{TaskBoard.swimlane}",
        showColumnMenu         : 'Afficher le menu de la colonne',
        showTask               : 'Afficher la L{TaskBoard.task}',
        unassigned             : 'Non attribué',
        zoom                   : 'Agrandir'
    },

    ColumnFilters : {
        show         : 'Afficher le filtre de colonne',
        toggle       : 'Basculer le filtre de colonne',
        clear        : 'Effacer les filtres de colonne',
        badgeTooltip : count => `${count} filtre(s) appliqué(s)`
    },

    ColumnSort : {
        sort     : 'Trier la colonne',
        sortedBy : ({ label, ascending }) =>
            `Colonne triée ${ascending ? 'croissant' : 'décroissant'} par "${label}"`,
        reset : 'Réinitialiser le tri des colonnes'
    },

    TaskMenuItem : {
        showTaskMenu : 'Afficher le menu des tâches'
    },

    TodoListField : {
        add     : 'Ajouter',
        newTodo : 'Nouvelle tâche à effectuer'
    },

    UndoRedo : {
        UndoLastAction : 'Annuler',
        RedoLastAction : 'Rétablir'
    },

    ColumnRename : {
        rename : 'Renommer'
    },

    ColumnSearchField : {
        search    : 'Rechercher',
        matchMode : (mode) => `Mode de recherche : ${mode}`,
        literal   : 'Littéral',
        and       : 'Tous les mots (ET)',
        or        : "N'importe quel mot (OU)"
    }
};

export default LocaleHelper.publishLocale(locale);
