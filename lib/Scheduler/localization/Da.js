import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Da.js';
import '../../Grid/localization/Da.js';

const locale = {

    localeName : 'Da',
    localeDesc : 'Dansk',
    localeCode : 'da',
    localeRtl  : false,

    Object : {
        newEvent    : 'ny begivenhed',
        information : 'Information',
        showDetails : 'Vis detaljer'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' begivenhed' + (data !== 1 ? 'er' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Skift ressource layout kolonne. SPACE for kontekstmenu.'
    },

    Dependencies : {
        from    : 'Fra',
        to      : 'Til',
        valid   : 'Gyldig',
        invalid : 'Ugyldig'
    },

    DependencyType : {
        SS           : 'SS',
        SF           : 'SA',
        FS           : 'AS',
        FF           : 'AA',
        StartToStart : 'Start-til-Start',
        StartToEnd   : 'Start-til-Afslutning',
        EndToStart   : 'Afslutning-til-Start',
        EndToEnd     : 'Afslutning-til-Afslutning',
        short        : [
            'SS',
            'SA',
            'AS',
            'AA'
        ],
        long : [
            'Start-til-Start',
            'Start-til-Afslutning',
            'Afslutning-til-Start',
            'Afslutning-til-Afslutning'
        ]
    },

    DependencyEdit : {
        From              : 'Fra',
        To                : 'Til',
        Type              : 'Type',
        Lag               : 'Forsinkelse',
        color             : 'Farve',
        lineStyle         : 'Linjestil',
        solid             : 'Solid',
        dashed            : 'Stiplet',
        dotted            : 'Prikket',
        dashDot           : 'Streg-prik',
        longDash          : 'Lang streg',
        'Edit dependency' : 'Redigér afhængighed',
        Save              : 'Gem',
        Delete            : 'Slet',
        Cancel            : 'Annullér',
        StartToStart      : 'Start-Start',
        StartToEnd        : 'Start-Afslutning',
        EndToStart        : 'Afslutning-Start',
        EndToEnd          : 'Afslutning-Afslutning',
        Active            : 'Aktiv'
    },

    EventEdit : {
        Name           : 'Navn',
        Resource       : 'Ressource',
        Start          : 'Start',
        startTime      : 'Starttidspunkt',
        End            : 'Afslutning',
        endTime        : 'Sluttidspunkt',
        Save           : 'Gem',
        Delete         : 'Slet',
        Cancel         : 'Annullér',
        'Edit event'   : 'Redigér begivenhed',
        Repeat         : 'Gentag',
        editRecurrence : 'Rediger gentagelse'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Begivenhed overlapper med eksisterende begivenhed for denne ressource',
        noDropOutsideTimeline   : 'Begivenhed må ikke slippes helt uden for tidslinjen',
        duplicateAssignmentDrag : 'Hændelse kan ikke tildeles samme ressource flere gange'
    },

    SchedulerBase : {
        'Add event'      : 'Tilføj begivenhed',
        'Delete event'   : 'Slet begivenhed',
        'Unassign event' : 'Fjern tilknytning til begivenhed',
        color            : 'Farve',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, starter kl. ${startDate} ${eventRecord.duration > 0 ? `i ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zoom',
        activeDateRange : 'Datointerval',
        startText       : 'Startdato',
        endText         : 'Slutdato',
        todayText       : 'Idag'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Tidsakse viser ${startDate} til ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Kopiér begivenhed',
        cutEvent   : 'Klip begivenhed',
        pasteEvent : 'Indsæt begivenhed'
    },

    EventFilter : {
        filterEvents : 'Filtrér opgaver',
        byName       : 'Efter navn'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Vis aktuel tidslinje'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Sekunder'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD.MM, HH:mm',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD.MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Dag'
        },
        day : {
            name : 'Dag/timer'
        },
        week : {
            name : 'Uge/timer'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Uge/dage'
        },
        dayAndMonth : {
            name : 'Måned'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Uge'
        },
        weekAndMonth : {
            name : 'Uger'
        },
        weekAndDayLetter : {
            name : 'Uger/hverdage'
        },
        weekDateAndMonth : {
            name : 'Måneder/uger'
        },
        monthAndYear : {
            name : 'Måneder'
        },
        year : {
            name : 'Flere år'
        },
        manyYears : {
            name : 'Flere år'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Du er ved at slette en begivenhed',
        'delete-all-message'        : 'Vil du slette alle forekomster af denne begivenhed?',
        'delete-further-message'    : 'Vil du slette denne og alle fremtidige forekomster af denne begivenhed, eller kun den valgte forekomst?',
        'delete-only-this-message'  : 'Vil du slette denne forekomst af denne begivenhed?',
        'delete-further-btn-text'   : 'Slet alle fremtidige begivenheder',
        'delete-only-this-btn-text' : 'Slet kun denne begivenhed',
        'update-title'              : 'Du er ved at ændre en gentagende begivenhed',
        'update-all-message'        : 'Vil du ændre alle forekomster af denne begivenhed?',
        'update-further-message'    : 'Vil du ændre netop denne forekomst af begivenheden, eller denne og alle fremtidige forekomster?',
        'update-only-this-message'  : 'Vil du ændre denne forekomst af denne begivenhed?',
        'update-further-btn-text'   : 'Alle fremtidige begivenheder',
        'update-only-this-btn-text' : 'Kun denne begivenhed',
        Yes                         : 'Ja',
        Cancel                      : 'Annullér',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' og ',
        Daily                           : 'Daglig',
        'Weekly on {1}'                 : ({ days }) => `Ugentligt ${days}`,
        'Monthly on {1}'                : ({ days }) => `Månedligt ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Årligt ${days} af ${months}`,
        'Every {0} days'                : ({ interval }) => `For hver ${interval} dage`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `For hver ${interval} uger ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `For hver ${interval} måneder ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `For hver ${interval} år ${days} i ${months}`,
        position1                       : 'den første',
        position2                       : 'den anden',
        position3                       : 'den tredje',
        position4                       : 'den fjerde',
        position5                       : 'den femte',
        'position-1'                    : 'den sidste',
        day                             : 'dag',
        weekday                         : 'ugedag',
        'weekend day'                   : 'dag i weekenden',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Gentag begivenhed',
        Cancel              : 'Annullér',
        Save                : 'Gem',
        Frequency           : 'Frekvens',
        Every               : 'Alle',
        DAILYintervalUnit   : 'dag(e)',
        WEEKLYintervalUnit  : 'uge(r)',
        MONTHLYintervalUnit : 'Måned(er)',
        YEARLYintervalUnit  : 'År',
        Each                : 'For hver',
        on                  : 'Den',
        the                 : 'Den',
        'On the'            : 'på',
        'End repeat'        : 'Stop gentagelse',
        'time(s)'           : 'tid(er)',
        Days                : 'Dage',
        Months              : 'Måneder'
    },

    RecurrenceDaysCombo : {
        day           : 'dag',
        weekday       : 'ugedag',
        'weekend day' : 'dag i weekenden'
    },

    RecurrencePositionsCombo : {
        position1    : 'første',
        position2    : 'anden',
        position3    : 'tredje',
        position4    : 'fjerde',
        position5    : 'femte',
        'position-1' : 'sidste'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Aldrig',
        After     : 'Efter',
        'On date' : 'På dato'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Ingen gentagelse',
        Daily   : 'Dagligt',
        Weekly  : 'Ugentligt',
        Monthly : 'Månedligt',
        Yearly  : 'Årligt'
    },

    RecurrenceCombo : {
        None   : 'Ingen',
        Custom : 'Tilpasset...'
    },

    Summary : {
        'Summary for' : date => `Resumé for ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Komplet tidsplan',
        currentview  : 'Synlig tidsplan',
        daterange    : 'Datointerval',
        completedata : 'Komplet tidsplan (for alle arrangementer)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Tidsplan rækkevidde',
        'Export from'    : 'Fra',
        'Export to'      : 'Til'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Enkelt side'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Enkelt side (uskaleret)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Flere sider (lodret)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Ingen ressourcer tilknyttet'
    },

    CrudManagerView : {
        serverResponseLabel : 'Svar fra server:'
    },

    DurationColumn : {
        Duration : 'Varighed'
    },

    EventClusteringBase : {
        unnamed         : 'Unavngivet',
        more            : count => `+ ${count} mere`,
        clusteredEvents : count => `${count} klyngede begivenheder`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} klyngede intervaller`
    },

    ConstraintTypePicker : {
        none                : 'Ingen',
        assoonaspossible    : 'Så hurtigt som muligt',
        aslateaspossible    : 'Så sent som muligt',
        muststarton         : 'Skal starte på',
        mustfinishon        : 'Skal slutte på',
        startnoearlierthan  : 'Start ikke tidligere end',
        startnolaterthan    : 'Start ikke senere end',
        finishnoearlierthan : 'Afslut ikke tidligere end',
        finishnolaterthan   : 'Afslut ikke senere end'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} buffer tid før begivenheden`;
            }
            if (postamble) {
                description += `.${postamble.toString()} buffer tid efter begivenheden`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Fremad',
        Backward      : 'Bagud',
        inheritedFrom : 'Arvet fra',
        enforcedBy    : 'Pålagt af'
    },

    CalendarField : {
        'Default calendar' : 'Standardkalender',
        editCalendar       : 'Rediger kalender'
    },

    TaskEditorBase : {
        Information   : 'Opgaveinformation',
        Save          : 'Gem',
        Cancel        : 'Annullér',
        Delete        : 'Slet',
        calculateMask : 'Beregner...',
        saveError     : 'Kan ikke gemme, ret venligst fejl først',
        repeatingInfo : 'Viser en gentagende begivenhed',
        editRepeating : 'Redigere'
    },

    TaskEdit : {
        editEvent              : 'Rediger begivenhed',
        ConfirmDeletionTitle   : 'Bekræft sletning',
        ConfirmDeletionMessage : 'Er du sikker på at du vil slette denne opgave?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '33em'
    },

    SchedulerGeneralTab : {
        General      : 'Generelt',
        Name         : 'Navn',
        Resources    : 'Ressourcer',
        '% complete' : '% færdig',
        Duration     : 'Varighed',
        Start        : 'Start',
        Finish       : 'Afslutning',
        Effort       : 'Indsats',
        Preamble     : 'Præambel',
        Postamble    : 'Postambel'
    },

    GeneralTab : {
        General      : 'Generelt',
        Name         : 'Navn',
        '% complete' : '% færdig',
        Duration     : 'Varighed',
        Start        : 'Start',
        Finish       : 'Afslutning',
        Effort       : 'Indsats',
        Dates        : 'Datoer'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Avanceret',
        Calendar                   : 'Kalender',
        'Scheduling mode'          : 'Planlægningstilstand',
        'Effort driven'            : 'Indsatsdrevet',
        'Manually scheduled'       : 'Manuelt planlagt',
        'Constraint type'          : 'Begrænsningstype',
        'Constraint date'          : 'Begrænsningsdato',
        Inactive                   : 'Inaktiv',
        'Ignore resource calendar' : 'Ignorer ressourcekalender'
    },

    CalendarEditorDatePicker : {
        addException : 'Tilføj undtagelse',
        addWeek      : 'Tilføj uge'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Tilføj undtagelse',
        removeException : 'Fjern undtagelse',
        noRows          : 'Ingen undtagelser tilføjet'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Tilføj uge',
        removeWeek : 'Fjern uge'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Dage fungerer som standard',
        workingTimeCalendar        : 'Arbejdstidskalender',
        exceptions                 : 'Undtagelser',
        general                    : 'Generel',
        name                       : 'Navn',
        parent                     : 'Forælder',
        save                       : 'Gemme',
        weeks                      : 'Uger',
        error                      : 'Fejl',
        inputErrors                : 'Der er inputfejl. Fix dem, inden du gemmer dine ændringer.',
        delete                     : 'Slet',
        addCalendar                : 'Tilføj en kalender',
        confirmation               : 'Bekræftelse',
        removeCalendarWithChildren : 'Kalenderen har børnekalendere. Klik på "Ja" for at fjerne kalenderen med sine børn.',
        removeCalendarAndLinks     : 'Kalenderen bruges af nogle poster. Klik på "Ja" for at fjerne dem og fjerne kalenderen.',
        newException               : 'Ny undtagelse',
        newWeek                    : 'Ny uge'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' virker',
        isNotWorking : ' Det virker ikke',
        basedOn      : ' baseret på:',
        byDefault    : 'som standard',
        rangeTpl     : (start, end) => `${start} til ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Arbejdsdag',
        nonWorkingDay : 'Ikke-arbejdende dag'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Der er overlappende intervaller',
        errorMissingDate   : 'Start og sluttid kræves',
        errorStartAfterEnd : 'Starttid kan ikke være efter sluttidspunktet'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Navn',
        from                                 : 'Fra',
        to                                   : 'Til',
        is                                   : 'Er',
        nonWorking                           : 'Ikke-arbejde',
        working                              : 'Arbejder',
        hours                                : 'Timer',
        repeat                               : 'Gentage',
        repeatEnd                            : 'Gentag ende',
        errorMissingDate                     : 'Undtagelsesdatoområde er påkrævet',
        errorStartAfterEnd                   : '"Fra" Dato kan ikke være efter "til" dato ',
        errorStartAndEndRepeatNumberMismatch : 'Undtagelse skal starte og afslutte det samme antal gange'
    },

    CalendarEditorWeekPanel : {
        name        : 'Navn',
        from        : 'Fra',
        to          : 'Til',
        days        : 'Dage',
        copyDay     : 'Kopier dag',
        pasteDay    : 'Indsæt dag',
        stopCopying : 'Stop med at kopiere'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Tilføj rækkevidde',
        removeRange : 'Fjern rækkevidden'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"Fra" Dato kan ikke være efter "til" dato ',
        errorNoDefaultWeek           : 'Uge -konfiguration er påkrævet',
        errorMultipleDefaultWeeks    : 'Mere end en standarduge er specificeret',
        errorNoWeekAvailability      : 'Uge skal give lidt arbejdstid',
        errorInvalidWeekAvailability : 'Uge har arbejdstidskonfigurationsfejl',
        noRows                       : 'Ingen uger tilføjet'
    },

    AdvancedTab : {
        Advanced                   : 'Avanceret',
        Calendar                   : 'Kalender',
        'Scheduling mode'          : 'Planlægningstilstand',
        'Effort driven'            : 'Indsatsbaseret',
        'Manually scheduled'       : 'Manuelt planlagt',
        'Constraint type'          : 'Begrænsningstype',
        'Constraint date'          : 'Begrænsningsdato',
        Constraint                 : 'Begrænsning',
        Rollup                     : 'Oprulning',
        Inactive                   : 'Inaktiv',
        'Ignore resource calendar' : 'Ignorer ressourcekalender',
        'Scheduling direction'     : 'Planlægningsretning',
        projectBorder              : 'Projektgrænse',
        ignore                     : 'Ignorere',
        honor                      : 'Ære',
        askUser                    : 'Spørg brugeren'
    },

    DependencyTab : {
        Predecessors      : 'Forgængere',
        Successors        : 'Efterfølgere',
        ID                : 'ID',
        Name              : 'Navn',
        Type              : 'Type',
        Lag               : 'Forsinkelse',
        cyclicDependency  : 'Cirkulær afhængighed',
        invalidDependency : 'Ugyldig afhængighed',
        readOnlyTask      : 'En skrivebeskyttet opgave kan ikke sammenkædes'
    },

    NotesTab : {
        Notes : 'Noter'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalender'
    },

    ResourceEdit : {
        editResource : 'Rediger ressource'
    },

    ResourceEditor : {
        resourceInformation : 'Ressourceinformation',
        costs               : 'Omkostninger',
        save                : 'Spare',
        error               : 'Fejl',
        inputErrors         : 'Der er indtastningsfejl. Ret dem, før du gemmer dine ændringer.',
        delete              : 'Slet',
        confirmation        : 'Bekræftelse',
        removeUsedResource  : 'Ressourcen er tildelt nogle opgaver. Klik på "Ja" for at fjerne ressourcen alligevel.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalender',
        general     : 'Generel',
        label       : 'Materialemærke',
        name        : 'Ressourcenavn',
        type        : 'Type',
        costAccrual : 'Omkostningsperiodisering',
        labelHint   : 'fx kg, tons eller kasser',
        maxUnits    : 'Maksimale enheder'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Opsamles kl',
        prorated : 'Forholdsmæssigt',
        start    : 'Starte',
        end      : 'Ende'
    },

    CostAccrualField : {
        prorated : 'Forholdsmæssigt',
        start    : 'Starte',
        end      : 'Ende'
    },

    ResourceType : {
        work     : 'Arbejde',
        material : 'Materiale',
        cost     : 'Koste'
    },

    ResourceTypeColumn : {
        type : 'Type'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Pristabel',
        newGroup     : 'Nyt bord',
        removeGroup  : 'Fjern bordet',
        useByDefault : 'Bruges som standard til ressourcetildelingerne',
        noRates      : 'Ingen takster'
    },

    ResourceGrid : {
        name          : 'Navn',
        materialLabel : 'Materialemærke',
        maxUnits      : 'Max enheder',
        cost          : 'Koste',
        noRows        : 'Ingen ressourcer'
    },

    ResourceRateTableContainer : {
        startDate    : 'Startdato',
        standardRate : 'Standardpris',
        perUseCost   : 'Pris pr. brug',
        addRate      : 'Tilføj sats',
        removeRate   : 'Fjern rate',
        name         : 'Navn',
        noRates      : 'Ingen takster'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Oplysninger om taksttabel'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Mængde',
        Resources   : 'Ressourcer',
        Resource    : 'Ressource',
        Units       : 'Enheder',
        cost        : 'Koste',
        effort      : 'Forsøg',
        start       : 'Starte',
        finish      : 'Slutte',
        preamble    : 'Præambel',
        postamble   : 'Postambel'
    },

    RateTableColumn : {
        rateTable : 'Pristabel'
    },

    RecurrenceTab : {
        title : 'Gentage'
    },

    SchedulingModePicker : {
        Normal           : 'Normal',
        'Fixed Duration' : 'Fast varighed',
        'Fixed Units'    : 'Faste enheder',
        'Fixed Effort'   : 'Fast arbejde'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br>{allocated} af {available} allokeret',
        barTipOnDate          : '<b>{resource}</b> am {startDate}<br>{allocated} af {available} allokeret',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} af {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} af {available}</span> allokeret:<br>{assignments}',
        groupBarTipOnDate     : 'Am {startDate}<br><span class="{cls}">{allocated} af {available}</span> allokeret:<br>{assignments}',
        plusMore              : '+{value} mere'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Indsats</div><div class="b-effort-value {cls}">{allocated} af {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Indsats</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Omkostning</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Mængde</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} den {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Oversigt for {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Oversigt for {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} mere',
        nameColumnText        : 'Ressource / Begivenhed'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Annullér ændringer',
        schedulingConflict : 'Planlægningskonflikt',
        emptyCalendar      : 'Kalenderfejl (tom)',
        cycle              : 'Cirkulær reference',
        Apply              : 'Anvend'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Vælg venligst en afhængighed:',
        invalidDependencyLabel : 'Der er ugyldige afhængigheder involveret som skal håndteres:'
    },

    SchedulerProBase : {
        propagating     : 'Beregner projekt',
        storePopulation : 'Loading data',
        finalizing      : 'Færdiggør resultater'
    },

    EventSegments : {
        splitEvent    : 'Opdelt begivenhed',
        renameSegment : 'Omdøb'
    },

    NestedEvents : {
        createGroup         : 'Gruppér valgte begivenheder',
        newGroupName        : 'Ny gruppe',
        deNestingNotAllowed : 'Udpakning ikke tilladt',
        nestingNotAllowed   : 'Indlejring ikke tilladt'
    },

    VersionGrid : {
        compare       : 'Sammenlign',
        description   : 'Beskrivelse',
        occurredAt    : 'Skete ved',
        rename        : 'Omdøb',
        restore       : 'Gendan',
        stopComparing : 'Stop sammenligning'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'opgave',
            AssignmentModel : 'opgave',
            DependencyModel : 'link',
            ProjectModel    : 'projekt',
            ResourceModel   : 'ressource',
            other           : 'objekt'
        },
        entityNamesPlural : {
            TaskModel       : 'opgave',
            AssignmentModel : 'opgave',
            DependencyModel : 'link',
            ProjectModel    : 'projekt',
            ResourceModel   : 'ressource',
            other           : 'objekt'
        },
        transactionDescriptions : {
            update : 'Ændret {n} {entities}',
            add    : 'Tilføjet {n} {entities}',
            remove : 'Fjernede {n} {entities}',
            move   : 'Flyttet {n} {entities}',
            mixed  : 'Ændret {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktiv',
            allDay                   : 'Hele dagen',
            allowOverlap             : 'Tillad overlapning',
            barMargin                : 'Søjlemargin',
            bidirectional            : 'Tovejs',
            calendar                 : 'Kalender',
            cls                      : 'CSS-klasse',
            constraintDate           : 'Begrænsningsdato',
            constraintType           : 'Begrænsningstype',
            daysPerMonth             : 'Dage pr. måned',
            daysPerWeek              : 'Dage pr. uge',
            delayFromParent          : 'Forsinkelse fra overordnet',
            direction                : 'Retning',
            drawDependencies         : 'Tegn afhængigheder',
            duration                 : 'Varighed',
            durationUnit             : 'Varighedsenhed',
            effort                   : 'Indsats',
            effortDriven             : 'Indsatsdrevet',
            effortUnit               : 'Indsatsenhed',
            endDate                  : 'Slutdato',
            eventColor               : 'Farve',
            eventId                  : 'Begivenheds-ID',
            eventLayout              : 'Begivenhedsopsætning',
            eventStyle               : 'Søjlestil',
            exceptionDates           : 'Undtagelsesdatoer',
            fixed                    : 'Fast',
            from                     : 'Fra',
            fromSide                 : 'Fra side',
            hoursPerDay              : 'Timer pr. dag',
            href                     : 'Link',
            iconCls                  : 'Ikon',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignorer ressourcekalender',
            ignoreTimeZone           : 'Ignorer tidszone',
            image                    : 'Billede',
            imageUrl                 : 'Billede-URL',
            inactive                 : 'Inaktiv',
            intervals                : 'Intervaller',
            lag                      : 'Forsinkelse',
            lagUnit                  : 'Forsinkelsesenhed',
            lineStyle                : 'Linjestil',
            manuallyScheduled        : 'Manuelt planlagt',
            milestoneWidth           : 'Milepælsbredde',
            name                     : 'Navn',
            note                     : 'Notat',
            parentId                 : 'Overordnet ID',
            parentIndex              : 'Position',
            percentDone              : '% færdig',
            postamble                : 'Postamble',
            preamble                 : 'Preamble',
            readOnly                 : 'Skrivebeskyttet',
            recurrenceRule           : 'Gentagelsesregel',
            resourceId               : 'Ressource-ID',
            resourceMargin           : 'Ressourcemargin',
            rowHeight                : 'Rækkehøjde',
            schedulingMode           : 'Planlægningstilstand',
            segments                 : 'Segmenter',
            showAvatar               : 'Vis avatar',
            showInTimeline           : 'Vis i tidslinje',
            startDate                : 'Startdato',
            stickyContents           : 'Klæbende indhold',
            strokeColor              : 'Linjefarve',
            style                    : 'Stil',
            target                   : 'Linkmål',
            to                       : 'Til',
            toSide                   : 'Til side',
            type                     : 'Type',
            units                    : 'Enheder',
            unscheduled              : 'Ikke planlagt',
            unspecifiedTimeIsWorking : 'Ubestemt tid er arbejdstid',
            version                  : 'Version'
        },
        intervals : {
            working    : 'Arbejder',
            nonWorking : 'Ikke-arbejder',
            fromTo     : 'Fra {from} til {to}',
            recurring  : 'Gentager starter {start} slutter {end}'
        },
        addEntity         : 'Tilføjede {type} **{name}**',
        removeEntity      : 'Fjernet {type} **{name}**',
        updateEntity      : 'Ændret {type} **{name}**',
        moveEntity        : 'Flyttede {type} **{name}** fra {from} til {to}',
        addDependency     : 'Tilføjet link fra **{from}** til **{to}**',
        removeDependency  : 'Fjernet link fra **{from}** til **{to}**',
        updateDependency  : 'Redigeret link fra **{from}** til **{to}**',
        addAssignment     : 'Tildelt **{resource}** til **{event}**',
        removeAssignment  : 'Fjernet tildeling af **{resource}** fra **{event}**',
        updateAssignment  : 'Redigeret tildeling af **{resource}** til **{event}**',
        noChanges         : 'Ingen ændringer',
        nullValue         : 'ingen',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Gemt kl. {date}',
        autoSavedAt       : 'Automatisk gemt kl. {date}',
        undid             : 'Undrede ændringer',
        redid             : 'Generede ændringer',
        editedTask        : 'Redigerede opgaveegenskaber',
        deletedTask       : 'Slettede en opgave',
        movedTask         : 'Flyttet en opgave',
        movedTasks        : 'Flyttede opgaver'
    }
};

export default LocaleHelper.publishLocale(locale);
