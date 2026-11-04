import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'En',
    localeDesc : 'English (US)',
    localeCode : 'en-US',
    localeRtl  : false,

    Object : {
        Yes      : 'Yes',
        No       : 'No',
        Cancel   : 'Cancel',
        Ok       : 'OK',
        Week     : 'Week',
        None     : 'None',
        previous : 'Previous',
        next     : 'Next',
        to       : 'to',
        at       : 'At',
        on       : 'On',
        editing  : what => `Editing ${what}`,
        settings : 'Settings',
        close    : 'Close',
        go       : 'Go',
        save     : 'Save',
        cancel   : 'Cancel',
        revert   : 'Revert',
        collapse : 'Collapse',
        expand   : 'Expand',
        today    : 'Today',
        andNMore : n => `and ${n} more`
    },

    AIBase : {
        delayStatusTexts : [
            'Waiting',
            'Waiting ...',
            'Still waiting',
            'Still waiting ...'
        ],
        autoStartDialogMessage        : 'Do you want to enable AI voice activation?',
        voiceActivationToast          : phrase => `Voice activation enabled, use the phrase "${phrase}" to start a conversation`,
        voiceControlNotSupportedToast : 'Voice control is not supported on this device',
        voiceControlErrorToast        : 'Voice control could not be started on your device',
        voiceControlSilenceToast      : phrase => `AI voice conversation ended due to silence. Use the phrase ${phrase} to restart the conversation`,
        noAudioDetected               : 'No audio detected, please try again',
        transcriptionErrorToast       : 'Transcription failed, please try again',
        playbackErrorToast            : 'Audio playback failed, please check your audio output device',
        failed                        : '(failed)',
        awaitingConfirmation          : 'Awaiting confirmation',
        timeoutToast                  : 'Message timed out',
        readingStatusText             : modelName => `Reading ${modelName}s`,
        updatingStatusText            : modelName => `Updating ${modelName}s`,
        removingStatusText            : modelName => `Removing ${modelName}s`,
        addingStatusText              : modelName => `Adding ${modelName}`,
        filteringStatusText           : modelName => `Filtering ${modelName}s`,
        thinkingStatusText            : 'Thinking',
        processingStatusText          : 'Processing'
    },

    AISettingsPanel : {
        highlight               : 'Highlight',
        verbosity               : 'Verbosity',
        voiceActivation         : 'Voice Activation',
        enableVoiceActivation   : 'Enable voice activation',
        voiceOnly               : 'Voice Only',
        autostart               : 'Autostart',
        dataChangeConfirmations : 'Data Change Confirmation',
        add                     : 'Add',
        remove                  : 'Remove',
        update                  : 'Update',
        planning                : 'Planning',
        enablePlanning          : 'Enable planning',
        aiModel                 : 'AI Model',
        timeline                : 'Timeline',
        'in-view'               : 'In view',
        all                     : 'All',
        timeRangeContext        : 'Time range context'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI is speaking',
        recordingTooltip      : 'Recording',
        waitingTooltip        : 'AI thinking',
        startRecordingTooltip : 'Click to start',
        stopRecordingTooltip  : 'Click to stop',
        inactiveTooltip       : 'Not recording',
        openChatTooltip       : 'Right click to open chat'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Type a message',
        noConnectionTooltip     : 'No connection detected, click to try again',
        undone                  : 'undone',
        aborted                 : '(aborted)',
        readAloudTooltip        : 'Read message aloud',
        confidenceTooltip       : confidence => `Confidence: ${confidence}%`,
        undoTooltip             : 'Undo data changes',
        redoTooltip             : 'Redo data changes',
        thumbsUp                : 'Thumbs up',
        thumbsDown              : 'Thumbs down',
        feedbackToast           : 'Thank you for your feedback!',
        clearChat               : 'Clear chat',
        closeChat               : 'Close chat',
        settings                : 'Settings',
        closeSettings           : 'Close settings'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Select exactly ${min}`,
        tooFewOptionsSelected     : min => `Select at least ${min}`,
        tooManyOptionsSelected    : max => `Select no more than ${max}`
    },

    CodeEditor : {
        apply        : 'Apply',
        autoApply    : 'Auto apply',
        downloadCode : 'Download code'
    },

    ColorPicker : {
        noColor : 'No color'
    },

    Combo : {
        noResults          : 'No results',
        recordNotCommitted : 'Record could not be added',
        addNewValue        : value => `Add ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Highlight',
        preview         : 'Preview',
        approve         : 'Approve',
        reject          : 'Reject',
        confirmAdd      : 'Confirm add:',
        confirmUpdate   : 'Confirm update:',
        confirmRemove   : 'Confirm remove:',
        confirmCopy     : 'Confirm copy',
        confirmAssign   : 'Confirm assignment',
        confirmReassign : 'Confirm re-assignment',
        confirmUnassign : 'Confirm unassignment',
        confirmLink     : 'Confirm link',
        confirmUnlink   : 'Confirm unlink'
    },

    FilePicker : {
        file : 'File'
    },

    Field : {
        badInput              : 'Invalid field value',
        patternMismatch       : 'Value should match a specific pattern',
        rangeOverflow         : value => `Value must be less than or equal to ${value.max}`,
        rangeUnderflow        : value => `Value must be greater than or equal to ${value.min}`,
        stepMismatch          : 'Value should fit the step',
        tooLong               : 'Value should be shorter',
        tooShort              : 'Value should be longer',
        typeMismatch          : 'Value is required to be in a special format',
        valueMissing          : 'This field is required',
        invalidValue          : 'Invalid field value',
        minimumValueViolation : 'Minimum value violation',
        maximumValueViolation : 'Maximum value violation',
        fieldRequired         : 'This field is required',
        validateFilter        : 'Value must be selected from the list'
    },

    DateField : {
        invalidDate : format => 'Invalid date input, expected format is ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Go to previous year',
        gotoPrevMonth : 'Go to previous month',
        gotoNextMonth : 'Go to next month',
        gotoNextYear  : 'Go to next year',
        navigation    : 'Date picker navigation'
    },

    Hint : {
        dontShowAgain : "Don't show again"
    },

    NumberFormat : {
        locale   : 'en-US',
        currency : 'USD'
    },

    DurationField : {
        invalidUnit : 'Invalid unit'
    },

    TimeField : {
        invalidTime : 'Invalid time input'
    },

    TimePicker : {
        hour   : 'Hour',
        minute : 'Minute',
        second : 'Second'
    },

    Tooltip : {
        loading : 'Loading...'
    },

    List : {
        loading   : 'Loading...',
        selectAll : 'Select All'
    },

    GridBase : {
        loadMask : 'Loading...',
        syncMask : 'Saving changes, please wait...'
    },

    PagingToolbar : {
        firstPage         : 'Go to first page',
        prevPage          : 'Go to previous page',
        page              : 'Page',
        nextPage          : 'Go to next page',
        lastPage          : 'Go to last page',
        reload            : 'Reload current page',
        noRecords         : 'No records to display',
        pageCountTemplate : data => `of ${data.lastPage}`,
        summaryTemplate   : data => `Displaying records ${data.start} - ${data.end} of ${data.allCount}`
    },

    Popup : {
        close    : 'Close',
        maximize : 'Maximize'
    },

    Splitter : {
        ariaLabel      : 'Splitter, use the arrow keys to resize the neighboring panels',
        collapseLeft   : 'Collapse left panel',
        collapseRight  : 'Collapse right panel',
        collapseTop    : 'Collapse top panel',
        collapseBottom : 'Collapse bottom panel',
        expandLeft     : 'Expand left panel',
        expandRight    : 'Expand right panel',
        expandTop      : 'Expand top panel',
        expandBottom   : 'Expand bottom panel'
    },

    TabPanel : {
        containsInvalidFields : 'Tab contains invalid fields'
    },

    Toolbar : {
        showOverflowingItems : 'Show overflowing items',
        scrollForMore        : 'Scroll for more'
    },

    UndoRedo : {
        Undo           : 'Undo',
        Redo           : 'Redo',
        UndoLastAction : 'Undo last action',
        RedoLastAction : 'Redo last undone action',
        NoActions      : 'No items in the undo queue'
    },

    FieldFilterPicker : {
        equals                 : 'equals',
        doesNotEqual           : 'does not equal',
        isEmpty                : 'empty',
        isNotEmpty             : 'not empty',
        contains               : 'contains',
        doesNotContain         : 'does not contain',
        startsWith             : 'starts with',
        endsWith               : 'ends with',
        isOneOf                : 'one of',
        isNotOneOf             : 'not one of',
        isGreaterThan          : 'greater than',
        isLessThan             : 'less than',
        isGreaterThanOrEqualTo : 'greater or equals',
        isLessThanOrEqualTo    : 'less or equals',
        isBetween              : 'between',
        isNotBetween           : 'not between',
        isBefore               : 'before',
        isAfter                : 'after',
        timeEquals             : 'time equals',
        timeDoesNotEqual       : 'time does not equal',
        isToday                : 'today',
        isTomorrow             : 'tomorrow',
        isYesterday            : 'yesterday',
        isThisWeek             : 'this week',
        isNextWeek             : 'next week',
        isLastWeek             : 'last week',
        isThisMonth            : 'this month',
        isNextMonth            : 'next month',
        isLastMonth            : 'last month',
        isThisYear             : 'this year',
        isNextYear             : 'next year',
        isLastYear             : 'last year',
        isYearToDate           : 'year to date',
        isTrue                 : 'true',
        isFalse                : 'false',
        selectAProperty        : 'Select property',
        selectAnOperator       : 'Select operator',
        caseSensitive          : 'Case-sensitive',
        and                    : 'and',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Select value',
        selectOneOrMoreValues  : 'Select value(s)',
        enterAValue            : 'Enter value',
        enterANumber           : 'Enter number',
        selectADate            : 'Select date',
        selectATime            : 'Select time'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Add filter',
        applyCond : applied => applied ? 'Skip filter (currently applied)' : 'Apply filter (currently skipped)'
    },

    DateHelper : {
        locale         : 'en-US',
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
            { single : 'millisecond', plural : 'ms', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'second', plural : 'seconds', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minute', plural : 'minutes', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'hour', plural : 'hours', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'day', plural : 'days', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'week', plural : 'weeks', abbrev : 'w' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'month', plural : 'months', abbrev : 'mon' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'quarter', plural : 'quarters', abbrev : 'q' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'year', plural : 'years', abbrev : 'yr' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'decade', plural : 'decades', abbrev : 'dec' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil'],
            ['emil'],
            ['s', 'sec'],
            ['es', 'esec'],
            ['m', 'min'],
            ['em', 'emin'],
            ['h', 'hr'],
            ['eh', 'ehr'],
            ['d'],
            ['ed'],
            ['w', 'wk'],
            ['ew', 'ewk'],
            ['mo', 'mon', 'mnt', 'M'],
            ['emo', 'emon', 'emnt'],
            ['q', 'quar', 'qrt'],
            ['eq', 'equar', 'eqrt'],
            ['y', 'yr'],
            ['ey', 'eyr'],
            ['dec'],
            ['edec']
        ],
        parsers : {
            L   : 'MM/DD/YYYY',
            LT  : 'HH:mm A',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {
            const hasSpecialCase = ['11', '12', '13'].find((n) => number.endsWith(n));

            let suffix = 'th';

            if (!hasSpecialCase) {
                const lastDigit = number[number.length - 1];
                suffix = { 1 : 'st', 2 : 'nd', 3 : 'rd' }[lastDigit] || 'th';
            }

            return number + suffix;
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}s`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
