import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'LT',
    localeDesc : 'Lietuvių',
    localeCode : 'lt-LT',
    localeRtl  : false,

    Object : {
        Yes      : 'Taip',
        No       : 'Ne',
        Cancel   : 'Atšaukti',
        Ok       : 'GERAI',
        Week     : 'Savaitė',
        None     : 'Nė vienas',
        previous : 'Ankstesnis',
        next     : 'Kitas',
        to       : 'iki',
        at       : 'prie',
        on       : 'ant',
        editing  : what => `Redaguojama ${what}`,
        settings : 'Nustatymai',
        close    : 'Uždaryti',
        go       : 'Eiti',
        save     : 'Išsaugoti',
        cancel   : 'Atšaukti',
        revert   : 'Atstatyti',
        collapse : 'Sutraukti',
        expand   : 'Išplėsti',
        today    : 'Šiandien',
        andNMore : n => `ir ${n} daugiau`
    },

    AIBase : {
        delayStatusTexts : [
            'Laukiama',
            'Laukiama ...',
            'Vis dar laukiama',
            'Vis dar laukiama ...'
        ],
        autoStartDialogMessage        : 'Ar norite įjungti AI balso aktyvavimą?',
        voiceActivationToast          : phrase => `Balso aktyvavimas įjungtas, naudokite frazę "${phrase}" pokalbiui pradėti`,
        voiceControlNotSupportedToast : 'Balso valdymas nepalaikomas šiame įrenginyje',
        voiceControlErrorToast        : 'Balso valdymo nepavyko pradėti jūsų įrenginyje',
        voiceControlSilenceToast      : phrase => `Dirbtinio intelekto balso pokalbis baigtas dėl tylos. Naudokite frazę ${phrase} pokalbiui pradėti iš naujo`,
        noAudioDetected               : 'Nerasta garso, bandykite dar kartą',
        transcriptionErrorToast       : 'Transkripcija nepavyko, bandykite dar kartą',
        playbackErrorToast            : 'Garso atkūrimas nepavyko, patikrinkite savo garso išvesties įrenginį',
        failed                        : '(nepavyko)',
        awaitingConfirmation          : 'Laukiama patvirtinimo',
        timeoutToast                  : 'Pranešimas pasibaigė',
        readingStatusText             : modelName => `Skaitoma ${modelName}s`,
        updatingStatusText            : modelName => `Atnaujinimas ${modelName}s`,
        removingStatusText            : modelName => `Šalinimas ${modelName}s`,
        addingStatusText              : modelName => `Pridėjimas ${modelName}`,
        filteringStatusText           : modelName => `Filtravimas ${modelName}s`,
        thinkingStatusText            : 'Mąstymas',
        processingStatusText          : 'Apdorojimas'
    },

    AISettingsPanel : {
        highlight               : 'Paryškinti',
        verbosity               : 'Išsamumas',
        voiceActivation         : 'Balso aktyvavimas',
        enableVoiceActivation   : 'Įjungti balso aktyvavimą',
        voiceOnly               : 'Tik balsas',
        autostart               : 'Automatinis paleidimas',
        dataChangeConfirmations : 'Duomenų pakeitimų patvirtinimas',
        add                     : 'Pridėti',
        remove                  : 'Pašalinti',
        update                  : 'Atnaujinti',
        planning                : 'Planavimas',
        enablePlanning          : 'Įjungti planavimą',
        aiModel                 : 'AI Modelis',
        timeline                : 'Laiko juosta',
        'in-view'               : 'Matoma',
        all                     : 'Visi',
        timeRangeContext        : 'Laiko intervalo kontekstas'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI kalba',
        recordingTooltip      : 'Įrašoma',
        waitingTooltip        : 'AI galvoja',
        startRecordingTooltip : 'Spustelėkite pradėti',
        stopRecordingTooltip  : 'Spustelėkite sustabdyti',
        inactiveTooltip       : 'Neįrašoma',
        openChatTooltip       : 'Dešiniuoju pelės mygtuku atidarykite pokalbį'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Įveskite pranešimą',
        noConnectionTooltip     : 'Ryšys nenustatytas, spustelėkite bandyti dar kartą',
        undone                  : 'atšaukta',
        aborted                 : '(nutraukta)',
        readAloudTooltip        : 'Perskaityti pranešimą garsiai',
        confidenceTooltip       : confidence => `Pasitikėjimas: ${confidence}%`,
        undoTooltip             : 'Atšaukti duomenų pakeitimus',
        redoTooltip             : 'Atkurti duomenų pakeitimus',
        thumbsUp                : 'Patinka',
        thumbsDown              : 'Nepatinka',
        feedbackToast           : 'Ačiū už jūsų atsiliepimą!',
        clearChat               : 'Išvalyti pokalbį',
        closeChat               : 'Uždaryti pokalbį',
        settings                : 'Nustatymai',
        closeSettings           : 'Uždaryti nustatymus'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Pasirinkite tiksliai ${min}`,
        tooFewOptionsSelected     : min => `Pasirinkite bent ${min}`,
        tooManyOptionsSelected    : max => `Pasirinkite ne daugiau kaip ${max}`
    },

    CodeEditor : {
        apply        : 'Taikyti',
        autoApply    : 'Automatiškai taikyti',
        downloadCode : 'Atsisiųsti kodą'
    },

    ColorPicker : {
        noColor : 'Bespalvis'
    },

    Combo : {
        noResults          : 'Rezultatų nėra',
        recordNotCommitted : 'Įrašo pridėti negalima',
        addNewValue        : value => `Įtraukti ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Paryškinti',
        preview         : 'Peržiūra',
        approve         : 'Patvirtinti',
        reject          : 'Atmesti',
        confirmAdd      : 'Patvirtinti pridėjimą:',
        confirmUpdate   : 'Patvirtinti atnaujinimą:',
        confirmRemove   : 'Patvirtinti pašalinimą:',
        confirmCopy     : 'Patvirtinti kopijavimą',
        confirmAssign   : 'Patvirtinti priskyrimą',
        confirmReassign : 'Patvirtinti perpriskyrimą',
        confirmUnassign : 'Patvirtinti nepriskyrimą',
        confirmLink     : 'Patvirtinti nuorodą',
        confirmUnlink   : 'Patvirtinti nuorodos pašalinimą'
    },

    FilePicker : {
        file : 'Failas'
    },

    Field : {
        badInput              : 'Netinkama lauko reikšmė',
        patternMismatch       : 'Reikšmė turi atitikti konkretų modelį',
        rangeOverflow         : value => `Reikšmė turi būti ne mažesnė jei ar lygi ${value.max}`,
        rangeUnderflow        : value => `Reikšmė turi būti didesnė nei ar lygi ${value.min}`,
        stepMismatch          : 'Reikšmė turi atitikti veiksmą',
        tooLong               : 'Reikšmė turi būti trumpesnė',
        tooShort              : 'Reikšmė turi būti ilgesnė',
        typeMismatch          : 'Reikšmė turi būti specialiu formatu',
        valueMissing          : 'Šį lauką užpildyti būtina',
        invalidValue          : 'Netinkama lauko reikšmė',
        minimumValueViolation : 'Mažiausios reikšmės skaičiaus pažeidimas',
        maximumValueViolation : 'Didžiausios reikšmės skaičiaus pažeidimas',
        fieldRequired         : 'Šį lauką užpildyti būtina',
        validateFilter        : 'Reikšmė turi būti pasirinktas iš sąrašo'
    },

    DateField : {
        invalidDate : format => 'Neteisingas datos įvedimas, tikimasi formato ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Eiti į ankstesnius metus',
        gotoPrevMonth : 'Eiti į ankstesnį mėnesį',
        gotoNextMonth : 'Eiti į kitą mėnesį',
        gotoNextYear  : 'Eiti į paskesnius metus',
        navigation    : 'Datos pasirinkimo naršymas'
    },

    Hint : {
        dontShowAgain : 'Daugiau nerodyti'
    },

    NumberFormat : {
        locale   : 'lt-LT',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Netinkamas vienetas'
    },

    TimeField : {
        invalidTime : 'Netinkama laiko įvestis'
    },

    TimePicker : {
        hour   : 'Valanda',
        minute : 'Minutė',
        second : 'Antras'
    },

    Tooltip : {
        loading : 'Įkeliama...'
    },

    List : {
        loading   : 'Įkeliama...',
        selectAll : 'Pasirinkti viską'
    },

    GridBase : {
        loadMask : 'Įkeliama...',
        syncMask : 'Įrašomi pakeitimai, palaukite...'
    },

    PagingToolbar : {
        firstPage         : 'Eiti į pirmą puslapį',
        prevPage          : 'Eiti į ankstesnį puslapį',
        page              : 'Puslapis',
        nextPage          : 'Eiti į paskesnį puslapį',
        lastPage          : 'Eiti į paskutinį puslapį',
        reload            : 'Iš naujo įkelti dabartinį puslapį',
        noRecords         : 'Rodytinų įrašų nėra',
        pageCountTemplate : data => `iš ${data.lastPage}`,
        summaryTemplate   : data => `Rodomi įrašai ${data.start} - ${data.end} iš ${data.allCount}`
    },

    Popup : {
        close    : 'Uždaryti',
        maximize : 'Padidinti'
    },

    Splitter : {
        ariaLabel      : 'Skirstytuvas, naudokite rodyklių klavišus, kad pakeistumėte gretimų skydelių dydį',
        collapseLeft   : 'Suskleisti kairįjį skydelį',
        collapseRight  : 'Suskleisti dešinįjį skydelį',
        collapseTop    : 'Suskleisti viršutinį skydelį',
        collapseBottom : 'Suskleisti apatinį skydelį',
        expandLeft     : 'Išskleisti kairįjį skydelį',
        expandRight    : 'Išskleisti dešinįjį skydelį',
        expandTop      : 'Išskleisti viršutinį skydelį',
        expandBottom   : 'Išskleisti apatinį skydelį'
    },

    TabPanel : {
        containsInvalidFields : 'Skirtukas turi neteisingus laukus'
    },

    Toolbar : {
        showOverflowingItems : 'Rodyti perpildytus elementus',
        scrollForMore        : 'Slinkti daugiau'
    },

    UndoRedo : {
        Undo           : 'Anuliuoti',
        Redo           : 'Iš naujo vykdyti',
        UndoLastAction : 'Anuliuoti paskutinį veiksmą',
        RedoLastAction : 'Pakartoti paskutinį neanuliuotą veiksmą',
        NoActions      : 'Nėra elementų anuliavimo eilėje'
    },

    FieldFilterPicker : {
        equals                 : 'lygu',
        doesNotEqual           : 'nelygu',
        isEmpty                : 'tuščias',
        isNotEmpty             : 'netuščia',
        contains               : 'turi',
        doesNotContain         : 'nėra',
        startsWith             : 'prasideda',
        endsWith               : 'baigiasi su',
        isOneOf                : 'vienas iš',
        isNotOneOf             : 'nėra vienas iš',
        isGreaterThan          : 'daugiau nei',
        isLessThan             : 'mažiau negu',
        isGreaterThanOrEqualTo : 'daugiau arba lygu',
        isLessThanOrEqualTo    : 'mažiau arba lygu',
        isBetween              : 'tarp',
        isNotBetween           : 'ne diapazone tarp',
        isBefore               : 'prieš',
        isAfter                : 'po',
        timeEquals             : 'laikas lygus',
        timeDoesNotEqual       : 'laikas nelygus',
        isToday                : 'šiandien',
        isTomorrow             : 'rytoj',
        isYesterday            : 'vakar',
        isThisWeek             : 'ši savaitė',
        isNextWeek             : 'ateinanti savaitė',
        isLastWeek             : 'praėjusi savaitė',
        isThisMonth            : 'šis mėnuo',
        isNextMonth            : 'kitas mėnuo',
        isLastMonth            : 'praėjęs mėnuo',
        isThisYear             : 'šie metai',
        isNextYear             : 'ateinantys metai',
        isLastYear             : 'pernai',
        isYearToDate           : 'metai iki šios datos',
        isTrue                 : 'teisinga',
        isFalse                : 'klaidinga',
        selectAProperty        : 'Pasirinkti ypatybę',
        selectAnOperator       : 'Pasirinkti operatorių',
        caseSensitive          : 'Skirti didžiąsias ir mažąsias raides',
        and                    : 'ir',
        dateFormat             : 'YY/M/D',
        selectValue            : 'Pasirinkite vertę',
        selectOneOrMoreValues  : 'Pasirinkite vieną ar daugiau reikšmių',
        enterAValue            : 'Įveskite reikšmę',
        enterANumber           : 'Įveskite numerį',
        selectADate            : 'Pasirinkti datą',
        selectATime            : 'Pasirinkite laiką'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Įtraukti filtrą',
        applyCond : applied => applied ? 'Praleisti filtrą (šiuo metu taikomas)' : 'Taikyti filtrą (šiuo metu praleistas)'
    },

    DateHelper : {
        locale         : 'lt-LT',
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
            { single : 'milisekundė', plural : 'milisek.', abbrev : 'milisek.' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'second', plural : 'sekundės', abbrev : 'sek.' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minute', plural : 'minutes', abbrev : 'min.' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'hour', plural : 'valandos', abbrev : 'val.' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'diena', plural : 'dienos', abbrev : 'd.' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'week', plural : 'savaitės', abbrev : 'sav.' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'mėnuo', plural : 'mėnesiai', abbrev : 'mėn.' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'ketvirtis', plural : 'ketvirčiai', abbrev : 'ketvirčiai' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'metai', plural : 'metai', abbrev : 'm.' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'dešimtmetis', plural : 'dešimtmečiai', abbrev : 'dešimt.' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mln.'],
            [],
            ['sek.', 'sek.'],
            [],
            ['min.', 'min.'],
            [],
            ['val.', 'val.'],
            [],
            ['d.'],
            [],
            ['sav.', 'sav.'],
            [],
            ['mėn.', 'mėn.', 'mėn.'],
            [],
            ['ketvirčiai', 'ketvirčiai', 'ketvirčiai'],
            [],
            ['m.', 'm.'],
            [],
            ['dešimt.'],
            []
        ],
        parsers : {
            L   : 'MMMMM/MM/DD',
            LT  : 'val. min.',
            LTS : 'val. min. sek.'
        },
        ordinalSuffix : number => {
            const hasSpecialCase = ['11', '12', '13'].find((n) => number.endsWith(n));

            let suffix = '-as';

            if (!hasSpecialCase) {
                const lastDigit = number[number.length - 1];
                suffix = { 1 : '-as', 2 : '-as', 3 : '-ias' }[lastDigit] || '-as';
            }

            return number + suffix;
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}-ieji`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
