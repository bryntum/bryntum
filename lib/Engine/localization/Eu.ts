import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Eu',
    localeDesc : 'Euskara',
    localeCode : 'eu-ES',
    localeRtl  : false,

    RemoveDependencyCycleEffectResolution : {
        descriptionTpl : 'Mendekotasuna kendu'
    },

    DeactivateDependencyCycleEffectResolution : {
        descriptionTpl : 'Desaktibatu mendekotasuna'
    },

    CycleEffectDescription : {
        descriptionTpl : 'Hauek osatutako ziklo bat aurkitu da: {0}'
    },

    EmptyCalendarEffectDescription : {
        descriptionTpl               : '"{0}" egutegiak ez du lanaren denbora-tarterik ematen.',
        forwardDescriptionTpl        : '"{2}" zeregina ezin da burutu. "{0}" egutegiak ez du lan ordurik {1} ondoren.',
        backwardDescriptionTpl       : '"{2}" zeregina ezin da burutu. "{0}" egutegiak ez du lan ordurik {1} baino lehen.',
        noIntersectionDescriptionTpl : '"{2}" zeregina ezin da burutu. Bere "{0}" egutegiak eta bere baliabideen egutegiek ez dute lanaldi arruntik.'
    },

    Use24hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Erabili 24 orduko egutegia larunbata eta igandea, lanegun gisa markatu gabe.'
    },

    Use8hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Erabili 8 orduko egutegia (08:00-12:00, 13:00-17:00), larunbata eta igandea lanegun gisa markatu gabe.'
    },

    IgnoreProjectConstraintResolution : {
        descriptionTpl : 'Ez ikusi proiektuaren ertzari eta jarraitu aldaketarekin.'
    },

    ProjectConstraintConflictEffectDescription : {
        startDescriptionTpl : '"{0}" ataza mugitu duzu {1}-n hasteko. Hau proiektuaren hasiera data baino lehen {2} da.',
        endDescriptionTpl   : '"{0}" ataza mugitu duzu {1} egunean amaitzeko. Proiektuaren amaiera dataren {2} ondorengoa da.'
    },

    HonorProjectConstraintResolution : {
        descriptionTpl : 'Doitu zeregina proiektuaren muga errespetatzeko.'
    },

    IgnoreResourceCalendarEmptyCalendarEffectResolution : {
        descriptionTpl : 'Ez ikusi baliabideen egutegiak eta programatu zeregina bere egutegia erabiliz soilik.'
    },

    ConflictEffectDescription : {
        descriptionTpl : 'Programazio-gatazka bat aurkitu da: {0} eta {1} gatazkan daude'
    },

    ConstraintIntervalDescription : {
        dateFormat : 'LLL'
    },

    ProjectConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Proiektuaren hasiera data {0}',
        endDateDescriptionTpl   : 'Proiektuaren amaiera-data {0}'
    },

    DependencyType : {
        long : [
            'Hasieratik-hasierara',
            'Hasieratik-amaierara',
            'Amaieratik-hasierara',
            'Amaieratik-amaierara'
        ]
    },

    ManuallyScheduledParentConstraintIntervalDescription : {
        startDescriptionTpl : 'Eskuz programatuta "{2}"k {0} baino lehen ez hastera behartu ditu seme-alabak',
        endDescriptionTpl   : 'Eskuz programatuta "{2}k seme-alabak behartu ditu {1} baino lehen amaitzera'
    },

    DisableManuallyScheduledConflictResolution : {
        descriptionTpl : 'Desgaitu eskuzko programazioa honetarako "{0}"'
    },

    DependencyConstraintIntervalDescription : {
        descriptionTpl : 'Dependentzia ({2}) "{3}"etatik "{4}"etara'
    },

    RemoveDependencyResolution : {
        descriptionTpl : 'Ezabatu dependentzia "{1}"etatik "{2}"etara'
    },

    DeactivateDependencyResolution : {
        descriptionTpl : 'Desaktibatu dependentzia "{1}"etatik "{2}"etara'
    },

    DateConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Ataza "{2}" {3} {0} murrizketa',
        endDateDescriptionTpl   : 'Ataza "{2}" {3} {1} murrizketa',
        constraintTypeTpl       : {
            startnoearlierthan  : 'Ez-hasi-egun-hau-baino-lehen',
            finishnoearlierthan : 'Ez-amaitu-egun-hau-baino-lehenago',
            muststarton         : 'Egun-honetan-hasi-behar-du',
            mustfinishon        : 'Egun-honetan-amaitu-behar-du',
            startnolaterthan    : 'Ez-hasi-egun-hau-baino-gero',
            finishnolaterthan   : 'Ez-amaitu-egun-hau-baino-geroago'
        }
    },

    RemoveDateConstraintConflictResolution : {
        descriptionTpl : 'Ezabatu "{1}" ataza-murrizketa "{0}"'
    },

    PostponeDateConstraintConflictResolution : {
        descriptionTpl : 'Atzeratu ebazpena eta markatu zeregina "{0}" gatazka-markatzailearekin'
    }
}

export default LocaleHelper.publishLocale(locale);
