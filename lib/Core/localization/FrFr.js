import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'FrFr',
    localeDesc : 'Français (France)',
    localeCode : 'fr-FR',
    localeRtl  : false,

    Object : {
        Yes      : 'Oui',
        No       : 'Non',
        Cancel   : 'Annuler',
        Ok       : 'OK',
        Week     : 'Semaine',
        None     : 'Aucun',
        previous : 'Précédent',
        next     : 'Suivant',
        to       : 'à',
        at       : 'à',
        on       : 'sur',
        editing  : what => `Modification de ${what}`,
        settings : 'Paramètres',
        close    : 'Fermer',
        go       : 'Aller',
        save     : 'Enregistrer',
        cancel   : 'Annuler',
        revert   : 'Restaurer',
        collapse : 'Réduire',
        expand   : 'Développer',
        today    : "Aujourd'hui",
        andNMore : n => `et ${n} de plus`
    },

    AIBase : {
        delayStatusTexts : [
            'En attente',
            'En attente ...',
            'Toujours en attente',
            'Toujours en attente ...'
        ],
        autoStartDialogMessage        : "Voulez-vous activer l'activation vocale de l'IA ?",
        voiceActivationToast          : phrase => `Activation vocale activée, utilisez la phrase "${phrase}" pour démarrer une conversation`,
        voiceControlNotSupportedToast : "Le contrôle vocal n'est pas pris en charge sur cet appareil",
        voiceControlErrorToast        : "Le contrôle vocal n'a pas pu être démarré sur votre appareil",
        voiceControlSilenceToast      : phrase => `La conversation vocale de l'IA s'est terminée en raison du silence. Utilisez la phrase ${phrase} pour redémarrer la conversation`,
        noAudioDetected               : 'Aucun audio détecté, veuillez réessayer',
        transcriptionErrorToast       : 'La transcription a échoué, veuillez réessayer',
        playbackErrorToast            : 'La lecture audio a échoué, veuillez vérifier votre périphérique de sortie audio',
        failed                        : '(échoué)',
        awaitingConfirmation          : 'En attente de confirmation',
        timeoutToast                  : 'Message expiré',
        readingStatusText             : modelName => `Lecture de ${modelName}s`,
        updatingStatusText            : modelName => `Mise à jour de ${modelName}s`,
        removingStatusText            : modelName => `Suppression de ${modelName}s`,
        addingStatusText              : modelName => `Ajout de ${modelName}`,
        filteringStatusText           : modelName => `Filtrage de ${modelName}s`,
        thinkingStatusText            : 'Réflexion',
        processingStatusText          : 'Traitement'
    },

    AISettingsPanel : {
        highlight               : 'Surligner',
        verbosity               : 'Verbosité',
        voiceActivation         : 'Activation vocale',
        enableVoiceActivation   : "Activer l'activation vocale",
        voiceOnly               : 'Voix uniquement',
        autostart               : 'Démarrage automatique',
        dataChangeConfirmations : 'Confirmation de changement de données',
        add                     : 'Ajouter',
        remove                  : 'Supprimer',
        update                  : 'Mettre à jour',
        planning                : 'Planification',
        enablePlanning          : 'Activer la planification',
        aiModel                 : 'Modèle IA',
        timeline                : 'Chronologie',
        'in-view'               : 'En vue',
        all                     : 'Tout',
        timeRangeContext        : 'Contexte de plage temporelle'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : "L'IA parle",
        recordingTooltip      : 'Enregistrement',
        waitingTooltip        : "L'IA réfléchit",
        startRecordingTooltip : 'Cliquez pour commencer',
        stopRecordingTooltip  : 'Cliquez pour arrêter',
        inactiveTooltip       : "Pas d'enregistrement",
        openChatTooltip       : 'Cliquez droit pour ouvrir le chat'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Tapez un message',
        noConnectionTooltip     : 'Aucune connexion détectée, cliquez pour réessayer',
        undone                  : 'annulé',
        aborted                 : '(interrompu)',
        readAloudTooltip        : 'Lire le message à haute voix',
        confidenceTooltip       : confidence => `Confiance : ${confidence}%`,
        undoTooltip             : 'Annuler les modifications de données',
        redoTooltip             : 'Rétablir les modifications de données',
        thumbsUp                : 'Pouce levé',
        thumbsDown              : 'Pouce baissé',
        feedbackToast           : 'Merci pour votre retour !',
        clearChat               : 'Effacer le chat',
        closeChat               : 'Fermer le chat',
        settings                : 'Paramètres',
        closeSettings           : 'Fermer les paramètres'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Sélectionnez exactement ${min}`,
        tooFewOptionsSelected     : min => `Sélectionnez au moins ${min}`,
        tooManyOptionsSelected    : max => `Sélectionnez au plus ${max}`
    },

    CodeEditor : {
        apply        : 'Appliquer',
        autoApply    : 'Appliquer automatiquement',
        downloadCode : 'Télécharger le code'
    },

    ColorPicker : {
        noColor : 'Pas de couleur'
    },

    Combo : {
        noResults          : 'Aucun résultat',
        recordNotCommitted : "L'enregistrement n'a pas pu être ajouté",
        addNewValue        : value => `Ajouter ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Surligner',
        preview         : 'Aperçu',
        approve         : 'Approuver',
        reject          : 'Rejeter',
        confirmAdd      : "Confirmer l'ajout :",
        confirmUpdate   : 'Confirmer la mise à jour :',
        confirmRemove   : 'Confirmer la suppression :',
        confirmCopy     : 'Confirmer la copie',
        confirmAssign   : "Confirmer l'attribution",
        confirmReassign : 'Confirmer la réattribution',
        confirmUnassign : 'Confirmer la désattribution',
        confirmLink     : 'Confirmer le lien',
        confirmUnlink   : 'Confirmer la dissociation'
    },

    FilePicker : {
        file : 'Fichier'
    },

    Field : {
        badInput              : 'Valeur de champ invalide',
        patternMismatch       : 'La valeur doit correspondre à un modèle spécifique',
        rangeOverflow         : value => `La valeur doit être inférieure ou égale à ${value.max}`,
        rangeUnderflow        : value => `La valeur doit être supérieure ou égale à ${value.min}`,
        stepMismatch          : 'La valeur doit correspondre au pas',
        tooLong               : 'La valeur doit être plus courte',
        tooShort              : 'La valeur doit être plus longue',
        typeMismatch          : 'La valeur doit respecter un format spécial',
        valueMissing          : 'Ce champ est requis',
        invalidValue          : 'Valeur de champ invalide',
        minimumValueViolation : 'Non-respect de la valeur minimale',
        maximumValueViolation : 'Non-respect de la valeur maximale',
        fieldRequired         : 'Ce champ est requis',
        validateFilter        : 'La valeur doit être sélectionnée dans la liste'
    },

    DateField : {
        invalidDate : format => 'Entrée de date invalide, le format attendu est ' + format
    },

    DatePicker : {
        gotoPrevYear  : "Aller à l'année précédente",
        gotoPrevMonth : 'Aller au mois précédent',
        gotoNextMonth : 'Aller au mois suivant',
        gotoNextYear  : "Aller à l'année suivante",
        navigation    : 'Navigation du sélecteur de date'
    },

    Hint : {
        dontShowAgain : 'Ne plus afficher'
    },

    NumberFormat : {
        locale   : 'fr-FR',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Unité invalide'
    },

    TimeField : {
        invalidTime : "Saisie de l'heure invalide"
    },

    TimePicker : {
        hour   : 'Heure',
        minute : 'Minute',
        second : 'Seconde'
    },

    Tooltip : {
        loading : 'Chargement...'
    },

    List : {
        loading   : 'Chargement en cours...',
        selectAll : 'Tout sélectionner'
    },

    GridBase : {
        loadMask : 'Chargement en cours...',
        syncMask : "Modifications en cours d'enregistrement, veuillez patienter..."
    },

    PagingToolbar : {
        firstPage         : 'Aller à la première page',
        prevPage          : 'Aller à la page précédente',
        page              : 'Page',
        nextPage          : 'Aller à la page suivante',
        lastPage          : 'Aller à la dernière page',
        reload            : 'Recharger la page en cours',
        noRecords         : 'Aucun enregistrement à afficher',
        pageCountTemplate : data => `sur ${data.lastPage}`,
        summaryTemplate   : data => `Affichage des enregistrements ${data.start} - ${data.end} sur ${data.allCount}`
    },

    Popup : {
        close    : 'Fermer la fenêtre Popup',
        maximize : 'Maximiser'
    },

    Splitter : {
        ariaLabel      : 'Diviseur, utilisez les touches fléchées pour redimensionner les panneaux adjacents',
        collapseLeft   : 'Replier le panneau de gauche',
        collapseRight  : 'Replier le panneau de droite',
        collapseTop    : 'Replier le panneau du haut',
        collapseBottom : 'Replier le panneau du bas',
        expandLeft     : 'Déplier le panneau de gauche',
        expandRight    : 'Déplier le panneau de droite',
        expandTop      : 'Déplier le panneau du haut',
        expandBottom   : 'Déplier le panneau du bas'
    },

    TabPanel : {
        containsInvalidFields : "L'onglet contient des champs non valides"
    },

    Toolbar : {
        showOverflowingItems : 'Afficher les éléments débordants',
        scrollForMore        : 'Faites défiler pour plus'
    },

    UndoRedo : {
        Undo           : 'Annuler',
        Redo           : 'Rétablir',
        UndoLastAction : 'Annuler la dernière action',
        RedoLastAction : 'Rétablir la dernière action annulée',
        NoActions      : "Aucun élément dans la file d'attente Annuler"
    },

    FieldFilterPicker : {
        equals                 : 'est égal à',
        doesNotEqual           : "n'est pas égal à",
        isEmpty                : 'est vide',
        isNotEmpty             : "n'est pas vide",
        contains               : 'contient',
        doesNotContain         : 'ne contient pas',
        startsWith             : 'commence par',
        endsWith               : 'finit par',
        isOneOf                : "est l'un de",
        isNotOneOf             : "n'est pas l'un de",
        isGreaterThan          : 'est supérieur à',
        isLessThan             : 'est inférieur à',
        isGreaterThanOrEqualTo : 'est supérieur ou égal à',
        isLessThanOrEqualTo    : 'est inférieur ou égal à',
        isBetween              : 'est entre',
        isNotBetween           : "n'est pas entre",
        isBefore               : 'est avant',
        isAfter                : 'est après',
        timeEquals             : 'le temps est égal',
        timeDoesNotEqual       : "le temps n'est pas égal",
        isToday                : "est aujourd'hui",
        isTomorrow             : 'est demain',
        isYesterday            : 'est hier',
        isThisWeek             : 'est cette semaine',
        isNextWeek             : 'est la semaine prochaine',
        isLastWeek             : 'est la semaine dernière',
        isThisMonth            : 'est ce mois',
        isNextMonth            : 'est le mois prochain',
        isLastMonth            : 'est le mois dernier',
        isThisYear             : 'est cette année',
        isNextYear             : "est l'anné prochaine",
        isLastYear             : "est l'année dernière",
        isYearToDate           : "est l'année à ce jour",
        isTrue                 : 'est vrai',
        isFalse                : 'est faux',
        selectAProperty        : 'Sélectionnez une propriété',
        selectAnOperator       : 'Sélectionnez un opérateur',
        caseSensitive          : 'Sensible à la casse',
        and                    : 'et',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Sélectionnez valeur',
        selectOneOrMoreValues  : 'Sélectionnez une ou plusieurs valeurs',
        enterAValue            : 'Entrez une valeur',
        enterANumber           : 'Entrez un nombre',
        selectADate            : 'Sélectionnez une date',
        selectATime            : "Sélectionnez l'heure"
    },

    FieldFilterPickerGroup : {
        addFilter : 'Ajouter un filtre',
        applyCond : applied => applied ? 'Ignorer le filtre (actuellement appliqué)' : 'Appliquer le filtre (actuellement ignoré)'
    },

    DateHelper : {
        locale         : 'fr-FR',
        weekStartDay   : 1,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : 'milliseconde', plural : 'millisecondes', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'seconde', plural : 'secondes', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minute', plural : 'minutes', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'heure', plural : 'heures', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'jour', plural : 'jours', abbrev : 'j' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'semaine', plural : 'semaines', abbrev : 's' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'mois', plural : 'mois', abbrev : 'm' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'trimestre', plural : 'trimestres', abbrev : 't' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'année', plural : 'années', abbrev : 'a' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'décennie', plural : 'décennies', abbrev : 'déc' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['ms'],
            [],
            ['s', 's'],
            [],
            ['m', 'min'],
            [],
            ['h', 'h'],
            [],
            ['j'],
            [],
            ['s', 'sem'],
            [],
            ['m', 'mon'],
            [],
            ['T', 'trim'],
            [],
            ['a', 'an'],
            [],
            ['déc'],
            []
        ],
        parsers : {
            L   : 'DD/MM/YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {
            const suffix = { 1 : 'er' }[number] || 'ème';
            return number + suffix;
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `les années ${year - (year % 10)}`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
