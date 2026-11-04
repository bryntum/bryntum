import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Gl',
    localeDesc : 'Galego',
    localeCode : 'gl-ES',
    localeRtl  : false,

    RemoveDependencyCycleEffectResolution : {
        descriptionTpl : 'Eliminar dependencia'
    },

    DeactivateDependencyCycleEffectResolution : {
        descriptionTpl : 'Desactivar dependencia'
    },

    CycleEffectDescription : {
        descriptionTpl : 'Atopouse un ciclo, formado por: {0}'
    },

    EmptyCalendarEffectDescription : {
        descriptionTpl               : 'O calendario "{0}" non proporciona intervalos de horario de traballo.',
        forwardDescriptionTpl        : 'Non se pode realizar a tarefa "{2}". O calendario "{0}" non ten tempo de traballo despois do {1}.',
        backwardDescriptionTpl       : 'Non se pode realizar a tarefa "{2}". O calendario "{0}" non ten tempo de traballo antes do {1}.',
        noIntersectionDescriptionTpl : 'Non se pode realizar a tarefa "{2}". O seu calendario "{0}" e os seus calendarios de recursos non teñen un tempo de traballo común.'
    },

    Use24hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Use o calendario de 24-horas con sábados e domingos non laborables.'
    },

    Use8hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Use o calendario de 8-horas (08:00-12:00, 13:00-17:00) con sábados e domingos non laborables.'
    },

    IgnoreProjectConstraintResolution : {
        descriptionTpl : 'Ignora a fronteira do proxecto e continúa co cambio.'
    },

    ProjectConstraintConflictEffectDescription : {
        startDescriptionTpl : 'Moveches a tarefa "{0}" para comezar o {1}. Isto é antes da data de inicio do proxecto {2}.',
        endDescriptionTpl   : 'Moveches a tarefa "{0}" para rematar o {1}. Isto é despois da data de finalización do proxecto {2}.'
    },

    HonorProjectConstraintResolution : {
        descriptionTpl : 'Axusta a tarefa para respectar a fronteira do proxecto.'
    },

    IgnoreResourceCalendarEmptyCalendarEffectResolution : {
        descriptionTpl : 'Ignora os calendarios de recursos e programa a tarefa só usando o seu propio calendario.'
    },

    ConflictEffectDescription : {
        descriptionTpl : 'Detectouse un conflito de programación: {0} entra en conflito con {1}'
    },

    ConstraintIntervalDescription : {
        dateFormat : 'LLL'
    },

    ProjectConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Data de inicio do proxecto {0}',
        endDateDescriptionTpl   : 'Data de fin do proxecto {0}'
    },

    DependencyType : {
        long : [
            'De inicio a inicio',
            'De inicio a fin',
            'De fin a inicio',
            'De fin a fin'
        ]
    },

    ManuallyScheduledParentConstraintIntervalDescription : {
        startDescriptionTpl : 'Programouse manualmente "{2}" que forza aos elementos secundarios a comezar non antes do {0}',
        endDescriptionTpl   : 'Programouse manualmente "{2}" que forza aos elementos secundarios a finalizar non despois do {1}'
    },

    DisableManuallyScheduledConflictResolution : {
        descriptionTpl : 'Desactivar a programación manual de "{0}"'
    },

    DependencyConstraintIntervalDescription : {
        descriptionTpl : 'Dependencia ({2}) de "{3}" a "{4}"'
    },

    RemoveDependencyResolution : {
        descriptionTpl : 'Eliminar dependencia de "{1}" a "{2}"'
    },

    DeactivateDependencyResolution : {
        descriptionTpl : 'Desactivar dependencia de "{1}" a "{2}"'
    },

    DateConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Tarefa "{2}" {3} {0} restrición',
        endDateDescriptionTpl   : 'Tarefa "{2}" {3} {1} restrición',
        constraintTypeTpl       : {
            startnoearlierthan  : 'Comezar non antes do',
            finishnoearlierthan : 'Finalizar non antes do',
            muststarton         : 'Debe comezar o',
            mustfinishon        : 'Debe finalizar o',
            startnolaterthan    : 'Comezar non despois do',
            finishnolaterthan   : 'Finalizar non despois do'
        }
    },

    RemoveDateConstraintConflictResolution : {
        descriptionTpl : 'Eliminar a restrición "{1}" da tarefa "{0}"'
    },

    PostponeDateConstraintConflictResolution : {
        descriptionTpl : 'Apraza a resolución e marca a tarefa "{0}" co marcador de conflito'
    }
}

export default LocaleHelper.publishLocale(locale);
