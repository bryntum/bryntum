import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'It',
    localeDesc : 'Italiano',
    localeCode : 'it',
    localeRtl  : false,

    Object : {
        Yes      : 'Sì',
        No       : 'No',
        Cancel   : 'Annulla',
        Ok       : 'OK',
        Week     : 'Settimana',
        None     : 'Nessuno',
        previous : 'Precedente',
        next     : 'Successivo',
        to       : 'a',
        at       : 'alle',
        on       : 'su',
        editing  : what => `Modifica ${what}`,
        settings : 'Impostazioni',
        close    : 'Chiudi',
        go       : 'Vai',
        save     : 'Salva',
        cancel   : 'Annulla',
        revert   : 'Ripristinare',
        collapse : 'Comprimi',
        expand   : 'Espandi',
        today    : 'Oggi',
        andNMore : n => `e ${n} altri`
    },

    AIBase : {
        delayStatusTexts : [
            'In attesa',
            'In attesa ...',
            'Ancora in attesa',
            'Ancora in attesa ...'
        ],
        autoStartDialogMessage        : "Vuoi abilitare l'attivazione vocale dell'IA?",
        voiceActivationToast          : phrase => `Attivazione vocale abilitata, usa la frase "${phrase}" per avviare una conversazione`,
        voiceControlNotSupportedToast : 'Il controllo vocale non è supportato su questo dispositivo',
        voiceControlErrorToast        : 'Il controllo vocale non può essere avviato sul tuo dispositivo',
        voiceControlSilenceToast      : phrase => `La conversazione vocale con l'IA è terminata a causa del silenzio. Usa la frase ${phrase} per riavviare la conversazione`,
        noAudioDetected               : 'Nessun audio rilevato, per favore riprova',
        transcriptionErrorToast       : 'Trascrizione fallita, per favore riprova',
        playbackErrorToast            : 'Riproduzione audio fallita, controlla il tuo dispositivo di output audio',
        failed                        : '(fallito)',
        awaitingConfirmation          : 'In attesa di conferma',
        timeoutToast                  : 'Messaggio scaduto',
        readingStatusText             : modelName => `Lettura di ${modelName}s`,
        updatingStatusText            : modelName => `Aggiornamento di ${modelName}s`,
        removingStatusText            : modelName => `Rimozione di ${modelName}s`,
        addingStatusText              : modelName => `Aggiunta di ${modelName}`,
        filteringStatusText           : modelName => `Filtraggio di ${modelName}s`,
        thinkingStatusText            : 'Riflessione',
        processingStatusText          : 'Elaborazione'
    },

    AISettingsPanel : {
        highlight               : 'Evidenzia',
        verbosity               : 'Verbosità',
        voiceActivation         : 'Attivazione vocale',
        enableVoiceActivation   : 'Abilita attivazione vocale',
        voiceOnly               : 'Solo voce',
        autostart               : 'Avvio automatico',
        dataChangeConfirmations : 'Conferma modifica dati',
        add                     : 'Aggiungi',
        remove                  : 'Rimuovi',
        update                  : 'Aggiorna',
        planning                : 'Pianificazione',
        enablePlanning          : 'Abilita pianificazione',
        aiModel                 : 'Modello AI',
        timeline                : 'Cronologia',
        'in-view'               : 'In vista',
        all                     : 'Tutti',
        timeRangeContext        : "Contesto dell'intervallo di tempo"
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : "L'IA sta parlando",
        recordingTooltip      : 'Registrazione',
        waitingTooltip        : "L'IA sta pensando",
        startRecordingTooltip : 'Clicca per iniziare',
        stopRecordingTooltip  : 'Clicca per fermare',
        inactiveTooltip       : 'Non in registrazione',
        openChatTooltip       : 'Clicca con il tasto destro per aprire la chat'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Scrivi un messaggio',
        noConnectionTooltip     : 'Nessuna connessione rilevata, clicca per riprovare',
        undone                  : 'annullato',
        aborted                 : '(interrotto)',
        readAloudTooltip        : 'Leggi il messaggio ad alta voce',
        confidenceTooltip       : confidence => `Fiducia: ${confidence}%`,
        undoTooltip             : 'Annulla le modifiche ai dati',
        redoTooltip             : 'Ripristina le modifiche ai dati',
        thumbsUp                : 'Pollice in su',
        thumbsDown              : 'Pollice in giù',
        feedbackToast           : 'Grazie per il tuo feedback!',
        clearChat               : 'Cancella chat',
        closeChat               : 'Chiudi chat',
        settings                : 'Impostazioni',
        closeSettings           : 'Chiudi impostazioni'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Seleziona esattamente ${min}`,
        tooFewOptionsSelected     : min => `Seleziona almeno ${min}`,
        tooManyOptionsSelected    : max => `Seleziona non più di ${max}`
    },

    CodeEditor : {
        apply        : 'Applica',
        autoApply    : 'Applica automaticamente',
        downloadCode : 'Scarica codice'
    },

    ColorPicker : {
        noColor : 'Nessun colore'
    },

    Combo : {
        noResults          : 'Nessun risultato',
        recordNotCommitted : 'Non è stato possibile aggiungere il record',
        addNewValue        : value => `Aggiungi ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Evidenzia',
        preview         : 'Anteprima',
        approve         : 'Approva',
        reject          : 'Rifiuta',
        confirmAdd      : 'Conferma aggiunta:',
        confirmUpdate   : 'Conferma aggiornamento:',
        confirmRemove   : 'Conferma rimozione:',
        confirmCopy     : 'Conferma copia',
        confirmAssign   : 'Conferma assegnazione',
        confirmReassign : 'Conferma riassegnazione',
        confirmUnassign : 'Conferma disassegnazione',
        confirmLink     : 'Conferma collegamento',
        confirmUnlink   : 'Conferma scollegamento'
    },

    FilePicker : {
        file : 'File'
    },

    Field : {
        badInput              : 'Valore del campo non valido',
        patternMismatch       : 'Il valore deve corrispondere a un modello specifico',
        rangeOverflow         : value => `Il valore deve essere uguale o inferiore a ${value.max}`,
        rangeUnderflow        : value => `Il valore deve essere uguale o superiore a ${value.min}`,
        stepMismatch          : 'Il valore deve adattarsi al passo',
        tooLong               : 'Il valore deve essere più breve',
        tooShort              : 'Il valore deve essere più lungo',
        typeMismatch          : 'Il valore deve essere in un formato speciale',
        valueMissing          : 'Questo campo è obbligatorio',
        invalidValue          : 'Valore del campo non valido',
        minimumValueViolation : 'Violazione del valore minimo',
        maximumValueViolation : 'Violazione del valore massimo',
        fieldRequired         : 'Questo campo è obbligatorio',
        validateFilter        : 'Il valore deve essere selezionato dall’elenco'
    },

    DateField : {
        invalidDate : format => 'Input data non valido, il formato previsto è ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Vai all’anno precedente',
        gotoPrevMonth : 'Vai al mese precedente',
        gotoNextMonth : 'Vai al mese successivo',
        gotoNextYear  : 'Vai all’anno successivo',
        navigation    : 'Navigazione del selettore di data'
    },

    Hint : {
        dontShowAgain : 'Non mostrare più'
    },

    NumberFormat : {
        locale   : 'it',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Unità non valida'
    },

    TimeField : {
        invalidTime : 'Inserimento ora non valido'
    },

    TimePicker : {
        hour   : 'Ora',
        minute : 'Minuto',
        second : 'Secondo'
    },

    Tooltip : {
        loading : 'Caricamento...'
    },

    List : {
        loading   : 'Caricamento...',
        selectAll : 'Seleziona tutto'
    },

    GridBase : {
        loadMask : 'Caricamento...',
        syncMask : 'Salvataggio delle modifiche, attendere prego...'
    },

    PagingToolbar : {
        firstPage         : 'Vai alla prima pagina',
        prevPage          : 'Vai alla pagina precedente',
        page              : 'Pagina',
        nextPage          : 'Vai alla pagina successiva',
        lastPage          : 'Vai all’ultima pagina',
        reload            : 'Ricarica la pagina corrente',
        noRecords         : 'Nessun record da visualizzare',
        pageCountTemplate : data => `di ${data.lastPage}`,
        summaryTemplate   : data => `Visualizzazione record ${data.start} - ${data.end} di ${data.allCount}`
    },

    Popup : {
        close    : 'Chiudi popup',
        maximize : 'Massimizza'
    },

    Splitter : {
        ariaLabel      : 'Splitter, usa i tasti freccia per ridimensionare i pannelli adiacenti',
        collapseLeft   : 'Comprimi il pannello sinistro',
        collapseRight  : 'Comprimi il pannello destro',
        collapseTop    : 'Comprimi il pannello superiore',
        collapseBottom : 'Comprimi il pannello inferiore',
        expandLeft     : 'Espandi il pannello sinistro',
        expandRight    : 'Espandi il pannello destro',
        expandTop      : 'Espandi il pannello superiore',
        expandBottom   : 'Espandi il pannello inferiore'
    },

    TabPanel : {
        containsInvalidFields : 'La scheda contiene campi non validi'
    },

    Toolbar : {
        showOverflowingItems : 'Mostra elementi traboccanti',
        scrollForMore        : 'Scorri per di più'
    },

    UndoRedo : {
        Undo           : 'Annulla',
        Redo           : 'Ripeti',
        UndoLastAction : 'Annulla l’ultima azione',
        RedoLastAction : 'Ripeti l’ultima azione annullata',
        NoActions      : 'Nessun elemento nella coda di annullamento'
    },

    FieldFilterPicker : {
        equals                 : 'uguale',
        doesNotEqual           : 'non uguale',
        isEmpty                : 'è vuoto',
        isNotEmpty             : 'non è vuoto',
        contains               : 'contiene',
        doesNotContain         : 'non contiene',
        startsWith             : 'inizia con',
        endsWith               : 'finisce con',
        isOneOf                : 'è uno di',
        isNotOneOf             : 'non è uno di',
        isGreaterThan          : 'è maggiore di',
        isLessThan             : 'è minore di',
        isGreaterThanOrEqualTo : 'è maggiore o uguale a',
        isLessThanOrEqualTo    : 'è minore o uguale a',
        isBetween              : 'è tra',
        isNotBetween           : 'non è tra',
        isBefore               : 'è prima',
        isAfter                : 'è dopo',
        timeEquals             : 'il tempo è uguale',
        timeDoesNotEqual       : 'il tempo non è uguale',
        isToday                : 'è oggi',
        isTomorrow             : 'è domani',
        isYesterday            : 'è ieri',
        isThisWeek             : 'è questa settimana',
        isNextWeek             : 'è la prossima settimana',
        isLastWeek             : 'è la settimana scorsa',
        isThisMonth            : 'è questo mese',
        isNextMonth            : 'è il prossimo mese',
        isLastMonth            : 'è il mese scorso',
        isThisYear             : "è quest'anno",
        isNextYear             : "è l'anno prossimo",
        isLastYear             : "è l'anno scorso",
        isYearToDate           : "è nell'ultimo anno",
        isTrue                 : 'è vero',
        isFalse                : 'è falso',
        selectAProperty        : 'Seleziona una proprietà',
        selectAnOperator       : 'Seleziona un operatore',
        caseSensitive          : 'Distingue tra maiuscole e minuscole',
        and                    : 'e',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Seleziona un valore',
        selectOneOrMoreValues  : 'Seleziona uno o più valori',
        enterAValue            : 'Inserisci un valore',
        enterANumber           : 'Inserisci un numero',
        selectADate            : 'Seleziona una data',
        selectATime            : 'Seleziona ora'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Aggiungi filtro',
        applyCond : applied => applied ? 'Salta filtro (attualmente applicato)' : 'Applica filtro (attualmente saltato)'
    },

    DateHelper : {
        locale         : 'it',
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
            { single : 'millisecondo', plural : 'millisecondi', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'secondo', plural : 'secondi', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minuto', plural : 'minuti', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'ora', plural : 'ore', abbrev : 'o' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'giorno', plural : 'giorni', abbrev : 'g' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'settimana', plural : 'settimane', abbrev : 'sett' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'mese', plural : 'mesi', abbrev : 'm' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'trimestre', plural : 'trimestri', abbrev : 'trim' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'anno', plural : 'anni', abbrev : 'a' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'decennio', plural : 'decenni', abbrev : 'dec' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil'],
            [],
            ['s', 's'],
            [],
            ['m', 'm'],
            [],
            ['o', 'o'],
            [],
            ['gg'],
            [],
            ['sett', 'sett'],
            [],
            ['m', 'm'],
            [],
            ['trim', 'trim'],
            [],
            ['a', 'a'],
            [],
            ['dec'],
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
            return `Anni ${year - (year % 10)}`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
