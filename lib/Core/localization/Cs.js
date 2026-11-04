import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Cs',
    localeDesc : 'Česky',
    localeCode : 'cs',
    localeRtl  : false,

    Object : {
        Yes      : 'Ano',
        No       : 'Ne',
        Cancel   : 'Zrušit',
        Ok       : 'OK',
        Week     : 'Týden',
        None     : 'Žádný',
        previous : 'Předchozí',
        next     : 'Další',
        to       : 'do',
        at       : 'v',
        on       : 'na',
        editing  : what => `Úprava ${what}`,
        settings : 'Nastavení',
        close    : 'Zavřít',
        go       : 'Jít',
        save     : 'Uložit',
        cancel   : 'Zrušit',
        revert   : 'Vrátit',
        collapse : 'Sbalit',
        expand   : 'Rozbalit',
        today    : 'Dnes',
        andNMore : n => `a ${n} další`
    },

    AIBase : {
        delayStatusTexts : [
            'Čekání',
            'Čekání ...',
            'Stále čekání',
            'Stále čekání ...'
        ],
        autoStartDialogMessage        : 'Chcete povolit aktivaci hlasu AI?',
        voiceActivationToast          : phrase => `Hlasová aktivace povolena, použijte frázi "${phrase}" k zahájení konverzace`,
        voiceControlNotSupportedToast : 'Hlasové ovládání není na tomto zařízení podporováno',
        voiceControlErrorToast        : 'Hlasové ovládání nemohlo být na vašem zařízení spuštěno',
        voiceControlSilenceToast      : phrase => `Hlasová konverzace AI byla ukončena kvůli tichu. Použijte frázi ${phrase} pro opětovné zahájení konverzace`,
        noAudioDetected               : 'Nebyl detekován žádný zvuk, zkuste to prosím znovu',
        transcriptionErrorToast       : 'Přepis selhal, zkuste to prosím znovu',
        playbackErrorToast            : 'Přehrávání zvuku selhalo, zkontrolujte prosím svůj zvukový výstupní zařízení',
        failed                        : '(selhalo)',
        awaitingConfirmation          : 'Čekání na potvrzení',
        timeoutToast                  : 'Zpráva vypršela',
        readingStatusText             : modelName => `Čtení ${modelName}ů`,
        updatingStatusText            : modelName => `Aktualizace ${modelName}ů`,
        removingStatusText            : modelName => `Odstraňování ${modelName}ů`,
        addingStatusText              : modelName => `Přidávání ${modelName}`,
        filteringStatusText           : modelName => `Filtrování ${modelName}ů`,
        thinkingStatusText            : 'Přemýšlení',
        processingStatusText          : 'Zpracování'
    },

    AISettingsPanel : {
        highlight               : 'Zvýraznit',
        verbosity               : 'Rozvláčnost',
        voiceActivation         : 'Aktivace hlasem',
        enableVoiceActivation   : 'Povolit aktivaci hlasem',
        voiceOnly               : 'Pouze hlas',
        autostart               : 'Automatický start',
        dataChangeConfirmations : 'Potvrzení změny dat',
        add                     : 'Přidat',
        remove                  : 'Odstranit',
        update                  : 'Aktualizovat',
        planning                : 'Plánování',
        enablePlanning          : 'Povolit plánování',
        aiModel                 : 'AI Model',
        timeline                : 'Časová osa',
        'in-view'               : 'V zobrazení',
        all                     : 'Vše',
        timeRangeContext        : 'Časový rozsah kontextu'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI mluví',
        recordingTooltip      : 'Nahrávání',
        waitingTooltip        : 'AI přemýšlí',
        startRecordingTooltip : 'Klikněte pro zahájení',
        stopRecordingTooltip  : 'Klikněte pro zastavení',
        inactiveTooltip       : 'Nenahrává se',
        openChatTooltip       : 'Klikněte pravým tlačítkem pro otevření chatu'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Napište zprávu',
        noConnectionTooltip     : 'Nebyla detekována žádná připojení, klikněte pro opětovný pokus',
        undone                  : 'neprovedeno',
        aborted                 : '(přerušeno)',
        readAloudTooltip        : 'Přečíst zprávu nahlas',
        confidenceTooltip       : confidence => `Důvěra: ${confidence}%`,
        undoTooltip             : 'Vrátit změny dat',
        redoTooltip             : 'Opakovat změny dat',
        thumbsUp                : 'Palec nahoru',
        thumbsDown              : 'Palec dolů',
        feedbackToast           : 'Děkujeme za vaši zpětnou vazbu!',
        clearChat               : 'Vymazat chat',
        closeChat               : 'Zavřít chat',
        settings                : 'Nastavení',
        closeSettings           : 'Zavřít nastavení'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Vyberte přesně ${min}`,
        tooFewOptionsSelected     : min => `Vyberte alespoň ${min}`,
        tooManyOptionsSelected    : max => `Vyberte nejvýše ${max}`
    },

    CodeEditor : {
        apply        : 'Použít',
        autoApply    : 'Automaticky použít',
        downloadCode : 'Stáhnout kód'
    },

    ColorPicker : {
        noColor : 'žádná barva'
    },

    Combo : {
        noResults          : 'Žádné výsledky',
        recordNotCommitted : 'Záznam se nepodařilo přidat',
        addNewValue        : value => `Přidat ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Zvýraznit',
        preview         : 'Náhled',
        approve         : 'Schválit',
        reject          : 'Odmítnout',
        confirmAdd      : 'Potvrďte přidání:',
        confirmUpdate   : 'Potvrďte aktualizaci:',
        confirmRemove   : 'Potvrďte odstranění:',
        confirmCopy     : 'Potvrďte kopírování',
        confirmAssign   : 'Potvrďte přiřazení',
        confirmReassign : 'Potvrďte opětovné přiřazení',
        confirmUnassign : 'Potvrďte odebrání přiřazení',
        confirmLink     : 'Potvrdit odkaz',
        confirmUnlink   : 'Potvrdit zrušení odkazu'
    },

    FilePicker : {
        file : 'Soubor'
    },

    Field : {
        badInput              : 'Neplatná hodnota pole',
        patternMismatch       : 'Hodnota by měla odpovídat určitému vzoru',
        rangeOverflow         : value => `Hodnota musí být menší nebo rovna ${value.max}`,
        rangeUnderflow        : value => `Hodnota musí být větší nebo rovna ${value.min}`,
        stepMismatch          : 'Hodnota by měla odpovídat kroku',
        tooLong               : 'Hodnota by měla být kratší',
        tooShort              : 'Hodnota by měla být delší',
        typeMismatch          : 'Hodnota musí být ve zvláštním formátu',
        valueMissing          : 'Toto pole je povinné',
        invalidValue          : 'Neplatná hodnota pole',
        minimumValueViolation : 'Porušení minimální hodnoty',
        maximumValueViolation : 'Porušení maximální hodnoty',
        fieldRequired         : 'Toto pole je povinné',
        validateFilter        : 'Hodnota musí být vybrána ze seznamu'
    },

    DateField : {
        invalidDate : format => 'Neplatný vstup data, očekávaný formát je ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Přejít na předchozí rok',
        gotoPrevMonth : 'Přejít na předchozí měsíc',
        gotoNextMonth : 'Přejít na další měsíc',
        gotoNextYear  : 'Přejít na další rok',
        navigation    : 'Navigace výběru data'
    },

    Hint : {
        dontShowAgain : 'Už nezobrazovat'
    },

    NumberFormat : {
        locale   : 'cs',
        currency : 'CZK'
    },

    DurationField : {
        invalidUnit : 'Neplatná jednotka'
    },

    TimeField : {
        invalidTime : 'Neplatné zadání času'
    },

    TimePicker : {
        hour   : 'Hodina',
        minute : 'Minuta',
        second : 'Sekunda'
    },

    Tooltip : {
        loading : 'Načítání...'
    },

    List : {
        loading   : 'Nahrávání...',
        selectAll : 'Vybrat vše'
    },

    GridBase : {
        loadMask : 'Nahrávání...',
        syncMask : 'Ukládání změn, čekejte, prosím...'
    },

    PagingToolbar : {
        firstPage         : 'Přejít na první stránku',
        prevPage          : 'Přejít na předchozí stránku',
        page              : 'Stránka',
        nextPage          : 'Přejít na další stránku',
        lastPage          : 'Přejít na poslední stránku',
        reload            : 'Znovu načíst aktuální stránku',
        noRecords         : 'Žádné záznamy k zobrazení',
        pageCountTemplate : data => `z ${data.lastPage}`,
        summaryTemplate   : data => `Zobrazení záznamů ${data.start} - ${data.end} z ${data.allCount}`
    },

    Popup : {
        close    : 'Zavřít vyskakovací okno',
        maximize : 'Maximalizovat'
    },

    Splitter : {
        ariaLabel      : 'Dělící prvek, použijte klávesy se šipkami k změně velikosti sousedních panelů',
        collapseLeft   : 'Sbalit levý panel',
        collapseRight  : 'Sbalit pravý panel',
        collapseTop    : 'Sbalit horní panel',
        collapseBottom : 'Sbalit dolní panel',
        expandLeft     : 'Rozbalit levý panel',
        expandRight    : 'Rozbalit pravý panel',
        expandTop      : 'Rozbalit horní panel',
        expandBottom   : 'Rozbalit dolní panel'
    },

    TabPanel : {
        containsInvalidFields : 'Karta obsahuje neplatná pole'
    },

    Toolbar : {
        showOverflowingItems : 'Zobrazit přetékající položky',
        scrollForMore        : 'Posuňte se pro více'
    },

    UndoRedo : {
        Undo           : 'Vrátit',
        Redo           : 'Udělat znovu',
        UndoLastAction : 'Vrátit poslední akci',
        RedoLastAction : 'Udělat znovu poslední vrácenou akci',
        NoActions      : 'Žádné položky ve frontě vracení akcí'
    },

    FieldFilterPicker : {
        equals                 : 'rovná se',
        doesNotEqual           : 'nerovná se',
        isEmpty                : 'je prázdný',
        isNotEmpty             : 'není prázdný',
        contains               : 'obsahuje',
        doesNotContain         : 'neobsahuje',
        startsWith             : 'začíná na',
        endsWith               : 'končí na',
        isOneOf                : 'je jeden z',
        isNotOneOf             : 'není jeden z',
        isGreaterThan          : 'je větší než',
        isLessThan             : 'je menší než',
        isGreaterThanOrEqualTo : 'je větší než nebo se rovná',
        isLessThanOrEqualTo    : 'je menší než nebo se rovná',
        isBetween              : 'je mezi',
        isNotBetween           : 'není mezi',
        isBefore               : 'je před',
        isAfter                : 'je po',
        timeEquals             : 'čas se rovná',
        timeDoesNotEqual       : 'čas se nerovná',
        isToday                : 'je dnes',
        isTomorrow             : 'je zítra',
        isYesterday            : 'je včera',
        isThisWeek             : 'je tento týden',
        isNextWeek             : 'je příští týden',
        isLastWeek             : 'je minulý týden',
        isThisMonth            : 'je tento měsíc',
        isNextMonth            : 'je příští měsíc',
        isLastMonth            : 'je poslední měsíc',
        isThisYear             : 'je tento rok',
        isNextYear             : 'je příští rok',
        isLastYear             : 'je poslední rok',
        isYearToDate           : 'je od začátku roku',
        isTrue                 : 'je pravda',
        isFalse                : 'je lež',
        selectAProperty        : 'Vyberte vlastnost',
        selectAnOperator       : 'Vyberte operátora',
        caseSensitive          : 'Velká a malá písmena',
        and                    : 'a',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Vyberte hodnotu',
        selectOneOrMoreValues  : 'Vyberte jednu nebo více hodnot',
        enterAValue            : 'Zadejte hodnotu',
        enterANumber           : 'Zadejte číslo',
        selectADate            : 'Vyberte datum',
        selectATime            : 'Vyberte čas'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Přidat filtr',
        applyCond : applied => applied ? 'Přeskočit filtr (aktuálně aplikován)' : 'Použít filtr (aktuálně přeskočen)'
    },

    DateHelper : {
        locale         : 'cs',
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
            { single : 'hodina', plural : 'hodiny', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'den', plural : 'dny', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'týden', plural : 'týdny', abbrev : 't' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'měsíc', plural : 'měsíce', abbrev : 'měs' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'čtvrtletí', plural : 'čtvrtletí', abbrev : 'č' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'rok', plural : 'roky', abbrev : 'r' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'desetiletí', plural : 'desetiletí', abbrev : 'des' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['ms'],
            [],
            ['s', 'sek'],
            [],
            ['m', 'min'],
            [],
            ['h', 'hod'],
            [],
            ['d'],
            [],
            ['t', 'týd'],
            [],
            ['mě', 'měs', 'měsíce'],
            [],
            ['č', 'čtvr', 'čt'],
            [],
            ['r', 'ro'],
            [],
            ['des'],
            []
        ],
        parsers : {
            L   : 'D. M. YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number,
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}. léta`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
