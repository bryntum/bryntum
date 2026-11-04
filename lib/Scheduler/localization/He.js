import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/He.js';
import '../../Grid/localization/He.js';

const locale = {

    localeName : 'He',
    localeDesc : 'עִברִית',
    localeCode : 'he',
    localeRtl  : true,

    Object : {
        newEvent    : 'אירוע חדש',
        information : 'מידע',
        showDetails : 'הצג פרטים'
    },

    ResourceInfoColumn : {
        eventCountText : data => (data !== 1 ? 'ים' : '') + 'אירוע ' + data
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'החלף עמודת פריסת משאב. SPACE לתפריט הקשר.'
    },

    Dependencies : {
        from    : 'מ',
        to      : 'אל',
        valid   : 'חוקי',
        invalid : 'בלתי-חוקי'
    },

    DependencyType : {
        SS           : 'SS',
        SF           : 'SF',
        FS           : 'FS',
        FF           : 'FF',
        StartToStart : 'מההתחלה להתחלה',
        StartToEnd   : 'מההתחלה לסוף',
        EndToStart   : 'מהסוף להתחלה',
        EndToEnd     : 'מהסוף לסוף',
        short        : [
            'SS',
            'SF',
            'FS',
            'FF'
        ],
        long : [
            'מההתחלה להתחלה',
            'מהסוף להתחלה',
            'מהסוף להתחלה',
            'מהסוף לסוף'
        ]
    },

    DependencyEdit : {
        From              : 'מ',
        To                : 'אל',
        Type              : 'סוג',
        Lag               : 'עיכוב',
        color             : 'צבע',
        lineStyle         : 'סגנון קו',
        solid             : 'מלא',
        dashed            : 'מקווקו',
        dotted            : 'מנוקד',
        dashDot           : 'קו נקודה',
        longDash          : 'קו ארוך',
        'Edit dependency' : 'ערוך תלות',
        Save              : 'שמור',
        Delete            : 'מחוק',
        Cancel            : 'בטל',
        StartToStart      : 'מההתחלה להתחלה',
        StartToEnd        : 'מההתחלה לסוף',
        EndToStart        : 'מהסוף להתחלה',
        EndToEnd          : 'מהסוף לסוף',
        Active            : 'פעיל'
    },

    EventEdit : {
        Name           : 'שם',
        Resource       : 'משאב',
        Start          : 'התחלה',
        startTime      : 'זמן התחלה',
        End            : 'סוף',
        endTime        : 'זמן סיום',
        Save           : 'שמור',
        Delete         : 'מחוק',
        Cancel         : 'בטלl',
        'Edit event'   : 'ערוך אירוע',
        Repeat         : 'חזור',
        editRecurrence : 'ערוך חזרתיות'
    },

    EventDrag : {
        eventOverlapsExisting   : 'האירוע חופף לאירוע קיים במשאב זה',
        noDropOutsideTimeline   : 'לא ניתן לסלק את האירוע לחלוטין אל מחוץ לקו הזמן',
        duplicateAssignmentDrag : 'לא ניתן להקצות אירוע לאותו משאב מספר פעמים'
    },

    SchedulerBase : {
        'Add event'      : 'הוספת אירוע',
        'Delete event'   : 'מחיקת אירוע',
        'Unassign event' : 'בטל הקצאת אירוע',
        color            : 'צבע',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, מתחיל ב- ${startDate} ${eventRecord.duration > 0 ? `למשך ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'זום',
        activeDateRange : 'טווח תאריכים',
        startText       : 'תאריך התחלה',
        endText         : 'תאריך סיום',
        todayText       : 'היום'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `ציר הזמן מציג מ-${startDate} עד ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'העתק אירוע',
        cutEvent   : 'גזור אירוע',
        pasteEvent : 'הדבק אירוע'
    },

    EventFilter : {
        filterEvents : 'סינון משימות',
        byName       : 'עפ”י שם'
    },

    TimeRanges : {
        showCurrentTimeLine : 'הצג את קו הזמן הנוכחי'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'שניות'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD/MM, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD/MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'יום'
        },
        day : {
            name : 'יום/שעות'
        },
        week : {
            name : 'שבוע/שעות'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'שבוע/ימים'
        },
        dayAndMonth : {
            name : 'חודש'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'שבוע'
        },
        weekAndMonth : {
            name : 'שבועות'
        },
        weekAndDayLetter : {
            name : 'שבועות/ימי השבוע'
        },
        weekDateAndMonth : {
            name : 'חודשים/שבועות'
        },
        monthAndYear : {
            name : 'חודשים'
        },
        year : {
            name : 'שנים'
        },
        manyYears : {
            name : 'מספר שנים'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'הנך מוחק/ת כעת אירוע',
        'delete-all-message'        : '?האם ברצונך למחוק את כל המופעים של אירוע זה',
        'delete-further-message'    : '?האם ברצונך למחוק מופע זה וכל המופעים העתידיים של אירוע זה, או רק את המופע הנבחר',
        'delete-only-this-message'  : 'האם ברצונך למחוק את האירוע הזה?',
        'delete-further-btn-text'   : 'מחוק את כל האירועים העתידיים',
        'delete-only-this-btn-text' : 'מחק רק את האירוע הזה',
        'update-title'              : 'הנך משנה כעת אירוע חוזר',
        'update-all-message'        : '?האם ברצונך לשנות את כל המופעים של אירוע זה',
        'update-further-message'    : '?האם ברצונך לשנות רק את המופע הזה של האירוע, או גם את המופע הזה וגם מופעים עתידיים',
        'update-only-this-message'  : 'האם ברצונך לשנות את האירוע הזה?',
        'update-further-btn-text'   : 'כל האירועים העתידיים',
        'update-only-this-btn-text' : 'רק את האירוע הזה',
        Yes                         : 'כן',
        Cancel                      : 'בטל',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' וגם ',
        Daily                           : 'יומי',
        'Weekly on {1}'                 : ({ days }) => `${days}-מדי שבוע ב`,
        'Monthly on {1}'                : ({ days }) => `${days}-מדי חודש ב`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `${months} מתוך ${days}-מדי שנה ב`,
        'Every {0} days'                : ({ interval }) => `ימים ${interval} מדי`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `${days} שבועות מדי ${interval}-ב`,
        'Every {0} months on {1}'       : ({ interval, days }) => `${days} חודשים מדי ${interval}-ב`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `מתוך ${months} מדי ${days}-שנים ב ${interval}-ב`,
        position1                       : 'הראשון',
        position2                       : 'השני',
        position3                       : 'השלישי',
        position4                       : 'הרביעי',
        position5                       : 'החמישי',
        'position-1'                    : 'האחרון',
        day                             : 'יום',
        weekday                         : 'היום בשבוע',
        'weekend day'                   : 'היום בסופ”ש',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'אירוע חוזר',
        Cancel              : 'בטל',
        Save                : 'שמור',
        Frequency           : 'תדירות',
        Every               : 'מדי',
        DAILYintervalUnit   : 'יום/ימים',
        WEEKLYintervalUnit  : 'שבוע/שבועות',
        MONTHLYintervalUnit : 'חודש/ים',
        YEARLYintervalUnit  : 'שנה/שנים',
        Each                : 'כל',
        on                  : '-ב',
        the                 : '-ב',
        'On the'            : '-ב',
        'End repeat'        : 'סוף החזרה',
        'time(s)'           : 'פעם/פעמים',
        Days                : 'ימים',
        Months              : 'חודשים'
    },

    RecurrenceDaysCombo : {
        day           : 'יום',
        weekday       : 'היום בשבוע',
        'weekend day' : 'היום בסופ”ש'
    },

    RecurrencePositionsCombo : {
        position1    : 'ראשון',
        position2    : 'שני',
        position3    : 'שלישי',
        position4    : 'רביעי',
        position5    : 'חמישי',
        'position-1' : 'אחרון'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'לעולם לא',
        After     : 'לאחר',
        'On date' : 'בתאריך'
    },

    RecurrenceFrequencyCombo : {
        None    : 'ללא חזרה',
        Daily   : 'מדי יום',
        Weekly  : 'מדי שבוע',
        Monthly : 'מדי חודש',
        Yearly  : 'מדי שנה'
    },

    RecurrenceCombo : {
        None   : 'אין',
        Custom : '...מותאם אישית'
    },

    Summary : {
        'Summary for' : date => `${date} סיכום עבור`
    },

    ScheduleRangeCombo : {
        completeview : 'לו”ז מלא',
        currentview  : 'לו”ז נראה לעין',
        daterange    : 'טווח תאריכים',
        completedata : 'הלו”ז המלא (לכל האירועים)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'טווח לו”ז',
        'Export from'    : 'מ',
        'Export to'      : 'אל'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'עמוד יחיד'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'עמוד יחיד (ללא שינוי קנה מידה)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'דפים מרובים (אנכי)'
    },

    ExcelExporter : {
        'No resource assigned' : 'לא הוקצה שום משאב'
    },

    CrudManagerView : {
        serverResponseLabel : ':תגובת השרת'
    },

    DurationColumn : {
        Duration : 'משך'
    },

    EventClusteringBase : {
        unnamed         : 'ללא שם',
        more            : count => `+ ${count} נוספים`,
        clusteredEvents : count => `${count} אירועים מקובצים`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} טווחים מקובצים`
    },

    ConstraintTypePicker : {
        none                : 'אין',
        assoonaspossible    : 'בהקדם האפשרי',
        aslateaspossible    : 'בהקדם האפשרי',
        muststarton         : 'חייב להתחיל ב',
        mustfinishon        : 'חייב להסתיים ב',
        startnoearlierthan  : 'התחל לא לפני',
        startnolaterthan    : 'התחל לא יאוחר מ',
        finishnoearlierthan : 'סיים לא לפני',
        finishnolaterthan   : 'סיים לא יאוחר מ'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} זמן חיץ לפני האירוע`;
            }
            if (postamble) {
                description += `.${postamble.toString()} זמן חיץ אחרי האירוע`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'קדימה',
        Backward      : 'אחורה',
        inheritedFrom : 'מורש מ',
        enforcedBy    : 'מוטל בכוח על ידי'
    },

    CalendarField : {
        'Default calendar' : 'לוח שנה ברירת מחדל',
        editCalendar       : 'ערוך לוח שנה'
    },

    TaskEditorBase : {
        Information   : 'מידע על משימה',
        Save          : 'שמור',
        Cancel        : 'בטל',
        Delete        : 'מחוק',
        calculateMask : '...חישוב',
        saveError     : 'לא ניתן לשמור, אנא תקן לפני כן את השגיאות',
        repeatingInfo : 'צופה באירוע חוזר',
        editRepeating : 'עריכה'
    },

    TaskEdit : {
        editEvent              : 'ערוך אירוע',
        ConfirmDeletionTitle   : 'אשר מחיקה',
        ConfirmDeletionMessage : '?האם הנך בטוח/ה שברצונך למחוק את האירוע'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '33em'
    },

    SchedulerGeneralTab : {
        General      : 'כללי',
        Name         : 'שם',
        Resources    : 'משאבים',
        '% complete' : '% הושלם',
        Duration     : 'משך',
        Start        : 'התחלה',
        Finish       : 'סוף',
        Effort       : 'מאמץ',
        Preamble     : 'מבוא',
        Postamble    : 'אחרית'
    },

    GeneralTab : {
        General      : 'כללי',
        Name         : 'שם',
        '% complete' : '% הושלם',
        Duration     : 'משך',
        Start        : 'התחל',
        Finish       : 'סוף',
        Effort       : 'מאמץ',
        Dates        : 'תאריכים'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'מתקדם',
        Calendar                   : 'לוח שנה',
        'Scheduling mode'          : 'מצב תזמון',
        'Effort driven'            : 'מונע מאמץ',
        'Manually scheduled'       : 'מתוזמן ידנית',
        'Constraint type'          : 'סוג אילוץ',
        'Constraint date'          : 'תאריך אילוץ',
        Inactive                   : 'בלתי-פעיל',
        'Ignore resource calendar' : 'התעלם מלוח משאבים'
    },

    CalendarEditorDatePicker : {
        addException : 'הוסף חריג',
        addWeek      : 'הוסף שבוע'
    },

    CalendarEditorExceptionTab : {
        addException    : 'הוסף חריג',
        removeException : 'הסר חריג',
        noRows          : 'אין חריגים שנוספו'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'הוסף שבוע',
        removeWeek : 'הסר את השבוע'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'הימים עובדים כברירת מחדל',
        workingTimeCalendar        : 'לוח שנה עבודה',
        exceptions                 : 'חריגים',
        general                    : 'כללי',
        name                       : 'שֵׁם',
        parent                     : 'הוֹרֶה',
        save                       : 'להציל',
        weeks                      : 'שבועות',
        error                      : 'שְׁגִיאָה',
        inputErrors                : 'יש שגיאות קלט. אנא תקן אותם לפני שתשמור את השינויים שלך.',
        delete                     : 'לִמְחוֹק',
        addCalendar                : 'הוסף לוח שנה',
        confirmation               : 'אִשׁוּר',
        removeCalendarWithChildren : 'בלוח השנה יש לוחות שנה לילדים. לחץ על "כן" כדי להסיר את לוח השנה עם ילדיו.',
        removeCalendarAndLinks     : 'לוח השנה משמש רשומות מסוימות. לחץ על "כן" כדי לבטל את קישורם ולהסיר את לוח השנה.',
        newException               : 'חריג חדש',
        newWeek                    : 'שבוע חדש'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' עובד',
        isNotWorking : ' לא עובד',
        basedOn      : ' מבוסס על:',
        byDefault    : 'כברירת מחדל',
        rangeTpl     : (start, end) => `${start} עד ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'יום עבודה',
        nonWorkingDay : 'יום לא עובד'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'יש טווחים חופפים',
        errorMissingDate   : 'זמן התחלה וסיום נדרש',
        errorStartAfterEnd : 'זמן ההתחלה לא יכול להיות לאחר זמן הסיום'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'שֵׁם',
        from                                 : 'מ',
        to                                   : 'ל',
        is                                   : 'הוא',
        nonWorking                           : 'לא עובד',
        working                              : 'עובד',
        hours                                : 'שעה (ות',
        repeat                               : 'חזור',
        repeatEnd                            : 'חזור על סוף',
        errorMissingDate                     : 'נדרש טווח תאריך חריג',
        errorStartAfterEnd                   : '"From" date cannot be after the "To" date ',
        errorStartAndEndRepeatNumberMismatch : 'החריג צריך להתחיל ולסיים את אותו מספר הפעמים'
    },

    CalendarEditorWeekPanel : {
        name        : 'שֵׁם',
        from        : 'מ',
        to          : 'ל',
        days        : 'ימים',
        copyDay     : 'יום העתק',
        pasteDay    : 'הדבק יום',
        stopCopying : 'תפסיק להעתיק'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'הוסף טווח',
        removeRange : 'הסר את הטווח'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"From" date cannot be after the "To" date ',
        errorNoDefaultWeek           : 'נדרשת תצורת שבוע',
        errorMultipleDefaultWeeks    : 'מוגדר יותר משבוע ברירת מחדל',
        errorNoWeekAvailability      : 'השבוע חייב לספק זמן עבודה',
        errorInvalidWeekAvailability : 'בשבוע יש שגיאות תצורת זמן עבודה',
        noRows                       : 'אין שבועות שנוספו'
    },

    AdvancedTab : {
        Advanced                   : 'מתקדם',
        Calendar                   : 'לוח שנה',
        'Scheduling mode'          : 'מצב תזמון',
        'Effort driven'            : 'מונע מאמץ',
        'Manually scheduled'       : 'מתוזמן ידנית',
        'Constraint type'          : 'סוף אילוץ',
        'Constraint date'          : 'תאריך אילוץ',
        Constraint                 : 'אילוץ',
        Rollup                     : 'גלילה מעלה',
        Inactive                   : 'בלתי-פעיל',
        'Ignore resource calendar' : 'התעלם מלוח משאבים',
        'Scheduling direction'     : 'כיוון תזמון',
        projectBorder              : 'פרויקט גבול',
        ignore                     : 'להתעלם',
        honor                      : 'כָּבוֹד',
        askUser                    : 'שאל את המשתמש'
    },

    DependencyTab : {
        Predecessors      : 'אירועים קודמים',
        Successors        : 'אירועים יורשים',
        ID                : 'מזהה',
        Name              : 'שם',
        Type              : 'סוג',
        Lag               : 'עיכוב',
        cyclicDependency  : 'תלות ציקלית',
        invalidDependency : 'תלות בלתי-חוקית',
        readOnlyTask      : 'לא ניתן לקשר משימה לקריאה בלבד'
    },

    NotesTab : {
        Notes : 'הערות'
    },

    ResourceCalendarColumn : {
        calendar : 'לוּחַ שָׁנָה'
    },

    ResourceEdit : {
        editResource : 'ערוך משאב'
    },

    ResourceEditor : {
        resourceInformation : 'מידע על משאבים',
        costs               : 'עלויות',
        save                : 'לְהַצִיל',
        error               : 'שְׁגִיאָה',
        inputErrors         : 'יש שגיאות קלט. אנא תקן אותם לפני שמירת השינויים שלך.',
        delete              : 'לִמְחוֹק',
        confirmation        : 'אִשׁוּר',
        removeUsedResource  : 'המשאב מוקצה למשימות מסוימות. לחץ על "כן" כדי להסיר את המשאב בכל זאת.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'לוּחַ שָׁנָה',
        general     : 'כְּלָלִי',
        label       : 'תווית חומר',
        name        : 'שם המשאב',
        type        : 'סוּג',
        costAccrual : 'צבירת עלויות',
        labelHint   : 'לדוגמה, ק"ג, טון או קופסאות',
        maxUnits    : 'מספר יחידות מרבי'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'לצבור ב',
        prorated : 'יחסית',
        start    : 'הַתחָלָה',
        end      : 'סוֹף'
    },

    CostAccrualField : {
        prorated : 'יחסית',
        start    : 'הַתחָלָה',
        end      : 'סוֹף'
    },

    ResourceType : {
        work     : 'עֲבוֹדָה',
        material : 'חוֹמֶר',
        cost     : 'עֲלוּת'
    },

    ResourceTypeColumn : {
        type : 'סוּג'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'טבלת תעריפים',
        newGroup     : 'שולחן חדש',
        removeGroup  : 'הסר את הטבלה',
        useByDefault : 'השתמש כברירת מחדל עבור הקצאות המשאבים',
        noRates      : 'אין תעריפים'
    },

    ResourceGrid : {
        name          : 'שֵׁם',
        materialLabel : 'תווית חומר',
        maxUnits      : 'מקסימום יחידות',
        cost          : 'עֲלוּת',
        noRows        : 'אין משאבים'
    },

    ResourceRateTableContainer : {
        startDate    : 'תאריך התחלה',
        standardRate : 'תעריף סטנדרטי',
        perUseCost   : 'עלות לכל שימוש',
        addRate      : 'הוסף שיעור',
        removeRate   : 'הסר שיעור',
        name         : 'שֵׁם',
        noRates      : 'אין תעריפים'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'מידע על טבלת תעריפים'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'כַּמוּת',
        Resources   : 'משאבים',
        Resource    : 'משאב',
        Units       : 'יחידות',
        cost        : 'עֲלוּת',
        effort      : 'מַאֲמָץ',
        start       : 'הַתחָלָה',
        finish      : 'סִיוּם',
        preamble    : 'פתיח',
        postamble   : 'סיום'
    },

    RateTableColumn : {
        rateTable : 'טבלת תעריפים'
    },

    RecurrenceTab : {
        title : 'חזרה'
    },

    SchedulingModePicker : {
        Normal           : 'נורמלי',
        'Fixed Duration' : 'משך קבוע',
        'Fixed Units'    : 'יחידות קבועות',
        'Fixed Effort'   : 'מאמץ קבוע'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} מתוך {available}</span> הוקצו',
        barTipOnDate          : '<b>{resource}</b> ב {startDate}<br><span class="{cls}">{allocated} מתוך {available}</span> הוקצו',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} מתוך {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} מתוך {available}</span> הוקצו:<br>{assignments}',
        groupBarTipOnDate     : 'ב {startDate}<br><span class="{cls}">{allocated} מתוך {available}</span> הוקצו:<br>{assignments}',
        plusMore              : '+{value} יותר'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">מַאֲמָץ</div><div class="b-effort-value {cls}">{allocated} מתוך {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">מַאֲמָץ</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">עֲלוּת</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">כַּמוּת</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} ב-{startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">סיכום עבור {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">סיכום עבור {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} נוספים',
        nameColumnText        : 'משאב / אירוע'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'בטל את השינוי ואל תבצע שום פעולה',
        schedulingConflict : 'קונפליקט תזמון',
        emptyCalendar      : 'שגיאה בקביעת תצורת לוח שנה',
        cycle              : 'מחזור תזמון',
        Apply              : 'החל'
    },

    CycleResolutionPopup : {
        dependencyLabel        : ':אנא בחר תלות',
        invalidDependencyLabel : ':ישנה מעורבות/נוכחות של תלויות בלתי-חוקיות שיש לטפל בהן'
    },

    SchedulerProBase : {
        propagating     : 'מחשב פרויקט',
        storePopulation : 'טוען נתונים',
        finalizing      : 'משלים תוצאות'
    },

    EventSegments : {
        splitEvent    : 'פיצול אירוע',
        renameSegment : 'שינוי שם'
    },

    NestedEvents : {
        createGroup         : 'קבץ אירועים נבחרים',
        newGroupName        : 'קבוצה חדשה',
        deNestingNotAllowed : 'ביטול קינון אינו מותר',
        nestingNotAllowed   : 'קינון אינו מותר'
    },

    VersionGrid : {
        compare       : 'השווה',
        description   : 'תיאור',
        occurredAt    : 'קרה בתאריך',
        rename        : 'שינוי שם',
        restore       : 'שחזר',
        stopComparing : 'הפסק השוואה'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'משימה',
            AssignmentModel : 'הקצאה',
            DependencyModel : 'קישור',
            ProjectModel    : 'פרויקט',
            ResourceModel   : 'משאב',
            other           : 'אוביקט'
        },
        entityNamesPlural : {
            TaskModel       : 'משימות',
            AssignmentModel : 'הקצאות',
            DependencyModel : 'קישורים',
            ProjectModel    : 'פרויקטים',
            ResourceModel   : 'משאבים',
            other           : 'אוביקטים'
        },
        transactionDescriptions : {
            update : 'שונו {n} ‏{entities}',
            add    : 'הוספו {n} ‏{entities}',
            remove : 'הוסרו {n} ‏{entities}',
            move   : 'הועברו {n} ‏{entities}',
            mixed  : 'שונו {n} ‏{entities}'
        },
        propertyNames : {
            active                   : 'פעיל',
            allDay                   : 'כל היום',
            allowOverlap             : 'אפשר חפיפה',
            barMargin                : 'שולי בר',
            bidirectional            : 'דו-כיווני',
            calendar                 : 'לוח שנה',
            cls                      : 'מחלקת CSS',
            constraintDate           : 'תאריך מגבלה',
            constraintType           : 'סוג מגבלה',
            daysPerMonth             : 'ימים לחודש',
            daysPerWeek              : 'ימים לשבוע',
            delayFromParent          : 'עיכוב מהורה',
            direction                : 'כיוון',
            drawDependencies         : 'צייר תלות',
            duration                 : 'משך זמן',
            durationUnit             : 'יחידת משך זמן',
            effort                   : 'מאמץ',
            effortDriven             : 'מונע מאמץ',
            effortUnit               : 'יחידת מאמץ',
            endDate                  : 'תאריך סיום',
            eventColor               : 'צבע',
            eventId                  : 'מזהה אירוע',
            eventLayout              : 'פריסת אירוע',
            eventStyle               : 'סגנון בר',
            exceptionDates           : 'תאריכי חריגה',
            fixed                    : 'קבוע',
            from                     : 'מ',
            fromSide                 : 'מצד',
            hoursPerDay              : 'שעות ליום',
            href                     : 'קישור',
            iconCls                  : 'אייקון',
            id                       : 'מזהה',
            ignoreResourceCalendar   : 'התעלם מלוח משאבים',
            ignoreTimeZone           : 'התעלם מאזור זמן',
            image                    : 'תמונה',
            imageUrl                 : 'כתובת תמונה',
            inactive                 : 'לא פעיל',
            intervals                : 'מרווחים',
            lag                      : 'פיגור',
            lagUnit                  : 'יחידת פיגור',
            lineStyle                : 'סגנון קו',
            manuallyScheduled        : 'מתוזמן ידנית',
            milestoneWidth           : 'רוחב אבן דרך',
            name                     : 'שם',
            note                     : 'הערה',
            parentId                 : 'מזהה אב',
            parentIndex              : 'מיקום',
            percentDone              : '% הושלם',
            postamble                : 'פוסטמבל',
            preamble                 : 'פרמבל',
            readOnly                 : 'קריאה בלבד',
            recurrenceRule           : 'כלל חזרה',
            resourceId               : 'מזהה משאב',
            resourceMargin           : 'שולי משאב',
            rowHeight                : 'גובה שורה',
            schedulingMode           : 'מצב תזמון',
            segments                 : 'קטעים',
            showAvatar               : 'הצג אווטאר',
            showInTimeline           : 'הצג בציר זמן',
            startDate                : 'תאריך התחלה',
            stickyContents           : 'תוכן דביק',
            strokeColor              : 'צבע קו',
            style                    : 'סגנון',
            target                   : 'יעד קישור',
            to                       : 'אל',
            toSide                   : 'אל צד',
            type                     : 'סוג',
            units                    : 'יחידות',
            unscheduled              : 'לא מתוזמן',
            unspecifiedTimeIsWorking : 'זמן לא מוגדר הוא עבודה',
            version                  : 'גרסה'
        },
        intervals : {
            working    : 'עובד',
            nonWorking : 'לא עובד',
            fromTo     : 'מ-{from} עד {to}',
            recurring  : 'חוזר החל מ-{start} עד {end}'
        },
        addEntity         : 'התווסף {type} **{name}**',
        removeEntity      : 'הוסר {type} **{name}**',
        updateEntity      : 'שונה {type} **{name}**',
        moveEntity        : 'הועבר {type} **{name}** מ- {from} ל- {to}',
        addDependency     : 'התווסף קישור מ- **{from}** ל- **{to}**',
        removeDependency  : 'הוסר קישור מ- **{from}** ל- **{to}**',
        updateDependency  : 'נערך קישור מ- **{from}** ל- **{to}**',
        addAssignment     : 'הוקצה **{resource}** ל- **{event}**',
        removeAssignment  : 'הוסרה הקצאת **{resource}** מ- **{event}**',
        updateAssignment  : 'נערכה הקצאת **{resource}**  ל-  **{event}**',
        noChanges         : 'אין שינויים',
        nullValue         : 'אין',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'נשמר ב-{date}',
        autoSavedAt       : 'נשמר אוטומטית ב-{date}',
        undid             : 'שינויים בוטלו',
        redid             : 'שינויים בוצעו מחדש',
        editedTask        : 'תכונות משימה נערכו',
        deletedTask       : 'משימה נמחקה',
        movedTask         : 'משימה הוזזה',
        movedTasks        : 'משימות הוזזו'
    }
};

export default LocaleHelper.publishLocale(locale);
