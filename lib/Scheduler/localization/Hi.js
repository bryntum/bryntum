import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Hi.js';
import '../../Grid/localization/Hi.js';

const locale = {

    localeName : 'Hi',
    localeDesc : 'हिन्दी',
    localeCode : 'hi',
    localeRtl  : false,

    Object : {
        newEvent    : 'नया ईवेंट',
        information : 'जानकारी',
        showDetails : 'विवरण दिखाएँ'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' ईवेंट' + (data !== 1 ? '' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'संसाधन लेआउट कॉलम टॉगल करें। संदर्भ मेनू के लिए SPACE।'
    },

    Dependencies : {
        from    : 'से',
        to      : 'तक',
        valid   : 'मान्य',
        invalid : 'अमान्य'
    },

    DependencyType : {
        SS           : 'भ-भ',
        SF           : 'त-भ',
        FS           : 'भ-त',
        FF           : 'त-त',
        StartToStart : 'आरंभ से आरंभ तक',
        StartToEnd   : 'आरंभ से अंत तक',
        EndToStart   : 'अंत से आरंभ तक',
        EndToEnd     : 'अंत से अंत तक',
        short        : [
            'भ-भ',
            'त-भ',
            'भ-त',
            'त-त'
        ],
        long : [
            'आरंभ से आरंभ तक',
            'आरंभ से अंत तक',
            'अंत से आरंभ तक',
            'अंत से अंत तक'
        ]
    },

    DependencyEdit : {
        From              : 'से',
        To                : 'तक',
        Type              : 'प्रकार',
        Lag               : 'पिछड़ाव',
        color             : 'रंग',
        lineStyle         : 'रेखा शैली',
        solid             : 'ठोस',
        dashed            : 'डैश',
        dotted            : 'डॉटेड',
        dashDot           : 'डैश-डॉट',
        longDash          : 'लंबा डैश',
        'Edit dependency' : 'निर्भरता संपादित करें',
        Save              : 'सहेजें',
        Delete            : 'हटाएं',
        Cancel            : 'रद्द करें',
        StartToStart      : 'आरंभ से आरंभ तक',
        StartToEnd        : 'आरंभ से अंत तक',
        EndToStart        : 'अंत से आरंभ तक',
        EndToEnd          : 'अंत से अंत तक',
        Active            : 'सक्रिय'
    },

    EventEdit : {
        Name           : 'नाम',
        Resource       : 'संसाधन',
        Start          : 'आरंभ',
        startTime      : 'प्रारंभ समय',
        End            : 'अंत',
        endTime        : 'समाप्ति समय',
        Save           : 'सहेजें',
        Delete         : 'हटाएं',
        Cancel         : 'रद्द करें',
        'Edit event'   : 'ईवेंट संपादित करें',
        Repeat         : 'दोहराएं',
        editRecurrence : 'आवृत्ति संपादित करें'
    },

    EventDrag : {
        eventOverlapsExisting   : 'इवेंट इस संसाधन के लिए मौजूदा ईवेंट को ओवरलैप करता है',
        noDropOutsideTimeline   : 'इवेंट को पूरी तरह से टाइमलाइन के बाहर नहीं छोड़ा जा सकता',
        duplicateAssignmentDrag : 'ईवेंट को एक ही संसाधन पर कई बार असाइन नहीं किया जा सकता'
    },

    SchedulerBase : {
        'Add event'      : 'ईवेंट जोड़ें',
        'Delete event'   : 'ईवेंट हटाएं',
        'Unassign event' : 'ईवेंट असाइनमेंट निकालें',
        color            : 'रंग',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, शुरू होता है ${startDate} ${eventRecord.duration > 0 ? `के लिए ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'ज़ूम करें',
        activeDateRange : 'तारीख की रेंज',
        startText       : 'आरंभ तारीख',
        endText         : 'समापन तारीख',
        todayText       : 'आज'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `समय अक्ष ${startDate} से ${endDate} तक दिखा रहा है`
    },

    EventCopyPaste : {
        copyEvent  : 'ईवेंट कॉपी करें',
        cutEvent   : 'ईवेंट कट करें',
        pasteEvent : 'ईवेंट पेस्ट करें'
    },

    EventFilter : {
        filterEvents : 'टास्क फिल्टर करें',
        byName       : 'नाम के आधार पर'
    },

    TimeRanges : {
        showCurrentTimeLine : 'वर्तमान टाइमलाइन दिखाएं'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'सेकंड'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd MM/DD, hA',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd MM/DD',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'दिन'
        },
        day : {
            name : 'दिन/घंटे'
        },
        week : {
            name : 'सप्ताह/घंटे'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'सप्ताह/दिन'
        },
        dayAndMonth : {
            name : 'माह'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'सप्ताह'
        },
        weekAndMonth : {
            name : 'सप्ताह'
        },
        weekAndDayLetter : {
            name : 'सप्ताह/सप्ताहांत'
        },
        weekDateAndMonth : {
            name : 'माह/सप्ताह'
        },
        monthAndYear : {
            name : 'माह'
        },
        year : {
            name : 'साल'
        },
        manyYears : {
            name : 'एकाधिक साल'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'आप एक ईवेंट हटा रहे हैं',
        'delete-all-message'        : 'क्या आप इस ईवेंट की सभी घटनाएं हटाना चाहते हैं?',
        'delete-further-message'    : 'क्या आप इसे और इस ईवेंट की भविष्य की सभी घटनाओं को हटाना चाहते हैं, या केवल चयनित ईवेंट को हटाना चाहते हैं?',
        'delete-only-this-message'  : 'क्या आप इस घटना की इस घटना को हटाना चाहते हैं?',
        'delete-further-btn-text'   : 'भविष्य के सभी ईवेंट हटाएं',
        'delete-only-this-btn-text' : 'केवल यह ईवेंट हटाएं',
        'update-title'              : 'आप एक दोहराव वाले ईवेंट को बदल रहे हैं',
        'update-all-message'        : 'क्या आप इस ईवेंट की सभी घटनाएं हटाना चाहते हैं?',
        'update-further-message'    : 'क्या आप केवल इस ईवेंट की घटना को बदलना चाहते हैं, या यह और भविष्य के सभी ईवेंट बदलना चाहते हैं?',
        'update-only-this-message'  : 'क्या आप इस घटना की इस घटना को बदलना चाहते हैं?',
        'update-further-btn-text'   : 'भविष्य के सभी ईवेंट',
        'update-only-this-btn-text' : 'केवल यह ईवेंट',
        Yes                         : 'हाँ',
        Cancel                      : 'रद्द करें',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' और ',
        Daily                           : 'दैनिक',
        'Weekly on {1}'                 : ({ days }) => `${days} पर साप्ताहिक`,
        'Monthly on {1}'                : ({ days }) => `${days} पर मासिक`,
        'Yearly on {1} of {2}'          : ({ days, months }) => ` ${months} के ${days} सलाना`,
        'Every {0} days'                : ({ interval }) => `प्रत्येक ${interval} दिनों के अंतराल पर`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `प्रत्येक ${interval} सप्ताह के अंतराल पर ${days} को`,
        'Every {0} months on {1}'       : ({ interval, days }) => `प्रत्येक ${interval} महीनो के अंतराल पर  ${days} को`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `प्रत्येक ${interval} सालों के अंतराल पर ${months} के ${days} को`,
        position1                       : 'पहला',
        position2                       : 'दूसरा',
        position3                       : 'तीसरा',
        position4                       : 'चौथा',
        position5                       : 'पांचवां',
        'position-1'                    : 'अंतिम',
        day                             : 'दिन',
        weekday                         : 'सप्ताह का दिन',
        'weekend day'                   : 'सप्ताहांत का दिन',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'ईवेंट दोहराएं',
        Cancel              : 'रद्द करें',
        Save                : 'सहेजें',
        Frequency           : 'आवृत्ति',
        Every               : 'हर',
        DAILYintervalUnit   : 'दिन',
        WEEKLYintervalUnit  : 'हफ्ता(ते)',
        MONTHLYintervalUnit : 'महीना(ने)',
        YEARLYintervalUnit  : 'साल',
        Each                : 'प्रत्येक',
        on                  : 'पर',
        the                 : 'पर',
        'On the'            : 'पर',
        'End repeat'        : 'अंत दोहराव',
        'time(s)'           : 'बार',
        Days                : 'दिन',
        Months              : 'महीने'
    },

    RecurrenceDaysCombo : {
        day           : 'दिन',
        weekday       : 'सप्ताह का दिन',
        'weekend day' : 'सप्ताहांत का दिन'
    },

    RecurrencePositionsCombo : {
        position1    : 'पहला',
        position2    : 'दूसरा',
        position3    : 'तीसरा',
        position4    : 'चौथा',
        position5    : 'पांचवां',
        'position-1' : 'अंतिम'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'कभी नहीं',
        After     : 'के बाद',
        'On date' : 'इस तारीख को'
    },

    RecurrenceFrequencyCombo : {
        None    : 'कोई दोहराव नहीं',
        Daily   : 'दैनिक',
        Weekly  : 'साप्ताहिक',
        Monthly : 'मासिक',
        Yearly  : 'वार्षिक'
    },

    RecurrenceCombo : {
        None   : 'कोई नहीं',
        Custom : 'कस्टम...'
    },

    Summary : {
        'Summary for' : date => ` ${date} का सारांश`
    },

    ScheduleRangeCombo : {
        completeview : 'पूरा शेड्यूल',
        currentview  : 'दिखने वाला शेड्यूल',
        daterange    : 'तारीख की रेंज',
        completedata : 'पूरा शेड्यूल(सभी ईवेंट के लिए)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'शेड्यूल रेंज',
        'Export from'    : 'से',
        'Export to'      : 'तक'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'एकल पृष्ठ'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'एकल पृष्ठ (अमापित)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'एकाधिक पृष्ठ (लंबवत)'
    },

    ExcelExporter : {
        'No resource assigned' : 'कोई संसाधन असाइन नहीं'
    },

    CrudManagerView : {
        serverResponseLabel : 'सर्वर प्रतिक्रिया:'
    },

    DurationColumn : {
        Duration : 'अवधि'
    },

    EventClusteringBase : {
        unnamed         : 'अनाम',
        more            : count => `+ ${count} और`,
        clusteredEvents : count => `${count} समूहित घटनाएँ`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} समूहित श्रेणियाँ`
    },

    ConstraintTypePicker : {
        none                : 'कोई नहीं',
        assoonaspossible    : 'जल्द से जल्द',
        aslateaspossible    : 'जितनी देर हो सके',
        muststarton         : 'पर शुरू होना चाहिए',
        mustfinishon        : 'पर समाप्त होना चाहिए',
        startnoearlierthan  : 'से पहले शुरू न हो',
        startnolaterthan    : 'के बाद शुरू न हो',
        finishnoearlierthan : 'से पहले समाप्त न हो',
        finishnolaterthan   : 'के बाद समाप्त न हो'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} घटना से पहले बफर समय`;
            }
            if (postamble) {
                description += `.${postamble.toString()} घटना के बाद बफर समय`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'आगे',
        Backward      : 'पीछे',
        inheritedFrom : 'वंशानुक्रम से',
        enforcedBy    : 'ज़बरदस्ती से'
    },

    CalendarField : {
        'Default calendar' : 'डिफॉल्ट कैलेन्डर',
        editCalendar       : 'कैलेंडर संपादित करें'
    },

    TaskEditorBase : {
        Information   : 'कार्य जानकारी',
        Save          : 'सहेजें',
        Cancel        : 'रद्द करें',
        Delete        : 'हटाएं',
        calculateMask : 'गणना कर रहा है...',
        saveError     : 'नहीं सहेज सकता है, कृपया पहले त्रुटियां सही करें',
        repeatingInfo : 'दोहराव वाले ईवेंट को देखना',
        editRepeating : 'संपादित करें'
    },

    TaskEdit : {
        editEvent              : 'ईवेंट संपादित करें',
        ConfirmDeletionTitle   : 'हटाने की पुष्टि करें',
        ConfirmDeletionMessage : 'क्या आप वाकई इस ईवेंट को हटाना चाहते हैं?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '34em'
    },

    SchedulerGeneralTab : {
        General      : 'सामान्य',
        Name         : 'नाम',
        Resources    : 'संसाधन',
        '% complete' : '% पूर्ण',
        Duration     : 'अवधि',
        Start        : 'शुरु करें',
        Finish       : 'समाप्त करें',
        Effort       : 'प्रयास',
        Preamble     : 'प्रस्तावना',
        Postamble    : 'समापन कथन'
    },

    GeneralTab : {
        General      : 'समान्य',
        Name         : 'नाम',
        '% complete' : '% पूर्ण',
        Duration     : 'अवधि',
        Start        : 'शुरु करें',
        Finish       : 'समाप्त करें',
        Effort       : 'प्रयास',
        Dates        : 'तारीखें'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'उन्नत',
        Calendar                   : 'कैलेन्डर',
        'Scheduling mode'          : 'शेड्यूलिंग मोड',
        'Effort driven'            : 'प्रयास चलित',
        'Manually scheduled'       : 'मैनुअल रूप से शेड्यूल',
        'Constraint type'          : 'बाधा प्रकार',
        'Constraint date'          : 'बाधा की तारीख',
        Inactive                   : 'निष्क्रिय',
        'Ignore resource calendar' : 'संसाधन कैलेंडर नजरअंदाज करें'
    },

    CalendarEditorDatePicker : {
        addException : 'अपवाद जोड़ना',
        addWeek      : 'सप्ताह जोड़ें'
    },

    CalendarEditorExceptionTab : {
        addException    : 'अपवाद जोड़ना',
        removeException : 'अपवाद निकालें',
        noRows          : 'कोई अपवाद नहीं जोड़ा गया'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'सप्ताह जोड़ें',
        removeWeek : 'सप्ताह को हटा दें'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'दिन डिफ़ॉल्ट रूप से काम कर रहे हैं',
        workingTimeCalendar        : 'कार्य समय कैलेंडर',
        exceptions                 : 'अपवाद',
        general                    : 'सामान्य',
        name                       : 'नाम',
        parent                     : 'माता-पिता',
        save                       : 'बचाना',
        weeks                      : 'हफ्तों',
        error                      : 'गलती',
        inputErrors                : 'इनपुट त्रुटियां हैं। कृपया अपने परिवर्तनों को सहेजने से पहले उन्हें ठीक करें।',
        delete                     : 'मिटाना',
        addCalendar                : 'एक कैलेंडर जोड़ें',
        confirmation               : 'पुष्टीकरण',
        removeCalendarWithChildren : 'कैलेंडर में बाल कैलेंडर हैं। अपने बच्चों के साथ कैलेंडर को हटाने के लिए "हां" पर क्लिक करें।',
        removeCalendarAndLinks     : 'कैलेंडर का उपयोग कुछ रिकॉर्ड द्वारा किया जाता है। उन्हें अनलिंक करने और कैलेंडर को हटाने के लिए "हां" पर क्लिक करें।',
        newException               : 'नया अपवाद',
        newWeek                    : 'नया सप्ताह'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' काम हो रहा',
        isNotWorking : ' काम नहीं कर रहा',
        basedOn      : ' पर आधारित:',
        byDefault    : 'डिफ़ॉल्ट रूप से',
        rangeTpl     : (start, end) => `${start} से ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'कार्य दिवस',
        nonWorkingDay : 'न्यूलिंग दिवस'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'ओवरलैपिंग रेंज हैं',
        errorMissingDate   : 'प्रारंभ और अंत समय की आवश्यकता होती है',
        errorStartAfterEnd : 'प्रारंभ समय अंत समय के बाद नहीं हो सकता है'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'नाम',
        from                                 : 'से',
        to                                   : 'को',
        is                                   : 'है',
        nonWorking                           : 'गैर कार्यरत',
        working                              : 'कार्यरत',
        hours                                : 'घंटे',
        repeat                               : 'दोहराना',
        repeatEnd                            : 'दोहराने का अंत',
        errorMissingDate                     : 'अपवाद तिथि सीमा आवश्यक है',
        errorStartAfterEnd                   : '"From" date cannot be after the "To" date ',
        errorStartAndEndRepeatNumberMismatch : 'अपवाद को समान संख्या में शुरू और समाप्त करना चाहिए'
    },

    CalendarEditorWeekPanel : {
        name        : 'नाम',
        from        : 'से',
        to          : 'को',
        days        : 'दिन',
        copyDay     : 'प्रतिलिपि दिवस',
        pasteDay    : 'पेस्ट डे',
        stopCopying : 'नकल करना बंद करो'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'जोड़ें',
        removeRange : 'निकालें सीमा'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"From" date cannot be after the "To" date ',
        errorNoDefaultWeek           : 'सप्ताह कॉन्फ़िगरेशन की आवश्यकता है',
        errorMultipleDefaultWeeks    : 'एक से अधिक डिफ़ॉल्ट सप्ताह निर्दिष्ट है',
        errorNoWeekAvailability      : 'सप्ताह को कुछ काम करने का समय प्रदान करना चाहिए',
        errorInvalidWeekAvailability : 'सप्ताह में काम का समय कॉन्फ़िगरेशन त्रुटियां हैं',
        noRows                       : 'कोई सप्ताह नहीं जोड़ा गया'
    },

    AdvancedTab : {
        Advanced                   : 'उन्नत',
        Calendar                   : 'कैलेन्डर',
        'Scheduling mode'          : 'शेड्यूलिंग मोड',
        'Effort driven'            : 'प्रयास चलित',
        'Manually scheduled'       : 'मैनुअल रूप से शेड्यूल',
        'Constraint type'          : 'बाधा प्रकार',
        'Constraint date'          : 'बाधा तारीख',
        Constraint                 : 'बाधा',
        Rollup                     : 'रोलअप करें',
        Inactive                   : 'निष्क्रिय',
        'Ignore resource calendar' : 'संसाधन कैलेंडर नजरअंदाज करें',
        'Scheduling direction'     : 'अनुसूची दिशा',
        projectBorder              : 'प्रोजेक्ट बॉर्डर',
        ignore                     : 'अनदेखा करना',
        honor                      : 'सम्मान',
        askUser                    : 'उपयोगकर्ता से पूछें'
    },

    DependencyTab : {
        Predecessors      : 'पूर्ववर्ती',
        Successors        : 'उत्तराधिकारी',
        ID                : 'ID',
        Name              : 'नाम',
        Type              : 'प्रकार',
        Lag               : 'पिछड़ाव',
        cyclicDependency  : 'चक्रीय निर्भरता',
        invalidDependency : 'अमान्य निर्भरता',
        readOnlyTask      : 'केवल-पढ़ने योग्य कार्य को लिंक नहीं किया जा सकता'
    },

    NotesTab : {
        Notes : 'नोट्स'
    },

    ResourceCalendarColumn : {
        calendar : 'पंचांग'
    },

    ResourceEdit : {
        editResource : 'संसाधन संपादित करें'
    },

    ResourceEditor : {
        resourceInformation : 'संसाधन जानकारी',
        costs               : 'लागत',
        save                : 'बचाना',
        error               : 'गलती',
        inputErrors         : 'इनपुट त्रुटियाँ हैं. कृपया अपने परिवर्तन सहेजने से पहले उन्हें ठीक करें।',
        delete              : 'मिटाना',
        confirmation        : 'पुष्टीकरण',
        removeUsedResource  : 'संसाधन को कुछ कार्यों के लिए आवंटित किया गया है। किसी भी तरह संसाधन को हटाने के लिए "हाँ" पर क्लिक करें।'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'कैलेंडर',
        general     : 'सामान्य',
        label       : 'सामग्री लेबल',
        name        : 'संसाधन का नाम',
        type        : 'प्रकार',
        costAccrual : 'लागत उपार्जन',
        labelHint   : 'उदाहरण के लिए, किग्रा, टन या बक्से',
        maxUnits    : 'अधिकतम इकाइयाँ'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'पर अर्जित करें',
        prorated : 'यथानुपात',
        start    : 'शुरू',
        end      : 'अंत'
    },

    CostAccrualField : {
        prorated : 'यथानुपात',
        start    : 'शुरू',
        end      : 'अंत'
    },

    ResourceType : {
        work     : 'काम',
        material : 'सामग्री',
        cost     : 'लागत'
    },

    ResourceTypeColumn : {
        type : 'प्रकार'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'दरें तालिका',
        newGroup     : 'नई मेज',
        removeGroup  : 'तालिका हटाएँ',
        useByDefault : 'संसाधन असाइनमेंट के लिए डिफ़ॉल्ट रूप से उपयोग करें',
        noRates      : 'कोई दर नहीं'
    },

    ResourceGrid : {
        name          : 'नाम',
        materialLabel : 'सामग्री लेबल',
        maxUnits      : 'अधिकतम इकाइयाँ',
        cost          : 'लागत',
        noRows        : 'कोई संसाधन नहीं'
    },

    ResourceRateTableContainer : {
        startDate    : 'आरंभ करने की तिथि',
        standardRate : 'मानक दर',
        perUseCost   : 'प्रति उपयोग लागत',
        addRate      : 'दर जोड़ें',
        removeRate   : 'दर हटाएँ',
        name         : 'नाम',
        noRates      : 'कोई दर नहीं'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'दर तालिका जानकारी'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'मात्रा',
        Resources   : 'संसाधन',
        Resource    : 'संसाधन',
        Units       : 'इकाइयां',
        cost        : 'लागत',
        effort      : 'कोशिश',
        start       : 'शुरू',
        finish      : 'खत्म करना',
        preamble    : 'प्रस्तावना',
        postamble   : 'उपसंहार'
    },

    RateTableColumn : {
        rateTable : 'दरें तालिका'
    },

    RecurrenceTab : {
        title : 'दोहराएं'
    },

    SchedulingModePicker : {
        Normal           : 'सामान्य',
        'Fixed Duration' : 'नियत अवधि',
        'Fixed Units'    : 'नियत इकाइयां',
        'Fixed Effort'   : 'नियत प्रयास'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{available} का {allocated}</span> आवंटित',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{available} का {allocated}</span> आवंटित',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{available} का {allocated}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{available} का {allocated}</span> आवंटित:<br>{assignments}',
        groupBarTipOnDate     : '{startDate}<br><span class="{cls}"> पर {available} का {allocated}</span> आवंटित:<br>{assignments}',
        plusMore              : '+{value} और'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">प्रयास</div><div class="b-effort-value {cls}">{allocated} में से {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">प्रयास</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">लागत</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">मात्रा</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} {startDate} पर</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">{startDate} - {endDate} के लिए सारांश</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">{startDate} के लिए सारांश</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} और',
        nameColumnText        : 'संसाधन / घटना'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'बदलाव रद्द करें और कुछ न करें',
        schedulingConflict : 'शेड्यूलिंग संघर्ष',
        emptyCalendar      : 'कैलेन्डर कॉन्फिगरेशन त्रुटि',
        cycle              : 'शेड्यूलिंग चक्र',
        Apply              : 'लागू करें'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'कृपया निर्भरता को चुनें:',
        invalidDependencyLabel : 'अमान्य निर्भरताएं शामिल हैं जिन्हें ठीक करने की जरूरत है:'
    },

    SchedulerProBase : {
        propagating     : 'प्रोजेक्ट की गणना करना',
        storePopulation : 'डेटा लोड करना',
        finalizing      : 'परिणामों को अंतिम रूप देना'
    },

    EventSegments : {
        splitEvent    : 'ईवेंट स्प्लिट करें',
        renameSegment : 'नाम बदलें'
    },

    NestedEvents : {
        createGroup         : 'चयनित ईवेंट समूहित करें',
        newGroupName        : 'नया समूह',
        deNestingNotAllowed : 'नेस्टिंग से निकलने की अनुमति नहीं है',
        nestingNotAllowed   : 'नेस्टिंग की अनुमति नहीं है'
    },

    VersionGrid : {
        compare       : 'तुलना करें',
        description   : 'विवरण',
        occurredAt    : 'घटित हुआ था',
        rename        : 'नाम बदलें',
        restore       : 'पुनः स्थापित करें',
        stopComparing : 'तुलना बंद करें'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'टास्क',
            AssignmentModel : 'असाइनमेंट',
            DependencyModel : 'लिंक',
            ProjectModel    : 'प्रोजेक्ट',
            ResourceModel   : 'संसाधन',
            other           : 'वस्तु'
        },
        entityNamesPlural : {
            TaskModel       : 'टास्क',
            AssignmentModel : 'असाइनमेंट्स',
            DependencyModel : 'लिंक्स',
            ProjectModel    : 'प्रोजेक्ट्स',
            ResourceModel   : 'संसाधन',
            other           : 'वस्तुएं'
        },
        transactionDescriptions : {
            update : '{n} {entities} बदलीं',
            add    : '{n} {entities} जोड़ी',
            remove : '{n} {entities} हटायी',
            move   : '{n} {entities} मूव की',
            mixed  : '{n} {entities} बदली'
        },
        propertyNames : {
            active                   : 'सक्रिय',
            allDay                   : 'पूरा दिन',
            allowOverlap             : 'ओवरलैप की अनुमति दें',
            barMargin                : 'बार मार्जिन',
            bidirectional            : 'द्विदिशात्मक',
            calendar                 : 'कैलेंडर',
            cls                      : 'CSS वर्ग',
            constraintDate           : 'सीमा तिथि',
            constraintType           : 'सीमा प्रकार',
            daysPerMonth             : 'प्रति माह दिन',
            daysPerWeek              : 'प्रति सप्ताह दिन',
            delayFromParent          : 'मूल से विलंब',
            direction                : 'दिशा',
            drawDependencies         : 'निर्भरता खींचें',
            duration                 : 'अवधि',
            durationUnit             : 'अवधि इकाई',
            effort                   : 'प्रयास',
            effortDriven             : 'प्रयास प्रेरित',
            effortUnit               : 'प्रयास इकाई',
            endDate                  : 'समाप्ति तिथि',
            eventColor               : 'रंग',
            eventId                  : 'इवेंट आईडी',
            eventLayout              : 'घटना लेआउट',
            eventStyle               : 'बार शैली',
            exceptionDates           : 'अपवाद तिथियाँ',
            fixed                    : 'स्थिर',
            from                     : 'से',
            fromSide                 : 'से पक्ष',
            hoursPerDay              : 'प्रति दिन घंटे',
            href                     : 'लिंक',
            iconCls                  : 'आइकन',
            id                       : 'आईडी',
            ignoreResourceCalendar   : 'संसाधन कैलेंडर को अनदेखा करें',
            ignoreTimeZone           : 'समय क्षेत्र को अनदेखा करें',
            image                    : 'छवि',
            imageUrl                 : 'छवि यूआरएल',
            inactive                 : 'निष्क्रिय',
            intervals                : 'अंतराल',
            lag                      : 'विलंब',
            lagUnit                  : 'विलंब इकाई',
            lineStyle                : 'रेखा शैली',
            manuallyScheduled        : 'मैन्युअल रूप से अनुसूचित',
            milestoneWidth           : 'मील का पत्थर चौड़ाई',
            name                     : 'नाम',
            note                     : 'नोट',
            parentId                 : 'पैरेंट आईडी',
            parentIndex              : 'स्थिति',
            percentDone              : '% पूर्ण',
            postamble                : 'पोस्टैम्बल',
            preamble                 : 'प्रस्तावना',
            readOnly                 : 'केवल पढ़ने के लिए',
            recurrenceRule           : 'पुनरावृत्ति नियम',
            resourceId               : 'संसाधन आईडी',
            resourceMargin           : 'संसाधन मार्जिन',
            rowHeight                : 'पंक्ति ऊँचाई',
            schedulingMode           : 'अनुसूची मोड',
            segments                 : 'खंड',
            showAvatar               : 'अवतार दिखाएं',
            showInTimeline           : 'समयरेखा में दिखाएं',
            startDate                : 'प्रारंभ तिथि',
            stickyContents           : 'चिपचिपा सामग्री',
            strokeColor              : 'रेखा रंग',
            style                    : 'शैली',
            target                   : 'लिंक लक्ष्य',
            to                       : 'तक',
            toSide                   : 'तक पक्ष',
            type                     : 'प्रकार',
            units                    : 'इकाइयाँ',
            unscheduled              : 'अनुसूचित नहीं',
            unspecifiedTimeIsWorking : 'अविवृत समय कार्यरत है',
            version                  : 'संस्करण'
        },
        intervals : {
            working    : 'कार्यरत',
            nonWorking : 'अकार्यरत',
            fromTo     : '{from} से {to} तक',
            recurring  : '{start} से शुरू होकर {end} पर समाप्त'
        },
        addEntity         : '{type} **{name} जोड़ा**',
        removeEntity      : '{type} **{name} हटाया**',
        updateEntity      : '{type} **{name} बदला**',
        moveEntity        : '{type} **{name}** को  {from}से {to} पर मूव किया',
        addDependency     : '**{from} से** **{to}पर  लिंक जोड़ा**',
        removeDependency  : '**{from}** से **{to}** तक लिंक हटाया',
        updateDependency  : '**{from}** से **{to}** तक लिंक संपादित किया',
        addAssignment     : '**{resource}** को **{event}** ईवेंट पर असाइन किया',
        removeAssignment  : '**{resource}** से **{event}** पर असाइनमेंट हटाया',
        updateAssignment  : '**{resource}** से **{event}** पर असाइनमेंट संपादित किया',
        noChanges         : 'कोई बदलाव नहीं',
        nullValue         : 'कोई नहीं',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : '{date} पर सहेजा गया',
        autoSavedAt       : '{date} पर स्वचालित रूप से सहेजा गया',
        undid             : 'बदलाव पूर्ववत किए',
        redid             : 'बदलाव बदले',
        editedTask        : 'टास्क गुणों को संपादित किया',
        deletedTask       : 'एक टास्क हटाया',
        movedTask         : 'एक टास्क मूव किया',
        movedTasks        : 'टास्क मूव किए'
    }
};

export default LocaleHelper.publishLocale(locale);
