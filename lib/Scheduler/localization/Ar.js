import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Ar.js';
import '../../Grid/localization/Ar.js';

const locale = {

    localeName : 'Ar',
    localeDesc : 'اللغة العربية',
    localeCode : 'ar',
    localeRtl  : true,

    Object : {
        newEvent    : 'حدث جديد',
        information : 'معلومات',
        showDetails : 'عرض التفاصيل'
    },

    ResourceInfoColumn : {
        eventCountText : data => 'حدث' + (data !== 1 ? 'الأ' : '') + ' ' + data
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'تبديل عمود تخطيط المورد. اضغط SPACE للقائمة السياقية.'
    },

    Dependencies : {
        from    : 'منذ',
        to      : 'إلى',
        valid   : 'صالح',
        invalid : 'غير صالح'
    },

    DependencyType : {
        SS           : 'ب ب',
        SF           : 'ب ن',
        FS           : 'ن ب',
        FF           : 'ن ن',
        StartToStart : 'من البداية إلى البداية',
        StartToEnd   : 'من البداية إلى النهاية',
        EndToStart   : 'من النهاية إلى البداية',
        EndToEnd     : 'من النهاية إلى النهاية',
        short        : [
            'ب ب',
            'ب ن',
            'ن ب',
            'ن ن'
        ],
        long : [
            'من البداية إلى البداية',
            'من البداية إلى النهاية',
            'من النهاية إلى البداية',
            'من النهاية إلى النهاية'
        ]
    },

    DependencyEdit : {
        From              : 'من',
        To                : 'إلى',
        Type              : 'النوع',
        Lag               : 'تأخر',
        color             : 'اللون',
        lineStyle         : 'نمط الخط',
        solid             : 'صلب',
        dashed            : 'متقطع',
        dotted            : 'منقط',
        dashDot           : 'شرطة ونقطة',
        longDash          : 'شرطة طويلة',
        'Edit dependency' : 'تعديل التبعية',
        Save              : 'حفظ',
        Delete            : 'حذف',
        Cancel            : 'إلغاء',
        StartToStart      : ' من البداية إلى البداية',
        StartToEnd        : ' من البداية إلى النهاية',
        EndToStart        : 'من النهاية إلى البداية',
        EndToEnd          : ' من النهاية إلى النهاية',
        Active            : 'نشط'
    },

    EventEdit : {
        Name           : 'الاسم',
        Resource       : 'المورد',
        Start          : 'بدء',
        startTime      : 'وقت البدء',
        End            : 'إنهاء',
        endTime        : 'وقت الانتهاء',
        Save           : 'حفظ',
        Delete         : 'حذف',
        Cancel         : 'إلغاء',
        'Edit event'   : 'تعديل حدث',
        Repeat         : 'تجديد',
        editRecurrence : 'تحرير التكرار'
    },

    EventDrag : {
        eventOverlapsExisting   : 'يتداخل الحدث مع حدث موجود لهذا المورد',
        noDropOutsideTimeline   : 'قد لا يتم إخراج هذا الحدث بالكامل خارج المخطط الزمني',
        duplicateAssignmentDrag : 'لا يمكن تعيين الحدث لنفس المورد عدة مرات'
    },

    SchedulerBase : {
        'Add event'      : 'إضافة حدث',
        'Delete event'   : 'حذف حدث',
        'Unassign event' : 'حدث غير معين',
        color            : 'لون',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}، يبدأ في ${startDate} ${eventRecord.duration > 0 ? `لمدة ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'تكبير',
        activeDateRange : 'النطاق الزمني',
        startText       : 'تاريخ البداية',
        endText         : 'تاريخ النهاية',
        todayText       : 'اليوم'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `المحور الزمني يعرض من ${startDate} إلى ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'نسخ حدث',
        cutEvent   : 'قص حدث',
        pasteEvent : 'لصق حدث'
    },

    EventFilter : {
        filterEvents : 'تصفية المهام',
        byName       : 'بالاسم'
    },

    TimeRanges : {
        showCurrentTimeLine : 'إظهار الخط الزمني الحالي'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'ثواني'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD/MM, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD/MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'يوم'
        },
        day : {
            name : 'يوم/ساعات'
        },
        week : {
            name : 'أسبوع/ساعات'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'أسبوع/أيام'
        },
        dayAndMonth : {
            name : 'شهر'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'أسبوع'
        },
        weekAndMonth : {
            name : 'أسابيع'
        },
        weekAndDayLetter : {
            name : 'أسابيع/أيام الأسبوع'
        },
        weekDateAndMonth : {
            name : 'شهور/أسابيع'
        },
        monthAndYear : {
            name : 'شهور'
        },
        year : {
            name : 'سنوات'
        },
        manyYears : {
            name : 'عدة سنوات'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'أنت بصدد حذف حدث',
        'delete-all-message'        : 'هل تريد حذف جميع تكرارات هذا الحدث؟',
        'delete-further-message'    : 'هل تريد حذف هذا الحدث وجميع التكرارات المستقبلية له، أم التكرار المحدد فقط؟',
        'delete-only-this-message'  : 'هل تريد حذف هذه النسخة من الحدث؟',
        'delete-further-btn-text'   : 'حذف جميع الأحداث المستقبلية',
        'delete-only-this-btn-text' : 'حذف هذا الحدث فقط',
        'update-title'              : 'أنت بصدد تغيير حدث متكرر',
        'update-all-message'        : 'هل تريد تغيير جميع تكرارات هذا الحدث؟',
        'update-further-message'    : 'هل تريد تغيير التكرار المحدد للحدث فقط، أم تغيير الحدث وجميع التكرارات المستقبلية له؟',
        'update-only-this-message'  : 'هل تريد تغيير هذه النسخة من الحدث؟',
        'update-further-btn-text'   : 'جميع الأحداث المستقبلية',
        'update-only-this-btn-text' : 'هذا الحدث فقط',
        Yes                         : 'نعم',
        Cancel                      : 'إلغاء',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' و ',
        Daily                           : 'يوميًا',
        'Weekly on {1}'                 : ({ days }) => `${days} أسبوعيًا في`,
        'Monthly on {1}'                : ({ days }) => `${days} شهريًا في`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `${months} من ${days} سنويًا في ${days}`,
        'Every {0} days'                : ({ interval }) => `يومًا ${interval} كل`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `${days} أسبوعًا في ${interval} كل`,
        'Every {0} months on {1}'       : ({ interval, days }) => `${days} شهر في ${interval} كل`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `${months} من ${days}  سنة في ${interval} كل`,
        position1                       : 'الأول',
        position2                       : 'الثاني',
        position3                       : 'الثالث',
        position4                       : 'الرابع',
        position5                       : 'الخامس',
        'position-1'                    : 'الأخير',
        day                             : 'يوم',
        weekday                         : 'يوم من أيام الأسبوع',
        'weekend day'                   : 'يوم عطلة نهاية الأسبوع',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'كرر الحدث',
        Cancel              : 'إلغاء',
        Save                : 'حفظ',
        Frequency           : 'التردد',
        Every               : 'كل',
        DAILYintervalUnit   : 'يوم (أيام)',
        WEEKLYintervalUnit  : 'أسبوع (أسابيع)',
        MONTHLYintervalUnit : 'شهر (شهور)',
        YEARLYintervalUnit  : 'سنة (سنوات)',
        Each                : 'كل',
        on                  : 'على',
        the                 : 'ال',
        'On the'            : 'في ال',
        'End repeat'        : 'نهاية التكرار',
        'time(s)'           : 'وقت (أوقات)',
        Days                : 'أيام',
        Months              : 'شهور'
    },

    RecurrenceDaysCombo : {
        day           : 'يوم',
        weekday       : 'يوم من أيام الأسبوع',
        'weekend day' : 'يوم عطلة نهاية الأسبوع'
    },

    RecurrencePositionsCombo : {
        position1    : 'أول',
        position2    : 'ثانٍ',
        position3    : 'ثالث',
        position4    : 'رابع',
        position5    : 'خامس',
        'position-1' : 'أخير'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'أبدًا',
        After     : 'بعد',
        'On date' : 'بتاريخ'
    },

    RecurrenceFrequencyCombo : {
        None    : 'لا يوجد تكرار',
        Daily   : 'يوميًا',
        Weekly  : 'أسبوعيًا',
        Monthly : 'شهريًا',
        Yearly  : 'سنويًا'
    },

    RecurrenceCombo : {
        None   : 'لا يوجد',
        Custom : 'مخصص...'
    },

    Summary : {
        'Summary for' : date => `${date} موجز ل`
    },

    ScheduleRangeCombo : {
        completeview : 'جدول زمني كامل',
        currentview  : 'جدول زمني مرئي',
        daterange    : 'نطاق التاريخ',
        completedata : 'جدول زمني كامل (لكل الأحداث)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'نطاق الجدول الزمني',
        'Export from'    : 'من',
        'Export to'      : 'إلى'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'صفحة واحدة'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'صفحة واحدة (غير مقيّسة)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'صفحات متعددة (عمودي)'
    },

    ExcelExporter : {
        'No resource assigned' : 'لم يتم تحديد مورد'
    },

    CrudManagerView : {
        serverResponseLabel : 'استجابة الخادم:'
    },

    DurationColumn : {
        Duration : 'المدة الزمنية'
    },

    EventClusteringBase : {
        unnamed         : 'غير مسمى',
        more            : count => `+ ${count} أخرى`,
        clusteredEvents : count => `الأحداث المجمعة: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `النطاقات المجمعة: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'لا يوجد',
        assoonaspossible    : 'في أقرب وقت ممكن',
        aslateaspossible    : 'في أحرى وقت ممكن',
        muststarton         : 'يجب أن يبدأ في',
        mustfinishon        : 'يجب أن ينتهي في',
        startnoearlierthan  : 'لا تبدأ قبل',
        startnolaterthan    : 'ابدأ في قبل',
        finishnoearlierthan : 'لا تنهِ قبل',
        finishnolaterthan   : 'أنهِ قبل'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} وقت مؤقت قبل الحدث`;
            }
            if (postamble) {
                description += `.${postamble.toString()} وقت مؤقت بعد الحدث`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'إلى الأمام',
        Backward      : 'إلى الخلف',
        inheritedFrom : 'موروث من',
        enforcedBy    : 'فُرض بواسطة'
    },

    CalendarField : {
        'Default calendar' : 'التقويم الافتراضي',
        editCalendar       : 'تحرير التقويم'
    },

    TaskEditorBase : {
        Information   : 'معلومات المهمة',
        Save          : 'حفظ',
        Cancel        : 'إلغاء',
        Delete        : 'حذف',
        calculateMask : '...جارٍ الحساب',
        saveError     : 'حفظ، المرجو تصحيح الأخطاء أولا',
        repeatingInfo : 'عرض حدث متكرر',
        editRepeating : 'تعديل'
    },

    TaskEdit : {
        editEvent              : 'تعديل حدث',
        ConfirmDeletionTitle   : 'تأكيد الحذف',
        ConfirmDeletionMessage : 'هل أنت متأكد من أنك تريد حذف الحدث؟'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '33em'
    },

    SchedulerGeneralTab : {
        General      : 'عام',
        Name         : 'اسم',
        Resources    : 'الموارد',
        '% complete' : '% تم إكماله',
        Duration     : 'المدة الزمنية',
        Start        : 'ابدأ',
        Finish       : 'إنهاء',
        Effort       : 'الجهد',
        Preamble     : 'الديباجة',
        Postamble    : 'الخاتمة'
    },

    GeneralTab : {
        General      : 'عام',
        Name         : 'اسم',
        '% complete' : '% تم إكماله',
        Duration     : 'المدة الزمنية',
        Start        : 'بدء',
        Finish       : 'إنهاء',
        Effort       : 'الجهد',
        Dates        : 'المواعيد'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'متقدم',
        Calendar                   : 'التقويم',
        'Scheduling mode'          : 'وضع الجدولة',
        'Effort driven'            : 'حسب الجهد',
        'Manually scheduled'       : 'تمت جدولته يدويًا',
        'Constraint type'          : 'نوع التقييد',
        'Constraint date'          : 'تاريخ التقييد',
        Inactive                   : 'غير نشط',
        'Ignore resource calendar' : 'تجاهل تقويم المورد'
    },

    CalendarEditorDatePicker : {
        addException : 'إضافة استثناء',
        addWeek      : 'أضف الأسبوع'
    },

    CalendarEditorExceptionTab : {
        addException    : 'إضافة استثناء',
        removeException : 'إزالة الاستثناء',
        noRows          : 'لا تم إضافة استثناءات'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'أضف الأسبوع',
        removeWeek : 'إزالة الأسبوع'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'تعمل الأيام افتراضيًا',
        workingTimeCalendar        : 'تقويم وقت العمل',
        exceptions                 : 'استثناءات',
        general                    : 'عام',
        name                       : 'اسم',
        parent                     : 'الأبوين',
        save                       : 'يحفظ',
        weeks                      : 'أسابيع',
        error                      : 'خطأ',
        inputErrors                : 'هناك أخطاء إدخال. يرجى إصلاحها قبل حفظ التغييرات الخاصة بك.',
        delete                     : 'يمسح',
        addCalendar                : 'إضافة تقويم',
        confirmation               : 'تأكيد',
        removeCalendarWithChildren : 'التقويم لديه تقويمات الطفل. انقر فوق "نعم" لإزالة التقويم مع أطفاله.',
        removeCalendarAndLinks     : 'يتم استخدام التقويم من قبل بعض السجلات. انقر فوق "نعم" لإلغاء ربطهم وإزالة التقويم.',
        newException               : 'استثناء جديد',
        newWeek                    : 'اسبوع جديد'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' يعمل',
        isNotWorking : ' لا يعمل',
        basedOn      : ' مرتكز على:',
        byDefault    : 'بشكل افتراضي',
        rangeTpl     : (start, end) => `${start} إلى ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'يوم عمل',
        nonWorkingDay : 'يوم عدم العمل'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'هناك نطاقات متداخلة',
        errorMissingDate   : 'مطلوب وقت البدء والنهاية',
        errorStartAfterEnd : 'لا يمكن أن يكون وقت البدء بعد النهاية'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'اسم',
        from                                 : 'من',
        to                                   : 'ل',
        is                                   : 'يكون',
        nonWorking                           : 'غير العاملين',
        working                              : 'عمل',
        hours                                : 'ساعات',
        repeat                               : 'يكرر',
        repeatEnd                            : 'كرر النهاية',
        errorMissingDate                     : 'نطاق تاريخ الاستثناء مطلوب',
        errorStartAfterEnd                   : 'يجب أن تكون القيمة أقل من أو تساوي',
        errorStartAndEndRepeatNumberMismatch : 'يجب أن يبدأ الاستثناء وإنهاء نفس عدد المرات'
    },

    CalendarEditorWeekPanel : {
        name        : 'اسم',
        from        : 'من',
        to          : 'ل',
        days        : 'أيام',
        copyDay     : 'نسخ يوم',
        pasteDay    : 'لصق يوم',
        stopCopying : 'توقف عن النسخ'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'إضافة المدى',
        removeRange : 'إزالة النطاق'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : 'يجب أن تكون القيمة أقل من أو تساوي',
        errorNoDefaultWeek           : 'تكوين الأسبوع مطلوب',
        errorMultipleDefaultWeeks    : 'تم تحديد أكثر من أسبوع افتراضي واحد',
        errorNoWeekAvailability      : 'يجب أن يوفر الأسبوع بعض وقت العمل',
        errorInvalidWeekAvailability : 'يحتوي الأسبوع على أخطاء تكوين وقت العمل',
        noRows                       : 'لم أضاف أسابيع'
    },

    AdvancedTab : {
        Advanced                   : 'متقدم',
        Calendar                   : 'التقويم',
        'Scheduling mode'          : 'وضع الجدولة',
        'Effort driven'            : 'حسب الجهد',
        'Manually scheduled'       : 'تمت جدولته يدويًا',
        'Constraint type'          : 'نوع التقييد',
        'Constraint date'          : 'تاريخ التقييد',
        Constraint                 : 'التقييد',
        Rollup                     : 'التراكمي',
        Inactive                   : 'غير نشط',
        'Ignore resource calendar' : 'تجاهل تقويم المورد',
        'Scheduling direction'     : 'اتجاه الجدولة',
        projectBorder              : 'المشروع الحدود',
        ignore                     : 'يتجاهل',
        honor                      : 'شرف',
        askUser                    : 'اسأل المستخدم'
    },

    DependencyTab : {
        Predecessors      : 'السالفة',
        Successors        : 'اللاحقة',
        ID                : 'المعرف',
        Name              : 'اسم',
        Type              : 'النوع',
        Lag               : 'تأخير',
        cyclicDependency  : 'التبعية الدورية',
        invalidDependency : 'تبعية غير صالحة',
        readOnlyTask      : 'لا يمكن ربط مهمة للقراءة فقط'
    },

    NotesTab : {
        Notes : 'ملاحظات'
    },

    ResourceCalendarColumn : {
        calendar : 'تقويم'
    },

    ResourceEdit : {
        editResource : 'تحرير المورد'
    },

    ResourceEditor : {
        resourceInformation : 'معلومات الموارد',
        costs               : 'التكاليف',
        save                : 'يحفظ',
        error               : 'خطأ',
        inputErrors         : 'هناك أخطاء في الإدخال. يرجى إصلاحها قبل حفظ التغييرات الخاصة بك.',
        delete              : 'يمسح',
        confirmation        : 'تأكيد',
        removeUsedResource  : 'تم تعيين المورد لبعض المهام. انقر فوق "نعم" لإزالة المورد على أي حال.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'تقويم',
        general     : 'عام',
        label       : 'تسمية المواد',
        name        : 'اسم المورد',
        type        : 'يكتب',
        costAccrual : 'تراكم التكلفة',
        labelHint   : 'على سبيل المثال، كجم، طن أو صناديق',
        maxUnits    : 'الحد الأقصى للوحدات'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'تتراكم عند',
        prorated : 'متناسب',
        start    : 'يبدأ',
        end      : 'نهاية'
    },

    CostAccrualField : {
        prorated : 'متناسب',
        start    : 'يبدأ',
        end      : 'نهاية'
    },

    ResourceType : {
        work     : 'عمل',
        material : 'مادة',
        cost     : 'يكلف'
    },

    ResourceTypeColumn : {
        type : 'يكتب'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'جدول الأسعار',
        newGroup     : 'طاولة جديدة',
        removeGroup  : 'إزالة الجدول',
        useByDefault : 'يُستخدم بشكل افتراضي لتعيينات الموارد',
        noRates      : 'لا معدلات'
    },

    ResourceGrid : {
        name          : 'اسم',
        materialLabel : 'تسمية المواد',
        maxUnits      : 'وحدات ماكس',
        cost          : 'يكلف',
        noRows        : 'لا توجد موارد'
    },

    ResourceRateTableContainer : {
        startDate    : 'تاريخ البدء',
        standardRate : 'المعدل القياسي',
        perUseCost   : 'تكلفة الاستخدام الواحد',
        addRate      : 'إضافة معدل',
        removeRate   : 'إزالة المعدل',
        name         : 'اسم',
        noRates      : 'لا معدلات'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'معلومات جدول الأسعار'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'كمية',
        Resources   : 'الموارد',
        Resource    : 'المورد',
        Units       : 'الوحدات',
        cost        : 'يكلف',
        effort      : 'جهد',
        start       : 'يبدأ',
        finish      : 'ينهي',
        preamble    : 'المقدمة',
        postamble   : 'الخاتمة'
    },

    RateTableColumn : {
        rateTable : 'جدول الأسعار'
    },

    RecurrenceTab : {
        title : 'العنوان'
    },

    SchedulingModePicker : {
        Normal           : 'طبيعي',
        'Fixed Duration' : 'المدة الزمنية الثابتة',
        'Fixed Units'    : 'الوحدات الثابتة',
        'Fixed Effort'   : 'الجهد الثابت'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} من {available}</span> المخصص',
        barTipOnDate          : '<b>{resource}</b> بتاريخ {startDate}<br><span class="{cls}">{allocated} من {available}</span> المخصص',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} من {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} من {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'في {startDate}<br><span class="{cls}">{allocated} من {available}</span> المخصص:<br>{assignments}',
        plusMore              : '+{value} أكثر'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">الجهد</div><div class="b-effort-value {cls}">{allocated} من {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">الجهد</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">التكلفة</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">الكمية</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} في {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">ملخص لـ {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">ملخص لـ {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} المزيد',
        nameColumnText        : 'المورد / الحدث'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'إلغاء التغييرات وعدم فعل شيء',
        schedulingConflict : 'تعارض في الجدولة',
        emptyCalendar      : 'خطأ في تكوين التقويم',
        cycle              : 'دورة الجدولة',
        Apply              : 'تطبيق'
    },

    CycleResolutionPopup : {
        dependencyLabel        : ':يُرجى اختيار تبعية',
        invalidDependencyLabel : ':هناك تبعيات غير صالحة متضمنة تحتاج لأن تعالج'
    },

    SchedulerProBase : {
        propagating     : 'جارٍ حساب المشروع',
        storePopulation : 'جارٍ تحميل البيانات',
        finalizing      : 'جارٍ إنهاء النتائج'
    },

    EventSegments : {
        splitEvent    : 'تقسيم الحدث',
        renameSegment : 'إعادة التسمية'
    },

    NestedEvents : {
        createGroup         : 'تجميع الأحداث المحددة',
        newGroupName        : 'مجموعة جديدة',
        deNestingNotAllowed : 'غير مسموح بإزالة التداخل',
        nestingNotAllowed   : 'غير مسموح بالتداخل'
    },

    VersionGrid : {
        compare       : 'قارن',
        description   : 'الوصف',
        occurredAt    : 'حدث في',
        rename        : 'إعادة التسمية',
        restore       : 'استعادة',
        stopComparing : 'توقف عن المقارنة'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'المهمة',
            AssignmentModel : 'التعيين',
            DependencyModel : 'الرابط',
            ProjectModel    : 'المشروع',
            ResourceModel   : 'المصدر',
            other           : 'الموضوع'
        },
        entityNamesPlural : {
            TaskModel       : 'المهام',
            AssignmentModel : 'التعيينات',
            DependencyModel : 'الروابط',
            ProjectModel    : 'المشاريع',
            ResourceModel   : 'المصادر',
            other           : 'المواضيع'
        },
        transactionDescriptions : {
            update : 'تم تغيير {n} {entities}',
            add    : 'تمت إضافة {n} {entities}',
            remove : 'تمت إزالة {n} {entities}',
            move   : 'تم نقل {n} {entities}',
            mixed  : 'تم تغيير {n} {entities}'
        },
        propertyNames : {
            active                   : 'نشط',
            allDay                   : 'طوال اليوم',
            allowOverlap             : 'السماح بالتداخل',
            barMargin                : 'هامش الشريط',
            bidirectional            : 'ثنائي الاتجاه',
            calendar                 : 'التقويم',
            cls                      : 'فئة CSS',
            constraintDate           : 'تاريخ القيد',
            constraintType           : 'نوع القيد',
            daysPerMonth             : 'أيام في الشهر',
            daysPerWeek              : 'أيام في الأسبوع',
            delayFromParent          : 'تأخير من الأصل',
            direction                : 'الاتجاه',
            drawDependencies         : 'رسم التبعيات',
            duration                 : 'المدة',
            durationUnit             : 'وحدة المدة',
            effort                   : 'الجهد',
            effortDriven             : 'مدفوع بالجهد',
            effortUnit               : 'وحدة الجهد',
            endDate                  : 'تاريخ الانتهاء',
            eventColor               : 'اللون',
            eventId                  : 'معرف الحدث',
            eventLayout              : 'تخطيط الحدث',
            eventStyle               : 'نمط الشريط',
            exceptionDates           : 'تواريخ الاستثناء',
            fixed                    : 'ثابت',
            from                     : 'من',
            fromSide                 : 'من الجانب',
            hoursPerDay              : 'ساعات في اليوم',
            href                     : 'الرابط',
            iconCls                  : 'الأيقونة',
            id                       : 'المعرف',
            ignoreResourceCalendar   : 'تجاهل تقويم المورد',
            ignoreTimeZone           : 'تجاهل المنطقة الزمنية',
            image                    : 'الصورة',
            imageUrl                 : 'رابط الصورة',
            inactive                 : 'غير نشط',
            intervals                : 'الفواصل الزمنية',
            lag                      : 'التأخير',
            lagUnit                  : 'وحدة التأخير',
            lineStyle                : 'نمط الخط',
            manuallyScheduled        : 'مجدول يدويًا',
            milestoneWidth           : 'عرض المعلم',
            name                     : 'الاسم',
            note                     : 'ملاحظة',
            parentId                 : 'معرف الأصل',
            parentIndex              : 'الموضع',
            percentDone              : '% مكتمل',
            postamble                : 'الختام',
            preamble                 : 'المقدمة',
            readOnly                 : 'للقراءة فقط',
            recurrenceRule           : 'قاعدة التكرار',
            resourceId               : 'معرف المورد',
            resourceMargin           : 'هامش المورد',
            rowHeight                : 'ارتفاع الصف',
            schedulingMode           : 'وضع الجدولة',
            segments                 : 'الأجزاء',
            showAvatar               : 'عرض الصورة الرمزية',
            showInTimeline           : 'عرض في الجدول الزمني',
            startDate                : 'تاريخ البدء',
            stickyContents           : 'محتويات ثابتة',
            strokeColor              : 'لون الخط',
            style                    : 'النمط',
            target                   : 'هدف الرابط',
            to                       : 'إلى',
            toSide                   : 'إلى الجانب',
            type                     : 'النوع',
            units                    : 'الوحدات',
            unscheduled              : 'غير مجدول',
            unspecifiedTimeIsWorking : 'الوقت غير المحدد هو وقت العمل',
            version                  : 'الإصدار'
        },
        intervals : {
            working    : 'عمل',
            nonWorking : 'غير عمل',
            fromTo     : 'من {from} إلى {to}',
            recurring  : 'متكرر يبدأ {start} وينتهي {end}'
        },
        addEntity         : 'تمت الإضافة {type} **{name}**',
        removeEntity      : 'تمت إزالة {type} **{name}**',
        updateEntity      : 'تم تغيير {type} **{name}**',
        moveEntity        : 'تم النقل {type} **{name}** من {from} إلى {to}',
        addDependency     : 'تمت إضافة رابط من **{from}** إلى **{to}**',
        removeDependency  : 'تمت إزالة رابط من **{from}** إلى **{to}**',
        updateDependency  : 'تم تعديل رابط من **{from}** إلى **{to}**',
        addAssignment     : 'تم تعيين **{resource}** إلى **{event}**',
        removeAssignment  : 'تمت إزالة تعيين **{resource}** من **{event}**',
        updateAssignment  : 'تم تعديل تعيين **{resource}** من **{event}**',
        noChanges         : 'لا توجد تغييرات',
        nullValue         : 'لا يوجد',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'تم الحفظ في {date}',
        autoSavedAt       : 'تم الحفظ التلقائي في {date}',
        undid             : 'تم إلغاء التغييرات',
        redid             : 'تمت إعادة التغييرات',
        editedTask        : 'خصائص المهمة المعدلة',
        deletedTask       : 'تم حذف المهمة',
        movedTask         : 'تم نقل المهمة',
        movedTasks        : 'تم نقل المهام'
    }
};

export default LocaleHelper.publishLocale(locale);
