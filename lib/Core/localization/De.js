import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'De',
    localeDesc : 'Deutsch',
    localeCode : 'de-DE',
    localeRtl  : false,

    Object : {
        Yes      : 'Ja',
        No       : 'Nein',
        Cancel   : 'Abbrechen',
        Ok       : 'OK',
        Week     : 'Woche',
        None     : 'Keine',
        previous : 'Vorherige',
        next     : 'Nächste',
        to       : 'zu',
        at       : 'um',
        on       : 'auf',
        editing  : what => `Bearbeiten von ${what}`,
        settings : 'Einstellungen',
        close    : 'Schließen',
        go       : 'Gehen',
        save     : 'Speichern',
        cancel   : 'Abbrechen',
        revert   : 'Zurück',
        collapse : 'Zusammenklappen',
        expand   : 'Aufklappen',
        today    : 'Heute',
        andNMore : n => `und ${n} mehr`
    },

    AIBase : {
        delayStatusTexts : [
            'Warten',
            'Warten ...',
            'Noch warten',
            'Noch warten ...'
        ],
        autoStartDialogMessage        : 'Möchten Sie die KI-Sprachsteuerung aktivieren?',
        voiceActivationToast          : phrase => `Sprachsteuerung aktiviert, verwenden Sie den Ausdruck "${phrase}", um ein Gespräch zu beginnen`,
        voiceControlNotSupportedToast : 'Sprachsteuerung wird auf diesem Gerät nicht unterstützt',
        voiceControlErrorToast        : 'Sprachsteuerung konnte auf Ihrem Gerät nicht gestartet werden',
        voiceControlSilenceToast      : phrase => `KI-Gespräch wurde aufgrund von Stille beendet. Verwenden Sie den Ausdruck ${phrase}, um das Gespräch erneut zu starten`,
        noAudioDetected               : 'Kein Audio erkannt, bitte versuchen Sie es erneut',
        transcriptionErrorToast       : 'Transkription fehlgeschlagen, bitte versuchen Sie es erneut',
        playbackErrorToast            : 'Audiowiedergabe fehlgeschlagen, bitte überprüfen Sie Ihr Audioausgabegerät',
        failed                        : '(fehlgeschlagen)',
        awaitingConfirmation          : 'Warten auf Bestätigung',
        timeoutToast                  : 'Nachricht ist abgelaufen',
        readingStatusText             : modelName => `Lesen von ${modelName}s`,
        updatingStatusText            : modelName => `Aktualisieren von ${modelName}s`,
        removingStatusText            : modelName => `Entfernen von ${modelName}s`,
        addingStatusText              : modelName => `Hinzufügen von ${modelName}`,
        filteringStatusText           : modelName => `Filtern von ${modelName}s`,
        thinkingStatusText            : 'Denke nach',
        processingStatusText          : 'Verarbeitung'
    },

    AISettingsPanel : {
        highlight               : 'Hervorheben',
        verbosity               : 'Verbosität',
        voiceActivation         : 'Sprachaktivierung',
        enableVoiceActivation   : 'Sprachaktivierung aktivieren',
        voiceOnly               : 'Nur Stimme',
        autostart               : 'Automatischer Start',
        dataChangeConfirmations : 'Bestätigungen bei Datenänderungen',
        add                     : 'Hinzufügen',
        remove                  : 'Entfernen',
        update                  : 'Aktualisieren',
        planning                : 'Planung',
        enablePlanning          : 'Planung aktivieren',
        aiModel                 : 'KI-Modell',
        timeline                : 'Zeitleiste',
        'in-view'               : 'Im Blick',
        all                     : 'Alle',
        timeRangeContext        : 'Zeitrahmenkontext'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'KI spricht',
        recordingTooltip      : 'Aufnahme',
        waitingTooltip        : 'KI denkt',
        startRecordingTooltip : 'Klicken Sie, um zu starten',
        stopRecordingTooltip  : 'Klicken Sie, um zu stoppen',
        inactiveTooltip       : 'Nicht aufnehmend',
        openChatTooltip       : 'Rechtsklick, um den Chat zu öffnen'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Geben Sie eine Nachricht ein',
        noConnectionTooltip     : 'Keine Verbindung erkannt, klicken Sie, um es erneut zu versuchen',
        undone                  : 'rückgängig gemacht',
        aborted                 : '(abgebrochen)',
        readAloudTooltip        : 'Nachricht laut vorlesen',
        confidenceTooltip       : confidence => `Vertrauen: ${confidence}%`,
        undoTooltip             : 'Datenänderungen rückgängig machen',
        redoTooltip             : 'Datenänderungen wiederherstellen',
        thumbsUp                : 'Daumen hoch',
        thumbsDown              : 'Daumen runter',
        feedbackToast           : 'Vielen Dank für Ihr Feedback!',
        clearChat               : 'Chat löschen',
        closeChat               : 'Chat schließen',
        settings                : 'Einstellungen',
        closeSettings           : 'Einstellungen schließen'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Wählen Sie genau ${min}`,
        tooFewOptionsSelected     : min => `Wählen Sie mindestens ${min}`,
        tooManyOptionsSelected    : max => `Wählen Sie höchstens ${max}`
    },

    CodeEditor : {
        apply        : 'Anwenden',
        autoApply    : 'Automatisch anwenden',
        downloadCode : 'Code herunterladen'
    },

    ColorPicker : {
        noColor : 'Keine Farbe'
    },

    Combo : {
        noResults          : 'Keine Ergebnisse',
        recordNotCommitted : 'Datensatz konnte nicht hinzugefügt werden',
        addNewValue        : value => `Hinzufügen ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Hervorheben',
        preview         : 'Vorschau',
        approve         : 'Genehmigen',
        reject          : 'Ablehnen',
        confirmAdd      : 'Hinzufügen bestätigen:',
        confirmUpdate   : 'Aktualisierung bestätigen:',
        confirmRemove   : 'Entfernen bestätigen:',
        confirmCopy     : 'Kopieren bestätigen',
        confirmAssign   : 'Zuweisung bestätigen',
        confirmReassign : 'Neu zuweisen bestätigen',
        confirmUnassign : 'Zuweisung aufheben bestätigen',
        confirmLink     : 'Link bestätigen',
        confirmUnlink   : 'Verknüpfung bestätigen'
    },

    FilePicker : {
        file : 'Datei'
    },

    Field : {
        badInput              : 'Ungültiger Feldwert',
        patternMismatch       : 'Wert sollte einem bestimmten Muster entsprechen',
        rangeOverflow         : value => `Der Wert muss kleiner oder gleich ${value.max} sein`,
        rangeUnderflow        : value => `Der Wert muss größer oder gleich ${value.min} sein`,
        stepMismatch          : 'Der Wert sollte zum Schritt passen',
        tooLong               : 'Der Wert sollte kürzer sein',
        tooShort              : 'Wert sollte länger sein',
        typeMismatch          : 'Wert muss in einem speziellen Format vorliegen',
        valueMissing          : 'Dieses Feld ist erforderlich',
        invalidValue          : 'Ungültiger Feldwert',
        minimumValueViolation : 'Verletzung des Mindestwerts',
        maximumValueViolation : 'Verletzung des Maximalwerts',
        fieldRequired         : 'Dieses Feld ist erforderlich',
        validateFilter        : 'Wert muss aus der Liste ausgewählt werden'
    },

    DateField : {
        invalidDate : format => 'Ungültige Datumseingabe, das erwartete Format ist ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Zum vorherigen Jahr gehen',
        gotoPrevMonth : 'Zum vorherigen Monat gehen',
        gotoNextMonth : 'Zum nächsten Monat gehen',
        gotoNextYear  : 'Zum nächsten Jahr gehen',
        navigation    : 'Datumsauswahl-Navigation'
    },

    Hint : {
        dontShowAgain : 'Nicht mehr anzeigen'
    },

    NumberFormat : {
        locale   : 'de-DE',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Ungültige Einheit'
    },

    TimeField : {
        invalidTime : 'Ungültige Zeiteingabe'
    },

    TimePicker : {
        hour   : 'Stunde',
        minute : 'Minute',
        second : 'Sekunde'
    },

    Tooltip : {
        loading : 'Wird geladen...'
    },

    List : {
        loading   : 'Wird geladen...',
        selectAll : 'Alle auswählen'
    },

    GridBase : {
        loadMask : 'Wird geladen...',
        syncMask : 'Änderungen werden gespeichert, bitte warten...'
    },

    PagingToolbar : {
        firstPage         : 'Zur ersten Seite gehen',
        prevPage          : 'Zur vorherigen Seite gehen',
        page              : 'Seite',
        nextPage          : 'Zur nächsten Seite gehen',
        lastPage          : 'Zur letzten Seite gehen',
        reload            : 'Aktuelle Seite neu laden',
        noRecords         : 'Keine Datensätze anzuzeigen',
        pageCountTemplate : data => `von ${data.lastPage}`,
        summaryTemplate   : data => ` Datensätze anzeigen ${data.start} - ${data.end} von ${data.allCount}`
    },

    Popup : {
        close    : 'Popup schließen',
        maximize : 'Maximieren'
    },

    Splitter : {
        ariaLabel      : 'Splitter, verwenden Sie die Pfeiltasten, um die benachbarten Bereiche zu ändern',
        collapseLeft   : 'Linken Bereich einklappen',
        collapseRight  : 'Rechten Bereich einklappen',
        collapseTop    : 'Oberen Bereich einklappen',
        collapseBottom : 'Unteren Bereich einklappen',
        expandLeft     : 'Linken Bereich ausklappen',
        expandRight    : 'Rechten Bereich ausklappen',
        expandTop      : 'Oberen Bereich ausklappen',
        expandBottom   : 'Unteren Bereich ausklappen'
    },

    TabPanel : {
        containsInvalidFields : 'Tab enthält ungültige Felder'
    },

    Toolbar : {
        showOverflowingItems : 'Überlaufende Elemente anzeigen',
        scrollForMore        : 'Für mehr scrollen'
    },

    UndoRedo : {
        Undo           : 'Rückgängig machen',
        Redo           : 'Wiederholen',
        UndoLastAction : 'Letzte Aktion rückgängig machen',
        RedoLastAction : 'Letzte rückgängig gemachte Aktion wiederholen',
        NoActions      : 'Keine Einträge in der Rückgängig-Warteschlange'
    },

    FieldFilterPicker : {
        equals                 : 'ist gleich',
        doesNotEqual           : 'ist nicht gleich',
        isEmpty                : 'ist leer',
        isNotEmpty             : 'ist nicht leer',
        contains               : 'enthält',
        doesNotContain         : 'enthält nicht',
        startsWith             : 'beginnt mit',
        endsWith               : 'endet mit',
        isOneOf                : 'ist eins von',
        isNotOneOf             : 'ist nicht eins von',
        isGreaterThan          : 'ist größer als',
        isLessThan             : 'ist kleiner als',
        isGreaterThanOrEqualTo : 'ist größer oder gleich',
        isLessThanOrEqualTo    : 'ist kleiner oder gleich',
        isBetween              : 'ist zwischen',
        isNotBetween           : 'ist nicht zwischen',
        isBefore               : 'ist vor',
        isAfter                : 'ist nach',
        timeEquals             : 'Zeit ist gleich',
        timeDoesNotEqual       : 'Zeit ist nicht gleich',
        isToday                : 'ist heute',
        isTomorrow             : 'ist morgen',
        isYesterday            : 'ist gestern',
        isThisWeek             : 'ist diese Woche',
        isNextWeek             : 'ist nächste Woche',
        isLastWeek             : 'ist letzte Woche',
        isThisMonth            : 'ist dieser Monat',
        isNextMonth            : 'ist nächster Monat',
        isLastMonth            : 'ist letzter Monat',
        isThisYear             : 'ist dieses Jahr',
        isNextYear             : 'ist nächstes Jahr',
        isLastYear             : 'ist letztes Jahr',
        isYearToDate           : 'ist Jahr bis dato',
        isTrue                 : 'ist wahr',
        isFalse                : 'ist falsch',
        selectAProperty        : 'Eine Eigenschaft auswählen',
        selectAnOperator       : 'Einen Operator auswählen',
        caseSensitive          : 'Groß-/Kleinschreibung',
        and                    : 'und',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Wert auswählen',
        selectOneOrMoreValues  : 'Einen oder mehrere Wert(e) auswählen',
        enterAValue            : 'Einen Wert eingeben',
        enterANumber           : 'Eine Zahl eingeben',
        selectADate            : 'Ein Datum auswählen',
        selectATime            : 'Uhrzeit auswählen'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Filter hinzufügen',
        applyCond : applied => applied ? 'Filter überspringen (derzeit angewendet)' : 'Filter anwenden (derzeit übersprungen)'
    },

    DateHelper : {
        locale         : 'de-DE',
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
            { single : 'Millisekunde', plural : 'ms', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'Sekunde', plural : 'Sekunden', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'Minute', plural : 'Minuten', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'Stunde', plural : 'Stunden', abbrev : 'std' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'Tag', plural : 'Tage', abbrev : 't' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'Woche', plural : 'Wochen', abbrev : 'w' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'Monat', plural : 'Monate', abbrev : 'mon' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'Quartal', plural : 'Quartale', abbrev : 'q' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'Jahr', plural : 'Jahre', abbrev : 'yr' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'Jahrzehnt', plural : 'Jahrzehnte', abbrev : 'jahrz' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil'],
            [],
            ['s', 'sek'],
            [],
            ['m', 'min'],
            [],
            ['std', 'hr'],
            [],
            ['t'],
            [],
            ['w', 'wn'],
            [],
            ['mo', 'mon', 'mnt'],
            [],
            ['q', 'quar', 'qrt'],
            [],
            ['j', 'jr'],
            [],
            ['jahrz'],
            []
        ],
        parsers : {
            L   : 'DD.MM.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss'
        },
        ordinalSuffix : number => number + '.',
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}er`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
