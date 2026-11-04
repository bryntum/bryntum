import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Hr.js';
import '../../Grid/localization/Hr.js';

const locale = {

    localeName : 'Hr',
    localeDesc : 'Hrvatski',
    localeCode : 'hr',
    localeRtl  : false,

    Object : {
        newEvent    : 'Novi događaj',
        information : 'Informacije',
        showDetails : 'Prikaži pojedinosti'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' događa' + (data !== 1 ? 'i' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Prebaci stupac rasporeda resursa. SPACE za kontekstni izbornik.'
    },

    Dependencies : {
        from    : 'Od',
        to      : 'Do',
        valid   : 'Važeće',
        invalid : 'Nevažeće'
    },

    DependencyType : {
        SS           : 'SS',
        SF           : 'SF',
        FS           : 'FS',
        FF           : 'FF',
        StartToStart : 'Od početka na početak',
        StartToEnd   : 'Od početka na završetak',
        EndToStart   : 'Od završetka na početak',
        EndToEnd     : 'Od završetka na završetak',
        short        : [
            'SS',
            'SF',
            'FS',
            'FF'
        ],
        long : [
            'Od početka na početak',
            'Od početka na završetak',
            'Od završetka na početak',
            'Od završetka na završetak'
        ]
    },

    DependencyEdit : {
        From              : 'Od',
        To                : 'Do',
        Type              : 'Vrsta',
        Lag               : 'Odgoda',
        color             : 'Boja',
        lineStyle         : 'Stil linije',
        solid             : 'Puna',
        dashed            : 'Isprekidana',
        dotted            : 'Točkasta',
        dashDot           : 'Crtica-točka',
        longDash          : 'Duga crtica',
        'Edit dependency' : 'Uredi ovisnost',
        Save              : 'Spremi',
        Delete            : 'Obriši',
        Cancel            : 'Otkaži',
        StartToStart      : 'Od početka na početak',
        StartToEnd        : 'Od početka na završetak',
        EndToStart        : 'Od završetka na početak',
        EndToEnd          : 'Od završetka na završetak',
        Active            : 'Aktivno'
    },

    EventEdit : {
        Name           : 'Naziv',
        Resource       : 'Resurs',
        Start          : 'Početak',
        startTime      : 'Vrijeme početka',
        End            : 'Završetak',
        endTime        : 'Vrijeme završetka',
        Save           : 'Spremi',
        Delete         : 'Obriši',
        Cancel         : 'Otkaži',
        'Edit event'   : 'Uredi događaj',
        Repeat         : 'Ponovi',
        editRecurrence : 'Uredi ponavljanje'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Događaj se poklapa s već postojećim događajem za ovaj resurs',
        noDropOutsideTimeline   : 'Događaj se ne smije potpuno ispustiti izvan vremenske trake',
        duplicateAssignmentDrag : 'Događaj se ne može dodijeliti istom resursu više puta'
    },

    SchedulerBase : {
        'Add event'      : 'Dodaj događaj',
        'Delete event'   : 'Obriši događaj',
        'Unassign event' : 'Poništi dodjelu događaja',
        color            : 'Boja',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, počinje u ${startDate} ${eventRecord.duration > 0 ? `za ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Povećaj ili smanji',
        activeDateRange : 'Raspon datuma',
        startText       : 'Datum početka',
        endText         : 'Datum završetka',
        todayText       : 'Danas'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Vremenska os pokazuje od ${startDate} do ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Kopiraj događaj',
        cutEvent   : 'Izreži događaj',
        pasteEvent : 'Zalijepi događaj'
    },

    EventFilter : {
        filterEvents : 'Filtriraj zadatke',
        byName       : 'Po nazivu'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Pokaži trenutačnu vremensku traku'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Sekunde'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD.MM., H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD.MM.',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Dani'
        },
        day : {
            name : 'Dan/sati'
        },
        week : {
            name : 'Tjedan/sati'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Tjedan/dani'
        },
        dayAndMonth : {
            name : 'Mjesec'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Tjedan'
        },
        weekAndMonth : {
            name : 'Tjedni'
        },
        weekAndDayLetter : {
            name : 'Tjedni/Dani u tjednu'
        },
        weekDateAndMonth : {
            name : 'Mjeseci/Tjedni'
        },
        monthAndYear : {
            name : 'Mjeseci'
        },
        year : {
            name : 'Godine'
        },
        manyYears : {
            name : 'Više godina'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Brišete događaj',
        'delete-all-message'        : 'Želite li obrisati sva pojavljivanja ovog događaja?',
        'delete-further-message'    : 'Želite li obrisati ovo i sva buduća pojavljivanja ovog događaja ili samo odabrano pojavljivanje?',
        'delete-only-this-message'  : 'Želite li izbrisati ovu pojavu ovog događaja?',
        'delete-further-btn-text'   : 'Obriši sve događaje u budućnosti',
        'delete-only-this-btn-text' : 'Izbriši samo ovaj događaj',
        'update-title'              : 'Mijenjate ponavljajući događaj',
        'update-all-message'        : 'Želite li izmijeniti sva pojavljivanja ovog događaja?',
        'update-further-message'    : 'Želite li izmijeniti samo ovo pojavljivanje događaja ili ovo i sva buduća pojavljivanja?',
        'update-only-this-message'  : 'Želite li promijeniti ovu pojavu ovog događaja?',
        'update-further-btn-text'   : 'Svi budući događaji',
        'update-only-this-btn-text' : 'Samo ovaj događaj',
        Yes                         : 'Da',
        Cancel                      : 'Otkaži',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' i ',
        Daily                           : 'Svakodnevno',
        'Weekly on {1}'                 : ({ days }) => `Tjedno ${days}`,
        'Monthly on {1}'                : ({ days }) => `Mjesečno ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Godišnje ${days} od ${months}`,
        'Every {0} days'                : ({ interval }) => `Svakih ${interval} dana`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Svaka ${interval} tjedna ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Svaka ${interval} mjeseca ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Svake ${interval} godine ${days} od ${months}`,
        position1                       : 'prvi',
        position2                       : 'drugi',
        position3                       : 'treći',
        position4                       : 'četvrti',
        position5                       : 'peti',
        'position-1'                    : 'posljednji',
        day                             : 'dan',
        weekday                         : 'radni dan',
        'weekend day'                   : 'dan vikenda',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Ponovi događaj',
        Cancel              : 'Otkaži',
        Save                : 'Spremi',
        Frequency           : 'Učestalost',
        Every               : 'Svaki(h)',
        DAILYintervalUnit   : 'dan(a)',
        WEEKLYintervalUnit  : 'tjedan(a)',
        MONTHLYintervalUnit : 'mjesec(i)',
        YEARLYintervalUnit  : 'godina',
        Each                : 'Svaki',
        on                  : 'Na',
        the                 : 'Na',
        'On the'            : 'Na',
        'End repeat'        : 'Završi ponavljanje',
        'time(s)'           : 'put(a)',
        Days                : 'Dani',
        Months              : 'Mjeseci'
    },

    RecurrenceDaysCombo : {
        day           : 'dan',
        weekday       : 'radni dan',
        'weekend day' : 'dan vikenda'
    },

    RecurrencePositionsCombo : {
        position1    : 'prvi',
        position2    : 'drugi',
        position3    : 'treći',
        position4    : 'četvrti',
        position5    : 'peti',
        'position-1' : 'posljednji'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Nikada',
        After     : 'Nakon',
        'On date' : 'Na datum'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Bez ponavljanja',
        Daily   : 'Svakodnevno',
        Weekly  : 'Tjedno',
        Monthly : 'Mjesečno',
        Yearly  : 'Godišnje'
    },

    RecurrenceCombo : {
        None   : 'Nijedan',
        Custom : 'Prilagođeno...'
    },

    Summary : {
        'Summary for' : date => `Sažetak za ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Cijeli raspored',
        currentview  : 'Vidljivi raspored',
        daterange    : 'Raspon datuma',
        completedata : 'Cijeli raspored (za sve događaje)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Raspon rasporeda',
        'Export from'    : 'Od',
        'Export to'      : 'Do'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Jedna stranica'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Jedna stranica (neprilagođena)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Više stranica (vertikalno)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Nema dodijeljenog resursa'
    },

    CrudManagerView : {
        serverResponseLabel : 'Odgovor poslužitelja:'
    },

    DurationColumn : {
        Duration : 'Trajanje'
    },

    EventClusteringBase : {
        unnamed         : 'Neimenovano',
        more            : count => `+ još ${count}`,
        clusteredEvents : count => `Grupirani događaji: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Grupirani rasponi: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Nijedan',
        assoonaspossible    : 'Što je prije moguće',
        aslateaspossible    : 'Što je kasnije moguće',
        muststarton         : 'Treba započeti na',
        mustfinishon        : 'Treba završiti na',
        startnoearlierthan  : 'Započeti ne ranije od',
        startnolaterthan    : 'Započeti ne kasnije od',
        finishnoearlierthan : 'Završiti ne ranije od',
        finishnolaterthan   : 'Završiti ne kasnije od'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} vrijeme međuspremnika prije događaja`;
            }
            if (postamble) {
                description += `.${postamble.toString()} vrijeme međuspremnika nakon događaja`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Naprijed',
        Backward      : 'Natrag',
        inheritedFrom : 'Naslijeđeno od',
        enforcedBy    : 'Nametnuto od'
    },

    CalendarField : {
        'Default calendar' : 'Zadani kalendar',
        editCalendar       : 'Uredi kalendar'
    },

    TaskEditorBase : {
        Information   : 'Informacije o zadatku',
        Save          : 'Spremi',
        Cancel        : 'Otkaži',
        Delete        : 'Obriši',
        calculateMask : 'Izračun u tijeku...',
        saveError     : 'Spremanje nije moguće, najprije ispravite pogreške',
        repeatingInfo : 'Gledanje događaja koji se ponavlja',
        editRepeating : 'Uređivanje'
    },

    TaskEdit : {
        editEvent              : 'Uredi događaj',
        ConfirmDeletionTitle   : 'Potvrdi brisanje',
        ConfirmDeletionMessage : 'Sigurno želite obrisati događaj?'
    },

    GanttTaskEditor : {
        editorWidth : '45em'
    },

    SchedulerTaskEditor : {
        editorWidth : '36em'
    },

    SchedulerGeneralTab : {
        General      : 'Općenito',
        Name         : 'Naziv',
        Resources    : 'Resursi',
        '% complete' : '% dovršeno',
        Duration     : 'Trajanje',
        Start        : 'Početak',
        Finish       : 'Završetak',
        Effort       : 'Effort',
        Preamble     : 'Uvod',
        Postamble    : 'Zaključak'
    },

    GeneralTab : {
        General      : 'Općenito',
        Name         : 'Naziv',
        '% complete' : '% dovršeno',
        Duration     : 'Trajanje',
        Start        : 'Početak',
        Finish       : 'Završetak',
        Effort       : 'Effort',
        Dates        : 'Datumi'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Napredno',
        Calendar                   : 'Kalendar',
        'Scheduling mode'          : 'Način zakazivanja',
        'Effort driven'            : 'Utemeljeno na effortu',
        'Manually scheduled'       : 'Ručno zakazano',
        'Constraint type'          : 'Vrsta ograničenja',
        'Constraint date'          : 'Datum ograničenja',
        Inactive                   : 'Neaktivno',
        'Ignore resource calendar' : 'Zanemari kalendar resursa'
    },

    CalendarEditorDatePicker : {
        addException : 'Dodajte iznimku',
        addWeek      : 'Dodajte tjedan'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Dodajte iznimku',
        removeException : 'Ukloniti iznimku',
        noRows          : 'Nije dodana iznimka'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Dodajte tjedan',
        removeWeek : 'Ukloniti tjedan'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Dani rade prema zadanim postavkama',
        workingTimeCalendar        : 'Kalendar radnog vremena',
        exceptions                 : 'Iznimke',
        general                    : 'Općenito',
        name                       : 'Ime',
        parent                     : 'Roditelj',
        save                       : 'Uštedjeti',
        weeks                      : 'Tjedni',
        error                      : 'Pogreška',
        inputErrors                : 'Postoje ulazne pogreške. Popravite ih prije spremanja promjena.',
        delete                     : 'Izbrisati',
        addCalendar                : 'Dodajte kalendar',
        confirmation               : 'Potvrda',
        removeCalendarWithChildren : 'Kalendar ima kalendare za djecu. Kliknite "Da" da biste uklonili kalendar sa svojom djecom.',
        removeCalendarAndLinks     : 'Kalendar koriste neki zapisi. Kliknite "Da" da biste ih prekinuli i uklonili kalendar.',
        newException               : 'Nova iznimka',
        newWeek                    : 'Novi tjedan'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' radi',
        isNotWorking : ' ne radi',
        basedOn      : ' na temelju:',
        byDefault    : 'prema zadanim postavkama',
        rangeTpl     : (start, end) => `${start} do ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Radni dan',
        nonWorkingDay : 'Neradni dan'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Postoje rasponi preklapanja',
        errorMissingDate   : 'Potrebno je vrijeme početka i završetka',
        errorStartAfterEnd : 'Vrijeme početka ne može biti nakon završnog vremena'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Ime',
        from                                 : 'Iz',
        to                                   : 'Do',
        is                                   : 'Je',
        nonWorking                           : 'Ne radi',
        working                              : 'Rad',
        hours                                : 'Sati',
        repeat                               : 'Ponoviti',
        repeatEnd                            : 'Ponovite kraj',
        errorMissingDate                     : 'Potreban je raspon datuma iznimke',
        errorStartAfterEnd                   : '"From" date cannot be after the "To" date ',
        errorStartAndEndRepeatNumberMismatch : 'Izuzetak bi trebao započeti i završiti isti broj puta'
    },

    CalendarEditorWeekPanel : {
        name        : 'Ime',
        from        : 'Iz',
        to          : 'Do',
        days        : 'Dani',
        copyDay     : 'Dan kopiranja',
        pasteDay    : 'Zalijepiti',
        stopCopying : 'Prestati kopirati'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Dodajte raspon',
        removeRange : 'Uklonite raspon'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"From" date cannot be after the "To" date ',
        errorNoDefaultWeek           : 'Potrebna je konfiguracija tjedna',
        errorMultipleDefaultWeeks    : 'Navedeno je više od jednog zadanog tjedna',
        errorNoWeekAvailability      : 'Tjedan mora osigurati neko radno vrijeme',
        errorInvalidWeekAvailability : 'Tjedan ima pogreške u konfiguraciji radnog vremena',
        noRows                       : 'Nisu dodani tjedni'
    },

    AdvancedTab : {
        Advanced                   : 'Napredno',
        Calendar                   : 'Kalendar',
        'Scheduling mode'          : 'Način zakazivanja',
        'Effort driven'            : 'Utemeljeno na effortu',
        'Manually scheduled'       : 'Ručno zakazano',
        'Constraint type'          : 'Vrsta ograničenja',
        'Constraint date'          : 'Datum ograničenja',
        Constraint                 : 'Ograničenje',
        Rollup                     : 'Kumulirano',
        Inactive                   : 'Neaktivno',
        'Ignore resource calendar' : 'Zanemari kalendar resursa',
        'Scheduling direction'     : 'Smjer planiranja',
        projectBorder              : 'Projektiranje',
        ignore                     : 'Zanemariti',
        honor                      : 'Čast',
        askUser                    : 'Pitajte korisnika'
    },

    DependencyTab : {
        Predecessors      : 'Prethodnici',
        Successors        : 'Nasljednici',
        ID                : 'ID',
        Name              : 'Naziv',
        Type              : 'Vrsta',
        Lag               : 'Odgoda',
        cyclicDependency  : 'Ciklička ovisnost',
        invalidDependency : 'Nevažeća ovisnost',
        readOnlyTask      : 'Zadatak samo za čitanje ne može se povezati'
    },

    NotesTab : {
        Notes : 'Bilješke'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalendar'
    },

    ResourceEdit : {
        editResource : 'Uredi izvor'
    },

    ResourceEditor : {
        resourceInformation : 'Informacije o izvoru',
        costs               : 'Troškovi',
        save                : 'Uštedjeti',
        error               : 'Greška',
        inputErrors         : 'Postoje pogreške pri unosu. Ispravite ih prije spremanja promjena.',
        delete              : 'Izbrisati',
        confirmation        : 'Potvrda',
        removeUsedResource  : 'Resurs je dodijeljen nekim zadacima. Kliknite "Da" kako biste svejedno uklonili resurs.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalendar',
        general     : 'General',
        label       : 'Oznaka materijala',
        name        : 'Naziv resursa',
        type        : 'Tip',
        costAccrual : 'Obračun troškova',
        labelHint   : 'na primjer, kg, tone ili kutije',
        maxUnits    : 'Maksimalne jedinice'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Prikupiti na',
        prorated : 'Proporcionalno',
        start    : 'Start',
        end      : 'Kraj'
    },

    CostAccrualField : {
        prorated : 'Proporcionalno',
        start    : 'Start',
        end      : 'Kraj'
    },

    ResourceType : {
        work     : 'Raditi',
        material : 'Materijal',
        cost     : 'trošak'
    },

    ResourceTypeColumn : {
        type : 'Tip'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Tablica cijena',
        newGroup     : 'Novi stol',
        removeGroup  : 'Ukloni tablicu',
        useByDefault : 'Koristi prema zadanim postavkama za dodjele resursa',
        noRates      : 'Nema stopa'
    },

    ResourceGrid : {
        name          : 'Ime',
        materialLabel : 'Oznaka materijala',
        maxUnits      : 'Maksimalne jedinice',
        cost          : 'trošak',
        noRows        : 'Nema sredstava'
    },

    ResourceRateTableContainer : {
        startDate    : 'Datum početka',
        standardRate : 'Standardna stopa',
        perUseCost   : 'Cijena po upotrebi',
        addRate      : 'Dodaj stopu',
        removeRate   : 'Stopa uklanjanja',
        name         : 'Ime',
        noRates      : 'Nema stopa'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Informacije o tablici tarifa'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Količina',
        Resources   : 'Resursi',
        Resource    : 'Resurs',
        Units       : 'Jedinice',
        cost        : 'trošak',
        effort      : 'Napor',
        start       : 'Start',
        finish      : 'Završiti',
        preamble    : 'Prethodni tekst',
        postamble   : 'Završni tekst'
    },

    RateTableColumn : {
        rateTable : 'Tablica cijena'
    },

    RecurrenceTab : {
        title : 'Ponovi'
    },

    SchedulingModePicker : {
        Normal           : 'Normalno',
        'Fixed Duration' : 'Fiksno trajanje',
        'Fixed Units'    : 'Fiksne jedinice',
        'Fixed Effort'   : 'Fiksni napor'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} od {available}</span> dodijeljeno',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} od {available}</span> dodijeljeno',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} od {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} od {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'Na {startDate}<br><span class="{cls}">{allocated} od {available}</span> dodijeljeno:<br>{assignments}',
        plusMore              : '+{value} više'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Naprezanje</div><div class="b-effort-value {cls}">{allocated} od {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Naprezanje</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Trošak</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Količina</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} na {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Sažetak za {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Sažetak za {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} više',
        nameColumnText        : 'Resurs / Događaj'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Otkaži promjenu i ne čini ništa',
        schedulingConflict : 'Preklapanje u rasporedu',
        emptyCalendar      : 'Konfiguracijska pogreška kalendara',
        cycle              : 'Ciklus rasporeda',
        Apply              : 'Primijeni'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Odaberite ovisnost:',
        invalidDependencyLabel : 'Uključene su nevažeće ovisnosti koje je potrebno riješiti:'
    },

    SchedulerProBase : {
        propagating     : 'Izračunavanje projekta',
        storePopulation : 'Učitavanje podataka',
        finalizing      : 'Dovršavanje rezultata'
    },

    EventSegments : {
        splitEvent    : 'Odvojeni događaj',
        renameSegment : 'Preimenuj'
    },

    NestedEvents : {
        createGroup         : 'Grupiraj odabrane događaje',
        newGroupName        : 'Nova grupa',
        deNestingNotAllowed : 'Odgniježđivanje nije dopušteno',
        nestingNotAllowed   : 'Gniježđenje nije dopušteno'
    },

    VersionGrid : {
        compare       : 'Usporedi',
        description   : 'Opis',
        occurredAt    : 'Dogodilo se u',
        rename        : 'Preimenuj',
        restore       : 'Vrati',
        stopComparing : 'Prekini usporedbu'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'zadaća',
            AssignmentModel : 'zadatak',
            DependencyModel : 'link',
            ProjectModel    : 'projekt',
            ResourceModel   : 'resurs',
            other           : 'objekt'
        },
        entityNamesPlural : {
            TaskModel       : 'zadaća',
            AssignmentModel : 'zadatak',
            DependencyModel : 'links',
            ProjectModel    : 'projekt',
            ResourceModel   : 'resurs',
            other           : 'objekt'
        },
        transactionDescriptions : {
            update : 'Promijenjeno {n} {entities}',
            add    : 'Dodano {n} {entities}',
            remove : 'Uklonjeno {n} {entities}',
            move   : 'Pomaknuto {n} {entities}',
            mixed  : 'Promijenjeno {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktivno',
            allDay                   : 'Cijeli dan',
            allowOverlap             : 'Dopusti preklapanje',
            barMargin                : 'Margina trake',
            bidirectional            : 'Dvosmjerno',
            calendar                 : 'Kalendar',
            cls                      : 'CSS klasa',
            constraintDate           : 'Datum ograničenja',
            constraintType           : 'Vrsta ograničenja',
            daysPerMonth             : 'Dani po mjesecu',
            daysPerWeek              : 'Dani po tjednu',
            delayFromParent          : 'Kašnjenje od roditelja',
            direction                : 'Smjer',
            drawDependencies         : 'Nacrtaj ovisnosti',
            duration                 : 'Trajanje',
            durationUnit             : 'Jedinica trajanja',
            effort                   : 'Napori',
            effortDriven             : 'Vođeno naporima',
            effortUnit               : 'Jedinica napora',
            endDate                  : 'Datum završetka',
            eventColor               : 'Boja',
            eventId                  : 'ID događaja',
            eventLayout              : 'Izgled događaja',
            eventStyle               : 'Stil trake',
            exceptionDates           : 'Izuzeti datumi',
            fixed                    : 'Fiksno',
            from                     : 'Od',
            fromSide                 : 'S strane',
            hoursPerDay              : 'Sati po danu',
            href                     : 'Poveznica',
            iconCls                  : 'Ikona',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignoriraj kalendar resursa',
            ignoreTimeZone           : 'Ignoriraj vremensku zonu',
            image                    : 'Slika',
            imageUrl                 : 'URL slike',
            inactive                 : 'Neaktivno',
            intervals                : 'Intervali',
            lag                      : 'Zaostatak',
            lagUnit                  : 'Jedinica zaostatka',
            lineStyle                : 'Stil linije',
            manuallyScheduled        : 'Ručno zakazano',
            milestoneWidth           : 'Širina prekretnice',
            name                     : 'Ime',
            note                     : 'Bilješka',
            parentId                 : 'ID roditelja',
            parentIndex              : 'Pozicija',
            percentDone              : '% završeno',
            postamble                : 'Postskriptum',
            preamble                 : 'Predgovor',
            readOnly                 : 'Samo za čitanje',
            recurrenceRule           : 'Pravilo ponavljanja',
            resourceId               : 'ID resursa',
            resourceMargin           : 'Margina resursa',
            rowHeight                : 'Visina reda',
            schedulingMode           : 'Način zakazivanja',
            segments                 : 'Segmenti',
            showAvatar               : 'Prikaži avatar',
            showInTimeline           : 'Prikaži u vremenskoj crti',
            startDate                : 'Datum početka',
            stickyContents           : 'Ljepljivi sadržaji',
            strokeColor              : 'Boja linije',
            style                    : 'Stil',
            target                   : 'Cilj poveznice',
            to                       : 'Do',
            toSide                   : 'Do strane',
            type                     : 'Vrsta',
            units                    : 'Jedinice',
            unscheduled              : 'Nije zakazano',
            unspecifiedTimeIsWorking : 'Nespecificirano vrijeme je radno',
            version                  : 'Verzija'
        },
        intervals : {
            working    : 'Radno',
            nonWorking : 'Neradno',
            fromTo     : 'Od {from} do {to}',
            recurring  : 'Ponavljajući počevši {start} završavajući {end}'
        },
        addEntity         : 'Dodano {type} **{name}**',
        removeEntity      : 'Uklonjeno {type} **{name}**',
        updateEntity      : 'Promijenjeno {type} **{name}**',
        moveEntity        : 'Pomaknuto {type} **{name}** od {from} do {to}',
        addDependency     : 'Dodano link od **{from}** do **{to}**',
        removeDependency  : 'Uklonjeno link od **{from}** do **{to}**',
        updateDependency  : 'Uređen link od **{from}** do **{to}**',
        addAssignment     : 'Dodijeljeno **{resource}** do **{event}**',
        removeAssignment  : 'Uklonjeno zadatak **{resource}** od **{event}**',
        updateAssignment  : 'Uređen zadatak **{resource}** do **{event}**',
        noChanges         : 'Nema promjene',
        nullValue         : 'none',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Spremljeno u {date}',
        autoSavedAt       : 'Automatski spremljeno u {date}',
        undid             : 'Undid promjene',
        redid             : 'Redid promjene',
        editedTask        : 'Uređen zadatak i svojstva',
        deletedTask       : 'Obrisan zadatak',
        movedTask         : 'Pomaknuti zadatak',
        movedTasks        : 'Pomaknuti zadatak'
    }
};

export default LocaleHelper.publishLocale(locale);
