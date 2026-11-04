import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Cs.js';
import '../../Grid/localization/Cs.js';

const locale = {

    localeName : 'Cs',
    localeDesc : 'Česky',
    localeCode : 'cs',
    localeRtl  : false,

    Object : {
        newEvent    : 'Nová událost',
        information : 'Informace',
        showDetails : 'Zobrazit podrobnosti'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' událost' + ({ 1 : '', 2 : 'i', 3 : 'i', 4 : 'i' }[data[data.length - 1]] || 'í')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Přepnout sloupec rozložení zdrojů. SPACE pro kontextovou nabídku.'
    },

    Dependencies : {
        from    : 'Od',
        to      : 'Do',
        valid   : 'Platný',
        invalid : 'Neplatný'
    },

    DependencyType : {
        SS           : 'ZZ',
        SF           : 'ZK',
        FS           : 'KZ',
        FF           : 'KK',
        StartToStart : 'Začátek-Začátek',
        StartToEnd   : 'Začátek-Konec',
        EndToStart   : 'Konec-Začátek',
        EndToEnd     : 'Konec-Konec',
        short        : [
            'ZZ',
            'ZK',
            'KZ',
            'KK'
        ],
        long : [
            'Začátek-Začátek',
            'Začátek-Konec',
            'Konec-Začátek',
            'Konec-Konec'
        ]
    },

    DependencyEdit : {
        From              : 'Od',
        To                : 'Do',
        Type              : 'Typ',
        Lag               : 'Prodleva',
        color             : 'Barva',
        lineStyle         : 'Styl čáry',
        solid             : 'Plná',
        dashed            : 'Čárkovaná',
        dotted            : 'Tečkovaná',
        dashDot           : 'Čárka-tečka',
        longDash          : 'Dlouhá čárka',
        'Edit dependency' : 'Upravit závislost',
        Save              : 'Uložit',
        Delete            : 'Smazat',
        Cancel            : 'Zrušit',
        StartToStart      : 'Začátek-Začátek',
        StartToEnd        : 'Začátek-Konec',
        EndToStart        : 'Konec-Začátek',
        EndToEnd          : 'Konec-Konec',
        Active            : 'Aktivní'
    },

    EventEdit : {
        Name           : 'Název',
        Resource       : 'Zdroj',
        Start          : 'Začátek',
        startTime      : 'Čas začátku',
        End            : 'Konec',
        endTime        : 'Čas konce',
        Save           : 'Uložit',
        Delete         : 'Smazat',
        Cancel         : 'Zrušit',
        'Edit event'   : 'Upravit událost',
        Repeat         : 'Opakovat',
        editRecurrence : 'Upravit opakování'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Překrytí stávajících událostí pro tento zdroj',
        noDropOutsideTimeline   : 'Událost nelze přesunout zcela mimo časovou osu',
        duplicateAssignmentDrag : 'Událost nelze přiřadit stejnému zdroji vícekrát'
    },

    SchedulerBase : {
        'Add event'      : 'Přidat událost',
        'Delete event'   : 'Vymazat událost',
        'Unassign event' : 'Zrušit přidělení události',
        color            : 'Barva',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, začíná v ${startDate} ${eventRecord.duration > 0 ? `na ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zoom',
        activeDateRange : 'Rozsah dat',
        startText       : 'Datum začátku',
        endText         : 'Datum konce',
        todayText       : 'Dnes'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Časová osa zobrazující od ${startDate} do ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Kopírovat událost',
        cutEvent   : 'Vyjmout událost',
        pasteEvent : 'Vložit událost'
    },

    EventFilter : {
        filterEvents : 'Filtrovat úkoly',
        byName       : 'Podle názvu'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Zobrazit aktuální časovou osu'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Sekundy'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd D. M., H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd D. M.',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Den'
        },
        day : {
            name : 'Den/hodiny'
        },
        week : {
            name : 'Týden/hodiny'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Týden/dny'
        },
        dayAndMonth : {
            name : 'Měsíc'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Týden'
        },
        weekAndMonth : {
            name : 'Týdny'
        },
        weekAndDayLetter : {
            name : 'Týdny/pracovní dny'
        },
        weekDateAndMonth : {
            name : 'Měsíce/týdny'
        },
        monthAndYear : {
            name : 'Měsíce'
        },
        year : {
            name : 'Roky'
        },
        manyYears : {
            name : 'Několik let'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Mažete událost',
        'delete-all-message'        : 'Chcete vymazat všechny výskyty této události?',
        'delete-further-message'    : 'Chcete vymazat tuto a všechny budoucí výskyty této události nebo pouze vybraný výskyt?',
        'delete-only-this-message'  : 'Chcete smazat tento výskyt této události?',
        'delete-further-btn-text'   : 'Vymazat všechny budoucí události',
        'delete-only-this-btn-text' : 'Vymazat jen tuto událost',
        'update-title'              : 'Měníte opakující se událost',
        'update-all-message'        : 'Chcete změnit všechny výskyty této události?',
        'update-further-message'    : 'Chcete změnit pouze tento výskyt události nebo tento a všechny budoucí výskyty?',
        'update-only-this-message'  : 'Chcete změnit tento výskyt této události?',
        'update-further-btn-text'   : 'Všechny budoucí události',
        'update-only-this-btn-text' : 'Pouze tuto událost',
        Yes                         : 'Ano',
        Cancel                      : 'Zrušit',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' a ',
        Daily                           : 'Denně',
        'Weekly on {1}'                 : ({ days }) => `Týdně v ${days}`,
        'Monthly on {1}'                : ({ days }) => `Měsíčně v ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Ročně dne  ${days}. ${months}.`,
        'Every {0} days'                : ({ interval }) => `Každých ${interval} dnů`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Každých ${interval} týdn v ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Každé ${interval} měsíce v ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Každé ${interval} roky v ${days} ${months}`,
        position1                       : 'první',
        position2                       : 'druhý',
        position3                       : 'třetí',
        position4                       : 'čtvrtý',
        position5                       : 'pátý',
        'position-1'                    : 'poslední',
        day                             : 'den',
        weekday                         : 'pracovní den',
        'weekend day'                   : 'víkendový den',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Opakovat událost',
        Cancel              : 'Zrušit',
        Save                : 'Uložit',
        Frequency           : 'Frekvence',
        Every               : 'Každý',
        DAILYintervalUnit   : 'den (dny) ',
        WEEKLYintervalUnit  : 'týden (týdny)',
        MONTHLYintervalUnit : 'měsíc (měsíce) ',
        YEARLYintervalUnit  : 'rok (roky)',
        Each                : 'Každý',
        on                  : 'v určený den',
        the                 : 'v',
        'On the'            : 'Dne',
        'End repeat'        : 'Ukončit opakování',
        'time(s)'           : 'krát',
        Days                : 'Dny',
        Months              : 'Měsíce'
    },

    RecurrenceDaysCombo : {
        day           : 'den',
        weekday       : 'pracovní den',
        'weekend day' : 'víkendový den'
    },

    RecurrencePositionsCombo : {
        position1    : 'první',
        position2    : 'druhý',
        position3    : 'třetí',
        position4    : 'čtvrtý',
        position5    : 'pátý',
        'position-1' : 'poslední'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Nikdy',
        After     : 'Po',
        'On date' : 'Dne'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Bez opakování',
        Daily   : 'Denně',
        Weekly  : 'Týdně',
        Monthly : 'Měsíčně',
        Yearly  : 'Ročně'
    },

    RecurrenceCombo : {
        None   : 'Žádný',
        Custom : 'Vlastní...'
    },

    Summary : {
        'Summary for' : date => `Shrnutí pro ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Celý harmonogram',
        currentview  : 'Viditelný harmonogram',
        daterange    : 'Rozsah dat',
        completedata : 'Dokončit harmonogram (pro všechny události)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Rozsah harmonogramu',
        'Export from'    : 'Od',
        'Export to'      : 'Do'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Jedna stránka'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Jedna stránka (nezměněná velikost)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Více stránek (svisle)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Žádný přiřazený zdroj'
    },

    CrudManagerView : {
        serverResponseLabel : 'Odezva serveru:'
    },

    DurationColumn : {
        Duration : 'Doba trvání'
    },

    EventClusteringBase : {
        unnamed         : 'Nepojmenované',
        more            : count => `+ dalších ${count}`,
        clusteredEvents : count => `Seskupené události: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Seskupené rozsahy: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Žádný',
        assoonaspossible    : 'Co nejdříve',
        aslateaspossible    : 'Až později',
        muststarton         : 'Musí začít',
        mustfinishon        : 'Musí skončit',
        startnoearlierthan  : 'Nespouštět dříve než',
        startnolaterthan    : 'Nespouštět později než',
        finishnoearlierthan : 'Nedokončovat dříve než',
        finishnolaterthan   : 'Nedokončovat později než'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} časová rezerva před událostí`;
            }
            if (postamble) {
                description += `.${postamble.toString()} časová rezerva po události`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Vpřed',
        Backward      : 'Zpět',
        inheritedFrom : 'Děděno od',
        enforcedBy    : 'Vynuceno od'
    },

    CalendarField : {
        'Default calendar' : 'Výchozí kalendář',
        editCalendar       : 'Upravit kalendář'
    },

    TaskEditorBase : {
        Information   : 'Informace o úkolu',
        Save          : 'Uložit',
        Cancel        : 'Zrušit',
        Delete        : 'Vymazat',
        calculateMask : 'Výpočet...',
        saveError     : 'Nelze uložit. Nejprve prosím opravte chyby',
        repeatingInfo : 'Zobrazení opakující se události',
        editRepeating : 'Upravit'
    },

    TaskEdit : {
        editEvent              : 'Upravit událost',
        ConfirmDeletionTitle   : 'Potvrdit výmaz',
        ConfirmDeletionMessage : 'Opravdu chcete událost vymazat?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '34em'
    },

    SchedulerGeneralTab : {
        General      : 'Obecné',
        Name         : 'Název',
        Resources    : 'Zdroje',
        '% complete' : '% hotovo',
        Duration     : 'Doba trvání',
        Start        : 'Začátek',
        Finish       : 'Konec',
        Effort       : 'Úsilí',
        Preamble     : 'Preambule',
        Postamble    : 'Postambule'
    },

    GeneralTab : {
        General      : 'Obecné',
        Name         : 'Název',
        '% complete' : '% hotovo',
        Duration     : 'Doba trvání',
        Start        : 'Začátek',
        Finish       : 'Konec',
        Effort       : 'Úsilí',
        Dates        : 'Data'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Pokročilý',
        Calendar                   : 'Kalendář',
        'Scheduling mode'          : 'Režim plánování',
        'Effort driven'            : 'Řízený úsilím',
        'Manually scheduled'       : 'Manuálně naplánováno',
        'Constraint type'          : 'Typ překážky',
        'Constraint date'          : 'Datum překážky',
        Inactive                   : 'Neaktivní',
        'Ignore resource calendar' : 'Ignorovat zdrojový kalendář'
    },

    CalendarEditorDatePicker : {
        addException : 'Přidat výjimku',
        addWeek      : 'Přidejte týden'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Přidat výjimku',
        removeException : 'Odebrat výjimku',
        noRows          : 'Přidány žádné výjimky'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Přidejte týden',
        removeWeek : 'Odstraňte týden'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Ve výchozím nastavení dny fungují',
        workingTimeCalendar        : 'Kalendář pracovní doby',
        exceptions                 : 'Výjimky',
        general                    : 'Všeobecné',
        name                       : 'název',
        parent                     : 'Rodič',
        save                       : 'Uložit',
        weeks                      : 'Týdny',
        error                      : 'Chyba',
        inputErrors                : 'Existují chyby vstupu. Před uložením změn je prosím opravte.',
        delete                     : 'Vymazat',
        addCalendar                : 'Přidejte kalendář',
        confirmation               : 'potvrzení',
        removeCalendarWithChildren : 'Kalendář má dětské kalendáře. Kliknutím na „Ano“ odstraníte kalendář se svými dětmi.',
        removeCalendarAndLinks     : 'Kalendář je používán některými záznamy. Kliknutím na „Ano“ je odpojte a odstraníte kalendář.',
        newException               : 'Nová výjimka',
        newWeek                    : 'Nový týden'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' pracuje',
        isNotWorking : ' nefunguje',
        basedOn      : ' na základě:',
        byDefault    : 've výchozím stavu',
        rangeTpl     : (start, end) => `${start} až ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Pracovní den',
        nonWorkingDay : 'Nepracovní den'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Existují překrývající se rozsahy',
        errorMissingDate   : 'Je vyžadován čas zahájení a ukončení',
        errorStartAfterEnd : 'Čas začátku nemůže být po skončení'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'název',
        from                                 : 'Z',
        to                                   : 'Na',
        is                                   : 'Je',
        nonWorking                           : 'Nefunguje',
        working                              : 'Pracovní',
        hours                                : 'Hodiny',
        repeat                               : 'Opakovat',
        repeatEnd                            : 'Opakujte konec',
        errorMissingDate                     : 'Je vyžadován rozsah datum výjimky',
        errorStartAfterEnd                   : '„Od“ data nemůže být po datu „do“ ',
        errorStartAndEndRepeatNumberMismatch : 'Výjimka by měla začít a ukončit stejný počet'
    },

    CalendarEditorWeekPanel : {
        name        : 'název',
        from        : 'Z',
        to          : 'Na',
        days        : 'Dny',
        copyDay     : 'Kopírovat den',
        pasteDay    : 'Vložit den',
        stopCopying : 'Přestaňte kopírovat'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Přidat řadu',
        removeRange : 'Odstraňte rozsah'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '„Od“ data nemůže být po datu „do“ ',
        errorNoDefaultWeek           : 'Je vyžadována týdenní konfigurace',
        errorMultipleDefaultWeeks    : 'Je specifikováno více než jeden výchozí týden',
        errorNoWeekAvailability      : 'Týden musí poskytnout nějakou pracovní dobu',
        errorInvalidWeekAvailability : 'Týden má chyby konfigurace pracovní doby',
        noRows                       : 'Žádné týdny přidané'
    },

    AdvancedTab : {
        Advanced                   : 'Pokročilý',
        Calendar                   : 'Kalendář',
        'Scheduling mode'          : 'Režim plánování',
        'Effort driven'            : 'Řízený úsilím',
        'Manually scheduled'       : 'Manuálně naplánovaný',
        'Constraint type'          : 'Typ překážky',
        'Constraint date'          : 'Datum překážky',
        Constraint                 : 'Překážka',
        Rollup                     : 'Shrnout',
        Inactive                   : 'Neaktivní',
        'Ignore resource calendar' : 'Ignorovat zdrojový kalendář',
        'Scheduling direction'     : 'Směr plánování',
        projectBorder              : 'Hranice projektu',
        ignore                     : 'Ignorovat',
        honor                      : 'Čest',
        askUser                    : 'Zeptejte se uživatele'
    },

    DependencyTab : {
        Predecessors      : 'Předchůdci',
        Successors        : 'Následovníci',
        ID                : 'ID',
        Name              : 'Název',
        Type              : 'Typ',
        Lag               : 'Prodlení ',
        cyclicDependency  : 'Cyklická závislost',
        invalidDependency : 'Neplatná závislost',
        readOnlyTask      : 'Úlohu jen pro čtení nelze propojit'
    },

    NotesTab : {
        Notes : 'Poznámky'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalendář'
    },

    ResourceEdit : {
        editResource : 'Upravit zdroj'
    },

    ResourceEditor : {
        resourceInformation : 'Informace o zdrojích',
        costs               : 'Náklady',
        save                : 'Uložit',
        error               : 'Chyba',
        inputErrors         : 'Jsou tam chyby zadávání. Před uložením změn je prosím opravte.',
        delete              : 'Vymazat',
        confirmation        : 'Potvrzení',
        removeUsedResource  : 'Zdroj je přiřazen k některým úkolům. Chcete-li zdroj přesto odebrat, klikněte na „Ano“.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalendář',
        general     : 'Generál',
        label       : 'Materiál štítek',
        name        : 'Název zdroje',
        type        : 'Typ',
        costAccrual : 'Časové rozlišení nákladů',
        labelHint   : 'například kg, tuny nebo krabice',
        maxUnits    : 'Maximální jednotky'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Narůstat v',
        prorated : 'Poměrně',
        start    : 'Start',
        end      : 'Konec'
    },

    CostAccrualField : {
        prorated : 'Poměrně',
        start    : 'Start',
        end      : 'Konec'
    },

    ResourceType : {
        work     : 'Práce',
        material : 'Materiál',
        cost     : 'Náklady'
    },

    ResourceTypeColumn : {
        type : 'Typ'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Tabulka sazeb',
        newGroup     : 'Nový stůl',
        removeGroup  : 'Odstraňte stůl',
        useByDefault : 'Použít jako výchozí pro přiřazení zdrojů',
        noRates      : 'Žádné sazby'
    },

    ResourceGrid : {
        name          : 'Jméno',
        materialLabel : 'Materiál štítek',
        maxUnits      : 'Max jednotek',
        cost          : 'Náklady',
        noRows        : 'Žádné zdroje'
    },

    ResourceRateTableContainer : {
        startDate    : 'Datum zahájení',
        standardRate : 'Standardní sazba',
        perUseCost   : 'Cena za použití',
        addRate      : 'Přidat sazbu',
        removeRate   : 'Odebrat sazbu',
        name         : 'Jméno',
        noRates      : 'Žádné sazby'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Informace o tabulce sazeb'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Množství',
        Resources   : 'Zdroje',
        Resource    : 'Zdroje',
        Units       : 'Jednotky',
        cost        : 'Náklady',
        effort      : 'Úsilí',
        start       : 'Start',
        finish      : 'Dokončit',
        preamble    : 'Preambule',
        postamble   : 'Postambule'
    },

    RateTableColumn : {
        rateTable : 'Tabulka sazeb'
    },

    RecurrenceTab : {
        title : 'Opakovat'
    },

    SchedulingModePicker : {
        Normal           : 'Normální',
        'Fixed Duration' : 'Fixní doba trvání',
        'Fixed Units'    : 'Fixní jednotky',
        'Fixed Effort'   : 'Fixní úsilí'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} z {available}</span> přiděleno',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} z {available}</span> přiděleno',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} z {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} z {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'Dne {startDate}<br><span class="{cls}">{allocated} z {available}</span> přiděleno:<br>{assignments}',
        plusMore              : '+{value} více'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Úsilí</div><div class="b-effort-value {cls}">{allocated} z {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Úsilí</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Náklady</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Množství</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} dne {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Souhrn pro {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Souhrn pro {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} více',
        nameColumnText        : 'Zdroj / Událost'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Zrušit změnu a nic nedělat',
        schedulingConflict : 'Konflikt plánování',
        emptyCalendar      : 'Chyba konfigurace kalendáře',
        cycle              : 'Cyklus plánování',
        Apply              : 'Použít'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Vyberte závislost, prosím:',
        invalidDependencyLabel : 'Jsou zde neplatné závislosti, které je třeba vyřešit:'
    },

    SchedulerProBase : {
        propagating     : 'Výpočet projektu',
        storePopulation : 'Načítání dat',
        finalizing      : 'Dokončování výsledků'
    },

    EventSegments : {
        splitEvent    : 'Rozdělit událost',
        renameSegment : 'Přejmenovat'
    },

    NestedEvents : {
        createGroup         : 'Seskupit vybrané události',
        newGroupName        : 'Nová skupina',
        deNestingNotAllowed : 'Odstranění vnoření není povoleno',
        nestingNotAllowed   : 'Vnoření není povoleno'
    },

    VersionGrid : {
        compare       : 'Porovnat',
        description   : 'Popis',
        occurredAt    : 'Stalo se v',
        rename        : 'Přejmenovat',
        restore       : 'Obnovit',
        stopComparing : 'Zastavit porovnávání'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'úkol',
            AssignmentModel : 'pověření',
            DependencyModel : 'odkaz',
            ProjectModel    : 'projekt',
            ResourceModel   : 'zdroj',
            other           : 'objekt'
        },
        entityNamesPlural : {
            TaskModel       : 'úkoly',
            AssignmentModel : 'přiřazení',
            DependencyModel : 'odkazy',
            ProjectModel    : 'projekty',
            ResourceModel   : 'zdroje',
            other           : 'objekty'
        },
        transactionDescriptions : {
            update : 'Změna {n} {entities}',
            add    : 'Přidáno {n} {entities}',
            remove : 'Odebráno {n} {entities}',
            move   : 'Přesunuto {n} {entities}',
            mixed  : 'Změna {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktivní',
            allDay                   : 'Celý den',
            allowOverlap             : 'Povolit překrytí',
            barMargin                : 'Okraj pruhu',
            bidirectional            : 'Obousměrný',
            calendar                 : 'Kalendář',
            cls                      : 'CSS třída',
            constraintDate           : 'Datum omezení',
            constraintType           : 'Typ omezení',
            daysPerMonth             : 'Dny za měsíc',
            daysPerWeek              : 'Dny za týden',
            delayFromParent          : 'Zpoždění od rodiče',
            direction                : 'Směr',
            drawDependencies         : 'Kreslit závislosti',
            duration                 : 'Doba trvání',
            durationUnit             : 'Jednotka trvání',
            effort                   : 'Úsilí',
            effortDriven             : 'Řízeno úsilím',
            effortUnit               : 'Jednotka úsilí',
            endDate                  : 'Datum ukončení',
            eventColor               : 'Barva',
            eventId                  : 'ID události',
            eventLayout              : 'Rozvržení události',
            eventStyle               : 'Styl pruhu',
            exceptionDates           : 'Výjimky dat',
            fixed                    : 'Pevný',
            from                     : 'Od',
            fromSide                 : 'Z boku',
            hoursPerDay              : 'Hodiny za den',
            href                     : 'Odkaz',
            iconCls                  : 'Ikona',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignorovat kalendář zdrojů',
            ignoreTimeZone           : 'Ignorovat časové pásmo',
            image                    : 'Obrázek',
            imageUrl                 : 'URL obrázku',
            inactive                 : 'Neaktivní',
            intervals                : 'Intervaly',
            lag                      : 'Zpoždění',
            lagUnit                  : 'Jednotka zpoždění',
            lineStyle                : 'Styl čáry',
            manuallyScheduled        : 'Manuálně naplánováno',
            milestoneWidth           : 'Šířka milníku',
            name                     : 'Název',
            note                     : 'Poznámka',
            parentId                 : 'ID nadřazeného objektu',
            parentIndex              : 'Pozice',
            percentDone              : '% hotovo',
            postamble                : 'Postskriptum',
            preamble                 : 'Předmluva',
            readOnly                 : 'Pouze pro čtení',
            recurrenceRule           : 'Pravidlo opakování',
            resourceId               : 'ID zdroje',
            resourceMargin           : 'Okraj zdroje',
            rowHeight                : 'Výška řádku',
            schedulingMode           : 'Režim plánování',
            segments                 : 'Segmenty',
            showAvatar               : 'Zobrazit avatar',
            showInTimeline           : 'Zobrazit na časové ose',
            startDate                : 'Datum zahájení',
            stickyContents           : 'Přilnavý obsah',
            strokeColor              : 'Barva čáry',
            style                    : 'Styl',
            target                   : 'Cílový odkaz',
            to                       : 'Do',
            toSide                   : 'Na boku',
            type                     : 'Typ',
            units                    : 'Jednotky',
            unscheduled              : 'Neplánováno',
            unspecifiedTimeIsWorking : 'Nespecifikovaný čas je pracovní',
            version                  : 'Verze'
        },
        intervals : {
            working    : 'Pracovní',
            nonWorking : 'Nepracovní',
            fromTo     : 'Od {from} do {to}',
            recurring  : 'Opakující se začínající {start} končící {end}'
        },
        addEntity         : 'Přidán {type} **{name}**',
        removeEntity      : 'Odebrán {type} **{name}**',
        updateEntity      : 'Změněn {type} **{name}**',
        moveEntity        : 'Přesunut {type} **{name}** z {from} do {to}',
        addDependency     : 'Přidán odkaz z **{from}** do **{to}**',
        removeDependency  : 'Odebrán odkaz z **{from}** do **{to}**',
        updateDependency  : 'Upraven odkaz z **{from}** do **{to}**',
        addAssignment     : 'Přiřazen **{resource}** do **{event}**',
        removeAssignment  : 'Odebráno přiřazení **{resource}** z **{event}**',
        updateAssignment  : 'Upraveno přiřazení **{resource}** do **{event}**',
        noChanges         : 'Beze změn',
        nullValue         : 'žádný',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Uloženo v {date}',
        autoSavedAt       : 'Automaticky uloženo v {date}',
        undid             : 'Zrušit změny',
        redid             : 'Opakovat změny',
        editedTask        : 'Upravené vlastnosti úlohy',
        deletedTask       : 'Smazaná úloha',
        movedTask         : 'Přesunutá úloha',
        movedTasks        : 'Přesunuté úlohy'
    }
};

export default LocaleHelper.publishLocale(locale);
