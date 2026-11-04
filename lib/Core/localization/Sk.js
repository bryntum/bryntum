import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Sk',
    localeDesc : 'Slovenský',
    localeCode : 'sk',
    localeRtl  : false,

    Object : {
        Yes      : 'Áno',
        No       : 'Nie',
        Cancel   : 'Zrušiť',
        Ok       : 'OK',
        Week     : 'Týždeň',
        None     : 'Žiadny',
        previous : 'Predchádzajúci',
        next     : 'Nasledujúci',
        to       : 'do',
        at       : 'o',
        on       : 'na',
        editing  : what => `Úprava ${what}`,
        settings : 'Nastavenia',
        close    : 'Zatvoriť',
        go       : 'Choď',
        save     : 'Uložiť',
        cancel   : 'Zrušiť',
        revert   : 'Obnoviť',
        collapse : 'Zbaliť',
        expand   : 'Rozbaliť',
        today    : 'Dnes',
        andNMore : n => `a ešte ${n}`
    },

    AIBase : {
        delayStatusTexts : [
            'Čakanie',
            'Čakanie ...',
            'Stále čakám',
            'Stále čakám ...'
        ],
        autoStartDialogMessage        : 'Chcete povoliť aktiváciu hlasu AI?',
        voiceActivationToast          : phrase => `Hlasová aktivácia povolená, použite frázu "${phrase}" na začatie konverzácie`,
        voiceControlNotSupportedToast : 'Hlasové ovládanie nie je podporované na tomto zariadení',
        voiceControlErrorToast        : 'Hlasové ovládanie sa nepodarilo spustiť na vašom zariadení',
        voiceControlSilenceToast      : phrase => `Hlasová konverzácia AI bola ukončená kvôli tichu. Použite frázu ${phrase} na opätovné spustenie konverzácie`,
        noAudioDetected               : 'Nebol zistený žiadny zvuk, skúste to znova',
        transcriptionErrorToast       : 'Prepis zlyhal, skúste to znova prosím',
        playbackErrorToast            : 'Prehrávanie zvuku zlyhalo, skontrolujte prosím vaše zvukové zariadenie',
        failed                        : '(zlyhalo)',
        awaitingConfirmation          : 'Čaká sa na potvrdenie',
        timeoutToast                  : 'Správa vypršala',
        readingStatusText             : modelName => `Čítanie ${modelName}ov`,
        updatingStatusText            : modelName => `Aktualizácia ${modelName}ov`,
        removingStatusText            : modelName => `Odstraňovanie ${modelName}ov`,
        addingStatusText              : modelName => `Pridávanie ${modelName}`,
        filteringStatusText           : modelName => `Filtrovanie ${modelName}ov`,
        thinkingStatusText            : 'Premýšľanie',
        processingStatusText          : 'Spracovanie'
    },

    AISettingsPanel : {
        highlight               : 'Zvýrazniť',
        verbosity               : 'Rozsiahlejší popis',
        voiceActivation         : 'Aktivácia hlasom',
        enableVoiceActivation   : 'Povoliť aktiváciu hlasom',
        voiceOnly               : 'Iba hlas',
        autostart               : 'Automatický štart',
        dataChangeConfirmations : 'Potvrdenie zmeny údajov',
        add                     : 'Pridať',
        remove                  : 'Odstrániť',
        update                  : 'Aktualizovať',
        planning                : 'Plánovanie',
        enablePlanning          : 'Povoliť plánovanie',
        aiModel                 : 'AI Model',
        timeline                : 'Časová os',
        'in-view'               : 'V zobrazení',
        all                     : 'Všetko',
        timeRangeContext        : 'Časový rozsah kontextu'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI hovorí',
        recordingTooltip      : 'Nahrávanie',
        waitingTooltip        : 'AI premýšľa',
        startRecordingTooltip : 'Kliknite na začatie',
        stopRecordingTooltip  : 'Kliknite na zastavenie',
        inactiveTooltip       : 'Nenahráva sa',
        openChatTooltip       : 'Kliknite pravým tlačidlom na otvorenie chatu'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Napíšte správu',
        noConnectionTooltip     : 'Nebola zistená žiadna pripojenie, kliknite na opätovné skúsenie',
        undone                  : 'zrušené',
        aborted                 : '(zrušené)',
        readAloudTooltip        : 'Prečítajte správu nahlas',
        confidenceTooltip       : confidence => `Dôvera: ${confidence}%`,
        undoTooltip             : 'Zrušiť zmeny údajov',
        redoTooltip             : 'Obnoviť zmeny údajov',
        thumbsUp                : 'Palec hore',
        thumbsDown              : 'Palec dole',
        feedbackToast           : 'Ďakujeme za vašu spätnú väzbu!',
        clearChat               : 'Vymazať chat',
        closeChat               : 'Zatvoriť chat',
        settings                : 'Nastavenia',
        closeSettings           : 'Zatvoriť nastavenia'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Vyberte presne ${min}`,
        tooFewOptionsSelected     : min => `Vyberte aspoň ${min}`,
        tooManyOptionsSelected    : max => `Vyberte najviac ${max}`
    },

    CodeEditor : {
        apply        : 'Použiť',
        autoApply    : 'Automatické použitie',
        downloadCode : 'Stiahnuť kód'
    },

    ColorPicker : {
        noColor : 'Žiadna farba'
    },

    Combo : {
        noResults          : 'Žiadne výsledky',
        recordNotCommitted : 'Záznam sa nepodarilo pridať',
        addNewValue        : value => `Pridať ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Zvýrazniť',
        preview         : 'Náhľad',
        approve         : 'Schváliť',
        reject          : 'Zamietnuť',
        confirmAdd      : 'Potvrďte pridanie:',
        confirmUpdate   : 'Potvrďte aktualizáciu:',
        confirmRemove   : 'Potvrďte odstránenie:',
        confirmCopy     : 'Potvrďte kopírovanie',
        confirmAssign   : 'Potvrďte priradenie',
        confirmReassign : 'Potvrďte opätovné priradenie',
        confirmUnassign : 'Potvrďte odobratie priradenia',
        confirmLink     : 'Potvrdiť odkaz',
        confirmUnlink   : 'Potvrdiť zrušenie odkazu'
    },

    FilePicker : {
        file : 'Súbor'
    },

    Field : {
        badInput              : 'Neplatná hodnota poľa',
        patternMismatch       : 'Hodnota by sa mala zhodovať so špecifickým vzorom',
        rangeOverflow         : value => `Hodnota mus byť menšia alebo rovná ${value.max}`,
        rangeUnderflow        : value => `Hodnota musí byť väčšia alebo rovná ${value.min}`,
        stepMismatch          : 'Hodnota by sa mala zhodovať s krokom',
        tooLong               : 'Hodnota by mala byť kratšia',
        tooShort              : 'Hodnota by mala byť dlhšia',
        typeMismatch          : 'Požaduje sa, aby hodnota bola v špeciálnom formáte',
        valueMissing          : 'Toto políčko sa požaduje',
        invalidValue          : 'Neplatná hodnota políčka',
        minimumValueViolation : 'Narušenie minimálnej hodnoty',
        maximumValueViolation : 'Narušenie maximálnej hodnoty',
        fieldRequired         : 'Toto políčko sa požaduje',
        validateFilter        : 'Hodnota musí byť zvolená zo zoznamu'
    },

    DateField : {
        invalidDate : format => 'Neplatný dátumový vstup, očakávaný formát je ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Prejsť na predchádzajúci rok',
        gotoPrevMonth : 'Prejsť na predchádzajúci mesiac',
        gotoNextMonth : 'Prejsť na nasledujúci mesiac',
        gotoNextYear  : 'Prejsť na nalsedujúci rok',
        navigation    : 'Navigácia výberu dátumu'
    },

    Hint : {
        dontShowAgain : 'Nezobrazovať znova'
    },

    NumberFormat : {
        locale   : 'sk',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Neplatná jednotka'
    },

    TimeField : {
        invalidTime : 'Vloženie neplatného času'
    },

    TimePicker : {
        hour   : 'Hodina',
        minute : 'Minúta',
        second : 'Sekunda'
    },

    Tooltip : {
        loading : 'Načítava sa...'
    },

    List : {
        loading   : 'Načítavanie...',
        selectAll : 'Vybrať všetko'
    },

    GridBase : {
        loadMask : 'Načítavanie...',
        syncMask : 'ukladajú sa zmeny, čakajte...'
    },

    PagingToolbar : {
        firstPage         : 'Prejsť na prvú stranu',
        prevPage          : 'Prejsť na predchádzajúcu stranu',
        page              : 'Strana',
        nextPage          : 'Prejsť na nasledujúcu stranu',
        lastPage          : 'Prejsť na poslednú stranu',
        reload            : 'Znovu načítať súčasnú stranu',
        noRecords         : 'Žiadne záznamy na zobrazenie',
        pageCountTemplate : data => `z ${data.lastPage}`,
        summaryTemplate   : data => `Zobrazujú sa záznamy ${data.start} - ${data.end} z ${data.allCount}`
    },

    Popup : {
        close    : 'Zatvoriť vyskakovacie okno',
        maximize : 'Maximalizovať'
    },

    Splitter : {
        ariaLabel      : 'Rozdeľovač, použite klávesy so šípkami na zmenu veľkosti susedných panelov',
        collapseLeft   : 'Zbaliť ľavý panel',
        collapseRight  : 'Zbaliť pravý panel',
        collapseTop    : 'Zbaliť horný panel',
        collapseBottom : 'Zbaliť dolný panel',
        expandLeft     : 'Rozbaliť ľavý panel',
        expandRight    : 'Rozbaliť pravý panel',
        expandTop      : 'Rozbaliť horný panel',
        expandBottom   : 'Rozbaliť dolný panel'
    },

    TabPanel : {
        containsInvalidFields : 'Karta obsahuje neplatné polia'
    },

    Toolbar : {
        showOverflowingItems : 'Zobraziť pretečené položky',
        scrollForMore        : 'Posuňte pre viac'
    },

    UndoRedo : {
        Undo           : 'Vrátiť späť',
        Redo           : 'Znovu vykonať',
        UndoLastAction : 'Vrátiť späť poslednú akciu',
        RedoLastAction : 'Znovu urobiť poslednú nevykonanú akciu',
        NoActions      : 'Žiadne položky v rade na vrátenie späť'
    },

    FieldFilterPicker : {
        equals                 : 'rovná sa',
        doesNotEqual           : 'nerovná sa',
        isEmpty                : 'je prázdne',
        isNotEmpty             : 'nie je prázdne',
        contains               : 'obsahuje',
        doesNotContain         : 'neobsahuje',
        startsWith             : 'začína na',
        endsWith               : 'končí na',
        isOneOf                : 'je jeden z',
        isNotOneOf             : 'nie je jedno z',
        isGreaterThan          : 'je väčšie než',
        isLessThan             : 'je menšie než',
        isGreaterThanOrEqualTo : 'je väčšie alebo sa rovná',
        isLessThanOrEqualTo    : 'je menšie alebo sa rovná',
        isBetween              : 'je medzi',
        isNotBetween           : 'nie je medzi',
        isBefore               : 'je pred',
        isAfter                : 'je po',
        timeEquals             : 'čas sa rovná',
        timeDoesNotEqual       : 'čas sa nerovná',
        isToday                : 'je dnes',
        isTomorrow             : 'je zajtra',
        isYesterday            : 'je včera',
        isThisWeek             : 'je tento týždeň',
        isNextWeek             : 'je budúci týždeň',
        isLastWeek             : 'je minulý týždeň',
        isThisMonth            : 'je tento mesiac',
        isNextMonth            : 'je budúci mesiac',
        isLastMonth            : 'je minulý mesiac',
        isThisYear             : 'je tento rok',
        isNextYear             : 'je budúci rok',
        isLastYear             : 'je minulý rok',
        isYearToDate           : 'je rok do dnešného dňa',
        isTrue                 : 'je správne',
        isFalse                : 'je nesprávne',
        selectAProperty        : 'Vyberte vlastnosť',
        selectAnOperator       : 'Vyberte operátora',
        caseSensitive          : 'Rozlišuje malé a veľké písmená',
        and                    : 'a',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Vyberte hodnotu',
        selectOneOrMoreValues  : 'Vyberte jednu alebo viac hodnôt',
        enterAValue            : 'Zadajte hodnotu',
        enterANumber           : 'Zadajte číslo',
        selectADate            : 'Vyberte dátum',
        selectATime            : 'Vybrať čas'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Pridajte filter',
        applyCond : applied => applied ? 'Preskočiť filter (momentálne použitý)' : 'Použiť filter (momentálne preskočený)'
    },

    DateHelper : {
        locale         : 'sk',
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
            { single : 'milisekunda', plural : 'ms', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'sekunda', plural : 'sekundy', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minúta', plural : 'minúty', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'hodina', plural : 'hodiny', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'deň', plural : 'dni', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'týždeň', plural : 'týždne', abbrev : 'tžd' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'mesiac', plural : 'mesiace', abbrev : 'msc' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'štvrť', plural : 'štvrtiny', abbrev : '' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'rok', plural : 'roky', abbrev : 'rk' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'dekáda', plural : 'dekády', abbrev : 'dek' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil'],
            [],
            ['s', 'sec'],
            [],
            ['m', 'min'],
            [],
            ['h', 'h'],
            [],
            ['d'],
            [],
            ['tžd', 'tžd'],
            [],
            ['msc', 'msc', 'msc'],
            [],
            ['štvrť', 'štvrť', 'štvrť'],
            [],
            ['rk', 'rk'],
            [],
            ['dek'],
            []
        ],
        parsers : {
            L   : 'D. M. YYYY.',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '.',
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}. roky`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
