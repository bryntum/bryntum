import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Et.js';
import '../../Grid/localization/Et.js';

const locale = {

    localeName : 'Et',
    localeDesc : 'Eesti keel',
    localeCode : 'et',
    localeRtl  : false,

    Object : {
        newEvent    : 'Uus sündmus',
        information : 'Informatsioon',
        showDetails : 'Näita üksikasju'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' sündmus' + (data !== 1 ? 'ed' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Lülita ressursipaigutuse veerg. SPACE kontekstimenüüs.'
    },

    Dependencies : {
        from    : 'Alates',
        to      : 'Kuni',
        valid   : 'Kehtiv',
        invalid : 'Kehtetu'
    },

    DependencyType : {
        SS           : 'AA',
        SF           : 'AL',
        FS           : 'LA',
        FF           : 'LL',
        StartToStart : 'Algusest alguseni',
        StartToEnd   : 'Algusest lõpuni',
        EndToStart   : 'Lõpust alguseni',
        EndToEnd     : 'Lõpust lõpuni',
        short        : [
            'AA',
            'AL',
            'LA',
            'LL'
        ],
        long : [
            'Algusest alguseni',
            'Algusest lõpuni',
            'Lõpust alguseni',
            'Lõpust lõpuni'
        ]
    },

    DependencyEdit : {
        From              : 'Alates',
        To                : 'Kuni',
        Type              : 'Tüüp',
        Lag               : 'Viivitus',
        color             : 'Värv',
        lineStyle         : 'Joone stiil',
        solid             : 'Pidev',
        dashed            : 'Katkendlik',
        dotted            : 'Punktiir',
        dashDot           : 'Katkend-punkt',
        longDash          : 'Pikk katkend',
        'Edit dependency' : 'Redigeeri sõltuvust',
        Save              : 'Salvesta',
        Delete            : 'Kustuta',
        Cancel            : 'Tühista',
        StartToStart      : 'Algusest alguseni',
        StartToEnd        : 'Algusest lõpuni',
        EndToStart        : 'Lõpust alguseni',
        EndToEnd          : 'Lõpust lõpuni',
        Active            : 'Aktiivne'
    },

    EventEdit : {
        Name           : 'Nimi',
        Resource       : 'Ressurss',
        Start          : 'Algus',
        startTime      : 'Algus aeg',
        End            : 'Lõpp',
        endTime        : 'Lõppaeg',
        Save           : 'Salvesta',
        Delete         : 'Kustuta',
        Cancel         : 'Tühista',
        'Edit event'   : 'Redigeeri sündmust',
        Repeat         : 'Korda',
        editRecurrence : 'Redigeeri kordust'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Sündmus kattub selle ressursi puhul olemasoleva sündmusega',
        noDropOutsideTimeline   : 'Sündmust ei või jätta täielikult väljapoole ajajoont',
        duplicateAssignmentDrag : 'Sündmust ei saa samale ressursile mitu korda määrata'
    },

    SchedulerBase : {
        'Add event'      : 'Lisa sündmus',
        'Delete event'   : 'Kustuta sündmus',
        'Unassign event' : 'Eemalda sündmuse määramine',
        color            : 'Värv',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, algab ${startDate} ${eventRecord.duration > 0 ? `kestab ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Suumi',
        activeDateRange : 'Kuupäevavahemik',
        startText       : 'Alguskuupäev',
        endText         : 'Lõppkuupäev',
        todayText       : 'Täna'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Ajavahemik näitab ${startDate} kuni ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Kopeeri sündmus',
        cutEvent   : 'Lõika sündmus',
        pasteEvent : 'Kleebi sündmus'
    },

    EventFilter : {
        filterEvents : 'Filtreeri ülesanded',
        byName       : 'Nime järgi'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Näita praegust ajajoont'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Sekundit'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD.MM, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD.MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Päev'
        },
        day : {
            name : 'Päev/tund'
        },
        week : {
            name : 'Nädal/tund'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Nädal/päev'
        },
        dayAndMonth : {
            name : 'Kuu'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Nädal'
        },
        weekAndMonth : {
            name : 'Nädalat'
        },
        weekAndDayLetter : {
            name : 'Nädal/nädalapäev'
        },
        weekDateAndMonth : {
            name : 'Kuud/nädalad'
        },
        monthAndYear : {
            name : 'Kuud'
        },
        year : {
            name : 'Aastad'
        },
        manyYears : {
            name : 'Mitu aastat'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Oled sündmust kustutamas',
        'delete-all-message'        : 'Kas soovid kustutada kõik selle sündmuse esinemised?',
        'delete-further-message'    : 'Kas soovid kustutada selle ja kõik selle sündmuse tulevased esinemised või ainult valitud esinemised?',
        'delete-only-this-message'  : 'Kas soovite selle sündmuse esinemise kustutada?',
        'delete-further-btn-text'   : 'Kustuta kõik tulevased sündmused',
        'delete-only-this-btn-text' : 'Kustuta ainult see sündmus',
        'update-title'              : 'Muudad korduvat sündmust',
        'update-all-message'        : 'Kas soovid muuta kõiki selle sündmuse esinemisi?',
        'update-further-message'    : 'Kas soovid muuta vaid seda sündmuse esinemist või seda ja kõiki tulevasi esinemisi?',
        'update-only-this-message'  : 'Kas soovite selle sündmuse esinemist muuta?',
        'update-further-btn-text'   : 'Kõik tulevased sündmused',
        'update-only-this-btn-text' : 'Ainult see sündmus',
        Yes                         : 'Jah',
        Cancel                      : 'Tühista',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' ja ',
        Daily                           : 'Igapäevane',
        'Weekly on {1}'                 : ({ days }) => `Igapäevane ajal ${days}`,
        'Monthly on {1}'                : ({ days }) => `Igakuine ajal ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Iga-aastane ajal  ${days}  ${months} kuust`,
        'Every {0} days'                : ({ interval }) => `Iga ${interval} päeva tagant`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Iga ${interval} nädala tagant ajal ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Iga ${interval} kuu tagant ajal ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Iga ${interval} aasta tagant ${days}  ${months} kuust`,
        position1                       : 'esimene',
        position2                       : 'teine',
        position3                       : 'kolmas',
        position4                       : 'neljas',
        position5                       : 'viies',
        'position-1'                    : 'viimane',
        day                             : 'päev',
        weekday                         : 'tööpäev',
        'weekend day'                   : 'nädalavahetus',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Korda sündmust',
        Cancel              : 'Tühista',
        Save                : 'Salvesta',
        Frequency           : 'Sagedus',
        Every               : 'Iga',
        DAILYintervalUnit   : 'päev(a) tagant',
        WEEKLYintervalUnit  : 'nädal(a) tagant',
        MONTHLYintervalUnit : 'kuu tagant',
        YEARLYintervalUnit  : 'aasta tagant',
        Each                : 'Iga',
        on                  : 'Ajal ',
        the                 : 'Ajal ',
        'On the'            : 'Ajal ',
        'End repeat'        : 'Lõpeta kordumine',
        'time(s)'           : 'aeg (ajad)',
        Days                : 'Päevad',
        Months              : 'Kuud'
    },

    RecurrenceDaysCombo : {
        day           : 'päev',
        weekday       : 'tööpäev',
        'weekend day' : 'nädalavahetus'
    },

    RecurrencePositionsCombo : {
        position1    : 'esimene',
        position2    : 'teine',
        position3    : 'kolmas',
        position4    : 'neljas',
        position5    : 'viies',
        'position-1' : 'viimane'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Mitte kunagi',
        After     : 'Pärast',
        'On date' : 'Kuupäeval'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Ära korda',
        Daily   : 'Igapäevane',
        Weekly  : 'Iganädalane',
        Monthly : 'Igakuine',
        Yearly  : 'Iga-aastane'
    },

    RecurrenceCombo : {
        None   : 'Mitte ükski',
        Custom : 'Kohandatud...'
    },

    Summary : {
        'Summary for' : date => `Kokkuvõte kuupäeval ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Lõpeta graafik',
        currentview  : 'Nähtav graafik',
        daterange    : 'Kuupäevavahemik',
        completedata : 'Lõpeta graafik (kõigi sündmuste jaoks)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Kuupäevavahemik',
        'Export from'    : 'Alates',
        'Export to'      : 'Kuni'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Üksik leht'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Üksik leht (skaalamata)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Mitu lehekülge (vertikaalne)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Ressursse pole määratud'
    },

    CrudManagerView : {
        serverResponseLabel : 'Serveri vastus:'
    },

    DurationColumn : {
        Duration : 'Kestus'
    },

    EventClusteringBase : {
        unnamed         : 'Nimetu',
        more            : count => `+ veel ${count}`,
        clusteredEvents : count => `Rühmitatud sündmused: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Rühmitatud vahemikud: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Puudub',
        assoonaspossible    : 'Nii kiiresti kui võimalik',
        aslateaspossible    : 'Nii hilja kui võimalik',
        muststarton         : 'Peab algama',
        mustfinishon        : 'Peab lõppema',
        startnoearlierthan  : 'Ei tohi alata varem kui',
        startnolaterthan    : 'Ei tohi alata hiljem kui',
        finishnoearlierthan : 'Ei tohi lõppeda varem kui',
        finishnolaterthan   : 'Ei tohi lõppeda hiljem kui'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} puhveraeg enne sündmust`;
            }
            if (postamble) {
                description += `.${postamble.toString()} puhveraeg pärast sündmust`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Edasi',
        Backward      : 'Tagasi',
        inheritedFrom : 'Pärineb',
        enforcedBy    : 'Jõustatud'
    },

    CalendarField : {
        'Default calendar' : 'Vaikimisi kalender',
        editCalendar       : 'Redigeerimise kalender'
    },

    TaskEditorBase : {
        Information   : 'Ülesande teave',
        Save          : 'Salvesta',
        Cancel        : 'Tühista',
        Delete        : 'Kustuta',
        calculateMask : 'Arvutamine...',
        saveError     : 'Ei saa salvestada, palun parandage kõigepealt vead',
        repeatingInfo : 'Korduva sündmuse vaatamine',
        editRepeating : 'Redigeeri'
    },

    TaskEdit : {
        editEvent              : 'Redigeeri sündmust',
        ConfirmDeletionTitle   : 'Kinnita kustutamine',
        ConfirmDeletionMessage : 'Kas olete kindel, et soovite sündmuse kustutada?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '33em'
    },

    SchedulerGeneralTab : {
        General      : 'Üldine',
        Name         : 'Nimi',
        Resources    : 'Ressursid',
        '% complete' : '% tehtud',
        Duration     : 'Kestus',
        Start        : 'Algus',
        Finish       : 'Lõpp',
        Effort       : 'Panus',
        Preamble     : 'Preambula',
        Postamble    : 'Postambula'
    },

    GeneralTab : {
        General      : 'Üldine',
        Name         : 'Nimi',
        '% complete' : '% tehtud',
        Duration     : 'Kestus',
        Start        : 'Algus',
        Finish       : 'Lõpp',
        Effort       : 'Panus',
        Dates        : 'Kuupäevad'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Täiustatud',
        Calendar                   : 'Kalender',
        'Scheduling mode'          : 'Kavandamise režiim',
        'Effort driven'            : 'Tehtud pingutus',
        'Manually scheduled'       : 'Manuaalselt kavandatud',
        'Constraint type'          : 'Piirangu tüüp',
        'Constraint date'          : 'Piirangu kuupäev',
        Inactive                   : 'Mitteaktiivne',
        'Ignore resource calendar' : 'Ignoreeri ressursikalendrit'
    },

    CalendarEditorDatePicker : {
        addException : 'Lisada erand',
        addWeek      : 'Lisage nädal'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Lisada erand',
        removeException : 'Eemaldage erand',
        noRows          : 'Erandeid pole lisatud'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Lisage nädal',
        removeWeek : 'Eemaldage nädal'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Päevad töötavad vaikimisi',
        workingTimeCalendar        : 'Tööaja kalender',
        exceptions                 : 'Erandid',
        general                    : 'Üld-',
        name                       : 'Nimetus',
        parent                     : 'Vanem',
        save                       : 'Kokkuhoid',
        weeks                      : 'Nädalad',
        error                      : 'Viga',
        inputErrors                : 'On sisendvigu. Enne muudatuste salvestamist parandage need.',
        delete                     : 'Kustutama',
        addCalendar                : 'Lisage kalender',
        confirmation               : 'Kinnitamine',
        removeCalendarWithChildren : 'Kalendris on lastekalendrid. Klõpsake kalendri eemaldamiseks oma lastega.',
        removeCalendarAndLinks     : 'Kalendrit kasutavad mõned kirjed. Klõpsake nende lahti ühendamiseks ja kalendri eemaldamiseks.',
        newException               : 'Uus erand',
        newWeek                    : 'Uus nädal'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' töötab',
        isNotWorking : ' ei tööta',
        basedOn      : ' põhineb:',
        byDefault    : 'algselt',
        rangeTpl     : (start, end) => `${start} kuni ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Tööpäev',
        nonWorkingDay : 'Mittetööstuspäev'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Seal on kattuvad vahemikud',
        errorMissingDate   : 'Vaja on algus- ja lõpuaega',
        errorStartAfterEnd : 'Algusaeg ei saa olla pärast lõpuaega'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Nimetus',
        from                                 : '-Lt',
        to                                   : 'Juurde',
        is                                   : 'On',
        nonWorking                           : 'Mittetöötav',
        working                              : 'Töötav',
        hours                                : 'Tööaeg',
        repeat                               : 'Kordama',
        repeatEnd                            : 'Kordus lõpp',
        errorMissingDate                     : 'Erandikuupäeva vahemik on vajalik',
        errorStartAfterEnd                   : '"Alates" kuupäevast ei saa olla "kuni" kuupäeva ',
        errorStartAndEndRepeatNumberMismatch : 'Erand peaks algama ja lõppema sama arvu kordi'
    },

    CalendarEditorWeekPanel : {
        name        : 'Nimetus',
        from        : '-Lt',
        to          : 'Juurde',
        days        : 'Päevad',
        copyDay     : 'Koopiapäev',
        pasteDay    : 'Pastapäev',
        stopCopying : 'Lõpetage kopeerimine'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Lisada vahemik',
        removeRange : 'Eemalda vahemik'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"Alates" kuupäevast ei saa olla "kuni" kuupäeva ',
        errorNoDefaultWeek           : 'Nädala konfiguratsioon on vajalik',
        errorMultipleDefaultWeeks    : 'Täpsustatud on rohkem kui üks vaikenädal',
        errorNoWeekAvailability      : 'Nädal peab olema teatav tööaeg',
        errorInvalidWeekAvailability : 'Nädal on tööaja konfiguratsioonivead',
        noRows                       : 'Nädalaid pole lisatud'
    },

    AdvancedTab : {
        Advanced                   : 'Täiustatud',
        Calendar                   : 'Kalender',
        'Scheduling mode'          : 'Kavandamise režiim',
        'Effort driven'            : 'Tehtud pingutus',
        'Manually scheduled'       : 'Manuaalselt kavandatud',
        'Constraint type'          : 'Piirangu tüüp',
        'Constraint date'          : 'Piirangu kuupäev',
        Constraint                 : 'Piirang',
        Rollup                     : 'Ümberarvestus',
        Inactive                   : 'Mitteaktiivne',
        'Ignore resource calendar' : 'Ignoreeri ressursikalendrit',
        'Scheduling direction'     : 'Ajakava suund',
        projectBorder              : 'Projektipiiri',
        ignore                     : 'Ignoreerima',
        honor                      : 'Au',
        askUser                    : 'Küsige kasutajalt'
    },

    DependencyTab : {
        Predecessors      : 'Eelkäijad',
        Successors        : 'Järglased',
        ID                : 'ID',
        Name              : 'Nimi',
        Type              : 'Tüüp',
        Lag               : 'Viivitus',
        cyclicDependency  : 'Tsükliline sõltuvus',
        invalidDependency : 'Kehtetu sõltuvus',
        readOnlyTask      : 'Kirjutuskaitstud ülesannet ei saa siduda'
    },

    NotesTab : {
        Notes : 'Märkused'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalender'
    },

    ResourceEdit : {
        editResource : 'Redigeeri ressurssi'
    },

    ResourceEditor : {
        resourceInformation : 'Allikateave',
        costs               : 'Kulud',
        save                : 'Salvesta',
        error               : 'Viga',
        inputErrors         : 'Esineb sisestusvigu. Parandage need enne muudatuste salvestamist.',
        delete              : 'Kustuta',
        confirmation        : 'Kinnitus',
        removeUsedResource  : 'Ressurss on määratud mõnele ülesandele. Ressursi eemaldamiseks klõpsake "Jah".'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalender',
        general     : 'Kindral',
        label       : 'Materjali etikett',
        name        : 'Ressursi nimi',
        type        : 'Tüüp',
        costAccrual : 'Kulude kogunemine',
        labelHint   : 'näiteks kg, tonni või kastid',
        maxUnits    : 'Maksimaalsed ühikud'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Koguneda kell',
        prorated : 'Proportsionaalselt jaotatud',
        start    : 'Alusta',
        end      : 'Lõpp'
    },

    CostAccrualField : {
        prorated : 'Proportsionaalselt jaotatud',
        start    : 'Alusta',
        end      : 'Lõpp'
    },

    ResourceType : {
        work     : 'Töö',
        material : 'Materjal',
        cost     : 'Maksumus'
    },

    ResourceTypeColumn : {
        type : 'Tüüp'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Hindade tabel',
        newGroup     : 'Uus laud',
        removeGroup  : 'Eemalda tabel',
        useByDefault : 'Kasutage ressursside määramiseks vaikimisi',
        noRates      : 'Hinnad puuduvad'
    },

    ResourceGrid : {
        name          : 'Nimi',
        materialLabel : 'Materjali etikett',
        maxUnits      : 'Max ühikud',
        cost          : 'Maksumus',
        noRows        : 'Ressursid puuduvad'
    },

    ResourceRateTableContainer : {
        startDate    : 'Alguskuupäev',
        standardRate : 'Standardmäär',
        perUseCost   : 'Kasutustasu',
        addRate      : 'Lisa määr',
        removeRate   : 'Eemalda määr',
        name         : 'Nimi',
        noRates      : 'Hinnad puuduvad'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Hinnatabeli teave'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Kogus',
        Resources   : 'Ressursid',
        Resource    : 'Ressurss',
        Units       : 'Üksused',
        cost        : 'Maksumus',
        effort      : 'Pingutus',
        start       : 'Alusta',
        finish      : 'Lõpeta',
        preamble    : 'Eessõna',
        postamble   : 'Järelsõna'
    },

    RateTableColumn : {
        rateTable : 'Hindade tabel'
    },

    RecurrenceTab : {
        title : 'Repeat'
    },

    SchedulingModePicker : {
        Normal           : 'Normaalne',
        'Fixed Duration' : 'Määratud kestus',
        'Fixed Units'    : 'Määratud üksused',
        'Fixed Effort'   : 'Määratud panus'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} / {available}</span> määratust',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} / {available}</span> määratust',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} / {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} / {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'Kuupäeval {startDate}<br><span class="{cls}">{allocated} / {available}</span> määratust:<br>{assignments}',
        plusMore              : '+{value} veel'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Pingutus</div><div class="b-effort-value {cls}">{allocated} {available}-st</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Pingutus</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Kulu</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Kogus</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} kuupäeval {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Kokkuvõte ajavahemikust {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Kokkuvõte kuupäeval {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} veel',
        nameColumnText        : 'Ressurss / Sündmus'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Tühista muudatus ja ära tee midagi',
        schedulingConflict : 'Kavandamise konflikt',
        emptyCalendar      : 'Kalendri konfigureerimise viga',
        cycle              : 'Kavandamistsükkel',
        Apply              : 'Rakenda'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Palun vali sõltuvus:',
        invalidDependencyLabel : 'Kaasatud on kehtetuid sõltuvusi, millega tuleb tegeleda:'
    },

    SchedulerProBase : {
        propagating     : 'Projekti arvutamine',
        storePopulation : 'Andmete laadimine',
        finalizing      : 'Tulemuste lõpetamine'
    },

    EventSegments : {
        splitEvent    : 'Jaga sündmus',
        renameSegment : 'Nimeta ümber'
    },

    NestedEvents : {
        createGroup         : 'Grupeeri valitud sündmused',
        newGroupName        : 'Uus grupp',
        deNestingNotAllowed : 'Pesastamise eemaldamine ei ole lubatud',
        nestingNotAllowed   : 'Pesastamine ei ole lubatud'
    },

    VersionGrid : {
        compare       : 'Võrdle',
        description   : 'Kirjeldus',
        occurredAt    : 'Toimus',
        rename        : 'Nimeta ümber',
        restore       : 'Taasta',
        stopComparing : 'Lõpeta võrdlemine'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'ülesanne',
            AssignmentModel : 'määramine',
            DependencyModel : 'link',
            ProjectModel    : 'projekt',
            ResourceModel   : 'ressurss',
            other           : 'objekt'
        },
        entityNamesPlural : {
            TaskModel       : 'ülesanded',
            AssignmentModel : 'määramised',
            DependencyModel : 'lingid',
            ProjectModel    : 'projektid',
            ResourceModel   : 'ressursid',
            other           : 'objektid'
        },
        transactionDescriptions : {
            update : 'Muudetud {n} {entities}',
            add    : 'Lisatud {n} {entities}',
            remove : 'Eemaldatud {n} {entities}',
            move   : 'Teisaldatud {n} {entities}',
            mixed  : 'Muudetud {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktiivne',
            allDay                   : 'Kogu päev',
            allowOverlap             : 'Luba kattumine',
            barMargin                : 'Riba marginaal',
            bidirectional            : 'Kahepoolne',
            calendar                 : 'Kalender',
            cls                      : 'CSS klass',
            constraintDate           : 'Piirangu kuupäev',
            constraintType           : 'Piirangu tüüp',
            daysPerMonth             : 'Päevi kuus',
            daysPerWeek              : 'Päevi nädalas',
            delayFromParent          : 'Viivitus vanemast',
            direction                : 'Suund',
            drawDependencies         : 'Joonista sõltuvused',
            duration                 : 'Kestus',
            durationUnit             : 'Kestuse ühik',
            effort                   : 'Pingutus',
            effortDriven             : 'Pingutuse põhine',
            effortUnit               : 'Pingutuse ühik',
            endDate                  : 'Lõppkuupäev',
            eventColor               : 'Värv',
            eventId                  : 'Sündmuse ID',
            eventLayout              : 'Sündmuse paigutus',
            eventStyle               : 'Riba stiil',
            exceptionDates           : 'Erandkuupäevad',
            fixed                    : 'Fikseeritud',
            from                     : 'Alates',
            fromSide                 : 'Alates küljest',
            hoursPerDay              : 'Tunde päevas',
            href                     : 'Link',
            iconCls                  : 'Ikon',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Eira ressursi kalendrit',
            ignoreTimeZone           : 'Eira ajavööndit',
            image                    : 'Pilt',
            imageUrl                 : 'Pildi URL',
            inactive                 : 'Mitteaktiivne',
            intervals                : 'Intervallid',
            lag                      : 'Viivitus',
            lagUnit                  : 'Viivituse ühik',
            lineStyle                : 'Joone stiil',
            manuallyScheduled        : 'Käsitsi ajastatud',
            milestoneWidth           : 'Vahe-eesmärgi laius',
            name                     : 'Nimi',
            note                     : 'Märkus',
            parentId                 : 'Vanem ID',
            parentIndex              : 'Positsioon',
            percentDone              : '% tehtud',
            postamble                : 'Järelsõna',
            preamble                 : 'Eessõna',
            readOnly                 : 'Ainult lugemiseks',
            recurrenceRule           : 'Korduvuse reegel',
            resourceId               : 'Ressursi ID',
            resourceMargin           : 'Ressursi marginaal',
            rowHeight                : 'Rea kõrgus',
            schedulingMode           : 'Ajastamise režiim',
            segments                 : 'Segmendid',
            showAvatar               : 'Näita avatari',
            showInTimeline           : 'Näita ajajoonel',
            startDate                : 'Alguskuupäev',
            stickyContents           : 'Kleepuvad sisud',
            strokeColor              : 'Joone värv',
            style                    : 'Stiil',
            target                   : 'Lingi sihtkoht',
            to                       : 'Kuni',
            toSide                   : 'Kuni küljest',
            type                     : 'Tüüp',
            units                    : 'Ühikud',
            unscheduled              : 'Ajastamata',
            unspecifiedTimeIsWorking : 'Määramata aeg on tööaeg',
            version                  : 'Versioon'
        },
        intervals : {
            working    : 'Töötamine',
            nonWorking : 'Mitte töötamine',
            fromTo     : 'Alates {from} kuni {to}',
            recurring  : 'Korduv algusega {start} lõpuga {end}'
        },
        addEntity         : 'Lisatud {type} **{name}**',
        removeEntity      : 'Eemaldatud {type} **{name}**',
        updateEntity      : 'Muudetud {type} **{name}**',
        moveEntity        : 'Teisaldatud {type} **{name}** kohast {from} kohta {to}',
        addDependency     : 'Lisatud link kohast **{from}** kohta **{to}**',
        removeDependency  : 'Eemaldatud link kohast **{from}** kohta **{to}**',
        updateDependency  : 'Muudetud linki kohast **{from}** kohta **{to}**',
        addAssignment     : 'Määratud **{resource}** sündmusele **{event}**',
        removeAssignment  : 'Eemaldatud määramine: **{resource}** sündmusest **{event}**',
        updateAssignment  : 'Muudetud määramist: **{resource}** sündmusele **{event}**',
        noChanges         : 'Muudatusi pole',
        nullValue         : 'puudub',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Salvestatud kell {date}',
        autoSavedAt       : 'Automaatne salvestamine kell {date}',
        undid             : 'Ennistas muudatused',
        redid             : 'Tegi uuesti muudatused',
        editedTask        : 'Muutis ülesande omadusi',
        deletedTask       : 'Kustutas ülesande',
        movedTask         : 'Teisaldas ülesande',
        movedTasks        : 'Teisaldas ülesanded'
    }
};

export default LocaleHelper.publishLocale(locale);
