import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Pl',
    localeDesc : 'Polski',
    localeCode : 'pl',
    localeRtl  : false,

    Object : {
        Yes      : 'Tak',
        No       : 'Nie',
        Cancel   : 'Anuluj',
        Ok       : 'OK',
        Week     : 'Tydzień',
        None     : 'Brak',
        previous : 'Poprzedni',
        next     : 'Następny',
        to       : 'do',
        at       : 'o',
        on       : 'na',
        editing  : what => `Edycja ${what}`,
        settings : 'Ustawienia',
        close    : 'Zamknij',
        go       : 'Idź',
        save     : 'Zapisz',
        cancel   : 'Anuluj',
        revert   : 'Przywróć',
        collapse : 'Zwiń',
        expand   : 'Rozwiń',
        today    : 'Dzisiaj',
        andNMore : n => `i ${n} więcej`
    },

    AIBase : {
        delayStatusTexts : [
            'Oczekiwanie',
            'Oczekiwanie ...',
            'Wciąż oczekiwanie',
            'Wciąż oczekiwanie ...'
        ],
        autoStartDialogMessage        : 'Czy chcesz włączyć aktywację głosową AI?',
        voiceActivationToast          : phrase => `Aktywacja głosowa włączona, użyj frazy "${phrase}" aby rozpocząć rozmowę`,
        voiceControlNotSupportedToast : 'Sterowanie głosowe nie jest obsługiwane na tym urządzeniu',
        voiceControlErrorToast        : 'Nie udało się uruchomić sterowania głosowego na Twoim urządzeniu',
        voiceControlSilenceToast      : phrase => `Rozmowa głosowa AI zakończona z powodu ciszy. Użyj frazy ${phrase} aby wznowić rozmowę`,
        noAudioDetected               : 'Nie wykryto dźwięku, spróbuj ponownie',
        transcriptionErrorToast       : 'Transkrypcja nie powiodła się, spróbuj ponownie',
        playbackErrorToast            : 'Odtwarzanie dźwięku nie powiodło się, sprawdź swoje urządzenie wyjściowe audio',
        failed                        : '(niepowodzenie)',
        awaitingConfirmation          : 'Oczekiwanie na potwierdzenie',
        timeoutToast                  : 'Wiadomość wygasła',
        readingStatusText             : modelName => `Czytanie ${modelName}ów`,
        updatingStatusText            : modelName => `Aktualizacja ${modelName}ów`,
        removingStatusText            : modelName => `Usuwanie ${modelName}ów`,
        addingStatusText              : modelName => `Dodawanie ${modelName}`,
        filteringStatusText           : modelName => `Filtrowanie ${modelName}ów`,
        thinkingStatusText            : 'Myślenie',
        processingStatusText          : 'Przetwarzanie'
    },

    AISettingsPanel : {
        highlight               : 'Podświetlenie',
        verbosity               : 'Szczegółowość',
        voiceActivation         : 'Aktywacja głosowa',
        enableVoiceActivation   : 'Włącz aktywację głosową',
        voiceOnly               : 'Tylko głos',
        autostart               : 'Autostart',
        dataChangeConfirmations : 'Potwierdzenia zmiany danych',
        add                     : 'Dodaj',
        remove                  : 'Usuń',
        update                  : 'Aktualizuj',
        planning                : 'Planowanie',
        enablePlanning          : 'Włącz planowanie',
        aiModel                 : 'Model AI',
        timeline                : 'Oś czasu',
        'in-view'               : 'W widoku',
        all                     : 'Wszystko',
        timeRangeContext        : 'Kontekst zakresu czasu'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI mówi',
        recordingTooltip      : 'Nagrywanie',
        waitingTooltip        : 'AI myśli',
        startRecordingTooltip : 'Kliknij, aby rozpocząć',
        stopRecordingTooltip  : 'Kliknij, aby zatrzymać',
        inactiveTooltip       : 'Nie nagrywa',
        openChatTooltip       : 'Kliknij prawym przyciskiem, aby otworzyć czat'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Wpisz wiadomość',
        noConnectionTooltip     : 'Nie wykryto połączenia, kliknij, aby spróbować ponownie',
        undone                  : 'cofnięte',
        aborted                 : '(przerwane)',
        readAloudTooltip        : 'Przeczytaj wiadomość na głos',
        confidenceTooltip       : confidence => `Pewność: ${confidence}%`,
        undoTooltip             : 'Cofnij zmiany danych',
        redoTooltip             : 'Ponów zmiany danych',
        thumbsUp                : 'Kciuk w górę',
        thumbsDown              : 'Kciuk w dół',
        feedbackToast           : 'Dziękujemy za opinię!',
        clearChat               : 'Wyczyść czat',
        closeChat               : 'Zamknij czat',
        settings                : 'Ustawienia',
        closeSettings           : 'Zamknij ustawienia'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Wybierz dokładnie ${min}`,
        tooFewOptionsSelected     : min => `Wybierz co najmniej ${min}`,
        tooManyOptionsSelected    : max => `Wybierz nie więcej niż ${max}`
    },

    CodeEditor : {
        apply        : 'Zastosuj',
        autoApply    : 'Automatyczne zastosowanie',
        downloadCode : 'Pobierz kod'
    },

    ColorPicker : {
        noColor : 'Brak koloru'
    },

    Combo : {
        noResults          : 'Brak wyników',
        recordNotCommitted : 'Dokument nie mógł zostać dodany',
        addNewValue        : value => `Add ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Podświetl',
        preview         : 'Podgląd',
        approve         : 'Zatwierdź',
        reject          : 'Odrzuć',
        confirmAdd      : 'Potwierdź dodanie:',
        confirmUpdate   : 'Potwierdź aktualizację:',
        confirmRemove   : 'Potwierdź usunięcie:',
        confirmCopy     : 'Potwierdź kopiowanie',
        confirmAssign   : 'Potwierdź przypisanie',
        confirmReassign : 'Potwierdź ponowne przypisanie',
        confirmUnassign : 'Potwierdź odwołanie przypisania',
        confirmLink     : 'Potwierdź link',
        confirmUnlink   : 'Potwierdź odłączenie'
    },

    FilePicker : {
        file : 'Plik'
    },

    Field : {
        badInput              : 'Nieprawidłowa wartość pola',
        patternMismatch       : 'Wartość powinna pasować do określonego wzorca',
        rangeOverflow         : value => `Wartość powinna być mniejsza lub równa ${value.max}`,
        rangeUnderflow        : value => `Wartość musi być większa lub równa ${value.min}`,
        stepMismatch          : 'Wartość powinna pasować do kroku',
        tooLong               : 'Wartość powinna być krótsza',
        tooShort              : 'Wartość powinna być dłuższa',
        typeMismatch          : 'Wartość musi być w specjalnym formacie',
        valueMissing          : 'To pole jest wymagane',
        invalidValue          : 'Nieprawidłowa wartość pola',
        minimumValueViolation : 'Naruszenie wartości minimalnej',
        maximumValueViolation : 'Naruszenie wartości maksymalnej',
        fieldRequired         : 'To pole jest wymagane',
        validateFilter        : 'Wartość należy wybrać z listy'
    },

    DateField : {
        invalidDate : format => 'Nieprawidłowy format daty, oczekiwany format to ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Przejdź do poprzedniego roku',
        gotoPrevMonth : 'Przejdź do poprzedniego miesiąca',
        gotoNextMonth : 'Przejdź do następnego miesiąca',
        gotoNextYear  : 'Przejdź do następnego roku',
        navigation    : 'Nawigacja wyboru daty'
    },

    Hint : {
        dontShowAgain : 'Nie pokazuj ponownie'
    },

    NumberFormat : {
        locale   : 'pl',
        currency : 'PLN'
    },

    DurationField : {
        invalidUnit : 'Nieprawidłowa jednostka'
    },

    TimeField : {
        invalidTime : 'Nieprawidłowe wprowadzenie czasu'
    },

    TimePicker : {
        hour   : 'Godzina',
        minute : 'Minuta',
        second : 'Sekunda'
    },

    Tooltip : {
        loading : 'Ładowanie...'
    },

    List : {
        loading   : 'Ładowanie…',
        selectAll : 'Zaznacz wszystko'
    },

    GridBase : {
        loadMask : 'Ładowanie…',
        syncMask : 'Zapisywanie zmian, proszę czekać…'
    },

    PagingToolbar : {
        firstPage         : 'Przejdź do pierwszej strony',
        prevPage          : 'Przejdź do poprzedniej strony',
        page              : 'Strona',
        nextPage          : 'Przejdź do następnej strony',
        lastPage          : 'Przejdź do ostatniej strony',
        reload            : 'Odśwież bieżącą stronę',
        noRecords         : 'Brak danych do wyświetlenia',
        pageCountTemplate : data => `z ${data.lastPage}`,
        summaryTemplate   : data => `Wyświetlanie danych ${data.start} - ${data.end} z ${data.allCount}`
    },

    Popup : {
        close    : 'Zamknij wyskakujące okienko',
        maximize : 'Maksymalizuj'
    },

    Splitter : {
        ariaLabel      : 'Splitter, użyj klawiszy strzałek, aby zmienić rozmiar sąsiednich paneli',
        collapseLeft   : 'Zwiń lewy panel',
        collapseRight  : 'Zwiń prawy panel',
        collapseTop    : 'Zwiń górny panel',
        collapseBottom : 'Zwiń dolny panel',
        expandLeft     : 'Rozwiń lewy panel',
        expandRight    : 'Rozwiń prawy panel',
        expandTop      : 'Rozwiń górny panel',
        expandBottom   : 'Rozwiń dolny panel'
    },

    TabPanel : {
        containsInvalidFields : 'Karta zawiera nieprawidłowe pola'
    },

    Toolbar : {
        showOverflowingItems : 'Pokaż przepełnione elementy',
        scrollForMore        : 'Przewiń, aby zobaczyć więcej'
    },

    UndoRedo : {
        Undo           : 'Cofnij',
        Redo           : 'Popraw',
        UndoLastAction : 'Cofnij ostatnie działanie',
        RedoLastAction : 'Popraw ostatnie cofnięte działanie',
        NoActions      : 'Brak elementów w kolejce cofania'
    },

    FieldFilterPicker : {
        equals                 : 'równa się',
        doesNotEqual           : 'nie równa się',
        isEmpty                : 'pusty',
        isNotEmpty             : 'nie jest pusty',
        contains               : 'zawiera',
        doesNotContain         : 'nie zawiera',
        startsWith             : 'zaczyna się od',
        endsWith               : 'kończy się',
        isOneOf                : 'należy do',
        isNotOneOf             : 'nie należy do',
        isGreaterThan          : 'jest większa niż',
        isLessThan             : 'jest mniejsza niż',
        isGreaterThanOrEqualTo : 'jest większa lub równa',
        isLessThanOrEqualTo    : 'jest mniejsza lub równa',
        isBetween              : 'jest pomiędzy',
        isNotBetween           : 'nie jest pomiędzy',
        isBefore               : 'jest przed',
        isAfter                : 'jest po',
        timeEquals             : 'czas jest równy',
        timeDoesNotEqual       : 'czas nie jest równy',
        isToday                : 'jest dziś',
        isTomorrow             : 'jest jutro',
        isYesterday            : 'było wczoraj',
        isThisWeek             : 'jest w tym tygodniu',
        isNextWeek             : 'jest w następnym tygodniu',
        isLastWeek             : 'jest w zeszłym tygodniu',
        isThisMonth            : 'jest w tym miesiącu',
        isNextMonth            : 'jest w następnym miesiącu',
        isLastMonth            : 'jest w zeszłym miesiącu',
        isThisYear             : 'jest w tym roku',
        isNextYear             : 'jest w następnym roku',
        isLastYear             : 'jest w zeszłym roku',
        isYearToDate           : 'jest aktualna',
        isTrue                 : 'jest prawdziwa',
        isFalse                : 'jest fałszywa',
        selectAProperty        : 'Wybierz właściwość',
        selectAnOperator       : 'Wybierz operatora',
        caseSensitive          : 'Istotna wielkość liter',
        and                    : 'i',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Wybierz wartość',
        selectOneOrMoreValues  : 'Wybierz przynajmniej jedną wartość',
        enterAValue            : 'Wprowadź wartość',
        enterANumber           : 'Wprowadź numer',
        selectADate            : 'Wybierz datę',
        selectATime            : 'Wybierz czas'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Dodaj filtr',
        applyCond : applied => applied ? 'Pomiń filtr (obecnie zastosowany)' : 'Zastosuj filtr (obecnie pominięty)'
    },

    DateHelper : {
        locale         : 'pl',
        weekStartDay   : 1,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : 'milisekunda', plural : 'milisekundy', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'sekunda', plural : 'sekundy', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minuta', plural : 'minuty', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'godzina', plural : 'godziny', abbrev : 'godz.' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'dzień', plural : 'dni', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'tydzień', plural : 'tygodnie', abbrev : 'tyg.' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'miesiąc', plural : 'miesiące', abbrev : 'm.' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'kwartał', plural : 'kwartały', abbrev : 'kw.' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'rok', plural : 'lata', abbrev : 'r.' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'dekada', plural : 'dekady', abbrev : 'dek.' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil.'],
            [],
            ['s', 'sek'],
            [],
            ['m', 'min.'],
            [],
            ['godz.', 'hr'],
            [],
            ['d'],
            [],
            ['t', 'tydz.'],
            [],
            ['m', 'mies.', 'mnt'],
            [],
            ['k', 'kw.', 'qrt'],
            [],
            ['r', 'rok'],
            [],
            ['dek.'],
            []
        ],
        parsers : {
            L   : 'DD.MM.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '.',
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}-te lata`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
