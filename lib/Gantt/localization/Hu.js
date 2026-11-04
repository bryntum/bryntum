import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Hu.js';

const locale = {

    localeName : 'Hu',
    localeDesc : 'Magyar',
    localeCode : 'hu',
    localeRtl  : false,

    Object : {
        Save : 'Mentés'
    },

    CostColumn : {
        cost : 'Költség'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Erőforrásnaptár figyelmen kívül hagyása'
    },

    InactiveColumn : {
        Inactive : 'Inaktív'
    },

    TaskInfoColumn : {
        info                     : 'Info',
        postponedConflictTooltip : 'Feloldatlan ütemezési ütközés van ezzel az eseménnyel. Kattintson a megoldáshoz.'
    },

    ActualEffortColumn : {
        actualEffort : 'Tényleges erőfeszítés'
    },

    AddNewColumn : {
        'New Column' : 'Új oszlop'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Alapértelmezett erőfeszítés'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Eredeti kezdés'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Eredeti befejezés'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Eredeti időtartam'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Kezdés eltérése'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Befejezés eltérése'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Időtartam eltérése'
    },

    CalendarColumn : {
        Calendar : 'Naptár'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Korai kezdés'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Korai befejezés'
    },

    LateStartDateColumn : {
        'Late Start' : 'Késői kezdés'
    },

    LateEndDateColumn : {
        'Late End' : 'Késői befejezés'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Összes rugalmasság'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Korlátozás dátuma'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Korlátozás típusa'
    },

    DeadlineDateColumn : {
        Deadline : 'Határidő'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Érvénytelen függőség'
    },

    DurationColumn : {
        Duration : 'Időtartam'
    },

    EffortColumn : {
        Effort : 'Erőfeszítés'
    },

    EndDateColumn : {
        Finish : 'Vége'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuálisan ütemezve'
    },

    MilestoneColumn : {
        Milestone : 'Mérföldkő'
    },

    NameColumn : {
        Name : 'Név'
    },

    NoteColumn : {
        Note : 'Jegyzet'
    },

    PercentDoneColumn : {
        '% Done' : '% kész'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Tervezett % Kész'
    },

    PredecessorColumn : {
        Predecessors : 'Elődök'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Hozzárendelt erőforrások',
        'more resources'     : 'további erőforrás'
    },

    RollupColumn : {
        Rollup : 'Felhalmozódás'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Ütemezési mód'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Ütemterv iránya',
        inheritedFrom       : 'Örökölt',
        enforcedBy          : 'Kényszerítve'
    },

    SequenceColumn : {
        Sequence : 'Sorrend'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Megjelenítés idővonalon'
    },

    StartDateColumn : {
        Start : 'Kezdés'
    },

    SuccessorColumn : {
        Successors : 'Utódok'
    },

    TaskCopyPaste : {
        copyTask  : 'Másolás',
        cutTask   : 'Kivágás',
        pasteTask : 'Beillesztés'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Újraszámozás'
    },

    DependencyField : {
        invalidDependencyFormat : 'Érvénytelen függőségi formátum'
    },

    ProjectLines : {
        'Project Start' : 'Projekt kezdete',
        'Project End'   : 'Projekt vége',
        statusDate      : 'Státusz'
    },

    TaskTooltip : {
        Start    : 'Kezdés',
        End      : 'Vége',
        Duration : 'Időtartam',
        Complete : 'Kész'
    },

    BasicTaskEdit : {
        editTask        : 'Szerkesztés',
        name            : 'Név',
        percentComplete : '% kész',
        start           : 'Kezdés',
        finish          : 'Befejezés',
        duration        : 'Időtartam'
    },

    AssignmentGrid : {
        Name     : 'Erőforrás neve',
        Units    : 'Egységek',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Mennyiség',
        cost        : 'Költség',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Szerkesztés',
        Indent                 : 'Behúzás',
        Outdent                : 'Kihúzás',
        'Convert to milestone' : 'Mérföldkővé alakítás',
        Add                    : 'Hozzáadás...',
        'New task'             : 'Új feladat',
        'New milestone'        : 'Új mérföldkő',
        'Task above'           : 'Fenti feladat',
        'Task below'           : 'Lenti feladat',
        'Delete task'          : 'Törlés',
        Milestone              : 'Mérföldkő',
        'Sub-task'             : 'Részfeladat',
        Successor              : 'Utód',
        Predecessor            : 'Előd',
        changeRejected         : 'Az ütemező elutasította a módosításokat',
        linkTasks              : 'Függőségek hozzáadása',
        unlinkTasks            : 'Függőségek eltávolítása',
        color                  : 'Szín'
    },

    EventSegments : {
        splitTask : 'Tevékenység megszakítása'
    },

    Indicators : {
        earlyDates   : 'Korai kezdés/befejezés',
        lateDates    : 'Késői kezdés/befejezés',
        Start        : 'Kezdés',
        End          : 'Vége',
        deadlineDate : 'Határidő'
    },

    Versions : {
        indented      : 'Behúzott',
        outdented     : 'Kihúzott',
        cut           : 'Kivágott',
        pasted        : 'Beillesztett',
        deletedTasks  : 'Törölt feladatok',
        propertyNames : {
            baselines                   : 'Alapvonalak',
            deadlineDate                : 'Határidő',
            description                 : 'Leírás',
            endDate                     : 'Befejezési dátum',
            projectConstraintResolution : 'Projektkorlátozás megoldása',
            rollup                      : 'Összesítés',
            taskIconCls                 : 'Feladat ikon',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Projekt információk',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Általános',
        projectName  : 'Projekt neve',
        start        : 'Kezdés dátuma',
        finish       : 'Befejezés dátuma',
        scheduleFrom : 'Menetrend Kezdő',
        calendar     : 'Naptár',
        readOnly     : 'Csak olvasható',
        forward      : 'Projekt kezdési dátuma',
        backward     : 'Projekt befejezési dátuma'
    },

    ProjectEditorDescriptionTab : {
        description : 'Leírás'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Fejlett',
        hoursPerDay  : 'Napi óra',
        daysPerWeek  : 'Heti napok',
        daysPerMonth : 'Napok Havonta'
    }
};

export default LocaleHelper.publishLocale(locale);
