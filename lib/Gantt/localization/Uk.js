import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Uk.js';

const locale = {

    localeName : 'Uk',
    localeDesc : 'Українська',
    localeCode : 'uk-UA',
    localeRtl  : false,

    Object : {
        Save : 'Зберегти'
    },

    CostColumn : {
        cost : 'Вартість'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ігнорувати календар ресурсів'
    },

    InactiveColumn : {
        Inactive : 'Неактивний'
    },

    TaskInfoColumn : {
        info                     : 'Інформація',
        postponedConflictTooltip : 'Існує невирішений конфлікт розкладу з цією подією. Натисніть, щоб вирішити.'
    },

    ActualEffortColumn : {
        actualEffort : 'Фактичні зусилля'
    },

    AddNewColumn : {
        'New Column' : 'Новий стовпець'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Базові зусилля'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Базова дата початку'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Базова дата звершення'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Базова тривалість'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Відхилення від базової дати початку'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Відхилення від базової дати завершення'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Відхилення від базової тривалості'
    },

    CalendarColumn : {
        Calendar : 'Календар'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Ранній початок'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Раннє завершення'
    },

    LateStartDateColumn : {
        'Late Start' : 'Пізній початок'
    },

    LateEndDateColumn : {
        'Late End' : 'Пізнє завершення'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Сумарний резерв часу'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Дата обмеження'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Вид обмеження'
    },

    DeadlineDateColumn : {
        Deadline : 'Термін виконання'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Недопустима залежність'
    },

    DurationColumn : {
        Duration : 'Тривалість'
    },

    EffortColumn : {
        Effort : 'Трудозатрати'
    },

    EndDateColumn : {
        Finish : 'Завершення'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Заплановано вручну'
    },

    MilestoneColumn : {
        Milestone : 'Віха'
    },

    NameColumn : {
        Name : 'Назва'
    },

    NoteColumn : {
        Note : 'Примітка'
    },

    PercentDoneColumn : {
        '% Done' : 'Прогрес, %'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Запланований % виконано'
    },

    PredecessorColumn : {
        Predecessors : 'Попередні події'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Виділені ресурси',
        'more resources'     : 'більше ресурсів'
    },

    RollupColumn : {
        Rollup : 'Зведення'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Режим планування'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Напрямок планування',
        inheritedFrom       : 'Успадковано від',
        enforcedBy          : 'Застосовано'
    },

    SequenceColumn : {
        Sequence : 'Послідовність'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Показати на часовій шкалі'
    },

    StartDateColumn : {
        Start : 'Початок'
    },

    SuccessorColumn : {
        Successors : 'Наступні події'
    },

    TaskCopyPaste : {
        copyTask  : 'Копіювати',
        cutTask   : 'Вирізати',
        pasteTask : 'Вставити'
    },

    WBSColumn : {
        WBS      : 'Ієрархічна структура робіт (WBS)',
        renumber : 'Змінити нумерацію'
    },

    DependencyField : {
        invalidDependencyFormat : 'Недопустимий формат залежності'
    },

    ProjectLines : {
        'Project Start' : 'Початок проекту',
        'Project End'   : 'Завершення проекту',
        statusDate      : 'Статусна дата'
    },

    TaskTooltip : {
        Start    : 'Початок',
        End      : 'Завершення',
        Duration : 'Тривалість',
        Complete : 'Завершено'
    },

    BasicTaskEdit : {
        editTask        : 'Редагувати',
        name            : 'Назва',
        percentComplete : '% виконано',
        start           : 'Початок',
        finish          : 'Завершення',
        duration        : 'Тривалість'
    },

    AssignmentGrid : {
        Name     : 'Назва ресурсу',
        Units    : 'Одиниці вимірювання',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Кількість',
        cost        : 'Вартість',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Редагувати',
        Indent                 : 'Збільшити відступ',
        Outdent                : 'Зменшити відступ',
        'Convert to milestone' : 'Перетворити на віху',
        Add                    : 'Добавити...',
        'New task'             : 'Нове завдання',
        'New milestone'        : 'Нова віха',
        'Task above'           : 'Завдання зверху',
        'Task below'           : 'Завдання знизу',
        'Delete task'          : 'Видалити завдання',
        Milestone              : 'Віха',
        'Sub-task'             : 'Елемент завдання',
        Successor              : 'Наступне завдання',
        Predecessor            : 'Попереднє завдання',
        changeRejected         : 'Планувальник завдань відхилив зміни',
        linkTasks              : 'Додати залежності',
        unlinkTasks            : 'Видалити залежності',
        color                  : 'Колір'
    },

    EventSegments : {
        splitTask : 'Розділити завдання на елементи'
    },

    Indicators : {
        earlyDates   : 'Ранній початок/завершення',
        lateDates    : 'Пізній початок/завершення',
        Start        : 'Початок',
        End          : 'Завершення',
        deadlineDate : 'Термін виконання'
    },

    Versions : {
        indented      : 'Відступ збільшено',
        outdented     : 'Відступ зменшено',
        cut           : 'Вирізати',
        pasted        : 'Вставлено',
        deletedTasks  : 'Видалені завдання',
        propertyNames : {
            baselines                   : 'Базові лінії',
            deadlineDate                : 'Кінцевий термін',
            description                 : 'Опис',
            endDate                     : 'Дата завершення',
            projectConstraintResolution : "Розв'язання обмежень проєкту",
            rollup                      : 'Згортання',
            taskIconCls                 : 'Іконка завдання',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Інформація про проект',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Загальний',
        projectName  : 'Назва проекту',
        start        : 'Дата початку',
        finish       : 'Дата закінчення',
        scheduleFrom : 'Розклад Від',
        calendar     : 'Календар',
        readOnly     : 'Тільки для читання',
        forward      : 'Дата початку проекту',
        backward     : 'Дата закінчення проекту'
    },

    ProjectEditorDescriptionTab : {
        description : 'опис'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Просунутий',
        hoursPerDay  : 'Годин на день',
        daysPerWeek  : 'Днів на тиждень',
        daysPerMonth : 'Днів на місяць'
    }
};

export default LocaleHelper.publishLocale(locale);
