import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Et',
    localeDesc : 'Eesti keel',
    localeCode : 'et',
    localeRtl  : false,

    Object : {
        Yes      : 'Jah',
        No       : 'Ei',
        Cancel   : 'Tühista',
        Ok       : 'OK',
        Week     : 'Nädal',
        None     : 'Mitte ühtegi',
        previous : 'Eelmine',
        next     : 'Järgmine',
        to       : 'kuni',
        at       : 'kell',
        on       : 'peal',
        editing  : what => `Redigeerimine ${what}`,
        settings : 'Seaded',
        close    : 'Sulge',
        go       : 'Mine',
        save     : 'Salvesta',
        cancel   : 'Tühista',
        revert   : 'Tühista muudatused',
        collapse : 'Koonda',
        expand   : 'Laienda',
        today    : 'Täna',
        andNMore : n => `ja ${n} veel`
    },

    AIBase : {
        delayStatusTexts : [
            'Ootamine',
            'Ootamine ...',
            'Ikka ootamine',
            'Ikka ootamine ...'
        ],
        autoStartDialogMessage        : 'Kas soovite lubada AI häälaktiveerimist?',
        voiceActivationToast          : phrase => `Hääle aktiveerimine lubatud, kasutage fraasi "${phrase}" vestluse alustamiseks`,
        voiceControlNotSupportedToast : 'Hääle juhtimist ei toetata sellel seadmel',
        voiceControlErrorToast        : 'Hääle juhtimist ei saanud teie seadmes käivitada',
        voiceControlSilenceToast      : phrase => `AI hääle vestlus lõpetati vaikuse tõttu. Kasutage fraasi ${phrase} vestluse taaskäivitamiseks`,
        noAudioDetected               : 'Heli ei tuvastatud, palun proovige uuesti',
        transcriptionErrorToast       : 'Transkriptsioon ebaõnnestus, proovige uuesti',
        playbackErrorToast            : 'Heli taasesitus ebaõnnestus, kontrollige oma heliväljundseadet',
        failed                        : '(ebaõnnestus)',
        awaitingConfirmation          : 'Kinnituse ootamine',
        timeoutToast                  : 'Sõnum aegus',
        readingStatusText             : modelName => `Lugemine ${modelName}e`,
        updatingStatusText            : modelName => `Uuendamine ${modelName}e`,
        removingStatusText            : modelName => `Eemaldamine ${modelName}e`,
        addingStatusText              : modelName => `Lisamine ${modelName}`,
        filteringStatusText           : modelName => `Filtreerimine ${modelName}e`,
        thinkingStatusText            : 'Mõtlemine',
        processingStatusText          : 'Töötlemine'
    },

    AISettingsPanel : {
        highlight               : 'Esiletõstmine',
        verbosity               : 'Sõnakus',
        voiceActivation         : 'Hääle aktiveerimine',
        enableVoiceActivation   : 'Luba hääle aktiveerimine',
        voiceOnly               : 'Ainult hääl',
        autostart               : 'Automaatne käivitamine',
        dataChangeConfirmations : 'Andmete muutmise kinnitus',
        add                     : 'Lisa',
        remove                  : 'Eemalda',
        update                  : 'Uuenda',
        planning                : 'Planeerimine',
        enablePlanning          : 'Luba planeerimine',
        aiModel                 : 'AI Mudel',
        timeline                : 'Ajaskaala',
        'in-view'               : 'Vaates',
        all                     : 'Kõik',
        timeRangeContext        : 'Ajavahemiku kontekst'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI räägib',
        recordingTooltip      : 'Salvestamine',
        waitingTooltip        : 'AI mõtleb',
        startRecordingTooltip : 'Klõpsake alustamiseks',
        stopRecordingTooltip  : 'Klõpsake lõpetamiseks',
        inactiveTooltip       : 'Ei salvestata',
        openChatTooltip       : 'Paremklõpsake vestluse avamiseks'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Sisestage sõnum',
        noConnectionTooltip     : 'Ühendust ei tuvastatud, klõpsake uuesti proovimiseks',
        undone                  : 'tühistatud',
        aborted                 : '(katkestatud)',
        readAloudTooltip        : 'Lugege sõnum valjusti',
        confidenceTooltip       : confidence => `Usaldusväärsus: ${confidence}%`,
        undoTooltip             : 'Andmete muudatuste tühistamine',
        redoTooltip             : 'Andmete muudatuste taastamine',
        thumbsUp                : 'Pöidlad üles',
        thumbsDown              : 'Pöidlad alla',
        feedbackToast           : 'Täname tagasiside eest!',
        clearChat               : 'Tühjenda vestlus',
        closeChat               : 'Sulge vestlus',
        settings                : 'Seaded',
        closeSettings           : 'Sulge seaded'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Valige täpselt ${min}`,
        tooFewOptionsSelected     : min => `Valige vähemalt ${min}`,
        tooManyOptionsSelected    : max => `Valige mitte rohkem kui ${max}`
    },

    CodeEditor : {
        apply        : 'Rakenda',
        autoApply    : 'Automaatne rakendamine',
        downloadCode : 'Laadi alla kood'
    },

    ColorPicker : {
        noColor : 'Ühtegi värvi pole'
    },

    Combo : {
        noResults          : 'Tulemusi ei ole',
        recordNotCommitted : 'Kirjet ei saanud lisada',
        addNewValue        : value => `Lisa ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Esiletõstmine',
        preview         : 'Eelvaade',
        approve         : 'Kinnita',
        reject          : 'Lükka tagasi',
        confirmAdd      : 'Kinnitage lisamine:',
        confirmUpdate   : 'Kinnitage värskendamine:',
        confirmRemove   : 'Kinnitage eemaldamine:',
        confirmCopy     : 'Kinnitage kopeerimine',
        confirmAssign   : 'Kinnitage määramine',
        confirmReassign : 'Kinnitage ümbermääramine',
        confirmUnassign : 'Kinnitage määramise tühistamine',
        confirmLink     : 'Kinnita link',
        confirmUnlink   : 'Kinnita lahtiühendamine'
    },

    FilePicker : {
        file : 'Fail'
    },

    Field : {
        badInput              : 'Kehtetu välja väärtus',
        patternMismatch       : 'Väärtus peab klappima kindla mustriga',
        rangeOverflow         : value => `Väärtus peab olema järgmisest väiksem või sellega võrdne: ${value.max}`,
        rangeUnderflow        : value => `Väärtus peab olema järgmisest suurem või sellega võrdne: ${value.min}`,
        stepMismatch          : 'Väärtus peab mahtuma sammu',
        tooLong               : 'Väärtus peab olema lühem',
        tooShort              : 'Väärtus peab olema lühem',
        typeMismatch          : 'Väärtus peab olema kindlas vormingus',
        valueMissing          : 'See väli on kohustuslik',
        invalidValue          : 'Kehtetu välja väärtus',
        minimumValueViolation : 'Miinimumväärtuse rikkumine',
        maximumValueViolation : 'Maksimumväärtuse rikkumine',
        fieldRequired         : 'See väli on kohustuslik',
        validateFilter        : 'Väärtus tuleb valida loendist'
    },

    DateField : {
        invalidDate : format => 'Vigane kuupäeva sisend, oodatud vorming on ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Mine eelmisesse aastasse',
        gotoPrevMonth : 'Mine eemisesse kuusse',
        gotoNextMonth : 'Mine järgmisesse kuusse',
        gotoNextYear  : 'Mine järgmisesse aastasse',
        navigation    : 'Kuupäeva valiku navigeerimine'
    },

    Hint : {
        dontShowAgain : 'Ära näita uuesti'
    },

    NumberFormat : {
        locale   : 'et',
        currency : 'USD'
    },

    DurationField : {
        invalidUnit : 'Kehtetu üksus'
    },

    TimeField : {
        invalidTime : 'Kehtetu ajasisend'
    },

    TimePicker : {
        hour   : 'Tund',
        minute : 'Minut',
        second : 'Sekund'
    },

    Tooltip : {
        loading : 'Laadimine...'
    },

    List : {
        loading   : 'Laadimine...',
        selectAll : 'Vali kõik'
    },

    GridBase : {
        loadMask : 'Laadimine...',
        syncMask : 'Muudatuste salvestamine, palun oodake...'
    },

    PagingToolbar : {
        firstPage         : 'Mine esimesele leheküljele',
        prevPage          : 'Mine eelmisele leheküljele',
        page              : 'Lehekülg',
        nextPage          : 'Mine järgmisele leheküljele',
        lastPage          : 'Mine viimasele leheküljele',
        reload            : 'Laadi uuesti praegune lehekülg',
        noRecords         : 'Kuvatavaid kirjeid ei ole',
        pageCountTemplate : data => `/ ${data.lastPage}`,
        summaryTemplate   : data => `Kuvab järgmisi kirjeid: ${data.start} - ${data.end} / ${data.allCount}`
    },

    Popup : {
        close    : 'Sulge hüpikaken',
        maximize : 'Maksimeeri'
    },

    Splitter : {
        ariaLabel      : 'Jagaja, kasutage nooleklahve naaberpaneelide suuruse muutmiseks',
        collapseLeft   : 'Ahenda vasak paneel',
        collapseRight  : 'Ahenda parem paneel',
        collapseTop    : 'Ahenda ülemine paneel',
        collapseBottom : 'Ahenda alumine paneel',
        expandLeft     : 'Laienda vasak paneel',
        expandRight    : 'Laienda parem paneel',
        expandTop      : 'Laienda ülemine paneel',
        expandBottom   : 'Laienda alumine paneel'
    },

    TabPanel : {
        containsInvalidFields : 'Vahekaart sisaldab vigaseid välju'
    },

    Toolbar : {
        showOverflowingItems : 'Näita ülevoolevaid üksusi',
        scrollForMore        : 'Keri rohkemate jaoks'
    },

    UndoRedo : {
        Undo           : 'Ennista',
        Redo           : 'Soorita uuesti',
        UndoLastAction : 'Ennista viimane toiming',
        RedoLastAction : 'Soorita uuesti viimane ennistatud toiming',
        NoActions      : 'Ennistamise järjekorras ei ole toiminguid'
    },

    FieldFilterPicker : {
        equals                 : 'võrdub',
        doesNotEqual           : 'ei võrdu',
        isEmpty                : 'on tühi',
        isNotEmpty             : 'ei ole tühi',
        contains               : 'sisaldab',
        doesNotContain         : 'ei sisalda',
        startsWith             : 'algab',
        endsWith               : 'lõpeb',
        isOneOf                : 'on üks järgmistest:',
        isNotOneOf             : 'ei ole üks järgmistest',
        isGreaterThan          : 'on suurem kui',
        isLessThan             : 'on väiksem kui',
        isGreaterThanOrEqualTo : 'on suurem/võrdne:',
        isLessThanOrEqualTo    : 'on väiksem/võrdne:',
        isBetween              : 'on vahemikus',
        isNotBetween           : 'ei ole vahemikus',
        isBefore               : 'on enne',
        isAfter                : 'on pärast',
        timeEquals             : 'aeg on võrdne',
        timeDoesNotEqual       : 'aeg ei ole võrdne',
        isToday                : 'on täna',
        isTomorrow             : 'on homme',
        isYesterday            : 'on eile',
        isThisWeek             : 'on sel nädalal',
        isNextWeek             : 'on järgmisel nädalal',
        isLastWeek             : 'on eelmisel nädalal',
        isThisMonth            : 'on sel kuul',
        isNextMonth            : 'on järgmisel kuul',
        isLastMonth            : 'on eelmisel kuul',
        isThisYear             : 'on sel aastal',
        isNextYear             : 'on järgmisel aastal',
        isLastYear             : 'on eelmisel aastal',
        isYearToDate           : 'on sel aastal praeguse hetkeni',
        isTrue                 : 'on tõene',
        isFalse                : 'on väär',
        selectAProperty        : 'Valige vara',
        selectAnOperator       : 'Valige operaator',
        caseSensitive          : 'Tõusutundlik',
        and                    : 'ja',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Valige väärtus',
        selectOneOrMoreValues  : 'Valige üks või mitu väärtust',
        enterAValue            : 'Sisestage väärtus',
        enterANumber           : 'Sisestage number',
        selectADate            : 'Valige kuupäev',
        selectATime            : 'Valige aeg'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Lisa filter',
        applyCond : applied => applied ? 'Jäta filter vahele (praegu rakendatud)' : 'Rakenda filter (praegu vahele jäetud)'
    },

    DateHelper : {
        locale         : 'et',
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
            { single : 'sekund', plural : 'sekunds', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minut', plural : 'minutit', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'tund', plural : 'tundi', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'päev', plural : 'päeva', abbrev : 'p' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'nädal', plural : 'nädalat', abbrev : 'n' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'kuu', plural : 'kuud', abbrev : 'k' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'kvartal', plural : 'kvartalit', abbrev : 'kv' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'aasta', plural : 'aastat', abbrev : 'a' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'kümnend', plural : 'kümnendit', abbrev : 'kü' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil'],
            [],
            ['s', 'sek'],
            [],
            ['m', 'min'],
            [],
            ['h', 'hr'],
            [],
            ['p'],
            [],
            ['n', 'nd'],
            [],
            ['k', 'ku', 'kuu'],
            [],
            ['kv', 'kva', 'kvrt'],
            [],
            ['a', 'aa'],
            [],
            ['küm'],
            []
        ],
        parsers : {
            L   : 'DD.MM.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '.',
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}ndad`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
