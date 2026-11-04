import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/EnGb.js';
import '../../Grid/localization/EnGb.js';

const locale = {

    localeName : 'EnGb',
    localeDesc : 'English (GB)',
    localeCode : 'en-GB',
    localeRtl  : false,

    Object : {
        newEvent    : 'New event',
        information : 'Information',
        showDetails : 'Show details'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' event' + (data !== 1 ? 's' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Toggle resource layout column. SPACE for context menu.'
    },

    Dependencies : {
        from    : 'From',
        to      : 'To',
        valid   : 'Valid',
        invalid : 'Invalid'
    },

    DependencyType : {
        SS           : 'SS',
        SF           : 'SF',
        FS           : 'FS',
        FF           : 'FF',
        StartToStart : 'Start-to-Start',
        StartToEnd   : 'Start-to-Finish',
        EndToStart   : 'Finish-to-Start',
        EndToEnd     : 'Finish-to-Finish',
        short        : [
            'SS',
            'SF',
            'FS',
            'FF'
        ],
        long : [
            'Start-to-Start',
            'Start-to-Finish',
            'Finish-to-Start',
            'Finish-to-Finish'
        ]
    },

    DependencyEdit : {
        From              : 'From',
        To                : 'To',
        Type              : 'Type',
        Lag               : 'Lag',
        color             : 'Colour',
        lineStyle         : 'Line style',
        solid             : 'Solid',
        dashed            : 'Dashed',
        dotted            : 'Dotted',
        dashDot           : 'Dash-dot',
        longDash          : 'Long dash',
        'Edit dependency' : 'Edit dependency',
        Save              : 'Save',
        Delete            : 'Delete',
        Cancel            : 'Cancel',
        StartToStart      : 'Start to Start',
        StartToEnd        : 'Start to Finish',
        EndToStart        : 'Finish to Start',
        EndToEnd          : 'Finish to Finish',
        Active            : 'Active'
    },

    EventEdit : {
        Name           : 'Name',
        Resource       : 'Resource',
        Start          : 'Start',
        startTime      : 'Start time',
        End            : 'End',
        endTime        : 'End time',
        Save           : 'Save',
        Delete         : 'Delete',
        Cancel         : 'Cancel',
        'Edit event'   : 'Edit event',
        Repeat         : 'Repeat',
        editRecurrence : 'Edit recurrence'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Event overlaps existing event for this resource',
        noDropOutsideTimeline   : 'Event may not be dropped completely outside the timeline',
        duplicateAssignmentDrag : 'Event cannot be assigned to the same resource multiple times'
    },

    SchedulerBase : {
        'Add event'      : 'Add event',
        'Delete event'   : 'Delete event',
        'Unassign event' : 'Unassign event',
        color            : 'Colour',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, starts at ${startDate} ${eventRecord.duration > 0 ? `for ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zoom',
        activeDateRange : 'Date range',
        startText       : 'Start date',
        endText         : 'End date',
        todayText       : 'Today'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Time axis showing ${startDate} to ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Copy event',
        cutEvent   : 'Cut event',
        pasteEvent : 'Paste event'
    },

    EventFilter : {
        filterEvents : 'Filter tasks',
        byName       : 'By name'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Show current timeline'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Seconds'
        },
        minuteAndHour : {
            topDateFormat     : 'll, LST',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD/MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Day'
        },
        day : {
            name : 'Day/hours'
        },
        week : {
            name : 'Week/hours'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Week/days'
        },
        dayAndMonth : {
            name : 'Month'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Week'
        },
        weekAndMonth : {
            name : 'Weeks'
        },
        weekAndDayLetter : {
            name : 'Weeks/weekdays'
        },
        weekDateAndMonth : {
            name : 'Months/weeks'
        },
        monthAndYear : {
            name : 'Months'
        },
        year : {
            name : 'Years'
        },
        manyYears : {
            name : 'Multiple years'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'You are deleting an event',
        'delete-all-message'        : 'Do you want to delete all occurrences of this event?',
        'delete-further-message'    : 'Do you want to delete this and all future occurrences of this event or only the selected occurrence?',
        'delete-only-this-message'  : 'Do you want to delete this occurrence of this event?',
        'delete-further-btn-text'   : 'Delete All Future Events',
        'delete-only-this-btn-text' : 'Delete Only This Event',
        'update-title'              : 'You are changing a repeating event',
        'update-all-message'        : 'Do you want to change all occurrences of this event?',
        'update-further-message'    : 'Do you want to change only this occurrence of the event or this and all future occurrences?',
        'update-only-this-message'  : 'Do you want to change this occurrence of this event?',
        'update-further-btn-text'   : 'All Future Events',
        'update-only-this-btn-text' : 'Only This Event',
        Yes                         : 'Yes',
        Cancel                      : 'Cancel',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' and ',
        Daily                           : 'Daily',
        'Weekly on {1}'                 : ({ days }) => `Weekly on ${days}`,
        'Monthly on {1}'                : ({ days }) => `Monthly on ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Yearly on ${days} of ${months}`,
        'Every {0} days'                : ({ interval }) => `Every ${interval} days`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Every ${interval} weeks on ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Every ${interval} months on ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Every ${interval} years on ${days} of ${months}`,
        position1                       : 'the first',
        position2                       : 'the second',
        position3                       : 'the third',
        position4                       : 'the fourth',
        position5                       : 'the fifth',
        'position-1'                    : 'the last',
        day                             : 'day',
        weekday                         : 'weekday',
        'weekend day'                   : 'weekend day',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Repeat event',
        Cancel              : 'Cancel',
        Save                : 'Save',
        Frequency           : 'Frequency',
        Every               : 'Every',
        DAILYintervalUnit   : 'day(s)',
        WEEKLYintervalUnit  : 'week(s)',
        MONTHLYintervalUnit : 'month(s)',
        YEARLYintervalUnit  : 'year(s)',
        Each                : 'Each',
        on                  : 'On',
        the                 : 'The',
        'On the'            : 'On the',
        'End repeat'        : 'End repeat',
        'time(s)'           : 'time(s)',
        Days                : 'Days',
        Months              : 'Months'
    },

    RecurrenceDaysCombo : {
        day           : 'day',
        weekday       : 'weekday',
        'weekend day' : 'weekend day'
    },

    RecurrencePositionsCombo : {
        position1    : 'first',
        position2    : 'second',
        position3    : 'third',
        position4    : 'fourth',
        position5    : 'fifth',
        'position-1' : 'last'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Never',
        After     : 'After',
        'On date' : 'On date'
    },

    RecurrenceFrequencyCombo : {
        None    : 'No repeat',
        Daily   : 'Daily',
        Weekly  : 'Weekly',
        Monthly : 'Monthly',
        Yearly  : 'Yearly'
    },

    RecurrenceCombo : {
        None   : 'None',
        Custom : 'Custom...'
    },

    Summary : {
        'Summary for' : date => `Summary for ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Complete schedule',
        currentview  : 'Visible schedule',
        daterange    : 'Date range',
        completedata : 'Complete schedule (for all events)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Schedule range',
        'Export from'    : 'From',
        'Export to'      : 'To'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Single page'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Single page (unscaled)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Multiple pages (vertical)'
    },

    ExcelExporter : {
        'No resource assigned' : 'No resource assigned'
    },

    CrudManagerView : {
        serverResponseLabel : 'Server response:'
    },

    DurationColumn : {
        Duration : 'Duration'
    },

    EventClusteringBase : {
        unnamed         : 'Unnamed',
        more            : count => `+ ${count} more`,
        clusteredEvents : count => `${count} clustered events`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} clustered ranges`
    },

    ConstraintTypePicker : {
        none                : 'None',
        assoonaspossible    : 'As soon as possible',
        aslateaspossible    : 'As late as possible',
        muststarton         : 'Must start on',
        mustfinishon        : 'Must finish on',
        startnoearlierthan  : 'Start no earlier than',
        startnolaterthan    : 'Start no later than',
        finishnoearlierthan : 'Finish no earlier than',
        finishnolaterthan   : 'Finish no later than'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} buffer time before the event`;
            }
            if (postamble) {
                description += `.${postamble.toString()} buffer time after the event`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Forwards',
        Backward      : 'Backwards',
        inheritedFrom : 'Inherited from',
        enforcedBy    : 'Enforced by'
    },

    CalendarField : {
        'Default calendar' : 'Default calendar',
        editCalendar       : 'Edit calendar'
    },

    TaskEditorBase : {
        Information   : 'Task information',
        Save          : 'Save',
        Cancel        : 'Cancel',
        Delete        : 'Delete',
        calculateMask : 'Calculating...',
        saveError     : "Can't save, please correct errors first",
        repeatingInfo : 'Viewing a repeating event',
        editRepeating : 'Edit'
    },

    TaskEdit : {
        editEvent              : 'Edit event',
        ConfirmDeletionTitle   : 'Confirm deletion',
        ConfirmDeletionMessage : 'Are you sure you want to delete the event?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '33em'
    },

    SchedulerGeneralTab : {
        General      : 'General',
        Name         : 'Name',
        Resources    : 'Resources',
        '% complete' : '% complete',
        Duration     : 'Duration',
        Start        : 'Start',
        Finish       : 'Finish',
        Effort       : 'Effort',
        Preamble     : 'Preamble',
        Postamble    : 'Postamble'
    },

    GeneralTab : {
        General      : 'General',
        Name         : 'Name',
        '% complete' : '% complete',
        Duration     : 'Duration',
        Start        : 'Start',
        Finish       : 'Finish',
        Effort       : 'Effort',
        Dates        : 'Dates'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Advanced',
        Calendar                   : 'Calendar',
        'Scheduling mode'          : 'Scheduling mode',
        'Effort driven'            : 'Effort driven',
        'Manually scheduled'       : 'Manually scheduled',
        'Constraint type'          : 'Constraint type',
        'Constraint date'          : 'Constraint date',
        Inactive                   : 'Inactive',
        'Ignore resource calendar' : 'Ignore resource calendar'
    },

    CalendarEditorDatePicker : {
        addException : 'Add exception',
        addWeek      : 'Add week'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Add exception',
        removeException : 'Remove exception',
        noRows          : 'No exceptions added'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Add week',
        removeWeek : 'Remove week'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Days are working by default',
        workingTimeCalendar        : 'Working time calendar',
        exceptions                 : 'Exceptions',
        general                    : 'General',
        name                       : 'Name',
        parent                     : 'Parent',
        save                       : 'Save',
        weeks                      : 'Weeks',
        error                      : 'Error',
        inputErrors                : 'There are input errors. Please fix them before saving your changes.',
        delete                     : 'Delete',
        addCalendar                : 'Add a calendar',
        confirmation               : 'Confirmation',
        removeCalendarWithChildren : 'The calendar has child calendars. Click "Yes" to remove the calendar with its children.',
        removeCalendarAndLinks     : 'The calendar is used by some records. Click "Yes" to unlink them and remove the calendar.',
        newException               : 'New exception',
        newWeek                    : 'New week'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' is working',
        isNotWorking : ' is not working',
        basedOn      : ' based on:',
        byDefault    : 'by default',
        rangeTpl     : (start, end) => `${start} to ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Working day',
        nonWorkingDay : 'Non-working day'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'There are overlapping ranges',
        errorMissingDate   : 'Start and end time are required',
        errorStartAfterEnd : 'Start time cannot be after the end time'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Name',
        from                                 : 'From',
        to                                   : 'To',
        is                                   : 'Is',
        nonWorking                           : 'Non-working',
        working                              : 'Working',
        hours                                : 'Hours',
        repeat                               : 'Repeat',
        repeatEnd                            : 'Repeat end',
        errorMissingDate                     : 'Exception date range is required',
        errorStartAfterEnd                   : '"From" date cannot be after the "To" date ',
        errorStartAndEndRepeatNumberMismatch : 'Exception should start and end the same number of times'
    },

    CalendarEditorWeekPanel : {
        name        : 'Name',
        from        : 'From',
        to          : 'To',
        days        : 'Days',
        copyDay     : 'Copy day',
        pasteDay    : 'Paste day',
        stopCopying : 'Stop copying'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Add range',
        removeRange : 'Remove range'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"From" date cannot be after the "To" date ',
        errorNoDefaultWeek           : 'Week configuration is required',
        errorMultipleDefaultWeeks    : 'More than one default week is specified',
        errorNoWeekAvailability      : 'Week must provide some working time',
        errorInvalidWeekAvailability : 'Week has working time configuration errors',
        noRows                       : 'No weeks added'
    },

    AdvancedTab : {
        Advanced                   : 'Advanced',
        Calendar                   : 'Calendar',
        'Scheduling mode'          : 'Scheduling mode',
        'Effort driven'            : 'Effort driven',
        'Manually scheduled'       : 'Manually scheduled',
        'Constraint type'          : 'Constraint type',
        'Constraint date'          : 'Constraint date',
        Constraint                 : 'Constraint',
        Rollup                     : 'Rollup',
        Inactive                   : 'Inactive',
        'Ignore resource calendar' : 'Ignore resource calendar',
        'Scheduling direction'     : 'Scheduling direction',
        projectBorder              : 'Project border',
        ignore                     : 'Ignore',
        honor                      : 'Honor',
        askUser                    : 'Ask user'
    },

    DependencyTab : {
        Predecessors      : 'Predecessors',
        Successors        : 'Successors',
        ID                : 'ID',
        Name              : 'Name',
        Type              : 'Type',
        Lag               : 'Lag',
        cyclicDependency  : 'Cyclic dependency',
        invalidDependency : 'Invalid dependency',
        readOnlyTask      : 'Cannot link a read-only task'
    },

    NotesTab : {
        Notes : 'Notes'
    },

    ResourceCalendarColumn : {
        calendar : 'Calendar'
    },

    ResourceEdit : {
        editResource : 'Edit resource'
    },

    ResourceEditor : {
        resourceInformation : 'Resource information',
        costs               : 'Costs',
        save                : 'Save',
        error               : 'Error',
        inputErrors         : 'There are input errors. Please fix them before saving your changes.',
        delete              : 'Delete',
        confirmation        : 'Confirmation',
        removeUsedResource  : 'The resource is assigned to some tasks. Click "Yes" to remove the resource anyway.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Calendar',
        general     : 'General',
        label       : 'Material label',
        name        : 'Resource name',
        type        : 'Type',
        costAccrual : 'Cost accrual',
        labelHint   : 'for example, kg, tons or boxes',
        maxUnits    : 'Max units'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Accrue at',
        prorated : 'Prorated',
        start    : 'Start',
        end      : 'End'
    },

    CostAccrualField : {
        prorated : 'Prorated',
        start    : 'Start',
        end      : 'End'
    },

    ResourceType : {
        work     : 'Work',
        material : 'Material',
        cost     : 'Cost'
    },

    ResourceTypeColumn : {
        type : 'Type'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Rate table',
        newGroup     : 'New table',
        removeGroup  : 'Remove table',
        useByDefault : 'Use by default for the resource assignments',
        noRates      : 'No rates'
    },

    ResourceGrid : {
        name          : 'Name',
        materialLabel : 'Material label',
        maxUnits      : 'Max units',
        cost          : 'Cost',
        noRows        : 'No resources'
    },

    ResourceRateTableContainer : {
        startDate    : 'Start date',
        standardRate : 'Standard rate',
        perUseCost   : 'Per use cost',
        addRate      : 'Add rate',
        removeRate   : 'Remove rate',
        name         : 'Name',
        noRates      : 'No rates'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Rate table information'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Quantity',
        Resources   : 'Resources',
        Resource    : 'Resource',
        Units       : 'Units',
        cost        : 'Cost',
        effort      : 'Effort',
        start       : 'Start',
        finish      : 'Finish',
        preamble    : 'Preamble',
        postamble   : 'Postamble'
    },

    RateTableColumn : {
        rateTable : 'Rate table'
    },

    RecurrenceTab : {
        title : 'Repeat'
    },

    SchedulingModePicker : {
        Normal           : 'Normal',
        'Fixed Duration' : 'Fixed Duration',
        'Fixed Units'    : 'Fixed Units',
        'Fixed Effort'   : 'Fixed Effort'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} of {available}</span> allocated',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} of {available}</span> allocated',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} of {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} of {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'On {startDate}<br><span class="{cls}">{allocated} of {available}</span> allocated:<br>{assignments}',
        plusMore              : '+{value} more'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Effort</div><div class="b-effort-value {cls}">{allocated} of {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Effort</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Cost</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Quantity</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} on {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Summary for {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Summary for {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} more',
        nameColumnText        : 'Resource / Event'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Cancel the change and do nothing',
        schedulingConflict : 'Scheduling conflict',
        emptyCalendar      : 'Calendar configuration error',
        cycle              : 'Scheduling cycle',
        Apply              : 'Apply'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Please select a dependency:',
        invalidDependencyLabel : 'There are invalid dependencies involved that need to be addressed:'
    },

    SchedulerProBase : {
        propagating     : 'Calculating project',
        storePopulation : 'Loading data',
        finalizing      : 'Finalising results'
    },

    EventSegments : {
        splitEvent    : 'Split event',
        renameSegment : 'Rename'
    },

    NestedEvents : {
        createGroup         : 'Group selected events',
        newGroupName        : 'New Group',
        deNestingNotAllowed : 'De-nesting not allowed',
        nestingNotAllowed   : 'Nesting not allowed'
    },

    VersionGrid : {
        compare       : 'Compare',
        description   : 'Description',
        occurredAt    : 'Occurred At',
        rename        : 'Rename',
        restore       : 'Restore',
        stopComparing : 'Stop Comparing'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'task',
            AssignmentModel : 'assignment',
            DependencyModel : 'link',
            ProjectModel    : 'project',
            ResourceModel   : 'resource',
            other           : 'object'
        },
        entityNamesPlural : {
            TaskModel       : 'tasks',
            AssignmentModel : 'assignments',
            DependencyModel : 'links',
            ProjectModel    : 'projects',
            ResourceModel   : 'resources',
            other           : 'objects'
        },
        transactionDescriptions : {
            update : 'Changed {n} {entities}',
            add    : 'Added {n} {entities}',
            remove : 'Removed {n} {entities}',
            move   : 'Moved {n} {entities}',
            mixed  : 'Changed {n} {entities}'
        },
        propertyNames : {
            active                   : 'Active',
            allDay                   : 'All day',
            allowOverlap             : 'Allow overlap',
            barMargin                : 'Bar margin',
            bidirectional            : 'Bidirectional',
            calendar                 : 'Calendar',
            cls                      : 'CSS class',
            constraintDate           : 'Constraint date',
            constraintType           : 'Constraint type',
            daysPerMonth             : 'Days per month',
            daysPerWeek              : 'Days per week',
            delayFromParent          : 'Delay from parent',
            direction                : 'Direction',
            drawDependencies         : 'Draw dependencies',
            duration                 : 'Duration',
            durationUnit             : 'Duration unit',
            effort                   : 'Effort',
            effortDriven             : 'Effort driven',
            effortUnit               : 'Effort unit',
            endDate                  : 'End date',
            eventColor               : 'Colour',
            eventId                  : 'Event ID',
            eventLayout              : 'Event layout',
            eventStyle               : 'Bar style',
            exceptionDates           : 'Exception dates',
            fixed                    : 'Fixed',
            from                     : 'From',
            fromSide                 : 'From side',
            hoursPerDay              : 'Hours per day',
            href                     : 'Link',
            iconCls                  : 'Icon',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignore resource calendar',
            ignoreTimeZone           : 'Ignore time zone',
            image                    : 'Image',
            imageUrl                 : 'Image URL',
            inactive                 : 'Inactive',
            intervals                : 'Intervals',
            lag                      : 'Lag',
            lagUnit                  : 'Lag unit',
            lineStyle                : 'Line style',
            manuallyScheduled        : 'Manually scheduled',
            milestoneWidth           : 'Milestone width',
            name                     : 'Name',
            note                     : 'Note',
            parentId                 : 'Parent ID',
            parentIndex              : 'Position',
            percentDone              : '% done',
            postamble                : 'Postamble',
            preamble                 : 'Preamble',
            readOnly                 : 'Read only',
            recurrenceRule           : 'Recurrence rule',
            resourceId               : 'Resource ID',
            resourceMargin           : 'Resource margin',
            rowHeight                : 'Row height',
            schedulingMode           : 'Scheduling mode',
            segments                 : 'Segments',
            showAvatar               : 'Show avatar',
            showInTimeline           : 'Show in timeline',
            startDate                : 'Start date',
            stickyContents           : 'Sticky contents',
            strokeColor              : 'Line colour',
            style                    : 'Style',
            target                   : 'Link target',
            to                       : 'To',
            toSide                   : 'To side',
            type                     : 'Type',
            units                    : 'Units',
            unscheduled              : 'Unscheduled',
            unspecifiedTimeIsWorking : 'Unspecified time is working',
            version                  : 'Version'
        },
        intervals : {
            working    : 'Working',
            nonWorking : 'Non-working',
            fromTo     : 'From {from} to {to}',
            recurring  : 'Recurring starting {start} ending {end}'
        },
        addEntity         : 'Added {type} **{name}**',
        removeEntity      : 'Removed {type} **{name}**',
        updateEntity      : 'Changed {type} **{name}**',
        moveEntity        : 'Moved {type} **{name}** from {from} to {to}',
        addDependency     : 'Added link from **{from}** to **{to}**',
        removeDependency  : 'Removed link from **{from}** to **{to}**',
        updateDependency  : 'Edited link from **{from}** to **{to}**',
        addAssignment     : 'Assigned **{resource}** to **{event}**',
        removeAssignment  : 'Removed assignment of **{resource}** from **{event}**',
        updateAssignment  : 'Edited assignment of **{resource}** to **{event}**',
        noChanges         : 'No changes',
        nullValue         : 'none',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Saved at {date}',
        autoSavedAt       : 'Auto-saved at {date}',
        undid             : 'Undid changes',
        redid             : 'Redid changes',
        editedTask        : 'Edited task properties',
        deletedTask       : 'Deleted a task',
        movedTask         : 'Moved a task',
        movedTasks        : 'Moved tasks'
    }
};

export default LocaleHelper.publishLocale(locale);
