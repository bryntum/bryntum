import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Ro',
    localeDesc : 'Română',
    localeCode : 'ro',
    localeRtl  : false,

    Object : {
        Yes      : 'Da',
        No       : 'Nu',
        Cancel   : 'Anulare',
        Ok       : 'OK',
        Week     : 'Săptămână',
        None     : 'Niciun',
        previous : 'Anterior',
        next     : 'Următor',
        to       : 'la',
        at       : 'la',
        on       : 'pe',
        editing  : what => `Editare ${what}`,
        settings : 'Setări',
        close    : 'Închide',
        go       : 'Du-te',
        save     : 'Salvează',
        cancel   : 'Anulează',
        revert   : 'Restaurează',
        collapse : 'Restrângere',
        expand   : 'Extindere',
        today    : 'Astăzi',
        andNMore : n => `și ${n} mai multe`
    },

    AIBase : {
        delayStatusTexts : [
            'Așteptare',
            'Așteptare ...',
            'Încă așteptare',
            'Încă așteptare ...'
        ],
        autoStartDialogMessage        : 'Doriți să activați activarea vocală AI?',
        voiceActivationToast          : phrase => `Activarea vocală este activată, utilizați expresia "${phrase}" pentru a începe o conversație`,
        voiceControlNotSupportedToast : 'Controlul vocal nu este acceptat pe acest dispozitiv',
        voiceControlErrorToast        : 'Controlul vocal nu a putut fi pornit pe dispozitivul dvs.',
        voiceControlSilenceToast      : phrase => `Conversația vocală AI s-a încheiat din cauza tăcerii. Utilizați expresia ${phrase} pentru a relua conversația`,
        noAudioDetected               : 'Nu s-a detectat audio, vă rugăm să încercați din nou',
        transcriptionErrorToast       : 'Transcrierea a eșuat, vă rugăm să încercați din nou',
        playbackErrorToast            : 'Redarea audio a eșuat, verificați dispozitivul de ieșire audio',
        failed                        : '(eșuat)',
        awaitingConfirmation          : 'Așteptare confirmare',
        timeoutToast                  : 'Mesajul a expirat',
        readingStatusText             : modelName => `Citire ${modelName}uri`,
        updatingStatusText            : modelName => `Actualizare ${modelName}uri`,
        removingStatusText            : modelName => `Eliminare ${modelName}uri`,
        addingStatusText              : modelName => `Adăugare ${modelName}`,
        filteringStatusText           : modelName => `Filtrare ${modelName}uri`,
        thinkingStatusText            : 'Gândire',
        processingStatusText          : 'Procesare'
    },

    AISettingsPanel : {
        highlight               : 'Evidențiază',
        verbosity               : 'Verbozitate',
        voiceActivation         : 'Activare vocală',
        enableVoiceActivation   : 'Activează activarea vocală',
        voiceOnly               : 'Doar voce',
        autostart               : 'Pornire automată',
        dataChangeConfirmations : 'Confirmări de modificare a datelor',
        add                     : 'Adaugă',
        remove                  : 'Elimină',
        update                  : 'Actualizează',
        planning                : 'Planificare',
        enablePlanning          : 'Activează planificarea',
        aiModel                 : 'Model AI',
        timeline                : 'Cronologie',
        'in-view'               : 'În vizualizare',
        all                     : 'Toate',
        timeRangeContext        : 'Contextul intervalului de timp'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI vorbește',
        recordingTooltip      : 'Înregistrare',
        waitingTooltip        : 'AI gândește',
        startRecordingTooltip : 'Faceți clic pentru a începe',
        stopRecordingTooltip  : 'Faceți clic pentru a opri',
        inactiveTooltip       : 'Nu se înregistrează',
        openChatTooltip       : 'Faceți clic dreapta pentru a deschide chatul'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Scrieți un mesaj',
        noConnectionTooltip     : 'Nu s-a detectat conexiune, faceți clic pentru a încerca din nou',
        undone                  : 'anulat',
        aborted                 : '(anulat)',
        readAloudTooltip        : 'Citiți mesajul cu voce tare',
        confidenceTooltip       : confidence => `Încredere: ${confidence}%`,
        undoTooltip             : 'Anulați modificările datelor',
        redoTooltip             : 'Refă modificările datelor',
        thumbsUp                : 'Aprob',
        thumbsDown              : 'Dezaprobat',
        feedbackToast           : 'Vă mulțumim pentru feedback!',
        clearChat               : 'Șterge conversația',
        closeChat               : 'Închide chatul',
        settings                : 'Setări',
        closeSettings           : 'Închide setările'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Selectați exact ${min}`,
        tooFewOptionsSelected     : min => `Selectați cel puțin ${min}`,
        tooManyOptionsSelected    : max => `Selectați cel mult ${max}`
    },

    CodeEditor : {
        apply        : 'Aplică',
        autoApply    : 'Aplicare automată',
        downloadCode : 'Descarcă codul'
    },

    ColorPicker : {
        noColor : 'Fără culoare'
    },

    Combo : {
        noResults          : 'Niciun rezultat',
        recordNotCommitted : 'Nu s-a putut adăuga înregistrarea',
        addNewValue        : value => `Adăuga ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Evidențiază',
        preview         : 'Previzualizare',
        approve         : 'Aprobați',
        reject          : 'Respingeți',
        confirmAdd      : 'Confirmați adăugarea:',
        confirmUpdate   : 'Confirmați actualizarea:',
        confirmRemove   : 'Confirmați eliminarea:',
        confirmCopy     : 'Confirmați copierea',
        confirmAssign   : 'Confirmați atribuirea',
        confirmReassign : 'Confirmați realocarea',
        confirmUnassign : 'Confirmați dezatribuirea',
        confirmLink     : 'Confirmă legătura',
        confirmUnlink   : 'Confirmă deconectarea'
    },

    FilePicker : {
        file : 'Fișier'
    },

    Field : {
        badInput              : 'Valoare câmp nevalidă',
        patternMismatch       : 'Valoarea trebuie să se potrivească cu un șablon specific',
        rangeOverflow         : value => `Valoarea trebuie să fie mai mică sau egală cu ${value.max}`,
        rangeUnderflow        : value => `Valoarea trebuie să fie mai mare sau egală cu ${value.min}`,
        stepMismatch          : 'Valoarea trebuie să se potrivească cu pasul',
        tooLong               : 'Valoarea trebuie să fie mai scurtă',
        tooShort              : 'Valoarea trebuie să fie mai lungă',
        typeMismatch          : 'Valoarea trebuie să fie într-un format special',
        valueMissing          : 'Acest câmp este obligatoriu',
        invalidValue          : 'Valoare câmp nevalidă',
        minimumValueViolation : 'Încălcare a valorii minime',
        maximumValueViolation : 'Încălcare a valorii maxime',
        fieldRequired         : 'Acest câmp este obligatoriu',
        validateFilter        : 'Valoarea trebuie selectată din listă'
    },

    DateField : {
        invalidDate : format => 'Intrare dată invalidă, formatul așteptat este ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Mergeți la anul anterior',
        gotoPrevMonth : 'Mergeți la luna anterioară',
        gotoNextMonth : 'Mergeți la luna următoare',
        gotoNextYear  : 'Mergeți la anul următor',
        navigation    : 'Navigare selector de dată'
    },

    Hint : {
        dontShowAgain : 'Nu mai arăta'
    },

    NumberFormat : {
        locale   : 'ro',
        currency : 'RON'
    },

    DurationField : {
        invalidUnit : 'Unitate nevalidă'
    },

    TimeField : {
        invalidTime : 'Oră nevalidă introdusă'
    },

    TimePicker : {
        hour   : 'Oră',
        minute : 'Minut',
        second : 'Secunda'
    },

    Tooltip : {
        loading : 'Se încarcă...'
    },

    List : {
        loading   : 'Se încarcă...',
        selectAll : 'Selectează tot'
    },

    GridBase : {
        loadMask : 'Se încarcă...',
        syncMask : 'Se salvează modificările, vă rugăm așteptați...'
    },

    PagingToolbar : {
        firstPage         : 'Mergeți la prima pagină',
        prevPage          : 'Mergeți la pagina anterioară',
        page              : 'Pagina',
        nextPage          : 'Mergeți la pagina următoare',
        lastPage          : 'Mergeți la ultima pagină',
        reload            : 'Reîncărcare pagină curentă',
        noRecords         : 'Nicio înregistrare de afișat',
        pageCountTemplate : data => `din${data.lastPage}`,
        summaryTemplate   : data => `Se afișează înregistrările ${data.start} - ${data.end} din ${data.allCount}`
    },

    Popup : {
        close    : 'Închidere popup',
        maximize : 'Maximizează'
    },

    Splitter : {
        ariaLabel      : 'Separator, utilizați tastele săgeată pentru a redimensiona panourile vecine',
        collapseLeft   : 'Restrânge panoul din stânga',
        collapseRight  : 'Restrânge panoul din dreapta',
        collapseTop    : 'Restrânge panoul de sus',
        collapseBottom : 'Restrânge panoul de jos',
        expandLeft     : 'Extinde panoul din stânga',
        expandRight    : 'Extinde panoul din dreapta',
        expandTop      : 'Extinde panoul de sus',
        expandBottom   : 'Extinde panoul de jos'
    },

    TabPanel : {
        containsInvalidFields : 'Fila conține câmpuri nevalide'
    },

    Toolbar : {
        showOverflowingItems : 'Afișați elementele debordante',
        scrollForMore        : 'Derulați pentru mai multe'
    },

    UndoRedo : {
        Undo           : 'Anulare',
        Redo           : 'Refacere',
        UndoLastAction : 'Anulați ultima acțiune',
        RedoLastAction : 'Refaceți ultima acțiune anulată',
        NoActions      : 'Niciun element în coada de anulare'
    },

    FieldFilterPicker : {
        equals                 : 'egal',
        doesNotEqual           : 'nu este egal',
        isEmpty                : 'este gol',
        isNotEmpty             : 'nu este gol',
        contains               : 'conține',
        doesNotContain         : 'nu conține',
        startsWith             : 'începe cu',
        endsWith               : 'se termină cu',
        isOneOf                : 'face parte din',
        isNotOneOf             : 'nu face parte din',
        isGreaterThan          : 'este mai mare de',
        isLessThan             : 'este mai mic de',
        isGreaterThanOrEqualTo : 'este mai mare sau egal cu',
        isLessThanOrEqualTo    : 'este mai mic sau egal cu',
        isBetween              : 'este între',
        isNotBetween           : 'nu este între',
        isBefore               : 'este înainte',
        isAfter                : 'este după',
        timeEquals             : 'timpul este egal',
        timeDoesNotEqual       : 'timpul nu este egal',
        isToday                : 'este azi',
        isTomorrow             : 'este mâine',
        isYesterday            : 'este ieri',
        isThisWeek             : 'este săptămâna aceasta',
        isNextWeek             : 'este săptămâna viitoare',
        isLastWeek             : 'este săptămâna trecută',
        isThisMonth            : 'este luna aceasta',
        isNextMonth            : 'este luna viitoare',
        isLastMonth            : 'este luna trecută',
        isThisYear             : 'este acest an',
        isNextYear             : 'este anul viitor',
        isLastYear             : 'este anul trecut',
        isYearToDate           : 'este anul acesta, până în prezent',
        isTrue                 : 'este adevărat',
        isFalse                : 'este fals',
        selectAProperty        : 'Selectați o proprietate',
        selectAnOperator       : 'Selectați un operator',
        caseSensitive          : 'Sensibil la litere mari şi mici',
        and                    : 'și',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Selectați valoare',
        selectOneOrMoreValues  : 'Selectați una sau mai multe valori',
        enterAValue            : 'Introduceți o valoare',
        enterANumber           : 'Introduceți un număr',
        selectADate            : 'Selectați o dată',
        selectATime            : 'Selectați ora'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Adăugați filtru',
        applyCond : applied => applied ? 'Omitere filtru (în prezent aplicat)' : 'Aplicare filtru (în prezent omis)'
    },

    DateHelper : {
        locale         : 'ro',
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
            { single : 'millisecundă', plural : 'ms', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'secundă', plural : 'secunde', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minut', plural : 'minute', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'oră', plural : 'ore', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'zi', plural : 'zile', abbrev : 'z' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'săptămână', plural : 'săptămâni', abbrev : 's' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'lună', plural : 'luni', abbrev : 'lu' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'trimestru', plural : 'trimestre', abbrev : 't' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'an', plural : 'ani', abbrev : 'an' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'decadă', plural : 'decade', abbrev : 'dec' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['ms'],
            [],
            ['s', 'sec'],
            [],
            ['m', 'min'],
            [],
            ['h', 'h'],
            [],
            ['z'],
            [],
            ['s', 's'],
            [],
            ['lu', 'lun'],
            [],
            ['t', 'trim'],
            [],
            ['a', 'a'],
            [],
            ['dec'],
            []
        ],
        parsers : {
            L   : 'DD.MM.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : (number, unit) => {
            let prefix = { 1 : '' }[number] || 'a ';
            let suffix = '-a';
            //Yo not used so far but legit to think it could
            if (unit === 'Qo' || unit === 'Yo') {
                prefix = { 1 : '' }[number] || 'al ';
                suffix = { 1 : '-ul' }[number] || '-lea';
            }
            return prefix + number + suffix;
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `anii ${year - (year % 10)}`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
