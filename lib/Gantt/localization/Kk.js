import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Kk.js';

const locale = {

    localeName : 'Kk',
    localeDesc : 'Қазақ тілі (KZ)',
    localeCode : 'kk-KZ',
    localeRtl  : false,

    Object : {
        Save : 'Сақтау'
    },

    CostColumn : {
        cost : 'Құны'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ресурс күнтізбесін елемеу'
    },

    InactiveColumn : {
        Inactive : 'Белсенді емес'
    },

    TaskInfoColumn : {
        info                     : 'Ақпарат',
        postponedConflictTooltip : 'Бұл оқиғамен шешілмеген жоспарлау қайшылығы бар. Оны шешу үшін басыңыз.'
    },

    ActualEffortColumn : {
        actualEffort : 'Нақты күш'
    },

    AddNewColumn : {
        'New Column' : 'Жаңа баған'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Базалық күш'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Негізгі басталу уақыты'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Негізгі аяқталу уақыты'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Негізгі ұзақтығы'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Басталу уақытының өзгеруі'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Аяқталу уақытының өзгеруі'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Ұзақтықтың өзгеруі'
    },

    CalendarColumn : {
        Calendar : 'Күнтізбе'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Ерте бастау'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Ерте аяқтау'
    },

    LateStartDateColumn : {
        'Late Start' : 'Кещ бастау'
    },

    LateEndDateColumn : {
        'Late End' : 'Кеш аяқтау('
    },

    TotalSlackColumn : {
        'Total Slack' : 'Жалпы уақыт резерві'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Шектеу күні'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Шектеу түрі'
    },

    DeadlineDateColumn : {
        Deadline : 'Мерзімнің аяқталу күні'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Жарамсыз тәуелділік'
    },

    DurationColumn : {
        Duration : 'Ұзақтығы'
    },

    EffortColumn : {
        Effort : 'Жұмыс көлемі'
    },

    EndDateColumn : {
        Finish : 'Аяқталу'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Қолмен жоспарланды'
    },

    MilestoneColumn : {
        Milestone : 'Меже'
    },

    NameColumn : {
        Name : 'Аты'
    },

    NoteColumn : {
        Note : 'Ескертпе'
    },

    PercentDoneColumn : {
        '% Done' : '% дайын'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Жоспарланған % Орындалды'
    },

    PredecessorColumn : {
        Predecessors : 'Ізашарлар'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Тағайындалған ресурстар',
        'more resources'     : 'тағы басқа ресурстар'
    },

    RollupColumn : {
        Rollup : 'Айналдыру'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Жоспарлау режимі'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Жоспарлау бағыты',
        inheritedFrom       : 'Иеленген',
        enforcedBy          : 'Орындаған'
    },

    SequenceColumn : {
        Sequence : 'Реттілік'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Уақыт шкаласымен көрсету'
    },

    StartDateColumn : {
        Start : 'Басталу'
    },

    SuccessorColumn : {
        Successors : 'Ізбасарлар'
    },

    TaskCopyPaste : {
        copyTask  : 'Көшіру',
        cutTask   : 'Қию',
        pasteTask : 'Қою'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Қайта нөмірлендіру'
    },

    DependencyField : {
        invalidDependencyFormat : 'Жарамсыз тәуелділік форматы'
    },

    ProjectLines : {
        'Project Start' : 'Жобаның басталуы',
        'Project End'   : 'Жобаның аяқталуы',
        statusDate      : 'Күй күні'
    },

    TaskTooltip : {
        Start    : 'Басталу',
        End      : 'Аяқталуы',
        Duration : 'Ұзақтығы',
        Complete : 'Орындалды'
    },

    BasicTaskEdit : {
        editTask        : 'Тапсырманы өңдеу',
        name            : 'Атауы',
        percentComplete : '% аяқталды',
        start           : 'Бастау',
        finish          : 'Аяқтау',
        duration        : 'Ұзақтығы'
    },

    AssignmentGrid : {
        Name     : 'Ресурс аты',
        Units    : 'Бірліктер',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Саны',
        cost        : 'Құны',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Өңдеу',
        Indent                 : 'Шегініс',
        Outdent                : 'Шығыңқы',
        'Convert to milestone' : 'Межеге түрлендіру',
        Add                    : '... қосу',
        'New task'             : 'Жаңа тапсырма',
        'New milestone'        : 'Жаңа меже',
        'Task above'           : 'Жоғарыдағы тапсырма',
        'Task below'           : 'Төмендегі тапсырма',
        'Delete task'          : 'Жою',
        Milestone              : 'Меже',
        'Sub-task'             : 'Ішкі тапсырма',
        Successor              : 'Ізбасар',
        Predecessor            : 'Ізашар',
        changeRejected         : 'Жоспарлау жүйесі өзгерісті қабылдамады',
        linkTasks              : 'Тәуелділіктерді қосу',
        unlinkTasks            : 'Тәуелділіктерді жою',
        color                  : 'Түсі'
    },

    EventSegments : {
        splitTask : 'Тапсырманы бөлу'
    },

    Indicators : {
        earlyDates   : 'Ерте бастау/аяқтау',
        lateDates    : 'Кеш бастау/аяқтау',
        Start        : 'Басталуы',
        End          : 'Аяқталуы',
        deadlineDate : 'Мерзімінің аяқталу күні'
    },

    Versions : {
        indented      : 'шегініс жасалған',
        outdented     : 'шығыңқы',
        cut           : 'қию',
        pasted        : 'қойылды',
        deletedTasks  : 'жойылған тапсырмалар',
        propertyNames : {
            baselines                   : 'Базалық сызықтар',
            deadlineDate                : 'Мерзім',
            description                 : 'Сипаттама',
            endDate                     : 'Аяқталу күні',
            projectConstraintResolution : 'Жоба шектеулерін шешу',
            rollup                      : 'Жинақтау',
            taskIconCls                 : 'Тапсырма белгішесі',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Жоба туралы ақпарат',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Жалпы',
        projectName  : 'Жоба атауы',
        start        : 'Басталу күні',
        finish       : 'Аяқталу күні',
        scheduleFrom : 'Кестеден бастап',
        calendar     : 'Күнтізбе',
        readOnly     : 'Тек оқу',
        forward      : 'Жобаның басталу күні',
        backward     : 'Жобаның аяқталу күні'
    },

    ProjectEditorDescriptionTab : {
        description : 'Сипаттама'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Жетілдірілген',
        hoursPerDay  : 'Күніне сағат',
        daysPerWeek  : 'Аптасына күндер',
        daysPerMonth : 'Айына күндер'
    }
};

export default LocaleHelper.publishLocale(locale);
