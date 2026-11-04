import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Sl.js';
import '../../Grid/localization/Sl.js';

const locale = {

    localeName : 'Sl',
    localeDesc : 'Slovensko',
    localeCode : 'sl',
    localeRtl  : false,

    Object : {
        newEvent    : 'Nov dogodek',
        information : 'Informacija',
        showDetails : 'Pokaži podrobnosti'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' dogod' + (data !== 1 ? 'ke' : 'ek')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Preklopi stolpec postavitve virov. SPACE za kontekstni meni.'
    },

    Dependencies : {
        from    : 'Od',
        to      : 'Do',
        valid   : 'Veljavno',
        invalid : 'Neveljavno'
    },

    DependencyType : {
        SS           : 'ZZ',
        SF           : 'ZK',
        FS           : 'KZ',
        FF           : 'KK',
        StartToStart : 'Od začetka do začetka',
        StartToEnd   : 'Od začetka do konca',
        EndToStart   : 'Od konca do začetka',
        EndToEnd     : 'Od konca do konca',
        short        : [
            'ZZ',
            'ZK',
            'KZ',
            'KK'
        ],
        long : [
            'Od začetka do začetka',
            'Od začetka do konca',
            'Od konca do začetka',
            'Od konca do konca'
        ]
    },

    DependencyEdit : {
        From              : 'Od',
        To                : 'Do',
        Type              : 'Vrsta',
        Lag               : 'Zaostajanje',
        color             : 'Barva',
        lineStyle         : 'Slog črte',
        solid             : 'Polna',
        dashed            : 'Črtkana',
        dotted            : 'Pikčasta',
        dashDot           : 'Črta pika',
        longDash          : 'Dolga črta',
        'Edit dependency' : 'Uredi odvisnost',
        Save              : 'Shrani',
        Delete            : 'Izbriši',
        Cancel            : 'Prekliči',
        StartToStart      : 'Od začetka do začetka',
        StartToEnd        : 'Od začetka do konca',
        EndToStart        : 'Od konca do začetka',
        EndToEnd          : 'Od konca do konca',
        Active            : 'Aktivno'
    },

    EventEdit : {
        Name           : 'Ime',
        Resource       : 'Vir',
        Start          : 'Začetek',
        startTime      : 'Začetni čas',
        End            : 'Konec',
        endTime        : 'Končni čas',
        Save           : 'Shrani',
        Delete         : 'Izbriši',
        Cancel         : 'Prekliči',
        'Edit event'   : 'Uredi dogodek',
        Repeat         : 'Ponovi',
        editRecurrence : 'Uredi ponavljanje'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Dogodek prekriva obstoječi dogodek za ta vir',
        noDropOutsideTimeline   : 'Dogodek ne sme biti popolnoma izpuščen izven časovnice',
        duplicateAssignmentDrag : 'Dogodka ni mogoče dodeliti istemu viru večkrat'
    },

    SchedulerBase : {
        'Add event'      : 'Dodaj dogodek',
        'Delete event'   : 'Izbriši dogodek',
        'Unassign event' : 'Prekliči dodelitev dogodka',
        color            : 'Barva',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, začne ob ${startDate} ${eventRecord.duration > 0 ? `na ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Povečaj',
        activeDateRange : 'Datumski obseg',
        startText       : 'Začetni datum',
        endText         : 'Končni datum',
        todayText       : 'Danes'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Časovna os prikazuje od ${startDate} do ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Kopiraj dogodek',
        cutEvent   : 'Izreži dogodek',
        pasteEvent : 'Prilepi dogodek'
    },

    EventFilter : {
        filterEvents : 'Filtriraj opravila',
        byName       : 'Po imenu'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Pokaži trenutno časovnico'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Sekunde'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd MM/DD, hA',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd MM/DD',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Dan'
        },
        day : {
            name : 'Dan/ure'
        },
        week : {
            name : 'Teden/ure'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Teden/dnevi'
        },
        dayAndMonth : {
            name : 'Mesec'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Teden'
        },
        weekAndMonth : {
            name : 'Tedni'
        },
        weekAndDayLetter : {
            name : 'Tedni/delavniki'
        },
        weekDateAndMonth : {
            name : 'Meseci/tedni'
        },
        monthAndYear : {
            name : 'Meseci'
        },
        year : {
            name : 'Leta'
        },
        manyYears : {
            name : 'Več let'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Brišete dogodek',
        'delete-all-message'        : 'Želite izbrisati vse pojavitve tega dogodka?',
        'delete-further-message'    : 'Želite izbrisati to in vse prihodnje pojavitve tega dogodka ali samo trenutno pojavitev?',
        'delete-only-this-message'  : 'Ali želite izbrisati to pojavljanje tega dogodka?',
        'delete-further-btn-text'   : 'Izbriši vse prihodnje dogodke',
        'delete-only-this-btn-text' : 'Izbriši samo ta dogodek',
        'update-title'              : 'Spreminjate ponavljajoči se dogodek',
        'update-all-message'        : 'Želite spremeniti vse pojavitve tega dogodka?',
        'update-further-message'    : 'Želite spremeniti samo to pojavitev dogodka ali to in vse prihodnje pojavitve?',
        'update-only-this-message'  : 'Ali želite spremeniti to pojavljanje tega dogodka?',
        'update-further-btn-text'   : 'Vsi prihodnji dogodki',
        'update-only-this-btn-text' : 'Samo ta dogodek',
        Yes                         : 'Da',
        Cancel                      : 'Prekliči',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' in ',
        Daily                           : 'Dnevno',
        'Weekly on {1}'                 : ({ days }) => ` Tedensko ob ${days}`,
        'Monthly on {1}'                : ({ days }) => `Mesečno ob ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Letno ob ${days} v mesecu  ${months}`,
        'Every {0} days'                : ({ interval }) => `Vsakih ${interval} dni`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => ` Vsakih ${interval} tednov ob ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => ` Vsakih ${interval} mesecev ob ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => ` Vsakih ${interval} let ob ${days} v mesecu ${months}`,
        position1                       : 'prvi',
        position2                       : 'drugi',
        position3                       : 'tretji',
        position4                       : 'četrti',
        position5                       : 'peti',
        'position-1'                    : 'zadnji',
        day                             : 'dan',
        weekday                         : 'delovni dan',
        'weekend day'                   : 'dan za vikend',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Ponovi dogodek',
        Cancel              : 'Prekliči',
        Save                : 'Shrani',
        Frequency           : 'Pogostost',
        Every               : 'Vsak',
        DAILYintervalUnit   : 'dan',
        WEEKLYintervalUnit  : 'teden',
        MONTHLYintervalUnit : 'mesec',
        YEARLYintervalUnit  : 'leto',
        Each                : 'Vsak',
        on                  : 'Dne',
        the                 : 'Na',
        'On the'            : 'Na',
        'End repeat'        : 'Končaj ponavljanje',
        'time(s)'           : 'krat',
        Days                : 'Dnevi',
        Months              : 'Meseci'
    },

    RecurrenceDaysCombo : {
        day           : 'dan',
        weekday       : 'delovni dan',
        'weekend day' : 'dan za vikend'
    },

    RecurrencePositionsCombo : {
        position1    : 'prvi',
        position2    : 'drugi',
        position3    : 'tretji',
        position4    : 'četrti',
        position5    : 'peti',
        'position-1' : 'zadnji'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Nikoli',
        After     : 'Po',
        'On date' : 'Na datum'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Brez ponavljanja',
        Daily   : 'Dnevno',
        Weekly  : 'Tedensko',
        Monthly : 'Mesečno',
        Yearly  : 'Letno'
    },

    RecurrenceCombo : {
        None   : 'Brez',
        Custom : 'Po meri...'
    },

    Summary : {
        'Summary for' : date => ` Povzetek za ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Celoten urnik',
        currentview  : 'Viden urnik',
        daterange    : 'Datumski obseg',
        completedata : 'Celoten urnik (za vse dogodke)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Obseg urnika',
        'Export from'    : 'Od',
        'Export to'      : 'Do'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Enostranska stran'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Enostranska stran (neprilagojena)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Več strani (navpično)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Ni dodeljenega vira'
    },

    CrudManagerView : {
        serverResponseLabel : 'Odziv strežnika:'
    },

    DurationColumn : {
        Duration : 'Trajanje'
    },

    EventClusteringBase : {
        unnamed         : 'Neimenovano',
        more            : count => `+ še ${count}`,
        clusteredEvents : count => `Združeni dogodki: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Združeni obsegi: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Brez',
        assoonaspossible    : 'Čim prej',
        aslateaspossible    : 'Čim kasneje',
        muststarton         : 'Začeti se mora na',
        mustfinishon        : 'Končati se mora na',
        startnoearlierthan  : 'Začetek ne prej kot',
        startnolaterthan    : 'Začetek najkasneje',
        finishnoearlierthan : 'Končati ne prej kot',
        finishnolaterthan   : 'Končati najkasneje'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} časovna rezerva pred dogodkom`;
            }
            if (postamble) {
                description += `.${postamble.toString()} časovna rezerva po dogodku`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Naprej',
        Backward      : 'Nazaj',
        inheritedFrom : 'Podedovani od',
        enforcedBy    : 'Prisiljeni od'
    },

    CalendarField : {
        'Default calendar' : 'Privzeti koledar',
        editCalendar       : 'Uredi koledar'
    },

    TaskEditorBase : {
        Information   : 'Informacije o nalogi',
        Save          : 'Shrani',
        Cancel        : 'Prekliči',
        Delete        : 'Izbriši',
        calculateMask : 'Računanje...',
        saveError     : 'Ni mogoče shraniti, najprej popravite napake',
        repeatingInfo : 'Ogled ponavljajočega se dogodka',
        editRepeating : 'Uredi'
    },

    TaskEdit : {
        editEvent              : 'Uredi dogodek',
        ConfirmDeletionTitle   : 'Potrdi brisanje',
        ConfirmDeletionMessage : 'Ste prepričani, da želite izbrisati dogodek?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '34em'
    },

    SchedulerGeneralTab : {
        General      : 'Splošno',
        Name         : 'Ime',
        Resources    : 'Viri',
        '% complete' : '% dokončano',
        Duration     : 'Trajanje',
        Start        : 'Začetek',
        Finish       : 'Konec',
        Effort       : 'Trud',
        Preamble     : 'Preambula',
        Postamble    : 'Poambula'
    },

    GeneralTab : {
        General      : 'Splošno',
        Name         : 'Ime',
        '% complete' : '% dokončano',
        Duration     : 'Trajanje',
        Start        : 'Začetek',
        Finish       : 'Konec',
        Effort       : 'Trud',
        Dates        : 'Datumi'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Napredno',
        Calendar                   : 'Koledar',
        'Scheduling mode'          : 'Način razporejanja',
        'Effort driven'            : 'Gnano po naporu',
        'Manually scheduled'       : 'Ročno razporejeno',
        'Constraint type'          : 'Vrsta omejitve',
        'Constraint date'          : 'Datum omejitve',
        Inactive                   : 'Neaktivno',
        'Ignore resource calendar' : 'Prezri koledar virov'
    },

    CalendarEditorDatePicker : {
        addException : 'Dodaj izjemo',
        addWeek      : 'Dodaj teden'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Dodaj izjemo',
        removeException : 'Odstranite izjemo',
        noRows          : 'Dodane nobene izjeme'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Dodaj teden',
        removeWeek : 'Odstranite teden'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Dnevi delujejo privzeto',
        workingTimeCalendar        : 'Koledar delovnega časa',
        exceptions                 : 'Izjeme',
        general                    : 'Splošno',
        name                       : 'Ime',
        parent                     : 'Starš',
        save                       : 'Shrani',
        weeks                      : 'Tedni',
        error                      : 'Napaka',
        inputErrors                : 'Obstajajo vhodne napake. Popravite jih, preden shranite spremembe.',
        delete                     : 'Izbrisati',
        addCalendar                : 'Dodajte koledar',
        confirmation               : 'Potrditev',
        removeCalendarWithChildren : 'Koledar ima otroške koledarje. Kliknite "Da", da odstranite koledar s svojimi otroki.',
        removeCalendarAndLinks     : 'Koledar uporabljajo nekateri zapisi. Kliknite "DA", da jih ublažite in odstranite koledar.',
        newException               : 'Nova izjema',
        newWeek                    : 'Nov teden'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' dela',
        isNotWorking : ' ne deluje',
        basedOn      : ' temelji na:',
        byDefault    : 'privzeto',
        rangeTpl     : (start, end) => `${start} do ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Delovni dan',
        nonWorkingDay : 'Dan, ki ne deluje'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Obstajajo prekrivajoči se razponi',
        errorMissingDate   : 'Začetek in končni čas sta potrebna',
        errorStartAfterEnd : 'Začetni čas ne more biti po koncu časa'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Ime',
        from                                 : 'Od',
        to                                   : 'Do',
        is                                   : 'Je',
        nonWorking                           : 'Neobremenjenost',
        working                              : 'Delo',
        hours                                : 'Ure',
        repeat                               : 'Ponovite',
        repeatEnd                            : 'Ponovite konec',
        errorMissingDate                     : 'Potreben je datum izjeme',
        errorStartAfterEnd                   : '"Od" datuma ne more biti po datumu "do" ',
        errorStartAndEndRepeatNumberMismatch : 'Izjema bi se morala začeti in končati enako število'
    },

    CalendarEditorWeekPanel : {
        name        : 'Ime',
        from        : 'Od',
        to          : 'Do',
        days        : 'Dnevi',
        copyDay     : 'Kopiraj dan',
        pasteDay    : 'Dan prilepe',
        stopCopying : 'Nehajte kopirati'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Dodajte domet',
        removeRange : 'Odstranite domet'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"Od" datuma ne more biti po datumu "do" ',
        errorNoDefaultWeek           : 'Potrebna je konfiguracija tedna',
        errorMultipleDefaultWeeks    : 'Določen je več privzetega tedna',
        errorNoWeekAvailability      : 'Teden mora zagotoviti nekaj delovnega časa',
        errorInvalidWeekAvailability : 'Teden ima napake v konfiguraciji delovnega časa',
        noRows                       : 'Ni dodanih tednov'
    },

    AdvancedTab : {
        Advanced                   : 'Napredno',
        Calendar                   : 'Koledar',
        'Scheduling mode'          : 'Način razporejanja',
        'Effort driven'            : 'Gnano po naporu',
        'Manually scheduled'       : 'Ročno razporejeno',
        'Constraint type'          : 'Vrsta omejitve',
        'Constraint date'          : 'Datum omejitve',
        Constraint                 : 'Omejitev',
        Rollup                     : 'Poročilo v povzetek',
        Inactive                   : 'Neaktivno',
        'Ignore resource calendar' : 'Prezri koledar virov',
        'Scheduling direction'     : 'Smer načrtovanja',
        projectBorder              : 'Projektna meja',
        ignore                     : 'Ignoriraj',
        honor                      : 'Čast',
        askUser                    : 'Vprašajte uporabnika'
    },

    DependencyTab : {
        Predecessors      : 'Predhodniki',
        Successors        : 'Nasledniki',
        ID                : 'ID',
        Name              : 'Ime',
        Type              : 'Vrsta',
        Lag               : 'Zakasnitev',
        cyclicDependency  : 'Ciklična odvisnost',
        invalidDependency : 'Neveljavna odvisnost',
        readOnlyTask      : 'Opravila samo za branje ni mogoče povezati'
    },

    NotesTab : {
        Notes : 'Opombe'
    },

    ResourceCalendarColumn : {
        calendar : 'Koledar'
    },

    ResourceEdit : {
        editResource : 'Uredi vir'
    },

    ResourceEditor : {
        resourceInformation : 'Informacije o viru',
        costs               : 'Stroški',
        save                : 'Shrani',
        error               : 'Napaka',
        inputErrors         : 'Pri vnosu so napake. Popravite jih, preden shranite spremembe.',
        delete              : 'Izbriši',
        confirmation        : 'Potrditev',
        removeUsedResource  : 'Vir je dodeljen nekaterim nalogam. Kliknite »Da«, če želite vir vseeno odstraniti.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Koledar',
        general     : 'Splošno',
        label       : 'Oznaka materiala',
        name        : 'Ime vira',
        type        : 'Vrsta',
        costAccrual : 'Vračunavanje stroškov',
        labelHint   : 'na primer kg, tone ali škatle',
        maxUnits    : 'Največ enot'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Obračunati pri',
        prorated : 'Sorazmerno',
        start    : 'Začetek',
        end      : 'Konec'
    },

    CostAccrualField : {
        prorated : 'Sorazmerno',
        start    : 'Začetek',
        end      : 'Konec'
    },

    ResourceType : {
        work     : 'delo',
        material : 'Material',
        cost     : 'Stroški'
    },

    ResourceTypeColumn : {
        type : 'Vrsta'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Tabela cen',
        newGroup     : 'Nova miza',
        removeGroup  : 'Odstrani tabelo',
        useByDefault : 'Privzeto uporabite za dodelitve virov',
        noRates      : 'Brez stopenj'
    },

    ResourceGrid : {
        name          : 'Ime',
        materialLabel : 'Oznaka materiala',
        maxUnits      : 'Največ enot',
        cost          : 'Stroški',
        noRows        : 'Brez virov'
    },

    ResourceRateTableContainer : {
        startDate    : 'Začetni datum',
        standardRate : 'Standardna stopnja',
        perUseCost   : 'Cena na uporabo',
        addRate      : 'Dodajte stopnjo',
        removeRate   : 'Stopnja odstranitve',
        name         : 'Ime',
        noRates      : 'Brez stopenj'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Informacije o tabeli stopenj'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Količina',
        Resources   : 'Viri',
        Resource    : 'Vir',
        Units       : 'Enote',
        cost        : 'Stroški',
        effort      : 'Prizadevanje',
        start       : 'Začetek',
        finish      : 'Končaj',
        preamble    : 'Predgovor',
        postamble   : 'Zaključek'
    },

    RateTableColumn : {
        rateTable : 'Tabela cen'
    },

    RecurrenceTab : {
        title : 'Ponovi'
    },

    SchedulingModePicker : {
        Normal           : 'Normalno',
        'Fixed Duration' : 'Stalno trajanje',
        'Fixed Units'    : 'Stalne enote',
        'Fixed Effort'   : 'Stalni napor'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} od {available}</span> dodeljenih',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} od {available}</span> dodeljenih',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} od {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} od {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'Na {startDate}<br><span class="{cls}">{allocated} od {available}</span> dodeljenih:<br>{assignments}',
        plusMore              : '+{value} več'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Napor</div><div class="b-effort-value {cls}">{allocated} od {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Napor</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Strošek</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Količina</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} na {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Povzetek za {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Povzetek za {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} več',
        nameColumnText        : 'Vir / Dogodek'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Prekliči spremembo in ne stori ničesar',
        schedulingConflict : 'Spor pri razporedu',
        emptyCalendar      : 'Napaka konfiguracije koledarja',
        cycle              : 'Cikel razporejanja',
        Apply              : 'Uporabi'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Prosimo, izberite odvisnost:',
        invalidDependencyLabel : 'Vključene so neveljavne odvisnosti, ki jih je treba obravnavati:'
    },

    SchedulerProBase : {
        propagating     : 'Preračunavanje projekta',
        storePopulation : 'Nalaganje podatkov',
        finalizing      : 'Dokončevanje rezultatov'
    },

    EventSegments : {
        splitEvent    : 'Razdeli dogodek',
        renameSegment : 'Preimenuj'
    },

    NestedEvents : {
        createGroup         : 'Združi izbrane dogodke',
        newGroupName        : 'Nova skupina',
        deNestingNotAllowed : 'Odstranjevanje gnezdenja ni dovoljeno',
        nestingNotAllowed   : 'Gnezdenje ni dovoljeno'
    },

    VersionGrid : {
        compare       : 'Primerjaj',
        description   : 'Opis',
        occurredAt    : 'Zgodilo se ob',
        rename        : 'Preimenuj',
        restore       : 'Obnovi',
        stopComparing : 'Prenehaj primerjati'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'naloga',
            AssignmentModel : 'dodelitev',
            DependencyModel : 'povezava',
            ProjectModel    : 'projekt',
            ResourceModel   : 'vir',
            other           : 'predmet'
        },
        entityNamesPlural : {
            TaskModel       : 'naloge',
            AssignmentModel : 'dodelitve',
            DependencyModel : 'povezave',
            ProjectModel    : 'projekti',
            ResourceModel   : 'viri',
            other           : 'predmeti'
        },
        transactionDescriptions : {
            update : 'Spremenjenih {n} {entities}',
            add    : 'Dodanih {n} {entities}',
            remove : 'Odstranjenih {n} {entities}',
            move   : 'Premakjenih {n} {entities}',
            mixed  : 'Spremenjenih {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktivno',
            allDay                   : 'Cel dan',
            allowOverlap             : 'Dovoli prekrivanje',
            barMargin                : 'Rob vrstice',
            bidirectional            : 'Dvosmerno',
            calendar                 : 'Koledar',
            cls                      : 'CSS razred',
            constraintDate           : 'Datum omejitve',
            constraintType           : 'Vrsta omejitve',
            daysPerMonth             : 'Dni na mesec',
            daysPerWeek              : 'Dni na teden',
            delayFromParent          : 'Zamuda od nadrejenega',
            direction                : 'Smer',
            drawDependencies         : 'Prikaži odvisnosti',
            duration                 : 'Trajanje',
            durationUnit             : 'Enota trajanja',
            effort                   : 'Naprezanje',
            effortDriven             : 'Gonilo naprezanja',
            effortUnit               : 'Enota naprezanja',
            endDate                  : 'Končni datum',
            eventColor               : 'Barva',
            eventId                  : 'ID dogodka',
            eventLayout              : 'Postavitev dogodka',
            eventStyle               : 'Slog vrstice',
            exceptionDates           : 'Izjemni datumi',
            fixed                    : 'Fiksno',
            from                     : 'Od',
            fromSide                 : 'Od strani',
            hoursPerDay              : 'Ur na dan',
            href                     : 'Povezava',
            iconCls                  : 'Ikona',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Prezri koledar virov',
            ignoreTimeZone           : 'Prezri časovni pas',
            image                    : 'Slika',
            imageUrl                 : 'URL slike',
            inactive                 : 'Neaktivno',
            intervals                : 'Intervali',
            lag                      : 'Zamik',
            lagUnit                  : 'Enota zamika',
            lineStyle                : 'Slog črte',
            manuallyScheduled        : 'Ročno načrtovano',
            milestoneWidth           : 'Širina mejnika',
            name                     : 'Ime',
            note                     : 'Opomba',
            parentId                 : 'ID nadrejenega',
            parentIndex              : 'Položaj',
            percentDone              : '% dokončano',
            postamble                : 'Zaključek',
            preamble                 : 'Uvod',
            readOnly                 : 'Samo za branje',
            recurrenceRule           : 'Pravilo ponavljanja',
            resourceId               : 'ID vira',
            resourceMargin           : 'Rob vira',
            rowHeight                : 'Višina vrstice',
            schedulingMode           : 'Način načrtovanja',
            segments                 : 'Segmenti',
            showAvatar               : 'Prikaži avatar',
            showInTimeline           : 'Prikaži v časovnici',
            startDate                : 'Začetni datum',
            stickyContents           : 'Lepljiva vsebina',
            strokeColor              : 'Barva črte',
            style                    : 'Slog',
            target                   : 'Cilj povezave',
            to                       : 'Do',
            toSide                   : 'Do strani',
            type                     : 'Vrsta',
            units                    : 'Enote',
            unscheduled              : 'Nenačrtovano',
            unspecifiedTimeIsWorking : 'Nedoločen čas je delovni',
            version                  : 'Različica'
        },
        intervals : {
            working    : 'Delovni',
            nonWorking : 'Nedelovni',
            fromTo     : 'Od {from} do {to}',
            recurring  : 'Ponavljajoče se začne {start} konča {end}'
        },
        addEntity         : 'Dodano {type} **{name}**',
        removeEntity      : 'Odstranjeno {type} **{name}**',
        updateEntity      : 'Spremenjeno {type} **{name}**',
        moveEntity        : 'Premaknjeno {type} **{name}** od {from} do {to}',
        addDependency     : 'Dodana povezava od **{from}** do **{to}**',
        removeDependency  : 'Odstranjena povezava od **{from}** do **{to}**',
        updateDependency  : 'Urejena povezava od **{from}** do **{to}**',
        addAssignment     : 'Dodeljen **{resource}** do **{event}**',
        removeAssignment  : 'Odstranjena dodelitev **{resource}** od **{event}**',
        updateAssignment  : 'Urejena dodelitev **{resource}** do **{event}**',
        noChanges         : 'Brez sprememb',
        nullValue         : 'nič',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Shranjeno ob {date}',
        autoSavedAt       : 'Samodejno shranjeno ob {date}',
        undid             : 'Razveljavljene spremembe',
        redid             : 'Ponovno uvedene spremembe',
        editedTask        : 'Urejene lastnosti naloge',
        deletedTask       : 'Izbrisal nalogo',
        movedTask         : 'Premaknil nalogo',
        movedTasks        : 'Premaknjene naloge'
    }
};

export default LocaleHelper.publishLocale(locale);
