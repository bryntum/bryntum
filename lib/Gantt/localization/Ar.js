import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Ar.js';

const locale = {

    localeName : 'Ar',
    localeDesc : 'اللغة العربية',
    localeCode : 'ar',
    localeRtl  : true,

    Object : {
        Save : 'حفظ'
    },

    CostColumn : {
        cost : 'يكلف'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'تجاهل تقويم المورد'
    },

    InactiveColumn : {
        Inactive : 'غير نشط'
    },

    TaskInfoColumn : {
        info                     : 'معلومات',
        postponedConflictTooltip : 'يوجد تعارض في الجدولة لم يتم حله مع هذا الحدث. انقر لحلها.'
    },

    ActualEffortColumn : {
        actualEffort : 'الجهد الفعلي'
    },

    AddNewColumn : {
        'New Column' : 'عمود جديد'
    },

    BaselineEffortColumn : {
        baselineEffort : 'الجهد الأساسي'
    },

    BaselineStartDateColumn : {
        baselineStart : 'تاريخ بدء الأساس'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'تاريخ انتهاء الأساس'
    },

    BaselineDurationColumn : {
        baselineDuration : 'مدة الأساس'
    },

    BaselineStartVarianceColumn : {
        startVariance : ' تباين تاريخ البدء'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'تباين تاريخ الانتهاء'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'تباين المدة'
    },

    CalendarColumn : {
        Calendar : 'التقويم'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'بداية مبكرة'
    },

    EarlyEndDateColumn : {
        'Early End' : 'نهاية مبكرة'
    },

    LateStartDateColumn : {
        'Late Start' : 'بداية متأخرة'
    },

    LateEndDateColumn : {
        'Late End' : 'نهاية متأخرة'
    },

    TotalSlackColumn : {
        'Total Slack' : 'إجمالي فترة الركود'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'تاريخ التقييد'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'نوع التقييد'
    },

    DeadlineDateColumn : {
        Deadline : 'الموعد النهائي'
    },

    DependencyColumn : {
        'Invalid dependency' : 'تبعية غير صالحة'
    },

    DurationColumn : {
        Duration : 'المدة الزمنية'
    },

    EffortColumn : {
        Effort : 'الجهد'
    },

    EndDateColumn : {
        Finish : 'إنهاء'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'تمت جدولته يدويًا'
    },

    MilestoneColumn : {
        Milestone : 'علامة'
    },

    NameColumn : {
        Name : 'اسم'
    },

    NoteColumn : {
        Note : 'ملاحظة'
    },

    PercentDoneColumn : {
        '% Done' : '% تم إنجازه'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'المخطط % تم التنفيذ'
    },

    PredecessorColumn : {
        Predecessors : 'السالفة'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'الموارد المخصصة',
        'more resources'     : 'المزيد من الموارد'
    },

    RollupColumn : {
        Rollup : 'التراكم'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'وضع الجدولة'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'اتجاه الجدولة',
        inheritedFrom       : 'موروث من',
        enforcedBy          : 'فُرض بواسطة'
    },

    SequenceColumn : {
        Sequence : 'التسلسل'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'عرض في الجدول الزمني'
    },

    StartDateColumn : {
        Start : 'بدء'
    },

    SuccessorColumn : {
        Successors : 'اللاحقة'
    },

    TaskCopyPaste : {
        copyTask  : 'نسخ',
        cutTask   : 'قص',
        pasteTask : 'لصق'
    },

    WBSColumn : {
        WBS      : ' WBS',
        renumber : 'إعادة ترقيم'
    },

    DependencyField : {
        invalidDependencyFormat : 'تنسيق تبعية غير صالح'
    },

    ProjectLines : {
        'Project Start' : 'بداية المشروع',
        'Project End'   : 'نهاية المشروع',
        statusDate      : 'تاريخ الحالة'
    },

    TaskTooltip : {
        Start    : 'بدء',
        End      : 'إنهاء',
        Duration : 'المدة الزمنية',
        Complete : 'إكمال'
    },

    BasicTaskEdit : {
        editTask        : 'تحرير المهمة',
        name            : 'الاسم',
        percentComplete : '% مكتمل',
        start           : 'ابدأ',
        finish          : 'إنهاء',
        duration        : 'المدة'
    },

    AssignmentGrid : {
        Name     : 'اسم المورد',
        Units    : 'وحدات',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'الكمية',
        cost        : 'التكلفة',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'تعديل',
        Indent                 : 'مسافة بادئة',
        Outdent                : 'مسافة نهاية',
        'Convert to milestone' : 'تحويل إلى العلامة',
        Add                    : '...إضافة',
        'New task'             : 'مهمة جديدة',
        'New milestone'        : 'علامة جديدة',
        'Task above'           : 'المهمة السابقة بالأعلى',
        'Task below'           : 'المهمة التالية بالأسفل',
        'Delete task'          : 'حذف',
        Milestone              : 'علامة',
        'Sub-task'             : 'مهمة فرعية',
        Successor              : 'اللاحقة',
        Predecessor            : 'السابق',
        changeRejected         : 'محرك الجدولة رفض التغييرات',
        linkTasks              : 'إضافة التبعيات',
        unlinkTasks            : 'إزالة التبعيات',
        color                  : 'لون'
    },

    EventSegments : {
        splitTask : 'تقسيم المهمة'
    },

    Indicators : {
        earlyDates   : 'بداية/نهاية مبكرة',
        lateDates    : 'بداية/نهاية متأخرة',
        Start        : 'بداية',
        End          : 'نهاية',
        deadlineDate : 'الموعد النهائي'
    },

    Versions : {
        indented      : 'مسافة بادئة',
        outdented     : 'مسافة خارجة',
        cut           : 'قص',
        pasted        : 'تم اللصق',
        deletedTasks  : 'المهام المحذوفة',
        propertyNames : {
            baselines                   : 'الخطوط الأساسية',
            deadlineDate                : 'الموعد النهائي',
            description                 : 'الوصف',
            endDate                     : 'تاريخ الانتهاء',
            projectConstraintResolution : 'حل قيود المشروع',
            rollup                      : 'التجميع',
            taskIconCls                 : 'رمز المهمة',
            wbsValue                    : 'هيكل تقسيم العمل'
        }
    },

    ProjectEditor : {
        projectInformation : 'معلومات المشروع',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'عام',
        projectName  : 'اسم المشروع',
        start        : 'تاريخ البدء',
        finish       : 'تاريخ الانتهاء',
        scheduleFrom : 'الجدول الزمني من',
        calendar     : 'تقويم',
        readOnly     : 'قراءة فقط',
        forward      : 'تاريخ بدء المشروع',
        backward     : 'تاريخ انتهاء المشروع'
    },

    ProjectEditorDescriptionTab : {
        description : 'وصف'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'متقدم',
        hoursPerDay  : 'ساعات في اليوم',
        daysPerWeek  : 'أيام في الأسبوع',
        daysPerMonth : 'أيام في الشهر'
    }
};

export default LocaleHelper.publishLocale(locale);
