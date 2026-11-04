import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'He',
    localeDesc : 'עִברִית',
    localeCode : 'he',
    localeRtl  : true,

    Object : {
        Yes      : 'כן',
        No       : 'לא',
        Cancel   : 'בטל',
        Ok       : 'אוקיי',
        Week     : 'שבוע',
        None     : 'אף אחד',
        previous : 'הקודם',
        next     : 'הבא',
        to       : 'ל',
        at       : 'ב',
        on       : 'על',
        editing  : what => `עריכה של ${what}`,
        settings : 'הגדרות',
        close    : 'סגור',
        go       : 'לך',
        save     : 'שמור',
        cancel   : 'בטל',
        revert   : 'בטל שינויים',
        collapse : 'מזער',
        expand   : 'הרחב',
        today    : 'היום',
        andNMore : n => `ו${n} נוספים`
    },

    AIBase : {
        delayStatusTexts : [
            'ממתין',
            'ממתין ...',
            'עדיין ממתין',
            'עדיין ממתין ...'
        ],
        autoStartDialogMessage        : 'האם ברצונך להפעיל את הפעלת הקול של AI?',
        voiceActivationToast          : phrase => `הפעלת קול הופעלה, השתמש בביטוי "${phrase}" כדי להתחיל שיחה`,
        voiceControlNotSupportedToast : 'שליטה קולית אינה נתמכת במכשיר זה',
        voiceControlErrorToast        : 'לא ניתן היה להפעיל שליטה קולית במכשיר שלך',
        voiceControlSilenceToast      : phrase => `שיחת קול AI הסתיימה עקב שתיקה. השתמש בביטוי ${phrase} כדי להתחיל מחדש את השיחה`,
        noAudioDetected               : 'לא זוהה שמע, אנא נסה שוב',
        transcriptionErrorToast       : 'תמלול נכשל, אנא נסה שוב',
        playbackErrorToast            : 'השמעת שמע נכשלה, אנא בדוק את מכשיר הפלט השמע שלך',
        failed                        : '(נכשל)',
        awaitingConfirmation          : 'ממתין לאישור',
        timeoutToast                  : 'הודעה פגה',
        readingStatusText             : modelName => `קורא ${modelName}ים`,
        updatingStatusText            : modelName => `מעדכן ${modelName}ים`,
        removingStatusText            : modelName => `מסיר ${modelName}ים`,
        addingStatusText              : modelName => `מוסיף ${modelName}`,
        filteringStatusText           : modelName => `מסנן ${modelName}ים`,
        thinkingStatusText            : 'חושב',
        processingStatusText          : 'מעבד'
    },

    AISettingsPanel : {
        highlight               : 'הדגש',
        verbosity               : 'רַבּוּת',
        voiceActivation         : 'הפעלת קול',
        enableVoiceActivation   : 'הפעל הפעלת קול',
        voiceOnly               : 'רק קול',
        autostart               : 'התחלה אוטומטית',
        dataChangeConfirmations : 'אישור שינוי נתונים',
        add                     : 'הוסף',
        remove                  : 'הסר',
        update                  : 'עדכון',
        planning                : 'תכנון',
        enablePlanning          : 'אפשר תכנון',
        aiModel                 : 'מודל AI',
        timeline                : 'ציר זמן',
        'in-view'               : 'בתצוגה',
        all                     : 'הכל',
        timeRangeContext        : 'הקשר טווח זמן'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'ה-AI מדבר',
        recordingTooltip      : 'הקלטה',
        waitingTooltip        : 'ה-AI חושב',
        startRecordingTooltip : 'לחץ כדי להתחיל',
        stopRecordingTooltip  : 'לחץ כדי להפסיק',
        inactiveTooltip       : 'לא מקליט',
        openChatTooltip       : "לחץ ימני כדי לפתוח את הצ'אט"
    },

    ChatPanel : {
        messageFieldPlaceholder : 'הקלד הודעה',
        noConnectionTooltip     : 'לא זוהתה חיבור, לחץ לנסות שוב',
        undone                  : 'בוטל',
        aborted                 : '(נפסק)',
        readAloudTooltip        : 'קרא הודעה בקול רם',
        confidenceTooltip       : confidence => `ביטחון: ${confidence}%`,
        undoTooltip             : 'בטל שינויים בנתונים',
        redoTooltip             : 'בצע מחדש שינויים בנתונים',
        thumbsUp                : 'אגודל למעלה',
        thumbsDown              : 'אגודל למטה',
        feedbackToast           : 'תודה על המשוב שלך!',
        clearChat               : "נקה צ'אט",
        closeChat               : "סגור צ'אט",
        settings                : 'הגדרות',
        closeSettings           : 'סגור הגדרות'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `בחר בדיוק ${min}`,
        tooFewOptionsSelected     : min => `בחר לפחות ${min}`,
        tooManyOptionsSelected    : max => `בחר לא יותר מ-${max}`
    },

    CodeEditor : {
        apply        : 'החל',
        autoApply    : 'החלה אוטומטית',
        downloadCode : 'הורד קוד'
    },

    ColorPicker : {
        noColor : 'אין צבע'
    },

    Combo : {
        noResults          : 'אין תוצאות',
        recordNotCommitted : 'לא תאפשר להוסיף את הרשומה',
        addNewValue        : value => `${value} הוסף`
    },

    ConfirmationDialog : {
        highlight       : 'הדגש',
        preview         : 'תצוגה מקדימה',
        approve         : 'אשר',
        reject          : 'דחה',
        confirmAdd      : 'אשר הוספה:',
        confirmUpdate   : 'אשר עדכון:',
        confirmRemove   : 'אשר הסרה:',
        confirmCopy     : 'אשר העתקה',
        confirmAssign   : 'אשר הקצאה',
        confirmReassign : 'אשר הקצאה מחדש',
        confirmUnassign : 'אשר ביטול הקצאה',
        confirmLink     : 'אשר קישור',
        confirmUnlink   : 'אשר הסרת קישור'
    },

    FilePicker : {
        file : 'קובץ'
    },

    Field : {
        badInput              : 'ערך שדה בלתי-חוקי',
        patternMismatch       : 'הערך נדרש להתאים לתבנית מסוימת',
        rangeOverflow         : value => `${value.max}-הערך חייב להיות קטן או שווה ל`,
        rangeUnderflow        : value => `${value.min}-הערך חייב להיות גדול או שווה ל`,
        stepMismatch          : 'הערך אמור להתאים לשלב',
        tooLong               : 'הערכים חייבים להיות קצרים יותר',
        tooShort              : 'הערך חייב להיות ארוך יותר',
        typeMismatch          : 'הערך נדרש להיות בפורמט מיוחד',
        valueMissing          : 'שדה זה נדרש',
        invalidValue          : 'ערך שדה בלתי-חוקי',
        minimumValueViolation : 'הפרת ערך מינימום',
        maximumValueViolation : 'הפרת ערך מקסימום',
        fieldRequired         : 'שדה זה נדרש',
        validateFilter        : 'יש לבחור את הערך מרשימה'
    },

    DateField : {
        invalidDate : format => 'תאריך לא חוקי, הפורמט הצפוי הוא ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'עבור לשנה הקודמת',
        gotoPrevMonth : 'עבור לחודש הקודם',
        gotoNextMonth : 'עבור לחודש הבא',
        gotoNextYear  : 'עבור לשנה הבאה',
        navigation    : 'ניווט בוחר תאריך'
    },

    Hint : {
        dontShowAgain : 'אל תציג שוב'
    },

    NumberFormat : {
        locale   : 'he',
        currency : 'NIS'
    },

    DurationField : {
        invalidUnit : 'יחידה בלתי-חוקית'
    },

    TimeField : {
        invalidTime : 'הזנת זמן בלתי-חוקי'
    },

    TimePicker : {
        hour   : 'שעה',
        minute : 'דקה',
        second : 'שנייה'
    },

    Tooltip : {
        loading : 'טוען...'
    },

    List : {
        loading   : 'מתבצעת טעינה...',
        selectAll : 'בחר הכל'
    },

    GridBase : {
        loadMask : '...מתבצעת טעינה',
        syncMask : '...שומר שינויים, אנא המתן'
    },

    PagingToolbar : {
        firstPage         : 'עבור לעמוד הראשון',
        prevPage          : 'עבור לעמוד הקודם',
        page              : 'עמוד',
        nextPage          : 'עבור לעמוד הבא',
        lastPage          : 'עבור לעמוד האחרון',
        reload            : 'טען מחדש את העמוד הנוכחי',
        noRecords         : 'אין רשומות להצגה',
        pageCountTemplate : data => `${data.lastPage} מתוך`,
        summaryTemplate   : data => `${data.allCount} מתוך ${data.end}-${data.start} מציג רשומות`
    },

    Popup : {
        close    : 'סגור חלון קופץ',
        maximize : 'הגדל'
    },

    Splitter : {
        ariaLabel      : 'מפצל, השתמש במקשי החצים כדי לשנות את גודל הפאנלים השכנים',
        collapseLeft   : 'כווץ את הפאנל השמאלי',
        collapseRight  : 'כווץ את הפאנל הימני',
        collapseTop    : 'כווץ את הפאנל העליון',
        collapseBottom : 'כווץ את הפאנל התחתון',
        expandLeft     : 'הרחב את הפאנל השמאלי',
        expandRight    : 'הרחב את הפאנל הימני',
        expandTop      : 'הרחב את הפאנל העליון',
        expandBottom   : 'הרחב את הפאנל התחתון'
    },

    TabPanel : {
        containsInvalidFields : 'הכרטיסייה מכילה שדות לא חוקיים'
    },

    Toolbar : {
        showOverflowingItems : 'הצג פריטים חורגים',
        scrollForMore        : 'גלול לעוד'
    },

    UndoRedo : {
        Undo           : 'בטל',
        Redo           : 'בצע שוב',
        UndoLastAction : 'בטל פעולה אחרונה',
        RedoLastAction : 'בצע שוב את הפעולה האחרונה שלא בוצעה',
        NoActions      : 'אין פריטים בטור הפעולות לביטול'
    },

    FieldFilterPicker : {
        equals                 : 'שווה',
        doesNotEqual           : 'לא שווה',
        isEmpty                : 'ריק',
        isNotEmpty             : 'אינו ריק',
        contains               : 'מכיל',
        doesNotContain         : 'אינו מכיל',
        startsWith             : 'מתחיל עם',
        endsWith               : 'מסתיים עם',
        isOneOf                : 'הוא אחד מ-',
        isNotOneOf             : 'אינו אחד מ-',
        isGreaterThan          : 'גדול מ-',
        isLessThan             : 'קטן מ-',
        isGreaterThanOrEqualTo : 'גדול או שווה ל-',
        isLessThanOrEqualTo    : 'קטן או שווה ל-',
        isBetween              : 'נמצא בין',
        isNotBetween           : 'אינו נמצא בין',
        isBefore               : 'נמצא לפני',
        isAfter                : 'נמצא אחרי',
        timeEquals             : 'הזמן שווה',
        timeDoesNotEqual       : 'הזמן אינו שווה',
        isToday                : 'מתקיים היום',
        isTomorrow             : 'יתקיים מחר',
        isYesterday            : 'התקיים אתמול',
        isThisWeek             : 'יתקיים השבוע',
        isNextWeek             : 'יתקיים בשבוע הבא',
        isLastWeek             : 'התקיים בשבוע שעבר',
        isThisMonth            : 'יתקיים החודש',
        isNextMonth            : 'יתקיים בחודש הבא',
        isLastMonth            : 'התקיים בחודש שעבר',
        isThisYear             : 'יתקיים השנה',
        isNextYear             : 'יתקיים בשנה הבאה',
        isLastYear             : 'התקיים בשנה שעברה',
        isYearToDate           : 'מתחילת השנה עד היום',
        isTrue                 : 'נכון',
        isFalse                : 'לא נכון',
        selectAProperty        : 'בחר תכונה',
        selectAnOperator       : 'בחר אופרטור',
        caseSensitive          : 'תלוי רישיות',
        and                    : 'ו-',
        dateFormat             : 'D/M/YY',
        selectValue            : 'בחר ערך',
        selectOneOrMoreValues  : 'בחר ערך אחד או יותר',
        enterAValue            : 'הזן ערך',
        enterANumber           : 'הזן מספר',
        selectADate            : 'בחר תאריך',
        selectATime            : 'בחר שעה'
    },

    FieldFilterPickerGroup : {
        addFilter : 'הוסף פילטר',
        applyCond : applied => applied ? 'דלג על המסנן (מיושם כעת)' : 'הפעל מסנן (כרגע לא מיושם)'
    },

    DateHelper : {
        locale         : 'he',
        weekStartDay   : 0,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : 'מילי-שנייה', plural : 'מ”ש', abbrev : 'מ”ש' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'שנייה', plural : 'שניות', abbrev : 'ש' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'דקה', plural : 'דקות', abbrev : 'דקה' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'שעה', plural : 'שעות', abbrev : 'ש' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'יום', plural : 'ימים', abbrev : 'י' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'שבוע', plural : 'שבועות', abbrev : 'ש' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'חודש', plural : 'חודשים', abbrev : 'חודש' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'רבעון', plural : 'רבעונים', abbrev : 'ר' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'שנה', plural : 'שנים', abbrev : 'שנה' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'עשור', plural : 'עשורים', abbrev : 'עש' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['מיל'],
            [],
            ['ש', 'שנ'],
            [],
            ['ד', 'דק'],
            [],
            ['ש', 'שע'],
            [],
            ['י'],
            [],
            ['ש', 'שב'],
            [],
            ['חו', 'חוד', 'חודש'],
            [],
            ['ר', 'רבעון', 'רבעון'],
            [],
            ['ש', 'שנה'],
            [],
            ['עשור'],
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
            return `${year - (year % 10)}שנות ה־`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
