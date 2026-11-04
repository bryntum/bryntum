import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/El.js';
import '../../Grid/localization/El.js';

const locale = {

    localeName : 'El',
    localeDesc : 'Ελληνικά',
    localeCode : 'el',
    localeRtl  : false,

    Object : {
        newEvent    : 'Νέο συμβάν',
        information : 'Πληροφορίες',
        showDetails : 'Εμφάνιση λεπτομερειών'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' συμβάν' + (data !== 1 ? 'εις' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Εναλλαγή στήλης διάταξης πόρων. SPACE για το μενού περιβάλλοντος.'
    },

    Dependencies : {
        from    : 'Από',
        to      : 'Έως',
        valid   : 'Έγκυρο',
        invalid : 'Άκυρο'
    },

    DependencyType : {
        SS           : 'ΑΑ',
        SF           : 'ΑΤ',
        FS           : 'ΤΑ',
        FF           : 'ΤΤ',
        StartToStart : 'Αρχή-με-Αρχή',
        StartToEnd   : 'Αρχή-με-Τέλος',
        EndToStart   : 'Τέλος-με-Αρχή',
        EndToEnd     : 'Τέλος-με-Τέλος',
        short        : [
            'ΑΑ',
            'ΑΤ',
            'ΤΑ',
            'ΤΤ'
        ],
        long : [
            'Αρχή-με-Αρχή',
            'Αρχή-με-Τέλος',
            'Τέλος-με-Αρχή',
            'Τέλος-με-Τέλος'
        ]
    },

    DependencyEdit : {
        From              : 'Από',
        To                : 'Έως',
        Type              : 'Τύπος',
        Lag               : 'Καθυστέρηση',
        color             : 'Χρώμα',
        lineStyle         : 'Στυλ γραμμής',
        solid             : 'Συμπαγές',
        dashed            : 'Διακεκομμένο',
        dotted            : 'Διαστιγμένο',
        dashDot           : 'Παύλα-τελεία',
        longDash          : 'Μακριά παύλα',
        'Edit dependency' : 'Επεξεργασία εξάρτησης',
        Save              : 'Αποθήκευση',
        Delete            : 'Διαγραφή',
        Cancel            : 'Ακύρωση',
        StartToStart      : 'Αρχή με Αρχή',
        StartToEnd        : 'Αρχή με Τέλος',
        EndToStart        : 'Τέλος με Αρχή',
        EndToEnd          : 'Τέλος με Τέλος',
        Active            : 'Ενεργό'
    },

    EventEdit : {
        Name           : 'Όνομα',
        Resource       : 'Πόρος',
        Start          : 'Αρχή',
        startTime      : 'Ώρα έναρξης',
        End            : 'Τέλος',
        endTime        : 'Ώρα λήξης',
        Save           : 'Αποθήκευση',
        Delete         : 'Διαγραφή',
        Cancel         : 'Ακύρωση',
        'Edit event'   : 'Επεξεργασία συμβάντος',
        Repeat         : 'Επανάληψη',
        editRecurrence : 'Επεξεργασία επανάληψης'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Το συγκεκριμένο συμβάν επικαλύπτει τρέχον συμβάν για αυτόν τον πόρο',
        noDropOutsideTimeline   : 'Το συμβάν δεν μπορεί να οριστεί εντελώς εκτός του χρονοδιαγράμματος',
        duplicateAssignmentDrag : 'Το συμβάν δεν μπορεί να ανατεθεί πολλές φορές στον ίδιο πόρο'
    },

    SchedulerBase : {
        'Add event'      : 'Προσθήκη συμβάντος',
        'Delete event'   : 'Διαγραφή συμβάντος',
        'Unassign event' : 'Ακύρωση ανάθεσης συμβάντος',
        color            : 'Χρώμα ',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, ξεκινά στις ${startDate} ${eventRecord.duration > 0 ? `για ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Εστίαση',
        activeDateRange : 'Εύρος ημερομηνιών',
        startText       : 'Ημερομηνία έναρξης',
        endText         : 'Ημερομηνία λήξης',
        todayText       : 'Σήμερα'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Ο άξονας χρόνου εμφανίζει από ${startDate} έως ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Αντιγραφή συμβάντος',
        cutEvent   : 'Αποκοπή συμβάντος',
        pasteEvent : 'Επικόλληση συμβάντος'
    },

    EventFilter : {
        filterEvents : 'Φιλτράρισμα διεργασιών',
        byName       : 'Κατά όνομα'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Εμφάνιση τρέχοντος χρονοδιαγράμματος'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Δευτερόλεπτα'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD/MM, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD/MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Ημέρα'
        },
        day : {
            name : 'Ημέρα/Ώρες'
        },
        week : {
            name : 'Εβδομάδα/Ώρες'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Εβδομάδα/Ημέρες'
        },
        dayAndMonth : {
            name : 'Μήνας'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Εβδομάδα'
        },
        weekAndMonth : {
            name : 'Εβδομάδες'
        },
        weekAndDayLetter : {
            name : 'Εβδομάδες/εργάσιμες ημέρες'
        },
        weekDateAndMonth : {
            name : 'Μήνες/Εβδομάδες'
        },
        monthAndYear : {
            name : 'Μήνες'
        },
        year : {
            name : 'Έτη'
        },
        manyYears : {
            name : 'Πολλά χρόνια'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Πρόκειται να διαγράψετε κάποιο συμβάν',
        'delete-all-message'        : 'Επιθυμείτε τη διαγραφή όλων των επαναλήψεων του συγκεκριμένου συμβάντος;',
        'delete-further-message'    : 'Θέλετε να διαγράψετε αυτήν και όλες τις μελλοντικές επαναλήψεις αυτού του συμβάντος ή μόνο την επιλεγμένη επανάληψη;',
        'delete-only-this-message'  : 'Θέλετε να διαγράψετε αυτήν την εμφάνιση αυτού του γεγονότος;',
        'delete-further-btn-text'   : 'Διαγραφή όλων των μελλοντικών συμβάντων',
        'delete-only-this-btn-text' : 'Διαγραφή μόνο αυτού του συμβάντος',
        'update-title'              : 'Πρόκειται να τροποποιήσετε κάποιο επαναλαμβανόμενο συμβάν',
        'update-all-message'        : 'Επιθυμείτε την τροποποίηση όλων των επαναλήψεων του συγκεκριμένου συμβάντος;',
        'update-further-message'    : 'Επιθυμείτε την αλλαγή μόνο της συγκεκριμένης επανάληψης του συμβάντος, ή αυτής και όλων των επόμενων επαναλήψεων;',
        'update-only-this-message'  : 'Θέλετε να αλλάξετε αυτήν την εμφάνιση αυτού του γεγονότος;',
        'update-further-btn-text'   : 'Όλα τα Μελλοντικά Συμβάντα',
        'update-only-this-btn-text' : 'Μόνο το συγκεκριμένο Συμβάν',
        Yes                         : 'Ναι',
        Cancel                      : 'Ακύρωση',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' και ',
        Daily                           : 'Καθημερινά',
        'Weekly on {1}'                 : ({ days }) => `Εβδομαδιαίως κάθε ${days}`,
        'Monthly on {1}'                : ({ days }) => `Μηνιαίως κάθε ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Ετησίως κάθε ${days} του ${months}`,
        'Every {0} days'                : ({ interval }) => `Κάθε ${interval} ημέρες`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Κάθε ${interval} εβδομάδες τις ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Κάθε ${interval} μήνες τις ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Κάθε ${interval} έτη την ${days} του ${months}`,
        position1                       : 'πρώτη',
        position2                       : 'δεύτερη',
        position3                       : 'τρίτη',
        position4                       : 'τέταρτη',
        position5                       : 'πέμπτη',
        'position-1'                    : 'τελευταία',
        day                             : 'ημέρα',
        weekday                         : 'ημέρα της εβδομάδας',
        'weekend day'                   : 'ημέρα από το Σαββατοκύριακο',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Επανάληψη Συμβάντος',
        Cancel              : 'Ακύρωση',
        Save                : 'Αποθήκευση',
        Frequency           : 'Συχνότητα',
        Every               : 'Κάθε',
        DAILYintervalUnit   : 'ημέρα(-ες)',
        WEEKLYintervalUnit  : 'εβδομάδα(-ες)',
        MONTHLYintervalUnit : 'μήνα(-ες)',
        YEARLYintervalUnit  : 'έτος(-η)',
        Each                : 'Κάθε',
        on                  : 'Ενεργό',
        the                 : 'Την',
        'On the'            : 'Την',
        'End repeat'        : 'Τέλος επανάληψης',
        'time(s)'           : 'φορά(-ές)',
        Days                : 'Ημέρες',
        Months              : 'Μήνες'
    },

    RecurrenceDaysCombo : {
        day           : 'ημέρα',
        weekday       : 'ημέρα της εβδομάδας',
        'weekend day' : 'ημέρα από το Σαββατοκύριακο'
    },

    RecurrencePositionsCombo : {
        position1    : 'πρώτη',
        position2    : 'δεύτερη',
        position3    : 'τρίτη',
        position4    : 'τέταρτη',
        position5    : 'πέμπτη',
        'position-1' : 'τελευταία'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Ποτέ',
        After     : 'Μετά από',
        'On date' : 'Κατά την ημερομηνία'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Χωρίς επανάληψη',
        Daily   : 'Καθημερινά',
        Weekly  : 'Εβδομαδιαίως',
        Monthly : 'Μηνιαίως',
        Yearly  : 'Ετησίως'
    },

    RecurrenceCombo : {
        None   : 'Καμία',
        Custom : 'Προσαρμοσμένη...'
    },

    Summary : {
        'Summary for' : date => `Σύνοψη για ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Πλήρες πρόγραμμα',
        currentview  : 'Ορατό πρόγραμμα',
        daterange    : 'Εύρος ημερομηνιών',
        completedata : 'Ολοκλήρωση προγραμματισμού (για όλα τα συμβάντα)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Εύρος προγραμματισμού',
        'Export from'    : 'Από',
        'Export to'      : 'Έως'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Μονή σελίδα'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Μονή σελίδα (χωρίς κλιμάκωση)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Πολλαπλές σελίδες (κατακόρυφα)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Δεν υπάρχουν εκχωρημένοι πόροι'
    },

    CrudManagerView : {
        serverResponseLabel : 'Απόκριση διακομιστή:'
    },

    DurationColumn : {
        Duration : 'Διάρκεια'
    },

    EventClusteringBase : {
        unnamed         : 'Χωρίς όνομα',
        more            : count => `+ ${count} ακόμη`,
        clusteredEvents : count => `${count} ομαδοποιημένα γεγονότα`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} ομαδοποιημένα εύρη`
    },

    ConstraintTypePicker : {
        none                : 'Κανένας',
        assoonaspossible    : 'Το συντομότερο δυνατόν',
        aslateaspossible    : 'Το αργότερο δυνατόν',
        muststarton         : 'Πρέπει να ξεκινήσει στις',
        mustfinishon        : 'Πρέπει να τελειώσει στις',
        startnoearlierthan  : 'Δεν μπορεί να ξεκινήσει νωρίτερα από τις',
        startnolaterthan    : 'Δεν μπορεί να ξεκινήσει αργότερα από τις',
        finishnoearlierthan : 'Δεν μπορεί να τελειώσει νωρίτερα από τις',
        finishnolaterthan   : 'Δεν μπορεί να τελειώσει αργότερα από τις'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} χρόνος αναμονής πριν από το γεγονός`;
            }
            if (postamble) {
                description += `.${postamble.toString()} χρόνος αναμονής μετά το γεγονός`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Μπροστά',
        Backward      : 'Προς τα πίσω',
        inheritedFrom : 'Κληρονομήθηκε από',
        enforcedBy    : 'Επιβλήθηκε από'
    },

    CalendarField : {
        'Default calendar' : 'Προεπιλεγμένο ημερολόγιο',
        editCalendar       : 'Επεξεργασία ημερολογίου'
    },

    TaskEditorBase : {
        Information   : 'Πληροφορίες εργασίας',
        Save          : 'Αποθήκευση',
        Cancel        : 'Ακύρωση',
        Delete        : 'Διαγραφή',
        calculateMask : 'Υπολογισμός...',
        saveError     : 'Δεν είναι δυνατή η αποθήκευση, διορθώστε τυχόν λάθη πρώτα',
        repeatingInfo : 'Προβολή ενός επαναλαμβανόμενου συμβάντος',
        editRepeating : 'Επεξεργασία'
    },

    TaskEdit : {
        editEvent              : 'Επεξεργασία συμβάντος',
        ConfirmDeletionTitle   : 'Επιβεβαίωση διαγραφής',
        ConfirmDeletionMessage : 'Είστε σίγουροι ότι επιθυμείτε τη διαγραφή του συγκεκριμένου συμβάντος;'
    },

    GanttTaskEditor : {
        editorWidth : '50em'
    },

    SchedulerTaskEditor : {
        editorWidth : '36em'
    },

    SchedulerGeneralTab : {
        General      : 'Γενικά',
        Name         : 'Όνομα',
        Resources    : 'Πόροι',
        '% complete' : '% ολοκληρωμένο',
        Duration     : 'Διάρκεια',
        Start        : 'Έναρξη',
        Finish       : 'Τερματισμός',
        Effort       : 'Effort',
        Preamble     : 'Προοίμιο',
        Postamble    : 'Σύνοψη'
    },

    GeneralTab : {
        General      : 'Γενικά',
        Name         : 'Όνομα',
        '% complete' : '% ολοκληρωμένο',
        Duration     : 'Διάρκεια',
        Start        : 'Έναρξη',
        Finish       : 'Τερματισμός',
        Effort       : 'Effort',
        Dates        : 'Ημερομηνίες'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Για προχωρημένους',
        Calendar                   : 'Ημερολόγιο',
        'Scheduling mode'          : 'Λειτουργία προγραμματισμού',
        'Effort driven'            : 'Προγραμματισμός βάσει Προσπάθειας',
        'Manually scheduled'       : 'Χειροκίνητα προγραμματισμένο',
        'Constraint type'          : 'Τύπος περιορισμού',
        'Constraint date'          : 'Ημερομηνία περιορισμού',
        Inactive                   : 'Ανενεργό',
        'Ignore resource calendar' : 'Παράβλεψη ημερολογίου πόρου'
    },

    CalendarEditorDatePicker : {
        addException : 'Προσθέστε εξαίρεση',
        addWeek      : 'Προσθήκη εβδομάδας'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Προσθέστε εξαίρεση',
        removeException : 'Αφαιρέστε την εξαίρεση',
        noRows          : 'Δεν προστέθηκαν εξαιρέσεις'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Προσθήκη εβδομάδας',
        removeWeek : 'Αφαιρώ την εβδομάδα'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Οι ημέρες λειτουργούν από προεπιλογή',
        workingTimeCalendar        : 'Ημερολόγιο χρόνου εργασίας',
        exceptions                 : 'Εξαιρέσεις',
        general                    : 'Γενικός',
        name                       : 'Ονομα',
        parent                     : 'Μητρική εταιρεία',
        save                       : 'Αποθηκεύσετε',
        weeks                      : 'Εβδομάδες',
        error                      : 'Λάθος',
        inputErrors                : 'Υπάρχουν σφάλματα εισόδου. Διορθώστε τα πριν αποθηκεύσετε τις αλλαγές σας.',
        delete                     : 'Διαγράφω',
        addCalendar                : 'Προσθέστε ένα ημερολόγιο',
        confirmation               : 'Επιβεβαίωση',
        removeCalendarWithChildren : 'Το ημερολόγιο έχει ημερολόγια παιδιών. Κάντε κλικ στο κουμπί "Ναι" για να καταργήσετε το ημερολόγιο με τα παιδιά του.',
        removeCalendarAndLinks     : 'Το ημερολόγιο χρησιμοποιείται από ορισμένα αρχεία. Κάντε κλικ στο κουμπί "Ναι" για να τα αποσυνδέσετε και να αφαιρέσετε το ημερολόγιο.',
        newException               : 'Νέα εξαίρεση',
        newWeek                    : 'Νέα εβδομάδα'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' δουλεύει',
        isNotWorking : ' δεν λειτουργεί',
        basedOn      : ' βασισμένο στο:',
        byDefault    : 'από προεπιλογή',
        rangeTpl     : (start, end) => `${start} έως ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Εργάσιμη μέρα',
        nonWorkingDay : 'Μη εργαζόμενη ημέρα'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Υπάρχουν επικαλυπτόμενες σειρές',
        errorMissingDate   : 'Απαιτείται χρόνος έναρξης και λήξης',
        errorStartAfterEnd : 'Η ώρα έναρξης δεν μπορεί να είναι μετά το τέλος της ώρας'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Ονομα',
        from                                 : 'Από',
        to                                   : 'Προς την',
        is                                   : 'Είναι',
        nonWorking                           : 'Μη λειτουργικό',
        working                              : 'Εργαζόμενος',
        hours                                : 'Ωρες',
        repeat                               : 'Επαναλαμβάνω',
        repeatEnd                            : 'Επαναλαμβανόμενος',
        errorMissingDate                     : 'Απαιτείται εύρος ημερομηνίας εξαίρεσης',
        errorStartAfterEnd                   : '"Από" Ημερομηνία δεν μπορεί να είναι μετά την ημερομηνία "Προς την" ημερομηνία ',
        errorStartAndEndRepeatNumberMismatch : 'Η εξαίρεση θα πρέπει να ξεκινήσει και να τερματίσει τις ίδιες φορές'
    },

    CalendarEditorWeekPanel : {
        name        : 'Ονομα',
        from        : 'Από',
        to          : 'Προς την',
        days        : 'Ημέρες',
        copyDay     : 'Ημέρα αντιγραφής',
        pasteDay    : 'Ημέρα επικόλλησης',
        stopCopying : 'Σταματήστε να αντιγράφετε'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Προσθέστε εύρος',
        removeRange : 'Αφαιρώ το εύρος'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"Από" Ημερομηνία δεν μπορεί να είναι μετά την ημερομηνία "Προς την" ημερομηνία ',
        errorNoDefaultWeek           : 'Απαιτείται διαμόρφωση εβδομάδας',
        errorMultipleDefaultWeeks    : 'Προβλέπονται περισσότερες από μία προεπιλεγμένες εβδομάδες',
        errorNoWeekAvailability      : 'Η εβδομάδα πρέπει να παρέχει κάποιο χρόνο εργασίας',
        errorInvalidWeekAvailability : 'Η εβδομάδα έχει σφάλματα διαμόρφωσης χρόνου εργασίας',
        noRows                       : 'Δεν προστέθηκαν εβδομάδες'
    },

    AdvancedTab : {
        Advanced                   : 'Για προχωρημένους',
        Calendar                   : 'Ημερολόγιο',
        'Scheduling mode'          : 'Λειτουργία προγραμματισμού',
        'Effort driven'            : 'Προγραμματισμός βάσει Προσπάθειας',
        'Manually scheduled'       : 'Χειροκίνητα προγραμματισμένο',
        'Constraint type'          : 'Τύπος περιορισμού',
        'Constraint date'          : 'Ημερομηνία περιορισμού',
        Constraint                 : 'Περιορισμός',
        Rollup                     : 'Μετάβαση στη Σύνοψη',
        Inactive                   : 'Ανενεργό',
        'Ignore resource calendar' : 'Παράβλεψη ημερολογίου πόρου',
        'Scheduling direction'     : 'Κατεύθυνση προγραμματισμού',
        projectBorder              : 'Σύνορα έργων',
        ignore                     : 'Αγνοώ',
        honor                      : 'Τιμή',
        askUser                    : 'Ζητώ από τον χρήστη'
    },

    DependencyTab : {
        Predecessors      : 'Προκάτοχοι',
        Successors        : 'Διάδοχοι',
        ID                : 'Αναγνωριστικό',
        Name              : 'Όνομα',
        Type              : 'Τύπος',
        Lag               : 'Καθυστέρηση',
        cyclicDependency  : 'Κυκλική εξάρτηση',
        invalidDependency : 'Μη έγκυρη εξάρτηση',
        readOnlyTask      : 'Δεν είναι δυνατή η σύνδεση εργασίας μόνο για ανάγνωση'
    },

    NotesTab : {
        Notes : 'Σημειώσεις'
    },

    ResourceCalendarColumn : {
        calendar : 'Ημερολόγιο'
    },

    ResourceEdit : {
        editResource : 'Επεξεργασία πόρου'
    },

    ResourceEditor : {
        resourceInformation : 'Πληροφορίες πόρων',
        costs               : 'Δικαστικά έξοδα',
        save                : 'Εκτός',
        error               : 'Σφάλμα',
        inputErrors         : 'Υπάρχουν σφάλματα εισαγωγής. Διορθώστε τα πριν αποθηκεύσετε τις αλλαγές σας.',
        delete              : 'Διαγράφω',
        confirmation        : 'Επιβεβαίωση',
        removeUsedResource  : 'Ο πόρος ανατίθεται σε ορισμένες εργασίες. Κάντε κλικ στο "Ναι" για να καταργήσετε τον πόρο ούτως ή άλλως.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Ημερολόγιο',
        general     : 'Γενικός',
        label       : 'Ετικέτα υλικού',
        name        : 'Όνομα πόρου',
        type        : 'Τύπος',
        costAccrual : 'Δεδουλευμένο κόστος',
        labelHint   : 'για παράδειγμα, κιλά, τόνους ή κιβώτια',
        maxUnits    : 'Μέγιστες μονάδες'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Συλλογισμός σε',
        prorated : 'Αναλογικά',
        start    : 'Αρχή',
        end      : 'Τέλος'
    },

    CostAccrualField : {
        prorated : 'Αναλογικά',
        start    : 'Αρχή',
        end      : 'Τέλος'
    },

    ResourceType : {
        work     : 'Εργασία',
        material : 'Υλικό',
        cost     : 'Κόστος'
    },

    ResourceTypeColumn : {
        type : 'Τύπος'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Πίνακας τιμών',
        newGroup     : 'Νέο τραπέζι',
        removeGroup  : 'Αφαιρέστε τον πίνακα',
        useByDefault : 'Χρήση από προεπιλογή για τις αναθέσεις πόρων',
        noRates      : 'Δεν υπάρχουν τιμές'
    },

    ResourceGrid : {
        name          : 'Ονομα',
        materialLabel : 'Ετικέτα υλικού',
        maxUnits      : 'Μέγιστες μονάδες',
        cost          : 'Κόστος',
        noRows        : 'Χωρίς πόρους'
    },

    ResourceRateTableContainer : {
        startDate    : 'Ημερομηνία έναρξης',
        standardRate : 'Τυπική τιμή',
        perUseCost   : 'Κόστος ανά χρήση',
        addRate      : 'Προσθήκη ποσοστού',
        removeRate   : 'Κατάργηση ποσοστού',
        name         : 'Ονομα',
        noRates      : 'Δεν υπάρχουν τιμές'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Πληροφορίες πίνακα τιμών'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Ποσότητα',
        Resources   : 'Πόροι',
        Resource    : 'Πόρος',
        Units       : 'Μονάδες',
        cost        : 'Κόστος',
        effort      : 'Προσπάθεια',
        start       : 'Αρχή',
        finish      : 'Φινίρισμα',
        preamble    : 'Προοίμιο',
        postamble   : 'Επίλογος'
    },

    RateTableColumn : {
        rateTable : 'Πίνακας τιμών'
    },

    RecurrenceTab : {
        title : 'Επανάληψη'
    },

    SchedulingModePicker : {
        Normal           : 'Κανονικό',
        'Fixed Duration' : 'Σταθερή Διάρκεια',
        'Fixed Units'    : 'Σταθερές Μονάδες',
        'Fixed Effort'   : 'Σταθερή Προσπάθεια'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} των {available}</span> που έχουν εκχωρηθεί',
        barTipOnDate          : '<b>{resource}</b> στις {startDate}<br><span class="{cls}">{allocated} των {available}</span> που έχουν εκχωρηθεί',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} των {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} των {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'Την {startDate}<br><span class="{cls}">{allocated} των {available}</span> που έχουν εκχωρηθεί:<br>{assignments}',
        plusMore              : '+{value} παραπάνω'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Προσπάθεια</div><div class="b-effort-value {cls}">{allocated} από {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Προσπάθεια</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Κόστος</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Ποσότητα</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} στις {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Σύνοψη για {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Σύνοψη για {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} περισσότερα',
        nameColumnText        : 'Πόρος / Εκδήλωση'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Ακύρωση αλλαγής και έπειτα καμία ενέργεια',
        schedulingConflict : 'Σύγκρουση προγραμματισμού',
        emptyCalendar      : 'Σφάλμα ρύθμισης παραμέτρων ημερολογίου',
        cycle              : 'Κύκλος προγραμματισμού',
        Apply              : 'Εφαρμογή'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Επιλέξτε μια εξάρτηση:',
        invalidDependencyLabel : 'Υπάρχουν άκυρες εξαρτήσεις που πρέπει να αντιμετωπιστούν:'
    },

    SchedulerProBase : {
        propagating     : 'Υπολογισμός έργου',
        storePopulation : 'Φόρτωση δεδομένων',
        finalizing      : 'Οριστικοποίηση αποτελεσμάτων'
    },

    EventSegments : {
        splitEvent    : 'Διαίρεση συμβάντος',
        renameSegment : 'Μετονομασία'
    },

    NestedEvents : {
        createGroup         : 'Ομαδοποίηση επιλεγμένων συμβάντων',
        newGroupName        : 'Νέα ομάδα',
        deNestingNotAllowed : 'Δεν επιτρέπεται η από-εμφώλευση',
        nestingNotAllowed   : 'Δεν επιτρέπεται η εμφώλευση'
    },

    VersionGrid : {
        compare       : 'Σύγκρινε',
        description   : 'Περιγραφή',
        occurredAt    : 'Συνέβη στις',
        rename        : 'Μετονομασία',
        restore       : 'Επαναφορά',
        stopComparing : 'Σταμάτησε τη σύγκριση'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'εργασία',
            AssignmentModel : 'ανάθεση',
            DependencyModel : 'σύνδεσμος',
            ProjectModel    : 'έργο',
            ResourceModel   : 'πόρος',
            other           : 'αντικείμενο'
        },
        entityNamesPlural : {
            TaskModel       : 'εργασίες',
            AssignmentModel : 'αναθέσεις',
            DependencyModel : 'σύνδεσμοι',
            ProjectModel    : 'έργα',
            ResourceModel   : 'πόροι',
            other           : 'αντικείμενα'
        },
        transactionDescriptions : {
            update : 'Ενημέρωση {n} {entities}',
            add    : 'Προσθήκη {n} {entities}',
            remove : 'Κατάργηση {n} {entities}',
            move   : 'Μετακίνηση {n} {entities}',
            mixed  : 'Συνδυασμός {n} {entities}'
        },
        propertyNames : {
            active                   : 'Ενεργό',
            allDay                   : 'Όλη μέρα',
            allowOverlap             : 'Επιτρέπεται η επικάλυψη',
            barMargin                : 'Περιθώριο γραμμής',
            bidirectional            : 'Διπλής κατεύθυνσης',
            calendar                 : 'Ημερολόγιο',
            cls                      : 'CSS κλάση',
            constraintDate           : 'Ημερομηνία περιορισμού',
            constraintType           : 'Τύπος περιορισμού',
            daysPerMonth             : 'Ημέρες ανά μήνα',
            daysPerWeek              : 'Ημέρες ανά εβδομάδα',
            delayFromParent          : 'Καθυστέρηση από γονέα',
            direction                : 'Κατεύθυνση',
            drawDependencies         : 'Σχεδίαση εξαρτήσεων',
            duration                 : 'Διάρκεια',
            durationUnit             : 'Μονάδα διάρκειας',
            effort                   : 'Προσπάθεια',
            effortDriven             : 'Καθοδηγούμενη από προσπάθεια',
            effortUnit               : 'Μονάδα προσπάθειας',
            endDate                  : 'Ημερομηνία λήξης',
            eventColor               : 'Χρώμα',
            eventId                  : 'Αναγνωριστικό Συμβάντος',
            eventLayout              : 'Διάταξη εκδήλωσης',
            eventStyle               : 'Στυλ γραμμής',
            exceptionDates           : 'Ημερομηνίες εξαίρεσης',
            fixed                    : 'Σταθερό',
            from                     : 'Από',
            fromSide                 : 'Από πλευρά',
            hoursPerDay              : 'Ώρες ανά ημέρα',
            href                     : 'Σύνδεσμος',
            iconCls                  : 'Εικονίδιο',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Παράβλεψη ημερολογίου πόρου',
            ignoreTimeZone           : 'Παράβλεψη ζώνης ώρας',
            image                    : 'Εικόνα',
            imageUrl                 : 'URL εικόνας',
            inactive                 : 'Ανενεργό',
            intervals                : 'Διαστήματα',
            lag                      : 'Καθυστέρηση',
            lagUnit                  : 'Μονάδα καθυστέρησης',
            lineStyle                : 'Στυλ γραμμής',
            manuallyScheduled        : 'Χειροκίνητα προγραμματισμένο',
            milestoneWidth           : 'Πλάτος ορόσημου',
            name                     : 'Όνομα',
            note                     : 'Σημείωση',
            parentId                 : 'Αναγνωριστικό Γονέα',
            parentIndex              : 'Θέση',
            percentDone              : '% ολοκληρωμένο',
            postamble                : 'Επίλογος',
            preamble                 : 'Πρόλογος',
            readOnly                 : 'Μόνο ανάγνωση',
            recurrenceRule           : 'Κανόνας επανάληψης',
            resourceId               : 'Αναγνωριστικό Πόρου',
            resourceMargin           : 'Περιθώριο πόρου',
            rowHeight                : 'Ύψος γραμμής',
            schedulingMode           : 'Λειτουργία προγραμματισμού',
            segments                 : 'Τμήματα',
            showAvatar               : 'Εμφάνιση avatar',
            showInTimeline           : 'Εμφάνιση στο χρονοδιάγραμμα',
            startDate                : 'Ημερομηνία έναρξης',
            stickyContents           : 'Κολλητά περιεχόμενα',
            strokeColor              : 'Χρώμα γραμμής',
            style                    : 'Στυλ',
            target                   : 'Στόχος συνδέσμου',
            to                       : 'Προς',
            toSide                   : 'Προς πλευρά',
            type                     : 'Τύπος',
            units                    : 'Μονάδες',
            unscheduled              : 'Μη προγραμματισμένο',
            unspecifiedTimeIsWorking : 'Απροσδιόριστος χρόνος είναι εργάσιμος',
            version                  : 'Έκδοση'
        },
        intervals : {
            working    : 'Εργασία',
            nonWorking : 'Μη εργασία',
            fromTo     : 'Από {from} έως {to}',
            recurring  : 'Επαναλαμβανόμενο ξεκινώντας {start} τελειώνοντας {end}'
        },
        addEntity         : 'Προστέθηκε {type} **{name}**',
        removeEntity      : 'Καταργήθηκε {type} **{name}**',
        updateEntity      : 'Άλλαξε {type} **{name}**',
        moveEntity        : 'Μετακινήθηκε {type} **{name}** από {from} σε {to}',
        addDependency     : 'Προστέθηκε σύνδεσμος από **{from}** σε **{to}**',
        removeDependency  : 'Καταργήθηκε σύνδεσμος από **{from}** σε **{to}**',
        updateDependency  : 'Επεξεργάστηκε σύνδεσμος από **{from}** σε **{to}**',
        addAssignment     : 'Ανατέθηκε **{resource}** σε **{event}**',
        removeAssignment  : 'Καταργήθηκε ανάθεση **{resource}** από **{event}**',
        updateAssignment  : 'Επεξεργάστηκε ανάθεση από **{resource}** σε **{event}**',
        noChanges         : 'Καμία αλλαγή',
        nullValue         : 'καμία',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Αποθηκεύτηκε στις {date}',
        autoSavedAt       : 'Αυτόματη αποθήκευση στις {date}',
        undid             : 'Αναίρεση αλλαγών',
        redid             : 'Επαναφορά αλλαγών',
        editedTask        : 'Επεξεργάστηκαν οι ιδιότητες εργασίας',
        deletedTask       : 'Διαγράφηκε μια εργασία',
        movedTask         : 'Μετακινήθηκε μια εργασία',
        movedTasks        : 'Μετακινήθηκαν εργασίες'
    }
};

export default LocaleHelper.publishLocale(locale);
