import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'Lv',
    localeDesc : 'Latviešu',
    localeCode : 'lv-LV',
    localeRtl  : false,

    RemoveDependencyCycleEffectResolution : {
        descriptionTpl : 'Noņemt atkarību'
    },

    DeactivateDependencyCycleEffectResolution : {
        descriptionTpl : 'Deaktivizēt atkarību'
    },

    CycleEffectDescription : {
        descriptionTpl : 'Ir atrasts cikls, ko veido: {0}'
    },

    EmptyCalendarEffectDescription : {
        descriptionTpl               : '"{0}" kalendārs nenodrošina nekādus darba laika intervālus.',
        forwardDescriptionTpl        : 'Uzdevumu "{2}" nevar izpildīt. Kalendāram "{0}" nav darba laika pēc {1}.',
        backwardDescriptionTpl       : 'Uzdevumu "{2}" nevar izpildīt. Kalendāram "{0}" nav darba laika pirms {1}.',
        noIntersectionDescriptionTpl : 'Uzdevumu "{2}" nevar izpildīt. Tā kalendāram "{0}" un tā resursu kalendāriem nav kopīga darba laika.'
    },

    Use24hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Izmantojiet 24-stundu kalendāru ar brīvdienām sestdienās un svētdienās.'
    },

    Use8hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Izmantojiet 8-stundu kalendāru (08.00–12.00, 13.00–17.00) ar brīvdienām sestdienās un svētdienās.'
    },

    IgnoreProjectConstraintResolution : {
        descriptionTpl : 'Ignorējiet projekta robežu un turpiniet veikt izmaiņas.'
    },

    ProjectConstraintConflictEffectDescription : {
        startDescriptionTpl : 'Jūs pārvietojāt uzdevumu "{0}", lai sāktu darbu šādā datumā: {1}. Tas ir pirms projekta sākuma datuma {2}.',
        endDescriptionTpl   : 'Jūs pārvietojāt uzdevumu "{0}", lai pabeigtu {1}. Tas ir pēc projekta beigu datuma {2}.'
    },

    HonorProjectConstraintResolution : {
        descriptionTpl : 'Pielāgojiet uzdevumu, lai ievērotu projekta robežu.'
    },

    IgnoreResourceCalendarEmptyCalendarEffectResolution : {
        descriptionTpl : 'Ignorējiet resursu kalendārus un ieplānojiet uzdevumu, izmantojot tikai savu kalendāru.'
    },

    ConflictEffectDescription : {
        descriptionTpl : 'Pamanīts plānošanas konflikts: {0} konfliktē ar {1}'
    },

    ConstraintIntervalDescription : {
        dateFormat : 'LLL'
    },

    ProjectConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Projekta sākuma datums {0}',
        endDateDescriptionTpl   : 'Projekta beigu datums {0}'
    },

    DependencyType : {
        long : [
            'No sākuma līdz sākumam',
            'No sākuma līdz beigām',
            'No beigām līdz sākumam',
            'No beigām līdz beigām'
        ]
    },

    ManuallyScheduledParentConstraintIntervalDescription : {
        startDescriptionTpl : 'Manuāli ieplānotais "{2}" liek tam pakārtotajiem notikumiem sākties ne agrāk kā {0}',
        endDescriptionTpl   : 'Manuāli ieplānotais "{2}" liek tam pakārtotajiem notikumiem beigties ne vēlāk kā {1}'
    },

    DisableManuallyScheduledConflictResolution : {
        descriptionTpl : 'Atspējot manuālu plānošanu šim: "{0}"'
    },

    DependencyConstraintIntervalDescription : {
        descriptionTpl : 'Atkarība ({2}) no "{3}" līdz "{4}"'
    },

    RemoveDependencyResolution : {
        descriptionTpl : 'Noņemt atkarību "{1}" no "{2}"'
    },

    DeactivateDependencyResolution : {
        descriptionTpl : 'Deaktivizēt atkarību no "{1}" līdz "{2}"'
    },

    DateConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Uzdevuma "{2}" {3} {0} ierobežojums',
        endDateDescriptionTpl   : 'Uzdevuma "{2}" {3} {1} ierobežojums',
        constraintTypeTpl       : {
            startnoearlierthan  : 'Sākt ne agrāk kā',
            finishnoearlierthan : 'Pabeigt ne agrāk kā',
            muststarton         : 'Ir jāsākas:',
            mustfinishon        : 'Ir jābeidzas:',
            startnolaterthan    : 'Sākt ne vēlāk kā',
            finishnolaterthan   : 'Pabeigt ne vēlāk kā'
        }
    },

    RemoveDateConstraintConflictResolution : {
        descriptionTpl : 'Noņemt "{1}" ierobežojumu uzdevumam "{0}"'
    },

    PostponeDateConstraintConflictResolution : {
        descriptionTpl : 'Atlikt risinājumu un atzīmēt uzdevumu "{0}" ar konflikta marķieri'
    }
}

export default LocaleHelper.publishLocale(locale);
