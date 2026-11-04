import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/FrFr.js';

const emptyString = new String();

const locale = {

    localeName : 'FrFr',
    localeDesc : 'Français (France)',
    localeCode : 'fr-FR',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'Rechercher',
        selectAll   : 'Tout sélectionner',
        removeAll   : 'Tout supprimer',
        filtersSet  : n => n === 1 ? `1 filtre appliqué` : `${n} filtres appliqués`,
        noItems     : 'Aucun résultat trouvé',
        placeholder : 'Filtrer...',
        apply       : 'Appliquer'
    },

    ColumnPicker : {
        column          : 'Colonne',
        columnsMenu     : 'Colonnes',
        hideColumn      : 'Masquer la colonne',
        hideColumnShort : 'Masquer',
        newColumns      : 'Nouvelles colonnes',
        allColumns      : 'Toutes les colonnes',
        showName        : column => `Afficher la colonne${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `Masquer la colonne${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'Appliquer le filtre',
        filter        : 'Filtre',
        editFilter    : 'Éditer le filtre',
        on            : 'Le',
        before        : 'Avant',
        after         : 'Après',
        equals        : 'Égal à',
        lessThan      : 'Inférieur à',
        moreThan      : 'Supérieur à',
        removeFilter  : 'Supprimer le filtre',
        disableFilter : 'Désactiver le filtre'
    },

    FilterBar : {
        enableFilterBar  : 'Afficher la barre de filtre',
        disableFilterBar : 'Masquer la barre de filtre'
    },

    Group : {
        group                : 'Regrouper',
        groupAscending       : 'Grouper par ordre croissant',
        groupDescending      : 'Grouper par ordre décroissant',
        groupAscendingShort  : 'Croissant',
        groupDescendingShort : 'Décroissant',
        stopGrouping         : 'Arrêter le regroupement',
        stopGroupingShort    : 'Arrêter'
    },

    HeaderMenu : {
        moveBefore     : text => `Déplacer avant "${text}"`,
        moveAfter      : text => `Déplacer après "${text}"`,
        collapseColumn : 'Réduire la colonne',
        expandColumn   : 'Développer la colonne'
    },

    ColumnRename : {
        rename : 'Renommer'
    },

    ColumnResize : {
        resizeColumn : 'Redimensionner la colonne',
        width        : 'Largeur',
        fitToData    : 'Ajuster aux données'
    },

    MergeCells : {
        mergeCells  : 'Fusionner les cellules',
        menuTooltip : 'Fusionner les cellules de même valeur quand elles sont triées dans cette colonne'
    },

    Search : {
        searchForValue : 'Rechercher la valeur'
    },

    Sort : {
        sort                   : 'Trier',
        sortAscending          : 'Trier par ordre croissant',
        sortDescending         : 'Trier par ordre décroissant',
        multiSort              : 'Tri multiple',
        removeSorter           : 'Supprimer le tri',
        addSortAscending       : 'Ajouter un triage par ordre croissant',
        addSortDescending      : 'Ajouter un triage par ordre décroissant',
        toggleSortAscending    : 'Passer en ordre croissant',
        toggleSortDescending   : 'Passer en ordre décroissant',
        sortAscendingShort     : 'Croissant',
        sortDescendingShort    : 'Décroissant',
        removeSorterShort      : 'Retirer',
        addSortAscendingShort  : '+ Croissant',
        addSortDescendingShort : '+ Décroissant'
    },

    Split : {
        split        : 'Diviser',
        unsplit      : 'Non divisé',
        horizontally : 'Horizontalement',
        vertically   : 'Verticalement',
        both         : 'Les deux',
        top          : 'haut',
        bottom       : 'bas',
        left         : 'gauche',
        right        : 'droite'
    },

    LockRows : {
        lockRow   : 'Verrouiller la ligne',
        unlockRow : 'Déverrouiller la ligne'
    },

    ActionColumn : {
        rowActions : 'Actions sur la ligne'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} colonne. ` : ''}ESPACE pour le menu contextuel${column.canSort ? ', ENTRÉE pour trier' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'Widgets de ligne'
    },

    Checkbox : {
        toggleRowSelect : 'Basculer la sélection de ligne',
        toggleSelection : 'Basculer la sélection du jeu de données complet',
        toggleName      : column => `Basculer ${column.text || 'valeur'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `évaluation : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'Numéro de ligne'
    },

    GridBase : {
        loadFailedMessage  : 'Échec de chargement des données !',
        syncFailedMessage  : 'Échec de synchronisation des données !',
        unspecifiedFailure : 'Erreur non spécifiée',
        networkFailure     : 'Erreur réseau',
        parseFailure       : 'Erreur de décryptage de la réponse du serveur',
        serverResponse     : 'Réponse du serveur :',
        noRows             : 'Aucun enregistrement à afficher',
        moveColumnLeft     : 'Déplacer vers la section de gauche',
        moveColumnRight    : 'Déplacer vers la section de droite',
        moveColumnTo       : region => `Déplacer la colonne vers ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 ligne correspond au filtre` : `${n} lignes correspondent au filtre`) : 'Aucune ligne ne correspond au filtre'
    },

    CellMenu : {
        removeRow : 'Supprimer'
    },

    RowCopyPaste : {
        copyRecord  : 'Copier',
        cutRecord   : 'Couper',
        pasteRecord : 'Coller',
        rows        : 'lignes',
        row         : 'ligne'
    },

    CellCopyPaste : {
        copy  : 'Copier',
        cut   : 'Couper',
        paste : 'Coller'
    },

    Charts : {
        chartDesigner : 'Concepteur de graphiques',
        newChart      : 'Nouveau Graphique',
        download      : 'Télécharger',
        settings      : 'Paramètres'
    },

    PdfExport : {
        'Waiting for response from server' : 'En attente de la réponse du serveur...',
        'Export failed'                    : "Échec de l'export",
        'Server error'                     : 'Erreur serveur',
        'Generating pages'                 : 'Génération de pages en cours...',
        'Click to abort'                   : 'Annuler'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'Exporter les paramètres',
        export         : 'Exporter',
        printSettings  : "Paramètres d'impression",
        print          : 'Imprimer',
        exporterType   : 'Contrôle de la pagination',
        cancel         : 'Annuler',
        fileFormat     : 'Format de fichier',
        rows           : 'Lignes',
        alignRows      : 'Aligner les lignes',
        columns        : 'Colonnes',
        paperFormat    : 'Format du papier',
        orientation    : 'Orientation',
        repeatHeader   : "Répéter l'en-tête"
    },

    ExportRowsCombo : {
        all     : 'Toutes les lignes',
        visible : 'Lignes visibles'
    },

    ExportOrientationCombo : {
        portrait  : 'Portrait',
        landscape : 'Paysage'
    },

    SinglePageExporter : {
        singlepage : 'Une seule page'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : "Page unique (non mise à l'échelle)"
    },

    MultiPageExporter : {
        multipage     : 'Plusieurs pages',
        exportingPage : ({ currentPage, totalPages }) => `Export de la page ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'Plusieurs pages (en vertical)',
        exportingPage     : ({ currentPage, totalPages }) => `Export de la page ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'Chargement en cours',
        expand             : 'Développer',
        collapse           : 'Réduire',
        columnDescription  : 'Basculer les détails de la ligne',
        expandedRowContent : 'Contenu de la ligne développée'
    },

    TreeGroup : {
        group                  : 'Regrouper par',
        stopGrouping           : 'Arrêter le regroupement',
        stopGroupingThisColumn : 'Annuler le regroupement de cette colonne'
    },

    AIFilter : {
        unsuccessfulFilterMessage : "L'opération de filtrage a échoué, veuillez réessayer"
    },

    AIFilterField : {
        progressText : 'Filtrage'
    },

    PinColumns : {
        pinColumn  : 'Épingler la colonne',
        unpin      : "Pas d'épingle",
        pinToStart : 'Épingler au début',
        pinToEnd   : 'Épingler à la fin'
    }
};

export default LocaleHelper.publishLocale(locale);
