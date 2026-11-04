import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/SrRs.js';
import '../../Grid/localization/SrRs.js';

const locale = {

    localeName : 'SrRs',
    localeDesc : 'Српски (ћирилица)',
    localeCode : 'sr-RS',
    localeRtl  : false,

    Object : {
        newEvent    : 'Нови догађај',
        information : 'Информација',
        showDetails : 'Прикажи детаље'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' догађај' + (data !== 1 ? 'с' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Пребаци колону распореда ресурса. SPACE за контекст мени.'
    },

    Dependencies : {
        from    : 'Од',
        to      : 'До',
        valid   : 'Важећи',
        invalid : 'Неважеће'
    },

    DependencyType : {
        SS           : 'ПП',
        SF           : 'ПЗ',
        FS           : 'ЗП',
        FF           : 'ЗЗ',
        StartToStart : 'Од почетка ка почетку',
        StartToEnd   : 'Од почетка ка завршетку',
        EndToStart   : 'Од завршетка ка почетку',
        EndToEnd     : 'Од завршетка ка завршетку',
        short        : [
            'ПП',
            'ПЗ',
            'ЗП',
            'ЗЗ'
        ],
        long : [
            'Од почетка ка почетку',
            'Од почетка ка завршетку',
            'Од завршетка ка почетку',
            'Од завршетка ка завршетку'
        ]
    },

    DependencyEdit : {
        From              : 'Од',
        To                : 'До',
        Type              : 'Тип',
        Lag               : 'Кашњење',
        color             : 'Боја',
        lineStyle         : 'Стил линије',
        solid             : 'Пуна',
        dashed            : 'Испрекидана',
        dotted            : 'Тачкаста',
        dashDot           : 'Црта-тачка',
        longDash          : 'Дуга црта',
        'Edit dependency' : 'Уреди зависност',
        Save              : 'Сачувај',
        Delete            : 'Избриши',
        Cancel            : 'Откажи',
        StartToStart      : 'Од почетка ка почетку',
        StartToEnd        : 'Од почетка до завршетка',
        EndToStart        : 'Од почетка до краја',
        EndToEnd          : 'С краја на крај',
        Active            : 'Активан'
    },

    EventEdit : {
        Name           : 'Име',
        Resource       : 'Ресурс',
        Start          : 'Почетак',
        startTime      : 'Время начала',
        End            : 'Крај',
        endTime        : 'Время окончания',
        Save           : 'Сачувај',
        Delete         : 'Избриши',
        Cancel         : 'Откажи',
        'Edit event'   : 'Уреди догађај',
        Repeat         : 'Понови',
        editRecurrence : 'Уреди понављање'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Догађај се преклапа са постојећим догађајем за овај ресурс',
        noDropOutsideTimeline   : 'Догађај можда неће бити одбачен потпуно изван временске осе',
        duplicateAssignmentDrag : 'Događaj se ne može dodeliti istom resursu više puta'
    },

    SchedulerBase : {
        'Add event'      : 'Додај догађај',
        'Delete event'   : 'Избриши догађај',
        'Unassign event' : 'Опозови доделу догађаја',
        color            : 'Боја',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, почиње у ${startDate} ${eventRecord.duration > 0 ? `траје ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Зумирај',
        activeDateRange : 'Опсег датума',
        startText       : 'Датум почетка',
        endText         : 'Датум завршетка',
        todayText       : 'Данас'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Временска ос показује од ${startDate} до ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Копирај догађај',
        cutEvent   : 'Исеци догађај',
        pasteEvent : 'Налепи догађај'
    },

    EventFilter : {
        filterEvents : 'Филтрирај задатке',
        byName       : 'Према називу'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Прикажи тренутну временску осу'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Секунди'
        },
        minuteAndHour : {
            topDateFormat     : 'ддд, MM.ДД, hA',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ддд, MM.ДД.',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Дан'
        },
        day : {
            name : 'Дан/сати'
        },
        week : {
            name : 'Седмица/сати'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Седмица/дани'
        },
        dayAndMonth : {
            name : 'Mесец'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Седмица'
        },
        weekAndMonth : {
            name : 'Недеља'
        },
        weekAndDayLetter : {
            name : 'Седмице/радни дани'
        },
        weekDateAndMonth : {
            name : 'Месеци/седмице'
        },
        monthAndYear : {
            name : 'Месеци'
        },
        year : {
            name : 'Године'
        },
        manyYears : {
            name : 'Више година'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Бришете догађај',
        'delete-all-message'        : 'Желите ли да избришете сва појављивања овог догађаја?',
        'delete-further-message'    : 'Желите ли да избришете ово и сва будућа појављивања овог догађаја или само изабрано појављивање?',
        'delete-only-this-message'  : 'Вы хотите удалить это появление этого события?',
        'delete-further-btn-text'   : 'Избриши све будуће догађаје',
        'delete-only-this-btn-text' : 'Избриши само овај догађај',
        'update-title'              : 'Мењате догађај који се понавља',
        'update-all-message'        : 'Желите ли да промените сва појављивања овог догађаја?',
        'update-further-message'    : 'Желите ли да промените само ово појављивање догађаја или ово и сва будућа појављивања?',
        'update-only-this-message'  : 'Вы хотите изменить это появление этого события?',
        'update-further-btn-text'   : 'Сви будући догађаји',
        'update-only-this-btn-text' : 'Само овај догађај',
        Yes                         : 'Да',
        Cancel                      : 'Откажи',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' и ',
        Daily                           : 'Свакодневно',
        'Weekly on {1}'                 : ({ days }) => `Недељно током ${days}`,
        'Monthly on {1}'                : ({ days }) => `Mесечно током ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Годишње током ${days} of ${months}`,
        'Every {0} days'                : ({ interval }) => `На ${interval} дана`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `На ${interval} седмице/а дана ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `На ${interval} месеца/и дана ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `На ${interval} године/а ${days} месеца ${months}`,
        position1                       : 'први',
        position2                       : 'други',
        position3                       : 'трећи',
        position4                       : 'четврти',
        position5                       : 'пети',
        'position-1'                    : 'последњи',
        day                             : 'дан',
        weekday                         : 'радни дан',
        'weekend day'                   : 'дан викенда',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Понављај догађај',
        Cancel              : 'Откажи',
        Save                : 'Сачувај',
        Frequency           : 'Учесталост',
        Every               : 'На',
        DAILYintervalUnit   : 'дан(а)',
        WEEKLYintervalUnit  : 'седмица(е)',
        MONTHLYintervalUnit : 'месец(и)',
        YEARLYintervalUnit  : 'година(е)',
        Each                : 'Сваки',
        on                  : 'на',
        the                 : 'на',
        'On the'            : 'На дан',
        'End repeat'        : 'Заврши понављање',
        'time(s)'           : 'пут(а)',
        Days                : 'дана',
        Months              : 'месеци'
    },

    RecurrenceDaysCombo : {
        day           : 'дан',
        weekday       : 'радни дан',
        'weekend day' : 'дан викенда'
    },

    RecurrencePositionsCombo : {
        position1    : 'први',
        position2    : 'second',
        position3    : 'трећи',
        position4    : 'четврти',
        position5    : 'пети',
        'position-1' : 'последње'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Никад',
        After     : 'након',
        'On date' : 'На датум'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Без понављања',
        Daily   : 'Свакодневно',
        Weekly  : 'Седмично {0}',
        Monthly : 'Месечно',
        Yearly  : 'Годишње'
    },

    RecurrenceCombo : {
        None   : 'Ниједно',
        Custom : 'Прилагођено...'
    },

    Summary : {
        'Summary for' : date => `Резиме за ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Целокупан распоред',
        currentview  : 'Видљиви распоред',
        daterange    : 'Опсег датума',
        completedata : 'Целокупан распоред (за све догађаје)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Опсег распореда',
        'Export from'    : 'Од',
        'Export to'      : 'До'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Једна страница'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Једна страница (непромењена)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Више страница (вертикално)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Нису додељени ресурси'
    },

    CrudManagerView : {
        serverResponseLabel : 'Одговор сервера:'
    },

    DurationColumn : {
        Duration : 'Трајање'
    },

    EventClusteringBase : {
        unnamed         : 'Без имена',
        more            : count => `+ још ${count}`,
        clusteredEvents : count => `Груписани догађаји: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Груписани опсези: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Ниједно',
        assoonaspossible    : 'Што је пре могуће',
        aslateaspossible    : 'Што је касније могуће',
        muststarton         : 'Мора да почне дана',
        mustfinishon        : 'Мора да се заврши дана',
        startnoearlierthan  : 'Почетак не пре',
        startnolaterthan    : 'Почетак не касније од',
        finishnoearlierthan : 'Заврши не пре',
        finishnolaterthan   : 'Заврши не касније од'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} време бафера пре догађаја`;
            }
            if (postamble) {
                description += `.${postamble.toString()} време бафера после догађаја`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Унапред',
        Backward      : 'Уназад',
        inheritedFrom : 'Наслеђено од',
        enforcedBy    : 'Примењује'
    },

    CalendarField : {
        'Default calendar' : 'Подразумевани календар',
        editCalendar       : 'Уредите календар'
    },

    TaskEditorBase : {
        Information   : 'Информације о задатку',
        Save          : 'Сачувај',
        Cancel        : 'Откажи',
        Delete        : 'Избриши',
        calculateMask : 'Израчунавање...',
        saveError     : 'Чување није могуће, прво исправите грешке',
        repeatingInfo : 'Приказивање догађаја који се понавља',
        editRepeating : 'Уреди'
    },

    TaskEdit : {
        editEvent              : 'Уредите догађај',
        ConfirmDeletionTitle   : 'Потврди брисање',
        ConfirmDeletionMessage : 'Желите ли заиста да избришете овај догађај?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '35em'
    },

    SchedulerGeneralTab : {
        General      : 'General',
        Name         : 'Име',
        Resources    : 'Ресурси',
        '% complete' : '% довршености',
        Duration     : 'Трајање',
        Start        : 'Почетак',
        Finish       : 'Завршетак',
        Effort       : 'Рад',
        Preamble     : 'Преамбула',
        Postamble    : 'Постамбула'
    },

    GeneralTab : {
        General      : 'Опште',
        Name         : 'Име',
        '% complete' : '% довршености',
        Duration     : 'Трајање',
        Start        : 'Почетак',
        Finish       : 'Завршетак',
        Effort       : 'Напор',
        Dates        : 'Датуми'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Напредно',
        Calendar                   : 'Календар',
        'Scheduling mode'          : 'Режим заказивања',
        'Effort driven'            : 'Утрошени напор',
        'Manually scheduled'       : 'Ручно заказано',
        'Constraint type'          : 'Тип ограничења',
        'Constraint date'          : 'Датум ограничења',
        Inactive                   : 'Неактивно',
        'Ignore resource calendar' : 'Игнориши календар ресурса'
    },

    CalendarEditorDatePicker : {
        addException : 'Додајте изузетак',
        addWeek      : 'Додајте недељу'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Додајте изузетак',
        removeException : 'Уклони изузетак',
        noRows          : 'Нема додатих изузетака'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Додајте недељу',
        removeWeek : 'Уклоните недељу'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Дани раде подразумевано',
        workingTimeCalendar        : 'Календар радног времена',
        exceptions                 : 'Изузеци',
        general                    : 'Генерал',
        name                       : 'Име',
        parent                     : 'Родитељ',
        save                       : 'сачувати',
        weeks                      : 'Недеље',
        error                      : 'Грешка',
        inputErrors                : 'Постоје грешке у уносу. Поправите их пре него што сачувате промене.',
        delete                     : 'Избриши',
        addCalendar                : 'Додајте календар',
        confirmation               : 'Потврда',
        removeCalendarWithChildren : 'Календар има подређене календаре. Кликните на „Да“ да бисте уклонили календар са његовим потомцима.',
        removeCalendarAndLinks     : 'Календар користе неке евиденције. Кликните на „Да“ да бисте прекинули њихову везу и уклонили календар.',
        newException               : 'Нови изузетак',
        newWeek                    : 'Нова недеља'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' ради',
        isNotWorking : ' не ради',
        basedOn      : ' На основу:',
        byDefault    : 'подразумевано',
        rangeTpl     : (start, end) => `${start} - ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Радни дан',
        nonWorkingDay : 'Нерадни дан'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Постоје опсези који се преклапају',
        errorMissingDate   : 'Потребно је време почетка и завршетка',
        errorStartAfterEnd : 'Време почетка не може бити после времена завршетка'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Име',
        from                                 : 'Од',
        to                                   : 'До',
        is                                   : 'Ис',
        nonWorking                           : 'Нерадни',
        working                              : 'Рад',
        hours                                : 'Сати',
        repeat                               : 'Понављање',
        repeatEnd                            : 'Поновите крај',
        errorMissingDate                     : 'Неопходан је период изузећа',
        errorStartAfterEnd                   : 'Датум „Од“ не може бити после датума „До“.',
        errorStartAndEndRepeatNumberMismatch : 'Изузетак треба да почне и заврши исти број пута'
    },

    CalendarEditorWeekPanel : {
        name        : 'Име',
        from        : 'Од',
        to          : 'До',
        days        : 'Дани',
        copyDay     : 'Копирај дан',
        pasteDay    : 'Залепите дан',
        stopCopying : 'Престани да копираш'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Додајте опсег',
        removeRange : 'Уклони опсег'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : 'Датум „Од“ не може бити после датума „До“.',
        errorNoDefaultWeek           : 'Потребна је конфигурација недеље',
        errorMultipleDefaultWeeks    : 'Наведено је више од једне подразумеване недеље',
        errorNoWeekAvailability      : 'Недеља мора да обезбеди мало радног времена',
        errorInvalidWeekAvailability : 'Недеља има грешке у конфигурацији радног времена',
        noRows                       : 'Нема додатих недеља'
    },

    AdvancedTab : {
        Advanced                   : 'Напредно',
        Calendar                   : 'Календар',
        'Scheduling mode'          : 'Режим заказивања',
        'Effort driven'            : 'Утрошен напор',
        'Manually scheduled'       : 'Ручно заказано',
        'Constraint type'          : 'Тип ограничења',
        'Constraint date'          : 'Датум ограничења',
        Constraint                 : 'Ограничење',
        Rollup                     : 'Завршетак',
        Inactive                   : 'Неактивно',
        'Ignore resource calendar' : 'Игнориши ресурс календара',
        'Scheduling direction'     : 'Заказивање смера',
        projectBorder              : 'Граница пројекта',
        ignore                     : 'Игнорирај',
        honor                      : 'Част',
        askUser                    : 'Питајте корисника'
    },

    DependencyTab : {
        Predecessors      : 'Претходници',
        Successors        : 'Наследници',
        ID                : 'ИД',
        Name              : 'Име',
        Type              : 'Тип',
        Lag               : 'Кашњење',
        cyclicDependency  : 'Циклична зависност',
        invalidDependency : 'Неважећа зависност',
        readOnlyTask      : 'Задатак само за читање не може се повезати'
    },

    NotesTab : {
        Notes : 'Напомене'
    },

    ResourceCalendarColumn : {
        calendar : 'Календар'
    },

    ResourceEdit : {
        editResource : 'Уреди ресурс'
    },

    ResourceEditor : {
        resourceInformation : 'Информације о ресурсима',
        costs               : 'Трошкови',
        save                : 'Сачувај',
        error               : 'Грешка',
        inputErrors         : 'Постоје грешке у уносу. Исправите их пре него што сачувате промене.',
        delete              : 'Избриши',
        confirmation        : 'Потврда',
        removeUsedResource  : 'Ресурс је додељен неким задацима. Кликните на „Да“ да бисте ипак уклонили ресурс.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalendar',
        general     : 'General',
        label       : 'Oznaka materijala',
        name        : 'Naziv resursa',
        type        : 'Vrsta',
        costAccrual : 'Obračun troškova',
        labelHint   : 'na primer kg ili tona',
        maxUnits    : 'Макс. јединица'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Аццруе ат',
        prorated : 'Пропорционално',
        start    : 'Почни',
        end      : 'Крај'
    },

    CostAccrualField : {
        prorated : 'Пропорционално',
        start    : 'Почни',
        end      : 'Крај'
    },

    ResourceType : {
        work     : 'Рад',
        material : 'Материјал',
        cost     : 'Трошак'
    },

    ResourceTypeColumn : {
        type : 'Тип'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Табела стопа',
        newGroup     : 'Нова табела стопа',
        removeGroup  : 'Уклоните табелу стопа',
        useByDefault : 'Користите ову табелу стопа за ресурс',
        noRates      : 'Нема тарифа'
    },

    ResourceGrid : {
        name          : 'Назив',
        materialLabel : 'Ознака материјала',
        maxUnits      : 'Макс. јединица',
        cost          : 'Трошак',
        noRows        : 'Нема ресурса'
    },

    ResourceRateTableContainer : {
        startDate    : 'Датум почетка',
        standardRate : 'Стандардна стопа',
        perUseCost   : 'Цена по употреби',
        addRate      : 'Додајте стопу',
        removeRate   : 'Уклони стопу',
        name         : 'Назив',
        noRates      : 'Нема тарифа'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Информације о табели стопа'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Количина',
        Resources   : 'Ресурси',
        Resource    : 'Ресурс',
        Units       : 'Јединице',
        cost        : 'Трошак',
        effort      : 'Напор',
        start       : 'Почни',
        finish      : 'Заврши',
        preamble    : 'Претходни текст',
        postamble   : 'Завршни текст'
    },

    RateTableColumn : {
        rateTable : 'Табела стопа'
    },

    RecurrenceTab : {
        title : 'Понови'
    },

    SchedulingModePicker : {
        Normal           : 'Нормално',
        'Fixed Duration' : 'Фиксно трајање',
        'Fixed Units'    : 'Фиксне јединице',
        'Fixed Effort'   : 'Фиксно ангажовање'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} oд {available}</span> додељених',
        barTipOnDate          : '<b>{resource}</b> на {startDate}<br><span class="{cls}">{allocated} oд {available}</span> додељених',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} oд {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} oд {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'На {startDate}<br><span class="{cls}">{allocated} oд {available}</span> allocated:<br>{assignments}',
        plusMore              : '+{value} више'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Напор</div><div class="b-effort-value {cls}">{allocated} од {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Напор</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Трошак</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Количина</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} на {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Резиме за {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Резиме за {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} више',
        nameColumnText        : 'Ресурс / Догађај'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Откажи промену и не ради ништа',
        schedulingConflict : 'Неусаглашеност распореда',
        emptyCalendar      : 'Грешка у конфигурацији календара',
        cycle              : 'Циклус заказивања',
        Apply              : 'Примени'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Изаберите зависност:',
        invalidDependencyLabel : 'Постоје неважеће зависности које треба решити:'
    },

    SchedulerProBase : {
        propagating     : 'Израчунавање пројекта',
        storePopulation : 'Учитавање података',
        finalizing      : 'Завршавање резултата'
    },

    EventSegments : {
        splitEvent    : 'Раздели догађај',
        renameSegment : 'Преименуј'
    },

    NestedEvents : {
        createGroup         : 'Grupiši izabrane događaje',
        newGroupName        : 'Nova grupa',
        deNestingNotAllowed : 'Opozivanje ugnežđivanja nije dozvoljeno',
        nestingNotAllowed   : 'Ugnežđivanje nije dozvoljeno'
    },

    VersionGrid : {
        compare       : 'Упореди',
        description   : 'Опис',
        occurredAt    : 'Десило се у',
        rename        : 'Преименуј',
        restore       : 'Врати',
        stopComparing : 'Прекини упоређивање'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'задатак',
            AssignmentModel : 'додела',
            DependencyModel : 'веза',
            ProjectModel    : 'пројекат',
            ResourceModel   : 'ресурс',
            other           : 'објекат'
        },
        entityNamesPlural : {
            TaskModel       : 'задаци',
            AssignmentModel : 'доделе',
            DependencyModel : 'везе',
            ProjectModel    : 'пројекти',
            ResourceModel   : 'ресурси',
            other           : 'објекти'
        },
        transactionDescriptions : {
            update : 'Промењено {n} {entities}',
            add    : 'Додато {n} {entities}',
            remove : 'Уклоњено {n} {entities}',
            move   : 'Померено {n} {entities}',
            mixed  : 'Промењено {n} {entities}'
        },
        propertyNames : {
            active                   : 'Активно',
            allDay                   : 'Цео дан',
            allowOverlap             : 'Дозволи преклапање',
            barMargin                : 'Маргина траке',
            bidirectional            : 'Двосмерно',
            calendar                 : 'Календар',
            cls                      : 'CSS класа',
            constraintDate           : 'Датум ограничења',
            constraintType           : 'Тип ограничења',
            daysPerMonth             : 'Дани по месецу',
            daysPerWeek              : 'Дани по недељи',
            delayFromParent          : 'Кашњење од родитеља',
            direction                : 'Смер',
            drawDependencies         : 'Цртај зависности',
            duration                 : 'Трајање',
            durationUnit             : 'Јединица трајања',
            effort                   : 'Напор',
            effortDriven             : 'Вођено напором',
            effortUnit               : 'Јединица напора',
            endDate                  : 'Датум завршетка',
            eventColor               : 'Боја',
            eventId                  : 'ИД догађаја',
            eventLayout              : 'Распоред догађаја',
            eventStyle               : 'Стил траке',
            exceptionDates           : 'Датуми изузетака',
            fixed                    : 'Фиксно',
            from                     : 'Од',
            fromSide                 : 'Са стране',
            hoursPerDay              : 'Сати по дану',
            href                     : 'Линк',
            iconCls                  : 'Икона',
            id                       : 'ИД',
            ignoreResourceCalendar   : 'Игнориши календар ресурса',
            ignoreTimeZone           : 'Игнориши временску зону',
            image                    : 'Слика',
            imageUrl                 : 'УРЛ слике',
            inactive                 : 'Неактивно',
            intervals                : 'Интервали',
            lag                      : 'Кашњење',
            lagUnit                  : 'Јединица кашњења',
            lineStyle                : 'Стил линије',
            manuallyScheduled        : 'Ручно заказано',
            milestoneWidth           : 'Ширина прекретнице',
            name                     : 'Име',
            note                     : 'Белешка',
            parentId                 : 'ИД родитеља',
            parentIndex              : 'Позиција',
            percentDone              : '% завршено',
            postamble                : 'Постамбула',
            preamble                 : 'Преамбула',
            readOnly                 : 'Само за читање',
            recurrenceRule           : 'Правило понављања',
            resourceId               : 'ИД ресурса',
            resourceMargin           : 'Маргина ресурса',
            rowHeight                : 'Висина реда',
            schedulingMode           : 'Режим заказивања',
            segments                 : 'Сегменти',
            showAvatar               : 'Прикажи аватар',
            showInTimeline           : 'Прикажи у временској линији',
            startDate                : 'Датум почетка',
            stickyContents           : 'Лепљиви садржаји',
            strokeColor              : 'Боја линије',
            style                    : 'Стил',
            target                   : 'Циљни линк',
            to                       : 'До',
            toSide                   : 'До стране',
            type                     : 'Тип',
            units                    : 'Јединице',
            unscheduled              : 'Незаказано',
            unspecifiedTimeIsWorking : 'Неспецифицирано време је радно',
            version                  : 'Верзија'
        },
        intervals : {
            working    : 'Радно',
            nonWorking : 'Нерадно',
            fromTo     : 'Од {from} до {to}',
            recurring  : 'Понављајуће почевши {start} завршавајући {end}'
        },
        addEntity         : 'Додато {type} **{name}**',
        removeEntity      : 'Уклоњено {type} **{name}**',
        updateEntity      : 'Промењено {type} **{name}**',
        moveEntity        : 'Померено {type} **{name}** са {from} на {to}',
        addDependency     : 'Додата веза са **{from}** на **{to}**',
        removeDependency  : 'Уклоњена веза са **{from}** на **{to}**',
        updateDependency  : 'Уређена веза са **{from}** на **{to}**',
        addAssignment     : 'Додељено **{resource}** на **{event}**',
        removeAssignment  : 'Уклоњен задатак за **{resource}** са **{event}**',
        updateAssignment  : 'Уређемни задатак са **{resource}** на **{event}**',
        noChanges         : 'Без промена',
        nullValue         : 'ниједан',
        versionDateFormat : 'M.Д.ГГГГ. ч:мм a',
        savedAt           : 'Сачувано у {date}',
        autoSavedAt       : 'Аутоматски сачувано у {date}',
        undid             : 'Опозване промене',
        redid             : 'Поновљене промене',
        editedTask        : 'Уређена својства задатка',
        deletedTask       : 'Задатак је избрисан',
        movedTask         : 'Померен задатак',
        movedTasks        : 'Померени задаци'
    }
};

export default LocaleHelper.publishLocale(locale);
