import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Ca',
    localeDesc : 'Català',
    localeCode : 'ca-ES',
    localeRtl  : false,

    Object : {
        Yes      : 'Sí',
        No       : 'No',
        Cancel   : 'Cancel·la',
        Ok       : "D'acord",
        Week     : 'Setmana',
        None     : 'Cap',
        previous : 'Anterior',
        next     : 'Següent',
        to       : 'a',
        at       : 'a',
        on       : 'el',
        editing  : what => `Editant ${what}`,
        settings : 'Configuració',
        close    : 'Tancar',
        go       : 'Vés-hi',
        save     : 'Desa',
        cancel   : 'Cancel·la',
        revert   : 'Reverteix',
        collapse : 'Redueix',
        expand   : 'Expandeix',
        today    : 'Avui',
        andNMore : n => `i ${n} més`
    },

    AIBase : {
        delayStatusTexts : [
            'Esperant',
            'Esperant ...',
            'Encara esperant',
            'Encara esperant ...'
        ],
        autoStartDialogMessage        : "Vols activar l'activació per veu de l'IA?",
        voiceActivationToast          : phrase => `Activació per veu habilitada, utilitza la frase "${phrase}" per iniciar una conversa`,
        voiceControlNotSupportedToast : 'El control de veu no és compatible amb aquest dispositiu',
        voiceControlErrorToast        : "No s'ha pogut iniciar el control de veu al vostre dispositiu",
        voiceControlSilenceToast      : phrase => `La conversa de veu de la IA ha finalitzat per silenci. Utilitzeu la frase ${phrase} per reiniciar la conversa`,
        noAudioDetected               : "No s'ha detectat àudio, si us plau intenta-ho de nou",
        transcriptionErrorToast       : 'La transcripció ha fallat, torneu-ho a intentar',
        playbackErrorToast            : "La reproducció d'àudio ha fallat, comproveu el dispositiu de sortida d'àudio",
        failed                        : '(fallat)',
        awaitingConfirmation          : 'Esperant confirmació',
        timeoutToast                  : 'El missatge ha caducat',
        readingStatusText             : modelName => `Llegint ${modelName}s`,
        updatingStatusText            : modelName => `Actualitzant ${modelName}s`,
        removingStatusText            : modelName => `Eliminant ${modelName}s`,
        addingStatusText              : modelName => `Afegint ${modelName}`,
        filteringStatusText           : modelName => `Filtrant ${modelName}s`,
        thinkingStatusText            : 'Pensant',
        processingStatusText          : 'Processant'
    },

    AISettingsPanel : {
        highlight               : 'Ressaltar',
        verbosity               : 'Verbositat',
        voiceActivation         : 'Activació per veu',
        enableVoiceActivation   : "Activar l'activació per veu",
        voiceOnly               : 'Només veu',
        autostart               : 'Inici automàtic',
        dataChangeConfirmations : 'Confirmació de canvi de dades',
        add                     : 'Afegir',
        remove                  : 'Eliminar',
        update                  : 'Actualitzar',
        planning                : 'Planificació',
        enablePlanning          : 'Habilita la planificació',
        aiModel                 : "Model d'IA",
        timeline                : 'Cronologia',
        'in-view'               : 'En vista',
        all                     : 'Tot',
        timeRangeContext        : 'Context del rang de temps'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'La IA està parlant',
        recordingTooltip      : 'Enregistrant',
        waitingTooltip        : 'La IA està pensant',
        startRecordingTooltip : 'Fes clic per començar',
        stopRecordingTooltip  : 'Fes clic per aturar',
        inactiveTooltip       : "No s'està enregistrant",
        openChatTooltip       : 'Fes clic dret per obrir el xat'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Escriviu un missatge',
        noConnectionTooltip     : "No s'ha detectat connexió, feu clic per tornar a intentar",
        undone                  : 'desfeta',
        aborted                 : '(abortat)',
        readAloudTooltip        : 'Llegir el missatge en veu alta',
        confidenceTooltip       : confidence => `Confiança: ${confidence}%`,
        undoTooltip             : 'Desfer els canvis de dades',
        redoTooltip             : 'Refer els canvis de dades',
        thumbsUp                : 'Polze amunt',
        thumbsDown              : 'Polze avall',
        feedbackToast           : 'Gràcies pel vostre comentari!',
        clearChat               : 'Esborrar el xat',
        closeChat               : 'Tanca el xat',
        settings                : 'Configuració',
        closeSettings           : 'Tancar configuració'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Seleccioneu exactament ${min}`,
        tooFewOptionsSelected     : min => `Seleccioneu almenys ${min}`,
        tooManyOptionsSelected    : max => `Seleccioneu com a màxim ${max}`
    },

    CodeEditor : {
        apply        : 'Aplicar',
        autoApply    : 'Aplicació automàtica',
        downloadCode : 'Descarregar codi'
    },

    ColorPicker : {
        noColor : 'Sense color'
    },

    Combo : {
        noResults          : 'No hi ha cap resultat',
        recordNotCommitted : "No s'ha pogut afegir el registre",
        addNewValue        : value => `Afegeix ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Ressaltar',
        preview         : 'Vista prèvia',
        approve         : 'Aprovar',
        reject          : 'Rebutjar',
        confirmAdd      : "Confirma l'afegit:",
        confirmUpdate   : "Confirma l'actualització:",
        confirmRemove   : "Confirma l'eliminació:",
        confirmCopy     : 'Confirma la còpia',
        confirmAssign   : "Confirma l'assignació",
        confirmReassign : 'Confirma la reassignació',
        confirmUnassign : 'Confirma la desassignació',
        confirmLink     : "Confirma l'enllaç",
        confirmUnlink   : 'Confirma la desvinculació'
    },

    FilePicker : {
        file : 'Fitxer'
    },

    Field : {
        badInput              : 'Valor del camp no vàlid',
        patternMismatch       : 'El valor ha de coincidir amb un patró específic',
        rangeOverflow         : value => `El valor ha de ser igual o inferior a ${value.max}`,
        rangeUnderflow        : value => `El valor ha de ser igual o superior a ${value.min}`,
        stepMismatch          : "El valor ha d'ajustar-se al pas",
        tooLong               : 'El valor ha de ser més curt',
        tooShort              : 'El valor ha de ser més llarg',
        typeMismatch          : 'Cal que el valor estigui en un format especial',
        valueMissing          : 'Aquest camp és obligatori',
        invalidValue          : 'Valor del camp no vàlid',
        minimumValueViolation : 'Infracció del valor mínim',
        maximumValueViolation : 'Infracció del valor màxim',
        fieldRequired         : 'Aquest camp és obligatori',
        validateFilter        : "El valor s'ha de seleccionar de la llista"
    },

    DateField : {
        invalidDate : format => 'Entrada de data no vàlida, el format esperat és ' + format
    },

    DatePicker : {
        gotoPrevYear  : "Ves a l'any anterior",
        gotoPrevMonth : 'Ves al mes anterior',
        gotoNextMonth : 'Ves al mes següent',
        gotoNextYear  : "Ves a l'any següent",
        navigation    : 'Navegació del selector de dates'
    },

    Hint : {
        dontShowAgain : 'No tornis a mostrar'
    },

    NumberFormat : {
        locale   : 'ca-ES',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Unitat no vàlida'
    },

    TimeField : {
        invalidTime : 'Entrada de temps no vàlida'
    },

    TimePicker : {
        hour   : 'Hora',
        minute : 'Minut',
        second : 'Segon'
    },

    Tooltip : {
        loading : 'Carregant...'
    },

    List : {
        loading   : "S'està carregant...",
        selectAll : 'Selecciona-ho tot'
    },

    GridBase : {
        loadMask : "S'està carregant...",
        syncMask : "S'estan desant els canvis, espereu-vos..."
    },

    PagingToolbar : {
        firstPage         : 'Ves a la primera pàgina',
        prevPage          : 'Ves a la pàgina anterior',
        page              : 'Pàgina',
        nextPage          : 'Ves a la pàgina següent',
        lastPage          : "Ves a l'última pàgina",
        reload            : 'Torna a carregar la pàgina actual',
        noRecords         : 'No hi ha cap registre per visualitzar',
        pageCountTemplate : data => `de ${data.lastPage}`,
        summaryTemplate   : data => `S'estan mostrant els registres ${data.start} - ${data.end} de ${data.allCount}`
    },

    Popup : {
        close    : 'Tanca',
        maximize : 'Maximitzar'
    },

    Splitter : {
        ariaLabel      : 'Divisor, utilitzeu les tecles de fletxa per redimensionar els panells veïns',
        collapseLeft   : 'Replega el panell esquerre',
        collapseRight  : 'Replega el panell dret',
        collapseTop    : 'Replega el panell superior',
        collapseBottom : 'Replega el panell inferior',
        expandLeft     : 'Desplega el panell esquerre',
        expandRight    : 'Desplega el panell dret',
        expandTop      : 'Desplega el panell superior',
        expandBottom   : 'Desplega el panell inferior'
    },

    TabPanel : {
        containsInvalidFields : 'La pestanya conté camps no vàlids'
    },

    Toolbar : {
        showOverflowingItems : 'Mostra els elements desbordants',
        scrollForMore        : 'Desplaça’t per veure més'
    },

    UndoRedo : {
        Undo           : 'Desfés',
        Redo           : 'Refés',
        UndoLastAction : "Desfés l'última acció",
        RedoLastAction : "Refés l'última acció desfeta",
        NoActions      : 'No hi ha cap element a la cua de desfer'
    },

    FieldFilterPicker : {
        equals                 : 'és igual a',
        doesNotEqual           : 'no és igual a',
        isEmpty                : 'buit',
        isNotEmpty             : 'no està buit',
        contains               : 'conté',
        doesNotContain         : 'no conté',
        startsWith             : 'comença per',
        endsWith               : 'acaba amb',
        isOneOf                : 'un de',
        isNotOneOf             : 'no és un de',
        isGreaterThan          : 'major que',
        isLessThan             : 'inferior a',
        isGreaterThanOrEqualTo : 'major o igual que',
        isLessThanOrEqualTo    : 'menor o igual que',
        isBetween              : 'entre',
        isNotBetween           : 'no és entre',
        isBefore               : 'abans',
        isAfter                : 'després',
        timeEquals             : 'el temps és igual',
        timeDoesNotEqual       : 'el temps no és igual',
        isToday                : 'avui',
        isTomorrow             : 'demà',
        isYesterday            : 'ahir',
        isThisWeek             : 'aquesta setmana',
        isNextWeek             : 'la setmana que ve',
        isLastWeek             : 'la setmana passada',
        isThisMonth            : 'aquest mes',
        isNextMonth            : 'el mes que ve',
        isLastMonth            : 'el mes passat',
        isThisYear             : 'aquest any',
        isNextYear             : "l'any que ve",
        isLastYear             : "l'any passat",
        isYearToDate           : 'any fins a la data',
        isTrue                 : 'cert',
        isFalse                : 'fals',
        selectAProperty        : 'Seleccioneu una propietat',
        selectAnOperator       : 'Seleccioneu un operador',
        caseSensitive          : 'Distingeix entre majúscules i minúscules',
        and                    : 'i',
        dateFormat             : 'D/M/AA',
        selectValue            : 'Seleccioneu el valor',
        selectOneOrMoreValues  : 'Seleccioneu un o més valors',
        enterAValue            : 'Introduïu un valor',
        enterANumber           : 'Introduïu un número',
        selectADate            : 'Seleccioneu una data',
        selectATime            : "Seleccioneu l'hora"
    },

    FieldFilterPickerGroup : {
        addFilter : 'Afegeix un filtre',
        applyCond : applied => applied ? 'Omet el filtre (actualment aplicat)' : 'Aplica el filtre (actualment omès)'
    },

    DateHelper : {
        locale         : 'ca-ES',
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
            { single : 'mil·lisegon', plural : 'mil·lisegons', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'segon', plural : 'segons', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minut', plural : 'minuts', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'hora', plural : 'hores', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'dia', plural : 'dies', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'setmana', plural : 'setmanes', abbrev : 'set' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'mes', plural : 'mesos', abbrev : 'm' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'trimestre', plural : 'trimestres', abbrev : 't' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'any', plural : 'anys', abbrev : 'a' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'dècada', plural : 'dècades', abbrev : 'dèc' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['ms'],
            [],
            ['s'],
            [],
            ['min'],
            [],
            ['h'],
            [],
            ['d'],
            [],
            ['set', 'setm.'],
            [],
            ['m'],
            [],
            ['t', 'trim.', 'tri'],
            [],
            ['a'],
            [],
            ['dèc'],
            []
        ],
        parsers : {
            L   : 'MM/DD/AAAA',
            LT  : 'HH:mm A',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {
            const hasSpecialCase = ['11', '12', '13'].find((n) => number.endsWith(n));

            let suffix = 'è';

            if (!hasSpecialCase) {
                const lastDigit = number[number.length - 1];
                suffix = { 1 : 'r', 2 : 'n', 3 : 'r', 4 : 't' }[lastDigit] || 'è';
            }

            return number + suffix;
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}s`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
