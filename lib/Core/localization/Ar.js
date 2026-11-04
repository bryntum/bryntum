import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Ar',
    localeDesc : 'اللغة العربية',
    localeCode : 'ar',
    localeRtl  : true,

    Object : {
        Yes      : 'نعم',
        No       : 'لا',
        Cancel   : 'إلغاء',
        Ok       : 'موافق',
        Week     : 'الأسبوع',
        None     : 'لا شيء',
        previous : 'السابق',
        next     : 'التالي',
        to       : 'إلى',
        at       : 'في',
        on       : 'على',
        editing  : what => `تحرير ${what}`,
        settings : 'الإعدادات',
        close    : 'إغلاق',
        go       : 'اذهب',
        save     : 'حفظ',
        cancel   : 'إلغاء',
        revert   : 'استعادة',
        collapse : 'تصغير',
        expand   : 'توسيع',
        today    : 'اليوم',
        andNMore : n => `و ${n} المزيد`
    },

    AIBase : {
        delayStatusTexts : [
            'انتظار',
            'انتظار ...',
            'ما زال في الانتظار',
            'ما زال في الانتظار ...'
        ],
        autoStartDialogMessage        : 'هل تريد تمكين تنشيط الصوت للذكاء الاصطناعي؟',
        voiceActivationToast          : phrase => `تم تفعيل التنشيط الصوتي، استخدم العبارة "${phrase}" لبدء المحادثة`,
        voiceControlNotSupportedToast : 'التحكم الصوتي غير مدعوم على هذا الجهاز',
        voiceControlErrorToast        : 'تعذر بدء التحكم الصوتي على جهازك',
        voiceControlSilenceToast      : phrase => `انتهت محادثة الذكاء الاصطناعي الصوتية بسبب الصمت. استخدم العبارة ${phrase} لإعادة بدء المحادثة`,
        noAudioDetected               : 'لم يتم اكتشاف صوت، يرجى المحاولة مرة أخرى',
        transcriptionErrorToast       : 'فشل النسخ، يرجى المحاولة مرة أخرى',
        playbackErrorToast            : 'فشل تشغيل الصوت، يرجى التحقق من جهاز إخراج الصوت الخاص بك',
        failed                        : '(فشل)',
        awaitingConfirmation          : 'في انتظار التأكيد',
        timeoutToast                  : 'انتهت صلاحية الرسالة',
        readingStatusText             : modelName => `قراءة ${modelName}s`,
        updatingStatusText            : modelName => `تحديث ${modelName}s`,
        removingStatusText            : modelName => `إزالة ${modelName}s`,
        addingStatusText              : modelName => `إضافة ${modelName}`,
        filteringStatusText           : modelName => `تصفية ${modelName}s`,
        thinkingStatusText            : 'جارٍ التفكير',
        processingStatusText          : 'جارٍ المعالجة'
    },

    AISettingsPanel : {
        highlight               : 'تمييز',
        verbosity               : 'التفصيل',
        voiceActivation         : 'تنشيط الصوت',
        enableVoiceActivation   : 'تمكين تنشيط الصوت',
        voiceOnly               : 'الصوت فقط',
        autostart               : 'بدء تلقائي',
        dataChangeConfirmations : 'تأكيدات تغيير البيانات',
        add                     : 'إضافة',
        remove                  : 'إزالة',
        update                  : 'تحديث',
        planning                : 'التخطيط',
        enablePlanning          : 'تمكين التخطيط',
        aiModel                 : 'نموذج الذكاء الاصطناعي',
        timeline                : 'الجدول الزمني',
        'in-view'               : 'في العرض',
        all                     : 'الكل',
        timeRangeContext        : 'سياق النطاق الزمني'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'الذكاء الاصطناعي يتحدث',
        recordingTooltip      : 'تسجيل',
        waitingTooltip        : 'الذكاء الاصطناعي يفكر',
        startRecordingTooltip : 'انقر للبدء',
        stopRecordingTooltip  : 'انقر للإيقاف',
        inactiveTooltip       : 'غير مسجل',
        openChatTooltip       : 'انقر بزر الماوس الأيمن لفتح الدردشة'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'اكتب رسالة',
        noConnectionTooltip     : 'لم يتم اكتشاف اتصال، انقر للمحاولة مرة أخرى',
        undone                  : 'تم التراجع',
        aborted                 : '(تم الإلغاء)',
        readAloudTooltip        : 'قراءة الرسالة بصوت عالٍ',
        confidenceTooltip       : confidence => `الثقة: ${confidence}%`,
        undoTooltip             : 'التراجع عن تغييرات البيانات',
        redoTooltip             : 'إعادة تغييرات البيانات',
        thumbsUp                : 'إعجاب',
        thumbsDown              : 'عدم إعجاب',
        feedbackToast           : 'شكرًا لك على ملاحظاتك!',
        clearChat               : 'مسح المحادثة',
        closeChat               : 'إغلاق الدردشة',
        settings                : 'الإعدادات',
        closeSettings           : 'إغلاق الإعدادات'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `اختر بالضبط ${min}`,
        tooFewOptionsSelected     : min => `اختر على الأقل ${min}`,
        tooManyOptionsSelected    : max => `اختر بحد أقصى ${max}`
    },

    CodeEditor : {
        apply        : 'تطبيق',
        autoApply    : 'تطبيق تلقائي',
        downloadCode : 'تحميل الأكواد'
    },

    ColorPicker : {
        noColor : 'لا لون'
    },

    Combo : {
        noResults          : 'لا نتائج',
        recordNotCommitted : 'لا يمكن إضافة السجل',
        addNewValue        : value => `${value} إضافة`
    },

    ConfirmationDialog : {
        highlight       : 'تمييز',
        preview         : 'معاينة',
        approve         : 'الموافقة',
        reject          : 'رفض',
        confirmAdd      : 'تأكيد الإضافة:',
        confirmUpdate   : 'تأكيد التحديث:',
        confirmRemove   : 'تأكيد الإزالة:',
        confirmCopy     : 'تأكيد النسخ',
        confirmAssign   : 'تأكيد التعيين',
        confirmReassign : 'تأكيد إعادة التعيين',
        confirmUnassign : 'تأكيد إلغاء التعيين',
        confirmLink     : 'تأكيد الرابط',
        confirmUnlink   : 'تأكيد إلغاء الرابط'
    },

    FilePicker : {
        file : 'ملف'
    },

    Field : {
        badInput              : 'قيمة الحقل غير صالحة',
        patternMismatch       : 'يجب أن تتطابق القيمة مع نمط معين',
        rangeOverflow         : value => `${value.max} يجب أن تكون القيمة أقل من أو تساوي`,
        rangeUnderflow        : value => `${value.min} يجب أن تكون القيمة أكبر من أو تساوي`,
        stepMismatch          : 'يجب أن تتناسب القيمة مع الخطوة',
        tooLong               : 'يجب أن تكون القيمة أقصر',
        tooShort              : 'يجب أن تكون القيمة أكبر',
        typeMismatch          : 'يجب أن تكون القيمة بتنسيق خاص',
        valueMissing          : 'هذا الحقل مطلوب',
        invalidValue          : 'قيمة حقل غير صالحة',
        minimumValueViolation : 'تجاوز حد القيمة الأدنى',
        maximumValueViolation : 'تجاوز حد القيمة الأقصى',
        fieldRequired         : 'هذا الحقل مطلوب',
        validateFilter        : 'يجب تحديد القيمة من القائمة'
    },

    DateField : {
        invalidDate : format => 'إدخال تاريخ غير صالح، التنسيق المتوقع هو ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'اذهب إلى السنة السابقة',
        gotoPrevMonth : 'اذهب إلى الشهر السابق',
        gotoNextMonth : 'اذهب إلى الشهر القادم',
        gotoNextYear  : 'اذهب إلى السنة القادمة',
        navigation    : 'التنقل في منتقي التاريخ'
    },

    Hint : {
        dontShowAgain : 'لا تظهر مرة أخرى'
    },

    NumberFormat : {
        locale   : 'ar',
        currency : 'USD'
    },

    DurationField : {
        invalidUnit : 'وحدة غير صالحة'
    },

    TimeField : {
        invalidTime : 'تم إدخال توقيت غير صالح'
    },

    TimePicker : {
        hour   : 'ساعة',
        minute : 'دقيقة',
        second : 'ثانية'
    },

    Tooltip : {
        loading : 'جارٍ التحميل...'
    },

    List : {
        loading   : '...جارٍ التحميل',
        selectAll : 'اختر الكل'
    },

    GridBase : {
        loadMask : '...جارٍ التحميل',
        syncMask : '...حفظ التغييرات، يُرجى الانتظار'
    },

    PagingToolbar : {
        firstPage         : 'اذهب للصفحة الأولى',
        prevPage          : 'اذهب للصفحة الثانية',
        page              : 'صفحة',
        nextPage          : 'اذهب للصفحة التالية',
        lastPage          : 'اذهب للصفحة الأخيرة',
        reload            : 'إعادة تحميل الصفحة الحالية',
        noRecords         : 'لا توجد سجلات لعرضها',
        pageCountTemplate : data => `${data.lastPage} من`,
        summaryTemplate   : data => `${data.allCount} من ${data.end} - ${data.start} عرض السجلات`
    },

    Popup : {
        close    : 'أغلق النافذة',
        maximize : 'تكبير'
    },

    Splitter : {
        ariaLabel      : 'الفاصل، استخدم مفاتيح الأسهم لتغيير حجم اللوحات المجاورة',
        collapseLeft   : 'طي اللوحة اليسرى',
        collapseRight  : 'طي اللوحة اليمنى',
        collapseTop    : 'طي اللوحة العلوية',
        collapseBottom : 'طي اللوحة السفلية',
        expandLeft     : 'توسيع اللوحة اليسرى',
        expandRight    : 'توسيع اللوحة اليمنى',
        expandTop      : 'توسيع اللوحة العلوية',
        expandBottom   : 'توسيع اللوحة السفلية'
    },

    TabPanel : {
        containsInvalidFields : 'علامة التبويب تحتوي على حقول غير صالحة'
    },

    Toolbar : {
        showOverflowingItems : 'إظهار العناصر الفائضة',
        scrollForMore        : 'قم بالتمرير للمزيد'
    },

    UndoRedo : {
        Undo           : 'إلغاء',
        Redo           : 'إعادة',
        UndoLastAction : 'إلغاء الإجراء الأخير',
        RedoLastAction : 'إعادة آخر إجراء تم إلغاؤه',
        NoActions      : 'لا توجد عناصر في قائمة انتظار الإلغاء'
    },

    FieldFilterPicker : {
        equals                 : 'يساوي',
        doesNotEqual           : 'لا يساوي',
        isEmpty                : 'فارغ',
        isNotEmpty             : 'ليس فارغًا',
        contains               : 'يحتوي على',
        doesNotContain         : 'لا يحتوي على',
        startsWith             : 'يبدأ بـ',
        endsWith               : 'ينتهي بـ',
        isOneOf                : 'واحد من',
        isNotOneOf             : 'ليس واحدًا من',
        isGreaterThan          : 'أكبر من',
        isLessThan             : 'أقل من',
        isGreaterThanOrEqualTo : 'أكبر من أو يساوي',
        isLessThanOrEqualTo    : 'أقل من أو يساوي',
        isBetween              : 'يتراوح ما بين',
        isNotBetween           : 'لا يتراوح ما بين',
        isBefore               : 'قبل',
        isAfter                : 'بعد',
        timeEquals             : 'الوقت يساوي',
        timeDoesNotEqual       : 'الوقت لا يساوي',
        isToday                : 'اليوم',
        isTomorrow             : 'غدًا',
        isYesterday            : 'أمس',
        isThisWeek             : 'هذا الأسبوع',
        isNextWeek             : 'الأسبوع القادم',
        isLastWeek             : 'الأسبوع الماضي',
        isThisMonth            : 'هذا الشهر',
        isNextMonth            : 'الشهر القادم',
        isLastMonth            : 'الشهر الماضي',
        isThisYear             : 'هذا العام',
        isNextYear             : 'العام القادم',
        isLastYear             : 'العام الماضي',
        isYearToDate           : 'منذ بداية العام حتى الآن',
        isTrue                 : 'صحيح',
        isFalse                : 'خطأ',
        selectAProperty        : 'اختر خاصية',
        selectAnOperator       : 'اختر مشغلاً',
        caseSensitive          : 'حساسية الموضوع',
        and                    : 'و',
        dateFormat             : 'D/M/YY',
        selectValue            : 'اختر قيمة',
        selectOneOrMoreValues  : 'اختر قيمة أو أكثر',
        enterAValue            : 'أدخل قيمة',
        enterANumber           : 'أدخل رقم',
        selectADate            : 'اختر تاريخًا',
        selectATime            : 'اختر الوقت'
    },

    FieldFilterPickerGroup : {
        addFilter : 'أضف عامل تصفية',
        applyCond : applied => applied ? 'تخطي الفلتر (مطبق حاليًا)' : 'تطبيق الفلتر (غير مطبق حاليًا)'
    },

    DateHelper : {
        locale         : 'ar-u-nu-latn',
        weekStartDay   : 6,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : 'ملليثانية', plural : 'مث', abbrev : 'مث' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'ثانية', plural : 'ثوانٍ', abbrev : 'ث' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'دقيقة', plural : 'دقائق', abbrev : 'د' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'ساعة', plural : 'ساعات', abbrev : 'س' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'يوم', plural : 'أيام', abbrev : 'ي' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'أسبوع', plural : 'أسابيع', abbrev : 'أ' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'شهر', plural : 'أشهر', abbrev : 'ش' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'ربعسنة', plural : 'أرباعسنوات', abbrev : 'ر' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'سنة', plural : 'سنوات', abbrev : 'سن' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'عقد', plural : 'عقود', abbrev : 'ع' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['ملليث'],
            [],
            ['ث', 'ثانية'],
            [],
            ['د', 'دقيقة'],
            [],
            ['س', 'ساعة'],
            [],
            ['ي'],
            [],
            ['أ', 'أسبوع'],
            [],
            ['ش', 'شهر', 'شهر'],
            [],
            ['ر', 'ربعسنة', 'ربعسنة'],
            [],
            ['سن', 'سنة'],
            [],
            ['د'],
            []
        ],
        parsers : {
            L   : 'DD/MM/YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number,
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}عقد `;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
