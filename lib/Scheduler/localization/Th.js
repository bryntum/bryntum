import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Th.js';
import '../../Grid/localization/Th.js';

const locale = {

    localeName : 'Th',
    localeDesc : 'ไทย',
    localeCode : 'th',
    localeRtl  : false,

    Object : {
        newEvent    : 'เพิ่มกิจกรรมใหม่',
        information : 'ข้อมูล',
        showDetails : 'แสดงรายละเอียด'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' กิจกรรม'
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'สลับคอลัมน์การจัดวางทรัพยากร SPACE สำหรับเมนูตามบริบท'
    },

    Dependencies : {
        from    : 'ตั้งแต่',
        to      : 'ถึง',
        valid   : 'ถูกต้อง',
        invalid : 'ไม่ถูกต้อง'
    },

    DependencyType : {
        SS           : 'เอสเอส',
        SF           : 'เอสเอฟ',
        FS           : 'เอฟเอส',
        FF           : 'เอฟเอฟ',
        StartToStart : 'เริ่มต้นถึงเริ่มต้น',
        StartToEnd   : 'เริ่มต้นถึงสิ้นสุด',
        EndToStart   : 'สิ้นสุดถึงเริ่มต้น',
        EndToEnd     : 'สิ้นสุดถึงสิ้นสุด',
        short        : [
            'เอสเอส',
            'เอสเอฟ',
            'เอฟเอส',
            'เอฟเอฟ'
        ],
        long : [
            'เริ่มต้นถึงเริ่มต้น',
            'เริ่มต้นถึงสิ้นสุด',
            'สิ้นสุดถึงเริ่มต้น',
            'สิ้นสุดถึงสิ้นสุด'
        ]
    },

    DependencyEdit : {
        From              : 'ตั้งแต่',
        To                : 'ถึง',
        Type              : 'ประเภท',
        Lag               : 'การล่าช้า',
        color             : 'สี',
        lineStyle         : 'รูปแบบเส้น',
        solid             : 'ทึบ',
        dashed            : 'เส้นประ',
        dotted            : 'จุด',
        dashDot           : 'เส้นประจุด',
        longDash          : 'เส้นประยาว',
        'Edit dependency' : 'แก้ไขการอ้างอิง',
        Save              : 'บันทึก',
        Delete            : 'ลบ',
        Cancel            : 'ยกเลิก',
        StartToStart      : 'เริ่มต้นถึงเริ่มต้น',
        StartToEnd        : 'เริ่มต้นถึงสิ้นสุด',
        EndToStart        : 'สิ้นสุดถึงเริ่มต้น',
        EndToEnd          : 'สิ้นสุดถึงสิ้นสุด',
        Active            : 'ทำงาน'
    },

    EventEdit : {
        Name           : 'ชื่อ',
        Resource       : 'ทรัพยากร',
        Start          : 'เริ่มต้น',
        startTime      : 'เวลาเริ่มต้น',
        End            : 'สิ้นสุด',
        endTime        : 'เวลาสิ้นสุด',
        Save           : 'บันทึก',
        Delete         : 'ลบ',
        Cancel         : 'ยกเลิก',
        'Edit event'   : 'แก้ไขกิจกรรม',
        Repeat         : 'ทำซ้ำ',
        editRecurrence : 'แก้ไขการเกิดซ้ำ'
    },

    EventDrag : {
        eventOverlapsExisting   : 'กิจกรรมทับซ้อนกับกิจกรรมที่มีอยู่แล้วสำหรับทรัพยากรนี้',
        noDropOutsideTimeline   : 'ไม่สามารถวางกิจกรรมนอกไทม์ไลน์โดยสมบูรณ์ได้',
        duplicateAssignmentDrag : 'ไม่สามารถกำหนดเหตุการณ์ให้กับทรัพยากรเดียวกันได้หลายครั้ง'
    },

    SchedulerBase : {
        'Add event'      : 'เพิ่มกิจกรรม',
        'Delete event'   : 'ลบกิจกรรม',
        'Unassign event' : 'ยกเลิกการกำหนดกิจกรรม',
        color            : 'สี',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, เริ่มต้นที่ ${startDate} ${eventRecord.duration > 0 ? `เป็นเวลา ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'ขยาย',
        activeDateRange : 'ช่วงวันที่',
        startText       : 'วันที่เริ่มต้น',
        endText         : 'วันที่สิ้นสุด',
        todayText       : 'วันนี้'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `แกนเวลาจะแสดงตั้งแต่ ${startDate} ถึง ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'คัดลอกกิจกรรม',
        cutEvent   : 'ตัดกิจกรรม',
        pasteEvent : 'วางกิจกรรม'
    },

    EventFilter : {
        filterEvents : 'กรองกิจกรรม',
        byName       : 'ตามชื่อ'
    },

    TimeRanges : {
        showCurrentTimeLine : 'แสดงไทม์ไลน์ปัจจุบัน'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'วินาที'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD/MM, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD/MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'วัน'
        },
        day : {
            name : 'วัน/ชั่วโมง'
        },
        week : {
            name : 'สัปดาห์/ชั่วโมง'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'สัปดาห์/วัน'
        },
        dayAndMonth : {
            name : 'เดือน'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'สัปดาห์'
        },
        weekAndMonth : {
            name : 'สัปดาห์'
        },
        weekAndDayLetter : {
            name : 'สัปดาห์/วันธรรมดา'
        },
        weekDateAndMonth : {
            name : 'เดือน/สัปดาห์'
        },
        monthAndYear : {
            name : 'เดือน'
        },
        year : {
            name : 'ปี'
        },
        manyYears : {
            name : 'หลายปี'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'คุณกำลังจะลบกิจกรรม',
        'delete-all-message'        : 'คุณต้องการที่จะลบกิจกรรมนี้ทุกครั้งหรือไม่?',
        'delete-further-message'    : 'คุณต้องการที่จะลบกิจกรรมครั้งนี้รวมถึงกิจกรรมทั้งหมดในอนาคต หรือลบเฉพาะกิจกรรมที่เลือก?',
        'delete-only-this-message'  : 'คุณต้องการลบการเกิดเหตุการณ์นี้หรือไม่?',
        'delete-further-btn-text'   : 'ลบกิจกรรมทั้งหมดในอนาคต',
        'delete-only-this-btn-text' : 'ลบเฉพาะกิจกรรมนี้',
        'update-title'              : 'คุณกำลังเปลี่ยนแปลงกิจกรรมที่เกิดซ้ำ',
        'update-all-message'        : 'คุณต้องการที่จะเปลี่ยนแปลงกิจกรรมนี้ทุกครั้งหรือไม่?',
        'update-further-message'    : 'คุณต้องการที่จะเปลี่ยนแปลงเฉพาะกิจกรรมครั้งนี้ หรือเปลี่ยนแปลงกิจกรรมนี้รวมถึงกิจกรรมทั้งหมดในอนาคต?',
        'update-only-this-message'  : 'คุณต้องการเปลี่ยนแปลงการเกิดเหตุการณ์นี้หรือไม่?',
        'update-further-btn-text'   : 'กิจกรรมทั้งหมดในอนาคต',
        'update-only-this-btn-text' : 'เฉพาะกิจกรรมครั้งนี้',
        Yes                         : 'ใช่',
        Cancel                      : 'ยกเลิก',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' และ ',
        Daily                           : 'ทุกวัน',
        'Weekly on {1}'                 : ({ days }) => `ทุกสัปดาห์ในวัน ${days}`,
        'Monthly on {1}'                : ({ days }) => `ทุกเดือนในวัน ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `ทุกปีในวัน ${days} ของ ${months}`,
        'Every {0} days'                : ({ interval }) => `ทุก ${interval} วัน`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `ทุก ${interval} สัปดาห์ในวัน ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `ทุก ${interval} เดือนในวัน ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `ทุก ${interval} ปีในวัน ${days} ของ ${months}`,
        position1                       : 'วันที่หนึ่ง',
        position2                       : 'วันที่สอง',
        position3                       : 'วันที่สาม',
        position4                       : 'วันที่สี่',
        position5                       : 'วันที่ห้า',
        'position-1'                    : 'วันสุดท้าย',
        day                             : 'วัน',
        weekday                         : 'วันธรรมดา',
        'weekend day'                   : 'วันสุดสัปดาห์',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'ทำกิจกรรมซ้ำ',
        Cancel              : 'ยกเลิก',
        Save                : 'บันทึก',
        Frequency           : 'ความถี่',
        Every               : 'ทุก',
        DAILYintervalUnit   : 'วัน',
        WEEKLYintervalUnit  : 'สัปดาห์',
        MONTHLYintervalUnit : 'เดือน',
        YEARLYintervalUnit  : 'ปี',
        Each                : 'แต่ละ',
        on                  : 'ในวัน',
        the                 : 'ในวัน',
        'On the'            : 'ในวัน',
        'End repeat'        : 'สิ้นสุดการทำซ้ำ',
        'time(s)'           : 'ครั้ง',
        Days                : 'วัน',
        Months              : 'เดือน'
    },

    RecurrenceDaysCombo : {
        day           : 'วัน',
        weekday       : 'วันธรรมดา',
        'weekend day' : 'วันสุดสัปดาห์'
    },

    RecurrencePositionsCombo : {
        position1    : 'วันที่หนึ่ง',
        position2    : 'วันที่สอง',
        position3    : 'วันที่สาม',
        position4    : 'วันที่สี่',
        position5    : 'วันที่ห้า',
        'position-1' : 'วันสุดท้าย'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'ไม่ต้อง',
        After     : 'หลังจาก',
        'On date' : 'ในวันที่'
    },

    RecurrenceFrequencyCombo : {
        None    : 'ไม่มีการทำซ้ำ',
        Daily   : 'ทุกวัน',
        Weekly  : 'ทุกสัปดาห์',
        Monthly : 'ทุกเดือน',
        Yearly  : 'ทุกปี'
    },

    RecurrenceCombo : {
        None   : 'ไม่มี',
        Custom : 'กำหนดเอง...'
    },

    Summary : {
        'Summary for' : date => `สรุปสำหรับ ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'กำหนดการทั้งหมด',
        currentview  : 'กำหนดการที่มองเห็น',
        daterange    : 'ช่วงวันที่',
        completedata : 'กำหนดการทั้งหมด (สำหรับทุกกิจกรรม)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'ช่วงกำหนดการ',
        'Export from'    : 'ตั้งแต่',
        'Export to'      : 'ถึง'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'หน้าเดียว'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'หน้าเดียว (ไม่ปรับขนาด)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'หลายหน้า (แนวตั้ง)'
    },

    ExcelExporter : {
        'No resource assigned' : 'ไม่มีการจัดสรรทรัพยากร'
    },

    CrudManagerView : {
        serverResponseLabel : 'การตอบสนองของเซิร์ฟเวอร์:'
    },

    DurationColumn : {
        Duration : 'ระยะเวลา'
    },

    EventClusteringBase : {
        unnamed         : 'ไม่มีชื่อ',
        more            : count => `+ อีก ${count} รายการ`,
        clusteredEvents : count => `เหตุการณ์ที่จัดกลุ่ม ${count} รายการ`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `ช่วงเวลาที่จัดกลุ่ม ${count} รายการ`
    },

    ConstraintTypePicker : {
        none                : 'ไม่มี',
        assoonaspossible    : 'โดยเร็วที่สุด',
        aslateaspossible    : 'โดยช้าที่สุด',
        muststarton         : 'ต้องเริ่มตั้งแต่',
        mustfinishon        : 'ต้องสิ้นสุดเมื่อ',
        startnoearlierthan  : 'ต้องไม่เริ่มต้นก่อน',
        startnolaterthan    : 'ต้องไม่เริ่มต้นหลังจาก',
        finishnoearlierthan : 'ต้องไม่สิ้นสุดก่อน',
        finishnolaterthan   : 'ต้องไม่สิ้นสุดหลังจาก'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} เวลากันชนก่อนเหตุการณ์`;
            }
            if (postamble) {
                description += `.${postamble.toString()} เวลากันชนหลังเหตุการณ์`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'ไปข้างหน้า',
        Backward      : 'ถอยหลัง',
        inheritedFrom : 'สืบทอดมาจาก',
        enforcedBy    : 'บังคับใช้โดย'
    },

    CalendarField : {
        'Default calendar' : 'ปฏิทินเริ่มต้น',
        editCalendar       : 'แก้ไขปฏิทิน'
    },

    TaskEditorBase : {
        Information   : 'ข้อมูลงาน',
        Save          : 'บันทึก',
        Cancel        : 'ยกเลิก',
        Delete        : 'ลบ',
        calculateMask : 'กำลังคำนวณ...',
        saveError     : 'ไม่สามารถบันทึก กรุณาแก้ไขข้อผิดพลาดก่อน',
        repeatingInfo : 'กำลังเรียกดูกิจกรรมที่เกิดซ้ำ',
        editRepeating : 'แก้ไข'
    },

    TaskEdit : {
        editEvent              : 'แก้ไขกิจกรรม',
        ConfirmDeletionTitle   : 'ยืนยันการลบ',
        ConfirmDeletionMessage : 'คุณแน่ใจหรือไม่ว่าคุณต้องการลบกิจกรรมนี้?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '34em'
    },

    SchedulerGeneralTab : {
        General      : 'ทั่วไป',
        Name         : 'ชื่อ',
        Resources    : 'ทรัพยากร',
        '% complete' : '% ที่เสร็จสิ้น',
        Duration     : 'ระยะเวลา',
        Start        : 'เริ่มต้น',
        Finish       : 'สิ้นสุด',
        Effort       : 'การลงแรง',
        Preamble     : 'ส่วนต้น',
        Postamble    : 'ส่วนท้าย'
    },

    GeneralTab : {
        General      : 'ทั่วไป',
        Name         : 'ชื่อ',
        '% complete' : '% ที่เสร็จสิ้น',
        Duration     : 'ระยะเวลา',
        Start        : 'เริ่มต้น',
        Finish       : 'สิ้นสุด',
        Effort       : 'การลงแรง',
        Dates        : 'จำนวนวัน'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'ขั้นสูง',
        Calendar                   : 'ปฏิทิน',
        'Scheduling mode'          : 'โหมดจัดกำหนดการ',
        'Effort driven'            : 'ขับเคลื่อนด้วยการลงแรง',
        'Manually scheduled'       : 'จัดกำหนดการด้วยตนเอง',
        'Constraint type'          : 'ประเภทของข้อจำกัด',
        'Constraint date'          : 'วันที่ของข้อจำกัด',
        Inactive                   : 'ไม่ทำงาน',
        'Ignore resource calendar' : 'เพิกเฉยต่อปฏิทินทรัพยากร'
    },

    CalendarEditorDatePicker : {
        addException : 'เพิ่มข้อยกเว้น',
        addWeek      : 'เพิ่มสัปดาห์'
    },

    CalendarEditorExceptionTab : {
        addException    : 'เพิ่มข้อยกเว้น',
        removeException : 'ลบข้อยกเว้น',
        noRows          : 'ไม่มีการเพิ่มข้อยกเว้น'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'เพิ่มสัปดาห์',
        removeWeek : 'ลบสัปดาห์'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'วันทำงานตามค่าเริ่มต้น',
        workingTimeCalendar        : 'ปฏิทินเวลาทำงาน',
        exceptions                 : 'ข้อยกเว้น',
        general                    : 'ทั่วไป',
        name                       : 'ชื่อ',
        parent                     : 'พ่อแม่',
        save                       : 'บันทึก',
        weeks                      : 'หลายสัปดาห์',
        error                      : 'ข้อผิดพลาด',
        inputErrors                : 'มีข้อผิดพลาดในการป้อนข้อมูล โปรดแก้ไขก่อนบันทึกการเปลี่ยนแปลงของคุณ',
        delete                     : 'ลบ',
        addCalendar                : 'เพิ่มปฏิทิน',
        confirmation               : 'การยืนยัน',
        removeCalendarWithChildren : 'ปฏิทินมีปฏิทินเด็ก คลิก "ใช่" เพื่อลบปฏิทินกับลูก ๆ',
        removeCalendarAndLinks     : 'ปฏิทินถูกใช้โดยบันทึกบางอย่าง คลิก "ใช่" เพื่อยกเลิกการเชื่อมโยงและลบปฏิทิน',
        newException               : 'ข้อยกเว้นใหม่',
        newWeek                    : 'สัปดาห์ใหม่'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' กำลังทำงานอยู่',
        isNotWorking : ' ไม่ทำงาน',
        basedOn      : ' ขึ้นอยู่กับ:',
        byDefault    : 'โดยค่าเริ่มต้น',
        rangeTpl     : (start, end) => `${start} ถึง ${end} น`
    },

    CalendarEditorLegend : {
        workingDay    : 'วันทำงาน',
        nonWorkingDay : 'วันที่ไม่ทำงาน'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'มีช่วงที่ทับซ้อนกัน',
        errorMissingDate   : 'ต้องใช้เวลาเริ่มต้นและสิ้นสุด',
        errorStartAfterEnd : 'เวลาเริ่มต้นไม่สามารถเป็นหลังจากเวลาสิ้นสุด'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'ชื่อ',
        from                                 : 'จาก',
        to                                   : 'ถึง',
        is                                   : 'เป็น',
        nonWorking                           : 'ไม่ทำงาน',
        working                              : 'การทำงาน',
        hours                                : 'ชั่วโมง',
        repeat                               : 'ทำซ้ำ',
        repeatEnd                            : 'ทำซ้ำ',
        errorMissingDate                     : 'จำเป็นต้องมีช่วงวันที่ยกเว้น',
        errorStartAfterEnd                   : '"จาก" วันที่ไม่สามารถหลังจาก "ถึง" วันที่ ',
        errorStartAndEndRepeatNumberMismatch : 'ข้อยกเว้นควรเริ่มต้นและสิ้นสุดจำนวนครั้งเดียวกัน'
    },

    CalendarEditorWeekPanel : {
        name        : 'ชื่อ',
        from        : 'จาก',
        to          : 'ถึง',
        days        : 'วัน',
        copyDay     : 'วันคัดลอก',
        pasteDay    : 'วางวัน',
        stopCopying : 'หยุดคัดลอก'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'เพิ่มช่วง',
        removeRange : 'ลบช่วง'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"จาก" วันที่ไม่สามารถหลังจาก "ถึง" วันที่ ',
        errorNoDefaultWeek           : 'จำเป็นต้องมีการกำหนดค่าสัปดาห์',
        errorMultipleDefaultWeeks    : 'มีการระบุมากกว่าหนึ่งสัปดาห์เริ่มต้น',
        errorNoWeekAvailability      : 'สัปดาห์ต้องให้เวลาทำงาน',
        errorInvalidWeekAvailability : 'สัปดาห์มีข้อผิดพลาดในการกำหนดค่าเวลาทำงาน',
        noRows                       : 'ไม่มีการเพิ่มสัปดาห์'
    },

    AdvancedTab : {
        Advanced                   : 'ขั้นสูง',
        Calendar                   : 'ปฏิทิน',
        'Scheduling mode'          : 'โหมดจัดกำหนดการ',
        'Effort driven'            : 'ขับเคลื่อนด้วยการลงแรง',
        'Manually scheduled'       : 'จัดกำหนดการด้วยตนเอง',
        'Constraint type'          : 'ประเภทของข้อจำกัด',
        'Constraint date'          : 'วันที่ของข้อจำกัด',
        Constraint                 : 'ข้อจำกัด',
        Rollup                     : 'การแสดงข้อมูลที่หน้าสรุป',
        Inactive                   : 'ไม่ทำงาน',
        'Ignore resource calendar' : 'เพิกเฉยต่อปฏิทินทรัพยากร',
        'Scheduling direction'     : 'ทิศทางการตั้งตารางเวลา',
        projectBorder              : 'เส้นขอบโครงการ',
        ignore                     : 'ไม่สนใจ',
        honor                      : 'ให้เกียรติ',
        askUser                    : 'ถามผู้ใช้'
    },

    DependencyTab : {
        Predecessors      : 'งานลำดับก่อนหน้า',
        Successors        : 'งานที่ตามมา',
        ID                : 'รหัส',
        Name              : 'ชื่อ',
        Type              : 'ประเภท',
        Lag               : 'การล่าช้า',
        cyclicDependency  : 'การอ้างอิงเป็นวงรอบ',
        invalidDependency : 'การอ้างอิงที่ไม่ถูกต้อง',
        readOnlyTask      : 'ไม่สามารถเชื่อมโยงงานแบบอ่านอย่างเดียวได้'
    },

    NotesTab : {
        Notes : 'หมายเหตุ'
    },

    ResourceCalendarColumn : {
        calendar : 'ปฏิทิน'
    },

    ResourceEdit : {
        editResource : 'แก้ไขทรัพยากร'
    },

    ResourceEditor : {
        resourceInformation : 'ข้อมูลทรัพยากร',
        costs               : 'ค่าใช้จ่าย',
        save                : 'บันทึก',
        error               : 'ข้อผิดพลาด',
        inputErrors         : 'มีข้อผิดพลาดในการป้อนข้อมูล โปรดแก้ไขก่อนที่จะบันทึกการเปลี่ยนแปลงของคุณ',
        delete              : 'ลบ',
        confirmation        : 'การยืนยัน',
        removeUsedResource  : 'ทรัพยากรถูกกำหนดให้กับงานบางอย่าง คลิก "ใช่" เพื่อลบทรัพยากรออก'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'ปฏิทิน',
        general     : 'ทั่วไป',
        label       : 'ฉลากวัสดุ',
        name        : 'ชื่อทรัพยากร',
        type        : 'พิมพ์',
        costAccrual : 'ต้นทุนคงค้าง',
        labelHint   : 'เช่น กิโลกรัม ตัน หรือกล่อง',
        maxUnits    : 'จำนวนหน่วยสูงสุด'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'ค้างชำระได้ที่',
        prorated : 'แบ่งตามสัดส่วน',
        start    : 'เริ่ม',
        end      : 'จบ'
    },

    CostAccrualField : {
        prorated : 'แบ่งตามสัดส่วน',
        start    : 'เริ่ม',
        end      : 'จบ'
    },

    ResourceType : {
        work     : 'งาน',
        material : 'วัสดุ',
        cost     : 'ค่าใช้จ่าย'
    },

    ResourceTypeColumn : {
        type : 'พิมพ์'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'ตารางราคา',
        newGroup     : 'ตารางใหม่',
        removeGroup  : 'ลบตาราง',
        useByDefault : 'ใช้เป็นค่าเริ่มต้นสำหรับการกำหนดทรัพยากร',
        noRates      : 'ไม่มีอัตรา'
    },

    ResourceGrid : {
        name          : 'ชื่อ',
        materialLabel : 'ฉลากวัสดุ',
        maxUnits      : 'หน่วยสูงสุด',
        cost          : 'ค่าใช้จ่าย',
        noRows        : 'ไม่มีทรัพยากร'
    },

    ResourceRateTableContainer : {
        startDate    : 'วันที่เริ่มต้น',
        standardRate : 'อัตรามาตรฐาน',
        perUseCost   : 'ต่อต้นทุนการใช้งาน',
        addRate      : 'เพิ่มอัตรา',
        removeRate   : 'ลบอัตรา',
        name         : 'ชื่อ',
        noRates      : 'ไม่มีอัตรา'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'ข้อมูลตารางอัตรา'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'ปริมาณ',
        Resources   : 'ทรัพยากร',
        Resource    : 'ทรัพยากร',
        Units       : 'หน่วย',
        cost        : 'ค่าใช้จ่าย',
        effort      : 'ความพยายาม',
        start       : 'เริ่ม',
        finish      : 'เสร็จ',
        preamble    : 'บทนำ',
        postamble   : 'บทส่งท้าย'
    },

    RateTableColumn : {
        rateTable : 'ตารางราคา'
    },

    RecurrenceTab : {
        title : 'ทำซ้ำ'
    },

    SchedulingModePicker : {
        Normal           : 'ปกติ',
        'Fixed Duration' : 'ระยะเวลาคงที่',
        'Fixed Units'    : 'หน่วยคงที่',
        'Fixed Effort'   : 'การลงแรงคงที่'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} จาก {available}</span>ที่ได้รับการจัดสรร',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} จาก {available}</span> ที่ได้รับการจัดสรร',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} จาก {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} จาก {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'ใน {startDate}<br><span class="{cls}">{allocated} จาก {available}</span> ที่ได้รับการจัดสรร:<br>{assignments}',
        plusMore              : '+{value} เพิ่มเติม'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">ความพยายาม</div><div class="b-effort-value {cls}">{allocated} จาก {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">ความพยายาม</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">ค่าใช้จ่าย</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">ปริมาณ</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} ในวันที่ {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">สรุปสำหรับ {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">สรุปสำหรับ {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} เพิ่มเติม',
        nameColumnText        : 'ทรัพยากร / เหตุการณ์'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'ยกเลิกการเปลี่ยนแปลงและไม่ดำเนินการใด ๆ',
        schedulingConflict : 'ความขัดแย้งของการจัดกำหนดการ',
        emptyCalendar      : 'ข้อผิดพลาดของการกำหนดค่าปฏิทิน',
        cycle              : 'วงรอบการจัดกำหนดการ',
        Apply              : 'นำไปใช้'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'กรุณาเลือกการอ้างอิง:',
        invalidDependencyLabel : 'พบการอ้างอิงไม่ถูกต้องที่จำเป็นต้องได้รับการแก้ไข:'
    },

    SchedulerProBase : {
        propagating     : 'กำลังคำนวณโครงการ',
        storePopulation : 'กำลังโหลดข้อมูล',
        finalizing      : 'กำลังสรุปผลลัพธ์'
    },

    EventSegments : {
        splitEvent    : 'แยกกิจกรรม',
        renameSegment : 'เปลี่ยนชื่อ'
    },

    NestedEvents : {
        createGroup         : 'จัดกลุ่มเหตุการณ์ที่เลือก',
        newGroupName        : 'กลุ่มใหม่',
        deNestingNotAllowed : 'ไม่อนุญาตให้ยกเลิกการรวมกลุ่ม',
        nestingNotAllowed   : 'ไม่อนุญาตให้รวมกลุ่ม'
    },

    VersionGrid : {
        compare       : 'เปรียบเทียบ',
        description   : 'คำอธิบาย',
        occurredAt    : 'เกิดขึ้นที่',
        rename        : 'เปลี่ยนชื่อ',
        restore       : 'กู้คืน',
        stopComparing : 'หยุดเปรียบเทียบ'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'งาน',
            AssignmentModel : 'งานที่กำหนด',
            DependencyModel : 'ลิงก์',
            ProjectModel    : 'โครงการ',
            ResourceModel   : 'ทรัพยากร',
            other           : 'ออบเจ็กต์'
        },
        entityNamesPlural : {
            TaskModel       : 'งาน',
            AssignmentModel : 'งานที่กำหนด',
            DependencyModel : 'ลิงก์',
            ProjectModel    : 'โครงการ',
            ResourceModel   : 'ทรัพยากร',
            other           : 'ออบเจ็กต์'
        },
        transactionDescriptions : {
            update : 'เปลี่ยน {n} {entities} แล้ว',
            add    : 'เพิ่ม {n} {entities} แล้ว',
            remove : 'นำ {n} {entities} ออกแล้ว',
            move   : 'ย้าย {n} {entities} แล้ว',
            mixed  : 'เปลี่ยนแปลง {n} {entities} แล้ว'
        },
        propertyNames : {
            active                   : 'ใช้งาน',
            allDay                   : 'ทั้งวัน',
            allowOverlap             : 'อนุญาตให้ซ้อนทับ',
            barMargin                : 'ระยะขอบแถบ',
            bidirectional            : 'สองทิศทาง',
            calendar                 : 'ปฏิทิน',
            cls                      : 'คลาส CSS',
            constraintDate           : 'วันที่ข้อจำกัด',
            constraintType           : 'ประเภทข้อจำกัด',
            daysPerMonth             : 'วันต่อเดือน',
            daysPerWeek              : 'วันต่อสัปดาห์',
            delayFromParent          : 'ความล่าช้าจากผู้ปกครอง',
            direction                : 'ทิศทาง',
            drawDependencies         : 'วาดการพึ่งพา',
            duration                 : 'ระยะเวลา',
            durationUnit             : 'หน่วยระยะเวลา',
            effort                   : 'ความพยายาม',
            effortDriven             : 'ขับเคลื่อนด้วยความพยายาม',
            effortUnit               : 'หน่วยความพยายาม',
            endDate                  : 'วันที่สิ้นสุด',
            eventColor               : 'สี',
            eventId                  : 'รหัสเหตุการณ์',
            eventLayout              : 'รูปแบบเหตุการณ์',
            eventStyle               : 'สไตล์แถบ',
            exceptionDates           : 'วันที่ข้อยกเว้น',
            fixed                    : 'คงที่',
            from                     : 'จาก',
            fromSide                 : 'จากด้าน',
            hoursPerDay              : 'ชั่วโมงต่อวัน',
            href                     : 'ลิงก์',
            iconCls                  : 'ไอคอน',
            id                       : 'รหัส',
            ignoreResourceCalendar   : 'ละเว้นปฏิทินทรัพยากร',
            ignoreTimeZone           : 'ละเว้นเขตเวลา',
            image                    : 'ภาพ',
            imageUrl                 : 'URL ภาพ',
            inactive                 : 'ไม่ใช้งาน',
            intervals                : 'ช่วงเวลา',
            lag                      : 'ความล่าช้า',
            lagUnit                  : 'หน่วยความล่าช้า',
            lineStyle                : 'สไตล์เส้น',
            manuallyScheduled        : 'กำหนดด้วยตนเอง',
            milestoneWidth           : 'ความกว้างของจุดสำคัญ',
            name                     : 'ชื่อ',
            note                     : 'หมายเหตุ',
            parentId                 : 'รหัสหลัก',
            parentIndex              : 'ตำแหน่ง',
            percentDone              : '% เสร็จสิ้น',
            postamble                : 'ข้อความปิดท้าย',
            preamble                 : 'ข้อความเริ่มต้น',
            readOnly                 : 'อ่านอย่างเดียว',
            recurrenceRule           : 'กฎการเกิดซ้ำ',
            resourceId               : 'รหัสทรัพยากร',
            resourceMargin           : 'ระยะขอบทรัพยากร',
            rowHeight                : 'ความสูงของแถว',
            schedulingMode           : 'โหมดการจัดตารางเวลา',
            segments                 : 'ส่วน',
            showAvatar               : 'แสดงอวตาร',
            showInTimeline           : 'แสดงในไทม์ไลน์',
            startDate                : 'วันที่เริ่มต้น',
            stickyContents           : 'เนื้อหาติด',
            strokeColor              : 'สีเส้น',
            style                    : 'สไตล์',
            target                   : 'เป้าหมายลิงก์',
            to                       : 'ถึง',
            toSide                   : 'ถึงด้าน',
            type                     : 'ประเภท',
            units                    : 'หน่วย',
            unscheduled              : 'ไม่ได้กำหนดเวลา',
            unspecifiedTimeIsWorking : 'เวลาที่ไม่ได้ระบุคือเวลาทำงาน',
            version                  : 'เวอร์ชัน'
        },
        intervals : {
            working    : 'ทำงาน',
            nonWorking : 'ไม่ทำงาน',
            fromTo     : 'จาก {from} ถึง {to}',
            recurring  : 'เกิดซ้ำเริ่มต้น {start} สิ้นสุด {end}'
        },
        addEntity         : 'เพิ่ม {type} **{name}** แล้ว',
        removeEntity      : 'นำ {type} **{name}** ออกแล้ว',
        updateEntity      : 'เปลี่ยน {type} **{name}** แล้ว',
        moveEntity        : 'ย้าย {type} **{name}** จาก {from} ไปยัง {to}',
        addDependency     : 'เพิ่มลิงก์จาก **{from}** ไปยัง **{to}** แล้ว',
        removeDependency  : 'นำลิงก์ออกจาก **{from}** ไปยัง **{to}** แล้ว',
        updateDependency  : 'แก้ไขลิงก์จาก **{from}** ไปยัง **{to}**',
        addAssignment     : 'กำหนด **{resource}** ไปยัง **{event}** แล้ว',
        removeAssignment  : 'นำงานที่กำหนดของ **{resource}** ออกจาก **{event}** แล้ว',
        updateAssignment  : 'แก้ไขงานที่กำหนดของ **{resource}** ไปยัง **{event}** แล้ว',
        noChanges         : 'ไม่มีการเปลี่ยนแปลง',
        nullValue         : 'ไม่มี',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'บันทึกเมื่อ {date}',
        autoSavedAt       : 'บันทึกอัตโนมัติเมื่อ {date}',
        undid             : 'ยกเลิกการเปลี่ยนแปลง',
        redid             : 'ทำการเปลี่ยนแปลงซ้ำ',
        editedTask        : 'แก้ไขคุณสมบัติงานแล้ว',
        deletedTask       : 'ลบงานแล้ว',
        movedTask         : 'ย้ายงานหนึ่งแล้ว',
        movedTasks        : 'ย้ายหลายงานแล้ว'
    }
};

export default LocaleHelper.publishLocale(locale);
