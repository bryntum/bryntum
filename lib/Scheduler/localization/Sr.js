import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Sr.js';
import '../../Grid/localization/Sr.js';

const locale = {

    localeName : 'Sr',
    localeDesc : 'Srpski',
    localeCode : 'sr',
    localeRtl  : false,

    Object : {
        newEvent    : 'Novi dogđaj',
        information : 'Informacija',
        showDetails : 'Прикажи детаље'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' dogđaj' + (data !== 1 ? 'događaji' : 'i')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Пребаци колону распореда ресурса. SPACE за контекст мени.'
    },

    Dependencies : {
        from    : 'Od',
        to      : 'Do',
        valid   : 'Ispravan',
        invalid : 'Neispravan'
    },

    DependencyType : {
        SS           : 'PP',
        SF           : 'PK',
        FS           : 'KP',
        FF           : 'KK',
        StartToStart : 'Od početka do početka',
        StartToEnd   : 'Od početka do kraja',
        EndToStart   : 'Od kraja do početka',
        EndToEnd     : 'Od kraja do kraja',
        short        : [
            'PP',
            'PK',
            'KP',
            'KK'
        ],
        long : [
            'Od početka do početka',
            'Od početka do kraja',
            'Od kraja do početka',
            'Od kraja do kraja'
        ]
    },

    DependencyEdit : {
        From              : 'Od',
        To                : 'Do',
        Type              : 'Tip',
        Lag               : 'Kašnjenje',
        color             : 'Boja',
        lineStyle         : 'Stil linije',
        solid             : 'Puna',
        dashed            : 'Isprekidana',
        dotted            : 'Tačkasta',
        dashDot           : 'Crta-tačka',
        longDash          : 'Duga crta',
        'Edit dependency' : 'Uredi zavisnost',
        Save              : 'Sačuvaj',
        Delete            : 'Obriši',
        Cancel            : 'Otkaži',
        StartToStart      : 'Od početka do početka',
        StartToEnd        : 'Od početka do kraja',
        EndToStart        : 'Od kraja do početka',
        EndToEnd          : 'Od kraja do kraja',
        Active            : 'Aktivna'
    },

    EventEdit : {
        Name           : 'Ime',
        Resource       : 'Resurs',
        Start          : 'Početak',
        startTime      : 'Време почетка',
        End            : 'Kraj',
        endTime        : 'Време завршетка',
        Save           : 'Sačuvaj',
        Delete         : 'Obriši',
        Cancel         : 'Otkaži',
        'Edit event'   : 'Uredi događaj',
        Repeat         : 'Ponovi',
        editRecurrence : 'Uredi ponavljanje'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Događaj preklapa postojeći događaj za ovaj resurs',
        noDropOutsideTimeline   : 'Događaj možda nije u potpunosti spušten izvan vremenske linije',
        duplicateAssignmentDrag : 'Догађај се не може доделити истом ресурсу више пута'
    },

    SchedulerBase : {
        'Add event'      : 'Dodaj događaj',
        'Delete event'   : 'Obriši događaj',
        'Unassign event' : 'Poništi dodelu događaja',
        color            : 'Boja',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, počinje u ${startDate} ${eventRecord.duration > 0 ? `za ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zumiranje',
        activeDateRange : 'Opseg datuma',
        startText       : 'Početni datum',
        endText         : 'Krajnji datum',
        todayText       : 'Danas'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Vremenska osa prikazuje od ${startDate} do ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Kopiraj događaj',
        cutEvent   : 'Iseci događaj',
        pasteEvent : 'Umetni događaj'
    },

    EventFilter : {
        filterEvents : 'Filtriraj zadatke',
        byName       : 'Po imenu'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Prikaži trenutnu vremensku liniju'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Sekundi'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd D.M., hA',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd D.M.',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Dan'
        },
        day : {
            name : 'Dan/sati'
        },
        week : {
            name : 'Nedelja/sati'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Nedelja/dana'
        },
        dayAndMonth : {
            name : 'Mesec'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Nedelja'
        },
        weekAndMonth : {
            name : 'Nedelja'
        },
        weekAndDayLetter : {
            name : 'Nedelja/radnih dana'
        },
        weekDateAndMonth : {
            name : 'Meseci/nedelja'
        },
        monthAndYear : {
            name : 'Meseci'
        },
        year : {
            name : 'Godina'
        },
        manyYears : {
            name : 'Više godina'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Brisanje događaja',
        'delete-all-message'        : 'Da li želišda obrišeš sva pojavljivanja ovog događaja?',
        'delete-further-message'    : 'Da li želiš da obrišeš ovaj i sva sledeća pojavljivanja ovog događaja, ili samo odabrano pojavljivanje?',
        'delete-only-this-message'  : 'Да ли желите да обришете ово појављивање овог догађаја?',
        'delete-further-btn-text'   : 'Obriši sve buduće događaje',
        'delete-only-this-btn-text' : 'Obriši samo ovaj događaj',
        'update-title'              : 'Izmena događaja koji se ponavlja',
        'update-all-message'        : 'Da li želiš da promeniš sva pojavljivanja ovog događaja?',
        'update-further-message'    : 'Da li želiš da promeniš samo ovo pojavljivanje događaja, ili ovo i svako buduće pojavljivanje? ',
        'update-only-this-message'  : 'Да ли желите да промените ово појављивање овог догађаја?',
        'update-further-btn-text'   : 'Sve buduće događaje',
        'update-only-this-btn-text' : 'Samo ovaj događaj',
        Yes                         : 'Da',
        Cancel                      : 'Otkaži',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' i ',
        Daily                           : 'Dnevno',
        'Weekly on {1}'                 : ({ days }) => `Svake nedelje u ${days}`,
        'Monthly on {1}'                : ({ days }) => `Svakog meseca u ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Svake godine u ${days} u ${months}`,
        'Every {0} days'                : ({ interval }) => `Svakih ${interval} dana`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Svakih ${interval} nedelja u ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Svakih ${interval} meseci u ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Svakih ${interval} godina na ${days} u ${months}`,
        position1                       : 'prvi',
        position2                       : 'drugi',
        position3                       : 'treći',
        position4                       : 'četvrti',
        position5                       : 'peti',
        'position-1'                    : 'poslednji',
        day                             : 'dan',
        weekday                         : 'radni dan',
        'weekend day'                   : 'dan vikenda',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Ponovi događaj',
        Cancel              : 'Otkaži',
        Save                : 'Sačuvaj',
        Frequency           : 'Frekvencija',
        Every               : 'Svaki(h)',
        DAILYintervalUnit   : 'dan(a)',
        WEEKLYintervalUnit  : 'nedelje(e)',
        MONTHLYintervalUnit : 'mesec(a)',
        YEARLYintervalUnit  : 'godina(e)',
        Each                : 'Svake',
        on                  : 'Dan',
        the                 : 'Na',
        'On the'            : 'Na',
        'End repeat'        : 'Kraj ponavljanja',
        'time(s)'           : 'put(a)',
        Days                : 'Дани',
        Months              : 'Месецима'
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
        'position-1' : 'poslednji'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Nikad',
        After     : 'Nakon',
        'On date' : 'Na dan'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Bez ponavljanja',
        Daily   : 'Dnevno',
        Weekly  : 'Nedeljno',
        Monthly : 'Mesečno',
        Yearly  : 'Godišnje'
    },

    RecurrenceCombo : {
        None   : 'Nema',
        Custom : 'Prilagođeno…'
    },

    Summary : {
        'Summary for' : date => `Pregled na ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Kompletan raspored',
        currentview  : 'Vidljiv raspored',
        daterange    : 'Opseg datuma',
        completedata : 'Kompletan raspored (za sve događaje)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Opseg rasporeda',
        'Export from'    : 'Od',
        'Export to'      : 'Do'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Jedna stranica'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Jedna stranica (nepromenjena)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Više stranica (vertikalno)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Nema pridruženih resursa'
    },

    CrudManagerView : {
        serverResponseLabel : 'Odgovor servera:'
    },

    DurationColumn : {
        Duration : 'Trajanje'
    },

    EventClusteringBase : {
        unnamed         : 'Neimenovano',
        more            : count => `+ još ${count}`,
        clusteredEvents : count => `Grupisani događaji: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Grupisani opsezi: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Nema',
        assoonaspossible    : 'Što je pre moguće',
        aslateaspossible    : 'Što je kasnije moguće',
        muststarton         : 'Mora da počne',
        mustfinishon        : 'Mora da se završi',
        startnoearlierthan  : 'Počni ne ranije od',
        startnolaterthan    : 'Počni ne kasnije od',
        finishnoearlierthan : 'Završi ne ranije od',
        finishnolaterthan   : 'Završi ne kasnije od'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} vreme bafera pre događaja`;
            }
            if (postamble) {
                description += `.${postamble.toString()} vreme bafera posle događaja`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Napred',
        Backward      : 'Nazad',
        inheritedFrom : 'Nasleđeno od',
        enforcedBy    : 'Pitao od'
    },

    CalendarField : {
        'Default calendar' : 'Podrazumevani kalendar',
        editCalendar       : 'Uredite kalendar'
    },

    TaskEditorBase : {
        Information   : 'Informacije o zadatku',
        Save          : 'Sačuvaj',
        Cancel        : 'Otkaži',
        Delete        : 'Obriši',
        calculateMask : 'Računam...',
        saveError     : 'Nije moguće sačuvati, najpre ispravi greške',
        repeatingInfo : 'Gledate događaj koji se ponavlja',
        editRepeating : 'Uredi'
    },

    TaskEdit : {
        editEvent              : 'Uredi događaj',
        ConfirmDeletionTitle   : 'Potvrda brisanja',
        ConfirmDeletionMessage : 'Sigurno želiš da obrišeš ovaj događaj?'
    },

    GanttTaskEditor : {
        editorWidth : '45em'
    },

    SchedulerTaskEditor : {
        editorWidth : '36em'
    },

    SchedulerGeneralTab : {
        General      : 'Opšte',
        Name         : 'Ime',
        Resources    : 'Resursi',
        '% complete' : '% dovršeno',
        Duration     : 'Trajanje',
        Start        : 'Početak',
        Finish       : 'Kraj',
        Effort       : 'Trud',
        Preamble     : 'Uvod',
        Postamble    : 'Posle uvoda'
    },

    GeneralTab : {
        General      : 'Opšte',
        Name         : 'Ime',
        '% complete' : '% dovršeno',
        Duration     : 'Trajanje',
        Start        : 'Početak',
        Finish       : 'Kraj',
        Effort       : 'Trud',
        Dates        : 'Datumi'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Napredno',
        Calendar                   : 'Kalendar',
        'Scheduling mode'          : 'Režim planiranja',
        'Effort driven'            : 'Gonjeno trudom',
        'Manually scheduled'       : 'Ručno planirano',
        'Constraint type'          : 'Tip ograničenja',
        'Constraint date'          : 'Datum ograničenja',
        Inactive                   : 'Neaktivan',
        'Ignore resource calendar' : 'Ignoriši kalendar resursa'
    },

    CalendarEditorDatePicker : {
        addException : 'Dodajte izuzetak',
        addWeek      : 'Dodajte nedelju'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Dodajte izuzetak',
        removeException : 'Uklonite izuzetak',
        noRows          : 'Nije dodano izuzeće'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Dodajte nedelju',
        removeWeek : 'Izbrisati nedelju'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Dani rade podrazumevano',
        workingTimeCalendar        : 'Kalendar radnog vremena',
        exceptions                 : 'Izuzeci',
        general                    : 'General',
        name                       : 'Ime',
        parent                     : 'Roditelj',
        save                       : 'Sačuvati',
        weeks                      : 'Nedelje',
        error                      : 'Greška',
        inputErrors                : 'Postoje greške u unosu. Ispravite ih pre čuvanja',
        delete                     : 'Izbriši',
        addCalendar                : 'Dodaj kalendar',
        confirmation               : 'Potvrda',
        removeCalendarWithChildren : "Kalendar ima podkalendare. Kliknite na 'Da' da uklonite kalendar sa njegovim podkalendarima.",
        removeCalendarAndLinks     : "Kalendar koriste neki zapisi. Kliknite na 'Da' da ih razdvojite i uklonite kalendar.",
        newException               : 'Novi izuzetak',
        newWeek                    : 'Nova nedelja'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' radi',
        isNotWorking : ' ne radi',
        basedOn      : ' na osnovu:',
        byDefault    : 'podrazumevano',
        rangeTpl     : (start, end) => `${start} do ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Radni dan',
        nonWorkingDay : 'Neradni dan'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Postoje opsezi koji se preklapaju',
        errorMissingDate   : 'Obavezno vreme početka i završetka',
        errorStartAfterEnd : 'Vreme početka ne može biti posle kraja'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Ime',
        from                                 : 'Početak',
        to                                   : 'Do',
        is                                   : 'Je',
        nonWorking                           : 'Neradni',
        working                              : 'Radni',
        hours                                : 'Vreme',
        repeat                               : 'Ponavljanje',
        repeatEnd                            : 'Ponovite završetak',
        errorMissingDate                     : 'Obavezno navesti datum početka i završetka',
        errorStartAfterEnd                   : 'Datum početka ne može biti kasniji od datuma završetka',
        errorStartAndEndRepeatNumberMismatch : 'Izuzetak mora početi i završiti isti broj puta'
    },

    CalendarEditorWeekPanel : {
        name        : 'Ime',
        from        : 'Početak',
        to          : 'Do',
        days        : 'Dani',
        copyDay     : 'Vreme za kopiranje',
        pasteDay    : 'Unesite vreme',
        stopCopying : 'Završite kopiranje'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Dodajte vreme',
        removeRange : 'Izbriši vreme'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : 'Datum početka ne može biti kasniji od datuma završetka',
        errorNoDefaultWeek           : 'Potrebna je konfiguracija od najmanje jedne nedelje',
        errorMultipleDefaultWeeks    : 'Navedeno je više od jedne zadate nedelje',
        errorNoWeekAvailability      : 'Nedelja mora da obezbedi neko radno vreme',
        errorInvalidWeekAvailability : 'Nedelja ima greške u konfiguraciji radnog vremena',
        noRows                       : 'Dodano nijedno nedeljama'
    },

    AdvancedTab : {
        Advanced                   : 'Napredno',
        Calendar                   : 'Kalendar',
        'Scheduling mode'          : 'Režim planiranja',
        'Effort driven'            : 'Gonjeno trudom',
        'Manually scheduled'       : 'Ručno planirano',
        'Constraint type'          : 'Tip ograničenja',
        'Constraint date'          : 'Datum ograničenja',
        Constraint                 : 'Ograničenje',
        Rollup                     : 'Postignuće',
        Inactive                   : 'Neaktivan',
        'Ignore resource calendar' : 'Ignoriši kalendar resursa',
        'Scheduling direction'     : 'Smer planiranja',
        projectBorder              : 'Granica projekta',
        ignore                     : 'Ignoriraj',
        honor                      : 'Čast',
        askUser                    : 'Pitajte korisnika'
    },

    DependencyTab : {
        Predecessors      : 'Prethodnici',
        Successors        : 'Naslednici',
        ID                : 'ID',
        Name              : 'Ime',
        Type              : 'Tipe',
        Lag               : 'Kašnjenje',
        cyclicDependency  : 'Ciklična zavisnost',
        invalidDependency : 'Neispravna zavisnost',
        readOnlyTask      : 'Zadatak samo za čitanje ne može se povezati'
    },

    NotesTab : {
        Notes : 'Beleške'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalendar'
    },

    ResourceEdit : {
        editResource : 'Uredi resurs'
    },

    ResourceEditor : {
        resourceInformation : 'Informacije o resursima',
        costs               : 'Troškovi',
        save                : 'Sačuvaj',
        error               : 'Greška',
        inputErrors         : 'Postoje greške u unosu. Ispravite ih pre nego što sačuvate promene.',
        delete              : 'Izbrisati',
        confirmation        : 'Potvrda',
        removeUsedResource  : 'Resurs je dodeljen nekim zadacima. Kliknite na „Da“ da biste ipak uklonili resurs.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalendar',
        general     : 'General',
        label       : 'Oznaka materijala',
        name        : 'Naziv resursa',
        type        : 'Vrsta',
        costAccrual : 'Obračun troškova',
        labelHint   : 'na primer kg ili tona',
        maxUnits    : 'Maks. jedinica'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Akumuliraju u',
        prorated : 'Proporcionalno',
        start    : 'Početak',
        end      : 'Kraj'
    },

    CostAccrualField : {
        prorated : 'Proporcionalno',
        start    : 'Početak',
        end      : 'Kraj'
    },

    ResourceType : {
        work     : 'Rad',
        material : 'Materijalni',
        cost     : 'Trošak'
    },

    ResourceTypeColumn : {
        type : 'Tip'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Tabela stopa',
        newGroup     : 'Nova tabela stopa',
        removeGroup  : 'Uklonite tabelu stopa',
        useByDefault : 'Koristite ovu tabelu stopa za resurs',
        noRates      : 'Nema tarifa'
    },

    ResourceGrid : {
        name          : 'Naziv',
        materialLabel : 'Oznaka materijala',
        maxUnits      : 'Maks. jedinica',
        cost          : 'Trošak',
        noRows        : 'Nema resursa'
    },

    ResourceRateTableContainer : {
        startDate    : 'Datum početka',
        standardRate : 'Standardna stopa',
        perUseCost   : 'Cena po upotrebi',
        addRate      : 'Dodajte stopu',
        removeRate   : 'Uklonite stopu',
        name         : 'Naziv',
        noRates      : 'Nema tarifa'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Informacije o tabeli tarifa'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Količina',
        Resources   : 'Resursi',
        Resource    : 'Resurs',
        Units       : 'Jedinice',
        cost        : 'Trošak',
        effort      : 'Napor',
        start       : 'Počni',
        finish      : 'Završi',
        preamble    : 'Prethodni tekst',
        postamble   : 'Naknadni tekst'
    },

    RateTableColumn : {
        rateTable : 'Tabela stopa'
    },

    RecurrenceTab : {
        title : 'Sa ponavljanjem'
    },

    SchedulingModePicker : {
        Normal           : 'Normalni',
        'Fixed Duration' : 'Fiksno trajanje',
        'Fixed Units'    : 'Fiksne jedinice',
        'Fixed Effort'   : 'Fiksni trud'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} od {available}</span> dodeljeno',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} od {available}</span> dodeljeno',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} od {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} od {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'Dana {startDate}<br><span class="{cls}">{allocated} od {available}</span> dodeljeno:<br>{assignments}',
        plusMore              : '+{value} više'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Napori</div><div class="b-effort-value {cls}">{allocated} od {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Napori</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Trošak</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Količina</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} na {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Rezime za {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Rezime za {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} više',
        nameColumnText        : 'Resurs / Događaj'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Otkaži promenu i ne radi ništa',
        schedulingConflict : 'Konflikt pri planiranju',
        emptyCalendar      : 'Greška u konfiguraciji kalendara',
        cycle              : 'Ciklus planiranja',
        Apply              : 'Primeni'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Iaberitzavisnost:',
        invalidDependencyLabel : 'Postoje neispravne zavisnosti koje moraš da popraviš:'
    },

    SchedulerProBase : {
        propagating     : 'Proračunavam projekat',
        storePopulation : 'Učitavam podatke',
        finalizing      : 'Završavam rezultate'
    },

    EventSegments : {
        splitEvent    : 'Podeli događaj',
        renameSegment : 'Preimenuj'
    },

    NestedEvents : {
        createGroup         : 'Групиши изабране догађаје',
        newGroupName        : 'Нова група',
        deNestingNotAllowed : 'Уклањање из угнежђивања није дозвољено',
        nestingNotAllowed   : 'Угнежђивање није дозвољено'
    },

    VersionGrid : {
        compare       : 'Uporedi',
        description   : 'Opis',
        occurredAt    : 'Dogodilo se u',
        rename        : 'Preimenuj',
        restore       : 'Vrati',
        stopComparing : 'Zaustavi upoređivanje'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'zadatak',
            AssignmentModel : 'zaduženje',
            DependencyModel : 'veza',
            ProjectModel    : 'projekat',
            ResourceModel   : 'resurs',
            other           : 'objekat'
        },
        entityNamesPlural : {
            TaskModel       : 'zadaci',
            AssignmentModel : 'zaduženja',
            DependencyModel : 'veze',
            ProjectModel    : 'projekti',
            ResourceModel   : 'resursi',
            other           : 'objekti'
        },
        transactionDescriptions : {
            update : 'Promenjeno {n} {entities}',
            add    : 'Dodato {n} {entities}',
            remove : 'Uklonjeno {n} {entities}',
            move   : 'Pomereno {n} {entities}',
            mixed  : 'Promenjeno {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktivno',
            allDay                   : 'Ceo dan',
            allowOverlap             : 'Dozvoli preklapanje',
            barMargin                : 'Margina trake',
            bidirectional            : 'Dvosmerno',
            calendar                 : 'Kalendar',
            cls                      : 'CSS klasa',
            constraintDate           : 'Datum ograničenja',
            constraintType           : 'Tip ograničenja',
            daysPerMonth             : 'Dani po mesecu',
            daysPerWeek              : 'Dani po nedelji',
            delayFromParent          : 'Kašnjenje od roditelja',
            direction                : 'Smer',
            drawDependencies         : 'Prikaži zavisnosti',
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
            exceptionDates           : 'Datumi izuzetaka',
            fixed                    : 'Fiksno',
            from                     : 'Od',
            fromSide                 : 'Sa strane',
            hoursPerDay              : 'Sati po danu',
            href                     : 'Link',
            iconCls                  : 'Ikona',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignoriši kalendar resursa',
            ignoreTimeZone           : 'Ignoriši vremensku zonu',
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
            note                     : 'Beleška',
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
            showInTimeline           : 'Prikaži u vremenskoj liniji',
            startDate                : 'Datum početka',
            stickyContents           : 'Lepljivi sadržaji',
            strokeColor              : 'Boja linije',
            style                    : 'Stil',
            target                   : 'Cilj linka',
            to                       : 'Do',
            toSide                   : 'Do strane',
            type                     : 'Tip',
            units                    : 'Jedinice',
            unscheduled              : 'Nezakazano',
            unspecifiedTimeIsWorking : 'Neodređeno vreme je radno',
            version                  : 'Verzija'
        },
        intervals : {
            working    : 'Radno',
            nonWorking : 'Neradno',
            fromTo     : 'Od {from} do {to}',
            recurring  : 'Ponavljajući počevši {start} završavajući {end}'
        },
        addEntity         : 'Dodato {type} **{name}**',
        removeEntity      : 'Uklonjeno {type} **{name}**',
        updateEntity      : 'Promenjeno {type} **{name}**',
        moveEntity        : 'Pomereno {type} **{name}** od {from} do {to}',
        addDependency     : 'Dodata veza od **{from}** do **{to}**',
        removeDependency  : 'Uklonjena veza od **{from}** do **{to}**',
        updateDependency  : 'Izmenjena veza od **{from}** do **{to}**',
        addAssignment     : 'Dodeljen **{resource}** na **{event}**',
        removeAssignment  : 'Uklonjen zadatak sa **{resource}** od **{event}**',
        updateAssignment  : 'Izmenjen zadatak sa **{resource}** na **{event}**',
        noChanges         : 'Nema promena',
        nullValue         : 'nema',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Sačuvano u {date}',
        autoSavedAt       : 'Automatski sačuvano u {date}',
        undid             : 'Vraćene promene',
        redid             : 'Ponovo primenjene promene',
        editedTask        : 'Izmeni svojstva zadatka',
        deletedTask       : 'Obrisan zadatak',
        movedTask         : 'Pomeren zadatak',
        movedTasks        : 'Pomereni zadaci'
    }
};

export default LocaleHelper.publishLocale(locale);
