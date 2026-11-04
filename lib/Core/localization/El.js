import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'El',
    localeDesc : 'Ελληνικά',
    localeCode : 'el',
    localeRtl  : false,

    Object : {
        Yes      : 'Ναι',
        No       : 'Όχι',
        Cancel   : 'Ακύρωση',
        Ok       : 'ΟΚ',
        Week     : 'Εβδομάδα',
        None     : 'Κανένα',
        previous : 'Προηγούμενο',
        next     : 'Επόμενο',
        to       : 'σε',
        at       : 'στο',
        on       : 'επάνω',
        editing  : what => `Επεξεργασία ${what}`,
        settings : 'Ρυθμίσεις',
        close    : 'Κλείσιμο',
        go       : 'Πήγαινε',
        save     : 'Αποθήκευση',
        cancel   : 'Ακύρωση',
        revert   : 'Επαναφορά',
        collapse : 'Σύμπτυξη',
        expand   : 'Ανάπτυξη',
        today    : 'Σήμερα',
        andNMore : n => `και ${n} περισσότερα`
    },

    AIBase : {
        delayStatusTexts : [
            'Αναμονή',
            'Αναμονή ...',
            'Ακόμα σε αναμονή',
            'Ακόμα σε αναμονή ...'
        ],
        autoStartDialogMessage        : 'Θέλετε να ενεργοποιήσετε την ενεργοποίηση φωνής AI;',
        voiceActivationToast          : phrase => `Η φωνητική ενεργοποίηση ενεργοποιήθηκε, χρησιμοποιήστε τη φράση "${phrase}" για να ξεκινήσετε μια συνομιλία`,
        voiceControlNotSupportedToast : 'Ο φωνητικός έλεγχος δεν υποστηρίζεται σε αυτήν τη συσκευή',
        voiceControlErrorToast        : 'Ο φωνητικός έλεγχος δεν μπόρεσε να ξεκινήσει στη συσκευή σας',
        voiceControlSilenceToast      : phrase => `Η φωνητική συνομιλία AI τερματίστηκε λόγω σιωπής. Χρησιμοποιήστε τη φράση ${phrase} για να επανεκκινήσετε τη συνομιλία`,
        noAudioDetected               : 'Δεν εντοπίστηκε ήχος, παρακαλώ δοκιμάστε ξανά',
        transcriptionErrorToast       : 'Η μεταγραφή απέτυχε, παρακαλώ δοκιμάστε ξανά',
        playbackErrorToast            : 'Η αναπαραγωγή ήχου απέτυχε, παρακαλώ ελέγξτε τη συσκευή εξόδου ήχου σας',
        failed                        : '(απέτυχε)',
        awaitingConfirmation          : 'Αναμονή επιβεβαίωσης',
        timeoutToast                  : 'Το μήνυμα έληξε',
        readingStatusText             : modelName => `Ανάγνωση ${modelName}s`,
        updatingStatusText            : modelName => `Ενημέρωση ${modelName}s`,
        removingStatusText            : modelName => `Αφαίρεση ${modelName}s`,
        addingStatusText              : modelName => `Προσθήκη ${modelName}`,
        filteringStatusText           : modelName => `Φιλτράρισμα ${modelName}s`,
        thinkingStatusText            : 'Σκέψη',
        processingStatusText          : 'Επεξεργασία'
    },

    AISettingsPanel : {
        highlight               : 'Επισήμανση',
        verbosity               : 'Λεπτομέρεια',
        voiceActivation         : 'Ενεργοποίηση Φωνής',
        enableVoiceActivation   : 'Ενεργοποίηση Φωνητικής Ενεργοποίησης',
        voiceOnly               : 'Μόνο Φωνή',
        autostart               : 'Αυτόματη Εκκίνηση',
        dataChangeConfirmations : 'Επιβεβαίωση Αλλαγής Δεδομένων',
        add                     : 'Προσθήκη',
        remove                  : 'Αφαίρεση',
        update                  : 'Ενημέρωση',
        planning                : 'Σχεδιασμός',
        enablePlanning          : 'Ενεργοποίηση σχεδιασμού',
        aiModel                 : 'Μοντέλο AI',
        timeline                : 'Χρονολόγιο',
        'in-view'               : 'Στην προβολή',
        all                     : 'Όλα',
        timeRangeContext        : 'Πλαίσιο χρονικού εύρους'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'Η AI μιλάει',
        recordingTooltip      : 'Καταγραφή',
        waitingTooltip        : 'Η AI σκέφτεται',
        startRecordingTooltip : 'Κάντε κλικ για να ξεκινήσετε',
        stopRecordingTooltip  : 'Κάντε κλικ για να σταματήσετε',
        inactiveTooltip       : 'Δεν καταγράφεται',
        openChatTooltip       : 'Κάντε δεξί κλικ για να ανοίξετε τη συνομιλία'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Πληκτρολογήστε ένα μήνυμα',
        noConnectionTooltip     : 'Δεν ανιχνεύθηκε σύνδεση, κάντε κλικ για να δοκιμάσετε ξανά',
        undone                  : 'αναίρεση',
        aborted                 : '(ακυρώθηκε)',
        readAloudTooltip        : 'Ανάγνωση μηνύματος δυνατά',
        confidenceTooltip       : confidence => `Εμπιστοσύνη: ${confidence}%`,
        undoTooltip             : 'Αναίρεση αλλαγών δεδομένων',
        redoTooltip             : 'Επαναφορά αλλαγών δεδομένων',
        thumbsUp                : 'Μου αρέσει',
        thumbsDown              : 'Δεν μου αρέσει',
        feedbackToast           : 'Ευχαριστούμε για την ανατροφοδότηση σας!',
        clearChat               : 'Καθαρισμός Συνομιλίας',
        closeChat               : 'Κλείσιμο συνομιλίας',
        settings                : 'Ρυθμίσεις',
        closeSettings           : 'Κλείσιμο Ρυθμίσεων'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Επιλέξτε ακριβώς ${min}`,
        tooFewOptionsSelected     : min => `Επιλέξτε τουλάχιστον ${min}`,
        tooManyOptionsSelected    : max => `Επιλέξτε το πολύ ${max}`
    },

    CodeEditor : {
        apply        : 'Εφαρμογή',
        autoApply    : 'Αυτόματη εφαρμογή',
        downloadCode : 'Λήψη κώδικα'
    },

    ColorPicker : {
        noColor : 'Χωρίς χρώμα'
    },

    Combo : {
        noResults          : 'Κανένα αποτέλεσμα',
        recordNotCommitted : 'Δεν είναι δυνατή η προσθήκη της εγγραφής',
        addNewValue        : value => `Προσθήκη ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Επισήμανση',
        preview         : 'Προεπισκόπηση',
        approve         : 'Έγκριση',
        reject          : 'Απόρριψη',
        confirmAdd      : 'Επιβεβαίωση προσθήκης:',
        confirmUpdate   : 'Επιβεβαίωση ενημέρωσης:',
        confirmRemove   : 'Επιβεβαίωση αφαίρεσης:',
        confirmCopy     : 'Επιβεβαίωση αντιγραφής',
        confirmAssign   : 'Επιβεβαίωση ανάθεσης',
        confirmReassign : 'Επιβεβαίωση επανα-ανάθεσης',
        confirmUnassign : 'Επιβεβαίωση απο-ανάθεσης',
        confirmLink     : 'Επιβεβαίωση συνδέσμου',
        confirmUnlink   : 'Επιβεβαίωση αποσύνδεσης'
    },

    FilePicker : {
        file : 'Αρχείο'
    },

    Field : {
        badInput              : 'Μη έγκυρη τιμή πεδίου',
        patternMismatch       : 'Η τιμή πρέπει να ακολουθεί ένα συγκεκριμένο μοτίβο',
        rangeOverflow         : value => `Η τιμή πρέπει να είναι μικρότερη από ή ίση με ${value.max}`,
        rangeUnderflow        : value => `Η τιμή πρέπει να είναι μεγαλύτερη από ή ίση με ${value.min}`,
        stepMismatch          : 'Η τιμή πρέπει να ταιριάζει με το βήμα',
        tooLong               : 'Η τιμή πρέπει να είναι μικρότερη',
        tooShort              : 'Η τιμή πρέπει να είναι μεγαλύτερη',
        typeMismatch          : 'Η τιμή πρέπει να έχει συγκεκριμένη μορφή',
        valueMissing          : 'Το συγκεκριμένο πεδίο είναι υποχρεωτικό',
        invalidValue          : 'Μη έγκυρη τιμή πεδίου',
        minimumValueViolation : 'Παραβίαση ως προς την ελάχιστη τιμή',
        maximumValueViolation : 'Παραβίαση ως προς τη μέγιστη τιμή',
        fieldRequired         : 'Το συγκεκριμένο πεδίο είναι υποχρεωτικό',
        validateFilter        : 'Η τιμή πρέπει να επιλεγεί από τη λίστα'
    },

    DateField : {
        invalidDate : format => 'Μη έγκυρη εισαγωγή ημερομηνίας, η αναμενόμενη μορφή είναι ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Μετάβαση στο προηγούμενο έτος',
        gotoPrevMonth : 'Μετάβαση στον προηγούμενο μήνα',
        gotoNextMonth : 'Μετάβαση στον επόμενο μήνα',
        gotoNextYear  : 'Μετάβαση στο επόμενο έτος',
        navigation    : 'Πλοήγηση επιλογέα ημερομηνίας'
    },

    Hint : {
        dontShowAgain : 'Μην εμφανίσετε ξανά'
    },

    NumberFormat : {
        locale   : 'el',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Μη έγκυρη μονάδα'
    },

    TimeField : {
        invalidTime : 'Μη έγκυρη είσοδος ώρα'
    },

    TimePicker : {
        hour   : 'Ώρες',
        minute : 'Λεπτά',
        second : 'Δευτερόλεπτο'
    },

    Tooltip : {
        loading : 'Φόρτωση...'
    },

    List : {
        loading   : 'Φορτώνει...',
        selectAll : 'Επιλογή όλων'
    },

    GridBase : {
        loadMask : 'Φορτώνει...',
        syncMask : 'Αποθήκευση αλλαγών, παρακαλώ περιμένετε...'
    },

    PagingToolbar : {
        firstPage         : 'Μετάβαση στην πρώτη σελίδα',
        prevPage          : 'Μετάβαση στην προηγούμενη σελίδα',
        page              : 'Σελίδα',
        nextPage          : 'Μετάβαση στην επόμενη σελίδα',
        lastPage          : 'Μετάβαση στην τελευταία σελίδα',
        reload            : 'Επαναφόρτωση της τρέχουσας σελίδας',
        noRecords         : 'Δεν υπάρχουν καταγραφές',
        pageCountTemplate : data => `από ${data.lastPage}`,
        summaryTemplate   : data => `Εμφάνιση καταγραφών ${data.start} - ${data.end} από ${data.allCount}`
    },

    Popup : {
        close    : 'Κλείσιμο Αναδυόμενου Παραθύρου',
        maximize : 'Μεγιστοποίηση'
    },

    Splitter : {
        ariaLabel      : 'Διαχωριστής, χρησιμοποιήστε τα πλήκτρα βέλους για να αλλάξετε το μέγεθος των γειτονικών πλαισίων',
        collapseLeft   : 'Σύμπτυξη αριστερού πλαισίου',
        collapseRight  : 'Σύμπτυξη δεξιού πλαισίου',
        collapseTop    : 'Σύμπτυξη πάνω πλαισίου',
        collapseBottom : 'Σύμπτυξη κάτω πλαισίου',
        expandLeft     : 'Ανάπτυξη αριστερού πλαισίου',
        expandRight    : 'Ανάπτυξη δεξιού πλαισίου',
        expandTop      : 'Ανάπτυξη πάνω πλαισίου',
        expandBottom   : 'Ανάπτυξη κάτω πλαισίου'
    },

    TabPanel : {
        containsInvalidFields : 'Η καρτέλα περιέχει μη έγκυρα πεδία'
    },

    Toolbar : {
        showOverflowingItems : 'Εμφάνιση υπερχείλισης αντικειμένων',
        scrollForMore        : 'Κάντε κύλιση για περισσότερα'
    },

    UndoRedo : {
        Undo           : 'Αναίρεση',
        Redo           : 'Επανάληψη',
        UndoLastAction : 'Αναίρεση της τελευταίας ενέργειας',
        RedoLastAction : 'Επανάληψη της τελευταίας αναιρεμένης ενέργειας',
        NoActions      : 'Δεν υπάρχουν αντικείμενα στην ουρά αναίρεσης'
    },

    FieldFilterPicker : {
        equals                 : 'ισούται με',
        doesNotEqual           : 'δεν ισούται με',
        isEmpty                : 'είναι κενό',
        isNotEmpty             : 'δεν είναι κενό',
        contains               : 'περιέχει',
        doesNotContain         : 'δεν περιέχει',
        startsWith             : 'αρχίζει με',
        endsWith               : 'τελειώνει με',
        isOneOf                : 'είναι ένα από',
        isNotOneOf             : 'δεν είναι ένα από',
        isGreaterThan          : 'είναι μεγαλύτερο από',
        isLessThan             : 'είναι μικρότερο από',
        isGreaterThanOrEqualTo : 'είναι μεγαλύτερο από ή ίσο με',
        isLessThanOrEqualTo    : 'είναι μικρότερο ή ίσο με',
        isBetween              : 'βρίσκεται μεταξύ',
        isNotBetween           : 'δεν βρίσκεται μεταξύ',
        isBefore               : 'προηγείται του',
        isAfter                : 'έπεται του',
        timeEquals             : 'η ώρα είναι ίση με',
        timeDoesNotEqual       : 'η ώρα δεν είναι ίση με',
        isToday                : 'είναι σήμερα',
        isTomorrow             : 'είναι αύριο',
        isYesterday            : 'είναι χθες',
        isThisWeek             : 'είναι αυτήν την εβδομάδα',
        isNextWeek             : 'είναι την επόμενη εβδομάδα',
        isLastWeek             : 'είναι την προηγούμενη εβδομάδα',
        isThisMonth            : 'είναι αυτόν το μήνα',
        isNextMonth            : 'είναι τον επόμενο μήνα',
        isLastMonth            : 'είναι τον προηγούμενο μήνα',
        isThisYear             : 'είναι αυτόν το χρόνο',
        isNextYear             : 'είναι τον επόμενο χρόνο',
        isLastYear             : 'είναι τον προηγούμενο χρόνο',
        isYearToDate           : 'είναι μέχρι σήμερα',
        isTrue                 : 'είναι αληθές',
        isFalse                : 'είναι ψευδές',
        selectAProperty        : 'Επιλέξτε μια ιδιότητα',
        selectAnOperator       : 'Επιλέξτε έναν τελεστή',
        caseSensitive          : 'Με διάκριση πεζών-κεφαλαίων',
        and                    : 'και',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Επιλέξτε μια τιμή',
        selectOneOrMoreValues  : 'Επιλέξτε μία ή περισσότερες τιμές',
        enterAValue            : 'Εισαγάγετε μια τιμή',
        enterANumber           : 'Εισαγάγετε έναν αριθμό',
        selectADate            : 'Επιλέξτε μια ημερομηνία',
        selectATime            : 'Επιλέξτε ώρα'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Προσθήκη φίλτρου',
        applyCond : applied => applied ? 'Παράλειψη φίλτρου (εφαρμόστηκε)' : 'Εφαρμογή φίλτρου (παραλείφθηκε)'
    },

    DateHelper : {
        locale         : 'el',
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
            { single : 'ΧιλιοστότουΔευτερολέπτου', plural : 'ΧιλιοστάτουΔευτερολέπτου', abbrev : 'Χιλ.τουΔευτ.' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'δευτερόλεπτο', plural : 'δευτερόλεπτα', abbrev : 'δευτ.' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'λεπτό', plural : 'λεπτά', abbrev : 'λεπ.' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'ώρα', plural : 'ώρες', abbrev : 'ώρ.' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'ημέρα', plural : 'ημέρες', abbrev : 'ημ.' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'εβδομάδα', plural : 'εβδομάδες', abbrev : 'εβδ.' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'μήνας', plural : 'μήνες', abbrev : 'μήν.' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'τρίμηνο', plural : 'τρίμηνα', abbrev : 'τρίμ.' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'έτος', plural : 'έτη', abbrev : 'έτ.' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'δεκαετία', plural : 'δεκαετίες', abbrev : 'δεκ.' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['χιλ.τουδευτ.'],
            [],
            ['δ.', 'δευτ.'],
            [],
            ['λ.', 'λεπ.'],
            [],
            ['ω', 'ώρ.'],
            [],
            ['ημ.'],
            [],
            ['εβ', 'εβδ.'],
            [],
            ['μ', 'μην.'],
            [],
            ['τρίμ.'],
            [],
            ['ε', 'έτ.'],
            [],
            ['δεκ.'],
            []
        ],
        parsers : {
            L   : 'DD/MM/YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {

            const lastDigit = number[number.length - 1];
            const suffix = { 1 : 'ος', 2 : 'ο' }[lastDigit] || 'η';

            return number + suffix;
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `Δεκαετία του ${year - (year % 10)}`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
