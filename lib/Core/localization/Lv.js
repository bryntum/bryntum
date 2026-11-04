import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Lv',
    localeDesc : 'Latviešu',
    localeCode : 'lv-LV',
    localeRtl  : false,

    Object : {
        Yes      : 'Jā',
        No       : 'Nē',
        Cancel   : 'Atcelt',
        Ok       : 'Labi',
        Week     : 'Nedēļa',
        None     : 'Nav',
        previous : 'Iepriekšējais',
        next     : 'Nākamais',
        to       : 'līdz',
        at       : 'plkst',
        on       : 'uz',
        editing  : what => `Rediģē ${what}`,
        settings : 'Iestatījumi',
        close    : 'Aizvērt',
        go       : 'Iet',
        save     : 'Saglabāt',
        cancel   : 'Atcelt',
        revert   : 'Atcelt izmaiņas',
        collapse : 'Sakļaut',
        expand   : 'Izvērst',
        today    : 'Šodien',
        andNMore : n => `un ${n} vairāk`
    },

    AIBase : {
        delayStatusTexts : [
            'Gaida',
            'Gaida ...',
            'Joprojām gaida',
            'Joprojām gaida ...'
        ],
        autoStartDialogMessage        : 'Vai vēlaties aktivizēt AI balss aktivizēšanu?',
        voiceActivationToast          : phrase => `Balss aktivizācija ir iespējota, izmantojiet frāzi "${phrase}", lai sāktu sarunu`,
        voiceControlNotSupportedToast : 'Balss vadība šajā ierīcē netiek atbalstīta',
        voiceControlErrorToast        : 'Balss vadību nevarēja sākt jūsu ierīcē',
        voiceControlSilenceToast      : phrase => `AI balss saruna beidzās klusuma dēļ. Izmantojiet frāzi ${phrase}, lai atsāktu sarunu`,
        noAudioDetected               : 'Nav konstatēts audio, lūdzu, mēģiniet vēlreiz',
        transcriptionErrorToast       : 'Transkripcija neizdevās, lūdzu, mēģiniet vēlreiz',
        playbackErrorToast            : 'Audio atskaņošana neizdevās, lūdzu, pārbaudiet savu audio izejas ierīci',
        failed                        : '(neizdevās)',
        awaitingConfirmation          : 'Gaida apstiprinājumu',
        timeoutToast                  : 'Ziņojuma laiks beidzies',
        readingStatusText             : modelName => `Lasīšana ${modelName}s`,
        updatingStatusText            : modelName => `Atjaunināšana ${modelName}s`,
        removingStatusText            : modelName => `Noņemšana ${modelName}s`,
        addingStatusText              : modelName => `Pievienošana ${modelName}`,
        filteringStatusText           : modelName => `Filtrēšana ${modelName}s`,
        thinkingStatusText            : 'Domāšana',
        processingStatusText          : 'Apstrāde'
    },

    AISettingsPanel : {
        highlight               : 'Izcelt',
        verbosity               : 'Vārdu daudzums',
        voiceActivation         : 'Balss aktivizācija',
        enableVoiceActivation   : 'Iespējot balss aktivizāciju',
        voiceOnly               : 'Tikai balss',
        autostart               : 'Automātiska palaišana',
        dataChangeConfirmations : 'Datu izmaiņu apstiprinājumi',
        add                     : 'Pievienot',
        remove                  : 'Noņemt',
        update                  : 'Atjaunināt',
        planning                : 'Plānošana',
        enablePlanning          : 'Iespējot plānošanu',
        aiModel                 : 'AI Modelis',
        timeline                : 'Laika josla',
        'in-view'               : 'Redzamā daļā',
        all                     : 'Visi',
        timeRangeContext        : 'Laika diapazona konteksts'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI runā',
        recordingTooltip      : 'Ierakstīšana',
        waitingTooltip        : 'AI domā',
        startRecordingTooltip : 'Noklikšķiniet, lai sāktu',
        stopRecordingTooltip  : 'Noklikšķiniet, lai apturētu',
        inactiveTooltip       : 'Nav ierakstīšanas',
        openChatTooltip       : 'Ar peles labo pogu noklikšķiniet, lai atvērtu tērzēšanu'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Ierakstiet ziņojumu',
        noConnectionTooltip     : 'Savienojums nav konstatēts, noklikšķiniet, lai mēģinātu vēlreiz',
        undone                  : 'atcelts',
        aborted                 : '(pārtraukts)',
        readAloudTooltip        : 'Nolasīt ziņojumu skaļi',
        confidenceTooltip       : confidence => `Pārliecība: ${confidence}%`,
        undoTooltip             : 'Atcelt datu izmaiņas',
        redoTooltip             : 'Atjaunot datu izmaiņas',
        thumbsUp                : 'Patīk',
        thumbsDown              : 'Nepatīk',
        feedbackToast           : 'Paldies par jūsu atsauksmēm!',
        clearChat               : 'Notīrīt tērzēšanu',
        closeChat               : 'Aizvērt tērzēšanu',
        settings                : 'Iestatījumi',
        closeSettings           : 'Aizvērt iestatījumus'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Izvēlieties tieši ${min}`,
        tooFewOptionsSelected     : min => `Izvēlieties vismaz ${min}`,
        tooManyOptionsSelected    : max => `Izvēlieties ne vairāk kā ${max}`
    },

    CodeEditor : {
        apply        : 'Pielietot',
        autoApply    : 'Automātiski pielietot',
        downloadCode : 'Lejupielādēt kodu'
    },

    ColorPicker : {
        noColor : 'Nav krāsas'
    },

    Combo : {
        noResults          : 'Nav rezultātu',
        recordNotCommitted : 'Ierakstu nevarēja pievienot',
        addNewValue        : value => `Pievienot ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Izcelt',
        preview         : 'Priekšskatījums',
        approve         : 'Apstiprināt',
        reject          : 'Noraidīt',
        confirmAdd      : 'Apstipriniet pievienošanu:',
        confirmUpdate   : 'Apstipriniet atjaunināšanu:',
        confirmRemove   : 'Apstipriniet noņemšanu:',
        confirmCopy     : 'Apstipriniet kopēšanu',
        confirmAssign   : 'Apstipriniet piešķiršanu',
        confirmReassign : 'Apstipriniet atkārtotu piešķiršanu',
        confirmUnassign : 'Apstipriniet piešķiršanas atcelšanu',
        confirmLink     : 'Apstiprināt saiti',
        confirmUnlink   : 'Apstiprināt atsaistīšanu'
    },

    FilePicker : {
        file : 'Fails'
    },

    Field : {
        badInput              : 'Nederīga lauka vērtība',
        patternMismatch       : 'Vērtībai ir jāatbilst noteiktam modelim',
        rangeOverflow         : value => `Vērtībai ir jābūt ne lielākai kā ${value.max}`,
        rangeUnderflow        : value => `Vērtībai ir jābūt vismaz ${value.min}`,
        stepMismatch          : 'Vērtībai ir jāietilpst solī',
        tooLong               : 'Vērtībai ir jābūt īsākai',
        tooShort              : 'Vērtībai ir jābūt garākai',
        typeMismatch          : 'Vērtībai jābūt īpašā formātā',
        valueMissing          : 'Šis lauks ir obligāts',
        invalidValue          : 'Nederīga lauka vērtība',
        minimumValueViolation : 'Minimālās vērtības pārkāpums',
        maximumValueViolation : 'Maksimālās vērtības pārkāpums',
        fieldRequired         : 'Šis lauks ir obligāts',
        validateFilter        : 'Sarakstā ir jāatlasa vērtība'
    },

    DateField : {
        invalidDate : format => 'Nederīgs datuma ievades formāts, gaidītais formāts ir ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Pāriet uz iepriekšējo gadu',
        gotoPrevMonth : 'Pāriet uz iepriekšējo mēnesi',
        gotoNextMonth : 'Pāriet uz nākamo mēnesi',
        gotoNextYear  : 'Pāriet uz nākamo gadu',
        navigation    : 'Datuma izvēles navigācija'
    },

    Hint : {
        dontShowAgain : 'Nerādīt vēlreiz'
    },

    NumberFormat : {
        locale   : 'lv-LV',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Nederīga vienība'
    },

    TimeField : {
        invalidTime : 'Nederīga laika ievade'
    },

    TimePicker : {
        hour   : 'Stunda',
        minute : 'Minūte',
        second : 'Sekunde'
    },

    Tooltip : {
        loading : 'Ielādē...'
    },

    List : {
        loading   : 'Ielādē...',
        selectAll : 'Atlasīt visu'
    },

    GridBase : {
        loadMask : 'Ielādē...',
        syncMask : 'Notiek izmaiņu saglabāšana, lūdzu, uzgaidiet...'
    },

    PagingToolbar : {
        firstPage         : 'Doties uz pirmo lapu',
        prevPage          : 'Doties uz iepriekšējo lapu',
        page              : 'Lapa',
        nextPage          : 'Doties uz nākamo lapu',
        lastPage          : 'Doties uz pēdējo lapu',
        reload            : 'Pārlādēt pašreizējo lapu',
        noRecords         : 'Nav parādāmu ierakstu',
        pageCountTemplate : data => `no ${data.lastPage}`,
        summaryTemplate   : data => `Rāda ierakstus ${data.start} — ${data.end} no ${data.allCount}`
    },

    Popup : {
        close    : 'Aizvērt',
        maximize : 'Maksimizēt'
    },

    Splitter : {
        ariaLabel      : 'Dalītājs, izmantojiet bulttaustiņus, lai mainītu blakus esošo paneļu izmēru',
        collapseLeft   : 'Sakļaut kreiso paneli',
        collapseRight  : 'Sakļaut labo paneli',
        collapseTop    : 'Sakļaut augšējo paneli',
        collapseBottom : 'Sakļaut apakšējo paneli',
        expandLeft     : 'Izvērst kreiso paneli',
        expandRight    : 'Izvērst labo paneli',
        expandTop      : 'Izvērst augšējo paneli',
        expandBottom   : 'Izvērst apakšējo paneli'
    },

    TabPanel : {
        containsInvalidFields : 'Cilne satur nederīgus laukus'
    },

    Toolbar : {
        showOverflowingItems : 'Rādīt pārpildītos vienumus',
        scrollForMore        : 'Ritiniet, lai iegūtu vairāk'
    },

    UndoRedo : {
        Undo           : 'Atsaukt',
        Redo           : 'Atsaukt atcelšanu',
        UndoLastAction : 'Atsaukt pēdējo darbību',
        RedoLastAction : 'Atsaukt pēdējo darbības atcelšanu',
        NoActions      : 'Atsaukšanas rindā nav elementu'
    },

    FieldFilterPicker : {
        equals                 : 'vienāds ar',
        doesNotEqual           : 'nav vienāds ar',
        isEmpty                : 'tukšs',
        isNotEmpty             : 'nav tukšs',
        contains               : 'satur',
        doesNotContain         : 'nesatur',
        startsWith             : 'sākas ar',
        endsWith               : 'beidzas ar',
        isOneOf                : 'viens no',
        isNotOneOf             : 'nav viens no',
        isGreaterThan          : 'lielāks nekā',
        isLessThan             : 'mazāks nekā',
        isGreaterThanOrEqualTo : 'lielāks par vai vienāds ar',
        isLessThanOrEqualTo    : 'mazāks vai vienāds ar',
        isBetween              : 'starp',
        isNotBetween           : 'nav starp',
        isBefore               : 'pirms',
        isAfter                : 'pēc',
        timeEquals             : 'laiks ir vienāds',
        timeDoesNotEqual       : 'laiks nav vienāds',
        isToday                : 'šodien',
        isTomorrow             : 'rītdien',
        isYesterday            : 'vakar',
        isThisWeek             : 'šī nedēļa',
        isNextWeek             : 'nākamā nedēļa',
        isLastWeek             : 'pagājusī nedēļa',
        isThisMonth            : 'šis mēnesis',
        isNextMonth            : 'nākamais mēnesis',
        isLastMonth            : 'pagājušais mēnesis',
        isThisYear             : 'šis gads',
        isNextYear             : 'nākamais gads',
        isLastYear             : 'pagājušais gads',
        isYearToDate           : 'no gada sākuma',
        isTrue                 : 'patiess',
        isFalse                : 'aplams',
        selectAProperty        : 'Atlasiet rekvizītu',
        selectAnOperator       : 'Atlasiet operatoru',
        caseSensitive          : 'Reģistrjutīgs',
        and                    : 'un',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Izvēlieties vērtību',
        selectOneOrMoreValues  : 'Atlasiet vienu vai vairākas vērtības',
        enterAValue            : 'Ievadiet vērtību',
        enterANumber           : 'Ievadiet numuru',
        selectADate            : 'Atlasiet datumu',
        selectATime            : 'Izvēlieties laiku'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Pievienot filtru',
        applyCond : applied => applied ? 'Izlaist filtru (pašlaik piemērots)' : 'Piemērot filtru (pašlaik izlaists)'
    },

    DateHelper : {
        locale         : 'lv-LV',
        weekStartDay   : 0,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : 'milisekunde', plural : 'milisekundes', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'sekunde', plural : 'sekundes', abbrev : 'sek.' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minūte', plural : 'minūtes', abbrev : 'min.' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'stunda', plural : 'stundas', abbrev : 'st.' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'diena', plural : 'dienas', abbrev : 'd.' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'nedēļa', plural : 'nedēļas', abbrev : 'ned.' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'mēnesis', plural : 'mēneši', abbrev : 'mēn.' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'ceturksnis', plural : 'ceturkšņi', abbrev : 'cet.' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'gads', plural : 'gadi', abbrev : 'g.' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'desmitgade', plural : 'desmitgades', abbrev : 'desmitg.' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['ms'],
            [],
            ['s', 'sek.'],
            [],
            ['min.', 'min.'],
            [],
            ['h', 'st.'],
            [],
            ['d.'],
            [],
            ['ned.', 'ned.'],
            [],
            ['mēn.', 'mēn.', 'mēn.'],
            [],
            ['cet.', 'cet.', 'cet.'],
            [],
            ['g.', 'g.'],
            [],
            ['desmitg.'],
            []
        ],
        parsers : {
            L   : 'DD.MM.GGGG.',
            LT  : 'HH.mm A',
            LTS : 'HH.mm.ss A'
        },
        ordinalSuffix : number => {
            const hasSpecialCase = ['11', '12', '13'].find((n) => number.endsWith(n));

            let suffix = '.';

            if (!hasSpecialCase) {
                const lastDigit = number[number.length - 1];
                suffix = { 1 : '.', 2 : '.', 3 : '.' }[lastDigit] || '.';
            }

            return number + suffix;
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}. gadi`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
