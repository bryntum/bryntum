import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Hu',
    localeDesc : 'Magyar',
    localeCode : 'hu',
    localeRtl  : false,

    Object : {
        Yes      : 'Igen',
        No       : 'Nem',
        Cancel   : 'Mégse',
        Ok       : 'OK',
        Week     : 'Hét',
        None     : 'Nincs',
        previous : 'Előző',
        next     : 'Következő',
        to       : 'ig',
        at       : 'kor',
        on       : 'ra',
        editing  : what => `Szerkesztés ${what}`,
        settings : 'Beállítások',
        close    : 'Bezárás',
        go       : 'Menj',
        save     : 'Mentés',
        cancel   : 'Mégse',
        revert   : 'Visszavonás',
        collapse : 'Összecsukás',
        expand   : 'Kibontás',
        today    : 'Ma',
        andNMore : n => `és még ${n}`
    },

    AIBase : {
        delayStatusTexts : [
            'Várakozás',
            'Várakozás ...',
            'Még mindig várakozás',
            'Még mindig várakozás ...'
        ],
        autoStartDialogMessage        : 'Szeretné engedélyezni az AI hangaktiválást?',
        voiceActivationToast          : phrase => `Hangaktiválás engedélyezve, használja a(z) "${phrase}" kifejezést a beszélgetés indításához`,
        voiceControlNotSupportedToast : 'A hangvezérlés nem támogatott ezen az eszközön',
        voiceControlErrorToast        : 'A hangvezérlés nem indítható el az eszközén',
        voiceControlSilenceToast      : phrase => `Az AI hangbeszélgetés csend miatt véget ért. Használja a(z) ${phrase} kifejezést a beszélgetés újraindításához`,
        noAudioDetected               : 'Nem észlelt hangot, próbálja újra',
        transcriptionErrorToast       : 'Az átirat sikertelen, próbálja újra',
        playbackErrorToast            : 'Az audiolejátszás sikertelen, ellenőrizze az audio kimeneti eszközt',
        failed                        : '(sikertelen)',
        awaitingConfirmation          : 'Megerősítésre vár',
        timeoutToast                  : 'Az üzenet időtúllépett',
        readingStatusText             : modelName => `${modelName}k olvasása`,
        updatingStatusText            : modelName => `${modelName}k frissítés`,
        removingStatusText            : modelName => `${modelName}k eltávolítás`,
        addingStatusText              : modelName => `${modelName} hozzáadás`,
        filteringStatusText           : modelName => `${modelName}k szűrés`,
        thinkingStatusText            : 'Gondolkodás',
        processingStatusText          : 'Feldolgozás'
    },

    AISettingsPanel : {
        highlight               : 'Kiemelés',
        verbosity               : 'Részletesség',
        voiceActivation         : 'Hangaktiválás',
        enableVoiceActivation   : 'Hangaktiválás engedélyezése',
        voiceOnly               : 'Csak hang',
        autostart               : 'Automatikus indítás',
        dataChangeConfirmations : 'Adatmódosítás megerősítése',
        add                     : 'Hozzáadás',
        remove                  : 'Eltávolítás',
        update                  : 'Frissítés',
        planning                : 'Tervezés',
        enablePlanning          : 'Tervezés engedélyezése',
        aiModel                 : 'AI Modell',
        timeline                : 'Idővonal',
        'in-view'               : 'Látható',
        all                     : 'Összes',
        timeRangeContext        : 'Időtartomány kontextus'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'Az AI beszél',
        recordingTooltip      : 'Felvétel',
        waitingTooltip        : 'AI gondolkodik',
        startRecordingTooltip : 'Kattintson a kezdéshez',
        stopRecordingTooltip  : 'Kattintson a leállításhoz',
        inactiveTooltip       : 'Nem rögzít',
        openChatTooltip       : 'Kattintson jobb gombbal a csevegés megnyitásához'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Írjon egy üzenetet',
        noConnectionTooltip     : 'Nincs kapcsolat észlelve, kattintson az újrapróbálkozáshoz',
        undone                  : 'visszavonva',
        aborted                 : '(megszakítva)',
        readAloudTooltip        : 'Üzenet felolvasása',
        confidenceTooltip       : confidence => `Bizalom: ${confidence}%`,
        undoTooltip             : 'Adatmódosítások visszavonása',
        redoTooltip             : 'Adatmódosítások újra végrehajtása',
        thumbsUp                : 'Tetszik',
        thumbsDown              : 'Nem tetszik',
        feedbackToast           : 'Köszönjük a visszajelzését!',
        clearChat               : 'Csevegés törlése',
        closeChat               : 'Bezárás csevegés',
        settings                : 'Beállítások',
        closeSettings           : 'Beállítások bezárása'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Válasszon pontosan ${min}`,
        tooFewOptionsSelected     : min => `Válasszon legalább ${min}`,
        tooManyOptionsSelected    : max => `Válasszon legfeljebb ${max}`
    },

    CodeEditor : {
        apply        : 'Alkalmaz',
        autoApply    : 'Automatikus alkalmazás',
        downloadCode : 'Kód letöltése'
    },

    ColorPicker : {
        noColor : 'Nincs szín'
    },

    Combo : {
        noResults          : 'Nincs eredmény',
        recordNotCommitted : 'A bejegyzés nem adható hozzá',
        addNewValue        : value => `${value} hozzáadása`
    },

    ConfirmationDialog : {
        highlight       : 'Kiemelés',
        preview         : 'Előnézet',
        approve         : 'Jóváhagyás',
        reject          : 'Elutasítás',
        confirmAdd      : 'Hozzáadás megerősítése:',
        confirmUpdate   : 'Frissítés megerősítése:',
        confirmRemove   : 'Eltávolítás megerősítése:',
        confirmCopy     : 'Másolás megerősítése',
        confirmAssign   : 'Hozzárendelés megerősítése',
        confirmReassign : 'Újrahozzárendelés megerősítése',
        confirmUnassign : 'Hozzárendelés megszüntetésének megerősítése',
        confirmLink     : 'Link megerősítése',
        confirmUnlink   : 'Link megszüntetésének megerősítése'
    },

    FilePicker : {
        file : 'Fájl'
    },

    Field : {
        badInput              : 'A mező értéke érvénytelen',
        patternMismatch       : 'Az értéknek illeszkednie kell egy adott mintába',
        rangeOverflow         : value => `Az érték legyen kisebb vagy egyenlő mint ${value.max}`,
        rangeUnderflow        : value => `Az érték legyen nagyobb vagy egyenlő mint ${value.min}`,
        stepMismatch          : 'Az értéknek illeszkednie kell a lépésbe',
        tooLong               : 'Az érték legyen rövidebb',
        tooShort              : 'Az érték legyen hosszabb',
        typeMismatch          : 'Az értéknek speciális formátumúnak kell lennie',
        valueMissing          : 'A mező kitöltése kötelező',
        invalidValue          : 'A mező értéke érvénytelen',
        minimumValueViolation : 'Minimumérték hiba',
        maximumValueViolation : 'Maximumérték hiba',
        fieldRequired         : 'A mező kitöltése kötelező',
        validateFilter        : 'Az értéket a listáról kell kiválasztani'
    },

    DateField : {
        invalidDate : format => 'Érvénytelen dátumbevitel, a várt formátum: ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Ugrás az előző évre',
        gotoPrevMonth : 'Ugrás az előző hónapra',
        gotoNextMonth : 'Ugrás a következő hónapra',
        gotoNextYear  : 'Ugrás a következő évre',
        navigation    : 'Dátumválasztó navigáció'
    },

    Hint : {
        dontShowAgain : 'Ne mutasd újra'
    },

    NumberFormat : {
        locale   : 'hu',
        currency : 'HUF'
    },

    DurationField : {
        invalidUnit : 'Érvénytelen egység'
    },

    TimeField : {
        invalidTime : 'Érvénytelen időérték'
    },

    TimePicker : {
        hour   : 'Óra',
        minute : 'Perc',
        second : 'Másodperc'
    },

    Tooltip : {
        loading : 'Betöltés...'
    },

    List : {
        loading   : 'Betöltés...',
        selectAll : 'Összes kiválasztása'
    },

    GridBase : {
        loadMask : 'Betöltés...',
        syncMask : 'Módosítások mentése, várjon...'
    },

    PagingToolbar : {
        firstPage         : 'Ugrás az első oldalra',
        prevPage          : 'Ugrás az előző oldalra',
        page              : 'Oldal',
        nextPage          : 'Ugrás a következő oldalra',
        lastPage          : 'Ugrás az utolsó oldalra',
        reload            : 'Aktuális oldal újratöltése',
        noRecords         : 'Nincs megjeleníthető bejegyzés',
        pageCountTemplate : data => `/ ${data.lastPage}`,
        summaryTemplate   : data => `Megjelenített bejegyzések: ${data.start} - ${data.end} / ${data.allCount}`
    },

    Popup : {
        close    : 'Felugró ablak bezárása',
        maximize : 'Maximalizálás'
    },

    Splitter : {
        ariaLabel      : 'Osztó, használja a nyílbillentyűket a szomszédos panelek átméretezéséhez',
        collapseLeft   : 'Bal oldali panel összecsukása',
        collapseRight  : 'Jobb oldali panel összecsukása',
        collapseTop    : 'Felső panel összecsukása',
        collapseBottom : 'Alsó panel összecsukása',
        expandLeft     : 'Bal oldali panel kibontása',
        expandRight    : 'Jobb oldali panel kibontása',
        expandTop      : 'Felső panel kibontása',
        expandBottom   : 'Alsó panel kibontása'
    },

    TabPanel : {
        containsInvalidFields : 'A fül érvénytelen mezőket tartalmaz'
    },

    Toolbar : {
        showOverflowingItems : 'Túlcsorduló elemek megjelenítése',
        scrollForMore        : 'Továbbiak görgetése'
    },

    UndoRedo : {
        Undo           : 'Mégse',
        Redo           : 'Mégis',
        UndoLastAction : 'Utolsó művelet visszavonása',
        RedoLastAction : 'Utolsó művelet helyreállítása',
        NoActions      : 'Nincsen visszavonható művelet'
    },

    FieldFilterPicker : {
        equals                 : 'egyenlő',
        doesNotEqual           : 'nem egyenlő',
        isEmpty                : 'üres',
        isNotEmpty             : 'nem üres',
        contains               : 'tartalmazza',
        doesNotContain         : 'nem tartalmazza',
        startsWith             : 'ezzel kezdődik',
        endsWith               : 'ezzel végződik',
        isOneOf                : 'ezek egyike',
        isNotOneOf             : 'nem ezek egyike',
        isGreaterThan          : 'nagyobb mint',
        isLessThan             : 'kisebb mint',
        isGreaterThanOrEqualTo : 'nagyobb vagy egyenlő',
        isLessThanOrEqualTo    : 'kisebb vagy egyenlő',
        isBetween              : 'a következők közötti',
        isNotBetween           : 'nem a következők közötti',
        isBefore               : 'korábbi, mint',
        isAfter                : 'későbbi mint',
        timeEquals             : 'az idő egyenlő',
        timeDoesNotEqual       : 'az idő nem egyenlő',
        isToday                : 'ma lesz',
        isTomorrow             : 'holnap lesz',
        isYesterday            : 'tegnap volt',
        isThisWeek             : 'ezen a héten lesz',
        isNextWeek             : 'következő héten lesz',
        isLastWeek             : 'múlt héten volt',
        isThisMonth            : 'ebben a hónapban lesz',
        isNextMonth            : 'következő hónapban lesz',
        isLastMonth            : 'múlt hónapban volt',
        isThisYear             : 'ebben az évben lesz',
        isNextYear             : 'következő évben lesz',
        isLastYear             : 'múlt évben volt',
        isYearToDate           : 'a dátum évében lesz',
        isTrue                 : 'igaz',
        isFalse                : 'hamis',
        selectAProperty        : 'Jelöljön ki egy tulajdonságot',
        selectAnOperator       : 'Válasszon egy kezelőt',
        caseSensitive          : 'Kis- és nagybetűk felismerése',
        and                    : 'és',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Válasszon értéket',
        selectOneOrMoreValues  : 'Válasszon ki legalább egy értéket',
        enterAValue            : 'Adjon meg egy értéket',
        enterANumber           : 'Adjon meg egy számot',
        selectADate            : 'Válasszon ki egy dátumot',
        selectATime            : 'Válassz időt'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Szűrő hozzáadása',
        applyCond : applied => applied ? 'Szűrő kihagyása (jelenleg alkalmazva)' : 'Szűrő alkalmazása (jelenleg kihagyva)'
    },

    DateHelper : {
        locale         : 'hu',
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
            { single : 'milliszekundum', plural : 'ms', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'másodperc', plural : 'másodpercs', abbrev : 'mp' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'perc', plural : 'perc', abbrev : 'p' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'óra', plural : 'óra', abbrev : 'ó' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'nap', plural : 'nap', abbrev : 'n' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'hét', plural : 'hét', abbrev : 'h' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'hónap', plural : 'hónap', abbrev : 'hó' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'negyedév', plural : 'negyedév', abbrev : 'n.é.' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'év', plural : 'év', abbrev : 'év' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'évtized', plural : 'évtized', abbrev : 'é.t.' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['ms'],
            [],
            ['mp', 'mp'],
            [],
            ['p', 'perc'],
            [],
            ['ó', 'ó'],
            [],
            ['n'],
            [],
            ['h', 'h'],
            [],
            ['h', 'hó', 'hn'],
            [],
            ['né', 'n.év', 'n.é.'],
            [],
            ['é', 'év'],
            [],
            ['évt.'],
            []
        ],
        parsers : {
            L   : 'YYYY. MM. DD.',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '.',
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}-as évek`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
