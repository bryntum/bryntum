import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Bg.js';
import '../../Grid/localization/Bg.js';

const locale = {

    localeName : 'Bg',
    localeDesc : 'Български',
    localeCode : 'bg',
    localeRtl  : false,

    Object : {
        newEvent    : 'Ново събитие',
        information : 'Информация',
        showDetails : 'Покажи подробности'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' събити' + (data !== 1 ? 'я' : 'е')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Превключване на колоната за оформление на ресурса. SPACE за контекстно меню.'
    },

    Dependencies : {
        from    : 'От',
        to      : 'До',
        valid   : 'Валидно',
        invalid : 'Невалидно'
    },

    DependencyType : {
        SS           : 'НН',
        SF           : 'НК',
        FS           : 'КН',
        FF           : 'КК',
        StartToStart : 'От начало до начало',
        StartToEnd   : 'От начало до край',
        EndToStart   : 'От край до начало',
        EndToEnd     : 'От край до край',
        short        : [
            'НН',
            'НК',
            'КН',
            'КК'
        ],
        long : [
            'От начало до начало',
            'От начало до край',
            'От край до начало',
            'От край до край'
        ]
    },

    DependencyEdit : {
        From              : 'От',
        To                : 'До',
        Type              : 'Тип',
        Lag               : 'Забавяне',
        color             : 'Цвят',
        lineStyle         : 'Стил на линията',
        solid             : 'Плътна',
        dashed            : 'Прекъсната',
        dotted            : 'Точкова',
        dashDot           : 'Тире-точка',
        longDash          : 'Дълго тире',
        'Edit dependency' : 'Редактиране на зависимостта',
        Save              : 'Запис',
        Delete            : 'Изтриване',
        Cancel            : 'Отказ',
        StartToStart      : 'От начало до начало',
        StartToEnd        : 'От начало до край',
        EndToStart        : 'От край до начало',
        EndToEnd          : 'От край до край',
        Active            : 'Активен'
    },

    EventEdit : {
        Name           : 'Име',
        Resource       : 'Ресурс',
        Start          : 'Начало',
        startTime      : 'Начално време',
        End            : 'Край',
        endTime        : 'Крайно време',
        Save           : 'Запис',
        Delete         : 'Изтриване',
        Cancel         : 'Отказ',
        'Edit event'   : 'Редактиране на събитие',
        Repeat         : 'Повторение',
        editRecurrence : 'Редактиране на повторение'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Събитието се припокрива със съществуващо събитие за този ресурс',
        noDropOutsideTimeline   : 'Събитието не може да бъде изхвърлено изцяло извън времевата линия',
        duplicateAssignmentDrag : 'Събитието не може да бъде назначено на един и същ ресурс многократно'
    },

    SchedulerBase : {
        'Add event'      : 'Добавяне на събитие',
        'Delete event'   : 'Изтриване на събитие',
        'Unassign event' : 'Отмяна на събитието',
        color            : 'цвят',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, започва в ${startDate} ${eventRecord.duration > 0 ? `за ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Мащабиране',
        activeDateRange : 'Диапазон на датите',
        startText       : 'Начална дата',
        endText         : 'Крайна дата',
        todayText       : 'Днес'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Времева ос показва от ${startDate} до ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Събитие за копиране',
        cutEvent   : 'Прекъсване на събитието',
        pasteEvent : 'Събитие за вмъкване'
    },

    EventFilter : {
        filterEvents : 'Задачи за филтриране',
        byName       : 'По име'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Показване на текуша хронология'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Секунди'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD.MM, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD.MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Ден'
        },
        day : {
            name : 'Ден/часа'
        },
        week : {
            name : 'Седмица/часа'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Седмица/дни'
        },
        dayAndMonth : {
            name : 'Месец'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Седмица'
        },
        weekAndMonth : {
            name : 'Седмици'
        },
        weekAndDayLetter : {
            name : 'Седмици/делници'
        },
        weekDateAndMonth : {
            name : 'Месеци/седмици'
        },
        monthAndYear : {
            name : 'Месеци'
        },
        year : {
            name : 'Години'
        },
        manyYears : {
            name : 'Много години'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Вие изтривате събитие',
        'delete-all-message'        : 'Искате ли да изтриете всички повторения на това събитие?',
        'delete-further-message'    : 'Искате ли да изтриете това и всички бъдещи повторения на това събитие, или само избраното повторение?',
        'delete-only-this-message'  : 'Искате ли да изтриете това събитие?',
        'delete-further-btn-text'   : 'Изтриване на всички бъдещи събития',
        'delete-only-this-btn-text' : 'Изтриване само на това събитие',
        'update-title'              : 'Променяте повтарящо се събитие',
        'update-all-message'        : 'Искате ли промяна на всички повторения на това събитие?',
        'update-further-message'    : 'Искате ли да промените само това повторение на събитието или тази и всички бъдещи повторения?',
        'update-only-this-message'  : 'Искате ли да промените това събитие?',
        'update-further-btn-text'   : 'Всички бъдещи събития',
        'update-only-this-btn-text' : 'Само това събитие',
        Yes                         : 'Да',
        Cancel                      : 'Отказ',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' и ',
        Daily                           : 'Ежедневно',
        'Weekly on {1}'                 : ({ days }) => `Ежеседмично на ${days}`,
        'Monthly on {1}'                : ({ days }) => `Ежемесечно на ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) =>  `Ежегодно на ${days} на ${months}`,
        'Every {0} days'                : ({ interval }) => `На всеки ${interval} дни`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `На всеки ${interval} седмици на ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `На всеки ${interval} месеца на ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `На всеки ${interval} години на ${days} от ${months}`,
        position1                       : 'първия',
        position2                       : 'втория',
        position3                       : 'третия',
        position4                       : 'четвъртия',
        position5                       : 'петия',
        'position-1'                    : 'последния',
        day                             : 'дни',
        weekday                         : 'ден от седмицата',
        'weekend day'                   : 'ден от уикенда',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Повтаряне на събития',
        Cancel              : 'Отказ',
        Save                : 'Запис',
        Frequency           : 'Честота',
        Every               : 'Всеки',
        DAILYintervalUnit   : 'ден(дни)',
        WEEKLYintervalUnit  : 'седмица(и)',
        MONTHLYintervalUnit : 'месец(и)',
        YEARLYintervalUnit  : 'година(и)',
        Each                : 'Всеки',
        on                  : 'на посочения ден',
        the                 : 'във',
        'On the'            : 'На',
        'End repeat'        : 'Край на повторението',
        'time(s)'           : 'път(и)',
        Days                : 'Дни',
        Months              : 'Месеци'
    },

    RecurrenceDaysCombo : {
        day           : 'ден',
        weekday       : 'ден от седмицата',
        'weekend day' : 'ден от уикенда'
    },

    RecurrencePositionsCombo : {
        position1    : 'първи',
        position2    : 'втори',
        position3    : 'трети',
        position4    : 'четвърти',
        position5    : 'пети',
        'position-1' : 'последния'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Никога',
        After     : 'След',
        'On date' : 'На дата'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Без повторение',
        Daily   : 'Ежедневно',
        Weekly  : 'Ежеседмично',
        Monthly : 'Ежемесечно',
        Yearly  : 'Ежегодно'
    },

    RecurrenceCombo : {
        None   : 'Няма',
        Custom : 'Потребителски...'
    },

    Summary : {
        'Summary for' : date => `Резюме за ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Пълен график',
        currentview  : 'Видим график',
        daterange    : 'Диапазон на датите',
        completedata : 'Пълен график (за всички събития)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Диапазон на графика',
        'Export from'    : 'От',
        'Export to'      : 'До'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Единична страница'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Единична страница (без мащабиране)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Множество страници (вертикално)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Няма назначен ресурс'
    },

    CrudManagerView : {
        serverResponseLabel : 'Отговор на сървъра:'
    },

    DurationColumn : {
        Duration : 'Продължителност'
    },

    EventClusteringBase : {
        unnamed         : 'Без име',
        more            : count => `+ още ${count}`,
        clusteredEvents : count => `Групирани събития: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Групирани диапазони: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Няма',
        assoonaspossible    : 'Възможно най-скоро',
        aslateaspossible    : 'Възможно най-късно',
        muststarton         : 'Трябва да започне на',
        mustfinishon        : 'Трябва да свърши на',
        startnoearlierthan  : 'Начало не по-рано от',
        startnolaterthan    : 'Начало не по-късно от',
        finishnoearlierthan : 'Край не по-рано от',
        finishnolaterthan   : 'Край не по-късно от'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} време за буфер преди събитието`;
            }
            if (postamble) {
                description += `.${postamble.toString()} време за буфер след събитието`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Напред',
        Backward      : 'Назад',
        inheritedFrom : 'Наследени от',
        enforcedBy    : 'Наложени от'
    },

    CalendarField : {
        'Default calendar' : 'Календар по подразбиране',
        editCalendar       : 'Редактиране на календар'
    },

    TaskEditorBase : {
        Information   : 'Информация за задачата',
        Save          : 'Запис',
        Cancel        : 'Отказ',
        Delete        : 'Изтриване',
        calculateMask : 'Изчисляване...',
        saveError     : 'Невъзможен запис, моля, първо коригирайте грешките',
        repeatingInfo : 'Преглед на повтарящо се събитие',
        editRepeating : 'Редактиране'
    },

    TaskEdit : {
        editEvent              : 'Редактиране на събитие',
        ConfirmDeletionTitle   : 'Потвърждаване на изтриване',
        ConfirmDeletionMessage : 'Сигурни ли сте, че желаете да изтриете събитието?'
    },

    GanttTaskEditor : {
        editorWidth : '50em'
    },

    SchedulerTaskEditor : {
        editorWidth : '38em'
    },

    SchedulerGeneralTab : {
        General      : 'Обща информация',
        Name         : 'Име',
        Resources    : 'Ресурси',
        '% complete' : '% завършени',
        Duration     : 'Продължителност',
        Start        : 'Старт',
        Finish       : 'Край',
        Effort       : 'Усилие',
        Preamble     : 'Увод',
        Postamble    : 'Послеслов'
    },

    GeneralTab : {
        General      : 'Обща информация',
        Name         : 'Име',
        '% complete' : '% завършени',
        Duration     : 'Продължителност',
        Start        : 'Начало',
        Finish       : 'Край',
        Effort       : 'Усилие',
        Dates        : 'Дати'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Разширени',
        Calendar                   : 'Календар',
        'Scheduling mode'          : 'Режим на планиране',
        'Effort driven'            : 'Effort driven',
        'Manually scheduled'       : 'Ръчно планирано',
        'Constraint type'          : 'Тип ограничение',
        'Constraint date'          : 'Дата на ограничението',
        Inactive                   : 'Неактивен',
        'Ignore resource calendar' : 'Игнориране на ресурсния календар'
    },

    CalendarEditorDatePicker : {
        addException : 'Добавете изключение',
        addWeek      : 'Добавете седмица'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Добавете изключение',
        removeException : 'Премахнете изключението',
        noRows          : 'Няма добавени изключения'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Добавете седмица',
        removeWeek : 'Премахване на седмицата'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Дните работят по подразбиране',
        workingTimeCalendar        : 'Календар на работното време',
        exceptions                 : 'Изключения',
        general                    : 'Общ',
        name                       : 'Име',
        parent                     : 'Родител',
        save                       : 'Запазете',
        weeks                      : 'Седмици',
        error                      : 'Грешка',
        inputErrors                : 'Има входни грешки. Моля, поправете ги, преди да запазите промените си.',
        delete                     : 'Изтрий',
        addCalendar                : 'Добавете календар',
        confirmation               : 'Потвърждение',
        removeCalendarWithChildren : 'Календарът има детски календари. Щракнете върху „Да“, за да премахнете календара с децата си.',
        removeCalendarAndLinks     : 'Календарът се използва от някои записи. Кликнете върху „Да“, за да ги разгърнете и премахнете календара.',
        newException               : 'Ново изключение',
        newWeek                    : 'Нова седмица'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' работи',
        isNotWorking : ' не работи',
        basedOn      : ' базиран на:',
        byDefault    : 'по подразбиране',
        rangeTpl     : (start, end) => `${start} до ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Работен ден',
        nonWorkingDay : 'Неработен ден'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Има припокриващи се диапазони',
        errorMissingDate   : 'Изисква се начало и крайно време',
        errorStartAfterEnd : 'Времето за начало не може да бъде след крайното време'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Име',
        from                                 : 'От',
        to                                   : 'Да се',
        is                                   : 'Е',
        nonWorking                           : 'Неработещ',
        working                              : 'Работа',
        hours                                : 'Часа',
        repeat                               : 'Повторете',
        repeatEnd                            : 'Повторете край',
        errorMissingDate                     : 'Изисква се диапазон на дата на изключение',
        errorStartAfterEnd                   : 'Дата „от“ не може да бъде след датата „до“ ',
        errorStartAndEndRepeatNumberMismatch : 'Изключението трябва да започне и да приключи един и същ брой пъти'
    },

    CalendarEditorWeekPanel : {
        name        : 'Име',
        from        : 'От',
        to          : 'Да се',
        days        : 'Дни',
        copyDay     : 'Копиращ ден',
        pasteDay    : 'Ден на паста',
        stopCopying : 'Спрете да копирате'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Добавете обхват',
        removeRange : 'Премахване на обхвата'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : 'Дата „от“ не може да бъде след датата „до“ ',
        errorNoDefaultWeek           : 'Необходима е конфигурация на седмицата',
        errorMultipleDefaultWeeks    : 'Посочени е повече от една седмица по подразбиране',
        errorNoWeekAvailability      : 'Седмицата трябва да осигури малко работно време',
        errorInvalidWeekAvailability : 'Седмицата има грешки в конфигурацията на работното време',
        noRows                       : 'Няма добавени седмици'
    },

    AdvancedTab : {
        Advanced                   : 'Разширени',
        Calendar                   : 'Календар',
        'Scheduling mode'          : 'Режим на планиране',
        'Effort driven'            : 'Effort driven',
        'Manually scheduled'       : 'Ръчно планирано',
        'Constraint type'          : 'Тип ограничение',
        'Constraint date'          : 'Дата на ограничението',
        Constraint                 : 'Ограничение',
        Rollup                     : 'Сводка',
        Inactive                   : 'Неактивен',
        'Ignore resource calendar' : 'Игнориране на ресурсния календар',
        'Scheduling direction'     : 'Насочване на графика',
        projectBorder              : 'Граница на проекта',
        ignore                     : 'Игнорирайте',
        honor                      : 'Чест',
        askUser                    : 'Попитайте потребителя'
    },

    DependencyTab : {
        Predecessors      : 'Предшественици',
        Successors        : 'Приемници',
        ID                : 'Идентификатор',
        Name              : 'Име',
        Type              : 'Тип',
        Lag               : 'Забавяне',
        cyclicDependency  : 'Циклична зависимост',
        invalidDependency : 'Невалидна зависимост',
        readOnlyTask      : 'Задача само за четене не може да бъде свързвана'
    },

    NotesTab : {
        Notes : 'Бележки'
    },

    ResourceCalendarColumn : {
        calendar : 'Календар'
    },

    ResourceEdit : {
        editResource : 'Редактиране на ресурс'
    },

    ResourceEditor : {
        resourceInformation : 'Информация за ресурса',
        costs               : 'Разходи',
        save                : 'Запазване',
        error               : 'Грешка',
        inputErrors         : 'Има грешки при въвеждане. Моля, коригирайте ги, преди да запазите промените си.',
        delete              : 'Изтриване',
        confirmation        : 'Потвърждение',
        removeUsedResource  : 'Ресурсът е присвоен на някои задачи. Щракнете върху „Да“, за да премахнете ресурса въпреки това.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Календар',
        general     : 'генерал',
        label       : 'Етикет на материала',
        name        : 'Име на ресурса',
        type        : 'Тип',
        costAccrual : 'Натрупване на разходи',
        labelHint   : 'например кг, тонове или кутии',
        maxUnits    : 'Макс единици'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Натрупване на',
        prorated : 'Пропорционално',
        start    : 'Започнете',
        end      : 'Край'
    },

    CostAccrualField : {
        prorated : 'Пропорционално',
        start    : 'Започнете',
        end      : 'Край'
    },

    ResourceType : {
        work     : 'работа',
        material : 'Материал',
        cost     : 'цена'
    },

    ResourceTypeColumn : {
        type : 'Тип'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Таблица с цените',
        newGroup     : 'Нова маса',
        removeGroup  : 'Премахване на масата',
        useByDefault : 'Използва се по подразбиране за присвояването на ресурси',
        noRates      : 'Няма ставки'
    },

    ResourceGrid : {
        name          : 'Име',
        materialLabel : 'Етикет на материала',
        maxUnits      : 'Макс единици',
        cost          : 'цена',
        noRows        : 'Няма ресурси'
    },

    ResourceRateTableContainer : {
        startDate    : 'Начална дата',
        standardRate : 'Стандартна ставка',
        perUseCost   : 'Цена за използване',
        addRate      : 'Добавете процент',
        removeRate   : 'Премахване на процент',
        name         : 'Име',
        noRates      : 'Няма ставки'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Информация за таблицата с тарифи'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Количество',
        Resources   : 'Ресурси',
        Resource    : 'Ресурс',
        Units       : 'Единици',
        cost        : 'цена',
        effort      : 'Усилие',
        start       : 'Започнете',
        finish      : 'Завършете',
        preamble    : 'Прелюдия',
        postamble   : 'Заключение'
    },

    RateTableColumn : {
        rateTable : 'Таблица с цените'
    },

    RecurrenceTab : {
        title : 'Повторение'
    },

    SchedulingModePicker : {
        Normal           : 'Нормално',
        'Fixed Duration' : 'Фиксирана продължителност',
        'Fixed Units'    : 'Фиксирани единици',
        'Fixed Effort'   : 'Фиксирано усилие'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} от {available}</span> са разпределени',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} от {available}</span> са разпределени',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} от {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} от {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'На {startDate}<br><span class="{cls}">{allocated} от {available}</span> са разпределени:<br>{assignments}',
        plusMore              : '+{value} още'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Усилие</div><div class="b-effort-value {cls}">{allocated} от {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Усилие</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Разход</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Количество</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} на {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Обобщение за {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Обобщение за {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} още',
        nameColumnText        : 'Ресурс / Събитие'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Отмяна на промяната и не предприемай нищо',
        schedulingConflict : 'Конфликт при планирането',
        emptyCalendar      : 'Грешка в конфигурацията на календара',
        cycle              : 'Цикъл на планиране',
        Apply              : 'Приложи'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Моля, изберете зависимост:',
        invalidDependencyLabel : 'Съществуват невалидни зависимости, които трябва да бъдат разгледани:'
    },

    SchedulerProBase : {
        propagating     : 'Изчисляване на проект',
        storePopulation : 'Зареждане на данни...',
        finalizing      : 'Финализиране на резултатите'
    },

    EventSegments : {
        splitEvent    : 'Разделяне на събитие',
        renameSegment : 'Преименуване'
    },

    NestedEvents : {
        createGroup         : 'Групиране на избрани събития',
        newGroupName        : 'Нова група',
        deNestingNotAllowed : 'Не е разрешено премахването',
        nestingNotAllowed   : 'Вмъкването не е разрешено'
    },

    VersionGrid : {
        compare       : 'Сравни',
        description   : 'Описание',
        occurredAt    : 'Случи се в',
        rename        : 'Преименуване',
        restore       : 'Възстановяване',
        stopComparing : 'Прекрати сравняването'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'задача',
            AssignmentModel : 'възложена задача',
            DependencyModel : 'връзка',
            ProjectModel    : 'проект',
            ResourceModel   : 'ресурс',
            other           : 'обект'
        },
        entityNamesPlural : {
            TaskModel       : 'задачи',
            AssignmentModel : 'възложени задачи',
            DependencyModel : 'връзки',
            ProjectModel    : 'проекти',
            ResourceModel   : 'ресурси',
            other           : 'обекти'
        },
        transactionDescriptions : {
            update : 'Променени {n} {entities}',
            add    : 'Добавени {n} {entities}',
            remove : 'Премахнати {n} {entities}',
            move   : 'Преместени {n} {entities}',
            mixed  : 'Променени {n} {entities}'
        },
        propertyNames : {
            active                   : 'Активен',
            allDay                   : 'Цял ден',
            allowOverlap             : 'Позволи припокриване',
            barMargin                : 'Разстояние на лентата',
            bidirectional            : 'Двунасочен',
            calendar                 : 'Календар',
            cls                      : 'CSS клас',
            constraintDate           : 'Дата на ограничение',
            constraintType           : 'Тип на ограничение',
            daysPerMonth             : 'Дни на месец',
            daysPerWeek              : 'Дни на седмица',
            delayFromParent          : 'Забавяне от родител',
            direction                : 'Посока',
            drawDependencies         : 'Начертай зависимости',
            duration                 : 'Продължителност',
            durationUnit             : 'Единица за продължителност',
            effort                   : 'Усилие',
            effortDriven             : 'Водено от усилие',
            effortUnit               : 'Единица за усилие',
            endDate                  : 'Крайна дата',
            eventColor               : 'Цвят',
            eventId                  : 'Идентификатор на събитие',
            eventLayout              : 'Разположение на събитие',
            eventStyle               : 'Стил на лента',
            exceptionDates           : 'Дати на изключение',
            fixed                    : 'Фиксиран',
            from                     : 'От',
            fromSide                 : 'От страна',
            hoursPerDay              : 'Часове на ден',
            href                     : 'Връзка',
            iconCls                  : 'Икона',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Игнорирай календар на ресурса',
            ignoreTimeZone           : 'Игнорирай часовата зона',
            image                    : 'Изображение',
            imageUrl                 : 'URL на изображение',
            inactive                 : 'Неактивен',
            intervals                : 'Интервали',
            lag                      : 'Забавяне',
            lagUnit                  : 'Единица за забавяне',
            lineStyle                : 'Стил на линия',
            manuallyScheduled        : 'Ръчно планирано',
            milestoneWidth           : 'Ширина на етап',
            name                     : 'Име',
            note                     : 'Бележка',
            parentId                 : 'Идентификатор на родител',
            parentIndex              : 'Позиция',
            percentDone              : '% завършено',
            postamble                : 'Постамбъл',
            preamble                 : 'Преамбъл',
            readOnly                 : 'Само за четене',
            recurrenceRule           : 'Правило за повторение',
            resourceId               : 'Идентификатор на ресурс',
            resourceMargin           : 'Разстояние на ресурс',
            rowHeight                : 'Височина на ред',
            schedulingMode           : 'Режим на планиране',
            segments                 : 'Сегменти',
            showAvatar               : 'Покажи аватар',
            showInTimeline           : 'Покажи в времева линия',
            startDate                : 'Начална дата',
            stickyContents           : 'Лепкаво съдържание',
            strokeColor              : 'Цвят на линия',
            style                    : 'Стил',
            target                   : 'Цел на връзка',
            to                       : 'До',
            toSide                   : 'До страна',
            type                     : 'Тип',
            units                    : 'Единици',
            unscheduled              : 'Непланирано',
            unspecifiedTimeIsWorking : 'Неопределено време е работно',
            version                  : 'Версия'
        },
        intervals : {
            working    : 'Работен',
            nonWorking : 'Неработен',
            fromTo     : 'От {from} до {to}',
            recurring  : 'Повтарящ се започващ {start} завършващ {end}'
        },
        addEntity         : 'Добавено {type} **{name}**',
        removeEntity      : 'Премахнато {type} **{name}**',
        updateEntity      : 'Променено {type} **{name}**',
        moveEntity        : 'Преместено {type} **{name}** от {from} до {to}',
        addDependency     : 'Добавена е връзка от **{from}** до **{to}**',
        removeDependency  : 'Премахната е връзка от **{from}** до **{to}**',
        updateDependency  : 'Редактирана е връзка от **{from}** до **{to}**',
        addAssignment     : 'Възложен **{resource}** на **{event}**',
        removeAssignment  : 'Премахната е възложена задача от **{resource}** от **{event}**',
        updateAssignment  : 'Редактирана е възложена задача от **{resource}** от **{event}**',
        noChanges         : 'Без промяна',
        nullValue         : 'няма',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Запазено на {date}',
        autoSavedAt       : 'Автоматично запазено на {date}',
        undid             : 'Неотменени промени',
        redid             : 'Повторни промени',
        editedTask        : 'Редактирани свойства на задачата',
        deletedTask       : 'Изтрита е задача',
        movedTask         : 'Преместена е задача',
        movedTasks        : 'Преместени задачи'
    }
};

export default LocaleHelper.publishLocale(locale);
