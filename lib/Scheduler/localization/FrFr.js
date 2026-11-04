import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/FrFr.js';
import '../../Grid/localization/FrFr.js';

const locale = {

    localeName : 'FrFr',
    localeDesc : 'Français (France)',
    localeCode : 'fr-FR',
    localeRtl  : false,

    Object : {
        newEvent    : 'Nouvel événement',
        information : 'Information',
        showDetails : 'Afficher les détails'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' événement' + (data !== 1 ? 's' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Basculer la colonne de mise en page des ressources. ESPACE pour le menu contextuel.'
    },

    Dependencies : {
        from    : 'De',
        to      : 'à',
        valid   : 'Valide',
        invalid : 'Invalide'
    },

    DependencyType : {
        SS           : 'DD',
        SF           : 'DF',
        FS           : 'FD',
        FF           : 'FF',
        StartToStart : 'Du début au début',
        StartToEnd   : 'Du début à la fin',
        EndToStart   : 'De la fin au début',
        EndToEnd     : 'De la fin à la fin',
        short        : [
            'DD',
            'DF',
            'FD',
            'FF'
        ],
        long : [
            'Du début au début',
            'Du début à la fin',
            'De la fin au début',
            'De la fin à la fin'
        ]
    },

    DependencyEdit : {
        From              : 'Du',
        To                : 'Au',
        Type              : 'Type',
        Lag               : 'Retard',
        color             : 'Couleur',
        lineStyle         : 'Style de ligne',
        solid             : 'Solide',
        dashed            : 'Tirets',
        dotted            : 'Pointillés',
        dashDot           : 'Tiret-point',
        longDash          : 'Long tiret',
        'Edit dependency' : 'Éditer la dépendance',
        Save              : 'Enregistrer',
        Delete            : 'Supprimer',
        Cancel            : 'Annuler',
        StartToStart      : 'Du début au début',
        StartToEnd        : 'Du début à la fin',
        EndToStart        : 'De la fin au début',
        EndToEnd          : 'De la fin à la fin',
        Active            : 'Active'
    },

    EventEdit : {
        Name           : 'Nom',
        Resource       : 'Ressource',
        Start          : 'Début',
        startTime      : 'Heure de début',
        End            : 'Fin',
        endTime        : 'Heure de fin',
        Save           : 'Enregistrer',
        Delete         : 'Supprimer',
        Cancel         : 'Annuler',
        'Edit event'   : "Éditer l'événement",
        Repeat         : 'Répéter',
        editRecurrence : 'Modifier la récurrence'
    },

    EventDrag : {
        eventOverlapsExisting   : "Chevauchement d'événements, événement déjà existant pour cette ressource",
        noDropOutsideTimeline   : "L'événement n'a peut-être pas été complètement déposé hors de la chronologie",
        duplicateAssignmentDrag : "L'événement ne peut pas être affecté plusieurs fois à la même ressource"
    },

    SchedulerBase : {
        'Add event'      : 'Ajouter un événement',
        'Delete event'   : 'Supprimer un événement',
        'Unassign event' : 'Désattribuer un événement',
        color            : 'Couleur',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, commence à ${startDate} ${eventRecord.duration > 0 ? `pour ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zoom',
        activeDateRange : 'Plage de dates',
        startText       : 'Date de début',
        endText         : 'Date de fin',
        todayText       : "Aujourd'hui"
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Axe temporel affichant de ${startDate} à ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : "Copier l'événement",
        cutEvent   : "Couper l'événement",
        pasteEvent : "Coller l'événement"
    },

    EventFilter : {
        filterEvents : 'Filtrer les tâches',
        byName       : 'Par nom'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Afficher la chronologie actuelle'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Secondes'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD/MM, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD/MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Jour'
        },
        day : {
            name : 'Jour/heures'
        },
        week : {
            name : 'Semaine/heures'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Semaine/jours'
        },
        dayAndMonth : {
            name : 'Mois'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Semaine'
        },
        weekAndMonth : {
            name : 'Semaines'
        },
        weekAndDayLetter : {
            name : 'Semaines/jours de la semaine'
        },
        weekDateAndMonth : {
            name : 'Mois/semaines'
        },
        monthAndYear : {
            name : 'Mois'
        },
        year : {
            name : 'Années'
        },
        manyYears : {
            name : 'Plusieurs années'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Vous êtes en train de supprimer un événement',
        'delete-all-message'        : 'Voulez-vous supprimer toutes les occurrences de cet événement ?',
        'delete-further-message'    : "Voulez-vous supprimer cet événement et toutes les occurrences futures de cet événement, ou uniquement l'occurrence sélectionnée ?",
        'delete-only-this-message'  : 'Voulez-vous supprimer cette occurrence de cet événement?',
        'delete-further-btn-text'   : 'Effacer tous les événements futurs',
        'delete-only-this-btn-text' : 'Effacer uniquement cet événement',
        'update-title'              : 'Vous modifiez un événement récurrent',
        'update-all-message'        : 'Voulez-vous modifier toutes les occurrences de cet événement ?',
        'update-further-message'    : "Voulez-vous changer seulement cette occurrence de l'événement, ou cette occurrence et toutes les occurrences futures ?",
        'update-only-this-message'  : 'Voulez-vous modifier cette occurrence de cet événement?',
        'update-further-btn-text'   : 'Tous les événements futurs',
        'update-only-this-btn-text' : 'Seulement cet événement',
        Yes                         : 'Oui',
        Cancel                      : 'Annuler',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' et ',
        Daily                           : 'Quotidien',
        'Weekly on {1}'                 : ({ days }) => `Hebdomadaire, le ${days}`,
        'Monthly on {1}'                : ({ days }) => `Mensuel, le ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Annuel, le ${days} de ${months}`,
        'Every {0} days'                : ({ interval }) => `Tous les ${interval} jours`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Toutes les ${interval} semaines, le ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Tous les ${interval} mois, le ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Tous les ${interval} ans, le ${days} ${months}`,
        position1                       : 'le premier',
        position2                       : 'le second',
        position3                       : 'le troisième',
        position4                       : 'le quatrième',
        position5                       : 'le cinquième',
        'position-1'                    : 'le dernier',
        day                             : 'jour',
        weekday                         : 'jour (semaine)',
        'weekend day'                   : 'jour (week-end)',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : "Répéter l'événement",
        Cancel              : 'Annuler',
        Save                : 'Sauvegarder',
        Frequency           : 'Fréquence',
        Every               : 'Tous les',
        DAILYintervalUnit   : 'jour(s)',
        WEEKLYintervalUnit  : 'semaine(s)',
        MONTHLYintervalUnit : 'mois(s)',
        YEARLYintervalUnit  : 'an(s)',
        Each                : 'Chaque',
        on                  : 'Le',
        the                 : 'Dans le',
        'On the'            : 'Le',
        'End repeat'        : 'Mettre fin à la répétition',
        'time(s)'           : 'fois(s)',
        Days                : 'Jours',
        Months              : 'Mois'
    },

    RecurrenceDaysCombo : {
        day           : 'jour',
        weekday       : 'jour (semaine)',
        'weekend day' : 'jour (week-end)'
    },

    RecurrencePositionsCombo : {
        position1    : 'premier',
        position2    : 'second',
        position3    : 'troisième',
        position4    : 'quatrième',
        position5    : 'cinquième',
        'position-1' : 'dernier'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Jamais',
        After     : 'Après',
        'On date' : 'Le'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Pas de répétition',
        Daily   : 'Quotidien',
        Weekly  : 'Hebdomadaire',
        Monthly : 'Mensuel',
        Yearly  : 'Annuel'
    },

    RecurrenceCombo : {
        None   : 'Aucun(e)',
        Custom : 'Personnalisé...'
    },

    Summary : {
        'Summary for' : date => `Résumé pour le ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Planning complet',
        currentview  : 'Planning visible',
        daterange    : 'Plage de dates',
        completedata : 'Planning complet (pour tous les événements)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Plage de planification',
        'Export from'    : 'Du',
        'Export to'      : 'Au'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Page unique'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : "Page unique (non mise à l'échelle)"
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Pages multiples (vertical)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Aucune ressource assignée'
    },

    CrudManagerView : {
        serverResponseLabel : 'Réponse du serveur :'
    },

    DurationColumn : {
        Duration : 'Durée'
    },

    EventClusteringBase : {
        unnamed         : 'Sans nom',
        more            : count => `+ ${count} de plus`,
        clusteredEvents : count => `${count} événements regroupés`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} plages regroupées`
    },

    ConstraintTypePicker : {
        none                : 'Aucune',
        assoonaspossible    : 'Le plus tôt possible',
        aslateaspossible    : 'Le plus tard possible',
        muststarton         : 'Doit débuter le',
        mustfinishon        : 'Doit finir le',
        startnoearlierthan  : 'Début au plus tôt le',
        startnolaterthan    : 'Début au plus tard le',
        finishnoearlierthan : 'Fin au plus tôt le',
        finishnolaterthan   : 'Fin au plus tard le'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} temps tampon avant l'événement`;
            }
            if (postamble) {
                description += `.${postamble.toString()} temps tampon après l'événement`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Avant',
        Backward      : 'Arrière',
        inheritedFrom : 'Hérité de',
        enforcedBy    : 'Imposé par'
    },

    CalendarField : {
        'Default calendar' : 'Calendrier par défaut',
        editCalendar       : 'Modifier le calendrier'
    },

    TaskEditorBase : {
        Information   : 'Informations sur la tâche',
        Save          : 'Enregistrer',
        Cancel        : 'Annuler',
        Delete        : 'Supprimer',
        calculateMask : 'Calcul en cours...',
        saveError     : "Impossible d'enregistrer, corrigez d'abord les erreurs",
        repeatingInfo : 'Afficher un événement récurrent',
        editRepeating : 'Modifier'
    },

    TaskEdit : {
        editEvent              : "Éditer l'événement",
        ConfirmDeletionTitle   : 'Confirmer la suppression',
        ConfirmDeletionMessage : "Êtes-vous sûr de vouloir supprimer l'événement ?"
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '33em'
    },

    SchedulerGeneralTab : {
        General      : 'Général',
        Name         : 'Nom',
        Resources    : 'Ressources',
        '% complete' : 'Achevées à %',
        Duration     : 'Durée',
        Start        : 'Début',
        Finish       : 'Fin',
        Effort       : 'Effort',
        Preamble     : 'Préambule',
        Postamble    : 'Postambule'
    },

    GeneralTab : {
        General      : 'Général',
        Name         : 'Nom',
        '% complete' : 'Achevées à %',
        Duration     : 'Durée',
        Start        : 'Début',
        Finish       : 'Fin',
        Effort       : 'Effort',
        Dates        : 'Dates'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Avancé',
        Calendar                   : 'Calendrier',
        'Scheduling mode'          : 'Mode de planification',
        'Effort driven'            : 'Effort fourni',
        'Manually scheduled'       : 'Planifié manuellement',
        'Constraint type'          : 'Type de contrainte',
        'Constraint date'          : 'Date de contrainte',
        Inactive                   : 'Inactif',
        'Ignore resource calendar' : 'Ignorer le calendrier des ressources'
    },

    CalendarEditorDatePicker : {
        addException : 'Ajouter une exception',
        addWeek      : 'Ajouter la semaine'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Ajouter une exception',
        removeException : "Supprimer l'exception",
        noRows          : 'Aucune exception ajoutée'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Ajouter la semaine',
        removeWeek : 'Supprimer la semaine'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Les jours fonctionnent par défaut',
        workingTimeCalendar        : 'Calendrier de temps de travail',
        exceptions                 : 'Des exceptions',
        general                    : 'Général',
        name                       : 'Nom',
        parent                     : 'Parent',
        save                       : 'Sauvegarder',
        weeks                      : 'Semaines',
        error                      : 'Erreur',
        inputErrors                : "Il y a des erreurs d'entrée. Veuillez les réparer avant d'enregistrer vos modifications.",
        delete                     : 'Supprimer',
        addCalendar                : 'Ajouter un calendrier',
        confirmation               : 'Confirmation',
        removeCalendarWithChildren : 'Le calendrier a des calendriers enfants. Cliquez sur "Oui" pour supprimer le calendrier avec ses enfants.',
        removeCalendarAndLinks     : 'Le calendrier est utilisé par certains enregistrements. Cliquez sur "Oui" pour les dénoncer et supprimer le calendrier.',
        newException               : 'Nouvelle exception',
        newWeek                    : 'Nouvelle semaine'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' travaille',
        isNotWorking : ' ne fonctionne pas',
        basedOn      : ' basé sur:',
        byDefault    : 'par défaut',
        rangeTpl     : (start, end) => `${start} à 17h30`
    },

    CalendarEditorLegend : {
        workingDay    : 'Jour ouvrable',
        nonWorkingDay : 'Jour de repos'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Il y a des gammes de chevauchement',
        errorMissingDate   : 'Des heures de début et de fin sont nécessaires',
        errorStartAfterEnd : "L'heure de début ne peut pas être après l'heure de fin"
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Nom',
        from                                 : 'Depuis',
        to                                   : 'À',
        is                                   : 'Est',
        nonWorking                           : 'Ne fonctionne pas',
        working                              : 'Fonctionnement',
        hours                                : 'Heures',
        repeat                               : 'Répéter',
        repeatEnd                            : 'Répéter la fin',
        errorMissingDate                     : "Une plage de dates d'exception est requise",
        errorStartAfterEnd                   : '"Depuis" la date ne peut pas être après la date "à" ',
        errorStartAndEndRepeatNumberMismatch : "L'exception doit commencer et terminer le même nombre de fois"
    },

    CalendarEditorWeekPanel : {
        name        : 'Nom',
        from        : 'Depuis',
        to          : 'À',
        days        : 'Jours',
        copyDay     : 'Jour de copie',
        pasteDay    : 'Jour de la pâte',
        stopCopying : 'Arrêtez de copier'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Ajouter la plage',
        removeRange : 'Supprimer la plage'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"Depuis" la date ne peut pas être après la date "à" ',
        errorNoDefaultWeek           : 'La configuration de la semaine est requise',
        errorMultipleDefaultWeeks    : "Plus d'une semaine par défaut est spécifiée",
        errorNoWeekAvailability      : 'La semaine doit fournir un peu de temps de travail',
        errorInvalidWeekAvailability : 'La semaine a des erreurs de configuration de temps de travail',
        noRows                       : 'Aucune semaine ajoutée'
    },

    AdvancedTab : {
        Advanced                   : 'Avancé',
        Calendar                   : 'Calendrier',
        'Scheduling mode'          : 'Mode de planification',
        'Effort driven'            : 'Effort fourni',
        'Manually scheduled'       : 'Planifié manuellement',
        'Constraint type'          : 'Type de contrainte',
        'Constraint date'          : 'Date de contrainte',
        Constraint                 : 'Contrainte',
        Rollup                     : 'Report au récapitulatif',
        Inactive                   : 'Inactif',
        'Ignore resource calendar' : 'Ignorer le calendrier des ressources',
        'Scheduling direction'     : 'Direction de planification',
        projectBorder              : 'Frontière du projet',
        ignore                     : 'Ignorer',
        honor                      : 'Honneur',
        askUser                    : "Demander à l'utilisateur"
    },

    DependencyTab : {
        Predecessors      : 'Prédécesseurs',
        Successors        : 'Successeurs',
        ID                : 'Identifiant',
        Name              : 'Nom',
        Type              : 'Type',
        Lag               : 'Retard',
        cyclicDependency  : 'Dépendance cyclique',
        invalidDependency : 'Dépendance invalide',
        readOnlyTask      : 'Impossible de lier une tâche en lecture seule'
    },

    NotesTab : {
        Notes : 'Notes'
    },

    ResourceCalendarColumn : {
        calendar : 'Calendrier'
    },

    ResourceEdit : {
        editResource : 'Modifier la ressource'
    },

    ResourceEditor : {
        resourceInformation : 'Informations sur les ressources',
        costs               : 'Frais',
        save                : 'Sauvegarder',
        error               : 'Erreur',
        inputErrors         : "Il y a des erreurs de saisie. Veuillez les corriger avant d'enregistrer vos modifications.",
        delete              : 'Supprimer',
        confirmation        : 'Confirmation',
        removeUsedResource  : 'La ressource est affectée à certaines tâches. Cliquez sur "Oui" pour supprimer quand même la ressource.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Calendrier',
        general     : 'Général',
        label       : 'Étiquette du matériau',
        name        : 'Nom de la ressource',
        type        : 'Taper',
        costAccrual : 'Comptabilisation des coûts',
        labelHint   : 'par exemple, kg, tonnes ou cartons',
        maxUnits    : 'Unités max'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Accumuler à',
        prorated : 'Au prorata',
        start    : 'Commencer',
        end      : 'Fin'
    },

    CostAccrualField : {
        prorated : 'Au prorata',
        start    : 'Commencer',
        end      : 'Fin'
    },

    ResourceType : {
        work     : 'Travail',
        material : 'Matériel',
        cost     : 'Coût'
    },

    ResourceTypeColumn : {
        type : 'Taper'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Tableau des tarifs',
        newGroup     : 'Nouveau tableau',
        removeGroup  : 'Supprimer le tableau',
        useByDefault : 'Utiliser par défaut pour les affectations de ressources',
        noRates      : 'Pas de tarifs'
    },

    ResourceGrid : {
        name          : 'Nom',
        materialLabel : 'Étiquette du matériau',
        maxUnits      : 'Unités maximales',
        cost          : 'Coût',
        noRows        : 'Aucune ressource'
    },

    ResourceRateTableContainer : {
        startDate    : 'Date de début',
        standardRate : 'Tarif standard',
        perUseCost   : 'Coût par utilisation',
        addRate      : 'Ajouter un tarif',
        removeRate   : 'Supprimer le taux',
        name         : 'Nom',
        noRates      : 'Pas de tarifs'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Informations sur le tableau des tarifs'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Quantité',
        Resources   : 'Ressources',
        Resource    : 'Ressource',
        Units       : 'Unités',
        cost        : 'Coût',
        effort      : 'Effort',
        start       : 'Commencer',
        finish      : 'Finition',
        preamble    : 'Préambule',
        postamble   : 'Postambule'
    },

    RateTableColumn : {
        rateTable : 'Tableau des tarifs'
    },

    RecurrenceTab : {
        title : 'Répéter'
    },

    SchedulingModePicker : {
        Normal           : 'Normal',
        'Fixed Duration' : 'Durée fixe',
        'Fixed Units'    : 'Unités fixes',
        'Fixed Effort'   : 'Effort fixe'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} sur {available}</span> allouées',
        barTipOnDate          : '<b>{resource}</b> le {startDate}<br><span class="{cls}">{allocated} sur {available}</span> allouées',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} sur {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} sur {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'Le {startDate}<br><span class="{cls}">{allocated} sur {available}</span> allouées :<br>{assignments}',
        plusMore              : '+{value} de plus'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Effort</div><div class="b-effort-value {cls}">{allocated} sur {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Effort</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Coût</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Quantité</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} le {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Résumé pour {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Résumé pour {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} de plus',
        nameColumnText        : 'Ressource / Événement'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Annuler le changement et ne rien faire',
        schedulingConflict : 'Conflit de planification',
        emptyCalendar      : 'Erreur de configuration du calendrier',
        cycle              : 'Cycle de planification',
        Apply              : 'Appliquer'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Veuillez sélectionner une dépendance :',
        invalidDependencyLabel : 'Des dépendances invalides sont impliquées et doivent être résolues :'
    },

    SchedulerProBase : {
        propagating     : 'Calcul du projet en cours',
        storePopulation : 'Chargement des données en cours',
        finalizing      : 'Résultats en cours de finalisation'
    },

    EventSegments : {
        splitEvent    : "Diviser l'événement",
        renameSegment : 'Renommer'
    },

    NestedEvents : {
        createGroup         : 'Grouper les événements sélectionnés',
        newGroupName        : 'Nouveau groupe',
        deNestingNotAllowed : 'Désimbrication non autorisée',
        nestingNotAllowed   : 'Imbrication non autorisée'
    },

    VersionGrid : {
        compare       : 'Comparer',
        description   : 'Description',
        occurredAt    : "S'est produit à",
        rename        : 'Renommer',
        restore       : 'Restaurer',
        stopComparing : 'Arrêter de comparer'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'tâche',
            AssignmentModel : 'affectation',
            DependencyModel : 'lien',
            ProjectModel    : 'projet',
            ResourceModel   : 'ressource',
            other           : 'objet'
        },
        entityNamesPlural : {
            TaskModel       : 'tâches',
            AssignmentModel : 'affectations',
            DependencyModel : 'liens',
            ProjectModel    : 'projets',
            ResourceModel   : 'ressources',
            other           : 'objets'
        },
        transactionDescriptions : {
            update : 'Modifié {n} {entities}',
            add    : 'Ajouté {n} {entities}',
            remove : 'Supprimé {n} {entities}',
            move   : 'Déplacé {n} {entities}',
            mixed  : 'Modifié {n} {entities}'
        },
        propertyNames : {
            active                   : 'Actif',
            allDay                   : 'Toute la journée',
            allowOverlap             : 'Permettre le chevauchement',
            barMargin                : 'Marge de barre',
            bidirectional            : 'Bidirectionnel',
            calendar                 : 'Calendrier',
            cls                      : 'Classe CSS',
            constraintDate           : 'Date de contrainte',
            constraintType           : 'Type de contrainte',
            daysPerMonth             : 'Jours par mois',
            daysPerWeek              : 'Jours par semaine',
            delayFromParent          : 'Délai depuis le parent',
            direction                : 'Direction',
            drawDependencies         : 'Dessiner les dépendances',
            duration                 : 'Durée',
            durationUnit             : 'Unité de durée',
            effort                   : 'Effort',
            effortDriven             : "Basé sur l'effort",
            effortUnit               : "Unité d'effort",
            endDate                  : 'Date de fin',
            eventColor               : 'Couleur',
            eventId                  : "ID d'Événement",
            eventLayout              : "Disposition de l'événement",
            eventStyle               : 'Style de barre',
            exceptionDates           : "Dates d'exception",
            fixed                    : 'Fixé',
            from                     : 'De',
            fromSide                 : 'Côté de départ',
            hoursPerDay              : 'Heures par jour',
            href                     : 'Lien',
            iconCls                  : 'Icône',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignorer le calendrier des ressources',
            ignoreTimeZone           : 'Ignorer le fuseau horaire',
            image                    : 'Image',
            imageUrl                 : "URL de l'image",
            inactive                 : 'Inactif',
            intervals                : 'Intervalles',
            lag                      : 'Retard',
            lagUnit                  : 'Unité de retard',
            lineStyle                : 'Style de ligne',
            manuallyScheduled        : 'Planifié manuellement',
            milestoneWidth           : 'Largeur du jalon',
            name                     : 'Nom',
            note                     : 'Note',
            parentId                 : 'ID Parent',
            parentIndex              : 'Position',
            percentDone              : '% terminé',
            postamble                : 'Postambule',
            preamble                 : 'Préambule',
            readOnly                 : 'Lecture seule',
            recurrenceRule           : 'Règle de récurrence',
            resourceId               : 'ID de Ressource',
            resourceMargin           : 'Marge de ressource',
            rowHeight                : 'Hauteur de ligne',
            schedulingMode           : 'Mode de planification',
            segments                 : 'Segments',
            showAvatar               : "Afficher l'avatar",
            showInTimeline           : 'Afficher dans la chronologie',
            startDate                : 'Date de début',
            stickyContents           : 'Contenus fixes',
            strokeColor              : 'Couleur de ligne',
            style                    : 'Style',
            target                   : 'Cible du lien',
            to                       : 'À',
            toSide                   : "Côté d'arrivée",
            type                     : 'Type',
            units                    : 'Unités',
            unscheduled              : 'Non planifié',
            unspecifiedTimeIsWorking : 'Le temps non spécifié est travaillé',
            version                  : 'Version'
        },
        intervals : {
            working    : 'Travail',
            nonWorking : 'Non-travail',
            fromTo     : 'De {from} à {to}',
            recurring  : 'Récurrent commençant {start} se terminant {end}'
        },
        addEntity         : 'Ajouté {type} **{name}**',
        removeEntity      : 'Supprimé {type} **{name}**',
        updateEntity      : 'Modifié {type} **{name}**',
        moveEntity        : 'Déplacé {type} **{name}** de {from} à {to}',
        addDependency     : 'Ajouté le lien de **{from}** à **{to}**',
        removeDependency  : 'Supprimé le lien de **{from}** à **{to}**',
        updateDependency  : 'Modifié le lien de **{from}** à **{to}**',
        addAssignment     : 'Affecté **{resource}** à **{event}**',
        removeAssignment  : 'Supprimé **{resource}** de **{event}**',
        updateAssignment  : "Modifier l'éffectation de **{resource}** à **{event}**",
        noChanges         : 'Aucun changement',
        nullValue         : 'aucun',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Enregistré à {date}',
        autoSavedAt       : 'Enregistré automatiquement à {date}',
        undid             : 'Annulé les modifications',
        redid             : 'Rétabli les modifications',
        editedTask        : 'Modifié les propriétés de la tâche',
        deletedTask       : 'Supprimé une tâche',
        movedTask         : 'Déplacé une tâche',
        movedTasks        : 'Déplacé des tâches'
    }
};

export default LocaleHelper.publishLocale(locale);
