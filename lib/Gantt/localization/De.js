import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/De.js';

const locale = {

    localeName : 'De',
    localeDesc : 'Deutsch',
    localeCode : 'de-DE',
    localeRtl  : false,

    Object : {
        Save : 'Speichern'
    },

    CostColumn : {
        cost : 'Kosten'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ressourcenkalender ignorieren'
    },

    InactiveColumn : {
        Inactive : 'Inaktiv'
    },

    TaskInfoColumn : {
        info                     : 'Die Info',
        postponedConflictTooltip : 'Es besteht ein ungelöster Terminkonflikt mit diesem Ereignis. Klicken Sie, um das Problem zu lösen.'
    },

    ActualEffortColumn : {
        actualEffort : 'Tatsächlicher Aufwand'
    },

    AddNewColumn : {
        'New Column' : 'Neue Spalte'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Basisaufwand'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Geplanter Anfang'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Geplantes Ende'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Geplante Dauer'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Abweichung Anfang'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Abweichung Ende'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Dauerabweichung'
    },

    CalendarColumn : {
        Calendar : 'Kalender'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Früher Anfang'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Frühes Ende'
    },

    LateStartDateColumn : {
        'Late Start' : 'Später Anfang'
    },

    LateEndDateColumn : {
        'Late End' : 'Spätes Ende'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Gesamtes Slack'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Einschränkung Datum'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Einschränkung Typ'
    },

    DeadlineDateColumn : {
        Deadline : 'Stichtag'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Ungültige Abhängigkeit'
    },

    DurationColumn : {
        Duration : 'Dauer'
    },

    EffortColumn : {
        Effort : 'Aufwand'
    },

    EndDateColumn : {
        Finish : 'Ende'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuell geplant'
    },

    MilestoneColumn : {
        Milestone : 'Meilenstein'
    },

    NameColumn : {
        Name : 'Vorgangsname'
    },

    NoteColumn : {
        Note : 'Notizen'
    },

    PercentDoneColumn : {
        '% Done' : '% Abgeschlossen'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Geplant % erledigt'
    },

    PredecessorColumn : {
        Predecessors : 'Vorgänger'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Zugewiesene Ressourcen',
        'more resources'     : 'mehr Ressourcen'
    },

    RollupColumn : {
        Rollup : 'Rollup'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Planungsmodus'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Planungsrichtung',
        inheritedFrom       : 'Geerbt von',
        enforcedBy          : 'Erzwungen von'
    },

    SequenceColumn : {
        Sequence : 'Sequenz'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'In der Chronik anzeigen'
    },

    StartDateColumn : {
        Start : 'Anfang'
    },

    SuccessorColumn : {
        Successors : 'Nachfolger'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopieren',
        cutTask   : 'Ausschneiden',
        pasteTask : 'Einfügen'
    },

    WBSColumn : {
        WBS      : 'PSP',
        renumber : 'Erneut nummerieren'
    },

    DependencyField : {
        invalidDependencyFormat : 'Ungültiges Abhängigkeitsformat'
    },

    ProjectLines : {
        'Project Start' : 'Projektanfang',
        'Project End'   : 'Projektende',
        statusDate      : 'Status Datum'
    },

    TaskTooltip : {
        Start    : 'Anfang',
        End      : 'Ende',
        Duration : 'Dauer',
        Complete : 'Vollständig'
    },

    BasicTaskEdit : {
        editTask        : 'Bearbeiten',
        name            : 'Name',
        percentComplete : '% abgeschlossen',
        start           : 'Start',
        finish          : 'Ende',
        duration        : 'Dauer'
    },

    AssignmentGrid : {
        Name     : 'Ressourcenname',
        Units    : 'Einheiten',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Menge',
        cost        : 'Kosten',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Bearbeiten',
        Indent                 : 'Einrücken',
        Outdent                : 'Ausrücken',
        'Convert to milestone' : 'Zu Meilenstein konvertieren',
        Add                    : 'Hinzufügen...',
        'New task'             : 'Neue Aufgabe',
        'New milestone'        : 'Neuer Meilenstein',
        'Task above'           : 'Aufgabe oben',
        'Task below'           : 'Aufgabe unten',
        'Delete task'          : 'Löschen',
        Milestone              : 'Meilenstein',
        'Sub-task'             : 'Unteraufgabe',
        Successor              : 'Nachfolger',
        Predecessor            : 'Vorgänger ',
        changeRejected         : 'Zeitplanungsmodul lehnte die Änderungen ab',
        linkTasks              : 'Abhängigkeiten hinzufügen',
        unlinkTasks            : 'Abhängigkeiten entfernen',
        color                  : 'Farbe'
    },

    EventSegments : {
        splitTask : 'Aufgabe aufteilen'
    },

    Indicators : {
        earlyDates   : 'Früher Anfang/Ende',
        lateDates    : 'Später Anfang/Ende',
        Start        : 'Anfang',
        End          : 'Ende',
        deadlineDate : 'Deadline'
    },

    Versions : {
        indented      : 'Eingerückt',
        outdented     : 'Ausgestellt',
        cut           : 'Ausgeschnitten',
        pasted        : 'Kopieren',
        deletedTasks  : 'Gelöschte Aufgaben',
        propertyNames : {
            baselines                   : 'Basispläne',
            deadlineDate                : 'Frist',
            description                 : 'Beschreibung',
            endDate                     : 'Enddatum',
            projectConstraintResolution : 'Projektbeschränkungsauflösung',
            rollup                      : 'Rollup',
            taskIconCls                 : 'Aufgabensymbol',
            wbsValue                    : 'PSP'
        }
    },

    ProjectEditor : {
        projectInformation : 'Projektinformationen',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Allgemein',
        projectName  : 'Projektname',
        start        : 'Startdatum',
        finish       : 'Enddatum',
        scheduleFrom : 'Planen von',
        calendar     : 'Kalender',
        readOnly     : 'Nur lesen',
        forward      : 'Projektstartdatum',
        backward     : 'Enddatum des Projekts'
    },

    ProjectEditorDescriptionTab : {
        description : 'Beschreibung'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Fortschrittlich',
        hoursPerDay  : 'Stunden pro Tag',
        daysPerWeek  : 'Tage pro Woche',
        daysPerMonth : 'Tage pro Monat'
    }
};

export default LocaleHelper.publishLocale(locale);
