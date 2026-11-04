import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Bg.js';

const locale = {

    localeName : 'Bg',
    localeDesc : 'Български',
    localeCode : 'bg',
    localeRtl  : false,

    Object : {
        Save : 'Запис'
    },

    CostColumn : {
        cost : 'цена'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Игнориране на ресурсния календар'
    },

    InactiveColumn : {
        Inactive : 'Неактивен'
    },

    TaskInfoColumn : {
        info                     : 'Информация',
        postponedConflictTooltip : 'Има неразрешен конфликт на планиране с това събитие. Кликнете, за да го разрешите.'
    },

    ActualEffortColumn : {
        actualEffort : 'Реални усилия'
    },

    AddNewColumn : {
        'New Column' : 'Нова колона'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Базови усилия'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Baseline Start'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Baseline End'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Baseline Duration'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Start Variance'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'End Variance'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Отклонение на продължителността'
    },

    CalendarColumn : {
        Calendar : 'Календар'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Ранен старт'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Ранен край'
    },

    LateStartDateColumn : {
        'Late Start' : 'Късен старт'
    },

    LateEndDateColumn : {
        'Late End' : 'Късен край'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Пълно бездействие'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Дата на ограничението'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Тип ограничение'
    },

    DeadlineDateColumn : {
        Deadline : 'Краен срок'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Невалидна зависимост'
    },

    DurationColumn : {
        Duration : 'Продължителност'
    },

    EffortColumn : {
        Effort : 'Усилие'
    },

    EndDateColumn : {
        Finish : 'Край'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Ръчно планирано'
    },

    MilestoneColumn : {
        Milestone : 'Ключово събитие'
    },

    NameColumn : {
        Name : 'Име'
    },

    NoteColumn : {
        Note : 'Забележка'
    },

    PercentDoneColumn : {
        '% Done' : '% готови'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Планиран % изпълнено'
    },

    PredecessorColumn : {
        Predecessors : 'Предшественици'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Присвоени ресурси',
        'more resources'     : 'повече ресурси'
    },

    RollupColumn : {
        Rollup : 'Сводка'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Режим на планиране'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Посока на графика',
        inheritedFrom       : 'Наследени от',
        enforcedBy          : 'Наложени от'
    },

    SequenceColumn : {
        Sequence : 'Последователност'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Показване в хронологията'
    },

    StartDateColumn : {
        Start : 'Начало'
    },

    SuccessorColumn : {
        Successors : 'Приемници'
    },

    TaskCopyPaste : {
        copyTask  : 'Копирай',
        cutTask   : 'Изрежи',
        pasteTask : 'Постави'
    },

    WBSColumn : {
        WBS      : 'Структура на разпределение на работата',
        renumber : 'Преномериране'
    },

    DependencyField : {
        invalidDependencyFormat : 'Невалиден формат на зависимост'
    },

    ProjectLines : {
        'Project Start' : 'Начало на проект',
        'Project End'   : 'Край на проект',
        statusDate      : 'Статусна дата'
    },

    TaskTooltip : {
        Start    : 'Старт',
        End      : 'Край',
        Duration : 'Продължителност',
        Complete : 'Приключи'
    },

    BasicTaskEdit : {
        editTask        : 'Редактиране',
        name            : 'Име',
        percentComplete : '% завършено',
        start           : 'Начало',
        finish          : 'Край',
        duration        : 'Продължителност'
    },

    AssignmentGrid : {
        Name     : 'Име на ресурс',
        Units    : 'Единици',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Количество',
        cost        : 'Цена',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Редактиране',
        Indent                 : 'Увеличаване на ниво',
        Outdent                : 'Намаляване на ниво',
        'Convert to milestone' : 'Преобразуване в етап',
        Add                    : 'Добавяне...',
        'New task'             : 'Нова задача',
        'New milestone'        : 'Ново ключово събитие',
        'Task above'           : 'Задача по-горе',
        'Task below'           : 'Задача по-долу',
        'Delete task'          : 'Изтриване',
        Milestone              : 'Етап',
        'Sub-task'             : 'Подзадача',
        Successor              : 'Приемник',
        Predecessor            : 'Предшественик',
        changeRejected         : 'Механизмът за планиране отхвърли промените',
        linkTasks              : 'Добавяне на зависимости',
        unlinkTasks            : 'Премахване на зависимости',
        color                  : 'цвят'
    },

    EventSegments : {
        splitTask : 'Разделяне на задача'
    },

    Indicators : {
        earlyDates   : 'Ранно начало/край',
        lateDates    : 'Късно начало/край',
        Start        : 'Старт',
        End          : 'Край',
        deadlineDate : 'Краен срок'
    },

    Versions : {
        indented      : 'С отстъп',
        outdented     : 'Без отстъп',
        cut           : 'Изрязване',
        pasted        : 'Вмъкнато',
        deletedTasks  : 'Изтрити задачи',
        propertyNames : {
            baselines                   : 'Базови линии',
            deadlineDate                : 'Краен срок',
            description                 : 'Описание',
            endDate                     : 'Крайна дата',
            projectConstraintResolution : 'Решение на ограниченията на проекта',
            rollup                      : 'Обобщение',
            taskIconCls                 : 'Икона на задача',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Информация за проекта',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'генерал',
        projectName  : 'Име на проекта',
        start        : 'Начална дата',
        finish       : 'Крайна дата',
        scheduleFrom : 'График от',
        calendar     : 'Календар',
        readOnly     : 'Само за четене',
        forward      : 'Начална дата на проекта',
        backward     : 'Крайна дата на проекта'
    },

    ProjectEditorDescriptionTab : {
        description : 'Описание'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Разширено',
        hoursPerDay  : 'Часове на ден',
        daysPerWeek  : 'Дни в седмицата',
        daysPerMonth : 'Дни на месец'
    }
};

export default LocaleHelper.publishLocale(locale);
