import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Sr',
    localeDesc : 'Srpski',
    localeCode : 'sr',
    localeRtl  : false,

    Object : {
        Yes      : 'Da',
        No       : 'Ne',
        Cancel   : 'Otkaži',
        Ok       : 'OK',
        Week     : 'Nedelja',
        None     : 'Ништа',
        previous : 'Prethodno',
        next     : 'Sledeće',
        to       : 'до',
        at       : 'у',
        on       : 'на',
        editing  : what => `Уређивање ${what}`,
        settings : 'Подешавања',
        close    : 'Затвори',
        go       : 'Idi',
        save     : 'Сачувај',
        cancel   : 'Откажи',
        revert   : 'Врати',
        collapse : 'Skupi',
        expand   : 'Raširi',
        today    : 'Danas',
        andNMore : n => `i još ${n}`
    },

    AIBase : {
        delayStatusTexts : [
            'Čekanje',
            'Čekanje ...',
            'Još uvek čekanje',
            'Još uvek čekanje ...'
        ],
        autoStartDialogMessage        : 'Da li želite da omogućite aktivaciju AI glasom?',
        voiceActivationToast          : phrase => `Aktivacija glasom omogućena, koristite frazu "${phrase}" za započinjanje razgovora`,
        voiceControlNotSupportedToast : 'Kontrola glasom nije podržana na ovom uređaju',
        voiceControlErrorToast        : 'Kontrola glasom nije mogla biti pokrenuta na vašem uređaju',
        voiceControlSilenceToast      : phrase => `AI glasovni razgovor je završen zbog tišine. Koristite frazu ${phrase} za ponovno pokretanje razgovora`,
        noAudioDetected               : 'Nije otkriven zvuk, pokušajte ponovo',
        transcriptionErrorToast       : 'Transkripcija nije uspela, pokušajte ponovo',
        playbackErrorToast            : 'Reprodukcija zvuka nije uspela, proverite vaš uređaj za izlaz zvuka',
        failed                        : '(neuspešno)',
        awaitingConfirmation          : 'Čeka se potvrda',
        timeoutToast                  : 'Poruka je istekla',
        readingStatusText             : modelName => `Čitanje ${modelName}s`,
        updatingStatusText            : modelName => `Ažuriranje ${modelName}s`,
        removingStatusText            : modelName => `Uklanjanje ${modelName}s`,
        addingStatusText              : modelName => `Dodavanje ${modelName}`,
        filteringStatusText           : modelName => `Filtriranje ${modelName}s`,
        thinkingStatusText            : 'Razmišljanje',
        processingStatusText          : 'Obrada'
    },

    AISettingsPanel : {
        highlight               : 'Istakni',
        verbosity               : 'Verbalnost',
        voiceActivation         : 'Aktivacija glasom',
        enableVoiceActivation   : 'Omogući aktivaciju glasom',
        voiceOnly               : 'Samo glas',
        autostart               : 'Automatski početak',
        dataChangeConfirmations : 'Potvrda promene podataka',
        add                     : 'Dodaj',
        remove                  : 'Ukloni',
        update                  : 'Ažuriraj',
        planning                : 'Planiranje',
        enablePlanning          : 'Omogući planiranje',
        aiModel                 : 'AI Model',
        timeline                : 'Vremenska linija',
        'in-view'               : 'U prikazu',
        all                     : 'Sve',
        timeRangeContext        : 'Kontekst vremenskog opsega'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI govori',
        recordingTooltip      : 'Snimanje',
        waitingTooltip        : 'AI razmišlja',
        startRecordingTooltip : 'Kliknite za početak',
        stopRecordingTooltip  : 'Kliknite za zaustavljanje',
        inactiveTooltip       : 'Nije u režimu snimanja',
        openChatTooltip       : 'Desni klik za otvaranje ćaskanja'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Unesite poruku',
        noConnectionTooltip     : 'Nema detektovane veze, kliknite za ponovno pokušavanje',
        undone                  : 'poništeno',
        aborted                 : '(prekinuto)',
        readAloudTooltip        : 'Pročitajte poruku naglas',
        confidenceTooltip       : confidence => `Pouzdanost: ${confidence}%`,
        undoTooltip             : 'Poništite promene podataka',
        redoTooltip             : 'Ponovite promene podataka',
        thumbsUp                : 'Palac gore',
        thumbsDown              : 'Palac dole',
        feedbackToast           : 'Hvala na vašem povratnom odgovoru!',
        clearChat               : 'Obriši razgovor',
        closeChat               : 'Zatvori razgovor',
        settings                : 'Podešavanja',
        closeSettings           : 'Zatvori podešavanja'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Izaberite tačno ${min}`,
        tooFewOptionsSelected     : min => `Izaberite najmanje ${min}`,
        tooManyOptionsSelected    : max => `Izaberite najviše ${max}`
    },

    CodeEditor : {
        apply        : 'Primeni',
        autoApply    : 'Automatski primeni',
        downloadCode : 'Preuzmi kod'
    },

    ColorPicker : {
        noColor : 'Без боје'
    },

    Combo : {
        noResults          : 'Nema rezultata',
        recordNotCommitted : 'Rezultati nisu mogli biti dodati',
        addNewValue        : value => `Dodaj ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Istakni',
        preview         : 'Pregled',
        approve         : 'Odobri',
        reject          : 'Odbij',
        confirmAdd      : 'Potvrdite dodavanje:',
        confirmUpdate   : 'Potvrdite ažuriranje:',
        confirmRemove   : 'Potvrdite uklanjanje:',
        confirmCopy     : 'Potvrdite kopiranje',
        confirmAssign   : 'Potvrdite dodelu',
        confirmReassign : 'Potvrdite ponovnu dodelu',
        confirmUnassign : 'Potvrdite poništavanje dodele',
        confirmLink     : 'Potvrdi vezu',
        confirmUnlink   : 'Potvrdi prekid veze'
    },

    FilePicker : {
        file : 'Datoteka'
    },

    Field : {
        badInput              : 'Neispravna vrednost polja',
        patternMismatch       : 'Vrednost treba da odgovara određenom šablonu',
        rangeOverflow         : value => `Vrednost mora biti manja ili jednaka ${value.max}`,
        rangeUnderflow        : value => `Vrednost mora biti veća ili jednaka ${value.min}`,
        stepMismatch          : 'Vrednost treba da odgovara koraku',
        tooLong               : 'Vrednost treba da je kraća',
        tooShort              : 'Vrednost treba da je duža',
        typeMismatch          : 'Potrebno je da vrednost bude određenog formata',
        valueMissing          : 'Ovo polje je potrebno',
        invalidValue          : 'Neispravna vrednost polja',
        minimumValueViolation : 'Minimalna vrednost prekršaja',
        maximumValueViolation : 'Maksimalna vrednost prekršaja',
        fieldRequired         : 'Ovo polje je potrebno',
        validateFilter        : 'Vrednost mora da bude izabrana sa liste'
    },

    DateField : {
        invalidDate : format => 'Nevažeći unos datuma, očekivani format je ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Idi na prethodnu godinu',
        gotoPrevMonth : 'Idi na prethodni mesec',
        gotoNextMonth : 'Idi na sledeći mesec',
        gotoNextYear  : 'Idi na sledeću godinu',
        navigation    : 'Navigacija za biranje datuma'
    },

    Hint : {
        dontShowAgain : 'Ne prikazuj ponovo'
    },

    NumberFormat : {
        locale   : 'sr',
        currency : 'RSD'
    },

    DurationField : {
        invalidUnit : 'Neispravna jedinica'
    },

    TimeField : {
        invalidTime : 'Neispravan unos vremena'
    },

    TimePicker : {
        hour   : 'Sat',
        minute : 'Minut',
        second : 'Sekunda'
    },

    Tooltip : {
        loading : 'Učitavanje...'
    },

    List : {
        loading   : 'Učitavanje...',
        selectAll : 'Odaberi sve'
    },

    GridBase : {
        loadMask : 'Učitavanje...',
        syncMask : 'Promene se čuvaju, molim sačekajte...'
    },

    PagingToolbar : {
        firstPage         : 'Idi na prvu stranu',
        prevPage          : 'Idi na prethodnu stranu',
        page              : 'Strana',
        nextPage          : 'Idi na sledeću stranu',
        lastPage          : 'Idi na poslednju stranu',
        reload            : 'Ponovo učitaj trenutnu stranu',
        noRecords         : 'Nema zapisa za prikaz',
        pageCountTemplate : data => `od ${data.lastPage}`,
        summaryTemplate   : data => `Prikazuju se zapisi ${data.start} - ${data.end} od ${data.allCount}`
    },

    Popup : {
        close    : 'Zatvori iskačući prozor',
        maximize : 'Maksimizuj'
    },

    Splitter : {
        ariaLabel      : 'Razdelnik, koristite tastere sa strelicama za promenu veličine susednih panela',
        collapseLeft   : 'Skupi levi panel',
        collapseRight  : 'Skupi desni panel',
        collapseTop    : 'Skupi gornji panel',
        collapseBottom : 'Skupi donji panel',
        expandLeft     : 'Raširi levi panel',
        expandRight    : 'Raširi desni panel',
        expandTop      : 'Raširi gornji panel',
        expandBottom   : 'Raširi donji panel'
    },

    TabPanel : {
        containsInvalidFields : 'Kartica sadrži nevažeća polja'
    },

    Toolbar : {
        showOverflowingItems : 'Прикажи преливене ставке',
        scrollForMore        : 'Померите за више'
    },

    UndoRedo : {
        Undo           : 'Opozovi',
        Redo           : 'Ponovi',
        UndoLastAction : 'Opozovi poslednju radnju',
        RedoLastAction : 'Ponovi poslednju opozvanu radnju',
        NoActions      : 'Nema stavki u redu za opoziv'
    },

    FieldFilterPicker : {
        equals                 : 'jednako',
        doesNotEqual           : 'nije jednako',
        isEmpty                : 'je prazno',
        isNotEmpty             : 'nije prazno',
        contains               : 'sadrži',
        doesNotContain         : 'ne sadrži',
        startsWith             : 'počinje sa',
        endsWith               : 'završava sa',
        isOneOf                : 'je jedan od',
        isNotOneOf             : 'nije jedan od',
        isGreaterThan          : 'je veći od',
        isLessThan             : 'je manji od',
        isGreaterThanOrEqualTo : 'je veći ili jednak od',
        isLessThanOrEqualTo    : 'je manji ili jednak od',
        isBetween              : 'je između',
        isNotBetween           : 'nije između',
        isBefore               : 'je pre',
        isAfter                : 'je posle',
        timeEquals             : 'vreme je jednako',
        timeDoesNotEqual       : 'vreme nije jednako',
        isToday                : 'je danas',
        isTomorrow             : 'je sutra',
        isYesterday            : 'je juče',
        isThisWeek             : 'je ove nedelje',
        isNextWeek             : 'je sledeće nedelje',
        isLastWeek             : 'je prošle nedelje',
        isThisMonth            : 'je ovog meseca',
        isNextMonth            : 'je sledećeg meseca',
        isLastMonth            : 'je prošlog meseca',
        isThisYear             : 'je ove godine',
        isNextYear             : 'je sledeće godine',
        isLastYear             : 'je prošle godine',
        isYearToDate           : 'je od početka godine do danas',
        isTrue                 : 'je tačan',
        isFalse                : 'je netačan',
        selectAProperty        : 'Izaberite svojstvo',
        selectAnOperator       : 'Izaberite operatora',
        caseSensitive          : 'Osetljivo na mala i velika slova',
        and                    : 'i',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Izaberite vrednost',
        selectOneOrMoreValues  : 'Izaberite jednu ili više vrednosti',
        enterAValue            : 'Unesite vrednost',
        enterANumber           : 'Unesite broj',
        selectADate            : 'Izaberite datum',
        selectATime            : 'Izaberite vreme'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Dodajte filter',
        applyCond : applied => applied ? 'Preskoči filter (trenutno primenjen)' : 'Primeni filter (trenutno preskočen)'
    },

    DateHelper : {
        locale         : 'sr',
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
            { single : 'milisekund', plural : 'milisekundi', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'sekunda', plural : 'sekunde', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minut', plural : 'minuta', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'sat', plural : 'sati', abbrev : '' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'dan', plural : 'dana', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'nedelja', plural : 'nedelje', abbrev : 'ned' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'mesec', plural : 'meseci', abbrev : 'mes' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'kvartal', plural : 'kvartala', abbrev : 'kv' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'godina', plural : 'godine', abbrev : 'god' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'dekada', plural : 'dekade', abbrev : 'dek' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['ms'],
            [],
            ['s', 'sek'],
            [],
            ['m', 'min'],
            [],
            ['sat', 'sati'],
            [],
            ['d'],
            [],
            ['ned', 'ned'],
            [],
            ['mes', 'mes', 'mes'],
            [],
            ['kv', 'kv', 'kv'],
            [],
            ['g', 'god'],
            [],
            ['dek'],
            []
        ],
        parsers : {
            L   : 'D.M.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '.',
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}-те`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
