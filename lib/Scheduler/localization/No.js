import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/No.js';
import '../../Grid/localization/No.js';

const locale = {

    localeName : 'No',
    localeDesc : 'Norsk',
    localeCode : 'no',
    localeRtl  : false,

    Object : {
        newEvent    : 'Ny hendelse',
        information : 'Informasjon',
        showDetails : 'Vis detaljer'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' hendelse' + (data !== 1 ? 'r' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Veksle ressursoppsettkolonne. SPACE for kontekstmeny.'
    },

    Dependencies : {
        from    : 'Fra',
        to      : 'Til',
        valid   : 'Gyldig',
        invalid : 'Ugyldig'
    },

    DependencyType : {
        SS           : 'SS',
        SF           : 'SSl',
        FS           : 'SlS',
        FF           : 'SlSl',
        StartToStart : 'Start-til-start',
        StartToEnd   : 'Start-til-slutt',
        EndToStart   : 'Slutt-til-start',
        EndToEnd     : 'Slutt-til-slutt',
        short        : [
            'SS',
            'SSl',
            'SlS',
            'SlSl'
        ],
        long : [
            'Start-til-start',
            'Start-til-slutt',
            'Slutt-til-start',
            'Slutt-til-slutt'
        ]
    },

    DependencyEdit : {
        From              : 'Fra',
        To                : 'Til',
        Type              : 'Type',
        Lag               : 'Forsinkelse',
        color             : 'Farge',
        lineStyle         : 'Linjestil',
        solid             : 'Heltrukket',
        dashed            : 'Stiplet',
        dotted            : 'Prikket',
        dashDot           : 'Strek-prikk',
        longDash          : 'Lang strek',
        'Edit dependency' : 'Rediger avhengighet',
        Save              : 'Lagre',
        Delete            : 'Slett',
        Cancel            : 'Avbryt',
        StartToStart      : 'Start til start',
        StartToEnd        : 'Start til slutt',
        EndToStart        : 'Slutt til start',
        EndToEnd          : 'Slutt til slutt',
        Active            : 'Aktiv'
    },

    EventEdit : {
        Name           : 'Navn',
        Resource       : 'Ressurs',
        Start          : 'Start',
        startTime      : 'Starttid',
        End            : 'Slutt',
        endTime        : 'Slutttid',
        Save           : 'Lagre',
        Delete         : 'Slett',
        Cancel         : 'Avbryt',
        'Edit event'   : 'Redigere hendelse',
        Repeat         : 'Gjenta',
        editRecurrence : 'Rediger gjentakelse'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Hendelse overlapper eksisterende hendelse for denne ressursen',
        noDropOutsideTimeline   : 'Hendelsen kan ikke droppes helt utenfor tidslinjen',
        duplicateAssignmentDrag : 'Hendelse kan ikke tilordnes samme ressurs flere ganger'
    },

    SchedulerBase : {
        'Add event'      : 'Legg til hendelse',
        'Delete event'   : 'Slett hendelse',
        'Unassign event' : 'Opphev tilordningen av hendelsen',
        color            : 'Farge',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, starter kl ${startDate} ${eventRecord.duration > 0 ? `i ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zoom',
        activeDateRange : 'Datointervall',
        startText       : 'Startdato',
        endText         : 'Sluttdato',
        todayText       : 'I dag'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Tidsakse viser ${startDate} til ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Kopier hendelse',
        cutEvent   : 'Klipp ut hendelse',
        pasteEvent : 'Lim inn hendelse'
    },

    EventFilter : {
        filterEvents : 'Filtrer oppgaver',
        byName       : 'Etter navn'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Vi gjeldende tidslinje'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Sekunder'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD.MM, H',
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
            name : 'Uke/timer'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Uke/dager'
        },
        dayAndMonth : {
            name : 'Måned'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Uke'
        },
        weekAndMonth : {
            name : 'Uker'
        },
        weekAndDayLetter : {
            name : 'Uker/ukedager'
        },
        weekDateAndMonth : {
            name : 'Måneder/uker'
        },
        monthAndYear : {
            name : 'Måneder'
        },
        year : {
            name : 'År'
        },
        manyYears : {
            name : 'Flere år'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Du sletter en hendelse',
        'delete-all-message'        : 'Vil du slette alle forekomster av denne hendelsen?',
        'delete-further-message'    : 'Vil du slette denne og alle fremtidige forekomster av denne hendelsen, eller bare den valgte forekomsten?',
        'delete-only-this-message'  : 'Vil du slette denne forekomsten av denne hendelsen?',
        'delete-further-btn-text'   : 'Slett alle fremtidige hendelser',
        'delete-only-this-btn-text' : 'Slett bare denne hendelsen',
        'update-title'              : 'Du endrer en gjentakende hendelse',
        'update-all-message'        : 'Vil du endre alle forekomster av denne hendelsen?',
        'update-further-message'    : 'Vil du endre bare denne forekomsten av hendelsen, eller denne og alle fremtidige forekomster?',
        'update-only-this-message'  : 'Vil du endre denne forekomsten av denne hendelsen?',
        'update-further-btn-text'   : 'Alle fremtidige hendelser',
        'update-only-this-btn-text' : 'Bare denne hendelsen',
        Yes                         : 'Ja',
        Cancel                      : 'Avbryt',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' og ',
        Daily                           : 'Daglig',
        'Weekly on {1}'                 : ({ days }) => `Ukentlig i ${days}`,
        'Monthly on {1}'                : ({ days }) => `Månedlig i ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Årlig i ${days} av ${months}`,
        'Every {0} days'                : ({ interval }) => `Årlig ${interval} dager`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Hver ${interval} uke(r) i ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Hver ${interval} måned(er) i on ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Hvert ${interval} år i ${days} of ${months}`,
        position1                       : 'den første',
        position2                       : 'den andre',
        position3                       : 'den tredje',
        position4                       : 'den fjerde',
        position5                       : 'den femte',
        'position-1'                    : 'den siste',
        day                             : 'dad',
        weekday                         : 'ukedag',
        'weekend day'                   : 'helgedag',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Gjenta hendelse',
        Cancel              : 'Avbryt',
        Save                : 'Lagre',
        Frequency           : 'Hyppighet',
        Every               : 'Hver',
        DAILYintervalUnit   : 'dag(er)',
        WEEKLYintervalUnit  : 'uke(r)',
        MONTHLYintervalUnit : 'måned (er)',
        YEARLYintervalUnit  : 'år',
        Each                : 'Hver',
        on                  : 'På',
        the                 : 'Den',
        'On the'            : 'Den',
        'End repeat'        : 'Slutt gjentakelse',
        'time(s)'           : 'gang(er)',
        Days                : 'Dager',
        Months              : 'Måneder'
    },

    RecurrenceDaysCombo : {
        day           : 'dag',
        weekday       : 'ukedag',
        'weekend day' : 'helgedag'
    },

    RecurrencePositionsCombo : {
        position1    : 'første',
        position2    : 'andre',
        position3    : 'tredje',
        position4    : 'fjerde',
        position5    : 'femte',
        'position-1' : 'siste'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Aldri',
        After     : 'Etter',
        'On date' : 'På dato'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Ingen gjentakelse',
        Daily   : 'Daglig',
        Weekly  : 'Ukentlig',
        Monthly : 'Måndelig',
        Yearly  : 'Årlig'
    },

    RecurrenceCombo : {
        None   : 'Ingen',
        Custom : 'Tilpasset...'
    },

    Summary : {
        'Summary for' : date => `Oppsummering for ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Fullstendig tidsplan',
        currentview  : 'Synlig tidsplan',
        daterange    : 'Datointervall',
        completedata : 'Fullstendig tidsplan (for alle hendelser)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Tidsplanintervall',
        'Export from'    : 'Fra',
        'Export to'      : 'Til'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Enkeltside'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Enkeltside (uskalert)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Flere sider (vertikal)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Ingen ressurs tildelt'
    },

    CrudManagerView : {
        serverResponseLabel : 'Serversvar:'
    },

    DurationColumn : {
        Duration : 'Varighet'
    },

    EventClusteringBase : {
        unnamed         : 'Uten navn',
        more            : count => `+ ${count} til`,
        clusteredEvents : count => `${count} klyngede hendelser`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} klyngede områder`
    },

    ConstraintTypePicker : {
        none                : 'Ingen',
        assoonaspossible    : 'Så snart som mulig',
        aslateaspossible    : 'Så sent som mulig',
        muststarton         : 'Må starte på',
        mustfinishon        : 'Må slutte på',
        startnoearlierthan  : 'Start ikke tidligere enn',
        startnolaterthan    : 'Start ikke senere enn',
        finishnoearlierthan : 'Slutt ikke tidligere enn',
        finishnolaterthan   : 'Slutt ikke senere enn'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} buffer tid før arrangementet`;
            }
            if (postamble) {
                description += `.${postamble.toString()} buffer tid etter arrangementet`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Fremover',
        Backward      : 'Bakover',
        inheritedFrom : 'Arvet fra',
        enforcedBy    : 'Påtvunget av'
    },

    CalendarField : {
        'Default calendar' : 'Standard kalender',
        editCalendar       : 'Rediger kalender'
    },

    TaskEditorBase : {
        Information   : 'Oppgaveinformasjon',
        Save          : 'Lagre',
        Cancel        : 'Avbryt',
        Delete        : 'Slett',
        calculateMask : 'Kalkulerer...',
        saveError     : 'Kan ikke lagre, vennligst korriger feil først',
        repeatingInfo : 'Viser en gjentatt hendelse',
        editRepeating : 'Redigere'
    },

    TaskEdit : {
        editEvent              : 'Redigere hendelse',
        ConfirmDeletionTitle   : 'Bekrefte sletting',
        ConfirmDeletionMessage : 'Er du sikker på at du vil slette denne hendelsen?'
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
        Resources    : 'Ressurser',
        '% complete' : '% ferdig',
        Duration     : 'Varighet',
        Start        : 'Start',
        Finish       : 'Slutt',
        Effort       : 'Innsats',
        Preamble     : 'Innledning',
        Postamble    : 'Konklusjon'
    },

    GeneralTab : {
        General      : 'Generelt',
        Name         : 'Navn',
        '% complete' : '% ferdig',
        Duration     : 'Varighet',
        Start        : 'Start',
        Finish       : 'Slutt',
        Effort       : 'Innsats',
        Dates        : 'Datoer'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Avansert',
        Calendar                   : 'Kalender',
        'Scheduling mode'          : 'Planleggingsmodus',
        'Effort driven'            : 'Innsatsdrevet',
        'Manually scheduled'       : 'Planlagt manuelt',
        'Constraint type'          : 'Begrensningstype',
        'Constraint date'          : 'Begrensningsdato',
        Inactive                   : 'Ikke aktive',
        'Ignore resource calendar' : 'Ignorer ressurskalender'
    },

    CalendarEditorDatePicker : {
        addException : 'Legg til unntak',
        addWeek      : 'Legg til uke'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Legg til unntak',
        removeException : 'Fjern unntak',
        noRows          : 'Ingen unntak lagt til'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Legg til uke',
        removeWeek : 'Fjern uken'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Dager fungerer som standard',
        workingTimeCalendar        : 'Arbeidstidskalender',
        exceptions                 : 'Unntak',
        general                    : 'Generell',
        name                       : 'Navn',
        parent                     : 'Foreldre',
        save                       : 'Lagre',
        weeks                      : 'Uker',
        error                      : 'Feil',
        inputErrors                : 'Det er inngangsfeil. Vennligst fikser dem før du lagrer endringene.',
        delete                     : 'Slett',
        addCalendar                : 'Legg til en kalender',
        confirmation               : 'Bekreftelse',
        removeCalendarWithChildren : 'Kalenderen har barnekalendere. Klikk "Ja" for å fjerne kalenderen med barna.',
        removeCalendarAndLinks     : 'Kalenderen brukes av noen poster. Klikk "Ja" for å fjerne dem og fjerne kalenderen.',
        newException               : 'Nytt unntak',
        newWeek                    : 'Ny uke'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' Jobber',
        isNotWorking : ' Fungerer ikke',
        basedOn      : ' basert på:',
        byDefault    : 'Som standard',
        rangeTpl     : (start, end) => `${start} til ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Arbeidsdag',
        nonWorkingDay : 'Ikke-arbeidende dag'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Det er overlappende områder',
        errorMissingDate   : 'Start og slutttid er påkrevd',
        errorStartAfterEnd : 'Starttid kan ikke være etter slutttid'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Navn',
        from                                 : 'Fra',
        to                                   : 'Til',
        is                                   : 'Er',
        nonWorking                           : 'Ikke-arbeid',
        working                              : 'Arbeider',
        hours                                : 'Timer',
        repeat                               : 'Gjenta',
        repeatEnd                            : 'Gjenta slutt',
        errorMissingDate                     : 'Unntaksdatoområdet er påkrevd',
        errorStartAfterEnd                   : '"Fra" -dato kan ikke være etter "til" dato ',
        errorStartAndEndRepeatNumberMismatch : 'Unntak bør starte og avslutte like mange ganger'
    },

    CalendarEditorWeekPanel : {
        name        : 'Navn',
        from        : 'Fra',
        to          : 'Til',
        days        : 'Dager',
        copyDay     : 'Kopi dag',
        pasteDay    : 'Lim inn dag',
        stopCopying : 'Slutt å kopiere'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Legg til rekkevidde',
        removeRange : 'Fjern rekkevidden'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"Fra" -dato kan ikke være etter "til" dato ',
        errorNoDefaultWeek           : 'Ukekonfigurasjon er nødvendig',
        errorMultipleDefaultWeeks    : 'Mer enn en standarduke er spesifisert',
        errorNoWeekAvailability      : 'Uke må gi litt arbeidstid',
        errorInvalidWeekAvailability : 'Uke har arbeidstidskonfigurasjonsfeil',
        noRows                       : 'Ingen uker lagt til'
    },

    AdvancedTab : {
        Advanced                   : 'Avansert',
        Calendar                   : 'Kalender',
        'Scheduling mode'          : 'Planleggingsmodus',
        'Effort driven'            : 'Innsatsdrevet',
        'Manually scheduled'       : 'Planlagt manuelt',
        'Constraint type'          : 'Begrensningstype',
        'Constraint date'          : 'Begrensningsdato',
        Constraint                 : 'Begrensning',
        Rollup                     : 'Rapporter til oppsummering',
        Inactive                   : 'Ikke aktiv',
        'Ignore resource calendar' : 'Ignorer ressurskalender',
        'Scheduling direction'     : 'Planleggingsretning',
        projectBorder              : 'Prosjektgrense',
        ignore                     : 'Overse',
        honor                      : 'Ære',
        askUser                    : 'Spør brukeren'
    },

    DependencyTab : {
        Predecessors      : 'Tidligere',
        Successors        : 'Senere',
        ID                : 'ID',
        Name              : 'Navn',
        Type              : 'Type',
        Lag               : 'Forsinkelse',
        cyclicDependency  : 'Syklisk avhengighet',
        invalidDependency : 'Ugyldig avhengighet',
        readOnlyTask      : 'En skrivebeskyttet oppgave kan ikke kobles'
    },

    NotesTab : {
        Notes : 'Merkander'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalender'
    },

    ResourceEdit : {
        editResource : 'Rediger ressurs'
    },

    ResourceEditor : {
        resourceInformation : 'Ressursinformasjon',
        costs               : 'Kostnader',
        save                : 'Spare',
        error               : 'Feil',
        inputErrors         : 'Det er inndatafeil. Rett opp dem før du lagrer endringene.',
        delete              : 'Slett',
        confirmation        : 'Bekreftelse',
        removeUsedResource  : 'Ressursen er tilordnet noen oppgaver. Klikk "Ja" for å fjerne ressursen uansett.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalender',
        general     : 'General',
        label       : 'Materialetikett',
        name        : 'Ressursnavn',
        type        : 'Type',
        costAccrual : 'Kostnadsperiodisering',
        labelHint   : 'for eksempel kg, tonn eller bokser',
        maxUnits    : 'Maks enheter'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Påløper kl',
        prorated : 'Forholdsmessig',
        start    : 'Start',
        end      : 'Slutt'
    },

    CostAccrualField : {
        prorated : 'Forholdsmessig',
        start    : 'Start',
        end      : 'Slutt'
    },

    ResourceType : {
        work     : 'Arbeid',
        material : 'Materiale',
        cost     : 'Koste'
    },

    ResourceTypeColumn : {
        type : 'Type'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Pristabell',
        newGroup     : 'Nytt bord',
        removeGroup  : 'Fjern bordet',
        useByDefault : 'Brukes som standard for ressurstildelingene',
        noRates      : 'Ingen priser'
    },

    ResourceGrid : {
        name          : 'Navn',
        materialLabel : 'Materialetikett',
        maxUnits      : 'Maks enheter',
        cost          : 'Koste',
        noRows        : 'Ingen ressurser'
    },

    ResourceRateTableContainer : {
        startDate    : 'Startdato',
        standardRate : 'Standardpris',
        perUseCost   : 'Kostnad per bruk',
        addRate      : 'Legg til rate',
        removeRate   : 'Fjern rate',
        name         : 'Navn',
        noRates      : 'Ingen priser'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Informasjon om prisbord'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Mengde',
        Resources   : 'Ressurser',
        Resource    : 'Ressurs',
        Units       : 'Enheter',
        cost        : 'Koste',
        effort      : 'Anstrengelse',
        start       : 'Start',
        finish      : 'Fullfør',
        preamble    : 'Innledning',
        postamble   : 'Etterord'
    },

    RateTableColumn : {
        rateTable : 'Pristabell'
    },

    RecurrenceTab : {
        title : 'Gjenta'
    },

    SchedulingModePicker : {
        Normal           : 'Normal',
        'Fixed Duration' : 'Fast varighet',
        'Fixed Units'    : 'Faste enheter',
        'Fixed Effort'   : 'Fast innsats'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} av {available}</span> tildelt',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} av {available}</span> tildelt',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} av {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} av {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'På {startDate}<br><span class="{cls}">{allocated} av {available}</span> tildelt:<br>{assignments}',
        plusMore              : '+{value} mer'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Innsats</div><div class="b-effort-value {cls}">{allocated} av {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Innsats</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Kostnad</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Mengde</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} på {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Sammendrag for {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Sammendrag for {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} mer',
        nameColumnText        : 'Ressurs / Hendelse'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Avbryt endringen og gjør ingenting',
        schedulingConflict : 'Planleggingskonflikt',
        emptyCalendar      : 'Kalenderkonfigurasjonsfeil',
        cycle              : 'Planleggingssyklus',
        Apply              : 'Bruk'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Vennligst velg avhengighet:',
        invalidDependencyLabel : 'Det er ugyldige avhengigheter involvert som må adresseres:'
    },

    SchedulerProBase : {
        propagating     : 'Kalkulerer prosjekt',
        storePopulation : 'Laster data',
        finalizing      : 'Fullfører resultater'
    },

    EventSegments : {
        splitEvent    : 'Delt arrangement',
        renameSegment : 'Gi nytt navn'
    },

    NestedEvents : {
        createGroup         : 'Grupper valgte hendelser',
        newGroupName        : 'Ny gruppe',
        deNestingNotAllowed : 'Gjennesting ikke tillatt',
        nestingNotAllowed   : 'Nesting ikke tillatt'
    },

    VersionGrid : {
        compare       : 'Sammenlign',
        description   : 'Beskrivelse',
        occurredAt    : 'Skjedde på',
        rename        : 'Gi nytt navn',
        restore       : 'Gjenopprette',
        stopComparing : 'Stopp sammenligning'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'oppgave',
            AssignmentModel : 'oppdrag',
            DependencyModel : 'lenke',
            ProjectModel    : 'prosjekt',
            ResourceModel   : 'ressurss',
            other           : 'gjenstand'
        },
        entityNamesPlural : {
            TaskModel       : 'oppgaver',
            AssignmentModel : 'oppdrag',
            DependencyModel : 'lenker',
            ProjectModel    : 'prosjekter',
            ResourceModel   : 'ressursser',
            other           : 'gjenstander'
        },
        transactionDescriptions : {
            update : 'Endret {n} {entities}',
            add    : 'Lagt til {n} {entities}',
            remove : 'Fjernet {n} {entities}',
            move   : 'Flyttet {n} {entities}',
            mixed  : 'Endret {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktiv',
            allDay                   : 'Hele dagen',
            allowOverlap             : 'Tillat overlapping',
            barMargin                : 'Stolpemargin',
            bidirectional            : 'Toveis',
            calendar                 : 'Kalender',
            cls                      : 'CSS-klasse',
            constraintDate           : 'Begrensningsdato',
            constraintType           : 'Begrensningstype',
            daysPerMonth             : 'Dager per måned',
            daysPerWeek              : 'Dager per uke',
            delayFromParent          : 'Forsinkelse fra overordnet',
            direction                : 'Retning',
            drawDependencies         : 'Tegn avhengigheter',
            duration                 : 'Varighet',
            durationUnit             : 'Varighetsenhet',
            effort                   : 'Innsats',
            effortDriven             : 'Innsatsdrevet',
            effortUnit               : 'Innsatsenhet',
            endDate                  : 'Sluttdato',
            eventColor               : 'Farge',
            eventId                  : 'Hendelses-ID',
            eventLayout              : 'Hendelsesoppsett',
            eventStyle               : 'Stolpestil',
            exceptionDates           : 'Unntaksdatoer',
            fixed                    : 'Fast',
            from                     : 'Fra',
            fromSide                 : 'Fra side',
            hoursPerDay              : 'Timer per dag',
            href                     : 'Lenke',
            iconCls                  : 'Ikon',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignorer ressurskalender',
            ignoreTimeZone           : 'Ignorer tidssone',
            image                    : 'Bilde',
            imageUrl                 : 'Bilde-URL',
            inactive                 : 'Inaktiv',
            intervals                : 'Intervaller',
            lag                      : 'Forsinkelse',
            lagUnit                  : 'Forsinkelsesenhet',
            lineStyle                : 'Linjestil',
            manuallyScheduled        : 'Manuelt planlagt',
            milestoneWidth           : 'Milepælsbredde',
            name                     : 'Navn',
            note                     : 'Notat',
            parentId                 : 'Foreldre-ID',
            parentIndex              : 'Posisjon',
            percentDone              : '% fullført',
            postamble                : 'Postamble',
            preamble                 : 'Preamble',
            readOnly                 : 'Skrivebeskyttet',
            recurrenceRule           : 'Gjentakelsesregel',
            resourceId               : 'Ressurs-ID',
            resourceMargin           : 'Ressursmargin',
            rowHeight                : 'Radhøyde',
            schedulingMode           : 'Planleggingsmodus',
            segments                 : 'Segmenter',
            showAvatar               : 'Vis avatar',
            showInTimeline           : 'Vis i tidslinje',
            startDate                : 'Startdato',
            stickyContents           : 'Klebrige innhold',
            strokeColor              : 'Linjefarge',
            style                    : 'Stil',
            target                   : 'Lenkemål',
            to                       : 'Til',
            toSide                   : 'Til side',
            type                     : 'Type',
            units                    : 'Enheter',
            unscheduled              : 'Ikke planlagt',
            unspecifiedTimeIsWorking : 'Uspesifisert tid er arbeidstid',
            version                  : 'Versjon'
        },
        intervals : {
            working    : 'Arbeider',
            nonWorking : 'Ikke-arbeidende',
            fromTo     : 'Fra {from} til {to}',
            recurring  : 'Gjentakende starter {start} slutter {end}'
        },
        addEntity         : 'Lagt til {type} **{name}**',
        removeEntity      : 'Fjernet {type} **{name}**',
        updateEntity      : 'Endret {type} **{name}**',
        moveEntity        : 'Flyttet {type} **{name}** fra {from} til {to}',
        addDependency     : 'Lagt til lenke fra **{from}** til **{to}**',
        removeDependency  : 'Fjernet lenke fra **{from}** til **{to}**',
        updateDependency  : 'Redigert lenke fra **{from}** til **{to}**',
        addAssignment     : 'Tildelt **{resource}** til **{event}**',
        removeAssignment  : 'Fjernet oppdrag av **{resource}** fra **{event}**',
        updateAssignment  : 'Redigert oppgave av **{resource}** til **{event}**',
        noChanges         : 'Ingen endringer',
        nullValue         : 'ingen',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Lagret kl. {date}',
        autoSavedAt       : 'Automatisk lagret kl. {date}',
        undid             : 'Angret endringer',
        redid             : 'Gjentok endringer',
        editedTask        : 'Redigerte oppgaveegenskaper',
        deletedTask       : 'Slettet en oppgave',
        movedTask         : 'Flyttet en oppgave',
        movedTasks        : 'Flyttet oppgaver'
    }
};

export default LocaleHelper.publishLocale(locale);
