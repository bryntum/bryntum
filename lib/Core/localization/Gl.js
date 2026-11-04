import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Gl',
    localeDesc : 'Galego',
    localeCode : 'gl-ES',
    localeRtl  : false,

    Object : {
        Yes      : 'Si',
        No       : 'Non',
        Cancel   : 'Cancelar',
        Ok       : 'Aceptar',
        Week     : 'Semana',
        None     : 'Non',
        previous : 'Anterior',
        next     : 'Seguinte',
        to       : 'a',
        at       : 'ás',
        on       : 'en',
        editing  : what => `Editando ${what}`,
        settings : 'Axustes',
        close    : 'Pechar',
        go       : 'Vai',
        save     : 'Gardar',
        cancel   : 'Cancelar',
        revert   : 'Reverter',
        collapse : 'Contraer',
        expand   : 'Expandir',
        today    : 'Hoxe',
        andNMore : n => `e ${n} máis`
    },

    AIBase : {
        delayStatusTexts : [
            'Agardando',
            'Agardando ...',
            'Aínda agardando',
            'Aínda agardando ...'
        ],
        autoStartDialogMessage        : 'Queres activar a voz de IA?',
        voiceActivationToast          : phrase => `Activación por voz habilitada, use a frase "${phrase}" para iniciar unha conversa`,
        voiceControlNotSupportedToast : 'O control por voz non é compatible con este dispositivo',
        voiceControlErrorToast        : 'Non se puido iniciar o control por voz no seu dispositivo',
        voiceControlSilenceToast      : phrase => `A conversa por voz de AIA rematou debido ao silencio. Use a frase ${phrase} para reiniciar a conversa`,
        noAudioDetected               : 'Non se detectou audio, por favor, inténtao de novo',
        transcriptionErrorToast       : 'Fallou a transcrición, por favor intente de novo',
        playbackErrorToast            : 'Fallou a reprodución de audio, por favor verifique o seu dispositivo de saída de audio',
        failed                        : '(fallou)',
        awaitingConfirmation          : 'Agardando confirmación',
        timeoutToast                  : 'Mensaxe caducada',
        readingStatusText             : modelName => `Lendo ${modelName}s`,
        updatingStatusText            : modelName => `Actualizando ${modelName}s`,
        removingStatusText            : modelName => `Eliminando ${modelName}s`,
        addingStatusText              : modelName => `Engadindo ${modelName}`,
        filteringStatusText           : modelName => `Filtrando ${modelName}s`,
        thinkingStatusText            : 'Pensando',
        processingStatusText          : 'Procesando'
    },

    AISettingsPanel : {
        highlight               : 'Resaltar',
        verbosity               : 'Verbosidade',
        voiceActivation         : 'Activación por voz',
        enableVoiceActivation   : 'Activar a activación por voz',
        voiceOnly               : 'Só voz',
        autostart               : 'Inicio automático',
        dataChangeConfirmations : 'Confirmación de cambio de datos',
        add                     : 'Engadir',
        remove                  : 'Eliminar',
        update                  : 'Actualizar',
        planning                : 'Planificación',
        enablePlanning          : 'Activar planificación',
        aiModel                 : 'Modelo de IA',
        timeline                : 'Cronoloxía',
        'in-view'               : 'En vista',
        all                     : 'Todo',
        timeRangeContext        : 'Contexto do intervalo de tempo'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'A IA está falando',
        recordingTooltip      : 'Gravando',
        waitingTooltip        : 'A IA está pensando',
        startRecordingTooltip : 'Preme para comezar',
        stopRecordingTooltip  : 'Preme para deter',
        inactiveTooltip       : 'Sen gravación',
        openChatTooltip       : 'Preme co botón dereito para abrir o chat'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Escriba unha mensaxe',
        noConnectionTooltip     : 'Non se detectou conexión, prema para intentar de novo',
        undone                  : 'desfeito',
        aborted                 : '(abortado)',
        readAloudTooltip        : 'Ler a mensaxe en voz alta',
        confidenceTooltip       : confidence => `Confianza: ${confidence}%`,
        undoTooltip             : 'Desfacer cambios de datos',
        redoTooltip             : 'Refacer cambios de datos',
        thumbsUp                : 'Gústame',
        thumbsDown              : 'Non me gusta',
        feedbackToast           : 'Grazas polo seu comentario!',
        clearChat               : 'Limpar chat',
        closeChat               : 'Pechar chat',
        settings                : 'Configuracións',
        closeSettings           : 'Pechar configuracións'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Seleccione exactamente ${min}`,
        tooFewOptionsSelected     : min => `Seleccione polo menos ${min}`,
        tooManyOptionsSelected    : max => `Seleccione non máis de ${max}`
    },

    CodeEditor : {
        apply        : 'Aplicar',
        autoApply    : 'Aplicación automática',
        downloadCode : 'Descargar código'
    },

    ColorPicker : {
        noColor : 'Sen cor'
    },

    Combo : {
        noResults          : 'Non hai resultados',
        recordNotCommitted : 'Non se engadiu o rexistro',
        addNewValue        : value => `Engadir ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Resaltar',
        preview         : 'Vista previa',
        approve         : 'Aprobar',
        reject          : 'Rexeitar',
        confirmAdd      : 'Confirmar engadido:',
        confirmUpdate   : 'Confirmar actualización:',
        confirmRemove   : 'Confirmar eliminación:',
        confirmCopy     : 'Confirmar copia',
        confirmAssign   : 'Confirmar asignación',
        confirmReassign : 'Confirmar reasignación',
        confirmUnassign : 'Confirmar desasignación',
        confirmLink     : 'Confirmar ligazón',
        confirmUnlink   : 'Confirmar desvinculación'
    },

    FilePicker : {
        file : 'Ficheiro'
    },

    Field : {
        badInput              : 'Valor de campo non válido',
        patternMismatch       : 'O valor debe coincidir cun padrón específico',
        rangeOverflow         : value => `O valor debe ser menor ou igual que ${value.max}`,
        rangeUnderflow        : value => `O valor debe ser maior ou igual que ${value.min}`,
        stepMismatch          : 'O valor debe axustarse ao paso',
        tooLong               : 'O valor debe ser máis curto',
        tooShort              : 'O valor debe ser máis longo',
        typeMismatch          : 'É necesario que o valor teña un formato especial',
        valueMissing          : 'Este campo é obrigatorio',
        invalidValue          : 'Valor de campo non válido',
        minimumValueViolation : 'Infracción do valor mínimo',
        maximumValueViolation : 'Infracción do valor máximo',
        fieldRequired         : 'Este campo é obrigatorio',
        validateFilter        : 'O valor debe estar seleccionado na lista'
    },

    DateField : {
        invalidDate : format => 'Entrada de data non válida, o formato esperado é ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Ir ao ano anterior',
        gotoPrevMonth : 'Ir ao mes anterior',
        gotoNextMonth : 'Ir ao mes seguinte',
        gotoNextYear  : 'Ir ao ano seguinte',
        navigation    : 'Navegación do selector de datas'
    },

    Hint : {
        dontShowAgain : 'Non mostrar de novo'
    },

    NumberFormat : {
        locale   : 'gl-ES',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Unidade non válida'
    },

    TimeField : {
        invalidTime : 'Entrada de hora non válida'
    },

    TimePicker : {
        hour   : 'Hora',
        minute : 'Minuto',
        second : 'Segundo'
    },

    Tooltip : {
        loading : 'Cargando...'
    },

    List : {
        loading   : 'Cargando...',
        selectAll : 'Seleccionar todo'
    },

    GridBase : {
        loadMask : 'Cargando...',
        syncMask : 'Gardando modificacións. Agarde...'
    },

    PagingToolbar : {
        firstPage         : 'Ir á primeira páxina',
        prevPage          : 'Ir á páxina anterior',
        page              : 'Páxina',
        nextPage          : 'Ir á páxina seguinte',
        lastPage          : 'Ir á última páxina',
        reload            : 'Recargar a páxina actual',
        noRecords         : 'Non hai rexistros para mostrar',
        pageCountTemplate : data => `de ${data.lastPage}`,
        summaryTemplate   : data => `Mostrando os rexistros ${data.start} - ${data.end} de ${data.allCount}`
    },

    Popup : {
        close    : 'Pechar',
        maximize : 'Maximizar'
    },

    Splitter : {
        ariaLabel      : 'Divisor, usa as teclas de frecha para redimensionar os paneis veciños',
        collapseLeft   : 'Pregar o panel esquerdo',
        collapseRight  : 'Pregar o panel dereito',
        collapseTop    : 'Pregar o panel superior',
        collapseBottom : 'Pregar o panel inferior',
        expandLeft     : 'Despregar o panel esquerdo',
        expandRight    : 'Despregar o panel dereito',
        expandTop      : 'Despregar o panel superior',
        expandBottom   : 'Despregar o panel inferior'
    },

    TabPanel : {
        containsInvalidFields : 'A lapela contén campos non válidos'
    },

    Toolbar : {
        showOverflowingItems : 'Mostrar elementos desbordados',
        scrollForMore        : 'Desprazar para máis'
    },

    UndoRedo : {
        Undo           : 'Desfacer',
        Redo           : 'Refacer',
        UndoLastAction : 'Desfacer a última acción',
        RedoLastAction : 'Refacer a última acción de desfacer',
        NoActions      : 'Non hai elementos na fila de desfacer'
    },

    FieldFilterPicker : {
        equals                 : 'igual a',
        doesNotEqual           : 'non é igual a',
        isEmpty                : 'baleiro',
        isNotEmpty             : 'non está baleiro',
        contains               : 'contén',
        doesNotContain         : 'non contén',
        startsWith             : 'comeza por',
        endsWith               : 'finaliza en',
        isOneOf                : 'un de',
        isNotOneOf             : 'non é un de',
        isGreaterThan          : 'maior que',
        isLessThan             : 'menor que',
        isGreaterThanOrEqualTo : 'maior ou igual que',
        isLessThanOrEqualTo    : 'menor ou igual que',
        isBetween              : 'entre',
        isNotBetween           : 'non entre',
        isBefore               : 'antes de',
        isAfter                : 'despois de',
        timeEquals             : 'o tempo é igual',
        timeDoesNotEqual       : 'o tempo non é igual',
        isToday                : 'hoxe',
        isTomorrow             : 'mañá',
        isYesterday            : 'onte',
        isThisWeek             : 'esta semana',
        isNextWeek             : 'a próxima semana',
        isLastWeek             : 'última semana',
        isThisMonth            : 'este mes',
        isNextMonth            : 'o próximo mes',
        isLastMonth            : 'último mes',
        isThisYear             : 'este ano',
        isNextYear             : 'ano seguinte',
        isLastYear             : 'último ano',
        isYearToDate           : 'até o presente',
        isTrue                 : 'verdadeiro',
        isFalse                : 'falso',
        selectAProperty        : 'Seleccionar unha propiedade',
        selectAnOperator       : 'Seleccionar un operador',
        caseSensitive          : 'Diferenciar maiúsculas e minúsculas',
        and                    : 'e',
        dateFormat             : 'D/M/AA',
        selectValue            : 'Seleccione o valor',
        selectOneOrMoreValues  : 'Seleccionar un ou varios valores',
        enterAValue            : 'Introducir un valor',
        enterANumber           : 'Introducir un número',
        selectADate            : 'Seleccionar unha data',
        selectATime            : 'Selecciona hora'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Engadir filtro',
        applyCond : applied => applied ? 'Omitir filtro (aplicado actualmente)' : 'Aplicar filtro (omitido actualmente)'
    },

    DateHelper : {
        locale         : 'gl-ES',
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
            { single : 'milisegundo', plural : 'milisegundos', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'segundo', plural : 'segundos', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minuto', plural : 'minutos', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'hora', plural : 'horas', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'día', plural : 'días', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'semana', plural : 'semanas', abbrev : 'sem' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'mes', plural : 'meses', abbrev : 'mes' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'trimestre', plural : 'trimestres', abbrev : 't' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'ano', plural : 'anos', abbrev : 'ano' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'década', plural : 'décadas', abbrev : 'déc' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil'],
            [],
            ['s', 's'],
            [],
            ['min', 'min'],
            [],
            ['h', 'h'],
            [],
            ['d'],
            [],
            ['s', 'sem'],
            [],
            ['mes', 'mes', 'mes'],
            [],
            ['t', 'tri', 'trim'],
            [],
            ['a', 'ano'],
            [],
            ['déc'],
            []
        ],
        parsers : {
            L   : 'MM/DD/AAAA',
            LT  : 'HH:mm A',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {
            const hasSpecialCase = ['11', '12', '13'].find((n) => number.endsWith(n));

            let suffix = 'º';

            if (!hasSpecialCase) {
                const lastDigit = number[number.length - 1];
                suffix = { 1 : 'º', 2 : 'º', 3 : 'º' }[lastDigit] || 'º';
            }

            return number + suffix;
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `anos ${year - (year % 10)}`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
