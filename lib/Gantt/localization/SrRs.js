import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/SrRs.js';

const locale = {

    localeName : 'SrRs',
    localeDesc : 'Српски (ћирилица)',
    localeCode : 'sr-RS',
    localeRtl  : false,

    Object : {
        Save : 'Сачувај'
    },

    CostColumn : {
        cost : 'Трошкови'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Игнориши календар ресурса'
    },

    InactiveColumn : {
        Inactive : 'Неактивно'
    },

    TaskInfoColumn : {
        info                     : 'Инфо',
        postponedConflictTooltip : 'Постоји нерешен сукоб заказивања са овим догађајем. Кликните да бисте то решили.'
    },

    ActualEffortColumn : {
        actualEffort : 'Тренутни напор'
    },

    AddNewColumn : {
        'New Column' : 'Нова колона'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Основни напор'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Почетак основне линије'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Завршетак основне линије'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Трајање основне линије'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Почетак променљиве'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Завршетак променљиве'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Трајање променљиве'
    },

    CalendarColumn : {
        Calendar : 'Календар'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Рани почетак'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Рани завршетак'
    },

    LateStartDateColumn : {
        'Late Start' : 'Касни почетак'
    },

    LateEndDateColumn : {
        'Late End' : 'Касни крај'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Укупан размак'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Датум ограничења'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Тип ограничења'
    },

    DeadlineDateColumn : {
        Deadline : 'Рок завршетка'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Погрешна зависност'
    },

    DurationColumn : {
        Duration : 'Трајање'
    },

    EffortColumn : {
        Effort : 'Напор'
    },

    EndDateColumn : {
        Finish : 'Завршетак'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Ручно заказано'
    },

    MilestoneColumn : {
        Milestone : 'Граничник'
    },

    NameColumn : {
        Name : 'Име'
    },

    NoteColumn : {
        Note : 'Напомена'
    },

    PercentDoneColumn : {
        '% Done' : '% завршено'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Планирано % Готово'
    },

    PredecessorColumn : {
        Predecessors : 'Претходника'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Додељени ресурси',
        'more resources'     : 'још ресурса'
    },

    RollupColumn : {
        Rollup : 'Закључење'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Режим заказивања'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Смер заказивања',
        inheritedFrom       : 'Наслеђено од',
        enforcedBy          : 'Примењује'
    },

    SequenceColumn : {
        Sequence : 'Низ'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Прикажи у временском року'
    },

    StartDateColumn : {
        Start : 'Почетак'
    },

    SuccessorColumn : {
        Successors : 'Наследници'
    },

    TaskCopyPaste : {
        copyTask  : 'Копирај',
        cutTask   : 'Исеци',
        pasteTask : 'Налепи'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Промени нумерацију'
    },

    DependencyField : {
        invalidDependencyFormat : 'Погрешан формат зависности'
    },

    ProjectLines : {
        'Project Start' : 'Почетак пројекта',
        'Project End'   : 'Завршетак пројекта',
        statusDate      : 'Статус Датум'
    },

    TaskTooltip : {
        Start    : 'Почетак',
        End      : 'Крај',
        Duration : 'Трајање',
        Complete : 'Завршено'
    },

    BasicTaskEdit : {
        editTask        : 'Уреди',
        name            : 'Име',
        percentComplete : '% завршено',
        start           : 'Почетак',
        finish          : 'Завршетак',
        duration        : 'Трајање'
    },

    AssignmentGrid : {
        Name     : 'Име ресурса',
        Units    : 'Јединице',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Количина',
        cost        : 'Трошак',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Уреди',
        Indent                 : 'Увлачење',
        Outdent                : 'Извлачење',
        'Convert to milestone' : 'Конвертуј у граничник',
        Add                    : 'Додај...',
        'New task'             : 'Нови задатак',
        'New milestone'        : 'Нови граничник',
        'Task above'           : 'Задатак изнад',
        'Task below'           : 'Задатак испод',
        'Delete task'          : 'Избриши',
        Milestone              : 'Граничник',
        'Sub-task'             : 'Под-задатак',
        Successor              : 'Наследник',
        Predecessor            : 'Претходник',
        changeRejected         : 'Енџин за заказивање одбацио је промене',
        linkTasks              : 'Додај зависности',
        unlinkTasks            : 'Уклони зависности',
        color                  : 'Боја'
    },

    EventSegments : {
        splitTask : 'Подели задатак'
    },

    Indicators : {
        earlyDates   : 'Рани почетак/крај',
        lateDates    : 'Касни почетак/крај',
        Start        : 'Почетак',
        End          : 'Крај',
        deadlineDate : 'Рок'
    },

    Versions : {
        indented      : 'Увучено',
        outdented     : 'Избачено',
        cut           : 'Исеци',
        pasted        : 'Налепљено',
        deletedTasks  : 'Обрисани задаци',
        propertyNames : {
            baselines                   : 'Основне линије',
            deadlineDate                : 'Рок',
            description                 : 'Опис',
            endDate                     : 'Датум завршетка',
            projectConstraintResolution : 'Решавање ограничења пројекта',
            rollup                      : 'Сумирање',
            taskIconCls                 : 'Икона задатка',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Информације о пројекту',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Опште',
        projectName  : 'Назив пројекта',
        start        : 'Датум почетка',
        finish       : 'Датум завршетка',
        scheduleFrom : 'Планирање од',
        calendar     : 'Календар',
        readOnly     : 'Само за читање',
        forward      : 'Датум почетка пројекта',
        backward     : 'Датум завршетка пројекта'
    },

    ProjectEditorDescriptionTab : {
        description : 'Опис'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Напредно',
        hoursPerDay  : 'Сати у дану',
        daysPerWeek  : 'Дана у недељи',
        daysPerMonth : 'Дана у месецу'
    }
};

export default LocaleHelper.publishLocale(locale);
