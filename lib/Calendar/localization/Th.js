import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Th.js';

const locale = {

    localeName : 'Th',
    localeDesc : 'ไทย',
    localeCode : 'th',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'ปฏิทิน',
        'All day' : 'ทั้งวัน',
        day       : 'วัน',
        week      : 'สัปดาห์',
        month     : 'เดือน',
        year      : 'ปี',
        decade    : 'ทศวรรษ'
    },

    EventMenu : {
        duplicateEvent : 'ทำสำเนากิจกรรม',
        copy           : 'คัดลอก'
    },

    Calendar : {
        toggleSidebar : 'สลับการมองเห็นแถบด้านข้าง',
        Today         : 'วันนี้',
        Tomorrow      : 'นี้',
        next          : range => `${range} ถัดไป`,
        previous      : range => `${range} ก่อนหน้า`,
        plusMore      : value => `+${value} เพิ่มเติม`,
        moreEvents    : value => `${value} กิจกรรมเพิ่มเติม`,
        allDay        : 'ทั้งวัน',
        endsOn        : d => `สิ้นสุด ${d}`,
        weekOfYear    : ([y, w]) => `สัปดาห์ ${w}, ${y}`,
        loadFail      : 'โหลดข้อมูลปฏิทินไม่สำเร็จ โปรดติดต่อผู้ดูแลระบบของคุณ',
        gotoDate      : 'ไปยังวันที่',
        timeRange     : 'ช่วงเวลา',
        noResources   : 'ไม่มีทรัพยากร',
        calendar      : 'ปฏิทิน',
        toolbar       : 'แถบเครื่องมือปฏิทิน',
        months        : 'เดือน'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'กดปุ่ม CTRL ค้างไว้สำหรับกิจกรรมที่เกิดซ้ำ'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'ไม่มี'}กิจกรรม`,
        allDayEventCount : count => `${count || 'ไม่มี'} กิจกรรมตลอดวัน${count === 1 ? '' : 's'}`
    },

    EventTip : {
        'Edit event' : 'แก้ไขกิจกรรม',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'รวมวันหยุดสุดสัปดาห์',
        weekends        : 'วันหยุดสุดสัปดาห์',
        switcherMenu    : 'เมนูสลับมุมมอง'
    },

    AgendaView : {
        Agenda : 'กำหนดการ'
    },

    MonthView : {
        Month     : 'เดือน',
        monthUnit : 'เดือน'
    },

    MultiWeekView : {
        multiWeek : 'หลายสัปดาห์'
    },

    WeekView : {
        weekUnit : 'สัปดาห์'
    },

    YearView : {
        Year     : 'ปี',
        yearUnit : 'ปี',
        noEvents : 'ไม่มีกิจกรรม'
    },

    YearPlanner : {
        yearPlanner      : 'แผนปี',
        expandMonthRow   : 'ขยายแถวเดือน',
        collapseMonthRow : 'ยุบแถวเดือน'
    },

    EventList : {
        List   : 'รายการ',
        Start  : 'เริ่มต้น',
        Finish : 'เสร็จสิ้น',
        days   : count => `${count} วัน`
    },

    DayView : {
        Day                : 'วัน',
        dayUnit            : 'วัน',
        daysUnit           : 'วัน',
        expandAllDayRow    : 'ขยายส่วนทั้งวัน',
        collapseAllDayRow  : 'ย่อส่วนทั้งวัน',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'ไม่มีวันที่ที่ตรงกัน'
    },

    DayAgendaView : {
        dayAgenda : 'วาระประจำวัน'
    },

    DayResourceView : {
        dayResourceView : 'ทรัพยากรวัน'
    },

    MonthGrid : {
        monthGrid : 'ตารางเดือน'
    },

    Sidebar : {
        selectDate      : 'เลือกวันที่ในปฏิทิน',
        matchEvents     : 'เหตุการณ์การแข่งขัน',
        filterEvents    : 'กรองเหตุการณ์ตามชื่อเหตุการณ์',
        filterResources : 'กรองเหตุการณ์ตามทรัพยากรที่เลือก'
    },

    WeekExpander : {
        expandTip   : 'คลิกเพื่อขยายแถว',
        collapseTip : 'คลิกเพื่อย่อแถว'
    },

    keyboardActions : {
        title   : 'การกระทำของแป้นพิมพ์',
        content : 'แสดงแผงช่วยเหลือ : [?]\nปุ่มเลือกโหมดโฟกัส : [Home]\nเปลี่ยนมุมมอง : [1] ถึง [9] หรืออักษรตัวแรกของข้อความปุ่มตัวเลือก\nช่วงเวลาถัดไป : [n]\nช่วงเวลาก่อนหน้า : [p]\nไปที่วันนี้ : [t]\nนำทางไปยังวันที่ : [g]\nไปที่เซลล์ของวันปัจจุบัน : [CTRL]+[d]\nนำทางระหว่างเหตุการณ์ : [TAB]\nโฟกัสที่อินพุตตัวกรองเหตุการณ์ในแถบด้านข้าง : [/]\nสร้างเหตุการณ์ใหม่ (โฟกัสที่เซลล์วัน) : [ENTER]\nลบเหตุการณ์ที่โฟกัส : [DELETE]/[BACKSPACE]\nแก้ไขเหตุการณ์ที่โฟกัส : [ENTER]\nเรียกเมนูบริบทบนเหตุการณ์หรือเซลล์ : [SHIFT+F10]/[SPACE]\nโฟกัสจากเหตุการณ์ไปยังเซลล์ที่ครอบคลุม : [ESCAPE]\nการนำทางระหว่างเซลล์ : [↑]/[↓]/[←]/[→]\nเปิดเมนูช่วง (ในมุมมอง Agenda) : [CTRL]+[r]\nตัด, คัดลอก, วางเหตุการณ์ : [CTRL]+[x]/[c]/[v]\nซูมเข้า/ออกในมุมมองวันเท่านั้น : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
