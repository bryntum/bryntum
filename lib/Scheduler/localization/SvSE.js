import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/SvSE.js';
import '../../Grid/localization/SvSE.js';

const locale = {

    localeName : 'SvSE',
    localeDesc : 'Svenska',
    localeCode : 'sv-SE',
    localeRtl  : false,

    Object : {
        newEvent    : 'Ny uppgift',
        information : 'Information',
        showDetails : 'Visa detaljer'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' uppgift' + (data !== 1 ? 'er' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Växla resurslayoutkolumn. SPACE för snabbmeny.'
    },

    Dependencies : {
        from    : 'Från',
        to      : 'Till',
        valid   : 'Giltig',
        invalid : 'Ogiltig'
    },

    DependencyType : {
        SS           : 'SS',
        SF           : 'SA',
        FS           : 'AS',
        FF           : 'AA',
        StartToStart : 'Start-Till-Start',
        StartToEnd   : 'Start-Till-Avslut',
        EndToStart   : 'Avslut-Till-Start',
        EndToEnd     : 'Avslut-Till-Avslut',
        short        : [
            'SS',
            'SA',
            'AS',
            'AA'
        ],
        long : [
            'Start-Till-Start',
            'Start-Till-Avslut',
            'Avslut-Till-Start',
            'Avslut-Till-Avslut'
        ]
    },

    DependencyEdit : {
        From              : 'Från',
        To                : 'Till',
        Type              : 'Typ',
        Lag               : 'Fördröjning',
        color             : 'Färg',
        lineStyle         : 'Linjestil',
        solid             : 'Solid',
        dashed            : 'Streckad',
        dotted            : 'Prickad',
        dashDot           : 'Streck-prick',
        longDash          : 'Lång streck',
        'Edit dependency' : 'Ändra beroende',
        Save              : 'Spara',
        Delete            : 'Ta bort',
        Cancel            : 'Avbryt',
        StartToStart      : 'Start till Start',
        StartToEnd        : 'Start till Slut',
        EndToStart        : 'Slut till Start',
        EndToEnd          : 'Slut till Slut',
        Active            : 'Aktiv'
    },

    EventEdit : {
        Name           : 'Namn',
        Resource       : 'Resurs',
        Start          : 'Start',
        startTime      : 'Starttid',
        End            : 'Slut',
        endTime        : 'Sluttid',
        Save           : 'Spara',
        Delete         : 'Ta bort',
        Cancel         : 'Avbryt',
        'Edit event'   : 'Redigera uppgift',
        Repeat         : 'Upprepa',
        editRecurrence : 'Redigera återkommande'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Överlappar befintlig uppgift för den här resursen',
        noDropOutsideTimeline   : 'Uppgiften kan inte släppas utanför tidsaxeln',
        duplicateAssignmentDrag : 'Händelse kan inte tilldelas samma resurs flera gånger'
    },

    SchedulerBase : {
        'Add event'      : 'Lägg till uppgift',
        'Delete event'   : 'Ta bort uppgift',
        'Unassign event' : 'Ta bort resurskoppling',
        color            : 'Färg',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, börjar kl ${startDate} ${eventRecord.duration > 0 ? `i ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Välj zoomnivå',
        activeDateRange : 'Aktivt datumintervall',
        startText       : 'Start datum',
        endText         : 'Slut datum',
        todayText       : 'I dag'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Tidsaxel visar ${startDate} till ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Kopiera uppgift',
        cutEvent   : 'Klipp ut uppgift',
        pasteEvent : 'Klistra in uppgift'
    },

    EventFilter : {
        filterEvents : 'Filtrera uppgifter',
        byName       : 'Med namn'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Visa aktuell tidslinje'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Sekunder'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd, DD/MM, h:mm',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD/MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Dag'
        },
        day : {
            name : 'Dag'
        },
        week : {
            name : 'Vecka/timmar'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Vecka/dagar'
        },
        dayAndMonth : {
            name : 'Månad'
        },
        weekAndDay : {
            displayDateFormat : 'HH:mm',
            name              : 'Vecka'
        },
        weekAndMonth : {
            name : 'Veckor'
        },
        weekAndDayLetter : {
            name : 'Veckor/veckodagar'
        },
        weekDateAndMonth : {
            name : 'Månader/veckor'
        },
        monthAndYear : {
            name : 'Månader'
        },
        year : {
            name : 'År'
        },
        manyYears : {
            name : 'Flera år'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Borttagning av uppgift',
        'delete-all-message'        : 'Vill du ta bort alla instanser av denna uppgift?',
        'delete-further-message'    : 'Vill du ta bort denna och alla framtida instanser av denna uppgift, eller bara denna?',
        'delete-only-this-message'  : 'Vill du ta bort denna förekomst av denna händelse?',
        'delete-further-btn-text'   : 'Ta bort alla framtida',
        'delete-only-this-btn-text' : 'Ta bort endast denna',
        'update-title'              : 'Redigering av upprepad uppgift',
        'update-all-message'        : 'Vill du ändra alla instanser av denna uppgift?',
        'update-further-message'    : 'Vill du ändra på endast denna instans, eller denna och alla framtida?',
        'update-only-this-message'  : 'Vill du ändra denna förekomst av denna händelse?',
        'update-further-btn-text'   : 'Alla framtida',
        'update-only-this-btn-text' : 'Endast denna',
        Yes                         : 'Ja',
        Cancel                      : 'Avbryt',
        width                       : 500
    },

    RecurrenceLegend : {
        ' and '                         : ' och ',
        Daily                           : 'Daglig',
        'Weekly on {1}'                 : ({ days }) => `Veckovis på ${days}`,
        'Monthly on {1}'                : ({ days }) => `Månatligen den ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Årligen ${days} ${months}`,
        'Every {0} days'                : ({ interval }) => `Var ${interval} dag`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Var ${interval} vecka på ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Var ${interval} månad ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Var ${interval} år på ${days} av ${months}`,
        position1                       : 'den första',
        position2                       : 'den andra',
        position3                       : 'den tredje',
        position4                       : 'den fjärde',
        position5                       : 'den femte',
        'position-1'                    : 'den sista',
        day                             : 'dagen',
        weekday                         : 'veckodagen',
        'weekend day'                   : 'dagen i veckoslut',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Upprepa uppgift',
        Cancel              : 'Avbryt',
        Save                : 'Spara',
        Frequency           : 'Frekvens',
        Every               : 'Var',
        DAILYintervalUnit   : 'dag',
        WEEKLYintervalUnit  : 'vecka',
        MONTHLYintervalUnit : 'månad',
        YEARLYintervalUnit  : 'år',
        Each                : 'Varje',
        on                  : 'den',
        the                 : 'den',
        'On the'            : 'På den',
        'End repeat'        : 'Avsluta upprepning',
        'time(s)'           : 'upprepningar',
        Days                : 'Dagar',
        Months              : 'Månader'
    },

    RecurrenceDaysCombo : {
        day           : 'dagen',
        weekday       : 'veckodagen',
        'weekend day' : 'dagen i veckoslutet'
    },

    RecurrencePositionsCombo : {
        position1    : 'första',
        position2    : 'andra',
        position3    : 'tredje',
        position4    : 'fjärde',
        position5    : 'femte',
        'position-1' : 'sista'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Aldrig',
        After     : 'Efter',
        'On date' : 'På datum'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Ingen upprepning',
        Daily   : 'Daglig',
        Weekly  : 'Veckovis',
        Monthly : 'Månatlig',
        Yearly  : 'Årlig'
    },

    RecurrenceCombo : {
        None   : 'Ingen',
        Custom : 'Anpassad...'
    },

    Summary : {
        'Summary for' : date => `Sammanfattning för ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Hela schemat',
        currentview  : 'Aktuell vy',
        daterange    : 'Datumintervall',
        completedata : 'Hela schemat (alla aktiviteter)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Tidsintervall',
        'Export from'    : 'Från',
        'Export to'      : 'Till'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Enkel sida'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Enkel sida (oskalad)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Flera sidor (vertikal)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Ingen resurs tilldelad'
    },

    CrudManagerView : {
        serverResponseLabel : 'Serversvar:'
    },

    DurationColumn : {
        Duration : 'Varaktighet'
    },

    EventClusteringBase : {
        unnamed         : 'Namnlös',
        more            : count => `+ ${count} till`,
        clusteredEvents : count => `${count} klustrade händelser`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} klustrade intervall`
    },

    ConstraintTypePicker : {
        none                : 'Ingen',
        assoonaspossible    : 'Så snart som möjligt',
        aslateaspossible    : 'Så sent som möjligt',
        muststarton         : 'Måste starta',
        mustfinishon        : 'Måste avslutas',
        startnoearlierthan  : 'Starta tidigast',
        startnolaterthan    : 'Starta senast',
        finishnoearlierthan : 'Avsluta tidigast',
        finishnolaterthan   : 'Avsluta senast'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} buffertid före händelsen`;
            }
            if (postamble) {
                description += `.${postamble.toString()} buffertid efter händelsen`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Framåt',
        Backward      : 'Bakåt',
        inheritedFrom : 'Ärvd från',
        enforcedBy    : 'Tvingad av'
    },

    CalendarField : {
        'Default calendar' : 'Standardkalender',
        editCalendar       : 'Redigera kalendern'
    },

    TaskEditorBase : {
        Information   : 'Uppgiftsinformation',
        Save          : 'Spara',
        Cancel        : 'Avbryt',
        Delete        : 'Ta bort',
        calculateMask : 'Beräknar...',
        saveError     : 'Kan inte spara, vänligen korrigera fel först',
        repeatingInfo : 'Visar återkommande uppgift',
        editRepeating : 'Redigera'
    },

    TaskEdit : {
        editEvent              : 'Redigera uppgift',
        ConfirmDeletionTitle   : 'Bekräfta borttagning',
        ConfirmDeletionMessage : 'Är du säker på att du vill ta bort uppgiften?'
    },

    GanttTaskEditor : {
        editorWidth : '46em'
    },

    SchedulerTaskEditor : {
        editorWidth : '37em'
    },

    SchedulerGeneralTab : {
        General      : 'Allmänt',
        Name         : 'Namn',
        Resources    : 'Resurser',
        '% complete' : '% Färdig',
        Duration     : 'Varaktighet',
        Start        : 'Start',
        Finish       : 'Slut',
        Effort       : 'Arbetsinsats',
        Preamble     : 'Inledning',
        Postamble    : 'Avslutning'
    },

    GeneralTab : {
        General      : 'Allmänt',
        Name         : 'Namn',
        '% complete' : '% Färdig',
        Duration     : 'Varaktighet',
        Start        : 'Start',
        Finish       : 'Slut',
        Effort       : 'Arbetsinsats',
        Dates        : 'Datum'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Avancerat',
        Calendar                   : 'Kalender',
        'Scheduling mode'          : 'Aktivitetstyp',
        'Effort driven'            : 'Insatsdriven',
        'Manually scheduled'       : 'Manuellt planerad',
        'Constraint type'          : 'Villkorstyp',
        'Constraint date'          : 'Måldatum',
        Inactive                   : 'Inaktiv',
        'Ignore resource calendar' : 'Ignorera resurskalender'
    },

    CalendarEditorDatePicker : {
        addException : 'Undantag',
        addWeek      : 'Lägg till vecka'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Undantag',
        removeException : 'Ta bort undantag',
        noRows          : 'Inga undantag läggs till'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Lägg till vecka',
        removeWeek : 'Ta bort veckan'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Dagar fungerar som standard',
        workingTimeCalendar        : 'Arbetstidskalender',
        exceptions                 : 'Undantag',
        general                    : 'Allmän',
        name                       : 'namn',
        parent                     : 'Förälder',
        save                       : 'Spara',
        weeks                      : 'Veckor',
        error                      : 'Fel',
        inputErrors                : 'Det finns inmatningsfel. Fixa dem innan du sparar dina ändringar.',
        delete                     : 'Radera',
        addCalendar                : 'Lägg till en kalender',
        confirmation               : 'Bekräftelse',
        removeCalendarWithChildren : 'Kalendern har barnkalendrar. Klicka på "Ja" för att ta bort kalendern med sina barn.',
        removeCalendarAndLinks     : 'Kalendern används av vissa poster. Klicka på "Ja" för att länka dem och ta bort kalendern.',
        newException               : 'Nytt undantag',
        newWeek                    : 'Ny vecka'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' arbetar',
        isNotWorking : ' fungerar inte',
        basedOn      : ' baserat på:',
        byDefault    : 'som standard',
        rangeTpl     : (start, end) => `${start} till ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Arbetsdag',
        nonWorkingDay : 'Icke-arbetsdag'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Det finns överlappande intervall',
        errorMissingDate   : 'Start- och sluttid krävs',
        errorStartAfterEnd : 'Starttid kan inte vara efter sluttiden'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'namn',
        from                                 : 'Från',
        to                                   : 'Till',
        is                                   : 'Är',
        nonWorking                           : 'Icke arbetande',
        working                              : 'Arbetssätt',
        hours                                : 'Timme',
        repeat                               : 'Upprepa',
        repeatEnd                            : 'Upprepning',
        errorMissingDate                     : 'Undantagsdatumintervall krävs',
        errorStartAfterEnd                   : '"Från" Datum kan inte vara efter "till" datum ',
        errorStartAndEndRepeatNumberMismatch : 'Undantag bör starta och avsluta samma antal gånger'
    },

    CalendarEditorWeekPanel : {
        name        : 'namn',
        from        : 'Från',
        to          : 'Till',
        days        : 'Dagar',
        copyDay     : 'Kopieringsdag',
        pasteDay    : 'Klistra dag',
        stopCopying : 'Sluta kopiera'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Lägg till sortiment',
        removeRange : 'Ta bort räckvidd'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"Från" Datum kan inte vara efter "till" datum ',
        errorNoDefaultWeek           : 'Veckokonfiguration krävs',
        errorMultipleDefaultWeeks    : 'Mer än en standardvecka anges',
        errorNoWeekAvailability      : 'Veckan måste ge lite arbetstid',
        errorInvalidWeekAvailability : 'Veckans har arbetstidskonfigurationsfel',
        noRows                       : 'Inga veckor tillagda'
    },

    AdvancedTab : {
        Advanced                   : 'Avancerat',
        Calendar                   : 'Kalender',
        'Scheduling mode'          : 'Aktivitetstyp',
        'Effort driven'            : 'Insatsdriven',
        'Manually scheduled'       : 'Manuellt planerad',
        'Constraint type'          : 'Villkorstyp',
        'Constraint date'          : 'Måldatum',
        Constraint                 : 'Villkor',
        Rollup                     : 'Upplyft',
        Inactive                   : 'Inaktiv',
        'Ignore resource calendar' : 'Ignorera resurskalender',
        'Scheduling direction'     : 'Planeringsriktning',
        projectBorder              : 'Projektgräns',
        ignore                     : 'Ignorera',
        honor                      : 'Ära',
        askUser                    : 'Fråga användare'
    },

    DependencyTab : {
        Predecessors      : 'Föregångare',
        Successors        : 'Efterföljare',
        ID                : 'ID',
        Name              : 'Namn',
        Type              : 'Typ',
        Lag               : 'Fördröjning',
        cyclicDependency  : 'Cykliskt beroende',
        invalidDependency : 'Ogiltigt beroende',
        readOnlyTask      : 'En skrivskyddad uppgift kan inte länkas'
    },

    NotesTab : {
        Notes : 'Anteckning'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalender'
    },

    ResourceEdit : {
        editResource : 'Redigera resurs'
    },

    ResourceEditor : {
        resourceInformation : 'Resursinformation',
        costs               : 'Kostnader',
        save                : 'Spara',
        error               : 'Fel',
        inputErrors         : 'Det finns inmatningsfel. Vänligen åtgärda dem innan du sparar dina ändringar.',
        delete              : 'Radera',
        confirmation        : 'Bekräftelse',
        removeUsedResource  : 'Resursen är tilldelad vissa uppgifter. Klicka på "Ja" för att ta bort resursen ändå.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalender',
        general     : 'Allmän',
        label       : 'Materialetikett',
        name        : 'Resursnamn',
        type        : 'Typ',
        costAccrual : 'Kostnadstillverkning',
        labelHint   : 'till exempel kg, ton eller lådor',
        maxUnits    : 'Maximala enheter'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Tillfalla kl',
        prorated : 'Proportionellt',
        start    : 'Start',
        end      : 'Avsluta'
    },

    CostAccrualField : {
        prorated : 'Proportionellt',
        start    : 'Start',
        end      : 'Avsluta'
    },

    ResourceType : {
        work     : 'Arbete',
        material : 'Material',
        cost     : 'Kosta'
    },

    ResourceTypeColumn : {
        type : 'Typ'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Pristabell',
        newGroup     : 'Nytt bord',
        removeGroup  : 'Ta bort bordet',
        useByDefault : 'Använd som standard för resurstilldelningarna',
        noRates      : 'Inga priser'
    },

    ResourceGrid : {
        name          : 'Namn',
        materialLabel : 'Materialetikett',
        maxUnits      : 'Max enheter',
        cost          : 'Kosta',
        noRows        : 'Inga resurser'
    },

    ResourceRateTableContainer : {
        startDate    : 'Startdatum',
        standardRate : 'Standardpris',
        perUseCost   : 'Kostnad per användning',
        addRate      : 'Lägg till kurs',
        removeRate   : 'Ta bort kursen',
        name         : 'Namn',
        noRates      : 'Inga priser'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Information om pristabell'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Kvantitet',
        Resources   : 'Resurser',
        Resource    : 'Resurs',
        Units       : 'Enheter',
        cost        : 'Kosta',
        effort      : 'Ansträngning',
        start       : 'Start',
        finish      : 'Avsluta',
        preamble    : 'Förord',
        postamble   : 'Efterord'
    },

    RateTableColumn : {
        rateTable : 'Pristabell'
    },

    RecurrenceTab : {
        title : 'Upprepa'
    },

    SchedulingModePicker : {
        Normal           : 'Normal',
        'Fixed Duration' : 'Fast varaktighet',
        'Fixed Units'    : 'Fasta enheter',
        'Fixed Effort'   : 'Fast arbete'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} av {available}</span> allokerade',
        barTipOnDate          : '<b>{resource}</b> på {startDate}<br><span class="{cls}">{allocated} av {available}</span> allokerade',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} av {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} av {available}</span> allokerade:<br>{assignments}',
        groupBarTipOnDate     : 'On {startDate}<br><span class="{cls}">{allocated} av {available}</span> allokerade:<br>{assignments}',
        plusMore              : '+{value} fler'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Ansträngning</div><div class="b-effort-value {cls}">{allocated} av {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Ansträngning</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Kostnad</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Kvantitet</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} den {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Sammanfattning för {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Sammanfattning för {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} fler',
        nameColumnText        : 'Resurs / Händelse'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Avbryt ändringen',
        schedulingConflict : 'Schemaläggningskonflikt',
        emptyCalendar      : 'Felaktig kalendarkonfiguration',
        cycle              : 'Cyklisk sekvens',
        Apply              : 'Utför'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Välj ett beroende att ändra enligt nedanstående:',
        invalidDependencyLabel : 'Det finns ogiltiga beroenden som måste korrigeras:'
    },

    SchedulerProBase : {
        propagating     : 'Beräknar',
        storePopulation : 'Laddar data',
        finalizing      : 'Slutför'
    },

    EventSegments : {
        splitEvent    : 'Dela uppgift',
        renameSegment : 'Byt namn'
    },

    NestedEvents : {
        createGroup         : 'Gruppera markerade händelser',
        newGroupName        : 'Ny grupp',
        deNestingNotAllowed : 'Av-nästling ej tillåten',
        nestingNotAllowed   : 'Nästling ej tillåten'
    },

    VersionGrid : {
        compare       : 'Jämför',
        description   : 'Beskrivning',
        occurredAt    : 'Inträffade vid',
        rename        : 'Döp om',
        restore       : 'Återställa',
        stopComparing : 'Sluta jämföra'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'aktivitet',
            AssignmentModel : 'tilldelning',
            DependencyModel : 'beroende',
            ProjectModel    : 'projekt',
            ResourceModel   : 'resurs',
            other           : 'objekt'
        },
        entityNamesPlural : {
            TaskModel       : 'aktiviteter',
            AssignmentModel : 'tilldelningar',
            DependencyModel : 'beroenden',
            ProjectModel    : 'projekt',
            ResourceModel   : 'resurser',
            other           : 'objekt'
        },
        transactionDescriptions : {
            update : 'Ändrade {n} {entities}',
            add    : 'La till {n} {entities}',
            remove : 'Tog bort {n} {entities}',
            move   : 'Flyttade {n} {entities}',
            mixed  : 'Uppdaterade {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktiv',
            allDay                   : 'Hela dagen',
            allowOverlap             : 'Tillåt överlappning',
            barMargin                : 'Stapelmarginal',
            bidirectional            : 'Tvåvägs',
            calendar                 : 'Kalender',
            cls                      : 'CSS-klass',
            constraintDate           : 'Begränsningsdatum',
            constraintType           : 'Begränsningstyp',
            daysPerMonth             : 'Dagar per månad',
            daysPerWeek              : 'Dagar per vecka',
            delayFromParent          : 'Fördröjning från förälder',
            direction                : 'Riktning',
            drawDependencies         : 'Rita beroenden',
            duration                 : 'Varaktighet',
            durationUnit             : 'Varaktighetsenhet',
            effort                   : 'Ansträngning',
            effortDriven             : 'Ansträngningsdriven',
            effortUnit               : 'Ansträngningsenhet',
            endDate                  : 'Slutdatum',
            eventColor               : 'Färg',
            eventId                  : 'Händelse-ID',
            eventLayout              : 'Händelselayout',
            eventStyle               : 'Stapellayout',
            exceptionDates           : 'Undantagsdatum',
            fixed                    : 'Fast',
            from                     : 'Från',
            fromSide                 : 'Från sida',
            hoursPerDay              : 'Timmar per dag',
            href                     : 'Länk',
            iconCls                  : 'Ikon',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignorera resurskalender',
            ignoreTimeZone           : 'Ignorera tidszon',
            image                    : 'Bild',
            imageUrl                 : 'Bild-URL',
            inactive                 : 'Inaktiv',
            intervals                : 'Intervall',
            lag                      : 'Fördröjning',
            lagUnit                  : 'Fördröjningsenhet',
            lineStyle                : 'Linjestil',
            manuallyScheduled        : 'Manuellt schemalagd',
            milestoneWidth           : 'Milstolpebredd',
            name                     : 'Namn',
            note                     : 'Anteckning',
            parentId                 : 'Föräldra-ID',
            parentIndex              : 'Position',
            percentDone              : '% klart',
            postamble                : 'Postamble',
            preamble                 : 'Preamble',
            readOnly                 : 'Skrivskyddad',
            recurrenceRule           : 'Återkommande regel',
            resourceId               : 'Resurs-ID',
            resourceMargin           : 'Resursmarginal',
            rowHeight                : 'Radens höjd',
            schedulingMode           : 'Schemaläggningsläge',
            segments                 : 'Segment',
            showAvatar               : 'Visa avatar',
            showInTimeline           : 'Visa i tidslinje',
            startDate                : 'Startdatum',
            stickyContents           : 'Klistrigt innehåll',
            strokeColor              : 'Linjefärg',
            style                    : 'Stil',
            target                   : 'Länkmål',
            to                       : 'Till',
            toSide                   : 'Till sida',
            type                     : 'Typ',
            units                    : 'Enheter',
            unscheduled              : 'Oschemalagd',
            unspecifiedTimeIsWorking : 'Ospecificerad tid är arbetstid',
            version                  : 'Version'
        },
        intervals : {
            working    : 'Arbetar',
            nonWorking : 'Icke-arbetar',
            fromTo     : 'Från {from} till {to}',
            recurring  : 'Återkommande börjar {start} slutar {end}'
        },
        addEntity         : 'La till {type} **{name}**',
        removeEntity      : 'Tog bort {type} **{name}**',
        updateEntity      : 'Ändrade {type} **{name}**',
        moveEntity        : 'Flyttade {type} **{name}** från {from} till {to}',
        addDependency     : 'La till beroende från **{from}** till **{to}**',
        removeDependency  : 'Tog bort beroende från **{from}** till **{to}**',
        updateDependency  : 'Ändrade beroende från **{from}** till **{to}**',
        addAssignment     : 'Tilldelade **{resource}** till **{event}**',
        removeAssignment  : 'Tog bort tilldelning av **{resource}** från **{event}**',
        updateAssignment  : 'Ändrade tilldelning av **{resource}** till **{event}**',
        noChanges         : 'Inga ändringar',
        nullValue         : 'ingen',
        versionDateFormat : 'YYYY-MM-DD HH:mm',
        savedAt           : 'Sparad kl {date}',
        autoSavedAt       : 'Automatiskt sparad kl {date}',
        undid             : 'Ångrade ändringar',
        redid             : 'Gjorde om ändringar',
        editedTask        : 'Redigerade en aktivitet',
        deletedTask       : 'Tog bort en aktivitet',
        movedTask         : 'Flyttade en aktivitet',
        movedTasks        : 'Flyttade aktiviteter'
    }
};

export default LocaleHelper.publishLocale(locale);
