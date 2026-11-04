import LocaleHelper from '../../Core/localization/LocaleHelper.js'

const locale = {

    localeName : 'FrFr',
    localeDesc : 'Français (France)',
    localeCode : 'fr-FR',
    localeRtl  : false,

    RemoveDependencyCycleEffectResolution : {
        descriptionTpl : 'Retirer la dépendance'
    },

    DeactivateDependencyCycleEffectResolution : {
        descriptionTpl : 'Désactiver la dépendance'
    },

    CycleEffectDescription : {
        descriptionTpl : 'Un cycle a été trouvé, formé de : {0}'
    },

    EmptyCalendarEffectDescription : {
        descriptionTpl               : 'La tâche "{2}" ne peut pas être effectuée. Le calendrier "{0}" ne fournit aucun intervalle de temps de travail.',
        forwardDescriptionTpl        : "La tâche \"{3}\" ne peut pas être effectuée. \"{0}\" Le calendrier n'a pas de temps de travail après {1}.",
        backwardDescriptionTpl       : "La tâche \"{3}\" ne peut pas être effectuée. \"{0}\" Le calendrier n'a pas de temps de travail avant {1}.",
        noIntersectionDescriptionTpl : "La tâche \"{3}\" ne peut pas être effectuée. Son calendrier \"{0}\" et ses calendriers de ressources n'ont pas de temps de travail courant."
    },

    Use24hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Utiliser le calendrier de 24 heures avec les samedis et dimanches non travaillés.'
    },

    Use8hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Utiliser le calendrier de 8 heures (08:00-12:00, 13:00-17:00) avec les samedis et dimanches non travaillés.'
    },

    IgnoreProjectConstraintResolution : {
        descriptionTpl : 'Ignorez la frontière du projet et procédez au changement.'
    },

    ProjectConstraintConflictEffectDescription : {
        startDescriptionTpl : 'Vous avez déplacé la tâche "{0}" pour démarrer {1}. Ceci est avant la date de début du projet {2}.',
        endDescriptionTpl   : "Vous avez déplacé la tâche \"{0}\" pour terminer {1}. C'est après la date de fin du projet {2}."
    },

    HonorProjectConstraintResolution : {
        descriptionTpl : 'Ajustez la tâche pour honorer la frontière du projet.'
    },

    IgnoreResourceCalendarEmptyCalendarEffectResolution : {
        descriptionTpl : 'Ignorez les calendriers des ressources et planifiez la tâche avec son propre calendrier uniquement.'
    },

    ConflictEffectDescription : {
        descriptionTpl : 'Un conflit de planification a été trouvé : {0} est en conflit avec {1}'
    },

    ConstraintIntervalDescription : {
        dateFormat : 'LLL'
    },

    ProjectConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Date de début du projet {0}',
        endDateDescriptionTpl   : 'Date de fin du projet {0}'
    },

    DependencyType : {
        long : [
            'Du début au début',
            'Du début à la fin',
            'De la fin au début',
            'De la fin à la fin'
        ]
    },

    ManuallyScheduledParentConstraintIntervalDescription : {
        startDescriptionTpl : '"{2}" planifié manuellement contraint ses enfants à commencer au plus tôt le {0}',
        endDescriptionTpl   : '"{2}" planifié manuellement contraint ses enfants à finir au plus tard le {1}'
    },

    DisableManuallyScheduledConflictResolution : {
        descriptionTpl : 'Désactiver la planification manuelle pour "{0}"'
    },

    DependencyConstraintIntervalDescription : {
        descriptionTpl : 'Dépendance ({2}) du "{3}" au "{4}"'
    },

    RemoveDependencyResolution : {
        descriptionTpl : 'Retirer la dépendance du "{1}" au "{2}"'
    },

    DeactivateDependencyResolution : {
        descriptionTpl : 'Désactiver la dépendance du "{1}" au "{2}"'
    },

    DateConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Tâche "{2}" {3} {0} contrainte',
        endDateDescriptionTpl   : 'Tâche "{2}" {3} {1} contrainte',
        constraintTypeTpl       : {
            startnoearlierthan  : 'Début au plus tôt le',
            finishnoearlierthan : 'Fin au plus tôt le',
            muststarton         : 'Doit débuter le',
            mustfinishon        : 'Doit finir le',
            startnolaterthan    : 'Début au plus tard le',
            finishnolaterthan   : 'Fin au plus tard le'
        }
    },

    RemoveDateConstraintConflictResolution : {
        descriptionTpl : 'Retirer "{1}" contrainte de tâche "{0}"'
    },

    PostponeDateConstraintConflictResolution : {
        descriptionTpl : 'Reporter la résolution et signaler la tâche "{0}" avec un marqueur de conflit'
    }
}

export default LocaleHelper.publishLocale(locale)
