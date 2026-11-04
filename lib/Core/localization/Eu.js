import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Eu',
    localeDesc : 'Euskara',
    localeCode : 'eu-ES',
    localeRtl  : false,

    Object : {
        Yes      : 'Bai',
        No       : 'Ez',
        Cancel   : 'Utzi',
        Ok       : 'Ados',
        Week     : 'Astea',
        None     : 'Bat ere ez',
        previous : 'Aurrekoa',
        next     : 'Hurrengoa',
        to       : 'ra',
        at       : 'tan',
        on       : 'ean',
        editing  : what => `Editatzen ${what}`,
        settings : 'Ezarpenak',
        close    : 'Itxi',
        go       : 'Joan',
        save     : 'Gorde',
        cancel   : 'Utzi',
        revert   : 'Berreskuratu',
        collapse : 'Tolestu',
        expand   : 'Zabaldu',
        today    : 'Gaur',
        andNMore : n => `eta ${n} gehiago`
    },

    AIBase : {
        delayStatusTexts : [
            'Itxaroten',
            'Itxaroten ...',
            'Oraindik itxaroten',
            'Oraindik itxaroten ...'
        ],
        autoStartDialogMessage        : 'AI ahots aktibazioa gaitzea nahi duzu?',
        voiceActivationToast          : phrase => `Ahots aktibazioa gaituta, erabili esaldia "${phrase}" elkarrizketa hasteko`,
        voiceControlNotSupportedToast : 'Ahots kontrola ez dago gailu honetan onartuta',
        voiceControlErrorToast        : 'Ahots kontrola ezin izan da zure gailuan hasi',
        voiceControlSilenceToast      : phrase => `AI ahots elkarrizketa isiltasunagatik amaitu da. Erabili esaldia ${phrase} elkarrizketa berrabiarazteko`,
        noAudioDetected               : 'Ez da audioa detektatu, saiatu berriro',
        transcriptionErrorToast       : 'Transkripzioa huts egin du, saiatu berriro',
        playbackErrorToast            : 'Audio erreprodukzioa huts egin du, egiaztatu zure audio irteera gailua',
        failed                        : '(huts egin du)',
        awaitingConfirmation          : 'Berrespena itxaroten',
        timeoutToast                  : 'Mezuaren denbora amaitu da',
        readingStatusText             : modelName => `${modelName}s irakurtzen`,
        updatingStatusText            : modelName => `${modelName}s eguneratzen`,
        removingStatusText            : modelName => `${modelName}s kentzen`,
        addingStatusText              : modelName => `${modelName} gehitzen`,
        filteringStatusText           : modelName => `${modelName}s iragazten`,
        thinkingStatusText            : 'Pentsatzen',
        processingStatusText          : 'Prozesatzen'
    },

    AISettingsPanel : {
        highlight               : 'Nabarmendu',
        verbosity               : 'Hizkuntza',
        voiceActivation         : 'Ahots Aktibazioa',
        enableVoiceActivation   : 'Gaitu Ahots Aktibazioa',
        voiceOnly               : 'Ahots Bakarrik',
        autostart               : 'Autoabiarazi',
        dataChangeConfirmations : 'Datuen Aldaketa Berrespenak',
        add                     : 'Gehitu',
        remove                  : 'Kendu',
        update                  : 'Eguneratu',
        planning                : 'Plangintza',
        enablePlanning          : 'Plangintza gaitzea',
        aiModel                 : 'AI Eredua',
        timeline                : 'Kronologia',
        'in-view'               : 'Ikusgai',
        all                     : 'Guztiak',
        timeRangeContext        : 'Denbora-tartearen testuingurua'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI hitz egiten',
        recordingTooltip      : 'Grabaketa',
        waitingTooltip        : 'AI pentsatzen',
        startRecordingTooltip : 'Klik egin hasteko',
        stopRecordingTooltip  : 'Klik egin gelditzeko',
        inactiveTooltip       : 'Ez grabatzen',
        openChatTooltip       : 'Egin eskuineko klik txata irekitzeko'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Idatzi mezu bat',
        noConnectionTooltip     : 'Konexiorik ez detektatu, klik egin berriro saiatzeko',
        undone                  : 'deseginda',
        aborted                 : '(bertan behera utzi)',
        readAloudTooltip        : 'Mezua ozen irakurri',
        confidenceTooltip       : confidence => `Konfiantza: ${confidence}%`,
        undoTooltip             : 'Datu aldaketak desegin',
        redoTooltip             : 'Datu aldaketak berriro egin',
        thumbsUp                : 'Atzamar gora',
        thumbsDown              : 'Atzamar behera',
        feedbackToast           : 'Eskerrik asko zure iritzia emateagatik!',
        clearChat               : 'Garbitu Txata',
        closeChat               : 'Itxi txata',
        settings                : 'Ezarpenak',
        closeSettings           : 'Itxi Ezarpenak'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Hautatu zehazki ${min}`,
        tooFewOptionsSelected     : min => `Hautatu gutxienez ${min}`,
        tooManyOptionsSelected    : max => `Ez hautatu ${max} baino gehiago`
    },

    CodeEditor : {
        apply        : 'Aplikatu',
        autoApply    : 'Aplikazio automatikoa',
        downloadCode : 'Kodea deskargatu'
    },

    ColorPicker : {
        noColor : 'Kolorerik gabe'
    },

    Combo : {
        noResults          : 'Ez dago emaitzarik',
        recordNotCommitted : 'Ezin izan da gehitu erregistroa',
        addNewValue        : value => `Gehitu ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Nabarmendu',
        preview         : 'Aurrebista',
        approve         : 'Onartu',
        reject          : 'Baztertu',
        confirmAdd      : 'Gehiketa baieztatu:',
        confirmUpdate   : 'Eguneraketa baieztatu:',
        confirmRemove   : 'Ezabatzea baieztatu:',
        confirmCopy     : 'Kopia baieztatu',
        confirmAssign   : 'Esleipena baieztatu',
        confirmReassign : 'Berriro esleipena baieztatu',
        confirmUnassign : 'Esleipen gabezia baieztatu',
        confirmLink     : 'Berretsi esteka',
        confirmUnlink   : 'Berretsi esteka kentzea'
    },

    FilePicker : {
        file : 'Fitxategia'
    },

    Field : {
        badInput              : 'Eremuko balioak ez du balio',
        patternMismatch       : 'Balioak eredu jakin batekin bat etorri behar du',
        rangeOverflow         : value => `Balioak ${value.max} berdina edo txikiagoa izan behar du`,
        rangeUnderflow        : value => `Balioak ${value.min} berdina edo handiagoa izan behar du`,
        stepMismatch          : 'Balioa pausora egokitu behar da',
        tooLong               : 'Balioak laburragoa izan behar du',
        tooShort              : 'Balioak luzeagoa izan behar du',
        typeMismatch          : 'Balioak formatu berezi batean egon behar du',
        valueMissing          : 'Eremua beharrezkoa da',
        invalidValue          : 'Eremuko balioak ez du balio',
        minimumValueViolation : 'Gutxieneko balioa urratu da',
        maximumValueViolation : 'Gehieneko balioak urratu dira',
        fieldRequired         : 'Eremua beharrezkoa da',
        validateFilter        : 'Balioa zerrendatik hautatu behar duzu'
    },

    DateField : {
        invalidDate : format => 'Data sarrera baliogabea, espero den formatua da ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Joan aurreko urtera',
        gotoPrevMonth : 'Joan aurreko hilabetera',
        gotoNextMonth : 'Joan hurrengo hilabetera',
        gotoNextYear  : 'Joan hurrengo urtera',
        navigation    : 'Data hautatzailearen nabigazioa'
    },

    Hint : {
        dontShowAgain : 'Ez erakutsi berriro'
    },

    NumberFormat : {
        locale   : 'eu-ES',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Unitateak ez du balio'
    },

    TimeField : {
        invalidTime : 'Orduak ez du balio'
    },

    TimePicker : {
        hour   : 'Ordua',
        minute : 'Minutua',
        second : 'Segundoa'
    },

    Tooltip : {
        loading : 'Kargatzen...'
    },

    List : {
        loading   : 'Kargatzen...',
        selectAll : 'Hautatu guztiak'
    },

    GridBase : {
        loadMask : 'Kargatzen...',
        syncMask : 'Aldaketak gordetzen. Itxaron, mesedez...'
    },

    PagingToolbar : {
        firstPage         : 'Joan lehen orrira',
        prevPage          : 'Joan aurreko orrira',
        page              : 'Orria',
        nextPage          : 'Joan hurrengo orrira',
        lastPage          : 'Joan azken orrira',
        reload            : 'Kargatu berriro uneko orria',
        noRecords         : 'Ez dago erregistrorik bistaratzeko',
        pageCountTemplate : data => `/${data.lastPage}`,
        summaryTemplate   : data => `Erakustsi erregistroak ${data.start} - ${data.end} hemendik ${data.allCount}`
    },

    Popup : {
        close    : 'Itxi',
        maximize : 'Handitu'
    },

    Splitter : {
        ariaLabel      : 'Splitter, erabili gezien tekla panelak tamainatzeko',
        collapseLeft   : 'Tolestu ezkerreko panela',
        collapseRight  : 'Tolestu eskuineko panela',
        collapseTop    : 'Tolestu goiko panela',
        collapseBottom : 'Tolestu beheko panela',
        expandLeft     : 'Zabaldu ezkerreko panela',
        expandRight    : 'Zabaldu eskuineko panela',
        expandTop      : 'Zabaldu goiko panela',
        expandBottom   : 'Zabaldu beheko panela'
    },

    TabPanel : {
        containsInvalidFields : 'Fitxak balio ez duten eremuak ditu'
    },

    Toolbar : {
        showOverflowingItems : 'Erakutsitako elementuak erakutsi',
        scrollForMore        : 'Arakatu gehiago ikusteko'
    },

    UndoRedo : {
        Undo           : 'Desegin',
        Redo           : 'Berregin',
        UndoLastAction : 'Desegin azken ekintza',
        RedoLastAction : 'Berregin desegindako azken ekintza',
        NoActions      : 'Ez dago elementurik desegiteko ilaran'
    },

    FieldFilterPicker : {
        equals                 : 'honen berdina da',
        doesNotEqual           : 'ez da honen berdina',
        isEmpty                : 'hutsik',
        isNotEmpty             : 'ez dago hutsik',
        contains               : 'hau du',
        doesNotContain         : 'ez du hau',
        startsWith             : 'honekin hasten da',
        endsWith               : 'honekin amaitzen da',
        isOneOf                : 'hauetako bat da',
        isNotOneOf             : 'ez da hauetako bat',
        isGreaterThan          : 'hau baino handiagoa',
        isLessThan             : 'hau baino gutxiago',
        isGreaterThanOrEqualTo : 'hau baino handiagoa edo berdina',
        isLessThanOrEqualTo    : 'hau baino txikiagoa edo berdina',
        isBetween              : 'hauen artean',
        isNotBetween           : 'ez dago hauen artean',
        isBefore               : 'lehenago',
        isAfter                : 'after',
        timeEquals             : 'denbora berdina da',
        timeDoesNotEqual       : 'denbora ez da berdina',
        isToday                : 'gaur',
        isTomorrow             : 'bihar',
        isYesterday            : 'atzo',
        isThisWeek             : 'aste honetan',
        isNextWeek             : 'hurrengo astea',
        isLastWeek             : 'joan den astea',
        isThisMonth            : 'hilabete honetan',
        isNextMonth            : 'hurrengo hilabetea',
        isLastMonth            : 'joan den hilabetea',
        isThisYear             : 'aurten',
        isNextYear             : 'hurrengo urtea',
        isLastYear             : 'iaz',
        isYearToDate           : 'urte hasieratik',
        isTrue                 : 'egiazkoa',
        isFalse                : 'faltsua',
        selectAProperty        : 'Hautatu propietate bat',
        selectAnOperator       : 'Hautatu eragile bat',
        caseSensitive          : 'Maiuskula/minuskula bereizketa',
        and                    : 'eta',
        dateFormat             : 'YY/M/D',
        selectValue            : 'Hautatu balioa',
        selectOneOrMoreValues  : 'Hautatu balio bat edo gehiago',
        enterAValue            : 'Idatzi balio bat',
        enterANumber           : 'Idatzi zenbaki bat',
        selectADate            : 'Hautatu data bat',
        selectATime            : 'Aukeratu ordua'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Gehitu iragazkia',
        applyCond : applied => applied ? 'Baztertu iragazkia (orain aplikatuta)' : 'Aplikatu iragazkia (orain baztertuta)'
    },

    DateHelper : {
        locale         : 'eu-ES',
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
            { single : 'milisegundo', plural : 'milisegundotan', abbrev : 'milisegundotan' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'segundo', plural : 'segundoak', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minutu', plural : 'minutu', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'ordu', plural : 'ordu', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'egun', plural : 'egun', abbrev : 'e' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'aste', plural : 'aste', abbrev : 'as.' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'hilabete', plural : 'hilabete', abbrev : 'hilab.' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'hiruhileko', plural : 'hiruhileko', abbrev : 'hh' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'urte', plural : 'urte', abbrev : 'u.' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'hamarkada', plural : 'hamarkadak', abbrev : 'ham.' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['milisegundotan'],
            [],
            ['s', 's'],
            [],
            ['min', 'min'],
            [],
            ['h', 'h'],
            [],
            ['e'],
            [],
            ['as.', 'a.'],
            [],
            ['hil.', 'hilab.', 'hil'],
            [],
            ['hh', 'hiruh.', 'hiruhil.'],
            [],
            ['ur.', 'u.'],
            [],
            ['ham.'],
            []
        ],
        parsers : {
            L   : 'YYYY/MM/DD',
            LT  : 'HH:mm A',
            LTS : 'HH:mm:ss A'
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
            return `${year - (year % 10)}ko hamarkada`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
