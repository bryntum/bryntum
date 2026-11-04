import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Uk',
    localeDesc : 'Українська',
    localeCode : 'uk-UA',
    localeRtl  : false,

    RemoveDependencyCycleEffectResolution : {
        descriptionTpl : 'Видалити залежність'
    },

    DeactivateDependencyCycleEffectResolution : {
        descriptionTpl : 'Деактивувати залежність'
    },

    CycleEffectDescription : {
        descriptionTpl : 'Знайдено цикл, який утворили: {0}'
    },

    EmptyCalendarEffectDescription : {
        descriptionTpl               : 'У календарі "{0}" не вказано проміжки робочого часу.',
        forwardDescriptionTpl        : 'Неможливо виконати завдання "{2}". Календар "{0}" не має робочого часу після {1}.',
        backwardDescriptionTpl       : 'Неможливо виконати завдання "{2}". Календар "{0}" не має робочого часу до {1}.',
        noIntersectionDescriptionTpl : 'Неможливо виконати завдання "{2}". Його календар "{0}" і календарі ресурсів не мають спільного робочого часу.'
    },

    Use24hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Використовуйте 24-годинний календар, в якому субота та неділя – неробочі дні.'
    },

    Use8hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Використовуйте 8-годинний календар (08:00–12:00, 13:00–17:00), в якому субота та неділя – неробочі дні.'
    },

    IgnoreProjectConstraintResolution : {
        descriptionTpl : 'Ігноруйте межі проекту та продовжуйте вносити зміни.'
    },

    ProjectConstraintConflictEffectDescription : {
        startDescriptionTpl : 'Ви перемістили завдання "{0}" для початку {1}. Це передує даті початку проекту {2}.',
        endDescriptionTpl   : 'Ви перемістили завдання "{0}", щоб завершити на {1}. Це після дати завершення проекту {2}.'
    },

    HonorProjectConstraintResolution : {
        descriptionTpl : 'Відкоригуйте завдання, щоб дотримуватися меж проекту.'
    },

    IgnoreResourceCalendarEmptyCalendarEffectResolution : {
        descriptionTpl : 'Ігноруйте календарі ресурсів і плануйте завдання лише за допомогою власного календаря.'
    },

    ConflictEffectDescription : {
        descriptionTpl : 'Виявлено конфлікт розкладів: {0} конфліктує з {1}'
    },

    ConstraintIntervalDescription : {
        dateFormat : 'LLL'
    },

    ProjectConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Дата початку проекту {0}',
        endDateDescriptionTpl   : 'Дата завершення проекту {0}'
    },

    DependencyType : {
        long : [
            'Початок-початок',
            'Початок-завершення',
            'Завершення-початок',
            'Завершення-завершення'
        ]
    },

    ManuallyScheduledParentConstraintIntervalDescription : {
        startDescriptionTpl : '"{2}" створено вручну таким чином, що діти не зможуть почати раніше, ніж {0}',
        endDescriptionTpl   : '"{2}" створено вручну таким чином, що діти не зможуть почати пізніше, ніж {1}'
    },

    DisableManuallyScheduledConflictResolution : {
        descriptionTpl : 'Вимкнути ручне планування для "{0}"'
    },

    DependencyConstraintIntervalDescription : {
        descriptionTpl : 'Залежність ({2}) від "{3}" до "{4}"'
    },

    RemoveDependencyResolution : {
        descriptionTpl : 'Видалити залежніть від "{1}" до "{2}"'
    },

    DeactivateDependencyResolution : {
        descriptionTpl : 'Деактивувати залежніть від "{1}" до "{2}"'
    },

    DateConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Обмеження {3} {0} для завдання "{2}"',
        endDateDescriptionTpl   : 'Обмеження {3} {1} для завдання "{2}"',
        constraintTypeTpl       : {
            startnoearlierthan  : 'Почати не раніше, ніж',
            finishnoearlierthan : 'Завершити не раніше, ніж',
            muststarton         : 'Треба почати в',
            mustfinishon        : 'Треба завершити до',
            startnolaterthan    : 'Почати не пізніше, ніж',
            finishnolaterthan   : 'Завершити не пізніше, ніж'
        }
    },

    RemoveDateConstraintConflictResolution : {
        descriptionTpl : 'Видалити обмеження "{1}" для завдання "{0}"'
    },

    PostponeDateConstraintConflictResolution : {
        descriptionTpl : 'Відкласти вирішення та позначити завдання "{0}" маркером конфлікту'
    }
}

export default LocaleHelper.publishLocale(locale);
