import LocaleHelper from '../../Core/localization/LocaleHelper.js'

const locale = {

    localeName : 'Fi',
    localeDesc : 'Suomi',
    localeCode : 'fi',
    localeRtl  : false,

    RemoveDependencyCycleEffectResolution : {
        descriptionTpl : 'Poista riippuvuus'
    },

    DeactivateDependencyCycleEffectResolution : {
        descriptionTpl : 'Poista riippuvuus käytöstä'
    },

    CycleEffectDescription : {
        descriptionTpl : '{0} muodostama sykli on löytynyt'
    },

    EmptyCalendarEffectDescription : {
        descriptionTpl               : '"{2}" tehtävää ei voida suorittaa. "{0}" Kalenteri ei tarjoa työaikaa.',
        forwardDescriptionTpl        : '"{2}" tehtävää ei voida suorittaa. "{0}" Kalenterilla ei ole työaikaa {1} jälkeen.',
        backwardDescriptionTpl       : '"{2}" tehtävää ei voida suorittaa. "{0}" Kalenterilla ei ole työaikaa ennen {1}.',
        noIntersectionDescriptionTpl : '"{2}" tehtävää ei voida suorittaa. Sen "{0}" kalenterilla ja resurssikalentereilla ei ole yleistä työaikaa.'
    },

    Use24hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Käytä 24 tunnin kalenteria, joissa Lauantait ja Sunnuntait eivät ole työpäiviä.'
    },

    Use8hrsEmptyCalendarEffectResolution : {
        descriptionTpl : 'Käytä 8 tunnin kalenteria (08:00-12:00, 13:00-17:00) jossa Lauantait ja sunnuntait eivät ole työpäiviä.'
    },

    IgnoreProjectConstraintResolution : {
        descriptionTpl : 'Ohita projektin raja ja jatka muutosta.'
    },

    ProjectConstraintConflictEffectDescription : {
        startDescriptionTpl : 'Siirrit "{0}" tehtävän aloittaa {1}. Tämä on ennen projektin alkamispäivää {2}.',
        endDescriptionTpl   : 'Siirrit "{0}" Tehtävää loppuun {1}. Tämä on projektin päättymispäivän jälkeen {2}.'
    },

    HonorProjectConstraintResolution : {
        descriptionTpl : 'Säädä tehtävää projektin rajan kunnioittamiseksi.'
    },

    IgnoreResourceCalendarEmptyCalendarEffectResolution : {
        descriptionTpl : 'Ohita resurssikalenterit ja ajoita tehtävä vain omalla kalenterillaan.'
    },

    ConflictEffectDescription : {
        descriptionTpl : 'Aikataulukonflikti on löytynyt: {0} on ristiriidassa {1} kanssa'
    },

    ConstraintIntervalDescription : {
        dateFormat : 'LLL'
    },

    ProjectConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Projektin aloituspäivämäärä {0}',
        endDateDescriptionTpl   : 'Projektin lopetuspäivämäärä {0}'
    },

    DependencyType : {
        long : [
            'alusta alkuun',
            'alusta loppuun',
            'maalista alkuun',
            'maalista maaliin'
        ]
    },

    ManuallyScheduledParentConstraintIntervalDescription : {
        startDescriptionTpl : 'Aikataulutettu manuaalisesti "{2}" pakottaa lapsensa aloittamaan aikaisintaan {0}',
        endDescriptionTpl   : 'Aikataulutettu manuaalisesti "{2}" pakottaa lapsenta lopettamaan aikaisintaan {1}'
    },

    DisableManuallyScheduledConflictResolution : {
        descriptionTpl : 'Poista manuaalinen aikatauluttaminen käytöstä käyttäjälle "{0}"'
    },

    DependencyConstraintIntervalDescription : {
        descriptionTpl : 'Riippuvuus ({2}) välillä "{3}" ja "{4}"'
    },

    RemoveDependencyResolution : {
        descriptionTpl : 'Poista riippuvuus välillä "{1}" ja "{2}"'
    },

    DeactivateDependencyResolution : {
        descriptionTpl : 'Kytke pois päältä riippuvuus välillä "{1}" ja "{2}"'
    },

    DateConstraintIntervalDescription : {
        startDateDescriptionTpl : 'Tehtävä "{2}" {3} {0} rajoitus',
        endDateDescriptionTpl   : 'Tehtävä "{2}" {3} {1} rajoitus',
        constraintTypeTpl       : {
            startnoearlierthan  : 'Aloitus aikaisintaan',
            finishnoearlierthan : 'Lopetus aikaisintaan',
            muststarton         : 'On aloitettava',
            mustfinishon        : 'On lopetettava',
            startnolaterthan    : 'Aloitus viimeistään',
            finishnolaterthan   : 'Lopetus viimeistään'
        }
    },

    RemoveDateConstraintConflictResolution : {
        descriptionTpl : 'Poista "{1}" rajoitus tehtävästä "{0}"'
    },

    PostponeDateConstraintConflictResolution : {
        descriptionTpl : 'Lykkää ratkaisua ja merkitse tehtävä "{0}" ristiriitamerkinnällä'
    }
}

export default LocaleHelper.publishLocale(locale)
