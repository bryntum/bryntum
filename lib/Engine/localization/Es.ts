import LocaleHelper from '../../Core/localization/LocaleHelper.js'

const locale = {

    localeName : 'Es',
    localeDesc : 'Español',
    localeCode : 'es',
    localeRtl  : false,

    RemoveDependencyCycleEffectResolution : {
        descriptionTpl : 'Eliminar dependencia'
    },

    DeactivateDependencyCycleEffectResolution : {
        descriptionTpl : 'Desactivar dependencia'
    },

    CycleEffectDescription : {
        descriptionTpl : 'Se ha encontrado un ciclo formado por: {0}'
    },

    EmptyCalendarEffectDescription : {
        descriptionTpl               : 'La tarea "{2}" no se puede realizar. El calendario "{0}" no proporciona ningún intervalo de tiempo de trabajo.',
        forwardDescriptionTpl        : 'La tarea "{2}" no se puede realizar. El calendario "{0}" no tiene tiempo de trabajo después de {1}.',
        backwardDescriptionTpl       : 'La tarea "{2}" no se puede realizar. El calendario "{0}" no tiene tiempo de trabajo antes {1}.',
        noIntersectionDescriptionTpl : 'La tarea "{2}" no se puede realizar. Su calendario "{0}" y sus calendarios de recursos no tienen un tiempo de trabajo común.'
    },

    Use24hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Use un calendario de 24 con los sábados y dominngos no lectivos.'
    },

    Use8hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Use un calendario de 8 horas (08:00-12:00, 13:00-17:00) con sábados y domingos no lectivos.'
    },

    IgnoreProjectConstraintResolution : {
        descriptionTpl : 'Ignore la frontera del proyecto y continúe con el cambio.'
    },

    ProjectConstraintConflictEffectDescription : {
        startDescriptionTpl : 'Moviste la tarea "{0}" para comenzar {1}. Esto es antes de la fecha de inicio del proyecto {2}.',
        endDescriptionTpl   : 'Movió la tarea "{0}" para finalizar {1}. Esto es después de la fecha de finalización del proyecto {2}.'
    },

    HonorProjectConstraintResolution : {
        descriptionTpl : 'Ajuste la tarea para honrar la frontera del proyecto.'
    },

    IgnoreResourceCalendarEmptyCalendarEffectResolution : {
        descriptionTpl : 'Ignore los calendarios de recursos y programen la tarea solo con su propio calendario.'
    },

    ConflictEffectDescription : {
        descriptionTpl : 'Se ha detectado un conflicto de programación: {0} está en conflicto con {1}'
    },

    ConstraintIntervalDescription : {
        dateFormat : 'LLL'
    },

    ProjectConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Fecha de inicio del proyecto {0}',
        endDateDescriptionTpl   : 'Fecha de finalización del proyecto {0}'
    },

    DependencyType : {
        long : [
            'De inicio a inicio',
            'De inicio a finalización',
            'De finalización a inicio',
            'De finalización a finalización'
        ]
    },

    ManuallyScheduledParentConstraintIntervalDescription : {
        startDescriptionTpl : '"{2}" programado manualmente fuerza a sus dependientes a no empezar antes de {0}',
        endDescriptionTpl   : '"{2}" programado manualmente fuerza a sus dependientes a no empezar antes de {1}'
    },

    DisableManuallyScheduledConflictResolution : {
        descriptionTpl : 'Desactivar programación manual para "{0}"'
    },

    DependencyConstraintIntervalDescription : {
        descriptionTpl : 'Dependencia ({2}) desde "{3}" hasta "{4}"'
    },

    RemoveDependencyResolution : {
        descriptionTpl : 'Eliminar dependencia de "{1}" a "{2}"'
    },

    DeactivateDependencyResolution : {
        descriptionTpl : 'Desactivar dependencia desde "{1}" hasta "{2}"'
    },

    DateConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Limitación de tareas "{2}" {3} {0}',
        endDateDescriptionTpl   : 'Limitación de tareas "{2}" {3} {1}',
        constraintTypeTpl       : {
            startnoearlierthan  : 'Empezar no antes del',
            finishnoearlierthan : 'Terminar no antes del',
            muststarton         : 'Debe empezar el',
            mustfinishon        : 'Debe terminar el',
            startnolaterthan    : 'Empezar no después del',
            finishnolaterthan   : 'Terminar no después del'
        }
    },

    RemoveDateConstraintConflictResolution : {
        descriptionTpl : 'Eliminar limitación "{1}" de la tarea "{0}"'
    },

    PostponeDateConstraintConflictResolution : {
        descriptionTpl : 'Posponer la resolución y marcar la tarea "{0}" con marcador de conflicto'
    }
}

export default LocaleHelper.publishLocale(locale)
