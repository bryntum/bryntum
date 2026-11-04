import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/FrFr.js';

const locale = {

    localeName : 'FrFr',
    localeDesc : 'Français (France)',
    localeCode : 'fr-FR',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Calendrier',
        'All day' : 'Jour entier',
        day       : 'Jour',
        week      : 'Semaine',
        month     : 'Mois',
        year      : 'Année',
        decade    : 'Décennie'
    },

    EventMenu : {
        duplicateEvent : "Dupliquer l'événement",
        copy           : 'copier'
    },

    Calendar : {
        toggleSidebar : 'Basculer la visibilité de la barre latérale',
        Today         : "Aujourd'hui",
        Tomorrow      : 'Demain',
        next          : range => `Suivant ${range}`,
        previous      : range => `Précédent ${range}`,
        plusMore      : value => `+${value} de plus`,
        moreEvents    : value => `${value} événements supplémentaires`,
        allDay        : 'Jour entier',
        endsOn        : d => `Prend fin le ${d}`,
        weekOfYear    : ([y, w]) => `Semaine ${w}, ${y}`,
        loadFail      : 'Échec du chargement des données de calendrier. Veuillez contacter votre administrateur système',
        gotoDate      : 'Aller à la date',
        timeRange     : 'Plage horaire',
        noResources   : 'Aucune ressource',
        calendar      : 'Calendrier',
        toolbar       : "Barre d'outils du calendrier",
        months        : 'Mois'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Maintenir la touche CTRL enfoncée pour un événement récurrent'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Aucun'} événement${(count && count > 1) ? 's' : '' }`,
        allDayEventCount : count => `${count || 'Aucun'} événement sur toute la journée${count === 1 ? '' : 's'}`
    },

    EventTip : {
        'Edit event' : "Éditer l'événement",
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Inclure les week-ends',
        weekends        : 'Week-ends',
        switcherMenu    : 'Menu de sélection de vue'
    },

    AgendaView : {
        Agenda : 'Agenda'
    },

    MonthView : {
        Month     : 'Mois',
        monthUnit : 'mois'
    },

    MultiWeekView : {
        multiWeek : 'Multi-semaine'
    },

    WeekView : {
        weekUnit : 'semaine'
    },

    YearView : {
        Year     : 'Année',
        yearUnit : 'année',
        noEvents : "Pas d'événements"
    },

    YearPlanner : {
        yearPlanner      : 'Planificateur annuel',
        expandMonthRow   : 'Développer la rangée du mois',
        collapseMonthRow : 'Réduire la rangée du mois'
    },

    EventList : {
        List   : 'Liste',
        Start  : 'Début',
        Finish : 'Fin',
        days   : count => `${count > 1 ? `${count} ` : ''}jour${count === 1 ? '' : 's'}`
    },

    DayView : {
        Day                : 'Jour',
        dayUnit            : 'jour',
        daysUnit           : 'jours',
        expandAllDayRow    : 'Développer la section jour entier',
        collapseAllDayRow  : 'Réduire la section jour entier',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : ' Aucune date correspondante'
    },

    DayAgendaView : {
        dayAgenda : 'Agenda du jour'
    },

    DayResourceView : {
        dayResourceView : 'Ressources quotidiennes'
    },

    MonthGrid : {
        monthGrid : 'Grille mensuelle'
    },

    Sidebar : {
        selectDate      : 'Sélectionner la date du calendrier',
        matchEvents     : 'Événements de match',
        filterEvents    : "Filtrer les événements par nom de l'événement",
        filterResources : 'Filtrer les événements par ressource sélectionnée'
    },

    WeekExpander : {
        expandTip   : 'Cliquez pour développer la ligne',
        collapseTip : 'Cliquez pour réduire la ligne'
    },

    keyboardActions : {
        title   : 'Actions du clavier',
        content : "Afficher le panneau d'aide : [?]\nBouton de sélection du mode focus : [Home]\nChanger de vue : [1] à [9] ou première lettre du texte du bouton de sélection\nProchaine période : [n]\nPériode précédente : [p]\nAller à aujourd'hui : [t]\nNaviguer vers une date : [g]\nAller à la cellule du jour actuel : [CTRL]+[d]\nNaviguer entre les événements : [TAB]\nFocus sur le champ de filtre des événements de la barre latérale : [/]\nCréer un nouvel événement (focus sur la cellule du jour) : [ENTER]\nSupprimer l'événement en focus : [DELETE]/[BACKSPACE]\nModifier l'événement en focus : [ENTER]\nOuvrir le menu contextuel sur un événement ou une cellule : [SHIFT+F10]/[SPACE]\nFocus depuis un événement jusqu'à la cellule englobante : [ESCAPE]\nNavigation de cellule en cellule : [↑]/[↓]/[←]/[→]\nActiver le menu de plage (en vue Agenda) : [CTRL]+[r]\nCouper, copier, coller des événements : [CTRL]+[x]/[c]/[v]\nZoomer/dézoomer uniquement la vue Jour : [+]/[-]"
    }
};

export default LocaleHelper.publishLocale(locale);
