import LocaleHelper from '../../Core/localization/LocaleHelper.js'

const locale = {

    localeName : 'Ru',
    localeDesc : 'Русский',
    localeCode : 'ru',
    localeRtl  : false,

    RemoveDependencyCycleEffectResolution : {
        descriptionTpl : 'Удалить зависимость'
    },

    DeactivateDependencyCycleEffectResolution : {
        descriptionTpl : 'Деактивировать зависимость'
    },

    CycleEffectDescription : {
        descriptionTpl : 'Обнаружены циклические данные. Цикл образуют следующие задачи: {0}'
    },

    EmptyCalendarEffectDescription : {
        descriptionTpl               : 'Задача "{2}" не может быть выполнена. "{0}" календарь не предоставляет никакого рабочего времени.',
        forwardDescriptionTpl        : 'Задача "{2}" не может быть выполнена. Календарь "{0}" не имеет рабочего времени после {1}.',
        backwardDescriptionTpl       : 'Задача "{2}" не может быть выполнена. Календарь "{0}" не имеет рабочего времени до {1}.',
        noIntersectionDescriptionTpl : 'Задача "{2}" не может быть выполнена. Её календарь "{0}" и календари её ресурсов не имеют общего рабочего времени.'
    },

    Use24hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Использовать 24-часовой календарь с выходными субботой и воскресеньем.'
    },

    Use8hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Использовать 8-часовой календарь (08:00-12:00, 13:00-17:00) с выходными субботой и воскресеньем.'
    },

    IgnoreProjectConstraintResolution : {
        descriptionTpl : 'Не обращать внимания на границу проекта и применить изменения.'
    },

    ProjectConstraintConflictEffectDescription : {
        startDescriptionTpl : 'Вы переместили задачу "{0}", чтобы начать {1}. Это до даты начала проекта {2}.',
        endDescriptionTpl   : 'Вы переместили задачу "{0}", чтобы закончить {1}. Это после даты окончания проекта {2}.'
    },

    HonorProjectConstraintResolution : {
        descriptionTpl : 'Подвинуть задачу чтобы соблюсти границу проекта.'
    },

    IgnoreResourceCalendarEmptyCalendarEffectResolution : {
        descriptionTpl : 'Игнорировать календари ресурсов и использовать только собственный календарь задачи.'
    },

    ConflictEffectDescription : {
        descriptionTpl : 'Обнаружен конфликт планирования: {0} конфликтует с {1}'
    },

    ConstraintIntervalDescription : {
        dateFormat : 'LLL'
    },

    ProjectConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Начало проекта {0}',
        endDateDescriptionTpl   : 'Окончание проекта {0}'
    },

    DependencyType : {
        long : [
            'Начало-Начало',
            'Начало-Окончание',
            'Окончание-Начало',
            'Окончание-Окончание'
        ]
    },

    ManuallyScheduledParentConstraintIntervalDescription : {
        startDescriptionTpl : '"{2}" запланирована вручную и предписывает подзадачам начать не раньше {0}',
        endDescriptionTpl   : '"{2}" запланирована вручную и предписывает подзадачам закончить не позднее {1}'
    },

    DisableManuallyScheduledConflictResolution : {
        descriptionTpl : 'Отключить ручное планирование задачи "{0}"'
    },

    DependencyConstraintIntervalDescription : {
        descriptionTpl : 'Зависимость ({2}) от "{3}" к "{4}"'
    },

    RemoveDependencyResolution : {
        descriptionTpl : 'Удалить зависимость от "{1}" к "{2}"'
    },

    DeactivateDependencyResolution : {
        descriptionTpl : 'Деактивировать зависимость от "{1}" к "{2}"'
    },

    DateConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Ограничение {3} {0} задачи "{2}"',
        endDateDescriptionTpl   : 'Ограничение {3} {1} задачи "{2}"',
        constraintTypeTpl       : {
            startnoearlierthan  : 'Начало-не-раньше',
            finishnoearlierthan : 'Окончание-не-раньше',
            muststarton         : 'Фиксированное-начало',
            mustfinishon        : 'Фиксированное-окончание',
            startnolaterthan    : 'Начало-не-позднее',
            finishnolaterthan   : 'Окончание-не-позднее'
        }
    },

    RemoveDateConstraintConflictResolution : {
        descriptionTpl : 'Удалить ограничение "{1}" с задачи "{0}"'
    },

    PostponeDateConstraintConflictResolution : {
        descriptionTpl : 'Отложить решение и пометить задачу "{0}" маркером конфликта.'
    }
}

export default LocaleHelper.publishLocale(locale)
