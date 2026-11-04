import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Th.js';

const emptyString = new String();

const locale = {

    localeName : 'Th',
    localeDesc : 'ไทย',
    localeCode : 'th',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'ค้นหา',
        selectAll   : 'เลือกทั้งหมด',
        removeAll   : 'ลบทั้งหมด',
        filtersSet  : n => n === 1 ? `ตั้งค่าตัวกรอง 1 รายการ` : `ตั้งค่าตัวกรอง ${n} รายการ`,
        noItems     : 'ไม่พบผลลัพธ์',
        placeholder : 'ตัวกรอง...',
        apply       : 'ใช้'
    },

    ColumnPicker : {
        column          : 'คอลัมน์',
        columnsMenu     : 'คอลัมน์',
        hideColumn      : 'ซ่อนคอลัมน์',
        hideColumnShort : 'ซ่อน',
        newColumns      : 'คอลัมน์ใหม่',
        allColumns      : 'คอลัมน์ทั้งหมด',
        showName        : column => `แสดงคอลัมน์${column.text ? ` ${column.text}` : ''}`,
        hideName        : column => `ซ่อนคอลัมน์${column.text ? ` ${column.text}` : ''}`
    },

    Filter : {
        applyFilter   : 'ใช้ตัวกรอง',
        filter        : 'ตัวกรอง',
        editFilter    : 'แก้ไขตัวกรอง',
        on            : 'ในเงื่อนไข',
        before        : 'ก่อน',
        after         : 'หลัง',
        equals        : 'เท่ากับ',
        lessThan      : 'น้อยกว่า',
        moreThan      : 'มากกว่า',
        removeFilter  : 'นำตัวกรองออก',
        disableFilter : 'ปิดใช้งานตัวกรอง'
    },

    FilterBar : {
        enableFilterBar  : 'แสดงแถบตัวกรอง',
        disableFilterBar : 'ซ่อนแถบตัวกรอง'
    },

    Group : {
        group                : 'จัดกลุ่ม',
        groupAscending       : 'จัดกลุ่มจากน้อยไปมาก',
        groupDescending      : 'จัดกลุ่มจากมากไปน้อย',
        groupAscendingShort  : 'จากน้อยไปมาก',
        groupDescendingShort : 'จากมากไปน้อย',
        stopGrouping         : 'หยุดการจัดกลุ่ม',
        stopGroupingShort    : 'หยุด'
    },

    HeaderMenu : {
        moveBefore     : text => `ย้ายก่อนหน้า "${text}"`,
        moveAfter      : text => `ย้ายหลังจาก "${text}"`,
        collapseColumn : 'ยุบคอลัมน์',
        expandColumn   : 'ขยายคอลัมน์'
    },

    ColumnRename : {
        rename : 'เปลี่ยนชื่อ'
    },

    ColumnResize : {
        resizeColumn : 'ปรับขนาดคอลัมน์',
        width        : 'ความกว้าง',
        fitToData    : 'ปรับให้พอดีกับข้อมูล'
    },

    MergeCells : {
        mergeCells  : 'ผสานเซลล์',
        menuTooltip : 'ผสานเซลล์ที่มีค่าเท่ากันเมื่อจัดเรียงตามคอลัมน์นี้'
    },

    Search : {
        searchForValue : 'ค้นหาค่า'
    },

    Sort : {
        sort                   : 'จัดเรียง',
        sortAscending          : 'จัดเรียงจากน้อยไปมาก',
        sortDescending         : 'จัดเรียงจากมากไปน้อย',
        multiSort              : 'จัดเรียงตามหลายคุณลักษณะ',
        removeSorter           : 'นำตัวจัดเรียงออก',
        addSortAscending       : 'เพิ่มตัวจัดเรียงจากน้อยไปมาก',
        addSortDescending      : 'เพิ่มตัวจัดเรียงจากมากไปน้อย',
        toggleSortAscending    : 'เปลี่ยนเป็นจากน้อยไปมาก',
        toggleSortDescending   : 'เปลี่ยนเป็นจากมากไปน้อย',
        sortAscendingShort     : 'จากน้อยไปมาก',
        sortDescendingShort    : 'จากมากไปน้อย',
        removeSorterShort      : 'นำออก',
        addSortAscendingShort  : '+ จากน้อยไปมาก',
        addSortDescendingShort : '+ จากมากไปน้อย'
    },

    Split : {
        split        : 'แยก',
        unsplit      : 'ไม่แยก',
        horizontally : 'แนวนอน',
        vertically   : 'แนวตั้ง',
        both         : 'ทั้งสอง',
        top          : 'บน',
        bottom       : 'ล่าง',
        left         : 'ซ้าย',
        right        : 'ขวา'
    },

    LockRows : {
        lockRow   : 'ล็อกแถว',
        unlockRow : 'ปลดล็อกแถว'
    },

    ActionColumn : {
        rowActions : 'การดำเนินการแถว'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} คอลัมน์. ` : ''}แตะ SPACE สำหรับเมนูบริบท${column.canSort ? ', กดปุ่ม ENTER เพื่อจัดเรียง' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'วิดเจ็ตแถว'
    },

    Checkbox : {
        toggleRowSelect : 'สลับการเลือกแถว',
        toggleSelection : 'สลับการเลือกชุดข้อมูลทั้งหมด',
        toggleName      : column => `สลับ ${column.text || 'ค่า'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? `คะแนน : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'หมายเลขแถว'
    },

    GridBase : {
        loadFailedMessage  : 'การโหลดข้อมูลล้มเหลว!',
        syncFailedMessage  : 'การซิงค์ข้อมูลล้มเหลว!',
        unspecifiedFailure : 'การล้มเหลวที่ไม่ระบุ',
        networkFailure     : 'ข้อผิดพลาดของเครือข่าย',
        parseFailure       : 'การวิเคราะห์การตอบสนองของเซิร์ฟเวอร์ล้มเหลว',
        serverResponse     : 'การตอบสนองของเซิร์ฟเวอร์:',
        noRows             : 'ไม่มีบันทึกที่จะแสดง',
        moveColumnLeft     : 'ย้ายไปที่ส่วนซ้าย',
        moveColumnRight    : 'ย้ายไปที่ส่วนขวา',
        moveColumnTo       : region => `ย้ายคอลัมน์ไปที่ ${region}`,
        filteredRecords    : n => n ? (n === 1 ? `1 แถวตรงกับตัวกรอง` : `${n} แถวตรงกับตัวกรอง`) : 'ไม่มีแถวตรงกับตัวกรอง'
    },

    CellMenu : {
        removeRow : 'ลบ'
    },

    RowCopyPaste : {
        copyRecord  : 'คัดลอก',
        cutRecord   : 'ตัด',
        pasteRecord : 'วาง',
        rows        : 'หลายแถว',
        row         : 'แถว'
    },

    CellCopyPaste : {
        copy  : 'คัดลอก',
        cut   : 'ตัด',
        paste : 'วาง'
    },

    Charts : {
        chartDesigner : 'ผู้ออกแบบแผนภูมิ',
        newChart      : 'แผนภูมิใหม่',
        download      : 'ดาวน์โหลด',
        settings      : 'การตั้งค่า'
    },

    PdfExport : {
        'Waiting for response from server' : 'กำลังรอการตอบสนองจากเซิร์ฟเวอร์...',
        'Export failed'                    : 'การส่งออกล้มเหลว',
        'Server error'                     : 'พบข้อผิดพลาดที่เซิร์ฟเวอร์',
        'Generating pages'                 : 'กำลังสร้างหน้าข้อมูล...',
        'Click to abort'                   : 'ยกเลิก'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'การตั้งค่าสำหรับการส่งออก',
        export         : 'การส่งออก',
        printSettings  : 'การตั้งค่าการพิมพ์',
        print          : 'พิมพ์',
        exporterType   : 'ควบคุมการแบ่งข้อมูลเป็นหน้า',
        cancel         : 'ยกเลิก',
        fileFormat     : 'รูปแบบของไฟล์',
        rows           : 'แถว',
        alignRows      : 'จัดแนวแถว',
        columns        : 'คอลัมน์',
        paperFormat    : 'รูปแบบกระดาษ',
        orientation    : 'การวางแนว',
        repeatHeader   : 'ทำซ้ำหัวตาราง'
    },

    ExportRowsCombo : {
        all     : 'แถวทั้งหมด',
        visible : 'แถวที่มองเห็น'
    },

    ExportOrientationCombo : {
        portrait  : 'แนวตั้ง',
        landscape : 'แนวนอน'
    },

    SinglePageExporter : {
        singlepage : 'หน้าเดียว'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'หน้าเดียว (ไม่ปรับขนาด)'
    },

    MultiPageExporter : {
        multipage     : 'หลายหน้า',
        exportingPage : ({ currentPage, totalPages }) => `กำลังส่งออกหน้า ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'หลายหน้า (แนวตั้ง)',
        exportingPage     : ({ currentPage, totalPages }) => `กำลังส่งออกหน้า ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'กำลังโหลด',
        expand             : 'ขยาย',
        collapse           : 'ย่อ',
        columnDescription  : 'สลับรายละเอียดแถว',
        expandedRowContent : 'เนื้อหาแถวที่ขยาย'
    },

    TreeGroup : {
        group                  : 'จัดกลุ่มตาม',
        stopGrouping           : 'หยุดการจัดกลุ่ม',
        stopGroupingThisColumn : 'ยกเลิกการจัดกลุ่มคอลัมน์นี้'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'การดำเนินการกรองไม่สำเร็จ โปรดลองอีกครั้ง'
    },

    AIFilterField : {
        progressText : 'กำลังกรอง'
    },

    PinColumns : {
        pinColumn  : 'ตรึงคอลัมน์',
        unpin      : 'ไม่ตรึง',
        pinToStart : 'ตรึงที่จุดเริ่มต้น',
        pinToEnd   : 'ตรึงที่จุดสิ้นสุด'
    }
};

export default LocaleHelper.publishLocale(locale);
