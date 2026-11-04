import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'SrRs',
    localeDesc : 'Српски (ћирилица)',
    localeCode : 'sr-RS',
    localeRtl  : false,

    RemoveDependencyCycleEffectResolution : {
        descriptionTpl : 'Уклони зависност'
    },

    DeactivateDependencyCycleEffectResolution : {
        descriptionTpl : 'Деактивирај зависност'
    },

    CycleEffectDescription : {
        descriptionTpl : 'Циклус је пронађен, форматиран од стране: {0}'
    },

    EmptyCalendarEffectDescription : {
        descriptionTpl               : 'Календар „{0}“ не пружа временске интервале рада.',
        forwardDescriptionTpl        : 'Задатак „{2}“ није могуће извршити. Календар „{0}“ нема радно време после {1}.',
        backwardDescriptionTpl       : 'Задатак „{2}“ није могуће извршити. Календар „{0}“ нема радно време пре {1}.',
        noIntersectionDescriptionTpl : 'Задатак „{2}“ није могуће извршити. Његов календар „{0}“ и календари ресурса немају заједничко радно време.'
    },

    Use24hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Користите календар од 24 сата са нерадним суботама и недељама.'
    },

    Use8hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Користите календар од 8 сати (08:00–12:00, 13:00–17:00) са нерадним суботама и недељама.'
    },

    IgnoreProjectConstraintResolution : {
        descriptionTpl : 'Занемарите границу пројекта и наставите са променом.'
    },

    ProjectConstraintConflictEffectDescription : {
        startDescriptionTpl : 'Преместили сте задатак „{0}“ да почне {1}. Ово је пре датума почетка пројекта {2}.',
        endDescriptionTpl   : 'Преместили сте задатак „{0}“ да се заврши {1}. Ово је после датума завршетка пројекта {2}.'
    },

    HonorProjectConstraintResolution : {
        descriptionTpl : 'Прилагодите задатак да поштује границу пројекта.'
    },

    IgnoreResourceCalendarEmptyCalendarEffectResolution : {
        descriptionTpl : 'Занемарите календаре ресурса и закажите задатак користећи само сопствени календар.'
    },

    ConflictEffectDescription : {
        descriptionTpl : 'Пронађен је конфликт у распореду: {0} је у конфликту са {1}'
    },

    ConstraintIntervalDescription : {
        dateFormat : 'LLL'
    },

    ProjectConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Датум почетка пројекта {0}',
        endDateDescriptionTpl   : 'Датум завршетка пројекта {0}'
    },

    DependencyType : {
        long : [
            'Од почетка ка почетку',
            'Од почетка ка завршетку',
            'Од завршетка ка почетку',
            'Од завршетка ка завршетку'
        ]
    },

    ManuallyScheduledParentConstraintIntervalDescription : {
        startDescriptionTpl : 'Ручно заказано "{2}" тера своје подређене да почну не раније од {0}',
        endDescriptionTpl   : 'Ручно заказано "{2}" тера своје подређене да заврше не касније од {1}'
    },

    DisableManuallyScheduledConflictResolution : {
        descriptionTpl : 'Онемогући ручно заказивање за "{0}"'
    },

    DependencyConstraintIntervalDescription : {
        descriptionTpl : 'Зависност ({2}) од "{3}" дo "{4}"'
    },

    RemoveDependencyResolution : {
        descriptionTpl : 'Уклоните зависност од "{1}" дo "{2}"'
    },

    DeactivateDependencyResolution : {
        descriptionTpl : 'Деактивирај зависност од "{1}" дo "{2}"'
    },

    DateConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Задатак "{2}" {3} {0} ограничен',
        endDateDescriptionTpl   : 'Задатак "{2}" {3} {1} ограничен',
        constraintTypeTpl       : {
            startnoearlierthan  : 'Почетак не пре',
            finishnoearlierthan : 'Заврши не пре',
            muststarton         : 'Мора да почне дана',
            mustfinishon        : 'Мора да се заврши дана',
            startnolaterthan    : 'Почетак не касније од',
            finishnolaterthan   : 'Заврши не касније од'
        }
    },

    RemoveDateConstraintConflictResolution : {
        descriptionTpl : 'Уклони "{1}" ограничење за задатак "{0}"'
    },

    PostponeDateConstraintConflictResolution : {
        descriptionTpl : 'Одложите резолуцију и означите задатак "{0}" маркером сукоба'
    }
}

export default LocaleHelper.publishLocale(locale);
