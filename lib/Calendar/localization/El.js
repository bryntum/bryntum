import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/El.js';

const locale = {

    localeName : 'El',
    localeDesc : 'Ελληνικά',
    localeCode : 'el',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Ημερολόγιο',
        'All day' : 'Ολοήμερο',
        day       : 'Ημέρα',
        week      : 'Εβδομάδα',
        month     : 'Μήνας',
        year      : 'Έτος',
        decade    : 'Δεκαετία'
    },

    EventMenu : {
        duplicateEvent : 'Αντιγραφή συμβάντος',
        copy           : 'αντιγραφή'
    },

    Calendar : {
        toggleSidebar : 'Εναλλαγή ορατότητας πλευρικής μπάρας',
        Today         : 'Σήμερα',
        Tomorrow      : 'Αύριο',
        next          : range => `Επόμενο/η ${range}`,
        previous      : range => `Προηγούμενο/η ${range}`,
        plusMore      : value => `+${value} παραπάνω`,
        moreEvents    : value => `${value} περισσότερες εκδηλώσεις`,
        allDay        : 'Ολοήμερο',
        endsOn        : d => `Τελειώνει στις ${d}`,
        weekOfYear    : ([y, w]) => `Εβδομάδα ${w}, ${y}`,
        loadFail      : 'Η φόρτωση δεδομένων ημερολογίου απέτυχε. Επικοινωνήστε με το διαχειριστή του συστήματός σας.',
        gotoDate      : 'Μετάβαση στην ημερομηνία',
        timeRange     : 'Εύρος χρόνου',
        noResources   : 'Δεν υπάρχουν πόροι',
        calendar      : 'Ημερολόγιο',
        toolbar       : 'Γραμμή εργαλείων ημερολογίου',
        months        : 'Μήνες'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Για επαναλαμβανόμενο συμβάν, κρατήστε πατημένο το πλήκτρο CTRL'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Κανένα'} συμβάν${(count && count > 1) ? 'εις' : ''}`,
        allDayEventCount : count => `${count || 'Καμία'} ολοήμερη εκδήλωση${count === 1 ? '' : 'ς'}`
    },

    EventTip : {
        'Edit event' : 'Επεξεργασία συμβάντος',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Συμπερίληψη Σαββατοκύριακων',
        weekends        : 'Σαββατοκύριακα',
        switcherMenu    : 'Μενού εναλλαγής προβολής'
    },

    AgendaView : {
        Agenda : 'Πρόγραμμα'
    },

    MonthView : {
        Month     : 'Μήνας',
        monthUnit : 'μήνας'
    },

    MultiWeekView : {
        multiWeek : 'Πολλές εβδομάδες'
    },

    WeekView : {
        weekUnit : 'εβδομάδα'
    },

    YearView : {
        Year     : 'Έτος',
        yearUnit : 'έτος',
        noEvents : 'Δεν υπάρχουν εκδηλώσεις'
    },

    YearPlanner : {
        yearPlanner      : 'Ετήσιος Προγραμματισμός',
        expandMonthRow   : 'Επέκταση γραμμής μήνα',
        collapseMonthRow : 'Σύμπτυξη γραμμής μήνα'
    },

    EventList : {
        List   : 'Λίστα',
        Start  : 'Αρχή',
        Finish : 'Τέλος',
        days   : count => `${count > 1 ? `${count} ` : ''}ημέρα${count === 1 ? '' : 'ς'}`
    },

    DayView : {
        Day                : 'Ημέρα',
        dayUnit            : 'ημέρα',
        daysUnit           : 'ημέρες',
        expandAllDayRow    : 'Επεκτείνετε την ενότητα του ολοήμερου',
        collapseAllDayRow  : 'Καταργήστε την ενότητα του ολοήμερου',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Δεν υπάρχουν αντίστοιχες ημερομηνίες'
    },

    DayAgendaView : {
        dayAgenda : 'Ημερήσια ατζέντα'
    },

    DayResourceView : {
        dayResourceView : 'Ημερήσιοι πόροι'
    },

    MonthGrid : {
        monthGrid : 'Πλέγμα μηνών'
    },

    Sidebar : {
        selectDate      : 'Επιλέξτε ημερομηνία ημερολογίου',
        matchEvents     : 'Συμβάντα αγώνα',
        filterEvents    : 'Φιλτράρισμα συμβάντων ανά όνομα συμβάντος',
        filterResources : 'Φιλτράρισμα συμβάντων ανά επιλεγμένο πόρο'
    },

    WeekExpander : {
        expandTip   : 'Κάντε κλικ για να επεκτείνετε τη σειρά',
        collapseTip : 'Κάντε κλικ για να καταργήσετε τη σειρά'
    },

    keyboardActions : {
        title   : 'Ενέργειες πληκτρολογίου',
        content : 'Εμφάνιση πίνακα βοήθειας : [?]\nΚουμπί επιλογής λειτουργίας εστίασης : [Home]\nΑλλαγή προβολής : [1] έως [9] ή το πρώτο γράμμα του κειμένου του κουμπιού επιλογής\nΕπόμενο χρονικό διάστημα : [n]\nΠροηγούμενο χρονικό διάστημα : [p]\nΜετάβαση στη σημερινή ημέρα : [t]\nΠλοήγηση σε ημερομηνία : [g]\nΜετάβαση στο κελί της τρέχουσας ημέρας : [CTRL]+[d]\nΠλοήγηση μεταξύ γεγονότων : [TAB]\nΕστίαση στο πλαϊνό φίλτρο εισόδου γεγονότων : [/]\nΔημιουργία νέου γεγονότος (εστίαση στο κελί ημέρας) : [ENTER]\nΔιαγραφή εστιασμένου γεγονότος : [DELETE]/[BACKSPACE]\nΕπεξεργασία του εστιασμένου γεγονότος : [ENTER]\nΕνεργοποίηση μενού περιβάλλοντος σε γεγονός ή κελί : [SHIFT+F10]/[SPACE]\nΕστίαση από γεγονός στο περιβάλλον κελί : [ESCAPE]\nΠλοήγηση από κελί σε κελί : [↑]/[↓]/[←]/[→]\nΕνεργοποίηση μενού εύρους (στην προβολή Ημερήσιας Διάταξης) : [CTRL]+[r]\nΑποκοπή, αντιγραφή, επικόλληση γεγονότων : [CTRL]+[x]/[c]/[v]\nΜεγέθυνση/Σμίκρυνση μόνο στην Ημερήσια Προβολή : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
