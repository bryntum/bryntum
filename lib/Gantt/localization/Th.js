import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Th.js';

const locale = {

    localeName : 'Th',
    localeDesc : 'ไทย',
    localeCode : 'th',
    localeRtl  : false,

    Object : {
        Save : 'บันทึก'
    },

    CostColumn : {
        cost : 'ค่าใช้จ่าย'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'เพิกเฉยต่อปฏิทินทรัพยากร'
    },

    InactiveColumn : {
        Inactive : 'ไม่ทำงาน'
    },

    TaskInfoColumn : {
        info                     : 'ข้อมูล',
        postponedConflictTooltip : 'มีข้อขัดแย้งด้านกำหนดการที่ยังไม่ได้รับการแก้ไขกับกิจกรรมนี้ คลิกเพื่อแก้ไขปัญหา'
    },

    ActualEffortColumn : {
        actualEffort : 'ความพยายามที่แท้จริง'
    },

    AddNewColumn : {
        'New Column' : 'คอลัมน์ใหม่'
    },

    BaselineEffortColumn : {
        baselineEffort : 'ความพยายามพื้นฐาน'
    },

    BaselineStartDateColumn : {
        baselineStart : 'เริ่มต้นเดิม'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'สิ้นสุดเดิม'
    },

    BaselineDurationColumn : {
        baselineDuration : 'ระยะเวลาเดิม'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'ผิดไปจากวันที่เริ่มต้นเดิม'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'ผิดไปจากวันที่สิ้นสุดเดิม'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'ความแปรปรวนของระยะเวลา'
    },

    CalendarColumn : {
        Calendar : 'ปฏิทิน'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'เริ่มต้นเร็ว'
    },

    EarlyEndDateColumn : {
        'Early End' : 'สิ้นสุดเร็ว'
    },

    LateStartDateColumn : {
        'Late Start' : 'เริ่มต้นล่าช้า'
    },

    LateEndDateColumn : {
        'Late End' : 'สิ้นสุดล่าช้า'
    },

    TotalSlackColumn : {
        'Total Slack' : 'เวลาที่เหลือทั้งหมด'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'วันที่ของข้อจำกัด'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'ประเภทของข้อจำกัด'
    },

    DeadlineDateColumn : {
        Deadline : 'กำหนดเวลา'
    },

    DependencyColumn : {
        'Invalid dependency' : 'การอ้างอิงที่ไม่ถูกต้อง'
    },

    DurationColumn : {
        Duration : 'ระยะเวลา'
    },

    EffortColumn : {
        Effort : ' การลงแรง'
    },

    EndDateColumn : {
        Finish : 'เสร็จสิ้น'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'จัดกำหนดการด้วยตนเอง'
    },

    MilestoneColumn : {
        Milestone : 'จุดระบุความคืบหน้า'
    },

    NameColumn : {
        Name : 'ชื่อ'
    },

    NoteColumn : {
        Note : 'หมายเหตุ'
    },

    PercentDoneColumn : {
        '% Done' : '% ที่ดำเนินการเสร็จ'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : '% ที่วางแผนไว้ เสร็จสิ้น'
    },

    PredecessorColumn : {
        Predecessors : 'งานลำดับก่อนหน้า'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'ทรัพยากรที่ได้รับการจัดสรร',
        'more resources'     : 'ทรัพยากรเพิ่มเติม'
    },

    RollupColumn : {
        Rollup : 'การแสดงข้อมูลที่หน้าสรุป'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'โหมดการจัดกำหนดการ'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'ทิศทางการกำหนดตารางเวลา',
        inheritedFrom       : 'สืบทอดมาจาก',
        enforcedBy          : 'บังคับใช้โดย'
    },

    SequenceColumn : {
        Sequence : 'จัดลำดับ'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'แสดงในลำดับเวลา'
    },

    StartDateColumn : {
        Start : 'เริ่มต้น'
    },

    SuccessorColumn : {
        Successors : 'งานที่ตามมา'
    },

    TaskCopyPaste : {
        copyTask  : 'คัดลอก',
        cutTask   : 'ตัด',
        pasteTask : 'วาง'
    },

    WBSColumn : {
        WBS      : ' โครงสร้างการแบ่งงาน',
        renumber : 'ระบุหมายเลขใหม่'
    },

    DependencyField : {
        invalidDependencyFormat : 'รูปแบบการอ้างอิงไม่ถูกต้อง'
    },

    ProjectLines : {
        'Project Start' : 'โครงการเริ่มต้น',
        'Project End'   : 'โครงการสิ้นสุด',
        statusDate      : 'วันที่สถานะ'
    },

    TaskTooltip : {
        Start    : 'เริ่มต้น',
        End      : 'สิ้นสุด',
        Duration : 'ระยะเวลา',
        Complete : 'เสร็จสิ้น'
    },

    BasicTaskEdit : {
        editTask        : 'แก้ไข',
        name            : 'ชื่อ',
        percentComplete : '% เสร็จสิ้น',
        start           : 'เริ่มต้น',
        finish          : 'สิ้นสุด',
        duration        : 'ระยะเวลา'
    },

    AssignmentGrid : {
        Name     : 'ชื่อทรัพยากร',
        Units    : 'หน่วย',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'จำนวน',
        cost        : 'ค่าใช้จ่าย',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'แก้ไข',
        Indent                 : 'เยื้องเข้า',
        Outdent                : 'ยกเลิกการเยื้องเข้า',
        'Convert to milestone' : 'แปลงเป็นจุดระบุความคืบหน้า',
        Add                    : 'เพิ่ม...',
        'New task'             : 'งานใหม่',
        'New milestone'        : 'จุดระบุความคืบหน้าใหม่',
        'Task above'           : 'งานด้านบน',
        'Task below'           : 'งานด้านล่าง',
        'Delete task'          : 'ลบ',
        Milestone              : 'จุดระบุความคืบหน้า',
        'Sub-task'             : 'งานย่อย',
        Successor              : 'งานที่ตามมา',
        Predecessor            : 'งานลำดับก่อนหน้า',
        changeRejected         : 'เครื่องช่วยจัดกำหนดการปฏิเสธการเปลี่ยนแปลง',
        linkTasks              : 'เพิ่มขึ้นอยู่กับ',
        unlinkTasks            : 'ลบขึ้นอยู่กับ',
        color                  : 'สี'
    },

    EventSegments : {
        splitTask : 'แยกงาน'
    },

    Indicators : {
        earlyDates   : 'การเริ่มต้น/สิ้นสุดเร็ว',
        lateDates    : 'การเริ่มต้น/สิ้นสุดล่าช้า',
        Start        : 'เริ่มต้น',
        End          : 'สิ้นสุด',
        deadlineDate : 'วันที่กำหนดเวลา'
    },

    Versions : {
        indented      : 'ย่อหน้า',
        outdented     : 'ยกเลิกย่อหน้า',
        cut           : 'ตัด',
        pasted        : 'วางแล้ว',
        deletedTasks  : 'ลบงานแล้ว',
        propertyNames : {
            baselines                   : 'บรรทัดฐาน',
            deadlineDate                : 'กำหนดเวลา',
            description                 : 'คำอธิบาย',
            endDate                     : 'วันที่สิ้นสุด',
            projectConstraintResolution : 'การแก้ไขข้อจำกัดของโครงการ',
            rollup                      : 'การรวม',
            taskIconCls                 : 'ไอคอนงาน',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'ข้อมูลโครงการ',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'ทั่วไป',
        projectName  : 'ชื่อโครงการ',
        start        : 'วันที่เริ่มต้น',
        finish       : 'วันที่สิ้นสุด',
        scheduleFrom : 'กำหนดการจาก',
        calendar     : 'ปฏิทิน',
        readOnly     : 'อ่านอย่างเดียว',
        forward      : 'วันที่เริ่มโครงการ',
        backward     : 'วันที่สิ้นสุดโครงการ'
    },

    ProjectEditorDescriptionTab : {
        description : 'คำอธิบาย'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'ขั้นสูง',
        hoursPerDay  : 'ชั่วโมงต่อวัน',
        daysPerWeek  : 'วันต่อสัปดาห์',
        daysPerMonth : 'วันต่อเดือน'
    }
};

export default LocaleHelper.publishLocale(locale);
