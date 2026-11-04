import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'LT',
    localeDesc : 'Lietuvių',
    localeCode : 'lt-LT',
    localeRtl  : false,

    RemoveDependencyCycleEffectResolution : {
        descriptionTpl : 'Pašalinti priklausomybę'
    },

    DeactivateDependencyCycleEffectResolution : {
        descriptionTpl : 'Išjungti priklausomybę'
    },

    CycleEffectDescription : {
        descriptionTpl : 'Ciklas rastas, suformuotas: {0}'
    },

    EmptyCalendarEffectDescription : {
        descriptionTpl               : '„{0}“ kalendoriuje nėra jokių darbo laiko intervalų.',
        forwardDescriptionTpl        : '„{2}“ užduoties atlikti negalima. „{0}“ kalendoriuje nėra darbo laiko po {1}.',
        backwardDescriptionTpl       : '„{2}“ užduoties atlikti negalima. „{0}“ kalendoriuje nėra darbo laiko iki {1}.',
        noIntersectionDescriptionTpl : '„{2}“ užduoties atlikti negalima. Jo „{0}“ kalendorius ir jo išteklių kalendoriai neturi bendro darbo laiko.'
    },

    Use24hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Naudokitės 24 valandų kalendoriumi su laisvais šeštadieniais ir sekmadieniais.'
    },

    Use8hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Naudokitės 8 valandų kalendoriumi (08.00–12.00, 13.00–17.00) su laisvais šeštadieniais ir sekmadieniais.'
    },

    IgnoreProjectConstraintResolution : {
        descriptionTpl : 'Nepaisykite projekto sienos ir tęskite pakeitimą.'
    },

    ProjectConstraintConflictEffectDescription : {
        startDescriptionTpl : 'Perkėlėte užduotį „{0}“, kad pradėtumėte {1}. Tai yra prieš projekto pradžios datą {2}.',
        endDescriptionTpl   : 'Perkėlėte užduotį „{0}“, kad užbaigtumėte {1}. Tai yra po projekto pabaigos datos {2}.'
    },

    HonorProjectConstraintResolution : {
        descriptionTpl : 'Sureguliuokite užduotį, kad ji atitiktų projekto sieną.'
    },

    IgnoreResourceCalendarEmptyCalendarEffectResolution : {
        descriptionTpl : 'Nepaisykite išteklių kalendorių ir suplanuokite užduotį naudodami tik savo kalendorių.'
    },

    ConflictEffectDescription : {
        descriptionTpl : 'Rastas planavimo nesutapimas: {0} nesutampa su {1}'
    },

    ConstraintIntervalDescription : {
        dateFormat : 'LLL'
    },

    ProjectConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Projekto pradžios data {0}',
        endDateDescriptionTpl   : 'Projekto pabaigos data {0}'
    },

    DependencyType : {
        long : [
            'Nuo pradžios iki pradžios',
            'Nuo pradžios iki pabaigos',
            'Nuo pabaigos iki pradžios',
            'Nuo pabaigos iki pabaigos'
        ]
    },

    ManuallyScheduledParentConstraintIntervalDescription : {
        startDescriptionTpl : 'Rankiniu būdu suplanuota "{2}" verčia vaikus pradėti ne anksčiau kaip {0}',
        endDescriptionTpl   : 'Rankiniu būdu suplanuota "{2}" verčia vaikus baigti ne vėliau nei {1}'
    },

    DisableManuallyScheduledConflictResolution : {
        descriptionTpl : 'Išjungti rankinį planavimą "{0}"'
    },

    DependencyConstraintIntervalDescription : {
        descriptionTpl : 'Priklausomybė ({2}) nuo "{3}" iki "{4}"'
    },

    RemoveDependencyResolution : {
        descriptionTpl : 'Šalinti priklausymą nuo "{1}" iki "{2}"'
    },

    DeactivateDependencyResolution : {
        descriptionTpl : 'Deaktyvuoti priklausymą nuo "{1}" iki "{2}"'
    },

    DateConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Užduoties "{2}" {3} {0} apribojimas',
        endDateDescriptionTpl   : 'Užduoties "{2}" {3} {1} apribojimas',
        constraintTypeTpl       : {
            startnoearlierthan  : 'Pradėti ne anksčiau kaip',
            finishnoearlierthan : 'Baigti ne anksčiau kaip',
            muststarton         : 'Turi prasidėti',
            mustfinishon        : 'Turi baigtis',
            startnolaterthan    : 'Pradėti ne vėliau kaip',
            finishnolaterthan   : 'Baigti ne vėliau kaip'
        }
    },

    RemoveDateConstraintConflictResolution : {
        descriptionTpl : 'Šalinti "{1}" užduoties apribojimą "{0}"'
    },

    PostponeDateConstraintConflictResolution : {
        descriptionTpl : 'Atidėkite sprendimą ir pažymėkite užduotį "{0}" naudodami konflikto žymeklį'
    }
}

export default LocaleHelper.publishLocale(locale);
