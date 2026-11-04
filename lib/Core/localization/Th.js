import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Th',
    localeDesc : 'ไทย',
    localeCode : 'th',
    localeRtl  : false,

    Object : {
        Yes      : 'ใช่',
        No       : 'ไม่ใช่',
        Cancel   : 'ยกเลิก',
        Ok       : 'ตกลง',
        Week     : 'สัปดาห์',
        None     : 'ไม่มี',
        previous : 'ก่อนหน้า',
        next     : 'ถัดไป',
        to       : 'ถึง',
        at       : 'ที่',
        on       : 'บน',
        editing  : what => `กำลังแก้ไข ${what}`,
        settings : 'การตั้งค่า',
        close    : 'ปิด',
        go       : 'ไป',
        save     : 'บันทึก',
        cancel   : 'ยกเลิก',
        revert   : 'ย้อนกลับ',
        collapse : 'ย่อ',
        expand   : 'ขยาย',
        today    : 'วันนี้',
        andNMore : n => `และ ${n} เพิ่มเติม`
    },

    AIBase : {
        delayStatusTexts : [
            'กำลังรอ',
            'กำลังรอ ...',
            'ยังคงรอ',
            'ยังคงรอ ...'
        ],
        autoStartDialogMessage        : 'คุณต้องการเปิดใช้งานการเปิดใช้งานเสียง AI หรือไม่?',
        voiceActivationToast          : phrase => `เปิดใช้งานเสียงแล้ว ใช้คำว่า "${phrase}" เพื่อเริ่มการสนทนา`,
        voiceControlNotSupportedToast : 'การควบคุมด้วยเสียงไม่รองรับบนอุปกรณ์นี้',
        voiceControlErrorToast        : 'ไม่สามารถเริ่มการควบคุมด้วยเสียงบนอุปกรณ์ของคุณได้',
        voiceControlSilenceToast      : phrase => `การสนทนาเสียง AI สิ้นสุดลงเนื่องจากความเงียบ ใช้คำว่า ${phrase} เพื่อเริ่มการสนทนาใหม่`,
        noAudioDetected               : 'ไม่พบเสียง กรุณาลองอีกครั้ง',
        transcriptionErrorToast       : 'การถอดเสียงล้มเหลว กรุณาลองอีกครั้ง',
        playbackErrorToast            : 'การเล่นเสียงล้มเหลว กรุณาตรวจสอบอุปกรณ์เสียงของคุณ',
        failed                        : '(ล้มเหลว)',
        awaitingConfirmation          : 'กำลังรอยืนยัน',
        timeoutToast                  : 'ข้อความหมดเวลา',
        readingStatusText             : modelName => `กำลังอ่าน ${modelName}s`,
        updatingStatusText            : modelName => `กำลังอัปเดต ${modelName}s`,
        removingStatusText            : modelName => `กำลังลบ ${modelName}s`,
        addingStatusText              : modelName => `กำลังเพิ่ม ${modelName}`,
        filteringStatusText           : modelName => `กำลังกรอง ${modelName}s`,
        thinkingStatusText            : 'กำลังคิด',
        processingStatusText          : 'กำลังประมวลผล'
    },

    AISettingsPanel : {
        highlight               : 'เน้น',
        verbosity               : 'ความยาว',
        voiceActivation         : 'การเปิดใช้งานเสียง',
        enableVoiceActivation   : 'เปิดใช้งานเสียง',
        voiceOnly               : 'เฉพาะเสียง',
        autostart               : 'เริ่มต้นอัตโนมัติ',
        dataChangeConfirmations : 'การยืนยันการเปลี่ยนแปลงข้อมูล',
        add                     : 'เพิ่ม',
        remove                  : 'ลบ',
        update                  : 'อัปเดต',
        planning                : 'การวางแผน',
        enablePlanning          : 'เปิดใช้งานการวางแผน',
        aiModel                 : 'โมเดล AI',
        timeline                : 'ไทม์ไลน์',
        'in-view'               : 'ในมุมมอง',
        all                     : 'ทั้งหมด',
        timeRangeContext        : 'บริบทช่วงเวลา'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI กำลังพูด',
        recordingTooltip      : 'กำลังบันทึก',
        waitingTooltip        : 'AI กำลังคิด',
        startRecordingTooltip : 'คลิกเพื่อเริ่ม',
        stopRecordingTooltip  : 'คลิกเพื่อหยุด',
        inactiveTooltip       : 'ไม่ได้บันทึก',
        openChatTooltip       : 'คลิกขวาเพื่อเปิดแชท'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'พิมพ์ข้อความ',
        noConnectionTooltip     : 'ไม่พบการเชื่อมต่อ คลิกเพื่อทดลองอีกครั้ง',
        undone                  : 'ยกเลิก',
        aborted                 : '(ยกเลิก)',
        readAloudTooltip        : 'อ่านข้อความออกเสียง',
        confidenceTooltip       : confidence => `ความมั่นใจ: ${confidence}%`,
        undoTooltip             : 'ยกเลิกการเปลี่ยนแปลงข้อมูล',
        redoTooltip             : 'ทำซ้ำการเปลี่ยนแปลงข้อมูล',
        thumbsUp                : 'ชอบ',
        thumbsDown              : 'ไม่ชอบ',
        feedbackToast           : 'ขอบคุณสำหรับความคิดเห็นของคุณ!',
        clearChat               : 'ล้างการสนทนา',
        closeChat               : 'ปิดการสนทนา',
        settings                : 'การตั้งค่า',
        closeSettings           : 'ปิดการตั้งค่า'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `เลือก ${min} รายการเท่านั้น`,
        tooFewOptionsSelected     : min => `เลือกอย่างน้อย ${min} รายการ`,
        tooManyOptionsSelected    : max => `เลือกไม่เกิน ${max} รายการ`
    },

    CodeEditor : {
        apply        : 'ใช้',
        autoApply    : 'ใช้โดยอัตโนมัติ',
        downloadCode : 'ดาวน์โหลดโค้ด'
    },

    ColorPicker : {
        noColor : 'ไม่มีสี'
    },

    Combo : {
        noResults          : 'ไม่พบผลลัพธ์',
        recordNotCommitted : 'ไม่สามารถเพิ่มบันทึกได้',
        addNewValue        : value => `เพิ่ม ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'เน้น',
        preview         : 'ดูตัวอย่าง',
        approve         : 'อนุมัติ',
        reject          : 'ปฏิเสธ',
        confirmAdd      : 'ยืนยันการเพิ่ม:',
        confirmUpdate   : 'ยืนยันการอัปเดต:',
        confirmRemove   : 'ยืนยันการลบ:',
        confirmCopy     : 'ยืนยันการคัดลอก',
        confirmAssign   : 'ยืนยันการมอบหมาย',
        confirmReassign : 'ยืนยันการมอบหมายใหม่',
        confirmUnassign : 'ยืนยันการยกเลิกการมอบหมาย',
        confirmLink     : 'ยืนยันลิงก์',
        confirmUnlink   : 'ยืนยันการยกเลิกการเชื่อมโยง'
    },

    FilePicker : {
        file : 'ไฟล์'
    },

    Field : {
        badInput              : 'ค่าในช่องไม่ถูกต้อง',
        patternMismatch       : 'ค่าควรตรงกับรูปแบบที่เฉพาะเจาะจง',
        rangeOverflow         : value => `ค่าควรน้อยกว่าหรือเท่ากับ ${value.max}`,
        rangeUnderflow        : value => `ค่าควรมากกว่าหรือเท่ากับ ${value.min}`,
        stepMismatch          : 'ค่าควรสอดคล้องกับการก้าวกระโดด',
        tooLong               : 'ค่าควรสั้นกว่านี้',
        tooShort              : 'ค่าควรยาวกว่านี้',
        typeMismatch          : 'ค่าต้องอยู่ในรูปแบบพิเศษ',
        valueMissing          : 'จำเป็นต้องกรอกช่องนี้',
        invalidValue          : 'ค่าในช่องไม่ถูกต้อง',
        minimumValueViolation : 'ค่าน้อยกว่าค่าต่ำสุด',
        maximumValueViolation : 'ค่ามากกว่าค่าสูงสุด',
        fieldRequired         : 'ช่องนี้จำเป็นต้องกรอก',
        validateFilter        : 'ต้องเลือกค่าจากรายการ'
    },

    DateField : {
        invalidDate : format => 'ข้อมูลวันที่ไม่ถูกต้อง รูปแบบที่คาดหวังคือ ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'ไปที่ปีก่อนหน้า',
        gotoPrevMonth : 'ไปที่เดือนก่อนหน้า',
        gotoNextMonth : 'ไปที่เดือนถัดไป',
        gotoNextYear  : 'ไปที่ปีถัดไป',
        navigation    : 'การนำทางตัวเลือกวันที่'
    },

    Hint : {
        dontShowAgain : 'ไม่ต้องแสดงอีก'
    },

    NumberFormat : {
        locale   : 'th',
        currency : 'THB'
    },

    DurationField : {
        invalidUnit : 'หน่วยไม่ถูกต้อง'
    },

    TimeField : {
        invalidTime : 'เวลาที่กรอกไม่ถูกต้อง'
    },

    TimePicker : {
        hour   : 'ชั่วโมง',
        minute : 'นาที',
        second : 'วินาที'
    },

    Tooltip : {
        loading : 'กำลังโหลด...'
    },

    List : {
        loading   : 'กำลังโหลด...',
        selectAll : 'เลือกทั้งหมด'
    },

    GridBase : {
        loadMask : 'กำลังโหลด...',
        syncMask : 'กำลังบันทึกการเปลี่ยนแปลง กรุณารอสักครู่...'
    },

    PagingToolbar : {
        firstPage         : 'ไปที่หน้าแรก',
        prevPage          : 'ไปที่หน้าก่อนหน้า',
        page              : 'หน้า',
        nextPage          : 'ไปที่หน้าถัดไป',
        lastPage          : 'ไปที่หน้าสุดท้าย',
        reload            : 'โหลดซ้ำหน้าปัจจุบัน',
        noRecords         : 'ไม่มีบันทึกที่ต้องแสดง',
        pageCountTemplate : data => `จาก ${data.lastPage}`,
        summaryTemplate   : data => `บันทึกที่แสดง ${data.start} - ${data.end} จาก ${data.allCount}`
    },

    Popup : {
        close    : 'ปิดป๊อปอัป',
        maximize : 'ขยายใหญ่สุด'
    },

    Splitter : {
        ariaLabel      : 'ตัวแบ่ง, ใช้ปุ่มลูกศรเพื่อปรับขนาดแผงที่อยู่ติดกัน',
        collapseLeft   : 'ย่อแผงด้านซ้าย',
        collapseRight  : 'ย่อแผงด้านขวา',
        collapseTop    : 'ย่อแผงด้านบน',
        collapseBottom : 'ย่อแผงด้านล่าง',
        expandLeft     : 'ขยายแผงด้านซ้าย',
        expandRight    : 'ขยายแผงด้านขวา',
        expandTop      : 'ขยายแผงด้านบน',
        expandBottom   : 'ขยายแผงด้านล่าง'
    },

    TabPanel : {
        containsInvalidFields : 'แท็บมีฟิลด์ที่ไม่ถูกต้อง'
    },

    Toolbar : {
        showOverflowingItems : 'แสดงรายการล้น',
        scrollForMore        : 'เลื่อนเพื่อดูเพิ่มเติม'
    },

    UndoRedo : {
        Undo           : 'เลิกทำ',
        Redo           : 'ทำซ้ำ',
        UndoLastAction : 'เลิกทำการกระทำล่าสุด',
        RedoLastAction : 'ทำซ้ำการกระทำที่ถูกยกเลิก',
        NoActions      : 'ไม่มีการกระทำในรายการเลิกทำ'
    },

    FieldFilterPicker : {
        equals                 : 'เท่ากับ',
        doesNotEqual           : 'ไม่เท่ากับ',
        isEmpty                : 'ว่างเปล่า',
        isNotEmpty             : 'ไม่ว่างเปล่า',
        contains               : 'มี',
        doesNotContain         : 'ไม่มี',
        startsWith             : 'เริ่มต้นด้วย',
        endsWith               : 'ลงท้ายด้วย',
        isOneOf                : 'เป็นหนึ่งใน',
        isNotOneOf             : 'ไม่ได้เป็นหนึ่งใน',
        isGreaterThan          : 'มากกว่า',
        isLessThan             : 'น้อยกว่า',
        isGreaterThanOrEqualTo : 'มากกว่าหรือเท่ากับ',
        isLessThanOrEqualTo    : 'น้อยกว่าหรือเท่ากับ',
        isBetween              : 'อยู่ระหว่าง',
        isNotBetween           : 'ไม่อยู่ระหว่าง',
        isBefore               : 'ก่อน',
        isAfter                : 'หลังจาก',
        timeEquals             : 'เวลาเท่ากับ',
        timeDoesNotEqual       : 'เวลาไม่เท่ากับ',
        isToday                : 'เป็นวันนี้',
        isTomorrow             : 'เป็นวันพรุ่งนี้',
        isYesterday            : 'เป็นเมื่อวานนี้',
        isThisWeek             : 'เป็นสัปดาห์นี้',
        isNextWeek             : 'เป็นสัปดาห์หน้า',
        isLastWeek             : 'เป็นสัปดาห์ที่แล้ว',
        isThisMonth            : 'เป็นเดือนนี้',
        isNextMonth            : 'เป็นเดือนหน้า',
        isLastMonth            : 'เป็นเดือนที่แล้ว',
        isThisYear             : 'เป็นปีนี้',
        isNextYear             : 'เป็นปีหน้า',
        isLastYear             : 'เป็นปีที่แล้ว',
        isYearToDate           : 'เป็นปีจนถึงปัจจุบัน',
        isTrue                 : 'เป็นจริง',
        isFalse                : 'เป็นเท็จ',
        selectAProperty        : 'เลือกคุณสมบัติ',
        selectAnOperator       : 'เลือกผู้ปฏิบัติการ',
        caseSensitive          : 'การบังคับใช้ตัวอักษรเล็ก/ใหญ่',
        and                    : 'และ',
        dateFormat             : 'D/M/YY',
        selectValue            : 'เลือกค่า',
        selectOneOrMoreValues  : 'เลือกหนึ่งค่าหรือมากกว่า',
        enterAValue            : 'ป้อนค่า',
        enterANumber           : 'ป้อนหมายเลข',
        selectADate            : 'เลือกวันที่',
        selectATime            : 'เลือกเวลา'
    },

    FieldFilterPickerGroup : {
        addFilter : 'เพิ่มตัวกรอง',
        applyCond : applied => applied ? 'ข้ามตัวกรอง (ใช้งานอยู่)' : 'ใช้ตัวกรอง (ข้ามอยู่)'
    },

    DateHelper : {
        locale         : 'th',
        weekStartDay   : 1,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : 'มิลลิวินาที', plural : 'มิลลิวินาที', abbrev : 'มิลลิวินาที' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'วินาที', plural : 'วินาที', abbrev : 'วินาที' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'นาที', plural : 'นาที', abbrev : 'น.' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'ชั่วโมง', plural : 'ชั่วโมง', abbrev : 'ชม.' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'วัน', plural : 'วัน', abbrev : 'ว.' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'สัปดาห์', plural : 'สัปดาห์', abbrev : 'สัปดาห์' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'เดือน', plural : 'เดือน', abbrev : 'ด.' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'ไตรมาส', plural : 'ไตรมาส', abbrev : 'ไตรมาส' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'ปี', plural : 'ปี', abbrev : 'ป.' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'ทศวรรษ', plural : 'ทศวรรษ', abbrev : 'ทศวรรษ' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['มิลลิวินาที'],
            [],
            ['วินาที', 'วินาที'],
            [],
            ['น.', 'น.'],
            [],
            ['ชม.', 'ชม.'],
            [],
            ['วัน'],
            [],
            ['สัปดาห์', 'สัปดาห์'],
            [],
            ['ด.', 'ด.', 'ด.'],
            [],
            ['ไตรมาส', 'ไตรมาส', 'ไตรมาส'],
            [],
            ['ป.', 'ป.'],
            [],
            ['ทศวรรษ'],
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
            return `ทศวรรษ ${year - (year % 10)}`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
