import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Kk.js';
import '../../Grid/localization/Kk.js';

const locale = {

    localeName : 'Kk',
    localeDesc : 'Қазақ тілі (KZ)',
    localeCode : 'kk-KZ',
    localeRtl  : false,

    Object : {
        newEvent    : 'Жаңа оқиға',
        information : 'Ақпарат',
        showDetails : 'Толығырақ көрсету'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + 'оқиға' + (data !== 1 ? 'с' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Ресурс орналасу бағанын ауыстыру. SPACE мәзір үшін.'
    },

    Dependencies : {
        from    : 'Басталу күні',
        to      : 'дейін',
        valid   : 'Жарамды',
        invalid : 'Жарамсыз'
    },

    DependencyType : {
        SS           : 'Бастау-бастау',
        SF           : 'Бастау-аяқтау',
        FS           : 'Аяқтау-бастау',
        FF           : 'Аяқтау-аяқтау',
        StartToStart : 'Бастау-бастау',
        StartToEnd   : 'Бастау-аяқтау',
        EndToStart   : 'Аяқтау-бастау',
        EndToEnd     : 'Аяқтау-аяқтау',
        short        : [
            'Бастау-бастау',
            'Бастау-аяқтау',
            'Аяқтау-бастау',
            'Аяқтау-аяқтау'
        ],
        long : [
            'Бастау-бастау',
            'Бастау-аяқтау',
            'Аяқтау-бастау',
            'Аяқтау-аяқтау'
        ]
    },

    DependencyEdit : {
        From              : 'Басталу күні',
        To                : 'дейін',
        Type              : 'Түрі',
        Lag               : 'Кешігу',
        color             : 'Түс',
        lineStyle         : 'Сызық стилі',
        solid             : 'Тұтас',
        dashed            : 'Сызықты',
        dotted            : 'Нүктелі',
        dashDot           : 'Сызық-нүкте',
        longDash          : 'Ұзын сызық',
        'Edit dependency' : 'Тәуелділікті өңдеу',
        Save              : 'Сақтау',
        Delete            : 'Жою',
        Cancel            : 'Баc тарту',
        StartToStart      : 'Бастау-бастау',
        StartToEnd        : 'Бастау-аяқтау',
        EndToStart        : 'Аяқтау-бастау',
        EndToEnd          : 'Аяқтау-аяқтау',
        Active            : 'Белсенді'
    },

    EventEdit : {
        Name           : 'Аты',
        Resource       : 'Ресурс',
        Start          : 'Басталу',
        startTime      : 'Бастау уақыты',
        End            : 'Аяқталуы',
        endTime        : 'Аяқталу уақыты',
        Save           : 'Сақтау',
        Delete         : 'Жою',
        Cancel         : 'Баc тарту',
        'Edit event'   : 'Оқиғаны өңдеу',
        Repeat         : 'Қайталау',
        editRecurrence : 'Қайталауды өңдеу'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Оқиға осы ресурс үшін бар оқиғаны қабаттастырады',
        noDropOutsideTimeline   : 'Уақыт шкаласынан тыс оқиғаны толығымен жою мүмкін емес',
        duplicateAssignmentDrag : 'Оқиғаны бір ресурсқа бірнеше рет тағайындау мүмкін емес'
    },

    SchedulerBase : {
        'Add event'      : 'Оқиға қосу',
        'Delete event'   : 'Оқиғаны жою',
        'Unassign event' : 'Оқиғаны тағайындаудан бас тарту',
        color            : 'Түсі',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, басталады ${startDate} ${eventRecord.duration > 0 ? `ұзақтығы ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Ұлғайту',
        activeDateRange : 'Күн ауқымы',
        startText       : 'Басталу күні',
        endText         : 'Аяқталу күні',
        todayText       : 'Бүгін'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Уақыт осі ${startDate} - ${endDate} көрсетеді`
    },

    EventCopyPaste : {
        copyEvent  : 'Оқиғаны көшіру',
        cutEvent   : 'Оқиғаны қию',
        pasteEvent : 'Оқиғаны қою'
    },

    EventFilter : {
        filterEvents : 'Тапсырмаларды сүзгілеу',
        byName       : 'Аты бойынша'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Ағымдағы уақыт шкаласын көрсету'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Секунд'
        },
        minuteAndHour : {
            topDateFormat     : 'ккк АА/КК, сағТД',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ккк АА/КК',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Күн'
        },
        day : {
            name : 'Күн/сағат'
        },
        week : {
            name : 'Апта/сағат'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Апта/күндер'
        },
        dayAndMonth : {
            name : 'Ай'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Апта'
        },
        weekAndMonth : {
            name : 'Апта'
        },
        weekAndDayLetter : {
            name : 'Апталар/жұмыс күндері'
        },
        weekDateAndMonth : {
            name : 'Айлар/апталар'
        },
        monthAndYear : {
            name : 'Ай'
        },
        year : {
            name : 'Жыл'
        },
        manyYears : {
            name : 'Бірнеше жыл'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Оқиға жойылуда',
        'delete-all-message'        : 'Осы оқиғаның барлық жағдайларын өзгерту қажет пе?',
        'delete-further-message'    : 'Оқиғаның тек осы жағдайын немесе осы және болашақтағы барлық жағдайларды жою қажет пе?',
        'delete-only-this-message'  : 'Осы оқиғаның осы пайда болуын жойғыңыз келе ме?',
        'delete-further-btn-text'   : 'Барлық болашақ оқиғаларды жою',
        'delete-only-this-btn-text' : 'Тек осы оқиғаны жою',
        'update-title'              : 'Қайталанатын оқиға өзгертілуде',
        'update-all-message'        : 'Осы оқиғаның барлық жағдайларын өзгерту қажет пе?',
        'update-further-message'    : 'Оқиғаның тек осы жағдайын немесе осы және болашақтағы барлық жағдайларды өзгерту қажет пе?',
        'update-only-this-message'  : 'Осы оқиғаның осы пайда болуын өзгерткіңіз келе ме?',
        'update-further-btn-text'   : 'Барлық болашақ оқиғалар',
        'update-only-this-btn-text' : 'Тек осы оқиға',
        Yes                         : 'Иә',
        Cancel                      : 'Баc тарту',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' және ',
        Daily                           : 'Күн сайын',
        'Weekly on {1}'                 : ({ days }) => `Апта сайын ${days} күні`,
        'Monthly on {1}'                : ({ days }) => `Ай сайын ${days} күні`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Жыл сайын ${months} айының ${days} күні`,
        'Every {0} days'                : ({ interval }) => `Әр ${interval} күн сайын`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Әр ${interval} апта сайын ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Әр ${interval} ай сайын ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `${months} ішінен әр ${interval} жыл сайын ${days}`,
        position1                       : 'бірінші',
        position2                       : 'екінші',
        position3                       : 'үшінші',
        position4                       : 'төртінші',
        position5                       : 'бесінші',
        'position-1'                    : 'соңғы',
        day                             : 'күн',
        weekday                         : 'жұмыс күні',
        'weekend day'                   : 'демалыс күні',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Оқиғаны қайталау',
        Cancel              : 'Баc тарту',
        Save                : 'Сақтау',
        Frequency           : 'Жиілік',
        Every               : 'Әр',
        DAILYintervalUnit   : 'күн/күндер',
        WEEKLYintervalUnit  : 'апта/апталар',
        MONTHLYintervalUnit : 'ай(лар)',
        YEARLYintervalUnit  : 'жыл/жылдар',
        Each                : 'Әрбір',
        on                  : 'the',
        the                 : 'the',
        'On the'            : 'күні',
        'End repeat'        : 'Қайталауды аяқтау',
        'time(s)'           : 'рет',
        Days                : 'күн',
        Months              : 'ай'
    },

    RecurrenceDaysCombo : {
        day           : 'күн',
        weekday       : 'жұмыс күні',
        'weekend day' : 'демалыс күні'
    },

    RecurrencePositionsCombo : {
        position1    : 'бірінші',
        position2    : 'екінші',
        position3    : 'үшінші',
        position4    : 'төртінші',
        position5    : 'бесінші',
        'position-1' : 'соңғы'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Ешқашан',
        After     : 'кейін',
        'On date' : 'күні'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Қайталау жоқ',
        Daily   : 'Күн сайын',
        Weekly  : 'Апта сайын {0}',
        Monthly : 'Ай сайын',
        Yearly  : 'Жыл сайын'
    },

    RecurrenceCombo : {
        None   : 'Жоқ',
        Custom : 'Реттелетін...'
    },

    Summary : {
        'Summary for' : date => `үшін түйіндеме ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Кестені аяқтау',
        currentview  : 'Көрінетін кесте',
        daterange    : 'Күн ауқымы',
        completedata : 'Кестені аяқтау (барлық оқиғалар үшін)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Жоспарлау ауқымы',
        'Export from'    : 'Басталу күні',
        'Export to'      : 'дейін'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Бір бет'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Бір бет (масштабталмаған)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Көп беттер (тік)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Тағайындалған ресурс жоқ'
    },

    CrudManagerView : {
        serverResponseLabel : 'Сервер жауабы:'
    },

    DurationColumn : {
        Duration : 'Ұзақтығы'
    },

    EventClusteringBase : {
        unnamed         : 'Атаусыз',
        more            : count => `+ тағы ${count}`,
        clusteredEvents : count => `Топтастырылған оқиғалар: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Топтастырылған ауқымдар: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Жоқ',
        assoonaspossible    : 'Мүмкіндігінше тез',
        aslateaspossible    : 'Мүмкіндігінше кеш',
        muststarton         : 'Бекітілген басталу күні',
        mustfinishon        : 'Бекітілген аяқталу күні',
        startnoearlierthan  : 'Басталуы осы күннен ерте емес',
        startnolaterthan    : 'Басталуы осы күннен кеш емес',
        finishnoearlierthan : 'Аяқталуы осы күннен ерте емес',
        finishnolaterthan   : 'Аяқталуы осы күннен кеш емес'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} оқиға алдындағы буферлік уақыт`;
            }
            if (postamble) {
                description += `.${postamble.toString()} оқиғадан кейінгі буферлік уақыт`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Қайта жіберу',
        Backward      : 'Артқа',
        inheritedFrom : 'Иеленген',
        enforcedBy    : 'Орындаған'
    },

    CalendarField : {
        'Default calendar' : 'Әдепкі күнтізбе',
        editCalendar       : 'Күнтізбені өңдеу'
    },

    TaskEditorBase : {
        Information   : 'Тапсырма туралы ақпарат',
        Save          : 'Сақтау',
        Cancel        : 'Баc тарту',
        Delete        : 'Жою',
        calculateMask : 'Есептелуде...',
        saveError     : 'Сақтау мүмкін емес, алдымен қателерді түзетіңіз',
        repeatingInfo : 'Қайталанатын оқиғаны көру',
        editRepeating : 'Өңдеу'
    },

    TaskEdit : {
        editEvent              : 'Оқиғаны өңдеу',
        ConfirmDeletionTitle   : 'Жоюды растау',
        ConfirmDeletionMessage : 'Оқиғаны жою қажет пе?'
    },

    GanttTaskEditor : {
        editorWidth : '45em'
    },

    SchedulerTaskEditor : {
        editorWidth : '35em'
    },

    SchedulerGeneralTab : {
        General      : 'Жалпы',
        Name         : 'Аты',
        Resources    : 'Ресурстар',
        '% complete' : '% орындалды',
        Duration     : 'Ұзақтығы',
        Start        : 'Басталуы',
        Finish       : 'Аяқталуы',
        Effort       : 'Жұмыс көлемі',
        Preamble     : 'Алғысөз',
        Postamble    : 'Соңғы бөлім'
    },

    GeneralTab : {
        General      : 'Жалпы',
        Name         : 'Аты',
        '% complete' : '% орындалды',
        Duration     : 'Ұзақтығы',
        Start        : 'Басталуы',
        Finish       : 'Аяқталуы',
        Effort       : 'Жұмыс көлемі',
        Dates        : 'Күндер'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Кеңейтілген',
        Calendar                   : 'Күнтізбе',
        'Scheduling mode'          : 'Жоспарлау режимі',
        'Effort driven'            : 'Жұмыс көлемі негізінде',
        'Manually scheduled'       : 'Қолмен жоспарланған',
        'Constraint type'          : 'Шектеу түрі',
        'Constraint date'          : 'Шектеу күні',
        Inactive                   : 'Белсенді емес',
        'Ignore resource calendar' : 'Ресурс күнтізбесін елемеу'
    },

    CalendarEditorDatePicker : {
        addException : 'Ерекшелік қосу',
        addWeek      : 'Аптаны қосыңыз'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Ерекшелік қосу',
        removeException : 'Ерекше жағдайды жою',
        noRows          : 'Ерекшеліктер қосылмаған'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Аптаны қосыңыз',
        removeWeek : 'Аптаны алып тастаңыз'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Күндер әдепкі бойынша жұмыс істейді',
        workingTimeCalendar        : 'Жұмыс уақытының күнтізбесі',
        exceptions                 : 'Ерекшеліктер',
        general                    : 'Жалпы',
        name                       : 'Аты',
        parent                     : 'Ата-ана',
        save                       : 'Сақтау',
        weeks                      : 'Апталар',
        error                      : 'Қате',
        inputErrors                : 'Енгізу қателері бар. Өзгерістерді сақтамас бұрын оларды түзетіңіз.',
        delete                     : 'Жою',
        addCalendar                : 'Күнтізбе қосыңыз',
        confirmation               : 'Растау',
        removeCalendarWithChildren : 'Күнтізбеде еншілес күнтізбелер бар. Күнтізбені оның балаларымен жою үшін «Иә» түймесін басыңыз.',
        removeCalendarAndLinks     : 'Күнтізбені кейбір жазбалар пайдаланады. Олардың байланысын жою және күнтізбені жою үшін «Иә» түймесін басыңыз.',
        newException               : 'Жаңа ерекшелік',
        newWeek                    : 'Жаңа апта'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' жұмыс істейді',
        isNotWorking : ' жұмыс істемейді',
        basedOn      : ' негізделген:',
        byDefault    : 'әдепкі бойынша',
        rangeTpl     : (start, end) => `${start} - ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Жұмыс күні',
        nonWorkingDay : 'Жұмыс емес күн'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Бір-бірін қайталайтын диапазондар бар',
        errorMissingDate   : 'Басталу және аяқталу уақыты қажет',
        errorStartAfterEnd : 'Басталу уақыты аяқталу уақытынан кейін болуы мүмкін емес'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Аты',
        from                                 : 'бастап',
        to                                   : 'Кімге',
        is                                   : 'Бұл',
        nonWorking                           : 'Жұмыс істемейтін',
        working                              : 'Жұмыс істеу',
        hours                                : 'Сағат',
        repeat                               : 'Қайталау',
        repeatEnd                            : 'Аяқтауды қайталаңыз',
        errorMissingDate                     : 'Ерекшелік күндер ауқымы қажет',
        errorStartAfterEnd                   : '«Бастан» күні «Кімге» күнінен кейін болмауы керек',
        errorStartAndEndRepeatNumberMismatch : 'Ерекшелік бірдей рет басталып, аяқталуы керек'
    },

    CalendarEditorWeekPanel : {
        name        : 'Аты',
        from        : 'бастап',
        to          : 'Кімге',
        days        : 'Күндер',
        copyDay     : 'Көшіру күні',
        pasteDay    : 'Қою күні',
        stopCopying : 'Көшіруді тоқтатыңыз'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Ауқым қосу',
        removeRange : 'Ауқымды жою'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '«Бастан» күні «Кімге» күнінен кейін болмауы керек',
        errorNoDefaultWeek           : 'Апталық конфигурация қажет',
        errorMultipleDefaultWeeks    : 'Бірден көп әдепкі апта көрсетілген',
        errorNoWeekAvailability      : 'Апта біраз жұмыс уақытын қамтамасыз етуі керек',
        errorInvalidWeekAvailability : 'Аптаның жұмыс уақытын конфигурациялау қателері бар',
        noRows                       : 'Апталар қосылмаған'
    },

    AdvancedTab : {
        Advanced                   : 'Кеңейтілген',
        Calendar                   : 'Күнтізбе',
        'Scheduling mode'          : 'Жоспарлау режимі',
        'Effort driven'            : 'Жұмыс көлемі негізінде',
        'Manually scheduled'       : 'Қолмен жоспарланған',
        'Constraint type'          : 'Шектеу түрі',
        'Constraint date'          : 'Шектеу күні',
        Constraint                 : 'Шектеу',
        Rollup                     : 'Айналдыру',
        Inactive                   : 'Белсенді емес',
        'Ignore resource calendar' : 'Ресурс күнтізбесін елемеу',
        'Scheduling direction'     : 'Жоспарлау бағыты',
        projectBorder              : 'Жобаның шекарасы',
        ignore                     : 'Елемеу',
        honor                      : 'Құрмет',
        askUser                    : 'Пайдаланушыдан сұраңыз'
    },

    DependencyTab : {
        Predecessors      : 'Ізашарлар',
        Successors        : 'Ізбасарлар',
        ID                : 'Идентификатор',
        Name              : 'Аты',
        Type              : 'Түрі',
        Lag               : 'Кешігу',
        cyclicDependency  : 'Циклдік тәуелділік',
        invalidDependency : 'Жарамсыз тәуелділік',
        readOnlyTask      : 'Тек оқуға арналған тапсырманы байланыстыру мүмкін емес'
    },

    NotesTab : {
        Notes : 'Ескертпелер'
    },

    ResourceCalendarColumn : {
        calendar : 'Күнтізбе'
    },

    ResourceEdit : {
        editResource : 'Ресурсты өңдеу'
    },

    ResourceEditor : {
        resourceInformation : 'Ресурс ақпараты',
        costs               : 'Шығындар',
        save                : 'Сақтау',
        error               : 'Қате',
        inputErrors         : 'Енгізу қателері бар. Өзгерістерді сақтамас бұрын оларды түзетіңіз.',
        delete              : 'Жою',
        confirmation        : 'Растау',
        removeUsedResource  : 'Ресурс кейбір тапсырмаларға тағайындалған. Ресурсты бәрібір жою үшін «Иә» түймесін басыңыз.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Күнтізбе',
        general     : 'Жалпы',
        label       : 'Материал белгісі',
        name        : 'Ресурс атауы',
        type        : 'Түр',
        costAccrual : 'Шығындарды есептеу',
        labelHint   : 'мысалы, кг, тонна немесе жәшіктер',
        maxUnits    : 'Максималды бірліктер'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Жинақтау уақыты',
        prorated : 'Пропорционалды',
        start    : 'Бастау',
        end      : 'Соңы'
    },

    CostAccrualField : {
        prorated : 'Пропорционалды',
        start    : 'Бастау',
        end      : 'Соңы'
    },

    ResourceType : {
        work     : 'Жұмыс',
        material : 'Материал',
        cost     : 'Құны'
    },

    ResourceTypeColumn : {
        type : 'Түр'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Тарифтер кестесі',
        newGroup     : 'Жаңа кесте',
        removeGroup  : 'Кестені алып тастаңыз',
        useByDefault : 'Ресурс тағайындаулары үшін әдепкі бойынша пайдаланыңыз',
        noRates      : 'Тарифтер жоқ'
    },

    ResourceGrid : {
        name          : 'Аты',
        materialLabel : 'Материал белгісі',
        maxUnits      : 'Максималды бірлік',
        cost          : 'Құны',
        noRows        : 'Ресурстар жоқ'
    },

    ResourceRateTableContainer : {
        startDate    : 'Басталу күні',
        standardRate : 'Стандартты мөлшерлеме',
        perUseCost   : 'Бір пайдалану құны',
        addRate      : 'Бағаны қосыңыз',
        removeRate   : 'Бағаны алып тастау',
        name         : 'Аты',
        noRates      : 'Тарифтер жоқ'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Тарифтік кесте туралы ақпарат'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Саны',
        Resources   : 'Ресурстар',
        Resource    : 'Ресурс',
        Units       : 'Бірліктер',
        cost        : 'Құны',
        effort      : 'Күш',
        start       : 'Бастау',
        finish      : 'Аяқтау',
        preamble    : 'Кіріспе',
        postamble   : 'Қорытынды'
    },

    RateTableColumn : {
        rateTable : 'Тарифтер кестесі'
    },

    RecurrenceTab : {
        title : 'Қайталау'
    },

    SchedulingModePicker : {
        Normal           : 'Қалыпты',
        'Fixed Duration' : 'Бекітілген ұзақтығы',
        'Fixed Units'    : 'Бекітілген бірліктер',
        'Fixed Effort'   : 'Бекітілген күш'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} / {available}</span> үлестірілді',
        barTipOnDate          : '<b>{resource}</b> {startDate}<br><span class="{cls}">{allocated} / {available}</span> үлестірілді',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} / {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} / {available}</span> үлестірілді:<br>{assignments}',
        groupBarTipOnDate     : '{startDate}<br><span class="{cls}">{allocated} / {available}</span> үлестірілді:<br>{assignments}',
        plusMore              : 'тағы +{value}'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Еңбек</div><div class="b-effort-value {cls}">{allocated} / {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Еңбек</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Құны</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Саны</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} {startDate} күні</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">{startDate} - {endDate} аралығындағы қорытынды</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">{startDate} күні қорытынды</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} тағы',
        nameColumnText        : 'Ресурс / Оқиға'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Өзгерістен бас тартып, ештеңе жасамау',
        schedulingConflict : 'Жоспарлау қайшылығы',
        emptyCalendar      : 'Күнтізбе конфигурациясының қатесі',
        cycle              : 'Жоспарлау циклі',
        Apply              : 'Қолдану'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Тәуелділікті таңдаңыз:',
        invalidDependencyLabel : 'Жою қажет жарамсыз тәуелділіктер бар:'
    },

    SchedulerProBase : {
        propagating     : 'Жобаны есептеу',
        storePopulation : 'Деректер жүктелуде',
        finalizing      : 'Нәтижелер аяқталуда'
    },

    EventSegments : {
        splitEvent    : 'Оқиғаны бөлу',
        renameSegment : 'Атауын өзгерту'
    },

    NestedEvents : {
        createGroup         : 'Таңдалған оқиғаларды топтау',
        newGroupName        : 'Жаңа топ',
        deNestingNotAllowed : 'Енгізілімді жоюға рұқсат етілмейді',
        nestingNotAllowed   : 'Енгізуге рұқсат етілмейді'
    },

    VersionGrid : {
        compare       : 'Салыстыру',
        description   : 'Сипаттамасы',
        occurredAt    : 'Орын алу уақыты',
        rename        : 'Атауын өзгерту',
        restore       : 'Қалпына келтіру',
        stopComparing : 'Салыстыруды тоқтату'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'тапсырма',
            AssignmentModel : 'тағайындау',
            DependencyModel : 'сілтеме',
            ProjectModel    : 'жоба',
            ResourceModel   : 'ресурс',
            other           : 'нысан'
        },
        entityNamesPlural : {
            TaskModel       : 'тапсырмалар',
            AssignmentModel : 'тағайындаулар',
            DependencyModel : 'сілтемелер',
            ProjectModel    : 'жобалар',
            ResourceModel   : 'ресурстар',
            other           : 'нысандар'
        },
        transactionDescriptions : {
            update : '{n} {entities} өзгертілді',
            add    : '{n} {entities} қосылды',
            remove : '{n} {entities} жоойылды',
            move   : '{n} {entities} жылжытылды',
            mixed  : '{n} {entities} өзгертілді'
        },
        propertyNames : {
            active                   : 'Белсенді',
            allDay                   : 'Күні бойы',
            allowOverlap             : 'Қабаттасуға рұқсат беру',
            barMargin                : 'Жолақ шеті',
            bidirectional            : 'Екі бағытты',
            calendar                 : 'Күнтізбе',
            cls                      : 'CSS сыныбы',
            constraintDate           : 'Шектеу күні',
            constraintType           : 'Шектеу түрі',
            daysPerMonth             : 'Айына күндер',
            daysPerWeek              : 'Аптасына күндер',
            delayFromParent          : 'Ата-анадан кешігу',
            direction                : 'Бағыт',
            drawDependencies         : 'Тәуелділіктерді сызу',
            duration                 : 'Ұзақтығы',
            durationUnit             : 'Ұзақтық бірлігі',
            effort                   : 'Күш',
            effortDriven             : 'Күшке негізделген',
            effortUnit               : 'Күш бірлігі',
            endDate                  : 'Аяқталу күні',
            eventColor               : 'Түс',
            eventId                  : 'Оқиға ID',
            eventLayout              : 'Оқиға орналасуы',
            eventStyle               : 'Жолақ стилі',
            exceptionDates           : 'Ерекше күндер',
            fixed                    : 'Тұрақты',
            from                     : 'Бастап',
            fromSide                 : 'Бастапқы жағы',
            hoursPerDay              : 'Күніне сағаттар',
            href                     : 'Сілтеме',
            iconCls                  : 'Белгіше',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ресурс күнтізбесін елемеу',
            ignoreTimeZone           : 'Уақыт белдеуін елемеу',
            image                    : 'Сурет',
            imageUrl                 : 'Сурет URL',
            inactive                 : 'Белсенді емес',
            intervals                : 'Интервалдар',
            lag                      : 'Кешігу',
            lagUnit                  : 'Кешігу бірлігі',
            lineStyle                : 'Сызық стилі',
            manuallyScheduled        : 'Қолмен жоспарланған',
            milestoneWidth           : 'Мақсат ені',
            name                     : 'Атауы',
            note                     : 'Ескерту',
            parentId                 : 'Ата-ана ID',
            parentIndex              : 'Позиция',
            percentDone              : '% орындалды',
            postamble                : 'Қорытынды',
            preamble                 : 'Кіріспе',
            readOnly                 : 'Тек оқу',
            recurrenceRule           : 'Қайталау ережесі',
            resourceId               : 'Ресурс ID',
            resourceMargin           : 'Ресурс шеті',
            rowHeight                : 'Жол биіктігі',
            schedulingMode           : 'Жоспарлау режимі',
            segments                 : 'Сегменттер',
            showAvatar               : 'Аватарды көрсету',
            showInTimeline           : 'Уақыт шкаласында көрсету',
            startDate                : 'Басталу күні',
            stickyContents           : 'Жабысқақ мазмұн',
            strokeColor              : 'Сызық түсі',
            style                    : 'Стиль',
            target                   : 'Сілтеме мақсаты',
            to                       : 'Дейін',
            toSide                   : 'Соңғы жағы',
            type                     : 'Түрі',
            units                    : 'Бірліктер',
            unscheduled              : 'Жоспарланбаған',
            unspecifiedTimeIsWorking : 'Көрсетілмеген уақыт жұмыс уақыты',
            version                  : 'Нұсқа'
        },
        intervals : {
            working    : 'Жұмыс істейді',
            nonWorking : 'Жұмыс істемейді',
            fromTo     : '{from} бастап {to} дейін',
            recurring  : '{start} басталып {end} аяқталатын қайталанатын'
        },
        addEntity         : '{type} **{name}** қосылды',
        removeEntity      : '{type} **{name}** жойылды',
        updateEntity      : '{type} **{name}** өзгертілді',
        moveEntity        : '{type} **{name}** {from} ішінен {to} ішіне жылжытылды',
        addDependency     : '**{from}** ішінен **{to}** ішіне сілтеме қосылды',
        removeDependency  : 'Сілтеме **{from}** ішінен **{to}** ішіне алынып тасталды',
        updateDependency  : 'Сілтеме **{from}** - **{to}** өңделді',
        addAssignment     : '**{resource}** ресурсынан **{event}** тағайындалды',
        removeAssignment  : '**{event}** оқиғасынан **{resource}** ресурсы алынып тасталды',
        updateAssignment  : '**{resource}** тағайындамасы **{event}** оқиғасына өңделді',
        noChanges         : 'Өзгерістер жоқ',
        nullValue         : 'жоқ',
        versionDateFormat : 'А/К/ЖЖЖЖ с:мм тд',
        savedAt           : '{date} кезінде сақталды',
        autoSavedAt       : '{date} кезінде автоматты түрде сақталды',
        undid             : 'Өзгерістер жасалмады',
        redid             : 'Өзгерістер қайта жасалды',
        editedTask        : 'Тапсырма сипаттарын өңдеу',
        deletedTask       : 'Тапсырма жойылды',
        movedTask         : 'Тапсырма жылжытылды',
        movedTasks        : 'Тапсырмалар жылжытылды'
    }
};

export default LocaleHelper.publishLocale(locale);
