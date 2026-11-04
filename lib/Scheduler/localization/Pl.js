import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Pl.js';
import '../../Grid/localization/Pl.js';

const locale = {

    localeName : 'Pl',
    localeDesc : 'Polski',
    localeCode : 'pl',
    localeRtl  : false,

    Object : {
        newEvent    : ' Nowe wydarzenie',
        information : 'Informacje',
        showDetails : 'Pokaż szczegóły'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' wydarzeni' + (data !== 1 ? 'a' : 'e')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Przełącz kolumnę układu zasobów. SPACE dla menu kontekstowego.'
    },

    Dependencies : {
        from    : 'From',
        to      : 'To',
        valid   : 'Ważny',
        invalid : 'Nieważny'
    },

    DependencyType : {
        SS           : 'PP',
        SF           : 'PK',
        FS           : 'KP',
        FF           : 'KK',
        StartToStart : 'Od początku do początku',
        StartToEnd   : 'Od początku do końca',
        EndToStart   : 'Od końca do początku',
        EndToEnd     : 'Od końca do końca',
        short        : [
            'PP',
            'PK',
            'KP',
            'KK'
        ],
        long : [
            'Od początku do początku',
            'Od początku do końca',
            'Od końca do początku',
            'Od końca do końca'
        ]
    },

    DependencyEdit : {
        From              : 'Od',
        To                : 'Do',
        Type              : 'Rodzaj',
        Lag               : 'Lag',
        color             : 'Kolor',
        lineStyle         : 'Styl linii',
        solid             : 'Ciągła',
        dashed            : 'Kreskowana',
        dotted            : 'Kropkowana',
        dashDot           : 'Kreska-kropka',
        longDash          : 'Długa kreska',
        'Edit dependency' : 'Edytuj zależność',
        Save              : 'Zapisz',
        Delete            : 'Usuń',
        Cancel            : 'Anuluj',
        StartToStart      : 'Od początku do początku',
        StartToEnd        : 'Od początku do końca',
        EndToStart        : 'Od końca do początku',
        EndToEnd          : 'Od końca do końca',
        Active            : 'Aktywny'
    },

    EventEdit : {
        Name           : 'Nazwa',
        Resource       : 'Zasób',
        Start          : 'Początek',
        startTime      : 'Czas rozpoczęcia',
        End            : 'Koniec',
        endTime        : 'Czas zakończenia',
        Save           : 'Zapisz',
        Delete         : 'Usuń',
        Cancel         : 'Anuluj',
        'Edit event'   : 'Edytuj wydarzenie',
        Repeat         : 'Powtórz',
        editRecurrence : 'Edytuj powtarzanie'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Wydarzenie nakłada się na istniejące wydarzenie dla tego zasobu',
        noDropOutsideTimeline   : 'Wydarzenie nie może zostać całkowicie usunięte poza osią czasu',
        duplicateAssignmentDrag : 'Wydarzenie nie może być przypisane wiele razy do tego samego zasobu'
    },

    SchedulerBase : {
        'Add event'      : 'Dodaj wydarzenie',
        'Delete event'   : 'Usuń wydarzenie',
        'Unassign event' : 'Cofnij przypisanie wydarzenia',
        color            : 'Kolor',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, zaczyna się o ${startDate} ${eventRecord.duration > 0 ? `na ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Powiększenie',
        activeDateRange : 'Zakres dat',
        startText       : 'Data rozpoczęcia',
        endText         : 'Data zakończenia',
        todayText       : 'Dzisiaj'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Oś czasu pokazuje od ${startDate} do ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Kopiuj wydarzenie',
        cutEvent   : 'Wytnij wydarzenie',
        pasteEvent : 'Wklej wydarzenie'
    },

    EventFilter : {
        filterEvents : 'Filtruj zadania',
        byName       : 'Według nazwy'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Pokaż aktualną oś czasu'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Sekundy'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD.MM, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD.MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Dzień'
        },
        day : {
            name : 'Dzień/godzina'
        },
        week : {
            name : 'Tydzień/godzina'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Tydzień/dni'
        },
        dayAndMonth : {
            name : 'Miesiąc'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Tydzień'
        },
        weekAndMonth : {
            name : 'Tygodnie'
        },
        weekAndDayLetter : {
            name : 'Tygodnie/dni tygodnia'
        },
        weekDateAndMonth : {
            name : 'Miesiące/tygodnie'
        },
        monthAndYear : {
            name : 'Miesiące'
        },
        year : {
            name : 'Lata'
        },
        manyYears : {
            name : 'Kilka lat'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Usuwasz wydarzenie',
        'delete-all-message'        : 'Czy chcesz usunąć wszystkie przypadki wystąpienia tego wydarzenia?',
        'delete-further-message'    : 'Czy chcesz usunąć ten oraz przyszłe przypadki wystąpienia tego wydarzenia lub tylko wybrany przypadek?',
        'delete-only-this-message'  : 'Czy chcesz usunąć to wystąpienie tego wydarzenia?',
        'delete-further-btn-text'   : 'Usuń wszystkie przyszłe wydarzenia',
        'delete-only-this-btn-text' : 'Usuń tylko to wydarzenie',
        'update-title'              : 'Zmieniasz powtarzające się wydarzenie',
        'update-all-message'        : 'Czy chcesz zmienić wszystkie przypadki wystąpienia tego wydarzenia?',
        'update-further-message'    : 'Czy chcesz zmienić tylko ten przypadek wystąpienia wydarzenia lub ten oraz przyszłe przypadki?',
        'update-only-this-message'  : 'Czy chcesz zmienić to wystąpienie tego wydarzenia?',
        'update-further-btn-text'   : 'Wszystkie przyszłe wydarzenia',
        'update-only-this-btn-text' : 'Tylko to wydarzenie',
        Yes                         : 'Tak',
        Cancel                      : 'Anuluj',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' oraz ',
        Daily                           : 'Codziennie',
        'Weekly on {1}'                 : ({ days }) => `Cotygodniowo w ${days}`,
        'Monthly on {1}'                : ({ days }) => `Miesięcznie w ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Rocznie w ${days} of ${months}`,
        'Every {0} days'                : ({ interval }) => `Co${interval} dni`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Co ${interval} tygodni w ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Co ${interval} miesięcy w ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Co${interval} lat w ${days} of ${months}`,
        position1                       : 'pierwszy',
        position2                       : 'drugi',
        position3                       : 'trzeci',
        position4                       : 'czwarty',
        position5                       : 'piąty',
        'position-1'                    : 'ostatni',
        day                             : 'dzień',
        weekday                         : 'dzień tygodnia',
        'weekend day'                   : 'dzień weekendu',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Powtórz wydarzenie',
        Cancel              : 'Anuluj',
        Save                : 'Zapisz',
        Frequency           : 'Częstotliwość',
        Every               : 'Co',
        DAILYintervalUnit   : 'dni',
        WEEKLYintervalUnit  : 'tygodni',
        MONTHLYintervalUnit : 'miesięcy',
        YEARLYintervalUnit  : 'lat',
        Each                : 'Każdy',
        on                  : 'W dniu',
        the                 : 'So',
        'On the'            : 'W',
        'End repeat'        : 'Zakończ powtórzenie',
        'time(s)'           : 'godzina(-y)',
        Days                : 'Dni',
        Months              : 'Miesiące'
    },

    RecurrenceDaysCombo : {
        day           : 'dzień',
        weekday       : 'dzień tygodnia',
        'weekend day' : 'dzień weekendu'
    },

    RecurrencePositionsCombo : {
        position1    : 'pierwszy',
        position2    : 'drugi',
        position3    : 'trzeci',
        position4    : 'czwarty',
        position5    : 'piąty',
        'position-1' : 'ostatni'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Nigdy',
        After     : 'Po',
        'On date' : 'Dnia'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Bez powtórzeń',
        Daily   : 'Codziennie',
        Weekly  : 'Co tydzień',
        Monthly : 'Co miesiąc',
        Yearly  : 'Co rok'
    },

    RecurrenceCombo : {
        None   : 'Żaden',
        Custom : 'Standard...'
    },

    Summary : {
        'Summary for' : date => `Podsumowanie dla ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Complete harmonogram',
        currentview  : 'Widoczny harmonogram',
        daterange    : 'Zakres dat',
        completedata : 'Pełen harmonogram (wszystkich wydarzeń)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Zakres harmonogramu',
        'Export from'    : 'Od',
        'Export to'      : 'Do'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Pojedyncza strona'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Pojedyncza strona (bez skalowania)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Wiele stron (pionowo)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Nie przydzielono żadnego zasobu'
    },

    CrudManagerView : {
        serverResponseLabel : 'Odpowiedź serwera:'
    },

    DurationColumn : {
        Duration : 'Czas trwania'
    },

    EventClusteringBase : {
        unnamed         : 'Bez nazwy',
        more            : count => `+ jeszcze ${count}`,
        clusteredEvents : count => `Zgrupowane wydarzenia: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Zgrupowane zakresy: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Żaden',
        assoonaspossible    : 'Najwcześniej jak to możliwe',
        aslateaspossible    : 'Najpóźniej jak to możliwe',
        muststarton         : 'Musi rozpocząć się dnia',
        mustfinishon        : 'Musi zakończyć się dnia',
        startnoearlierthan  : 'Rozpocznie się nie wcześniej niż',
        startnolaterthan    : 'Rozpocznie się nie później niż',
        finishnoearlierthan : 'Zakończy się nie wcześniej niż',
        finishnolaterthan   : 'Zakończy się nie później niż'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} czas buforowy przed wydarzeniem`;
            }
            if (postamble) {
                description += `.${postamble.toString()} czas buforowy po wydarzeniu`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Do przodu',
        Backward      : 'Do tyłu',
        inheritedFrom : 'Odziedziczone z',
        enforcedBy    : 'Narzucone przez'
    },

    CalendarField : {
        'Default calendar' : 'Kalendarz domyślny',
        editCalendar       : 'Edytuj kalendarz'
    },

    TaskEditorBase : {
        Information   : 'Informacje o zadaniu',
        Save          : 'Zapisz',
        Cancel        : 'Anuluj',
        Delete        : 'Usuń',
        calculateMask : 'Liczenie…',
        saveError     : 'Nie można zapisać, proszę najpierw poprawić błędy',
        repeatingInfo : 'Wyświetlanie powtarzającego się zdarzenia',
        editRepeating : 'Edytuj'
    },

    TaskEdit : {
        editEvent              : 'Zmień wydarzenie',
        ConfirmDeletionTitle   : 'Potwierdź usunięcie',
        ConfirmDeletionMessage : 'Czy na pewno chcesz usunąć to wydarzenie?'
    },

    GanttTaskEditor : {
        editorWidth : '44em'
    },

    SchedulerTaskEditor : {
        editorWidth : '35em'
    },

    SchedulerGeneralTab : {
        General      : 'Ogólne',
        Name         : 'Nazwa',
        Resources    : 'Zasoby',
        '% complete' : 'Kompletne w %',
        Duration     : 'Czas trwania',
        Start        : 'Początek',
        Finish       : 'Koniec',
        Effort       : 'Wysiłek',
        Preamble     : 'Preambuła',
        Postamble    : 'Postambuła'
    },

    GeneralTab : {
        General      : 'Ogólne',
        Name         : 'Nazwa',
        '% complete' : 'Kompletny w %',
        Duration     : 'Czas trwania',
        Start        : 'Rozpocznij',
        Finish       : 'Zakończ',
        Effort       : 'Wysiłek',
        Dates        : 'Daty'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Zaawansowany',
        Calendar                   : 'Kalendarz',
        'Scheduling mode'          : 'Tryb planowania',
        'Effort driven'            : 'Napędzany wysiłek',
        'Manually scheduled'       : 'Zaplanowany ręcznie',
        'Constraint type'          : 'Rodzaj ograniczenia',
        'Constraint date'          : 'Data ograniczenia',
        Inactive                   : 'Nieaktywny',
        'Ignore resource calendar' : 'Ignoruj kalendarz zasobów'
    },

    CalendarEditorDatePicker : {
        addException : 'Dodaj wyjątek',
        addWeek      : 'Dodaj tydzień'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Dodaj wyjątek',
        removeException : 'Usuń wyjątek',
        noRows          : 'Nie dodano wyjątków'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Dodaj tydzień',
        removeWeek : 'Usuń tydzień'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Dni działają domyślnie',
        workingTimeCalendar        : 'Kalendarz czasu pracy',
        exceptions                 : 'Wyjątki',
        general                    : 'Ogólny',
        name                       : 'Nazwa',
        parent                     : 'Rodzic',
        save                       : 'Ratować',
        weeks                      : 'Tygodnie',
        error                      : 'Błąd',
        inputErrors                : 'Istnieją błędy wejściowe. Napraw je przed zapisaniem zmian.',
        delete                     : 'Usuwać',
        addCalendar                : 'Dodaj kalendarz',
        confirmation               : 'Potwierdzenie',
        removeCalendarWithChildren : 'Kalendarz ma kalendarze dziecięce. Kliknij „Tak”, aby usunąć kalendarz ze swoimi dziećmi.',
        removeCalendarAndLinks     : 'Kalendarz jest używany przez niektóre rekordy. Kliknij „Tak”, aby je odłączyć i usunąć kalendarz.',
        newException               : 'Nowy wyjątek',
        newWeek                    : 'Nowy tydzień'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' działa',
        isNotWorking : ' nie działa',
        basedOn      : ' oparte na:',
        byDefault    : 'domyślnie',
        rangeTpl     : (start, end) => `${start} do ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Dzień roboczy',
        nonWorkingDay : 'Dzień wolny od pracy'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Są nakładające się zakresy',
        errorMissingDate   : 'Wymagany jest czas rozpoczęcia i zakończenia',
        errorStartAfterEnd : 'Czas rozpoczęcia nie może być po zakończeniu'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Nazwa',
        from                                 : 'Z',
        to                                   : 'Do',
        is                                   : 'Jest',
        nonWorking                           : 'Nie pracujący',
        working                              : 'Pracujący',
        hours                                : 'godziny',
        repeat                               : 'Powtarzać',
        repeatEnd                            : 'Powtórz koniec',
        errorMissingDate                     : 'Wymagany jest zakres daty wyjątku',
        errorStartAfterEnd                   : 'Data "Z" nie może być po dniu "DO" ',
        errorStartAndEndRepeatNumberMismatch : 'Wyjątek powinien się rozpocząć i zakończyć tę samą liczbę razy'
    },

    CalendarEditorWeekPanel : {
        name        : 'Nazwa',
        from        : 'Z',
        to          : 'Do',
        days        : 'Dni',
        copyDay     : 'Kopiowanie dnia',
        pasteDay    : 'Wklej dzień',
        stopCopying : 'Przestań kopiować'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Dodaj zakres',
        removeRange : 'Usuń zakres'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : 'Data "Z" nie może być po dniu "DO" ',
        errorNoDefaultWeek           : 'Wymagana jest konfiguracja tygodnia',
        errorMultipleDefaultWeeks    : 'Określono więcej niż jeden domyślny tydzień',
        errorNoWeekAvailability      : 'Tydzień musi zapewnić trochę czasu pracy',
        errorInvalidWeekAvailability : 'Tydzień ma błędy konfiguracji czasu pracy',
        noRows                       : 'Nie dodano tygodni'
    },

    AdvancedTab : {
        Advanced                   : 'Zaawansowany',
        Calendar                   : 'Kalendarz',
        'Scheduling mode'          : 'Tryb planowania',
        'Effort driven'            : 'Napędzany wysiłek',
        'Manually scheduled'       : 'Zaplanowany ręcznie',
        'Constraint type'          : 'Rodzaj ograniczenia',
        'Constraint date'          : 'Data ograniczenia',
        Constraint                 : 'Ograniczenie',
        Rollup                     : 'Zestawienie',
        Inactive                   : 'Nieaktywny',
        'Ignore resource calendar' : 'Ignoruj kalendarz zasobów',
        'Scheduling direction'     : 'Kierunek harmonogramu',
        projectBorder              : 'Granica projektu',
        ignore                     : 'Ignorować',
        honor                      : 'Honor',
        askUser                    : 'Zapytaj użytkownika'
    },

    DependencyTab : {
        Predecessors      : 'Poprzednie wydarzenia',
        Successors        : 'Następne wydarzenia',
        ID                : 'Identyfikator',
        Name              : 'Nazwa',
        Type              : 'Rodzaj',
        Lag               : 'Lag',
        cyclicDependency  : 'Cykliczna zależność',
        invalidDependency : 'Nieważna zależność',
        readOnlyTask      : 'Nie można połączyć zadania tylko do odczytu'
    },

    NotesTab : {
        Notes : 'Uwagi'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalendarz'
    },

    ResourceEdit : {
        editResource : 'Edytuj zasób'
    },

    ResourceEditor : {
        resourceInformation : 'Informacje o zasobach',
        costs               : 'Koszty',
        save                : 'Ratować',
        error               : 'Błąd',
        inputErrors         : 'Występują błędy wejściowe. Popraw je przed zapisaniem zmian.',
        delete              : 'Usuwać',
        confirmation        : 'Potwierdzenie',
        removeUsedResource  : 'Zasób jest przypisany do niektórych zadań. Kliknij „Tak”, aby mimo to usunąć zasób.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalendarz',
        general     : 'Ogólny',
        label       : 'Etykieta materiałowa',
        name        : 'Nazwa zasobu',
        type        : 'Typ',
        costAccrual : 'Naliczanie kosztów',
        labelHint   : 'na przykład kg, tony lub pudełka',
        maxUnits    : 'Maksymalna liczba jednostek'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Naliczaj o godz',
        prorated : 'Proporcjonalne',
        start    : 'Start',
        end      : 'Koniec'
    },

    CostAccrualField : {
        prorated : 'Proporcjonalne',
        start    : 'Start',
        end      : 'Koniec'
    },

    ResourceType : {
        work     : 'Praca',
        material : 'Tworzywo',
        cost     : 'Koszt'
    },

    ResourceTypeColumn : {
        type : 'Typ'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Tabela stawek',
        newGroup     : 'Nowy stół',
        removeGroup  : 'Usuń tabelę',
        useByDefault : 'Użyj domyślnie dla przypisań zasobów',
        noRates      : 'Brak stawek'
    },

    ResourceGrid : {
        name          : 'Nazwa',
        materialLabel : 'Etykieta materiałowa',
        maxUnits      : 'Maksymalna liczba jednostek',
        cost          : 'Koszt',
        noRows        : 'Brak zasobów'
    },

    ResourceRateTableContainer : {
        startDate    : 'Data rozpoczęcia',
        standardRate : 'Stawka standardowa',
        perUseCost   : 'Koszt użycia',
        addRate      : 'Dodaj stawkę',
        removeRate   : 'Usuń stawkę',
        name         : 'Nazwa',
        noRates      : 'Brak stawek'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Informacje o tabeli stawek'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Ilość',
        Resources   : 'Zasoby',
        Resource    : 'Zasób',
        Units       : 'Jednostki',
        cost        : 'Koszt',
        effort      : 'Wysiłek',
        start       : 'Start',
        finish      : 'Skończyć',
        preamble    : 'Przedmowa',
        postamble   : 'Zakończenie'
    },

    RateTableColumn : {
        rateTable : 'Tabela stawek'
    },

    RecurrenceTab : {
        title : 'Powtórz'
    },

    SchedulingModePicker : {
        Normal           : 'Zwykły',
        'Fixed Duration' : 'Określony czas trwania',
        'Fixed Units'    : 'Określone jednostki',
        'Fixed Effort'   : 'Określony wysiłek'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} z {available}</span> przydzielonych',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} z{available}</span> przydzielonych',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} z {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} z {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'Dnia{startDate}<br><span class="{cls}">{allocated} z{available}</span> przydzielonych:<br>{assignments}',
        plusMore              : '+{value} więcej'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Wysiłek</div><div class="b-effort-value {cls}">{allocated} z {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Wysiłek</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Koszt</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Ilość</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} w dniu {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Podsumowanie dla {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Podsumowanie dla {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} więcej',
        nameColumnText        : 'Zasób / Wydarzenie'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Anuluj zmianę i nic więcej nie rób',
        schedulingConflict : 'Konflikt harmonogramów',
        emptyCalendar      : 'Błąd konfiguracji kalendarza',
        cycle              : 'Cykl harmonogramu',
        Apply              : 'Zastosuj'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Proszę wybrać zależność',
        invalidDependencyLabel : 'Istnieją nieprawidłowe zależności, które należy rozwiązać:'
    },

    SchedulerProBase : {
        propagating     : 'Obliczanie projektu',
        storePopulation : 'Ładowanie danych',
        finalizing      : 'Finalizowanie wyników'
    },

    EventSegments : {
        splitEvent    : 'Podziel wydarzenie',
        renameSegment : 'Zmień nazwę'
    },

    NestedEvents : {
        createGroup         : 'Grupuj wybrane wydarzenia',
        newGroupName        : 'Nowa grupa',
        deNestingNotAllowed : 'Nie można cofnąć osadzenia',
        nestingNotAllowed   : 'Osadzenie nie jest możliwe'
    },

    VersionGrid : {
        compare       : 'Porównaj',
        description   : 'Opis',
        occurredAt    : 'Zdarzyło się',
        rename        : 'Zmień nazwę',
        restore       : 'Przywróć',
        stopComparing : 'Przestań porównywać'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'zadanie',
            AssignmentModel : 'przydział',
            DependencyModel : 'łącze',
            ProjectModel    : 'projekt',
            ResourceModel   : 'zasób',
            other           : 'obiekt'
        },
        entityNamesPlural : {
            TaskModel       : 'zadania',
            AssignmentModel : 'przydziały',
            DependencyModel : 'łącza',
            ProjectModel    : 'projekty',
            ResourceModel   : 'zasoby',
            other           : 'obiekty'
        },
        transactionDescriptions : {
            update : 'Zmieniono {n} {entities}',
            add    : 'Dodano {n} {entities}',
            remove : 'Usunięto {n} {entities}',
            move   : 'Przeniesiono {n} {entities}',
            mixed  : 'Zmieniono {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktywny',
            allDay                   : 'Cały dzień',
            allowOverlap             : 'Zezwól na nakładanie się',
            barMargin                : 'Margines paska',
            bidirectional            : 'Dwukierunkowy',
            calendar                 : 'Kalendarz',
            cls                      : 'Klasa CSS',
            constraintDate           : 'Data ograniczenia',
            constraintType           : 'Typ ograniczenia',
            daysPerMonth             : 'Dni w miesiącu',
            daysPerWeek              : 'Dni w tygodniu',
            delayFromParent          : 'Opóźnienie od nadrzędnego',
            direction                : 'Kierunek',
            drawDependencies         : 'Rysuj zależności',
            duration                 : 'Czas trwania',
            durationUnit             : 'Jednostka czasu trwania',
            effort                   : 'Wysiłek',
            effortDriven             : 'Napędzany wysiłkiem',
            effortUnit               : 'Jednostka wysiłku',
            endDate                  : 'Data zakończenia',
            eventColor               : 'Kolor',
            eventId                  : 'Identyfikator zdarzenia',
            eventLayout              : 'Układ wydarzenia',
            eventStyle               : 'Styl paska',
            exceptionDates           : 'Daty wyjątków',
            fixed                    : 'Stały',
            from                     : 'Od',
            fromSide                 : 'Od strony',
            hoursPerDay              : 'Godziny na dzień',
            href                     : 'Link',
            iconCls                  : 'Ikona',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignoruj kalendarz zasobów',
            ignoreTimeZone           : 'Ignoruj strefę czasową',
            image                    : 'Obraz',
            imageUrl                 : 'URL obrazu',
            inactive                 : 'Nieaktywny',
            intervals                : 'Interwały',
            lag                      : 'Opóźnienie',
            lagUnit                  : 'Jednostka opóźnienia',
            lineStyle                : 'Styl linii',
            manuallyScheduled        : 'Ręcznie zaplanowany',
            milestoneWidth           : 'Szerokość kamienia milowego',
            name                     : 'Nazwa',
            note                     : 'Notatka',
            parentId                 : 'Identyfikator nadrzędny',
            parentIndex              : 'Pozycja',
            percentDone              : '% wykonania',
            postamble                : 'Postamble',
            preamble                 : 'Preambuła',
            readOnly                 : 'Tylko do odczytu',
            recurrenceRule           : 'Reguła powtarzania',
            resourceId               : 'Identyfikator zasobu',
            resourceMargin           : 'Margines zasobu',
            rowHeight                : 'Wysokość wiersza',
            schedulingMode           : 'Tryb planowania',
            segments                 : 'Segmenty',
            showAvatar               : 'Pokaż awatar',
            showInTimeline           : 'Pokaż na osi czasu',
            startDate                : 'Data rozpoczęcia',
            stickyContents           : 'Przyklejone treści',
            strokeColor              : 'Kolor linii',
            style                    : 'Styl',
            target                   : 'Cel linku',
            to                       : 'Do',
            toSide                   : 'Do strony',
            type                     : 'Typ',
            units                    : 'Jednostki',
            unscheduled              : 'Nieplanowany',
            unspecifiedTimeIsWorking : 'Nieokreślony czas jest pracujący',
            version                  : 'Wersja'
        },
        intervals : {
            working    : 'Pracujący',
            nonWorking : 'Niepracujący',
            fromTo     : 'Od {from} do {to}',
            recurring  : 'Powtarzające się od {start} do {end}'
        },
        addEntity         : 'Dodano {type} **{name}**',
        removeEntity      : 'Usunięto {type} **{name}**',
        updateEntity      : 'Zmieniono {type} **{name}**',
        moveEntity        : 'Przeniesiono {type} **{name}** z {from} do {to}',
        addDependency     : 'Dodano łącze z **{from}** do **{to}**',
        removeDependency  : 'Usunięto łącze z **{from}** do **{to}**',
        updateDependency  : 'Edytowano łącze z **{from}** do **{to}**',
        addAssignment     : 'Przydzielono **{resource}** do **{event}**',
        removeAssignment  : 'Usunięto przydziału **{resource}** od **{event}**',
        updateAssignment  : 'Edycja przydziału **{resource}** do **{event}**',
        noChanges         : 'Brak zmian',
        nullValue         : 'brak',
        versionDateFormat : 'D/M/YYYY h:mm a',
        savedAt           : 'Zapisano o {date}',
        autoSavedAt       : 'Automatycznie zapisano o {date}',
        undid             : 'Cofnięto zmiany',
        redid             : 'Ponownie edytuj zmiany',
        editedTask        : 'Edytowano właściwości zadania',
        deletedTask       : 'Usunięto zadanie',
        movedTask         : 'Przesunięto zadanie',
        movedTasks        : 'Przesunięto zadania'
    }
};

export default LocaleHelper.publishLocale(locale);
