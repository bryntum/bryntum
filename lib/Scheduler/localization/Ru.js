import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Ru.js';
import '../../Grid/localization/Ru.js';

const locale = {

    localeName : 'Ru',
    localeDesc : 'Русский',
    localeCode : 'ru',
    localeRtl  : false,

    Object : {
        newEvent    : 'Новое событие',
        information : 'Информация',
        showDetails : 'Показать детали'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' ' + (data >= 2 && data <= 4 ? 'события' : data !== 1 ? 'событий' : 'событие')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Переключить столбец макета ресурса. SPACE для контекстного меню.'
    },

    Dependencies : {
        from    : 'От',
        to      : 'К',
        valid   : 'Верная',
        invalid : 'Неверная'
    },

    DependencyType : {
        SS           : 'НН',
        SF           : 'НО',
        FS           : 'ОН',
        FF           : 'ОО',
        StartToStart : 'Начало-Начало',
        StartToEnd   : 'Начало-Окончание',
        EndToStart   : 'Окончание-Начало',
        EndToEnd     : 'Окончание-Окончание',
        short        : [
            'НН',
            'НО',
            'ОН',
            'ОО'
        ],
        long : [
            'Начало-Начало',
            'Начало-Окончание',
            'Окончание-Начало',
            'Окончание-Окончание'
        ]
    },

    DependencyEdit : {
        From              : 'От',
        To                : 'К',
        Type              : 'Тип',
        Lag               : 'Запаздывание',
        color             : 'Цвет',
        lineStyle         : 'Стиль линии',
        solid             : 'Сплошная',
        dashed            : 'Пунктирная',
        dotted            : 'Точечная',
        dashDot           : 'Штрих-пунктир',
        longDash          : 'Длинный штрих',
        'Edit dependency' : 'Редактировать зависимость',
        Save              : 'Сохранить',
        Delete            : 'Удалить',
        Cancel            : 'Отменить',
        StartToStart      : 'Начало к Началу',
        StartToEnd        : 'Начало к Окончанию',
        EndToStart        : 'Окончание к Началу',
        EndToEnd          : 'Окончание к Окончанию',
        Active            : 'Действующая'
    },

    EventEdit : {
        Name           : 'Название',
        Resource       : 'Ресурс',
        Start          : 'Начало',
        startTime      : 'Время начала',
        End            : 'Конец',
        endTime        : 'Время окончания',
        Save           : 'Сохранить',
        Delete         : 'Удалить',
        Cancel         : 'Отмена',
        'Edit event'   : 'Изменить событие',
        Repeat         : 'Повтор',
        editRecurrence : 'Редактировать повторение'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Событие перекрывает существующее событие для этого ресурса',
        noDropOutsideTimeline   : 'Событие не может быть отброшено полностью за пределами графика',
        duplicateAssignmentDrag : 'Событие не может быть назначено одному ресурсу несколько раз'
    },

    SchedulerBase : {
        'Add event'      : 'Добавить событие',
        'Delete event'   : 'Удалить событие',
        'Unassign event' : 'Убрать назначение с события',
        color            : 'Цвет',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, начинается в ${startDate} ${eventRecord.duration > 0 ? `на ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Выберите масштаб',
        activeDateRange : 'Диапазон дат',
        startText       : 'Начало',
        endText         : 'Конец',
        todayText       : 'Сегодня'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Временная ось показывает с ${startDate} по ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Копировать событие',
        cutEvent   : 'Вырезать событие',
        pasteEvent : 'Вставить событие'
    },

    EventFilter : {
        filterEvents : 'Фильтровать задачи',
        byName       : 'По имени'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Показать линию текущего времени'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'секунды'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD.MM, HH:mm',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD.MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'день'
        },
        day : {
            name : 'день/часы'
        },
        week : {
            name : 'Неделя/часы'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Неделя/дни'
        },
        dayAndMonth : {
            name : 'месяц'
        },
        weekAndDay : {
            displayDateFormat : 'HH:mm',
            name              : 'неделяa'
        },
        weekAndMonth : {
            name : 'недели'
        },
        weekAndDayLetter : {
            name : 'недели/будние дни'
        },
        weekDateAndMonth : {
            name : 'Месяцы/недели'
        },
        monthAndYear : {
            name : 'Месяцы'
        },
        year : {
            name : 'Годы'
        },
        manyYears : {
            name : 'Meerdere jaren'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Вы удаляете повторяющееся событие',
        'delete-all-message'        : 'Хотите удалить все повторения этого события?',
        'delete-further-message'    : 'Хотите удалить это и все последующие повторения этого события или только выбранное?',
        'delete-only-this-message'  : 'Вы хотите удалить только это повторение этого события?',
        'delete-further-btn-text'   : 'Удалить все будущие повторения',
        'delete-only-this-btn-text' : 'Удалить только это событие',
        'update-title'              : 'Вы изменяете повторяющееся событие',
        'update-all-message'        : 'Изменить все повторения события?',
        'update-further-message'    : 'Изменить только это повторение или это и все последующие повторения события?',
        'update-only-this-message'  : 'Вы хотите изменить только это повторение этого события?',
        'update-further-btn-text'   : 'Все будущие повторения',
        'update-only-this-btn-text' : 'Только это событие',
        Yes                         : 'Да',
        Cancel                      : 'Отменить',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' и ',
        Daily                           : 'Ежедневно',
        'Weekly on {1}'                 : ({ days }) => `Еженедельно (${days})`,
        'Monthly on {1}'                : ({ days }) => `Ежемесячно (день: ${days})`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Ежегодно (день: ${days}, месяц: ${months})`,
        'Every {0} days'                : ({ interval }) => `Каждый ${interval} день`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Каждую ${interval} неделю, день: ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Каждый ${interval} месяц, день: ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Каждый ${interval} год, день: ${days} месяц: ${months}`,
        position1                       : 'первый',
        position2                       : 'второй',
        position3                       : 'третий',
        position4                       : 'четвертый',
        position5                       : 'пятый',
        'position-1'                    : 'последний',
        day                             : 'день',
        weekday                         : 'будний день',
        'weekend day'                   : 'выходной день',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Повторять событие',
        Cancel              : 'Отменить',
        Save                : 'Сохранить',
        Frequency           : 'Как часто',
        Every               : 'Каждый(ую)',
        DAILYintervalUnit   : 'день',
        WEEKLYintervalUnit  : 'неделю',
        MONTHLYintervalUnit : 'месяц',
        YEARLYintervalUnit  : 'год/лет',
        Each                : 'Какого числа',
        on                  : 'В указанный день',
        the                 : 'По',
        'On the'            : 'В следующие дни',
        'End repeat'        : 'Прекратить',
        'time(s)'           : 'раз(а)',
        Days                : 'Дни',
        Months              : 'Месяцы'
    },

    RecurrenceDaysCombo : {
        day           : 'день',
        weekday       : 'будний день',
        'weekend day' : 'выходной день'
    },

    RecurrencePositionsCombo : {
        position1    : 'первый',
        position2    : 'второй',
        position3    : 'третий',
        position4    : 'четвертый',
        position5    : 'пятый',
        'position-1' : 'последний'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Никогда',
        After     : 'После',
        'On date' : 'В дату'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Без повторения',
        Daily   : 'Каждый день',
        Weekly  : 'Каждую неделю',
        Monthly : 'Каждый месяц',
        Yearly  : 'Каждый год'
    },

    RecurrenceCombo : {
        None   : 'Не выбрано',
        Custom : 'Настроить...'
    },

    Summary : {
        'Summary for' : date => `Сводка на ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Полное расписание',
        currentview  : 'Текущая видимая область',
        daterange    : 'Диапазон дат',
        completedata : 'Полное расписание (по всем событиям)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Диапазон расписания',
        'Export from'    : 'С',
        'Export to'      : 'По'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Одна страница'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Одна страница (без масштабирования)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Несколько страниц (вертикально)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Ресурс не назначен'
    },

    CrudManagerView : {
        serverResponseLabel : 'Ответ сервера:'
    },

    DurationColumn : {
        Duration : 'Длительность'
    },

    EventClusteringBase : {
        unnamed         : 'Без имени',
        more            : count => `+ ещё ${count}`,
        clusteredEvents : count => `Сгруппированные события: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Сгруппированные диапазоны: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Нет',
        assoonaspossible    : 'Как можно скорее',
        aslateaspossible    : 'Как можно позже',
        muststarton         : 'Фиксированное начало',
        mustfinishon        : 'Фиксированное окончание',
        startnoearlierthan  : 'Начало не раньше',
        startnolaterthan    : 'Начало не позднее',
        finishnoearlierthan : 'Окончание не раньше',
        finishnolaterthan   : 'Окончание не позднее'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} буферное время до события`;
            }
            if (postamble) {
                description += `.${postamble.toString()} буферное время после события`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Вперед',
        Backward      : 'Назад',
        inheritedFrom : 'Унаследовано от',
        enforcedBy    : 'Задано от'
    },

    CalendarField : {
        'Default calendar' : 'Основной календарь',
        editCalendar       : 'Редактировать календарь'
    },

    TaskEditorBase : {
        Information   : 'Сведения о задаче',
        Save          : 'Сохранить',
        Cancel        : 'Отменить',
        Delete        : 'Удалить',
        calculateMask : 'Рассчитываю задачи...',
        saveError     : 'Сохранение невозможно, исправьте ошибки',
        repeatingInfo : 'Просмотр повторяющегося события',
        editRepeating : 'Редактировать'
    },

    TaskEdit : {
        editEvent              : 'Редактировать событие',
        ConfirmDeletionTitle   : 'Подтвердите удаление',
        ConfirmDeletionMessage : 'Вы уверены, что хотите удалить событие?'
    },

    GanttTaskEditor : {
        editorWidth : '54em'
    },

    SchedulerTaskEditor : {
        editorWidth : '42em'
    },

    SchedulerGeneralTab : {
        General      : 'Основные',
        Name         : 'Имя',
        Resources    : 'Ресурсы',
        '% complete' : '% выполнено',
        Duration     : 'Длительность',
        Start        : 'Начало',
        Finish       : 'Окончание',
        Effort       : 'Трудозатраты',
        Preamble     : 'Вхождение',
        Postamble    : 'Выход'
    },

    GeneralTab : {
        General      : 'Основные',
        Name         : 'Имя',
        '% complete' : '% выполнено',
        Duration     : 'Длительность',
        Start        : 'Начало',
        Finish       : 'Окончание',
        Effort       : 'Трудозатраты',
        Dates        : 'Даты'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Дополнительно',
        Calendar                   : 'Календарь',
        'Scheduling mode'          : 'Тип планирования',
        'Effort driven'            : 'Управляемое трудозатратами',
        'Manually scheduled'       : 'Ручное планирование',
        'Constraint type'          : 'Тип ограничения',
        'Constraint date'          : 'Дата ограничения',
        Inactive                   : 'Неактивна',
        'Ignore resource calendar' : 'Не учитывать календарь ресурса'
    },

    CalendarEditorDatePicker : {
        addException : 'Добавить исключение',
        addWeek      : 'Добавить неделю'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Добавить исключение',
        removeException : 'Удалить исключение',
        noRows          : 'Исключения не добавлены'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Добавить неделю',
        removeWeek : 'Удалить неделю'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'По умолчанию дни рабочие',
        workingTimeCalendar        : 'Календарь рабочего времени',
        exceptions                 : 'Исключения',
        general                    : 'Основное',
        name                       : 'Наименование',
        parent                     : 'Родитель',
        save                       : 'Сохранить',
        weeks                      : 'Недели',
        error                      : 'Ошибка',
        inputErrors                : 'Есть ошибки ввода. Пожалуйста, исправьте их, прежде чем сохранить ваши изменения.',
        delete                     : 'Удалить',
        addCalendar                : 'Добавить календарь',
        confirmation               : 'Подтверждение',
        removeCalendarWithChildren : 'Календарь имеет вложенные календари. Нажмите "Да", чтобы удалить календарь с детьми.',
        removeCalendarAndLinks     : 'Календарь используется некоторыми записями. Нажмите "Да", чтобы отключить их и удалить календарь.',
        newException               : 'Новое исключение',
        newWeek                    : 'Новая неделя'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' рабочий',
        isNotWorking : ' нерабочий',
        basedOn      : ' на основании:',
        byDefault    : 'по умолчанию',
        rangeTpl     : (start, end) => `С ${start} до ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Рабочий день',
        nonWorkingDay : 'Нерабочий день'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Есть перекрывающиеся диапазоны',
        errorMissingDate   : 'Требуется время начала и окончания',
        errorStartAfterEnd : 'Время начала не может быть после окончания'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Наименование',
        from                                 : 'Начало',
        to                                   : 'Окончание',
        is                                   : 'Является',
        nonWorking                           : 'Нерабочим',
        working                              : 'Рабочим',
        hours                                : 'Часы',
        repeat                               : 'Повтор',
        repeatEnd                            : 'Повтор окончания',
        errorMissingDate                     : 'Требуется диапазон дат исключения',
        errorStartAfterEnd                   : 'Дата начала не может быть позже даты окончания',
        errorStartAndEndRepeatNumberMismatch : 'Исключение должно начинаться и заканчиваться такое же количество раз'
    },

    CalendarEditorWeekPanel : {
        name        : 'Наименование',
        from        : 'Начало',
        to          : 'Окончание',
        days        : 'Дни',
        copyDay     : 'Копировать время',
        pasteDay    : 'Вставить время',
        stopCopying : 'Прекратить копировать'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Добавить время',
        removeRange : 'Удалить время'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : 'Дата начала не может быть позже даты окончания',
        errorNoDefaultWeek           : 'Требуется как минимум одна неделя по умолчанию',
        errorMultipleDefaultWeeks    : 'Указано более одной недели по умолчанию',
        errorNoWeekAvailability      : 'Неделя должна определять рабочее время',
        errorInvalidWeekAvailability : 'Неделя имеет ошибки конфигурации рабочего времени',
        noRows                       : 'Недели не добавлены'
    },

    AdvancedTab : {
        Advanced                   : 'Дополнительные',
        Calendar                   : 'Календарь',
        'Scheduling mode'          : 'Тип планирования',
        'Effort driven'            : 'Управляемое трудозатратами',
        'Manually scheduled'       : 'Ручное планирование',
        'Constraint type'          : 'Тип ограничения',
        'Constraint date'          : 'Дата ограничения',
        Constraint                 : 'Ограничение',
        Rollup                     : 'Сведение',
        Inactive                   : 'Неактивна',
        'Ignore resource calendar' : 'Не учитывать календарь ресурса',
        'Scheduling direction'     : 'Направление планирования',
        projectBorder              : 'Граница проекта',
        ignore                     : 'Игнорировать',
        honor                      : 'Соблюдать',
        askUser                    : 'Спросить пользователя'
    },

    DependencyTab : {
        Predecessors      : 'Предшественники',
        Successors        : 'Последователи',
        ID                : 'Идентификатор',
        Name              : 'Имя',
        Type              : 'Тип',
        Lag               : 'Запаздывание',
        cyclicDependency  : 'Обнаружена цикличная зависимость',
        invalidDependency : 'Неверная зависимость',
        readOnlyTask      : 'Невозможно связать задачу только для чтения'
    },

    NotesTab : {
        Notes : 'Заметки'
    },

    ResourceCalendarColumn : {
        calendar : 'Календарь'
    },

    ResourceEdit : {
        editResource : 'Редактировать ресурс'
    },

    ResourceEditor : {
        resourceInformation : 'Сведения о ресурсе',
        costs               : 'Затраты',
        save                : 'Сохранить',
        error               : 'Ошибка',
        inputErrors         : 'Есть ошибки ввода. Пожалуйста, исправьте их, прежде чем сохранять изменения.',
        delete              : 'Удалить',
        confirmation        : 'Подтверждение',
        removeUsedResource  : 'Ресурс закреплен за некоторыми задачами. Нажмите «Да», чтобы все равно удалить ресурс.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Календарь',
        general     : 'Общие',
        label       : 'Метка материала',
        name        : 'Наименование',
        type        : 'Тип',
        costAccrual : 'Начисление затрат',
        labelHint   : 'например, кг, тонны или коробки',
        maxUnits    : 'Макс. единиц'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Начисление затрат',
        prorated : 'Пропорциональное',
        start    : 'В начале',
        end      : 'По окончании'
    },

    CostAccrualField : {
        prorated : 'Пропорциональное',
        start    : 'В начале',
        end      : 'По окончании'
    },

    ResourceType : {
        work     : 'Трудовой',
        material : 'Материальный',
        cost     : 'Затраты'
    },

    ResourceTypeColumn : {
        type : 'Тип'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Таблица ставок',
        newGroup     : 'Новая таблица',
        removeGroup  : 'Удалить таблицу',
        useByDefault : 'Использовать по умолчанию для ресурса.',
        noRates      : 'Нет ставок'
    },

    ResourceGrid : {
        name          : 'Наименование',
        materialLabel : 'Метка материала',
        maxUnits      : 'Макс. единиц',
        cost          : 'Затраты',
        noRows        : 'Нет ресурсов'
    },

    ResourceRateTableContainer : {
        startDate    : 'Дата начала',
        standardRate : 'Стандартная ставка',
        perUseCost   : 'Затраты на использование',
        addRate      : 'Добавить ставку',
        removeRate   : 'Удалить ставку',
        name         : 'Наименование',
        noRates      : 'Нет ставок'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Сведения о таблице ставок'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Количество',
        Resources   : 'Ресурсы',
        Resource    : 'Ресурс',
        Units       : '% Занятости',
        cost        : 'Затраты',
        effort      : 'Трудозатраты',
        start       : 'Начало',
        finish      : 'Окончание',
        preamble    : 'Прелюдия',
        postamble   : 'Заключение'
    },

    RateTableColumn : {
        rateTable : 'Таблица тарифов'
    },

    RecurrenceTab : {
        title : 'Повтор'
    },

    SchedulingModePicker : {
        Normal           : 'Нормальный',
        'Fixed Duration' : 'Фиксированная длительность',
        'Fixed Units'    : 'Фиксированные единицы',
        'Fixed Effort'   : 'Фиксированные трудозатраты'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} из {available}</span> использовано',
        barTipOnDate          : '<b>{resource}</b> {startDate}<br><span class="{cls}">{allocated} из {available}</span> использовано',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} из {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} из {available}</span> использовано:<br>{assignments}',
        groupBarTipOnDate     : '{startDate}<br><span class="{cls}">{allocated} из {available}</span> использовано:<br>{assignments}',
        plusMore              : 'Еще +{value}'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Усилие</div><div class="b-effort-value {cls}">{allocated} из {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Усилие</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Стоимость</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Количество</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} на {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Сводка за {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Сводка за {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} ещё',
        nameColumnText        : 'Ресурс / Событие'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Отменить изменения',
        schedulingConflict : 'Конфликт планирования',
        emptyCalendar      : 'Ошибка данных календаря',
        cycle              : 'Цикл планирования',
        Apply              : 'Применить'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Пожалуйста выберите зависимость для исправления:',
        invalidDependencyLabel : 'Есть неверные зависимости которые необходимо исправить:'
    },

    SchedulerProBase : {
        propagating     : 'Расчет проекта',
        storePopulation : 'Загрузка данных',
        finalizing      : 'Завершение'
    },

    EventSegments : {
        splitEvent    : 'Прервать событие',
        renameSegment : 'Переименовать'
    },

    NestedEvents : {
        createGroup         : 'Сгруппировать выбранные события',
        newGroupName        : 'Новая группа',
        deNestingNotAllowed : 'Извлечение запрещено',
        nestingNotAllowed   : 'Вложение запрещено'
    },

    VersionGrid : {
        compare       : 'Сравнивать',
        description   : 'Описание',
        occurredAt    : 'Произошло в',
        rename        : 'Переименовать',
        restore       : 'Восстановить',
        stopComparing : 'Прекратить сравнение'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'задача',
            AssignmentModel : 'назначение',
            DependencyModel : 'связь',
            ProjectModel    : 'проект',
            ResourceModel   : 'ресурс',
            other           : 'объект'
        },
        entityNamesPlural : {
            TaskModel       : 'задач',
            AssignmentModel : 'назначений',
            DependencyModel : 'связей',
            ProjectModel    : 'проектов',
            ResourceModel   : 'ресурсов',
            other           : 'объектов'
        },
        transactionDescriptions : {
            update : 'Изменено: {n} {entities}',
            add    : 'Добавлено: {n} {entities}',
            remove : 'Удалено: {n} {entities}',
            move   : 'Перемещено {n} {entities}',
            mixed  : 'Изменено: {n} {entities}'
        },
        propertyNames : {
            active                   : 'Активный',
            allDay                   : 'Весь день',
            allowOverlap             : 'Разрешить перекрытие',
            barMargin                : 'Отступ полосы',
            bidirectional            : 'Двунаправленный',
            calendar                 : 'Календарь',
            cls                      : 'CSS класс',
            constraintDate           : 'Дата ограничения',
            constraintType           : 'Тип ограничения',
            daysPerMonth             : 'Дней в месяц',
            daysPerWeek              : 'Дней в неделю',
            delayFromParent          : 'Задержка от родителя',
            direction                : 'Направление',
            drawDependencies         : 'Рисовать зависимости',
            duration                 : 'Продолжительность',
            durationUnit             : 'Единица продолжительности',
            effort                   : 'Трудозатраты',
            effortDriven             : 'Управляется трудозатратами',
            effortUnit               : 'Единица трудозатрат',
            endDate                  : 'Дата окончания',
            eventColor               : 'Цвет',
            eventId                  : 'ID события',
            eventLayout              : 'Макет события',
            eventStyle               : 'Стиль полосы',
            exceptionDates           : 'Исключительные даты',
            fixed                    : 'Фиксированный',
            from                     : 'От',
            fromSide                 : 'Со стороны',
            hoursPerDay              : 'Часов в день',
            href                     : 'Ссылка',
            iconCls                  : 'Иконка',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Игнорировать календарь ресурса',
            ignoreTimeZone           : 'Игнорировать часовой пояс',
            image                    : 'Изображение',
            imageUrl                 : 'URL изображения',
            inactive                 : 'Неактивный',
            intervals                : 'Интервалы',
            lag                      : 'Задержка',
            lagUnit                  : 'Единица задержки',
            lineStyle                : 'Стиль линии',
            manuallyScheduled        : 'Запланировано вручную',
            milestoneWidth           : 'Ширина вехи',
            name                     : 'Имя',
            note                     : 'Примечание',
            parentId                 : 'ID родителя',
            parentIndex              : 'Позиция',
            percentDone              : '% выполнено',
            postamble                : 'Заключение',
            preamble                 : 'Преамбула',
            readOnly                 : 'Только для чтения',
            recurrenceRule           : 'Правило повторения',
            resourceId               : 'ID ресурса',
            resourceMargin           : 'Отступ ресурса',
            rowHeight                : 'Высота строки',
            schedulingMode           : 'Режим планирования',
            segments                 : 'Сегменты',
            showAvatar               : 'Показать аватар',
            showInTimeline           : 'Показать на временной шкале',
            startDate                : 'Дата начала',
            stickyContents           : 'Закреплённое содержимое',
            strokeColor              : 'Цвет линии',
            style                    : 'Стиль',
            target                   : 'Цель ссылки',
            to                       : 'К',
            toSide                   : 'К стороне',
            type                     : 'Тип',
            units                    : 'Единицы',
            unscheduled              : 'Не запланировано',
            unspecifiedTimeIsWorking : 'Неуказанное время является рабочим',
            version                  : 'Версия'
        },
        intervals : {
            working    : 'Рабочий',
            nonWorking : 'Нерабочий',
            fromTo     : 'С {from} до {to}',
            recurring  : 'Повторяющийся начиная с {start} заканчивая {end}'
        },
        addEntity         : 'Добавлено: {type} **{name}**',
        removeEntity      : 'Удалено: {type} **{name}**',
        updateEntity      : 'Изменено: {type} **{name}**',
        moveEntity        : 'Перемещен {type} **{name}** от {from} к {to}',
        addDependency     : 'Добавлена связь **{from}** с **{to}**',
        removeDependency  : 'Удалена связь **{from}** с **{to}**',
        updateDependency  : 'Изменена связь **{from}** с **{to}**',
        addAssignment     : 'Назначен **{resource}** для **{event}**',
        removeAssignment  : 'Удалено назначение **{resource}** для **{event}**',
        updateAssignment  : 'Изменено назначение **{resource}** для **{event}**',
        noChanges         : 'Нет изменений',
        nullValue         : 'ничто',
        versionDateFormat : 'D/M/YYYY HH:mm',
        savedAt           : 'Сохранено в {date}',
        autoSavedAt       : 'Автосохранено в {date}',
        undid             : 'Отмена изменений',
        redid             : 'Возвращение изменений',
        editedTask        : 'Изменены свойства задачи',
        deletedTask       : 'Удалена задача',
        movedTask         : 'Задача перемещена',
        movedTasks        : 'Задачи перемещены'
    }
};

export default LocaleHelper.publishLocale(locale);
