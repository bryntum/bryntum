import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Kk',
    localeDesc : 'Қазақ тілі (KZ)',
    localeCode : 'kk-KZ',
    localeRtl  : false,

    RemoveDependencyCycleEffectResolution : {
        descriptionTpl : 'Тәуелділікті жою'
    },

    DeactivateDependencyCycleEffectResolution : {
        descriptionTpl : 'Тәуелділікті өшіру'
    },

    CycleEffectDescription : {
        descriptionTpl : 'Бір цикл табылды, оны құрған: {0}'
    },

    EmptyCalendarEffectDescription : {
        descriptionTpl               : '"{0}" күнтізбесі ешқандай жұмыс уақыты аралығын қамтамасыз етпейді.',
        forwardDescriptionTpl        : '"{2}" тапсырмасын орындау мүмкін емес. "{0}" күнтізбесінде {1} кейін жұмыс уақыты жоқ.',
        backwardDescriptionTpl       : '"{2}" тапсырмасын орындау мүмкін емес. "{0}" күнтізбесінде {1} дейін жұмыс уақыты жоқ.',
        noIntersectionDescriptionTpl : '"{2}" тапсырмасын орындау мүмкін емес. Оның "{0}" күнтізбесінде және оның ресурстық күнтізбелерінде ортақ жұмыс уақыты жоқ.'
    },

    Use24hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Сенбі және жексенбі күндері жұмыс істемейтін 24 сағаттық күнтізбені пайдаланыңыз.'
    },

    Use8hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Сенбі және жексенбі күндері жұмыс істемейтін 8 сағаттық күнтізбені (08:00-12:00, 13:00-17:00) пайдаланыңыз.'
    },

    IgnoreProjectConstraintResolution : {
        descriptionTpl : 'Жоба шекарасын елемеңіз және өзгертуді жалғастырыңыз.'
    },

    ProjectConstraintConflictEffectDescription : {
        startDescriptionTpl : '"{0}" тапсырмасын {1} күні бастау үшін жылжыттыңыз. Бұл жобаның басталу күнінен бұрын {2}.',
        endDescriptionTpl   : '"{0}" тапсырмасын {1} күні аяқтау үшін жылжыттыңыз. Бұл жобаның аяқталу күнінен кейін ({2}).'
    },

    HonorProjectConstraintResolution : {
        descriptionTpl : 'Жоба шекарасын құрметтеу үшін тапсырманы реттеңіз.'
    },

    IgnoreResourceCalendarEmptyCalendarEffectResolution : {
        descriptionTpl : 'Ресурс күнтізбелерін елемеңіз және тапсырманы тек жеке күнтізбе арқылы жоспарлаңыз.'
    },

    ConflictEffectDescription : {
        descriptionTpl : 'Кестені жоспарлау қайшылығы табылды: {0} кестесі {1} кестесіне қайшы'
    },

    ConstraintIntervalDescription : {
        dateFormat : 'LLL'
    },

    ProjectConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Жобаның басталу күні {0}',
        endDateDescriptionTpl   : 'Жобаның аяқталу күні {0}'
    },

    DependencyType : {
        long : [
            'Бастау-бастау',
            'Бастау-аяқтау',
            'Аяқтау-бастау',
            'Аяқтау-аяқтау'
        ]
    },

    ManuallyScheduledParentConstraintIntervalDescription : {
        startDescriptionTpl : 'Қолмен жоспарланған "{2}" өз балаларын {0} уақытынан ерте бастамауға мәжбүрлеуде',
        endDescriptionTpl   : 'Қолмен жоспарланған "{2}" өз балаларын {1} уақытынан кеш бастамауға мәжбүрлеуде'
    },

    DisableManuallyScheduledConflictResolution : {
        descriptionTpl : '"{0}" үшін қолмен жоспарлауды өшіру'
    },

    DependencyConstraintIntervalDescription : {
        descriptionTpl : '({2}) тәуелділігі - "{3}" бастап "{4}" дейін'
    },

    RemoveDependencyResolution : {
        descriptionTpl : '"{1}" - "{2}" тәуелділігін жою'
    },

    DeactivateDependencyResolution : {
        descriptionTpl : '"{1}" - "{2}" тәуелділігін өшіру'
    },

    DateConstraintIntervalDescription : {
        startDateDescriptionTpl : '"{2}" тапсырмасының {3} {0} шектеуі',
        endDateDescriptionTpl   : '"{2}" тапсырмасының {3} {1} шектеуі',
        constraintTypeTpl       : {
            startnoearlierthan  : 'Басталуы осы күннен ерте емес',
            finishnoearlierthan : 'Аяқталуы осы күннен ерте емес',
            muststarton         : 'Бекітілген басталу күні',
            mustfinishon        : 'Бекітілген аяқталу күні',
            startnolaterthan    : 'Басталуы осы күннен кеш емес',
            finishnolaterthan   : 'Аяқталуы осы күннен кеш емес'
        }
    },

    RemoveDateConstraintConflictResolution : {
        descriptionTpl : '"{0}" тапсырмасының "{1}" шектеуін жою'
    },

    PostponeDateConstraintConflictResolution : {
        descriptionTpl : 'Шешімді кейінге қалдырыңыз және "{0}" тапсырмасын қайшылық белгісімен белгілеңіз'
    }
}

export default LocaleHelper.publishLocale(locale);
