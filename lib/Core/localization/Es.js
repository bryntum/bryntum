import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Es',
    localeDesc : 'Español',
    localeCode : 'es',
    localeRtl  : false,

    Object : {
        Yes      : 'Sí',
        No       : 'No',
        Cancel   : 'Cancelar',
        Ok       : 'Correcto',
        Week     : 'Semana',
        None     : 'Ninguno',
        previous : 'Anterior',
        next     : 'Siguiente',
        to       : 'a',
        at       : 'a las',
        on       : 'en',
        editing  : what => `Editando ${what}`,
        settings : 'Configuración',
        close    : 'Cerrar',
        go       : 'Ir',
        save     : 'Guardar',
        cancel   : 'Cancelar',
        revert   : 'Revertir',
        collapse : 'Contrar',
        expand   : 'Expandir',
        today    : 'Hoy',
        andNMore : n => `y ${n} más`
    },

    AIBase : {
        delayStatusTexts : [
            'Esperando',
            'Esperando ...',
            'Aún esperando',
            'Aún esperando ...'
        ],
        autoStartDialogMessage        : '¿Desea habilitar la activación por voz de la IA?',
        voiceActivationToast          : phrase => `Activación por voz habilitada, use la frase "${phrase}" para iniciar una conversación`,
        voiceControlNotSupportedToast : 'El control por voz no es compatible con este dispositivo',
        voiceControlErrorToast        : 'No se pudo iniciar el control por voz en su dispositivo',
        voiceControlSilenceToast      : phrase => `La conversación por voz de la IA terminó debido al silencio. Use la frase ${phrase} para reiniciar la conversación`,
        noAudioDetected               : 'No se detectó audio, por favor intente nuevamente',
        transcriptionErrorToast       : 'La transcripción falló, por favor intente nuevamente',
        playbackErrorToast            : 'La reproducción de audio falló, por favor verifique su dispositivo de salida de audio',
        failed                        : '(fallido)',
        awaitingConfirmation          : 'Esperando confirmación',
        timeoutToast                  : 'El mensaje ha expirado',
        readingStatusText             : modelName => `Leyendo ${modelName}s`,
        updatingStatusText            : modelName => `Actualizando ${modelName}s`,
        removingStatusText            : modelName => `Eliminando ${modelName}s`,
        addingStatusText              : modelName => `Añadiendo ${modelName}`,
        filteringStatusText           : modelName => `Filtrando ${modelName}s`,
        thinkingStatusText            : 'Pensando',
        processingStatusText          : 'Procesando'
    },

    AISettingsPanel : {
        highlight               : 'Resaltar',
        verbosity               : 'Verbosidad',
        voiceActivation         : 'Activación por voz',
        enableVoiceActivation   : 'Habilitar activación por voz',
        voiceOnly               : 'Solo voz',
        autostart               : 'Inicio automático',
        dataChangeConfirmations : 'Confirmación de cambio de datos',
        add                     : 'Agregar',
        remove                  : 'Eliminar',
        update                  : 'Actualizar',
        planning                : 'Planificación',
        enablePlanning          : 'Habilitar planificación',
        aiModel                 : 'Modelo de IA',
        timeline                : 'Cronología',
        'in-view'               : 'En vista',
        all                     : 'Todo',
        timeRangeContext        : 'Contexto del rango de tiempo'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'La IA está hablando',
        recordingTooltip      : 'Grabando',
        waitingTooltip        : 'La IA está pensando',
        startRecordingTooltip : 'Haga clic para comenzar',
        stopRecordingTooltip  : 'Haga clic para detener',
        inactiveTooltip       : 'No está grabando',
        openChatTooltip       : 'Haga clic derecho para abrir el chat'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Escriba un mensaje',
        noConnectionTooltip     : 'No se detectó conexión, haga clic para intentar nuevamente',
        undone                  : 'deshecho',
        aborted                 : '(abortado)',
        readAloudTooltip        : 'Leer el mensaje en voz alta',
        confidenceTooltip       : confidence => `Confianza: ${confidence}%`,
        undoTooltip             : 'Deshacer cambios de datos',
        redoTooltip             : 'Rehacer cambios de datos',
        thumbsUp                : 'Pulgar arriba',
        thumbsDown              : 'Pulgar abajo',
        feedbackToast           : '¡Gracias por sus comentarios!',
        clearChat               : 'Limpiar chat',
        closeChat               : 'Cerrar chat',
        settings                : 'Configuraciones',
        closeSettings           : 'Cerrar configuraciones'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Seleccione exactamente ${min}`,
        tooFewOptionsSelected     : min => `Seleccione al menos ${min}`,
        tooManyOptionsSelected    : max => `Seleccione no más de ${max}`
    },

    CodeEditor : {
        apply        : 'Aplicar',
        autoApply    : 'Aplicación automática',
        downloadCode : 'Descargar código'
    },

    ColorPicker : {
        noColor : 'Sin color'
    },

    Combo : {
        noResults          : 'Sin resultados',
        recordNotCommitted : 'No se ha podido añadir un registro',
        addNewValue        : value => `Agregar ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Resaltar',
        preview         : 'Vista previa',
        approve         : 'Aprobar',
        reject          : 'Rechazar',
        confirmAdd      : 'Confirmar adición:',
        confirmUpdate   : 'Confirmar actualización:',
        confirmRemove   : 'Confirmar eliminación:',
        confirmCopy     : 'Confirmar copia',
        confirmAssign   : 'Confirmar asignación',
        confirmReassign : 'Confirmar reasignación',
        confirmUnassign : 'Confirmar desasignación',
        confirmLink     : 'Confirmar enlace',
        confirmUnlink   : 'Confirmar desvinculación'
    },

    FilePicker : {
        file : 'Archivo'
    },

    Field : {
        badInput              : 'Valor de campo no válido',
        patternMismatch       : 'El valor debe coincidir con un patrón específico',
        rangeOverflow         : value => `El valor debe ser inferior o igual a ${value.max}`,
        rangeUnderflow        : value => `El valor debe ser superior o igual a ${value.min}`,
        stepMismatch          : 'El valor debe adaptarse al paso',
        tooLong               : 'El valor debe ser más corto',
        tooShort              : 'El valor debe ser más largo',
        typeMismatch          : 'El valor debe estar en un formato especial',
        valueMissing          : 'Este campo es obligatorio',
        invalidValue          : 'Valor de campo no válido',
        minimumValueViolation : 'Infracción de valor mínimo',
        maximumValueViolation : 'Infracción de valor máximo',
        fieldRequired         : 'Este campo es obligatorio',
        validateFilter        : 'El valor debe seleccionarse de la lista'
    },

    DateField : {
        invalidDate : format => 'Entrada de fecha inválida, se espera el formato ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Ir al año anterior',
        gotoPrevMonth : 'Ir al mes anterior',
        gotoNextMonth : 'Ir al mes siguiente',
        gotoNextYear  : 'Ir al año siguiente',
        navigation    : 'Navegación del selector de fecha'
    },

    Hint : {
        dontShowAgain : 'No mostrar de nuevo'
    },

    NumberFormat : {
        locale   : 'es',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Unidad no válida'
    },

    TimeField : {
        invalidTime : 'Entrada de hora no válida'
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
        syncMask : 'Guardando cambios, espere...'
    },

    PagingToolbar : {
        firstPage         : 'Ir a la primera página',
        prevPage          : 'Ir a la página anterior',
        page              : 'Página',
        nextPage          : 'Ir a la página siguiente',
        lastPage          : 'Ir a la última página',
        reload            : 'Refrescar la página actual',
        noRecords         : 'Sin registros que mostrar',
        pageCountTemplate : data => `de ${data.lastPage}`,
        summaryTemplate   : data => `Mostrando registros ${data.start} - ${data.end} de ${data.allCount}`
    },

    Popup : {
        close    : 'Cerrar desplegable',
        maximize : 'Maximizar'
    },

    Splitter : {
        ariaLabel      : 'Divisor, use las teclas de flecha para redimensionar los paneles vecinos',
        collapseLeft   : 'Contraer el panel izquierdo',
        collapseRight  : 'Contraer el panel derecho',
        collapseTop    : 'Contraer el panel superior',
        collapseBottom : 'Contraer el panel inferior',
        expandLeft     : 'Expandir el panel izquierdo',
        expandRight    : 'Expandir el panel derecho',
        expandTop      : 'Expandir el panel superior',
        expandBottom   : 'Expandir el panel inferior'
    },

    TabPanel : {
        containsInvalidFields : 'La pestaña contiene campos no válidos'
    },

    Toolbar : {
        showOverflowingItems : 'Mostrar elementos desbordantes',
        scrollForMore        : 'Desplázate para más'
    },

    UndoRedo : {
        Undo           : 'Deshacer',
        Redo           : 'Rehacer',
        UndoLastAction : 'Deshacer la última acción',
        RedoLastAction : 'Rehacer la última acción deshecha',
        NoActions      : 'Sin elementos en la cola de deshacer'
    },

    FieldFilterPicker : {
        equals                 : 'equivale a',
        doesNotEqual           : 'no equivale a',
        isEmpty                : 'está vacío',
        isNotEmpty             : 'no está vacío',
        contains               : 'contiene',
        doesNotContain         : 'no contiene',
        startsWith             : 'empieza por',
        endsWith               : 'termina por',
        isOneOf                : 'es uno de',
        isNotOneOf             : 'no es uno de',
        isGreaterThan          : 'es mayor que',
        isLessThan             : 'es menor que',
        isGreaterThanOrEqualTo : 'es mayor que o igual a',
        isLessThanOrEqualTo    : 'es menor que o igual a',
        isBetween              : 'está entre',
        isNotBetween           : 'no está entre',
        isBefore               : 'es anterior',
        isAfter                : 'es posterior',
        timeEquals             : 'el tiempo es igual a',
        timeDoesNotEqual       : 'el tiempo no es igual a',
        isToday                : 'es hoy',
        isTomorrow             : 'es mañana',
        isYesterday            : 'fue ayer',
        isThisWeek             : 'es esta semana',
        isNextWeek             : 'es la semana que viene',
        isLastWeek             : 'fue la semana pasada',
        isThisMonth            : 'es este mes',
        isNextMonth            : 'es el mes que viene',
        isLastMonth            : 'fue el mes pasado',
        isThisYear             : 'es este año',
        isNextYear             : 'es el año que viene',
        isLastYear             : 'fue el año pasado',
        isYearToDate           : 'es el año hasta la fecha',
        isTrue                 : 'es cierto',
        isFalse                : 'es falso',
        selectAProperty        : 'Seleccionar una propiedad',
        selectAnOperator       : 'Seleccionar un operador',
        caseSensitive          : 'Diferencia entre mayúsculas y minúsculas',
        and                    : 'y',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Seleccione valor',
        selectOneOrMoreValues  : 'Seleccionar uno o más valores',
        enterAValue            : 'Introducir un valor',
        enterANumber           : 'Introducir un número',
        selectADate            : 'Seleccionar fecha',
        selectATime            : 'Seleccionar hora'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Añadir filtro',
        applyCond : applied => applied ? 'Omitir filtro (actualmente aplicado)' : 'Aplicar filtro (actualmente omitido)'
    },

    DateHelper : {
        locale         : 'es',
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
            { single : 'milisegundo', plural : 'ms', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'segundo', plural : 'segundos', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minuto', plural : 'minutos', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'hora', plural : 'horas', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'día', plural : 'días', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'semana', plural : 'semanas', abbrev : 'sem.' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'mes', plural : 'meses', abbrev : 'mes' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'trimestre', plural : 'trimestres', abbrev : 'trim.' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'año', plural : 'años', abbrev : 'a.' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'década', plural : 'décadas', abbrev : 'déc.' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil'],
            [],
            ['s', 'seg'],
            [],
            ['m', 'min'],
            [],
            ['h', 'hr'],
            [],
            ['d'],
            [],
            ['sem.', 'sem'],
            [],
            ['m', 'mes'],
            [],
            ['T', 'trim'],
            [],
            ['a', 'añ'],
            [],
            ['déc'],
            []
        ],
        parsers : {
            L   : 'DD/MM/YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '°',
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `década de ${year - (year % 10)}`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
