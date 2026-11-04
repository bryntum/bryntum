import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'SvSE',
    localeDesc : 'Svenska',
    localeCode : 'sv-SE',
    localeRtl  : false,

    Object : {
        Yes      : 'Ja',
        No       : 'Nej',
        Cancel   : 'Avbryt',
        Ok       : 'OK',
        Week     : 'Vecka',
        None     : 'Ingen',
        previous : 'Previous',
        next     : 'Next',
        to       : 'till',
        at       : 'vid',
        on       : 'på',
        editing  : what => `Redigerar ${what}`,
        settings : 'Inställningar',
        close    : 'Stäng',
        go       : 'Gå',
        save     : 'Spara',
        cancel   : 'Avbryt',
        revert   : 'Återställ',
        collapse : 'Fäll ihop',
        expand   : 'Expandera',
        today    : 'Idag',
        andNMore : n => `och ${n} till`
    },

    AIBase : {
        delayStatusTexts : [
            'Väntar',
            'Väntar ...',
            'Väntar fortfarande',
            'Väntar fortfarande ...'
        ],
        autoStartDialogMessage        : 'Vill du aktivera AI-röstaktivering?',
        voiceActivationToast          : phrase => `Röstaktivering aktiverad, använd frasen "${phrase}" för att starta en konversation`,
        voiceControlNotSupportedToast : 'Röststyrning stöds inte på denna enhet',
        voiceControlErrorToast        : 'Röststyrning kunde inte startas på din enhet',
        voiceControlSilenceToast      : phrase => `AI röstkonversation avslutades på grund av tystnad. Använd frasen ${phrase} för att starta om konversationen`,
        noAudioDetected               : 'Ingen ljud upptäckt, försök igen',
        transcriptionErrorToast       : 'Transkribering misslyckades, vänligen försök igen',
        playbackErrorToast            : 'Ljuduppspelning misslyckades, vänligen kontrollera din ljudutgångsenhet',
        failed                        : '(misslyckades)',
        awaitingConfirmation          : 'Väntar på bekräftelse',
        timeoutToast                  : 'Meddelandet förföll',
        readingStatusText             : modelName => `Läser ${modelName}s`,
        updatingStatusText            : modelName => `Uppdaterar ${modelName}s`,
        removingStatusText            : modelName => `Tar bort ${modelName}s`,
        addingStatusText              : modelName => `Lägger till ${modelName}`,
        filteringStatusText           : modelName => `Filtrerar ${modelName}s`,
        thinkingStatusText            : 'Tänker',
        processingStatusText          : 'Bearbetar'
    },

    AISettingsPanel : {
        highlight               : 'Markera',
        verbosity               : 'Ordrikedom',
        voiceActivation         : 'Röstaktivering',
        enableVoiceActivation   : 'Aktivera röstaktivering',
        voiceOnly               : 'Endast röst',
        autostart               : 'Automatisk start',
        dataChangeConfirmations : 'Bekräftelse vid dataändring',
        add                     : 'Lägg till',
        remove                  : 'Ta bort',
        update                  : 'Uppdatera',
        planning                : 'Planering',
        enablePlanning          : 'Aktivera planering',
        aiModel                 : 'AI-modell',
        timeline                : 'Tidslinje',
        'in-view'               : 'I vy',
        all                     : 'Alla',
        timeRangeContext        : 'Tidsintervallskontext'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI talar',
        recordingTooltip      : 'Spelar in',
        waitingTooltip        : 'AI tänker',
        startRecordingTooltip : 'Klicka för att starta',
        stopRecordingTooltip  : 'Klicka för att stoppa',
        inactiveTooltip       : 'Spelar inte in',
        openChatTooltip       : 'Högerklicka för att öppna chatten'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Skriv ett meddelande',
        noConnectionTooltip     : 'Ingen anslutning upptäckt, klicka för att försöka igen',
        undone                  : 'ogjort',
        aborted                 : '(avbrutet)',
        readAloudTooltip        : 'Läs meddelandet högt',
        confidenceTooltip       : confidence => `Tillförlitlighet: ${confidence}%`,
        undoTooltip             : 'Ångra dataändringar',
        redoTooltip             : 'Gör om dataändringar',
        thumbsUp                : 'Tummen upp',
        thumbsDown              : 'Tummen ner',
        feedbackToast           : 'Tack för din feedback!',
        clearChat               : 'Rensa chatt',
        closeChat               : 'Stäng chatten',
        settings                : 'Inställningar',
        closeSettings           : 'Stäng inställningar'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Välj exakt ${min}`,
        tooFewOptionsSelected     : min => `Välj minst ${min}`,
        tooManyOptionsSelected    : max => `Välj högst ${max}`
    },

    CodeEditor : {
        apply        : 'Verkställ',
        autoApply    : 'Verkställ automatiskt',
        downloadCode : 'Ladda ner kod'
    },

    ColorPicker : {
        noColor : 'Ingen färg'
    },

    Combo : {
        noResults          : 'Inga resultat',
        recordNotCommitted : 'Post kunde inte läggas till',
        addNewValue        : value => `Lägg till ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Markera',
        preview         : 'Förhandsgranska',
        approve         : 'Godkänn',
        reject          : 'Avvisa',
        confirmAdd      : 'Bekräfta tillägg:',
        confirmUpdate   : 'Bekräfta uppdatering:',
        confirmRemove   : 'Bekräfta borttagning:',
        confirmCopy     : 'Bekräfta kopiering',
        confirmAssign   : 'Bekräfta tilldelning',
        confirmReassign : 'Bekräfta omfördelning',
        confirmUnassign : 'Bekräfta av tilldelning',
        confirmLink     : 'Bekräfta länk',
        confirmUnlink   : 'Bekräfta avlänkning'
    },

    FilePicker : {
        file : 'Fil'
    },

    Field : {
        badInput              : 'Ogiltigt värde',
        patternMismatch       : 'Värdet ska matcha ett specifikt mönster',
        rangeOverflow         : value => `Värdet måste vara mindre än eller lika med ${value.max}`,
        rangeUnderflow        : value => `Värdet måste vara större än eller lika med ${value.min}`,
        stepMismatch          : 'Värdet bör passa steget',
        tooLong               : 'Värdet för långt',
        tooShort              : 'Värdet för kort',
        typeMismatch          : 'Värdet är inte i förväntat format',
        valueMissing          : 'Detta fält är obligatoriskt',
        invalidValue          : 'Ogiltigt värde',
        minimumValueViolation : 'För lågt värde',
        maximumValueViolation : 'För högt värde',
        fieldRequired         : 'Detta fält är obligatoriskt',
        validateFilter        : 'Värdet måste väljas från listan'
    },

    DateField : {
        invalidDate : format => 'Ogiltigt datum, förväntat format är ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Gå till föregående år',
        gotoPrevMonth : 'Gå till föregående månad',
        gotoNextMonth : 'Gå till nästa månad',
        gotoNextYear  : 'Gå till nästa år',
        navigation    : 'Navigering för datumväljare'
    },

    Hint : {
        dontShowAgain : 'Visa inte igen'
    },

    NumberFormat : {
        locale   : 'sv-SE',
        currency : 'SEK'
    },

    DurationField : {
        invalidUnit : 'Ogiltig enhet'
    },

    TimeField : {
        invalidTime : 'Ogiltig tid'
    },

    TimePicker : {
        hour   : 'Timme',
        minute : 'Minut',
        second : 'sekund'
    },

    Tooltip : {
        loading : 'Laddar...'
    },

    List : {
        loading   : 'Laddar...',
        selectAll : 'Välj alla'
    },

    GridBase : {
        loadMask : 'Laddar...',
        syncMask : 'Sparar ändringar, vänligen vänta...'
    },

    PagingToolbar : {
        firstPage         : 'Gå till första sidan',
        prevPage          : 'Gå till föregående sida',
        page              : 'Sida',
        nextPage          : 'Gå till nästa sida',
        lastPage          : 'Gå till sista sidan',
        reload            : 'Ladda om den aktuella sidan',
        noRecords         : 'Inga rader att visa',
        pageCountTemplate : data => `av ${data.lastPage}`,
        summaryTemplate   : data => `Visar poster ${data.start} - ${data.end} av ${data.allCount}`
    },

    Popup : {
        close    : 'Stäng',
        maximize : 'Maximera'
    },

    Splitter : {
        ariaLabel      : 'Splitter, använd piltangenterna för att ändra storlek på de angränsande panelerna',
        collapseLeft   : 'Fäll in vänster panel',
        collapseRight  : 'Fäll in höger panel',
        collapseTop    : 'Fäll in övre panel',
        collapseBottom : 'Fäll in nedre panel',
        expandLeft     : 'Fäll ut vänster panel',
        expandRight    : 'Fäll ut höger panel',
        expandTop      : 'Fäll ut övre panel',
        expandBottom   : 'Fäll ut nedre panel'
    },

    TabPanel : {
        containsInvalidFields : 'Fliken innehåller ogiltiga fält'
    },

    Toolbar : {
        showOverflowingItems : 'Visa överfyllda objekt',
        scrollForMore        : 'Rulla för mer'
    },

    UndoRedo : {
        Undo           : 'Ångra',
        Redo           : 'Gör om',
        UndoLastAction : 'Ångra senaste åtgärden',
        RedoLastAction : 'Gör om senast ångrade åtgärden',
        NoActions      : 'Inga åtgärder inspelade'
    },

    FieldFilterPicker : {
        equals                 : 'är lika med',
        doesNotEqual           : 'är inte lika med',
        isEmpty                : 'är tom',
        isNotEmpty             : 'är inte tom',
        contains               : 'innehåller',
        doesNotContain         : 'innehåller inte',
        startsWith             : 'börjar med',
        endsWith               : 'slutar med',
        isOneOf                : 'är en av',
        isNotOneOf             : 'är inte en av',
        isGreaterThan          : 'är större än',
        isLessThan             : 'är mindre än',
        isGreaterThanOrEqualTo : 'är större än eller lika med',
        isLessThanOrEqualTo    : 'är mindre än eller lika med',
        isBetween              : 'är mellan',
        isNotBetween           : 'är inte mellan',
        isBefore               : 'är före',
        isAfter                : 'är efter',
        timeEquals             : 'tiden är lika med',
        timeDoesNotEqual       : 'tiden är inte lika med',
        isToday                : 'är idag',
        isTomorrow             : 'är imorgon',
        isYesterday            : 'är igår',
        isThisWeek             : 'är denna vecka',
        isNextWeek             : 'är nästa vecka',
        isLastWeek             : 'är föregående vecka',
        isThisMonth            : 'är denna månad',
        isNextMonth            : 'är nästa månad',
        isLastMonth            : 'är föregående månad',
        isThisYear             : 'är i år',
        isNextYear             : 'är nästa år',
        isLastYear             : 'är föregående år',
        isYearToDate           : 'är i år fram till idag',
        isTrue                 : 'är sant',
        isFalse                : 'är falskt',
        selectAProperty        : 'Välj ett fält',
        selectAnOperator       : 'Välj en jämförelseoperator',
        caseSensitive          : 'Skiftlägeskänslig',
        and                    : 'och',
        dateFormat             : 'YYYY-MM-DD',
        selectValue            : 'Välj värde',
        selectOneOrMoreValues  : 'Välj ett eller flera värden',
        enterAValue            : 'Ange ett värde',
        enterANumber           : 'Ange ett nummer',
        selectADate            : 'Välj ett datum',
        selectATime            : 'Välj tid'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Lägg till filter',
        applyCond : applied => applied ? 'Hoppa över filter (för närvarande tillämpat)' : 'Tillämpa filter (för närvarande hoppat över)'
    },

    DateHelper : {
        locale         : 'sv-SE',
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
            { single : 'millisekund', plural : 'millisekunder', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'sekund', plural : 'sekunder', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minut', plural : 'minuter', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'timme', plural : 'timmar', abbrev : 'tim' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'dag', plural : 'dagar', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'vecka', plural : 'vecka', abbrev : 'v' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'månad', plural : 'månader', abbrev : 'mån' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'kvartal', plural : 'kvartal', abbrev : 'kv' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'år', plural : 'år', abbrev : 'år' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'årtionde', plural : 'årtionden', abbrev : 'årtionden' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['ms', 'mil'],
            [],
            ['s', 'sek'],
            [],
            ['m', 'min'],
            [],
            ['t', 'tim', 'h'],
            [],
            ['d'],
            [],
            ['v', 've'],
            [],
            ['må', 'mån'],
            [],
            ['kv', 'kva'],
            [],
            [],
            [],
            [],
            []
        ],
        parsers : {
            L   : 'YYYY-MM-DD',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss'
        },
        ordinalSuffix : number => {
            const lastDigit = number[number.length - 1];
            return number + (number !== '11' && number !== '12' && (lastDigit === '1' || lastDigit === '2') ? 'a' : 'e');
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}-talet`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
