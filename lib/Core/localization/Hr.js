import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Hr',
    localeDesc : 'Hrvatski',
    localeCode : 'hr',
    localeRtl  : false,

    Object : {
        Yes      : 'Da',
        No       : 'Ne',
        Cancel   : 'Otkaži',
        Ok       : 'U redu',
        Week     : 'Tjedan',
        None     : 'Nema',
        previous : 'Prethodni',
        next     : 'Sljedeći',
        to       : 'do',
        at       : 'u',
        on       : 'na',
        editing  : what => `Uređivanje ${what}`,
        settings : 'Postavke',
        close    : 'Zatvori',
        go       : 'Idi',
        save     : 'Spremi',
        cancel   : 'Otkaži',
        revert   : 'Poništi promjene',
        collapse : 'Sažmi',
        expand   : 'Proširi',
        today    : 'Danas',
        andNMore : n => `i još ${n}`
    },

    AIBase : {
        delayStatusTexts : [
            'Čekanje',
            'Čekanje ...',
            'Još uvijek čekanje',
            'Još uvijek čekanje ...'
        ],
        autoStartDialogMessage        : 'Želite li omogućiti aktivaciju glasom AI?',
        voiceActivationToast          : phrase => `Glasovna aktivacija omogućena, koristite frazu "${phrase}" za započinjanje razgovora`,
        voiceControlNotSupportedToast : 'Glasovna kontrola nije podržana na ovom uređaju',
        voiceControlErrorToast        : 'Glasovna kontrola nije mogla biti pokrenuta na vašem uređaju',
        voiceControlSilenceToast      : phrase => `AI glasovni razgovor je završio zbog tišine. Koristite frazu ${phrase} za ponovno pokretanje razgovora`,
        noAudioDetected               : 'Nije otkriven zvuk, pokušajte ponovno',
        transcriptionErrorToast       : 'Transkripcija nije uspjela, pokušajte ponovno',
        playbackErrorToast            : 'Reprodukcija zvuka nije uspjela, provjerite svoj audio izlazni uređaj',
        failed                        : '(neuspješno)',
        awaitingConfirmation          : 'Čekanje potvrde',
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
        verbosity               : 'Rječitost',
        voiceActivation         : 'Aktivacija glasom',
        enableVoiceActivation   : 'Omogući aktivaciju glasom',
        voiceOnly               : 'Samo glas',
        autostart               : 'Automatski početak',
        dataChangeConfirmations : 'Potvrde promjene podataka',
        add                     : 'Dodaj',
        remove                  : 'Ukloni',
        update                  : 'Ažuriraj',
        planning                : 'Planiranje',
        enablePlanning          : 'Omogući planiranje',
        aiModel                 : 'AI Model',
        timeline                : 'Vremenska crta',
        'in-view'               : 'U prikazu',
        all                     : 'Sve',
        timeRangeContext        : 'Kontekst vremenskog raspona'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI govori',
        recordingTooltip      : 'Snima se',
        waitingTooltip        : 'AI razmišlja',
        startRecordingTooltip : 'Kliknite za početak',
        stopRecordingTooltip  : 'Kliknite za zaustavljanje',
        inactiveTooltip       : 'Ne snima se',
        openChatTooltip       : 'Desni klik za otvaranje razgovora'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Upišite poruku',
        noConnectionTooltip     : 'Nema detektirane veze, kliknite za ponovno pokušavanje',
        undone                  : 'poništeno',
        aborted                 : '(prekinuto)',
        readAloudTooltip        : 'Pročitajte poruku naglas',
        confidenceTooltip       : confidence => `Povjerenje: ${confidence}%`,
        undoTooltip             : 'Poništite promjene podataka',
        redoTooltip             : 'Ponovno primijenite promjene podataka',
        thumbsUp                : 'Palac gore',
        thumbsDown              : 'Palac dolje',
        feedbackToast           : 'Hvala na vašem povratnom odgovoru!',
        clearChat               : 'Očisti razgovor',
        closeChat               : 'Zatvori razgovor',
        settings                : 'Postavke',
        closeSettings           : 'Zatvori postavke'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Odaberite točno ${min}`,
        tooFewOptionsSelected     : min => `Odaberite barem ${min}`,
        tooManyOptionsSelected    : max => `Odaberite najviše ${max}`
    },

    CodeEditor : {
        apply        : 'Primijeni',
        autoApply    : 'Automatska primjena',
        downloadCode : 'Preuzmi kod'
    },

    ColorPicker : {
        noColor : 'Nema boje'
    },

    Combo : {
        noResults          : 'Nema rezultata',
        recordNotCommitted : 'Zapis nije moguće dodati',
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
        confirmAssign   : 'Potvrdite dodjelu',
        confirmReassign : 'Potvrdite ponovnu dodjelu',
        confirmUnassign : 'Potvrdite uklanjanje dodjele',
        confirmLink     : 'Potvrdi poveznicu',
        confirmUnlink   : 'Potvrdi uklanjanje poveznice'
    },

    FilePicker : {
        file : 'Datoteka'
    },

    Field : {
        badInput              : 'Nevažeća vrijednost polja',
        patternMismatch       : 'Vrijednost treba odgovarati određenom obrascu',
        rangeOverflow         : value => `Vrijednost treba biti manja ili jednaka ${value.max}`,
        rangeUnderflow        : value => `Vrijednost treba biti veća ili jednaka ${value.min}`,
        stepMismatch          : 'Vrijednost treba odgovarati koraku',
        tooLong               : 'Vrijednost treba biti kraća',
        tooShort              : 'Vrijednost treba biti duža',
        typeMismatch          : 'Vrijednost treba biti u određenom formatu',
        valueMissing          : 'Polje je obavezno',
        invalidValue          : 'Nevažeća vrijednost polja',
        minimumValueViolation : 'Pogreška minimalne vrijednosti',
        maximumValueViolation : 'Pogreška maksimalne vrijednosti',
        fieldRequired         : 'Polje je obavezno',
        validateFilter        : 'Vrijednost treba odabrati s popisa'
    },

    DateField : {
        invalidDate : format => 'Neispravan unos datuma, očekivani format je ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Idi na prethodnu godinu',
        gotoPrevMonth : 'Idi na prethodni mjesec',
        gotoNextMonth : 'Idi na sljedeći mjesec',
        gotoNextYear  : 'Idi na sljedeću godinu',
        navigation    : 'Navigacija odabira datuma'
    },

    Hint : {
        dontShowAgain : 'Ne prikazuj ponovno'
    },

    NumberFormat : {
        locale   : 'hr',
        currency : 'HRK'
    },

    DurationField : {
        invalidUnit : 'Nevažeća jedinica'
    },

    TimeField : {
        invalidTime : 'Unos vremena nije važeći'
    },

    TimePicker : {
        hour   : 'Sat',
        minute : 'Minuta',
        second : 'Sekunde'
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
        syncMask : 'Spremanje promjena u tijeku, pričekajte...'
    },

    PagingToolbar : {
        firstPage         : 'Idi na prvu stranicu',
        prevPage          : 'Idi na prethodnu stranicu',
        page              : 'Stranica',
        nextPage          : 'Idi na sljedeću stranicu',
        lastPage          : 'Idi na posljednju stranicu',
        reload            : 'Ponovno učitaj trenutačnu stranicu',
        noRecords         : 'Nema zapisa za prikazivanje',
        pageCountTemplate : data => `od ${data.lastPage}`,
        summaryTemplate   : data => `Prikazivanje zapisa ${data.start} - ${data.end} od ${data.allCount}`
    },

    Popup : {
        close    : 'Zatvori skočni prozorčić',
        maximize : 'Maksimiziraj'
    },

    Splitter : {
        ariaLabel      : 'Razdjelnik, koristite tipke sa strelicama za promjenu veličine susjednih panela',
        collapseLeft   : 'Sažmi lijevi panel',
        collapseRight  : 'Sažmi desni panel',
        collapseTop    : 'Sažmi gornji panel',
        collapseBottom : 'Sažmi donji panel',
        expandLeft     : 'Raširi lijevi panel',
        expandRight    : 'Raširi desni panel',
        expandTop      : 'Raširi gornji panel',
        expandBottom   : 'Raširi donji panel'
    },

    TabPanel : {
        containsInvalidFields : 'Kartica sadrži nevažeća polja'
    },

    Toolbar : {
        showOverflowingItems : 'Prikaži preljevene stavke',
        scrollForMore        : 'Pomaknite za više'
    },

    UndoRedo : {
        Undo           : 'Poništi',
        Redo           : 'Vrati poništeno',
        UndoLastAction : 'Poništi posljednju radnju',
        RedoLastAction : 'Vrati posljednje poništenu radnju',
        NoActions      : 'Nema stavki u redoslijedu poništavanja'
    },

    FieldFilterPicker : {
        equals                 : 'jednako',
        doesNotEqual           : 'nije jednako',
        isEmpty                : 'prazno',
        isNotEmpty             : 'nije prazno',
        contains               : 'sadrži',
        doesNotContain         : 'ne sadrži',
        startsWith             : 'počinje s',
        endsWith               : 'završava s',
        isOneOf                : 'jedan je od',
        isNotOneOf             : 'nije jedan od',
        isGreaterThan          : 'veći je od',
        isLessThan             : 'manji je od',
        isGreaterThanOrEqualTo : 'je veći ili jednak',
        isLessThanOrEqualTo    : 'je manji ili jednak',
        isBetween              : 'je između',
        isNotBetween           : 'nije između',
        isBefore               : 'je prije',
        isAfter                : 'je nakon',
        timeEquals             : 'vrijeme je jednako',
        timeDoesNotEqual       : 'vrijeme nije jednako',
        isToday                : 'je danas',
        isTomorrow             : 'je sutra',
        isYesterday            : 'je jučer',
        isThisWeek             : 'je ovaj tjedan',
        isNextWeek             : 'je sljedeći tjedan',
        isLastWeek             : 'je prošli tjedan',
        isThisMonth            : 'je ovaj mjesec',
        isNextMonth            : 'je sljedeći mjesec',
        isLastMonth            : 'je zadnji mjesec',
        isThisYear             : 'je ove godine',
        isNextYear             : 'je sljedeće godine',
        isLastYear             : 'je prethodne godine',
        isYearToDate           : 'je godina do danas',
        isTrue                 : 'je istina',
        isFalse                : 'je neispravno',
        selectAProperty        : 'Odaberite nekretninu',
        selectAnOperator       : 'Odaberite operatera',
        caseSensitive          : 'Osjetljivo na velika i mala slova',
        and                    : 'i',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Odaberite vrijednost',
        selectOneOrMoreValues  : 'Odaberite jednu ili više vrijednosti',
        enterAValue            : 'Unos vrijednosti',
        enterANumber           : 'Unos broja',
        selectADate            : 'Odaberite datum',
        selectATime            : 'Odaberite vrijeme'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Dodaj filter',
        applyCond : applied => applied ? 'Preskoči filter (trenutno primijenjen)' : 'Primijeni filter (trenutno preskočen)'
    },

    DateHelper : {
        locale         : 'hr',
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
            { single : 'sat', plural : 'sati', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'dan', plural : 'dani', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'tjedan', plural : 'tjedni', abbrev : 'w' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'mjesec', plural : 'mjeseci', abbrev : 'mon' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'tromjesečje', plural : 'tromjesečja', abbrev : 'q' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'godina', plural : 'godine', abbrev : 'yr' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'desetljeće', plural : 'desetljeća', abbrev : 'dec' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil'],
            [],
            ['s', 'sec'],
            [],
            ['m', 'min'],
            [],
            ['h', 'hr'],
            [],
            ['d'],
            [],
            ['w', 'wk'],
            [],
            ['mo', 'mon', 'mnt'],
            [],
            ['q', 'quar', 'qrt'],
            [],
            ['y', 'yr'],
            [],
            ['dec'],
            []
        ],
        parsers : {
            L   : 'D.M.YYYY.',
            LT  : 'HH:mm',
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
