import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Sl',
    localeDesc : 'Slovensko',
    localeCode : 'sl',
    localeRtl  : false,

    Object : {
        Yes      : 'Da',
        No       : 'Ne',
        Cancel   : 'Prekliči',
        Ok       : 'OK',
        Week     : 'Teden',
        None     : 'Brez',
        previous : 'Prejšnji',
        next     : 'Naslednji',
        to       : 'do',
        at       : 'ob',
        on       : 'na',
        editing  : what => `Urejanje ${what}`,
        settings : 'Nastavitve',
        close    : 'Zapri',
        go       : 'Pojdi',
        save     : 'Shrani',
        cancel   : 'Prekliči',
        revert   : 'Ponastavi',
        collapse : 'Strni',
        expand   : 'Razširi',
        today    : 'Danes',
        andNMore : n => `in ${n} več`
    },

    AIBase : {
        delayStatusTexts : [
            'Čakanje',
            'Čakanje ...',
            'Še vedno čakam',
            'Še vedno čakam ...'
        ],
        autoStartDialogMessage        : 'Ali želite omogočiti glasovno aktivacijo AI?',
        voiceActivationToast          : phrase => `Glasovna aktivacija omogočena, uporabite frazo "${phrase}" za začetek pogovora`,
        voiceControlNotSupportedToast : 'Glasovni nadzor ni podprt na tej napravi',
        voiceControlErrorToast        : 'Glasovnega nadzora ni bilo mogoče zagnati na vaši napravi',
        voiceControlSilenceToast      : phrase => `Pogovor z AI je bil končan zaradi tišine. Uporabite frazo ${phrase} za ponovni začetek pogovora`,
        noAudioDetected               : 'Ni zaznanega zvoka, prosimo poskusite znova',
        transcriptionErrorToast       : 'Prepis ni uspel, poskusite znova',
        playbackErrorToast            : 'Predvajanje zvoka ni uspelo, preverite svojo zvočno napravo',
        failed                        : '(ni uspelo)',
        awaitingConfirmation          : 'Čakam na potrditev',
        timeoutToast                  : 'Sporočilo je poteklo',
        readingStatusText             : modelName => `Branje ${modelName}s`,
        updatingStatusText            : modelName => `Posodabljanje ${modelName}s`,
        removingStatusText            : modelName => `Odstranjevanje ${modelName}s`,
        addingStatusText              : modelName => `Dodajanje ${modelName}`,
        filteringStatusText           : modelName => `Filtriranje ${modelName}s`,
        thinkingStatusText            : 'Razmišljanje',
        processingStatusText          : 'Obdelava'
    },

    AISettingsPanel : {
        highlight               : 'Označi',
        verbosity               : 'Zgovornost',
        voiceActivation         : 'Aktivacija glasu',
        enableVoiceActivation   : 'Omogoči aktivacijo glasu',
        voiceOnly               : 'Samo glas',
        autostart               : 'Samodejni zagon',
        dataChangeConfirmations : 'Potrditev spremembe podatkov',
        add                     : 'Dodaj',
        remove                  : 'Odstrani',
        update                  : 'Posodobi',
        planning                : 'Načrtovanje',
        enablePlanning          : 'Omogoči načrtovanje',
        aiModel                 : 'AI Model',
        timeline                : 'Časovnica',
        'in-view'               : 'V pogledu',
        all                     : 'Vse',
        timeRangeContext        : 'Kontekst časovnega obsega'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI govori',
        recordingTooltip      : 'Snemanje',
        waitingTooltip        : 'AI razmišlja',
        startRecordingTooltip : 'Kliknite za začetek',
        stopRecordingTooltip  : 'Kliknite za ustavitev',
        inactiveTooltip       : 'Ne snema',
        openChatTooltip       : 'Desni klik za odprtje klepeta'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Vnesite sporočilo',
        noConnectionTooltip     : 'Povezava ni zaznana, kliknite za ponovni poskus',
        undone                  : 'razveljavljeno',
        aborted                 : '(prekinjeno)',
        readAloudTooltip        : 'Preberite sporočilo na glas',
        confidenceTooltip       : confidence => `Zaupanje: ${confidence}%`,
        undoTooltip             : 'Razveljavi spremembe podatkov',
        redoTooltip             : 'Ponovi spremembe podatkov',
        thumbsUp                : 'Všeč mi je',
        thumbsDown              : 'Ni mi všeč',
        feedbackToast           : 'Hvala za vaše povratne informacije!',
        clearChat               : 'Počisti klepet',
        closeChat               : 'Zapri klepet',
        settings                : 'Nastavitve',
        closeSettings           : 'Zapri nastavitve'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Izberite točno ${min}`,
        tooFewOptionsSelected     : min => `Izberite vsaj ${min}`,
        tooManyOptionsSelected    : max => `Izberite največ ${max}`
    },

    CodeEditor : {
        apply        : 'Uporabi',
        autoApply    : 'Samodejna uporaba',
        downloadCode : 'Prenesi kodo'
    },

    ColorPicker : {
        noColor : 'Brez barve'
    },

    Combo : {
        noResults          : 'Ni rezultatov',
        recordNotCommitted : 'Zapisa ni bilo mogoče dodati',
        addNewValue        : value => ` Dodajte ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Označi',
        preview         : 'Predogled',
        approve         : 'Odobri',
        reject          : 'Zavrni',
        confirmAdd      : 'Potrdite dodajanje:',
        confirmUpdate   : 'Potrdite posodobitev:',
        confirmRemove   : 'Potrdite odstranitev:',
        confirmCopy     : 'Potrdite kopiranje',
        confirmAssign   : 'Potrdite dodelitev',
        confirmReassign : 'Potrdite ponovno dodelitev',
        confirmUnassign : 'Potrdite preklic dodelitve',
        confirmLink     : 'Potrdi povezavo',
        confirmUnlink   : 'Potrdi prekinitev povezave'
    },

    FilePicker : {
        file : 'Datoteka'
    },

    Field : {
        badInput              : 'Neveljavna vrednost polja',
        patternMismatch       : 'Vrednost se mora ujemati z določenim vzorcem',
        rangeOverflow         : value => ` Vrednost mora biti manjša ali enaka ${value.max}`,
        rangeUnderflow        : value => ` Vrednost mora biti večja ali enaka ${value.min}`,
        stepMismatch          : 'Vrednost mora ustrezati koraku',
        tooLong               : 'Vrednost naj bo krajša',
        tooShort              : 'Vrednost naj bo daljša',
        typeMismatch          : 'Vrednost mora biti v posebni obliki',
        valueMissing          : 'To polje je obvezno',
        invalidValue          : 'Neveljavna vrednost polja',
        minimumValueViolation : 'Kršitev najmanjše vrednosti',
        maximumValueViolation : 'Kršitev največje vrednosti',
        fieldRequired         : 'To polje je obvezno',
        validateFilter        : 'Vrednost mora biti izbrana s seznama'
    },

    DateField : {
        invalidDate : format => 'Neveljaven vnos datuma, pričakovani format je ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Pojdi na prejšnje leto',
        gotoPrevMonth : 'Pojdi na prejšnji mesec',
        gotoNextMonth : 'Pojdi na naslednji mesec',
        gotoNextYear  : 'Pojdi na naslednje leto',
        navigation    : 'Navigacija izbirnika datuma'
    },

    Hint : {
        dontShowAgain : 'Ne pokaži znova'
    },

    NumberFormat : {
        locale   : 'sl',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Neveljavna enota'
    },

    TimeField : {
        invalidTime : 'Neveljaven vnos časa'
    },

    TimePicker : {
        hour   : 'Ura',
        minute : 'Minuta',
        second : 'Drugi'
    },

    Tooltip : {
        loading : 'Nalaganje...'
    },

    List : {
        loading   : 'Nalaganje...',
        selectAll : 'Izberi vse'
    },

    GridBase : {
        loadMask : 'Nalaganje...',
        syncMask : 'Shranjevanje sprememb, prosim počakajte ...'
    },

    PagingToolbar : {
        firstPage         : 'Pojdi na prvo stran',
        prevPage          : 'Pojdi na prejšnjo stran',
        page              : 'Stran',
        nextPage          : 'Pojdi na naslednjo stran',
        lastPage          : 'Pojdi na zadnjo stran',
        reload            : 'Znova naloži trenutno stran',
        noRecords         : 'Ni zapisov za prikaz',
        pageCountTemplate : data => `od ${data.lastPage}`,
        summaryTemplate   : data => ` Prikaz zapisov ${data.start} - ${data.end} od ${data.allCount}`
    },

    Popup : {
        close    : 'Zapri pojavno okno',
        maximize : 'Maksimiziraj'
    },

    Splitter : {
        ariaLabel      : 'Splitter, uporabite puščične tipke za spreminjanje velikosti sosednjih plošč',
        collapseLeft   : 'Strni levo ploščo',
        collapseRight  : 'Strni desno ploščo',
        collapseTop    : 'Strni zgornjo ploščo',
        collapseBottom : 'Strni spodnjo ploščo',
        expandLeft     : 'Razširi levo ploščo',
        expandRight    : 'Razširi desno ploščo',
        expandTop      : 'Razširi zgornjo ploščo',
        expandBottom   : 'Razširi spodnjo ploščo'
    },

    TabPanel : {
        containsInvalidFields : 'Zavihek vsebuje neveljavna polja'
    },

    Toolbar : {
        showOverflowingItems : 'Prikaži prelivajoče elemente',
        scrollForMore        : 'Pomaknite se za več'
    },

    UndoRedo : {
        Undo           : 'Razveljavi',
        Redo           : 'Ponovno uveljav',
        UndoLastAction : 'Razveljavi zadnje dejanje',
        RedoLastAction : 'Ponovi zadnje razveljavljeno dejanje',
        NoActions      : 'V čakalni vrsti za razveljavitev ni elementov'
    },

    FieldFilterPicker : {
        equals                 : 'enako',
        doesNotEqual           : 'ni enako',
        isEmpty                : 'je prazno',
        isNotEmpty             : 'ni prazno',
        contains               : 'vsebuje',
        doesNotContain         : 'ne vsebuje',
        startsWith             : 'začne se z',
        endsWith               : 'konča se z',
        isOneOf                : 'je eden od',
        isNotOneOf             : 'ni eden od',
        isGreaterThan          : 'je večje kot',
        isLessThan             : 'je manjše kot',
        isGreaterThanOrEqualTo : 'je večje ali enako',
        isLessThanOrEqualTo    : 'je manjše ali enako',
        isBetween              : 'je vmes',
        isNotBetween           : 'ni vmes',
        isBefore               : 'je pred',
        isAfter                : 'je potem',
        timeEquals             : 'čas je enak',
        timeDoesNotEqual       : 'čas ni enak',
        isToday                : 'je danes',
        isTomorrow             : 'je jutri',
        isYesterday            : 'je včeraj',
        isThisWeek             : 'je ta teden',
        isNextWeek             : 'je naslednji teden',
        isLastWeek             : 'je prejšnji teden',
        isThisMonth            : 'je ta mesec',
        isNextMonth            : 'je naslednji mesec',
        isLastMonth            : 'je prejšnji mesec',
        isThisYear             : 'je to leto',
        isNextYear             : 'je naslednje leto',
        isLastYear             : 'je prejšnje leto',
        isYearToDate           : 'je leto do danes',
        isTrue                 : 'je res',
        isFalse                : 'je napačno',
        selectAProperty        : 'Izberite lastnost',
        selectAnOperator       : 'Izberite operaterja',
        caseSensitive          : 'Razlikuje med velikimi in malimi črkami',
        and                    : 'in',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Izberi vrednost',
        selectOneOrMoreValues  : 'Izberite eno ali več vrednosti',
        enterAValue            : 'Vnesite vrednost',
        enterANumber           : 'Vnesite številko',
        selectADate            : 'Izberite datum',
        selectATime            : 'Izberite čas'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Dodajte filter',
        applyCond : applied => applied ? 'Preskoči filter (trenutno uporabljen)' : 'Uporabi filter (trenutno preskočen)'
    },

    DateHelper : {
        locale         : 'sl',
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
            { single : 'milisekunda', plural : 'milisekunde', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'sekunda', plural : 'sekunde', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minuta', plural : 'minute', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'ura', plural : 'ure', abbrev : 'ur' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'dan', plural : 'dnevi', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'teden', plural : 'tedni', abbrev : 't' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'mesec', plural : 'meseci', abbrev : 'm' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'četrtletje', plural : 'četrtletja', abbrev : 'četrt' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'leto', plural : 'leta', abbrev : 'l' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'desetletje', plural : 'desetletja', abbrev : 'des' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['ms'],
            [],
            ['s', 'sek'],
            [],
            ['m', 'min'],
            [],
            ['ur', 'ur'],
            [],
            ['d'],
            [],
            ['t', 't'],
            [],
            ['m', 'm', 'm'],
            [],
            ['četrt', 'četrt', 'četrt'],
            [],
            ['l', 'l'],
            [],
            ['des'],
            []
        ],
        parsers : {
            L   : 'D. M. YYYY.',
            LT  : 'HH:mm ',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '.',
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}-ih`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
