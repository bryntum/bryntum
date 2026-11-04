import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Ca',
    localeDesc : 'Català',
    localeCode : 'ca-ES',
    localeRtl  : false,

    RemoveDependencyCycleEffectResolution : {
        descriptionTpl : 'Elimina la dependència'
    },

    DeactivateDependencyCycleEffectResolution : {
        descriptionTpl : 'Desactiva la dependència'
    },

    CycleEffectDescription : {
        descriptionTpl : "S'ha trobat un cicle, format per: {0}"
    },

    EmptyCalendarEffectDescription : {
        descriptionTpl               : 'El calendari "{0}" no proporciona intervals de temps de treball.',
        forwardDescriptionTpl        : 'La tasca "{2}" no es pot realitzar. El calendari "{0}" no té hora de treball després del dia {1}.',
        backwardDescriptionTpl       : 'La tasca "{2}" no es pot realitzar. El calendari "{0}" no té hora de treball abans del dia {1}.',
        noIntersectionDescriptionTpl : 'La tasca "{2}" no es pot realitzar. El seu calendari "{0}" i els seus calendaris de recursos no tenen temps de treball comú.'
    },

    Use24hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Utilitzeu el calendari de 24 hores amb dissabtes i diumenges no feiners.'
    },

    Use8hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Utilitzeu el calendari de 8 hores (08:00-12:00, 13:00-17:00) amb dissabtes i diumenges no feiners.'
    },

    IgnoreProjectConstraintResolution : {
        descriptionTpl : 'Ignoreu la vora del projecte i procediu amb el canvi.'
    },

    ProjectConstraintConflictEffectDescription : {
        startDescriptionTpl : "Has mogut la tasca \"{0}\" per començar el {1}. Això és abans de la data d'inici del projecte {2}.",
        endDescriptionTpl   : 'Has mogut la tasca "{0}" per acabar el dia {1}. Això passa després de la data de finalització del projecte {2}.'
    },

    HonorProjectConstraintResolution : {
        descriptionTpl : 'Ajusteu la tasca per respectar la vora del projecte.'
    },

    IgnoreResourceCalendarEmptyCalendarEffectResolution : {
        descriptionTpl : 'Ignoreu els calendaris de recursos i programeu la tasca només amb el seu propi calendari.'
    },

    ConflictEffectDescription : {
        descriptionTpl : "S'ha detectat un conflicte de planificació: {0} està en conflicte amb {1}"
    },

    ConstraintIntervalDescription : {
        dateFormat : 'LLL'
    },

    ProjectConstraintIntervalDescription : {
        startDateDescriptionTpl : "Data d'inici del projecte {0}",
        endDateDescriptionTpl   : 'Data de finalització del projecte {0}'
    },

    DependencyType : {
        long : [
            'Inici a inici',
            'Inici a final',
            'Final a inici',
            'Final a final'
        ]
    },

    ManuallyScheduledParentConstraintIntervalDescription : {
        startDescriptionTpl : "L'element \"{2}\" planificat manualment força que els seus elements secundaris no s'iniciïn abans de {0}",
        endDescriptionTpl   : "L'element \"{2}\" planificat manualment força que els seus elements secundaris no acabin després de {1}"
    },

    DisableManuallyScheduledConflictResolution : {
        descriptionTpl : 'Desactiva la planificació manual de "{0}"'
    },

    DependencyConstraintIntervalDescription : {
        descriptionTpl : 'Dependència ({2}) de "{3}" a "{4}"'
    },

    RemoveDependencyResolution : {
        descriptionTpl : 'Elimina la dependència de "{1}" a "{2}"'
    },

    DeactivateDependencyResolution : {
        descriptionTpl : 'Desactiva la dependència de "{1}" a "{2}"'
    },

    DateConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Restricció {3} {0} de la tasca "{2}"',
        endDateDescriptionTpl   : 'Restricció {3} {1} de la tasca "{2}"',
        constraintTypeTpl       : {
            startnoearlierthan  : 'No començar abans de',
            finishnoearlierthan : 'No acabar abans de',
            muststarton         : 'Ha de començar el',
            mustfinishon        : "Ha d'acabar el",
            startnolaterthan    : 'No començar després de',
            finishnolaterthan   : 'No acabar després de'
        }
    },

    RemoveDateConstraintConflictResolution : {
        descriptionTpl : 'Elimina la restricció "{1}" de la tasca "{0}"'
    },

    PostponeDateConstraintConflictResolution : {
        descriptionTpl : 'Posposa la resolució i marca la tasca "{0}" amb el marcador de conflicte'
    }
}

export default LocaleHelper.publishLocale(locale);
