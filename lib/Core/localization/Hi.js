import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Hi',
    localeDesc : 'हिन्दी',
    localeCode : 'hi',
    localeRtl  : false,

    Object : {
        Yes      : 'हाँ',
        No       : 'नहीं',
        Cancel   : 'रद्द करें',
        Ok       : 'ओके',
        Week     : 'सप्ताह',
        None     : 'कोई नहीं',
        previous : 'पिछला',
        next     : 'अगला',
        to       : 'तक',
        at       : 'पर',
        on       : 'पर',
        editing  : what => `${what} संपादित कर रहे हैं`,
        settings : 'सेटिंग्स',
        close    : 'बंद करें',
        go       : 'जाओ',
        save     : 'सहेजें',
        cancel   : 'रद्द करें',
        revert   : 'पूर्ववत करें',
        collapse : 'समेटें',
        expand   : 'फैलाएं',
        today    : 'आज',
        andNMore : n => `और ${n} और`
    },

    AIBase : {
        delayStatusTexts : [
            'प्रतीक्षा कर रहा है',
            'प्रतीक्षा कर रहा है ...',
            'अभी भी प्रतीक्षा कर रहा है',
            'अभी भी प्रतीक्षा कर रहा है ...'
        ],
        autoStartDialogMessage        : 'क्या आप AI वॉयस सक्रियण सक्षम करना चाहते हैं?',
        voiceActivationToast          : phrase => `वॉयस सक्रियण सक्षम, वार्तालाप शुरू करने के लिए वाक्यांश "${phrase}" का उपयोग करें`,
        voiceControlNotSupportedToast : 'इस डिवाइस पर वॉयस नियंत्रण समर्थित नहीं है',
        voiceControlErrorToast        : 'आपके डिवाइस पर वॉयस नियंत्रण शुरू नहीं किया जा सका',
        voiceControlSilenceToast      : phrase => `मौन के कारण AI वॉयस वार्तालाप समाप्त हो गया। वार्तालाप पुनः आरंभ करने के लिए वाक्यांश ${phrase} का उपयोग करें`,
        noAudioDetected               : 'कोई ऑडियो नहीं मिला, कृपया पुनः प्रयास करें',
        transcriptionErrorToast       : 'प्रतिलेखन विफल, कृपया पुनः प्रयास करें',
        playbackErrorToast            : 'ऑडियो प्लेबैक विफल, कृपया अपने ऑडियो आउटपुट डिवाइस की जांच करें',
        failed                        : '(विफल)',
        awaitingConfirmation          : 'पुष्टि की प्रतीक्षा कर रहा है',
        timeoutToast                  : 'संदेश समय समाप्त',
        readingStatusText             : modelName => `${modelName}s पढ़ रहा है`,
        updatingStatusText            : modelName => `${modelName}s अपडेट कर रहा है`,
        removingStatusText            : modelName => `${modelName}s हटा रहा है`,
        addingStatusText              : modelName => `${modelName} जोड़ रहा है`,
        filteringStatusText           : modelName => `${modelName}s फ़िल्टर कर रहा है`,
        thinkingStatusText            : 'सोच रहा है',
        processingStatusText          : 'प्रोसेस कर रहा है'
    },

    AISettingsPanel : {
        highlight               : 'हाइलाइट',
        verbosity               : 'विस्तार',
        voiceActivation         : 'वॉयस सक्रियता',
        enableVoiceActivation   : 'वॉयस सक्रियता सक्षम करें',
        voiceOnly               : 'केवल वॉयस',
        autostart               : 'स्वतः प्रारंभ',
        dataChangeConfirmations : 'डेटा परिवर्तन पुष्टि',
        add                     : 'जोड़ें',
        remove                  : 'हटाएं',
        update                  : 'अपडेट करें',
        planning                : 'योजना',
        enablePlanning          : 'योजना सक्षम करें',
        aiModel                 : 'एआई मॉडल',
        timeline                : 'समयरेखा',
        'in-view'               : 'दृश्य में',
        all                     : 'सभी',
        timeRangeContext        : 'समय सीमा संदर्भ'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'एआई बोल रहा है',
        recordingTooltip      : 'रिकॉर्डिंग',
        waitingTooltip        : 'एआई सोच रहा है',
        startRecordingTooltip : 'शुरू करने के लिए क्लिक करें',
        stopRecordingTooltip  : 'रोकने के लिए क्लिक करें',
        inactiveTooltip       : 'रिकॉर्डिंग नहीं हो रही',
        openChatTooltip       : 'चैट खोलने के लिए राइट क्लिक करें'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'एक संदेश टाइप करें',
        noConnectionTooltip     : 'कोई कनेक्शन नहीं मिला, पुनः प्रयास करने के लिए क्लिक करें',
        undone                  : 'पूर्ववत',
        aborted                 : '(रद्द किया गया)',
        readAloudTooltip        : 'संदेश को जोर से पढ़ें',
        confidenceTooltip       : confidence => `विश्वास: ${confidence}%`,
        undoTooltip             : 'डेटा परिवर्तनों को पूर्ववत करें',
        redoTooltip             : 'डेटा परिवर्तनों को पुनः करें',
        thumbsUp                : 'अच्छा लगा',
        thumbsDown              : 'अच्छा नहीं लगा',
        feedbackToast           : 'आपकी प्रतिक्रिया के लिए धन्यवाद!',
        clearChat               : 'चैट साफ करें',
        closeChat               : 'चैट बंद करें',
        settings                : 'सेटिंग्स',
        closeSettings           : 'सेटिंग्स बंद करें'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `कृपया ठीक ${min} चुनें`,
        tooFewOptionsSelected     : min => `कम से कम ${min} चुनें`,
        tooManyOptionsSelected    : max => `अधिकतम ${max} चुनें`
    },

    CodeEditor : {
        apply        : 'लागू करें',
        autoApply    : 'स्वचालित लागू करें',
        downloadCode : 'कोड डाउनलोड करें'
    },

    ColorPicker : {
        noColor : 'कोई रंग नहीं'
    },

    Combo : {
        noResults          : 'कोई परिणाम नहीं',
        recordNotCommitted : 'रिकॉर्ड जोड़ा नहीं जा सका',
        addNewValue        : value => `जोड़ें  ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'हाइलाइट करें',
        preview         : 'पूर्वावलोकन',
        approve         : 'स्वीकृत करें',
        reject          : 'अस्वीकृत करें',
        confirmAdd      : 'जोड़ने की पुष्टि करें:',
        confirmUpdate   : 'अपडेट की पुष्टि करें:',
        confirmRemove   : 'हटाने की पुष्टि करें:',
        confirmCopy     : 'कॉपी की पुष्टि करें',
        confirmAssign   : 'असाइनमेंट की पुष्टि करें',
        confirmReassign : 'पुनः असाइनमेंट की पुष्टि करें',
        confirmUnassign : 'अनअसाइनमेंट की पुष्टि करें',
        confirmLink     : 'लिंक की पुष्टि करें',
        confirmUnlink   : 'अनलिंक की पुष्टि करें'
    },

    FilePicker : {
        file : 'फाइल'
    },

    Field : {
        badInput              : 'अमान्य फील्ड मान',
        patternMismatch       : 'मान को विशिष्ट पैटर्न के अनुरूप होना चाहिए',
        rangeOverflow         : value => `मान को ${value.max} से कम या बराबर होना चाहिए`,
        rangeUnderflow        : value => `मान को ${value.min} से अधिक या बराबर होना चाहिए `,
        stepMismatch          : 'मान इस स्टेप से फिट होना चाहिए',
        tooLong               : 'मान छोटा होना चाहिए',
        tooShort              : 'मान अधिक लंबा होना चाहिए',
        typeMismatch          : 'मान को विशेष फार्मेट में होना चाहिए',
        valueMissing          : 'यह फील्ड आवश्यक है',
        invalidValue          : 'अमान्य फील्ड मान',
        minimumValueViolation : 'न्यूनतम मान उल्लंघन',
        maximumValueViolation : 'अधिकतम मान उल्लंघन',
        fieldRequired         : 'यह फील्ड आवश्यक है',
        validateFilter        : 'इस सूची के लिए मान चुना जाना चाहिए'
    },

    DateField : {
        invalidDate : format => 'अमान्य दिनांक इनपुट, अपेक्षित प्रारूप है ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'पिछले साल पर जाएं',
        gotoPrevMonth : 'पिछले महीने पर जाएं',
        gotoNextMonth : 'अगले महीने पर जाएं',
        gotoNextYear  : 'अगले साल पर जाएं',
        navigation    : 'तिथि चयनकर्ता नेविगेशन'
    },

    Hint : {
        dontShowAgain : 'फिर से न दिखाएं'
    },

    NumberFormat : {
        locale   : 'hi',
        currency : 'INR'
    },

    DurationField : {
        invalidUnit : 'अमान्य इकाई'
    },

    TimeField : {
        invalidTime : 'अमान्य समय इनपुट'
    },

    TimePicker : {
        hour   : 'घंटा',
        minute : 'मिनट',
        second : 'सेकंड'
    },

    Tooltip : {
        loading : 'लोड हो रहा है...'
    },

    List : {
        loading   : 'लोड कर रहा है...',
        selectAll : 'सभी का चयन करें'
    },

    GridBase : {
        loadMask : 'लोड कर रहा है...',
        syncMask : 'बदलाव सहेज रहा है, कृपया प्रतीक्षा करें...'
    },

    PagingToolbar : {
        firstPage         : 'पहले पेज पर जाएं',
        prevPage          : 'पिछले पेज पर जाएं',
        page              : 'पेज',
        nextPage          : 'अगले पेज पर जाएं',
        lastPage          : 'अंतिम पेज पर जाएं',
        reload            : 'वर्तमान पेज रीलोड करें',
        noRecords         : 'दर्शाने के लिए कोई रिकॉर्ड नहीं',
        pageCountTemplate : data => `${data.lastPage} का`,
        summaryTemplate   : data => `${data.allCount} का ${data.start} - ${data.end} का रिकॉर्ड दर्शा रहा है`
    },

    Popup : {
        close    : 'पॉपअप बंद करें',
        maximize : 'बड़ा करें'
    },

    Splitter : {
        ariaLabel      : 'स्प्लिटर, पड़ोसी पैनलों का आकार बदलने के लिए तीर कुंजियों का उपयोग करें',
        collapseLeft   : 'बाएँ पैनल को संक्षिप्त करें',
        collapseRight  : 'दाएँ पैनल को संक्षिप्त करें',
        collapseTop    : 'ऊपरी पैनल को संक्षिप्त करें',
        collapseBottom : 'निचले पैनल को संक्षिप्त करें',
        expandLeft     : 'बाएँ पैनल को विस्तृत करें',
        expandRight    : 'दाएँ पैनल को विस्तृत करें',
        expandTop      : 'ऊपरी पैनल को विस्तृत करें',
        expandBottom   : 'निचले पैनल को विस्तृत करें'
    },

    TabPanel : {
        containsInvalidFields : 'टैब में अमान्य फ़ील्ड्स हैं'
    },

    Toolbar : {
        showOverflowingItems : 'ओवरफ्लो आइटम दिखाएं',
        scrollForMore        : 'और देखने के लिए स्क्रॉल करें'
    },

    UndoRedo : {
        Undo           : 'अनडू करें',
        Redo           : 'रीडू करें',
        UndoLastAction : 'पिछला ऐक्शन अनडू करें',
        RedoLastAction : 'पिछला ऐक्शन रीडू करें',
        NoActions      : 'कतार अनडू करें में कोई आइटम नहीं है'
    },

    FieldFilterPicker : {
        equals                 : 'बराबर है',
        doesNotEqual           : 'बराबर नहीं है',
        isEmpty                : 'खाली है',
        isNotEmpty             : 'खाली नहीं है',
        contains               : 'शामिल है',
        doesNotContain         : 'शामिल नहीं है',
        startsWith             : 'के साथ शुरू होता है',
        endsWith               : 'के साथ अंत होता है',
        isOneOf                : 'इनमें से एक है',
        isNotOneOf             : 'इनमें से एक नहीं है',
        isGreaterThan          : 'इससे बड़ा है',
        isLessThan             : 'इससे छोटा है',
        isGreaterThanOrEqualTo : 'इसके बराबर या बड़ा है',
        isLessThanOrEqualTo    : 'इसके बराबर या छोटा है',
        isBetween              : 'बीच में है',
        isNotBetween           : 'बीच में नहीं है',
        isBefore               : 'पहले है',
        isAfter                : 'बाद में है',
        timeEquals             : 'समय बराबर है',
        timeDoesNotEqual       : 'समय बराबर नहीं है',
        isToday                : 'आज है',
        isTomorrow             : 'आगामी कल है',
        isYesterday            : 'बीते कल है',
        isThisWeek             : 'इस सप्ताह है',
        isNextWeek             : 'अगले सप्ताह है',
        isLastWeek             : 'पिछले सप्ताह हैं',
        isThisMonth            : 'इस माह है',
        isNextMonth            : 'अगले माह है',
        isLastMonth            : 'पिछले माह है',
        isThisYear             : 'इस साल है',
        isNextYear             : 'अगले साल है',
        isLastYear             : 'पिछले साल है',
        isYearToDate           : 'साल से आज तक है',
        isTrue                 : 'सच है',
        isFalse                : 'असत्य है',
        selectAProperty        : 'कोई गुण चुनें',
        selectAnOperator       : 'कोई ऑपरेटर चुनें',
        caseSensitive          : 'केस-संवेदी',
        and                    : 'और',
        dateFormat             : 'D/M/YY',
        selectValue            : 'कोई मान चुनें',
        selectOneOrMoreValues  : 'एक या अधिक मान चुनें',
        enterAValue            : 'एक मान दर्ज करें',
        enterANumber           : 'एक संख्या दर्ज करें',
        selectADate            : 'एक तारीख चुनें',
        selectATime            : 'समय चुनें'
    },

    FieldFilterPickerGroup : {
        addFilter : 'फिल्टर जोड़ें',
        applyCond : applied => applied ? 'फ़िल्टर छोड़ें (वर्तमान में लागू)' : 'फ़िल्टर लागू करें (वर्तमान में छोड़ा गया)'
    },

    DateHelper : {
        locale         : 'hi',
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
            { single : 'मिलीसेकंड', plural : 'मिलीसेकंड', abbrev : 'मिसे' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'सेकंड', plural : 'सेकंड', abbrev : 'से' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'मिनट', plural : 'मिनट', abbrev : 'मि' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'घंटा', plural : 'घंटे', abbrev : 'घं' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'दिन', plural : 'दिन', abbrev : 'दि' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'हफ्ता', plural : 'हफ्ते', abbrev : 'ह' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'महीना', plural : 'महीने', abbrev : 'माह' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'तिमाही', plural : 'तिमाही', abbrev : 'ति' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'साल', plural : 'साल', abbrev : 'सा' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'दशक', plural : 'दशक', abbrev : 'द' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['मिसे'],
            [],
            ['से', 'से'],
            [],
            ['मि', 'मि'],
            [],
            ['घं', 'घं'],
            [],
            ['दि'],
            [],
            ['ह', 'ह'],
            [],
            ['माह', 'माह', 'माह'],
            [],
            ['ति', 'ति', 'ति'],
            [],
            ['सा', 'सा'],
            [],
            ['द'],
            []
        ],
        parsers : {
            L   : 'MM/DD/YYYY',
            LT  : 'HH:mm A',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {
            const suffix = { 1 : '', 2 : '', 3 : '', 4 : '', 6 : '', 7 : '', 8 : '', 9 : '' }[number] || 'वां';
            return number + suffix;
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)} का दशक`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
