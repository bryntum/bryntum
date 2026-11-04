import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Da',
    localeDesc : 'Dansk',
    localeCode : 'da',
    localeRtl  : false,

    Object : {
        Yes      : 'Ja',
        No       : 'Nej',
        Cancel   : 'Annullér',
        Ok       : 'OK',
        Week     : 'Uge',
        None     : 'Ingen',
        previous : 'Forrige',
        next     : 'Næste',
        to       : 'til',
        at       : 'ved',
        on       : 'på',
        editing  : what => `Redigerer ${what}`,
        settings : 'Indstillinger',
        close    : 'Luk',
        go       : 'Gå',
        save     : 'Gem',
        cancel   : 'Annuller',
        revert   : 'Tilbage',
        collapse : 'Kollaps',
        expand   : 'Udvide',
        today    : 'I dag',
        andNMore : n => `og ${n} mere`
    },

    AIBase : {
        delayStatusTexts : [
            'Venter',
            'Venter ...',
            'Venter stadig',
            'Venter stadig ...'
        ],
        autoStartDialogMessage        : 'Vil du aktivere AI stemmeaktivering?',
        voiceActivationToast          : phrase => `Stemmeaktivering aktiveret, brug sætningen "${phrase}" for at starte en samtale`,
        voiceControlNotSupportedToast : 'Stemmestyring understøttes ikke på denne enhed',
        voiceControlErrorToast        : 'Stemmestyring kunne ikke startes på din enhed',
        voiceControlSilenceToast      : phrase => `AI stemmesamtale afsluttet på grund af stilhed. Brug sætningen ${phrase} for at genstarte samtalen`,
        noAudioDetected               : 'Ingen lyd registreret, prøv venligst igen',
        transcriptionErrorToast       : 'Transkription mislykkedes, prøv venligst igen',
        playbackErrorToast            : 'Lydafspilning mislykkedes, kontroller venligst din lydudgangsenhed',
        failed                        : '(mislykkedes)',
        awaitingConfirmation          : 'Afventer bekræftelse',
        timeoutToast                  : 'Besked udløbet',
        readingStatusText             : modelName => `Læser ${modelName}s`,
        updatingStatusText            : modelName => `Opdaterer ${modelName}s`,
        removingStatusText            : modelName => `Fjerner ${modelName}s`,
        addingStatusText              : modelName => `Tilføjer ${modelName}`,
        filteringStatusText           : modelName => `Filtrerer ${modelName}s`,
        thinkingStatusText            : 'Tænker',
        processingStatusText          : 'Behandler'
    },

    AISettingsPanel : {
        highlight               : 'Fremhæv',
        verbosity               : 'Verbositetsniveau',
        voiceActivation         : 'Stemmeaktivering',
        enableVoiceActivation   : 'Aktiver stemmeaktivering',
        voiceOnly               : 'Kun stemme',
        autostart               : 'Automatisk start',
        dataChangeConfirmations : 'Bekræftelse af dataændringer',
        add                     : 'Tilføj',
        remove                  : 'Fjern',
        update                  : 'Opdater',
        planning                : 'Planlægning',
        enablePlanning          : 'Aktiver planlægning',
        aiModel                 : 'AI-model',
        timeline                : 'Tidslinje',
        'in-view'               : 'I visning',
        all                     : 'Alle',
        timeRangeContext        : 'Tidsintervalkontekst'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI taler',
        recordingTooltip      : 'Optager',
        waitingTooltip        : 'AI tænker',
        startRecordingTooltip : 'Klik for at starte',
        stopRecordingTooltip  : 'Klik for at stoppe',
        inactiveTooltip       : 'Ikke optager',
        openChatTooltip       : 'Højreklik for at åbne chat'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Skriv en besked',
        noConnectionTooltip     : 'Ingen forbindelse registreret, klik for at prøve igen',
        undone                  : 'fortrydt',
        aborted                 : '(afbrudt)',
        readAloudTooltip        : 'Læs besked højt',
        confidenceTooltip       : confidence => `Tillid: ${confidence}%`,
        undoTooltip             : 'Fortryd dataændringer',
        redoTooltip             : 'Gendan dataændringer',
        thumbsUp                : 'Tommel op',
        thumbsDown              : 'Tommel ned',
        feedbackToast           : 'Tak for din feedback!',
        clearChat               : 'Ryd chat',
        closeChat               : 'Luk chat',
        settings                : 'Indstillinger',
        closeSettings           : 'Luk indstillinger'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Vælg præcis ${min}`,
        tooFewOptionsSelected     : min => `Vælg mindst ${min}`,
        tooManyOptionsSelected    : max => `Vælg højst ${max}`
    },

    CodeEditor : {
        apply        : 'Anvend',
        autoApply    : 'Automatisk anvendelse',
        downloadCode : 'Download kode'
    },

    ColorPicker : {
        noColor : 'Ingen farve'
    },

    Combo : {
        noResults          : 'Ingen resultater',
        recordNotCommitted : 'Række kunne ikke tilføjes',
        addNewValue        : value => `Tilføj ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Fremhæv',
        preview         : 'Forhåndsvisning',
        approve         : 'Godkend',
        reject          : 'Afvis',
        confirmAdd      : 'Bekræft tilføjelse:',
        confirmUpdate   : 'Bekræft opdatering:',
        confirmRemove   : 'Bekræft fjernelse:',
        confirmCopy     : 'Bekræft kopiering',
        confirmAssign   : 'Bekræft tildeling',
        confirmReassign : 'Bekræft omfordeling',
        confirmUnassign : 'Bekræft fjernelse af tildeling',
        confirmLink     : 'Bekræft link',
        confirmUnlink   : 'Bekræft fjernelse af link'
    },

    FilePicker : {
        file : 'Fil'
    },

    Field : {
        badInput              : 'Ugyldig feltværdi',
        patternMismatch       : 'Værdien skal matche et bestemt mønster',
        rangeOverflow         : value => `Værdien skal være mindre end eller lig med ${value.max}`,
        rangeUnderflow        : value => `Værdien skal være større end eller lig med ${value.min}`,
        stepMismatch          : 'Værdien skal passe til trinnet',
        tooLong               : 'Værdien skal være kortere',
        tooShort              : 'Værdien skal være længere',
        typeMismatch          : 'Værdien skal være i et særligt format',
        valueMissing          : 'dette felt er påkrævet',
        invalidValue          : 'Ugyldig feltværdi',
        minimumValueViolation : 'Overtrædelse af minimumsværdien',
        maximumValueViolation : 'Maksimal værdikrænkelse',
        fieldRequired         : 'Dette felt er påkrævet',
        validateFilter        : 'Værdien skal vælges på listen'
    },

    DateField : {
        invalidDate : format => 'Ugyldig datoindgang, forventet format er ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Gå til forrige år',
        gotoPrevMonth : 'Gå til forrige måned',
        gotoNextMonth : 'Gå til næste måned',
        gotoNextYear  : 'Gå til næste år',
        navigation    : 'Dato vælger navigation'
    },

    Hint : {
        dontShowAgain : 'Vis ikke igen'
    },

    NumberFormat : {
        locale   : 'da',
        currency : 'DKK'
    },

    DurationField : {
        invalidUnit : 'Ugyldig enhed'
    },

    TimeField : {
        invalidTime : 'Ugyldig tidsangivelse'
    },

    TimePicker : {
        hour   : 'Time',
        minute : 'Minut',
        second : 'Sekund'
    },

    Tooltip : {
        loading : 'Indlæser...'
    },

    List : {
        loading   : 'Indlæser...',
        selectAll : 'Vælg alle'
    },

    GridBase : {
        loadMask : 'Indlæser...',
        syncMask : 'Gemmer ændringer, vent venligst...'
    },

    PagingToolbar : {
        firstPage         : 'Gå til første side',
        prevPage          : 'Gå til forrige side',
        page              : 'Side',
        nextPage          : 'Gå til næste side',
        lastPage          : 'Gå til sidste side',
        reload            : 'Genindlæs den aktuelle side',
        noRecords         : 'Ingen poster at vise',
        pageCountTemplate : data => `af ${data.lastPage}`,
        summaryTemplate   : data => `Viser poster ${data.start} - ${data.end} af ${data.allCount}`
    },

    Popup : {
        close    : 'Luk dialog',
        maximize : 'Maksimer'
    },

    Splitter : {
        ariaLabel      : 'Splitter, brug piletasterne til at ændre størrelsen på de tilstødende paneler',
        collapseLeft   : 'Skjul venstre panel',
        collapseRight  : 'Skjul højre panel',
        collapseTop    : 'Skjul øverste panel',
        collapseBottom : 'Skjul nederste panel',
        expandLeft     : 'Vis venstre panel',
        expandRight    : 'Vis højre panel',
        expandTop      : 'Vis øverste panel',
        expandBottom   : 'Vis nederste panel'
    },

    TabPanel : {
        containsInvalidFields : 'Fanen indeholder ugyldige felter'
    },

    Toolbar : {
        showOverflowingItems : 'Vis overfyldte elementer',
        scrollForMore        : 'Rul for mere'
    },

    UndoRedo : {
        Undo           : 'Fortryd',
        Redo           : 'Gentag',
        UndoLastAction : 'Fortryd foregående handling',
        RedoLastAction : 'Gentag den foregående fortrudte handling',
        NoActions      : 'Ingen handlinger registreret'
    },

    FieldFilterPicker : {
        equals                 : 'lig med',
        doesNotEqual           : 'er ikke lig',
        isEmpty                : 'er tom',
        isNotEmpty             : 'er ikke tom',
        contains               : 'indeholder',
        doesNotContain         : 'indeholder ikke',
        startsWith             : 'starter med',
        endsWith               : 'slutter med',
        isOneOf                : 'er en af',
        isNotOneOf             : 'er ikke en af',
        isGreaterThan          : 'er større end',
        isLessThan             : 'er mindre end',
        isGreaterThanOrEqualTo : 'er større end eller lig med',
        isLessThanOrEqualTo    : 'er mindre end eller lig med',
        isBetween              : 'er mellem',
        isNotBetween           : 'er ikke mellem',
        isBefore               : 'er før',
        isAfter                : 'er efter',
        timeEquals             : 'tiden er lig med',
        timeDoesNotEqual       : 'tiden er ikke lig med',
        isToday                : 'er i dag',
        isTomorrow             : 'er i morgen',
        isYesterday            : 'er i går',
        isThisWeek             : 'er denne uge',
        isNextWeek             : 'er i næste uge',
        isLastWeek             : 'er i sidste uge',
        isThisMonth            : 'er denne måned',
        isNextMonth            : 'er næste måned',
        isLastMonth            : 'er sidste måned',
        isThisYear             : 'er i år',
        isNextYear             : 'er næste år',
        isLastYear             : 'er sidste år',
        isYearToDate           : 'er år til dato',
        isTrue                 : 'er sand',
        isFalse                : 'er falsk',
        selectAProperty        : 'Vælg en ejendom',
        selectAnOperator       : 'Vælg en operatør',
        caseSensitive          : 'Stillende mellem store og små bogstaver',
        and                    : 'og',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Vælg værdi',
        selectOneOrMoreValues  : 'Vælg en eller flere værdier',
        enterAValue            : 'Indtast en værdi',
        enterANumber           : 'Indtast et tal',
        selectADate            : 'Vælg en dato',
        selectATime            : 'Vælg tid'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Tilføj filter',
        applyCond : applied => applied ? 'Spring filter over (aktuelt anvendt)' : 'Anvend filter (aktuelt fravalgt)'
    },

    DateHelper : {
        locale         : 'da',
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
            { single : 'Millisekund', plural : 'Millisekunder', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'Sekund', plural : 'Sekunder', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'Minut', plural : 'Minutter', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'Time', plural : 'Timer', abbrev : 't' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'Dag', plural : 'Dage', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'Uge', plural : 'Uger', abbrev : 'u' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'Måned', plural : 'Måneder', abbrev : 'mdr' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'Kvartal', plural : 'Kvartaler', abbrev : 'kv' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'År', plural : 'År', abbrev : 'år' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'Årti', plural : 'Årtier', abbrev : 'årti(er)' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil', 'ms'],
            [],
            ['s', 'sek'],
            [],
            ['m', 'min'],
            [],
            ['t'],
            [],
            ['d'],
            [],
            ['u'],
            [],
            ['m', 'mdr'],
            [],
            ['k', 'kv'],
            [],
            ['å', 'år'],
            [],
            ['årti', 'årtier'],
            []
        ],
        parsers : {
            L   : 'DD.MM.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss'
        },
        ordinalSuffix : number => number,
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}'erne`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
