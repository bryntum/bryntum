import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Hi.js';

const emptyString = new String();

const locale = {

    localeName : 'Hi',
    localeDesc : 'हिन्दी',
    localeCode : 'hi',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : 'खोजें',
        selectAll   : 'सभी चुनें',
        removeAll   : 'सभी हटाएं',
        filtersSet  : n => n === 1 ? `1 फ़िल्टर सेट किया गया` : `${n} फ़िल्टर सेट किए गए`,
        noItems     : 'कोई परिणाम नहीं मिला',
        placeholder : 'फ़िल्टर करें...',
        apply       : 'लागू करें'
    },

    ColumnPicker : {
        column          : 'कॉलम',
        columnsMenu     : 'कॉलम',
        hideColumn      : 'कॉलम छिपाएं',
        hideColumnShort : 'छिपाएं',
        newColumns      : 'नए कॉलम',
        allColumns      : 'सभी कॉलम',
        showName        : column => `कॉलम${column.text ? ` ${column.text}` : ''} छिपाएँ`,
        hideName        : column => `कॉलम${column.text ? ` ${column.text}` : ''} दिखाएँ`
    },

    Filter : {
        applyFilter   : 'फिल्टर लागू करें',
        filter        : 'फिल्टर',
        editFilter    : 'फिल्टर संपादित करें',
        on            : 'पर',
        before        : 'पहले',
        after         : 'बाद में',
        equals        : 'के बराबर',
        lessThan      : 'से कम',
        moreThan      : 'से अधिक',
        removeFilter  : 'फिल्टर हटाएं',
        disableFilter : 'फिल्टर अक्षम करें'
    },

    FilterBar : {
        enableFilterBar  : 'फिल्टर बार दिखाएं',
        disableFilterBar : 'फिल्टर बार छिपाएं'
    },

    Group : {
        group                : 'समूहित करें',
        groupAscending       : 'आरोही समूहित करें',
        groupDescending      : 'अवरोही समूहित करें',
        groupAscendingShort  : 'आरोही',
        groupDescendingShort : 'अवरोही',
        stopGrouping         : 'समूहित करना बंद करें',
        stopGroupingShort    : 'बंद करें'
    },

    HeaderMenu : {
        moveBefore     : text => `"${text}" से पहले ले जाएं`,
        moveAfter      : text => `"${text}" के बाद ले जाएं`,
        collapseColumn : 'कॉलम कोलैप्स करें',
        expandColumn   : 'कॉलम फैलाएं'
    },

    ColumnRename : {
        rename : 'नाम बदलें'
    },

    ColumnResize : {
        resizeColumn : 'कॉलम का आकार बदलें',
        width        : 'चौड़ाई',
        fitToData    : 'डेटा के अनुसार फ़िट करें'
    },

    MergeCells : {
        mergeCells  : 'सेल मर्ज करें',
        menuTooltip : 'इस कॉलम द्वारा छांटते समय समान मान वाले सेल मर्ज करें'
    },

    Search : {
        searchForValue : 'मान की खोज करें'
    },

    Sort : {
        sort                   : 'छांटें',
        sortAscending          : 'आरोही छांटें',
        sortDescending         : 'अवरोही छांटें',
        multiSort              : 'एकाधिक छांटें',
        removeSorter           : 'छांटने वाला निकालें',
        addSortAscending       : 'आरोही छांटने वाला जोड़ें',
        addSortDescending      : 'अवरोही छांटने वाला जोड़ें',
        toggleSortAscending    : 'आरोही में बदलें',
        toggleSortDescending   : 'अवरोही में बदलें',
        sortAscendingShort     : 'आरोही',
        sortDescendingShort    : 'अवरोही',
        removeSorterShort      : 'हटाएं',
        addSortAscendingShort  : '+ आरोही',
        addSortDescendingShort : '+ अवरोही'
    },

    Split : {
        split        : 'विभाजित',
        unsplit      : 'अविभाजित',
        horizontally : 'क्षैतिजता से',
        vertically   : 'लंबवत',
        both         : 'दोनों',
        top          : 'ऊपर',
        bottom       : 'नीचे',
        left         : 'बाएँ',
        right        : 'दाएँ'
    },

    LockRows : {
        lockRow   : 'पंक्ति को ताला लगाएं',
        unlockRow : 'पंक्ति का ताला खोलें'
    },

    ActionColumn : {
        rowActions : 'पंक्ति क्रियाएँ'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} कॉलम. ` : ''}प्रसंग मेनू के लिए SPACE पर टैप करें${column.canSort ? ', सॉर्ट करने के लिए ENTER' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : 'पंक्ति विजेट्स'
    },

    Checkbox : {
        toggleRowSelect : 'पंक्ति चयन टॉगल करें',
        toggleSelection : 'पूरे डेटासेट का चयन टॉगल करें',
        toggleName      : column => `टॉगल करें ${column.text || 'मूल्य'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.text ? column.text : ''} ${column.location?.record ? ` रेटिंग : ${column.location.record.get(column.field) || 0}` : ''}`
    },

    RowNumberColumn : {
        rowNumber : 'पंक्ति संख्या'
    },

    GridBase : {
        loadFailedMessage  : 'डेटा लोडिंग विफल रहा!',
        syncFailedMessage  : 'डेटा सिक्रोनाइजेशन विफल रहा!',
        unspecifiedFailure : 'अनिर्दिष्ट विफलता',
        networkFailure     : 'नेटवर्क त्रुटि',
        parseFailure       : 'सर्वर प्रतिक्रिया पार्स करना विफल रहा',
        serverResponse     : 'सर्वर प्रतिक्रिया:',
        noRows             : 'दर्शाने के लिए कोई रिकॉर्ड नहीं है',
        moveColumnLeft     : 'बाएं सेक्शन पर जाएं',
        moveColumnRight    : 'दाएं सेक्शन पर जाएं',
        moveColumnTo       : region => `कॉलम को ${region} पर ले जाएं`,
        filteredRecords    : n => n ? (n === 1 ? `1 पंक्ति फ़िल्टर से मेल खाती है` : `${n} पंक्तियाँ फ़िल्टर से मेल खाती हैं`) : 'कोई पंक्ति फ़िल्टर से मेल नहीं खाती'
    },

    CellMenu : {
        removeRow : 'हटाएं'
    },

    RowCopyPaste : {
        copyRecord  : 'कॉपी करें',
        cutRecord   : 'कट करें',
        pasteRecord : 'पेस्ट करें',
        rows        : 'पंक्तियां',
        row         : 'पंक्ति'
    },

    CellCopyPaste : {
        copy  : 'कॉपी करें',
        cut   : 'कट करें',
        paste : 'पेस्ट करें'
    },

    Charts : {
        chartDesigner : 'चार्ट डिजाइनर',
        newChart      : 'नया चार्ट',
        download      : 'डाउनलोड',
        settings      : 'समायोजन'
    },

    PdfExport : {
        'Waiting for response from server' : 'सर्वर प्रतिक्रिया की प्रतीक्षा कर रहा है...',
        'Export failed'                    : 'एक्सपोर्ट विफल रहा',
        'Server error'                     : 'सर्वर त्रुटि',
        'Generating pages'                 : 'पेजों को जनरेट कर रहा है...',
        'Click to abort'                   : 'रद्द करें'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : 'सेटिंग्स निर्यात करें',
        export         : 'एक्सपोर्ट करें',
        printSettings  : 'प्रिंट सेटिंग्स',
        print          : 'प्रिंट',
        exporterType   : 'पेजिनेशन नियंत्रित करें',
        cancel         : 'रद्द करें',
        fileFormat     : 'फाइल फार्मेट',
        rows           : 'पंक्तियां',
        alignRows      : 'पंक्तियां संरेखित करें',
        columns        : 'कॉलम',
        paperFormat    : 'पेपर फार्मेट',
        orientation    : 'अभिविन्यास',
        repeatHeader   : 'हेडर दोहराएं'
    },

    ExportRowsCombo : {
        all     : 'सभी पंक्तियां',
        visible : 'दिखने वाली पंक्तियां'
    },

    ExportOrientationCombo : {
        portrait  : 'पोर्ट्रेट',
        landscape : 'लैंडस्केप'
    },

    SinglePageExporter : {
        singlepage : 'एकल पेज'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : 'एकल पृष्ठ (अस्केल्ड)'
    },

    MultiPageExporter : {
        multipage     : 'एकाधिक पेज',
        exportingPage : ({ currentPage, totalPages }) => `निर्यात पृष्ठ ${currentPage}/${totalPages}`
    },

    MultiPageVerticalExporter : {
        multipagevertical : 'एकाधिक पेज (लंबवत)',
        exportingPage     : ({ currentPage, totalPages }) => `निर्यात पृष्ठ ${currentPage}/${totalPages}`
    },

    RowExpander : {
        loading            : 'लोडिंग',
        expand             : 'फैलाएं',
        collapse           : 'समेटें',
        columnDescription  : 'पंक्ति विवरण टॉगल करें',
        expandedRowContent : 'विस्तारित पंक्ति सामग्री'
    },

    TreeGroup : {
        group                  : 'द्वारा समूह बनाएं',
        stopGrouping           : 'समूह बनाना बंद करें',
        stopGroupingThisColumn : 'इस स्तंभ का समूह विस्थापित न करें'
    },

    AIFilter : {
        unsuccessfulFilterMessage : 'फ़िल्टर संचालन असफल, कृपया पुनः प्रयास करें'
    },

    AIFilterField : {
        progressText : 'फ़िल्टरिंग'
    },

    PinColumns : {
        pinColumn  : 'कॉलम पिन करें',
        unpin      : 'पिन नहीं',
        pinToStart : 'शुरू में पिन करें',
        pinToEnd   : 'अंत में पिन करें'
    }
};

export default LocaleHelper.publishLocale(locale);
