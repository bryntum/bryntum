import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Ru.js';

const locale = {

    localeName : 'Ru',
    localeDesc : 'Русский',
    localeCode : 'ru',
    localeRtl  : false,

    Object : {
        Save : 'Сохранить'
    },

    CostColumn : {
        cost : 'Затраты'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Не учитывать календарь ресурса'
    },

    InactiveColumn : {
        Inactive : 'Неактивна'
    },

    TaskInfoColumn : {
        info                     : 'Информация',
        postponedConflictTooltip : 'Данная задача имеет неразрешенный конфликт планирования. Нажмите, чтобы разрешить его.'
    },

    ActualEffortColumn : {
        actualEffort : 'Фактические трудозатраты'
    },

    AddNewColumn : {
        'New Column' : 'Добавить столбец...'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Базовые трудозатраты'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Базовое начало'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Базовое окончание'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Базовая длительность'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Отклонение начала'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Отклонение окончания'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Отклонение длительности'
    },

    CalendarColumn : {
        Calendar : 'Календарь'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Раннее начало'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Раннее окончание'
    },

    LateStartDateColumn : {
        'Late Start' : 'Позднее начало'
    },

    LateEndDateColumn : {
        'Late End' : 'Позднее окончание'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Общий временной резерв'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Дата ограничения'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Тип ограничения'
    },

    DeadlineDateColumn : {
        Deadline : 'Крайний срок'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Неверная зависимость'
    },

    DurationColumn : {
        Duration : 'Длительность'
    },

    EffortColumn : {
        Effort : 'Трудозатраты'
    },

    EndDateColumn : {
        Finish : 'Конец'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Ручное планирование'
    },

    MilestoneColumn : {
        Milestone : 'Веха'
    },

    NameColumn : {
        Name : 'Наименование задачи'
    },

    NoteColumn : {
        Note : 'Примечание'
    },

    PercentDoneColumn : {
        '% Done' : '% завершения'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Запланированный % выполнения'
    },

    PredecessorColumn : {
        Predecessors : 'Предшествующие'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Назначенные ресурсы',
        'more resources'     : 'ресурсов'
    },

    RollupColumn : {
        Rollup : 'Сведение'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Режим'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Напрвление планирования',
        inheritedFrom       : 'Унаследовано от',
        enforcedBy          : 'Задано от'
    },

    SequenceColumn : {
        Sequence : '#'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Показать на временной шкале'
    },

    StartDateColumn : {
        Start : 'Начало'
    },

    SuccessorColumn : {
        Successors : 'Последующие'
    },

    TaskCopyPaste : {
        copyTask  : 'Копировать',
        cutTask   : 'Вырезать',
        pasteTask : 'Вставить'
    },

    WBSColumn : {
        WBS      : 'СДР',
        renumber : 'Обновить'
    },

    DependencyField : {
        invalidDependencyFormat : 'Неверный формат зависимости'
    },

    ProjectLines : {
        'Project Start' : 'Начало проекта',
        'Project End'   : 'Окончание проекта',
        statusDate      : 'Дата статуса'
    },

    TaskTooltip : {
        Start    : 'Начинается',
        End      : 'Заканчивается',
        Duration : 'Длительность',
        Complete : 'Выполнено'
    },

    BasicTaskEdit : {
        editTask        : 'Редактировать',
        name            : 'Имя',
        percentComplete : '% завершено',
        start           : 'Начало',
        finish          : 'Завершение',
        duration        : 'Продолжительность'
    },

    AssignmentGrid : {
        Name     : 'Имя ресурса',
        Units    : 'Занятость',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Количество',
        cost        : 'Затраты',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Изменить',
        Indent                 : 'Понизить уровень',
        Outdent                : 'Повысить уровень',
        'Convert to milestone' : 'Преобразовать в веху',
        Add                    : 'Добавить...',
        'New task'             : 'Новая задача',
        'New milestone'        : 'Новая веха',
        'Task above'           : 'Задачу выше',
        'Task below'           : 'Задачу ниже',
        'Delete task'          : 'Удалить',
        Milestone              : 'Веху',
        'Sub-task'             : 'Под-задачу',
        Successor              : 'Последующую задачу',
        Predecessor            : 'Предшествующую задачу',
        changeRejected         : 'Изменения отклонены системой',
        linkTasks              : 'Добавить зависимости',
        unlinkTasks            : 'Удалить зависимости',
        color                  : 'Цвет'
    },

    EventSegments : {
        splitTask : 'Прервать задачу'
    },

    Indicators : {
        earlyDates   : 'Раннее начало/окончание',
        lateDates    : 'Позднее начало/окончание',
        Start        : 'Начало',
        End          : 'Конец',
        deadlineDate : 'Крайний срок'
    },

    Versions : {
        indented      : 'Уровень понижен',
        outdented     : 'Уровень повышен',
        cut           : 'Вырезано',
        pasted        : 'Вставлено',
        deletedTasks  : 'Удаленные задачи',
        propertyNames : {
            baselines                   : 'Базовые линии',
            deadlineDate                : 'Крайний срок',
            description                 : 'Описание',
            endDate                     : 'Дата завершения',
            projectConstraintResolution : 'Разрешение ограничений проекта',
            rollup                      : 'Сводка',
            taskIconCls                 : 'Иконка задачи',
            wbsValue                    : 'Иерархическая структура работ'
        }
    },

    ProjectEditor : {
        projectInformation : 'Информация о проекте',
        editorWidth        : 420
    },

    ProjectEditorGeneralTab : {
        general      : 'Общие',
        projectName  : 'Название проекта',
        start        : 'Дата начала',
        finish       : 'Дата окончания',
        scheduleFrom : 'Планирование от',
        calendar     : 'Календарь',
        readOnly     : 'Только чтение',
        forward      : 'Даты начала проекта',
        backward     : 'Даты окончания проекта'
    },

    ProjectEditorDescriptionTab : {
        description : 'Описание'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Расширенные',
        hoursPerDay  : 'Часов в дне',
        daysPerWeek  : 'Дней в неделе',
        daysPerMonth : 'Дней в месяце'
    }
};

export default LocaleHelper.publishLocale(locale);
