import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Th.js';

const locale = {

    localeName : 'Th',
    localeDesc : 'ไทย',
    localeCode : 'th',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'การโหลดข้อมูลล้มเหลว!',
        syncFailedMessage : 'การซิงค์ข้อมูลล้มเหลว!'
    },

    CrudManagerView : {
        serverResponseLabel : 'การตอบสนองของเซิร์ฟเวอร์:'
    },

    TaskBoard : {
        column                 : 'คอลัมน์',
        columns                : 'คอลัมน์',
        Columns                : 'คอลัมน์',
        swimlane               : 'ลู่กระแสงาน',
        swimlanes              : 'ลู่กระแสงาน',
        Swimlanes              : 'ลู่กระแสงาน',
        task                   : 'งาน',
        tasks                  : 'งาน',
        addTask                : 'เพิ่ม L{TaskBoard.task}',
        cancel                 : 'ยกเลิก',
        changeColumn           : 'เปลี่ยน L{TaskBoard.column}',
        changeSwimlane         : 'เปลี่ยน L{TaskBoard.swimlane}',
        collapse               : text => `ย่อ ${text}`,
        color                  : 'สี',
        description            : 'คำอธิบาย',
        editTask               : 'แก้ไข L{TaskBoard.task}',
        expand                 : text => `ขยาย ${text}`,
        filterColumns          : 'กรอง L{TaskBoard.columns}',
        filterSwimlanes        : 'กรอง L{TaskBoard.swimlanes}',
        filterTasks            : 'กรอง L{TaskBoard.tasks}',
        lock                   : 'ล็อค',
        unlock                 : 'ปลดล็อค',
        moveColumnLeft         : 'ย้าย L{TaskBoard.column} ไปด้านซ้าย',
        moveColumnRight        : 'ย้าย L{TaskBoard.column} ไปด้านขวา',
        moveColumnUp           : 'ย้าย L{TaskBoard.column} ไปด้านบน',
        moveColumnDown         : 'ย้าย L{TaskBoard.column} ไปด้านล่าง',
        moveColumnOutOfGroup   : 'ย้าย L{TaskBoard.column} ออกจากกลุ่ม',
        moveColumnIntoGroup    : 'ย้าย L{TaskBoard.column} เข้ากลุ่ม',
        groupWithLeftNeighbor  : 'จัดกลุ่มกับ L{TaskBoard.column} ข้างเคียงทางซ้าย',
        groupWithRightNeighbor : 'จัดกลุ่มกับ L{TaskBoard.column} ข้างเคียงทางขวา',
        name                   : 'ชื่อ',
        newTaskName            : 'L{TaskBoard.task} ใหม่',
        removeTask             : 'นำ L{TaskBoard.task} ออก',
        removeTasks            : 'นำ L{TaskBoard.tasks} ออก',
        resources              : 'ทรัพยากร',
        save                   : 'บันทึก',
        scrollToColumn         : 'เลื่อนไปยัง L{TaskBoard.column}',
        scrollToSwimlane       : 'เลื่อนไปยัง L{TaskBoard.swimlane}',
        showColumnMenu         : 'แสดงเมนูคอลัมน์',
        showTask               : 'แสดง L{TaskBoard.task}',
        unassigned             : 'ไม่ได้รับมอบหมาย',
        zoom                   : 'ขยาย'
    },

    ColumnFilters : {
        show         : 'แสดงตัวกรองคอลัมน์',
        toggle       : 'สลับตัวกรองคอลัมน์',
        clear        : 'ล้างตัวกรองคอลัมน์',
        badgeTooltip : count => `${count} ตัวกรองที่ถูกใช้`
    },

    ColumnSort : {
        sort     : 'จัดเรียงคอลัมน์',
        sortedBy : ({ label, ascending }) =>
            `คอลัมน์ถูกจัดเรียง ${ascending ? 'จากน้อยไปมาก' : 'จากมากไปน้อย'} โดย "${label}"`,
        reset : 'รีเซ็ตการจัดเรียงคอลัมน์'
    },

    TaskMenuItem : {
        showTaskMenu : 'แสดงเมนูงาน'
    },

    TodoListField : {
        add     : 'เพิ่ม',
        newTodo : 'สิ่งที่ต้องทำใหม่'
    },

    UndoRedo : {
        UndoLastAction : 'เลิกทำ',
        RedoLastAction : 'ทำซ้ำ'
    },

    ColumnRename : {
        rename : 'เปลี่ยนชื่อ'
    },

    ColumnSearchField : {
        search    : 'ค้นหา',
        matchMode : (mode) => `โหมดการค้นหา: ${mode}`,
        literal   : 'ตัวอักษร',
        and       : 'ทุกคำ (และ)',
        or        : 'คำใดก็ได้ (หรือ)'
    }
};

export default LocaleHelper.publishLocale(locale);
