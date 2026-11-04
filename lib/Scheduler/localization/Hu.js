import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Hu.js';
import '../../Grid/localization/Hu.js';

const locale = {

    localeName : 'Hu',
    localeDesc : 'Magyar',
    localeCode : 'hu',
    localeRtl  : false,

    Object : {
        newEvent    : 'Új esemény',
        information : 'Információ',
        showDetails : 'Részletek megjelenítése'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' esemény'
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Kapcsolja be az erőforrás-elrendezés oszlopát. SPACE a helyi menühöz.'
    },

    Dependencies : {
        from    : 'Kezdete',
        to      : 'Vége',
        valid   : 'Érvényes',
        invalid : 'Érvénytelen'
    },

    DependencyType : {
        SS           : 'KK',
        SF           : 'KV',
        FS           : 'VK',
        FF           : 'VV',
        StartToStart : 'Kezdéstől a kezdésig',
        StartToEnd   : 'Kezdéstől a végéig',
        EndToStart   : 'Végétől a kezdésig',
        EndToEnd     : 'Végétől a végéig',
        short        : [
            'KK',
            'KV',
            'VK',
            'VV'
        ],
        long : [
            'Kezdéstől kezdésig',
            'Kezdéstől a végéig',
            'Végétől a kezdésig',
            'Végétől a végéig'
        ]
    },

    DependencyEdit : {
        From              : 'Kezdete',
        To                : 'Vége',
        Type              : 'Típus',
        Lag               : 'Késés',
        color             : 'Szín',
        lineStyle         : 'Vonalstílus',
        solid             : 'Folytonos',
        dashed            : 'Szaggatott',
        dotted            : 'Pontozott',
        dashDot           : 'Szaggatott-pontozott',
        longDash          : 'Hosszú szaggatott',
        'Edit dependency' : 'Függőség szerkesztése',
        Save              : 'Mentés',
        Delete            : 'Törlés',
        Cancel            : 'Mégse',
        StartToStart      : 'Kezdéstől a kezdésig',
        StartToEnd        : 'Kezdéstől a végéig',
        EndToStart        : 'Végétől a kezdésig',
        EndToEnd          : 'Végétől a végéig',
        Active            : 'Aktív'
    },

    EventEdit : {
        Name           : 'Név',
        Resource       : 'Erőforrás',
        Start          : 'Kezdés',
        startTime      : 'Kezdési idő',
        End            : 'Vége',
        endTime        : 'Befejezési idő',
        Save           : 'Mentés',
        Delete         : 'Törlés',
        Cancel         : 'Mégse',
        'Edit event'   : 'Esemény szerkesztése',
        Repeat         : 'Ismét',
        editRecurrence : 'Ismétlődés szerkesztése'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Az esemény átfedésben van az erőforrás eseményével',
        noDropOutsideTimeline   : 'Az esemény nem ejthető teljesen az idővonalon kívülre',
        duplicateAssignmentDrag : 'Az esemény nem rendelhető ugyanahhoz az erőforráshoz többször'
    },

    SchedulerBase : {
        'Add event'      : 'Esemény hozzáadása',
        'Delete event'   : 'Esemény törlése',
        'Unassign event' : 'Esemény hozzárendelésének törlése',
        color            : 'Szín',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, kezdődik ekkor: ${startDate} ${eventRecord.duration > 0 ? `időtartam: ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Nagyítás',
        activeDateRange : 'Dátumtartomány',
        startText       : 'Kezdő dátum',
        endText         : 'Befejező dátum',
        todayText       : 'Ma'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Időtengely ${startDate} - ${endDate} mutatja`
    },

    EventCopyPaste : {
        copyEvent  : 'Esemény másolása',
        cutEvent   : 'Esemény kivágása',
        pasteEvent : 'Esemény beillesztése'
    },

    EventFilter : {
        filterEvents : 'Események szűrése',
        byName       : 'Név szerint'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Jelenlegi idővonal megjelenítése'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Másodperc'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd MM. DD., H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd MM. DD.',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Nap'
        },
        day : {
            name : 'Nap/óra'
        },
        week : {
            name : 'Hét/óra'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Hét/nap'
        },
        dayAndMonth : {
            name : 'Hónap'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Hét'
        },
        weekAndMonth : {
            name : 'Hét'
        },
        weekAndDayLetter : {
            name : 'Hét/hétköznap'
        },
        weekDateAndMonth : {
            name : 'Hónap/hét'
        },
        monthAndYear : {
            name : 'Hónap'
        },
        year : {
            name : 'Év'
        },
        manyYears : {
            name : 'Több év'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Töröl egy eseményt',
        'delete-all-message'        : 'Törli az esemény minden előfordulását?',
        'delete-further-message'    : 'Szeretné törölni ezt és az esemény összes jövőbeli előfordulását, vagy csak a kiválasztott előfordulást?',
        'delete-only-this-message'  : 'Törölni szeretné ezt az esemény előfordulását?',
        'delete-further-btn-text'   : 'Minden jövőbeli esemény törlése',
        'delete-only-this-btn-text' : 'Csak ezt az eseményt törölje',
        'update-title'              : 'Egy ismétlődő eseményt módosít',
        'update-all-message'        : 'Módosítja az esemény minden előfordulását?',
        'update-further-message'    : 'Csak ezt az eseményt módosítja, vagy annak összes többi előfordulását is?',
        'update-only-this-message'  : 'Szeretné megváltoztatni ezt az esemény előfordulását?',
        'update-further-btn-text'   : 'Minden jövőbeli esemény',
        'update-only-this-btn-text' : 'Csak ez az esemény',
        Yes                         : 'Igen',
        Cancel                      : 'Mégse',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' és ',
        Daily                           : 'Naponta',
        'Weekly on {1}'                 : ({ days }) => `Hetente ${days}`,
        'Monthly on {1}'                : ({ days }) => `Havonta ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Évente, minden ${months}, ${days}`,
        'Every {0} days'                : ({ interval }) => `Minden ${interval}. napon`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Minden ${interval} . héten, ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Minden ${interval} . hónapban, ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Minden ${interval} . évben,  ${days} , ${months}`,
        position1                       : 'első',
        position2                       : 'második',
        position3                       : 'harmadik',
        position4                       : 'negyedik',
        position5                       : 'ötödik',
        'position-1'                    : 'utolsó',
        day                             : 'nap',
        weekday                         : 'hétköznap',
        'weekend day'                   : 'hétvége',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Esemény ismétlése',
        Cancel              : 'Mégse',
        Save                : 'Mentés',
        Frequency           : 'Gyakoriság',
        Every               : 'Minden',
        DAILYintervalUnit   : 'nap',
        WEEKLYintervalUnit  : 'hét',
        MONTHLYintervalUnit : 'hónap',
        YEARLYintervalUnit  : 'év',
        Each                : 'Mindegyik',
        on                  : 'Ekkor:',
        the                 : 'A(z)',
        'On the'            : 'Ekkor:',
        'End repeat'        : 'Ismétlés vége',
        'time(s)'           : 'alkalom',
        Days                : 'Napok',
        Months              : 'Hónapok'
    },

    RecurrenceDaysCombo : {
        day           : 'nap',
        weekday       : 'hétköznap',
        'weekend day' : 'hétvége'
    },

    RecurrencePositionsCombo : {
        position1    : 'első',
        position2    : 'második',
        position3    : 'harmadik',
        position4    : 'negyedik',
        position5    : 'ötödik',
        'position-1' : 'utolsó'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Soha',
        After     : 'Utána',
        'On date' : 'Aznap'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Nincs ismétlés',
        Daily   : 'Naponta',
        Weekly  : 'Hetente',
        Monthly : 'Havonta',
        Yearly  : 'Évente'
    },

    RecurrenceCombo : {
        None   : 'Nincs',
        Custom : 'Egyedi...'
    },

    Summary : {
        'Summary for' : date => `Összefoglaló, ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Teljes ütemterv',
        currentview  : 'Látható ütemterv',
        daterange    : 'Dátumtartomány',
        completedata : 'Teljes ütemterv (minden eseményhez)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Ütemezési tartomány',
        'Export from'    : 'Kezdete',
        'Export to'      : 'Vége'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Egyoldalas'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Egyoldalas (méretarány nélkül)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Több oldal (függőleges)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Nincs hozzárendelt erőforrás'
    },

    CrudManagerView : {
        serverResponseLabel : 'Szerverválasz:'
    },

    DurationColumn : {
        Duration : 'Időtartam'
    },

    EventClusteringBase : {
        unnamed         : 'Névtelen',
        more            : count => `+ további ${count}`,
        clusteredEvents : count => `${count} csoportosított esemény`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} csoportosított tartomány`
    },

    ConstraintTypePicker : {
        none                : 'Nincs',
        assoonaspossible    : 'Amint lehetséges',
        aslateaspossible    : 'Amennyire csak lehetséges',
        muststarton         : 'Muszáj elkezdődnie ekkor:',
        mustfinishon        : 'Muszáj befejeződnie ekkor:',
        startnoearlierthan  : 'Nem kezdődhet előbb mint',
        startnolaterthan    : 'Nem kezdődhet később mint',
        finishnoearlierthan : 'Nem érhet véget előbb mint',
        finishnolaterthan   : 'Nem érhet véget később mint'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} pufferidő az esemény előtt`;
            }
            if (postamble) {
                description += `.${postamble.toString()} pufferidő az esemény után`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Előre',
        Backward      : 'Hátra',
        inheritedFrom : 'Örökölt',
        enforcedBy    : 'Kényszerítve'
    },

    CalendarField : {
        'Default calendar' : 'Alapértelmezett naptár',
        editCalendar       : 'Naptár szerkesztése'
    },

    TaskEditorBase : {
        Information   : 'Feladat információ',
        Save          : 'Mentés',
        Cancel        : 'Mégse',
        Delete        : 'Törlés',
        calculateMask : 'Számítás...',
        saveError     : 'Nem menthető, előbb javítsa a hibákat',
        repeatingInfo : 'Ismétlődő esemény megjelenítése',
        editRepeating : 'Szerkesztés'
    },

    TaskEdit : {
        editEvent              : 'Esemény szerkesztése',
        ConfirmDeletionTitle   : 'Törlés jóváhagyása',
        ConfirmDeletionMessage : 'Biztosan törli az eseményt?'
    },

    GanttTaskEditor : {
        editorWidth : '45em'
    },

    SchedulerTaskEditor : {
        editorWidth : '36em'
    },

    SchedulerGeneralTab : {
        General      : 'Általános',
        Name         : 'Név',
        Resources    : 'Erőforrások',
        '% complete' : '% kész',
        Duration     : 'Időtartam',
        Start        : 'Kezdés',
        Finish       : 'Vége',
        Effort       : 'Effort',
        Preamble     : 'Bevezető',
        Postamble    : 'Lezárás'
    },

    GeneralTab : {
        General      : 'Általános',
        Name         : 'Név',
        '% complete' : '% kész',
        Duration     : 'Időtartam',
        Start        : 'Kezdés',
        Finish       : 'Vége',
        Effort       : 'Effort',
        Dates        : 'Dátumok'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Speciális',
        Calendar                   : 'Naptár',
        'Scheduling mode'          : 'Ütemezési mód',
        'Effort driven'            : 'Munkaalapú',
        'Manually scheduled'       : 'Manuálisan ütemezve',
        'Constraint type'          : 'Korlátozás típusa',
        'Constraint date'          : 'Korlátozás dátuma',
        Inactive                   : 'Inaktív',
        'Ignore resource calendar' : 'Erőforrásnaptár figyelmen kívül hagyása'
    },

    CalendarEditorDatePicker : {
        addException : 'Adjon hozzá kivételt',
        addWeek      : 'Adjon hozzá hetet'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Adjon hozzá kivételt',
        removeException : 'Távolítsa el a kivételt',
        noRows          : 'Nincs kivétel hozzáadva'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Adjon hozzá hetet',
        removeWeek : 'Távolítsa el a hetet'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'A napok alapértelmezés szerint működnek',
        workingTimeCalendar        : 'Munkaidő naptár',
        exceptions                 : 'Kivételek',
        general                    : 'Tábornok',
        name                       : 'Név',
        parent                     : 'Szülő',
        save                       : 'Megment',
        weeks                      : 'Hetek',
        error                      : 'Hiba',
        inputErrors                : 'Vannak bemeneti hibák. Kérjük, javítsa meg őket, mielőtt mentené a változtatásokat.',
        delete                     : 'Töröl',
        addCalendar                : 'Adjon hozzá egy naptárt',
        confirmation               : 'Megerősítés',
        removeCalendarWithChildren : 'A naptárban gyermeknaptárak vannak. Kattintson az "Igen" gombra a naptár gyermekeivel történő eltávolításához.',
        removeCalendarAndLinks     : 'A naptárt egyes rekordok használják. Kattintson az "Igen" gombra, hogy lekapcsolja őket és eltávolítsa a naptárt.',
        newException               : 'Új kivétel',
        newWeek                    : 'Új hét'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' működik',
        isNotWorking : ' nem működik',
        basedOn      : ' alapján:',
        byDefault    : 'alapértelmezés szerint',
        rangeTpl     : (start, end) => `${start} és ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Munkanap',
        nonWorkingDay : 'Nem dolgozó nap'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Vannak átfedő tartományok',
        errorMissingDate   : 'A kezdési és a befejezési idő szükséges',
        errorStartAfterEnd : 'A kezdési idő nem lehet a végső idő után'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Név',
        from                                 : 'Tól től',
        to                                   : 'Nak nek',
        is                                   : 'Az',
        nonWorking                           : 'Nem dolgozó',
        working                              : 'Dolgozó',
        hours                                : 'Órák',
        repeat                               : 'Ismétlés',
        repeatEnd                            : 'Ismételje meg a végét',
        errorMissingDate                     : 'Kivétel dátumtartományra van szükség',
        errorStartAfterEnd                   : '"From" date cannot be after the "To" date ',
        errorStartAndEndRepeatNumberMismatch : 'A kivételnek meg kell kezdődnie és véget kell érnie ugyanolyan számú alkalommal'
    },

    CalendarEditorWeekPanel : {
        name        : 'Név',
        from        : 'Tól től',
        to          : 'Nak nek',
        days        : 'Napok',
        copyDay     : 'Másolatnap',
        pasteDay    : 'Paszta napja',
        stopCopying : 'Hagyja abba a másolást'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Adjon hozzá tartományt',
        removeRange : 'Távolítsa el a tartományt'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"From" date cannot be after the "To" date ',
        errorNoDefaultWeek           : 'Hét konfigurációra van szükség',
        errorMultipleDefaultWeeks    : 'Egynél több alapértelmezett hét van megadva',
        errorNoWeekAvailability      : 'A hétnek biztosítania kell némi munkaidőt',
        errorInvalidWeekAvailability : 'A hétnek munkaidő -konfigurációs hibái vannak',
        noRows                       : 'Nincs hetek hozzáadva'
    },

    AdvancedTab : {
        Advanced                   : 'Speciális',
        Calendar                   : 'Naptár',
        'Scheduling mode'          : 'Ütemezési mód',
        'Effort driven'            : 'Munkaalapú',
        'Manually scheduled'       : 'Manuálisan ütemezve',
        'Constraint type'          : 'Korlátozás típusa',
        'Constraint date'          : 'Korlátozás dátuma',
        Constraint                 : 'Korlátozás',
        Rollup                     : 'Összesítés',
        Inactive                   : 'Inaktív',
        'Ignore resource calendar' : 'Erőforrásnaptár figyelmen kívül hagyása',
        'Scheduling direction'     : 'Menetrend iránya',
        projectBorder              : 'Projekt határ',
        ignore                     : 'Figyelmen kívül hagyni',
        honor                      : 'Becsület',
        askUser                    : 'Kérdezze meg a felhasználót'
    },

    DependencyTab : {
        Predecessors      : 'Elődök',
        Successors        : 'Utódok',
        ID                : 'Azonosító',
        Name              : 'Név',
        Type              : 'Típus',
        Lag               : 'Késés',
        cyclicDependency  : 'Ciklikus függőség',
        invalidDependency : 'Érvénytelen függőség',
        readOnlyTask      : 'Csak olvasható feladat nem kapcsolható össze'
    },

    NotesTab : {
        Notes : 'Jegyzetek'
    },

    ResourceCalendarColumn : {
        calendar : 'Naptár'
    },

    ResourceEdit : {
        editResource : 'Erőforrás szerkesztése'
    },

    ResourceEditor : {
        resourceInformation : 'Erőforrás információk',
        costs               : 'Költségek',
        save                : 'Megtakarítás',
        error               : 'Hiba',
        inputErrors         : 'Beviteli hibák vannak. Kérjük, javítsa ki őket a módosítások mentése előtt.',
        delete              : 'Töröl',
        confirmation        : 'Megerősítés',
        removeUsedResource  : 'Az erőforrás bizonyos feladatokhoz van hozzárendelve. Kattintson az „Igen” gombra az erőforrás eltávolításához.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Naptár',
        general     : 'Általános',
        label       : 'Anyagcímke',
        name        : 'Erőforrás neve',
        type        : 'Írja be',
        costAccrual : 'Költségfelhalmozás',
        labelHint   : 'például kg, tonna vagy doboz',
        maxUnits    : 'Maximális egységek'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Gyűjteni itt',
        prorated : 'Arányos',
        start    : 'Indul',
        end      : 'Vége'
    },

    CostAccrualField : {
        prorated : 'Arányos',
        start    : 'Indul',
        end      : 'Vége'
    },

    ResourceType : {
        work     : 'Munka',
        material : 'Anyag',
        cost     : 'Költség'
    },

    ResourceTypeColumn : {
        type : 'Írja be'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Árak táblázat',
        newGroup     : 'Új asztal',
        removeGroup  : 'Távolítsa el a táblázatot',
        useByDefault : 'Alapértelmezés szerint használja az erőforrás-hozzárendelésekhez',
        noRates      : 'Nincsenek tarifák'
    },

    ResourceGrid : {
        name          : 'Név',
        materialLabel : 'Anyagcímke',
        maxUnits      : 'Max egység',
        cost          : 'Költség',
        noRows        : 'Nincs erőforrás'
    },

    ResourceRateTableContainer : {
        startDate    : 'Kezdés dátuma',
        standardRate : 'Normál árfolyam',
        perUseCost   : 'Használatonkénti költség',
        addRate      : 'Adjon hozzá arányt',
        removeRate   : 'Arány eltávolítása',
        name         : 'Név',
        noRates      : 'Nincsenek tarifák'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Díjtáblázat információ'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Mennyiség',
        Resources   : 'Erőforrások',
        Resource    : 'Erőforrás',
        Units       : 'Egységek',
        cost        : 'Költség',
        effort      : 'Erőfeszítés',
        start       : 'Indul',
        finish      : 'Befejezés',
        preamble    : 'Bevezetés',
        postamble   : 'Utószó'
    },

    RateTableColumn : {
        rateTable : 'Árak táblázat'
    },

    RecurrenceTab : {
        title : 'Ismétlés'
    },

    SchedulingModePicker : {
        Normal           : 'Normál',
        'Fixed Duration' : 'Rögzített időtartam',
        'Fixed Units'    : 'Rögzített egységek',
        'Fixed Effort'   : 'Rögzített munka'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} / {available}</span> hozzárendelve',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} / {available}</span> > hozzárendelve',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} / {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} / {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : '{startDate} napon<br><span class="{cls}">{allocated} / {available}</span>hozzárendelve:<br>{assignments}',
        plusMore              : '+{value} további'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Erőfeszítés</div><div class="b-effort-value {cls}">{allocated} a {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Erőfeszítés</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Költség</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Mennyiség</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} ekkor: {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Összegzés {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Összegzés {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} további',
        nameColumnText        : 'Erőforrás / Esemény'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Törli a módosítást és nem tesz semmit',
        schedulingConflict : 'Ütemezési ütközés',
        emptyCalendar      : 'Naptárbeállítási hiba',
        cycle              : 'Ütemezési ciklus',
        Apply              : 'Alkalmazás'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Válasszon egy függőséget:',
        invalidDependencyLabel : 'Érvénytelen függőségek állnak fenn, amelyeket kezelni kell:'
    },

    SchedulerProBase : {
        propagating     : 'Projekt kiszámítása',
        storePopulation : 'Adatok betöltése',
        finalizing      : 'Eredmények véglegesítése'
    },

    EventSegments : {
        splitEvent    : 'Esemény megszakítása',
        renameSegment : 'Átnevezés'
    },

    NestedEvents : {
        createGroup         : 'Kijelölt események csoportosítása',
        newGroupName        : 'Új csoport',
        deNestingNotAllowed : 'A beágyazás bontása tilos',
        nestingNotAllowed   : 'A beágyazás tilos'
    },

    VersionGrid : {
        compare       : 'Összehasonlítás',
        description   : 'Leírás',
        occurredAt    : 'Bekövetkezett',
        rename        : 'Átnevezés',
        restore       : 'Visszaállítás',
        stopComparing : 'Összehasonlítás befejezése'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'feladat',
            AssignmentModel : 'hozzárendelés',
            DependencyModel : 'csatolás',
            ProjectModel    : 'projekt',
            ResourceModel   : 'erőforrás',
            other           : 'objektum'
        },
        entityNamesPlural : {
            TaskModel       : 'feladatok',
            AssignmentModel : 'hozzárendelések',
            DependencyModel : 'csatolások',
            ProjectModel    : 'projektek',
            ResourceModel   : 'erőforrások',
            other           : 'objektumok'
        },
        transactionDescriptions : {
            update : 'Lecserélt {n} {entities}',
            add    : 'Hozzáadott {n} {entities}',
            remove : 'Eltávolított {n} {entities}',
            move   : 'Áthelyezett {n} {entities}',
            mixed  : 'Lecserélt {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktív',
            allDay                   : 'Egész nap',
            allowOverlap             : 'Átfedés engedélyezése',
            barMargin                : 'Sáv margó',
            bidirectional            : 'Kétirányú',
            calendar                 : 'Naptár',
            cls                      : 'CSS osztály',
            constraintDate           : 'Korlátozás dátuma',
            constraintType           : 'Korlátozás típusa',
            daysPerMonth             : 'Napok havonta',
            daysPerWeek              : 'Napok hetente',
            delayFromParent          : 'Késleltetés a szülőtől',
            direction                : 'Irány',
            drawDependencies         : 'Függőségek rajzolása',
            duration                 : 'Időtartam',
            durationUnit             : 'Időtartam egység',
            effort                   : 'Erőfeszítés',
            effortDriven             : 'Erőfeszítés vezérelt',
            effortUnit               : 'Erőfeszítés egység',
            endDate                  : 'Befejezés dátuma',
            eventColor               : 'Szín',
            eventId                  : 'Eseményazonosító',
            eventLayout              : 'Esemény elrendezés',
            eventStyle               : 'Sáv stílus',
            exceptionDates           : 'Kivétel dátumok',
            fixed                    : 'Rögzített',
            from                     : 'Tól',
            fromSide                 : 'Oldalról',
            hoursPerDay              : 'Órák naponta',
            href                     : 'Hivatkozás',
            iconCls                  : 'Ikon',
            id                       : 'Azonosító',
            ignoreResourceCalendar   : 'Erőforrás naptár figyelmen kívül hagyása',
            ignoreTimeZone           : 'Időzóna figyelmen kívül hagyása',
            image                    : 'Kép',
            imageUrl                 : 'Kép URL',
            inactive                 : 'Inaktív',
            intervals                : 'Intervallumok',
            lag                      : 'Késés',
            lagUnit                  : 'Késés egység',
            lineStyle                : 'Vonal stílus',
            manuallyScheduled        : 'Kézzel ütemezett',
            milestoneWidth           : 'Mérföldkő szélesség',
            name                     : 'Név',
            note                     : 'Jegyzet',
            parentId                 : 'Szülőazonosító',
            parentIndex              : 'Pozíció',
            percentDone              : '% kész',
            postamble                : 'Utótag',
            preamble                 : 'Előtag',
            readOnly                 : 'Csak olvasható',
            recurrenceRule           : 'Ismétlődési szabály',
            resourceId               : 'Erőforrásazonosító',
            resourceMargin           : 'Erőforrás margó',
            rowHeight                : 'Sor magasság',
            schedulingMode           : 'Ütemezési mód',
            segments                 : 'Szegmensek',
            showAvatar               : 'Avatar megjelenítése',
            showInTimeline           : 'Megjelenítés az idővonalban',
            startDate                : 'Kezdés dátuma',
            stickyContents           : 'Ragasztott tartalom',
            strokeColor              : 'Vonal szín',
            style                    : 'Stílus',
            target                   : 'Hivatkozás célja',
            to                       : 'Ig',
            toSide                   : 'Oldalhoz',
            type                     : 'Típus',
            units                    : 'Egységek',
            unscheduled              : 'Ütemezetlen',
            unspecifiedTimeIsWorking : 'Nem meghatározott idő munkaidő',
            version                  : 'Verzió'
        },
        intervals : {
            working    : 'Működő',
            nonWorking : 'Nem működő',
            fromTo     : '{from} -tól {to} -ig',
            recurring  : 'Ismétlődő kezdés {start} befejezés {end}'
        },
        addEntity         : 'Hozzáadott {type} **{name}**',
        removeEntity      : 'Eltávolított {type} **{name}**',
        updateEntity      : 'Lecserélt {type} **{name}**',
        moveEntity        : 'Áthelyezett {type} **{name}** ettől {from} eddig {to}',
        addDependency     : 'Hozzáadott csatolás ettől **{from}** eddig **{to}**',
        removeDependency  : 'Eltávolított csatolás ettől **{from}** eddig **{to}**',
        updateDependency  : 'Szerkesztett csatolás ettől **{from}** eddig **{to}**',
        addAssignment     : 'Hozzárendelt **{resource}** a következőhöz **{event}**',
        removeAssignment  : 'Eltávolított hozzárendelés **{resource}** a következőtől **{event}**',
        updateAssignment  : 'Szerkesztett hozzárendelés **{resource}** a következőhöz **{event}**',
        noChanges         : 'Nincs módosítás',
        nullValue         : 'nincs',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Mentve ekkor: {date}',
        autoSavedAt       : 'Automatikusan mentve ekkor: {date}',
        undid             : 'Módosítások törlése',
        redid             : 'Módosítások visszaállítása',
        editedTask        : 'Szerkesztett feladatok tulajdonságai',
        deletedTask       : 'Törölt feladat',
        movedTask         : 'Áthelyezett feladat',
        movedTasks        : 'Áthelyezett feladatok'
    }
};

export default LocaleHelper.publishLocale(locale);
