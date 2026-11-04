import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Uk.js';
import '../../Grid/localization/Uk.js';

const locale = {

    localeName : 'Uk',
    localeDesc : 'Українська',
    localeCode : 'uk-UA',
    localeRtl  : false,

    Object : {
        newEvent    : 'Створити подію',
        information : 'Інформація',
        showDetails : 'Показати деталі'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' подія' + (data !== 1 ? 's' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Перемкнути стовпець макету ресурсу. SPACE для контекстного меню.'
    },

    Dependencies : {
        from    : 'З',
        to      : 'До',
        valid   : 'Припустимий',
        invalid : 'Неприпустимий'
    },

    DependencyType : {
        SS           : 'ПП',
        SF           : 'ПЗ',
        FS           : 'ЗП',
        FF           : 'ЗЗ',
        StartToStart : 'Початок-початок',
        StartToEnd   : 'Початок-завершення',
        EndToStart   : 'Завершення-початок',
        EndToEnd     : 'Завершення-завершення',
        short        : [
            'ПП',
            'ПЗ',
            'ЗП',
            'ЗЗ'
        ],
        long : [
            'Початок-початок',
            'Початок-завершення',
            'Завершення-початок',
            'Завершення-завершення'
        ]
    },

    DependencyEdit : {
        From              : 'З',
        To                : 'До',
        Type              : 'Тип',
        Lag               : 'Відставання від графіку',
        color             : 'Колір',
        lineStyle         : 'Стиль лінії',
        solid             : 'Суцільна',
        dashed            : 'Пунктирна',
        dotted            : 'Точкова',
        dashDot           : 'Пунктир-точка',
        longDash          : 'Довгий пунктир',
        'Edit dependency' : 'Редагувати залежність',
        Save              : 'Зберегти',
        Delete            : 'Видалити',
        Cancel            : 'Скасувати',
        StartToStart      : 'Початок-початок',
        StartToEnd        : 'Початок‑завершення',
        EndToStart        : 'Завершення‑початок',
        EndToEnd          : 'Завершення‑завершення',
        Active            : 'Активн.'
    },

    EventEdit : {
        Name           : 'Назва',
        Resource       : 'Ресурс',
        Start          : 'Початок',
        startTime      : 'Час початку',
        End            : 'Завершення',
        endTime        : 'Час завершення',
        Save           : 'Зберегти',
        Delete         : 'Видалити',
        Cancel         : 'Скасувати',
        'Edit event'   : 'Редагувати подію',
        Repeat         : 'Повторити',
        editRecurrence : 'Редагувати повторення'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Подія перекриває наявну подію для цього ресурсу',
        noDropOutsideTimeline   : 'За межами цієї часової шкали подію може бути видалено не повністю',
        duplicateAssignmentDrag : 'Подію не можна призначити одному ресурсу кілька разів'
    },

    SchedulerBase : {
        'Add event'      : 'Додати подію',
        'Delete event'   : 'Видалити подію',
        'Unassign event' : 'Скасувати призначення події',
        color            : 'Колір',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, починається о ${startDate} ${eventRecord.duration > 0 ? `на ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Масштаб',
        activeDateRange : 'Діапазон дат',
        startText       : 'Дата початку',
        endText         : 'Дата завершення',
        todayText       : 'Сьогодні'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Часова вісь показує з ${startDate} по ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Копіювати подію',
        cutEvent   : 'Вирізати подію',
        pasteEvent : 'Вставити подію'
    },

    EventFilter : {
        filterEvents : 'Завдання фільтра',
        byName       : 'За іменем'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Показати поточну часову шкалу'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Секунди'
        },
        minuteAndHour : {
            topDateFormat     : 'ддд ММ/ДД, гA',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ддд ММ/ДД',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'День'
        },
        day : {
            name : 'День/години'
        },
        week : {
            name : 'Тиждень/години'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Тиждень/дні'
        },
        dayAndMonth : {
            name : 'Місяць'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Тиждень'
        },
        weekAndMonth : {
            name : 'Тижні'
        },
        weekAndDayLetter : {
            name : 'Тижні/дні тижня'
        },
        weekDateAndMonth : {
            name : 'Місяці/тижні'
        },
        monthAndYear : {
            name : 'Місяці'
        },
        year : {
            name : 'Роки'
        },
        manyYears : {
            name : 'Кілька років'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Ви видаляєте подію',
        'delete-all-message'        : 'Видалити всі екземпляри цієї події?',
        'delete-further-message'    : 'Видалити цей і всі майбутні екземпляри цієї події або лише вибрані екземпляри?',
        'delete-only-this-message'  : 'Ви хочете видалити цю появу цієї події?',
        'delete-further-btn-text'   : 'Видалити всі майбутні події',
        'delete-only-this-btn-text' : 'Видалити лише цю подію',
        'update-title'              : 'Ви змінюєте повторювану подію',
        'update-all-message'        : 'Змінити всі екземпляри цієї події?',
        'update-further-message'    : 'Змінити лише цей екземпляр події чи й усі майбутні екземпляри?',
        'update-only-this-message'  : 'Ви хочете змінити цю появу цієї події?',
        'update-further-btn-text'   : 'Усі майбутні події',
        'update-only-this-btn-text' : 'Лише ця подія',
        Yes                         : 'Так',
        Cancel                      : 'Скасувати',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' і ',
        Daily                           : 'Щоденно',
        'Weekly on {1}'                 : ({ days }) => `Щотижня по ${days}`,
        'Monthly on {1}'                : ({ days }) => `${days} числа кожного місяця`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Щороку ${days} ${months}`,
        'Every {0} days'                : ({ interval }) => `Кожен ${interval}-й день`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Кожен ${interval}-й тиждень, день тижня: ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Кожен ${interval}-й місяць, день тижня: ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Кожен ${interval}-й рік, дата: ${days}, місяць: ${months}`,
        position1                       : 'перший',
        position2                       : 'другий',
        position3                       : 'третій',
        position4                       : 'четвертий',
        position5                       : 'п’ятий',
        'position-1'                    : 'останній',
        day                             : 'дн.',
        weekday                         : 'день тижня',
        'weekend day'                   : 'вихідний день',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Повторити подію',
        Cancel              : 'Скасувати',
        Save                : 'Зберегти',
        Frequency           : 'Періодичність',
        Every               : 'Кожн.',
        DAILYintervalUnit   : 'дн.',
        WEEKLYintervalUnit  : 'тиж.',
        MONTHLYintervalUnit : 'міс.',
        YEARLYintervalUnit  : 'р.',
        Each                : 'Кожн.',
        on                  : 'В',
        the                 : 'В',
        'On the'            : 'В',
        'End repeat'        : 'Завершити повторення',
        'time(s)'           : 'раз',
        Days                : 'день',
        Months              : 'місяць'
    },

    RecurrenceDaysCombo : {
        day           : 'дн.',
        weekday       : 'день тижня',
        'weekend day' : 'вихідний день'
    },

    RecurrencePositionsCombo : {
        position1    : 'перший',
        position2    : 'другий',
        position3    : 'третій',
        position4    : 'четвертий',
        position5    : 'п’ятий',
        'position-1' : 'останній'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Ніколи',
        After     : 'Після',
        'On date' : 'Дата завершення повторення'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Без повтору',
        Daily   : 'Щоденно',
        Weekly  : 'Щотижня в {0}',
        Monthly : 'Щомісячно',
        Yearly  : 'Щорічно'
    },

    RecurrenceCombo : {
        None   : 'Немає',
        Custom : 'Настроювані...'
    },

    Summary : {
        'Summary for' : date => `Резюме для ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Увесь розклад',
        currentview  : 'Видима область розкладу',
        daterange    : 'Діапазон дат',
        completedata : 'Увесь розклад (усі події)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Діапазон розкладу',
        'Export from'    : 'З',
        'Export to'      : 'До'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Одна сторінка'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Одна сторінка (без масштабування)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Кілька сторінок (вертикально)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Немає виділених ресурсів'
    },

    CrudManagerView : {
        serverResponseLabel : 'Відповідь сервера:'
    },

    DurationColumn : {
        Duration : 'Тривалість'
    },

    EventClusteringBase : {
        unnamed         : 'Без назви',
        more            : count => `+ ще ${count}`,
        clusteredEvents : count => `Кластеризовані події: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Кластеризовані діапазони: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Немає',
        assoonaspossible    : 'Якомога швидше',
        aslateaspossible    : 'Якомога пізніше',
        muststarton         : 'Треба почати в',
        mustfinishon        : 'Треба завершити до',
        startnoearlierthan  : 'Почати не раніше, ніж',
        startnolaterthan    : 'Почати не пізніше, ніж',
        finishnoearlierthan : 'Завершити не раніше, ніж',
        finishnolaterthan   : 'Завершити не пізніше, ніж'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} буферний час перед подією`;
            }
            if (postamble) {
                description += `.${postamble.toString()} буферний час після події`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Вперед',
        Backward      : 'Назад',
        inheritedFrom : 'Успадковано від',
        enforcedBy    : 'Застосовано'
    },

    CalendarField : {
        'Default calendar' : 'Стандартний календар',
        editCalendar       : 'Редагувати календар'
    },

    TaskEditorBase : {
        Information   : 'Інформація про завдання',
        Save          : 'Зберегти',
        Cancel        : 'Скасувати',
        Delete        : 'Видалити',
        calculateMask : 'Обчислення...',
        saveError     : 'Не вдається зберегти, спершу виправте помилки',
        repeatingInfo : 'Перегляд повторюваної події',
        editRepeating : 'Редагувати'
    },

    TaskEdit : {
        editEvent              : 'Редагувати подію',
        ConfirmDeletionTitle   : 'Підтвердити видалення',
        ConfirmDeletionMessage : 'Справді видалити подію?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '35em'
    },

    SchedulerGeneralTab : {
        General      : 'Загальне',
        Name         : 'Назва',
        Resources    : 'Ресурси',
        '% complete' : '% виконано',
        Duration     : 'Тривалість',
        Start        : 'Початок',
        Finish       : 'Завершення',
        Effort       : 'Трудозатрати',
        Preamble     : 'Преамбула',
        Postamble    : 'Постамбула'
    },

    GeneralTab : {
        General      : 'Загальне',
        Name         : 'Назва',
        '% complete' : '% виконано',
        Duration     : 'Тривалість',
        Start        : 'Початок',
        Finish       : 'Завершення',
        Effort       : 'Трудозатрати',
        Dates        : 'Дати'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Додаткові',
        Calendar                   : 'Календар',
        'Scheduling mode'          : 'Режим планування',
        'Effort driven'            : 'Планування з фіксованим обсягом роботи',
        'Manually scheduled'       : 'Ручне планування',
        'Constraint type'          : 'Вид обмеження',
        'Constraint date'          : 'Дата обмеження',
        Inactive                   : 'Неактивн.',
        'Ignore resource calendar' : 'Ігнорувати календар ресурсів'
    },

    CalendarEditorDatePicker : {
        addException : 'Додати виняток',
        addWeek      : 'Додайте тиждень'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Додати виняток',
        removeException : 'Видалити виняток',
        noRows          : 'Винятків не додано'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Додайте тиждень',
        removeWeek : 'Видалити тиждень'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Дні робочі за замовчуванням',
        workingTimeCalendar        : 'Календар робочого часу',
        exceptions                 : 'Винятки',
        general                    : 'Загальний',
        name                       : "Ім'я",
        parent                     : 'Батько',
        save                       : 'зберегти',
        weeks                      : 'тижнів',
        error                      : 'Помилка',
        inputErrors                : 'Є помилки введення. Виправте їх, перш ніж зберегти зміни.',
        delete                     : 'Видалити',
        addCalendar                : 'Додайте календар',
        confirmation               : 'Підтвердження',
        removeCalendarWithChildren : 'У календарі є дочірні календарі. Натисніть «Так», щоб видалити календар із дочірніми елементами.',
        removeCalendarAndLinks     : 'Календар використовується деякими записами. Натисніть «Так», щоб від’єднати їх і видалити календар.',
        newException               : 'Новий виняток',
        newWeek                    : 'Новий тиждень'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' працює',
        isNotWorking : ' не працює',
        basedOn      : ' на основі:',
        byDefault    : 'за замовчуванням',
        rangeTpl     : (start, end) => `${start} - ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Робочий день',
        nonWorkingDay : 'Неробочий день'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Є діапазони, що перекриваються',
        errorMissingDate   : 'Необхідно вказати час початку та закінчення',
        errorStartAfterEnd : 'Час початку не може бути після часу завершення'
    },

    CalendarEditorExceptionPanel : {
        name                                 : "Ім'я",
        from                                 : 'Від',
        to                                   : 'до',
        is                                   : 'Є',
        nonWorking                           : 'Неробочий',
        working                              : 'Працює',
        hours                                : 'години',
        repeat                               : 'Повторіть',
        repeatEnd                            : 'Повторити кінець',
        errorMissingDate                     : 'Необхідний діапазон дат винятку',
        errorStartAfterEnd                   : 'Дата «Від» не може бути після дати «До».',
        errorStartAndEndRepeatNumberMismatch : 'Виняток має починатися і закінчуватися однакову кількість разів'
    },

    CalendarEditorWeekPanel : {
        name        : "Ім'я",
        from        : 'Від',
        to          : 'до',
        days        : 'днів',
        copyDay     : 'День копіювання',
        pasteDay    : 'Вставити день',
        stopCopying : 'Припинити копіювання'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Додайте діапазон',
        removeRange : 'Видалити діапазон'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : 'Дата «Від» не може бути після дати «До».',
        errorNoDefaultWeek           : 'Потрібна конфігурація тижня',
        errorMultipleDefaultWeeks    : 'Вказано більше одного тижня за замовчуванням',
        errorNoWeekAvailability      : 'Тиждень повинен передбачати певний робочий час',
        errorInvalidWeekAvailability : 'Тиждень має помилки налаштування робочого часу',
        noRows                       : 'Немає доданих тижнів'
    },

    AdvancedTab : {
        Advanced                   : 'Додаткові',
        Calendar                   : 'Календар',
        'Scheduling mode'          : 'Режим планування',
        'Effort driven'            : 'Планування з фіксованим обсягом роботи',
        'Manually scheduled'       : 'Ручне планування',
        'Constraint type'          : 'Вид обмеження',
        'Constraint date'          : 'Дата обмеження',
        Constraint                 : 'Обмеження',
        Rollup                     : 'Зведення',
        Inactive                   : 'Неактивн.',
        'Ignore resource calendar' : 'Ігнорувати календар ресурсів',
        'Scheduling direction'     : 'Напрямок планування',
        projectBorder              : 'Межа проекту',
        ignore                     : 'Ігнорувати',
        honor                      : 'Честь',
        askUser                    : 'Запитайте користувача'
    },

    DependencyTab : {
        Predecessors      : 'Попередні події',
        Successors        : 'Наступні події',
        ID                : 'Ідентифікатор',
        Name              : 'Назва',
        Type              : 'Тип',
        Lag               : 'Відставання від графіку',
        cyclicDependency  : 'Циклічна залежність',
        invalidDependency : 'Недопустима залежність',
        readOnlyTask      : "Неможливо зв'язати завдання лише для читання"
    },

    NotesTab : {
        Notes : 'Notes'
    },

    ResourceCalendarColumn : {
        calendar : 'Календар'
    },

    ResourceEdit : {
        editResource : 'Редагувати ресурс'
    },

    ResourceEditor : {
        resourceInformation : 'Інформація про ресурс',
        costs               : 'Витрати',
        save                : 'зберегти',
        error               : 'Помилка',
        inputErrors         : 'Є помилки введення. Виправте їх, перш ніж зберегти зміни.',
        delete              : 'Видалити',
        confirmation        : 'Підтвердження',
        removeUsedResource  : 'Ресурс призначений для деяких завдань. Натисніть «Так», щоб все одно видалити ресурс.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Календар',
        general     : 'Загальний',
        label       : 'Етикетка матеріалу',
        name        : 'Назва ресурсу',
        type        : 'Тип',
        costAccrual : 'Нарахування витрат',
        labelHint   : 'наприклад, кг, тонни або ящики',
        maxUnits    : 'Максимальна кількість одиниць'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Нараховувати при',
        prorated : 'Пропорційно',
        start    : 'старт',
        end      : 'Кінець'
    },

    CostAccrualField : {
        prorated : 'Пропорційно',
        start    : 'старт',
        end      : 'Кінець'
    },

    ResourceType : {
        work     : 'Робота',
        material : 'матеріал',
        cost     : 'Вартість'
    },

    ResourceTypeColumn : {
        type : 'Тип'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Таблиця тарифів',
        newGroup     : 'Новий стіл',
        removeGroup  : 'Видалити таблицю',
        useByDefault : 'Використовувати за замовчуванням для призначення ресурсів',
        noRates      : 'Без ставок'
    },

    ResourceGrid : {
        name          : "Ім'я",
        materialLabel : 'Етикетка матеріалу',
        maxUnits      : 'Максимальна кількість одиниць',
        cost          : 'Вартість',
        noRows        : 'Немає ресурсів'
    },

    ResourceRateTableContainer : {
        startDate    : 'Дата початку',
        standardRate : 'Стандартна ставка',
        perUseCost   : 'Вартість використання',
        addRate      : 'Додати ставку',
        removeRate   : 'Зняти ставку',
        name         : "Ім'я",
        noRates      : 'Без ставок'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Інформація про таблицю тарифів'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Кількість',
        Resources   : 'Ресурси',
        Resource    : 'Ресурс',
        Units       : 'Одиниці вимірювання',
        cost        : 'Вартість',
        effort      : 'зусилля',
        start       : 'старт',
        finish      : 'Закінчити',
        preamble    : 'Передмова',
        postamble   : 'Післямова'
    },

    RateTableColumn : {
        rateTable : 'Таблиця тарифів'
    },

    RecurrenceTab : {
        title : 'Повторити'
    },

    SchedulingModePicker : {
        Normal           : 'Звичайний',
        'Fixed Duration' : 'Фіксована тривалість',
        'Fixed Units'    : 'Фіксовані одиниці',
        'Fixed Effort'   : 'Фіксований обсяг роботи'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">виділено {allocated} з {available}</span>',
        barTipOnDate          : '<b>{resource}</b>  {startDate}<br><span class="{cls}">виділено {allocated} з {available}</span>',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} з {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">виділено {allocated} з {available}</span>:<br>{assignments}',
        groupBarTipOnDate     : '{startDate}<br><span class="{cls}">виділено {allocated} з {available}</span>:<br>{assignments}',
        plusMore              : 'Ще +{value}'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Зусилля</div><div class="b-effort-value {cls}">{allocated} з {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Зусилля</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Вартість</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Кількість</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} на {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Підсумок за {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Підсумок за {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} більше',
        nameColumnText        : 'Ресурс / Подія'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Скасувати зміни й нічого не робити',
        schedulingConflict : 'Конфлікт планування',
        emptyCalendar      : 'Помилка конфігурації календаря',
        cycle              : 'Планування циклу',
        Apply              : 'Застосувати'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Виберіть залежність:',
        invalidDependencyLabel : 'Виявлено неприпустимі залежності, проблеми з якими необхідно вирішити:'
    },

    SchedulerProBase : {
        propagating     : 'Обчислення проекту',
        storePopulation : 'Завантаження даних',
        finalizing      : 'Підведення остаточних результатів'
    },

    EventSegments : {
        splitEvent    : 'Розділити подію',
        renameSegment : 'Перейменувати'
    },

    NestedEvents : {
        createGroup         : 'Згрупувати вибрані події',
        newGroupName        : 'Нова група',
        deNestingNotAllowed : 'Скасування вкладень заборонено',
        nestingNotAllowed   : 'Вкладення заборонено'
    },

    VersionGrid : {
        compare       : 'Порівняти',
        description   : 'Опис',
        occurredAt    : 'Сталося о(б)',
        rename        : 'Перейменувати',
        restore       : 'Відновити',
        stopComparing : 'Вийти з режиму порівняння'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'Завдання',
            AssignmentModel : 'Призначення',
            DependencyModel : 'Посилання',
            ProjectModel    : 'Проект',
            ResourceModel   : 'Ресурс',
            other           : 'Об’єкт'
        },
        entityNamesPlural : {
            TaskModel       : 'Завдання',
            AssignmentModel : 'Призначення',
            DependencyModel : 'Посилання',
            ProjectModel    : 'Проекти',
            ResourceModel   : 'Ресурси',
            other           : 'Об’єкти'
        },
        transactionDescriptions : {
            update : 'Змінено {n} {entities}',
            add    : 'Додано {n} {entities}',
            remove : 'Видалено {n} {entities}',
            move   : 'Переміщено {n} {entities}',
            mixed  : 'Змінено {n} {entities}'
        },
        propertyNames : {
            active                   : 'Активний',
            allDay                   : 'Весь день',
            allowOverlap             : 'Дозволити перекриття',
            barMargin                : 'Поле між смугами',
            bidirectional            : 'Двонаправлений',
            calendar                 : 'Календар',
            cls                      : 'CSS клас',
            constraintDate           : 'Дата обмеження',
            constraintType           : 'Тип обмеження',
            daysPerMonth             : 'Днів на місяць',
            daysPerWeek              : 'Днів на тиждень',
            delayFromParent          : 'Затримка від батьківського',
            direction                : 'Напрямок',
            drawDependencies         : 'Малювати залежності',
            duration                 : 'Тривалість',
            durationUnit             : 'Одиниця тривалості',
            effort                   : 'Зусилля',
            effortDriven             : 'Зусилля керовані',
            effortUnit               : 'Одиниця зусиль',
            endDate                  : 'Дата завершення',
            eventColor               : 'Колір',
            eventId                  : 'Ідентифікатор події',
            eventLayout              : 'Макет події',
            eventStyle               : 'Стиль смуги',
            exceptionDates           : 'Дати виключень',
            fixed                    : 'Фіксований',
            from                     : 'Від',
            fromSide                 : 'З боку',
            hoursPerDay              : 'Годин на день',
            href                     : 'Посилання',
            iconCls                  : 'Іконка',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ігнорувати календар ресурсу',
            ignoreTimeZone           : 'Ігнорувати часовий пояс',
            image                    : 'Зображення',
            imageUrl                 : 'URL зображення',
            inactive                 : 'Неактивний',
            intervals                : 'Інтервали',
            lag                      : 'Затримка',
            lagUnit                  : 'Одиниця затримки',
            lineStyle                : 'Стиль лінії',
            manuallyScheduled        : 'Заплановано вручну',
            milestoneWidth           : 'Ширина віхи',
            name                     : 'Назва',
            note                     : 'Примітка',
            parentId                 : 'Ідентифікатор батьківського елемента',
            parentIndex              : 'Позиція',
            percentDone              : '% виконано',
            postamble                : 'Постамбул',
            preamble                 : 'Преамбул',
            readOnly                 : 'Тільки для читання',
            recurrenceRule           : 'Правило повторення',
            resourceId               : 'Ідентифікатор ресурсу',
            resourceMargin           : 'Поле ресурсу',
            rowHeight                : 'Висота рядка',
            schedulingMode           : 'Режим планування',
            segments                 : 'Сегменти',
            showAvatar               : 'Показати аватар',
            showInTimeline           : 'Показати на шкалі часу',
            startDate                : 'Дата початку',
            stickyContents           : 'Прикріплений вміст',
            strokeColor              : 'Колір лінії',
            style                    : 'Стиль',
            target                   : 'Ціль посилання',
            to                       : 'До',
            toSide                   : 'До боку',
            type                     : 'Тип',
            units                    : 'Одиниці',
            unscheduled              : 'Незапланований',
            unspecifiedTimeIsWorking : 'Невизначений час є робочим',
            version                  : 'Версія'
        },
        intervals : {
            working    : 'Робочий',
            nonWorking : 'Неробочий',
            fromTo     : 'Від {from} до {to}',
            recurring  : 'Повторюється, починаючи з {start} і закінчуючи {end}'
        },
        addEntity         : 'Додано {type} **{name}**',
        removeEntity      : 'Видалено {type} **{name}**',
        updateEntity      : 'Змінено {type} **{name}**',
        moveEntity        : 'Переміщено {type} **{name}** з {from} в {to}',
        addDependency     : 'Додано посилання з **{from}** на **{to}**',
        removeDependency  : 'Видалено посилання з **{from}** на **{to}**',
        updateDependency  : 'Редаговано посилання з **{from}** на **{to}**',
        addAssignment     : 'Виділено **{resource}** на **{event}**',
        removeAssignment  : 'Скасовано виділення **{resource}** на **{event}**',
        updateAssignment  : 'Змінено параметри виділення **{resource}** на **{event}**',
        noChanges         : 'Без змін',
        nullValue         : 'немає',
        versionDateFormat : 'М/Д/РРРР г:хв A',
        savedAt           : 'Збережено о {date}',
        autoSavedAt       : 'Автозбережено о {date}',
        undid             : 'Невнесені зміни',
        redid             : 'Повторені зміни',
        editedTask        : 'Відредаговані властивості завдання',
        deletedTask       : 'Завдання видалено',
        movedTask         : 'Переміщене завдання',
        movedTasks        : 'Переміщені завдання'
    }
};

export default LocaleHelper.publishLocale(locale);
