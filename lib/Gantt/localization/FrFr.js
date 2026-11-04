import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/FrFr.js';

const locale = {

    localeName : 'FrFr',
    localeDesc : 'Français (France)',
    localeCode : 'fr-FR',
    localeRtl  : false,

    Object : {
        Save : 'Enregistrer'
    },

    CostColumn : {
        cost : 'Coût'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignorer le calendrier des ressources'
    },

    InactiveColumn : {
        Inactive : 'Inactive'
    },

    TaskInfoColumn : {
        info                     : 'Info',
        postponedConflictTooltip : 'Il existe un conflit de planification non résolu avec cet événement. Cliquez pour le résoudre.'
    },

    ActualEffortColumn : {
        actualEffort : 'Effort Réel'
    },

    AddNewColumn : {
        'New Column' : 'Nouvelle colonne'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Effort de Référence'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Début planifié'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Fin planifié'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Durée planifié'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Variation de début'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Variation de fin'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Variation de durée'
    },

    CalendarColumn : {
        Calendar : 'Calendrier'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Début au plus tôt'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Fin au plus tôt'
    },

    LateStartDateColumn : {
        'Late Start' : 'Début au plus tard'
    },

    LateEndDateColumn : {
        'Late End' : 'Fin au plus tard'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Marge totale'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Date de contrainte'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Type de contrainte'
    },

    DeadlineDateColumn : {
        Deadline : 'Délai'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Dépendance invalide'
    },

    DurationColumn : {
        Duration : 'Durée'
    },

    EffortColumn : {
        Effort : 'Effort'
    },

    EndDateColumn : {
        Finish : 'Fin'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Planifié manuellement'
    },

    MilestoneColumn : {
        Milestone : 'Jalon'
    },

    NameColumn : {
        Name : 'Nom'
    },

    NoteColumn : {
        Note : 'Note'
    },

    PercentDoneColumn : {
        '% Done' : 'Fait à %'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : '% prévu réalisé'
    },

    PredecessorColumn : {
        Predecessors : 'Prédécesseurs'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Ressources attribuées',
        'more resources'     : 'davantage de ressources'
    },

    RollupColumn : {
        Rollup : 'Report au récapitulatif'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Mode de planification'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Direction de planification',
        inheritedFrom       : 'Hérité de',
        enforcedBy          : 'Imposé par'
    },

    SequenceColumn : {
        Sequence : 'Séquence'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Afficher dans la chronologie'
    },

    StartDateColumn : {
        Start : 'Début'
    },

    SuccessorColumn : {
        Successors : 'Successeurs'
    },

    TaskCopyPaste : {
        copyTask  : 'Copier',
        cutTask   : 'Couper',
        pasteTask : 'Coller'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Renuméroter'
    },

    DependencyField : {
        invalidDependencyFormat : 'Format de dépendance invalide'
    },

    ProjectLines : {
        'Project Start' : 'Début du projet',
        'Project End'   : 'Fin du projet',
        statusDate      : "Date d'état"
    },

    TaskTooltip : {
        Start    : 'Début',
        End      : 'Fin',
        Duration : 'Durée',
        Complete : 'Terminé'
    },

    BasicTaskEdit : {
        editTask        : 'Modifier',
        name            : 'Nom',
        percentComplete : '% terminé',
        start           : 'Début',
        finish          : 'Fin',
        duration        : 'Durée'
    },

    AssignmentGrid : {
        Name     : 'Nom de la ressource',
        Units    : 'Unités',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Quantité',
        cost        : 'Coût',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Éditer',
        Indent                 : 'Indenter',
        Outdent                : 'Désindenter',
        'Convert to milestone' : 'Convertir en jalon',
        Add                    : 'Ajouter...',
        'New task'             : 'Nouvelle tâche',
        'New milestone'        : 'Nouvel jalon',
        'Task above'           : 'Tâche ci-dessus',
        'Task below'           : 'Tâche ci-dessous',
        'Delete task'          : 'Supprimer la tâche',
        Milestone              : 'Jalon',
        'Sub-task'             : 'Sous-tâche',
        Successor              : 'Successeur',
        Predecessor            : 'Prédécesseur',
        changeRejected         : 'Le moteur de planification a rejeté les changements',
        linkTasks              : 'Ajouter des dépendances',
        unlinkTasks            : 'Supprimer les dépendances',
        color                  : 'Couleur'
    },

    EventSegments : {
        splitTask : 'Diviser la tâche'
    },

    Indicators : {
        earlyDates   : 'Début/fin au plus tôt',
        lateDates    : 'Début/fin au plus tard',
        Start        : 'Début',
        End          : 'Fin',
        deadlineDate : 'Délai'
    },

    Versions : {
        indented      : 'En retrait',
        outdented     : 'En retrait vers la gauche',
        cut           : 'Coupé',
        pasted        : 'Collé',
        deletedTasks  : 'Tâches supprimées',
        propertyNames : {
            baselines                   : 'Référentiels',
            deadlineDate                : 'Date limite',
            description                 : 'Description',
            endDate                     : 'Date de fin',
            projectConstraintResolution : 'Résolution des contraintes du projet',
            rollup                      : 'Récapitulatif',
            taskIconCls                 : 'Icône de tâche',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Informations sur le projet',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Général',
        projectName  : 'Nom du projet',
        start        : 'Date de début',
        finish       : 'Date de fin',
        scheduleFrom : 'Planifier à partir de',
        calendar     : 'Calendrier',
        readOnly     : 'Lecture seule',
        forward      : 'Date de début du projet',
        backward     : 'Date de fin du projet'
    },

    ProjectEditorDescriptionTab : {
        description : 'Description'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Avancé',
        hoursPerDay  : 'Heures par jour',
        daysPerWeek  : 'Jours par semaine',
        daysPerMonth : 'Jours par mois'
    }
};

export default LocaleHelper.publishLocale(locale);
