import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'No',
    localeDesc : 'Norsk',
    localeCode : 'no',
    localeRtl  : false,

    Object : {
        Yes      : 'Ja',
        No       : 'Nei',
        Cancel   : 'Avbryt',
        Ok       : 'OK',
        Week     : 'Uke',
        None     : 'Ingen',
        previous : 'Forrige',
        next     : 'Neste',
        to       : 'til',
        at       : 'kl',
        on       : 'på',
        editing  : what => `Redigerer ${what}`,
        settings : 'Innstillinger',
        close    : 'Lukk',
        go       : 'Gå',
        save     : 'Lagre',
        cancel   : 'Avbryt',
        revert   : 'Restaurere',
        collapse : 'Skjul',
        expand   : 'Utvid',
        today    : 'I dag',
        andNMore : n => `og ${n} til`
    },

    AIBase : {
        delayStatusTexts : [
            'Venter',
            'Venter ...',
            'Venter fortsatt',
            'Venter fortsatt ...'
        ],
        autoStartDialogMessage        : 'Vil du aktivere AI stemmeaktivering?',
        voiceActivationToast          : phrase => `Stemmeaktivering aktivert, bruk uttrykket "${phrase}" for å starte en samtale`,
        voiceControlNotSupportedToast : 'Stemmestyring støttes ikke på denne enheten',
        voiceControlErrorToast        : 'Stemmestyring kunne ikke startes på enheten din',
        voiceControlSilenceToast      : phrase => `AI stemmesamtale avsluttet på grunn av stillhet. Bruk uttrykket ${phrase} for å starte samtalen på nytt`,
        noAudioDetected               : 'Ingen lyd oppdaget, vennligst prøv igjen',
        transcriptionErrorToast       : 'Transkripsjon mislyktes, vennligst prøv igjen',
        playbackErrorToast            : 'Lydavspilling mislyktes, vennligst sjekk lydutgangsenheten din',
        failed                        : '(mislyktes)',
        awaitingConfirmation          : 'Venter på bekreftelse',
        timeoutToast                  : 'Meldingen utløpte',
        readingStatusText             : modelName => `Leser ${modelName}er`,
        updatingStatusText            : modelName => `Oppdaterer ${modelName}er`,
        removingStatusText            : modelName => `Fjerner ${modelName}er`,
        addingStatusText              : modelName => `Legger til ${modelName}`,
        filteringStatusText           : modelName => `Filtrerer ${modelName}er`,
        thinkingStatusText            : 'Tenker',
        processingStatusText          : 'Behandler'
    },

    AISettingsPanel : {
        highlight               : 'Fremhev',
        verbosity               : 'Ordrikhet',
        voiceActivation         : 'Stemmeaktivering',
        enableVoiceActivation   : 'Aktiver stemmeaktivering',
        voiceOnly               : 'Kun stemme',
        autostart               : 'Automatisk start',
        dataChangeConfirmations : 'Bekreftelse på dataendring',
        add                     : 'Legg til',
        remove                  : 'Fjern',
        update                  : 'Oppdater',
        planning                : 'Planlegging',
        enablePlanning          : 'Aktiver planlegging',
        aiModel                 : 'AI-modell',
        timeline                : 'Tidslinje',
        'in-view'               : 'I visning',
        all                     : 'Alle',
        timeRangeContext        : 'Tidsområdekontekst'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI snakker',
        recordingTooltip      : 'Opptak',
        waitingTooltip        : 'AI tenker',
        startRecordingTooltip : 'Klikk for å starte',
        stopRecordingTooltip  : 'Klikk for å stoppe',
        inactiveTooltip       : 'Ikke opptak',
        openChatTooltip       : 'Høyreklikk for å åpne chat'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Skriv en melding',
        noConnectionTooltip     : 'Ingen tilkobling oppdaget, klikk for å prøve igjen',
        undone                  : 'angret',
        aborted                 : '(avbrutt)',
        readAloudTooltip        : 'Les meldingen høyt',
        confidenceTooltip       : confidence => `Selvtillit: ${confidence}%`,
        undoTooltip             : 'Angre dataendringer',
        redoTooltip             : 'Gjenopprett dataendringer',
        thumbsUp                : 'Tommel opp',
        thumbsDown              : 'Tommel ned',
        feedbackToast           : 'Takk for tilbakemeldingen din!',
        clearChat               : 'Tøm chat',
        closeChat               : 'Lukk chat',
        settings                : 'Innstillinger',
        closeSettings           : 'Lukk innstillinger'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Velg nøyaktig ${min}`,
        tooFewOptionsSelected     : min => `Velg minst ${min}`,
        tooManyOptionsSelected    : max => `Velg ikke mer enn ${max}`
    },

    CodeEditor : {
        apply        : 'Bruk',
        autoApply    : 'Automatisk bruk',
        downloadCode : 'Last ned kode'
    },

    ColorPicker : {
        noColor : 'Ingen farge'
    },

    Combo : {
        noResults          : 'Ingen treff',
        recordNotCommitted : 'Kunne ikke legge til oppføringen',
        addNewValue        : value => `Legg til ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Fremhev',
        preview         : 'Forhåndsvisning',
        approve         : 'Godkjenn',
        reject          : 'Avslå',
        confirmAdd      : 'Bekreft tillegg:',
        confirmUpdate   : 'Bekreft oppdatering:',
        confirmRemove   : 'Bekreft fjerning:',
        confirmCopy     : 'Bekreft kopiering',
        confirmAssign   : 'Bekreft tildeling',
        confirmReassign : 'Bekreft omfordeling',
        confirmUnassign : 'Bekreft fjerning av tildeling',
        confirmLink     : 'Bekreft lenke',
        confirmUnlink   : 'Bekreft frakobling'
    },

    FilePicker : {
        file : 'Fil'
    },

    Field : {
        badInput              : 'Ugyldig feltverdi',
        patternMismatch       : 'Verdien skal samsvare med et bestemt mønster',
        rangeOverflow         : value => `Verdien må være mindre eller lik ${value.max}`,
        rangeUnderflow        : value => `Verdien må være større eller lik ${value.min}`,
        stepMismatch          : 'Verdien skal passe til trinnet',
        tooLong               : 'Verdien skal være kortere',
        tooShort              : 'Verdien skal være lengre',
        typeMismatch          : 'Verdien skal være i et bestemt format',
        valueMissing          : 'Dette feltet er obligatorisk',
        invalidValue          : 'Ugyldig feltverdi',
        minimumValueViolation : 'Minimumsverdibrudd',
        maximumValueViolation : 'Maksimumsverdibrudd',
        fieldRequired         : 'Dette feltet er obligatorisk',
        validateFilter        : 'Verdien skal velges fra listen'
    },

    DateField : {
        invalidDate : format => 'Ugyldig datoformat, forventet format er ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Gå til forrige år',
        gotoPrevMonth : 'Gå til forrige måned',
        gotoNextMonth : 'Gå til neste måned',
        gotoNextYear  : 'Gå til neste år',
        navigation    : 'Dato velger navigasjon'
    },

    Hint : {
        dontShowAgain : 'Ikke vis igjen'
    },

    NumberFormat : {
        locale   : 'no',
        currency : 'NOK'
    },

    DurationField : {
        invalidUnit : 'Ugyldig enhet'
    },

    TimeField : {
        invalidTime : 'Ugyldig tidsinntasting'
    },

    TimePicker : {
        hour   : 'Time',
        minute : 'Minutt',
        second : 'Sekund'
    },

    Tooltip : {
        loading : 'Laster...'
    },

    List : {
        loading   : 'Laster...',
        selectAll : 'Velg alle'
    },

    GridBase : {
        loadMask : 'Laster...',
        syncMask : 'Lagrer endringer, vennligst vent...'
    },

    PagingToolbar : {
        firstPage         : 'Gå til første side',
        prevPage          : 'Gå til forrige side',
        page              : 'Side',
        nextPage          : 'Gå til neste side',
        lastPage          : 'Gå til siste side',
        reload            : 'Last inn gjeldende side på nytt',
        noRecords         : 'Ingen oppføringer å vise',
        pageCountTemplate : data => `av ${data.lastPage}`,
        summaryTemplate   : data => `Viser oppføringer ${data.start} - ${data.end} av ${data.allCount}`
    },

    Popup : {
        close    : 'Lukk popup',
        maximize : 'Maksimer'
    },

    Splitter : {
        ariaLabel      : 'Splitter, bruk piltastene for å endre størrelsen på de tilstøtende panelene',
        collapseLeft   : 'Skjul venstre panel',
        collapseRight  : 'Skjul høyre panel',
        collapseTop    : 'Skjul øverste panel',
        collapseBottom : 'Skjul nederste panel',
        expandLeft     : 'Vis venstre panel',
        expandRight    : 'Vis høyre panel',
        expandTop      : 'Vis øverste panel',
        expandBottom   : 'Vis nederste panel'
    },

    TabPanel : {
        containsInvalidFields : 'Fanen inneholder ugyldige felt'
    },

    Toolbar : {
        showOverflowingItems : 'Vis overfylte elementer',
        scrollForMore        : 'Rull for mer'
    },

    UndoRedo : {
        Undo           : 'Angre',
        Redo           : 'Gjøre om',
        UndoLastAction : 'Angre siste handling',
        RedoLastAction : 'Gjøre om siste handling',
        NoActions      : 'Ingen elementer I angrekøen'
    },

    FieldFilterPicker : {
        equals                 : 'er lik',
        doesNotEqual           : 'er ikke lik',
        isEmpty                : 'er tom',
        isNotEmpty             : 'er ikke tom',
        contains               : 'inneholder',
        doesNotContain         : 'inneholder ikke',
        startsWith             : 'begynner med',
        endsWith               : 'slutter med',
        isOneOf                : 'er et av',
        isNotOneOf             : 'er ikke et av',
        isGreaterThan          : 'er større enn',
        isLessThan             : 'er mindre enn',
        isGreaterThanOrEqualTo : 'er større enn eller lik',
        isLessThanOrEqualTo    : 'er mindre enn eller lik',
        isBetween              : 'er mellom',
        isNotBetween           : 'er ikke mellom',
        isBefore               : 'er før',
        isAfter                : 'er etter',
        timeEquals             : 'tid er lik',
        timeDoesNotEqual       : 'tid er ikke lik',
        isToday                : 'er i dag',
        isTomorrow             : 'er i morgen',
        isYesterday            : 'er i går',
        isThisWeek             : 'er denne uken',
        isNextWeek             : 'er neste uke',
        isLastWeek             : 'er siste uke',
        isThisMonth            : 'er denne måneden',
        isNextMonth            : 'er neste måned',
        isLastMonth            : 'er siste måned',
        isThisYear             : 'er i år',
        isNextYear             : 'er neste år',
        isLastYear             : 'er i fjor',
        isYearToDate           : 'er år til dags dato',
        isTrue                 : 'er sant',
        isFalse                : 'er falsk',
        selectAProperty        : 'Velg egenskap',
        selectAnOperator       : 'Velg operatør',
        caseSensitive          : 'Skille mellom store og små bokstaver',
        and                    : 'og',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Velg verdi',
        selectOneOrMoreValues  : 'Velg én eller flere verdier',
        enterAValue            : 'Skriv inn en verdi',
        enterANumber           : 'Skriv inn et tall',
        selectADate            : 'Velg en dato',
        selectATime            : 'Velg tidspunkt'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Legg til filter',
        applyCond : applied => applied ? 'Hopp over filter (for øyeblikket brukt)' : 'Bruk filter (for øyeblikket hoppet over)'
    },

    DateHelper : {
        locale         : 'no',
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
            { single : 'millisekund', plural : 'ms', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'sekund', plural : 'sekunder', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minutt', plural : 'minutter', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'time', plural : 'timer', abbrev : 't' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'dag', plural : 'dager', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'uke', plural : 'uker', abbrev : 'u' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'måned', plural : 'måneder', abbrev : 'mån' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'kvartal', plural : 'kvartaler', abbrev : 'k' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'år', plural : 'år', abbrev : 'år' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'tiår', plural : 'tiår', abbrev : 'tår' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mls'],
            [],
            ['s', 'sek'],
            [],
            ['m', 'min'],
            [],
            ['t', 't'],
            [],
            ['d'],
            [],
            ['u', 'uk'],
            [],
            ['må', 'mån', 'mdr'],
            [],
            ['k', 'kvart', 'kvt'],
            [],
            ['å', 'år'],
            [],
            ['dek'],
            []
        ],
        parsers : {
            L   : 'DD.MM.YYYY;',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number,
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}-tallet`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
