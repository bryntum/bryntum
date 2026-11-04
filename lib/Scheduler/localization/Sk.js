import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Sk.js';
import '../../Grid/localization/Sk.js';

const locale = {

    localeName : 'Sk',
    localeDesc : 'Slovenský',
    localeCode : 'sk',
    localeRtl  : false,

    Object : {
        newEvent    : 'Nová udalosť',
        information : 'Informácie',
        showDetails : 'Zobraziť podrobnosti'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' udalos' + (data !== 1 ? 'ti' : 'ť')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Prepnúť stĺpec rozloženia zdrojov. SPACE pre kontextové menu.'
    },

    Dependencies : {
        from    : 'From',
        to      : 'To',
        valid   : 'Platný',
        invalid : 'Neplatný'
    },

    DependencyType : {
        SS           : 'ZZ',
        SF           : 'ZK',
        FS           : 'KZ',
        FF           : 'KK',
        StartToStart : 'Od začiatku po začiatok',
        StartToEnd   : 'Od začiatku po koniec',
        EndToStart   : 'Od konca po začiatok',
        EndToEnd     : 'Od konca po koniec',
        short        : [
            'ZZ',
            'ZK',
            'KZ',
            'KK'
        ],
        long : [
            'Od začiatku po začiatok',
            'Od začiatku po koniec',
            'Od konca po začiatok',
            'Od konca po koniec'
        ]
    },

    DependencyEdit : {
        From              : 'Od',
        To                : 'Do',
        Type              : 'Typ',
        Lag               : 'Lag',
        color             : 'Farba',
        lineStyle         : 'Štýl čiary',
        solid             : 'Plná',
        dashed            : 'Čiarkovaná',
        dotted            : 'Bodkovaná',
        dashDot           : 'Čiarka-bodka',
        longDash          : 'Dlhá čiarka',
        'Edit dependency' : 'Upraviť súvislosť',
        Save              : 'Uložiť',
        Delete            : 'Vymazať',
        Cancel            : 'Zrušiť',
        StartToStart      : 'Od začiatku po začiatok',
        StartToEnd        : 'Od začiatku po koniec',
        EndToStart        : 'Od konca po začiatok',
        EndToEnd          : 'Od konca po koniec',
        Active            : 'Aktívny'
    },

    EventEdit : {
        Name           : 'Názov',
        Resource       : 'Zdroj',
        Start          : 'Start',
        startTime      : 'Čas začiatku',
        End            : 'End',
        endTime        : 'Čas ukončenia',
        Save           : 'Uložiť',
        Delete         : 'Vymazať',
        Cancel         : 'Zrušiť',
        'Edit event'   : 'Upraviť udalosť',
        Repeat         : 'Opakovať',
        editRecurrence : 'Upraviť opakovanie'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Udalosť presahuje existujúcu udalosť pre tento zdroj',
        noDropOutsideTimeline   : 'Udalosť nemusí byť úplne klesnutá mimo časového rámca',
        duplicateAssignmentDrag : 'Udalosť nie je možné priradiť rovnakému zdroju viackrát'
    },

    SchedulerBase : {
        'Add event'      : 'Pridať udalosť',
        'Delete event'   : 'Vymazať udalosť',
        'Unassign event' : 'Zrušiť pridelenie udalosti',
        color            : 'Farba',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, začína o ${startDate} ${eventRecord.duration > 0 ? `na ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Priblížiť',
        activeDateRange : 'Rozsah dátumu',
        startText       : 'Dátum začiatku',
        endText         : 'Dátum ukončenia',
        todayText       : 'Dnes'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Časová os zobrazuje od ${startDate} do ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Kopírovať udalosť',
        cutEvent   : 'Odstrániť udalosť',
        pasteEvent : 'Vložiť udalosť'
    },

    EventFilter : {
        filterEvents : 'Filtrovať úlohy',
        byName       : 'Podľa názvu'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Ukázať súčasnú časovú líniu'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Sekundy'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD. MM., H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD. MM.',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Deň'
        },
        day : {
            name : 'Deň/hodiny'
        },
        week : {
            name : 'Týždeň/hodiny'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Týždeň/dni'
        },
        dayAndMonth : {
            name : 'Month'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Týždeň'
        },
        weekAndMonth : {
            name : 'Týždne'
        },
        weekAndDayLetter : {
            name : 'Týždne/dni v týždni'
        },
        weekDateAndMonth : {
            name : 'Mesiace/týždne'
        },
        monthAndYear : {
            name : 'Mesiace'
        },
        year : {
            name : 'Roky'
        },
        manyYears : {
            name : 'Viac rokov'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Vymazávate udalosť',
        'delete-all-message'        : 'Chcete vymazať všetky výskyty tejto udalosti?',
        'delete-further-message'    : 'Chcete vymazať tento a všetky budúce výskyty tejto udalosti alebo len zvolený výskyt?',
        'delete-only-this-message'  : 'Chcete odstrániť túto udalosť?',
        'delete-further-btn-text'   : 'Vymazať všetky budúce udalosti',
        'delete-only-this-btn-text' : 'Odstrániť iba túto udalosť',
        'update-title'              : 'Meníte opakujúcu sa udalosť',
        'update-all-message'        : 'Chcete zmeniť všetky výskyty tejto udalosti?',
        'update-further-message'    : 'Chcete zmeniť len tento výskyt udalosti alebo tento a všetky budúce výskyty?',
        'update-only-this-message'  : 'Chcete zmeniť túto udalosť?',
        'update-further-btn-text'   : 'Všetky budúce udalosti',
        'update-only-this-btn-text' : 'Len túto udalosť',
        Yes                         : 'Áno',
        Cancel                      : 'Zrušiť',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' a ',
        Daily                           : 'Denne',
        'Weekly on {1}'                 : ({ days }) => `Týždenne v ${days}`,
        'Monthly on {1}'                : ({ days }) => `Mesačne v ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Ročne v${days} of ${months}`,
        'Every {0} days'                : ({ interval }) => `Každých ${interval} days`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Každých ${interval} týždňov v ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Každých ${interval} mesiacov v ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Každých ${interval} rokov v ${days} z ${months}`,
        position1                       : 'the prvý',
        position2                       : 'druhý',
        position3                       : 'tretí',
        position4                       : 'štvrtý',
        position5                       : 'piaty',
        'position-1'                    : 'ten last',
        day                             : 'deň',
        weekday                         : 'pracovný deň',
        'weekend day'                   : 'deň víkendu',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Opakovať udalosť',
        Cancel              : 'Zrušiť',
        Save                : 'Uložiť',
        Frequency           : 'Frekvencia',
        Every               : 'Každý',
        DAILYintervalUnit   : 'day(ni)',
        WEEKLYintervalUnit  : 'týždeň(ne)',
        MONTHLYintervalUnit : 'mesiac(e)',
        YEARLYintervalUnit  : 'rok(y)',
        Each                : 'Každý',
        on                  : 'Deň',
        the                 : 'V poradi',
        'On the'            : 'V the',
        'End repeat'        : 'Ukončiť opakovanie',
        'time(s)'           : 'čas(s)',
        Days                : 'Dni',
        Months              : 'Mesiace'
    },

    RecurrenceDaysCombo : {
        day           : 'deň',
        weekday       : 'pracovný deň',
        'weekend day' : 'deň víkendu'
    },

    RecurrencePositionsCombo : {
        position1    : 'prvý',
        position2    : 'druhý',
        position3    : 'tretí',
        position4    : 'štvrtý',
        position5    : 'piaty',
        'position-1' : 'posledný'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Nikdy',
        After     : 'Po',
        'On date' : 'V dátum'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Bez opakovania',
        Daily   : 'Denne',
        Weekly  : 'Týždenne',
        Monthly : 'Mesačne',
        Yearly  : 'Ročne'
    },

    RecurrenceCombo : {
        None   : 'Žiadny',
        Custom : 'Vlastný...'
    },

    Summary : {
        'Summary for' : date => `Súhrn pre ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Complete rozvrh',
        currentview  : 'Viditeľný rozvrh',
        daterange    : 'Rozsah dátumov',
        completedata : 'Dokončiť rozvrh (pre všetky udalosti)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Rozsah rozvrhu',
        'Export from'    : 'Od',
        'Export to'      : 'Do'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Jedna strana'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Jedna strana (nezmenšená)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Viac strán (vertikálne)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Nepridelený žiadny zdroj'
    },

    CrudManagerView : {
        serverResponseLabel : 'Odpoveď servera:'
    },

    DurationColumn : {
        Duration : 'Trvanie'
    },

    EventClusteringBase : {
        unnamed         : 'Nepomenované',
        more            : count => `+ ďalších ${count}`,
        clusteredEvents : count => `Zhlukované udalosti: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Zhlukované rozsahy: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Žiadny',
        assoonaspossible    : 'Čo najskôr',
        aslateaspossible    : 'Čo najneskôr',
        muststarton         : 'Musí začať v',
        mustfinishon        : 'Musí skončiť v',
        startnoearlierthan  : 'Nezačať skôr ako',
        startnolaterthan    : 'Nezačať neskôr ako',
        finishnoearlierthan : 'Neskončiť skôr ako',
        finishnolaterthan   : 'neskončiť neskôr ako'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} časová rezerva pred udalosťou`;
            }
            if (postamble) {
                description += `.${postamble.toString()} časová rezerva po udalosti`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Vpred',
        Backward      : 'Späť',
        inheritedFrom : 'Zdedené od',
        enforcedBy    : 'Vynútené od'
    },

    CalendarField : {
        'Default calendar' : 'Predvolený kalendár',
        editCalendar       : 'Editovať kalendár'
    },

    TaskEditorBase : {
        Information   : 'Informácie o úlohe',
        Save          : 'Uložiť',
        Cancel        : 'Zrušiť',
        Delete        : 'Vymazať',
        calculateMask : 'Vypočítavanie...',
        saveError     : 'Nedá sa uložiť, najprv opravte chyby',
        repeatingInfo : 'Zobrazenie opakujúcej sa udalosti',
        editRepeating : 'Upraviť'
    },

    TaskEdit : {
        editEvent              : 'Upraviť udalosť',
        ConfirmDeletionTitle   : 'Potvrdiť vymazanie',
        ConfirmDeletionMessage : 'Naozaj chcete vymazať udalosť?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '34em'
    },

    SchedulerGeneralTab : {
        General      : 'Všoebecné',
        Name         : 'Názov',
        Resources    : 'Zdroje',
        '% complete' : '% dokončené',
        Duration     : 'Trvanie',
        Start        : 'Start',
        Finish       : 'Finish',
        Effort       : 'Effort',
        Preamble     : 'Preambula',
        Postamble    : 'Poštová zásielka'
    },

    GeneralTab : {
        General      : 'Všeobecné',
        Name         : 'Názov',
        '% complete' : '% dokončené',
        Duration     : 'Trvanie',
        Start        : 'Začať',
        Finish       : 'Ukončiť',
        Effort       : 'Effort',
        Dates        : 'Dátumy'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Pokročilé',
        Calendar                   : 'Kalendár',
        'Scheduling mode'          : 'Plánovací režim',
        'Effort driven'            : 'Effort poháňaný',
        'Manually scheduled'       : 'Manuálne naplánované',
        'Constraint type'          : 'Typ obmedzenia',
        'Constraint date'          : 'Dátum obmedzenia',
        Inactive                   : 'Neaktívny',
        'Ignore resource calendar' : 'Ignorovať kalendár zdrojov'
    },

    CalendarEditorDatePicker : {
        addException : 'Pridať výnimku',
        addWeek      : 'Pridať týždeň'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Pridať výnimku',
        removeException : 'Odstrániť výnimku',
        noRows          : 'Pridá sa žiadne výnimky'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Pridať týždeň',
        removeWeek : 'Odstrániť'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Dni fungujú predvolene',
        workingTimeCalendar        : 'Kalendár pracovného času',
        exceptions                 : 'Výnimka',
        general                    : 'Všeobecný',
        name                       : 'názov',
        parent                     : 'Rodič',
        save                       : 'Uložiť',
        weeks                      : 'Týždne',
        error                      : 'Chyba',
        inputErrors                : 'Existujú vstupné chyby. Pred uložením zmien ich opravte.',
        delete                     : 'Vymazať',
        addCalendar                : 'Pridať kalendár',
        confirmation               : 'Potvrdenie',
        removeCalendarWithChildren : 'Kalendár má detské kalendáre. Kliknutím na „Áno“ odstránite kalendár so svojimi deťmi.',
        removeCalendarAndLinks     : 'Kalendár používa niektoré záznamy. Kliknutím na tlačidlo „Áno“ ich neodpojte a odstráňte kalendár.',
        newException               : 'Nová výnimka',
        newWeek                    : 'Nový týždeň'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' pracuje',
        isNotWorking : ' nefunguje to',
        basedOn      : ' založené na:',
        byDefault    : 'predvolene',
        rangeTpl     : (start, end) => `${start} - ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Pracovný deň',
        nonWorkingDay : 'Nepracovný deň'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Existujú prekrývajúce sa rozsahy',
        errorMissingDate   : 'Vyžaduje sa čas začiatku a ukončenia',
        errorStartAfterEnd : 'Čas začiatku nemôže byť po ukončení času'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'názov',
        from                                 : 'Od',
        to                                   : 'Do',
        is                                   : 'Je',
        nonWorking                           : 'Nepracovný',
        working                              : 'Pracujúci',
        hours                                : 'Hodiny',
        repeat                               : 'Opakovať',
        repeatEnd                            : 'Zopakovať',
        errorMissingDate                     : 'Vyžaduje sa rozsah dátumu výnimky',
        errorStartAfterEnd                   : '"Od" dátumu nemôže byť po "Do" ',
        errorStartAndEndRepeatNumberMismatch : 'Výnimka by sa mala začať a ukončiť rovnaký počet'
    },

    CalendarEditorWeekPanel : {
        name        : 'názov',
        from        : 'Od',
        to          : 'Do',
        days        : 'Dni',
        copyDay     : 'Kopírovanie',
        pasteDay    : 'Pasta',
        stopCopying : 'Prestať kopírovať'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Rozsah pridať',
        removeRange : 'Odstrániť rozsah'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"Od" dátumu nemôže byť po "Do" ',
        errorNoDefaultWeek           : 'Vyžaduje sa konfigurácia týždňa',
        errorMultipleDefaultWeeks    : 'Je určený viac ako jeden predvolený týždeň',
        errorNoWeekAvailability      : 'Týždeň musí poskytnúť nejaký pracovný čas',
        errorInvalidWeekAvailability : 'Týždeň má chyby konfigurácie pracovného času',
        noRows                       : 'Nie sú pridané žiadne týždne'
    },

    AdvancedTab : {
        Advanced                   : 'Pokročilý',
        Calendar                   : 'Kalendár',
        'Scheduling mode'          : 'Plánovací režim',
        'Effort driven'            : 'Effort poháňaný',
        'Manually scheduled'       : 'Manuálne naplánovaný',
        'Constraint type'          : 'Typ obmedzenia',
        'Constraint date'          : 'Dátum obmedzenia',
        Constraint                 : 'Obmezenie',
        Rollup                     : 'Akumulácia',
        Inactive                   : 'Neaktívny',
        'Ignore resource calendar' : 'Ignorovať kalendár zdrojov',
        'Scheduling direction'     : 'Smer plánovania',
        projectBorder              : 'Projektová hranica',
        ignore                     : 'Ignorovať',
        honor                      : 'Ctiť',
        askUser                    : 'Opýtať sa používateľa'
    },

    DependencyTab : {
        Predecessors      : 'Predchodcovia',
        Successors        : 'Následníci',
        ID                : 'ID',
        Name              : 'Názov',
        Type              : 'Typ',
        Lag               : 'Lag',
        cyclicDependency  : 'Cyklická súvislosť',
        invalidDependency : 'Neplatná súvislosť',
        readOnlyTask      : 'Úlohu iba na čítanie nemožno prepojiť'
    },

    NotesTab : {
        Notes : 'Poznámky'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalendár'
    },

    ResourceEdit : {
        editResource : 'Upraviť zdroj'
    },

    ResourceEditor : {
        resourceInformation : 'Informácie o zdroji',
        costs               : 'náklady',
        save                : 'Uložiť',
        error               : 'Chyba',
        inputErrors         : 'Vyskytli sa chyby vstupu. Pred uložením zmien ich opravte.',
        delete              : 'Odstrániť',
        confirmation        : 'Potvrdenie',
        removeUsedResource  : 'Zdroj je priradený k niektorým úlohám. Kliknutím na „Áno“ zdroj napriek tomu odstránite.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalendár',
        general     : 'generál',
        label       : 'Označenie materiálu',
        name        : 'Názov zdroja',
        type        : 'Typ',
        costAccrual : 'Časové rozlíšenie nákladov',
        labelHint   : 'napríklad kg, tony alebo škatule',
        maxUnits    : 'Maximálny počet jednotiek'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Načítať o',
        prorated : 'Pomerne',
        start    : 'Štart',
        end      : 'Koniec'
    },

    CostAccrualField : {
        prorated : 'Pomerne',
        start    : 'Štart',
        end      : 'Koniec'
    },

    ResourceType : {
        work     : 'Práca',
        material : 'Materiál',
        cost     : 'náklady'
    },

    ResourceTypeColumn : {
        type : 'Typ'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Tabuľka cien',
        newGroup     : 'Nový stôl',
        removeGroup  : 'Odstráňte stôl',
        useByDefault : 'Použiť predvolene pre priradenia zdrojov',
        noRates      : 'Žiadne sadzby'
    },

    ResourceGrid : {
        name          : 'Meno',
        materialLabel : 'Označenie materiálu',
        maxUnits      : 'Maximálny počet jednotiek',
        cost          : 'náklady',
        noRows        : 'Žiadne zdroje'
    },

    ResourceRateTableContainer : {
        startDate    : 'Dátum začiatku',
        standardRate : 'Štandardná sadzba',
        perUseCost   : 'Cena za použitie',
        addRate      : 'Pridať sadzbu',
        removeRate   : 'Odstrániť sadzbu',
        name         : 'Meno',
        noRates      : 'Žiadne sadzby'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Informácie o tabuľke sadzieb'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Množstvo',
        Resources   : 'Zdroje',
        Resource    : 'Zdroje',
        Units       : 'Jednotky',
        cost        : 'náklady',
        effort      : 'Úsilie',
        start       : 'Štart',
        finish      : 'Dokončiť',
        preamble    : 'Predslov',
        postamble   : 'Doslov'
    },

    RateTableColumn : {
        rateTable : 'Tabuľka cien'
    },

    RecurrenceTab : {
        title : 'Zopakovať'
    },

    SchedulingModePicker : {
        Normal           : 'Normálny',
        'Fixed Duration' : 'Pevné trvanie',
        'Fixed Units'    : 'Pevné jednotky',
        'Fixed Effort'   : 'Pevná úsilie'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} z {available}</span> pridelených',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} z {available}</span>pridelených',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} z {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} z {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'V {startDate}<br><span class="{cls}">{allocated} z {available}</span>pridelených:<br>{assignments}',
        plusMore              : '+{value} viac '
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Úsilie</div><div class="b-effort-value {cls}">{allocated} z {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Úsilie</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Náklady</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Množstvo</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} dňa {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Zhrnutie pre {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Zhrnutie pre {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} viac',
        nameColumnText        : 'Zdroj / Udalosť'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Zrušiť zmenu a nerobiť nč',
        schedulingConflict : 'Plánovaný konflikt',
        emptyCalendar      : 'Chyba konfigurácie kalendára',
        cycle              : 'Plánovací cyklus',
        Apply              : 'Použiť'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Zvoľte súvislosť:',
        invalidDependencyLabel : 'Sú zahrnuté neplatné závislosti, které je potrebné osloviť:'
    },

    SchedulerProBase : {
        propagating     : 'Vypočítanie projektu',
        storePopulation : 'Nahrávanie údajov',
        finalizing      : 'Finalizovanie výsledkov'
    },

    EventSegments : {
        splitEvent    : 'Rozdeliť udalosť',
        renameSegment : 'Premenovať'
    },

    NestedEvents : {
        createGroup         : 'Zoskupiť vybrané udalosti',
        newGroupName        : 'Nová skupina',
        deNestingNotAllowed : 'Vykladanie nepovolené',
        nestingNotAllowed   : 'Nesting nepovolené'
    },

    VersionGrid : {
        compare       : 'Porovnať',
        description   : 'Popis',
        occurredAt    : 'Stalo sa v',
        rename        : 'Premenovať',
        restore       : 'Obnoviť',
        stopComparing : 'Zastaviť porovnávanie'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'úloha',
            AssignmentModel : 'zadanie',
            DependencyModel : 'odkaz',
            ProjectModel    : 'projekt',
            ResourceModel   : 'zdroj',
            other           : 'objekt'
        },
        entityNamesPlural : {
            TaskModel       : 'úlohy',
            AssignmentModel : 'zadania',
            DependencyModel : 'odkazy',
            ProjectModel    : 'projekty',
            ResourceModel   : 'zdroje',
            other           : 'objekty'
        },
        transactionDescriptions : {
            update : 'Zmenené {n} {entities}',
            add    : 'Pridané {n} {entities}',
            remove : 'Odstránené {n} {entities}',
            move   : 'Presunuté {n} {entities}',
            mixed  : 'Zmenené {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktívne',
            allDay                   : 'Celý deň',
            allowOverlap             : 'Povoliť prekrytie',
            barMargin                : 'Okraj pruhu',
            bidirectional            : 'Obojsmerné',
            calendar                 : 'Kalendár',
            cls                      : 'CSS trieda',
            constraintDate           : 'Dátum obmedzenia',
            constraintType           : 'Typ obmedzenia',
            daysPerMonth             : 'Dni za mesiac',
            daysPerWeek              : 'Dni za týždeň',
            delayFromParent          : 'Oneskorenie od rodiča',
            direction                : 'Smer',
            drawDependencies         : 'Kresliť závislosti',
            duration                 : 'Trvanie',
            durationUnit             : 'Jednotka trvania',
            effort                   : 'Úsilie',
            effortDriven             : 'Riadené úsilím',
            effortUnit               : 'Jednotka úsilia',
            endDate                  : 'Dátum ukončenia',
            eventColor               : 'Farba',
            eventId                  : 'ID udalosti',
            eventLayout              : 'Rozloženie udalosti',
            eventStyle               : 'Štýl pruhu',
            exceptionDates           : 'Výnimkové dátumy',
            fixed                    : 'Fixné',
            from                     : 'Od',
            fromSide                 : 'Z strany',
            hoursPerDay              : 'Hodiny za deň',
            href                     : 'Odkaz',
            iconCls                  : 'Ikona',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignorovať kalendár zdroja',
            ignoreTimeZone           : 'Ignorovať časovú zónu',
            image                    : 'Obrázok',
            imageUrl                 : 'URL obrázka',
            inactive                 : 'Neaktívne',
            intervals                : 'Intervaly',
            lag                      : 'Oneskorenie',
            lagUnit                  : 'Jednotka oneskorenia',
            lineStyle                : 'Štýl čiary',
            manuallyScheduled        : 'Ručne naplánované',
            milestoneWidth           : 'Šírka míľnika',
            name                     : 'Názov',
            note                     : 'Poznámka',
            parentId                 : 'ID rodiča',
            parentIndex              : 'Pozícia',
            percentDone              : '% hotové',
            postamble                : 'Postamble',
            preamble                 : 'Preamble',
            readOnly                 : 'Len na čítanie',
            recurrenceRule           : 'Pravidlo opakovania',
            resourceId               : 'ID zdroja',
            resourceMargin           : 'Okraj zdroja',
            rowHeight                : 'Výška riadku',
            schedulingMode           : 'Režim plánovania',
            segments                 : 'Segmenty',
            showAvatar               : 'Zobraziť avatar',
            showInTimeline           : 'Zobraziť v časovej osi',
            startDate                : 'Dátum začiatku',
            stickyContents           : 'Lepivé obsahy',
            strokeColor              : 'Farba čiary',
            style                    : 'Štýl',
            target                   : 'Cieľ odkazu',
            to                       : 'Do',
            toSide                   : 'Na stranu',
            type                     : 'Typ',
            units                    : 'Jednotky',
            unscheduled              : 'Neplánované',
            unspecifiedTimeIsWorking : 'Nešpecifikovaný čas je pracovný',
            version                  : 'Verzia'
        },
        intervals : {
            working    : 'Pracovný',
            nonWorking : 'Nepracovný',
            fromTo     : 'Od {from} do {to}',
            recurring  : 'Opakujúce sa začínajúce {start} končiace {end}'
        },
        addEntity         : 'Pridané {type} **{name}**',
        removeEntity      : 'Odstránené {type} **{name}**',
        updateEntity      : 'Zmenené {type} **{name}**',
        moveEntity        : 'Presunutú {type} **{name}** z {from} do {to}',
        addDependency     : 'Pridaný odkaz z **{from}** do **{to}**',
        removeDependency  : 'Odstránený odkaz z **{from}** do **{to}**',
        updateDependency  : 'Upravený odkaz z **{from}** do **{to}**',
        addAssignment     : 'Pridelený **{resource}** do **{event}**',
        removeAssignment  : 'Odstránené priradenie **{resource}** z **{event}**',
        updateAssignment  : 'Upravené priradenie **{resource}** do **{event}**',
        noChanges         : 'Bez zmeny',
        nullValue         : 'žiadne',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Uložené o {date}',
        autoSavedAt       : 'Automaticky uložené o {date}',
        undid             : 'Zrušené zmeny',
        redid             : 'Prerobené zmeny',
        editedTask        : 'Upravené vlastnosti úlohy',
        deletedTask       : 'Odstránené úlohy',
        movedTask         : 'Presunutá úloha',
        movedTasks        : 'Presunuté úlohy'
    }
};

export default LocaleHelper.publishLocale(locale);
