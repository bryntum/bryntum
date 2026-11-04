import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Et.js';

const locale = {

    localeName : 'Et',
    localeDesc : 'Eesti keel',
    localeCode : 'et',
    localeRtl  : false,

    Object : {
        Save : 'Salvesta'
    },

    CostColumn : {
        cost : 'Maksumus'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignoreeri ressursikalendrit'
    },

    InactiveColumn : {
        Inactive : 'Mitteaktiivne'
    },

    TaskInfoColumn : {
        info                     : 'Info',
        postponedConflictTooltip : 'Selle sündmusega on lahendamata ajakavakonflikt. Selle lahendamiseks klõpsake.'
    },

    ActualEffortColumn : {
        actualEffort : 'Tegelik pingutus'
    },

    AddNewColumn : {
        'New Column' : 'Uus veerg'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Aluspingutus'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Planeeritud algus'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Planeeritud lõpp'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Baseline kestus'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Algus dispersioon'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Lõpp dispersioon'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Kestvuse hälve'
    },

    CalendarColumn : {
        Calendar : 'Kalender'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Varajane algus'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Varajane lõpp'
    },

    LateStartDateColumn : {
        'Late Start' : 'Hiline algus'
    },

    LateEndDateColumn : {
        'Late End' : 'Hiline lõpp'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Kogu lõtk'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Piirangu kuupäev'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Piirangu tüüp'
    },

    DeadlineDateColumn : {
        Deadline : 'Tähtaeg'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Kehtetu sõltuvus'
    },

    DurationColumn : {
        Duration : 'Kestus'
    },

    EffortColumn : {
        Effort : 'Pingutus'
    },

    EndDateColumn : {
        Finish : 'Lõpp'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuaalselt kavandatud'
    },

    MilestoneColumn : {
        Milestone : 'Verstapost'
    },

    NameColumn : {
        Name : 'Nimi'
    },

    NoteColumn : {
        Note : 'Märkus'
    },

    PercentDoneColumn : {
        '% Done' : '% tehtud'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Planeeritud % Valmis'
    },

    PredecessorColumn : {
        Predecessors : 'Eelkäijad'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Määratud ressursid',
        'more resources'     : 'veel ressursse'
    },

    RollupColumn : {
        Rollup : 'Ümberarvestus'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Kavandamise režiim'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Ajakava suund',
        inheritedFrom       : 'Pärineb',
        enforcedBy          : 'Jõustatud'
    },

    SequenceColumn : {
        Sequence : 'Järjestus'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Näita ajajoonel'
    },

    StartDateColumn : {
        Start : 'Algus'
    },

    SuccessorColumn : {
        Successors : 'Järglased'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopeeri',
        cutTask   : 'Lõika',
        pasteTask : 'Kleebi'
    },

    WBSColumn : {
        WBS      : 'Tööjaotuse struktuur',
        renumber : 'Nummerda ümber'
    },

    DependencyField : {
        invalidDependencyFormat : 'Kehtetu sõltuvuse vorming'
    },

    ProjectLines : {
        'Project Start' : 'Projekti algus',
        'Project End'   : 'Projekti lõpp',
        statusDate      : 'Staatuse kuupäev'
    },

    TaskTooltip : {
        Start    : 'Algus',
        End      : 'Lõpp',
        Duration : 'Kestus',
        Complete : 'Lõpeta'
    },

    BasicTaskEdit : {
        editTask        : 'Muuda',
        name            : 'Nimi',
        percentComplete : '% valmis',
        start           : 'Algus',
        finish          : 'Lõpp',
        duration        : 'Kestus'
    },

    AssignmentGrid : {
        Name     : 'Ressursi nimi',
        Units    : 'Üksused',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Kogus',
        cost        : 'Maksumus',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Redigeeri',
        Indent                 : 'Nihutamine paremale',
        Outdent                : 'Nihutamine vasakule',
        'Convert to milestone' : 'Teisenda verstapostiks',
        Add                    : 'Lisa...',
        'New task'             : 'Uus ülesanne',
        'New milestone'        : 'Uus verstapost',
        'Task above'           : 'Ülemine ülesanne',
        'Task below'           : 'Alumine ülesanne',
        'Delete task'          : 'Kustuta',
        Milestone              : 'Verstapost',
        'Sub-task'             : 'Alamülesanne',
        Successor              : 'Järglane',
        Predecessor            : 'Eelkäija',
        changeRejected         : 'Kavandamismootor lükkas muudatused tagasi',
        linkTasks              : 'Lisage sõltuvused',
        unlinkTasks            : 'Eemaldage sõltuvused',
        color                  : 'Värv'
    },

    EventSegments : {
        splitTask : 'Jaga ülesanne'
    },

    Indicators : {
        earlyDates   : 'Varajane algus/lõpp',
        lateDates    : 'Hiline algus/lõpp',
        Start        : 'Algus',
        End          : 'Lõpp',
        deadlineDate : 'Tähtaeg'
    },

    Versions : {
        indented      : 'Taane paremale',
        outdented     : 'Taane vasakule',
        cut           : 'Lõika',
        pasted        : 'Kleebitud',
        deletedTasks  : 'Kustutatud ülesanded',
        propertyNames : {
            baselines                   : 'Alusjooned',
            deadlineDate                : 'Tähtaeg',
            description                 : 'Kirjeldus',
            endDate                     : 'Lõpp kuupäev',
            projectConstraintResolution : 'Projekti piirangute lahendus',
            rollup                      : 'Kokkuvõte',
            taskIconCls                 : 'Ülesande ikoon',
            wbsValue                    : 'Tööjaotuse struktuur'
        }
    },

    ProjectEditor : {
        projectInformation : 'Projekti teave',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Kindral',
        projectName  : 'Projekti nimi',
        start        : 'Alguskuupäev',
        finish       : 'Lõpetamise kuupäev',
        scheduleFrom : 'Ajakava Alates',
        calendar     : 'Kalender',
        readOnly     : 'Ainult lugemiseks',
        forward      : 'Projekti alguskuupäev',
        backward     : 'Projekti lõppkuupäev'
    },

    ProjectEditorDescriptionTab : {
        description : 'Kirjeldus'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Täpsemalt',
        hoursPerDay  : 'Tundi Päevas',
        daysPerWeek  : 'Päevad nädalas',
        daysPerMonth : 'Päevad kuus'
    }
};

export default LocaleHelper.publishLocale(locale);
