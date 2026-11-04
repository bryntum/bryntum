import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Nl.js';
import '../../Grid/localization/Nl.js';

const locale = {

    localeName : 'Nl',
    localeDesc : 'Nederlands',
    localeCode : 'nl',
    localeRtl  : false,

    Object : {
        newEvent    : 'Nieuwe boeking',
        information : 'Informatie',
        showDetails : 'Details weergeven'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' evenement' + (data !== 1 ? 'en' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Wissel de kolom van het resourcelay-out. SPACE voor contextmenu.'
    },

    Dependencies : {
        from    : 'Van',
        to      : 'Naar',
        valid   : 'Geldig',
        invalid : 'Ongeldig'
    },

    DependencyType : {
        SS           : 'GB',
        SF           : 'BE',
        FS           : 'EB',
        FF           : 'GE',
        StartToStart : 'Gelijk-Begin',
        StartToEnd   : 'Begin-na-Einde',
        EndToStart   : 'Einde-na-Begin',
        EndToEnd     : 'Gelijk-Einde',
        short        : [
            'GB',
            'BE',
            'EB',
            'GE'
        ],
        long : [
            'Gelijk-Begin',
            'Begin-na-Einde',
            'Einde-na-Begin',
            'Gelijk-Einde'
        ]
    },

    DependencyEdit : {
        From              : 'Van',
        To                : 'Tot',
        Type              : 'Type',
        Lag               : 'Achterstand',
        color             : 'Kleur',
        lineStyle         : 'Lijnstijl',
        solid             : 'Solide',
        dashed            : 'Gestreept',
        dotted            : 'Gestippeld',
        dashDot           : 'Streep-punt',
        longDash          : 'Lange streep',
        'Edit dependency' : 'Afhankelijkheid bewerken',
        Save              : 'Bewaar',
        Delete            : 'Verwijder',
        Cancel            : 'Annuleer',
        StartToStart      : 'Begin-Tot-Begin',
        StartToEnd        : 'Begin-Tot-Einde',
        EndToStart        : 'Einde-Tot-Start',
        EndToEnd          : 'Einde-Tot-Einde',
        Active            : 'Actief'
    },

    EventEdit : {
        Name           : 'Naam',
        Resource       : 'Resource',
        Start          : 'Start',
        startTime      : 'Starttijd',
        End            : 'Eind',
        endTime        : 'Eindtijd',
        Save           : 'Bewaar',
        Delete         : 'Verwijder',
        Cancel         : 'Annuleer',
        'Edit event'   : 'Wijzig item',
        Repeat         : 'Herhaal',
        editRecurrence : 'Herhaling bewerken'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Gebeurtenis overlapt bestaande gebeurtenis voor deze bron',
        noDropOutsideTimeline   : 'Evenement kan niet volledig buiten de tijdlijn worden verwijderd',
        duplicateAssignmentDrag : 'Gebeurtenis kan niet meerdere keren aan dezelfde bron worden toegewezen'
    },

    SchedulerBase : {
        'Add event'      : 'Voeg evenement toe',
        'Delete event'   : 'Verwijder item',
        'Unassign event' : 'Gebeurtenis ongedaan maken',
        color            : 'Kleur',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, begint om ${startDate} ${eventRecord.duration > 0 ? `voor ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zoom in',
        activeDateRange : 'Datum bereik',
        startText       : 'Start datum',
        endText         : 'Eind datum',
        todayText       : 'Vandaag'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Tijdas toont ${startDate} tot ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Kopieer item',
        cutEvent   : 'Knip item',
        pasteEvent : 'Plak item'
    },

    EventFilter : {
        filterEvents : 'Filter items',
        byName       : 'Op naam'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Maak huidige tijdlijn zichtbaar'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Seconden'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD-MM, hh',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD-MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Dag'
        },
        day : {
            name : 'Dag/uren'
        },
        week : {
            name : 'Week/uren'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Week/dagen'
        },
        dayAndMonth : {
            name : 'Maand'
        },
        weekAndDay : {
            displayDateFormat : 'hh:mm',
            name              : 'Week'
        },
        weekAndMonth : {
            name : 'Weken'
        },
        weekAndDayLetter : {
            name : 'Weken/doordeweekse dagen'
        },
        weekDateAndMonth : {
            name : 'Maanden/weken'
        },
        monthAndYear : {
            name : 'Maanden'
        },
        year : {
            name : 'Jaren'
        },
        manyYears : {
            name : 'Несколько лет'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'U verwijdert een plan item',
        'delete-all-message'        : 'Wilt u alle herhaalde afspraken van dit item verwijderen?',
        'delete-further-message'    : 'Wilt u het geselecteerde en alle toekomstige gebeurtenissen van dit item verwijderen, of aleen het geselecteerde item?',
        'delete-only-this-message'  : 'Wilt u dit voorkomen van dit evenement verwijderen?',
        'delete-further-btn-text'   : 'Verwijder alleen de toekomstige gebeurtenissen',
        'delete-only-this-btn-text' : 'Verwijder alleen deze gebeurtenis',
        'update-title'              : 'U verandert een herhaald item',
        'update-all-message'        : 'Wilt u alle herhaalde afspraken van dit item verwijderen?',
        'update-further-message'    : 'Wilt u het geselecteerde en alle toekomstige gebeurtenissen van dit item wijzigen, of aleen het geselecteerde item?',
        'update-only-this-message'  : 'Wilt u dit voorkomen van dit evenement wijzigen?',
        'update-further-btn-text'   : 'Wijzig alle toekomstige items',
        'update-only-this-btn-text' : 'Wijzig alleen dit item',
        Yes                         : 'Ja',
        Cancel                      : 'Annuleer',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' en ',
        Daily                           : 'Dagelijks',
        'Weekly on {1}'                 : ({ days }) => `Wekelijks op ${days}`,
        'Monthly on {1}'                : ({ days }) => `Maandelijks op ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Jaarlijks op ${days} ${months}`,
        'Every {0} days'                : ({ interval }) => `Elke ${interval} dagen`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Elke ${interval} weken op ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Elke ${interval} maanden in ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Elke ${interval} jaar op ${days} ${months}`,
        position1                       : 'de eerste',
        position2                       : 'de tweede',
        position3                       : 'de derde',
        position4                       : 'de vierde',
        position5                       : 'de vijfde',
        'position-1'                    : 'laatste',
        day                             : 'dag',
        weekday                         : 'weekdag',
        'weekend day'                   : 'weekend dag',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Herhaal gebeurtenis',
        Cancel              : 'Annuleer',
        Save                : 'Bewaar',
        Frequency           : 'Frequentie',
        Every               : 'Elke',
        DAILYintervalUnit   : 'dag(en)',
        WEEKLYintervalUnit  : 'week(en)',
        MONTHLYintervalUnit : 'maand(en)',
        YEARLYintervalUnit  : 'jaren(en)',
        Each                : 'Elke',
        on                  : 'Op',
        the                 : 'De',
        'On the'            : 'Op de',
        'End repeat'        : 'Einde herhaling',
        'time(s)'           : 'tijd(en)',
        Days                : 'Dagen',
        Months              : 'Maanden'
    },

    RecurrenceDaysCombo : {
        day           : 'dag',
        weekday       : 'weekdag',
        'weekend day' : 'weekend dag'
    },

    RecurrencePositionsCombo : {
        position1    : 'eerste',
        position2    : 'tweede',
        position3    : 'derde',
        position4    : 'vierde',
        position5    : 'vijfde',
        'position-1' : 'laatste'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Nooit',
        After     : 'Na',
        'On date' : 'Op datum'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Geen herhaling',
        Daily   : 'Dagelijks',
        Weekly  : 'Wekelijks',
        Monthly : 'Maandelijks',
        Yearly  : 'Jaarlijks'
    },

    RecurrenceCombo : {
        None   : 'Geen',
        Custom : 'Aangepast...'
    },

    Summary : {
        'Summary for' : date => `Samenvatting voor ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Compleet schema',
        currentview  : 'Huidige weergave',
        daterange    : 'Periode',
        completedata : 'Alle data (events)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Scheduler bereik',
        'Export from'    : 'Vanaf',
        'Export to'      : 'Naar'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Enkele pagina'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Enkele pagina (ongeschaald)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : "Meerdere pagina's (verticaal)"
    },

    ExcelExporter : {
        'No resource assigned' : 'Geen resource toegewezen'
    },

    CrudManagerView : {
        serverResponseLabel : 'Server reactie:'
    },

    DurationColumn : {
        Duration : 'Duur'
    },

    EventClusteringBase : {
        unnamed         : 'Naamloos',
        more            : count => `+ ${count} meer`,
        clusteredEvents : count => `${count} geclusterde evenementen`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} geclusterde bereiken`
    },

    ConstraintTypePicker : {
        none                : 'Geen',
        assoonaspossible    : 'Zo snel mogelijk',
        aslateaspossible    : 'Zo laat mogelijk',
        muststarton         : 'Niet eerder eindigen dan',
        mustfinishon        : 'Niet later eindigen dan',
        startnoearlierthan  : 'Moet beginnen op',
        startnolaterthan    : 'Moet eindigen op',
        finishnoearlierthan : 'Niet eerder beginnen dan',
        finishnolaterthan   : 'Niet later beginnen dan'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} buffertijd voor het evenement`;
            }
            if (postamble) {
                description += `.${postamble.toString()} buffertijd na het evenement`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Vooruit',
        Backward      : 'Achteruit',
        inheritedFrom : 'Geërfd van',
        enforcedBy    : 'Opgelegd door'
    },

    CalendarField : {
        'Default calendar' : 'Standaardkalender',
        editCalendar       : 'Kalender bewerken'
    },

    TaskEditorBase : {
        Information   : 'Taakinformatie',
        Save          : 'Opslaan',
        Cancel        : 'Annuleer',
        Delete        : 'Verwijder',
        calculateMask : 'Taken berekenen...',
        saveError     : 'Kan niet opslaan. Corrigeer eerst de fouten',
        repeatingInfo : 'Een herhaald item bekijken',
        editRepeating : 'Bewerk'
    },

    TaskEdit : {
        editEvent              : 'Bewerk boeking',
        ConfirmDeletionTitle   : 'Bevestig verwijderen',
        ConfirmDeletionMessage : 'Weet u zeker dat u dit item wilt verwijderen?'
    },

    GanttTaskEditor : {
        editorWidth : '55em'
    },

    SchedulerTaskEditor : {
        editorWidth : '42em'
    },

    SchedulerGeneralTab : {
        General      : 'Algemeen',
        Name         : 'Naam',
        Resources    : 'Resources',
        '% complete' : '% compleet',
        Duration     : 'Duur',
        Start        : 'Begin',
        Finish       : 'Einde',
        Effort       : 'Inspanning',
        Preamble     : 'Preamble',
        Postamble    : 'Postamble'
    },

    GeneralTab : {
        General      : 'Algemeen',
        Name         : 'Naam',
        '% complete' : '% compleet',
        Duration     : 'Duur',
        Start        : 'Begin',
        Finish       : 'Einde',
        Effort       : 'Inspanning',
        Dates        : 'Datums'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Geavanceerd',
        Calendar                   : 'Kalender',
        'Scheduling mode'          : 'Taaktype',
        'Effort driven'            : 'Op inspanning',
        'Manually scheduled'       : 'Handmatig',
        'Constraint type'          : 'Beperkingstype',
        'Constraint date'          : 'Beperkingsdatum',
        Inactive                   : 'Inactief',
        'Ignore resource calendar' : 'Resourcekalender negeren'
    },

    CalendarEditorDatePicker : {
        addException : 'Voeg uitzondering toe',
        addWeek      : 'Voeg een week toe'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Voeg uitzondering toe',
        removeException : 'Verwijder de uitzondering',
        noRows          : 'Geen uitzonderingen toegevoegd'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Voeg een week toe',
        removeWeek : 'Verwijder de week'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Dagen werken standaard',
        workingTimeCalendar        : 'Werktijdkalender',
        exceptions                 : 'Uitzonderingen',
        general                    : 'Algemeen',
        name                       : 'Naam',
        parent                     : 'Ouder',
        save                       : 'Redden',
        weeks                      : 'Weken',
        error                      : 'Fout',
        inputErrors                : 'Er zijn invoerfouten. Los ze op voordat u uw wijzigingen opslaat.',
        delete                     : 'Verwijderen',
        addCalendar                : 'Voeg een kalender toe',
        confirmation               : 'Bevestiging',
        removeCalendarWithChildren : 'De kalender heeft kinderkalenders. Klik op "Ja" om de agenda met zijn kinderen te verwijderen.',
        removeCalendarAndLinks     : 'De kalender wordt door sommige records gebruikt. Klik op "Ja" om ze te ontkoppelen en de agenda te verwijderen.',
        newException               : 'Nieuwe uitzondering',
        newWeek                    : 'Nieuwe week'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' werkt',
        isNotWorking : ' werkt niet',
        basedOn      : ' gebaseerd op:',
        byDefault    : 'standaard',
        rangeTpl     : (start, end) => `${start} tot ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Werkdag',
        nonWorkingDay : 'Niet-werkdag'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Er zijn overlappende reeksen',
        errorMissingDate   : 'Start- en eindtijd zijn vereist',
        errorStartAfterEnd : 'Starttijd kan niet na de eindtijd zijn'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Naam',
        from                                 : 'Van',
        to                                   : 'Naar',
        is                                   : 'Is',
        nonWorking                           : 'Niet werkend',
        working                              : 'Werk',
        hours                                : 'Uren',
        repeat                               : 'Herhalen',
        repeatEnd                            : 'Herhaal einde',
        errorMissingDate                     : 'Uitzonderingsdatumbereik is vereist',
        errorStartAfterEnd                   : '"Van" datum kan niet zijn na de "Naar" datum ',
        errorStartAndEndRepeatNumberMismatch : 'Uitzondering zou hetzelfde aantal keren moeten starten en beëindigen'
    },

    CalendarEditorWeekPanel : {
        name        : 'Naam',
        from        : 'Van',
        to          : 'Naar',
        days        : 'Dagen',
        copyDay     : 'Kopie dag',
        pasteDay    : 'Plakdag',
        stopCopying : 'Stop met kopiëren'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Bereik toevoegen',
        removeRange : 'Verwijder bereik'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"Van" datum kan niet zijn na de "Naar" datum ',
        errorNoDefaultWeek           : 'Weekconfiguratie is vereist',
        errorMultipleDefaultWeeks    : 'Meer dan één standaardweek is opgegeven',
        errorNoWeekAvailability      : 'Week moet wat werktijd bieden',
        errorInvalidWeekAvailability : 'Week heeft werktijdconfiguratiefouten',
        noRows                       : 'Geen weken toegevoegd'
    },

    AdvancedTab : {
        Advanced                   : 'Geavanceerd',
        Calendar                   : 'Kalender',
        'Scheduling mode'          : 'Taaktype',
        'Effort driven'            : 'Op inspanning',
        'Manually scheduled'       : 'Handmatig',
        'Constraint type'          : 'Beperkingstype',
        'Constraint date'          : 'Beperkingsdatum',
        Constraint                 : 'Beperking',
        Rollup                     : 'Oprollen',
        Inactive                   : 'Inactief',
        'Ignore resource calendar' : 'Resourcekalender negeren',
        'Scheduling direction'     : 'Planningrichting',
        projectBorder              : 'Projectgrens',
        ignore                     : 'Negeren',
        honor                      : 'Eer',
        askUser                    : 'Vraag de gebruiker'
    },

    DependencyTab : {
        Predecessors      : 'Voorafgaande taken',
        Successors        : 'Opvolgende taken',
        ID                : 'ID',
        Name              : 'Naam',
        Type              : 'Type',
        Lag               : 'Vertraging',
        cyclicDependency  : 'Cyclische afhankelijkheid',
        invalidDependency : 'Ongeldige afhankelijkheid',
        readOnlyTask      : 'Een alleen-lezen taak kan niet worden gekoppeld'
    },

    NotesTab : {
        Notes : 'Notities'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalender'
    },

    ResourceEdit : {
        editResource : 'Bron bewerken'
    },

    ResourceEditor : {
        resourceInformation : 'Informatie over bronnen',
        costs               : 'Kosten',
        save                : 'Redden',
        error               : 'Fout',
        inputErrors         : 'Er zijn invoerfouten. Los deze problemen op voordat u uw wijzigingen opslaat.',
        delete              : 'Verwijderen',
        confirmation        : 'Bevestiging',
        removeUsedResource  : 'De resource is aan bepaalde taken toegewezen. Klik op "Ja" om de bron toch te verwijderen.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalender',
        general     : 'Algemeen',
        label       : 'Materiaallabel',
        name        : 'Bronnaam',
        type        : 'Type',
        costAccrual : 'Kostenopbouw',
        labelHint   : 'bijvoorbeeld kg, ton of dozen',
        maxUnits    : 'Maximale eenheden'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Optellen bij',
        prorated : 'Pro rata',
        start    : 'Begin',
        end      : 'Einde'
    },

    CostAccrualField : {
        prorated : 'Pro rata',
        start    : 'Begin',
        end      : 'Einde'
    },

    ResourceType : {
        work     : 'Werk',
        material : 'Materiaal',
        cost     : 'Kosten'
    },

    ResourceTypeColumn : {
        type : 'Type'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Tarieven tabel',
        newGroup     : 'Nieuwe tafel',
        removeGroup  : 'Tafel verwijderen',
        useByDefault : 'Standaard gebruiken voor de resourcetoewijzingen',
        noRates      : 'Geen tarieven'
    },

    ResourceGrid : {
        name          : 'Naam',
        materialLabel : 'Materiaallabel',
        maxUnits      : 'Maximale eenheden',
        cost          : 'Kosten',
        noRows        : 'Geen middelen'
    },

    ResourceRateTableContainer : {
        startDate    : 'Startdatum',
        standardRate : 'Standaard tarief',
        perUseCost   : 'Kosten per gebruik',
        addRate      : 'Tarief toevoegen',
        removeRate   : 'Tarief verwijderen',
        name         : 'Naam',
        noRates      : 'Geen tarieven'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Tarieftabelinformatie'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Hoeveelheid',
        Resources   : 'Middelen',
        Resource    : 'Hulpbron',
        Units       : 'Eenheden',
        cost        : 'Kosten',
        effort      : 'Poging',
        start       : 'Begin',
        finish      : 'Finish',
        preamble    : 'Inleiding',
        postamble   : 'Naspel'
    },

    RateTableColumn : {
        rateTable : 'Tarieven tabel'
    },

    RecurrenceTab : {
        title : 'Herhalen'
    },

    SchedulingModePicker : {
        Normal           : 'Normaal',
        'Fixed Duration' : 'Vaste duur',
        'Fixed Units'    : 'Vaste eenheden',
        'Fixed Effort'   : 'Vast werk'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} van de {available}</span> toegewezen',
        barTipOnDate          : '<b>{resource}</b> op {startDate}<br><span class="{cls}">{allocated} van de {available}</span> toegewezen',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} van de {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} van de {available}</span> toegewezen:<br>{assignments}',
        groupBarTipOnDate     : 'On {startDate}<br><span class="{cls}">{allocated} van de {available}</span> toegewezen:<br>{assignments}',
        plusMore              : '+{value} meer'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Inspanning</div><div class="b-effort-value {cls}">{allocated} van {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Inspanning</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Kosten</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Hoeveelheid</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} op {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Samenvatting voor {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Samenvatting voor {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} meer',
        nameColumnText        : 'Hulpbron / Gebeurtenis'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Annuleer wijziging en doe niks',
        schedulingConflict : 'Planningsconflict',
        emptyCalendar      : 'Kalender configuratie fout',
        cycle              : 'Planning lus',
        Apply              : 'Pas toe'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Selecteer een afhankelijkheid om beneden aan te passen:',
        invalidDependencyLabel : 'Er zijn een aantal niet valide afhankelijkheden die moeten worden opgelost:'
    },

    SchedulerProBase : {
        propagating     : 'Beregning',
        storePopulation : 'Indlæser data',
        finalizing      : 'Finaliseren'
    },

    EventSegments : {
        splitEvent    : 'Item splitsen',
        renameSegment : 'Hernoemen'
    },

    NestedEvents : {
        createGroup         : 'Groepeer geselecteerde evenementen',
        newGroupName        : 'Nieuwe groep',
        deNestingNotAllowed : 'Ontnest niet toegestaan',
        nestingNotAllowed   : 'Nesten niet toegestaan'
    },

    VersionGrid : {
        compare       : 'Vergelijken',
        description   : 'Beschrijving',
        occurredAt    : 'Plaatsvond op',
        rename        : 'Hernoemen',
        restore       : 'Herstellen',
        stopComparing : 'Vergelijken stoppen'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'taak',
            AssignmentModel : 'toewijzing',
            DependencyModel : 'afhankelijkheid',
            ProjectModel    : 'project',
            ResourceModel   : 'resource',
            other           : 'object'
        },
        entityNamesPlural : {
            TaskModel       : 'taken',
            AssignmentModel : 'toewijzingen',
            DependencyModel : 'afhankelijkheden',
            ProjectModel    : 'projecten',
            ResourceModel   : 'resources',
            other           : 'objecten'
        },
        transactionDescriptions : {
            update : 'Gewijzigd {n} {entities}',
            add    : 'Toegevoegd {n} {entities}',
            remove : 'Verwijderd {n} {entities}',
            move   : '{n} {entities} verplaatst',
            mixed  : 'Wijzigingen {n} {entities}'
        },
        propertyNames : {
            active                   : 'Actief',
            allDay                   : 'Hele dag',
            allowOverlap             : 'Overlap toestaan',
            barMargin                : 'Balkmarge',
            bidirectional            : 'Bidirectioneel',
            calendar                 : 'Kalender',
            cls                      : 'CSS-klasse',
            constraintDate           : 'Beperkingsdatum',
            constraintType           : 'Beperkingstype',
            daysPerMonth             : 'Dagen per maand',
            daysPerWeek              : 'Dagen per week',
            delayFromParent          : 'Vertraging van ouder',
            direction                : 'Richting',
            drawDependencies         : 'Afhankelijkheden tekenen',
            duration                 : 'Duur',
            durationUnit             : 'Duur eenheid',
            effort                   : 'Inspanning',
            effortDriven             : 'Inspanningsgestuurd',
            effortUnit               : 'Inspanningseenheid',
            endDate                  : 'Einddatum',
            eventColor               : 'Kleur',
            eventId                  : 'Evenement-ID',
            eventLayout              : 'Evenementindeling',
            eventStyle               : 'Balkstijl',
            exceptionDates           : 'Uitzonderingsdatums',
            fixed                    : 'Vast',
            from                     : 'Van',
            fromSide                 : 'Van zijde',
            hoursPerDay              : 'Uren per dag',
            href                     : 'Link',
            iconCls                  : 'Icoon',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Negeer resourcekalender',
            ignoreTimeZone           : 'Negeer tijdzone',
            image                    : 'Afbeelding',
            imageUrl                 : 'Afbeeldings-URL',
            inactive                 : 'Inactief',
            intervals                : 'Intervallen',
            lag                      : 'Achterstand',
            lagUnit                  : 'Achterstandseenheid',
            lineStyle                : 'Lijnstijl',
            manuallyScheduled        : 'Handmatig gepland',
            milestoneWidth           : 'Mijlpaalbreedte',
            name                     : 'Naam',
            note                     : 'Notitie',
            parentId                 : 'Ouder-ID',
            parentIndex              : 'Positie',
            percentDone              : '% voltooid',
            postamble                : 'Postamble',
            preamble                 : 'Preambule',
            readOnly                 : 'Alleen lezen',
            recurrenceRule           : 'Herhalingsregel',
            resourceId               : 'Bron-ID',
            resourceMargin           : 'Hulpbronmarge',
            rowHeight                : 'Rijhoogte',
            schedulingMode           : 'Planningsmodus',
            segments                 : 'Segmenten',
            showAvatar               : 'Avatar weergeven',
            showInTimeline           : 'Weergeven in tijdlijn',
            startDate                : 'Startdatum',
            stickyContents           : 'Plakkerige inhoud',
            strokeColor              : 'Lijnkleur',
            style                    : 'Stijl',
            target                   : 'Linkdoel',
            to                       : 'Naar',
            toSide                   : 'Naar zijde',
            type                     : 'Type',
            units                    : 'Eenheden',
            unscheduled              : 'Niet gepland',
            unspecifiedTimeIsWorking : 'Niet-gespecificeerde tijd is werkend',
            version                  : 'Versie'
        },
        intervals : {
            working    : 'Werkend',
            nonWorking : 'Niet-werkend',
            fromTo     : 'Van {from} tot {to}',
            recurring  : 'Terugkerend beginnend {start} eindigend {end}'
        },
        addEntity         : 'Toegevoegd {type} **{name}**',
        removeEntity      : 'Verwijderd {type} **{name}**',
        updateEntity      : 'Gewijzigd {type} **{name}**',
        moveEntity        : '{type} **{name}** verplaatst van {from} naar {to}',
        addDependency     : 'Afhankelijkheid van **{from}** naar **{to}** toegevoegd',
        removeDependency  : 'Afhankelijkheid **{from}** met **{to}** verwijderd',
        updateDependency  : 'Gewijzigde afhankelijkheid van **{from}** naar **{to}**',
        addAssignment     : 'Resource **{resource}** toegewezen aan **{event}**',
        removeAssignment  : 'Resource **{resource}** verwijderd van **{event}**',
        updateAssignment  : 'Gewijzigde toewijzing van **{resource}** aan **{event}**',
        noChanges         : 'Geen wijzigingen',
        nullValue         : 'niets',
        versionDateFormat : 'D/M/YYYY HH:mm',
        savedAt           : 'Opgeslagen op {date}',
        autoSavedAt       : 'Automatisch opgeslagen op {date}',
        undid             : 'Ongedaan gemaakt',
        redid             : 'Opnieuw gedaan',
        editedTask        : 'Taak eigenschappen aangepast',
        deletedTask       : 'Taak is verwijderd',
        movedTask         : 'Taak verplaatst',
        movedTasks        : 'Taken verplaatst'
    }
};

export default LocaleHelper.publishLocale(locale);
