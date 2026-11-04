import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Nl',
    localeDesc : 'Nederlands',
    localeCode : 'nl',
    localeRtl  : false,

    Object : {
        Yes      : 'Ja',
        No       : 'Nee',
        Cancel   : 'Annuleren',
        Ok       : 'OK',
        Week     : 'Week',
        None     : 'Geen',
        previous : 'Previous',
        next     : 'Next',
        to       : 'tot',
        at       : 'om',
        on       : 'op',
        editing  : what => `Bewerken van ${what}`,
        settings : 'Instellingen',
        close    : 'Sluiten',
        go       : 'Ga',
        save     : 'Opslaan',
        cancel   : 'Annuleren',
        revert   : 'Herstellen',
        collapse : 'Klap in',
        expand   : 'Klap uit',
        today    : 'Vandaag',
        andNMore : n => `en ${n} meer`
    },

    AIBase : {
        delayStatusTexts : [
            'Wachten',
            'Wachten ...',
            'Nog steeds wachten',
            'Nog steeds wachten ...'
        ],
        autoStartDialogMessage        : 'Wilt u AI-spraakactivatie inschakelen?',
        voiceActivationToast          : phrase => `Spraakactivatie ingeschakeld, gebruik de zin "${phrase}" om een gesprek te starten`,
        voiceControlNotSupportedToast : 'Spraakbesturing wordt niet ondersteund op dit apparaat',
        voiceControlErrorToast        : 'Spraakbesturing kon niet worden gestart op uw apparaat',
        voiceControlSilenceToast      : phrase => `AI spraakgesprek beëindigd vanwege stilte. Gebruik de zin ${phrase} om het gesprek opnieuw te starten`,
        noAudioDetected               : 'Geen audio gedetecteerd, probeer het opnieuw',
        transcriptionErrorToast       : 'Transcriptie mislukt, probeer het opnieuw',
        playbackErrorToast            : 'Audio afspelen mislukt, controleer uw audio-uitvoerapparaat',
        failed                        : '(mislukt)',
        awaitingConfirmation          : 'Wachten op bevestiging',
        timeoutToast                  : 'Bericht verlopen',
        readingStatusText             : modelName => `Lezen van ${modelName}s`,
        updatingStatusText            : modelName => `Bijwerken van ${modelName}s`,
        removingStatusText            : modelName => `Verwijderen van ${modelName}s`,
        addingStatusText              : modelName => `Toevoegen van ${modelName}`,
        filteringStatusText           : modelName => `Filteren van ${modelName}s`,
        thinkingStatusText            : 'Nadenken',
        processingStatusText          : 'Verwerken'
    },

    AISettingsPanel : {
        highlight               : 'Markeren',
        verbosity               : 'Spreekzaamheid',
        voiceActivation         : 'Stemactivatie',
        enableVoiceActivation   : 'Stemactivatie inschakelen',
        voiceOnly               : 'Alleen stem',
        autostart               : 'Automatisch starten',
        dataChangeConfirmations : 'Bevestigingen voor gegevenswijzigingen',
        add                     : 'Toevoegen',
        remove                  : 'Verwijderen',
        update                  : 'Bijwerken',
        planning                : 'Planning',
        enablePlanning          : 'Planning inschakelen',
        aiModel                 : 'AI-model',
        timeline                : 'Tijdlijn',
        'in-view'               : 'In beeld',
        all                     : 'Alle',
        timeRangeContext        : 'Tijdsbereikcontext'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI spreekt',
        recordingTooltip      : 'Opnemen',
        waitingTooltip        : 'AI denkt',
        startRecordingTooltip : 'Klik om te starten',
        stopRecordingTooltip  : 'Klik om te stoppen',
        inactiveTooltip       : 'Niet opnemen',
        openChatTooltip       : 'Klik met de rechtermuisknop om de chat te openen'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Typ een bericht',
        noConnectionTooltip     : 'Geen verbinding gedetecteerd, klik om opnieuw te proberen',
        undone                  : 'ongedaan gemaakt',
        aborted                 : '(afgebroken)',
        readAloudTooltip        : 'Lees bericht hardop voor',
        confidenceTooltip       : confidence => `Vertrouwen: ${confidence}%`,
        undoTooltip             : 'Gegevenswijzigingen ongedaan maken',
        redoTooltip             : 'Gegevenswijzigingen opnieuw uitvoeren',
        thumbsUp                : 'Duim omhoog',
        thumbsDown              : 'Duim omlaag',
        feedbackToast           : 'Bedankt voor uw feedback!',
        clearChat               : 'Chat wissen',
        closeChat               : 'Sluit chat',
        settings                : 'Instellingen',
        closeSettings           : 'Instellingen sluiten'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Selecteer precies ${min}`,
        tooFewOptionsSelected     : min => `Selecteer ten minste ${min}`,
        tooManyOptionsSelected    : max => `Selecteer niet meer dan ${max}`
    },

    CodeEditor : {
        apply        : 'Toepassen',
        autoApply    : 'Automatisch toepassen',
        downloadCode : 'Code downloaden'
    },

    ColorPicker : {
        noColor : 'Geen kleur'
    },

    Combo : {
        noResults          : 'Geen resultaten',
        recordNotCommitted : 'Record kan niet worden toegevoegd',
        addNewValue        : value => `${value} toevoegen`
    },

    ConfirmationDialog : {
        highlight       : 'Markeren',
        preview         : 'Voorbeeld',
        approve         : 'Goedkeuren',
        reject          : 'Afwijzen',
        confirmAdd      : 'Bevestig toevoegen:',
        confirmUpdate   : 'Bevestig bijwerken:',
        confirmRemove   : 'Bevestig verwijderen:',
        confirmCopy     : 'Bevestig kopiëren',
        confirmAssign   : 'Bevestig toewijzing',
        confirmReassign : 'Bevestig her-toewijzing',
        confirmUnassign : 'Bevestig ontkoppeling',
        confirmLink     : 'Bevestig link',
        confirmUnlink   : 'Bevestig ontkoppeling'
    },

    FilePicker : {
        file : 'Vijl'
    },

    Field : {
        badInput              : 'Ongeldige veldwaarde',
        patternMismatch       : 'Waarde moet overeenkomen met een specifiek patroon',
        rangeOverflow         : value => `Waarde moet kleiner zijn dan of gelijk aan ${value.max}`,
        rangeUnderflow        : value => `Waarde moet groter zijn dan of gelijk aan ${value.min}`,
        stepMismatch          : 'Waarde moet bij de stap passen',
        tooLong               : 'Waarde moet korter zijn',
        tooShort              : 'Waarde moet langer zijn',
        typeMismatch          : 'Waarde moet een speciaal formaat hebben',
        valueMissing          : 'Dit veld is verplicht',
        invalidValue          : 'Ongeldige veldwaarde',
        minimumValueViolation : 'Minimale waarde schending',
        maximumValueViolation : 'Maximale waarde schending',
        fieldRequired         : 'Dit veld is verplicht',
        validateFilter        : 'Waarde moet worden geselecteerd in de lijst'
    },

    DateField : {
        invalidDate : format => 'Ongeldige datum invoer, verwacht formaat is ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Ga naar vorig jaar',
        gotoPrevMonth : 'Ga naar vorige maand',
        gotoNextMonth : 'Ga naar volgende maand',
        gotoNextYear  : 'Ga naar volgend jaar',
        navigation    : 'Navigatie van de datumkiezer'
    },

    Hint : {
        dontShowAgain : 'Niet opnieuw tonen'
    },

    NumberFormat : {
        locale   : 'nl',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Ongeldige eenheid'
    },

    TimeField : {
        invalidTime : 'Ongeldige tijdsinvoer'
    },

    TimePicker : {
        hour   : 'Uur',
        minute : 'Minuut',
        second : 'Seconde'
    },

    Tooltip : {
        loading : 'Laden...'
    },

    List : {
        loading   : 'Laden...',
        selectAll : 'Alles selecteren'
    },

    GridBase : {
        loadMask : 'Laden...',
        syncMask : 'Bezig met opslaan...'
    },

    PagingToolbar : {
        firstPage         : 'Ga naar de eerste pagina',
        prevPage          : 'Ga naar de vorige pagina',
        page              : 'Pagina',
        nextPage          : 'Ga naar de volgende pagina',
        lastPage          : 'Ga naar de laatste pagina',
        reload            : 'Laad huidige pagina opnieuw',
        noRecords         : 'Geen rijen om weer te geven',
        pageCountTemplate : data => `van ${data.lastPage}`,
        summaryTemplate   : data => `Records ${data.start} - ${data.end} van ${data.allCount} worden weergegeven`
    },

    Popup : {
        close    : 'Sluiten',
        maximize : 'Maximaliseren'
    },

    Splitter : {
        ariaLabel      : 'Splitter, gebruik de pijltjestoetsen om de aangrenzende panelen te wijzigen',
        collapseLeft   : 'Linkerpaneel invouwen',
        collapseRight  : 'Rechterpaneel invouwen',
        collapseTop    : 'Bovenste paneel invouwen',
        collapseBottom : 'Onderste paneel invouwen',
        expandLeft     : 'Linkerpaneel uitvouwen',
        expandRight    : 'Rechterpaneel uitvouwen',
        expandTop      : 'Bovenste paneel uitvouwen',
        expandBottom   : 'Onderste paneel uitvouwen'
    },

    TabPanel : {
        containsInvalidFields : 'Tab bevat ongeldige velden'
    },

    Toolbar : {
        showOverflowingItems : 'Overlopende items weergeven',
        scrollForMore        : 'Scroll voor meer'
    },

    UndoRedo : {
        Undo           : 'Ongedaan maken',
        Redo           : 'Opnieuw doen',
        UndoLastAction : 'Maak de laatste actie ongedaan',
        RedoLastAction : 'Herhaal de laatste ongedaan gemaakte actie',
        NoActions      : 'Geen items om ongedaan te maken'
    },

    FieldFilterPicker : {
        equals                 : 'gelijk',
        doesNotEqual           : 'niet gelijk',
        isEmpty                : 'is leeg',
        isNotEmpty             : 'is niet leeg',
        contains               : 'bevat',
        doesNotContain         : 'bevat geen',
        startsWith             : 'begint met',
        endsWith               : 'eindigt met',
        isOneOf                : 'is een van',
        isNotOneOf             : 'is niet een van',
        isGreaterThan          : 'is groter dan',
        isLessThan             : 'is kleiner dan',
        isGreaterThanOrEqualTo : 'is groter of gelijk aan',
        isLessThanOrEqualTo    : 'is kleiner of gelijk aan',
        isBetween              : 'zit tussen',
        isNotBetween           : 'zit niet tussen',
        isBefore               : 'is voor',
        isAfter                : 'is na',
        timeEquals             : 'tijd is gelijk aan',
        timeDoesNotEqual       : 'tijd is niet gelijk aan',
        isToday                : 'is vandaag',
        isTomorrow             : 'is morgen',
        isYesterday            : 'is gisteren',
        isThisWeek             : 'is deze week',
        isNextWeek             : 'is volgende week',
        isLastWeek             : 'is afgelopen week',
        isThisMonth            : 'is deze maand',
        isNextMonth            : 'is volgende maand',
        isLastMonth            : 'is vorige maand',
        isThisYear             : 'is dit jaar',
        isNextYear             : 'is volgend jaar',
        isLastYear             : 'is vorige jaar',
        isYearToDate           : 'is dit jaar tot vandaag',
        isTrue                 : 'is waar',
        isFalse                : 'is niet waar',
        selectAProperty        : 'Selecteer een veld',
        selectAnOperator       : 'Selecteer een operator',
        caseSensitive          : 'Hoofdletter gevoelig',
        and                    : 'en',
        dateFormat             : 'D/M/YYYY',
        selectValue            : 'Selecteer waarde',
        selectOneOrMoreValues  : 'Selecteer een of meer waarden',
        enterAValue            : 'Voer een waarde in',
        enterANumber           : 'Voer een getal in',
        selectADate            : 'Selecteer een datum',
        selectATime            : 'Selecteer tijd'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Voeg filter toe',
        applyCond : applied => applied ? 'Filter overslaan (momenteel toegepast)' : 'Filter toepassen (momenteel overgeslagen)'
    },

    DateHelper : {
        locale         : 'nl',
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
            { single : 'ms', plural : 'ms', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'seconde', plural : 'seconden', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minuut', plural : 'minuten', abbrev : 'm' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'uur', plural : 'uren', abbrev : 'u' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'dag', plural : 'dagen', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'week', plural : 'weken', abbrev : 'w' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'maand', plural : 'maanden', abbrev : 'ma' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'kwartaal', plural : 'kwartalen', abbrev : 'kw' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'jaar', plural : 'jaren', abbrev : 'j' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'decennium', plural : 'decennia', abbrev : 'dec' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil'],
            [],
            ['s', 'sec'],
            [],
            ['m', 'min'],
            [],
            ['u'],
            [],
            ['d'],
            [],
            ['w', 'wk'],
            [],
            ['ma', 'mnd', 'm'],
            [],
            ['k', 'kwar', 'kwt', 'kw'],
            [],
            ['j', 'jr'],
            [],
            ['dec'],
            []
        ],
        parsers : {
            L   : 'DD-MM-YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss'
        },
        ordinalSuffix : number => number,
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `jaren ${year - (year % 10)}`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
